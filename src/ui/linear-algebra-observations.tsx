import { lazy, Suspense, useCallback, useMemo, useRef, useState } from 'react';
import type { AppState } from '../domain/model';
import type { StudyRepository } from '../data/repository';
import { rescueWithoutOverwrite } from '../data/draft-safety';
import { encodeStoredText } from '../data/storage-codec';
const ConceptMap = lazy(() =>
  import('./linear-concept-map').then((m) => ({ default: m.LinearConceptMap })),
);
import correspondence from '../domain/linear-algebra-correspondence.json';
import { LINEAR_READING } from '../domain/linear-algebra-reading';
import { linearUnit } from '../domain/linear-algebra-units';
import { LINEAR_SPECS, LINEAR_FORMULAS } from '../domain/linear-algebra-specs';
import catalog from '../domain/linear-algebra-catalog.json';
import { observeLinear, parseMatrix, type LinearKind } from '../domain/linear-algebra';
import {
  newLinearReading,
  newLinearWorkspace,
  readLinearWorkspace,
  writeLinearWorkspace,
  linearViewKey,
  type LinearReading,
  type LinearWorkspace,
} from '../data/linear-algebra-view';
import {
  readReasoningView,
  writeReasoningView,
  reasoningViewKey,
} from '../data/integral-reasoning-view';
import { defaultTemplate } from '../domain/math-templates';
import { expression } from '../domain/math-explorer';
import { Button, ErrorState, Input, Select, Textarea, Modal, LoadingState } from './index';
import { MathFormula } from './math-formula';
import { navigate } from './navigation-context';
import { featureSurfaceAttributes } from './observatory-feature-identity';
import './linear-algebra-observations.css';
const SourceReader = lazy(() =>
  import('./linear-source-reader').then((m) => ({ default: m.LinearSourceReader })),
);
const Plot = lazy(() =>
  import('./math-template-plot').then((m) => ({ default: m.MathTemplatePlot })),
);
type Props = {
  data: AppState;
  repository: StudyRepository;
  onSaved: (next: AppState) => void;
  reading?: boolean;
};
const matrixKinds = [
  'elimination',
  'basis',
  'qr',
  'least-squares',
  'lu',
  'svd',
  'operations',
  'eigen',
  'quadratic',
  'power',
];
const implemented = new Set<LinearKind>(
  Object.keys(LINEAR_SPECS).filter((k) => k !== 'static') as LinearKind[],
);
function defaultReading(kind: LinearKind): LinearReading {
  const spec = LINEAR_SPECS[kind],
    r = newLinearReading();
  r.params = { t: spec.t?.value ?? 2, n: spec.n?.value ?? 4 };
  if (spec.matrix) r.matrix = r.matrixDraft = spec.matrix;
  return r;
}
export function LinearAlgebraObservations({ data, repository, onSaved, reading = false }: Props) {
  const key = linearViewKey(data);
  const [initial] = useState(() => {
    try {
      return { value: readLinearWorkspace(key), error: '', blocked: false };
    } catch (e) {
      return {
        value: newLinearWorkspace(),
        error: e instanceof Error ? e.message : '불러오기 실패',
        blocked: true,
      };
    }
  });
  const [mapOpen, setMapOpen] = useState(false);
  const [sourcePage, setSourcePage] = useState<number | null>(null);
  const [workspace, setWorkspace] = useState(initial.value),
    [error, setError] = useState(initial.error),
    [status, setStatus] = useState(''),
    [saveError, setSaveError] = useState(''),
    [expanded, setExpanded] = useState(false),
    [small, setSmall] = useState(false),
    [inputError, setInputError] = useState(''),
    [busy, setBusy] = useState(false);
  const current = useRef(workspace),
    blocked = useRef(initial.blocked),
    pending = useRef<{ id: string; opId: string; at: string; body: string } | null>(null);
  current.current = workspace;
  const concept = catalog.concepts.find((c) => c.id === workspace.selected) ?? catalog.concepts[10],
    kind = concept.kind as LinearKind;
  const spec = LINEAR_SPECS[kind];
  const readingNote = LINEAR_READING[concept.id];
  const unit = linearUnit(concept.id);
  const coverage = correspondence.concepts.find((x) => x.id === concept.id);

  const state = workspace.readings[concept.id] ?? defaultReading(kind);
  const update = useCallback(
    (next: LinearWorkspace) => {
      current.current = next;
      setWorkspace(next);
      setStatus('');
      if (blocked.current) {
        rescueWithoutOverwrite(key, encodeStoredText(JSON.stringify(next)));
        return;
      }
      try {
        writeLinearWorkspace(key, next);
        setError('');
      } catch (e) {
        setError(e instanceof Error ? e.message : '보관 실패 · 현재 입력은 이 창에 유지된다.');
      }
    },
    [key],
  );
  const change = (patch: Partial<LinearReading>) =>
    update({
      ...current.current,
      readings: {
        ...current.current.readings,
        [concept.id]: {
          ...(current.current.readings[concept.id] ?? defaultReading(kind)),
          ...patch,
        },
      },
    });
  const calculated = useMemo(() => {
    try {
      return {
        result: observeLinear(implemented.has(kind) ? kind : 'static', state.params, state.matrix),
        error: '',
      };
    } catch (e) {
      return { result: null, error: e instanceof Error ? e.message : '계산하지 못했다.' };
    }
  }, [kind, state.params, state.matrix]);
  const result = calculated.result;
  const invalidPending = (['t', 'n'] as const).some((symbol) => {
    const c = symbol === 't' ? spec.t : spec.n,
      raw = state.inputs[symbol];
    if (!c || raw === undefined) return false;
    try {
      const x = expression(raw).value({});
      return x === null || x < c.min || x > c.max || (symbol === 'n' && !Number.isInteger(x));
    } catch {
      return true;
    }
  });
  const plotItem = useMemo(
    () => ({
      ...defaultTemplate(spec.isSpatial ? 'matrix' : 'sequence'),
      id: `linear:${concept.id}`,
      title: concept.name,
      parameters: [],
      dataset: spec.axis
        ? { xLabel: spec.axis[0], yLabel: spec.axis[1], style: 'line' as const, points: [] }
        : undefined,
    }),
    [concept.id, concept.name, spec],
  );
  const continuousPlotItem = useMemo(
    () => ({
      ...defaultTemplate('sequence'),
      id: `linear:${concept.id}:continuous`,
      title: '연속 시간',
      dataset: { xLabel: '연속 시간 s', yLabel: 'x₁(s)', style: 'line' as const, points: [] },
    }),
    [concept.id],
  );
  const select = useCallback(
    (id: string) => {
      update({ ...current.current, selected: id });
      setInputError('');
    },
    [update],
  );
  const commitNumber = (symbol: string) => {
    const control = symbol === 't' ? spec.t : spec.n;
    if (!control) return;
    const text = state.inputs[symbol] ?? String(state.params[symbol]);
    try {
      const x = expression(text).value({});
      if (
        x === null ||
        x < control.min ||
        x > control.max ||
        (symbol === 'n' && !Number.isInteger(x))
      )
        throw Error();
      change({
        params: { ...state.params, [symbol]: x },
        inputs: { ...state.inputs, [symbol]: String(x) },
      });
      setInputError('');
    } catch {
      setInputError(
        `${control.label}는 ${control.min}부터 ${control.max} 사이${symbol === 'n' ? '의 정수' : '의 수치식'}이다. 입력을 유지했으며 실제 값은 바뀌지 않았다.`,
      );
    }
  };
  const exportState = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(current.current, null, 2)], { type: 'application/json' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = '선형대수 관찰 · 현재 입력.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const save = async () => {
    if (busy) return;
    setBusy(true);
    setStatus('');
    setSaveError('');
    const snapshot = current.current.readings[concept.id] ?? defaultReading(kind);
    const body = `선형대수 관찰 · ${concept.name}\n원자료: ${catalog.source.title}\n안정 ID: ${concept.id}\n질문: ${unit.question}\n이번 예제의 관계: ${unit.currentObservationQuestion}\n${JSON.stringify(snapshot)}\n\n${snapshot.memo}`;
    try {
      if (data.namespace !== 'demo' && !repository.getCapabilities?.().includes('saveMemo'))
        throw Error('지금은 메모 저장에 접근할 수 없다. 현재 초안은 유지된다.');
      if (!pending.current || pending.current.body !== body)
        pending.current = {
          id: `linear-observation:${crypto.randomUUID()}`,
          opId: crypto.randomUUID(),
          at: new Date().toISOString(),
          body,
        };
      const next = repository.execute({
        type: 'saveMemo',
        ...pending.current,
        ownerId: null,
        expectedVersion: 0,
        strokes: [],
        userId: data.userId,
        namespace: data.namespace,
      });
      onSaved(next);
      setStatus(
        data.namespace === 'demo'
          ? '이 기기에 관찰 사본과 메모를 저장했다.'
          : '기기 초안을 보관했으며 서버 저장을 확인하는 중이다.',
      );
      if (data.namespace !== 'demo') {
        if (!repository.flush) throw Error('서버 저장 확인 경로가 없다. 현재 초안은 유지된다.');
        await repository.flush();
        const receipt = repository.getStatus?.();
        if (!receipt || receipt.phase !== 'saved' || receipt.pending)
          throw Error(receipt?.message || '서버 저장을 확인하지 못했다. 초안은 유지했다.');
        setStatus('서버에 관찰 사본과 메모를 저장했다.');
      }
      pending.current = null;
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : '저장하지 못했다. 입력을 유지했다.');
      if (data.namespace !== 'demo')
        setStatus('서버 저장을 확인하지 못했다. 기기 초안과 입력을 유지했다.');
    } finally {
      setBusy(false);
    }
  };
  const source = (
    <details data-observation-region="reference">
      <summary>원자료와 적용 범위</summary>
      <p className="prose">
        {catalog.source.title} · {catalog.source.authors}. 이 관찰의 숫자 예제는 교재의 개념을
        설명하기 위해 구성한 별도 예제이다.
      </p>
      {concept.sections.map((id) => {
        const s = catalog.sections.find((x) => x.source_section === id);
        return s ? (
          <p key={id}>
            {id} · {s.source_title} · 인쇄 쪽 {s.printed_start} / PDF {s.pdf_start}{' '}
            <Button onClick={() => setSourcePage(s.pdf_start)}>원문 펼치기</Button>
          </p>
        ) : null;
      })}
      <p className="prose">
        {implemented.has(kind)
          ? '계산은 작은 실수 유한차원 예제에 한정한다. 일반 정리와 증명은 원문에서 확인한다.'
          : '이 항목은 원문 연결과 읽기 설명을 제공하며, 전용 관찰 계산은 아직 연결하지 않았다.'}
      </p>
    </details>
  );
  const observation = (full = false) => (
    <section className="linear-observation" {...featureSurfaceAttributes(expanded ? 'O14' : 'R09')}>
      <header data-observation-region="question">
        <p className="linear-context">선형대수 · {concept.name}</p>
        <h2>{unit.question}</h2>
        {unit.question !== unit.currentObservationQuestion && (
          <p className="prose">이번 예제에서 살펴볼 관계: {unit.currentObservationQuestion}</p>
        )}
        <p className="prose">{concept.role}</p>
        {LINEAR_FORMULAS[kind] && (
          <div
            className="linear-original-formula"
            role="region"
            aria-label="관찰식과 현재 조건"
            tabIndex={0}
          >
            <MathFormula tex={LINEAR_FORMULAS[kind]!} inline />
          </div>
        )}
        <p className="prose">{spec.conditions[0]}</p>
        {coverage && (
          <p className="linear-context">
            {coverage.classification === '부분 대응'
              ? '현재 관찰은 이 개념의 일부 관계를 보여준다.'
              : coverage.classification === '추가 구현 필요'
                ? '원문을 읽을 수 있으며 전용 조작은 준비되지 않았다.'
                : null}
          </p>
        )}
        <details>
          <summary>적용 조건과 관찰 범위</summary>
          {spec.conditions.slice(1).map((x) => (
            <p className="prose" key={x}>
              {x}
            </p>
          ))}
          {coverage?.limits.map((x) => (
            <p className="prose" key={x}>
              {x}
            </p>
          ))}
        </details>
        <details>
          <summary>초기값과 표현의 역할</summary>
          <p className="prose">{spec.initialReason}</p>
          {spec.representations.map((x) => (
            <p className="prose" key={x}>
              {x}
            </p>
          ))}
        </details>
      </header>
      {calculated.error && <ErrorState message={calculated.error} />}
      <div className={`linear-workbench${kind === 'static' ? ' linear-static-reading' : ''}`}>
        <section data-observation-region="visual" aria-label="중심 관찰">
          {result && (result.lines.length > 0 || result.surface) && (
            <>
              <Suspense fallback={<LoadingState message="관찰 그림을 여는 중이다." />}>
                <Plot
                  key={`${concept.id}:${full}`}
                  item={plotItem}
                  result={result}
                  initialView={state.view}
                  onView={(view) => {
                    if (!expanded || full) change({ view });
                  }}
                />
              </Suspense>
              <p className="prose">{result.lines.map((l) => l.name).join(' · ')}</p>
            </>
          )}
          {result && result.steps.length > 0 && (
            <div className="linear-step">
              <p>
                단계 {Math.min(state.step, result.steps.length - 1) + 1} / {result.steps.length}
              </p>
              <h3>{result.steps[Math.min(state.step, result.steps.length - 1)].operation}</h3>
              <MathFormula
                tex={matrixToTex(
                  result.steps[Math.min(state.step, result.steps.length - 1)].matrix,
                )}
              />
              <div className="actions">
                <Button disabled={state.step <= 0} onClick={() => change({ step: state.step - 1 })}>
                  이전 단계
                </Button>
                <Button
                  disabled={state.step >= result.steps.length - 1}
                  onClick={() => change({ step: state.step + 1 })}
                >
                  다음 단계
                </Button>
              </div>
            </div>
          )}
          {result?.secondaryPlot && (
            <>
              <h3>연속 시간에서 첫 번째 성분</h3>
              <Suspense fallback={<LoadingState />}>
                <Plot
                  item={continuousPlotItem}
                  result={result.secondaryPlot}
                  initialView={state.views?.continuous}
                  onView={(view) => {
                    if (!expanded || full) change({ views: { ...state.views, continuous: view } });
                  }}
                />
              </Suspense>
            </>
          )}
          {result?.tex.map((tex, i) => (
            <MathFormula key={i} tex={tex} />
          ))}
          {readingNote && (
            <>
              {readingNote.paragraphs.map((x) => (
                <p className="prose" key={x}>
                  {x}
                </p>
              ))}
              {readingNote.tex?.map((tex) => (
                <MathFormula key={tex} tex={tex} />
              ))}
            </>
          )}
          {!implemented.has(kind) && !readingNote && (
            <p className="prose">
              이 관계는 원문과 연결해 읽을 수 있다. 전용 관찰의 구현 상태는 전체 대응 목록에 따로
              표시한다.
            </p>
          )}
        </section>
        <aside hidden={kind === 'static'}>
          {implemented.has(kind) && (
            <section data-observation-region="controls">
              <h3>값과 조건 조절</h3>
              {matrixKinds.includes(kind) && (
                <>
                  <Textarea
                    label={
                      kind === 'elimination'
                        ? '확대행렬 [A | b] · 마지막 열이 b'
                        : '행렬 A · 행마다 줄바꿈'
                    }
                    value={state.matrixDraft}
                    onChange={(e) => change({ matrixDraft: e.target.value })}
                  />
                  <Button
                    onClick={() => {
                      try {
                        parseMatrix(state.matrixDraft);
                        change({ matrix: state.matrixDraft, step: 0 });
                        setInputError('');
                      } catch (e) {
                        setInputError(e instanceof Error ? e.message : '행렬 입력 오류');
                      }
                    }}
                  >
                    행렬 적용
                  </Button>
                </>
              )}
              {(['t', 'n'] as const).map((symbol) => {
                const control = symbol === 't' ? spec.t : spec.n;
                return control ? (
                  <div key={symbol}>
                    <Input
                      label={`${control.label} · 정확한 값`}
                      value={state.inputs[symbol] ?? String(state.params[symbol])}
                      onChange={(e) =>
                        change({ inputs: { ...state.inputs, [symbol]: e.target.value } })
                      }
                      onBlur={() => commitNumber(symbol)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitNumber(symbol);
                      }}
                    />
                    <label>
                      {control.label} · 탐색
                      <input
                        type="range"
                        aria-label={`${control.label} · 탐색`}
                        min={control.min}
                        max={control.max}
                        step={symbol === 'n' ? 1 : 'any'}
                        value={state.params[symbol]}
                        onChange={(e) => {
                          const x = Number(e.target.value);
                          change({
                            params: { ...state.params, [symbol]: x },
                            inputs: { ...state.inputs, [symbol]: String(x) },
                          });
                          setInputError('');
                        }}
                      />
                    </label>
                  </div>
                ) : null;
              })}
              {(inputError || invalidPending) && (
                <ErrorState
                  message={
                    inputError ||
                    '미확정 입력이 범위나 수치식 조건에 맞지 않는다. 입력 원문과 마지막 확정값을 유지했다.'
                  }
                />
              )}
            </section>
          )}
          {result && result.readouts.length > 0 && (
            <section data-observation-region="readout" aria-live="polite">
              <h3>현재값과 판단</h3>
              <dl>
                {result.readouts.map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
          <div className="actions">
            <Button onClick={() => setExpanded(true)} disabled={expanded}>
              크게 보기
            </Button>
            <Button
              onClick={() =>
                change({
                  params: defaultReading(kind).params,
                  inputs: {},
                  matrix: defaultReading(kind).matrix,
                  matrixDraft: defaultReading(kind).matrixDraft,
                  step: 0,
                })
              }
            >
              값·단계 처음으로
            </Button>
          </div>
        </aside>
      </div>
      <section data-observation-region="reasoning">
        <h3>관계의 근거와 한계</h3>
        {result?.explanation.map((x) => (
          <p className="prose" key={x}>
            {x}
          </p>
        ))}
        {spec.limitations.map((x) => (
          <p className="prose" key={x}>
            {x}
          </p>
        ))}
        {result?.notices.map((x) => (
          <p className="prose" key={x}>
            {x}
          </p>
        ))}
        <p className="prose">
          표시된 소수는 읽기용이다. 확정된 내부 숫자와 저장값은 표시 반올림으로 교체하지 않는다.
          관찰을 열거나 조절해도 공부 완료·정답·숙달 기록은 만들지 않는다.
        </p>
      </section>
      {source}
      <Textarea
        className="paper-memo"
        label="관찰 메모"
        value={state.memo}
        onChange={(e) => change({ memo: e.target.value })}
      />
      <p className="prose">
        값·미확정 입력·단계·시야·메모 초안은 이 기기의 현재 소유자·창별 보관 경로에 남는다.
        {data.namespace === 'demo'
          ? '아래 버튼은 이 기기에 메모 사본을 저장한다.'
          : '아래 버튼은 서버 메모 사본 저장을 요청하며 확인 결과를 안내한다.'}
      </p>
      <Button busy={busy} onClick={save}>
        관찰 사본과 메모 저장
      </Button>
    </section>
  );
  return (
    <section className="linear-algebra" aria-label="선형대수 교재와 관찰">
      {!reading && (
        <Button
          onClick={() => {
            navigate('/materials');
          }}
        >
          {' '}
          {workspace.returnToReader ? '원자료 읽기로 돌아가기' : '교재 목록 열기'}
        </Button>
      )}
      <header>
        <p className="linear-context">
          {reading ? '자료 책장 · 교재 읽기' : '탐구 작업대 · 선형대수 관찰'}
        </p>
        <h2>선형대수 · 구조와 변화 읽기</h2>
        <p className="prose">
          질문을 고르고, 원식과 조건을 읽고, 같은 대상을 다른 표현에서 살펴본다.
        </p>
      </header>
      {error && (
        <>
          <ErrorState message={error} />
          <Button
            onClick={() => {
              try {
                if (blocked.current) {
                  const value = readLinearWorkspace(key);
                  blocked.current = false;
                  setWorkspace(value);
                  setError('');
                } else update(current.current);
              } catch (e) {
                setError(e instanceof Error ? e.message : '다시 보관하지 못했다.');
              }
            }}
          >
            {blocked.current ? '저장한 관찰 다시 읽기' : '현재 관찰 다시 보관'}
          </Button>
          <Button onClick={exportState}>현재 입력 파일로 보관</Button>
        </>
      )}
      {saveError && (
        <>
          <ErrorState message={saveError} />
          <Button busy={busy} onClick={save}>
            관찰 사본 저장 다시 시도
          </Button>
        </>
      )}
      {status && <p role="status">{status}</p>}
      <Input
        label="개념 찾기"
        value={workspace.query}
        onChange={(e) => update({ ...current.current, query: e.target.value })}
      />
      <Select label="살펴볼 개념" value={concept.id} onChange={(e) => select(e.target.value)}>
        {catalog.concepts
          .filter((c) => c.id === concept.id || `${c.name} ${c.role}`.includes(workspace.query))
          .map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ·{' '}
              {catalog.sections.find((s) => s.source_section === c.sections[0])?.source_title ??
                '교차 연결'}
            </option>
          ))}
      </Select>
      <details onToggle={(e) => setMapOpen(e.currentTarget.open)}>
        <summary>개념 연결도 펼치기</summary>
        {mapOpen && (
          <Suspense fallback={<LoadingState message="연결도를 펼치는 중이다." />}>
            <ConceptMap data={data} selected={concept.id} onSelect={select} />
          </Suspense>
        )}
      </details>
      {reading ? (
        <>
          <p className="prose">{concept.role}</p>
          {source}
          <Button variant="primary" onClick={() => setSmall(true)}>
            이 개념 관찰을 곁에 열기
          </Button>
          <Button
            onClick={() => {
              try {
                const k = reasoningViewKey(data);
                update({ ...current.current, returnToReader: true });
                writeReasoningView(k, { ...readReasoningView(k), active: 'linear' });
                navigate('/math');
              } catch (e) {
                setError(e instanceof Error ? e.message : '관찰 도구를 열지 못했다.');
              }
            }}
          >
            전체 관찰 도구로 이동
          </Button>
          <Modal
            open={small}
            title="선형대수 · 작은 관찰"
            onClose={() => setSmall(false)}
            className="linear-modal"
          >
            <div className="linear-algebra">
              <div hidden={expanded}>{observation()}</div>
            </div>
          </Modal>
        </>
      ) : (
        <div hidden={expanded}>{observation()}</div>
      )}
      <details>
        <summary>전체 대응 목록과 확인 범위</summary>
        <p className="prose">{correspondence.notComplete}</p>
        <p className="prose">
          원문에서 제목·정리 표식 688개를 추가로 추출했다. 각 항목의 경계·가정·결론·관찰 대응은 판단
          보류이며 이 개념 목록의 검토 완료 수에 포함하지 않는다.
        </p>
        <p>
          서로 다른 연결도에 재사용된 개념 ID {correspondence.concepts.length}개 · 본문과 부록 항목{' '}
          {correspondence.sections.length}개
        </p>
        <ul>
          {correspondence.concepts.map((c) => (
            <li key={c.id}>
              <Button onClick={() => select(c.id)}>{c.name}</Button>
              <span>
                {c.classification} · {c.reason}
              </span>
              {linearUnit(c.id).remaining.map((x) => (
                <p className="prose" key={x}>
                  {x}
                </p>
              ))}
            </li>
          ))}
        </ul>
        <details>
          <summary>원자료 절·부록과 대응 목록 대조</summary>
          <ul>
            {correspondence.sections.map((s) => (
              <li key={s.source_section}>
                <span>
                  {s.source_section} · {s.source_title} · {s.classification}
                </span>
                <p className="prose">{s.reason}</p>
                <Button onClick={() => setSourcePage(s.pdf_start)}>원문 펼치기</Button>
                <span>연결된 개념 {s.mappedIds.length}개</span>
              </li>
            ))}
          </ul>
        </details>
      </details>

      <Modal
        open={expanded}
        title="선형대수 · 전체 관찰"
        onClose={() => setExpanded(false)}
        className="linear-modal"
      >
        <div className="linear-algebra">{observation(true)}</div>
      </Modal>
      {sourcePage !== null && (
        <Suspense fallback={<LoadingState message="원문을 펼치는 중이다." />}>
          <SourceReader
            key={concept.id}
            data={data}
            contextId={concept.id}
            page={sourcePage}
            onClose={() => setSourcePage(null)}
          />
        </Suspense>
      )}
    </section>
  );
}
// Use the shared exact-number formatter for all matrix cells.
import { matrixTex as matrixToTex } from '../domain/linear-algebra';
export function LinearAlgebraBookEntry(props: Props) {
  const [open, setOpen] = useState(() => {
    try {
      return !!readLinearWorkspace(linearViewKey(props.data)).returnToReader;
    } catch {
      return false;
    }
  });
  return (
    <>
      <Button onClick={() => setOpen(true)}>선형대수 교재 · 개념과 관찰</Button>
      <Modal
        open={open}
        title="선형대수 교재"
        onClose={() => {
          setOpen(false);
          try {
            const k = linearViewKey(props.data),
              w = readLinearWorkspace(k);
            writeLinearWorkspace(k, { ...w, returnToReader: false });
          } catch {}
        }}
        className="linear-modal"
      >
        <Suspense fallback={<LoadingState />}>
          <LinearAlgebraObservations {...props} reading />
        </Suspense>
      </Modal>
    </>
  );
}
