import { validateScheduleExtensions, scheduleSteps, type LearningSchedule, type TargetCondition, type ComparisonPlan, type RecommendationSnapshot } from './learning-schedule';
import type { AppState } from './model';
import { recommend, activitySupport, robustWinner, type EvidenceEvent, type GuidanceControl, type RecommendationModel, type RecommendationResult } from './recommendation-kernel.mjs';

export interface CheckGoal { id: string; targetId: string; label: string; dueDate: string; novelty: 'same' | 'new'; createdAt: string; ended: boolean; minDelayDays?: number; refreshDays?: number | null }
export interface GoalDraft { targetId: string; label: string; dueDate: string; novelty: 'same' | 'new'; minDelayDays?: number; refreshDays?: number | null }
export interface ResponseDraft { result: 'pass' | 'fail' | 'unknown' | 'disputed'; assistance: 'none' | 'notes' | 'unknown'; novelty: 'same' | 'new' | 'unknown'; answer: string; delayDays?: number; delayVerified?: boolean }
export interface TermDates { start: string; end: string }
export interface RecommendationWorkspace { version: 1; userId: string; namespace: AppState['namespace']; revision: number; goals: CheckGoal[]; events: EvidenceEvent[]; controls: Record<string, GuidanceControl>; draft: GoalDraft; responses: Record<string, ResponseDraft>; terms?: Record<string, TermDates>; termDraft?: TermDates & { semesterId: string }; schedules?: LearningSchedule[]; conditions?: TargetCondition[]; comparisons?: ComparisonPlan[]; snapshots?: RecommendationSnapshot[] }
export const recommendationKey = (data: AppState) => `study-space:${data.namespace}:recommendations:${data.userId}:v1`;
export const emptyResponse = (): ResponseDraft => ({ result: 'unknown', assistance: 'unknown', novelty: 'unknown', answer: '' });
export function emptyRecommendations(data: AppState): RecommendationWorkspace {
  return { version: 1, userId: data.userId, namespace: data.namespace, revision: 0, goals: [], events: [], controls: {}, draft: { targetId: '', label: '', dueDate: '', novelty: 'same' }, responses: {}, terms: {}, termDraft: { semesterId: '', start: '', end: '' } };
}
function validISO(value: unknown): value is string { return typeof value === 'string' && /(?:Z|[+-]\d\d:\d\d)$/.test(value) && Number.isFinite(Date.parse(value)); }
export function dateDeadline(date: string): string | null {
  if (!date) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) throw Error('기한을 다시 확인해 주세요.');
  // Date-only input is explicitly the Korean calendar day, not an inferred study timestamp.
  return new Date(`${date}T23:59:59.999+09:00`).toISOString();
}
export function termPeriod(dates: TermDates) {
  if (!dates.start && !dates.end) return null;
  if (!dates.start || !dates.end) throw Error('학기 시작일과 종료일을 함께 남기거나 둘 다 비워 주세요.');
  dateDeadline(dates.start); const end = dateDeadline(dates.end)!;
  const start = new Date(`${dates.start}T00:00:00+09:00`).toISOString();
  if (Date.parse(end) < Date.parse(start)) throw Error('종료일은 시작일보다 앞설 수 없습니다.');
  return { start, end: new Date(Date.parse(end) + 1).toISOString(), timezone: 'Asia/Seoul' };
}
export function validateRecommendations(value: unknown, data: AppState): asserts value is RecommendationWorkspace {
  const w = value as RecommendationWorkspace;
  if (!w || w.version !== 1 || w.userId !== data.userId || w.namespace !== data.namespace || !Number.isSafeInteger(w.revision) || w.revision < 0 || !Array.isArray(w.goals) || !Array.isArray(w.events) || !w.controls || typeof w.controls !== 'object' || !w.responses || typeof w.responses !== 'object' || !w.draft || typeof w.draft.targetId !== 'string' || typeof w.draft.label !== 'string' || typeof w.draft.dueDate !== 'string' || !['same', 'new'].includes(w.draft.novelty)) throw Error('추천 내용을 읽지 못했습니다. 원래 내용은 보존했습니다.');
  const ids = new Set<string>();
  for (const goal of w.goals) {
    if (!data.nodes.some(n => n.id === goal.targetId && n.role === 'topic') || typeof goal.id !== 'string' || !goal.id || ids.has(goal.id) || typeof goal.targetId !== 'string' || typeof goal.label !== 'string' || !goal.label.trim() || typeof goal.dueDate !== 'string' || typeof goal.ended !== 'boolean' || !validISO(goal.createdAt) || !['same', 'new'].includes(goal.novelty)) throw Error('확인할 내용의 형식을 다시 확인해 주세요.');
    if (goal.minDelayDays !== undefined && (!Number.isFinite(goal.minDelayDays) || goal.minDelayDays < 0) || goal.refreshDays != null && (!Number.isFinite(goal.refreshDays) || goal.refreshDays <= 0)) throw Error('재확인 간격을 확인해 주세요.');
    ids.add(goal.id); dateDeadline(goal.dueDate);
  }
  for (const e of w.events) {
    if (!e.id || !Number.isSafeInteger(e.revision) || e.revision < 1 || !Number.isSafeInteger(e.sequence) || !validISO(e.knownAt) || !validISO(e.occurredAt) || !w.goals.some(g => g.id === e.facet && g.targetId === e.targetId) || e.rubricVersion !== 'self-check-1' || !['assessment', 'correction'].includes(e.kind) || !['none', 'notes', 'unknown'].includes(e.assistance ?? '') || !['pass', 'fail', 'unknown', 'disputed'].includes(e.result ?? '') || !['same', 'new', 'unknown'].includes(e.novelty ?? '') || typeof e.answer !== 'string' || e.authority !== 'local') throw Error('수행 결과의 연결을 확인하지 못했습니다.');
  }
  for (const e of w.events) {
    if (e.delayDays !== undefined && (!Number.isFinite(e.delayDays) || e.delayDays < 0) || e.delayVerified !== undefined && typeof e.delayVerified !== 'boolean') throw Error('실제 수행 간격을 확인해 주세요.');
    if (e.kind === 'correction' && !w.events.some(f => f.id === e.errorEventId && f.facet === e.facet && f.result === 'fail')) throw Error('교정에 연결된 실패를 확인해 주세요.');
  }
  for (const response of Object.values(w.responses)) {
    if (!response || !['pass', 'fail', 'unknown', 'disputed'].includes(response.result) || !['none', 'notes', 'unknown'].includes(response.assistance) || !['same', 'new', 'unknown'].includes(response.novelty) || typeof response.answer !== 'string') throw Error('작성 중인 결과를 읽지 못했습니다.');
  }
  for (const control of Object.values(w.controls)) if (!control || control.snoozeUntil && !validISO(control.snoozeUntil)) throw Error('보류 시점을 읽지 못했습니다.');
  if (w.terms !== undefined) {
    if (!w.terms || Array.isArray(w.terms) || typeof w.terms !== 'object') throw Error('학기 기간을 읽지 못했습니다.');
    for (const dates of Object.values(w.terms)) { if (typeof dates.start !== 'string' || typeof dates.end !== 'string') throw Error('학기 기간을 읽지 못했습니다.'); termPeriod(dates); }
  }
  validateScheduleExtensions(w, data);
  if (w.termDraft && (typeof w.termDraft.semesterId !== 'string' || typeof w.termDraft.start !== 'string' || typeof w.termDraft.end !== 'string')) throw Error('작성 중인 학기 기간을 읽지 못했습니다.');
}

