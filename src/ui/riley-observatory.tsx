import { RileyNotebook } from './riley-notebook';
import type { StudyRepository } from '../data/repository';
import { RileySectionReading } from './riley-section-reading';
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { AppState } from '../domain/model';
import catalog from '../content/riley/catalog.json' with { type: 'json' };
import {
  RILEY_SCENES,
  observeRiley,
  type RileyScene,
  type RileyResult,
} from '../domain/riley-observations';
import {
  emptyRileyView,
  readRileyView,
  rileyViewKey,
  saveRileyView,
  type RileyView,
  type RileyPosition,
} from '../data/riley-observations';
import { Button, Input, Select, Textarea, Modal, ErrorState } from './index';
import { MathFormula } from './math-formula';
import { ConceptText } from './concept-text';
import { KnowledgeStructure } from './knowledge-structure';
import './riley-observatory.css';
import { navigate } from './navigation-context';
import { formatNumber } from '../interactive/math-physics/presentation.mjs';
import { gestureRanges, type GraphRanges } from '../interactive/math-physics/gestures.mjs';
import { useRileyPlotGestures } from './riley-plot-gestures';
import { hasVisibleTrace, decimalTicks } from '../interactive/math-physics/visibility.mjs';

const VerifiedSource = lazy(() =>
  import('./verified-source-reader').then((m) => ({ default: m.VerifiedSourceReader })),
);
const rileySource = {
  id: 'riley-3e',
  title: '수학교재',
  sha256: '6ea57e9b0829a6de8b0b93db66cb582cbdda8fc343c9f1d017326769b9e66897',
  pages: 1363,
  offset: 30,
  localUrl: '/__riley_source/document.pdf',
};
const DiscoveryPane = lazy(() =>
  import('./riley-discovery').then((m) => ({ default: m.RileyDiscovery })),
);

type Section = (typeof catalog.sections)[number];
const defaults = (scene: RileyScene | null): RileyPosition => ({
  values: scene ? Object.fromEntries(RILEY_SCENES[scene].fields.map((f) => [f.key, f.value])) : {},
  inputs: {},
  step: 0,
  zoom: 1,
  note: '',
  noteHistory: [],
  pendingFields: [],
});
const message = (e: unknown) =>
  e instanceof SyntaxError
    ? '보관된 교재 보기의 형식을 읽지 못했습니다. 원래 자료를 보호하며 쓰기를 멈췄습니다.'
    : e instanceof Error
      ? e.message
      : '현재 보기를 보관하지 못했습니다. 입력은 유지했습니다.';
/** Only notation in our authored observation text; original excerpts stay unchanged. */
function RileyText({ text }: { text: string }) {
  const symbols: Record<string, string> = {
    S_N: 'S_N',
    Sₙ: 'S_n',
    xₙ: 'x_n',
    'x₀': 'x_0',
    Cₘ: 'C_m',
    δij: '\\delta_{ij}',
    ϵijk: '\\epsilon_{ijk}',
    'λ+': '\\lambda_+',
    'λ−': '\\lambda_-',
    'γ²−ω₀²': '\\gamma^2-\\omega_0^2',
    'ω₀': '\\omega_0',
    Ā: '\\bar A',
    'Re z': '\\operatorname{Re}z',
    'Im z': '\\operatorname{Im}z',
    'det A': '\\det A',
  };
  const marked = text.replace(
    /Pr\(([^)]+)\)|S_N|Sₙ|xₙ|x₀|Cₘ|δij|ϵijk|λ\+|λ−|γ²−ω₀²|ω₀|Ā|Re z|Im z|det A|\b[A-Z]\b/g,
    (match, arg) =>
      arg
        ? `$\\operatorname{Pr}(${arg.replaceAll('Ā', '\\bar A').replaceAll('|', '\\mid ')})$`
        : `$${symbols[match] ?? match}$`,
  );
  return <ConceptText text={marked} />;
}
const axisNumber = (n: number) =>
  Math.abs(n) >= 1e4 ? n.toExponential(2).replace(/\.?0+e/, 'e') : formatNumber(n);
