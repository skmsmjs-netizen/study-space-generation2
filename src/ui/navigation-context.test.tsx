import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NAVIGATION_CONTEXT_KEY, EDITING_CONTEXT_KEY, navigate, readRouteHash, useRoute } from './navigation-context';
import { NavigationBar } from './navigation-bar';
import { LoadingState } from './index';

let x = 0, y = 0;
const scrollTo = vi.fn((options: ScrollToOptions | number, top?: number) => {
  if (typeof options === 'number') { x = options; y = top ?? y; }
  else { x = options.left ?? x; y = options.top ?? y; }
});

function Harness({ persistentEditor = false }: { persistentEditor?: boolean }) {
  const route = useRoute();
  return <>
    {persistentEditor && <input aria-label="계속 작성 중인 글" defaultValue="원래 글" />}
    <main key={route}>
      <h1>{route}</h1>
      <button data-navigation-focus="topic:keep">기록 선택</button>
      <a href="#/second">다음 주제</a>
    </main>
  </>;
}

// DOM-level traversal fixture. Browser history and physical keyboard remain separate evidence.
function traversal(hash: string, state: unknown = { unrelated: 'keep' }) {
  act(() => {
    history.replaceState(state, '', hash);
    window.dispatchEvent(new PopStateEvent('popstate', { state }));
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
}

beforeEach(() => {
  sessionStorage.clear();
  history.replaceState({ unrelated: 'keep' }, '', '/#/first');
  x = 0; y = 0;
  Object.defineProperty(window, 'scrollX', { configurable: true, get: () => x });
  Object.defineProperty(window, 'scrollY', { configurable: true, get: () => y });
  vi.spyOn(window, 'scrollTo').mockImplementation(scrollTo);
  scrollTo.mockClear();
});
afterEach(() => vi.restoreAllMocks());

describe('route context', () => {
  function DelayedHarness({ ready = false }: { ready?: boolean }) {
    const route = useRoute();
    return <><a href="#/third">다른 화면</a><main key={route}><h1>{route}</h1>{route === '/second' && !ready ? <LoadingState /> : <button data-navigation-focus="late:control">늦게 열린 조작</button>}</main></>;
  }
  const seedDelayedPosition = () => sessionStorage.setItem(NAVIGATION_CONTEXT_KEY, JSON.stringify({ version: 1, route: '/first', positions: {
    '/second': { x: 0, y: 740, focus: { kind: 'key', value: 'late:control' } },
  } }));
  it('restores scroll and the original control after a lazy screen finishes loading', async () => {
    seedDelayedPosition(); const view = render(<DelayedHarness />);
    traversal('#/second');
    expect(scrollTo).not.toHaveBeenCalled();
    view.rerender(<DelayedHarness ready />);
    await act(async () => await Promise.resolve());
    expect(screen.getByRole('button', { name: '늦게 열린 조작' })).toHaveFocus(); expect(y).toBe(740);
  });
  it('does not overwrite a loading screen saved offset when navigating away early', () => {
    seedDelayedPosition(); render(<DelayedHarness />); traversal('#/second'); traversal('#/third');
    const saved = JSON.parse(sessionStorage.getItem(NAVIGATION_CONTEXT_KEY)!);
    expect(saved.positions['/second'].y).toBe(740);
    expect(screen.getByRole('heading')).toHaveTextContent('/third');
  });
  it('does not jump or refocus after the user interacts during deferred restoration', async () => {
    seedDelayedPosition(); const view = render(<DelayedHarness />); traversal('#/second');
    fireEvent.wheel(document.body); y = 90; scrollTo.mockClear();
    view.rerender(<DelayedHarness ready />); await act(async () => await Promise.resolve());
    expect(y).toBe(90); expect(scrollTo).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).not.toHaveFocus();
  });
  it('resumes position capture after a cancelled loading navigation gesture', async () => {
    seedDelayedPosition(); const view = render(<DelayedHarness />); traversal('#/second');
    fireEvent.pointerDown(screen.getByRole('link'));
    // The pointer gesture is cancelled and never activates the link.
    fireEvent.pointerCancel(screen.getByRole('link'));
    view.rerender(<DelayedHarness ready />); await act(async () => await Promise.resolve());
    expect(scrollTo).not.toHaveBeenCalled();
    y = 130; fireEvent(window, new Event('pagehide'));
    const saved = JSON.parse(sessionStorage.getItem(NAVIGATION_CONTEXT_KEY)!);
    expect(saved.positions['/second'].y).toBe(130);
  });
  it('handles malformed URI, unsafe routes, percent signs and original Korean IDs without throwing', () => {
    expect(readRouteHash('#/node/%E0%A4%A')).toBe('/');
    expect(readRouteHash('#javascript:alert(1)')).toBe('/');
    expect(readRouteHash('#//other.example/path')).toBe('/');
    expect(readRouteHash('#/%00')).toBe('/');
    expect(readRouteHash('#/node/100%25')).toBe('/node/100%');
    expect(readRouteHash(`#/node/${encodeURIComponent('원래 ID #1')}`)).toBe('/node/원래 ID #1');
    history.replaceState(null, '', '/#/node/%E0%A4%A');
    render(<Harness />);
    expect(screen.getByRole('heading')).toHaveTextContent('/');
  });

  it('restores departing route scroll and stable focus on back then forward', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const selected = screen.getByRole('button', { name: '기록 선택' });
    await user.tab(); expect(selected).toHaveFocus();
    y = 830;
    traversal('#/second');
    expect(screen.getByRole('heading')).toHaveTextContent('/second');
    expect(screen.getByRole('heading')).toHaveFocus();
    expect(y).toBe(0);
    screen.getByRole('link').focus(); y = 260;
    traversal('#/first');
    expect(screen.getByRole('button', { name: '기록 선택' })).toHaveFocus();
    expect(y).toBe(830);
    traversal('#/second');
    expect(screen.getByRole('link')).toHaveFocus();
    expect(y).toBe(260);
    expect(history.state).toEqual({ unrelated: 'keep' });
  });

  it('captures imperative navigation before hash mutation', () => {
    render(<Harness />);
    screen.getByRole('button').focus(); y = 150;
    act(() => { navigate('/second'); });
    const saved = JSON.parse(sessionStorage.getItem(NAVIGATION_CONTEXT_KEY)!);
    expect(saved.positions['/first']).toEqual({ x: 0, y: 150, focus: { kind: 'key', value: 'topic:keep' } });
    act(() => window.dispatchEvent(new HashChangeEvent('hashchange')));
    expect(screen.getByRole('heading')).toHaveTextContent('/second');
  });
  it('preserves reading position from before pointer focus scrolls the menu into view', async () => {
    render(<Harness />); const link = screen.getByRole('link');
    y = 840;
    fireEvent.pointerDown(link, { button: 0 });
    y = 895; link.focus();
    fireEvent.click(link, { button: 0, detail: 1 });
    const saved = JSON.parse(sessionStorage.getItem(NAVIGATION_CONTEXT_KEY)!);
    expect(saved.positions['/first'].y).toBe(840);
    expect(saved.positions['/first'].focus).toEqual({ kind: 'href', value: '#/second' });
    await screen.findByRole('heading', { name: '/second' });
  });

  it('recovers current route and position only when restart URL has no hash', () => {
    const view = render(<Harness />);
    screen.getByRole('button').focus(); y = 340;
    fireEvent(window, new Event('pagehide'));
    view.unmount();
    history.replaceState({ foreignState: [1, 2] }, '', '/?kept=1');
    render(<Harness />);
    expect(screen.getByRole('heading')).toHaveTextContent('/first');
    expect(location.hash).toBe('#/first');
    expect(location.search).toBe('?kept=1');
    expect(history.state).toEqual({ foreignState: [1, 2] });
    expect(y).toBe(340);
  });

  it('honors an explicit URL over saved restart context', () => {
    sessionStorage.setItem(NAVIGATION_CONTEXT_KEY, JSON.stringify({ version: 1, route: '/stale', positions: {} }));
    history.replaceState(null, '', '/#/requested');
    render(<Harness />);
    expect(screen.getByRole('heading')).toHaveTextContent('/requested');
  });

  it('ignores a corrupt saved route that cannot be encoded as a restart URL', () => {
    sessionStorage.setItem(NAVIGATION_CONTEXT_KEY, JSON.stringify({ version: 1, route: '/\ud800', positions: {} }));
    history.replaceState({ unrelated: 'keep' }, '', '/');
    render(<Harness />);
    expect(screen.getByRole('heading').textContent).toBe('/');
    expect(history.state).toEqual({ unrelated: 'keep' });
  });

  it('never steals a surviving editor focus or jumps its scroll after route changes', () => {
    render(<Harness persistentEditor />);
    const editor = screen.getByRole('textbox');
    editor.focus(); y = 120;
    traversal('#/second');
    expect(editor).toHaveFocus();
    expect(editor).toHaveValue('원래 글');
    expect(y).toBe(120);
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('keeps typing and routing available if session storage is denied and never touches draft keys', () => {
    const get = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new DOMException('denied', 'SecurityError'); });
    const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('full', 'QuotaExceededError'); });
    render(<Harness />);
    traversal('#/second');
    expect(screen.getByRole('heading')).toHaveTextContent('/second');
    expect(get.mock.calls.every(call => [NAVIGATION_CONTEXT_KEY, EDITING_CONTEXT_KEY].includes(call[0]))).toBe(true);
    expect(set.mock.calls.every(call => [NAVIGATION_CONTEXT_KEY, EDITING_CONTEXT_KEY].includes(call[0]))).toBe(true);
  });

  it('ignores corrupt hints and falls back when the saved focus control was removed', () => {
    sessionStorage.setItem(NAVIGATION_CONTEXT_KEY, JSON.stringify({ version: 1, route: '/first', positions: {
      '/first': { x: -10, y: 'bad' },
      '/second': { x: 0, y: 245, focus: { kind: 'id', value: 'removed-control' } },
    } }));
    render(<Harness />);
    traversal('#/second');
    expect(screen.getByRole('heading')).toHaveFocus();
    expect(y).toBe(245);
  });

  it('does not focus a heading on first mount or intercept browser keyboard shortcuts', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(document.body).toHaveFocus();
    await user.tab();
    await user.keyboard('{Alt>}{ArrowLeft}{/Alt}');
    expect(screen.getByRole('button')).toHaveFocus();
    expect(screen.getByRole('heading')).toHaveTextContent('/first');
  });

  it.each([false, true])('restores the clicked menu rather than the same-href brand, narrow=%s', async narrow => {
    function MenuHarness({ narrow }: { narrow: boolean }) {
      const route = useRoute();
      const items = [{ href: '#/second', label: '오늘' }];
      return <>
        <a href="#/second">공부의 자리</a>
        <aside style={{ display: narrow ? 'none' : 'block' }}><NavigationBar label="주 메뉴" items={items} /></aside>
        <div style={{ display: narrow ? 'block' : 'none' }}><NavigationBar label="빠른 이동" items={items} /></div>
        <main key={route}><h1>{route}</h1></main>
      </>;
    }
    const user = userEvent.setup(), view = render(<MenuHarness narrow={narrow} />);
    const clicked = screen.getByRole('navigation', { name: narrow ? '빠른 이동' : '주 메뉴' }).querySelector('a')!;
    await user.click(clicked);
    await act(async () => window.dispatchEvent(new HashChangeEvent('hashchange')));
    traversal('#/first');
    expect(clicked).toHaveFocus();
    expect(screen.getByRole('link', { name: '공부의 자리' })).not.toHaveFocus();
    // A breakpoint can change which copy is shown while visiting another route.
    clicked.focus(); traversal('#/second');
    view.rerender(<MenuHarness narrow={!narrow} />);
    traversal('#/first');
    const visible = screen.getByRole('navigation', { name: narrow ? '주 메뉴' : '빠른 이동' }).querySelector('a')!;
    expect(visible).toBeVisible(); expect(visible).toHaveFocus();
    expect(clicked).not.toBeVisible(); expect(clicked).not.toHaveFocus();
  });
});

