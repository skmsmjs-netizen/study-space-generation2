-- Run after the migration/function deployment and secret setup. No keys belong in this file.
-- Vault names: study_push_project_url, study_push_publishable_key, study_push_cron_secret.
create extension if not exists pg_cron;
create extension if not exists pg_net;
do $$
begin
  if (select count(*) from vault.decrypted_secrets where name in ('study_push_project_url','study_push_publishable_key','study_push_cron_secret'))<>3 then raise exception 'PUSH_VAULT_SECRETS_REQUIRED'; end if;
end; $$;
-- 00:00 UTC = 09:00 Korea. Every minute in the first hour drains queues and retries failures.
select cron.schedule('study-schedule-morning','* 0 * * *',$job$
  select net.http_post(
    url:=(select decrypted_secret from vault.decrypted_secrets where name='study_push_project_url')||'/functions/v1/study-notifications',
    headers:=jsonb_build_object('Content-Type','application/json','apikey',(select decrypted_secret from vault.decrypted_secrets where name='study_push_publishable_key'),'Authorization','Bearer '||(select decrypted_secret from vault.decrypted_secrets where name='study_push_cron_secret')),
    body:='{"action":"dispatch"}'::jsonb,
    timeout_milliseconds:=100000
  );
$job$);
