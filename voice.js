(()=>{
'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const NOTE_NAMES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const LATIN={'C':'Do','C#':'Do#','D':'Re','D#':'Re#','E':'Mi','F':'Fa','F#':'Fa#','G':'Sol','G#':'Sol#','A':'La','A#':'La#','B':'Si'};
const voiceLang=()=>localStorage.getItem('lagrey_language')==='en'?'en':'es',vtx=(es,en)=>voiceLang()==='en'?en:es;
const categories=[
{id:'warm',icon:'🔥',title:'Calentamiento',desc:'Despierta la voz de forma progresiva antes de cantar.'},
{id:'breath',icon:'🌬️',title:'Respiración',desc:'Controla el aire sin tensión y coordina respiración con sonido.'},
{id:'resonance',icon:'🔊',title:'Resonancia',desc:'Activa sensaciones de vibración con sonidos cómodos como MMM y NG.'},
{id:'pitch',icon:'🎯',title:'Afinación',desc:'Escucha, imita y estabiliza notas e intervalos.'},
{id:'range',icon:'↕️',title:'Rango vocal',desc:'Explora graves y agudos de forma gradual, nunca forzada.'},
{id:'agility',icon:'⚡',title:'Agilidad',desc:'Coordina cambios rápidos de nota con precisión y ligereza.'},
{id:'diction',icon:'🗣️',title:'Dicción',desc:'Aclara vocales y consonantes para que el texto se entienda al cantar.'},
{id:'cool',icon:'🧊',title:'Enfriamiento',desc:'Devuelve la voz a una emisión suave después de cantar.'}
];
const shellCategories={
 warm:['Calentamiento','Warm-up','Despierta la voz de forma progresiva antes de cantar.','Wake up the voice gradually before singing.'],
 breath:['Respiración','Breathing','Controla el aire sin tensión y coordina respiración con sonido.','Control the airflow without tension and coordinate breath with sound.'],
 resonance:['Resonancia','Resonance','Activa sensaciones de vibración con sonidos cómodos como MMM y NG.','Activate comfortable vibration sensations with sounds such as MMM and NG.'],
 pitch:['Afinación','Pitch','Escucha, imita y estabiliza notas e intervalos.','Listen, imitate and stabilize notes and intervals.'],
 range:['Rango vocal','Vocal range','Explora graves y agudos de forma gradual, nunca forzada.','Explore low and high notes gradually, never by force.'],
 agility:['Agilidad','Agility','Coordina cambios rápidos de nota con precisión y ligereza.','Coordinate quick note changes with precision and lightness.'],
 diction:['Dicción','Diction','Aclara vocales y consonantes para que el texto se entienda al cantar.','Clarify vowels and consonants so the words are understood while singing.'],
 cool:['Enfriamiento','Cool-down','Devuelve la voz a una emisión suave después de cantar.','Bring the voice back to a gentle production after singing.']
};
const ex=(name,pattern,syllables,tip,why,example,tempo=90)=>({name,pattern,syllables,tip,why,example,tempo});
const exercises={
warm:[
 ex('Trino de labios · 5 notas',[0,2,4,5,7,5,4,2,0],['Brrr','Vvv','Zzz'],'Labios sueltos y poco volumen.','Ayuda a coordinar aire y sonido con poca presión.','Haz “brrr” como un motor suave mientras sigues el piano.',82),
 ex('Sirena suave',[0,4,7,12,7,4,0],['UU','NG','Woo'],'No empujes al subir.','Favorece una transición continua entre zonas de la voz.','Imagina una sirena pequeña, no una alarma fuerte.',72),
 ex('Cinco notas ligeras',[0,2,4,5,7,5,4,2,0],['MI','NU','GI'],'Mantén la mandíbula libre.','Despierta coordinación sin exigir demasiado rango.','Canta una sílaba por nota.',92)
],
breath:[
 {name:'Siseo controlado',timed:true,duration:40,syllables:['SSS'],tip:'Inhala sin levantar hombros y suelta el aire parejo.',why:'Entrena dosificación del aire.',example:'Inhala 4 tiempos y mantén “sss” uniforme.'},
 {name:'Pulsos de aire',timed:true,duration:35,syllables:['SH','TS','F'],tip:'Pulsos pequeños, sin hundir el pecho.',why:'Trabaja coordinación del flujo de aire.',example:'Haz 8 pulsos y descansa una respiración.'},
 {name:'Frase larga en V',timed:true,duration:45,syllables:['VVV'],tip:'Mantén sensación continua y cómoda.',why:'Une respiración y vibración sonora.',example:'Sostén “vvv” estable y termina antes de quedarte sin aire.'}
],
resonance:[
 ex('Humming de 5 notas',[0,2,4,5,7,5,4,2,0],['MMM','NNN','NG'],'Busca vibración cómoda, sin apretar.','Ayuda a encontrar una emisión eficiente.','Sonríe apenas y mantén el sonido pequeño.',86),
 ex('NG → vocal',[0,2,4,2,0],['NG-A','NG-E','NG-O'],'Abre la vocal sin perder facilidad.','Conecta resonancia con vocales de canto.','Haz NG en la primera mitad y abre a la vocal.',78),
 ex('Mum de 5 notas',[0,2,4,5,7,5,4,2,0],['MUM','MOM','MIM'],'No oscurezcas ni empujes.','Trabaja foco y estabilidad del sonido.','Pronuncia claro pero sin morder la consonante.',88)
],
pitch:[
 ex('Eco de 3 notas',[0,2,4,2,0],['MA','NE','LO'],'Escucha primero y luego repite.','Entrena memoria tonal y precisión.','Piano primero; tú imitas después.',76),
 ex('Arpegio mayor',[0,4,7,12,7,4,0],['NO','YA','GO'],'Haz limpios los saltos.','Trabaja intervalos más amplios.','Evita deslizarte entre notas.',82),
 ex('1–2–3–2–1',[0,2,4,2,0],['DI','ME','TU'],'Mantén cada nota centrada.','Refuerza afinación en patrones cortos.','Una sílaba por cada nota.',92)
],
range:[
 ex('Escala de octava',[0,2,4,5,7,9,11,12,11,9,7,5,4,2,0],['NU','NO','GU'],'Detente antes de que aparezca presión.','Amplía el área cómoda de manera gradual.','Sube semitono solo si la repetición anterior fue cómoda.',76),
 ex('Arpegio extendido',[0,4,7,12,16,12,7,4,0],['GUG','NAY','MUM'],'Volumen moderado.','Explora extensión con saltos controlados.','No persigas la nota alta; deja que llegue ligera.',72),
 ex('Descenso hacia graves',[12,9,7,5,4,2,0],['OH','UH','MUM'],'No fabriques una voz artificialmente grave.','Ayuda a explorar el registro bajo con relajación.','Piensa más en soltar que en oscurecer.',74)
],
agility:[
 ex('Cinco notas rápidas',[0,2,4,5,7,5,4,2,0],['DA','GI','NE'],'Empieza lento y acelera solo si sale limpio.','Mejora coordinación y precisión rítmica.','Ataques pequeños; no martilles las consonantes.',112),
 ex('1–3–5–3–1',[0,4,7,4,0],['MI','NO','YA'],'Mantén el pulso exacto.','Entrena saltos rápidos y controlados.','Piensa en notas separadas pero conectadas.',108),
 ex('Escalera 1–2–3–4–5',[0,2,4,5,7,5,4,2,0],['LE-GA-TO','DI-GA-ME','PA-TA-KA'],'No corras por encima del piano.','Une articulación y velocidad.','Hazlo primero muy claro y luego más rápido.',118)
],
diction:[
 ex('Vocales abiertas',[0,2,4,5,7,5,4,2,0],['MA-ME-MI-MO-MU','NA-NE-NI-NO-NU'],'Mandíbula suelta y vocales claras.','Mejora inteligibilidad al cantar.','No cambies volumen al cambiar de vocal.',88),
 ex('Consonantes alternadas',[0,2,4,2,0],['DA-GA','TA-KA','BA-DA'],'Consonante clara, garganta libre.','Entrena precisión del texto.','Haz la consonante breve y deja sonar la vocal.',94),
 ex('Frase rítmica',[0,2,4,5,7,5,4,2,0],['MI-ME-MA-MO-MU','PA-TA-KA-DA-GA'],'No sacrifiques claridad por velocidad.','Prepara frases rápidas de canciones.','Primero habla el patrón, luego cántalo.',100)
],
cool:[
 ex('Humming descendente',[7,5,4,2,0],['MMM','NNN'],'Muy suave.','Ayuda a bajar intensidad después de cantar.','Piensa en una despedida tranquila.',68),
 ex('Descenso en U',[12,9,7,5,4,2,0],['UU','OO'],'Deja caer la voz, no la empujes.','Favorece una vuelta gradual a una emisión cómoda.','Usa menos volumen que durante el calentamiento.',66),
 ex('Suspiro sonoro',[7,4,0],['HAA','HOO'],'Exhala y deja que la voz acompañe.','Relaja la emisión al terminar.','Debe sentirse fácil, casi como bostezar suavemente.',62)
]
};
const exerciseEN={
 warm:[
  ['Lip trill · 5 notes','Relax your lips and keep the volume low.','Helps coordinate airflow and sound with little pressure.','Do a gentle “brrr” like a soft motor while following the piano.'],
  ['Gentle siren','Do not push as you go higher.','Encourages a smooth transition between areas of the voice.','Imagine a small siren, not a loud alarm.'],
  ['Light five-note pattern','Keep your jaw relaxed.','Wakes up coordination without demanding too much range.','Sing one syllable per note.']
 ],
 breath:[
  ['Controlled hiss','Inhale without raising your shoulders and release the air evenly.','Trains airflow management.','Inhale for 4 counts and keep “sss” steady.'],
  ['Air pulses','Use small pulses without collapsing your chest.','Trains airflow coordination.','Do 8 pulses and rest for one breath.'],
  ['Long V phrase','Keep the sensation continuous and comfortable.','Connects breathing and vocal vibration.','Hold “vvv” steadily and stop before you run out of air.']
 ],
 resonance:[
  ['Five-note humming','Find a comfortable vibration without squeezing.','Helps find efficient sound production.','Smile slightly and keep the sound small.'],
  ['NG → vowel','Open the vowel without losing ease.','Connects resonance with sung vowels.','Use NG for the first half and then open to the vowel.'],
  ['Five-note Mum','Do not darken or push the sound.','Works on focus and sound stability.','Pronounce clearly without biting the consonant.']
 ],
 pitch:[
  ['Three-note echo','Listen first and then repeat.','Trains tonal memory and pitch accuracy.','Piano first; you imitate afterward.'],
  ['Major arpeggio','Keep the leaps clean.','Works on wider intervals.','Avoid sliding between notes.'],
  ['1–2–3–2–1','Keep each note centered.','Reinforces pitch accuracy in short patterns.','One syllable for each note.']
 ],
 range:[
  ['Octave scale','Stop before pressure appears.','Gradually expands your comfortable range.','Move up a semitone only if the previous repetition felt comfortable.'],
  ['Extended arpeggio','Use a moderate volume.','Explores range with controlled leaps.','Do not chase the high note; let it arrive lightly.'],
  ['Descending to low notes','Do not manufacture an artificially low voice.','Helps explore the lower register with relaxation.','Think more about releasing than darkening the sound.']
 ],
 agility:[
  ['Fast five-note pattern','Start slowly and speed up only if it stays clean.','Improves coordination and rhythmic accuracy.','Use small attacks; do not hammer the consonants.'],
  ['1–3–5–3–1','Keep the pulse exact.','Trains fast, controlled leaps.','Think of separate notes that still stay connected.'],
  ['1–2–3–4–5 ladder','Do not rush ahead of the piano.','Combines articulation and speed.','Do it very clearly first, then make it faster.']
 ],
 diction:[
  ['Open vowels','Keep your jaw relaxed and vowels clear.','Improves intelligibility while singing.','Do not change volume when you change vowels.'],
  ['Alternating consonants','Use a clear consonant with a free throat.','Trains text precision.','Make the consonant brief and let the vowel ring.'],
  ['Rhythmic phrase','Do not sacrifice clarity for speed.','Prepares fast phrases in songs.','Speak the pattern first, then sing it.']
 ],
 cool:[
  ['Descending humming','Keep it very soft.','Helps reduce intensity after singing.','Think of a calm goodbye.'],
  ['Descending on U','Let the voice fall; do not push it.','Encourages a gradual return to comfortable production.','Use less volume than during the warm-up.'],
  ['Voiced sigh','Exhale and let the voice follow.','Relaxes vocal production at the end.','It should feel easy, almost like a gentle yawn.']
 ]
};
const routines={
 quick:{title:'⚡ Calentamiento rápido · 5 min',steps:[['breath',0,40],['warm',0,55],['resonance',0,55],['pitch',0,55],['diction',0,55]]},
 worship:{title:'🎤 Antes del culto · 10 min',steps:[['breath',0,50],['warm',0,70],['resonance',1,75],['pitch',0,75],['range',0,90],['agility',0,80],['diction',0,80]]},
 full:{title:'🔥 Entrenamiento completo · 20 min',steps:[['breath',0,60],['breath',1,50],['warm',0,80],['warm',1,80],['resonance',0,90],['resonance',1,90],['pitch',0,90],['pitch',1,90],['range',0,110],['range',1,110],['agility',0,100],['agility',1,100],['diction',0,90],['diction',1,90],['cool',0,80],['cool',1,80]]}
};
const shellRoutines={
 quick:['⚡ Calentamiento rápido · 5 min','⚡ Quick warm-up · 5 min'],
 worship:['🎤 Antes del culto · 10 min','🎤 Before worship · 10 min'],
 full:['🔥 Entrenamiento completo · 20 min','🔥 Full training · 20 min']
};
let ctx=null,stopToken=0,routineState=null,activeVoicePanel=null;
function translatedExercise(cat,i,e=exercises[cat]?.[i]){if(!e||voiceLang()!=='en')return e;const t=exerciseEN[cat]?.[i];return t?{...e,name:t[0],tip:t[1],why:t[2],example:t[3]}:e}
function categoryText(id){const c=categories.find(x=>x.id===id),t=shellCategories[id],en=voiceLang()==='en';return c&&t?{...c,title:t[en?1:0],desc:t[en?3:2]}:c}
function routineTitle(id){const pair=shellRoutines[id];return pair?pair[voiceLang()==='en'?1:0]:routines[id]?.title||''}
function shellTitle(el,value){if(!el)return;const icon=el.querySelector('.lg-section-icon');if(icon){const label=[...el.children].find(n=>n!==icon);if(label)label.textContent=value;else el.append(document.createTextNode(value));return}el.textContent=`🎤 ${value}`}
function translateVoiceShell(){const v=$('#voiceView');if(!v)return;const en=voiceLang()==='en';const back=v.querySelector('[data-voice-home]');if(back)back.textContent=vtx('← Volver','← Back');shellTitle(v.querySelector('.voice-hero h1'),vtx('Voz','Voice'));const hero=v.querySelector('.voice-hero p');if(hero)hero.textContent=vtx('Rutinas guiadas, ejemplos, sílabas variadas y patrones de piano.','Guided routines, examples, varied syllables and piano patterns.');const warning=v.querySelector(':scope > .voice-warning');if(warning)warning.innerHTML=en?'<b>Take care of your voice:</b> work in a comfortable range, without pain or pressure. If pain, significant voice loss or persistent discomfort appears, stop the exercise.':'<b>Cuida tu voz:</b> trabaja en una zona cómoda, sin dolor ni presión. Si aparece dolor, pérdida marcada de voz o molestia persistente, detén el ejercicio.';const headings=v.querySelectorAll(':scope > h2');if(headings[0])headings[0].textContent=vtx('Rutinas guiadas','Guided routines');if(headings[1])headings[1].textContent=vtx('Entrena por objetivo','Train by goal');Object.entries(shellRoutines).forEach(([id,pair])=>{const b=v.querySelector(`[data-routine="${id}"]`);if(!b)return;const title=b.querySelector('b'),small=b.querySelector('small');if(title)title.textContent=pair[en?1:0];if(small)small.textContent=vtx('La Grey te lleva paso a paso y toca los ejercicios en orden.','La Grey guides you step by step and plays the exercises in order.')});Object.entries(shellCategories).forEach(([id,t])=>{const b=v.querySelector(`[data-voice-cat="${id}"]`);if(!b)return;const title=b.querySelector('b'),small=b.querySelector('small');if(title)title.textContent=t[en?1:0];if(small)small.textContent=t[en?3:2]})}
function injectStyle(){if($('#voiceCss'))return;const l=document.createElement('link');l.id='voiceCss';l.rel='stylesheet';l.href='voice.css';document.head.appendChild(l)}
function build(){injectStyle();const homeGrid=$('#home .home-grid');if(homeGrid&&!homeGrid.querySelector('[data-open="voice"]')){const b=document.createElement('button');b.className='card';b.dataset.open='voice';b.innerHTML=`<div class="icon">🎤✨</div><h2>${vtx('Voz','Voice')}</h2><div class="muted">${vtx('Calentamiento y entrenamiento vocal','Warm-ups and vocal training')}</div><div class="count">${vtx('Rutinas guiadas + piano','Guided routines + piano')}</div>`;homeGrid.appendChild(b)}if($('#voiceView')){translateVoiceShell();return}const s=document.createElement('section');s.id='voiceView';s.className='view hidden';s.innerHTML=`<button class="back" data-voice-home>← Volver</button><div class="voice-hero"><h1>🎤 Voz</h1><p>Rutinas guiadas, ejemplos, sílabas variadas y patrones de piano.</p></div><div class="voice-warning"><b>Cuida tu voz:</b> trabaja en una zona cómoda, sin dolor ni presión. Si aparece dolor, pérdida marcada de voz o molestia persistente, detén el ejercicio.</div><h2>Rutinas guiadas</h2><div class="voice-routines">${Object.entries(routines).map(([id,r])=>`<button class="voice-routine" data-routine="${id}"><b>${r.title}</b><br><small>La Grey te lleva paso a paso y toca los ejercicios en orden.</small></button>`).join('')}</div><h2>Entrena por objetivo</h2><div class="voice-grid">${categories.map(c=>`<button class="voice-card" data-voice-cat="${c.id}"><span class="voice-icon">${c.icon}</span><b>${c.title}</b><small>${c.desc}</small></button>`).join('')}</div><div id="voicePanel" class="voice-panel hidden"></div>`;document.querySelector('main').appendChild(s);translateVoiceShell()}
function showVoice(){build();translateVoiceShell();$$('.view').forEach(v=>v.classList.add('hidden'));$('#voiceView').classList.remove('hidden');$$('nav button').forEach(b=>b.classList.remove('active'));window.scrollTo(0,0)}
function goHome(){stopPlayback();$('#voiceView')?.classList.add('hidden');$('#home')?.classList.remove('hidden');window.scrollTo(0,0)}
function degreeLabel(n){const map={0:'1',2:'2',4:'3',5:'4',7:'5',9:'6',11:'7',12:'8',16:'10'};return map[n]||'•'}
function exerciseHtml(cat,i,source){const e=translatedExercise(cat,i,source);if(e.timed)return `<article class="voice-exercise"><h3>${e.name}</h3><p><b>${vtx('Para qué sirve:','What it does:')}</b> ${e.why}</p><p><b>${vtx('Cómo hacerlo:','How to do it:')}</b> ${e.tip}</p><p><b>${vtx('Ejemplo:','Example:')}</b> ${e.example}</p><div class="voice-syllable-chip">${e.syllables.join(' · ')}</div><div class="voice-play-row"><button class="btn primary" data-timer="${cat}:${i}">▶ ${vtx('Iniciar','Start')} ${e.duration||30}s</button><button class="btn" data-stop>■ ${vtx('Detener','Stop')}</button></div><div class="voice-status" id="status-${cat}-${i}">${vtx('Listo para comenzar.','Ready to begin.')}</div></article>`;return `<article class="voice-exercise"><h3>${e.name}</h3><div class="voice-pattern">${e.pattern.map(degreeLabel).join(' – ')}</div><p><b>${vtx('Para qué sirve:','What it does:')}</b> ${e.why}</p><p><b>${vtx('Cómo hacerlo:','How to do it:')}</b> ${e.tip}</p><p><b>${vtx('Ejemplo:','Example:')}</b> ${e.example}</p><div class="voice-controls"><label>${vtx('Sílaba','Syllable')}<select data-syllable>${e.syllables.map(s=>`<option>${s}</option>`).join('')}</select></label><label>${vtx('Nota inicial','Starting note')}<select data-start><option value="48">C3 · Do3</option><option value="50">D3 · Re3</option><option value="52">E3 · Mi3</option><option value="53">F3 · Fa3</option><option value="55">G3 · Sol3</option><option value="57">A3 · La3</option><option value="60" selected>C4 · Do4</option></select></label><label>Tempo<input data-tempo type="range" min="55" max="150" value="${e.tempo||90}"><span data-tempo-label>${e.tempo||90} BPM</span></label><label>${vtx('Repeticiones','Repetitions')}<select data-repeats><option>1</option><option selected>3</option><option>5</option><option>8</option></select></label><label>${vtx('Movimiento','Movement')}<select data-shift><option value="0">${vtx('No mover','Do not move')}</option><option value="1" selected>+½ ${vtx('tono','step')}</option><option value="-1">−½ ${vtx('tono','step')}</option></select></label></div><div class="voice-play-row"><button class="btn primary" data-play="${cat}:${i}">▶ ${vtx('Escuchar y practicar','Listen and practice')}</button><button class="btn" data-demo="${cat}:${i}">🎹 ${vtx('Solo ejemplo','Example only')}</button><button class="btn" data-stop>■ ${vtx('Detener','Stop')}</button></div><div class="voice-status" id="status-${cat}-${i}">${vtx('Listo. El piano tocará el patrón y te indicará la sílaba elegida.','Ready. The piano will play the pattern and show the selected syllable.')}</div></article>`}
function renderCategory(id,scroll=true){const c=categoryText(id),p=$('#voicePanel');if(!c||!p)return;activeVoicePanel={type:'category',id};p.classList.remove('hidden');p.innerHTML=`<span class="voice-badge">${c.icon} ${c.title}</span><h2>${c.title}</h2><p>${c.desc}</p><div class="voice-exercise-list">${(exercises[id]||[]).map((e,i)=>exerciseHtml(id,i,e)).join('')}</div>`;wireExercises();if(scroll)p.scrollIntoView({behavior:'smooth',block:'start'})}
function wireExercises(){$$('#voicePanel [data-tempo]').forEach(r=>r.oninput=()=>r.parentElement.querySelector('[data-tempo-label]').textContent=r.value+' BPM');$$('[data-play]').forEach(b=>b.onclick=()=>playExercise(b,false));$$('[data-demo]').forEach(b=>b.onclick=()=>playExercise(b,true));$$('[data-stop]').forEach(b=>b.onclick=stopPlayback);$$('[data-timer]').forEach(b=>b.onclick=()=>startTimer(b))}
function midiFreq(m){return 440*Math.pow(2,(m-69)/12)}
function noteLabel(m){const n=NOTE_NAMES[((m%12)+12)%12],o=Math.floor(m/12)-1;return `${LATIN[n]||n}${o}`}
function audio(){if(!ctx)ctx=new (window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume();return ctx}
function pianoNote(midi,when,dur=.32){const a=audio(),gain=a.createGain(),o1=a.createOscillator(),o2=a.createOscillator();o1.type='triangle';o2.type='sine';o1.frequency.value=midiFreq(midi);o2.frequency.value=midiFreq(midi)*2;gain.gain.setValueAtTime(.0001,when);gain.gain.exponentialRampToValueAtTime(.16,when+.015);gain.gain.exponentialRampToValueAtTime(.0001,when+dur);o1.connect(gain);o2.connect(gain);gain.connect(a.destination);o1.start(when);o2.start(when);o1.stop(when+dur+.03);o2.stop(when+dur+.03)}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function playPattern(e,root,tempo,token,status,syllable){const beat=60/tempo;let t=ctx.currentTime+.08;e.pattern.forEach(step=>{pianoNote(root+step,t,Math.max(.18,beat*.72));t+=beat});if(status)status.textContent=`🎹 ${noteLabel(root)} · ${tempo} BPM · ${vtx('canta','sing')} “${syllable}”`;await wait(e.pattern.length*beat*1000+250);return token===stopToken}
async function playExercise(btn,demoOnly){stopPlayback();const token=++stopToken,[cat,idx]=btn.dataset[demoOnly?'demo':'play'].split(':'),e=exercises[cat][Number(idx)],box=btn.closest('.voice-exercise'),start=Number(box.querySelector('[data-start]').value),tempo=Number(box.querySelector('[data-tempo]').value),reps=demoOnly?1:Number(box.querySelector('[data-repeats]').value),shift=demoOnly?0:Number(box.querySelector('[data-shift]').value),syllable=box.querySelector('[data-syllable]').value,status=$(`#status-${cat}-${idx}`);audio();for(let r=0;r<reps;r++){if(token!==stopToken)return;const root=start+r*shift;status.textContent=`${vtx('Repetición','Repetition')} ${r+1}/${reps} · ${noteLabel(root)} · “${syllable}”`;if(!(await playPattern(e,root,tempo,token,status,syllable)))return;if(!demoOnly){status.textContent=`🎤 ${vtx('Ahora repítelo tú con','Now repeat it with')} “${syllable}”`;await wait(Math.max(900,e.pattern.length*(60/tempo)*700));}}status.textContent=demoOnly?vtx('✅ Ejemplo terminado.','✅ Example finished.'):vtx('✅ Ejercicio terminado. Si se sintió cómodo, puedes repetirlo.','✅ Exercise finished. If it felt comfortable, you can repeat it.')}
function stopPlayback(){stopToken++;routineState=null;$$('.voice-status').forEach(s=>{if(!s.textContent.startsWith('✅'))s.textContent=vtx('Detenido.','Stopped.')})}
function startTimer(btn){const [cat,idx]=btn.dataset.timer.split(':'),source=exercises[cat][Number(idx)],e=translatedExercise(cat,Number(idx),source),status=$(`#status-${cat}-${idx}`);stopPlayback();const token=++stopToken;let left=e.duration||30;status.textContent=`⏱️ ${left}s · ${e.example}`;const id=setInterval(()=>{if(token!==stopToken){clearInterval(id);return}left--;status.textContent=left>0?`⏱️ ${left}s · ${e.example}`:vtx('✅ Terminado. Respira normalmente.','✅ Finished. Breathe normally.');if(left<=0)clearInterval(id)},1000)}
function showRoutine(id,scroll=true){const r=routines[id],p=$('#voicePanel');if(!r||!p)return;activeVoicePanel={type:'routine',id};p.classList.remove('hidden');p.innerHTML=`<span class="voice-badge">${vtx('Rutina guiada','Guided routine')}</span><h2>${routineTitle(id)}</h2><p>${vtx('No es una lista para leer: pulsa iniciar y La Grey irá avanzando ejercicio por ejercicio.','This is not a list to read: press start and La Grey will advance exercise by exercise.')}</p><div id="routineProgress" class="routine-progress"><div class="routine-bar"><span></span></div><div id="routineStepLabel">${vtx('Preparado para comenzar.','Ready to begin.')}</div></div><div class="voice-play-row"><button class="btn primary" data-start-routine="${id}">▶ ${vtx('Iniciar rutina completa','Start full routine')}</button><button class="btn" data-routine-stop>■ ${vtx('Detener','Stop')}</button></div><div id="routineCurrent" class="routine-current">${vtx('Aquí aparecerá el ejercicio actual, la sílaba y lo que debes hacer.','The current exercise, syllable and instructions will appear here.')}</div><div class="routine-list">${r.steps.map((s,i)=>{const e=translatedExercise(s[0],s[1]);return `<div class="routine-item" data-routine-item="${i}"><b>${i+1}. ${e.name}</b><small>${e.timed?e.example:`${e.syllables[0]} · ${e.tip}`}</small></div>`}).join('')}</div>`;p.querySelector('[data-start-routine]').onclick=()=>runRoutine(id);p.querySelector('[data-routine-stop]').onclick=stopPlayback;if(scroll)p.scrollIntoView({behavior:'smooth',block:'start'})}
async function runRoutine(id){stopPlayback();audio();const token=++stopToken,r=routines[id],current=$('#routineCurrent'),label=$('#routineStepLabel'),bar=$('#routineProgress .routine-bar span');for(let i=0;i<r.steps.length;i++){if(token!==stopToken)return;$$('[data-routine-item]').forEach((x,j)=>x.classList.toggle('active',j===i));bar.style.width=((i/r.steps.length)*100)+'%';const [cat,idx,duration]=r.steps[i],e=exercises[cat][idx],te=translatedExercise(cat,idx,e);label.textContent=`${vtx('Paso','Step')} ${i+1} ${vtx('de','of')} ${r.steps.length}`;if(e.timed){current.innerHTML=`<b>${te.name}</b><br>${te.example}<br><span class="voice-syllable-chip">${e.syllables[0]}</span>`;let left=Math.min(duration,e.duration||duration);while(left>0){if(token!==stopToken)return;label.textContent=`${vtx('Paso','Step')} ${i+1}/${r.steps.length} · ${left}s`;await wait(1000);left--;}}else{const syll=e.syllables[0],tempo=e.tempo||90,start=60,reps=Math.max(2,Math.min(5,Math.round(duration/25)));current.innerHTML=`<b>${te.name}</b><br>${vtx('Canta con','Sing with')} <b>${syll}</b>. ${te.tip}<br><small>${vtx('El piano tocará y luego tendrás tiempo para repetir.','The piano will play and then you will have time to repeat.')}</small>`;for(let rep=0;rep<reps;rep++){if(token!==stopToken)return;const root=start+rep;label.textContent=`${vtx('Paso','Step')} ${i+1}/${r.steps.length} · ${vtx('repetición','repetition')} ${rep+1}/${reps} · ${noteLabel(root)}`;if(!(await playPattern(e,root,tempo,token,null,syll)))return;await wait(Math.max(900,e.pattern.length*(60/tempo)*650));}}}bar.style.width='100%';label.textContent=vtx('✅ Rutina completada','✅ Routine completed');current.innerHTML=vtx('<b>Muy bien.</b><br>La rutina terminó. Si vas a cantar ahora, mantente hidratado y evita forzar la voz.','<b>Well done.</b><br>The routine is finished. If you are going to sing now, stay hydrated and avoid forcing your voice.');$$('[data-routine-item]').forEach(x=>x.classList.remove('active'))}
function refreshVoiceLanguage(){translateVoiceShell();if(!activeVoicePanel)return;stopPlayback();if(activeVoicePanel.type==='category')renderCategory(activeVoicePanel.id,false);else if(activeVoicePanel.type==='routine')showRoutine(activeVoicePanel.id,false)}
function onCapture(ev){const voice=ev.target.closest('[data-open="voice"]');if(voice){ev.preventDefault();ev.stopPropagation();showVoice();return}const back=ev.target.closest('[data-voice-home]');if(back){ev.preventDefault();ev.stopPropagation();goHome();return}const cat=ev.target.closest('[data-voice-cat]');if(cat){ev.preventDefault();renderCategory(cat.dataset.voiceCat);return}const routine=ev.target.closest('[data-routine]');if(routine){ev.preventDefault();showRoutine(routine.dataset.routine);return}if(!$('#voiceView')?.classList.contains('hidden')&&ev.target.closest('nav button,[data-home],[data-nav]'))stopPlayback()}
window.LAGREY_REFRESH_VOICE_BASE_I18N=refreshVoiceLanguage;
new MutationObserver(muts=>{if(muts.some(m=>m.attributeName==='lang'))refreshVoiceLanguage()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
document.addEventListener('click',onCapture,true);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();