# src/ui/integral-reasoning.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-be3459cf7dc0

**IntegralReasoning** · [src/ui/integral-reasoning.tsx:19](../../../src/ui/integral-reasoning.tsx#L19)

분기 조건과 가능한 갈림길:

- B-ecc0bc983950 · ConditionalExpression · canReachStep(view.example, reading, reading.step) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (28행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 26행 | 별도 조건식 없음 | readingFor(view)<br>call |
| 27행 | 별도 조건식 없음 | reasoningSteps(view.example, reading)<br>call |
| 28행 | 별도 조건식 없음 | canReachStep(view.example, reading, reading.step)<br>call |
| 30행 | falsy: canReachStep(view.example, reading, reading.step) | steps.find((s) => s.state !== 'ready')<br>call<br>전달 콜백: H-e0a835e2cbff |
| 31행 | 별도 조건식 없음 | steps.find((step) => step.id === effective)<br>call<br>전달 콜백: H-56456e034b68 |
| 32행 | 별도 조건식 없음 | STEP_IDS.indexOf(selected.id)<br>call |
| 38행 | 별도 조건식 없음 | useRef(null)<br>call |
| 70행 | 별도 조건식 없음 | EXAMPLE_IDS.map((id) => ( <option key={id} value={id}> {SERIES_EXAMPLES[id].title} </option> ))<br>call<br>전달 콜백: H-5d340b846cc2 |
| 106행 | 별도 조건식 없음 | steps.map((step, i) => { const available = canReachStep(view.example, reading, step.id); const active = selected.id === step.id; return ( <li key={step.id} className={active ? 'reasoning-row is-current' : 'reasoning-row'}> <div className="reasoning-node"> <button type="button" aria-current={active ? 'step' : undefined} aria-controls="reasoning-explanation" disabled={!available} onClick={() => choose(step.id)} > <span className="reasoning-number">{i + 1}</span> <span> <strong>{step.title}</strong> <small>{step.english}</small> </span> <span className="reasoning-state"> {!available ? '앞 조건 확인' : step.state === 'stop' ? '갈림길' : step.state === 'unknown' ? '확인 필요' : active ? '살펴보는 중' : '보기'} </span> </butt … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-fdf500e6d91d |

반환/조기 중단: 52행 <render> [별도 조건식 없음]

## H-e0a835e2cbff

**@callback:steps.find** · [src/ui/integral-reasoning.tsx:30](../../../src/ui/integral-reasoning.tsx#L30)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-56456e034b68

**@callback:steps.find** · [src/ui/integral-reasoning.tsx:31](../../../src/ui/integral-reasoning.tsx#L31)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ee981a8ef21d

**update** · [src/ui/integral-reasoning.tsx:33](../../../src/ui/integral-reasoning.tsx#L33)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 34행 | 별도 조건식 없음 | onChange({ ...view, readings: { ...view.readings, [view.example]: { ...reading, ...patch } }, })<br>call |

## H-40d08f79249e

**choose** · [src/ui/integral-reasoning.tsx:39](../../../src/ui/integral-reasoning.tsx#L39)

분기 조건과 가능한 갈림길:

- B-f2d56ab3cc46 · IfStatement · canReachStep(view.example, reading, step) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (40행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 40행 | 별도 조건식 없음 | canReachStep(view.example, reading, step)<br>call |
| 40행 | truthy: canReachStep(view.example, reading, step) | update({ step })<br>call → [H-ee981a8ef21d](ui__integral-reasoning.md#h-ee981a8ef21d) |

## H-42d1761f4f46

**advance** · [src/ui/integral-reasoning.tsx:42](../../../src/ui/integral-reasoning.tsx#L42)

분기 조건과 가능한 갈림길:

- B-cfa1ab732c32 · IfStatement · next && canReachStep(view.example, reading, next) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (44행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 44행 | truthy: next | canReachStep(view.example, reading, next)<br>call |
| 45행 | truthy: next && canReachStep(view.example, reading, next) | update({ step: next })<br>call → [H-ee981a8ef21d](ui__integral-reasoning.md#h-ee981a8ef21d) |
| 46행 | truthy: next && canReachStep(view.example, reading, next) | requestAnimationFrame(() => { detail.current?.focus({ preventScroll: true }); detail.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' }); })<br>call<br>전달 콜백: H-f25f089b339f |

## H-f25f089b339f

**@callback:requestAnimationFrame** · [src/ui/integral-reasoning.tsx:46](../../../src/ui/integral-reasoning.tsx#L46)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-542f6608dd1f

**@onChange** · [src/ui/integral-reasoning.tsx:68](../../../src/ui/integral-reasoning.tsx#L68)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 68행 | 별도 조건식 없음 | onChange({ ...view, example: e.target.value as SeriesExampleId })<br>call |

## H-5d340b846cc2

**@callback:EXAMPLE_IDS.map** · [src/ui/integral-reasoning.tsx:70](../../../src/ui/integral-reasoning.tsx#L70)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3cc1cc34a92a

**@onChange** · [src/ui/integral-reasoning.tsx:102](../../../src/ui/integral-reasoning.tsx#L102)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 102행 | 별도 조건식 없음 | update({ brief: e.target.checked })<br>call → [H-ee981a8ef21d](ui__integral-reasoning.md#h-ee981a8ef21d) |

## H-fdf500e6d91d

**@callback:steps.map** · [src/ui/integral-reasoning.tsx:106](../../../src/ui/integral-reasoning.tsx#L106)

분기 조건과 가능한 갈림길:

- B-fcb8a4b4dcd0 · ConditionalExpression · active → truthy / falsy; 바깥 조건: 별도 조건식 없음 (110행).
- B-1a39fcb1a052 · ConditionalExpression · active → truthy / falsy; 바깥 조건: 별도 조건식 없음 (114행).
- B-f563272f7917 · ConditionalExpression · !available → truthy / falsy; 바깥 조건: 별도 조건식 없음 (125행).
- B-c61a8d47cdda · ConditionalExpression · step.state === 'stop' → truthy / falsy; 바깥 조건: falsy: !available (127행).
- B-7c90a629c83a · ConditionalExpression · step.state === 'unknown' → truthy / falsy; 바깥 조건: falsy: !available ∧ falsy: step.state === 'stop' (129행).
- B-b241940331a9 · ConditionalExpression · active → truthy / falsy; 바깥 조건: falsy: !available ∧ falsy: step.state === 'stop' ∧ falsy: step.state === 'unknown' (131행).
- B-9c00f8e4a2ad · ConditionalExpression · step.state === 'stop' || step.state === 'unknown' → truthy / falsy; 바깥 조건: truthy: i < steps.length - 1 (139행).
- B-298f69afdafc · ConditionalExpression · i < 2 → truthy / falsy; 바깥 조건: truthy: i < steps.length - 1 ∧ falsy: step.state === 'stop' || step.state === 'unknown' (141행).
- B-2c06c6d685fe · ConditionalExpression · i < 6 → truthy / falsy; 바깥 조건: truthy: i < steps.length - 1 ∧ falsy: step.state === 'stop' || step.state === 'unknown' ∧ falsy: i < 2 (143행).
- B-2c392129a95e · ConditionalExpression · step.state === 'ready' → truthy / falsy; 바깥 조건: truthy: active (189행).
- B-cfd4e62ef98d · ConditionalExpression · step.state === 'unknown' → truthy / falsy; 바깥 조건: truthy: active (192행).
- B-0821ffe31373 · ConditionalExpression · step.state === 'stop' → truthy / falsy; 바깥 조건: truthy: active ∧ falsy: step.state === 'unknown' (194행).
- B-e5c2b2b04128 · ConditionalExpression · reading.badExtension → truthy / falsy; 바깥 조건: truthy: active ∧ truthy: step.id === 'function' &&
                    (view.example !== 'alternating' || reading.absolute) (238행).
- B-e1c88e8ee099 · ConditionalExpression · reading.pending === step.id → truthy / falsy; 바깥 조건: truthy: active ∧ truthy: ['positive', 'continuous', 'decreasing'].includes(step.id) &&
                    step.state !== 'stop' (259행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 107행 | 별도 조건식 없음 | canReachStep(view.example, reading, step.id)<br>call |
| 161행 | truthy: active | step.evidence.map((tex, evidenceIndex) => ( <MathFormula key={tex} label={step.title + ' · 근거 ' + (evidenceIndex + 1)} tex={tex} /> ))<br>call<br>전달 콜백: H-f0a798cfefbd |
| 257행 | truthy: active | ['positive', 'continuous', 'decreasing'].includes(step.id)<br>call |
| 283행 | truthy: active ∧ truthy: index < steps.length - 1 | canReachStep(view.example, reading, STEP_IDS[index + 1])<br>call |

반환/조기 중단: 109행 <render> [별도 조건식 없음]

## H-45f7f9111906

**@onClick** · [src/ui/integral-reasoning.tsx:117](../../../src/ui/integral-reasoning.tsx#L117)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 117행 | 별도 조건식 없음 | choose(step.id)<br>call → [H-40d08f79249e](ui__integral-reasoning.md#h-40d08f79249e) |

## H-f0a798cfefbd

**@callback:step.evidence.map** · [src/ui/integral-reasoning.tsx:161](../../../src/ui/integral-reasoning.tsx#L161)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7c665b45ec75

**@onChange** · [src/ui/integral-reasoning.tsx:172](../../../src/ui/integral-reasoning.tsx#L172)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 173행 | truthy: active ∧ truthy: step.id === 'method' | update({ method: e.target.value as ReasoningMethod, absolute: false, tail: false, badExtension: false, pending: null, })<br>call → [H-ee981a8ef21d](ui__integral-reasoning.md#h-ee981a8ef21d) |

## H-bfef8799c1e3

**@onClick** · [src/ui/integral-reasoning.tsx:205](../../../src/ui/integral-reasoning.tsx#L205)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 206행 | truthy: active ∧ truthy: step.id === 'positive' &&<br>                    view.example === 'alternating' &&<br>                    !reading.absolute | update({ absolute: true, pending: null, step: 'function' })<br>call → [H-ee981a8ef21d](ui__integral-reasoning.md#h-ee981a8ef21d) |

## H-268d35e51088

**@onClick** · [src/ui/integral-reasoning.tsx:212](../../../src/ui/integral-reasoning.tsx#L212)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 213행 | truthy: active ∧ truthy: step.id === 'positive' &&<br>                    view.example === 'alternating' &&<br>                    !reading.absolute | update({ method: 'alternating', pending: null, step: 'method' })<br>call → [H-ee981a8ef21d](ui__integral-reasoning.md#h-ee981a8ef21d) |

## H-800570ddadd7

**@onClick** · [src/ui/integral-reasoning.tsx:221](../../../src/ui/integral-reasoning.tsx#L221)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 221행 | truthy: active ∧ truthy: step.id === 'decreasing' && view.example === 'eventual' && !reading.tail | update({ tail: true, pending: null, step: 'function' })<br>call → [H-ee981a8ef21d](ui__integral-reasoning.md#h-ee981a8ef21d) |

## H-206e17dca5ec

**@onClick** · [src/ui/integral-reasoning.tsx:226](../../../src/ui/integral-reasoning.tsx#L226)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 226행 | truthy: active ∧ truthy: step.id === 'method' && reading.method !== 'integral' | update({ method: 'integral', pending: null })<br>call → [H-ee981a8ef21d](ui__integral-reasoning.md#h-ee981a8ef21d) |

## H-4986f6a0854f

**@onClick** · [src/ui/integral-reasoning.tsx:234](../../../src/ui/integral-reasoning.tsx#L234)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 235행 | truthy: active ∧ truthy: step.id === 'function' &&<br>                    (view.example !== 'alternating' \|\| reading.absolute) | update({ badExtension: !reading.badExtension, pending: null })<br>call → [H-ee981a8ef21d](ui__integral-reasoning.md#h-ee981a8ef21d) |

## H-286e792e9abf

**@onClick** · [src/ui/integral-reasoning.tsx:245](../../../src/ui/integral-reasoning.tsx#L245)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 246행 | truthy: active ∧ truthy: step.id === 'continuous' && reading.badExtension | update({ badExtension: false, pending: null, step: 'function' })<br>call → [H-ee981a8ef21d](ui__integral-reasoning.md#h-ee981a8ef21d) |

## H-481fb1b6fc80

**@onClick** · [src/ui/integral-reasoning.tsx:253](../../../src/ui/integral-reasoning.tsx#L253)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 253행 | truthy: active ∧ truthy: step.id === 'term' && view.example === 'nonzero' | onChange({ ...view, example: 'log-square' })<br>call |

## H-5cc3a0556100

**@onClick** · [src/ui/integral-reasoning.tsx:260](../../../src/ui/integral-reasoning.tsx#L260)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 260행 | truthy: active ∧ truthy: ['positive', 'continuous', 'decreasing'].includes(step.id) &&<br>                    step.state !== 'stop' ∧ truthy: reading.pending === step.id | update({ pending: null })<br>call → [H-ee981a8ef21d](ui__integral-reasoning.md#h-ee981a8ef21d) |

## H-fb1fe665c099

**@onClick** · [src/ui/integral-reasoning.tsx:264](../../../src/ui/integral-reasoning.tsx#L264)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 264행 | truthy: active ∧ truthy: ['positive', 'continuous', 'decreasing'].includes(step.id) &&<br>                    step.state !== 'stop' ∧ falsy: reading.pending === step.id | update({ pending: step.id })<br>call → [H-ee981a8ef21d](ui__integral-reasoning.md#h-ee981a8ef21d) |

## H-23e8a6133098

**@onCount** · [src/ui/integral-reasoning.tsx:273](../../../src/ui/integral-reasoning.tsx#L273)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 273행 | truthy: active ∧ truthy: step.id === 'integral' | update({ areaCount })<br>call → [H-ee981a8ef21d](ui__integral-reasoning.md#h-ee981a8ef21d) |

## H-a1062bb00590

**@onClick** · [src/ui/integral-reasoning.tsx:278](../../../src/ui/integral-reasoning.tsx#L278)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 278행 | truthy: active ∧ truthy: index > 0 | choose(STEP_IDS[index - 1])<br>call → [H-40d08f79249e](ui__integral-reasoning.md#h-40d08f79249e) |

## H-0fce42924417

**@onClick** · [src/ui/integral-reasoning.tsx:289](../../../src/ui/integral-reasoning.tsx#L289)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 289행 | truthy: active ∧ truthy: step.id === 'conclusion' | update({ step: 'goal' })<br>call → [H-ee981a8ef21d](ui__integral-reasoning.md#h-ee981a8ef21d) |

## H-91e4d0a2825f

**@onClick** · [src/ui/integral-reasoning.tsx:304](../../../src/ui/integral-reasoning.tsx#L304)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 305행 | truthy: reading.absolute \|\| reading.tail \|\| reading.badExtension | update({ absolute: false, tail: false, badExtension: false, pending: null, method: 'integral', step: 'function', })<br>call → [H-ee981a8ef21d](ui__integral-reasoning.md#h-ee981a8ef21d) |

## H-e1352a5b66e3

**AreaComparison** · [src/ui/integral-reasoning.tsx:347](../../../src/ui/integral-reasoning.tsx#L347)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 358행 | 별도 조건식 없음 | integralComparison(example, reading, end)<br>call |
| 361행 | 별도 조건식 없음 | Array.from({ length: 121 }, (_, i) => lower + (end * i) / 120)<br>    .map((v, i) => `${(i ? 'L' : 'M') + x(v)},${y(f(v))}`)<br>    .join(' ')<br>call |
| 361행 | 별도 조건식 없음 | Array.from({ length: 121 }, (_, i) => lower + (end * i) / 120)<br>    .map((v, i) => `${(i ? 'L' : 'M') + x(v)},${y(f(v))}`)<br>call<br>전달 콜백: H-5a38cca5fc41 |
| 361행 | 별도 조건식 없음 | Array.from({ length: 121 }, (_, i) => lower + (end * i) / 120)<br>call<br>전달 콜백: H-55adf13532f9 |
| 373행 | 별도 조건식 없음 | Array.from({ length: end }, (_, i) => lower + i).map((n) => ( <g key={n}> <rect className="reasoning-rect-upper" x={x(n)} y={y(f(n))} width={322 / end} height={162 - y(f(n))} /> <rect className="reasoning-rect-lower" x={x(n)} y={y(f(n + 1))} width={322 / end} height={162 - y(f(n + 1))} /> </g> ))<br>call<br>전달 콜백: H-482b93ed2b61 |
| 373행 | 별도 조건식 없음 | Array.from({ length: end }, (_, i) => lower + i)<br>call<br>전달 콜백: H-4f9603b4bf2a |
| 409행 | 별도 조건식 없음 | String(upper)<br>call |
| 433행 | 별도 조건식 없음 | right.toFixed(3)<br>call |
| 433행 | 별도 조건식 없음 | area.toFixed(3)<br>call |
| 433행 | 별도 조건식 없음 | left.toFixed(3)<br>call |

반환/조기 중단: 364행 <render> [별도 조건식 없음]

## H-1a64488ce2e4

**x** · [src/ui/integral-reasoning.tsx:359](../../../src/ui/integral-reasoning.tsx#L359)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c671b7979116

**y** · [src/ui/integral-reasoning.tsx:360](../../../src/ui/integral-reasoning.tsx#L360)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 360행 | 별도 조건식 없음 | f(lower)<br>call |

## H-55adf13532f9

**@callback:Array.from** · [src/ui/integral-reasoning.tsx:361](../../../src/ui/integral-reasoning.tsx#L361)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-5a38cca5fc41

**@callback:Array.from({ length: 121 }, (_, i) => lower + (end * i) / 120)
    .map** · [src/ui/integral-reasoning.tsx:362](../../../src/ui/integral-reasoning.tsx#L362)

분기 조건과 가능한 갈림길:

- B-9c302ba94865 · ConditionalExpression · i → truthy / falsy; 바깥 조건: 별도 조건식 없음 (362행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 362행 | 별도 조건식 없음 | x(v)<br>call → [H-1a64488ce2e4](ui__integral-reasoning.md#h-1a64488ce2e4) |
| 362행 | 별도 조건식 없음 | y(f(v))<br>call → [H-c671b7979116](ui__integral-reasoning.md#h-c671b7979116) |
| 362행 | 별도 조건식 없음 | f(v)<br>call |

## H-4f9603b4bf2a

**@callback:Array.from** · [src/ui/integral-reasoning.tsx:373](../../../src/ui/integral-reasoning.tsx#L373)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-482b93ed2b61

**@callback:Array.from({ length: end }, (_, i) => lower + i).map** · [src/ui/integral-reasoning.tsx:373](../../../src/ui/integral-reasoning.tsx#L373)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 377행 | 별도 조건식 없음 | x(n)<br>call → [H-1a64488ce2e4](ui__integral-reasoning.md#h-1a64488ce2e4) |
| 378행 | 별도 조건식 없음 | y(f(n))<br>call → [H-c671b7979116](ui__integral-reasoning.md#h-c671b7979116) |
| 378행 | 별도 조건식 없음 | f(n)<br>call |
| 380행 | 별도 조건식 없음 | y(f(n))<br>call → [H-c671b7979116](ui__integral-reasoning.md#h-c671b7979116) |
| 380행 | 별도 조건식 없음 | f(n)<br>call |
| 384행 | 별도 조건식 없음 | x(n)<br>call → [H-1a64488ce2e4](ui__integral-reasoning.md#h-1a64488ce2e4) |
| 385행 | 별도 조건식 없음 | y(f(n + 1))<br>call → [H-c671b7979116](ui__integral-reasoning.md#h-c671b7979116) |
| 385행 | 별도 조건식 없음 | f(n + 1)<br>call |
| 387행 | 별도 조건식 없음 | y(f(n + 1))<br>call → [H-c671b7979116](ui__integral-reasoning.md#h-c671b7979116) |
| 387행 | 별도 조건식 없음 | f(n + 1)<br>call |

## H-87c39fbd654c

**@onChange** · [src/ui/integral-reasoning.tsx:410](../../../src/ui/integral-reasoning.tsx#L410)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 410행 | 별도 조건식 없음 | onCount(Number(e.target.value))<br>call |
| 410행 | 별도 조건식 없음 | Number(e.target.value)<br>call |

