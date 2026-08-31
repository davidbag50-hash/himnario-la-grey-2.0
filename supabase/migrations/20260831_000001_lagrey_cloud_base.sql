-- La Grey Cloud — base v1
-- Supabase / PostgreSQL
-- Catálogo de cantos e himnos permanece empaquetado en la aplicación.
-- La nube referencia únicamente los IDs estables del catálogo.

begin;

create extension if not exists pgcrypto;

-- =========================================================
-- Tipos controlados
-- =========================================================

do $$ begin
  create type public.ministry_role as enum ('owner','admin','leader','member');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.ministry_member_status as enum ('active','invited','suspended');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.song_catalog_type as enum ('cantos','himnos');
exception when duplicate_object then null;
end $$;

-- =========================================================
-- Tablas
-- =========================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 1 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ministries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  owner_user_id uuid not null references auth.users(id) on delete restrict,
  plan text not null default 'free' check (plan in ('free','ministry','pro')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ministry_members (
  ministry_id uuid not null references public.ministries(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.ministry_role not null default 'member',
  status public.ministry_member_status not null default 'active',
  joined_at timestamptz not null default now(),
  primary key (ministry_id,user_id)
);

create table if not exists public.ministry_repertoire (
  id uuid primary key default gen_random_uuid(),
  ministry_id uuid not null references public.ministries(id) on delete cascade,
  song_id integer not null check (song_id > 0),
  song_type public.song_catalog_type not null,
  official_tone text,
  added_by uuid references auth.users(id) on delete set null,
  added_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ministry_id,song_id)
);

create table if not exists public.ministry_song_notes (
  id uuid primary key default gen_random_uuid(),
  ministry_id uuid not null references public.ministries(id) on delete cascade,
  song_id integer not null check (song_id > 0),
  body text not null default '',
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ministry_id,song_id)
);

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  preferred_instrument text check (preferred_instrument in ('guitar','piano','voice','all','none')),
  notation text check (notation in ('american','latin')),
  font_size integer check (font_size between 8 and 30),
  autoscroll_speed integer check (autoscroll_speed between 1 and 100),
  language text check (language in ('es','en')),
  updated_at timestamptz not null default now()
);

create index if not exists idx_ministry_members_user on public.ministry_members(user_id);
create index if not exists idx_ministry_repertoire_ministry on public.ministry_repertoire(ministry_id);
create index if not exists idx_ministry_repertoire_song on public.ministry_repertoire(song_id);
create index if not exists idx_ministry_song_notes_ministry on public.ministry_song_notes(ministry_id);

-- =========================================================
-- updated_at automático
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists ministries_set_updated_at on public.ministries;
create trigger ministries_set_updated_at
before update on public.ministries
for each row execute function public.set_updated_at();

drop trigger if exists ministry_repertoire_set_updated_at on public.ministry_repertoire;
create trigger ministry_repertoire_set_updated_at
before update on public.ministry_repertoire
for each row execute function public.set_updated_at();

drop trigger if exists ministry_song_notes_set_updated_at on public.ministry_song_notes;
create trigger ministry_song_notes_set_updated_at
before update on public.ministry_song_notes
for each row execute function public.set_updated_at();

drop trigger if exists user_preferences_set_updated_at on public.user_preferences;
create trigger user_preferences_set_updated_at
before update on public.user_preferences
for each row execute function public.set_updated_at();

-- =========================================================
-- Perfil automático al crear usuario de Supabase Auth
-- =========================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles(id,display_name)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'),''), split_part(coalesce(new.email,'Usuario'),'@',1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- =========================================================
-- Helpers de autorización.
-- SECURITY DEFINER evita recursión de RLS al consultar membresías.
-- =========================================================

create or replace function public.is_ministry_member(target_ministry uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.ministry_members mm
    where mm.ministry_id = target_ministry
      and mm.user_id = auth.uid()
      and mm.status = 'active'
  );
$$;

