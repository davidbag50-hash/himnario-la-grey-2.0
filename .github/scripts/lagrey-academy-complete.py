#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]
VOICE = ROOT / 'voice.js'
CSS = ROOT / 'voice.css'
SW = ROOT / 'sw.js'
SCRIPTS = ROOT / 'ACADEMIA-VOICE-VIDEO-SCRIPTS-v1.md'
VIDEO_README = ROOT / 'academy-videos' / 'README.md'


def must_replace(text, old, new, label):
    if old not in text:
        raise SystemExit(f'Marcador no encontrado: {label}')
    return text.replace(old, new, 1)

voice = VOICE.read_text(encoding='utf-8')

interactive = r'''const academyInteractive={
 'voice-advanced-01-mix':[
  {name:['Sirena coordinada · 1–3–5–8–5–3–1','Coordinated siren · 1–3–5–8–5–3–1'],pattern:[0,4,7,12,7,4,0],syllables:['NG','Woo','UU'],tempo:72,tip:['Mantén el sonido pequeño al subir; no aumentes volumen para alcanzar la octava.','Keep the sound small as you ascend; do not increase volume to reach the octave.']},
  {name:['MUM ligero · 1–2–3–4–5–4–3–2–1','Light MUM · 1–2–3–4–5–4–3–2–1'],pattern:[0,2,4,5,7,5,4,2,0],syllables:['MUM','MOM','NO'],tempo:82,tip:['Busca continuidad. Si la quinta se pone dura, baja intensidad o nota inicial.','Look for continuity. If the fifth gets hard, reduce intensity or starting note.']}
 ],
 'voice-advanced-02-passaggio':[
  {name:['NG → vocal · transición corta','NG → vowel · short transition'],pattern:[0,2,4,2,0],syllables:['NG-A','NG-E','NG-O'],tempo:74,tip:['Mantén NG pequeño y abre la vocal sin aumentar volumen. Si aparece presión, baja la nota inicial.','Keep NG small and open the vowel without increasing volume. If pressure appears, lower the starting note.']},
  {name:['MUM / NO · 1–3–5–3–1','MUM / NO · 1–3–5–3–1'],pattern:[0,4,7,4,0],syllables:['MUM','NO','NAY'],tempo:78,tip:['Piensa en facilidad y claridad. No conviertas la quinta en un grito.','Think ease and clarity. Do not turn the fifth into a shout.']}
 ],
 'voice-advanced-03-dynamics':[
  {name:['Frase estable · suave → medio','Stable phrase · soft → medium'],pattern:[0,2,4,5,7,5,4,2,0],syllables:['MMM-MA','NO','NU'],tempo:76,tip:['Haz la primera repetición suave y la segunda media sin cambiar afinación ni endurecer la mandíbula.','Do the first repetition softly and the second at medium intensity without changing pitch or hardening the jaw.']},
  {name:['Centro de voz · control de intensidad','Voice center · intensity control'],pattern:[0,0,0,0],syllables:['MA','OO','EH'],tempo:68,tip:['Usa las cuatro notas iguales como referencia: suave, medio, firme, suave. Nunca busques máximo volumen.','Use the four repeated notes as reference: soft, medium, firm, soft. Never chase maximum volume.']}
 ],
 'voice-advanced-04-intervals':[
  {name:['Saltos 1 → 3 → 1','Leaps 1 → 3 → 1'],pattern:[0,4,0],syllables:['MA','NO','DI'],tempo:72,tip:['Escucha la distancia antes de cantarla. Llega directo, sin deslizar.','Hear the distance before singing it. Arrive directly, without sliding.']},
  {name:['Saltos 1 → 5 → 1','Leaps 1 → 5 → 1'],pattern:[0,7,0],syllables:['MA','NO','YA'],tempo:68,tip:['No subas volumen para asegurar la quinta. Mantén el ataque pequeño y preciso.','Do not get louder to secure the fifth. Keep the onset small and accurate.']},
  {name:['Arpegio 1–3–5–8–5–3–1','Arpeggio 1–3–5–8–5–3–1'],pattern:[0,4,7,12,7,4,0],syllables:['NO','YA','GO'],tempo:76,tip:['Imagina cada destino antes de cantarlo y evita arrastrarte entre notas.','Imagine each destination before singing it and avoid sliding between notes.']}
 ],
 'voice-advanced-05-harmony':[
  {name:['Tríada mayor · raíz, tercera, quinta','Major triad · root, third, fifth'],pattern:[0,4,7,4,0],syllables:['AH','OO','MM'],tempo:66,tip:['Escucha cada función. Luego intenta volver a la tercera sin seguir automáticamente la raíz.','Hear each function. Then try returning to the third without automatically following the root.']},
  {name:['Tercera estable sobre acorde','Stable third over the chord'],pattern:[4,4,4,4],syllables:['AH','EH','OO'],tempo:62,tip:['Mantén una tercera estable sin subir volumen aunque escuches otras notas alrededor.','Hold a stable third without getting louder even while hearing other notes around it.']}
 ],
 'voice-advanced-07-agility':[
  {name:['Cinco notas limpias','Clean five-note run'],pattern:[0,2,4,5,7,5,4,2,0],syllables:['DA','GI','NE'],tempo:80,tip:['Completa tres repeticiones limpias antes de aumentar tempo.','Complete three clean repetitions before increasing tempo.']},
  {name:['Melisma corto · 1–3–5–3–2–1','Short melisma · 1–3–5–3–2–1'],pattern:[0,4,7,4,2,0],syllables:['AH','EH','OO'],tempo:84,tip:['Practícalo lento y con notas identificables. La mandíbula no debe marcar cada nota.','Practice it slowly with identifiable notes. Your jaw should not mark every note.']}
 ]
};'''

