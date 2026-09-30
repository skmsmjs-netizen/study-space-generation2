import { describe, expect, it } from 'vitest';
import { createDemoState } from './fixtures';
import { freshRecall, nextRecall, recallTopics, type RecallSession } from './topic-recall';
describe('topic selection', () => {
  it('visits every candidate once per round, restarts without immediate repetition and retains drafts', () => {
    const data = createDemoState(), topics = recallTopics(data, data.subjects.map(row => row.id), freshRecall());
    let session: RecallSession = { ...freshRecall(), drafts: { keep: { memoId: 'memo-id', body: '原文\n ' } } };
    const seen: string[] = [];
    for (let i = 0; i < topics.length; i++) { session = nextRecall(session, topics, () => .5); seen.push(session.currentId!); }
    expect(new Set(seen).size).toBe(topics.length);
    const previous = session.currentId; session = nextRecall(session, topics, () => 0);
    expect(session.currentId).not.toBe(previous); expect(session.round).toBe(2);
    expect(session.drafts.keep.body).toBe('原文\n ');
  });
  it('respects subject/unit scope and deletion and handles zero/one card', () => {
    const data = createDemoState(), scope = { subjectId: 'demo-subject-math', unitId: 'demo-unit-functions' };
    const topics = recallTopics(data, ['demo-subject-math'], scope);
    expect(topics.length).toBeGreaterThan(0); expect(topics.every(row => row.subjectId === scope.subjectId)).toBe(true);
    expect(recallTopics(data, ['demo-subject-science'], scope)).toHaveLength(0);
    const one = nextRecall(freshRecall(), topics.slice(0, 1), () => 0);
    expect(nextRecall(one, topics.slice(0, 1)).round).toBe(2);
    expect(nextRecall(one, []).currentId).toBeNull();
    data.nodes.find(row => row.id === scope.unitId)!.deletedAt = '2026-09-30';
    expect(recallTopics(data, ['demo-subject-math'], scope)).toHaveLength(0);
  });
});
