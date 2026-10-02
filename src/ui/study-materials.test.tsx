import * as materialFiles from '../data/material-files';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { configure, fireEvent, render, screen, waitFor } from '@testing-library/react';
configure({ asyncUtilTimeout: 10_000 });
import userEvent from '@testing-library/user-event';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import { DemoRepository } from '../data/demo-repository';
import { StudyMaterials } from './study-materials';
import { readMaterialDraft } from '../data/material-files';
import type { MaterialContent } from '../domain/study-material';
import { emptyState } from '../domain/model';
import { applyCommand } from '../domain/commands';
import { AI_OWNER_USER_ID } from '../domain/ai-access';
import type { StudyRepository } from '../data/repository';
import { generateStudyMaterial } from '../data/study-ai';
vi.mock('../data/study-ai', () => ({
  localAIStatus: vi.fn(async () => ({ configured: false, model: 'test-model', local: true })),
  connectLocalAI: vi.fn(),
  updateGPTConnection: vi.fn(),
  CHATGPT_USAGE_URL: 'https://chatgpt.com/settings/usage',
  generateStudyMaterial: vi.fn(async () => {
    throw Error('AI 연결이 필요합니다. 원본은 보존했습니다.');
  }),
}));
let repo: DemoRepository;
beforeEach(() => {
  localStorage.clear();
  vi.mocked(generateStudyMaterial).mockReset().mockRejectedValue(Error('AI 연결이 필요합니다. 원본은 보존했습니다.'));
  vi.stubGlobal('indexedDB', new IDBFactory());
  vi.stubGlobal('IDBKeyRange', IDBKeyRange);
  Element.prototype.scrollIntoView = vi.fn();
  repo = new DemoRepository(localStorage);
});
it('distinguishes a missing material from an empty library and provides recovery destinations without changing data', () => {
  const data = repo.getSnapshot(), original = JSON.stringify(data);
  const props = { data, repository: repo, onSaved: () => undefined };
  const { rerender } = render(<StudyMaterials {...props} materialId="missing-material" />);
  expect(screen.getByRole('heading', { name: '이 강의 자료를 찾을 수 없습니다' })).toBeVisible();
  expect(screen.getByRole('link', { name: '자료 목록으로' })).toHaveAttribute('href', '#/materials');
  expect(screen.queryByRole('heading', { name: '강의 자료를 모아 두세요' })).toBeNull();
  rerender(<StudyMaterials {...props} trash />);
  expect(screen.getByRole('heading', { name: '휴지통에 강의 자료가 없습니다' })).toBeVisible();
  expect(screen.getByRole('link', { name: '자료 목록으로' })).toHaveAttribute('href', '#/materials');
  expect(JSON.stringify(repo.getSnapshot())).toBe(original);
});
it('keeps formula edits, the generated original and request across a failed save and reopen, without regenerating or duplicating', async () => {
  const personal = ownerFixture();
  let fail = true;
  personal.flush = vi.fn(async () => {
    if (fail) throw Error('합성 서버 저장 실패');
  });
  personal.getStatus = () => ({
    phase: fail ? 'pending' : 'saved',
    pending: fail ? 1 : 0,
    message: '',
  });
  const generated = {
    ...content.results[0],
    cards: [],
    request: { task: 'formula' as const, focus: '저항의 조건을 남겨 주세요.' },
    summary: [{ text: '전압은 \\(V=IR\\)이다.', sourceIds: ['s1'] }],
    source: { text: '전압은 전류와 저항의 곱이다.', audio: null },
  };
  vi.mocked(generateStudyMaterial).mockResolvedValueOnce(generated);
  let view = render(
    <StudyMaterials
      data={personal.getSnapshot()}
      repository={personal}
      onSaved={() => undefined}
      materialId="new"
    />,
  );
  await waitFor(() => expect(screen.getByRole('button', { name: '자료 저장' })).toBeEnabled());
  fireEvent.change(screen.getByRole('textbox', { name: '자료 제목' }), {
    target: { value: '수식 보완 합성 자료' },
  });
  fireEvent.change(screen.getByRole('textbox', { name: '강의 내용·필기' }), {
    target: { value: generated.source.text },
  });
  fireEvent.change(screen.getByRole('combobox', { name: 'GPT 작업' }), {
    target: { value: 'formula' },
  });
  fireEvent.change(screen.getByRole('combobox', { name: '카드 개수' }), { target: { value: '20' } });
  fireEvent.change(screen.getByRole('textbox', { name: '보조할 내용·범위 · 선택' }), {
    target: { value: generated.request.focus },
  });
  fireEvent.click(screen.getByRole('button', { name: '수식 보완 만들기' }));
  await screen.findByRole('button', { name: '결과 수정' });
  await waitFor(() => expect(screen.getByRole('button', { name: '자료 저장' })).toBeEnabled());
  fireEvent.click(screen.getByRole('button', { name: '결과 수정' }));
  fireEvent.change(screen.getByRole('textbox', { name: '1번째 보조 결과' }), {
    target: { value: '전압은 V=IR이다. 저항이 일정한 조건을 확인한다.' },
  });
  fireEvent.click(screen.getByRole('button', { name: '자료 저장' }));
  await screen.findByText('합성 서버 저장 실패');
  const savedId = personal.getSnapshot().studyMaterials![0].id;
  expect((await readMaterialDraft(personal.getSnapshot(), 'new'))?.materialId).toBe(savedId);
  view.unmount();
  view = render(
    <StudyMaterials
      data={personal.getSnapshot()}
      repository={personal}
      onSaved={() => undefined}
      materialId="new"
    />,
  );
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: '자료 제목' })).toHaveValue('수식 보완 합성 자료'),
  );
  expect(screen.queryByText(/다른 곳에서 저장한 자료/)).not.toBeInTheDocument();
  expect(screen.getByRole('combobox', { name: 'GPT 작업' })).toHaveValue('formula');
  expect(screen.getByRole('combobox', { name: '카드 개수' })).toHaveValue('20');
  expect(screen.getByText('전압은 V=IR이다. 저항이 일정한 조건을 확인한다.')).toBeVisible();
  expect(personal.getSnapshot().studyMaterials![0].results[0].summary[0].originalText).toBe(
    generated.summary[0].text,
  );
  fail = false;
  fireEvent.click(screen.getByRole('button', { name: '자료 저장' }));
  await screen.findByText('자료를 서버에 저장했습니다.');
  expect(personal.getSnapshot().studyMaterials).toHaveLength(1);
  expect(personal.getSnapshot().studyMaterials![0].version).toBe(1);
  expect(generateStudyMaterial).toHaveBeenCalledTimes(1);
  expect(await readMaterialDraft(personal.getSnapshot(), 'new')).toBeUndefined();
  expect(personal.getSnapshot().records).toHaveLength(0);
  expect(personal.getSnapshot().studyMaterials![0].aiRequest?.requestedCardCount).toBe(20);
  view.unmount();
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
const content: MaterialContent = {
  title: '합성 강의 카드',
  subjectId: 'demo-subject-math',
  topicId: null,
  sourceText: '전압은 전위차다.',
  audio: null,
  results: [
    {
      id: 'r1',
      at: '2026-10-01T00:00:00Z',
      model: 'synthetic',
      segments: [{ id: 's1', text: '전압은 전위차다.', start: null, end: null }],
      summary: [{ text: '전압의 뜻', sourceIds: ['s1'] }],
      cards: [
        {
          id: 'card1',
          question: '전압이란?',
          answer: '두 지점 사이의 전위차다.',
          sourceIds: ['s1'],
          excluded: false,
        },
      ],
    },
  ],
};
function existing() {
  const data = repo.getSnapshot();
  repo.execute({
    type: 'saveStudyMaterial',
    id: 'm1',
    content,
    expectedVersion: 0,
    userId: data.userId,
    namespace: data.namespace,
    opId: 'material',
    at: new Date().toISOString(),
  });
}
it('hides answers until asked, follows source evidence, preserves edits and restores excluded cards after reopening', async () => {
  existing();
  const user = userEvent.setup();
  const view = render(
    <StudyMaterials
      data={repo.getSnapshot()}
      repository={repo}
      onSaved={() => undefined}
      materialId="m1"
    />,
  );
  await waitFor(() => expect(screen.getByRole('button', { name: '자료 저장' })).toBeEnabled());
  await user.click(screen.getByRole('button', { name: '플래시카드 1' }));
  expect(screen.queryByText('두 지점 사이의 전위차다.')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: '답 보기' }));
  expect(screen.getByText('두 지점 사이의 전위차다.')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 's1 원문' }));
  expect(screen.getByRole('textbox', { name: 's1 원문' })).toHaveValue('전압은 전위차다.');
  await user.click(screen.getByRole('button', { name: '플래시카드 1' }));
  await user.click(screen.getByRole('button', { name: '카드 수정' }));
  fireEvent.change(screen.getByRole('textbox', { name: '카드 답' }), {
    target: { value: '기준점 사이의 전위차. 조건을 확인한다.' },
  });
  await user.click(screen.getByRole('button', { name: '편집 마치기' }));
  await user.click(screen.getByRole('button', { name: '이 카드 제외' }));
  await user.click(screen.getByRole('button', { name: '자료 저장' }));
  await waitFor(() => expect(repo.getSnapshot().studyMaterials![0].version).toBe(2));
  view.unmount();
  const reopened = new DemoRepository(localStorage);
  render(
    <StudyMaterials
      data={reopened.getSnapshot()}
      repository={reopened}
      onSaved={() => undefined}
      materialId="m1"
    />,
  );
  await waitFor(() => expect(screen.getByRole('button', { name: '자료 저장' })).toBeEnabled());
  await user.click(screen.getByText('제외한 카드'));
  await user.click(screen.getByRole('button', { name: '복원' }));
  await user.click(screen.getByRole('button', { name: '플래시카드 1' }));
  await user.click(screen.getByRole('button', { name: '답 보기' }));
  expect(screen.getByText('기준점 사이의 전위차. 조건을 확인한다.')).toBeVisible();
  expect(reopened.getSnapshot().studyMaterials![0].results[0].cards[0].originalAnswer).toBe(
    '두 지점 사이의 전위차다.',
  );
});
function ownerFixture(): StudyRepository {
  let state = applyCommand(emptyState(AI_OWNER_USER_ID, 'personal'), {
    type: 'addSubject',
    id: 'synthetic-subject',
    name: '합성 과목',
    scope: { kind: 'independent' },
    userId: AI_OWNER_USER_ID,
    namespace: 'personal',
    opId: 'subject',
    at: '2026-10-01T00:00:00Z',
  });
  return {
    getSnapshot: () => state,
    execute: (command) => {
      state = applyCommand(state, command);
      return state;
    },
    getCapabilities: () => ['saveStudyMaterial'],
  };
}
it('stops before another provider call when 30 results are already retained, keeping their IDs and source', async () => {
  const personal = ownerFixture(),
    data = personal.getSnapshot();
  const results = Array.from({ length: 30 }, (_, index) => ({
    ...content.results[0],
    id: `retained-${index}`,
  }));
  personal.execute({
    type: 'saveStudyMaterial',
    id: 'full-material',
    expectedVersion: 0,
    content: { ...content, subjectId: 'synthetic-subject', results },
    userId: data.userId,
    namespace: data.namespace,
    opId: 'full',
    at: '2026-10-01T00:00:00Z',
  });
  render(
    <StudyMaterials
      data={personal.getSnapshot()}
      repository={personal}
      onSaved={() => undefined}
      materialId="full-material"
    />,
  );
  await waitFor(() => expect(screen.getByRole('button', { name: '새 결과 만들기' })).toBeEnabled());
  fireEvent.click(screen.getByRole('button', { name: '새 결과 만들기' }));
  await screen.findByText(/생성 결과 30개를 모두 보관했습니다/);
  expect(generateStudyMaterial).not.toHaveBeenCalled();
  expect(personal.getSnapshot().studyMaterials![0].results.map((row) => row.id)).toEqual(
    results.map((row) => row.id),
  );
  expect(screen.getByRole('textbox', { name: '강의 내용·필기' })).toHaveValue(content.sourceText);
});
it('stores a successful generated result with its source, then saves without creating study records', async () => {
  const personal = ownerFixture(),
    user = userEvent.setup();
  vi.mocked(generateStudyMaterial).mockResolvedValueOnce({
    ...content.results[0],
    source: { text: '전압은 전위차다.', audio: null },
  });
  const view = render(
    <StudyMaterials
      data={personal.getSnapshot()}
      repository={personal}
      onSaved={() => undefined}
      materialId="new"
    />,
  );
  await waitFor(() => expect(screen.getByRole('button', { name: '자료 저장' })).toBeEnabled());
  await user.type(screen.getByRole('textbox', { name: '자료 제목' }), '합성 AI 응답 확인');
  await user.type(screen.getByRole('textbox', { name: '강의 내용·필기' }), '전압은 전위차다.');
  await user.click(screen.getByRole('button', { name: '복습 자료 한 번에 만들기' }));
  await screen.findByText('전압의 뜻');
  expect(
    (await readMaterialDraft(personal.getSnapshot(), 'new'))?.content.results[0].source?.text,
  ).toBe('전압은 전위차다.');
  await user.click(screen.getByRole('button', { name: '자료 저장' }));
  await waitFor(() => expect(personal.getSnapshot().studyMaterials).toHaveLength(1));
  view.unmount();
  expect(personal.getSnapshot().records).toHaveLength(0);
  expect(personal.getSnapshot().sessions).toHaveLength(0);
  expect(personal.getSnapshot().studyMaterials?.[0].results[0].cards[0].answer).toBe(
    '두 지점 사이의 전위차다.',
  );
});
it('uses pasted ClovaNote transcript only after an explicit generation request and preserves its draft', async () => {
  const user = userEvent.setup(), personal = ownerFixture();
  const original = '참석자 1 00:12\n전압은 전류와 저항의 곱이다.\n단, 저항이 일정한 조건이다.  ';
  vi.mocked(generateStudyMaterial).mockResolvedValueOnce(content.results[0]);
  render(<StudyMaterials data={personal.getSnapshot()} repository={personal} onSaved={() => undefined} materialId="new" />);
  await waitFor(() => expect(screen.getByRole('textbox', { name: '강의 내용·필기' })).toBeEnabled());
  expect(screen.queryByRole('button', { name: '녹음 시작' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: '녹음 파일 가져오기' })).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole('textbox', { name: '강의 내용·필기' }), { target: { value: original } });
  await waitFor(async () => expect((await readMaterialDraft(personal.getSnapshot(), 'new'))?.content.sourceText).toBe(original));
  expect(generateStudyMaterial).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: '복습 자료 한 번에 만들기' }));
  await screen.findByText('전압의 뜻');
  expect(generateStudyMaterial).toHaveBeenLastCalledWith(expect.objectContaining({ userId: AI_OWNER_USER_ID }), expect.objectContaining({ sourceText: original, audio: null }), 5, expect.any(AbortSignal));
});
it('retains unsaved source after provider failure and reopens it without creating records', async () => {
  const user = userEvent.setup();
  const before = applyCommand(emptyState(AI_OWNER_USER_ID, 'personal'), {
    type: 'addSubject',
    id: 'synthetic-subject',
    name: '합성 과목',
    scope: { kind: 'independent' },
    userId: AI_OWNER_USER_ID,
    namespace: 'personal',
    opId: 'subject',
    at: '2026-10-01T00:00:00Z',
  });
  const personal: StudyRepository = {
    getSnapshot: () => before,
    execute: vi.fn(() => before),
    getCapabilities: () => ['saveStudyMaterial'],
  };
  const view = render(
    <StudyMaterials
      data={before}
      repository={personal}
      onSaved={() => undefined}
      materialId="new"
    />,
  );
  await waitFor(() => expect(screen.getByRole('button', { name: '자료 저장' })).toBeEnabled());
  await user.type(screen.getByRole('textbox', { name: '자료 제목' }), '연결 실패 보존');
  await user.type(
    screen.getByRole('textbox', { name: '강의 내용·필기' }),
    '한글 원문과 예외를 유지한다.',
  );
  await user.click(screen.getByRole('button', { name: '복습 자료 한 번에 만들기' }));
  await screen.findByText('AI 연결이 필요합니다. 원본은 보존했습니다.');
  expect((await readMaterialDraft(before, 'new'))!.content.sourceText).toBe(
    '한글 원문과 예외를 유지한다.',
  );
  view.unmount();
  render(
    <StudyMaterials
      data={before}
      repository={personal}
      onSaved={() => undefined}
      materialId="new"
    />,
  );
  await waitFor(() =>
    expect(screen.getByRole('textbox', { name: '강의 내용·필기' })).toHaveValue(
      '한글 원문과 예외를 유지한다.',
    ),
  );
  expect(personal.getSnapshot().records).toEqual(before.records);
  expect(personal.execute).not.toHaveBeenCalled();
});
it('cancels a long generation and keeps the source draft and prior records intact', async () => {
  const personal = ownerFixture(),
    user = userEvent.setup();
  vi.mocked(generateStudyMaterial).mockImplementationOnce(
    async (_owner, _content, _count, signal) =>
      new Promise((_resolve, reject) => {
        signal!.addEventListener('abort', () => reject(new DOMException('Stopped', 'AbortError')), {
          once: true,
        });
      }),
  );
  render(
    <StudyMaterials
      data={personal.getSnapshot()}
      repository={personal}
      onSaved={() => undefined}
      materialId="new"
    />,
  );
  await waitFor(() => expect(screen.getByRole('button', { name: '자료 저장' })).toBeEnabled());
  await user.type(
    screen.getByRole('textbox', { name: '강의 내용·필기' }),
    '중단 뒤에도 보존할 원문',
  );
  await user.click(screen.getByRole('button', { name: '복습 자료 한 번에 만들기' }));
  await user.click(await screen.findByRole('button', { name: '정리 중단' }));
  await screen.findByText(/정리를 중단했습니다/);
  expect(screen.getByRole('textbox', { name: '강의 내용·필기' })).toHaveValue(
    '중단 뒤에도 보존할 원문',
  );
  expect((await readMaterialDraft(personal.getSnapshot(), 'new'))?.content.sourceText).toBe(
    '중단 뒤에도 보존할 원문',
  );
  expect((await readMaterialDraft(personal.getSnapshot(), 'new'))?.content.results).toHaveLength(0);
  expect(personal.getSnapshot().records).toHaveLength(0);
});

