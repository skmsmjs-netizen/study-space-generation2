import { createEmptyCard, fsrs, type Card, type StepUnit } from 'ts-fsrs';
import { DomainError, type AppState, type OutlineNode, type RecallCard, type RecallMemory, type RecallOptions } from './model';

export const DEFAULT_RECALL_OPTIONS: RecallOptions = { retention: 0.9, newPerDay: 20, learningMinutes: [1, 10], relearningMinutes: [10], maximumDays: 36500 };
export const RECALL_GRADES = [1, 2, 3, 4] as const;
export const RECALL_LABELS = ['다시', '어려움', '알맞음', '쉬움'] as const;
const invalid = () => { throw new DomainError('INVALID_RECALL', '복습 설정과 카드의 저장 내용을 확인해 주세요. 원문은 변경하지 않았습니다.'); };
const isDate = (v: unknown) => typeof v === 'string' && Number.isFinite(Date.parse(v));
export function validateRecallOptions(options: RecallOptions) {
  if (!options || !Number.isFinite(options.retention) || options.retention < 0.7 || options.retention > 0.97
    || !Number.isSafeInteger(options.newPerDay) || options.newPerDay < 0 || options.newPerDay > 9999
    || !Number.isSafeInteger(options.maximumDays) || options.maximumDays < 1 || options.maximumDays > 36500) invalid();
  for (const steps of [options.learningMinutes, options.relearningMinutes]) {
    if (!Array.isArray(steps) || steps.length > 10 || steps.some((v, i) => !Number.isSafeInteger(v) || v < 1 || v > 1440 || i > 0 && v <= steps[i - 1])) invalid();
  }
}
function validateMemory(memory: RecallMemory) {
  if (!memory || !isDate(memory.due) || memory.last_review !== undefined && !isDate(memory.last_review)
    || ![0, 1, 2, 3].includes(memory.state)) invalid();
  for (const k of ['stability', 'difficulty', 'elapsed_days', 'scheduled_days', 'learning_steps', 'reps', 'lapses'] as const)
    if (!Number.isFinite(memory[k]) || memory[k] < 0) invalid();
  for (const k of ['elapsed_days', 'scheduled_days', 'learning_steps', 'reps', 'lapses'] as const)
    if (!Number.isSafeInteger(memory[k])) invalid();
  if (memory.difficulty > 10 || memory.lapses > memory.reps) invalid();
}
export function validateRecallCard(card: RecallCard, state: AppState) {
  if (!state.nodes.some(node => node.id === card.topicId && node.role === 'topic') || typeof card.reference !== 'string' || card.reference.length > 100000
    || !Array.isArray(card.reviews) || card.manualDue !== undefined && !isDate(card.manualDue)) invalid();
  validateMemory(card.memory);
  const ids = new Set<string>();
  for (const review of card.reviews) {
    if (!review || typeof review.id !== 'string' || !review.id || ids.has(review.id) || !isDate(review.at)
      || !RECALL_GRADES.includes(review.rating) || review.memoId !== null && !(state.memos ?? []).some(memo => memo.id === review.memoId && memo.ownerId === card.topicId)) invalid();
    ids.add(review.id); validateMemory(review.before); validateMemory(review.after); validateRecallOptions(review.options);
  }
}
export function recallOptions(data: AppState): RecallOptions { return data.recallPreferences?.find(row => !row.deletedAt)?.options ?? DEFAULT_RECALL_OPTIONS; }
export function recallCard(data: AppState, topicId: string) { return data.recallCards?.find(row => !row.deletedAt && row.topicId === topicId); }
export function serializeMemory(card: Card): RecallMemory {
  return { ...card, due: card.due.toISOString(), ...(card.last_review ? { last_review: card.last_review.toISOString() } : {}) } as RecallMemory;
}
export function newRecallMemory(at: string) { return serializeMemory(createEmptyCard(at)); }
export function recallPreview(memory: RecallMemory | undefined, at: string, options: RecallOptions) {
  validateRecallOptions(options);
  const scheduler = fsrs({ request_retention: options.retention, maximum_interval: options.maximumDays,
    learning_steps: options.learningMinutes.map(v => `${v}m` as StepUnit), relearning_steps: options.relearningMinutes.map(v => `${v}m` as StepUnit), enable_fuzz: false });
  return scheduler.repeat(memory ?? newRecallMemory(at), at);
}
export function intervalLabel(due: Date, at: string) {
  const minutes = Math.max(1, Math.round((due.getTime() - Date.parse(at)) / 60000));
  return minutes < 60 ? `${minutes}분` : minutes < 1440 ? `${Math.round(minutes / 60)}시간` : `${Math.round(minutes / 1440)}일`;
}
function localDay(at: string) { const d = new Date(at); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }
export function recallQueue(data: AppState, topics: OutlineNode[], at: string) {
  const options = recallOptions(data), end = new Date(at); end.setHours(23, 59, 59, 999);
  const today = localDay(at);
  // Count first actual reviews across the whole account, rather than resetting with a filter.
  const introduced = (data.recallCards ?? []).filter(row => !row.deletedAt && row.reviews.length && localDay(row.reviews[0].at) === today).length;
  const due = topics.filter(topic => {
    const card = recallCard(data, topic.id);
    if (!card || card.memory.state === 0 && !card.manualDue) return false;
    return Date.parse(card.manualDue ?? card.memory.due) <= (card.manualDue || card.memory.state !== 2 ? Date.parse(at) : end.getTime());
  }).sort((a, b) => Date.parse(recallCard(data, a.id)!.manualDue ?? recallCard(data, a.id)!.memory.due) - Date.parse(recallCard(data, b.id)!.manualDue ?? recallCard(data, b.id)!.memory.due));
  const newTopics = topics.filter(topic => { const card = recallCard(data, topic.id); return !card || card.memory.state === 0 && !card.manualDue; });
  return { due, fresh: newTopics.slice(0, Math.max(0, options.newPerDay - introduced)), newRemaining: newTopics.length,
    nextDue: topics.map(topic => recallCard(data, topic.id)).filter((card): card is RecallCard => !!card && (!!card.manualDue || card.memory.state !== 0))
      .map(card => card.manualDue ?? card.memory.due).filter(d => Date.parse(d) > Date.parse(at)).sort()[0] };
}
