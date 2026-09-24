-- La Grey Cloud — historial privado de práctica
-- Ejecutar después de 20260924_000014_event_participation_response.sql.
begin;

create table if not exists public.user_practice_sessions (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  practiced_at timestamptz not null default now(),
  duration_minutes integer check (duration_minutes is null or duration_minutes between 1 and 720),
  instrument_role text not null default 'none'
    check (instrument_role in ('voice','guitar','piano','bass','drums','all','none')),
  track_id text,
  item_id text,
  song_id bigint,
  event_id uuid references public.ministry_events(id) on delete set null,
  note text not null default '' check (char_length(note) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_practice_sessions_user_date
  on public.user_practice_sessions(user_id,practiced_at desc);

drop trigger if exists user_practice_sessions_set_updated_at on public.user_practice_sessions;
create trigger user_practice_sessions_set_updated_at
before update on public.user_practice_sessions
for each row execute function public.set_updated_at();

alter table public.user_practice_sessions enable row level security;

drop policy if exists user_practice_sessions_select_own on public.user_practice_sessions;
create policy user_practice_sessions_select_own on public.user_practice_sessions
for select to authenticated
using (user_id=auth.uid());

drop policy if exists user_practice_sessions_insert_own on public.user_practice_sessions;
create policy user_practice_sessions_insert_own on public.user_practice_sessions
for insert to authenticated
with check (user_id=auth.uid());

drop policy if exists user_practice_sessions_update_own on public.user_practice_sessions;
create policy user_practice_sessions_update_own on public.user_practice_sessions
for update to authenticated
using (user_id=auth.uid())
with check (user_id=auth.uid());

drop policy if exists user_practice_sessions_delete_own on public.user_practice_sessions;
create policy user_practice_sessions_delete_own on public.user_practice_sessions
for delete to authenticated
using (user_id=auth.uid());

revoke all on public.user_practice_sessions from anon;
grant select,insert,update,delete on public.user_practice_sessions to authenticated;

commit;
