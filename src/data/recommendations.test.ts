import { beforeEach, describe, expect, it } from 'vitest';
import { createDemoState } from '../domain/fixtures';
import { applyCommand } from '../domain/commands';
import { dateDeadline, emptyRecommendations, emptyResponse, makeResultEvent, nextStudy, readRecommendations, recommendationInput, recommendationKey, saveRecommendations, termPeriod, type CheckGoal } from './recommendations';
import { canonicalEvents, recommend, reduceRequirement, validateModel } from '../domain/recommendation-kernel.mjs';
const now = '2026-09-30T00:00:00Z';
const targetId = 'demo-topic-function';
const goal: CheckGoal = { id: 'check-1', targetId, label: '조건을 설명하기', dueDate: '', novelty: 'new', createdAt: now, ended: false };
const setup = () => { const data = createDemoState(), workspace = emptyRecommendations(data); workspace.goals.push({ ...goal }); return { data, workspace }; };
beforeEach(() => localStorage.clear());
describe('recommendation connection and preservation', () => {
  it('keeps study attempts with unknown dates separate from performance', () => {
    const s = setup();
    s.data = applyCommand(s.data, { type: 'saveRecords', sessionId: 'session-1', entries: [{ targetId, done: true, body: '  원문\r\n조건은 아직 모르겠음' }], dateEvidence: { kind: 'unknown' }, userId: s.data.userId, namespace: 'demo', opId: 'record-1', at: now });
    const before = JSON.stringify(s.data), input = recommendationInput(s.data, s.workspace);
    expect(input.events[0].occurredAt).toBeNull(); expect(input.events[0].sourceDateEvidence).toEqual({ kind: 'unknown' });
    const out = nextStudy(s.data, s.workspace, now);
    expect(out.states[goal.id].status).toBe('activity_only'); expect(out.states[goal.id].current).toBe(false);
    expect(out.termDays).toBeNull(); expect(out.cards).toHaveLength(1); expect(JSON.stringify(s.data)).toBe(before);
  });
  it('does not confirm default, assisted or same-item responses against a transfer goal', () => {
    const { data, workspace } = setup();
    for (const response of [emptyResponse(), { ...emptyResponse(), result: 'pass' as const, novelty: 'new' as const, assistance: 'notes' as const }, { ...emptyResponse(), result: 'pass' as const, novelty: 'same' as const, assistance: 'none' as const }]) {
      workspace.events = [makeResultEvent(goal, response, workspace, now, 'result')];
      expect(nextStudy(data, workspace, now).states[goal.id].status).not.toBe('confirmed');
    }
    workspace.events = [makeResultEvent(goal, { result: 'pass', novelty: 'new', assistance: 'none', answer: '自由文\n  条件' }, workspace, now, 'result')];
    expect(nextStudy(data, workspace, now).states[goal.id].status).toBe('confirmed');
    expect(nextStudy(data, workspace, now).cards).toHaveLength(0);
  });
  it('roundtrips drafts and self-reported results without changing the original workspace key', () => {
    const { data, workspace } = setup(); localStorage.setItem('study-space:demo:v1', 'original raw');
    workspace.draft.label = '  작성 중\r\n예외 포함  '; workspace.responses[goal.id] = { ...emptyResponse(), answer: '미완 답변\n  이유' }; workspace.revision = 1;
    const raw = saveRecommendations(data, workspace, null);
    expect(readRecommendations(data)).toEqual({ raw, workspace }); expect(localStorage.getItem('study-space:demo:v1')).toBe('original raw');
  });
  it('refuses corrupt, foreign-owner, and stale writes while preserving their raw data', () => {
    const { data, workspace } = setup(), key = recommendationKey(data);
    for (const raw of ['{broken original', JSON.stringify({ ...workspace, userId: 'other-user' }), JSON.stringify({ ...workspace, namespace: 'personal' })]) {
      localStorage.setItem(key, raw); expect(() => readRecommendations(data)).toThrow(); expect(localStorage.getItem(key)).toBe(raw);
      expect(() => saveRecommendations(data, workspace, null)).toThrow(); expect(localStorage.getItem(key)).toBe(raw);
    }
  });
  it('does not alter stored results when storage is full', () => {
    const { data, workspace } = setup(); const raw = JSON.stringify(workspace);
    const storage = { getItem: () => raw, setItem: () => { throw new DOMException('full', 'QuotaExceededError'); } };
    expect(() => saveRecommendations(data, { ...workspace, revision: 1 }, raw, storage)).toThrow(); expect(storage.getItem()).toBe(raw);
  });
  it('filters suggestions by the active subject scope and respects removal of topics', () => {
    const { data, workspace } = setup(); expect(nextStudy(data, workspace, now, ['demo-subject-science']).cards).toHaveLength(0);
    data.nodes.find(n => n.id === targetId)!.deletedAt = now;
    expect(nextStudy(data, workspace, now).cards).toHaveLength(0); expect(workspace.goals[0].label).toBe(goal.label);
  });
  it('uses an explicitly selected semester period without inventing dates from its name', () => {
    const { data, workspace } = setup(); workspace.terms = { 'demo-semester-current': { start: '2026-09-01', end: '2026-12-21' } };
    expect(nextStudy(data, workspace, now, undefined, 'demo-semester-current')).toMatchObject({ termDays: 112, calendarWeek: 5, phase: 'in_term' });
    expect(nextStudy(data, workspace, now, undefined, 'all')).toMatchObject({ termDays: null, calendarWeek: null, phase: 'unspecified' });
    expect(dateDeadline('')).toBeNull(); expect(dateDeadline('2026-09-30')).toBe('2026-09-30T14:59:59.999Z');
    expect(() => dateDeadline('2026-02-30')).toThrow(); expect(() => termPeriod({ start: '2026-09-01', end: '' })).toThrow();
  });
});
describe('review counterexamples corrected in the connected kernel', () => {
  it('does not resurrect an old pass when its latest revision moves the occurrence into the future', () => {
    const { workspace } = setup(); const event = makeResultEvent(goal, { result: 'pass', assistance: 'none', novelty: 'new', answer: '' }, workspace, now, 'result');
    expect(canonicalEvents([event, { ...event, revision: 2, occurredAt: '2026-10-01T00:00:00Z' }], now, now)).toHaveLength(0);
  });
  it('keeps a linked correction even after a correction unrelated to that failure', () => {
    const { data, workspace } = setup(), r = recommendationInput(data, workspace).model.requirements[0];
    const event = makeResultEvent(goal, { result: 'fail', assistance: 'none', novelty: 'new', answer: '' }, workspace, now, 'failure');
    const events = [event, { ...event, id: 'linked', sequence: 2, kind: 'correction' as const, errorEventId: event.id }, { ...event, id: 'unrelated', sequence: 3, kind: 'correction' as const, errorEventId: 'other-failure' }];
    expect(reduceRequirement(r, events, now)).toMatchObject({ status: 'corrected_pending', evidenceIds: ['failure', 'linked'] });
  });
  it('refills the three visible cards after a snooze without changing evidence', () => {
    const { data, workspace } = setup(), base = recommendationInput(data, workspace).model;
    const model = { ...base, targets: Array.from({ length: 4 }, (_, i) => ({ id: `t${i}`, prerequisites: [] })), requirements: Array.from({ length: 4 }, (_, i) => ({ ...base.requirements[0], id: `r${i}`, targetId: `t${i}` })), assessments: [{ ...base.assessments[0], requirementIds: ['r0', 'r1', 'r2', 'r3'] }] };
    const out = recommend(model, [], now, now, { 'target:t0': { snoozeUntil: '2026-10-01T00:00:00Z' } });
    expect(out.cards.map(c => c.targetId)).toEqual(['t1', 't2', 't3']); expect(out.states.r0.status).toBe('unobserved');
  });
  it('adds distinct evaluation relevance to a shared prerequisite only once', () => {
    const { data, workspace } = setup(), base = recommendationInput(data, workspace).model;
    const model = { ...base, targets: [{ id: 'p', prerequisites: [] }, { id: 'a', prerequisites: ['p'] }, { id: 'b', prerequisites: ['p'] }], requirements: ['p', 'a', 'b'].map(id => ({ ...base.requirements[0], id, targetId: id })), assessments: [{ ...base.assessments[0], id: 'a-exam', weight: .3, requirementIds: ['a'] }, { ...base.assessments[0], id: 'b-exam', weight: .4, requirementIds: ['b'] }] };
    // Unknown deadlines are zero urgency; set the same deadline to compare relevance.
    model.assessments.forEach(a => { a.dueAt = now; });
    expect(recommend(model, [], now).cards[0]).toMatchObject({ targetId: 'p', score: .7, relatedIds: ['a-exam', 'b-exam'] });
  });
  it('rejects nonfinite delays and timestamps with unspecified zones', () => {
    const { data, workspace } = setup(), base = recommendationInput(data, workspace).model;
    expect(() => validateModel({ ...base, requirements: [{ ...base.requirements[0], minDelayDays: Infinity }] })).toThrow();
    expect(() => recommend(base, [], '2026-09-30T00:00:00')).toThrow('INVALID_TIMESTAMP');
  });
});
