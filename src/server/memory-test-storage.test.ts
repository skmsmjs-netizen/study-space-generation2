// @vitest-environment node
import { afterAll, beforeAll, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { handleCommand, type CommandBackend } from './command-handler';
import { packServerState, unpackServerState } from './state-codec';
import type { Command } from '../domain/model';
import { memoryQuestions } from '../domain/memory-test';
const owner = '10000000-0000-4000-8000-000000000001',
  foreign = '10000000-0000-4000-8000-000000000002';
let db: PGlite;
const backend: CommandBackend = {
  async authenticate(token) {
    return token === 'owner' ? owner : '';
  },
  async access() {
    return { status: 'approved', administrator: false };
  },
  async read(id, namespace) {
    const { rows } = await db.query<{ sequence: number; state: unknown }>(
      'select sequence,state from study_workspaces where user_id=$1 and namespace=$2',
      [id, namespace],
    );
    return rows[0]
      ? { sequence: Number(rows[0].sequence), data: unpackServerState(rows[0].state) }
      : null;
  },
  async commit(id, namespace, base, command, next) {
    const { rows } = await db.query<{ result: { sequence: number; data: unknown } }>(
      'select study_commit_internal($1,$2,$3,$4,$5,$6) result',
      [
        id,
        namespace,
        base,
        command.opId,
        next.appliedOps[command.opId],
        packServerState(next, command.opId),
      ],
    );
    return { sequence: rows[0].result.sequence, data: unpackServerState(rows[0].result.data) };
  },
};
const cmd = (patch: object): Command =>
  ({
    userId: owner,
    namespace: 'test',
    opId: crypto.randomUUID(),
    at: '2026-10-01T04:00:00.000Z',
    ...patch,
  }) as Command;
const request = (body: unknown, token = 'owner') =>
  handleCommand(
    new Request('http://test', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    }),
    backend,
  );
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
      new URL('../../supabase/migrations/20261001110001_memory_tests.sql', import.meta.url),
      'utf8',
    ),
  );
});
afterAll(async () => {
  await db.close();
});
it('round-trips exact text, vector ink and frozen criteria through API and PostgreSQL, including retries', async () => {
  const commands = [
    cmd({ type: 'addSubject', id: 'subject', name: '과목', scope: { kind: 'independent' } }),
    cmd({
      type: 'addNode',
      id: 'topic',
      subjectId: 'subject',
      parentId: null,
      role: 'topic',
      name: '주제',
    }),
  ];
  for (const [baseSequence, command] of commands.entries())
    expect(
      (await request({ action: 'execute', namespace: 'test', baseSequence, command })).status,
    ).toBe(200);
  const question = '  질문\r\n\u0000\ud800 ',
    answer = '원문과 조건\n',
    strokes = [{ id: 'ink', ink: 'green', width: 3, points: [{ x: 15, y: 30, pressure: 0.6 }] }, { id: 'page-two', ink: 'blue', width: 5, page: 1, pressureSensitive: true, points: [{ x: 28, y: 50, pressure: 0.8 }] }];
  const card = cmd({
    type: 'saveMemoryCard',
    id: 'card',
    expectedVersion: 0,
    content: { topicId: 'topic', question, answer, strokes },
  });
  expect(
    (await request({ action: 'execute', namespace: 'test', baseSequence: 2, command: card }))
      .status,
  ).toBe(200);
  const data = (await backend.read(owner, 'test'))!.data;
  const questions = memoryQuestions(data, data.memoryCards!, 1);
  questions[0].response = '  내 답\r\n';
  questions[0].responseStrokes = structuredClone(
    strokes,
  ) as (typeof questions)[0]['responseStrokes'];
  questions[0].verdict = 'uncertain';
  const test = cmd({
    type: 'saveMemoryTest',
    id: 'test',
    content: { startedAt: card.at, endedAt: card.at, questions },
  });
  const write = { action: 'execute', namespace: 'test', baseSequence: 3, command: test };
  expect((await request(write)).status).toBe(200);
  expect((await request(write)).status).toBe(200);
  const loaded = await (await request({ action: 'load', namespace: 'test' })).json();
  expect(loaded.supportedCommands).toContain('saveMemoryTest');
  expect(loaded.sequence).toBe(4);
  expect(loaded.data.memoryCards[0]).toMatchObject({ question, answer, strokes });
  expect(loaded.data.memoryTests).toHaveLength(1);
  expect(loaded.data.memoryTests[0].questions).toEqual(questions);
  expect(loaded.data.records).toHaveLength(0);
  expect(loaded.data.sessions).toHaveLength(0);
  expect((await request({ ...write, command: { ...test, userId: foreign } })).status).toBe(403);
  expect(
    (
      await request({
        action: 'execute',
        namespace: 'test',
        baseSequence: 2,
        command: { ...card, opId: 'stale', expectedVersion: 1 },
      })
    ).status,
  ).toBe(409);
});
it('rejects foreign metadata in both collections and unauthenticated internal writes', async () => {
  const data = (await backend.read(owner, 'test'))!.data;
  const packed = packServerState(data, Object.keys(data.appliedOps).at(-1)!);
  for (const collection of ['memoryCards', 'memoryTests']) {
    const forged = { ...packed, [collection]: [{ userId: foreign, namespace: 'test' }] };
    await expect(
      db.query('select study_commit_internal($1,$2,$3,$4,$5,$6)', [
        owner,
        'test',
        4,
        'forge',
        'forge',
        forged,
      ]),
    ).rejects.toThrow('OWNERSHIP');
  }
  await db.exec('set role authenticated;');
  await expect(
    db.query('select study_commit_internal($1,$2,$3,$4,$5,$6)', [
      owner,
      'test',
      4,
      'direct',
      'direct',
      packed,
    ]),
  ).rejects.toThrow('permission denied');
  await db.exec('reset role;');
  expect((await request({ action: 'load', namespace: 'test' }, 'invalid')).status).toBe(401);
});

it('preserves legacy and new paged memo vectors through PostgreSQL and an idempotent retry', async () => {
  const before = await backend.read(owner, 'test');
  if (!before) throw Error('setup workspace missing');
  const strokes = [{ id: 'legacy', ink: 'ink' as const, width: 2, points: [{ x: 22, y: 40, pressure: .4 }] }, { id: 'second-page', ink: 'green' as const, width: 5, page: 1, pressureSensitive: true, points: [{ x: 31, y: 60, pressure: .7 }] }];
  const command = cmd({ type: 'saveMemo', id: 'paged-memo', body: '  여러 쪽 풀이\n ', ownerId: null, strokes, expectedVersion: 0 });
  const response = await request({ action: 'execute', namespace: 'test', baseSequence: before.sequence, command }); expect(response.status).toBe(200);
  const next = await backend.read(owner, 'test'); expect(next?.data.memos?.find(m => m.id === 'paged-memo')).toMatchObject({ body: '  여러 쪽 풀이\n ', strokes });
  expect((await request({ action: 'execute', namespace: 'test', baseSequence: before.sequence, command })).status).toBe(200);
  expect((await backend.read(owner, 'test'))?.sequence).toBe(next?.sequence);
});
