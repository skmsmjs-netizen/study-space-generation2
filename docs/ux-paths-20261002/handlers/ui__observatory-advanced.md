# src/ui/observatory-advanced.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-cecf2c10c555

**ObservatoryAdvanced** · [src/ui/observatory-advanced.tsx:41](../../../src/ui/observatory-advanced.tsx#L41)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 42행 | 별도 조건식 없음 | useRef(null)<br>call |
| 43행 | 별도 조건식 없음 | useRef({ time: 0 })<br>call |
| 44행 | 별도 조건식 없음 | useRef({})<br>call |
| 45행 | 별도 조건식 없음 | useId()<br>call |
| 46행 | 별도 조건식 없음 | useRef(null)<br>call |
| 47행 | 별도 조건식 없음 | useRef({ world, night })<br>call |
| 48행 | 별도 조건식 없음 | useRef(null)<br>call |
| 49행 | 별도 조건식 없음 | useState(typeof IntersectionObserver === 'undefined')<br>call |
| 50행 | 별도 조건식 없음 | useEffect(() => { model.current = { world, night }; connection.current?.update?.(world, night); }, [world, night])<br>call<br>전달 콜백: H-4e21865fa2ef |
| 54행 | 별도 조건식 없음 | useEffect(() => { if (typeof IntersectionObserver === 'undefined') return; const observer = new IntersectionObserver((entries) => setOnScreen(entries[0]?.isIntersecting ?? false), ); const root = group.current?.closest('.study-landscapes'); if (root) observer.observe(root); return () => observer.disconnect(); }, [])<br>call<br>전달 콜백: H-73d64359b33c |
| 63행 | 별도 조건식 없음 | useEffect(() => { const node = canvas.current, root = node?.closest<HTMLElement>('.study-landscapes'); if (!onScreen \|\| !node \|\| !root) return; const control = connectObservatoryGPU( node, root, model.current.world, model.current.night, clock.current, renderState.current, ); connection.current = control; return () => { control(); if (connection.current === control) connection.current = null; }; }, [onScreen])<br>call<br>전달 콜백: H-6558d7abdfc2 |
| 93행 | 별도 조건식 없음 | filaments.map((d, i) => ( <path key={d} d={d} className={i % 3 ? 'obs-flow-thread' : 'obs-flow-thread obs-flow-thread--cool'} opacity={0.07 + 0.22 * growth} /> ))<br>call<br>전달 콜백: H-a29696c17b64 |
| 105행 | 별도 조건식 없음 | grains.map((p, i) => ( <g key={p.key} transform={`translate(${p.x} ${p.y})`} opacity={observatoryParticleOpacity( 5 + 22 * growth + 5 * world.dynamics.recent[0], i, )} > <path d={i % 6 ? 'M0 0h.5v.5H0z' : 'M0 -1.5h.5v1.5H2v.5H.5V2H0V.5h-1.5V0H0z'} className="obs-flow-grain" /> {i % 6 === 0 && ( <path d="M-2 -2h4v4h-4z" className="obs-selective-glow" opacity=".12" /> )} </g> ))<br>call<br>전달 콜백: H-2550a6ea7807 |
| 141행 | 별도 조건식 없음 | resolvedSystems.map((system, index) => ( <g key={system.x} transform={`translate(${system.x} ${system.y})`} opacity={0.24 + 0.52 * growth} data-resolved-system={system.kind} > {system.kind === 'binary' ? ( <> <path d="M-12 0l4-5h16l4 5-4 5H-8z" className="obs-detail-orbit" /> <g className="obs-binary-pair" style={{ animationDelay: `${-index * 2.3}s` }}> <path d="M-9 -2h1v1h1v1h-1v1h-1V0h-1v-1h1M8 0h1v1h1v1H9v1H8V2H7V1h1" className="obs-binary-stars" /> </g> </> ) : system.kind === 'galaxy' ? ( <g className="obs-resolved-galaxy" style={{ animationDelay: `${-index * 4.1}s` }}> <path d={spiralArms} className="obs-galaxy-arm" /> <path d="M-1 -2h2v1h1v2H1v1h-2V1h-1v-2h1z" className="obs-galaxy-core" /> </g> ) : ( <g … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-e611ff79f0a1 |

반환/조기 중단: 82행 <render> [별도 조건식 없음]

## H-4e21865fa2ef

**@callback:useEffect** · [src/ui/observatory-advanced.tsx:50](../../../src/ui/observatory-advanced.tsx#L50)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-73d64359b33c

**@callback:useEffect** · [src/ui/observatory-advanced.tsx:54](../../../src/ui/observatory-advanced.tsx#L54)

분기 조건과 가능한 갈림길:

- B-490ed7c3c3bf · IfStatement · typeof IntersectionObserver === 'undefined' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (55행).
- B-568476dfd55f · IfStatement · root → truthy / falsy; 바깥 조건: 별도 조건식 없음 (60행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 60행 | truthy: root | observer.observe(root)<br>call |

반환/조기 중단: 55행 <render> [truthy: typeof IntersectionObserver === 'undefined']; 61행 () => observer.disconnect() [별도 조건식 없음]

## H-6558d7abdfc2

**@callback:useEffect** · [src/ui/observatory-advanced.tsx:63](../../../src/ui/observatory-advanced.tsx#L63)

분기 조건과 가능한 갈림길:

- B-5927a81ab3ae · IfStatement · !onScreen || !node || !root → truthy / falsy; 바깥 조건: 별도 조건식 없음 (66행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 67행 | 별도 조건식 없음 | connectObservatoryGPU(node, root, model.current.world, model.current.night, clock.current, renderState.current)<br>call |

반환/조기 중단: 66행 <render> [truthy: !onScreen || !node || !root]; 76행 () => { control(); if (connection.current === control) connection.current = null; } [별도 조건식 없음]

## H-a29696c17b64

**@callback:filaments.map** · [src/ui/observatory-advanced.tsx:93](../../../src/ui/observatory-advanced.tsx#L93)

분기 조건과 가능한 갈림길:

- B-42ad97b8482d · ConditionalExpression · i % 3 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (97행).

## H-2550a6ea7807

**@callback:grains.map** · [src/ui/observatory-advanced.tsx:105](../../../src/ui/observatory-advanced.tsx#L105)

분기 조건과 가능한 갈림길:

- B-6a553325a309 · ConditionalExpression · i % 6 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (115행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 109행 | 별도 조건식 없음 | observatoryParticleOpacity(5 + 22 * growth + 5 * world.dynamics.recent[0], i)<br>call |

## H-e611ff79f0a1

**@callback:resolvedSystems.map** · [src/ui/observatory-advanced.tsx:141](../../../src/ui/observatory-advanced.tsx#L141)

분기 조건과 가능한 갈림길:

- B-ceee7d914021 · ConditionalExpression · system.kind === 'binary' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (148행).
- B-2e1419bf1b14 · ConditionalExpression · system.kind === 'galaxy' → truthy / falsy; 바깥 조건: falsy: system.kind === 'binary' (158행).

