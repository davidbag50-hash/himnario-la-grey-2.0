-- La Grey Cloud — corrige el search_path de las funciones de invitación
-- Necesario en proyectos Supabase donde pgcrypto está instalado en el esquema extensions.
begin;

alter function public.create_ministry_invite(uuid,public.ministry_role,integer,integer)
set search_path = pg_catalog, extensions, public;

alter function public.join_ministry_with_code(text)
set search_path = pg_catalog, extensions, public;

commit;
