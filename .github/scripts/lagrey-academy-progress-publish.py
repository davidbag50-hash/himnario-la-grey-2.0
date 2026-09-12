#!/usr/bin/env python3
from pathlib import Path

ROOT=Path(__file__).resolve().parents[2]
VOICE=ROOT/'voice.js'
CSS=ROOT/'voice.css'
SW=ROOT/'sw.js'

voice=VOICE.read_text(encoding='utf-8')
css=CSS.read_text(encoding='utf-8')
sw=SW.read_text(encoding='utf-8')

marker="const academyVideos={"
if marker not in voice:
    raise SystemExit('academyVideos no encontrado')

insert_after="};\nlet ctx=null,stopToken=0,routineState=null,activeVoicePanel=null,academySceneTimer=0;"
progress_block="""};
const ACADEMY_PROGRESS_KEY='lagrey_academy_voice_progress_v1';
function loadAcademyProgress(){try{const raw=JSON.parse(localStorage.getItem(ACADEMY_PROGRESS_KEY)||'{}');return{completed:Array.isArray(raw.completed)?raw.completed:[],lastOpened:raw.lastOpened||null}}catch{return{completed:[],lastOpened:null}}}
function saveAcademyProgress(data){localStorage.setItem(ACADEMY_PROGRESS_KEY,JSON.stringify({completed:[...new Set(data.completed||[])],lastOpened:data.lastOpened||null}))}
function academyIsComplete(id){return loadAcademyProgress().completed.includes(id)}
function academyProgressCount(){return academyLessons.filter(l=>academyIsComplete(l.id)).length}
function academyProgressHtml(){const done=academyProgressCount(),pct=Math.round(done/academyLessons.length*100);return `<div class=\"academy-progress-card\"><div class=\"academy-progress-copy\"><b>${vtx('Tu progreso','Your progress')}</b><span>${done}/${academyLessons.length} ${vtx('clases completadas','lessons completed')}</span></div><div class=\"academy-progress-track\"><span style=\"width:${pct}%\"></span></div><strong>${pct}%</strong></div>`}
function rememberAcademyOpen(id){const p=loadAcademyProgress();p.lastOpened=id;saveAcademyProgress(p)}
function toggleAcademyComplete(id){const p=loadAcademyProgress(),set=new Set(p.completed);if(set.has(id))set.delete(id);else set.add(id);p.completed=[...set];p.lastOpened=id;saveAcademyProgress(p);translateVoiceShell();renderAcademyLesson(id,false)}
let ctx=null,stopToken=0,routineState=null,activeVoicePanel=null,academySceneTimer=0;"""
if insert_after not in voice:
    raise SystemExit('Punto de inserción de progreso no encontrado')
voice=voice.replace(insert_after,progress_block,1)

old_card="function academyCardHtml(l,i){return `<button class=\"voice-academy-card\" data-academy-lesson=\"${l.id}\"><span class=\"voice-academy-number\">${String(i+1).padStart(2,'0')}</span><span class=\"voice-academy-icon\">${l.icon}</span><b>${localText(l.title)}</b><small>${localText(l.objective)}</small><em>${l.minutes}</em></button>`}"
new_card="function academyCardHtml(l,i){const done=academyIsComplete(l.id);return `<button class=\"voice-academy-card${done?' completed':''}\" data-academy-lesson=\"${l.id}\"><span class=\"voice-academy-number\">${done?'✓':String(i+1).padStart(2,'0')}</span><span class=\"voice-academy-icon\">${l.icon}</span><b>${localText(l.title)}</b><small>${localText(l.objective)}</small><em>${done?vtx('Completada','Completed'):l.minutes}</em></button>`}"
if old_card not in voice:
    raise SystemExit('academyCardHtml no encontrado')
voice=voice.replace(old_card,new_card,1)

old_translate="const at=v.querySelector('[data-academy-title]'),ai=v.querySelector('[data-academy-intro]');if(at)at.textContent=vtx('🎓 Academia La Grey · Voz avanzada','🎓 La Grey Academy · Advanced voice');if(ai)ai.textContent=vtx('8 clases para llevar la técnica vocal al ensayo, el culto, las armonías y el repertorio real.','8 lessons that bring vocal technique into rehearsals, services, harmony and real repertoire.');const grid=v.querySelector('[data-academy-grid]');if(grid)grid.innerHTML=academyLessons.map(academyCardHtml).join('');"
new_translate="const at=v.querySelector('[data-academy-title]'),ai=v.querySelector('[data-academy-intro]');if(at)at.textContent=vtx('🎓 Academia La Grey · Voz avanzada','🎓 La Grey Academy · Advanced voice');if(ai)ai.textContent=vtx('8 clases para llevar la técnica vocal al ensayo, el culto, las armonías y el repertorio real.','8 lessons that bring vocal technique into rehearsals, services, harmony and real repertoire.');const prog=v.querySelector('[data-academy-progress]');if(prog)prog.innerHTML=academyProgressHtml();const grid=v.querySelector('[data-academy-grid]');if(grid)grid.innerHTML=academyLessons.map(academyCardHtml).join('');"
if old_translate not in voice:
    raise SystemExit('Bloque translateVoiceShell no encontrado')
voice=voice.replace(old_translate,new_translate,1)