it('binds answer editing to the selected card and never reveals the next or another result after exclusion', async () => {
  const next = structuredClone(content);
  next.results[0].cards.push({ ...next.results[0].cards[0], id: 'card2', question: '두 번째 질문', answer: '두 번째 숨긴 답' });
  next.results.push({ ...structuredClone(next.results[0]), id: 'r2', cards: [{ ...next.results[0].cards[0], id: 'card3', question: '다른 결과 질문', answer: '다른 결과 숨긴 답' }] });
  const state = repo.getSnapshot();
  repo.execute({ type: 'saveStudyMaterial', id: 'switch', content: next, expectedVersion: 0, userId: state.userId, namespace: state.namespace, opId: 'switch-save', at: new Date().toISOString() });
  render(<StudyMaterials data={repo.getSnapshot()} repository={repo} onSaved={() => undefined} materialId="switch"/>);
  await waitFor(() => expect(screen.getByRole('button', { name: '자료 저장' })).toBeEnabled());
  fireEvent.change(screen.getByRole('combobox', { name: '생성 결과' }), { target: { value: '0' } });
  fireEvent.click(screen.getByRole('button', { name: '플래시카드 2' }));
  fireEvent.click(screen.getByRole('button', { name: '카드 수정' }));
  expect(screen.getByRole('textbox', { name: '카드 답' })).toHaveValue(next.results[0].cards[0].answer);
  fireEvent.click(screen.getByRole('button', { name: '이 카드 제외' }));
  expect(screen.queryByRole('textbox', { name: '카드 답' })).not.toBeInTheDocument();
  expect(screen.queryByText('두 번째 숨긴 답')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: '답 보기' })).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: '카드 수정' }));
  fireEvent.change(screen.getByRole('combobox', { name: '생성 결과' }), { target: { value: '1' } });
  expect(screen.queryByRole('textbox', { name: '카드 답' })).not.toBeInTheDocument();
  expect(screen.queryByText('다른 결과 숨긴 답')).not.toBeInTheDocument();
});

