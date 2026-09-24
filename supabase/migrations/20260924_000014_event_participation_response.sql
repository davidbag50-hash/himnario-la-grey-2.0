-- La Grey Cloud — respuesta personal a participación en eventos
-- Ejecutar después de 20260924_000013_self_music_profile.sql.
begin;

create table if not exists public.ministry_event_responses (
  event_id uuid not null references public.ministry_events(id) on delete cascade,
  roster_member_id uuid not null references public.ministry_roster(id) on delete cascade,
  response_status text not null check (response_status in ('confirmed','tentative','unavailable')),
  responded_at timestamptz not null default now(),
  primary key (event_id,roster_member_id)
);

create index if not exists idx_ministry_event_responses_roster
  on public.ministry_event_responses(roster_member_id,responded_at desc);

alter table public.ministry_event_responses enable row level security;

drop policy if exists ministry_event_responses_select_member on public.ministry_event_responses;
create policy ministry_event_responses_select_member on public.ministry_event_responses
for select to authenticated
using (
  exists (
    select 1
    from public.ministry_events e
    where e.id=ministry_event_responses.event_id
      and public.is_ministry_member(e.ministry_id)
  )
);

revoke all on public.ministry_event_responses from anon, authenticated;
grant select on public.ministry_event_responses to authenticated;

create or replace function public.respond_to_ministry_event(
  target_event uuid,
  new_status text
)
returns text
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target_ministry uuid;
  my_roster uuid;
  clean_status text := trim(coalesce(new_status,''));
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if clean_status not in ('pending','confirmed','tentative','unavailable') then
    raise exception 'Invalid response status';
  end if;

  select ministry_id into target_ministry
  from public.ministry_events
  where id=target_event;

  if target_ministry is null then
    raise exception 'Event not found';
  end if;

  if not public.is_ministry_member(target_ministry) then
    raise exception 'Not authorized';
  end if;

  select id into my_roster
  from public.ministry_roster
  where ministry_id=target_ministry
    and user_id=auth.uid();

  if my_roster is null then
    raise exception 'Roster profile not found';
  end if;

  if not exists (
    select 1
    from public.ministry_event_assignments a
    where a.event_id=target_event
      and a.roster_member_id=my_roster
  ) then
    raise exception 'You are not assigned to this event';
  end if;

  if clean_status='pending' then
    delete from public.ministry_event_responses
    where event_id=target_event and roster_member_id=my_roster;
    return 'pending';
  end if;

  insert into public.ministry_event_responses(
    event_id,roster_member_id,response_status,responded_at
  ) values (
    target_event,my_roster,clean_status,now()
  )
  on conflict(event_id,roster_member_id)
  do update set
    response_status=excluded.response_status,
    responded_at=excluded.responded_at;

  return clean_status;
end;
$$;

revoke all on function public.respond_to_ministry_event(uuid,text) from public;
grant execute on function public.respond_to_ministry_event(uuid,text) to authenticated;

-- Mantiene respuestas válidas cuando líderes editan funciones del mismo integrante,
-- y elimina respuestas de personas que ya no están asignadas al evento.
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

  delete from public.ministry_event_responses response
  where response.event_id=target_event
    and not exists (
      select 1
      from public.ministry_event_assignments assignment
      where assignment.event_id=target_event
        and assignment.roster_member_id=response.roster_member_id
    );
end;
$$;

commit;
