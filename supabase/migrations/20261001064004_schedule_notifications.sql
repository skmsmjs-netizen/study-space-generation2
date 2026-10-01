-- Additive notification storage. Existing workspaces, records and permissions are untouched.
create table public.study_push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique check(length(endpoint) between 1 and 4096),
  subscription jsonb not null,
  enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  last_day date,
  claim_id uuid,
  claimed_at timestamptz,
  finished_at timestamptz,
  attempts integer not null default 0,
  last_outcome text check(last_outcome in ('sent','empty','expired','retry'))
);
alter table public.study_push_subscriptions enable row level security;
revoke all on public.study_push_subscriptions from public,anon,authenticated;
grant select,insert,update,delete on public.study_push_subscriptions to service_role;
create index study_push_ready on public.study_push_subscriptions(enabled,last_day,finished_at,claimed_at);

create function public.study_save_push(p_user uuid,p_subscription jsonb) returns void
language plpgsql security invoker set search_path=public,pg_temp as $$
declare owner uuid; endpoint_value text=p_subscription->>'endpoint';
begin
  if (public.study_account_access(p_user)->>'status') is distinct from 'approved' then raise exception 'ACCESS_DENIED'; end if;
  if endpoint_value is null or length(endpoint_value)>4096 or jsonb_typeof(p_subscription->'keys') is distinct from 'object' then raise exception 'INVALID_SUBSCRIPTION'; end if;
  select user_id into owner from public.study_push_subscriptions where endpoint=endpoint_value for update;
  if owner is not null and owner<>p_user then raise exception 'PUSH_OWNER'; end if;
  if not exists(select 1 from public.study_push_subscriptions where user_id=p_user and endpoint=endpoint_value) and (select count(*) from public.study_push_subscriptions where user_id=p_user and enabled)>=20 then raise exception 'PUSH_DEVICE_LIMIT'; end if;
  insert into public.study_push_subscriptions(user_id,endpoint,subscription) values(p_user,endpoint_value,p_subscription)
  on conflict(endpoint) do update set subscription=excluded.subscription,enabled=true,updated_at=now()
    where study_push_subscriptions.user_id=p_user;
  if not found then raise exception 'PUSH_OWNER'; end if;
end; $$;

create function public.study_remove_push(p_user uuid,p_endpoint text) returns void
language sql security invoker set search_path=public,pg_temp as $$
  update public.study_push_subscriptions set enabled=false,updated_at=now() where user_id=p_user and endpoint=p_endpoint;
$$;
create function public.study_push_status(p_user uuid,p_endpoint text) returns boolean
language sql stable security invoker set search_path=public,pg_temp as $$
  select exists(select 1 from public.study_push_subscriptions where user_id=p_user and endpoint=p_endpoint and enabled);
$$;

-- UTC input; Korean 09:00 dispatch. A lease prevents overlapping cron calls from claiming a device twice.
create function public.study_claim_push(p_at timestamptz) returns jsonb
language plpgsql security invoker set search_path=public,pg_temp as $$
declare day_value date=(p_at at time zone 'Asia/Seoul')::date; result jsonb;
begin
  if extract(hour from p_at at time zone 'Asia/Seoul')<>9 then return '[]'::jsonb; end if;
  with ready as (
    select s.id from public.study_push_subscriptions s
    join public.study_account_permissions a on a.user_id=s.user_id and a.status='approved'
    where s.enabled and (s.last_day is distinct from day_value or s.finished_at is null and s.attempts<12 and (s.claimed_at is null or s.claimed_at<p_at-interval '3 minutes'))
    order by s.claimed_at nulls first,s.id for update of s skip locked limit 10
  ), claimed as (
    update public.study_push_subscriptions s set last_day=day_value,claim_id=gen_random_uuid(),claimed_at=p_at,finished_at=null,
      attempts=case when s.last_day=day_value then s.attempts+1 else 1 end
    from ready where s.id=ready.id
    returning s.id,s.user_id,s.subscription,s.claim_id
  ) select coalesce(jsonb_agg(jsonb_build_object('id',id,'userId',user_id,'subscription',subscription,'day',day_value,'claim',claim_id)),'[]'::jsonb) into result from claimed;
  return result;
end; $$;

create function public.study_finish_push(p_id uuid,p_day date,p_claim uuid,p_outcome text) returns void
language plpgsql security invoker set search_path=public,pg_temp as $$
begin
  if p_outcome not in ('sent','empty','expired','retry') then raise exception 'INVALID_OUTCOME'; end if;
  update public.study_push_subscriptions set last_outcome=p_outcome,finished_at=case when p_outcome='retry' then null else now() end,
    enabled=case when p_outcome='expired' then false else enabled end
    where id=p_id and last_day=p_day and claim_id=p_claim;
end; $$;

revoke all on function public.study_save_push(uuid,jsonb),public.study_remove_push(uuid,text),public.study_push_status(uuid,text),public.study_claim_push(timestamptz),public.study_finish_push(uuid,date,uuid,text) from public,anon,authenticated;
grant execute on function public.study_save_push(uuid,jsonb),public.study_remove_push(uuid,text),public.study_push_status(uuid,text),public.study_claim_push(timestamptz),public.study_finish_push(uuid,date,uuid,text) to service_role;
