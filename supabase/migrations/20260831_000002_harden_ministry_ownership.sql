-- La Grey Cloud — endurecimiento de propiedad y membresías
-- Debe ejecutarse después de 20260831_000001_lagrey_cloud_base.sql.

begin;

-- La propiedad de un ministerio no se cambia con un UPDATE común.
-- Si en el futuro se necesita transferir propiedad, se hará mediante una RPC
-- específica y auditada que actualice owner + membresías de forma atómica.
create or replace function public.prevent_ministry_owner_change()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.owner_user_id is distinct from old.owner_user_id then
    raise exception 'owner_user_id cannot be changed directly';
  end if;
  return new;
end;
$$;

drop trigger if exists ministries_prevent_owner_change on public.ministries;
create trigger ministries_prevent_owner_change
before update on public.ministries
for each row execute function public.prevent_ministry_owner_change();

-- Simplifica la política de edición del ministerio. El trigger anterior protege
-- owner_user_id y evita una comprobación autorreferencial sobre la misma tabla.
drop policy if exists ministries_update_admin on public.ministries;
create policy ministries_update_admin on public.ministries
for update to authenticated
using (public.has_ministry_role(id,array['owner','admin']::public.ministry_role[]))
with check (public.has_ministry_role(id,array['owner','admin']::public.ministry_role[]));

-- Un owner/admin puede administrar miembros normales, leaders y admins,
-- pero la fila con role=owner queda fuera de UPDATE/DELETE desde el cliente.
drop policy if exists ministry_members_update_admin on public.ministry_members;
create policy ministry_members_update_admin on public.ministry_members
for update to authenticated
using (
  public.has_ministry_role(ministry_id,array['owner','admin']::public.ministry_role[])
  and role <> 'owner'
)
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

commit;
