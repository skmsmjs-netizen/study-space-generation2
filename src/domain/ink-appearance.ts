import { getStroke } from 'perfect-freehand';
import type { MemoStroke } from './model';
import { memoPath } from './memo';
export function inkShape(stroke: MemoStroke) {
  if (!stroke.pressureSensitive) return memoPath(stroke.points);
  const outline = getStroke(stroke.points, {
    size: stroke.width * 2,
    thinning: 0.55,
    smoothing: 0.5,
    streamline: 0.35,
    simulatePressure: false,
  });
  return outline.length ? `M${outline.map((p) => `${p[0]},${p[1]}`).join('L')}Z` : '';
}
