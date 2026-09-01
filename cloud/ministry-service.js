(()=>{
'use strict';

async function client(){const c=await window.LAGREY_SUPABASE?.getClient?.();if(!c)throw new Error('La Grey Cloud no está configurada');return c}

function slugify(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,80)}

async function createMinistry({name,slug,plan='free'}){
  const c=await client();
  const user=await window.LAGREY_AUTH.getUser();
  if(!user)throw new Error('Authentication required');
  const cleanName=String(name||'').trim();
  const cleanSlug=slugify(slug||cleanName);
  if(!cleanName)throw new Error('El ministerio necesita un nombre');
  if(!cleanSlug)throw new Error('No se pudo generar un identificador válido');
  const {data,error}=await c.from('ministries').insert({name:cleanName,slug:cleanSlug,owner_user_id:user.id,plan}).select().single();
  if(error)throw error;
  window.dispatchEvent(new Event('lagrey:cloud-reboot'));
  return data;
}

async function createInvite({ministryId,role='member',validHours=168,allowedUses=1}){
  const c=await client();
  const {data,error}=await c.rpc('create_ministry_invite',{target_ministry:ministryId,invite_role:role,valid_hours:validHours,allowed_uses:allowedUses});
  if(error)throw error;
  return data;
}

async function joinWithCode(code){
  const c=await client();
  const {data,error}=await c.rpc('join_ministry_with_code',{raw_code:String(code||'').trim()});
  if(error)throw error;
  window.dispatchEvent(new Event('lagrey:cloud-reboot'));
  return data;
}

async function listInvites(ministryId){
  const c=await client();
  const {data,error}=await c.from('ministry_invites').select('id,ministry_id,roster_member_id,role,created_by,created_at,expires_at,max_uses,use_count,revoked_at').eq('ministry_id',ministryId).order('created_at',{ascending:false});
  if(error)throw error;
  return data||[];
}

async function revokeInvite(inviteId){
  const c=await client();
  const {error}=await c.rpc('revoke_ministry_invite',{invite_id:inviteId});
  if(error)throw error;
}

async function listRoster(ministryId){
  const c=await client();
  const {data,error}=await c.from('ministry_roster')
    .select('id,ministry_id,display_name,music_roles,preferred_instrument,cloud_role,user_id,legacy_key,created_at,updated_at,last_seen_at')
    .eq('ministry_id',ministryId)
    .order('display_name',{ascending:true});
  if(error)throw error;
  return data||[];
}

async function getMyRosterProfile(ministryId){
  const c=await client();
  const user=await window.LAGREY_AUTH.getUser();
  if(!user)return null;
  const {data,error}=await c.from('ministry_roster')
    .select('id,ministry_id,display_name,music_roles,preferred_instrument,cloud_role,user_id,legacy_key,last_seen_at')
    .eq('ministry_id',ministryId)
    .eq('user_id',user.id)
    .maybeSingle();
  if(error)throw error;
  return data||null;
}

async function addRosterMember({ministryId,displayName,musicRoles=[],preferredInstrument='none',cloudRole='member',legacyKey=null}){
  const c=await client();
  const user=await window.LAGREY_AUTH.getUser();
  if(!user)throw new Error('Authentication required');
  const name=String(displayName||'').trim();
  if(!name)throw new Error('El miembro necesita un nombre');
  if(!['member','leader','admin'].includes(cloudRole))throw new Error('Rol inválido');
  const payload={
    ministry_id:ministryId,
    display_name:name,
    music_roles:[...new Set((musicRoles||[]).map(x=>String(x||'').trim()).filter(Boolean))],
    preferred_instrument:['guitar','piano','voice','all','none'].includes(preferredInstrument)?preferredInstrument:'none',
    cloud_role:cloudRole,
    user_id:null,
    legacy_key:legacyKey||null,
    created_by:user.id
  };
  const {data,error}=await c.from('ministry_roster').insert(payload).select().single();
  if(error)throw error;
  return data;
}

async function updateRosterMember(rosterId,patch={}){
  const c=await client();
  const allowed={};
  if(patch.displayName!==undefined)allowed.display_name=String(patch.displayName||'').trim();
  if(patch.musicRoles!==undefined)allowed.music_roles=[...new Set((patch.musicRoles||[]).map(x=>String(x||'').trim()).filter(Boolean))];
  if(patch.preferredInstrument!==undefined)allowed.preferred_instrument=['guitar','piano','voice','all','none'].includes(patch.preferredInstrument)?patch.preferredInstrument:'none';
  if(patch.cloudRole!==undefined&&['owner','member','leader','admin'].includes(patch.cloudRole))allowed.cloud_role=patch.cloudRole;
  if(patch.legacyKey!==undefined)allowed.legacy_key=patch.legacyKey||null;
  if(!Object.keys(allowed).length)return null;
  const {data,error}=await c.from('ministry_roster').update(allowed).eq('id',rosterId).select().single();
  if(error)throw error;
  return data;
}

async function updateRosterMemberAdmin({rosterId,displayName,musicRoles=[],preferredInstrument='none',cloudRole='member'}){
  const c=await client();
  const {data,error}=await c.rpc('update_roster_member_admin',{
    target_roster_member:rosterId,
    new_display_name:String(displayName||'').trim(),
    new_music_roles:[...new Set((musicRoles||[]).map(x=>String(x||'').trim()).filter(Boolean))],
    new_preferred_instrument:['guitar','piano','voice','all','none'].includes(preferredInstrument)?preferredInstrument:'none',
    new_cloud_role:['owner','member','leader','admin'].includes(cloudRole)?cloudRole:'member'
  });
  if(error)throw error;
  window.dispatchEvent(new Event('lagrey:cloud-reboot'));
  return data;
}

async function revokeRosterInvites(rosterId){
  const c=await client();
  const {data,error}=await c.rpc('revoke_roster_invites',{target_roster_member:rosterId});
  if(error)throw error;
  return Number(data||0);
}

async function removeRosterMember(rosterId){
  const c=await client();
  const {error}=await c.rpc('remove_roster_member',{target_roster_member:rosterId});
  if(error)throw error;
  window.dispatchEvent(new Event('lagrey:cloud-reboot'));
}

async function createRosterInvite({rosterId,validHours=168,allowedUses=1}){
  const c=await client();
  const {data,error}=await c.rpc('create_roster_invite',{target_roster_member:rosterId,valid_hours:validHours,allowed_uses:allowedUses});
  if(error)throw error;
  return data;
}

async function touchPresence(ministryId){
  const c=await client();
  const {data,error}=await c.rpc('touch_ministry_presence',{target_ministry:ministryId});
  if(error)throw error;
  return data||null;
}

window.LAGREY_MINISTRIES={
  slugify,createMinistry,createInvite,joinWithCode,listInvites,revokeInvite,
  listRoster,getMyRosterProfile,addRosterMember,updateRosterMember,updateRosterMemberAdmin,
  revokeRosterInvites,removeRosterMember,createRosterInvite,touchPresence
};
})();
