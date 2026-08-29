(()=>{
'use strict';
const $=s=>document.querySelector(s);
const home=$('#home'),shell=$('#lgExactHome');
if(!home||!shell)return;

const profile=$('#profileBtn'),notation=$('#notationBtn'),settings=$('#settingsBtn');

function syncNotation(){
 const label=$('.exact-notation-label');
 if(!label)return;
 const txt=(notation?.textContent||'C D E').replace(/[^A-Za-zÁÉÍÓÚáéíóú ]/g,' ').replace(/\s+/g,' ').trim();
 label.textContent=/Do|Re|Mi/i.test(txt)?'Do Re Mi':'C D E';
}

function updateScreen(){
 const visible=!home.classList.contains('hidden');
 if(!visible)document.body.classList.add('lg-startup-finished');
 document.body.classList.toggle('exact-home-screen',visible);
 syncNotation();
}

new MutationObserver(updateScreen).observe(home,{attributes:true,attributeFilter:['class']});
updateScreen();

/* Perfil, notación y Ajustes conservan sus controladores canónicos. */
shell.addEventListener('click',e=>{
 const action=e.target.closest('[data-exact-action]');
 if(!action)return;
 ({profile,notation,settings}[action.dataset.exactAction])?.click();
 setTimeout(syncNotation,30);
});

document.addEventListener('click',e=>{
 if(e.target.closest('#notationBtn'))setTimeout(syncNotation,35);
},true);
})();
