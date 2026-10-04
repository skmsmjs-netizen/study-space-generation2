import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// Navigation hints only. Never place study text, drafts, credentials or server state here.
export const NAVIGATION_CONTEXT_KEY = 'study-space:demo:navigation-context:v1';
const BEFORE_NAVIGATE = 'study-space:before-navigate';
type FocusTarget = { kind: 'key' | 'id' | 'href' | 'editor'; value: string };
type Position = { x: number; y: number; focus?: FocusTarget; anchor?: { value: string; offset: number } };
type NavigationContext = { version: 1; route: string; positions: Record<string, Position> };

/** Coalesce view hints only; lifecycle boundaries flush before animation frames can stop. */
function frameTask(run: () => void) {
  let frame: number | undefined;
  const cancel = () => { if (frame !== undefined) window.cancelAnimationFrame(frame); frame = undefined; };
  return {
    schedule() { if (frame === undefined) frame = window.requestAnimationFrame(() => { frame = undefined; run(); }); },
    flush() { if (frame === undefined) return; cancel(); run(); },
    cancel,
  };
}

function validRoute(value: unknown): value is string {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: Reject control characters before a route is decoded or stored.
  if (typeof value !== 'string' || value.length > 4096 || !value.startsWith('/') ||
    value.startsWith('//') || [...value].some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) return false;
  // JSON permits lone surrogate code units; reject them before restart URL encoding.
  try { encodeURI(value); return true; } catch { return false; }
}

/** Malformed or unsupported hash input cannot crash the entire recording screen. */
export function readRouteHash(hash = window.location.hash): string {
  try {
    const decoded = decodeURIComponent(hash.replace(/^#/, '') || '/');
    return validRoute(decoded) ? decoded : '/';
  } catch { return '/'; }
}

function readContext(key = NAVIGATION_CONTEXT_KEY): NavigationContext {
  const fallback: NavigationContext = { version: 1, route: '/', positions: {} };
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(key) ||
      (key.startsWith('study-space:personal:') ? localStorage.getItem(key) : null) || 'null');
    if (!value || typeof value !== 'object') return fallback;
    const raw = value as Partial<NavigationContext>;
    if (raw.version !== 1 || !validRoute(raw.route) || !raw.positions || typeof raw.positions !== 'object') return fallback;
    const positions: Record<string, Position> = {};
    for (const [route, candidate] of Object.entries(raw.positions).slice(-100)) {
      if (!validRoute(route) || !candidate || typeof candidate !== 'object' ||
        !Number.isFinite(candidate.x) || !Number.isFinite(candidate.y) || candidate.x < 0 || candidate.y < 0) continue;
      const focus = candidate.focus;
      positions[route] = { x: candidate.x, y: candidate.y,
        ...(candidate.anchor && typeof candidate.anchor.value === 'string' && candidate.anchor.value.length < 4096 && Number.isFinite(candidate.anchor.offset) ? { anchor: candidate.anchor } : {}),
        ...(focus && ['key', 'id', 'href', 'editor'].includes(focus.kind) &&
          typeof focus.value === 'string' && focus.value.length <= 4096 ? { focus } : {}) };
    }
    return { version: 1, route: raw.route, positions };
  } catch { return fallback; }
}

function writeContext(context: NavigationContext, key = NAVIGATION_CONTEXT_KEY) {
  const serialized = JSON.stringify(context);
  try { sessionStorage.setItem(key, serialized); }
  catch { /* History and in-memory restoration stay usable when storage is unavailable. */ }
  if (key.startsWith('study-space:personal:')) {
    try { localStorage.setItem(key, serialized); } catch { /* View hints never block input. */ }
  }
}

function identifyFocus(element: Element | null): FocusTarget | undefined {
  if (!(element instanceof HTMLElement) || element === document.body) return undefined;
  if (element.dataset.editingContext) return { kind: 'editor', value: element.dataset.editingContext };
  const key = element.dataset.navigationFocus;
  if (key) return { kind: 'key', value: key };
  if (element.id) return { kind: 'id', value: element.id };
  const href = element instanceof HTMLAnchorElement && element.getAttribute('href');
  if (href) return { kind: 'href', value: href };
  return undefined;
}

function measurePosition(): Position {
  const anchor = Array.from(document.querySelectorAll<HTMLElement>('main [data-reading-anchor]'))
    .find(element => isDisplayed(element) && element.getBoundingClientRect().bottom > 0 && element.getBoundingClientRect().top < window.innerHeight);
  return { x: Math.max(0, window.scrollX), y: Math.max(0, window.scrollY), focus: identifyFocus(document.activeElement),
    ...(anchor ? { anchor: { value: anchor.dataset.readingAnchor!, offset: anchor.getBoundingClientRect().top } } : {}) };
}

