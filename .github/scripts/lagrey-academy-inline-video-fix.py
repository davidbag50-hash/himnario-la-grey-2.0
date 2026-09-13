from pathlib import Path
import re

voice = Path('voice.js')
text = voice.read_text(encoding='utf-8')

new_video = '''function academyVideoHtml(id){const v=academyVideos[id];if(!v)return'';return `<section class="voice-academy-video"><div class="voice-academy-video-head"><div><span class="voice-badge">🎬 ${vtx('Video de la clase','Lesson video')}</span><h3>${localText(v.title)}</h3></div><span class="voice-academy-duration">${v.duration}</span></div><p>${vtx('El video se reproduce aquí mismo dentro de la clase. Puedes verlo en línea o cambiarlo a pantalla completa.','The video plays right here inside the lesson. You can watch it inline or switch to full screen.')}</p><div class="academy-video-player" data-academy-video-box="${id}"><video controls playsinline preload="metadata" data-academy-video="${id}"><source src="${v.src}" type="video/mp4"></video><div class="academy-video-fallback"><div class="academy-video-icon">🎥</div><b>${vtx('Video IA listo para producción','AI video ready for production')}</b><small>${vtx('Mientras termina el render del video, la narración IA de la clase ya está disponible junto con la guía visual.','While the video render finishes, the AI lesson narration is already available together with the visual guide.')}</small>${v.audio?`<audio controls preload="none" class="academy-audio"><source src="${v.audio}" type="audio/wav"></audio>`:''}<button class="btn primary" data-academy-story="${id}">▶ ${vtx('Ver guía audiovisual','View audiovisual guide')}</button></div></div><div class="academy-video-actions hidden" data-academy-video-actions="${id}"><button class="btn" type="button" data-academy-fullscreen="${id}">⛶ ${vtx('Pantalla completa','Full screen')}</button></div><div class="academy-story hidden" data-academy-story-box="${id}"><div class="academy-story-progress"><span data-academy-story-progress></span></div><div class="academy-story-count" data-academy-story-count></div><div class="academy-story-scene" data-academy-story-scene></div><div class="voice-play-row"><button class="btn" data-story-prev="${id}">← ${vtx('Anterior','Previous')}</button><button class="btn primary" data-story-play="${id}">▶ ${vtx('Reproducir','Play')}</button><button class="btn" data-story-next="${id}">${vtx('Siguiente','Next')} →</button></div></div></section>`}
'''
text, n = re.subn(r'function academyVideoHtml\(id\)\{.*?\}\nfunction shellTitle', new_video + 'function shellTitle', text, count=1, flags=re.S)
if n != 1:
    raise SystemExit('No se pudo localizar academyVideoHtml')

new_wire = '''function wireAcademyVideo(id){const video=$(`[data-academy-video="${id}"]`),box=$(`[data-academy-video-box="${id}"]`),actions=$(`[data-academy-video-actions="${id}"]`);if(video&&box){const showVideo=()=>{box.classList.add('has-video');actions?.classList.remove('hidden')},showFallback=()=>{box.classList.remove('has-video');actions?.classList.add('hidden')};if(video.readyState>=1)showVideo();video.addEventListener('loadedmetadata',showVideo,{once:true});video.addEventListener('canplay',showVideo,{once:true});video.addEventListener('error',showFallback,{once:true});try{video.load()}catch(_){}const fullBtn=$(`[data-academy-fullscreen="${id}"]`);if(fullBtn)fullBtn.onclick=async()=>{try{if(document.fullscreenElement&&document.exitFullscreen){await document.exitFullscreen();return}if(video.requestFullscreen){await video.requestFullscreen();return}if(video.webkitEnterFullscreen){video.webkitEnterFullscreen();return}if(video.webkitRequestFullscreen){video.webkitRequestFullscreen();return}}catch(error){console.warn('[La Grey Academia] No se pudo activar pantalla completa',error)}}}renderAcademyStory(id,0)}
'''
text, n = re.subn(r'function wireAcademyVideo\(id\)\{.*?\}\nfunction renderAcademyStory', new_wire + 'function renderAcademyStory', text, count=1, flags=re.S)
if n != 1:
    raise SystemExit('No se pudo localizar wireAcademyVideo')
voice.write_text(text, encoding='utf-8')

css = Path('voice.css')
c = css.read_text(encoding='utf-8')
anchor = '.academy-video-player.has-video video{display:block}'
replacement = '.academy-video-player.has-video{min-height:0;aspect-ratio:16/9}.academy-video-player.has-video video{display:block;width:100%;height:100%;max-height:none;object-fit:contain}.academy-video-actions{display:flex;justify-content:flex-end;margin:9px 0 2px}.academy-video-actions .btn{min-width:180px}'
if anchor not in c:
    raise SystemExit('No se encontró el estilo del reproductor de Academia')
c = c.replace(anchor, replacement, 1)
c += '\n@media(max-width:520px){.academy-video-actions .btn{width:100%;min-width:0}}\n'
css.write_text(c, encoding='utf-8')

sw = Path('sw.js')
s = sw.read_text(encoding='utf-8')
old = "const CACHE='la-grey-v3-200-academy-progress';"
new = "const CACHE='la-grey-v3-201-academy-video-inline';"
if old not in s:
    raise SystemExit('Versión de caché inesperada en sw.js')
sw.write_text(s.replace(old, new, 1), encoding='utf-8')
