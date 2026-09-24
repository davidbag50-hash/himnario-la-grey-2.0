from pathlib import Path
import os
import re
import shutil
import subprocess

from gradio_client import Client, handle_file

ROOT = Path(os.environ.get("GITHUB_WORKSPACE", ".")).resolve()
PASSAGGIO = ROOT / "academy-videos" / "voice-advanced-02-passaggio.mp4"
OUT = ROOT / "academy-videos" / "voice-advanced-01-mix-cosyvoice3-test.mp4"
PARTS = ROOT / "academy-videos" / "cosyvoice3-mix-parts"
STATE = ROOT / ".github" / "cosyvoice3-mix-state.txt"
WORK = Path("/tmp/lagrey-cosyvoice3-mix")
SPACE = "FunAudioLLM/Fun-CosyVoice3-0.5B"
SEED = 20260924
SR = 24000

SCENES = [
    "Bienvenido a Academia La Grey. En esta clase trabajaremos la mezcla vocal y la transición entre registros. La mezcla no es una voz nueva ni un lugar misterioso. Es una coordinación progresiva que permite subir sin convertir cada nota alta en más volumen y más presión. La meta es mantener continuidad mientras ajustamos peso, intensidad y vocal de manera gradual. Trabaja siempre en una zona cómoda y recuerda que una nota más alta no tiene que sentirse como una nota más pesada.",
    "Al subir, la voz necesita reorganizarse. Normalmente conviene reducir un poco el peso, mantener el cuello y la mandíbula libres y permitir que la vocal se vuelva más eficiente. No buscamos esconder la voz ni volverla débil. Buscamos conservar energía útil sin arrastrar una coordinación pesada hacia arriba. Si el sonido se vuelve más libre y repetible, vas por buen camino. Si cada repetición exige más fuerza, baja intensidad o vuelve a una nota más cómoda.",
    "Evita tres cosas. Primero, empujar la voz de pecho hacia arriba como si la única solución fuera cantar más fuerte. Segundo, levantar la barbilla o endurecer el cuello cuando aparece una nota difícil. Y tercero, repetir muchas veces una coordinación que ya se siente apretada. La práctica también entrena los hábitos incorrectos. Si aparece presión, reduce el volumen, cambia la nota inicial o descansa unos segundos antes de continuar.",
    "Vamos al primer ejercicio. Usa ene ge o u, con el patrón uno, tres, cinco, ocho, cinco, tres, uno. Empieza en una nota cómoda y mantén el sonido pequeño y continuo. La octava no se alcanza empujando. Permite que la voz se haga un poco más ligera al subir y detente si sientes que necesitas aumentar demasiado el volumen.",
    "Segundo ejercicio: MUM ligero, con el patrón uno, dos, tres, cuatro, cinco, cuatro, tres, dos, uno. Mantén la consonante clara, pero pequeña. La quinta debe sentirse tan coordinada como las primeras notas. Haz tres repeticiones cómodas antes de subir medio tono y vuelve atrás si el cuello o la mandíbula empiezan a endurecerse.",
    "Lleva ahora esa coordinación a tu repertorio. Elige una frase de coro que pase de tu zona media hacia una nota más alta. Cántala primero con menos intensidad y busca la misma continuidad de los ejercicios. Después aumenta la expresión sin añadir presión innecesaria. La meta no es sonar pequeño, sino tener opciones. Si aparece dolor, ardor o una ronquera que empeora, detén la práctica. La técnica debe ayudarte a servir mejor, no a pelear contra tu voz.",
]

# Transcript corresponding closely to the short opening excerpt extracted from Passaggio.
PROMPT_TEXT = (
    "Bienvenido a Academia La Grey. En esta clase de voz avanzada "
    "vamos a trabajar el passaggio sin tensión."
)

VALID_INSTRUCT = "You are a helpful assistant. 请用广东话表达。<|endofprompt|>"

def sh(cmd):
    print("+", " ".join(str(x) for x in cmd), flush=True)
    subprocess.run([str(x) for x in cmd], check=True)

def duration(path):
    return float(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=nw=1:nk=1", str(path)
    ], text=True).strip())