video_data = r'''const academyVideos={
 'voice-advanced-01-mix':{src:'./academy-videos/voice-advanced-01-mix.mp4',title:['Video IA · Mezcla vocal','AI video · Vocal mix'],duration:'4–5 min',scenes:[['Qué es la mezcla y qué no es','What mix is and what it is not'],['Cómo aligerar al subir sin perder continuidad','How to lighten as you ascend without losing continuity'],['Demostración NG/Woo y MUM','NG/Woo and MUM demonstration'],['Aplicación a una frase de coro','Application to a chorus phrase']]},
 'voice-advanced-02-passaggio':{src:'./academy-videos/voice-advanced-02-passaggio.mp4',title:['Video IA · Passaggio sin tensión','AI video · Passaggio without tension'],duration:'4–5 min',scenes:[['Reconocer la zona de transición','Recognizing the transition zone'],['Errores: empujar, repetir y perseguir la nota','Mistakes: pushing, repeating and chasing the note'],['NG-A y MUM paso a paso','NG-A and MUM step by step'],['Cuándo detener la práctica','When to stop practicing']]},
 'voice-advanced-03-dynamics':{src:'./academy-videos/voice-advanced-03-dynamics.mp4',title:['Video IA · Control dinámico','AI video · Dynamic control'],duration:'3–4 min',scenes:[['Suave no significa sin apoyo','Soft does not mean unsupported'],['Firme no significa gritar','Firm does not mean shouting'],['Micrófono, monitores y volumen útil','Microphone, monitors and useful volume'],['Verso, pre-coro y coro','Verse, pre-chorus and chorus']]},
 'voice-advanced-04-intervals':{src:'./academy-videos/voice-advanced-04-intervals.mp4',title:['Video IA · Afinación e intervalos','AI video · Pitch and intervals'],duration:'4–5 min',scenes:[['Escuchar la nota antes de cantarla','Hearing the note before singing it'],['Saltos 1→3 y 1→5','Leaps 1→3 and 1→5'],['Entrada directa sin deslizar','Direct entrance without sliding'],['Aplicación a entradas reales','Application to real entrances']]},
 'voice-advanced-05-harmony':{src:'./academy-videos/voice-advanced-05-harmony.mp4',title:['Video IA · Armonías','AI video · Harmony'],duration:'5–6 min',scenes:[['Raíz, tercera y quinta','Root, third and fifth'],['Cómo no volver a la melodía principal','How not to fall back to the main melody'],['Dónde entra y sale una segunda voz','Where a harmony part enters and exits'],['Arreglo vocal para un coro','Vocal arrangement for a chorus']]},
 'voice-advanced-06-endurance':{src:'./academy-videos/voice-advanced-06-endurance.mp4',title:['Video IA · Resistencia vocal','AI video · Vocal endurance'],duration:'4–5 min',scenes:[['Resistencia no es aguantar dolor','Endurance is not enduring pain'],['Distribución de carga durante el set','Distributing load through the set'],['Descansos, micrófono y monitoreo','Rests, microphone and monitoring'],['Señales para detenerse','Signals to stop']]},
 'voice-advanced-07-agility':{src:'./academy-videos/voice-advanced-07-agility.mp4',title:['Video IA · Agilidad y melismas','AI video · Agility and melismas'],duration:'4–5 min',scenes:[['Primero lento, luego rápido','Slow first, then fast'],['Notas identificables dentro del melisma','Identifiable notes inside the melisma'],['Tres repeticiones limpias','Three clean repetitions'],['Cuándo un adorno sirve a la canción','When an ornament serves the song']]},
 'voice-advanced-08-setlist':{src:'./academy-videos/voice-advanced-08-setlist.mp4',title:['Video IA · Preparar un setlist','AI video · Preparing a setlist'],duration:'5–6 min',scenes:[['Detectar frases exigentes','Finding demanding phrases'],['Revisar tonos oficiales','Reviewing official keys'],['Distribuir voces y descansos','Distributing voices and rests'],['Calentamiento según el repertorio','Warm-up based on repertoire']]}
};'''

