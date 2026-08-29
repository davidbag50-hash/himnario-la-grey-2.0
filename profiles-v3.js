(()=>{
'use strict';
const members=window.LAGREY_MEMBERS||[];
const $=id=>document.getElementById(id);
const key='lagrey_member_profile';
const instrumentKey='lagrey_multi_instrument';
const lang=()=>localStorage.getItem('lagrey_language')==='en'?'en':'es';
const tx=(es,en)=>lang()==='en'?en:es;
const norm=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const byId=id=>members.find(m=>m.id===id)||null;
const findMember=name=>{const n=norm(name);return members.find(m=>m.aliases.some(a=>norm(a)===n))||null};

/* Simulación local del futuro paquete Ministerio. Cuando exista nube, esta fuente se sustituye por la membresía recibida del servidor. */
const demoMinistry={
 code:'GREY-DEMO-15',
 id:'demo-ministry',
 name:'Ministerio Demo',
 members:[
  {id:'demo-ana',name:'Ana',aliases:['ana'],roles:['Piano','Voz'],instrument:'piano',icon:'🎹🎤'},
  {id:'demo-marcos',name:'Marcos',aliases:['marcos'],roles:['Guitarra'],instrument:'guitar',icon:'🎸'},
  {id:'demo-lucia',name:'Lucía',aliases:['lucia','lucía'],roles:['Voz'],instrument:'voice',icon:'🎤'}
 ]
};

let profile=null;
let step='choose';
let activeMinistry=null;
try{
 const saved=JSON.parse(localStorage.getItem(key)||'null');
 if(saved?.id==='visitor')profile=saved;
 else if(saved?.ministryId)profile=saved;
 else profile=byId(saved?.id);
}catch{}

function preferredInstrument(){
 if(!profile||profile.id==='visitor')return null;
 if(profile.instrument==='piano'||profile.instrument==='guitar')return profile.instrument;
 if(profile.instrument==='all')return localStorage.getItem(instrumentKey)||'guitar';
 return null;
}
function roleLabel(role){
 const map={
  'Todos los instrumentos':['Todos los instrumentos','All instruments'],
  'Guitarra':['Guitarra','Guitar'],
  'Voz':['Voz','Voice'],
  'Piano':['Piano','Piano']
 };
 const pair=map[role];return pair?tx(pair[0],pair[1]):role;
}
function roleText(p){return !p||p.id==='visitor'?tx('Acceso público','Public access'):(p.roles||[]).map(roleLabel).join(' · ')}
function ministryName(p){
 if(!p)return'';
 if(p.ministryId==='la-grey')return tx('Grupo de Alabanza La Grey','La Grey Worship Team');
 if(p.ministryId==='demo-ministry'&&p.ministryName==='Ministerio Demo')return tx('Ministerio Demo','Demo Ministry');
 return p.ministryName||'';
}
function groupText(p){
 if(!p||p.id==='visitor')return tx('Sin agrupación','No group');
 return ministryName(p)||tx('Grupo de Alabanza La Grey','La Grey Worship Team');
}
function ministryDisplayName(m){
 if(!m)return tx('Ministerio','Ministry');
 if(m.id==='demo-ministry'&&m.name==='Ministerio Demo')return tx('Ministerio Demo','Demo Ministry');
 return m.name;
}
function updateUI(){
 const btn=$('profileBtn');if(!btn)return;
 if(!profile){btn.innerHTML=`👤 <span>${tx('Perfil','Profile')}</span>`;return}
 btn.innerHTML=profile.id==='visitor'?`👤 <span>${tx('Visitante','Visitor')}</span>`:`👤 <span>${profile.name}</span>`;
}
function setStatus(msg,ok=false){const e=$('profileStatus');if(!e)return;e.textContent=msg||'';e.classList.toggle('profile-ok',!!ok)}
function showToast(msg){const t=$('toast');if(!t)return;t.textContent=msg;t.classList.remove('hidden');clearTimeout(showToast.t);showToast.t=setTimeout(()=>t.classList.add('hidden'),2800)}
function closeProfileModal(){$('profileModal')?.classList.add('hidden')}
function modalParts(){
 const modal=$('profileModal'),card=modal?.querySelector('.profile-modal-card');
 if(!modal||!card)return null;
 return {
  modal,card,
  title:card.querySelector('.modal-top h2'),
  sub:card.querySelector('.modal-top .chord-sub'),
  hero:card.querySelector('.profile-hero'),
  label:$('profileName')?.closest('label'),
  input:$('profileName'),
  primary:$('profileLoginBtn'),
  visitor:$('profileVisitorBtn'),
  hint:card.querySelector('.hint')
 };
}
function ensureOtherButton(){
 const p=modalParts();if(!p)return null;
 let b=$('profileOtherGroupBtn');
 if(!b){
  b=document.createElement('button');
  b.id='profileOtherGroupBtn';b.type='button';b.className='btn wide';
  p.visitor?.insertAdjacentElement('beforebegin',b);
 }
 return b;
}
function renderStep(next='choose'){
 step=next;
 const p=modalParts(),other=ensureOtherButton();if(!p)return;
 const show=(el,on)=>{if(el)el.classList.toggle('hidden',!on)};
 setStatus('');
 p.input.value='';
 if(step==='choose'){
  p.title.textContent=tx('👋 Bienvenido a La Grey','👋 Welcome to La Grey');
  p.sub.textContent=tx('¿Cómo vas a usar la aplicación?','How will you use the app?');
  p.hero.innerHTML=tx('🎵 <b>Conecta tu perfil con tu grupo de alabanza</b>','🎵 <b>Connect your profile with your worship team</b>');
  show(p.label,false);show(p.primary,true);show(other,true);show(p.visitor,true);
  p.primary.textContent=tx('Soy parte del grupo La Grey','I am part of the La Grey team');
  other.textContent=tx('Pertenezco a otro grupo de alabanza','I belong to another worship team');
  p.visitor.textContent=tx('No tengo agrupación · Continuar como invitado','I do not have a group · Continue as guest');
  if(p.hint)p.hint.textContent=tx('Los perfiles de ministerio cargan automáticamente la configuración que haya definido el líder.','Ministry profiles automatically load the settings defined by the leader.');
  return;
 }
 if(step==='lagrey-name'){
  p.title.textContent=tx('🎵 Grupo de Alabanza La Grey','🎵 La Grey Worship Team');
  p.sub.textContent=tx('Dinos quién eres para cargar tu perfil.','Tell us who you are to load your profile.');
  p.hero.innerHTML=tx('Miembro de <b>La Grey</b>','Member of <b>La Grey</b>');
  show(p.label,true);show(p.primary,true);show(other,true);show(p.visitor,false);
  if(p.label)p.label.firstChild.textContent=tx('Tu nombre','Your name');
  p.input.placeholder=tx('Escribe tu nombre','Enter your name');p.input.autocomplete='name';
  p.primary.textContent=tx('Entrar con mi perfil','Continue with my profile');other.textContent=tx('← Elegir otra opción','← Choose another option');
  if(p.hint)p.hint.textContent=tx('Usaremos el instrumento y los roles que ya tiene configurados tu perfil.','We will use the instrument and roles already configured in your profile.');
  setTimeout(()=>p.input.focus(),40);return;
 }
 if(step==='external-code'){
  p.title.textContent=tx('☁️ Unirme a un ministerio','☁️ Join a ministry');
  p.sub.textContent=tx('Introduce el código que te compartió el líder del grupo.','Enter the code shared by your group leader.');
  p.hero.innerHTML=tx('🔑 <b>Código de ministerio</b>','🔑 <b>Ministry code</b>');
  show(p.label,true);show(p.primary,true);show(other,true);show(p.visitor,false);
  if(p.label)p.label.firstChild.textContent=tx('Código','Code');
  p.input.placeholder=tx('Escribe el código de tu ministerio','Enter your ministry code');p.input.autocomplete='off';
  p.primary.textContent=tx('Continuar','Continue');other.textContent=tx('← Elegir otra opción','← Choose another option');
  if(p.hint)p.hint.textContent=tx('El código identifica a tu grupo. Más adelante esta validación se hará directamente en la nube.','The code identifies your group. Later, this validation will be handled directly in the cloud.');
  setTimeout(()=>p.input.focus(),40);return;
 }
 if(step==='external-name'){
  const name=ministryDisplayName(activeMinistry);
  p.title.textContent=`☁️ ${name}`;
  p.sub.textContent=tx('El código es válido. Ahora dinos quién eres.','The code is valid. Now tell us who you are.');
  p.hero.innerHTML=lang()==='en'?`✅ Connected to <b>${name}</b>`:`✅ Conectado a <b>${name}</b>`;
  show(p.label,true);show(p.primary,true);show(other,true);show(p.visitor,false);
  if(p.label)p.label.firstChild.textContent=tx('Tu nombre','Your name');
  p.input.placeholder=tx('Escribe tu nombre','Enter your name');p.input.autocomplete='name';
  p.primary.textContent=tx('Entrar a mi ministerio','Join my ministry');other.textContent=tx('← Cambiar código','← Change code');
  if(p.hint)p.hint.textContent=tx('El nombre debe coincidir con el que tu líder registró en el ministerio.','The name must match the one your leader registered in the ministry.');
  setTimeout(()=>p.input.focus(),40);
 }
}
function openProfileModal(){
 const p=modalParts();if(!p)return;
 activeMinistry=null;renderStep('choose');
 if(profile&&profile.id!=='visitor')setStatus(`${profile.name} · ${groupText(profile)} · ${roleText(profile)}`,true);
 p.modal.classList.remove('hidden');
}
function saveProfile(p){
 profile=p;localStorage.setItem(key,JSON.stringify(p));closeProfileModal();updateUI();
 if(p.id!=='visitor'){
  const pref=preferredInstrument();
  const msg=pref==='piano'?tx('Piano será tu vista predeterminada de acordes.','Piano will be your default chord view.'):pref==='guitar'?tx('Guitarra será tu vista predeterminada de acordes.','Guitar will be your default chord view.'):tx('Tu perfil quedó listo.','Your profile is ready.');
  showToast(lang()==='en'?`Welcome, ${p.name}! ${msg}`:`¡Bienvenido, ${p.name}! ${msg}`);
 }else showToast(tx('Entraste como invitado.','You entered as a guest.'));
 document.dispatchEvent(new CustomEvent('lagrey:profile-changed',{detail:{profile:p}}));
}
function loginLaGrey(){
 const name=$('profileName')?.value||'',m=findMember(name);
 if(!m){setStatus(tx('No encontré ese nombre en La Grey. Revisa cómo lo escribiste.','I could not find that name in La Grey. Check the spelling.'));return}
 const p={...m,ministryId:'la-grey',ministryName:'Grupo de Alabanza La Grey'};
 setStatus(lang()==='en'?`Profile found: ${p.name} · ${roleText(p)}`:`Perfil encontrado: ${p.name} · ${roleText(p)}`,true);setTimeout(()=>saveProfile(p),180);
}
function validateMinistryCode(){
 const code=String($('profileName')?.value||'').trim().toUpperCase();
 if(code!==demoMinistry.code){setStatus(tx('Ese código no corresponde a un ministerio activo en esta prueba.','That code does not match an active ministry in this demo.'));return}
 activeMinistry=demoMinistry;setStatus(lang()==='en'?`Valid code · ${ministryDisplayName(demoMinistry)}`:`Código válido · ${ministryDisplayName(demoMinistry)}`,true);setTimeout(()=>renderStep('external-name'),220);
}
function loginExternal(){
 if(!activeMinistry)return renderStep('external-code');
 const n=norm($('profileName')?.value||'');
 const m=activeMinistry.members.find(x=>x.aliases.some(a=>norm(a)===n));
 if(!m){setStatus(tx('Ese nombre no está registrado por el líder de este ministerio.','That name is not registered by this ministry leader.'));return}
 const p={...m,ministryId:activeMinistry.id,ministryName:activeMinistry.name};
 setStatus(lang()==='en'?`Profile found: ${p.name} · ${roleText(p)}`:`Perfil encontrado: ${p.name} · ${roleText(p)}`,true);setTimeout(()=>saveProfile(p),180);
}
function primaryAction(){
 if(step==='choose')return renderStep('lagrey-name');
 if(step==='lagrey-name')return loginLaGrey();
 if(step==='external-code')return validateMinistryCode();
 if(step==='external-name')return loginExternal();
}
function otherAction(){
 if(step==='choose')return renderStep('external-code');
 if(step==='external-name')return renderStep('external-code');
 renderStep('choose');
}
function visitor(){saveProfile({id:'visitor',name:'Visitante',roles:[],instrument:'none',ministryId:null,ministryName:null})}
function applyPreferredInstrument(){
 const modal=$('chordModal');if(!modal||modal.classList.contains('hidden'))return;
 const pref=preferredInstrument();
 if(pref==='piano')$('pianoTab')?.click();else if(pref==='guitar')$('guitarTab')?.click();
}
function observeChordModal(){
 const modal=$('chordModal');if(!modal)return;
 new MutationObserver(muts=>{if(muts.some(x=>x.attributeName==='class')&&!modal.classList.contains('hidden'))requestAnimationFrame(applyPreferredInstrument)}).observe(modal,{attributes:true,attributeFilter:['class']});
 $('guitarTab')?.addEventListener('click',()=>{if(profile?.instrument==='all')localStorage.setItem(instrumentKey,'guitar')});
 $('pianoTab')?.addEventListener('click',()=>{if(profile?.instrument==='all')localStorage.setItem(instrumentKey,'piano')});
}
window.LAGREY_REFRESH_PROFILE_I18N=()=>updateUI();
function wire(){
 const other=ensureOtherButton();
 $('profileBtn')?.addEventListener('click',openProfileModal);
 $('profileLoginBtn')?.addEventListener('click',primaryAction);
 other?.addEventListener('click',otherAction);
 $('profileVisitorBtn')?.addEventListener('click',visitor);
 $('profileCloseBtn')?.addEventListener('click',()=>{if(profile)closeProfileModal();else visitor()});
 $('profileName')?.addEventListener('keydown',e=>{if(e.key==='Enter')primaryAction()});
 $('profileModal')?.addEventListener('click',e=>{if(e.target.id==='profileModal'&&profile)closeProfileModal()});
 observeChordModal();updateUI();if(!profile)openProfileModal();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();