it('opens a valid view when switching from a quiz to an earlier result and preserves the attempt as helped', async () => {
  const next = structuredClone(content);
  next.results[0].summary = [{text:'이전 수식 보완 결과',sourceIds:['s1']}];
  next.results.push({...structuredClone(next.results[0]),id:'quiz-result',cards:[],quiz:[{id:'quiz-q',question:'합성 문제',options:['보기 하나','보기 둘'],correctIndex:0,explanation:'제출 뒤 해설',sourceIds:['s1']}],request:{task:'quiz'}});
  const state = repo.getSnapshot();
  repo.execute({type:'saveStudyMaterial',id:'view-switch',content:next,expectedVersion:0,userId:state.userId,namespace:state.namespace,opId:'view-switch-save',at:new Date().toISOString()});
  render(<StudyMaterials data={repo.getSnapshot()} repository={repo} onSaved={() => undefined} materialId="view-switch"/>);
  await waitFor(() => expect(screen.getByRole('button',{name:'자료 저장'})).toBeEnabled());
  fireEvent.click(screen.getByRole('button',{name:'퀴즈 1'}));
  fireEvent.click(screen.getByRole('button',{name:'새 퀴즈 시작'}));
  fireEvent.change(screen.getByRole('combobox',{name:'생성 결과'}),{target:{value:'0'}});
  await waitFor(() => expect(screen.getByText('이전 수식 보완 결과')).toBeVisible());
  expect(screen.getByRole('button',{name:'결과 수정'})).toBeVisible();
  await waitFor(async () => expect((await readMaterialDraft(repo.getSnapshot(),'view-switch'))?.content.quizAttempts?.[0].helpedQuestionIds).toEqual(['quiz-q']));
  expect(vi.mocked(generateStudyMaterial)).not.toHaveBeenCalled();
});

