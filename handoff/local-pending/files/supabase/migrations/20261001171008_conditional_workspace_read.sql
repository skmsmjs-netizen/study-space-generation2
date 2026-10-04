-- Additive read path. Existing storage, writes and the legacy RPC stay intact.
-- The verified Edge handler supplies p_user; browser roles cannot call this RPC.
create function public.study_read_workspace_conditional(
  p_user uuid,
  p_namespace text,
  p_known_sequence bigint
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare result jsonb;
begin
  -- Hold the existing approval row lock until this transaction completes.
  perform public.study_require_access(p_user);
  if p_namespace is null or p_namespace not in ('personal', 'test') then
    raise exception 'WRONG_NAMESPACE';
  end if;
  if p_known_sequence is null or p_known_sequence < 0 or p_known_sequence > 9007199254740991 then
    raise exception 'INVALID_VERSION';
  end if;

  -- One statement observes the version and payload from the same row snapshot.
  -- CASE does not evaluate the state branch for unchanged rows, avoiding the
  -- large JSONB payload's detoast/serialization and DB-to-Edge transmission.
  select case when w.sequence = p_known_sequence then
    pg_catalog.jsonb_build_object('unchanged', true, 'sequence', w.sequence,
      'userId', w.user_id::text, 'namespace', w.namespace)
  else
    pg_catalog.jsonb_build_object('sequence', w.sequence, 'state', w.state)
  end into result
  from public.study_workspaces w
  where w.user_id = p_user and w.namespace = p_namespace;
  -- Missing workspaces remain null: the handler supplies the validated empty state.
  return result;
end;
$$;

revoke all on function public.study_read_workspace_conditional(uuid,text,bigint)
  from public, anon, authenticated, service_role;
grant execute on function public.study_read_workspace_conditional(uuid,text,bigint)
  to service_role;
