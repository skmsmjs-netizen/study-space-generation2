import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { NavigationBar } from './navigation-bar';

describe('NavigationBar', () => {
  it('names each navigation area and updates the current page without replacing native links', async () => {
    const user = userEvent.setup();
    const items = [{ href: '#/', label: '홈', active: true }, { href: '#/subjects', label: '과목과 아주 긴 한글 목차 이름' }];
    const view = render(<NavigationBar label="주 메뉴" orientation="vertical" items={items} />);
    const nav = screen.getByRole('navigation', { name: '주 메뉴' });
    const links = within(nav).getAllByRole('link');
    expect(links[0]).toHaveAttribute('aria-current', 'page');
    expect(links[1]).not.toHaveAttribute('aria-current');
    expect(links[1]).toHaveAttribute('href', '#/subjects');
    await user.tab(); expect(links[0]).toHaveFocus();
    await user.tab(); expect(links[1]).toHaveFocus();
    view.rerender(<NavigationBar label="빠른 이동" className="bottom-nav" items={items.map(item => ({ ...item, active: item.href === '#/subjects' }))} />);
    expect(screen.getByRole('navigation', { name: '빠른 이동' })).toHaveClass('bottom-nav');
    expect(screen.getByRole('link', { name: '홈' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: items[1].label })).toHaveAttribute('aria-current', 'page');
  });
});
