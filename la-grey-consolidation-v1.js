(()=>{
'use strict';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

/* Primera consolidación de La Grey: una sola fuente para pequeños comportamientos de interfaz. */
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
function saveListState(btn){
 fromList=true;
 savedY=window.scrollY||window.pageYOffset||0;
 savedId=String(btn.dataset.song||'');
 savedKey=listKey();
}
function restoreExistingList(){
 const detail=document.getElementById('detail');
 const listing=document.getElementById('listing');
 if(!listing)return;
 detail?.classList.add('hidden');
 document.getElementById('settingsView')?.classList.add('hidden');
 listing.classList.remove('hidden');
 document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));
 if(savedKey==='cantos')document.querySelector('nav button[data-nav="songs"]')?.classList.add('active');
 const apply=()=>{
   const safeId=(window.CSS&&CSS.escape)?CSS.escape(savedId):savedId.replace(/[^a-zA-Z0-9_-]/g,'');
   const anchor=savedId?document.querySelector(`#songList [data-song="${safeId}"]`):null;
   if(anchor){
     const listTop=(document.getElementById('songList')?.getBoundingClientRect().top||0)+(window.scrollY||0);
     const anchorTop=anchor.getBoundingClientRect().top+(window.scrollY||0);
     const wanted=Math.max(0,Math.min(savedY,anchorTop-listTop+savedY));
     window.scrollTo(0,wanted);
   }else window.scrollTo(0,savedY);
 };
 window.scrollTo(0,savedY);
 requestAnimationFrame(()=>requestAnimationFrame(apply));
 setTimeout(apply,40);
 setTimeout(apply,120);
 fromList=false;
 syncSongDetailMode();
}
function wireListReturn(){
 if(document.documentElement.dataset.lgConsolidatedListReturn==='1')return;
 document.documentElement.dataset.lgConsolidatedListReturn='1';
 document.addEventListener('click',e=>{
   const song=e.target.closest?.('#songList [data-song]');
   if(song&&!document.getElementById('listing')?.classList.contains('hidden')){
     saveListState(song);
     return;
   }
   if(e.target.closest?.('#songBackBtn')&&fromList){
     e.preventDefault();
     e.stopImmediatePropagation();
     restoreExistingList();
   }
 },true);
}

/* La vista de letra es inmersiva: ninguna barra inferior mientras #detail esté abierto. */
function syncSongDetailMode(){
 const detail=document.getElementById('detail');
 const on=!!detail&&!detail.classList.contains('hidden');
 document.body.classList.toggle('lg-song-detail',on);
 const bars=[...document.querySelectorAll('body>nav,.exact-bottom')];
 bars.forEach(bar=>{
   if(on)bar.style.setProperty('display','none','important');
   else bar.style.removeProperty('display');
 });
}
function observeSongDetail(){
 const detail=document.getElementById('detail');
 if(!detail||detail.dataset.lgConsolidatedObserved==='1')return;
 detail.dataset.lgConsolidatedObserved='1';
 new MutationObserver(syncSongDetailMode).observe(detail,{attributes:true,attributeFilter:['class']});
 window.addEventListener('resize',syncSongDetailMode,{passive:true});
 window.addEventListener('orientationchange',()=>setTimeout(syncSongDetailMode,30),{passive:true});
}

function refresh(){
 ensureBaseStyle();
 placeHomeResults();
 wireHomeSearch();
 wireListReturn();
 observeSongDetail();
 syncSongDetailMode();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh);else refresh();
setTimeout(refresh,100);
setTimeout(refresh,500);
window.addEventListener('pageshow',()=>setTimeout(refresh,0));
})();