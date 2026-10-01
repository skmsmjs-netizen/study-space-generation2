import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { useTextDraft } from './App';
import { clearRescuedDraft } from './data/draft-safety';
const key = 'study-space:sync-editor-test';
beforeEach(() => { localStorage.clear(); clearRescuedDraft(key); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); clearRescuedDraft(key); });
function editor(initial = '저장된 원문', version = 1) {
  return renderHook(({ initial, version }) => useTextDraft(key, initial, version), { initialProps: { initial, version } });
}
it('updates an open clean editor and its save version after a remote refresh', () => {
  const view = editor();
  view.rerender({ initial: '  다른 브라우저에서 수정\n끝 공백  ', version: 2 });
  expect(view.result.current.body).toBe('  다른 브라우저에서 수정\n끝 공백  ');
  expect(view.result.current.expected.current).toBe(2);
  expect(localStorage.getItem(key)).toBeNull();
});
it('keeps unsaved text and its original conflict version when remote text arrives', () => {
  const view = editor();
  act(() => view.result.current.change('  내 미저장 글\n예외  '));
  const stored = localStorage.getItem(key);
  view.rerender({ initial: '다른 쪽의 저장된 글', version: 2 });
  expect(view.result.current.body).toBe('  내 미저장 글\n예외  ');
  expect(view.result.current.expected.current).toBe(1);
  expect(localStorage.getItem(key)).toBe(stored);
});
it('protects a restored stale draft even when it happens to match the current text', () => {
  localStorage.setItem(key, JSON.stringify({ body: '저장된 원문', version: 0 }));
  const view = editor();
  view.rerender({ initial: '원격 수정', version: 2 });
  expect(view.result.current.body).toBe('저장된 원문');
  expect(view.result.current.expected.current).toBe(0);
  expect(JSON.parse(localStorage.getItem(key)!).version).toBe(0);
});
it('accepts later remote updates after successful save and ignores older snapshots', () => {
  const view = editor();
  act(() => view.result.current.change('내 저장 글'));
  act(() => { view.result.current.clear(2); view.rerender({ initial: '내 저장 글', version: 2 }); });
  view.rerender({ initial: '다음 원격 수정', version: 3 });
  expect(view.result.current.body).toBe('다음 원격 수정');
  view.rerender({ initial: '이전 서버 응답', version: 1 });
  expect(view.result.current.body).toBe('다음 원격 수정');
  expect(view.result.current.expected.current).toBe(3);
});
it('retains corrupt disk bytes and failed unsaved input during remote updates', () => {
  localStorage.setItem(key, '{broken original');
  const view = editor();
  act(() => view.result.current.change('복사할 내 글'));
  view.rerender({ initial: '원격 수정', version: 2 });
  expect(view.result.current.body).toBe('복사할 내 글');
  expect(view.result.current.blocked).toBe(true);
  expect(view.result.current.expected.current).toBe(1);
  expect(localStorage.getItem(key)).toBe('{broken original');
});
