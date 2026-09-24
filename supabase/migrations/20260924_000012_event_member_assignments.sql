-- La Grey Cloud — asignaciones estructuradas de integrantes por evento
-- Ejecutar después de 20260924_000011_user_song_notes.sql.
begin;

create table if not exists public.ministry_event_assignments (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.ministry_events(id) on delete cascade,
  roster_member_id uuid references public.ministry_roster(id) on delete set null,
  display_name text not null check (char_length(trim(display_name)) between 1 and 120),
  music_role text not null check (music_role in ('voice','guitar','piano','bass','drums')),
  position integer not null check (position > 0),
  created_at timestamptz not null default now(),
  unique (event_id,position)
);

create index if not exists idx_ministry_event_assignments_event
  on public.ministry_event_assignments(event_id,position);
create index if not exists idx_ministry_event_assignments_roster
  on public.ministry_event_assignments(roster_member_id);

alter table public.ministry_event_assignments enable row level security;

drop policy if exists ministry_event_assignments_select_member on public.ministry_event_assignments;
create policy ministry_event_assignments_select_member on public.ministry_event_assignments
for select to authenticated
using (
  exists (
    select 1
    from public.ministry_events e
    where e.id=ministry_event_assignments.event_id
      and public.is_ministry_member(e.ministry_id)
  )
);

revoke all on public.ministry_event_assignments from anon, authenticated;
grant select on public.ministry_event_assignments to authenticated;

create or replace function public.set_ministry_event_assignments(
  target_event uuid,
  new_assignments jsonb default '[]'::jsonb
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target_ministry uuid;
  item jsonb;
  item_position integer := 0;
  member public.ministry_roster%rowtype;
  role_value text;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select ministry_id into target_ministry
  from public.ministry_events
  where id=target_event
  for update;

  if target_ministry is null then
    raise exception 'Event not found';
  end if;

  if not public.has_ministry_role(target_ministry,array['owner','admin','leader']::public.ministry_role[]) then
    raise exception 'Not authorized';
  end if;

  if jsonb_typeof(coalesce(new_assignments,'[]'::jsonb)) <> 'array' then
    raise exception 'Invalid assignments';
  end if;

  delete from public.ministry_event_assignments
  where event_id=target_event;

  for item in select value from jsonb_array_elements(coalesce(new_assignments,'[]'::jsonb))
  loop
    item_position := item_position + 1;
    role_value := trim(coalesce(item->>'musicRole',''));

    if role_value not in ('voice','guitar','piano','bass','drums') then
      raise exception 'Invalid music role';
    end if;

    select * into member
    from public.ministry_roster
    where id=(item->>'rosterMemberId')::uuid
      and ministry_id=target_ministry;

    if not found then
      raise exception 'Roster member does not belong to event ministry';
    end if;

    insert into public.ministry_event_assignments(
      event_id,roster_member_id,display_name,music_role,position
    ) values (
      target_event,member.id,member.display_name,role_value,item_position
    );
  end loop;
end;
$$;

revoke all on function public.set_ministry_event_assignments(uuid,jsonb) from public;
grant execute on function public.set_ministry_event_assignments(uuid,jsonb) to authenticated;

commit;
