(()=>{
'use strict';

/*
 * La Grey — flujo seguro para cuentas nuevas.
 *
 * Se carga DESPUÉS de account-onboarding-v2.js y corrige únicamente el flujo
 * de registro: crear un ministerio no requiere código; unirse a uno sí.
 * No usa MutationObserver y no reemplaza el login existente.
 */
const PENDING_KEY='lagrey_pending_registration';
const $=id=>document.getElementById(id);
const tx=(es,en)=>localStorage.getItem('lagrey_language')==='en'?en:es;
const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

function readPending(){try{return JSON.parse(localStorage.getItem(PENDING_KEY)||'null')}catch{return null}}
function savePending(v){if(v)localStorage.setItem(PENDING_KEY,JSON.stringify(v));else localStorage.removeItem(PENDING_KEY)}
function closeProfile(){$('profileModal')?.classList.add('hidden')}
function openProfile(){$('profileBtn')?.click()}
function destroy(reopen=true){$('lgAccountPathModal')?.remove();if(reopen)setTimeout(openProfile,0)}
function friendly(error){
 const m=String(error?.message||error||'');
 if(/invalid login credentials/i.test(m))return tx('Correo o contraseña incorrectos.','Incorrect email or password.');
 if(/email not confirmed/i.test(m))return tx('Primero confirma tu correo desde el mensaje que te enviamos.','Confirm your email from the message we sent you first.');
 if(/invalid invite code/i.test(m))return tx('El código de invitación no es válido.','The invite code is invalid.');
 if(/invite expired/i.test(m))return tx('Ese código de invitación ya venció. Pide uno nuevo.','That invite code has expired. Ask for a new one.');
 if(/invite exhausted/i.test(m))return tx('Ese código ya fue utilizado. Pide uno nuevo.','That invite code has already been used. Ask for a new one.');
 if(/invite revoked/i.test(m))return tx('Ese código fue revocado. Pide uno nuevo.','That invite code was revoked. Ask for a new one.');
 if(/duplicate key|ministries_slug_key|already exists/i.test(m))return tx('Ese identificador de ministerio ya existe. Inténtalo nuevamente.','That ministry identifier already exists. Please try again.');
 if(/password/i.test(m)&&/least|short|characters/i.test(m))return tx('La contraseña debe tener al menos 6 caracteres.','Password must be at least 6 characters.');
 if(/failed to fetch|network/i.test(m))return tx('No pude conectar con La Grey Cloud. Revisa internet.','Could not connect to La Grey Cloud. Check your internet.');
 return m||tx('Ocurrió un error. Inténtalo nuevamente.','Something went wrong. Please try again.');
}
function ensureStyles(){
 if($('lgAccountPathStyle'))return;
 const s=document.createElement('style');s.id='lgAccountPathStyle';s.textContent=`
 .lg-path-grid{display:grid;gap:10px;margin:16px 0}.lg-path-card{display:grid;gap:4px;width:100%;text-align:left;padding:14px 15px;border:1px solid rgba(103,192,255,.2);border-radius:14px;background:rgba(13,114,216,.08);color:#e7f2fb;cursor:pointer}.lg-path-card strong{font-size:15px}.lg-path-card span{font-size:12px;color:#9fb8cb;line-height:1.35}.lg-path-form{display:grid;gap:12px;margin-top:12px}.lg-path-form label{display:grid;gap:6px;font-weight:750;color:#dceafa}.lg-path-form .field{width:100%;box-sizing:border-box}.lg-path-note{padding:11px 13px;border:1px solid rgba(103,192,255,.2);border-radius:13px;background:rgba(13,114,216,.08);color:#bcd1e3;font-size:13px;line-height:1.4}.lg-path-actions{display:grid;gap:9px;margin-top:14px}.lg-path-status{min-height:20px;margin-top:9px;color:#ffcf7a;font-size:13px;line-height:1.4}.lg-path-status.ok{color:#75d8a0}.lg-path-mini{font-size:12px;color:#8fa9bd;line-height:1.35}`;document.head.appendChild(s);
}
function shell(title,sub){
 ensureStyles();$('lgAccountPathModal')?.remove();
 const modal=document.createElement('div');modal.id='lgAccountPathModal';modal.className='modal';modal.style.zIndex='1100';
 modal.innerHTML=`<div class="modal-card profile-modal-card"><div class="modal-top"><div><h2>${title}</h2><div class="chord-sub">${sub}</div></div><button class="close" type="button" data-lg-path-close>×</button></div><div data-lg-path-body></div></div>`;
 document.body.appendChild(modal);modal.querySelector('[data-lg-path-close]').onclick=()=>destroy(true);return modal;
}
function setStatus(msg,ok=false){const e=$('lgPathStatus');if(!e)return;e.textContent=msg||'';e.classList.toggle('ok',!!ok)}
function commonValues(){return{displayName:String($('lgPathName')?.value||'').trim(),email:String($('lgPathEmail')?.value||'').trim(),password:String($('lgPathPassword')?.value||'')}}

function showChoice(){
 closeProfile();savePending(null);
 const modal=shell(`☁️ ${tx('Crear cuenta','Create account')}`,tx('Elige cómo quieres comenzar en La Grey.','Choose how you want to start in La Grey.'));
 modal.querySelector('[data-lg-path-body]').innerHTML=`<div class="lg-path-grid"><button id="lgPathCreate" class="lg-path-card" type="button"><strong>🎵 ${tx('Crear mi ministerio','Create my ministry')}</strong><span>${tx('Crea una cuenta y conviértete automáticamente en propietario del nuevo ministerio. No necesitas código.','Create an account and automatically become owner of the new ministry. No code needed.')}</span></button><button id="lgPathJoin" class="lg-path-card" type="button"><strong>👥 ${tx('Unirme a un ministerio','Join a ministry')}</strong><span>${tx('Usa el código que te compartió el propietario o un administrador.','Use the code shared by the owner or an administrator.')}</span></button></div><div class="lg-path-actions"><button id="lgPathBackProfile" class="btn wide" type="button">${tx('Volver','Back')}</button></div>`;
 $('lgPathCreate').onclick=()=>renderCreate('form');$('lgPathJoin').onclick=()=>renderJoin('form');$('lgPathBackProfile').onclick=()=>destroy(true);
}

function renderJoin(stage='form'){
 const p=readPending(),confirming=stage==='confirm'||p?.mode==='join';
 const modal=shell(`👥 ${tx('Unirme a un ministerio','Join a ministry')}`,tx('El código identifica el ministerio y el rol que te asignaron.','The code identifies the ministry and role assigned to you.'));
 modal.querySelector('[data-lg-path-body]').innerHTML=`<div class="lg-path-note">${confirming?tx('Si ya confirmaste tu correo, escribe tu contraseña para completar la unión.','If you already confirmed your email, enter your password to finish joining.'):tx('Necesitas un código de invitación generado por el propietario o un administrador.','You need an invite code generated by the owner or an administrator.')}</div><div class="lg-path-form"><label>${tx('Tu nombre','Your name')}<input id="lgPathName" class="field" autocomplete="name" value="${esc(p?.displayName)}" ${confirming?'readonly':''}></label><label>${tx('Correo electrónico','Email address')}<input id="lgPathEmail" class="field" type="email" autocomplete="username" value="${esc(p?.email)}" ${confirming?'readonly':''}></label><label>${tx('Contraseña','Password')}<input id="lgPathPassword" class="field" type="password" autocomplete="${confirming?'current-password':'new-password'}" placeholder="${tx('Mínimo 6 caracteres','At least 6 characters')}"></label><label>${tx('Código de invitación','Invite code')}<input id="lgPathCode" class="field" autocomplete="off" autocapitalize="characters" spellcheck="false" value="${esc(p?.code)}" ${confirming?'readonly':''}></label></div><div id="lgPathStatus" class="lg-path-status"></div><div class="lg-path-actions"><button id="lgPathSubmit" class="btn primary wide" type="button">${confirming?tx('Ya confirmé · Unirme','I confirmed · Join'):tx('Crear cuenta y unirme','Create account and join')}</button><button id="lgPathBack" class="btn wide" type="button">${tx('Volver','Back')}</button></div><p class="lg-path-mini">${tx('La contraseña se gestiona con Supabase Auth. La Grey no la guarda.','Your password is handled by Supabase Auth. La Grey does not store it.')}</p>`;
 $('lgPathSubmit').onclick=confirming?completeJoin:createJoin;$('lgPathBack').onclick=()=>{savePending(null);showChoice()};setTimeout(()=>$(confirming?'lgPathPassword':'lgPathName')?.focus(),30);
}
async function finishJoin(code){await window.LAGREY_MINISTRIES.joinWithCode(code);await window.LAGREY_CLOUD.boot();savePending(null);setStatus(tx('¡Listo! Ya formas parte del ministerio.','Done! You are now part of the ministry.'),true);setTimeout(()=>location.reload(),650)}
async function createJoin(){
 const v=commonValues(),code=String($('lgPathCode')?.value||'').trim().toUpperCase();if(!v.displayName||!v.email||!v.password||!code){setStatus(tx('Completa nombre, correo, contraseña y código.','Complete name, email, password and code.'));return}if(v.password.length<6){setStatus(tx('La contraseña debe tener al menos 6 caracteres.','Password must be at least 6 characters.'));return}
 const btn=$('lgPathSubmit');btn.disabled=true;setStatus(tx('Creando tu cuenta…','Creating your account…'));
 try{const data=await window.LAGREY_AUTH.signUp({email:v.email,password:v.password,displayName:v.displayName});if(data?.session){await finishJoin(code);return}savePending({mode:'join',displayName:v.displayName,email:v.email,code});renderJoin('confirm');setStatus(tx('Cuenta creada. Revisa tu correo y confirma la cuenta.','Account created. Check your email and confirm the account.'),true)}catch(e){setStatus(friendly(e))}finally{if(btn)btn.disabled=false}
}
async function completeJoin(){const p=readPending(),password=String($('lgPathPassword')?.value||'');if(!p?.email||!p?.code||!password){setStatus(tx('Escribe tu contraseña para continuar.','Enter your password to continue.'));return}const btn=$('lgPathSubmit');btn.disabled=true;setStatus(tx('Comprobando tu cuenta…','Checking your account…'));try{await window.LAGREY_AUTH.signIn({email:p.email,password});await finishJoin(p.code)}catch(e){setStatus(friendly(e))}finally{if(btn)btn.disabled=false}}

function renderCreate(stage='form'){
 const p=readPending(),confirming=stage==='confirm'||p?.mode==='create';
 const modal=shell(`🎵 ${tx('Crear mi ministerio','Create my ministry')}`,tx('Tú serás el propietario y podrás invitar a tus miembros después.','You will be the owner and can invite your members afterwards.'));
 modal.querySelector('[data-lg-path-body]').innerHTML=`<div class="lg-path-note">${confirming?tx('Si ya confirmaste tu correo, escribe tu contraseña para crear el ministerio.','If you already confirmed your email, enter your password to create the ministry.'):tx('Para crear un ministerio nuevo no necesitas ningún código de invitación.','You do not need an invite code to create a new ministry.')}</div><div class="lg-path-form"><label>${tx('Tu nombre','Your name')}<input id="lgPathName" class="field" autocomplete="name" value="${esc(p?.displayName)}" ${confirming?'readonly':''}></label><label>${tx('Correo electrónico','Email address')}<input id="lgPathEmail" class="field" type="email" autocomplete="username" value="${esc(p?.email)}" ${confirming?'readonly':''}></label><label>${tx('Contraseña','Password')}<input id="lgPathPassword" class="field" type="password" autocomplete="${confirming?'current-password':'new-password'}" placeholder="${tx('Mínimo 6 caracteres','At least 6 characters')}"></label><label>${tx('Nombre del ministerio','Ministry name')}<input id="lgPathMinistry" class="field" autocomplete="organization" value="${esc(p?.ministryName)}" ${confirming?'readonly':''} placeholder="${tx('Ej. Ministerio de Alabanza Eben-Ezer','e.g. Eben-Ezer Worship Ministry')}"></label></div><div id="lgPathStatus" class="lg-path-status"></div><div class="lg-path-actions"><button id="lgPathSubmit" class="btn primary wide" type="button">${confirming?tx('Ya confirmé · Crear ministerio','I confirmed · Create ministry'):tx('Crear cuenta y ministerio','Create account and ministry')}</button><button id="lgPathBack" class="btn wide" type="button">${tx('Volver','Back')}</button></div><p class="lg-path-mini">${tx('Al crearlo quedarás como Propietario. Luego podrás generar códigos para administradores, líderes y miembros.','You will become Owner. Afterwards you can generate codes for administrators, leaders and members.')}</p>`;
 $('lgPathSubmit').onclick=confirming?completeCreate:createOwner;$('lgPathBack').onclick=()=>{savePending(null);showChoice()};setTimeout(()=>$(confirming?'lgPathPassword':'lgPathName')?.focus(),30);
}
async function createMinistrySafe(name){
 const base=window.LAGREY_MINISTRIES.slugify(name);try{return await window.LAGREY_MINISTRIES.createMinistry({name,slug:base,plan:'free'})}catch(e){if(!/duplicate key|ministries_slug_key|already exists/i.test(String(e?.message||e)))throw e;const suffix=Math.random().toString(36).slice(2,6);return await window.LAGREY_MINISTRIES.createMinistry({name,slug:`${base}-${suffix}`,plan:'free'})}
}
async function finishCreate(name){await createMinistrySafe(name);await window.LAGREY_CLOUD.boot();savePending(null);setStatus(tx('¡Ministerio creado! Tú eres el propietario.','Ministry created! You are the owner.'),true);setTimeout(()=>location.reload(),700)}
async function createOwner(){
 const v=commonValues(),ministryName=String($('lgPathMinistry')?.value||'').trim();if(!v.displayName||!v.email||!v.password||!ministryName){setStatus(tx('Completa nombre, correo, contraseña y nombre del ministerio.','Complete name, email, password and ministry name.'));return}if(v.password.length<6){setStatus(tx('La contraseña debe tener al menos 6 caracteres.','Password must be at least 6 characters.'));return}
 const btn=$('lgPathSubmit');btn.disabled=true;setStatus(tx('Creando tu cuenta…','Creating your account…'));
 try{const data=await window.LAGREY_AUTH.signUp({email:v.email,password:v.password,displayName:v.displayName});if(data?.session){await finishCreate(ministryName);return}savePending({mode:'create',displayName:v.displayName,email:v.email,ministryName});renderCreate('confirm');setStatus(tx('Cuenta creada. Revisa tu correo y confirma la cuenta. Luego vuelve aquí para crear tu ministerio.','Account created. Check your email and confirm the account. Then return here to create your ministry.'),true)}catch(e){setStatus(friendly(e))}finally{if(btn)btn.disabled=false}
}
async function completeCreate(){const p=readPending(),password=String($('lgPathPassword')?.value||'');if(!p?.email||!p?.ministryName||!password){setStatus(tx('Escribe tu contraseña para continuar.','Enter your password to continue.'));return}const btn=$('lgPathSubmit');btn.disabled=true;setStatus(tx('Comprobando tu cuenta…','Checking your account…'));try{await window.LAGREY_AUTH.signIn({email:p.email,password});await finishCreate(p.ministryName)}catch(e){setStatus(friendly(e))}finally{if(btn)btn.disabled=false}}

function openFlow(){const p=readPending();if(p?.mode==='create')return renderCreate('confirm');if(p?.mode==='join'||(p?.email&&p?.code))return renderJoin('confirm');showChoice()}

// Captura el botón que crea account-onboarding-v2 antes de que llegue a su onclick.
document.addEventListener('click',event=>{
 const btn=event.target.closest('#profileRegisterBtn');if(!btn)return;
 event.preventDefault();event.stopImmediatePropagation();closeProfile();openFlow();
},true);
})();
