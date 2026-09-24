const fs=require('fs'),path=require('path'),cp=require('child_process');
const fail=m=>{throw new Error(m)};
const root=process.cwd();
const read=f=>fs.readFileSync(f,'utf8');
const cleanSrc=s=>String(s||'').split(/[?#]/)[0].replace(/^\.\//,'');
const localSrc=s=>!/^([a-z]+:)?\/\//i.test(String(s||''))&&!/^data:/i.test(String(s||''));
const exists=f=>fs.existsSync(path.join(root,f));
const checkSyntax=f=>{
  if(!exists(f))fail(`Falta archivo activo: ${f}`);
  const r=cp.spawnSync(process.execPath,['--check',f],{encoding:'utf8'});
  if(r.status!==0)fail(`${f} no compila:\n${r.stderr||r.stdout}`);
};

const html=read('index.html');
const scriptSrc=[...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/gi)].map(m=>m[1]);
const localScripts=scriptSrc.filter(localSrc).map(cleanSrc);
if(new Set(localScripts).size!==localScripts.length){
  const dup=[...new Set(localScripts.filter((x,i,a)=>a.indexOf(x)!==i))];
  fail(`index.html carga scripts locales duplicados: ${dup.join(', ')}`);
}
for(const f of localScripts.filter(f=>f.endsWith('.js')))checkSyntax(f);

const loader='cloud/loader.js';
checkSyntax(loader);
const loaderSrc=read(loader);
const filesBlock=loaderSrc.match(/const FILES=\[([^\]]+)\]/s);
if(!filesBlock)fail('cloud/loader.js no contiene FILES canónico.');
const cloudFiles=[...filesBlock[1].matchAll(/['"]([^'"]+\.js)['"]/g)].map(m=>'cloud/'+m[1]);
const rootModules=[...loaderSrc.matchAll(/loadRoot\(['"]([^'"]+\.js)['"]\)/g)].map(m=>m[1]);
for(const f of [...cloudFiles,...rootModules])checkSyntax(f);

const runtimeScripts=[...localScripts.filter(f=>f.endsWith('.js')),...cloudFiles,...rootModules];
const runtimeUnique=[...new Set(runtimeScripts)];
const forbiddenRuntime=runtimeUnique.filter(f=>/(?:^|[-_/])(?:fix|patch)(?:[-_.\/]|$)/i.test(f));
if(forbiddenRuntime.length)fail(`Runtime contiene capas fix/patch prohibidas: ${forbiddenRuntime.join(', ')}`);

const staleFixFiles=fs.readdirSync('.').filter(f=>f.endsWith('.js')&&/(?:^|[-_])(?:fix|patch)(?:[-_.]|$)/i.test(f));
if(staleFixFiles.length)fail(`Quedan archivos fix/patch históricos en raíz: ${staleFixFiles.join(', ')}`);

const seoIndexCount=localScripts.filter(f=>f==='song-seo-v1.js').length;
const seoLoaderCount=rootModules.filter(f=>f==='song-seo-v1.js').length;
if(seoIndexCount!==1||seoLoaderCount!==0)fail(`song-seo-v1.js debe cargarse una vez desde index.html. index=${seoIndexCount}, loader=${seoLoaderCount}`);

const ids=[...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]);
const duplicateIds=[...new Set(ids.filter((id,i,a)=>a.indexOf(id)!==i))];
if(duplicateIds.length)fail(`index.html contiene IDs duplicados: ${duplicateIds.join(', ')}`);

const app=read('app.js');
const suspiciousSingleSelector=/\$\(\s*(['"])\[[^\n)]*?\1\s*\)\.forEach/g;
if(suspiciousSingleSelector.test(app))fail("app.js usa $('selector').forEach; para colecciones debe usarse $$().");

for(const [id,label] of [
  ['academyView','Academia'],
  ['myRouteView','Mi Ruta'],
  ['personalSongNotes','Notas personales'],
  ['eventAssignments','Asignaciones de eventos'],
  ['settingsCloudStatusBtn','Estado Cloud']
]){
  if(!ids.includes(id))fail(`Falta ID crítico ${id} (${label}) en index.html.`);
}
for(const fn of ['showAcademy','showMyRoute','renderPersonalSongNotes','renderEventAssignments']){
  if(!app.includes(`function ${fn}`))fail(`Falta función canónica ${fn} en app.js.`);
}

checkSyntax('sw.js');
const sw=read('sw.js');
const caches=[...sw.matchAll(/const CACHE\s*=\s*['"]([^'"]+)['"]/g)];
if(caches.length!==1)fail('sw.js debe tener exactamente un const CACHE.');
if(!/^la-grey-v3-\d+(?:-|$)/.test(caches[0][1]))fail(`CACHE inválido: ${caches[0][1]}`);
const requiredBlock=sw.match(/const REQUIRED_ASSETS=\[([^\]]+)\]/s);
if(!requiredBlock)fail('sw.js no contiene REQUIRED_ASSETS canónico.');
const required=[...requiredBlock[1].matchAll(/['"]\.\/([^'"]+)['"]/g)].map(m=>m[1]);
const startup=sw.match(/const STARTUP_COLLAGE=['"]\.\/([^'"]+)['"]/);
if(startup)required.push(startup[1]);
for(const f of [...new Set(required)]){
  if(!exists(f))fail(`Asset requerido por sw.js no existe: ${f}`);
}
for(const f of ['index.html','styles.css','songs.js','app.js'])if(!sw.includes(`'./${f}'`)&&!sw.includes(`"./${f}"`))fail(`${f} no está en REQUIRED_ASSETS de sw.js.`);

const migrations=fs.readdirSync('supabase/migrations').filter(f=>f.endsWith('.sql')).sort();
const numbered=migrations.map(f=>{
  const m=f.match(/_(\d{6})_/);
  if(!m)fail(`Migración sin secuencia canónica: ${f}`);
  return{file:f,n:Number(m[1])};
});
if(new Set(numbered.map(x=>x.n)).size!==numbered.length)fail('Hay números de migración duplicados.');
const sorted=[...numbered].sort((a,b)=>a.n-b.n);
for(let i=0;i<sorted.length;i++)if(sorted[i].n!==i+1)fail(`Secuencia de migraciones rota: se esperaba ${String(i+1).padStart(6,'0')} y apareció ${sorted[i].file}`);

const diagnostics=read('cloud/diagnostics.js');
checkSyntax('cloud/diagnostics.js');
for(const table of ['ministry_events','ministry_event_assignments','user_favorites','user_learning_progress','user_song_notes']){
  if(!diagnostics.includes(`table:'${table}'`))fail(`Diagnóstico Cloud no comprueba ${table}.`);
}

console.log([
  'La Grey app válida.',
  `Scripts index: ${localScripts.length}`,
  `Módulos Cloud: ${cloudFiles.length}`,
  `Módulos raíz dinámicos: ${rootModules.length}`,
  `Assets offline requeridos verificados: ${new Set(required).size}`,
  `Migraciones: ${migrations.length}`,
  `CACHE: ${caches[0][1]}`
].join('\n'));
