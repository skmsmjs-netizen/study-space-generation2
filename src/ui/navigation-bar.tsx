import { useId, useLayoutEffect, useRef } from 'react';
import { SelectionBackground, useSelectionMotionId } from './motion';
import './navigation-bar.css';

export type NavigationItem = { href: string; label: string; active?: boolean; group?: string };
export type NavigationBarProps = {
  label: string;
  items: NavigationItem[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  collapsedGroups?: string[];
  onToggleGroup?: (group: string) => void;
  scrollKey?: string;
  onNavigate?: () => void;
};

/** Route links retain native Tab, modifier-click and browser history behavior. */
export function NavigationBar({ label, items, orientation = 'horizontal', className = '', collapsedGroups = [], onToggleGroup, scrollKey, onNavigate }: NavigationBarProps) {
  const motionId = useSelectionMotionId();
  const groupId = useId();
  const navigation = useRef<HTMLElement>(null);
  const bottomNavigation = className.split(/\s+/).includes('bottom-nav');
  const activeHref = items.find(item => item.active)?.href;
  useLayoutEffect(() => {
    const nav = navigation.current;
    if (!nav || !scrollKey) return;
    const scroller = nav.closest<HTMLElement>('.sidebar') ?? nav;
    try {
      const saved = Number(sessionStorage.getItem(scrollKey));
      if (Number.isFinite(saved) && saved >= 0) scroller.scrollTop = saved;
    } catch { /* Optional menu position never blocks navigation. */ }
    const save = () => {
      try { sessionStorage.setItem(scrollKey, String(scroller.scrollTop)); } catch { /* Keep this visit usable. */ }
    };
    scroller.addEventListener('scroll', save, { passive: true });
    window.addEventListener('pagehide', save);
    return () => { scroller.removeEventListener('scroll', save); window.removeEventListener('pagehide', save); };
  }, [scrollKey]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: Route changes update aria-current before measuring and revealing the selected link.
  useLayoutEffect(() => {
    const nav = navigation.current;
    if (!nav || !bottomNavigation) return;
    const root = document.documentElement;
    const previousInset = root.style.getPropertyValue('--bottom-navigation-inset');
    let focusFrame = 0;
    let pointerDown = false;
    const startPointer = () => { pointerDown = true; };
    const endPointer = () => { pointerDown = false; };
    // Scroll this strip only. scrollIntoView would also move the reading page.
    const revealLink = (link: HTMLElement | null) => {
      if (!link || !nav.getBoundingClientRect().height) return;
      const bounds = nav.getBoundingClientRect();
      const box = link.getBoundingClientRect();
      const css = getComputedStyle(nav);
      const left = bounds.left + parseFloat(css.paddingLeft || '0');
      const right = bounds.right - parseFloat(css.paddingRight || '0');
      if (box.left < left) nav.scrollLeft += box.left - left;
      else if (box.right > right) nav.scrollLeft += box.right - right;
    };
    const measure = () => {
      root.style.setProperty('--bottom-navigation-inset', `${nav.getBoundingClientRect().height}px`);
      revealLink(nav.querySelector<HTMLElement>('[aria-current="page"]'));
    };
    const revealFocus = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (nav.contains(target)) { revealLink(target.closest('a')); return; }
      // A pointer has already reached this control. Moving it between down/up
      // would cancel the click (notably the fixed record-save bar on touch).
      if (pointerDown) return;
      // Dialogs own their scrolling and focus; never move the page behind one.
      if (target.closest('[role="dialog"], .ui-overlay')) return;
      cancelAnimationFrame(focusFrame);
      focusFrame = requestAnimationFrame(() => {
        if (document.activeElement !== target) return;
        const overlay = nav.getBoundingClientRect();
        const box = target.getBoundingClientRect();
        if (!overlay.height || box.top >= window.innerHeight || box.bottom <= overlay.top) return;
        const gap = parseFloat(getComputedStyle(nav).paddingTop || '0');
        window.scrollBy({ top: box.bottom - overlay.top + gap, behavior: 'instant' });
      });
    };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(nav);
    window.addEventListener('resize', measure);
    document.addEventListener('pointerdown', startPointer, true);
    document.addEventListener('pointerup', endPointer, true);
    document.addEventListener('pointercancel', endPointer, true);
    document.addEventListener('focusin', revealFocus);
    return () => {
      cancelAnimationFrame(focusFrame);
      observer?.disconnect();
      window.removeEventListener('resize', measure);
      document.removeEventListener('pointerdown', startPointer, true);
      document.removeEventListener('pointerup', endPointer, true);
      document.removeEventListener('pointercancel', endPointer, true);
      document.removeEventListener('focusin', revealFocus);
      if (previousInset) root.style.setProperty('--bottom-navigation-inset', previousInset);
      else root.style.removeProperty('--bottom-navigation-inset');
    };
  }, [bottomNavigation, activeHref]);
  const link = (item: NavigationItem) => <a key={item.href} href={item.href} onClick={event => {
    if (!event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) onNavigate?.();
  }}
    data-navigation-focus={`navigation-item:${JSON.stringify([item.href, item.label])}`}
    aria-current={item.active ? 'page' : undefined}>{item.active && <SelectionBackground id={motionId} />}{item.label}</a>;
  const groups = [...new Set(items.map(item => item.group))];
  return <nav ref={navigation} aria-label={label} className={`ui-navigation-bar ui-navigation-bar--${orientation} ${className}`}>
    {groups.some(Boolean) ? groups.map((group, index) => {
      const collapsed = Boolean(group && collapsedGroups.includes(group));
      const id = `${groupId}-group-${index}`;
      const current = items.some(item => item.group === group && item.active);
      return <section key={group ?? 'ungrouped'} className="ui-navigation-group" aria-label={group} data-current-group={current || undefined}>
        {group && (onToggleGroup ? <button type="button" className="ui-navigation-group-label ui-navigation-group-toggle"
          aria-expanded={!collapsed} aria-controls={id} onClick={() => onToggleGroup(group)}>
          <span>{group}</span><span aria-hidden="true">{collapsed ? '+' : '−'}</span>
        </button> : <p className="ui-navigation-group-label">{group}</p>)}
        <div id={id} className="ui-navigation-group-items" hidden={collapsed}>
          {items.filter(item => item.group === group).map(link)}
        </div>
      </section>;
    }) : items.map(link)}
  </nav>;
}
