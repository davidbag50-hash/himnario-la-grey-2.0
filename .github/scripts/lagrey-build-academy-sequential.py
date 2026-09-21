from pathlib import Path
import os
import shutil
import subprocess
import sys
import re
import torch
import soundfile as sf
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

ROOT = Path(os.environ.get("GITHUB_WORKSPACE", ".")).resolve()
VOICE_REF = Path("/tmp/passaggio-voice.wav")
SR = 24000

LESSONS = [
    {
        "id": "voice-advanced-01-mix",
        "slug": "mix",
        "label": "Mezcla vocal",
        "commit": "Corregir voz Academia · Mezcla vocal con referencia Passaggio",
        "narration": [
            "Bienvenido a Academia La Grey. En esta clase trabajaremos la mezcla vocal y la transición entre registros. La mezcla no es una voz nueva ni un lugar misterioso. Es una coordinación progresiva que permite subir sin convertir cada nota alta en más volumen y más presión. La meta es mantener continuidad mientras ajustamos peso, intensidad y vocal de manera gradual. Trabaja siempre en una zona cómoda y recuerda que una nota más alta no tiene que sentirse como una nota más pesada.",
            "Al subir, la voz necesita reorganizarse. Normalmente conviene reducir un poco el peso, mantener el cuello y la mandíbula libres y permitir que la vocal se vuelva más eficiente. No buscamos esconder la voz ni volverla débil. Buscamos conservar energía útil sin arrastrar una coordinación pesada hacia arriba. Si el sonido se vuelve más libre y repetible, vas por buen camino. Si cada repetición exige más fuerza, baja intensidad o vuelve a una nota más cómoda.",
            "Evita tres cosas. Primero, empujar la voz de pecho hacia arriba como si la única solución fuera cantar más fuerte. Segundo, levantar la barbilla o endurecer el cuello cuando aparece una nota difícil. Y tercero, repetir muchas veces una coordinación que ya se siente apretada. La práctica también entrena los hábitos incorrectos. Si aparece presión, reduce el volumen, cambia la nota inicial o descansa unos segundos antes de continuar.",
            "Vamos al primer ejercicio. Usa ene ge o u, con el patrón uno, tres, cinco, ocho, cinco, tres, uno. Empieza en una nota cómoda y mantén el sonido pequeño y continuo. La octava no se alcanza empujando. Permite que la voz se haga un poco más ligera al subir y detente si sientes que necesitas aumentar demasiado el volumen.",
            "Segundo ejercicio: MUM ligero, con el patrón uno, dos, tres, cuatro, cinco, cuatro, tres, dos, uno. Mantén la consonante clara, pero pequeña. La quinta debe sentirse tan coordinada como las primeras notas. Haz tres repeticiones cómodas antes de subir medio tono y vuelve atrás si el cuello o la mandíbula empiezan a endurecerse.",
            "Lleva ahora esa coordinación a tu repertorio. Elige una frase de coro que pase de tu zona media hacia una nota más alta. Cántala primero con menos intensidad y busca la misma continuidad de los ejercicios. Después aumenta la expresión sin añadir presión innecesaria. La meta no es sonar pequeño, sino tener opciones. Si aparece dolor, ardor o una ronquera que empeora, detén la práctica. La técnica debe ayudarte a servir mejor, no a pelear contra tu voz."
        ],
    },
    {
        "id": "voice-advanced-03-dynamics",
        "slug": "dynamics",
        "label": "Control dinámico",
        "commit": "Corregir voz Academia · Control dinámico con referencia Passaggio",
        "narration": [
            "Bienvenido a Academia La Grey. En esta clase vamos a trabajar control dinámico y volumen útil. Cantar suave no significa cantar sin apoyo, y cantar firme no significa gritar. La dinámica es una herramienta musical para crear contraste y comunicar mejor el texto sin obligar a la voz a trabajar siempre al máximo.",
            "Cuando cambias de suave a medio o de medio a firme, la afinación debería mantenerse estable y el cuello no tendría que endurecerse. Piensa en intensidad útil, no en volumen absoluto. El micrófono está para amplificarte. No necesitas competir acústicamente con la batería, las guitarras o los monitores.",
            "Evita tres hábitos. Cantar toda la canción al cien por ciento. Aumentar presión cuando quieres expresar más emoción. Y subir el volumen porque no te escuchas bien en el monitor. Si el monitoreo no ayuda, corrige el sistema o tu posición antes de pedirle más a la garganta.",
            "Primer ejercicio. Haz cinco notas con eme, y abre después hacia MA. Empieza suave y conserva una afinación estable. Repite a intensidad media sin levantar la barbilla. El objetivo es que la voz crezca sin endurecerse y que la consonante siga clara sin golpear.",
            "Segundo ejercicio. En una nota cómoda haz una secuencia de intensidad: suave, medio, firme, medio y suave. No busques tu máximo volumen. Escucha si el centro de la nota se mantiene igual y observa si puedes disminuir la intensidad sin que la voz se apague o se caiga de afinación.",
            "Ahora aplícalo al repertorio. Toma un verso, un pre coro y un coro. Planea un crecimiento gradual en lugar de cantar todo con la misma intensidad. Reserva energía para los momentos que realmente la necesitan. Si la voz empieza a endurecerse, baja un nivel y usa el micrófono a tu favor. Control dinámico significa tener más opciones musicales con menos desgaste."
        ],
    },
    {
        "id": "voice-advanced-04-intervals",
        "slug": "intervals",
        "label": "Afinación e intervalos",
        "commit": "Corregir voz Academia · Afinación e intervalos con referencia Passaggio",
        "narration": [
            "Bienvenido a Academia La Grey. En esta clase trabajaremos afinación avanzada e intervalos. Afinar no es solamente llegar a una nota. También implica escuchar la referencia, anticipar la distancia y entrar de forma limpia sin deslizarte desde otra nota para encontrarla.",
            "Antes de cantar un salto, escucha mentalmente la nota de destino. Esa pequeña anticipación cambia la coordinación. Una entrada segura suele ser más pequeña y precisa, no más fuerte. Si no estás seguro de la nota, subir el volumen no la vuelve más correcta.",
            "Evita depender de tres atajos. Deslizarte hasta encontrar la nota. Cantar más fuerte cuando tienes duda. Y mirar el afinador durante toda la frase. El afinador puede verificar, pero el oído tiene que aprender a anticipar la relación entre las notas.",
            "Primer ejercicio. Escucha y canta saltos de uno a tres y de uno a cinco. Deja que el piano marque primero la distancia. Después entra directo, sin arrastre. Mantén un ataque pequeño y claro. Si la quinta se vuelve pesada, reduce intensidad antes de repetir.",
            "Segundo ejercicio. Trabaja el arpegio uno, tres, cinco, ocho, cinco, tres, uno. Imagina cada destino antes de cantarlo. Luego aísla pares como tres a cinco o cinco a ocho. Tres repeticiones limpias valen más que muchas repeticiones corregidas a mitad del sonido.",
            "Llévalo ahora al repertorio. Busca una entrada después de un silencio o una frase que tenga un salto grande. Practica solo las dos notas implicadas. Cuando puedas entrar directo varias veces, devuelve esas notas a la frase completa. La precisión nace de escuchar primero y cantar después."
        ],
    },
    {
        "id": "voice-advanced-05-harmony",
        "slug": "harmony",
        "label": "Armonías",
        "commit": "Corregir voz Academia · Armonías con referencia Passaggio",
        "narration": [
            "Bienvenido a Academia La Grey. En esta clase vamos a trabajar armonías para ministerios de alabanza. Una segunda voz útil no consiste en cantar cualquier nota diferente de la melodía. Debe pertenecer al acorde y cumplir una función dentro del arreglo.",
            "Empecemos con una tríada mayor: raíz, tercera y quinta. Aprende a reconocer cada función por separado. La raíz da estabilidad, la tercera define gran parte del color mayor o menor, y la quinta completa el acorde. Escuchar el acorde completo es tan importante como escuchar tu propia voz.",
            "Evita tres errores comunes. Improvisar terceras paralelas durante toda la canción. Llenar cada frase con voces secundarias. Y subir tu volumen cuando pierdes la armonía. Cuando te pierdes, escucha de nuevo el acorde y recupera tu función sin competir con la melodía principal.",
            "Primer ejercicio. El piano toca uno, tres y cinco. Repite cada nota por separado. Después alterna raíz y tercera sin deslizarte. Tu objetivo es reconocer la distancia y volver a tu nota aunque otra voz esté cantando algo diferente.",
            "Segundo ejercicio. Mantén la tercera mientras el piano repite la tríada. Hazlo a volumen moderado y deja espacio para escuchar alrededor. Si tu oído quiere regresar automáticamente a la melodía, baja tu volumen y vuelve a identificar la tercera antes de continuar.",
            "Ahora llévalo al ministerio. En un coro sencillo decide por escrito dónde entra la armonía, dónde sale, qué partes quedan al unísono y quién sostiene cada voz. No necesitas armonizar todo. Un arreglo claro, con entradas intencionales y buenos descansos, suele sonar más fuerte musicalmente que muchas voces compitiendo."
        ],
    },
    {
        "id": "voice-advanced-06-endurance",
        "slug": "endurance",
        "label": "Resistencia vocal",
        "commit": "Corregir voz Academia · Resistencia vocal con referencia Passaggio",
        "narration": [
            "Bienvenido a Academia La Grey. En esta clase trabajaremos resistencia vocal para ensayos y cultos. Resistencia no significa aguantar dolor ni cantar fuerte durante más tiempo. Significa administrar la voz para que siga coordinada durante una sesión larga.",
            "La resistencia se construye con eficiencia, pausas, tonos adecuados e intensidad sostenible. Una buena señal es terminar el ensayo con una voz parecida a como empezaste. Si cada canción exige el máximo, el problema no se resuelve simplemente intentando resistir más.",
            "Evita cantar todo a máxima intensidad, competir con el monitoreo y continuar cuando aparece dolor, ardor o una ronquera que empeora. El cansancio acumulado cambia la coordinación. Descansar a tiempo forma parte del entrenamiento, no es una falla.",
            "Antes de cantar, usa una preparación corta y progresiva. Respira con calma, haz trinos de labios y humming, y después algunas notas de afinación en zona media. No gastes tus notas más exigentes durante el calentamiento. El calentamiento prepara; no debería convertirse en otro concierto.",
            "Durante el set distribuye la carga. Aprovecha partes instrumentales, alterna voces principales y secundarias y usa el micrófono en lugar de competir por volumen. Revisa también si las canciones más exigentes están todas seguidas y si alguna línea puede delegarse a otro cantante.",
            "Después del servicio baja la intensidad. Un humming descendente y unos minutos de silencio pueden ser más útiles que seguir probando agudos. Si aparece dolor, pérdida marcada de voz o ronquera que empeora, detente. La meta de la resistencia es poder seguir sirviendo con una voz funcional mañana también."
        ],
    },
    {
        "id": "voice-advanced-07-agility",
        "slug": "agility",
        "label": "Agilidad y melismas",
        "commit": "Corregir voz Academia · Agilidad y melismas con referencia Passaggio",
        "narration": [
            "Bienvenido a Academia La Grey. En esta clase vamos a trabajar agilidad y melismas controlados. Un adorno rápido solo es útil cuando conserva ritmo, afinación y claridad. La velocidad no debería esconder notas que todavía no están coordinadas.",
            "Antes de acelerar un melisma, cántalo lento y asegúrate de que puedes identificar cada nota. La mandíbula no debe marcar cada cambio. Piensa en una línea continua donde cada nota tiene un lugar exacto dentro del pulso.",
            "Evita adornar cada final de frase, copiar melismas sin entender sus notas y acelerar para esconder problemas de afinación. Un adorno que no puedes cantar a mitad de velocidad todavía no está realmente bajo control.",
            "Primer ejercicio. Trabaja cinco notas rápidas a ochenta pulsos por minuto. Mantén ataques pequeños y claros. Haz tres repeticiones limpias antes de aumentar la velocidad. Si una nota empieza a borrarse, vuelve al tempo anterior.",
            "Segundo ejercicio. Crea un melisma corto de tres a cinco notas sobre una sola vocal. Practícalo primero lento, después con pulso estable y solo al final aumenta el tempo. No sacrifiques una nota clara por llegar antes al final del adorno.",
            "Ahora llévalo al repertorio. Elige una sola frase donde el adorno tenga sentido y prepara también una versión simple. En un contexto congregacional no siempre necesitas usar la versión más difícil. La técnica sirve a la canción cuando te da opciones y no cuando te obliga a demostrar habilidad."
        ],
    },
    {
        "id": "voice-advanced-08-setlist",
        "slug": "setlist",
        "label": "Preparar un setlist",
        "commit": "Corregir voz Academia · Preparar un setlist con referencia Passaggio",
        "narration": [
            "Bienvenido a Academia La Grey. En esta clase vamos a convertir todo lo anterior en una preparación vocal concreta para un setlist real. La preparación avanzada comienza antes de cantar: revisa tonalidad, frases exigentes, duración, armonías y distribución de carga.",
            "Por cada canción identifica el tono oficial, la frase más exigente, cuánto tiempo cantas de forma continua y dónde aparecen las armonías. Saber esto antes del ensayo evita descubrir en vivo que una canción está demasiado alta o que varias canciones difíciles quedaron juntas.",
            "Evita practicar siempre el set completo a intensidad de escenario. Evita dejar las armonías sin asignación previa. Y evita asumir que el tono original del artista tiene que ser el tono correcto para tu ministerio. El repertorio debe adaptarse a las voces reales que lo van a cantar.",
            "Haz una ficha rápida por canción: tono, punto más alto, frase más exigente, armonías y quién lleva la voz principal. Después aísla las frases críticas. No necesitas cantar toda la canción cada vez que quieres corregir dos compases.",
            "Diseña el calentamiento según las necesidades del set. Si hay saltos de afinación, trabaja intervalos. Si hay mucha zona alta, prepara transiciones sin forzar. Si habrá armonías, escucha tríadas y entradas. Calentar por costumbre sirve menos que calentar con un objetivo.",
            "Finalmente ordena el set para distribuir la demanda. Define dónde algunos cantantes pueden descansar mientras otros sostienen la canción. Reserva energía para los momentos importantes y revisa los tonos antes del servicio. Una buena preparación hace que la técnica desaparezca detrás de un ministerio más seguro, claro y musical."
        ],
    },
]

