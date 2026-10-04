# src/ui/study-graph.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-3f38bb5526db

**Dot** · [src/ui/study-graph.tsx:67](../../../src/ui/study-graph.tsx#L67)

분기 조건과 가능한 갈림길:

- B-becd19f1839d · ConditionalExpression · data.selected → truthy / falsy; 바깥 조건: 별도 조건식 없음 (70행).
- B-530935b92cb7 · ConditionalExpression · data.labelVisible → truthy / falsy; 바깥 조건: 별도 조건식 없음 (70행).
- B-3567da18abb7 · ConditionalExpression · data.pinned → truthy / falsy; 바깥 조건: 별도 조건식 없음 (71행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 75행 | 별도 조건식 없음 | Math.max(data.size, 4 / data.zoom)<br>call |
| 77행 | 별도 조건식 없음 | Math.max(data.size * data.zoom, 4)<br>call |

반환/조기 중단: 68행 <render> [별도 조건식 없음]

## H-75239b079119

**DotEdge** · [src/ui/study-graph.tsx:98](../../../src/ui/study-graph.tsx#L98)

분기 조건과 가능한 갈림길:

- B-974f492811b0 · IfStatement · !from || !to → truthy / falsy; 바깥 조건: 별도 조건식 없음 (101행).
- B-97f23dc98ae7 · IfStatement · !distance → truthy / falsy; 바깥 조건: 별도 조건식 없음 (109행).
- B-1fe0ab5f8598 · ConditionalExpression · Math.abs(dx) >= Math.abs(dy) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (120행).
- B-07bed86aea5b · ConditionalExpression · dx > 0 → truthy / falsy; 바깥 조건: truthy: Math.abs(dx) >= Math.abs(dy) (121행).
- B-24be5252b1a6 · ConditionalExpression · dy > 0 → truthy / falsy; 바깥 조건: falsy: Math.abs(dx) >= Math.abs(dy) (124행).
- B-cf0a8db002d1 · ConditionalExpression · Math.abs(dx) >= Math.abs(dy) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (128행).
- B-db9441383ed3 · ConditionalExpression · dx > 0 → truthy / falsy; 바깥 조건: truthy: Math.abs(dx) >= Math.abs(dy) (129행).
- B-455b2d88099b · ConditionalExpression · dy > 0 → truthy / falsy; 바깥 조건: falsy: Math.abs(dx) >= Math.abs(dy) (132행).
- B-486268f9d685 · ConditionalExpression · style === 'bezier' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (138행).
- B-dad371ff648d · ConditionalExpression · style === 'smoothstep' || style === 'step' → truthy / falsy; 바깥 조건: falsy: style === 'bezier' (140행).
- B-b91342697c4c · ConditionalExpression · style === 'step' → truthy / falsy; 바깥 조건: falsy: style === 'bezier' ∧ truthy: style === 'smoothstep' || style === 'step' (141행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 99행 | 별도 조건식 없음 | useInternalNode(source)<br>call |
| 100행 | 별도 조건식 없음 | useInternalNode(target)<br>call |
| 106행 | 별도 조건식 없음 | center(from)<br>call → [H-63bd76ac06a7](ui__study-graph.md#h-63bd76ac06a7) |
| 107행 | 별도 조건식 없음 | center(to)<br>call → [H-63bd76ac06a7](ui__study-graph.md#h-63bd76ac06a7) |
| 108행 | 별도 조건식 없음 | Math.hypot(b.x - a.x, b.y - a.y)<br>call |
| 115행 | 별도 조건식 없음 | radius(from)<br>call → [H-bd928f076423](ui__study-graph.md#h-bd928f076423) |
| 116행 | 별도 조건식 없음 | radius(from)<br>call → [H-bd928f076423](ui__study-graph.md#h-bd928f076423) |
| 117행 | 별도 조건식 없음 | radius(to)<br>call → [H-bd928f076423](ui__study-graph.md#h-bd928f076423) |
| 118행 | 별도 조건식 없음 | radius(to)<br>call → [H-bd928f076423](ui__study-graph.md#h-bd928f076423) |
| 120행 | 별도 조건식 없음 | Math.abs(dx)<br>call |
| 120행 | 별도 조건식 없음 | Math.abs(dy)<br>call |
| 128행 | 별도 조건식 없음 | Math.abs(dx)<br>call |
| 128행 | 별도 조건식 없음 | Math.abs(dy)<br>call |
| 139행 | truthy: style === 'bezier' | getBezierPath(coordinates)<br>call |
| 141행 | falsy: style === 'bezier' ∧ truthy: style === 'smoothstep' \|\| style === 'step' | getSmoothStepPath({ ...coordinates, borderRadius: style === 'step' ? 0 : 5 })<br>call |
| 142행 | falsy: style === 'bezier' ∧ falsy: style === 'smoothstep' \|\| style === 'step' | getStraightPath(coordinates)<br>call |

반환/조기 중단: 101행 null [truthy: !from || !to]; 109행 null [truthy: !distance]; 143행 <render> [별도 조건식 없음]

## H-63bd76ac06a7

**center** · [src/ui/study-graph.tsx:102](../../../src/ui/study-graph.tsx#L102)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-bd928f076423

**radius** · [src/ui/study-graph.tsx:110](../../../src/ui/study-graph.tsx#L110)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 111행 | 별도 조건식 없음 | Math.min(Math.max(node.data.size, 4 / node.data.zoom) / 2, distance / 2)<br>call |
| 111행 | 별도 조건식 없음 | Math.max(node.data.size, 4 / node.data.zoom)<br>call |

## H-97bbafbb2da1

**StudyGraph** · [src/ui/study-graph.tsx:155](../../../src/ui/study-graph.tsx#L155)

분기 조건과 가능한 갈림길:

- B-afdc9aee2062 · ConditionalExpression · card → truthy / falsy; 바깥 조건: 별도 조건식 없음 (393행).
- B-48c84bedb69c · ConditionalExpression · subjects.some((s) => s.id === subject) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (415행).
- B-9d38303413ae · ConditionalExpression · nodes.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (541행).
- B-be9427e42947 · ConditionalExpression · tools.value.mode === 'move' → truthy / falsy; 바깥 조건: truthy: nodes.length (570행).
- B-b15f4142c5b2 · ConditionalExpression · card → truthy / falsy; 바깥 조건: 별도 조건식 없음 (598행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 156행 | 별도 조건식 없음 | useFlowPreferences(flowPreferencesKey(data, 'graph'), { edgeStyle: 'straight', background: 'none', })<br>call |
| 156행 | 별도 조건식 없음 | flowPreferencesKey(data, 'graph')<br>call |
| 161행 | 별도 조건식 없음 | useState(() => { try { return { preferences: readGraphPreferences(data), error: '', blocked: false }; } catch (e) { return { preferences: { ...defaultGraphPreferences }, error: String(e instanceof Error ? e.message : e), blocked: true, }; } })<br>call<br>전달 콜백: H-939c3ef7190c |
| 172행 | 별도 조건식 없음 | useState(boot.preferences.query)<br>call |
| 173행 | 별도 조건식 없음 | useState(boot.preferences.subject)<br>call |
| 174행 | 별도 조건식 없음 | useState(boot.preferences.notes)<br>call |
| 175행 | 별도 조건식 없음 | useState(boot.preferences.connections)<br>call |
| 176행 | 별도 조건식 없음 | useState(null)<br>call |
| 177행 | 별도 조건식 없음 | useState(boot.preferences.depth)<br>call |
| 178행 | 별도 조건식 없음 | useState(null)<br>call |
| 179행 | 별도 조건식 없음 | useState(boot.preferences.spacing)<br>call |
| 180행 | 별도 조건식 없음 | useState(null)<br>call |
| 181행 | 별도 조건식 없음 | useState(boot.error)<br>call |
| 182행 | 별도 조건식 없음 | useState(boot.blocked)<br>call |
| 183행 | 별도 조건식 없음 | useRef(JSON.stringify(boot.preferences))<br>call |
| 183행 | 별도 조건식 없음 | JSON.stringify(boot.preferences)<br>call |
| 184행 | 별도 조건식 없음 | graphPreferencesKey(data)<br>call |
| 185행 | 별도 조건식 없음 | useMemo(() => ({ version: 1 as const, query, subject, notes, connections, depth, spacing }), [query, subject, notes, connections, depth, spacing])<br>call<br>전달 콜백: H-b786e914cc83 |
| 201행 | 별도 조건식 없음 | useEffect(() => { if (preferencesBlocked \|\| JSON.stringify(preferences) === lastPreferences.current) return; try { writeGraphPreferences(data, preferences); lastPreferences.current = JSON.stringify(preferences); setPreferenceError(''); } catch { setPreferenceError( '보기 설정을 저장하지 못했습니다. 현재 화면은 유지했습니다. 저장 공간을 확인한 뒤 설정 저장을 다시 시도해 주세요.', ); } }, [data, preferences, preferencesBlocked])<br>call<br>전달 콜백: H-dba4fbffb007 |
| 213행 | 별도 조건식 없음 | data.subjects.filter((s) => !s.deletedAt && subjectIds.includes(s.id))<br>call<br>전달 콜백: H-7cf5f9c43344 |
| 214행 | 별도 조건식 없음 | JSON.stringify(subjectIds)<br>call |
| 215행 | 별도 조건식 없음 | useMemo(() => { const ids = JSON.parse(scopeKey) as string[]; return subject && ids.includes(subject) ? [subject] : ids; }, [scopeKey, subject])<br>call<br>전달 콜백: H-7ed7913eee44 |
| 219행 | 별도 조건식 없음 | useMemo(() => projectStudyGraph(data, scoped, { query, connections, notes, centerId, depth }), [data, scoped, query, connections, notes, centerId, depth])<br>call<br>전달 콜백: H-2fcaf328e482 |
| 224행 | 별도 조건식 없음 | JSON.stringify({ cards: graph.cards.map(({ id, name }) => ({ id, name })), links: graph.links.map(({ source, target }) => ({ source, target })), })<br>call |
| 225행 | 별도 조건식 없음 | graph.cards.map(({ id, name }) => ({ id, name }))<br>call<br>전달 콜백: H-78b3deecfcea |
| 226행 | 별도 조건식 없음 | graph.links.map(({ source, target }) => ({ source, target }))<br>call<br>전달 콜백: H-d37bcfdf683a |
| 228행 | 별도 조건식 없음 | useMemo(() => JSON.parse(signature) as { cards: LayoutCard[]; links: LayoutLink[] }, [signature])<br>call<br>전달 콜백: H-6689cf3a3813 |
| 232행 | 별도 조건식 없음 | useRef(null)<br>call |
| 233행 | 별도 조건식 없음 | useState({ width: 900, height: 550 })<br>call |
| 234행 | 별도 조건식 없음 | useState({})<br>call |
| 235행 | 별도 조건식 없음 | useRef({})<br>call |
| 236행 | 별도 조건식 없음 | useState({})<br>call |
| 237행 | 별도 조건식 없음 | useRef('')<br>call |
| 238행 | 별도 조건식 없음 | useState(0)<br>call |
| 239행 | 별도 조건식 없음 | useState(false)<br>call |
| 240행 | 별도 조건식 없음 | useState(false)<br>call |
| 241행 | 별도 조건식 없음 | useState('')<br>call |
| 242행 | 별도 조건식 없음 | useState(1)<br>call |
| 243행 | 별도 조건식 없음 | useMemo(() => graphLayoutParameters(input.cards, input.links, { frame, spacing }), [input, frame, spacing])<br>call<br>전달 콜백: H-9051bcdf6baf |
| 247행 | 별도 조건식 없음 | useEffect(() => { if (!stage.current) return; let pendingFrame = 0; const observer = new ResizeObserver(([entry]) => { if (!entry) return; const width = Math.round(entry.contentRect.width), height = Math.round(entry.contentRect.height); if (width <= 0 \|\| height <= 0) return; // Layout updates run after ResizeObserver delivery to avoid a resize loop. cancelAnimationFrame(pendingFrame); pendingFrame = requestAnimationFrame(() => { setFrame((old) => (old.width === width && old.height === height ? old : { width, height })); }); }); observer.observe(stage.current); return () => { observer.disconnect(); cancelAnimationFrame(pendingFrame); }; }, [])<br>call<br>전달 콜백: H-aa3c340f3185 |
| 268행 | truthy: graph.links.length > 0 | graph.links.every((link) => link.id.startsWith('auto:'))<br>call<br>전달 콜백: H-e8986aa1a5f7 |
| 269행 | 별도 조건식 없음 | useEffect(() => { const options = { frame, spacing, previous: previous.current, pinned }; const hierarchical = layoutMode === 'hierarchy' \|\| (layoutMode === 'auto' && onlyAutomaticLinks); const nextFitSignature = JSON.stringify({ input, frame, spacing, layoutMode }); const needsFit = fitSignature.current !== nextFitSignature; setBusy(true); setError(''); const apply = (next: Record<string, CanvasPosition>) => { previous.current = next; setPositions(next); if (needsFit) { fitSignature.current = nextFitSignature; setFitting(true); setFitRevision((n) => n + 1); } setBusy(false); }; if (hierarchical) { const next = layoutFlowBoxes( input.cards.map((card) => ({ id: card.id, position: { x: 0, y: 0 }, width: … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-8a0bc2c1e7f7 |
| 330행 | 별도 조건식 없음 | useMemo(() => graph.cards.map((card, index) => ({ id: card.id, type: 'dot', ariaLabel: card.name, // The touch target is fixed by .graph-dot. Explicit v12 handle geometry // also keeps edges available when WebKit defers offscreen observation. width: 44, height: 44, handles: [ { type: 'target', position: Position.Left, x: 0, y: 21.5, width: 1, height: 1 }, { type: 'source', position: Position.Right, x: 43, y: 21.5, width: 1, height: 1 }, ], position: positions[card.id] ?? { x: Math.cos(index) * 100, y: Math.sin(index) * 100 }, data: { card, selected: false, pinned: false, size: parameters.sizes[card.id], labelVisible: true, zoom: 1, }, })), [graph, positions, parameters])<br>call<br>전달 콜백: H-8c68f84b1dc5 |
| 356행 | 별도 조건식 없음 | useState(initial)<br>call |
| 357행 | 별도 조건식 없음 | useEffect(() => { setNodes((previous) => { const measured = new Map(previous.map((node) => [node.id, node.measured])); // Position updates must retain React Flow's completed DOM measurements. // Clearing them restarts observation and can leave a queued fit unresolved. return initial.map((node) => ({ ...node, measured: measured.get(node.id) })); }); }, [initial])<br>call<br>전달 콜백: H-48b646894b19 |
| 365행 | 별도 조건식 없음 | useEffect(() => { if (flow && fitRevision > 0) { let active = true; const id = requestAnimationFrame(() => { void flow.fitView({ padding: 0.3, minZoom: 0.02, maxZoom: 1.2 }).then(() => { if (active) setFitting(false); }); }); return () => { active = false; cancelAnimationFrame(id); }; } }, [flow, fitRevision])<br>call<br>전달 콜백: H-c7052739e154 |
| 380행 | 별도 조건식 없음 | graph.links<br>      .filter((e) => e.source === selected \|\| e.target === selected)<br>      .map((e) => (e.source === selected ? e.target : e.source))<br>call<br>전달 콜백: H-c87f525123f8 |
| 380행 | 별도 조건식 없음 | graph.links<br>      .filter((e) => e.source === selected \|\| e.target === selected)<br>call<br>전달 콜백: H-bfa163fe4152 |
| 384행 | 별도 조건식 없음 | graphVisibleLabels(input.cards, Object.fromEntries(nodes.map((n) => [n.id, n.position])), parameters.degree, zoom, selected, neighbourIds)<br>call |
| 386행 | 별도 조건식 없음 | Object.fromEntries(nodes.map((n) => [n.id, n.position]))<br>call |
| 386행 | 별도 조건식 없음 | nodes.map((n) => [n.id, n.position])<br>call<br>전달 콜백: H-22312965603b |
| 392행 | 별도 조건식 없음 | graph.cards.find((c) => c.id === selected)<br>call<br>전달 콜백: H-fa12c88f7d2e |
| 393행 | truthy: card | graph.links.filter((e) => e.source === card.id \|\| e.target === card.id)<br>call<br>전달 콜백: H-1568d15fb390 |
| 394행 | 별도 조건식 없음 | graph.links.map((e) => ({ ...e, type: 'dot', data: { shape: tools.value.edgeStyle }, label: e.id.startsWith('auto:') ? undefined : e.label, markerEnd: e.id.startsWith('auto:') ? undefined : { type: MarkerType.ArrowClosed }, className: e.id.startsWith('auto:') ? 'graph-outline-edge' : 'graph-personal-edge', style: { stroke: 'var(--color-border-strong)' }, }))<br>call<br>전달 콜백: H-729425b386b2 |
| 415행 | 별도 조건식 없음 | subjects.some((s) => s.id === subject)<br>call<br>전달 콜백: H-441bc18846eb |
| 419행 | 별도 조건식 없음 | subjects.map((s) => ( <option key={s.id} value={s.id}> {s.name} </option> ))<br>call<br>전달 콜백: H-5cdb0fa11712 |
| 461행 | truthy: centerId | [1, 2, 3].map((n) => ( <option value={n} key={n}> {n}단계 </option> ))<br>call<br>전달 콜백: H-a2cdb36dd16d |
| 543행 | truthy: nodes.length | nodes.map((n) => ({ ...n, data: { ...n.data, selected: n.id === selected, pinned: Boolean(pinned[n.id]), zoom, labelVisible: visibleLabels.has(n.id), open: () => setSelected(n.id), }, }))<br>call<br>전달 콜백: H-e20384d8b3fd |
| 586행 | truthy: nodes.length | nodes.filter((node) => node.selected).map((node) => node.id)<br>call<br>전달 콜백: H-1afe4db11a3c |
| 586행 | truthy: nodes.length | nodes.filter((node) => node.selected)<br>call<br>전달 콜백: H-5a4a2316928b |
| 602행 | truthy: card | graphBody(data, card)<br>call |
| 602행 | truthy: card ∧ truthy: graphBody(data, card) | graphBody(data, card)<br>call |
| 604행 | truthy: card | graphHref(card)<br>call |
| 608행 | truthy: card | related.map((e) => { const other = graph.cards.find( (c) => c.id === (e.source === card.id ? e.target : e.source), ); return ( other && ( <Button variant="quiet" key={e.id} onClick={() => setSelected(other.id)}> {other.name} <small> {e.id.startsWith('auto:') ? e.label : `${e.source === card.id ? '→' : '←'} ${e.label \|\| '내가 이은 관계'}`} </small> </Button> ) ); })<br>call<br>전달 콜백: H-016b969d1eb3 |
| 634행 | 별도 조건식 없음 | graph.cards.map((c) => ( <Button key={c.id} variant="quiet" aria-pressed={c.id === selected} onClick={() => setSelected(c.id)} > {names[c.kind]} · {c.name} </Button> ))<br>call<br>전달 콜백: H-efb0005d1758 |

반환/조기 중단: 403행 <render> [별도 조건식 없음]

## H-939c3ef7190c

**@callback:useState** · [src/ui/study-graph.tsx:161](../../../src/ui/study-graph.tsx#L161)

분기 조건과 가능한 갈림길:

- B-4da718303ed0 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (162행).
- B-89783acf7b74 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (164행).
- B-2ff52c868b61 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (167행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 163행 | 별도 조건식 없음 | readGraphPreferences(data)<br>call |
| 167행 | exception: e | String(e instanceof Error ? e.message : e)<br>call |

반환/조기 중단: 163행 { preferences: readGraphPreferences(data), error: '', blocked: false } [별도 조건식 없음]; 165행 { preferences: { ...defaultGraphPreferences }, error: String(e instanceof Error ? e.message : e), blocked: true, } [exception: e]

## H-b786e914cc83

**@callback:useMemo** · [src/ui/study-graph.tsx:186](../../../src/ui/study-graph.tsx#L186)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-9576bec7afd0

**storePreferences** · [src/ui/study-graph.tsx:189](../../../src/ui/study-graph.tsx#L189)

분기 조건과 가능한 갈림길:

- B-9ea500416dd3 · IfStatement · preferencesBlocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (190행).
- B-26ce0c64bc83 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (191행).
- B-9954855d1b18 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (195행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 192행 | 별도 조건식 없음 | writeGraphPreferences(data, preferences)<br>call |
| 193행 | 별도 조건식 없음 | JSON.stringify(preferences)<br>call |
| 194행 | 별도 조건식 없음 | setPreferenceError('')<br>state-update |
| 196행 | exception: exception | setPreferenceError('보기 설정을 저장하지 못했습니다. 현재 화면은 유지했습니다. 저장 공간을 확인한 뒤 설정 저장을 다시 시도해 주세요.')<br>state-update |

반환/조기 중단: 190행 <render> [truthy: preferencesBlocked]

## H-dba4fbffb007

**@callback:useEffect** · [src/ui/study-graph.tsx:201](../../../src/ui/study-graph.tsx#L201)

분기 조건과 가능한 갈림길:

- B-876adb18e2e1 · IfStatement · preferencesBlocked || JSON.stringify(preferences) === lastPreferences.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (202행).
- B-1af4187990f7 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (203행).
- B-4afff732de0c · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (207행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 202행 | falsy: preferencesBlocked | JSON.stringify(preferences)<br>call |
| 204행 | 별도 조건식 없음 | writeGraphPreferences(data, preferences)<br>call |
| 205행 | 별도 조건식 없음 | JSON.stringify(preferences)<br>call |
| 206행 | 별도 조건식 없음 | setPreferenceError('')<br>state-update |
| 208행 | exception: exception | setPreferenceError('보기 설정을 저장하지 못했습니다. 현재 화면은 유지했습니다. 저장 공간을 확인한 뒤 설정 저장을 다시 시도해 주세요.')<br>state-update |

반환/조기 중단: 202행 <render> [truthy: preferencesBlocked || JSON.stringify(preferences) === lastPreferences.current]

## H-7cf5f9c43344

**@callback:data.subjects.filter** · [src/ui/study-graph.tsx:213](../../../src/ui/study-graph.tsx#L213)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 213행 | truthy: !s.deletedAt | subjectIds.includes(s.id)<br>call |

## H-7ed7913eee44

**@callback:useMemo** · [src/ui/study-graph.tsx:215](../../../src/ui/study-graph.tsx#L215)

분기 조건과 가능한 갈림길:

- B-0676e44b159a · ConditionalExpression · subject && ids.includes(subject) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (217행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 216행 | 별도 조건식 없음 | JSON.parse(scopeKey)<br>call |
| 217행 | truthy: subject | ids.includes(subject)<br>call |

반환/조기 중단: 217행 subject && ids.includes(subject) ? [subject] : ids [별도 조건식 없음]

## H-2fcaf328e482

**@callback:useMemo** · [src/ui/study-graph.tsx:220](../../../src/ui/study-graph.tsx#L220)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 220행 | 별도 조건식 없음 | projectStudyGraph(data, scoped, { query, connections, notes, centerId, depth })<br>call |

## H-78b3deecfcea

**@callback:graph.cards.map** · [src/ui/study-graph.tsx:225](../../../src/ui/study-graph.tsx#L225)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d37bcfdf683a

**@callback:graph.links.map** · [src/ui/study-graph.tsx:226](../../../src/ui/study-graph.tsx#L226)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6689cf3a3813

**@callback:useMemo** · [src/ui/study-graph.tsx:229](../../../src/ui/study-graph.tsx#L229)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 229행 | 별도 조건식 없음 | JSON.parse(signature)<br>call |

## H-9051bcdf6baf

**@callback:useMemo** · [src/ui/study-graph.tsx:244](../../../src/ui/study-graph.tsx#L244)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 244행 | 별도 조건식 없음 | graphLayoutParameters(input.cards, input.links, { frame, spacing })<br>call |

## H-aa3c340f3185

**@callback:useEffect** · [src/ui/study-graph.tsx:247](../../../src/ui/study-graph.tsx#L247)

분기 조건과 가능한 갈림길:

- B-248dd217cedf · IfStatement · !stage.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (248행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 261행 | 별도 조건식 없음 | observer.observe(stage.current)<br>call |

반환/조기 중단: 248행 <render> [truthy: !stage.current]; 262행 () => { observer.disconnect(); cancelAnimationFrame(pendingFrame); } [별도 조건식 없음]

## H-e8986aa1a5f7

**@callback:graph.links.every** · [src/ui/study-graph.tsx:268](../../../src/ui/study-graph.tsx#L268)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 268행 | truthy: graph.links.length > 0 | link.id.startsWith('auto:')<br>call |

## H-8a0bc2c1e7f7

**@callback:useEffect** · [src/ui/study-graph.tsx:269](../../../src/ui/study-graph.tsx#L269)

분기 조건과 가능한 갈림길:

- B-99368b7b52cf · IfStatement · hierarchical → truthy / falsy; 바깥 조건: 별도 조건식 없음 (287행).
- B-02e5a9f69702 · ConditionalExpression · frame.width < frame.height → truthy / falsy; 바깥 조건: truthy: hierarchical (296행).
- B-b753652dd86c · ConditionalExpression · spacing === 'compact' → truthy / falsy; 바깥 조건: truthy: hierarchical (297행).
- B-2d942a1930da · ConditionalExpression · spacing === 'wide' → truthy / falsy; 바깥 조건: truthy: hierarchical ∧ falsy: spacing === 'compact' (297행).
- B-319a7329acff · IfStatement · next[id] → truthy / falsy; 바깥 조건: truthy: hierarchical (299행).
- B-1980775a9cd9 · IfStatement · typeof Worker === 'undefined' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (303행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 273행 | 별도 조건식 없음 | JSON.stringify({ input, frame, spacing, layoutMode })<br>call |
| 275행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 276행 | 별도 조건식 없음 | setError('')<br>state-update |
| 288행 | truthy: hierarchical | layoutFlowBoxes(input.cards.map((card) => ({ id: card.id, position: { x: 0, y: 0 }, width: 220, height: 70, })), input.links, frame.width < frame.height ? 'TB' : 'LR', spacing === 'compact' ? 0.8 : spacing === 'wide' ? 1.3 : 1)<br>call |
| 289행 | truthy: hierarchical | input.cards.map((card) => ({ id: card.id, position: { x: 0, y: 0 }, width: 220, height: 70, }))<br>call<br>전달 콜백: H-94573fc9f073 |
| 299행 | truthy: hierarchical | Object.entries(pinned)<br>call |
| 300행 | truthy: hierarchical | apply(next)<br>call → [H-4dfa1dc9c5f7](ui__study-graph.md#h-4dfa1dc9c5f7) |
| 304행 | truthy: typeof Worker === 'undefined' | apply(layoutStudyGraph(input.cards, input.links, options).positions)<br>call → [H-4dfa1dc9c5f7](ui__study-graph.md#h-4dfa1dc9c5f7) |
| 304행 | truthy: typeof Worker === 'undefined' | layoutStudyGraph(input.cards, input.links, options)<br>call |
| 327행 | 별도 조건식 없음 | worker.postMessage({ ...input, options })<br>call |

반환/조기 중단: 301행 <render> [truthy: hierarchical]; 305행 <render> [truthy: typeof Worker === 'undefined']; 328행 () => worker.terminate() [별도 조건식 없음]

## H-4dfa1dc9c5f7

**apply** · [src/ui/study-graph.tsx:277](../../../src/ui/study-graph.tsx#L277)

분기 조건과 가능한 갈림길:

- B-1480cbab079d · IfStatement · needsFit → truthy / falsy; 바깥 조건: 별도 조건식 없음 (280행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 279행 | 별도 조건식 없음 | setPositions(next)<br>state-update |
| 282행 | truthy: needsFit | setFitting(true)<br>state-update |
| 283행 | truthy: needsFit | setFitRevision((n) => n + 1)<br>state-update<br>전달 콜백: H-db9d7158d2ef |
| 285행 | 별도 조건식 없음 | setBusy(false)<br>state-update |

## H-db9d7158d2ef

**@callback:setFitRevision** · [src/ui/study-graph.tsx:283](../../../src/ui/study-graph.tsx#L283)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-94573fc9f073

**@callback:input.cards.map** · [src/ui/study-graph.tsx:289](../../../src/ui/study-graph.tsx#L289)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-8c68f84b1dc5

**@callback:useMemo** · [src/ui/study-graph.tsx:331](../../../src/ui/study-graph.tsx#L331)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 332행 | 별도 조건식 없음 | graph.cards.map((card, index) => ({ id: card.id, type: 'dot', ariaLabel: card.name, // The touch target is fixed by .graph-dot. Explicit v12 handle geometry // also keeps edges available when WebKit defers offscreen observation. width: 44, height: 44, handles: [ { type: 'target', position: Position.Left, x: 0, y: 21.5, width: 1, height: 1 }, { type: 'source', position: Position.Right, x: 43, y: 21.5, width: 1, height: 1 }, ], position: positions[card.id] ?? { x: Math.cos(index) * 100, y: Math.sin(index) * 100 }, data: { card, selected: false, pinned: false, size: parameters.sizes[card.id], labelVisible: true, zoom: 1, }, }))<br>call<br>전달 콜백: H-9d3b9e1cbee6 |

## H-9d3b9e1cbee6

**@callback:graph.cards.map** · [src/ui/study-graph.tsx:332](../../../src/ui/study-graph.tsx#L332)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 344행 | nullish: positions[card.id] | Math.cos(index)<br>call |
| 344행 | nullish: positions[card.id] | Math.sin(index)<br>call |

## H-48b646894b19

**@callback:useEffect** · [src/ui/study-graph.tsx:357](../../../src/ui/study-graph.tsx#L357)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 358행 | 별도 조건식 없음 | setNodes((previous) => { const measured = new Map(previous.map((node) => [node.id, node.measured])); // Position updates must retain React Flow's completed DOM measurements. // Clearing them restarts observation and can leave a queued fit unresolved. return initial.map((node) => ({ ...node, measured: measured.get(node.id) })); })<br>state-update<br>전달 콜백: H-fe4e5e9a8d17 |

## H-fe4e5e9a8d17

**@callback:setNodes** · [src/ui/study-graph.tsx:358](../../../src/ui/study-graph.tsx#L358)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 359행 | 별도 조건식 없음 | previous.map((node) => [node.id, node.measured])<br>call<br>전달 콜백: H-fd315fc79fc7 |
| 362행 | 별도 조건식 없음 | initial.map((node) => ({ ...node, measured: measured.get(node.id) }))<br>call<br>전달 콜백: H-6325d12ed938 |

반환/조기 중단: 362행 initial.map((node) => ({ ...node, measured: measured.get(node.id) })) [별도 조건식 없음]

## H-fd315fc79fc7

**@callback:previous.map** · [src/ui/study-graph.tsx:359](../../../src/ui/study-graph.tsx#L359)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6325d12ed938

**@callback:initial.map** · [src/ui/study-graph.tsx:362](../../../src/ui/study-graph.tsx#L362)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 362행 | 별도 조건식 없음 | measured.get(node.id)<br>call |

## H-c7052739e154

**@callback:useEffect** · [src/ui/study-graph.tsx:365](../../../src/ui/study-graph.tsx#L365)

분기 조건과 가능한 갈림길:

- B-02f8ebdca3bf · IfStatement · flow && fitRevision > 0 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (366행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 368행 | truthy: flow && fitRevision > 0 | requestAnimationFrame(() => { void flow.fitView({ padding: 0.3, minZoom: 0.02, maxZoom: 1.2 }).then(() => { if (active) setFitting(false); }); })<br>call<br>전달 콜백: H-d86c6c981293 |

반환/조기 중단: 373행 () => { active = false; cancelAnimationFrame(id); } [truthy: flow && fitRevision > 0]

## H-d86c6c981293

**@callback:requestAnimationFrame** · [src/ui/study-graph.tsx:368](../../../src/ui/study-graph.tsx#L368)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 369행 | truthy: flow && fitRevision > 0 | flow.fitView({ padding: 0.3, minZoom: 0.02, maxZoom: 1.2 }).then(() => { if (active) setFitting(false); })<br>call<br>전달 콜백: H-b38426f63757 |
| 369행 | truthy: flow && fitRevision > 0 | flow.fitView({ padding: 0.3, minZoom: 0.02, maxZoom: 1.2 })<br>call |

## H-b38426f63757

**@callback:flow.fitView({ padding: 0.3, minZoom: 0.02, maxZoom: 1.2 }).then** · [src/ui/study-graph.tsx:369](../../../src/ui/study-graph.tsx#L369)

분기 조건과 가능한 갈림길:

- B-2dd8f0d46b56 · IfStatement · active → truthy / falsy; 바깥 조건: truthy: flow && fitRevision > 0 ∧ fulfilled-or-explicit-rejection-handler: flow.fitView({ padding: 0.3, minZoom: 0.02, maxZoom: 1.2 }) (370행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 370행 | truthy: flow && fitRevision > 0 ∧ fulfilled-or-explicit-rejection-handler: flow.fitView({ padding: 0.3, minZoom: 0.02, maxZoom: 1.2 }) ∧ truthy: active | setFitting(false)<br>state-update |

## H-bfa163fe4152

**@callback:graph.links
      .filter** · [src/ui/study-graph.tsx:381](../../../src/ui/study-graph.tsx#L381)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c87f525123f8

**@callback:graph.links
      .filter((e) => e.source === selected || e.target === selected)
      .map** · [src/ui/study-graph.tsx:382](../../../src/ui/study-graph.tsx#L382)

분기 조건과 가능한 갈림길:

- B-1888fa3bbc39 · ConditionalExpression · e.source === selected → truthy / falsy; 바깥 조건: 별도 조건식 없음 (382행).

## H-22312965603b

**@callback:nodes.map** · [src/ui/study-graph.tsx:386](../../../src/ui/study-graph.tsx#L386)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-fa12c88f7d2e

**@callback:graph.cards.find** · [src/ui/study-graph.tsx:392](../../../src/ui/study-graph.tsx#L392)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1568d15fb390

**@callback:graph.links.filter** · [src/ui/study-graph.tsx:393](../../../src/ui/study-graph.tsx#L393)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-729425b386b2

**@callback:graph.links.map** · [src/ui/study-graph.tsx:394](../../../src/ui/study-graph.tsx#L394)

분기 조건과 가능한 갈림길:

- B-846665e242c3 · ConditionalExpression · e.id.startsWith('auto:') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (398행).
- B-a1afa85faf9a · ConditionalExpression · e.id.startsWith('auto:') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (399행).
- B-7635742896f2 · ConditionalExpression · e.id.startsWith('auto:') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (400행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 398행 | 별도 조건식 없음 | e.id.startsWith('auto:')<br>call |
| 399행 | 별도 조건식 없음 | e.id.startsWith('auto:')<br>call |
| 400행 | 별도 조건식 없음 | e.id.startsWith('auto:')<br>call |

## H-5f1cafaa8ee9

**@onChange** · [src/ui/study-graph.tsx:410](../../../src/ui/study-graph.tsx#L410)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 410행 | 별도 조건식 없음 | setQuery(e.target.value)<br>state-update |

## H-441bc18846eb

**@callback:subjects.some** · [src/ui/study-graph.tsx:415](../../../src/ui/study-graph.tsx#L415)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a5ef14b2c88c

**@onChange** · [src/ui/study-graph.tsx:416](../../../src/ui/study-graph.tsx#L416)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 416행 | 별도 조건식 없음 | setSubject(e.target.value)<br>state-update |

## H-5cdb0fa11712

**@callback:subjects.map** · [src/ui/study-graph.tsx:419](../../../src/ui/study-graph.tsx#L419)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1ad7e9edd53b

**@onChange** · [src/ui/study-graph.tsx:428](../../../src/ui/study-graph.tsx#L428)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 428행 | 별도 조건식 없음 | setConnections(e.target.value as 'all' \| 'personal')<br>state-update |

## H-fc4d0d934527

**@onChange** · [src/ui/study-graph.tsx:436](../../../src/ui/study-graph.tsx#L436)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 436행 | 별도 조건식 없음 | setNotes(e.target.checked)<br>state-update |

## H-a5eb2c1323cb

**@onChange** · [src/ui/study-graph.tsx:443](../../../src/ui/study-graph.tsx#L443)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 444행 | 별도 조건식 없음 | tools.store({ ...tools.value, layout: event.target.value as typeof layoutMode })<br>call |

## H-cc7e8021772a

**@onChange** · [src/ui/study-graph.tsx:459](../../../src/ui/study-graph.tsx#L459)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 459행 | truthy: centerId | setDepth(Number(e.target.value))<br>state-update |
| 459행 | truthy: centerId | Number(e.target.value)<br>call |

## H-a2cdb36dd16d

**@callback:[1, 2, 3].map** · [src/ui/study-graph.tsx:461](../../../src/ui/study-graph.tsx#L461)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3ceda1abb6fc

**@onClick** · [src/ui/study-graph.tsx:467](../../../src/ui/study-graph.tsx#L467)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 467행 | truthy: centerId | setCenterId(null)<br>state-update |

## H-890afb10ab2a

**@onChange** · [src/ui/study-graph.tsx:473](../../../src/ui/study-graph.tsx#L473)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 473행 | 별도 조건식 없음 | setSpacing(e.target.value as GraphSpacing)<br>state-update |

## H-3e353186ad97

**@onClick** · [src/ui/study-graph.tsx:480](../../../src/ui/study-graph.tsx#L480)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 482행 | 별도 조건식 없음 | setPinned({})<br>state-update |

## H-39c4a68b079f

**@onClick** · [src/ui/study-graph.tsx:499](../../../src/ui/study-graph.tsx#L499)

분기 조건과 가능한 갈림길:

- B-c7d9bcf3a596 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (500행).
- B-9586af0b46d3 · IfStatement · preferencesBlocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (501행).
- B-77d264253554 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (514행).
- B-2862a876b80f · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (516행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 502행 | truthy: preferencesBlocked | archiveDamagedDraft(preferenceKey, '그래프 보기 설정 원문 보관')<br>preservation-boundary |
| 503행 | 별도 조건식 없음 | writeGraphPreferences(data, { ...defaultGraphPreferences })<br>call |
| 504행 | 별도 조건식 없음 | JSON.stringify(defaultGraphPreferences)<br>call |
| 505행 | 별도 조건식 없음 | setQuery('')<br>state-update |
| 506행 | 별도 조건식 없음 | setSubject('')<br>state-update |
| 507행 | 별도 조건식 없음 | setNotes(true)<br>state-update |
| 508행 | 별도 조건식 없음 | setConnections('all')<br>state-update |
| 509행 | 별도 조건식 없음 | setDepth(1)<br>state-update |
| 510행 | 별도 조건식 없음 | setSpacing('auto')<br>state-update |
| 511행 | 별도 조건식 없음 | setCenterId(null)<br>state-update |
| 512행 | 별도 조건식 없음 | setPreferencesBlocked(false)<br>state-update |
| 513행 | 별도 조건식 없음 | setPreferenceError('')<br>state-update |
| 515행 | exception: e | setPreferenceError(e instanceof Error ? e.message : '설정 초기화를 완료하지 못했습니다. 현재 설정은 유지했습니다.')<br>state-update |

## H-e5a55d82cbdf

**@onClick** · [src/ui/study-graph.tsx:530](../../../src/ui/study-graph.tsx#L530)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 530행 | truthy: tools.error | tools.store(tools.value)<br>call |

## H-e20384d8b3fd

**@callback:nodes.map** · [src/ui/study-graph.tsx:543](../../../src/ui/study-graph.tsx#L543)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 548행 | truthy: nodes.length | Boolean(pinned[n.id])<br>call |
| 550행 | truthy: nodes.length | visibleLabels.has(n.id)<br>call |

## H-3fd9c0df6b81

**@onNodesChange** · [src/ui/study-graph.tsx:558](../../../src/ui/study-graph.tsx#L558)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 558행 | truthy: nodes.length | setNodes((prev) => applyNodeChanges(changes, prev))<br>state-update<br>전달 콜백: H-25eff3ce6e41 |

## H-25eff3ce6e41

**@callback:setNodes** · [src/ui/study-graph.tsx:558](../../../src/ui/study-graph.tsx#L558)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 558행 | truthy: nodes.length | applyNodeChanges(changes, prev)<br>call |

## H-10c4ea149119

**@onNodeClick** · [src/ui/study-graph.tsx:559](../../../src/ui/study-graph.tsx#L559)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 559행 | truthy: nodes.length | setSelected(n.id)<br>state-update |

## H-399e6efd767d

**@onMove** · [src/ui/study-graph.tsx:560](../../../src/ui/study-graph.tsx#L560)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 560행 | truthy: nodes.length | setZoom(viewport.zoom)<br>state-update |

## H-47674aaddc73

**@onNodeDragStop** · [src/ui/study-graph.tsx:561](../../../src/ui/study-graph.tsx#L561)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 563행 | truthy: nodes.length | setPinned((old) => ({ ...old, [n.id]: n.position }))<br>state-update<br>전달 콜백: H-560c16099c83 |

## H-560c16099c83

**@callback:setPinned** · [src/ui/study-graph.tsx:563](../../../src/ui/study-graph.tsx#L563)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-5a4a2316928b

**@callback:nodes.filter** · [src/ui/study-graph.tsx:586](../../../src/ui/study-graph.tsx#L586)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1afe4db11a3c

**@callback:nodes.filter((node) => node.selected).map** · [src/ui/study-graph.tsx:586](../../../src/ui/study-graph.tsx#L586)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-04b9ce161ae6

**@onClick** · [src/ui/study-graph.tsx:605](../../../src/ui/study-graph.tsx#L605)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 605행 | truthy: card | setCenterId(card.id)<br>state-update |

## H-016b969d1eb3

**@callback:related.map** · [src/ui/study-graph.tsx:608](../../../src/ui/study-graph.tsx#L608)

분기 조건과 가능한 갈림길:

- B-19cbb84d9d50 · ConditionalExpression · e.id.startsWith('auto:') → truthy / falsy; 바깥 조건: truthy: card ∧ truthy: other (617행).
- B-3129f31b66da · ConditionalExpression · e.source === card.id → truthy / falsy; 바깥 조건: truthy: card ∧ truthy: other ∧ falsy: e.id.startsWith('auto:') (619행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 609행 | truthy: card | graph.cards.find((c) => c.id === (e.source === card.id ? e.target : e.source))<br>call<br>전달 콜백: H-b295b660c2f3 |
| 617행 | truthy: card ∧ truthy: other | e.id.startsWith('auto:')<br>call |

반환/조기 중단: 612행 other && ( <Button variant="quiet" key={e.id} onClick={() => setSelected(other.id)}> {other.name} <small> {e.id.startsWith('auto:') ? e.label : `${e.source === card.id ? '→' : '←'} ${e.label || '내가 이은 관계'}`} </small> </Button> ) [truthy: card]

## H-b295b660c2f3

**@callback:graph.cards.find** · [src/ui/study-graph.tsx:610](../../../src/ui/study-graph.tsx#L610)

분기 조건과 가능한 갈림길:

- B-35a42ab7b2e5 · ConditionalExpression · e.source === card.id → truthy / falsy; 바깥 조건: truthy: card (610행).

## H-c0874078a401

**@onClick** · [src/ui/study-graph.tsx:614](../../../src/ui/study-graph.tsx#L614)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 614행 | truthy: card ∧ truthy: other | setSelected(other.id)<br>state-update |

## H-efb0005d1758

**@callback:graph.cards.map** · [src/ui/study-graph.tsx:634](../../../src/ui/study-graph.tsx#L634)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b56f1256b629

**@onClick** · [src/ui/study-graph.tsx:639](../../../src/ui/study-graph.tsx#L639)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 639행 | 별도 조건식 없음 | setSelected(c.id)<br>state-update |

