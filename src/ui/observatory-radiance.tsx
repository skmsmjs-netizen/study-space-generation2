import { useId, type CSSProperties } from 'react';
import type { StudyLandscape } from '../domain/study-landscape';
import { observatoryParticleOpacity } from '../domain/observatory-events';
import { pixelDiscPath } from './observatory-atmosphere';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
};
/** Display policy: reuse the observed-input engine, never simulate loading or learning progress. */
export function observatoryRadiance(world: StudyLandscape) {
  const q = world.evolution.position,
    growth = q / 11;
  const [activity, diversity, returns] = world.dynamics.recent;
  const change = Math.abs(world.dynamics.change[0]);
  return {
    rays: 6 + 36 * growth + 6 * activity,
    beacons: 2 + 8 * growth + 2 * returns,
    spread: 0.44 + 0.9 * growth + 0.1 * diversity,
    brightness: 0.3 + 0.42 * growth + 0.2 * activity,
    breath: 15 - 5 * activity - 3 * growth,
    revolution: 142 - 54 * growth - 24 * activity,
    pulse: 1.025 + 0.065 * growth + 0.04 * change,
    halo: ease((q - 0.5) / 3),
    counter: ease((q - 2) / 3),
    filaments: ease((q - 4) / 4),
    echo: ease((q - 7) / 4),
    warmth: 22 + 50 * growth + 18 * activity,
  };
}
type Radiance = ReturnType<typeof observatoryRadiance>;
const radianceStyle = (p: Radiance): CSSProperties =>
  ({
    '--obs-rad-spread': p.spread,
    '--obs-rad-breath': `${p.breath}s`,
    '--obs-rad-revolution': `${p.revolution}s`,
    '--obs-rad-pulse': p.pulse,
    '--obs-rad-color': `color-mix(in oklch, var(--obs-coral) ${p.warmth}%, var(--obs-gold))`,
  }) as CSSProperties;

// Hoisted one-unit contours; rendering only changes bounded weights and transform variables.
function rayPath(index: number, radius: number, length: number, width: number) {
  const angle = (((index * 17) % 48) * Math.PI) / 24;
  const points = [
    [radius, -width],
    [radius + length - 3, -width],
    [radius + length - 3, -width / 2],
    [radius + length, -width / 2],
    [radius + length, width / 2],
    [radius + length - 3, width / 2],
    [radius + length - 3, width],
    [radius, width],
  ];
  return (
    points
      .map(
        ([x, y], i) =>
          `${i ? 'L' : 'M'}${Math.round(x * Math.cos(angle) - y * Math.sin(angle))} ${Math.round(x * Math.sin(angle) + y * Math.cos(angle))}`,
      )
      .join('') + 'z'
  );
}
const rays = Array.from({ length: 48 }, (_, i) => ({
  id: `radiant-${i}`,
  d: rayPath(i, 14 + (i % 3), 18 + (i % 5) * 4, i % 4 === 0 ? 2 : 1),
}));
const counterRays = Array.from({ length: 24 }, (_, i) => ({
  id: `counter-${i}`,
  d: rayPath(i * 2, 43, 4 + (i % 3) * 2, 1),
}));
const circles = [24, 36, 54, 72].map(pixelDiscPath);
const filaments = Array.from({ length: 6 }, (_, arm) => {
  const points = Array.from({ length: 50 }, (_, i) => {
    const t = i / 49,
      angle = (arm * Math.PI) / 3 + t * 1.8,
      radius = 22 + t * 61;
    return `${i ? 'L' : 'M'}${Math.round(Math.cos(angle) * radius)} ${Math.round(Math.sin(angle) * radius * 0.72)}`;
  });
  return { id: `filament-${arm}`, d: points.join('') };
});
const heart = 'M-2 -7h4v4h3v1h2v4H5v1H2v4h-4V3h-3V2h-2v-4h2v-1h3z';

