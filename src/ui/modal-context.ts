import { useLayoutEffect, useRef, type RefObject } from 'react';

type Position = { fieldKey: string; start: number; end: number; direction: 'forward' | 'backward' | 'none'; fieldLeft: number; top: number; left: number };
export const modalEditingContextKey = (draftKey: string) => `${draftKey}:modal-position:v1`;

function readPosition(key: string): Position | null {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(key) || 'null');
    if (!value || typeof value !== 'object') return null;
    const p = value as Position;
    return typeof p.fieldKey === 'string' && p.fieldKey.length > 0 &&
      [p.start, p.end, p.fieldLeft, p.top, p.left].every(n => Number.isFinite(n) && n >= 0) &&
      p.start <= p.end && ['forward', 'backward', 'none'].includes(p.direction) ? p : null;
  } catch { return null; }
}

/** Optional per-tab view hints: only IDs and positions, never draft text. */
export function useModalEditingContext(open: boolean, draftKey: string, anchor: RefObject<HTMLElement | null>, fields: RefObject<Map<string, HTMLInputElement>>) {
  const memory = useRef<{ key: string; position: Position | null } | null>(null);
  useLayoutEffect(() => {
    if (!open) return;
    const dialog = anchor.current?.closest<HTMLElement>('[role="dialog"]');
    if (!dialog) return;
    const key = modalEditingContextKey(draftKey);
    if (memory.current?.key !== key) memory.current = { key, position: readPosition(key) };
    let position = memory.current.position;
    let restoring = true;
    const write = () => {
      memory.current = { key, position };
      if (position) try { sessionStorage.setItem(key, JSON.stringify(position)); } catch { /* Input persistence is independent; retain hints in this mounted editor. */ }
    };
    const capture = (event?: Event) => {
      // React may remove portal children before this owner's layout cleanup.
      // A detached dialog reports zero scroll in browsers; that is not a new
      // user position and must never overwrite the last connected snapshot.
      if (restoring || !dialog.isConnected) return;
      const target = event?.target instanceof HTMLInputElement ? event.target : document.activeElement;
      if (target instanceof HTMLInputElement && dialog.contains(target) && target.dataset.tableCell && !target.disabled && target.selectionStart !== null && target.selectionEnd !== null) {
        position = { fieldKey: target.dataset.tableCell, start: target.selectionStart, end: target.selectionEnd, direction: target.selectionDirection || 'none', fieldLeft: target.scrollLeft, top: dialog.scrollTop, left: dialog.scrollLeft };
      } else if (position) position = { ...position, top: dialog.scrollTop, left: dialog.scrollLeft };
      write();
    };
    const events = ['focusin', 'focusout', 'select', 'keyup', 'pointerup', 'input', 'scroll'];
    events.forEach(name => { dialog.addEventListener(name, capture, true); });
    const userStarted = (event: Event) => { if (restoring) { restoring = false; capture(event); } };
    dialog.addEventListener('pointerdown', userStarted, true);
    dialog.addEventListener('keydown', userStarted, true);
    window.addEventListener('pagehide', capture);
    // Modal first establishes its focus trap in a passive effect. Restore once after
    // that, without scrolling the focused field into a different viewport position.
    const frame = requestAnimationFrame(() => {
      if (!restoring) return;
      const field = position && fields.current.get(position.fieldKey);
      if (field && !field.disabled && field.isConnected && dialog.contains(field)) {
        field.focus({ preventScroll: true });
        field.setSelectionRange(Math.min(position!.start, field.value.length), Math.min(position!.end, field.value.length), position!.direction);
        field.scrollLeft = position!.fieldLeft;
        dialog.scrollTop = position!.top; dialog.scrollLeft = position!.left;
      } else {
        // A removed cell or a new draft must not inherit a different field's position.
        position = null;
        // A quick reopen may reuse the exiting dialog DOM. An invalid hint
        // must clear that DOM's old position as well as the stored hint.
        dialog.scrollTop = 0; dialog.scrollLeft = 0;
        memory.current = { key, position: null };
        try { sessionStorage.removeItem(key); } catch { /* Invalid hint is ignored in memory. */ }
      }
      restoring = false;
    });
    return () => {
      cancelAnimationFrame(frame);
      capture();
      events.forEach(name => { dialog.removeEventListener(name, capture, true); });
      dialog.removeEventListener('pointerdown', userStarted, true);
      dialog.removeEventListener('keydown', userStarted, true);
      window.removeEventListener('pagehide', capture);
    };
  }, [open, draftKey, anchor, fields]);
}
