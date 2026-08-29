(()=>{
'use strict';
const $=s=>document.querySelector(s);
let modalScrollY=0;
let modalLocked=false;
let modalTouchY=0;
let settingsReturnView=null;
let settingsReturnNav=null;
let settingsReturnScroll=0;

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
 body.lg-modal-open{touch-action:none!important}
 body.lg-modal-open>nav,
 body.lg-modal-open .exact-bottom,
 body.lg-modal-open #readerTools,
 body.lg-modal-open .reader-tools,
 body.lg-modal-open .voice-fab,
 body.lg-modal-open .voice-fab-menu{display:none!important}
 .modal:not(.hidden){position:fixed!important;inset:0!important;width:100%!important;height:100dvh!important;max-height:100dvh!important;overflow:hidden!important;overscroll-behavior:none!important;touch-action:none!important;z-index:5000!important}
 .modal:not(.hidden)>.modal-card{position:relative!important;max-height:calc(100dvh - 28px)!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior:contain!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;z-index:5001!important}
 #chordModal:not(.hidden){position:fixed!important;inset:0!important;transform:none!important;margin:0!important}
 #chordModal:not(.hidden)>.modal-card{position:relative!important;transform:none!important;margin:auto!important}
 #settingsBackBtn{display:none!important}
 @media(max-width:620px){.modal:not(.hidden)>.modal-card{max-height:calc(100dvh - 16px)!important}}

 /* Solo dos elementos recuperados del Home anterior: saludo y versículo diario. */
 #lgExactHome .exact-personal-greeting{box-sizing:border-box;margin:0 3px 14px;padding:13px 16px;border:1px solid #183e5f;border-radius:17px;background:linear-gradient(145deg,#071a2d,#09243c);box-shadow:0 7px 20px rgba(0,0,0,.22);display:flex;align-items:center;gap:12px;color:#eef7ff}
 #lgExactHome .exact-greeting-icon{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;flex:0 0 auto;background:rgba(13,114,216,.15);border:1px solid rgba(103,192,255,.16);font-size:21px}
 #lgExactHome .exact-greeting-copy{min-width:0;display:grid;gap:2px}
 #lgExactHome .exact-greeting-copy b{font-family:'Nunito',system-ui,sans-serif;font-size:17px;line-height:1.25;color:#f5f9fd;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 #lgExactHome .exact-greeting-copy span{font-family:'Nunito',system-ui,sans-serif;font-size:12px;line-height:1.3;color:#8fa9bd}
 #lgExactHome .exact-daily-verse{box-sizing:border-box;margin:0 3px 22px;padding:17px 18px 16px;border:1px solid rgba(216,165,45,.24);border-radius:18px;background:radial-gradient(circle at 100% 0,rgba(216,165,45,.09),transparent 34%),linear-gradient(145deg,#081d31,#061726);box-shadow:0 8px 23px rgba(0,0,0,.24);position:relative;overflow:hidden}
 #lgExactHome .exact-daily-verse:after{content:'✦';position:absolute;right:15px;top:13px;color:#d8a52d;font-size:17px;opacity:.82}
 #lgExactHome .exact-verse-kicker{font-family:'Nunito',system-ui,sans-serif;font-size:10px;font-weight:800;letter-spacing:1.8px;color:#d8a52d;margin-bottom:7px;padding-right:28px}
 #lgExactHome .exact-verse-text{font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.48;color:#eaf4fc;margin:0 0 8px;font-style:italic}
 #lgExactHome .exact-verse-ref{font-family:'Nunito',system-ui,sans-serif;font-size:12px;font-weight:800;color:#72c4ff}
 @media(max-width:620px){#lgExactHome .exact-personal-greeting{margin-bottom:12px;padding:12px 14px}#lgExactHome .exact-greeting-icon{width:38px;height:38px;border-radius:12px}#lgExactHome .exact-greeting-copy b{font-size:15px}#lgExactHome .exact-daily-verse{margin-bottom:18px;padding:15px 16px}#lgExactHome .exact-verse-text{font-size:14px}}
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

/* En Android evita que un gesto dentro del modal termine desplazando la página de atrás. */
function wireTouchLock(){
 if(document.documentElement.dataset.lgTouchLock==='1')return;
 document.documentElement.dataset.lgTouchLock='1';
 document.addEventListener('touchstart',e=>{
   if(!modalLocked||!e.touches?.length)return;
   modalTouchY=e.touches[0].clientY;
 },{passive:true,capture:true});
 document.addEventListener('touchmove',e=>{
   if(!modalLocked||!e.touches?.length)return;
   const card=e.target.closest?.('.modal:not(.hidden)>.modal-card');
   if(!card){e.preventDefault();return}
   const y=e.touches[0].clientY;
   const fingerDelta=y-modalTouchY;
   modalTouchY=y;
   const atTop=card.scrollTop<=0;
   const atBottom=card.scrollTop+card.clientHeight>=card.scrollHeight-1;
   const cannotScroll=card.scrollHeight<=card.clientHeight+1;
   if(cannotScroll||(atTop&&fingerDelta>0)||(atBottom&&fingerDelta<0))e.preventDefault();
 },{passive:false,capture:true});
}

/* Observa únicamente los modales, no todo el DOM. */
function observeModals(){
 document.querySelectorAll('.modal').forEach(modal=>{
   if(modal.dataset.lgLockObserved==='1')return;
   modal.dataset.lgLockObserved='1';
   new MutationObserver(()=>syncModalLock()).observe(modal,{attributes:true,attributeFilter:['class']});
 });
}

/* Ajustes se abre y se cierra con el mismo engranaje. */
function settingsIsOpen(){const v=document.getElementById('settingsView');return !!v&&!v.classList.contains('hidden')}
function openSettingsFromGear(){
 const settings=document.getElementById('settingsView');if(!settings)return;
 const current=[...document.querySelectorAll('.view')].find(v=>v.id!=='settingsView'&&!v.classList.contains('hidden'));
 settingsReturnView=current?.id||'home';
 settingsReturnNav=document.querySelector('nav button.active')?.dataset?.nav||null;
 settingsReturnScroll=window.scrollY||window.pageYOffset||0;
 document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));
 settings.classList.remove('hidden');
 document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));
 window.scrollTo(0,0);
}
function closeSettingsFromGear(){
 const settings=document.getElementById('settingsView');if(!settings)return;
 settings.classList.add('hidden');
 const target=document.getElementById(settingsReturnView||'home')||document.getElementById('home');
 target?.classList.remove('hidden');
 document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));
 if(settingsReturnNav)document.querySelector(`nav button[data-nav="${settingsReturnNav}"]`)?.classList.add('active');
 const y=settingsReturnScroll;
 requestAnimationFrame(()=>setTimeout(()=>window.scrollTo(0,y),0));
 setTimeout(updateHomePersonal,30);
}
function toggleSettingsFromGear(){settingsIsOpen()?closeSettingsFromGear():openSettingsFromGear()}
function wireSettingsGearToggle(){
 if(document.documentElement.dataset.lgSettingsGearToggle==='1')return;
 document.documentElement.dataset.lgSettingsGearToggle='1';
 document.addEventListener('click',e=>{
   if(!e.target.closest?.('#settingsBtn'))return;
   e.preventDefault();
   e.stopImmediatePropagation();
   toggleSettingsFromGear();
 },true);
}

