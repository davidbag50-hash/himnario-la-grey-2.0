(()=>{
'use strict';
const members=window.LAGREY_MEMBERS||[];
const $=id=>document.getElementById(id);
const key='lagrey_member_profile';
const instrumentKey='lagrey_multi_instrument';
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
function roleText(p){return !p||p.id==='visitor'?'Acceso público':(p.roles||[]).join(' · ')}
function groupText(p){
 if(!p||p.id==='visitor')return 'Sin agrupación';
 return p.ministryName||'Grupo de Alabanza La Grey';
}
function updateUI(){
 const btn=$('profileBtn');if(!btn)return;
 if(!profile){btn.innerHTML='👤 <span>Perfil</span>';return}
 btn.innerHTML=profile.id==='visitor'?'👤 <span>Visitante</span>':`👤 <span>${profile.name}</span>`;
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
  p.title.textContent='👋 Bienvenido a La Grey';
  p.sub.textContent='¿Cómo vas a usar la aplicación?';
  p.hero.innerHTML='🎵 <b>Conecta tu perfil con tu grupo de alabanza</b>';
  show(p.label,false);show(p.primary,true);show(other,true);show(p.visitor,true);
  p.primary.textContent='Soy parte del grupo La Grey';
  other.textContent='Pertenezco a otro grupo de alabanza';
  p.visitor.textContent='No tengo agrupación · Continuar como invitado';
  if(p.hint)p.hint.textContent='Los perfiles de ministerio cargan automáticamente la configuración que haya definido el líder.';
  return;
 }
 if(step==='lagrey-name'){
  p.title.textContent='🎵 Grupo de Alabanza La Grey';
  p.sub.textContent='Dinos quién eres para cargar tu perfil.';
  p.hero.innerHTML='Miembro de <b>La Grey</b>';
  show(p.label,true);show(p.primary,true);show(other,true);show(p.visitor,false);
  if(p.label)p.label.firstChild.textContent='Tu nombre';
  p.input.placeholder='Ej. Nicole, Carol, David...';p.input.autocomplete='name';
  p.primary.textContent='Entrar con mi perfil';other.textContent='← Elegir otra opción';
  if(p.hint)p.hint.textContent='Usaremos el instrumento y los roles que ya tiene configurados tu perfil.';
  setTimeout(()=>p.input.focus(),40);return;
 }
 if(step==='external-code'){
  p.title.textContent='☁️ Unirme a un ministerio';
  p.sub.textContent='Introduce el código que te compartió el líder del grupo.';
  p.hero.innerHTML='🔑 <b>Código de ministerio</b>';
  show(p.label,true);show(p.primary,true);show(other,true);show(p.visitor,false);
  if(p.label)p.label.firstChild.textContent='Código';
  p.input.placeholder='Ej. GREY-DEMO-15';p.input.autocomplete='off';
  p.primary.textContent='Continuar';other.textContent='← Elegir otra opción';
  if(p.hint)p.hint.textContent='Prueba local: usa GREY-DEMO-15. Más adelante este código se validará en la nube.';
  setTimeout(()=>p.input.focus(),40);return;
 }
 if(step==='external-name'){
  p.title.textContent=`☁️ ${activeMinistry?.name||'Ministerio'}`;
  p.sub.textContent='El código es válido. Ahora dinos quién eres.';
  p.hero.innerHTML=`✅ Conectado a <b>${activeMinistry?.name||'tu ministerio'}</b>`;
  show(p.label,true);show(p.primary,true);show(other,true);show(p.visitor,false);
  if(p.label)p.label.firstChild.textContent='Tu nombre';
  p.input.placeholder='Nombre registrado por tu líder';p.input.autocomplete='name';
  p.primary.textContent='Entrar a mi ministerio';other.textContent='← Cambiar código';
  if(p.hint)p.hint.textContent='Prueba demo: Ana, Marcos o Lucía tienen perfiles preconfigurados.';
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
  const msg=pref==='piano'?'Piano será tu vista predeterminada de acordes.':pref==='guitar'?'Guitarra será tu vista predeterminada de acordes.':'Tu perfil quedó listo.';
  showToast(`¡Bienvenido, ${p.name}! ${msg}`);
 }else showToast('Entraste como invitado.');
 document.dispatchEvent(new CustomEvent('lagrey:profile-changed',{detail:{profile:p}}));
}
function loginLaGrey(){
 const name=$('profileName')?.value||'',m=findMember(name);
 if(!m){setStatus('No encontré ese nombre en La Grey. Revisa cómo lo escribiste.');return}
 const p={...m,ministryId:'la-grey',ministryName:'Grupo de Alabanza La Grey'};
 setStatus(`Perfil encontrado: ${p.name} · ${roleText(p)}`,true);setTimeout(()=>saveProfile(p),180);
}
function validateMinistryCode(){
 const code=String($('profileName')?.value||'').trim().toUpperCase();
 if(code!==demoMinistry.code){setStatus('Ese código no corresponde a un ministerio activo en esta prueba.');return}
 activeMinistry=demoMinistry;setStatus(`Código válido · ${demoMinistry.name}`,true);setTimeout(()=>renderStep('external-name'),220);
}
function loginExternal(){
 if(!activeMinistry)return renderStep('external-code');
 const n=norm($('profileName')?.value||'');
 const m=activeMinistry.members.find(x=>x.aliases.some(a=>norm(a)===n));
 if(!m){setStatus('Ese nombre no está registrado por el líder de este ministerio.');return}
 const p={...m,ministryId:activeMinistry.id,ministryName:activeMinistry.name};
 setStatus(`Perfil encontrado: ${p.name} · ${roleText(p)}`,true);setTimeout(()=>saveProfile(p),180);
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
