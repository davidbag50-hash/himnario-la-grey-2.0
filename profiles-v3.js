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
const findMember=name=>{const n=norm(name);return members.find(m=>(m.aliases||[]).some(a=>norm(a)===n))||null};
const MUSIC_OPTIONS={voice:{icon:'🎤',es:'Voz',en:'Voice'},guitar:{icon:'🎸',es:'Guitarra',en:'Guitar'},piano:{icon:'🎹',es:'Piano',en:'Piano'},bass:{icon:'🎸',es:'Bajo',en:'Bass'},drums:{icon:'🥁',es:'Batería',en:'Drums'}};
let profile=null,step='choose';
try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved?.id==='visitor'||saved?.ministryId)profile=saved;else profile=byId(saved?.id)}catch{}

function preferredInstrument(){if(!profile||profile.id==='visitor')return'guitar';if(profile.instrument==='piano'||profile.instrument==='guitar')return profile.instrument;if(profile.instrument==='all')return localStorage.getItem(instrumentKey)==='piano'?'piano':'guitar';return'guitar'}
function roleLabel(role){const map={'Todos los instrumentos':['Todos los instrumentos','All instruments'],'Guitarra':['Guitarra','Guitar'],'Voz':['Voz','Voice'],'Piano':['Piano','Piano'],'Bajo':['Bajo','Bass'],'Batería':['Batería','Drums'],'owner':['Propietario','Owner'],'admin':['Administrador','Admin'],'leader':['Líder','Leader'],'member':['Miembro','Member']};const pair=map[role];return pair?tx(pair[0],pair[1]):role}
function roleText(p){return !p||p.id==='visitor'?tx('Acceso público','Public access'):(p.roles||[]).map(roleLabel).join(' · ')}
function ministryName(p){if(!p)return'';return p.ministryName||''}
function groupText(p){if(!p||p.id==='visitor')return tx('Sin agrupación','No group');return ministryName(p)||tx('Grupo de Alabanza La Grey','La Grey Worship Team')}
function updateUI(){const btn=$('profileBtn');if(!btn)return;if(!profile){btn.innerHTML=`👤 <span>${tx('Perfil','Profile')}</span>`;return}btn.innerHTML=profile.id==='visitor'?`👤 <span>${tx('Visitante','Visitor')}</span>`:`👤 <span>${profile.name}</span>`}
function setStatus(msg,ok=false){const e=$('profileStatus');if(!e)return;e.textContent=msg||'';e.classList.toggle('profile-ok',!!ok)}
function showToast(msg){const t=$('toast');if(!t)return;t.textContent=msg;t.classList.remove('hidden');clearTimeout(showToast.t);showToast.t=setTimeout(()=>t.classList.add('hidden'),3200)}
function closeProfileModal(){$('profileModal')?.classList.add('hidden')}
function modalParts(){const modal=$('profileModal'),card=modal?.querySelector('.profile-modal-card');if(!modal||!card)return null;return{modal,card,title:card.querySelector('.modal-top h2'),sub:card.querySelector('.modal-top .chord-sub'),hero:card.querySelector('.profile-hero'),label:$('profileName')?.closest('label'),input:$('profileName'),primary:$('profileLoginBtn'),visitor:$('profileVisitorBtn'),hint:card.querySelector('.hint')}}
function ensureOtherButton(){const p=modalParts();if(!p)return null;let b=$('profileOtherGroupBtn');if(!b){b=document.createElement('button');b.id='profileOtherGroupBtn';b.type='button';b.className='btn wide';p.visitor?.insertAdjacentElement('beforebegin',b)}return b}
function ensurePasswordField(){const p=modalParts();if(!p)return null;let label=$('profilePasswordLabel');if(!label){label=document.createElement('label');label.id='profilePasswordLabel';label.append(document.createTextNode(tx('Contraseña','Password')));const input=document.createElement('input');input.id='profilePassword';input.className='field';input.type='password';input.autocomplete='current-password';input.placeholder=tx('Escribe tu contraseña','Enter your password');label.appendChild(input);p.label?.insertAdjacentElement('afterend',label)}return label}
function show(el,on){if(el)el.classList.toggle('hidden',!on)}
function setInput(labelText,placeholder,autocomplete='off',type='text'){const p=modalParts();if(!p)return;if(p.label)p.label.firstChild.textContent=labelText;p.input.placeholder=placeholder;p.input.autocomplete=autocomplete;p.input.type=type;p.input.value=''}
function setPasswordVisible(on){const label=ensurePasswordField();show(label,on);const input=$('profilePassword');if(input){input.value='';input.placeholder=tx('Escribe tu contraseña','Enter your password')}}
function protectCatalogSearch(){
 const q=$('q');if(!q)return;
 q.setAttribute('autocomplete','off');q.setAttribute('name','lagrey_catalog_search');q.setAttribute('inputmode','search');q.setAttribute('data-lpignore','true');q.setAttribute('data-1p-ignore','true');
 const email=String(profile?.email||'').trim().toLowerCase();
 if(email&&String(q.value||'').trim().toLowerCase()===email){q.value='';q.dispatchEvent(new Event('input',{bubbles:true}))}
}
function scrubCatalogSearch(){protectCatalogSearch();setTimeout(protectCatalogSearch,120);setTimeout(protectCatalogSearch,700)}

