-- Only authenticated self-withdrawal through study-command may start this job.
-- Objects are removed through the Storage API, never by deleting its SQL metadata.
create table public.study_account_withdrawals (
  user_id uuid primary key references auth.users(id) on delete cascade,
  request_id uuid not null unique,
  started_at timestamptz not null default now()
);
-- Receipt contains no account identifier or study content. The random UUID is
-- a capability held by the initiating browser, including after Auth deletion.
create table public.study_withdrawal_receipts (
  request_id uuid primary key,
  completed_at timestamptz not null default now()
);
alter table public.study_account_withdrawals enable row level security;
alter table public.study_withdrawal_receipts enable row level security;
revoke all on public.study_account_withdrawals, public.study_withdrawal_receipts from public,anon,authenticated,service_role;

create function public.study_begin_withdrawal(p_user uuid, p_request uuid) returns jsonb
language plpgsql security definer set search_path='' as $$
declare v_request uuid;
begin
  if p_request is null then raise exception 'INVALID_REQUEST'; end if;
  lock table public.study_administrators in share row exclusive mode;
  if not exists(select 1 from auth.users where id=p_user) then raise exception 'AUTH_REQUIRED'; end if;
  if exists(select 1 from public.study_administrators where user_id=p_user)
    and not exists(select 1 from public.study_administrators a where a.user_id<>p_user
      and not exists(select 1 from public.study_account_withdrawals w where w.user_id=a.user_id))
    then raise exception 'LAST_ADMIN'; end if;
  perform 1 from public.study_account_permissions where user_id=p_user for update;
  insert into public.study_account_withdrawals(user_id,request_id) values(p_user,p_request) on conflict(user_id) do nothing;
  select request_id into v_request from public.study_account_withdrawals where user_id=p_user;
  -- Every existing API and Storage predicate already checks this permission.
  -- Keep it suspended on retries, including an intervening approval decision.
  update public.study_account_permissions set status='suspended',version=version+1,updated_at=now()
    where user_id=p_user and status<>'suspended';
  return jsonb_build_object('requestId',v_request);
end; $$;

create function public.study_withdraw_storage_batch(p_user uuid) returns jsonb
language plpgsql security definer set search_path='' as $$
begin
  if not exists(select 1 from public.study_account_withdrawals where user_id=p_user) then raise exception 'INVALID_REQUEST'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object('bucket',bucket_id,'name',name)) from (
    select bucket_id,name from storage.objects
    where owner_id=p_user::text or owner=p_user
      or (bucket_id='study-material-originals' and split_part(name,'/',1)=p_user::text
          and owner is null and coalesce(owner_id,'')='')
    order by bucket_id,name limit 50
  ) objects),'[]'::jsonb);
end; $$;

create or replace function public.study_withdraw_account(p_user uuid) returns void
language plpgsql security definer set search_path='' as $$
declare v_request uuid;
begin
  lock table public.study_administrators in share row exclusive mode;
  if exists(select 1 from public.study_administrators where user_id=p_user)
    and not exists(select 1 from public.study_administrators a where a.user_id<>p_user
      and not exists(select 1 from public.study_account_withdrawals w where w.user_id=a.user_id))
    then raise exception 'LAST_ADMIN'; end if;
  perform 1 from public.study_account_permissions where user_id=p_user for update;
  select request_id into v_request from public.study_account_withdrawals where user_id=p_user for update;
  if v_request is null then raise exception 'INVALID_REQUEST'; end if;
  if jsonb_array_length(public.study_withdraw_storage_batch(p_user))>0 then raise exception 'WITHDRAWAL_PENDING'; end if;
  insert into public.study_withdrawal_receipts(request_id) values(v_request) on conflict do nothing;
  delete from auth.users where id=p_user;
  if not found then raise exception 'AUTH_REQUIRED'; end if;
end; $$;

create function public.study_withdrawal_status(p_request uuid) returns jsonb
language sql stable security definer set search_path='' as $$
  select jsonb_build_object('withdrawn',exists(select 1 from public.study_withdrawal_receipts where request_id=p_request));
$$;

-- Refuse any reopening while deletion is in progress, even if an administrator
-- tries to approve the account between two batches.
create or replace function public.study_require_access(p_user uuid,p_admin boolean default false) returns void
language plpgsql security definer set search_path='' as $$
declare permission public.study_account_permissions;
begin
  select * into permission from public.study_account_permissions where user_id=p_user for share;
  if permission.status is distinct from 'approved'
    or exists(select 1 from public.study_account_withdrawals where user_id=p_user) then raise exception 'ACCESS_DENIED'; end if;
  if p_admin and not exists(select 1 from public.study_administrators where user_id=p_user) then raise exception 'ADMIN_REQUIRED'; end if;
end; $$;
create or replace function public.study_current_account_approved() returns boolean
language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.study_account_permissions where user_id=(select auth.uid()) and status='approved')
    and not exists(select 1 from public.study_account_withdrawals where user_id=(select auth.uid()));
$$;
create or replace function public.study_account_access(p_user uuid) returns jsonb
language sql stable security definer set search_path='' as $$
  select jsonb_build_object('status',case when exists(select 1 from public.study_account_withdrawals where user_id=p_user) then 'suspended' else coalesce((select status from public.study_account_permissions where user_id=p_user),'pending') end,
    'administrator',exists(select 1 from public.study_administrators where user_id=p_user),
    'displayName',(select display_name from public.study_account_profiles where user_id=p_user),
    'withdrawalPending',exists(select 1 from public.study_account_withdrawals where user_id=p_user));
$$;
-- Storage insert policies run inside their transaction; serialize with begin.
create or replace function public.study_material_original_access(p_name text,p_insert boolean default false) returns boolean
language plpgsql security definer set search_path='' as $$
declare v_user uuid:=auth.uid();v_session text:=auth.jwt()->>'session_id';v_status text;
begin
  if v_user is null or p_name !~ ('^'||v_user::text||'/(personal|test)/(audio|document)/[a-f0-9]{64}$') then return false; end if;
  select status into v_status from public.study_account_permissions where user_id=v_user for share;
  if v_status is distinct from 'approved' or exists(select 1 from public.study_account_withdrawals where user_id=v_user) then return false; end if;
  if v_session is null or not exists(select 1 from auth.sessions where id::text=v_session and user_id=v_user) then return false; end if;
  if p_insert then
    perform pg_advisory_xact_lock(hashtext('study-material-originals'));
    if (select coalesce(sum(coalesce((metadata->>'size')::bigint,52428800)),0) from storage.objects where bucket_id='study-material-originals')>471859200 then return false; end if;
  end if;
  return true;
end; $$;

revoke all on function public.study_begin_withdrawal(uuid,uuid),public.study_withdraw_storage_batch(uuid),public.study_withdrawal_status(uuid),public.study_withdraw_account(uuid) from public,anon,authenticated,service_role;
grant execute on function public.study_begin_withdrawal(uuid,uuid),public.study_withdraw_storage_batch(uuid),public.study_withdrawal_status(uuid),public.study_withdraw_account(uuid) to service_role;
-- Preserve prior service-only/owner RPC permissions on replaced functions.
revoke all on function public.study_account_access(uuid),public.study_require_access(uuid,boolean) from public,anon,authenticated,service_role;
grant execute on function public.study_account_access(uuid) to service_role;
revoke all on function public.study_current_account_approved(),public.study_material_original_access(text,boolean) from public,anon;
grant execute on function public.study_current_account_approved(),public.study_material_original_access(text,boolean) to authenticated;
