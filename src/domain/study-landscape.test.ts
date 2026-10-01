import { expect, it } from 'vitest';
import { createDemoState } from './fixtures';
import { applyCommand } from './commands';
import type { AppState, DateEvidence } from './model';
import { buildStudyLandscape } from './study-landscape';

function record(
  data: AppState,
  sessionId: string,
  targetId = 'demo-topic-function',
  dateEvidence: DateEvidence = { kind: 'exact', date: '2026-10-01' },
) {
  return applyCommand(data, {
    type: 'saveRecords',
    sessionId,
    dateEvidence,
    entries: [{ targetId, done: true }],
    userId: data.userId,
    namespace: data.namespace,
    opId: sessionId,
    at: '2026-10-01T03:00:00Z',
  });
}
it('keeps empty and undated activity separate without inventing a day', () => {
  const blank = createDemoState();
  expect(buildStudyLandscape(blank)).toMatchObject({
    plants: [],
    days: [],
    returns: [],
    undated: false,
  });
  const unknown = buildStudyLandscape(record(blank, 's1', undefined, { kind: 'unknown' }));
  expect(unknown.plants).toHaveLength(1);
  expect(unknown.days).toEqual([]);
  expect(unknown.undated).toBe(true);
  const ranged = buildStudyLandscape(
    record(blank, 's2', undefined, { kind: 'range', from: '2026-09-01', to: '2026-10-01' }),
  );
  expect(ranged.days).toEqual([]);
  expect(ranged.undated).toBe(true);
});
it('counts distinct saved study events, not rows, repeated saves, or long writing', () => {
  let data = record(createDemoState(), 's1');
  const first = buildStudyLandscape(data);
  const duplicateTransport = {
    ...data,
    records: [
      ...data.records,
      { ...data.records[0], id: 'transport-copy', body: '글'.repeat(5000) },
    ],
  };
  expect(buildStudyLandscape(duplicateTransport)).toEqual(first);
  data = record(data, 's2');
  expect(buildStudyLandscape(data).returns).toHaveLength(1);
  expect(buildStudyLandscape(data).plants).toHaveLength(1);
  expect(buildStudyLandscape(data).days).toHaveLength(1);
});
it('uses the current version and tombstone, then restores its scene from the records', () => {
  const data = record(createDemoState(), 's1');
  const before = structuredClone(data);
  const deleted = { ...data.records[0], version: 2, deletedAt: '2026-10-01T04:00:00Z' };
  expect(buildStudyLandscape({ ...data, records: [...data.records, deleted] }).plants).toEqual([]);
  const corrected = {
    ...deleted,
    version: 3,
    deletedAt: null,
    dateEvidence: { kind: 'unknown' as const },
  };
  const scene = buildStudyLandscape({ ...data, records: [corrected, ...data.records] });
  expect(scene.plants).toHaveLength(1);
  expect(scene.days).toEqual([]);
  expect(data).toEqual(before);
});
it('rejects foreign accounts, namespaces, deleted parents, and out-of-scope subjects', () => {
  const data = record(createDemoState(), 's1');
  expect(buildStudyLandscape({ ...data, userId: 'other' }).plants).toEqual([]);
  expect(buildStudyLandscape({ ...data, namespace: 'test' }).plants).toEqual([]);
  expect(buildStudyLandscape(data, ['demo-subject-science']).plants).toEqual([]);
  expect(
    buildStudyLandscape({
      ...data,
      sessions: data.sessions.map((session) => ({ ...session, deletedAt: 'deleted' })),
    }).plants,
  ).toEqual([]);
});
it('renders valid exact dates only, with bounded gaps that do not change on tomorrow or reload', () => {
  let data = record(createDemoState(), 's1', undefined, { kind: 'exact', date: '2026-09-01' });
  data = record(data, 's2', undefined, { kind: 'exact', date: '2026-10-01' });
  const scene = buildStudyLandscape(data);
  expect(scene.days.map((day) => day.spacing)).toEqual([1, 4]);
  expect(buildStudyLandscape(JSON.parse(JSON.stringify(data)))).toEqual(scene);
  const invalid = {
    ...data,
    records: data.records.map((row) => ({
      ...row,
      dateEvidence: { kind: 'exact' as const, date: '2026-02-30' },
    })),
  };
  expect(buildStudyLandscape(invalid).days).toEqual([]);
  expect(buildStudyLandscape(invalid).undated).toBe(true);
});
it('bounds accumulation and is invariant to transport order across ten thousand records', () => {
  const base = record(createDemoState(), 's1');
  const data = {
    ...base,
    records: Array.from({ length: 10000 }, (_, index) => ({
      ...base.records[0],
      id: `r${index}`,
      targetId: `t${index}`,
      dateEvidence: {
        kind: 'exact' as const,
        date: `2026-09-${String(1 + (index % 30)).padStart(2, '0')}`,
      },
    })),
  };
  const scene = buildStudyLandscape(data);
  expect(scene.plants).toHaveLength(12);
  expect(scene.days).toHaveLength(12);
  expect(buildStudyLandscape({ ...data, records: data.records.slice().reverse() })).toEqual(scene);
});
it('does not turn unchecked empty entries into activity, but preserves saved free writing', () => {
  const data = record(createDemoState(), 's1');
  const unchecked = {
    ...data,
    records: data.records.map((row) => ({ ...row, done: false, body: '', trace: {} })),
  };
  expect(buildStudyLandscape(unchecked).plants).toEqual([]);
  expect(
    buildStudyLandscape({
      ...unchecked,
      records: unchecked.records.map((row) => ({
        ...row,
        body: '모르겠다는 원문도 활동 기록이다.',
      })),
    }).plants,
  ).toHaveLength(1);
});
