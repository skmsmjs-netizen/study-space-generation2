-- User chose a monthly budget within KRW 20,000. USD10 leaves currency/tax headroom.
-- Preserve any existing manually chosen cap and all spending history.
alter table public.study_ai_api_settings alter column limit_micro set default 10000000;
create or replace function public.study_ai_api_status(p_user uuid,p_session uuid) returns jsonb
language plpgsql security definer set search_path=public,pg_temp as $$
declare settings public.study_ai_api_settings; used bigint; pending bigint; m date:=date_trunc('month',now() at time zone 'UTC')::date;
begin
  perform public.study_ai_api_owner(p_user,p_session);
  select * into settings from public.study_ai_api_settings where user_id=p_user;
  select coalesce(sum(charged_micro),0),coalesce(sum(case when charged_micro is null then reserved_micro else 0 end),0)
    into used,pending from public.study_ai_api_reservations where user_id=p_user and month=m;
  return jsonb_build_object('configured',settings.secret_id is not null,'enabled',coalesce(settings.enabled,false),
    'limitMicro',coalesce(settings.limit_micro,10000000),'usedMicro',used,'pendingMicro',pending,'month',m);
end $$;

