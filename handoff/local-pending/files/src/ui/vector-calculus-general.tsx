import { lazy, Suspense, useMemo, useRef, useState } from 'react';
import { Button, Input, ErrorState } from './index';
import { MathFormula } from './math-formula';
import { expression as numberExpression } from '../domain/math-explorer';
import {
  VECTOR_GENERAL_SPECS,
  generalKinds,
  freshGeneral,
  buildVectorGeneral,
  checkGeneralExpressions,
  type GeneralKind,
  type GeneralState,
  type GeneralWorkspace,
} from '../domain/vector-calculus-general';
const Plot = lazy(() =>
  import('./math-template-plot').then((m) => ({ default: m.MathTemplatePlot })),
);
export function VectorGeneralObservation({
  moduleId,
  value,
  onChange,
  onSource,
}: {
  moduleId: string;
  value?: GeneralWorkspace;
  onChange: (value: GeneralWorkspace) => void;
  onSource: () => void;
}) {
  const [showCalculation, setShowCalculation] = useState(false);
  const kinds = generalKinds(moduleId),
    kind = value && kinds.includes(value.active) ? value.active : kinds[0];
  const initial = useMemo(
    () => freshGeneral(kind, kind === 'stokes' && moduleId !== 'D4' ? 'rectangle' : undefined),
    [kind, moduleId],
  );
  const spec = VECTOR_GENERAL_SPECS[kind],
    state = value?.states[kind] ?? initial;
  const workspaceRef = useRef(value);
  workspaceRef.current = value;
  const set = (
    change: Partial<GeneralState> | ((latest: GeneralState) => Partial<GeneralState>),
  ) => {
    // A late plot view event must merge with the latest committed expression/draft.
    const workspace = workspaceRef.current,
      latest = workspace?.states[kind] ?? initial,
      patch = typeof change === 'function' ? change(latest) : change,
      next = {
        active: workspace?.active ?? kind,
        states: {
          ...workspace?.states,
          [kind]: {
            ...latest,
            ...(patch.values || patch.expressions ? { conditions: false } : {}),
            ...patch,
          },
        },
      };
    workspaceRef.current = next;
    onChange(next);
  };
  const computed = useMemo(() => {
    try {
      return { result: buildVectorGeneral(kind, state), error: '' };
    } catch (e) {
      return { result: undefined, error: String(e) };
    }
  }, [kind, state.expressions, state.values, state.conditions]);
  const draft = (key: string, text: string) =>
    set({ drafts: { ...state.drafts, [key]: text }, errors: { ...state.errors, [key]: '' } });
  const applyValue = (key: string, value: number, raw: string) => {
    const values = { ...state.values, [key]: value };
    try {
      buildVectorGeneral(kind, { ...state, values, conditions: false });
      set({
        values,
        drafts: { ...state.drafts, [key]: raw },
        errors: { ...state.errors, [key]: '' },
      });
    } catch (error) {
      set({
        drafts: { ...state.drafts, [key]: raw },
        errors: { ...state.errors, [key]: String(error) + ' 이전 확정값을 유지했다.' },
      });
    }
  };
  const apply = () => {
    const expressions = Object.fromEntries(
      spec.fields.map(([key]) => [key, state.drafts[key] ?? state.expressions[key]]),
    );
    try {
      checkGeneralExpressions(kind, expressions);
      buildVectorGeneral(kind, { ...state, expressions });
      set({ expressions, errors: {}, conditions: false });
    } catch (e) {
      set({
        errors: { ...state.errors, [spec.fields[0]?.[0] ?? spec.parameters[0].key]: String(e) },
      });
    }
  };
  const commit = (key: string) => {
    const param = spec.parameters.find((p) => p.key === key)!,
      raw = state.drafts[key] ?? String(state.values[key]);
    let v: number | null = null;
    try {
      v = numberExpression(raw).value({});
    } catch {}
    if (
      v === null ||
      v < param.min ||
      v > param.max ||
      (param.integer && !Number.isInteger(v)) ||
      (key === 'sign' && v !== -1 && v !== 1)
    ) {
      set({
        errors: {
          ...state.errors,
          [key]:
            `${param.min}부터 ${param.max} 사이의 ` +
            (param.integer ? '정수' : '수') +
            '를 입력해 주세요. 확정값은 유지했다.',
        },
      });
      return;
    }
    applyValue(key, v, raw);
  };
  return (
    <section className="vector-detail" aria-label="확장 관계 관찰" data-vector-general>
      <h3>다른 식과 조건으로 관찰하기</h3>
      <p>
        기본·확장 예시의 입력을 보존하면서 다른 관계를 같은 자리에서 관찰한다. 아래 식과 사례는 교재
        밖 설명용 모형이며 원문 조건과 연결해 읽는다.
      </p>
      {kinds.length > 1 && (
        <label>
          관찰할 관계
          <select
            aria-label="추가 관찰 관계"
            value={kind}
            onChange={(e) => {
              const next = e.target.value as GeneralKind;
              onChange({
                active: next,
                states: { ...value?.states, [next]: value?.states[next] ?? freshGeneral(next) },
              });
            }}
          >
            {kinds.map((k) => (
              <option key={k} value={k}>
                {VECTOR_GENERAL_SPECS[k].title}
              </option>
            ))}
          </select>
        </label>
      )}
      <h4 tabIndex={-1} data-general-question>
        {spec.title}
      </h4>
      <p>{spec.question}</p>
      <MathFormula tex={spec.tex.join(',\\quad ')} label="이 관계의 법칙과 식" />
      <p>
        <strong>적용 조건:</strong> {spec.conditions}
      </p>
      <Button onClick={onSource}>이 관계의 원문 읽기</Button>
      <label>
        설명용 사례
        <select
          aria-label="설명용 사례"
          value={state.caseId}
          onChange={(e) => {
            const next = freshGeneral(kind, e.target.value);
            set({ ...next, view: state.view });
          }}
        >
          {spec.cases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <p>
        {spec.cases.find((c) => c.id === state.caseId)?.explanation} 사례 선택은 이 추가 관찰의
        식·값만 바꾸며 기존 관찰과 메모는 유지한다.
      </p>
      <div className="vector-observation-grid">
        <section data-general-visual aria-label="추가 관계 도해">
          {computed.error ? (
            <ErrorState message={computed.error} />
          ) : (
            computed.result && (
              <Suspense fallback={<p>관찰 도해를 여는 중이다.</p>}>
                <Plot
                  key={kind}
                  item={computed.result.item}
                  result={computed.result.spatial}
                  initialView={
                    state.view ??
                    (computed.result.densityProjection
                      ? {
                          ranges: {
                            x: computed.result.item.ranges.x,
                            y: computed.result.item.ranges.y,
                          },
                        }
                      : undefined)
                  }
                  onView={(view) => set((latest) => ({ view: { ...latest.view, ...view } }))}
                  ordinaryWheelScroll
                  labelledVectors
                  compactCamera
                  surfaceProjectionLabel={computed.result.densityProjection}
                />
              </Suspense>
            )
          )}
          {computed.result && (
            <>
              <ul aria-label="추가 도해 표식">
                {computed.result.spatial.lines
                  .filter((l) => l.name)
                  .map((l, i) => (
                    <li key={i}>{l.name}</li>
                  ))}
              </ul>
              <p>
                공간 좌표는 같은 길이 축척이다. 밀도는 색·수치와 별도 단위로 읽는다. 유한 그림은
                일반적인 증명이 아니다.
              </p>
            </>
          )}
        </section>
        <section aria-label="추가 관계 조절" className="vector-controls">
          {spec.fields.length > 0 && (
            <details open>
              <summary>계산할 식</summary>
              {spec.fields.map(([key, label]) => (
                <Input
                  key={key}
                  label={label}
                  value={state.drafts[key] ?? state.expressions[key]}
                  error={state.errors[key] || undefined}
                  onChange={(e) => draft(key, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      apply();
                    }
                  }}
                />
              ))}
              <Button onClick={apply}>식 적용</Button>
              <p>
                입력 중인 식과 계산에 적용된 식을 구별한다. 적용 실패 시 입력 원문·이전 계산식을
                보존한다.
              </p>
            </details>
          )}
          {spec.parameters.map((param) => (
            <div key={param.key}>
              <Input
                label={param.label}
                value={state.drafts[param.key] ?? String(state.values[param.key])}
                error={state.errors[param.key] || undefined}
                inputMode="decimal"
                hint={`허용 범위 ${param.min}–${param.max}${param.integer ? ' · 정수' : ''}`}
                onChange={(e) => draft(param.key, e.target.value)}
                onBlur={() => commit(param.key)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    commit(param.key);
                  }
                }}
              />
              {param.options ? (
                <select
                  aria-label={param.label + ' 선택'}
                  value={state.values[param.key]}
                  onChange={(e) => applyValue(param.key, Number(e.target.value), e.target.value)}
                >
                  {param.options.map((label, i) => (
                    <option key={i} value={i}>
                      {label}
                    </option>
                  ))}
                </select>
              ) : param.key === 'sign' ? (
                <div className="vector-actions">
                  {[-1, 1].map((v) => (
                    <Button
                      key={v}
                      aria-pressed={state.values.sign === v}
                      onClick={() =>
                        set({
                          values: { ...state.values, sign: v },
                          drafts: { ...state.drafts, sign: String(v) },
                          errors: { ...state.errors, sign: '' },
                        })
                      }
                    >
                      {v === 1 ? '양의 방향 +1' : '반대 방향 −1'}
                    </Button>
                  ))}
                </div>
              ) : (
                <input
                  type="range"
                  aria-label={param.label + ' 탐색'}
                  min={param.min}
                  max={param.max}
                  step={param.integer ? 1 : 'any'}
                  value={state.values[param.key]}
                  onChange={(e) => applyValue(param.key, Number(e.target.value), e.target.value)}
                />
              )}
            </div>
          ))}
          <section aria-label="추가 관계 현재값">
            <h4>현재값과 조건</h4>
            <dl className="vector-values">
              {computed.result?.values.map(([name, v]) => (
                <div key={name}>
                  <dt>{name}</dt>
                  <dd>{typeof v === 'number' ? Number(v.toPrecision(8)).toString() : v}</dd>
                </div>
              ))}
            </dl>
            <p role="status">{computed.result?.judgment}</p>
          </section>
        </section>
      </div>
      <label>
        <input
          type="checkbox"
          checked={state.conditions}
          onChange={(e) => set({ conditions: e.target.checked })}
        />
        원문에서 현재 식·영역의 적용 조건을 확인했다
      </label>
      <p>
        이 선택은 사용자의 조건 확인이며 자동 증명·숙달 기록이 아니다. 수치 표본이 조건 전체를
        확인한 것으로 표시하지 않는다.
      </p>
      {computed.result && (
        <details onToggle={(e) => setShowCalculation(e.currentTarget.open)}>
          <summary>계산에 적용된 식·도함수 확인</summary>
          <p>입력 중인 식과 별도로, 현재 계산에 사용한 식을 순서대로 표시한다.</p>
          {showCalculation &&
            computed.result.tex.map((tex, i) => (
              <MathFormula key={i} tex={tex} label={`추가 관찰 계산식 ${i + 1}`} />
            ))}
        </details>
      )}
      {computed.result?.notices.map((n, i) => (
        <p key={i}>{n}</p>
      ))}
      <div className="vector-actions">
        <Button onClick={() => set({ ...freshGeneral(kind), view: state.view })}>
          이 추가 관찰의 식·값 처음으로
        </Button>
        <Button
          onClick={(e) => {
            const q = e.currentTarget
              .closest('[data-vector-general]')
              ?.querySelector<HTMLElement>('[data-general-question]');
            q?.focus({ preventScroll: true });
            q?.scrollIntoView({ block: 'start' });
          }}
        >
          이 관계의 질문으로 돌아가기
        </Button>
      </div>
    </section>
  );
}