it('retains a received result in memory after draft failure and retries only storage before restoring location', async () => {
  const personal = ownerFixture();
  const originalWrite = materialFiles.writeMaterialDraft;
  let fail = false;
  vi.spyOn(materialFiles, 'writeMaterialDraft').mockImplementation(async (...args) => {
    if (fail && args[2].content.results.length) throw Error('합성 기기 초안 실패');
    return originalWrite(...args);
  });
  vi.mocked(generateStudyMaterial).mockResolvedValueOnce(structuredClone(content.results[0]));
  let view = render(<StudyMaterials data={personal.getSnapshot()} repository={personal} onSaved={() => undefined} materialId="new"/>);
  await waitFor(() => expect(screen.getByRole('button', { name: '자료 저장' })).toBeEnabled());
  fireEvent.change(screen.getByRole('textbox', { name: '자료 제목' }), { target: { value: '실패 복구 검증' } });
  fireEvent.change(screen.getByRole('textbox', { name: '강의 내용·필기' }), { target: { value: content.sourceText } });
  await waitFor(async () => expect((await readMaterialDraft(personal.getSnapshot(), 'new'))?.content.sourceText).toBe(content.sourceText));
  fail = true;
  fireEvent.click(screen.getByRole('button', { name: '복습 자료 한 번에 만들기' }));
  await screen.findByRole('button', { name: '초안 저장 재시도' });
  fireEvent.click(screen.getByRole('button', { name: '플래시카드 1' }));
  fireEvent.click(screen.getByRole('button', { name: '답 보기' }));
  expect(screen.getByText(content.results[0].cards[0].answer)).toBeVisible();
  const unload = new Event('beforeunload', { cancelable: true });
  window.dispatchEvent(unload); expect(unload.defaultPrevented).toBe(true);
  await screen.findByRole('button', { name: '초안 저장 재시도' });
  fail = false;
  fireEvent.click(screen.getByRole('button', { name: '초안 저장 재시도' }));
  await waitFor(() => expect(screen.queryByRole('button', { name: '초안 저장 재시도' })).not.toBeInTheDocument());
  expect(generateStudyMaterial).toHaveBeenCalledTimes(1);
  view.unmount();
  view = render(<StudyMaterials data={personal.getSnapshot()} repository={personal} onSaved={() => undefined} materialId="new"/>);
  await waitFor(() => expect(screen.getByText(content.results[0].cards[0].answer)).toBeVisible());
  expect(screen.getByRole('button', { name: '플래시카드 1' })).toHaveAttribute('aria-pressed', 'true');
  expect(generateStudyMaterial).toHaveBeenCalledTimes(1);
  expect(personal.getSnapshot().records).toHaveLength(0);
  view.unmount();
});

