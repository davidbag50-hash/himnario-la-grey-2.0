(()=>{
'use strict';

const PROFILE_KEY='lagrey_member_profile';
const PENDING_KEY='lagrey_pending_registration';
const tx=(es,en)=>(localStorage.getItem('lagrey_language')==='en'?en:es);
const $=id=>document.getElementById(id);

function readJSON(key,fallback=null){try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch{return fallback}}
function savedProfile(){return readJSON(PROFILE_KEY,null)}
function toast(message){const t=$('toast');if(!t)return;t.textContent=message;t.classList.remove('hidden');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.add('hidden'),3200)}
function friendly(error){
 const m=String(error?.message||error||'');
 if(/invalid login credentials/i.test(m))return tx('Correo o contraseña incorrectos.','Incorrect email or password.');
 if(/email not confirmed/i.test(m))return tx('Primero confirma tu correo desde el mensaje que te enviamos.','Confirm your email from the message we sent you first.');
 if(/invalid invite code/i.test(m))return tx('El código de invitación no es válido.','The invite code is invalid.');
 if(/invite expired/i.test(m))return tx('Ese código de invitación ya venció. Pide uno nuevo.','That invite code has expired. Ask for a new one.');
 if(/invite exhausted/i.test(m))return tx('Ese código ya fue utilizado. Pide uno nuevo.','That invite code has already been used. Ask for a new one.');
 if(/invite revoked/i.test(m))return tx('Ese código fue revocado. Pide uno nuevo.','That invite code was revoked. Ask for a new one.');
 if(/password/i.test(m)&&/least|short|characters/i.test(m))return tx('La contraseña debe tener al menos 6 caracteres.','Password must be at least 6 characters.');
 if(/failed to fetch|network/i.test(m))return tx('No pude conectar con La Grey Cloud. Revisa internet.','Could not connect to La Grey Cloud. Check your internet.');
 return m||tx('Ocurrió un error. Inténtalo nuevamente.','Something went wrong. Please try again.');
}

function ensureStyles(){
 if($('lgAccountOnboardingStyle'))return;
 const style=document.createElement('style');
 style.id='lgAccountOnboardingStyle';
 style.textContent=`
 .lg-cloud-form{display:grid;gap:12px;margin-top:12px}.lg-cloud-form label{display:grid;gap:6px;font-weight:750;color:#dceafa}.lg-cloud-form .field{width:100%;box-sizing:border-box}.lg-cloud-note{padding:11px 13px;border:1px solid rgba(103,192,255,.2);border-radius:13px;background:rgba(13,114,216,.08);color:#bcd1e3;font-size:13px;line-height:1.4}.lg-cloud-code{margin:14px 0;padding:16px;border:1px solid rgba(216,165,45,.35);border-radius:15px;background:rgba(216,165,45,.08);text-align:center;font:800 22px/1.3 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:1.2px;color:#f2c24e;word-break:break-all}.lg-cloud-actions{display:grid;gap:9px;margin-top:14px}.lg-cloud-status{min-height:20px;margin-top:9px;color:#ffcf7a;font-size:13px;line-height:1.4}.lg-cloud-status.ok{color:#75d8a0}.lg-cloud-select{width:100%;box-sizing:border-box}.lg-cloud-mini{font-size:12px;color:#8fa9bd;line-height:1.35}`;
 document.head.appendChild(style);
}

function makeModal(id){
 let modal=$(id);if(modal)return modal;
 modal=document.createElement('div');modal.id=id;modal.className='modal hidden';modal.style.zIndex='1000';
 document.body.appendChild(modal);return modal;
}
function hideModal(modal){modal?.classList.add('hidden')}
function showModal(modal){modal?.classList.remove('hidden')}
function closeProfile(){ $('profileModal')?.classList.add('hidden') }
function openProfile(){ $('profileBtn')?.click() }

function pending(){return readJSON(PENDING_KEY,null)}
function savePending(value){if(value)localStorage.setItem(PENDING_KEY,JSON.stringify(value));else localStorage.removeItem(PENDING_KEY)}

function buildRegisterModal(){
 ensureStyles();const modal=makeModal('lgRegisterModal');
 if(modal.dataset.ready==='1')return modal;modal.dataset.ready='1';
 modal.innerHTML=`<div class="modal-card profile-modal-card"><div class="modal-top"><div><h2>☁️ ${tx('Crear cuenta','Create account')}</h2><div class="chord-sub">${tx('Únete a tu ministerio con un código de invitación.','Join your ministry with an invite code.')}</div></div><button class="close" type="button" data-lg-register-close>×</button></div><div id="lgRegisterBody"></div></div>`;
 modal.querySelector('[data-lg-register-close]').onclick=()=>{hideModal(modal);openProfile()};
 return modal;
}

function registerForm(stage='form'){
 const modal=buildRegisterModal(),body=$('lgRegisterBody');if(!body)return;
 const p=pending();const confirming=stage==='confirm'||!!p;
 body.innerHTML=`
  <div class="lg-cloud-note">${confirming?tx('Si ya confirmaste tu correo, escribe tu contraseña y completa la unión al ministerio.','If you already confirmed your email, enter your password and complete joining the ministry.'):tx('Necesitas el código que te compartió el propietario o administrador de tu ministerio.','You need the code shared by your ministry owner or administrator.')}</div>
  <div class="lg-cloud-form">
   <label>${tx('Tu nombre','Your name')}<input id="lgRegName" class="field" autocomplete="name" placeholder="${tx('Nombre y apellido','Name')}" value="${String(p?.displayName||'').replace(/"/g,'&quot;')}" ${confirming?'readonly':''}></label>
   <label>${tx('Correo electrónico','Email address')}<input id="lgRegEmail" class="field" type="email" autocomplete="username" placeholder="tu@correo.com" value="${String(p?.email||'').replace(/"/g,'&quot;')}" ${confirming?'readonly':''}></label>
   <label>${tx('Contraseña','Password')}<input id="lgRegPassword" class="field" type="password" autocomplete="${confirming?'current-password':'new-password'}" placeholder="${tx('Mínimo 6 caracteres','At least 6 characters')}"></label>
   <label>${tx('Código de invitación','Invite code')}<input id="lgRegCode" class="field" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="${tx('Código que te enviaron','Code you received')}" value="${String(p?.code||'').replace(/"/g,'&quot;')}" ${confirming?'readonly':''}></label>
  </div>
  <div id="lgRegisterStatus" class="lg-cloud-status"></div>
  <div class="lg-cloud-actions"><button id="lgRegisterSubmit" class="btn primary wide" type="button">${confirming?tx('Ya confirmé · Unirme','I confirmed · Join'):tx('Crear cuenta y unirme','Create account and join')}</button>${confirming?`<button id="lgRegisterRestart" class="btn wide" type="button">${tx('Crear otra cuenta','Create another account')}</button>`:''}</div>
  <p class="lg-cloud-mini">${tx('La contraseña se gestiona con Supabase Auth. La Grey no la guarda en texto ni la comparte con el ministerio.','Your password is handled by Supabase Auth. La Grey does not store it as plain text or share it with the ministry.')}</p>`;
 $('lgRegisterSubmit').onclick=confirming?completeConfirmedRegistration:createRegistration;
 if($('lgRegisterRestart'))$('lgRegisterRestart').onclick=()=>{savePending(null);registerForm('form')};
 setTimeout(()=>$(confirming?'lgRegPassword':'lgRegName')?.focus(),30);
}
function setRegStatus(msg,ok=false){const e=$('lgRegisterStatus');if(!e)return;e.textContent=msg||'';e.classList.toggle('ok',!!ok)}
function registerValues(){return{displayName:String($('lgRegName')?.value||'').trim(),email:String($('lgRegEmail')?.value||'').trim(),password:String($('lgRegPassword')?.value||''),code:String($('lgRegCode')?.value||'').trim().toUpperCase()}}
async function finishJoin(code){
 await window.LAGREY_MINISTRIES.joinWithCode(code);
 await window.LAGREY_CLOUD.boot();
 savePending(null);
 setRegStatus(tx('¡Listo! Ya formas parte del ministerio.','Done! You are now part of the ministry.'),true);
 setTimeout(()=>location.reload(),650);
}
async function createRegistration(){
 const v=registerValues();
 if(!v.displayName||!v.email||!v.password||!v.code){setRegStatus(tx('Completa nombre, correo, contraseña y código.','Complete name, email, password and code.'));return}
 if(v.password.length<6){setRegStatus(tx('La contraseña debe tener al menos 6 caracteres.','Password must be at least 6 characters.'));return}
 const btn=$('lgRegisterSubmit');if(btn)btn.disabled=true;setRegStatus(tx('Creando tu cuenta…','Creating your account…'));
 try{
  const data=await window.LAGREY_AUTH.signUp({email:v.email,password:v.password,displayName:v.displayName});
  if(data?.session){await finishJoin(v.code);return}
  savePending({displayName:v.displayName,email:v.email,code:v.code});
  setRegStatus(tx('Cuenta creada. Revisa tu correo y confirma la cuenta. Después vuelve aquí y pulsa “Ya confirmé · Unirme”.','Account created. Check your email and confirm the account. Then return here and press “I confirmed · Join”.'),true);
  registerForm('confirm');
 }catch(error){setRegStatus(friendly(error))}finally{if(btn)btn.disabled=false}
}
async function completeConfirmedRegistration(){
 const v=registerValues();const p=pending();
 if(!p?.email||!p?.code||!v.password){setRegStatus(tx('Escribe tu contraseña para continuar.','Enter your password to continue.'));return}
 const btn=$('lgRegisterSubmit');if(btn)btn.disabled=true;setRegStatus(tx('Comprobando tu cuenta…','Checking your account…'));
 try{await window.LAGREY_AUTH.signIn({email:p.email,password:v.password});await finishJoin(p.code)}catch(error){setRegStatus(friendly(error))}finally{if(btn)btn.disabled=false}
}
function openRegistration(){closeProfile();const modal=buildRegisterModal();registerForm(pending()?'confirm':'form');showModal(modal)}

function buildInviteModal(){
 ensureStyles();const modal=makeModal('lgInviteModal');if(modal.dataset.ready==='1')return modal;modal.dataset.ready='1';
 modal.innerHTML=`<div class="modal-card profile-modal-card"><div class="modal-top"><div><h2>🔑 ${tx('Invitar miembro','Invite member')}</h2><div class="chord-sub">${tx('Genera un código seguro para tu ministerio.','Generate a secure code for your ministry.')}</div></div><button class="close" type="button" data-lg-invite-close>×</button></div><div class="lg-cloud-note">${tx('Cada código será válido por 7 días y podrá usarse una sola vez. Genera uno diferente para cada persona.','Each code is valid for 7 days and can be used once. Generate a different code for each person.')}</div><div class="lg-cloud-form"><label>${tx('Rol al entrar','Role when joining')}<select id="lgInviteRole" class="field lg-cloud-select"><option value="member">${tx('Miembro','Member')}</option><option value="leader">${tx('Líder','Leader')}</option><option value="admin">${tx('Administrador','Administrator')}</option></select></label></div><div id="lgInviteStatus" class="lg-cloud-status"></div><div id="lgInviteCodeWrap" class="hidden"><div id="lgInviteCode" class="lg-cloud-code"></div><div class="lg-cloud-actions"><button id="lgCopyInvite" class="btn primary wide" type="button">${tx('Copiar código','Copy code')}</button></div></div><div class="lg-cloud-actions"><button id="lgGenerateInvite" class="btn primary wide" type="button">${tx('Generar código','Generate code')}</button><button id="lgInviteBack" class="btn wide" type="button">${tx('Volver a mi perfil','Back to my profile')}</button></div></div>`;
 const close=()=>{hideModal(modal);openProfile()};modal.querySelector('[data-lg-invite-close]').onclick=close;$('lgInviteBack').onclick=close;$('lgGenerateInvite').onclick=generateInvite;$('lgCopyInvite').onclick=copyInvite;
 return modal;
}
function setInviteStatus(msg,ok=false){const e=$('lgInviteStatus');if(!e)return;e.textContent=msg||'';e.classList.toggle('ok',!!ok)}
async function generateInvite(){
 const state=window.LAGREY_CLOUD?.getState?.();const role=$('lgInviteRole')?.value||'member';const btn=$('lgGenerateInvite');
 if(state?.mode!=='ministry'||!state.ministry?.id){setInviteStatus(tx('No pude cargar tu ministerio activo.','Could not load your active ministry.'));return}
 if(!['owner','admin'].includes(state.role)){setInviteStatus(tx('Solo el propietario o un administrador puede crear invitaciones.','Only the owner or an administrator can create invites.'));return}
 if(btn)btn.disabled=true;setInviteStatus(tx('Generando código…','Generating code…'));
 try{const code=await window.LAGREY_MINISTRIES.createInvite({ministryId:state.ministry.id,role,validHours:168,allowedUses:1});$('lgInviteCode').textContent=String(code||'');$('lgInviteCodeWrap').classList.remove('hidden');setInviteStatus(tx('Código listo. Envíalo únicamente a la persona que vas a agregar.','Code ready. Send it only to the person you are adding.'),true)}catch(error){setInviteStatus(friendly(error))}finally{if(btn)btn.disabled=false}
}
async function copyInvite(){const code=String($('lgInviteCode')?.textContent||'').trim();if(!code)return;try{await navigator.clipboard.writeText(code);toast(tx('Código copiado.','Code copied.'))}catch{const area=document.createElement('textarea');area.value=code;document.body.appendChild(area);area.select();document.execCommand('copy');area.remove();toast(tx('Código copiado.','Code copied.'))}}
function openInvite(){closeProfile();const modal=buildInviteModal();$('lgInviteCodeWrap')?.classList.add('hidden');setInviteStatus('');showModal(modal)}

function syncProfileActions(){
 const modal=$('profileModal'),other=$('profileOtherGroupBtn'),primary=$('profileLoginBtn'),passLabel=$('profilePasswordLabel');if(!modal||!other||!primary)return;
 const open=!modal.classList.contains('hidden');const auth=open&&passLabel&&!passLabel.classList.contains('hidden')&&/iniciar sesión|sign in/i.test(primary.textContent||'');
 let register=$('profileRegisterBtn');
 if(auth){if(!register){register=document.createElement('button');register.id='profileRegisterBtn';register.type='button';register.className='btn wide';register.textContent=tx('Crear cuenta','Create account');register.onclick=openRegistration;other.insertAdjacentElement('beforebegin',register)}register.classList.remove('hidden')}else register?.classList.add('hidden');
 const p=savedProfile();const canInvite=open&&p?.cloud&&['owner','admin'].includes(p.cloudRole)&&/cerrar|close/i.test(primary.textContent||'');
 let invite=$('profileInviteBtn');
 if(canInvite){if(!invite){invite=document.createElement('button');invite.id='profileInviteBtn';invite.type='button';invite.className='btn primary wide';invite.textContent=tx('🔑 Invitar miembro','🔑 Invite member');invite.onclick=openInvite;other.insertAdjacentElement('beforebegin',invite)}invite.classList.remove('hidden')}else invite?.classList.add('hidden');
}

const profileModal=$('profileModal');if(profileModal){let scheduled=false;const schedule=()=>{if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;syncProfileActions()})};new MutationObserver(schedule).observe(profileModal,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class']});document.addEventListener('click',schedule,true);document.addEventListener('lagrey:profile-changed',schedule);setTimeout(schedule,100);setTimeout(schedule,700)}
})();
