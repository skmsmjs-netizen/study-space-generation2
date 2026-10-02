import type { CSSProperties, ReactNode } from 'react';
import type { ObservatoryEvent } from '../domain/observatory-events';
import './observatory-event-variations.css';

type Family = 'cloud' | 'halo' | 'flow' | 'terrain' | 'trail' | 'spark';
const families: Readonly<Record<string, Family>> = {
  'valley-cloud': 'cloud',
  'cumulus-fleet': 'cloud',
  'virga-curtain': 'cloud',
  'amber-anvil': 'cloud',
  'iridescent-cloud': 'cloud',
  'moonlit-cloud': 'cloud',
  'silver-fog': 'cloud',
  'fog-lift': 'cloud',
  'sundog-pair': 'halo',
  'mist-bow': 'halo',
  'lunar-corona': 'halo',
  'cosmic-lens': 'halo',
  'warm-updraft': 'flow',
  'sunset-fan': 'flow',
  'aurora-fold': 'flow',
  'airglow-tide': 'flow',
  'silver-mesh': 'flow',
  'zodiacal-pyramid': 'flow',
  'venus-belt': 'flow',
  'dew-web': 'terrain',
  'wind-ripple': 'terrain',
  'cloud-shadow': 'terrain',
  alpenglow: 'terrain',
  'frost-grass': 'terrain',
  'horizon-mirage': 'terrain',
  'bird-thermal': 'trail',
  'star-sailing': 'trail',
  'satellite-crossing': 'trail',
  'meteor-fan': 'trail',
  'comet-fragments': 'trail',
  'ice-prism': 'spark',
  'solar-glitter': 'spark',
  'ember-drift': 'spark',
  'firefly-garden': 'spark',
  'quiet-snow': 'spark',
  'last-star': 'spark',
};

type Recipe = {
  /** Original motif stays legible inside every new composition. */
  primary: string;
  secondary?: string;
  contour: string;
  detail: string;
  motion: 'shear' | 'lift' | 'wave' | 'open' | 'thread' | 'terrace';
};
type SixRecipes = readonly [Recipe, Recipe, Recipe, Recipe, Recipe, Recipe];

