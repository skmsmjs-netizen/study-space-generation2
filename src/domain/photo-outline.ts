import { DomainError, type AppState, type Command } from './model';
import { outlineRevisionToken } from './outline';
import type { MaterialFile, MaterialDocument } from './material-source';
import type { MaterialContent } from './study-material';

export const PHOTO_OUTLINE_VERSION = 'photo-outline-20261001-v1';
export const MAX_PHOTOS = 4;
export const MAX_PHOTO_BYTES = 1_500_000;
export const MAX_PHOTO_ROWS = 100;
export interface PhotoInput {
  id: string;
  sha256: string;
  dataUrl: string;
}
export interface PhotoReference {
  id: string;
  file: MaterialFile;
}
export interface PhotoOutlineRow {
  id: string;
  parentId: string | null;
  name: string;
  content: string;
  page: string;
  photoIds: string[];
  uncertain: boolean;
}
export interface PhotoOutlineResult {
  id: string;
  at: string;
  model: string;
  promptVersion: string;
  title: string;
  rows: PhotoOutlineRow[];
  warnings: string[];
  sources: { id: string; sha256: string }[];
}
export type PhotoOutlineCommand = Extract<Command, { type: 'importPhotoOutline' }>;
const invalid = (): never => {
  throw new DomainError(
    'INVALID_PHOTO_OUTLINE',
    '사진과 목차 초안의 형식을 확인해 주세요. 원본과 기존 목차는 유지했습니다.',
  );
};
const str = (s: unknown, max: number): s is string => typeof s === 'string' && s.length <= max;
/** Only inline images; the server never fetches a caller-controlled URL. */
export function photoBytes(photo: PhotoInput): Uint8Array {
  if (
    !photo ||
    !str(photo.id, 100) ||
    !/^[A-Za-z0-9_-]+$/.test(photo.id) ||
    !/^[a-f0-9]{64}$/.test(photo.sha256) ||
    !str(photo.dataUrl, (MAX_PHOTO_BYTES * 4) / 3 + 100)
  )
    invalid();
  const match = /^data:image\/(jpeg|png);base64,([A-Za-z0-9+/]+={0,2})$/.exec(photo.dataUrl);
  if (!match || match[2].length % 4) return invalid();
  let raw: string;
  try {
    raw = atob(match[2]);
  } catch {
    return invalid();
  }
  if (!raw.length || raw.length > MAX_PHOTO_BYTES) invalid();
  const bytes = Uint8Array.from(raw, (c) => c.charCodeAt(0));
  let width = 0,
    height = 0;
  if (match[1] === 'png') {
    if (
      bytes.length < 33 ||
      ![137, 80, 78, 71, 13, 10, 26, 10].every((b, i) => bytes[i] === b) ||
      raw.slice(12, 16) !== 'IHDR'
    )
      invalid();
    const view = new DataView(bytes.buffer);
    width = view.getUint32(16);
    height = view.getUint32(20);
  } else {
    if (bytes[0] !== 255 || bytes[1] !== 216) invalid();
    let p = 2;
    while (p + 4 < bytes.length) {
      if (bytes[p++] !== 255) invalid();
      while (bytes[p] === 255) p++;
      const marker = bytes[p++];
      if (marker === 217 || marker === 218) break;
      const length = bytes[p] * 256 + bytes[p + 1];
      if (length < 2 || p + length > bytes.length) invalid();
      if ([192, 193, 194].includes(marker)) {
        if (length < 8) invalid();
        height = bytes[p + 3] * 256 + bytes[p + 4];
        width = bytes[p + 5] * 256 + bytes[p + 6];
        break;
      }
      p += length;
    }
  }
  if (!width || !height || width > 2048 || height > 2048) invalid();
  return bytes;
}
export function validatePhotoInput(photos: PhotoInput[]): void {
  if (!Array.isArray(photos) || !photos.length || photos.length > MAX_PHOTOS) invalid();
  const ids = new Set<string>(),
    hashes = new Set<string>();
  for (const p of photos) {
    photoBytes(p);
    if (ids.has(p.id) || hashes.has(p.sha256)) invalid();
    ids.add(p.id);
    hashes.add(p.sha256);
  }
}
export function orderedPhotoRows(rows: PhotoOutlineRow[]): PhotoOutlineRow[] {
  const byId = new Map(rows.map((r) => [r.id, r])),
    visiting = new Set<string>(),
    visited = new Set<string>(),
    levels = new Map<string, number>(),
    output: PhotoOutlineRow[] = [];
  function visit(row: PhotoOutlineRow, depth = 0) {
    if (depth > 10 || visiting.has(row.id)) invalid();
    if (visited.has(row.id)) return;
    visiting.add(row.id);
    if (row.parentId !== null) {
      const parent = byId.get(row.parentId);
      if (!parent) return invalid();
      visit(parent, depth + 1);
    }
    const level = row.parentId === null ? 1 : (levels.get(row.parentId) ?? 0) + 1;
    if (level > 10) invalid();
    levels.set(row.id, level);
    visiting.delete(row.id);
    visited.add(row.id);
    output.push(row);
  }
  rows.forEach((r) => {
    visit(r);
  });
  return output;
}
export function validatePhotoRows(rows: PhotoOutlineRow[], photoIds?: string[]): void {
  if (!Array.isArray(rows) || rows.length > MAX_PHOTO_ROWS) invalid();
  const ids = new Set<string>();
  let total = 0;
  for (const row of rows) {
    if (
      !row ||
      !str(row.id, 100) ||
      !/^[A-Za-z0-9_-]+$/.test(row.id) ||
      ids.has(row.id) ||
      (row.parentId !== null && !str(row.parentId, 100)) ||
      !str(row.name, 180) ||
      !row.name.trim() ||
      /[\r\n\t]/.test(row.name) ||
      !str(row.content, 12000) ||
      !str(row.page, 100) ||
      typeof row.uncertain !== 'boolean' ||
      !Array.isArray(row.photoIds) ||
      !row.photoIds.length ||
      row.photoIds.length > MAX_PHOTOS ||
      new Set(row.photoIds).size !== row.photoIds.length ||
      row.photoIds.some((id) => !str(id, 100) || (photoIds && !photoIds.includes(id)))
    )
      invalid();
    ids.add(row.id);
    total += row.content.length + row.name.length + row.page.length;
  }
  if (total > 100_000) invalid();
  orderedPhotoRows(rows);
}
export function validatePhotoResult(value: unknown): asserts value is PhotoOutlineResult {
  const r = value as PhotoOutlineResult;
  if (
    !r ||
    !str(r.id, 100) ||
    !r.id ||
    !str(r.at, 100) ||
    !Number.isFinite(Date.parse(r.at)) ||
    !str(r.model, 100) ||
    !r.model ||
    r.promptVersion !== PHOTO_OUTLINE_VERSION ||
    !str(r.title, 300) ||
    !r.title.trim() ||
    !Array.isArray(r.warnings) ||
    r.warnings.length > 30 ||
    r.warnings.some((w) => !str(w, 1000)) ||
    !Array.isArray(r.sources) ||
    !r.sources.length ||
    r.sources.length > MAX_PHOTOS ||
    r.sources.some((s) => !s || !str(s.id, 100) || !/^[a-f0-9]{64}$/.test(s.sha256)) ||
    new Set(r.sources.map((s) => s.id)).size !== r.sources.length
  )
    invalid();
  validatePhotoRows(
    r.rows,
    r.sources.map((s) => s.id),
  );
}
export function photoOutlineText(rows: PhotoOutlineRow[]): string {
  const levels = new Map<string, number>();
  return orderedPhotoRows(rows)
    .map((r) => {
      const depth = r.parentId === null ? 1 : (levels.get(r.parentId) ?? 0) + 1;
      levels.set(r.id, depth);
      return `${'#'.repeat(Math.min(depth, 6))} ${r.name}${r.page ? ` · ${r.page}` : ''}\n${r.content}`;
    })
    .join('\n\n');
}
export function previewPhotoOutline(
  state: AppState,
  subjectId: string,
  parentId: string | null,
  rows: PhotoOutlineRow[],
  choices: Record<string, string>,
) {
  validatePhotoRows(rows);
  if (
    !state.subjects.some((s) => s.id === subjectId && !s.deletedAt) ||
    (parentId !== null &&
      !state.nodes.some((n) => n.id === parentId && n.subjectId === subjectId && !n.deletedAt)) ||
    !choices ||
    typeof choices !== 'object' ||
    Array.isArray(choices) ||
    Object.values(choices).some((c) => typeof c !== 'string')
  )
    invalid();
  const plan: {
    row: PhotoOutlineRow;
    parentKey: string | null;
    parentId: string | null;
    role: 'unit' | 'outline' | 'topic';
    status: 'new' | 'reuse' | 'choose' | 'blocked';
    id: string | null;
    candidates: { id: string; name: string }[];
  }[] = [];
  const paths = new Set<string>();
  for (const row of orderedPhotoRows(rows)) {
    const path = JSON.stringify([row.parentId, row.name.trim()]);
    if (paths.has(path))
      throw new DomainError(
        'DUPLICATE_PHOTO_NAME',
        '초안의 같은 위치에 같은 이름이 있습니다. 항목 이름이나 상위 위치를 확인해 주세요.',
      );
    paths.add(path);
    const parent = plan.find((p) => p.row.id === row.parentId),
      actualParent = row.parentId === null ? parentId : (parent?.id ?? null);
    const role =
      row.parentId === null && parentId === null
        ? 'unit'
        : rows.some((r) => r.parentId === row.id)
          ? 'outline'
          : 'topic';
    const blocked =
      row.parentId !== null && (!parent || ['choose', 'blocked'].includes(parent.status));
    const candidates =
      !blocked && (row.parentId === null || parent?.status === 'reuse')
        ? state.nodes
            .filter(
              (n) =>
                !n.deletedAt &&
                n.subjectId === subjectId &&
                n.parentId === actualParent &&
                n.name === row.name.trim() &&
                n.role === role,
            )
            .map((n) => ({ id: n.id, name: n.name }))
        : [];
    const choice = choices[row.id];
    let status: 'new' | 'reuse' | 'choose' | 'blocked' = blocked
      ? 'blocked'
      : candidates.length && choice !== 'new'
        ? 'choose'
        : 'new';
    let id: string | null = null;
    if (candidates.some((n) => n.id === choice)) {
      status = 'reuse';
      id = choice;
    } else if (choice && choice !== 'new' && !blocked) invalid();
    plan.push({
      row,
      parentKey: row.parentId,
      parentId: actualParent,
      role,
      status,
      id,
      candidates,
    });
  }
  return {
    entries: plan,
    ready: rows.length > 0 && plan.every((p) => ['new', 'reuse'].includes(p.status)),
    expectedToken: outlineRevisionToken(state, subjectId, parentId),
  };
}
export function photoMaterial(
  subjectId: string,
  title: string,
  refs: PhotoReference[],
  original: PhotoOutlineResult,
  rows: PhotoOutlineRow[],
): MaterialContent {
  validatePhotoResult(original);
  validatePhotoRows(
    rows,
    refs.map((p) => p.id),
  );
  const documents: MaterialDocument[] = refs.map((p) => ({
    id: p.id,
    name: p.file.name,
    kind: 'image',
    file: p.file,
    warnings: [
      `GPT가 사진에서 읽은 초안 · ${original.model} · ${original.at}`,
      ...original.warnings,
    ],
    blocks: [
      {
        id: 'photo-outline',
        label: '사진에서 읽은 목차·내용',
        start: null,
        end: null,
        included: false,
        text: photoOutlineText(
          rows.filter((r) => r.photoIds.includes(p.id)).map((r) => ({ ...r, parentId: null })),
        ),
        originalText: JSON.stringify(original),
      },
    ],
  }));
  return {
    title,
    subjectId,
    topicId: null,
    sourceText: photoOutlineText(rows),
    audio: null,
    results: [],
    documents,
    originalStorage: 'device',
  };
}