function Plot({
  result,
  zoom,
  kind,
  viewport,
  onRange,
  onReset,
}: {
  result: RileyResult;
  zoom: number;
  kind: RileyScene;
  viewport?: GraphRanges;
  onRange: (r: GraphRanges) => void;
  onReset: () => void;
}) {
  const pairs = result.traces.flatMap((t) => t.points).filter((p) => p.every(Number.isFinite));
  if (!pairs.length) pairs.push([0, 0]);
  const xs = pairs.map((p) => p[0]),
    ys = pairs.map((p) => p[1]);
  const minX = Math.min(0, ...xs),
    maxX = Math.max(0, ...xs),
    minY = Math.min(0, ...ys),
    maxY = Math.max(0, ...ys);
  const spatial = ['complex', 'vectors', 'matrix', 'eigen', 'variation', 'polar'].includes(kind);
  const sx = Math.max(maxX - minX, 0.2),
    sy = Math.max(maxY - minY, 0.2);
  const dx = spatial ? Math.max(sx, (sy * 520) / 300) : sx,
    dy = spatial ? (dx * 300) / 520 : sy;
  const baseCx = (maxX + minX) / 2,
    baseCy = (maxY + minY) / 2;
  const range: GraphRanges = viewport ?? {
    x: [baseCx - dx / (2 * zoom), baseCx + dx / (2 * zoom)],
    y: [baseCy - dy / (2 * zoom), baseCy + dy / (2 * zoom)],
  };
  const cx = (range.x[0] + range.x[1]) / 2,
    cy = (range.y[0] + range.y[1]) / 2;
  const svgHost = useRileyPlotGestures(range, onRange);
  const [svgWidth, setSvgWidth] = useState(600);
  useEffect(() => {
    const el = svgHost.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setSvgWidth(Math.max(1, el.clientWidth)));
    observer.observe(el);
    return () => observer.disconnect();
  }, [svgHost]);
  const visible = hasVisibleTrace(
    result.traces.flatMap((t, i) => {
      const trace = (points: [number, number][], mode = 'lines') => ({
        x: points.map((p) => p[0]),
        y: points.map((p) => p[1]),
        mode,
      });
      if (kind === 'fourier' && i === 0)
        return [-1, 1]
          .map((sign) => trace(t.points.filter((p) => p[1] === sign)))
          .concat([
            trace(
              t.points.filter((p) => p[1] === 0),
              'markers',
            ),
          ]);
      if (kind === 'binomial')
        return t.points.map(([a, b]) =>
          trace([
            [a, 0],
            [a, b],
          ]),
        );
      return [
        trace(
          t.points,
          kind === 'statistics' || (kind === 'least-squares' && i === 0) ? 'markers' : 'lines',
        ),
      ];
    }),
    range.x,
    range.y,
  );
  const x = (a: number) => 300 + ((a - cx) * 520) / (range.x[1] - range.x[0]),
    y = (a: number) => 175 - ((a - cy) * 300) / (range.y[1] - range.y[0]);
  const xName = ['ode', 'modes', 'laplace', 'logistic'].includes(kind)
    ? '시간 t'
    : kind === 'newton' || kind === 'geometric'
      ? '항·반복 번호'
      : kind === 'binomial'
        ? '성공 횟수 k'
        : kind === 'statistics'
          ? '자료 번호'
          : kind === 'complex'
            ? 'Re z'
            : 'x';
  const yName =
    kind === 'complex'
      ? 'Im z'
      : kind === 'binomial'
        ? '확률 Pr(X=k)'
        : kind === 'newton'
          ? '반복값 xₙ'
          : kind === 'geometric'
            ? '부분합 Sₙ'
            : kind === 'statistics'
              ? '자료값'
              : ['ode', 'modes', 'laplace', 'logistic'].includes(kind)
                ? 'y(t)'
                : kind === 'wave' || kind === 'diffusion'
                  ? 'u(x,t)'
                  : 'y';
  return (
    <figure className="riley-plot">
      <svg
        viewBox="0 0 600 360"
        ref={svgHost}
        tabIndex={0}
        role="img"
        aria-label={`${xName}에 따른 ${result.traces.map((t) => t.name).join(' · ')} · 아래 값 목록으로 확인 가능`}
      >
        <defs>
          <clipPath id={`riley-plot-clip-${kind}`}>
            <rect x="40" y="20" width="520" height="300" />
          </clipPath>
        </defs>
        <path
          className="riley-axis"
          clipPath={`url(#riley-plot-clip-${kind})`}
          d={`M40 ${y(0)}H560 M${x(0)} 20V320`}
        />
        <g className="riley-axis" style={{ fontSize: (18 * 600) / svgWidth, stroke: 'none' }}>
          {decimalTicks(range.x).map((n) => (
            <text key={`x${n}`} x={x(n)} y="345" textAnchor="middle">
              {axisNumber(n)}
            </text>
          ))}
          {decimalTicks(range.y).map((n) => (
            <text key={`y${n}`} x="44" y={y(n)} textAnchor="start" dominantBaseline="middle">
              {axisNumber(n)}
            </text>
          ))}
        </g>
        <g clipPath={`url(#riley-plot-clip-${kind})`}>
          {result.traces.map((t, i) => (
            <g key={t.name} className={`riley-trace riley-trace-${i}`}>
              {kind === 'binomial' ? (
                t.points.map(([a, b], j) => <path key={j} d={`M${x(a)} ${y(0)}V${y(b)}`} />)
              ) : kind === 'statistics' || (kind === 'least-squares' && i === 0) ? null : kind ===
                  'fourier' && i === 0 ? (
                <>
                  {[-1, 1].map((sign) => (
                    <polyline
                      key={sign}
                      points={t.points
                        .filter(([, b]) => b === sign)
                        .map(([a, b]) => `${x(a)},${y(b)}`)
                        .join(' ')}
                    />
                  ))}
                  {t.points
                    .filter(([, b]) => b === 0)
                    .map(([a, b], j) => (
                      <circle key={j} cx={x(a)} cy={y(b)} r="3" />
                    ))}
                </>
              ) : (
                <polyline points={t.points.map(([a, b]) => `${x(a)},${y(b)}`).join(' ')} />
              )}
              {(t.points.length < 25 || kind === 'binomial') &&
                t.points.map(([a, b], j) => <circle key={j} cx={x(a)} cy={y(b)} r="3" />)}
            </g>
          ))}
        </g>
      </svg>
      <figcaption>
        <p>
          {spatial
            ? '가로·세로 동일 축척'
            : '표시 축 범위는 현재 자료에 맞춤 · 수동 시야가 있으면 유지'}
        </p>
        <p>
          <RileyText text={`가로: ${xName} · 세로: ${yName}`} />
        </p>
        <p className="muted">
          표시 범위 · 가로 {formatNumber(range.x[0])}~{formatNumber(range.x[1])}, 세로{' '}
          {formatNumber(range.y[0])}~{formatNumber(range.y[1])}
        </p>
        {result.traces.map((t, i) => (
          <span key={t.name} className={`riley-legend riley-trace-${i}`}>
            {i + 1}. {i === 0 ? '실선' : i === 1 ? '긴 점선' : '짧은 점선'} ·{' '}
            <RileyText text={t.name} />
          </span>
        ))}
      </figcaption>
      {!visible && (
        <p role="status">
          현재 시야에 그려진 자료가 없습니다. 보기 맞춤으로 계산한 구간을 다시 볼 수 있습니다.
        </p>
      )}
      <p className="muted">
        드래그로 이동 · 두 손가락으로 확대 · 방향키로 이동. 확대는 계산 구간을 늘리지 않습니다.
      </p>
      <div className="riley-actions">
        <Button
          disabled={Math.min(range.x[1] - range.x[0], range.y[1] - range.y[0]) * 0.8 < 0.05}
          onClick={() => {
            const next = gestureRanges(range, 0.8, { x: 0.5, y: 0.5 });
            if (next) onRange(next);
          }}
        >
          ＋ 확대
        </Button>
        <Button
          onClick={() => {
            const next = gestureRanges(range, 1.25, { x: 0.5, y: 0.5 });
            if (next) onRange(next);
          }}
        >
          − 축소
        </Button>
        <Button onClick={onReset}>보기 맞춤</Button>
      </div>
      <details>
        <summary>좌표·값 목록</summary>
        {result.traces.map((t) => (
          <div key={t.name}>
            <h4>{t.name}</h4>
            <div className="riley-table-scroll" tabIndex={0}>
              <table>
                <thead>
                  <tr>
                    <th>
                      <RileyText text={xName} />
                    </th>
                    <th>현재 값</th>
                  </tr>
                </thead>
                <tbody>
                  {t.points.map(([a, b], i) => (
                    <tr key={i}>
                      <td>{formatNumber(a)}</td>
                      <td>{formatNumber(b)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </details>
    </figure>
  );
}
export function RileyObservatory({
  data,
  repository,
  onSaved,
}: {
  data: AppState;
  repository: StudyRepository;
  onSaved: (d: AppState) => void;
}) {
  const key = rileyViewKey(data);
  const [boot] = useState(() => {
    try {
      return { view: readRileyView(key), error: '', blocked: false };
    } catch (e) {
      return { view: emptyRileyView(), error: message(e), blocked: true };
    }
  });
  const [view, setView] = useState(boot.view),
    [error, setError] = useState(boot.error),
    [saved, setSaved] = useState(false),
    [full, setFull] = useState(false),
    [source, setSource] = useState(false);
  const [discoveryOpen, setDiscoveryOpen] = useState(false);
  const [verifiedSource, setVerifiedSource] = useState(false);
  const blocked = useRef(boot.blocked),
    current = useRef(view);
  current.current = view;
  const listPosition = useRef<{ y: number; id: string } | null>(boot.view.listReturn ?? null);
  const [sourceAvailable, setSourceAvailable] = useState<boolean | null>(null),
    [sourcePage, setSourcePage] = useState(1),
    [sourceError, setSourceError] = useState(''),
    [sourceLoading, setSourceLoading] = useState(true);
  useEffect(() => {
    if (!source) return;
    let alive = true;
    setSourceAvailable(null);
    setSourceError('');
    fetch('/__riley_source/status')
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then((v) => {
        if (alive) setSourceAvailable(v.available === true);
      })
      .catch(() => {
        if (alive) setSourceAvailable(false);
      });
    return () => {
      alive = false;
    };
  }, [source]);
  const selection = catalog.sections.find((s) => s.id === view.selected);
  const selectedScene = selection?.scene as RileyScene | null | undefined;
  const position = selection
    ? (view.positions[selection.id] ?? defaults(selectedScene ?? null))
    : null;
  const scene = selectedScene ? RILEY_SCENES[selectedScene] : null;
  const result = useMemo(
    () => (selectedScene && position ? observeRiley(selectedScene, position.values) : null),
    [selectedScene, position?.values],
  );
  const chapter = selection ? catalog.chapters[selection.chapter - 1] : null;
  const update = (next: RileyView) => {
    current.current = next;
    setView(next);
    setSaved(false);
    if (blocked.current) return;
    try {
      saveRileyView(key, next);
      setSaved(true);
      setError('');
    } catch (e) {
      setError(message(e));
    }
  };
  const changePosition = (next: RileyPosition) => {
    if (selection)
      update({
        ...current.current,
        positions: { ...current.current.positions, [selection.id]: next },
      });
  };
  const open = (section: Section) => {
    listPosition.current = { y: window.scrollY, id: section.id };
    setSourcePage(section.pdf);
    update({ ...current.current, selected: section.id, listReturn: listPosition.current });
    requestAnimationFrame(() => document.getElementById('riley-question')?.focus());
  };
  const openSource = () => {
    if (!['127.0.0.1', 'localhost', '[::1]'].includes(location.hostname)) {
      setVerifiedSource(true);
      return;
    }
    setSourceLoading(true);
    if (selection) setSourcePage(position?.sourcePage ?? selection.pdf);
    setSource(true);
  };
  const turnSource = (page: number) => {
    setSourceLoading(true);
    setSourceError('');
    setSourcePage(page);
    if (position) changePosition({ ...position, sourcePage: page });
  };
  const close = () => {
    setFull(false);
    setSource(false);
    update({ ...current.current, selected: '' });
    requestAnimationFrame(() => {
      const p = listPosition.current;
      if (p) {
        document.getElementById(p.id)?.focus({ preventScroll: true });
        window.scrollTo(0, p.y);
      } else document.getElementById('riley-search')?.focus();
    });
  };
  const filtered = useMemo(
    () =>
      catalog.sections.filter(
        (s) =>
          (!view.chapter || s.chapter === view.chapter) &&
          (!view.filter || s.classification === view.filter) &&
          `${s.number} ${s.title} ${catalog.chapters[s.chapter - 1].title}`
            .toLowerCase()
            .includes(view.query.toLowerCase()),
      ),
    [view.chapter, view.filter, view.query],
  );
  const exportView = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(current.current, null, 2)], { type: 'application/json' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = '수학교재-관찰-기기보기.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const observation =
    selection && position && scene && result && selectedScene ? (
      <div className="riley-instrument" data-primary-pattern="L194">
        <section data-observation-region="question">
          <h3 id="riley-question" tabIndex={-1}>
            {scene.question}
          </h3>
          <MathFormula tex={scene.tex} />
          <p className="paper-body prose">
            <RileyText text={scene.conditions} />
          </p>
          <p className="muted">
            관찰용 사례 · 수식의 구체적인 대상·매개변수·초기값·조절 범위는 설계 선택입니다.{' '}
            {scene.initialReason}
          </p>
        </section>
        <section data-observation-region="visual">
          {result.traces.length > 0 ? (
            <>
              <Plot
                result={result}
                zoom={position.zoom}
                kind={selectedScene}
                viewport={position.viewport}
                onRange={(viewport) => changePosition({ ...position, viewport })}
                onReset={() => changePosition({ ...position, viewport: undefined, zoom: 1 })}
              />
            </>
          ) : (
            <KnowledgeStructure
              data={data}
              viewKey={`${selection.id}:case`}
              visual={{
                kind: 'sequence',
                label: scene.title + ' · 조건과 결과의 대응',
                nodes: [
                  {
                    id: 'inputs',
                    label: '선택한 조건',
                    detail: scene.fields
                      .map((f) =>
                        selectedScene === 'bayes' &&
                        ((position.values.p === 0 && f.key === 'a') ||
                          (position.values.p === 1 && f.key === 'b'))
                          ? `${f.label}: 확률 0인 분기이므로 제외`
                          : `${f.label} = ${position.values[f.key]}`,
                      )
                      .join(' · '),
                  },
                  { id: 'rule', label: '적용하는 관계', detail: scene.steps[1] },
                  { id: 'result', label: '현재 결과', detail: result.values.join(' · ') },
                ],
                relations: [
                  { from: 'inputs', to: 'rule', label: '이 값을 관계의 입력으로 사용한다' },
                  { from: 'rule', to: 'result', label: '조건을 확인한 범위에서 결과를 계산한다' },
                ],
                highlighted: ['result'],
              }}
            />
          )}
          {!full && <Button onClick={() => setFull(true)}>크게 보기</Button>}
        </section>
        <section data-observation-region="controls" aria-label="관찰 조건 조절">
          {scene.fields.map((f) => {
            const inactive =
              selectedScene === 'bayes' &&
              ((position.values.p === 0 && f.key === 'a') ||
                (position.values.p === 1 && f.key === 'b'));
            return (
              <div key={f.key}>
                <Input
                  disabled={inactive}
                  label={f.label}
                  value={position.inputs[f.key] ?? String(position.values[f.key])}
                  inputMode="decimal"
                  error={error.startsWith(f.label + ':') ? error : undefined}
                  onChange={(e) =>
                    changePosition({
                      ...position,
                      inputs: { ...position.inputs, [f.key]: e.target.value },
                      pendingFields: [...new Set([...(position.pendingFields ?? []), f.key])],
                    })
                  }
                />
                <Button
                  disabled={inactive}
                  onClick={() => {
                    const raw = position.inputs[f.key] ?? String(position.values[f.key]);
                    const v = Number(raw);
                    if (
                      !raw.trim() ||
                      !/^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(raw.trim()) ||
                      (v === 0 && /[1-9]/.test(raw.split(/[eE]/)[0])) ||
                      !Number.isFinite(v) ||
                      v < f.min ||
                      v > f.max ||
                      (f.step === 1 && !Number.isInteger(v))
                    ) {
                      setError(
                        `${f.label}: ${f.min}~${f.max}${f.step === 1 ? '의 정수' : ''}이며 부동소수점으로 표현 가능한 숫자로 입력해 주세요. 실제 조절값은 유지했습니다.`,
                      );
                      return;
                    }
                    changePosition({
                      ...position,
                      values: { ...position.values, [f.key]: v },
                      inputs: { ...position.inputs, [f.key]: raw },
                      pendingFields: (position.pendingFields ?? []).filter((k) => k !== f.key),
                    });
                  }}
                >
                  값 적용
                </Button>
                <input
                  disabled={inactive}
                  type="range"
                  aria-label={`${f.label} 탐색`}
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={position.values[f.key]}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    changePosition({
                      ...position,
                      values: { ...position.values, [f.key]: v },
                      inputs: { ...position.inputs, [f.key]: String(v) },
                      pendingFields: (position.pendingFields ?? []).filter((k) => k !== f.key),
                    });
                  }}
                />
                <p>
                  {inactive ? (
                    '확률 0인 분기 · 이 조건부 확률 입력은 해석·계산에서 제외합니다.'
                  ) : (
                    <>
                      현재 적용값: {formatNumber(position.values[f.key])}
                      {(position.pendingFields?.includes(f.key) ??
                      (position.inputs[f.key] ?? String(position.values[f.key])) !==
                        String(position.values[f.key]))
                        ? ' · 입력은 확인 전'
                        : ''}
                    </>
                  )}
                </p>
                <p className="muted">
                  조절 범위 {f.min}~{f.max}
                  {f.step === 1 ? ' · 정수' : ''}
                </p>
              </div>
            );
          })}
          <section data-observation-region="readout" aria-live="polite">
            <h4>현재 판단</h4>
            <p>이 사례의 조건: {result.condition}</p>
            {result.values.map((x) => (
              <p key={x} aria-label={x}>
                <RileyText text={x} />
              </p>
            ))}
            <p className="paper-body prose">{result.note}</p>
          </section>
        </section>
        <section data-observation-region="reasoning">
          <h4>
            현재 관계 읽기 · {position.step + 1}/{scene.steps.length}
          </h4>
          <p className="paper-body prose">{scene.steps[position.step]}</p>
          <div className="riley-actions">
            <Button
              disabled={position.step === 0}
              onClick={() => changePosition({ ...position, step: position.step - 1 })}
            >
              앞 단계
            </Button>
            <Button
              disabled={position.step === scene.steps.length - 1}
              onClick={() => changePosition({ ...position, step: position.step + 1 })}
            >
              다음 단계
            </Button>
            <Button onClick={() => changePosition({ ...position, step: 0 })}>설명 처음으로</Button>
            <Button
              onClick={() => {
                const d = defaults(selectedScene);
                changePosition({
                  ...position,
                  values: d.values,
                  inputs: {},
                  pendingFields: [],
                  step: 0,
                  zoom: 1,
                  viewport: undefined,
                });
              }}
            >
              현재 조건·단계 초기화
            </Button>
          </div>
          <p className="muted">
            조건·단계 초기화는 이 관찰의 값·미확정 입력·단계·시점만 바꿉니다. 메모·이력·다른 관찰은
            유지합니다.
          </p>
        </section>
      </div>
    ) : null;
  return (
    <section className="riley-observatory" aria-label="수학교재 관찰">
      <header>
        {new URLSearchParams(window.location.search).get('mathCaller') === 'subjects' && (
          <p>
            <a
              onClick={(event) => {
                if (
                  event.button !== 0 ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return;
                event.preventDefault();
                const p = new URLSearchParams(location.search);
                p.delete('math');
                p.delete('mathCaller');
                history.replaceState(
                  history.state,
                  '',
                  `${location.pathname}?${p}${location.hash}`,
                );
                navigate('/subjects');
              }}
              href={`${location.pathname}?${(() => {
                const p = new URLSearchParams(location.search);
                p.delete('math');
                p.delete('mathCaller');
                return p.toString();
              })()}#/subjects`}
            >
              들어온 과목 목록으로
            </a>
          </p>
        )}
        <h2>수학교재 관찰</h2>
        <p>{catalog.manifest.title} · 제3판</p>
        <p className="muted">
          31장 · 주요 절 248개의 관계·조건 읽기와 계산 관찰 35종을 연결했습니다. 각 사례의 범위와
          원문의 전체 방법을 구별합니다.
        </p>
      </header>
      {error && (
        <div>
          <ErrorState message={error} />
          <Button
            onClick={() => {
              try {
                if (blocked.current) {
                  const restored = readRileyView(key);
                  blocked.current = false;
                  setView(restored);
                } else saveRileyView(key, current.current);
                setError('');
                setSaved(true);
              } catch (e) {
                setError(message(e));
              }
            }}
          >
            {blocked.current ? '보관된 보기 다시 읽기' : '다시 보관'}
          </Button>
          <Button onClick={exportView}>현재 보기 파일로 보관</Button>
        </div>
      )}
      {selection && chapter && position ? (
        <>
          <div className="riley-actions">
            <Button onClick={close}>교재 목록으로</Button>
            <Button onClick={openSource}>원문 위치·발췌 읽기</Button>
            <Button onClick={() => setVerifiedSource(true)}>
              원본 PDF 연결해 읽기 · 기기 보관
            </Button>
          </div>
          <p className="muted">
            {chapter.title} / {selection.number} · {selection.title}
          </p>
          <h3 tabIndex={-1} id={scene ? undefined : 'riley-question'}>
            {selection.title}
          </h3>
          {observation && !full ? (
            observation
          ) : !scene ? (
            <section className="paper-body prose">
              <h4>현재 장의 질문 · 연결 해석</h4>
              <p>{chapter.question}</p>
              <h4>이 절의 원문 발췌</h4>
              <p>{selection.excerpt}</p>
              <p className="muted">{catalog.manifest.sourceInterpretation}</p>
            </section>
          ) : null}
          <RileyNotebook
            data={data}
            repository={repository}
            onSaved={onSaved}
            section={selection.id}
            position={position}
            onRestore={(id, p) => {
              if (!catalog.sections.some((s) => s.id === id)) {
                setError('교재 목록에 없는 보관본이다. 현재 값은 유지한다.');
                return;
              }
              update({
                ...current.current,
                selected: id,
                positions: { ...current.current.positions, [id]: p },
              });
            }}
          />
          <RileySectionReading
            data={data}
            id={selection.id}
            position={position}
            onChange={changePosition}
          />
          {verifiedSource && (
            <Suspense fallback={<p>원문 읽기 도구를 여는 중이다.</p>}>
              <VerifiedSource
                key={selection.id}
                data={data}
                source={rileySource}
                page={position.sourcePage ?? selection.pdf}
                contextId={selection.id}
                position={position.verifiedSource}
                onPositionChange={(v) => changePosition({ ...position, verifiedSource: v })}
                onClose={() => setVerifiedSource(false)}
              />
            </Suspense>
          )}
          <section data-observation-region="reference">
            <p>
              책 인쇄 {selection.printed}쪽 · PDF {selection.pdf}페이지부터 · §{selection.number}
            </p>
            <details>
              <summary>선행 개념·조건·교차 연결 · 장 단위 요약</summary>
              <p className="paper-body prose">{chapter.prior}</p>
              <ConceptText text={chapter.laws} />
              <p className="paper-body prose">{chapter.conditions}</p>
              <p className="paper-body prose">{chapter.next}</p>
            </details>
            <KnowledgeStructure
              data={data}
              viewKey={selection.id}
              visual={{
                kind: 'relation',
                label: '선택한 절과 장의 질문 · 연결 해석',
                nodes: [
                  {
                    id: 'part',
                    label: selection.title,
                    detail: '교재의 해당 절에서 정의·방법·조건을 확인합니다.',
                  },
                  {
                    id: 'question',
                    label: chapter.question,
                    detail: '이 장 전체를 읽는 질문입니다. 사용자 숙달을 뜻하지 않습니다.',
                  },
                ],
                relations: [
                  { from: 'part', to: 'question', label: '이 장의 질문을 다루는 한 부분이다' },
                ],
                highlighted: [],
              }}
            />
            <details>
              <summary>관찰 대응 범위</summary>
              <p>
                {selection.classification} · {selection.reason}
              </p>
              <p>
                원문 읽기와 계산 사례의 구현 범위를 구별합니다. 이 절 전체의 전문 계산 검증을 뜻하지
                않습니다.
              </p>
            </details>
            <Textarea
              className="paper-memo"
              label="이 관찰의 탐색 메모 · 기기 보관"
              value={position.note}
              onChange={(e) => changePosition({ ...position, note: e.target.value })}
            />
            <Button
              onClick={() =>
                changePosition({
                  ...position,
                  noteHistory: [
                    ...position.noteHistory,
                    { text: position.note, at: new Date().toISOString() },
                  ],
                })
              }
            >
              현재 메모를 이력으로 남기기
            </Button>
            {position.noteHistory.length > 0 && (
              <details>
                <summary>남겨둔 메모 이력</summary>
                {position.noteHistory.map((h, i) => (
                  <div key={i}>
                    <time>{h.at}</time>
                    <p className="paper-body prose">{h.text}</p>
                  </div>
                ))}
              </details>
            )}
            <p className="muted" role="status">
              {saved ? '이 기기에 현재 보기를 보관했습니다.' : '현재 보기'} · 서버·다기기 동기화는
              연결하지 않습니다.
            </p>
          </section>
          <Modal open={full} title={scene?.title ?? selection.title} onClose={() => setFull(false)}>
            {observation}
            <p>
              §{selection.number} · 책 인쇄 {selection.printed}쪽 / PDF {selection.pdf}페이지부터
            </p>
            <Button onClick={openSource}>원문 위치·발췌 읽기</Button>
            <Button onClick={() => setVerifiedSource(true)}>
              원본 PDF 연결해 읽기 · 기기 보관
            </Button>
          </Modal>
          <Modal
            open={source}
            title={`원문 · §${selection.number}`}
            onClose={() => setSource(false)}
          >
            <p>
              시작 위치 · 책 인쇄 {selection.printed}쪽 / PDF {selection.pdf}페이지
            </p>
            <p>{catalog.manifest.edition}</p>
            {sourceAvailable === null ? (
              <p>로컬 원본의 연결을 확인하는 중입니다.</p>
            ) : sourceAvailable ? (
              <>
                <p>
                  현재 원문 · PDF {sourcePage}페이지
                  {sourcePage > 30 ? ` / 책 인쇄 ${sourcePage - 30}쪽` : ''}
                </p>
                <div className="riley-actions">
                  <Button
                    disabled={sourcePage <= 1}
                    onClick={() => {
                      turnSource(sourcePage - 1);
                    }}
                  >
                    앞 쪽
                  </Button>
                  <Button
                    disabled={sourcePage >= 1363}
                    onClick={() => {
                      turnSource(sourcePage + 1);
                    }}
                  >
                    다음 쪽
                  </Button>
                  <Button
                    onClick={() => {
                      turnSource(selection.pdf);
                    }}
                  >
                    이 절의 시작 위치
                  </Button>
                  <Button
                    onClick={() =>
                      changePosition({
                        ...position,
                        sourceZoom: Math.min(8, (position.sourceZoom ?? 1) * 1.5),
                      })
                    }
                  >
                    원문 확대
                  </Button>
                  <Button
                    onClick={() =>
                      changePosition({
                        ...position,
                        sourceZoom: Math.max(1, (position.sourceZoom ?? 1) / 1.5),
                      })
                    }
                  >
                    원문 축소
                  </Button>
                  <Button onClick={() => changePosition({ ...position, sourceZoom: 1 })}>
                    원문 보기 맞춤
                  </Button>
                </div>
                {sourceError ? (
                  <p role="alert">{sourceError}</p>
                ) : (
                  <>
                    {sourceLoading && <p role="status">원문 페이지를 불러오는 중입니다.</p>}
                    <div
                      className="riley-source-scroll"
                      tabIndex={0}
                      aria-label="원문 확대 보기 · 좌우로 이동"
                    >
                      <img
                        key={sourcePage}
                        style={{ width: `${(position.sourceZoom ?? 1) * 100}%` }}
                        className="riley-source-image"
                        src={`/__riley_source/page/${sourcePage}`}
                        alt={`원본 교재 PDF ${sourcePage}페이지`}
                        onLoad={() => setSourceLoading(false)}
                        onError={() => {
                          setSourceLoading(false);
                          setSourceError(
                            '원문 페이지를 렌더링하지 못했습니다. 위치와 발췌는 유지했습니다. 앞·다음 쪽 또는 시작 위치에서 다시 확인할 수 있습니다.',
                          );
                        }}
                      />
                    </div>
                  </>
                )}
                <p className="muted">
                  원본 파일을 읽는 로컬 연결입니다. 원본은 수정하거나 업로드하지 않습니다.
                </p>
              </>
            ) : (
              <p>
                현재 실행 환경에서 원본 PDF를 여는 로컬 연결을 사용할 수 없습니다. 아래 발췌와
                위치는 유지했습니다.
              </p>
            )}
            <details>
              <summary>추출 원문 발췌</summary>
              <p className="paper-body prose">{selection.excerpt}</p>
              <p className="muted">{catalog.manifest.sourceInterpretation}</p>
            </details>
            <p className="riley-source-path">원본 파일: {catalog.manifest.sourcePath}</p>
          </Modal>
        </>
      ) : (
        <>
          <details>
            <summary>책 전체의 개념 연결 읽기</summary>
            <Select
              label="읽을 연결 지도"
              value={view.atlas ?? 0}
              onChange={(e) => update({ ...current.current, atlas: Number(e.target.value) })}
            >
              {catalog.atlas.map((m, i) => (
                <option key={m.id} value={i}>
                  {m.title}
                </option>
              ))}
            </Select>
            <KnowledgeStructure
              data={data}
              viewKey={catalog.atlas[view.atlas ?? 0].id}
              visual={{
                kind: 'relation',
                label: catalog.atlas[view.atlas ?? 0].title,
                nodes: catalog.atlas[view.atlas ?? 0].nodes,
                relations: catalog.atlas[view.atlas ?? 0].relations,
                highlighted: [],
              }}
            />
            <p className="paper-body prose">
              기존 교재 연결 지도의 49개 개념 묶음과 61개 관계를 재사용했습니다. 화살표는 교재에
              근거한 연결 해석이며 학습 순위·숙달을 뜻하지 않습니다.
            </p>
            <h3>개념에서 원문 목록으로</h3>
            {catalog.atlas[view.atlas ?? 0].nodes.map((n) => (
              <div key={n.id}>
                <h4>{n.label}</h4>
                <div className="riley-actions">
                  {n.chapters.map((c) => (
                    <Button
                      key={c}
                      onClick={() => {
                        update({ ...current.current, chapter: c, query: '', filter: '' });
                        requestAnimationFrame(() =>
                          document.getElementById('riley-search')?.focus(),
                        );
                      }}
                    >
                      {catalog.chapters[c - 1].title}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </details>
          <div className="riley-filters">
            <Input
              id="riley-search"
              label="교재에서 찾기"
              value={view.query}
              onChange={(e) => update({ ...current.current, query: e.target.value })}
            />
            <Select
              label="교재 장"
              value={view.chapter}
              onChange={(e) => update({ ...current.current, chapter: Number(e.target.value) })}
            >
              <option value={0}>전체 31장</option>
              {catalog.chapters.map((c) => (
                <option key={c.n} value={c.n}>
                  {c.n}. {c.title}
                </option>
              ))}
            </Select>
            <Select
              label="대응 상태"
              value={view.filter}
              onChange={(e) => update({ ...current.current, filter: e.target.value })}
            >
              <option value="">전체</option>
              {['부분 대응', '기존 틀로 대응', '정적 설명 적합', '추가 구현 필요'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </div>
          <p>{filtered.length}개 절</p>
          {filtered.length === 0 && (
            <div>
              <p>조건에 맞는 절이 없습니다. 원문 목록은 유지했습니다.</p>
              <Button
                onClick={() => update({ ...current.current, query: '', chapter: 0, filter: '' })}
              >
                찾기 조건 해제
              </Button>
            </div>
          )}
          <ol className="riley-list">
            {filtered.map((s) => (
              <li key={s.id}>
                <Button id={s.id} onClick={() => open(s)}>
                  {s.number} · {s.title}
                </Button>
                <span>{s.classification}</span>
                {s.scene && <span>조건을 조절하며 살펴보기</span>}
              </li>
            ))}
          </ol>
          <details
            onToggle={(e) => {
              if (e.currentTarget.open) setDiscoveryOpen(true);
            }}
          >
            <summary>세부 제목·식 번호의 확인 대기 목록</summary>
            {discoveryOpen && (
              <Suspense fallback={<p>확인 대기 목록을 여는 중입니다.</p>}>
                <DiscoveryPane
                  data={data}
                  state={view.discovery ?? { query: '', kind: 'subsections', page: 0 }}
                  onChange={(discovery) => update({ ...current.current, discovery })}
                />
              </Suspense>
            )}
          </details>
          <details>
            <summary>자료 확인 범위</summary>
            <p>
              첨부 교재의 기존 전체 독해 기록과 31장·248개 주요 절을 연결했습니다. 개별 세부 제목·식
              번호의 발견 목록은 별도 검토 대상입니다.
            </p>
            <p>별도 해설서: {catalog.manifest.separateWorkedSolutions}</p>
            <p>대응 상태는 자료 구현의 범위이며 공부 완료·숙달을 뜻하지 않습니다.</p>
          </details>
        </>
      )}
    </section>
  );
}
