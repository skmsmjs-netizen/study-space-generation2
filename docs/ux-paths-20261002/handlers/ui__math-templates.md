# src/ui/math-templates.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-f433f0f72333

**format** · [src/ui/math-templates.tsx:37](../../../src/ui/math-templates.tsx#L37)

분기 조건과 가능한 갈림길:

- B-4cbb97c01de9 · ConditionalExpression · Math.abs(v) < 0.005 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (37행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 37행 | 별도 조건식 없음 | Math.abs(v)<br>call |
| 37행 | falsy: Math.abs(v) < 0.005 | v.toFixed(2)<br>call |

## H-00ed371c4c9d

**NumberField** · [src/ui/math-templates.tsx:38](../../../src/ui/math-templates.tsx#L38)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 47행 | 별도 조건식 없음 | useState(format(value))<br>call |
| 47행 | 별도 조건식 없음 | format(value)<br>call → [H-f433f0f72333](ui__math-templates.md#h-f433f0f72333) |
| 48행 | 별도 조건식 없음 | useState(false)<br>call |
| 49행 | 별도 조건식 없음 | useState('')<br>call |

반환/조기 중단: 62행 <render> [별도 조건식 없음]

## H-199c2e1ead20

**commit** · [src/ui/math-templates.tsx:50](../../../src/ui/math-templates.tsx#L50)

분기 조건과 가능한 갈림길:

- B-0a85fce8672a · IfStatement · !dirty → truthy / falsy; 바깥 조건: 별도 조건식 없음 (51행).
- B-269630e038d9 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (52행).
- B-c491055f2fe4 · IfStatement · v === null || Math.abs(v) > 1e6 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (54행).
- B-139b3c506f72 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (58행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 53행 | 별도 조건식 없음 | expression(text).value({})<br>call |
| 53행 | 별도 조건식 없음 | expression(text)<br>call |
| 54행 | falsy: v === null | Math.abs(v)<br>call |
| 54행 | truthy: v === null \|\| Math.abs(v) > 1e6 | Error('range')<br>call |
| 55행 | 별도 조건식 없음 | onCommit(v)<br>call |
| 56행 | 별도 조건식 없음 | setDirty(false)<br>state-update |
| 57행 | 별도 조건식 없음 | setError('')<br>state-update |
| 59행 | exception: exception | setError('숫자 또는 pi를 포함한 수치식을 입력해 주세요.')<br>state-update |

반환/조기 중단: 51행 <render> [truthy: !dirty]

throw: 54행 Error('range')

## H-2948c270990f

**@onChange** · [src/ui/math-templates.tsx:68](../../../src/ui/math-templates.tsx#L68)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 69행 | 별도 조건식 없음 | setText(e.target.value)<br>state-update |
| 70행 | 별도 조건식 없음 | setDirty(true)<br>state-update |
| 71행 | 별도 조건식 없음 | setError('')<br>state-update |

## H-a44d2d3cd2db

**@onKeyDown** · [src/ui/math-templates.tsx:74](../../../src/ui/math-templates.tsx#L74)

분기 조건과 가능한 갈림길:

- B-326f12f4a8fb · IfStatement · e.key === 'Enter' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (75행).
- B-eca0be4de376 · IfStatement · e.key === 'Escape' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (76행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 75행 | truthy: e.key === 'Enter' | commit()<br>mutation-request → [H-199c2e1ead20](ui__math-templates.md#h-199c2e1ead20) |
| 77행 | truthy: e.key === 'Escape' | setText(format(value))<br>state-update |
| 77행 | truthy: e.key === 'Escape' | format(value)<br>call → [H-f433f0f72333](ui__math-templates.md#h-f433f0f72333) |
| 78행 | truthy: e.key === 'Escape' | setDirty(false)<br>state-update |
| 79행 | truthy: e.key === 'Escape' | setError('')<br>state-update |

## H-304155101b93

**download** · [src/ui/math-templates.tsx:85](../../../src/ui/math-templates.tsx#L85)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 86행 | 별도 조건식 없음 | URL.createObjectURL(new Blob([value], { type }))<br>call |
| 87행 | 별도 조건식 없음 | document.createElement('a')<br>call |
| 90행 | 별도 조건식 없음 | link.click()<br>call |
| 91행 | 별도 조건식 없음 | setTimeout(() => URL.revokeObjectURL(url), 1000)<br>state-update<br>전달 콜백: H-ff81474d162e |

## H-ff81474d162e

**@callback:setTimeout** · [src/ui/math-templates.tsx:91](../../../src/ui/math-templates.tsx#L91)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 91행 | 별도 조건식 없음 | URL.revokeObjectURL(url)<br>call |

## H-c7213d5ba785

**MathTemplates** · [src/ui/math-templates.tsx:93](../../../src/ui/math-templates.tsx#L93)

분기 조건과 가능한 갈림길:

- B-1f396d3c2523 · ConditionalExpression · result.legacy → truthy / falsy; 바깥 조건: truthy: result &&
          item.kind !== 'formula' &&
          !(item.kind === 'data' && !item.dataset?.points.length) (312행).
- B-fe9154161846 · ConditionalExpression · alternate → truthy / falsy; 바깥 조건: truthy: item.kind === 'surface' (359행).
- B-9313cf079ba0 · ConditionalExpression · blocked.current → truthy / falsy; 바깥 조건: truthy: error (560행).
- B-4d7713af8377 · ConditionalExpression · item.source.url → truthy / falsy; 바깥 조건: truthy: item.source (755행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 102행 | 별도 조건식 없음 | templateDraftKey(data)<br>preservation-boundary |
| 103행 | 별도 조건식 없음 | useState(() => { try { return { workspace: readTemplateWorkspace(key), error: '', blocked: false }; } catch { return { workspace: freshTemplateWorkspace(), error: '내용 초안을 읽지 못했습니다. 기존 원문은 유지했습니다. 현재 입력은 파일로 보관할 수 있습니다.', blocked: true, }; } })<br>call<br>전달 콜백: H-baa847445d2a |
| 115행 | 별도 조건식 없음 | useState(initial.workspace)<br>call |
| 116행 | 별도 조건식 없음 | useState(initial.error)<br>call |
| 117행 | 별도 조건식 없음 | useState('')<br>call |
| 118행 | 별도 조건식 없음 | useState(false)<br>call |
| 119행 | 별도 조건식 없음 | useState(false)<br>call |
| 120행 | 별도 조건식 없음 | useState(initial.workspace.entries.find((e) => e.id === initial.workspace.active)?.view?.alternate ?? false)<br>call |
| 121행 | 별도 조건식 없음 | initial.workspace.entries.find((e) => e.id === initial.workspace.active)<br>call<br>전달 콜백: H-c23b81b16c5c |
| 124행 | 별도 조건식 없음 | useState(0)<br>call |
| 125행 | 별도 조건식 없음 | useState(false)<br>call |
| 126행 | 별도 조건식 없음 | useRef(initial.blocked)<br>call |
| 127행 | 별도 조건식 없음 | useRef(workspace)<br>call |
| 128행 | 별도 조건식 없음 | useRef(null)<br>call |
| 129행 | 별도 조건식 없음 | useRef(null)<br>call |
| 130행 | 별도 조건식 없음 | useRef(null)<br>call |
| 132행 | 별도 조건식 없음 | workspace.entries.find((e) => e.id === workspace.active)<br>call<br>전달 콜백: H-19c7a4b43d61 |
| 135행 | 별도 조건식 없음 | useMemo(() => ({ version: 1 as const, id: item.id, kind: item.kind, expressions: item.expressions, ranges: item.ranges, parameters: item.parameters, cursor: item.cursor, initial: item.initial, dataset: item.dataset, tex: item.tex, title: '', notes: '', sections: undefined, question: undefined, conditions: undefined, source: undefined, }), [ item.id, item.kind, item.expressions, item.ranges, item.parameters, item.cursor, item.initial, item.dataset, item.tex, ])<br>call<br>전달 콜백: H-335c47558d97 |
| 166행 | 별도 조건식 없음 | useMemo(() => { try { return { result: buildTemplate(geometry), error: '' }; } catch (e) { return { result: null, error: e instanceof Error ? e.message : '수식을 확인해 주세요.' }; } }, [geometry])<br>call<br>전달 콜백: H-54657c78eec3 |
| 292행 | 별도 조건식 없음 | (data.memos ?? [])<br>      .filter((m) => m.id.startsWith(TEMPLATE_MEMO_PREFIX) && !m.deletedAt)<br>      .slice()<br>      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))<br>mutation-request<br>전달 콜백: H-2bef25156fc9 |
| 292행 | 별도 조건식 없음 | (data.memos ?? [])<br>      .filter((m) => m.id.startsWith(TEMPLATE_MEMO_PREFIX) && !m.deletedAt)<br>      .slice()<br>mutation-request |
| 292행 | 별도 조건식 없음 | (data.memos ?? [])<br>      .filter((m) => m.id.startsWith(TEMPLATE_MEMO_PREFIX) && !m.deletedAt)<br>call<br>전달 콜백: H-b3e419eec6ff |
| 298행 | 별도 조건식 없음 | useRef({ id: '', graph: false })<br>call |
| 299행 | 별도 조건식 없음 | useEffect(() => { const previous = entryView.current; entryView.current = { id: item.id, graph: Boolean(hasGraph) }; if (previous.id !== item.id) setExpanded(Boolean(hasGraph)); else if (!previous.graph && hasGraph) setExpanded(true); }, [item.id, hasGraph])<br>call<br>전달 콜백: H-5c67e562cbd2 |
| 366행 | truthy: result | result.readouts.map((r) => ( <div key={r.label}> <dt>{r.label}</dt> <dd>{r.value}</dd> </div> ))<br>call<br>전달 콜백: H-d16291c06be7 |
| 373행 | truthy: result | result.notices.map((n) => ( <p key={n}>{n}</p> ))<br>call<br>전달 콜백: H-14d3755e897c |
| 378행 | truthy: result ∧ truthy: result.legacy?.result.vectors | (['T', 'N', 'B'] as const).map((name) => { const v = result.legacy!.result.vectors?.[name]; return v ? ( <div key={name}> <dt> <MathFormula tex={`\\mathbf{${name}}`} inline /> </dt> <dd>({v.map(format).join(', ')})</dd> </div> ) : null; })<br>call<br>전달 콜백: H-1f55778b8701 |
| 394행 | 별도 조건식 없음 | item.parameters.map((p, i) => item.expressions.some((source) => new RegExp(`\\b${p.symbol}\\b`).test(source)) && ( <div className="math-template-control" key={p.symbol}> <label htmlFor={`template-parameter-${p.symbol}`}> {p.label} = {format(p.value)} </label> <input id={`template-parameter-${p.symbol}`} aria-label={`변수 ${p.symbol}`} type="range" min={p.min} max={p.max} step="any" value={p.value} onChange={(e) => change({ ...item, parameters: item.parameters.map((q, j) => j === i ? { ...q, value: Number(e.target.value) } : q, ), }) } /> <NumberField key={`${p.symbol}-${p.value}`} label={`${p.symbol} 값`} value={p.value} onCommit={(v) => { if (v < p.min \|\| v > p.max) { setError(`${p.label}: ${p.min}부터 ${p.max} 사이로 … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-cd1e9b72a691 |
| 438행 | 별도 조건식 없음 | spec.axes.map((axis) => ( <div className="math-template-control" key={axis}> <label htmlFor={`template-cursor-${axis}`}> {axis} 위치 = {format(item.cursor[axis])} </label> <input id={`template-cursor-${axis}`} aria-label={`${axis} 위치`} type="range" min={item.ranges[axis][0]} max={item.ranges[axis][1]} step={axis === 'n' ? 1 : 'any'} value={item.cursor[axis]} onChange={(e) => change({ ...item, cursor: { ...item.cursor, [axis]: Number(e.target.value) } }) } /> <NumberField key={`${axis}-${item.cursor[axis]}`} label={`${axis} 위치 값`} value={item.cursor[axis]} onCommit={(v) => { const [lo, hi] = item.ranges[axis]; if (v < lo \|\| v > hi \|\| (axis === 'n' && !Number.isInteger(v))) { setError('위치는 구간 안의 값으로 입력해 주세요.' … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-429f0a611ba8 |
| 473행 | truthy: item.initial.length > 0 | item.initial.map((v, i) => ( <NumberField // biome-ignore lint/suspicious/noArrayIndexKey: Fixed mathematical component slots retain editing state when their value changes. key={`initial-${i}`} label={`${item.kind === 'ode' ? 'y' : ['x', 'y'][i]}(${format(item.ranges.t[0])}) 초기값`} value={v} onCommit={(value) => change({ ...item, initial: item.initial.map((n, j) => (i === j ? value : n)) }) } /> ))<br>call<br>전달 콜백: H-6d9eb246615e |
| 493행 | 별도 조건식 없음 | workspace.entries.map((e) => ( <option key={e.id} value={e.id}> {e.title \|\| TEMPLATE_SPECS[e.kind].label} </option> ))<br>call<br>전달 콜백: H-49433aa5b398 |
| 503행 | 별도 조건식 없음 | TEMPLATE_KINDS.map((kind) => ( <option key={kind} value={kind}> {TEMPLATE_SPECS[kind].label} </option> ))<br>call<br>전달 콜백: H-05d5033b8931 |
| 580행 | truthy: item.conditions && item.conditions.length > 0 | occurrenceRows(item.conditions, (c) => c).map(({ value: c, key }) => ( <li key={key}>{c}</li> ))<br>call<br>전달 콜백: H-c96229cd14e1 |
| 580행 | truthy: item.conditions && item.conditions.length > 0 | occurrenceRows(item.conditions, (c) => c)<br>call<br>전달 콜백: H-923f1c5897f6 |
| 598행 | truthy: item.quantities && item.quantities.length > 0 | occurrenceRows(item.quantities, (q) => JSON.stringify(q)).map(({ value: q, key }) => ( <tr key={key}> <td> <MathFormula tex={q.symbol} inline /> </td> <td>{q.name}</td> <td>{q.unit}</td> </tr> ))<br>call<br>전달 콜백: H-a2789453ba07 |
| 598행 | truthy: item.quantities && item.quantities.length > 0 | occurrenceRows(item.quantities, (q) => JSON.stringify(q))<br>call<br>전달 콜백: H-727f88cae4a0 |
| 615행 | truthy: result | occurrenceRows(result.tex, (tex) => tex).map(({ value: tex, index: i, key }) => ( <MathFormula key={key} tex={tex} label={spec.fields[i] \|\| '수식'} /> ))<br>call<br>전달 콜백: H-64d8a758fabd |
| 615행 | truthy: result | occurrenceRows(result.tex, (tex) => tex)<br>call<br>전달 콜백: H-f6a0b720ae4c |
| 631행 | truthy: expanded | workspace.entries.map((entry) => ( <option key={entry.id} value={entry.id}> {entry.title \|\| TEMPLATE_SPECS[entry.kind].label} </option> ))<br>call<br>전달 콜백: H-a01f6a9d2d1b |
| 657행 | 별도 조건식 없음 | spec.fields.map((label, i) => ( <Input key={label} label={label} spellCheck={false} value={item.expressions[i]} onChange={(e) => change({ ...item, expressions: item.expressions.map((s, j) => (i === j ? e.target.value : s)), }) } /> ))<br>call<br>전달 콜백: H-bc7874e06d6e |
| 671행 | 별도 조건식 없음 | spec.axes.map((axis) => ( <div className="math-interval" key={axis}> {[0, 1].map((index) => ( <NumberField key={`${axis}-${index}`} label={`${axis} ${item.kind === 'function' \|\| item.kind === 'curve' ? '슬라이더' : '구간'} ${index ? '끝' : '시작'}`} value={item.ranges[axis][index]} onCommit={(value) => { const range = [...item.ranges[axis]] as [number, number]; range[index] = value; change({ ...item, ranges: { ...item.ranges, [axis]: range }, cursor: { ...item.cursor, [axis]: Math.max(range[0], Math.min(range[1], item.cursor[axis])), }, }); }} /> ))} </div> ))<br>call<br>전달 콜백: H-19f67bf49b7e |
| 698행 | truthy: item.kind === 'formula' | (item.tex ?? []).join('\n')<br>call |
| 797행 | truthy: saved.length > 0 | saved.map((m) => ( <li key={m.id}> <Button variant="quiet" onClick={() => { const entry = readTemplate(m.body); try { if (entry) accept([entry]); else setError('내용 형식을 읽지 못했습니다. 메모의 원문은 유지했습니다.'); } catch (error) { setError( error instanceof Error ? error.message : '내용을 다시 열지 못했습니다.', ); } }} > {m.body.split('\n')[0] \|\| '수식 내용'} </Button> </li> ))<br>call<br>전달 콜백: H-bf2209658248 |

반환/조기 중단: 489행 <render> [별도 조건식 없음]

## H-baa847445d2a

**@callback:useState** · [src/ui/math-templates.tsx:103](../../../src/ui/math-templates.tsx#L103)

분기 조건과 가능한 갈림길:

- B-c9e47d19f23a · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (104행).
- B-9c531a762298 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (106행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 105행 | 별도 조건식 없음 | readTemplateWorkspace(key)<br>call |
| 108행 | exception: exception | freshTemplateWorkspace()<br>call |

반환/조기 중단: 105행 { workspace: readTemplateWorkspace(key), error: '', blocked: false } [별도 조건식 없음]; 107행 { workspace: freshTemplateWorkspace(), error: '내용 초안을 읽지 못했습니다. 기존 원문은 유지했습니다. 현재 입력은 파일로 보관할 수 있습니다.', blocked: true, } [exception: exception]

## H-c23b81b16c5c

**@callback:initial.workspace.entries.find** · [src/ui/math-templates.tsx:121](../../../src/ui/math-templates.tsx#L121)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-19c7a4b43d61

**@callback:workspace.entries.find** · [src/ui/math-templates.tsx:132](../../../src/ui/math-templates.tsx#L132)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-335c47558d97

**@callback:useMemo** · [src/ui/math-templates.tsx:136](../../../src/ui/math-templates.tsx#L136)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-54657c78eec3

**@callback:useMemo** · [src/ui/math-templates.tsx:166](../../../src/ui/math-templates.tsx#L166)

분기 조건과 가능한 갈림길:

- B-882c513b7700 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (167행).
- B-c5c1f2ca3c35 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (169행).
- B-703297d97f71 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (170행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 168행 | 별도 조건식 없음 | buildTemplate(geometry)<br>call |

반환/조기 중단: 168행 { result: buildTemplate(geometry), error: '' } [별도 조건식 없음]; 170행 { result: null, error: e instanceof Error ? e.message : '수식을 확인해 주세요.' } [exception: e]

## H-6a48258eca38

**update** · [src/ui/math-templates.tsx:173](../../../src/ui/math-templates.tsx#L173)

분기 조건과 가능한 갈림길:

- B-d944911c1865 · IfStatement · blocked.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (177행).
- B-705a8c2e7d4b · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (178행).
- B-7efe2a8f283d · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (181행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 175행 | 별도 조건식 없음 | setWorkspace(next)<br>state-update |
| 176행 | 별도 조건식 없음 | setStatus('')<br>state-update |
| 179행 | 별도 조건식 없음 | writeTemplateWorkspace(key, next)<br>call |
| 180행 | 별도 조건식 없음 | setError('')<br>state-update |
| 182행 | exception: exception | setError('이 기기에 초안을 보관하지 못했습니다. 최신 입력은 현재 화면에 남아 있습니다. 다시 보관하거나 파일로 보관해 주세요.')<br>state-update |

반환/조기 중단: 177행 <render> [truthy: blocked.current]

## H-46fb5e8c4f31

**change** · [src/ui/math-templates.tsx:187](../../../src/ui/math-templates.tsx#L187)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 188행 | 별도 조건식 없음 | update({ ...current.current, entries: current.current.entries.map((e) => (e.id === item.id ? next : e)), })<br>call → [H-6a48258eca38](ui__math-templates.md#h-6a48258eca38) |
| 190행 | 별도 조건식 없음 | current.current.entries.map((e) => (e.id === item.id ? next : e))<br>call<br>전달 콜백: H-9b221b5d48bb |

## H-9b221b5d48bb

**@callback:current.current.entries.map** · [src/ui/math-templates.tsx:190](../../../src/ui/math-templates.tsx#L190)

분기 조건과 가능한 갈림길:

- B-da7b5ecdf08f · ConditionalExpression · e.id === item.id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (190행).

## H-b357db692ad4

**activate** · [src/ui/math-templates.tsx:192](../../../src/ui/math-templates.tsx#L192)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 193행 | 별도 조건식 없음 | setAlternate(current.current.entries.find((e) => e.id === id)?.view?.alternate ?? false)<br>state-update |
| 193행 | 별도 조건식 없음 | current.current.entries.find((e) => e.id === id)<br>call<br>전달 콜백: H-70f2d070c99d |
| 194행 | 별도 조건식 없음 | setViewRevision((v) => v + 1)<br>state-update<br>전달 콜백: H-8d64c0b8ed69 |
| 195행 | 별도 조건식 없음 | update({ ...current.current, active: id })<br>call → [H-6a48258eca38](ui__math-templates.md#h-6a48258eca38) |

## H-70f2d070c99d

**@callback:current.current.entries.find** · [src/ui/math-templates.tsx:193](../../../src/ui/math-templates.tsx#L193)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-8d64c0b8ed69

**@callback:setViewRevision** · [src/ui/math-templates.tsx:194](../../../src/ui/math-templates.tsx#L194)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-aed521388cab

**add** · [src/ui/math-templates.tsx:197](../../../src/ui/math-templates.tsx#L197)

분기 조건과 가능한 갈림길:

- B-79cc9326613a · IfStatement · workspace.entries.length >= 500 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (198행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 199행 | truthy: workspace.entries.length >= 500 | setError('현재 내용 500개를 보관 중입니다. 파일로 내보낸 뒤 필요한 내용을 선택해 주세요.')<br>state-update |
| 202행 | 별도 조건식 없음 | defaultTemplate(kind)<br>call |
| 202행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 203행 | 별도 조건식 없음 | update({ ...workspace, active: fresh.id, entries: [...workspace.entries, fresh] })<br>call → [H-6a48258eca38](ui__math-templates.md#h-6a48258eca38) |
| 204행 | 별도 조건식 없음 | setAlternate(false)<br>state-update |

반환/조기 중단: 200행 <render> [truthy: workspace.entries.length >= 500]

## H-ea818ade0344

**accept** · [src/ui/math-templates.tsx:206](../../../src/ui/math-templates.tsx#L206)

분기 조건과 가능한 갈림길:

- B-c42d99de6ea0 · IfStatement · previous → truthy / falsy; 바깥 조건: 별도 조건식 없음 (213행).
- B-f3304682b841 · IfStatement · JSON.stringify(previous) === JSON.stringify(entry) → truthy / falsy; 바깥 조건: truthy: previous (214행).
- B-8b10e7794a0a · IfStatement · entries.length > 500 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (228행).
- B-86fb51bd1361 · ConditionalExpression · copies → truthy / falsy; 바깥 조건: 별도 조건식 없음 (233행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 212행 | 별도 조건식 없음 | entries.find((e) => e.id === entry.id)<br>call<br>전달 콜백: H-1bb86e962b13 |
| 214행 | truthy: previous | JSON.stringify(previous)<br>call |
| 214행 | truthy: previous | JSON.stringify(entry)<br>call |
| 220행 | truthy: previous | crypto.randomUUID()<br>call |
| 225행 | 별도 조건식 없음 | entries.push(entry)<br>call |
| 229행 | truthy: entries.length > 500 | Error('한 공간에 내용 500개까지 보관할 수 있습니다. 파일을 나누어 주세요.')<br>call |
| 230행 | 별도 조건식 없음 | update({ ...current.current, entries, active })<br>call → [H-6a48258eca38](ui__math-templates.md#h-6a48258eca38) |
| 231행 | 별도 조건식 없음 | setAlternate(entries.find((e) => e.id === active)?.view?.alternate ?? false)<br>state-update |
| 231행 | 별도 조건식 없음 | entries.find((e) => e.id === active)<br>call<br>전달 콜백: H-1ec634dd189c |
| 232행 | 별도 조건식 없음 | setStatus(copies ? '기존 내용은 유지하고, 같은 ID의 변경 내용은 새 사본으로 가져왔습니다.' : '내용을 가져왔습니다.')<br>state-update |

throw: 229행 Error('한 공간에 내용 500개까지 보관할 수 있습니다. 파일을 나누어 주세요.')

## H-1bb86e962b13

**@callback:entries.find** · [src/ui/math-templates.tsx:212](../../../src/ui/math-templates.tsx#L212)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1ec634dd189c

**@callback:entries.find** · [src/ui/math-templates.tsx:231](../../../src/ui/math-templates.tsx#L231)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d2ac24e62a10

**save** · [src/ui/math-templates.tsx:238](../../../src/ui/math-templates.tsx#L238) · async

분기 조건과 가능한 갈림길:

- B-c477f7d7aa86 · IfStatement · busy → truthy / falsy; 바깥 조건: 별도 조건식 없음 (239행).
- B-aba3ac3f8223 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (242행).
- B-bcadc444af94 · IfStatement · data.namespace !== 'demo' && !repository.getCapabilities?.().includes('saveMemo') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (243행).
- B-741dd18b48b7 · IfStatement · !pending.current || pending.current.body !== body → truthy / falsy; 바깥 조건: 별도 조건식 없음 (247행).
- B-4e3ed63a4e33 · IfStatement · repository.flush → truthy / falsy; 바깥 조건: 별도 조건식 없음 (266행).
- B-f0e8fe3175cb · IfStatement · templateBody(latest) !== body → truthy / falsy; 바깥 조건: 별도 조건식 없음 (271행).
- B-342dc337fcd9 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (275행).
- B-1cebf90615e3 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (276행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 240행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 241행 | 별도 조건식 없음 | setStatus('')<br>state-update |
| 244행 | truthy: data.namespace !== 'demo' && !repository.getCapabilities?.().includes('saveMemo') | Error('기록을 저장할 수 없습니다. 다시 접속한 뒤 저장해 주세요.')<br>call |
| 245행 | 별도 조건식 없음 | current.current.entries.find((e) => e.id === current.current.active)<br>call<br>전달 콜백: H-01ff3ab9c97e |
| 246행 | 별도 조건식 없음 | templateBody(selected)<br>call |
| 250행 | truthy: !pending.current \|\| pending.current.body !== body | crypto.randomUUID()<br>call |
| 251행 | truthy: !pending.current \|\| pending.current.body !== body | crypto.randomUUID()<br>call |
| 252행 | truthy: !pending.current \|\| pending.current.body !== body | new Date().toISOString()<br>call |
| 255행 | 별도 조건식 없음 | repository.execute({ type: 'saveMemo', ...operation, ownerId: null, expectedVersion: 0, strokes: [], userId: data.userId, namespace: data.namespace, })<br>call |
| 264행 | 별도 조건식 없음 | onSaved(next)<br>call |
| 265행 | 별도 조건식 없음 | setStatus('이 기기에 저장했습니다.')<br>state-update |
| 267행 | truthy: repository.flush | repository.flush()<br>mutation-request |
| 268행 | truthy: repository.flush | setStatus('서버에 저장했습니다.')<br>state-update |
| 270행 | 별도 조건식 없음 | current.current.entries.find((e) => e.id === current.current.active)<br>call<br>전달 콜백: H-613fd319a60e |
| 271행 | 별도 조건식 없음 | templateBody(latest)<br>call |
| 272행 | truthy: templateBody(latest) !== body | setStatus('누른 시점의 내용과 메모를 저장했습니다. 이후 바뀐 내용은 다시 저장해 주세요.')<br>state-update |
| 274행 | 별도 조건식 없음 | setError('')<br>state-update |
| 276행 | exception: e | setError(e instanceof Error ? e.message : '저장하지 못했습니다. 입력은 유지했습니다.')<br>state-update |
| 278행 | always-after-try: try 완료 또는 예외 이후 | setBusy(false)<br>state-update |

반환/조기 중단: 239행 <render> [truthy: busy]

throw: 244행 Error('기록을 저장할 수 없습니다. 다시 접속한 뒤 저장해 주세요.')

## H-01ff3ab9c97e

**@callback:current.current.entries.find** · [src/ui/math-templates.tsx:245](../../../src/ui/math-templates.tsx#L245)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-613fd319a60e

**@callback:current.current.entries.find** · [src/ui/math-templates.tsx:270](../../../src/ui/math-templates.tsx#L270)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-61ba86c94860

**rememberView** · [src/ui/math-templates.tsx:281](../../../src/ui/math-templates.tsx#L281)

분기 조건과 가능한 갈림길:

- B-0283470388ba · IfStatement · latest → truthy / falsy; 바깥 조건: 별도 조건식 없음 (283행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 282행 | 별도 조건식 없음 | current.current.entries.find((e) => e.id === item.id)<br>call<br>전달 콜백: H-418630e03c85 |
| 284행 | truthy: latest | update({ ...current.current, entries: current.current.entries.map((e) => e.id === item.id ? { ...latest, view: { ...view, alternate } } : e, ), })<br>call → [H-6a48258eca38](ui__math-templates.md#h-6a48258eca38) |
| 286행 | truthy: latest | current.current.entries.map((e) => e.id === item.id ? { ...latest, view: { ...view, alternate } } : e)<br>call<br>전달 콜백: H-3528e452f045 |

## H-418630e03c85

**@callback:current.current.entries.find** · [src/ui/math-templates.tsx:282](../../../src/ui/math-templates.tsx#L282)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3528e452f045

**@callback:current.current.entries.map** · [src/ui/math-templates.tsx:286](../../../src/ui/math-templates.tsx#L286)

분기 조건과 가능한 갈림길:

- B-d06013016207 · ConditionalExpression · e.id === item.id → truthy / falsy; 바깥 조건: truthy: latest (287행).

## H-b3e419eec6ff

**@callback:(data.memos ?? [])
      .filter** · [src/ui/math-templates.tsx:293](../../../src/ui/math-templates.tsx#L293)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 293행 | 별도 조건식 없음 | m.id.startsWith(TEMPLATE_MEMO_PREFIX)<br>call |

## H-2bef25156fc9

**saved** · [src/ui/math-templates.tsx:295](../../../src/ui/math-templates.tsx#L295)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 295행 | 별도 조건식 없음 | b.updatedAt.localeCompare(a.updatedAt)<br>call |

## H-5c67e562cbd2

**@callback:useEffect** · [src/ui/math-templates.tsx:299](../../../src/ui/math-templates.tsx#L299)

분기 조건과 가능한 갈림길:

- B-cdb9a558fd72 · IfStatement · previous.id !== item.id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (302행).
- B-a029941dc818 · IfStatement · !previous.graph && hasGraph → truthy / falsy; 바깥 조건: falsy: previous.id !== item.id (303행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 301행 | 별도 조건식 없음 | Boolean(hasGraph)<br>call |
| 302행 | truthy: previous.id !== item.id | setExpanded(Boolean(hasGraph))<br>state-update |
| 302행 | truthy: previous.id !== item.id | Boolean(hasGraph)<br>call |
| 303행 | falsy: previous.id !== item.id ∧ truthy: !previous.graph && hasGraph | setExpanded(true)<br>state-update |

## H-56bd2ae0a865

**@onClick** · [src/ui/math-templates.tsx:325](../../../src/ui/math-templates.tsx#L325)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6a54a1675b14

**@onClick** · [src/ui/math-templates.tsx:330](../../../src/ui/math-templates.tsx#L330)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f67e8ac08bce

**@onClick** · [src/ui/math-templates.tsx:334](../../../src/ui/math-templates.tsx#L334)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 334행 | truthy: result &&<br>          item.kind !== 'formula' &&<br>          !(item.kind === 'data' && !item.dataset?.points.length) ∧ truthy: result.legacy | setViewRevision((v) => v + 1)<br>state-update<br>전달 콜백: H-ce07e7434fe5 |

## H-ce07e7434fe5

**@callback:setViewRevision** · [src/ui/math-templates.tsx:334](../../../src/ui/math-templates.tsx#L334)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-9512095c4ec8

**@onClick** · [src/ui/math-templates.tsx:353](../../../src/ui/math-templates.tsx#L353)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 355행 | truthy: item.kind === 'surface' | setAlternate(next)<br>state-update |
| 356행 | truthy: item.kind === 'surface' | change({ ...item, view: { ...item.view, alternate: next } })<br>call → [H-46fb5e8c4f31](ui__math-templates.md#h-46fb5e8c4f31) |

## H-d16291c06be7

**@callback:result.readouts.map** · [src/ui/math-templates.tsx:366](../../../src/ui/math-templates.tsx#L366)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-14d3755e897c

**@callback:result.notices.map** · [src/ui/math-templates.tsx:373](../../../src/ui/math-templates.tsx#L373)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1f55778b8701

**@callback:(['T', 'N', 'B'] as const).map** · [src/ui/math-templates.tsx:378](../../../src/ui/math-templates.tsx#L378)

분기 조건과 가능한 갈림길:

- B-132181d7e0ca · ConditionalExpression · v → truthy / falsy; 바깥 조건: truthy: result ∧ truthy: result.legacy?.result.vectors (380행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 385행 | truthy: result ∧ truthy: result.legacy?.result.vectors ∧ truthy: v | v.map(format).join(', ')<br>call |
| 385행 | truthy: result ∧ truthy: result.legacy?.result.vectors ∧ truthy: v | v.map(format)<br>call<br>전달 콜백: H-f433f0f72333 |

반환/조기 중단: 380행 v ? ( <div key={name}> <dt> <MathFormula tex={`\\mathbf{${name}}`} inline /> </dt> <dd>({v.map(format).join(', ')})</dd> </div> ) : null [truthy: result ∧ truthy: result.legacy?.result.vectors]

## H-cd1e9b72a691

**@callback:item.parameters.map** · [src/ui/math-templates.tsx:395](../../../src/ui/math-templates.tsx#L395)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 396행 | 별도 조건식 없음 | item.expressions.some((source) => new RegExp(`\\b${p.symbol}\\b`).test(source))<br>call<br>전달 콜백: H-c4d24f77e1d1 |
| 399행 | truthy: item.expressions.some((source) => new RegExp(`\\b${p.symbol}\\b`).test(source)) | format(p.value)<br>call → [H-f433f0f72333](ui__math-templates.md#h-f433f0f72333) |

## H-c4d24f77e1d1

**@callback:item.expressions.some** · [src/ui/math-templates.tsx:396](../../../src/ui/math-templates.tsx#L396)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 396행 | 별도 조건식 없음 | new RegExp(`\\b${p.symbol}\\b`).test(source)<br>call |

## H-f8fa9e53205b

**@onChange** · [src/ui/math-templates.tsx:409](../../../src/ui/math-templates.tsx#L409)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 410행 | truthy: item.expressions.some((source) => new RegExp(`\\b${p.symbol}\\b`).test(source)) | change({ ...item, parameters: item.parameters.map((q, j) => j === i ? { ...q, value: Number(e.target.value) } : q, ), })<br>call → [H-46fb5e8c4f31](ui__math-templates.md#h-46fb5e8c4f31) |
| 412행 | truthy: item.expressions.some((source) => new RegExp(`\\b${p.symbol}\\b`).test(source)) | item.parameters.map((q, j) => j === i ? { ...q, value: Number(e.target.value) } : q)<br>call<br>전달 콜백: H-22f4d4703b02 |

## H-22f4d4703b02

**@callback:item.parameters.map** · [src/ui/math-templates.tsx:412](../../../src/ui/math-templates.tsx#L412)

분기 조건과 가능한 갈림길:

- B-9de9ea691727 · ConditionalExpression · j === i → truthy / falsy; 바깥 조건: truthy: item.expressions.some((source) => new RegExp(`\\b${p.symbol}\\b`).test(source)) (413행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 413행 | truthy: item.expressions.some((source) => new RegExp(`\\b${p.symbol}\\b`).test(source)) ∧ truthy: j === i | Number(e.target.value)<br>call |

## H-fddfdf58384a

**@onCommit** · [src/ui/math-templates.tsx:422](../../../src/ui/math-templates.tsx#L422)

분기 조건과 가능한 갈림길:

- B-4d8722cbacf1 · IfStatement · v < p.min || v > p.max → truthy / falsy; 바깥 조건: truthy: item.expressions.some((source) => new RegExp(`\\b${p.symbol}\\b`).test(source)) (423행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 424행 | truthy: item.expressions.some((source) => new RegExp(`\\b${p.symbol}\\b`).test(source)) ∧ truthy: v < p.min \|\| v > p.max | setError(`${p.label}: ${p.min}부터 ${p.max} 사이로 입력해 주세요.`)<br>state-update |
| 427행 | truthy: item.expressions.some((source) => new RegExp(`\\b${p.symbol}\\b`).test(source)) | change({ ...item, parameters: item.parameters.map((q, j) => j === i ? { ...q, value: v } : q, ), })<br>call → [H-46fb5e8c4f31](ui__math-templates.md#h-46fb5e8c4f31) |
| 429행 | truthy: item.expressions.some((source) => new RegExp(`\\b${p.symbol}\\b`).test(source)) | item.parameters.map((q, j) => j === i ? { ...q, value: v } : q)<br>call<br>전달 콜백: H-d292ad909233 |

반환/조기 중단: 425행 <render> [truthy: item.expressions.some((source) => new RegExp(`\\b${p.symbol}\\b`).test(source)) ∧ truthy: v < p.min || v > p.max]

## H-d292ad909233

**@callback:item.parameters.map** · [src/ui/math-templates.tsx:429](../../../src/ui/math-templates.tsx#L429)

분기 조건과 가능한 갈림길:

- B-4cde858541c5 · ConditionalExpression · j === i → truthy / falsy; 바깥 조건: truthy: item.expressions.some((source) => new RegExp(`\\b${p.symbol}\\b`).test(source)) (430행).

## H-429f0a611ba8

**@callback:spec.axes.map** · [src/ui/math-templates.tsx:438](../../../src/ui/math-templates.tsx#L438)

분기 조건과 가능한 갈림길:

- B-420addae5d8c · ConditionalExpression · axis === 'n' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (449행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 441행 | 별도 조건식 없음 | format(item.cursor[axis])<br>call → [H-f433f0f72333](ui__math-templates.md#h-f433f0f72333) |

## H-83adc866bb08

**@onChange** · [src/ui/math-templates.tsx:451](../../../src/ui/math-templates.tsx#L451)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 452행 | 별도 조건식 없음 | change({ ...item, cursor: { ...item.cursor, [axis]: Number(e.target.value) } })<br>call → [H-46fb5e8c4f31](ui__math-templates.md#h-46fb5e8c4f31) |
| 452행 | 별도 조건식 없음 | Number(e.target.value)<br>call |

## H-cb09892930ae

**@onCommit** · [src/ui/math-templates.tsx:459](../../../src/ui/math-templates.tsx#L459)

분기 조건과 가능한 갈림길:

- B-02e7c1b0518b · IfStatement · v < lo || v > hi || (axis === 'n' && !Number.isInteger(v)) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (461행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 461행 | falsy: v < lo \|\| v > hi ∧ truthy: axis === 'n' | Number.isInteger(v)<br>call |
| 462행 | truthy: v < lo \|\| v > hi \|\| (axis === 'n' && !Number.isInteger(v)) | setError('위치는 구간 안의 값으로 입력해 주세요.')<br>state-update |
| 465행 | 별도 조건식 없음 | change({ ...item, cursor: { ...item.cursor, [axis]: v } })<br>call → [H-46fb5e8c4f31](ui__math-templates.md#h-46fb5e8c4f31) |

반환/조기 중단: 463행 <render> [truthy: v < lo || v > hi || (axis === 'n' && !Number.isInteger(v))]

## H-6d9eb246615e

**@callback:item.initial.map** · [src/ui/math-templates.tsx:473](../../../src/ui/math-templates.tsx#L473)

분기 조건과 가능한 갈림길:

- B-f34c36339a29 · ConditionalExpression · item.kind === 'ode' → truthy / falsy; 바깥 조건: truthy: item.initial.length > 0 (477행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 477행 | truthy: item.initial.length > 0 | format(item.ranges.t[0])<br>call → [H-f433f0f72333](ui__math-templates.md#h-f433f0f72333) |

## H-16215b0b89f8

**@onCommit** · [src/ui/math-templates.tsx:479](../../../src/ui/math-templates.tsx#L479)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 480행 | truthy: item.initial.length > 0 | change({ ...item, initial: item.initial.map((n, j) => (i === j ? value : n)) })<br>call → [H-46fb5e8c4f31](ui__math-templates.md#h-46fb5e8c4f31) |
| 480행 | truthy: item.initial.length > 0 | item.initial.map((n, j) => (i === j ? value : n))<br>call<br>전달 콜백: H-4ef8da5c73b6 |

## H-4ef8da5c73b6

**@callback:item.initial.map** · [src/ui/math-templates.tsx:480](../../../src/ui/math-templates.tsx#L480)

분기 조건과 가능한 갈림길:

- B-15a688ede720 · ConditionalExpression · i === j → truthy / falsy; 바깥 조건: truthy: item.initial.length > 0 (480행).

## H-4fb6b7e9209a

**@onChange** · [src/ui/math-templates.tsx:492](../../../src/ui/math-templates.tsx#L492)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 492행 | 별도 조건식 없음 | activate(e.target.value)<br>call → [H-b357db692ad4](ui__math-templates.md#h-b357db692ad4) |

## H-49433aa5b398

**@callback:workspace.entries.map** · [src/ui/math-templates.tsx:493](../../../src/ui/math-templates.tsx#L493)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d08ea1cde9a0

**@onChange** · [src/ui/math-templates.tsx:499](../../../src/ui/math-templates.tsx#L499)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 499행 | 별도 조건식 없음 | add(e.target.value as TemplateKind)<br>call → [H-aed521388cab](ui__math-templates.md#h-aed521388cab) |

## H-05d5033b8931

**@callback:TEMPLATE_KINDS.map** · [src/ui/math-templates.tsx:503](../../../src/ui/math-templates.tsx#L503)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e7bf708f59a4

**@onClick** · [src/ui/math-templates.tsx:511](../../../src/ui/math-templates.tsx#L511)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6a166f4d6d0a

**@onClick** · [src/ui/math-templates.tsx:513](../../../src/ui/math-templates.tsx#L513)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 514행 | 별도 조건식 없음 | download('수식·내용 작성 형식.json', JSON.stringify(TEMPLATE_KINDS.map(defaultTemplate), null, 2))<br>call → [H-304155101b93](ui__math-templates.md#h-304155101b93) |
| 516행 | 별도 조건식 없음 | JSON.stringify(TEMPLATE_KINDS.map(defaultTemplate), null, 2)<br>call |
| 516행 | 별도 조건식 없음 | TEMPLATE_KINDS.map(defaultTemplate)<br>call |

## H-167c07c997dc

**@onChange** · [src/ui/math-templates.tsx:528](../../../src/ui/math-templates.tsx#L528) · async

분기 조건과 가능한 갈림길:

- B-bd7200554486 · IfStatement · !f → truthy / falsy; 바깥 조건: visible-when-falsy: true (531행).
- B-08e42968bcc9 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: visible-when-falsy: true (532행).
- B-776b64f0c464 · IfStatement · f.size > 2_000_000 → truthy / falsy; 바깥 조건: visible-when-falsy: true (533행).
- B-ddf870c24c93 · CatchClause · error → exception; 바깥 조건: visible-when-falsy: true (535행).
- B-b1d175108103 · ConditionalExpression · error instanceof Error → truthy / falsy; 바깥 조건: visible-when-falsy: true ∧ exception: error (536행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 533행 | visible-when-falsy: true ∧ truthy: f.size > 2_000_000 | Error('내용 파일은 2MB 이내로 나누어 주세요.')<br>call |
| 534행 | visible-when-falsy: true | accept(importTemplates(await f.text()))<br>call → [H-ea818ade0344](ui__math-templates.md#h-ea818ade0344) |
| 534행 | visible-when-falsy: true | importTemplates(await f.text())<br>call |
| 534행 | visible-when-falsy: true | f.text()<br>call |
| 536행 | visible-when-falsy: true ∧ exception: error | setError(error instanceof Error ? error.message : '내용을 가져오지 못했습니다.')<br>state-update |

반환/조기 중단: 531행 <render> [visible-when-falsy: true ∧ truthy: !f]

throw: 533행 Error('내용 파일은 2MB 이내로 나누어 주세요.')

## H-ce7f20822ec7

**@onClick** · [src/ui/math-templates.tsx:548](../../../src/ui/math-templates.tsx#L548)

분기 조건과 가능한 갈림길:

- B-ed3d5a5de724 · IfStatement · blocked.current → truthy / falsy; 바깥 조건: truthy: error (549행).
- B-9e34a5bd606c · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: error ∧ truthy: blocked.current (550행).
- B-81cdff65a4a6 · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: error ∧ truthy: blocked.current (554행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 551행 | truthy: error ∧ truthy: blocked.current | readTemplateWorkspace(key)<br>call |
| 553행 | truthy: error ∧ truthy: blocked.current | update(restored)<br>call → [H-6a48258eca38](ui__math-templates.md#h-6a48258eca38) |
| 555행 | truthy: error ∧ truthy: blocked.current ∧ exception: exception | setError('기존 보관값을 아직 읽지 못했습니다. 파일로 보관해 주세요.')<br>state-update |
| 557행 | truthy: error ∧ falsy: blocked.current | update(current.current)<br>call → [H-6a48258eca38](ui__math-templates.md#h-6a48258eca38) |

## H-42b676a8e84f

**@onClick** · [src/ui/math-templates.tsx:563](../../../src/ui/math-templates.tsx#L563)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 564행 | truthy: error | download('수식·내용 초안.json', JSON.stringify(current.current, null, 2))<br>call → [H-304155101b93](ui__math-templates.md#h-304155101b93) |
| 564행 | truthy: error | JSON.stringify(current.current, null, 2)<br>call |

## H-923f1c5897f6

**@callback:occurrenceRows** · [src/ui/math-templates.tsx:580](../../../src/ui/math-templates.tsx#L580)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c96229cd14e1

**@callback:occurrenceRows(item.conditions, (c) => c).map** · [src/ui/math-templates.tsx:580](../../../src/ui/math-templates.tsx#L580)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-727f88cae4a0

**@callback:occurrenceRows** · [src/ui/math-templates.tsx:598](../../../src/ui/math-templates.tsx#L598)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 598행 | truthy: item.quantities && item.quantities.length > 0 | JSON.stringify(q)<br>call |

## H-a2789453ba07

**@callback:occurrenceRows(item.quantities, (q) => JSON.stringify(q)).map** · [src/ui/math-templates.tsx:599](../../../src/ui/math-templates.tsx#L599)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f6a0b720ae4c

**@callback:occurrenceRows** · [src/ui/math-templates.tsx:615](../../../src/ui/math-templates.tsx#L615)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-64d8a758fabd

**@callback:occurrenceRows(result.tex, (tex) => tex).map** · [src/ui/math-templates.tsx:615](../../../src/ui/math-templates.tsx#L615)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e855f561007e

**@onClick** · [src/ui/math-templates.tsx:618](../../../src/ui/math-templates.tsx#L618)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 618행 | truthy: hasGraph | setExpanded(true)<br>state-update |

## H-d083a56c100e

**@onClose** · [src/ui/math-templates.tsx:624](../../../src/ui/math-templates.tsx#L624)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 624행 | truthy: expanded | setExpanded(false)<br>state-update |

## H-497f0c592c0b

**@onChange** · [src/ui/math-templates.tsx:629](../../../src/ui/math-templates.tsx#L629)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 629행 | truthy: expanded | activate(e.target.value)<br>call → [H-b357db692ad4](ui__math-templates.md#h-b357db692ad4) |

## H-a01f6a9d2d1b

**@callback:workspace.entries.map** · [src/ui/math-templates.tsx:631](../../../src/ui/math-templates.tsx#L631)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ed548d2ec937

**@onChange** · [src/ui/math-templates.tsx:645](../../../src/ui/math-templates.tsx#L645)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 645행 | 별도 조건식 없음 | change({ ...item, title: e.target.value })<br>call → [H-46fb5e8c4f31](ui__math-templates.md#h-46fb5e8c4f31) |

## H-cdd8ac8966fe

**@onChange** · [src/ui/math-templates.tsx:650](../../../src/ui/math-templates.tsx#L650)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 650행 | 별도 조건식 없음 | change({ ...item, subject: e.target.value })<br>call → [H-46fb5e8c4f31](ui__math-templates.md#h-46fb5e8c4f31) |

## H-4c9195b7d936

**@onChange** · [src/ui/math-templates.tsx:655](../../../src/ui/math-templates.tsx#L655)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 655행 | 별도 조건식 없음 | change({ ...item, question: e.target.value })<br>call → [H-46fb5e8c4f31](ui__math-templates.md#h-46fb5e8c4f31) |

## H-bc7874e06d6e

**@callback:spec.fields.map** · [src/ui/math-templates.tsx:657](../../../src/ui/math-templates.tsx#L657)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f2f897be4647

**@onChange** · [src/ui/math-templates.tsx:663](../../../src/ui/math-templates.tsx#L663)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 664행 | 별도 조건식 없음 | change({ ...item, expressions: item.expressions.map((s, j) => (i === j ? e.target.value : s)), })<br>call → [H-46fb5e8c4f31](ui__math-templates.md#h-46fb5e8c4f31) |
| 666행 | 별도 조건식 없음 | item.expressions.map((s, j) => (i === j ? e.target.value : s))<br>call<br>전달 콜백: H-8e272662faff |

## H-8e272662faff

**@callback:item.expressions.map** · [src/ui/math-templates.tsx:666](../../../src/ui/math-templates.tsx#L666)

분기 조건과 가능한 갈림길:

- B-00be1c94b98f · ConditionalExpression · i === j → truthy / falsy; 바깥 조건: 별도 조건식 없음 (666행).

## H-19f67bf49b7e

**@callback:spec.axes.map** · [src/ui/math-templates.tsx:671](../../../src/ui/math-templates.tsx#L671)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 673행 | 별도 조건식 없음 | [0, 1].map((index) => ( <NumberField key={`${axis}-${index}`} label={`${axis} ${item.kind === 'function' \|\| item.kind === 'curve' ? '슬라이더' : '구간'} ${index ? '끝' : '시작'}`} value={item.ranges[axis][index]} onCommit={(value) => { const range = [...item.ranges[axis]] as [number, number]; range[index] = value; change({ ...item, ranges: { ...item.ranges, [axis]: range }, cursor: { ...item.cursor, [axis]: Math.max(range[0], Math.min(range[1], item.cursor[axis])), }, }); }} /> ))<br>call<br>전달 콜백: H-94442a607efc |

## H-94442a607efc

**@callback:[0, 1].map** · [src/ui/math-templates.tsx:673](../../../src/ui/math-templates.tsx#L673)

분기 조건과 가능한 갈림길:

- B-ab4fc9150251 · ConditionalExpression · item.kind === 'function' || item.kind === 'curve' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (676행).
- B-4d0dce4b35f3 · ConditionalExpression · index → truthy / falsy; 바깥 조건: 별도 조건식 없음 (676행).

## H-ffe0c059f203

**@onCommit** · [src/ui/math-templates.tsx:678](../../../src/ui/math-templates.tsx#L678)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 681행 | 별도 조건식 없음 | change({ ...item, ranges: { ...item.ranges, [axis]: range }, cursor: { ...item.cursor, [axis]: Math.max(range[0], Math.min(range[1], item.cursor[axis])), }, })<br>call → [H-46fb5e8c4f31](ui__math-templates.md#h-46fb5e8c4f31) |
| 686행 | 별도 조건식 없음 | Math.max(range[0], Math.min(range[1], item.cursor[axis]))<br>call |
| 686행 | 별도 조건식 없음 | Math.min(range[1], item.cursor[axis])<br>call |

## H-09398841e6bb

**@onChange** · [src/ui/math-templates.tsx:699](../../../src/ui/math-templates.tsx#L699)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 699행 | truthy: item.kind === 'formula' | change({ ...item, tex: e.target.value.split('\n').filter(Boolean) })<br>call → [H-46fb5e8c4f31](ui__math-templates.md#h-46fb5e8c4f31) |
| 699행 | truthy: item.kind === 'formula' | e.target.value.split('\n').filter(Boolean)<br>call |
| 699행 | truthy: item.kind === 'formula' | e.target.value.split('\n')<br>call |

## H-14cfeb293b37

**@onChange** · [src/ui/math-templates.tsx:708](../../../src/ui/math-templates.tsx#L708)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 709행 | truthy: item.kind === 'data' | change({ ...item, dataset: { ...item.dataset!, xLabel: e.target.value } })<br>call → [H-46fb5e8c4f31](ui__math-templates.md#h-46fb5e8c4f31) |

## H-939b9f3d40a5

**@onChange** · [src/ui/math-templates.tsx:715](../../../src/ui/math-templates.tsx#L715)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 716행 | truthy: item.kind === 'data' | change({ ...item, dataset: { ...item.dataset!, yLabel: e.target.value } })<br>call → [H-46fb5e8c4f31](ui__math-templates.md#h-46fb5e8c4f31) |

## H-a54e8545e26f

**@onChange** · [src/ui/math-templates.tsx:722](../../../src/ui/math-templates.tsx#L722)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 723행 | truthy: item.kind === 'data' | change({ ...item, dataset: { ...item.dataset!, style: e.target.value as 'line' \| 'scatter' \| 'bar', }, })<br>call → [H-46fb5e8c4f31](ui__math-templates.md#h-46fb5e8c4f31) |

## H-a69acb9a7d4f

**@onChange** · [src/ui/math-templates.tsx:770](../../../src/ui/math-templates.tsx#L770)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 770행 | 별도 조건식 없음 | change({ ...item, notes: e.target.value })<br>call → [H-46fb5e8c4f31](ui__math-templates.md#h-46fb5e8c4f31) |

## H-85dd266ae615

**@onClick** · [src/ui/math-templates.tsx:773](../../../src/ui/math-templates.tsx#L773)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 773행 | 별도 조건식 없음 | save()<br>call → [H-d2ac24e62a10](ui__math-templates.md#h-d2ac24e62a10) |

## H-5c7ab035ee78

**@onClick** · [src/ui/math-templates.tsx:777](../../../src/ui/math-templates.tsx#L777)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 778행 | 별도 조건식 없음 | download(`${item.title \|\| '수식 내용'}.json`, JSON.stringify(item, null, 2))<br>call → [H-304155101b93](ui__math-templates.md#h-304155101b93) |
| 778행 | 별도 조건식 없음 | JSON.stringify(item, null, 2)<br>call |

## H-57542574590f

**@onClick** · [src/ui/math-templates.tsx:784](../../../src/ui/math-templates.tsx#L784)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 785행 | 별도 조건식 없음 | download('모든 수식·내용 초안.json', JSON.stringify(workspace.entries, null, 2))<br>call → [H-304155101b93](ui__math-templates.md#h-304155101b93) |
| 785행 | 별도 조건식 없음 | JSON.stringify(workspace.entries, null, 2)<br>call |

## H-bf2209658248

**@callback:saved.map** · [src/ui/math-templates.tsx:797](../../../src/ui/math-templates.tsx#L797)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 813행 | truthy: saved.length > 0 | m.body.split('\n')<br>call |

## H-8a383e8769a9

**@onClick** · [src/ui/math-templates.tsx:801](../../../src/ui/math-templates.tsx#L801)

분기 조건과 가능한 갈림길:

- B-059af80b7774 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: saved.length > 0 (803행).
- B-f7b404240c74 · IfStatement · entry → truthy / falsy; 바깥 조건: truthy: saved.length > 0 (804행).
- B-46f018a2bf55 · CatchClause · error → exception; 바깥 조건: truthy: saved.length > 0 (806행).
- B-86cddc680fbf · ConditionalExpression · error instanceof Error → truthy / falsy; 바깥 조건: truthy: saved.length > 0 ∧ exception: error (808행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 802행 | truthy: saved.length > 0 | readTemplate(m.body)<br>call |
| 804행 | truthy: saved.length > 0 ∧ truthy: entry | accept([entry])<br>call → [H-ea818ade0344](ui__math-templates.md#h-ea818ade0344) |
| 805행 | truthy: saved.length > 0 ∧ falsy: entry | setError('내용 형식을 읽지 못했습니다. 메모의 원문은 유지했습니다.')<br>state-update |
| 807행 | truthy: saved.length > 0 ∧ exception: error | setError(error instanceof Error ? error.message : '내용을 다시 열지 못했습니다.')<br>state-update |

## H-35ac6b10ee8e

**ParameterEditor** · [src/ui/math-templates.tsx:823](../../../src/ui/math-templates.tsx#L823)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 830행 | 별도 조건식 없음 | useState('')<br>call |
| 831행 | 별도 조건식 없음 | useState('')<br>call |
| 835행 | 별도 조건식 없음 | item.parameters.map((p, i) => ( <div className="math-interval" key={p.symbol}> {(['min', 'max'] as const).map((edge) => ( <NumberField key={`${p.symbol}-${edge}`} label={`${p.label} 슬라이더 ${edge === 'min' ? '시작' : '끝'}`} value={p[edge]} onCommit={(value) => { const next = { ...item, parameters: item.parameters.map((q, j) => i === j ? { ...q, [edge]: value } : q, ), }; if (!isMathTemplate(next)) { setError('시작은 끝보다 작고, 현재 값은 범위 안에 있어야 합니다.'); return; } setError(''); onChange(next); }} /> ))} </div> ))<br>call<br>전달 콜백: H-13a945b50924 |

반환/조기 중단: 832행 <render> [별도 조건식 없음]

## H-13a945b50924

**@callback:item.parameters.map** · [src/ui/math-templates.tsx:835](../../../src/ui/math-templates.tsx#L835)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 837행 | 별도 조건식 없음 | (['min', 'max'] as const).map((edge) => ( <NumberField key={`${p.symbol}-${edge}`} label={`${p.label} 슬라이더 ${edge === 'min' ? '시작' : '끝'}`} value={p[edge]} onCommit={(value) => { const next = { ...item, parameters: item.parameters.map((q, j) => i === j ? { ...q, [edge]: value } : q, ), }; if (!isMathTemplate(next)) { setError('시작은 끝보다 작고, 현재 값은 범위 안에 있어야 합니다.'); return; } setError(''); onChange(next); }} /> ))<br>call<br>전달 콜백: H-ac7e088fad55 |

## H-ac7e088fad55

**@callback:(['min', 'max'] as const).map** · [src/ui/math-templates.tsx:837](../../../src/ui/math-templates.tsx#L837)

분기 조건과 가능한 갈림길:

- B-b844ce65b3ed · ConditionalExpression · edge === 'min' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (840행).

## H-c1bcc4d436ab

**@onCommit** · [src/ui/math-templates.tsx:842](../../../src/ui/math-templates.tsx#L842)

분기 조건과 가능한 갈림길:

- B-3bb844596565 · IfStatement · !isMathTemplate(next) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (849행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 845행 | 별도 조건식 없음 | item.parameters.map((q, j) => i === j ? { ...q, [edge]: value } : q)<br>call<br>전달 콜백: H-cb357f240532 |
| 849행 | 별도 조건식 없음 | isMathTemplate(next)<br>call |
| 850행 | truthy: !isMathTemplate(next) | setError('시작은 끝보다 작고, 현재 값은 범위 안에 있어야 합니다.')<br>state-update |
| 853행 | 별도 조건식 없음 | setError('')<br>state-update |
| 854행 | 별도 조건식 없음 | onChange(next)<br>call |

반환/조기 중단: 851행 <render> [truthy: !isMathTemplate(next)]

## H-cb357f240532

**@callback:item.parameters.map** · [src/ui/math-templates.tsx:845](../../../src/ui/math-templates.tsx#L845)

분기 조건과 가능한 갈림길:

- B-2ef2aeeb5cc6 · ConditionalExpression · i === j → truthy / falsy; 바깥 조건: 별도 조건식 없음 (846행).

## H-dea981819231

**@onChange** · [src/ui/math-templates.tsx:863](../../../src/ui/math-templates.tsx#L863)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 863행 | 별도 조건식 없음 | setSymbol(e.target.value)<br>state-update |

## H-5f07d2695f63

**@onClick** · [src/ui/math-templates.tsx:867](../../../src/ui/math-templates.tsx#L867)

분기 조건과 가능한 갈림길:

- B-af05877c3fa2 · IfStatement · !isMathTemplate(next) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (875행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 872행 | 별도 조건식 없음 | symbol.trim()<br>call |
| 872행 | 별도 조건식 없음 | symbol.trim()<br>call |
| 875행 | 별도 조건식 없음 | isMathTemplate(next)<br>call |
| 876행 | truthy: !isMathTemplate(next) | setError('계산 변수와 겹치지 않는 영문 변수 이름을 넣어 주세요. 변수는 12개 이내입니다.')<br>state-update |
| 881행 | 별도 조건식 없음 | setError('')<br>state-update |
| 882행 | 별도 조건식 없음 | setSymbol('')<br>state-update |
| 883행 | 별도 조건식 없음 | onChange(next)<br>call |

반환/조기 중단: 879행 <render> [truthy: !isMathTemplate(next)]

## H-b28f0929fb33

**DataEditor** · [src/ui/math-templates.tsx:892](../../../src/ui/math-templates.tsx#L892)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 899행 | nullish: item.datasetInput | item.dataset!.points.map((p) => p.join(', ')).join('\n')<br>call |
| 899행 | nullish: item.datasetInput | item.dataset!.points.map((p) => p.join(', '))<br>call<br>전달 콜백: H-2bdf65c7a88d |
| 900행 | 별도 조건식 없음 | useState('')<br>call |

반환/조기 중단: 901행 <render> [별도 조건식 없음]

## H-2bdf65c7a88d

**@callback:item.dataset!.points.map** · [src/ui/math-templates.tsx:899](../../../src/ui/math-templates.tsx#L899)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 899행 | nullish: item.datasetInput | p.join(', ')<br>call |

## H-17232132d4d7

**@onChange** · [src/ui/math-templates.tsx:907](../../../src/ui/math-templates.tsx#L907)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 908행 | 별도 조건식 없음 | onChange({ ...item, datasetInput: e.target.value })<br>call |
| 909행 | 별도 조건식 없음 | setError('')<br>state-update |

## H-c251073019ac

**@onClick** · [src/ui/math-templates.tsx:914](../../../src/ui/math-templates.tsx#L914)

분기 조건과 가능한 갈림길:

- B-dc43a7d19aa2 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (915행).
- B-64780cde161b · IfStatement · points.length > 10000 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (929행).
- B-167da8a4a309 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (932행).
- B-80a3a5dc9ca7 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (933행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 916행 | 별도 조건식 없음 | text<br>              .split('\n')<br>              .filter((s) => s.trim())<br>              .map((s) => { const v = s.split(',').map((s) => Number(s.trim())); if ( v.length !== 2 \|\| s.split(',').some((s) => !s.trim()) \|\| v.some((n) => !Number.isFinite(n) \|\| Math.abs(n) > 1e6) ) throw Error('각 줄에 두 숫자를 쉼표로 구분해 주세요.'); return v as [number, number]; })<br>call<br>전달 콜백: H-de065867791b |
| 916행 | 별도 조건식 없음 | text<br>              .split('\n')<br>              .filter((s) => s.trim())<br>call<br>전달 콜백: H-5c586d369198 |
| 916행 | 별도 조건식 없음 | text<br>              .split('\n')<br>call |
| 929행 | truthy: points.length > 10000 | Error('한 번에 10000값 이내로 넣어 주세요.')<br>call |
| 930행 | 별도 조건식 없음 | onChange({ ...item, dataset: { ...item.dataset!, points } })<br>call |
| 931행 | 별도 조건식 없음 | setError('')<br>state-update |
| 933행 | exception: e | setError(e instanceof Error ? e.message : '값을 확인해 주세요.')<br>state-update |

throw: 929행 Error('한 번에 10000값 이내로 넣어 주세요.')

## H-5c586d369198

**@callback:text
              .split('\n')
              .filter** · [src/ui/math-templates.tsx:918](../../../src/ui/math-templates.tsx#L918)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 918행 | 별도 조건식 없음 | s.trim()<br>call |

## H-de065867791b

**@callback:text
              .split('\n')
              .filter((s) => s.trim())
              .map** · [src/ui/math-templates.tsx:919](../../../src/ui/math-templates.tsx#L919)

분기 조건과 가능한 갈림길:

- B-4b2f2cf7fcc2 · IfStatement · v.length !== 2 || s.split(',').some((s) => !s.trim()) || v.some((n) => !Number.isFinite(n) || Math.abs(n) > 1e6) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (921행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 920행 | 별도 조건식 없음 | s.split(',').map((s) => Number(s.trim()))<br>call<br>전달 콜백: H-68a8ebd32e92 |
| 920행 | 별도 조건식 없음 | s.split(',')<br>call |
| 923행 | falsy: v.length !== 2 | s.split(',').some((s) => !s.trim())<br>call<br>전달 콜백: H-ae92bc125b10 |
| 923행 | falsy: v.length !== 2 | s.split(',')<br>call |
| 924행 | falsy: v.length !== 2 \|\|<br>                  s.split(',').some((s) => !s.trim()) | v.some((n) => !Number.isFinite(n) \|\| Math.abs(n) > 1e6)<br>call<br>전달 콜백: H-852e62bef22d |
| 926행 | truthy: v.length !== 2 \|\|<br>                  s.split(',').some((s) => !s.trim()) \|\|<br>                  v.some((n) => !Number.isFinite(n) \|\| Math.abs(n) > 1e6) | Error('각 줄에 두 숫자를 쉼표로 구분해 주세요.')<br>call |

반환/조기 중단: 927행 v as [number, number] [별도 조건식 없음]

throw: 926행 Error('각 줄에 두 숫자를 쉼표로 구분해 주세요.')

## H-68a8ebd32e92

**@callback:s.split(',').map** · [src/ui/math-templates.tsx:920](../../../src/ui/math-templates.tsx#L920)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 920행 | 별도 조건식 없음 | Number(s.trim())<br>call |
| 920행 | 별도 조건식 없음 | s.trim()<br>call |

## H-ae92bc125b10

**@callback:s.split(',').some** · [src/ui/math-templates.tsx:923](../../../src/ui/math-templates.tsx#L923)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 923행 | falsy: v.length !== 2 | s.trim()<br>call |

## H-852e62bef22d

**@callback:v.some** · [src/ui/math-templates.tsx:924](../../../src/ui/math-templates.tsx#L924)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 924행 | falsy: v.length !== 2 \|\|<br>                  s.split(',').some((s) => !s.trim()) | Number.isFinite(n)<br>call |
| 924행 | falsy: v.length !== 2 \|\|<br>                  s.split(',').some((s) => !s.trim()) ∧ falsy: !Number.isFinite(n) | Math.abs(n)<br>call |

