# src/ui/study-canvas.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-52a833319202

**StudyCard** · [src/ui/study-canvas.tsx:74](../../../src/ui/study-canvas.tsx#L74)

분기 조건과 가능한 갈림길:

- B-b5547a97ed1a · ConditionalExpression · selected → truthy / falsy; 바깥 조건: 별도 조건식 없음 (88행).
- B-cebab33a928d · ConditionalExpression · data.editor → truthy / falsy; 바깥 조건: 별도 조건식 없음 (88행).
- B-22ba0d9bf39c · ConditionalExpression · data.memo?.strokes.length → truthy / falsy; 바깥 조건: nullish: data.editor (162행).
- B-ef4933f76104 · ConditionalExpression · zoom >= 0.55 → truthy / falsy; 바깥 조건: nullish: data.editor ∧ interactive-when-falsy: zoom < 0.55 (178행).
- B-fc854212cfa7 · ConditionalExpression · card.kind === 'memo' || card.kind === 'narrative' || card.kind === 'concept' → truthy / falsy; 바깥 조건: nullish: data.editor ∧ interactive-when-falsy: zoom < 0.55 (183행).
- B-eca9711d9db2 · ConditionalExpression · card.kind === 'subject' → truthy / falsy; 바깥 조건: nullish: data.editor ∧ interactive-when-falsy: zoom < 0.55 ∧ truthy: card.kind !== 'memo' && card.kind !== 'narrative' && card.kind !== 'concept' (189행).
- B-387614415f9b · ConditionalExpression · zoom < 0.55 → truthy / falsy; 바깥 조건: nullish: data.editor (197행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 76행 | 별도 조건식 없음 | useViewport()<br>call |
| 77행 | 별도 조건식 없음 | useRef(null)<br>call |
| 78행 | 별도 조건식 없음 | useEffect(() => { if (!data.saveMessage \|\| data.editor) return; // Let React Flow measure the smaller card before returning keyboard focus. let frame = requestAnimationFrame(() => { frame = requestAnimationFrame(() => editButton.current?.focus({ preventScroll: true })); }); return () => cancelAnimationFrame(frame); }, [data.saveMessage, data.editor])<br>call<br>전달 콜백: H-6d658653680b |
| 92행 | 별도 조건식 없음 | Boolean(data.toolbarVisible)<br>call |
| 189행 | nullish: data.editor ∧ interactive-when-falsy: zoom < 0.55 ∧ truthy: card.kind !== 'memo' && card.kind !== 'narrative' && card.kind !== 'concept' | encodeURIComponent(card.entityId)<br>call |

반환/조기 중단: 86행 <render> [별도 조건식 없음]

## H-6d658653680b

**@callback:useEffect** · [src/ui/study-canvas.tsx:78](../../../src/ui/study-canvas.tsx#L78)

분기 조건과 가능한 갈림길:

- B-f99d58b33dc1 · IfStatement · !data.saveMessage || data.editor → truthy / falsy; 바깥 조건: 별도 조건식 없음 (79행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 81행 | 별도 조건식 없음 | requestAnimationFrame(() => { frame = requestAnimationFrame(() => editButton.current?.focus({ preventScroll: true })); })<br>call<br>전달 콜백: H-ba021d42ac39 |

반환/조기 중단: 79행 <render> [truthy: !data.saveMessage || data.editor]; 84행 () => cancelAnimationFrame(frame) [별도 조건식 없음]

## H-ba021d42ac39

**@callback:requestAnimationFrame** · [src/ui/study-canvas.tsx:81](../../../src/ui/study-canvas.tsx#L81)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 82행 | 별도 조건식 없음 | requestAnimationFrame(() => editButton.current?.focus({ preventScroll: true }))<br>call<br>전달 콜백: H-a816480fa1bf |

## H-a816480fa1bf

**@callback:requestAnimationFrame** · [src/ui/study-canvas.tsx:82](../../../src/ui/study-canvas.tsx#L82)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-22f7a2d17197

**@onResizeEnd** · [src/ui/study-canvas.tsx:103](../../../src/ui/study-canvas.tsx#L103)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3dc3367283b1

**@onKeyDown** · [src/ui/study-canvas.tsx:118](../../../src/ui/study-canvas.tsx#L118)

분기 조건과 가능한 갈림길:

- B-30af549b8d96 · IfStatement · event.target !== event.currentTarget || event.nativeEvent.isComposing || event.ctrlKey || event.metaKey || event.altKey → truthy / falsy; 바깥 조건: 별도 조건식 없음 (121행).
- B-aa5e73b28544 · IfStatement · ![ 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'PageDown', 'PageUp', 'Home', 'End', ' ', ].includes(event.key) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (129행).
- B-b853e55e521d · IfStatement · event.shiftKey && event.key !== ' ' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (144행).
- B-a84e8b095f27 · IfStatement · event.key === 'ArrowDown' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (149행).
- B-cfa32a5911ea · IfStatement · event.key === 'ArrowUp' → truthy / falsy; 바깥 조건: falsy: event.key === 'ArrowDown' (150행).
- B-4bafadd46d78 · IfStatement · event.key === 'ArrowLeft' → truthy / falsy; 바깥 조건: falsy: event.key === 'ArrowDown' ∧ falsy: event.key === 'ArrowUp' (151행).
- B-12f6d78f2b3c · IfStatement · event.key === 'ArrowRight' → truthy / falsy; 바깥 조건: falsy: event.key === 'ArrowDown' ∧ falsy: event.key === 'ArrowUp' ∧ falsy: event.key === 'ArrowLeft' (152행).
- B-a5f122b6c5f3 · IfStatement · event.key === 'Home' → truthy / falsy; 바깥 조건: falsy: event.key === 'ArrowDown' ∧ falsy: event.key === 'ArrowUp' ∧ falsy: event.key === 'ArrowLeft' ∧ falsy: event.key === 'ArrowRight' (153행).
- B-ed2f73712599 · IfStatement · event.key === 'End' → truthy / falsy; 바깥 조건: falsy: event.key === 'ArrowDown' ∧ falsy: event.key === 'ArrowUp' ∧ falsy: event.key === 'ArrowLeft' ∧ falsy: event.key === 'ArrowRight' ∧ falsy: event.key === 'Home' (154행).
- B-7ef6d879227e · ConditionalExpression · event.key === 'PageUp' || event.shiftKey → truthy / falsy; 바깥 조건: falsy: event.key === 'ArrowDown' ∧ falsy: event.key === 'ArrowUp' ∧ falsy: event.key === 'ArrowLeft' ∧ falsy: event.key === 'ArrowRight' ∧ falsy: event.key === 'Home' ∧ falsy: event.key === 'End' (155행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 130행 | 별도 조건식 없음 | [<br>              'ArrowDown',<br>              'ArrowUp',<br>              'ArrowLeft',<br>              'ArrowRight',<br>              'PageDown',<br>              'PageUp',<br>              'Home',<br>              'End',<br>              ' ',<br>            ].includes(event.key)<br>call |
| 143행 | 별도 조건식 없음 | event.stopPropagation()<br>input-control |
| 145행 | 별도 조건식 없음 | event.preventDefault()<br>input-control |
| 147행 | 별도 조건식 없음 | parseFloat(getComputedStyle(element).lineHeight)<br>call |
| 147행 | 별도 조건식 없음 | getComputedStyle(element)<br>call |
| 148행 | 별도 조건식 없음 | Math.max(line, element.clientHeight - line)<br>call |

반환/조기 중단: 128행 <render> [truthy: event.target !== event.currentTarget ||
            event.nativeEvent.isComposing ||
            event.ctrlKey ||
            event.metaKey ||
            event.altKey]; 142행 <render> [truthy: ![
              'ArrowDown',
              'ArrowUp',
              'ArrowLeft',
              'ArrowRight',
              'PageDown',
              'PageUp',
              'Home',
              'End',
              ' ',
            ].includes(event.key)]; 144행 <render> [truthy: event.shiftKey && event.key !== ' ']

## H-ed0deb53b708

**StudyCanvas** · [src/ui/study-canvas.tsx:211](../../../src/ui/study-canvas.tsx#L211)

분기 조건과 가능한 갈림길:

- B-c7c8be140ae7 · ConditionalExpression · !boot.blocked → truthy / falsy; 바깥 조건: truthy: error (740행).
- B-2aefbea3239f · ConditionalExpression · course === 'all' → truthy / falsy; 바깥 조건: truthy: conceptOpen (767행).
- B-ee2245b5da41 · ConditionalExpression · !projection.cards.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (934행).
- B-b2efb598c706 · ConditionalExpression · tools.value.mode === 'move' → truthy / falsy; 바깥 조건: falsy: !projection.cards.length (1018행).
- B-43341574d8ba · ConditionalExpression · selectedCard.kind === 'subject' → truthy / falsy; 바깥 조건: truthy: selectedCard ∧ truthy: !['memo', 'narrative', 'concept'].includes(selectedCard.kind) (1127행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 228행 | 별도 조건식 없음 | useFlowPreferences(flowPreferencesKey(data, 'canvas'))<br>call |
| 228행 | 별도 조건식 없음 | flowPreferencesKey(data, 'canvas')<br>call |
| 229행 | 별도 조건식 없음 | useRef(new FlowHistory())<br>call |
| 230행 | 별도 조건식 없음 | useState(0)<br>call |
| 231행 | 별도 조건식 없음 | useState([])<br>call |
| 232행 | 별도 조건식 없음 | useState(false)<br>call |
| 237행 | 별도 조건식 없음 | useState(() => { const fallback: CanvasContent = { positions: saved?.positions ?? {}, links: saved?.links ?? [], viewport: saved?.viewport, }; try { const draft = readCanvasDraft(data); if (draft && draft.baseVersion !== (saved?.version ?? 0)) { if (JSON.stringify(draft.content) === JSON.stringify(fallback)) { clearCanvasDraft(data); return { content: fallback, error: '', blocked: false }; } return { content: fallback, error: '배치 초안과 저장된 배치의 수정 순서가 다릅니다. 두 내용을 보존했습니다. 초안 보관본에서 확인해 주세요.', blocked: true, }; } return { content: draft?.content ?? fallback, error: draft ? '이 기기의 배치 초안을 불러왔습니다. 저장 다시 시도를 눌러 기록에 반영해 주세요.' : '', blocked: false, }; } catch (e) { return { content: fallback, error: e instanceof … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-826b5064ce5b |
| 272행 | 별도 조건식 없음 | useState(boot.content)<br>call |
| 273행 | 별도 조건식 없음 | useState(boot.error)<br>call |
| 274행 | 별도 조건식 없음 | useRef(null)<br>call |
| 275행 | 별도 조건식 없음 | useRef(content)<br>call |
| 277행 | 별도 조건식 없음 | useRef(saved?.version ?? 0)<br>call |
| 278행 | 별도 조건식 없음 | useState(null)<br>call |
| 279행 | 별도 조건식 없음 | useState(null)<br>call |
| 280행 | 별도 조건식 없음 | useState(null)<br>call |
| 281행 | 별도 조건식 없음 | useState(null)<br>call |
| 282행 | 별도 조건식 없음 | useState('all')<br>call |
| 283행 | 별도 조건식 없음 | useState(false)<br>call |
| 284행 | 별도 조건식 없음 | useState(null)<br>call |
| 285행 | 별도 조건식 없음 | useState(() => { try { return { draft: readConnectionDraft(data), error: '' }; } catch (e) { return { draft: { source: '', target: '', label: '' }, error: e instanceof Error ? e.message : '연결 초안을 읽지 못했습니다.', }; } })<br>call<br>전달 콜백: H-e7db6a081ee5 |
| 295행 | 별도 조건식 없음 | useState(connectionBoot.draft)<br>call |
| 296행 | 별도 조건식 없음 | useState(Boolean(connectionBoot.draft.label \|\| connectionBoot.error))<br>call |
| 297행 | 별도 조건식 없음 | Boolean(connectionBoot.draft.label \|\| connectionBoot.error)<br>call |
| 299행 | 별도 조건식 없음 | useState(connectionBoot.error)<br>call |
| 300행 | 별도 조건식 없음 | useState(false)<br>call |
| 301행 | 별도 조건식 없음 | data.subjects.filter((s) => !s.deletedAt && subjectIds.includes(s.id))<br>call<br>전달 콜백: H-fd3cd0c29125 |
| 304행 | 별도 조건식 없음 | useRef({})<br>call |
| 305행 | 별도 조건식 없음 | JSON.stringify(subjectIds)<br>call |
| 306행 | 별도 조건식 없음 | useMemo(() => JSON.parse(subjectIdsKey) as string[], [subjectIdsKey])<br>call<br>전달 콜백: H-648038baf1e1 |
| 307행 | 별도 조건식 없음 | useMemo(() => { const next = projectCanvas( data, course === 'all' ? scopeIds : scopeIds.filter((id) => id === course), { ...content, positions: { ...displayedPositions.current, ...content.positions } }, course === 'all', ); for (const card of next.cards) displayedPositions.current[card.id] = card.position; return next; }, [data, course, scopeIds, content])<br>call<br>전달 콜백: H-b067f5124ce5 |
| 317행 | 별도 조건식 없음 | useState([])<br>call |
| 318행 | 별도 조건식 없음 | useRef(null)<br>call |
| 381행 | 별도 조건식 없음 | useEffectEvent(() => { setNodes((previous) => projection.cards.map((card) => { const previousNode = previous.find((row) => row.id === card.id); const memo = card.kind === 'memo' \|\| card.kind === 'concept' ? data.memos?.find((row) => row.id === card.entityId) : undefined; const narrative = card.kind === 'narrative' ? data.narratives.find((row) => row.id === card.entityId) : undefined; let editor: ReactNode; if (editorId === card.id) editor = card.kind === 'concept' && memo ? ( <CanvasConceptEditor key={memo.id} data={data} repository={repository} memo={memo} onSaved={(next) => { onSaved(next); setEditorId(null); }} onClose={() => setEditorId(null)} /> ) : memo ? ( <MemoEditor embedded key={memo.id} memo={me … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-9b34205f154e |
| 477행 | 별도 조건식 없음 | useEffect(() => { synchronizeCards(); }, [projection, editorId, selectedId, savedCard, tools.value.nodeWidths])<br>call<br>전달 콜백: H-b0472bad064d |
| 480행 | 별도 조건식 없음 | useEffect(() => { const frame = requestAnimationFrame(() => { if (flow.current && course !== 'all') void flow.current.fitView({ padding: 0.16, minZoom: 0.25, maxZoom: 1 }); }); return () => cancelAnimationFrame(frame); }, [course])<br>call<br>전달 콜백: H-ad3a4ba3d434 |
| 487행 | 별도 조건식 없음 | useEffect(() => { if (!focusConcept \|\| !nodes.some((node) => node.id === focusConcept)) return; const frame = requestAnimationFrame(() => { void flow.current?.fitView({ nodes: [{ id: focusConcept }], padding: 0.3, minZoom: 0.25, maxZoom: 1, }); setFocusConcept(null); }); return () => cancelAnimationFrame(frame); }, [nodes, focusConcept])<br>call<br>전달 콜백: H-c389a2959813 |
| 505행 | 별도 조건식 없음 | useCallback(({ nodes: selection }: { nodes: CardNode[] }) => { const ids = selection.map((node) => node.id); setSelectedIds((previous) => JSON.stringify(previous) === JSON.stringify(ids) ? previous : ids, ); setSelectedId((previous) => previous && ids.includes(previous) ? previous : ids.length === 1 ? ids[0] : null, ); }, [])<br>call<br>전달 콜백: H-383e502c3d13 |
| 514행 | 별도 조건식 없음 | projection.links.map((link) => ({ ...link, type: flowEdgeType(tools.value.edgeStyle), reconnectable: !link.id.startsWith('auto:') && serverReady && !boot.blocked, deletable: false, label: link.label, selected: link.id === selectedEdge, markerEnd: link.id.startsWith('auto:') ? undefined : { type: MarkerType.ArrowClosed }, className: link.id.startsWith('auto:') ? 'canvas-auto-edge' : 'canvas-user-edge', }))<br>call<br>전달 콜백: H-2260b3ca0a1f |
| 535행 | 별도 조건식 없음 | projection.cards.map((card) => card.id)<br>call<br>전달 콜백: H-77fbef2cc92b |
| 554행 | 별도 조건식 없음 | content.links.find((link) => link.id === selectedEdge)<br>call<br>전달 콜백: H-9b1612b13d3a |
| 635행 | 별도 조건식 없음 | projection.cards.find((card) => card.id === selectedId)<br>call<br>전달 콜백: H-1c86a326b2f1 |
| 650행 | 별도 조건식 없음 | subjects.map((subject) => ( <option key={subject.id} value={subject.id}> {subject.name} </option> ))<br>call<br>전달 콜백: H-b5e98c668388 |
| 685행 | falsy: !serverReady \|\| boot.blocked | Boolean(editorId)<br>call |
| 722행 | truthy: transferOpen | projectCanvas(data)<br>call |
| 794행 | truthy: connectionOpen | Boolean(connectionBoot.error)<br>call |
| 798행 | truthy: connectionOpen | projection.cards.map((card) => ( <option key={card.id} value={card.id}> {kinds[card.kind]} · {card.name} </option> ))<br>call<br>전달 콜백: H-0b6ddaa8fbe2 |
| 807행 | truthy: connectionOpen | Boolean(connectionBoot.error)<br>call |
| 811행 | truthy: connectionOpen | projection.cards<br>                .filter((card) => card.id !== connection.source)<br>                .map((card) => ( <option key={card.id} value={card.id}> {kinds[card.kind]} · {card.name} </option> ))<br>call<br>전달 콜백: H-de2e8b401bd3 |
| 811행 | truthy: connectionOpen | projection.cards<br>                .filter((card) => card.id !== connection.source)<br>call<br>전달 콜백: H-86215e28cc30 |
| 823행 | truthy: connectionOpen | Boolean(connectionBoot.error)<br>call |
| 830행 | truthy: connectionOpen ∧ truthy: connection.source &&<br>            connection.target | validConnection(connection.source, connection.target)<br>call → [H-0e5fa6d384b0](ui__study-canvas.md#h-0e5fa6d384b0) |
| 837행 | truthy: connectionOpen ∧ truthy: connection.source && connection.target | cardName(connection.source)<br>call → [H-23fdac5af5e1](ui__study-canvas.md#h-23fdac5af5e1) |
| 838행 | truthy: connectionOpen ∧ truthy: connection.source && connection.target | cardName(connection.target)<br>call → [H-23fdac5af5e1](ui__study-canvas.md#h-23fdac5af5e1) |
| 849행 | truthy: connectionOpen ∧ falsy: !serverReady \|\|<br>                boot.blocked | Boolean(connectionBoot.error)<br>call |
| 851행 | truthy: connectionOpen ∧ falsy: !serverReady \|\|<br>                boot.blocked \|\|<br>                Boolean(connectionBoot.error) \|\|<br>                composing | connection.label.trim()<br>call |
| 854행 | truthy: connectionOpen ∧ falsy: !serverReady \|\|<br>                boot.blocked \|\|<br>                Boolean(connectionBoot.error) \|\|<br>                composing \|\|<br>                !connection.label.trim() \|\|<br>                !connection.source \|\|<br>                !connection.target | validConnection(connection.source, connection.target)<br>call → [H-0e5fa6d384b0](ui__study-canvas.md#h-0e5fa6d384b0) |
| 874행 | truthy: custom | cardName(custom.source)<br>call → [H-23fdac5af5e1](ui__study-canvas.md#h-23fdac5af5e1) |
| 874행 | truthy: custom | cardName(custom.target)<br>call → [H-23fdac5af5e1](ui__study-canvas.md#h-23fdac5af5e1) |
| 876행 | truthy: custom | (['source', 'target'] as const).map((end) => ( <Select key={end} label={end === 'source' ? '연결 시작 카드 변경' : '연결 도착 카드 변경'} value={custom[end]} disabled={!serverReady \|\| boot.blocked} onChange={(event) => { const next = { ...custom, [end]: event.target.value }; if (validConnection(next.source, next.target, custom.id)) save({ ...current.current, links: current.current.links.map((link) => link.id === custom.id ? next : link, ), }); else setError( '같은 카드 또는 이미 연결한 방향으로 바꿀 수 없습니다. 기존 연결은 유지했습니다.', ); }} > {projection.cards.map((card) => ( <option key={card.id} value={card.id}> {card.name} </option> ))} </Select> ))<br>call<br>전달 콜백: H-9439fafb02ec |
| 1061행 | 별도 조건식 없음 | projection.cards.map((card) => ( <option key={card.id} value={card.id}> {kinds[card.kind]} · {card.name} </option> ))<br>call<br>전달 콜백: H-7a75bae03c3d |
| 1087행 | truthy: selectedIds.length > 1 ∧ falsy: !serverReady \|\| boot.blocked | Boolean(editorId)<br>call |
| 1093행 | truthy: selectedIds.length > 1 ∧ falsy: !serverReady \|\| boot.blocked | Boolean(editorId)<br>call |
| 1125행 | truthy: selectedCard | ['memo', 'narrative', 'concept'].includes(selectedCard.kind)<br>call |
| 1127행 | truthy: selectedCard ∧ truthy: !['memo', 'narrative', 'concept'].includes(selectedCard.kind) | encodeURIComponent(selectedCard.entityId)<br>call |
| 1132행 | truthy: selectedCard | [<br>              ['←', -40, 0, '왼쪽으로'],<br>              ['↑', 0, -40, '위로'],<br>              ['↓', 0, 40, '아래로'],<br>              ['→', 40, 0, '오른쪽으로'],<br>            ].map(([symbol, x, y, name]) => ( <Button key={symbol} aria-label={`카드 ${name} 이동`} disabled={!serverReady \|\| boot.blocked} onClick={() => move(Number(x), Number(y))} > {symbol} </Button> ))<br>call<br>전달 콜백: H-4ab6005d1736 |
| 1150행 | 별도 조건식 없음 | projection.cards.some((card) => card.kind === 'concept')<br>call<br>전달 콜백: H-1cb35a0eed7f |
| 1153행 | truthy: projection.cards.some((card) => card.kind === 'concept') | projection.cards.filter((card) => card.kind === 'concept')<br>call<br>전달 콜백: H-bca7541111a8 |
| 1155행 | truthy: projection.cards.some((card) => card.kind === 'concept') | projection.cards<br>            .filter((card) => card.kind === 'concept')<br>            .map((card) => ( <Button variant="quiet" key={card.id} onClick={() => { setSelectedId(card.id); setEditorId(card.id); setSelectedEdge(null); setFocusConcept(card.id); }} aria-label={`개념 카드 편집: ${card.name}`} > {card.name} </Button> ))<br>call<br>전달 콜백: H-4b0917eee9a6 |
| 1155행 | truthy: projection.cards.some((card) => card.kind === 'concept') | projection.cards<br>            .filter((card) => card.kind === 'concept')<br>call<br>전달 콜백: H-46ca96e208cb |
| 1174행 | 별도 조건식 없음 | projection.links.some((link) => !link.id.startsWith('auto:'))<br>call<br>전달 콜백: H-ff46d74c863e |
| 1177행 | truthy: projection.links.some((link) => !link.id.startsWith('auto:')) | projection.links<br>            .filter((link) => !link.id.startsWith('auto:'))<br>            .map((link) => ( <Button variant="quiet" key={link.id} onClick={() => { setSelectedEdge(link.id); setSelectedId(null); }} aria-label={`관계 수정: ${cardName(link.source)} → ${link.label} → ${cardName(link.target)}`} > {cardName(link.source)} → {link.label} → {cardName(link.target)} </Button> ))<br>call<br>전달 콜백: H-793b10a7c92c |
| 1177행 | truthy: projection.links.some((link) => !link.id.startsWith('auto:')) | projection.links<br>            .filter((link) => !link.id.startsWith('auto:'))<br>call<br>전달 콜백: H-2753dc09870a |

반환/조기 중단: 636행 <render> [별도 조건식 없음]

## H-826b5064ce5b

**@callback:useState** · [src/ui/study-canvas.tsx:237](../../../src/ui/study-canvas.tsx#L237)

분기 조건과 가능한 갈림길:

- B-259d84eedc08 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (243행).
- B-55de4fb292a9 · IfStatement · draft && draft.baseVersion !== (saved?.version ?? 0) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (245행).
- B-72c902433820 · IfStatement · JSON.stringify(draft.content) === JSON.stringify(fallback) → truthy / falsy; 바깥 조건: truthy: draft && draft.baseVersion !== (saved?.version ?? 0) (246행).
- B-353724455b8d · ConditionalExpression · draft → truthy / falsy; 바깥 조건: 별도 조건식 없음 (259행).
- B-1301eb15f650 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (264행).
- B-415de13e3aee · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (267행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 244행 | 별도 조건식 없음 | readCanvasDraft(data)<br>preservation-boundary |
| 246행 | truthy: draft && draft.baseVersion !== (saved?.version ?? 0) | JSON.stringify(draft.content)<br>call |
| 246행 | truthy: draft && draft.baseVersion !== (saved?.version ?? 0) | JSON.stringify(fallback)<br>call |
| 247행 | truthy: draft && draft.baseVersion !== (saved?.version ?? 0) ∧ truthy: JSON.stringify(draft.content) === JSON.stringify(fallback) | clearCanvasDraft(data)<br>preservation-boundary |

반환/조기 중단: 248행 { content: fallback, error: '', blocked: false } [truthy: draft && draft.baseVersion !== (saved?.version ?? 0) ∧ truthy: JSON.stringify(draft.content) === JSON.stringify(fallback)]; 250행 { content: fallback, error: '배치 초안과 저장된 배치의 수정 순서가 다릅니다. 두 내용을 보존했습니다. 초안 보관본에서 확인해 주세요.', blocked: true, } [truthy: draft && draft.baseVersion !== (saved?.version ?? 0)]; 257행 { content: draft?.content ?? fallback, error: draft ? '이 기기의 배치 초안을 불러왔습니다. 저장 다시 시도를 눌러 기록에 반영해 주세요.' : '', blocked: false, } [별도 조건식 없음]; 265행 { content: fallback, error: e instanceof Error ? e.message : 'Canvas 배치 초안을 읽지 못했습니다.', blocked: true, } [exception: e]

## H-e7db6a081ee5

**@callback:useState** · [src/ui/study-canvas.tsx:285](../../../src/ui/study-canvas.tsx#L285)

분기 조건과 가능한 갈림길:

- B-4a1d651128e3 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (286행).
- B-eedc4417b0e3 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (288행).
- B-c52f5e388a1e · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (291행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 287행 | 별도 조건식 없음 | readConnectionDraft(data)<br>preservation-boundary |

반환/조기 중단: 287행 { draft: readConnectionDraft(data), error: '' } [별도 조건식 없음]; 289행 { draft: { source: '', target: '', label: '' }, error: e instanceof Error ? e.message : '연결 초안을 읽지 못했습니다.', } [exception: e]

## H-fd3cd0c29125

**@callback:data.subjects.filter** · [src/ui/study-canvas.tsx:301](../../../src/ui/study-canvas.tsx#L301)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 301행 | truthy: !s.deletedAt | subjectIds.includes(s.id)<br>call |

## H-648038baf1e1

**@callback:useMemo** · [src/ui/study-canvas.tsx:306](../../../src/ui/study-canvas.tsx#L306)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 306행 | 별도 조건식 없음 | JSON.parse(subjectIdsKey)<br>call |

## H-b067f5124ce5

**@callback:useMemo** · [src/ui/study-canvas.tsx:307](../../../src/ui/study-canvas.tsx#L307)

분기 조건과 가능한 갈림길:

- B-28a609ada9e0 · ConditionalExpression · course === 'all' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (310행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 308행 | 별도 조건식 없음 | projectCanvas(data, course === 'all' ? scopeIds : scopeIds.filter((id) => id === course), { ...content, positions: { ...displayedPositions.current, ...content.positions } }, course === 'all')<br>call |
| 310행 | falsy: course === 'all' | scopeIds.filter((id) => id === course)<br>call<br>전달 콜백: H-e83659515ada |

반환/조기 중단: 315행 next [별도 조건식 없음]

## H-e83659515ada

**@callback:scopeIds.filter** · [src/ui/study-canvas.tsx:310](../../../src/ui/study-canvas.tsx#L310)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1cc2cec97a79

**save** · [src/ui/study-canvas.tsx:319](../../../src/ui/study-canvas.tsx#L319)

분기 조건과 가능한 갈림길:

- B-7b5018f65cd2 · IfStatement · boot.blocked || !serverReady → truthy / falsy; 바깥 조건: 별도 조건식 없음 (320행).
- B-a73a9b6c97bc · IfStatement · remember → truthy / falsy; 바깥 조건: 별도 조건식 없음 (328행).
- B-e04b0962134e · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (343행).
- B-a58690185c87 · IfStatement · !committedLayout → truthy / falsy; 바깥 조건: 별도 조건식 없음 (356행).
- B-474399cc9c95 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (360행).
- B-502abc942794 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (362행).
- B-73c94eb18a80 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (368행).
- B-7c60d5419496 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (370행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 324행 | 별도 조건식 없음 | Object.fromEntries(projection.cards.map((card) => [card.id, card.position]))<br>call |
| 324행 | 별도 조건식 없음 | projection.cards.map((card) => [card.id, card.position])<br>call<br>전달 콜백: H-3898fcbb77d3 |
| 329행 | truthy: remember | history.current.record({ ...(labelBefore.current ?? current.current), positions: { ...Object.fromEntries(projection.cards.map((card) => [card.id, card.position])), ...current.current.positions, }, }, next)<br>navigation |
| 333행 | truthy: remember | Object.fromEntries(projection.cards.map((card) => [card.id, card.position]))<br>call |
| 333행 | truthy: remember | projection.cards.map((card) => [card.id, card.position])<br>call<br>전달 콜백: H-0a85e0e695ba |
| 340행 | 별도 조건식 없음 | refreshHistory((value) => value + 1)<br>call<br>전달 콜백: H-3424ef7b6bbc |
| 341행 | 별도 조건식 없음 | setContent(next)<br>state-update |
| 344행 | 별도 조건식 없음 | writeCanvasDraft(data, { baseVersion: version.current, content: next })<br>preservation-boundary |
| 345행 | 별도 조건식 없음 | repository.execute({ type: 'saveCanvasLayout', id: CANVAS_ID, expectedVersion: version.current, ...next, opId: crypto.randomUUID(), at: new Date().toISOString(), userId: data.userId, namespace: data.namespace, })<br>call |
| 350행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 351행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 356행 | truthy: !committedLayout | Error('저장한 배치를 확인하지 못했습니다.')<br>call |
| 358행 | 별도 조건식 없음 | onSaved(result)<br>call |
| 359행 | 별도 조건식 없음 | setError('')<br>state-update |
| 361행 | 별도 조건식 없음 | clearCanvasDraft(data)<br>preservation-boundary |
| 363행 | exception: exception | setError('배치는 이 기기에 저장했습니다. 초안 정리가 남았습니다. 저장 다시 시도를 눌러 주세요.')<br>state-update |
| 369행 | exception: e | setError(`${e instanceof Error ? e.message : '저장하지 못했습니다.'} 화면의 배치는 유지했습니다. 저장 다시 시도로 재시도할 수 있습니다.`)<br>state-update |

반환/조기 중단: 320행 false [truthy: boot.blocked || !serverReady]; 367행 true [별도 조건식 없음]; 372행 false [exception: e]

throw: 356행 Error('저장한 배치를 확인하지 못했습니다.')

## H-3898fcbb77d3

**@callback:projection.cards.map** · [src/ui/study-canvas.tsx:324](../../../src/ui/study-canvas.tsx#L324)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-0a85e0e695ba

**@callback:projection.cards.map** · [src/ui/study-canvas.tsx:333](../../../src/ui/study-canvas.tsx#L333)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3424ef7b6bbc

**@callback:refreshHistory** · [src/ui/study-canvas.tsx:340](../../../src/ui/study-canvas.tsx#L340)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d8fb181daafb

**saveViewport** · [src/ui/study-canvas.tsx:375](../../../src/ui/study-canvas.tsx#L375)

분기 조건과 가능한 갈림길:

- B-0ebe01d1210e · IfStatement · viewport && JSON.stringify(viewport) !== JSON.stringify(current.current.viewport) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (377행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 377행 | truthy: viewport | JSON.stringify(viewport)<br>call |
| 377행 | truthy: viewport | JSON.stringify(current.current.viewport)<br>call |
| 378행 | truthy: viewport && JSON.stringify(viewport) !== JSON.stringify(current.current.viewport) | save({ ...current.current, viewport }, false)<br>call → [H-1cc2cec97a79](ui__study-canvas.md#h-1cc2cec97a79) |

## H-e8639a33dbd8

**saveControlViewport** · [src/ui/study-canvas.tsx:380](../../../src/ui/study-canvas.tsx#L380)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 380행 | 별도 조건식 없음 | requestAnimationFrame(saveViewport)<br>call<br>전달 콜백: H-d8fb181daafb |

## H-9b34205f154e

**@callback:useEffectEvent** · [src/ui/study-canvas.tsx:381](../../../src/ui/study-canvas.tsx#L381)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 382행 | 별도 조건식 없음 | setNodes((previous) => projection.cards.map((card) => { const previousNode = previous.find((row) => row.id === card.id); const memo = card.kind === 'memo' \|\| card.kind === 'concept' ? data.memos?.find((row) => row.id === card.entityId) : undefined; const narrative = card.kind === 'narrative' ? data.narratives.find((row) => row.id === card.entityId) : undefined; let editor: ReactNode; if (editorId === card.id) editor = card.kind === 'concept' && memo ? ( <CanvasConceptEditor key={memo.id} data={data} repository={repository} memo={memo} onSaved={(next) => { onSaved(next); setEditorId(null); }} onClose={() => setEditorId(null)} /> ) : memo ? ( <MemoEditor embedded key={memo.id} memo={memo} data={data} r … [전체 인수는 JSON·소스])<br>state-update<br>전달 콜백: H-d45580af3f21 |

## H-d45580af3f21

**@callback:setNodes** · [src/ui/study-canvas.tsx:382](../../../src/ui/study-canvas.tsx#L382)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 383행 | 별도 조건식 없음 | projection.cards.map((card) => { const previousNode = previous.find((row) => row.id === card.id); const memo = card.kind === 'memo' \|\| card.kind === 'concept' ? data.memos?.find((row) => row.id === card.entityId) : undefined; const narrative = card.kind === 'narrative' ? data.narratives.find((row) => row.id === card.entityId) : undefined; let editor: ReactNode; if (editorId === card.id) editor = card.kind === 'concept' && memo ? ( <CanvasConceptEditor key={memo.id} data={data} repository={repository} memo={memo} onSaved={(next) => { onSaved(next); setEditorId(null); }} onClose={() => setEditorId(null)} /> ) : memo ? ( <MemoEditor embedded key={memo.id} memo={memo} data={data} repository={repository} onSaved={onS … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-26fa8fb633a7 |

## H-26fa8fb633a7

**@callback:projection.cards.map** · [src/ui/study-canvas.tsx:383](../../../src/ui/study-canvas.tsx#L383)

분기 조건과 가능한 갈림길:

- B-c82e7682c0b8 · ConditionalExpression · card.kind === 'memo' || card.kind === 'concept' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (386행).
- B-b71f4499b0ce · ConditionalExpression · card.kind === 'narrative' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (390행).
- B-b1713228c08e · IfStatement · editorId === card.id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (394행).
- B-4d83835df779 · ConditionalExpression · card.kind === 'concept' && memo → truthy / falsy; 바깥 조건: truthy: editorId === card.id (396행).
- B-3a5a8ea10803 · ConditionalExpression · memo → truthy / falsy; 바깥 조건: truthy: editorId === card.id ∧ falsy: card.kind === 'concept' && memo (408행).
- B-1372dbeca65d · ConditionalExpression · previousNode?.dragging → truthy / falsy; 바깥 조건: 별도 조건식 없음 (440행).
- B-bbf120a8f16d · ConditionalExpression · editor → truthy / falsy; 바깥 조건: 별도 조건식 없음 (441행).
- B-c7a0ad1f122a · ConditionalExpression · card.kind === 'concept' && memo → truthy / falsy; 바깥 조건: 별도 조건식 없음 (448행).
- B-699356070859 · ConditionalExpression · savedCard?.id === card.id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (453행).
- B-2e397f969d69 · ConditionalExpression · serverReady && !boot.blocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (461행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 384행 | 별도 조건식 없음 | previous.find((row) => row.id === card.id)<br>call<br>전달 콜백: H-0abefb260862 |
| 391행 | truthy: card.kind === 'narrative' | data.narratives.find((row) => row.id === card.entityId)<br>call<br>전달 콜백: H-1e316fe38c24 |
| 421행 | truthy: editorId === card.id ∧ falsy: card.kind === 'concept' && memo ∧ falsy: memo | renderNarrative(narrative?.ownerId ?? card.entityId, narrative, () => { setEditorId((current) => (current === card.id ? null : current)); setSavedCard({ id: card.id, message: data.namespace === 'demo' ? '이 기기에 저장했습니다.' : '서버에 저장했습니다.', }); })<br>call<br>전달 콜백: H-c910c1104112 |
| 449행 | truthy: card.kind === 'concept' && memo | conceptText(memo.body)<br>call |

반환/조기 중단: 436행 { id: card.id, type: 'study', measured: previousNode?.measured, position: previousNode?.dragging ? previousNode.position : card.position, style: { width: editor ? 520 : (tools.value.nodeWidths[card.id] ?? 300) }, dragHandle: '.canvas-drag-handle', selected: previousNode?.selected ?? card.id === selectedId, data: { card, toolbarVisible: selectedId === card.id, body: card.kind === 'concept' && memo ? conceptText(memo.body).description : (memo?.body ?? narrative?.body), memo, editor, saveMessage: savedCard?.id === card.id ? savedCard.message : undefined, open: () => { setSavedCard(null); setSelectedId(card.id); setEditorId(card.id); }, close: () => setEditorId(null), resize: serverReady && !boo [별도 조건식 없음]

## H-0abefb260862

**@callback:previous.find** · [src/ui/study-canvas.tsx:384](../../../src/ui/study-canvas.tsx#L384)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1e316fe38c24

**@callback:data.narratives.find** · [src/ui/study-canvas.tsx:391](../../../src/ui/study-canvas.tsx#L391)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4e86d9fab939

**@onSaved** · [src/ui/study-canvas.tsx:402](../../../src/ui/study-canvas.tsx#L402)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 403행 | truthy: editorId === card.id ∧ truthy: card.kind === 'concept' && memo | onSaved(next)<br>call |
| 404행 | truthy: editorId === card.id ∧ truthy: card.kind === 'concept' && memo | setEditorId(null)<br>state-update |

## H-ed6064871920

**@onClose** · [src/ui/study-canvas.tsx:406](../../../src/ui/study-canvas.tsx#L406)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 406행 | truthy: editorId === card.id ∧ truthy: card.kind === 'concept' && memo | setEditorId(null)<br>state-update |

## H-96765be0cbb6

**@onClose** · [src/ui/study-canvas.tsx:416](../../../src/ui/study-canvas.tsx#L416)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 416행 | truthy: editorId === card.id ∧ falsy: card.kind === 'concept' && memo ∧ truthy: memo | setEditorId(null)<br>state-update |

## H-60f86b2a8746

**@onCopy** · [src/ui/study-canvas.tsx:417](../../../src/ui/study-canvas.tsx#L417)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 417행 | truthy: editorId === card.id ∧ falsy: card.kind === 'concept' && memo ∧ truthy: memo | setEditorId(`memo:${id}`)<br>state-update |

## H-c910c1104112

**@callback:renderNarrative** · [src/ui/study-canvas.tsx:421](../../../src/ui/study-canvas.tsx#L421)

분기 조건과 가능한 갈림길:

- B-92bc5ddbfc02 · ConditionalExpression · data.namespace === 'demo' → truthy / falsy; 바깥 조건: truthy: editorId === card.id ∧ falsy: card.kind === 'concept' && memo ∧ falsy: memo (426행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 422행 | truthy: editorId === card.id ∧ falsy: card.kind === 'concept' && memo ∧ falsy: memo | setEditorId((current) => (current === card.id ? null : current))<br>state-update<br>전달 콜백: H-056c24d2220a |
| 423행 | truthy: editorId === card.id ∧ falsy: card.kind === 'concept' && memo ∧ falsy: memo | setSavedCard({ id: card.id, message: data.namespace === 'demo' ? '이 기기에 저장했습니다.' : '서버에 저장했습니다.', })<br>state-update |

## H-056c24d2220a

**@callback:setEditorId** · [src/ui/study-canvas.tsx:422](../../../src/ui/study-canvas.tsx#L422)

분기 조건과 가능한 갈림길:

- B-cb359da900aa · ConditionalExpression · current === card.id → truthy / falsy; 바깥 조건: truthy: editorId === card.id ∧ falsy: card.kind === 'concept' && memo ∧ falsy: memo (422행).

## H-f275da53c7b1

**@onClick** · [src/ui/study-canvas.tsx:431](../../../src/ui/study-canvas.tsx#L431)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 431행 | truthy: editorId === card.id ∧ falsy: card.kind === 'concept' && memo ∧ falsy: memo | setEditorId(null)<br>state-update |

## H-b0472bad064d

**@callback:useEffect** · [src/ui/study-canvas.tsx:477](../../../src/ui/study-canvas.tsx#L477)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 478행 | 별도 조건식 없음 | synchronizeCards()<br>call |

## H-ad3a4ba3d434

**@callback:useEffect** · [src/ui/study-canvas.tsx:480](../../../src/ui/study-canvas.tsx#L480)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 481행 | 별도 조건식 없음 | requestAnimationFrame(() => { if (flow.current && course !== 'all') void flow.current.fitView({ padding: 0.16, minZoom: 0.25, maxZoom: 1 }); })<br>call<br>전달 콜백: H-55517bd82b65 |

반환/조기 중단: 485행 () => cancelAnimationFrame(frame) [별도 조건식 없음]

## H-55517bd82b65

**@callback:requestAnimationFrame** · [src/ui/study-canvas.tsx:481](../../../src/ui/study-canvas.tsx#L481)

분기 조건과 가능한 갈림길:

- B-9b6cd795068f · IfStatement · flow.current && course !== 'all' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (482행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 483행 | truthy: flow.current && course !== 'all' | flow.current.fitView({ padding: 0.16, minZoom: 0.25, maxZoom: 1 })<br>call |

## H-c389a2959813

**@callback:useEffect** · [src/ui/study-canvas.tsx:487](../../../src/ui/study-canvas.tsx#L487)

분기 조건과 가능한 갈림길:

- B-8d7d53344b69 · IfStatement · !focusConcept || !nodes.some((node) => node.id === focusConcept) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (488행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 488행 | falsy: !focusConcept | nodes.some((node) => node.id === focusConcept)<br>call<br>전달 콜백: H-c23db72eaa0b |
| 489행 | 별도 조건식 없음 | requestAnimationFrame(() => { void flow.current?.fitView({ nodes: [{ id: focusConcept }], padding: 0.3, minZoom: 0.25, maxZoom: 1, }); setFocusConcept(null); })<br>call<br>전달 콜백: H-f14bfc96ed1a |

반환/조기 중단: 488행 <render> [truthy: !focusConcept || !nodes.some((node) => node.id === focusConcept)]; 498행 () => cancelAnimationFrame(frame) [별도 조건식 없음]

## H-c23db72eaa0b

**@callback:nodes.some** · [src/ui/study-canvas.tsx:488](../../../src/ui/study-canvas.tsx#L488)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f14bfc96ed1a

**@callback:requestAnimationFrame** · [src/ui/study-canvas.tsx:489](../../../src/ui/study-canvas.tsx#L489)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 496행 | 별도 조건식 없음 | setFocusConcept(null)<br>state-update |

## H-55d01c70eb1b

**selectCards** · [src/ui/study-canvas.tsx:500](../../../src/ui/study-canvas.tsx#L500)

분기 조건과 가능한 갈림길:

- B-f1a6d4711df2 · ConditionalExpression · ids.length === 1 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (502행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 501행 | 별도 조건식 없음 | setSelectedIds(ids)<br>state-update |
| 502행 | 별도 조건식 없음 | setSelectedId(ids.length === 1 ? ids[0] : null)<br>state-update |
| 503행 | 별도 조건식 없음 | setNodes((previous) => previous.map((node) => ({ ...node, selected: ids.includes(node.id) })))<br>state-update<br>전달 콜백: H-ad6d35cbbddf |

## H-ad6d35cbbddf

**@callback:setNodes** · [src/ui/study-canvas.tsx:503](../../../src/ui/study-canvas.tsx#L503)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 503행 | 별도 조건식 없음 | previous.map((node) => ({ ...node, selected: ids.includes(node.id) }))<br>call<br>전달 콜백: H-47d588837a6d |

## H-47d588837a6d

**@callback:previous.map** · [src/ui/study-canvas.tsx:503](../../../src/ui/study-canvas.tsx#L503)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 503행 | 별도 조건식 없음 | ids.includes(node.id)<br>call |

## H-383e502c3d13

**@callback:useCallback** · [src/ui/study-canvas.tsx:505](../../../src/ui/study-canvas.tsx#L505)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 506행 | 별도 조건식 없음 | selection.map((node) => node.id)<br>call<br>전달 콜백: H-e6b1fd92acd2 |
| 507행 | 별도 조건식 없음 | setSelectedIds((previous) => JSON.stringify(previous) === JSON.stringify(ids) ? previous : ids)<br>state-update<br>전달 콜백: H-cb1508368309 |
| 510행 | 별도 조건식 없음 | setSelectedId((previous) => previous && ids.includes(previous) ? previous : ids.length === 1 ? ids[0] : null)<br>state-update<br>전달 콜백: H-e326d15e1222 |

## H-e6b1fd92acd2

**@callback:selection.map** · [src/ui/study-canvas.tsx:506](../../../src/ui/study-canvas.tsx#L506)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-cb1508368309

**@callback:setSelectedIds** · [src/ui/study-canvas.tsx:507](../../../src/ui/study-canvas.tsx#L507)

분기 조건과 가능한 갈림길:

- B-50abfacbdaae · ConditionalExpression · JSON.stringify(previous) === JSON.stringify(ids) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (508행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 508행 | 별도 조건식 없음 | JSON.stringify(previous)<br>call |
| 508행 | 별도 조건식 없음 | JSON.stringify(ids)<br>call |

## H-e326d15e1222

**@callback:setSelectedId** · [src/ui/study-canvas.tsx:510](../../../src/ui/study-canvas.tsx#L510)

분기 조건과 가능한 갈림길:

- B-5b52e120fa73 · ConditionalExpression · previous && ids.includes(previous) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (511행).
- B-156e60c816d9 · ConditionalExpression · ids.length === 1 → truthy / falsy; 바깥 조건: falsy: previous && ids.includes(previous) (511행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 511행 | truthy: previous | ids.includes(previous)<br>call |

## H-2260b3ca0a1f

**@callback:projection.links.map** · [src/ui/study-canvas.tsx:514](../../../src/ui/study-canvas.tsx#L514)

분기 조건과 가능한 갈림길:

- B-c94d43a35a4f · ConditionalExpression · link.id.startsWith('auto:') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (521행).
- B-1b56485314e0 · ConditionalExpression · link.id.startsWith('auto:') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (522행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 516행 | 별도 조건식 없음 | flowEdgeType(tools.value.edgeStyle)<br>call → [H-e5c9f4b796e1](ui__flow-experience.md#h-e5c9f4b796e1) |
| 517행 | 별도 조건식 없음 | link.id.startsWith('auto:')<br>call |
| 521행 | 별도 조건식 없음 | link.id.startsWith('auto:')<br>call |
| 522행 | 별도 조건식 없음 | link.id.startsWith('auto:')<br>call |

## H-d5e374a87195

**move** · [src/ui/study-canvas.tsx:524](../../../src/ui/study-canvas.tsx#L524)

분기 조건과 가능한 갈림길:

- B-f0d50d6a0563 · IfStatement · !card → truthy / falsy; 바깥 조건: 별도 조건식 없음 (526행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 525행 | 별도 조건식 없음 | projection.cards.find((row) => row.id === selectedId)<br>call<br>전달 콜백: H-8ce5ec6653e4 |
| 527행 | 별도 조건식 없음 | save({ ...current.current, positions: { ...current.current.positions, [card.id]: { x: card.position.x + x, y: card.position.y + y }, }, })<br>call → [H-1cc2cec97a79](ui__study-canvas.md#h-1cc2cec97a79) |

반환/조기 중단: 526행 <render> [truthy: !card]

## H-8ce5ec6653e4

**@callback:projection.cards.find** · [src/ui/study-canvas.tsx:525](../../../src/ui/study-canvas.tsx#L525)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-77fbef2cc92b

**@callback:projection.cards.map** · [src/ui/study-canvas.tsx:535](../../../src/ui/study-canvas.tsx#L535)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-0e5fa6d384b0

**validConnection** · [src/ui/study-canvas.tsx:536](../../../src/ui/study-canvas.tsx#L536)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 537행 | 별도 조건식 없음 | validFlowConnection(source, target, cardIds, current.current.links, replacing)<br>call |

## H-ed39344efaa7

**arrange** · [src/ui/study-canvas.tsx:538](../../../src/ui/study-canvas.tsx#L538)

분기 조건과 가능한 갈림길:

- B-04b92ab79376 · ConditionalExpression · axis → truthy / falsy; 바깥 조건: 별도 조건식 없음 (547행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 539행 | 별도 조건식 없음 | nodes<br>      .filter((node) => !axis \|\| selectedIds.includes(node.id))<br>      .map((node) => ({ id: node.id, position: node.position, width: node.measured?.width, height: node.measured?.height, }))<br>call<br>전달 콜백: H-7c6b7e7f71e9 |
| 539행 | 별도 조건식 없음 | nodes<br>      .filter((node) => !axis \|\| selectedIds.includes(node.id))<br>call<br>전달 콜백: H-c677ffa14189 |
| 547행 | truthy: axis | alignFlowBoxes(boxes, axis)<br>call |
| 547행 | falsy: axis | layoutFlowBoxes(boxes, projection.links)<br>call |
| 548행 | 별도 조건식 없음 | save({ ...current.current, positions: { ...current.current.positions, ...positions } })<br>call → [H-1cc2cec97a79](ui__study-canvas.md#h-1cc2cec97a79) |

## H-c677ffa14189

**@callback:nodes
      .filter** · [src/ui/study-canvas.tsx:540](../../../src/ui/study-canvas.tsx#L540)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 540행 | falsy: !axis | selectedIds.includes(node.id)<br>call |

## H-7c6b7e7f71e9

**@callback:nodes
      .filter((node) => !axis || selectedIds.includes(node.id))
      .map** · [src/ui/study-canvas.tsx:541](../../../src/ui/study-canvas.tsx#L541)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a66e12daace0

**travel** · [src/ui/study-canvas.tsx:550](../../../src/ui/study-canvas.tsx#L550)

분기 조건과 가능한 갈림길:

- B-5737c50a6362 · IfStatement · next → truthy / falsy; 바깥 조건: 별도 조건식 없음 (552행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 551행 | 별도 조건식 없음 | history.current[direction](current.current)<br>navigation |
| 552행 | truthy: next | save(next, false)<br>call → [H-1cc2cec97a79](ui__study-canvas.md#h-1cc2cec97a79) |

## H-9b1612b13d3a

**@callback:content.links.find** · [src/ui/study-canvas.tsx:554](../../../src/ui/study-canvas.tsx#L554)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-23fdac5af5e1

**cardName** · [src/ui/study-canvas.tsx:555](../../../src/ui/study-canvas.tsx#L555)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 556행 | 별도 조건식 없음 | projection.cards.find((card) => card.id === id)<br>call<br>전달 콜백: H-186778436615 |

## H-186778436615

**@callback:projection.cards.find** · [src/ui/study-canvas.tsx:556](../../../src/ui/study-canvas.tsx#L556)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-28b706518b72

**changeConnection** · [src/ui/study-canvas.tsx:557](../../../src/ui/study-canvas.tsx#L557)

분기 조건과 가능한 갈림길:

- B-d9e117d16dbd · IfStatement · connectionBoot.error → truthy / falsy; 바깥 조건: 별도 조건식 없음 (559행).
- B-1fef8b35bb60 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (560행).
- B-abeb532490a3 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (563행).
- B-9ad1461ea2c0 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (564행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 558행 | 별도 조건식 없음 | setConnection(next)<br>state-update |
| 561행 | 별도 조건식 없음 | writeConnectionDraft(data, next)<br>preservation-boundary |
| 562행 | 별도 조건식 없음 | setConnectionError('')<br>state-update |
| 564행 | exception: e | setConnectionError(e instanceof Error ? e.message : '연결 설명을 보관하지 못했습니다.')<br>state-update |

반환/조기 중단: 559행 <render> [truthy: connectionBoot.error]

## H-b7b7f2b98fc7

**addConnection** · [src/ui/study-canvas.tsx:567](../../../src/ui/study-canvas.tsx#L567)

분기 조건과 가능한 갈림길:

- B-ae3d5de1971a · IfStatement · composing || connectionBoot.error || !connection.label.trim() → truthy / falsy; 바깥 조건: 별도 조건식 없음 (568행).
- B-9debf96f155c · IfStatement · !validConnection(connection.source, connection.target) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (569행).
- B-6b0f281758af · IfStatement · save({ ...current.current, links: previous ? current.current.links : [...current.current.links, link], }) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (582행).
- B-557477156993 · ConditionalExpression · previous → truthy / falsy; 바깥 조건: 별도 조건식 없음 (585행).
- B-3803d38b7b3e · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: save({
        ...current.current,
        links: previous ? current.current.links : [...current.current.links, link],
      }) (591행).
- B-a0fdc14ec137 · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: save({
        ...current.current,
        links: previous ? current.current.links : [...current.current.links, link],
      }) (594행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 568행 | falsy: composing \|\| connectionBoot.error | connection.label.trim()<br>call |
| 569행 | 별도 조건식 없음 | validConnection(connection.source, connection.target)<br>call → [H-0e5fa6d384b0](ui__study-canvas.md#h-0e5fa6d384b0) |
| 570행 | truthy: !validConnection(connection.source, connection.target) | setConnectionError('서로 다른 두 카드를 선택해 주세요. 같은 방향의 연결은 기존 관계에서 수정할 수 있습니다.')<br>state-update |
| 575행 | 별도 조건식 없음 | current.current.links.find((link) => link.source === connection.source && link.target === connection.target && link.label === connection.label)<br>call<br>전달 콜백: H-1deafacd185c |
| 581행 | nullish: previous | crypto.randomUUID()<br>call |
| 583행 | 별도 조건식 없음 | save({ ...current.current, links: previous ? current.current.links : [...current.current.links, link], })<br>call → [H-1cc2cec97a79](ui__study-canvas.md#h-1cc2cec97a79) |
| 588행 | truthy: save({<br>        ...current.current,<br>        links: previous ? current.current.links : [...current.current.links, link],<br>      }) | setSelectedEdge(link.id)<br>state-update |
| 589행 | truthy: save({<br>        ...current.current,<br>        links: previous ? current.current.links : [...current.current.links, link],<br>      }) | setSelectedId(null)<br>state-update |
| 590행 | truthy: save({<br>        ...current.current,<br>        links: previous ? current.current.links : [...current.current.links, link],<br>      }) | setConnectionOpen(false)<br>state-update |
| 592행 | truthy: save({<br>        ...current.current,<br>        links: previous ? current.current.links : [...current.current.links, link],<br>      }) | clearConnectionDraft(data)<br>preservation-boundary |
| 593행 | truthy: save({<br>        ...current.current,<br>        links: previous ? current.current.links : [...current.current.links, link],<br>      }) | setConnection({ source: '', target: '', label: '' })<br>state-update |
| 595행 | truthy: save({<br>        ...current.current,<br>        links: previous ? current.current.links : [...current.current.links, link],<br>      }) ∧ exception: exception | setConnectionError('연결은 저장했습니다. 작성 중이던 연결 설명도 남아 있습니다.')<br>state-update |

반환/조기 중단: 568행 <render> [truthy: composing || connectionBoot.error || !connection.label.trim()]; 573행 <render> [truthy: !validConnection(connection.source, connection.target)]

## H-1deafacd185c

**@callback:current.current.links.find** · [src/ui/study-canvas.tsx:576](../../../src/ui/study-canvas.tsx#L576)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-63c0aed2acc3

**changeLabel** · [src/ui/study-canvas.tsx:599](../../../src/ui/study-canvas.tsx#L599)

분기 조건과 가능한 갈림길:

- B-6ff5fc22e624 · IfStatement · !custom || boot.blocked || !serverReady → truthy / falsy; 바깥 조건: 별도 조건식 없음 (600행).
- B-8fdf2f133e90 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (610행).
- B-0a81b9e32487 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (612행).
- B-8eececd462e0 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (613행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 601행 | 별도 조건식 없음 | structuredClone(current.current)<br>call |
| 604행 | 별도 조건식 없음 | current.current.links.map((link) => link.id === custom.id ? { ...link, label } : link)<br>call<br>전달 콜백: H-7b5150a2c530 |
| 608행 | 별도 조건식 없음 | setContent(next)<br>state-update |
| 611행 | 별도 조건식 없음 | writeCanvasDraft(data, { baseVersion: version.current, content: next })<br>preservation-boundary |
| 613행 | exception: e | setError(e instanceof Error ? e.message : '연결 설명 초안을 보관하지 못했습니다.')<br>state-update |

반환/조기 중단: 600행 <render> [truthy: !custom || boot.blocked || !serverReady]

## H-7b5150a2c530

**@callback:current.current.links.map** · [src/ui/study-canvas.tsx:604](../../../src/ui/study-canvas.tsx#L604)

분기 조건과 가능한 갈림길:

- B-b1c11ee91b79 · ConditionalExpression · link.id === custom.id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (605행).

## H-e5a85a026c6c

**keyboardHistory** · [src/ui/study-canvas.tsx:616](../../../src/ui/study-canvas.tsx#L616)

분기 조건과 가능한 갈림길:

- B-45897d55fc43 · IfStatement · !(event.ctrlKey || event.metaKey) || composing || editorId || boot.blocked || !serverReady || (event.target instanceof HTMLElement && event.target.closest('input,textarea,select,[contenteditable=true]')) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (617행).
- B-a83dc2645e55 · IfStatement · (redo && history.current.canRedo) || (undo && history.current.canUndo) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (630행).
- B-1d1524b66a09 · ConditionalExpression · redo → truthy / falsy; 바깥 조건: truthy: (redo && history.current.canRedo) || (undo && history.current.canUndo) (632행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 624행 | falsy: !(event.ctrlKey \|\| event.metaKey) \|\|<br>      composing \|\|<br>      editorId \|\|<br>      boot.blocked \|\|<br>      !serverReady ∧ truthy: event.target instanceof HTMLElement | event.target.closest('input,textarea,select,[contenteditable=true]')<br>call |
| 628행 | 별도 조건식 없음 | event.key.toLowerCase()<br>call |
| 628행 | falsy: event.key.toLowerCase() === 'y' | event.key.toLowerCase()<br>call |
| 629행 | 별도 조건식 없음 | event.key.toLowerCase()<br>call |
| 631행 | truthy: (redo && history.current.canRedo) \|\| (undo && history.current.canUndo) | event.preventDefault()<br>input-control |
| 632행 | truthy: (redo && history.current.canRedo) \|\| (undo && history.current.canUndo) | travel(redo ? 'redo' : 'undo')<br>call → [H-a66e12daace0](ui__study-canvas.md#h-a66e12daace0) |

반환/조기 중단: 626행 <render> [truthy: !(event.ctrlKey || event.metaKey) ||
      composing ||
      editorId ||
      boot.blocked ||
      !serverReady ||
      (event.target instanceof HTMLElement &&
        event.target.closest('input,textarea,select,[contenteditable=true]'))]

## H-1c86a326b2f1

**@callback:projection.cards.find** · [src/ui/study-canvas.tsx:635](../../../src/ui/study-canvas.tsx#L635)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6acb114b6bb3

**@onChange** · [src/ui/study-canvas.tsx:642](../../../src/ui/study-canvas.tsx#L642)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 643행 | 별도 조건식 없음 | setCourse(event.target.value)<br>state-update |
| 644행 | 별도 조건식 없음 | setEditorId(null)<br>state-update |
| 645행 | 별도 조건식 없음 | setSelectedId(null)<br>state-update |
| 646행 | 별도 조건식 없음 | setSelectedIds([])<br>state-update |

## H-b5e98c668388

**@callback:subjects.map** · [src/ui/study-canvas.tsx:650](../../../src/ui/study-canvas.tsx#L650)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-69e425ffe37d

**@onClick** · [src/ui/study-canvas.tsx:657](../../../src/ui/study-canvas.tsx#L657)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d93af69394c1

**@onClick** · [src/ui/study-canvas.tsx:669](../../../src/ui/study-canvas.tsx#L669)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 669행 | 별도 조건식 없음 | setConceptOpen(!conceptOpen)<br>state-update |

## H-00d2ecc75360

**@onClick** · [src/ui/study-canvas.tsx:676](../../../src/ui/study-canvas.tsx#L676)

분기 조건과 가능한 갈림길:

- B-46f826d556f5 · IfStatement · !connection.source && selectedId → truthy / falsy; 바깥 조건: 별도 조건식 없음 (678행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 677행 | 별도 조건식 없음 | setConnectionOpen(!connectionOpen)<br>state-update |
| 679행 | truthy: !connection.source && selectedId | changeConnection({ ...connection, source: selectedId })<br>call → [H-28b706518b72](ui__study-canvas.md#h-28b706518b72) |

## H-cf34d8cb22c0

**@onClick** · [src/ui/study-canvas.tsx:686](../../../src/ui/study-canvas.tsx#L686)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 686행 | 별도 조건식 없음 | arrange()<br>call → [H-ed39344efaa7](ui__study-canvas.md#h-ed39344efaa7) |

## H-105cee026690

**@onClick** · [src/ui/study-canvas.tsx:692](../../../src/ui/study-canvas.tsx#L692)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 692행 | 별도 조건식 없음 | travel('undo')<br>call → [H-a66e12daace0](ui__study-canvas.md#h-a66e12daace0) |

## H-2cf3fd2739e5

**@onClick** · [src/ui/study-canvas.tsx:698](../../../src/ui/study-canvas.tsx#L698)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 698행 | 별도 조건식 없음 | travel('redo')<br>call → [H-a66e12daace0](ui__study-canvas.md#h-a66e12daace0) |

## H-76b79a63b34b

**@onClick** · [src/ui/study-canvas.tsx:702](../../../src/ui/study-canvas.tsx#L702)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 702행 | 별도 조건식 없음 | setTransferOpen(!transferOpen)<br>state-update |

## H-d4b5dd4bd2b4

**@onClick** · [src/ui/study-canvas.tsx:710](../../../src/ui/study-canvas.tsx#L710)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 710행 | truthy: tools.error | tools.store(tools.value)<br>call |

## H-770fa0a68a0f

**@onImport** · [src/ui/study-canvas.tsx:724](../../../src/ui/study-canvas.tsx#L724)

분기 조건과 가능한 갈림길:

- B-0abcc75e675d · IfStatement · !save(next) → truthy / falsy; 바깥 조건: truthy: transferOpen (725행).
- B-3e6f37808dd3 · IfStatement · next.viewport → truthy / falsy; 바깥 조건: truthy: transferOpen (726행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 725행 | truthy: transferOpen | save(next)<br>call → [H-1cc2cec97a79](ui__study-canvas.md#h-1cc2cec97a79) |

반환/조기 중단: 725행 false [truthy: transferOpen ∧ truthy: !save(next)]; 727행 true [truthy: transferOpen]

## H-150adf459e19

**@onClick** · [src/ui/study-canvas.tsx:741](../../../src/ui/study-canvas.tsx#L741)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 741행 | truthy: error ∧ truthy: !boot.blocked | save(current.current)<br>call → [H-1cc2cec97a79](ui__study-canvas.md#h-1cc2cec97a79) |

## H-e37550eb0596

**@onClick** · [src/ui/study-canvas.tsx:746](../../../src/ui/study-canvas.tsx#L746)

분기 조건과 가능한 갈림길:

- B-6bdfe9217674 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: error ∧ falsy: !boot.blocked (747행).
- B-32b79dfc9541 · CatchClause · e → exception; 바깥 조건: truthy: error ∧ falsy: !boot.blocked (752행).
- B-7dbf5c98830e · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: truthy: error ∧ falsy: !boot.blocked ∧ exception: e (753행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 748행 | truthy: error ∧ falsy: !boot.blocked | preserveCanvasDraft(data)<br>preservation-boundary |
| 749행 | truthy: error ∧ falsy: !boot.blocked | setError('초안 원문 사본을 보관했습니다. 초안 보관본에서 확인할 수 있습니다. 저장된 배치는 유지했습니다.')<br>state-update |
| 753행 | truthy: error ∧ falsy: !boot.blocked ∧ exception: e | setError(e instanceof Error ? e.message : '초안 사본을 보관하지 못했습니다.')<br>state-update |

## H-feae725ed86a

**@onSaved** · [src/ui/study-canvas.tsx:768](../../../src/ui/study-canvas.tsx#L768)

분기 조건과 가능한 갈림길:

- B-b3bcab6b62d2 · IfStatement · course !== 'all' && owner !== course → truthy / falsy; 바깥 조건: truthy: conceptOpen (774행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 769행 | truthy: conceptOpen | onSaved(next)<br>call |
| 770행 | truthy: conceptOpen | setConceptOpen(false)<br>state-update |
| 771행 | truthy: conceptOpen | setSelectedId(`memo:${memoId}`)<br>state-update |
| 772행 | truthy: conceptOpen | setFocusConcept(`memo:${memoId}`)<br>state-update |
| 774행 | truthy: conceptOpen ∧ truthy: course !== 'all' && owner !== course | setCourse('all')<br>state-update |

## H-db205a9eae26

**@onClose** · [src/ui/study-canvas.tsx:776](../../../src/ui/study-canvas.tsx#L776)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 776행 | truthy: conceptOpen | setConceptOpen(false)<br>state-update |

## H-921a29a9c45c

**@onCompositionStart** · [src/ui/study-canvas.tsx:782](../../../src/ui/study-canvas.tsx#L782)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 782행 | truthy: connectionOpen | setComposing(true)<br>state-update |

## H-a54b4e922094

**@onCompositionEnd** · [src/ui/study-canvas.tsx:783](../../../src/ui/study-canvas.tsx#L783)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 783행 | truthy: connectionOpen | setComposing(false)<br>state-update |

## H-40db00ec979c

**@onSubmit** · [src/ui/study-canvas.tsx:784](../../../src/ui/study-canvas.tsx#L784)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 785행 | truthy: connectionOpen | event.preventDefault()<br>input-control |
| 786행 | truthy: connectionOpen | addConnection()<br>call → [H-b7b7f2b98fc7](ui__study-canvas.md#h-b7b7f2b98fc7) |

## H-588ea8c4ec00

**@onChange** · [src/ui/study-canvas.tsx:795](../../../src/ui/study-canvas.tsx#L795)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 795행 | truthy: connectionOpen | changeConnection({ ...connection, source: event.target.value })<br>call → [H-28b706518b72](ui__study-canvas.md#h-28b706518b72) |

## H-0b6ddaa8fbe2

**@callback:projection.cards.map** · [src/ui/study-canvas.tsx:798](../../../src/ui/study-canvas.tsx#L798)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-19faa37af3d6

**@onChange** · [src/ui/study-canvas.tsx:808](../../../src/ui/study-canvas.tsx#L808)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 808행 | truthy: connectionOpen | changeConnection({ ...connection, target: event.target.value })<br>call → [H-28b706518b72](ui__study-canvas.md#h-28b706518b72) |

## H-86215e28cc30

**@callback:projection.cards
                .filter** · [src/ui/study-canvas.tsx:812](../../../src/ui/study-canvas.tsx#L812)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-de2e8b401bd3

**@callback:projection.cards
                .filter((card) => card.id !== connection.source)
                .map** · [src/ui/study-canvas.tsx:813](../../../src/ui/study-canvas.tsx#L813)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-015728ff3626

**@onChange** · [src/ui/study-canvas.tsx:825](../../../src/ui/study-canvas.tsx#L825)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 825행 | truthy: connectionOpen | changeConnection({ ...connection, label: event.target.value })<br>call → [H-28b706518b72](ui__study-canvas.md#h-28b706518b72) |

## H-1bb46ba0e302

**@onClick** · [src/ui/study-canvas.tsx:859](../../../src/ui/study-canvas.tsx#L859)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 859행 | truthy: connectionOpen | setConnectionOpen(false)<br>state-update |

## H-71766f0a4dbe

**@onCompositionStart** · [src/ui/study-canvas.tsx:866](../../../src/ui/study-canvas.tsx#L866)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 866행 | truthy: custom | setComposing(true)<br>state-update |

## H-89b3568d42c9

**@onCompositionEnd** · [src/ui/study-canvas.tsx:867](../../../src/ui/study-canvas.tsx#L867)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 867행 | truthy: custom | setComposing(false)<br>state-update |

## H-33e7585025b9

**@onSubmit** · [src/ui/study-canvas.tsx:868](../../../src/ui/study-canvas.tsx#L868)

분기 조건과 가능한 갈림길:

- B-9be9d72ec17b · IfStatement · !composing → truthy / falsy; 바깥 조건: truthy: custom (870행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 869행 | truthy: custom | event.preventDefault()<br>input-control |
| 870행 | truthy: custom ∧ truthy: !composing | save(current.current)<br>call → [H-1cc2cec97a79](ui__study-canvas.md#h-1cc2cec97a79) |

## H-9439fafb02ec

**@callback:(['source', 'target'] as const).map** · [src/ui/study-canvas.tsx:876](../../../src/ui/study-canvas.tsx#L876)

분기 조건과 가능한 갈림길:

- B-f45f995eb27c · ConditionalExpression · end === 'source' → truthy / falsy; 바깥 조건: truthy: custom (879행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 897행 | truthy: custom | projection.cards.map((card) => ( <option key={card.id} value={card.id}> {card.name} </option> ))<br>call<br>전달 콜백: H-62df7f7176d3 |

## H-5534457de7f8

**@onChange** · [src/ui/study-canvas.tsx:882](../../../src/ui/study-canvas.tsx#L882)

분기 조건과 가능한 갈림길:

- B-bb558f94e2cd · IfStatement · validConnection(next.source, next.target, custom.id) → truthy / falsy; 바깥 조건: truthy: custom (884행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 884행 | truthy: custom | validConnection(next.source, next.target, custom.id)<br>call → [H-0e5fa6d384b0](ui__study-canvas.md#h-0e5fa6d384b0) |
| 885행 | truthy: custom ∧ truthy: validConnection(next.source, next.target, custom.id) | save({ ...current.current, links: current.current.links.map((link) => link.id === custom.id ? next : link, ), })<br>call → [H-1cc2cec97a79](ui__study-canvas.md#h-1cc2cec97a79) |
| 887행 | truthy: custom ∧ truthy: validConnection(next.source, next.target, custom.id) | current.current.links.map((link) => link.id === custom.id ? next : link)<br>call<br>전달 콜백: H-8d4e8d34edcb |
| 892행 | truthy: custom ∧ falsy: validConnection(next.source, next.target, custom.id) | setError('같은 카드 또는 이미 연결한 방향으로 바꿀 수 없습니다. 기존 연결은 유지했습니다.')<br>state-update |

## H-8d4e8d34edcb

**@callback:current.current.links.map** · [src/ui/study-canvas.tsx:887](../../../src/ui/study-canvas.tsx#L887)

분기 조건과 가능한 갈림길:

- B-a9e49784e3f0 · ConditionalExpression · link.id === custom.id → truthy / falsy; 바깥 조건: truthy: custom ∧ truthy: validConnection(next.source, next.target, custom.id) (888행).

## H-62df7f7176d3

**@callback:projection.cards.map** · [src/ui/study-canvas.tsx:897](../../../src/ui/study-canvas.tsx#L897)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d8f59cdcd661

**@onChange** · [src/ui/study-canvas.tsx:909](../../../src/ui/study-canvas.tsx#L909)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 909행 | truthy: custom | changeLabel(event.target.value)<br>call → [H-63c0aed2acc3](ui__study-canvas.md#h-63c0aed2acc3) |

## H-475d80948b42

**@onClick** · [src/ui/study-canvas.tsx:917](../../../src/ui/study-canvas.tsx#L917)

분기 조건과 가능한 갈림길:

- B-f9b47d75c6fa · IfStatement · save({ ...current.current, links: current.current.links.filter((link) => link.id !== custom.id), }) → truthy / falsy; 바깥 조건: truthy: custom (918행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 919행 | truthy: custom | save({ ...current.current, links: current.current.links.filter((link) => link.id !== custom.id), })<br>call → [H-1cc2cec97a79](ui__study-canvas.md#h-1cc2cec97a79) |
| 921행 | truthy: custom | current.current.links.filter((link) => link.id !== custom.id)<br>call<br>전달 콜백: H-001e587e0fbe |
| 924행 | truthy: custom ∧ truthy: save({<br>                  ...current.current,<br>                  links: current.current.links.filter((link) => link.id !== custom.id),<br>                }) | setSelectedEdge(null)<br>state-update |

## H-001e587e0fbe

**@callback:current.current.links.filter** · [src/ui/study-canvas.tsx:921](../../../src/ui/study-canvas.tsx#L921)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-46620541b898

**@onClick** · [src/ui/study-canvas.tsx:929](../../../src/ui/study-canvas.tsx#L929)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 929행 | truthy: custom | setSelectedEdge(null)<br>state-update |

## H-1453fd28d8c4

**@onInit** · [src/ui/study-canvas.tsx:947](../../../src/ui/study-canvas.tsx#L947)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-2abf79ee3682

**@onNodesChange** · [src/ui/study-canvas.tsx:950](../../../src/ui/study-canvas.tsx#L950)

분기 조건과 가능한 갈림길:

- B-e83078d3fad3 · IfStatement · moved.length → truthy / falsy; 바깥 조건: falsy: !projection.cards.length (955행).
- B-9a624c09481b · IfStatement · change.type === 'position' && change.position && JSON.stringify(positions[change.id]) !== JSON.stringify(change.position) → truthy / falsy; 바깥 조건: falsy: !projection.cards.length ∧ truthy: moved.length (959행).
- B-af3d7a83c5af · IfStatement · changed → truthy / falsy; 바깥 조건: falsy: !projection.cards.length ∧ truthy: moved.length (967행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 951행 | falsy: !projection.cards.length | setNodes((previous) => applyNodeChanges(changes, previous))<br>state-update<br>전달 콜백: H-dd0b6f3ec600 |
| 952행 | falsy: !projection.cards.length | changes.filter((change) => change.type === 'position' && change.position && !change.dragging)<br>call<br>전달 콜백: H-1a29ea5faaa1 |
| 962행 | falsy: !projection.cards.length ∧ truthy: moved.length ∧ truthy: change.type === 'position' &&<br>                    change.position | JSON.stringify(positions[change.id])<br>call |
| 962행 | falsy: !projection.cards.length ∧ truthy: moved.length ∧ truthy: change.type === 'position' &&<br>                    change.position | JSON.stringify(change.position)<br>call |
| 967행 | falsy: !projection.cards.length ∧ truthy: moved.length ∧ truthy: changed | save({ ...current.current, positions })<br>call → [H-1cc2cec97a79](ui__study-canvas.md#h-1cc2cec97a79) |

## H-dd0b6f3ec600

**@callback:setNodes** · [src/ui/study-canvas.tsx:951](../../../src/ui/study-canvas.tsx#L951)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 951행 | falsy: !projection.cards.length | applyNodeChanges(changes, previous)<br>call |

## H-1a29ea5faaa1

**@callback:changes.filter** · [src/ui/study-canvas.tsx:953](../../../src/ui/study-canvas.tsx#L953)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7523d03163f5

**@onNodeClick** · [src/ui/study-canvas.tsx:970](../../../src/ui/study-canvas.tsx#L970)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 971행 | falsy: !projection.cards.length | setSelectedId(card.id)<br>state-update |
| 972행 | falsy: !projection.cards.length | setSelectedEdge(null)<br>state-update |

## H-d399ee2c37a4

**@onNodeContextMenu** · [src/ui/study-canvas.tsx:974](../../../src/ui/study-canvas.tsx#L974)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 975행 | falsy: !projection.cards.length | event.preventDefault()<br>input-control |
| 976행 | falsy: !projection.cards.length | setSelectedId(card.id)<br>state-update |
| 977행 | falsy: !projection.cards.length | setSelectedIds([card.id])<br>state-update |
| 978행 | falsy: !projection.cards.length | setSelectedEdge(null)<br>state-update |

## H-7850ec7d6c62

**@onEdgeClick** · [src/ui/study-canvas.tsx:981](../../../src/ui/study-canvas.tsx#L981)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 982행 | falsy: !projection.cards.length | setSelectedEdge(edge.id)<br>state-update |
| 983행 | falsy: !projection.cards.length | setSelectedId(null)<br>state-update |

## H-80ebf6e11e2e

**@onMoveEnd** · [src/ui/study-canvas.tsx:985](../../../src/ui/study-canvas.tsx#L985)

분기 조건과 가능한 갈림길:

- B-f5e31d0c9bba · IfStatement · event && JSON.stringify(viewport) !== JSON.stringify(current.current.viewport) → truthy / falsy; 바깥 조건: falsy: !projection.cards.length (986행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 986행 | falsy: !projection.cards.length ∧ truthy: event | JSON.stringify(viewport)<br>call |
| 986행 | falsy: !projection.cards.length ∧ truthy: event | JSON.stringify(current.current.viewport)<br>call |
| 987행 | falsy: !projection.cards.length ∧ truthy: event && JSON.stringify(viewport) !== JSON.stringify(current.current.viewport) | save({ ...current.current, viewport })<br>call → [H-1cc2cec97a79](ui__study-canvas.md#h-1cc2cec97a79) |

## H-b22d0d38811b

**@onConnect** · [src/ui/study-canvas.tsx:996](../../../src/ui/study-canvas.tsx#L996)

분기 조건과 가능한 갈림길:

- B-7d605896071d · IfStatement · validConnection(next.source, next.target) → truthy / falsy; 바깥 조건: falsy: !projection.cards.length (997행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 997행 | falsy: !projection.cards.length | validConnection(next.source, next.target)<br>call → [H-0e5fa6d384b0](ui__study-canvas.md#h-0e5fa6d384b0) |
| 998행 | falsy: !projection.cards.length ∧ truthy: validConnection(next.source, next.target) | changeConnection({ ...connection, source: next.source, target: next.target })<br>call → [H-28b706518b72](ui__study-canvas.md#h-28b706518b72) |
| 999행 | falsy: !projection.cards.length ∧ truthy: validConnection(next.source, next.target) | setConnectionOpen(true)<br>state-update |

## H-82350241f2d0

**@onReconnect** · [src/ui/study-canvas.tsx:1002](../../../src/ui/study-canvas.tsx#L1002)

분기 조건과 가능한 갈림길:

- B-0ffd10d77591 · IfStatement · !edge.id.startsWith('auto:') && validConnection(next.source, next.target, edge.id) → truthy / falsy; 바깥 조건: falsy: !projection.cards.length (1003행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1004행 | falsy: !projection.cards.length | edge.id.startsWith('auto:')<br>call |
| 1005행 | falsy: !projection.cards.length ∧ truthy: !edge.id.startsWith('auto:') | validConnection(next.source, next.target, edge.id)<br>call → [H-0e5fa6d384b0](ui__study-canvas.md#h-0e5fa6d384b0) |
| 1007행 | falsy: !projection.cards.length ∧ truthy: !edge.id.startsWith('auto:') &&<br>                validConnection(next.source, next.target, edge.id) | save({ ...current.current, links: current.current.links.map((link) => link.id === edge.id ? { ...link, source: next.source, target: next.target } : link, ), })<br>call → [H-1cc2cec97a79](ui__study-canvas.md#h-1cc2cec97a79) |
| 1009행 | falsy: !projection.cards.length ∧ truthy: !edge.id.startsWith('auto:') &&<br>                validConnection(next.source, next.target, edge.id) | current.current.links.map((link) => link.id === edge.id ? { ...link, source: next.source, target: next.target } : link)<br>call<br>전달 콜백: H-30401c63e9c4 |

## H-30401c63e9c4

**@callback:current.current.links.map** · [src/ui/study-canvas.tsx:1009](../../../src/ui/study-canvas.tsx#L1009)

분기 조건과 가능한 갈림길:

- B-022f43a373f6 · ConditionalExpression · link.id === edge.id → truthy / falsy; 바깥 조건: falsy: !projection.cards.length ∧ truthy: !edge.id.startsWith('auto:') &&
                validConnection(next.source, next.target, edge.id) (1010행).

## H-ee6d8147ad2f

**@onChange** · [src/ui/study-canvas.tsx:1055](../../../src/ui/study-canvas.tsx#L1055)

분기 조건과 가능한 갈림길:

- B-d0c0aab09b72 · ConditionalExpression · event.target.value → truthy / falsy; 바깥 조건: 별도 조건식 없음 (1056행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1056행 | 별도 조건식 없음 | selectCards(event.target.value ? [event.target.value] : [])<br>call → [H-55d01c70eb1b](ui__study-canvas.md#h-55d01c70eb1b) |
| 1057행 | 별도 조건식 없음 | setSelectedEdge(null)<br>state-update |

## H-7a75bae03c3d

**@callback:projection.cards.map** · [src/ui/study-canvas.tsx:1061](../../../src/ui/study-canvas.tsx#L1061)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-fd9b30aac92a

**@onClick** · [src/ui/study-canvas.tsx:1068](../../../src/ui/study-canvas.tsx#L1068)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1069행 | 별도 조건식 없음 | selectCards(projection.cards.map((card) => card.id))<br>call → [H-55d01c70eb1b](ui__study-canvas.md#h-55d01c70eb1b) |
| 1069행 | 별도 조건식 없음 | projection.cards.map((card) => card.id)<br>call<br>전달 콜백: H-66da27672545 |

## H-66da27672545

**@callback:projection.cards.map** · [src/ui/study-canvas.tsx:1069](../../../src/ui/study-canvas.tsx#L1069)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4da0e6de9848

**@onClick** · [src/ui/study-canvas.tsx:1076](../../../src/ui/study-canvas.tsx#L1076)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1077행 | 별도 조건식 없음 | selectCards([])<br>call → [H-55d01c70eb1b](ui__study-canvas.md#h-55d01c70eb1b) |
| 1078행 | 별도 조건식 없음 | setSelectedEdge(null)<br>state-update |

## H-31cfd783dd47

**@onClick** · [src/ui/study-canvas.tsx:1088](../../../src/ui/study-canvas.tsx#L1088)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1088행 | truthy: selectedIds.length > 1 | arrange('x')<br>call → [H-ed39344efaa7](ui__study-canvas.md#h-ed39344efaa7) |

## H-f3b54a8e57f8

**@onClick** · [src/ui/study-canvas.tsx:1094](../../../src/ui/study-canvas.tsx#L1094)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1094행 | truthy: selectedIds.length > 1 | arrange('y')<br>call → [H-ed39344efaa7](ui__study-canvas.md#h-ed39344efaa7) |

## H-59c3703794af

**@onChange** · [src/ui/study-canvas.tsx:1108](../../../src/ui/study-canvas.tsx#L1108)

분기 조건과 가능한 갈림길:

- B-aad3675aaa5e · IfStatement · Number.isFinite(width) && width >= 240 && width <= 1000 → truthy / falsy; 바깥 조건: truthy: selectedCard (1110행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1109행 | truthy: selectedCard | Number(event.target.value)<br>call |
| 1110행 | truthy: selectedCard | Number.isFinite(width)<br>call |
| 1111행 | truthy: selectedCard ∧ truthy: Number.isFinite(width) && width >= 240 && width <= 1000 | tools.store({ ...tools.value, nodeWidths: { ...tools.value.nodeWidths, [selectedCard.id]: width }, })<br>call |

## H-59aedee87cf0

**@onClick** · [src/ui/study-canvas.tsx:1118](../../../src/ui/study-canvas.tsx#L1118)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1119행 | truthy: selectedCard | setEditorId(selectedCard.id)<br>state-update |
| 1120행 | truthy: selectedCard | setFocusConcept(selectedCard.id)<br>state-update |

## H-4ab6005d1736

**@callback:[
              ['←', -40, 0, '왼쪽으로'],
              ['↑', 0, -40, '위로'],
              ['↓', 0, 40, '아래로'],
              ['→', 40, 0, '오른쪽으로'],
            ].map** · [src/ui/study-canvas.tsx:1137](../../../src/ui/study-canvas.tsx#L1137)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-43be7bbea13d

**@onClick** · [src/ui/study-canvas.tsx:1142](../../../src/ui/study-canvas.tsx#L1142)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1142행 | truthy: selectedCard | move(Number(x), Number(y))<br>call → [H-d5e374a87195](ui__study-canvas.md#h-d5e374a87195) |
| 1142행 | truthy: selectedCard | Number(x)<br>call |
| 1142행 | truthy: selectedCard | Number(y)<br>call |

## H-1cb35a0eed7f

**@callback:projection.cards.some** · [src/ui/study-canvas.tsx:1150](../../../src/ui/study-canvas.tsx#L1150)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-bca7541111a8

**@callback:projection.cards.filter** · [src/ui/study-canvas.tsx:1153](../../../src/ui/study-canvas.tsx#L1153)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-46ca96e208cb

**@callback:projection.cards
            .filter** · [src/ui/study-canvas.tsx:1156](../../../src/ui/study-canvas.tsx#L1156)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4b0917eee9a6

**@callback:projection.cards
            .filter((card) => card.kind === 'concept')
            .map** · [src/ui/study-canvas.tsx:1157](../../../src/ui/study-canvas.tsx#L1157)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-2fb43e861530

**@onClick** · [src/ui/study-canvas.tsx:1161](../../../src/ui/study-canvas.tsx#L1161)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1162행 | truthy: projection.cards.some((card) => card.kind === 'concept') | setSelectedId(card.id)<br>state-update |
| 1163행 | truthy: projection.cards.some((card) => card.kind === 'concept') | setEditorId(card.id)<br>state-update |
| 1164행 | truthy: projection.cards.some((card) => card.kind === 'concept') | setSelectedEdge(null)<br>state-update |
| 1165행 | truthy: projection.cards.some((card) => card.kind === 'concept') | setFocusConcept(card.id)<br>state-update |

## H-ff46d74c863e

**@callback:projection.links.some** · [src/ui/study-canvas.tsx:1174](../../../src/ui/study-canvas.tsx#L1174)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1174행 | 별도 조건식 없음 | link.id.startsWith('auto:')<br>call |

## H-2753dc09870a

**@callback:projection.links
            .filter** · [src/ui/study-canvas.tsx:1178](../../../src/ui/study-canvas.tsx#L1178)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1178행 | truthy: projection.links.some((link) => !link.id.startsWith('auto:')) | link.id.startsWith('auto:')<br>call |

## H-793b10a7c92c

**@callback:projection.links
            .filter((link) => !link.id.startsWith('auto:'))
            .map** · [src/ui/study-canvas.tsx:1179](../../../src/ui/study-canvas.tsx#L1179)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1187행 | truthy: projection.links.some((link) => !link.id.startsWith('auto:')) | cardName(link.source)<br>call → [H-23fdac5af5e1](ui__study-canvas.md#h-23fdac5af5e1) |
| 1187행 | truthy: projection.links.some((link) => !link.id.startsWith('auto:')) | cardName(link.target)<br>call → [H-23fdac5af5e1](ui__study-canvas.md#h-23fdac5af5e1) |
| 1189행 | truthy: projection.links.some((link) => !link.id.startsWith('auto:')) | cardName(link.source)<br>call → [H-23fdac5af5e1](ui__study-canvas.md#h-23fdac5af5e1) |
| 1189행 | truthy: projection.links.some((link) => !link.id.startsWith('auto:')) | cardName(link.target)<br>call → [H-23fdac5af5e1](ui__study-canvas.md#h-23fdac5af5e1) |

## H-1a29b06d0982

**@onClick** · [src/ui/study-canvas.tsx:1183](../../../src/ui/study-canvas.tsx#L1183)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 1184행 | truthy: projection.links.some((link) => !link.id.startsWith('auto:')) | setSelectedEdge(link.id)<br>state-update |
| 1185행 | truthy: projection.links.some((link) => !link.id.startsWith('auto:')) | setSelectedId(null)<br>state-update |

