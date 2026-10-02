import { expect, it } from 'vitest';
import {
  observatoryEvolution,
  buildObservatoryEvolution,
  OBSERVATORY_STAGES,
} from './observatory-evolution';
import { createDemoState } from './fixtures';
import { applyCommand } from './commands';
import { buildStudyLandscape } from './study-landscape';
import { studyInputDay } from './daily-study-dynamics';

const base = createDemoState();
const data = applyCommand(base, {
  type: 'saveRecords',
  sessionId: 'event',
  dateEvidence: { kind: 'unknown' },
  entries: [{ targetId: 'demo-topic-function', done: true }],
  userId: base.userId,
  namespace: base.namespace,
  at: '2026-10-01T03:00:00Z',
  opId: 'event',
});
const day = studyInputDay('2026-10-01T03:00:00Z') ?? 0;
it('has an exact model-to-scene mapping at every one of the twelve anchors', () => {
  for (let stage = 0; stage < OBSERVATORY_STAGES; stage++) {
    const state = observatoryEvolution(2 ** stage - 1);
    expect(state.stage).toBe(stage);
    expect(state.position).toBe(stage);
    expect(state.blend).toBe(0);
    expect(state.stars).toBe(16 + 18 * stage);
  }
});
it('interpolates inside a stage and bounds development as records accumulate', () => {
  const a = observatoryEvolution(19),
    b = observatoryEvolution(30);
  expect(a.stage).toBe(4);
  expect(b.stage).toBe(4);
  expect(a.blend).toBeGreaterThan(0);
  expect(a.blend).toBeLessThan(b.blend);
  expect(a.dust).toBeGreaterThan(0);
  expect(a.dust).toBeLessThan(b.dust);
  expect(b.dust).toBeLessThan(1);
  for (const n of [0, 1, 100, 2047, 10000, Number.MAX_SAFE_INTEGER]) {
    const value = observatoryEvolution(n);
    expect(value.stage).toBeLessThan(12);
    expect(value.stars).toBeLessThanOrEqual(214);
    expect(value.orbits).toBeLessThanOrEqual(6);
    for (const key of [
      'halo',
      'dust',
      'nebula',
      'galaxy',
      'aurora',
      'meteorShower',
      'colorBloom',
      'lightRibbons',
      'supernova',
      'satellite',
      'planet',
      'eclipse',
      'crown',
    ] as const) {
      expect(value[key]).toBeGreaterThanOrEqual(0);
      expect(value[key]).toBeLessThanOrEqual(1);
    }
  }
});
it('counts distinct event-target inputs rather than duplicate rows, body length or guessed study dates', () => {
  const row = data.records[0],
    first = buildObservatoryEvolution(data.records, day);
  expect(first.inputCount).toBe(1);
  expect(
    buildObservatoryEvolution(
      [
        row,
        {
          ...row,
          id: 'duplicate',
          body: '글'.repeat(10000),
          createdAt: '2026-09-30T03:00:00Z',
          dateEvidence: { kind: 'exact', date: '2020-01-01' },
        },
      ],
      day,
    ),
  ).toEqual(first);
  expect(
    buildObservatoryEvolution(
      [...data.records, { ...row, id: 'another', sessionId: 'another-event' }],
      day,
    ).inputCount,
  ).toBe(2);
});
it('ignores unknown input timestamps and future inputs without guessing study dates', () => {
  const row = data.records[0];
  expect(
    buildObservatoryEvolution(
      [
        { ...row, createdAt: 'invalid' },
        { ...row, createdAt: '2026-10-02T03:00:00Z' },
      ],
      day,
    ).inputCount,
  ).toBe(0);
});
it('keeps development through quiet calendar gaps while the daily motion can relax', () => {
  const before = buildStudyLandscape(data, undefined, day),
    after = buildStudyLandscape(data, undefined, day + 90);
  expect(after.evolution).toEqual(before.evolution);
  expect(after.dynamics.recent[0]).toBeLessThan(before.dynamics.recent[0]);
});
it('honors canonical ownership, scopes, tombstones and record restoration', () => {
  expect(
    buildStudyLandscape({ ...data, userId: 'other' }, undefined, day).evolution.inputCount,
  ).toBe(0);
  expect(buildStudyLandscape(data, ['demo-subject-science'], day).evolution.inputCount).toBe(0);
  const deleted = { ...data.records[0], version: 2, deletedAt: '2026-10-01T04:00:00Z' };
  expect(
    buildStudyLandscape({ ...data, records: [...data.records, deleted] }, undefined, day).evolution
      .inputCount,
  ).toBe(0);
  expect(
    buildStudyLandscape(
      { ...data, records: [...data.records, deleted, { ...deleted, version: 3, deletedAt: null }] },
      undefined,
      day,
    ).evolution.inputCount,
  ).toBe(1);
});
it('is replay/order invariant and leaves originals unchanged', () => {
  const original = structuredClone(data);
  expect(buildObservatoryEvolution(data.records.slice().reverse(), day)).toEqual(
    buildObservatoryEvolution(data.records, day),
  );
  expect(data).toEqual(original);
});
it('rejects invalid development counters and calendars', () => {
  for (const n of [-1, 0.5, NaN, Infinity])
    expect(() => observatoryEvolution(n)).toThrow(RangeError);
  expect(() => buildObservatoryEvolution([], NaN)).toThrow(RangeError);
});

it('opens late supernova effects gradually while earlier scenes retain their own colors', () => {
  expect(observatoryEvolution(255).supernova).toBe(0);
  const early = observatoryEvolution(600),
    late = observatoryEvolution(900);
  expect(early.stage).toBe(9);
  expect(late.stage).toBe(9);
  expect(early.supernova).toBeGreaterThan(0);
  expect(late.supernova).toBeGreaterThan(early.supernova);
  expect(observatoryEvolution(1023).supernova).toBe(1);
  expect(observatoryEvolution(0).colorBloom).toBe(0);
  expect(observatoryEvolution(127).lightRibbons).toBe(1);
});

it('brings detailed celestial layers in continuously and preserves exact late anchors', () => {
  for (const [field, start] of [
    ['satellite', 2],
    ['planet', 4],
    ['eclipse', 7],
    ['crown', 10],
  ] as const) {
    expect(observatoryEvolution(2 ** start - 1)[field]).toBe(0);
    expect(observatoryEvolution(2 ** (start + 1) - 1)[field]).toBe(1);
    const count = Math.floor(2 ** (start + 0.5) - 1);
    expect(observatoryEvolution(count)[field]).toBeGreaterThan(0);
    expect(observatoryEvolution(count)[field]).toBeLessThan(1);
  }
});
