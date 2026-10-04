# src/ui/study-workspace.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-60e25e72a3d7

**useStudyWorkspace** · [src/ui/study-workspace.tsx:17](../../../src/ui/study-workspace.tsx#L17)

분기 조건과 가능한 갈림길:

- B-ff274ece10d4 · ConditionalExpression · boot.key === key → truthy / falsy; 바깥 조건: 별도 조건식 없음 (21행).
- B-cfcd832d3e95 · IfStatement · !storedRaw.current.has(key) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (24행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 18행 | 별도 조건식 없음 | workStateKey(data)<br>call |
| 19행 | 별도 조건식 없음 | useState(() => ({ key, ...readWorkState(key) }))<br>call<br>전달 콜백: H-35a2b434ef2d |
| 20행 | 별도 조건식 없음 | useState('')<br>call |
| 21행 | falsy: boot.key === key | readWorkState(key)<br>call |
| 23행 | 별도 조건식 없음 | useRef(new Map<string, string \| null>())<br>call |
| 24행 | 별도 조건식 없음 | storedRaw.current.has(key)<br>call |
| 24행 | truthy: !storedRaw.current.has(key) | storedRaw.current.set(key, current.raw)<br>call |
| 25행 | 별도 조건식 없음 | useRef(Promise.resolve())<br>call |
| 25행 | 별도 조건식 없음 | Promise.resolve()<br>call |
| 26행 | 별도 조건식 없음 | useRef(0)<br>call |
| 27행 | 별도 조건식 없음 | useRef(key)<br>call |
| 28행 | 별도 조건식 없음 | useEffect(() => { setBoot({ key, ...readWorkState(key) }); setError(''); }, [key])<br>call<br>전달 콜백: H-98697fb501df |

반환/조기 중단: 71행 { state, layout, setLayout, openTool, change, error: current.error || error, reload, retry: () => change(state), key, } [별도 조건식 없음]

## H-35a2b434ef2d

**@callback:useState** · [src/ui/study-workspace.tsx:19](../../../src/ui/study-workspace.tsx#L19)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 19행 | 별도 조건식 없음 | readWorkState(key)<br>call |

## H-98697fb501df

**@callback:useEffect** · [src/ui/study-workspace.tsx:28](../../../src/ui/study-workspace.tsx#L28)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 29행 | 별도 조건식 없음 | setBoot({ key, ...readWorkState(key) })<br>state-update |
| 29행 | 별도 조건식 없음 | readWorkState(key)<br>call |
| 30행 | 별도 조건식 없음 | setError('')<br>state-update |

## H-f7b899facc8a

**StudyWorkspace** · [src/ui/study-workspace.tsx:92](../../../src/ui/study-workspace.tsx#L92)

분기 조건과 가능한 갈림길:

- B-f34849174c96 · ConditionalExpression · layout.open && !visited.includes(layout.tool) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (105행).
- B-002b18bf815c · ConditionalExpression · layout.open → truthy / falsy; 바깥 조건: 별도 조건식 없음 (138행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 104행 | 별도 조건식 없음 | useState(() => (layout.open ? [layout.tool] : []))<br>call<br>전달 콜백: H-6eff994aafec |
| 105행 | truthy: layout.open | visited.includes(layout.tool)<br>call |
| 106행 | 별도 조건식 없음 | useEffect(() => { if (layout.open) setVisited((previous) => previous.includes(layout.tool) ? previous : [...previous, layout.tool], ); }, [layout.open, layout.tool])<br>call<br>전달 콜백: H-8e4652c032d2 |
| 112행 | 별도 조건식 없음 | useRef(null)<br>call |
| 113행 | 별도 조건식 없음 | useState(false)<br>call |
| 114행 | 별도 조건식 없음 | useEffect(() => { const element = container.current; if (!element \|\| typeof ResizeObserver === 'undefined') return; const update = () => setNarrow(element.clientWidth <= 760); update(); const observer = new ResizeObserver(update); observer.observe(element); return () => observer.disconnect(); }, [])<br>call<br>전달 콜백: H-77105ff50b39 |
| 154행 | truthy: layout.open | Object.entries(TOOL_NAMES).map(([value, name]) => ( <option key={value} value={value}> {name} </option> ))<br>call<br>전달 콜백: H-7e7f9cba7402 |
| 154행 | truthy: layout.open | Object.entries(TOOL_NAMES)<br>call |
| 209행 | visible-when-falsy: !layout.open | shown.map((tool) => ( <section key={tool} hidden={tool !== layout.tool} aria-label={`곁 도구: ${TOOL_NAMES[tool]}`} > <h2>{TOOL_NAMES[tool]}</h2> {renderTool(tool, layout.open && tool === layout.tool && layout.focus !== 'source' && (layout.focus === 'tool' \|\| !narrow \|\| layout.pane === 'tool'))} </section> ))<br>call<br>전달 콜백: H-3bdf2b6492f3 |

반환/조기 중단: 124행 <render> [별도 조건식 없음]

## H-6eff994aafec

**@callback:useState** · [src/ui/study-workspace.tsx:104](../../../src/ui/study-workspace.tsx#L104)

분기 조건과 가능한 갈림길:

- B-6d1e2e332f6c · ConditionalExpression · layout.open → truthy / falsy; 바깥 조건: 별도 조건식 없음 (104행).

## H-8e4652c032d2

**@callback:useEffect** · [src/ui/study-workspace.tsx:106](../../../src/ui/study-workspace.tsx#L106)

분기 조건과 가능한 갈림길:

- B-967da249d5ff · IfStatement · layout.open → truthy / falsy; 바깥 조건: 별도 조건식 없음 (107행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 108행 | truthy: layout.open | setVisited((previous) => previous.includes(layout.tool) ? previous : [...previous, layout.tool])<br>state-update<br>전달 콜백: H-5610ce836fa4 |

## H-5610ce836fa4

**@callback:setVisited** · [src/ui/study-workspace.tsx:108](../../../src/ui/study-workspace.tsx#L108)

분기 조건과 가능한 갈림길:

- B-8d7c6c8fa0e6 · ConditionalExpression · previous.includes(layout.tool) → truthy / falsy; 바깥 조건: truthy: layout.open (109행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 109행 | truthy: layout.open | previous.includes(layout.tool)<br>call |

## H-77105ff50b39

**@callback:useEffect** · [src/ui/study-workspace.tsx:114](../../../src/ui/study-workspace.tsx#L114)

분기 조건과 가능한 갈림길:

- B-d819f7b9c21e · IfStatement · !element || typeof ResizeObserver === 'undefined' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (116행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 118행 | 별도 조건식 없음 | update()<br>call → [H-65847ead7557](ui__study-workspace.md#h-65847ead7557) |
| 120행 | 별도 조건식 없음 | observer.observe(element)<br>call |

반환/조기 중단: 116행 <render> [truthy: !element || typeof ResizeObserver === 'undefined']; 121행 () => observer.disconnect() [별도 조건식 없음]

## H-65847ead7557

**update** · [src/ui/study-workspace.tsx:117](../../../src/ui/study-workspace.tsx#L117)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 117행 | 별도 조건식 없음 | setNarrow(element.clientWidth <= 760)<br>state-update |

## H-827acf16bbc7

**@onClick** · [src/ui/study-workspace.tsx:136](../../../src/ui/study-workspace.tsx#L136)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 136행 | 별도 조건식 없음 | setLayout({ ...layout, open: !layout.open })<br>state-update |

## H-8124745f8a1c

**@onChange** · [src/ui/study-workspace.tsx:145](../../../src/ui/study-workspace.tsx#L145)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 146행 | truthy: layout.open | setLayout({ ...layout, tool: event.target.value as WorkspaceTool, pane: 'tool', focus: 'both', })<br>state-update |

## H-7e7f9cba7402

**@callback:Object.entries(TOOL_NAMES).map** · [src/ui/study-workspace.tsx:154](../../../src/ui/study-workspace.tsx#L154)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b2ad5e5f9c23

**@onChange** · [src/ui/study-workspace.tsx:168](../../../src/ui/study-workspace.tsx#L168)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 168행 | truthy: layout.open | setLayout({ ...layout, width: Number(event.target.value) })<br>state-update |
| 168행 | truthy: layout.open | Number(event.target.value)<br>call |

## H-613435aa7d06

**@onChange** · [src/ui/study-workspace.tsx:174](../../../src/ui/study-workspace.tsx#L174)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 175행 | truthy: layout.open | setLayout({ ...layout, focus: event.target.value as 'both' \| 'source' \| 'tool' })<br>state-update |

## H-52c367fbd390

**@onClick** · [src/ui/study-workspace.tsx:183](../../../src/ui/study-workspace.tsx#L183)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 183행 | truthy: layout.open | setLayout({ ...layout, width: DEFAULT_DESK.width, focus: 'both' })<br>state-update |

## H-b37d7a8df20e

**@onClick** · [src/ui/study-workspace.tsx:190](../../../src/ui/study-workspace.tsx#L190)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 190행 | truthy: layout.open | setLayout({ ...layout, pane: 'source', focus: 'both' })<br>state-update |

## H-7a83122a9c04

**@onClick** · [src/ui/study-workspace.tsx:196](../../../src/ui/study-workspace.tsx#L196)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 196행 | truthy: layout.open | setLayout({ ...layout, pane: 'tool', focus: 'both' })<br>state-update |

## H-3bdf2b6492f3

**@callback:shown.map** · [src/ui/study-workspace.tsx:209](../../../src/ui/study-workspace.tsx#L209)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 216행 | visible-when-falsy: !layout.open ∧ visible-when-falsy: tool !== layout.tool | renderTool(tool, layout.open && tool === layout.tool && layout.focus !== 'source' && (layout.focus === 'tool' \|\| !narrow \|\| layout.pane === 'tool'))<br>call |

## H-b8a4870e8910

**SavedWorkspaces** · [src/ui/study-workspace.tsx:226](../../../src/ui/study-workspace.tsx#L226)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 235행 | 별도 조건식 없음 | useState(false)<br>call |
| 236행 | 별도 조건식 없음 | useState('')<br>call |
| 237행 | 별도 조건식 없음 | useState('')<br>call |
| 238행 | 별도 조건식 없음 | useState(null)<br>call |
| 239행 | 별도 조건식 없음 | useState(null)<br>call |
| 240행 | 별도 조건식 없음 | useState('')<br>call |
| 266행 | truthy: open | name.trim()<br>call |
| 304행 | truthy: open | state.saved.map((item) => ( <li key={item.id}> {renaming === item.id ? ( <> <Input label="새 작업 이름" maxLength={120} value={newName} onChange={(event) => setNewName(event.target.value)} /> <Button disabled={!newName.trim()} onClick={() => { change({ ...state, saved: state.saved.map((s) => s.id === item.id ? { ...s, name: newName.trim() } : s, ), }); setRenaming(null); }} > 이름 저장 </Button> <Button onClick={() => setRenaming(null)}>취소</Button> </> ) : ( <strong>{item.name}</strong> )} <span> {observatoryRouteTitle(data, item.route)} · {TOOL_NAMES[item.layout.tool]} </span> {routeAvailable(data, item.route) ? ( <Button onClick={() => { change({ ...state, layouts: { ...state.layouts, [item.route]: { ...item.layou … [전체 인수는 JSON·소스])<br>mutation-request<br>전달 콜백: H-45a3a5ae2422 |

반환/조기 중단: 242행 <render> [별도 조건식 없음]

## H-4c053d266aca

**@onClick** · [src/ui/study-workspace.tsx:245](../../../src/ui/study-workspace.tsx#L245)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 246행 | 별도 조건식 없음 | setName(observatoryRouteTitle(data, route))<br>state-update |
| 246행 | 별도 조건식 없음 | observatoryRouteTitle(data, route)<br>call → [H-b95917fcb671](ui__observatory-navigation.md#h-b95917fcb671) |
| 247행 | 별도 조건식 없음 | setStatus('')<br>state-update |
| 248행 | 별도 조건식 없음 | setOpen(true)<br>state-update |

## H-3bedf292ab19

**@onClose** · [src/ui/study-workspace.tsx:253](../../../src/ui/study-workspace.tsx#L253)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 253행 | truthy: open | setOpen(false)<br>state-update |

## H-627099eda9de

**@onChange** · [src/ui/study-workspace.tsx:263](../../../src/ui/study-workspace.tsx#L263)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 263행 | truthy: open | setName(event.target.value)<br>state-update |

## H-bf5aa69bed8b

**@onClick** · [src/ui/study-workspace.tsx:267](../../../src/ui/study-workspace.tsx#L267) · async

분기 조건과 가능한 갈림길:

- B-ed5f611bdbfc · ConditionalExpression · ok → truthy / falsy; 바깥 조건: truthy: open (277행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 269행 | truthy: open | crypto.randomUUID()<br>call |
| 270행 | truthy: open | name.trim()<br>call |
| 273행 | truthy: open | new Date().toISOString()<br>call |
| 275행 | truthy: open | change({ ...state, saved: [...state.saved, saved] })<br>call |
| 276행 | truthy: open | setStatus(ok ? '작업 구성을 보관했습니다.' : '작업 구성을 저장하지 못했습니다. 안내에 따라 다시 시도해 주세요.')<br>state-update |

## H-f1e1c619f353

**@onClick** · [src/ui/study-workspace.tsx:288](../../../src/ui/study-workspace.tsx#L288)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 289행 | truthy: open ∧ truthy: deleted | change({ ...state, saved: [...state.saved, deleted] })<br>call |
| 290행 | truthy: open ∧ truthy: deleted | setDeleted(null)<br>state-update |
| 291행 | truthy: open ∧ truthy: deleted | setStatus('작업 구성을 되돌렸습니다.')<br>state-update |

## H-45a3a5ae2422

**@callback:state.saved.map** · [src/ui/study-workspace.tsx:304](../../../src/ui/study-workspace.tsx#L304)

분기 조건과 가능한 갈림길:

- B-5195dc200b2a · ConditionalExpression · renaming === item.id → truthy / falsy; 바깥 조건: truthy: open (306행).
- B-a68101e188ef · ConditionalExpression · routeAvailable(data, item.route) → truthy / falsy; 바깥 조건: truthy: open (336행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 315행 | truthy: open ∧ truthy: renaming === item.id | newName.trim()<br>call |
| 334행 | truthy: open | observatoryRouteTitle(data, item.route)<br>call → [H-b95917fcb671](ui__observatory-navigation.md#h-b95917fcb671) |
| 336행 | truthy: open | routeAvailable(data, item.route)<br>call → [H-34a83c7406c7](ui__observatory-navigation.md#h-34a83c7406c7) |

## H-bdbe116a4b4f

**@onChange** · [src/ui/study-workspace.tsx:312](../../../src/ui/study-workspace.tsx#L312)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 312행 | truthy: open ∧ truthy: renaming === item.id | setNewName(event.target.value)<br>state-update |

## H-dadd7556ca0c

**@onClick** · [src/ui/study-workspace.tsx:316](../../../src/ui/study-workspace.tsx#L316)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 317행 | truthy: open ∧ truthy: renaming === item.id | change({ ...state, saved: state.saved.map((s) => s.id === item.id ? { ...s, name: newName.trim() } : s, ), })<br>call |
| 319행 | truthy: open ∧ truthy: renaming === item.id | state.saved.map((s) => s.id === item.id ? { ...s, name: newName.trim() } : s)<br>mutation-request<br>전달 콜백: H-a7adbb64bb64 |
| 323행 | truthy: open ∧ truthy: renaming === item.id | setRenaming(null)<br>state-update |

## H-a7adbb64bb64

**@callback:state.saved.map** · [src/ui/study-workspace.tsx:319](../../../src/ui/study-workspace.tsx#L319)

분기 조건과 가능한 갈림길:

- B-e797b7323b4b · ConditionalExpression · s.id === item.id → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: renaming === item.id (320행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 320행 | truthy: open ∧ truthy: renaming === item.id ∧ truthy: s.id === item.id | newName.trim()<br>call |

## H-3b37eadddfbe

**@onClick** · [src/ui/study-workspace.tsx:328](../../../src/ui/study-workspace.tsx#L328)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 328행 | truthy: open ∧ truthy: renaming === item.id | setRenaming(null)<br>state-update |

## H-2ac5f0a318e3

**@onClick** · [src/ui/study-workspace.tsx:338](../../../src/ui/study-workspace.tsx#L338)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 339행 | truthy: open ∧ truthy: routeAvailable(data, item.route) | change({ ...state, layouts: { ...state.layouts, [item.route]: { ...item.layout } }, })<br>call |
| 343행 | truthy: open ∧ truthy: routeAvailable(data, item.route) | setOpen(false)<br>state-update |
| 344행 | truthy: open ∧ truthy: routeAvailable(data, item.route) | navigate(item.route)<br>navigation |

## H-5e834607406c

**@onClick** · [src/ui/study-workspace.tsx:352](../../../src/ui/study-workspace.tsx#L352)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 352행 | truthy: open ∧ falsy: routeAvailable(data, item.route) | setOpen(false)<br>state-update |

## H-849fc2572a07

**@onClick** · [src/ui/study-workspace.tsx:358](../../../src/ui/study-workspace.tsx#L358)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 359행 | truthy: open | setRenaming(item.id)<br>state-update |
| 360행 | truthy: open | setNewName(item.name)<br>state-update |

## H-e58e4082f433

**@onClick** · [src/ui/study-workspace.tsx:366](../../../src/ui/study-workspace.tsx#L366)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 367행 | truthy: open | setDeleted(item)<br>state-update |
| 368행 | truthy: open | change({ ...state, saved: state.saved.filter((s) => s.id !== item.id) })<br>call |
| 368행 | truthy: open | state.saved.filter((s) => s.id !== item.id)<br>mutation-request<br>전달 콜백: H-b8ac44487813 |
| 369행 | truthy: open | setStatus(`“${item.name}” 작업 구성만 삭제했습니다. 원문과 공부 기록은 유지됩니다.`)<br>state-update |

## H-b8ac44487813

**@callback:state.saved.filter** · [src/ui/study-workspace.tsx:368](../../../src/ui/study-workspace.tsx#L368)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ef1841cbd83a

**WorkspaceStorageNotice** · [src/ui/study-workspace.tsx:383](../../../src/ui/study-workspace.tsx#L383)

분기 조건과 가능한 갈림길:

- B-a73f6086b5ec · ConditionalExpression · controller.error → truthy / falsy; 바깥 조건: 별도 조건식 없음 (384행).

반환/조기 중단: 384행 controller.error ? ( <div> <ErrorState message={controller.error} /> <Button onClick={controller.retry}>저장 다시 시도</Button> <Button onClick={controller.reload}>다시 읽기</Button> </div> ) : null [별도 조건식 없음]

