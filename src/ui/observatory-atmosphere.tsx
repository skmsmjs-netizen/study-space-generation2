import { useId } from 'react';
import type { ObservatoryEvolution } from '../domain/observatory-evolution';
import { landscapeSeed } from '../domain/study-landscape';

// Integer, one-unit contours: finer clusters without increasing the number of animated nodes.
export function pixelDiscPath(radius: number) {
  const points = Array.from({ length: Math.max(96, radius * 12) }, (_, index) => {
    const angle = (index * Math.PI * 2) / Math.max(96, radius * 12);
    return [Math.round(Math.cos(angle) * radius), Math.round(Math.sin(angle) * radius)];
  });
  return (
    points.map(([x, y], index) => `${index ? 'H' : 'M'}${x}${index ? 'V' : ' '}${y}`).join('') + 'z'
  );
}
function wispPath(offset: number, thickness: number, phase: number) {
  const edge = Array.from({ length: 241 }, (_, index) => {
    const x = index * 4;
    const y = Math.round(offset + 22 * Math.sin(x / 177 + phase) + 7 * Math.sin(x / 47 + phase));
    return { x, y };
  });
  return (
    `M0 ${edge[0].y}` +
    edge
      .slice(1)
      .map((p) => `H${p.x}V${p.y}`)
      .join('') +
    edge
      .slice()
      .reverse()
      .map((p) => `H${p.x}V${p.y + thickness}`)
      .join('') +
    'z'
  );
}
function terrainPath(offset: number, amplitude: number, phase: number) {
  return (
    `M0 260V${offset}` +
    Array.from({ length: 241 }, (_, index) => {
      const x = index * 4;
      const y = Math.round(
        offset + Math.sin(x / 69 + phase) * amplitude + Math.sin(x / 19 + phase) * 3,
      );
      return `H${x}V${y}`;
    }).join('') +
    'V260z'
  );
}
export const fineDistantMountain = terrainPath(198, 12, 0);
export const fineNearMountain = terrainPath(213, 8, 2);
export const fineMoon = pixelDiscPath(17);
export const fineDome =
  'M3 28' +
  Array.from({ length: 59 }, (_, index) => {
    const x = index + 3;
    return `H${x}V${Math.round(27 - Math.sqrt(Math.max(0, 29 ** 2 - (x - 32) ** 2)))}`;
  }).join('') +
  'V28z';
const wisps = Array.from({ length: 9 }, (_, index) => ({
  key: `wisp-${index}`,
  path: wispPath(76 + index * 6, 3 + (index % 3), index * 0.14),
}));
const ribbons = [wispPath(48, 1, 0.9), wispPath(53, 2, 1), wispPath(57, 1, 1.1)];
const dust = Array.from({ length: 480 }, (_, index) => {
  const seed = landscapeSeed(`fine-nebula-${index}`);
  const x = seed % 960;
  const y = Math.round(95 + 22 * Math.sin(x / 177 + 0.6) + ((seed >>> 12) % 43) - 21);
  return `M${x} ${y}h1v1h-1z`;
}).join('');
const grass = Array.from({ length: 180 }, (_, index) => {
  const seed = landscapeSeed(`observatory-grass-${index}`);
  const x = seed % 960,
    y = 220 + ((seed >>> 9) % 34);
  return `M${x} ${y}h${1 + (seed % 3)}v1h-${1 + (seed % 3)}z`;
}).join('');
const domeTiles = Array.from({ length: 45 }, (_, index) => {
  const x = 9 + (index % 9) * 5,
    y = 6 + Math.floor(index / 9) * 4;
  return Math.hypot(x - 32, y - 27) < 27 ? `M${x} ${y}h2v1h-2z` : '';
}).join('');
const waveContour = pixelDiscPath(640);

export function ObservatoryClouds({ evolution: e }: { evolution: ObservatoryEvolution }) {
  return (
    <>
      <g className="pixel-cover-clouds" opacity={e.nebula * 0.38} data-fine-atmosphere="true">
        {wisps.map((wisp, index) => (
          <path
            key={wisp.key}
            d={wisp.path}
            className={index % 3 ? 'pixel-nebula-rose' : 'pixel-nebula-violet'}
            opacity={0.18 + (index % 3) * 0.12}
          />
        ))}
        <path d={dust} className="pixel-rose" opacity=".45" />
      </g>
      <g opacity={e.lightRibbons * 0.32}>
        <g className="pixel-light-ribbons">
          {ribbons.map((path, index) => (
            <path key={path} d={path} className={index === 1 ? 'pixel-rose' : 'pixel-mint'} />
          ))}
        </g>
      </g>
    </>
  );
}

export function ObservatoryGroundDetails() {
  return <path d={grass} className="pixel-ground-reflection" opacity=".18" pointerEvents="none" />;
}
export function ObservatoryDomeTiles() {
  return <path d={domeTiles} className="pixel-building-rim" opacity=".35" pointerEvents="none" />;
}

export function ObservatoryShockwave({ echo }: { echo: boolean }) {
  const id = useId();
  return (
    <g data-supernova-wave="true" pointerEvents="none">
      <defs>
        <path id={id} d={waveContour} />
      </defs>
      <g opacity=".18">
        <use href={`#${id}`} className="pixel-shockwave-haze" />
      </g>
      <use href={`#${id}`} className="pixel-shockwave-front" data-wave-radius="640" />
      <use href={`#${id}`} className="pixel-shockwave-front pixel-shockwave-front--peach" />
      {echo && (
        <use href={`#${id}`} className="pixel-shockwave-front pixel-shockwave-front--echo" />
      )}
    </g>
  );
}
