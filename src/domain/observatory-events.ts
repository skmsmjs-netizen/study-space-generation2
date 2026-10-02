import type { StudyLandscape } from './study-landscape';
import { OBSERVATORY_TIMES, observatorySkyAt, type ObservatoryTime } from './observatory-time';
import { OBSERVATORY_VARIATION_NAMES } from './observatory-event-variants';

export type ObservatoryEventSpec = {
  id: string;
  baseId: string;
  variant: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  phase: ObservatoryTime;
  capacity: number;
  channel: 0 | 1 | 2;
  period: number;
  ground?: boolean;
};
const groups = [
  [
    'morning',
    [
      ['valley-cloud', '골짜기 구름바다', 12, 1, 48, true],
      ['sundog-pair', '쌍둥이 환일', 14, 0, 38],
      ['dew-web', '이슬 거미줄', 20, 2, 24, true],
      ['warm-updraft', '햇살 상승기류', 24, 0, 28],
      ['mist-bow', '안개 무지개', 10, 1, 42],
      ['bird-thermal', '빛 속의 새 무리', 16, 2, 36],
    ],
  ],
  [
    'day',
    [
      ['cumulus-fleet', '뭉게구름 항해', 12, 1, 56],
      ['ice-prism', '얼음 프리즘', 20, 0, 34],
      ['solar-glitter', '햇빛의 은가루', 28, 0, 26],
      ['wind-ripple', '바람의 풀결', 24, 2, 32, true],
      ['virga-curtain', '사라지는 비의 커튼', 20, 1, 40],
      ['cloud-shadow', '구름 그림자', 10, 1, 54, true],
    ],
  ],
  [
    'sunset',
    [
      ['amber-anvil', '황금 구름 모루', 12, 1, 58],
      ['alpenglow', '능선의 잔광', 18, 0, 44, true],
      ['sunset-fan', '노을 빛 부채', 14, 0, 48],
      ['iridescent-cloud', '다홍빛 채운', 16, 1, 42],
      ['ember-drift', '붉은 먼지 항해', 28, 2, 34],
      ['horizon-mirage', '수평선의 신기루', 12, 0, 52],
    ],
  ],
  [
    'night',
    [
      ['lunar-corona', '달빛의 동심환', 12, 1, 46],
      ['firefly-garden', '별 아래 반딧불', 24, 2, 32, true],
      ['star-sailing', '별빛 항로', 24, 0, 52],
      ['moonlit-cloud', '달빛 은구름', 14, 1, 58],
      ['satellite-crossing', '위성의 교차 항로', 10, 2, 44],
      ['silver-fog', '은빛 지면 안개', 12, 1, 56, true],
    ],
  ],
  [
    'late-night',
    [
      ['aurora-fold', '오로라의 주름', 18, 1, 54],
      ['meteor-fan', '유성의 방사', 24, 0, 48],
      ['airglow-tide', '대기광의 조수', 14, 1, 62],
      ['cosmic-lens', '별빛 중력 고리', 16, 2, 64],
      ['comet-fragments', '혜성의 조각', 22, 0, 46],
      ['quiet-snow', '별빛 속 눈송이', 28, 2, 42, true],
    ],
  ],
  [
    'dawn',
    [
      ['silver-mesh', '은푸른 야광운', 16, 1, 58],
      ['zodiacal-pyramid', '황도광의 피라미드', 18, 0, 64],
      ['venus-belt', '분홍빛 반황혼 띠', 14, 1, 52],
      ['frost-grass', '서리 맺힌 풀', 24, 2, 40, true],
      ['fog-lift', '안개가 걷히는 틈', 12, 0, 56, true],
      ['last-star', '마지막 별의 여운', 20, 2, 60],
    ],
  ],
] as const;
export const OBSERVATORY_EVENTS: readonly ObservatoryEventSpec[] = groups.flatMap(([phase, rows]) =>
  rows.map(([id, name, capacity, channel, period, ...rest]) => ({
    id,
    baseId: id,
    variant: 0,
    name,
    phase,
    capacity,
    channel,
    period,
    ground: rest[0],
  })),
);
/** The original 36 scenes retain their identity; each receives six additive variations. */
export const OBSERVATORY_SITUATIONS: readonly ObservatoryEventSpec[] = OBSERVATORY_EVENTS.flatMap(
  (base) => [
    base,
    ...OBSERVATORY_VARIATION_NAMES[base.id].map((name, index) => ({
      ...base,
      id: `${base.id}--${index + 1}`,
      variant: (index + 1) as ObservatoryEventSpec['variant'],
      name,
    })),
  ],
);
const familiesByPhase = OBSERVATORY_TIMES.map((time) =>
  OBSERVATORY_EVENTS.filter((event) => event.phase === time.id).map((base) =>
    OBSERVATORY_SITUATIONS.filter((event) => event.baseId === base.id),
  ),
);

