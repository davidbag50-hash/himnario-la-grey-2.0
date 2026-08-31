const fs=require('fs'),vm=require('vm'),cp=require('child_process'),path=require('path'),crypto=require('crypto');
const fail=m=>{throw new Error(m)},sh=(cmd,args)=>cp.execFileSync(cmd,args,{encoding:'utf8'}).trim(),escRe=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const repo=process.env.GITHUB_REPOSITORY,num=process.env.ISSUE_NUMBER,owner=String(repo||'').split('/')[0];
if(!repo||!num)fail('Falta contexto de GitHub.');
const issue=JSON.parse(sh('gh',['api',`repos/${repo}/issues/${num}`]));
if(issue.user?.login!==owner)fail('Solo el dueño del repositorio puede solicitar himnos.');
let body=String(issue.body||'').replace(/\r\n/g,'\n');
if(!body.startsWith('LAGREY_HYMN_V1\n'))fail('Formato inválido: se requiere LAGREY_HYMN_V1.');
const cm='\n---CONTENT---\n',em='\n---END---',p1=body.indexOf(cm),p2=body.lastIndexOf(em);
if(p1<0||p2<0||p2<=p1)fail('Solicitud incompleta: faltan CONTENT/END.');
if(body.slice(p2+em.length).trim())fail('Hay datos inesperados después de END.');
const header=body.slice('LAGREY_HYMN_V1\n'.length,p1),content=body.slice(p1+cm.length,p2);
const meta={};for(const raw of header.split('\n')){if(!raw.trim())continue;const i=raw.indexOf(':');if(i<1)fail(`Cabecera inválida: ${raw}`);const k=raw.slice(0,i).trim(),v=raw.slice(i+1).trim();if(k in meta)fail(`Campo duplicado: ${k}`);meta[k]=v}
const allowed=new Set(['title','artist','tone','content_sha256','dry_run']);for(const k of Object.keys(meta))if(!allowed.has(k))fail(`Campo no permitido: ${k}`);
const title=meta.title||'',artist=meta.artist||'',tone=meta.tone||'',dry=String(meta.dry_run||'false').toLowerCase()==='true';
if(!title||!artist||!tone||!content)fail('title, artist, tone y content son obligatorios.');
if(title.length>200||artist.length>250||tone.length>40)fail('Metadatos demasiado largos.');
if(content.length>50000)fail('Contenido demasiado largo para una solicitud segura.');
const reqHash=String(meta.content_sha256||'').toLowerCase();if(!/^[a-f0-9]{64}$/.test(reqHash))fail('content_sha256 es obligatorio y debe ser SHA-256 hexadecimal.');
const gotHash=crypto.createHash('sha256').update(content,'utf8').digest('hex');if(gotHash!==reqHash)fail('Checksum de contenido no coincide: la solicitud pudo truncarse o alterarse.');
cp.execFileSync('node',['.github/scripts/lagrey-library-validate.js'],{stdio:'inherit'});
const html=fs.readFileSync('index.html','utf8'),cleanSrc=s=>String(s||'').split(/[?#]/)[0].replace(/^\.\//,'');
const scripts=[...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/gi)].map(m=>cleanSrc(m[1]));
const hymnFiles=scripts.filter(s=>/^hymns(?:-\d{3}-\d{3})?\.js$/.test(s));
const sandbox={window:{}};vm.createContext(sandbox);
const run=f=>new vm.Script(fs.readFileSync(f,'utf8'),{filename:f}).runInContext(sandbox,{timeout:2000});
run('songs.js');for(const f of hymnFiles)run(f);
const hymns=(sandbox.window.LAGREY_SONGS||[]).filter(x=>x.type==='himnos');
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
if(hymns.some(x=>norm(x.title)===norm(title)&&norm(x.artist)===norm(artist)))fail('Ya existe un himno con el mismo título y autor/artista.');
const bookNumber=Math.max(0,...hymns.map(x=>Number(x.bookNumber)))+1,id=1000+bookNumber,start=Math.floor((bookNumber-1)/10)*10+1,end=start+9,pad=n=>String(n).padStart(3,'0');
const batch=`hymns-${pad(start)}-${pad(end)}.js`,exists=fs.existsSync(batch);
const obj=`{id:${id},bookNumber:${bookNumber},title:${JSON.stringify(title)},artist:${JSON.stringify(artist)},type:'himnos',tone:${JSON.stringify(tone)},content:${JSON.stringify(content)}}`;
let batch2,index2=html,sw=fs.readFileSync('sw.js','utf8'),sw2=sw,created=!exists;
if(exists){
  const old=fs.readFileSync(batch,'utf8'),cut=old.lastIndexOf('\n];\n');if(cut<0)fail(`${batch} no tiene cierre canónico.`);
  batch2=old.slice(0,cut)+',\n'+obj+old.slice(cut);
}else{
  batch2=`(()=>{\n'use strict';\nconst hymns=[\n${obj}\n];\nconst target=window.LAGREY_SONGS||(window.LAGREY_SONGS=[]);for(const h of hymns){if(!target.some(s=>s.id===h.id))target.push(h)}window.LAGREY_HYMNS=[...(window.LAGREY_HYMNS||[]),...hymns.filter(h=>!(window.LAGREY_HYMNS||[]).some(x=>x.id===h.id))];\n})();\n`;
  const last=hymnFiles[hymnFiles.length-1];if(!last)fail('No se encontró el último bloque de himnos en index.html.');
  const tagRe=new RegExp(`<script\\s+src=["']${escRe(last)}(?:\\?[^"']*)?["'][^>]*><\\/script>`,'g'),matches=[...html.matchAll(tagRe)];
  if(matches.length!==1)fail(`No se pudo localizar de forma única el script ${last} en index.html.`);
  const m=matches[0],pos=m.index+m[0].length,tag=`<script src="${batch}"></script>`;index2=html.slice(0,pos)+tag+html.slice(pos);
  if(index2.replace(tag,'')!==html)fail('index.html cambió fuera de la inserción del nuevo bloque.');
  const assetRe=new RegExp(`(['"])\\.\\/${escRe(last)}\\1`,'g'),am=[...sw2.matchAll(assetRe)];if(am.length!==1)fail(`No se encontró de forma única ${last} en el precache.`);
  const a=am[0],apos=a.index+a[0].length;sw2=sw2.slice(0,apos)+`,'./${batch}'`+sw2.slice(apos);
}
const cacheRe=/const CACHE\s*=\s*(['"])([^'"]+)\1\s*;/g,cms=[...sw2.matchAll(cacheRe)];if(cms.length!==1)fail('sw.js debe contener exactamente un const CACHE.');
const c=cms[0],ver=c[2].match(/^la-grey-v3-(\d+)(?:-|$)/);if(!ver)fail('CACHE fuera de formato.');
const slug=norm(title).replace(/ /g,'-').slice(0,48)||`hymn-${bookNumber}`,newCache=`la-grey-v3-${Number(ver[1])+1}-hymn-${bookNumber}-${slug}`,vstart=c.index+c[0].indexOf(c[2]);
sw2=sw2.slice(0,vstart)+newCache+sw2.slice(vstart+c[2].length);
const tmp=path.join(process.env.RUNNER_TEMP,'hymn-batch.candidate.js');fs.writeFileSync(tmp,batch2);if(cp.spawnSync('node',['--check',tmp],{encoding:'utf8'}).status!==0)fail(`${batch} candidato no compila.`);
const tmpSw=path.join(process.env.RUNNER_TEMP,'sw.candidate.js');fs.writeFileSync(tmpSw,sw2);if(cp.spawnSync('node',['--check',tmpSw],{encoding:'utf8'}).status!==0)fail('sw.js candidato no compila.');
const base=sh('git',['rev-parse','HEAD']),expected=[batch,'sw.js',...(created?['index.html']:[])].sort();
fs.writeFileSync(path.join(process.env.RUNNER_TEMP,'lagrey-base.txt'),base+'\n');fs.writeFileSync(path.join(process.env.RUNNER_TEMP,'lagrey-expected-files.txt'),expected.join('\n')+'\n');
fs.writeFileSync(path.join(process.env.RUNNER_TEMP,'lagrey-message.txt'),`Agregar himno ${bookNumber} ${title}\n`);
fs.writeFileSync(path.join(process.env.RUNNER_TEMP,'lagrey-result.txt'),`Himno ${bookNumber} | ID ${id} | ${title} — ${artist} | ${batch}${created?' (nuevo bloque)':''} | CACHE ${c[2]} -> ${newCache} | SHA256 ${gotHash}\n`);
fs.writeFileSync(batch,batch2);if(created)fs.writeFileSync('index.html',index2);fs.writeFileSync('sw.js',sw2);
cp.execFileSync('node',['.github/scripts/lagrey-library-validate.js'],{stdio:'inherit'});
if(dry){cp.execFileSync('git',['reset','--hard','HEAD'],{stdio:'inherit'});cp.execFileSync('git',['clean','-fd'],{stdio:'inherit'});}
else{
  let hashes='';for(const f of expected)hashes+=`${sh('git',['hash-object',f])}\t${f}\n`;fs.writeFileSync(path.join(process.env.RUNNER_TEMP,'lagrey-hashes.txt'),hashes);
}
fs.appendFileSync(process.env.GITHUB_ENV,`LAGREY_DRY_RUN=${dry?'true':'false'}\n`);console.log(`OK himno ${bookNumber} dry_run=${dry} archivo=${batch}`);
