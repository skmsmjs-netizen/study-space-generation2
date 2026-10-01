-- Share the existing quotas and user lock with batch executions. No source is stored.
create function public.study_reserve_code_terminal(p_user uuid, p_job uuid)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
begin
  perform public.study_reserve_code_run(p_user, p_job);
  update public.study_code_run_limits set lease_until=clock_timestamp()+interval '180 seconds'
    where user_id=p_user and job=p_job;
end;
$$;
revoke all on function public.study_reserve_code_terminal(uuid,uuid) from public, anon, authenticated, service_role;
grant execute on function public.study_reserve_code_terminal(uuid,uuid) to service_role;
