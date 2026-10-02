import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './context-menu.css';

export type ContextMenuItem = { id: string; label: string; onSelect: () => void; disabled?: boolean; danger?: boolean };
export type ContextMenuProps = { targetLabel: string; label?: string; items: ContextMenuItem[]; disabled?: boolean };

/** Commands are supplied by the owning screen; destructive commands still request its confirmation. */
export function ContextMenu({ targetLabel, label = '목차 관리', items, disabled = false }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null), menu = useRef<HTMLDivElement>(null);
  const initialFocus = useRef<'first' | 'last'>('first');
  const close = useCallback((restore = true) => {
    setOpen(false);
    if (restore && trigger.current?.isConnected) trigger.current.focus({ preventScroll: true });
  }, []);
  const enabled = useCallback(() => [...(menu.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') || [])], []);

  useLayoutEffect(() => {
    if (!open || !menu.current || !trigger.current) return;
    const position = () => {
      if (!menu.current || !trigger.current) return;
      const anchor = trigger.current.getBoundingClientRect(), panel = menu.current.getBoundingClientRect();
      const margin = 8, width = window.innerWidth, height = window.innerHeight;
      menu.current.style.left = `${Math.max(margin, Math.min(anchor.right - panel.width, width - panel.width - margin))}px`;
      const below = anchor.bottom + margin;
      menu.current.style.top = `${Math.max(margin, Math.min(below + panel.height <= height - margin ? below : anchor.top - panel.height - margin, height - panel.height - margin))}px`;
    };
    position();
    const buttons = enabled();
    (initialFocus.current === 'last' ? buttons.at(-1) : buttons[0])?.focus({ preventScroll: true });
    if (!buttons.length) menu.current.focus({ preventScroll: true });
    window.addEventListener('resize', position);
    window.addEventListener('scroll', position, true);
    return () => { window.removeEventListener('resize', position); window.removeEventListener('scroll', position, true); };
  }, [open, enabled]);

  useEffect(() => {
    if (!open) return;
    const outside = (target: EventTarget | null) => target instanceof Node && !menu.current?.contains(target) && !trigger.current?.contains(target);
    const pointer = (event: PointerEvent) => { if (outside(event.target)) close(); };
    const focus = (event: FocusEvent) => { if (outside(event.target)) close(false); };
    document.addEventListener('pointerdown', pointer);
    document.addEventListener('focusin', focus);
    return () => { document.removeEventListener('pointerdown', pointer); document.removeEventListener('focusin', focus); };
  }, [open, close]);

  return <>
    <button ref={trigger} type="button" className="ui-button ui-button--secondary" disabled={disabled}
      aria-label={`${targetLabel}: ${label}`} aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id : undefined}
      onClick={() => { if (open) close(); else { initialFocus.current = 'first'; setOpen(true); } }}
      onKeyDown={event => {
        if (event.nativeEvent.isComposing || !['ArrowDown', 'ArrowUp'].includes(event.key)) return;
        event.preventDefault(); initialFocus.current = event.key === 'ArrowUp' ? 'last' : 'first'; setOpen(true);
      }}>{label}</button>
    {open && createPortal(<div id={id} ref={menu} role="menu" aria-label={`${targetLabel}: ${label}`} tabIndex={-1} className="ui-context-menu"
      onKeyDown={event => {
        if (event.nativeEvent.isComposing) return;
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return; }
        if (event.key === 'Tab') { close(); return; }
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const buttons = enabled();
        if (!buttons.length) return;
        const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
        buttons[next].focus();
      }}>
      <p className="ui-context-menu-target">{targetLabel}</p>
      {items.map(item => <button key={item.id} type="button" role="menuitem" tabIndex={-1} disabled={item.disabled}
        className={`ui-context-menu-item${item.danger ? ' ui-context-menu-item--danger' : ''}`}
        onClick={() => { close(); item.onSelect(); }}>{item.label}</button>)}
    </div>, document.body)}
  </>;
}
