# src/ui/api-budget-summary.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-ef7f6b33cbe6

**apiDollars** · [src/ui/api-budget-summary.tsx:4](../../../src/ui/api-budget-summary.tsx#L4)

분기 조건과 가능한 갈림길:

- B-7a064a9037cc · ConditionalExpression · micro > 0 && micro < 100_000 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (4행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 5행 | falsy: micro > 0 && micro < 100_000 | (micro / 1_000_000).toFixed(1)<br>call |

## H-6247979ef7de

**APIBudgetSummary** · [src/ui/api-budget-summary.tsx:8](../../../src/ui/api-budget-summary.tsx#L8)

분기 조건과 가능한 갈림길:

- B-961f662fb729 · ConditionalExpression · remainingPercent > 0 && remainingPercent < 0.1 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (14행).
- B-77e26de471ce · ConditionalExpression · committed > billing.limitMicro → truthy / falsy; 바깥 조건: truthy: committed >= billing.limitMicro (33행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 10행 | 별도 조건식 없음 | Math.max(0, billing.limitMicro - committed)<br>call |
| 11행 | 별도 조건식 없음 | Math.min(100, billing.usedMicro / billing.limitMicro * 100)<br>call |
| 12행 | 별도 조건식 없음 | Math.min(100 - usedShare, billing.pendingMicro / billing.limitMicro * 100)<br>call |
| 14행 | falsy: remainingPercent > 0 && remainingPercent < 0.1 | (Math.floor(remainingPercent * 10) / 10).toFixed(1)<br>call |
| 14행 | falsy: remainingPercent > 0 && remainingPercent < 0.1 | Math.floor(remainingPercent * 10)<br>call |
| 21행 | 별도 조건식 없음 | billing.month.slice(0, 7)<br>call |
| 21행 | 별도 조건식 없음 | apiDollars(billing.limitMicro)<br>call → [H-ef7f6b33cbe6](ui__api-budget-summary.md#h-ef7f6b33cbe6) |
| 23행 | 별도 조건식 없음 | apiDollars(remaining)<br>call → [H-ef7f6b33cbe6](ui__api-budget-summary.md#h-ef7f6b33cbe6) |
| 23행 | 별도 조건식 없음 | apiDollars(billing.usedMicro)<br>call → [H-ef7f6b33cbe6](ui__api-budget-summary.md#h-ef7f6b33cbe6) |
| 23행 | 별도 조건식 없음 | apiDollars(billing.pendingMicro)<br>call → [H-ef7f6b33cbe6](ui__api-budget-summary.md#h-ef7f6b33cbe6) |
| 31행 | 별도 조건식 없음 | rows.map(row => <div key={row.kind}><dt><span className={`api-budget-swatch api-budget-${row.kind}`} aria-hidden="true" />{row.label}</dt><dd>{apiDollars(row.value)}</dd></div>)<br>call<br>전달 콜백: H-a3b70bf50b18 |
| 33행 | truthy: committed >= billing.limitMicro ∧ truthy: committed > billing.limitMicro | apiDollars(committed - billing.limitMicro)<br>call → [H-ef7f6b33cbe6](ui__api-budget-summary.md#h-ef7f6b33cbe6) |

반환/조기 중단: 20행 <render> [별도 조건식 없음]

## H-a3b70bf50b18

**@callback:rows.map** · [src/ui/api-budget-summary.tsx:31](../../../src/ui/api-budget-summary.tsx#L31)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 31행 | 별도 조건식 없음 | apiDollars(row.value)<br>call → [H-ef7f6b33cbe6](ui__api-budget-summary.md#h-ef7f6b33cbe6) |

