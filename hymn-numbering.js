(()=>{
'use strict';
const $=id=>document.getElementById(id),songs=()=>window.LAGREY_SONGS||[];
const byId=id=>songs().find(s=>Number(s.id)===Number(id));
function decorate(root=document){
 root.querySelectorAll('[data-song],[data-search-song]').forEach(b=>{
  const s=byId(b.dataset.song||b.dataset.searchSong);if(!s||s.type!=='himnos'||!s.bookNumber)return;
  const title=b.querySelector('b');if(title&&!title.dataset.numbered){title.textContent=`${s.bookNumber}. ${s.title}`;title.dataset.numbered='1'}
 });
 const badge=$('songTypeBadge'),title=$('songTitle');
 if(badge?.textContent?.trim()==='Himno'&&title){const s=songs().find(x=>x.type==='himnos'&&x.title===title.textContent.trim());let n=$('hymnNumberBadge');if(s?.bookNumber){if(!n){n=document.createElement('span');n.id='hymnNumberBadge';n.className='badge';badge.insertAdjacentElement('afterend',n)}n.textContent=`N.º ${s.bookNumber}`;n.classList.remove('hidden')}else n?.classList.add('hidden')}
 else $('hymnNumberBadge')?.classList.add('hidden');
}
function numericSearch(){
 const q=$('q')?.value.trim();if(!q)return;const m=q.match(/^(?:himno\s*)?#?\s*(\d{1,3})$/i);if(!m)return;const num=Number(m[1]);const found=songs().filter(s=>s.type==='himnos'&&Number(s.bookNumber)===num);const r=$('results');if(!r)return;r.classList.toggle('hidden',!found.length);r.innerHTML=found.map(s=>`<button class="song" data-search-song="${s.id}"><span><b>${s.bookNumber}. ${s.title}</b><br><small class="muted">${s.artist}</small></span><span class="tone">${s.tone}</span></button>`).join('');r.querySelectorAll('[data-search-song]').forEach(b=>{const id=Number(b.dataset.searchSong);b.onclick=()=>{const original=document.querySelector(`[data-song="${id}"]`);if(original)original.click();else{const s=byId(id);if(!s)return;document.querySelector('[data-open="hymns"]')?.click();setTimeout(()=>document.querySelector(`[data-song="${id}"]`)?.click(),30)}}});
}
function schedule(){setTimeout(()=>{decorate();numericSearch()},0);setTimeout(()=>decorate(),80)}
function wire(){document.addEventListener('click',schedule);$('q')?.addEventListener('input',()=>setTimeout(()=>{numericSearch();decorate()},0));new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});schedule()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();