match = re.search(r"const academyInteractive=\{.*?\n\};\nlet ctx=", voice, re.S)
if not match:
    raise SystemExit('No se encontró academyInteractive actual')
voice = voice[:match.start()] + interactive + '\n' + video_data + '\nlet ctx=' + voice[match.end():]

voice = must_replace(
    voice,
    'let ctx=null,stopToken=0,routineState=null,activeVoicePanel=null;',
    'let ctx=null,stopToken=0,routineState=null,activeVoicePanel=null,academySceneTimer=0;',
    'estado Academia'
)

video_html = r'''
function academyVideoHtml(id){const v=academyVideos[id];if(!v)return'';return `<section class="voice-academy-video"><div class="voice-academy-video-head"><div><span class="voice-badge">🎬 ${vtx('Video de la clase','Lesson video')}</span><h3>${localText(v.title)}</h3></div><span class="voice-academy-duration">${v.duration}</span></div><p>${vtx('La Grey ya tiene reservado un archivo estable para este video. Cuando el MP4 generado con IA esté publicado, aparecerá aquí sin cambiar la clase.','La Grey already has a stable file reserved for this video. Once the AI-generated MP4 is published, it will appear here without changing the lesson.')}</p><div class="academy-video-player" data-academy-video-box="${id}"><video controls playsinline preload="none" data-academy-video="${id}"><source src="${v.src}" type="video/mp4"></video><div class="academy-video-fallback"><div class="academy-video-icon">🎥</div><b>${vtx('Video IA listo para producción','AI video ready for production')}</b><small>${vtx('Mientras se publica el MP4, puedes ver el guion visual de la clase aquí mismo.','While the MP4 is being published, you can view the visual script right here.')}</small><button class="btn primary" data-academy-story="${id}">▶ ${vtx('Ver guía audiovisual','View audiovisual guide')}</button></div></div><div class="academy-story hidden" data-academy-story-box="${id}"><div class="academy-story-progress"><span data-academy-story-progress></span></div><div class="academy-story-count" data-academy-story-count></div><div class="academy-story-scene" data-academy-story-scene></div><div class="voice-play-row"><button class="btn" data-story-prev="${id}">← ${vtx('Anterior','Previous')}</button><button class="btn primary" data-story-play="${id}">▶ ${vtx('Reproducir','Play')}</button><button class="btn" data-story-next="${id}">${vtx('Siguiente','Next')} →</button></div></div></section>`}
'''.strip()
voice = must_replace(voice, '\nfunction shellTitle', '\n' + video_html + '\nfunction shellTitle', 'academyVideoHtml')

voice = must_replace(
    voice,
    '<h2>${l.icon} ${localText(l.title)}</h2><section>',
    '<h2>${l.icon} ${localText(l.title)}</h2>${academyVideoHtml(id)}<section>',
    'video dentro de la clase'
)
voice = must_replace(
    voice,
    ';wireAcademyInteractive();if(scroll)',
    ';wireAcademyInteractive();wireAcademyVideo(id);if(scroll)',
    'wire video Academia'
)
voice = must_replace(
    voice,
    "function stopPlayback(){stopToken++;routineState=null;$$('.voice-status')",
    "function stopPlayback(){stopToken++;routineState=null;clearTimeout(academySceneTimer);academySceneTimer=0;$$('.voice-status')",
    'detener storyboard'
)

