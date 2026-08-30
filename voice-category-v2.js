(()=>{
'use strict';
const $=s=>document.querySelector(s);
const lang=()=>localStorage.getItem('lagrey_language')==='en'?'en':'es';
let active=false;
let reopenTimer=0;

function refreshLanguage(){
  const back=$('[data-voice-category-back]');if(back)back.textContent=lang()==='en'?'← Voice':'← Voz';
  if(!active){
    const panel=$('#voicePanel'),view=$('#voiceView');
    if(panel&&view){panel.classList.add('hidden');if(panel.parentElement!==view)view.appendChild(panel)}
  }
}
function ensureScreen(){
  const view=$('#voiceView');
  if(!view)return null;
  let screen=$('#voiceCategoryScreen');
  if(screen){refreshLanguage();return screen}
  screen=document.createElement('div');
  screen.id='voiceCategoryScreen';
  screen.className='voice-category-screen hidden';
  screen.innerHTML=`<button type="button" class="back voice-category-back" data-voice-category-back>← Voz</button><div id="voiceCategoryHost"></div>`;
  view.appendChild(screen);
  refreshLanguage();
  return screen;
}

function loadFoldables(){
  if(!document.getElementById('voiceFoldablesCss')){
    const link=document.createElement('link');
    link.id='voiceFoldablesCss';
    link.rel='stylesheet';
    link.href='voice-foldables-v1.css?v=50';
    document.head.appendChild(link);
  }
  if(!document.getElementById('voiceFoldablesJs')){
    const script=document.createElement('script');
    script.id='voiceFoldablesJs';
    script.src='voice-foldables-v1.js?v=50';
    document.body.appendChild(script);
  }
}

function panelReady(mode,panel){
  if(!panel)return false;
  if(mode==='category')return !!panel.querySelector('.voice-exercise-list');
  if(mode==='routine')return !!panel.querySelector('[data-start-routine],.routine-progress,.routine-list');
  return false;
}

function openVoiceSubscreen(mode){
  const view=$('#voiceView');
  const panel=$('#voicePanel');
  const screen=ensureScreen();
  const host=$('#voiceCategoryHost');
  if(!view||!panel||!screen||!host||!panelReady(mode,panel))return;

  [...view.children].forEach(child=>{
    if(child!==screen&&child!==panel)child.classList.add('voice-category-main-hidden');
  });

  panel.classList.remove('voice-category-main-hidden','hidden','lg35-inline-panel','voice-foldable-panel');
  panel.classList.add('voice-category-panel');
  host.appendChild(panel);
  screen.classList.remove('hidden');
  screen.dataset.voiceMode=mode;
  active=true;

  window.scrollTo(0,0);
  requestAnimationFrame(()=>window.scrollTo(0,0));
  setTimeout(()=>window.scrollTo(0,0),80);
}

function closeVoiceSubscreen(scroll=true){
  const view=$('#voiceView');
  const panel=$('#voicePanel');
  const screen=$('#voiceCategoryScreen');
  if(!view||!screen)return;

  if(panel){
    panel.querySelector('[data-routine-stop]')?.click();
    panel.querySelector('[data-stop]')?.click();
    panel.classList.remove('voice-category-panel','lg35-inline-panel','voice-foldable-panel');
    panel.classList.add('hidden');
    view.appendChild(panel);
  }

  view.querySelectorAll('.voice-routine,.voice-card').forEach(button=>{
    button.classList.remove('lg35-expanded');
    if(document.activeElement===button)button.blur();
  });
  [...view.children].forEach(child=>child.classList.remove('voice-category-main-hidden'));
  screen.classList.add('hidden');
  delete screen.dataset.voiceMode;
  active=false;
  if(scroll)window.scrollTo(0,0);
}

function scheduleOpen(mode){
  clearTimeout(reopenTimer);
  reopenTimer=setTimeout(()=>openVoiceSubscreen(mode),25);
  setTimeout(()=>openVoiceSubscreen(mode),110);
}

document.addEventListener('click',event=>{
  if(event.target.closest('[data-voice-cat]')){
    scheduleOpen('category');
    return;
  }

  if(event.target.closest('[data-routine]')){
    scheduleOpen('routine');
    return;
  }

  if(event.target.closest('[data-voice-category-back]')){
    event.preventDefault();
    event.stopPropagation();
    closeVoiceSubscreen(true);
    return;
  }

  if(active&&event.target.closest('nav button,[data-home],[data-nav],[data-voice-home]')){
    closeVoiceSubscreen(false);
  }
},true);

function boot(){
  ensureScreen();
  loadFoldables();
}

new MutationObserver(muts=>{if(muts.some(m=>m.attributeName==='lang'))refreshLanguage()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
