import { useEffect, useMemo, useRef, useState } from 'react';
import { canonicalEvents } from '../domain/recommendation-kernel.mjs';
import type { AppState } from '../domain/model';
import {
  datePlacement,
  koreanDay,
  shiftDay,
  statisticBounds,
  statistics,
  validPeriod,
  type MetricId,
  type StatisticItem,
} from '../domain/statistics';
import { readLearningPlan } from '../data/learning-plan';
import { emptyRecommendations } from '../domain/recommendation-workspace';
import { Button, Card, Checkbox, Input, Modal, Select, SegmentedControl } from './index';
import './statistics.css';
import { MonthSummary } from './month-summary';
import { calendarMonth } from '../domain/study-calendar';
import { readStatisticsMonth } from '../data/statistics-month';
import {
  chartFamilies,
  chartFigure,
  chartNames,
  type ChartFamily,
  type ChartKind,
} from '../domain/statistics-charts';
import { readStatisticsView, saveStatisticsView } from '../data/statistics-view';
import { StatisticsGallery, ChartValues } from './statistics-gallery';
import { StatisticsPlot } from './statistics-plot';
const format = (lo: number, hi: number | null) =>
  hi === null ? `${lo} 이상 · 상한 미정` : lo === hi ? `${lo}` : `${lo}–${hi}`;
