# src/ui/month-summary.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-b53ff2812c88

**amount** · [src/ui/month-summary.tsx:11](../../../src/ui/month-summary.tsx#L11)

분기 조건과 가능한 갈림길:

- B-bea0e6d9c109 · ConditionalExpression · upper === null → truthy / falsy; 바깥 조건: 별도 조건식 없음 (11행).
- B-8dc301b9fa35 · ConditionalExpression · lower === upper → truthy / falsy; 바깥 조건: falsy: upper === null (11행).

## H-6a3c1118c523

**MonthSummary** · [src/ui/month-summary.tsx:13](../../../src/ui/month-summary.tsx#L13)

분기 조건과 가능한 갈림길:

- B-94e8fea16700 · ConditionalExpression · compact → truthy / falsy; 바깥 조건: 별도 조건식 없음 (20행).
- B-765fd68fe8a8 · ConditionalExpression · compact → truthy / falsy; 바깥 조건: 별도 조건식 없음 (20행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 18행 | 별도 조건식 없음 | new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' }).slice(0, 7)<br>call |
| 18행 | 별도 조건식 없음 | new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' })<br>call |
| 19행 | 별도 조건식 없음 | useState(() => readStatisticsMonth(data, currentMonth))<br>call<br>전달 콜백: H-2c3ce9809f25 |
| 20행 | 별도 조건식 없음 | useState(compact ? currentMonth : boot.month)<br>call |
| 20행 | 별도 조건식 없음 | useState(compact ? '' : boot.error)<br>call |
| 21행 | 별도 조건식 없음 | useMemo(() => calendarMonth(month), [month])<br>call<br>전달 콜백: H-2df942a99ce7 |
| 21행 | 별도 조건식 없음 | calendarMonth(shiftMonth(month, -1))<br>call |
| 21행 | 별도 조건식 없음 | shiftMonth(month, -1)<br>call |
| 22행 | 별도 조건식 없음 | useMemo(() => statistics(data, workspace, { ...period, subjectIds, subjectId, nodeId }, new Date().toISOString()), [data, workspace, period, subjectIds, subjectId, nodeId])<br>call<br>전달 콜백: H-f98154fd694b |
| 36행 | 별도 조건식 없음 | metrics.filter(m => !compact \|\| ['sessions', 'coverage'].includes(m.id)).map(m => { const b = statisticBounds(m, period.from, period.to), prev = statisticBounds(m, previous.from, previous.to); const missing = unavailable && ['attempts', 'successes', 'corrections'].includes(m.id); return <button type="button" key={m.id} className="statistics-metric" aria-label={`${month} ${shortLabels[m.id]} 원기록 보기`} disabled={Boolean(missing)} onClick={() => open(m)}> <span>{m.label}</span><strong>{missing ? '확인 불가' : amount(b.lower, b.upper)}</strong><small>{m.unit}{b.undated ? ` · 날짜 미정 ${b.undated}건 별도` : ''}</small> {!compact && !missing && <><StatisticsTrend metric={m} from={period.from} to={period.to} /><small>이전 달 {amount(prev.lower, prev.upper)} · 원기록 보기</small></>} </button> … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-9fe3a2f72cd8 |
| 36행 | 별도 조건식 없음 | metrics.filter(m => !compact \|\| ['sessions', 'coverage'].includes(m.id))<br>call<br>전달 콜백: H-f3b512949399 |

반환/조기 중단: 31행 <render> [별도 조건식 없음]

## H-2c3ce9809f25

**@callback:useState** · [src/ui/month-summary.tsx:19](../../../src/ui/month-summary.tsx#L19)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 19행 | 별도 조건식 없음 | readStatisticsMonth(data, currentMonth)<br>call |

## H-2df942a99ce7

**@callback:useMemo** · [src/ui/month-summary.tsx:21](../../../src/ui/month-summary.tsx#L21)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 21행 | 별도 조건식 없음 | calendarMonth(month)<br>call |

## H-f98154fd694b

**@callback:useMemo** · [src/ui/month-summary.tsx:22](../../../src/ui/month-summary.tsx#L22)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 22행 | 별도 조건식 없음 | statistics(data, workspace, { ...period, subjectIds, subjectId, nodeId }, new Date().toISOString())<br>call |
| 22행 | 별도 조건식 없음 | new Date().toISOString()<br>call |

## H-a51640c45b0f

**choose** · [src/ui/month-summary.tsx:23](../../../src/ui/month-summary.tsx#L23)

분기 조건과 가능한 갈림길:

- B-558a7dcfca5c · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (24행).
- B-cc63a27efe91 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (25행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 24행 | 별도 조건식 없음 | calendarMonth(value)<br>call |
| 24행 | 별도 조건식 없음 | setMonth(value)<br>state-update |
| 24행 | 별도 조건식 없음 | saveStatisticsMonth(data, value)<br>call |
| 24행 | 별도 조건식 없음 | setError('')<br>state-update |
| 25행 | exception: exception | setError('월 선택을 저장하지 못했습니다. 화면의 선택과 공부 기록은 유지했습니다. 월을 다시 선택해 주세요.')<br>state-update |

## H-58da24c3ca84

**open** · [src/ui/month-summary.tsx:27](../../../src/ui/month-summary.tsx#L27)

분기 조건과 가능한 갈림길:

- B-3ef4d28b830a · IfStatement · compact → truthy / falsy; 바깥 조건: 별도 조건식 없음 (28행).
- B-a55670dacc19 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: compact (28행).
- B-484617f0a7ab · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: compact (28행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 28행 | truthy: compact | saveStatisticsMonth(data, month)<br>call |
| 29행 | 별도 조건식 없음 | statisticBounds(metric, period.from, period.to)<br>call |

반환/조기 중단: 28행 <render> [truthy: compact]

## H-f00eedd8eb4f

**@onClick** · [src/ui/month-summary.tsx:33](../../../src/ui/month-summary.tsx#L33)

분기 조건과 가능한 갈림길:

- B-bf0c232e7acd · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: compact (33행).
- B-83dc43597706 · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: compact (33행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 33행 | truthy: compact | saveStatisticsMonth(data, month)<br>call |

## H-757dc29d90f1

**@onClick** · [src/ui/month-summary.tsx:34](../../../src/ui/month-summary.tsx#L34)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 34행 | truthy: !compact | choose(shiftMonth(month, -1))<br>call → [H-a51640c45b0f](ui__month-summary.md#h-a51640c45b0f) |
| 34행 | truthy: !compact | shiftMonth(month, -1)<br>call |

## H-7b61d4005466

**@onChange** · [src/ui/month-summary.tsx:34](../../../src/ui/month-summary.tsx#L34)

분기 조건과 가능한 갈림길:

- B-6be75a9194e7 · IfStatement · e.target.value → truthy / falsy; 바깥 조건: truthy: !compact (34행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 34행 | truthy: !compact ∧ truthy: e.target.value | choose(e.target.value)<br>call → [H-a51640c45b0f](ui__month-summary.md#h-a51640c45b0f) |

## H-7f534600e4e7

**@onClick** · [src/ui/month-summary.tsx:34](../../../src/ui/month-summary.tsx#L34)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 34행 | truthy: !compact | choose(shiftMonth(month, 1))<br>call → [H-a51640c45b0f](ui__month-summary.md#h-a51640c45b0f) |
| 34행 | truthy: !compact | shiftMonth(month, 1)<br>call |

## H-d2ddab5570e1

**@onClick** · [src/ui/month-summary.tsx:34](../../../src/ui/month-summary.tsx#L34)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 34행 | truthy: !compact | choose(currentMonth)<br>call → [H-a51640c45b0f](ui__month-summary.md#h-a51640c45b0f) |

## H-f3b512949399

**@callback:metrics.filter** · [src/ui/month-summary.tsx:36](../../../src/ui/month-summary.tsx#L36)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 36행 | falsy: !compact | ['sessions', 'coverage'].includes(m.id)<br>call |

## H-9fe3a2f72cd8

**@callback:metrics.filter(m => !compact || ['sessions', 'coverage'].includes(m.id)).map** · [src/ui/month-summary.tsx:36](../../../src/ui/month-summary.tsx#L36)

분기 조건과 가능한 갈림길:

- B-af798371af0a · ConditionalExpression · missing → truthy / falsy; 바깥 조건: 별도 조건식 없음 (40행).
- B-d65a3e89fdad · ConditionalExpression · b.undated → truthy / falsy; 바깥 조건: 별도 조건식 없음 (40행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 37행 | 별도 조건식 없음 | statisticBounds(m, period.from, period.to)<br>call |
| 37행 | 별도 조건식 없음 | statisticBounds(m, previous.from, previous.to)<br>call |
| 38행 | truthy: unavailable | ['attempts', 'successes', 'corrections'].includes(m.id)<br>call |
| 39행 | 별도 조건식 없음 | Boolean(missing)<br>call |
| 40행 | falsy: missing | amount(b.lower, b.upper)<br>call → [H-b53ff2812c88](ui__month-summary.md#h-b53ff2812c88) |
| 41행 | truthy: !compact && !missing | amount(prev.lower, prev.upper)<br>call → [H-b53ff2812c88](ui__month-summary.md#h-b53ff2812c88) |

반환/조기 중단: 39행 <render> [별도 조건식 없음]

## H-7b60c57aa771

**@onClick** · [src/ui/month-summary.tsx:39](../../../src/ui/month-summary.tsx#L39)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 39행 | 별도 조건식 없음 | open(m)<br>call → [H-58da24c3ca84](ui__month-summary.md#h-58da24c3ca84) |