def split_text(text, limit=198):
    # Pack words close to the Space's 200-character ceiling so each scene
    # needs at most three GPU calls. Prefer punctuation boundaries when possible.
    words = text.split()
    chunks = []
    current = []
    for word in words:
        candidate = " ".join(current + [word])
        if len(candidate) <= limit:
            current.append(word)
            continue
        if current:
            chunks.append(" ".join(current))
        current = [word]
    if current:
        chunks.append(" ".join(current))

    # Improve joins by moving a few words when a chunk ends far from punctuation.
    for i in range(len(chunks) - 1):
        if chunks[i][-1:] in ".!?;:":
            continue
        left = chunks[i].split()
        right = chunks[i + 1].split()
        moved = []
        while len(left) > 6 and left[-1][-1:] not in ".!?;:":
            moved.insert(0, left.pop())
            candidate_right = " ".join(moved + right)
            if len(candidate_right) > limit:
                left.extend(moved)
                moved = []
                break
        if moved:
            chunks[i] = " ".join(left)
            chunks[i + 1] = " ".join(moved + right)

    if any(len(c) > 200 for c in chunks):
        raise RuntimeError(f"Chunk exceeds CosyVoice Space limit: {chunks}")
    if len(chunks) > 3:
        raise RuntimeError(f"Scene needs {len(chunks)} calls; quota-safe maximum is 3")
    return chunks

def copy_audio_result(result, dest):
    src = result
    if isinstance(result, dict):
        src = result.get("path") or result.get("url")
    if isinstance(src, (list, tuple)):
        src = src[0]
        if isinstance(src, dict):
            src = src.get("path") or src.get("url")
    if not src:
        raise RuntimeError(f"Unexpected Gradio audio result: {result!r}")
    src = str(src)
    if src.startswith("http://") or src.startswith("https://"):
        import urllib.request
        urllib.request.urlretrieve(src, dest)
    else:
        shutil.copyfile(src, dest)

def make_reference():
    if not PASSAGGIO.exists():
        raise RuntimeError("Passaggio reference video is missing")
    ref = WORK / "passaggio-reference.wav"
    sh([
        "ffmpeg", "-y", "-v", "error",
        "-ss", "0.15", "-t", "8.4", "-i", PASSAGGIO,
        "-vn", "-af", "loudnorm=I=-18:TP=-2:LRA=7",
        "-ar", str(SR), "-ac", "1", "-c:a", "pcm_s16le", ref
    ])
    print(f"REFERENCE {duration(ref):.2f}s", flush=True)
    return ref

def synth_chunk(client, text, ref, out):
    print(f"TTS {len(text)} chars: {text}", flush=True)
    result = client.predict(
        text,
        "zero_shot",
        PROMPT_TEXT,
        handle_file(str(ref)),
        None,
        VALID_INSTRUCT,
        SEED,
        False,
        "En",
        api_name="/generate_audio",
    )
    copy_audio_result(result, out)
    norm = out.with_suffix(".norm.wav")
    sh([
        "ffmpeg", "-y", "-v", "error", "-i", out,
        "-af", "loudnorm=I=-18:TP=-2:LRA=7",
        "-ar", str(SR), "-ac", "1", "-c:a", "pcm_s16le", norm
    ])
    out.unlink()
    norm.rename(out)
    if duration(out) < 0.5:
        raise RuntimeError("Generated audio is unexpectedly short")

def concat_wavs(parts, output):
    manifest = output.with_suffix(".txt")
    silence = WORK / "silence.wav"
    if not silence.exists():
        sh([
            "ffmpeg", "-y", "-v", "error", "-f", "lavfi",
            "-i", f"anullsrc=r={SR}:cl=mono", "-t", "0.08",
            "-c:a", "pcm_s16le", silence
        ])
    lines = []
    for i, part in enumerate(parts):
        lines.append(f"file '{part.resolve()}'")
        if i < len(parts) - 1:
            lines.append(f"file '{silence.resolve()}'")
    manifest.write_text("\n".join(lines), encoding="utf-8")
    sh([
        "ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0",
        "-i", manifest, "-ar", str(SR), "-ac", "1", "-c:a", "pcm_s16le", output
    ])

