-- La Grey Cloud — invitaciones seguras de ministerio v1
begin;

create table if not exists public.ministry_invites (
  id uuid primary key default gen_random_uuid(),
  ministry_id uuid not null references public.ministries(id) on delete cascade,
  code_hash text not null unique,
  role public.ministry_role not null default 'member' check (role <> 'owner'),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  max_uses integer check (max_uses is null or max_uses > 0),
  use_count integer not null default 0 check (use_count >= 0),
  revoked_at timestamptz
);

create index if not exists idx_ministry_invites_ministry on public.ministry_invites(ministry_id);

alter table public.ministry_invites enable row level security;

-- Solo owner/admin pueden inspeccionar invitaciones de su ministerio.
drop policy if exists ministry_invites_select_admin on public.ministry_invites;
create policy ministry_invites_select_admin on public.ministry_invites
for select to authenticated
using (public.has_ministry_role(ministry_id,array['owner','admin']::public.ministry_role[]));

-- No se permite INSERT/UPDATE/DELETE directo desde cliente.
-- Todo pasa por RPC SECURITY DEFINER para no exponer hashes ni permitir cambios arbitrarios.
revoke all on public.ministry_invites from anon;
grant select on public.ministry_invites to authenticated;

create or replace function public.create_ministry_invite(
  target_ministry uuid,
  invite_role public.ministry_role default 'member',
  valid_hours integer default 168,
  allowed_uses integer default 1
)
returns text
language plpgsql
security definer
set search_path = public, extensions, pg_catalog
as $$
declare
  raw_code text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if not public.has_ministry_role(target_ministry,array['owner','admin']::public.ministry_role[]) then
    raise exception 'Not authorized';
  end if;
  if invite_role='owner' then raise exception 'Owner role cannot be invited'; end if;
  if valid_hours is not null and (valid_hours < 1 or valid_hours > 8760) then raise exception 'Invalid validity'; end if;
  if allowed_uses is not null and (allowed_uses < 1 or allowed_uses > 500) then raise exception 'Invalid use limit'; end if;

  raw_code := upper(substr(encode(gen_random_bytes(18),'hex'),1,24));
  insert into public.ministry_invites(ministry_id,code_hash,role,created_by,expires_at,max_uses)
  values(target_ministry,encode(digest(raw_code,'sha256'),'hex'),invite_role,auth.uid(),case when valid_hours is null then null else now()+make_interval(hours=>valid_hours) end,allowed_uses);
  return raw_code;
end;
$$;

create or replace function public.join_ministry_with_code(raw_code text)
returns uuid
language plpgsql
security definer
set search_path = public, extensions, pg_catalog
as $$
declare
  inv public.ministry_invites%rowtype;
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

  insert into public.ministry_members(ministry_id,user_id,role,status)
  values(inv.ministry_id,auth.uid(),inv.role,'active')
  on conflict(ministry_id,user_id)
  do update set status='active', role=case when ministry_members.role='owner' then 'owner'::public.ministry_role else excluded.role end;

  update public.ministry_invites set use_count=use_count+1 where id=inv.id;
  return inv.ministry_id;
end;
$$;

create or replace function public.revoke_ministry_invite(invite_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare target uuid;
begin
  select ministry_id into target from public.ministry_invites where id=invite_id;
  if target is null then raise exception 'Invite not found'; end if;
  if not public.has_ministry_role(target,array['owner','admin']::public.ministry_role[]) then raise exception 'Not authorized'; end if;
  update public.ministry_invites set revoked_at=now() where id=invite_id;
end;
$$;

revoke all on function public.create_ministry_invite(uuid,public.ministry_role,integer,integer) from public;
revoke all on function public.join_ministry_with_code(text) from public;
revoke all on function public.revoke_ministry_invite(uuid) from public;
grant execute on function public.create_ministry_invite(uuid,public.ministry_role,integer,integer) to authenticated;
grant execute on function public.join_ministry_with_code(text) to authenticated;
grant execute on function public.revoke_ministry_invite(uuid) to authenticated;

commit;
