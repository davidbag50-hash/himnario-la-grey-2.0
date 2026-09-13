from pathlib import Path
import math
import os
import subprocess
import numpy as np
import soundfile as sf
import librosa
import torch
from openvoice.api import ToneColorConverter
from melo.api import TTS

ROOT = Path(os.environ.get('GITHUB_WORKSPACE', '.')).resolve()
WORK = Path('/tmp/lagrey_mix')
WORK.mkdir(parents=True, exist_ok=True)
OUT = ROOT / 'academy-videos' / 'voice-advanced-01-mix.mp4'
SCENES = ROOT / 'academy-videos' / 'mix'
VOICE_REF = Path('/tmp/voice1.mp3')
CHECKPOINT_HINT = Path('/tmp/OpenVoiceV2')
SR = 24000

NARRATION = [
    "Bienvenido a Academia La Grey. En esta clase trabajaremos la mezcla vocal y la transición entre registros. La mezcla no es una voz nueva ni un lugar misterioso. Es una coordinación progresiva que permite subir sin convertir cada nota alta en más volumen y más presión. La meta es mantener continuidad mientras ajustamos peso, intensidad y vocal de manera gradual. Trabaja siempre en una zona cómoda y recuerda que una nota más alta no tiene que sentirse como una nota más pesada.",
    "Al subir, la voz necesita reorganizarse. Normalmente conviene reducir un poco el peso, mantener el cuello y la mandíbula libres y permitir que la vocal se vuelva más eficiente. No buscamos esconder la voz ni volverla débil. Buscamos conservar energía útil sin arrastrar una coordinación pesada hacia arriba. Si el sonido se vuelve más libre y repetible, vas por buen camino. Si cada repetición exige más fuerza, baja intensidad o vuelve a una nota más cómoda.",
    "Evita tres cosas. Primero, empujar la voz de pecho hacia arriba como si la única solución fuera cantar más fuerte. Segundo, levantar la barbilla o endurecer el cuello cuando aparece una nota difícil. Y tercero, repetir muchas veces una coordinación que ya se siente apretada. La práctica también entrena los hábitos incorrectos. Si aparece presión, reduce el volumen, cambia la nota inicial o descansa unos segundos antes de continuar.",
    "Vamos al primer ejercicio: una sirena coordinada con el patrón uno, tres, cinco, ocho, cinco, tres, uno. Usaremos una vocal redonda y ligera. Escucha primero la demostración con mi voz y después repítela en tu zona cómoda. La octava no se alcanza empujando; deja que el sonido se haga un poco más ligero mientras sube.",
    "Segundo ejercicio: MUM ligero, con el patrón uno, dos, tres, cuatro, cinco, cuatro, tres, dos, uno. Mantén la consonante clara pero pequeña. La quinta debe sentirse tan coordinada como las primeras notas. Si necesitas levantar la barbilla o aumentar mucho el volumen, baja la tonalidad. Escucha la demostración y después haz tres repeticiones cómodas antes de subir medio tono.",
    "Lleva ahora esa coordinación a tu repertorio. Elige una frase de coro que pase de tu zona media hacia una nota más alta. Cántala primero con menos intensidad y busca la misma sensación de continuidad que encontraste en los ejercicios. Después aumenta la expresión sin añadir presión innecesaria. La meta no es sonar pequeño: es tener opciones. Puedes cantar con energía y al mismo tiempo mantener una coordinación eficiente. Si aparece dolor, ardor o una ronquera que empeora, detén la práctica. La técnica debe ayudarte a servir mejor, no a pelear contra tu voz."
]

EXERCISES = {
    4: {"pattern": [0,4,7,12,7,4,0], "tempo": 72},
    5: {"pattern": [0,2,4,5,7,5,4,2,0], "tempo": 82},
}

def sh(cmd):
    print('+', ' '.join(map(str, cmd)), flush=True)
    subprocess.run([str(x) for x in cmd], check=True)

def find_ckpt_root():
    candidates = [CHECKPOINT_HINT, CHECKPOINT_HINT / 'checkpoints_v2', Path('/tmp/checkpoints_v2')]
    for c in candidates:
        if (c / 'converter' / 'config.json').exists() and (c / 'base_speakers' / 'ses').exists():
            return c
    for cfg in Path('/tmp').glob('**/converter/config.json'):
        c = cfg.parent.parent
        if (c / 'base_speakers' / 'ses').exists():
            return c
    raise RuntimeError('OpenVoice V2 checkpoints not found')