function renderStep(next='choose'){
 step=next;const p=modalParts(),other=ensureOtherButton(),musicBtn=$('profileMusicBtn');if(!p)return;setStatus('');setPasswordVisible(false);show(musicBtn,step==='account');if(musicBtn)musicBtn.textContent=tx('🎼 Editar mi perfil musical','🎼 Edit my music profile');
 if(step==='account'){
  p.title.textContent=tx('👤 Mi perfil','👤 My profile');p.sub.textContent=tx('Sesión activa.','Session active.');p.hero.innerHTML=`☁️ <b>${profile?.name||tx('Miembro','Member')}</b>`;show(p.label,false);show(p.primary,true);show(other,true);show(p.visitor,false);p.primary.textContent=tx('Cerrar','Close');other.textContent=tx('Cerrar sesión','Sign out');setStatus(`${profile?.name||''} · ${groupText(profile)} · ${roleLabel(profile?.cloudRole||'member')}`,true);if(p.hint)p.hint.textContent=profile?.email?`${profile.email} · ${tx('Sincronizado','Synced')}`:tx('Datos sincronizados con La Grey Cloud','Synced with La Grey Cloud');return;
 }
 if(step==='choose'){
  p.title.textContent=tx('👋 Bienvenido a La Grey','👋 Welcome to La Grey');p.sub.textContent=tx('Elige cómo entrar.','Choose how to enter.');p.hero.innerHTML=tx('🎵 <b>Tu ministerio, tu repertorio, tu ruta</b>','🎵 <b>Your ministry, repertoire, and path</b>');show(p.label,false);show(p.primary,true);show(other,true);show(p.visitor,true);p.primary.textContent=tx('Soy parte del grupo La Grey','I am part of the La Grey team');other.textContent=tx('Pertenezco a otro grupo de alabanza','I belong to another worship team');p.visitor.textContent=tx('No tengo agrupación · Continuar como invitado','I do not have a group · Continue as guest');if(p.hint)p.hint.textContent=tx('Inicia sesión para cargar tu ministerio.','Sign in to load your ministry.');return;
 }
 if(step==='lagrey-auth'||step==='external-auth'){
  const own=step==='lagrey-auth';p.title.textContent=own?tx('☁️ Entrar a La Grey','☁️ Sign in to La Grey'):tx('☁️ Entrar a mi ministerio','☁️ Sign in to my ministry');p.sub.textContent=tx('Cuenta de La Grey Cloud.','La Grey Cloud account.');p.hero.innerHTML=own?tx('🎵 <b>Grupo de Alabanza La Grey</b>','🎵 <b>La Grey Worship Team</b>'):tx('☁️ <b>Ministerio en La Grey Cloud</b>','☁️ <b>Ministry in La Grey Cloud</b>');show(p.label,true);show(p.primary,true);show(other,true);show(p.visitor,false);setInput(tx('Correo electrónico','Email address'),tx('tu@correo.com','you@email.com'),'username','email');p.input.setAttribute('name','lagrey_cloud_email');setPasswordVisible(true);p.primary.textContent=tx('Iniciar sesión','Sign in');other.textContent=tx('← Elegir otra opción','← Choose another option');if(p.hint)p.hint.textContent=tx('Inicio de sesión seguro.','Secure sign-in.');setTimeout(()=>p.input.focus(),40);return;
 }
 if(step==='external-code'){
  p.title.textContent=tx('🔑 Unirme a un ministerio','🔑 Join a ministry');p.sub.textContent=tx('Introduce el código del ministerio.','Enter the ministry code.');p.hero.innerHTML=tx('☁️ <b>Código de ministerio</b>','☁️ <b>Ministry code</b>');show(p.label,true);show(p.primary,true);show(other,true);show(p.visitor,false);setInput(tx('Código','Code'),tx('Escribe el código del ministerio','Enter the ministry code'),'off','text');p.input.setAttribute('name','lagrey_ministry_code');p.primary.textContent=tx('Unirme al ministerio','Join ministry');other.textContent=tx('← Elegir otra opción','← Choose another option');if(p.hint)p.hint.textContent=tx('Código de acceso del ministerio.','Ministry access code.');setTimeout(()=>p.input.focus(),40);
 }
}

