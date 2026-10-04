# src/ui/math-formula.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-7a4174cdf5d3

**MathFormula** · [src/ui/math-formula.tsx:8](../../../src/ui/math-formula.tsx#L8)

분기 조건과 가능한 갈림길:

- B-e235ceff9bf0 · ConditionalExpression · inline → truthy / falsy; 바깥 조건: 별도 조건식 없음 (43행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 17행 | 별도 조건식 없음 | useRef(null)<br>call |
| 18행 | 별도 조건식 없음 | useLayoutEffect(() => { if (host.current) { if (inline) katex.render(tex, host.current, { displayMode: !inline, throwOnError: false, trust: false, maxExpand: 1000, }); else host.current.replaceChildren( ...equationLines(tex).map((line) => { const row = document.createElement('div'); row.className = 'math-equation-row'; katex.render(line, row, { displayMode: true, throwOnError: false, trust: false, maxExpand: 1000, }); return row; }), ); } }, [tex, inline])<br>call<br>전달 콜백: H-0b2a4885ff50 |

반환/조기 중단: 43행 inline ? ( <span className="reasoning-inline-math" ref={host} /> ) : ( <section className="math-equation" ref={host} aria-label={label + ' · 가로로 이동해 전체 보기'} tabIndex={0} /> ) [별도 조건식 없음]

## H-0b2a4885ff50

**@callback:useLayoutEffect** · [src/ui/math-formula.tsx:18](../../../src/ui/math-formula.tsx#L18)

분기 조건과 가능한 갈림길:

- B-9ea0c18e9b21 · IfStatement · host.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (19행).
- B-acf4e58c1034 · IfStatement · inline → truthy / falsy; 바깥 조건: truthy: host.current (20행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 21행 | truthy: host.current ∧ truthy: inline | katex.render(tex, host.current, { displayMode: !inline, throwOnError: false, trust: false, maxExpand: 1000, })<br>call |
| 28행 | truthy: host.current ∧ falsy: inline | host.current.replaceChildren(...equationLines(tex).map((line) => { const row = document.createElement('div'); row.className = 'math-equation-row'; katex.render(line, row, { displayMode: true, throwOnError: false, trust: false, maxExpand: 1000, }); return row; }))<br>call |
| 29행 | truthy: host.current ∧ falsy: inline | equationLines(tex).map((line) => { const row = document.createElement('div'); row.className = 'math-equation-row'; katex.render(line, row, { displayMode: true, throwOnError: false, trust: false, maxExpand: 1000, }); return row; })<br>call<br>전달 콜백: H-6b5523a30337 |
| 29행 | truthy: host.current ∧ falsy: inline | equationLines(tex)<br>call |

## H-6b5523a30337

**@callback:equationLines(tex).map** · [src/ui/math-formula.tsx:29](../../../src/ui/math-formula.tsx#L29)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 30행 | truthy: host.current ∧ falsy: inline | document.createElement('div')<br>call |
| 32행 | truthy: host.current ∧ falsy: inline | katex.render(line, row, { displayMode: true, throwOnError: false, trust: false, maxExpand: 1000, })<br>call |

반환/조기 중단: 38행 row [truthy: host.current ∧ falsy: inline]

