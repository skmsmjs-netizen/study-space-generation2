import { expect, it } from 'vitest';
import { createDemoState } from './fixtures';
import {
  buildWorkspaceSearch,
  normalizeSearchText,
  queryWorkspaceSearch,
  searchExcerpt,
  searchWorkspace,
  type WorkspaceSearchEntry,
} from './workspace-search';
import { emptyRecommendations } from './recommendation-workspace';
import type { Entity } from './model';

const at = '2026-10-01T00:00:00Z';
it('keeps original Korean graphemes and escaped-looking text intact in excerpts', () => {
  const raw = `  😀앞말 ${'한글'.normalize('NFD')} <img src=x onerror=alert(1)> 끝  `;
  const excerpt = searchExcerpt(raw, '한글');
  expect(excerpt.text).toBe(raw);
  expect(excerpt.text.slice(excerpt.start, excerpt.end)).toBe('한글'.normalize('NFD'));
  const clipped = searchExcerpt(`${'😀'.repeat(80)}별${'👩‍🚀'.repeat(80)}`, '별', 20);
  expect(clipped.text.slice(clipped.start, clipped.end)).toBe('별');
  expect(clipped.leading && clipped.trailing).toBe(true);
  expect(clipped.text).not.toMatch(/[\ud800-\udbff]$/u);
});
it('explains stable title/body ranking, retains scope, and counts kinds before filtering', () => {
  const entry = (
    id: string,
    title: string,
    rawText: string,
    kind = '기록',
    subjectId: string | null = 's',
  ): WorkspaceSearchEntry => ({
    id,
    title,
    rawText,
    text: normalizeSearchText(`${title}\n${rawText}`),
    kind,
    subjectId,
    href: `#/record/${id}`,
  });
  const entries = [
    entry('body', '첫 자료', '  함수 원문  '),
    entry('part', '함수와 예외', '', '메모'),
    entry('exact', '함수', ''),
    entry('foreign', '함수', '', '기록', 'other'),
  ];
  const original = structuredClone(entries);
  const options = { query: '함수', subjectIds: ['s'], includeUnassigned: false };
  const result = queryWorkspaceSearch(entries, options);
  expect(result.hits.map((row) => [row.id, row.reason])).toEqual([
    ['exact', '제목 전체 일치'],
    ['part', '제목에 일치'],
    ['body', '본문에 일치'],
  ]);
  expect(result.hits[2].excerpt.text).toBe('  함수 원문  ');
  expect(queryWorkspaceSearch(entries, { ...options, order: 'source', limit: 1 }).hits[0].id).toBe(
    'body',
  );
  const filtered = queryWorkspaceSearch(entries, { ...options, kind: '메모' });
  expect(filtered.total).toBe(1);
  expect(filtered.kinds).toEqual([
    { kind: '기록', count: 2 },
    { kind: '메모', count: 1 },
  ]);
  expect(entries).toEqual(original);
});
function fixture() {
  const data = createDemoState();
  const entity = (id: string): Entity => ({
    id,
    userId: data.userId,
    namespace: data.namespace,
    createdAt: at,
    updatedAt: at,
    version: 1,
    deletedAt: null,
  });
  data.studyMaterials = [
    {
      ...entity('material / 한글'),
      title: '회로 필기',
      subjectId: 'demo-subject-math',
      topicId: null,
      sourceText: '  전위차 조건\n예외  ',
      audio: null,
      results: [
        {
          id: 'r',
          at,
          model: 'synthetic',
          segments: [
            { id: 's', text: '바꾼 내용', originalText: '원문전위', start: null, end: null },
          ],
          summary: [],
          cards: [
            { id: 'c', question: '질문전위', answer: '답전위', sourceIds: ['s'], excluded: false },
            { id: 'excluded', question: '제외카드', answer: '', sourceIds: [], excluded: true },
          ],
        },
      ],
    },
  ];
  data.codeExamples = [
    {
      ...entity('code'),
      title: '전위 계산',
      language: 'javascript',
      code: 'console.log("전위계산");',
      stdin: '',
      notes: '전위설명',
    },
  ];
  return { data, entity };
}
it('finds material originals, questions, answers and code without changing originals or history', () => {
  const { data } = fixture(),
    original = structuredClone(data);
  const index = buildWorkspaceSearch(data);
  for (const query of ['전위차', '원문전위', '질문전위', '답전위'])
    expect(
      searchWorkspace(index, query.normalize('NFD'), ['demo-subject-math'], false)[0].href,
    ).toBe('#/materials/material%20%2F%20%ED%95%9C%EA%B8%80');
  expect(searchWorkspace(index, '제외카드', ['demo-subject-math'], false)).toEqual([]);
  expect(searchWorkspace(index, '전위계산', ['demo-subject-math'], false)).toEqual([]);
  expect(searchWorkspace(index, '전위계산', [], true)[0].href).toBe('#/code/code');
  expect(data).toEqual(original);
});
it('excludes another owner, deleted content and content under a deleted subject', () => {
  const { data } = fixture();
  const material = data.studyMaterials?.[0];
  if (!material || !data.studyMaterials) throw Error('Missing synthetic material');
  data.studyMaterials.push(
    { ...material, id: 'foreign', userId: 'other', title: '다른계정원문' },
    { ...material, id: 'trash', deletedAt: at, title: '휴지통원문' },
  );
  const index = buildWorkspaceSearch(data);
  for (const query of ['다른계정원문', '휴지통원문'])
    expect(
      searchWorkspace(
        index,
        query,
        data.subjects.map((row) => row.id),
        true,
      ),
    ).toEqual([]);
  const subject = data.subjects.find((row) => row.id === material.subjectId);
  if (!subject) throw Error('Missing synthetic subject');
  subject.deletedAt = at;
  expect(searchWorkspace(buildWorkspaceSearch(data), '전위차', [material.subjectId], true)).toEqual(
    [],
  );
});
it('uses an existing legacy plan for code scope without migrating or duplicating results', () => {
  const { data } = fixture(),
    workspace = emptyRecommendations(data),
    original = JSON.stringify(data);
  workspace.codeLinks = [
    { exampleId: 'code', topicId: 'demo-topic-function' },
    { exampleId: 'code', topicId: 'demo-topic-graph' },
  ];
  const results = searchWorkspace(
    buildWorkspaceSearch(data, workspace),
    '전위계산',
    ['demo-subject-math'],
    false,
  );
  expect(results).toHaveLength(1);
  expect(results[0].subjectId).toBe('demo-subject-math');
  expect(JSON.stringify(data)).toBe(original);
});
it('matches a historical test only within the question’s actual subject and retains unassigned history', () => {
  const { data, entity } = fixture();
  const other = data.nodes.find(
    (row) => row.role === 'topic' && row.subjectId !== 'demo-subject-math',
  );
  if (!other) throw Error('Missing synthetic topic');
  const question = (topicId: string, response: string) => ({
    cardId: topicId,
    cardVersion: 1,
    topicId,
    topicName: '시험 당시 이름',
    question: '질문',
    answer: '답',
    strokes: [],
    response,
    responseStrokes: [],
    verdict: null,
  });
  data.memoryTests = [
    {
      ...entity('test'),
      startedAt: at,
      endedAt: at,
      questions: [
        question('demo-topic-function', '수학응답'),
        question(other.id, '다른과목응답'),
        question('removed-topic', '이전응답'),
      ],
    },
  ];
  const index = buildWorkspaceSearch(data);
  expect(searchWorkspace(index, '다른과목응답', ['demo-subject-math'], false)).toEqual([]);
  expect(searchWorkspace(index, '수학응답', ['demo-subject-math'], false)).toHaveLength(1);
  expect(
    searchWorkspace(
      index,
      '이전응답',
      data.subjects.map((row) => row.id),
      true,
    ),
  ).toHaveLength(1);
});
