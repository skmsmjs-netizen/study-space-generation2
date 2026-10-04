import type { TemplateResult } from '../domain/math-templates';
// Surface meshes may store x along rows or columns. Heatmap z must follow y rows/x columns.
export function surfaceProjection(surface: NonNullable<TemplateResult['surface']>) {
  const x = surface.x,
    y = surface.y,
    z = surface.z;
  if (!Array.isArray(x[0]))
    return { x: x as number[], y: y.map((row) => (Array.isArray(row) ? row[0] : row)), z };
  const X = x as number[][],
    Y = y as number[][];
  const xAlongRows =
    X.length > 1 && X[0].every((v) => v === X[0][0]) && X.some((row) => row[0] !== X[0][0]);
  return xAlongRows
    ? { x: X.map((row) => row[0]), y: Y[0], z: z[0].map((_, j) => z.map((row) => row[j])) }
    : { x: X[0], y: Y.map((row) => row[0]), z };
}