video_runtime = r'''
function wireAcademyVideo(id){const video=$(`[data-academy-video="${id}"]`),box=$(`[data-academy-video-box="${id}"]`);if(video&&box){video.addEventListener('canplay',()=>box.classList.add('has-video'),{once:true});video.addEventListener('error',()=>box.classList.remove('has-video'),{once:true})}renderAcademyStory(id,0)}
function renderAcademyStory(id,index){const v=academyVideos[id],box=$(`[data-academy-story-box="${id}"]`);if(!v||!box)return;const scenes=v.scenes||[],safe=Math.max(0,Math.min(scenes.length-1,index));box.dataset.scene=String(safe);const scene=box.querySelector('[data-academy-story-scene]'),count=box.querySelector('[data-academy-story-count]'),bar=box.querySelector('[data-academy-story-progress]');if(scene)scene.textContent=localText(scenes[safe]);if(count)count.textContent=`${vtx('Escena','Scene')} ${safe+1}/${scenes.length}`;if(bar)bar.style.width=((safe+1)/scenes.length*100)+'%'}
function openAcademyStory(id){const box=$(`[data-academy-story-box="${id}"]`);if(!box)return;box.classList.remove('hidden');renderAcademyStory(id,Number(box.dataset.scene||0));box.scrollIntoView({behavior:'smooth',block:'nearest'})}
function moveAcademyStory(id,delta){clearTimeout(academySceneTimer);const v=academyVideos[id],box=$(`[data-academy-story-box="${id}"]`);if(!v||!box)return;renderAcademyStory(id,Math.max(0,Math.min(v.scenes.length-1,Number(box.dataset.scene||0)+delta)))}
function playAcademyStory(id){clearTimeout(academySceneTimer);openAcademyStory(id);const v=academyVideos[id],box=$(`[data-academy-story-box="${id}"]`);if(!v||!box)return;const step=()=>{const i=Number(box.dataset.scene||0);if(i>=v.scenes.length-1){academySceneTimer=0;return}renderAcademyStory(id,i+1);academySceneTimer=setTimeout(step,3200)};academySceneTimer=setTimeout(step,3200)}
'''.strip()
voice = must_replace(voice, '\nfunction refreshVoiceLanguage()', '\n' + video_runtime + '\nfunction refreshVoiceLanguage()', 'runtime video')

capture_anchor = "const astop=ev.target.closest('[data-academy-stop]');if(astop){ev.preventDefault();stopPlayback();return}"
capture_extra = capture_anchor + "const story=ev.target.closest('[data-academy-story]');if(story){ev.preventDefault();openAcademyStory(story.dataset.academyStory);return}const sp=ev.target.closest('[data-story-play]');if(sp){ev.preventDefault();playAcademyStory(sp.dataset.storyPlay);return}const sprev=ev.target.closest('[data-story-prev]');if(sprev){ev.preventDefault();moveAcademyStory(sprev.dataset.storyPrev,-1);return}const snext=ev.target.closest('[data-story-next]');if(snext){ev.preventDefault();moveAcademyStory(snext.dataset.storyNext,1);return}"
voice = must_replace(voice, capture_anchor, capture_extra, 'eventos video')

# Controles interactivos de cada clase deben seguir usando el motor existente.
required = [
    "'voice-advanced-01-mix'", "'voice-advanced-02-passaggio'", "'voice-advanced-03-dynamics'",
    "'voice-advanced-04-intervals'", "'voice-advanced-05-harmony'", "'voice-advanced-07-agility'",
    'academyVideoHtml(id)', 'wireAcademyVideo(id)', 'data-academy-story'
]
for marker in required:
    if marker not in voice:
        raise SystemExit(f'Falta marcador final en voice.js: {marker}')
VOICE.write_text(voice, encoding='utf-8')

