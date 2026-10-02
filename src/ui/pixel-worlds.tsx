import { useId, type CSSProperties } from 'react';
import { observatoryParticleOpacity, type ObservatoryEvent } from '../domain/observatory-events';
import { ObservatoryEvents } from './observatory-events';
import { ObservatoryAdvanced } from './observatory-advanced';
import { ObservatoryStudySky, ObservatoryStudyStation } from './observatory-reactivity';
import { OBSERVATORY_HEIGHT, OBSERVATORY_TOP } from './observatory-geometry';
import { ObservatoryRadiance, ObservatoryRadianceGround } from './observatory-radiance';
import type { ObservatorySky } from '../domain/observatory-time';
import { ObservatoryTimeSky, ObservatoryTimeGround } from './observatory-time-sky';
import type { StudyLandscape } from '../domain/study-landscape';
import { landscapeSeed } from '../domain/study-landscape';
import { ObservatorySkyDetails, ObservatoryStationDetails } from './observatory-details';
import {
  ObservatoryClouds,
  ObservatoryGroundDetails,
  ObservatoryDomeTiles,
  ObservatoryShockwave,
  fineDistantMountain,
  fineNearMountain,
  fineDome,
  fineMoon,
} from './observatory-atmosphere';

type WorldProps = {
  world: StudyLandscape;
  visible: readonly string[];
  sky?: ObservatorySky;
  events?: readonly ObservatoryEvent[];
  /** Small comparison cards cannot expose zoom detail; keep those GPU contexts unmounted. */
  thumbnail?: boolean;
};
const inspectionDust = Array.from({ length: 48 }, (_, index) => {
  const seed = landscapeSeed(`inspection-${index}`);
  return {
    key: `inspection-${index}`,
    x: (seed % 139) - 69,
    y: ((seed >>> 9) % 99) - 49,
    delay: -(index % 11) * 0.7,
  };
});
const stars = Array.from({ length: 214 }, (_, index) => {
  const seed = landscapeSeed(`observatory-star-${index}`);
  return {
    key: `star-${index}`,
    x: 35 + (seed % 247),
    y: 33 + ((seed >>> 10) % 108),
    size: seed % 7 === 0 ? 2 : 1,
    opacity: 0.25 + (seed % 5) * 0.13,
  };
});
const galaxy = Array.from({ length: 260 }, (_, index) => {
  const arm = index % 3,
    t = Math.floor(index / 3) / 87,
    angle = t * 7 + (arm * 2 * Math.PI) / 3;
  const seed = landscapeSeed(`galaxy-${index}`),
    radius = 5 + t * 76;
  return {
    key: `dust-${index}`,
    x: Math.round(168 + Math.cos(angle) * radius + (seed % 7) - 3),
    y: Math.round(88 + Math.sin(angle) * radius * 0.47 + ((seed >>> 8) % 5) - 2),
    size: seed % 9 === 0 ? 2 : 1,
    opacity: 0.2 + (seed % 7) * 0.1,
  };
});
const coverStars = Array.from({ length: 180 }, (_, index) => {
  const seed = landscapeSeed('cover-' + index);
  return {
    key: 'cover-' + index,
    x: 8 + (seed % 944),
    y: 8 + ((seed >>> 11) % 188),
    size: seed % 11 === 0 ? 2 : 1,
  };
});
const burstParticles = Array.from({ length: 36 }, (_, index) => {
  const angle = (index * Math.PI * 2) / 36,
    radius = 34 + (index % 4) * 12;
  return {
    key: 'nova-' + index,
    x: Math.round(Math.cos(angle) * radius),
    y: Math.round(Math.sin(angle) * radius),
  };
});
const halo = 'M-10 -19h20v3h8v6h6v20h-6v6h-8v3h-20v-3h-8v-6h-6v-20h6v-6h8z';
const star = 'M-1 -4h2v3h3v2H1v3h-2V1h-3v-2h3z';
const rings = Array.from({ length: 6 }, (_, index) => {
  const radius = 23 + index * 14;
  return (
    Array.from({ length: 48 }, (_, point) => {
      const angle = (2 * Math.PI * point) / 48;
      return `${point ? 'L' : 'M'}${Math.round(Math.cos(angle) * radius)} ${Math.round(Math.sin(angle) * radius)}`;
    }).join('') + 'z'
  );
});