def torch_load(path, device='cpu'):
    try:
        return torch.load(path, map_location=device, weights_only=False)
    except TypeError:
        return torch.load(path, map_location=device)

def init_voice():
    ckpt = find_ckpt_root()
    device = 'cpu'
    converter = ToneColorConverter(str(ckpt / 'converter' / 'config.json'), device=device)
    converter.load_ckpt(str(ckpt / 'converter' / 'checkpoint.pth'))
    target_se = converter.extract_se(str(VOICE_REF))
    model = TTS(language='ES', device=device)
    speaker_ids = model.hps.data.spk2id
    if not speaker_ids:
        raise RuntimeError('MeloTTS Spanish speaker unavailable')
    speaker_key = next(iter(speaker_ids.keys()))
    speaker_id = speaker_ids[speaker_key]
    key = speaker_key.lower().replace('_', '-')
    source_se_path = ckpt / 'base_speakers' / 'ses' / f'{key}.pth'
    if not source_se_path.exists():
        matches = list((ckpt / 'base_speakers' / 'ses').glob('*.pth'))
        spanish = [p for p in matches if 'es' in p.stem.lower()]
        source_se_path = (spanish or matches)[0]
    source_se = torch_load(source_se_path, device)
    return model, speaker_id, converter, source_se, target_se

def clone_tts(text, output, voice, speed=1.0):
    model, speaker_id, converter, source_se, target_se = voice
    base = WORK / (Path(output).stem + '_base.wav')
    converted = WORK / (Path(output).stem + '_converted.wav')
    model.tts_to_file(text, speaker_id, str(base), speed=speed)
    converter.convert(
        audio_src_path=str(base),
        src_se=source_se,
        tgt_se=target_se,
        output_path=str(converted),
        message='LaGrey'
    )
    sh(['ffmpeg','-y','-v','error','-i',converted,'-ar',str(SR),'-ac','1','-c:a','pcm_s16le',output])

def ensure_sr(y, sr):
    if sr != SR:
        y = librosa.resample(y, orig_sr=sr, target_sr=SR)
    return np.asarray(y, dtype=np.float32)

def envelope(n, sr):
    t = np.arange(n) / sr
    attack = np.minimum(1.0, t / 0.025)
    release = np.minimum(1.0, (n / sr - t) / 0.08)
    return np.clip(attack * release, 0, 1)

def piano_note(freq, dur, sr=SR):
    n = max(1, int(dur * sr))
    t = np.arange(n) / sr
    sig = (np.sin(2*np.pi*freq*t) + 0.35*np.sin(4*np.pi*freq*t) + 0.14*np.sin(6*np.pi*freq*t))
    sig *= np.exp(-2.6*t) * envelope(n, sr)
    return (sig * 0.22).astype(np.float32)

def prepare_voice_unit(path, target_dur):
    y, sr = librosa.load(path, sr=None, mono=True)
    y = ensure_sr(y, sr)
    y, _ = librosa.effects.trim(y, top_db=32)
    if len(y) < SR * 0.08:
        raise RuntimeError(f'Voice unit too short: {path}')
    target_n = int(target_dur * SR)
    rate = max(0.35, min(2.8, len(y) / target_n))
    y = librosa.effects.time_stretch(y, rate=rate)
    if len(y) < target_n:
        y = np.pad(y, (0, target_n-len(y)))
    y = y[:target_n]
    y *= envelope(len(y), SR)
    peak = float(np.max(np.abs(y))) or 1.0
    return (y / peak * 0.68).astype(np.float32)

def median_f0(y):
    f0 = librosa.yin(y, fmin=70, fmax=420, sr=SR, frame_length=2048, hop_length=256)
    good = f0[np.isfinite(f0)]
    return float(np.median(good)) if len(good) else 150.0

