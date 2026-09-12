#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
VOICE = ROOT / 'voice.js'
SW = ROOT / 'sw.js'

voice = VOICE.read_text(encoding='utf-8')

audios = {
    'voice-advanced-01-mix': 'https://resource2.heygen.ai/text_to_speech/1c38b7140588469abcab714b8b7a2ac1/1eca26cb214c4f66976339251282b341/id=480aa8df-e513-49a7-82b3-9ff6fb6e2408.wav',
    'voice-advanced-02-passaggio': 'https://resource2.heygen.ai/text_to_speech/1c38b7140588469abcab714b8b7a2ac1/1eca26cb214c4f66976339251282b341/id=b285fb5b-b4b4-48ea-9b9b-135f07ba18fd.wav',
    'voice-advanced-03-dynamics': 'https://resource2.heygen.ai/text_to_speech/1c38b7140588469abcab714b8b7a2ac1/1eca26cb214c4f66976339251282b341/id=d82e4021-0940-4b3d-8137-3c6785028e3f.wav',
    'voice-advanced-04-intervals': 'https://resource2.heygen.ai/text_to_speech/1c38b7140588469abcab714b8b7a2ac1/1eca26cb214c4f66976339251282b341/id=f6649299-2386-4abf-8237-967f8b62bdc1.wav',
    'voice-advanced-05-harmony': 'https://resource2.heygen.ai/text_to_speech/1c38b7140588469abcab714b8b7a2ac1/1eca26cb214c4f66976339251282b341/id=f5123786-7818-413e-b010-f793ae2dc5f9.wav',
    'voice-advanced-06-endurance': 'https://resource2.heygen.ai/text_to_speech/1c38b7140588469abcab714b8b7a2ac1/1eca26cb214c4f66976339251282b341/id=cf41aad5-f755-493f-99c3-e31faebe3b7e.wav',
    'voice-advanced-07-agility': 'https://resource2.heygen.ai/text_to_speech/1c38b7140588469abcab714b8b7a2ac1/1eca26cb214c4f66976339251282b341/id=9e36a9fe-2bdd-4d7e-a820-761923fa4480.wav',
    'voice-advanced-08-setlist': 'https://resource2.heygen.ai/text_to_speech/1c38b7140588469abcab714b8b7a2ac1/1eca26cb214c4f66976339251282b341/id=02327214-c2e0-4be8-baae-6101f164a636.wav',
}

for lesson_id, audio in audios.items():
    marker = f"'{lesson_id}':{{src:'./academy-videos/{lesson_id}.mp4',"
    replacement = f"'{lesson_id}':{{src:'./academy-videos/{lesson_id}.mp4',audio:'{audio}',"
    if marker not in voice:
        raise SystemExit(f'Marcador no encontrado para {lesson_id}')
    voice = voice.replace(marker, replacement, 1)

old = "<small>${vtx('Mientras se publica el MP4, puedes ver el guion visual de la clase aquí mismo.','While the MP4 is being published, you can view the visual script right here.')}</small><button class=\"btn primary\" data-academy-story=\"${id}\">▶ ${vtx('Ver guía audiovisual','View audiovisual guide')}</button>"
new = "<small>${vtx('Mientras termina el render del video, la narración IA de la clase ya está disponible junto con la guía visual.','While the video render finishes, the AI lesson narration is already available together with the visual guide.')}</small>${v.audio?`<audio controls preload=\"none\" class=\"academy-audio\"><source src=\"${v.audio}\" type=\"audio/wav\"></audio>`:''}<button class=\"btn primary\" data-academy-story=\"${id}\">▶ ${vtx('Ver guía audiovisual','View audiovisual guide')}</button>"
if old not in voice:
    raise SystemExit('No se encontró el fallback audiovisual actual')
voice = voice.replace(old, new, 1)

old_intro = "La Grey ya tiene reservado un archivo estable para este video. Cuando el MP4 generado con IA esté publicado, aparecerá aquí sin cambiar la clase."
new_intro = "La clase combina narración IA, guía visual y práctica interactiva. El MP4 reemplaza automáticamente este modo cuando está disponible."
if old_intro not in voice:
    raise SystemExit('No se encontró texto introductorio de video')
voice = voice.replace(old_intro, new_intro, 1)
old_intro_en = "La Grey already has a stable file reserved for this video. Once the AI-generated MP4 is published, it will appear here without changing the lesson."
new_intro_en = "The lesson combines AI narration, a visual guide and interactive practice. The MP4 automatically replaces this mode when available."
voice = voice.replace(old_intro_en, new_intro_en, 1)

VOICE.write_text(voice, encoding='utf-8')

sw = SW.read_text(encoding='utf-8')
old_cache = "const CACHE='la-grey-v3-198-academy-complete';"
new_cache = "const CACHE='la-grey-v3-199-academy-ai-audio';"
if old_cache not in sw:
    raise SystemExit('Cache esperado v198 no encontrado')
sw = sw.replace(old_cache, new_cache, 1)
SW.write_text(sw, encoding='utf-8')

print('Narración IA integrada directamente en voice.js y cache actualizado a v199.')