function findFocus(target: FocusTarget): HTMLElement | undefined {
  // Compare attributes as values, rather than injecting original IDs into a selector.
  const attr = target.kind === 'key' ? 'data-navigation-focus' : target.kind === 'id' ? 'id' : target.kind === 'editor' ? 'data-editing-context' : 'href';
  return Array.from(document.querySelectorAll<HTMLElement>(`[${attr}]`))
    .find(element => element.getAttribute(attr) === target.value &&
      !element.closest('[hidden], [inert]') && !element.matches(':disabled') && isDisplayed(element));
}

function isDisplayed(element: HTMLElement): boolean {
  const visibility = getComputedStyle(element).visibility;
  if (visibility === 'hidden' || visibility === 'collapse') return false;
  // Wide and narrow navigation share an identity; restore only the displayed copy.
  for (let ancestor: HTMLElement | null = element; ancestor; ancestor = ancestor.parentElement) {
    if (getComputedStyle(ancestor).display === 'none') return false;
  }
  return true;
}

function editingOrDialogOwnsFocus(): boolean {
  const element = document.activeElement;
  return element instanceof HTMLElement && element.isConnected &&
    (element.matches('input, textarea, select, [contenteditable="true"], [contenteditable=""]') ||
      Boolean(element.closest('[role="dialog"], dialog[open]')));
}

function restoreFocus(element: HTMLElement) {
  element.focus({ preventScroll: true });
  const navigation = element.closest<HTMLElement>('.ui-navigation-bar');
  if (!navigation || navigation.scrollWidth <= navigation.clientWidth) return;
  const item = element.getBoundingClientRect(), area = navigation.getBoundingClientRect();
  // Reveal a returned menu item inside its own horizontal strip only. Native
  // scrollIntoView would also move the restored reading position of the page.
  if (item.left < area.left) navigation.scrollLeft += item.left - area.left;
  else if (item.right > area.right) navigation.scrollLeft += item.right - area.right;
}

/** Use this for imperative navigation so the departing page is captured before the hash changes. */
export function navigate(path: string) {
  if (!validRoute(path) || path === readRouteHash()) return;
  let hash: string;
  try { hash = encodeURI(path); } catch { return; }
  window.dispatchEvent(new Event(BEFORE_NAVIGATE));
  window.location.hash = hash;
}

/**
 * Hash routes with per-route window scroll and focus restoration.
 * Give ambiguous controls `data-navigation-focus="stable-entity-id:action"`.
 * Existing unique IDs and anchor hrefs work without extra markup. A saved control
 * that no longer exists falls back to a route heading. Live input/dialog focus wins.
 * Session hints are tab-local and are not account data or a substitute for drafts.
 */
