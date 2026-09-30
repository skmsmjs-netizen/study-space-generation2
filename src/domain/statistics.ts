import type { AppState, DateEvidence, StudyRecord } from './model';
import type { RecommendationWorkspace } from './recommendation-workspace';
import { canonicalEvents } from './recommendation-kernel.mjs';
export type MetricId = 'sessions' | 'coverage' | 'activities' | 'repeats' | 'writing' | 'attempts' | 'successes' | 'corrections';
export interface StatisticItem { id: string; value: number; maximum: number | null; date: DateEvidence; targetId: string; recordIds: string[]; eventIds: string[]; label: string }
export interface Metric { id: MetricId; label: string; unit: string; description: string; items: StatisticItem[]; denominator?: number }
export interface StatisticFilter { from: string; to: string; subjectId?: string; nodeId?: string; subjectIds?: string[] }
export type Bounds = { lower: number; upper: number | null; undated: number; evidence: StatisticItem[] };
export function koreanDay(stamp: string) { return new Date(stamp).toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' }); }
export function shiftDay(day: string, amount: number) { const date = new Date(`${day}T00:00:00Z`); date.setUTCDate(date.getUTCDate() + amount); return date.toISOString().slice(0, 10); }
export function validPeriod(from: string, to: string) { const valid = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d) && Number.isFinite(Date.parse(d)) && new Date(d).toISOString().slice(0, 10) === d; return valid(from) && valid(to) && from <= to; }
export function datePlacement(date: DateEvidence, from: string, to: string): 'inside' | 'possible' | 'outside' | 'undated' {
  if (date.kind === 'unknown') return 'undated';
  const lo = date.kind === 'exact' ? date.date : date.from, hi = date.kind === 'exact' ? date.date : date.to;
  if (hi < from || lo > to) return 'outside';
  return lo >= from && hi <= to ? 'inside' : 'possible';
}
export function statisticBounds(metric: Metric, from: string, to: string): Bounds {
  let lower = 0, upper: number | null = 0, undated = 0;
  const evidence: StatisticItem[] = [];
  // Coverage and sessions deduplicate stable IDs even across multiple records/dates.
  const groups = new Map<string, StatisticItem[]>();
  for (const item of metric.items) { const group = groups.get(item.id) ?? []; group.push(item); groups.set(item.id, group); }
  for (const group of groups.values()) {
    const inside = group.filter(i => datePlacement(i.date, from, to) === 'inside');
    const possible = group.filter(i => datePlacement(i.date, from, to) === 'possible');
    const unknown = group.filter(i => datePlacement(i.date, from, to) === 'undated');
    const included = [...inside, ...possible];
    evidence.push(...included, ...unknown);
    if (unknown.length && !included.length) undated += 1;
    if (inside.length) lower += Math.max(...inside.map(i => i.value));
    if (included.length && upper !== null) {
      if (included.some(i => i.maximum === null)) upper = null;
      else upper += Math.max(...included.map(i => i.maximum!));
    }
  }
  return { lower, upper, undated, evidence };
}
export function statistics(data: AppState, workspace: RecommendationWorkspace, filter: StatisticFilter, now: string): Metric[] {
  const owned = (row: { userId: string; namespace: string; deletedAt: string | null }) => !row.deletedAt && row.userId === data.userId && row.namespace === data.namespace;
  const subjectIds = new Set(data.subjects.filter(s => owned(s) && (!filter.subjectIds || filter.subjectIds.includes(s.id)) && (!filter.subjectId || s.id === filter.subjectId)).map(s => s.id));
  const descendants = new Set<string>();
  if (filter.nodeId) { descendants.add(filter.nodeId); let changed = true; while (changed) { changed = false; for (const n of data.nodes) if (owned(n) && n.parentId && descendants.has(n.parentId) && !descendants.has(n.id)) { descendants.add(n.id); changed = true; } } }
  const targets = data.nodes.filter(n => owned(n) && subjectIds.has(n.subjectId) && (!filter.nodeId || descendants.has(n.id)));
  const targetIds = new Set(targets.map(n => n.id));
  const records = data.records.filter(r => owned(r) && subjectIds.has(r.subjectId) && (targetIds.has(r.targetId) || !filter.nodeId && subjectIds.has(r.targetId)));
  const name = (id: string) => data.nodes.find(n => n.id === id)?.name ?? data.subjects.find(s => s.id === id)?.name ?? id;
  const item = (r: StudyRecord, id: string, value = 1, maximum: number | null = value, date = r.dateEvidence): StatisticItem => ({ id, value, maximum, date, targetId: r.targetId, recordIds: [r.id], eventIds: [], label: name(r.targetId) });
  const attempted = (r: StudyRecord) => r.done || Object.values(r.trace).some(t => t.status === 'checked' || (t.repeats?.length ?? 0) > 0);
  const sessionDates = new Map(data.sessions.filter(owned).map(s => [s.id, s.dateEvidence]));
  const events = canonicalEvents(workspace.events, now, now).filter(e => targetIds.has(e.targetId));
  const eventItem = (e: typeof events[number]) => ({ id: e.id, value: 1, maximum: 1, date: { kind: 'exact' as const, date: koreanDay(e.occurredAt!) }, targetId: e.targetId, recordIds: [], eventIds: [e.id], label: name(e.targetId) });
  return [
    { id: 'sessions', label: '공부를 남긴 회차', unit: '회', description: '공부함·활동·반복이 있는 고유 공부 사건입니다. 여러 주제를 기록해도 같은 회차는 한 번 셉니다.', items: records.filter(attempted).map(r => item(r, r.sessionId, 1, 1, sessionDates.get(r.sessionId) ?? r.dateEvidence)) },
    { id: 'coverage', label: '기록이 닿은 주제', unit: '주제', denominator: targets.filter(n => n.role === 'topic').length, description: '글만 남기거나 일부 활동을 한 주제도 포함합니다. 전체 이해나 완료율을 뜻하지 않습니다.', items: records.filter(r => targetIds.has(r.targetId) && targets.find(n => n.id === r.targetId)?.role === 'topic' && (attempted(r) || r.body.trim())).map(r => item(r, r.targetId)) },
    { id: 'activities', label: '표시한 공부 활동', unit: '개', description: '체크한 활동 항목 수입니다. 한 회차의 여러 활동을 각각 셉니다.', items: records.flatMap(r => Object.entries(r.trace).filter(([,t]) => t.status === 'checked').map(([id]) => item(r, `${r.id}:${id}`))) },
    { id: 'repeats', label: '따로 남긴 반복', unit: '회', description: '추가 반복만 셉니다. 최소 횟수는 하한, 횟수 미정은 미확정으로 남습니다.', items: records.flatMap(r => Object.entries(r.trace).flatMap(([id,t]) => (t.repeats ?? []).map(p => item(r, `${r.id}:${id}:${p.id}`, p.count ?? 0, p.kind === 'exact' ? p.count : null, p.dateEvidence ?? {kind:'unknown'})))) },
    { id: 'writing', label: '글을 남긴 기록', unit: '개', description: '비어 있지 않은 공부 기록 본문 수입니다. 글의 분량이나 정답 여부를 점수로 바꾸지 않습니다.', items: records.filter(r => r.body.trim()).map(r => item(r, r.id)) },
    { id: 'attempts', label: '도움 없이 확인한 수행', unit: '회', description: '결과와 도움 없음이 명시된 수행 자기 보고입니다. 미응답·결과 모름은 실패로 세지 않습니다.', items: events.filter(e => e.kind === 'assessment' && e.assistance === 'none' && ['pass','fail'].includes(e.result ?? '')).map(eventItem) },
    { id: 'successes', label: '도움 없이 기준을 충족한 수행', unit: '회', description: '성공으로 남긴 수행 자기 보고 수입니다. 목표의 같은/새 문항·지연 조건 충족 여부는 다음 공부에서 별도로 판단합니다.', items: events.filter(e => e.kind === 'assessment' && e.assistance === 'none' && e.result === 'pass').map(eventItem) },
    { id: 'corrections', label: '다시 정리한 기록', unit: '회', description: '실패에 연결해 남긴 교정 사건입니다. 교정만으로 독립 재확인이 끝난 것은 아닙니다.', items: events.filter(e => e.kind === 'correction').map(eventItem) },
  ];
}
