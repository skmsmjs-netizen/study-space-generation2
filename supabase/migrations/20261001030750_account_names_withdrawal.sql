-- Names identify a person; they never confer approval or administrator privileges.
create table public.study_account_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (display_name is null or (char_length(display_name) between 1 and 80 and display_name !~ '[[:cntrl:]]')),
  updated_at timestamptz not null default now()
);
alter table public.study_account_profiles enable row level security;
revoke all on public.study_account_profiles from public,anon,authenticated,service_role;
insert into public.study_account_profiles(user_id,display_name)
select id, case when char_length(btrim(raw_user_meta_data->>'display_name')) between 1 and 80 and (raw_user_meta_data->>'display_name') !~ '[[:cntrl:]]' then btrim(raw_user_meta_data->>'display_name') else null end from auth.users;
create function public.study_register_account_profile() returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
declare name text:=btrim(new.raw_user_meta_data->>'display_name');
begin
  if name is null or char_length(name) not between 1 and 80 or name ~ '[[:cntrl:]]' then raise exception 'NAME_REQUIRED'; end if;
  insert into public.study_account_profiles(user_id,display_name) values(new.id,name);
  return new;
end; $$;
revoke all on function public.study_register_account_profile() from public,anon,authenticated,service_role;
create trigger study_account_profile after insert on auth.users for each row execute function public.study_register_account_profile();
create or replace function public.study_account_access(p_user uuid) returns jsonb language sql stable security definer set search_path=public,pg_temp as $$
  select jsonb_build_object('status',coalesce((select status from public.study_account_permissions where user_id=p_user),'pending'),
    'administrator',exists(select 1 from public.study_administrators where user_id=p_user),
    'displayName',(select display_name from public.study_account_profiles where user_id=p_user));
$$;
create function public.study_set_account_name(p_user uuid,p_name text) returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
begin
  if p_name is null or char_length(btrim(p_name)) not between 1 and 80 or p_name ~ '[[:cntrl:]]' then raise exception 'NAME_REQUIRED'; end if;
  if not exists(select 1 from auth.users where id=p_user) then raise exception 'AUTH_REQUIRED'; end if;
  insert into public.study_account_profiles(user_id,display_name) values(p_user,btrim(p_name)) on conflict(user_id) do update set display_name=excluded.display_name,updated_at=now();
  return public.study_account_access(p_user);
end; $$;
create or replace function public.study_list_accounts(p_actor uuid,p_cursor uuid default null) returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare result jsonb;
begin
  perform public.study_require_access(p_actor,true);
  with page as (
    select u.id,u.email,u.created_at,u.email_confirmed_at is not null as confirmed,n.display_name,
      coalesce(p.status,'pending') as status,coalesce(p.version,0) as version,
      exists(select 1 from public.study_administrators a where a.user_id=u.id) as administrator
    from auth.users u left join public.study_account_permissions p on p.user_id=u.id left join public.study_account_profiles n on n.user_id=u.id
    where p_cursor is null or u.id>p_cursor order by u.id limit 101
  ), displayed as (select * from page order by id limit 100)
  select jsonb_build_object('accounts',coalesce((select jsonb_agg(jsonb_build_object('userId',id,'email',email,'displayName',display_name,'createdAt',created_at,'emailConfirmed',confirmed,'status',status,'version',version,'administrator',administrator) order by id) from displayed),'[]'::jsonb),
    'totalCount',(select count(*) from auth.users),
    'nextCursor',case when (select count(*) from page)>100 then (select id::text from displayed order by id desc limit 1) else null end) into result;
  return result;
end; $$;
-- Auth deletion and all of this person's online records commit or roll back together.
alter table public.study_operations drop constraint study_operations_user_id_namespace_fkey;
alter table public.study_operations add constraint study_operations_user_id_namespace_fkey foreign key(user_id,namespace) references public.study_workspaces(user_id,namespace) on delete cascade;
alter table public.study_workspaces drop constraint study_workspaces_user_id_fkey;
alter table public.study_workspaces add constraint study_workspaces_user_id_fkey foreign key(user_id) references auth.users(id) on delete cascade;
alter table public.study_account_permissions drop constraint study_account_permissions_user_id_fkey;
alter table public.study_account_permissions add constraint study_account_permissions_user_id_fkey foreign key(user_id) references auth.users(id) on delete cascade;
alter table public.study_administrators drop constraint study_administrators_user_id_fkey;
alter table public.study_administrators add constraint study_administrators_user_id_fkey foreign key(user_id) references auth.users(id) on delete cascade;
alter table public.study_access_history drop constraint study_access_history_actor_id_fkey;
alter table public.study_access_history alter column actor_id drop not null;
alter table public.study_access_history add constraint study_access_history_actor_id_fkey foreign key(actor_id) references auth.users(id) on delete set null;
alter table public.study_access_history drop constraint study_access_history_target_id_fkey;
alter table public.study_access_history add constraint study_access_history_target_id_fkey foreign key(target_id) references auth.users(id) on delete cascade;
create index study_access_history_actor_idx on public.study_access_history(actor_id);
create index study_access_history_target_idx on public.study_access_history(target_id);
create function public.study_withdraw_account(p_user uuid) returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
  -- Serialize administrator removals with each other and trusted role additions.
  lock table public.study_administrators in share row exclusive mode;
  if exists(select 1 from public.study_administrators where user_id=p_user) and (select count(*) from public.study_administrators)=1 then raise exception 'LAST_ADMIN'; end if;
  -- Writers hold this row FOR SHARE; complete them before removing the account.
  perform 1 from public.study_account_permissions where user_id=p_user for update;
  delete from auth.users where id=p_user;
  if not found then raise exception 'AUTH_REQUIRED'; end if;
end; $$;
revoke all on function public.study_set_account_name(uuid,text),public.study_withdraw_account(uuid) from public,anon,authenticated,service_role;
grant execute on function public.study_set_account_name(uuid,text),public.study_withdraw_account(uuid) to service_role;
