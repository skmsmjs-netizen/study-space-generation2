import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { DotPulse } from 'ldrs/react';
import 'ldrs/react/DotPulse.css';
import './motion.css';

// Keep reduced motion and tab visibility shared across CSS, Motion, GSAP and players.
const readMotion = () => typeof document !== 'undefined' && document.documentElement.dataset.motion !== 'reduce'
  && !(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) && document.visibilityState !== 'hidden';
const subscribers = new Set<() => void>();
let stopListening: (() => void) | undefined;
function subscribeMotion(update: () => void) {
  subscribers.add(update);
  if (!stopListening) {
    const publish = () => { for (const listener of subscribers) listener(); };
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    query?.addEventListener('change', publish);
    document.addEventListener('visibilitychange', publish);
    const observer = new MutationObserver(publish);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
    stopListening = () => { query?.removeEventListener('change', publish); document.removeEventListener('visibilitychange', publish); observer.disconnect(); };
  }
  return () => {
    subscribers.delete(update);
    if (!subscribers.size) { stopListening?.(); stopListening = undefined; }
  };
}
export function useMotionEnabled() { return useSyncExternalStore(subscribeMotion, readMotion, () => false); }

/** Pause a player outside the visible scroll area without resetting its selection or frame. */
export function usePlayerMotion() {
  const enabled = useMotionEnabled(), ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false), [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return; }
    const observer = new IntersectionObserver(entries => setVisible(entries.some(entry => entry.isIntersecting)), { threshold: .05 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, enabled, playing: enabled && visible && !paused, paused, setPaused };
}

/** UI Ball LDRS: decorative dots never replace the operation's accessible label. */
export function BusyDots() {
  const enabled = useMotionEnabled(), [ready, setReady] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => setReady(true), 120); return () => window.clearTimeout(timer); }, []);
  return <span className="ui-busy-dots" aria-hidden="true" data-motion-source="ldrs">
    {!ready ? null : enabled ? <DotPulse size={20} speed={1.5} color="currentColor" /> : <span>···</span>}
  </span>;
}

/** Adapted from Animate UI CheckLine, copyright Elliot Sutton; full licence alongside this file. */
export function SavedMark() {
  const enabled = useMotionEnabled();
  return <svg className="ui-saved-mark" aria-hidden="true" data-motion-source="animate-ui" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <motion.path d="m4 10 5 5L20 4" initial={enabled ? { pathLength: 0, opacity: 0 } : false} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: enabled ? .18 : 0, ease: 'easeOut' }} />
    <path d="M21 19H3" />
  </svg>;
}

/** Motion Primitives AnimatedBackground's shared layout, controlled by the existing selection. */
export function useSelectionMotionId() { return useId(); }
export function SelectionBackground({ id }: { id: string }) {
  const enabled = useMotionEnabled();
  return <motion.span aria-hidden="true" data-motion-source="motion-primitives" className="ui-selection-motion" layoutId={enabled ? id : undefined} initial={false} transition={{ duration: enabled ? .18 : 0, ease: 'easeOut' }} />;
}

/** Adapted Magic UI BlurFade. Zero blur and a small offset retain legible Korean text. */
export function NoticeEntrance({ children, className }: { children: ReactNode; className?: string }) {
  const enabled = useMotionEnabled();
  return <motion.div className={className} data-motion-source="magic-ui" initial={enabled ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: enabled ? .18 : 0, ease: 'easeOut' }}>{children}</motion.div>;
}

/** Adapted React Bits FadeContent, copyright David Haz. No hidden-first content or ScrollTrigger dependency. */
export function FadeContent({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null), enabled = useMotionEnabled();
  useEffect(() => {
    if (!enabled || !ref.current) return;
    const context = gsap.context(() => { gsap.fromTo(ref.current, { opacity: .65 }, { opacity: 1, duration: .18, ease: 'power2.out', clearProps: 'opacity' }); });
    return () => context.revert();
  }, [enabled]);
  return <div ref={ref} data-motion-source="react-bits">{children}</div>;
}
