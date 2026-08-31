const fs=require('fs'),vm=require('vm'),cp=require('child_process'),path=require('path');
const fail=m=>{throw new Error(m)}, sh=(cmd,args)=>cp.execFileSync(cmd,args,{encoding:'utf8'});
const repo=process.env.GITHUB_REPOSITORY, owner=repo.split('/')[0], num=process.env.ISSUE_NUMBER;
if(!repo||!num) fail('Falta contexto de GitHub.');
const issue=JSON.parse(sh('gh',['api',`repos/${repo}/issues/${num}`]));
if(issue.user.login!==owner) fail('Solo el dueño del repo puede solicitar cantos.');
const meta={}; for(const line of String(issue.body||'').replace(/\r\n/g,'\n').split('\n')){
  if(!line.trim()||line==='LAGREY_SONG_V2') continue;
  const i=line.indexOf(':'); if(i<1) fail(`Cabecera inválida: ${line}`);
  meta[line.slice(0,i).trim()]=line.slice(i+1).trim();
}
const title=meta.title||'', artist=meta.artist||'', tone=meta.tone||'';
const total=Number(meta.chunks), dry=String(meta.dry_run||'false').toLowerCase()==='true';
if(!title||!artist||!tone||!Number.isInteger(total)||total<1||total>100) fail('Metadatos inválidos.');
let bpm=null; if(meta.bpm){bpm=Number(meta.bpm); if(!Number.isInteger(bpm)||bpm<1||bpm>400) fail('BPM inválido.');}
const comments=JSON.parse(sh('gh',['api','--paginate',`repos/${repo}/issues/${num}/comments`]));
const parts=new Map();
for(const c of comments){
  if(c.user?.login!==owner) continue;
  const m=String(c.body||'').replace(/\r\n/g,'\n').match(/^LAGREY_CHUNK\s+(\d+)\/(\d+)\n([\s\S]*)$/);
  if(!m) continue;
  const i=Number(m[1]), n=Number(m[2]); if(n!==total||i<1||i>total) fail('Numeración de chunks inválida.');
  if(parts.has(i)) fail(`Chunk duplicado: ${i}`); parts.set(i,m[3]);
}
if(parts.size!==total) fail(`Chunks incompletos: ${parts.size}/${total}.`);
let content=''; for(let i=1;i<=total;i++){ if(!parts.has(i)) fail(`Falta chunk ${i}.`); content+=parts.get(i); }
if(!content) fail('Contenido vacío.');
const parse=src=>{const s={window:{}};vm.createContext(s);new vm.Script(src).runInContext(s,{timeout:1000});if(!Array.isArray(s.window.LAGREY_SONGS_V2))fail('songs-v2.js inválido.');return s.window.LAGREY_SONGS_V2};
const old=fs.readFileSync('songs-v2.js','utf8');
if(!old.startsWith('window.LAGREY_SONGS_V2 = [')||!old.trimEnd().endsWith('];')) fail('songs-v2.js no es canónico.');
const before=parse(old); if(before.some(x=>x?.title===title&&x?.artist===artist)) fail('Canto duplicado.');
const ids=before.map(x=>Number(x.id)); if(ids.some(x=>!Number.isInteger(x))) fail('IDs inválidos.');
const id=Math.max(...ids,0)+1;
const lines=['  {',`    "id": ${id},`,`    "title": ${JSON.stringify(title)},`,`    "artist": ${JSON.stringify(artist)},`,'    "type": "cantos",',`    "tone": ${JSON.stringify(tone)},`,...(bpm===null?[]:[`    "bpm": ${bpm},`]),`    "content": ${JSON.stringify(content)}`,'  }'];
const m=/\n\];\s*$/.exec(old); if(!m) fail('No se encontró cierre final.');
const next=old.slice(0,m.index)+',\n'+lines.join('\n')+old.slice(m.index);
const after=parse(next); if(after.length!==before.length+1) fail('Conteo incorrecto.');
for(const x of ids) if(!after.some(s=>Number(s.id)===x)) fail(`Desapareció ID ${x}.`);
const ins=after.find(s=>Number(s.id)===id);
if(!ins||ins.title!==title||ins.artist!==artist||ins.tone!==tone||ins.content!==content||(bpm!==null&&ins.bpm!==bpm)) fail('Inserción no coincide.');
const oldSize=Buffer.byteLength(old), newSize=Buffer.byteLength(next); if(newSize<=oldSize) fail('Tamaño inválido.');
const tmp=path.join(process.env.RUNNER_TEMP,'songs-v2.candidate.js');fs.writeFileSync(tmp,next);if(cp.spawnSync('node',['--check',tmp]).status!==0)fail('songs-v2.js candidato no compila.');
const sw=fs.readFileSync('sw.js','utf8'), re=/const CACHE\s*=\s*(['"])([^'"]+)\1\s*;/, cm=sw.match(re); if(!cm) fail('CACHE no encontrado.');
const vmch=cm[2].match(/^la-grey-v3-(\d+)(?:-|$)/); if(!vmch) fail('CACHE fuera de formato.');
const slug=title.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,48)||`song-${id}`;
const cache=`la-grey-v3-${Number(vmch[1])+1}-song-${slug}`, sw2=sw.replace(re,`const CACHE='${cache}';`);
const tmp2=path.join(process.env.RUNNER_TEMP,'sw.candidate.js');fs.writeFileSync(tmp2,sw2);if(cp.spawnSync('node',['--check',tmp2]).status!==0)fail('sw.js candidato no compila.');
fs.writeFileSync(path.join(process.env.RUNNER_TEMP,'lagrey-result.txt'),`ID ${id} | ${title} — ${artist} | ${oldSize} -> ${newSize} bytes | CACHE ${cm[2]} -> ${cache}\n`);
fs.writeFileSync(path.join(process.env.RUNNER_TEMP,'lagrey-message.txt'),`Agregar canto ${title} de ${artist} a Cantos 2\n`);
if(!dry){fs.writeFileSync('songs-v2.js',next);fs.writeFileSync('sw.js',sw2);}
fs.appendFileSync(process.env.GITHUB_ENV,`LAGREY_DRY_RUN=${dry?'true':'false'}\n`);
console.log(`OK ${before.length}->${after.length} dry_run=${dry}`);
