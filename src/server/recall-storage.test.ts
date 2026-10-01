// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { handleCommand, type CommandBackend } from './command-handler';
import { packServerState, unpackServerState } from './state-codec';
import { emptyState, type Command } from '../domain/model';
const user = '10000000-0000-4000-8000-000000000001';
let db: PGlite;
const backend: CommandBackend = {
  async authenticate(token) { return token === 'owner' ? user : ''; },
  async access() { return { status: 'approved', administrator: false }; },
  async read(id, namespace) {
    const { rows } = await db.query<{ sequence: number; state: unknown }>('select sequence,state from study_workspaces where user_id=$1 and namespace=$2', [id, namespace]);
    return rows[0] ? { sequence: Number(rows[0].sequence), data: unpackServerState(rows[0].state) } : null;
  },
  async commit(id, namespace, base, command, next) {
    const { rows } = await db.query<{ result: { sequence: number; data: unknown } }>('select study_commit_internal($1,$2,$3,$4,$5,$6) result', [id, namespace, base, command.opId, next.appliedOps[command.opId], packServerState(next, command.opId)]);
    return { sequence: rows[0].result.sequence, data: unpackServerState(rows[0].result.data) };
  },
};
const cmd = (patch: object): Command => ({ userId: user, namespace: 'test', opId: crypto.randomUUID(), at: '2026-10-01T03:00:00.000Z', ...patch } as Command);
const request = (body: unknown, token = 'owner') => handleCommand(new Request('http://test', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(body) }), backend);
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`create schema auth; create table auth.users(id uuid primary key); create role anon; create role authenticated; create role service_role bypassrls; create function auth.uid() returns uuid language sql as $$ select null::uuid $$; insert into auth.users values('${user}');`);
  await db.exec(await readFile(new URL('../../supabase/migrations/202609300001_study_storage.sql', import.meta.url), 'utf8'));
  await db.exec('alter function study_commit(uuid,text,bigint,text,text,jsonb) rename to study_commit_internal;');
  await db.exec(await readFile(new URL('../../supabase/migrations/20261001033300_recall_schedules.sql', import.meta.url), 'utf8'));
});
afterAll(async () => { await db.close(); });
describe('recall server transactions', () => {
  it('reloads exact text/ink with FSRS state and retries a review only once', async () => {
    const commands = [cmd({ type: 'addSubject', id: 'subject', name: '시험 과목', scope: { kind: 'independent' } }), cmd({ type: 'addNode', id: 'topic', subjectId: 'subject', parentId: null, role: 'topic', name: '주제' })];
    for (const [baseSequence, command] of commands.entries()) expect((await request({ action: 'execute', namespace: 'test', baseSequence, command })).status).toBe(200);
    const body = '  원문\r\n\u0000\ud800 ', strokes = [{ id: 'ink', ink: 'blue', width: 3, points: [{ x: 10, y: 15, pressure: .5 }] }];
    const command = cmd({ type: 'reviewRecallCard', id: 'card', topicId: 'topic', expectedVersion: 0, rating: 3, memo: { id: 'answer', body, strokes } });
    const write = { action: 'execute', namespace: 'test', baseSequence: 2, command };
    expect((await request(write)).status).toBe(200); expect((await request(write)).status).toBe(200);
    const loaded = await (await request({ action: 'load', namespace: 'test' })).json();
    expect(loaded.supportedCommands).toContain('reviewRecallCard'); expect(loaded.sequence).toBe(3);
    expect(loaded.data.memos).toHaveLength(1); expect(loaded.data.memos[0]).toMatchObject({ body, strokes });
    expect(loaded.data.recallCards[0].reviews).toHaveLength(1); expect(loaded.data.recallCards[0].memory.due).toBe('2026-10-01T03:10:00.000Z');
    expect(loaded.data.records).toEqual([]); expect(loaded.data.sessions).toEqual([]);
    expect((await request({ ...write, command: { ...command, opId: 'stale' } })).status).toBe(409);
    expect((await request(write, 'stranger')).status).toBe(401);
  });
  it('checks new collection ownership inside PostgreSQL without modifying any existing workspace', async () => {
    const forged = { ...packServerState(emptyState(user, 'test'), 'op'), appliedOps: { op: 'payload' }, recallCards: [{ userId: 'other', namespace: 'test' }] };
    await expect(db.query('select study_commit_internal($1,$2,$3,$4,$5,$6)', [user, 'test', 3, 'op', 'payload', forged])).rejects.toThrow('OWNERSHIP');
    expect((await backend.read(user, 'test'))!.sequence).toBe(3);
  });
});
