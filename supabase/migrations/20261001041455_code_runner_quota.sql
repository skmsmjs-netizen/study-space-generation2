-- Source and input are never stored in the rate limiter.
create table public.study_code_run_limits (
  key text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  minute_at timestamptz not null,
  minute_count integer not null default 0,
  day_at date not null,
  day_count integer not null default 0,
  job uuid,
  lease_until timestamptz
);
alter table public.study_code_run_limits enable row level security;
revoke all on public.study_code_run_limits from public, anon, authenticated, service_role;

create function public.study_reserve_code_run(p_user uuid, p_job uuid)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare t timestamptz := clock_timestamp(); m timestamptz; d date; g public.study_code_run_limits; u public.study_code_run_limits;
begin
  perform public.study_require_access(p_user, false);
  if p_job is null then raise exception 'INVALID_JOB'; end if;
  m := date_trunc('minute', t); d := (t at time zone 'UTC')::date;
  -- One lock order for all callers, including the initial insert.
  perform pg_advisory_xact_lock(hashtext('study-code-run-limits'));
  insert into public.study_code_run_limits(key, minute_at, day_at) values('global', m, d) on conflict do nothing;
  insert into public.study_code_run_limits(key, user_id, minute_at, day_at) values('user:' || p_user::text, p_user, m, d) on conflict do nothing;
  select * into g from public.study_code_run_limits where key='global' for update;
  select * into u from public.study_code_run_limits where key='user:' || p_user::text for update;
  if u.lease_until > t then raise exception 'CODE_BUSY'; end if;
  if g.minute_at <> m then g.minute_count := 0; end if;
  if u.minute_at <> m then u.minute_count := 0; end if;
  if g.day_at <> d then g.day_count := 0; end if;
  if u.day_at <> d then u.day_count := 0; end if;
  if g.minute_count >= 20 or g.day_count >= 1200 or u.minute_count >= 6 or u.day_count >= 200 then raise exception 'CODE_RATE_LIMIT'; end if;
  update public.study_code_run_limits set minute_at=m, day_at=d, minute_count=g.minute_count+1, day_count=g.day_count+1 where key='global';
  update public.study_code_run_limits set minute_at=m, day_at=d, minute_count=u.minute_count+1, day_count=u.day_count+1, job=p_job, lease_until=t+interval '40 seconds' where key='user:' || p_user::text;
end;
$$;
create function public.study_finish_code_run(p_user uuid, p_job uuid)
returns void language sql security definer set search_path = public, pg_temp as $$
  update public.study_code_run_limits set job=null, lease_until=null where user_id=p_user and job=p_job;
$$;
revoke all on function public.study_reserve_code_run(uuid,uuid), public.study_finish_code_run(uuid,uuid) from public, anon, authenticated, service_role;
grant execute on function public.study_reserve_code_run(uuid,uuid), public.study_finish_code_run(uuid,uuid) to service_role;
