import { lazy, Suspense, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { AppState } from '../domain/model';
import {
  VECTOR_MODULES,
  VECTOR_SPECS,
  observeVector,
  validParameter,
  type Parameter,
  type ObservationResult,
} from '../domain/vector-calculus';
import {
  freshVectorEntry,
  freshVectorWorkspace,
  readVectorWorkspace,
  writeGuardedVectorWorkspace,
  VectorStorageConflict,
  vectorViewKey,
  type VectorEntry,
  type VectorWorkspace,
} from '../data/vector-calculus-view';
import { Button, ErrorState, Input, Modal, Textarea } from './index';
import { expression } from '../domain/math-explorer';
import { draftHasUnstoredText } from '../data/draft-safety';
import { MathFormula } from './math-formula';
import { navigate } from './navigation-context';
import {
  readReasoningView,
  writeReasoningView,
  reasoningViewKey,
} from '../data/integral-reasoning-view';
import {
  rememberVectorCaller,
  vectorCaller,
  returnVectorCaller,
  consumeVectorReturn,
} from '../data/vector-calculus-view';
import vectorRelations from '../domain/vector-calculus-relations.json';
import { useVectorGestures } from './vector-calculus-gesture';
import { formatNumber as commonNumber } from '../interactive/math-physics/presentation.mjs';
import {
  EXTENSION_NAMES,
  extensionTemplate,
  observeVectorExtension,
  type ExtensionResult,
} from '../domain/vector-calculus-extensions';
import {
  clearVectorRecovery,
  readVectorRecovery,
  retainVectorRecovery,
  vectorRecoveryRaw,
} from '../data/vector-calculus-recovery';
import './vector-calculus.css';
import './math-explorer.css';
import './math-observatory-tokens.css';
const GeneralObservation = lazy(() =>
  import('./vector-calculus-general').then((m) => ({ default: m.VectorGeneralObservation })),
);
const SourceReader = lazy(() =>
  import('./vector-calculus-source').then((m) => ({ default: m.VectorCalculusSource })),
);
const SpatialPlot = lazy(() =>
  import('./math-template-plot').then((m) => ({ default: m.MathTemplatePlot })),
);

const formatNumber = (v: number) => {
  if (v !== 0 && Math.abs(v) < 0.005) return v < 0 ? '−0.01 초과 · 음수' : '0.01 미만 · 양수';
  return commonNumber(v);
};
const format = (v: number | string) =>
  typeof v === 'number'
    ? formatNumber(v)
    : v.startsWith('(')
      ? v.replace(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi, (n) => formatNumber(Number(n)))
      : v;
const symbolTex: Record<string, string> = {
  '∇f': String.raw`\nabla f`,
  'D_v f': String.raw`D_{\mathbf v}f`,
  'f(x,y)': 'f(x,y)',
  '||∇f||': String.raw`\|\nabla f\|`,
  'det J': String.raw`\det J`,
  'div g': String.raw`\operatorname{div}\mathbf g`,
  'curl g': String.raw`\operatorname{curl}\mathbf g`,
  Δf: String.raw`\Delta f`,
  'v·w': String.raw`\mathbf v\cdot\mathbf w`,
  '(v×w)z': String.raw`(\mathbf v\times\mathbf w)_z`,
  'v+w': String.raw`\mathbf v+\mathbf w`,
  '||v||': String.raw`\|\mathbf v\|`,
  '||v+w||': String.raw`\|\mathbf v+\mathbf w\|`,
  ρ: String.raw`\rho`,
  ε: String.raw`\varepsilon`,
  '√2': String.raw`\sqrt2`,
};
function MathematicalName({ text }: { text: string }) {
  if (symbolTex[text]) return <MathFormula tex={symbolTex[text]} inline />;
  const symbols: Record<string, string> = {
    θ: String.raw`\theta`,
    φ: String.raw`\phi`,
    ρ: String.raw`\rho`,
    δ: String.raw`\delta`,
    α: String.raw`\alpha`,
    ℓ: String.raw`\ell`,
    κ: String.raw`\kappa`,
    rᵤ: String.raw`\mathbf r_u`,
    rᵥ: String.raw`\mathbf r_v`,
    'e₁': '\\mathbf e_1',
    'e₂': '\\mathbf e_2',
    'e₃': '\\mathbf e_3',
    'L₁': 'L_1',
    'L₂': 'L_2',
    ε: String.raw`\varepsilon`,
    '∇f': String.raw`\nabla f`,
    Δf: String.raw`\Delta f`,
    x̄: String.raw`\bar x`,
    Î: String.raw`\widehat I`,
    S_n: 'S_n',
    'E[X]': String.raw`E[X]`,
    'x²+y²': 'x^2+y^2',
  };
  return (
    <>
      {text
        .split(
          /(rᵤ|rᵥ|e₁|e₂|e₃|L₁|L₂|x²\+y²|∇f|Δf|x̄|Î|S_n|E\[X\]|θ|φ|ρ|δ|ε|α|ℓ|κ|(?<![A-Za-z])[xyzuvwtfhkJRCMINTB](?![A-Za-z]))/g,
        )
        .map((part, i) =>
          symbols[part] || /^[xyzuvwtfhkJRCMINTB]$/.test(part) ? (
            <MathFormula key={i} tex={symbols[part] ?? part} inline />
          ) : (
            part
          ),
        )}
    </>
  );
}
const download = (filename: string, text: string) => {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
function VectorPlot({
  result,
  view,
  onView,
}: {
  result: ObservationResult;
  view: VectorEntry['view'];
  onView: (view: VectorEntry['view']) => void;
}) {
  const clipId = useId().replaceAll(':', '');
  const plot = useVectorGestures(result.extent, view, onView);
  const arrowId = `${clipId}-arrow`;
  const extent = result.extent / view.zoom;
  const point = (p: [number, number]) => [
    250 + Math.max(-1e6, Math.min(1e6, (p[0] - view.x) / extent)) * 210,
    250 - Math.max(-1e6, Math.min(1e6, (p[1] - view.y) / extent)) * 210,
  ];
  const zoom = (factor: number) =>
    onView({ ...view, zoom: Math.max(0.25, Math.min(8, view.zoom * factor)) });
  const pan = (x: number, y: number) =>
    onView({
      ...view,
      x: Math.max(-100, Math.min(100, view.x + x * extent * 0.2)),
      y: Math.max(-100, Math.min(100, view.y + y * extent * 0.2)),
    });
  const origin = point([0, 0]);
  return (
    <section data-observation-region="visual" aria-label="관찰 도해">
      <svg
        ref={plot}
        className="vector-plot"
        viewBox="0 0 500 500"
        role="img"
        tabIndex={0}
        aria-label={`${result.axes[0]}, ${result.axes[1]} 좌표 도해. 방향키 이동, 더하기와 빼기로 확대 축소.`}
        onKeyDown={(e) => {
          if (
            ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', 'Home'].includes(
              e.key,
            )
          ) {
            e.preventDefault();
            if (e.key === 'Home') onView({ zoom: 1, x: 0, y: 0 });
            else if (['+', '='].includes(e.key)) zoom(1.25);
            else if (e.key === '-') zoom(0.8);
            else
              pan(
                e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0,
                e.key === 'ArrowUp' ? 1 : e.key === 'ArrowDown' ? -1 : 0,
              );
          }
        }}
      >
        <title>{result.axes.join(' · ')} 축을 쓰는 관찰</title>
        <defs>
          <clipPath id={clipId}>
            <rect x="35" y="35" width="430" height="430" />
          </clipPath>
          <marker
            id={arrowId}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" />
          </marker>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <line
            className="vector-axis"
            x1="40"
            x2="460"
            y1={origin[1]}
            y2={origin[1]}
            strokeWidth="1"
          />
          <line
            className="vector-axis"
            y1="40"
            y2="460"
            x1={origin[0]}
            x2={origin[0]}
            strokeWidth="1"
          />
          {result.traces.map((trace, i) =>
            trace.label.startsWith('표본') || trace.kind === 'points' ? (
              <g key={i}>
                {trace.points.map((p, j) => {
                  const [cx, cy] = point(p);
                  return (
                    <circle
                      key={j}
                      cx={cx}
                      cy={cy}
                      r={trace.kind === 'points' ? 4 : 2}
                      fill="currentColor"
                    />
                  );
                })}
              </g>
            ) : (
              <polyline
                key={i}
                className="vector-trace"
                points={trace.points.map((p) => point(p).join(',')).join(' ')}
                strokeWidth={i === 0 ? 2.5 : 1.8}
                strokeDasharray={trace.dashed ? '7 5' : undefined}
                markerEnd={trace.arrow ? `url(#${arrowId})` : undefined}
              />
            ),
          )}
          {result.traces
            .filter((trace) => trace.label && !trace.label.startsWith('표본'))
            .map((trace, i) => {
              const [tx, ty] = point(trace.points[Math.floor((trace.points.length - 1) * 0.8)]);
              return (
                <text key={trace.label} x={tx + 7} y={ty - 7 - i * 18} fontSize="16">
                  {i + 1}
                </text>
              );
            })}
        </g>
        <foreignObject x="425" y="467" width="60" height="30">
          <MathematicalName text={result.axes[0]} />
        </foreignObject>
        <foreignObject x="12" y="5" width="220" height="30">
          <MathematicalName text={result.axes[1]} />
        </foreignObject>
        {[-1, 0, 1].map((t) => (
          <g key={t}>
            <text x={250 + 200 * t} y="465" textAnchor="middle" fontSize="13">
              {format(view.x + t * extent * 0.95)}
            </text>
            <text x="35" y={250 - 200 * t} textAnchor="end" fontSize="13">
              {format(view.y + t * extent * 0.95)}
            </text>
          </g>
        ))}
      </svg>
      <ul aria-label="도해 표식">
        {result.traces
          .filter((t) => t.label)
          .map((t, i) => (
            <li key={i}>
              {i + 1} · <MathematicalName text={t.label} />
              {t.kind === 'points' || t.label.startsWith('표본')
                ? ' · 점'
                : t.dashed
                  ? ' · 점선'
                  : ' · 실선'}
            </li>
          ))}
      </ul>
      <div className="vector-actions" aria-label="시야 조절">
        <Button onClick={() => zoom(1.25)}>그래프 확대</Button>
        <Button onClick={() => zoom(0.8)}>그래프 축소</Button>
        <Button onClick={() => onView({ zoom: 1, x: 0, y: 0 })}>보기 초기화</Button>
        <Button
          onClick={() => {
            const points = result.traces.flatMap((t) => t.points);
            if (!points.length) return;
            const xs = points.map((p) => p[0]),
              ys = points.map((p) => p[1]);
            const x0 = Math.min(...xs),
              x1 = Math.max(...xs),
              y0 = Math.min(...ys),
              y1 = Math.max(...ys);
            const span = Math.max(x1 - x0, y1 - y0, 0.1) * 0.6;
            onView({
              zoom: Math.max(0.25, Math.min(8, result.extent / span)),
              x: Math.max(-100, Math.min(100, (x0 + x1) / 2)),
              y: Math.max(-100, Math.min(100, (y0 + y1) / 2)),
            });
          }}
        >
          대상에 맞추기
        </Button>
      </div>
      <p>드래그로 이동 · 두 손가락으로 확대. 키보드 방향키로 이동할 수 있다.</p>
      <details>
        <summary>도해의 범위와 읽는 방법</summary>
        <p>
          보기 조절은 조절값과 메모를 유지한다. 공간 좌표 도해는 동일 축척이다. 시야 범위를 넘는
          매우 큰 값은 수치·단계 설명으로 확인한다. 밀도 그래프는 x와 δ의 서로 다른 단위를 각 축에서
          구별한다. 곡선은 유한한 표본을 연결한 표시이다.
        </p>
      </details>
    </section>
  );
}
function ParameterControl({
  parameter,
  entry,
  onChange,
}: {
  parameter: Parameter;
  entry: VectorEntry;
  onChange: (patch: Partial<VectorEntry>) => void;
}) {
  const p = parameter,
    value = entry.values[p.key],
    text = entry.drafts[p.key] ?? String(value);
  const draft = (raw: string) =>
    onChange({
      drafts: { ...entry.drafts, [p.key]: raw },
      errors: { ...entry.errors, [p.key]: '' },
    });
  const commit = () => {
    let next: number;
    try {
      next = text.trim() === '' ? NaN : (expression(text).value({}) ?? NaN);
    } catch {
      next = NaN;
    }
    if (!validParameter(p, next)) {
      onChange({
        errors: {
          ...entry.errors,
          [p.key]: `${p.min}부터 ${p.max} 사이${p.key === 'sign' ? '의 −1 또는 1' : p.integer ? '의 정수' : ''}를 입력해 주세요. 실제값은 유지했다.`,
        },
      });
      return;
    }
    onChange({
      values: { ...entry.values, [p.key]: next },
      drafts: { ...entry.drafts, [p.key]: text },
      errors: { ...entry.errors, [p.key]: '' },
    });
  };
  return (
    <div>
      <Input
        label={p.label}
        value={text}
        inputMode="decimal"
        error={entry.errors[p.key] || undefined}
        hint={`허용 범위 ${p.min}–${p.max}${p.integer ? ' · 정수' : ''}`}
        onChange={(e) => draft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit();
          }
          if (e.key === 'Escape')
            onChange({
              drafts: { ...entry.drafts, [p.key]: String(value) },
              errors: { ...entry.errors, [p.key]: '' },
            });
        }}
      />
      <span className="vector-caption">
        <MathematicalName text={p.label} />
      </span>
      {p.options && (
        <label>
          대상 선택
          <select
            aria-label={`${p.label} 선택`}
            value={value}
            onChange={(e) => {
              const next = Number(e.target.value);
              onChange({
                values: { ...entry.values, [p.key]: next },
                drafts: { ...entry.drafts, [p.key]: String(next) },
                errors: { ...entry.errors, [p.key]: '' },
              });
            }}
          >
            {p.options.map((label, i) => (
              <option key={label} value={i}>
                {label}
              </option>
            ))}
          </select>
        </label>
      )}
      {p.key !== 'sign' && !p.options && (
        <input
          type="range"
          aria-label={`${p.label} 탐색`}
          min={p.min}
          max={p.max}
          step={p.integer ? 1 : 'any'}
          value={value}
          onChange={(e) => {
            const next = Number(e.target.value);
            onChange({
              values: { ...entry.values, [p.key]: next },
              drafts: { ...entry.drafts, [p.key]: String(next) },
              errors: { ...entry.errors, [p.key]: '' },
            });
          }}
        />
      )}
      {p.key === 'sign' && (
        <div className="vector-actions">
          <Button
            aria-pressed={value === 1}
            onClick={() =>
              onChange({
                values: { ...entry.values, sign: 1 },
                drafts: { ...entry.drafts, sign: '1' },
                errors: { ...entry.errors, sign: '' },
              })
            }
          >
            양의 방향 +1
          </Button>
          <Button
            aria-pressed={value === -1}
            onClick={() =>
              onChange({
                values: { ...entry.values, sign: -1 },
                drafts: { ...entry.drafts, sign: '-1' },
                errors: { ...entry.errors, sign: '' },
              })
            }
          >
            반대 방향 −1
          </Button>
        </div>
      )}
    </div>
  );
}
export function VectorCalculus({
  data,
  sourceShelf = false,
}: {
  data: Pick<AppState, 'namespace' | 'userId'>;
  sourceShelf?: boolean;
}) {
  const key = vectorViewKey(data);
  const [initial] = useState(() => {
    try {
      const value = readVectorWorkspace(key);
      return {
        value,
        baseRaw: localStorage.getItem(key),
        error: draftHasUnstoredText(key)
          ? '이전 저장 실패 입력을 현재 세션에서 복구했다. 다시 저장하거나 파일로 보관해 주세요.'
          : '',
        blocked: false,
      };
    } catch (error) {
      return {
        value: freshVectorWorkspace(),
        baseRaw: null,
        error: String(error),
        blocked: true,
      };
    }
  });
  const [workspace, setWorkspace] = useState(initial.value),
    [error, setError] = useState(initial.error),
    [status, setStatus] = useState(''),
    [full, setFull] = useState(
      () =>
        (initial.value.reading?.route === window.location.hash.slice(1) &&
          initial.value.reading.full) ||
        false,
    ),
    [small, setSmall] = useState(
      () =>
        (initial.value.reading?.route === window.location.hash.slice(1) &&
          initial.value.reading.small) ||
        false,
    ),
    [source, setSource] = useState(false),
    [recoveredReading, setRecoveredReading] = useState(0);
  const blocked = useRef(initial.blocked),
    lastStoredRaw = useRef<string | null>(initial.baseRaw),
    saveRevision = useRef(0),
    protectedRecovery = useRef(''),
    recoveryReady = useRef(false),
    recoveryFlight = useRef<Promise<void>>(Promise.resolve()),
    mounted = useRef(true),
    current = useRef(workspace),
    pendingReturn = useRef<ReturnType<typeof consumeVectorReturn>>(undefined),
    question = useRef<HTMLHeadingElement>(null),
    readPosition = useRef<{ element: HTMLElement | null; scroll: number }>({
      element: null,
      scroll: 0,
    });
  current.current = workspace;
  useEffect(() => {
    mounted.current = true;
    const revision = saveRevision.current;
    recoveryFlight.current = readVectorRecovery(key)
      .then((value) => {
        recoveryReady.current = true;
        if (value && mounted.current && saveRevision.current !== revision) {
          protectedRecovery.current =
            '이전 복구 사본을 읽는 동안 새 입력이 생겼다. 현재 입력을 유지하고 이전 사본을 자동으로 지우지 않는다.';
          setError(protectedRecovery.current);
          return;
        }
        if (!mounted.current || blocked.current || saveRevision.current !== revision || !value)
          return;
        current.current = value;
        setWorkspace(value);
        setRecoveredReading((n) => n + 1);
        const position = value.reading;
        if (position?.route === window.location.hash.slice(1)) {
          setSmall(position.small);
          setFull(position.full);
        }
        setError(
          '기기 복구 사본에서 이전 저장 실패 입력을 복원했다. 원래 저장 경로는 다시 시도할 수 있다.',
        );
        setStatus('복구 사본 보관됨 · 이 기기');
      })
      .catch((e) => {
        recoveryReady.current = true;
        if (mounted.current) {
          protectedRecovery.current = String(e);
          setError(String(e));
        }
      });
    return () => {
      mounted.current = false;
    };
  }, [key]);
  useEffect(() => {
    const position = workspace.reading;
    if (!position || position.route !== window.location.hash.slice(1)) return;
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const body = document.querySelector<HTMLElement>('.vector-full.ui-modal');
        if (body) body.scrollTop = position.scroll;
        else window.scrollTo({ top: position.scroll });
      }),
    );
    return () => cancelAnimationFrame(frame);
  }, [small, full, recoveredReading]);
  useEffect(() => {
    if (!sourceShelf) return;
    const caller = consumeVectorReturn(key);
    if (!caller) return;
    const next = {
      ...current.current,
      active: caller.id,
      reading: { route: caller.route, small: caller.small, full: false, scroll: caller.scroll },
    };
    save(next);
    pendingReturn.current = caller;
    setSmall(caller.small);
  }, [key, sourceShelf]);
  useEffect(() => {
    const caller = pendingReturn.current;
    if (!caller || (caller.small && (!small || full))) return;
    // Restore after the returned dialog has committed and installed its focus trap.
    const frame = requestAnimationFrame(() => {
      const button = document.querySelector<HTMLElement>('[data-vector-workbench]');
      if (!button) return;
      const body = button?.closest('.ui-modal');
      if (body) body.scrollTop = caller.scroll;
      button?.focus({ preventScroll: true });
      pendingReturn.current = undefined;
    });
    return () => cancelAnimationFrame(frame);
  }, [small, full, workspace.active]);
  const save = (next: VectorWorkspace) => {
    const revision = ++saveRevision.current;
    setWorkspace(next);
    current.current = next;
    if (blocked.current) {
      setStatus('현재 변경은 이 창에 유지한다. 기존 저장 원문을 보호하므로 덮어쓰지 않았다.');
      return;
    }
    try {
      lastStoredRaw.current = writeGuardedVectorWorkspace(key, next, lastStoredRaw.current);
      if (recoveryReady.current && !protectedRecovery.current)
        void clearVectorRecovery(key).catch((e) => {
          if (mounted.current && saveRevision.current === revision)
            setError(`관찰은 저장했지만 이전 복구 사본 정리를 확인하지 못했다. ${String(e)}`);
        });
      setError(protectedRecovery.current);
      setStatus('관찰 보기 저장됨 · 이 기기');
    } catch (e) {
      if (e instanceof VectorStorageConflict) {
        blocked.current = true;
        setError(e.message);
        setStatus('자동 보관 중단 · 현재 입력과 저장 원문 보존');
        return;
      }
      setError(e instanceof Error ? e.message : '이 기기에 저장하지 못했다. 현재 입력은 유지했다.');
      setStatus('저장되지 않은 변경 · 현재 창');
      if (protectedRecovery.current) {
        setError(
          `${protectedRecovery.current} 현재 변경은 이 창에 유지하며 보호 중인 사본을 덮어쓰지 않는다. 파일로 보관하거나 원래 저장을 다시 시도할 수 있다.`,
        );
        return;
      }
      let baseRaw: string | null;
      try {
        baseRaw = localStorage.getItem(key);
      } catch {
        return;
      }
      void recoveryFlight.current
        .then(() => {
          if (protectedRecovery.current) throw Error(protectedRecovery.current);
          return retainVectorRecovery(key, baseRaw, next);
        })
        .then(() => {
          if (!mounted.current || saveRevision.current !== revision) return;
          setStatus('복구 사본 보관됨 · 이 기기');
          setError(
            '원래 저장 경로에 보관하지 못했지만 기기 복구 사본을 보관했다. 재접속 후 복구하며 원래 저장은 다시 시도할 수 있다.',
          );
        })
        .catch(() => {
          if (mounted.current && saveRevision.current === revision)
            setError(
              protectedRecovery.current ||
                '원래 저장과 기기 복구 사본 보관을 모두 마치지 못했다. 현재 입력은 이 창에 유지한다. 파일로 보관하거나 다시 시도해 주세요.',
            );
        });
    }
  };
  const module = VECTOR_MODULES.find((m) => m.id === workspace.active)!,
    observationId = workspace.selected?.[module.id] ?? module.id,
    extended = observationId !== module.id,
    spec = VECTOR_SPECS[observationId];
  const entry = useMemo(
    () => workspace.entries[observationId] ?? freshVectorEntry(observationId),
    [workspace.entries, observationId],
  );
  const result = useMemo(
    () =>
      extended
        ? observeVectorExtension(observationId, entry.values)
        : observeVector(module.id, entry.values),
    [observationId, module.id, extended, entry.values],
  );
  const spatial = extended ? (result as ExtensionResult).spatial : undefined;
  const densityProjection = extended && module.id === 'C4' && entry.values.kind === 0;
  const spatialItem = useMemo(() => extensionTemplate(observationId), [observationId]);
  const patch = (change: Partial<VectorEntry>) => {
    const now = current.current;
    save({
      ...now,
      entries: {
        ...now.entries,
        [observationId]: {
          ...(now.entries[observationId] ?? freshVectorEntry(observationId)),
          ...change,
        },
      },
    });
  };
  const retry = () => {
    if (blocked.current) {
      try {
        const restored = readVectorWorkspace(key);
        lastStoredRaw.current = localStorage.getItem(key);
        current.current = restored;
        blocked.current = false;
        setWorkspace(restored);
        setError('');
        setStatus('저장 원문을 다시 읽었다.');
      } catch (e) {
        setError(String(e));
      }
    } else save(current.current);
  };
  const choose = (id: string) => {
    save({
      ...current.current,
      active: id,
      reading: { route: window.location.hash.slice(1), small: sourceShelf, full: false, scroll: 0 },
    });
    if (sourceShelf) setSmall(true);
    else question.current?.focus({ preventScroll: true });
  };
  const rememberReading = (smallValue = small, fullValue = full, scroll = 0) =>
    save({
      ...current.current,
      reading: { route: window.location.hash.slice(1), small: smallValue, full: fullValue, scroll },
    });
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const track = (event: Event) => {
      const element = event.target instanceof HTMLElement ? event.target : null;
      if (element?.classList.contains('ui-modal') && !element.classList.contains('vector-full'))
        return;
      if (
        element &&
        !element.classList.contains('ui-modal') &&
        element !== document.documentElement &&
        element !== document.body
      )
        return;
      const scroll = element?.classList.contains('ui-modal') ? element.scrollTop : window.scrollY;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => rememberReading(small, full, scroll), 150);
    };
    const flush = () => {
      if (timer) clearTimeout(timer);
      timer = undefined;
      const body = document.querySelector<HTMLElement>('.vector-full.ui-modal');
      rememberReading(small, full, body?.scrollTop ?? window.scrollY);
    };
    document.addEventListener('scroll', track, true);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('scroll', track, true);
      window.removeEventListener('pagehide', flush);
      if (timer) clearTimeout(timer);
    };
  }, [small, full, observationId]);
  const selected = workspace.query.trim().toLocaleLowerCase();
  const catalog = (
    <>
      <Input
        label="벡터 미적분 개념 찾기"
        value={workspace.query}
        onChange={(e) => save({ ...current.current, query: e.target.value })}
      />
      <ul className="vector-catalog">
        {VECTOR_MODULES.filter((m) =>
          `${m.title} ${m.question} ${m.group}`.toLocaleLowerCase().includes(selected),
        ).map((m) => (
          <li key={m.id}>
            <Button
              data-vector-module={m.id}
              aria-pressed={module.id === m.id}
              onClick={() => choose(m.id)}
            >
              <strong>{m.title}</strong>
              <span>{m.question}</span>
            </Button>
          </li>
        ))}
      </ul>
      {!VECTOR_MODULES.some((m) =>
        `${m.title} ${m.question} ${m.group}`.toLocaleLowerCase().includes(selected),
      ) && <p>일치하는 개념이 없다. 검색어를 바꾸면 전체 자료에서 다시 찾을 수 있다.</p>}
    </>
  );
  const observation = (expanded = false) => (
    <article className="vector-paper">
      <header data-observation-region="question">
        <p className="vector-caption">{module.group} · 교재 밖 관찰 예시</p>
        <h3 data-vector-question ref={!expanded ? question : undefined} tabIndex={-1}>
          {module.title}
        </h3>
        <p>
          <MathematicalName text={spec.question} />
        </p>
        <div className="vector-actions" aria-label="관찰 선택">
          <Button
            aria-pressed={!extended}
            onClick={() =>
              save({
                ...current.current,
                selected: { ...current.current.selected, [module.id]: module.id },
              })
            }
          >
            기본 관찰
          </Button>
          <Button
            aria-pressed={extended}
            onClick={() =>
              save({
                ...current.current,
                selected: { ...current.current.selected, [module.id]: `${module.id}:extension:1` },
              })
            }
          >
            {EXTENSION_NAMES[module.id]}
          </Button>
        </div>
        <MathFormula tex={module.tex} label="교재 원식" />
        <p>
          <strong>교재 적용 조건:</strong> <MathematicalName text={module.condition} />
        </p>
        <p>
          <strong>이번 관찰에서 고정할 것:</strong> <MathematicalName text={spec.fixed} />
        </p>
      </header>
      <div className="vector-actions">
        <Button onClick={() => setSource(true)}>원문 위치 확인</Button>
        {!expanded && (
          <Button
            data-vector-maximize
            onClick={(event) => {
              readPosition.current = {
                element: event.currentTarget,
                scroll: event.currentTarget.closest('.ui-modal')?.scrollTop ?? window.scrollY,
              };
              setFull(true);
              rememberReading(small, true);
            }}
          >
            크게 보기
          </Button>
        )}
        <Button
          onClick={() => {
            setSmall(false);
            setFull(false);
            rememberReading(false, false);
            document.getElementById('vector-catalog-title')?.scrollIntoView({ block: 'start' });
          }}
        >
          전체 개념 목록
        </Button>
        {sourceShelf && (
          <Button
            data-vector-workbench
            onClick={(event) => {
              try {
                const reading = readReasoningView(reasoningViewKey(data));
                writeReasoningView(reasoningViewKey(data), {
                  ...reading,
                  active: 'vector-calculus',
                });
                const body = event.currentTarget.closest('.ui-modal');
                rememberVectorCaller(key, {
                  route: window.location.hash.slice(1),
                  id: module.id,
                  scroll: body?.scrollTop ?? 0,
                  small,
                });
                navigate('/math');
              } catch (e) {
                setError(String(e));
              }
            }}
          >
            탐구 작업대에서 열기
          </Button>
        )}
      </div>
      <div className="vector-observation-grid">
        {spatial ? (
          <section data-observation-region="visual" aria-label="공간 관찰 도해">
            <Suspense fallback={<p>공간 관찰을 여는 중이다.</p>}>
              <SpatialPlot
                key={`${observationId}:${expanded}`}
                item={spatialItem}
                result={spatial}
                ordinaryWheelScroll
                labelledVectors
                compactCamera
                surfaceProjectionLabel={densityProjection ? 'δ · 밀도' : undefined}
                initialView={entry.sceneView}
                onView={(sceneView) => patch({ sceneView: { ...entry.sceneView, ...sceneView } })}
              />
            </Suspense>
            <ul aria-label="공간 도해 표식">
              {spatial.lines
                .filter((l) => l.name)
                .map((l, i) => (
                  <li key={`${i}:${l.name}`}>
                    <MathematicalName text={l.name} />
                    {l.role === 'secondary' ? ' · 비교선' : ' · 공간선'}
                  </li>
                ))}
            </ul>
            <p>
              {densityProjection
                ? 'x, y는 위치이며 같은 축척이다. 색과 점별 수치는 면밀도 δ를 나타낸다. δ의 단위는 질량/면적이며 공간의 높이가 아니다. 이 예시의 좌표와 밀도 계수는 정규화한 값이다.'
                : '직교 공간 좌표는 같은 축척이다.'}{' '}
              시야 변화는 수식·조절값·메모를 유지한다. 그림은 유한 표본이며 일반적인 증명이 아니다.
            </p>
          </section>
        ) : module.id === 'C2' && extended ? (
          <section>
            <p>{result.judgment}</p>
          </section>
        ) : (
          <VectorPlot result={result} view={entry.view} onView={(view) => patch({ view })} />
        )}
        <section
          className="vector-controls"
          data-observation-region="controls"
          aria-label="변수와 현재 상태"
        >
          {spec.parameters.map((p) => (
            <ParameterControl
              key={`${module.id}:${p.key}`}
              parameter={p}
              entry={entry}
              onChange={patch}
            />
          ))}
          <section
            className="vector-result"
            data-observation-region="readout"
            aria-label="현재값과 조건 판단"
          >
            <h3>현재값과 조건</h3>
            <dl className="vector-values">
              {result.values.map(([name, value]) => (
                <div key={name}>
                  <dt>
                    <MathematicalName text={name} />
                  </dt>
                  <dd>{format(value)}</dd>
                </div>
              ))}
            </dl>
            <p role="status">{result.judgment}</p>
          </section>
        </section>
      </div>
      <section data-observation-region="reasoning">
        <h3>계산·조건·한계</h3>
        <MathFormula tex={spec.equations.join(',\\quad ')} label="교재 밖 관찰 예시의 식" />
        {result.steps && (
          <ol>
            {result.steps.map((step, i) => (
              <li key={i}>
                <MathematicalName
                  text={step.replace(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi, (n) =>
                    formatNumber(Number(n)),
                  )}
                />
              </li>
            ))}
          </ol>
        )}
        <p>
          <strong>초기값의 이유:</strong> {spec.initialReason}
        </p>
        <p>{spec.limitations}</p>
        <p>
          현재값은 최대 소수 두 자리로 표시하며 작은 비영 값은 부호와 0.01 미만 범위를 함께 알린다.
          미확정 입력 원문과 반복 단계의 계산 근거는 보존한다. 화면 반올림은 계산·저장 값에 적용하지
          않는다. 계산은 배정밀도 부동소수점이며 매우 작은 곱의 표시 0을 수학적 0의 증거로 삼지
          않는다. 움직이는 그림과 수치 예시는 일반적인 증명을 대신하지 않는다.
        </p>
        {[
          'A3',
          'A4',
          'A5',
          'B1',
          'B2',
          'B3',
          'C1',
          'C3',
          'C4',
          'D1',
          'D2',
          'D3',
          'D4',
          'D5',
        ].includes(module.id) && (
          <details>
            <summary>다른 식과 조건의 관계 관찰 열기</summary>
            <Suspense fallback={<p>추가 관찰을 여는 중이다.</p>}>
              <GeneralObservation
                moduleId={module.id}
                value={entry.general}
                onChange={(general) => patch({ general })}
                onSource={() => setSource(true)}
              />
            </Suspense>
          </details>
        )}
        {module.details.map((d, i) => (
          <section
            className="vector-detail"
            id={`vector-${module.id}-detail-${i + 1}`}
            key={`${module.id}:detail:${i + 1}`}
          >
            <h3>{d.label}</h3>
            <MathFormula tex={d.tex} label={d.label} />
            {d.note && <p>{d.note}</p>}
            <p>
              원식과 조건을 읽는 정적 설명이다. 위 모형이 이 항목 전체를 구현하거나 증명한 것으로
              처리하지 않는다.
            </p>
          </section>
        ))}
        <section aria-label="기존 지도에서 이어지는 개념">
          <h3>이어지는 개념</h3>
          <p>
            기존 정리의 연결 해설이다. 화살표는 개념을 설명할 때 이어 쓰는 방향이며, 정리의
            무조건적인 성립이나 공부 순서를 뜻하지 않는다.
          </p>
          <ul>
            {vectorRelations
              .filter((r) => r.from === module.id || r.to === module.id)
              .map((r) => (
                <li key={`${r.from}:${r.to}`}>
                  <Button onClick={() => choose(r.from)}>
                    {VECTOR_MODULES.find((m) => m.id === r.from)!.title}
                  </Button>
                  <span> → {r.meaning} → </span>
                  <Button onClick={() => choose(r.to)}>
                    {VECTOR_MODULES.find((m) => m.id === r.to)!.title}
                  </Button>
                </li>
              ))}
          </ul>
        </section>
        <Textarea
          label="이 관찰의 개인 메모"
          value={entry.notes}
          onChange={(e) => patch({ notes: e.target.value })}
          rows={4}
          hint="관찰 조작과 메모는 공부 완료·정답·숙달로 기록하지 않는다."
        />
        <div className="vector-actions">
          <Button
            onClick={() => {
              const fresh = freshVectorEntry(observationId);
              patch({ values: fresh.values, drafts: {}, errors: {}, step: 0 });
            }}
          >
            이 개념 값 처음으로
          </Button>
          <Button
            onClick={(event) => {
              const heading = event.currentTarget
                .closest('article')
                ?.querySelector<HTMLElement>('[data-vector-question]');
              heading?.focus({ preventScroll: true });
              heading?.scrollIntoView({ block: 'start' });
            }}
          >
            현재 질문으로 돌아가기
          </Button>
          {module.id === 'A5' && (
            <Button
              onClick={() => {
                try {
                  const reading = readReasoningView(reasoningViewKey(data));
                  writeReasoningView(reasoningViewKey(data), {
                    ...reading,
                    active: 'graph',
                  });
                  navigate('/math');
                } catch (e) {
                  setError(String(e));
                }
              }}
            >
              기존 함수와 공간곡선 도구 열기
            </Button>
          )}
        </div>
        <p>
          개념 값 초기화는 메모·시야·다른 개념을 유지한다. 확정값·미확정 입력·오류·메모·시야·선택은
          이 기기에 보관한다. 서버·다른 기기 동기화는 제공하지 않는다.
        </p>
      </section>
    </article>
  );
  return (
    <section
      className="vector-calculus math-explorer"
      aria-label="벡터 미적분 자료와 관찰"
      data-layout-primary="L194"
      data-feature-role="instrument"
    >
      <h2 id="vector-catalog-title">벡터 미적분 · 자료와 관찰</h2>
      <p>원자료에 연결된 17개 개념을 읽고, 조건을 바꾸어 관계를 관찰한다.</p>
      {sourceShelf && <p>서쪽 자료 책장 · 작은 관찰을 자료 곁에서 열 수 있다.</p>}
      {error && (
        <>
          <ErrorState message={error} />
          <div className="vector-actions">
            <Button onClick={retry}>
              {blocked.current ? '저장 원문 다시 읽기' : '관찰 저장 다시 시도'}
            </Button>
            <Button
              onClick={() =>
                download('벡터 미적분 현재 관찰.json', JSON.stringify(current.current, null, 2))
              }
            >
              현재 관찰 파일로 보관
            </Button>
            <Button
              onClick={() => {
                void vectorRecoveryRaw(key)
                  .then((raw) =>
                    download('벡터 미적분 복구 사본.json', JSON.stringify(raw ?? null, null, 2)),
                  )
                  .catch((e) => setError(String(e)));
              }}
            >
              복구 사본 파일로 보관
            </Button>
            <Button
              onClick={() => {
                try {
                  download('벡터 미적분 저장 원문.json', localStorage.getItem(key) ?? '');
                } catch (e) {
                  setError(String(e));
                }
              }}
            >
              저장 원문 파일로 보관
            </Button>
          </div>
        </>
      )}
      <p role="status">{status || '관찰 선택·입력은 계정/공간별로 구별하여 이 기기에 보관한다.'}</p>
      {sourceShelf ? (
        catalog
      ) : (
        <details>
          <summary>전체 개념 목록 · 현재 {module.title}</summary>
          {catalog}
        </details>
      )}
      {!sourceShelf && (
        <div className="vector-actions">
          <Button
            onClick={() => {
              const caller = returnVectorCaller(key);
              navigate(caller?.route ?? '/materials/vector-calculus');
            }}
          >
            {vectorCaller(key) ? '읽던 자료 관찰로 돌아가기' : '벡터 미적분 자료 목록'}
          </Button>
        </div>
      )}
      {!sourceShelf && !full && observation()}
      <Modal
        open={small && !full}
        title={`${module.title} · 자료 곁의 관찰`}
        onClose={() => {
          setSmall(false);
          rememberReading(false, false);
          // Reload has no live modal opener. Return focus to the real current catalogue item.
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              document
                .querySelector<HTMLElement>(`[data-vector-module="${module.id}"]`)
                ?.focus({ preventScroll: true });
            }),
          );
        }}
        className="vector-full math-explorer"
      >
        <div className="vector-calculus">{observation()}</div>
      </Modal>
      <Modal
        open={full}
        title={`${module.title} · 전체 관찰`}
        onClose={() => {
          setFull(false);
          rememberReading(small, false, readPosition.current.scroll);
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              const target = readPosition.current.element?.isConnected
                ? readPosition.current.element
                : document.querySelector<HTMLElement>('[data-vector-maximize]');
              const body = target?.closest('.ui-modal');
              if (body) body.scrollTop = readPosition.current.scroll;
              else window.scrollTo({ top: readPosition.current.scroll });
              target?.focus({ preventScroll: true });
            }),
          );
        }}
        className="vector-full math-explorer"
      >
        <div className="vector-calculus">{observation(true)}</div>
      </Modal>
      <Modal open={source} title="원문 위치와 파일 연결" onClose={() => setSource(false)}>
        <div className="vector-reference" data-observation-region="reference">
          <p>Michael Corral · Vector Calculus</p>
          <p>
            원문 안정 ID: vector-calculus:{module.id}. 교재 절 {module.sections.join(', ')} · 책에
            인쇄된 쪽 {module.pages} · PDF 물리 페이지 {module.pdf}.
          </p>
          <p>
            PDF는 8개의 긴 물리 페이지이다. 책 쪽수와 PDF 페이지를 구별한다. 원문 PDF를 아래에서
            직접 연결하면 현재 위치의 물리 페이지를 읽을 수 있다. 파일은 기기 안에서 열며 업로드하지
            않는다. 직접 연결한 파일은 이 기기에 보관한다. 확인한 SHA-256으로 판본을 대조하고,
            재접속하면 같은 기기 보관 파일을 다시 읽는다.
          </p>
          <Suspense fallback={<p>원문 읽기를 여는 중이다.</p>}>
            <SourceReader
              key={module.id}
              data={data}
              moduleId={module.id}
              onObservation={(id) => {
                setSource(false);
                choose(id);
              }}
            />
          </Suspense>
        </div>
      </Modal>
    </section>
  );
}
