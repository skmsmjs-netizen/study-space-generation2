import { useEffect, type RefObject } from 'react';
import type { Config } from 'plotly.js-dist-min';
import type { MathZoomRef } from './math-view-controls';

/** All formula adapters use this policy, irrespective of subject or expression. */
export const mathPlotConfig: Partial<Config> = {
  responsive: true,
  displaylogo: false,
  displayModeBar: false,
  scrollZoom: false,
};
export const mathPlotZoomStep = 1.1;
const dragGain = 0.35;
const pinchGain = 0.45;
const maxZoomLog = Math.log(mathPlotZoomStep);

export type MathPan = (phase: 'start' | 'move' | 'end', dx?: number, dy?: number) => void;
export type MathPanRef = { current: MathPan | null };

/** Use public ranges/relayout so redraws cannot lose a temporary 2D drag. */
export function mathPlotPan(
  host: HTMLElement,
  ranges: () => number[][],
  apply: (ranges: number[][]) => void,
): MathPan {
  let base: number[][] = [],
    width = 1,
    height = 1,
    frame = 0;
  let next: number[][] | undefined;
  const flush = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    if (next) {
      const value = next;
      next = undefined;
      apply(value);
    }
  };
  return (phase, dx = 0, dy = 0) => {
    if (phase === 'start') {
      base = ranges().map((range) => range.slice());
      const box = host.querySelector('.nsewdrag')?.getBoundingClientRect();
      width = Math.max(1, box?.width ?? host.clientWidth);
      height = Math.max(1, box?.height ?? host.clientHeight);
    } else if (phase === 'end') flush();
    else {
      next = base.map(([low, high], i) => {
        const offset = (high - low) * (i === 0 ? -dx / width : dy / height);
        return [low + offset, high + offset];
      });
      if (!frame) frame = requestAnimationFrame(flush);
    }
  };
}

