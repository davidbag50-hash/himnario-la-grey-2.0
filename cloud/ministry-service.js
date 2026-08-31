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
  const {data,error}=await c.from('ministry_invites').select('id,ministry_id,role,created_by,created_at,expires_at,max_uses,use_count,revoked_at').eq('ministry_id',ministryId).order('created_at',{ascending:false});
  if(error)throw error;
  return data||[];
}

async function revokeInvite(inviteId){
  const c=await client();
  const {error}=await c.rpc('revoke_ministry_invite',{invite_id:inviteId});
  if(error)throw error;
}

window.LAGREY_MINISTRIES={slugify,createMinistry,createInvite,joinWithCode,listInvites,revokeInvite};
})();