export function useRoute(prefix = 'study-space:demo'): string {
  const navigationKey = `${prefix}:navigation-context:v1`;
  useEditingContext(`${prefix}:editing-context:v1`);
  const [initial] = useState(() => readContext(navigationKey));
  const [route, setRoute] = useState(() => window.location.hash ? readRouteHash() : initial.route);
  const context = useRef(initial);
  const current = useRef(route);
  const departed = useRef(false);
  const hasNavigated = useRef(false);
  const restorationPending = useRef(false);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    // The route cache owns scroll while mounted; otherwise native traversal may
    // apply an older history-entry offset after our route restoration has run.
    window.history.scrollRestoration = 'manual';
    if (!window.location.hash && current.current !== '/') {
      // Preserve every other owner's history state and the current pathname/query.
      window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}#${encodeURI(current.current)}`);
    }
    const capturePosition = (hint?: Position) => {
      // A loading fallback can clamp scroll before the saved page is mounted.
      if (restorationPending.current || departed.current) return;
      const position: Position = hint || measurePosition();
      context.current.positions[current.current] = position;
      const entries = Object.entries(context.current.positions);
      if (entries.length > 100) context.current.positions = Object.fromEntries(entries.slice(-100));
      context.current.route = current.current;
      writeContext(context.current, navigationKey);
    };
    const pendingCapture = frameTask(() => capturePosition());
    const capture = () => {
      // Input/select/scroll bursts need only their latest reading position. Do not
      // scan anchors or serialize the route map inside every input event.
      if (document.visibilityState === 'hidden') flush();
      else pendingCapture.schedule();
    };
    const flush = () => { pendingCapture.cancel(); capturePosition(); };
    const hidden = () => { if (document.visibilityState === 'hidden') flush(); };
    let pointerDeparture: { route: string; anchor: HTMLAnchorElement; position: Position } | null = null;
    const pointer = (event: PointerEvent) => {
      pointerDeparture = null;
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (anchor instanceof HTMLAnchorElement) pointerDeparture = {
        route: current.current, anchor,
        position: { ...measurePosition(), focus: identifyFocus(anchor) },
      };
    };
    const cancelPointer = () => { pointerDeparture = null; };
    const beforeNavigate = () => { flush(); departed.current = true; };
    const update = () => {
      const next = readRouteHash();
      if (next === current.current) return;
      if (!departed.current) flush();
      else pendingCapture.cancel();
      departed.current = false;
      hasNavigated.current = true;
      current.current = next;
      context.current.route = next;
      writeContext(context.current, navigationKey);
      setRoute(next);
    };
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute('download') ||
        (anchor.target && anchor.target !== '_self')) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin === window.location.origin && url.pathname === window.location.pathname &&
        url.search === window.location.search && url.hash && readRouteHash(url.hash) !== current.current) {
        // Pointer focus can scroll a narrow navigation strip into view before
        // click. Save the reading position from press, but commit only on click.
        const hint = event.detail > 0 && pointerDeparture?.route === current.current && pointerDeparture.anchor === anchor
          ? pointerDeparture.position : undefined;
        pendingCapture.cancel(); capturePosition(hint); departed.current = true;
      }
      pointerDeparture = null;
    };
    window.addEventListener(BEFORE_NAVIGATE, beforeNavigate);
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    window.addEventListener('pagehide', flush);
    window.addEventListener('blur', flush);
    document.addEventListener('visibilitychange', hidden);
    document.addEventListener('input', capture, true);
    document.addEventListener('scroll', capture, true);
    document.addEventListener('focusout', flush, true);
    document.addEventListener('click', click);
    document.addEventListener('pointerdown', pointer, true);
    document.addEventListener('pointercancel', cancelPointer, true);
    return () => {
      flush();
      window.removeEventListener(BEFORE_NAVIGATE, beforeNavigate);
      window.removeEventListener('hashchange', update);
      window.removeEventListener('popstate', update);
      window.removeEventListener('pagehide', flush);
      window.removeEventListener('blur', flush);
      document.removeEventListener('visibilitychange', hidden);
      document.removeEventListener('input', capture, true);
      document.removeEventListener('scroll', capture, true);
      document.removeEventListener('focusout', flush, true);
      document.removeEventListener('click', click);
      document.removeEventListener('pointerdown', pointer, true);
      document.removeEventListener('pointercancel', cancelPointer, true);
      if (window.history.scrollRestoration === 'manual') window.history.scrollRestoration = previousScrollRestoration;
    };
    // One listener owns the lifetime of this workspace; mutable route lives in current.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigationKey]);

  useLayoutEffect(() => {
    const position = context.current.positions[route];
    let stopped = false;
    const restore = () => {
      if (stopped || current.current !== route) return;
      if (editingOrDialogOwnsFocus()) { restorationPending.current = false; return; }
      if (document.querySelector('main [data-ui-loading]')) { restorationPending.current = true; return; }
      restorationPending.current = false;
      const target = position?.focus && findFocus(position.focus);
      const heading = !target && hasNavigated.current
        ? document.querySelector<HTMLElement>('[data-route-heading], main h1, main h2') : null;
      if (target) restoreFocus(target);
      else if (heading) {
        if (!heading.hasAttribute('tabindex')) heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
      const readingAnchor = position?.anchor && Array.from(document.querySelectorAll<HTMLElement>('main [data-reading-anchor]')).find(element => element.dataset.readingAnchor === position.anchor!.value && isDisplayed(element));
      const x = position?.x ?? 0, y = readingAnchor && position?.anchor ? Math.max(0, window.scrollY + readingAnchor.getBoundingClientRect().top - position.anchor.offset) : position?.y ?? 0;
      if (window.scrollX !== x || window.scrollY !== y) window.scrollTo({ left: x, top: y, behavior: 'instant' });
      stopped = true;
    };
    restore();
    if (!restorationPending.current) return;
    // Observe only while a route is loading. Never refocus on normal data updates.
    const observer = new MutationObserver(() => {
      // A cancelled link/history gesture may never leave this route. Release
      // capture suppression when it finishes loading without restoring focus.
      if (stopped && !document.querySelector('main [data-ui-loading]')) restorationPending.current = false;
      else if (!stopped) restore();
      if (!restorationPending.current) observer.disconnect();
    });
    observer.observe(document.querySelector('main') || document.body, { childList: true, subtree: true });
    const interact = (event: Event) => {
      stopped = true;
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
      const historyKey = event instanceof KeyboardEvent && (event.altKey || event.metaKey || event.ctrlKey);
      // Departing during loading must retain the earlier page position, not its fallback.
      if (!anchor && !historyKey) { restorationPending.current = false; observer.disconnect(); }
    };
    const events = ['pointerdown', 'keydown', 'wheel', 'touchmove'];
    events.forEach(name => { document.addEventListener(name, interact, { capture: true, passive: true }); });
    return () => {
      stopped = true; observer.disconnect();
      events.forEach(name => { document.removeEventListener(name, interact, true); });
    };
  }, [route]);
  return route;
}

