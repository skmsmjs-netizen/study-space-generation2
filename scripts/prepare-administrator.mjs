// Produces a private, reviewable SQL file. Never contacts Supabase or grants access.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
const [email, output] = process.argv.slice(2);
if (!email || !output || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw Error('Usage: node scripts/prepare-administrator.mjs EMAIL PRIVATE_OUTPUT.sql');
const literal = email.replaceAll("'", "''");
const sql = `-- Run only after 202610010004_account_approval.sql in the intended project.
-- Trusted initial setup; this file contains the owner email and must stay private.
begin;
set local study.bootstrap_owner_email = '${literal}';
do $$
declare owner_id uuid; matched bigint; previous public.study_account_permissions;
begin
  select count(*) into matched from auth.users where lower(email)=lower(current_setting('study.bootstrap_owner_email')) and email_confirmed_at is not null;
  if matched<>1 then raise exception 'Exactly one email-confirmed owner account is required'; end if;
  select id into owner_id from auth.users where lower(email)=lower(current_setting('study.bootstrap_owner_email')) and email_confirmed_at is not null;
  select * into previous from public.study_account_permissions where user_id=owner_id for update;
  if previous.user_id is null then raise exception 'Account approval migration is required'; end if;
  insert into public.study_administrators(user_id) values(owner_id) on conflict do nothing;
  if previous.status<>'approved' then
    update public.study_account_permissions set status='approved',version=version+1,updated_at=now() where user_id=owner_id;
    insert into public.study_access_history(actor_id,target_id,previous_status,status,version) values(owner_id,owner_id,previous.status,'approved',previous.version+1);
  end if;
end; $$;
commit;
`;
const path = resolve(output);
await mkdir(dirname(path), { recursive: true });
await writeFile(path, sql, { mode: 0o600 });
console.log(`Prepared private administrator setup: ${path}`);
