-- La Grey Cloud — roster previo de miembros + vinculación de cuenta + presencia
-- Ejecutar después de 20260831_000004_fix_invite_pgcrypto_search_path.sql.
begin;

create table if not exists public.ministry_roster (
  id uuid primary key default gen_random_uuid(),
  ministry_id uuid not null references public.ministries(id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 1 and 120),
  music_roles text[] not null default '{}'::text[],
  preferred_instrument text not null default 'none' check (preferred_instrument in ('guitar','piano','voice','all','none')),
  cloud_role public.ministry_role not null default 'member',
  user_id uuid references auth.users(id) on delete set null,
  legacy_key text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz
);

create index if not exists idx_ministry_roster_ministry on public.ministry_roster(ministry_id);
create unique index if not exists uq_ministry_roster_user
  on public.ministry_roster(ministry_id,user_id)
  where user_id is not null;
create unique index if not exists uq_ministry_roster_legacy_key
  on public.ministry_roster(ministry_id,legacy_key)
  where legacy_key is not null;

drop trigger if exists ministry_roster_set_updated_at on public.ministry_roster;
create trigger ministry_roster_set_updated_at
before update on public.ministry_roster
for each row execute function public.set_updated_at();

-- La ficha del propietario puede editar sus datos musicales, pero no puede
-- convertirse en otra persona ni puede crearse un segundo owner desde el roster.
create or replace function public.protect_ministry_roster_owner()
returns trigger
language plpgsql
set search_path = public
as $$
declare actual_owner uuid;
begin
  select owner_user_id into actual_owner
  from public.ministries
  where id=new.ministry_id;

  if new.cloud_role='owner' and new.user_id is distinct from actual_owner then
    raise exception 'Only the ministry owner can have owner roster role';
  end if;

  if tg_op='UPDATE' and old.cloud_role='owner' then
    if new.cloud_role<>'owner' or new.user_id is distinct from old.user_id or new.ministry_id is distinct from old.ministry_id then
      raise exception 'Owner roster identity cannot be changed';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists ministry_roster_protect_owner on public.ministry_roster;
create trigger ministry_roster_protect_owner
before insert or update on public.ministry_roster
for each row execute function public.protect_ministry_roster_owner();

-- Convierte las membresías que ya existen en fichas del roster.
insert into public.ministry_roster(
  ministry_id,display_name,cloud_role,user_id,created_by
)
select
  mm.ministry_id,
  coalesce(nullif(trim(p.display_name),''),'Miembro'),
  mm.role,
  mm.user_id,
  null
from public.ministry_members mm
left join public.profiles p on p.id=mm.user_id
where mm.status='active'
on conflict (ministry_id,user_id) where user_id is not null
do update set
  cloud_role=excluded.cloud_role,
  display_name=case
    when trim(public.ministry_roster.display_name)='' then excluded.display_name
    else public.ministry_roster.display_name
  end;

alter table public.ministry_roster enable row level security;

-- Todo miembro activo puede ver quién pertenece o está pendiente en su agrupación.
drop policy if exists ministry_roster_select_member on public.ministry_roster;
create policy ministry_roster_select_member on public.ministry_roster
for select to authenticated
using (public.is_ministry_member(ministry_id));

-- Owner/admin pueden crear fichas pendientes. No pueden crear un owner ni enlazar
-- arbitrariamente la ficha a un usuario; la vinculación ocurre mediante el código.
drop policy if exists ministry_roster_insert_admin on public.ministry_roster;
create policy ministry_roster_insert_admin on public.ministry_roster
for insert to authenticated
with check (
  public.has_ministry_role(ministry_id,array['owner','admin']::public.ministry_role[])
  and cloud_role <> 'owner'
  and user_id is null
);

-- Owner puede editar cualquier ficha; admin no puede tocar la del propietario.
drop policy if exists ministry_roster_update_admin on public.ministry_roster;
create policy ministry_roster_update_admin on public.ministry_roster
for update to authenticated
using (
  public.has_ministry_role(ministry_id,array['owner']::public.ministry_role[])
  or (
    public.has_ministry_role(ministry_id,array['admin']::public.ministry_role[])
    and cloud_role <> 'owner'
  )
)
with check (
  public.has_ministry_role(ministry_id,array['owner']::public.ministry_role[])
  or (
    public.has_ministry_role(ministry_id,array['admin']::public.ministry_role[])
    and cloud_role <> 'owner'
  )
);

-- La ficha owner no se elimina desde cliente.
drop policy if exists ministry_roster_delete_admin on public.ministry_roster;
create policy ministry_roster_delete_admin on public.ministry_roster
for delete to authenticated
using (
  cloud_role <> 'owner'
  and public.has_ministry_role(ministry_id,array['owner','admin']::public.ministry_role[])
);

grant select,insert,update,delete on public.ministry_roster to authenticated;

-- Una invitación puede apuntar a una ficha concreta del roster.
alter table public.ministry_invites
add column if not exists roster_member_id uuid references public.ministry_roster(id) on delete set null;

create index if not exists idx_ministry_invites_roster_member
  on public.ministry_invites(roster_member_id);