// Six different silhouettes, arrangements and trajectories in each family. Small
// shared drawing primitives avoid 216 copies of a complete scene or frame loop.
const recipes: Readonly<Record<Family, SixRecipes>> = {
  cloud: [
    {
      primary: 'translate(-16 -6) scale(.64 .55)',
      secondary: 'translate(20 9) scale(.82 .44)',
      contour: 'M-41 2h16v-2h13M5 18h21v-2h23',
      detail: 'M-33 -3h18M16 12h22',
      motion: 'shear',
    },
    {
      primary: 'translate(0 -17) scale(.66 .82)',
      secondary: 'translate(-9 9) scale(.88 .45)',
      contour: 'M-17 12v-8h3V-6h5v-12h4M11 12V4h4v-17h-3',
      detail: 'M-4 -28h6v1h-6M-13 -6h3v1h-3',
      motion: 'lift',
    },
    {
      primary: 'translate(0 6) scale(.7 .44)',
      contour: 'M-39 8q8-17 16-7t17 0 17 0 19-3M-34 14q8-9 16-3t17 0 25-2',
      detail: 'M-27 -1h9M7 -2h9M-4 11h10',
      motion: 'wave',
    },
    {
      primary: 'translate(-28 0) scale(.57 .7)',
      secondary: 'translate(28 0) scale(.57 .7)',
      contour: 'M-9 -14l-7 24M9 -14l7 24M-7 17h14',
      detail: 'M0 -17v29M-3 18h6v1h-6',
      motion: 'open',
    },
    {
      primary: 'translate(-18 -2) scale(.58 .52)',
      contour: 'M-14 0q17-12 36-1t27-4M-9 6q14-4 28 2t25-2M0 14h12v-2h18',
      detail: 'M21 -4h9M32 5h12M42 -8h6',
      motion: 'thread',
    },
    {
      primary: 'translate(-17 -9) scale(.55 .35)',
      secondary: 'translate(8 5) scale(.8 .38)',
      contour: 'M-36 4h14v4h24v4h27v5h21M-22 16H1v4h28',
      detail: 'M-27 -9h12M-4 3h22M24 14h14',
      motion: 'terrace',
    },
  ],
  halo: [
    {
      primary: 'scale(.55)',
      contour: 'M-25 -4a26 18 0 0 1 40-13M24 5a26 18 0 0 1-42 10',
      detail: 'M-28 -2h5M23 3h5M-18 -17h2v2h-2',
      motion: 'shear',
    },
    {
      primary: 'translate(-10 -4) scale(.62)',
      secondary: 'translate(11 5) scale(.45)',
      contour: 'M-30 0a22 13 0 1 1 44 0a22 13 0 1 1-44 0M-12 9a21 12 0 1 0 42 0',
      detail: 'M-28 -5h2v2h-2M28 6h2v2h-2',
      motion: 'lift',
    },
    {
      primary: 'scale(.72)',
      contour: 'M-27 0a27 15 0 1 0 54 0a27 15 0 1 0-54 0M-35 0a35 21 0 1 1 70 0a35 21 0 1 1-70 0',
      detail: 'M-24 -12h8M17 17h8M-8 -21H8',
      motion: 'wave',
    },
    {
      primary: 'scale(.65)',
      contour: 'M-38 0h14M24 0h14M0-30v12M0 18v12M-24-20l8 7M16 13l8 7M-24 20l8-7M16-13l8-7',
      detail: 'M-29 -24h2v2h-2M27 22h2v2h-2M-2 -34h4v1h-4',
      motion: 'open',
    },
    {
      primary: 'translate(0 -8) scale(.65)',
      secondary: 'translate(0 19) scale(.8 -.25)',
      contour: 'M-31 14q31-11 62 0M-23 24q23 5 46 0M-9 28H9',
      detail: 'M-6 10H6M-16 20h5M11 20h5',
      motion: 'thread',
    },
    {
      primary: 'scale(.5)',
      contour: 'M-34 0q17-25 34 0t34 0q-17 25-34 0t-34 0M-34 0q17 25 34 0t34 0q-17-25-34 0t-34 0',
      detail: 'M-2 -2h4v4h-4M-33 -1h2v2h-2M31 -1h2v2h-2',
      motion: 'terrace',
    },
  ],
  flow: [
    {
      primary: 'scale(.55 .65)',
      contour: 'M-42-8q21 25 42 0t42 0M-42 8q21-25 42 0t42 0',
      detail: 'M-21 -2h3v3h-3M20 -2h3v3h-3',
      motion: 'shear',
    },
    {
      primary: 'scale(.5 .72)',
      contour: 'M-18 22q8-23 0-45M0 28q8-29 0-61M18 22q8-23 0-45',
      detail: 'M-17 -12v8M1 -23v10M19 0v7',
      motion: 'lift',
    },
    {
      primary: 'rotate(-18) scale(.45 .58)',
      contour: 'M-40 0q10-22 20 0t20 0 20 0 20 0M-40 0q10 22 20 0t20 0 20 0 20 0',
      detail: 'M-31 -8h4M9 8h4M29 -8h4',
      motion: 'wave',
    },
    {
      primary: 'translate(0 5) scale(.47 .57)',
      contour: 'M0 24L-36-18M0 24L-19-28M0 24V-32M0 24L19-28M0 24L36-18M-36-18q36 15 72 0',
      detail: 'M-20 -23h3M-1 -30h3M18 -23h3',
      motion: 'open',
    },
    {
      primary: 'scale(.48 .55)',
      contour:
        'M-44 0q11-17 22 0t22 0 22 0 22 0M-44 0q11 17 22 0t22 0 22 0 22 0M-22-7V7M0-7V7M22-7V7',
      detail: 'M-24 -1h4v2h-4M-2 -1h4v2h-4M20 -1h4v2h-4',
      motion: 'thread',
    },
    {
      primary: 'scale(.6 .33)',
      contour: 'M-52 -5q26-9 52 0t52 0M-52 1q26-9 52 0t52 0M-52 7q26-9 52 0t52 0',
      detail: 'M-31 -8h12M22 10h15M-3 -2H5',
      motion: 'terrace',
    },
  ],
  terrain: [
    {
      primary: 'translate(0 -1) scale(.58)',
      contour: 'M-35 15h11V9h11V3H-2v-6H9v-6h11v-6h11M-24 15V9M-13 9V3M-2 3v-6M9-3v-6',
      detail: 'M-21 8h5M2-4H6M24-16h4',
      motion: 'shear',
    },
    {
      primary: 'translate(0 4) scale(.75 .45)',
      contour: 'M-42 10l9-4 13 2 12-6 11 5 15-4 22 7M-39 14l12-2 17 3 13-2 20 2',
      detail: 'M-34 5h3M-9 1h4M20 3h4',
      motion: 'lift',
    },
    {
      primary: 'scale(.58)',
      contour:
        'M-13 8a13 4 0 1 1 26 0a13 4 0 1 1-26 0M-25 9a25 7 0 1 0 50 0a25 7 0 1 0-50 0M-37 10q37 17 74 0',
      detail: 'M-9 4h3M20 11h5M-29 14h5',
      motion: 'wave',
    },
    {
      primary: 'translate(-11 0) scale(.63)',
      contour: 'M-42 13q12-16 25-8T9 1t27-10M-34 19q12-12 25-8T17 6t26-8',
      detail: 'M-28 6h5M0 2H5M27 -6h5',
      motion: 'open',
    },
    {
      primary: 'translate(-15 4) scale(.48)',
      secondary: 'translate(20 -3) scale(.62)',
      contour: 'M-29 12l5-9 4 9M-11 14l3-6 4 6M11 7l5-10 6 10M26 12l4-7 5 7',
      detail: 'M-25 2h2v2h-2M15 -4h2v2h-2M29 4h2v2h-2',
      motion: 'thread',
    },
    {
      primary: 'translate(0 3) scale(.5)',
      contour: 'M0 14L-28 -1M0 14L-17-12M0 14V-18M0 14L17-12M0 14L28-1',
      detail: 'M-29 -2h3v1h-3M-18 -13h3v1h-3M-1 -19h2v2h-2M16 -13h3v1h-3M27 -2h3v1h-3',
      motion: 'terrace',
    },
  ],
  trail: [
    {
      primary: 'translate(10 -3) scale(.62)',
      secondary: 'translate(-10 7) rotate(160) scale(.48)',
      contour: 'M-37 12L30-12M-32-10L30 14',
      detail: 'M-22 6h3M20 9h3',
      motion: 'shear',
    },
    {
      primary: 'translate(7 -9) rotate(-28) scale(.7)',
      contour: 'M-35 13q46 6 54-12t-24-16-14 24 17-5',
      detail: 'M-26 14h4M18 -6h2v2h-2',
      motion: 'lift',
    },
    {
      primary: 'translate(18 -12) rotate(-14) scale(.6)',
      secondary: 'translate(21 14) rotate(24) scale(.46)',
      contour: 'M-40 0q28 0 57-17M-40 0q28 0 57 17',
      detail: 'M-25 -1h3v2h-3M0 -9h3M3 9h3',
      motion: 'wave',
    },
    {
      primary: 'translate(15 0) scale(.68)',
      contour: 'M-29 0L25-24M-29 0L34-12M-29 0H38M-29 0L34 12M-29 0L25 24',
      detail: 'M25 -25h3v2h-3M36 -1h3v2h-3M25 23h3v2h-3',
      motion: 'open',
    },
    {
      primary: 'translate(17 -5) rotate(-8) scale(.7)',
      contour: 'M-42 0q14-22 28 0t28 0 28 0M-37 7q14-16 28 0t28 0',
      detail: 'M-29 -11h3M0 11h3M28 -11h3',
      motion: 'thread',
    },
    {
      primary: 'translate(24 -11) rotate(-13) scale(.68)',
      contour: 'M-46 20Q-5-26 43-8M-39 22Q-1-16 36-7',
      detail: 'M-32 7h3M-16 -4h2M1 -11h2',
      motion: 'terrace',
    },
  ],
  spark: [
    {
      primary: 'translate(-7 -3) scale(.7)',
      secondary: 'translate(8 4) scale(.45)',
      contour: 'M-7 4q8 8 15-5',
      detail: 'M-14 -8h1v1h-1M13 9h1v1h-1',
      motion: 'shear',
    },
    {
      primary: 'translate(10 0) scale(.55)',
      contour: 'M-13 0a13 7 0 1 1 26 0a13 7 0 1 1-26 0',
      detail: 'M-14 -1h2v2h-2M-1 -8h2v2h-2M-1 6h2v2h-2',
      motion: 'lift',
    },
    {
      primary: 'scale(.68)',
      secondary: 'translate(11 -8) scale(.32)',
      contour: 'M-12 5l11-6 12-7M-1-1L7 10',
      detail: 'M-13 4h2v2h-2M6 9h2v2H6M-9 -9h1v1h-1',
      motion: 'wave',
    },
    {
      primary: 'translate(4 8) scale(.55)',
      contour: 'M-10 -18l7 15M1-22l8 14M-5 0l9 19',
      detail: 'M-7 -12h1v3h-1M7 -10h1v2H7M1 10h1v4H1',
      motion: 'open',
    },
    {
      primary: 'translate(5 -8) scale(.62)',
      contour: 'M-10 16q22-2 20-17t-18-5 9-8',
      detail: 'M-10 15h2v2h-2M8 0h2v2H8M-7 -8h1v1h-1',
      motion: 'thread',
    },
    {
      primary: 'scale(.52)',
      contour: 'M0-4q-11-16-7-1-17-6 2 7-9 15 7 2 17 9 4-6 14-8-1-6 0-15-5 4z',
      detail: 'M-1 -15h2v2h-2M12 -5h2v2h-2M7 10h2v2H7M-10 8h2v2h-2M-14 -6h2v2h-2',
      motion: 'terrace',
    },
  ],
};

