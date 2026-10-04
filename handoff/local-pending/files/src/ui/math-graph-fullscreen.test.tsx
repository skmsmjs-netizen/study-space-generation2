import { fireEvent, render, screen, within } from '@testing-library/react';
import { useEffect } from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { MathGraphFullscreen } from './math-graph-fullscreen';

const restore: Array<() => void> = [];
function stub(object: object, key: string, value: unknown) {
  const original = Object.getOwnPropertyDescriptor(object, key);
  Object.defineProperty(object, key, { configurable: true, writable: true, value });
  restore.push(() => { if (original) Object.defineProperty(object, key, original); else Reflect.deleteProperty(object, key); });
}
beforeEach(() => {
  stub(window, 'scrollTo', vi.fn());
  // jsdom does not implement the browser's dialog/top-layer methods.
  stub(HTMLDialogElement.prototype, 'showModal', function (this: HTMLDialogElement) { this.open = true; });
  stub(HTMLDialogElement.prototype, 'show', function (this: HTMLDialogElement) { this.open = true; });
  stub(HTMLDialogElement.prototype, 'close', function (this: HTMLDialogElement) { this.open = false; });
});
afterEach(() => { while (restore.length) restore.pop()?.(); vi.restoreAllMocks(); });

it('keeps the same renderer and unfinished input through repeated expansion, dismissal and inactive return', () => {
  const setup = vi.fn(), cleanup = vi.fn();
  function Graph() {
    useEffect(() => { setup(); return cleanup; }, []);
    return <><canvas aria-label="회전한 그래프" /><input aria-label="변수 초안" defaultValue="2" /></>;
  }
  const view = render(<MathGraphFullscreen><Graph /></MathGraphFullscreen>);
  const canvas = screen.getByLabelText('회전한 그래프');
  const input = screen.getByLabelText('변수 초안');
  fireEvent.change(input, { target: { value: '1+' } });
  for (let i = 0; i < 3; i++) {
    fireEvent.click(screen.getByRole('button', { name: '그래프 전체화면' }));
    const dialog = screen.getByRole('dialog', { name: '그래프 전체화면' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(within(dialog).getByLabelText('회전한 그래프')).toBe(canvas);
    expect(within(dialog).getByLabelText('변수 초안')).toBe(input);
    expect(input).toHaveValue('1+');
    expect(document.body.style.overflow).toBe('hidden');
    if (i === 1) fireEvent(dialog, new Event('cancel', { cancelable: true }));
    else fireEvent.click(within(dialog).getByRole('button', { name: '전체화면 닫기' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('button', { name: '그래프 전체화면' })).toHaveFocus();
    expect(document.body.style.overflow).not.toBe('hidden');
  }
  expect(setup).toHaveBeenCalledTimes(1);
  expect(cleanup).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: '그래프 전체화면' }));
  view.rerender(<MathGraphFullscreen active={false}><Graph /></MathGraphFullscreen>);
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(input).toHaveValue('1+');
});

it('retains usable full viewport when native fullscreen is denied', async () => {
  stub(document, 'fullscreenEnabled', true);
  const request = vi.fn().mockRejectedValue(new Error('Denied'));
  stub(HTMLElement.prototype, 'requestFullscreen', request);
  render(<MathGraphFullscreen><input aria-label="변수" /></MathGraphFullscreen>);
  fireEvent.click(screen.getByRole('button', { name: '그래프 전체화면' }));
  await Promise.resolve();
  expect(request).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '전체화면 닫기' }));
  expect(screen.queryByRole('dialog')).toBeNull();
});
