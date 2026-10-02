import { describe, expect, it } from 'vitest';
import { applyCommand } from './commands';
import { studyInputDay } from './daily-study-dynamics';
import { createDemoState } from './fixtures';
import type { StudyRecord } from './model';
import { buildObservatoryEvolution } from './observatory-evolution';
import { buildObservatoryResponse } from './observatory-response';
import { buildStudyLandscape } from './study-landscape';

const at = (day: number) => studyInputDay(`2026-09-${String(day).padStart(2, '0')}T03:00:00Z`) ?? 0;
const entry = (id: string, day: number): StudyRecord => ({
  id,
  sessionId: id,
  targetId: 'one-topic',
  subjectId: 'subject',
  userId: 'owner',
  namespace: 'test',
  createdAt: `2026-09-${String(day).padStart(2, '0')}T03:00:00Z`,
  updatedAt: '2026-10-01T00:00:00Z',
  version: 1,
  deletedAt: null,
  done: true,
  body: '',
  trace: {},
  dateEvidence: { kind: 'unknown' },
});
const responseKeys = ['density', 'earlyGlimmer', 'activity'] as const;

describe('small permanent rewards and recent input density', () => {
  it('shows strictly stronger small responses for zero, one and two distinct inputs', () => {
    const empty = buildObservatoryResponse([], at(10));
    const one = buildObservatoryResponse([entry('one', 10)], at(10));
    const two = buildObservatoryResponse([entry('one', 10), entry('two', 10)], at(10));
    expect(empty).toEqual({
      inputCount: 0,
      recentInputRate: 0,
      density: 0,
      earlyGlimmer: 0,
      activity: 0,
    });
    expect(one.inputCount).toBe(1);
    expect(two.inputCount).toBe(2);
    for (const key of responseKeys) {
      expect(one[key]).toBeGreaterThan(empty[key]);
      expect(two[key]).toBeGreaterThan(one[key]);
      expect(two[key]).toBeLessThan(0.5);
    }
    expect(one.recentInputRate).toBeCloseTo(-Math.expm1(-1 / 3), 14);
    expect(two.recentInputRate).toBeCloseTo(2 * one.recentInputRate, 14);
  });

  it('distinguishes the same total spread over old days from concentrated recent input days', () => {
    const spread = buildObservatoryResponse(
      [entry('one', 1), entry('two', 4), entry('three', 7)],
      at(10),
    );
    const recent = buildObservatoryResponse(
      [entry('one', 9), entry('two', 10), entry('three', 10)],
      at(10),
    );
    expect(recent.inputCount).toBe(spread.inputCount);
    expect(recent.earlyGlimmer).toBe(spread.earlyGlimmer);
    expect(recent.recentInputRate).toBeGreaterThan(spread.recentInputRate);
    expect(recent.density).toBeGreaterThan(spread.density);
    expect(recent.activity).toBeGreaterThan(spread.activity);
  });

  it('keeps permanent early details when recent movement relaxes during a quiet interval', () => {
    const records = [entry('one', 1), entry('two', 2)];
    const fresh = buildObservatoryResponse(records, at(2));
    const quiet = buildObservatoryResponse(records, at(2) + 90);
    expect(quiet.inputCount).toBe(fresh.inputCount);
    expect(quiet.earlyGlimmer).toBe(fresh.earlyGlimmer);
    expect(quiet.density).toBeLessThan(fresh.density);
    expect(quiet.activity).toBeGreaterThanOrEqual(0.25 * fresh.earlyGlimmer);
    expect(quiet.density).toBeGreaterThanOrEqual(0);
  });

  it('caps one-day density without losing permanent evidence or adding text-length rewards', () => {
    const records = Array.from({ length: 10000 }, (_, index) => entry(`input-${index}`, 10));
    const twelve = buildObservatoryResponse(records.slice(0, 12), at(10));
    const many = buildObservatoryResponse(records, at(10));
    expect(many.inputCount).toBe(10000);
    expect(many.recentInputRate).toBe(twelve.recentInputRate);
    expect(many.density).toBe(twelve.density);
    expect(
      buildObservatoryResponse(
        records.map((record) => ({ ...record, body: '글'.repeat(5000) })),
        at(10),
      ),
    ).toEqual(many);
    for (const key of responseKeys) {
      expect(many[key]).toBeGreaterThanOrEqual(0);
      expect(many[key]).toBeLessThanOrEqual(1);
    }
    expect(many.recentInputRate).toBeLessThanOrEqual(12);
  });

  it('counts an event-target once across transport copies and days without rewarding later replays', () => {
    const original = entry('one', 1);
    const copy = {
      ...original,
      id: 'copy',
      createdAt: entry('unused', 10).createdAt,
      body: '글'.repeat(10000),
    };
    const baseline = buildObservatoryResponse([original], at(10));
    expect(buildObservatoryResponse([original, copy, original], at(10))).toEqual(baseline);
    expect(buildObservatoryResponse([copy, original], at(10))).toEqual(baseline);
    expect(
      buildObservatoryResponse([{ ...original, targetId: 'two-topic' }, original], at(10))
        .inputCount,
    ).toBe(2);
  });

  it('uses known input timestamps without guessing study dates and excludes unknown or future input days', () => {
    const known = entry('known', 10);
    const invalid = { ...entry('invalid', 1), createdAt: 'unknown' };
    const future = entry('future', 11);
    const records = [known, invalid, future];
    const result = buildObservatoryResponse(records, at(10));
    expect(result).toEqual(buildObservatoryResponse([known], at(10)));
    expect(result.inputCount).toBe(buildObservatoryEvolution(records, at(10)).inputCount);
    expect(
      buildObservatoryResponse(
        [{ ...known, dateEvidence: { kind: 'exact', date: '2020-01-01' } }],
        at(10),
      ),
    ).toEqual(result);
    expect(buildObservatoryResponse([invalid, future], at(10)).activity).toBe(0);
    const nextKstDay = { ...known, createdAt: '2026-09-10T16:00:00Z' };
    expect(buildObservatoryResponse([nextKstDay], at(10)).inputCount).toBe(0);
    expect(buildObservatoryResponse([nextKstDay], at(11)).inputCount).toBe(1);
  });

  it('stays bounded over repeated high-volume days and stable across long sparse histories', () => {
    const records = Array.from({ length: 360 }, (_, index) =>
      entry(`daily-${index}`, 1 + Math.floor(index / 12)),
    );
    const result = buildObservatoryResponse(records, at(30));
    expect(result.recentInputRate).toBeLessThanOrEqual(12);
    expect(result.recentInputRate).toBeGreaterThan(11);
    for (const key of responseKeys) {
      expect(Number.isFinite(result[key])).toBe(true);
      expect(result[key]).toBeGreaterThanOrEqual(0);
      expect(result[key]).toBeLessThanOrEqual(1);
    }
    expect(buildObservatoryResponse(records.slice().reverse(), at(30))).toEqual(result);
    expect(buildObservatoryResponse(records, at(30) + 100000).density).toBe(0);
    for (const invalid of [NaN, Infinity, -Infinity, 0.5, Number.MAX_SAFE_INTEGER + 1])
      expect(() => buildObservatoryResponse(records, invalid)).toThrow(RangeError);
  });

  it('uses the real canonical owner/scope/tombstone selection and recalculates corrections', () => {
    const base = createDemoState();
    const data = applyCommand(base, {
      type: 'saveRecords',
      sessionId: 'response-event',
      dateEvidence: { kind: 'unknown' },
      entries: [{ targetId: 'demo-topic-function', done: true }],
      userId: base.userId,
      namespace: base.namespace,
      at: '2026-09-10T03:00:00Z',
      opId: 'response-event',
    });
    const original = structuredClone(data);
    expect(buildStudyLandscape(data, undefined, at(10)).response.inputCount).toBe(1);
    expect(
      buildStudyLandscape({ ...data, userId: 'other' }, undefined, at(10)).response.inputCount,
    ).toBe(0);
    expect(
      buildStudyLandscape({ ...data, namespace: 'test' }, undefined, at(10)).response.inputCount,
    ).toBe(0);
    expect(buildStudyLandscape(data, ['demo-subject-science'], at(10)).response.inputCount).toBe(0);
    const deleted = { ...data.records[0], version: 2, deletedAt: '2026-09-10T04:00:00Z' };
    expect(
      buildStudyLandscape({ ...data, records: [...data.records, deleted] }, undefined, at(10))
        .response.inputCount,
    ).toBe(0);
    const restored = { ...deleted, version: 3, deletedAt: null };
    expect(
      buildStudyLandscape(
        { ...data, records: [restored, deleted, ...data.records] },
        undefined,
        at(10),
      ).response.inputCount,
    ).toBe(1);
    const empty = { ...restored, version: 4, done: false, trace: {}, body: '' };
    expect(
      buildStudyLandscape({ ...data, records: [...data.records, empty] }, undefined, at(10))
        .response.activity,
    ).toBe(0);
    expect(data).toEqual(original);
  });
});
