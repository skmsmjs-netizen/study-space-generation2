/** Raster sampling policy only; never changes study values, scene content or saved preferences. */
export type ObservatoryRenderBudget = {
  displayWidth: number;
  pixelRatio: number;
  zoom: number;
  constrained: boolean;
  interacting: boolean;
};

// Bounded tiers avoid reallocating the drawing buffer for each CSS pixel or camera frame.
// The previous 640/400 policy remains the unmeasured fallback, not a display-size ceiling.
const widths = [240, 320, 400, 480, 640, 800, 960, 1280] as const;
const positive = (value: number, fallback: number) =>
  Number.isFinite(value) && value > 0 ? value : fallback;

export function observatoryRenderWidth(budget: ObservatoryRenderBudget): number {
  const width = positive(budget.displayWidth, 640);
  const ratio = Math.min(2, Math.max(1, positive(budget.pixelRatio, 1)));
  const zoom = Math.min(3, Math.max(1, positive(budget.zoom, 1)));
  // Enlarging the drawing buffer with the full zoom would square its pixel cost.
  // Resolve more detail after the lens settles; keep motion and pressure at the lower tier.
  const base = Math.min(1280, width * ratio);
  // Sustained pressure must still reach the previous 400 px safety tier on a large display.
  // Merely scaling a 1280 px buffer by 0.625 would leave more work than the old normal tier.
  const target = budget.constrained
    ? Math.min(400, base * (400 / 640))
    : budget.interacting
      ? base * (400 / 640)
      : base * Math.sqrt(zoom);
  return widths.reduce<number>(
    (selected, value) => (value <= target ? value : selected),
    widths[0],
  );
}
