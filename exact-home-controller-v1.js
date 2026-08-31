(()=>{
'use strict';
const $=s=>document.querySelector(s);
const home=$('#home'),shell=$('#lgExactHome');
if(!home||!shell)return;

const profile=$('#profileBtn'),notation=$('#notationBtn'),settings=$('#settingsBtn');
const lang=()=>localStorage.getItem('lagrey_language')==='en'?'en':'es',tx=(es,en)=>lang()==='en'?en:es;

const dailyVerses=[['Salmo 23:1','Jehová es mi pastor; nada me faltará.'],['Filipenses 4:13','Todo lo puedo en Cristo que me fortalece.'],['Proverbios 3:5','Fíate de Jehová de todo tu corazón, y no estribes en tu prudencia.'],['Salmo 46:1','Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.'],['Mateo 11:28','Venid a mí todos los que estáis trabajados y cargados, que yo os haré descansar.'],['Salmo 119:105','Lámpara es a mis pies tu palabra, y lumbrera a mi camino.'],['Josué 1:9','Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios será contigo en donde quiera que fueres.'],['Isaías 41:10','No temas, que yo soy contigo; no desmayes, que yo soy tu Dios que te esfuerzo: siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.'],['Salmo 37:5','Encomienda a Jehová tu camino, y espera en él; y él hará.'],['Juan 14:6','Yo soy el camino, y la verdad, y la vida: nadie viene al Padre, sino por mí.'],['Romanos 12:12','Gozosos en la esperanza; sufridos en la tribulación; constantes en la oración.'],['1 Corintios 16:14','Todas vuestras cosas sean hechas con caridad.'],['Salmo 34:8','Gustad, y ved que es bueno Jehová: dichoso el hombre que confiará en él.'],['Hebreos 13:8','Jesucristo es el mismo ayer, y hoy, y por los siglos.']];
function greetingText(){const h=new Date().getHours();return h<12?tx('Buenos días','Good morning'):h<18?tx('Buenas tardes','Good afternoon'):tx('Buenas noches','Good evening')}
function profileName(){try{return String(JSON.parse(localStorage.getItem('lagrey_member_profile')||'null')?.name||'').trim()}catch{return''}}
function dailyVerse(){const d=new Date(),start=new Date(d.getFullYear(),0,0),day=Math.floor((d-start)/86400000),v=dailyVerses[Math.abs(d.getFullYear()*367+day)%dailyVerses.length];return{ref:v[0],text:v[1]}}
function updateHomeActionLabels(){const gear=shell.querySelector('[data-exact-action="settings"]');if(gear){const label=tx('Ajustes','Settings');gear.setAttribute('aria-label',label);gear.setAttribute('title',label)}}
function injectHomePersonal(){const div=shell.querySelector('.exact-divider'),search=shell.querySelector('.exact-search-wrap');if(div&&!shell.querySelector('.exact-personal-greeting')){const g=document.createElement('div');g.className='exact-personal-greeting';g.innerHTML='<div class="exact-greeting-icon">👋</div><div class="exact-greeting-copy"><b></b><span></span></div>';div.insertAdjacentElement('afterend',g)}if(search&&!shell.querySelector('.exact-daily-verse')){const v=document.createElement('div');v.className='exact-daily-verse';v.innerHTML='<div class="exact-verse-kicker"></div><p class="exact-verse-text"></p><div class="exact-verse-ref"></div>';search.insertAdjacentElement('afterend',v)}updateHomePersonal()}
function updateHomePersonal(){const name=profileName(),g=shell.querySelector('.exact-greeting-copy b'),sub=shell.querySelector('.exact-greeting-copy span'),k=shell.querySelector('.exact-verse-kicker'),v=dailyVerse();if(g)g.textContent=name?`${greetingText()}, ${name}`:greetingText();if(sub)sub.textContent=tx('Qué alegría tenerte en La Grey','Glad to have you in La Grey');if(k)k.textContent=tx('VERSÍCULO DEL DÍA','VERSE OF THE DAY');const t=shell.querySelector('.exact-verse-text'),r=shell.querySelector('.exact-verse-ref');if(t)t.textContent=`“${v.text}”`;if(r)r.textContent=v.ref;updateHomeActionLabels()}

function placeHomeResults(){const results=$('#results'),search=shell.querySelector('.exact-search-wrap');if(!results||!search)return;if(results.previousElementSibling!==search)search.insertAdjacentElement('afterend',results);results.classList.add('exact-search-results')}
function wireHomeSearch(){const q=$('#q');if(!q||q.dataset.lgExactHomeSearch==='1')return;q.dataset.lgExactHomeSearch='1';q.addEventListener('input',()=>{placeHomeResults();requestAnimationFrame(()=>{const search=shell.querySelector('.exact-search-wrap');if(!search)return;const top=search.getBoundingClientRect().top+window.scrollY-12;if(window.scrollY>top)window.scrollTo(0,Math.max(0,top))})})}

function syncNotation(){
 const label=$('.exact-notation-label');
 if(!label)return;
 const txt=(notation?.textContent||'C D E').replace(/[^A-Za-zÁÉÍÓÚáéíóú ]/g,' ').replace(/\s+/g,' ').trim();
 label.textContent=/Do|Re|Mi/i.test(txt)?'Do Re Mi':'C D E';
}

function finishStartup(){document.body.classList.add('lg-startup-finished')}
function updateScreen(){
 const visible=!home.classList.contains('hidden');
 if(!visible)finishStartup();
 document.body.classList.toggle('exact-home-screen',visible);
 syncNotation();
 if(visible){
  injectHomePersonal();
  placeHomeResults();
  wireHomeSearch();
 }
}

new MutationObserver(updateScreen).observe(home,{attributes:true,attributeFilter:['class']});
new MutationObserver(muts=>{if(muts.some(m=>m.attributeName==='lang'))updateHomePersonal()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
document.body.addEventListener('animationend',e=>{if(e.animationName==='lgStartupCollage')finishStartup()});
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

/* Favoritos: una sola tarjeta, con Cantos e Himnos separados dentro. */
function ensureFavoriteStyles(){if(document.getElementById('lgFavoriteGroupsStyle'))return;const style=document.createElement('style');style.id='lgFavoriteGroupsStyle';style.textContent='.lg-fav-group{display:grid;gap:10px;margin:0 0 20px}.lg-fav-group:last-child{margin-bottom:0}.lg-fav-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:2px 4px;color:#8ed8ff;font-weight:900;font-size:16px}.lg-fav-heading small{color:#f3c969;font-size:12px;font-weight:800}.lg-fav-empty{margin:0;padding:14px 16px;border:1px dashed rgba(142,216,255,.2);border-radius:16px;color:#9db0c5;background:rgba(7,31,49,.4);font-size:13px}.lg-fav-items{display:grid;gap:10px}';document.head.appendChild(style)}
function favoriteSongType(id){const item=(window.LAGREY_SONGS||[]).find(s=>String(s.id)===String(id));return item?.type||''}
function groupFavoriteList(){const listing=$('#listing'),title=$('#listTitle'),list=$('#songList');if(!listing||!title||!list||listing.classList.contains('hidden'))return;if(!/favorit/i.test(title.textContent||''))return;if(list.querySelector(':scope > .lg-fav-group'))return;const buttons=[...list.querySelectorAll(':scope > .song[data-song]')],cantos=[],himnos=[];buttons.forEach(btn=>(favoriteSongType(btn.dataset.song)==='himnos'?himnos:cantos).push(btn));if(!buttons.length&&!list.querySelector(':scope > .muted'))return;ensureFavoriteStyles();list.innerHTML='';const addGroup=(icon,label,items)=>{const group=document.createElement('section');group.className='lg-fav-group';const heading=document.createElement('div');heading.className='lg-fav-heading';heading.innerHTML=`<span>${icon} ${label}</span><small>${items.length}</small>`;group.appendChild(heading);if(items.length){const wrap=document.createElement('div');wrap.className='lg-fav-items';items.forEach(btn=>wrap.appendChild(btn));group.appendChild(wrap)}else{const empty=document.createElement('p');empty.className='lg-fav-empty';empty.textContent=tx('Aún no tienes favoritos aquí.','No favorites here yet.');group.appendChild(empty)}list.appendChild(group)};addGroup('🎵',tx('Cantos favoritos','Favorite songs'),cantos);addGroup('🎼',tx('Himnos favoritos','Favorite hymns'),himnos)}
const favoriteList=$('#songList');if(favoriteList){let favFrame=0;new MutationObserver(()=>{cancelAnimationFrame(favFrame);favFrame=requestAnimationFrame(groupFavoriteList)}).observe(favoriteList,{childList:true});groupFavoriteList()}
})();