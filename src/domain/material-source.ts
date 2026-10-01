import { DomainError } from './model';
import type { SourceSegment } from './study-material';

export const MAX_DOCUMENT_BYTES = 50 * 1024 * 1024;
export const MAX_DOCUMENT_TEXT = 1_000_000;
export interface MaterialFile {
  key: string; name: string; type: string; size: number; sha256: string;
  cloudPath?: string;
}
export interface DocumentBlock {
  id: string; label: string; text: string; originalText?: string;
  start: number | null; end: number | null; included: boolean;
}
export interface MaterialDocument {
  id: string; name: string;
  kind: 'pdf' | 'docx' | 'pptx' | 'image' | 'text' | 'subtitle' | 'youtube';
  file: MaterialFile | null; url?: string;
  blocks: DocumentBlock[]; warnings: string[];
}
export function validateDocuments(value: unknown): asserts value is MaterialDocument[] {
  const bad = () => { throw new DomainError('INVALID_MATERIAL', '가져온 자료의 원문·출처를 확인해 주세요.'); };
  if (!Array.isArray(value) || value.length > 20) bad();
  let size = 0;
  const ids = new Set<string>();
  for (const doc of value as MaterialDocument[]) {
    if (!doc || typeof doc.id !== 'string' || !doc.id || doc.id.length > 100 || ids.has(doc.id) ||
      typeof doc.name !== 'string' || !doc.name || doc.name.length > 512 ||
      !['pdf', 'docx', 'pptx', 'image', 'text', 'subtitle', 'youtube'].includes(doc.kind) ||
      !Array.isArray(doc.blocks) || doc.blocks.length > 6000 ||
      !Array.isArray(doc.warnings) || doc.warnings.length > 500 || doc.warnings.some(w => typeof w !== 'string' || w.length > 1000)) bad();
    ids.add(doc.id);
    if (doc.url !== undefined && (typeof doc.url !== 'string' || !/^https:\/\/(www\.)?youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/.test(doc.url))) bad();
    if (doc.file !== null && (!doc.file || typeof doc.file.key !== 'string' || !doc.file.key || doc.file.key.length > 512 ||
      typeof doc.file.name !== 'string' || doc.file.name.length > 512 || typeof doc.file.type !== 'string' || doc.file.type.length > 150 ||
      !Number.isSafeInteger(doc.file.size) || doc.file.size <= 0 || doc.file.size > MAX_DOCUMENT_BYTES ||
      !/^[a-f0-9]{64}$/.test(doc.file.sha256))) bad();
    if (doc.file?.cloudPath !== undefined && (typeof doc.file.cloudPath !== 'string' || !doc.file.cloudPath.endsWith(`/document/${doc.file.sha256}`) || !/^[a-zA-Z0-9-]+\/(personal|test)\/document\/[a-f0-9]{64}$/.test(doc.file.cloudPath))) bad();
    const blocks = new Set<string>();
    for (const block of doc.blocks) {
      if (!block || typeof block.id !== 'string' || !block.id || block.id.length > 100 || blocks.has(block.id) ||
        typeof block.label !== 'string' || block.label.length > 300 || typeof block.text !== 'string' || block.text.length > 100_000 ||
        (block.originalText !== undefined && (typeof block.originalText !== 'string' || block.originalText.length > 100_000)) ||
        typeof block.included !== 'boolean' || !(block.start === null && block.end === null ||
          typeof block.start === 'number' && Number.isFinite(block.start) && block.start >= 0 &&
          typeof block.end === 'number' && Number.isFinite(block.end) && block.end >= block.start)) bad();
      blocks.add(block.id); size += block.text.length;
    }
  }
  if (size > MAX_DOCUMENT_TEXT) throw new DomainError('SOURCE_SIZE', '가져온 원문이 100만 자를 넘습니다. 자료를 나누어 보관해 주세요.');
}
export function documentSegments(documents: MaterialDocument[] = []): SourceSegment[] {
  validateDocuments(documents);
  return documents.flatMap(doc => doc.blocks.filter(b => b.included && b.text.trim()).flatMap(block =>
    (block.text.match(/[\s\S]{1,2000}/g) ?? []).map((text, index) => ({
      id: `${doc.id}:${block.id}:${index}`, label: `${doc.name} · ${block.label}`,
      start: block.start, end: block.end, text,
    }))));
}
export function canonicalYouTubeURL(raw: string) {
  const url = new URL(raw.trim());
  let id: string | null = null;
  if (url.protocol === 'https:' && url.hostname === 'youtu.be') id = url.pathname.slice(1);
  if (url.protocol === 'https:' && ['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname)) {
    id = url.pathname === '/watch' ? url.searchParams.get('v') : /^\/(shorts|embed)\//.test(url.pathname) ? url.pathname.split('/')[2] : null;
  }
  if (url.username || url.password || url.port || !id || !/^[A-Za-z0-9_-]{11}$/.test(id)) throw Error('YouTube 영상 주소를 넣어 주세요.');
  return `https://www.youtube.com/watch?v=${id}`;
}
