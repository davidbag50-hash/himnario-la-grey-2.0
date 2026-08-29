(()=>{
'use strict';
function placeResults(){
 const shell=document.getElementById('lgExactHome');
 const results=document.getElementById('results');
 if(!shell||!results)return;
 const search=shell.querySelector('.exact-search-wrap');
 if(!search)return;
 if(results.previousElementSibling!==search)search.insertAdjacentElement('afterend',results);
 results.classList.add('exact-search-results');
}
function wire(){
 placeResults();
 setTimeout(placeResults,80);
 setTimeout(placeResults,300);
 const q=document.getElementById('q');
 q?.addEventListener('input',()=>{
   placeResults();
   requestAnimationFrame(()=>{
     const search=document.querySelector('#lgExactHome .exact-search-wrap');
     if(!search)return;
     const top=(search.getBoundingClientRect().top+window.scrollY)-12;
     if(window.scrollY>top)window.scrollTo(0,Math.max(0,top));
   });
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();
