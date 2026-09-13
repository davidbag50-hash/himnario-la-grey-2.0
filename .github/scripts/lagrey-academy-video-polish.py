from pathlib import Path
import re

voice = Path('voice.js')
text = voice.read_text(encoding='utf-8')

# Retirar las narraciones antiguas externas (voz femenina) de todas las clases.
text, removed = re.subn(r",audio:'https://resource2\.heygen\.ai/[^']+'", '', text)
if removed != 8:
    raise SystemExit(f'Se esperaban 8 narraciones antiguas; se retiraron {removed}')

new_video = '''function academyVideoHtml(id){const v=academyVideos[id];if(!v)return'';const eager=id==='voice-advanced-02-passaggio',preload=eager?'auto':'metadata',poster=eager?' poster="./academy-videos/passaggio/scene-01.svg"':'';return `<section class="voice-academy-video"><div class="voice-academy-video-head"><div><span class="voice-badge">🎬 ${vtx('Video de la clase','Lesson video')}</span><h3>${localText(v.title)}</h3></div><span class="voice-academy-duration">${v.duration}</span></div><p>${vtx('El video se reproduce aquí mismo dentro de la clase. Puedes verlo en línea o cambiarlo a pantalla completa.','The video plays right here inside the lesson. You can watch it inline or switch to full screen.')}</p><div class="academy-video-player${eager?' has-video academy-video-eager':''}" data-academy-video-box="${id}"><video controls playsinline preload="${preload}"${poster} data-academy-video="${id}"><source src="${v.src}" type="video/mp4"></video><div class="academy-video-fallback"><div class="academy-video-icon">🎥</div><b>${vtx('Video todavía no disponible','Video not available yet')}</b><small>${vtx('Esta clase conservará su guía visual hasta que tenga su video final.','This lesson keeps its visual guide until its final video is available.')}</small><button class="btn primary" data-academy-story="${id}">▶ ${vtx('Ver guía audiovisual','View audiovisual guide')}</button></div></div><div class="academy-video-actions${eager?'':' hidden'}" data-academy-video-actions="${id}"><button class="btn" type="button" data-academy-fullscreen="${id}">⛶ ${vtx('Pantalla completa','Full screen')}</button></div><div class="academy-story hidden" data-academy-story-box="${id}"><div class="academy-story-progress"><span data-academy-story-progress></span></div><div class="academy-story-count" data-academy-story-count></div><div class="academy-story-scene" data-academy-story-scene></div><div class="voice-play-row"><button class="btn" data-story-prev="${id}">← ${vtx('Anterior','Previous')}</button><button class="btn primary" data-story-play="${id}">▶ ${vtx('Reproducir','Play')}</button><button class="btn" data-story-next="${id}">${vtx('Siguiente','Next')} →</button></div></div></section>`}
'''
text, n = re.subn(r'function academyVideoHtml\(id\)\{.*?\}\nfunction shellTitle', new_video + 'function shellTitle', text, count=1, flags=re.S)
if n != 1:
    raise SystemExit('No se pudo localizar academyVideoHtml')

new_wire = '''function wireAcademyVideo(id){const video=$(`[data-academy-video="${id}"]`),box=$(`[data-academy-video-box="${id}"]`),actions=$(`[data-academy-video-actions="${id}"]`),eager=id==='voice-advanced-02-passaggio';if(video&&box){const showVideo=()=>{box.classList.add('has-video');actions?.classList.remove('hidden')},showFallback=()=>{box.classList.remove('has-video');actions?.classList.add('hidden')};if(eager||video.readyState>=1)showVideo();video.addEventListener('loadedmetadata',showVideo,{once:true});video.addEventListener('canplay',showVideo,{once:true});video.addEventListener('error',showFallback,{once:true});try{video.load()}catch(_){}const fullBtn=$(`[data-academy-fullscreen="${id}"]`);if(fullBtn)fullBtn.onclick=async()=>{try{if(document.fullscreenElement&&document.exitFullscreen){await document.exitFullscreen();return}if(video.requestFullscreen){await video.requestFullscreen();return}if(video.webkitEnterFullscreen){video.webkitEnterFullscreen();return}if(video.webkitRequestFullscreen){video.webkitRequestFullscreen();return}}catch(error){console.warn('[La Grey Academia] No se pudo activar pantalla completa',error)}}}renderAcademyStory(id,0)}
'''
text, n = re.subn(r'function wireAcademyVideo\(id\)\{.*?\}\nfunction renderAcademyStory', new_wire + 'function renderAcademyStory', text, count=1, flags=re.S)
if n != 1:
    raise SystemExit('No se pudo localizar wireAcademyVideo')

text = text.replace("duration:'4–5 min',scenes:[['Reconocer la zona de transición'", "duration:'3:57',scenes:[['Reconocer la zona de transición'", 1)
voice.write_text(text, encoding='utf-8')

sw = Path('sw.js')
s = sw.read_text(encoding='utf-8')
old = "const CACHE='la-grey-v3-201-academy-video-inline';"
new = "const CACHE='la-grey-v3-202-academy-video-eager';"
if old not in s:
    raise SystemExit('Versión de caché inesperada en sw.js')
s = s.replace(old, new, 1)
poster = "'./academy-videos/passaggio/scene-01.svg'"
if poster not in s:
    marker = ',STARTUP_COLLAGE];'
    if marker not in s:
        raise SystemExit('No se encontró el cierre de ASSETS en sw.js')
    s = s.replace(marker, ',' + poster + ',STARTUP_COLLAGE];', 1)
sw.write_text(s, encoding='utf-8')
