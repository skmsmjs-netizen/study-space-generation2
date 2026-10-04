// @vitest-environment node
import { afterEach, expect, it, vi } from 'vitest';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { applyCommand } from '../domain/commands';
import { DomainError, emptyState, type Command } from '../domain/model';
import { emptyRecommendations } from '../domain/recommendation-workspace';
import { statistics, statisticBounds } from '../domain/statistics';
import { openPersonalRepository } from './indexed-personal-journal';
import { type OnlineTransport, personalJournalKey } from './personal-repository';
import {
  checkFullBackup,
  createFullBackup,
  restoreFullBackup,
  type BackupEnvironment,
} from './full-backup';
import { storagePrefix } from './repository';

class IsolatedStorage implements Storage {
  private values = new Map<string, string>();
  get length() {
    return this.values.size;
  }
  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
  removeItem(key: string) {
    this.values.delete(key);
  }
  clear() {
    this.values.clear();
  }
}
const environment = (): BackupEnvironment => ({
  local: new IsolatedStorage(),
  session: new IsolatedStorage(),
  factory: new IDBFactory(),
});
afterEach(() => vi.unstubAllGlobals());

it('keeps a synthetic semester intact through offline weeks, lost receipts, edits, recall and clean-device restore', async () => {
  // Fifteen synthetic weeks are a test fixture, never an actual course calendar.
  const owner = { userId: 'semester-fixture-owner', namespace: 'test' as const };
  const env = environment();
  vi.stubGlobal('IDBKeyRange', IDBKeyRange);
  vi.stubGlobal('indexedDB', env.factory);
  let server = { sequence: 0, data: emptyState(owner.userId, owner.namespace) };
  let offline = false,
    loseReceipt = false;
  const transport: OnlineTransport = {
    load: async () => server,
    execute: async (command, base) => {
      if (offline) throw new Error('synthetic offline');
      if (server.data.appliedOps[command.opId]) {
        applyCommand(server.data, command);
        return server;
      }
      if (server.sequence !== base)
        throw new DomainError('VERSION_CONFLICT', 'synthetic concurrent edit');
      server = { sequence: server.sequence + 1, data: applyCommand(server.data, command) };
      if (loseReceipt) {
        loseReceipt = false;
        throw new Error('synthetic lost receipt');
      }
      return server;
    },
  };
  let repo = await openPersonalRepository(env.local, transport, server, env.factory);
  let operation = 0;
  const cmd = (value: Record<string, unknown>, at = '2026-09-04T09:00:00Z') =>
    ({
      ...value,
      ...owner,
      at,
      opId: 'semester-op-' + ++operation,
    }) as Command;
  const setup: Command[] = [
    cmd({ type: 'addSemester', id: 'term', name: '격리 학기 — 실제 공부 아님' }),
  ];
  for (let subject = 0; subject < 3; subject++) {
    setup.push(
      cmd({
        type: 'addSubject',
        id: 'subject-' + subject,
        name: '합성 과목 ' + subject,
        scope: { kind: 'semester', semesterId: 'term' },
      }),
    );
    for (let topic = 0; topic < 6; topic++)
      setup.push(
        cmd({
          type: 'addNode',
          id: 'topic-' + subject + '-' + topic,
          subjectId: 'subject-' + subject,
          parentId: null,
          role: 'topic',
          name: '합성 주제 ' + topic,
        }),
      );
  }
  repo.executeMany(setup);
  await repo.flush();
  const checkpoints: Record<string, unknown>[] = [];
  const originalBodies = new Map<string, string>();
  for (let week = 0; week < 15; week++) {
    const date = new Date(Date.UTC(2026, 8, 4 + week * 7)).toISOString().slice(0, 10);
    const at = date + 'T09:00:00Z';
    offline = week === 4 || week === 11;
    loseReceipt = week === 8;
    const entries = Array.from({ length: 3 }, (_, subject) => {
      const body = '  격리 기록 ' + week + '/' + subject + '\r\n조건·예외 보존\u0000\ud800  ';
      originalBodies.set('topic-' + subject + '-' + (week % 6) + ':' + week, body);
      return {
        targetId: 'topic-' + subject + '-' + (week % 6),
        done: false,
        body,
        trace: { T1: { status: subject < 2 ? 'checked' : 'deferred' } },
      };
    });
    const study = cmd(
      {
        type: 'saveRecords',
        sessionId: 'week-' + week,
        dateEvidence: { kind: 'exact', date },
        entries,
      },
      at,
    );
    repo.execute(study);
    await repo.flush();
    if (offline) {
      expect(repo.getStatus().phase).toBe('error');
      const retained = repo.getSnapshot();
      await repo.close();
      repo = await openPersonalRepository(env.local, transport, server, env.factory, true);
      expect(repo.getSnapshot()).toEqual(retained);
      expect(repo.getStatus().pending).toBeGreaterThan(0);
      offline = false;
      await repo.flush();
    }
    if (week === 8) {
      expect(repo.getStatus().pending).toBeGreaterThan(0);
      await repo.flush();
    }
    // Replaying exactly the same write must not create a second study event.
    const beforeRetry = repo.getSnapshot();
    repo.execute(study);
    await repo.flush();
    expect(repo.getSnapshot().sessions.length).toBe(beforeRetry.sessions.length);
    expect(repo.getSnapshot().revisions.length).toBe(beforeRetry.revisions.length);
    expect(repo.getStatus().phase).toBe('saved');
    if (week === 7) {
      const topic = repo.getSnapshot().nodes.find((row) => row.id === 'topic-0-0')!;
      repo.execute(
        cmd(
          {
            type: 'renameNode',
            id: topic.id,
            name: '개정 — 원래 ID 유지',
            expectedVersion: topic.version,
          },
          at,
        ),
      );
      await repo.flush();
    }
    checkpoints.push({
      week: week + 1,
      date,
      records: repo.getSnapshot().records.length,
      sessions: repo.getSnapshot().sessions.length,
      pending: repo.getStatus().pending,
    });
  }
  const card = cmd({
    type: 'saveRecallCard',
    id: 'recall',
    topicId: 'topic-0-0',
    front: '  기존 질문\n ',
    reference: '원문 기준',
    expectedVersion: 0,
  });
  repo.execute(card);
  await repo.flush();
  repo.execute(
    cmd(
      {
        type: 'reviewRecallCard',
        id: 'recall',
        topicId: 'topic-0-0',
        expectedVersion: 1,
        rating: 3,
        at: '2026-12-18T09:00:00Z',
      },
      '2026-12-18T09:00:00Z',
    ),
  );
  await repo.flush();
  repo.execute(
    cmd({
      type: 'saveCanvasLayout',
      id: 'layout',
      expectedVersion: 0,
      positions: { 'node:topic-0-0': { x: -240, y: 720 } },
      links: [],
    }),
  );
  repo.execute(
    cmd({
      type: 'saveMemo',
      id: 'memo',
      ownerId: 'topic-0-0',
      body: '  중단 전 자유 글\n다음 질문  ',
      strokes: [],
      expectedVersion: 0,
    }),
  );
  await repo.flush();
  const topic = repo.getSnapshot().nodes.find((row) => row.id === 'topic-0-0')!;
  repo.execute(cmd({ type: 'trashNode', id: topic.id, expectedVersion: topic.version }));
  await repo.flush();
  const trashed = repo.getSnapshot().nodes.find((row) => row.id === topic.id)!;
  repo.execute(cmd({ type: 'restoreNode', id: topic.id, expectedVersion: trashed.version }));
  await repo.flush();
  const data = repo.getSnapshot();
  expect(data.records).toHaveLength(45);
  expect(data.sessions).toHaveLength(15);
  expect(data.nodes).toHaveLength(18);
  for (const record of data.records) {
    const week = Number(record.sessionId.split('-')[1]);
    expect(record.body).toBe(originalBodies.get(record.targetId + ':' + week));
    expect(record.done).toBe(false);
  }
  const metrics = statistics(
    data,
    emptyRecommendations(data),
    { from: '2026-09-01', to: '2026-12-31' },
    '2026-12-31T00:00:00Z',
  );
  const count = (id: string) =>
    statisticBounds(
      metrics.find((metric) => metric.id === id)!,
      '2026-09-01',
      '2026-12-31',
    ).lower;
  expect(count('sessions')).toBe(15);
  expect(count('coverage')).toBe(18);
  expect(count('activities')).toBe(30);
  expect(count('writing')).toBe(45);
  expect(count('successes')).toBe(0);
  expect(count('attempts')).toBe(0);
  const prefix = storagePrefix(owner);
  env.local.setItem(prefix + ':draft:semester', '  미완 초안\r\n\udfff ');
  env.local.setItem(prefix + ':settings', JSON.stringify({ font: 'Georgia', size: 19 }));
  env.local.setItem('study-space:auth:v1', 'synthetic-token-must-not-export');
  await repo.close();
  const bytes = await createFullBackup(owner, env, personalJournalKey(data));
  const checked = await checkFullBackup(bytes, owner);
  expect(checked.data).toEqual(data);
  expect(checked.rows.some((row) => row.key === 'study-space:auth:v1')).toBe(false);
  await expect(checkFullBackup(bytes, { ...owner, userId: 'foreign-owner' })).rejects.toThrow();
  const target = environment();
  await restoreFullBackup(checked, owner, target);
  const restoredTransport = {
    ...transport,
    load: vi.fn(transport.load),
    execute: vi.fn(transport.execute),
  };
  // Restore must work before any server copy is available, not be masked by it.
  repo = await openPersonalRepository(
    target.local,
    restoredTransport,
    { sequence: 0, data: emptyState(owner.userId, owner.namespace) },
    target.factory,
    true,
  );
  expect(restoredTransport.load).not.toHaveBeenCalled();
  expect(repo.getSnapshot()).toEqual(data);
  expect(target.local.getItem(prefix + ':draft:semester')).toBe(
    env.local.getItem(prefix + ':draft:semester'),
  );
  expect(target.local.getItem(prefix + ':settings')).toBe(env.local.getItem(prefix + ':settings'));
  expect(repo.getSnapshot().canvasLayouts![0].positions).toEqual({
    'node:topic-0-0': { x: -240, y: 720 },
  });
  expect(repo.getSnapshot().recallCards![0].reviews).toHaveLength(1);
  await repo.flush();
  expect(repo.getStatus().phase).toBe('saved');
  expect(restoredTransport.execute).not.toHaveBeenCalled();
  await repo.close();
  const reportPath = process.env.STUDY_SEMESTER_REPORT;
  if (reportPath) {
    await mkdir(dirname(reportPath), { recursive: true });
    await writeFile(
      reportPath,
      JSON.stringify(
        {
          kind: 'synthetic-semester-storage-regression',
          actualStudy: false,
          actualAPI: false,
          productionWrites: false,
          weeks: 15,
          subjects: 3,
          topics: 18,
          records: 45,
          sessions: 15,
          checkedActivities: 30,
          independentAttempts: 0,
          independentSuccesses: 0,
          checkpoints,
          backupBytes: bytes.length,
          verified: [
            'offline-reopen',
            'lost-receipt-retry',
            'idempotent-study-write',
            'rename-stable-id',
            'trash-restore',
            'recall-review',
            'personal-layout',
            'raw-UTF16',
            'owner-isolation',
            'backup-clean-environment',
            'credentials-excluded',
          ],
        },
        null,
        2,
      ) + '\n',
    );
  }
}, 30000);
