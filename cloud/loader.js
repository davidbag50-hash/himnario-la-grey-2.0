(()=>{
'use strict';

const BASE='./cloud/';
const FILES=['config.js','data-service.js','supabase-client.js','auth-service.js','ministry-service.js','bootstrap.js','diagnostics.js'];

function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=BASE+src;s.defer=true;s.dataset.lagreyCloudModule=src;s.onload=resolve;s.onerror=()=>reject(new Error(`No se pudo cargar ${src}`));document.head.appendChild(s)})}

(async()=>{
  try{
    for(const file of FILES)await load(file);
    document.documentElement.dataset.lagreyCloudReady='1';
    window.dispatchEvent(new CustomEvent('lagrey:cloud-ready',{detail:window.LAGREY_CLOUD?.getState?.()||null}));
  }catch(error){
    console.error('[La Grey Cloud] loader error',error);
    document.documentElement.dataset.lagreyCloudReady='error';
    window.dispatchEvent(new CustomEvent('lagrey:cloud-error',{detail:{message:error?.message||String(error)}}));
  }
})();
})();
