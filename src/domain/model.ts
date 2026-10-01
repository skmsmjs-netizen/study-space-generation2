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
export type MemoInk = 'ink' | 'blue' | 'green';
export interface MemoPoint { x: number; y: number; pressure: number }
export interface MemoStroke { id: string; ink: MemoInk; width: number; points: MemoPoint[]; page?: number; pressureSensitive?: boolean }
export interface MemoDocument { file: import('./material-source').MaterialFile; pages: number; startPage: number }
/** Fixed logical paper coordinates keep sketches intact when the screen resizes. */
export interface QuickMemo extends Entity { recallCardId?: string; ownerId: string | null; body: string; strokes: MemoStroke[]; document?: MemoDocument }
export interface RecallOptions { burySiblings?: boolean; retention: number; newPerDay: number; learningMinutes: number[]; relearningMinutes: number[]; maximumDays: number; parameters?: number[]; optimizedAt?: string; optimizedReviews?: number }
export interface RecallMemory {
  due: string; stability: number; difficulty: number; elapsed_days: number; scheduled_days: number;
  learning_steps: number; reps: number; lapses: number; state: number; last_review?: string;
}
export interface RecallReview { id: string; at: string; rating: 1 | 2 | 3 | 4; memoId: string | null; before: RecallMemory; after: RecallMemory; options: RecallOptions }
/** Self-reported recall schedules are separate from study checks and correctness. */
export interface RecallImportSource { key: string; guid: string; ordinal: number; deck: string; noteType: string; tags: string; fields: { name: string; value: string }[]; questionTemplate: string; answerTemplate: string; originalFront: string; originalReference: string; originalCloze?: string }
export interface RecallImportItem { id: string; topicId: string; deckId?: string; front: string; reference: string; cloze?: { noteId: string; source: string; number: number }; source: RecallImportSource }
export interface RecallCard extends Entity { deckId?: string; suspended?: boolean; clozeRemoved?: boolean; cloze?: { noteId: string; source: string; number: number }; importSource?: RecallImportSource; topicId: string; front?: string; reference: string; memory: RecallMemory; reviews: RecallReview[]; manualDue?: string }
export interface RecallPreferences extends Entity { deckName?: string; options: RecallOptions }
export type CodeLanguage = 'c' | 'cpp' | 'csharp' | 'python' | 'javascript';
export interface CodeRun {
  language: CodeLanguage; code: string; stdin: string; at: string;
  /** Terminal stdin contains actual key input; output includes the PTY's echo. */
  mode?: 'terminal';
  outcome: 'success' | 'error' | 'stopped'; output: string; error: string;
}
export interface CodeExampleContent {
  title: string; language: CodeLanguage; code: string; stdin: string; notes: string;
  inputMode?: 'batch' | 'terminal';
  lastRun?: CodeRun;
}
/** Execution is an observation, never an automatic study check or score. */
export interface CodeExample extends Entity, CodeExampleContent {}
export interface Criteria extends Entity { items: TraceDefinition[] }
export interface CriteriaAssignment extends Entity { scope: 'topic' | 'subject' | 'global'; ownerId: string | null; criteriaId: string }
export interface CriteriaChange { id: string; targetId: string; scope: 'topic' | 'subject' | 'all'; expectedToken: string; items: TraceDefinition[] }
export interface LearningPlan extends Entity { workspace: import('./recommendation-workspace').RecommendationWorkspace }
export interface CanvasPosition { x: number; y: number }
export interface CanvasLink { id: string; source: string; target: string; label: string }
/** Only presentation is stored here. Names, text and drawings remain in their original entities. */
export interface CanvasLayout extends Entity { positions: Record<string, CanvasPosition>; links: CanvasLink[]; viewport?: { x: number; y: number; zoom: number } }
export type EntityCollection = 'conceptCatalogs' | 'conceptEditions' | 'conceptBatches' | 'studyBoards' | 'semesters' | 'subjects' | 'nodes' | 'sessions' | 'records' | 'narratives' | 'criteria' | 'criteriaAssignments' | 'memos' | 'learningPlans' | 'canvasLayouts' | 'codeExamples' | 'recallCards' | 'recallPreferences' | 'studyMaterials' | 'memoryCards' | 'memoryTests' | 'inkWorkspaces';
export type DomainEntity = import('./concept-production').ConceptCatalog | import('./concept-production').ConceptEdition | import('./concept-production').ConceptBatch | import('./study-board').StudyBoard | Semester | Subject | OutlineNode | StudySession | StudyRecord | Narrative | Criteria | CriteriaAssignment | QuickMemo | LearningPlan | CanvasLayout | CodeExample | RecallCard | RecallPreferences | import('./study-material').StudyMaterial | import('./memory-test').MemoryCard | import('./memory-test').MemoryTest | import('./ink-workspace').SyncedInkWorkspace;
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
  conceptCatalogs?: import('./concept-production').ConceptCatalog[];
  conceptEditions?: import('./concept-production').ConceptEdition[];
  conceptBatches?: import('./concept-production').ConceptBatch[];
  memos?: QuickMemo[];
  inkWorkspaces?: import('./ink-workspace').SyncedInkWorkspace[];
  learningPlans?: LearningPlan[];
  canvasLayouts?: CanvasLayout[];
  studyBoards?: import('./study-board').StudyBoard[];
  codeExamples?: CodeExample[];
  recallCards?: RecallCard[];
  recallPreferences?: RecallPreferences[];
  studyMaterials?: import('./study-material').StudyMaterial[];
  memoryCards?: import('./memory-test').MemoryCard[];
  memoryTests?: import('./memory-test').MemoryTest[];
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
  | { type: 'importPhotoOutline'; subjectId: string; parentId: string | null; rows: import('./photo-outline').PhotoOutlineRow[]; choices: Record<string,string>; ids: Record<string,string>; memoIds: Record<string,string>; expectedToken: string; materialId: string; content: import('./study-material').MaterialContent }
  | ({ type: 'createOutlineTable'; expectedToken: string; ids: Record<string, string> } & OutlineTableInput)
  | { type: 'renameNode'; id: string; name: string; expectedVersion: number }
  | { type: 'moveNode'; id: string; parentId: string | null; order?: number; expectedVersion: number }
  | { type: 'trashNode' | 'restoreNode'; id: string; expectedVersion: number }
  | { type: 'saveRecords'; sessionId: string; entries: RecordEntry[]; dateEvidence: DateEvidence }
  | { type: 'updateRecord'; id: string; expectedVersion: number; patch: Partial<Pick<StudyRecord, 'body' | 'done' | 'dateEvidence' | 'trace'>> }
  | { type: 'updateNarrative'; id: string; kind: NarrativeKind; ownerId: string | null; body: string; expectedVersion: number }
  | { type: 'importConceptCatalog'; id: string; raw: string; sha256: string; filename: string }
  | { type: 'saveConceptEdition'; id: string; expectedVersion: number; content: import('./concept-production').ConceptEditionContent }
  | { type: 'saveConceptBatch'; id: string; expectedVersion: number; content: Pick<import('./concept-production').ConceptBatch, 'catalogId' | 'sourceIds' | 'baseVersions' | 'status'> }
  | { type: 'saveMemo'; document?: MemoDocument; recallCardId?: string; id: string; ownerId: string | null; body: string; strokes: MemoStroke[]; expectedVersion: number }
  | { type: 'saveInkWorkspace'; id: string; key: string; content: import('./ink-workspace').InkWorkspaceContent; expectedVersion: number }
  | { type: 'saveRecallCard'; deckId?: string; id: string; topicId: string; front: string; reference: string; expectedVersion: number }
  | { type: 'saveRecallCloze'; noteId: string; topicId: string; source: string; reference: string; deckId?: string; cards: { id: string; number: number; expectedVersion: number }[] }
  | { type: 'importRecallCards'; items: RecallImportItem[]; updateUnedited: boolean }
  | { type: 'setRecallCardStatus'; id: string; expectedVersion: number; suspended: boolean; deckId?: string }
  | { type: 'saveRecallReference'; id: string; topicId: string; reference: string; expectedVersion: number }
  | { type: 'reviewRecallCard'; id: string; topicId: string; expectedVersion: number; rating: 1 | 2 | 3 | 4; memo?: { id: string; body: string; strokes: MemoStroke[] } }
  | { type: 'undoRecallReview'; id: string; reviewId: string; expectedVersion: number }
  | { type: 'setRecallDue'; id: string; topicId: string; expectedVersion: number; due: string }
  | { type: 'saveRecallPreferences'; deckName?: string; id: string; expectedVersion: number; options: RecallOptions }
  | { type: 'trashMemo' | 'restoreMemo'; id: string; expectedVersion: number }
  | { type: 'saveMemoryCard'; id: string; expectedVersion: number; content: import('./memory-test').MemoryCardContent }
  | { type: 'trashMemoryCard' | 'restoreMemoryCard'; id: string; expectedVersion: number }
  | { type: 'saveMemoryTest'; id: string; content: import('./memory-test').MemoryTestContent }
  | { type: 'saveStudyMaterial'; id: string; expectedVersion: number; content: import('./study-material').MaterialContent }
  | { type: 'trashStudyMaterial' | 'restoreStudyMaterial'; id: string; expectedVersion: number }
  | { type: 'saveCodeExample'; id: string; expectedVersion: number; content: CodeExampleContent }
  | { type: 'trashCodeExample' | 'restoreCodeExample'; id: string; expectedVersion: number }
  | { type: 'saveLearningPlan'; id: string; expectedVersion: number; workspace: import('./recommendation-workspace').RecommendationWorkspace }
  | { type: 'saveStudyBoard'; id: string; expectedVersion: number; content: import('./study-board').BoardContent }
  | { type: 'saveCanvasLayout'; id: string; expectedVersion: number; positions: CanvasLayout['positions']; links: CanvasLink[]; viewport?: CanvasLayout['viewport'] }
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
