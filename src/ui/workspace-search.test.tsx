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
