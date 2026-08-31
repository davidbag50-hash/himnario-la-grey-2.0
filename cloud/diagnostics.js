(()=>{
'use strict';

async function run(){
  const checks=[];
  const add=(name,ok,detail='')=>checks.push({name,ok:!!ok,detail:String(detail||'')});
  try{
    const cfg=window.LAGREY_SUPABASE?.validateConfig?.();
    add('config',!!cfg?.enabled,cfg?.enabled?'Cloud enabled':'Cloud disabled');
    if(!cfg?.enabled)return{ok:false,checks};

    const client=await window.LAGREY_SUPABASE.getClient();
    add('client',!!client,client?'Supabase client ready':'No client');

    const user=await window.LAGREY_AUTH.getUser();
    add('auth',!!user,user?.id||'No authenticated user');
    if(!user)return{ok:false,checks};

    const profileResult=await client.from('profiles').select('id,display_name').eq('id',user.id).maybeSingle();
    add('profile',!profileResult.error&&!!profileResult.data,profileResult.error?.message||profileResult.data?.display_name||'Missing profile');

    const memberships=await window.LAGREY_AUTH.memberships();
    add('memberships',Array.isArray(memberships),`${memberships.length} active membership(s)`);

    const ministries=await window.LAGREY_AUTH.ministries();
    add('ministries',Array.isArray(ministries),`${ministries.length} visible ministry(s)`);

    const state=await window.LAGREY_CLOUD.boot();
    add('bootstrap',!!state?.ready,`${state?.mode||'unknown'}${state?.ministry?.name?' · '+state.ministry.name:''}`);

    if(state?.mode==='ministry'){
      const repertoire=await state.data.getRepertoire();
      add('repertoire',Array.isArray(repertoire),`${repertoire.length} item(s)`);
    }
  }catch(error){add('exception',false,error?.message||String(error))}
  return{ok:checks.length>0&&checks.every(c=>c.ok),checks};
}

window.LAGREY_CLOUD_DIAGNOSTICS={run};
})();