export function ObservatoryRadiance({ world }: { world: StudyLandscape }) {
  const p = observatoryRadiance(world);
  const bloom = useId();
  return (
    <g
      transform="translate(168 88)"
      data-radiance-stage={world.evolution.stage}
      style={radianceStyle(p)}
    >
      <defs>
        <filter
          id={bloom}
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation={0.4 + world.evolution.colorBloom * 1.1} result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g className="obs-rad-envelope" opacity={p.brightness}>
        <g opacity={p.halo * 0.3} data-radiance-layer="halos">
          {circles.map((d, i) => (
            <g
              key={d}
              className="obs-rad-halo"
              style={{ animationDelay: `${(-i * p.breath) / 4}s` }}
            >
              <path
                d={d}
                className={i % 2 ? 'obs-rad-cool-line' : 'obs-rad-warm-line'}
                opacity={1 - i * 0.18}
              />
            </g>
          ))}
        </g>
        <g
          className="obs-rad-filaments"
          opacity={p.filaments * 0.45}
          data-radiance-layer="filaments"
        >
          {filaments.map((line, i) => (
            <path
              key={line.id}
              d={line.d}
              className={i % 2 ? 'obs-rad-cool-line' : 'obs-rad-warm-line'}
            />
          ))}
        </g>
        <g className="obs-rad-turn" data-radiance-layer="starburst" data-radiance-rays={p.rays}>
          {rays.map((ray, i) => (
            <path
              key={ray.id}
              d={ray.d}
              opacity={observatoryParticleOpacity(p.rays, i) * (i % 3 === 0 ? 0.88 : 0.55)}
              className={i % 4 === 0 ? 'obs-rad-white' : 'obs-rad-warm'}
              data-radiance-ray={i}
            />
          ))}
        </g>
        <g opacity={p.counter * 0.6} data-radiance-layer="counter-crown">
          <g className="obs-rad-counter">
            {counterRays.map((ray, i) => (
              <path key={ray.id} d={ray.d} className={i % 3 ? 'obs-rad-warm' : 'obs-rad-cool'} />
            ))}
          </g>
        </g>
        <g opacity={p.echo * 0.28} data-radiance-layer="echoes">
          {[0, 1, 2].map((i) => (
            <g
              key={i}
              className="obs-rad-echo"
              style={{ animationDelay: `${(-i * p.breath) / 3}s` }}
            >
              <path d={circles[3]} className={i % 2 ? 'obs-rad-cool-line' : 'obs-rad-warm-line'} />
            </g>
          ))}
        </g>
      </g>
      <g className="obs-rad-heart" data-radiance-layer="heart" filter={`url(#${bloom})`}>
        <path d={circles[0]} className="obs-rad-warm" opacity={0.035 + p.halo * 0.04} />
        <path d={heart} className="obs-rad-warm" opacity=".7" />
        <path d="M-1 -4h2v3h3v2H1v3h-2V1h-3v-2h3z" className="obs-rad-white" />
        <path d="M0 -1h1v1H0" className="obs-rad-cool" />
      </g>
    </g>
  );
}

const beaconStones = Array.from({ length: 12 }, (_, i) => ({
  id: `guide-${i}`,
  x: 309 + i * 30,
  y: 249 + Math.round(Math.sin(i * 0.54) * 14),
}));
export function ObservatoryRadianceGround({ world }: { world: StudyLandscape }) {
  const p = observatoryRadiance(world);
  return (
    <g data-radiance-ground="true" style={radianceStyle(p)} opacity={0.4 + p.brightness * 0.35}>
      {beaconStones.map((stone, i) => (
        <g
          key={stone.id}
          transform={`translate(${stone.x} ${stone.y})`}
          opacity={observatoryParticleOpacity(p.beacons, i)}
        >
          <path d="M-5 1h10v2H-5M-3 3h7v1h-7" className="obs-rad-stone" />
          <g className="obs-rad-beacon" style={{ animationDelay: `${(-i * p.breath) / 12}s` }}>
            <path d="M-5 -1h10v1H-5M-3 -2h6v1h-6" className="obs-rad-warm" opacity=".24" />
            <path d="M-1 -2h2v2h-2" className="obs-rad-white" />
            <path d="M-2 5h5v1h-5" className="obs-rad-warm" opacity=".18" />
          </g>
        </g>
      ))}
    </g>
  );
}
