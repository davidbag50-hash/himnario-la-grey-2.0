(()=>{
'use strict';
const $=s=>document.querySelector(s);
let active=false;
let reopenTimer=0;

function ensureScreen(){
  const view=$('#voiceView');
  if(!view)return null;
  let screen=$('#voiceCategoryScreen');
  if(screen)return screen;

  screen=document.createElement('div');
  screen.id='voiceCategoryScreen';
  screen.className='voice-category-screen hidden';
  screen.innerHTML=`<button type="button" class="back voice-category-back" data-voice-category-back>← Voz</button><div id="voiceCategoryHost"></div>`;
  view.appendChild(screen);
  return screen;
}

function loadFoldables(){
  if(!document.getElementById('voiceFoldablesCss')){
    const link=document.createElement('link');
    link.id='voiceFoldablesCss';
    link.rel='stylesheet';
    link.href='voice-foldables-v1.css?v=48';
    document.head.appendChild(link);
  }
  if(!document.getElementById('voiceFoldablesJs')){
    const script=document.createElement('script');
    script.id='voiceFoldablesJs';
    script.src='voice-foldables-v1.js?v=48';
    document.body.appendChild(script);
  }
}

function openCategoryScreen(){
  const view=$('#voiceView');
  const panel=$('#voicePanel');
  const screen=ensureScreen();
  const host=$('#voiceCategoryHost');
  if(!view||!panel||!screen||!host||!panel.querySelector('.voice-exercise-list'))return;

  [...view.children].forEach(child=>{
    if(child!==screen&&child!==panel)child.classList.add('voice-category-main-hidden');
  });

  panel.classList.remove('voice-category-main-hidden','hidden','lg35-inline-panel');
  panel.classList.add('voice-category-panel');
  host.appendChild(panel);
  screen.classList.remove('hidden');
  active=true;

  window.scrollTo(0,0);
  requestAnimationFrame(()=>window.scrollTo(0,0));
  setTimeout(()=>window.scrollTo(0,0),80);
}

function closeCategoryScreen(scroll=true){
  const view=$('#voiceView');
  const panel=$('#voicePanel');
  const screen=$('#voiceCategoryScreen');
  if(!view||!screen)return;

  if(panel){
    panel.querySelector('[data-stop]')?.click();
    panel.classList.remove('voice-category-panel','lg35-inline-panel');
    panel.classList.add('hidden');
    view.appendChild(panel);
  }

  [...view.children].forEach(child=>child.classList.remove('voice-category-main-hidden'));
  screen.classList.add('hidden');
  active=false;
  if(scroll)window.scrollTo(0,0);
}

function scheduleOpen(){
  clearTimeout(reopenTimer);
  reopenTimer=setTimeout(openCategoryScreen,25);
  setTimeout(openCategoryScreen,110);
}

document.addEventListener('click',event=>{
  if(event.target.closest('[data-voice-cat]')){
    scheduleOpen();
    return;
  }

  if(event.target.closest('[data-voice-category-back]')){
    event.preventDefault();
    event.stopPropagation();
    closeCategoryScreen(true);
    return;
  }

  if(active&&event.target.closest('nav button,[data-home],[data-nav],[data-voice-home]')){
    closeCategoryScreen(false);
  }
},true);

function boot(){
  ensureScreen();
  loadFoldables();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
