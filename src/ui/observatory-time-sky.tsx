import { useId } from 'react';
import type { ObservatorySky } from '../domain/observatory-time';
import { pixelDiscPath } from './observatory-atmosphere';

const sunDisc = pixelDiscPath(14),
  haloDisc = pixelDiscPath(45),
  moonHalo = pixelDiscPath(40);
const cirrus = Array.from({ length: 5 }, (_, i) =>
  Array.from(
    { length: 161 },
    (_, x) => `${x ? 'L' : 'M'}${x * 6} ${64 + i * 10 + Math.round(Math.sin(x / 18 + i) * 7)}`,
  ).join(''),
);
const dew = Array.from({ length: 28 }, (_, i) => ({
  x: 22 + ((i * 137) % 916),
  y: 229 + ((i * 17) % 22),
}));
const fog = Array.from({ length: 4 }, (_, i) =>
  Array.from(
    { length: 161 },
    (_, x) => `${x ? 'L' : 'M'}${x * 6} ${198 + i * 7 + Math.round(Math.sin(x / 16 + i) * 3)}`,
  ).join(''),
);

/** Optical motifs, not a weather feed. Integer paths retain fine pixel contours. */
export function ObservatoryTimeSky({ sky, detail }: { sky: ObservatorySky; detail: number }) {
  const id = useId();
  const [morning, day, sunset, night, late, dawn] = sky.weights;
  return (
    <g className="pixel-time-sky pixel-cover-sky" pointerEvents="none" data-time-sky="true">
      <defs>
        <radialGradient id={id + '-sun'}>
          <stop offset="0" stopColor="var(--observatory-warm-050)" stopOpacity=".52" />
          <stop offset=".45" stopColor="var(--observatory-warm-250)" stopOpacity=".14" />
          <stop offset="1" stopColor="var(--observatory-warm-100)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id + '-twilight'} x2="0" y2="1">
          <stop offset="0" stopColor="var(--observatory-warm-100)" stopOpacity="0" />
          <stop offset=".65" stopColor="var(--observatory-warm-100)" stopOpacity=".35" />
          <stop offset="1" stopColor="var(--observatory-cool-500)" stopOpacity=".2" />
        </linearGradient>
      </defs>
      <g
        opacity={morning + day + sunset}
        transform={`translate(${sky.sun.x} ${sky.sun.y})`}
        data-time-phenomenon="sun"
      >
        <circle r="108" fill={`url(#${id}-sun)`} />
        <path d={sunDisc} className="pixel-time-sun" />
        <path d="M-10 9h20v1h-20M-13 5h26v1h-26" className="pixel-gold" opacity=".5" />
        <g opacity={morning * (0.16 + detail * 0.1)} data-time-phenomenon="sun-rays">
          <g className="pixel-time-rays">
            <path
              d="M0 0l-126 203h-62zM0 0l-38 210h30zM0 0l78 209h46zM0 0l172 202h52z"
              className="pixel-time-sun"
            />
          </g>
        </g>
        <g opacity={day * (0.24 + detail * 0.2)} data-time-phenomenon="sun-halo">
          <path d={haloDisc} className="pixel-time-halo" />
          <path d={haloDisc} transform="scale(1.06)" className="pixel-time-halo-cool" />
          <path d="M-46 -3h3v6h-3M44 -3h3v6h-3" className="pixel-rose" />
        </g>
        <g opacity={sunset * 0.48} data-time-phenomenon="sun-pillar">
          <g className="pixel-time-pillar">
            <path d="M-1 -58h2v119h-2M-3 -37h6v69h-6M-5 -11h10v15h-10" className="pixel-time-sun" />
          </g>
        </g>
      </g>
      <g
        opacity={(morning * 0.3 + day * 0.52 + sunset * 0.26) * (0.75 + detail * 0.25)}
        data-time-phenomenon="cirrus"
      >
        <g className="pixel-time-cirrus">
          {cirrus.map((path, index) => (
            <path
              key={path}
              d={path}
              className="pixel-time-cloud"
              strokeWidth={index % 2 ? '1' : '2'}
            />
          ))}
        </g>
      </g>
      <g
        opacity={night * 0.2 + late * 0.08}
        transform="translate(557 82)"
        data-time-phenomenon="moon-halo"
      >
        <path d={moonHalo} className="pixel-time-moon-halo" />
        <path d={moonHalo} transform="scale(1.06)" className="pixel-time-halo-cool" />
      </g>
      <g opacity={dawn} data-time-phenomenon="earth-shadow">
        <rect y="142" width="960" height="61" fill={`url(#${id}-twilight)`} />
        <path d="M0 188h960v17H0z" className="pixel-blue" opacity=".14" />
        <path d="M632 104h1v5h-1M630 106h5v1h-5" className="pixel-time-sun" opacity=".8" />
      </g>
      <g opacity={late * (0.28 + detail * 0.4)} data-time-phenomenon="night-meteor">
        <g className="pixel-time-meteor">
          <path d="M686 34l-43 22M687 34h2v2h-2" className="pixel-time-meteor-line" />
        </g>
      </g>
    </g>
  );
}
export function ObservatoryTimeGround({ sky }: { sky: ObservatorySky }) {
  const [morning, day, sunset, , , dawn] = sky.weights;
  // Project parallel light onto the stylized ground: low light casts a longer shadow,
  // away from the sun. This is screen geometry, not a geographic solar calculation.
  const direction = Math.sign(480 - sky.sun.x);
  const shadow =
    direction *
    Math.round(
      Math.min(165, Math.max(12, (64 * Math.abs(480 - sky.sun.x)) / Math.max(20, 213 - sky.sun.y))),
    );
  const telescopeShadow = Math.round(shadow * 0.58);
  return (
    <g pointerEvents="none" data-time-ground="true">
      <g opacity={sunset * 0.36 + morning * 0.16 + day * 0.1} data-time-phenomenon="long-shadow">
        <path
          d={`M396 213l${shadow} 29h58l${-shadow} -29zM557 217l${telescopeShadow} 20h5l${-telescopeShadow} -20z`}
          className="pixel-night"
        />
      </g>
      <g opacity={dawn * 0.4} data-time-phenomenon="ground-mist">
        <g className="pixel-time-fog">
          {fog.map((path) => (
            <path key={path} d={path} className="pixel-time-cloud" strokeWidth="3" />
          ))}
        </g>
      </g>
      <g opacity={morning * 0.55} data-time-phenomenon="dew">
        {dew.map((point, index) => (
          <g
            key={point.x}
            style={{ animationDelay: `${-index * 1.7}s` }}
            className="pixel-time-dew"
          >
            <path d={`M${point.x} ${point.y}h1v1h-1`} className="pixel-time-sun" />
          </g>
        ))}
      </g>
    </g>
  );
}
