import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from './index';

export const MathGraphFullscreenContext = createContext(false);
export function MathGraphHelp({ children }: { children: ReactNode }) {
  const expanded = useContext(MathGraphFullscreenContext);
  return <details className="math-graph-options" open={!expanded}><summary>그래프 조작 안내</summary>{children}</details>;
}

// Promote the same mounted graph into the browser's top layer. Moving React
// children between two portals would rebuild the renderer and discard input.
export function MathGraphFullscreen({ children, active = true }: { children: ReactNode; active?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const expandedRef = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const nativeRequested = useRef(false);
  const returnScroll = useRef<{ x: number; y: number } | null>(null);
  const leave = useCallback(() => {
    if (!expandedRef.current) return;
    expandedRef.current = false;
    nativeRequested.current = false;
    if (document.fullscreenElement === surface.current) void document.exitFullscreen().catch(() => {});
    dialog.current?.close();
    dialog.current?.show();
    setExpanded(false);
    toggle.current?.focus({ preventScroll: true });
  }, []);
  const enter = () => {
    const element = dialog.current;
    if (!element || expandedRef.current) return;
    returnScroll.current = { x: window.scrollX, y: window.scrollY };
    element.close();
    element.showModal();
    expandedRef.current = true;
    setExpanded(true);
    toggle.current?.focus({ preventScroll: true });
    // iPhone and denied fullscreen requests keep the full-viewport dialog.
    if (document.fullscreenEnabled && surface.current?.requestFullscreen) {
      nativeRequested.current = true;
      void surface.current.requestFullscreen().then(() => {
        // A fast close can race the asynchronous browser transition.
        if (!expandedRef.current && document.fullscreenElement === surface.current)
          void document.exitFullscreen().catch(() => {});
      }).catch(() => { nativeRequested.current = false; });
    }
  };
  useLayoutEffect(() => {
    if (expanded || !returnScroll.current) return;
    const position = returnScroll.current;
    returnScroll.current = null;
    if (active) window.scrollTo({ left: position.x, top: position.y, behavior: 'instant' });
  }, [expanded, active]);
  useEffect(() => {
    if (!expanded) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const changed = () => {
      if (nativeRequested.current && !document.fullscreenElement) leave();
    };
    document.addEventListener('fullscreenchange', changed);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('fullscreenchange', changed);
    };
  }, [expanded, leave]);
  useEffect(() => { if (!active) leave(); }, [active, leave]);
  useEffect(() => {
    const element = surface.current;
    return () => {
      if (document.fullscreenElement === element) void document.exitFullscreen().catch(() => {});
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      open
      role={expanded ? 'dialog' : 'region'}
      aria-label={expanded ? '그래프 전체화면' : '그래프 보기'}
      aria-modal={expanded || undefined}
      className={`math-graph-dialog${expanded ? ' is-fullscreen' : ''}`}
      onCancel={event => { event.preventDefault(); leave(); }}
      onClose={() => { if (!dialog.current?.open) leave(); }}
    >
      <div ref={surface} className="math-graph-surface">
        <div className="math-fullscreen-actions">
          {expanded && <strong>그래프 전체화면</strong>}
          <Button ref={toggle} aria-expanded={expanded} onClick={expanded ? leave : enter}>
            {expanded ? '전체화면 닫기' : '그래프 전체화면'}
          </Button>
        </div>
        <MathGraphFullscreenContext.Provider value={expanded}>{children}</MathGraphFullscreenContext.Provider>
      </div>
    </dialog>
  );
}
