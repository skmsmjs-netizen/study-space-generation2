import { useMemo, useState } from 'react';
import type { AppState } from '../domain/model';
import type { RecommendationWorkspace } from '../domain/recommendation-workspace';
import { BRAND } from '../domain/brand';
import { calendarMonth, shiftMonth } from '../domain/study-calendar';
import { statisticBounds, statistics, type MetricId, type StatisticItem } from '../domain/statistics';
import { readStatisticsMonth, saveStatisticsMonth } from '../data/statistics-month';
import { Button, Card, Input } from './index';
import { StatisticsTrend } from './statistics-trend';

const amount = (lower: number, upper: number | null) => upper === null ? `${lower} 이상 · 상한 미정` : lower === upper ? `${lower}` : `${lower}–${upper}`;
const shortLabels: Record<MetricId, string> = { sessions: '공부 회차', coverage: '주제', activities: '공부 행동', repeats: '반복', writing: '남긴 글', attempts: '수행 시도', successes: '기준 충족', corrections: '교정' };
export function MonthSummary({ data, workspace, subjectIds, subjectId = '', nodeId = '', compact = false, unavailable = false, onOpen }: {
  data: AppState; workspace: RecommendationWorkspace; subjectIds: string[]; subjectId?: string; nodeId?: string;
  compact?: boolean; unavailable?: boolean;
  onOpen?: (month: string, metric: MetricId, items: StatisticItem[], unit: string) => void;
}) {
  const currentMonth = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' }).slice(0, 7);
  const [boot] = useState(() => readStatisticsMonth(data, currentMonth));
  const [month, setMonth] = useState(compact ? currentMonth : boot.month), [error, setError] = useState(compact ? '' : boot.error);
  const period = useMemo(() => calendarMonth(month), [month]), previous = calendarMonth(shiftMonth(month, -1));
  const metrics = useMemo(() => statistics(data, workspace, { ...period, subjectIds, subjectId, nodeId }, new Date().toISOString()), [data, workspace, period, subjectIds, subjectId, nodeId]);
  const choose = (value: string) => {
    try { calendarMonth(value); setMonth(value); saveStatisticsMonth(data, value); setError(''); }
    catch { setError('월 선택을 저장하지 못했습니다. 화면의 선택과 공부 기록은 유지했습니다. 월을 다시 선택해 주세요.'); }
  };
  const open = (metric: typeof metrics[number]) => {
    if (compact) { try { saveStatisticsMonth(data, month); } catch { /* The full view also defaults to the calendar month. */ } location.hash = '#/statistics'; return; }
    onOpen?.(month, metric.id, statisticBounds(metric, period.from, period.to).evidence, metric.unit);
  };
  return <Card role="region" aria-label="월간 기록 요약" className="study-statistics">
    {/* biome-ignore lint/a11y/useValidAnchor: This real hash-route link persists the selected month before normal link navigation, including keyboard activation. */}
    <div className="section-heading"><h2>{BRAND.monthly}</h2>{compact && <a href="#/statistics" onClick={() => { try { saveStatisticsMonth(data, month); } catch { /* Keep navigation usable. */ } }}>월간 기록 보기</a>}</div>
    {!compact && <div className="actions"><Button onClick={() => choose(shiftMonth(month, -1))}>이전 달</Button><Input label="요약할 월" type="month" value={month} onChange={e => { if (e.target.value) choose(e.target.value); }} /><Button onClick={() => choose(shiftMonth(month, 1))}>다음 달</Button><Button variant="quiet" onClick={() => choose(currentMonth)}>이번 달</Button></div>}
    <p className="muted">{period.from}–{period.to} · 남긴 기록에서 이번 달의 공부를 돌아보세요.</p>
    <div className="statistics-metrics">{metrics.filter(m => !compact || ['sessions', 'coverage'].includes(m.id)).map(m => {
      const b = statisticBounds(m, period.from, period.to), prev = statisticBounds(m, previous.from, previous.to);
      const missing = unavailable && ['attempts', 'successes', 'corrections'].includes(m.id);
      return <button type="button" key={m.id} className="statistics-metric" aria-label={`${month} ${shortLabels[m.id]} 원기록 보기`} disabled={Boolean(missing)} onClick={() => open(m)}>
        <span>{m.label}</span><strong>{missing ? '확인 불가' : amount(b.lower, b.upper)}</strong><small>{m.unit}{b.undated ? ` · 날짜 미정 ${b.undated}건 별도` : ''}</small>
        {!compact && !missing && <><StatisticsTrend metric={m} from={period.from} to={period.to} /><small>이전 달 {amount(prev.lower, prev.upper)} · 원기록 보기</small></>}
      </button>;
    })}</div>
    <p className="muted">{!compact && '작은 그래프는 날짜가 정확한 기록의 흐름이며, 지표마다 눈금을 따로 맞춥니다. '}기록·반복과 혼자 확인한 수행 결과를 구별합니다. 날짜 미정은 이 달에 배정하지 않고, 날짜 범위가 걸치면 가능한 상한에만 포함합니다.</p>
    {error && <p role="alert">{error}</p>}
  </Card>;
}
