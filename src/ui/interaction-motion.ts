import { useLayoutEffect, useState, type RefObject } from 'react';
import { useMotionEnabled } from './motion';

function milliseconds(element: HTMLElement, token: string, fallback: number) {
  const value = getComputedStyle(element).getPropertyValue(token).trim();
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number * (value.endsWith('ms') ? 1 : 1000) : fallback;
}

/** Closing is visual only: callers release focus/inert/scroll as soon as open is false. */
export function useVisualPresence(open: boolean, element: RefObject<HTMLElement | null>) {
  const enabled = useMotionEnabled();
  const [present, setPresent] = useState(open);
  if (open && !present) setPresent(true);
  useLayoutEffect(() => {
    if (open || !present) return;
    const duration = enabled && element.current ? milliseconds(element.current, '--motion-exit', 110) : 0;
    if (!duration) { setPresent(false); return; }
    const timer = window.setTimeout(() => setPresent(false), duration);
    return () => window.clearTimeout(timer);
  }, [open, present, enabled, element]);
  return open || present;
}

/** Only explicit hierarchy gets a direction. Independent destinations get a fade. */
export function routeMotionKind(from: string, to: string): 'forward' | 'back' | 'fade' {
  const parent = (route: string) => {
    if (/^\/subject\/[^/]+$/.test(route)) return '/subjects';
    if (/^\/node\/[^/]+$/.test(route)) return '/subjects';
    const parts = route.split('/').filter(Boolean);
    return parts.length > 1 ? `/${parts.slice(0, -1).join('/')}` : null;
  };
  if (parent(to) === from) return 'forward';
  if (parent(from) === to) return 'back';
  return 'fade';
}

/** WAAPI decorates the committed DOM; it never clones, delays or keys the editor. */
export function playRouteEntrance(element: HTMLElement, from: string, to: string) {
  const kind = routeMotionKind(from, to);
  element.dataset.routeMotion = kind;
  if (typeof element.animate !== 'function' || document.documentElement.dataset.motion === 'reduce' ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || document.visibilityState === 'hidden') return () => {};
  const style = getComputedStyle(element);
  const duration = milliseconds(element, '--motion-route', 240);
  const easing = style.getPropertyValue('--motion-ease-enter').trim() || 'ease-out';
  const animations = [element.animate([{ opacity: .35 }, { opacity: 1 }], { duration, easing })];
  // Keep body coordinates stable. Only the short heading indicates detail/back direction.
  const heading = element.querySelector<HTMLElement>('h1, h2');
  if (heading && kind !== 'fade') {
    const travel = Number.parseFloat(style.getPropertyValue('--motion-travel')) || 16;
    animations.push(heading.animate([{ transform: `translateX(${kind === 'forward' ? travel : -travel}px)` }, { transform: 'none' }], { duration, easing }));
  }
  let active = true;
  const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const stop = () => {
    if (!active) return;
    active = false;
    animations.forEach(animation => { animation.cancel(); });
    ['pointerdown', 'keydown', 'wheel', 'touchmove'].forEach(name => { document.removeEventListener(name, stop, true); });
    document.removeEventListener('visibilitychange', visibility);
    query?.removeEventListener('change', preference);
    observer.disconnect();
  };
  const visibility = () => { if (document.visibilityState === 'hidden') stop(); };
  const preference = () => { if (query?.matches || document.documentElement.dataset.motion === 'reduce') stop(); };
  const observer = new MutationObserver(preference);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
  ['pointerdown', 'keydown', 'wheel', 'touchmove'].forEach(name => { document.addEventListener(name, stop, { capture: true, passive: true }); });
  document.addEventListener('visibilitychange', visibility);
  query?.addEventListener('change', preference);
  void Promise.all(animations.map(animation => animation.finished.catch(() => {}))).then(stop);
  return stop;
}
