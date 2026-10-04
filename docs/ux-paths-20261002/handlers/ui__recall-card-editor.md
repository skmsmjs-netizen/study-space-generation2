# src/ui/recall-card-editor.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-58d608b8da80

**RecallCardEditor** · [src/ui/recall-card-editor.tsx:11](../../../src/ui/recall-card-editor.tsx#L11)

분기 조건과 가능한 갈림길:

- B-e106ed8eb4fd · IfStatement · draft?.kind === 'cloze' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (19행).
- B-3f52e7be0018 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: draft?.kind === 'cloze' (19행).
- B-882d07b83224 · CatchClause · e → exception; 바깥 조건: truthy: draft?.kind === 'cloze' (19행).
- B-b1868b696f91 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: truthy: draft?.kind === 'cloze' ∧ exception: e (19행).
- B-0a667560d51c · ConditionalExpression · draft → truthy / falsy; 바깥 조건: 별도 조건식 없음 (61행).
- B-e12cd7b0e39f · ConditionalExpression · session.deckId !== 'all' → truthy / falsy; 바깥 조건: falsy: draft (61행).
- B-a7359e46b1d2 · ConditionalExpression · draft?.kind === 'cloze' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (64행).
- B-3cf9c345592d · ConditionalExpression · draft?.expectedVersion || draft?.clozeCards?.some(c => c.expectedVersion > 0) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (74행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | 별도 조건식 없음 | useState('')<br>call |
| 12행 | 별도 조건식 없음 | useState('')<br>call |
| 12행 | 별도 조건식 없음 | useState('')<br>call |
| 12행 | 별도 조건식 없음 | useState(20)<br>call |
| 13행 | 별도 조건식 없음 | useRef(null)<br>call |
| 13행 | 별도 조건식 없음 | useRef(false)<br>call |
| 13행 | 별도 조건식 없음 | useState(false)<br>call |
| 14행 | 별도 조건식 없음 | recallDecks(data)<br>call |
| 19행 | truthy: draft?.kind === 'cloze' | clozeNumbers(draft.front)<br>call |
| 42행 | 별도 조건식 없음 | topics.map(topic => topic.id)<br>call<br>전달 콜백: H-90820ecaf9bf |
| 43행 | 별도 조건식 없음 | (data.recallCards ?? []).filter(card => !card.deletedAt && card.front !== undefined && topicIds.has(card.topicId) && (session.deckId === undefined \|\| session.deckId === 'all' \|\| (card.deckId ?? 'default') === session.deckId))<br>call<br>전달 콜백: H-4f87731804ad |
| 44행 | 별도 조건식 없음 | availableCards.filter(card => !search.trim() \|\| `${card.front}\n${card.reference}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()))<br>call<br>전달 콜백: H-68eddbf49f17 |
| 58행 | 별도 조건식 없음 | topics.map(topic => <option key={topic.id} value={topic.id}>{data.subjects.find(s => s.id === topic.subjectId)?.name} / {topic.name}</option>)<br>call<br>전달 콜백: H-d326ea392425 |
| 59행 | truthy: draft?.topicId | topics.some(topic => topic.id === draft.topicId)<br>call<br>전달 콜백: H-e005e8c7d15d |
| 62행 | 별도 조건식 없음 | decks.map(deck => <option key={deck.id} value={deck.id}>{deck.deckName}</option>)<br>call<br>전달 콜백: H-16a7c972f568 |
| 71행 | truthy: draft?.kind === 'cloze' ∧ truthy: numbers.length > 0 | numbers.slice(0, 20).map(number => <p key={number}>c{number} · {renderCloze(draft.front, number)}</p>)<br>call<br>전달 콜백: H-991f53e21f82 |
| 71행 | truthy: draft?.kind === 'cloze' ∧ truthy: numbers.length > 0 | numbers.slice(0, 20)<br>call |
| 79행 | truthy: !!availableCards.length | cards.slice(0, limit).map(card => <article key={card.id}><p>{card.suspended ? '보관 · ' : ''}{card.front}</p><div className="actions"><Button disabled={disabled \|\| composition} onClick={() => { persist({ ...session, registration: { id: card.cloze?.noteId ?? card.id, topicId: card.topicId, front: card.cloze?.source ?? card.front!, reference: card.reference, deckId: card.deckId, ...(card.cloze ? { kind: 'cloze', clozeCards: (data.recallCards ?? []).filter(c => c.cloze?.noteId === card.cloze!.noteId).map(c => ({ id: c.id, number: c.cloze!.number, expectedVersion: c.version })) } : { kind: 'basic', expectedVersion: card.version }) } }); setError(''); setNotice('원문을 편집란에 열었습니다. 저장 전까지 기존 카드와 이력은 유지됩니다.'); text.current?.focu … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-52eba5eea769 |
| 79행 | truthy: !!availableCards.length | cards.slice(0, limit)<br>call |

반환/조기 중단: 51행 <render> [별도 조건식 없음]

## H-ae6727aee914

**change** · [src/ui/recall-card-editor.tsx:15](../../../src/ui/recall-card-editor.tsx#L15)

분기 조건과 가능한 갈림길:

- B-2124aa6dc720 · ConditionalExpression · session.deckId !== 'all' && session.deckId !== 'default' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (16행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 16행 | 별도 조건식 없음 | persist({ ...session, registration: { id: crypto.randomUUID(), topicId: topics[0]?.id ?? '', front: '', reference: '', deckId: session.deckId !== 'all' && session.deckId !== 'default' ? session.deckId : undefined, ...draft, ...values } })<br>call |
| 16행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |

## H-2a67e79e5ce6

**save** · [src/ui/recall-card-editor.tsx:20](../../../src/ui/recall-card-editor.tsx#L20)

분기 조건과 가능한 갈림길:

- B-883e4853af48 · IfStatement · !draft || disabled || composing.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (21행).
- B-34c93f5d9d75 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (22행).
- B-d843b23a2e61 · IfStatement · draft.kind === 'cloze' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (25행).
- B-a3f14e2b6ac7 · IfStatement · !ordinals.length → truthy / falsy; 바깥 조건: truthy: draft.kind === 'cloze' (27행).
- B-6d65502a921d · IfStatement · !cards.some(card => card.number === number) → truthy / falsy; 바깥 조건: truthy: draft.kind === 'cloze' (29행).
- B-8d877c3311ce · IfStatement · !persist({ ...session, registration: { ...draft, clozeCards: cards } }) → truthy / falsy; 바깥 조건: truthy: draft.kind === 'cloze' (30행).
- B-c3feb4a53030 · IfStatement · !already → truthy / falsy; 바깥 조건: truthy: draft.kind === 'cloze' (32행).
- B-6acd2ddbbf4b · IfStatement · !already → truthy / falsy; 바깥 조건: falsy: draft.kind === 'cloze' (36행).
- B-ebd0d2399934 · IfStatement · persist({ ...session, registration: { id: crypto.randomUUID(), topicId: draft.topicId, front: '', reference: '', kind: draft.kind, deckId: draft.deckId } }) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (39행).
- B-565851d5375a · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (40행).
- B-07f528dbe548 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (40행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 23행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |
| 23행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 23행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 26행 | truthy: draft.kind === 'cloze' | clozeNumbers(draft.front)<br>call |
| 27행 | truthy: draft.kind === 'cloze' ∧ truthy: !ordinals.length | Error('빈칸을 {{c1::정답}}처럼 표시하거나 문장을 선택해 빈칸으로 만들어 주세요.')<br>call |
| 29행 | truthy: draft.kind === 'cloze' | cards.some(card => card.number === number)<br>call<br>전달 콜백: H-b6eb3c96bbac |
| 29행 | truthy: draft.kind === 'cloze' ∧ truthy: !cards.some(card => card.number === number) | cards.push({ id: crypto.randomUUID(), number, expectedVersion: 0 })<br>call |
| 29행 | truthy: draft.kind === 'cloze' ∧ truthy: !cards.some(card => card.number === number) | crypto.randomUUID()<br>call |
| 30행 | truthy: draft.kind === 'cloze' | persist({ ...session, registration: { ...draft, clozeCards: cards } })<br>call |
| 31행 | truthy: draft.kind === 'cloze' | cards.every(item => { const old = snapshot.recallCards?.find(c => c.id === item.id); return old && old.cloze?.noteId === draft.id && (ordinals.includes(item.number) ? !old.suspended && old.cloze.source === draft.front && old.reference === draft.reference && old.deckId === draft.deckId : old.suspended); })<br>call<br>전달 콜백: H-72af36c7f632 |
| 32행 | truthy: draft.kind === 'cloze' ∧ truthy: !already | repository.execute({ ...context, type: 'saveRecallCloze', noteId: draft.id, topicId: draft.topicId, source: draft.front, reference: draft.reference, deckId: draft.deckId, cards })<br>call |
| 36행 | falsy: draft.kind === 'cloze' ∧ truthy: !already | repository.execute({ ...context, type: 'saveRecallCard', id: draft.id, topicId: draft.topicId, front: draft.front, reference: draft.reference, deckId: draft.deckId, expectedVersion: draft.expectedVersion ?? 0 })<br>call |
| 38행 | 별도 조건식 없음 | onSaved(saved)<br>call |
| 39행 | 별도 조건식 없음 | persist({ ...session, registration: { id: crypto.randomUUID(), topicId: draft.topicId, front: '', reference: '', kind: draft.kind, deckId: draft.deckId } })<br>call |
| 39행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 39행 | truthy: persist({ ...session, registration: { id: crypto.randomUUID(), topicId: draft.topicId, front: '', reference: '', kind: draft.kind, deckId: draft.deckId } }) | setError('')<br>state-update |
| 39행 | truthy: persist({ ...session, registration: { id: crypto.randomUUID(), topicId: draft.topicId, front: '', reference: '', kind: draft.kind, deckId: draft.deckId } }) | setNotice('질문 카드를 저장했습니다. 카드마다 복습 날짜와 답변을 따로 기록합니다.')<br>state-update |
| 40행 | exception: e | setError(e instanceof Error ? e.message : '카드를 저장하지 못했습니다. 초안은 남아 있습니다.')<br>state-update |

반환/조기 중단: 21행 <render> [truthy: !draft || disabled || composing.current]; 30행 <render> [truthy: draft.kind === 'cloze' ∧ truthy: !persist({ ...session, registration: { ...draft, clozeCards: cards } })]

throw: 27행 Error('빈칸을 {{c1::정답}}처럼 표시하거나 문장을 선택해 빈칸으로 만들어 주세요.')

## H-b6eb3c96bbac

**@callback:cards.some** · [src/ui/recall-card-editor.tsx:29](../../../src/ui/recall-card-editor.tsx#L29)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-72af36c7f632

**@callback:cards.every** · [src/ui/recall-card-editor.tsx:31](../../../src/ui/recall-card-editor.tsx#L31)

분기 조건과 가능한 갈림길:

- B-9a6a3d273e40 · ConditionalExpression · ordinals.includes(item.number) → truthy / falsy; 바깥 조건: truthy: draft.kind === 'cloze' ∧ truthy: old && old.cloze?.noteId === draft.id (31행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 31행 | truthy: draft.kind === 'cloze' ∧ truthy: old && old.cloze?.noteId === draft.id | ordinals.includes(item.number)<br>call |

반환/조기 중단: 31행 old && old.cloze?.noteId === draft.id && (ordinals.includes(item.number) ? !old.suspended && old.cloze.source === draft.front && old.reference === draft.reference && old.deckId === draft.deckId : old.suspended) [truthy: draft.kind === 'cloze']

## H-90820ecaf9bf

**@callback:topics.map** · [src/ui/recall-card-editor.tsx:42](../../../src/ui/recall-card-editor.tsx#L42)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4f87731804ad

**@callback:(data.recallCards ?? []).filter** · [src/ui/recall-card-editor.tsx:43](../../../src/ui/recall-card-editor.tsx#L43)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 43행 | truthy: !card.deletedAt && card.front !== undefined | topicIds.has(card.topicId)<br>call |

## H-68eddbf49f17

**@callback:availableCards.filter** · [src/ui/recall-card-editor.tsx:44](../../../src/ui/recall-card-editor.tsx#L44)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 44행 | 별도 조건식 없음 | search.trim()<br>call |
| 44행 | falsy: !search.trim() | `${card.front}\n${card.reference}`.toLocaleLowerCase().includes(search.toLocaleLowerCase())<br>call |
| 44행 | falsy: !search.trim() | `${card.front}\n${card.reference}`.toLocaleLowerCase()<br>call |
| 44행 | falsy: !search.trim() | search.toLocaleLowerCase()<br>call |

## H-ffce4080f5a5

**setStatus** · [src/ui/recall-card-editor.tsx:45](../../../src/ui/recall-card-editor.tsx#L45)

분기 조건과 가능한 갈림길:

- B-4f1cdb295fd4 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (46행).
- B-ce9c0808ab86 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (48행).
- B-c404d8cfb6e8 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (48행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 46행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |
| 46행 | 별도 조건식 없음 | snapshot.recallCards!.find(c => c.id === id)<br>call<br>전달 콜백: H-29bc96761a9a |
| 47행 | 별도 조건식 없음 | onSaved(repository.execute({ type: 'setRecallCardStatus', id, expectedVersion: card.version, suspended, deckId: card.deckId, opId: crypto.randomUUID(), at: new Date().toISOString(), userId: snapshot.userId, namespace: snapshot.namespace }))<br>call |
| 47행 | 별도 조건식 없음 | repository.execute({ type: 'setRecallCardStatus', id, expectedVersion: card.version, suspended, deckId: card.deckId, opId: crypto.randomUUID(), at: new Date().toISOString(), userId: snapshot.userId, namespace: snapshot.namespace })<br>call |
| 47행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 47행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 47행 | 별도 조건식 없음 | setError('')<br>state-update |
| 48행 | exception: e | setError(e instanceof Error ? e.message : '카드 상태를 저장하지 못했습니다.')<br>state-update |

## H-29bc96761a9a

**@callback:snapshot.recallCards!.find** · [src/ui/recall-card-editor.tsx:46](../../../src/ui/recall-card-editor.tsx#L46)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f01ebd1f8a63

**@onChange** · [src/ui/recall-card-editor.tsx:53](../../../src/ui/recall-card-editor.tsx#L53)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 53행 | 별도 조건식 없음 | change({ kind: e.target.value as 'basic' \| 'cloze' })<br>call → [H-ae6727aee914](ui__recall-card-editor.md#h-ae6727aee914) |

## H-41b275bb6bef

**@onChange** · [src/ui/recall-card-editor.tsx:56](../../../src/ui/recall-card-editor.tsx#L56)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 56행 | 별도 조건식 없음 | change({ topicId: e.target.value })<br>call → [H-ae6727aee914](ui__recall-card-editor.md#h-ae6727aee914) |

## H-d326ea392425

**@callback:topics.map** · [src/ui/recall-card-editor.tsx:58](../../../src/ui/recall-card-editor.tsx#L58)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 58행 | 별도 조건식 없음 | data.subjects.find(s => s.id === topic.subjectId)<br>call<br>전달 콜백: H-983a66bb5695 |

## H-983a66bb5695

**@callback:data.subjects.find** · [src/ui/recall-card-editor.tsx:58](../../../src/ui/recall-card-editor.tsx#L58)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e005e8c7d15d

**@callback:topics.some** · [src/ui/recall-card-editor.tsx:59](../../../src/ui/recall-card-editor.tsx#L59)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-65195878d10e

**@onChange** · [src/ui/recall-card-editor.tsx:61](../../../src/ui/recall-card-editor.tsx#L61)

분기 조건과 가능한 갈림길:

- B-2202df11889c · ConditionalExpression · e.target.value === 'default' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (61행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 61행 | 별도 조건식 없음 | change({ deckId: e.target.value === 'default' ? undefined : e.target.value })<br>call → [H-ae6727aee914](ui__recall-card-editor.md#h-ae6727aee914) |

## H-16a7c972f568

**@callback:decks.map** · [src/ui/recall-card-editor.tsx:62](../../../src/ui/recall-card-editor.tsx#L62)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-5d403a71e75f

**@onChange** · [src/ui/recall-card-editor.tsx:64](../../../src/ui/recall-card-editor.tsx#L64)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 64행 | 별도 조건식 없음 | change({ front: e.target.value })<br>call → [H-ae6727aee914](ui__recall-card-editor.md#h-ae6727aee914) |

## H-4584a8eaf011

**@onClick** · [src/ui/recall-card-editor.tsx:65](../../../src/ui/recall-card-editor.tsx#L65)

분기 조건과 가능한 갈림길:

- B-87099aedbc2b · IfStatement · start === end → truthy / falsy; 바깥 조건: truthy: draft?.kind === 'cloze' (67행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 67행 | truthy: draft?.kind === 'cloze' ∧ truthy: start === end | setError('문장에서 가릴 부분을 먼저 선택해 주세요.')<br>state-update |
| 68행 | truthy: draft?.kind === 'cloze' | Math.max(0, ...numbers)<br>call |
| 69행 | truthy: draft?.kind === 'cloze' | change({ front: `${draft.front.slice(0, start)}{{c${number}::${draft.front.slice(start, end)}}}${draft.front.slice(end)}` })<br>call → [H-ae6727aee914](ui__recall-card-editor.md#h-ae6727aee914) |
| 69행 | truthy: draft?.kind === 'cloze' | draft.front.slice(0, start)<br>preservation-boundary |
| 69행 | truthy: draft?.kind === 'cloze' | draft.front.slice(start, end)<br>preservation-boundary |
| 69행 | truthy: draft?.kind === 'cloze' | draft.front.slice(end)<br>preservation-boundary |
| 69행 | truthy: draft?.kind === 'cloze' | setError('')<br>state-update |

반환/조기 중단: 67행 <render> [truthy: draft?.kind === 'cloze' ∧ truthy: start === end]

## H-991f53e21f82

**@callback:numbers.slice(0, 20).map** · [src/ui/recall-card-editor.tsx:71](../../../src/ui/recall-card-editor.tsx#L71)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 71행 | truthy: draft?.kind === 'cloze' ∧ truthy: numbers.length > 0 | renderCloze(draft.front, number)<br>call |

## H-99ea7a879fd1

**@onChange** · [src/ui/recall-card-editor.tsx:73](../../../src/ui/recall-card-editor.tsx#L73)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 73행 | 별도 조건식 없음 | change({ reference: e.target.value })<br>call → [H-ae6727aee914](ui__recall-card-editor.md#h-ae6727aee914) |

## H-976d330ceb64

**@onClick** · [src/ui/recall-card-editor.tsx:75](../../../src/ui/recall-card-editor.tsx#L75)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 75행 | truthy: draft | change({ id: crypto.randomUUID(), front: '', reference: '', expectedVersion: undefined, clozeCards: undefined })<br>call → [H-ae6727aee914](ui__recall-card-editor.md#h-ae6727aee914) |
| 75행 | truthy: draft | crypto.randomUUID()<br>call |

## H-b2a03a07d593

**@onChange** · [src/ui/recall-card-editor.tsx:77](../../../src/ui/recall-card-editor.tsx#L77)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 77행 | truthy: !!availableCards.length | setSearch(e.target.value)<br>state-update |
| 77행 | truthy: !!availableCards.length | setLimit(20)<br>state-update |

## H-52eba5eea769

**@callback:cards.slice(0, limit).map** · [src/ui/recall-card-editor.tsx:79](../../../src/ui/recall-card-editor.tsx#L79)

분기 조건과 가능한 갈림길:

- B-04734b8e14c9 · ConditionalExpression · card.suspended → truthy / falsy; 바깥 조건: truthy: !!availableCards.length (79행).
- B-c01b512586bf · ConditionalExpression · card.suspended → truthy / falsy; 바깥 조건: truthy: !!availableCards.length (81행).

## H-88e90bb94db0

**@onClick** · [src/ui/recall-card-editor.tsx:79](../../../src/ui/recall-card-editor.tsx#L79)

분기 조건과 가능한 갈림길:

- B-44b3d961ea5d · ConditionalExpression · card.cloze → truthy / falsy; 바깥 조건: truthy: !!availableCards.length (80행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 80행 | truthy: !!availableCards.length | persist({ ...session, registration: { id: card.cloze?.noteId ?? card.id, topicId: card.topicId, front: card.cloze?.source ?? card.front!, reference: card.reference, deckId: card.deckId, ...(card.cloze ? { kind: 'cloze', clozeCards: (data.recallCards ?? []).filter(c => c.cloze?.noteId === card.cloze!.noteId).map(c => ({ id: c.id, number: c.cloze!.number, expectedVersion: c.version })) } : { kind: 'basic', expectedVersion: card.version }) } })<br>call |
| 80행 | truthy: !!availableCards.length ∧ truthy: card.cloze | (data.recallCards ?? []).filter(c => c.cloze?.noteId === card.cloze!.noteId).map(c => ({ id: c.id, number: c.cloze!.number, expectedVersion: c.version }))<br>call<br>전달 콜백: H-9b8c60e3a9f2 |
| 80행 | truthy: !!availableCards.length ∧ truthy: card.cloze | (data.recallCards ?? []).filter(c => c.cloze?.noteId === card.cloze!.noteId)<br>call<br>전달 콜백: H-e3d309a19e3a |
| 80행 | truthy: !!availableCards.length | setError('')<br>state-update |
| 80행 | truthy: !!availableCards.length | setNotice('원문을 편집란에 열었습니다. 저장 전까지 기존 카드와 이력은 유지됩니다.')<br>state-update |

## H-e3d309a19e3a

**@callback:(data.recallCards ?? []).filter** · [src/ui/recall-card-editor.tsx:80](../../../src/ui/recall-card-editor.tsx#L80)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-9b8c60e3a9f2

**@callback:(data.recallCards ?? []).filter(c => c.cloze?.noteId === card.cloze!.noteId).map** · [src/ui/recall-card-editor.tsx:80](../../../src/ui/recall-card-editor.tsx#L80)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-30f919a2f40c

**@onClick** · [src/ui/recall-card-editor.tsx:81](../../../src/ui/recall-card-editor.tsx#L81)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 81행 | truthy: !!availableCards.length | setStatus(card.id, !card.suspended)<br>state-update → [H-ffce4080f5a5](ui__recall-card-editor.md#h-ffce4080f5a5) |

## H-3c6f1de48194

**@onClick** · [src/ui/recall-card-editor.tsx:82](../../../src/ui/recall-card-editor.tsx#L82)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 82행 | truthy: !!availableCards.length ∧ truthy: cards.length > limit | setLimit(limit + 20)<br>state-update |

