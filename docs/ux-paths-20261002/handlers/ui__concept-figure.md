# src/ui/concept-figure.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-a9e32a84f893

**FigureLabelParts** · [src/ui/concept-figure.tsx:21](../../../src/ui/concept-figure.tsx#L21)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 22행 | 별도 조건식 없음 | conceptTextParts(text).map((part, index) => { if (!part.tex) return <tspan key={index}>{part.text}</tspan>; // The shared tokenizer only emits short notation fragments, not arbitrary TeX. // Preserve the exact source characters; shift only explicitly indexed parts. const indexed = /^(?:[a-z][0-9]+\|σ[A-Za-z][0-9]*\|Tc\|Th\|mf\|m0\|ve)$/.test(part.text); const chemical = /^(?:H2O\|H2O2\|CO2\|O2\|CH4)$/.test(part.text); const italic = /^[a-z]$/.test(part.tex) \|\| /^[α-ωΑ-Ω]/.test(part.text); return <tspan className="concept-figure-math-token" fontStyle={italic ? 'italic' : 'normal'} key={index}> {indexed ? <><tspan>{part.text[0]}</tspan><tspan baselineShift="sub" fontSize="75%">{part.text.slice(1)}</tspan></> : chemical ? part.tex … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-034b78757dd1 |
| 22행 | 별도 조건식 없음 | conceptTextParts(text)<br>call → [H-408668d563a3](ui__concept-text.md#h-408668d563a3) |

반환/조기 중단: 22행 <render> [별도 조건식 없음]

## H-034b78757dd1

**@callback:conceptTextParts(text).map** · [src/ui/concept-figure.tsx:22](../../../src/ui/concept-figure.tsx#L22)

분기 조건과 가능한 갈림길:

- B-951717cf2b7f · IfStatement · !part.tex → truthy / falsy; 바깥 조건: 별도 조건식 없음 (23행).
- B-91b2546a522c · ConditionalExpression · italic → truthy / falsy; 바깥 조건: 별도 조건식 없음 (29행).
- B-9aa6b0e5c063 · ConditionalExpression · indexed → truthy / falsy; 바깥 조건: 별도 조건식 없음 (30행).
- B-a6c26eaef364 · ConditionalExpression · chemical → truthy / falsy; 바깥 조건: falsy: indexed (31행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 26행 | 별도 조건식 없음 | /^(?:[a-z][0-9]+\|σ[A-Za-z][0-9]*\|Tc\|Th\|mf\|m0\|ve)$/.test(part.text)<br>call |
| 27행 | 별도 조건식 없음 | /^(?:H2O\|H2O2\|CO2\|O2\|CH4)$/.test(part.text)<br>call |
| 28행 | 별도 조건식 없음 | /^[a-z]$/.test(part.tex)<br>call |
| 28행 | falsy: /^[a-z]$/.test(part.tex) | /^[α-ωΑ-Ω]/.test(part.text)<br>call |
| 30행 | truthy: indexed | part.text.slice(1)<br>call |
| 31행 | falsy: indexed ∧ truthy: chemical | part.text.split(/([0-9]+)/).map((piece, i) => <tspan baselineShift={/^[0-9]+$/.test(piece) ? 'sub' : undefined} fontSize={/^[0-9]+$/.test(piece) ? '75%' : undefined} key={i}>{piece}</tspan>)<br>call<br>전달 콜백: H-117de2c26fcc |
| 31행 | falsy: indexed ∧ truthy: chemical | part.text.split(/([0-9]+)/)<br>call |

반환/조기 중단: 23행 <render> [truthy: !part.tex]; 29행 <render> [별도 조건식 없음]

## H-117de2c26fcc

**@callback:part.text.split(/([0-9]+)/).map** · [src/ui/concept-figure.tsx:31](../../../src/ui/concept-figure.tsx#L31)

분기 조건과 가능한 갈림길:

- B-495dc017ae6c · ConditionalExpression · /^[0-9]+$/.test(piece) → truthy / falsy; 바깥 조건: falsy: indexed ∧ truthy: chemical (31행).
- B-61637b66bd76 · ConditionalExpression · /^[0-9]+$/.test(piece) → truthy / falsy; 바깥 조건: falsy: indexed ∧ truthy: chemical (31행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 31행 | falsy: indexed ∧ truthy: chemical | /^[0-9]+$/.test(piece)<br>call |
| 31행 | falsy: indexed ∧ truthy: chemical | /^[0-9]+$/.test(piece)<br>call |

## H-aac302b63144

**FigureSvg** · [src/ui/concept-figure.tsx:36](../../../src/ui/concept-figure.tsx#L36)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 37행 | 별도 조건식 없음 | useId()<br>call |
| 38행 | 별도 조건식 없음 | useId()<br>call |
| 42행 | 별도 조건식 없음 | figure.viewBox.join(' ')<br>call |
| 48행 | 별도 조건식 없음 | figure.marks.map((mark) => { const props = { 'data-tone': mark.tone }; if (mark.kind === 'circle') return ( <circle key={mark.id} {...props} cx={mark.center[0]} cy={mark.center[1]} r={mark.radius} /> ); if (mark.kind === 'text') return ( <text key={mark.id} {...props} data-concept-text={mark.text} x={mark.at[0]} y={mark.at[1]} textAnchor={mark.anchor}> <FigureLabelParts text={mark.text} /> </text> ); const points = mark.points.map((point) => point.join(',')).join(' '); return mark.kind === 'polygon' ? ( <polygon key={mark.id} {...props} points={points} /> ) : ( <polyline key={mark.id} {...props} points={points} /> ); })<br>call<br>전달 콜백: H-997079ffd823 |

반환/조기 중단: 39행 <render> [별도 조건식 없음]

## H-997079ffd823

**@callback:figure.marks.map** · [src/ui/concept-figure.tsx:48](../../../src/ui/concept-figure.tsx#L48)

분기 조건과 가능한 갈림길:

- B-f25a6a3c1d92 · IfStatement · mark.kind === 'circle' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (50행).
- B-fa44f795d529 · IfStatement · mark.kind === 'text' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (60행).
- B-df99abb0bc20 · ConditionalExpression · mark.kind === 'polygon' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (67행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 66행 | 별도 조건식 없음 | mark.points.map((point) => point.join(',')).join(' ')<br>call |
| 66행 | 별도 조건식 없음 | mark.points.map((point) => point.join(','))<br>call<br>전달 콜백: H-4a39f008e240 |

반환/조기 중단: 51행 <render> [truthy: mark.kind === 'circle']; 61행 <render> [truthy: mark.kind === 'text']; 67행 mark.kind === 'polygon' ? ( <polygon key={mark.id} {...props} points={points} /> ) : ( <polyline key={mark.id} {...props} points={points} /> ) [별도 조건식 없음]

## H-4a39f008e240

**@callback:mark.points.map** · [src/ui/concept-figure.tsx:66](../../../src/ui/concept-figure.tsx#L66)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 66행 | 별도 조건식 없음 | point.join(',')<br>call |

## H-cc0297213d81

**FigureNodeView** · [src/ui/concept-figure.tsx:78](../../../src/ui/concept-figure.tsx#L78)


반환/조기 중단: 79행 <render> [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-71af010566e8

**validViewport** · [src/ui/concept-figure.tsx:90](../../../src/ui/concept-figure.tsx#L90)

분기 조건과 가능한 갈림길:

- B-8b25e2a97d93 · IfStatement · value === null → truthy / falsy; 바깥 조건: 별도 조건식 없음 (91행).
- B-05c2af1e0f3a · IfStatement · !value || typeof value !== 'object' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (92행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 95행 | 별도 조건식 없음 | [v.x, v.y, v.zoom].every(Number.isFinite)<br>call |
| 96행 | truthy: [v.x, v.y, v.zoom].every(Number.isFinite) | Math.abs(v.x)<br>call |
| 97행 | truthy: [v.x, v.y, v.zoom].every(Number.isFinite) &&<br>    Math.abs(v.x) < 100000 | Math.abs(v.y)<br>call |

반환/조기 중단: 91행 true [truthy: value === null]; 92행 false [truthy: !value || typeof value !== 'object']; 94행 [v.x, v.y, v.zoom].every(Number.isFinite) && Math.abs(v.x) < 100000 && Math.abs(v.y) < 100000 && v.zoom >= 0.1 && v.zoom <= 3 [별도 조건식 없음]

## H-12def375b088

**ConceptFigureView** · [src/ui/concept-figure.tsx:103](../../../src/ui/concept-figure.tsx#L103)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 112행 | 별도 조건식 없음 | useState(false)<br>call |
| 113행 | 별도 조건식 없음 | useViewContext(data, `concept-figure:${viewKey}`, null, validViewport)<br>call<br>전달 콜백: H-71af010566e8 |
| 119행 | 별도 조건식 없음 | useRef(null)<br>call |
| 120행 | 별도 조건식 없음 | useMemo(() => [ { id: 'figure', type: 'figure', position: { x: 0, y: 0 }, data: { figure }, draggable: false, selectable: false, focusable: false, }, ], [figure])<br>call<br>전달 콜백: H-126cc1df2c28 |
| 210행 | truthy: open | figure.marks<br>              .filter((mark) => mark.kind === 'text')<br>              .map((mark) => mark.kind === 'text' && <li key={mark.id} data-concept-text={mark.text}><ConceptText text={mark.text} /></li>)<br>call<br>전달 콜백: H-78bcc6de8878 |
| 210행 | truthy: open | figure.marks<br>              .filter((mark) => mark.kind === 'text')<br>call<br>전달 콜백: H-17004294662e |

반환/조기 중단: 134행 <render> [별도 조건식 없음]

## H-126cc1df2c28

**@callback:useMemo** · [src/ui/concept-figure.tsx:121](../../../src/ui/concept-figure.tsx#L121)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ac53d292207d

**@onClick** · [src/ui/concept-figure.tsx:138](../../../src/ui/concept-figure.tsx#L138)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 138행 | 별도 조건식 없음 | setOpen(true)<br>state-update |

## H-a147f49ad3db

**@onClose** · [src/ui/concept-figure.tsx:144](../../../src/ui/concept-figure.tsx#L144)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 144행 | truthy: open | setOpen(false)<br>state-update |

## H-c6edb892703e

**@onClick** · [src/ui/concept-figure.tsx:148](../../../src/ui/concept-figure.tsx#L148)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7b0b02d72fca

**@onKeyDown** · [src/ui/concept-figure.tsx:158](../../../src/ui/concept-figure.tsx#L158)

분기 조건과 가능한 갈림길:

- B-d778056e3bbb · IfStatement · event.target !== event.currentTarget || !flow.current → truthy / falsy; 바깥 조건: truthy: open (159행).
- B-e0e2eebcd719 · IfStatement · !offset → truthy / falsy; 바깥 조건: truthy: open (167행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 168행 | truthy: open | event.preventDefault()<br>input-control |
| 169행 | truthy: open | flow.current.getViewport()<br>call |
| 170행 | truthy: open | flow.current.setViewport({ ...current, x: current.x + offset[0], y: current.y + offset[1], })<br>call |

반환/조기 중단: 159행 <render> [truthy: open ∧ truthy: event.target !== event.currentTarget || !flow.current]; 167행 <render> [truthy: open ∧ truthy: !offset]

## H-4b98b7d98c2d

**@onInit** · [src/ui/concept-figure.tsx:181](../../../src/ui/concept-figure.tsx#L181)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c6fdf287aa61

**@onMoveEnd** · [src/ui/concept-figure.tsx:184](../../../src/ui/concept-figure.tsx#L184)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 184행 | truthy: open | setViewport(next)<br>state-update |

## H-17004294662e

**@callback:figure.marks
              .filter** · [src/ui/concept-figure.tsx:211](../../../src/ui/concept-figure.tsx#L211)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-78bcc6de8878

**@callback:figure.marks
              .filter((mark) => mark.kind === 'text')
              .map** · [src/ui/concept-figure.tsx:212](../../../src/ui/concept-figure.tsx#L212)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

