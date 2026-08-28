(()=>{
'use strict';
const $=s=>document.querySelector(s);

/* La Grey vuelve a un único tema: oscuro. */
function forceDarkOnly(){
 try{localStorage.setItem('lagrey_theme','dark')}catch{}
 document.documentElement.dataset.theme='dark';
 document.documentElement.dataset.themeChoice='dark';
 const meta=document.querySelector('meta[name="theme-color"]');
 if(meta)meta.content='#17324d';
 const themeSelect=document.getElementById('settingsTheme');
 if(themeSelect){
   const row=themeSelect.closest('.settings-row');
   if(row)row.remove();
   else themeSelect.remove();
 }
}

function iconPerson(){return `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="10" r="6" fill="#0d72d8"/><path d="M5 29c1.1-7.2 4.9-11 11-11s9.9 3.8 11 11" fill="#0d72d8"/></svg>`}
function iconNote(){return `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M18 5v17.2a5 5 0 1 1-3-4.6V8.4l12-2.6v13.4a5 5 0 1 1-3-4.6V4z" fill="#0d72d8"/></svg>`}
function iconGear(){return `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="5" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M16 3v4M16 25v4M3 16h4M25 16h4M6.8 6.8l2.8 2.8M22.4 22.4l2.8 2.8M25.2 6.8l-2.8 2.8M9.6 22.4l-2.8 2.8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`}

function syncNotation(btn){
 if(!btn)return;
 const latin=(localStorage.getItem('lagrey_notation')||'american')==='latin';
 btn.innerHTML=iconNote()+`<span>${latin?'Do Re Mi':'C D E'}</span>`;
}

function buildHeader(){
 const header=$('body>header');
 if(!header||header.dataset.lgExactInternal==='1')return;
 const source=$('#lgExactHome .exact-brand');
 const profile=$('#profileBtn'),notation=$('#notationBtn'),settings=$('#settingsBtn');
 if(!source||!profile||!notation||!settings){setTimeout(buildHeader,120);return}

 const shell=document.createElement('div');shell.className='lg-global-shell';
 const brand=source.cloneNode(true);brand.classList.add('lg-global-brand');
 const actions=document.createElement('div');actions.className='exact-actions lg-global-actions';
 profile.className='exact-pill';notation.className='exact-pill';settings.className='exact-pill exact-gear';
 profile.innerHTML=iconPerson()+'<span>Perfil</span>';
 syncNotation(notation);
 settings.innerHTML=iconGear();
 actions.append(profile,notation,settings);
 const divider=document.createElement('div');divider.className='exact-divider';divider.innerHTML='<span>❧</span>';
 shell.append(brand,actions,divider);
 header.replaceChildren(shell);
 header.dataset.lgExactInternal='1';

 notation.addEventListener('click',()=>setTimeout(()=>syncNotation(notation),0));
}

/* No reemplazamos la lógica original: solo verificamos que los controles reales sigan siendo interactivos. */
function restoreCriticalControls(){
 ['startTunerBtn','stopTunerBtn','addEventBtn','saveEventBtn','deleteEventBtn'].forEach(id=>{
   const el=document.getElementById(id);if(!el)return;
   el.disabled=false;el.style.pointerEvents='auto';el.style.touchAction='manipulation';
 });
 document.querySelectorAll('#calendarGrid .day-cell').forEach(el=>{el.disabled=false;el.style.pointerEvents='auto'});
}

forceDarkOnly();buildHeader();restoreCriticalControls();
document.addEventListener('click',()=>setTimeout(()=>{forceDarkOnly();buildHeader();restoreCriticalControls()},30),true);
})();