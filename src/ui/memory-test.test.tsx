import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { beforeEach, expect, it } from 'vitest';
import { DemoRepository } from '../data/demo-repository';
import { MemoryTests } from './memory-test';
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
function Harness({ repo }: { repo: DemoRepository }) {
  const [data, setData] = useState(repo.getSnapshot());
  return (
    <MemoryTests
      data={data}
      repository={repo}
      subjectIds={data.subjects.map((s) => s.id)}
      onSaved={setData}
    />
  );
}
it('registers a card, hides answer until completion, reloads response and saves an independent test', () => {
  const repo = new DemoRepository(localStorage),
    original = structuredClone(repo.getSnapshot().records);
  let view = render(<Harness repo={repo} />);
  fireEvent.click(screen.getByRole('button', { name: '암기 항목 등록' }));
  fireEvent.change(screen.getByLabelText('질문·개념'), { target: { value: '질문 원문' } });
  fireEvent.change(screen.getByLabelText('기준 답안·조건'), {
    target: { value: '  기준 답안 원문\n' },
  });
  fireEvent.click(screen.getByRole('button', { name: '항목 저장' }));
  fireEvent.click(screen.getByRole('button', { name: '쪽지시험 시작' }));
  expect(screen.queryByText('기준 답안 원문')).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('내 답안'), { target: { value: '  내 답안 원문\n' } });
  fireEvent.compositionStart(screen.getByLabelText('내 답안'));
  expect(screen.getByRole('button', { name: '시험 마치고 답안 비교' })).toBeDisabled();
  fireEvent.compositionEnd(screen.getByLabelText('내 답안'));
  view.unmount();
  view = render(<Harness repo={new DemoRepository(localStorage)} />);
  expect(screen.getByLabelText('내 답안')).toHaveValue('  내 답안 원문\n');
  fireEvent.click(screen.getByRole('button', { name: '시험 마치고 답안 비교' }));
  expect(screen.getByText('기준 답안 원문')).toBeVisible();
  fireEvent.change(screen.getByLabelText('1번 비교 결과'), { target: { value: 'partial' } });
  fireEvent.click(screen.getByRole('button', { name: '시험 결과 저장' }));
  const saved = new DemoRepository(localStorage).getSnapshot();
  expect(saved.memoryTests![0].questions[0]).toMatchObject({
    response: '  내 답안 원문\n',
    answer: '  기준 답안 원문\n',
    verdict: 'partial',
  });
  expect(saved.records).toEqual(original);
  fireEvent.click(screen.getByRole('button', { name: '틀리거나 부분적으로 맞은 문항 다시 시험' }));
  expect(screen.getByLabelText('내 답안')).toHaveValue('');
  expect(screen.queryByText('기준 답안 원문')).not.toBeInTheDocument();
});
it('allows a blank answer without silently grading it wrong', () => {
  const repo = new DemoRepository(localStorage),
    data = repo.getSnapshot();
  repo.execute({
    type: 'saveMemoryCard',
    id: 'card',
    expectedVersion: 0,
    content: { topicId: 'demo-topic-function', question: '문제', answer: '정답', strokes: [] },
    userId: data.userId,
    namespace: 'demo',
    opId: 'create',
    at: new Date().toISOString(),
  });
  render(<Harness repo={repo} />);
  fireEvent.click(screen.getByRole('button', { name: '쪽지시험 시작' }));
  fireEvent.click(screen.getByRole('button', { name: '시험 마치고 답안 비교' }));
  expect(screen.getByRole('option', { name: '틀림' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: '시험 결과 저장' }));
  expect(repo.getSnapshot().memoryTests![0].questions[0].verdict).toBeNull();
});