/** Plotly keeps its public camera/pan behavior; only physical input is attenuated. */
export function useMathPlotTouch(
  host: RefObject<HTMLDivElement | null>,
  zoomRef: MathZoomRef,
  panRef?: MathPanRef,
) {
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const pointers = new Map<number, PointerEvent>();
    const forwarded = new WeakSet<Event>();
    let target: EventTarget | null = null;
    let dragging = false;
    let activePan: MathPan | null = null;
    let touchDragging = false;
    let distance = 0;
    let anchor = { x: 0, y: 0 };
    let position = { x: 0, y: 0 };
    let zoomLog = 0,
      zoomFrame = 0;
    element.dataset.mathInteraction = 'precision-v1';
    const block = (event: Event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    const mouse = (type: string) => {
      const event = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: position.x,
        clientY: position.y,
        button: 0,
        buttons: type === 'mouseup' ? 0 : 1,
      });
      forwarded.add(event);
      target?.dispatchEvent(event);
    };
    const start = (event: MouseEvent | PointerEvent) => {
      anchor = { x: event.clientX, y: event.clientY };
      position = { ...anchor };
      dragging = true;
      element.dataset.mathDragging = 'true';
      activePan = panRef?.current ?? null;
      if (activePan) activePan('start');
      else mouse('mousedown');
    };
    const move = (event: MouseEvent | PointerEvent) => {
      position = {
        x: anchor.x + (event.clientX - anchor.x) * dragGain,
        y: anchor.y + (event.clientY - anchor.y) * dragGain,
      };
      if (activePan) activePan('move', position.x - anchor.x, position.y - anchor.y);
      else mouse('mousemove');
    };
    const end = () => {
      const wasDragging = dragging;
      if (wasDragging) {
        if (activePan) activePan('end');
        else mouse('mouseup');
      }
      activePan = null;
      dragging = false;
      delete element.dataset.mathDragging;
      if (wasDragging) element.dispatchEvent(new Event('mathplotgestureend'));
    };
    // Coalesce trackpad/pinch bursts instead of queuing relayouts or applying
    // a single anomalous wheel delta as a very large magnification.
    const queueZoom = (log: number) => {
      zoomLog = Math.max(-maxZoomLog, Math.min(maxZoomLog, zoomLog + log));
      if (zoomFrame) return;
      zoomFrame = requestAnimationFrame(() => {
        zoomFrame = 0;
        const factor = Math.exp(zoomLog);
        zoomLog = 0;
        zoomRef.current?.(factor);
      });
    };
    const separation = () => {
      const [a, b] = [...pointers.values()];
      return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    };
    const handleTouch = (event: PointerEvent) => {
      if (event.pointerType !== 'touch' || !zoomRef.current) return;
      block(event);
      if (event.type === 'pointerdown') {
        pointers.set(event.pointerId, event);
        try {
          element.setPointerCapture(event.pointerId);
        } catch {
          /* Synthetic pointer. */
        }
        if (pointers.size === 1) {
          target = event.target;
          touchDragging = true;
          start(event);
        } else {
          end();
          distance = pointers.size === 2 ? separation() : 0;
        }
      } else if (event.type === 'pointermove' && pointers.has(event.pointerId)) {
        pointers.set(event.pointerId, event);
        if (pointers.size === 1 && dragging) move(event);
        else if (pointers.size === 2) {
          const next = separation();
          if (distance > 0 && next > 0) queueZoom(Math.log(next / distance) * pinchGain);
          distance = next;
        }
      } else if (event.type === 'pointerup' || event.type === 'pointercancel') {
        end();
        pointers.delete(event.pointerId);
        distance = 0;
        if (event.type === 'pointercancel') pointers.clear();
        // Re-anchor after a pinch: lifting one finger must not rotate the view.
        if (pointers.size === 1) start([...pointers.values()][0]);
        else if (pointers.size === 2) distance = separation();
        touchDragging = pointers.size > 0;
      }
    };
    const handleMouse = (event: MouseEvent) => {
      if (forwarded.has(event)) return;
      if (touchDragging) {
        block(event);
        return;
      }
      if (!zoomRef.current) return;
      if (event.type === 'mousedown') {
        if (event.button !== 0) return;
        block(event);
        target = event.target;
        start(event);
      } else if (dragging) {
        block(event);
        if (event.type === 'mousemove') move(event);
        else end();
      }
    };
    const wheel = (event: WheelEvent) => {
      if (!zoomRef.current) return;
      block(event);
      const pixels =
        event.deltaY *
        (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientHeight : 1);
      queueZoom(-pixels * 0.001);
    };
    const cancel = () => {
      end();
      pointers.clear();
      touchDragging = false;
      distance = 0;
      cancelAnimationFrame(zoomFrame);
      zoomFrame = 0;
      zoomLog = 0;
    };
    const events = ['pointerdown', 'pointermove', 'pointerup', 'pointercancel'] as const;
    const touchEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'] as const;
    for (const name of events) element.addEventListener(name, handleTouch, true);
    for (const name of touchEvents)
      element.addEventListener(name, block, { capture: true, passive: false });
    element.addEventListener('mousedown', handleMouse, true);
    document.addEventListener('mousemove', handleMouse, true);
    document.addEventListener('mouseup', handleMouse, true);
    element.addEventListener('wheel', wheel, { capture: true, passive: false });
    window.addEventListener('blur', cancel);
    return () => {
      cancel();
      delete element.dataset.mathInteraction;
      for (const name of events) element.removeEventListener(name, handleTouch, true);
      for (const name of touchEvents) element.removeEventListener(name, block, true);
      element.removeEventListener('mousedown', handleMouse, true);
      document.removeEventListener('mousemove', handleMouse, true);
      document.removeEventListener('mouseup', handleMouse, true);
      element.removeEventListener('wheel', wheel, true);
      window.removeEventListener('blur', cancel);
    };
  }, [host, zoomRef, panRef]);
}
