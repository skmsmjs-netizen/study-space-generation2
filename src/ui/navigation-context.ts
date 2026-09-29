import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// Navigation hints only. Never place study text, drafts, credentials or server state here.
export const NAVIGATION_CONTEXT_KEY = 'study-space:demo:navigation-context:v1';
const BEFORE_NAVIGATE = 'study-space:before-navigate';
type FocusTarget = { kind: 'key' | 'id' | 'href' | 'editor'; value: string };
type Position = { x: number; y: number; focus?: FocusTarget };
type NavigationContext = { version: 1; route: string; positions: Record<string, Position> };

function validRoute(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 4096 || !value.startsWith('/') ||
    value.startsWith('//') || /[\u0000-\u001f\u007f]/.test(value)) return false;
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

function readContext(): NavigationContext {
  const fallback: NavigationContext = { version: 1, route: '/', positions: {} };
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(NAVIGATION_CONTEXT_KEY) || 'null');
    if (!value || typeof value !== 'object') return fallback;
    const raw = value as Partial<NavigationContext>;
    if (raw.version !== 1 || !validRoute(raw.route) || !raw.positions || typeof raw.positions !== 'object') return fallback;
    const positions: Record<string, Position> = {};
    for (const [route, candidate] of Object.entries(raw.positions).slice(-100)) {
      if (!validRoute(route) || !candidate || typeof candidate !== 'object' ||
        !Number.isFinite(candidate.x) || !Number.isFinite(candidate.y) || candidate.x < 0 || candidate.y < 0) continue;
      const focus = candidate.focus;
      positions[route] = { x: candidate.x, y: candidate.y,
        ...(focus && ['key', 'id', 'href', 'editor'].includes(focus.kind) &&
          typeof focus.value === 'string' && focus.value.length <= 4096 ? { focus } : {}) };
    }
    return { version: 1, route: raw.route, positions };
  } catch { return fallback; }
}

function writeContext(context: NavigationContext) {
  try { sessionStorage.setItem(NAVIGATION_CONTEXT_KEY, JSON.stringify(context)); }
  catch { /* History and in-memory restoration stay usable when storage is unavailable. */ }
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
export function useRoute(): string {
  useEditingContext();
  const [initial] = useState(() => readContext());
  const [route, setRoute] = useState(() => window.location.hash ? readRouteHash() : initial.route);
  const context = useRef(initial);
  const current = useRef(route);
  const departed = useRef(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    // The route cache owns scroll while mounted; otherwise native traversal may
    // apply an older history-entry offset after our route restoration has run.
    window.history.scrollRestoration = 'manual';
    if (!window.location.hash && route !== '/') {
      // Preserve every other owner's history state and the current pathname/query.
      window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}#${encodeURI(route)}`);
    }
    const capture = () => {
      const position: Position = { x: Math.max(0, window.scrollX), y: Math.max(0, window.scrollY), focus: identifyFocus(document.activeElement) };
      context.current.positions[current.current] = position;
      const entries = Object.entries(context.current.positions);
      if (entries.length > 100) context.current.positions = Object.fromEntries(entries.slice(-100));
      context.current.route = current.current;
      writeContext(context.current);
    };
    const beforeNavigate = () => { capture(); departed.current = true; };
    const update = () => {
      const next = readRouteHash();
      if (next === current.current) return;
      if (!departed.current) capture();
      departed.current = false;
      hasNavigated.current = true;
      current.current = next;
      context.current.route = next;
      writeContext(context.current);
      setRoute(next);
    };
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute('download') ||
        (anchor.target && anchor.target !== '_self')) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin === window.location.origin && url.pathname === window.location.pathname &&
        url.search === window.location.search && url.hash && readRouteHash(url.hash) !== current.current) beforeNavigate();
    };
    window.addEventListener(BEFORE_NAVIGATE, beforeNavigate);
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    window.addEventListener('pagehide', capture);
    document.addEventListener('click', click);
    return () => {
      capture();
      window.removeEventListener(BEFORE_NAVIGATE, beforeNavigate);
      window.removeEventListener('hashchange', update);
      window.removeEventListener('popstate', update);
      window.removeEventListener('pagehide', capture);
      document.removeEventListener('click', click);
      if (window.history.scrollRestoration === 'manual') window.history.scrollRestoration = previousScrollRestoration;
    };
    // One listener owns the lifetime of this workspace; mutable route lives in current.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const position = context.current.positions[route];
    if (editingOrDialogOwnsFocus()) return;
    const target = position?.focus && findFocus(position.focus);
    const heading = !target && hasNavigated.current
      ? document.querySelector<HTMLElement>('[data-route-heading], main h1, main h2') : null;
    if (target) target.focus({ preventScroll: true });
    else if (heading) {
      if (!heading.hasAttribute('tabindex')) heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
    const x = position?.x ?? 0, y = position?.y ?? 0;
    if (window.scrollX !== x || window.scrollY !== y) window.scrollTo({ left: x, top: y, behavior: 'instant' });
  }, [route]);
  return route;
}

// Cursor/scroll hints contain no written content. Stable keys belong to an entity and field.
export const EDITING_CONTEXT_KEY = 'study-space:demo:editing-context:v1';
type EditingPosition = { start: number; end: number; direction: 'forward' | 'backward' | 'none'; top: number; left: number };
function useEditingContext() {
  useLayoutEffect(() => {
    let positions: Record<string, EditingPosition> = {};
    try {
      const raw: unknown = JSON.parse(sessionStorage.getItem(EDITING_CONTEXT_KEY) || '{}');
      if (raw && typeof raw === 'object') for (const [key, value] of Object.entries(raw).slice(-200)) {
        if (!value || typeof value !== 'object') continue;
        const p = value as EditingPosition;
        if ([p.start, p.end, p.top, p.left].every(n => Number.isFinite(n) && n >= 0) && ['forward', 'backward', 'none'].includes(p.direction)) positions[key] = p;
      }
    } catch { /* Invalid view hints never block original text. */ }
    const restored = new WeakSet<Element>();
    const field = (target: EventTarget | null) => (target instanceof HTMLTextAreaElement || target instanceof HTMLInputElement) && target.dataset.editingContext ? target : null;
    const save = (element: HTMLTextAreaElement | HTMLInputElement) => {
      const key = element.dataset.editingContext!;
      if (element.selectionStart === null || element.selectionEnd === null) return;
      positions[key] = { start: element.selectionStart, end: element.selectionEnd, direction: element.selectionDirection || 'none', top: element.scrollTop, left: element.scrollLeft };
      const entries = Object.entries(positions);
      if (entries.length > 200) positions = Object.fromEntries(entries.slice(-200));
      try { sessionStorage.setItem(EDITING_CONTEXT_KEY, JSON.stringify(positions)); } catch { /* In-tab hints remain available. */ }
    };
    const capture = (event: Event) => { const element = field(event.target); if (element) save(element); };
    const captureActive = () => { const element = field(document.activeElement); if (element) save(element); };
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
    events.forEach(name => document.addEventListener(name, capture, true));
    window.addEventListener('pagehide', captureActive);
    window.addEventListener(BEFORE_NAVIGATE, captureActive);
    return () => {
      captureActive(); observer.disconnect();
      events.forEach(name => document.removeEventListener(name, capture, true));
      window.removeEventListener('pagehide', captureActive);
      window.removeEventListener(BEFORE_NAVIGATE, captureActive);
    };
  }, []);
}
