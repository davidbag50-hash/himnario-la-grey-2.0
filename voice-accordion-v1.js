(()=>{
'use strict';
let bodySeq=0;
const $=s=>document.querySelector(s);

function makeToggle(article,index,title){
  const button=document.createElement('button');
  const bodyId=`voiceExerciseBody${++bodySeq}`;
  button.type='button';
  button.className='voice-exercise-toggle';
  button.setAttribute('aria-expanded','false');
  button.setAttribute('aria-controls',bodyId);

  const copy=document.createElement('span');
  copy.className='voice-exercise-toggle-copy';

  const number=document.createElement('span');
  number.className='voice-exercise-number';
  number.textContent=`Ejercicio ${index+1}`;

  const name=document.createElement('span');
  name.className='voice-exercise-title';
  name.textContent=` — ${title}`;

  const chevron=document.createElement('span');
  chevron.className='voice-exercise-chevron';
  chevron.setAttribute('aria-hidden','true');
  chevron.textContent='⌄';

  copy.append(number,name);
  button.append(copy,chevron);
  return {button,bodyId};
}

function enhanceExercise(article,index){
  if(article.dataset.voiceAccordion==='1')return;

  const heading=article.querySelector(':scope > h3');
  const title=(heading?.textContent||`Ejercicio ${index+1}`).trim();
  const {button,bodyId}=makeToggle(article,index,title);
  const body=document.createElement('div');
  body.id=bodyId;
  body.className='voice-exercise-body';
  body.hidden=true;

  [...article.children].forEach(node=>{
    if(node!==heading)body.appendChild(node);
  });
  heading?.remove();

  article.classList.add('voice-accordion-item');
  article.dataset.voiceAccordion='1';
  article.prepend(button);
  article.appendChild(body);

  button.addEventListener('click',event=>{
    event.preventDefault();
    event.stopPropagation();
    const willOpen=button.getAttribute('aria-expanded')!=='true';
    button.setAttribute('aria-expanded',String(willOpen));
    body.hidden=!willOpen;
    article.classList.toggle('is-open',willOpen);
  });
}

function enhancePanel(){
  const list=$('#voicePanel .voice-exercise-list');
  if(!list)return;
  [...list.querySelectorAll(':scope > .voice-exercise')].forEach(enhanceExercise);
}

function scheduleEnhance(){
  queueMicrotask(enhancePanel);
  requestAnimationFrame(enhancePanel);
}

function boot(){
  const root=$('#voiceView')||document.querySelector('main')||document.body;
  new MutationObserver(()=>scheduleEnhance()).observe(root,{childList:true,subtree:true});
  scheduleEnhance();
}

document.addEventListener('click',event=>{
  if(event.target.closest('[data-voice-cat]'))setTimeout(scheduleEnhance,0);
},true);

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
