(()=>{
'use strict';

async function client(){return await window.LAGREY_SUPABASE?.getClient?.()||null}

async function getSession(){
  const c=await client();
  if(!c)return null;
  const {data,error}=await c.auth.getSession();
  if(error)throw error;
  return data.session||null;
}

async function getUser(){
  const c=await client();
  if(!c)return null;
  const {data,error}=await c.auth.getUser();
  if(error)throw error;
  return data.user||null;
}

async function signUp({email,password,displayName}){
  const c=await client();
  if(!c)throw new Error('La Grey Cloud no está configurada');
  const {data,error}=await c.auth.signUp({
    email:String(email||'').trim(),
    password:String(password||''),
    options:{data:{display_name:String(displayName||'').trim()}}
  });
  if(error)throw error;
  return data;
}

async function signIn({email,password}){
  const c=await client();
  if(!c)throw new Error('La Grey Cloud no está configurada');
  const {data,error}=await c.auth.signInWithPassword({email:String(email||'').trim(),password:String(password||'')});
  if(error)throw error;
  return data;
}

async function signOut(){
  const c=await client();
  if(!c)return;
  const {error}=await c.auth.signOut();
  if(error)throw error;
}

async function memberships(){
  const c=await client();
  const user=await getUser();
  if(!c||!user)return[];
  const {data,error}=await c.from('ministry_members').select('ministry_id,role,status,joined_at').eq('user_id',user.id).eq('status','active');
  if(error)throw error;
  return data||[];
}

async function ministries(){
  const c=await client();
  if(!c)return[];
  const memberRows=await memberships();
  if(!memberRows.length)return[];
  const ids=memberRows.map(x=>x.ministry_id);
  const {data,error}=await c.from('ministries').select('*').in('id',ids).order('name');
  if(error)throw error;
  const roleMap=new Map(memberRows.map(x=>[String(x.ministry_id),x.role]));
  return(data||[]).map(m=>({...m,role:roleMap.get(String(m.id))||'member'}));
}

function onAuthStateChange(callback){
  let cancelled=false,subscription=null;
  (async()=>{
    const c=await client();
    if(!c||cancelled)return;
    const result=c.auth.onAuthStateChange((event,session)=>callback?.(event,session));
    subscription=result?.data?.subscription||null;
  })();
  return()=>{cancelled=true;subscription?.unsubscribe?.()};
}

window.LAGREY_AUTH={getSession,getUser,signUp,signIn,signOut,memberships,ministries,onAuthStateChange};
})();
