-- La Grey Cloud — notas personales privadas por canción
-- Ejecutar después de 20260924_000010_preferred_music_roles.sql.
begin;

create table if not exists public.user_song_notes (
  user_id uuid not null references auth.users(id) on delete cascade,
  song_id integer not null check (song_id > 0),
  body text not null default '' check (char_length(body) <= 10000),
  updated_at timestamptz not null default now(),
  primary key (user_id,song_id)
);

create index if not exists idx_user_song_notes_user_updated
  on public.user_song_notes(user_id,updated_at desc);

drop trigger if exists user_song_notes_set_updated_at on public.user_song_notes;
create trigger user_song_notes_set_updated_at
before update on public.user_song_notes
for each row execute function public.set_updated_at();

alter table public.user_song_notes enable row level security;

drop policy if exists user_song_notes_select_self on public.user_song_notes;
create policy user_song_notes_select_self on public.user_song_notes
for select to authenticated
using (user_id=auth.uid());

drop policy if exists user_song_notes_insert_self on public.user_song_notes;
create policy user_song_notes_insert_self on public.user_song_notes
for insert to authenticated
with check (user_id=auth.uid());

drop policy if exists user_song_notes_update_self on public.user_song_notes;
create policy user_song_notes_update_self on public.user_song_notes
for update to authenticated
using (user_id=auth.uid())
with check (user_id=auth.uid());

drop policy if exists user_song_notes_delete_self on public.user_song_notes;
create policy user_song_notes_delete_self on public.user_song_notes
for delete to authenticated
using (user_id=auth.uid());

grant select,insert,update,delete on public.user_song_notes to authenticated;

commit;
