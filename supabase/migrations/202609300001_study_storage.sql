-- Additive schema. Existing tables/data are never reset or imported.
create table if not exists public.study_workspaces (
  user_id uuid not null references auth.users(id),
  namespace text not null check (namespace in ('personal', 'test')),
  sequence bigint not null default 0 check (sequence >= 0),
  state jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, namespace),
  check (state->>'userId' = user_id::text and state->>'namespace' = namespace and state->>'schemaVersion' = '1')
);
create table if not exists public.study_operations (
  user_id uuid not null,
  namespace text not null,
  operation_id text not null,
  payload text not null,
  sequence bigint not null check (sequence > 0),
  created_at timestamptz not null default now(),
  primary key (user_id, namespace, operation_id),
  unique (user_id, namespace, sequence),
  foreign key (user_id, namespace) references public.study_workspaces(user_id, namespace)
);
alter table public.study_workspaces enable row level security;
alter table public.study_operations enable row level security;
create policy study_workspace_owner_read on public.study_workspaces for select to authenticated using ((select auth.uid()) = user_id);
create policy study_operation_owner_read on public.study_operations for select to authenticated using ((select auth.uid()) = user_id);
revoke all on public.study_workspaces, public.study_operations from anon, authenticated;
grant select on public.study_workspaces, public.study_operations to authenticated;
grant select, insert, update on public.study_workspaces to service_role;
grant select, insert on public.study_operations to service_role;
-- Only the verified command handler can write. No raw browser upsert is permitted.
create or replace function public.study_commit(p_user uuid, p_namespace text, p_base bigint, p_operation text, p_payload text, p_state jsonb)
returns jsonb language plpgsql security invoker set search_path = public, pg_temp as $$
declare current_row public.study_workspaces; previous_payload text; item jsonb; collection text;
begin
  if p_namespace not in ('personal', 'test') or p_state->>'userId' is distinct from p_user::text or p_state->>'namespace' is distinct from p_namespace or p_state->>'schemaVersion' is distinct from '1' or p_base < 0 or length(p_operation) not between 1 and 256 or p_payload is null then
    raise exception 'INVALID_STATE';
  end if;
  foreach collection in array array['semesters','subjects','nodes','sessions','records','narratives','criteria','criteriaAssignments','memos','revisions'] loop
    if p_state ? collection then
      if jsonb_typeof(p_state->collection) <> 'array' then raise exception 'INVALID_STATE'; end if;
      for item in select value from jsonb_array_elements(p_state->collection) loop
        if item->>'userId' is distinct from p_user::text or item->>'namespace' is distinct from p_namespace then raise exception 'OWNERSHIP'; end if;
      end loop;
    end if;
  end loop;
  -- Serializes initial creation as well as existing workspace writes.
  perform pg_advisory_xact_lock(hashtext(p_user::text), hashtext(p_namespace));
  select * into current_row from public.study_workspaces where user_id = p_user and namespace = p_namespace for update;
  select payload into previous_payload from public.study_operations where user_id = p_user and namespace = p_namespace and operation_id = p_operation;
  if previous_payload is not null then
    if previous_payload <> p_payload then raise exception 'OP_CONFLICT'; end if;
    return jsonb_build_object('sequence', current_row.sequence, 'data', current_row.state);
  end if;
  if coalesce(current_row.sequence, 0) <> p_base then raise exception 'VERSION_CONFLICT'; end if;
  if p_state->'appliedOps'->>p_operation is distinct from p_payload then raise exception 'INVALID_OPERATION'; end if;
  insert into public.study_workspaces(user_id, namespace, sequence, state) values(p_user, p_namespace, p_base + 1, p_state)
    on conflict(user_id, namespace) do update set sequence = excluded.sequence, state = excluded.state, updated_at = now();
  insert into public.study_operations(user_id, namespace, operation_id, payload, sequence) values(p_user, p_namespace, p_operation, p_payload, p_base + 1);
  return jsonb_build_object('sequence', p_base + 1, 'data', p_state);
end;
$$;
revoke all on function public.study_commit(uuid,text,bigint,text,text,jsonb) from public, anon, authenticated;
grant execute on function public.study_commit(uuid,text,bigint,text,text,jsonb) to service_role;
