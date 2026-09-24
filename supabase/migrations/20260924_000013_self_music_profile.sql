-- La Grey Cloud — edición propia de funciones musicales
-- Ejecutar después de 20260924_000012_event_member_assignments.sql.
begin;

create or replace function public.update_my_roster_music(
  target_ministry uuid,
  new_music_roles text[],
  new_preferred_instrument text
)
returns public.ministry_roster
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  roster public.ministry_roster%rowtype;
  clean_roles text[];
  invalid_count integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_ministry_member(target_ministry) then
    raise exception 'Not authorized';
  end if;

  if new_preferred_instrument not in ('guitar','piano','voice','bass','drums','all','none') then
    raise exception 'Invalid preferred instrument';
  end if;

  select coalesce(array_agg(distinct role_value order by role_value),'{}'::text[])
  into clean_roles
  from unnest(coalesce(new_music_roles,'{}'::text[])) role_value
  where role_value is not null and trim(role_value)<>'';

  select count(*) into invalid_count
  from unnest(clean_roles) role_value
  where role_value not in ('voice','guitar','piano','bass','drums','all');

  if invalid_count>0 then
    raise exception 'Invalid music role';
  end if;

  if 'all'=any(clean_roles) and cardinality(clean_roles)>1 then
    raise exception 'All instruments cannot be combined with individual roles';
  end if;

  select * into roster
  from public.ministry_roster
  where ministry_id=target_ministry
    and user_id=auth.uid()
  for update;

  if not found then
    raise exception 'Roster profile not found';
  end if;

  update public.ministry_roster
  set music_roles=clean_roles,
      preferred_instrument=new_preferred_instrument
  where id=roster.id
  returning * into roster;

  return roster;
end;
$$;

revoke all on function public.update_my_roster_music(uuid,text[],text) from public;
grant execute on function public.update_my_roster_music(uuid,text[],text) to authenticated;

commit;
