// @vitest-environment node
import { beforeAll, beforeEach, afterAll, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { applyCommand } from '../domain/commands';
import { emptyState, type Command } from '../domain/model';
import { packServerState, unpackServerState } from './state-codec';

const owner = '10000000-0000-4000-8000-000000000001';
const foreign = '10000000-0000-4000-8000-000000000002';
const op: Command = {
  type: 'saveCodeExample',
  id: 'code-migration',
  expectedVersion: 0,
  userId: owner,
  namespace: 'test',
  at: '2026-10-01T03:00:00.000Z',
  opId: 'code-save',
  content: {
    title: ' 원文 ',
    language: 'c',
    code: '//\u0000\ud800\r\n',
    stdin: '3\n4',
    notes: ' 条件  ',
  },
};
const next = applyCommand(emptyState(owner, 'test'), op);
let db: PGlite;
beforeAll(async () => {
  db = new PGlite();
  await db.exec(
    `create schema auth; create table auth.users(id uuid primary key); create role anon; create role authenticated; create role service_role bypassrls; create function auth.uid() returns uuid language sql as $$ select null::uuid $$; insert into auth.users values('${owner}');`,
  );
  await db.exec(
    await readFile(
      new URL('../../supabase/migrations/202609300001_study_storage.sql', import.meta.url),
      'utf8',
    ),
  );
  await db.exec(
    await readFile(
      new URL('../../supabase/migrations/20261001035323_code_examples.sql', import.meta.url),
      'utf8',
    ),
  );
});
beforeEach(async () => {
  await db.exec('reset role; truncate study_operations,study_workspaces;');
});
afterAll(async () => {
  await db.close();
});
const commit = (snapshot: object) =>
  db.query<{ result: { sequence: number; data: unknown } }>(
    'select study_commit_internal($1,$2,$3,$4,$5,$6) result',
    [owner, 'test', 0, op.opId, next.appliedOps[op.opId], snapshot],
  );

it('stores exact source and explanation once through the new SQL function', async () => {
  const snapshot = packServerState(next, op.opId);
  const saved = await commit(snapshot);
  expect(unpackServerState(saved.rows[0].result.data).codeExamples?.[0]).toMatchObject(op.content);
  expect((await commit(snapshot)).rows[0].result.sequence).toBe(1);
  expect((await db.query('select * from study_operations')).rows).toHaveLength(1);
});
it('rejects foreign code and recall metadata atomically', async () => {
  for (const collection of ['codeExamples', 'recallCards', 'recallPreferences']) {
    const snapshot = {
      ...packServerState(next, op.opId),
      [collection]: [{ userId: foreign, namespace: 'test' }],
    };
    await expect(commit(snapshot)).rejects.toThrow('OWNERSHIP');
  }
  expect((await db.query('select * from study_workspaces')).rows).toHaveLength(0);
  expect((await db.query('select * from study_operations')).rows).toHaveLength(0);
});
it('keeps the internal function unavailable to every public API role', async () => {
  for (const role of ['anon', 'authenticated', 'service_role']) {
    await db.exec(`set role ${role}`);
    await expect(commit(packServerState(next, op.opId))).rejects.toThrow('permission denied');
    await db.exec('reset role');
  }
});