export function recommendationInput(data: AppState, workspace: RecommendationWorkspace, subjectIds?: string[], semesterId?: string) {
  const owned = (e: { userId: string; namespace: string; deletedAt: string | null }) => !e.deletedAt && e.userId === data.userId && e.namespace === data.namespace;
  const subjects = data.subjects.filter(s => owned(s) && (!subjectIds || subjectIds.includes(s.id)));
  const nodes = data.nodes.filter(n => owned(n) && n.role === 'topic' && subjects.some(s => s.id === n.subjectId));
  const goals = workspace.goals.filter(g => nodes.some(n => n.id === g.targetId));
  const semester = data.semesters.find(s => owned(s) && s.id === semesterId);
  const model: RecommendationModel = { schemaVersion: 1, term: semester && workspace.terms?.[semester.id] ? termPeriod(workspace.terms[semester.id]) : null,
    targets: nodes.map(n => { const condition = workspace.conditions?.find(c => c.targetId === n.id); return { id:n.id, name:n.name, prerequisites:(condition?.prerequisiteIds ?? []).filter(id => nodes.some(n => n.id === id)), ...(condition?.materialAvailable === null || condition?.materialAvailable === undefined ? {} : { materialAvailable:condition.materialAvailable }) }; }),
    requirements: goals.map(g => ({ id: g.id, targetId: g.targetId, facet: g.id, rubricVersion: 'self-check-1', novelty: g.novelty, minDelayDays: g.minDelayDays ?? 0, ...(g.refreshDays !== undefined ? { refreshDays:g.refreshDays } : {}) })),
    assessments: goals.map(g => ({ id: `check:${g.id}`, weight: null, status: g.ended ? 'ended' : 'active', opensAt: null, dueAt: dateDeadline(g.dueDate), requirementIds: [g.id] })), tasks: [] };
  for (const schedule of workspace.schedules ?? []) {
    if (!subjects.some(s => s.id === schedule.subjectId)) continue;
    const requirements = goals.filter(g => !g.ended && (schedule.goalIds.includes(g.id) || schedule.targetIds.includes(g.targetId))).map(g => g.id);
    model.assessments.push({ id:schedule.id, weight:schedule.weight, status:schedule.status, opensAt:schedule.opensDate ? new Date(`${schedule.opensDate}T00:00:00+09:00`).toISOString() : null, dueAt:dateDeadline(schedule.dueDate), requirementIds:requirements });
    for (const step of scheduleSteps(schedule.kind)) model.tasks.push({ id:`${schedule.id}:${step}`, assessmentId:schedule.id, kind:step, status:schedule.states[step] === 'done' || schedule.status === 'ended' ? 'ended' : 'active', opensAt:schedule.opensDate ? new Date(`${schedule.opensDate}T00:00:00+09:00`).toISOString() : null, dueAt:schedule.dueDate && (step === 'submit' && schedule.dueMeaning === 'submission' || step === 'attendance' && schedule.dueMeaning === 'attendance') ? dateDeadline(schedule.dueDate) : null, required:step === 'submit' || step === 'attendance', weight:schedule.weight ?? undefined });
  }
  const events: EvidenceEvent[] = workspace.events.filter(e => goals.some(g => g.id === e.facet)).map(e => ({ ...e }));
  // One study record remains one activity reference. Its date uncertainty stays intact.
  // recordedAt/updatedAt is NOT converted into the actual performance time.
  for (const g of goals) for (const r of data.records.filter(r => owned(r) && r.targetId === g.targetId)) {
    if (!r.done && !Object.values(r.trace).some(item => item.status === 'checked' || (item.repeats?.length ?? 0) > 0)) continue;
    events.push({ id: `activity:${r.id}:${g.id}`, revision: r.version, sequence: 0, occurredAt: null,
      knownAt: r.updatedAt, targetId: g.targetId, facet: g.id, rubricVersion: 'self-check-1', kind: 'activity',
      sourceRecordId: r.id, sourceDateEvidence: r.dateEvidence, authority: 'local' });
  }
  return { model, events, nodes, goals };
}
export function nextStudy(data: AppState, workspace: RecommendationWorkspace, now: string, subjectIds?: string[], semesterId?: string): RecommendationResult {
  const { model, events } = recommendationInput(data, workspace, subjectIds, semesterId);
  const result = recommend(model, events, now, now, workspace.controls);
  result.adaptations = [];
  for (const g of workspace.goals) {
    const pairs = (workspace.comparisons ?? []).filter(p => p.goalId === g.id && p.independent && p.rubricMatched && p.attributionBundle).map(p => ({...p,stratumKey:g.id}));
    const actions = [...new Set(pairs.map(p=>p.action))];
    const supports = actions.map(action=>activitySupport(pairs,g.id,action,now));
    const eligible = supports.filter(s=>s.eligible);
    const winner = eligible.length > 1 ? robustWinner(eligible.map(s=>({id:s.action,lower:s.lower,upper:s.upper}))) : null;
    if (winner?.reason === 'robust_dominance') { const support=eligible.find(s=>s.action===winner.id)!; if (support.lift>0) result.adaptations.push({goalId:g.id,action:support.action,lower:support.lower,upper:support.upper,lift:support.lift,pairIds:support.pairIds}); }
  }
  return result;
}
export function makeResultEvent(goal: CheckGoal, response: ResponseDraft, workspace: RecommendationWorkspace, now: string, id: string): EvidenceEvent {
  return { id, revision: 1, sequence: Math.max(0, ...workspace.events.map(e => e.sequence)) + 1,
    occurredAt: now, knownAt: now, targetId: goal.targetId, facet: goal.id, rubricVersion: 'self-check-1',
    kind: 'assessment', ...response, authority: 'local' };
}