function musicLabel(role){const item=MUSIC_OPTIONS[role];return item?`${item.icon} ${tx(item.es,item.en)}`:role}
function setMusicStatus(message,ok=false){const el=$('profileMusicStatus');if(!el)return;el.textContent=message||'';el.classList.toggle('profile-ok',!!ok)}
function renderMusicEditor(){
 const box=$('profileMusicChecks'),preferred=$('profileMusicPreferred'),title=$('profileMusicTitle'),subtitle=$('profileMusicSubtitle'),label=$('profileMusicPreferredLabel'),save=$('profileMusicSaveBtn');
 if(!box||!preferred)return;
 const roles=Array.isArray(profile?.musicRoles)?profile.musicRoles:[];
 box.innerHTML=Object.entries(MUSIC_OPTIONS).map(([role,item])=>`<label class="profile-music-check"><input type="checkbox" value="${role}" data-profile-music-role ${roles.includes(role)?'checked':''}> <span>${item.icon} ${tx(item.es,item.en)}</span></label>`).join('');
 const current=['voice','guitar','piano','bass','drums','none'].includes(profile?.instrument)?profile.instrument:'none';
 preferred.innerHTML=`<option value="none">${tx('Sin preferencia','No preference')}</option>`+Object.entries(MUSIC_OPTIONS).map(([role,item])=>`<option value="${role}">${item.icon} ${tx(item.es,item.en)}</option>`).join('');
 preferred.value=current;
 if(title)title.textContent=tx('🎼 Mi perfil musical','🎼 My music profile');
 if(subtitle)subtitle.textContent=tx('Marca tus funciones y una preferida.','Select your roles and one preferred role.');
 if(label)label.firstChild.textContent=tx('Instrumento / función preferida','Preferred instrument / role');
 if(save)save.textContent=tx('Guardar mi perfil musical','Save my music profile');
 setMusicStatus('');
}
async function openMusicEditor(){
 if(!profile?.cloud||!profile?.ministryId)return;
 try{
  await ensureCloud();
  const mine=await window.LAGREY_MINISTRIES?.getMyRosterProfile?.(profile.ministryId);
  if(mine){
   profile.musicRoles=Array.isArray(mine.music_roles)?mine.music_roles.filter(role=>MUSIC_OPTIONS[role]):[];
   profile.instrument=['voice','guitar','piano','bass','drums','none'].includes(mine.preferred_instrument)?mine.preferred_instrument:'none';
   profile.rosterId=mine.id||profile.rosterId;
   localStorage.setItem(key,JSON.stringify(profile));
  }
 }catch(error){console.warn('[La Grey profile] using cached music profile',error)}
 renderMusicEditor();
 $('profileMusicModal')?.classList.remove('hidden');
}
async function saveMusicEditor(){
 if(!profile?.cloud||!profile?.ministryId)return;
 const roles=[...document.querySelectorAll('[data-profile-music-role]:checked')].map(input=>input.value).filter(role=>MUSIC_OPTIONS[role]);
 let preferred=String($('profileMusicPreferred')?.value||'none');
 if(preferred!=='none'&&!roles.includes(preferred)){
  setMusicStatus(tx('La función preferida también debe estar marcada arriba.','Your preferred role must also be selected above.'));
  return;
 }
 const button=$('profileMusicSaveBtn');if(button)button.disabled=true;
 setMusicStatus(tx('Guardando…','Saving…'));
 try{
  await ensureCloud();
  if(!window.LAGREY_MINISTRIES?.updateMyRosterMusic)throw new Error(tx('La edición musical todavía no está activa en Cloud.','Music profile editing is not active in Cloud yet.'));
  const row=await window.LAGREY_MINISTRIES.updateMyRosterMusic(profile.ministryId,{musicRoles:roles,preferredInstrument:preferred});
  profile.musicRoles=Array.isArray(row?.music_roles)?row.music_roles:roles;
  profile.instrument=row?.preferred_instrument||preferred;
  profile.rosterId=row?.id||profile.rosterId;
  localStorage.setItem(key,JSON.stringify(profile));
  updateUI();setMusicStatus(tx('Perfil musical actualizado.','Music profile updated.'),true);
  document.dispatchEvent(new CustomEvent('lagrey:profile-changed',{detail:{profile}}));
  setTimeout(()=>{$('profileMusicModal')?.classList.add('hidden');renderStep('account')},450);
 }catch(error){setMusicStatus(error?.message||String(error))}
 finally{if(button)button.disabled=false}
}
function closeMusicEditor(){$('profileMusicModal')?.classList.add('hidden')}
async function ensureCloud(){
 if(window.LAGREY_AUTH&&window.LAGREY_CLOUD)return true;
 if(!document.querySelector('script[data-lagrey-cloud-loader]')){const s=document.createElement('script');s.src='cloud/loader.js?v=2';s.dataset.lagreyCloudLoader='1';document.head.appendChild(s)}
 const started=Date.now();while(Date.now()-started<12000){if(window.LAGREY_AUTH&&window.LAGREY_CLOUD&&window.LAGREY_SUPABASE)return true;await new Promise(r=>setTimeout(r,80))}
 throw new Error(tx('No se pudo iniciar La Grey Cloud. Revisa tu conexión.','La Grey Cloud could not start. Check your connection.'));
}
async function cloudProfileFromState(state){
 if(!state?.user||!state?.ministry)return null;
 let row=null,roster=null;
 try{row=await state.data?.getCurrentProfile?.()}catch{}
 try{roster=await window.LAGREY_MINISTRIES?.getMyRosterProfile?.(state.ministry.id)}catch{}
 const name=String(roster?.display_name||row?.display_name||state.user.email?.split('@')[0]||tx('Miembro','Member')).trim();
 const legacy=findMember(name),musicRoles=Array.isArray(roster?.music_roles)?roster.music_roles.filter(Boolean):[];
 const cloudRole=roster?.cloud_role||state.role||'member';
 const preferred=['guitar','piano','voice','bass','drums','all','none'].includes(roster?.preferred_instrument)?roster.preferred_instrument:(legacy?.instrument||'all');
 return{id:state.user.id,name,aliases:[name],roles:legacy?.roles?.length?legacy.roles:[cloudRole],musicRoles,instrument:preferred,icon:legacy?.icon||'☁️',rosterId:roster?.id||null,ministryId:state.ministry.id,ministryName:state.ministry.name,cloudRole,email:state.user.email||'',cloud:true};
}
async function refreshCloudProfile(expectedSlug=null){await ensureCloud();const state=await window.LAGREY_CLOUD.boot();if(state.mode!=='ministry'||!state.ministry)return{state,profile:null};if(expectedSlug&&state.ministry.slug!==expectedSlug)return{state,profile:null};return{state,profile:await cloudProfileFromState(state)}}
function friendlyAuthError(error){const m=String(error?.message||error||'');if(/invalid login credentials/i.test(m))return tx('Correo o contraseña incorrectos.','Incorrect email or password.');if(/email not confirmed/i.test(m))return tx('Tu correo todavía no está confirmado.','Your email is not confirmed yet.');if(/failed to fetch|network/i.test(m))return tx('No pude conectar con La Grey Cloud. Revisa internet.','Could not connect to La Grey Cloud. Check your internet.');return m||tx('No se pudo iniciar sesión.','Could not sign in.')}

