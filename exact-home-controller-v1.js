(()=>{
'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const home=$('#home'),shell=$('#lgExactHome');
if(!home||!shell)return;

/*
 * El Home actual es la interfaz real. app.js todavía nace con algunos
 * controles históricos; tomamos sus handlers una sola vez y eliminamos
 * esos nodos inmediatamente después. Desde aquí no hay clics encadenados.
 */
const bridge=$('.legacy-home-bridge');
const legacySearch=bridge?.querySelector('#q');
const exactSearch=$('#exactSearch');

function adoptHandler(current,legacy){
 if(!current||!legacy)return;
 const fn=legacy.onclick;
 if(typeof fn==='function')current.onclick=fn;
}

['songs','hymns','voice','chords','tuner','calendar','favorites'].forEach(key=>{
 const current=shell.querySelector(`[data-exact-open="${key}"]`);
 const legacy=bridge?.querySelector(`[data-open="${key}"]`);
 adoptHandler(current,legacy);
});

/* El buscador visible pasa a ser #q: app.js y la numeración de himnos usan
   el mismo input real, sin sincronización ni input duplicado. */
if(exactSearch){
 const searchHandler=legacySearch?.oninput;
 exactSearch.id='q';
 if(typeof searchHandler==='function')exactSearch.oninput=searchHandler;
}

/* Conservamos solamente cuatro sinks de estado no visuales porque app.js
   aún actualiza esos IDs. No forman parte de ninguna interfaz antigua. */
let state=$('#lgAppState');
if(!state){state=document.createElement('div');state.id='lgAppState';state.hidden=true;home.appendChild(state)}
['countSongs','countHymns','countFavs','nextEventHome'].forEach(id=>{
 const old=bridge?.querySelector(`#${id}`);
 const node=document.createElement('span');node.id=id;if(old)node.textContent=old.textContent;state.appendChild(node);
});

/* El puente visual/funcional antiguo deja de existir tras transferir handlers. */
bridge?.remove();

const profile=$('#profileBtn'),notation=$('#notationBtn'),settings=$('#settingsBtn');
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
 const n=e.target.closest('[data-exact-nav]');
 if(!n)return;
 const key=n.dataset.exactNav;
 if(key==='home'){document.querySelector('body>nav [data-nav="home"]')?.click();window.scrollTo(0,0);return}
 /* Los botones superiores ya tienen el handler real adoptado. */
 const card=shell.querySelector(`[data-exact-open="${key}"]`);
 if(card&&typeof card.onclick==='function'){card.onclick.call(card,new MouseEvent('click',{bubbles:false,cancelable:true}));return}
 document.querySelector(`body>nav [data-nav="${key}"]`)?.click();
});

document.addEventListener('click',e=>{if(e.target.closest('#notationBtn'))setTimeout(syncNotation,35)},true);
})();