def make_exercise(unit_path, pattern, tempo, out_path):
    note_dur = max(0.42, min(0.68, 60.0 / tempo * 0.72))
    gap = 0.07
    base_unit = prepare_voice_unit(unit_path, note_dur)
    base_f0 = median_f0(base_unit)
    def render(root_midi):
        chunks=[]
        for semis in pattern:
            target_midi = root_midi + semis
            freq = 440.0 * (2.0 ** ((target_midi - 69) / 12.0))
            shift = 12.0 * math.log2(freq / max(1e-6, base_f0))
            v = librosa.effects.pitch_shift(base_unit, sr=SR, n_steps=shift)
            p = piano_note(freq, note_dur)
            chunks.append(np.clip(v * 0.82 + p, -0.98, 0.98))
            chunks.append(np.zeros(int(gap * SR), dtype=np.float32))
        return np.concatenate(chunks)
    audio = np.concatenate([render(60), np.zeros(int(0.9 * SR), dtype=np.float32), render(61)])
    sf.write(out_path, audio, SR)

def concat_audio(parts, out_path):
    manifest = WORK / (Path(out_path).stem + '_concat.txt')
    manifest.write_text('\n'.join(f"file '{Path(p).resolve()}'" for p in parts), encoding='utf-8')
    sh(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',manifest,'-c:a','pcm_s16le',out_path])

def silence(seconds, out_path):
    sh(['ffmpeg','-y','-v','error','-f','lavfi','-i',f'anullsrc=r={SR}:cl=mono','-t',str(seconds),'-c:a','pcm_s16le',out_path])

def scene_video(png, audio, out):
    dur = subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(audio)], text=True).strip()
    sh(['ffmpeg','-y','-v','error','-loop','1','-framerate','30','-i',png,'-i',audio,
        '-vf','scale=1280:720,format=yuv420p,fade=t=in:st=0:d=0.35',
        '-c:v','libx264','-preset','veryfast','-crf','22','-c:a','aac','-b:a','160k','-t',dur,'-shortest',out])

def main():
    if not VOICE_REF.exists():
        raise RuntimeError('voice1 reference audio missing')
    voice = init_voice()
    narr=[]
    for i,text in enumerate(NARRATION,1):
        out=WORK/f'narr-{i:02d}.wav'
        clone_tts(text,out,voice,speed=1.02)
        narr.append(out)
    unit_woo=WORK/'unit-woo.wav'
    unit_mum=WORK/'unit-mum.wav'
    clone_tts('Uuu.',unit_woo,voice,speed=0.8)
    clone_tts('Mum.',unit_mum,voice,speed=0.8)
    ex4=WORK/'exercise-woo.wav'
    ex5=WORK/'exercise-mum.wav'
    make_exercise(unit_woo,EXERCISES[4]['pattern'],EXERCISES[4]['tempo'],ex4)
    make_exercise(unit_mum,EXERCISES[5]['pattern'],EXERCISES[5]['tempo'],ex5)
    gap=WORK/'gap.wav'
    silence(0.8,gap)
    scene_audio=[]
    for i in range(1,7):
        if i==4:
            out=WORK/'scene-audio-04.wav'; concat_audio([narr[3],gap,ex4],out)
        elif i==5:
            out=WORK/'scene-audio-05.wav'; concat_audio([narr[4],gap,ex5],out)
        else:
            out=narr[i-1]
        scene_audio.append(out)
    videos=[]
    for i in range(1,7):
        svg=SCENES/f'scene-{i:02d}.svg'
        png=WORK/f'scene-{i:02d}.png'
        sh(['rsvg-convert','-w','1280','-h','720',svg,'-o',png])
        v=WORK/f'scene-{i:02d}.mp4'
        scene_video(png,scene_audio[i-1],v)
        videos.append(v)
    manifest=WORK/'video-concat.txt'
    manifest.write_text('\n'.join(f"file '{v.resolve()}'" for v in videos),encoding='utf-8')
    OUT.parent.mkdir(parents=True,exist_ok=True)
    sh(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',manifest,'-c','copy',OUT])
    optimized=WORK/'final.mp4'
    sh(['ffmpeg','-y','-v','error','-i',OUT,'-c:v','libx264','-preset','medium','-crf','23','-c:a','aac','-b:a','160k','-movflags','+faststart',optimized])
    optimized.replace(OUT)
    print('FINAL',OUT,OUT.stat().st_size)

if __name__=='__main__':
    main()
