-- Only the Auth-verified Edge handler may submit a validated final state.
-- Approval and workspace locks protect revocation, creation and concurrent writes.
create function public.study_commit_batch(p_user uuid, p_namespace text, p_base bigint, p_operations jsonb, p_state jsonb)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  current_row public.study_workspaces;
  operation jsonb; item jsonb; collection text; previous_payload text;
  operation_count integer; existing_count integer := 0; position integer := 0;
begin
  perform public.study_require_access(p_user);
  if p_namespace is null or p_namespace not in ('personal','test') or p_base is null or p_base < 0
     or p_state->>'userId' is distinct from p_user::text or p_state->>'namespace' is distinct from p_namespace
     or p_state->>'schemaVersion' is distinct from '1' or jsonb_typeof(p_operations) is distinct from 'array' then
    raise exception 'INVALID_STATE';
  end if;
  operation_count := jsonb_array_length(p_operations);
  if operation_count < 1 or operation_count > 16 then raise exception 'INVALID_BATCH'; end if;
  if (select count(distinct value->>'id') from jsonb_array_elements(p_operations)) <> operation_count then raise exception 'INVALID_OPERATION'; end if;
  foreach collection in array array['semesters','subjects','nodes','sessions','records','narratives','criteria','criteriaAssignments','memos','learningPlans','canvasLayouts','codeExamples','recallCards','recallPreferences','studyMaterials','memoryCards','memoryTests','studyBoards','conceptCatalogs','conceptEditions','conceptBatches','inkWorkspaces','revisions'] loop
    if p_state ? collection then
      if jsonb_typeof(p_state->collection) <> 'array' then raise exception 'INVALID_STATE'; end if;
      for item in select value from jsonb_array_elements(p_state->collection) loop
        if item->>'userId' is distinct from p_user::text or item->>'namespace' is distinct from p_namespace then raise exception 'OWNERSHIP'; end if;
      end loop;
    end if;
  end loop;
  perform pg_advisory_xact_lock(hashtext(p_user::text),hashtext(p_namespace));
  select * into current_row from public.study_workspaces where user_id=p_user and namespace=p_namespace for update;
  for operation in select value from jsonb_array_elements(p_operations) loop
    if jsonb_typeof(operation->'id') is distinct from 'string' or length(operation->>'id') not between 1 and 256
       or jsonb_typeof(operation->'payload') is distinct from 'string'
       or p_state->'appliedOps'->>(operation->>'id') is distinct from operation->>'payload' then raise exception 'INVALID_OPERATION'; end if;
    select payload into previous_payload from public.study_operations where user_id=p_user and namespace=p_namespace and operation_id=operation->>'id';
    if previous_payload is not null then
      if previous_payload <> operation->>'payload' then raise exception 'OP_CONFLICT'; end if;
      existing_count := existing_count + 1;
    end if;
  end loop;
  -- A lost acknowledgement never writes an old snapshot over newer edits.
  if existing_count=operation_count then return jsonb_build_object('sequence',current_row.sequence,'data',current_row.state); end if;
  if existing_count>0 or coalesce(current_row.sequence,0)<>p_base then raise exception 'VERSION_CONFLICT'; end if;
  insert into public.study_workspaces(user_id,namespace,sequence,state) values(p_user,p_namespace,p_base+operation_count,p_state)
    on conflict(user_id,namespace) do update set sequence=excluded.sequence,state=excluded.state,updated_at=now();
  for operation in select value from jsonb_array_elements(p_operations) loop
    position := position+1;
    insert into public.study_operations(user_id,namespace,operation_id,payload,sequence)
      values(p_user,p_namespace,operation->>'id',operation->>'payload',p_base+position);
  end loop;
  return jsonb_build_object('sequence',p_base+operation_count,'data',p_state);
end; $$;
revoke all on function public.study_commit_batch(uuid,text,bigint,jsonb,jsonb) from public,anon,authenticated,service_role;
grant execute on function public.study_commit_batch(uuid,text,bigint,jsonb,jsonb) to service_role;
