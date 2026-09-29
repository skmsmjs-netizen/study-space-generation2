import type { AppState, OutlineNode, Scope, Subject } from '../domain/model';

/** A return location only: no study event, timestamp, duration, check or draft. */
export interface StudyLaunchHint {
  version: 1;
  userId: string;
  namespace: AppState['namespace'];
  nodeId: string;
  subjectId: string;
  scope: Scope;
}
export interface StudyLaunchTarget { node: OutlineNode; subject: Subject; path: string[] }
type StorageAccess = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
export const studyLaunchKey = (data: Pick<AppState, 'namespace' | 'userId'>) =>
  `study-space:${data.namespace}:${encodeURIComponent(data.userId)}:study-launch:v1`;
const sameScope = (a: Scope, b: Scope) => a.kind === b.kind &&
  (a.kind !== 'semester' || b.kind === 'semester' && a.semesterId === b.semesterId);

export function resolveStudyLaunchTarget(data: AppState, nodeId: string, hint?: StudyLaunchHint): StudyLaunchTarget | null {
  const owned = (row: { userId: string; namespace: string; deletedAt: string | null }) =>
    row.userId === data.userId && row.namespace === data.namespace && !row.deletedAt;
  const node = data.nodes.find(row => row.id === nodeId && owned(row) && row.role === 'topic');
  if (!node) return null;
  const subject = data.subjects.find(row => row.id === node.subjectId && owned(row));
  if (!subject || hint && (hint.userId !== data.userId || hint.namespace !== data.namespace ||
    hint.nodeId !== node.id || hint.subjectId !== subject.id || !sameScope(hint.scope, subject.scope))) return null;
  if (subject.scope.kind === 'semester' && !data.semesters.some(row =>
    subject.scope.kind === 'semester' && row.id === subject.scope.semesterId && owned(row))) return null;
  const path = [node.name], visited = new Set([node.id]);
  let parentId = node.parentId;
  while (parentId) {
    if (visited.has(parentId)) return null;
    visited.add(parentId);
    const parent = data.nodes.find(row => row.id === parentId && row.subjectId === subject.id && owned(row));
    if (!parent) return null;
    path.unshift(parent.name); parentId = parent.parentId;
  }
  path.unshift(subject.name);
  return { node, subject, path };
}

export function readStudyLaunch(data: AppState, storage: StorageAccess = localStorage): StudyLaunchHint | null {
  const raw = storage.getItem(studyLaunchKey(data));
  if (raw === null) return null;
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object') throw Error('invalid return location');
  const hint = value as StudyLaunchHint;
  if (hint.version !== 1 || hint.userId !== data.userId || hint.namespace !== data.namespace ||
    typeof hint.nodeId !== 'string' || !hint.nodeId || typeof hint.subjectId !== 'string' || !hint.subjectId ||
    !hint.scope || !['semester', 'independent', 'unassigned'].includes(hint.scope.kind) ||
    hint.scope.kind === 'semester' && (typeof hint.scope.semesterId !== 'string' || !hint.scope.semesterId)) {
    throw Error('invalid return location');
  }
  return hint;
}

export function saveStudyLaunch(data: AppState, nodeId: string, storage: StorageAccess = localStorage): StudyLaunchHint {
  // Never overwrite an unreadable prior location merely because a new guide was opened.
  readStudyLaunch(data, storage);
  const target = resolveStudyLaunchTarget(data, nodeId);
  if (!target) throw Error('unavailable study target');
  const hint: StudyLaunchHint = { version: 1, userId: data.userId, namespace: data.namespace,
    nodeId: target.node.id, subjectId: target.subject.id, scope: { ...target.subject.scope } };
  const raw = JSON.stringify(hint), key = studyLaunchKey(data);
  storage.setItem(key, raw);
  if (storage.getItem(key) !== raw) throw Error('return location was not confirmed');
  return hint;
}

export function clearStudyLaunch(data: AppState, storage: StorageAccess = localStorage): void {
  // Validate before removing: unexpected content is retained for investigation.
  readStudyLaunch(data, storage);
  const key = studyLaunchKey(data);
  storage.removeItem(key);
  if (storage.getItem(key) !== null) throw Error('return location removal was not confirmed');
}
