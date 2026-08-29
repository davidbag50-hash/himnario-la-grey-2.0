(()=>{
'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const home=$('#home'),shell=$('#lgExactHome');
if(!home||!shell)return;
const originals={};
['songs','hymns','voice','chords','tuner','calendar','favorites'].forEach(k=>originals[k]=home.querySelector(`.legacy-home-bridge [data-open="${k}"]`)||home.querySelector(`.home-grid [data-open="${k}"]`));
const profile=$('#profileBtn'),notation=$('#notationBtn'),settings=$('#settingsBtn'),sourceSearch=$('#q');
const oldNav=[...document.querySelectorAll('body>nav button')];
const navFor=k=>document.querySelector(`body>nav [data-nav="${k}"]`)||oldNav.find(b=>(b.dataset.nav||'')===k);
const exactSearch=$('#exactSearch');
function syncNotation(){
 const label=$('.exact-notation-label');if(!label)return;
 const txt=(notation?.textContent||'C D E').replace(/[^A-Za-zÁÉÍÓÚáéíóú ]/g,' ').replace(/\s+/g,' ').trim();
 label.textContent=/Do|Re|Mi/i.test(txt)?'Do Re Mi':'C D E';
}
function updateScreen(){
 const visible=!home.classList.contains('hidden');
 document.body.classList.toggle('exact-home-screen',visible);
 syncNotation();
}
new MutationObserver(updateScreen).observe(home,{attributes:true,attributeFilter:['class']});
updateScreen();
shell.addEventListener('click',e=>{
 const a=e.target.closest('[data-exact-action]');
 if(a){({profile,notation,settings}[a.dataset.exactAction])?.click();setTimeout(syncNotation,30);return}
 const o=e.target.closest('[data-exact-open]');
 if(o){originals[o.dataset.exactOpen]?.click();return}
 const n=e.target.closest('[data-exact-nav]');
 if(n){
   const k=n.dataset.exactNav;
   if(k==='home'){navFor('home')?.click();window.scrollTo(0,0)}
   else if(originals[k])originals[k].click();
   else navFor(k)?.click();
 }
});
if(exactSearch&&sourceSearch){
 exactSearch.addEventListener('input',()=>{sourceSearch.value=exactSearch.value;sourceSearch.dispatchEvent(new Event('input',{bubbles:true}))});
 sourceSearch.addEventListener('input',()=>{if(document.activeElement!==exactSearch)exactSearch.value=sourceSearch.value});
}
document.addEventListener('click',e=>{if(e.target.closest('#notationBtn'))setTimeout(syncNotation,35)},true);
})();