# src/ui/statistics-trend.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-08014f0b6589

**StatisticsTrend** · [src/ui/statistics-trend.tsx:4](../../../src/ui/statistics-trend.tsx#L4)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 5행 | 별도 조건식 없음 | Math.round((Date.parse(to) - Date.parse(from)) / 86400000)<br>call |
| 5행 | 별도 조건식 없음 | Date.parse(to)<br>call |
| 5행 | 별도 조건식 없음 | Date.parse(from)<br>call |
| 6행 | 별도 조건식 없음 | Math.max(1, Math.ceil(days / 14))<br>call |
| 6행 | 별도 조건식 없음 | Math.ceil(days / 14)<br>call |
| 7행 | 별도 조건식 없음 | metric.items.filter(item => item.date.kind === 'exact')<br>call<br>전달 콜백: H-2cc9b047604b |
| 8행 | 별도 조건식 없음 | Array.from({ length: Math.ceil(days / step) }, (_, i) => statisticBounds( exact, shiftDay(from, i * step), shiftDay(from, Math.min(days - 1, (i + 1) * step - 1)), ).lower)<br>call<br>전달 콜백: H-9aafd2e95640 |
| 8행 | 별도 조건식 없음 | Math.ceil(days / step)<br>call |
| 11행 | 별도 조건식 없음 | values.map((value, i) => ({value, day: shiftDay(from, i * step)}))<br>call<br>전달 콜백: H-bd4024969894 |
| 12행 | 별도 조건식 없음 | Math.max(1, ...values)<br>call |
| 15행 | 별도 조건식 없음 | bins.map(({value, day}, i) => <rect key={day} className="current-bar" x={i * width + width * .15} y={54 - value / maximum * 48} width={width * .7} height={value / maximum * 48} />)<br>call<br>전달 콜백: H-8144d48df204 |

반환/조기 중단: 13행 <render> [별도 조건식 없음]

## H-2cc9b047604b

**@callback:metric.items.filter** · [src/ui/statistics-trend.tsx:7](../../../src/ui/statistics-trend.tsx#L7)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-9aafd2e95640

**@callback:Array.from** · [src/ui/statistics-trend.tsx:8](../../../src/ui/statistics-trend.tsx#L8)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 8행 | 별도 조건식 없음 | statisticBounds(exact, shiftDay(from, i * step), shiftDay(from, Math.min(days - 1, (i + 1) * step - 1)))<br>call |
| 9행 | 별도 조건식 없음 | shiftDay(from, i * step)<br>call |
| 9행 | 별도 조건식 없음 | shiftDay(from, Math.min(days - 1, (i + 1) * step - 1))<br>call |
| 9행 | 별도 조건식 없음 | Math.min(days - 1, (i + 1) * step - 1)<br>call |

## H-bd4024969894

**@callback:values.map** · [src/ui/statistics-trend.tsx:11](../../../src/ui/statistics-trend.tsx#L11)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 11행 | 별도 조건식 없음 | shiftDay(from, i * step)<br>call |

## H-8144d48df204

**@callback:bins.map** · [src/ui/statistics-trend.tsx:15](../../../src/ui/statistics-trend.tsx#L15)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

