-- La Grey Cloud — progreso de aprendizaje por curso/ruta
-- Ejecutar después de 20260924_000008_user_favorites.sql.
begin;

create table if not exists public.user_learning_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  track_id text not null check (char_length(trim(track_id)) between 1 and 100),
  item_id text not null check (char_length(trim(item_id)) between 1 and 160),
  completed_at timestamptz not null default now(),
  primary key (user_id,track_id,item_id)
);

create index if not exists idx_user_learning_progress_track
  on public.user_learning_progress(user_id,track_id,completed_at);

alter table public.user_learning_progress enable row level security;

drop policy if exists user_learning_progress_select_self on public.user_learning_progress;
create policy user_learning_progress_select_self on public.user_learning_progress
for select to authenticated
using (user_id=auth.uid());

drop policy if exists user_learning_progress_insert_self on public.user_learning_progress;
create policy user_learning_progress_insert_self on public.user_learning_progress
for insert to authenticated
with check (user_id=auth.uid());

drop policy if exists user_learning_progress_delete_self on public.user_learning_progress;
create policy user_learning_progress_delete_self on public.user_learning_progress
for delete to authenticated
using (user_id=auth.uid());

grant select,insert,delete on public.user_learning_progress to authenticated;

commit;
