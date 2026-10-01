import { createEmptyCard, fsrs, type Card, type StepUnit } from 'ts-fsrs';
import { clozeNumbers } from './recall-cloze';
import { DomainError, type AppState, type OutlineNode, type RecallCard, type RecallMemory, type RecallOptions, type RecallReview } from './model';

export const DEFAULT_RECALL_OPTIONS: RecallOptions = { retention: 0.9, newPerDay: 20, learningMinutes: [1, 10], relearningMinutes: [10], maximumDays: 36500 };
export const RECALL_GRADES = [1, 2, 3, 4] as const;
export const RECALL_LABELS = ['다시', '어려움', '알맞음', '쉬움'] as const;
const invalid = () => { throw new DomainError('INVALID_RECALL', '복습 설정과 카드의 저장 내용을 확인해 주세요. 원문은 변경하지 않았습니다.'); };
const isDate = (v: unknown) => typeof v === 'string' && Number.isFinite(Date.parse(v));
export function validateRecallOptions(options: RecallOptions) {
  if (options?.burySiblings !== undefined && typeof options.burySiblings !== 'boolean') invalid();
  if (options?.parameters !== undefined && (!Array.isArray(options.parameters) || options.parameters.length !== 21 || options.parameters.some((v, i) => !Number.isFinite(v) || v < 0 || v > 100 || i < 4 && v < .001 || i === 20 && (v < .1 || v > .8)))) invalid();
  if (options?.optimizedAt !== undefined && !isDate(options.optimizedAt) || options?.optimizedReviews !== undefined && (!Number.isSafeInteger(options.optimizedReviews) || options.optimizedReviews < 1)) invalid();
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
  if (card.deckId !== undefined && !state.recallPreferences?.some(row => row.id === card.deckId && row.deckName !== undefined)) invalid();
  if (card.suspended !== undefined && typeof card.suspended !== 'boolean') invalid();
  if (card.cloze && (typeof card.cloze.noteId !== 'string' || !card.cloze.noteId || !Number.isSafeInteger(card.cloze.number) || !card.suspended && !clozeNumbers(card.cloze.source).includes(card.cloze.number))) invalid();
  if (card.importSource && (typeof card.importSource.key !== 'string' || !card.importSource.key || JSON.stringify(card.importSource).length > 300000)) invalid();
  if (card.front !== undefined && (typeof card.front !== 'string' || !card.front.trim() || card.front.length > 100000)) invalid();
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
export function recallPreference(data: AppState, deckId?: string) { return data.recallPreferences?.find(row => !row.deletedAt && (deckId ? row.id === deckId && row.deckName !== undefined : row.deckName === undefined)); }
export function recallOptions(data: AppState, deckId?: string): RecallOptions { return recallPreference(data, deckId)?.options ?? recallPreference(data)?.options ?? DEFAULT_RECALL_OPTIONS; }
export function recallDecks(data: AppState) { return (data.recallPreferences ?? []).filter(row => !row.deletedAt && row.deckName !== undefined); }
export function recallCard(data: AppState, topicId: string) { return data.recallCards?.find(row => !row.deletedAt && row.topicId === topicId && row.front === undefined); }
export function serializeMemory(card: Card): RecallMemory {
  return { ...card, due: card.due.toISOString(), ...(card.last_review ? { last_review: card.last_review.toISOString() } : {}) } as RecallMemory;
}
export function newRecallMemory(at: string) { return serializeMemory(createEmptyCard(at)); }
export function recallPreview(memory: RecallMemory | undefined, at: string, options: RecallOptions, reviews: readonly RecallReview[] = []) {
  validateRecallOptions(options);
  const scheduler = fsrs({ request_retention: options.retention, maximum_interval: options.maximumDays,
    ...(options.parameters ? { w: options.parameters } : {}), learning_steps: options.learningMinutes.map(v => `${v}m` as StepUnit), relearning_steps: options.relearningMinutes.map(v => `${v}m` as StepUnit), enable_fuzz: false });
  let current = memory ?? newRecallMemory(at);
  if (options.parameters && reviews.length) {
    let replayed = createEmptyCard(reviews[0].at);
    for (const review of reviews) replayed = scheduler.next(replayed, review.at, review.rating).card;
    // Apply trained memory state on the next answer, while retaining the already booked date and learning step.
    current = { ...current, stability: replayed.stability, difficulty: replayed.difficulty };
  }
  return scheduler.repeat(current, at);
}
export function intervalLabel(due: Date, at: string) {
  const minutes = Math.max(1, Math.round((due.getTime() - Date.parse(at)) / 60000));
  return minutes < 60 ? `${minutes}분` : minutes < 1440 ? `${Math.round(minutes / 60)}시간` : `${Math.round(minutes / 1440)}일`;
}
export function recallDay(at: string) { const d = new Date(at); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
/** Legacy topic keys stay unchanged; custom questions use their own card identity. */
export interface RecallPrompt extends OutlineNode { topicId?: string }
export function recallPrompts(data: AppState, topics: OutlineNode[], deckId = 'all'): RecallPrompt[] {
  const byTopic = new Map<string, RecallCard[]>();
  for (const card of data.recallCards ?? []) if (!card.deletedAt && !card.suspended && card.front !== undefined && (deckId === 'all' || (card.deckId ?? 'default') === deckId)) {
    const group = byTopic.get(card.topicId) ?? []; group.push(card); byTopic.set(card.topicId, group);
  }
  return topics.flatMap(topic => {
    const legacy = recallCard(data, topic.id);
    return [...((!legacy?.suspended && (deckId === 'all' || (legacy?.deckId ?? 'default') === deckId)) ? [topic] : []),
      ...(byTopic.get(topic.id) ?? []).map(card => ({ ...topic, id: card.id, topicId: topic.id, name: card.front! }))];
  });
}
export function promptCard(data: AppState, prompt: RecallPrompt) {
  return prompt.topicId ? data.recallCards?.find(card => !card.deletedAt && card.id === prompt.id && card.topicId === prompt.topicId) : recallCard(data, prompt.id);
}
export function recallQueue(data: AppState, topics: RecallPrompt[], at: string, excluded: readonly string[] = []) {
  const end = new Date(at); end.setHours(23, 59, 59, 999);
  const today = recallDay(at);
  // Count first actual reviews across the whole account, rather than resetting with a filter.
  const introduced = new Map<string, number>();
  for (const row of data.recallCards ?? []) if (row.reviews.length && recallDay(row.reviews[0].at) === today) { const key = row.deckId ?? 'default'; introduced.set(key, (introduced.get(key) ?? 0) + 1); }
  const answered = new Map<string, Set<string>>();
  for (const row of data.recallCards ?? []) if (row.cloze && row.reviews.some(review => recallDay(review.at) === today)) { const ids = answered.get(row.cloze.noteId) ?? new Set<string>(); ids.add(row.id); answered.set(row.cloze.noteId, ids); }
  const buried = (card: RecallCard | undefined) => !!card?.cloze && recallOptions(data, card.deckId).burySiblings !== false && [0, 2].includes(card.memory.state) && [...(answered.get(card.cloze.noteId) ?? [])].some(id => id !== card.id);
  const due = topics.filter(topic => {
    const card = promptCard(data, topic);
    if (excluded.includes(topic.id) || buried(card) || !card || card.memory.state === 0 && !card.manualDue) return false;
    return Date.parse(card.manualDue ?? card.memory.due) <= (card.manualDue || card.memory.state !== 2 ? Date.parse(at) : end.getTime());
  }).sort((a, b) => {
    const left = promptCard(data, a)!, right = promptCard(data, b)!;
    const learning = (card: RecallCard) => !card.manualDue && [1, 3].includes(card.memory.state) ? 0 : 1;
    return learning(left) - learning(right) || Date.parse(left.manualDue ?? left.memory.due) - Date.parse(right.manualDue ?? right.memory.due);
  });
  const newTopics = topics.filter(topic => { const card = promptCard(data, topic); return !excluded.includes(topic.id) && !buried(card) && (!card || card.memory.state === 0 && !card.manualDue); });
  const fresh = newTopics.filter(topic => { const deckId = promptCard(data, topic)?.deckId, key = deckId ?? 'default', count = introduced.get(key) ?? 0;
    if (count >= recallOptions(data, deckId).newPerDay) return false; introduced.set(key, count + 1); return true; });
  return { due, fresh, buried: topics.filter(topic => buried(promptCard(data, topic))).length, newRemaining: newTopics.length,
    nextDue: topics.map(topic => promptCard(data, topic)).filter((card): card is RecallCard => !!card && (!!card.manualDue || card.memory.state !== 0))
      .map(card => card.manualDue ?? card.memory.due).filter(d => Date.parse(d) > Date.parse(at)).sort()[0] };
}
