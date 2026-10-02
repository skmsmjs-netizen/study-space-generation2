import { useEffect, useRef } from 'react';
import { gestureRanges, type GraphRanges } from '../interactive/math-physics/gestures.mjs';
import type { VectorEntry } from '../data/vector-calculus-view';

type View = VectorEntry['view'];
type Ranges = GraphRanges;

/** SVG adapter for the existing mathematical range/anchor policy. */
export function useVectorGestures(extent: number, view: View, apply: (v: View) => void) {
  const host = useRef<SVGSVGElement>(null);
  const latest = useRef({ extent, view, apply });
  latest.current = { extent, view, apply };
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    let pending: View | undefined, frame = 0;
    const ranges = (): Ranges => {
      const v = pending ?? latest.current.view, r = latest.current.extent / v.zoom;
      return { x: [v.x - r, v.x + r], y: [v.y - r, v.y + r] };
    };
    const pointers = new Map<number, { x: number; y: number }>();
    const point = (x: number, y: number) => {
      const box = node.getBoundingClientRect();
      return { x: ((x - box.left) / box.width * 500 - 40) / 420,
        y: 1 - ((y - box.top) / box.height * 500 - 40) / 420 };
    };
    const measure = () => {
      const [a, b = a] = [...pointers.values()];
      return { count: pointers.size, center: point((a.x + b.x) / 2, (a.y + b.y) / 2), distance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)) };
    };
    let gesture: (ReturnType<typeof measure> & { base: Ranges }) | undefined;
    let safari: { base: Ranges; center: { x: number; y: number } } | undefined;
    const queue = (r: Ranges | null) => {
      if (!r || ![...r.x, ...r.y].every(Number.isFinite)) return;
      const zoom = Math.max(.25, Math.min(8, latest.current.extent * 2 / (r.x[1] - r.x[0])));
      pending = { zoom, x: Math.max(-100, Math.min(100, (r.x[0] + r.x[1]) / 2)), y: Math.max(-100, Math.min(100, (r.y[0] + r.y[1]) / 2)) };
      if (!frame) frame = requestAnimationFrame(() => {
        frame = 0;
        if (pending) { const next = pending; pending = undefined; latest.current.apply(next); }
      });
    };
    const reanchor = () => { gesture = pointers.size ? { base: ranges(), ...measure() } : undefined; };
    const stop = (e: Event) => { if (e.cancelable) e.preventDefault(); };
    const pointer = (e: PointerEvent) => {
      if (e.type === 'pointerdown') {
        if (e.button !== 0) return;
        stop(e); pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        try { node.setPointerCapture(e.pointerId); } catch { /* Synthetic event. */ }
        reanchor();
      } else if (pointers.has(e.pointerId)) {
        stop(e);
        if (e.type === 'pointermove') {
          pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
          const now = measure();
          if (gesture) queue(gestureRanges(gesture.base, now.count >= 2 ? gesture.distance / now.distance : 1, gesture.center, now.center, now.count >= 2 ? .05 : 0));
        } else {
          pointers.delete(e.pointerId);
          if (e.type === 'pointercancel') pointers.clear();
          reanchor();
        }
      }
    };
    const wheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      stop(e);
      const amount = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? node.clientHeight : 1);
      queue(gestureRanges(ranges(), Math.exp(Math.max(-.5, Math.min(.5, amount * .01))), point(e.clientX, e.clientY)));
    };
    const safariEvent = (event: Event) => {
      const e = event as Event & { clientX: number; clientY: number; scale: number };
      if (pointers.size) return;
      stop(e);
      if (e.type === 'gesturestart') safari = { base: ranges(), center: point(e.clientX, e.clientY) };
      else if (e.type === 'gestureend') safari = undefined;
      else if (safari) queue(gestureRanges(safari.base, 1 / e.scale, safari.center));
    };
    const events = ['pointerdown', 'pointermove', 'pointerup', 'pointercancel'] as const;
    events.forEach(name => node.addEventListener(name, pointer));
    node.addEventListener('wheel', wheel, { passive: false });
    ['gesturestart', 'gesturechange', 'gestureend'].forEach(name => node.addEventListener(name, safariEvent, { passive: false }));
    return () => {
      pointers.clear(); gesture = undefined; safari = undefined; pending = undefined;
      cancelAnimationFrame(frame);
      events.forEach(name => node.removeEventListener(name, pointer));
      node.removeEventListener('wheel', wheel);
      ['gesturestart', 'gesturechange', 'gestureend'].forEach(name => node.removeEventListener(name, safariEvent));
    };
  }, []);
  return host;
}
