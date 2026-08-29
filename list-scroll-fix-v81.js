(()=>{
'use strict';
const state={cantos:null,himnos:null,fav:null};
function key(){
 const t=(document.getElementById('listTitle')?.textContent||'').toLowerCase();
 if(t.includes('himno'))return'himnos';
 if(t.includes('favor'))return'fav';
 return'cantos';
}
function save(btn){
 const k=key();
 state[k]={
   id:String(btn.dataset.song||''),
   top:btn.getBoundingClientRect().top,
   y:window.scrollY||window.pageYOffset||0
 };
}
function restore(k){
 const s=state[k];if(!s)return;
 const apply=()=>{
   const listing=document.getElementById('listing');
   if(!listing||listing.classList.contains('hidden'))return;
   const btn=document.querySelector(`#songList [data-song="${CSS.escape(s.id)}"]`);
   if(btn){
     const now=btn.getBoundingClientRect().top;
     window.scrollTo(0,(window.scrollY||window.pageYOffset||0)+(now-s.top));
   }else window.scrollTo(0,s.y||0);
 };
 requestAnimationFrame(()=>requestAnimationFrame(apply));
 [40,120,300,650].forEach(ms=>setTimeout(apply,ms));
}
document.addEventListener('click',e=>{
 const song=e.target.closest?.('#songList [data-song]');
 if(song&&!document.getElementById('listing')?.classList.contains('hidden')){save(song);return}
 if(e.target.closest?.('#songBackBtn')){
   const k=key();
   setTimeout(()=>restore(k),0);
 }
},true);
})();
