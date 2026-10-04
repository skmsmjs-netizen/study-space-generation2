// @vitest-environment node
import { afterAll, beforeAll, beforeEach, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { applyCommand } from '../domain/commands';
import { emptyState, type AppState, type Command, type Namespace } from '../domain/model';
import { packServerState, unpackServerState } from './state-codec';

const user = '10000000-0000-4000-8000-000000000001';
const other = '10000000-0000-4000-8000-000000000002';
let db: PGlite;
type ReadResult = { unchanged?: true; sequence: number; state?: unknown; userId?: string; namespace?: string } | null;
async function read(owner: string, namespace: string | null, sequence: number | null) {
  return (await db.query<{ result: ReadResult }>(
    'select public.study_read_workspace_conditional($1,$2,$3) result', [owner, namespace, sequence],
  )).rows[0].result;
}
function subject(id: string, owner = user, namespace: Namespace = 'test'): Command {
  return { type: 'addSubject', id, name: '  공부\r\n' + id, scope: { kind: 'independent' },
    userId: owner, namespace, at: '2026-10-02T00:00:00Z', opId: id };
}
async function commit(previous: AppState, sequence: number, command: Command) {
  const next = applyCommand(previous, command);
  await db.query('select public.study_commit($1,$2,$3,$4,$5,$6)', [
    next.userId, next.namespace, sequence, command.opId, next.appliedOps[command.opId], packServerState(next, command.opId),
  ]);
  return next;
}
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`create schema auth; create table auth.users(id uuid primary key);
    create role anon; create role authenticated; create role service_role bypassrls;
    grant usage on schema public,auth to anon,authenticated,service_role;
    create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    insert into auth.users values('${user}'),('${other}');`);
  for (const name of ['202609300001_study_storage.sql', '202610010004_account_approval.sql',
    '20261001180000_integration_ink_and_catalog_ownership.sql', '20261001171008_conditional_workspace_read.sql']) {
    await db.exec(await readFile(new URL('../../supabase/migrations/' + name, import.meta.url), 'utf8'));
  }
});
beforeEach(async () => {
  await db.exec("reset role; truncate study_operations,study_workspaces; update study_account_permissions set status='approved';");
});
afterAll(async () => { await db.close(); });

it('returns only identity and version for an unchanged workspace, without touching its original data', async () => {
  const state = await commit(emptyState(user, 'test'), 0, subject('one'));
  await db.exec('set role service_role');
  expect(await read(user, 'test', 1)).toEqual({ unchanged: true, sequence: 1, userId: user, namespace: 'test' });
  const changed = await read(user, 'test', 0);
  expect(changed?.sequence).toBe(1);
  expect(unpackServerState(changed?.state)).toEqual(state);
});

it('returns newer committed content with exact UTF16 and revision history after an unchanged read', async () => {
  let state = await commit(emptyState(user, 'test'), 0, subject('one'));
  expect((await read(user, 'test', 1))?.unchanged).toBe(true);
  const raw = '  한글\u0000\ud800\r\n\t😀 끝  ';
  state = await commit(state, 1, { type: 'updateNarrative', id: 'text', kind: 'subject-overview', ownerId: 'one',
    body: raw, expectedVersion: 0, userId: user, namespace: 'test', at: '2026-10-02T00:01:00Z', opId: 'write' });
  const result = await read(user, 'test', 1);
  expect(result?.sequence).toBe(2);
  expect(result?.unchanged).toBeUndefined();
  const restored = unpackServerState(result?.state);
  expect(restored).toEqual(state);
  expect(restored.narratives[0].body).toBe(raw);
  expect(restored.revisions).toHaveLength(2);
});

it('isolates both owners and namespaces even when versions are identical', async () => {
  for (const [owner, namespace] of [[user, 'test'], [other, 'test'], [user, 'personal']] as const) {
    await commit(emptyState(owner, namespace), 0, subject(owner + namespace, owner, namespace));
  }
  for (const [owner, namespace] of [[user, 'test'], [other, 'test'], [user, 'personal']] as const) {
    expect(await read(owner, namespace, 1)).toEqual({ unchanged: true, sequence: 1, userId: owner, namespace });
    expect(unpackServerState((await read(owner, namespace, 0))?.state).subjects[0].id).toBe(owner + namespace);
  }
});

it('keeps missing workspaces null without creating a row or receipt', async () => {
  expect(await read(user, 'test', 0)).toBeNull();
  expect(await read(user, 'test', 9)).toBeNull();
  expect((await db.query('select * from study_workspaces')).rows).toEqual([]);
  expect((await db.query('select * from study_operations')).rows).toEqual([]);
});

it('enforces current database approval even if the Edge layer previously approved the user', async () => {
  await commit(emptyState(user, 'test'), 0, subject('one'));
  for (const status of ['pending', 'rejected', 'suspended']) {
    await db.query('update study_account_permissions set status=$1 where user_id=$2', [status, user]);
    await expect(read(user, 'test', 1)).rejects.toThrow('ACCESS_DENIED');
    await expect(read(user, 'test', 0)).rejects.toThrow('ACCESS_DENIED');
  }
  await expect(read('10000000-0000-4000-8000-000000000003', 'test', 0)).rejects.toThrow('ACCESS_DENIED');
});

it('rejects invalid spaces and versions at the RPC boundary', async () => {
  for (const namespace of [null, 'demo', 'other']) await expect(read(user, namespace, 0)).rejects.toThrow('WRONG_NAMESPACE');
  for (const version of [null, -1, 9007199254740992]) await expect(read(user, 'test', version)).rejects.toThrow('INVALID_VERSION');
});

it('denies forged-owner direct RPC calls by browser roles and grants only the backend role', async () => {
  await commit(emptyState(user, 'test'), 0, subject('one'));
  for (const role of ['anon', 'authenticated']) {
    await db.exec('set role ' + role);
    await expect(read(user, 'test', 1)).rejects.toThrow('permission denied');
    await db.exec('reset role');
  }
  await db.exec('set role service_role');
  expect((await read(user, 'test', 1))?.unchanged).toBe(true);
  await expect(db.query('select * from public.study_workspaces')).rejects.toThrow('permission denied');
});

it('keeps the legacy full-read RPC compatible', async () => {
  const state = await commit(emptyState(user, 'test'), 0, subject('one'));
  await db.exec('set role service_role');
  const result = await db.query<{ result: { sequence: number; state: unknown } }>(
    'select public.study_read_workspace($1,$2) result', [user, 'test'],
  );
  expect(result.rows[0].result.sequence).toBe(1);
  expect(unpackServerState(result.rows[0].result.state)).toEqual(state);
});
