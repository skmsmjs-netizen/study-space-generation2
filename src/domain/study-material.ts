import { DomainError, type Entity } from './model.ts';

export const MAX_AUDIO_BYTES = 50 * 1024 * 1024;
export const MAX_SOURCE_TEXT = 150_000;
export interface SourceSegment {
  id: string;
  start: number | null;
  end: number | null;
  text: string;
  originalText?: string;
}
export interface StudyCard {
  id: string;
  question: string;
  answer: string;
  sourceIds: string[];
  excluded: boolean;
  originalQuestion?: string;
  originalAnswer?: string;
}
export interface MaterialResult {
  id: string;
  at: string;
  model: string;
  source?: { text: string; audio: MaterialContent['audio'] };
  segments: SourceSegment[];
  summary: { text: string; sourceIds: string[] }[];
  cards: StudyCard[];
}
export interface MaterialContent {
  title: string;
  subjectId: string;
  topicId: string | null;
  sourceText: string;
  audio: { key: string; name: string; type: string; size: number; sha256: string } | null;
  results: MaterialResult[];
}
/** Generated materials never create study sessions, scores, or mastery claims. */
export interface StudyMaterial extends Entity, MaterialContent {}
const invalid = (message: string): never => {
  throw new DomainError('INVALID_MATERIAL', message);
};
const text = (value: unknown, max: number) => typeof value === 'string' && value.length <= max;
export function validateMaterialResult(value: unknown): asserts value is MaterialResult {
  const result = value as MaterialResult;
  if (
    !result ||
    !text(result.id, 256) ||
    !result.id ||
    !text(result.model, 160) ||
    !Number.isFinite(Date.parse(result.at)) ||
    !Array.isArray(result.segments) ||
    !result.segments.length ||
    result.segments.length > 6000 ||
    !Array.isArray(result.summary) ||
    result.summary.length > 100 ||
    !Array.isArray(result.cards) ||
    result.cards.length > 100
  )
    invalid('AI 결과의 형식을 확인하지 못했습니다. 원본은 보존했습니다.');
  const ids = new Set<string>();
  for (const segment of result.segments) {
    if (
      !text(segment.id, 256) ||
      !segment.id ||
      ids.has(segment.id) ||
      !text(segment.text, MAX_SOURCE_TEXT) ||
      !segment.text.trim()
    )
      invalid('받아쓴 문장과 식별자를 확인해 주세요.');
    if (
      !(segment.start === null && segment.end === null) &&
      !(
        typeof segment.start === 'number' &&
        Number.isFinite(segment.start) &&
        segment.start >= 0 &&
        typeof segment.end === 'number' &&
        Number.isFinite(segment.end) &&
        segment.end >= segment.start
      )
    )
      invalid('음성 구간의 시간을 확인해 주세요.');
    ids.add(segment.id);
  }
  if (result.segments.reduce((sum, row) => sum + row.text.length, 0) > MAX_SOURCE_TEXT)
    invalid('받아쓴 내용이 한 번에 처리할 수 있는 범위를 넘었습니다.');
  const references = (sources: unknown) =>
    Array.isArray(sources) &&
    sources.length > 0 &&
    sources.length <= 50 &&
    sources.every((id) => typeof id === 'string' && ids.has(id));
  for (const row of result.summary)
    if (!text(row.text, 10_000) || !row.text.trim() || !references(row.sourceIds))
      invalid('요약의 원문 근거를 확인하지 못했습니다.');
  const cards = new Set<string>();
  for (const card of result.cards) {
    if (
      !text(card.id, 256) ||
      !card.id ||
      cards.has(card.id) ||
      !text(card.question, 4000) ||
      !card.question.trim() ||
      !text(card.answer, 10_000) ||
      !card.answer.trim() ||
      !references(card.sourceIds) ||
      typeof card.excluded !== 'boolean'
    )
      invalid('카드의 질문·답·원문 근거를 확인해 주세요.');
    cards.add(card.id);
  }
}
export function validateMaterialContent(value: unknown): asserts value is MaterialContent {
  const row = value as MaterialContent;
  if (
    !row ||
    !text(row.title, 300) ||
    !row.title.trim() ||
    !text(row.subjectId, 256) ||
    !row.subjectId ||
    !(row.topicId === null || text(row.topicId, 256)) ||
    !text(row.sourceText, MAX_SOURCE_TEXT) ||
    !Array.isArray(row.results) ||
    row.results.length > 30
  )
    invalid('자료 제목·과목·본문을 확인해 주세요.');
  if (
    row.audio !== null &&
    (!row.audio ||
      !text(row.audio.key, 512) ||
      !row.audio.key ||
      !text(row.audio.name, 512) ||
      !text(row.audio.type, 100) ||
      !Number.isSafeInteger(row.audio.size) ||
      row.audio.size <= 0 ||
      row.audio.size > MAX_AUDIO_BYTES ||
      !/^[a-f0-9]{64}$/.test(row.audio.sha256))
  )
    invalid('원본 음성 파일 정보를 확인해 주세요.');
  if (!row.audio && !row.sourceText.trim()) invalid('녹음 파일이나 강의 내용을 넣어 주세요.');
  const ids = new Set<string>();
  for (const result of row.results) {
    validateMaterialResult(result);
    if (ids.has(result.id)) invalid('생성 결과의 식별자가 중복되었습니다.');
    ids.add(result.id);
  }
}
export function materialContent(row: MaterialContent): MaterialContent {
  return structuredClone({
    title: row.title,
    subjectId: row.subjectId,
    topicId: row.topicId,
    sourceText: row.sourceText,
    audio: row.audio,
    results: row.results,
  });
}
