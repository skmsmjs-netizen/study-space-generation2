import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button, EmptyState, LoadingState, Tabs } from './index';
import { SavedMark, usePlayerMotion } from './motion';

afterEach(() => { delete document.documentElement.dataset.motion; vi.unstubAllGlobals(); vi.useRealTimers(); });
describe('motion preserves actions and accessible content', () => {
  it('stops loops on the manual preference while retaining busy labels and preventing resubmission', () => {
    document.documentElement.dataset.motion = 'reduce';
    const submit = vi.fn();
    const { container } = render(<><Button busy onClick={submit}>내용 저장</Button><LoadingState message="자료를 읽고 있습니다." /></>);
    expect(screen.getByRole('button', { name: '내용 저장' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: '내용 저장' }));
    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent('자료를 읽고 있습니다.');
    expect(container.querySelectorAll('[data-motion-source="ldrs"]')).toHaveLength(2);
    expect(container.querySelector('[class^="container_"]')).not.toBeInTheDocument();
  });
  it('keeps changing an external selection and its keyboard focus without remounting editable content', () => {
    document.documentElement.dataset.motion = 'reduce';
    const change = vi.fn(), items = [{ id: 'a', label: '기록' }, { id: 'b', label: '원문' }];
    const view = render(<><Tabs items={items} value="a" onChange={change} /><textarea aria-label="원문" defaultValue={'  글\n예외'} /></>);
    const original = screen.getByRole('textbox');
    view.rerender(<><Tabs items={items} value="b" onChange={change} /><textarea aria-label="원문" defaultValue={'  글\n예외'} /></>);
    expect(screen.getByRole('tab', { name: '원문' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('textbox')).toBe(original);
    expect(original).toHaveValue('  글\n예외');
    fireEvent.keyDown(screen.getByRole('tab', { name: '원문' }), { key: 'ArrowLeft' });
    expect(change).toHaveBeenCalledWith('a'); expect(screen.getByRole('tab', { name: '기록' })).toHaveFocus();
  });
  it('renders readable empty content when motion is disabled, and the success mark stays decorative', async () => {
    document.documentElement.dataset.motion = 'reduce';
    const view = render(<><EmptyState title="아직 기록이 없습니다" /><SavedMark /></>);
    expect(screen.getByRole('heading')).toBeVisible();
    expect(view.container.querySelector('[data-motion-source="animate-ui"]')).toHaveAttribute('aria-hidden', 'true');
    await act(async () => { document.documentElement.dataset.motion = 'reduce'; });
    expect(screen.getByRole('heading')).toBeVisible();
  });
  it('does not flash a spinner for a fast operation or keep its timer after completion', () => {
    vi.useFakeTimers();
    const view = render(<Button busy>내용 저장</Button>);
    expect(view.container.querySelector('[data-motion-source="ldrs"]')).toBeEmptyDOMElement();
    act(() => { vi.advanceTimersByTime(119); });
    expect(view.container.querySelector('[data-motion-source="ldrs"]')).toBeEmptyDOMElement();
    view.rerender(<Button>내용 저장</Button>);
    act(() => { vi.advanceTimersByTime(1000); });
    expect(view.container.querySelector('[data-motion-source="ldrs"]')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '내용 저장' })).toBeEnabled();
  });
  it('pauses an offscreen player, retains manual pause across visibility and cleans its observer', () => {
    let notify: (entries: { isIntersecting: boolean }[]) => void = () => {};
    const disconnect = vi.fn();
    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback: typeof notify) { notify = callback; }
      observe() {} disconnect = disconnect;
    });
    function Player() {
      const state = usePlayerMotion();
      return <div ref={state.ref}><output aria-label="재생 상태">{String(state.playing)}</output><button type="button" onClick={() => state.setPaused(value => !value)}>일시정지</button></div>;
    }
    const view = render(<Player />);
    expect(screen.getByLabelText('재생 상태')).toHaveTextContent('false');
    act(() => notify([{ isIntersecting: true }]));
    expect(screen.getByLabelText('재생 상태')).toHaveTextContent('true');
    fireEvent.click(screen.getByRole('button', { name: '일시정지' }));
    act(() => notify([{ isIntersecting: false }]));
    act(() => notify([{ isIntersecting: true }]));
    expect(screen.getByLabelText('재생 상태')).toHaveTextContent('false');
    fireEvent.click(screen.getByRole('button', { name: '일시정지' }));
    expect(screen.getByLabelText('재생 상태')).toHaveTextContent('true');
    view.unmount();
    expect(disconnect).toHaveBeenCalledOnce();
  });

});
