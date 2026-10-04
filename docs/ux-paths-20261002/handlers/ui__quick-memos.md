# src/ui/quick-memos.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-3718c8c29801

**errorMessage** · [src/ui/quick-memos.tsx:20](../../../src/ui/quick-memos.tsx#L20)

분기 조건과 가능한 갈림길:

- B-a9d60e5c4c2f · ConditionalExpression · error instanceof Error && (error.name === 'QuotaExceededError' || /quota/i.test(error.message)) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (20행).
- B-720180e1531d · ConditionalExpression · error instanceof Error → truthy / falsy; 바깥 조건: falsy: error instanceof Error && (error.name === 'QuotaExceededError' || /quota/i.test(error.message)) (20행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 20행 | truthy: error instanceof Error ∧ falsy: error.name === 'QuotaExceededError' | /quota/i.test(error.message)<br>call |

## H-69b2e0053e6b

**ownerName** · [src/ui/quick-memos.tsx:21](../../../src/ui/quick-memos.tsx#L21)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 22행 | 별도 조건식 없음 | data.nodes.find(row => row.id === ownerId)<br>call<br>전달 콜백: H-51671ebe5075 |
| 22행 | nullish: data.nodes.find(row => row.id === ownerId)?.name | data.subjects.find(row => row.id === ownerId)<br>call<br>전달 콜백: H-eec35107f78e |

반환/조기 중단: 22행 data.nodes.find(row => row.id === ownerId)?.name ?? data.subjects.find(row => row.id === ownerId)?.name ?? '자유 메모' [별도 조건식 없음]

## H-51671ebe5075

**@callback:data.nodes.find** · [src/ui/quick-memos.tsx:22](../../../src/ui/quick-memos.tsx#L22)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-eec35107f78e

**@callback:data.subjects.find** · [src/ui/quick-memos.tsx:22](../../../src/ui/quick-memos.tsx#L22)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-07b9b46e41b9

**QuickMemos** · [src/ui/quick-memos.tsx:24](../../../src/ui/quick-memos.tsx#L24)

분기 조건과 가능한 갈림길:

- B-0bc69fd25b2e · ConditionalExpression · trash → truthy / falsy; 바깥 조건: 별도 조건식 없음 (27행).
- B-1ee1a4bece78 · ConditionalExpression · compact → truthy / falsy; 바깥 조건: 별도 조건식 없음 (34행).
- B-079fe45c92f9 · ConditionalExpression · trash → truthy / falsy; 바깥 조건: 별도 조건식 없음 (58행).
- B-2313ae454336 · ConditionalExpression · trash → truthy / falsy; 바깥 조건: 별도 조건식 없음 (59행).
- B-e20bc15e9cd0 · ConditionalExpression · compact → truthy / falsy; 바깥 조건: 별도 조건식 없음 (65행).
- B-f20d1b09face · ConditionalExpression · trash → truthy / falsy; 바깥 조건: truthy: !all.length && !compact (75행).
- B-af13c25f1bc0 · ConditionalExpression · trash → truthy / falsy; 바깥 조건: truthy: !all.length && !compact (75행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 25행 | 별도 조건식 없음 | useState(memoId ?? null)<br>call |
| 26행 | 별도 조건식 없음 | useState('')<br>call |
| 28행 | 별도 조건식 없음 | useViewContext(data, `${view}:query`, '', isViewText)<br>call |
| 29행 | 별도 조건식 없음 | useViewContext(data, `${view}:limit`, 40, isViewPage)<br>call |
| 30행 | 별도 조건식 없음 | useState(null)<br>call |
| 31행 | 별도 조건식 없음 | useState(null)<br>call |
| 32행 | 별도 조건식 없음 | (data.memos ?? []).filter(memo => Boolean(memo.deletedAt) === trash && (ownerId === undefined \|\| memo.ownerId === ownerId))<br>    .slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) \|\| a.id.localeCompare(b.id))<br>mutation-request<br>전달 콜백: H-c5c4c779ad7a |
| 32행 | 별도 조건식 없음 | (data.memos ?? []).filter(memo => Boolean(memo.deletedAt) === trash && (ownerId === undefined \|\| memo.ownerId === ownerId))<br>    .slice()<br>mutation-request |
| 32행 | 별도 조건식 없음 | (data.memos ?? []).filter(memo => Boolean(memo.deletedAt) === trash && (ownerId === undefined \|\| memo.ownerId === ownerId))<br>call<br>전달 콜백: H-ff12ad40a736 |
| 34행 | falsy: compact | all.filter(memo => !query.trim() \|\| `${memo.body} ${ownerName(data, memo.ownerId)}`.normalize('NFC').toLocaleLowerCase('ko-KR').includes(query.trim().normalize('NFC').toLocaleLowerCase('ko-KR')))<br>call<br>전달 콜백: H-2ea9d879c4ac |
| 35행 | 별도 조건식 없음 | (data.memos ?? []).find(memo => memo.id === editing && !memo.deletedAt)<br>call<br>전달 콜백: H-87a244eabec7 |
| 36행 | 별도 조건식 없음 | useEffect(() => { setEditing(memoId ?? null); }, [memoId])<br>call<br>전달 콜백: H-56d818731763 |
| 57행 | 별도 조건식 없음 | (data.memos ?? []).find(row => row.id === restored && row.deletedAt)<br>call<br>전달 콜백: H-c56a7e356733 |
| 65행 | 별도 조건식 없음 | (compact ? filtered.slice(0, 3) : filtered.slice(0, Math.max(40, limit))).map((memo, index) => <article className="memo-card" key={memo.id}> <button type="button" className="memo-paper-preview" aria-label={`메모 ${index + 1} 열기${memo.body ? `: ${memo.body.slice(0, 35)}` : memo.strokes.length ? ': 스케치' : ': 빈 메모'}`} onClick={event => { event.currentTarget.focus({ preventScroll: true }); setEditing(memo.id); }} disabled={trash}> <svg viewBox={`0 0 ${MEMO_WIDTH} ${MEMO_HEIGHT}`} aria-hidden="true"><InkDrawing strokes={memo.strokes} /></svg> {memo.body && <span className="memo-preview-text">{memo.body}</span>} {!memo.body && !memo.strokes.length && !memo.document && <span className="memo-placeholder">여기에 생각을 남겨 보세요.</span>} </button> <div className="memo-card-footer"><span> … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-7c662174a3f1 |
| 65행 | truthy: compact | filtered.slice(0, 3)<br>call |
| 65행 | falsy: compact | filtered.slice(0, Math.max(40, limit))<br>call |
| 65행 | falsy: compact | Math.max(40, limit)<br>call |
| 73행 | truthy: !compact | Math.max(40, limit)<br>call |
| 78행 | truthy: Boolean(trashId) | Boolean(trashId)<br>call |

반환/조기 중단: 58행 <render> [별도 조건식 없음]

## H-ff12ad40a736

**@callback:(data.memos ?? []).filter** · [src/ui/quick-memos.tsx:32](../../../src/ui/quick-memos.tsx#L32)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 32행 | 별도 조건식 없음 | Boolean(memo.deletedAt)<br>call |

## H-c5c4c779ad7a

**all** · [src/ui/quick-memos.tsx:33](../../../src/ui/quick-memos.tsx#L33)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 33행 | 별도 조건식 없음 | b.updatedAt.localeCompare(a.updatedAt)<br>call |
| 33행 | falsy: b.updatedAt.localeCompare(a.updatedAt) | a.id.localeCompare(b.id)<br>call |

## H-2ea9d879c4ac

**@callback:all.filter** · [src/ui/quick-memos.tsx:34](../../../src/ui/quick-memos.tsx#L34)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 34행 | falsy: compact | query.trim()<br>call |
| 34행 | falsy: compact ∧ falsy: !query.trim() | `${memo.body} ${ownerName(data, memo.ownerId)}`.normalize('NFC').toLocaleLowerCase('ko-KR').includes(query.trim().normalize('NFC').toLocaleLowerCase('ko-KR'))<br>call |
| 34행 | falsy: compact ∧ falsy: !query.trim() | `${memo.body} ${ownerName(data, memo.ownerId)}`.normalize('NFC').toLocaleLowerCase('ko-KR')<br>call |
| 34행 | falsy: compact ∧ falsy: !query.trim() | `${memo.body} ${ownerName(data, memo.ownerId)}`.normalize('NFC')<br>call |
| 34행 | falsy: compact ∧ falsy: !query.trim() | ownerName(data, memo.ownerId)<br>call → [H-69b2e0053e6b](ui__quick-memos.md#h-69b2e0053e6b) |
| 34행 | falsy: compact ∧ falsy: !query.trim() | query.trim().normalize('NFC').toLocaleLowerCase('ko-KR')<br>call |
| 34행 | falsy: compact ∧ falsy: !query.trim() | query.trim().normalize('NFC')<br>call |
| 34행 | falsy: compact ∧ falsy: !query.trim() | query.trim()<br>call |

## H-87a244eabec7

**selected** · [src/ui/quick-memos.tsx:35](../../../src/ui/quick-memos.tsx#L35)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-56d818731763

**@callback:useEffect** · [src/ui/quick-memos.tsx:36](../../../src/ui/quick-memos.tsx#L36)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 36행 | 별도 조건식 없음 | setEditing(memoId ?? null)<br>state-update |

## H-97d3f08e611f

**execute** · [src/ui/quick-memos.tsx:37](../../../src/ui/quick-memos.tsx#L37)

분기 조건과 가능한 갈림길:

- B-3383b5732acb · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (38행).
- B-f9956fa2f9c8 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (41행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 39행 | 별도 조건식 없음 | repository.execute({ ...action, opId: crypto.randomUUID(), at: new Date().toISOString(), userId: data.userId, namespace: data.namespace })<br>call |
| 39행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 39행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 40행 | 별도 조건식 없음 | onSaved(next)<br>call |
| 40행 | 별도 조건식 없음 | setError('')<br>state-update |
| 41행 | exception: e | setError(errorMessage(e))<br>state-update |
| 41행 | exception: e | errorMessage(e)<br>call → [H-3718c8c29801](ui__quick-memos.md#h-3718c8c29801) |

반환/조기 중단: 40행 next [별도 조건식 없음]; 41행 null [exception: e]

## H-58febee445d4

**add** · [src/ui/quick-memos.tsx:43](../../../src/ui/quick-memos.tsx#L43)

분기 조건과 가능한 갈림길:

- B-dec359e52a2a · IfStatement · execute({ type: 'saveMemo', id, ownerId: ownerId ?? null, body: '', strokes: [], expectedVersion: 0 }) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (48행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 46행 | 별도 조건식 없음 | event.currentTarget.focus({ preventScroll: true })<br>input-control |
| 47행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 48행 | 별도 조건식 없음 | execute({ type: 'saveMemo', id, ownerId: ownerId ?? null, body: '', strokes: [], expectedVersion: 0 })<br>call → [H-97d3f08e611f](ui__quick-memos.md#h-97d3f08e611f) |
| 48행 | truthy: execute({ type: 'saveMemo', id, ownerId: ownerId ?? null, body: '', strokes: [], expectedVersion: 0 }) | setEditing(id)<br>state-update |

## H-ef00d95c9060

**close** · [src/ui/quick-memos.tsx:50](../../../src/ui/quick-memos.tsx#L50)

분기 조건과 가능한 갈림길:

- B-eba566314beb · IfStatement · memoId → truthy / falsy; 바깥 조건: 별도 조건식 없음 (50행).
- B-e46463e545fc · IfStatement · onCloseDetail → truthy / falsy; 바깥 조건: truthy: memoId (50행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 50행 | 별도 조건식 없음 | setEditing(null)<br>state-update |
| 50행 | truthy: memoId ∧ truthy: onCloseDetail | onCloseDetail()<br>call |
| 50행 | truthy: memoId ∧ falsy: onCloseDetail | navigate('/memos')<br>navigation |

## H-a029e0893c94

**moveToTrash** · [src/ui/quick-memos.tsx:51](../../../src/ui/quick-memos.tsx#L51)

분기 조건과 가능한 갈림길:

- B-acd4e98fbfb3 · IfStatement · execute({ type: 'trashMemo', id: memo.id, expectedVersion: memo.version }) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (52행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 52행 | 별도 조건식 없음 | execute({ type: 'trashMemo', id: memo.id, expectedVersion: memo.version })<br>call → [H-97d3f08e611f](ui__quick-memos.md#h-97d3f08e611f) |
| 52행 | truthy: execute({ type: 'trashMemo', id: memo.id, expectedVersion: memo.version }) | setTrashId(null)<br>state-update |
| 52행 | truthy: execute({ type: 'trashMemo', id: memo.id, expectedVersion: memo.version }) | setRestored(memo.id)<br>state-update |

## H-4547f677668b

**restore** · [src/ui/quick-memos.tsx:54](../../../src/ui/quick-memos.tsx#L54)

분기 조건과 가능한 갈림길:

- B-bc898e7b4a2e · IfStatement · execute({ type: 'restoreMemo', id: memo.id, expectedVersion: memo.version }) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (55행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 55행 | 별도 조건식 없음 | execute({ type: 'restoreMemo', id: memo.id, expectedVersion: memo.version })<br>call → [H-97d3f08e611f](ui__quick-memos.md#h-97d3f08e611f) |
| 55행 | truthy: execute({ type: 'restoreMemo', id: memo.id, expectedVersion: memo.version }) | setRestored(null)<br>state-update |

## H-c56a7e356733

**undoTrash** · [src/ui/quick-memos.tsx:57](../../../src/ui/quick-memos.tsx#L57)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6ff6a05af425

**@onClick** · [src/ui/quick-memos.tsx:63](../../../src/ui/quick-memos.tsx#L63)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 63행 | truthy: undoTrash | restore(undoTrash)<br>call → [H-4547f677668b](ui__quick-memos.md#h-4547f677668b) |

## H-0dbe7f37c62f

**@onChange** · [src/ui/quick-memos.tsx:64](../../../src/ui/quick-memos.tsx#L64)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 64행 | truthy: !compact | setQuery(event.target.value)<br>state-update |
| 64행 | truthy: !compact | setLimit(40)<br>state-update |

## H-7c662174a3f1

**@callback:(compact ? filtered.slice(0, 3) : filtered.slice(0, Math.max(40, limit))).map** · [src/ui/quick-memos.tsx:65](../../../src/ui/quick-memos.tsx#L65)

분기 조건과 가능한 갈림길:

- B-8f1022580ae1 · ConditionalExpression · memo.body → truthy / falsy; 바깥 조건: 별도 조건식 없음 (66행).
- B-4cce9ccb4351 · ConditionalExpression · memo.strokes.length → truthy / falsy; 바깥 조건: falsy: memo.body (66행).
- B-561b8b01ae92 · ConditionalExpression · memo.document → truthy / falsy; 바깥 조건: 별도 조건식 없음 (71행).
- B-e12b5fa5b6c5 · ConditionalExpression · inkPageCount(memo.strokes) > 1 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (71행).
- B-f491ad8b7767 · ConditionalExpression · trash → truthy / falsy; 바깥 조건: 별도 조건식 없음 (71행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 66행 | truthy: memo.body | memo.body.slice(0, 35)<br>call |
| 71행 | 별도 조건식 없음 | ownerName(data, memo.ownerId)<br>call → [H-69b2e0053e6b](ui__quick-memos.md#h-69b2e0053e6b) |
| 71행 | 별도 조건식 없음 | inkPageCount(memo.strokes)<br>call |
| 71행 | truthy: inkPageCount(memo.strokes) > 1 | inkPageCount(memo.strokes)<br>call |

## H-2577e73af16c

**@onClick** · [src/ui/quick-memos.tsx:66](../../../src/ui/quick-memos.tsx#L66)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 66행 | 별도 조건식 없음 | event.currentTarget.focus({ preventScroll: true })<br>input-control |
| 66행 | 별도 조건식 없음 | setEditing(memo.id)<br>state-update |

## H-650048fdd75d

**@onClick** · [src/ui/quick-memos.tsx:71](../../../src/ui/quick-memos.tsx#L71)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 71행 | truthy: trash | restore(memo)<br>call → [H-4547f677668b](ui__quick-memos.md#h-4547f677668b) |

## H-1a0e54409aa5

**@onClick** · [src/ui/quick-memos.tsx:71](../../../src/ui/quick-memos.tsx#L71)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 71행 | falsy: trash | setTrashId(memo.id)<br>state-update |

## H-50963753ae2c

**@onClick** · [src/ui/quick-memos.tsx:73](../../../src/ui/quick-memos.tsx#L73)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 73행 | truthy: !compact && filtered.length > Math.max(40, limit) | setLimit(value => Math.max(40, value) + 40)<br>state-update<br>전달 콜백: H-44dcd59c675c |

## H-44dcd59c675c

**@callback:setLimit** · [src/ui/quick-memos.tsx:73](../../../src/ui/quick-memos.tsx#L73)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 73행 | truthy: !compact && filtered.length > Math.max(40, limit) | Math.max(40, value)<br>call |

## H-b87194d78641

**@onClick** · [src/ui/quick-memos.tsx:74](../../../src/ui/quick-memos.tsx#L74)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 74행 | truthy: !compact && all.length > 0 && !filtered.length | setQuery('')<br>state-update |
| 74행 | truthy: !compact && all.length > 0 && !filtered.length | setLimit(40)<br>state-update |

## H-d8aa37ce070c

**@onCopy** · [src/ui/quick-memos.tsx:76](../../../src/ui/quick-memos.tsx#L76)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 76행 | truthy: selected | setEditing(id)<br>state-update |

## H-cee228adb10c

**@onClose** · [src/ui/quick-memos.tsx:78](../../../src/ui/quick-memos.tsx#L78)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 78행 | truthy: Boolean(trashId) | setTrashId(null)<br>state-update |

## H-552f5eff7ec1

**@onClick** · [src/ui/quick-memos.tsx:78](../../../src/ui/quick-memos.tsx#L78)

분기 조건과 가능한 갈림길:

- B-92cdcca6e420 · IfStatement · memo → truthy / falsy; 바깥 조건: truthy: Boolean(trashId) (78행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 78행 | truthy: Boolean(trashId) | all.find(row => row.id === trashId)<br>call<br>전달 콜백: H-d68644f2bdd6 |
| 78행 | truthy: Boolean(trashId) ∧ truthy: memo | moveToTrash(memo)<br>call → [H-a029e0893c94](ui__quick-memos.md#h-a029e0893c94) |

## H-d68644f2bdd6

**@callback:all.find** · [src/ui/quick-memos.tsx:78](../../../src/ui/quick-memos.tsx#L78)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b316d7692c88

**MemoEditor** · [src/ui/quick-memos.tsx:82](../../../src/ui/quick-memos.tsx#L82)

분기 조건과 가능한 갈림길:

- B-17ac5960d0a5 · ConditionalExpression · sameMemo(initial.content, memo) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (95행).
- B-385d934a5a22 · ConditionalExpression · content.document → truthy / falsy; 바깥 조건: 별도 조건식 없음 (212행).
- B-beccd9b054d5 · ConditionalExpression · content.document → truthy / falsy; 바깥 조건: 별도 조건식 없음 (213행).
- B-216083aa75b3 · ConditionalExpression · isBlocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (233행).
- B-0450c550b31f · ConditionalExpression · embedded → truthy / falsy; 바깥 조건: 별도 조건식 없음 (235행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 83행 | 별도 조건식 없음 | memoDraftKey(data, memo.id)<br>preservation-boundary |
| 84행 | 별도 조건식 없음 | useState(() => { try { const draft = readMemoDraft(key, memo.id); if (draft && !sameMemo(draft, memo) && draft.baseVersion !== memo.version) return { content: memo as Content, conflict: draft, blocked: true, error: '저장된 메모와 초안의 수정 순서가 다릅니다. 두 내용을 보존했습니다.' }; return { content: (draft ?? memo) as Content, conflict: null, blocked: false, error: '' }; } catch { return { content: memo as Content, conflict: null, blocked: true, error: '초안을 읽지 못했습니다. 원문을 덮어쓰지 않았습니다. 초안 보관본에서 확인할 수 있습니다.' }; } })<br>call<br>전달 콜백: H-2feb6852ed0e |
| 91행 | 별도 조건식 없음 | useState(initial.content)<br>call |
| 92행 | 별도 조건식 없음 | useState(initial.blocked)<br>call |
| 93행 | 별도 조건식 없음 | useRef(content)<br>call |
| 93행 | 별도 조건식 없음 | useRef(memo)<br>call |
| 93행 | 별도 조건식 없음 | useRef(memo.version)<br>call |
| 94행 | 별도 조건식 없음 | useRef(onSaved)<br>call |
| 95행 | 별도 조건식 없음 | useState(initial.error)<br>call |
| 95행 | 별도 조건식 없음 | useState(sameMemo(initial.content, memo) ? '이 기기에 저장됨' : '저장 중…')<br>call |
| 95행 | 별도 조건식 없음 | sameMemo(initial.content, memo)<br>call |
| 96행 | 별도 조건식 없음 | useState(false)<br>call |
| 96행 | 별도 조건식 없음 | useState(0)<br>call |
| 97행 | 별도 조건식 없음 | useRef(null)<br>call |
| 98행 | 별도 조건식 없음 | useRef(true)<br>call |
| 98행 | 별도 조건식 없음 | useEffect(()=>()=>{mounted.current=false;}, [])<br>call<br>전달 콜백: H-e9cf4fb91598 |
| 99행 | 별도 조건식 없음 | useRef(null)<br>call |
| 99행 | 별도 조건식 없음 | useRef(false)<br>call |
| 101행 | 별도 조건식 없음 | useRef(null)<br>call |
| 102행 | 별도 조건식 없음 | useRef(null)<br>call |
| 103행 | 별도 조건식 없음 | useRef(initial.blocked)<br>call |
| 104행 | 별도 조건식 없음 | useRef(null)<br>call |
| 142행 | 별도 조건식 없음 | useRef({ flush, finish })<br>call |
| 143행 | 별도 조건식 없음 | useEffect(() => { const save = () => { operations.current.finish(); return operations.current.flush(); }; const unload = (event: BeforeUnloadEvent) => { if (!save() && !sameMemo(contentRef.current, savedRef.current)) { event.preventDefault(); event.returnValue = ''; } }; const hidden = () => { if (document.visibilityState === 'hidden') save(); }; window.addEventListener('beforeunload', unload); window.addEventListener('pagehide', save); document.addEventListener('visibilitychange', hidden); if (!sameMemo(contentRef.current, savedRef.current) && !blocked.current) timer.current = setTimeout(() => operations.current.flush(), 600); return () => { window.removeEventListener('beforeunload', unload); window. … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-599b0708cf3c |
| 214행 | 별도 조건식 없음 | storagePrefix(data)<br>call |
| 216행 | 별도 조건식 없음 | Boolean(initial.content.body)<br>call |
| 220행 | 별도 조건식 없음 | data.subjects.filter(row => !row.deletedAt).map(subject => <optgroup key={subject.id} label={subject.name}><option value={subject.id}>{subject.name} 전체</option>{data.nodes.filter(row => !row.deletedAt && row.subjectId === subject.id).map(node => <option key={node.id} value={node.id}>{node.name}</option>)}</optgroup>)<br>mutation-request<br>전달 콜백: H-875e4696a180 |
| 220행 | 별도 조건식 없음 | data.subjects.filter(row => !row.deletedAt)<br>call<br>전달 콜백: H-9804df652c66 |
| 221행 | truthy: content.ownerId | [...data.subjects, ...data.nodes].some(row => row.id === content.ownerId && !row.deletedAt)<br>call<br>전달 콜백: H-5ed65f69a77e |
| 221행 | truthy: content.ownerId && ![...data.subjects, ...data.nodes].some(row => row.id === content.ownerId && !row.deletedAt) | ownerName(data, content.ownerId)<br>call → [H-69b2e0053e6b](ui__quick-memos.md#h-69b2e0053e6b) |

반환/조기 중단: 235행 embedded ? <div className="memo-editor canvas-memo-editor nodrag nopan nowheel">{editor}</div> : <Modal open title="작은 메모" onClose={close} className="memo-editor">{editor}</Modal> [별도 조건식 없음]

## H-2feb6852ed0e

**@callback:useState** · [src/ui/quick-memos.tsx:84](../../../src/ui/quick-memos.tsx#L84)

분기 조건과 가능한 갈림길:

- B-d49328c3b887 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (85행).
- B-810b42ebfe5e · IfStatement · draft && !sameMemo(draft, memo) && draft.baseVersion !== memo.version → truthy / falsy; 바깥 조건: 별도 조건식 없음 (87행).
- B-21a8e26b6d21 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (89행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 86행 | 별도 조건식 없음 | readMemoDraft(key, memo.id)<br>preservation-boundary |
| 87행 | truthy: draft | sameMemo(draft, memo)<br>call |

반환/조기 중단: 87행 { content: memo as Content, conflict: draft, blocked: true, error: '저장된 메모와 초안의 수정 순서가 다릅니다. 두 내용을 보존했습니다.' } [truthy: draft && !sameMemo(draft, memo) && draft.baseVersion !== memo.version]; 88행 { content: (draft ?? memo) as Content, conflict: null, blocked: false, error: '' } [별도 조건식 없음]; 89행 { content: memo as Content, conflict: null, blocked: true, error: '초안을 읽지 못했습니다. 원문을 덮어쓰지 않았습니다. 초안 보관본에서 확인할 수 있습니다.' } [exception: exception]

## H-e9cf4fb91598

**@callback:useEffect** · [src/ui/quick-memos.tsx:98](../../../src/ui/quick-memos.tsx#L98)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-74f2c3de5827

**finish** · [src/ui/quick-memos.tsx:100](../../../src/ui/quick-memos.tsx#L100)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-63df12414426

**persistDraft** · [src/ui/quick-memos.tsx:105](../../../src/ui/quick-memos.tsx#L105)

분기 조건과 가능한 갈림길:

- B-a9146fe5d63f · IfStatement · draftTimer.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (106행).
- B-d00873d43f83 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (108행).
- B-313eddfd828e · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (109행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 106행 | truthy: draftTimer.current | clearTimeout(draftTimer.current)<br>call |
| 108행 | 별도 조건식 없음 | writeMemoDraft(key, { id: memo.id, baseVersion: version.current, ...contentRef.current })<br>preservation-boundary |

## H-a435ee3546d6

**flush** · [src/ui/quick-memos.tsx:111](../../../src/ui/quick-memos.tsx#L111)

분기 조건과 가능한 갈림길:

- B-4e9d9f767fca · IfStatement · timer.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (112행).
- B-030944f55ed5 · IfStatement · blocked.current || drawing.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (114행).
- B-2f12858534d4 · IfStatement · sameMemo(current, savedRef.current) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (116행).
- B-26feedd8a0e9 · IfStatement · draftTimer.current → truthy / falsy; 바깥 조건: truthy: sameMemo(current, savedRef.current) (117행).
- B-6a1a8447de6d · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: sameMemo(current, savedRef.current) (118행).
- B-3ece803860f5 · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: sameMemo(current, savedRef.current) (118행).
- B-437ea6625285 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (123행).
- B-311e29a12c07 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (129행).
- B-b6e9eb5361be · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (129행).
- B-787e0923ba83 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (131행).
- B-8ead7dd4eec8 · ConditionalExpression · draftHasUnstoredText(key) → truthy / falsy; 바깥 조건: exception: e (131행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 112행 | truthy: timer.current | clearTimeout(timer.current)<br>call |
| 116행 | 별도 조건식 없음 | sameMemo(current, savedRef.current)<br>call |
| 117행 | truthy: sameMemo(current, savedRef.current) ∧ truthy: draftTimer.current | clearTimeout(draftTimer.current)<br>call |
| 118행 | truthy: sameMemo(current, savedRef.current) | clearStoredDraft(key)<br>preservation-boundary |
| 119행 | truthy: sameMemo(current, savedRef.current) | setStatus('이 기기에 저장됨')<br>state-update |
| 119행 | truthy: sameMemo(current, savedRef.current) | setError('')<br>state-update |
| 122행 | 별도 조건식 없음 | persistDraft()<br>preservation-boundary → [H-63df12414426](ui__quick-memos.md#h-63df12414426) |
| 124행 | 별도 조건식 없음 | repository.execute({ type: 'saveMemo', id: memo.id, ...current, expectedVersion: version.current, opId: crypto.randomUUID(), at: new Date().toISOString(), userId: data.userId, namespace: data.namespace })<br>call |
| 125행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 125행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 126행 | 별도 조건식 없음 | next.memos!.find(row => row.id === memo.id)<br>call<br>전달 콜백: H-f1b2dec302cd |
| 127행 | 별도 조건식 없음 | callback.current(next)<br>call |
| 128행 | 별도 조건식 없음 | setStatus('이 기기에 저장됨')<br>state-update |
| 128행 | 별도 조건식 없음 | setError('')<br>state-update |
| 129행 | 별도 조건식 없음 | clearStoredDraft(key)<br>preservation-boundary |
| 129행 | exception: exception | setError('메모는 저장했습니다. 초안 정리가 남아 있습니다.')<br>state-update |
| 131행 | exception: e | setError(`${errorMessage(e)} ${draftHasUnstoredText(key) ? '최신 입력은 현재 창에만 남아 있습니다. 메모 파일로 보관해 주세요.' : '글과 그림은 이 기기의 초안에 보관했습니다. 저장을 다시 시도해 주세요.'}`)<br>state-update |
| 131행 | exception: e | errorMessage(e)<br>call → [H-3718c8c29801](ui__quick-memos.md#h-3718c8c29801) |
| 131행 | exception: e | draftHasUnstoredText(key)<br>preservation-boundary |
| 131행 | exception: e | setStatus('저장 다시 필요')<br>state-update |

반환/조기 중단: 114행 false [truthy: blocked.current || drawing.current]; 120행 true [truthy: sameMemo(current, savedRef.current)]; 130행 true [별도 조건식 없음]; 131행 false [exception: e]

## H-f1b2dec302cd

**@callback:next.memos!.find** · [src/ui/quick-memos.tsx:126](../../../src/ui/quick-memos.tsx#L126)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c4d00807ccda

**update** · [src/ui/quick-memos.tsx:133](../../../src/ui/quick-memos.tsx#L133)

분기 조건과 가능한 갈림길:

- B-65f4a0c43292 · IfStatement · draftTimer.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (137행).
- B-d806510e9e84 · IfStatement · timer.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (139행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 134행 | 별도 조건식 없음 | setContent(next)<br>state-update |
| 134행 | 별도 조건식 없음 | setStatus('저장 중…')<br>state-update |
| 136행 | 별도 조건식 없음 | rescueWithoutOverwrite(key, JSON.stringify({ id: memo.id, baseVersion: version.current, ...next }))<br>call |
| 136행 | 별도 조건식 없음 | JSON.stringify({ id: memo.id, baseVersion: version.current, ...next })<br>call |
| 137행 | truthy: draftTimer.current | clearTimeout(draftTimer.current)<br>call |
| 138행 | 별도 조건식 없음 | setTimeout(persistDraft, 80)<br>state-update<br>전달 콜백: H-63df12414426 |
| 139행 | truthy: timer.current | clearTimeout(timer.current)<br>call |
| 140행 | 별도 조건식 없음 | setTimeout(flush, 1200)<br>state-update<br>전달 콜백: H-a435ee3546d6 |

## H-599b0708cf3c

**@callback:useEffect** · [src/ui/quick-memos.tsx:143](../../../src/ui/quick-memos.tsx#L143)

분기 조건과 가능한 갈림길:

- B-1e29154d5333 · IfStatement · !sameMemo(contentRef.current, savedRef.current) && !blocked.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (148행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 147행 | 별도 조건식 없음 | window.addEventListener('beforeunload', unload)<br>call<br>전달 콜백: H-be37b7950545 |
| 147행 | 별도 조건식 없음 | window.addEventListener('pagehide', save)<br>call<br>전달 콜백: H-4386cce48d58 |
| 147행 | 별도 조건식 없음 | document.addEventListener('visibilitychange', hidden)<br>call<br>전달 콜백: H-7754ad914a32 |
| 148행 | 별도 조건식 없음 | sameMemo(contentRef.current, savedRef.current)<br>call |
| 148행 | truthy: !sameMemo(contentRef.current, savedRef.current) && !blocked.current | setTimeout(() => operations.current.flush(), 600)<br>state-update<br>전달 콜백: H-8e790738ce24 |

반환/조기 중단: 149행 () => { window.removeEventListener('beforeunload', unload); window.removeEventListener('pagehide', save); document.removeEventListener('visibilitychange', hidden); save(); } [별도 조건식 없음]

## H-4386cce48d58

**save** · [src/ui/quick-memos.tsx:144](../../../src/ui/quick-memos.tsx#L144)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 144행 | 별도 조건식 없음 | operations.current.finish()<br>call |
| 144행 | 별도 조건식 없음 | operations.current.flush()<br>mutation-request |

반환/조기 중단: 144행 operations.current.flush() [별도 조건식 없음]

## H-be37b7950545

**unload** · [src/ui/quick-memos.tsx:145](../../../src/ui/quick-memos.tsx#L145)

분기 조건과 가능한 갈림길:

- B-275aaf8286ec · IfStatement · !save() && !sameMemo(contentRef.current, savedRef.current) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (145행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 145행 | 별도 조건식 없음 | save()<br>call → [H-4386cce48d58](ui__quick-memos.md#h-4386cce48d58) |
| 145행 | truthy: !save() | sameMemo(contentRef.current, savedRef.current)<br>call |
| 145행 | truthy: !save() && !sameMemo(contentRef.current, savedRef.current) | event.preventDefault()<br>input-control |

## H-7754ad914a32

**hidden** · [src/ui/quick-memos.tsx:146](../../../src/ui/quick-memos.tsx#L146)

분기 조건과 가능한 갈림길:

- B-2da6ad8c3296 · IfStatement · document.visibilityState === 'hidden' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (146행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 146행 | truthy: document.visibilityState === 'hidden' | save()<br>call → [H-4386cce48d58](ui__quick-memos.md#h-4386cce48d58) |

## H-8e790738ce24

**@callback:setTimeout** · [src/ui/quick-memos.tsx:148](../../../src/ui/quick-memos.tsx#L148)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 148행 | truthy: !sameMemo(contentRef.current, savedRef.current) && !blocked.current | operations.current.flush()<br>mutation-request |

## H-1e74ec4c8e19

**close** · [src/ui/quick-memos.tsx:151](../../../src/ui/quick-memos.tsx#L151)

분기 조건과 가능한 갈림길:

- B-4430ed1f46c1 · IfStatement · blocked.current || flush() → truthy / falsy; 바깥 조건: 별도 조건식 없음 (151행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 151행 | 별도 조건식 없음 | finish()<br>call → [H-74f2c3de5827](ui__quick-memos.md#h-74f2c3de5827) |
| 151행 | falsy: blocked.current | flush()<br>call → [H-a435ee3546d6](ui__quick-memos.md#h-a435ee3546d6) |
| 151행 | truthy: blocked.current \|\| flush() | onClose()<br>call |

## H-27f23e2813f8

**copyConflict** · [src/ui/quick-memos.tsx:152](../../../src/ui/quick-memos.tsx#L152)

분기 조건과 가능한 갈림길:

- B-d0fe298efd8b · IfStatement · !initial.conflict → truthy / falsy; 바깥 조건: 별도 조건식 없음 (153행).
- B-f12fdd3c4911 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (154행).
- B-5434ab50a07e · ConditionalExpression · initial.conflict.document → truthy / falsy; 바깥 조건: 별도 조건식 없음 (157행).
- B-504dc1657146 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (162행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 155행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 155행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 155행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 157행 | 별도 조건식 없음 | repository.execute({ type: 'saveMemo', ...operation, ownerId: initial.conflict.ownerId, body: initial.conflict.body, strokes: initial.conflict.strokes, ...(initial.conflict.document ? {document:initial.conflict.document}:{}), expectedVersion: 0, userId: data.userId, namespace: data.namespace })<br>call |
| 159행 | 별도 조건식 없음 | callback.current(next)<br>call |
| 161행 | 별도 조건식 없음 | clearStoredDraft(key)<br>preservation-boundary |
| 161행 | 별도 조건식 없음 | onCopy(operation.id)<br>call |
| 162행 | exception: e | setError(errorMessage(e))<br>state-update |
| 162행 | exception: e | errorMessage(e)<br>call → [H-3718c8c29801](ui__quick-memos.md#h-3718c8c29801) |

반환/조기 중단: 153행 <render> [truthy: !initial.conflict]

## H-5ca973ec3ecf

**exportMemo** · [src/ui/quick-memos.tsx:164](../../../src/ui/quick-memos.tsx#L164)

분기 조건과 가능한 갈림길:

- B-80aa7ee0fe9b · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (166행).
- B-12fdbb71798e · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (175행).
- B-b4117f1900c1 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (178행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 165행 | 별도 조건식 없음 | finish()<br>call → [H-74f2c3de5827](ui__quick-memos.md#h-74f2c3de5827) |
| 167행 | 별도 조건식 없음 | JSON.stringify({ format: 'study-space-quick-memo', version: 1, exportedAt: new Date().toISOString(), namespace: data.namespace, userId: data.userId, savedMemo: repository.getSnapshot().memos?.find(row => row.id === memo.id), draft: { id: memo.id, baseVersion: version.current, ...contentRef.current }, conflict: initial.conflict, revisions: repository.getSnapshot().revisions.filter(row => row.collection === 'memos' && row.entityId === memo.id), appliedOps: Object.fromEntries(repository.getSnapshot().revisions.filter(row => row.collection === 'memos' && row.entityId === memo.id).map(row => [row.operationId, repository.getSnapshot().appliedOps[row.operationId]])), }, null, 2)<br>call |
| 167행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 168행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |
| 170행 | 별도 조건식 없음 | repository.getSnapshot().revisions.filter(row => row.collection === 'memos' && row.entityId === memo.id)<br>call<br>전달 콜백: H-0e66d98479ca |
| 170행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |
| 171행 | 별도 조건식 없음 | Object.fromEntries(repository.getSnapshot().revisions.filter(row => row.collection === 'memos' && row.entityId === memo.id).map(row => [row.operationId, repository.getSnapshot().appliedOps[row.operationId]]))<br>call |
| 171행 | 별도 조건식 없음 | repository.getSnapshot().revisions.filter(row => row.collection === 'memos' && row.entityId === memo.id).map(row => [row.operationId, repository.getSnapshot().appliedOps[row.operationId]])<br>call<br>전달 콜백: H-456837bfc96e |
| 171행 | 별도 조건식 없음 | repository.getSnapshot().revisions.filter(row => row.collection === 'memos' && row.entityId === memo.id)<br>call<br>전달 콜백: H-80a428c116ca |
| 171행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |
| 173행 | 별도 조건식 없음 | URL.createObjectURL(new Blob([raw], { type: 'application/json;charset=utf-8' }))<br>call |
| 174행 | 별도 조건식 없음 | document.createElement('a')<br>call |
| 175행 | 별도 조건식 없음 | document.body.append(link)<br>call |
| 175행 | 별도 조건식 없음 | link.click()<br>call |
| 175행 | always-after-try: try 완료 또는 예외 이후 | link.remove()<br>call |
| 176행 | 별도 조건식 없음 | setTimeout(() => URL.revokeObjectURL(url), 60_000)<br>state-update<br>전달 콜백: H-8320c82a0264 |
| 177행 | 별도 조건식 없음 | setStatus('파일 저장 위치를 확인해 주세요')<br>state-update |
| 178행 | exception: exception | setError('파일을 만들지 못했습니다. 입력은 현재 창에 유지했습니다.')<br>state-update |

## H-0e66d98479ca

**@callback:repository.getSnapshot().revisions.filter** · [src/ui/quick-memos.tsx:170](../../../src/ui/quick-memos.tsx#L170)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-80a428c116ca

**@callback:repository.getSnapshot().revisions.filter** · [src/ui/quick-memos.tsx:171](../../../src/ui/quick-memos.tsx#L171)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-456837bfc96e

**@callback:repository.getSnapshot().revisions.filter(row => row.collection === 'memos' && row.entityId === memo.id).map** · [src/ui/quick-memos.tsx:171](../../../src/ui/quick-memos.tsx#L171)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 171행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |

## H-8320c82a0264

**@callback:setTimeout** · [src/ui/quick-memos.tsx:176](../../../src/ui/quick-memos.tsx#L176)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 176행 | 별도 조건식 없음 | URL.revokeObjectURL(url)<br>call |

## H-e010d3b973f2

**finishPDFUpload** · [src/ui/quick-memos.tsx:180](../../../src/ui/quick-memos.tsx#L180)

분기 조건과 가능한 갈림길:

- B-e63283aa694a · IfStatement · mounted.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (181행).
- B-6fa11e9288d3 · IfStatement · !row || row.deletedAt || row.document?.file.sha256!==synced.file.sha256 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (183행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 181행 | truthy: mounted.current | update({...contentRef.current,document:synced})<br>call → [H-c4d00807ccda](ui__quick-memos.md#h-c4d00807ccda) |
| 181행 | truthy: mounted.current | flush()<br>call → [H-a435ee3546d6](ui__quick-memos.md#h-a435ee3546d6) |
| 182행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |
| 184행 | 별도 조건식 없음 | repository.execute({type:'saveMemo',id:row.id,ownerId:row.ownerId,body:row.body,strokes:row.strokes,document:synced,expectedVersion:row.version,opId:crypto.randomUUID(),at:new Date().toISOString(),userId:data.userId,namespace:data.namespace})<br>call |
| 184행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 184행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 185행 | 별도 조건식 없음 | callback.current(next)<br>call |

반환/조기 중단: 181행 <render> [truthy: mounted.current]; 183행 <render> [truthy: !row || row.deletedAt || row.document?.file.sha256!==synced.file.sha256]

## H-e78c756d4ae2

**attachPDF** · [src/ui/quick-memos.tsx:187](../../../src/ui/quick-memos.tsx#L187) · async

분기 조건과 가능한 갈림길:

- B-bf4e4984d728 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (189행).
- B-1a56030b5969 · ConditionalExpression · contentRef.current.strokes.length → truthy / falsy; 바깥 조건: nullish: existing?.startPage (190행).
- B-0acde3947a9b · IfStatement · existing && existing.file.sha256!==source.file.sha256 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (191행).
- B-eae397018fac · IfStatement · !mounted.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (192행).
- B-ad05e594307f · IfStatement · data.namespace==='personal' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (194행).
- B-9776e8e47a98 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (195행).
- B-de0da6f75af2 · IfStatement · mounted.current → truthy / falsy; 바깥 조건: exception: e (195행).
- B-9073291603ec · IfStatement · mounted.current → truthy / falsy; 바깥 조건: always-after-try: try 완료 또는 예외 이후 (196행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 188행 | 별도 조건식 없음 | finish()<br>call → [H-74f2c3de5827](ui__quick-memos.md#h-74f2c3de5827) |
| 188행 | 별도 조건식 없음 | setPDFBusy(true)<br>state-update |
| 188행 | 별도 조건식 없음 | setError('')<br>state-update |
| 190행 | 별도 조건식 없음 | attachInkPDF(data, file, existing?.startPage ?? (contentRef.current.strokes.length ? inkPageCount(contentRef.current.strokes) : 0))<br>call |
| 190행 | nullish: existing?.startPage ∧ truthy: contentRef.current.strokes.length | inkPageCount(contentRef.current.strokes)<br>call |
| 191행 | truthy: existing && existing.file.sha256!==source.file.sha256 | Error('기존 PDF와 다른 파일입니다. 원본 PDF를 선택하거나 새 메모에 연결해 주세요. 기존 필기는 유지했습니다.')<br>call |
| 193행 | 별도 조건식 없음 | update({...contentRef.current,document:source})<br>call → [H-c4d00807ccda](ui__quick-memos.md#h-c4d00807ccda) |
| 194행 | truthy: data.namespace==='personal' | syncInkPDF(data, source)<br>call |
| 194행 | truthy: data.namespace==='personal' | finishPDFUpload(synced)<br>call → [H-e010d3b973f2](ui__quick-memos.md#h-e010d3b973f2) |
| 195행 | exception: e ∧ truthy: mounted.current | setError(errorMessage(e)+' 원본과 필기는 이 기기에 보관했습니다.')<br>state-update |
| 195행 | exception: e ∧ truthy: mounted.current | errorMessage(e)<br>call → [H-3718c8c29801](ui__quick-memos.md#h-3718c8c29801) |
| 196행 | always-after-try: try 완료 또는 예외 이후 ∧ truthy: mounted.current | setPDFBusy(false)<br>state-update |

반환/조기 중단: 192행 <render> [truthy: !mounted.current]

throw: 191행 Error('기존 PDF와 다른 파일입니다. 원본 PDF를 선택하거나 새 메모에 연결해 주세요. 기존 필기는 유지했습니다.')

## H-a0839772056b

**retryPDF** · [src/ui/quick-memos.tsx:198](../../../src/ui/quick-memos.tsx#L198) · async

분기 조건과 가능한 갈림길:

- B-121079f0f61b · IfStatement · !source → truthy / falsy; 바깥 조건: 별도 조건식 없음 (198행).
- B-85b8dc81c64e · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (198행).
- B-f097f87c8b74 · IfStatement · mounted.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (198행).
- B-af6cb73367aa · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (198행).
- B-7d184eb3116f · IfStatement · mounted.current → truthy / falsy; 바깥 조건: exception: e (198행).
- B-45b44af8ecf5 · IfStatement · mounted.current → truthy / falsy; 바깥 조건: always-after-try: try 완료 또는 예외 이후 (198행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 198행 | 별도 조건식 없음 | setPDFBusy(true)<br>state-update |
| 198행 | 별도 조건식 없음 | syncInkPDF(data, source)<br>call |
| 198행 | 별도 조건식 없음 | finishPDFUpload(synced)<br>call → [H-e010d3b973f2](ui__quick-memos.md#h-e010d3b973f2) |
| 198행 | truthy: mounted.current | setError('')<br>state-update |
| 198행 | exception: e ∧ truthy: mounted.current | setError(errorMessage(e))<br>state-update |
| 198행 | exception: e ∧ truthy: mounted.current | errorMessage(e)<br>call → [H-3718c8c29801](ui__quick-memos.md#h-3718c8c29801) |
| 198행 | always-after-try: try 완료 또는 예외 이후 ∧ truthy: mounted.current | setPDFBusy(false)<br>state-update |

반환/조기 중단: 198행 <render> [truthy: !source]

## H-91e59e09d04c

**downloadPDF** · [src/ui/quick-memos.tsx:199](../../../src/ui/quick-memos.tsx#L199) · async

분기 조건과 가능한 갈림길:

- B-6ceb345a9144 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (199행).
- B-613a3f85c982 · IfStatement · original&&contentRef.current.document → truthy / falsy; 바깥 조건: 별도 조건식 없음 (200행).
- B-7668339a6073 · IfStatement · !blob → truthy / falsy; 바깥 조건: truthy: original&&contentRef.current.document (200행).
- B-2951e8b4d1fb · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (202행).
- B-37eb38703df5 · IfStatement · mounted.current → truthy / falsy; 바깥 조건: always-after-try: try 완료 또는 예외 이후 (202행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 199행 | 별도 조건식 없음 | finish()<br>call → [H-74f2c3de5827](ui__quick-memos.md#h-74f2c3de5827) |
| 199행 | 별도 조건식 없음 | setPDFBusy(true)<br>state-update |
| 200행 | truthy: original&&contentRef.current.document | readDocumentFile(data, contentRef.current.document.file)<br>call |
| 200행 | truthy: original&&contentRef.current.document ∧ truthy: !blob | Error('PDF 원본을 찾지 못했습니다.')<br>call |
| 200행 | truthy: original&&contentRef.current.document | downloadInkFile(blob, contentRef.current.document.file.name)<br>call |
| 201행 | falsy: original&&contentRef.current.document | exportInkPDF(data, contentRef.current.strokes, contentRef.current.document)<br>call |
| 201행 | falsy: original&&contentRef.current.document | downloadInkFile(new Blob([bytes as BlobPart],{type:'application/pdf'}), `memo-${memo.id}-annotations.pdf`)<br>call |
| 202행 | exception: e | setError(errorMessage(e))<br>state-update |
| 202행 | exception: e | errorMessage(e)<br>call → [H-3718c8c29801](ui__quick-memos.md#h-3718c8c29801) |
| 202행 | always-after-try: try 완료 또는 예외 이후 ∧ truthy: mounted.current | setPDFBusy(false)<br>state-update |

throw: 200행 Error('PDF 원본을 찾지 못했습니다.')

## H-bf6728f2577e

**@onChange** · [src/ui/quick-memos.tsx:205](../../../src/ui/quick-memos.tsx#L205)

분기 조건과 가능한 갈림길:

- B-9522d506eddd · IfStatement · file → truthy / falsy; 바깥 조건: visible-when-falsy: true (205행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 205행 | visible-when-falsy: true ∧ truthy: file | attachPDF(file)<br>call → [H-e78c756d4ae2](ui__quick-memos.md#h-e78c756d4ae2) |

## H-3ad71cae7698

**@onClick** · [src/ui/quick-memos.tsx:206](../../../src/ui/quick-memos.tsx#L206)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a9ba60d7a0ed

**@onClick** · [src/ui/quick-memos.tsx:207](../../../src/ui/quick-memos.tsx#L207)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 207행 | 별도 조건식 없음 | downloadPDF()<br>call → [H-91e59e09d04c](ui__quick-memos.md#h-91e59e09d04c) |

## H-6b7f0364d817

**@onClick** · [src/ui/quick-memos.tsx:208](../../../src/ui/quick-memos.tsx#L208)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e680b6071a44

**@onClick** · [src/ui/quick-memos.tsx:208](../../../src/ui/quick-memos.tsx#L208)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 208행 | truthy: content.document | downloadPDF(true)<br>call → [H-91e59e09d04c](ui__quick-memos.md#h-91e59e09d04c) |

## H-0bb8f6ee900e

**@onClick** · [src/ui/quick-memos.tsx:209](../../../src/ui/quick-memos.tsx#L209)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 209행 | truthy: content.document ∧ truthy: data.namespace==='personal'&&!content.document.file.cloudPath | retryPDF()<br>call → [H-a0839772056b](ui__quick-memos.md#h-a0839772056b) |

## H-cf8dbee84b6c

**@onRecognizedText** · [src/ui/quick-memos.tsx:214](../../../src/ui/quick-memos.tsx#L214)

분기 조건과 가능한 갈림길:

- B-dc45e6b81f42 · ConditionalExpression · contentRef.current.body → truthy / falsy; 바깥 조건: 별도 조건식 없음 (214행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 214행 | 별도 조건식 없음 | update({...contentRef.current,body:contentRef.current.body+(contentRef.current.body ? '\n' : '')+text})<br>call → [H-c4d00807ccda](ui__quick-memos.md#h-c4d00807ccda) |

## H-5b27ebe2b40f

**@onWorkspaceSaved** · [src/ui/quick-memos.tsx:214](../../../src/ui/quick-memos.tsx#L214)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 214행 | 별도 조건식 없음 | onSaved(repository.getSnapshot())<br>call |
| 214행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |

## H-88ffcae59ed5

**@onDrawing** · [src/ui/quick-memos.tsx:215](../../../src/ui/quick-memos.tsx#L215)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-0ec9f8feb577

**@onChange** · [src/ui/quick-memos.tsx:215](../../../src/ui/quick-memos.tsx#L215)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 215행 | 별도 조건식 없음 | update({ ...contentRef.current, strokes })<br>call → [H-c4d00807ccda](ui__quick-memos.md#h-c4d00807ccda) |

## H-5cbef6a29e38

**@onChange** · [src/ui/quick-memos.tsx:216](../../../src/ui/quick-memos.tsx#L216)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 216행 | 별도 조건식 없음 | update({ ...contentRef.current, body: event.target.value })<br>call → [H-c4d00807ccda](ui__quick-memos.md#h-c4d00807ccda) |

## H-8570d5ec4303

**@onChange** · [src/ui/quick-memos.tsx:218](../../../src/ui/quick-memos.tsx#L218)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 218행 | 별도 조건식 없음 | update({ ...contentRef.current, ownerId: event.target.value \|\| null })<br>call → [H-c4d00807ccda](ui__quick-memos.md#h-c4d00807ccda) |

## H-9804df652c66

**@callback:data.subjects.filter** · [src/ui/quick-memos.tsx:220](../../../src/ui/quick-memos.tsx#L220)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-875e4696a180

**@callback:data.subjects.filter(row => !row.deletedAt).map** · [src/ui/quick-memos.tsx:220](../../../src/ui/quick-memos.tsx#L220)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 220행 | 별도 조건식 없음 | data.nodes.filter(row => !row.deletedAt && row.subjectId === subject.id).map(node => <option key={node.id} value={node.id}>{node.name}</option>)<br>mutation-request<br>전달 콜백: H-b566ef4dffac |
| 220행 | 별도 조건식 없음 | data.nodes.filter(row => !row.deletedAt && row.subjectId === subject.id)<br>call<br>전달 콜백: H-aed9050405b2 |

## H-aed9050405b2

**@callback:data.nodes.filter** · [src/ui/quick-memos.tsx:220](../../../src/ui/quick-memos.tsx#L220)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b566ef4dffac

**@callback:data.nodes.filter(row => !row.deletedAt && row.subjectId === subject.id).map** · [src/ui/quick-memos.tsx:220](../../../src/ui/quick-memos.tsx#L220)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-5ed65f69a77e

**@callback:[...data.subjects, ...data.nodes].some** · [src/ui/quick-memos.tsx:221](../../../src/ui/quick-memos.tsx#L221)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-88bed2e3ab88

**@onClick** · [src/ui/quick-memos.tsx:227](../../../src/ui/quick-memos.tsx#L227)

분기 조건과 가능한 갈림길:

- B-7a2830283db3 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: isBlocked && !initial.conflict (228행).
- B-c3e65153130d · CatchClause · e → exception; 바깥 조건: truthy: isBlocked && !initial.conflict (229행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 228행 | truthy: isBlocked && !initial.conflict | archiveDamagedDraft(key, '작은 메모 초안 읽기 실패')<br>preservation-boundary |
| 228행 | truthy: isBlocked && !initial.conflict | clearStoredDraft(key)<br>preservation-boundary |
| 228행 | truthy: isBlocked && !initial.conflict | setBlocked(false)<br>state-update |
| 228행 | truthy: isBlocked && !initial.conflict | setError('읽을 수 없던 초안 원문을 보관했습니다. 저장된 메모를 이어 편집할 수 있습니다.')<br>state-update |
| 229행 | truthy: isBlocked && !initial.conflict ∧ exception: e | setError(errorMessage(e))<br>state-update |
| 229행 | truthy: isBlocked && !initial.conflict ∧ exception: e | errorMessage(e)<br>call → [H-3718c8c29801](ui__quick-memos.md#h-3718c8c29801) |

