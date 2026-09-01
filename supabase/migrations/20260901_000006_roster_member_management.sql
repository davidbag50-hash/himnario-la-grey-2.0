-- La Grey Cloud — edición, revocación y eliminación segura de miembros
-- Ejecutar después de 20260901_000005_ministry_roster_presence.sql.
begin;

-- Edita la ficha musical y mantiene sincronizado el rol de acceso real.
create or replace function public.update_roster_member_admin(
  target_roster_member uuid,
  new_display_name text,
  new_music_roles text[],
  new_preferred_instrument text,
  new_cloud_role public.ministry_role
)
returns public.ministry_roster
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  roster public.ministry_roster%rowtype;
  clean_name text := trim(coalesce(new_display_name,''));
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;

  select * into roster
  from public.ministry_roster
  where id=target_roster_member
  for update;

  if not found then raise exception 'Roster member not found'; end if;
  if not public.has_ministry_role(roster.ministry_id,array['owner','admin']::public.ministry_role[]) then
    raise exception 'Not authorized';
  end if;
  if roster.cloud_role='owner' and not public.has_ministry_role(roster.ministry_id,array['owner']::public.ministry_role[]) then
    raise exception 'Only the owner can edit the owner profile';
  end if;
  if roster.cloud_role='owner' and new_cloud_role<>'owner' then
    raise exception 'Owner role cannot be changed here';
  end if;
  if roster.cloud_role<>'owner' and new_cloud_role='owner' then
    raise exception 'Owner role cannot be assigned here';
  end if;
  if clean_name='' or char_length(clean_name)>120 then raise exception 'Invalid display name'; end if;
  if new_preferred_instrument not in ('guitar','piano','voice','all','none') then
    raise exception 'Invalid preferred instrument';
  end if;

  update public.ministry_roster
  set display_name=clean_name,
      music_roles=coalesce(new_music_roles,'{}'::text[]),
      preferred_instrument=new_preferred_instrument,
      cloud_role=new_cloud_role
  where id=roster.id
  returning * into roster;

  if roster.user_id is not null then
    update public.ministry_members
    set role=case when role='owner' then 'owner'::public.ministry_role else new_cloud_role end
    where ministry_id=roster.ministry_id and user_id=roster.user_id;

    update public.profiles
    set display_name=clean_name
    where id=roster.user_id;
  end if;

  return roster;
end;
$$;

-- Revoca todas las invitaciones todavía utilizables ligadas a una ficha.
create or replace function public.revoke_roster_invites(target_roster_member uuid)
returns integer
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  roster public.ministry_roster%rowtype;
  affected integer;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select * into roster from public.ministry_roster where id=target_roster_member;
  if not found then raise exception 'Roster member not found'; end if;
  if not public.has_ministry_role(roster.ministry_id,array['owner','admin']::public.ministry_role[]) then
    raise exception 'Not authorized';
  end if;
  if roster.cloud_role='owner' then raise exception 'Owner does not use roster invites'; end if;

  update public.ministry_invites
  set revoked_at=now()
  where roster_member_id=roster.id
    and revoked_at is null
    and (max_uses is null or use_count < max_uses);
  get diagnostics affected = row_count;
  return affected;
end;
$$;

-- Quita a una persona del ministerio. No elimina su usuario de Supabase/Auth.
create or replace function public.remove_roster_member(target_roster_member uuid)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  roster public.ministry_roster%rowtype;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;

  select * into roster
  from public.ministry_roster
  where id=target_roster_member
  for update;

  if not found then raise exception 'Roster member not found'; end if;
  if not public.has_ministry_role(roster.ministry_id,array['owner','admin']::public.ministry_role[]) then
    raise exception 'Not authorized';
  end if;
  if roster.cloud_role='owner' then raise exception 'The ministry owner cannot be removed'; end if;

  update public.ministry_invites
  set revoked_at=now()
  where roster_member_id=roster.id and revoked_at is null;

  if roster.user_id is not null then
    delete from public.ministry_members
    where ministry_id=roster.ministry_id and user_id=roster.user_id and role<>'owner';
  end if;

  delete from public.ministry_roster where id=roster.id and cloud_role<>'owner';
end;
$$;

revoke all on function public.update_roster_member_admin(uuid,text,text[],text,public.ministry_role) from public;
revoke all on function public.revoke_roster_invites(uuid) from public;
revoke all on function public.remove_roster_member(uuid) from public;
grant execute on function public.update_roster_member_admin(uuid,text,text[],text,public.ministry_role) to authenticated;
grant execute on function public.revoke_roster_invites(uuid) to authenticated;
grant execute on function public.remove_roster_member(uuid) to authenticated;

commit;
