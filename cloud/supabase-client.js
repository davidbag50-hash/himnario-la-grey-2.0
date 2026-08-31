(()=>{
'use strict';

const cfg=()=>window.LAGREY_CLOUD_CONFIG||{};
let clientPromise=null;

function validateConfig(){
  const c=cfg();
  if(!c.enabled)return{enabled:false};
  if(!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(String(c.supabaseUrl||'').trim()))throw new Error('La Grey Cloud: SUPABASE_URL inválida');
  if(!String(c.supabaseAnonKey||'').trim())throw new Error('La Grey Cloud: falta SUPABASE_ANON_KEY');
  return{enabled:true,url:String(c.supabaseUrl).replace(/\/$/,''),key:String(c.supabaseAnonKey),schema:c.schema||'public'};
}

async function loadSupabaseLibrary(){
  if(window.supabase?.createClient)return window.supabase;
  await new Promise((resolve,reject)=>{
    const existing=document.querySelector('script[data-lagrey-supabase-sdk]');
    if(existing){existing.addEventListener('load',resolve,{once:true});existing.addEventListener('error',reject,{once:true});return}
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
    s.async=true;s.dataset.lagreySupabaseSdk='1';
    s.onload=resolve;s.onerror=()=>reject(new Error('No se pudo cargar Supabase JS'));
    document.head.appendChild(s);
  });
  if(!window.supabase?.createClient)throw new Error('Supabase JS no quedó disponible');
  return window.supabase;
}

async function getClient(){
  if(clientPromise)return clientPromise;
  clientPromise=(async()=>{
    const c=validateConfig();
    if(!c.enabled)return null;
    const lib=await loadSupabaseLibrary();
    return lib.createClient(c.url,c.key,{
      db:{schema:c.schema},
      auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true},
      global:{headers:{'x-client-info':'la-grey-web'}}
    });
  })().catch(err=>{clientPromise=null;throw err});
  return clientPromise;
}

window.LAGREY_SUPABASE={validateConfig,getClient,isEnabled:()=>!!cfg().enabled};
})();
