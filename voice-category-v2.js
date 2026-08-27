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

  // Cancela el scroll suave que hacía la vista anterior y empieza arriba,
  // como una pantalla nueva dentro de Voz.
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
  // voice.js crea el contenido primero y layout-v35 termina sus ajustes en el
  // mismo clic. Después lo movemos definitivamente a esta subpantalla.
  reopenTimer=setTimeout(openCategoryScreen,0);
  setTimeout(()=>{ if(!active)openCategoryScreen(); },50);
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
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
