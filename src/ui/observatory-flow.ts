/** Display mathematics only. Growth and camera distance are independent coordinates. */
export const flowClamp = (x: number, low = 0, high = 1) => Math.max(low, Math.min(high, x));
const smooth = (x: number) => {
  const t = flowClamp(x);
  return t * t * (3 - 2 * t);
};
export function observatoryLOD(zoom: number) {
  return [1, smooth((zoom - 1.12) / 0.65), smooth((zoom - 1.65) / 0.65)] as const;
}
/** Analytic curl of a multi-scale scalar potential: (dψ/dy, -dψ/dx).
 * Inspired by Bridson et al. 2007; this is an art-directed field, not astronomy. */
export function observatoryCurl(x: number, y: number, time: number, activity: number) {
  let vx = 0,
    vy = 0;
  for (let octave = 0; octave < 3; octave++) {
    const k = 0.009 * 2 ** octave,
      amplitude = (8 + activity * 14) / 2 ** octave;
    const a = x * k + time * 0.08,
      b = y * k * 1.7 - time * 0.06;
    vx += amplitude * Math.sin(a) * Math.cos(b) * 1.7;
    vy -= amplitude * Math.cos(a) * Math.sin(b);
  }
  return { x: vx, y: vy };
}
export function observatoryWave(time: number, strength: number) {
  const phase = ((time % 28) + 28) % 28;
  const progress = flowClamp((phase - 0.35) / 4.6);
  return {
    radius: progress * 820,
    energy: phase > 0.35 && phase < 4.95 ? Math.sin(progress * Math.PI) * strength : 0,
  };
}
/** CSS Color 4 Oklab conversion; returned linear RGB feeds the shader directly. */
export function observatoryLinearColor(lightness: number, chroma: number, hue: number) {
  const angle = (hue * Math.PI) / 180,
    a = chroma * Math.cos(angle),
    b = chroma * Math.sin(angle);
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    flowClamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    flowClamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    flowClamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ] as const;
}
