(()=>{
'use strict';
const members=window.LAGREY_MEMBERS||[];
const $=id=>document.getElementById(id);
const key='lagrey_member_profile';
const instrumentKey='lagrey_multi_instrument';
const norm=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const byId=id=>members.find(m=>m.id===id)||null;
const findMember=name=>{
 const n=norm(name);
 return members.find(m=>m.aliases.some(a=>norm(a)===n))||null;
};
let profile=null;
try{
 const saved=JSON.parse(localStorage.getItem(key)||'null');
 profile=saved?.id==='visitor'?saved:byId(saved?.id);
}catch{}
function greeting(){
 const h=new Date().getHours();
 return h<12?'Buenos días':h<18?'Buenas tardes':'Buenas noches';
}
function preferredInstrument(){
 if(!profile||profile.id==='visitor')return null;
 if(profile.instrument==='piano')return'piano';
 if(profile.instrument==='guitar')return'guitar';
 if(profile.instrument==='all')return localStorage.getItem(instrumentKey)||'guitar';
 return null;
}
function roleText(p){
 if(!p||p.id==='visitor')return'Acceso público';
 return p.roles.join(' · ');
}
function updateUI(){
 const box=$('profileWelcome'),btn=$('profileBtn');
 if(!box||!btn)return;
 if(!profile){
   box.classList.add('hidden');
   btn.innerHTML='👤 <span>Perfil</span>';
   return;
 }
 if(profile.id==='visitor'){
   box.innerHTML='<div><b>👋 Bienvenido a La Grey</b><div class="muted">Estás usando la aplicación como visitante.</div></div><button class="btn profile-change-inline" type="button">Cambiar perfil</button>';
   btn.innerHTML='👤 <span>Visitante</span>';
 }else{
   const pref=preferredInstrument();
   const prefText=pref==='piano'?' · Acordes: 🎹 Piano':pref==='guitar'?' · Acordes: 🎸 Guitarra':'';
   box.innerHTML=`<div><b>${profile.icon||'👋'} ${greeting()}, ${profile.name}</b><div class="muted">${roleText(profile)}${prefText}</div></div><button class="btn profile-change-inline" type="button">Cambiar perfil</button>`;
   btn.innerHTML=`👤 <span>${profile.name}</span>`;
 }
 box.classList.remove('hidden');
 box.querySelector('.profile-change-inline')?.addEventListener('click',openProfileModal);
}
function setStatus(msg,ok=false){
 const e=$('profileStatus'); if(!e)return;
 e.textContent=msg||'';
 e.classList.toggle('profile-ok',!!ok);
}
function saveProfile(p){
 profile=p;
 localStorage.setItem(key,JSON.stringify(p));
 closeProfileModal();
 updateUI();
 if(p.id!=='visitor'){
   const pref=preferredInstrument();
   const msg=pref==='piano'?'Piano será tu vista predeterminada de acordes.':pref==='guitar'?'Guitarra será tu vista predeterminada de acordes.':'Tu perfil quedó listo.';
   showToast(`¡Bienvenido, ${p.name}! ${msg}`);
 }else showToast('Entraste como visitante.');
}
function loginByName(){
 const name=$('profileName')?.value||'';
 const m=findMember(name);
 if(!m){
   setStatus('No encontré ese nombre en el grupo. Revisa cómo lo escribiste o entra como visitante.');
   return;
 }
 setStatus(`Perfil encontrado: ${m.name} · ${roleText(m)}`,true);
 setTimeout(()=>saveProfile(m),180);
}
function visitor(){saveProfile({id:'visitor',name:'Visitante',roles:[],instrument:'none'})}
function openProfileModal(){
 const m=$('profileModal'); if(!m)return;
 $('profileName').value=profile&&profile.id!=='visitor'?profile.name:'';
 setStatus(profile&&profile.id!=='visitor'?`${profile.name} · ${roleText(profile)}`:'');
 m.classList.remove('hidden');
 setTimeout(()=>$('profileName')?.focus(),80);
}
function closeProfileModal(){$('profileModal')?.classList.add('hidden')}
function showToast(msg){
 const t=$('toast'); if(!t)return;
 t.textContent=msg;t.classList.remove('hidden');
 clearTimeout(showToast.t);showToast.t=setTimeout(()=>t.classList.add('hidden'),2600);
}
function applyPreferredInstrument(){
 const modal=$('chordModal');
 if(!modal||modal.classList.contains('hidden'))return;
 const pref=preferredInstrument();
 if(pref==='piano')$('pianoTab')?.click();
 else if(pref==='guitar')$('guitarTab')?.click();
}
function observeChordModal(){
 const modal=$('chordModal'); if(!modal)return;
 new MutationObserver(muts=>{
   if(muts.some(x=>x.attributeName==='class')&&!modal.classList.contains('hidden'))requestAnimationFrame(applyPreferredInstrument);
 }).observe(modal,{attributes:true,attributeFilter:['class']});
 $('guitarTab')?.addEventListener('click',()=>{if(profile?.instrument==='all')localStorage.setItem(instrumentKey,'guitar')});
 $('pianoTab')?.addEventListener('click',()=>{if(profile?.instrument==='all')localStorage.setItem(instrumentKey,'piano')});
}
function wire(){
 $('profileBtn')?.addEventListener('click',openProfileModal);
 $('profileLoginBtn')?.addEventListener('click',loginByName);
 $('profileVisitorBtn')?.addEventListener('click',visitor);
 $('profileCloseBtn')?.addEventListener('click',()=>{if(profile)closeProfileModal();else visitor()});
 $('profileName')?.addEventListener('keydown',e=>{if(e.key==='Enter')loginByName()});
 $('profileModal')?.addEventListener('click',e=>{if(e.target.id==='profileModal'&&profile)closeProfileModal()});
 observeChordModal();updateUI();if(!profile)openProfileModal();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();
(()=>{const s=document.createElement('script');s.src='stage-ui.js';s.defer=true;document.head.appendChild(s)})();
(()=>{const s=document.createElement('script');s.src='song-reader.js';s.defer=true;document.head.appendChild(s)})();

/* Versículo diario integrado: sin carga encadenada */
(()=>{
'use strict';
const verses=[
 {ref:'Salmo 23:1',text:'Jehová es mi pastor; nada me faltará.'},
 {ref:'Filipenses 4:13',text:'Todo lo puedo en Cristo que me fortalece.'},
 {ref:'Proverbios 3:5',text:'Fíate de Jehová de todo tu corazón, y no estribes en tu prudencia.'},
 {ref:'Salmo 46:1',text:'Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.'},
 {ref:'Mateo 11:28',text:'Venid a mí todos los que estáis trabajados y cargados, que yo os haré descansar.'},
 {ref:'Salmo 119:105',text:'Lámpara es a mis pies tu palabra, y lumbrera a mi camino.'},
 {ref:'Josué 1:9',text:'Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios será contigo en donde quiera que fueres.'},
 {ref:'Isaías 41:10',text:'No temas, que yo soy contigo; no desmayes, que yo soy tu Dios que te esfuerzo: siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.'},
 {ref:'Salmo 37:5',text:'Encomienda a Jehová tu camino, y espera en él; y él hará.'},
 {ref:'Juan 14:6',text:'Yo soy el camino, y la verdad, y la vida: nadie viene al Padre, sino por mí.'},
 {ref:'Romanos 12:12',text:'Gozosos en la esperanza; sufridos en la tribulación; constantes en la oración.'},
 {ref:'1 Corintios 16:14',text:'Todas vuestras cosas sean hechas con caridad.'},
 {ref:'Salmo 34:8',text:'Gustad, y ved que es bueno Jehová: dichoso el hombre que confiará en él.'},
 {ref:'Hebreos 13:8',text:'Jesucristo es el mismo ayer, y hoy, y por los siglos.'}
];
const $=id=>document.getElementById(id);let current=0;
function dayIndex(){const d=new Date(),start=new Date(d.getFullYear(),0,0),day=Math.floor((d-start)/86400000);return Math.abs(d.getFullYear()*367+day)%verses.length}
function dateText(){return new Intl.DateTimeFormat('es-PA',{weekday:'long',day:'numeric',month:'long'}).format(new Date())}
function inject(){
 const grid=document.querySelector('#home .home-grid');
 if(grid&&!document.querySelector('[data-open="verse"]')){
   const b=document.createElement('button');b.className='card verse-home-card';b.dataset.open='verse';
   b.innerHTML='<div class="icon">📖</div><h2>Versículo del día</h2><div class="muted">Una palabra para hoy</div><div id="dailyVerseHome" class="count"></div>';
   grid.appendChild(b);
 }
 const main=document.querySelector('main');
 if(main&&!$('verseView')){
   const s=document.createElement('section');s.id='verseView';s.className='view hidden';
   s.innerHTML='<button class="back" id="verseBack">← Volver</button><div class="verse-shell"><div class="verse-kicker">VERSÍCULO DEL DÍA</div><div id="verseDate" class="verse-date"></div><blockquote id="verseText" class="verse-text"></blockquote><div id="verseRef" class="verse-ref"></div><div class="verse-actions"><button id="verseShare" class="btn primary" type="button">↗ Compartir</button><button id="verseAnother" class="btn" type="button">Otro versículo</button><button id="verseToday" class="btn" type="button">Hoy</button></div><div class="verse-mini">El versículo diario cambia automáticamente cada día y queda disponible aun sin conexión.</div></div>';
   main.appendChild(s);
 }
}
function render(i){current=(i+verses.length)%verses.length;const v=verses[current];if($('verseText'))$('verseText').textContent='“'+v.text+'”';if($('verseRef'))$('verseRef').textContent=v.ref;if($('verseDate'))$('verseDate').textContent=dateText();if($('dailyVerseHome'))$('dailyVerseHome').textContent=v.ref}
function show(){document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));$('verseView')?.classList.remove('hidden');document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));window.scrollTo(0,0);render(dayIndex())}
function back(){document.querySelector('nav button[data-nav="home"]')?.click()}
async function share(){const v=verses[current],text=`${v.text}\n— ${v.ref}\n\nHimnario-Cancionero La Grey`;try{if(navigator.share)await navigator.share({title:'Versículo del día',text});else if(navigator.clipboard){await navigator.clipboard.writeText(text)}}catch(e){}}
function wireVerse(){inject();render(dayIndex());document.querySelector('[data-open="verse"]')?.addEventListener('click',show);$('verseBack')?.addEventListener('click',back);$('verseToday')?.addEventListener('click',()=>render(dayIndex()));$('verseAnother')?.addEventListener('click',()=>{let n=current;while(verses.length>1&&n===current)n=Math.floor(Math.random()*verses.length);render(n)});$('verseShare')?.addEventListener('click',share)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wireVerse);else wireVerse();
})();
