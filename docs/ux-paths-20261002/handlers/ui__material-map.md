# src/ui/material-map.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-eb746704a867

**MaterialMap** · [src/ui/material-map.tsx:18](../../../src/ui/material-map.tsx#L18)

분기 조건과 가능한 갈림길:

- B-7249e27b3f18 · ConditionalExpression · tools.value.mode === 'move' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (153행).
- B-4bced7d5c452 · ConditionalExpression · canvasBusy → truthy / falsy; 바깥 조건: 별도 조건식 없음 (227행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 35행 | 별도 조건식 없음 | useFlowPreferences(flowPreferencesKey(owner, 'material-map'))<br>call |
| 35행 | 별도 조건식 없음 | flowPreferencesKey(owner, 'material-map')<br>call |
| 36행 | 별도 조건식 없음 | useRef(null)<br>call |
| 37행 | 별도 조건식 없음 | useState([])<br>call |
| 38행 | 별도 조건식 없음 | useState('')<br>call |
| 39행 | 별도 조건식 없음 | useState(false)<br>call |
| 40행 | 별도 조건식 없음 | useMemo(() => map.nodes.map((n, i) => ({ id: n.id, data: { label: n.label }, position: map.positions?.[n.id] ?? { x: (i % 4) * 260, y: Math.floor(i / 4) * 160 }, ariaLabel: `개념 ${n.label}`, style: { width: 240, whiteSpace: 'pre-wrap' as const, overflowWrap: 'anywhere' as const, color: 'var(--color-text)', background: 'var(--color-surface)', borderColor: 'var(--color-border)', }, })), [map])<br>call<br>전달 콜백: H-f40e562032e5 |
| 58행 | 별도 조건식 없음 | map.edges.map((e) => ({ id: e.id, type: flowEdgeType(tools.value.edgeStyle), source: e.from, target: e.to, label: e.label, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: 'var(--color-muted)' }, labelStyle: { fill: 'var(--color-text)' }, labelBgStyle: { fill: 'var(--color-surface)' }, }))<br>call<br>전달 콜백: H-e20118448c8f |
| 76행 | 별도 조건식 없음 | map.nodes.find((n) => `node:${n.id}` === selected)<br>call<br>전달 콜백: H-597d35a3f29f |
| 77행 | 별도 조건식 없음 | map.edges.find((e) => `edge:${e.id}` === selected)<br>call<br>전달 콜백: H-e110ac433eba |
| 78행 | 별도 조건식 없음 | useState({})<br>call |
| 79행 | 별도 조건식 없음 | useState({})<br>call |
| 83행 | 별도 조건식 없음 | useEffect(() => { setPositions({}); }, [map.positions])<br>call<br>전달 콜백: H-982ab8882945 |
| 86행 | 별도 조건식 없음 | useCallback(({ nodes }: { nodes: Node[] }) => { const ids = nodes.map((node) => node.id); setSelectedIds((previous) => JSON.stringify(previous) === JSON.stringify(ids) ? previous : ids, ); if (ids.length === 1) setSelected(`node:${ids[0]}`); }, [])<br>call<br>전달 콜백: H-3f3c7fca513f |
| 93행 | 별도 조건식 없음 | nodes.map((n) => ({ ...n, measured: measurements[n.id], position: positions[n.id] ?? n.position, selected: selectedIds.includes(n.id), }))<br>call<br>전달 콜백: H-ed4d735992cf |
| 186행 | 별도 조건식 없음 | map.nodes.map((node) => ( <option key={`node:${node.id}`} value={`node:${node.id}`}> 개념 · {node.label} </option> ))<br>call<br>전달 콜백: H-c81975a9894c |
| 191행 | 별도 조건식 없음 | map.edges.map((edge) => ( <option key={`edge:${edge.id}`} value={`edge:${edge.id}`}> 관계 · {edge.label} </option> ))<br>call<br>전달 콜백: H-3f2eb4c9fc41 |
| 255행 | truthy: node | (['x', 'y'] as const).map((axis) => ( <Input key={axis} label={axis === 'x' ? '개념 가로 위치' : '개념 세로 위치'} type="number" min={-1000000} max={1000000} value={ map.positions?.[node.id]?.[axis] ?? (axis === 'x' ? (map.nodes.indexOf(node) % 4) * 260 : Math.floor(map.nodes.indexOf(node) / 4) * 160) } disabled={disabled} onChange={(event) => move(node.id, axis, event.target.value)} /> ))<br>call<br>전달 콜백: H-5a7d6bc2e686 |
| 273행 | truthy: node | evidence(node.sourceIds)<br>call |
| 292행 | truthy: edge | evidence(edge.sourceIds)<br>call |
| 297행 | 별도 조건식 없음 | map.nodes.map((n) => ( <div key={n.id}> <Input label={`개념 ${n.id}`} value={n.label} maxLength={1000} disabled={disabled} onChange={(e) => onChange({ ...map, nodes: map.nodes.map((row) => row.id === n.id ? { ...row, label: e.target.value } : row, ), }) } /> {evidence(n.sourceIds)} </div> ))<br>call<br>전달 콜백: H-99ba9b34a8e1 |
| 316행 | 별도 조건식 없음 | map.edges.map((e) => ( <div key={e.id}> <p> {map.nodes.find((n) => n.id === e.from)?.label} →{' '} {map.nodes.find((n) => n.id === e.to)?.label} </p> <Input label={`관계 ${e.id}`} value={e.label} disabled={disabled} maxLength={300} onChange={(event) => onChange({ ...map, edges: map.edges.map((row) => row.id === e.id ? { ...row, label: event.target.value } : row, ), }) } /> {evidence(e.sourceIds)} </div> ))<br>call<br>전달 콜백: H-37a7674a0c12 |

반환/조기 중단: 99행 <render> [별도 조건식 없음]

## H-f40e562032e5

**@callback:useMemo** · [src/ui/material-map.tsx:41](../../../src/ui/material-map.tsx#L41)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 42행 | 별도 조건식 없음 | map.nodes.map((n, i) => ({ id: n.id, data: { label: n.label }, position: map.positions?.[n.id] ?? { x: (i % 4) * 260, y: Math.floor(i / 4) * 160 }, ariaLabel: `개념 ${n.label}`, style: { width: 240, whiteSpace: 'pre-wrap' as const, overflowWrap: 'anywhere' as const, color: 'var(--color-text)', background: 'var(--color-surface)', borderColor: 'var(--color-border)', }, }))<br>call<br>전달 콜백: H-a3035c603efe |

## H-a3035c603efe

**@callback:map.nodes.map** · [src/ui/material-map.tsx:42](../../../src/ui/material-map.tsx#L42)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 45행 | nullish: map.positions?.[n.id] | Math.floor(i / 4)<br>call |

## H-e20118448c8f

**@callback:map.edges.map** · [src/ui/material-map.tsx:58](../../../src/ui/material-map.tsx#L58)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 60행 | 별도 조건식 없음 | flowEdgeType(tools.value.edgeStyle)<br>call → [H-e5c9f4b796e1](ui__flow-experience.md#h-e5c9f4b796e1) |

## H-a003a0c00d89

**move** · [src/ui/material-map.tsx:69](../../../src/ui/material-map.tsx#L69)

분기 조건과 가능한 갈림길:

- B-963dd6067fcc · IfStatement · !value || !Number.isFinite(n) || Math.abs(n) > 1e6 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (72행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 70행 | 별도 조건식 없음 | Number(value)<br>call |
| 71행 | 별도 조건식 없음 | map.nodes.findIndex((row) => row.id === id)<br>call<br>전달 콜백: H-8ef976d8fac3 |
| 72행 | falsy: !value | Number.isFinite(n)<br>call |
| 72행 | falsy: !value \|\| !Number.isFinite(n) | Math.abs(n)<br>call |
| 73행 | nullish: map.positions?.[id] | Math.floor(i / 4)<br>call |
| 74행 | 별도 조건식 없음 | onChange({ ...map, positions: { ...map.positions, [id]: { ...current, [axis]: n } } })<br>call |

반환/조기 중단: 72행 <render> [truthy: !value || !Number.isFinite(n) || Math.abs(n) > 1e6]

## H-8ef976d8fac3

**@callback:map.nodes.findIndex** · [src/ui/material-map.tsx:71](../../../src/ui/material-map.tsx#L71)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-597d35a3f29f

**@callback:map.nodes.find** · [src/ui/material-map.tsx:76](../../../src/ui/material-map.tsx#L76)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e110ac433eba

**@callback:map.edges.find** · [src/ui/material-map.tsx:77](../../../src/ui/material-map.tsx#L77)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-982ab8882945

**@callback:useEffect** · [src/ui/material-map.tsx:83](../../../src/ui/material-map.tsx#L83)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 84행 | 별도 조건식 없음 | setPositions({})<br>state-update |

## H-3f3c7fca513f

**@callback:useCallback** · [src/ui/material-map.tsx:86](../../../src/ui/material-map.tsx#L86)

분기 조건과 가능한 갈림길:

- B-f6619ee1c45e · IfStatement · ids.length === 1 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (91행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 87행 | 별도 조건식 없음 | nodes.map((node) => node.id)<br>call<br>전달 콜백: H-2f5c96b2167b |
| 88행 | 별도 조건식 없음 | setSelectedIds((previous) => JSON.stringify(previous) === JSON.stringify(ids) ? previous : ids)<br>state-update<br>전달 콜백: H-d44cd4525d30 |
| 91행 | truthy: ids.length === 1 | setSelected(`node:${ids[0]}`)<br>state-update |

## H-2f5c96b2167b

**@callback:nodes.map** · [src/ui/material-map.tsx:87](../../../src/ui/material-map.tsx#L87)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d44cd4525d30

**@callback:setSelectedIds** · [src/ui/material-map.tsx:88](../../../src/ui/material-map.tsx#L88)

분기 조건과 가능한 갈림길:

- B-444ffb637cfe · ConditionalExpression · JSON.stringify(previous) === JSON.stringify(ids) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (89행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 89행 | 별도 조건식 없음 | JSON.stringify(previous)<br>call |
| 89행 | 별도 조건식 없음 | JSON.stringify(ids)<br>call |

## H-ed4d735992cf

**@callback:nodes.map** · [src/ui/material-map.tsx:93](../../../src/ui/material-map.tsx#L93)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 97행 | 별도 조건식 없음 | selectedIds.includes(n.id)<br>call |

## H-430b09b7d4e3

**@onInit** · [src/ui/material-map.tsx:103](../../../src/ui/material-map.tsx#L103)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-8be6a9b91a15

**@onNodeClick** · [src/ui/material-map.tsx:111](../../../src/ui/material-map.tsx#L111)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 111행 | 별도 조건식 없음 | setSelected(`node:${n.id}`)<br>state-update |

## H-a2401fd3be9d

**@onEdgeClick** · [src/ui/material-map.tsx:112](../../../src/ui/material-map.tsx#L112)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 112행 | 별도 조건식 없음 | setSelected(`edge:${e.id}`)<br>state-update |

## H-b0c14a71ace3

**@onNodesChange** · [src/ui/material-map.tsx:114](../../../src/ui/material-map.tsx#L114)

분기 조건과 가능한 갈림길:

- B-3455ab4324b3 · IfStatement · c.type === 'position' && c.position → truthy / falsy; 바깥 조건: 별도 조건식 없음 (119행).
- B-95fbc54a74a4 · IfStatement · !c.dragging → truthy / falsy; 바깥 조건: truthy: c.type === 'position' && c.position (121행).
- B-4e406b1254dd · IfStatement · c.type === 'dimensions' && c.dimensions → truthy / falsy; 바깥 조건: falsy: c.type === 'position' && c.position (122행).
- B-2f77ce502690 · IfStatement · c.type === 'select' → truthy / falsy; 바깥 조건: falsy: c.type === 'position' && c.position ∧ falsy: c.type === 'dimensions' && c.dimensions (124행).
- B-a2f9fe7ebc59 · IfStatement · Object.keys(moved).length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (130행).
- B-d5e9a4166677 · IfStatement · Object.keys(measured).length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (131행).
- B-9d457c2a18bf · IfStatement · !disabled && Object.entries(committed).some( ([id, point]) => JSON.stringify(map.positions?.[id]) !== JSON.stringify(point), ) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (140행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 125행 | falsy: c.type === 'position' && c.position ∧ falsy: c.type === 'dimensions' && c.dimensions ∧ truthy: c.type === 'select' | setSelectedIds((previous) => c.selected ? [...new Set([...previous, c.id])] : previous.filter((id) => id !== c.id))<br>state-update<br>전달 콜백: H-4586e3dee575 |
| 130행 | 별도 조건식 없음 | Object.keys(moved)<br>call |
| 130행 | truthy: Object.keys(moved).length | setPositions((p) => ({ ...p, ...moved }))<br>state-update<br>전달 콜백: H-196c080cd91f |
| 131행 | 별도 조건식 없음 | Object.keys(measured)<br>call |
| 132행 | truthy: Object.keys(measured).length | setMeasurements((previous) => Object.entries(measured).some( ([id, size]) => previous[id]?.width !== size.width \|\| previous[id]?.height !== size.height, ) ? { ...previous, ...measured } : previous)<br>state-update<br>전달 콜백: H-7267d92c1236 |
| 142행 | truthy: !disabled | Object.entries(committed).some(([id, point]) => JSON.stringify(map.positions?.[id]) !== JSON.stringify(point))<br>mutation-request<br>전달 콜백: H-a15108bedc84 |
| 142행 | truthy: !disabled | Object.entries(committed)<br>call |
| 146행 | truthy: !disabled &&<br>              Object.entries(committed).some(<br>                ([id, point]) => JSON.stringify(map.positions?.[id]) !== JSON.stringify(point),<br>              ) | onChange({ ...map, positions: { ...map.positions, ...committed } })<br>call |

## H-4586e3dee575

**@callback:setSelectedIds** · [src/ui/material-map.tsx:125](../../../src/ui/material-map.tsx#L125)

분기 조건과 가능한 갈림길:

- B-05b35be524fb · ConditionalExpression · c.selected → truthy / falsy; 바깥 조건: falsy: c.type === 'position' && c.position ∧ falsy: c.type === 'dimensions' && c.dimensions ∧ truthy: c.type === 'select' (126행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 128행 | falsy: c.type === 'position' && c.position ∧ falsy: c.type === 'dimensions' && c.dimensions ∧ truthy: c.type === 'select' ∧ falsy: c.selected | previous.filter((id) => id !== c.id)<br>call<br>전달 콜백: H-9ee72d85ee7e |

## H-9ee72d85ee7e

**@callback:previous.filter** · [src/ui/material-map.tsx:128](../../../src/ui/material-map.tsx#L128)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-196c080cd91f

**@callback:setPositions** · [src/ui/material-map.tsx:130](../../../src/ui/material-map.tsx#L130)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7267d92c1236

**@callback:setMeasurements** · [src/ui/material-map.tsx:132](../../../src/ui/material-map.tsx#L132)

분기 조건과 가능한 갈림길:

- B-5908df4a6071 · ConditionalExpression · Object.entries(measured).some( ([id, size]) => previous[id]?.width !== size.width || previous[id]?.height !== size.height, ) → truthy / falsy; 바깥 조건: truthy: Object.keys(measured).length (133행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 133행 | truthy: Object.keys(measured).length | Object.entries(measured).some(([id, size]) => previous[id]?.width !== size.width \|\| previous[id]?.height !== size.height)<br>call<br>전달 콜백: H-d64dbecc870a |
| 133행 | truthy: Object.keys(measured).length | Object.entries(measured)<br>call |

## H-d64dbecc870a

**@callback:Object.entries(measured).some** · [src/ui/material-map.tsx:134](../../../src/ui/material-map.tsx#L134)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a15108bedc84

**@callback:Object.entries(committed).some** · [src/ui/material-map.tsx:143](../../../src/ui/material-map.tsx#L143)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 143행 | truthy: !disabled | JSON.stringify(map.positions?.[id])<br>call |
| 143행 | truthy: !disabled | JSON.stringify(point)<br>call |

## H-ad33d9362611

**@onClick** · [src/ui/material-map.tsx:171](../../../src/ui/material-map.tsx#L171)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 171행 | truthy: tools.error | tools.store(tools.value)<br>call |

## H-46cd5580cc8f

**@onChange** · [src/ui/material-map.tsx:178](../../../src/ui/material-map.tsx#L178)

분기 조건과 가능한 갈림길:

- B-c514837c9dd6 · ConditionalExpression · event.target.value.startsWith('node:') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (180행).
- B-d9d4590cfaba · ConditionalExpression · id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (181행).
- B-66676c1b2979 · IfStatement · id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (182행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 179행 | 별도 조건식 없음 | setSelected(event.target.value)<br>state-update |
| 180행 | 별도 조건식 없음 | event.target.value.startsWith('node:')<br>call |
| 180행 | truthy: event.target.value.startsWith('node:') | event.target.value.slice(5)<br>call |
| 181행 | 별도 조건식 없음 | setSelectedIds(id ? [id] : [])<br>state-update |

## H-c81975a9894c

**@callback:map.nodes.map** · [src/ui/material-map.tsx:186](../../../src/ui/material-map.tsx#L186)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3f2eb4c9fc41

**@callback:map.edges.map** · [src/ui/material-map.tsx:191](../../../src/ui/material-map.tsx#L191)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-2acd9f609416

**@onClick** · [src/ui/material-map.tsx:200](../../../src/ui/material-map.tsx#L200)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 202행 | 별도 조건식 없음 | layoutFlowBoxes(measured.map((node) => ({ id: node.id, position: node.position, width: node.measured?.width ?? 240, height: node.measured?.height ?? 90, })), map.edges.map((edge) => ({ source: edge.from, target: edge.to })))<br>call |
| 203행 | 별도 조건식 없음 | measured.map((node) => ({ id: node.id, position: node.position, width: node.measured?.width ?? 240, height: node.measured?.height ?? 90, }))<br>call<br>전달 콜백: H-664e2d7210f9 |
| 209행 | 별도 조건식 없음 | map.edges.map((edge) => ({ source: edge.from, target: edge.to }))<br>call<br>전달 콜백: H-59836443f548 |
| 211행 | 별도 조건식 없음 | onChange({ ...map, positions: { ...map.positions, ...arranged } })<br>call |

## H-664e2d7210f9

**@callback:measured.map** · [src/ui/material-map.tsx:203](../../../src/ui/material-map.tsx#L203)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-59836443f548

**@callback:map.edges.map** · [src/ui/material-map.tsx:209](../../../src/ui/material-map.tsx#L209)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d683eb934f35

**@onClick** · [src/ui/material-map.tsx:218](../../../src/ui/material-map.tsx#L218) · async

분기 조건과 가능한 갈림길:

- B-86d321c18192 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (220행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 219행 | 별도 조건식 없음 | setCanvasBusy(true)<br>state-update |
| 221행 | 별도 조건식 없음 | onCanvas()<br>call |
| 223행 | always-after-try: try 완료 또는 예외 이후 | setCanvasBusy(false)<br>state-update |

## H-1b68245a6c81

**@onClick** · [src/ui/material-map.tsx:232](../../../src/ui/material-map.tsx#L232)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 232행 | truthy: originalMap | onChange(structuredClone(originalMap))<br>call |
| 232행 | truthy: originalMap | structuredClone(originalMap)<br>call |

## H-4974341fec7c

**@onChange** · [src/ui/material-map.tsx:245](../../../src/ui/material-map.tsx#L245)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 246행 | truthy: node | onChange({ ...map, nodes: map.nodes.map((n) => n.id === node.id ? { ...n, label: e.target.value } : n, ), })<br>call |
| 248행 | truthy: node | map.nodes.map((n) => n.id === node.id ? { ...n, label: e.target.value } : n)<br>call<br>전달 콜백: H-16fdc8491bf1 |

## H-16fdc8491bf1

**@callback:map.nodes.map** · [src/ui/material-map.tsx:248](../../../src/ui/material-map.tsx#L248)

분기 조건과 가능한 갈림길:

- B-0096335ea979 · ConditionalExpression · n.id === node.id → truthy / falsy; 바깥 조건: truthy: node (249행).

## H-5a7d6bc2e686

**@callback:(['x', 'y'] as const).map** · [src/ui/material-map.tsx:255](../../../src/ui/material-map.tsx#L255)

분기 조건과 가능한 갈림길:

- B-605d1413009e · ConditionalExpression · axis === 'x' → truthy / falsy; 바깥 조건: truthy: node (258행).
- B-dca875f24483 · ConditionalExpression · axis === 'x' → truthy / falsy; 바깥 조건: truthy: node ∧ nullish: map.positions?.[node.id]?.[axis] (264행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 265행 | truthy: node ∧ nullish: map.positions?.[node.id]?.[axis] ∧ truthy: axis === 'x' | map.nodes.indexOf(node)<br>call |
| 266행 | truthy: node ∧ nullish: map.positions?.[node.id]?.[axis] ∧ falsy: axis === 'x' | Math.floor(map.nodes.indexOf(node) / 4)<br>call |
| 266행 | truthy: node ∧ nullish: map.positions?.[node.id]?.[axis] ∧ falsy: axis === 'x' | map.nodes.indexOf(node)<br>call |

## H-06339adb8103

**@onChange** · [src/ui/material-map.tsx:269](../../../src/ui/material-map.tsx#L269)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 269행 | truthy: node | move(node.id, axis, event.target.value)<br>call → [H-a003a0c00d89](ui__material-map.md#h-a003a0c00d89) |

## H-38444585c8b8

**@onChange** · [src/ui/material-map.tsx:283](../../../src/ui/material-map.tsx#L283)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 284행 | truthy: edge | onChange({ ...map, edges: map.edges.map((row) => row.id === edge.id ? { ...row, label: e.target.value } : row, ), })<br>call |
| 286행 | truthy: edge | map.edges.map((row) => row.id === edge.id ? { ...row, label: e.target.value } : row)<br>call<br>전달 콜백: H-2134b9f0d518 |

## H-2134b9f0d518

**@callback:map.edges.map** · [src/ui/material-map.tsx:286](../../../src/ui/material-map.tsx#L286)

분기 조건과 가능한 갈림길:

- B-a3ad0f60fd7a · ConditionalExpression · row.id === edge.id → truthy / falsy; 바깥 조건: truthy: edge (287행).

## H-99ba9b34a8e1

**@callback:map.nodes.map** · [src/ui/material-map.tsx:297](../../../src/ui/material-map.tsx#L297)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 313행 | 별도 조건식 없음 | evidence(n.sourceIds)<br>call |

## H-92f261f124a9

**@onChange** · [src/ui/material-map.tsx:304](../../../src/ui/material-map.tsx#L304)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 305행 | 별도 조건식 없음 | onChange({ ...map, nodes: map.nodes.map((row) => row.id === n.id ? { ...row, label: e.target.value } : row, ), })<br>call |
| 307행 | 별도 조건식 없음 | map.nodes.map((row) => row.id === n.id ? { ...row, label: e.target.value } : row)<br>call<br>전달 콜백: H-c94d6bd20c3d |

## H-c94d6bd20c3d

**@callback:map.nodes.map** · [src/ui/material-map.tsx:307](../../../src/ui/material-map.tsx#L307)

분기 조건과 가능한 갈림길:

- B-baab84e4f086 · ConditionalExpression · row.id === n.id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (308행).

## H-37a7674a0c12

**@callback:map.edges.map** · [src/ui/material-map.tsx:316](../../../src/ui/material-map.tsx#L316)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 319행 | 별도 조건식 없음 | map.nodes.find((n) => n.id === e.from)<br>call<br>전달 콜백: H-92e39da92a7c |
| 320행 | 별도 조건식 없음 | map.nodes.find((n) => n.id === e.to)<br>call<br>전달 콜백: H-277fba68fa4a |
| 336행 | 별도 조건식 없음 | evidence(e.sourceIds)<br>call |

## H-92e39da92a7c

**@callback:map.nodes.find** · [src/ui/material-map.tsx:319](../../../src/ui/material-map.tsx#L319)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-277fba68fa4a

**@callback:map.nodes.find** · [src/ui/material-map.tsx:320](../../../src/ui/material-map.tsx#L320)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4e31b862262c

**@onChange** · [src/ui/material-map.tsx:327](../../../src/ui/material-map.tsx#L327)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 328행 | 별도 조건식 없음 | onChange({ ...map, edges: map.edges.map((row) => row.id === e.id ? { ...row, label: event.target.value } : row, ), })<br>call |
| 330행 | 별도 조건식 없음 | map.edges.map((row) => row.id === e.id ? { ...row, label: event.target.value } : row)<br>call<br>전달 콜백: H-5032f55823ca |

## H-5032f55823ca

**@callback:map.edges.map** · [src/ui/material-map.tsx:330](../../../src/ui/material-map.tsx#L330)

분기 조건과 가능한 갈림길:

- B-4bfcf356c928 · ConditionalExpression · row.id === e.id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (331행).

