(()=>{
'use strict';

const $=id=>document.getElementById(id);
const tx=(es,en)=>localStorage.getItem('lagrey_language')==='en'?en:es;
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
let activeId=null,enhanceTimer=0;

const MUSIC={
 voice:{icon:'🎤',es:'Voz',en:'Voice'},
 guitar:{icon:'🎸',es:'Guitarra',en:'Guitar'},
 piano:{icon:'🎹',es:'Piano',en:'Piano'},
 bass:{icon:'🎸',es:'Bajo',en:'Bass'},
 drums:{icon:'🥁',es:'Batería',en:'Drums'},
 all:{icon:'🎵',es:'Todos los instrumentos',en:'All instruments'}
};
const roleLabel=r=>({owner:tx('Propietario','Owner'),admin:tx('Administrador','Administrator'),leader:tx('Líder','Leader'),member:tx('Miembro','Member')}[r]||r||'');
const state=()=>window.LAGREY_CLOUD?.getState?.()||null;
const canManage=()=>['owner','admin'].includes(state()?.role);

function toast(message){const t=$('toast');if(!t)return;t.textContent=message;t.classList.remove('hidden');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.add('hidden'),3200)}

async function getMember(id){
 const s=state();if(s?.mode!=='ministry')return null;
 const rows=await window.LAGREY_MINISTRIES.listRoster(s.ministry.id);
 return rows.find(x=>String(x.id)===String(id))||null;
}

function ensureStyles(){
 if($('lgMemberManageStyle'))return;
 const style=document.createElement('style');style.id='lgMemberManageStyle';style.textContent=`
.lg-manage-actions{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 2px}.lg-danger{border-color:rgba(235,93,93,.48)!important;color:#ffd0d0!important;background:rgba(151,34,34,.18)!important}.lg-warn{border-color:rgba(226,174,67,.42)!important;color:#ffe4a9!important;background:rgba(145,104,23,.14)!important}
#lgMemberManageModal{z-index:1005}.lg-member-manage-card{max-width:590px}.lg-manage-form{display:grid;gap:12px}.lg-manage-form label{display:grid;gap:6px;font-weight:750}.lg-manage-checks{display:grid;grid-template-columns:1fr 1fr;gap:8px}.lg-manage-check{display:flex!important;align-items:center;gap:8px!important;padding:9px 10px;border-radius:12px;background:rgba(11,52,80,.55);border:1px solid rgba(120,188,231,.18);font-weight:700!important}.lg-manage-check input{width:auto}.lg-manage-note{font-size:13px;color:#a9bfd2;line-height:1.4}.lg-confirm-box{padding:15px;border-radius:15px;background:rgba(111,29,29,.13);border:1px solid rgba(233,94,94,.3);line-height:1.5}.lg-confirm-box b{color:#fff}.lg-manage-status{min-height:20px;color:#bad0e2;font-size:13px}@media(max-width:480px){.lg-manage-checks{grid-template-columns:1fr}}
`;document.head.appendChild(style);
}

function manageModal(){
 let modal=$('lgMemberManageModal');if(modal)return modal;ensureStyles();
 modal=document.createElement('div');modal.id='lgMemberManageModal';modal.className='modal hidden';
 modal.innerHTML=`<div class="modal-card profile-modal-card lg-member-manage-card"><div class="modal-top"><div><h2 id="lgMemberManageTitle">✏️ ${tx('Editar miembro','Edit member')}</h2><div class="chord-sub" id="lgMemberManageSub"></div></div><button class="close" type="button" id="lgMemberManageClose">×</button></div><div id="lgMemberManageBody"></div></div>`;
 document.body.appendChild(modal);$('lgMemberManageClose').onclick=()=>modal.classList.add('hidden');modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.add('hidden')});return modal;
}

function refreshRoster(){
 const modal=$('lgRosterModal');if(modal)modal.classList.add('hidden');activeId=null;
 setTimeout(()=>$('lgMembersCard')?.click(),280);
}