create or replace function public.has_ministry_role(target_ministry uuid, allowed_roles public.ministry_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.ministry_members mm
    where mm.ministry_id = target_ministry
      and mm.user_id = auth.uid()
      and mm.status = 'active'
      and mm.role = any(allowed_roles)
  );
$$;

revoke all on function public.is_ministry_member(uuid) from public;
revoke all on function public.has_ministry_role(uuid,public.ministry_role[]) from public;
grant execute on function public.is_ministry_member(uuid) to authenticated;
grant execute on function public.has_ministry_role(uuid,public.ministry_role[]) to authenticated;

-- Al crear un ministerio, el creador queda automáticamente como owner activo.
create or replace function public.add_ministry_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.ministry_members(ministry_id,user_id,role,status)
  values (new.id,new.owner_user_id,'owner','active')
  on conflict (ministry_id,user_id)
  do update set role='owner', status='active';
  return new;
end;
$$;

drop trigger if exists ministries_add_owner_membership on public.ministries;
create trigger ministries_add_owner_membership
after insert on public.ministries
for each row execute function public.add_ministry_owner_membership();

-- =========================================================
-- Row Level Security
-- =========================================================

alter table public.profiles enable row level security;
alter table public.ministries enable row level security;
alter table public.ministry_members enable row level security;
alter table public.ministry_repertoire enable row level security;
alter table public.ministry_song_notes enable row level security;
alter table public.user_preferences enable row level security;

-- profiles: cada usuario gestiona solamente su perfil.
drop policy if exists profiles_select_self on public.profiles;
create policy profiles_select_self on public.profiles
for select to authenticated
using (id = auth.uid());

drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self on public.profiles
for insert to authenticated
with check (id = auth.uid());

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- ministries: visibles solo para miembros activos.
drop policy if exists ministries_select_member on public.ministries;
create policy ministries_select_member on public.ministries
for select to authenticated
using (public.is_ministry_member(id));

-- Un usuario autenticado puede crear un ministerio únicamente siendo él mismo el owner.
drop policy if exists ministries_insert_owner on public.ministries;
create policy ministries_insert_owner on public.ministries
for insert to authenticated
with check (owner_user_id = auth.uid());

-- Owner/admin pueden editar; solo owner puede eliminar.
drop policy if exists ministries_update_admin on public.ministries;
create policy ministries_update_admin on public.ministries
for update to authenticated
using (public.has_ministry_role(id,array['owner','admin']::public.ministry_role[]))
with check (
  public.has_ministry_role(id,array['owner','admin']::public.ministry_role[])
  and owner_user_id = (select m.owner_user_id from public.ministries m where m.id = ministries.id)
);

drop policy if exists ministries_delete_owner on public.ministries;
create policy ministries_delete_owner on public.ministries
for delete to authenticated
using (public.has_ministry_role(id,array['owner']::public.ministry_role[]));

-- Membresías: cualquier miembro activo puede ver la lista de su ministerio.
drop policy if exists ministry_members_select_same_ministry on public.ministry_members;
create policy ministry_members_select_same_ministry on public.ministry_members
for select to authenticated
using (public.is_ministry_member(ministry_id));

-- Owner/admin administran membresías. No pueden otorgar owner desde el cliente.
drop policy if exists ministry_members_insert_admin on public.ministry_members;
create policy ministry_members_insert_admin on public.ministry_members
for insert to authenticated
with check (
  public.has_ministry_role(ministry_id,array['owner','admin']::public.ministry_role[])
  and role <> 'owner'
);

drop policy if exists ministry_members_update_admin on public.ministry_members;
create policy ministry_members_update_admin on public.ministry_members
for update to authenticated
using (public.has_ministry_role(ministry_id,array['owner','admin']::public.ministry_role[]))
with check (
  public.has_ministry_role(ministry_id,array['owner','admin']::public.ministry_role[])
  and role <> 'owner'
);

