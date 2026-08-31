const fs=require('fs'),vm=require('vm'),cp=require('child_process');
const fail=m=>{throw new Error(m)};
const check=f=>{if(!fs.existsSync(f))fail(`Falta ${f}.`);const r=cp.spawnSync('node',['--check',f],{encoding:'utf8'});if(r.status!==0)fail(`${f} no compila: ${r.stderr||r.stdout}`)};
const cleanSrc=s=>String(s||'').split(/[?#]/)[0].replace(/^\.\//,'');
check('songs.js');
const html=fs.readFileSync('index.html','utf8');
const scripts=[...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/gi)].map(m=>cleanSrc(m[1]));
const hymnFiles=scripts.filter(s=>/^hymns(?:-\d{3}-\d{3})?\.js$/.test(s));
if(!hymnFiles.length||hymnFiles[0]!=='hymns.js')fail('index.html no carga hymns.js como primer bloque de himnos.');
if(new Set(hymnFiles).size!==hymnFiles.length)fail('index.html contiene bloques de himnos duplicados.');
const diskHymns=fs.readdirSync('.').filter(f=>/^hymns(?:-\d{3}-\d{3})?\.js$/.test(f)).sort();
const indexed=[...hymnFiles].sort();
if(JSON.stringify(diskHymns)!==JSON.stringify(indexed))fail(`Bloques de himnos en disco/index no coinciden. Disco=${diskHymns.join(',')} Index=${indexed.join(',')}`);
for(const f of hymnFiles)check(f);
const sw=fs.readFileSync('sw.js','utf8');check('sw.js');
for(const f of ['songs.js',...hymnFiles]){
  const re=new RegExp(`['"]\\.\\/${f.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}['"]`);
  if(!re.test(sw))fail(`${f} no está en el precache de sw.js.`);
}
const sandbox={window:{}};vm.createContext(sandbox);
const run=f=>new vm.Script(fs.readFileSync(f,'utf8'),{filename:f}).runInContext(sandbox,{timeout:2000});
run('songs.js');for(const f of hymnFiles)run(f);
const catalog=sandbox.window.LAGREY_SONGS;
if(!Array.isArray(catalog))fail('window.LAGREY_SONGS no es un array tras cargar la biblioteca.');
const ids=catalog.map(x=>Number(x?.id));
if(ids.some(x=>!Number.isInteger(x)||x<=0)||new Set(ids).size!==ids.length)fail('La biblioteca contiene IDs inválidos o duplicados.');
for(const x of catalog){
  if(!x||!['cantos','himnos'].includes(x.type))fail(`Tipo inválido en ID ${x?.id}.`);
  for(const k of ['title','artist','tone','content'])if(typeof x[k]!=='string'||!x[k].trim())fail(`Campo ${k} vacío/inválido en ID ${x.id}.`);
}
const hymns=catalog.filter(x=>x.type==='himnos'),hreg=sandbox.window.LAGREY_HYMNS;
if(!Array.isArray(hreg))fail('window.LAGREY_HYMNS no es un array.');
const nums=hymns.map(x=>Number(x.bookNumber)).sort((a,b)=>a-b);
if(nums.some(x=>!Number.isInteger(x)||x<=0)||new Set(nums).size!==nums.length)fail('Hay números de himno inválidos o duplicados.');
for(let i=0;i<nums.length;i++)if(nums[i]!==i+1)fail(`La numeración de himnos tiene un salto: se esperaba ${i+1} y apareció ${nums[i]}.`);
for(const h of hymns)if(Number(h.id)!==1000+Number(h.bookNumber))fail(`ID del himno ${h.bookNumber} no coincide con 1000+bookNumber.`);
const regIds=hreg.map(x=>Number(x?.id)).sort((a,b)=>a-b),catIds=hymns.map(x=>Number(x.id)).sort((a,b)=>a-b);
if(JSON.stringify(regIds)!==JSON.stringify(catIds))fail('window.LAGREY_HYMNS y los himnos de LAGREY_SONGS no coinciden.');
const songs=catalog.filter(x=>x.type==='cantos');if(songs.some(x=>Number(x.id)>=1000))fail('Un canto usa el rango reservado de IDs de himnos.');
console.log(`Biblioteca válida: ${songs.length} cantos, ${hymns.length} himnos, ${hymnFiles.length} bloques de himnos.`);
