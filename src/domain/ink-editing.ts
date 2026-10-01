import type { MemoPoint, MemoStroke } from './model';
import { MEMO_HEIGHT, MEMO_WIDTH } from './memo';

export interface InkRect {
  x: number;
  y: number;
  width: number;
  height: number;
}
export const strokePage = (stroke: MemoStroke) => stroke.page ?? 0;
export const inkPageCount = (strokes: MemoStroke[]) =>
  strokes.reduce((count, s) => Math.max(count, strokePage(s) + 1), 1);
export function inkBounds(strokes: MemoStroke[]): InkRect | null {
  if (!strokes.length) return null;
  let x = Infinity,
    y = Infinity,
    right = -Infinity,
    bottom = -Infinity;
  for (const s of strokes)
    for (const p of s.points) {
      x = Math.min(x, p.x);
      y = Math.min(y, p.y);
      right = Math.max(right, p.x);
      bottom = Math.max(bottom, p.y);
    }
  return { x, y, width: right - x, height: bottom - y };
}
function interpolate(a: MemoPoint, b: MemoPoint, t: number): MemoPoint {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    pressure: a.pressure + (b.pressure - a.pressure) * t,
  };
}
function inside(p: MemoPoint, center: MemoPoint, radius: number) {
  return Math.hypot(p.x - center.x, p.y - center.y) <= radius;
}
/** Clip line segments against the eraser circle, including sparse samples. Untouched originals retain their identity. */
export function eraseInk(
  strokes: MemoStroke[],
  center: MemoPoint,
  radius: number,
  page: number,
  whole: boolean,
  id: () => string = () => crypto.randomUUID(),
): MemoStroke[] {
  let changed = false;
  const result: MemoStroke[] = [];
  for (const stroke of strokes) {
    if (strokePage(stroke) !== page) {
      result.push(stroke);
      continue;
    }
    const r = radius + stroke.width / 2;
    const pieces: MemoPoint[][] = [];
    let current: MemoPoint[] = [];
    let hit = false;
    const finish = () => {
      if (current.length) pieces.push(current);
      current = [];
    };
    if (stroke.points.length === 1) {
      hit = inside(stroke.points[0], center, r);
      if (!hit) current = stroke.points;
    }
    for (let i = 1; i < stroke.points.length; i++) {
      const a = stroke.points[i - 1],
        b = stroke.points[i],
        dx = b.x - a.x,
        dy = b.y - a.y;
      const aa = dx * dx + dy * dy,
        bb = 2 * ((a.x - center.x) * dx + (a.y - center.y) * dy),
        cc = (a.x - center.x) ** 2 + (a.y - center.y) ** 2 - r * r;
      const cuts = [0, 1],
        discriminant = bb * bb - 4 * aa * cc;
      if (aa > 0 && discriminant >= 0)
        for (const t of [
          (-bb - Math.sqrt(discriminant)) / (2 * aa),
          (-bb + Math.sqrt(discriminant)) / (2 * aa),
        ])
          if (t > 0 && t < 1) cuts.push(t);
      cuts.sort((x, y) => x - y);
      for (let k = 1; k < cuts.length; k++) {
        const left = cuts[k - 1],
          right = cuts[k];
        if (inside(interpolate(a, b, (left + right) / 2), center, r)) {
          hit = true;
          finish();
        } else {
          if (!current.length) current.push(left === 0 ? a : interpolate(a, b, left));
          current.push(right === 1 ? b : interpolate(a, b, right));
        }
      }
    }
    finish();
    if (!hit) result.push(stroke);
    else {
      changed = true;
      if (!whole)
        pieces.forEach((points, i) => {
          result.push({ ...stroke, id: i ? id() : stroke.id, points });
        });
    }
  }
  return changed ? result : strokes;
}
export function selectInk(strokes: MemoStroke[], rect: InkRect, page: number): string[] {
  return strokes
    .filter((s) => {
      const b = inkBounds([s]);
      if (!b) return false;
      return (
        strokePage(s) === page &&
        b.x >= rect.x &&
        b.y >= rect.y &&
        b.x + b.width <= rect.x + rect.width &&
        b.y + b.height <= rect.y + rect.height
      );
    })
    .map((s) => s.id);
}
/** Even-odd containment; points on the boundary are included. Stored ink is never reshaped. */
export function selectInkLasso(strokes: MemoStroke[], polygon: MemoPoint[], page: number): string[] {
  if (polygon.length < 3) return [];
  const contains = (p: MemoPoint) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const a = polygon[j], b = polygon[i];
      const cross = (p.x - a.x) * (b.y - a.y) - (p.y - a.y) * (b.x - a.x);
      if (Math.abs(cross) < 0.00001 && p.x >= Math.min(a.x,b.x) && p.x <= Math.max(a.x,b.x) && p.y >= Math.min(a.y,b.y) && p.y <= Math.max(a.y,b.y)) return true;
      if ((a.y > p.y) !== (b.y > p.y) && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
    }
    return inside;
  };
  return strokes.filter(s => strokePage(s) === page && s.points.every(contains) && s.points.slice(1).every((end,index) => {
    const start=s.points[index];
    // Split sparse segments at polygon edges and test each interval midpoint.
    const times=[0,1];
    for(let i=0,j=polygon.length-1;i<polygon.length;j=i++) {
      const a=polygon[j],b=polygon[i],dx=end.x-start.x,dy=end.y-start.y,ex=b.x-a.x,ey=b.y-a.y;
      const denom=dx*ey-dy*ex;
      if(Math.abs(denom)<1e-9) continue;
      const t=((a.x-start.x)*ey-(a.y-start.y)*ex)/denom;
      const u=((a.x-start.x)*dy-(a.y-start.y)*dx)/denom;
      if(t>0&&t<1&&u>=0&&u<=1) times.push(t);
    }
    times.sort((a,b)=>a-b);
    return times.slice(1).every((t,i)=>{const mid=(times[i]+t)/2;return contains({x:start.x+(end.x-start.x)*mid,y:start.y+(end.y-start.y)*mid,pressure:0});});
  })).map(s => s.id);
}
export function transformInk(
  strokes: MemoStroke[],
  ids: string[],
  dx = 0,
  dy = 0,
  scale = 1,
): MemoStroke[] {
  const selected = new Set(ids),
    bounds = inkBounds(strokes.filter((s) => selected.has(s.id)));
  if (!bounds) return strokes;
  scale = Math.min(scale, MEMO_WIDTH / (bounds.width || 1), MEMO_HEIGHT / (bounds.height || 1));
  const cx = bounds.x + bounds.width / 2,
    cy = bounds.y + bounds.height / 2;
  const left = cx - (bounds.width * scale) / 2,
    top = cy - (bounds.height * scale) / 2;
  dx = Math.max(-left, Math.min(MEMO_WIDTH - left - bounds.width * scale, dx));
  dy = Math.max(-top, Math.min(MEMO_HEIGHT - top - bounds.height * scale, dy));
  return strokes.map((s) =>
    selected.has(s.id)
      ? {
          ...s,
          width: Math.min(40, s.width * scale),
          points: s.points.map((p) => ({
            ...p,
            x: Math.max(0, Math.min(MEMO_WIDTH, cx + (p.x - cx) * scale + dx)),
            y: Math.max(0, Math.min(MEMO_HEIGHT, cy + (p.y - cy) * scale + dy)),
          })),
        }
      : s,
  );
}
export interface InkChange {
  before: { index: number; stroke: MemoStroke }[];
  after: { index: number; stroke: MemoStroke }[];
}
export function inkChange(before: MemoStroke[], after: MemoStroke[]): InkChange | null {
  const previous = new Map(before.map((s) => [s.id, s])),
    next = new Map(after.map((s) => [s.id, s]));
  const different = (s: MemoStroke, other: MemoStroke | undefined) =>
    s !== other && JSON.stringify(s) !== JSON.stringify(other);
  const change = {
    before: before.flatMap((stroke, index) =>
      different(stroke, next.get(stroke.id)) ? [{ stroke, index }] : [],
    ),
    after: after.flatMap((stroke, index) =>
      different(stroke, previous.get(stroke.id)) ? [{ stroke, index }] : [],
    ),
  };
  return change.before.length || change.after.length ? change : null;
}
export function applyInkChange(
  strokes: MemoStroke[],
  change: InkChange,
  reverse: boolean,
): MemoStroke[] {
  const remove = new Set([...change.before, ...change.after].map((row) => row.stroke.id));
  const result = strokes.filter((s) => !remove.has(s.id));
  for (const row of [...(reverse ? change.before : change.after)].sort((a, b) => a.index - b.index))
    result.splice(row.index, 0, row.stroke);
  return result;
}
/** Detect stale history without storing another full drawing. */
export function inkFingerprint(strokes: MemoStroke[]): string {
  let hash = 2166136261,
    length = 0;
  for (const s of strokes) {
    const raw = JSON.stringify(s);
    length += raw.length;
    for (let i = 0; i < raw.length; i++) hash = Math.imul(hash ^ raw.charCodeAt(i), 16777619);
  }
  return `${strokes.length}:${length}:${hash >>> 0}`;
}
