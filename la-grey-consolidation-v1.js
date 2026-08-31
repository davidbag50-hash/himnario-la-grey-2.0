(()=>{
'use strict';
const $=s=>document.querySelector(s);
const lang=()=>localStorage.getItem('lagrey_language')==='en'?'en':'es',tx=(es,en)=>lang()==='en'?en:es;

let modalScrollY=0,modalLocked=false,modalTouchY=0;

function syncModalLock(){const open=document.querySelector('.modal:not(.hidden)');if(open&&!modalLocked){modalScrollY=window.scrollY||window.pageYOffset||0;document.documentElement.classList.add('lg-modal-open');document.body.classList.add('lg-modal-open');Object.assign(document.body.style,{position:'fixed',top:`-${modalScrollY}px`,left:'0',right:'0',width:'100%',overflow:'hidden'});modalLocked=true}else if(!open&&modalLocked){document.documentElement.classList.remove('lg-modal-open');document.body.classList.remove('lg-modal-open');['position','top','left','right','width','overflow'].forEach(k=>document.body.style[k]='');modalLocked=false;window.scrollTo(0,modalScrollY)}}
function observeModals(){document.querySelectorAll('.modal').forEach(m=>{if(m.dataset.lgLockObserved==='1')return;m.dataset.lgLockObserved='1';new MutationObserver(syncModalLock).observe(m,{attributes:true,attributeFilter:['class']})})}
function wireTouchLock(){if(document.documentElement.dataset.lgTouchLock==='1')return;document.documentElement.dataset.lgTouchLock='1';document.addEventListener('touchstart',e=>{if(modalLocked&&e.touches?.length)modalTouchY=e.touches[0].clientY},{passive:true,capture:true});document.addEventListener('touchmove',e=>{if(!modalLocked||!e.touches?.length)return;const card=e.target.closest?.('.modal:not(.hidden)>.modal-card');if(!card){e.preventDefault();return}const y=e.touches[0].clientY,d=y-modalTouchY;modalTouchY=y;const top=card.scrollTop<=0,bottom=card.scrollTop+card.clientHeight>=card.scrollHeight-1,no=card.scrollHeight<=card.clientHeight+1;if(no||(top&&d>0)||(bottom&&d<0))e.preventDefault()},{passive:false,capture:true})}

function iconPerson(){return `<svg viewBox="0 0 32 32"><circle cx="16" cy="10" r="6" fill="#0d72d8"/><path d="M5 29c1.1-7.2 4.9-11 11-11s9.9 3.8 11 11" fill="#0d72d8"/></svg>`}
function iconNote(){return `<svg viewBox="0 0 32 32"><path d="M18 5v17.2a5 5 0 1 1-3-4.6V8.4l12-2.6v13.4a5 5 0 1 1-3-4.6V4z" fill="#0d72d8"/></svg>`}
function iconGear(){return `<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="5" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M16 3v4M16 25v4M3 16h4M25 16h4M6.8 6.8l2.8 2.8M22.4 22.4l2.8 2.8M25.2 6.8l-2.8 2.8M9.6 22.4l-2.8 2.8" stroke="currentColor" stroke-width="2.5"/></svg>`}
function syncNotation(b){if(!b)return;const latin=(localStorage.getItem('lagrey_notation')||'american')==='latin';b.innerHTML=iconNote()+`<span>${latin?'Do Re Mi':'C D E'}</span>`}
function syncHeaderLanguage(){const p=$('#profileBtn span'),s=$('#settingsBtn');if(p)p.textContent=tx('Perfil','Profile');if(s){const label=tx('Ajustes','Settings');s.setAttribute('aria-label',label);s.setAttribute('title',label)}}
function buildHeader(){const h=$('body>header');if(!h||h.dataset.lgExactInternal==='1')return;const source=$('#lgExactHome .exact-brand'),p=$('#profileBtn'),n=$('#notationBtn'),s=$('#settingsBtn');if(!source||!p||!n||!s){setTimeout(buildHeader,120);return}const shell=document.createElement('div');shell.className='lg-global-shell';const brand=source.cloneNode(true);brand.classList.add('lg-global-brand');const actions=document.createElement('div');actions.className='exact-actions lg-global-actions';p.className='exact-pill';n.className='exact-pill';s.className='exact-pill exact-gear';const profileLabel=$('[data-exact-action="profile"] span')?.textContent?.trim()||tx('Perfil','Profile');p.innerHTML=iconPerson()+`<span>${profileLabel}</span>`;syncNotation(n);s.innerHTML=iconGear();actions.append(p,n,s);const d=document.createElement('div');d.className='exact-divider';d.innerHTML='<span>❧</span>';shell.append(brand,actions,d);h.replaceChildren(shell);h.dataset.lgExactInternal='1';syncHeaderLanguage();n.addEventListener('click',()=>setTimeout(()=>syncNotation(n),0))}

function buildSafeHomeSearch(){
 const real=document.getElementById('q');
 const wrap=document.querySelector('#lgExactHome .exact-search-wrap');
 if(!real||!wrap||document.getElementById('lgSafeSearch'))return;
 real.value='';
 real.setAttribute('aria-hidden','true');
 real.tabIndex=-1;
 Object.assign(real.style,{position:'absolute',width:'1px',height:'1px',opacity:'0',pointerEvents:'none',left:'-9999px'});
 const safe=document.createElement('textarea');
 safe.id='lgSafeSearch';
 safe.className='exact-search';
 safe.rows=1;
 safe.wrap='off';
 safe.placeholder=real.placeholder||tx('Buscar canto, himno o número…','Search song, hymn or number…');
 safe.setAttribute('aria-label',safe.placeholder);
 safe.setAttribute('autocomplete','off');
 safe.setAttribute('autocorrect','off');
 safe.setAttribute('autocapitalize','off');
 safe.setAttribute('spellcheck','false');
 safe.setAttribute('data-lpignore','true');
 safe.setAttribute('data-1p-ignore','true');
 safe.setAttribute('data-bwignore','true');
 safe.setAttribute('data-form-type','other');
 Object.assign(safe.style,{resize:'none',overflow:'hidden',whiteSpace:'nowrap',height:'100%',minHeight:'0',fontFamily:'inherit',lineHeight:'inherit'});
 real.insertAdjacentElement('afterend',safe);
 const push=()=>{real.value=safe.value.replace(/[\r\n]+/g,' ');real.dispatchEvent(new Event('input',{bubbles:true}))};
 safe.addEventListener('input',push);
 safe.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();push()}});
 safe.addEventListener('paste',()=>setTimeout(push,0));
}

function refresh(){observeModals();wireTouchLock();syncModalLock();buildHeader();syncHeaderLanguage();buildSafeHomeSearch()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh);else refresh();
setTimeout(refresh,120);setTimeout(refresh,500);
document.addEventListener('click',()=>setTimeout(syncModalLock,50),true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')setTimeout(syncModalLock,0)},true);
new MutationObserver(muts=>{if(muts.some(m=>m.attributeName==='lang'))syncHeaderLanguage()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
window.addEventListener('pageshow',()=>setTimeout(refresh,0));
})();