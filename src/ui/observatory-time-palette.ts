import type { ObservatorySky } from '../domain/observatory-time';

const mix = (a: string, percentage: number, b: string) =>
  `color-mix(in oklch, ${a} ${percentage}%, ${b})`;
const color = (name: string) => `var(--observatory-${name})`;
const deep = color('night-950'),
  blue = color('cool-500'),
  peach = color('warm-100'),
  cream = color('warm-050'),
  gold = color('warm-250'),
  coral = color('warm-500'),
  indigo = color('night-450'),
  mint = color('cool-850');
// Reuse the adopted 16-color palette. These roles belong only to the decorative cover.
export const OBSERVATORY_TIME_PALETTES = [
  {
    top: mix(blue, 68, cream),
    bottom: mix(peach, 65, gold),
    far: mix(indigo, 38, peach),
    near: mix(mint, 46, peach),
    ground: mix(mint, 50, gold),
    roof: mix(cream, 76, coral),
    wall: mix(cream, 54, indigo),
    light: gold,
  },
  {
    top: mix(blue, 86, 'var(--obs-white)'),
    bottom: mix(blue, 32, cream),
    far: mix(indigo, 44, blue),
    near: mix(mint, 57, cream),
    ground: mix(mint, 58, gold),
    roof: mix(cream, 78, blue),
    wall: mix(cream, 60, indigo),
    light: cream,
  },
  {
    top: mix(indigo, 68, peach),
    bottom: mix(coral, 72, gold),
    far: mix(indigo, 45, coral),
    near: mix(deep, 57, coral),
    ground: mix(deep, 65, coral),
    roof: mix(peach, 72, coral),
    wall: mix(deep, 49, coral),
    light: peach,
  },
  {
    top: mix(deep, 80, indigo),
    bottom: mix(indigo, 57, deep),
    far: mix(indigo, 38, deep),
    near: mix(deep, 78, blue),
    ground: mix(deep, 90, blue),
    roof: mix(blue, 58, cream),
    wall: mix(deep, 76, blue),
    light: gold,
  },
  {
    top: deep,
    bottom: mix('var(--obs-horizon)', 56, deep),
    far: mix(deep, 86, indigo),
    near: mix(deep, 92, blue),
    ground: deep,
    roof: mix('var(--obs-accent)', 55, cream),
    wall: mix('var(--obs-accent)', 25, deep),
    light: gold,
  },
  {
    top: mix(indigo, 67, deep),
    bottom: mix(peach, 53, indigo),
    far: mix(indigo, 68, peach),
    near: mix(deep, 69, blue),
    ground: mix(deep, 77, mint),
    roof: mix(blue, 61, peach),
    wall: mix(deep, 69, peach),
    light: peach,
  },
] as const;
export function observatoryTimePalette(sky: ObservatorySky): Record<string, string | number> {
  const active = sky.weights
    .map((weight, index) => ({ weight, index }))
    .filter((item) => item.weight > 0);
  const first = active[0];
  const second = active[1];
  const roles = Object.keys(
    OBSERVATORY_TIME_PALETTES[0],
  ) as (keyof (typeof OBSERVATORY_TIME_PALETTES)[0])[];
  const result: Record<string, string | number> = {
    '--pixel-night-visibility': sky.nightLight,
    '--pixel-lamp-visibility': 0.15 + sky.nightLight * 0.85,
  };
  for (const role of roles) {
    const a = OBSERVATORY_TIME_PALETTES[first.index][role];
    result[`--obs-time-${role}`] = second
      ? mix(
          a,
          Math.round(first.weight * 10000) / 100,
          OBSERVATORY_TIME_PALETTES[second.index][role],
        )
      : a;
  }
  return result;
}