css = CSS.read_text(encoding='utf-8')
if '.voice-academy-video{' not in css:
    css += r'''.voice-academy-interactive{border-color:rgba(142,216,255,.22)!important;background:rgba(7,95,145,.09)!important}.voice-academy-video{padding:14px;margin:10px 0 14px;border-radius:16px;border:1px solid rgba(242,194,78,.22);background:linear-gradient(145deg,rgba(216,165,45,.07),rgba(7,95,145,.08))}.voice-academy-video-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap}.voice-academy-video-head h3{margin:7px 0 0!important;color:#fff!important;font-size:18px!important}.voice-academy-video>p{margin:10px 0 12px!important;color:#dceaf3!important}.academy-video-player{position:relative;min-height:210px;border-radius:15px;overflow:hidden;background:rgba(0,0,0,.28);display:grid;place-items:center}.academy-video-player video{display:none;width:100%;max-height:440px;background:#000}.academy-video-player.has-video video{display:block}.academy-video-player.has-video .academy-video-fallback{display:none}.academy-video-fallback{display:grid;gap:8px;place-items:center;text-align:center;padding:24px 18px;color:#f4f8fb}.academy-video-fallback small{max-width:540px;color:#cfe8f7;line-height:1.45}.academy-video-icon{font-size:42px}.academy-story{margin-top:12px;padding:14px;border-radius:14px;background:rgba(0,0,0,.18);border:1px solid rgba(142,216,255,.15)}.academy-story-progress{height:8px;border-radius:999px;background:rgba(255,255,255,.09);overflow:hidden}.academy-story-progress span{display:block;height:100%;width:0;background:#8ed8ff;transition:width .25s ease}.academy-story-count{margin:9px 0 4px;color:#9fcfea;font-size:12px;font-weight:800}.academy-story-scene{min-height:90px;display:grid;place-items:center;text-align:center;padding:14px;border-radius:12px;background:rgba(142,216,255,.07);font-size:18px;font-weight:800;color:#fff;line-height:1.4}@media(max-width:520px){.academy-video-player{min-height:185px}.academy-story-scene{font-size:16px}}'''
CSS.write_text(css, encoding='utf-8')

sw = SW.read_text(encoding='utf-8')
sw = re.sub(r"^const CACHE='[^']+';", "const CACHE='la-grey-v3-198-academy-complete';", sw, count=1, flags=re.M)
SW.write_text(sw, encoding='utf-8')

VIDEO_README.parent.mkdir(parents=True, exist_ok=True)
VIDEO_README.write_text('''# Videos de Academia La Grey\n\nEsta carpeta usa nombres estables. Los reproductores ya están integrados en `voice.js`.\n\nArchivos esperados:\n\n- `voice-advanced-01-mix.mp4`\n- `voice-advanced-02-passaggio.mp4`\n- `voice-advanced-03-dynamics.mp4`\n- `voice-advanced-04-intervals.mp4`\n- `voice-advanced-05-harmony.mp4`\n- `voice-advanced-06-endurance.mp4`\n- `voice-advanced-07-agility.mp4`\n- `voice-advanced-08-setlist.mp4`\n\nHasta que exista cada MP4, La Grey muestra dentro de la misma ventana una guía audiovisual de escenas. No hay error visible ni dependencia de conexión para leer la clase.\n\nRecomendación de entrega: MP4 H.264/AAC, 1080p o 720p, relación 16:9, voz clara, música de fondo mínima o nula durante demostraciones vocales.\n''', encoding='utf-8')

