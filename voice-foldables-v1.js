(()=>{
'use strict';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const configs=[
  {name:'pro',selector:'.voice-pro-card',panel:'#voiceProPanel'},
  {name:'routine',selector:'.voice-routine',panel:'#voicePanel'}
];

function configFor(button){return configs.find(c=>button.matches(c.selector));}

function markButtons(){
  configs.forEach(c=>{
    $$(c.selector).forEach(button=>{
      button.classList.add('voice-foldable-trigger');
      if(!button.hasAttribute('aria-expanded'))button.setAttribute('aria-expanded','false');
    });
  });
}

function setExpanded(config,active){
  $$(config.selector).forEach(button=>{
    const open=button===active;
    button.setAttribute('aria-expanded',String(open));
    button.classList.toggle('voice-foldable-open',open);
  });
}

function stopInside(config,panel){
  if(config.name==='routine'){
    panel?.querySelector('[data-routine-stop]')?.click();
    panel?.querySelector('[data-stop]')?.click();
  }else{
    $('#vproMicStop')?.click();
    $('#groupStop')?.click();
  }
}

function cancelScroll(anchorTop){
  const restore=()=>{
    if(!Number.isFinite(anchorTop))return;
    const active=$('.voice-foldable-open');
    if(!active)return;
    const now=active.getBoundingClientRect().top;
    const delta=now-anchorTop;
    if(Math.abs(delta)>1)window.scrollBy(0,delta);
  };
  requestAnimationFrame(restore);
  setTimeout(restore,70);
  setTimeout(restore,180);
  setTimeout(restore,340);
}

function finishToggle(button,config,wasOpen,topBefore){
  const panel=$(config.panel);
  if(!panel)return;

  if(wasOpen){
    stopInside(config,panel);
    panel.classList.add('hidden');
    panel.classList.remove('voice-foldable-panel');
    setExpanded(config,null);
    cancelScroll(topBefore);
    return;
  }

  setExpanded(config,button);
  panel.classList.remove('hidden');
  panel.classList.add('voice-foldable-panel');
  button.insertAdjacentElement('afterend',panel);
  cancelScroll(topBefore);
}

function handleClick(event){
  const button=event.target.closest('.voice-pro-card,.voice-routine');
  if(!button)return;
  const config=configFor(button);
  if(!config)return;

  const wasOpen=button.getAttribute('aria-expanded')==='true';
  const topBefore=button.getBoundingClientRect().top;

  // voice.js / voice-pro.js generan el contenido y layout-v35 lo mueve primero.
  // Después de eso lo dejamos definitivamente bajo la tarjeta y aplicamos
  // el comportamiento abrir/cerrar del acordeón.
  setTimeout(()=>finishToggle(button,config,wasOpen,topBefore),45);
  setTimeout(()=>{
    if(!wasOpen&&button.getAttribute('aria-expanded')==='true'){
      const panel=$(config.panel);
      if(panel&&button.nextElementSibling!==panel)button.insertAdjacentElement('afterend',panel);
    }
  },130);
}

function cleanupWhenLeaving(event){
  if(!event.target.closest('nav button,[data-home],[data-nav],[data-voice-home],[data-voice-cat]'))return;
  configs.forEach(config=>{
    const panel=$(config.panel);
    if(panel?.classList.contains('voice-foldable-panel')){
      stopInside(config,panel);
      panel.classList.add('hidden');
      panel.classList.remove('voice-foldable-panel');
      setExpanded(config,null);
    }
  });
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