def sh(cmd, check=True):
    print("+", " ".join(map(str, cmd)), flush=True)
    return subprocess.run([str(x) for x in cmd], check=check)

def init_voice():
    if not VOICE_REF.exists():
        raise RuntimeError("Passaggio voice reference is missing")
    device = "cpu"
    torch.set_num_threads(max(2, min(4, os.cpu_count() or 2)))
    model = ChatterboxMultilingualTTS.from_pretrained(device=device, t3_model="v3")
    model.prepare_conditionals(str(VOICE_REF), exaggeration=0.45)
    print(f"Chatterbox Multilingual V3 ready at {model.sr} Hz using Passaggio reference", flush=True)
    return model

def split_for_tts(text, max_chars=260):
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\\s+", text.strip()) if s.strip()]
    chunks = []
    current = ""
    for sentence in sentences:
        candidate = sentence if not current else current + " " + sentence
        if len(candidate) <= max_chars:
            current = candidate
            continue
        if current:
            chunks.append(current)
        if len(sentence) <= max_chars:
            current = sentence
            continue
        words = sentence.split()
        current = ""
        for word in words:
            candidate = word if not current else current + " " + word
            if len(candidate) > max_chars and current:
                chunks.append(current)
                current = word
            else:
                current = candidate
    if current:
        chunks.append(current)
    return chunks

