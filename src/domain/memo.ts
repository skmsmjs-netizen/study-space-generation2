import { validateDocuments } from './material-source';
import { DomainError, type QuickMemo, type MemoPoint } from './model';

export const MEMO_WIDTH = 900;
export const MEMO_HEIGHT = 600;
export function validateMemoContent(value: unknown): asserts value is Pick<QuickMemo, 'body' | 'ownerId' | 'strokes'> {
  const row = value as QuickMemo | null;
  const bad = () => { throw new DomainError('INVALID_MEMO', '메모의 글이나 그림을 읽지 못했습니다. 원문을 변경하지 않았습니다.'); };
  if (!row || typeof row.body !== 'string' || row.ownerId !== null && (typeof row.ownerId !== 'string' || !row.ownerId.trim()) || !Array.isArray(row.strokes)) return bad();
  if (row.document !== undefined) {
    const d = row.document;
    if (!d || !Number.isSafeInteger(d.pages) || d.pages < 1 || !Number.isSafeInteger(d.startPage) || d.startPage < 0 || d.startPage + d.pages >= Number.MAX_SAFE_INTEGER) return bad();
    validateDocuments([{id:'memo-pdf',name:d.file?.name,kind:'pdf',file:d.file,blocks:[],warnings:[]}]);
  }
  const ids = new Set<string>();
  for (const stroke of row.strokes) {
    if (!stroke || typeof stroke.id !== 'string' || !stroke.id.trim() || ids.has(stroke.id)
      || !['ink', 'blue', 'green'].includes(stroke.ink) || !Number.isFinite(stroke.width) || stroke.width <= 0 || stroke.width > 40
      || stroke.page !== undefined && (!Number.isSafeInteger(stroke.page) || stroke.page < 0 || stroke.page >= Number.MAX_SAFE_INTEGER)
      || stroke.pressureSensitive !== undefined && typeof stroke.pressureSensitive !== 'boolean'
      || !Array.isArray(stroke.points) || !stroke.points.length) return bad();
    ids.add(stroke.id);
    for (const point of stroke.points) if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)
      || point.x < 0 || point.x > MEMO_WIDTH || point.y < 0 || point.y > MEMO_HEIGHT
      || !Number.isFinite(point.pressure) || point.pressure < 0 || point.pressure > 1) return bad();
  }
}
export function memoPath(points: MemoPoint[]): string {
  if (!points.length) return '';
  const first = points[0];
  if (points.length === 1) return `M${first.x},${first.y}l0.01,0`;
  // Midpoint curves smooth adjacent samples without shifting the stored original points.
  let path = `M${first.x},${first.y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i], next = points[i + 1];
    path += `Q${p.x},${p.y} ${(p.x + next.x) / 2},${(p.y + next.y) / 2}`;
  }
  const last = points.at(-1)!;
  return path + `L${last.x},${last.y}`;
}
