(()=>{
'use strict';
let fromList=false;
let savedY=0;
let savedId='';
let savedKey='cantos';

function key(){
 const t=(document.getElementById('listTitle')?.textContent||'').toLowerCase();
 if(t.includes('himno'))return'himnos';
 if(t.includes('favor'))return'fav';
 return'cantos';
}

function save(btn){
 fromList=true;
 savedY=window.scrollY||window.pageYOffset||0;
 savedId=String(btn.dataset.song||'');
 savedKey=key();
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
   const anchor=savedId?document.querySelector(`#songList [data-song="${CSS.escape(savedId)}"]`):null;
   if(anchor){
     const listTop=(document.getElementById('songList')?.getBoundingClientRect().top||0)+(window.scrollY||0);
     const anchorTop=anchor.getBoundingClientRect().top+(window.scrollY||0);
     const wanted=Math.max(0,Math.min(savedY,anchorTop-listTop+savedY));
     window.scrollTo(0,wanted);
   }else{
     window.scrollTo(0,savedY);
   }
 };

 window.scrollTo(0,savedY);
 requestAnimationFrame(()=>requestAnimationFrame(apply));
 setTimeout(apply,40);
 setTimeout(apply,120);
 fromList=false;
}

document.addEventListener('click',e=>{
 const song=e.target.closest?.('#songList [data-song]');
 if(song&&!document.getElementById('listing')?.classList.contains('hidden')){
   save(song);
   return;
 }

 if(e.target.closest?.('#songBackBtn')&&fromList){
   e.preventDefault();
   e.stopImmediatePropagation();
   restoreExistingList();
 }
},true);
})();