SCRIPTS.write_text('''# Academia La Grey — Guiones de videos IA v1\n\nEstos guiones corresponden uno a uno con los IDs estables del curso de Voz avanzada. Están pensados para producir videos breves de 3–6 minutos con avatar/profesor o narración + gráficos, y luego guardar el MP4 en `academy-videos/`.\n\n## 01 — Mezcla vocal y transición de registros\n**Archivo:** `voice-advanced-01-mix.mp4`  \n**Duración:** 4–5 min\n\nNarración: Explica que mezcla no es una voz nueva ni una orden de cantar más fuerte. Presenta la idea de ajustar peso, vocal e intensidad al subir. Demuestra primero una sirena pequeña con NG/Woo y luego MUM. Contrasta una subida empujada con una coordinada, sin exagerar ni normalizar tensión. Termina aplicándolo a una frase que sube hacia un coro.\n\nEscenas: definición → error común → demostración NG/Woo → demostración MUM → aplicación musical → recordatorio de seguridad.\n\n## 02 — Passaggio sin tensión\n**Archivo:** `voice-advanced-02-passaggio.mp4`  \n**Duración:** 4–5 min\n\nNarración: Define el passaggio como zona de reorganización. Enseña a practicar alrededor de la transición en vez de atacar una sola nota repetidamente. Demuestra NG-A 1–2–3–2–1 y MUM/NO 1–3–5–3–1. Repite que subir por semitonos solo procede mientras la repetición anterior siga cómoda.\n\nEscenas: reconocer la zona → qué no hacer → NG-A → MUM/NO → frase del repertorio → detenerse ante dolor o ronquera.\n\n## 03 — Control dinámico y volumen útil\n**Archivo:** `voice-advanced-03-dynamics.mp4`  \n**Duración:** 3–4 min\n\nNarración: Diferencia suave, medio y firme de sus extremos: aireado sin control, grito o competencia con la banda. Explica cómo el micrófono permite reservar voz. Demuestra una misma frase en tres intensidades manteniendo afinación y mandíbula libre.\n\nEscenas: contraste dinámico → micrófono/monitor → ejemplo suave → medio → firme → aplicación verso/pre-coro/coro.\n\n## 04 — Afinación avanzada e intervalos\n**Archivo:** `voice-advanced-04-intervals.mp4`  \n**Duración:** 4–5 min\n\nNarración: Enseña a escuchar mentalmente el destino antes de cantar. Demuestra 1→3, 1→5 y un arpegio 1–3–5–8–5–3–1. Señala la diferencia entre llegar directo y deslizar hasta encontrar la nota.\n\nEscenas: anticipación auditiva → 1→3 → 1→5 → arpegio → entrada después de silencio → uso puntual del afinador.\n\n## 05 — Armonías para ministerios de alabanza\n**Archivo:** `voice-advanced-05-harmony.mp4`  \n**Duración:** 5–6 min\n\nNarración: Introduce raíz, tercera y quinta sin convertir la clase en teoría extensa. Demuestra cómo sostener la tercera mientras otra voz lleva melodía. Explica dónde una segunda voz entra y sale, y por qué no conviene armonizar cada frase.\n\nEscenas: tríada → escuchar funciones → sostener tercera → melodía vs armonía → entrada/salida → ejemplo de coro con unísono y armonía.\n\n## 06 — Resistencia vocal en ensayos y cultos\n**Archivo:** `voice-advanced-06-endurance.mp4`  \n**Duración:** 4–5 min\n\nNarración: Aclara que resistencia no significa tolerar dolor. Explica distribución de carga, intensidad sostenible, uso del micrófono, pausas instrumentales y reparto entre cantantes. Muestra un mini circuito de preparación y señales claras para detenerse.\n\nEscenas: mito de aguantar → planificación del set → descansos → circuito → señales de alerta → recuperación.\n\n## 07 — Agilidad y melismas controlados\n**Archivo:** `voice-advanced-07-agility.mp4`  \n**Duración:** 4–5 min\n\nNarración: Enseña que un melisma válido debe funcionar lento. Demuestra cinco notas a 80 BPM, después un adorno corto y solo aumenta velocidad tras tres repeticiones limpias. Recuerda que la mandíbula no marca las notas y que un adorno debe servir a la canción.\n\nEscenas: lento primero → patrón de cinco notas → melisma corto → regla de tres → error de mandíbula → versión simple vs adornada.\n\n## 08 — Preparación vocal de un repertorio real\n**Archivo:** `voice-advanced-08-setlist.mp4`  \n**Duración:** 5–6 min\n\nNarración: Recorre un setlist ficticio y marca tono oficial, frase exigente, armonías, canto continuo y descansos. Explica cómo ordenar canciones para no acumular carga y cómo calentar según el repertorio que realmente se cantará.\n\nEscenas: revisar set → tonos → frases críticas → reparto de voces → distribución de carga → calentamiento específico → checklist final.\n\n## Reglas de producción\n\n- No prometer diagnósticos ni resultados médicos.\n- Nunca presentar dolor, ardor o ronquera creciente como parte normal del entrenamiento.\n- Evitar demostraciones extremas de rango.\n- Usar los mismos nombres e IDs de la app.\n- Mantener el video corto: la práctica sucede después dentro de La Grey con el piano interactivo.\n- La música de fondo no debe tapar demostraciones, notas de piano ni voz hablada.\n''', encoding='utf-8')

print('Academia completa preparada: interactivos, reproductores, fallback audiovisual, guiones y cache v198.')
