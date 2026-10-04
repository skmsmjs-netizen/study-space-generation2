# src/ui/observatory-place-art.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-11ba782fc839

**Book** · [src/ui/observatory-place-art.tsx:8](../../../src/ui/observatory-place-art.tsx#L8)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 30행 | 별도 조건식 없음 | Math.max(2, w - 6)<br>call |
| 30행 | 별도 조건식 없음 | Math.max(2, w - 6)<br>call |
| 35행 | 별도 조건식 없음 | Math.floor(h * 0.37)<br>call |
| 35행 | 별도 조건식 없음 | Math.max(2, w - 6)<br>call |
| 35행 | 별도 조건식 없음 | Math.max(4, Math.floor(h * 0.12))<br>call |
| 35행 | 별도 조건식 없음 | Math.floor(h * 0.12)<br>call |

반환/조기 중단: 21행 <render> [별도 조건식 없음]

## H-1cfe488a4cee

**PaperStack** · [src/ui/observatory-place-art.tsx:43](../../../src/ui/observatory-place-art.tsx#L43)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 52행 | 별도 조건식 없음 | Math.floor(width * 0.64)<br>call |

반환/조기 중단: 44행 <render> [별도 조건식 없음]

## H-565f409c85e5

**RoomBase** · [src/ui/observatory-place-art.tsx:57](../../../src/ui/observatory-place-art.tsx#L57)

분기 조건과 가능한 갈림길:

- B-78c428665525 · ConditionalExpression · place === 'left' → truthy / falsy; 바깥 조건: truthy: place !== 'back' (77행).

반환/조기 중단: 58행 <render> [별도 조건식 없음]

## H-5b601dfdeef9

**Bookshelf** · [src/ui/observatory-place-art.tsx:91](../../../src/ui/observatory-place-art.tsx#L91)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 132행 | 별도 조건식 없음 | books.map(([x, y, w, h, tone]) => ( <Book key={`${x}:${y}`} x={x} y={y} w={w} h={h} tone={tone} /> ))<br>call<br>전달 콜백: H-cd9c68a4d174 |

반환/조기 중단: 119행 <render> [별도 조건식 없음]

## H-cd9c68a4d174

**@callback:books.map** · [src/ui/observatory-place-art.tsx:132](../../../src/ui/observatory-place-art.tsx#L132)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-40147445e238

**PlanningWall** · [src/ui/observatory-place-art.tsx:192](../../../src/ui/observatory-place-art.tsx#L192)


반환/조기 중단: 193행 <render> [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d88333b4b514

**ResearchBench** · [src/ui/observatory-place-art.tsx:287](../../../src/ui/observatory-place-art.tsx#L287)


반환/조기 중단: 288행 <render> [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-cca3b81c6b97

**Ceiling** · [src/ui/observatory-place-art.tsx:381](../../../src/ui/observatory-place-art.tsx#L381)


반환/조기 중단: 382행 <render> [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-27ba426bcbca

**ObservatoryPlaceArt** · [src/ui/observatory-place-art.tsx:472](../../../src/ui/observatory-place-art.tsx#L472)

분기 조건과 가능한 갈림길:

- B-6457c25b215c · ConditionalExpression · place === 'ceiling' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (497행).
- B-af32a7eb7a70 · ConditionalExpression · place === 'left' → truthy / falsy; 바깥 조건: falsy: place === 'ceiling' (499행).
- B-f36ef6622649 · ConditionalExpression · place === 'back' → truthy / falsy; 바깥 조건: falsy: place === 'ceiling' ∧ falsy: place === 'left' (501행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 473행 | 별도 조건식 없음 | useId()<br>call |

반환/조기 중단: 474행 <render> [별도 조건식 없음]

