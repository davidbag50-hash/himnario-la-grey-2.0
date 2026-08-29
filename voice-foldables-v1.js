(()=>{
'use strict';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const config={name:'pro',selector:'.voice-pro-card',panel:'#voiceProPanel'};
let savedScrollIntoView=null;

function markButtons(){
  $$(config.selector).forEach(button=>{
    button.classList.add('voice-foldable-trigger');
    if(!button.hasAttribute('aria-expanded'))button.setAttribute('aria-expanded','false');
  });
}

function setExpanded(active){
  $$(config.selector).forEach(button=>{
    const open=button===active;
    button.setAttribute('aria-expanded',String(open));
    button.classList.toggle('voice-foldable-open',open);
  });
}

function stopInside(){
  $('#vproMicStop')?.click();
  $('#groupStop')?.click();
}

function suppressLegacyAutoScrollForClick(){
  if(savedScrollIntoView)return;
  savedScrollIntoView=Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView=function(){};
  queueMicrotask(()=>{
    if(savedScrollIntoView){
      Element.prototype.scrollIntoView=savedScrollIntoView;
      savedScrollIntoView=null;
    }
  });
}

function finishToggle(button,wasOpen){
  const panel=$(config.panel);
  if(!panel)return;

  if(wasOpen){
    stopInside();
    panel.classList.add('hidden');
    panel.classList.remove('voice-foldable-panel');
    setExpanded(null);
    return;
  }

  setExpanded(button);
  panel.classList.remove('hidden');
  panel.classList.add('voice-foldable-panel');
  button.insertAdjacentElement('afterend',panel);
}

function handleClick(event){
  const button=event.target.closest('.voice-pro-card');
  if(!button)return;

  const wasOpen=button.getAttribute('aria-expanded')==='true';

  // Si se toca la misma herramienta abierta, este click solo la cierra.
  // Así evitamos que voice-pro.js la vuelva a mostrar en el mismo evento.
  if(wasOpen){
    event.preventDefault();
    event.stopImmediatePropagation();
    finishToggle(button,true);
    return;
  }

  // voice-pro.js todavía solicita un scroll suave al mostrar la herramienta.
  // Se suprime únicamente durante este mismo click y se restaura antes del siguiente frame.
  suppressLegacyAutoScrollForClick();

  // El contenido se renderiza en el manejador normal del botón. Al terminar el evento,
  // lo colocamos debajo de la tarjeta elegida antes de que el navegador pinte la pantalla.
  queueMicrotask(()=>finishToggle(button,false));
}

function cleanupWhenLeaving(event){
  if(!event.target.closest('nav button,[data-home],[data-nav],[data-voice-home],[data-voice-cat],[data-routine]'))return;
  const panel=$(config.panel);
  if(panel?.classList.contains('voice-foldable-panel')){
    stopInside();
    panel.classList.add('hidden');
    panel.classList.remove('voice-foldable-panel');
    setExpanded(null);
  }
}

function boot(){
  markButtons();
  const root=$('#voiceView')||document.body;
  new MutationObserver(markButtons).observe(root,{childList:true,subtree:true});
}

document.addEventListener('click',handleClick,true);
document.addEventListener('click',cleanupWhenLeaving,true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();