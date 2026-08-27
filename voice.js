(()=>{
'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const NOTE_NAMES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const LATIN={'C':'Do','C#':'Do#','D':'Re','D#':'Re#','E':'Mi','F':'Fa','F#':'Fa#','G':'Sol','G#':'Sol#','A':'La','A#':'La#','B':'Si'};
const categories=[
 {id:'warm',icon:'🔥',title:'Calentamiento',desc:'Despierta la voz de forma progresiva antes de cantar.'},
 {id:'breath',icon:'🌬️',title:'Respiración',desc:'Control del aire y coordinación entre respiración y sonido.'},
 {id:'resonance',icon:'🔊',title:'Resonancia',desc:'Humming, NG y sonidos cómodos para activar sensaciones de resonancia.'},
 {id:'pitch',icon:'🎯',title:'Afinación',desc:'Notas, intervalos y patrones para entrenar el oído y la precisión.'},
 {id:'range',icon:'↕️',title:'Rango vocal',desc:'Patrones ascendentes y descendentes para explorar la voz sin forzar.'},
 {id:'agility',icon:'⚡',title:'Agilidad',desc:'Escalas y cambios de nota para ganar coordinación y limpieza.'},
 {id:'diction',icon:'🗣️',title:'Dicción',desc:'Vocales y consonantes claras para que el texto se entienda al cantar.'},
 {id:'cool',icon:'🧊',title:'Enfriamiento',desc:'Vuelve suavemente a una emisión cómoda después de cantar.'}
];
const exercises={
 warm:[
  {name:'Trino de labios · 5 notas',pattern:[0,2,4,5,7,5,4,2,0],syllable:'Brrr',tip:'Labios sueltos, poco volumen y sensación cómoda.'},
  {name:'Sirena suave',pattern:[0,4,7,12,7,4,0],syllable:'UU',tip:'Desliza entre las notas sin empujar la zona aguda.'}
 ],
 breath:[
  {name:'Siseo controlado',timed:true,tip:'Inhala sin levantar los hombros y suelta un “sss” uniforme durante 8–12 segundos.'},
  {name:'Pulsos de aire',timed:true,tip:'Haz 8 pulsos suaves con “sh”, manteniendo estable el torso.'}
 ],
 resonance:[
  {name:'Humming de 5 notas',pattern:[0,2,4,5,7,5,4,2,0],syllable:'MMM',tip:'Busca vibración cómoda; no aprietes mandíbula ni garganta.'},
  {name:'NG → vocal',pattern:[0,2,4,2,0],syllable:'NG–A',tip:'Conserva la facilidad del NG al abrir hacia la vocal.'}
 ],
 pitch:[
  {name:'Tres notas',pattern:[0,2,4,2,0],syllable:'MA',tip:'Escucha primero el piano y después imita con precisión.'},
  {name:'Arpegio mayor',pattern:[0,4,7,12,7,4,0],syllable:'NO',tip:'Mantén cada salto limpio y evita arrastrarte entre notas.'}
 ],
 range:[
  {name:'Escala de octava',pattern:[0,2,4,5,7,9,11,12,11,9,7,5,4,2,0],syllable:'NU',tip:'Sube solo mientras siga cómodo. Rango no significa forzar.'},
  {name:'Arpegio extendido',pattern:[0,4,7,12,16,12,7,4,0],syllable:'GUG',tip:'Volumen moderado y salida inmediata si aparece tensión.'}
 ],
 agility:[
  {name:'Cinco notas rápidas',pattern:[0,2,4,5,7,5,4,2,0],syllable:'DA',tip:'Empieza lento; aumenta tempo únicamente cuando salga limpio.'},
  {name:'1–3–5–3–1',pattern:[0,4,7,4,0],syllable:'MI',tip:'Ataques ligeros y ritmo exacto.'}
 ],
 diction:[
  {name:'MA–ME–MI–MO–MU',pattern:[0,2,4,5,7,5,4,2,0],syllable:'MA ME MI MO MU',tip:'Articula sin endurecer labios ni mandíbula.'},
  {name:'DA–GA alternado',pattern:[0,2,4,2,0],syllable:'DA GA',tip:'Mantén clara la consonante sin golpear la garganta.'}
 ],
 cool:[
  {name:'Humming descendente',pattern:[7,5,4,2,0],syllable:'MMM',tip:'Muy suave; busca comodidad y no volumen.'},
  {name:'Descenso en U',pattern:[12,9,7,5,4,2,0],syllable:'UU',tip:'Deja que la voz descienda sin presionar.'}
 ]
};
const routines={
 quick:{title:'⚡ Calentamiento rápido · 5 min',steps:['Respiración tranquila','Trino de labios','Humming','Escala corta','Dicción ligera']},
 worship:{title:'🎤 Antes del culto · 10 min',steps:['Respiración','Resonancia','Afinación','Rango medio','Agilidad','Dicción']},
 full:{title:'🔥 Entrenamiento completo · 20 min',steps:['Respiración','Calentamiento','Resonancia','Afinación','Rango','Agilidad','Dicción','Enfriamiento']}
};
let ctx=null,stopToken=0;
function injectStyle(){if($('#voiceCss'))return;const l=document.createElement('link');l.id='voiceCss';l.rel='stylesheet';l.href='voice.css';document.head.appendChild(l)}
function build(){injectStyle();const homeGrid=$('#home .home-grid');if(homeGrid&&!homeGrid.querySelector('[data-open="voice"]')){const b=document.createElement('button');b.className='card';b.dataset.open='voice';b.innerHTML='<div class="icon">🎤✨</div><h2>Voz</h2><div class="muted">Calentamiento y entrenamiento vocal</div><div class="count">Rutinas + piano</div>';homeGrid.appendChild(b)}
 if($('#voiceView'))return;const s=document.createElement('section');s.id='voiceView';s.className='view hidden';s.innerHTML=`<button class="back" data-voice-home>← Volver</button><div class="voice-hero"><h1>🎤 Voz</h1><p>Calienta, entrena y prepara tu voz con ejercicios guiados y patrones de piano.</p></div><div class="voice-warning"><b>Cuida tu voz:</b> trabaja en una zona cómoda, sin dolor ni presión. Si aparece dolor, pérdida marcada de voz o molestia persistente, detén el ejercicio.</div><h2>Rutinas rápidas</h2><div class="voice-routines">${Object.entries(routines).map(([id,r])=>`<button class="voice-routine" data-routine="${id}"><b>${r.title}</b><br><small>${r.steps.join(' · ')}</small></button>`).join('')}</div><h2>Entrena por objetivo</h2><div class="voice-grid">${categories.map(c=>`<button class="voice-card" data-voice-cat="${c.id}"><span class="voice-icon">${c.icon}</span><b>${c.title}</b><small>${c.desc}</small></button>`).join('')}</div><div id="voicePanel" class="voice-panel hidden"></div>`;document.querySelector('main').appendChild(s)}
function showVoice(){build();$$('.view').forEach(v=>v.classList.add('hidden'));$('#voiceView').classList.remove('hidden');$$('nav button').forEach(b=>b.classList.remove('active'));window.scrollTo(0,0)}
function leaveVoice(){stopPlayback();$('#voiceView')?.classList.add('hidden')}
function goHome(){leaveVoice();$('#home')?.classList.remove('hidden');window.scrollTo(0,0)}
function renderCategory(id){const c=categories.find(x=>x.id===id),list=exercises[id]||[],p=$('#voicePanel');p.classList.remove('hidden');p.innerHTML=`<span class="voice-badge">${c.icon} ${c.title}</span><h2>${c.title}</h2><p>${c.desc}</p><div class="voice-exercise-list">${list.map((e,i)=>exerciseHtml(id,i,e)).join('')}</div>`;wireExercises();p.scrollIntoView({behavior:'smooth',block:'start'})}
function exerciseHtml(cat,i,e){if(e.timed)return `<article class="voice-exercise"><h3>${e.name}</h3><p>${e.tip}</p><div class="voice-play-row"><button class="btn" data-timer="${cat}:${i}">▶ 30 segundos</button></div><div class="voice-status" id="status-${cat}-${i}">Listo para comenzar.</div></article>`;return `<article class="voice-exercise"><h3>${e.name}</h3><div class="voice-pattern">${e.pattern.map(n=>n>=12?String(n-11)+'↑':String([1,2,3,4,5,6,7][Math.min(6,Math.round(n/2))]||1)).join(' – ')}</div><p><b>Sílaba:</b> ${e.syllable}</p><p>${e.tip}</p><div class="voice-controls"><label>Nota inicial<select data-start><option value="48">C3 · Do3</option><option value="50">D3 · Re3</option><option value="52">E3 · Mi3</option><option value="53">F3 · Fa3</option><option value="55">G3 · Sol3</option><option value="57">A3 · La3</option><option value="60" selected>C4 · Do4</option></select></label><label>Tempo<input data-tempo type="range" min="55" max="150" value="90"><span data-tempo-label>90 BPM</span></label><label>Repeticiones<select data-repeats><option>1</option><option selected>3</option><option>5</option><option>8</option></select></label><label>Transponer<select data-shift><option value="0">No mover</option><option value="1" selected>+½ tono</option><option value="-1">−½ tono</option></select></label></div><div class="voice-play-row"><button class="btn primary" data-play="${cat}:${i}">▶ Piano</button><button class="btn" data-stop>■ Detener</button></div><div class="voice-status" id="status-${cat}-${i}">Listo. Escucha el patrón y repítelo con comodidad.</div></article>`}
function wireExercises(){$$('#voicePanel [data-tempo]').forEach(r=>r.oninput=()=>r.parentElement.querySelector('[data-tempo-label]').textContent=r.value+' BPM');$$('#voicePanel [data-play]').forEach(b=>b.onclick=()=>playExercise(b));$$('#voicePanel [data-stop]').forEach(b=>b.onclick=stopPlayback);$$('#voicePanel [data-timer]').forEach(b=>b.onclick=()=>startTimer(b))}
function midiFreq(m){return 440*Math.pow(2,(m-69)/12)}
function noteLabel(m){const n=NOTE_NAMES[((m%12)+12)%12],o=Math.floor(m/12)-1;return `${LATIN[n]||n}${o}`}
function audio(){if(!ctx)ctx=new (window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume();return ctx}
function pianoNote(midi,when,dur=.32){const a=audio(),gain=a.createGain(),o1=a.createOscillator(),o2=a.createOscillator();o1.type='triangle';o2.type='sine';o1.frequency.value=midiFreq(midi);o2.frequency.value=midiFreq(midi)*2;gain.gain.setValueAtTime(.0001,when);gain.gain.exponentialRampToValueAtTime(.18,when+.015);gain.gain.exponentialRampToValueAtTime(.0001,when+dur);o1.connect(gain);o2.connect(gain);gain.connect(a.destination);o1.start(when);o2.start(when);o1.stop(when+dur+.03);o2.stop(when+dur+.03)}
async function playExercise(btn){stopPlayback();const token=++stopToken,key=btn.dataset.play,[cat,idx]=key.split(':'),e=exercises[cat][Number(idx)],box=btn.closest('.voice-exercise'),start=Number(box.querySelector('[data-start]').value),tempo=Number(box.querySelector('[data-tempo]').value),reps=Number(box.querySelector('[data-repeats]').value),shift=Number(box.querySelector('[data-shift]').value),beat=60/tempo,status=$(`#status-${cat}-${idx}`);audio();for(let r=0;r<reps;r++){if(token!==stopToken)return;const root=start+r*shift;status.textContent=`Repetición ${r+1}/${reps} · Inicio ${noteLabel(root)} · ${tempo} BPM`;let t=ctx.currentTime+.08;e.pattern.forEach(step=>{pianoNote(root+step,t,Math.max(.2,beat*.78));t+=beat});await wait(e.pattern.length*beat*1000+350);if(token!==stopToken)return}status.textContent='✅ Ejercicio terminado. Si estuvo cómodo, puedes repetirlo.'}
function wait(ms){return new Promise(r=>setTimeout(r,ms))}
function stopPlayback(){stopToken++;$$('.voice-status').forEach(s=>{if(s.textContent.includes('Repetición'))s.textContent='Detenido.'})}
function startTimer(btn){const [cat,idx]=btn.dataset.timer.split(':'),status=$(`#status-${cat}-${idx}`);stopPlayback();const token=++stopToken;let left=30;status.textContent=`⏱️ ${left} s · Mantén el ejercicio suave y estable.`;const id=setInterval(()=>{if(token!==stopToken){clearInterval(id);return}left--;status.textContent=left>0?`⏱️ ${left} s · Mantén el ejercicio suave y estable.`:'✅ Terminado. Respira normalmente.';if(left<=0)clearInterval(id)},1000)}
function showRoutine(id){const r=routines[id],p=$('#voicePanel');p.classList.remove('hidden');p.innerHTML=`<span class="voice-badge">Rutina guiada</span><h2>${r.title}</h2><p>Úsala como guía antes del ensayo o culto. Mantén todos los ejercicios en una zona cómoda.</p><div class="voice-exercise-list">${r.steps.map((x,i)=>`<div class="voice-exercise"><h3>${i+1}. ${x}</h3><p>${routineTip(x)}</p></div>`).join('')}</div><p class="voice-warning">Puedes entrar a las categorías de arriba para ejecutar los patrones de piano correspondientes.</p>`;p.scrollIntoView({behavior:'smooth',block:'start'})}
function routineTip(x){const k=x.toLowerCase();if(k.includes('resp'))return '30–60 s de respiración tranquila y salida de aire controlada.';if(k.includes('reson'))return 'Humming o NG suave, sin buscar volumen.';if(k.includes('afin'))return 'Patrones cortos, escuchando primero el piano.';if(k.includes('rango'))return 'Sube o baja cromáticamente solo mientras permanezca cómodo.';if(k.includes('agil'))return 'Cinco notas con ritmo claro; empieza más lento si hace falta.';if(k.includes('dic'))return 'Vocales y consonantes claras, mandíbula libre.';if(k.includes('enfr'))return 'Humming y descensos suaves para terminar.';return 'Ejercicio progresivo, volumen moderado y cero presión.'}
function onCapture(ev){const voice=ev.target.closest('[data-open="voice"]');if(voice){ev.preventDefault();ev.stopPropagation();showVoice();return}const back=ev.target.closest('[data-voice-home]');if(back){ev.preventDefault();ev.stopPropagation();goHome();return}const cat=ev.target.closest('[data-voice-cat]');if(cat){ev.preventDefault();renderCategory(cat.dataset.voiceCat);return}const routine=ev.target.closest('[data-routine]');if(routine){ev.preventDefault();showRoutine(routine.dataset.routine);return}if(!$('#voiceView')?.classList.contains('hidden')&&ev.target.closest('nav button,[data-home],[data-nav]'))leaveVoice()}
document.addEventListener('click',onCapture,true);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();