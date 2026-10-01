-- Existing accounts also require an explicit decision; no automatic administrator.
create table public.study_account_permissions (
  user_id uuid primary key references auth.users(id),
  status text not null default 'pending' check (status in ('pending','approved','rejected','suspended')),
  version bigint not null default 0 check (version >= 0),
  updated_at timestamptz not null default now()
);
create table public.study_administrators (
  user_id uuid primary key references auth.users(id), created_at timestamptz not null default now()
);
create table public.study_access_history (
  id bigint generated always as identity primary key,
  actor_id uuid not null references auth.users(id), target_id uuid not null references auth.users(id),
  previous_status text not null, status text not null, version bigint not null, at timestamptz not null default now()
);
alter table public.study_account_permissions enable row level security;
alter table public.study_administrators enable row level security;
alter table public.study_access_history enable row level security;
revoke all on public.study_account_permissions, public.study_administrators, public.study_access_history from public, anon, authenticated, service_role;
insert into public.study_account_permissions(user_id) select id from auth.users;
create function public.study_register_pending_account() returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  insert into public.study_account_permissions(user_id) values(new.id) on conflict do nothing;
  return new;
end; $$;
revoke all on function public.study_register_pending_account() from public, anon, authenticated, service_role;
create trigger study_pending_account after insert on auth.users for each row execute function public.study_register_pending_account();

create function public.study_account_access(p_user uuid) returns jsonb language sql stable security definer set search_path = public, pg_temp as $$
  select jsonb_build_object('status',coalesce((select status from public.study_account_permissions where user_id=p_user),'pending'),
    'administrator',exists(select 1 from public.study_administrators where user_id=p_user));
$$;
create function public.study_current_account_approved() returns boolean language sql stable security definer set search_path = public, pg_temp as $$
  select exists(select 1 from public.study_account_permissions where user_id=(select auth.uid()) and status='approved');
$$;
revoke all on function public.study_current_account_approved() from public, anon;
grant execute on function public.study_current_account_approved() to authenticated;
drop policy study_workspace_owner_read on public.study_workspaces;
drop policy study_operation_owner_read on public.study_operations;
create policy study_workspace_owner_read on public.study_workspaces for select to authenticated using ((select auth.uid())=user_id and (select public.study_current_account_approved()));
create policy study_operation_owner_read on public.study_operations for select to authenticated using ((select auth.uid())=user_id and (select public.study_current_account_approved()));
-- Older handlers must also fail closed: service-role reads/writes go through
-- approval-checked RPCs, never direct table access that bypasses RLS.
revoke all on public.study_workspaces,public.study_operations from service_role;

create function public.study_require_access(p_user uuid, p_admin boolean default false) returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare permission public.study_account_permissions;
begin
  -- Held for the entire transaction: revocation cannot race a read/commit.
  select * into permission from public.study_account_permissions where user_id=p_user for share;
  if permission.status is distinct from 'approved' then raise exception 'ACCESS_DENIED'; end if;
  if p_admin and not exists(select 1 from public.study_administrators where user_id=p_user) then raise exception 'ADMIN_REQUIRED'; end if;
end; $$;

-- Wrap the existing implementation, retaining all domain/version/receipt checks.
alter function public.study_commit(uuid,text,bigint,text,text,jsonb) rename to study_commit_internal;
revoke all on function public.study_commit_internal(uuid,text,bigint,text,text,jsonb) from public, anon, authenticated, service_role;
create function public.study_commit(p_user uuid,p_namespace text,p_base bigint,p_operation text,p_payload text,p_state jsonb)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
begin
  perform public.study_require_access(p_user);
  return public.study_commit_internal(p_user,p_namespace,p_base,p_operation,p_payload,p_state);
end; $$;
create function public.study_read_workspace(p_user uuid,p_namespace text) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare result jsonb;
begin
  perform public.study_require_access(p_user);
  if p_namespace not in ('personal','test') then raise exception 'WRONG_NAMESPACE'; end if;
  select jsonb_build_object('sequence',sequence,'state',state) into result from public.study_workspaces where user_id=p_user and namespace=p_namespace;
  return result;
end; $$;
create function public.study_list_accounts(p_actor uuid,p_cursor uuid default null) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare result jsonb;
begin
  perform public.study_require_access(p_actor,true);
  with page as (
    select u.id, u.email, u.created_at, u.email_confirmed_at is not null as confirmed,
      coalesce(p.status,'pending') as status,coalesce(p.version,0) as version,
      exists(select 1 from public.study_administrators a where a.user_id=u.id) as administrator
    from auth.users u left join public.study_account_permissions p on p.user_id=u.id
    where p_cursor is null or u.id>p_cursor order by u.id limit 101
  ), displayed as (select * from page order by id limit 100)
  select jsonb_build_object('accounts',coalesce((select jsonb_agg(jsonb_build_object('userId',id,'email',email,'createdAt',created_at,'emailConfirmed',confirmed,'status',status,'version',version,'administrator',administrator) order by id) from displayed),'[]'::jsonb),
    'nextCursor',case when (select count(*) from page)>100 then (select id::text from displayed order by id desc limit 1) else null end) into result;
  return result;
end; $$;
create function public.study_set_account_access(p_actor uuid,p_target uuid,p_status text,p_version bigint) returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare previous public.study_account_permissions;
begin
  perform public.study_require_access(p_actor,true);
  if p_status not in ('pending','approved','rejected','suspended') or p_version<0 then raise exception 'INVALID_REQUEST'; end if;
  if exists(select 1 from public.study_administrators where user_id=p_target) then raise exception 'ADMIN_PROTECTED'; end if;
  if not exists(select 1 from auth.users where id=p_target) then raise exception 'INVALID_REQUEST'; end if;
  if p_status='approved' and not exists(select 1 from auth.users where id=p_target and email_confirmed_at is not null) then raise exception 'EMAIL_UNCONFIRMED'; end if;
  select * into previous from public.study_account_permissions where user_id=p_target for update;
  if previous.user_id is null then raise exception 'INVALID_REQUEST'; end if;
  if previous.version<>p_version then raise exception 'ACCESS_CONFLICT'; end if;
  update public.study_account_permissions set status=p_status,version=version+1,updated_at=now() where user_id=p_target;
  insert into public.study_access_history(actor_id,target_id,previous_status,status,version) values(p_actor,p_target,previous.status,p_status,p_version+1);
end; $$;

-- Caller identity is verified by Auth /user in the Edge Function. Browsers cannot
-- invoke RPCs with a forged actor, set a role or bypass the approval wrapper.
revoke all on function public.study_account_access(uuid),public.study_require_access(uuid,boolean),public.study_commit(uuid,text,bigint,text,text,jsonb),public.study_read_workspace(uuid,text),public.study_list_accounts(uuid,uuid),public.study_set_account_access(uuid,uuid,text,bigint) from public,anon,authenticated,service_role;
grant execute on function public.study_account_access(uuid),public.study_commit(uuid,text,bigint,text,text,jsonb),public.study_read_workspace(uuid,text),public.study_list_accounts(uuid,uuid),public.study_set_account_access(uuid,uuid,text,bigint) to service_role;
