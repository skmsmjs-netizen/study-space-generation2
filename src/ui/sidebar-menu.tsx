import { useLayoutEffect, useRef, useState } from 'react';
import { NavigationBar, type NavigationBarProps } from './navigation-bar';
import './sidebar-menu.css';

const GROUPS = ['공부', '자료', '탐구', '기록·계획', '공통 도구'];
export const SIDEBAR_GROUPS: Record<string, string> = {
  front: '공부', left: '자료', right: '탐구', back: '기록·계획', global: '공통 도구',
};

function readGroups(key: string): string[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(raw) ? raw.filter((group): group is string => typeof group === 'string' && GROUPS.includes(group)) : [];
  } catch { return []; }
}

/** Device-local display preference only; no learning data or server writes. */
export function useSidebarGroups(prefix: string) {
  const key = `${prefix}:sidebar-groups:v1`;
  const [state, setState] = useState(() => ({ key, collapsed: readGroups(key) }));
  const collapsed = state.key === key ? state.collapsed : readGroups(key);
  if (state.key !== key) setState({ key, collapsed });
  return {
    collapsedGroups: collapsed,
    onToggleGroup(group: string) {
      const next = collapsed.includes(group) ? collapsed.filter(item => item !== group) : [...collapsed, group];
      try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* Preferences stay usable in this session if storage fails. */ }
      setState({ key, collapsed: next });
    },
  };
}

/** Native disclosure keeps ordinary links, keyboard access and browser history. */
export function MobileSidebarMenu({ scrollKey, ...props }: Omit<NavigationBarProps, 'label' | 'orientation' | 'className'>) {
  const menu = useRef<HTMLDetailsElement>(null);
  useLayoutEffect(() => {
    const save = () => {
      if (!scrollKey || !menu.current?.open) return;
      const content = menu.current.querySelector<HTMLElement>('.mobile-sidebar-menu-content');
      if (content) try { sessionStorage.setItem(scrollKey, String(content.scrollTop)); } catch { /* Optional display context. */ }
    };
    window.addEventListener('pagehide', save);
    return () => window.removeEventListener('pagehide', save);
  }, [scrollKey]);
  return <details ref={menu} className="mobile-sidebar-menu" onToggle={event => {
    if (event.target !== event.currentTarget || !event.currentTarget.open || !scrollKey) return;
    const content = event.currentTarget.querySelector<HTMLElement>('.mobile-sidebar-menu-content');
    try {
      const saved = Number(sessionStorage.getItem(scrollKey));
      if (content && Number.isFinite(saved) && saved >= 0) content.scrollTop = saved;
    } catch { /* A failed optional read does not hide the menu. */ }
  }} onKeyDown={event => {
    if (event.key !== 'Escape' || event.nativeEvent.isComposing || !menu.current?.open) return;
    event.preventDefault();
    menu.current.open = false;
    menu.current.querySelector('summary')?.focus({ preventScroll: true });
  }}>
    <summary>전체 메뉴</summary>
    <div className="mobile-sidebar-menu-content" onScroll={event => {
      if (scrollKey) try { sessionStorage.setItem(scrollKey, String(event.currentTarget.scrollTop)); } catch { /* Keep the current position in this visit. */ }
    }}>
      <NavigationBar {...props} label="전체 메뉴" orientation="vertical" onNavigate={() => {
        if (menu.current) menu.current.open = false;
        requestAnimationFrame(() => document.getElementById('main')?.focus({ preventScroll: true }));
      }} />
    </div>
  </details>;
}
