# src/ui/ui-performance-panel.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-3b7dafc188bd

**summarize** · [src/ui/ui-performance-panel.tsx:28](../../../src/ui/ui-performance-panel.tsx#L28)

분기 조건과 가능한 갈림길:

- B-262c7fee649a · ConditionalExpression · durations.length % 2 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (35행).
- B-e86404d261d5 · ConditionalExpression · durations.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (36행).
- B-2739c366ba00 · ConditionalExpression · durations.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (36행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 29행 | 별도 조건식 없음 | values<br>    .filter((row) => row.success)<br>    .map((row) => row.durationMs)<br>    .sort((a, b) => a - b)<br>call<br>전달 콜백: H-0b42e9a880d9 |
| 29행 | 별도 조건식 없음 | values<br>    .filter((row) => row.success)<br>    .map((row) => row.durationMs)<br>call<br>전달 콜백: H-d48917ab348a |
| 29행 | 별도 조건식 없음 | values<br>    .filter((row) => row.success)<br>call<br>전달 콜백: H-ce73a02b9678 |
| 33행 | 별도 조건식 없음 | Math.floor(durations.length / 2)<br>call |
| 36행 | truthy: durations.length | Math.round(median)<br>call |
| 36행 | truthy: durations.length | Math.round(durations[durations.length - 1])<br>call |

반환/조기 중단: 36행 `${values.length}회 · 완료 ${durations.length}회 · 중앙 ${durations.length ? `${Math.round(median)}ms` : '측정 없음'} · 최대 ${durations.length ? `${Math.round(durations[durations.length - 1])}ms` : '측정 없음'}` [별도 조건식 없음]

## H-ce73a02b9678

**@callback:values
    .filter** · [src/ui/ui-performance-panel.tsx:30](../../../src/ui/ui-performance-panel.tsx#L30)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d48917ab348a

**@callback:values
    .filter((row) => row.success)
    .map** · [src/ui/ui-performance-panel.tsx:31](../../../src/ui/ui-performance-panel.tsx#L31)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-0b42e9a880d9

**@callback:values
    .filter((row) => row.success)
    .map((row) => row.durationMs)
    .sort** · [src/ui/ui-performance-panel.tsx:32](../../../src/ui/ui-performance-panel.tsx#L32)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d5db5e29f63b

**UiPerformancePanel** · [src/ui/ui-performance-panel.tsx:38](../../../src/ui/ui-performance-panel.tsx#L38)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 39행 | 별도 조건식 없음 | useSyncExternalStore(subscribeUiPerformance, readUiPerformance, readUiPerformance)<br>call |
| 44행 | 별도 조건식 없음 | useState(readRequestPerformance)<br>call |
| 45행 | 별도 조건식 없음 | useState('')<br>call |
| 88행 | 별도 조건식 없음 | UI_MEASURE_PHASES.map((phase) => ( <div key={phase}> <dt>{names[phase]}</dt> <dd>{summarize(samples.filter((row) => row.phase === phase))}</dd> </div> ))<br>call<br>전달 콜백: H-12b654f53e85 |
| 98행 | 별도 조건식 없음 | Object.entries(requestNames).map(([phase, label]) => ( <div key={phase}> <dt>{label}</dt> <dd>{summarize(requests.filter((row) => row.phase === phase))}</dd> </div> ))<br>call<br>전달 콜백: H-c7bd4129129c |
| 98행 | 별도 조건식 없음 | Object.entries(requestNames)<br>call |

반환/조기 중단: 76행 <render> [별도 조건식 없음]

## H-23dab1fefab9

**refresh** · [src/ui/ui-performance-panel.tsx:46](../../../src/ui/ui-performance-panel.tsx#L46)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 47행 | 별도 조건식 없음 | setRequests(readRequestPerformance())<br>state-update |
| 47행 | 별도 조건식 없음 | readRequestPerformance()<br>call |
| 48행 | 별도 조건식 없음 | setNotice('이 창의 최근 측정값을 불러왔습니다.')<br>state-update |

## H-1d9f5726c656

**download** · [src/ui/ui-performance-panel.tsx:50](../../../src/ui/ui-performance-panel.tsx#L50)

분기 조건과 가능한 갈림길:

- B-3ef1480821dd · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (52행).
- B-80d0e22fa601 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (71행).
- B-f44e7c4b6be3 · IfStatement · url → truthy / falsy; 바깥 조건: exception: exception (72행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 56행 | 별도 조건식 없음 | readUiPerformance()<br>call |
| 57행 | 별도 조건식 없음 | readRequestPerformance()<br>call |
| 59행 | 별도 조건식 없음 | URL.createObjectURL(new Blob([JSON.stringify(body, null, 2)], { type: 'application/json' }))<br>call |
| 60행 | 별도 조건식 없음 | JSON.stringify(body, null, 2)<br>call |
| 62행 | 별도 조건식 없음 | document.createElement('a')<br>call |
| 65행 | 별도 조건식 없음 | document.body.appendChild(anchor)<br>call |
| 66행 | 별도 조건식 없음 | anchor.click()<br>call |
| 67행 | 별도 조건식 없음 | anchor.remove()<br>call |
| 69행 | 별도 조건식 없음 | setTimeout(() => URL.revokeObjectURL(retained), 1000)<br>state-update<br>전달 콜백: H-7b6fd28edb40 |
| 70행 | 별도 조건식 없음 | setNotice('측정값 파일을 내려받도록 요청했습니다.')<br>state-update |
| 72행 | exception: exception ∧ truthy: url | URL.revokeObjectURL(url)<br>call |
| 73행 | exception: exception | setNotice('파일을 만들지 못했습니다. 측정값은 이 창에 남아 있습니다.')<br>state-update |

## H-7b6fd28edb40

**@callback:setTimeout** · [src/ui/ui-performance-panel.tsx:69](../../../src/ui/ui-performance-panel.tsx#L69)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 69행 | 별도 조건식 없음 | URL.revokeObjectURL(retained)<br>call |

## H-12b654f53e85

**@callback:UI_MEASURE_PHASES.map** · [src/ui/ui-performance-panel.tsx:88](../../../src/ui/ui-performance-panel.tsx#L88)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 91행 | 별도 조건식 없음 | summarize(samples.filter((row) => row.phase === phase))<br>call → [H-3b7dafc188bd](ui__ui-performance-panel.md#h-3b7dafc188bd) |
| 91행 | 별도 조건식 없음 | samples.filter((row) => row.phase === phase)<br>call<br>전달 콜백: H-dc7ec18325f4 |

## H-dc7ec18325f4

**@callback:samples.filter** · [src/ui/ui-performance-panel.tsx:91](../../../src/ui/ui-performance-panel.tsx#L91)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c7bd4129129c

**@callback:Object.entries(requestNames).map** · [src/ui/ui-performance-panel.tsx:98](../../../src/ui/ui-performance-panel.tsx#L98)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 101행 | 별도 조건식 없음 | summarize(requests.filter((row) => row.phase === phase))<br>call → [H-3b7dafc188bd](ui__ui-performance-panel.md#h-3b7dafc188bd) |
| 101행 | 별도 조건식 없음 | requests.filter((row) => row.phase === phase)<br>call<br>전달 콜백: H-2f270a087b74 |

## H-2f270a087b74

**@callback:requests.filter** · [src/ui/ui-performance-panel.tsx:101](../../../src/ui/ui-performance-panel.tsx#L101)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-dafb838e222e

**@onClick** · [src/ui/ui-performance-panel.tsx:111](../../../src/ui/ui-performance-panel.tsx#L111)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 112행 | 별도 조건식 없음 | clearUiPerformance()<br>call |
| 113행 | 별도 조건식 없음 | clearRequestPerformance()<br>call |
| 114행 | 별도 조건식 없음 | setRequests([])<br>state-update |
| 115행 | 별도 조건식 없음 | setNotice('측정값만 비웠습니다. 공부 기록은 유지됩니다.')<br>state-update |

