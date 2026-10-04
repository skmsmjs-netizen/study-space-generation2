// @vitest-environment node
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { beforeAll, beforeEach, afterAll, expect, it } from 'vitest';
let db: PGlite;
const user = '10000000-0000-4000-8000-000000000001',
  job = '20000000-0000-4000-8000-000000000001';
beforeAll(async () => {
  db = new PGlite();
  await db.exec(
    `create schema auth;create table auth.users(id uuid primary key);create role anon;create role authenticated;create role service_role;insert into auth.users values('${user}');create table permissions(user_id uuid primary key,status text);insert into permissions values('${user}','approved');create function public.study_require_access(p_user uuid,p_admin boolean) returns void language plpgsql as $$begin if not exists(select 1 from permissions where user_id=p_user and status='approved') then raise exception 'ACCESS_DENIED';end if;end;$$;`,
  );
  await db.exec(
    await readFile(
      new URL('../../supabase/migrations/20261001041455_code_runner_quota.sql', import.meta.url),
      'utf8',
    ),
  );
  await db.exec(await readFile(new URL('../../supabase/migrations/20261001083558_code_terminal_lease.sql', import.meta.url), 'utf8'));
});
beforeEach(async () => {
  await db.exec(
    `reset role;truncate study_code_run_limits;update permissions set status='approved';`,
  );
});
afterAll(async () => {
  await db.close();
});
const reserve = () => db.query('select study_reserve_code_run($1,$2)', [user, job]);
const finish = () => db.query('select study_finish_code_run($1,$2)', [user, job]);
it('permits one active job, keeps old completion from releasing the new job, and enforces quotas', async () => {
  await reserve();
  await expect(reserve()).rejects.toThrow('CODE_BUSY');
  await db.query('select study_finish_code_run($1,$2)', [
    user,
    '20000000-0000-4000-8000-000000000002',
  ]);
  await expect(reserve()).rejects.toThrow('CODE_BUSY');
  await finish();
  for (let i = 1; i < 6; i++) {
    await reserve();
    await finish();
  }
  await expect(reserve()).rejects.toThrow('CODE_RATE_LIMIT');
  expect(
    (
      await db.query<{ minute_count: number }>(
        "select minute_count from study_code_run_limits where key='global'",
      )
    ).rows[0].minute_count,
  ).toBe(6);
});
it('rejects unapproved accounts and browser writes or RPC calls', async () => {
  await db.exec("update permissions set status='suspended'");
  await expect(reserve()).rejects.toThrow('ACCESS_DENIED');
  expect((await db.query('select * from study_code_run_limits')).rows).toHaveLength(0);
  for (const role of ['anon', 'authenticated']) {
    await db.exec(`set role ${role}`);
    await expect(reserve()).rejects.toThrow('permission denied');
    await expect(db.exec('select * from study_code_run_limits')).rejects.toThrow(
      'permission denied',
    );
    await db.exec('reset role');
  }
});
it('expires an abandoned lease and resets minute counters without resetting the day limit', async () => {
  await reserve();
  await db.exec(
    "update study_code_run_limits set lease_until=now()-interval '1 minute',minute_at=now()-interval '1 minute',minute_count=6",
  );
  await reserve();
  await finish();
  await db.exec('update study_code_run_limits set day_count=200 where user_id is not null');
  await expect(reserve()).rejects.toThrow('CODE_RATE_LIMIT');
});

it('terminal leases last through the input wait, share batch limits, and retain owner isolation', async () => {
  await db.query('select study_reserve_code_terminal($1,$2)', [user, job]);
  const { rows } = await db.query<{ seconds: number }>("select extract(epoch from lease_until-clock_timestamp()) as seconds from study_code_run_limits where user_id=$1", [user]);
  expect(Number(rows[0].seconds)).toBeGreaterThan(170);
  await expect(reserve()).rejects.toThrow('CODE_BUSY');
  await db.query('select study_finish_code_run($1,$2)', ['10000000-0000-4000-8000-000000000002', job]);
  await expect(reserve()).rejects.toThrow('CODE_BUSY');
  await finish();
  await reserve();
  for (const role of ['anon', 'authenticated']) {
    await db.exec(`set role ${role}`);
    await expect(db.query('select study_reserve_code_terminal($1,$2)', [user, job])).rejects.toThrow('permission denied');
    await db.exec('reset role');
  }
});