// Cursor/scroll hints contain no written content. Stable keys belong to an entity and field.
export const EDITING_CONTEXT_KEY = 'study-space:demo:editing-context:v1';
type EditingPosition = { start: number; end: number; direction: 'forward' | 'backward' | 'none'; top: number; left: number };
function useEditingContext(storageKey = EDITING_CONTEXT_KEY) {
  useLayoutEffect(() => {
    let positions: Record<string, EditingPosition> = {};
    try {
      const raw: unknown = JSON.parse(sessionStorage.getItem(storageKey) ||
        (storageKey.startsWith('study-space:personal:') ? localStorage.getItem(storageKey) : null) || '{}');
      if (raw && typeof raw === 'object') for (const [key, value] of Object.entries(raw).slice(-200)) {
        if (!value || typeof value !== 'object') continue;
        const p = value as EditingPosition;
        if ([p.start, p.end, p.top, p.left].every(n => Number.isFinite(n) && n >= 0) && ['forward', 'backward', 'none'].includes(p.direction)) positions[key] = p;
      }
    } catch { /* Invalid view hints never block original text. */ }
    const restored = new WeakSet<Element>();
    const field = (target: EventTarget | null) => (target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement) && target.dataset.editingContext ? target : null;
    const persist = () => {
      const entries = Object.entries(positions);
      if (entries.length > 200) positions = Object.fromEntries(entries.slice(-200));
      const serialized = JSON.stringify(positions);
      try { sessionStorage.setItem(storageKey, serialized); } catch { /* In-tab hints remain available. */ }
      if (storageKey.startsWith('study-space:personal:')) {
        try { localStorage.setItem(storageKey, serialized); } catch { /* No written content is stored here. */ }
      }
    };
    const pendingWrite = frameTask(persist);
    const save = (element: HTMLTextAreaElement | HTMLInputElement) => {
      const key = element.dataset.editingContext;
      if (!key || element.selectionStart === null || element.selectionEnd === null) return;
      // Read scalars now, before blur/unmount or IME updates can replace this
      // field. Only the JSON/storage work is postponed; no text is retained.
      positions[key] = { start: element.selectionStart, end: element.selectionEnd, direction: element.selectionDirection || 'none', top: element.scrollTop, left: element.scrollLeft };
      pendingWrite.schedule();
    };
    const capture = (event: Event) => {
      const element = field(event.target);
      if (element) save(element);
      if (event.type === 'focusout' || document.visibilityState === 'hidden') pendingWrite.flush();
    };
    const captureActive = () => { const element = field(document.activeElement); if (element) save(element); pendingWrite.flush(); };
    const hidden = () => { if (document.visibilityState === 'hidden') captureActive(); };
    const restore = () => document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-editing-context]').forEach(element => {
      if (restored.has(element)) return;
      restored.add(element);
      const p = positions[element.dataset.editingContext!];
      if (!p) return;
      try { element.setSelectionRange(Math.min(p.start, element.value.length), Math.min(p.end, element.value.length), p.direction); } catch { return; }
      element.scrollTop = p.top; element.scrollLeft = p.left;
    });
    restore();
    const observer = new MutationObserver(restore);
    observer.observe(document.body, { childList: true, subtree: true });
    const events = ['select', 'keyup', 'pointerup', 'input', 'scroll', 'focusout'];
    events.forEach(name => { document.addEventListener(name, capture, true); });
    window.addEventListener('pagehide', captureActive);
    window.addEventListener('blur', captureActive);
    window.addEventListener('hashchange', captureActive);
    window.addEventListener('popstate', captureActive);
    document.addEventListener('visibilitychange', hidden);
    window.addEventListener(BEFORE_NAVIGATE, captureActive);
    return () => {
      captureActive(); observer.disconnect();
      events.forEach(name => { document.removeEventListener(name, capture, true); });
      window.removeEventListener('pagehide', captureActive);
      window.removeEventListener('blur', captureActive);
      window.removeEventListener('hashchange', captureActive);
      window.removeEventListener('popstate', captureActive);
      document.removeEventListener('visibilitychange', hidden);
      window.removeEventListener(BEFORE_NAVIGATE, captureActive);
    };
  }, [storageKey]);
}