it('hides source and tutor answers on entering a quiz and preserves explicit source access as help', async () => {
  const next = structuredClone(content);
  next.sourceText = '원문에 있는 합성 퀴즈의 기준 답';
  next.results[0].cards = [];
  next.results[0].quiz = [{ id: 'q1', question: '합성 문제', options: ['보기 하나', '보기 둘'], correctIndex: 0, explanation: '제출 후의 기준 해설', sourceIds: ['s1'] }];
  const state = repo.getSnapshot();
  repo.execute({ type: 'saveStudyMaterial', id: 'quiz-help', content: next, expectedVersion: 0, userId: state.userId, namespace: state.namespace, opId: 'quiz-help-save', at: new Date().toISOString() });
  const view = render(<StudyMaterials data={repo.getSnapshot()} repository={repo} onSaved={() => undefined} materialId="quiz-help"/>);
  await waitFor(() => expect(screen.getByRole('button', { name: '자료 저장' })).toBeEnabled());
  fireEvent.click(screen.getByRole('button', { name: '퀴즈 1' }));
  await waitFor(() => expect(screen.getByRole('textbox', { name: '강의 내용·필기' })).not.toBeVisible());
  fireEvent.click(screen.getByRole('button', { name: '새 퀴즈 시작' }));
  expect(screen.queryByText('제출 후의 기준 해설')).not.toBeInTheDocument();
  const source = screen.getByText('원문·자료 열기 · 퀴즈 도움으로 보관').closest('details')!;
  source.open = true;
  fireEvent(source, new Event('toggle'));
  await waitFor(() => expect(screen.getByRole('textbox', { name: '강의 내용·필기' })).toBeVisible());
  await waitFor(async () => expect((await readMaterialDraft(repo.getSnapshot(), 'quiz-help'))?.content.quizAttempts?.[0].helpedQuestionIds).toEqual(['q1']));
  fireEvent.click(screen.getByRole('button', { name: '답 제출 · 해설 확인' }));
  expect(screen.getByText('응답하지 않은 문항입니다.')).toBeVisible();
  expect(repo.getSnapshot().records).toHaveLength(0);
  view.unmount();
});
