(()=>{
'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const lang=()=>localStorage.getItem('lagrey_language')==='en'?'en':'es',tx=(es,en)=>lang()==='en'?en:es;
const ex=(name,pattern,syllables,tip,why,example,tempo=90)=>({name,pattern,syllables,tip,why,example,tempo});
const timed=(name,duration,syllables,tip,why,example)=>({name,timed:true,duration,syllables,tip,why,example});

const extras={
 warm:[
  ex('Zumbido ascendente suave',[0,2,4,5,7,5,4,2,0],['MMM','NG','VVV'],'Mantén poco volumen y sensación fácil.','Activa la voz progresivamente sin exigirla.','Sigue el piano con un zumbido cómodo y uniforme.',80),
  ex('Woo en arpegio',[0,4,7,12,7,4,0],['WOO','UU','HOO'],'Deja los labios redondeados y evita empujar el agudo.','Ayuda a conectar las zonas de la voz con ligereza.','Haz cada salto como si llamaras suavemente a alguien.',76),
  ex('Gee de tres notas',[0,2,4,2,0],['GEE','GI','DI'],'Ataque pequeño y mandíbula relajada.','Despierta precisión y coordinación al comenzar a cantar.','Canta cada nota clara, sin aumentar el volumen.',88),
  ex('MMM → MA de cinco notas',[0,2,4,5,7,5,4,2,0],['MMM-MA','MMM-ME','MMM-MO'],'Abre la vocal sin perder la facilidad del zumbido.','Conecta resonancia y vocales antes de cantar repertorio.','Empieza en MMM y abre a la vocal a mitad del patrón.',84),
  ex('NOO descendente',[7,5,4,2,0],['NOO','NU','MO'],'Piensa en soltar al descender, no en oscurecer la voz.','Calienta la zona media y baja sin presión.','Empieza cómodo arriba y deja caer las notas suavemente.',78),
  ex('Trino de labios en arpegio',[0,4,7,12,7,4,0],['Brrr','Vvv','Zzz'],'Mantén el flujo de aire constante y el rostro suelto.','Coordina aire y sonido en un recorrido más amplio.','Haz el patrón completo sin aumentar la fuerza al subir.',74),
  ex('Cinco notas cortas y ligeras',[0,2,4,5,7,5,4,2,0],['GU','DI','BU'],'Notas pequeñas y elásticas; no golpees la garganta.','Activa articulación y respuesta vocal antes del repertorio.','Haz cada sílaba ligera, como pequeños rebotes.',96)
 ],
 breath:[
  timed('F sostenida',40,['FFF'],'Inhala cómodo y deja salir el aire sin apretar el abdomen.','Entrena un flujo continuo y estable.','Sostén “fff” parejo y termina antes de quedarte sin aire.'),
  timed('SH sostenida',40,['SHHH'],'Hombros quietos y salida de aire uniforme.','Mejora el control de una exhalación larga.','Haz “shhh” como pidiendo silencio, sin empujar.'),
  timed('Inhala 4 · exhala 8',50,['SSS'],'No llenes al máximo; toma una respiración cómoda.','Practica una salida de aire más larga que la entrada.','Inhala 4 tiempos y suelta en “sss” durante 8.'),
  timed('Cuatro pulsos + siseo',45,['TS-TS-TS-TS · SSS'],'Haz los pulsos pequeños y luego estabiliza el aire.','Combina ataques breves con flujo sostenido.','Haz 4 pulsos “ts” y continúa con un “sss” largo.'),
  timed('Z vibrada continua',40,['ZZZ'],'Mantén labios y mandíbula libres.','Une flujo de aire con vibración sonora ligera.','Sostén “zzz” estable, sin subir el volumen.'),
  timed('Conteo en una exhalación',45,['1-2-3-4...'],'Habla a volumen normal y detente antes de sentir urgencia.','Ayuda a administrar aire durante frases habladas o cantadas.','Inhala cómodo y cuenta despacio hasta donde siga fácil.'),
  timed('S · F · SH por bloques',45,['SSS · FFF · SHHH'],'Usa el mismo nivel de aire en las tres consonantes.','Entrena cambios de resistencia sin perder estabilidad.','Haz unos segundos de S, luego F y luego SH, con una respiración entre rondas.')
 ],
 resonance:[
  ex('NNN → A',[0,2,4,2,0],['NNN-A','NNN-E','NNN-O'],'Conserva la sensación fácil al abrir la vocal.','Conecta vibración anterior con vocales de canto.','Haz NNN al inicio y abre a la vocal sin cambiar el volumen.',80),
  ex('ZZZ de cinco notas',[0,2,4,5,7,5,4,2,0],['ZZZ','VVV','MMM'],'Busca vibración cómoda en labios y rostro.','Favorece una emisión enfocada con poco esfuerzo.','Sigue las notas manteniendo la consonante vibrante.',84),
  ex('VEE ligero',[0,2,4,5,7,5,4,2,0],['VEE','VII','VAI'],'No aprietes los dientes; deja que la vocal fluya.','Trabaja claridad y sensación frontal de forma suave.','Canta el patrón con V breve y vocal larga.',88),
  ex('Sirena corta en NG',[0,4,7,12,7,4,0],['NG','MMM','WOO'],'Sube solo dentro de una zona cómoda.','Ayuda a mantener continuidad de resonancia al cambiar de altura.','Imagina una sirena pequeña que sube y baja sin empujar.',72),
  ex('MEE en arpegio',[0,4,7,12,7,4,0],['MEE','MII','MAY'],'Mantén el sonido pequeño y flexible.','Entrena foco durante saltos más amplios.','Haz cada salto limpio conservando la misma facilidad.',80),
  ex('MOM descendente',[7,5,4,2,0],['MOM','MUM','NON'],'No hundas la laringe ni fabriques oscuridad.','Explora resonancia en descenso con una emisión natural.','Deja caer las notas mientras mantienes la consonante suave.',76),
  ex('Humming de octava',[0,4,7,12,7,4,0],['MMM','NNN'],'Volumen bajo y sensación estable durante todo el recorrido.','Refuerza continuidad de resonancia en un rango mayor.','Haz el arpegio entero sin cambiar la presión.',74)
 ],
 pitch:[
  ex('Nota repetida estable',[0,0,0,0],['MA','NO','DI'],'No corrijas con fuerza; escucha y centra cada repetición.','Entrena estabilidad sobre una misma altura.','El piano repite la nota y tú la reproduces cuatro veces.',68),
  ex('Intervalo 1–3–1',[0,4,0],['MI','NO','YA'],'Escucha la distancia antes de cantar.','Refuerza reconocimiento y precisión de terceras.','Imita raíz, tercera y regreso a la raíz sin deslizar.',72),
  ex('Intervalo 1–5–1',[0,7,0],['NO','GO','MA'],'Mantén el salto limpio y ligero.','Entrena quintas, frecuentes en melodías y armonías.','Escucha las tres notas y luego repítelas con ataques claros.',70),
  ex('Arpegio descendente',[12,7,4,0],['LO','NE','TU'],'No arrastres las notas durante el descenso.','Trabaja afinación al bajar por notas separadas.','Empieza en la nota alta cómoda y baja por el arpegio.',76),
  ex('Escala de cinco notas',[0,2,4,5,7,5,4,2,0],['LA','ME','NO'],'Mantén cada grado centrado y con el mismo volumen.','Refuerza afinación paso a paso.','Una nota por sílaba, escuchando el centro de cada sonido.',82),
  ex('Eco de octava',[0,12,0],['UU','NO','YA'],'Haz la octava solo si está dentro de tu zona cómoda.','Entrena reconocimiento de una misma nota en otra altura.','Escucha grave, octava y regreso; luego imita.',66),
  ex('Secuencia mixta',[0,4,2,5,4,2,0],['DI','ME','LO'],'Piensa cada nota antes de emitirla.','Combina pasos y pequeños saltos para desafiar la precisión.','Sigue el piano sin deslizar entre las alturas.',78)
 ],
 range:[
  ex('Quinta progresiva',[0,2,4,5,7,5,4,2,0],['NU','NO','MUM'],'Mueve el ejercicio por semitonos solo mientras siga cómodo.','Amplía gradualmente la zona útil sin buscar extremos.','Haz varias repeticiones y detente ante cualquier presión.',74),
  ex('Arpegio de octava cómodo',[0,4,7,12,7,4,0],['GUG','WOO','MUM'],'La nota superior debe sentirse ligera, nunca perseguida.','Explora extensión con una referencia clara de octava.','Sube por el arpegio y vuelve sin aumentar el volumen.',70),
  ex('Sirena corta por grados',[0,5,9,12,9,5,0],['UU','NG','WOO'],'Haz un recorrido pequeño antes de mover la tonalidad.','Trabaja transición entre zonas sin sostener extremos.','Desliza mentalmente el recorrido pero canta las notas del piano.',68),
  ex('Octava descendente gradual',[12,11,9,7,5,4,2,0],['OH','UH','NO'],'Deja que la voz baje con naturalidad.','Explora el registro bajo desde una posición cómoda.','Empieza arriba dentro de tu rango y desciende paso a paso.',72),
  ex('1–5–8–5–1',[0,7,12,7,0],['WOO','NU','GO'],'No aumentes presión para alcanzar la octava.','Entrena extensión con pocos saltos y mucho control.','Haz el patrón lento y ligero; baja si la octava no sale fácil.',68),
  ex('1–3–5–8–5–3–1',[0,4,7,12,7,4,0],['MUM','GUG','NAY'],'Mantén volumen moderado y mandíbula libre.','Recorre una octava completa con apoyo de arpegio.','Piensa en subir por escalones, no en atacar la nota alta.',72),
  ex('Barrido de zona media-alta',[0,2,4,5,7,9,7,5,4,2,0],['NU','MI','GEE'],'Detente antes de llegar a una nota que exija esfuerzo.','Ayuda a conocer el límite cómodo del día.','Sube el patrón por semitonos solo mientras todas las notas permanezcan fáciles.',76)
 ],
 agility:[
  ex('Escala rápida de cinco notas',[0,2,4,5,7,5,4,2,0],['DI','GI','NE'],'Primero precisión; luego velocidad.','Entrena cambios rápidos entre grados conjuntos.','Mantén las notas pequeñas y perfectamente rítmicas.',120),
  ex('Terceras encadenadas',[0,4,2,5,4,7,5,4,2,0],['MI','YA','NO'],'No sacrifiques afinación por correr.','Coordina saltos alternados dentro de una frase rápida.','Escucha el dibujo del piano y repítelo con ataques mínimos.',108),
  ex('Arpegio rápido',[0,4,7,12,7,4,0],['GO','MUM','NAY'],'Ligero en la nota alta y exacto al descender.','Mejora respuesta en saltos rápidos.','Empieza a tempo moderado y sube solo si sigue limpio.',104),
  ex('Giro 1–2–3–2–3–4–3–2–1',[0,2,4,2,4,5,4,2,0],['DA','GA','LE'],'Mantén la lengua suelta y el pulso estable.','Entrena cambios de dirección rápidos.','No acentúes cada nota; deja fluir el patrón.',116),
  ex('Descenso veloz de cinco notas',[7,5,4,2,0],['NE','DI','GO'],'No te adelantes al piano.','Trabaja limpieza al bajar rápidamente.','Haz cada nota reconocible aunque el patrón sea corto.',122),
  ex('1–3–2–4–3–5',[0,4,2,5,4,7,4,2,0],['MI','NO','YA'],'Empieza más lento de lo que crees necesario.','Desarrolla coordinación en patrones menos previsibles.','Sube el tempo únicamente cuando todas las notas sean claras.',106),
  ex('Staccato ligero de cinco notas',[0,2,4,5,7,5,4,2,0],['GU','BU','DI'],'Ataques diminutos; nada de golpes de garganta.','Mejora velocidad y respuesta con notas separadas.','Piensa en pequeños rebotes, no en empujar cada sílaba.',126)
 ],
 diction:[
  ex('P–T–K coordinadas',[0,2,4,2,0],['PA-TA-KA','PE-TE-KE','PI-TI-KI'],'Consonantes breves y vocales libres.','Entrena precisión de labios y lengua.','Habla primero el patrón y luego cántalo.',94),
  ex('B–D–G sonoras',[0,2,4,5,7,5,4,2,0],['BA-DA-GA','BE-DE-GE','BI-DI-GI'],'No aprietes la mandíbula al articular.','Mejora claridad de consonantes sonoras.','Deja que la vocal lleve la nota y la consonante sea breve.',92),
  ex('R vocales claras',[0,2,4,2,0],['RA-RE-RI-RO-RU','LA-LE-LI-LO-LU'],'Haz la R natural; no la fuerces si se tensa la lengua.','Trabaja definición de sílabas frecuentes en español.','Pronuncia cada vocal distinta sin cambiar el volumen.',86),
  ex('L–N–M alternadas',[0,2,4,5,7,5,4,2,0],['LA-NA-MA','LE-NE-ME','LI-NI-MI'],'Mantén la punta de la lengua ágil y la mandíbula libre.','Coordina articuladores sin perder el legato.','Haz consonantes claras pero deja unidas las vocales.',90),
  ex('Cadena de vocales',[0,2,4,5,7,5,4,2,0],['A-E-I-O-U','MA-ME-MI-MO-MU'],'No exageres la apertura de la boca.','Entrena cambios de vocal conservando una emisión estable.','Mantén el mismo tono y energía al cambiar de vocal.',84),
  ex('P vocal por vocal',[0,2,4,2,0],['PA-PE-PI-PO-PU','TA-TE-TI-TO-TU'],'Consonante rápida; vocal larga y clara.','Mejora inteligibilidad sin endurecer el ataque.','Una sílaba por nota, cuidando que todas se entiendan.',96),
  ex('DA–GA–TA–KA rítmico',[0,2,4,5,7,5,4,2,0],['DA-GA-TA-KA','BA-DA-GA-TA'],'Mantén el patrón hablado incluso cuando aumente el tempo.','Combina dicción y ritmo para frases rápidas.','Primero dilo a tiempo y después cántalo con el piano.',102)
 ],
 cool:[
  ex('MMM de tres notas descendentes',[4,2,0],['MMM','NNN'],'Muy suave y sin buscar volumen.','Reduce gradualmente la intensidad vocal.','Haz tres notas cómodas y deja que la última termine sola.',62),
  ex('NG descendente corto',[7,4,2,0],['NG','MMM'],'Mandíbula suelta y sensación pequeña.','Ayuda a volver a una coordinación ligera después de cantar.','Desciende sin sostener de más ninguna nota.',64),
  ex('OO de cinco notas descendentes',[7,5,4,2,0],['OO','UU'],'Usa menos volumen que durante el entrenamiento.','Favorece una salida gradual del trabajo vocal.','Deja caer las notas como si apagaras lentamente el sonido.',62),
  ex('VVV descendente',[7,5,4,2,0],['VVV','ZZZ'],'Mantén la vibración pequeña y cómoda.','Combina flujo de aire y sonido ligero al terminar.','Sigue el descenso con una V continua y suave.',64),
  ex('HOO de suspiro',[12,7,4,0],['HOO','HAA'],'No proyectes; debe sentirse como un suspiro sonoro.','Ayuda a reducir presión y volumen después del canto.','Empieza cómodo y deja que cada nota caiga con menos energía.',58),
  ex('Sirena descendente suave',[12,9,7,5,4,2,0],['UU','NG'],'No persigas graves; simplemente deja descender la voz.','Devuelve la voz hacia una emisión conversacional cómoda.','Haz el recorrido una o dos veces a volumen bajo.',60),
  timed('Exhalación tranquila final',40,['FFF','SSS'],'Respira normalmente; no intentes vaciar todo el aire.','Cierra la sesión con respiración calmada y sin fonación intensa.','Inhala cómodo y suelta el aire suavemente; descansa entre repeticiones.')
 ]
};

const extraEN={
 warm:[
  ['Gentle rising hum','Keep the volume low and the sensation easy.','Gradually activates the voice without overworking it.','Follow the piano with a comfortable, even hum.'],
  ['Woo arpeggio','Keep the lips rounded and avoid pushing the high note.','Helps connect areas of the voice with lightness.','Make each leap as if softly calling someone.'],
  ['Three-note Gee','Use a small onset and keep the jaw relaxed.','Wakes up precision and coordination when you begin singing.','Sing each note clearly without increasing the volume.'],
  ['Five-note MMM → MA','Open the vowel without losing the ease of the hum.','Connects resonance and vowels before singing the setlist.','Start on MMM and open to the vowel halfway through the pattern.'],
  ['Descending NOO','Think about releasing as you descend, not darkening the voice.','Warms the middle and lower area without pressure.','Start comfortably higher and let the notes fall gently.'],
  ['Lip trill arpeggio','Keep the airflow steady and the face relaxed.','Coordinates airflow and sound across a wider path.','Do the full pattern without adding force as you go higher.'],
  ['Short, light five notes','Keep the notes small and springy; do not strike the throat.','Activates articulation and vocal response before the setlist.','Make each syllable light, like small bounces.']
 ],
 breath:[
  ['Sustained F','Inhale comfortably and let the air out without tightening the abdomen.','Trains a continuous, steady airflow.','Hold “fff” evenly and stop before you run out of air.'],
  ['Sustained SH','Keep the shoulders still and the airflow even.','Improves control of a long exhalation.','Do “shhh” as if asking for quiet, without pushing.'],
  ['Inhale 4 · exhale 8','Do not fill to the maximum; take a comfortable breath.','Practices an exhalation that is longer than the inhale.','Inhale for 4 counts and release on “sss” for 8.'],
  ['Four pulses + hiss','Make the pulses small and then stabilize the airflow.','Combines brief attacks with sustained airflow.','Do 4 “ts” pulses and continue with a long “sss”.'],
  ['Continuous voiced Z','Keep the lips and jaw free.','Combines airflow with light vocal vibration.','Hold “zzz” steadily without increasing the volume.'],
  ['Count on one exhale','Speak at normal volume and stop before you feel urgency.','Helps manage breath during spoken or sung phrases.','Inhale comfortably and count slowly while it still feels easy.'],
  ['S · F · SH in blocks','Use the same airflow level on all three consonants.','Trains changes in resistance without losing stability.','Do a few seconds of S, then F, then SH, with one breath between rounds.']
 ],
 resonance:[
  ['NNN → A','Keep the easy sensation when opening the vowel.','Connects forward vibration with sung vowels.','Start with NNN and open to the vowel without changing volume.'],
  ['Five-note ZZZ','Find comfortable vibration in the lips and face.','Encourages focused sound production with little effort.','Follow the notes while keeping the consonant buzzing.'],
  ['Light VEE','Do not clench the teeth; let the vowel flow.','Works on clarity and a gentle forward sensation.','Sing the pattern with a short V and a long vowel.'],
  ['Short NG siren','Go higher only within a comfortable range.','Helps maintain resonance continuity as pitch changes.','Imagine a small siren moving up and down without pushing.'],
  ['MEE arpeggio','Keep the sound small and flexible.','Trains focus across wider leaps.','Make each leap clean while keeping the same ease.'],
  ['Descending MOM','Do not depress the larynx or manufacture darkness.','Explores resonance while descending with natural production.','Let the notes fall while keeping the consonant gentle.'],
  ['Octave humming','Use low volume and a steady sensation throughout.','Reinforces resonance continuity over a wider range.','Do the whole arpeggio without changing pressure.']
 ],
 pitch:[
  ['Stable repeated note','Do not correct forcefully; listen and center each repetition.','Trains stability on the same pitch.','The piano repeats the note and you reproduce it four times.'],
  ['Interval 1–3–1','Hear the distance before singing.','Reinforces recognition and accuracy of thirds.','Imitate the root, third and return to the root without sliding.'],
  ['Interval 1–5–1','Keep the leap clean and light.','Trains fifths, which are common in melodies and harmonies.','Listen to the three notes and repeat them with clear onsets.'],
  ['Descending arpeggio','Do not drag the notes during the descent.','Works on pitch while descending through separate notes.','Start on a comfortable high note and descend through the arpeggio.'],
  ['Five-note scale','Keep every degree centered and at the same volume.','Reinforces pitch step by step.','Use one note per syllable and listen for the center of each sound.'],
  ['Octave echo','Do the octave only if it is within your comfortable range.','Trains recognition of the same note in another register.','Listen to the low note, octave and return; then imitate.'],
  ['Mixed sequence','Think each note before producing it.','Combines steps and small leaps to challenge accuracy.','Follow the piano without sliding between pitches.']
 ],
 range:[
  ['Progressive fifth','Move the exercise by semitones only while it remains comfortable.','Gradually expands the useful range without chasing extremes.','Do several repetitions and stop at any sign of pressure.'],
  ['Comfortable octave arpeggio','The top note should feel light, never chased.','Explores extension with a clear octave reference.','Go up and back through the arpeggio without increasing volume.'],
  ['Short siren by degrees','Use a small path before moving the key.','Works on transitions between areas without holding extremes.','Mentally glide through the path but sing the piano notes.'],
  ['Gradual descending octave','Let the voice descend naturally.','Explores the lower register from a comfortable position.','Start higher within your range and descend step by step.'],
  ['1–5–8–5–1','Do not increase pressure to reach the octave.','Trains extension with a few controlled leaps.','Keep the pattern slow and light; lower the key if the octave is not easy.'],
  ['1–3–5–8–5–3–1','Keep a moderate volume and relaxed jaw.','Covers a full octave with arpeggio support.','Think of climbing steps, not attacking the high note.'],
  ['Middle-high range sweep','Stop before reaching a note that requires effort.','Helps identify today’s comfortable limit.','Move the pattern up by semitones only while every note stays easy.']
 ],
 agility:[
  ['Fast five-note scale','Accuracy first; speed second.','Trains quick changes between adjacent scale degrees.','Keep the notes small and perfectly rhythmic.'],
  ['Chained thirds','Do not sacrifice pitch for speed.','Coordinates alternating leaps inside a fast phrase.','Listen to the piano shape and repeat it with minimal attacks.'],
  ['Fast arpeggio','Stay light on the high note and exact on the way down.','Improves response in quick leaps.','Start at a moderate tempo and increase only if it stays clean.'],
  ['Turn 1–2–3–2–3–4–3–2–1','Keep the tongue loose and the pulse steady.','Trains quick changes of direction.','Do not accent every note; let the pattern flow.'],
  ['Fast five-note descent','Do not get ahead of the piano.','Works on clarity while descending quickly.','Make every note recognizable even though the pattern is short.'],
  ['1–3–2–4–3–5','Start slower than you think you need to.','Builds coordination in less predictable patterns.','Increase the tempo only when every note is clear.'],
  ['Light five-note staccato','Use tiny onsets; no throat strikes.','Improves speed and response with separated notes.','Think of small bounces, not pushing each syllable.']
 ],
 diction:[
  ['Coordinated P–T–K','Use brief consonants and free vowels.','Trains precision of the lips and tongue.','Speak the pattern first and then sing it.'],
  ['Voiced B–D–G','Do not clench the jaw while articulating.','Improves clarity of voiced consonants.','Let the vowel carry the note and keep the consonant brief.'],
  ['R with clear vowels','Use a natural R; do not force it if the tongue becomes tense.','Works on definition of common syllable patterns.','Pronounce each vowel distinctly without changing volume.'],
  ['Alternating L–N–M','Keep the tongue tip agile and the jaw relaxed.','Coordinates articulators without losing legato.','Make consonants clear while keeping the vowels connected.'],
  ['Vowel chain','Do not exaggerate the mouth opening.','Trains vowel changes while keeping stable sound production.','Keep the same pitch and energy while changing vowels.'],
  ['P through each vowel','Use a quick consonant and a long, clear vowel.','Improves intelligibility without hardening the onset.','Use one syllable per note and make sure each one is understandable.'],
  ['Rhythmic DA–GA–TA–KA','Keep the spoken pattern even as the tempo increases.','Combines diction and rhythm for fast phrases.','Speak it in time first and then sing it with the piano.']
 ],
 cool:[
  ['Three-note descending MMM','Keep it very soft and do not seek volume.','Gradually reduces vocal intensity.','Do three comfortable notes and let the last one end naturally.'],
  ['Short descending NG','Keep the jaw relaxed and the sensation small.','Helps return to light coordination after singing.','Descend without holding any note too long.'],
  ['Five-note descending OO','Use less volume than during training.','Encourages a gradual exit from vocal work.','Let the notes fall as if slowly fading the sound.'],
  ['Descending VVV','Keep the vibration small and comfortable.','Combines airflow and light sound at the end.','Follow the descent with a continuous, gentle V.'],
  ['Sighing HOO','Do not project; it should feel like a voiced sigh.','Helps reduce pressure and volume after singing.','Start comfortably and let each note fall with less energy.'],
  ['Gentle descending siren','Do not chase low notes; simply let the voice descend.','Returns the voice toward comfortable conversational production.','Do the path once or twice at low volume.'],
  ['Calm final exhalation','Breathe normally; do not try to empty all the air.','Closes the session with calm breathing and no intense phonation.','Inhale comfortably and release the air gently; rest between repetitions.']
 ]
};

let ctx=null,stopToken=0;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
function degreeLabel(n){const map={0:'1',2:'2',4:'3',5:'4',7:'5',9:'6',11:'7',12:'8',16:'10'};return map[n]||'•'}
function midiFreq(m){return 440*Math.pow(2,(m-69)/12)}
function audio(){if(!ctx)ctx=new (window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume();return ctx}
function pianoNote(midi,when,dur=.32){const a=audio(),g=a.createGain(),o1=a.createOscillator(),o2=a.createOscillator();o1.type='triangle';o2.type='sine';o1.frequency.value=midiFreq(midi);o2.frequency.value=midiFreq(midi)*2;g.gain.setValueAtTime(.0001,when);g.gain.exponentialRampToValueAtTime(.14,when+.015);g.gain.exponentialRampToValueAtTime(.0001,when+dur);o1.connect(g);o2.connect(g);g.connect(a.destination);o1.start(when);o2.start(when);o1.stop(when+dur+.03);o2.stop(when+dur+.03)}
function translatedExtra(cat,i,e=extras[cat]?.[i]){if(!e||lang()!=='en')return e;const t=extraEN[cat]?.[i];return t?{...e,name:t[0],tip:t[1],why:t[2],example:t[3]}:e}

function exerciseHtml(cat,i,source){
 const e=translatedExtra(cat,i,source);
 if(e.timed)return `<article class="voice-exercise voice-extra-exercise"><h3>${e.name}</h3><p><b>${tx('Para qué sirve:','What it does:')}</b> ${e.why}</p><p><b>${tx('Cómo hacerlo:','How to do it:')}</b> ${e.tip}</p><p><b>${tx('Ejemplo:','Example:')}</b> ${e.example}</p><div class="voice-syllable-chip">${e.syllables.join(' · ')}</div><div class="voice-play-row"><button class="btn primary" data-extra-timer="${cat}:${i}">▶ ${tx('Iniciar','Start')} ${e.duration||30}s</button><button class="btn" data-extra-stop>■ ${tx('Detener','Stop')}</button></div><div class="voice-status" id="extra-status-${cat}-${i}">${tx('Listo para comenzar.','Ready to begin.')}</div></article>`;
 return `<article class="voice-exercise voice-extra-exercise"><h3>${e.name}</h3><div class="voice-pattern">${e.pattern.map(degreeLabel).join(' – ')}</div><p><b>${tx('Para qué sirve:','What it does:')}</b> ${e.why}</p><p><b>${tx('Cómo hacerlo:','How to do it:')}</b> ${e.tip}</p><p><b>${tx('Ejemplo:','Example:')}</b> ${e.example}</p><div class="voice-controls"><label>${tx('Sílaba','Syllable')}<select data-syllable>${e.syllables.map(s=>`<option>${s}</option>`).join('')}</select></label><label>${tx('Nota inicial','Starting note')}<select data-start><option value="48">C3 · Do3</option><option value="50">D3 · Re3</option><option value="52">E3 · Mi3</option><option value="53">F3 · Fa3</option><option value="55">G3 · Sol3</option><option value="57">A3 · La3</option><option value="60" selected>C4 · Do4</option></select></label><label>Tempo<input data-tempo type="range" min="55" max="150" value="${e.tempo||90}"><span data-tempo-label>${e.tempo||90} BPM</span></label><label>${tx('Repeticiones','Repetitions')}<select data-repeats><option>1</option><option selected>3</option><option>5</option><option>8</option></select></label><label>${tx('Movimiento','Movement')}<select data-shift><option value="0">${tx('No mover','Do not move')}</option><option value="1" selected>+½ ${tx('tono','step')}</option><option value="-1">−½ ${tx('tono','step')}</option></select></label></div><div class="voice-play-row"><button class="btn primary" data-extra-play="${cat}:${i}">▶ ${tx('Escuchar y practicar','Listen and practice')}</button><button class="btn" data-extra-demo="${cat}:${i}">🎹 ${tx('Solo ejemplo','Example only')}</button><button class="btn" data-extra-stop>■ ${tx('Detener','Stop')}</button></div><div class="voice-status" id="extra-status-${cat}-${i}">${tx('Listo. El piano tocará el patrón y luego podrás repetirlo.','Ready. The piano will play the pattern and then you can repeat it.')}</div></article>`;
}

function categoryFromList(list){
 const first=list.querySelector('[data-play],[data-timer]');
 if(!first)return null;
 const value=first.dataset.play||first.dataset.timer||'';
 return value.split(':')[0]||null;
}

function appendExtras(){
 $$('#voicePanel .voice-exercise-list').forEach(list=>{
  if(list.dataset.extraExercises==='1')return;
  const cat=categoryFromList(list);
  if(!cat||!extras[cat])return;
  list.dataset.extraExercises='1';
  list.insertAdjacentHTML('beforeend',extras[cat].map((e,i)=>exerciseHtml(cat,i,e)).join(''));
 });
}

function stop(){stopToken++;$$('.voice-extra-exercise .voice-status').forEach(s=>{if(!s.textContent.startsWith('✅'))s.textContent=tx('Detenido.','Stopped.')})}
async function play(button,demoOnly){
 stop();const token=++stopToken;const raw=button.dataset[demoOnly?'extraDemo':'extraPlay'];const [cat,idx]=raw.split(':'),n=Number(idx),e=extras[cat][n],box=button.closest('.voice-extra-exercise'),status=$(`#extra-status-${cat}-${idx}`),start=Number(box.querySelector('[data-start]').value),tempo=Number(box.querySelector('[data-tempo]').value),reps=demoOnly?1:Number(box.querySelector('[data-repeats]').value),shift=demoOnly?0:Number(box.querySelector('[data-shift]').value),syllable=box.querySelector('[data-syllable]').value;audio();
 for(let r=0;r<reps;r++){
  if(token!==stopToken)return;const root=start+r*shift,beat=60/tempo;status.textContent=`🎹 ${tx('Repetición','Repetition')} ${r+1}/${reps} · ${tx('canta','sing')} “${syllable}”`;let t=ctx.currentTime+.08;e.pattern.forEach(step=>{pianoNote(root+step,t,Math.max(.18,beat*.72));t+=beat});await wait(e.pattern.length*beat*1000+250);if(token!==stopToken)return;if(!demoOnly){status.textContent=`🎤 ${tx('Ahora repítelo tú con','Now repeat it with')} “${syllable}”`;await wait(Math.max(900,e.pattern.length*beat*700));}
 }
 status.textContent=demoOnly?tx('✅ Ejemplo terminado.','✅ Example finished.'):tx('✅ Ejercicio terminado. Si se sintió cómodo, puedes repetirlo.','✅ Exercise finished. If it felt comfortable, you can repeat it.');
}
function startTimer(button){
 const [cat,idx]=button.dataset.extraTimer.split(':'),n=Number(idx),e=translatedExtra(cat,n),status=$(`#extra-status-${cat}-${idx}`);stop();const token=++stopToken;let left=e.duration||30;status.textContent=`⏱️ ${left}s · ${e.example}`;const id=setInterval(()=>{if(token!==stopToken){clearInterval(id);return}left--;status.textContent=left>0?`⏱️ ${left}s · ${e.example}`:tx('✅ Terminado. Respira normalmente.','✅ Finished. Breathe normally.');if(left<=0)clearInterval(id)},1000);
}

document.addEventListener('click',event=>{
 const playBtn=event.target.closest('[data-extra-play]');if(playBtn){play(playBtn,false);return}
 const demoBtn=event.target.closest('[data-extra-demo]');if(demoBtn){play(demoBtn,true);return}
 const timerBtn=event.target.closest('[data-extra-timer]');if(timerBtn){startTimer(timerBtn);return}
 if(event.target.closest('[data-extra-stop]')){stop();return}
 if(event.target.closest('[data-voice-category-back],nav button,[data-home],[data-nav],[data-voice-home]'))stop();
},true);
document.addEventListener('input',event=>{const r=event.target.closest('.voice-extra-exercise [data-tempo]');if(r)r.parentElement.querySelector('[data-tempo-label]').textContent=r.value+' BPM'});

function boot(){const root=$('#voiceView')||document.body;new MutationObserver(appendExtras).observe(root,{childList:true,subtree:true});appendExtras()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
