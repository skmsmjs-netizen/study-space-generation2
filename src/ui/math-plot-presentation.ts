// Shared display policy; screen density, not a hard-coded zoom click count.
export function vectorDisplayLimit(width: number, height: number) {
  return Math.min(80, Math.max(48, Math.min(width, height) * 0.2));
}
export function numberOpacity(pixelsPerUnit: number) {
  const progress = Math.max(0, Math.min(1, (pixelsPerUnit - 38) / 18));
  return progress * progress * (3 - 2 * progress);
}
export function readPlotColor(host: HTMLElement, token: string): [number, number, number] {
  const probe = document.createElement('span');
  probe.style.color = `var(${token})`;
  probe.style.display = 'none';
  host.appendChild(probe);
  const rgb = getComputedStyle(probe)
    .color.match(/[\d.]+/g)
    ?.slice(0, 3)
    .map(Number);
  probe.remove();
  return rgb?.length === 3 ? (rgb as [number, number, number]) : [80, 80, 80];
}
export const hexColor = (rgb: number[]) =>
  `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
export function fadeNumbers(
  host: HTMLElement,
  apply: (opacity: number[]) => void,
  initial: number[] = [0, 0, 0],
) {
  let frame = 0,
    values = initial.slice(),
    targets = [0, 0, 0],
    previous = 0;
  let disposed = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const draw = (time: number) => {
    frame = 0;
    if (disposed) return;
    const fraction = reduced.matches ? 1 : Math.min(1, (time - previous) / 80);
    previous = time;
    values = values.map((v, i) =>
      Math.abs(targets[i] - v) < 0.015 ? targets[i] : v + (targets[i] - v) * fraction,
    );
    host.dataset.axisNumberOpacity = values.map((v) => v.toFixed(2)).join(',');
    host.dataset.axisNumbers = values.some((v) => v > 0.02) ? 'visible' : 'hidden';
    apply(values);
    if (values.some((v, i) => v !== targets[i])) frame = requestAnimationFrame(draw);
  };
  return {
    update(density: number[]) {
      targets = [0, 1, 2].map((i) => numberOpacity(density[i] ?? 0));
      host.dataset.axisDensity = density.map((v) => v.toFixed(2)).join(',');
      if (!frame) {
        previous = performance.now();
        frame = requestAnimationFrame(draw);
      }
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
    },
  };
}
