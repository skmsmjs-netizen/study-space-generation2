import { expect, it } from 'vitest';
import { emptyState } from './model';
import { appendStudyAIContext, studyAIContextSources } from './study-ai-context';

export function contextFixture() {
  const data = emptyState('synthetic-owner', 'test');
  const base = {
    userId: data.userId,
    namespace: data.namespace,
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-01T01:00:00Z',
    version: 2,
    deletedAt: null,
  };
  data.subjects = [
    { ...base, id: 's', name: '합성 회로', scope: { kind: 'independent' }, order: 0 },
  ];
  data.nodes = [
    { ...base, id: 't', subjectId: 's', parentId: null, role: 'topic', name: '저항', order: 0 },
  ];
  data.memos = [{ ...base, id: 'm', ownerId: 't', body: '  원문\r\n조건과 예외  ', strokes: [] }];
  data.records = [
    {
      ...base,
      id: 'r',
      sessionId: 'session',
      subjectId: 's',
      targetId: 't',
      body: '',
      done: true,
      dateEvidence: { kind: 'unknown' },
      trace: { recall: { status: 'checked', note: '도움을 받아 일부만 풂' } },
    },
  ];
  data.codeExamples = [
    {
      ...base,
      id: 'c',
      title: '합성 코드',
      language: 'javascript',
      code: 'console.log(2)',
      stdin: '',
      notes: '수정 후 재실행 안 함',
      lastRun: {
        at: base.createdAt,
        language: 'javascript',
        code: 'console.log(1)',
        stdin: '',
        outcome: 'success',
        output: '1',
        error: '',
      },
    },
  ];
  return data;
}

it('only exposes active own scoped originals and explicitly unassigned code, with dates, attempts and earlier execution distinguished', () => {
  const data = contextFixture();
  data.memos!.push(
    { ...data.memos![0], id: 'other-user', userId: 'different', body: '다른 계정 비밀' },
    { ...data.memos![0], id: 'other-space', namespace: 'demo', body: '다른 공간' },
    { ...data.memos![0], id: 'trash', deletedAt: '2026-10-01T00:00:00Z', body: '휴지통' },
    { ...data.memos![0], id: 'other-topic', ownerId: 'not-here', body: '다른 과목' },
  );
  const before = structuredClone(data);
  const sources = studyAIContextSources(data, 's');
  expect(sources.map((row) => row.key).sort()).toEqual(['code:c', 'memo:m', 'record:r']);
  const text = appendStudyAIContext('기존 필기', sources, ['memo:m', 'record:r', 'code:c']);
  expect(text).toContain(data.memos![0].body);
  expect(text).toContain('"version":2');
  expect(text).toContain('"dateEvidence":{"kind":"unknown"}');
  expect(text).toContain('도움을 받아 일부만 풂');
  expect(text).toContain('현재 코드 (javascript):\nconsole.log(2)');
  expect(text).toContain('이전 실제 실행 당시 기록:');
  expect(text).toContain('console.log(1)');
  expect(text).not.toContain('다른 계정 비밀');
  expect(data).toEqual(before);
});

it('handles accumulated records without silent truncation and rejects oversize, removed or excessive selection', () => {
  const data = contextFixture();
  const memo = data.memos![0];
  data.memos = Array.from({ length: 120 }, (_, i) => ({
    ...memo,
    id: String(i),
    body: `원문 ${i}`,
  }));
  const sources = studyAIContextSources(data, 's');
  expect(sources).toHaveLength(122);
  expect(appendStudyAIContext('', sources, ['memo:119'])).toContain('원문 119');
  expect(() => appendStudyAIContext('', sources, ['removed'])).toThrow(/바뀌었습니다/);
  expect(() =>
    appendStudyAIContext(
      '',
      sources,
      sources.slice(0, 21).map((row) => row.key),
    ),
  ).toThrow(/20개/);
  expect(() => appendStudyAIContext('가'.repeat(150000), sources, ['memo:1'])).toThrow(/15만 자/);
  expect(appendStudyAIContext('', sources, ['memo:1', 'memo:1']).match(/입력 출처:/g)).toHaveLength(
    1,
  );
});
