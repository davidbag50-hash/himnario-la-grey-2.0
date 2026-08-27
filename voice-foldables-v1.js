(()=>{
'use strict';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const configs=[
  {name:'pro',selector:'.voice-pro-card',panel:'#voiceProPanel'},
  {name:'routine',selector:'.voice-routine',panel:'#voicePanel'}
];
let restoreTimer=0;
let savedScrollIntoView=null;
let savedScrollTo=null;
let savedScroll=null;

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

function suppressLegacyAutoScroll(){
  clearTimeout(restoreTimer);
  document.documentElement.classList.add('voice-foldable-lock');

  if(!savedScrollIntoView){
    savedScrollIntoView=Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView=function(){};
  }
  if(!savedScrollTo){
    savedScrollTo=window.scrollTo;
    window.scrollTo=function(){};
  }
  if(!savedScroll){
    savedScroll=window.scroll;
    window.scroll=function(){};
  }

  restoreTimer=setTimeout(()=>{
    if(savedScrollIntoView){Element.prototype.scrollIntoView=savedScrollIntoView;savedScrollIntoView=null;}
    if(savedScrollTo){window.scrollTo=savedScrollTo;savedScrollTo=null;}
    if(savedScroll){window.scroll=savedScroll;savedScroll=null;}
    document.documentElement.classList.remove('voice-foldable-lock');
  },850);
}

function stabilizeNow(button,anchorTop){
  if(!button||!button.isConnected||!Number.isFinite(anchorTop))return;
  const now=button.getBoundingClientRect().top;
  const delta=now-anchorTop;
  if(Math.abs(delta)>0.5)window.scrollBy(0,delta);
}

function holdAnchor(button,anchorTop,duration=760){
  if(!button||!Number.isFinite(anchorTop))return;
  const start=performance.now();
  const keep=()=>{
    if(!button.isConnected)return;
    stabilizeNow(button,anchorTop);
    if(performance.now()-start<duration)requestAnimationFrame(keep);
  };
  requestAnimationFrame(keep);
}

function finishToggle(button,config,wasOpen,topBefore){
  const panel=$(config.panel);
  if(!panel)return;

  if(wasOpen){
    stopInside(config,panel);
    panel.classList.add('hidden');
    panel.classList.remove('voice-foldable-panel');
    setExpanded(config,null);
    stabilizeNow(button,topBefore);
    holdAnchor(button,topBefore,420);
    return;
  }

  setExpanded(config,button);
  panel.classList.remove('hidden');
  panel.classList.add('voice-foldable-panel');
  button.insertAdjacentElement('afterend',panel);
  stabilizeNow(button,topBefore);
  holdAnchor(button,topBefore);
}

function handleClick(event){
  const button=event.target.closest('.voice-pro-card,.voice-routine');
  if(!button)return;
  const config=configFor(button);
  if(!config)return;

  const wasOpen=button.getAttribute('aria-expanded')==='true';
  const topBefore=button.getBoundingClientRect().top;

  // Bloquea durante el cambio tanto el auto-scroll de los scripts viejos
  // como el scroll anchoring del navegador. El usuario conserva exactamente
  // la posición visual de la tarjeta que tocó.
  suppressLegacyAutoScroll();
  holdAnchor(button,topBefore,900);

  setTimeout(()=>finishToggle(button,config,wasOpen,topBefore),45);
  setTimeout(()=>{
    if(!wasOpen&&button.getAttribute('aria-expanded')==='true'){
      const panel=$(config.panel);
      if(panel&&button.nextElementSibling!==panel)button.insertAdjacentElement('afterend',panel);
      stabilizeNow(button,topBefore);
      holdAnchor(button,topBefore,500);
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
