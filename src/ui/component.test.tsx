import { useState } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button, Checkbox, Input, Modal, Search, ScreenBoundary, Tabs, Textarea, Toast } from './index';

afterEach(cleanup);

describe('shared controls', () => {
  it('keeps other navigation usable after a screen failure and recovers on another route', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const retry = vi.fn();
    function Broken(): null { throw Error('isolated screen chunk failure'); }
    const view = render(<><a href="#/subjects">과목으로 이동</a><ScreenBoundary key="failed" onRetry={retry}><Broken /></ScreenBoundary></>);
    expect(screen.getByRole('alert')).toHaveTextContent('이미 저장된 기록과 초안은 지우지 않습니다');
    expect(screen.getByRole('link', { name: '과목으로 이동' })).toBeVisible();
    await userEvent.setup().click(screen.getByRole('button', { name: '다시 시도' })); expect(retry).toHaveBeenCalledOnce();
    view.rerender(<><a href="#/subjects">과목으로 이동</a><ScreenBoundary key="subjects"><p>정상 화면</p></ScreenBoundary></>);
    expect(screen.getByText('정상 화면')).toBeVisible(); expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    consoleError.mockRestore();
  });
  it('busy buttons keep their action label and prevent pointer and keyboard execution', async () => {
    const click = vi.fn(), user = userEvent.setup();
    render(<Button busy onClick={click}>공부함 기록</Button>);
    const button = screen.getByRole('button', { name: '공부함 기록' });
    await user.click(button); await user.keyboard('{Enter} ');
    expect(button).toBeDisabled(); expect(button).toHaveAttribute('aria-busy', 'true'); expect(click).not.toHaveBeenCalled();
  });
  it('labels and errors point to the actual input while preserving whitespace', () => {
    render(<Textarea label="자기 설명" hint="글은 선택입니다." error="입력을 다시 확인해 주세요." defaultValue={'  나의 설명\n'} />);
    const input = screen.getByLabelText('자기 설명');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('글은 선택입니다. 입력을 다시 확인해 주세요.');
    expect((input as HTMLTextAreaElement).value).toBe('  나의 설명\n');
  });
  it('tabs skip disabled items and move both selection and focus', async () => {
    function Fixture() { const [value, setValue] = useState('a'); return <Tabs value={value} onChange={setValue} items={[{ id: 'a', label: '기록' }, { id: 'b', label: '준비 중', disabled: true }, { id: 'c', label: '원문' }]} />; }
    const user = userEvent.setup(); render(<Fixture />);
    screen.getByRole('tab', { name: '기록' }).focus(); await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: '원문' })).toHaveFocus(); expect(screen.getByRole('tab', { name: '원문' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{Home}'); expect(screen.getByRole('tab', { name: '기록' })).toHaveFocus();
  });
  it('mixed checkbox is announced as mixed without marking all children checked', () => {
    render(<Checkbox label="선택한 주제" indeterminate checked={false} readOnly />);
    const input = screen.getByRole('checkbox', { name: '선택한 주제' });
    expect(input).toBePartiallyChecked(); expect(input).not.toBeChecked();
  });
  it('search publishes a Korean composition only after it ends, once', () => {
    const query = vi.fn(); render(<Search label="주제 찾기" onQueryChange={query} />);
    const input = screen.getByRole('searchbox', { name: '주제 찾기' });
    fireEvent.compositionStart(input); fireEvent.change(input, { target: { value: 'ㅎ' } }); fireEvent.change(input, { target: { value: '학기' } });
    expect(query).not.toHaveBeenCalled(); fireEvent.compositionEnd(input, { data: '학기' });
    fireEvent.change(input, { target: { value: '학기' } });
    expect(query).toHaveBeenCalledExactlyOnceWith('학기');
  });
  it('toast undo remains available until explicitly dismissed', async () => {
    const undo = vi.fn(), user = userEvent.setup(); render(<Toast message="목차를 휴지통으로 옮겼습니다." onUndo={undo} />);
    expect(screen.getByRole('status')).toHaveTextContent('휴지통'); await user.click(screen.getByRole('button', { name: '되돌리기' })); expect(undo).toHaveBeenCalledOnce();
  });
});