// FNV-1a + xorshift32 provide a stable cosmetic permutation, never a security token.
function permutation(seed: string, size = 6): number[] {
  let state = 2166136261;
  for (let i = 0; i < seed.length; i++) state = Math.imul(state ^ seed.charCodeAt(i), 16777619);
  const values = Array.from({ length: size }, (_, index) => index);
  for (let i = size - 1; i > 0; i--) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    const j = (state >>> 0) % (i + 1);
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
}
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const cycle = (value: number, size: number) => ((value % size) + size) % size;

/** Seven-day bags guarantee every variation gets a turn without depending on study records. */
function scheduledVariation(owner: string, day: number, baseId: string, slot: number) {
  const bag = permutation(`${owner}:${baseId}:variations:${Math.floor(day / 7)}`, 7);
  return bag[cycle(day + Math.floor(slot / 6), 7)];
}
export type ObservatoryEvent = {
  spec: ObservatoryEventSpec;
  opacity: number;
  population: number;
  brightness: number;
  amplitude: number;
  duration: number;
  chroma: number;
};
export function observatoryEventParameters(world: StudyLandscape, spec: ObservatoryEventSpec) {
  const growth = world.evolution.position / 11;
  const recent = world.dynamics.recent[spec.channel],
    background = world.dynamics.background[spec.channel];
  const change = Math.abs(world.dynamics.change[spec.channel]);
  return {
    population: 2 + (spec.capacity - 2) * (0.5 * growth + 0.35 * recent + 0.15 * background),
    brightness: 0.25 + 0.4 * recent + 0.2 * growth + 0.15 * background,
    amplitude: 0.55 + 1.25 * recent + 0.45 * change + 0.45 * growth,
    duration: spec.period / (0.8 + 0.6 * recent + 0.25 * background + 0.35 * growth),
    chroma: 0.15 + 0.5 * growth + 0.35 * recent,
  };
}
/** Fractional populations reveal the next instance continuously instead of snapping counts. */
export const observatoryParticleOpacity = (population: number, index: number) =>
  clamp(population - index);
export function buildObservatoryEvents(
  world: StudyLandscape,
  instant: number,
  owner: string,
  referenceEvent?: number,
  referenceVariant?: number,
): ObservatoryEvent[] {
  const finiteInstant = Number.isFinite(instant) ? instant : 0;
  const sky = observatorySkyAt(finiteInstant),
    day = Math.floor((finiteInstant + 9 * 3600000) / 86400000);
  const override =
    referenceEvent !== undefined &&
    Number.isInteger(referenceEvent) &&
    referenceEvent >= 0 &&
    referenceEvent < 6
      ? referenceEvent
      : undefined;
  const variantOverride =
    referenceVariant !== undefined &&
    Number.isInteger(referenceVariant) &&
    referenceVariant >= 0 &&
    referenceVariant <= 6
      ? referenceVariant
      : undefined;
  return OBSERVATORY_TIMES.flatMap((time, index) => {
    const weight = sky.weights[index];
    if (weight <= 0) return [];
    const until = time.start - sky.minute;
    const upcoming = until > 0 && until <= 20;
    const occurrenceDay = day - (sky.minute < time.start && !upcoming ? 1 : 0);
    const elapsed = upcoming ? 0 : (sky.minute - time.start + 1440) % 1440;
    const sequence = permutation(`${owner}:${occurrenceDay}:${time.id}`);
    const families = familiesByPhase[index];
    const slot = Math.floor(elapsed / 30);
    const chosen = override ?? sequence[slot % 6];
    const progress = elapsed % 30;
    const fade = override === undefined && progress >= 28 ? clamp((progress - 28) / 2) : 0;
    const eased = fade * fade * (3 - 2 * fade);
    const pairs = [
      { family: chosen, slot, opacity: 1 - eased },
      ...(eased > 0 ? [{ family: sequence[(slot + 1) % 6], slot: slot + 1, opacity: eased }] : []),
    ];
    return pairs
      .filter((item) => item.opacity > 0)
      .map((item) => {
        const family = families[item.family];
        const variant =
          variantOverride ??
          (override !== undefined
            ? 0
            : scheduledVariation(owner, occurrenceDay, family[0].baseId, item.slot));
        const spec = family[variant];
        return {
          spec,
          opacity: weight * item.opacity,
          ...observatoryEventParameters(world, spec),
        };
      });
  });
}
