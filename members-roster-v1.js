(()=>{
'use strict';

const PROFILE_KEY='lagrey_member_profile';
const $=id=>document.getElementById(id);
const tx=(es,en)=>localStorage.getItem('lagrey_language')==='en'?en:es;
const norm=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
let roster=[],activeMember=null,refreshTimer=0,myPreferred=null,legacySyncedFor='';

const MUSIC={
 voice:{icon:'🎤',es:'Voz',en:'Voice'},
 guitar:{icon:'🎸',es:'Guitarra',en:'Guitar'},
 piano:{icon:'🎹',es:'Piano',en:'Piano'},
 bass:{icon:'🎸',es:'Bajo',en:'Bass'},
 drums:{icon:'🥁',es:'Batería',en:'Drums'},
 all:{icon:'🎵',es:'Todos los instrumentos',en:'All instruments'}
};
const roleLabel=r=>({owner:tx('Propietario','Owner'),admin:tx('Administrador','Administrator'),leader:tx('Líder','Leader'),member:tx('Miembro','Member')}[r]||r||'');
const musicLabel=r=>MUSIC[r]?`${MUSIC[r].icon} ${tx(MUSIC[r].es,MUSIC[r].en)}`:String(r||'');
const musicText=m=>(m?.music_roles||[]).map(musicLabel).join(' · ')||tx('Sin función musical asignada','No musical role assigned');
const isAdmin=state=>['owner','admin'].includes(state?.role);
const state=()=>window.LAGREY_CLOUD?.getState?.()||null;

function toast(message){const t=$('toast');if(!t)return;t.textContent=message;t.classList.remove('hidden');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.add('hidden'),3000)}
function online(member){if(!member?.user_id||!member.last_seen_at)return false;const time=new Date(member.last_seen_at).getTime();return Number.isFinite(time)&&Date.now()-time<130000}
function accountStatus(member){if(!member?.user_id)return tx('Pendiente de unirse','Pending to join');return online(member)?tx('En línea','Online'):tx('Desconectado','Offline')}
function statusClass(member){return !member?.user_id?'pending':online(member)?'online':'offline'}

function ensureStyles(){if($('lgRosterStyle'))return;const s=document.createElement('style');s.id='lgRosterStyle';s.textContent=`
.lg-members-card .lg-members-people{font-size:66px;line-height:1;filter:drop-shadow(0 8px 16px rgba(13,114,216,.18))}
#lgRosterModal{z-index:1002}.lg-roster-card{max-width:620px}.lg-roster-head-actions{display:flex;gap:8px;margin:12px 0}.lg-roster-list{display:grid;gap:10px;margin-top:12px}.lg-roster-person{width:100%;display:grid;grid-template-columns:46px 1fr auto;gap:12px;align-items:center;text-align:left;border:1px solid rgba(123,190,236,.2);border-radius:16px;padding:12px;background:rgba(6,31,51,.72);color:#eaf6ff}.lg-roster-avatar{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(180deg,#1679b5,#0c4c78);font-weight:900;font-size:18px}.lg-roster-main b{display:block;font-size:16px}.lg-roster-main small{display:block;color:#a9bfd2;margin-top:3px;line-height:1.3}.lg-roster-state{font-size:11px;font-weight:850;padding:5px 8px;border-radius:999px;white-space:nowrap}.lg-roster-state.online{color:#b7f4cd;background:rgba(44,181,97,.16);border:1px solid rgba(83,220,132,.35)}.lg-roster-state.offline{color:#aebdca;background:rgba(132,151,168,.13);border:1px solid rgba(160,177,190,.22)}.lg-roster-state.pending{color:#ffe0a1;background:rgba(213,160,45,.13);border:1px solid rgba(224,177,72,.3)}.lg-roster-summary{display:grid;gap:8px;padding:14px;border-radius:16px;background:rgba(12,62,96,.36);border:1px solid rgba(103,192,255,.18)}.lg-roster-summary h3{margin:0;font-size:20px}.lg-roster-line{color:#bad0e2;font-size:14px;line-height:1.45}.lg-roster-code{margin:12px 0;padding:14px;border-radius:14px;text-align:center;font:850 20px/1.35 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:1px;color:#f2c24e;background:rgba(216,165,45,.09);border:1px solid rgba(216,165,45,.33);word-break:break-all}.lg-roster-form{display:grid;gap:12px}.lg-roster-form label{display:grid;gap:6px;font-weight:750}.lg-roster-checks{display:grid;grid-template-columns:1fr 1fr;gap:8px}.lg-roster-check{display:flex!important;align-items:center;gap:8px!important;padding:9px 10px;border-radius:12px;background:rgba(11,52,80,.55);border:1px solid rgba(120,188,231,.18);font-weight:700!important}.lg-roster-check input{width:auto}.lg-roster-empty{padding:18px;text-align:center;color:#9fb2c3;border:1px dashed rgba(140,190,225,.2);border-radius:15px}.lg-roster-profile-music{margin-top:8px;color:#cce7f8;font-size:13px;line-height:1.4}@media(max-width:480px){.lg-roster-person{grid-template-columns:42px 1fr;}.lg-roster-state{grid-column:2;justify-self:start}.lg-roster-checks{grid-template-columns:1fr}}
`;document.head.appendChild(s)}

function ensureCard(){
 const s=state(),grid=document.querySelector('#lgExactHome .exact-card-grid');let card=$('lgMembersCard');
 if(s?.mode!=='ministry'||!grid){card?.remove();return}
 if(card)return;
 card=document.createElement('button');card.id='lgMembersCard';card.type='button';card.className='exact-card lg-members-card';
 card.innerHTML=`<span class="exact-illustration lg-members-people" aria-hidden="true">👥</span><h2>${tx('Miembros','Members')}</h2><p>${tx('Tu agrupación y sus funciones','Your team and their roles')}</p><span class="exact-mini"><b>♥</b></span>`;
 card.onclick=openRoster;grid.appendChild(card);
}

function modal(){
 let m=$('lgRosterModal');if(m)return m;ensureStyles();m=document.createElement('div');m.id='lgRosterModal';m.className='modal hidden';m.innerHTML=`<div class="modal-card profile-modal-card lg-roster-card"><div class="modal-top"><div><h2>👥 ${tx('Miembros','Members')}</h2><div class="chord-sub" id="lgRosterSubtitle"></div></div><button class="close" type="button" id="lgRosterClose">×</button></div><div id="lgRosterBody"></div></div>`;document.body.appendChild(m);$('lgRosterClose').onclick=closeRoster;m.addEventListener('click',e=>{if(e.target===m)closeRoster()});return m;
}
function closeRoster(){clearInterval(refreshTimer);refreshTimer=0;$('lgRosterModal')?.classList.add('hidden');activeMember=null}

async function fetchRoster(){const s=state();if(s?.mode!=='ministry')return[];roster=await window.LAGREY_MINISTRIES.listRoster(s.ministry.id);return roster}

function legacyRoles(member){const roles=[];for(const r of member?.roles||[]){const n=norm(r);if(n==='voz')roles.push('voice');else if(n==='guitarra')roles.push('guitar');else if(n==='piano')roles.push('piano');else if(n==='todos los instrumentos')roles.push('all')}return[...new Set(roles)]}
async function syncLegacyLaGrey(){
 const s=state();if(s?.mode!=='ministry'||s.ministry?.slug!=='la-grey'||!isAdmin(s)||legacySyncedFor===s.ministry.id)return;
 legacySyncedFor=s.ministry.id;
 try{
  let rows=await fetchRoster();
  for(const member of window.LAGREY_MEMBERS||[]){
   let found=rows.find(r=>r.legacy_key===member.id)||rows.find(r=>norm(r.display_name)===norm(member.name));
   if(!found&&member.id==='david')found=rows.find(r=>r.cloud_role==='owner')||null;
   const roles=legacyRoles(member),pref=['guitar','piano','voice','all'].includes(member.instrument)?member.instrument:'none';
   if(found){
    const patch={};if(!found.legacy_key)patch.legacyKey=member.id;if(!(found.music_roles||[]).length&&roles.length)patch.musicRoles=roles;if((!found.preferred_instrument||found.preferred_instrument==='none')&&pref!=='none')patch.preferredInstrument=pref;
    if(Object.keys(patch).length){try{await window.LAGREY_MINISTRIES.updateRosterMember(found.id,patch)}catch{}}
   }else{
    try{await window.LAGREY_MINISTRIES.addRosterMember({ministryId:s.ministry.id,displayName:member.name,musicRoles:roles,preferredInstrument:pref,cloudRole:'member',legacyKey:member.id})}catch{}
   }
  }
  await fetchRoster();
 }catch(error){console.warn('[La Grey roster] legacy sync skipped',error)}
}

function renderList(){
 const s=state(),body=$('lgRosterBody');if(!body)return;$('lgRosterSubtitle').textContent=s?.ministry?.name||'';
 const add=isAdmin(s)?`<div class="lg-roster-head-actions"><button id="lgRosterAdd" class="btn primary" type="button">＋ ${tx('Agregar miembro','Add member')}</button></div>`:'';
 const items=roster.map(m=>`<button class="lg-roster-person" type="button" data-roster-id="${m.id}"><span class="lg-roster-avatar">${esc((m.display_name||'?').slice(0,1).toUpperCase())}</span><span class="lg-roster-main"><b>${esc(m.display_name)}</b><small>${esc(musicText(m))}</small><small>${esc(roleLabel(m.cloud_role))}</small></span><span class="lg-roster-state ${statusClass(m)}">${esc(accountStatus(m))}</span></button>`).join('');
 body.innerHTML=add+`<div class="lg-roster-list">${items||`<div class="lg-roster-empty">${tx('Aún no hay miembros en esta agrupación.','There are no members in this team yet.')}</div>`}</div>`;
 $('lgRosterAdd')?.addEventListener('click',renderAddForm);body.querySelectorAll('[data-roster-id]').forEach(b=>b.onclick=()=>renderMember(b.dataset.rosterId));
}

function renderMember(id){
 const s=state(),m=roster.find(x=>String(x.id)===String(id)),body=$('lgRosterBody');if(!m||!body)return;activeMember=m;
 const canInvite=isAdmin(s)&&!m.user_id&&m.cloud_role!=='owner';
 body.innerHTML=`<div class="lg-roster-summary"><h3>${esc(m.display_name)}</h3><div class="lg-roster-line">${esc(musicText(m))}</div><div class="lg-roster-line"><b>${tx('Rol en el ministerio','Ministry role')}:</b> ${esc(roleLabel(m.cloud_role))}</div><div class="lg-roster-line"><b>${tx('Cuenta','Account')}:</b> <span class="lg-roster-state ${statusClass(m)}">${esc(accountStatus(m))}</span></div></div><div id="lgRosterInviteArea"></div><div class="lg-roster-head-actions">${canInvite?`<button id="lgRosterInvite" class="btn primary" type="button">🔑 ${tx('Generar código para unirse','Generate join code')}</button>`:''}<button id="lgRosterBack" class="btn" type="button">← ${tx('Miembros','Members')}</button></div>`;
 $('lgRosterBack').onclick=renderList;$('lgRosterInvite')?.addEventListener('click',generateMemberCode);
}

async function generateMemberCode(){
 if(!activeMember)return;const btn=$('lgRosterInvite'),area=$('lgRosterInviteArea');if(btn)btn.disabled=true;if(area)area.innerHTML=`<p class="lg-roster-line">${tx('Generando código…','Generating code…')}</p>`;
 try{const code=await window.LAGREY_MINISTRIES.createRosterInvite({rosterId:activeMember.id,validHours:168,allowedUses:1});if(area)area.innerHTML=`<div class="lg-roster-code" id="lgRosterCode">${esc(code)}</div><button id="lgRosterCopy" class="btn primary wide" type="button">📋 ${tx('Copiar código','Copy code')}</button><p class="lg-roster-line">${tx('Este código corresponde únicamente a esta ficha y vence en 7 días.','This code belongs only to this profile and expires in 7 days.')}</p>`;$('lgRosterCopy').onclick=()=>copyCode(code)}catch(error){if(area)area.innerHTML=`<p class="lg-roster-line">${esc(error?.message||String(error))}</p>`}finally{if(btn)btn.disabled=false}
}
async function copyCode(code){try{await navigator.clipboard.writeText(String(code));toast(tx('Código copiado.','Code copied.'))}catch{const a=document.createElement('textarea');a.value=String(code);document.body.appendChild(a);a.select();document.execCommand('copy');a.remove();toast(tx('Código copiado.','Code copied.'))}}

function renderAddForm(){
 const body=$('lgRosterBody');if(!body)return;body.innerHTML=`<div class="lg-roster-form"><label>${tx('Nombre','Name')}<input id="lgRosterName" class="field" autocomplete="off" placeholder="${tx('Ej. Nicole','e.g. Nicole')}"></label><label>${tx('Rol en el ministerio','Ministry role')}<select id="lgRosterCloudRole" class="field"><option value="member">${tx('Miembro','Member')}</option><option value="leader">${tx('Líder','Leader')}</option><option value="admin">${tx('Administrador','Administrator')}</option></select></label><div><b>${tx('¿Qué hace en la agrupación?','What do they do in the team?')}</b><div class="lg-roster-checks">${Object.entries(MUSIC).map(([key,v])=>`<label class="lg-roster-check"><input type="checkbox" value="${key}" data-music-role> ${v.icon} ${tx(v.es,v.en)}</label>`).join('')}</div></div><label>${tx('Instrumento preferido para acordes','Preferred chord instrument')}<select id="lgRosterPreferred" class="field"><option value="none">${tx('Sin preferencia','No preference')}</option><option value="guitar">${tx('Guitarra','Guitar')}</option><option value="piano">Piano</option><option value="voice">${tx('Voz','Voice')}</option><option value="all">${tx('Todos los instrumentos','All instruments')}</option></select></label><div id="lgRosterFormStatus" class="lg-roster-line"></div><div class="lg-roster-head-actions"><button id="lgRosterSave" class="btn primary" type="button">${tx('Guardar miembro','Save member')}</button><button id="lgRosterCancel" class="btn" type="button">${tx('Cancelar','Cancel')}</button></div></div>`;
 $('lgRosterCancel').onclick=renderList;$('lgRosterSave').onclick=saveNewMember;setTimeout(()=>$('lgRosterName')?.focus(),30);
}
async function saveNewMember(){
 const s=state(),name=String($('lgRosterName')?.value||'').trim(),cloudRole=$('lgRosterCloudRole')?.value||'member',preferred=$('lgRosterPreferred')?.value||'none',roles=[...document.querySelectorAll('[data-music-role]:checked')].map(x=>x.value),status=$('lgRosterFormStatus'),btn=$('lgRosterSave');if(!name){if(status)status.textContent=tx('Escribe el nombre del miembro.','Enter the member name.');return}if(btn)btn.disabled=true;if(status)status.textContent=tx('Guardando…','Saving…');
 try{await window.LAGREY_MINISTRIES.addRosterMember({ministryId:s.ministry.id,displayName:name,musicRoles:roles,preferredInstrument:preferred,cloudRole});await fetchRoster();renderList();toast(tx('Miembro agregado.','Member added.'))}catch(error){if(status)status.textContent=error?.message||String(error)}finally{if(btn)btn.disabled=false}
}

async function openRoster(){
 const s=state();if(s?.mode!=='ministry'){toast(tx('Inicia sesión en un ministerio para ver sus miembros.','Sign in to a ministry to see its members.'));return}modal().classList.remove('hidden');$('lgRosterBody').innerHTML=`<div class="lg-roster-empty">${tx('Cargando miembros…','Loading members…')}</div>`;
 try{await fetchRoster();await syncLegacyLaGrey();renderList();await heartbeat();clearInterval(refreshTimer);refreshTimer=setInterval(async()=>{if($('lgRosterModal')?.classList.contains('hidden'))return;try{await fetchRoster();if(!activeMember)renderList();else renderMember(activeMember.id)}catch{}},30000)}catch(error){$('lgRosterBody').innerHTML=`<div class="lg-roster-empty">${esc(error?.message||String(error))}</div>`}
}

async function heartbeat(){const s=state();if(s?.mode!=='ministry'||document.hidden)return;try{await window.LAGREY_MINISTRIES.touchPresence(s.ministry.id);const mine=await window.LAGREY_MINISTRIES.getMyRosterProfile(s.ministry.id);if(mine){myPreferred=mine.preferred_instrument||null;syncProfileMusic(mine)}}catch{}}
function preferredChord(){if(myPreferred==='piano'||myPreferred==='guitar')return myPreferred;if(myPreferred==='all')return localStorage.getItem('lagrey_multi_instrument')==='piano'?'piano':'guitar';return'guitar'}
function installPreferredGetter(){window.LAGREY_GET_PREFERRED_CHORD_INSTRUMENT=()=>preferredChord()}

function syncProfileMusic(mine){
 if(!mine)return;const p=$('profileModal'),hint=p?.querySelector('.hint');if(!p||p.classList.contains('hidden')||!hint)return;let line=$('lgRosterProfileMusic');if(!line){line=document.createElement('div');line.id='lgRosterProfileMusic';line.className='lg-roster-profile-music';hint.insertAdjacentElement('beforebegin',line)}line.textContent=`${musicText(mine)} · ${roleLabel(mine.cloud_role)}`;
 try{const saved=JSON.parse(localStorage.getItem(PROFILE_KEY)||'null');if(saved?.cloud){saved.musicRoles=mine.music_roles||[];saved.instrument=mine.preferred_instrument||saved.instrument;saved.rosterId=mine.id;localStorage.setItem(PROFILE_KEY,JSON.stringify(saved))}}catch{}
}
async function syncProfileOnOpen(){const s=state();if(s?.mode!=='ministry')return;try{const mine=await window.LAGREY_MINISTRIES.getMyRosterProfile(s.ministry.id);if(mine){myPreferred=mine.preferred_instrument||null;syncProfileMusic(mine)}}catch{}}

function refreshShell(){ensureStyles();ensureCard();installPreferredGetter()}
function boot(){refreshShell();setTimeout(refreshShell,120);setTimeout(refreshShell,600);heartbeat();setInterval(heartbeat,60000)}
window.addEventListener('lagrey:cloud-ready',boot);window.addEventListener('lagrey:cloud-reboot',()=>setTimeout(()=>{refreshShell();heartbeat()},250));window.addEventListener('focus',heartbeat);document.addEventListener('visibilitychange',()=>{if(!document.hidden)heartbeat()});document.addEventListener('click',e=>{if(e.target.closest('#profileBtn,[data-exact-action="profile"]'))setTimeout(syncProfileOnOpen,100)},true);new MutationObserver(muts=>{if(muts.some(m=>m.attributeName==='lang')){ensureCard();if(!$('lgRosterModal')?.classList.contains('hidden'))activeMember?renderMember(activeMember.id):renderList()}}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
if(document.documentElement.dataset.lagreyCloudReady==='1')boot();
})();
