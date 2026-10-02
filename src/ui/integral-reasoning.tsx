import { useRef } from 'react';
import { Button, Checkbox, Select } from './index';
import { MathFormula } from './math-formula';
import {
  canReachStep,
  integralComparison,
  EXAMPLE_IDS,
  SERIES_EXAMPLES,
  STEP_IDS,
  reasoningSteps,
  type ReadingPosition,
  type ReasoningMethod,
  type ReasoningStepId,
  type SeriesExampleId,
} from '../domain/integral-reasoning';
import { readingFor, type ReasoningView } from '../data/integral-reasoning-view';
import './integral-reasoning.css';

export function IntegralReasoning({
  view,
  onChange,
}: {
  view: ReasoningView;
  onChange: (view: ReasoningView) => void;
}) {
  const reading = readingFor(view);
  const steps = reasoningSteps(view.example, reading);
  const effective = canReachStep(view.example, reading, reading.step)
    ? reading.step
    : (steps.find((s) => s.state !== 'ready')?.id ?? 'method');
  const selected = steps.find((step) => step.id === effective) ?? steps[0];
  const index = STEP_IDS.indexOf(selected.id);
  const update = (patch: Partial<ReadingPosition>) =>
    onChange({
      ...view,
      readings: { ...view.readings, [view.example]: { ...reading, ...patch } },
    });
  const detail = useRef<HTMLDivElement>(null);
  const choose = (step: ReasoningStepId) => {
    if (canReachStep(view.example, reading, step)) update({ step });
  };
  const advance = () => {
    const next = STEP_IDS[index + 1];
    if (next && canReachStep(view.example, reading, next)) {
      update({ step: next });
      requestAnimationFrame(() => {
        detail.current?.focus({ preventScroll: true });
        detail.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      });
    }
  };
  return (
    <section className="integral-reasoning" aria-label="급수의 수렴 판단">
      <header className="reasoning-heading">
        <div>
          <p className="reasoning-eyebrow">생각의 흐름 · Thinking process</p>
          <h2>급수의 수렴을 어떻게 판단할까?</h2>
          <p>먼저 구하려는 것을 정하고, 그 결론을 보장할 조건을 하나씩 확인합니다.</p>
        </div>
        <span className="reasoning-term">
          적분판정법<span>Integral test</span>
        </span>
      </header>
      <div className="reasoning-prompt">
        <Select
          label="살펴볼 급수"
          value={view.example}
          onChange={(e) => onChange({ ...view, example: e.target.value as SeriesExampleId })}
        >
          {EXAMPLE_IDS.map((id) => (
            <option key={id} value={id}>
              {SERIES_EXAMPLES[id].title}
            </option>
          ))}
        </Select>
        <MathFormula label="살펴볼 급수" tex={SERIES_EXAMPLES[view.example].tex} />
        {reading.absolute && view.example === 'alternating' && (
          <div className="reasoning-target">
            현재 확인하는 대상: 절댓값 급수 · Absolute-value series
            <MathFormula
              label="절댓값 급수"
              tex="\sum_{n=2}^{\infty}|a_n|=\sum_{n=2}^{\infty}\frac1{n(\ln n)^2}"
            />
          </div>
        )}
        {reading.tail && view.example === 'eventual' && (
          <p className="reasoning-target">
            현재는 세 번째 항부터 확인합니다. 처음의 항은 원래 급수에 남아 있습니다.
          </p>
        )}
      </div>
      <div className="reasoning-guide">
        <p>
          <strong>“이 결론을 내려면, 무엇이 확인되어야 할까?”</strong>
          <br />
          항의 극한은 수렴의 필요조건입니다. 양수·연속·감소는 적분판정법을 쓰기 위한 조건입니다.
          다른 판정법으로도 수렴을 보일 수 있습니다.
        </p>
        <Checkbox
          label="핵심만 보기"
          checked={reading.brief}
          onChange={(e) => update({ brief: e.target.checked })}
        />
      </div>
      <ol className="reasoning-flow" aria-label="수렴 판단의 순서">
        {steps.map((step, i) => {
          const available = canReachStep(view.example, reading, step.id);
          const active = selected.id === step.id;
          return (
            <li key={step.id} className={active ? 'reasoning-row is-current' : 'reasoning-row'}>
              <div className="reasoning-node">
                <button
                  type="button"
                  aria-current={active ? 'step' : undefined}
                  aria-controls="reasoning-explanation"
                  disabled={!available}
                  onClick={() => choose(step.id)}
                >
                  <span className="reasoning-number">{i + 1}</span>
                  <span>
                    <strong>{step.title}</strong>
                    <small>{step.english}</small>
                  </span>
                  <span className="reasoning-state">
                    {!available
                      ? '앞 조건 확인'
                      : step.state === 'stop'
                        ? '갈림길'
                        : step.state === 'unknown'
                          ? '확인 필요'
                          : active
                            ? '살펴보는 중'
                            : '보기'}
                  </span>
                </button>
                {i < steps.length - 1 && (
                  <div className="reasoning-connector" aria-hidden="true">
                    <span>
                      {step.state === 'stop' || step.state === 'unknown'
                        ? '근거를 확인한 뒤'
                        : i < 2
                          ? '다음 질문'
                          : i < 6
                            ? '조건을 확인하면'
                            : '다음 판단'}
                    </span>
                    <b>↓</b>
                  </div>
                )}
              </div>
              {active && (
                <div
                  className="reasoning-detail"
                  id="reasoning-explanation"
                  ref={detail}
                  tabIndex={-1}
                >
                  <p className="reasoning-eyebrow">{step.english}</p>
                  <h3>{step.question}</h3>
                  {!reading.brief && <p>{step.reason}</p>}
                  {step.evidence.map((tex, evidenceIndex) => (
                    <MathFormula
                      key={tex}
                      label={step.title + ' · 근거 ' + (evidenceIndex + 1)}
                      tex={tex}
                    />
                  ))}
                  {step.id === 'method' && (
                    <Select
                      label="판정법 후보 비교"
                      value={reading.method}
                      onChange={(e) =>
                        update({
                          method: e.target.value as ReasoningMethod,
                          absolute: false,
                          tail: false,
                          badExtension: false,
                          pending: null,
                        })
                      }
                    >
                      <option value="integral">적분판정법 · Integral test</option>
                      <option value="ratio">비율판정법 · Ratio test</option>
                      <option value="alternating">교대급수판정법 · Alternating series test</option>
                      <option value="geometric">등비급수 · Geometric series</option>
                    </Select>
                  )}
                  <p
                    className={`reasoning-outcome ${step.state === 'ready' ? '' : 'reasoning-branch'}`}
                  >
                    <strong>
                      {step.state === 'unknown'
                        ? '판정을 보류한다'
                        : step.state === 'stop'
                          ? '여기서 경로를 바꾼다'
                          : '그래서 다음 판단은'}
                    </strong>
                    <span>{step.outcome}</span>
                  </p>
                  {step.id === 'positive' &&
                    view.example === 'alternating' &&
                    !reading.absolute && (
                      <div className="reasoning-actions">
                        <Button
                          onClick={() =>
                            update({ absolute: true, pending: null, step: 'function' })
                          }
                        >
                          절댓값 급수로 확인
                        </Button>
                        <Button
                          onClick={() =>
                            update({ method: 'alternating', pending: null, step: 'method' })
                          }
                        >
                          교대급수판정법 비교
                        </Button>
                      </div>
                    )}
                  {step.id === 'decreasing' && view.example === 'eventual' && !reading.tail && (
                    <Button onClick={() => update({ tail: true, pending: null, step: 'function' })}>
                      세 번째 항부터 다시 확인
                    </Button>
                  )}
                  {step.id === 'method' && reading.method !== 'integral' && (
                    <Button onClick={() => update({ method: 'integral', pending: null })}>
                      적분판정법 후보로 돌아가기
                    </Button>
                  )}
                  {step.id === 'function' &&
                    (view.example !== 'alternating' || reading.absolute) && (
                      <Button
                        variant="quiet"
                        onClick={() =>
                          update({ badExtension: !reading.badExtension, pending: null })
                        }
                      >
                        {reading.badExtension
                          ? '원래 연속함수로 돌아가기'
                          : '정수 사이가 다른 함수를 비교'}
                      </Button>
                    )}
                  {step.id === 'continuous' && reading.badExtension && (
                    <Button
                      onClick={() =>
                        update({ badExtension: false, pending: null, step: 'function' })
                      }
                    >
                      원래 연속함수로 다시 확인
                    </Button>
                  )}
                  {step.id === 'term' && view.example === 'nonzero' && (
                    <Button onClick={() => onChange({ ...view, example: 'log-square' })}>
                      항이 0으로 가는 예제와 비교
                    </Button>
                  )}
                  {['positive', 'continuous', 'decreasing'].includes(step.id) &&
                    step.state !== 'stop' &&
                    (reading.pending === step.id ? (
                      <Button onClick={() => update({ pending: null })}>
                        근거를 확인하고 이어 보기
                      </Button>
                    ) : (
                      <Button variant="quiet" onClick={() => update({ pending: step.id })}>
                        이 조건을 아직 확인하지 못했다면?
                      </Button>
                    ))}
                  {step.id === 'integral' && (
                    <AreaComparison
                      example={view.example}
                      reading={reading}
                      count={reading.areaCount ?? 7}
                      onCount={(areaCount) => update({ areaCount })}
                    />
                  )}
                  <div className="reasoning-navigation">
                    {index > 0 && (
                      <Button variant="quiet" onClick={() => choose(STEP_IDS[index - 1])}>
                        이전 질문
                      </Button>
                    )}
                    {index < steps.length - 1 &&
                      canReachStep(view.example, reading, STEP_IDS[index + 1]) && (
                        <Button variant="primary" onClick={advance}>
                          다음 질문
                        </Button>
                      )}
                    {step.id === 'conclusion' && (
                      <Button onClick={() => update({ step: 'goal' })}>
                        처음 질문으로 돌아가기
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <div className="reasoning-footer">
        {(reading.absolute || reading.tail || reading.badExtension) && (
          <Button
            variant="quiet"
            onClick={() =>
              update({
                absolute: false,
                tail: false,
                badExtension: false,
                pending: null,
                method: 'integral',
                step: 'function',
              })
            }
          >
            원래 급수의 조건으로 돌아가기
          </Button>
        )}
        <details>
          <summary>정리의 원문과 적용 범위</summary>
          <p>
            정수에서 항과 일치하는 양수·연속·감소 함수를 어느 지점 이후에 잡을 수 있으면, 급수와
            이상적분의 수렴 여부가 같습니다. 여기서는 비율·교대·등비 판정과 비교하며 이 조건을
            확인합니다.
          </p>
          <p>예제별 읽던 위치는 이 기기에 보관됩니다.</p>
          <a
            href="https://openstax.org/books/calculus-volume-2/pages/5-3-the-divergence-and-integral-tests"
            target="_blank"
            rel="noreferrer"
          >
            OpenStax · 발산판정법과 적분판정법
          </a>
          <a
            href="https://openstax.org/books/calculus-volume-2/pages/5-6-ratio-and-root-tests"
            target="_blank"
            rel="noreferrer"
          >
            OpenStax · 판정법을 선택하는 전략
          </a>
        </details>
      </div>
    </section>
  );
}

/** Finite bounds illustrate the comparison; the analytic limit proves convergence. */
function AreaComparison({
  example,
  reading,
  count: end,
  onCount,
}: {
  example: SeriesExampleId;
  reading: ReadingPosition;
  count: number;
  onCount: (count: number) => void;
}) {
  const { lower, upper, left, right, area, f } = integralComparison(example, reading, end);
  const x = (v: number) => 34 + ((v - lower) / end) * 322;
  const y = (v: number) => 162 - (v / f(lower)) * 130;
  const path = Array.from({ length: 121 }, (_, i) => lower + (end * i) / 120)
    .map((v, i) => `${(i ? 'L' : 'M') + x(v)},${y(f(v))}`)
    .join(' ');
  return (
    <div className="reasoning-area">
      <h4>왜 감소 조건이 필요할까?</h4>
      <p>감소하면 곡선 아래 넓이가 오른쪽·왼쪽 직사각형 합 사이에 놓입니다.</p>
      <svg
        viewBox="0 0 380 190"
        role="img"
        aria-label="감소 곡선과 이를 사이에 두는 왼쪽·오른쪽 직사각형"
      >
        {Array.from({ length: end }, (_, i) => lower + i).map((n) => (
          <g key={n}>
            <rect
              className="reasoning-rect-upper"
              x={x(n)}
              y={y(f(n))}
              width={322 / end}
              height={162 - y(f(n))}
            />
            <rect
              className="reasoning-rect-lower"
              x={x(n)}
              y={y(f(n + 1))}
              width={322 / end}
              height={162 - y(f(n + 1))}
            />
          </g>
        ))}
        <path className="reasoning-axis" d="M34,24V162H362" />
        <path className="reasoning-curve" d={path} />
        <text x="34" y="182">
          {lower}
        </text>
        <text x="350" y="182">
          {upper}
        </text>
      </svg>
      <label htmlFor="reasoning-end">비교 구간의 끝</label>
      <input
        id="reasoning-end"
        type="range"
        min="3"
        max="12"
        step="1"
        value={end}
        aria-label="비교 구간의 끝"
        aria-valuetext={String(upper)}
        onChange={(e) => onCount(Number(e.target.value))}
      />
      <MathFormula
        label="직사각형 합과 넓이의 관계"
        tex={
          '\\sum_{n=' +
          (lower + 1) +
          '}^{' +
          upper +
          '}f(n)\\le\\int_{' +
          lower +
          '}^{' +
          upper +
          '}f(x)\\,dx\\le\\sum_{n=' +
          lower +
          '}^{' +
          (upper - 1) +
          '}f(n)'
        }
      />
      <p className="reasoning-area-values">
        <MathFormula
          inline
          tex={`${right.toFixed(3)}\\le${area.toFixed(3)}\\le${left.toFixed(3)}`}
        />{' '}
        · 소수 셋째 자리까지 표시한 근삿값
      </p>
      <p className="reasoning-caption">
        구간을 움직이는 그림은 비교 관계를 보여 줍니다. 무한한 범위의 수렴 판정은 위의 식과 극한
        계산으로 확인합니다.
      </p>
    </div>
  );
}
