-- La Grey Cloud — ampliar instrumento/función preferida a Bajo y Batería
-- Ejecutar después de 20260924_000009_learning_progress.sql.
begin;

alter table public.ministry_roster
  drop constraint if exists ministry_roster_preferred_instrument_check;
alter table public.ministry_roster
  add constraint ministry_roster_preferred_instrument_check
  check (preferred_instrument in ('guitar','piano','voice','bass','drums','all','none'));

alter table public.user_preferences
  drop constraint if exists user_preferences_preferred_instrument_check;
alter table public.user_preferences
  add constraint user_preferences_preferred_instrument_check
  check (preferred_instrument in ('guitar','piano','voice','bass','drums','all','none'));

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
  if new_preferred_instrument not in ('guitar','piano','voice','bass','drums','all','none') then
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

commit;
