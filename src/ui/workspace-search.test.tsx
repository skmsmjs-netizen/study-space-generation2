import { beforeEach, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { createDemoState } from '../domain/fixtures';
import { recommendationKey } from '../domain/recommendation-workspace';
import { WorkspaceSearch } from './workspace-search';
import { viewContextKey } from '../data/view-context';
import { isViewText, useViewContext } from './use-view-context';

const data = createDemoState();
function Harness() {
  const [query, setQuery] = useState('');
  return (
    <WorkspaceSearch
      data={data}
      query={query}
      onQueryChange={setQuery}
      subjectIds={data.subjects.map((row) => row.id)}
      allScopes
      onAllScopes={() => {}}
    />
  );
}
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
it('allows the same query after clearing, and waits for Korean composition to finish', () => {
  render(<Harness />);
  const input = screen.getByRole('searchbox');
  fireEvent.change(input, { target: { value: '함수' } });
  expect(screen.getByRole('link', { name: '함수는 어떤 관계일까?' })).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: '검색어 지우기' }));
  expect(input).toHaveValue('');
  fireEvent.compositionStart(input);
  fireEvent.change(input, { target: { value: '함수' } });
  expect(screen.queryByRole('link', { name: '함수는 어떤 관계일까?' })).toBeNull();
  fireEvent.compositionEnd(input, { data: '함수' });
  expect(screen.getByRole('link', { name: '함수는 어떤 관계일까?' })).toBeVisible();
});
it('preserves a damaged legacy plan and keeps unrelated search usable with recovery guidance', () => {
  const key = recommendationKey(data),
    raw = '{invalid';
  localStorage.setItem(key, raw);
  render(<Harness />);
  expect(screen.getByRole('alert')).toHaveTextContent(
    '일정·코드 연결의 검색 정보를 읽지 못했습니다',
  );
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: '함수' } });
  expect(screen.getByRole('link', { name: '함수는 어떤 관계일까?' })).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: '다시 시도' }));
  expect(localStorage.getItem(key)).toBe(raw);
});
it('restores optional list hints on return and tolerates unavailable tab storage', () => {
  function Hint() {
    const [value, setValue] = useViewContext(data, 'test:query', '', isViewText);
    return (
      <input
        aria-label="목록 검색"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  }
  const view = render(<Hint />);
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '  원래 조건  ' } });
  view.unmount();
  const next = render(<Hint />);
  expect(screen.getByRole('textbox')).toHaveValue('  원래 조건  ');
  const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('unavailable');
  });
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '새 조건' } });
  expect(screen.getByRole('textbox')).toHaveValue('새 조건');
  spy.mockRestore();
  next.unmount();
  expect(sessionStorage.getItem(viewContextKey(data, 'test:query'))).toBe(
    JSON.stringify('  원래 조건  '),
  );
});

it('keeps active, trash and account view hints separate when the same component is reused', () => {
  function Hint({ name, userId = data.userId }: { name: string; userId?: string }) {
    const [value, setValue] = useViewContext(
      { ...data, namespace: 'personal', userId },
      name,
      '',
      isViewText,
    );
    return (
      <input
        aria-label="목록 검색"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  }
  const view = render(<Hint name="active" />);
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '보관된 원문' } });
  view.rerender(<Hint name="trash" />);
  expect(screen.getByRole('textbox')).toHaveValue('');
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '휴지통 조건' } });
  view.rerender(<Hint name="active" />);
  expect(screen.getByRole('textbox')).toHaveValue('보관된 원문');
  view.rerender(<Hint name="active" userId="other" />);
  expect(screen.getByRole('textbox')).toHaveValue('');
  view.rerender(<Hint name="trash" />);
  expect(screen.getByRole('textbox')).toHaveValue('휴지통 조건');
});

it('searches accumulated originals beyond the first page without rendering every result at once', () => {
  const many = createDemoState();
  many.studyMaterials = Array.from({ length: 85 }, (_, index) => ({
    id: `accumulated-${index}`,
    namespace: many.namespace,
    userId: many.userId,
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
    version: 1,
    deletedAt: null,
    title: `누적 필기 ${index}`,
    subjectId: many.subjects[0].id,
    topicId: null,
    sourceText: `  누적검색 원문 ${index === 84 ? '마지막개별조건' : ''}\n예외 보존  `,
    audio: null,
    results: [],
  }));
  const original = structuredClone(many);
  function Many() {
    const [query, setQuery] = useState('');
    return (
      <WorkspaceSearch
        data={many}
        query={query}
        onQueryChange={setQuery}
        subjectIds={many.subjects.map((subject) => subject.id)}
        allScopes
        onAllScopes={() => {}}
      />
    );
  }
  render(<Many />);
  const input = screen.getByRole('searchbox');
  fireEvent.change(input, { target: { value: '누적검색' } });
  expect(screen.getByRole('status')).toHaveTextContent('찾은 항목 85개');
  expect(screen.getAllByRole('link')).toHaveLength(40);
  fireEvent.click(screen.getByRole('button', { name: '검색 결과 더 보기' }));
  expect(screen.getAllByRole('link')).toHaveLength(80);
  fireEvent.change(input, { target: { value: '마지막개별조건' } });
  expect(screen.getByRole('link', { name: '누적 필기 84' })).toBeVisible();
  expect(screen.getAllByRole('link')).toHaveLength(1);
  expect(many).toEqual(original);
});
