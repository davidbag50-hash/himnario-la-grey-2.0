from pathlib import Path
import os
import subprocess
import sys
import torch
import torchaudio

ROOT = Path(os.environ.get("GITHUB_WORKSPACE", ".")).resolve()
COSY_ROOT = Path("/tmp/CosyVoice")
MODEL_DIR = Path("/tmp/cosyvoice3-model")
PASSAGGIO = ROOT / "academy-videos" / "voice-advanced-02-passaggio.mp4"
SVG = ROOT / "academy-videos" / "mix" / "scene-01.svg"
OUT = ROOT / "academy-videos" / "voice-advanced-01-mix-cosyvoice3-local-sample.mp4"
WORK = Path("/tmp/lagrey-cosyvoice3-local")
SR = 24000

PROMPT_TEXT = (
    "You are a helpful assistant.<|endofprompt|>"
    "Bienvenido a Academia La Grey. En esta clase de voz avanzada "
    "vamos a trabajar el passaggio sin tensión."
)

SAMPLE_TEXT = (
    "Bienvenido a Academia La Grey. En esta clase trabajaremos la mezcla vocal "
    "y la transición entre registros. La mezcla no es una voz nueva ni un lugar "
    "misterioso. Es una coordinación progresiva que permite subir sin convertir "
    "cada nota alta en más volumen y más presión."
)

def sh(cmd):
    print("+", " ".join(str(x) for x in cmd), flush=True)
    subprocess.run([str(x) for x in cmd], check=True)

def duration(path):
    return float(subprocess.check_output([
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=nw=1:nk=1",
        str(path)
    ], text=True).strip())

def main():
    if not PASSAGGIO.exists():
        raise RuntimeError("Passaggio reference video is missing")
    if not SVG.exists():
        raise RuntimeError("Mix scene 01 SVG is missing")
    if not COSY_ROOT.exists():
        raise RuntimeError("CosyVoice source is missing")
    if not MODEL_DIR.exists():
        raise RuntimeError("CosyVoice3 model is missing")

    WORK.mkdir(parents=True, exist_ok=True)
    sys.path.insert(0, str(COSY_ROOT))
    sys.path.insert(0, str(COSY_ROOT / "third_party" / "Matcha-TTS"))

    from cosyvoice.cli.cosyvoice import AutoModel

    ref = WORK / "passaggio-reference.wav"
    sh([
        "ffmpeg", "-y", "-v", "error",
        "-ss", "0.15", "-t", "8.4",
        "-i", PASSAGGIO,
        "-vn",
        "-af", "loudnorm=I=-18:TP=-2:LRA=7",
        "-ar", str(SR), "-ac", "1", "-c:a", "pcm_s16le",
        ref,
    ])
    print(f"REFERENCE {duration(ref):.2f}s", flush=True)

    torch.set_num_threads(max(2, min(4, os.cpu_count() or 2)))
    torch.manual_seed(20260924)

    print("LOADING CosyVoice3 on CPU", flush=True)
    model = AutoModel(
        model_dir=str(MODEL_DIR),
        load_trt=False,
        load_vllm=False,
        fp16=False,
    )
    print(f"MODEL READY sample_rate={model.sample_rate}", flush=True)

    pieces = []
    for idx, result in enumerate(model.inference_zero_shot(
        SAMPLE_TEXT,
        PROMPT_TEXT,
        str(ref),
        stream=False,
        speed=1.0,
    )):
        wav = result["tts_speech"].detach().cpu()
        if wav.ndim == 1:
            wav = wav.unsqueeze(0)
        pieces.append(wav)
        print(f"AUDIO PIECE {idx + 1}: {wav.shape[-1] / model.sample_rate:.2f}s", flush=True)

    if not pieces:
        raise RuntimeError("CosyVoice3 returned no audio")

    merged = torch.cat(pieces, dim=-1)
    raw = WORK / "sample-raw.wav"
    torchaudio.save(str(raw), merged, model.sample_rate)

    audio = WORK / "sample.wav"
    sh([
        "ffmpeg", "-y", "-v", "error",
        "-i", raw,
        "-af", "loudnorm=I=-18:TP=-2:LRA=7",
        "-ar", str(SR), "-ac", "1", "-c:a", "pcm_s16le",
        audio,
    ])

    png = WORK / "scene-01.png"
    sh(["rsvg-convert", "-w", "1280", "-h", "720", SVG, "-o", png])

    dur = duration(audio)
    sh([
        "ffmpeg", "-y", "-v", "error",
        "-loop", "1", "-framerate", "30", "-i", png,
        "-i", audio,
        "-vf", "scale=1280:720,format=yuv420p,fade=t=in:st=0:d=0.25",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "22",
        "-c:a", "aac", "-b:a", "160k",
        "-t", f"{dur:.3f}", "-shortest",
        "-movflags", "+faststart",
        OUT,
    ])

    if OUT.stat().st_size < 150000:
        raise RuntimeError("Sample video is unexpectedly small")
    print(f"BUILT {OUT.name} {duration(OUT):.2f}s {OUT.stat().st_size} bytes", flush=True)

    sh(["git", "config", "user.name", "github-actions[bot]"])
    sh(["git", "config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"])
    sh(["git", "add", str(OUT.relative_to(ROOT))])
    diff = subprocess.run(["git", "diff", "--cached", "--quiet"])
    if diff.returncode == 0:
        print("NO CHANGE", flush=True)
        return
    sh(["git", "commit", "-m", "Agregar muestra local CosyVoice 3 de Mezcla"])
    sh(["git", "push", "origin", "HEAD:main"])
    print("PUBLISHED SAMPLE ONLY; production lesson and voice.js remain unchanged", flush=True)

if __name__ == "__main__":
    main()