describe('modal focus contract', () => {
  it('traps keyboard focus, closes on Escape, and restores the trigger', async () => {
    function Fixture() { const [open, setOpen] = useState(false); return <><Button onClick={() => setOpen(true)}>메모 열기</Button><Modal open={open} title="메모" onClose={() => setOpen(false)}><Input label="메모 내용" /><Button>저장</Button></Modal></>; }
    const user = userEvent.setup(); render(<Fixture />);
    const trigger = screen.getByRole('button', { name: '메모 열기' }); await user.click(trigger);
    expect(screen.getByRole('dialog', { name: '메모' })).toBeInTheDocument();
    const close = screen.getByRole('button', { name: '메모 닫기' }), save = screen.getByRole('button', { name: '저장' });
    expect(close).toHaveFocus(); await user.keyboard('{Shift>}{Tab}{/Shift}'); expect(save).toHaveFocus();
    await user.tab(); expect(close).toHaveFocus(); await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); expect(trigger).toHaveFocus();
  });
  it('does not intercept Escape during IME composition', () => {
    const close = vi.fn(); render(<Modal open title="기록" onClose={close}><Input label="기록 내용" /></Modal>);
    fireEvent.keyDown(document, { key: 'Escape', isComposing: true }); expect(close).not.toHaveBeenCalled();
  });
  it('closes on a completed backdrop click, while press and cancelled gestures preserve the editor', async () => {
    const close = vi.fn(), user = userEvent.setup();
    render(<Modal open title="기록" onClose={close}><Input label="기록 내용" defaultValue="원래 글" /></Modal>);
    const overlay = screen.getByRole('dialog').parentElement!;
    await user.pointer({ keys: '[MouseLeft>]', target: overlay });
    expect(close).not.toHaveBeenCalled();
    fireEvent.pointerCancel(overlay);
    await user.pointer({ keys: '[/MouseLeft]', target: overlay });
    expect(close).not.toHaveBeenCalled();
    expect(screen.getByLabelText('기록 내용')).toHaveValue('원래 글');
    await user.click(overlay);
    expect(close).toHaveBeenCalledOnce();
  });
  it('does not dismiss after a drag from dialog content or across the backdrop', async () => {
    const close = vi.fn(), user = userEvent.setup();
    render(<Modal open title="기록" onClose={close}><Input label="기록 내용" /></Modal>);
    const overlay = screen.getByRole('dialog').parentElement!;
    await user.pointer([{ keys: '[MouseLeft>]', target: screen.getByLabelText('기록 내용') }, { keys: '[/MouseLeft]', target: overlay }]);
    expect(close).not.toHaveBeenCalled();
    await user.pointer([{ keys: '[MouseLeft>]', target: overlay, coords: { x: 10, y: 10 } }, { target: overlay, coords: { x: 50, y: 50 } }, { keys: '[/MouseLeft]', target: overlay }]);
    expect(close).not.toHaveBeenCalled();
  });
  it('returns to a touch opener even when the browser does not focus it on activation', () => {
    function Fixture() { const [open, setOpen] = useState(false); return <><Button onClick={() => setOpen(true)}>터치로 열기</Button><Modal open={open} title="기록" onClose={() => setOpen(false)}><Input label="기록 내용" /></Modal></>; }
    render(<Fixture />);
    const trigger = screen.getByRole('button', { name: '터치로 열기' });
    fireEvent.pointerDown(trigger); fireEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeVisible();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(trigger).toHaveFocus();
  });
  it('returns focus to the trigger without scrolling the underlying page', async () => {
    function Fixture() { const [open, setOpen] = useState(false); return <><Button onClick={() => setOpen(true)}>기록 열기</Button><Modal open={open} title="기록" onClose={() => setOpen(false)}><Input label="기록 내용" /></Modal></>; }
    const user = userEvent.setup(); render(<Fixture />);
    const trigger = screen.getByRole('button', { name: '기록 열기' });
    const focus = vi.spyOn(trigger, 'focus');
    await user.click(trigger); focus.mockClear();
    await user.keyboard('{Escape}');
    expect(focus).toHaveBeenLastCalledWith({ preventScroll: true });
    expect(trigger).toHaveFocus(); focus.mockRestore();
  });
  it('isolates background interaction, excludes hidden and negative-tab targets, and restores previous inert state', async () => {
    const existing = document.createElement('aside'); existing.setAttribute('inert', ''); document.body.append(existing);
    function Fixture() { const [open, setOpen] = useState(false); return <><Button onClick={() => setOpen(true)}>열기</Button><Modal open={open} title="편집" onClose={() => setOpen(false)}><Button>마지막 조작</Button><Button tabIndex={-1}>프로그램 전용</Button><div style={{ display: 'none' }}><Button>숨긴 조작</Button></div><fieldset disabled><Input label="비활성 입력" /></fieldset></Modal></>; }
    const user = userEvent.setup(), view = render(<Fixture />);
    await user.click(screen.getByRole('button', { name: '열기' }));
    expect(view.container).toHaveAttribute('inert');
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(screen.getByRole('button', { name: '마지막 조작' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(view.container).not.toHaveAttribute('inert'); expect(existing).toHaveAttribute('inert');
    expect(screen.getByRole('button', { name: '열기' })).toHaveFocus();
    existing.remove();
  });
});
