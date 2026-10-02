import { useId, type CSSProperties } from 'react';
import type { StudyLandscape } from '../domain/study-landscape';
import { observatoryParticleOpacity } from '../domain/observatory-events';
import './observatory-reactivity.css';

const glimmers = [
  [440, 32],
  [604, -20],
  [256, 73],
  [724, 46],
  [349, -55],
  [818, -48],
  [147, -12],
  [548, 94],
] as const;

/** Persistent traces of input, independent of the large growth-stage thresholds. */
export function ObservatoryStudySky({ world }: { world: StudyLandscape }) {
  const glow = useId();
  const { inputCount, earlyGlimmer, density } = world.response;
  const population = Math.min(8, 2 * Math.log2(1 + inputCount));
  return (
    <g data-study-sky="true" data-input-count={inputCount} data-early-glimmer={earlyGlimmer}>
      <defs>
        <radialGradient id={glow}>
          <stop className="obs-study-warm" stopOpacity=".9" />
          <stop offset=".65" className="obs-study-warm" stopOpacity=".35" />
          <stop offset="1" className="obs-study-warm" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M80 -100h800v320H80z"
        fill={`url(#${glow})`}
        opacity={earlyGlimmer * 0.09}
        data-study-wash="true"
      />
      {glimmers.map(([x, y], index) => (
        <g
          key={x}
          transform={`translate(${x} ${y})`}
          data-study-star={index}
          opacity={observatoryParticleOpacity(population, index)}
        >
          <path
            d="M-.5 -2h1v1.5H2v1H.5V2h-1V.5H-2v-1h1.5z"
            className="obs-study-glimmer"
            style={{ animationDelay: `${-index * 1.7}s` }}
          />
          <path
            d="M-3 -.5h6v1h-6M-.5 -3h1v6h-1"
            className="obs-study-star-halo"
            opacity={0.08 + 0.2 * density}
          />
        </g>
      ))}
    </g>
  );
}

/** Calendar-day input density animates the station without implying study duration. */
export function ObservatoryStudyStation({ world }: { world: StudyLandscape }) {
  const { density, activity } = world.response;
  return (
    <g
      data-study-station="true"
      data-density={density}
      data-activity={activity}
      style={{ '--obs-study-period': `${18 - 9 * density}s` } as CSSProperties}
    >
      <g opacity={activity} data-study-lamps="true">
        <path d="M10 44h8v8h-8M47 44h8v8h-8M27 45h10v12H27" className="obs-study-window" />
        <path d="M11 52h6l9 8H3zM48 52h6l9 8H40z" className="obs-study-window-spill" />
        <path d="M-5 64h74" className="obs-study-platform" />
      </g>
      <g opacity={density}>
        <path
          d="M5 24v-5h5v-5h5V9h7V5h9V3h5v2h8v4h7v5h5v5h4v5"
          className="obs-study-dome-scan"
          pathLength="100"
        />
        <path d="M1 38h62" className="obs-study-signal" pathLength="100" />
      </g>
    </g>
  );
}
