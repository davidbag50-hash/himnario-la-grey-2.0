(()=>{
'use strict';
const $=s=>document.querySelector(s);
const home=$('#home'),shell=$('#lgExactHome');
if(!home||!shell)return;

const profile=$('#profileBtn'),notation=$('#notationBtn'),settings=$('#settingsBtn');

const dailyVerses=[['Salmo 23:1','Jehová es mi pastor; nada me faltará.'],['Filipenses 4:13','Todo lo puedo en Cristo que me fortalece.'],['Proverbios 3:5','Fíate de Jehová de todo tu corazón, y no estribes en tu prudencia.'],['Salmo 46:1','Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.'],['Mateo 11:28','Venid a mí todos los que estáis trabajados y cargados, que yo os haré descansar.'],['Salmo 119:105','Lámpara es a mis pies tu palabra, y lumbrera a mi camino.'],['Josué 1:9','Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios será contigo en donde quiera que fueres.'],['Isaías 41:10','No temas, que yo soy contigo; no desmayes, que yo soy tu Dios que te esfuerzo: siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.'],['Salmo 37:5','Encomienda a Jehová tu camino, y espera en él; y él hará.'],['Juan 14:6','Yo soy el camino, y la verdad, y la vida: nadie viene al Padre, sino por mí.'],['Romanos 12:12','Gozosos en la esperanza; sufridos en la tribulación; constantes en la oración.'],['1 Corintios 16:14','Todas vuestras cosas sean hechas con caridad.'],['Salmo 34:8','Gustad, y ved que es bueno Jehová: dichoso el hombre que confiará en él.'],['Hebreos 13:8','Jesucristo es el mismo ayer, y hoy, y por los siglos.']];
function greetingText(){const h=new Date().getHours();return h<12?'Buenos días':h<18?'Buenas tardes':'Buenas noches'}
function profileName(){try{return String(JSON.parse(localStorage.getItem('lagrey_member_profile')||'null')?.name||'').trim()}catch{return''}}
function dailyVerse(){const d=new Date(),start=new Date(d.getFullYear(),0,0),day=Math.floor((d-start)/86400000),v=dailyVerses[Math.abs(d.getFullYear()*367+day)%dailyVerses.length];return{ref:v[0],text:v[1]}}
function injectHomePersonal(){const div=shell.querySelector('.exact-divider'),search=shell.querySelector('.exact-search-wrap');if(div&&!shell.querySelector('.exact-personal-greeting')){const g=document.createElement('div');g.className='exact-personal-greeting';g.innerHTML='<div class="exact-greeting-icon">👋</div><div class="exact-greeting-copy"><b></b><span>Qué alegría tenerte en La Grey</span></div>';div.insertAdjacentElement('afterend',g)}if(search&&!shell.querySelector('.exact-daily-verse')){const v=document.createElement('div');v.className='exact-daily-verse';v.innerHTML='<div class="exact-verse-kicker">VERSÍCULO DEL DÍA</div><p class="exact-verse-text"></p><div class="exact-verse-ref"></div>';search.insertAdjacentElement('afterend',v)}updateHomePersonal()}
function updateHomePersonal(){const name=profileName(),g=shell.querySelector('.exact-greeting-copy b'),v=dailyVerse();if(g)g.textContent=name?`${greetingText()}, ${name}`:greetingText();const t=shell.querySelector('.exact-verse-text'),r=shell.querySelector('.exact-verse-ref');if(t)t.textContent=`“${v.text}”`;if(r)r.textContent=v.ref}

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
 if(visible)injectHomePersonal();
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
 setTimeout(updateHomePersonal,50);
},true);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateHomePersonal()});
})();