function openProfileModal(){const p=modalParts();if(!p)return;renderStep(profile?.cloud?'account':'choose');if(profile&&!profile.cloud&&profile.id!=='visitor')setStatus(`${profile.name} · ${groupText(profile)} · ${roleText(profile)}`,true);p.modal.classList.remove('hidden')}
function saveProfile(p){profile=p;localStorage.setItem(key,JSON.stringify(p));closeProfileModal();updateUI();scrubCatalogSearch();if(p.id!=='visitor'){const actual=p.instrument||'none',msg=actual==='piano'?tx('Piano será tu recurso musical principal.','Piano will be your primary music resource.'):actual==='guitar'?tx('Guitarra será tu recurso musical principal.','Guitar will be your primary music resource.'):actual==='bass'?tx('Bajo será tu ruta principal de formación.','Bass will be your primary learning track.'):actual==='drums'?tx('Batería será tu ruta principal de formación.','Drums will be your primary learning track.'):actual==='voice'?tx('Voz será tu ruta principal de formación.','Voice will be your primary learning track.'):tx('La Grey adaptará los recursos a tus funciones musicales.','La Grey will adapt resources to your music roles.');showToast(lang()==='en'?`Welcome, ${p.name}! ${msg}`:`¡Bienvenido, ${p.name}! ${msg}`)}else showToast(tx('Entraste como invitado.','You entered as a guest.'));document.dispatchEvent(new CustomEvent('lagrey:profile-changed',{detail:{profile:p}}))}

