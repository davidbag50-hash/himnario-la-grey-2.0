-- La Grey Cloud — objetivos personales de aprendizaje
-- Ejecutar después de 20260924_000015_user_practice_sessions.sql.
begin;

create table if not exists public.user_learning_goals (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 180),
  target_type text not null default 'general'
    check (target_type in ('general','track','song','event','technique')),
  target_id text,
  due_date date,
  status text not null default 'active'
    check (status in ('active','completed','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_user_learning_goals_user_status
  on public.user_learning_goals(user_id,status,updated_at desc);

drop trigger if exists user_learning_goals_set_updated_at on public.user_learning_goals;
create trigger user_learning_goals_set_updated_at
before update on public.user_learning_goals
for each row execute function public.set_updated_at();

alter table public.user_learning_goals enable row level security;

drop policy if exists user_learning_goals_select_own on public.user_learning_goals;
create policy user_learning_goals_select_own on public.user_learning_goals
for select to authenticated
using (user_id=auth.uid());

drop policy if exists user_learning_goals_insert_own on public.user_learning_goals;
create policy user_learning_goals_insert_own on public.user_learning_goals
for insert to authenticated
with check (user_id=auth.uid());

drop policy if exists user_learning_goals_update_own on public.user_learning_goals;
create policy user_learning_goals_update_own on public.user_learning_goals
for update to authenticated
using (user_id=auth.uid())
with check (user_id=auth.uid());

drop policy if exists user_learning_goals_delete_own on public.user_learning_goals;
create policy user_learning_goals_delete_own on public.user_learning_goals
for delete to authenticated
using (user_id=auth.uid());

revoke all on public.user_learning_goals from anon;
grant select,insert,update,delete on public.user_learning_goals to authenticated;

commit;
