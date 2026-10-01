import { MATERIAL_CONTRACT_VERSION, sourceRole, type SourceRole, type EvidenceType, type MaterialDiagnostic, type MaterialRange, type MaterialView } from './study-gpt-contract.ts';
import { DomainError, type Entity } from './model.ts';
import { validateStudyAIRequest, type StudyAIRequest } from './study-ai-request.ts';
import { validateDocuments, type MaterialDocument, type MaterialFile } from './material-source';
import {
  validateQuiz,
  validateMap,
  validateQuizAttempts,
  type MaterialMap,
  type MaterialQuizQuestion,
  type MaterialQuizAttempt,
} from './material-learning';

export const MAX_AUDIO_BYTES = 50 * 1024 * 1024;
export const MAX_SOURCE_TEXT = 150_000;
export interface SourceSegment {
  role?: SourceRole;
  id: string;
  start: number | null;
  end: number | null;
  text: string;
  originalText?: string;
  label?: string;
}
export interface StudyCard {
  evidenceType?: EvidenceType;
  id: string;
  question: string;
  answer: string;
  sourceIds: string[];
  excluded: boolean;
  originalQuestion?: string;
  originalAnswer?: string;
}
export interface MaterialResult {
  contractVersion?: string;
  diagnostics?: MaterialDiagnostic[];
  range?: MaterialRange;
  id: string;
  at: string;
  model: string;
  promptVersion?: string;
  request?: StudyAIRequest;
  source?: { text: string; audio: MaterialContent['audio']; documents?: MaterialDocument[] };
  segments: SourceSegment[];
  summary: { text: string; sourceIds: string[]; originalText?: string; evidenceType?: EvidenceType }[];
  cards: StudyCard[];
  quiz?: MaterialQuizQuestion[];
  map?: MaterialMap;
  originalMap?: MaterialMap;
}
export interface MaterialContent {
  title: string;
  subjectId: string;
  topicId: string | null;
  sourceText: string;
  audio: MaterialFile | null;
  results: MaterialResult[];
  aiRequest?: StudyAIRequest;
  documents?: MaterialDocument[];
  quizAttempts?: MaterialQuizAttempt[];
  tutorDraft?: string;
  learningView?: MaterialView;
  generationProgress?: { sourceIdentity: string; index: number; completed: { index: number; resultId: string }[] };
  originalStorage?: 'device' | 'private-server';
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
    result?.promptVersion !== undefined &&
    (!text(result.promptVersion, 160) || !result.promptVersion.trim())
  )
    invalid('생성 당시 GPT 지침 버전을 확인해 주세요.');
  if (result?.request !== undefined) validateStudyAIRequest(result.request);
  if (result?.source?.documents !== undefined) validateDocuments(result.source.documents);
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
    if (segment.label !== undefined && !text(segment.label, 1000))
      invalid('원문 위치를 확인해 주세요.');
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
    if (segment.role !== undefined && !['material', 'problem', 'attempt', 'reference', 'focus'].includes(segment.role)) invalid('자료 역할을 확인해 주세요.');
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
    if (
      !text(row.text, 10_000) ||
      !row.text.trim() ||
      !references(row.sourceIds) ||
      (row.originalText !== undefined && !text(row.originalText, 10_000))
    )
      invalid('요약의 원문 근거를 확인하지 못했습니다.');
  if (result.diagnostics !== undefined) {
    if (!Array.isArray(result.diagnostics) || result.diagnostics.length > 10) invalid('확인할 내용의 형식을 확인해 주세요.');
    for (const d of result.diagnostics) {
      if (!d || !['needs-input', 'insufficient-evidence', 'partial'].includes(d.kind) || !text(d.message, 4000) || !d.message.trim() ||
          (d.questions !== undefined && (!Array.isArray(d.questions) || d.questions.length > 2 || d.questions.some(q => !text(q, 1000) || !q.trim()))) ||
          (d.sourceIds !== undefined && (!Array.isArray(d.sourceIds) || d.sourceIds.length > 50 || d.sourceIds.some(id => !ids.has(id))))) invalid('확인할 내용의 형식을 확인해 주세요.');
    }
  }
  if (result.range !== undefined && (!Number.isSafeInteger(result.range.index) || !Number.isSafeInteger(result.range.count) || result.range.index < 0 || result.range.count < 1 || result.range.index >= result.range.count || !text(result.range.sourceIdentity, 160) || !result.range.sourceIdentity || !Number.isSafeInteger(result.range.totalSegments) || result.range.totalSegments < 0 || !Array.isArray(result.range.sourceIds) || !result.range.sourceIds.length || result.range.sourceIds.length > 6000 || result.range.sourceIds.some(id => !ids.has(id)))) invalid('처리 범위와 원문 위치를 확인해 주세요.');
  if (result.range?.overlapIds !== undefined && (!Array.isArray(result.range.overlapIds) || result.range.overlapIds.some(id => !result.range!.sourceIds.includes(id)))) invalid('겹치는 원문 구간을 확인해 주세요.');
  if (result.contractVersion !== undefined && result.contractVersion !== MATERIAL_CONTRACT_VERSION) invalid('결과 계약 버전을 확인해 주세요.');
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
  if (result.quiz !== undefined) validateQuiz(result.quiz, ids);
  if (result.map !== undefined) validateMap(result.map, ids);
  if (result.originalMap !== undefined) validateMap(result.originalMap, ids);
  if (result.contractVersion === MATERIAL_CONTRACT_VERSION) {
    const task = result.request?.task ?? 'summary';
    const roles = new Set(task === 'feedback' || task === 'practice' || task === 'hint' ? ['material', 'problem', 'reference'] : ['material']);
    const validBasis = (sourceIds: string[]) => sourceIds.some(id => roles.has(sourceRole(result.segments.find(s => s.id === id)!)));
    for (const item of [...result.summary, ...result.cards]) {
      if (item.evidenceType !== undefined && !['material-grounded', 'general-supplement'].includes(item.evidenceType)) invalid('자료 근거와 보충 설명을 구별해 주세요.');
      if (!validBasis(item.sourceIds)) invalid('질문·초점이나 사용자 시도만으로 답의 원문 근거를 삼을 수 없습니다.');
      if (['tutor','source-qa','questions','quiz'].includes(task) && item.evidenceType === 'general-supplement') invalid('이 작업은 일반 지식 보충으로 자료의 답을 대체할 수 없습니다.');
      if ('answer' in item && item.evidenceType === 'general-supplement') invalid('자료 기반 문항은 제공된 원문으로 답할 수 있어야 합니다.');
    }
    for (const q of result.quiz ?? []) if (!validBasis(q.sourceIds)) invalid('퀴즈의 자료 근거를 확인해 주세요.');
    for (const n of [...(result.map?.nodes ?? []), ...(result.map?.edges ?? [])]) if (!validBasis(n.sourceIds)) invalid('개념도의 자료 근거를 확인해 주세요.');
  }

}
export function validateMaterialContent(value: unknown): asserts value is MaterialContent {
  const row = value as MaterialContent;
  if (row?.originalStorage !== undefined && !['device', 'private-server'].includes(row.originalStorage)) invalid('원본 보관 위치를 확인해 주세요.');
  if (row?.generationProgress !== undefined) {
    const p = row.generationProgress;
    if (!text(p.sourceIdentity, 160) || !Number.isSafeInteger(p.index) || p.index < 0 || !Array.isArray(p.completed) || p.completed.length > 30 || p.completed.some(c => !Number.isSafeInteger(c.index) || c.index < 0 || !text(c.resultId, 256) || !c.resultId)) invalid('이어갈 범위를 확인해 주세요.');
  }
  if (row?.learningView !== undefined) {
    const v = row.learningView;
    if (!v || !['summary','transcript','cards','quiz','map'].includes(v.tab) || !Array.isArray(v.revealed) || !Array.isArray(v.helped) || v.revealed.length > 3000 || v.helped.length > 30 || [...v.revealed, ...v.helped].some(id => !text(id, 520)) || (v.resultId !== undefined && !text(v.resultId, 256)) || (v.cardId !== undefined && !text(v.cardId, 256)) || (v.activeDisclosure !== undefined && !['hidden','revealed'].includes(v.activeDisclosure))) invalid('학습 화면의 위치와 공개 이력을 확인해 주세요.');
  }
  // Draft requests may be incomplete; required problem/attempt/criteria are checked at generation.
  if (row?.aiRequest !== undefined) validateStudyAIRequest(row.aiRequest, false);
  if (row?.documents !== undefined) validateDocuments(row.documents);
  if (row?.quizAttempts !== undefined) validateQuizAttempts(row.quizAttempts);
  if (row?.tutorDraft !== undefined && !text(row.tutorDraft, 10000))
    invalid('질문을 1만 자 이내로 넣어 주세요.');
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
  if (row.audio?.cloudPath !== undefined && (typeof row.audio.cloudPath !== 'string' || !row.audio.cloudPath.endsWith(`/audio/${row.audio.sha256}`) || !/^[a-zA-Z0-9-]+\/(personal|test)\/audio\/[a-f0-9]{64}$/.test(row.audio.cloudPath))) invalid('원본 음성의 서버 위치를 확인해 주세요.');
  if (!row.audio && !row.sourceText.trim() && !row.documents?.length)
    invalid('녹음 파일이나 강의 내용을 넣어 주세요.');
  const ids = new Set<string>();
  for (const result of row.results) {
    validateMaterialResult(result);
    if (ids.has(result.id)) invalid('생성 결과의 식별자가 중복되었습니다.');
    ids.add(result.id);
  }
  if (row.generationProgress?.completed.some(c => { const r = row.results.find(r => r.id === c.resultId); return !r?.range || r.range.sourceIdentity !== row.generationProgress!.sourceIdentity || r.range.index !== c.index; })) invalid('처리 범위의 결과 연결을 확인해 주세요.');
}

