(()=>{
'use strict';
const $=s=>document.querySelector(s);
let modalScrollY=0;
let modalLocked=false;

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

function ensureModalLockCss(){
 if(document.getElementById('lgModalLockCss'))return;
 const style=document.createElement('style');
 style.id='lgModalLockCss';
 style.textContent=`
 html.lg-modal-open,body.lg-modal-open{overflow:hidden!important;overscroll-behavior:none!important}
 .modal:not(.hidden){position:fixed!important;inset:0!important;width:100%!important;height:100dvh!important;max-height:100dvh!important;overflow:hidden!important;overscroll-behavior:contain!important}
 .modal:not(.hidden)>.modal-card{position:relative!important;max-height:calc(100dvh - 28px)!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important}
 @media(max-width:620px){.modal:not(.hidden)>.modal-card{max-height:calc(100dvh - 16px)!important}}
 `;
 document.head.appendChild(style);
}

/* Congela por completo la página de atrás mientras haya cualquier modal abierto. */
function syncModalLock(){
 const openModal=document.querySelector('.modal:not(.hidden)');
 if(openModal&&!modalLocked){
   modalScrollY=window.scrollY||window.pageYOffset||0;
   document.documentElement.classList.add('lg-modal-open');
   document.body.classList.add('lg-modal-open');
   document.body.style.position='fixed';
   document.body.style.top=`-${modalScrollY}px`;
   document.body.style.left='0';
   document.body.style.right='0';
   document.body.style.width='100%';
   document.body.style.overflow='hidden';
   modalLocked=true;
 }else if(!openModal&&modalLocked){
   document.documentElement.classList.remove('lg-modal-open');
   document.body.classList.remove('lg-modal-open');
   document.body.style.position='';
   document.body.style.top='';
   document.body.style.left='';
   document.body.style.right='';
   document.body.style.width='';
   document.body.style.overflow='';
   modalLocked=false;
   window.scrollTo(0,modalScrollY);
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

function refreshUiState(){forceDarkOnly();ensureModalLockCss();buildHeader();restoreCriticalControls();syncModalLock()}

refreshUiState();
document.addEventListener('click',()=>{setTimeout(refreshUiState,0);setTimeout(refreshUiState,60)},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')setTimeout(syncModalLock,0)},true);
window.addEventListener('pageshow',()=>setTimeout(refreshUiState,0));
})();