const fs=require('fs'),path=require('path'),cp=require('child_process');

const fail=message=>{throw new Error(message)};
const read=file=>fs.readFileSync(file,'utf8');
const exists=file=>fs.existsSync(file);
const checkJs=file=>{
  if(!exists(file))fail('Falta '+file);
  const result=cp.spawnSync('node',['--check',file],{encoding:'utf8'});
  if(result.status!==0)fail(file+' no compila: '+(result.stderr||result.stdout));
};

const criticalJs=[
  'app.js','profiles-v3.js','settings-v2.js','exact-home-controller-v1.js',
  'members-roster-v1.js','members-management-v1.js','voice.js',
  'cloud/config.js','cloud/bootstrap.js','cloud/data-service.js',
  'cloud/ministry-service.js','cloud/diagnostics.js','sw.js'
];
criticalJs.forEach(checkJs);

const html=read('index.html');
const ids=[...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(match=>match[1]);
const duplicates=[...new Set(ids.filter((id,index)=>ids.indexOf(id)!==index))];
if(duplicates.length)fail('IDs HTML duplicados: '+duplicates.join(', '));

const requiredIds=[
  'home','listing','detail','calendarView','setlistView','academyView','academyFocus',
  'myRouteView','ministryOverviewView','profileModal','profileMusicModal','settingsView','settingsCloudStatusBtn',
  'personalSongNotesPanel','eventAssignmentsPanel','academyPractice','practiceModal','goalModal'
];
for(const id of requiredIds)if(!ids.includes(id))fail('Falta el ID principal #'+id+' en index.html');

const localScripts=[...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/gi)]
  .map(match=>match[1].split(/[?#]/)[0].replace(/^\.\//,''))
  .filter(src=>src&&!/^https?:\/\//i.test(src));
for(const file of localScripts)if(!exists(file))fail('index.html carga un script inexistente: '+file);

const sw=read('sw.js');
const cacheMatches=[...sw.matchAll(/const CACHE\s*=\s*(['"])([^'"]+)\1\s*;/g)];
if(cacheMatches.length!==1)fail('sw.js debe declarar exactamente un const CACHE.');
const requiredPrecache=[
  'index.html','styles.css','app.js','profiles-v3.js','settings-v2.js',
  'exact-home-controller-v1.js','songs.js','hymns.js','song-seo-v1.js','voice.js'
];
for(const file of requiredPrecache){
  if(!sw.includes("'./"+file+"'")&&!sw.includes('"./'+file+'"'))fail(file+' no está en el precache principal.');
}

const app=read('app.js');
const expectedTracks=[
  'voice-foundations-v1','voice-advanced-v1',
  'piano-foundations-v1','piano-intermediate-v1',
  'guitar-foundations-v1','guitar-intermediate-v1',
  'bass-foundations-v1','bass-intermediate-v1',
  'drums-foundations-v1','drums-intermediate-v1'
];
for(const track of expectedTracks){
  const needle="id:'"+track+"'";
  const count=app.split(needle).length-1;
  if(count!==1)fail('Track '+track+': se esperaba 1 definición y aparecieron '+count+'.');
}
const lessonPrefixes=[
  'voice-foundations','piano-foundations','piano-intermediate',
  'guitar-foundations','guitar-intermediate','bass-foundations',
  'bass-intermediate','drums-foundations','drums-intermediate'
];
const allLessonIds=[];
for(const prefix of lessonPrefixes){
  const pattern=new RegExp("id:'("+prefix+"-0[1-8]-[^']+)'",'g');
  const found=[...app.matchAll(pattern)].map(match=>match[1]);
  if(found.length!==8)fail(prefix+': se esperaban 8 lecciones y aparecieron '+found.length+'.');
  allLessonIds.push(...found);
}
if(new Set(allLessonIds).size!==allLessonIds.length)fail('Hay IDs de lecciones de Academia duplicados.');

for(const token of [
  'function syncLearningTrack(trackId',
  'function renderAcademyFocus()',
  'function showMyRoute()',
  'function syncSetlistPreparation(eventId)',
  'function renderPersonalSongNotes(songId'
])if(!app.includes(token))fail('Falta integración principal: '+token);

const ministryService=read('cloud/ministry-service.js');
for(const token of ['updateMyRosterMusic','getMyRosterProfile','updateRosterMemberAdmin']){
  if(!ministryService.includes(token))fail('Falta método de ministerio: '+token);
}
const dataService=read('cloud/data-service.js');
for(const token of ['getLearningProgress','setLearningItemCompleted','getPersonalSongNote','savePersonalSongNote','saveEventAssignments','respondToEvent','getPracticeSessions','savePracticeSession','deletePracticeSession','getLearningGoals','saveLearningGoal','deleteLearningGoal']){
  if(!dataService.includes(token))fail('Falta método cloud: '+token);
}
const repertoireBlock=dataService.slice(dataService.indexOf('async getRepertoire(){'),dataService.indexOf('async addToRepertoire('));
if(/eventIds|assignmentsByEvent|ministry_event_responses/.test(repertoireBlock))fail('getRepertoire no debe depender de datos de eventos.');
const eventsBlock=dataService.slice(dataService.indexOf('async getEvents(){'),dataService.indexOf('async saveEvent('));
for(const token of ['const eventIds=','ministry_event_assignments','ministry_event_responses','responseStatus']){
  if(!eventsBlock.includes(token))fail('getEvents perdió integración de participación: '+token);
}

const migrationDir='supabase/migrations';
const migrations=fs.readdirSync(migrationDir).filter(name=>name.endsWith('.sql')).sort();
const numbered=migrations.map(name=>{
  const match=name.match(/^\d{8}_(\d{6})_/);
  if(!match)fail('Migración fuera del formato esperado: '+name);
  return{number:Number(match[1]),name};
});
for(let expected=1;expected<=16;expected++){
  const item=numbered.find(entry=>entry.number===expected);
  if(!item)fail('Falta la migración secuencial '+String(expected).padStart(6,'0')+'.');
}
if(numbered.some(entry=>entry.number>16))fail('Hay migraciones nuevas: actualiza lagrey-core-validate.js para incluirlas explícitamente.');

const activation=read('cloud/ACTIVATION.md');
for(const item of numbered)if(!activation.includes(item.name))fail('cloud/ACTIVATION.md no referencia '+item.name);

const selfMusic=read(path.join(migrationDir,'20260924_000013_self_music_profile.sql'));
for(const token of ['update_my_roster_music','user_id=auth.uid()','music_roles=clean_roles','preferred_instrument=new_preferred_instrument']){
  if(!selfMusic.includes(token))fail('La migración de perfil musical propio perdió la garantía: '+token);
}
if(selfMusic.includes('cloud_role='))fail('La migración de perfil musical propio no debe modificar cloud_role.');

const assignments=read(path.join(migrationDir,'20260924_000012_event_member_assignments.sql'));
for(const token of ['enable row level security','public.is_ministry_member','set_ministry_event_assignments']){
  if(!assignments.includes(token))fail('La migración de asignaciones perdió la garantía: '+token);
}

const participation=read(path.join(migrationDir,'20260924_000014_event_participation_response.sql'));
for(const token of ['respond_to_ministry_event','You are not assigned to this event','user_id=auth.uid()','enable row level security']){
  if(!participation.includes(token))fail('La migración de respuesta de participación perdió la garantía: '+token);
}

const practice=read(path.join(migrationDir,'20260924_000015_user_practice_sessions.sql'));
for(const token of ['user_practice_sessions','user_id=auth.uid()','enable row level security','duration_minutes between 1 and 720']){
  if(!practice.includes(token))fail('La migración de práctica perdió la garantía: '+token);
}

const goals=read(path.join(migrationDir,'20260924_000016_user_learning_goals.sql'));
for(const token of ['user_learning_goals','user_id=auth.uid()','enable row level security',"status in ('active','completed','archived')"]){
  if(!goals.includes(token))fail('La migración de objetivos perdió la garantía: '+token);
}

console.log(
  'La Grey core válido. '+
  'HTML IDs: '+ids.length+' únicos. '+
  'Academia: '+expectedTracks.length+' tracks principales, '+allLessonIds.length+' lecciones genéricas. '+
  'Migraciones: '+numbered.length+' verificadas (000001-000016). '+
  'Cache: '+cacheMatches[0][2]+'.'
);
