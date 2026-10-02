/** Bounded, declarative vector data. No markup, external assets or executable SVG. */
export type ConceptFigureTone = 'primary' | 'muted' | 'surface' | 'ink';
type MarkBase = { id: string; tone: ConceptFigureTone };
export type ConceptFigureMark = MarkBase &
  (
    | { kind: 'polyline' | 'polygon'; points: [number, number][] }
    | { kind: 'circle'; center: [number, number]; radius: number }
    | { kind: 'text'; at: [number, number]; text: string; anchor: 'start' | 'middle' | 'end' }
  );
export interface ConceptFigure {
  label: string;
  description: string;
  caption?: string;
  viewBox: [number, number, number, number];
  marks: ConceptFigureMark[];
}
const object = (v: unknown): v is Record<string, unknown> =>
  Boolean(v) && typeof v === 'object' && !Array.isArray(v);
const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const string = (v: unknown, n: number): v is string =>
  typeof v === 'string' && Boolean(v.trim()) && v.length <= n;
const keys = (v: Record<string, unknown>, allowed: string[]) =>
  Object.keys(v).every((k) => allowed.includes(k));
export function validConceptFigure(value: unknown): value is ConceptFigure {
  if (
    !object(value) ||
    !keys(value, ['label', 'description', 'caption', 'viewBox', 'marks']) ||
    !string(value.label, 1000) ||
    !string(value.description, 3000) ||
    (value.caption !== undefined && !string(value.caption, 1000)) ||
    !Array.isArray(value.viewBox) ||
    value.viewBox.length !== 4 ||
    !value.viewBox.every(finite) ||
    !Array.isArray(value.marks) ||
    !value.marks.length ||
    value.marks.length > 512
  )
    return false;
  const [x, y, width, height] = value.viewBox as number[];
  if (
    Math.abs(x) > 10000 ||
    Math.abs(y) > 10000 ||
    width < 1 ||
    height < 1 ||
    width > 4096 ||
    height > 4096
  )
    return false;
  const point = (p: unknown): p is [number, number] =>
    Array.isArray(p) &&
    p.length === 2 &&
    p.every(finite) &&
    p[0] >= x &&
    p[0] <= x + width &&
    p[1] >= y &&
    p[1] <= y + height;
  const seen = new Set<string>();
  let vertices = 0;
  for (const mark of value.marks) {
    if (
      !object(mark) ||
      !string(mark.id, 120) ||
      seen.has(mark.id) ||
      !['primary', 'muted', 'surface', 'ink'].includes(String(mark.tone))
    )
      return false;
    seen.add(mark.id);
    if (mark.kind === 'polyline' || mark.kind === 'polygon') {
      if (
        !keys(mark, ['id', 'tone', 'kind', 'points']) ||
        !Array.isArray(mark.points) ||
        mark.points.length < (mark.kind === 'polygon' ? 3 : 2) ||
        mark.points.length > 512 ||
        !mark.points.every(point)
      )
        return false;
      vertices += mark.points.length;
    } else if (mark.kind === 'circle') {
      if (
        !keys(mark, ['id', 'tone', 'kind', 'center', 'radius']) ||
        !point(mark.center) ||
        !finite(mark.radius) ||
        mark.radius <= 0 ||
        mark.radius > Math.min(width, height) / 2 ||
        mark.center[0] - mark.radius < x ||
        mark.center[0] + mark.radius > x + width ||
        mark.center[1] - mark.radius < y ||
        mark.center[1] + mark.radius > y + height
      )
        return false;
    } else if (mark.kind === 'text') {
      if (
        !keys(mark, ['id', 'tone', 'kind', 'at', 'text', 'anchor']) ||
        !point(mark.at) ||
        !string(mark.text, 200) ||
        !['start', 'middle', 'end'].includes(String(mark.anchor))
      )
        return false;
    } else return false;
  }
  return vertices <= 8192;
}