export function ObservatoryWorld({
  world,
  visible,
  sky,
  events = [],
  thumbnail = false,
}: WorldProps) {
  const clip = useId(),
    e = world.evolution;
  return (
    <>
      <defs>
        <clipPath id={clip}>
          <rect y={OBSERVATORY_TOP} width="960" height={OBSERVATORY_HEIGHT} />
        </clipPath>
        <linearGradient id={clip + '-sky'} x2="0" y2="1">
          <stop offset="0" className="pixel-sky-top" />
          <stop offset="1" className="pixel-sky-bottom" />
        </linearGradient>
      </defs>
      <rect
        y={OBSERVATORY_TOP}
        width="960"
        height={OBSERVATORY_HEIGHT}
        fill={`url(#${clip}-sky)`}
      />
      <g clipPath={`url(#${clip})`}>
        {sky && <ObservatoryTimeSky sky={sky} detail={e.position / 11} />}
        {sky && <ObservatoryEvents events={events} sky={sky} />}
        {visible.includes('garden') && (
          <g className="pixel-cover-sky">
            {!thumbnail && <ObservatoryAdvanced world={world} night={sky?.nightLight ?? 1} />}
            <ObservatoryStudySky world={world} />
            <g opacity={sky?.nightLight ?? 1}>
              <ObservatoryClouds evolution={e} />
              {coverStars.slice(0, 60).map((point, index) => (
                <rect
                  key={`upper-${point.key}`}
                  x={point.x}
                  y={-96 + (point.y % 89)}
                  width="1"
                  height="1"
                  className="pixel-star"
                  opacity={Math.max(0, Math.min(1, 10 + 4 * e.position - index)) * 0.4}
                />
              ))}
              {coverStars.slice(0, 24 + Math.round(e.position * 14)).map((point, index) => (
                <g
                  key={point.key}
                  className={index % 7 === 0 ? 'pixel-twinkle' : ''}
                  style={{ animationDelay: -index * 0.7 + 's' }}
                >
                  <rect
                    x={point.x}
                    y={point.y}
                    width={point.size}
                    height={point.size}
                    className={['pixel-blue', 'pixel-gold', 'pixel-mint', 'pixel-rose'][index % 4]}
                    opacity={0.25 + (index % 5) * 0.13}
                  />
                </g>
              ))}
            </g>
          </g>
        )}
        <path d={fineDistantMountain} className="pixel-cover-mountain" />
        {visible.includes('garden') && e.stage > 0 && (
          <g key={e.stage} transform="translate(488 100)">
            <g className="pixel-stage-arrival">
              {burstParticles.slice(0, 16).map((point, index) => (
                <path
                  key={point.key}
                  d={star}
                  transform={`translate(${point.x * 2} ${point.y})`}
                  className={['pixel-blue', 'pixel-gold', 'pixel-mint', 'pixel-rose'][index % 4]}
                />
              ))}
            </g>
          </g>
        )}
        <g transform="translate(320 12)">
          <g className="pixel-sky-depth" opacity={sky?.nightLight ?? 1}>
            {visible.includes('garden') && (
              <g className="pixel-layer pixel-landscape--garden">
                <g className="pixel-reveal" opacity={e.dust * 0.5}>
                  {galaxy.slice(0, 100).map((point) => (
                    <rect
                      key={point.key}
                      x={point.x}
                      y={point.y}
                      width="1"
                      height="1"
                      opacity={point.opacity}
                      className="pixel-nebula-violet"
                    />
                  ))}
                </g>
                <g className="pixel-galaxy pixel-reveal" opacity={e.galaxy * 0.8}>
                  {galaxy.map((point) => (
                    <rect
                      key={point.key}
                      x={point.x}
                      y={point.y}
                      width={point.size}
                      height={point.size}
                      opacity={point.opacity}
                      className={
                        ['pixel-blue', 'pixel-gold', 'pixel-mint', 'pixel-rose'][
                          point.key.length % 4
                        ]
                      }
                    />
                  ))}
                </g>
                <g className="pixel-reveal" opacity={e.aurora * 0.22}>
                  <g className="pixel-aurora">
                    <path
                      d="M31 32h16v16h16v-8h16v16h16v-8h16v20h16v-8h16v25h-8V65h-16v12h-16V59H87v8H71V48H55v11H39V41h-8z"
                      className="pixel-cosmos-tint"
                    />
                    <path
                      d="M194 28h12v19h14v-7h14v21h16v-9h16v21h16v-9h12v19h-8v-9h-14v9h-14V62h-16v9h-16V52h-14v5h-16V37h-2z"
                      className="pixel-mint"
                      opacity=".6"
                    />
                  </g>
                </g>
                {stars.slice(0, e.stars).map((point) => (
                  <rect
                    key={point.key}
                    x={point.x}
                    y={point.y}
                    width={point.size}
                    height={point.size}
                    opacity={point.opacity}
                    className={
                      ['pixel-blue', 'pixel-gold', 'pixel-mint', 'pixel-rose'][point.size % 4]
                    }
                  />
                ))}
                <g opacity={e.constellations * 0.35} className="pixel-reveal">
                  <path
                    d="M43 62l23-16 21 20 30-14M209 126l13-16 20 7 25-17M49 106l22 6 9 16"
                    className="pixel-constellation-line"
                  />
                </g>
                {world.plants.map((plant, index) => (
                  <g
                    key={plant.key}
                    transform={`translate(${62 + (plant.seed % 187)} ${49 + (plant.seed % 71)})`}
                  >
                    <g className="pixel-starlight" style={{ animationDelay: `${-index * 1.3}s` }}>
                      <path d={star} className="pixel-star" />
                      <path
                        d="M-7 0h2v1h-2M5 0h2v1H5M0 -7h1v2H0M0 5h1v2H0"
                        className="pixel-star"
                        opacity=".3"
                      />
                    </g>
                  </g>
                ))}
                <g transform="translate(168 88)">
                  <g className="pixel-reveal" opacity={e.halo * 0.3}>
                    <path d={halo} className="pixel-cosmos-tint" />
                    <path d={halo} transform="scale(1.7)" className="pixel-star" opacity=".12" />
                  </g>
                </g>
              </g>
            )}
            {visible.includes('garden') && e.supernova > 0 && (
              <g transform="translate(168 88)" opacity={e.supernova} data-supernova="true">
                <g className="pixel-nova-remnant">
                  <path
                    d={halo}
                    transform="scale(2.2)"
                    className="pixel-nebula-rose"
                    opacity=".18"
                  />
                  <path d={halo} transform="scale(3.4)" className="pixel-blue" opacity=".08" />
                </g>
                <g key={e.stage} className="pixel-supernova">
                  <ObservatoryShockwave echo={e.stage === 11} />
                  {burstParticles.map((point, index) => (
                    <g
                      key={point.key}
                      className="pixel-nova-particle"
                      style={
                        {
                          '--nova-x': point.x + 'px',
                          '--nova-y': point.y + 'px',
                          animationDelay: '.' + (index % 4) + 's',
                        } as CSSProperties
                      }
                    >
                      <path
                        d={star}
                        className={
                          ['pixel-blue', 'pixel-gold', 'pixel-mint', 'pixel-rose'][index % 4]
                        }
                      />
                    </g>
                  ))}
                  <path d={star} className="pixel-nova-heart pixel-gold" />
                </g>
              </g>
            )}
            <path d={fineMoon} transform="translate(237 70)" className="pixel-star" opacity=".85" />
            <path
              d="M230 53h9v4h-5v6h-4v14h4v6h5v4h-9v-4h-6v-6h-4V63h4v-6h6z"
              className="pixel-night"
            />
            {visible.includes('river') && (
              <g className="pixel-layer pixel-landscape--river">
                <g transform="translate(182 63)">
                  <g className="pixel-comet">
                    <path
                      d="M-18 -10h4v2h4v2h4v2h4v2h4v4H0V0h-4v-2h-4v-2h-4v-2h-4z"
                      className="pixel-star"
                      opacity=".6"
                    />
                    <path d="M-1 -1h5v5h-5z" className="pixel-star" />
                  </g>
                </g>
                <g className="pixel-reveal" opacity={e.meteorShower}>
                  {['west', 'middle', 'east'].map((key, index) => (
                    <g key={key} transform={`translate(${72 + index * 73} ${41 + index * 17})`}>
                      <g className="pixel-meteor" style={{ animationDelay: `${-index * 2.3}s` }}>
                        <path
                          d="M-12 -12h2v2h2v2h2v2h2v2h2v2h2v2h2v2H0V0h-2v-2h-2v-2h-2v-2h-2v-2h-2v-2h-2z"
                          className="pixel-star"
                        />
                      </g>
                    </g>
                  ))}
                </g>
                {world.days.map((day, index) => (
                  <rect
                    key={day.key}
                    x={46 + index * 18}
                    y={199 - (day.seed % 3)}
                    width="3"
                    height="1"
                    className="pixel-star"
                    opacity=".55"
                  />
                ))}
              </g>
            )}
            {visible.includes('walk') && (
              <g className="pixel-layer pixel-landscape--walk">
                <g transform="translate(168 88)">
                  <g className="pixel-orbit-shell">
                    <g transform="scale(1 .5)">
                      {rings.slice(0, e.orbits).map((path, index) => (
                        <g key={path}>
                          <path
                            d={path}
                            className="pixel-orbit-line pixel-spectral-orbit"
                            strokeOpacity={0.6 - index * 0.06}
                          />
                          <g
                            className={`pixel-orbit${index % 2 ? ' pixel-orbit--inner' : ''}`}
                            style={{ animationDelay: `${-index * 4}s` }}
                          >
                            <g transform={`translate(${23 + index * 14} 0)`}>
                              <path
                                d="M-2 -4h4v2h2v4H2v2h-4V2h-2v-4h2z"
                                className={
                                  ['pixel-blue', 'pixel-gold', 'pixel-mint', 'pixel-rose'][
                                    index % 4
                                  ]
                                }
                              />
                              <path d="M-1 -2h1v2h-1" className="pixel-night" />
                            </g>
                          </g>
                        </g>
                      ))}
                    </g>
                  </g>
                </g>
                {world.returns.map((visit, index) => (
                  <g
                    key={visit.key}
                    transform={`translate(${249 + (index % 3) * 10} ${175 + Math.floor(index / 3) * 6})`}
                  >
                    <path d="M0 0h1v1H0M3 2h1v1H3" className="pixel-star" opacity=".65" />
                  </g>
                ))}
              </g>
            )}
            {visible.includes('garden') && <ObservatorySkyDetails evolution={e} />}
          </g>
          {visible.includes('garden') && (
            <g className="pixel-sky-depth" opacity={0.3 + 0.7 * (sky?.nightLight ?? 1)}>
              <ObservatoryRadiance world={world} />
            </g>
          )}
          <path
            d={fineNearMountain}
            transform="translate(-320 -12)"
            className="pixel-night-mountain"
          />
          <path d="M-320 214h960v86h-960z" className="pixel-cover-ground" />
          <g transform="translate(-320 -12)">
            <ObservatoryGroundDetails />
            {sky && <ObservatoryTimeGround sky={sky} />}
            <path d="M0 265q180-18 350 1t320-4 290 9v29H0z" className="pixel-terrain-lower" />
            <path
              d="M0 281q260-15 480 1t480-2M0 294q250-12 460-2t500-1"
              className="pixel-terrain-contour"
            />
            {sky && <ObservatoryEvents events={events} sky={sky} ground />}
            {visible.includes('garden') && <ObservatoryRadianceGround world={world} />}
          </g>
          {visible.includes('garden') && e.supernova > 0 && (
            <g opacity={e.supernova * 0.13} pointerEvents="none">
              <path d="M-320 200h960v20h-960z" className="pixel-nova-landlight" />
            </g>
          )}
          <path
            d="M40 204h121v4h30v5h-19v4H28v-4H9v-5h31z"
            className="pixel-ground-reflection"
            opacity={0.12 + e.colorBloom * 0.22}
          />
          <g transform="translate(71 137)">
            <path d="M-4 62h71v4H-4z" className="pixel-night" />
            <path d="M0 23h64v37H0z" className="pixel-building-rim" />
            <path d="M3 26h58v32H3z" className="pixel-building-wall" />
            <path d={fineDome} className="pixel-building-roof" />
            <path d="M15 19v-5h5V8h9V4h7v5h9v6h5v9H10v-5z" className="pixel-building-roof-shadow" />
            <path
              d="M30 4h4v20h-4M3 28h58v3H3M0 39h64v2H0M10 43h8v10h-8M47 43h8v10h-8M27 43h11v15H27"
              className="pixel-night"
            />
            <path
              d="M11 44h6v8h-6M48 44h6v8h-6"
              className="pixel-window pixel-reveal"
              opacity={0.35 + e.colorBloom * 0.55}
            />
            <path d="M0 58h64v3H0M-4 62h72v3H-4M-8 66h80v2H-8" className="pixel-building-rim" />
            <path d="M33 6h4v-10h8v-4h4v-5h8v5h-4v4h-7v4h-9v7h-4z" className="pixel-building-rim" />
            <ObservatoryDomeTiles />
            <ObservatoryStationDetails evolution={e} />
            {visible.includes('garden') && <ObservatoryStudyStation world={world} />}
          </g>
          <g transform="translate(232 183)" data-telescope="true">
            <rect x="-18" y="-30" width="45" height="42" fill="transparent" />
            <path d="M2 -14v10M2 -5l-8 16M2 -5l8 16" className="pixel-orbit-line" />
            <g className="pixel-telescope-head">
              <path d="M-9 -17h25v3H-9M-4 -17v-3h15v3" className="pixel-building-wall" />
              <path d="M-8 -16h22v2H-8M-10 -19h4v7h-4" className="pixel-building-rim" />
              <path d="M-10 -17h2v3h-2" className="pixel-mint" />
            </g>
          </g>
        </g>
        <path d="M0 244h960v16H0z" className="pixel-cover-ground" />
        {visible.includes('garden') && (
          <g className="pixel-pointer-response" data-pointer-response="true">
            {burstParticles
              .slice(0, e.stage < 2 ? 0 : Math.min(8, e.stage - 1))
              .map((point, index) => (
                <g key={point.key} data-cursor-trail="true" opacity={(1 - index / 9) * 0.45}>
                  <path
                    d={index % 3 === 0 ? star : 'M-1 -1h2v2h-2z'}
                    transform={`scale(${0.25 + e.colorBloom * 0.2})`}
                    className={index % 2 ? 'pixel-gold' : 'pixel-rose'}
                  />
                </g>
              ))}
            <g className="pixel-pointer-light">
              <g className="pixel-inspection" data-inspection-detail="true">
                <g className="pixel-inspection-cloud">
                  <path
                    d="M-82 18l10-5 12 2 8-6 13 4 9-7 14 2 12-4 14 4 9-3 13 4 12-5 11 3 12-3"
                    className="pixel-inspection-thread"
                  />
                  <path
                    d="M-73 28l14-4 11 3 11-6 12 2 10-5 13 2 10-5 11 4 12-4 13 2 12-4"
                    className="pixel-inspection-thread pixel-inspection-thread--cool"
                  />
                  <path
                    d="M-76 -22l13 4 9-3 13 5 11-2 10 6 13-2 12 4 12-1 11 5 12-2 11 4"
                    className="pixel-inspection-thread"
                  />
                </g>
                {inspectionDust.map((dust, index) => (
                  <g
                    key={dust.key}
                    transform={`translate(${dust.x} ${dust.y})`}
                    opacity={observatoryParticleOpacity(
                      6 + (36 * e.position) / 11 + 6 * world.dynamics.recent[0],
                      index,
                    )}
                  >
                    <g
                      className="pixel-inspection-grain"
                      style={{ animationDelay: `${dust.delay}s` }}
                    >
                      <path
                        d={index % 7 === 0 ? 'M0 -2h1v2h2v1H1v2H0V1h-2V0h2z' : 'M0 0h1v1H0z'}
                        className={index % 3 ? 'pixel-gold' : 'pixel-mint'}
                      />
                    </g>
                  </g>
                ))}
              </g>
              <g className="pixel-drag-ripple">
                <path d={rings[1]} className="pixel-spectral-orbit pixel-orbit-line" />
              </g>

              <path d={halo} transform="scale(.8)" className="pixel-gold" opacity=".12" />
              <path d={star} className="pixel-gold" />
              {e.stage >= 5 && (
                <g className="pixel-pointer-orbit" opacity={0.3 + e.blend * 0.1}>
                  <path d={rings[0]} className="pixel-spectral-orbit pixel-orbit-line" />
                  <path d={star} transform="translate(23 0) scale(.4)" className="pixel-rose" />
                  <path d={star} transform="translate(-23 0) scale(.3)" className="pixel-mint" />
                </g>
              )}
              {e.stage >= 8 && (
                <g className="pixel-pointer-lens" opacity=".35">
                  <path
                    d="M-32 -20v-12h12M20 -32h12v12M32 20v12H20M-20 32h-12V20"
                    className="pixel-orbit-line pixel-spectral-orbit"
                  />
                </g>
              )}

              {burstParticles
                .slice(0, 4 + Math.round(8 * e.colorBloom + 8 * world.dynamics.recent[0]))
                .map((point, index) => (
                  <g
                    key={point.key}
                    transform={`translate(${Math.round(point.x * 0.4)} ${Math.round(point.y * 0.4)})`}
                  >
                    <g
                      className="pixel-pointer-spark"
                      style={{ animationDelay: -index * 0.3 + 's' }}
                    >
                      <path
                        d={star}
                        transform="scale(.4)"
                        className={
                          ['pixel-blue', 'pixel-gold', 'pixel-mint', 'pixel-rose'][index % 4]
                        }
                      />
                    </g>
                  </g>
                ))}
            </g>
            <g transform="translate(552 195)">
              <g className="pixel-telescope-beam">
                <path
                  d="M-2 -11h4v-25h6v-17h7v-20H-15v20h7v17h6z"
                  className="pixel-gold"
                  opacity=".12"
                />
                <path d="M-1 -10h2v-50h-2z" className="pixel-gold" opacity=".3" />
              </g>
            </g>
          </g>
        )}
      </g>
    </>
  );
}