-- Genera una invitación para una persona ya creada en Miembros.
create or replace function public.create_roster_invite(
  target_roster_member uuid,
  valid_hours integer default 168,
  allowed_uses integer default 1
)
returns text
language plpgsql
security definer
set search_path = pg_catalog, extensions, public
as $$
declare
  roster public.ministry_roster%rowtype;
  raw_code text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;

  select * into roster
  from public.ministry_roster
  where id=target_roster_member
  for update;

  if not found then raise exception 'Roster member not found'; end if;
  if not public.has_ministry_role(roster.ministry_id,array['owner','admin']::public.ministry_role[]) then
    raise exception 'Not authorized';
  end if;
  if roster.cloud_role='owner' then raise exception 'Owner does not need an invite'; end if;
  if roster.user_id is not null then raise exception 'Roster member already joined'; end if;
  if valid_hours is not null and (valid_hours < 1 or valid_hours > 8760) then raise exception 'Invalid validity'; end if;
  if allowed_uses is not null and (allowed_uses < 1 or allowed_uses > 500) then raise exception 'Invalid use limit'; end if;

  -- Solo dejamos vigente el código más reciente de esa ficha.
  update public.ministry_invites
  set revoked_at=now()
  where roster_member_id=roster.id
    and revoked_at is null
    and use_count=0;

  raw_code := upper(substr(encode(gen_random_bytes(18),'hex'),1,24));
  insert into public.ministry_invites(
    ministry_id,roster_member_id,code_hash,role,created_by,expires_at,max_uses
  ) values (
    roster.ministry_id,
    roster.id,
    encode(digest(raw_code,'sha256'),'hex'),
    roster.cloud_role,
    auth.uid(),
    case when valid_hours is null then null else now()+make_interval(hours=>valid_hours) end,
    allowed_uses
  );
  return raw_code;
end;
$$;

-- Sustituye la unión por código para enlazar la cuenta con la ficha previa.
create or replace function public.join_ministry_with_code(raw_code text)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, extensions, public
as $$
declare
  inv public.ministry_invites%rowtype;
  roster public.ministry_roster%rowtype;
  profile_name text;
  normalized text := upper(trim(coalesce(raw_code,'')));
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if normalized='' then raise exception 'Invite code required'; end if;

  select * into inv
  from public.ministry_invites
  where code_hash=encode(digest(normalized,'sha256'),'hex')
  for update;

  if not found then raise exception 'Invalid invite code'; end if;
  if inv.revoked_at is not null then raise exception 'Invite revoked'; end if;
  if inv.expires_at is not null and inv.expires_at <= now() then raise exception 'Invite expired'; end if;
  if inv.max_uses is not null and inv.use_count >= inv.max_uses then raise exception 'Invite exhausted'; end if;

  if inv.roster_member_id is not null then
    select * into roster
    from public.ministry_roster
    where id=inv.roster_member_id and ministry_id=inv.ministry_id
    for update;

    if not found then raise exception 'Roster member not found'; end if;
    if roster.user_id is not null and roster.user_id<>auth.uid() then
      raise exception 'Roster profile already claimed';
    end if;
  end if;

  insert into public.ministry_members(ministry_id,user_id,role,status)
  values(inv.ministry_id,auth.uid(),inv.role,'active')
  on conflict(ministry_id,user_id)
  do update set
    status='active',
    role=case
      when ministry_members.role='owner' then 'owner'::public.ministry_role
      else excluded.role
    end;

  if inv.roster_member_id is not null then
    update public.ministry_roster
    set user_id=auth.uid(), cloud_role=inv.role, last_seen_at=now()
    where id=inv.roster_member_id;

    update public.profiles
    set display_name=roster.display_name
    where id=auth.uid();
  else
    -- Compatibilidad con códigos generales antiguos: crea la ficha si aún no existe.
    select * into roster
    from public.ministry_roster
    where ministry_id=inv.ministry_id and user_id=auth.uid()
    for update;

    if not found then
      select coalesce(nullif(trim(display_name),''),'Miembro') into profile_name
      from public.profiles where id=auth.uid();

      insert into public.ministry_roster(
        ministry_id,display_name,cloud_role,user_id,last_seen_at
      ) values (
        inv.ministry_id,coalesce(profile_name,'Miembro'),inv.role,auth.uid(),now()
      );
    else
      update public.ministry_roster
      set cloud_role=case when roster.cloud_role='owner' then 'owner'::public.ministry_role else inv.role end,
          last_seen_at=now()
      where id=roster.id;
    end if;
  end if;

  update public.ministry_invites
  set use_count=use_count+1
  where id=inv.id;

  return inv.ministry_id;
end;
$$;

-- Heartbeat ligero: solo el propio usuario actualiza su última actividad.
create or replace function public.touch_ministry_presence(target_ministry uuid)
returns timestamptz
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare touched timestamptz;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not public.is_ministry_member(target_ministry) then raise exception 'Not authorized'; end if;

  update public.ministry_roster
  set last_seen_at=now()
  where ministry_id=target_ministry and user_id=auth.uid()
  returning last_seen_at into touched;

  return touched;
end;
$$;

revoke all on function public.create_roster_invite(uuid,integer,integer) from public;
revoke all on function public.touch_ministry_presence(uuid) from public;
grant execute on function public.create_roster_invite(uuid,integer,integer) to authenticated;
grant execute on function public.touch_ministry_presence(uuid) to authenticated;

-- join_ministry_with_code ya existía, reafirmamos el permiso tras reemplazarla.
revoke all on function public.join_ministry_with_code(text) from public;
grant execute on function public.join_ministry_with_code(text) to authenticated;

commit;
