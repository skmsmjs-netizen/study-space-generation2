import type { AppState, Command, MemoStroke, OutlineNode } from './model';
import { recallDay } from './recall-scheduler';

export interface RecallDraft { memoId: string; body: string; strokes?: MemoStroke[] }
export interface RecallSession {
  version: 1; subjectId: string; unitId: string; currentId: string | null;
  mode?: 'scheduled' | 'random';
  skipped?: string[];
  studyDay?: string;
  pendingReview?: Extract<Command, { type: 'reviewRecallCard' }>;
  lastReview?: { command: Extract<Command, { type: 'reviewRecallCard' }>; expectedVersion: number; subjectId?: string; unitId?: string; currentId?: string };
  pendingUndo?: Extract<Command, { type: 'undoRecallReview' }>;
  references?: Record<string, { body: string; cardId: string; expectedVersion: number }>;
  registration?: { id: string; topicId: string; front: string; reference: string; expectedVersion?: number };
  seen: string[]; round: number; drafts: Record<string, RecallDraft>;
}
export const freshRecall = (): RecallSession => ({ version: 1, mode: 'scheduled', subjectId: 'all', unitId: 'all', currentId: null, seen: [], round: 1, drafts: {} });
/** Day changes release hidden cards without removing answers, references or pending writes. */
export function recallForDay(session: RecallSession, at: string): RecallSession {
  const day = recallDay(at);
  return session.mode !== 'scheduled' || session.studyDay === day ? session : { ...session, studyDay: day, seen: [], skipped: [] };
}
export function recallPath(nodes: OutlineNode[], id: string): OutlineNode[] {
  const path: OutlineNode[] = [], visited = new Set<string>();
  let node = nodes.find(row => row.id === id);
  while (node && !visited.has(node.id)) {
    visited.add(node.id); path.unshift(node);
    node = nodes.find(row => row.id === node!.parentId);
  }
  return path;
}
export function recallTopics(data: AppState, subjectIds: string[], session: Pick<RecallSession, 'subjectId' | 'unitId'>) {
  const allowed = new Set(data.subjects.filter(row => !row.deletedAt && subjectIds.includes(row.id)).map(row => row.id));
  return data.nodes.filter(node => !node.deletedAt && node.role === 'topic' && allowed.has(node.subjectId)
    && (session.subjectId === 'all' || node.subjectId === session.subjectId)
    && (session.unitId === 'all' || recallPath(data.nodes, node.id).some(row => row.id === session.unitId))
    && recallPath(data.nodes, node.id).every(row => !row.deletedAt));
}
/** A round counts presentation, never correctness or mastery. */
export function nextRecall(session: RecallSession, topics: OutlineNode[], random = Math.random): RecallSession {
  const ids = topics.map(row => row.id);
  if (!ids.length) return { ...session, currentId: null, seen: [] };
  let seen = session.seen.filter(id => ids.includes(id));
  if (session.currentId && ids.includes(session.currentId) && !seen.includes(session.currentId)) seen = [...seen, session.currentId];
  let remaining = ids.filter(id => !seen.includes(id)), round = session.round;
  if (!remaining.length) { seen = []; round++; remaining = ids.length > 1 ? ids.filter(id => id !== session.currentId) : ids; }
  const index = Math.min(remaining.length - 1, Math.max(0, Math.floor(random() * remaining.length)));
  return { ...session, currentId: remaining[index], seen, round };
}