const dailyVerses=[
 ['Salmo 23:1','Jehová es mi pastor; nada me faltará.'],
 ['Filipenses 4:13','Todo lo puedo en Cristo que me fortalece.'],
 ['Proverbios 3:5','Fíate de Jehová de todo tu corazón, y no estribes en tu prudencia.'],
 ['Salmo 46:1','Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.'],
 ['Mateo 11:28','Venid a mí todos los que estáis trabajados y cargados, que yo os haré descansar.'],
 ['Salmo 119:105','Lámpara es a mis pies tu palabra, y lumbrera a mi camino.'],
 ['Josué 1:9','Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios será contigo en donde quiera que fueres.'],
 ['Isaías 41:10','No temas, que yo soy contigo; no desmayes, que yo soy tu Dios que te esfuerzo: siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.'],
 ['Salmo 37:5','Encomienda a Jehová tu camino, y espera en él; y él hará.'],
 ['Juan 14:6','Yo soy el camino, y la verdad, y la vida: nadie viene al Padre, sino por mí.'],
 ['Romanos 12:12','Gozosos en la esperanza; sufridos en la tribulación; constantes en la oración.'],
 ['1 Corintios 16:14','Todas vuestras cosas sean hechas con caridad.'],
 ['Salmo 34:8','Gustad, y ved que es bueno Jehová: dichoso el hombre que confiará en él.'],
 ['Hebreos 13:8','Jesucristo es el mismo ayer, y hoy, y por los siglos.']
];
function greetingText(){const h=new Date().getHours();return h<12?'Buenos días':h<18?'Buenas tardes':'Buenas noches'}
function profileName(){
 try{
   const p=JSON.parse(localStorage.getItem('lagrey_member_profile')||'null');
   if(p?.name)return String(p.name).trim();
 }catch{}
 return '';
}
function dailyVerse(){
 const oldText=document.getElementById('dailyVerseText')?.textContent?.trim();
 const oldRef=document.getElementById('dailyVerseHome')?.textContent?.trim();
 if(oldText&&oldRef)return {text:oldText.replace(/^“|”$/g,''),ref:oldRef};
 const d=new Date(),start=new Date(d.getFullYear(),0,0),day=Math.floor((d-start)/86400000);
 const v=dailyVerses[Math.abs(d.getFullYear()*367+day)%dailyVerses.length];
 return {ref:v[0],text:v[1]};
}
function injectHomePersonal(){
 const shell=document.getElementById('lgExactHome');if(!shell)return;
 const divider=shell.querySelector('.exact-divider');
 const search=shell.querySelector('.exact-search-wrap');
 if(divider&&!shell.querySelector('.exact-personal-greeting')){
   const g=document.createElement('div');g.className='exact-personal-greeting';
   g.innerHTML='<div class="exact-greeting-icon">👋</div><div class="exact-greeting-copy"><b></b><span>Qué alegría tenerte en La Grey</span></div>';
   divider.insertAdjacentElement('afterend',g);
 }
 if(search&&!shell.querySelector('.exact-daily-verse')){
   const v=document.createElement('div');v.className='exact-daily-verse';
   v.innerHTML='<div class="exact-verse-kicker">VERSÍCULO DEL DÍA</div><p class="exact-verse-text"></p><div class="exact-verse-ref"></div>';
   search.insertAdjacentElement('afterend',v);
 }
 updateHomePersonal();
}
function updateHomePersonal(){
 const shell=document.getElementById('lgExactHome');if(!shell)return;
 const name=profileName();
 const greeting=shell.querySelector('.exact-greeting-copy b');
 if(greeting)greeting.textContent=name?`${greetingText()}, ${name}`:greetingText();
 const v=dailyVerse();
 const text=shell.querySelector('.exact-verse-text'),ref=shell.querySelector('.exact-verse-ref');
 if(text)text.textContent=`“${v.text}”`;
 if(ref)ref.textContent=v.ref;
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

function restoreCriticalControls(){
 ['startTunerBtn','stopTunerBtn','addEventBtn','saveEventBtn','deleteEventBtn'].forEach(id=>{
   const el=document.getElementById(id);if(!el)return;
   el.disabled=false;el.style.pointerEvents='auto';el.style.touchAction='manipulation';
 });
 document.querySelectorAll('#calendarGrid .day-cell').forEach(el=>{el.disabled=false;el.style.pointerEvents='auto'});
}

function refreshUiState(){forceDarkOnly();ensureModalLockCss();buildHeader();restoreCriticalControls();observeModals();wireTouchLock();wireSettingsGearToggle();syncModalLock();injectHomePersonal();updateHomePersonal()}

refreshUiState();
setTimeout(refreshUiState,120);setTimeout(refreshUiState,500);
document.addEventListener('click',()=>{setTimeout(refreshUiState,0);setTimeout(refreshUiState,60);setTimeout(updateHomePersonal,260)},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')setTimeout(syncModalLock,0)},true);
window.addEventListener('pageshow',()=>setTimeout(refreshUiState,0));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateHomePersonal()});
})();