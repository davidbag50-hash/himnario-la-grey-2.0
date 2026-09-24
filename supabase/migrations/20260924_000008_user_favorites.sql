-- La Grey Cloud — favoritos personales sincronizados
-- Ejecutar después de 20260924_000007_ministry_calendar.sql.
begin;

create table if not exists public.user_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  song_id integer not null check (song_id > 0),
  song_type public.song_catalog_type not null,
  created_at timestamptz not null default now(),
  primary key (user_id,song_id)
);

create index if not exists idx_user_favorites_user_created
  on public.user_favorites(user_id,created_at);

alter table public.user_favorites enable row level security;

drop policy if exists user_favorites_select_self on public.user_favorites;
create policy user_favorites_select_self on public.user_favorites
for select to authenticated
using (user_id=auth.uid());

drop policy if exists user_favorites_insert_self on public.user_favorites;
create policy user_favorites_insert_self on public.user_favorites
for insert to authenticated
with check (user_id=auth.uid());

drop policy if exists user_favorites_delete_self on public.user_favorites;
create policy user_favorites_delete_self on public.user_favorites
for delete to authenticated
using (user_id=auth.uid());

grant select,insert,delete on public.user_favorites to authenticated;

commit;
