import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, expect, it } from 'vitest';
import { DemoRepository } from '../data/demo-repository';
import { ExamPractice } from './exam-practice';
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
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