async function enhanceDetail(){
 if(!activeId||!canManage())return;
 const rosterModal=$('lgRosterModal'),body=$('lgRosterBody');
 if(!rosterModal||rosterModal.classList.contains('hidden')||!body||body.querySelector('[data-roster-id]')||$('lgMemberManageActions'))return;
 let member;try{member=await getMember(activeId)}catch{return}if(!member)return;
 const s=state();if(s?.role==='admin'&&member.cloud_role==='owner')return;
 const box=document.createElement('div');box.id='lgMemberManageActions';box.className='lg-manage-actions';
 const isOwner=member.cloud_role==='owner';
 box.innerHTML=`<button class="btn" id="lgEditMemberBtn" type="button">✏️ ${tx('Editar','Edit')}</button>${!isOwner&&!member.user_id?`<button class="btn lg-warn" id="lgRevokeMemberInviteBtn" type="button">🚫 ${tx('Revocar código','Revoke code')}</button>`:''}${!isOwner?`<button class="btn lg-danger" id="lgRemoveMemberBtn" type="button">🗑️ ${member.user_id?tx('Quitar del ministerio','Remove from ministry'):tx('Eliminar ficha','Delete profile')}</button>`:''}`;
 const back=$('lgRosterBack');back?.parentElement?.insertAdjacentElement('beforebegin',box);
 $('lgEditMemberBtn')?.addEventListener('click',()=>openEdit(member));
 $('lgRevokeMemberInviteBtn')?.addEventListener('click',()=>revokeCodes(member));
 $('lgRemoveMemberBtn')?.addEventListener('click',()=>openRemove(member));
}

function roleOptions(member){
 if(member.cloud_role==='owner')return `<option value="owner">${tx('Propietario','Owner')}</option>`;
 return `<option value="member" ${member.cloud_role==='member'?'selected':''}>${tx('Miembro','Member')}</option><option value="leader" ${member.cloud_role==='leader'?'selected':''}>${tx('Líder','Leader')}</option><option value="admin" ${member.cloud_role==='admin'?'selected':''}>${tx('Administrador','Administrator')}</option>`;
}

function openEdit(member){
 const modal=manageModal(),body=$('lgMemberManageBody');$('lgMemberManageTitle').textContent=`✏️ ${tx('Editar miembro','Edit member')}`;$('lgMemberManageSub').textContent=member.display_name;
 const checks=Object.entries(MUSIC).map(([key,v])=>`<label class="lg-manage-check"><input type="checkbox" value="${key}" data-lg-edit-music ${(member.music_roles||[]).includes(key)?'checked':''}> ${v.icon} ${tx(v.es,v.en)}</label>`).join('');
 body.innerHTML=`<div class="lg-manage-form"><label>${tx('Nombre','Name')}<input id="lgEditMemberName" class="field" autocomplete="off" value="${esc(member.display_name)}"></label><label>${tx('Rol en el ministerio','Ministry role')}<select id="lgEditMemberRole" class="field" ${member.cloud_role==='owner'?'disabled':''}>${roleOptions(member)}</select></label><div><b>${tx('¿Qué hace en la agrupación?','What do they do in the team?')}</b><div class="lg-manage-checks">${checks}</div></div><label>${tx('Instrumento preferido para acordes','Preferred chord instrument')}<select id="lgEditMemberPreferred" class="field"><option value="none">${tx('Sin preferencia','No preference')}</option><option value="guitar">${tx('Guitarra','Guitar')}</option><option value="piano">Piano</option><option value="voice">${tx('Voz','Voice')}</option><option value="all">${tx('Todos los instrumentos','All instruments')}</option></select></label>${member.user_id?`<div class="lg-manage-note">${tx('Al guardar, el rol también actualizará los permisos reales de esta cuenta en el ministerio.','Saving also updates this account’s real ministry permissions.')}</div>`:''}<div id="lgEditMemberStatus" class="lg-manage-status"></div><div class="lg-manage-actions"><button id="lgEditMemberSave" class="btn primary" type="button">${tx('Guardar cambios','Save changes')}</button><button id="lgEditMemberCancel" class="btn" type="button">${tx('Cancelar','Cancel')}</button></div></div>`;
 $('lgEditMemberPreferred').value=member.preferred_instrument||'none';
 $('lgEditMemberCancel').onclick=()=>modal.classList.add('hidden');$('lgEditMemberSave').onclick=()=>saveEdit(member);modal.classList.remove('hidden');setTimeout(()=>$('lgEditMemberName')?.focus(),30);
}

