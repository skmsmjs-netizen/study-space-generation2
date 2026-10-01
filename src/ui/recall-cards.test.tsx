import { useState } from 'react';
import { beforeEach, it, expect, vi, afterEach } from 'vitest';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { TopicRecall } from './topic-recall';
import { DemoRepository } from '../data/demo-repository';
import { readRecall, writeRecall } from '../data/topic-recall';
import { freshRecall } from '../domain/topic-recall';
let repo: DemoRepository;
function Harness() {
  const [data, setData] = useState(repo.getSnapshot());
  return <TopicRecall data={data} repository={repo} onSaved={setData} subjectIds={data.subjects.map(row => row.id)} />;
}
beforeEach(() => { localStorage.clear(); repo = new DemoRepository(localStorage); writeRecall(repo.getSnapshot(), freshRecall()); });
afterEach(() => vi.restoreAllMocks());
it('registers and restores two separate question drafts, rates and undoes the chosen question', () => {
  let view = render(<Harness />);
  fireEvent.click(screen.getByText('질문 카드 만들기·수정'));
  const topic = repo.getSnapshot().nodes.find(row => row.role === 'topic')!;
  fireEvent.change(screen.getByRole('combobox', { name: '카드의 공부 주제' }), { target: { value: topic.id } });
  fireEvent.change(screen.getByRole('textbox', { name: '질문 (앞면)' }), { target: { value: '  첫 질문\n ' } });
  fireEvent.change(screen.getByRole('textbox', { name: '참고 답변 (뒷면)' }), { target: { value: '  첫 설명\n ' } });
  view.unmount(); view = render(<Harness />); fireEvent.click(screen.getByText('질문 카드 만들기·수정'));
  expect(screen.getByRole('textbox', { name: '질문 (앞면)' })).toHaveValue('  첫 질문\n ');
  fireEvent.click(screen.getByRole('button', { name: '질문 카드 등록' }));
  fireEvent.change(screen.getByRole('textbox', { name: '질문 (앞면)' }), { target: { value: '둘째 질문' } });
  fireEvent.click(screen.getByRole('button', { name: '질문 카드 등록' }));
  const [a, b] = repo.getSnapshot().recallCards!;
  view.unmount(); writeRecall(repo.getSnapshot(), { ...readRecall(repo.getSnapshot()), currentId: a.id }); view = render(<Harness />);
  expect(screen.getByRole('heading', { name: '첫 질문' })).toBeInTheDocument();
  fireEvent.click(screen.getByText('글로 쓰기')); fireEvent.change(screen.getByRole('textbox', { name: '글' }), { target: { value: '첫 질문에 대한 답' } });
  fireEvent.click(screen.getByRole('button', { name: '설명 확인하고 평가' })); expect(screen.getByText('첫 설명', { selector: 'p' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /^쉬움/ }));
  expect(repo.getSnapshot().recallCards!.find(row => row.id === b.id)!.reviews).toHaveLength(0);
  view.unmount(); render(<Harness />); fireEvent.click(screen.getByRole('button', { name: '마지막 평가 되돌리기' }));
  expect(readRecall(repo.getSnapshot()).currentId).toBe(a.id);
  fireEvent.click(screen.getByText(/글로 쓰기/)); expect(screen.getByRole('textbox', { name: '글' })).toHaveValue('첫 질문에 대한 답');
  expect(repo.getSnapshot().memos).toHaveLength(1);
});
it('shows no-data optimization without opening a calculation window or changing settings', () => {
  const open = vi.spyOn(window, 'open'); render(<Harness />);
  fireEvent.click(screen.getByText('복습 설정'));
  fireEvent.click(screen.getByRole('button', { name: '복습 이력으로 최적화' }));
  expect(screen.getByText(/날짜를 달리한 복습 이력이 아직 없습니다/)).toBeInTheDocument();
  expect(open).not.toHaveBeenCalled(); expect(repo.getSnapshot().recallPreferences ?? []).toHaveLength(0);
});
it('calculates, applies weights, and preserves an unsaved settings edit before applying', () => {
  const data = repo.getSnapshot(), topic = data.nodes.find(row => row.role === 'topic')!;
  repo.execute({ type: 'reviewRecallCard', id: 'trained', topicId: topic.id, expectedVersion: 0, rating: 3, at: '2026-08-01T03:00:00Z', userId: data.userId, namespace: data.namespace, opId: crypto.randomUUID() });
  repo.execute({ type: 'reviewRecallCard', id: 'trained', topicId: topic.id, expectedVersion: 1, rating: 3, at: '2026-08-03T03:00:00Z', userId: data.userId, namespace: data.namespace, opId: crypto.randomUUID() });
  const instances: { onmessage: null | ((event: { data: unknown }) => void); postMessage: ReturnType<typeof vi.fn>; close: ReturnType<typeof vi.fn> }[] = [];
  class Channel {
    onmessage: null | ((event: { data: unknown }) => void) = null; postMessage = vi.fn(); close = vi.fn();
    constructor() { instances.push(this); }
  }
  vi.stubGlobal('BroadcastChannel', Channel); vi.spyOn(window, 'open').mockReturnValue(window);
  try {
    render(<Harness />); fireEvent.click(screen.getByText('복습 설정'));
    fireEvent.click(screen.getByRole('button', { name: '복습 이력으로 최적화' }));
    act(() => instances[0].onmessage!({ data: { type: 'ready' } }));
    expect(instances[0].postMessage).toHaveBeenCalledWith(expect.objectContaining({ type: 'input', payload: expect.objectContaining({ lengths: [2], ratings: [3,3], deltaTs: [0,2] }) }));
    const parameters = [.1, 1, 8, 60, 6, .5, 3, .05, 1.5, .1, .5, 1.9, .1, .3, 2, .2, 2.8, .5, .6, .07, .15];
    act(() => instances[0].onmessage!({ data: { type: 'result', parameters } }));
    fireEvent.change(screen.getByRole('spinbutton', { name: '목표 기억률 (%)' }), { target: { value: '91' } });
    expect(screen.getByRole('button', { name: '최적화 결과 적용' })).toBeDisabled();
    fireEvent.change(screen.getByRole('spinbutton', { name: '목표 기억률 (%)' }), { target: { value: '90' } });
    const memory = repo.getSnapshot().recallCards![0].memory;
    fireEvent.click(screen.getByRole('button', { name: '최적화 결과 적용' }));
    expect(repo.getSnapshot().recallPreferences![0].options).toMatchObject({ parameters, optimizedReviews: 1 });
    expect(repo.getSnapshot().recallCards![0].memory).toEqual(memory);
    fireEvent.click(screen.getByRole('button', { name: '복습 설정 저장' }));
    expect(repo.getSnapshot().recallPreferences![0].options.parameters).toEqual(parameters);
  } finally { vi.unstubAllGlobals(); }
});