async function cloudLogin(expectedSlug){
 const email=String($('profileName')?.value||'').trim(),password=String($('profilePassword')?.value||'');if(!email||!password){setStatus(tx('Escribe tu correo y contraseña.','Enter your email and password.'));return}
 const btn=$('profileLoginBtn');if(btn)btn.disabled=true;setStatus(tx('Conectando con La Grey Cloud…','Connecting to La Grey Cloud…'));
 try{await ensureCloud();await window.LAGREY_AUTH.signIn({email,password});const result=await refreshCloudProfile(expectedSlug||null);if(result.profile){setStatus(`${result.profile.name} · ${result.profile.ministryName} · ${roleLabel(result.profile.cloudRole)}`,true);setTimeout(()=>saveProfile(result.profile),220);return}if(expectedSlug){await window.LAGREY_AUTH.signOut();setStatus(tx('Esta cuenta no pertenece al grupo La Grey.','This account does not belong to the La Grey group.'));return}if(result.state?.mode==='authenticated-no-ministry'){setStatus(tx('Sesión iniciada. Ahora introduce el código de tu ministerio.','Signed in. Now enter your ministry code.'),true);setTimeout(()=>renderStep('external-code'),280);return}setStatus(tx('Tu cuenta no tiene un ministerio activo.','Your account has no active ministry.'))}catch(error){setStatus(friendlyAuthError(error))}finally{if(btn)btn.disabled=false}
}
async function joinExternal(){
 const code=String($('profileName')?.value||'').trim();if(!code){setStatus(tx('Escribe el código del ministerio.','Enter the ministry code.'));return}
 const btn=$('profileLoginBtn');if(btn)btn.disabled=true;setStatus(tx('Validando código…','Validating code…'));
 try{await ensureCloud();await window.LAGREY_MINISTRIES.joinWithCode(code);const result=await refreshCloudProfile(null);if(!result.profile)throw new Error(tx('El código se aceptó, pero no pude cargar el ministerio.','The code was accepted, but the ministry could not be loaded.'));setStatus(`${result.profile.name} · ${result.profile.ministryName}`,true);setTimeout(()=>saveProfile(result.profile),220)}catch(error){setStatus(friendlyAuthError(error))}finally{if(btn)btn.disabled=false}
}
async function signOutCloud(){try{await ensureCloud();await window.LAGREY_AUTH.signOut()}catch{}localStorage.removeItem(key);profile=null;updateUI();scrubCatalogSearch();renderStep('choose');showToast(tx('Sesión cerrada.','Signed out.'))}
function primaryAction(){if(step==='account')return closeProfileModal();if(step==='choose')return renderStep('lagrey-auth');if(step==='lagrey-auth')return cloudLogin('la-grey');if(step==='external-auth')return cloudLogin(null);if(step==='external-code')return joinExternal()}
function otherAction(){if(step==='account')return signOutCloud();renderStep('choose')}
async function visitor(){try{if(window.LAGREY_AUTH){const session=await window.LAGREY_AUTH.getSession();if(session)await window.LAGREY_AUTH.signOut()}}catch{}saveProfile({id:'visitor',name:'Visitante',roles:[],instrument:'none',ministryId:null,ministryName:null})}
function rememberMultiInstrument(k){if(profile?.instrument==='all'&&(k==='guitar'||k==='piano'))localStorage.setItem(instrumentKey,k)}
window.LAGREY_GET_PREFERRED_CHORD_INSTRUMENT=()=>preferredInstrument();window.LAGREY_REFRESH_PROFILE_I18N=()=>{updateUI();if(!$('profileModal')?.classList.contains('hidden'))renderStep(profile?.cloud?'account':step);if(!$('profileMusicModal')?.classList.contains('hidden'))renderMusicEditor()};

