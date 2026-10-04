-- Dedicated API key vault and conservative per-month app spending guard.
-- No private study content is stored in these tables. No key is returned to clients.
create table public.study_ai_api_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  secret_id uuid references vault.secrets(id),
  enabled boolean not null default false,
  limit_micro bigint not null default 3000000 check(limit_micro between 100000 and 10000000)
);
create table public.study_ai_api_reservations (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  month date not null,
  reserved_micro bigint not null check(reserved_micro between 1 and 1000000),
  charged_micro bigint check(charged_micro between 0 and 1000000),
  created_at timestamptz not null default now()
);
create index on public.study_ai_api_reservations(user_id,month);
alter table public.study_ai_api_settings enable row level security;
alter table public.study_ai_api_reservations enable row level security;
revoke all on public.study_ai_api_settings,public.study_ai_api_reservations from public,anon,authenticated,service_role;

create function public.study_ai_api_owner(p_user uuid,p_session uuid) returns void
language plpgsql security definer set search_path=public,pg_temp as $$
begin
  if p_user <> 'd33cf234-2998-43bd-b420-3ac056db4bea'::uuid or p_session is null
    or not exists(select 1 from auth.sessions where id=p_session and user_id=p_user)
    or not exists(select 1 from public.study_account_permissions where user_id=p_user and status='approved') then
    raise exception 'API_ACCESS_DENIED';
  end if;
end $$;

create function public.study_ai_api_status(p_user uuid,p_session uuid) returns jsonb
language plpgsql security definer set search_path=public,pg_temp as $$
declare settings public.study_ai_api_settings; used bigint; pending bigint; m date:=date_trunc('month',now() at time zone 'UTC')::date;
begin
  perform public.study_ai_api_owner(p_user,p_session);
  select * into settings from public.study_ai_api_settings where user_id=p_user;
  select coalesce(sum(charged_micro),0),coalesce(sum(case when charged_micro is null then reserved_micro else 0 end),0)
    into used,pending from public.study_ai_api_reservations where user_id=p_user and month=m;
  return jsonb_build_object('configured',settings.secret_id is not null,'enabled',coalesce(settings.enabled,false),
    'limitMicro',coalesce(settings.limit_micro,3000000),'usedMicro',used,'pendingMicro',pending,'month',m);
end $$;

create function public.study_ai_api_configure(p_user uuid,p_session uuid,p_key text,p_limit bigint,p_enabled boolean,p_disconnect boolean default false) returns void
language plpgsql security definer set search_path=public,vault,pg_temp as $$
declare v_secret_id uuid;
begin
  perform public.study_ai_api_owner(p_user,p_session);
  if p_limit is null or p_limit not between 100000 and 10000000 or p_enabled is null or p_disconnect is null then raise exception 'API_SETTINGS_INVALID';end if;
  if p_key is not null and (length(p_key) not between 19 and 1003 or p_key !~ '^sk-[A-Za-z0-9_-]+$') then raise exception 'API_SETTINGS_INVALID';end if;
  perform pg_advisory_xact_lock(hashtextextended('study-api:'||p_user,0));
  select secret_id into v_secret_id from public.study_ai_api_settings where user_id=p_user for update;
  if p_disconnect then
    update public.study_ai_api_settings set enabled=false,secret_id=null where user_id=p_user;
    if v_secret_id is not null then delete from vault.secrets where id=v_secret_id;end if;
    return;
  end if;
  if p_key is not null then
    if v_secret_id is null then
      select vault.create_secret(p_key,'study-openai-api:'||p_user,'Owner study API credential') into v_secret_id;
    else perform vault.update_secret(v_secret_id,p_key);end if;
  end if;
  if p_enabled and v_secret_id is null then raise exception 'API_KEY_REQUIRED';end if;
  insert into public.study_ai_api_settings(user_id,secret_id,enabled,limit_micro) values(p_user,v_secret_id,p_enabled,p_limit)
    on conflict(user_id) do update set secret_id=excluded.secret_id,enabled=excluded.enabled,limit_micro=excluded.limit_micro;
