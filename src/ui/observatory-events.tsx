import { type CSSProperties, type ReactNode, useId } from 'react';
import type { ObservatoryEvent } from '../domain/observatory-events';
import { observatoryParticleOpacity } from '../domain/observatory-events';
import { landscapeSeed } from '../domain/study-landscape';
import type { ObservatorySky } from '../domain/observatory-time';
import { pixelDiscPath } from './observatory-atmosphere';
import {
  ObservatoryEventVariation,
  ObservatoryEventVariationSymbol,
  observatoryVariationPlacement,
} from './observatory-event-variations';

const cloud = 'M-31 9h5V4h6V0h5v-6h7v-4h9v2h7v5h5v6h6v4h5v8h-65z';
const cross = 'M-1 -5h2v4h4v2H1v4h-2V1h-4v-2h4z';
const disc = pixelDiscPath(9),
  ring = pixelDiscPath(17);
const arc = 'M-46 12Q0 -26 46 12';
function motif(id: string, i: number): ReactNode {
  switch (id) {
    case 'valley-cloud':
      return (
        <>
          <path d={cloud} className="evt-mist" />
          <path d="M-42 13h86v2h-86M-23 18h69v1h-69" className="evt-white" opacity=".3" />
        </>
      );
    case 'sundog-pair':
      return (
        <>
          <path d="M-3 -18h6v36h-6M-9 -8h3v16h-3M6 -11h3v22H6" className="evt-light" />
          <path d="M-1 -10h2v20h-2" className="evt-white" />
          <path d="M-12 0h24" className="evt-line" />
        </>
      );
    case 'dew-web':
      return (
        <>
          <path
            d="M-20 10L0 -7l23 17M-20 10Q0 1 23 10M-15 6Q0 -1 17 6M-8 1Q0 -4 9 1M0 -7v17"
            className="evt-thin"
          />
          <path d="M-10 5h2v2h-2M7 5h2v2H7M-1 -1h2v2h-2" className="evt-white" />
        </>
      );
    case 'warm-updraft':
      return (
        <>
          <path d="M-4 14q10-6 2-12t1-18" className="evt-thin" />
          <path d="M-1 -13h2v2h-2M3 3h1v1H3M-5 11h2v1h-2" className="evt-light" />
        </>
      );
    case 'mist-bow':
      return (
        <>
          <path d={arc} className="evt-line" strokeWidth="2" />
          <path d="M-41 12Q0 -19 41 12" className="evt-cool-line" />
          <path d="M-51 12Q0 -31 51 12" className="evt-white-line" opacity=".3" />
        </>
      );
    case 'bird-thermal':
      return (
        <g className="evt-wing">
          <path d="M-9 0l4-3 5 4 5-4 4 3M-1 1h2v1h-2" className="evt-bird" />
        </g>
      );
    case 'cumulus-fleet':
      return (
        <>
          <path d={cloud} className="evt-white" />
          <path
            d="M-29 10h61v2h-61M-17 3h15v1h-15M3 5h16v1H3"
            className="evt-light"
            opacity=".35"
          />
        </>
      );
    case 'ice-prism':
      return (
        <>
          <path d="M0 -11l7 11-7 11-7-11zM-7 0H7M0 -11V11" className="evt-white-line" />
          <path d="M0 -7l3 7-3 7-3-7z" className="evt-light" />
          <path d="M7 0h7" className="evt-cool-line" />
        </>
      );
    case 'solar-glitter':
      return (
        <>
          <path d={cross} className="evt-white" />
          <path d="M-12 0h4M8 0h4M0 -12v4M0 8v4" className="evt-thin" />
        </>
      );
    case 'wind-ripple':
      return (
        <>
          <path d="M-15 7q8-9 13 0M-1 7q5-13 13-2M-7 8q4-6 7-3" className="evt-grass" />
          <path d="M-23 -2q11-5 22 0" className="evt-thin" opacity=".3" />
        </>
      );
    case 'virga-curtain':
      return (
        <>
          <path d={cloud} className="evt-mist" />
          <path
            d="M-16 14l-7 20M-5 14l-5 29M5 14l-5 24M16 14l-6 16"
            className="evt-line"
            opacity=".4"
          />
          <path d="M-11 41h5v1h-5" className="evt-white" opacity=".2" />
        </>
      );
    case 'cloud-shadow':
      return (
        <>
          <path d="M-43 0l13-4h38l20 5-15 4h-44z" className="evt-shadow" />
          <path d="M-26 7h43v1h-43" className="evt-shadow" opacity=".4" />
        </>
      );
    case 'amber-anvil':
      return (
        <>
          <path
            d="M-46 -9h79l-7 4H8v7h8v6h17v7h-52V8h8V2h8v-7h-30z"
            className="evt-light"
            opacity=".7"
          />
          <path d="M-44 -10h72v1h-72M-13 13h42v1h-42" className="evt-white" />
        </>
      );
    case 'alpenglow':
      return (
        <>
          <path d="M-29 12l12-11 6 4L1 -10l9 11 9-3 17 16" className="evt-line" />
          <path d="M-7 -1l8-9 7 8M-22 6l5-5 4 3" className="evt-white-line" />
          <path d="M-31 17h68" className="evt-thin" opacity=".25" />
        </>
      );
    case 'sunset-fan':
      return (
        <>
          <path d="M0 28L-18 -22h8zM0 28L9 -26h7z" className="evt-light" opacity=".3" />
          <path d="M0 28L-3 -30" className="evt-white-line" />
        </>
      );
    case 'iridescent-cloud':
      return (
        <>
          <path d={cloud} className="evt-light" />
          <path
            d="M-23 2h18v2h-18M-11 6h36v2h-36M-27 11h30v2h-30"
            className="evt-cool"
            opacity=".65"
          />
          <path d="M-7 -4h14v1H-7" className="evt-white" />
        </>
      );
    case 'ember-drift':
      return (
        <>
          <path d="M0 -2h2v4H0M-5 4h1v1h-1" className="evt-light" />
          <path d="M-2 8h1v3h-1" className="evt-white" opacity=".3" />
        </>
      );
    case 'horizon-mirage':
      return (
        <>
          <path
            d="M-24 0l8-3 5 2 9-6 10 7 7-2 17 5M-24 4l8 2 5-1 9 4 10-4 7 1 17-2"
            className="evt-line"
          />
          <path d="M-31 2h65" className="evt-white-line" opacity=".35" />
        </>
      );
    case 'lunar-corona':
      return (
        <>
          <path d={ring} className="evt-white-line" />
          <path d={ring} transform="scale(1.3)" className="evt-cool-line" />
          <path d={ring} transform="scale(.72)" className="evt-line" />
        </>
      );
    case 'firefly-garden':
      return (
        <>
          <path d={disc} transform="scale(.45)" className="evt-light" opacity=".13" />
          <path d="M-1 -1h2v2h-2" className="evt-white" />
          <path d="M-4 3h2v1h-2" className="evt-light" opacity=".4" />
        </>
      );
    case 'star-sailing':
      return (
        <>
          <path d="M-28 7Q-8 -8 14 1" className="evt-thin" />
          <path d={cross} transform="translate(14 1) scale(.6)" className="evt-white" />
          <path d="M-19 2h1v1h-1M-10 -2h1v1h-1" className="evt-cool" />
        </>
      );
    case 'moonlit-cloud':
      return (
        <>
          <path d={cloud} className="evt-mist" />
          <path d="M-23 -1h8v1h-8M-9 -7H0v1h-9M6 -3h5v1H6M15 4h8v1h-8" className="evt-white" />
        </>
      );
    case 'satellite-crossing':
      return (
        <>
          <path d="M-13 -1h7v4h-7M6 -1h7v4H6M-3 -3h6v7h-6M0 -7v4" className="evt-cool" />
          <path d="M-2 -1h4v2h-4" className="evt-white" />
          <path d="M-32 8L-15 3" className="evt-thin" opacity=".3" />
        </>
      );
    case 'silver-fog':
      return (
        <>
          <path d="M-53 2q22-9 43-2t47 0M-39 8q29-5 59 0" className="evt-white-line" opacity=".3" />
          <path d="M-27 13h51v1h-51" className="evt-cool" opacity=".2" />
        </>
      );
    case 'aurora-fold':
      return (
        <>
          <path
            d="M-26 -18q9 27 18 6t18 7 17-5v13q-8 20-17 4t-18-2-18-8z"
            className="evt-cool"
            opacity=".55"
          />
          <path d="M-26 -18q9 27 18 6t18 7 17-5" className="evt-white-line" opacity=".5" />
        </>
      );
    case 'meteor-fan':
      return (
        <>
          <path d="M-28 -16L0 0" className="evt-line" />
          <path d="M-15 -8L0 0" className="evt-white-line" />
          <path d={cross} transform="scale(.45)" className="evt-white" />
        </>
      );
    case 'airglow-tide':
      return (
        <>
          <path
            d="M-70 0q30-17 66-4t73 0M-70 7q30-17 66-4t73 0"
            className="evt-cool-line"
            strokeWidth="3"
            opacity=".25"
          />
          <path d="M-49 18q30-11 76-1" className="evt-line" opacity=".3" />
        </>
      );
    case 'cosmic-lens':
      return (
        <>
          <path d={ring} transform={`scale(${1 + i * 0.025} .42)`} className="evt-line" />
          <path d="M-21 -3q20-11 42 0" className="evt-white-line" />
          <path d="M-2 -1h4v2h-4" className="evt-cool" />
        </>
      );
    case 'comet-fragments':
      return (
        <>
          <path d="M-28 -11l20 8M-17 -11l13 9" className="evt-line" />
          <path d="M-2 -2h4v4h-4M-8 -5h2v2h-2M-14 -8h1v1h-1" className="evt-white" />
        </>
      );
    case 'quiet-snow':
      return (
        <>
          <path d="M-4 0h8M0 -4v8M-3 -3l6 6M-3 3l6-6" className="evt-white-line" />
          <path d="M-5 9h2v1h-2" className="evt-cool" opacity=".35" />
        </>
      );
    case 'silver-mesh':
      return (
        <>
          <path
            d="M-41 0q18-15 36-2t44-1M-37 6q18-15 36-2t44-1M-27 12q18-12 43-2M-17 -5l-7 17M5 -4l-4 18M23 -3l-3 14"
            className="evt-cool-line"
          />
          <path d="M-32 1h12v1h-12" className="evt-white" />
        </>
      );
    case 'zodiacal-pyramid':
      return (
        <>
          <path d="M-13 31L0 -30l13 61z" className="evt-light" opacity=".08" />
          <path d="M0 -22v43" className="evt-white-line" opacity=".28" />
          <path d="M-3 16h1v1h-1M2 -8h1v1H2" className="evt-white" />
        </>
      );
    case 'venus-belt':
      return (
        <>
          <path
            d="M-70 0q60-9 142 0M-70 4q60-9 142 0"
            className="evt-line"
            strokeWidth="3"
            opacity=".4"
          />
          <path d="M-65 13q60-6 129 0" className="evt-cool-line" strokeWidth="5" opacity=".25" />
        </>
      );
    case 'frost-grass':
      return (
        <>
          <path d="M-7 9L-3 -3M0 9V-7M6 9L9 -2M-6 1l6 1M-2 -2l4 2M5 3l6-2" className="evt-grass" />
          <path d="M-4 -4h2v2h-2M-1 -8h2v2h-2M8 -3h2v2H8" className="evt-white" />
        </>
      );
    case 'fog-lift':
      return (
        <>
          <path
            d="M-39 10q19-19 41-5t38-7M-25 17q17-14 38-6"
            className="evt-white-line"
            strokeWidth="3"
            opacity=".25"
          />
          <path d="M-16 4q6-11 12-4" className="evt-thin" />
        </>
      );
    case 'last-star':
      return (
        <>
          <path d={cross} className="evt-white" />
          <path d={cross} transform="scale(2.1 .5)" className="evt-light" opacity=".2" />
          <path d="M-12 11q11-6 24-2" className="evt-thin" opacity=".3" />
        </>
      );
    default:
      return null;
  }
}
function placement(event: ObservatoryEvent, i: number, sky: ObservatorySky) {
  const id = event.spec.baseId,
    seed = landscapeSeed(`${id}:${i}`);
  let x = 125 + (seed % 710),
    y = -65 + ((seed >>> 10) % 235);
  if (event.spec.ground) y = 232 + ((seed >>> 10) % 52);
  if (['valley-cloud', 'silver-fog', 'fog-lift'].includes(id)) {
    x = 55 + i * 78;
    y = 207 + (i % 3) * 12;
  }
  if (id === 'sundog-pair') {
    x = sky.sun.x + (i % 2 ? -1 : 1) * (39 + Math.floor(i / 2) * 3);
    y = sky.sun.y - 10 + (i % 3) * 8;
  }
  if (id === 'mist-bow') {
    x = 480;
    y = 141 + i * 4;
  }
  if (id === 'lunar-corona') {
    x = 557;
    y = 82;
  }
  if (id === 'sunset-fan') {
    x = sky.sun.x - 76 + i * 12;
    y = sky.sun.y - 45;
  }
  if (id === 'horizon-mirage' || id === 'venus-belt' || id === 'airglow-tide') {
    x = 65 + i * 68;
    y = id === 'airglow-tide' ? 49 + (i % 3) * 16 : 179 + (i % 3) * 6;
  }
  if (id === 'alpenglow') {
    x = 40 + i * 58;
    y = 210 + (i % 2) * 6;
  }
  if (id === 'zodiacal-pyramid') {
    x = 525 + (i % 3) * 3;
    y = 130 - i * 4;
  }
  if (id === 'cosmic-lens') {
    x = 488;
    y = 40;
  }
  return { x, y };
}
function movement(id: string) {
  if (
    [
      'bird-thermal',
      'satellite-crossing',
      'star-sailing',
      'comet-fragments',
      'meteor-fan',
    ].includes(id)
  )
    return 'evt-travel';
  if (['warm-updraft', 'ember-drift', 'fog-lift'].includes(id)) return 'evt-rise';
  if (['quiet-snow', 'virga-curtain'].includes(id)) return 'evt-fall';
  if (
    [
      'dew-web',
      'sundog-pair',
      'solar-glitter',
      'ice-prism',
      'last-star',
      'lunar-corona',
      'frost-grass',
    ].includes(id)
  )
    return 'evt-breathe';
  if (['aurora-fold', 'wind-ripple', 'iridescent-cloud', 'silver-mesh'].includes(id))
    return 'evt-fold';
  return 'evt-drift';
}
export function ObservatoryEvents({
  events,
  sky,
  ground = false,
}: {
  events: readonly ObservatoryEvent[];
  sky: ObservatorySky;
  ground?: boolean;
}) {
  const sceneId = useId();
  return (
    <g
      className={ground ? 'pixel-event-ground' : 'pixel-cover-sky pixel-event-sky'}
      pointerEvents="none"
    >
      {events
        .filter((event) => Boolean(event.spec.ground) === ground)
        .map((event) => (
          <g
            key={event.spec.id}
            data-observatory-event={event.spec.id}
            data-event-base={event.spec.baseId}
            data-event-variant={event.spec.variant}
            data-event-phase={event.spec.phase}
            data-event-population={event.population}
            opacity={event.opacity}
            style={
              {
                '--obs-event-duration': `${event.duration}s`,
                '--obs-event-amplitude': event.amplitude,
                '--obs-variation-detail': 0.22 + event.chroma * 0.42,
                '--obs-event-color': `color-mix(in ${event.spec.variant ? 'oklch' : 'srgb'}, var(--obs-coral) ${event.chroma * 100}%, var(--obs-time-light))`,
              } as CSSProperties
            }
          >
            {event.spec.variant > 0 && (
              <defs>
                <g id={`${sceneId}-${event.spec.id}`}>
                  <ObservatoryEventVariationSymbol event={event}>
                    {motif(event.spec.baseId, 0)}
                  </ObservatoryEventVariationSymbol>
                </g>
              </defs>
            )}
            {Array.from({ length: event.spec.capacity }, (_, slotId) => slotId).map((i) => {
              const point = observatoryVariationPlacement(event, i, placement(event, i, sky));
              return (
                <g
                  key={i}
                  data-event-instance={i}
                  transform={`translate(${point.x} ${point.y})`}
                  opacity={observatoryParticleOpacity(event.population, i) * event.brightness}
                >
                  {event.spec.variant ? (
                    <ObservatoryEventVariation
                      event={event}
                      index={i}
                      symbolId={`${sceneId}-${event.spec.id}`}
                    />
                  ) : (
                    <g
                      className={movement(event.spec.baseId)}
                      style={{ animationDelay: `${-i * 2.731}s` }}
                    >
                      {motif(event.spec.baseId, i)}
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        ))}
    </g>
  );
}
