/** Shared domain contracts. A study check records an attempt, never mastery. */
export type Namespace = 'demo' | 'personal' | 'test';
export type Scope = { kind: 'semester'; semesterId: string } | { kind: 'independent' } | { kind: 'unassigned' };
export interface Entity {
  id: string; userId: string; namespace: Namespace;
  createdAt: string; updatedAt: string; version: number; deletedAt: string | null;
  deletionBatchId?: string;
}
export interface Semester extends Entity { name: string; order: number }
export interface Subject extends Entity { scope: Scope; name: string; order: number }
export interface OutlineNode extends Entity {
  subjectId: string; parentId: string | null; role: 'unit' | 'outline' | 'topic'; name: string; order: number;
}
export type DateEvidence = { kind: 'exact'; date: string } | { kind: 'range'; from: string; to: string } | { kind: 'unknown' };
export interface StudySession extends Entity { dateEvidence: DateEvidence; legacyPayload?: unknown }
export type ActivityStatus = 'unchecked' | 'checked' | 'na' | 'deferred';
export interface WrittenReview { answer: string; checked: boolean; updatedAt: string }
export interface TraceDefinition { id: string; group: string; label: string; version: number; mode: 'required' | 'optional' | 'excluded' }
export interface TraceItem {
  status: ActivityStatus; note?: string; examReview?: WrittenReview;
  definition?: TraceDefinition;
  repeats?: { id: string; kind: 'exact' | 'minimum' | 'unknown'; count: number | null; note?: string; dateEvidence?: DateEvidence }[];
}
export type TraceState = Record<string, TraceItem>;
export interface StudyRecord extends Entity {
  sessionId: string; subjectId: string; targetId: string; body: string; done: boolean;
  dateEvidence: DateEvidence; trace: TraceState;
}
export type NarrativeKind = 'subject-overview' | 'unit-introduction' | 'topic-note' | 'free-note';
export interface Narrative extends Entity { kind: NarrativeKind; ownerId: string | null; body: string }
export interface Criteria extends Entity { items: TraceDefinition[] }
export interface CriteriaAssignment extends Entity { scope: 'topic' | 'subject' | 'global'; ownerId: string | null; criteriaId: string }
export interface CriteriaChange { id: string; targetId: string; scope: 'topic' | 'subject' | 'all'; expectedToken: string; items: TraceDefinition[] }
export type EntityCollection = 'semesters' | 'subjects' | 'nodes' | 'sessions' | 'records' | 'narratives' | 'criteria' | 'criteriaAssignments';
export type DomainEntity = Semester | Subject | OutlineNode | StudySession | StudyRecord | Narrative | Criteria | CriteriaAssignment;
export interface Revision extends Entity {
  collection: EntityCollection; entityId: string; operationId: string; parentRevisionId: string | null;
  before: DomainEntity | null; after: DomainEntity; reversesRevisionId?: string;
}
export interface AppState {
  schemaVersion: 1; userId: string; namespace: Namespace;
  semesters: Semester[]; subjects: Subject[]; nodes: OutlineNode[]; sessions: StudySession[];
  records: StudyRecord[]; narratives: Narrative[]; revisions: Revision[];
  /** Optional for existing schema-1 demo snapshots; reading never rewrites them. */
  criteria?: Criteria[]; criteriaAssignments?: CriteriaAssignment[];
  /** Canonical operation payloads make repeated requests idempotent. */
  appliedOps: Record<string, string>;
}
export interface CommandContext { opId: string; at: string; userId: string; namespace?: Namespace }
export interface OutlineTableTopic { key: string; name: string }
export interface OutlineTableUnit { key: string; name: string; topics: OutlineTableTopic[] }
export interface OutlineTableCourse { key: string; name: string; units: OutlineTableUnit[] }
export interface OutlineTableInput { scope: Scope; courses: OutlineTableCourse[]; choices: Record<string, string> }
export type RecordEntry = { targetId: string; subjectId?: string; done: boolean; body?: string; trace?: TraceState; expectedVersion?: number };
export type Command = CommandContext & (
  | { type: 'addSemester'; id: string; name: string }
  | { type: 'addSubject'; id: string; name: string; scope: Scope }
  | { type: 'addNode'; id: string; subjectId: string; parentId: string | null; role: OutlineNode['role']; name: string }
  | { type: 'addNodes'; subjectId: string; parentId: string | null; role: OutlineNode['role']; entries: { id: string; name: string }[]; expectedToken: string; duplicateNames?: 'create' }
  | { type: 'reorderNodes'; subjectId: string; parentId: string | null; ids: string[]; expectedToken: string }
  | ({ type: 'createOutlineTable'; expectedToken: string; ids: Record<string, string> } & OutlineTableInput)
  | { type: 'renameNode'; id: string; name: string; expectedVersion: number }
  | { type: 'moveNode'; id: string; parentId: string | null; order?: number; expectedVersion: number }
  | { type: 'trashNode' | 'restoreNode'; id: string; expectedVersion: number }
  | { type: 'saveRecords'; sessionId: string; entries: RecordEntry[]; dateEvidence: DateEvidence }
  | { type: 'updateRecord'; id: string; expectedVersion: number; patch: Partial<Pick<StudyRecord, 'body' | 'done' | 'dateEvidence' | 'trace'>> }
  | { type: 'updateNarrative'; id: string; kind: NarrativeKind; ownerId: string | null; body: string; expectedVersion: number }
  | ({ type: 'adjustCriteria' } & CriteriaChange)
  | { type: 'editWrittenReview'; recordId: string; expectedVersion: number; answer: string }
  | { type: 'confirmWrittenReview' | 'unconfirmWrittenReview'; recordId: string; expectedVersion: number }
  | { type: 'undoRevision'; revisionId: string; expectedVersion: number }
);
export class DomainError extends Error {
  constructor(public code: string, message: string, public details?: unknown) { super(message); this.name = 'DomainError'; }
}
export function emptyState(userId: string, namespace: Namespace): AppState {
  return { schemaVersion: 1, userId, namespace, semesters: [], subjects: [], nodes: [], sessions: [], records: [], narratives: [], revisions: [], appliedOps: {} };
}