def clone_tts(text, output, voice):
    output = Path(output)
    pieces = []
    chunks = split_for_tts(text)
    if not chunks:
        raise RuntimeError("Empty narration chunk")
    for index, chunk in enumerate(chunks):
        torch.manual_seed(20260921 + len(text) + index)
        with torch.inference_mode():
            wav = voice.generate(
                chunk,
                language_id="es",
                exaggeration=0.45,
                cfg_weight=0.35,
                temperature=0.72,
                repetition_penalty=1.2,
                min_p=0.05,
                top_p=1.0,
            )
        if wav.dim() == 1:
            wav = wav.unsqueeze(0)
        pieces.append(wav.cpu())
        if index < len(chunks) - 1:
            pieces.append(torch.zeros((1, int(voice.sr * 0.18)), dtype=wav.dtype))
    merged = torch.cat(pieces, dim=-1)
    raw = output.with_name(output.stem + "-raw.wav")
    sf.write(str(raw), merged.squeeze(0).numpy(), voice.sr, subtype="PCM_16")
    sh([
        "ffmpeg", "-y", "-v", "error", "-i", raw,
        "-af", "loudnorm=I=-18:TP=-2:LRA=7",
        "-ar", str(SR), "-ac", "1", "-c:a", "pcm_s16le", output
    ])
    raw.unlink(missing_ok=True)

