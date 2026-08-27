(()=>{
'use strict';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const config={name:'pro',selector:'.voice-pro-card',panel:'#voiceProPanel'};
let restoreTimer=0;
let savedScrollIntoView=null;
let savedScrollTo=null;
let savedScroll=null;

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

function suppressLegacyAutoScroll(){
  clearTimeout(restoreTimer);
  document.documentElement.classList.add('voice-foldable-lock');
  if(!savedScrollIntoView){savedScrollIntoView=Element.prototype.scrollIntoView;Element.prototype.scrollIntoView=function(){};}
  if(!savedScrollTo){savedScrollTo=window.scrollTo;window.scrollTo=function(){};}
  if(!savedScroll){savedScroll=window.scroll;window.scroll=function(){};}
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

function finishToggle(button,wasOpen,topBefore){
  const panel=$(config.panel);
  if(!panel)return;
  if(wasOpen){
    stopInside();
    panel.classList.add('hidden');
    panel.classList.remove('voice-foldable-panel');
    setExpanded(null);
    stabilizeNow(button,topBefore);
    holdAnchor(button,topBefore,420);
    return;
  }
  setExpanded(button);
  panel.classList.remove('hidden');
  panel.classList.add('voice-foldable-panel');
  button.insertAdjacentElement('afterend',panel);
  stabilizeNow(button,topBefore);
  holdAnchor(button,topBefore);
}

function handleClick(event){
  const button=event.target.closest('.voice-pro-card');
  if(!button)return;
  const wasOpen=button.getAttribute('aria-expanded')==='true';
  const topBefore=button.getBoundingClientRect().top;
  suppressLegacyAutoScroll();
  holdAnchor(button,topBefore,900);
  setTimeout(()=>finishToggle(button,wasOpen,topBefore),45);
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