async function restoreCloudSession(){
 try{await ensureCloud();const session=await window.LAGREY_AUTH.getSession();if(!session){scrubCatalogSearch();return}const result=await refreshCloudProfile(null);if(result.profile){profile=result.profile;localStorage.setItem(key,JSON.stringify(profile));updateUI();closeProfileModal();scrubCatalogSearch();document.dispatchEvent(new CustomEvent('lagrey:profile-changed',{detail:{profile}}))}}catch(error){console.warn('[La Grey profile] cloud restore skipped',error);scrubCatalogSearch()}
}
function wire(){const other=ensureOtherButton();ensurePasswordField();protectCatalogSearch();$('profileBtn')?.addEventListener('click',openProfileModal);$('profileLoginBtn')?.addEventListener('click',primaryAction);$('profileMusicBtn')?.addEventListener('click',openMusicEditor);$('profileMusicSaveBtn')?.addEventListener('click',saveMusicEditor);$('profileMusicCloseBtn')?.addEventListener('click',closeMusicEditor);$('profileMusicModal')?.addEventListener('click',e=>{if(e.target.id==='profileMusicModal')closeMusicEditor()});other?.addEventListener('click',()=>{if(step==='choose')renderStep('external-auth');else otherAction()});$('profileVisitorBtn')?.addEventListener('click',visitor);$('profileCloseBtn')?.addEventListener('click',()=>{if(profile)closeProfileModal();else visitor()});$('profileName')?.addEventListener('keydown',e=>{if(e.key==='Enter')primaryAction()});$('profilePassword')?.addEventListener('keydown',e=>{if(e.key==='Enter')primaryAction()});$('profileModal')?.addEventListener('click',e=>{if(e.target.id==='profileModal'&&profile)closeProfileModal()});$('guitarTab')?.addEventListener('click',()=>rememberMultiInstrument('guitar'));$('pianoTab')?.addEventListener('click',()=>rememberMultiInstrument('piano'));updateUI();if(!profile)openProfileModal();restoreCloudSession()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();
