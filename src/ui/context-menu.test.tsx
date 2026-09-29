import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContextMenu } from './context-menu';
import { Modal } from './index';

const items = () => [
  { id: 'add', label: '하위 항목 추가', onSelect: vi.fn() },
  { id: 'disabled', label: '사용할 수 없음', disabled: true, onSelect: vi.fn() },
  { id: 'rename', label: '이름 수정', onSelect: vi.fn() },
  { id: 'trash', label: '휴지통으로 이동', danger: true, onSelect: vi.fn() },
];
describe('ContextMenu', () => {
  it('identifies the exact target and supports arrow/Home/End, disabled skip and Escape focus return', async () => {
    const user = userEvent.setup();
    render(<ContextMenu targetLabel="1장: 같은 이름 주제" items={items()} />);
    const trigger = screen.getByRole('button', { name: '1장: 같은 이름 주제: 목차 관리' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.tab(); await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menu', { name: '1장: 같은 이름 주제: 목차 관리' })).toBeVisible();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitem', { name: '하위 항목 추가' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: '이름 수정' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('menuitem', { name: '휴지통으로 이동' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: '하위 항목 추가' })).toHaveFocus();
    await user.keyboard('{ArrowUp}{Home}');
    expect(screen.getByRole('menuitem', { name: '하위 항목 추가' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument(); expect(trigger).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: '휴지통으로 이동' })).toHaveFocus();
  });

  it('closes on command choice and calls only the selected enabled command once', async () => {
    const user = userEvent.setup(), actions = items();
    render(<ContextMenu targetLabel="주제" items={actions} />);
    const trigger = screen.getByRole('button');
    await user.click(trigger);
    await user.click(screen.getByRole('menuitem', { name: '사용할 수 없음' }));
    expect(actions[1].onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeVisible();
    await user.click(screen.getByRole('menuitem', { name: '이름 수정' }));
    expect(actions[2].onSelect).toHaveBeenCalledOnce();
    expect(actions[0].onSelect).not.toHaveBeenCalled();
    expect(actions[3].onSelect).not.toHaveBeenCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument(); expect(trigger).toHaveFocus();
  });

  it('dismisses on outside pointer and preserves the outside field focus', async () => {
    const user = userEvent.setup();
    render(<><ContextMenu targetLabel="주제" items={items()} /><input aria-label="본문" /></>);
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('textbox'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveFocus();
    await user.type(screen.getByRole('textbox'), '원문');
    expect(screen.getByRole('textbox')).toHaveValue('원문');
  });

  it('Tab exits to the next field and Shift+Tab returns to the preceding control', async () => {
    const user = userEvent.setup();
    render(<><input aria-label="이전" /><ContextMenu targetLabel="주제" items={items()} /><input aria-label="다음" /></>);
    await user.click(screen.getByRole('button')); await user.tab();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '다음' })).toHaveFocus();
    await user.click(screen.getByRole('button')); await user.tab({ shift: true });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '이전' })).toHaveFocus();
  });

  it('keeps composition Escape inside the menu, and all-disabled menus remain dismissible', async () => {
    const user = userEvent.setup();
    render(<ContextMenu targetLabel="주제" items={items().map(item => ({ ...item, disabled: true }))} />);
    const trigger = screen.getByRole('button');
    await user.click(trigger);
    const menu = screen.getByRole('menu');
    expect(menu).toHaveFocus();
    fireEvent.keyDown(menu, { key: 'Escape', isComposing: true });
    expect(menu).toBeInTheDocument();
    await user.keyboard('{Home}{End}{ArrowDown}{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument(); expect(trigger).toHaveFocus();
  });

  it('keeps the existing destructive confirmation and its trigger focus return', async () => {
    const user = userEvent.setup(), remove = vi.fn();
    function Harness() {
      const [confirm, setConfirm] = useState(false);
      return <><ContextMenu targetLabel="삭제 대상" items={[{ id: 'trash', label: '휴지통으로 이동', danger: true, onSelect: () => setConfirm(true) }]} />
        <Modal open={confirm} title="휴지통 이동 확인" onClose={() => setConfirm(false)}><button onClick={remove}>이동 확인</button></Modal></>;
    }
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: '삭제 대상: 목차 관리' });
    await user.click(trigger);
    expect(screen.getByRole('menuitem')).toHaveClass('ui-context-menu-item--danger');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('dialog', { name: '휴지통 이동 확인' })).toBeVisible();
    expect(remove).not.toHaveBeenCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
  });
});