end $$;

create function public.study_ai_api_reserve(p_user uuid,p_session uuid,p_id uuid,p_amount bigint) returns jsonb
language plpgsql security definer set search_path=public,vault,pg_temp as $$
declare settings public.study_ai_api_settings; used bigint; secret text; m date:=date_trunc('month',now() at time zone 'UTC')::date;
begin
  perform public.study_ai_api_owner(p_user,p_session);
  if p_id is null or p_amount is null or p_amount not between 1 and 1000000 then raise exception 'API_RESERVATION_INVALID';end if;
  perform pg_advisory_xact_lock(hashtextextended('study-api:'||p_user,0));
  select * into settings from public.study_ai_api_settings where user_id=p_user for update;
  if settings.secret_id is null or not settings.enabled then raise exception 'API_KEY_REQUIRED';end if;
  if exists(select 1 from public.study_ai_api_reservations where id=p_id) then raise exception 'API_REQUEST_ALREADY_RESERVED';end if;
  if exists(select 1 from public.study_ai_api_reservations where user_id=p_user and charged_micro is null and created_at>now()-interval '3 minutes') then raise exception 'API_BUSY';end if;
  select coalesce(sum(coalesce(charged_micro,reserved_micro)),0) into used from public.study_ai_api_reservations where user_id=p_user and month=m;
  if used+p_amount>settings.limit_micro then raise exception 'API_BUDGET_EXCEEDED';end if;
  select decrypted_secret into secret from vault.decrypted_secrets where id=settings.secret_id;
  if secret is null then raise exception 'API_KEY_REQUIRED';end if;
  insert into public.study_ai_api_reservations(id,user_id,month,reserved_micro) values(p_id,p_user,m,p_amount);
  return jsonb_build_object('key',secret);
end $$;

create function public.study_ai_api_settle(p_user uuid,p_session uuid,p_id uuid,p_amount bigint) returns void
language plpgsql security definer set search_path=public,pg_temp as $$
declare reservation public.study_ai_api_reservations;
begin
  perform public.study_ai_api_owner(p_user,p_session);
  perform pg_advisory_xact_lock(hashtextextended('study-api:'||p_user,0));
  select * into reservation from public.study_ai_api_reservations where id=p_id and user_id=p_user for update;
  if reservation.id is null or p_amount is null or p_amount<0 or p_amount>reservation.reserved_micro then raise exception 'API_SETTLEMENT_INVALID';end if;
  if reservation.charged_micro is not null then
    if reservation.charged_micro<>p_amount then raise exception 'API_SETTLEMENT_INVALID';end if;
    return;
  end if;
  update public.study_ai_api_reservations set charged_micro=p_amount where id=p_id;
end $$;

revoke all on function public.study_ai_api_owner(uuid,uuid),public.study_ai_api_status(uuid,uuid),public.study_ai_api_configure(uuid,uuid,text,bigint,boolean,boolean),public.study_ai_api_reserve(uuid,uuid,uuid,bigint),public.study_ai_api_settle(uuid,uuid,uuid,bigint) from public,anon,authenticated;
grant execute on function public.study_ai_api_status(uuid,uuid),public.study_ai_api_configure(uuid,uuid,text,bigint,boolean,boolean),public.study_ai_api_reserve(uuid,uuid,uuid,bigint),public.study_ai_api_settle(uuid,uuid,uuid,bigint) to service_role;

-- Removing an account also removes its credential, rather than orphaning a Vault entry.
create function public.study_ai_api_remove_secret() returns trigger
language plpgsql security definer set search_path=public,pg_temp as $$
begin
  if old.secret_id is not null then delete from vault.secrets where id=old.secret_id;end if;
  return old;
end $$;
revoke all on function public.study_ai_api_remove_secret() from public,anon,authenticated;
create trigger study_ai_api_remove_secret after delete on public.study_ai_api_settings
  for each row execute function public.study_ai_api_remove_secret();
