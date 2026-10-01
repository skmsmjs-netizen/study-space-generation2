import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, expect, it } from 'vitest';
import { DemoRepository } from '../data/demo-repository';
import { ExamPractice } from './exam-practice';
import { freshExamPractice, savePracticeMemo } from '../data/exam-practice';
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
it('prepares another attempt from history, hides the old answer and locks repeat while an attempt is active', () => {
  const repo = new DemoRepository(localStorage),
    old = {
      ...freshExamPractice('demo-topic-function'),
      phase: 'review' as const,
      topicName: '함수는 어떤 관계일까?',
      minutes: 10,
      startedAt: '2026-10-01T04:00:00Z',
      endedAt: '2026-10-01T04:10:00Z',
      answer: '이전 정답은 바로 보이면 안 된다',
      reflection: '  조건 판단  ',
      nextStep: '다른 상황으로 풀기',
    };
  savePracticeMemo(repo, old);
  const view = open(repo);
  fireEvent.click(screen.getByText('지난 연습 1개'));
  fireEvent.click(screen.getByRole('button', { name: '같은 주제로 다시 연습' }));
  expect(screen.getByLabelText('연습할 주제')).toHaveValue(old.topicId);
  expect(screen.getByLabelText('연습 시간')).toHaveValue('10');
  expect(screen.getByText('조건 판단')).toBeVisible();
  expect(screen.queryByText(old.answer)).toBeNull();
  view.unmount();
  open(repo);
  expect(screen.getByText('다른 상황으로 풀기')).toBeVisible();
  fireEvent.change(screen.getByLabelText('연습할 주제'), { target: { value: 'demo-topic-graph' } });
  expect(screen.queryByText('다른 상황으로 풀기')).toBeNull();
  fireEvent.click(screen.getByText('지난 연습 1개'));
  fireEvent.click(screen.getByRole('button', { name: '같은 주제로 다시 연습' }));
  fireEvent.click(screen.getByRole('button', { name: '연습 시작' }));
  expect(screen.getByRole('button', { name: '같은 주제로 다시 연습' })).toBeDisabled();
  expect(screen.getByLabelText('풀이·답안')).toHaveValue('');
});
function open(repo: DemoRepository) {
  return render(
    <ExamPractice
      data={repo.getSnapshot()}
      repository={repo}
      subjectIds={repo.getSnapshot().subjects.map((s) => s.id)}
      onSaved={() => {}}
    />,
  );
}
it('starts without uploads, hides optional writing and restores it after leaving', () => {
  const repo = new DemoRepository(localStorage),
    view = open(repo);
  fireEvent.change(screen.getByLabelText('연습할 주제'), {
    target: { value: 'demo-topic-function' },
  });
  fireEvent.click(screen.getByRole('button', { name: '연습 시작' }));
  fireEvent.change(screen.getByLabelText('풀이·답안'), { target: { value: '  내가 적은 답\n  ' } });
  fireEvent.click(screen.getByRole('button', { name: '잠시 멈추기' }));
  view.unmount();
  open(repo);
  expect(screen.getByRole('button', { name: '이어서 풀기' })).toBeVisible();
  expect(screen.getByLabelText('풀이·답안')).toHaveValue('  내가 적은 답\n  ');
  fireEvent.click(screen.getByRole('button', { name: '연습 마치기' }));
  fireEvent.change(screen.getByLabelText('막힌 곳'), { target: { value: '조건을 놓쳤다' } });
  fireEvent.click(screen.getByRole('button', { name: '연습 기록 남기기' }));
  expect(screen.getByRole('link', { name: '남긴 메모 보기' })).toBeVisible();
  expect(repo.getSnapshot().memos?.at(-1)?.body).toContain('조건을 놓쳤다');
});
it('does not finish or save mid-composition and permits a blank reflection', () => {
  const repo = new DemoRepository(localStorage);
  open(repo);
  fireEvent.change(screen.getByLabelText('연습할 주제'), {
    target: { value: 'demo-topic-function' },
  });
  fireEvent.click(screen.getByRole('button', { name: '연습 시작' }));
  fireEvent.compositionStart(screen.getByLabelText('풀이·답안'));
  expect(screen.getByRole('button', { name: '연습 마치기' })).toBeDisabled();
  fireEvent.compositionEnd(screen.getByLabelText('풀이·답안'));
  fireEvent.click(screen.getByRole('button', { name: '연습 마치기' }));
  fireEvent.click(screen.getByRole('button', { name: '연습 기록 남기기' }));
  expect(screen.getByRole('button', { name: '새 연습' })).toBeVisible();
});