def build_scene(scene_no, client, ref):
    text = SCENES[scene_no - 1]
    chunks = split_text(text)
    print(f"SCENE {scene_no}: {len(chunks)} quota-safe chunks", flush=True)

    chunk_files = []
    for cidx, chunk in enumerate(chunks, 1):
        wav = WORK / f"scene-{scene_no:02d}-chunk-{cidx:02d}.wav"
        synth_chunk(client, chunk, ref, wav)
        chunk_files.append(wav)

    scene_audio = WORK / f"scene-{scene_no:02d}.wav"
    concat_wavs(chunk_files, scene_audio)

    svg = ROOT / "academy-videos" / "mix" / f"scene-{scene_no:02d}.svg"
    png = WORK / f"scene-{scene_no:02d}.png"
    PARTS.mkdir(parents=True, exist_ok=True)
    video = PARTS / f"scene-{scene_no:02d}.mp4"

    sh(["rsvg-convert", "-w", "1280", "-h", "720", svg, "-o", png])
    dur = duration(scene_audio)
    sh([
        "ffmpeg", "-y", "-v", "error",
        "-loop", "1", "-framerate", "30", "-i", png,
        "-i", scene_audio,
        "-vf", "scale=1280:720,format=yuv420p,fade=t=in:st=0:d=0.25",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "22",
        "-c:a", "aac", "-b:a", "160k",
        "-t", f"{dur:.3f}", "-shortest", video
    ])
    print(f"BUILT SCENE {scene_no}: {duration(video):.2f}s {video.stat().st_size} bytes", flush=True)
    return video

def assemble_final():
    videos = [PARTS / f"scene-{i:02d}.mp4" for i in range(1, 7)]
    missing = [str(v) for v in videos if not v.exists()]
    if missing:
        raise RuntimeError(f"Missing completed scenes: {missing}")

    manifest = WORK / "video-concat.txt"
    manifest.write_text("\n".join(f"file '{v.resolve()}'" for v in videos), encoding="utf-8")
    joined = WORK / "joined.mp4"
    sh(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", manifest, "-c", "copy", joined])
    sh([
        "ffmpeg", "-y", "-v", "error", "-i", joined,
        "-c:v", "libx264", "-preset", "medium", "-crf", "23",
        "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", OUT
    ])
    if OUT.stat().st_size < 500000:
        raise RuntimeError("Output video is unexpectedly small")
    print(f"FINAL {OUT.name} {duration(OUT):.2f}s {OUT.stat().st_size} bytes", flush=True)

def read_state():
    if not STATE.exists():
        return 0
    raw = STATE.read_text(encoding="utf-8").strip()
    if raw == "complete":
        return 6
    try:
        return max(0, min(6, int(raw)))
    except ValueError:
        return 0

def publish(scene_no, final=False):
    STATE.parent.mkdir(parents=True, exist_ok=True)
    STATE.write_text("complete\n" if final else f"{scene_no}\n", encoding="utf-8")

    sh(["git", "config", "user.name", "github-actions[bot]"])
    sh(["git", "config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"])

    if final:
        # Keep only the finished test video; intermediate scene files were scaffolding.
        if PARTS.exists():
            shutil.rmtree(PARTS)
        sh(["git", "add", "-A", ".github/cosyvoice3-mix-state.txt", "academy-videos"])
        message = "Completar prueba Mezcla con CosyVoice 3"
    else:
        sh(["git", "add", ".github/cosyvoice3-mix-state.txt", str((PARTS / f"scene-{scene_no:02d}.mp4").relative_to(ROOT))])
        message = f"Construir prueba CosyVoice 3 · escena {scene_no} de 6"

    diff = subprocess.run(["git", "diff", "--cached", "--quiet"])
    if diff.returncode == 0:
        print("NO CHANGE", flush=True)
        return
    sh(["git", "commit", "-m", message])
    sh(["git", "push", "origin", "HEAD:main"])
    print("PUBLISHED TEST PROGRESS; voice.js was not changed", flush=True)

def main():
    completed = read_state()
    if completed >= 6 and OUT.exists():
        print("CosyVoice3 Mix test is already complete.", flush=True)
        return

    next_scene = completed + 1
    if not 1 <= next_scene <= 6:
        raise RuntimeError(f"Invalid next scene: {next_scene}")

    if WORK.exists():
        shutil.rmtree(WORK)
    WORK.mkdir(parents=True)

    ref = make_reference()
    client = Client(SPACE, verbose=False)
    video = build_scene(next_scene, client, ref)

    if next_scene == 6:
        assemble_final()
        publish(next_scene, final=True)
    else:
        publish(next_scene, final=False)

if __name__ == "__main__":
    main()
