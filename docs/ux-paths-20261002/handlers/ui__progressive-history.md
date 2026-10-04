# src/ui/progressive-history.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-40c83ccd4e5a

**ProgressiveHistory** · [src/ui/progressive-history.tsx:17](../../../src/ui/progressive-history.tsx#L17)

분기 조건과 가능한 갈림길:

- B-4295c857f81d · IfStatement · !collapsible → truthy / falsy; 바깥 조건: 별도 조건식 없음 (62행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 26행 | 별도 조건식 없음 | useViewContext(data, `${name}:limit`, 40, isViewPage)<br>call |
| 27행 | 별도 조건식 없음 | useViewContext(data, `${name}:open`, false, (value): value is boolean => typeof value === 'boolean')<br>call<br>전달 콜백: H-9fd2141ca833 |
| 33행 | 별도 조건식 없음 | useRef(null)<br>call |
| 35행 | 별도 조건식 없음 | useEffect(() => { if (!measure.current) return; const finish = measure.current; measure.current = null; return finishUiMeasureAfterPaint(finish); }, [limit, open])<br>call<br>전달 콜백: H-342085b38677 |
| 45행 | 별도 조건식 없음 | Math.min(total, Math.max(40, limit))<br>call |
| 45행 | 별도 조건식 없음 | Math.max(40, limit)<br>call |
| 51행 | 별도 조건식 없음 | children(shown)<br>call |

반환/조기 중단: 63행 <render> [truthy: !collapsible]; 68행 <render> [별도 조건식 없음]

## H-9fd2141ca833

**@callback:useViewContext** · [src/ui/progressive-history.tsx:31](../../../src/ui/progressive-history.tsx#L31)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-342085b38677

**@callback:useEffect** · [src/ui/progressive-history.tsx:35](../../../src/ui/progressive-history.tsx#L35)

분기 조건과 가능한 갈림길:

- B-311e2faf9acc · IfStatement · !measure.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (36행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 39행 | 별도 조건식 없음 | finishUiMeasureAfterPaint(finish)<br>call |

반환/조기 중단: 36행 <render> [truthy: !measure.current]; 39행 finishUiMeasureAfterPaint(finish) [별도 조건식 없음]

## H-4c0127979e0e

**expand** · [src/ui/progressive-history.tsx:41](../../../src/ui/progressive-history.tsx#L41)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 42행 | 별도 조건식 없음 | beginUiMeasure('history-render')<br>call |
| 43행 | 별도 조건식 없음 | setLimit(next)<br>state-update |

## H-c51cb6d65c58

**@onClick** · [src/ui/progressive-history.tsx:54](../../../src/ui/progressive-history.tsx#L54)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 54행 | truthy: shown < total | expand(Math.min(total, shown + 40))<br>call → [H-4c0127979e0e](ui__progressive-history.md#h-4c0127979e0e) |
| 54행 | truthy: shown < total | Math.min(total, shown + 40)<br>call |

## H-f5aa5ccceb8b

**@onClick** · [src/ui/progressive-history.tsx:55](../../../src/ui/progressive-history.tsx#L55)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 55행 | truthy: shown < total | expand(total)<br>call → [H-4c0127979e0e](ui__progressive-history.md#h-4c0127979e0e) |

## H-d7c1d0f471b8

**@onToggle** · [src/ui/progressive-history.tsx:72](../../../src/ui/progressive-history.tsx#L72)

분기 조건과 가능한 갈림길:

- B-432f43f807a1 · IfStatement · next !== open → truthy / falsy; 바깥 조건: 별도 조건식 없음 (74행).
- B-dc3d1e2292f5 · IfStatement · next → truthy / falsy; 바깥 조건: truthy: next !== open (75행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 75행 | truthy: next !== open ∧ truthy: next | beginUiMeasure('history-render')<br>call |
| 76행 | truthy: next !== open | setOpen(next)<br>state-update |

