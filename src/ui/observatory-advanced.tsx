import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import type { StudyLandscape } from '../domain/study-landscape';
import { landscapeSeed } from '../domain/study-landscape';
import {
  connectObservatoryGPU,
  type ObservatoryGPUConnection,
  type ObservatoryRenderState,
} from './observatory-gpu';
import { observatoryParticleOpacity } from '../domain/observatory-events';
import './observatory-advanced.css';

const filaments = Array.from({ length: 12 }, (_, i) => {
  const y = 90 + i * 10;
  return `M85 ${y}q90 ${-23 + i * 3} 180 4t180 -7t180 6t180 -5`;
});
const grains = Array.from({ length: 32 }, (_, i) => {
  const seed = landscapeSeed(`lod-${i}`);
  return { key: `lod-${i}`, x: 50 + (seed % 860), y: 20 + ((seed >>> 11) % 245) };
});
const resolvedSystems = [
  { kind: 'binary', x: 178, y: 66 },
  { kind: 'galaxy', x: 344, y: 126 },
  { kind: 'cloud', x: 605, y: 75 },
  { kind: 'binary', x: 745, y: 156 },
  { kind: 'galaxy', x: 826, y: 48 },
  { kind: 'cloud', x: 230, y: 220 },
  { kind: 'binary', x: 474, y: 48 },
  { kind: 'cloud', x: 882, y: 233 },
] as const;
const spiralArms = Array.from({ length: 64 }, (_, i) => {
  const arm = i % 2,
    step = Math.floor(i / 2),
    radius = 2 + step * 0.58;
  const angle = step * 0.17 + arm * Math.PI;
  const x = Math.round(Math.cos(angle) * radius * 2) / 2;
  const y = Math.round(Math.sin(angle) * radius * 0.55 * 2) / 2;
  return `M${x} ${y}h.7v.7h-.7z`;
}).join('');

/** Shared real home/gallery layer; zoom LOD never changes the study growth stage. */
export function ObservatoryAdvanced({ world, night }: { world: StudyLandscape; night: number }) {
  const canvas = useRef<HTMLCanvasElement>(null),
    clock = useRef({ time: 0 });
  const renderState = useRef<ObservatoryRenderState>({});
  const localFilter = useId();
  const connection = useRef<ObservatoryGPUConnection | null>(null);
  const model = useRef({ world, night });
  const group = useRef<SVGGElement>(null);
  const [onScreen, setOnScreen] = useState(typeof IntersectionObserver === 'undefined');
  useEffect(() => {
    model.current = { world, night };
    connection.current?.update?.(world, night);
  }, [world, night]);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver((entries) =>
      setOnScreen(entries[0]?.isIntersecting ?? false),
    );
    const root = group.current?.closest('.study-landscapes');
    if (root) observer.observe(root);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const node = canvas.current,
      root = node?.closest<HTMLElement>('.study-landscapes');
    if (!onScreen || !node || !root) return;
    const control = connectObservatoryGPU(
      node,
      root,
      model.current.world,
      model.current.night,
      clock.current,
      renderState.current,
    );
    connection.current = control;
    return () => {
      control();
      if (connection.current === control) connection.current = null;
    };
  }, [onScreen]);
  const growth = world.evolution.position / 11;
  return (
    <g
      ref={group}
      data-advanced-observatory="true"
      style={{ '--obs-growth': growth } as CSSProperties}
    >
      <foreignObject x="0" y="-100" width="960" height="320" className="obs-gpu-surface">
        {onScreen && <canvas ref={canvas} className="obs-gpu-canvas" />}
      </foreignObject>
      <g className="obs-lod-middle" data-lod-layer="1" transform="translate(0 -100)">
        <g data-curl-fallback="true">
          {filaments.map((d, i) => (
            <path
              key={d}
              d={d}
              className={i % 3 ? 'obs-flow-thread' : 'obs-flow-thread obs-flow-thread--cool'}
              opacity={0.07 + 0.22 * growth}
            />
          ))}
        </g>
      </g>
      <g className="obs-lod-close" data-lod-layer="2" transform="translate(0 -100)">
        <g data-curl-fallback="true">
          {grains.map((p, i) => (
            <g
              key={p.key}
              transform={`translate(${p.x} ${p.y})`}
              opacity={observatoryParticleOpacity(
                5 + 22 * growth + 5 * world.dynamics.recent[0],
                i,
              )}
            >
              <path
                d={i % 6 ? 'M0 0h.5v.5H0z' : 'M0 -1.5h.5v1.5H2v.5H.5V2H0V.5h-1.5V0H0z'}
                className="obs-flow-grain"
              />
              {i % 6 === 0 && (
                <path d="M-2 -2h4v4h-4z" className="obs-selective-glow" opacity=".12" />
              )}
            </g>
          ))}
        </g>
        <defs>
          <filter id={localFilter} x="-15%" y="-20%" width="130%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency=".08"
              numOctaves="1"
              seed="17"
              result="local-flow"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="local-flow"
              scale="0"
              data-flow-displacement="true"
            />
          </filter>
        </defs>
        {resolvedSystems.map((system, index) => (
          <g
            key={system.x}
            transform={`translate(${system.x} ${system.y})`}
            opacity={0.24 + 0.52 * growth}
            data-resolved-system={system.kind}
          >
            {system.kind === 'binary' ? (
              <>
                <path d="M-12 0l4-5h16l4 5-4 5H-8z" className="obs-detail-orbit" />
                <g className="obs-binary-pair" style={{ animationDelay: `${-index * 2.3}s` }}>
                  <path
                    d="M-9 -2h1v1h1v1h-1v1h-1V0h-1v-1h1M8 0h1v1h1v1H9v1H8V2H7V1h1"
                    className="obs-binary-stars"
                  />
                </g>
              </>
            ) : system.kind === 'galaxy' ? (
              <g className="obs-resolved-galaxy" style={{ animationDelay: `${-index * 4.1}s` }}>
                <path d={spiralArms} className="obs-galaxy-arm" />
                <path d="M-1 -2h2v1h1v2H1v1h-2V1h-1v-2h1z" className="obs-galaxy-core" />
              </g>
            ) : (
              <g className="obs-nebula-knot">
                <path
                  d="M-18 3l5-7 7 1 4-7 8 2 2 6 9 2-2 7-12 2-9-2-9 2z"
                  className="obs-knot-cloud"
                  filter={`url(#${localFilter})`}
                />
                <path d="M-13 2l7-2 4-4 7 2 3 5M-4 7l7-1 6-3" className="obs-knot-edge" />
              </g>
            )}
          </g>
        ))}
      </g>
    </g>
  );
}
