(()=>{
'use strict';

const ACTIVE_KEY='lagrey_cloud_active_ministry';
let state={mode:'guest',ready:false,user:null,ministry:null,role:null,data:null,error:null};
const listeners=new Set();
const emit=()=>listeners.forEach(fn=>{try{fn({...state})}catch{}});

function readActiveMinistry(userId){
  try{const o=JSON.parse(localStorage.getItem(ACTIVE_KEY)||'{}');return o?.userId===userId?o.ministryId:null}catch{return null}
}
function saveActiveMinistry(userId,ministryId){localStorage.setItem(ACTIVE_KEY,JSON.stringify({userId,ministryId}))}

async function chooseMinistry(user){
  const list=await window.LAGREY_AUTH.ministries();
  if(!list.length)return null;
  const wanted=readActiveMinistry(user.id);
  const selected=list.find(m=>String(m.id)===String(wanted))||list[0];
  saveActiveMinistry(user.id,selected.id);
  return selected;
}

async function boot(){
  try{
    if(!window.LAGREY_SUPABASE?.isEnabled?.()){
      state={mode:'guest',ready:true,user:null,ministry:null,role:null,data:window.LAGREY_DATA.createGuestDataService(),error:null};emit();return state;
    }
    const user=await window.LAGREY_AUTH.getUser();
    if(!user){state={mode:'guest',ready:true,user:null,ministry:null,role:null,data:window.LAGREY_DATA.createGuestDataService(),error:null};emit();return state}
    const ministry=await chooseMinistry(user);
    if(!ministry){state={mode:'authenticated-no-ministry',ready:true,user,ministry:null,role:null,data:window.LAGREY_DATA.createGuestDataService(),error:null};emit();return state}
    const client=await window.LAGREY_SUPABASE.getClient();
    state={mode:'ministry',ready:true,user,ministry,role:ministry.role||'member',data:window.LAGREY_DATA.createMinistryDataService({client,userId:user.id,ministryId:ministry.id}),error:null};emit();return state;
  }catch(error){
    console.error('[La Grey Cloud] bootstrap error',error);
    state={mode:'guest-fallback',ready:true,user:null,ministry:null,role:null,data:window.LAGREY_DATA.createGuestDataService(),error};emit();return state;
  }
}

async function setActiveMinistry(ministryId){
  const user=await window.LAGREY_AUTH.getUser();
  if(!user)throw new Error('No hay usuario autenticado');
  const allowed=await window.LAGREY_AUTH.ministries();
  const selected=allowed.find(m=>String(m.id)===String(ministryId));
  if(!selected)throw new Error('El usuario no pertenece a ese ministerio');
  saveActiveMinistry(user.id,selected.id);
  return boot();
}

function subscribe(fn){listeners.add(fn);fn({...state});return()=>listeners.delete(fn)}
function getState(){return{...state}}
function getData(){return state.data||window.LAGREY_DATA.createGuestDataService()}

window.LAGREY_CLOUD={boot,getState,getData,setActiveMinistry,subscribe};
window.addEventListener('lagrey:cloud-reboot',boot);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.LAGREY_AUTH?.onAuthStateChange?.(()=>boot());
})();
