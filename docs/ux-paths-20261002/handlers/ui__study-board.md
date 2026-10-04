# src/ui/study-board.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-e7cfeb092d8e

**errorText** · [src/ui/study-board.tsx:21](../../../src/ui/study-board.tsx#L21)

분기 조건과 가능한 갈림길:

- B-5326344b6c97 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: 별도 조건식 없음 (22행).

## H-09dfb8f8c913

**StudyBoard** · [src/ui/study-board.tsx:23](../../../src/ui/study-board.tsx#L23)

분기 조건과 가능한 갈림길:

- B-d2f8ee416438 · ConditionalExpression · archived → truthy / falsy; 바깥 조건: 별도 조건식 없음 (235행).
- B-6385ebe7e8ef · ConditionalExpression · archived → truthy / falsy; 바깥 조건: 별도 조건식 없음 (291행).
- B-07ce1e11ebe8 · ConditionalExpression · editor && content.cards.some((c) => c.id === editor.id) → truthy / falsy; 바깥 조건: truthy: Boolean(editor) (468행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 35행 | 별도 조건식 없음 | useState(() => { const fallback = saved ? boardContent(saved) : freshBoard(); try { const draft = readBoardDraft(data), same = draft && JSON.stringify(draft.content) === JSON.stringify(fallback); const conflict = draft && draft.baseVersion !== (saved?.version ?? 0) && !same; return { content: conflict ? fallback : (draft?.content ?? fallback), editor: conflict ? null : (draft?.editor ?? null), version: same ? (saved?.version ?? 0) : (draft?.baseVersion ?? saved?.version ?? 0), operation: same ? undefined : draft?.operation, blocked: Boolean(conflict), error: conflict ? '저장된 보드와 초안의 수정 순서가 다릅니다. 두 내용을 보존했습니다. 초안을 사본으로 보관한 뒤 다시 열어 주세요.' : '', }; } catch (e) { return { content: fallback, editor: null, v … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-f80aafc71009 |
| 62행 | 별도 조건식 없음 | useState(boot.content)<br>call |
| 63행 | 별도 조건식 없음 | useState(boot.editor)<br>call |
| 64행 | 별도 조건식 없음 | useState(boot.error)<br>call |
| 65행 | 별도 조건식 없음 | useState(boot.blocked)<br>call |
| 66행 | 별도 조건식 없음 | useRef(boot.version)<br>call |
| 67행 | 별도 조건식 없음 | useRef(boot.operation)<br>call |
| 68행 | 별도 조건식 없음 | useRef(content)<br>call |
| 69행 | 별도 조건식 없음 | useRef(editor)<br>call |
| 72행 | 별도 조건식 없음 | useState(Boolean(boot.operation))<br>call |
| 72행 | 별도 조건식 없음 | Boolean(boot.operation)<br>call |
| 73행 | 별도 조건식 없음 | useState(false)<br>call |
| 74행 | 별도 조건식 없음 | useState(false)<br>call |
| 75행 | 별도 조건식 없음 | useState('')<br>call |
| 76행 | 별도 조건식 없음 | useState({})<br>call |
| 77행 | 별도 조건식 없음 | useState(repository.getStatus?.())<br>call |
| 78행 | 별도 조건식 없음 | useEffect(() => repository.subscribe?.(() => setSaveStatus(repository.getStatus?.())), [repository])<br>call<br>전달 콜백: H-0deae9a557bc |
| 79행 | 별도 조건식 없음 | useState(null)<br>call |
| 80행 | 별도 조건식 없음 | useRef(new Map<string, HTMLElement>())<br>call |
| 81행 | 별도 조건식 없음 | useRef(null)<br>call |
| 82행 | 별도 조건식 없음 | useState(null)<br>call |
| 87행 | 별도 조건식 없음 | data.nodes.filter((n) => !n.deletedAt && n.role === 'topic' && subjectIds.includes(n.subjectId))<br>call<br>전달 콜백: H-66f039338301 |
| 145행 | 별도 조건식 없음 | useEffect(() => { if (saved && saved.version !== version.current && !pending && !editorRef.current) { version.current = saved.version; setContent(boardContent(saved)); current.current = boardContent(saved); } }, [saved, pending])<br>call<br>전달 콜백: H-0d496b37dec9 |
| 163행 | 별도 조건식 없음 | [...data.revisions]<br>    .reverse()<br>    .find((r) => r.collection === 'studyBoards' && r.entityId === BOARD_ID && r.after.version === version.current && r.before)<br>call<br>전달 콜백: H-9b0fca093c1b |
| 163행 | 별도 조건식 없음 | [...data.revisions]<br>    .reverse()<br>call |
| 195행 | 별도 조건식 없음 | content.cards.filter((c) => c.archived === archived && `${c.title} ${c.body}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))<br>call<br>전달 콜백: H-7c9e089b272c |
| 226행 | falsy: disabled | Boolean(editor)<br>call |
| 231행 | falsy: disabled \|\| !revision | Boolean(editor)<br>call |
| 237행 | falsy: archived | content.cards.filter((c) => c.archived)<br>call<br>전달 콜백: H-17ee5f22ff6b |
| 241행 | 별도 조건식 없음 | content.columns.map((col) => <option key={col.id} value={col.id}>{col.title}</option>)<br>call<br>전달 콜백: H-fd5991dcd0d6 |
| 292행 | 별도 조건식 없음 | content.columns.map((col) => { const list = cards.filter((c) => c.columnId === col.id); return ( <section key={col.id} ref={(element) => { if (element) columnElements.current.set(col.id, element); else columnElements.current.delete(col.id); }} className={`board-column${dropColumn === col.id ? ' is-drop-target' : ''}`} aria-label={`${col.title} 열`} onDragOver={(e) => { if (dragId.current && !disabled) { e.preventDefault(); setDropColumn(col.id); } }} onDrop={(e) => drop(e, col.id)} > <header> <h3 title={col.title}> {col.title} <span>{list.length}</span> </h3> <Button variant="quiet" aria-label={`${col.title} 열 이름 바꾸기`} disabled={disabled \|\| Boolean(editor)} onClick={() => setColumnEdit(col)} > ··· </Button> </he … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-66226272c72e |
| 467행 | truthy: Boolean(editor) | Boolean(editor)<br>call |
| 468행 | truthy: Boolean(editor) ∧ truthy: editor | content.cards.some((c) => c.id === editor.id)<br>call<br>전달 콜백: H-bd57518c675c |
| 504행 | truthy: Boolean(editor) ∧ truthy: editor ∧ truthy: editor.topicId | topics.some((n) => n.id === editor.topicId)<br>call<br>전달 콜백: H-a887a3807c49 |
| 506행 | truthy: Boolean(editor) ∧ truthy: editor ∧ truthy: editor.topicId && !topics.some((n) => n.id === editor.topicId) | data.nodes.find((n) => n.id === editor.topicId)<br>call<br>전달 콜백: H-27e3d4cc177d |
| 510행 | truthy: Boolean(editor) ∧ truthy: editor | topics.map((n) => ( <option value={n.id} key={n.id}> {data.subjects.find((s) => s.id === n.subjectId)?.name} / {n.name} </option> ))<br>call<br>전달 콜백: H-9ef42bfabe1e |
| 522행 | truthy: Boolean(editor) ∧ truthy: editor | content.columns.map((c) => ( <option value={c.id} key={c.id}> {c.title} </option> ))<br>call<br>전달 콜백: H-fa2e28a37c2d |
| 531행 | truthy: Boolean(editor) ∧ truthy: editor ∧ falsy: disabled \|\| composing | editor.title.trim()<br>call |
| 554행 | truthy: Boolean(columnEdit) | Boolean(columnEdit)<br>call |
| 575행 | truthy: Boolean(columnEdit) ∧ truthy: columnEdit ∧ falsy: disabled \|\| composing | columnEdit.title.trim()<br>call |
| 588행 | truthy: Boolean(columnEdit) ∧ truthy: columnEdit | content.columns.some((c) => c.id === columnEdit.id)<br>call<br>전달 콜백: H-ff9140544537 |
| 594행 | truthy: Boolean(columnEdit) ∧ truthy: columnEdit ∧ truthy: content.columns.some((c) => c.id === columnEdit.id) ∧ falsy: disabled \|\|<br>                  composing \|\|<br>                  content.columns.length <= 1 | content.cards.some((c) => c.columnId === columnEdit.id)<br>call<br>전달 콜백: H-b2c868b67d9f |

반환/조기 중단: 215행 <render> [별도 조건식 없음]

## H-f80aafc71009

**@callback:useState** · [src/ui/study-board.tsx:35](../../../src/ui/study-board.tsx#L35)

분기 조건과 가능한 갈림길:

- B-84b235634aeb · ConditionalExpression · saved → truthy / falsy; 바깥 조건: 별도 조건식 없음 (36행).
- B-d581bd0717c2 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (37행).
- B-0991aa34c8f4 · ConditionalExpression · conflict → truthy / falsy; 바깥 조건: 별도 조건식 없음 (42행).
- B-d78d7214357c · ConditionalExpression · conflict → truthy / falsy; 바깥 조건: 별도 조건식 없음 (43행).
- B-ec31b4a2789c · ConditionalExpression · same → truthy / falsy; 바깥 조건: 별도 조건식 없음 (44행).
- B-5988daf73cf0 · ConditionalExpression · same → truthy / falsy; 바깥 조건: 별도 조건식 없음 (45행).
- B-e8d7ca416c3e · ConditionalExpression · conflict → truthy / falsy; 바깥 조건: 별도 조건식 없음 (47행).
- B-f6bad397fea0 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (51행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 36행 | truthy: saved | boardContent(saved)<br>call |
| 36행 | falsy: saved | freshBoard()<br>call |
| 38행 | 별도 조건식 없음 | readBoardDraft(data)<br>preservation-boundary |
| 39행 | truthy: draft | JSON.stringify(draft.content)<br>call |
| 39행 | truthy: draft | JSON.stringify(fallback)<br>call |
| 46행 | 별도 조건식 없음 | Boolean(conflict)<br>call |
| 57행 | exception: e | errorText(e)<br>call → [H-e7cfeb092d8e](ui__study-board.md#h-e7cfeb092d8e) |

반환/조기 중단: 41행 { content: conflict ? fallback : (draft?.content ?? fallback), editor: conflict ? null : (draft?.editor ?? null), version: same ? (saved?.version ?? 0) : (draft?.baseVersion ?? saved?.version ?? 0), operation: same ? undefined : draft?.operation, blocked: Boolean(conflict), error: conflict ? '저장된 보드와 초안의 수정 순서가 다릅니다. 두 내용을 보존했습니다. 초안을 사본으로 보관한 뒤 다시 열어 주세요.' : '', } [별도 조건식 없음]; 52행 { content: fallback, editor: null, version: saved?.version ?? 0, blocked: true, error: errorText(e), operation: undefined, } [exception: e]

## H-0deae9a557bc

**@callback:useEffect** · [src/ui/study-board.tsx:78](../../../src/ui/study-board.tsx#L78)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-66f039338301

**@callback:data.nodes.filter** · [src/ui/study-board.tsx:88](../../../src/ui/study-board.tsx#L88)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 88행 | truthy: !n.deletedAt && n.role === 'topic' | subjectIds.includes(n.subjectId)<br>call |

## H-fa0ae3ab96eb

**draft** · [src/ui/study-board.tsx:90](../../../src/ui/study-board.tsx#L90)

분기 조건과 가능한 갈림길:

- B-7ec45b175694 · ConditionalExpression · operation.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (95행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 91행 | 별도 조건식 없음 | writeBoardDraft(data, { baseVersion: version.current, content: next, editor: nextEditor, ...(operation.current ? { operation: operation.current } : {}), })<br>preservation-boundary |

## H-7003ad0dbba9

**changeEditor** · [src/ui/study-board.tsx:97](../../../src/ui/study-board.tsx#L97)

분기 조건과 가능한 갈림길:

- B-980f51687382 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (100행).
- B-422b145a9a9b · IfStatement · next || pending → truthy / falsy; 바깥 조건: 별도 조건식 없음 (101행).
- B-d6bde365cc1f · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (104행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 98행 | 별도 조건식 없음 | setEditor(next)<br>state-update |
| 101행 | truthy: next \|\| pending | draft(current.current, next)<br>preservation-boundary → [H-fa0ae3ab96eb](ui__study-board.md#h-fa0ae3ab96eb) |
| 102행 | falsy: next \|\| pending | clearBoardDraft(data)<br>preservation-boundary |
| 103행 | 별도 조건식 없음 | setError('')<br>state-update |
| 105행 | exception: e | setError(errorText(e))<br>state-update |
| 105행 | exception: e | errorText(e)<br>call → [H-e7cfeb092d8e](ui__study-board.md#h-e7cfeb092d8e) |

## H-9cc01a6fba89

**save** · [src/ui/study-board.tsx:108](../../../src/ui/study-board.tsx#L108)

분기 조건과 가능한 갈림길:

- B-e9248c3615aa · IfStatement · blocked || !ready → truthy / falsy; 바깥 조건: 별도 조건식 없음 (109행).
- B-1dc60e224a40 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (123행).
- B-08e3a9cad614 · IfStatement · !stored → truthy / falsy; 바깥 조건: 별도 조건식 없음 (127행).
- B-99fff395f6ff · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (133행).
- B-c29685de0e76 · IfStatement · editorRef.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (134행).
- B-17d0b8d2ca48 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (136행).
- B-ad487e18e914 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (140행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 110행 | 별도 조건식 없음 | setContent(next)<br>state-update |
| 119행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 120행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 122행 | 별도 조건식 없음 | setPending(true)<br>state-update |
| 124행 | 별도 조건식 없음 | draft(next)<br>preservation-boundary → [H-fa0ae3ab96eb](ui__study-board.md#h-fa0ae3ab96eb) |
| 125행 | 별도 조건식 없음 | repository.execute(operation.current)<br>call |
| 127행 | truthy: !stored | Error('저장된 보드를 확인하지 못했습니다. 초안은 유지했습니다.')<br>call |
| 130행 | 별도 조건식 없음 | setPending(false)<br>state-update |
| 131행 | 별도 조건식 없음 | onSaved(result)<br>call |
| 132행 | 별도 조건식 없음 | setError('')<br>state-update |
| 134행 | truthy: editorRef.current | draft(next)<br>preservation-boundary → [H-fa0ae3ab96eb](ui__study-board.md#h-fa0ae3ab96eb) |
| 135행 | falsy: editorRef.current | clearBoardDraft(data)<br>preservation-boundary |
| 137행 | exception: e | setError(`보드는 이 기기에 저장했습니다. 초안 정리를 다시 시도해 주세요. ${errorText(e)}`)<br>state-update |
| 137행 | exception: e | errorText(e)<br>call → [H-e7cfeb092d8e](ui__study-board.md#h-e7cfeb092d8e) |
| 141행 | exception: e | setError(`${errorText(e)} 카드와 글을 유지했습니다. 저장 다시 시도를 눌러 주세요.`)<br>state-update |
| 141행 | exception: e | errorText(e)<br>call → [H-e7cfeb092d8e](ui__study-board.md#h-e7cfeb092d8e) |

반환/조기 중단: 109행 false [truthy: blocked || !ready]; 139행 true [별도 조건식 없음]; 142행 false [exception: e]

throw: 127행 Error('저장된 보드를 확인하지 못했습니다. 초안은 유지했습니다.')

## H-0d496b37dec9

**@callback:useEffect** · [src/ui/study-board.tsx:145](../../../src/ui/study-board.tsx#L145)

분기 조건과 가능한 갈림길:

- B-cbbd9abb5f00 · IfStatement · saved && saved.version !== version.current && !pending && !editorRef.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (146행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 148행 | truthy: saved && saved.version !== version.current && !pending && !editorRef.current | setContent(boardContent(saved))<br>state-update |
| 148행 | truthy: saved && saved.version !== version.current && !pending && !editorRef.current | boardContent(saved)<br>call |
| 149행 | truthy: saved && saved.version !== version.current && !pending && !editorRef.current | boardContent(saved)<br>call |

## H-3d7386c3a1dd

**move** · [src/ui/study-board.tsx:152](../../../src/ui/study-board.tsx#L152)

분기 조건과 가능한 갈림길:

- B-6a45c2cc1538 · IfStatement · !disabled → truthy / falsy; 바깥 조건: 별도 조건식 없음 (153행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 153행 | truthy: !disabled | save(moveBoardCard(current.current, cardId, colId, beforeId))<br>call → [H-9cc01a6fba89](ui__study-board.md#h-9cc01a6fba89) |
| 153행 | truthy: !disabled | moveBoardCard(current.current, cardId, colId, beforeId)<br>call |

## H-06846117dc78

**drop** · [src/ui/study-board.tsx:155](../../../src/ui/study-board.tsx#L155)

분기 조건과 가능한 갈림길:

- B-bfd70a76f2a7 · IfStatement · id && content.cards.some((c) => c.id === id) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (159행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 156행 | 별도 조건식 없음 | e.preventDefault()<br>input-control |
| 157행 | 별도 조건식 없음 | e.stopPropagation()<br>input-control |
| 159행 | truthy: id | content.cards.some((c) => c.id === id)<br>call<br>전달 콜백: H-1523e10d4289 |
| 159행 | truthy: id && content.cards.some((c) => c.id === id) | move(id, columnId, beforeId)<br>call → [H-3d7386c3a1dd](ui__study-board.md#h-3d7386c3a1dd) |
| 161행 | 별도 조건식 없음 | setDropColumn(null)<br>state-update |

## H-1523e10d4289

**@callback:content.cards.some** · [src/ui/study-board.tsx:159](../../../src/ui/study-board.tsx#L159)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-9b0fca093c1b

**@callback:[...data.revisions]
    .reverse()
    .find** · [src/ui/study-board.tsx:166](../../../src/ui/study-board.tsx#L166)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c931bbea8d2c

**undo** · [src/ui/study-board.tsx:172](../../../src/ui/study-board.tsx#L172)

분기 조건과 가능한 갈림길:

- B-d7b3bc15b7ef · IfStatement · !revision || disabled → truthy / falsy; 바깥 조건: 별도 조건식 없음 (173행).
- B-9d9f5c270d2e · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (174행).
- B-02c6d4f91b3d · IfStatement · !row → truthy / falsy; 바깥 조건: 별도 조건식 없음 (185행).
- B-ef1b3fa2d518 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (191행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 175행 | 별도 조건식 없음 | repository.execute({ type: 'undoRevision', revisionId: revision.id, expectedVersion: version.current, userId: data.userId, namespace: data.namespace, opId: crypto.randomUUID(), at: new Date().toISOString(), })<br>call |
| 181행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 182행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 185행 | truthy: !row | Error('되돌린 보드를 확인하지 못했습니다.')<br>call |
| 187행 | 별도 조건식 없음 | setContent(boardContent(row))<br>state-update |
| 187행 | 별도 조건식 없음 | boardContent(row)<br>call |
| 188행 | 별도 조건식 없음 | boardContent(row)<br>call |
| 189행 | 별도 조건식 없음 | onSaved(result)<br>call |
| 190행 | 별도 조건식 없음 | setError('')<br>state-update |
| 192행 | exception: e | setError(errorText(e))<br>state-update |
| 192행 | exception: e | errorText(e)<br>call → [H-e7cfeb092d8e](ui__study-board.md#h-e7cfeb092d8e) |

반환/조기 중단: 173행 <render> [truthy: !revision || disabled]

throw: 185행 Error('되돌린 보드를 확인하지 못했습니다.')

## H-7c9e089b272c

**@callback:content.cards.filter** · [src/ui/study-board.tsx:196](../../../src/ui/study-board.tsx#L196)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 198행 | truthy: c.archived === archived | `${c.title} ${c.body}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())<br>call |
| 198행 | truthy: c.archived === archived | `${c.title} ${c.body}`.toLocaleLowerCase()<br>call |
| 198행 | truthy: c.archived === archived | query.trim().toLocaleLowerCase()<br>call |
| 198행 | truthy: c.archived === archived | query.trim()<br>call |

## H-f29ae73735ab

**completeEditor** · [src/ui/study-board.tsx:200](../../../src/ui/study-board.tsx#L200)

분기 조건과 가능한 갈림길:

- B-ea11dd9fbdf5 · IfStatement · !editor || composing || disabled → truthy / falsy; 바깥 조건: 별도 조건식 없음 (201행).
- B-862f5515bbc7 · IfStatement · !editor.title.trim() → truthy / falsy; 바깥 조건: 별도 조건식 없음 (202행).
- B-4ef4f9f35ad1 · ConditionalExpression · content.cards.some((c) => c.id === editor.id) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (208행).
- B-91f92fc2e0d3 · IfStatement · save(next) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (213행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 202행 | 별도 조건식 없음 | editor.title.trim()<br>call |
| 203행 | truthy: !editor.title.trim() | setError('카드에 할 일을 적어 주세요.')<br>state-update |
| 208행 | 별도 조건식 없음 | content.cards.some((c) => c.id === editor.id)<br>call<br>전달 콜백: H-6dc19b27d6b6 |
| 209행 | truthy: content.cards.some((c) => c.id === editor.id) | content.cards.map((c) => (c.id === editor.id ? editor : c))<br>call<br>전달 콜백: H-643c4e109654 |
| 213행 | 별도 조건식 없음 | save(next)<br>call → [H-9cc01a6fba89](ui__study-board.md#h-9cc01a6fba89) |
| 213행 | truthy: save(next) | changeEditor(null)<br>call → [H-7003ad0dbba9](ui__study-board.md#h-7003ad0dbba9) |

반환/조기 중단: 201행 <render> [truthy: !editor || composing || disabled]; 204행 <render> [truthy: !editor.title.trim()]

## H-6dc19b27d6b6

**@callback:content.cards.some** · [src/ui/study-board.tsx:208](../../../src/ui/study-board.tsx#L208)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-643c4e109654

**@callback:content.cards.map** · [src/ui/study-board.tsx:209](../../../src/ui/study-board.tsx#L209)

분기 조건과 가능한 갈림길:

- B-e8d7b6ce064d · ConditionalExpression · c.id === editor.id → truthy / falsy; 바깥 조건: truthy: content.cards.some((c) => c.id === editor.id) (209행).

## H-83975c10416e

**@onChange** · [src/ui/study-board.tsx:223](../../../src/ui/study-board.tsx#L223)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 223행 | 별도 조건식 없음 | setQuery(e.target.value)<br>state-update |
| 223행 | 별도 조건식 없음 | setVisibleCounts({})<br>state-update |

## H-7f58d65cca45

**@onClick** · [src/ui/study-board.tsx:227](../../../src/ui/study-board.tsx#L227)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 227행 | 별도 조건식 없음 | setColumnEdit({ id: crypto.randomUUID(), title: '' })<br>state-update |
| 227행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |

## H-a5bbeadf745a

**@onClick** · [src/ui/study-board.tsx:234](../../../src/ui/study-board.tsx#L234)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 234행 | 별도 조건식 없음 | setArchived(!archived)<br>state-update |
| 234행 | 별도 조건식 없음 | setVisibleCounts({})<br>state-update |

## H-17ee5f22ff6b

**@callback:content.cards.filter** · [src/ui/study-board.tsx:237](../../../src/ui/study-board.tsx#L237)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-62d72ba89c23

**@onChange** · [src/ui/study-board.tsx:239](../../../src/ui/study-board.tsx#L239)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 239행 | 별도 조건식 없음 | columnElements.current.get(e.target.value)<br>call |

## H-fd5991dcd0d6

**@callback:content.columns.map** · [src/ui/study-board.tsx:241](../../../src/ui/study-board.tsx#L241)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3d276908280e

**@onClick** · [src/ui/study-board.tsx:247](../../../src/ui/study-board.tsx#L247)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f2d3bd936c33

**@onClick** · [src/ui/study-board.tsx:254](../../../src/ui/study-board.tsx#L254)

분기 조건과 가능한 갈림길:

- B-363cc7daa5d3 · IfStatement · save(current.current) && editorRef.current && current.current.cards.some( (c) => JSON.stringify(c) === JSON.stringify(editorRef.current), ) → truthy / falsy; 바깥 조건: truthy: error ∧ truthy: pending (255행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 256행 | truthy: error ∧ truthy: pending | save(current.current)<br>call → [H-9cc01a6fba89](ui__study-board.md#h-9cc01a6fba89) |
| 258행 | truthy: error ∧ truthy: pending ∧ truthy: save(current.current) &&<br>                  editorRef.current | current.current.cards.some((c) => JSON.stringify(c) === JSON.stringify(editorRef.current))<br>call<br>전달 콜백: H-c807f9ab6493 |
| 262행 | truthy: error ∧ truthy: pending ∧ truthy: save(current.current) &&<br>                  editorRef.current &&<br>                  current.current.cards.some(<br>                    (c) => JSON.stringify(c) === JSON.stringify(editorRef.current),<br>                  ) | changeEditor(null)<br>call → [H-7003ad0dbba9](ui__study-board.md#h-7003ad0dbba9) |

## H-c807f9ab6493

**@callback:current.current.cards.some** · [src/ui/study-board.tsx:259](../../../src/ui/study-board.tsx#L259)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 259행 | truthy: error ∧ truthy: pending ∧ truthy: save(current.current) &&<br>                  editorRef.current | JSON.stringify(c)<br>call |
| 259행 | truthy: error ∧ truthy: pending ∧ truthy: save(current.current) &&<br>                  editorRef.current | JSON.stringify(editorRef.current)<br>call |

## H-ea911fedee62

**@onClick** · [src/ui/study-board.tsx:270](../../../src/ui/study-board.tsx#L270)

분기 조건과 가능한 갈림길:

- B-cbccd1312468 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: error ∧ truthy: blocked (271행).
- B-7e5d01626690 · CatchClause · e → exception; 바깥 조건: truthy: error ∧ truthy: blocked (276행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 272행 | truthy: error ∧ truthy: blocked | archiveDamagedDraft(boardDraftKey(data), '칸반보드 초안의 원문과 수정 충돌 보관')<br>preservation-boundary |
| 272행 | truthy: error ∧ truthy: blocked | boardDraftKey(data)<br>preservation-boundary |
| 273행 | truthy: error ∧ truthy: blocked | clearBoardDraft(data)<br>preservation-boundary |
| 274행 | truthy: error ∧ truthy: blocked | setBlocked(false)<br>state-update |
| 275행 | truthy: error ∧ truthy: blocked | setError('')<br>state-update |
| 277행 | truthy: error ∧ truthy: blocked ∧ exception: e | setError(errorText(e))<br>state-update |
| 277행 | truthy: error ∧ truthy: blocked ∧ exception: e | errorText(e)<br>call → [H-e7cfeb092d8e](ui__study-board.md#h-e7cfeb092d8e) |

## H-66226272c72e

**@callback:content.columns.map** · [src/ui/study-board.tsx:292](../../../src/ui/study-board.tsx#L292)

분기 조건과 가능한 갈림길:

- B-cc0e75350652 · ConditionalExpression · dropColumn === col.id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (298행).
- B-7dec42cf40c0 · ConditionalExpression · query → truthy / falsy; 바깥 조건: truthy: !list.length (432행).
- B-ce34cca0a659 · ConditionalExpression · archived → truthy / falsy; 바깥 조건: truthy: !list.length ∧ falsy: query (434행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 293행 | 별도 조건식 없음 | cards.filter((c) => c.columnId === col.id)<br>call<br>전달 콜백: H-9b6f28742b5d |
| 315행 | falsy: disabled | Boolean(editor)<br>call |
| 323행 | 별도 조건식 없음 | list.slice(0, visibleCounts[col.id] ?? 40).map((card, index) => { const topic = data.nodes.find((n) => n.id === card.topicId), topicActive = topic && !topic.deletedAt && !data.subjects.find((s) => s.id === topic.subjectId)?.deletedAt; return ( <article key={card.id} className="board-card" aria-label={`카드 ${card.title}`} onDragOver={(e) => { if (dragId.current && !disabled) e.preventDefault(); }} onDrop={(e) => drop(e, col.id, card.id)} > <div className="board-card-heading"> <button type="button" className="board-drag" aria-label={`${card.title} 끌어 옮기기`} draggable={!disabled && !archived} disabled={disabled \|\| archived} onDragStart={(e) => { dragId.current = card.id; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plai … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-48fae5305f22 |
| 323행 | 별도 조건식 없음 | list.slice(0, visibleCounts[col.id] ?? 40)<br>call |

반환/조기 중단: 294행 <render> [별도 조건식 없음]

## H-9b6f28742b5d

**@callback:cards.filter** · [src/ui/study-board.tsx:293](../../../src/ui/study-board.tsx#L293)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4f1f32a14ad5

**@onDragOver** · [src/ui/study-board.tsx:300](../../../src/ui/study-board.tsx#L300)

분기 조건과 가능한 갈림길:

- B-7ce041d882b9 · IfStatement · dragId.current && !disabled → truthy / falsy; 바깥 조건: 별도 조건식 없음 (301행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 302행 | truthy: dragId.current && !disabled | e.preventDefault()<br>input-control |
| 303행 | truthy: dragId.current && !disabled | setDropColumn(col.id)<br>state-update |

## H-640e771ff8e4

**@onDrop** · [src/ui/study-board.tsx:306](../../../src/ui/study-board.tsx#L306)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 306행 | 별도 조건식 없음 | drop(e, col.id)<br>call → [H-06846117dc78](ui__study-board.md#h-06846117dc78) |

## H-03426b8a66ad

**@onClick** · [src/ui/study-board.tsx:316](../../../src/ui/study-board.tsx#L316)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 316행 | 별도 조건식 없음 | setColumnEdit(col)<br>state-update |

## H-48fae5305f22

**@callback:list.slice(0, visibleCounts[col.id] ?? 40).map** · [src/ui/study-board.tsx:323](../../../src/ui/study-board.tsx#L323)

분기 조건과 가능한 갈림길:

- B-b39d9e73152f · ConditionalExpression · topicActive → truthy / falsy; 바깥 조건: truthy: topic (369행).
- B-07193c10bf66 · ConditionalExpression · archived → truthy / falsy; 바깥 조건: 별도 조건식 없음 (420행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 324행 | 별도 조건식 없음 | data.nodes.find((n) => n.id === card.topicId)<br>call<br>전달 콜백: H-d6dc62adf5c6 |
| 328행 | truthy: topic &&<br>                      !topic.deletedAt | data.subjects.find((s) => s.id === topic.subjectId)<br>call<br>전달 콜백: H-5d1106b6eac0 |
| 370행 | truthy: topic ∧ truthy: topicActive | encodeURIComponent(topic.id)<br>call |
| 382행 | 별도 조건식 없음 | content.columns.map((c) => ( <option key={c.id} value={c.id}> {c.title} </option> ))<br>call<br>전달 콜백: H-c744e61bab8e |
| 391행 | falsy: disabled \|\| index === 0 | Boolean(query)<br>call |
| 398행 | falsy: disabled \|\| index === list.length - 1 | Boolean(query)<br>call |

반환/조기 중단: 329행 <render> [별도 조건식 없음]

## H-d6dc62adf5c6

**@callback:data.nodes.find** · [src/ui/study-board.tsx:324](../../../src/ui/study-board.tsx#L324)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-5d1106b6eac0

**@callback:data.subjects.find** · [src/ui/study-board.tsx:328](../../../src/ui/study-board.tsx#L328)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-bb97254ea013

**@onDragOver** · [src/ui/study-board.tsx:334](../../../src/ui/study-board.tsx#L334)

분기 조건과 가능한 갈림길:

- B-df5b90718a64 · IfStatement · dragId.current && !disabled → truthy / falsy; 바깥 조건: 별도 조건식 없음 (335행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 335행 | truthy: dragId.current && !disabled | e.preventDefault()<br>input-control |

## H-8de8f2161154

**@onDrop** · [src/ui/study-board.tsx:337](../../../src/ui/study-board.tsx#L337)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 337행 | 별도 조건식 없음 | drop(e, col.id, card.id)<br>call → [H-06846117dc78](ui__study-board.md#h-06846117dc78) |

## H-28d8c6b197ec

**@onDragStart** · [src/ui/study-board.tsx:346](../../../src/ui/study-board.tsx#L346)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 349행 | 별도 조건식 없음 | e.dataTransfer.setData('text/plain', card.id)<br>call |

## H-37325d483053

**@onDragEnd** · [src/ui/study-board.tsx:351](../../../src/ui/study-board.tsx#L351)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 353행 | 별도 조건식 없음 | setDropColumn(null)<br>state-update |

## H-8c11ecdf4278

**@onClick** · [src/ui/study-board.tsx:361](../../../src/ui/study-board.tsx#L361)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 361행 | 별도 조건식 없음 | changeEditor(card)<br>call → [H-7003ad0dbba9](ui__study-board.md#h-7003ad0dbba9) |

## H-f1f253fdd2b9

**@onClick** · [src/ui/study-board.tsx:367](../../../src/ui/study-board.tsx#L367)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 367행 | truthy: card.body | changeEditor(card)<br>call → [H-7003ad0dbba9](ui__study-board.md#h-7003ad0dbba9) |

## H-ecc420f99f21

**@onChange** · [src/ui/study-board.tsx:380](../../../src/ui/study-board.tsx#L380)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 380행 | 별도 조건식 없음 | move(card.id, e.target.value)<br>call → [H-3d7386c3a1dd](ui__study-board.md#h-3d7386c3a1dd) |

## H-c744e61bab8e

**@callback:content.columns.map** · [src/ui/study-board.tsx:382](../../../src/ui/study-board.tsx#L382)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-822c55efb750

**@onClick** · [src/ui/study-board.tsx:392](../../../src/ui/study-board.tsx#L392)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 392행 | 별도 조건식 없음 | move(card.id, col.id, list[index - 1]?.id)<br>call → [H-3d7386c3a1dd](ui__study-board.md#h-3d7386c3a1dd) |

## H-91044a711ff0

**@onClick** · [src/ui/study-board.tsx:399](../../../src/ui/study-board.tsx#L399)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 400행 | 별도 조건식 없음 | content.cards.filter((c) => c.columnId === col.id && c.archived === archived)<br>call<br>전달 콜백: H-c1f472fb34d1 |
| 403행 | 별도 조건식 없음 | all.findIndex((c) => c.id === card.id)<br>call<br>전달 콜백: H-f2a6434b3bb8 |
| 404행 | 별도 조건식 없음 | move(card.id, col.id, following?.id)<br>call → [H-3d7386c3a1dd](ui__study-board.md#h-3d7386c3a1dd) |

## H-c1f472fb34d1

**@callback:content.cards.filter** · [src/ui/study-board.tsx:401](../../../src/ui/study-board.tsx#L401)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f2a6434b3bb8

**@callback:all.findIndex** · [src/ui/study-board.tsx:403](../../../src/ui/study-board.tsx#L403)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-fa59fbbc69d1

**@onClick** · [src/ui/study-board.tsx:411](../../../src/ui/study-board.tsx#L411)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 412행 | 별도 조건식 없음 | save({ ...content, cards: content.cards.map((c) => c.id === card.id ? { ...c, archived: !c.archived } : c, ), })<br>call → [H-9cc01a6fba89](ui__study-board.md#h-9cc01a6fba89) |
| 414행 | 별도 조건식 없음 | content.cards.map((c) => c.id === card.id ? { ...c, archived: !c.archived } : c)<br>call<br>전달 콜백: H-f2879c366aa5 |

## H-f2879c366aa5

**@callback:content.cards.map** · [src/ui/study-board.tsx:414](../../../src/ui/study-board.tsx#L414)

분기 조건과 가능한 갈림길:

- B-d822fbbc74a8 · ConditionalExpression · c.id === card.id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (415행).

## H-d39c3b83f7fb

**@onClick** · [src/ui/study-board.tsx:427](../../../src/ui/study-board.tsx#L427)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 427행 | truthy: list.length > (visibleCounts[col.id] ?? 40) | setVisibleCounts((old) => ({ ...old, [col.id]: (old[col.id] ?? 40) + 40 }))<br>state-update<br>전달 콜백: H-4e2f12a66728 |

## H-4e2f12a66728

**@callback:setVisibleCounts** · [src/ui/study-board.tsx:427](../../../src/ui/study-board.tsx#L427)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-fe086598455b

**@onClick** · [src/ui/study-board.tsx:444](../../../src/ui/study-board.tsx#L444)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 445행 | truthy: !archived | changeEditor({ id: crypto.randomUUID(), columnId: col.id, title: '', body: '', topicId: null, archived: false, })<br>call → [H-7003ad0dbba9](ui__study-board.md#h-7003ad0dbba9) |
| 446행 | truthy: !archived | crypto.randomUUID()<br>call |

## H-bd57518c675c

**@callback:content.cards.some** · [src/ui/study-board.tsx:468](../../../src/ui/study-board.tsx#L468)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-0bd2091d674d

**@onClose** · [src/ui/study-board.tsx:469](../../../src/ui/study-board.tsx#L469)

분기 조건과 가능한 갈림길:

- B-0723e8438d06 · IfStatement · !composing && !pending → truthy / falsy; 바깥 조건: truthy: Boolean(editor) (470행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 470행 | truthy: Boolean(editor) ∧ truthy: !composing && !pending | changeEditor(null)<br>call → [H-7003ad0dbba9](ui__study-board.md#h-7003ad0dbba9) |

## H-baf211a4b669

**@onCompositionStart** · [src/ui/study-board.tsx:476](../../../src/ui/study-board.tsx#L476)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 476행 | truthy: Boolean(editor) ∧ truthy: editor | setComposing(true)<br>state-update |

## H-9efa3623d961

**@onCompositionEnd** · [src/ui/study-board.tsx:477](../../../src/ui/study-board.tsx#L477)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 477행 | truthy: Boolean(editor) ∧ truthy: editor | setComposing(false)<br>state-update |

## H-41e4ae4bf7d6

**@onChange** · [src/ui/study-board.tsx:486](../../../src/ui/study-board.tsx#L486)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 486행 | truthy: Boolean(editor) ∧ truthy: editor | changeEditor({ ...editor, title: e.target.value })<br>call → [H-7003ad0dbba9](ui__study-board.md#h-7003ad0dbba9) |

## H-ad6fea28d351

**@onChange** · [src/ui/study-board.tsx:495](../../../src/ui/study-board.tsx#L495)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 495행 | truthy: Boolean(editor) ∧ truthy: editor | changeEditor({ ...editor, body: e.target.value })<br>call → [H-7003ad0dbba9](ui__study-board.md#h-7003ad0dbba9) |

## H-18239d387d79

**@onChange** · [src/ui/study-board.tsx:501](../../../src/ui/study-board.tsx#L501)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 501행 | truthy: Boolean(editor) ∧ truthy: editor | changeEditor({ ...editor, topicId: e.target.value \|\| null })<br>call → [H-7003ad0dbba9](ui__study-board.md#h-7003ad0dbba9) |

## H-a887a3807c49

**@callback:topics.some** · [src/ui/study-board.tsx:504](../../../src/ui/study-board.tsx#L504)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-27e3d4cc177d

**@callback:data.nodes.find** · [src/ui/study-board.tsx:506](../../../src/ui/study-board.tsx#L506)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-9ef42bfabe1e

**@callback:topics.map** · [src/ui/study-board.tsx:510](../../../src/ui/study-board.tsx#L510)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 512행 | truthy: Boolean(editor) ∧ truthy: editor | data.subjects.find((s) => s.id === n.subjectId)<br>call<br>전달 콜백: H-9c75b7223eec |

## H-9c75b7223eec

**@callback:data.subjects.find** · [src/ui/study-board.tsx:512](../../../src/ui/study-board.tsx#L512)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-bbf6858577ec

**@onChange** · [src/ui/study-board.tsx:520](../../../src/ui/study-board.tsx#L520)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 520행 | truthy: Boolean(editor) ∧ truthy: editor | changeEditor({ ...editor, columnId: e.target.value })<br>call → [H-7003ad0dbba9](ui__study-board.md#h-7003ad0dbba9) |

## H-fa2e28a37c2d

**@callback:content.columns.map** · [src/ui/study-board.tsx:522](../../../src/ui/study-board.tsx#L522)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c2fba184e784

**@onClick** · [src/ui/study-board.tsx:536](../../../src/ui/study-board.tsx#L536)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 536행 | truthy: Boolean(editor) ∧ truthy: editor | changeEditor(null)<br>call → [H-7003ad0dbba9](ui__study-board.md#h-7003ad0dbba9) |

## H-e6efa2641baa

**@onClick** · [src/ui/study-board.tsx:543](../../../src/ui/study-board.tsx#L543)

분기 조건과 가능한 갈림길:

- B-3cb83bdb5263 · IfStatement · save(current.current) → truthy / falsy; 바깥 조건: truthy: Boolean(editor) ∧ truthy: editor ∧ truthy: pending (544행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 544행 | truthy: Boolean(editor) ∧ truthy: editor ∧ truthy: pending | save(current.current)<br>call → [H-9cc01a6fba89](ui__study-board.md#h-9cc01a6fba89) |
| 544행 | truthy: Boolean(editor) ∧ truthy: editor ∧ truthy: pending ∧ truthy: save(current.current) | changeEditor(null)<br>call → [H-7003ad0dbba9](ui__study-board.md#h-7003ad0dbba9) |

## H-3eb69b73a553

**@onClose** · [src/ui/study-board.tsx:556](../../../src/ui/study-board.tsx#L556)

분기 조건과 가능한 갈림길:

- B-c0a989ec5fb0 · IfStatement · !composing → truthy / falsy; 바깥 조건: truthy: Boolean(columnEdit) (557행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 557행 | truthy: Boolean(columnEdit) ∧ truthy: !composing | setColumnEdit(null)<br>state-update |

## H-103f462f6e34

**@onCompositionStart** · [src/ui/study-board.tsx:563](../../../src/ui/study-board.tsx#L563)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 563행 | truthy: Boolean(columnEdit) ∧ truthy: columnEdit | setComposing(true)<br>state-update |

## H-c710bbcccf4d

**@onCompositionEnd** · [src/ui/study-board.tsx:564](../../../src/ui/study-board.tsx#L564)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 564행 | truthy: Boolean(columnEdit) ∧ truthy: columnEdit | setComposing(false)<br>state-update |

## H-c06054171632

**@onChange** · [src/ui/study-board.tsx:571](../../../src/ui/study-board.tsx#L571)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 571행 | truthy: Boolean(columnEdit) ∧ truthy: columnEdit | setColumnEdit({ ...columnEdit, title: e.target.value })<br>state-update |

## H-745f2a9f0997

**@onClick** · [src/ui/study-board.tsx:576](../../../src/ui/study-board.tsx#L576)

분기 조건과 가능한 갈림길:

- B-93a2f65b8676 · ConditionalExpression · content.columns.some((c) => c.id === columnEdit.id) → truthy / falsy; 바깥 조건: truthy: Boolean(columnEdit) ∧ truthy: columnEdit (579행).
- B-f2756a5d47a7 · IfStatement · save(next) → truthy / falsy; 바깥 조건: truthy: Boolean(columnEdit) ∧ truthy: columnEdit (583행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 579행 | truthy: Boolean(columnEdit) ∧ truthy: columnEdit | content.columns.some((c) => c.id === columnEdit.id)<br>call<br>전달 콜백: H-6c5fc3cf2694 |
| 580행 | truthy: Boolean(columnEdit) ∧ truthy: columnEdit ∧ truthy: content.columns.some((c) => c.id === columnEdit.id) | content.columns.map((c) => (c.id === columnEdit.id ? columnEdit : c))<br>call<br>전달 콜백: H-f2aa9a507103 |
| 583행 | truthy: Boolean(columnEdit) ∧ truthy: columnEdit | save(next)<br>call → [H-9cc01a6fba89](ui__study-board.md#h-9cc01a6fba89) |
| 583행 | truthy: Boolean(columnEdit) ∧ truthy: columnEdit ∧ truthy: save(next) | setColumnEdit(null)<br>state-update |

## H-6c5fc3cf2694

**@callback:content.columns.some** · [src/ui/study-board.tsx:579](../../../src/ui/study-board.tsx#L579)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f2aa9a507103

**@callback:content.columns.map** · [src/ui/study-board.tsx:580](../../../src/ui/study-board.tsx#L580)

분기 조건과 가능한 갈림길:

- B-e206427807cb · ConditionalExpression · c.id === columnEdit.id → truthy / falsy; 바깥 조건: truthy: Boolean(columnEdit) ∧ truthy: columnEdit ∧ truthy: content.columns.some((c) => c.id === columnEdit.id) (580행).

## H-ff9140544537

**@callback:content.columns.some** · [src/ui/study-board.tsx:588](../../../src/ui/study-board.tsx#L588)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b2c868b67d9f

**@callback:content.cards.some** · [src/ui/study-board.tsx:594](../../../src/ui/study-board.tsx#L594)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d6ce1d5ba13f

**@onClick** · [src/ui/study-board.tsx:596](../../../src/ui/study-board.tsx#L596)

분기 조건과 가능한 갈림길:

- B-e9f87dd58241 · IfStatement · save({ ...content, columns: content.columns.filter((c) => c.id !== columnEdit.id), }) → truthy / falsy; 바깥 조건: truthy: Boolean(columnEdit) ∧ truthy: columnEdit ∧ truthy: content.columns.some((c) => c.id === columnEdit.id) (597행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 598행 | truthy: Boolean(columnEdit) ∧ truthy: columnEdit ∧ truthy: content.columns.some((c) => c.id === columnEdit.id) | save({ ...content, columns: content.columns.filter((c) => c.id !== columnEdit.id), })<br>call → [H-9cc01a6fba89](ui__study-board.md#h-9cc01a6fba89) |
| 600행 | truthy: Boolean(columnEdit) ∧ truthy: columnEdit ∧ truthy: content.columns.some((c) => c.id === columnEdit.id) | content.columns.filter((c) => c.id !== columnEdit.id)<br>call<br>전달 콜백: H-576c02749c44 |
| 603행 | truthy: Boolean(columnEdit) ∧ truthy: columnEdit ∧ truthy: content.columns.some((c) => c.id === columnEdit.id) ∧ truthy: save({<br>                      ...content,<br>                      columns: content.columns.filter((c) => c.id !== columnEdit.id),<br>                    }) | setColumnEdit(null)<br>state-update |

## H-576c02749c44

**@callback:content.columns.filter** · [src/ui/study-board.tsx:600](../../../src/ui/study-board.tsx#L600)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

