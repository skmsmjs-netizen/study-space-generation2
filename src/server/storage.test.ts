// @vitest-environment node
import { beforeAll, beforeEach, afterAll, describe, expect, it } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { packServerState, unpackServerState } from './state-codec';
import { handleCommand, type CommandBackend } from './command-handler';
import { applyCommand } from '../domain/commands';
import { emptyState, type Command } from '../domain/model';
const a = '10000000-0000-4000-8000-000000000001', b = '10000000-0000-4000-8000-000000000002';
let db: PGlite;
const command = (patch: Partial<Command> = {}) => ({ type: 'addSubject', id: 'subject-1', name: '검증 과목', scope: { kind: 'independent' }, userId: a, namespace: 'test', at: '2026-09-30T01:00:00.000Z', opId: 'op-1', ...patch } as Command);
const backend: CommandBackend = {
  async access() { return {status: 'approved' as const, administrator: false}; },
  async authenticate(token) { return token === 'a' ? a : token === 'b' ? b : ''; },
  async read(userId, namespace) { const result = await db.query<{ sequence: number; state: ReturnType<typeof emptyState> }>('select sequence,state from study_workspaces where user_id=$1 and namespace=$2', [userId, namespace]); return result.rows.length ? { sequence: Number(result.rows[0].sequence), data: unpackServerState(result.rows[0].state) } : null; },
  async commit(userId, namespace, base, op, next) { const result = await db.query<{ result: any }>('select study_commit($1,$2,$3,$4,$5,$6) result', [userId, namespace, base, op.opId, next.appliedOps[op.opId], packServerState(next,op.opId)]); return { sequence: result.rows[0].result.sequence, data: unpackServerState(result.rows[0].result.data) }; },
};
function request(body: unknown, token = 'a') { return handleCommand(new Request('http://test/functions/v1/study-command', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(body) }), backend); }
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`create schema auth; create table auth.users(id uuid primary key); create role anon; create role authenticated; create role service_role bypassrls; grant usage on schema public,auth to authenticated,service_role,anon; create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; insert into auth.users values('${a}'),('${b}');`);
  await db.exec(await readFile(new URL('../../supabase/migrations/202609300001_study_storage.sql', import.meta.url), 'utf8'));
});
beforeEach(async () => { await db.exec('reset role; truncate study_operations,study_workspaces;'); });
afterAll(async () => { await db.close(); });
describe('server authentication, domain commands and real PostgreSQL transactions', () => {
  it('commits ordered batches to PostgreSQL once per operation, including original UTF16 and history', async () => {
    const subject = command();
    const write = command({ type: 'updateNarrative', id: 'batch-text', kind: 'subject-overview', ownerId: 'subject-1', body: '原文\u0000\ud800\r\n  조건', expectedVersion: 0, opId: 'batch-body' } as Partial<Command>);
    const body = { action: 'execute-batch', namespace: 'test', baseSequence: 0, commands: [subject, write] };
    expect((await request(body)).status).toBe(200);
    expect((await request(body)).status).toBe(200);
    const saved = await backend.read(a, 'test');
    expect(saved!.sequence).toBe(2); expect(saved!.data.revisions).toHaveLength(2);
    expect(saved!.data.narratives[0].body).toBe(write.type === 'updateNarrative' ? write.body : '');
    expect((await db.query('select * from study_operations')).rows).toHaveLength(2);
    const unchanged = await (await request({ action: 'load', namespace: 'test', knownSequence: 2 })).json();
    expect(unchanged.unchanged).toBe(true); expect(unchanged.data).toBeUndefined();
  });
  it('recovers a prefix committed before a batch interruption without duplicating PostgreSQL receipts', async () => {
    const first = command(), second = command({ id: 'subject-2', opId: 'op-2' });
    await request({ action: 'execute', namespace: 'test', baseSequence: 0, command: first });
    expect((await request({ action: 'execute-batch', namespace: 'test', baseSequence: 0, commands: [first, second] })).status).toBe(200);
    expect((await backend.read(a, 'test'))!.sequence).toBe(2);
    expect((await db.query('select * from study_operations')).rows).toHaveLength(2);
  });
  it('stores exact code examples and execution source atomically and rejects foreign owners and stale edits', async () => {
    const content = { title: '  내 C 예제  ', language: 'c' as const, code: '// 원문\r\n\tint main(void){}\u0000\ud800', stdin: '3\n4', notes: '  설명\r\n조건과 예외  ' };
    const save = command({ type: 'saveCodeExample', id: 'code-one', expectedVersion: 0, content, opId: 'code-write' } as Partial<Command>);
    const body = { action: 'execute', namespace: 'test', baseSequence: 0, command: save };
    expect((await request(body)).status).toBe(200); expect((await request(body)).status).toBe(200);
    const loaded = await (await request({ action: 'load', namespace: 'test' })).json();
    expect(loaded.supportedCommands).toContain('saveCodeExample'); expect(loaded.sequence).toBe(1);
    expect(loaded.data.codeExamples[0]).toMatchObject({ ...content, id: 'code-one', version: 1 });
    expect(loaded.data.revisions).toHaveLength(1); expect(loaded.data.records).toEqual([]); expect(loaded.data.sessions).toEqual([]);
    expect((await request({ ...body, command: { ...save, opId: 'foreign-code', userId: b } })).status).toBe(403);
    expect((await request({ ...body, baseSequence: 1, command: { ...save, opId: 'stale-code', content: { ...content, notes: '다른 입력' } } })).status).toBe(409);
    expect((await backend.read(a, 'test'))!.data.codeExamples![0]).toMatchObject(content);
  });
  it('preserves Canvas references, geometry and raw memo through server reload and idempotent retry', async () => {
    await request({ action: 'execute', namespace: 'test', baseSequence: 0, command: command() });
    const node = command({ type: 'addNode', id: 'topic-1', subjectId: 'subject-1', parentId: null, role: 'topic', name: '주제', opId: 'canvas-node' } as Partial<Command>);
    expect((await request({ action: 'execute', namespace: 'test', baseSequence: 1, command: node })).status).toBe(200);
    const memo = command({ type: 'saveMemo', id: 'memo-1', ownerId: 'topic-1', body: '  원문\r\n\u0000\ud800 ', strokes: [], expectedVersion: 0, opId: 'canvas-memo' } as Partial<Command>);
    const memoWrite = { action: 'execute', namespace: 'test', baseSequence: 2, command: memo };
    for (const response of [await request(memoWrite), await request(memoWrite)]) {
      expect(response.status).toBe(200);
      expect((await response.json()).supportedCommands).toContain('saveMemo');
    }
    const layout = command({ type: 'saveCanvasLayout', id: 'canvas:main', positions: { 'node:topic-1': { x: -42.5, y: 18 }, 'memo:memo-1': { x: 450, y: 28 } }, links: [{ id: 'personal-edge', source: 'node:topic-1', target: 'memo:memo-1', label: ' 原文\u0000\ud800 ' }], viewport: { x: 3, y: 4, zoom: .75 }, expectedVersion: 0, opId: 'canvas-layout' } as Partial<Command>);
    const write = { action: 'execute', namespace: 'test', baseSequence: 3, command: layout };
    expect((await request(write)).status).toBe(200); expect((await request(write)).status).toBe(200);
    const loaded = await (await request({ action: 'load', namespace: 'test' })).json();
    expect(loaded.supportedCommands).toEqual(expect.arrayContaining(['saveMemo', 'saveCanvasLayout']));
    const data = loaded.data;
    expect(data.canvasLayouts[0]).toMatchObject({ positions: layout.type === 'saveCanvasLayout' ? layout.positions : {}, links: layout.type === 'saveCanvasLayout' ? layout.links : [], version: 1 });
    expect(data.memos[0].body).toBe(memo.type === 'saveMemo' ? memo.body : '');
    expect(data.records).toEqual([]); expect(data.sessions).toEqual([]);
    expect((await backend.read(a, 'test'))!.sequence).toBe(4);
  });
  it('stores, reloads and preserves original writing and revision identity', async () => {
    expect((await request({ action: 'execute', namespace: 'test', baseSequence: 0, command: command() })).status).toBe(200);
    const write = command({ type: 'updateNarrative', id: 'text-1', kind: 'subject-overview', ownerId: 'subject-1', body: '원문\r\n  이유와 예외\t', expectedVersion: 0, opId: 'op-2' } as Partial<Command>);
    expect((await request({ action: 'execute', namespace: 'test', baseSequence: 1, command: write })).status).toBe(200);
    const loaded = await (await request({ action: 'load', namespace: 'test' })).json();
    expect(loaded.sequence).toBe(2); expect(loaded.data.narratives[0].body).toBe(write.type === 'updateNarrative' ? write.body : ''); expect(loaded.data.revisions).toHaveLength(2);
  });
  it('preserves NUL, lone surrogate, CRLF and literal escape text through PostgreSQL', async () => {
    await request({ action: 'execute', namespace: 'test', baseSequence: 0, command: command() });
    const body = '원문\u0000\ud800\r\n\t  \\u0000';
    const write = command({ type: 'updateNarrative', id: 'raw-1', kind: 'subject-overview', ownerId: 'subject-1', body, expectedVersion: 0, opId: 'op-raw' } as Partial<Command>);
    const response = await request({ action: 'execute', namespace: 'test', baseSequence: 1, command: write }); expect(response.status).toBe(200);
    expect((await backend.read(a,'test'))?.data.narratives[0].body).toBe(body);
  });
  it('retries a lost response exactly once and rejects the same id with changed content', async () => {
    const body = { action: 'execute', namespace: 'test', baseSequence: 0, command: command() };
    await request(body); expect((await request(body)).status).toBe(200);
    expect((await backend.read(a, 'test'))?.sequence).toBe(1);
    expect((await request({ ...body, command: command({ name: '다른 원문' } as Partial<Command>) })).status).toBe(400);
  });
  it('rejects stale workspace updates without changing either source', async () => {
    await request({ action: 'execute', namespace: 'test', baseSequence: 0, command: command() });
    const response = await request({ action: 'execute', namespace: 'test', baseSequence: 0, command: command({ id: 'subject-2', opId: 'op-2' }) });
    expect(response.status).toBe(409); expect((await response.json()).server.data.subjects).toHaveLength(1);
  });
  it('denies unauthenticated requests and forged owners and demo uploads', async () => {
    expect((await request({ action: 'load', namespace: 'test' }, 'expired')).status).toBe(401);
    expect((await request({ action: 'execute', namespace: 'test', baseSequence: 0, command: command({ userId: b }) })).status).toBe(403);
    expect((await request({ action: 'load', namespace: 'demo' })).status).toBe(400);
  });
  it('validates hierarchy on the server even when browser checks are bypassed', async () => {
    const op = command({ type: 'addNode', subjectId: 'missing', parentId: null, role: 'topic' } as Partial<Command>);
    expect((await request({ action: 'execute', namespace: 'test', baseSequence: 0, command: op })).status).toBe(400);
    expect(await backend.read(a, 'test')).toBeNull();
  });
  it('enforces entity versions, keeps both attempted and server writing', async () => {
    await request({ action: 'execute', namespace: 'test', baseSequence: 0, command: command() });
    const write = command({ type: 'updateNarrative', id: 'text-1', kind: 'subject-overview', ownerId: 'subject-1', body: '서버 원문', expectedVersion: 0, opId: 'op-2' } as Partial<Command>);
    await request({ action: 'execute', namespace: 'test', baseSequence: 1, command: write });
    const attempted = { ...write, body: '내 수정', opId: 'op-3' };
    expect((await request({ action: 'execute', namespace: 'test', baseSequence: 2, command: attempted })).status).toBe(409);
    expect((await backend.read(a,'test'))?.data.narratives[0].body).toBe('서버 원문'); expect(attempted.body).toBe('내 수정');
  });
  it('SQL compare-and-swap rejects a second racing write and rolls back the receipt', async () => {
    const op = command(), next = applyCommand(emptyState(a,'test'),op);
    await backend.commit(a,'test',0,op,next);
    const other = command({ opId: 'op-2', id: 'subject-2' }), second = applyCommand(emptyState(a,'test'),other);
    await expect(backend.commit(a,'test',0,other,second)).rejects.toThrow('VERSION_CONFLICT');
    expect((await db.query('select * from study_operations')).rows).toHaveLength(1);
  });
  it('RLS exposes only the authenticated owner and refuses direct writes/RPC', async () => {
    await request({ action: 'execute', namespace: 'test', baseSequence: 0, command: command() });
    await db.exec(`set role authenticated; set request.jwt.claim.sub = '${b}';`);
    expect((await db.query('select * from study_workspaces')).rows).toHaveLength(0);
    await db.exec(`set request.jwt.claim.sub = '${a}';`);
    expect((await db.query('select * from study_workspaces')).rows).toHaveLength(1);
    await expect(db.exec("update study_workspaces set sequence=99")).rejects.toThrow('permission denied');
    await expect(db.query('select study_commit($1,$2,$3,$4,$5,$6)',[a,'test',1,'x','x',{}])).rejects.toThrow('permission denied');
    await db.exec('reset role');
  });
  it('database ownership checks reject mixed-owner entity snapshots', async () => {
    const op = command(), next = applyCommand(emptyState(a,'test'),op); next.subjects[0].userId = b;
    await expect(backend.commit(a,'test',0,op,next)).rejects.toThrow(); expect(await backend.read(a,'test')).toBeNull();
  });
});
