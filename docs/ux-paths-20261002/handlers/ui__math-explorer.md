# src/ui/math-explorer.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-0d4a9f7dfbb4

**format** · [src/ui/math-explorer.tsx:46](../../../src/ui/math-explorer.tsx#L46)

분기 조건과 가능한 갈림길:

- B-26e1365c1176 · ConditionalExpression · text === '-0.00' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (48행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 47행 | 별도 조건식 없음 | v.toFixed(2)<br>call |

반환/조기 중단: 48행 text === '-0.00' ? '0.00' : text [별도 조건식 없음]

## H-c358eecd5119

**vec** · [src/ui/math-explorer.tsx:51](../../../src/ui/math-explorer.tsx#L51)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 52행 | 별도 조건식 없음 | Math.max(...v.map(Math.abs))<br>call |
| 52행 | 별도 조건식 없음 | v.map(Math.abs)<br>call |
| 53행 | 별도 조건식 없음 | v.map((component) => format(Math.abs(component) < tolerance ? 0 : component)).join(', ')<br>call |
| 53행 | 별도 조건식 없음 | v.map((component) => format(Math.abs(component) < tolerance ? 0 : component))<br>call<br>전달 콜백: H-8f2d214ca32c |

반환/조기 중단: 53행 `(${v.map((component) => format(Math.abs(component) < tolerance ? 0 : component)).join(', ')})` [별도 조건식 없음]

## H-8f2d214ca32c

**@callback:v.map** · [src/ui/math-explorer.tsx:53](../../../src/ui/math-explorer.tsx#L53)

분기 조건과 가능한 갈림길:

- B-3342e4b85079 · ConditionalExpression · Math.abs(component) < tolerance → truthy / falsy; 바깥 조건: 별도 조건식 없음 (53행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 53행 | 별도 조건식 없음 | format(Math.abs(component) < tolerance ? 0 : component)<br>call → [H-0d4a9f7dfbb4](ui__math-explorer.md#h-0d4a9f7dfbb4) |
| 53행 | 별도 조건식 없음 | Math.abs(component)<br>call |

## H-756ea6514a07

**MathSlider** · [src/ui/math-explorer.tsx:55](../../../src/ui/math-explorer.tsx#L55)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 72행 | 별도 조건식 없음 | useState(format(value))<br>call |
| 72행 | 별도 조건식 없음 | format(value)<br>call → [H-0d4a9f7dfbb4](ui__math-explorer.md#h-0d4a9f7dfbb4) |
| 73행 | 별도 조건식 없음 | useState(false)<br>call |
| 74행 | 별도 조건식 없음 | useState('')<br>call |
| 76행 | 별도 조건식 없음 | useEffect(() => { setText(format(value)); setDirty(false); setError(''); }, [value, resetSignal])<br>call<br>전달 콜백: H-98909a1009f2 |
| 125행 | 별도 조건식 없음 | format(value)<br>call → [H-0d4a9f7dfbb4](ui__math-explorer.md#h-0d4a9f7dfbb4) |
| 139행 | 별도 조건식 없음 | format(min)<br>call → [H-0d4a9f7dfbb4](ui__math-explorer.md#h-0d4a9f7dfbb4) |
| 140행 | 별도 조건식 없음 | format(max)<br>call → [H-0d4a9f7dfbb4](ui__math-explorer.md#h-0d4a9f7dfbb4) |

반환/조기 중단: 94행 <render> [별도 조건식 없음]

## H-98909a1009f2

**@callback:useEffect** · [src/ui/math-explorer.tsx:76](../../../src/ui/math-explorer.tsx#L76)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 77행 | 별도 조건식 없음 | setText(format(value))<br>state-update |
| 77행 | 별도 조건식 없음 | format(value)<br>call → [H-0d4a9f7dfbb4](ui__math-explorer.md#h-0d4a9f7dfbb4) |
| 78행 | 별도 조건식 없음 | setDirty(false)<br>state-update |
| 79행 | 별도 조건식 없음 | setError('')<br>state-update |

## H-89bde559856a

**commit** · [src/ui/math-explorer.tsx:81](../../../src/ui/math-explorer.tsx#L81)

분기 조건과 가능한 갈림길:

- B-511d329a9fa0 · IfStatement · !dirty → truthy / falsy; 바깥 조건: 별도 조건식 없음 (82행).
- B-54e33132f49d · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (83행).
- B-1f44e683abc0 · IfStatement · next === null || next < min || next > max → truthy / falsy; 바깥 조건: 별도 조건식 없음 (85행).
- B-8f6e80bf0f3c · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (90행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 84행 | 별도 조건식 없음 | expression(text).value({})<br>call |
| 84행 | 별도 조건식 없음 | expression(text)<br>call |
| 85행 | truthy: next === null \|\| next < min \|\| next > max | Error('range')<br>call |
| 86행 | 별도 조건식 없음 | onChange(next)<br>call |
| 87행 | 별도 조건식 없음 | setText(format(next))<br>state-update |
| 87행 | 별도 조건식 없음 | format(next)<br>call → [H-0d4a9f7dfbb4](ui__math-explorer.md#h-0d4a9f7dfbb4) |
| 88행 | 별도 조건식 없음 | setDirty(false)<br>state-update |
| 89행 | 별도 조건식 없음 | setError('')<br>state-update |
| 91행 | exception: exception | setError(`${format(min)}부터 ${format(max)} 사이의 값으로 입력해 주세요.`)<br>state-update |
| 91행 | exception: exception | format(min)<br>call → [H-0d4a9f7dfbb4](ui__math-explorer.md#h-0d4a9f7dfbb4) |
| 91행 | exception: exception | format(max)<br>call → [H-0d4a9f7dfbb4](ui__math-explorer.md#h-0d4a9f7dfbb4) |

반환/조기 중단: 82행 <render> [truthy: !dirty]

throw: 85행 Error('range')

## H-bae71eea8302

**@onChange** · [src/ui/math-explorer.tsx:103](../../../src/ui/math-explorer.tsx#L103)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 104행 | 별도 조건식 없음 | setText(event.target.value)<br>state-update |
| 105행 | 별도 조건식 없음 | setDirty(true)<br>state-update |
| 106행 | 별도 조건식 없음 | setError('')<br>state-update |

## H-a23b918213b1

**@onKeyDown** · [src/ui/math-explorer.tsx:109](../../../src/ui/math-explorer.tsx#L109)

분기 조건과 가능한 갈림길:

- B-f73c0af60e28 · IfStatement · event.key === 'Enter' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (110행).
- B-0a55b5c95133 · IfStatement · event.key === 'Escape' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (114행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 111행 | truthy: event.key === 'Enter' | event.preventDefault()<br>input-control |
| 112행 | truthy: event.key === 'Enter' | commit()<br>mutation-request → [H-89bde559856a](ui__math-explorer.md#h-89bde559856a) |
| 115행 | truthy: event.key === 'Escape' | setText(format(value))<br>state-update |
| 115행 | truthy: event.key === 'Escape' | format(value)<br>call → [H-0d4a9f7dfbb4](ui__math-explorer.md#h-0d4a9f7dfbb4) |
| 116행 | truthy: event.key === 'Escape' | setDirty(false)<br>state-update |
| 117행 | truthy: event.key === 'Escape' | setError('')<br>state-update |

## H-4e70003f9871

**@onChange** · [src/ui/math-explorer.tsx:131](../../../src/ui/math-explorer.tsx#L131)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 132행 | 별도 조건식 없음 | setDirty(false)<br>state-update |
| 133행 | 별도 조건식 없음 | setError('')<br>state-update |
| 134행 | 별도 조건식 없음 | setText(format(Number(event.target.value)))<br>state-update |
| 134행 | 별도 조건식 없음 | format(Number(event.target.value))<br>call → [H-0d4a9f7dfbb4](ui__math-explorer.md#h-0d4a9f7dfbb4) |
| 134행 | 별도 조건식 없음 | Number(event.target.value)<br>call |
| 135행 | 별도 조건식 없음 | onChange(Number(event.target.value))<br>call |
| 135행 | 별도 조건식 없음 | Number(event.target.value)<br>call |

## H-dd874ecd8e13

**MathExplorer** · [src/ui/math-explorer.tsx:175](../../../src/ui/math-explorer.tsx#L175)

분기 조건과 가능한 갈림길:

- B-2f5fa3ec2e67 · ConditionalExpression · readingBlocked.current → truthy / falsy; 바깥 조건: truthy: readingError (449행).
- B-51fbc958641b · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' (487행).
- B-e9154cadd7e0 · ConditionalExpression · active → truthy / falsy; 바깥 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result ∧ visible-mode-required: active ? 'visible' : 'hidden' (509행).
- B-4a49ef805f8a · ConditionalExpression · scene.renderer === 'plotly' → truthy / falsy; 바깥 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result ∧ visible-mode-required: active ? 'visible' : 'hidden' (511행).
- B-fed42ba3bdcc · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result (540행).
- B-cd993a9983aa · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result (541행).
- B-0694cfa0535b · ConditionalExpression · scene.mode === 'curve' && scene.vectors → truthy / falsy; 바깥 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result (543행).
- B-815fed01cdcb · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result (586행).
- B-3582852c96a4 · ConditionalExpression · scene.renderer === 'geogebra' → truthy / falsy; 바깥 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result ∧ truthy: scene.mode === 'curve' (587행).
- B-09d24c683642 · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result (594행).
- B-5fa0e97b37c7 · ConditionalExpression · scene.mode === 'curve' → truthy / falsy; 바깥 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result (595행).
- B-7424282d1ccc · ConditionalExpression · result.point → truthy / falsy; 바깥 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result (654행).
- B-4050583166a7 · ConditionalExpression · scene.mode === 'function' → truthy / falsy; 바깥 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' (716행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 186행 | 별도 조건식 없음 | mathDraftKey(data)<br>preservation-boundary |
| 187행 | 별도 조건식 없음 | reasoningViewKey(data)<br>call |
| 188행 | 별도 조건식 없음 | useState(() => { try { const view = readReasoningView(readingKey); if (new URLSearchParams(window.location.search).get('math') === 'series') view.active = 'series'; return { view, error: '', blocked: false }; } catch { return { view: defaultReasoningView(), blocked: true, error: '읽던 위치를 불러오지 못했습니다. 기존 저장값은 유지했습니다. 현재 흐름은 파일로 보관할 수 있습니다.', }; } })<br>call<br>전달 콜백: H-08781557aeb4 |
| 203행 | 별도 조건식 없음 | useState(readingInitial.view)<br>call |
| 204행 | 별도 조건식 없음 | useState(readingInitial.error)<br>call |
| 205행 | 별도 조건식 없음 | useRef(readingInitial.blocked)<br>call |
| 206행 | 별도 조건식 없음 | useRef(readingView)<br>call |
| 208행 | 별도 조건식 없음 | useState(readingInitial.view.active === 'graph')<br>call |
| 222행 | 별도 조건식 없음 | useState(() => { try { return { scene: readMathDraft(key) ?? structuredClone(DEFAULT_SCENE), error: '', blocked: false, }; } catch { return { scene: structuredClone(DEFAULT_SCENE), error: '이 기기의 수식 초안을 읽지 못했습니다. 기존 원문은 유지했습니다. 새 입력은 파일로 보관할 수 있습니다.', blocked: true, }; } })<br>call<br>전달 콜백: H-690b68f8f3e7 |
| 238행 | 별도 조건식 없음 | useState(initial.scene)<br>call |
| 239행 | 별도 조건식 없음 | useState(initial.error)<br>call |
| 240행 | 별도 조건식 없음 | useState('')<br>call |
| 241행 | 별도 조건식 없음 | useState(false)<br>call |
| 242행 | 별도 조건식 없음 | useRef(null)<br>call |
| 243행 | 별도 조건식 없음 | useRef(scene)<br>call |
| 245행 | 별도 조건식 없음 | useRef(null)<br>call |
| 246행 | 별도 조건식 없음 | useRef(null)<br>call |
| 247행 | 별도 조건식 없음 | useState(false)<br>call |
| 248행 | 별도 조건식 없음 | useState('helix')<br>call |
| 249행 | 별도 조건식 없음 | useState(0)<br>call |
| 250행 | 별도 조건식 없음 | useState(0)<br>call |
| 251행 | 별도 조건식 없음 | useState(0)<br>call |
| 252행 | 별도 조건식 없음 | useMemo(() => ({ ...DEFAULT_SCENE, mode: scene.mode, expressions: scene.expressions, min: scene.min, max: scene.max, position: scene.position, a: scene.a, b: scene.b, vectors: scene.vectors, }), [ scene.mode, scene.expressions, scene.min, scene.max, scene.position, scene.a, scene.b, scene.vectors, ])<br>call<br>전달 콜백: H-4b0469e445fb |
| 275행 | 별도 조건식 없음 | useMemo(() => { try { return { result: buildScene(geometry), error: '' }; } catch (e) { return { result: null, error: e instanceof Error ? e.message : '수식을 확인해 주세요.' }; } }, [geometry])<br>call<br>전달 콜백: H-54280e2930df |
| 333행 | 별도 조건식 없음 | useEffect(() => { if (!zoomReady \|\| currentScene.current.sliderRangeVersion === 2) return; const current = currentScene.current; const legacyHelix = current.mode === 'curve' && current.min === '0' && current.max === '4*pi' && current.expressions.every((value, index) => value === DEFAULT_SCENE.expressions[index]); change({ ...current, sliderRangeVersion: 2, ...(legacyHelix ? { max: '8*pi', position: current.position / 2 } : {}), }); }, [zoomReady])<br>call<br>전달 콜백: H-4043964ee7a9 |
| 347행 | 별도 조건식 없음 | (data.memos ?? [])<br>    .filter((memo) => memo.id.startsWith(MATH_MEMO_PREFIX) && !memo.deletedAt)<br>    .slice()<br>    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))<br>mutation-request<br>전달 콜백: H-1a0a4ec794cc |
| 347행 | 별도 조건식 없음 | (data.memos ?? [])<br>    .filter((memo) => memo.id.startsWith(MATH_MEMO_PREFIX) && !memo.deletedAt)<br>    .slice()<br>mutation-request |
| 347행 | 별도 조건식 없음 | (data.memos ?? [])<br>    .filter((memo) => memo.id.startsWith(MATH_MEMO_PREFIX) && !memo.deletedAt)<br>call<br>전달 콜백: H-f2df476966eb |
| 541행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result | format(result.min)<br>call → [H-0d4a9f7dfbb4](ui__math-explorer.md#h-0d4a9f7dfbb4) |
| 541행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result | format(result.max)<br>call → [H-0d4a9f7dfbb4](ui__math-explorer.md#h-0d4a9f7dfbb4) |
| 619행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result | (['a', 'b'] as const).map((name) => ( <MathSlider key={name} label={`변수 ${name}`} symbol={name} value={scene[name]} min={Math.min(-10, scene[name])} max={Math.max(10, scene[name])} onChange={(value) => change({ ...scene, [name]: value })} /> ))<br>call<br>전달 콜백: H-d64328b4d3bc |
| 643행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result | result.breakBefore.some(Boolean)<br>call |
| 654행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result ∧ truthy: result.point | vec(result.point)<br>call → [H-c358eecd5119](ui__math-explorer.md#h-c358eecd5119) |
| 659행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result ∧ truthy: result.vectors | (['T', 'N', 'B'] as const).map((name) => result.vectors?.[name] && ( <p key={name}> <strong className={`math-vector-${name}`}>{name}</strong>{' '} {vec(result.vectors[name])} </p> ))<br>call<br>전달 콜백: H-d69e4d887221 |
| 672행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result ∧ truthy: result.vectors?.curvature !== undefined | format(result.vectors.curvature)<br>call → [H-0d4a9f7dfbb4](ui__math-explorer.md#h-0d4a9f7dfbb4) |
| 716행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' | (scene.mode === 'function' ? [0] : [0, 1, 2]).map((index) => ( <Input key={index} label={scene.mode === 'function' ? 'y(x)' : `${['x', 'y', 'z'][index]}(t)`} value={scene.expressions[index]} spellCheck={false} onChange={(event) => { const expressions = [...scene.expressions] as MathScene['expressions']; expressions[index] = event.target.value; change({ ...scene, expressions }); }} /> ))<br>call<br>전달 콜백: H-ab955497f104 |
| 782행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: saved.length > 0 | saved.map((memo) => ( <li key={memo.id}> <Button variant="quiet" onClick={() => { const entry = readScene(memo.body); if (entry) { change(entry); setRestoreRevision((value) => value + 1); setControlRevision((value) => value + 1); } else setError( '저장된 수식 형식을 읽지 못했습니다. 메모에서 원문을 확인해 주세요.', ); }} > {memo.body.split('\n')[0] \|\| '수식 탐색'} </Button> <a href={`#/memos/${encodeURIComponent(memo.id)}`}>메모 원문</a> </li> ))<br>call<br>전달 콜백: H-585bffd04ee6 |

반환/조기 중단: 408행 <render> [별도 조건식 없음]

## H-08781557aeb4

**@callback:useState** · [src/ui/math-explorer.tsx:188](../../../src/ui/math-explorer.tsx#L188)

분기 조건과 가능한 갈림길:

- B-375d80a7b995 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (189행).
- B-4952b2ad3816 · IfStatement · new URLSearchParams(window.location.search).get('math') === 'series' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (191행).
- B-1f63d064fcc6 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (194행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 190행 | 별도 조건식 없음 | readReasoningView(readingKey)<br>call |
| 191행 | 별도 조건식 없음 | new URLSearchParams(window.location.search).get('math')<br>call |
| 196행 | exception: exception | defaultReasoningView()<br>call |

반환/조기 중단: 193행 { view, error: '', blocked: false } [별도 조건식 없음]; 195행 { view: defaultReasoningView(), blocked: true, error: '읽던 위치를 불러오지 못했습니다. 기존 저장값은 유지했습니다. 현재 흐름은 파일로 보관할 수 있습니다.', } [exception: exception]

## H-8620997d4121

**rememberReading** · [src/ui/math-explorer.tsx:209](../../../src/ui/math-explorer.tsx#L209)

분기 조건과 가능한 갈림길:

- B-a3a3b5db5eea · IfStatement · readingBlocked.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (212행).
- B-b11c06a9ad1b · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (213행).
- B-9e762494f4fe · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (216행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 211행 | 별도 조건식 없음 | setReadingView(next)<br>state-update |
| 214행 | 별도 조건식 없음 | writeReasoningView(readingKey, next)<br>call |
| 215행 | 별도 조건식 없음 | setReadingError('')<br>state-update |
| 217행 | exception: exception | setReadingError('읽던 위치를 이 기기에 보관하지 못했습니다. 현재 흐름은 남아 있습니다. 다시 보관하거나 파일로 보관해 주세요.')<br>state-update |

반환/조기 중단: 212행 <render> [truthy: readingBlocked.current]

## H-690b68f8f3e7

**@callback:useState** · [src/ui/math-explorer.tsx:222](../../../src/ui/math-explorer.tsx#L222)

분기 조건과 가능한 갈림길:

- B-4a15cd86677c · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (223행).
- B-68fc252f3da4 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (229행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 225행 | 별도 조건식 없음 | readMathDraft(key)<br>preservation-boundary |
| 225행 | nullish: readMathDraft(key) | structuredClone(DEFAULT_SCENE)<br>call |
| 231행 | exception: exception | structuredClone(DEFAULT_SCENE)<br>call |

반환/조기 중단: 224행 { scene: readMathDraft(key) ?? structuredClone(DEFAULT_SCENE), error: '', blocked: false, } [별도 조건식 없음]; 230행 { scene: structuredClone(DEFAULT_SCENE), error: '이 기기의 수식 초안을 읽지 못했습니다. 기존 원문은 유지했습니다. 새 입력은 파일로 보관할 수 있습니다.', blocked: true, } [exception: exception]

## H-4b0469e445fb

**@callback:useMemo** · [src/ui/math-explorer.tsx:253](../../../src/ui/math-explorer.tsx#L253)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-54280e2930df

**@callback:useMemo** · [src/ui/math-explorer.tsx:275](../../../src/ui/math-explorer.tsx#L275)

분기 조건과 가능한 갈림길:

- B-f5db74d9e8d7 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (276행).
- B-d7514a558d43 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (278행).
- B-79748ca5c2b0 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (279행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 277행 | 별도 조건식 없음 | buildScene(geometry)<br>call |

반환/조기 중단: 277행 { result: buildScene(geometry), error: '' } [별도 조건식 없음]; 279행 { result: null, error: e instanceof Error ? e.message : '수식을 확인해 주세요.' } [exception: e]

## H-d332899c55c1

**change** · [src/ui/math-explorer.tsx:282](../../../src/ui/math-explorer.tsx#L282)

분기 조건과 가능한 갈림길:

- B-8b4544497e7b · IfStatement · initial.blocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (286행).
- B-4204578e5e02 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (287행).
- B-a2f57cd0bacc · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (290행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 284행 | 별도 조건식 없음 | setScene(next)<br>state-update |
| 285행 | 별도 조건식 없음 | setStatus('')<br>state-update |
| 288행 | 별도 조건식 없음 | writeMathDraft(key, next)<br>preservation-boundary |
| 289행 | 별도 조건식 없음 | setError('')<br>state-update |
| 291행 | exception: exception | setError('초안을 이 기기에 보관하지 못했습니다. 최신 입력은 현재 창에 남아 있습니다. 파일로 보관하거나 저장을 다시 시도해 주세요.')<br>state-update |

반환/조기 중단: 286행 <render> [truthy: initial.blocked]

## H-a1148d0d38ef

**rememberView** · [src/ui/math-explorer.tsx:296](../../../src/ui/math-explorer.tsx#L296)

분기 조건과 가능한 갈림길:

- B-5b7bef714466 · IfStatement · !initial.blocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (300행).
- B-1a9a3cb825ef · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: !initial.blocked (301행).
- B-f990b86fde05 · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: !initial.blocked (303행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 299행 | 별도 조건식 없음 | setScene(next)<br>state-update |
| 302행 | truthy: !initial.blocked | writeMathDraft(key, next)<br>preservation-boundary |
| 304행 | truthy: !initial.blocked ∧ exception: exception | setError('보기 설정을 이 기기에 보관하지 못했습니다. 현재 수식과 메모는 파일로 보관할 수 있습니다.')<br>state-update |

## H-5428259bba56

**rememberPlotView** · [src/ui/math-explorer.tsx:310](../../../src/ui/math-explorer.tsx#L310)

분기 조건과 가능한 갈림길:

- B-cd08d737e8d9 · IfStatement · !isTemplateView(view) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (311행).
- B-2cab93798c4f · IfStatement · JSON.stringify(currentScene.current.view) === JSON.stringify(view) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (312행).
- B-33f8502e7113 · IfStatement · !initial.blocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (317행).
- B-90860e1354bc · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: !initial.blocked (318행).
- B-04d5eb463687 · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: !initial.blocked (320행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 311행 | 별도 조건식 없음 | isTemplateView(view)<br>call |
| 312행 | 별도 조건식 없음 | JSON.stringify(currentScene.current.view)<br>call |
| 312행 | 별도 조건식 없음 | JSON.stringify(view)<br>call |
| 316행 | 별도 조건식 없음 | setScene(next)<br>state-update |
| 319행 | truthy: !initial.blocked | writeMathDraft(key, next)<br>preservation-boundary |
| 321행 | truthy: !initial.blocked ∧ exception: exception | setError('보기 설정을 이 기기에 보관하지 못했습니다. 현재 수식과 메모는 파일로 보관할 수 있습니다.')<br>state-update |

반환/조기 중단: 311행 <render> [truthy: !isTemplateView(view)]; 312행 <render> [truthy: JSON.stringify(currentScene.current.view) === JSON.stringify(view)]

## H-e8d371a62b35

**captureScene** · [src/ui/math-explorer.tsx:327](../../../src/ui/math-explorer.tsx#L327)

분기 조건과 가능한 갈림길:

- B-a79bef5857b4 · IfStatement · snapshot → truthy / falsy; 바깥 조건: 별도 조건식 없음 (329행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 329행 | truthy: snapshot | rememberView(snapshot)<br>call → [H-a1148d0d38ef](ui__math-explorer.md#h-a1148d0d38ef) |

반환/조기 중단: 330행 currentScene.current [별도 조건식 없음]

## H-4043964ee7a9

**@callback:useEffect** · [src/ui/math-explorer.tsx:333](../../../src/ui/math-explorer.tsx#L333)

분기 조건과 가능한 갈림길:

- B-8888e2657d2b · IfStatement · !zoomReady || currentScene.current.sliderRangeVersion === 2 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (334행).
- B-7343610cd647 · ConditionalExpression · legacyHelix → truthy / falsy; 바깥 조건: 별도 조건식 없음 (344행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 340행 | truthy: current.mode === 'curve' &&<br>      current.min === '0' &&<br>      current.max === '4*pi' | current.expressions.every((value, index) => value === DEFAULT_SCENE.expressions[index])<br>call<br>전달 콜백: H-e704356211bc |
| 341행 | 별도 조건식 없음 | change({ ...current, sliderRangeVersion: 2, ...(legacyHelix ? { max: '8*pi', position: current.position / 2 } : {}), })<br>call → [H-d332899c55c1](ui__math-explorer.md#h-d332899c55c1) |

반환/조기 중단: 334행 <render> [truthy: !zoomReady || currentScene.current.sliderRangeVersion === 2]

## H-e704356211bc

**@callback:current.expressions.every** · [src/ui/math-explorer.tsx:340](../../../src/ui/math-explorer.tsx#L340)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f2df476966eb

**@callback:(data.memos ?? [])
    .filter** · [src/ui/math-explorer.tsx:348](../../../src/ui/math-explorer.tsx#L348)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 348행 | 별도 조건식 없음 | memo.id.startsWith(MATH_MEMO_PREFIX)<br>call |

## H-1a0a4ec794cc

**saved** · [src/ui/math-explorer.tsx:350](../../../src/ui/math-explorer.tsx#L350)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 350행 | 별도 조건식 없음 | b.updatedAt.localeCompare(a.updatedAt)<br>call |

## H-65a104f8bc03

**save** · [src/ui/math-explorer.tsx:352](../../../src/ui/math-explorer.tsx#L352) · async

분기 조건과 가능한 갈림길:

- B-bb3232ec9f78 · IfStatement · saving → truthy / falsy; 바깥 조건: 별도 조건식 없음 (353행).
- B-6048b8394086 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (356행).
- B-137a7adacb54 · IfStatement · !canSave → truthy / falsy; 바깥 조건: 별도 조건식 없음 (357행).
- B-da4bd6659bae · IfStatement · !pendingSave.current || pendingSave.current.body !== body → truthy / falsy; 바깥 조건: 별도 조건식 없음 (362행).
- B-f2cf0bb4de3e · IfStatement · repository.flush → truthy / falsy; 바깥 조건: 별도 조건식 없음 (381행).
- B-acfeb59bff11 · IfStatement · sceneBody(currentScene.current) !== operation.body → truthy / falsy; 바깥 조건: 별도 조건식 없음 (385행).
- B-9fc47225a74f · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (391행).
- B-c1ed67e489f2 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (392행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 354행 | 별도 조건식 없음 | setSaving(true)<br>state-update |
| 355행 | 별도 조건식 없음 | setStatus('')<br>state-update |
| 358행 | truthy: !canSave | Error('수식을 저장할 수 없습니다. 다시 접속한 뒤 저장해 주세요. 입력은 유지했습니다.')<br>call |
| 361행 | 별도 조건식 없음 | sceneBody(captureScene())<br>call |
| 361행 | 별도 조건식 없음 | captureScene()<br>call → [H-e8d371a62b35](ui__math-explorer.md#h-e8d371a62b35) |
| 365행 | truthy: !pendingSave.current \|\| pendingSave.current.body !== body | crypto.randomUUID()<br>call |
| 366행 | truthy: !pendingSave.current \|\| pendingSave.current.body !== body | crypto.randomUUID()<br>call |
| 367행 | truthy: !pendingSave.current \|\| pendingSave.current.body !== body | new Date().toISOString()<br>call |
| 370행 | 별도 조건식 없음 | repository.execute({ type: 'saveMemo', ...operation, ownerId: null, expectedVersion: 0, strokes: [], userId: data.userId, namespace: data.namespace, })<br>call |
| 379행 | 별도 조건식 없음 | onSaved(next)<br>call |
| 380행 | 별도 조건식 없음 | setStatus('이 기기에 저장했습니다.')<br>state-update |
| 382행 | truthy: repository.flush | repository.flush()<br>mutation-request |
| 383행 | truthy: repository.flush | setStatus('서버에 저장했습니다.')<br>state-update |
| 385행 | 별도 조건식 없음 | sceneBody(currentScene.current)<br>call |
| 386행 | truthy: sceneBody(currentScene.current) !== operation.body | setStatus('저장을 누른 시점의 수식과 메모를 보관했습니다. 이후 바꾼 내용은 다시 저장해 주세요.')<br>state-update |
| 390행 | 별도 조건식 없음 | setError('')<br>state-update |
| 392행 | exception: e | setError(e instanceof Error ? e.message : '저장하지 못했습니다. 입력은 유지했습니다.')<br>state-update |
| 394행 | always-after-try: try 완료 또는 예외 이후 | setSaving(false)<br>state-update |

반환/조기 중단: 353행 <render> [truthy: saving]

throw: 358행 Error( '수식을 저장할 수 없습니다. 다시 접속한 뒤 저장해 주세요. 입력은 유지했습니다.', )

## H-81bd91bc7229

**download** · [src/ui/math-explorer.tsx:397](../../../src/ui/math-explorer.tsx#L397)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 398행 | 별도 조건식 없음 | URL.createObjectURL(new Blob([sceneBody(captureScene())], { type: 'text/plain;charset=utf-8' }))<br>call |
| 399행 | 별도 조건식 없음 | sceneBody(captureScene())<br>call |
| 399행 | 별도 조건식 없음 | captureScene()<br>call → [H-e8d371a62b35](ui__math-explorer.md#h-e8d371a62b35) |
| 401행 | 별도 조건식 없음 | document.createElement('a')<br>call |
| 404행 | 별도 조건식 없음 | link.click()<br>call |
| 405행 | 별도 조건식 없음 | setTimeout(() => URL.revokeObjectURL(url), 1000)<br>state-update<br>전달 콜백: H-9a30d9418d70 |

## H-9a30d9418d70

**@callback:setTimeout** · [src/ui/math-explorer.tsx:405](../../../src/ui/math-explorer.tsx#L405)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 405행 | 별도 조건식 없음 | URL.revokeObjectURL(url)<br>call |

## H-f5371fc95dae

**@onChange** · [src/ui/math-explorer.tsx:418](../../../src/ui/math-explorer.tsx#L418)

분기 조건과 가능한 갈림길:

- B-8d9e8ed7539a · IfStatement · active !== 'graph' && graphVisited → truthy / falsy; 바깥 조건: 별도 조건식 없음 (420행).
- B-ac6341c30af2 · IfStatement · active === 'graph' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (421행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 420행 | truthy: active !== 'graph' && graphVisited | captureScene()<br>call → [H-e8d371a62b35](ui__math-explorer.md#h-e8d371a62b35) |
| 421행 | truthy: active === 'graph' | setGraphVisited(true)<br>state-update |
| 422행 | 별도 조건식 없음 | rememberReading({ ...currentReading.current, active })<br>call → [H-8620997d4121](ui__math-explorer.md#h-8620997d4121) |

## H-165a27613cef

**@onClick** · [src/ui/math-explorer.tsx:434](../../../src/ui/math-explorer.tsx#L434)

분기 조건과 가능한 갈림길:

- B-fb86a061e41f · IfStatement · !readingBlocked.current → truthy / falsy; 바깥 조건: truthy: readingError (435행).
- B-16b842c5d336 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: readingError (436행).
- B-027e6f52814a · IfStatement · restored.active === 'graph' → truthy / falsy; 바깥 조건: truthy: readingError (441행).
- B-a03a3efc3870 · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: readingError (442행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 435행 | truthy: readingError ∧ truthy: !readingBlocked.current | rememberReading(currentReading.current)<br>call → [H-8620997d4121](ui__math-explorer.md#h-8620997d4121) |
| 437행 | truthy: readingError | readReasoningView(readingKey)<br>call |
| 439행 | truthy: readingError | setReadingView(restored)<br>state-update |
| 440행 | truthy: readingError | setReadingError('')<br>state-update |
| 441행 | truthy: readingError ∧ truthy: restored.active === 'graph' | setGraphVisited(true)<br>state-update |
| 443행 | truthy: readingError ∧ exception: exception | setReadingError('읽던 위치를 아직 불러올 수 없습니다. 기존 저장값은 유지했습니다. 현재 흐름을 파일로 보관해 주세요.')<br>state-update |

반환/조기 중단: 435행 rememberReading(currentReading.current) [truthy: readingError ∧ truthy: !readingBlocked.current]

## H-2bccae4c3d9e

**@onClick** · [src/ui/math-explorer.tsx:452](../../../src/ui/math-explorer.tsx#L452)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 453행 | truthy: readingError | URL.createObjectURL(new Blob([JSON.stringify(currentReading.current, null, 2)], { type: 'application/json', }))<br>call |
| 454행 | truthy: readingError | JSON.stringify(currentReading.current, null, 2)<br>call |
| 458행 | truthy: readingError | document.createElement('a')<br>call |
| 461행 | truthy: readingError | link.click()<br>call |
| 462행 | truthy: readingError | setTimeout(() => URL.revokeObjectURL(url), 1000)<br>state-update<br>전달 콜백: H-ce7f134e4574 |

## H-ce7f134e4574

**@callback:setTimeout** · [src/ui/math-explorer.tsx:462](../../../src/ui/math-explorer.tsx#L462)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 462행 | truthy: readingError | URL.revokeObjectURL(url)<br>call |

## H-c2ea34056005

**@onChange** · [src/ui/math-explorer.tsx:496](../../../src/ui/math-explorer.tsx#L496)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 497행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' | captureScene()<br>call → [H-e8d371a62b35](ui__math-explorer.md#h-e8d371a62b35) |
| 498행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' | change({ ...latest, renderer: event.target.value as MathScene['renderer'] })<br>call → [H-d332899c55c1](ui__math-explorer.md#h-d332899c55c1) |

## H-ef34bc1fcc10

**@onFallback** · [src/ui/math-explorer.tsx:532](../../../src/ui/math-explorer.tsx#L532)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 532행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result ∧ visible-mode-required: active ? 'visible' : 'hidden' ∧ falsy: scene.renderer === 'plotly' | change({ ...currentScene.current, renderer: 'plotly' })<br>call → [H-d332899c55c1](ui__math-explorer.md#h-d332899c55c1) |

## H-903d9878f807

**@onClick** · [src/ui/math-explorer.tsx:563](../../../src/ui/math-explorer.tsx#L563)

분기 조건과 가능한 갈림길:

- B-06f90608abcc · ConditionalExpression · scene.renderer === 'plotly' → truthy / falsy; 바깥 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result (564행).

## H-3c06358c6f8c

**@onClick** · [src/ui/math-explorer.tsx:572](../../../src/ui/math-explorer.tsx#L572)

분기 조건과 가능한 갈림길:

- B-38e6e5aa0cf6 · ConditionalExpression · scene.renderer === 'plotly' → truthy / falsy; 바깥 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result (574행).

## H-4e8dc50790d1

**@onClick** · [src/ui/math-explorer.tsx:580](../../../src/ui/math-explorer.tsx#L580)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 580행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result | setViewRevision((v) => v + 1)<br>state-update<br>전달 콜백: H-325f725a1a03 |

## H-325f725a1a03

**@callback:setViewRevision** · [src/ui/math-explorer.tsx:580](../../../src/ui/math-explorer.tsx#L580)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-810c6cab3282

**@onChange** · [src/ui/math-explorer.tsx:600](../../../src/ui/math-explorer.tsx#L600)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 601행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result | change({ ...scene, position: Math.max( 0, Math.min(1, (value - result.min) / (result.max - result.min)), ), })<br>call → [H-d332899c55c1](ui__math-explorer.md#h-d332899c55c1) |
| 603행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result | Math.max(0, Math.min(1, (value - result.min) / (result.max - result.min)))<br>call |
| 605행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result | Math.min(1, (value - result.min) / (result.max - result.min))<br>call |

## H-8f979a3aff3c

**@onClick** · [src/ui/math-explorer.tsx:612](../../../src/ui/math-explorer.tsx#L612)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 613행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result | change({ ...scene, position: 0 })<br>call → [H-d332899c55c1](ui__math-explorer.md#h-d332899c55c1) |
| 614행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result | setControlRevision((v) => v + 1)<br>state-update<br>전달 콜백: H-3ac3e284a474 |

## H-3ac3e284a474

**@callback:setControlRevision** · [src/ui/math-explorer.tsx:614](../../../src/ui/math-explorer.tsx#L614)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d64328b4d3bc

**@callback:(['a', 'b'] as const).map** · [src/ui/math-explorer.tsx:619](../../../src/ui/math-explorer.tsx#L619)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 625행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result | Math.min(-10, scene[name])<br>call |
| 626행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result | Math.max(10, scene[name])<br>call |

## H-40aedf2d141f

**@onChange** · [src/ui/math-explorer.tsx:627](../../../src/ui/math-explorer.tsx#L627)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 627행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result | change({ ...scene, [name]: value })<br>call → [H-d332899c55c1](ui__math-explorer.md#h-d332899c55c1) |

## H-d963da7bddd0

**@onChange** · [src/ui/math-explorer.tsx:635](../../../src/ui/math-explorer.tsx#L635)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 635행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result ∧ truthy: scene.mode === 'curve' | change({ ...scene, vectors: event.target.checked })<br>call → [H-d332899c55c1](ui__math-explorer.md#h-d332899c55c1) |

## H-d69e4d887221

**@callback:(['T', 'N', 'B'] as const).map** · [src/ui/math-explorer.tsx:660](../../../src/ui/math-explorer.tsx#L660)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 664행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: result ∧ truthy: result.vectors ∧ truthy: result.vectors?.[name] | vec(result.vectors[name])<br>call → [H-c358eecd5119](ui__math-explorer.md#h-c358eecd5119) |

## H-d6046e855173

**@onChange** · [src/ui/math-explorer.tsx:685](../../../src/ui/math-explorer.tsx#L685)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 686행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' | change({ ...scene, mode: event.target.value as MathScene['mode'] })<br>call → [H-d332899c55c1](ui__math-explorer.md#h-d332899c55c1) |

## H-af25fb08e545

**@onChange** · [src/ui/math-explorer.tsx:695](../../../src/ui/math-explorer.tsx#L695)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 695행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' | setPreset(event.target.value)<br>state-update |

## H-67a2ab088e53

**@onClick** · [src/ui/math-explorer.tsx:703](../../../src/ui/math-explorer.tsx#L703)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 704행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' | change({ ...structuredClone(presets[preset]), title: scene.title, notes: scene.notes, renderer: scene.renderer, })<br>call → [H-d332899c55c1](ui__math-explorer.md#h-d332899c55c1) |
| 705행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' | structuredClone(presets[preset])<br>call |

## H-ab955497f104

**@callback:(scene.mode === 'function' ? [0] : [0, 1, 2]).map** · [src/ui/math-explorer.tsx:716](../../../src/ui/math-explorer.tsx#L716)

분기 조건과 가능한 갈림길:

- B-84cff115e1cd · ConditionalExpression · scene.mode === 'function' → truthy / falsy; 바깥 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' (719행).

## H-4a3aafcf93bd

**@onChange** · [src/ui/math-explorer.tsx:722](../../../src/ui/math-explorer.tsx#L722)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 725행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' | change({ ...scene, expressions })<br>call → [H-d332899c55c1](ui__math-explorer.md#h-d332899c55c1) |

## H-113961687162

**@onChange** · [src/ui/math-explorer.tsx:738](../../../src/ui/math-explorer.tsx#L738)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 738행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' | change({ ...scene, min: event.target.value })<br>call → [H-d332899c55c1](ui__math-explorer.md#h-d332899c55c1) |

## H-d0d1e455bc1f

**@onChange** · [src/ui/math-explorer.tsx:743](../../../src/ui/math-explorer.tsx#L743)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 743행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' | change({ ...scene, max: event.target.value })<br>call → [H-d332899c55c1](ui__math-explorer.md#h-d332899c55c1) |

## H-183ae106c9dd

**@onChange** · [src/ui/math-explorer.tsx:762](../../../src/ui/math-explorer.tsx#L762)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 762행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' | change({ ...scene, title: event.target.value })<br>call → [H-d332899c55c1](ui__math-explorer.md#h-d332899c55c1) |

## H-acb5381c9759

**@onChange** · [src/ui/math-explorer.tsx:768](../../../src/ui/math-explorer.tsx#L768)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 768행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' | change({ ...scene, notes: event.target.value })<br>call → [H-d332899c55c1](ui__math-explorer.md#h-d332899c55c1) |

## H-2f23cb091ea1

**@onClick** · [src/ui/math-explorer.tsx:771](../../../src/ui/math-explorer.tsx#L771)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 771행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' | save()<br>call → [H-65a104f8bc03](ui__math-explorer.md#h-65a104f8bc03) |

## H-585bffd04ee6

**@callback:saved.map** · [src/ui/math-explorer.tsx:782](../../../src/ui/math-explorer.tsx#L782)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 798행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: saved.length > 0 | memo.body.split('\n')<br>call |
| 800행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: saved.length > 0 | encodeURIComponent(memo.id)<br>call |

## H-69ce83cd72ff

**@onClick** · [src/ui/math-explorer.tsx:786](../../../src/ui/math-explorer.tsx#L786)

분기 조건과 가능한 갈림길:

- B-7c93b4c3a135 · IfStatement · entry → truthy / falsy; 바깥 조건: truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: saved.length > 0 (788행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 787행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: saved.length > 0 | readScene(memo.body)<br>call |
| 789행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: saved.length > 0 ∧ truthy: entry | change(entry)<br>call → [H-d332899c55c1](ui__math-explorer.md#h-d332899c55c1) |
| 790행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: saved.length > 0 ∧ truthy: entry | setRestoreRevision((value) => value + 1)<br>state-update<br>전달 콜백: H-68c5e0d79e71 |
| 791행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: saved.length > 0 ∧ truthy: entry | setControlRevision((value) => value + 1)<br>state-update<br>전달 콜백: H-797ebf99b54c |
| 793행 | truthy: graphVisited ∧ visible-when-falsy: readingView.active !== 'graph' ∧ truthy: saved.length > 0 ∧ falsy: entry | setError('저장된 수식 형식을 읽지 못했습니다. 메모에서 원문을 확인해 주세요.')<br>state-update |

## H-68c5e0d79e71

**@callback:setRestoreRevision** · [src/ui/math-explorer.tsx:790](../../../src/ui/math-explorer.tsx#L790)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-797ebf99b54c

**@callback:setControlRevision** · [src/ui/math-explorer.tsx:791](../../../src/ui/math-explorer.tsx#L791)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