export function observatoryVariationPlacement(
  event: ObservatoryEvent,
  index: number,
  point: { x: number; y: number },
) {
  if (!event.spec.variant) return point;
  const family = families[event.spec.baseId];
  // Keep sun/moon optical phenomena attached to their original light source.
  if (family === 'halo') return point;
  const v = event.spec.variant;
  const reach = event.spec.ground ? 4 : 13;
  return {
    x: Math.max(24, Math.min(936, point.x + Math.sin(index * 1.71 + v) * reach)),
    y: Math.max(
      event.spec.ground ? 196 : -80,
      Math.min(event.spec.ground ? 287 : 184, point.y + Math.cos(index * 1.23 + v) * reach * 0.5),
    ),
  };
}

/** One static composition per active event; particles reference it with SVG use. */
export function ObservatoryEventVariationSymbol({
  event,
  children,
}: {
  event: ObservatoryEvent;
  children: ReactNode;
}) {
  if (!event.spec.variant) return children;
  const recipe = recipes[families[event.spec.baseId]][event.spec.variant - 1];
  return (
    <>
      <g transform={recipe.primary}>{children}</g>
      {recipe.secondary && (
        <g transform={recipe.secondary} opacity=".64">
          {children}
        </g>
      )}
      <path d={recipe.contour} className="evt-variation-contour" />
      <path d={recipe.detail} className="evt-variation-detail" />
    </>
  );
}

export function ObservatoryEventVariation({
  event,
  index,
  symbolId,
}: {
  event: ObservatoryEvent;
  index: number;
  symbolId: string;
}) {
  const { baseId, variant } = event.spec;
  if (!variant) return null;
  const family = families[baseId];
  const recipe = recipes[family][variant - 1];
  return (
    <g
      data-event-composition={`${family}:${variant}`}
      className={`evt-variation evt-variation--${recipe.motion}`}
      style={
        {
          animationDelay: `${-index * 2.731}s`,
          '--obs-variation-detail': 0.22 + event.chroma * 0.42,
        } as CSSProperties
      }
    >
      <use href={`#${symbolId}`} />
    </g>
  );
}
