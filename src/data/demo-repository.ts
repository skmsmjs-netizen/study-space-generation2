import type { AppState, Command } from '../domain/model';
import { DomainError } from '../domain/model';
import { applyCommand, validateState } from '../domain/commands';
import { createDemoState } from '../domain/fixtures';

export const DEMO_KEY = 'study-space:demo:v1';
interface Envelope { sequence: number; data: AppState }
/** This adapter is only a fake-data UX prototype, not the personal offline layer. */
export class DemoRepository {
  private sequence = 0;
  private state: AppState;
  constructor(private storage: Pick<Storage, 'getItem' | 'setItem'>) {
    const raw = storage.getItem(DEMO_KEY);
    if (raw) {
      let envelope: Envelope;
      try { envelope = JSON.parse(raw); validateState(envelope.data); }
      catch { throw new DomainError('CORRUPT_DEMO', '시연 자료를 읽지 못했습니다. 저장된 내용을 지우지 않았습니다.'); }
      if (envelope.data.namespace !== 'demo' || !Number.isSafeInteger(envelope.sequence)) throw new DomainError('WRONG_NAMESPACE', '개인 자료를 시연 화면에 불러오지 않습니다.');
      this.sequence = envelope.sequence; this.state = envelope.data;
    } else {
      this.state = createDemoState();
      validateState(this.state);
      storage.setItem(DEMO_KEY, JSON.stringify({ sequence: 0, data: this.state }));
    }
  }
  getSnapshot() { return this.state; }
  execute(command: Command): AppState {
    // Detect a snapshot made stale before this call. Atomic multi-tab exclusion
    // is owned by the app lifetime Web Lock; this check alone is not a mutex.
    const latest = this.storage.getItem(DEMO_KEY);
    if (!latest || (JSON.parse(latest) as Envelope).sequence !== this.sequence) throw new DomainError('STALE_DEMO', '다른 창에서 시연 자료가 바뀌었습니다. 작성 내용은 두고 새로고침해 주세요.');
    const next = applyCommand(this.state, command);
    if (next === this.state) return this.state;
    const envelope = { sequence: this.sequence + 1, data: next };
    this.storage.setItem(DEMO_KEY, JSON.stringify(envelope)); // Publish only after storage succeeds.
    this.sequence = envelope.sequence; this.state = next;
    return next;
  }
}

export interface FormDraft { key: string; sessionId: string; selectedIds: string[]; bodies: Record<string,string>; done: Record<string,boolean>; trace: Record<string,import('../domain/model').TraceState>; dateEvidence: import('../domain/model').DateEvidence }
function object(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function stringMap(value: unknown, predicate: (item: unknown) => boolean): boolean { return object(value) && Object.values(value).every(predicate); }
function draftDate(value: unknown): boolean {
  // A draft may contain an unfinished date input. Preserve it, validate actual dates at commit.
  if (!object(value)) return false;
  return value.kind === 'unknown' || value.kind === 'exact' && typeof value.date === 'string'
    || value.kind === 'range' && typeof value.from === 'string' && typeof value.to === 'string';
}
function draftTrace(value: unknown): boolean {
  return object(value) && Object.entries(value).every(([id, item]) => {
    if (!/^[TRACE][A-Za-z0-9_-]*$/.test(id) || !object(item) || !['checked','unchecked','na','deferred'].includes(String(item.status))) return false;
    if (item.note !== undefined && typeof item.note !== 'string') return false;
    if (item.definition !== undefined) {
      const d = item.definition;
      if (!object(d) || d.id !== id || !['T','R','A','C','E'].includes(String(d.group)) || typeof d.label !== 'string' || !Number.isInteger(d.version) || !['required','optional','excluded'].includes(String(d.mode))) return false;
    }
    if (item.examReview !== undefined) {
      const r = item.examReview;
      if (!object(r) || typeof r.answer !== 'string' || typeof r.checked !== 'boolean' || typeof r.updatedAt !== 'string') return false;
    }
    if (item.repeats !== undefined && (!Array.isArray(item.repeats) || !item.repeats.every(r => object(r) && typeof r.id === 'string' && ['exact','minimum','unknown'].includes(String(r.kind)) && (r.count === null || typeof r.count === 'number' && Number.isFinite(r.count)) && (r.note === undefined || typeof r.note === 'string') && (r.dateEvidence === undefined || draftDate(r.dateEvidence))))) return false;
    return true;
  });
}
export function validateFormDraft(value: unknown, key: string): asserts value is FormDraft {
  const d = value;
  if (!object(d) || d.key !== key || typeof d.sessionId !== 'string' || !d.sessionId.trim()
    || !Array.isArray(d.selectedIds) || !d.selectedIds.every(id => typeof id === 'string' && id.trim()) || new Set(d.selectedIds).size !== d.selectedIds.length
    || !stringMap(d.bodies, item => typeof item === 'string') || !stringMap(d.done, item => typeof item === 'boolean')
    || !stringMap(d.trace, draftTrace) || !draftDate(d.dateEvidence)) {
    throw new DomainError('CORRUPT_DRAFT', '이 초안을 읽지 못했습니다. 다른 내용으로 덮어쓰지 않았습니다.');
  }
}
export function readDraft(storage: Pick<Storage,'getItem'>, key: string): FormDraft | null {
  const raw = storage.getItem(`study-space:demo:draft:${key}`);
  if (!raw) return null;
  try { const d: unknown = JSON.parse(raw); validateFormDraft(d, key); return d; }
  catch { throw new DomainError('CORRUPT_DRAFT', '이 초안을 읽지 못했습니다. 다른 내용으로 덮어쓰지 않았습니다.'); }
}
export function saveDraft(storage: Pick<Storage,'setItem'>, draft: FormDraft) {
  validateFormDraft(draft, draft.key);
  storage.setItem(`study-space:demo:draft:${draft.key}`, JSON.stringify(draft));
}
export function localDay(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
