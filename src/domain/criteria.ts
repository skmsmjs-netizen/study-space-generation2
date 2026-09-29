import { DomainError, type AppState, type CriteriaChange, type TraceDefinition } from './model';
import { TRACE_ITEMS } from './trace';

export const DEFAULT_CRITERIA_ID = 'trace-v4-default';
export function defaultCriteriaItems(): TraceDefinition[] {
  return TRACE_ITEMS.map(item => ({ id: item.id, group: item.group, label: item.label, version: 1, mode: item.mode }));
}

export function validateTraceDefinition(value: TraceDefinition, expectedId = value?.id): void {
  if (!value || typeof value !== 'object' || typeof value.id !== 'string'
    || !/^[TRACE][A-Za-z0-9_-]*$/.test(value.id) || value.id.length > 256 || value.id !== expectedId
    || !['T', 'R', 'A', 'C', 'E'].includes(value.group)
    || typeof value.label !== 'string' || !value.label.trim()
    || !Number.isSafeInteger(value.version) || value.version < 1
    || !['required', 'optional', 'excluded'].includes(value.mode)) {
    throw new DomainError('INVALID_TRACE_DEFINITION', '활동의 원래 항목과 정의를 확인해 주세요.');
  }
}

/** Explicit item assignment, then subject default, then global default. No record is read as a current criterion. */
export function resolveCriteria(state: AppState, targetId: string): { id: string; items: TraceDefinition[]; source: 'topic' | 'subject' | 'global' | 'default' } {
  const subjectId = state.subjects.find(subject => subject.id === targetId)?.id
    ?? state.nodes.find(node => node.id === targetId)?.subjectId;
  if (!subjectId) throw new DomainError('NOT_FOUND', '기준을 적용할 항목을 찾을 수 없습니다.');
  for (const [scope, ownerId] of [['topic', targetId], ['subject', subjectId], ['global', null]] as const) {
    const assignment = state.criteriaAssignments?.find(row => !row.deletedAt && row.scope === scope && row.ownerId === ownerId);
    if (!assignment) continue;
    const criteria = state.criteria?.find(row => row.id === assignment.criteriaId && !row.deletedAt);
    if (!criteria) throw new DomainError('CRITERIA_REFERENCE', '현재 기준의 원문을 찾을 수 없습니다.');
    return { id: criteria.id, items: criteria.items.map(item => ({ ...item })), source: scope };
  }
  return { id: DEFAULT_CRITERIA_ID, items: defaultCriteriaItems(), source: 'default' };
}

/** Modal preview includes the current structure and assignment versions, never timestamps alone. */
export function criteriaRevisionToken(state: AppState): string {
  return JSON.stringify([
    state.subjects.map(row => [row.id, row.version, row.deletedAt]),
    state.nodes.map(row => [row.id, row.subjectId, row.version, row.deletedAt]),
    (state.criteria ?? []).map(row => [row.id, row.version, row.deletedAt]),
    (state.criteriaAssignments ?? []).map(row => [row.id, row.version, row.deletedAt]),
  ]);
}

export interface CriteriaEditRow { id: string | null; group: string; label: string; mode: TraceDefinition['mode'] }
/** Matches trace-basis.adjust: editing label/group/mode creates a new identity, not a renamed past activity. */
export function prepareCriteriaItems(previous: readonly TraceDefinition[], rows: readonly CriteriaEditRow[], newId: () => string): TraceDefinition[] {
  if (rows.length > 100) throw new DomainError('INVALID_CRITERIA', '기준은 100개 항목까지 조정할 수 있습니다.');
  return rows.map(row => {
    const prior = previous.find(item => item.id === row.id);
    const label = row.label.trim();
    const same = prior && prior.label === label && prior.group === row.group && prior.mode === row.mode;
    const item = same ? { ...prior } : { id: `${row.group}x_${newId()}`, group: row.group, label, mode: row.mode, version: 1 };
    validateTraceDefinition(item);
    if (label.length > 180) throw new DomainError('INVALID_CRITERIA', '항목 문구는 180자 이내로 입력해 주세요.');
    return item;
  });
}

export function criteriaScopeTargets(state: AppState, targetId: string, scope: CriteriaChange['scope']): { scope: 'topic' | 'subject' | 'global'; ownerId: string | null }[] {
  const subjectId = state.nodes.find(node => node.id === targetId)?.subjectId;
  if (!subjectId) throw new DomainError('NOT_FOUND', '기준을 조정할 목차 항목을 찾을 수 없습니다.');
  if (scope === 'topic') return [{ scope: 'topic', ownerId: targetId }];
  if (scope !== 'subject' && scope !== 'all') throw new DomainError('INVALID_CRITERIA_SCOPE', '기준의 적용 범위를 확인해 주세요.');
  // Like the original, broader explicit application replaces the current bindings
  // of all existing items, while a subject/global default covers future items.
  const subjects = state.subjects.filter(subject => scope === 'all' || subject.id === subjectId);
  const nodes = state.nodes.filter(node => scope === 'all' || node.subjectId === subjectId);
  return [
    ...(scope === 'all' ? [{ scope: 'global' as const, ownerId: null }] : []),
    ...subjects.map(subject => ({ scope: 'subject' as const, ownerId: subject.id })),
    ...nodes.map(node => ({ scope: 'topic' as const, ownerId: node.id })),
  ];
}
