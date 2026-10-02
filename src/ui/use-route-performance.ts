import { useEffect, useLayoutEffect, useRef } from 'react';
import { beginUiMeasure, finishUiMeasureAfterPaint } from '../data/ui-performance';
import { readRouteHash } from './navigation-context';

/** Measures this route's React commit and next paint opportunity, not lazy content readiness or INP. */
export function useRoutePerformance(route: string) {
  const committed = useRef(route);
  const pending = useRef<{
    finish: ReturnType<typeof beginUiMeasure>;
    target: string | null;
    cancelPaint?: () => void;
  } | null>(null);
  useLayoutEffect(() => {
    committed.current = route;
    const operation = pending.current;
    if (!operation || operation.target !== route || operation.cancelPaint) return;
    operation.cancelPaint = finishUiMeasureAfterPaint(() => {
      if (pending.current === operation && document.visibilityState !== 'hidden')
        operation.finish();
      if (pending.current === operation) pending.current = null;
    });
  }, [route]);
  useEffect(() => {
    const cancel = () => {
      pending.current?.cancelPaint?.();
      pending.current = null;
    };
    const before = () => {
      cancel();
      if (document.visibilityState !== 'hidden')
        pending.current = { finish: beginUiMeasure('route-render'), target: null };
    };
    const changed = () => {
      const target = readRouteHash();
      if (target === committed.current || document.visibilityState === 'hidden') {
        cancel();
        return;
      }
      // A second hash before its commit abandons the superseded transition.
      if (pending.current?.target) cancel();
      pending.current ??= { finish: beginUiMeasure('route-render'), target: null };
      pending.current.target = target;
    };
    const hidden = () => {
      if (document.visibilityState === 'hidden') cancel();
    };
    window.addEventListener('study-space:before-navigate', before);
    window.addEventListener('hashchange', changed);
    document.addEventListener('visibilitychange', hidden);
    return () => {
      cancel();
      window.removeEventListener('study-space:before-navigate', before);
      window.removeEventListener('hashchange', changed);
      document.removeEventListener('visibilitychange', hidden);
    };
  }, []);
}