def media_duration(path):
    return float(subprocess.check_output([
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=nw=1:nk=1",
        str(path)
    ], text=True).strip())

def build_lesson(lesson, voice):
    slug = lesson["slug"]
    lesson_id = lesson["id"]
    scenes_dir = ROOT / "academy-videos" / slug
    output = ROOT / "academy-videos" / f"{lesson_id}.mp4"
    work = Path("/tmp") / f"lagrey-{slug}"
    if work.exists():
        shutil.rmtree(work)
    work.mkdir(parents=True)

    narration = lesson["narration"]
    if len(narration) != 6:
        raise RuntimeError(f"{lesson_id}: expected 6 narration scenes")

    videos = []
    for i, text in enumerate(narration, 1):
        svg = scenes_dir / f"scene-{i:02d}.svg"
        if not svg.exists():
            raise RuntimeError(f"Missing scene: {svg}")
        png = work / f"scene-{i:02d}.png"
        audio = work / f"scene-{i:02d}.wav"
        video = work / f"scene-{i:02d}.mp4"

        sh(["rsvg-convert", "-w", "1280", "-h", "720", svg, "-o", png])
        clone_tts(text, audio, voice)
        dur = media_duration(audio)
        sh([
            "ffmpeg", "-y", "-v", "error",
            "-loop", "1", "-framerate", "30", "-i", png,
            "-i", audio,
            "-vf", "scale=1280:720,format=yuv420p,fade=t=in:st=0:d=0.30",
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "22",
            "-c:a", "aac", "-b:a", "160k",
            "-t", f"{dur:.3f}", "-shortest", video
        ])
        videos.append(video)

    manifest = work / "concat.txt"
    manifest.write_text("\n".join(f"file '{v.resolve()}'" for v in videos), encoding="utf-8")
    joined = work / "joined.mp4"
    sh(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", manifest, "-c", "copy", joined])
    sh([
        "ffmpeg", "-y", "-v", "error", "-i", joined,
        "-c:v", "libx264", "-preset", "medium", "-crf", "23",
        "-c:a", "aac", "-b:a", "160k",
        "-movflags", "+faststart", output
    ])

    if output.stat().st_size < 500000:
        raise RuntimeError(f"{output} is unexpectedly small")
    sh(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=codec_name,width,height", "-of", "default=nw=1", output])
    sh(["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries", "stream=codec_name,sample_rate", "-of", "default=nw=1", output])
    print(f"BUILT {lesson_id} {media_duration(output):.2f}s {output.stat().st_size} bytes", flush=True)
    return output

def publish(output, lesson):
    sh(["git", "add", str(output.relative_to(ROOT))])
    diff = subprocess.run(["git", "diff", "--cached", "--quiet"])
    if diff.returncode == 0:
        print(f"NO CHANGE {lesson['id']}", flush=True)
        return
    sh(["git", "commit", "-m", lesson["commit"]])
    sh(["git", "push", "origin", "HEAD:main"])
    print(f"PUBLISHED {lesson['id']}", flush=True)

def main():
    sh(["git", "config", "user.name", "github-actions[bot]"])
    sh(["git", "config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"])
    voice = init_voice()
    for lesson in LESSONS:
        print(f"=== START {lesson['id']} ===", flush=True)
        output = build_lesson(lesson, voice)
        publish(output, lesson)
        print(f"=== COMPLETE {lesson['id']} ===", flush=True)

if __name__ == "__main__":
    main()