it('restores long text selection direction and internal scroll through route replacement and remount', async () => {
  function EditorHarness() {
    const route = useRoute();
    return <main key={route}><h1>{route}</h1>{route === '/first' && <textarea aria-label="긴 글" data-editing-context="narrative:stable" defaultValue={'가나다라마바사\n'.repeat(100)} />}</main>;
  }
  const view = render(<EditorHarness />);
  let editor = screen.getByRole('textbox') as HTMLTextAreaElement;
  editor.focus(); editor.setSelectionRange(22, 58, 'backward'); editor.scrollTop = 340; editor.scrollLeft = 12;
  fireEvent.select(editor); fireEvent.scroll(editor);
  const saved = sessionStorage.getItem(EDITING_CONTEXT_KEY)!;
  expect(saved).not.toContain('가나다');
  traversal('#/second'); traversal('#/first');
  await act(async () => await Promise.resolve());
  editor = screen.getByRole('textbox') as HTMLTextAreaElement;
  expect([editor.selectionStart, editor.selectionEnd, editor.selectionDirection, editor.scrollTop, editor.scrollLeft]).toEqual([22, 58, 'backward', 340, 12]);
  fireEvent(window, new Event('pagehide')); view.unmount();
  render(<EditorHarness />); editor = screen.getByRole('textbox') as HTMLTextAreaElement;
  expect([editor.selectionStart, editor.selectionEnd, editor.selectionDirection, editor.scrollTop]).toEqual([22, 58, 'backward', 340]);
});
