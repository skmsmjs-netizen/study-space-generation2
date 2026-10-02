import { useId, type CSSProperties, type ReactNode } from 'react';
import { metrics } from '../../docs/observatory-experience-baseline.json';
import { ObservatoryDesk } from './observatory-desk';
import './observatory-room.css';

const windowMetrics = metrics.window;

/** The frame has its own layout space; no foreground decoration covers the original sky. */
export function ObservatoryRoom({ children, activity }: { children: ReactNode; activity: number }) {
  const light = useId();
  return (
    <span
      className="observatory-room"
      data-observatory-room="true"
      data-room-activity={activity}
      style={
        {
          '--obs-room-frame-wide': `${windowMetrics.framePx}px`,
          '--obs-room-frame-compact': `${windowMetrics.compactFramePx}px`,
          '--obs-room-step': `${windowMetrics.edgeStepPx}px`,
          '--obs-room-sill-wide': `${windowMetrics.sillDepthPx}px`,
          '--obs-room-sill-compact': `${windowMetrics.compactSillDepthPx}px`,
          '--obs-room-glow': 0.12 + 0.2 * activity,
          '--obs-room-lamp-mix': `${60 + 20 * activity}%`,
        } as CSSProperties
      }
    >
      <span className="observatory-room-frame" data-room-frame="outside">
        {children}
      </span>
      <span className="observatory-room-sill" aria-hidden="true" data-room-decoration="sill" />
      <svg
        className="observatory-room-desk"
        data-room-decoration="desk"
        viewBox="0 0 960 68"
        width="960"
        height="68"
        preserveAspectRatio="xMidYMid meet"
        shapeRendering="crispEdges"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={light} x2="0" y2="1">
            <stop className="obs-room-light-stop" stopOpacity=".7" />
            <stop offset="1" className="obs-room-light-stop" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="obs-room-desk" d="M0 0h960v68H0z" />
        <path
          className="obs-room-desk-grain"
          d="M0 42h230v1H0M280 43h330v1H280M664 42h296v1H664M12 57h180v1H12M229 58h360v1H229M652 55h284v1H652"
        />
        <path className="obs-room-desk-shadow" d="M0 0h960v2H0M0 65h960v3H0" />
        <path className="obs-room-daylight" d="M40 0h878l42 60H0z" fill={`url(#${light})`} />
        <ObservatoryDesk />
      </svg>
    </span>
  );
}
