import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NAVIGATION_CONTEXT_KEY, navigate, readRouteHash, useRoute } from './navigation-context';

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
    expect(get.mock.calls.every(call => call[0] === NAVIGATION_CONTEXT_KEY)).toBe(true);
    expect(set.mock.calls.every(call => call[0] === NAVIGATION_CONTEXT_KEY)).toBe(true);
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
});
