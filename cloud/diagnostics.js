(()=>{
'use strict';

const CURRENT_SCHEMA_CHECKS=[
  {name:'profiles',table:'profiles',columns:'id'},
  {name:'ministries',table:'ministries',columns:'id'},
  {name:'ministry_members',table:'ministry_members',columns:'ministry_id,user_id'},
  {name:'ministry_roster',table:'ministry_roster',columns:'id,ministry_id'},
  {name:'ministry_repertoire',table:'ministry_repertoire',columns:'ministry_id,song_id'},
  {name:'ministry_song_notes',table:'ministry_song_notes',columns:'ministry_id,song_id'},
  {name:'user_preferences',table:'user_preferences',columns:'user_id'},
  {name:'ministry_events',table:'ministry_events',columns:'id,ministry_id'},
  {name:'ministry_event_setlist',table:'ministry_event_setlist',columns:'id,event_id'},
  {name:'ministry_event_assignments',table:'ministry_event_assignments',columns:'id,event_id,roster_member_id,music_role'},
  {name:'ministry_event_responses',table:'ministry_event_responses',columns:'event_id,roster_member_id,response_status'},
  {name:'user_favorites',table:'user_favorites',columns:'user_id,song_id'},
  {name:'user_learning_progress',table:'user_learning_progress',columns:'user_id,track_id,item_id'},
  {name:'user_song_notes',table:'user_song_notes',columns:'user_id,song_id'}
];

async function checkTable(client,item){
  try{
    const result=await client.from(item.table).select(item.columns,{head:true,count:'exact'}).limit(0);
    return{ok:!result.error,detail:result.error?.message||'available'};
  }catch(error){
    return{ok:false,detail:error?.message||String(error)};
  }
}

async function run(){
  const checks=[];
  const add=(name,ok,detail='')=>checks.push({name,ok:!!ok,detail:String(detail||'')});
  try{
    const cfg=window.LAGREY_SUPABASE?.validateConfig?.();
    add('config',!!cfg?.enabled,cfg?.enabled?'Cloud enabled':'Cloud disabled');
    if(!cfg?.enabled)return{ok:false,checks};

    const client=await window.LAGREY_SUPABASE.getClient();
    add('client',!!client,client?'Supabase client ready':'No client');

    for(const item of CURRENT_SCHEMA_CHECKS){
      const status=await checkTable(client,item);
      add(`schema:${item.name}`,status.ok,status.detail);
    }

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

      const capabilityChecks=[
        ['calendar','getEvents',[]],
        ['favorites','getFavorites',[]],
        ['learning','getLearningProgress',['diagnostics']],
        ['personal-notes','getPersonalSongNote',[1]]
      ];
      for(const [name,method,args] of capabilityChecks){
        try{
          if(typeof state.data?.[method]!=='function'){add(`capability:${name}`,false,`Missing client method: ${method}`);continue}
          const value=await state.data[method](...args);
          add(`capability:${name}`,true,Array.isArray(value)?`${value.length} item(s)`:'available');
        }catch(error){
          add(`capability:${name}`,false,error?.message||String(error));
        }
      }
    }
  }catch(error){add('exception',false,error?.message||String(error))}
  return{
    ok:checks.length>0&&checks.every(c=>c.ok),
    checks,
    summary:{
      passed:checks.filter(c=>c.ok).length,
      failed:checks.filter(c=>!c.ok).length,
      total:checks.length
    }
  };
}

window.LAGREY_CLOUD_DIAGNOSTICS={
  run,
  schema:CURRENT_SCHEMA_CHECKS.map(item=>item.name)
};
})();