old_build="<p class=\"voice-academy-intro\" data-academy-intro>8 clases para llevar la técnica vocal al ensayo, el culto, las armonías y el repertorio real.</p><div class=\"voice-academy-grid\" data-academy-grid>"
new_build="<p class=\"voice-academy-intro\" data-academy-intro>8 clases para llevar la técnica vocal al ensayo, el culto, las armonías y el repertorio real.</p><div data-academy-progress>${academyProgressHtml()}</div><div class=\"voice-academy-grid\" data-academy-grid>"
if old_build not in voice:
    raise SystemExit('Bloque build de Academia no encontrado')
voice=voice.replace(old_build,new_build,1)

old_render="function renderAcademyLesson(id,scroll=true){const l=academyLesson(id),p=$('#voicePanel');if(!l||!p)return;stopPlayback();activeVoicePanel={type:'academy',id};"
new_render="function renderAcademyLesson(id,scroll=true){const l=academyLesson(id),p=$('#voicePanel');if(!l||!p)return;stopPlayback();rememberAcademyOpen(id);activeVoicePanel={type:'academy',id};"
if old_render not in voice:
    raise SystemExit('Inicio renderAcademyLesson no encontrado')
voice=voice.replace(old_render,new_render,1)

old_buttons="<div class=\"voice-play-row\"><button class=\"btn primary\" data-academy-practice=\"${l.target.type}:${l.target.id}\">🎹 ${vtx('Practicar en','Practice in')} ${targetLabel}</button>${index>0?`<button class=\"btn\" data-academy-prev=\"${academyLessons[index-1].id}\">← ${vtx('Clase anterior','Previous lesson')}</button>`:''}${index<academyLessons.length-1?`<button class=\"btn\" data-academy-next=\"${academyLessons[index+1].id}\">${vtx('Siguiente clase','Next lesson')} →</button>`:''}</div>"
new_buttons="<div class=\"voice-play-row\"><button class=\"btn ${academyIsComplete(id)?'academy-complete-on':'primary'}\" data-academy-complete=\"${id}\">${academyIsComplete(id)?'✓ '+vtx('Clase completada','Lesson completed'):'○ '+vtx('Marcar como completada','Mark as completed')}</button><button class=\"btn primary\" data-academy-practice=\"${l.target.type}:${l.target.id}\">🎹 ${vtx('Practicar en','Practice in')} ${targetLabel}</button>${index>0?`<button class=\"btn\" data-academy-prev=\"${academyLessons[index-1].id}\">← ${vtx('Clase anterior','Previous lesson')}</button>`:''}${index<academyLessons.length-1?`<button class=\"btn\" data-academy-next=\"${academyLessons[index+1].id}\">${vtx('Siguiente clase','Next lesson')} →</button>`:''}</div>"
if old_buttons not in voice:
    raise SystemExit('Botonera de Academia no encontrada')
voice=voice.replace(old_buttons,new_buttons,1)

old_capture="const lesson=ev.target.closest('[data-academy-lesson]');if(lesson){ev.preventDefault();renderAcademyLesson(lesson.dataset.academyLesson);return}const ap=ev.target.closest('[data-academy-play]');"
new_capture="const lesson=ev.target.closest('[data-academy-lesson]');if(lesson){ev.preventDefault();renderAcademyLesson(lesson.dataset.academyLesson);return}const complete=ev.target.closest('[data-academy-complete]');if(complete){ev.preventDefault();toggleAcademyComplete(complete.dataset.academyComplete);return}const ap=ev.target.closest('[data-academy-play]');"
if old_capture not in voice:
    raise SystemExit('onCapture Academy no encontrado')
voice=voice.replace(old_capture,new_capture,1)

VOICE.write_text(voice,encoding='utf-8')

css += ".academy-progress-card{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px 12px;align-items:center;padding:13px 14px;margin:8px 0 14px;border-radius:14px;border:1px solid rgba(242,194,78,.2);background:rgba(216,165,45,.06)}.academy-progress-copy{display:flex;justify-content:space-between;gap:10px;grid-column:1/-1}.academy-progress-copy b{color:#fff}.academy-progress-copy span{color:#cfe8f7;font-size:12px}.academy-progress-track{height:9px;border-radius:999px;background:rgba(255,255,255,.09);overflow:hidden}.academy-progress-track span{display:block;height:100%;background:#f2c24e;transition:width .25s ease}.academy-progress-card strong{color:#f2c24e;font-size:13px}.voice-academy-card.completed{border-color:rgba(92,214,154,.4);background:linear-gradient(145deg,rgba(92,214,154,.09),rgba(13,114,216,.07))}.voice-academy-card.completed .voice-academy-number{background:rgba(92,214,154,.14);color:#7ee0ad}.voice-academy-card.completed em{color:#7ee0ad}.academy-complete-on{border-color:rgba(92,214,154,.45)!important;color:#7ee0ad!important}@media(max-width:520px){.academy-progress-copy{display:grid;gap:3px}}"
CSS.write_text(css,encoding='utf-8')

old_cache="const CACHE='la-grey-v3-199-academy-ai-audio';"
new_cache="const CACHE='la-grey-v3-200-academy-progress';"
if old_cache not in sw:
    raise SystemExit('Cache v199 no encontrado')
sw=sw.replace(old_cache,new_cache,1)
SW.write_text(sw,encoding='utf-8')

print('Progreso local de Academia integrado directamente en voice.js; cache v200.')
