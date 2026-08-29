(()=>{
'use strict';
const members=window.LAGREY_MEMBERS||[];
const $=id=>document.getElementById(id);
const key='lagrey_member_profile';
const instrumentKey='lagrey_multi_instrument';
const norm=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const byId=id=>members.find(m=>m.id===id)||null;
const findMember=name=>{const n=norm(name);return members.find(m=>m.aliases.some(a=>norm(a)===n))||null};
let profile=null;
try{const saved=JSON.parse(localStorage.getItem(key)||'null');profile=saved?.id==='visitor'?saved:byId(saved?.id)}catch{}

function preferredInstrument(){
 if(!profile||profile.id==='visitor')return null;
 if(profile.instrument==='piano'||profile.instrument==='guitar')return profile.instrument;
 if(profile.instrument==='all')return localStorage.getItem(instrumentKey)||'guitar';
 return null;
}
function roleText(p){return !p||p.id==='visitor'?'Acceso público':p.roles.join(' · ')}
function updateUI(){
 const btn=$('profileBtn');if(!btn)return;
 if(!profile){btn.innerHTML='👤 <span>Perfil</span>';return}
 btn.innerHTML=profile.id==='visitor'?'👤 <span>Visitante</span>':`👤 <span>${profile.name}</span>`;
}
function setStatus(msg,ok=false){const e=$('profileStatus');if(!e)return;e.textContent=msg||'';e.classList.toggle('profile-ok',!!ok)}
function showToast(msg){const t=$('toast');if(!t)return;t.textContent=msg;t.classList.remove('hidden');clearTimeout(showToast.t);showToast.t=setTimeout(()=>t.classList.add('hidden'),2600)}
function closeProfileModal(){$('profileModal')?.classList.add('hidden')}
function openProfileModal(){
 const modal=$('profileModal');if(!modal)return;
 const input=$('profileName');if(input)input.value=profile&&profile.id!=='visitor'?profile.name:'';
 setStatus(profile&&profile.id!=='visitor'?`${profile.name} · ${roleText(profile)}`:'');
 modal.classList.remove('hidden');
 setTimeout(()=>$('profileName')?.focus(),80);
}
function saveProfile(p){
 profile=p;localStorage.setItem(key,JSON.stringify(p));closeProfileModal();updateUI();
 if(p.id!=='visitor'){
   const pref=preferredInstrument();
   const msg=pref==='piano'?'Piano será tu vista predeterminada de acordes.':pref==='guitar'?'Guitarra será tu vista predeterminada de acordes.':'Tu perfil quedó listo.';
   showToast(`¡Bienvenido, ${p.name}! ${msg}`);
 }else showToast('Entraste como visitante.');
 document.dispatchEvent(new CustomEvent('lagrey:profile-changed',{detail:{profile:p}}));
}
function loginByName(){
 const name=$('profileName')?.value||'',m=findMember(name);
 if(!m){setStatus('No encontré ese nombre en el grupo. Revisa cómo lo escribiste o entra como visitante.');return}
 setStatus(`Perfil encontrado: ${m.name} · ${roleText(m)}`,true);setTimeout(()=>saveProfile(m),180);
}
function visitor(){saveProfile({id:'visitor',name:'Visitante',roles:[],instrument:'none'})}
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
