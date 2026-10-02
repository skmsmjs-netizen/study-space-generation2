import { emptyState, type AppState, type Entity, type StudyRecord } from '../../src/domain/model';
export function makeLargeFixture(): AppState {
  const state = emptyState('performance-user', 'test');
  const stamp = '2026-09-29T00:00:00.000Z';
  const entity = (id: string): Entity => ({
    id,
    userId: state.userId,
    namespace: 'test',
    createdAt: stamp,
    updatedAt: stamp,
    version: 1,
    deletedAt: null,
  });
  for (let term = 0; term < 8; term++) {
    state.semesters.push({ ...entity(`term-${term}`), name: `합성 학기 ${term}`, order: term });
    for (let sub = 0; sub < 10; sub++) {
      const id = `subject-${term}-${sub}`;
      state.subjects.push({
        ...entity(id),
        scope: { kind: 'semester', semesterId: `term-${term}` },
        name: `동명 시험 과목 ${sub}`,
        order: sub,
      });
      state.nodes.push({
        ...entity(`unit-${id}`),
        subjectId: id,
        parentId: null,
        role: 'unit',
        name: '시험 단원',
        order: 0,
      });
      for (let topic = 0; topic < 10; topic++)
        state.nodes.push({
          ...entity(`topic-${id}-${topic}`),
          subjectId: id,
          parentId: `unit-${id}`,
          role: 'topic',
          name: `대량 자료용 가짜 주제 ${topic}`,
          order: topic,
        });
    }
  }
  const topics = state.nodes.filter((n) => n.role === 'topic');
  for (let index = 0; index < 10000; index++) {
    const target = topics[index % topics.length];
    state.sessions.push({
      ...entity(`session-${index}`),
      dateEvidence: { kind: 'exact', date: '2026-09-28' },
    });
    const row: StudyRecord = {
      ...entity(`record-${index}`),
      sessionId: `session-${index}`,
      subjectId: target.subjectId,
      targetId: target.id,
      body: `가짜 기록 ${index}\n` + '연습 문장. '.repeat(20),
      done: true,
      dateEvidence: { kind: 'exact', date: '2026-09-28' },
      trace: { Td1: { status: 'checked' } },
    };
    state.records.push(row);
    state.revisions.push({
      ...entity(`revision-${index}`),
      collection: 'records',
      entityId: row.id,
      operationId: `seed-${index}`,
      parentRevisionId: null,
      before: null,
      after: structuredClone(row),
    });
  }
  return state;
}
