import { useEffect, useRef } from 'react';
import { gestureRanges, type GraphRanges } from '../interactive/math-physics/gestures.mjs';

/** SVG adapter; reuse the common focal-point/range calculation, not a new gesture policy. */
export function useRileyPlotGestures(range: GraphRanges, apply: (range: GraphRanges) => void) {
  const host = useRef<SVGSVGElement>(null);
  const latest = useRef({ range, apply });
  latest.current = { range, apply };
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const pointers = new Map<number, { x: number; y: number }>();
    let start: {
      range: GraphRanges;
      point: { x: number; y: number };
      distance: number;
      count: number;
    } | null = null;
    let frame: number | null = null,
      queued: GraphRanges | null = null;
    let safari: { range: GraphRanges; point: { x: number; y: number } } | null = null;
    const point = (clientX: number, clientY: number) => {
      const b = el.getBoundingClientRect();
      return {
        x: (clientX - b.left - (b.width * 40) / 600) / ((b.width * 520) / 600),
        y: 1 - (clientY - b.top - (b.height * 20) / 360) / ((b.height * 300) / 360),
      };
    };
    const measure = () => {
      const [a, b = a] = Array.from(pointers.values());
      return {
        point: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
        distance: Math.max(0.0001, Math.hypot(a.x - b.x, ((a.y - b.y) * 300) / 520)),
        count: pointers.size,
      };
    };
    const schedule = (next: GraphRanges | null) => {
      if (!next || !Object.values(next).every((r) => r.every((n) => Number.isFinite(n)))) return;
      queued = next;
      if (frame === null)
        frame = requestAnimationFrame(() => {
          frame = null;
          if (queued) {
            const r = queued;
            queued = null;
            latest.current.range = r;
            latest.current.apply(r);
          }
        });
    };
    const rebase = () => {
      start = pointers.size ? { range: queued ?? latest.current.range, ...measure() } : null;
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const p = point(e.clientX, e.clientY);
      if (p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1) return;
      el.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, p);
      rebase();
    };
    const move = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId) || !start) return;
      e.preventDefault();
      pointers.set(e.pointerId, point(e.clientX, e.clientY));
      const now = measure();
      schedule(
        gestureRanges(
          start.range,
          now.count > 1 ? start.distance / now.distance : 1,
          start.point,
          now.point,
          now.count > 1 ? 0.05 : 0,
        ),
      );
    };
    const end = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      rebase();
      if (!pointers.size && queued) {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
        const next = queued;
        queued = null;
        latest.current.range = next;
        latest.current.apply(next);
      }
    };
    const cancel = () => {
      pointers.clear();
      start = null;
      safari = null;
    };
    const wheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      if (pointers.size || safari) return;
      const p = point(e.clientX, e.clientY);
      schedule(
        gestureRanges(
          queued ?? latest.current.range,
          Math.exp(Math.max(-0.5, Math.min(0.5, e.deltaY * 0.01))),
          p,
        ),
      );
    };
    const key = (e: KeyboardEvent) => {
      const dx = e.key === 'ArrowLeft' ? -0.1 : e.key === 'ArrowRight' ? 0.1 : 0,
        dy = e.key === 'ArrowDown' ? -0.1 : e.key === 'ArrowUp' ? 0.1 : 0;
      if (!dx && !dy) return;
      e.preventDefault();
      schedule(
        gestureRanges(
          queued ?? latest.current.range,
          1,
          { x: 0.5, y: 0.5 },
          { x: 0.5 - dx, y: 0.5 - dy },
          0,
        ),
      );
    };
    type SafariGesture = Event & { clientX: number; clientY: number; scale: number };
    const gestureStart = (event: Event) => {
      if (pointers.size) return;
      const e = event as SafariGesture;
      if (!Number.isFinite(e.clientX) || !Number.isFinite(e.clientY)) return;
      e.preventDefault();
      safari = { range: queued ?? latest.current.range, point: point(e.clientX, e.clientY) };
    };
    const gestureChange = (event: Event) => {
      if (!safari) return;
      const e = event as SafariGesture;
      e.preventDefault();
      schedule(gestureRanges(safari.range, 1 / e.scale, safari.point));
    };
    const gestureEnd = () => {
      safari = null;
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', cancel);
    el.addEventListener('wheel', wheel, { passive: false });
    el.addEventListener('keydown', key);
    el.addEventListener('gesturestart', gestureStart, { passive: false });
    el.addEventListener('gesturechange', gestureChange, { passive: false });
    el.addEventListener('gestureend', gestureEnd);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      cancel();
      queued = null;
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', end);
      el.removeEventListener('pointercancel', cancel);
      el.removeEventListener('wheel', wheel);
      el.removeEventListener('keydown', key);
      el.removeEventListener('gesturestart', gestureStart);
      el.removeEventListener('gesturechange', gestureChange);
      el.removeEventListener('gestureend', gestureEnd);
    };
  }, []);
  return host;
}