export function materialContent(row: MaterialContent): MaterialContent {
  return structuredClone({
    title: row.title,
    subjectId: row.subjectId,
    topicId: row.topicId,
    sourceText: row.sourceText,
    audio: row.audio,
    results: row.results,
    ...(row.aiRequest ? { aiRequest: row.aiRequest } : {}),
    ...(row.documents ? { documents: row.documents } : {}),
    ...(row.quizAttempts ? { quizAttempts: row.quizAttempts } : {}),
    ...(row.tutorDraft !== undefined ? { tutorDraft: row.tutorDraft } : {}),
    ...(row.learningView ? { learningView: row.learningView } : {}),
    ...(row.generationProgress ? { generationProgress: row.generationProgress } : {}),
    ...(row.originalStorage ? { originalStorage: row.originalStorage } : {}),
  });
}

/** An attempt snapshots actual generated questions. Submitted answers remain historical. */
export function validateMaterialTransition(previous: MaterialContent | undefined, next: MaterialContent, owner?: {userId: string; namespace: string}) {
  const canonical = (value: unknown): string => Array.isArray(value) ? '[' + value.map(canonical).join(',') + ']' : value && typeof value === 'object' ? '{' + Object.entries(value).filter(([, v]) => v !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => JSON.stringify(k) + ':' + canonical(v)).join(',') + '}' : JSON.stringify(value);
  for (const attempt of next.quizAttempts ?? []) {
    const source = next.results.find(r => r.id === attempt.resultId);
    if (!source?.quiz || !attempt.questions.length || attempt.questions.some(q => !source.quiz!.some(original => canonical(original) === canonical(q)))) invalid('퀴즈 시도의 출제 원문을 확인해 주세요.');
  }
  for (const old of previous?.quizAttempts ?? []) {
    const saved = next.quizAttempts?.find(a => a.id === old.id);
    if (!saved || old.helpedQuestionIds?.some(id => !saved.helpedQuestionIds?.includes(id)) || old.submittedAt && canonical(saved) !== canonical(old) || saved.resultId !== old.resultId || saved.at !== old.at || canonical(saved.questions) !== canonical(old.questions)) invalid('기존 퀴즈 응답과 출제 당시 내용을 유지해 주세요. 새 시도로 다시 풀 수 있습니다.');
  }
  if (owner) {
    const location = (file: MaterialFile | null | undefined, kind: 'audio' | 'document') => { if (file?.cloudPath !== undefined && file.cloudPath !== `${owner.userId}/${owner.namespace}/${kind}/${file.sha256}`) invalid('다른 계정·공간의 원본 파일을 참조할 수 없습니다.'); };
    location(next.audio, 'audio'); for (const d of next.documents ?? []) location(d.file, 'document');
    for (const r of next.results) { location(r.source?.audio, 'audio'); for (const d of r.source?.documents ?? []) location(d.file, 'document'); }
  }
}
