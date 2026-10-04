import { ChemistryLauncher } from './chemistry-launcher';
import { chemistryViewKey } from '../data/chemistry-observation';
import { Activity, lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { MathFormula as MathText } from './math-formula';
import { MathComparison } from './math-comparison';
import { MathGraphFullscreen, MathGraphHelp } from './math-graph-fullscreen';
import { Button, Checkbox, ErrorState, Input, LoadingState, Select, Textarea } from './index';
import type { AppState } from '../domain/model';
import type { StudyRepository } from '../data/repository';
import {
  DEFAULT_SCENE,
  MATH_MEMO_PREFIX,
  buildScene,
  readScene,
  sceneBody,
  expression,
  type MathScene,
  type Vec3,
} from '../domain/math-explorer';
import { mathDraftKey, readMathDraft, writeMathDraft } from '../data/math-explorer-draft';
import {
  defaultReasoningView,
  readReasoningView,
  reasoningViewKey,
  writeReasoningView,
  type ReasoningView,
} from '../data/integral-reasoning-view';
import './math-explorer.css';
import './math-observatory.css';
import type { MathZoomRef } from './math-view-controls';
import { mathPlotZoomStep } from './math-plot-touch';
import { isTemplateView, type TemplateView } from '../domain/math-view';

const Plot = lazy(() =>
  import('./math-explorer-plot').then((module) => ({ default: module.MathExplorerPlot })),
);
const GeoGebra = lazy(() =>
  import('./math-geogebra').then((module) => ({ default: module.MathGeoGebra })),
);
const IntegralReasoning = lazy(() =>
  import('./integral-reasoning').then((module) => ({ default: module.IntegralReasoning })),
);
const PhysicsObservations = lazy(() => import('./physics-observations').then(module => ({ default: module.PhysicsObservations })));
const ConceptInteractives = lazy(() =>
  import('./concept-interactives').then((module) => ({ default: module.ConceptInteractives })),
);
const MathTemplates = lazy(() =>
  import('./math-templates').then((module) => ({ default: module.MathTemplates })),
);
const RileyObservatory = lazy(() =>
  import('./riley-observatory').then((module) => ({ default: module.RileyObservatory })),
);
const LinearAlgebraObservations = lazy(() => import('./linear-algebra-observations').then(module => ({ default: module.LinearAlgebraObservations })));
const VectorCalculus = lazy(() => import('./vector-calculus').then(module => ({ default: module.VectorCalculus })));
const format = (v: number) => {
  const text = v.toFixed(2);
  return text === '-0.00' ? '0.00' : text;
};
// Relative machine-rounding residue is hidden only in coordinate readouts.
const vec = (v: Vec3) => {
  const tolerance = Math.max(...v.map(Math.abs)) * Number.EPSILON * 16;
  return `(${v.map((component) => format(Math.abs(component) < tolerance ? 0 : component)).join(', ')})`;
};
function MathSlider({
  label,
  symbol,
  value,
  min,
  max,
  onChange,
  resetSignal = 0,
}: {
  label: string;
  symbol: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  resetSignal?: number;
}) {
  const [text, setText] = useState(format(value));
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  // biome-ignore lint/correctness/useExhaustiveDependencies: resetSignal explicitly discards pending input.
  useEffect(() => {
    setText(format(value));
    setDirty(false);
    setError('');
  }, [value, resetSignal]);
  const commit = () => {
    if (!dirty) return;
    try {
      const next = expression(text).value({});
      if (next === null || next < min || next > max) throw Error('range');
      onChange(next);
      setText(format(next));
      setDirty(false);
      setError('');
    } catch {
      setError(`${format(min)}부터 ${format(max)} 사이의 값으로 입력해 주세요.`);
    }
  };
  return (
    <div className="math-slider">
      <div className="math-slider-heading">
        <label htmlFor={`math-range-${symbol}`}>{label}</label>
        <Input
          label={`${symbol} 값`}
          value={text}
          inputMode="decimal"
          error={error || undefined}
          onChange={(event) => {
            setText(event.target.value);
            setDirty(true);
            setError('');
          }}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commit();
            }
            if (event.key === 'Escape') {
              setText(format(value));
              setDirty(false);
              setError('');
            }
          }}
        />
      </div>
      <input
        id={`math-range-${symbol}`}
        aria-label={label}
        aria-valuetext={`${symbol} = ${format(value)}`}
        type="range"
        min={min}
        max={max}
        step="any"
        value={value}
        onChange={(event) => {
          setDirty(false);
          setError('');
          setText(format(Number(event.target.value)));
          onChange(Number(event.target.value));
        }}
      />
      <div className="math-slider-limits" aria-hidden="true">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}