drop policy if exists ministry_members_delete_admin on public.ministry_members;
create policy ministry_members_delete_admin on public.ministry_members
for delete to authenticated
using (
  public.has_ministry_role(ministry_id,array['owner','admin']::public.ministry_role[])
  and role <> 'owner'
);

-- Repertorio: todos los miembros leen; owner/admin/leader modifican.
drop policy if exists ministry_repertoire_select_member on public.ministry_repertoire;
create policy ministry_repertoire_select_member on public.ministry_repertoire
for select to authenticated
using (public.is_ministry_member(ministry_id));

drop policy if exists ministry_repertoire_insert_leader on public.ministry_repertoire;
create policy ministry_repertoire_insert_leader on public.ministry_repertoire
for insert to authenticated
with check (
  public.has_ministry_role(ministry_id,array['owner','admin','leader']::public.ministry_role[])
  and (added_by is null or added_by = auth.uid())
);

drop policy if exists ministry_repertoire_update_leader on public.ministry_repertoire;
create policy ministry_repertoire_update_leader on public.ministry_repertoire
for update to authenticated
using (public.has_ministry_role(ministry_id,array['owner','admin','leader']::public.ministry_role[]))
with check (public.has_ministry_role(ministry_id,array['owner','admin','leader']::public.ministry_role[]));

drop policy if exists ministry_repertoire_delete_leader on public.ministry_repertoire;
create policy ministry_repertoire_delete_leader on public.ministry_repertoire
for delete to authenticated
using (public.has_ministry_role(ministry_id,array['owner','admin','leader']::public.ministry_role[]));

-- Notas compartidas: todos leen; owner/admin/leader modifican.
drop policy if exists ministry_song_notes_select_member on public.ministry_song_notes;
create policy ministry_song_notes_select_member on public.ministry_song_notes
for select to authenticated
using (public.is_ministry_member(ministry_id));

drop policy if exists ministry_song_notes_insert_leader on public.ministry_song_notes;
create policy ministry_song_notes_insert_leader on public.ministry_song_notes
for insert to authenticated
with check (
  public.has_ministry_role(ministry_id,array['owner','admin','leader']::public.ministry_role[])
  and (updated_by is null or updated_by = auth.uid())
);

drop policy if exists ministry_song_notes_update_leader on public.ministry_song_notes;
create policy ministry_song_notes_update_leader on public.ministry_song_notes
for update to authenticated
using (public.has_ministry_role(ministry_id,array['owner','admin','leader']::public.ministry_role[]))
with check (public.has_ministry_role(ministry_id,array['owner','admin','leader']::public.ministry_role[]));

drop policy if exists ministry_song_notes_delete_leader on public.ministry_song_notes;
create policy ministry_song_notes_delete_leader on public.ministry_song_notes
for delete to authenticated
using (public.has_ministry_role(ministry_id,array['owner','admin','leader']::public.ministry_role[]));

-- Preferencias personales: solo el propio usuario.
drop policy if exists user_preferences_select_self on public.user_preferences;
create policy user_preferences_select_self on public.user_preferences
for select to authenticated
using (user_id = auth.uid());

drop policy if exists user_preferences_insert_self on public.user_preferences;
create policy user_preferences_insert_self on public.user_preferences
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists user_preferences_update_self on public.user_preferences;
create policy user_preferences_update_self on public.user_preferences
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists user_preferences_delete_self on public.user_preferences;
create policy user_preferences_delete_self on public.user_preferences
for delete to authenticated
using (user_id = auth.uid());

-- =========================================================
-- Grants mínimos para la API de Supabase.
-- RLS sigue siendo la barrera efectiva de acceso.
-- =========================================================

grant usage on schema public to authenticated;
grant select,insert,update on public.profiles to authenticated;
grant select,insert,update,delete on public.ministries to authenticated;
grant select,insert,update,delete on public.ministry_members to authenticated;
grant select,insert,update,delete on public.ministry_repertoire to authenticated;
grant select,insert,update,delete on public.ministry_song_notes to authenticated;
grant select,insert,update,delete on public.user_preferences to authenticated;

commit;
