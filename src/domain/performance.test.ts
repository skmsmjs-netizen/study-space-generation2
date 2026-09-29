import { it, expect } from 'vitest';
import { performance } from 'node:perf_hooks';
import { applyCommand, validateState } from './commands';
import { emptyState, type AppState, type Entity, type StudyRecord } from './model';

/** Explicit synthetic benchmark. Opt in; not a claim about browser typing or Sync. */
export function makeLargeFixture(): AppState {
  const state = emptyState('performance-user', 'test');
  const stamp = '2026-09-29T00:00:00.000Z';
  const entity = (id: string): Entity => ({ id, userId: state.userId, namespace: 'test', createdAt: stamp, updatedAt: stamp, version: 1, deletedAt: null });
  for (let term = 0; term < 8; term++) {
    state.semesters.push({ ...entity(`term-${term}`), name: `합성 학기 ${term}`, order: term });
    for (let sub = 0; sub < 10; sub++) {
      const id = `subject-${term}-${sub}`;
      state.subjects.push({ ...entity(id), scope: { kind: 'semester', semesterId: `term-${term}` }, name: `동명 시험 과목 ${sub}`, order: sub });
      state.nodes.push({ ...entity(`unit-${id}`), subjectId: id, parentId: null, role: 'unit', name: '시험 단원', order: 0 });
      for (let topic = 0; topic < 10; topic++) state.nodes.push({ ...entity(`topic-${id}-${topic}`), subjectId: id, parentId: `unit-${id}`, role: 'topic', name: `대량 자료용 가짜 주제 ${topic}`, order: topic });
    }
  }
  const topics = state.nodes.filter(n => n.role === 'topic');
  for (let index = 0; index < 10000; index++) {
    const target = topics[index % topics.length];
    state.sessions.push({ ...entity(`session-${index}`), dateEvidence: { kind: 'exact', date: '2026-09-28' } });
    const row: StudyRecord = { ...entity(`record-${index}`), sessionId: `session-${index}`, subjectId: target.subjectId, targetId: target.id, body: `가짜 기록 ${index}\n` + '연습 문장. '.repeat(20), done: true, dateEvidence: { kind: 'exact', date: '2026-09-28' }, trace: { Td1: { status: 'checked' } } };
    state.records.push(row);
    state.revisions.push({ ...entity(`revision-${index}`), collection: 'records', entityId: row.id, operationId: `seed-${index}`, parentRevisionId: null, before: null, after: structuredClone(row) });
  }
  return state;
}
it.skipIf(process.env.DOMAIN_BENCH !== '1')('profiles validation and one body edit at 10,000 synthetic records', () => {
  const state = makeLargeFixture();
  const validation: number[] = [], command: number[] = [];
  for (let run = 0; run < 3; run++) {
    let start = performance.now(); validateState(state); validation.push(performance.now() - start);
    start = performance.now();
    const next = applyCommand(state, { type: 'updateRecord', id: 'record-9999', expectedVersion: 1, patch: { body: '측정용 수정' }, userId: state.userId, namespace: 'test', opId: `measure-${run}`, at: '2026-09-29T00:01:00.000Z' });
    command.push(performance.now() - start);
    expect(next.records[9999].body).toBe('측정용 수정');
    expect(next.subjects).toEqual(state.subjects);
    expect(state.records[9999].body).not.toBe('측정용 수정');
  }
  console.log(JSON.stringify({ records:state.records.length, sessions:state.sessions.length, nodes:state.nodes.length, semesters:state.semesters.length, subjects:state.subjects.length, revisions:state.revisions.length, serializedBytes:Buffer.byteLength(JSON.stringify(state)), validationMs:validation, singleBodyCommandMs:command }));
}, 30000);