async function saveEdit(member){
 const btn=$('lgEditMemberSave'),status=$('lgEditMemberStatus'),name=String($('lgEditMemberName')?.value||'').trim(),role=$('lgEditMemberRole')?.value||member.cloud_role,preferred=$('lgEditMemberPreferred')?.value||'none',music=[...document.querySelectorAll('[data-lg-edit-music]:checked')].map(x=>x.value);
 if(!name){status.textContent=tx('Escribe el nombre del miembro.','Enter the member name.');return}
 btn.disabled=true;status.textContent=tx('Guardando cambios…','Saving changes…');
 try{await window.LAGREY_MINISTRIES.updateRosterMemberAdmin({rosterId:member.id,displayName:name,musicRoles:music,preferredInstrument:preferred,cloudRole:role});manageModal().classList.add('hidden');toast(tx('Miembro actualizado.','Member updated.'));refreshRoster()}catch(error){status.textContent=error?.message||String(error)}finally{btn.disabled=false}
}

async function revokeCodes(member){
 const btn=$('lgRevokeMemberInviteBtn');if(btn)btn.disabled=true;
 try{const count=await window.LAGREY_MINISTRIES.revokeRosterInvites(member.id);toast(count?tx('Código revocado.','Code revoked.'):tx('No había códigos activos.','There were no active codes.'))}catch(error){toast(error?.message||String(error))}finally{if(btn)btn.disabled=false}
}

function openRemove(member){
 const modal=manageModal(),body=$('lgMemberManageBody');$('lgMemberManageTitle').textContent=member.user_id?`🗑️ ${tx('Quitar del ministerio','Remove from ministry')}`:`🗑️ ${tx('Eliminar ficha','Delete profile')}`;$('lgMemberManageSub').textContent=member.display_name;
 body.innerHTML=`<div class="lg-confirm-box">${member.user_id?tx(`¿Seguro que deseas quitar a <b>${esc(member.display_name)}</b> de esta agrupación? Su cuenta seguirá existiendo, pero perderá el acceso a este ministerio.`,`Are you sure you want to remove <b>${esc(member.display_name)}</b> from this team? Their account will continue to exist, but they will lose access to this ministry.`):tx(`¿Seguro que deseas eliminar la ficha pendiente de <b>${esc(member.display_name)}</b>? También se revocarán sus códigos pendientes.`,`Are you sure you want to delete <b>${esc(member.display_name)}</b>'s pending profile? Pending codes will also be revoked.`)}</div><div id="lgRemoveMemberStatus" class="lg-manage-status"></div><div class="lg-manage-actions"><button id="lgRemoveMemberConfirm" class="btn lg-danger" type="button">${member.user_id?tx('Sí, quitar','Yes, remove'):tx('Sí, eliminar','Yes, delete')}</button><button id="lgRemoveMemberCancel" class="btn" type="button">${tx('Cancelar','Cancel')}</button></div>`;
 $('lgRemoveMemberCancel').onclick=()=>modal.classList.add('hidden');$('lgRemoveMemberConfirm').onclick=()=>confirmRemove(member);modal.classList.remove('hidden');
}

async function confirmRemove(member){
 const btn=$('lgRemoveMemberConfirm'),status=$('lgRemoveMemberStatus');btn.disabled=true;status.textContent=tx('Procesando…','Processing…');
 try{await window.LAGREY_MINISTRIES.removeRosterMember(member.id);manageModal().classList.add('hidden');toast(member.user_id?tx('Miembro quitado del ministerio.','Member removed from ministry.'):tx('Ficha eliminada.','Profile deleted.'));refreshRoster()}catch(error){status.textContent=error?.message||String(error)}finally{btn.disabled=false}
}

function wire(){
 ensureStyles();
 document.addEventListener('click',e=>{
  const member=e.target.closest?.('[data-roster-id]');if(member){activeId=member.dataset.rosterId;setTimeout(enhanceDetail,60);return}
  if(e.target.closest?.('#lgRosterBack,#lgRosterAdd,#lgRosterClose'))activeId=null;
 },true);
 clearInterval(enhanceTimer);enhanceTimer=setInterval(()=>{if(activeId)enhanceDetail()},700);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();
