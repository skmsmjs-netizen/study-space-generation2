# src/ui/ink-drawing.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-798636073a76

**InkStroke** · [src/ui/ink-drawing.tsx:12](../../../src/ui/ink-drawing.tsx#L12)

분기 조건과 가능한 갈림길:

- B-7c0fc4c27dd3 · ConditionalExpression · stroke.pressureSensitive → truthy / falsy; 바깥 조건: 별도 조건식 없음 (17행).
- B-5aaf399dec47 · ConditionalExpression · stroke.pressureSensitive → truthy / falsy; 바깥 조건: 별도 조건식 없음 (18행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 13행 | 별도 조건식 없음 | useMemo(() => inkShape(stroke), [stroke])<br>call<br>전달 콜백: H-27cb9bcca942 |

반환/조기 중단: 14행 <render> [별도 조건식 없음]

## H-27cb9bcca942

**@callback:useMemo** · [src/ui/ink-drawing.tsx:13](../../../src/ui/ink-drawing.tsx#L13)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 13행 | 별도 조건식 없음 | inkShape(stroke)<br>call |

## H-fbfbc775f859

**InkDrawing** · [src/ui/ink-drawing.tsx:25](../../../src/ui/ink-drawing.tsx#L25)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 28행 | 별도 조건식 없음 | strokes<br>        .filter((s) => strokePage(s) === page)<br>        .map((s) => ( <InkStroke key={s.id} stroke={s} /> ))<br>call<br>전달 콜백: H-25b94b2e98b3 |
| 28행 | 별도 조건식 없음 | strokes<br>        .filter((s) => strokePage(s) === page)<br>call<br>전달 콜백: H-ac6155612768 |

반환/조기 중단: 26행 <render> [별도 조건식 없음]

## H-ac6155612768

**@callback:strokes
        .filter** · [src/ui/ink-drawing.tsx:29](../../../src/ui/ink-drawing.tsx#L29)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 29행 | 별도 조건식 없음 | strokePage(s)<br>call |

## H-25b94b2e98b3

**@callback:strokes
        .filter((s) => strokePage(s) === page)
        .map** · [src/ui/ink-drawing.tsx:30](../../../src/ui/ink-drawing.tsx#L30)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-cb896ab22abd

**InkPreview** · [src/ui/ink-drawing.tsx:37](../../../src/ui/ink-drawing.tsx#L37)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 46행 | 별도 조건식 없음 | useMemo(() => [...new Set(strokes.map(strokePage))].sort((a, b) => a - b), [strokes])<br>call<br>전달 콜백: H-22135a39526e |
| 52행 | 별도 조건식 없음 | pages.map((page) => ( <svg key={page} className={className} viewBox={`0 0 ${MEMO_WIDTH} ${MEMO_HEIGHT}`} role="img" aria-label={inkPageCount(strokes) > 1 ? `${label} · ${page + 1}쪽` : label} > <InkDrawing strokes={strokes} page={page} /> </svg> ))<br>call<br>전달 콜백: H-318c80cde13b |

반환/조기 중단: 50행 <render> [별도 조건식 없음]

## H-22135a39526e

**@callback:useMemo** · [src/ui/ink-drawing.tsx:47](../../../src/ui/ink-drawing.tsx#L47)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 47행 | 별도 조건식 없음 | [...new Set(strokes.map(strokePage))].sort((a, b) => a - b)<br>call<br>전달 콜백: H-bb5e5f53ef6a |
| 47행 | 별도 조건식 없음 | strokes.map(strokePage)<br>call |

## H-bb5e5f53ef6a

**@callback:[...new Set(strokes.map(strokePage))].sort** · [src/ui/ink-drawing.tsx:47](../../../src/ui/ink-drawing.tsx#L47)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-318c80cde13b

**@callback:pages.map** · [src/ui/ink-drawing.tsx:52](../../../src/ui/ink-drawing.tsx#L52)

분기 조건과 가능한 갈림길:

- B-77c8b2558631 · ConditionalExpression · inkPageCount(strokes) > 1 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (58행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 58행 | 별도 조건식 없음 | inkPageCount(strokes)<br>call |

