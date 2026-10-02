import { useId } from 'react';
import type { ObservatoryEvolution } from '../domain/observatory-evolution';
import { pixelDiscPath } from './observatory-atmosphere';

const planetOutline = pixelDiscPath(22);
const rim = pixelDiscPath(28);
const dither = Array.from({ length: 24 }, (_, i) => ({
  key: `planet-speck-${i}`,
  x: -18 + (i % 6) * 7,
  y: -16 + Math.floor(i / 6) * 10,
}));
const rays = Array.from({ length: 12 }, (_, i) => ({ key: `corona-ray-${i}`, angle: i * 30 }));

/** Celestial ornament amplitudes come from the same canonical input engine as the main scene. */
export function ObservatorySkyDetails({ evolution: e }: { evolution: ObservatoryEvolution }) {
  const id = useId();
  return (
    <>
      {e.satellite > 0 && (
        <g opacity={e.satellite * 0.7} data-celestial-detail="satellite">
          <g transform="translate(-95 45)">
            <g className="pixel-detail-satellite">
              <path d="M-4 -3h8v6h-8M-14 -4h7v8h-7M7 -4h7v8H7" className="pixel-blue" />
              <path d="M-2 -1h4v2h-4M0 -7h1v4H0" className="pixel-gold" />
              <path d="M-12 -3v6M-9 -3v6M9 -3v6M12 -3v6" className="pixel-detail-grid" />
            </g>
          </g>
        </g>
      )}
      {e.planet > 0 && (
        <g transform="translate(-42 87)" opacity={e.planet} data-celestial-detail="planet">
          <defs>
            <clipPath id={id}>
              <path d={planetOutline} />
            </clipPath>
          </defs>
          <path
            d="M-37 -6h12v-3h14v-2h22v2h14v3h12v8h-12v3H11v2h-22V5h-14V2h-12z"
            className="pixel-detail-ring"
            opacity=".35"
          />
          <path d={planetOutline} className="pixel-detail-planet" />
          <g clipPath={`url(#${id})`}>
            <g className="pixel-detail-cloudbands">
              <path
                d="M-32 -13h17v-3H8v4h30v4H6v2h-21v-3h-17zM-30 4h21V1h25v5h20v5H14V8H-9v3h-21z"
                className="pixel-rose"
                opacity=".75"
              />
              <path d="M-32 -2h64v3h-64M-32 15h64v2h-64" className="pixel-gold" opacity=".5" />
              {dither.map((p) => (
                <rect
                  key={p.key}
                  x={p.x}
                  y={p.y}
                  width="2"
                  height="1"
                  className="pixel-gold"
                  opacity=".3"
                />
              ))}
            </g>
            <path
              d="M0 -28h36v56H0v-7H-6v-8h-5V1h-3v-9h6v-8H0z"
              className="pixel-night"
              opacity=".58"
            />
          </g>
          <path
            d="M-37 -2v5h12v3h14v3h22V6h14V3h12v-5H25v3H11v3h-22V1h-14v-3z"
            className="pixel-detail-ring"
          />
          <path d="M-10 -21h13v1h-13M-18 -14h4v1h-4" className="pixel-gold" opacity=".65" />
        </g>
      )}
      {e.eclipse > 0 && (
        <g transform="translate(237 70)" opacity={e.eclipse} data-celestial-detail="eclipse">
          <g className="pixel-detail-corona">
            <path d={rim} className="pixel-detail-ring" opacity=".2" />
            {rays.map((r) => (
              <g key={r.key} transform={`rotate(${r.angle})`}>
                <path d="M-1 -34h2v8h-2" className="pixel-gold" opacity=".5" />
              </g>
            ))}
          </g>
          <g className="pixel-detail-occultation">
            <path d={pixelDiscPath(17)} className="pixel-night" />
            <path d="M-8 -17h16v1H-8M-14 -10h1v5h-1" className="pixel-rose" opacity=".8" />
          </g>
        </g>
      )}
      {e.crown > 0 && (
        <g transform="translate(168 88)" opacity={e.crown * 0.22} data-celestial-detail="crown">
          <g className="pixel-detail-crown">
            {rays.map((r) => (
              <g key={r.key} transform={`rotate(${r.angle})`}>
                <path
                  d="M-1 -48h2v11h-2M-2 -67h4v3h-4"
                  className={r.angle % 60 ? 'pixel-gold' : 'pixel-rose'}
                />
              </g>
            ))}
          </g>
        </g>
      )}
    </>
  );
}

/** Fixed pixel clusters keep the silhouette readable; only the light uses the current scene palette. */
export function ObservatoryStationDetails({ evolution: e }: { evolution: ObservatoryEvolution }) {
  return (
    <g data-station-details="true" pointerEvents="none">
      <g opacity=".5">
        <path
          d="M8 32h9v1H8M23 32h8v1h-8M38 32h9v1h-9M52 32h7v1h-7M4 36h8v1H4M18 36h9v1h-9M33 36h9v1h-9M48 36h9v1h-9M5 55h16v1H5M43 55h14v1H43"
          className="pixel-building-rim"
        />
        <path
          d="M9 27h1v11H9M24 27h1v11h-1M39 27h1v11h-1M54 27h1v11h-1"
          className="pixel-building-roof-shadow"
        />
      </g>
      <path
        d="M8 43h11v1H8M46 43h11v1H46M13 44h1v8h-1M50 44h1v8h-1M11 47h6v1h-6M48 47h6v1h-6M26 42h13v1H26M30 46h1v9h-1M34 51h1v1h-1"
        className="pixel-building-rim"
      />
      <path d="M25 58h15v2H25M22 61h21v2H22M18 64h29v2H18" className="pixel-building-roof-shadow" />
      <path
        d="M15 12h4v1h-4M21 7h5v1h-5M37 6h3v1h-3M46 12h4v1h-4M53 20h5v1h-5M5 25h55v1H5"
        className="pixel-building-rim"
        opacity=".7"
      />
      <g opacity={0.2 + 0.6 * e.colorBloom}>
        <g className="pixel-time-lamp">
          <g className="pixel-detail-windowglow">
            <path d="M11 49h6v3h-6M48 49h6v3h-6M28 45h8v2h-8" className="pixel-gold" />
            <path d="M11 61h7v1h-7M47 61h7v1h-7" className="pixel-rose" />
          </g>
        </g>
      </g>
      <g transform="translate(50 -11)">
        <path d="M-1 -9h2V1h-2M-4 -4h8v1h-8" className="pixel-building-rim" />
        <g className="pixel-time-lamp">
          <rect x="-1" y="-10" width="2" height="2" className="pixel-gold pixel-detail-beacon" />
        </g>
      </g>
      <g transform="translate(-15 53)">
        <path d="M-1 0h2v12h-2M-4 -3h8v3h-8M-3 12h6v1h-6" className="pixel-building-rim" />
        <path d="M-2 -2h4v3h-4" className="pixel-window" />
        <path
          d="M-3 2h6v3h4v4H-7V5h4z"
          className="pixel-ground-reflection"
          opacity={0.12 + 0.16 * e.colorBloom}
        />
      </g>
    </g>
  );
}