export function StudyStatistics({
  data,
  subjectIds,
  compact = false,
}: {
  data: AppState;
  subjectIds: string[];
  compact?: boolean;
}) {
  const today = koreanDay(new Date().toISOString());
  const [initialMonth] = useState(() =>
    calendarMonth(readStatisticsMonth(data, today.slice(0, 7)).month),
  );
  const [from, setFrom] = useState(compact ? shiftDay(today, -13) : initialMonth.from),
    [to, setTo] = useState(compact ? today : initialMonth.to);
  const [bootView] = useState(() => readStatisticsView(data));
  const [subjectId, setSubject] = useState(''),
    [nodeId, setNode] = useState(''),
    [metricId, setMetric] = useState<MetricId>(compact ? 'sessions' : bootView.view.metricId);
  const [family, setFamily] = useState<ChartFamily>(bootView.view.family),
    [kind, setKind] = useState<ChartKind>(bootView.view.kind),
    [overview, setOverview] = useState(bootView.view.overview),
    [secondMetricId, setSecondMetric] = useState<MetricId>(bootView.view.secondMetricId);
  const [viewNotice, setViewNotice] = useState(bootView.error),
    viewTouched = useRef(false);
  const viewAccount = useRef(`${data.namespace}:${data.userId}`);
  useEffect(() => {
    const account = `${data.namespace}:${data.userId}`;
    if (viewAccount.current === account) return;
    viewAccount.current = account;
    viewTouched.current = false;
    const next = readStatisticsView({ userId: data.userId, namespace: data.namespace });
    setFamily(next.view.family);
    setKind(next.view.kind);
    setOverview(next.view.overview);
    setMetric(compact ? 'sessions' : next.view.metricId);
    setSecondMetric(next.view.secondMetricId);
    setViewNotice(next.error);
  }, [data.userId, data.namespace, compact]);
  useEffect(() => {
    if (compact || !viewTouched.current) return;
    try {
      saveStatisticsView(
        { userId: data.userId, namespace: data.namespace },
        { version: 1, family, kind, overview, metricId, secondMetricId },
      );
      setViewNotice('');
    } catch {
      setViewNotice(
        '그래프 선택을 이 기기에 저장하지 못했습니다. 화면의 선택과 원기록은 유지했습니다.',
      );
    }
  }, [data.userId, data.namespace, family, kind, overview, metricId, secondMetricId, compact]);

  const [view, setView] = useState('graph'),
    [compare, setCompare] = useState(false),
    [zoom, setZoom] = useState(1);
  const [cursor, setCursor] = useState<number | null>(null),
    [playing, setPlaying] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  );
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return;
    const update = () => setReduceMotion(query.matches);
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);
  // biome-ignore lint/correctness/useExhaustiveDependencies: changing this scope resets playback while keeping calculations intact.
  useEffect(() => {
    setCursor(null);
    setPlaying(false);
  }, [from, to, metricId, subjectId, nodeId]);
  const [frozen, setFrozen] = useState<{
    label: string;
    items: StatisticItem[];
    unit: string;
    source: AppState;
    events: typeof workspace.events;
  } | null>(null);
  const [selected, setSelected] = useState<{
    label: string;
    items: StatisticItem[];
    unit: string;
  } | null>(null);
  const { workspace, readError } = useMemo(() => {
    try {
      return { workspace: readLearningPlan(data).workspace, readError: '' };
    } catch {
      return {
        workspace: emptyRecommendations(data),
        readError:
          '추천 수행 자료를 읽지 못했습니다. 공부 기록은 표시하며 수행 지표는 확인할 수 없습니다.',
      };
    }
  }, [data]);
  const valid = validPeriod(from, to),
    days = valid ? Math.round((Date.parse(to) - Date.parse(from)) / 86400000) + 1 : 0;
  const metrics = useMemo(
    () =>
      statistics(
        data,
        workspace,
        { from, to, subjectIds, subjectId, nodeId },
        new Date().toISOString(),
      ),
    [data, workspace, from, to, subjectIds, subjectId, nodeId],
  );
  const metric = metrics.find((m) => m.id === metricId)!;
  const chartContext = useMemo(
    () => ({ data, metrics, metricId, secondMetricId, from, to, compare, subjectIds, subjectId }),
    [data, metrics, metricId, secondMetricId, from, to, compare, subjectIds, subjectId],
  );
  const figure = useMemo(() => {
    const result = chartFigure(chartContext, kind);
    if (
      readError &&
      (['attempts', 'successes', 'corrections'].includes(metricId) ||
        (family === 'relationship' &&
          ['attempts', 'successes', 'corrections'].includes(secondMetricId)))
    )
      return {
        ...result,
        traces: [],
        rows: [],
        reason: '수행 자료를 읽지 못했습니다. 공부 기록의 다른 지표를 선택해 주세요.',
      };
    return result;
  }, [chartContext, kind, readError, metricId, family, secondMetricId]);
  const chooseFamily = (value: ChartFamily) => {
    viewTouched.current = true;
    setFamily(value);
    setKind(chartFamilies.find((f) => f.id === value)!.kinds[0]);
    setView('graph');
    if (value === 'relationship' && metricId === secondMetricId)
      setSecondMetric(metricId === 'sessions' ? 'writing' : 'sessions');
    if ((value === 'composition' || value === 'flow') && metricId === 'sessions')
      setMetric('writing');
  };
  const chooseChart = (value: ChartKind, id: MetricId) => {
    viewTouched.current = true;
    setFamily(chartFamilies.find((f) => (f.kinds as readonly string[]).includes(value))!.id);
    setKind(value);
    setMetric(id);
    setView('graph');
    setOverview(false);
  };

  const previousTo = valid ? shiftDay(from, -1) : today,
    previousFrom = valid ? shiftDay(from, -days) : today;
  const step = Math.max(1, Math.ceil(days / 14));
  const bins = valid
    ? Array.from({ length: Math.ceil(days / step) }, (_, i) => {
        const lo = shiftDay(from, i * step),
          hi = shiftDay(from, Math.min(days - 1, (i + 1) * step - 1));
        const current = statisticBounds(
          { ...metric, items: metric.items.filter((item) => item.date.kind === 'exact') },
          lo,
          hi,
        );
        const prev = statisticBounds(
          { ...metric, items: metric.items.filter((item) => item.date.kind === 'exact') },
          shiftDay(previousFrom, i * step),
          shiftDay(previousFrom, Math.min(days - 1, (i + 1) * step - 1)),
        );
        return { lo, hi, current, prev };
      })
    : [];
  const maximum = Math.max(
    2,
    Math.ceil(
      Math.max(0, ...bins.flatMap((b) => [b.current.lower, compare ? b.prev.lower : 0])) / 2,
    ) * 2,
  );
  useEffect(() => {
    if (!playing || reduceMotion) {
      if (reduceMotion) setPlaying(false);
      return;
    }
    const timer = window.setInterval(
      () =>
        setCursor((i) => {
          const next = (i ?? -1) + 1;
          if (next >= bins.length) {
            setPlaying(false);
            return bins.length - 1;
          }
          return next;
        }),
      900,
    );
    return () => window.clearInterval(timer);
  }, [playing, reduceMotion, bins.length]);
  const selection = frozen ?? selected;
  const sourceData = frozen?.source ?? data,
    sourceEvents = canonicalEvents(
      frozen?.events ?? workspace.events,
      new Date().toISOString(),
      new Date().toISOString(),
    );
  const openEvidence = (label: string, items: StatisticItem[], unit = metric.unit) => {
    if (compact) {
      location.hash = '#/statistics';
      return;
    }
    setFrozen(null);
    const unique = new Map(
      items.map((item) => [
        `${item.id}:${item.recordIds.join(',')}:${item.eventIds.join(',')}`,
        item,
      ]),
    );
    setSelected({ label, items: [...unique.values()], unit });
  };
  const dateLabel = (i: StatisticItem) =>
    i.date.kind === 'unknown'
      ? '공부 날짜 미정'
      : i.date.kind === 'exact'
        ? i.date.date
        : `${i.date.from}–${i.date.to} 사이`;
  if (compact)
    return (
      <>
        <Card className="study-statistics">
          <div className="section-heading">
            <h2>공부 기록의 변화</h2>
            <a href="#/statistics">통계와 그래프 보기</a>
          </div>
          <p className="muted">최근 14일 · 공부 회차입니다. 체크는 이해나 정답 판정이 아닙니다.</p>
          {chart()}
          {!metric.items.length && <p className="muted">공부를 남기면 이곳에 변화가 보입니다.</p>}
        </Card>
        <MonthSummary
          compact
          data={data}
          workspace={workspace}
          subjectIds={subjectIds}
          unavailable={Boolean(readError)}
        />
      </>
    );
  function chart() {
    return (
      <div className="statistics-scroll">
        {/* biome-ignore lint/a11y/useSemanticElements: an SVG chart groups interactive bars; fieldset cannot replace SVG. */}
        <svg
          className="statistics-chart"
          style={{ width: `${zoom * 100}%` }}
          viewBox="0 0 800 260"
          role="group"
          aria-label={`${metric.label} · 정확한 날짜가 있는 기록의 변화`}
        >
          <text x="4" y="18">
            {metric.unit}
          </text>
          {[0, 0.5, 1].map((r) => (
            <g key={r}>
              <line className="grid" x1="40" y1={210 - r * 180} x2="790" y2={210 - r * 180} />
              <text x="4" y={215 - r * 180}>
                {maximum * r}
              </text>
            </g>
          ))}
          {bins.map((b, i) => {
            const width = 740 / Math.max(1, bins.length),
              x = 45 + i * width;
            return (
              // biome-ignore lint/a11y/useSemanticElements: this SVG group implements Enter/Space and a transparent touch target.
              <g
                key={b.lo}
                className="bar-control"
                style={{ opacity: cursor !== null && i > cursor ? 0.35 : 1 }}
                role="button"
                tabIndex={0}
                aria-label={`${b.lo}${b.lo === b.hi ? '' : `부터 ${b.hi}`} ${b.current.lower}${metric.unit} · 근거 보기`}
                onClick={() => openEvidence(`${b.lo}–${b.hi}`, b.current.evidence)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openEvidence(`${b.lo}–${b.hi}`, b.current.evidence);
                  }
                }}
              >
                <title>
                  {b.lo}–{b.hi}: {b.current.lower}
                  {metric.unit}
                  {compare ? ` · 이전 기간 ${b.prev.lower}${metric.unit}` : ''}
                </title>
                <rect className="bar-hit-area" x={x} y="24" width={width} height="214" />
                {compare && (
                  <rect
                    className="previous-bar"
                    x={x + width * 0.05}
                    y={210 - (b.prev.lower / maximum) * 180}
                    width={width * 0.3}
                    height={(b.prev.lower / maximum) * 180}
                  />
                )}
                <rect
                  className="current-bar"
                  x={x + width * (compare ? 0.4 : 0.15)}
                  y={210 - (b.current.lower / maximum) * 180}
                  width={width * (compare ? 0.4 : 0.7)}
                  height={(b.current.lower / maximum) * 180}
                />
                {view === 'depth' && b.current.lower > 0 && (
                  // biome-ignore lint/a11y/noAriaHiddenOnFocusable: these polygons have no handlers or tab index and only decorate the bar.
                  <g aria-hidden="true" focusable="false">
                    <polygon
                      points={`${x + width * (compare ? 0.4 : 0.15)},${210 - (b.current.lower / maximum) * 180} ${x + width * (compare ? 0.4 : 0.15) + 8},${202 - (b.current.lower / maximum) * 180} ${x + width * (compare ? 0.8 : 0.85) + 8},${202 - (b.current.lower / maximum) * 180} ${x + width * (compare ? 0.8 : 0.85)},${210 - (b.current.lower / maximum) * 180}`}
                      style={{ fill: 'var(--color-primary)', opacity: 0.7 }}
                    />
                    <polygon
                      points={`${x + width * (compare ? 0.8 : 0.85)},${210 - (b.current.lower / maximum) * 180} ${x + width * (compare ? 0.8 : 0.85) + 8},${202 - (b.current.lower / maximum) * 180} ${x + width * (compare ? 0.8 : 0.85) + 8},202 ${x + width * (compare ? 0.8 : 0.85)},210`}
                      style={{ fill: 'var(--color-primary)', opacity: 0.5 }}
                    />
                  </g>
                )}
                <text x={x + width * 0.3} y="235">
                  {b.lo.slice(5)}
                </text>
                <text x={x + width * 0.3} y={200 - (b.current.lower / maximum) * 180}>
                  {b.current.lower}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }
  return (
    <section className="study-statistics" aria-label="공부 통계">
      <div className="actions">
        <Checkbox
          label="여러 그래프 한눈에 보기"
          checked={overview}
          onChange={(e) => {
            viewTouched.current = true;
            setOverview(e.target.checked);
          }}
        />
      </div>
      {viewNotice && <p role="status">{viewNotice}</p>}
      {overview && valid && (
        <StatisticsGallery
          context={chartContext}
          onChoose={chooseChart}
          onOpen={(row) => openEvidence(row.label, row.items, row.unit ?? metric.unit)}
        />
      )}
      <p className="muted">
        남긴 기록을 기준으로 계산합니다. 수행 결과는 자기 보고이며, 빈 기간은 기록이 없다는
        뜻입니다.
      </p>
      {readError && <p role="alert">{readError}</p>}
      {!valid ? (
        <p role="alert">시작일과 종료일을 확인해 주세요.</p>
      ) : (
        <>
          <Card role="region" aria-label="기간별 통계 그래프">
            <div className="section-heading">
              <h2>{metric.label}</h2>
              <Select
                label="그래프로 볼 통계"
                value={metricId}
                onChange={(e) => {
                  viewTouched.current = true;
                  setMetric(e.target.value as MetricId);
                }}
              >
                {metrics.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </Select>
            </div>
            <p className="muted">
              {from}–{to} ·{' '}
              {subjectId
                ? data.subjects.find((subject) => subject.id === subjectId)?.name
                : '현재 범위 전체'}
            </p>
            <div className="statistics-chart-controls">
              <Select
                label="보고 싶은 것"
                value={family}
                onChange={(e) => chooseFamily(e.target.value as ChartFamily)}
              >
                {chartFamilies.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </Select>
              <Select
                label="그래프 종류"
                value={kind}
                onChange={(e) => {
                  viewTouched.current = true;
                  setKind(e.target.value as ChartKind);
                  setView('graph');
                }}
              >
                {chartFamilies
                  .find((f) => f.id === family)!
                  .kinds.map((k) => (
                    <option key={k} value={k}>
                      {chartNames[k]}
                    </option>
                  ))}
              </Select>
              {family === 'relationship' && kind !== 'heatmap' && (
                <Select
                  label="함께 볼 지표"
                  value={secondMetricId}
                  onChange={(e) => {
                    viewTouched.current = true;
                    setSecondMetric(e.target.value as MetricId);
                  }}
                >
                  {metrics.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </Select>
              )}
            </div>
            {readError && ['attempts', 'successes', 'corrections'].includes(metricId) ? (
              <p role="alert">
                {' '}
                수행 지표를 확인할 수 없습니다. 공부 기록의 다른 지표를 선택해 주세요.
              </p>
            ) : view !== 'list' ? (
              view === 'depth' || kind === 'column' ? (
                chart()
              ) : (
                <div className="statistics-scroll">
                  <fieldset
                    className="statistics-plot-group"
                    aria-label={`${metric.label} · 정확한 날짜가 있는 기록의 변화`}
                    style={{ width: `${zoom * 100}%` }}
                  >
                    <StatisticsPlot
                      figure={figure}
                      cursor={family === 'trend' ? cursor : null}
                      onOpen={(row) => openEvidence(row.label, row.items, row.unit ?? metric.unit)}
                    />
                  </fieldset>
                </div>
              )
            ) : (
              <ChartValues
                figure={figure}
                expanded
                onOpen={(row) => openEvidence(row.label, row.items, row.unit ?? metric.unit)}
              />
            )}
            {view !== 'list' && view !== 'depth' && kind !== 'column' && (
              <>
                <p className="muted">{figure.description}</p>
                <ChartValues
                  figure={figure}
                  onOpen={(row) => openEvidence(row.label, row.items, row.unit ?? metric.unit)}
                />
              </>
            )}

            {!readError && !bins.some((b) => b.current.lower > 0) && (
              <p className="muted">
                이 기간에는 날짜가 정확한 기록의 확인된 횟수가 없습니다. 날짜 범위·미정 기록은 전체
                근거에서 확인할 수 있습니다.
              </p>
            )}
            <p>{metric.description}</p>
            <div className="actions">
              <SegmentedControl
                value={view}
                onChange={setView}
                items={[
                  { id: 'graph', label: '그래프' },
                  { id: 'depth', label: '입체' },
                  { id: 'list', label: '목록' },
                ]}
              />
              <Button variant="quiet" onClick={() => setZoom((z) => (z === 1 ? 2 : 1))}>
                {zoom === 1 ? '그래프 확대' : '원래 크기'}
              </Button>
              <Button
                variant="quiet"
                onClick={() =>
                  openEvidence(
                    `${from}–${to} · 전체 근거`,
                    statisticBounds(metric, from, to).evidence,
                  )
                }
              >
                전체 근거 보기
              </Button>
            </div>
            <div className="actions">
              <Button
                disabled={reduceMotion || !bins.length}
                onClick={() => {
                  if (playing) setPlaying(false);
                  else {
                    if (family !== 'trend') chooseFamily('trend');
                    if (view === 'list') setView('graph');
                    setCursor(-1);
                    setPlaying(true);
                  }
                }}
              >
                {playing ? '재생 멈추기' : '시간순 재생'}
              </Button>
              <Button
                variant="quiet"
                disabled={!bins.length}
                onClick={() => {
                  setPlaying(false);
                  if (family !== 'trend') chooseFamily('trend');
                  if (view === 'list') setView('graph');
                  setCursor((i) => Math.min(bins.length - 1, (i ?? -1) + 1));
                }}
              >
                다음 구간
              </Button>
              <Button
                variant="quiet"
                onClick={() => {
                  setPlaying(false);
                  setCursor(null);
                }}
              >
                전체 구간
              </Button>
            </div>
            {reduceMotion && (
              <p className="muted">
                기기의 동작 줄이기 설정에 따라 자동 재생을 멈췄습니다. 다음 구간으로 직접 볼 수
                있습니다.
              </p>
            )}
            {cursor !== null && cursor >= 0 && bins[cursor] && (
              <p className="muted">
                {bins[cursor].lo}–{bins[cursor].hi} 구간까지 강조 · 계산값은 그대로 유지합니다.
              </p>
            )}
            <p className="muted">
              그래프는 날짜가 정확한 기록만 표시합니다. {step === 1 ? '하루씩' : `${step}일씩`} 묶어
              보여줍니다. 반복 막대는 확인된 최소 횟수입니다. 날짜 범위·날짜 미정·반복 횟수 미정은
              아래 근거에서 확인할 수 있습니다.
              {compare ? ` 이전 기간: ${previousFrom}–${previousTo} (회색)` : ''}
            </p>
            <details>
              <summary>계산 기준과 미확정 기록</summary>
              <p>
                모집단은 현재 선택한 학기·과목·목차의 살아 있는 기록입니다. 같은 ID는 중복 계산하지
                않습니다. 주제 분모는 현재 목차의 주제 수입니다. 날짜 범위가 기간 안에 모두 들어오면
                포함하고, 일부만 겹치면 가능한 상한에만 포함합니다. 날짜 미정은 기간 밖의 별도
                건수로 남습니다.
              </p>
              {metric.items
                .filter((i) => i.date.kind !== 'exact' || i.maximum === null)
                .map((i) => (
                  <p key={`${i.id}:${i.recordIds.join()}`}>
                    {i.label} · {dateLabel(i)} · {format(i.value, i.maximum)}
                    {metric.unit}
                  </p>
                ))}
            </details>
          </Card>
          <div className="statistics-metrics">
            {metrics.map((m) => {
              const b = statisticBounds(m, from, to),
                prev = statisticBounds(m, previousFrom, previousTo);
              const unavailable =
                readError && ['attempts', 'successes', 'corrections'].includes(m.id);
              return (
                <button
                  type="button"
                  key={m.id}
                  className="statistics-metric"
                  aria-pressed={metricId === m.id}
                  onClick={() => {
                    viewTouched.current = true;
                    setMetric(m.id);
                  }}
                >
                  <span>{m.label}</span>
                  <strong>
                    {unavailable ? '확인 불가' : format(b.lower, b.upper)}
                    {m.denominator !== undefined ? ` / ${m.denominator}` : ''}
                  </strong>
                  <small>
                    {m.unit}
                    {b.undated ? ` · 날짜 미정 ${b.undated}건 별도` : ''}
                  </small>
                  {compare && <small>이전 기간 {format(prev.lower, prev.upper)}</small>}
                </button>
              );
            })}
          </div>
        </>
      )}
      <div className="statistics-filters">
        <Input
          label="통계 시작일"
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <Input label="통계 종료일" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        <Select
          label="통계 과목"
          value={subjectId}
          onChange={(e) => {
            setSubject(e.target.value);
            setNode('');
          }}
        >
          <option value="">현재 범위 전체</option>
          {data.subjects
            .filter((s) => !s.deletedAt && subjectIds.includes(s.id))
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
        </Select>
        <Select label="통계 단원·주제" value={nodeId} onChange={(e) => setNode(e.target.value)}>
          <option value="">전체 목차</option>
          {data.nodes
            .filter(
              (n) =>
                !n.deletedAt &&
                subjectIds.includes(n.subjectId) &&
                (!subjectId || n.subjectId === subjectId),
            )
            .map((n) => (
              <option key={n.id} value={n.id}>
                {data.subjects.find((s) => s.id === n.subjectId)?.name} · {n.name}
              </option>
            ))}
        </Select>
      </div>
      <div className="actions">
        {[7, 14, 30].map((n) => (
          <Button
            key={n}
            variant="quiet"
            onClick={() => {
              setFrom(shiftDay(today, 1 - n));
              setTo(today);
            }}
          >
            최근 {n}일
          </Button>
        ))}
        <Checkbox
          label="같은 길이의 이전 기간과 비교"
          checked={compare}
          onChange={(e) => setCompare(e.target.checked)}
        />
      </div>
      <MonthSummary
        data={data}
        workspace={workspace}
        subjectIds={subjectIds}
        subjectId={subjectId}
        nodeId={nodeId}
        unavailable={Boolean(readError)}
        onOpen={(month, id, items, unit) => {
          const period = calendarMonth(month);
          setFrom(period.from);
          setTo(period.to);
          setMetric(id);
          openEvidence(`${month} · 월간 원기록`, items, unit);
        }}
      />
      <Modal
        open={Boolean(selection)}
        title="통계의 원기록"
        onClose={() => {
          setFrozen(null);
          setSelected(null);
        }}
      >
        {selection && (
          <>
            <p>{selection.label}</p>
            <Button
              variant="quiet"
              aria-pressed={Boolean(frozen)}
              onClick={() =>
                setFrozen(
                  frozen
                    ? null
                    : structuredClone({ ...selection, source: data, events: workspace.events }),
                )
              }
            >
              {frozen ? '고정 풀기' : '이 근거 고정하기'}
            </Button>
            {frozen && (
              <p className="muted">
                선택 당시 근거를 고정했습니다. 이후 변경은 전체 근거를 다시 열어 확인하세요.
              </p>
            )}
            <div className="statistics-evidence">
              {selection.items.length ? (
                selection.items.map((i) => (
                  <article key={`${i.id}:${i.recordIds.join(',')}:${i.eventIds.join(',')}`}>
                    <strong>{i.label}</strong>
                    <p className="muted">
                      {dateLabel(i)} ·{' '}
                      {datePlacement(i.date, from, to) === 'possible'
                        ? '기간 포함 여부 미확정'
                        : i.date.kind === 'unknown'
                          ? '기간에 배정하지 않음'
                          : selection.unit
                            ? `${i.value}${selection.unit}`
                            : '연결된 원기록'}
                    </p>
                    {i.recordIds.map((id) => {
                      const r = sourceData.records.find((r) => r.id === id);
                      return (
                        r && (
                          <div key={id}>
                            <p>{r.body || '남긴 글 없음'}</p>
                            <a href={`#/node/${encodeURIComponent(r.targetId)}`}>
                              주제에서 원기록 열기
                            </a>
                          </div>
                        )
                      );
                    })}
                    {i.eventIds.map((id) => {
                      const e = sourceEvents.find((e) => e.id === id);
                      return (
                        e && (
                          <div key={id}>
                            <p>{e.answer || '남긴 답변 없음'}</p>
                            <p>
                              {e.kind === 'correction'
                                ? '교정 기록'
                                : e.result === 'pass'
                                  ? '기준 충족'
                                  : e.result === 'fail'
                                    ? '막힘'
                                    : '결과 미확인'}{' '}
                              · 자기 보고
                            </p>
                            <a href="#/">다음 공부에서 결과 열기</a>
                          </div>
                        )
                      );
                    })}
                  </article>
                ))
              ) : (
                <p>이 구간에 해당하는 정확한 날짜의 기록이 없습니다.</p>
              )}
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
