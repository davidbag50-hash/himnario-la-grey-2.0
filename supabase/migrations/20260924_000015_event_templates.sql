-- La Grey Cloud — plantillas compartidas de eventos
-- Ejecutar después de 20260924_000014_event_participation_response.sql.
begin;

create table if not exists public.ministry_event_templates (
  id uuid primary key default gen_random_uuid(),
  ministry_id uuid not null references public.ministries(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 120),
  event_type text not null default 'service' check (event_type in ('service','rehearsal','event')),
  title text not null default '' check (char_length(title) <= 160),
  event_time time,
  leader text not null default '' check (char_length(leader) <= 500),
  singers text not null default '' check (char_length(singers) <= 1000),
  notes text not null default '' check (char_length(notes) <= 5000),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(ministry_id,name)
);

create table if not exists public.ministry_event_template_assignments (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.ministry_event_templates(id) on delete cascade,
  roster_member_id uuid not null references public.ministry_roster(id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 1 and 120),
  music_role text not null check (music_role in ('voice','guitar','piano','bass','drums')),
  position integer not null check (position > 0),
  unique(template_id,roster_member_id,music_role),
  unique(template_id,position)
);

create index if not exists idx_ministry_event_templates_ministry
  on public.ministry_event_templates(ministry_id,name);
create index if not exists idx_ministry_event_template_assignments_template
  on public.ministry_event_template_assignments(template_id,position);

drop trigger if exists ministry_event_templates_set_updated_at on public.ministry_event_templates;
create trigger ministry_event_templates_set_updated_at
before update on public.ministry_event_templates
for each row execute function public.set_updated_at();

alter table public.ministry_event_templates enable row level security;
alter table public.ministry_event_template_assignments enable row level security;

drop policy if exists ministry_event_templates_select_member on public.ministry_event_templates;
create policy ministry_event_templates_select_member on public.ministry_event_templates
for select to authenticated
using (public.is_ministry_member(ministry_id));

drop policy if exists ministry_event_template_assignments_select_member on public.ministry_event_template_assignments;
create policy ministry_event_template_assignments_select_member on public.ministry_event_template_assignments
for select to authenticated
using (
  exists (
    select 1
    from public.ministry_event_templates t
    where t.id=ministry_event_template_assignments.template_id
      and public.is_ministry_member(t.ministry_id)
  )
);

revoke all on public.ministry_event_templates from anon, authenticated;
revoke all on public.ministry_event_template_assignments from anon, authenticated;
grant select on public.ministry_event_templates to authenticated;
grant select on public.ministry_event_template_assignments to authenticated;

create or replace function public.upsert_ministry_event_template(
  target_template uuid,
  target_ministry uuid,
  new_name text,
  new_event_type text,
  new_title text,
  new_event_time time,
  new_leader text,
  new_singers text,
  new_notes text,
  new_assignments jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  saved_template_id uuid;
  item jsonb;
  item_position integer := 0;
  member public.ministry_roster%rowtype;
  role_value text;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.has_ministry_role(target_ministry,array['owner','admin','leader']::public.ministry_role[]) then
    raise exception 'Not authorized';
  end if;

  if trim(coalesce(new_name,''))='' or char_length(trim(new_name))>120 then
    raise exception 'Invalid template name';
  end if;

  if new_event_type not in ('service','rehearsal','event') then
    raise exception 'Invalid event type';
  end if;

  if char_length(coalesce(new_title,''))>160
     or char_length(coalesce(new_leader,''))>500
     or char_length(coalesce(new_singers,''))>1000
     or char_length(coalesce(new_notes,''))>5000 then
    raise exception 'Template text too long';
  end if;

  if jsonb_typeof(coalesce(new_assignments,'[]'::jsonb)) <> 'array' then
    raise exception 'Invalid assignments';
  end if;

  if target_template is null then
    insert into public.ministry_event_templates(
      ministry_id,name,event_type,title,event_time,leader,singers,notes,created_by
    ) values (
      target_ministry,trim(new_name),new_event_type,coalesce(new_title,''),new_event_time,
      coalesce(new_leader,''),coalesce(new_singers,''),coalesce(new_notes,''),auth.uid()
    )
    returning id into saved_template_id;
  else
    select id into saved_template_id
    from public.ministry_event_templates
    where id=target_template and ministry_id=target_ministry
    for update;

    if saved_template_id is null then
      raise exception 'Template not found';
    end if;

    update public.ministry_event_templates
    set name=trim(new_name),
        event_type=new_event_type,
        title=coalesce(new_title,''),
        event_time=new_event_time,
        leader=coalesce(new_leader,''),
        singers=coalesce(new_singers,''),
        notes=coalesce(new_notes,'')
    where id=saved_template_id;
  end if;

  delete from public.ministry_event_template_assignments
  where template_id=saved_template_id;

  for item in select value from jsonb_array_elements(coalesce(new_assignments,'[]'::jsonb))
  loop
    item_position := item_position + 1;
    role_value := trim(coalesce(item->>'musicRole',''));

    if role_value not in ('voice','guitar','piano','bass','drums') then
      raise exception 'Invalid music role';
    end if;

    select * into member
    from public.ministry_roster
    where id=(item->>'rosterMemberId')::uuid
      and ministry_id=target_ministry;

    if not found then
      raise exception 'Roster member does not belong to template ministry';
    end if;

    insert into public.ministry_event_template_assignments(
      template_id,roster_member_id,display_name,music_role,position
    ) values (
      saved_template_id,member.id,member.display_name,role_value,item_position
    );
  end loop;

  return saved_template_id;
end;
$$;

create or replace function public.delete_ministry_event_template(target_template uuid)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  target_ministry uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select ministry_id into target_ministry
  from public.ministry_event_templates
  where id=target_template
  for update;

  if target_ministry is null then
    raise exception 'Template not found';
  end if;

  if not public.has_ministry_role(target_ministry,array['owner','admin','leader']::public.ministry_role[]) then
    raise exception 'Not authorized';
  end if;

  delete from public.ministry_event_templates where id=target_template;
end;
$$;

revoke all on function public.upsert_ministry_event_template(uuid,uuid,text,text,text,time,text,text,text,jsonb) from public;
revoke all on function public.delete_ministry_event_template(uuid) from public;
grant execute on function public.upsert_ministry_event_template(uuid,uuid,text,text,text,time,text,text,text,jsonb) to authenticated;
grant execute on function public.delete_ministry_event_template(uuid) to authenticated;

commit;
