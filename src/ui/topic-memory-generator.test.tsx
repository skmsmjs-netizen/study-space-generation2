import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { beforeEach, expect, it, vi } from 'vitest';
import { AI_OWNER_USER_ID } from '../domain/ai-access';
import { applyCommand } from '../domain/commands';
import { emptyState, type Command } from '../domain/model';
import { configureOpenAIAPI, generateTopicMemory } from '../data/study-ai';
import { MemoryTests } from './memory-test';
import { memoryDraftKey, readMemoryDraft } from '../data/memory-test';
vi.mock('../data/study-ai', () => ({
  generateTopicMemory: vi.fn(),
  configureOpenAIAPI: vi.fn(),
  CHATGPT_USAGE_URL: 'https://chatgpt.com/settings/usage',
  localAIStatus: vi.fn(async () => ({ configured: false, local: true, model: '', creditsConfirmed: false })),
}));
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.clearAllMocks();
});
function repository(owner = AI_OWNER_USER_ID) {
  let data = emptyState(owner, 'personal');
  for (const payload of [
    { type: 'addSubject', id: 's', name: '회로이론', scope: { kind: 'independent' } },
    { type: 'addNode', id: 'u', subjectId: 's', parentId: null, role: 'unit', name: '교류 회로' },
    { type: 'addNode', id: 't', subjectId: 's', parentId: 'u', role: 'topic', name: '커패시터' },
  ])
    data = applyCommand(data, {
      ...payload,
      opId: crypto.randomUUID(),
      at: '2026-10-01T00:00:00Z',
      userId: owner,
      namespace: 'personal',
    } as Command);
  let fail = false;
  return {
    getSnapshot: () => data,
    getCapabilities: () => ['saveMemoryCard', 'saveMemoryTest'],
    execute: (c: Command) => {
      if (fail) throw Error('저장 연결 실패');
      return (data = applyCommand(data, c));
    },
    setFailure: (value: boolean) => {
      fail = value;
    },
  };
}
function Harness({ repo }: { repo: ReturnType<typeof repository> }) {
  const [data, setData] = useState(repo.getSnapshot());
  return <MemoryTests data={data} repository={repo} subjectIds={['s']} onSaved={setData} />;
}
function mockResult() {
  vi.mocked(generateTopicMemory).mockImplementation(async (_owner, input) => ({
    id: 'r',
    at: '2026-10-01T00:00:00Z',
    model: 'test',
    input,
    cards: [
      {
        id: 'c',
        topicId: 't',
        question: '커패시터 임피던스는?',
        answer: '  Z=1/(jωC)\n이상적인 소자 조건  ',
      },
    ],
  }));
}
it('opens API settings in place and preserves the selected scope and guidance without generating', async () => {
  const repo = repository();
  render(<Harness repo={repo} />);
  fireEvent.click(screen.getByRole('button', { name: 'GPT로 암기항목 만들기' }));
  fireEvent.change(screen.getByLabelText('출제 초점·난도 (선택)'), { target: { value: '공식의 적용 조건' } });
  fireEvent.click(screen.getByRole('button', { name: 'GPT 연결 확인' }));
  expect(await screen.findByRole('region', { name: 'GPT 연결 설정' })).toHaveTextContent('OpenAI API');
  expect(screen.getByLabelText('출제 초점·난도 (선택)')).toHaveValue('공식의 적용 조건');
  expect(screen.getByLabelText('GPT 출제 주제')).toHaveValue('t');
  expect(generateTopicMemory).not.toHaveBeenCalled();
  expect(configureOpenAIAPI).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'GPT 연결 닫기' }));
  expect(screen.queryByRole('region', { name: 'GPT 연결 설정' })).toBeNull();
  expect(readMemoryDraft(memoryDraftKey(repo.getSnapshot())).draft?.generation?.input.guidance).toBe('공식의 적용 조건');
});
it('generates without notes, restores review edits after remount, saves once and preserves source in later editing/tests', async () => {
  mockResult();
  const repo = repository();
  let view = render(<Harness repo={repo} />);
  fireEvent.click(screen.getByRole('button', { name: 'GPT로 암기항목 만들기' }));
  fireEvent.click(screen.getByRole('button', { name: '이 목차로 생성' }));
  await screen.findByLabelText('1번 질문');
  expect(vi.mocked(generateTopicMemory).mock.calls[0][1].topics[0].path.map((n) => n.name)).toEqual(
    ['교류 회로', '커패시터'],
  );
  fireEvent.change(screen.getByLabelText('1번 기준 답안'), {
    target: { value: '수정한 기준 답안\n조건' },
  });
  expect(screen.getByRole('button', { name: '확인한 항목 등록' })).toBeDisabled();
  fireEvent.click(screen.getByLabelText('1번 질문과 답안을 확인했어요'));
  view.unmount();
  view = render(<Harness repo={repo} />);
  expect(screen.getByLabelText('1번 기준 답안')).toHaveValue('수정한 기준 답안\n조건');
  fireEvent.click(screen.getByRole('button', { name: '확인한 항목 등록' }));
  fireEvent.click(screen.getByRole('button', { name: '확인한 항목 등록' }));
  expect(repo.getSnapshot().memoryCards).toHaveLength(1);
  expect(repo.getSnapshot().memoryCards![0].topicGeneration!.originalAnswer).toBe(
    '  Z=1/(jωC)\n이상적인 소자 조건  ',
  );
  expect(generateTopicMemory).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole('button', { name: '항목 편집' }));
  fireEvent.change(screen.getByLabelText('기준 답안·조건'), { target: { value: '등록 후 수정' } });
  fireEvent.click(screen.getByRole('button', { name: '항목 저장' }));
  expect(repo.getSnapshot().memoryCards![0].topicGeneration!.originalAnswer).toContain('Z=');
  fireEvent.click(screen.getByRole('button', { name: '쪽지시험 시작' }));
  expect(screen.queryByText('등록 후 수정')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '시험 마치고 답안 비교' }));
  fireEvent.click(screen.getByRole('button', { name: '시험 결과 저장' }));
  expect(repo.getSnapshot().memoryTests![0].questions[0].topicGeneration).toEqual(
    repo.getSnapshot().memoryCards![0].topicGeneration,
  );
});
it('keeps generated output on storage failure and only retries registration, never generation', async () => {
  mockResult();
  const repo = repository();
  render(<Harness repo={repo} />);
  fireEvent.click(screen.getByRole('button', { name: 'GPT로 암기항목 만들기' }));
  fireEvent.click(screen.getByRole('button', { name: '이 목차로 생성' }));
  await screen.findByLabelText('1번 질문');
  fireEvent.click(screen.getByLabelText('1번 질문과 답안을 확인했어요'));
  repo.setFailure(true);
  fireEvent.click(screen.getByRole('button', { name: '확인한 항목 등록' }));
  expect(screen.getByRole('alert')).toHaveTextContent('저장 연결 실패');
  expect(screen.getByLabelText('1번 기준 답안')).toHaveValue('  Z=1/(jωC)\n이상적인 소자 조건  ');
  repo.setFailure(false);
  fireEvent.click(screen.getByRole('button', { name: '확인한 항목 등록' }));
  expect(repo.getSnapshot().memoryCards).toHaveLength(1);
  expect(generateTopicMemory).toHaveBeenCalledTimes(1);
});
it('hides AI controls for other users and stops rapid duplicate generation while keeping IME safe', async () => {
  const other = render(<Harness repo={repository('other-approved-admin')} />);
  expect(screen.queryByRole('button', { name: 'GPT로 암기항목 만들기' })).toBeNull();
  other.unmount();
  let resolve!: (v: Awaited<ReturnType<typeof generateTopicMemory>>) => void;
  vi.mocked(generateTopicMemory).mockImplementation(
    (_owner, input) =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  render(<Harness repo={repository()} />);
  fireEvent.click(screen.getByRole('button', { name: 'GPT로 암기항목 만들기' }));
  const guidance = screen.getByLabelText('출제 초점·난도 (선택)');
  fireEvent.compositionStart(guidance);
  expect(screen.getByRole('button', { name: '이 목차로 생성' })).toBeDisabled();
  fireEvent.compositionEnd(guidance);
  const generate = screen.getByRole('button', { name: '이 목차로 생성' });
  fireEvent.click(generate);
  fireEvent.click(generate);
  expect(generateTopicMemory).toHaveBeenCalledTimes(1);
  const input = vi.mocked(generateTopicMemory).mock.calls[0][1];
  resolve({
    id: 'r',
    at: '2026-10-01T00:00:00Z',
    model: 'test',
    input,
    cards: [{ id: 'c', topicId: 't', question: '질문', answer: '답' }],
  });
  await waitFor(() => expect(screen.getByLabelText('1번 질문')).toBeInTheDocument());
});
it('retains a completed response after leaving the screen instead of starting a second generation', async () => {
  const repo = repository();
  let resolve!: (value: Awaited<ReturnType<typeof generateTopicMemory>>) => void;
  vi.mocked(generateTopicMemory).mockImplementation(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  const view = render(<Harness repo={repo} />);
  fireEvent.click(screen.getByRole('button', { name: 'GPT로 암기항목 만들기' }));
  fireEvent.click(screen.getByRole('button', { name: '이 목차로 생성' }));
  const input = vi.mocked(generateTopicMemory).mock.calls[0][1];
  view.unmount();
  resolve({
    id: 'late',
    at: '2026-10-01T00:00:00Z',
    model: 'test',
    input,
    cards: [{ id: 'c', topicId: 't', question: '늦게 도착한 질문', answer: '원래 답' }],
  });
  await waitFor(() =>
    expect(readMemoryDraft(memoryDraftKey(repo.getSnapshot())).draft?.generation?.result?.id).toBe(
      'late',
    ),
  );
  render(<Harness repo={repo} />);
  expect(screen.getByLabelText('1번 질문')).toHaveValue('늦게 도착한 질문');
  expect(generateTopicMemory).toHaveBeenCalledTimes(1);
});
