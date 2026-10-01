import { DomainError } from './model.ts';
import type { MaterialContent, SourceSegment } from './study-material.ts';
import { documentSegments, materialSourceIdentity } from './material-source.ts';
import type { StudyAIRequest, StudyAITask } from './study-ai-request.ts';

export const MATERIAL_CONTRACT_VERSION = 'jun-split-20261001-1';
export type SourceRole = 'material' | 'problem' | 'attempt' | 'reference' | 'focus';
export type EvidenceType = 'material-grounded' | 'general-supplement';
export interface MaterialDiagnostic {
  kind: 'needs-input' | 'insufficient-evidence' | 'partial';
  message: string;
  questions?: string[];
  sourceIds?: string[];
}
export interface MaterialRange {
  index: number;
  count: number;
  sourceIdentity: string;
  totalSegments: number;
  sourceIds: string[];
  overlapIds?: string[];
}
export interface MaterialView {
  resultId?: string;
  cardId?: string;
  tab: 'summary' | 'transcript' | 'cards' | 'quiz' | 'map';
  activeDisclosure?: 'hidden' | 'revealed';
  revealed: string[];
  helped: string[];
}
export const canonicalStudyTask = (task: StudyAITask): Exclude<StudyAITask, 'source-qa'> =>
  task === 'source-qa' ? 'tutor' : task;
export const allowsMaterialCards = (task: StudyAITask) =>
  ['summary', 'questions', 'practice'].includes(task);
export function sourceRole(segment: SourceSegment): SourceRole {
  if (segment.role) return segment.role;
  if (segment.id.startsWith('request-')) {
    const key = segment.id.slice(8);
    if (['problem', 'attempt', 'reference', 'focus'].includes(key)) return key as SourceRole;
  }
  return segment.role ?? 'material';
}
export const SOURCE_ROLE_LABELS: Record<SourceRole, string> = {
  material: '자료 원문', problem: '문제', attempt: '사용자 시도', reference: '참고 기준', focus: '질문·초점',
};
/** Change marker, not a security or factual-validity hash. Originals remain in result.source. */
export function materialInputFingerprint(content: MaterialContent): string {
  const input = materialSourceIdentity(content);
  let a = 2166136261, b = 5381;
  for (let i = 0; i < input.length; i++) {
    a = Math.imul(a ^ input.charCodeAt(i), 16777619);
    b = Math.imul(b, 33) ^ input.charCodeAt(i);
  }
  return `input-v1:${input.length}:${a >>> 0}:${b >>> 0}`;
}
/** Explicit one-range generation. No truncation, automatic multi-call loop or original mutation. */
export function planMaterialRanges(content: MaterialContent, request: StudyAIRequest) {
  const extra = ['problem', 'attempt', 'reference', 'focus'].reduce(
    (n, key) => n + ((request[key as 'problem' | 'attempt' | 'reference' | 'focus'] ?? '').length), 0,
  );
  const budget = 150_000 - extra;
  if (budget < 1) throw new DomainError('SOURCE_SIZE', '문제·시도·참고 기준의 범위를 나누어 주세요. 원본은 유지했습니다.');
  const segments: SourceSegment[] = [
    ...documentSegments(content.documents),
    ...(content.audio ? structuredClone([...content.results].reverse().find(r => r.source?.audio?.sha256 === content.audio?.sha256)?.segments.filter(s => s.start !== null && !s.label) ?? []) : []),
    ...(content.sourceText.match(/[\s\S]{1,2000}/g) ?? []).flatMap((text, index) =>
      text.trim() ? [{ id: `note:${index}`, label: `필기 ${index + 1}`, start: null, end: null, text, role: 'material' as const }] : []),
  ];
  const groups: SourceSegment[][] = [];
  let batch: SourceSegment[] = [], length = 0;
  for (const segment of segments) {
    if (segment.text.length > budget - 4000) throw new DomainError('SOURCE_SIZE', '하나의 원문 구간이 너무 깁니다. 원문을 보존하고 사용할 구간을 직접 나누어 주세요.');
    if (length + segment.text.length > budget - 4000 && batch.length) { groups.push(batch); batch = []; length = 0; }
    batch.push({ ...segment, role: 'material' });
    length += segment.text.length;
  }
  if (batch.length) groups.push(batch);
  // Adjacent real source segments provide context; IDs and originals stay intact.
  const batches = groups.map((rows, index) => [
    ...(groups[index - 1]?.slice(-1) ?? []), ...rows, ...(groups[index + 1]?.slice(0, 1) ?? []),
  ]);
  return { batches, sourceIdentity: materialInputFingerprint(content), totalSegments: segments.length };
}
