import type { AppState, DomainEntity, Entity, MemoStroke, QuickMemo } from './model';
import type { MemoryTest, MemoryCardContent } from './memory-test';
import type { StudyMaterial } from './study-material';
import { recallPath } from './topic-recall';
import type { CheckGoal, RecommendationWorkspace, ResponseDraft } from './recommendation-workspace';
import { makeResultEvent } from './recommendation-workspace';
function canonical(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.entries(value).filter(([,v]) => v !== undefined).sort(([a],[b]) => a.localeCompare(b)).map(([k,v]) => JSON.stringify(k)+':'+canonical(v)).join(',') + '}';
  return JSON.stringify(value);
}

/** A reference to an exact saved revision, with an independent copy of the response. */
export interface PerformanceSource {
  kind: 'exam-memo' | 'memory-question'; id: string; version: number; itemId?: string;
  topicId: string; body: string; strokes: MemoStroke[]; question?: string; reference?: string;
  referenceStrokes?: MemoStroke[]; performedAt: string | null;
}
export interface MaterialCardSource {
  materialId: string; materialVersion: number; resultId: string; cardId: string; reviewed: true;
}
export interface CodeTopicLink { exampleId: string; topicId: string }
const owned = (data: AppState, row: Entity) => row.userId === data.userId && row.namespace === data.namespace;
export function sourceRevision(data: AppState, collection: 'memos' | 'memoryTests' | 'studyMaterials', id: string, version: number): DomainEntity | undefined {
  const live = data[collection]?.find(row => row.id === id && row.version === version && owned(data, row));
  if (live) return live;
  for (const revision of data.revisions) {
    if (revision.collection !== collection || revision.entityId !== id || !owned(data, revision)) continue;
    const row = [revision.after, revision.before].find(row => row?.version === version && row.id === id && owned(data, row));
    if (row) return row;
  }
}
export function activeTopic(data: AppState, id: string) {
  const topic = data.nodes.find(n => n.id === id && n.role === 'topic' && !n.deletedAt && owned(data, n));
  return topic && data.subjects.some(s => s.id === topic.subjectId && !s.deletedAt && owned(data, s)) && recallPath(data.nodes, id).every(n => !n.deletedAt) ? topic : undefined;
}
export function performanceSource(data: AppState, kind: PerformanceSource['kind'], id: string, itemId?: string, version?: number): PerformanceSource {
  const collection = kind === 'exam-memo' ? 'memos' : 'memoryTests';
  const row = version === undefined ? data[collection]?.find(row => row.id === id && !row.deletedAt && owned(data, row)) : sourceRevision(data, collection, id, version);
  if (!row) throw Error('저장된 답안의 원문을 찾지 못했습니다.');
  if (kind === 'exam-memo') {
    const memo = row as QuickMemo;
    if (!memo.id.startsWith('exam-practice:') || !memo.ownerId) throw Error('주제와 연결된 시험 연습 메모를 선택해 주세요.');
    // Free edits to a memo are not parsed into a guessed performance timestamp.
    return { kind, id, version: row.version, topicId: memo.ownerId, body: memo.body, strokes: structuredClone(memo.strokes), performedAt: null };
  }
  const test = row as MemoryTest, question = test.questions.find(q => q.cardId === itemId);
  if (!question) throw Error('시험 당시의 문항을 찾지 못했습니다.');
  return { kind, id, version: row.version, itemId, topicId: question.topicId, body: question.response, strokes: structuredClone(question.responseStrokes), question: question.question, reference: question.answer, referenceStrokes: structuredClone(question.strokes), performedAt: test.endedAt };
}
export function validatePerformanceSource(value: PerformanceSource, data: AppState) {
  if (!value || !['exam-memo', 'memory-question'].includes(value.kind) || typeof value.id !== 'string' || !Number.isSafeInteger(value.version) || value.version < 1) throw Error('답안의 출처를 확인해 주세요.');
  const original = performanceSource(data, value.kind, value.id, value.itemId, value.version);
  if (canonical(original) !== canonical(value)) throw Error('수행 결과에 연결된 답안이 원문과 다릅니다.');
}
export function sourcePerformanceId(source: PerformanceSource) {
  return 'source-performance:' + [source.kind, source.id, source.itemId ?? ''].map(encodeURIComponent).join(':');
}
export function sourceEventId(source: PerformanceSource, goalId: string) {
  return 'source-result:' + [source.kind, source.id, source.itemId ?? '', goalId].map(encodeURIComponent).join(':');
}
export function linkPerformance(data: AppState, workspace: RecommendationWorkspace, source: PerformanceSource, goal: CheckGoal, response: ResponseDraft, at: string) {
  validatePerformanceSource(source, data);
  const live = performanceSource(data, source.kind, source.id, source.itemId);
  if (live.version !== source.version) throw Error('답안이 다른 곳에서 바뀌었습니다. 다시 열어 원문을 확인해 주세요.');
  if (!activeTopic(data, source.topicId) || goal.targetId !== source.topicId || goal.ended || !workspace.goals.some(g => g.id === goal.id && g.targetId === source.topicId)) throw Error('이 답안의 주제에서 확인할 내용을 선택해 주세요.');
  if (source.kind === 'memory-question' && !source.body.trim() && !source.strokes.length && ['pass', 'fail'].includes(response.result)) throw Error('답하지 않은 문항은 미확인으로 남겨 주세요.');
  const id = sourceEventId(source, goal.id), previous = workspace.events.filter(e => e.id === id).sort((a,b) => b.revision-a.revision)[0];
  // A later verdict or another criterion is still the same saved performance.
  const firstOccurrence = workspace.events.filter(e => e.source && sourcePerformanceId(e.source) === sourcePerformanceId(source) && e.occurredAt).map(e => e.occurredAt!).sort()[0];
  const event = { ...makeResultEvent(goal, { ...response, answer: source.body }, workspace, at, id), source: structuredClone(source), occurredAt: source.performedAt ?? firstOccurrence ?? at, revision: (previous?.revision ?? 0) + 1 };
  // Revisions are retained under the same event ID; canonical counting sees one performance.
  return { ...workspace, revision: workspace.revision + 1, events: [...workspace.events, event] };
}
export function validateMaterialCardSource(content: MemoryCardContent, data: AppState, requireCurrent = false) {
  const source = content.materialSource;
  if (!source) return;
  if (source.reviewed !== true || !Number.isSafeInteger(source.materialVersion) || source.materialVersion < 1 || ![source.materialId, source.resultId, source.cardId].every(id => typeof id === 'string' && !!id)) throw Error('카드의 원자료와 확인 여부를 확인해 주세요.');
  const material = sourceRevision(data, 'studyMaterials', source.materialId, source.materialVersion) as StudyMaterial | undefined;
  const card = material?.results.find(r => r.id === source.resultId)?.cards.find(c => c.id === source.cardId);
  if (!material || !card || !data.nodes.some(n => n.id === content.topicId && n.subjectId === material.subjectId)) throw Error('카드의 원자료와 주제가 연결되지 않습니다.');
  if (requireCurrent && (material.deletedAt || card.excluded || data.studyMaterials?.find(m => m.id === material.id)?.version !== source.materialVersion || card.question !== content.question || card.answer !== content.answer)) throw Error('원자료가 바뀌었습니다. 저장된 카드와 원문을 다시 확인해 주세요.');
}
export function validateLearningLinks(workspace: RecommendationWorkspace, data: AppState) {
  for (const event of workspace.events) if (event.source) {
    validatePerformanceSource(event.source, data);
    if (event.targetId !== event.source.topicId || event.answer !== event.source.body || event.id !== sourceEventId(event.source, event.facet)) throw Error('결과와 원문 답안의 연결을 확인해 주세요.');
  }
  if (workspace.codeLinks !== undefined && !Array.isArray(workspace.codeLinks)) throw Error('코드 예제의 주제 연결을 확인해 주세요.');
  const ids = new Set<string>();
  for (const link of workspace.codeLinks ?? []) {
    if (!link || ids.has(link.exampleId) || !data.codeExamples?.some(e => e.id === link.exampleId && owned(data, e)) || !data.nodes.some(n => n.id === link.topicId && n.role === 'topic' && owned(data, n))) throw Error('코드 예제의 주제 연결을 확인해 주세요.');
    ids.add(link.exampleId);
  }
}
