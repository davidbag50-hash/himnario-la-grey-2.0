(()=>{
'use strict';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

/* La Grey 3: runtime consolidado. Esta capa reemplaza parches pequeños y evita listeners duplicados. */
document.documentElement.dataset.lgListScrollMemory='1';

function ensureBaseStyle(){
 if(document.getElementById('lgConsolidatedBaseStyle'))return;
 const style=document.createElement('style');
 style.id='lgConsolidatedBaseStyle';
 style.textContent=`
 #rootFilters .chip.active{background:#081d31!important;color:#ffd76a!important;border:2px solid #f4bd3d!important;box-shadow:0 0 0 1px rgba(244,189,61,.18),0 0 14px rgba(244,189,61,.18)!important;font-weight:800!important}
 body.lg-song-detail>nav,
 body.lg-song-detail .exact-bottom{display:none!important}
 `;
 document.head.appendChild(style);
}

/* Iconos de navegación y títulos: reemplaza app-fixes-v1.js. */
const navIcons={
 home:`<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 15L16 4l13 11v14H20v-9h-8v9H3z" fill="currentColor"/></svg>`,
 songs:`<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M19 5v17.5a5 5 0 1 1-3-4.6V8.5l11-2.6v13.5a5 5 0 1 1-3-4.6V4.2z" fill="currentColor"/></svg>`,
 chords:`<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="4" width="22" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="2.3"/><path d="M10 4v24M16 4v24M22 4v24M5 10h22M5 16h22M5 22h22" stroke="currentColor" stroke-width="1.6"/><circle cx="10" cy="16" r="2.4" fill="currentColor"/><circle cx="16" cy="10" r="2.4" fill="currentColor"/><circle cx="22" cy="22" r="2.4" fill="currentColor"/></svg>`,
 calendar:`<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="6" width="24" height="22" rx="3" fill="none" stroke="currentColor" stroke-width="2.3"/><path d="M4 12h24M10 3v6M22 3v6" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/><path d="M9 17h3v3H9zm6 0h3v3h-3zm6 0h3v3h-3zM9 22h3v3H9zm6 0h3v3h-3z" fill="currentColor"/></svg>`,
 tuner:`<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 23a11 11 0 0 1 22 0" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M16 23l5-11" stroke="currentColor" stroke-width="2.7" stroke-linecap="round"/><circle cx="16" cy="23" r="2.5" fill="currentColor"/><path d="M7 25h18" stroke="currentColor" stroke-width="2.4"/></svg>`
};
const sectionIcons={
 songs:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 9c6-3 11-2 14 1v15c-4-2-9-2-14 0z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M26 9c-6-3-11-2-14 1v15c4-2 9-2 14 0z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 10v15" stroke="#d8a52d" stroke-width="2"/></svg>',
 hymns:'<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="7" y="4" width="18" height="24" rx="3" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M16 9v10M11 14h10" stroke="#d8a52d" stroke-width="2.4" stroke-linecap="round"/></svg>',
 chords:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 4h5l-1 24H8z" fill="#9b652f"/><rect x="14" y="8" width="13" height="15" rx="1" fill="none" stroke="currentColor" stroke-width="2"/><path d="M18 8v15M22 8v15M14 13h13M14 18h13" stroke="currentColor" stroke-width="1.3"/><circle cx="18" cy="18" r="1.8" fill="#0d72d8"/><circle cx="22" cy="13" r="1.8" fill="#0d72d8"/></svg>',
 tuner:'<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 22a10 10 0 0 1 20 0" fill="none" stroke="currentColor" stroke-width="2.3"/><path d="M16 22l5-11" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><circle cx="16" cy="22" r="2.5" fill="currentColor"/><path d="M7 25h18" stroke="#d8a52d" stroke-width="2"/></svg>',
 calendar:'<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="7" width="22" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M5 12h22M10 4v6M22 4v6" stroke="currentColor" stroke-width="2.2"/><path d="M20 16l1.5 3 3.5.4-2.6 2.4.7 3.4-3.1-1.6-3.1 1.6.7-3.4-2.6-2.4 3.5-.4z" fill="#d8a52d"/></svg>',
 settings:'<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="5" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M16 3v4M16 25v4M3 16h4M25 16h4M6.8 6.8l2.8 2.8M22.4 22.4l2.8 2.8M25.2 6.8l-2.8 2.8M9.6 22.4l-2.8 2.8" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
 voice:'<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="11" y="4" width="10" height="16" rx="5" fill="none" stroke="currentColor" stroke-width="2.3"/><path d="M8 16a8 8 0 0 0 16 0M16 24v5M11 29h10" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/></svg>'
};
const navLabels={home:'Inicio',songs:'Cantos',chords:'Acordes',calendar:'Calendario',tuner:'Afinador'};
function refreshLegacyNavIcons(){
 const nav=document.querySelector('body>nav');if(!nav)return;
 nav.querySelectorAll('button[data-nav]').forEach(b=>{
   const k=b.dataset.nav;if(!navIcons[k])return;
   const text=b.querySelector('span')?.textContent?.trim()||navLabels[k];
   if(!b.querySelector('svg'))b.innerHTML=navIcons[k]+`<span>${text}</span>`;
 });
}
function cleanTitle(h){
 if(!h)return'';
 const clone=h.cloneNode(true);clone.querySelectorAll('.lg-section-icon').forEach(n=>n.remove());
 return clone.textContent.replace(/[🎵🎼🎤🎸🎹📅⚙️⭐✨]/g,'').trim();
}
function decorateTitle(h,type){
 if(!h||h.querySelector('.lg-section-icon'))return;
 const text=cleanTitle(h);h.textContent='';
 const icon=document.createElement('span');icon.className='lg-section-icon';icon.innerHTML=sectionIcons[type]||sectionIcons.songs;
 const label=document.createElement('span');label.textContent=text;
 h.append(icon,label);
}
function refreshSectionIcons(){
 const list=document.querySelector('#listing>h1');
 if(list){const t=cleanTitle(list).toLowerCase();decorateTitle(list,t.includes('himno')?'hymns':'songs')}
 decorateTitle(document.querySelector('#chordsView .section-title-row h1'),'chords');
 decorateTitle(document.querySelector('#tunerView .head h1'),'tuner');
 decorateTitle(document.querySelector('#calendarView .calendar-head h1'),'calendar');
 decorateTitle(document.querySelector('#settingsView .settings-title h1'),'settings');
 decorateTitle(document.querySelector('#voiceView h1'),'voice');
}

/* Resultados del buscador siempre debajo de la barra visual actual. */
function placeHomeResults(){
 const shell=document.getElementById('lgExactHome');
 const results=document.getElementById('results');
 const search=shell?.querySelector('.exact-search-wrap');
 if(!shell||!results||!search)return;
 if(results.previousElementSibling!==search)search.insertAdjacentElement('afterend',results);
 results.classList.add('exact-search-results');
}
function wireHomeSearch(){
 const q=document.getElementById('q');
 if(!q||q.dataset.lgConsolidatedSearch==='1')return;
 q.dataset.lgConsolidatedSearch='1';
 q.addEventListener('input',()=>{
   placeHomeResults();
   requestAnimationFrame(()=>{
     const search=document.querySelector('#lgExactHome .exact-search-wrap');
     if(!search)return;
     const top=(search.getBoundingClientRect().top+window.scrollY)-12;
     if(window.scrollY>top)window.scrollTo(0,Math.max(0,top));
   });
 });
}

/* Regreso desde una canción/himno sin reconstruir la lista. */
let fromList=false;
let savedY=0;
let savedId='';
let savedKey='cantos';
function listKey(){
 const t=(document.getElementById('listTitle')?.textContent||'').toLowerCase();
 if(t.includes('himno'))return'himnos';
 if(t.includes('favor'))return'fav';
 return'cantos';
}
function saveListState(btn){fromList=true;savedY=window.scrollY||window.pageYOffset||0;savedId=String(btn.dataset.song||'');savedKey=listKey()}
function restoreExistingList(){
 const detail=document.getElementById('detail'),listing=document.getElementById('listing');if(!listing)return;
 detail?.classList.add('hidden');document.getElementById('settingsView')?.classList.add('hidden');listing.classList.remove('hidden');
 document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));
 if(savedKey==='cantos')document.querySelector('nav button[data-nav="songs"]')?.classList.add('active');
 const apply=()=>{
   const safeId=(window.CSS&&CSS.escape)?CSS.escape(savedId):savedId.replace(/[^a-zA-Z0-9_-]/g,'');
   const anchor=savedId?document.querySelector(`#songList [data-song="${safeId}"]`):null;
   if(anchor){
     const listTop=(document.getElementById('songList')?.getBoundingClientRect().top||0)+(window.scrollY||0);
     const anchorTop=anchor.getBoundingClientRect().top+(window.scrollY||0);
     window.scrollTo(0,Math.max(0,Math.min(savedY,anchorTop-listTop+savedY)));
   }else window.scrollTo(0,savedY);
 };
 window.scrollTo(0,savedY);requestAnimationFrame(()=>requestAnimationFrame(apply));setTimeout(apply,40);setTimeout(apply,120);fromList=false;syncSongDetailMode();
}
function wireListReturn(){
 if(document.documentElement.dataset.lgConsolidatedListReturn==='1')return;
 document.documentElement.dataset.lgConsolidatedListReturn='1';
 document.addEventListener('click',e=>{
   const song=e.target.closest?.('#songList [data-song]');
   if(song&&!document.getElementById('listing')?.classList.contains('hidden')){saveListState(song);return}
   if(e.target.closest?.('#songBackBtn')&&fromList){e.preventDefault();e.stopImmediatePropagation();restoreExistingList()}
 },true);
}

