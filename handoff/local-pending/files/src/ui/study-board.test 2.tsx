import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, expect, it } from 'vitest';
import { DemoRepository } from '../data/demo-repository';
import { StudyBoard } from './study-board';
import { readBoardDraft, boardDraftKey } from '../data/study-board-draft';
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
function open(repo: DemoRepository) {
  return render(
    <StudyBoard
      data={repo.getSnapshot()}
      repository={repo}
      onSaved={() => {}}
      subjectIds={repo.getSnapshot().subjects.map((s) => s.id)}
    />,
  );
}
it('adds, moves and reopens exact text while study records remain unchanged', () => {
  const repo = new DemoRepository(localStorage),
    before = structuredClone(repo.getSnapshot().records),
    view = open(repo);
  fireEvent.click(screen.getByRole('button', { name: '+ 할 일에 카드 추가' }));
  fireEvent.change(screen.getByLabelText('할 일'), { target: { value: '조건 확인' } });
  fireEvent.change(screen.getByLabelText('메모 (선택)'), { target: { value: '  내 글\n예외  ' } });
  fireEvent.click(screen.getByRole('button', { name: '카드 저장' }));
  fireEvent.change(screen.getByLabelText('조건 확인 옮길 열'), { target: { value: 'finished' } });
  view.unmount();
  open(new DemoRepository(localStorage));
  expect(
    within(screen.getByRole('region', { name: '마침 열' })).getByText('조건 확인'),
  ).toBeInTheDocument();
  expect(repo.getSnapshot().studyBoards?.[0].cards[0].body).toBe('  내 글\n예외  ');
  expect(repo.getSnapshot().records).toEqual(before);
});
it('restores unfinished card writing in the same tab and keeps a new tab separate', () => {
  const repo = new DemoRepository(localStorage),
    view = open(repo);
  fireEvent.click(screen.getByRole('button', { name: '+ 할 일에 카드 추가' }));
  fireEvent.change(screen.getByLabelText('메모 (선택)'), { target: { value: '아직 쓰는 중' } });
  view.unmount();
  const next = open(repo);
  expect(screen.getByLabelText('메모 (선택)')).toHaveValue('아직 쓰는 중');
  next.unmount();
  sessionStorage.clear();
  open(repo);
  expect(screen.queryByLabelText('메모 (선택)')).toBeNull();
});
it('retains exact text and a stable operation after a failed write and retry', () => {
  const repo = new DemoRepository(localStorage),
    execute = repo.execute.bind(repo);
  let fail = true;
  repo.execute = (command) => {
    if (fail) throw Error('저장 실패');
    return execute(command);
  };
  open(repo);
  fireEvent.click(screen.getByRole('button', { name: '+ 할 일에 카드 추가' }));
  fireEvent.change(screen.getByLabelText('할 일'), { target: { value: '원문 유지' } });
  fireEvent.click(screen.getByRole('button', { name: '카드 저장' }));
  const operation = readBoardDraft(repo.getSnapshot())!.operation;
  expect(operation?.opId).toBeTruthy();
  expect(screen.getByLabelText('할 일')).toHaveValue('원문 유지');
  fail = false;
  fireEvent.click(screen.getByRole('button', { name: '카드 저장 다시 시도' }));
  expect(repo.getSnapshot().studyBoards?.[0].cards).toHaveLength(1);
  expect(repo.getSnapshot().revisions.at(-1)?.operationId).toBe(operation!.opId);
});
it('keeps corrupt draft bytes and offers an explicit archive before editing', () => {
  const repo = new DemoRepository(localStorage),
    key = boardDraftKey(repo.getSnapshot());
  localStorage.setItem(key, 'broken 原文');
  open(repo);
  expect(screen.getByRole('button', { name: '+ 할 일에 카드 추가' })).toBeDisabled();
  expect(localStorage.getItem(key)).toBe('broken 原文');
  fireEvent.click(screen.getByRole('button', { name: '초안 사본 보관 후 보드 열기' }));
  expect(
    Object.keys(localStorage).some(
      (k) => k.startsWith(`${key}:recovery:`) && localStorage.getItem(k) === 'broken 原文',
    ),
  ).toBe(true);
  expect(screen.getByRole('button', { name: '+ 할 일에 카드 추가' })).not.toBeDisabled();
});
