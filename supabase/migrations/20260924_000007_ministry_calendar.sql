-- La Grey Cloud — calendario compartido, servicios, ensayos y setlists
-- Ejecutar después de 20260901_000006_roster_member_management.sql.
begin;

create table if not exists public.ministry_events (
  id uuid primary key default gen_random_uuid(),
  ministry_id uuid not null references public.ministries(id) on delete cascade,
  event_type text not null default 'service' check (event_type in ('service','rehearsal','event')),
  event_date date not null,
  event_time time,
  rehearsal_at timestamp without time zone,
  title text not null check (char_length(trim(title)) between 1 and 160),
  leader text not null default '' check (char_length(leader) <= 500),
  singers text not null default '' check (char_length(singers) <= 1000),
  notes text not null default '' check (char_length(notes) <= 5000),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ministry_event_setlist (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.ministry_events(id) on delete cascade,
  position integer not null check (position > 0),
  song_id integer not null check (song_id > 0),
  song_type public.song_catalog_type not null,
  tone text,
  created_at timestamptz not null default now(),
  unique (event_id,position)
);

create index if not exists idx_ministry_events_ministry_date
  on public.ministry_events(ministry_id,event_date,event_time);
create index if not exists idx_ministry_event_setlist_event
  on public.ministry_event_setlist(event_id,position);

drop trigger if exists ministry_events_set_updated_at on public.ministry_events;
create trigger ministry_events_set_updated_at
before update on public.ministry_events
for each row execute function public.set_updated_at();

alter table public.ministry_events enable row level security;
alter table public.ministry_event_setlist enable row level security;

drop policy if exists ministry_events_select_member on public.ministry_events;
create policy ministry_events_select_member on public.ministry_events
for select to authenticated
using (public.is_ministry_member(ministry_id));

drop policy if exists ministry_event_setlist_select_member on public.ministry_event_setlist;
create policy ministry_event_setlist_select_member on public.ministry_event_setlist
for select to authenticated
using (
  exists (
    select 1
    from public.ministry_events e
    where e.id=ministry_event_setlist.event_id
      and public.is_ministry_member(e.ministry_id)
  )
);

-- Las escrituras se realizan mediante RPC para guardar evento + setlist de forma atómica.
revoke all on public.ministry_events from anon, authenticated;
revoke all on public.ministry_event_setlist from anon, authenticated;
grant select on public.ministry_events to authenticated;
grant select on public.ministry_event_setlist to authenticated;

create or replace function public.upsert_ministry_event(
  target_event uuid,
  target_ministry uuid,
  new_event_type text,
  new_event_date date,
  new_event_time time,
  new_rehearsal_at timestamp without time zone,
  new_title text,
  new_leader text,
  new_singers text,
  new_notes text,
  new_setlist jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  saved_event_id uuid;
  item jsonb;
  item_position integer := 0;
  item_song_id integer;
  item_song_type public.song_catalog_type;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.has_ministry_role(target_ministry,array['owner','admin','leader']::public.ministry_role[]) then
    raise exception 'Not authorized';
  end if;

  if new_event_type not in ('service','rehearsal','event') then
    raise exception 'Invalid event type';
  end if;
  if new_event_date is null then
    raise exception 'Event date required';
  end if;
  if trim(coalesce(new_title,''))='' or char_length(trim(new_title))>160 then
    raise exception 'Invalid event title';
  end if;
  if char_length(coalesce(new_leader,''))>500
     or char_length(coalesce(new_singers,''))>1000
     or char_length(coalesce(new_notes,''))>5000 then
    raise exception 'Event text too long';
  end if;
  if jsonb_typeof(coalesce(new_setlist,'[]'::jsonb)) <> 'array' then
    raise exception 'Invalid setlist';
  end if;

  if target_event is null then
    insert into public.ministry_events(
      ministry_id,event_type,event_date,event_time,rehearsal_at,title,leader,singers,notes,created_by
    ) values (
      target_ministry,new_event_type,new_event_date,new_event_time,new_rehearsal_at,
      trim(new_title),coalesce(new_leader,''),coalesce(new_singers,''),coalesce(new_notes,''),auth.uid()
    )
    returning id into saved_event_id;
  else
    select id into saved_event_id
    from public.ministry_events
    where id=target_event and ministry_id=target_ministry
    for update;

    if saved_event_id is null then
      raise exception 'Event not found';
    end if;

    update public.ministry_events
    set event_type=new_event_type,
        event_date=new_event_date,
        event_time=new_event_time,
        rehearsal_at=new_rehearsal_at,
        title=trim(new_title),
        leader=coalesce(new_leader,''),
        singers=coalesce(new_singers,''),
        notes=coalesce(new_notes,'')
    where id=saved_event_id;
  end if;

  -- Evita ambigüedad con el nombre de variable en DELETE anterior.
  delete from public.ministry_event_setlist s
  where s.event_id=saved_event_id;

  for item in select value from jsonb_array_elements(coalesce(new_setlist,'[]'::jsonb))
  loop
    item_position := item_position + 1;

    if coalesce(item->>'songId','') !~ '^[0-9]+$' then
      raise exception 'Invalid song id';
    end if;
    item_song_id := (item->>'songId')::integer;
    if item_song_id <= 0 then
      raise exception 'Invalid song id';
    end if;

    begin
      item_song_type := (item->>'songType')::public.song_catalog_type;
    exception when others then
      raise exception 'Invalid song type';
    end;

    if not exists (
      select 1
      from public.ministry_repertoire r
      where r.ministry_id=target_ministry
        and r.song_id=item_song_id
    ) then
      raise exception 'Song is not in ministry repertoire';
    end if;

    insert into public.ministry_event_setlist(event_id,position,song_id,song_type,tone)
    values (
      saved_event_id,
      item_position,
      item_song_id,
      item_song_type,
      nullif(trim(coalesce(item->>'tone','')),'')
    );
  end loop;

  return saved_event_id;
end;
$$;

create or replace function public.delete_ministry_event(target_event uuid)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target_ministry uuid;
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

  delete from public.ministry_events where id=target_event;
end;
$$;

revoke all on function public.upsert_ministry_event(uuid,uuid,text,date,time,timestamp without time zone,text,text,text,text,jsonb) from public;
revoke all on function public.delete_ministry_event(uuid) from public;
grant execute on function public.upsert_ministry_event(uuid,uuid,text,date,time,timestamp without time zone,text,text,text,text,jsonb) to authenticated;
grant execute on function public.delete_ministry_event(uuid) to authenticated;

commit;
