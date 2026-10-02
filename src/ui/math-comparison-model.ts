import { DEFAULT_SCENE, type MathScene, type Vec3 } from '../domain/math-explorer';
export type ComparisonProjection = 'xy' | 'xz' | 'yz';
export const projectionAxes = (projection: ComparisonProjection): [number, number] =>
  projection === 'xz' ? [0, 2] : projection === 'yz' ? [1, 2] : [0, 1];

/** Copy only calculation inputs. Saved scene text, camera and renderer are never replaced. */
export function comparisonSnapshot(scene: MathScene): MathScene {
  return {
    ...DEFAULT_SCENE,
    mode: scene.mode,
    expressions: [...scene.expressions],
    min: scene.min,
    max: scene.max,
    position: scene.position,
    a: scene.a,
    b: scene.b,
    vectors: scene.vectors,
  };
}
export interface ComparisonBounds {
  x: number;
  y: number;
  span: number;
}
export function comparisonBounds(
  pointSets: (Vec3 | null)[][],
  projection: ComparisonProjection,
): ComparisonBounds {
  const [h, v] = projectionAxes(projection);
  const points = pointSets.flat().filter((p): p is Vec3 => Boolean(p && p.every(Number.isFinite)));
  if (!points.length) return { x: 0, y: 0, span: 2 };
  const xs = points.map((p) => p[h]),
    ys = points.map((p) => p[v]);
  const loX = Math.min(...xs),
    hiX = Math.max(...xs),
    loY = Math.min(...ys),
    hiY = Math.max(...ys);
  const span = Math.max(hiX - loX, hiY - loY, 1e-9) * 1.12;
  return { x: (loX + hiX) / 2, y: (loY + hiY) / 2, span };
}
export function comparisonCoordinates(
  point: Vec3,
  projection: ComparisonProjection,
  bounds: ComparisonBounds,
): [number, number] {
  const [h, v] = projectionAxes(projection);
  return [
    40 + ((point[h] - bounds.x) / bounds.span + 0.5) * 400,
    440 - ((point[v] - bounds.y) / bounds.span + 0.5) * 400,
  ];
}
export function comparisonPath(
  points: (Vec3 | null)[],
  breaks: boolean[],
  projection: ComparisonProjection,
  bounds: ComparisonBounds,
) {
  let connected = false;
  return points
    .map((point, i) => {
      if (!point || !point.every(Number.isFinite)) {
        connected = false;
        return '';
      }
      const [x, y] = comparisonCoordinates(point, projection, bounds);
      const command = connected && !breaks[i] ? 'L' : 'M';
      connected = true;
      return `${command}${x.toFixed(3)},${y.toFixed(3)}`;
    })
    .join(' ');
}
export function comparisonNumber(value: number) {
  if (!Number.isFinite(value)) return '정의되지 않음';
  if (value !== 0 && Math.abs(value) < 0.01)
    return value > 0 ? '0보다 크고 0.01 미만' : '-0.01보다 크고 0 미만';
  return String(Math.round(value * 100) / 100);
}