/* La vista de letra es inmersiva: ninguna barra inferior mientras #detail esté abierto. */
function syncSongDetailMode(){
 const detail=document.getElementById('detail');const on=!!detail&&!detail.classList.contains('hidden');
 document.body.classList.toggle('lg-song-detail',on);
 document.querySelectorAll('body>nav,.exact-bottom').forEach(bar=>{if(on)bar.style.setProperty('display','none','important');else bar.style.removeProperty('display')});
}
function observeSongDetail(){
 const detail=document.getElementById('detail');if(!detail||detail.dataset.lgConsolidatedObserved==='1')return;
 detail.dataset.lgConsolidatedObserved='1';
 new MutationObserver(syncSongDetailMode).observe(detail,{attributes:true,attributeFilter:['class']});
 window.addEventListener('resize',syncSongDetailMode,{passive:true});
 window.addEventListener('orientationchange',()=>setTimeout(syncSongDetailMode,30),{passive:true});
}

function refresh(){
 ensureBaseStyle();refreshLegacyNavIcons();refreshSectionIcons();placeHomeResults();wireHomeSearch();wireListReturn();observeSongDetail();syncSongDetailMode();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh);else refresh();
setTimeout(refresh,100);setTimeout(refresh,500);
document.addEventListener('click',()=>setTimeout(()=>{refreshSectionIcons();refreshLegacyNavIcons();syncSongDetailMode()},40),true);
window.addEventListener('pageshow',()=>setTimeout(refresh,0));
})();