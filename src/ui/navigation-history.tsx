import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { IconButton } from './index';
import './navigation-history.css';

// Tab-local navigation metadata only: no account IDs, written content or credentials.
export const HISTORY_KEY = 'study-space:navigation-history:v1';
export const HISTORY_STATE = '__studyNavigation';
type Entry = { id: string; index: number; url: string };
type Journey = { id: string; index: number; end: number };
type Controls = { back: boolean; forward: boolean; move: (delta: -1 | 1, onNavigate?: () => void) => void };
const HistoryContext = createContext<Controls>({ back: false, forward: false, move: () => {} });

function entry(): Entry | undefined {
  const value = window.history.state?.[HISTORY_STATE];
  return value && typeof value.id === 'string' && Number.isSafeInteger(value.index) && value.index >= 0 && value.url === location.href ? value : undefined;
}

function initialJourney(): Journey {
  const current = entry();
  if (current) {
    try {
      const saved = JSON.parse(sessionStorage.getItem(HISTORY_KEY) || 'null');
      if (saved?.id === current.id && Number.isSafeInteger(saved.end) && saved.end >= current.index) return { id: current.id, index: current.index, end: saved.end };
    } catch { /* Storage may be blocked; preserve native traversal within this visit. */ }
    return { id: current.id, index: current.index, end: current.index };
  }
  return { id: crypto.randomUUID(), index: 0, end: 0 };
}

function remember(journey: Journey) {
  // Merge other owners' fields (reading/graph state), never replace them with null.
  const state = window.history.state;
  window.history.replaceState({ ...(state && typeof state === 'object' ? state : {}),
    [HISTORY_STATE]: { id: journey.id, index: journey.index, url: location.href } }, '', location.href);
  try { sessionStorage.setItem(HISTORY_KEY, JSON.stringify({ id: journey.id, end: journey.end })); }
  catch { /* In-memory history remains usable without sessionStorage. */ }
}

/** One tracker surrounds loading, login, recovery, workspace and error screens. */
export function NavigationHistoryProvider({ children }: { children: ReactNode }) {
  const journey = useRef<Journey | null>(null);
  const url = useRef('');
  const pending = useRef(false);
  const release = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [available, setAvailable] = useState({ back: false, forward: false });
  const [fullscreen, setFullscreen] = useState<Element | null>(null);
  useEffect(() => {
    journey.current = initialJourney();
    url.current = location.href;
    remember(journey.current);
    const publish = () => {
      const current = journey.current!;
      setAvailable({ back: current.index > 0, forward: current.index < current.end });
    };
    const update = () => {
      const current = journey.current!, target = entry();
      if (url.current === location.href && target?.id === current.id && target.index === current.index) return; // popstate + hashchange represent one traversal.
      if (target?.id === current.id) {
        current.index = target.index;
        current.end = Math.max(current.end, target.index);
      } else {
        // A new hash link discards the native forward branch, even for repeated URLs.
        current.index += 1;
        current.end = current.index;
      }
      url.current = location.href;
      remember(current);
      pending.current = false;
      clearTimeout(release.current);
      publish();
    };
    const fullscreenChanged = () => setFullscreen(document.fullscreenElement);
    publish();
    window.addEventListener('popstate', update);
    window.addEventListener('hashchange', update);
    document.addEventListener('fullscreenchange', fullscreenChanged);
    return () => {
      clearTimeout(release.current);
      window.removeEventListener('popstate', update);
      window.removeEventListener('hashchange', update);
      document.removeEventListener('fullscreenchange', fullscreenChanged);
    };
  }, []);
  const move: Controls['move'] = (delta, onNavigate) => {
    const current = journey.current;
    if (!current || pending.current || (delta < 0 ? current.index === 0 : current.index >= current.end)) return;
    // Capture reading position and cursor before a dialog closes or history changes.
    window.dispatchEvent(new Event('study-space:before-navigate'));
    onNavigate?.();
    pending.current = true;
    release.current = setTimeout(() => { pending.current = false; }, 1000);
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    window.history.go(delta);
  };
  return <HistoryContext.Provider value={{ ...available, move }}>
    <div className="navigation-history-bar"><NavigationHistoryControls /></div>
    {children}
    {fullscreen && createPortal(<div className="navigation-history-fullscreen"><NavigationHistoryControls /></div>, fullscreen)}
  </HistoryContext.Provider>;
}

export function NavigationHistoryControls({ onNavigate }: { onNavigate?: () => void }) {
  const { back, forward, move } = useContext(HistoryContext);
  return <nav className="navigation-history-controls" aria-label="화면 이동 기록">
    <IconButton label="뒤로가기" disabled={!back} onClick={() => move(-1, onNavigate)}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5m7-7-7 7 7 7" /></svg>
    </IconButton>
    <IconButton label="앞으로가기" disabled={!forward} onClick={() => move(1, onNavigate)}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
    </IconButton>
  </nav>;
}
