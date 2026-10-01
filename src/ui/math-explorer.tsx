import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
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
import './math-explorer.css';
import type { MathZoomRef } from './math-view-controls';

const Plot = lazy(() =>
  import('./math-explorer-plot').then((module) => ({ default: module.MathExplorerPlot })),
);
const GeoGebra = lazy(() =>
  import('./math-geogebra').then((module) => ({ default: module.MathGeoGebra })),
);
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
function MathText({ tex }: { tex: string }) {
  const host = useRef<HTMLDivElement>(null);
  // The equation contributes to page height. Render before route restoration
  // and browser scroll anchoring, rather than inserting it after first paint.
  useLayoutEffect(() => {
    if (host.current)
      katex.render(tex, host.current, {
        displayMode: true,
        throwOnError: false,
        trust: false,
        maxExpand: 1000,
      });
  }, [tex]);
  return <div className="math-equation" ref={host} role="region" aria-label="수식 · 가로로 이동해 전체 보기" tabIndex={0} />;
}
const presets: Record<string, MathScene> = {
  helix: DEFAULT_SCENE,
  wave: {
    ...DEFAULT_SCENE,
    mode: 'function',
    expressions: ['a*sin(b*x)', '0', '0'],
    min: '-2*pi',
    max: '2*pi',
    position: 0.6,
    a: 1,
    b: 1,
  },
  polynomial: {
    ...DEFAULT_SCENE,
    mode: 'function',
    expressions: ['x^3-a*x+b', '0', '0'],
    min: '-3',
    max: '3',
    a: 2,
    b: 0,
  },
  circle: { ...DEFAULT_SCENE, expressions: ['a*cos(t)', 'a*sin(t)', '0'], max: '2*pi', b: 0 },
};
export function MathExplorer({
  data,
  repository,
  onSaved,
}: {
  data: AppState;
  repository: StudyRepository;
  onSaved: (data: AppState) => void;
}) {
  const key = mathDraftKey(data);
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
  const captureScene = () => {
    const snapshot = captureRef.current?.();
    if (snapshot) rememberView(snapshot);
    return currentScene.current;
  };
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
      <p className="muted math-intro">
        {scene.mode === 'curve'
          ? 't를 움직여 곡선 위의 점과 세 방향을 살펴보세요.'
          : 'x를 움직여 그래프 위의 점을 살펴보세요.'}
      </p>
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
      {result && (
        <div className="math-workspace">
          <div className="math-visual">
            <MathText tex={result.tex} />
            <Suspense fallback={<LoadingState message="그래프를 여는 중입니다." />}>
              {scene.renderer === 'plotly' ? (
                <Plot
                  scene={geometry}
                  result={result}
                  viewRevision={viewRevision}
                  zoomRef={zoomRef}
                  onZoomReady={setZoomReady}
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
            <div className="math-plot-footer">
              {scene.mode === 'curve' && scene.vectors ? (
                <div className="math-legend">
                  <span className="math-vector-T">T 접선</span>
                  <span className="math-vector-N">N 주법선</span>
                  <span className="math-vector-B">B 종법선</span>
                </div>
              ) : (
                <span className="muted">현재 점</span>
              )}
              <div className="math-view-actions">
                <Button
                  variant="quiet"
                  disabled={!zoomReady}
                  onClick={() => zoomRef.current?.(1.2)}
                >
                  ＋ 확대
                </Button>
                <Button
                  variant="quiet"
                  disabled={!zoomReady}
                  onClick={() => zoomRef.current?.(1 / 1.2)}
                >
                  − 축소
                </Button>
                <Button variant="quiet" onClick={() => setViewRevision((v) => v + 1)}>
                  보기 초기화
                </Button>
              </div>
            </div>
            <p className="muted math-help">
              {scene.mode === 'curve'
                ? '한 손가락으로 회전 · 두 손가락으로 확대·축소 · 화살표는 단위벡터를 같은 비율로 확대해 표시합니다.'
                : '한 손가락으로 이동 · 두 손가락으로 확대·축소 · 보기 초기화로 원래 범위로 돌아갑니다.'}
            </p>
          </div>
          <div className="math-controls">
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
                  min={Math.min(-5, scene[name])}
                  max={Math.max(5, scene[name])}
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
            <section className="math-values" aria-label="현재 좌표와 벡터 성분">
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
          </div>
        </div>
      )}
      <details className="math-editor">
        <summary>수식·구간 편집</summary>
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
            label="구간 시작"
            value={scene.min}
            onChange={(event) => change({ ...scene, min: event.target.value })}
          />
          <Input
            label="구간 끝"
            value={scene.max}
            onChange={(event) => change({ ...scene, max: event.target.value })}
          />
        </div>
      </details>
      <details className="math-definition">
        <summary>T·N·B는 어떻게 계산하나요?</summary>
        <MathText
          tex={String.raw`\mathbf T=\frac{\mathbf r'}{\|\mathbf r'\|},\quad \mathbf B=\frac{\mathbf r'\times\mathbf r''}{\|\mathbf r'\times\mathbf r''\|},\quad \mathbf N=\mathbf B\times\mathbf T`}
        />
        <p>
          입력한 수식을 미분해 현재 위치의 단위벡터를 계산합니다. 속도 또는 곡률이 0이면 해당 벡터를
          정의할 수 없습니다. 현재 좌표와 벡터 계산에는 math.js를 사용합니다. 그래프의 모양만으로
          아주 좁은 변화나 연속성을 확정할 수는 없습니다.
        </p>
      </details>
      <div className="math-notes">
        <Input
          label="제목 (선택)"
          value={scene.title}
          onChange={(event) => change({ ...scene, title: event.target.value })}
        />
        <Textarea
          label="관찰·메모 (선택)"
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
      </div>
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
    </section>
  );
}
