-- Add AI material ownership metadata without rewriting saved workspaces or the approval wrapper.
CREATE OR REPLACE FUNCTION public.study_commit_internal(p_user uuid, p_namespace text, p_base bigint, p_operation text, p_payload text, p_state jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare current_row public.study_workspaces; previous_payload text; item jsonb; collection text;
begin
  if p_namespace not in ('personal', 'test') or p_state->>'userId' is distinct from p_user::text or p_state->>'namespace' is distinct from p_namespace or p_state->>'schemaVersion' is distinct from '1' or p_base < 0 or length(p_operation) not between 1 and 256 or p_payload is null then
    raise exception 'INVALID_STATE';
  end if;
  foreach collection in array array['semesters','subjects','nodes','sessions','records','narratives','criteria','criteriaAssignments','memos','learningPlans','canvasLayouts','codeExamples','recallCards','recallPreferences','studyMaterials','memoryCards','memoryTests','studyBoards','revisions'] loop
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
$function$;

-- Keep the internal function inaccessible through public API roles.
revoke all on function public.study_commit_internal(uuid,text,bigint,text,text,jsonb) from public, anon, authenticated, service_role;

-- A durable daily reservation bounds paid provider use across function instances.
create table public.study_ai_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  requests integer not null check (requests between 1 and 20),
  primary key(user_id, day)
);
alter table public.study_ai_usage enable row level security;
revoke all on public.study_ai_usage from public, anon, authenticated;
create function public.study_reserve_ai_use(p_user uuid) returns boolean
language plpgsql security invoker set search_path=public,pg_temp as $$
declare reserved integer;
begin
  if (public.study_account_access(p_user)->>'status') is distinct from 'approved' then raise exception 'ACCESS_DENIED'; end if;
  insert into public.study_ai_usage(user_id,day,requests) values(p_user,(now() at time zone 'Asia/Seoul')::date,1)
  on conflict(user_id,day) do update set requests=study_ai_usage.requests+1 where study_ai_usage.requests<20
  returning requests into reserved;
  return reserved is not null;
end;
$$;
revoke all on function public.study_reserve_ai_use(uuid) from public, anon, authenticated;
grant select, insert, update on public.study_ai_usage to service_role;
grant execute on function public.study_reserve_ai_use(uuid) to service_role;