const presets: Record<string, MathScene> = {
  helix: DEFAULT_SCENE,
  wave: {
    ...DEFAULT_SCENE,
    mode: 'function',
    expressions: ['a*sin(b*x)', '0', '0'],
    min: '-4*pi',
    max: '4*pi',
    position: 0.55,
    a: 1,
    b: 1,
  },
  polynomial: {
    ...DEFAULT_SCENE,
    mode: 'function',
    expressions: ['x^3-a*x+b', '0', '0'],
    min: '-6',
    max: '6',
    position: 0.375,
    a: 2,
    b: 0,
  },
  circle: {
    ...DEFAULT_SCENE,
    expressions: ['a*cos(t)', 'a*sin(t)', '0'],
    max: '4*pi',
    position: 0.125,
    b: 0,
  },
};
export function MathExplorer({
  data,
  repository,
  onSaved,
  active = true,
}: {
  data: AppState;
  repository: StudyRepository;
  onSaved: (data: AppState) => void;
  active?: boolean;
}) {
  const key = mathDraftKey(data);
  const [chemistryOpen, setChemistryOpen] = useState(() => {
    try { return sessionStorage.getItem(chemistryViewKey(data) + ':entry') === 'east'; }
    catch { return false; }
  });
  const [rileyOpen, setRileyOpen] = useState(() => new URLSearchParams(window.location.search).get('math') === 'riley');
  const readingKey = reasoningViewKey(data);
  const [readingInitial] = useState(() => {
    try {
      const view = readReasoningView(readingKey);
      if (new URLSearchParams(window.location.search).get('math') === 'series')
        view.active = 'series';
      if (new URLSearchParams(window.location.search).get('math') === 'physics') view.active = 'physics';
      return { view, error: '', blocked: false };
    } catch {
      return {
        view: defaultReasoningView(),
        blocked: true,
        error:
          '읽던 위치를 불러오지 못했습니다. 기존 저장값은 유지했습니다. 현재 흐름은 파일로 보관할 수 있습니다.',
      };
    }
  });
  const [readingView, setReadingView] = useState(readingInitial.view);
  const [readingError, setReadingError] = useState(readingInitial.error);
  const readingBlocked = useRef(readingInitial.blocked);
  const currentReading = useRef(readingView);
  currentReading.current = readingView;
  const [graphVisited, setGraphVisited] = useState(!rileyOpen && readingInitial.view.active === 'graph');
  const rememberReading = (next: ReasoningView) => {
    currentReading.current = next;
    setReadingView(next);
    if (readingBlocked.current) return;
    try {
      writeReasoningView(readingKey, next);
      setReadingError('');
    } catch {
      setReadingError(
        '읽던 위치를 이 기기에 보관하지 못했습니다. 현재 흐름은 남아 있습니다. 다시 보관하거나 파일로 보관해 주세요.',
      );
    }
  };
  const [initial] = useState(() => {
    try {
      return {
        scene: readMathDraft(key) ?? structuredClone(DEFAULT_SCENE),
        error: '',
        blocked: false,
      };
    } catch {
      return {
        scene: structuredClone(DEFAULT_SCENE),
        error:
          '이 기기의 수식 초안을 읽지 못했습니다. 기존 원문은 유지했습니다. 새 입력은 파일로 보관할 수 있습니다.',
        blocked: true,
      };
    }
  });
  const [scene, setScene] = useState(initial.scene);
  const [error, setError] = useState(initial.error);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const pendingSave = useRef<{ body: string; id: string; opId: string; at: string } | null>(null);
  const currentScene = useRef(scene);
  currentScene.current = scene;
  const captureRef = useRef<(() => MathScene['geogebra']) | null>(null);
  const zoomRef = useRef<MathZoomRef['current']>(null);
  const [zoomReady, setZoomReady] = useState(false);
  const [preset, setPreset] = useState('helix');
  const [viewRevision, setViewRevision] = useState(0);
  const [controlRevision, setControlRevision] = useState(0);
  const [restoreRevision, setRestoreRevision] = useState(0);
  const geometry = useMemo(
    () => ({
      ...DEFAULT_SCENE,
      mode: scene.mode,
      expressions: scene.expressions,
      min: scene.min,
      max: scene.max,
      position: scene.position,
      a: scene.a,
      b: scene.b,
      vectors: scene.vectors,
    }),
    [
      scene.mode,
      scene.expressions,
      scene.min,
      scene.max,
      scene.position,
      scene.a,
      scene.b,
      scene.vectors,
    ],
  );
  const computed = useMemo(() => {
    try {
      return { result: buildScene(geometry), error: '' };
    } catch (e) {
      return { result: null, error: e instanceof Error ? e.message : '수식을 확인해 주세요.' };
    }
  }, [geometry]);
  const change = (next: MathScene) => {
    currentScene.current = next;
    setScene(next);
    setStatus('');
    if (initial.blocked) return;
    try {
      writeMathDraft(key, next);
      setError('');
    } catch {
      setError(
        '초안을 이 기기에 보관하지 못했습니다. 최신 입력은 현재 창에 남아 있습니다. 파일로 보관하거나 저장을 다시 시도해 주세요.',
      );
    }
  };
  const rememberView = (snapshot: NonNullable<MathScene['geogebra']>) => {
    const next = { ...currentScene.current, geogebra: snapshot };
    currentScene.current = next;
    setScene(next);
    if (!initial.blocked) {
      try {
        writeMathDraft(key, next);
      } catch {
        setError(
          '보기 설정을 이 기기에 보관하지 못했습니다. 현재 수식과 메모는 파일로 보관할 수 있습니다.',
        );
      }
    }
  };
  const rememberPlotView = (view: TemplateView) => {
    if (!isTemplateView(view)) return;
    if (JSON.stringify(currentScene.current.view) === JSON.stringify(view)) return;
    const next = { ...currentScene.current, view };
    currentScene.current = next;
    // geometry/result keep their references: a camera event never recompiles the formula.
    setScene(next);
    if (!initial.blocked) {
      try {
        writeMathDraft(key, next);
      } catch {
        setError(
          '보기 설정을 이 기기에 보관하지 못했습니다. 현재 수식과 메모는 파일로 보관할 수 있습니다.',
        );
      }
    }
  };
  const captureScene = () => {
    const snapshot = captureRef.current?.();
    if (snapshot) rememberView(snapshot);
    return currentScene.current;
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: Upgrade only the initial legacy default after its camera has been restored; later user-edited ranges stay intact.
  useEffect(() => {
    if (!zoomReady || currentScene.current.sliderRangeVersion === 2) return;
    const current = currentScene.current;
    const legacyHelix =
      current.mode === 'curve' &&
      current.min === '0' &&
      current.max === '4*pi' &&
      current.expressions.every((value, index) => value === DEFAULT_SCENE.expressions[index]);
    change({
      ...current,
      sliderRangeVersion: 2,
      ...(legacyHelix ? { max: '8*pi', position: current.position / 2 } : {}),
    });
  }, [zoomReady]);
  const saved = (data.memos ?? [])
    .filter((memo) => memo.id.startsWith(MATH_MEMO_PREFIX) && !memo.deletedAt)
    .slice()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const canSave = data.namespace === 'demo' || repository.getCapabilities?.().includes('saveMemo');
  const save = async () => {
    if (saving) return;
    setSaving(true);
    setStatus('');
    try {
      if (!canSave)
        throw Error(
          '수식을 저장할 수 없습니다. 다시 접속한 뒤 저장해 주세요. 입력은 유지했습니다.',
        );
      const body = sceneBody(captureScene());
      if (!pendingSave.current || pendingSave.current.body !== body)
        pendingSave.current = {
          body,
          id: `${MATH_MEMO_PREFIX}${crypto.randomUUID()}`,
          opId: crypto.randomUUID(),
          at: new Date().toISOString(),
        };
      const operation = pendingSave.current;
      const next = repository.execute({
        type: 'saveMemo',
        ...operation,
        ownerId: null,
        expectedVersion: 0,
        strokes: [],
        userId: data.userId,
        namespace: data.namespace,
      });
      onSaved(next);
      setStatus('이 기기에 저장했습니다.');
      if (repository.flush) {
        await repository.flush();
        setStatus('서버에 저장했습니다.');
      }
      if (sceneBody(currentScene.current) !== operation.body)
        setStatus(
          '저장을 누른 시점의 수식과 메모를 보관했습니다. 이후 바꾼 내용은 다시 저장해 주세요.',
        );
      pendingSave.current = null;
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장하지 못했습니다. 입력은 유지했습니다.');
    } finally {
      setSaving(false);
    }
  };
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([sceneBody(captureScene())], { type: 'text/plain;charset=utf-8' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = '수식 탐색.md';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const result = computed.result;
  return (
    <section className="math-explorer" aria-label="수식 탐색">
      <ChemistryLauncher data={data} repository={repository} onSaved={onSaved} place="east" onOpenChange={setChemistryOpen} />
      <div className="math-observatory-heading">
        <span className="math-observatory-mark" aria-hidden="true" />
        <span>관측 도구</span>
        <span className="math-observatory-caption">수식 · 좌표 · 변화</span>
      </div>
      <Button aria-pressed={rileyOpen} onClick={() => { if (!rileyOpen && graphVisited) captureScene(); if (rileyOpen && readingView.active === 'graph') setGraphVisited(true); setRileyOpen(!rileyOpen); }}>
        {rileyOpen ? '수식 도구로 돌아가기' : '수학교재 관찰 열기'}
      </Button>
      {rileyOpen && <Suspense fallback={<LoadingState message="교재 관찰을 여는 중입니다." />}><RileyObservatory key={key} data={data} repository={repository} onSaved={onSaved} /></Suspense>}
      <div hidden={rileyOpen}>
      <Select
        label="탐색할 내용"
        value={readingView.active}
        onChange={(event) => {
          const active = event.target.value as ReasoningView['active'];
          if (active !== 'graph' && graphVisited) captureScene();
          if (active === 'graph') setGraphVisited(true);
          rememberReading({ ...currentReading.current, active });
        }}
      >
        <option value="graph">함수와 공간곡선</option>
        <option value="templates">모든 과목 · 수식 유형별 탐색</option>
        <option value="series">급수의 수렴 판단</option>
        <option value="concepts">개념 탐구실</option>
        <option value="physics">물리 교재 · 읽기와 관찰</option>
        <option value="vector-calculus">벡터 미적분 · 자료와 관찰</option>
        <option value="linear">선형대수 · 교재 관찰</option>
      </Select>
      {readingError && (
        <div>
          <ErrorState message={readingError} />
          <Button
            onClick={() => {
              if (!readingBlocked.current) return rememberReading(currentReading.current);
              try {
                const restored = readReasoningView(readingKey);
                readingBlocked.current = false;
                setReadingView(restored);
                setReadingError('');
                if (restored.active === 'graph') setGraphVisited(true);
              } catch {
                setReadingError(
                  '읽던 위치를 아직 불러올 수 없습니다. 기존 저장값은 유지했습니다. 현재 흐름을 파일로 보관해 주세요.',
                );
              }
            }}
          >
            {readingBlocked.current ? '읽던 위치 다시 불러오기' : '읽던 위치 다시 보관'}
          </Button>
          <Button
            onClick={() => {
              const url = URL.createObjectURL(
                new Blob([JSON.stringify(currentReading.current, null, 2)], {
                  type: 'application/json',
                }),
              );
              const link = document.createElement('a');
              link.href = url;
              link.download = '급수의 수렴 판단 · 읽던 위치.json';
              link.click();
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            }}
          >
            현재 흐름 파일로 보관
          </Button>
        </div>
      )}
      {readingView.active === 'physics' && (<Suspense fallback={<LoadingState message="물리 교재 관찰을 여는 중입니다." />}><PhysicsObservations key={key} data={data} /></Suspense>)}
      {readingView.active === 'series' && (
        <Suspense fallback={<LoadingState message="생각의 흐름을 여는 중입니다." />}>
          <IntegralReasoning view={readingView} onChange={rememberReading} />
        </Suspense>
      )}
      {readingView.active === 'templates' && (
        <Suspense fallback={<LoadingState message="수식과 내용을 여는 중입니다." />}>
          <MathTemplates key={key} data={data} repository={repository} onSaved={onSaved} />
        </Suspense>
      )}
      {readingView.active === 'linear' && <Suspense fallback={<LoadingState message="선형대수 관찰을 여는 중입니다." />}><LinearAlgebraObservations data={data} repository={repository} onSaved={onSaved}/></Suspense>}
      {readingView.active === 'concepts' && (
        <Suspense fallback={<LoadingState message="개념 탐구실을 여는 중입니다." />}>
          <ConceptInteractives key={key} data={data} />
        </Suspense>
      )}
      {readingView.active === 'vector-calculus' && <Suspense fallback={<LoadingState message="벡터 미적분 자료와 관찰을 여는 중입니다." />}><VectorCalculus key={key} data={data} /></Suspense>}
      {graphVisited && (
        <div hidden={readingView.active !== 'graph'}>
          <section data-observation-region="question" aria-label="살펴볼 질문과 수식">
            <p className="muted math-intro">
              {scene.mode === 'curve'
                ? 't를 움직여 곡선 위의 점과 세 방향을 살펴보세요.'
                : 'x를 움직여 그래프 위의 점을 살펴보세요.'}
            </p>
            {result && <MathText tex={result.tex} />}
          </section>
          {error && <ErrorState message={error} />}
          {computed.error && <ErrorState message={computed.error} />}
          <Select
            label="그래프 도구"
            value={scene.renderer ?? 'geogebra'}
            onChange={(event) => {
              const latest = captureScene();
              change({ ...latest, renderer: event.target.value as MathScene['renderer'] });
            }}
          >
            <option value="geogebra">GeoGebra</option>
            <option value="plotly">Plotly</option>
          </Select>
          <MathComparison key={key} ownerKey={key} scene={geometry} result={result} />
          {result && (
            <MathGraphFullscreen active={active && !rileyOpen && readingView.active === 'graph'}>
            <div className="math-workspace">
              <section
                className="math-visual"
                data-observation-region="visual"
                aria-label="수식의 그래프와 시야 조절"
              >
                <div className="math-plot-footer">
                  <div className="math-legend">
                    <span className="math-curve">
                      {scene.mode === 'curve' ? '곡선' : '그래프'} ·{' '}
                      {scene.mode === 'curve' ? 't' : 'x'} {format(result.min)}–{format(result.max)}
                    </span>
                    {scene.mode === 'curve' && scene.vectors ? (
                      <>
                        <span className="math-vector-T">
                          <MathText tex={'\\mathbf{T}'} inline /> 접선
                        </span>
                        <span className="math-vector-N">
                          <MathText tex={'\\mathbf{N}'} inline /> 주법선
                        </span>
                        <span className="math-vector-B">
                          <MathText tex={'\\mathbf{B}'} inline /> 종법선
                        </span>
                      </>
                    ) : (
                      <span className="math-point">현재 점</span>
                    )}
                  </div>
                  <div className="math-view-actions">
                    <Button
                      variant="quiet"
                      disabled={!zoomReady}
                      onClick={() =>
                        zoomRef.current?.(scene.renderer === 'plotly' ? mathPlotZoomStep : 1.2)
                      }
                    >
                      ＋ 확대
                    </Button>
                    <Button
                      variant="quiet"
                      disabled={!zoomReady}
                      onClick={() =>
                        zoomRef.current?.(
                          1 / (scene.renderer === 'plotly' ? mathPlotZoomStep : 1.2),
                        )
                      }
                    >
                      − 축소
                    </Button>
                    <Button
                      variant="quiet"
                      title="확대·이동·회전한 시야만 처음으로 돌아갑니다. 수식·조절값·메모는 유지합니다."
                      onClick={() => setViewRevision((v) => v + 1)}
                    >
                      보기 초기화
                    </Button>
                  </div>
                </div>
                <Activity mode={active && !chemistryOpen ? 'visible' : 'hidden'}>
                  <Suspense fallback={<LoadingState message="그래프를 여는 중입니다." />}>
                    {scene.renderer === 'plotly' ? (
                      <Plot
                        key={restoreRevision}
                        scene={geometry}
                        result={result}
                        viewRevision={viewRevision}
                        zoomRef={zoomRef}
                        onZoomReady={setZoomReady}
                        initialView={scene.view}
                        onView={rememberPlotView}
                      />
                    ) : (
                      <GeoGebra
                        scene={scene}
                        result={result}
                        viewRevision={viewRevision}
                        restoreRevision={restoreRevision}
                        captureRef={captureRef}
                        zoomRef={zoomRef}
                        onZoomReady={setZoomReady}
                        onSnapshot={rememberView}
                        onFallback={() => change({ ...currentScene.current, renderer: 'plotly' })}
                      />
                    )}
                  </Suspense>
                </Activity>
                <MathGraphHelp><p className="muted math-help">
                  {scene.mode === 'curve'
                    ? `${scene.renderer === 'geogebra' ? '두 손가락을 함께 움직여 회전' : '한 손가락으로 회전'} · 두 손가락을 벌리거나 오므려 확대·축소 · 화살표는 방향을 나타내며, 확대해도 너무 길어지지 않게 표시합니다.`
                    : '한 손가락으로 이동 · 두 손가락으로 확대·축소 · 보기 초기화로 원래 범위로 돌아갑니다.'}
                </p></MathGraphHelp>
              </section>
              <section
                className="math-controls"
                data-observation-region="controls"
                aria-label="위치와 변수 조절"
              >
                <div className="math-sliders">
                  <MathSlider
                    label={scene.mode === 'curve' ? '곡선 위 위치 t' : '그래프 위 위치 x'}
                    symbol={scene.mode === 'curve' ? 't' : 'x'}
                    resetSignal={controlRevision}
                    value={result.at}
                    min={result.min}
                    max={result.max}
                    onChange={(value) =>
                      change({
                        ...scene,
                        position: Math.max(
                          0,
                          Math.min(1, (value - result.min) / (result.max - result.min)),
                        ),
                      })
                    }
                  />
                  <Button
                    variant="quiet"
                    onClick={() => {
                      change({ ...scene, position: 0 });
                      setControlRevision((v) => v + 1);
                    }}
                  >
                    구간 시작으로
                  </Button>
                  {(['a', 'b'] as const).map((name) => (
                    <MathSlider
                      key={name}
                      label={`변수 ${name}`}
                      symbol={name}
                      value={scene[name]}
                      min={Math.min(-10, scene[name])}
                      max={Math.max(10, scene[name])}
                      onChange={(value) => change({ ...scene, [name]: value })}
                    />
                  ))}
                </div>
                {scene.mode === 'curve' && (
                  <Checkbox
                    label="T·N·B 벡터 보기"
                    checked={scene.vectors}
                    onChange={(event) => change({ ...scene, vectors: event.target.checked })}
                  />
                )}
                {result.missing > 0 && (
                  <p role="status">
                    구간에서 값이 정의되지 않는 표본 {result.missing}개는 그리지 않았습니다.
                  </p>
                )}
                {result.breakBefore.some(Boolean) && (
                  <p role="status">
                    값이 급격히 달라지는 구간은 선으로 잇지 않았습니다. 수식의 정의역을 함께 확인해
                    주세요.
                  </p>
                )}
                {result.frameError && <p role="status">{result.frameError}</p>}
                {result.vectors?.reason && <p role="status">{result.vectors.reason}</p>}
                <section
                  className="math-values"
                  data-observation-region="readout"
                  aria-label="현재 좌표와 벡터 성분"
                >
                  <p>
                    <strong>현재 점</strong>{' '}
                    {result.point ? vec(result.point) : '이 위치의 값은 정의되지 않습니다.'}
                  </p>
                  {result.vectors && (
                    <details>
                      <summary>벡터 성분</summary>
                      {(['T', 'N', 'B'] as const).map(
                        (name) =>
                          result.vectors?.[name] && (
                            <p key={name}>
                              <strong className={`math-vector-${name}`}>{name}</strong>{' '}
                              {vec(result.vectors[name])}
                            </p>
                          ),
                      )}
                    </details>
                  )}
                  {result.vectors?.curvature !== undefined && (
                    <p>
                      <strong>곡률 κ</strong> {format(result.vectors.curvature)}
                    </p>
                  )}
                </section>
              </section>
            </div>
            </MathGraphFullscreen>
          )}
          <details className="math-editor">
            <summary>수식·슬라이더 범위 편집</summary>
            <div className="math-start">
              <Select
                label="그래프 종류"
                value={scene.mode}
                onChange={(event) =>
                  change({ ...scene, mode: event.target.value as MathScene['mode'] })
                }
              >
                <option value="function">함수 y=f(x)</option>
                <option value="curve">공간 곡선 r(t)</option>
              </Select>
              <Select
                label="수식 예시"
                value={preset}
                onChange={(event) => setPreset(event.target.value)}
              >
                <option value="helix">나선과 T·N·B</option>
                <option value="wave">사인파</option>
                <option value="polynomial">삼차함수</option>
                <option value="circle">원</option>
              </Select>
              <Button
                onClick={() =>
                  change({
                    ...structuredClone(presets[preset]),
                    title: scene.title,
                    notes: scene.notes,
                    renderer: scene.renderer,
                  })
                }
              >
                예시 적용
              </Button>
            </div>
            <div className="math-inputs">
              {(scene.mode === 'function' ? [0] : [0, 1, 2]).map((index) => (
                <Input
                  key={index}
                  label={scene.mode === 'function' ? 'y(x)' : `${['x', 'y', 'z'][index]}(t)`}
                  value={scene.expressions[index]}
                  spellCheck={false}
                  onChange={(event) => {
                    const expressions = [...scene.expressions] as MathScene['expressions'];
                    expressions[index] = event.target.value;
                    change({ ...scene, expressions });
                  }}
                />
              ))}
            </div>
            <p className="muted math-help">
              입력 예: a*sin(b*x), exp(-x^2), sqrt(x), a*cos(t). 곱셈은 *, 거듭제곱은 ^로 적습니다.
              삼각함수는 라디안 기준입니다.
            </p>
            <div className="math-interval">
              <Input
                label="슬라이더 시작"
                value={scene.min}
                onChange={(event) => change({ ...scene, min: event.target.value })}
              />
              <Input
                label="슬라이더 끝"
                value={scene.max}
                onChange={(event) => change({ ...scene, max: event.target.value })}
              />
            </div>
          </details>
          <details className="math-definition" data-observation-region="reasoning">
            <summary>T·N·B는 어떻게 계산하나요?</summary>
            <MathText
              tex={String.raw`\mathbf T=\frac{\mathbf r'}{\|\mathbf r'\|},\quad \mathbf B=\frac{\mathbf r'\times\mathbf r''}{\|\mathbf r'\times\mathbf r''\|},\quad \mathbf N=\mathbf B\times\mathbf T`}
            />
            <p>
              입력한 수식을 미분해 현재 위치의 단위벡터를 계산합니다. 속도 또는 곡률이 0이면 해당
              벡터를 정의할 수 없습니다. 현재 좌표와 벡터 계산에는 math.js를 사용합니다. 그래프의
              모양만으로 아주 좁은 변화나 연속성을 확정할 수는 없습니다.
            </p>
          </details>
          <section
            className="math-notes"
            data-observation-region="reference"
            aria-label="관찰 원문과 메모 보관"
          >
            <Input
              label="제목 (선택)"
              value={scene.title}
              onChange={(event) => change({ ...scene, title: event.target.value })}
            />
            <Textarea
              label="관찰·메모 (선택)"
              className="paper-memo"
              rows={3}
              value={scene.notes}
              onChange={(event) => change({ ...scene, notes: event.target.value })}
            />
            <div className="actions">
              <Button variant="primary" busy={saving} onClick={() => void save()}>
                수식과 메모 저장
              </Button>
              <Button onClick={download}>파일로 보관</Button>
            </div>
            <p role="status">{status}</p>
          </section>
          {saved.length > 0 && (
            <div className="math-saved">
              <h3>저장한 탐색</h3>
              <ul>
                {saved.map((memo) => (
                  <li key={memo.id}>
                    <Button
                      variant="quiet"
                      onClick={() => {
                        const entry = readScene(memo.body);
                        if (entry) {
                          change(entry);
                          setRestoreRevision((value) => value + 1);
                          setControlRevision((value) => value + 1);
                        } else
                          setError(
                            '저장된 수식 형식을 읽지 못했습니다. 메모에서 원문을 확인해 주세요.',
                          );
                      }}
                    >
                      {memo.body.split('\n')[0] || '수식 탐색'}
                    </Button>
                    <a href={`#/memos/${encodeURIComponent(memo.id)}`}>메모 원문</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      </div>
    </section>
  );
}
