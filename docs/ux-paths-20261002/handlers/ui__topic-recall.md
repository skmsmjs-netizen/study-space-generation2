# src/ui/topic-recall.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-e62855fe4c8d

**message** · [src/ui/topic-recall.tsx:20](../../../src/ui/topic-recall.tsx#L20)

분기 조건과 가능한 갈림길:

- B-4e8e43cfa0ac · ConditionalExpression · error instanceof Error → truthy / falsy; 바깥 조건: 별도 조건식 없음 (20행).

## H-37a2230fa4a0

**TopicRecall** · [src/ui/topic-recall.tsx:21](../../../src/ui/topic-recall.tsx#L21)

분기 조건과 가능한 갈림길:

- B-06c4ee2cf195 · ConditionalExpression · topic → truthy / falsy; 바깥 조건: 별도 조건식 없음 (53행).
- B-725056358937 · ConditionalExpression · topic → truthy / falsy; 바깥 조건: 별도 조건식 없음 (58행).
- B-be697a58bd5c · ConditionalExpression · topic → truthy / falsy; 바깥 조건: 별도 조건식 없음 (165행).
- B-2ff4d4633758 · IfStatement · loaded.error → truthy / falsy; 바깥 조건: 별도 조건식 없음 (166행).
- B-a3321d536ab9 · ConditionalExpression · topic → truthy / falsy; 바깥 조건: 별도 조건식 없음 (170행).
- B-9c4bd5d2da69 · ConditionalExpression · session.pendingUndo → truthy / falsy; 바깥 조건: truthy: session.lastReview (180행).
- B-8297417ee2c1 · ConditionalExpression · topic → truthy / falsy; 바깥 조건: 별도 조건식 없음 (198행).
- B-ec7cafc2d889 · ConditionalExpression · topic.topicId → truthy / falsy; 바깥 조건: truthy: topic (200행).
- B-e34bee85e975 · ConditionalExpression · scheduled → truthy / falsy; 바깥 조건: truthy: topic (218행).
- B-3baf41d0d039 · ConditionalExpression · scheduled → truthy / falsy; 바깥 조건: truthy: topic (218행).
- B-100122c3b132 · ConditionalExpression · revealedId !== topic.id → truthy / falsy; 바깥 조건: truthy: topic ∧ truthy: scheduled (223행).
- B-03f513899bb0 · ConditionalExpression · card.memory.state === 0 && !card.manualDue → truthy / falsy; 바깥 조건: truthy: topic ∧ truthy: card (242행).
- B-39e225e4d848 · ConditionalExpression · topics.length && scheduled → truthy / falsy; 바깥 조건: falsy: topic (246행).
- B-0d3a68e7638f · ConditionalExpression · session.deckId && session.deckId !== 'all' → truthy / falsy; 바깥 조건: falsy: topic ∧ falsy: topics.length && scheduled (246행).
- B-484fe877bb91 · ConditionalExpression · topics.length && scheduled → truthy / falsy; 바깥 조건: falsy: topic (246행).
- B-59fdf0a87591 · ConditionalExpression · queue.nextDue → truthy / falsy; 바깥 조건: falsy: topic ∧ truthy: topics.length && scheduled (246행).
- B-ad72296a2360 · ConditionalExpression · session.deckId && session.deckId !== 'all' → truthy / falsy; 바깥 조건: falsy: topic ∧ falsy: topics.length && scheduled (246행).
- B-5baa869c4d5e · ConditionalExpression · session.deckId !== 'all' && session.deckId !== 'default' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (249행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 22행 | 별도 조건식 없음 | useState(() => { try { let session = recallForDay(readRecall(data), new Date().toISOString()); const draft = session.currentId ? session.drafts[session.currentId] : undefined; if (initialMode && !session.pendingReview && !session.pendingUndo && !draft?.body.trim() && !draft?.strokes?.length) { session = recallForDay({ ...session, mode: initialMode, subjectId: 'all', unitId: 'all' }, new Date().toISOString()); const pool = recallPrompts(data, recallTopics(data,subjectIds,session)), queue = recallQueue(data,pool,new Date().toISOString(),session.skipped); session = { ...session, currentId: [...queue.due, ...queue.fresh][0]?.id ?? null }; } return { session, error: '' }; } catch (error) { return { sessio … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-9022db2f1597 |
| 35행 | 별도 조건식 없음 | useState(loaded.session)<br>call |
| 36행 | 별도 조건식 없음 | useState('')<br>call |
| 36행 | 별도 조건식 없음 | useState('')<br>call |
| 37행 | 별도 조건식 없음 | useState(false)<br>call |
| 37행 | 별도 조건식 없음 | useState(false)<br>call |
| 38행 | 별도 조건식 없음 | useRef(false)<br>call |
| 38행 | 별도 조건식 없음 | useRef(null)<br>call |
| 39행 | 별도 조건식 없음 | useState(() => new Date().toISOString())<br>call<br>전달 콜백: H-f381073f36a9 |
| 40행 | 별도 조건식 없음 | useState(null)<br>call |
| 41행 | 별도 조건식 없음 | useState('')<br>call |
| 43행 | falsy: !repository.getCapabilities | repository.getCapabilities().includes('reviewRecallCard')<br>call |
| 43행 | falsy: !repository.getCapabilities | repository.getCapabilities()<br>call |
| 44행 | 별도 조건식 없음 | useEffect(() => { const timer = window.setInterval(() => setNow(new Date().toISOString()), 15000); return () => window.clearInterval(timer); }, [])<br>call<br>전달 콜백: H-335f1a79d185 |
| 45행 | 별도 조건식 없음 | recallTopics(data, subjectIds, session)<br>call |
| 46행 | 별도 조건식 없음 | recallPrompts(data, sourceTopics, session.deckId)<br>call |
| 47행 | 별도 조건식 없음 | recallQueue(data, topics, now, recallForDay(session, now).skipped)<br>call |
| 47행 | 별도 조건식 없음 | recallForDay(session, now)<br>call |
| 49행 | 별도 조건식 없음 | topics.find(row => row.id === session.currentId)<br>call<br>전달 콜백: H-a169a968daef |
| 50행 | 별도 조건식 없음 | data.subjects.filter(row => !row.deletedAt && subjectIds.includes(row.id))<br>call<br>전달 콜백: H-3d3fdb58d384 |
| 51행 | 별도 조건식 없음 | data.nodes.filter(row => !row.deletedAt && row.role === 'unit' && subjects.some(subject => subject.id === row.subjectId) && (session.subjectId === 'all' \|\| row.subjectId === session.subjectId))<br>call<br>전달 콜백: H-b4b78fef33a6 |
| 58행 | truthy: topic | promptCard(data, topic)<br>call |
| 70행 | 별도 조건식 없음 | Boolean(draft?.body.trim() \|\| draft?.strokes?.length)<br>call |
| 80행 | 별도 조건식 없음 | topics.map(row => row.id).join('\|')<br>call |
| 80행 | 별도 조건식 없음 | topics.map(row => row.id)<br>call<br>전달 콜백: H-9917983da41f |
| 81행 | 별도 조건식 없음 | useEffectEvent(() => { const normalized = recallForDay(session, now); if (!loaded.error && normalized !== session) { persist(normalized); return; } if (session.pendingReview \|\| session.pendingUndo) return; if (loaded.error \|\| topic \|\| !topics.length) return; const eligible = scheduled ? available.filter(row => !(session.skipped ?? []).includes(row.id) && (!session.seen.includes(row.id) \|\| queue.due.includes(row))) : topics; if (!eligible.length) return; persist(scheduled ? { ...session, currentId: eligible[0].id } : nextRecall({ ...session, currentId: null }, topics)); })<br>call<br>전달 콜백: H-a981aa9150b0 |
| 91행 | 별도 조건식 없음 | useEffect(() => { normalizeRecall(); }, [candidatesKey, session.currentId, session.studyDay, session.pendingUndo, session.pendingReview, loaded.error, scheduled, now, data.recallCards, data.recallPreferences])<br>call<br>전달 콜백: H-300cbe97b94e |
| 165행 | truthy: topic | recallPreview(card?.memory, now, recallOptions(data, card?.deckId), card?.reviews)<br>call |
| 165행 | truthy: topic | recallOptions(data, card?.deckId)<br>call |
| 170행 | truthy: topic | (data.memos ?? []).filter(memo => !memo.deletedAt && memo.ownerId === ownerId && memo.id !== draft?.memoId && (topic.topicId ? memo.recallCardId === card?.id \|\| card?.reviews.some(review => review.memoId === memo.id) : !memo.recallCardId \|\| memo.recallCardId === card?.id))<br>    .slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt))<br>mutation-request<br>전달 콜백: H-0af76ee925b6 |
| 170행 | truthy: topic | (data.memos ?? []).filter(memo => !memo.deletedAt && memo.ownerId === ownerId && memo.id !== draft?.memoId && (topic.topicId ? memo.recallCardId === card?.id \|\| card?.reviews.some(review => review.memoId === memo.id) : !memo.recallCardId \|\| memo.recallCardId === card?.id))<br>    .slice()<br>mutation-request |
| 170행 | truthy: topic | (data.memos ?? []).filter(memo => !memo.deletedAt && memo.ownerId === ownerId && memo.id !== draft?.memoId && (topic.topicId ? memo.recallCardId === card?.id \|\| card?.reviews.some(review => review.memoId === memo.id) : !memo.recallCardId \|\| memo.recallCardId === card?.id))<br>call<br>전달 콜백: H-6f3979ea5f0b |
| 179행 | truthy: session.lastReview ∧ falsy: composing \|\| drawing \|\| !!session.pendingReview ∧ truthy: !!repository.getCapabilities | repository.getCapabilities().includes('undoRecallReview')<br>call |
| 179행 | truthy: session.lastReview ∧ falsy: composing \|\| drawing \|\| !!session.pendingReview ∧ truthy: !!repository.getCapabilities | repository.getCapabilities()<br>call |
| 187행 | 별도 조건식 없음 | subjects.map(subject => <option key={subject.id} value={subject.id}>{subject.name}</option>)<br>call<br>전달 콜백: H-94ddfa703dc6 |
| 188행 | 별도 조건식 없음 | subjects.some(row => row.id === session.subjectId)<br>call<br>전달 콜백: H-14befd53f12e |
| 191행 | 별도 조건식 없음 | units.map(unit => <option key={unit.id} value={unit.id}>{unit.name}</option>)<br>call<br>전달 콜백: H-8b7b510a1b81 |
| 192행 | 별도 조건식 없음 | units.some(row => row.id === session.unitId)<br>call<br>전달 콜백: H-c5433498eeaa |
| 196행 | falsy: blocked ∧ truthy: !!repository.getCapabilities | repository.getCapabilities().includes('importRecallCards')<br>call |
| 196행 | falsy: blocked ∧ truthy: !!repository.getCapabilities | repository.getCapabilities()<br>call |
| 197행 | falsy: blocked ∧ truthy: !!repository.getCapabilities | repository.getCapabilities().includes('saveRecallCard')<br>call |
| 197행 | falsy: blocked ∧ truthy: !!repository.getCapabilities | repository.getCapabilities()<br>call |
| 200행 | truthy: topic | [subjects.find(row => row.id === topic.subjectId)?.name, ...recallPath(data.nodes, ownerId!).slice(0, topic.topicId ? undefined : -1).map(row => row.name)].filter(Boolean).join(' / ')<br>call |
| 200행 | truthy: topic | [subjects.find(row => row.id === topic.subjectId)?.name, ...recallPath(data.nodes, ownerId!).slice(0, topic.topicId ? undefined : -1).map(row => row.name)].filter(Boolean)<br>call |
| 200행 | truthy: topic | subjects.find(row => row.id === topic.subjectId)<br>call<br>전달 콜백: H-0f2de5101255 |
| 200행 | truthy: topic | recallPath(data.nodes, ownerId!).slice(0, topic.topicId ? undefined : -1).map(row => row.name)<br>call<br>전달 콜백: H-942220f61690 |
| 200행 | truthy: topic | recallPath(data.nodes, ownerId!).slice(0, topic.topicId ? undefined : -1)<br>call |
| 200행 | truthy: topic | recallPath(data.nodes, ownerId!)<br>call |
| 203행 | truthy: topic | Math.min(topics.length, session.seen.filter(id => topics.some(row => row.id === id)).length + 1)<br>call |
| 203행 | truthy: topic | session.seen.filter(id => topics.some(row => row.id === id))<br>call<br>전달 콜백: H-19264473c57f |
| 203행 | truthy: topic | Math.min(topics.length, session.seen.filter(id => topics.some(row => row.id === id)).length + 1)<br>call |
| 203행 | truthy: topic | session.seen.filter(id => topics.some(row => row.id === id))<br>call<br>전달 콜백: H-405ad91f3c89 |
| 207행 | truthy: topic | storagePrefix(data)<br>call |
| 207행 | truthy: topic | storagePrefix(data)<br>call |
| 224행 | truthy: topic ∧ truthy: scheduled ∧ falsy: revealedId !== topic.id ∧ truthy: card?.cloze | renderCloze(card.cloze.source, card.cloze.number, true)<br>call |
| 225행 | truthy: topic ∧ truthy: scheduled ∧ falsy: revealedId !== topic.id | RECALL_GRADES.map(rating => <Button key={rating} disabled={blocked \|\| !schedulingReady} onClick={() => review(rating)}> {RECALL_LABELS[rating - 1]}<span>{preview && intervalLabel(preview[rating].card.due, now)}</span> </Button>)<br>call<br>전달 콜백: H-26624c166f87 |
| 234행 | truthy: topic ∧ truthy: card?.importSource | occurrenceRows(card.importSource.fields, field => field.name).map(({value: field, key}) => <article key={key}><h3>{field.name}</h3><p>{field.value}</p></article>)<br>call<br>전달 콜백: H-e5404ab6b4c5 |
| 234행 | truthy: topic ∧ truthy: card?.importSource | occurrenceRows(card.importSource.fields, field => field.name)<br>call<br>전달 콜백: H-79e5eb891ab3 |
| 242행 | truthy: topic ∧ truthy: card ∧ falsy: card.memory.state === 0 && !card.manualDue | new Date(card.manualDue ?? card.memory.due).toLocaleString('ko-KR')<br>call |
| 246행 | falsy: topic ∧ truthy: topics.length && scheduled ∧ truthy: queue.nextDue | new Date(queue.nextDue).toLocaleString('ko-KR')<br>call |

반환/조기 중단: 166행 <render> [truthy: loaded.error]; 172행 <render> [별도 조건식 없음]

## H-9022db2f1597

**@callback:useState** · [src/ui/topic-recall.tsx:22](../../../src/ui/topic-recall.tsx#L22)

분기 조건과 가능한 갈림길:

- B-f5f428686ef7 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (23행).
- B-da77a0d16487 · ConditionalExpression · session.currentId → truthy / falsy; 바깥 조건: 별도 조건식 없음 (25행).
- B-d22a858e7d83 · IfStatement · initialMode && !session.pendingReview && !session.pendingUndo && !draft?.body.trim() && !draft?.strokes?.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (26행).
- B-ffbe2e62a080 · CatchClause · error → exception; 바깥 조건: 별도 조건식 없음 (33행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 24행 | 별도 조건식 없음 | recallForDay(readRecall(data), new Date().toISOString())<br>call |
| 24행 | 별도 조건식 없음 | readRecall(data)<br>call |
| 24행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 27행 | truthy: initialMode && !session.pendingReview && !session.pendingUndo && !draft?.body.trim() && !draft?.strokes?.length | recallForDay({ ...session, mode: initialMode, subjectId: 'all', unitId: 'all' }, new Date().toISOString())<br>call |
| 27행 | truthy: initialMode && !session.pendingReview && !session.pendingUndo && !draft?.body.trim() && !draft?.strokes?.length | new Date().toISOString()<br>call |
| 28행 | truthy: initialMode && !session.pendingReview && !session.pendingUndo && !draft?.body.trim() && !draft?.strokes?.length | recallPrompts(data, recallTopics(data,subjectIds,session))<br>call |
| 28행 | truthy: initialMode && !session.pendingReview && !session.pendingUndo && !draft?.body.trim() && !draft?.strokes?.length | recallTopics(data, subjectIds, session)<br>call |
| 28행 | truthy: initialMode && !session.pendingReview && !session.pendingUndo && !draft?.body.trim() && !draft?.strokes?.length | recallQueue(data, pool, new Date().toISOString(), session.skipped)<br>call |
| 28행 | truthy: initialMode && !session.pendingReview && !session.pendingUndo && !draft?.body.trim() && !draft?.strokes?.length | new Date().toISOString()<br>call |
| 33행 | exception: error | freshRecall()<br>call |
| 33행 | exception: error | message(error)<br>call → [H-e62855fe4c8d](ui__topic-recall.md#h-e62855fe4c8d) |

반환/조기 중단: 31행 { session, error: '' } [별도 조건식 없음]; 33행 { session: freshRecall(), error: message(error) } [exception: error]

## H-f381073f36a9

**@callback:useState** · [src/ui/topic-recall.tsx:39](../../../src/ui/topic-recall.tsx#L39)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 39행 | 별도 조건식 없음 | new Date().toISOString()<br>call |

## H-335f1a79d185

**@callback:useEffect** · [src/ui/topic-recall.tsx:44](../../../src/ui/topic-recall.tsx#L44)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 44행 | 별도 조건식 없음 | window.setInterval(() => setNow(new Date().toISOString()), 15000)<br>call<br>전달 콜백: H-01790471f7fa |

반환/조기 중단: 44행 () => window.clearInterval(timer) [별도 조건식 없음]

## H-01790471f7fa

**@callback:window.setInterval** · [src/ui/topic-recall.tsx:44](../../../src/ui/topic-recall.tsx#L44)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 44행 | 별도 조건식 없음 | setNow(new Date().toISOString())<br>state-update |
| 44행 | 별도 조건식 없음 | new Date().toISOString()<br>call |

## H-a169a968daef

**@callback:topics.find** · [src/ui/topic-recall.tsx:49](../../../src/ui/topic-recall.tsx#L49)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3d3fdb58d384

**@callback:data.subjects.filter** · [src/ui/topic-recall.tsx:50](../../../src/ui/topic-recall.tsx#L50)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 50행 | truthy: !row.deletedAt | subjectIds.includes(row.id)<br>call |

## H-b4b78fef33a6

**@callback:data.nodes.filter** · [src/ui/topic-recall.tsx:51](../../../src/ui/topic-recall.tsx#L51)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 51행 | truthy: !row.deletedAt && row.role === 'unit' | subjects.some(subject => subject.id === row.subjectId)<br>call<br>전달 콜백: H-0c1fad40467e |

## H-0c1fad40467e

**@callback:subjects.some** · [src/ui/topic-recall.tsx:51](../../../src/ui/topic-recall.tsx#L51)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-de2b0abe1581

**persist** · [src/ui/topic-recall.tsx:54](../../../src/ui/topic-recall.tsx#L54)

분기 조건과 가능한 갈림길:

- B-b4e96ace8c33 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (55행).
- B-917484423b6a · CatchClause · error → exception; 바깥 조건: 별도 조건식 없음 (56행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 55행 | 별도 조건식 없음 | writeRecall(data, next)<br>call |
| 55행 | 별도 조건식 없음 | setSession(next)<br>state-update |
| 55행 | 별도 조건식 없음 | setError('')<br>state-update |
| 56행 | exception: error | setError(`${message(error)} 전환을 멈췄습니다. 입력한 글은 이 화면에 남아 있습니다.`)<br>state-update |
| 56행 | exception: error | message(error)<br>call → [H-e62855fe4c8d](ui__topic-recall.md#h-e62855fe4c8d) |

반환/조기 중단: 55행 true [별도 조건식 없음]; 56행 false [exception: error]

## H-72ece75840bf

**nextSession** · [src/ui/topic-recall.tsx:60](../../../src/ui/topic-recall.tsx#L60)

분기 조건과 가능한 갈림길:

- B-3f36141c6514 · IfStatement · current.mode !== 'scheduled' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (61행).
- B-e8ac1d699489 · ConditionalExpression · current.currentId → truthy / falsy; 바깥 조건: 별도 조건식 없음 (64행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 61행 | truthy: current.mode !== 'scheduled' | nextRecall(current, recallPrompts(snapshot, recallTopics(snapshot, subjectIds, current), current.deckId))<br>call |
| 61행 | truthy: current.mode !== 'scheduled' | recallPrompts(snapshot, recallTopics(snapshot, subjectIds, current), current.deckId)<br>call |
| 61행 | truthy: current.mode !== 'scheduled' | recallTopics(snapshot, subjectIds, current)<br>call |
| 62행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 62행 | 별도 조건식 없음 | recallForDay(current, at)<br>call |
| 63행 | 별도 조건식 없음 | recallPrompts(snapshot, recallTopics(snapshot, subjectIds, current), current.deckId)<br>call |
| 63행 | 별도 조건식 없음 | recallTopics(snapshot, subjectIds, current)<br>call |
| 63행 | 별도 조건식 없음 | recallQueue(snapshot, pool, at, current.skipped)<br>call |
| 66행 | 별도 조건식 없음 | [...q.due, ...q.fresh].filter(row => !(current.skipped ?? []).includes(row.id) && (!seen.includes(row.id) \|\| q.due.includes(row)))<br>call<br>전달 콜백: H-47b73a724b7a |

반환/조기 중단: 61행 nextRecall(current, recallPrompts(snapshot, recallTopics(snapshot, subjectIds, current), current.deckId)) [truthy: current.mode !== 'scheduled']; 67행 { ...current, currentId: ready[0]?.id ?? null, seen, pendingReview: undefined } [별도 조건식 없음]

## H-47b73a724b7a

**@callback:[...q.due, ...q.fresh].filter** · [src/ui/topic-recall.tsx:66](../../../src/ui/topic-recall.tsx#L66)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 66행 | 별도 조건식 없음 | (current.skipped ?? []).includes(row.id)<br>call |
| 66행 | truthy: !(current.skipped ?? []).includes(row.id) | seen.includes(row.id)<br>call |
| 66행 | truthy: !(current.skipped ?? []).includes(row.id) ∧ falsy: !seen.includes(row.id) | q.due.includes(row)<br>call |

## H-2f18cbb5c607

**answerId** · [src/ui/topic-recall.tsx:71](../../../src/ui/topic-recall.tsx#L71)

분기 조건과 가능한 갈림길:

- B-8fa387e5ac7b · ConditionalExpression · !draft || saved && (saved.body !== body || JSON.stringify(saved.strokes) !== JSON.stringify(strokes)) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (73행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 73행 | falsy: !draft ∧ truthy: saved ∧ falsy: saved.body !== body | JSON.stringify(saved.strokes)<br>call |
| 73행 | falsy: !draft ∧ truthy: saved ∧ falsy: saved.body !== body | JSON.stringify(strokes)<br>call |
| 73행 | truthy: !draft \|\| saved && (saved.body !== body \|\| JSON.stringify(saved.strokes) !== JSON.stringify(strokes)) | crypto.randomUUID()<br>call |

반환/조기 중단: 73행 !draft || saved && (saved.body !== body || JSON.stringify(saved.strokes) !== JSON.stringify(strokes)) ? crypto.randomUUID() : draft.memoId [별도 조건식 없음]

## H-9209e5a7c16b

**changeInk** · [src/ui/topic-recall.tsx:75](../../../src/ui/topic-recall.tsx#L75)

분기 조건과 가능한 갈림길:

- B-408281988698 · IfStatement · !topic → truthy / falsy; 바깥 조건: 별도 조건식 없음 (76행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 77행 | 별도 조건식 없음 | answerId(draft?.body ?? '', strokes)<br>call → [H-2f18cbb5c607](ui__topic-recall.md#h-2f18cbb5c607) |
| 78행 | 별도 조건식 없음 | setSession(next)<br>state-update |
| 78행 | 별도 조건식 없음 | persist(next)<br>call → [H-de2b0abe1581](ui__topic-recall.md#h-de2b0abe1581) |
| 78행 | 별도 조건식 없음 | setNotice('')<br>state-update |

반환/조기 중단: 76행 <render> [truthy: !topic]

## H-9917983da41f

**@callback:topics.map** · [src/ui/topic-recall.tsx:80](../../../src/ui/topic-recall.tsx#L80)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a981aa9150b0

**@callback:useEffectEvent** · [src/ui/topic-recall.tsx:81](../../../src/ui/topic-recall.tsx#L81)

분기 조건과 가능한 갈림길:

- B-6bbbcfeb6749 · IfStatement · !loaded.error && normalized !== session → truthy / falsy; 바깥 조건: 별도 조건식 없음 (83행).
- B-68b9debb04bc · IfStatement · session.pendingReview || session.pendingUndo → truthy / falsy; 바깥 조건: 별도 조건식 없음 (84행).
- B-f3fc06121901 · IfStatement · loaded.error || topic || !topics.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (85행).
- B-69917e6cc5b3 · ConditionalExpression · scheduled → truthy / falsy; 바깥 조건: 별도 조건식 없음 (86행).
- B-4f8732bc3746 · IfStatement · !eligible.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (87행).
- B-9f85ecfc0f2b · ConditionalExpression · scheduled → truthy / falsy; 바깥 조건: 별도 조건식 없음 (88행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 82행 | 별도 조건식 없음 | recallForDay(session, now)<br>call |
| 83행 | truthy: !loaded.error && normalized !== session | persist(normalized)<br>call → [H-de2b0abe1581](ui__topic-recall.md#h-de2b0abe1581) |
| 86행 | truthy: scheduled | available.filter(row => !(session.skipped ?? []).includes(row.id) && (!session.seen.includes(row.id) \|\| queue.due.includes(row)))<br>call<br>전달 콜백: H-8d68fdc0f80a |
| 88행 | 별도 조건식 없음 | persist(scheduled ? { ...session, currentId: eligible[0].id } : nextRecall({ ...session, currentId: null }, topics))<br>call → [H-de2b0abe1581](ui__topic-recall.md#h-de2b0abe1581) |
| 88행 | falsy: scheduled | nextRecall({ ...session, currentId: null }, topics)<br>call |

반환/조기 중단: 83행 <render> [truthy: !loaded.error && normalized !== session]; 84행 <render> [truthy: session.pendingReview || session.pendingUndo]; 85행 <render> [truthy: loaded.error || topic || !topics.length]; 87행 <render> [truthy: !eligible.length]

## H-8d68fdc0f80a

**@callback:available.filter** · [src/ui/topic-recall.tsx:86](../../../src/ui/topic-recall.tsx#L86)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 86행 | truthy: scheduled | (session.skipped ?? []).includes(row.id)<br>call |
| 86행 | truthy: scheduled ∧ truthy: !(session.skipped ?? []).includes(row.id) | session.seen.includes(row.id)<br>call |
| 86행 | truthy: scheduled ∧ truthy: !(session.skipped ?? []).includes(row.id) ∧ falsy: !session.seen.includes(row.id) | queue.due.includes(row)<br>call |

## H-300cbe97b94e

**@callback:useEffect** · [src/ui/topic-recall.tsx:91](../../../src/ui/topic-recall.tsx#L91)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 91행 | 별도 조건식 없음 | normalizeRecall()<br>call |

## H-240b6a916be0

**changeRange** · [src/ui/topic-recall.tsx:92](../../../src/ui/topic-recall.tsx#L92)

분기 조건과 가능한 갈림길:

- B-9ce4e2b44212 · IfStatement · composition.current || drawing || session.pendingReview || session.pendingUndo → truthy / falsy; 바깥 조건: 별도 조건식 없음 (93행).
- B-432b61f8e8c1 · IfStatement · persist(nextSession(next)) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (95행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 95행 | 별도 조건식 없음 | persist(nextSession(next))<br>call → [H-de2b0abe1581](ui__topic-recall.md#h-de2b0abe1581) |
| 95행 | 별도 조건식 없음 | nextSession(next)<br>call → [H-72ece75840bf](ui__topic-recall.md#h-72ece75840bf) |
| 95행 | truthy: persist(nextSession(next)) | setNotice('선택한 범위의 주제로 바꿨습니다.')<br>state-update |

반환/조기 중단: 93행 <render> [truthy: composition.current || drawing || session.pendingReview || session.pendingUndo]

## H-ecfe33cf11c6

**advance** · [src/ui/topic-recall.tsx:97](../../../src/ui/topic-recall.tsx#L97)

분기 조건과 가능한 갈림길:

- B-a5e31430a2d8 · IfStatement · !topic || composition.current || drawing || session.pendingReview || session.pendingUndo → truthy / falsy; 바깥 조건: 별도 조건식 없음 (98행).
- B-83102deb6552 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (99행).
- B-3b5a00c59412 · IfStatement · save && draft → truthy / falsy; 바깥 조건: 별도 조건식 없음 (101행).
- B-31e0d7415aa2 · ConditionalExpression · separate → truthy / falsy; 바깥 조건: truthy: save && draft (102행).
- B-3fec745c782a · IfStatement · separate → truthy / falsy; 바깥 조건: truthy: save && draft (103행).
- B-d5e9ac5570d1 · IfStatement · !persist(next) → truthy / falsy; 바깥 조건: truthy: save && draft ∧ truthy: separate (103행).
- B-dc9574ef3506 · IfStatement · scheduled → truthy / falsy; 바깥 조건: 별도 조건식 없음 (107행).
- B-acc99ff2e7ff · IfStatement · persist(nextSession(next, snapshot)) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (108행).
- B-da93e9620def · ConditionalExpression · save → truthy / falsy; 바깥 조건: truthy: persist(nextSession(next, snapshot)) (109행).
- B-ed384bf1685c · ConditionalExpression · scheduled → truthy / falsy; 바깥 조건: truthy: persist(nextSession(next, snapshot)) ∧ truthy: save (109행).
- B-1fac9cffce15 · ConditionalExpression · hasAnswer → truthy / falsy; 바깥 조건: truthy: persist(nextSession(next, snapshot)) ∧ falsy: save (109행).
- B-5a6848400ab5 · CatchClause · error → exception; 바깥 조건: 별도 조건식 없음 (112행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 102행 | truthy: save && draft ∧ truthy: separate | crypto.randomUUID()<br>call |
| 103행 | truthy: save && draft ∧ truthy: separate | persist(next)<br>call → [H-de2b0abe1581](ui__topic-recall.md#h-de2b0abe1581) |
| 104행 | truthy: save && draft | saveRecallMemo(repository, ownerId!, savedDraft, card?.id)<br>call |
| 104행 | truthy: save && draft | onSaved(saved)<br>call |
| 107행 | truthy: scheduled | recallForDay(next, new Date().toISOString())<br>call |
| 107행 | truthy: scheduled | new Date().toISOString()<br>call |
| 108행 | 별도 조건식 없음 | persist(nextSession(next, snapshot))<br>call → [H-de2b0abe1581](ui__topic-recall.md#h-de2b0abe1581) |
| 108행 | 별도 조건식 없음 | nextSession(next, snapshot)<br>call → [H-72ece75840bf](ui__topic-recall.md#h-72ece75840bf) |
| 109행 | truthy: persist(nextSession(next, snapshot)) | setNotice(save ? scheduled ? '메모를 저장했습니다. 복습 날짜는 바꾸지 않았습니다.' : '메모를 저장했습니다.' : hasAnswer ? '작성한 메모는 초안에 남아 있습니다.' : '다음 주제로 넘어갔습니다.')<br>state-update |
| 112행 | exception: error | setError(message(error))<br>state-update |
| 112행 | exception: error | message(error)<br>call → [H-e62855fe4c8d](ui__topic-recall.md#h-e62855fe4c8d) |

반환/조기 중단: 98행 <render> [truthy: !topic || composition.current || drawing || session.pendingReview || session.pendingUndo]; 103행 <render> [truthy: save && draft ∧ truthy: separate ∧ truthy: !persist(next)]

## H-97abdc3a5da3

**review** · [src/ui/topic-recall.tsx:114](../../../src/ui/topic-recall.tsx#L114)

분기 조건과 가능한 갈림길:

- B-f1afeac2e7bb · IfStatement · !topic || composition.current || drawing || session.pendingUndo || !schedulingReady → truthy / falsy; 바깥 조건: 별도 조건식 없음 (115행).
- B-8ae29770b415 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (116행).
- B-0c9122c2aae0 · ConditionalExpression · hasAnswer && draft → truthy / falsy; 바깥 조건: nullish: session.pendingReview (119행).
- B-9bfdf2c7ee77 · IfStatement · !persist(pending) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (121행).
- B-1ea06d4faa28 · IfStatement · persist(nextSession({ ...pending, drafts, lastReview: { command, expectedVersion, subjectId: session.subjectId, unitId: session.unitId, currentId: topic.id, deckId: session.deckId } }, saved)) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (125행).
- B-a37930e7543b · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (126행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 117행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |
| 118행 | nullish: session.pendingReview ∧ nullish: card?.id | crypto.randomUUID()<br>call |
| 120행 | nullish: session.pendingReview | crypto.randomUUID()<br>call |
| 121행 | 별도 조건식 없음 | persist(pending)<br>call → [H-de2b0abe1581](ui__topic-recall.md#h-de2b0abe1581) |
| 122행 | 별도 조건식 없음 | repository.execute(command)<br>call |
| 122행 | 별도 조건식 없음 | onSaved(saved)<br>call |
| 124행 | 별도 조건식 없음 | saved.recallCards!.find(row => row.id === command.id)<br>call<br>전달 콜백: H-71142b21c5a3 |
| 125행 | 별도 조건식 없음 | persist(nextSession({ ...pending, drafts, lastReview: { command, expectedVersion, subjectId: session.subjectId, unitId: session.unitId, currentId: topic.id, deckId: session.deckId } }, saved))<br>call → [H-de2b0abe1581](ui__topic-recall.md#h-de2b0abe1581) |
| 125행 | 별도 조건식 없음 | nextSession({ ...pending, drafts, lastReview: { command, expectedVersion, subjectId: session.subjectId, unitId: session.unitId, currentId: topic.id, deckId: session.deckId } }, saved)<br>call → [H-72ece75840bf](ui__topic-recall.md#h-72ece75840bf) |
| 125행 | truthy: persist(nextSession({ ...pending, drafts, lastReview: { command, expectedVersion, subjectId: session.subjectId, unitId: session.unitId, currentId: topic.id, deckId: session.deckId } }, saved)) | setRevealedId(null)<br>state-update |
| 125행 | truthy: persist(nextSession({ ...pending, drafts, lastReview: { command, expectedVersion, subjectId: session.subjectId, unitId: session.unitId, currentId: topic.id, deckId: session.deckId } }, saved)) | setNow(new Date().toISOString())<br>state-update |
| 125행 | truthy: persist(nextSession({ ...pending, drafts, lastReview: { command, expectedVersion, subjectId: session.subjectId, unitId: session.unitId, currentId: topic.id, deckId: session.deckId } }, saved)) | new Date().toISOString()<br>call |
| 125행 | truthy: persist(nextSession({ ...pending, drafts, lastReview: { command, expectedVersion, subjectId: session.subjectId, unitId: session.unitId, currentId: topic.id, deckId: session.deckId } }, saved)) | setNotice('설명과 자기 평가를 저장하고 다음 복습을 예약했습니다.')<br>state-update |
| 126행 | exception: e | setError(message(e))<br>state-update |
| 126행 | exception: e | message(e)<br>call → [H-e62855fe4c8d](ui__topic-recall.md#h-e62855fe4c8d) |

반환/조기 중단: 115행 <render> [truthy: !topic || composition.current || drawing || session.pendingUndo || !schedulingReady]; 121행 <render> [truthy: !persist(pending)]

## H-71142b21c5a3

**@callback:saved.recallCards!.find** · [src/ui/topic-recall.tsx:124](../../../src/ui/topic-recall.tsx#L124)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-33af89a5e040

**undoReview** · [src/ui/topic-recall.tsx:128](../../../src/ui/topic-recall.tsx#L128)

분기 조건과 가능한 갈림길:

- B-f5d48c3cad29 · IfStatement · composition.current || drawing || session.pendingReview || !session.lastReview → truthy / falsy; 바깥 조건: 별도 조건식 없음 (129행).
- B-70436177a961 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (130행).
- B-af56632e6f0e · IfStatement · !persist({ ...session, pendingUndo: command }) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (134행).
- B-57fced00fd62 · IfStatement · last.command.memo && !drafts[restoredId] → truthy / falsy; 바깥 조건: 별도 조건식 없음 (137행).
- B-182dd1773ad3 · IfStatement · persist(restored) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (141행).
- B-4cdec79a0520 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (142행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 131행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |
| 133행 | nullish: session.pendingUndo | crypto.randomUUID()<br>call |
| 133행 | nullish: session.pendingUndo | new Date().toISOString()<br>call |
| 134행 | 별도 조건식 없음 | persist({ ...session, pendingUndo: command })<br>call → [H-de2b0abe1581](ui__topic-recall.md#h-de2b0abe1581) |
| 135행 | 별도 조건식 없음 | repository.execute(command)<br>call |
| 135행 | 별도 조건식 없음 | onSaved(saved)<br>call |
| 138행 | 별도 조건식 없음 | recallForDay({ ...session, mode: 'scheduled', subjectId: last.subjectId ?? 'all', unitId: last.unitId ?? 'all', deckId: last.deckId, currentId: restoredId, drafts, seen: session.seen.filter(id => id !== restoredId), skipped: session.skipped?.filter(id => id !== restoredId), lastReview: undefined, pendingUndo: undefined }, new Date().toISOString())<br>call |
| 139행 | 별도 조건식 없음 | session.seen.filter(id => id !== restoredId)<br>call<br>전달 콜백: H-7ec6ddea7de1 |
| 140행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 141행 | 별도 조건식 없음 | persist(restored)<br>call → [H-de2b0abe1581](ui__topic-recall.md#h-de2b0abe1581) |
| 141행 | truthy: persist(restored) | setRevealedId(restoredId)<br>state-update |
| 141행 | truthy: persist(restored) | setNow(new Date().toISOString())<br>state-update |
| 141행 | truthy: persist(restored) | new Date().toISOString()<br>call |
| 141행 | truthy: persist(restored) | setNotice('평가와 복습 날짜를 되돌렸습니다. 저장한 답변 메모는 그대로 남아 있습니다.')<br>state-update |
| 142행 | exception: e | setError(message(e))<br>state-update |
| 142행 | exception: e | message(e)<br>call → [H-e62855fe4c8d](ui__topic-recall.md#h-e62855fe4c8d) |

반환/조기 중단: 129행 <render> [truthy: composition.current || drawing || session.pendingReview || !session.lastReview]; 134행 <render> [truthy: !persist({ ...session, pendingUndo: command })]

## H-7ec6ddea7de1

**@callback:session.seen.filter** · [src/ui/topic-recall.tsx:139](../../../src/ui/topic-recall.tsx#L139)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-5fc904a3f120

**saveReference** · [src/ui/topic-recall.tsx:144](../../../src/ui/topic-recall.tsx#L144)

분기 조건과 가능한 갈림길:

- B-a743253467af · IfStatement · !topic || blocked || !schedulingReady → truthy / falsy; 바깥 조건: 별도 조건식 없음 (145행).
- B-1da2e303f78d · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (146행).
- B-28eb03cece9e · IfStatement · !reference → truthy / falsy; 바깥 조건: 별도 조건식 없음 (147행).
- B-e34aa855be15 · ConditionalExpression · existing?.id === reference.cardId && existing.reference === reference.body → truthy / falsy; 바깥 조건: 별도 조건식 없음 (150행).
- B-4d1bc8e9f4e9 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (153행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 148행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |
| 149행 | 별도 조건식 없음 | promptCard(snapshot, topic)<br>call |
| 150행 | falsy: existing?.id === reference.cardId && existing.reference === reference.body | repository.execute({ type: 'saveRecallReference', id: reference.cardId, topicId: ownerId!, reference: reference.body, expectedVersion: reference.expectedVersion, opId: crypto.randomUUID(), at: new Date().toISOString(), userId: snapshot.userId, namespace: snapshot.namespace })<br>call |
| 151행 | falsy: existing?.id === reference.cardId && existing.reference === reference.body | crypto.randomUUID()<br>call |
| 151행 | falsy: existing?.id === reference.cardId && existing.reference === reference.body | new Date().toISOString()<br>call |
| 152행 | 별도 조건식 없음 | onSaved(saved)<br>call |
| 152행 | 별도 조건식 없음 | persist({ ...session, references })<br>call → [H-de2b0abe1581](ui__topic-recall.md#h-de2b0abe1581) |
| 152행 | 별도 조건식 없음 | setNotice('참고 설명을 저장했습니다.')<br>state-update |
| 153행 | exception: e | setError(message(e))<br>state-update |
| 153행 | exception: e | message(e)<br>call → [H-e62855fe4c8d](ui__topic-recall.md#h-e62855fe4c8d) |

반환/조기 중단: 145행 <render> [truthy: !topic || blocked || !schedulingReady]; 147행 <render> [truthy: !reference]

## H-68c9fea6a2dd

**setDue** · [src/ui/topic-recall.tsx:155](../../../src/ui/topic-recall.tsx#L155)

분기 조건과 가능한 갈림길:

- B-c0c3e01921dd · IfStatement · !topic || blocked || !schedulingReady || !dueDate → truthy / falsy; 바깥 조건: 별도 조건식 없음 (156행).
- B-8e8a8ab5c4dd · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (157행).
- B-799e7f228e10 · IfStatement · !Number.isFinite(due.getTime()) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (158행).
- B-1d5b7528b550 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (163행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 158행 | 별도 조건식 없음 | Number.isFinite(due.getTime())<br>call |
| 158행 | 별도 조건식 없음 | due.getTime()<br>call |
| 159행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |
| 159행 | 별도 조건식 없음 | promptCard(snapshot, topic)<br>call |
| 160행 | 별도 조건식 없음 | repository.execute({ type: 'setRecallDue', id: existing?.id ?? crypto.randomUUID(), topicId: ownerId!, expectedVersion: existing?.version ?? 0, due: due.toISOString(), opId: crypto.randomUUID(), at: new Date().toISOString(), userId: snapshot.userId, namespace: snapshot.namespace })<br>call |
| 160행 | nullish: existing?.id | crypto.randomUUID()<br>call |
| 160행 | 별도 조건식 없음 | due.toISOString()<br>call |
| 161행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 161행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 162행 | 별도 조건식 없음 | onSaved(saved)<br>call |
| 162행 | 별도 조건식 없음 | persist(nextSession(session, saved))<br>call → [H-de2b0abe1581](ui__topic-recall.md#h-de2b0abe1581) |
| 162행 | 별도 조건식 없음 | nextSession(session, saved)<br>call → [H-72ece75840bf](ui__topic-recall.md#h-72ece75840bf) |
| 162행 | 별도 조건식 없음 | setNotice('선택한 날짜로 복습을 예약했습니다. 자기 평가 기록은 추가하지 않았습니다.')<br>state-update |
| 162행 | 별도 조건식 없음 | setDueDate('')<br>state-update |
| 163행 | exception: e | setError(message(e))<br>state-update |
| 163행 | exception: e | message(e)<br>call → [H-e62855fe4c8d](ui__topic-recall.md#h-e62855fe4c8d) |

반환/조기 중단: 156행 <render> [truthy: !topic || blocked || !schedulingReady || !dueDate]

throw: 158행 new Error('복습 날짜를 확인해 주세요.')

## H-cad9129a7224

**@onRetry** · [src/ui/topic-recall.tsx:166](../../../src/ui/topic-recall.tsx#L166)

분기 조건과 가능한 갈림길:

- B-d2ac98ca6be5 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: loaded.error (167행).
- B-43738c13fc32 · CatchClause · error → exception; 바깥 조건: truthy: loaded.error (168행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 167행 | truthy: loaded.error | readRecall(data)<br>call |
| 167행 | truthy: loaded.error | setSession(recovered)<br>state-update |
| 167행 | truthy: loaded.error | setLoaded({ session: recovered, error: '' })<br>state-update |
| 168행 | truthy: loaded.error ∧ exception: error | setLoaded(value => ({ ...value, error: message(error) }))<br>state-update<br>전달 콜백: H-c4152205ae95 |

## H-c4152205ae95

**@callback:setLoaded** · [src/ui/topic-recall.tsx:168](../../../src/ui/topic-recall.tsx#L168)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 168행 | truthy: loaded.error ∧ exception: error | message(error)<br>call → [H-e62855fe4c8d](ui__topic-recall.md#h-e62855fe4c8d) |

## H-6f3979ea5f0b

**@callback:(data.memos ?? []).filter** · [src/ui/topic-recall.tsx:170](../../../src/ui/topic-recall.tsx#L170)

분기 조건과 가능한 갈림길:

- B-c3b6db1353f9 · ConditionalExpression · topic.topicId → truthy / falsy; 바깥 조건: truthy: topic ∧ truthy: !memo.deletedAt && memo.ownerId === ownerId && memo.id !== draft?.memoId (170행).

## H-0af76ee925b6

**@callback:(data.memos ?? []).filter(memo => !memo.deletedAt && memo.ownerId === ownerId && memo.id !== draft?.memoId && (topic.topicId ? memo.recallCardId === card?.id || card?.reviews.some(review => review.memoId === memo.id) : !memo.recallCardId || memo.recallCardId === card?.id))
    .slice().sort** · [src/ui/topic-recall.tsx:171](../../../src/ui/topic-recall.tsx#L171)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 171행 | truthy: topic | b.createdAt.localeCompare(a.createdAt)<br>call |

## H-94e57b87716e

**@onClick** · [src/ui/topic-recall.tsx:175](../../../src/ui/topic-recall.tsx#L175)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 175행 | 별도 조건식 없음 | persist(nextSession({ ...session, mode: 'scheduled', currentId: null, seen: [], skipped: [] }))<br>call → [H-de2b0abe1581](ui__topic-recall.md#h-de2b0abe1581) |
| 175행 | 별도 조건식 없음 | nextSession({ ...session, mode: 'scheduled', currentId: null, seen: [], skipped: [] })<br>call → [H-72ece75840bf](ui__topic-recall.md#h-72ece75840bf) |
| 175행 | 별도 조건식 없음 | setRevealedId(null)<br>state-update |

## H-d28c3103be40

**@onClick** · [src/ui/topic-recall.tsx:176](../../../src/ui/topic-recall.tsx#L176)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 176행 | 별도 조건식 없음 | persist(nextSession({ ...session, mode: 'random', currentId: null, seen: [], skipped: [] }))<br>call → [H-de2b0abe1581](ui__topic-recall.md#h-de2b0abe1581) |
| 176행 | 별도 조건식 없음 | nextSession({ ...session, mode: 'random', currentId: null, seen: [], skipped: [] })<br>call → [H-72ece75840bf](ui__topic-recall.md#h-72ece75840bf) |
| 176행 | 별도 조건식 없음 | setRevealedId(null)<br>state-update |

## H-9256ec50e5de

**@onClick** · [src/ui/topic-recall.tsx:181](../../../src/ui/topic-recall.tsx#L181)

분기 조건과 가능한 갈림길:

- B-8cf0f8427d05 · IfStatement · !repository.getSnapshot().appliedOps[session.pendingUndo!.opId] && persist({ ...session, pendingUndo: undefined }) → truthy / falsy; 바깥 조건: truthy: session.lastReview ∧ truthy: session.pendingUndo && !data.appliedOps[session.pendingUndo.opId] (182행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 182행 | truthy: session.lastReview ∧ truthy: session.pendingUndo && !data.appliedOps[session.pendingUndo.opId] | repository.getSnapshot()<br>call |
| 182행 | truthy: session.lastReview ∧ truthy: session.pendingUndo && !data.appliedOps[session.pendingUndo.opId] ∧ truthy: !repository.getSnapshot().appliedOps[session.pendingUndo!.opId] | persist({ ...session, pendingUndo: undefined })<br>call → [H-de2b0abe1581](ui__topic-recall.md#h-de2b0abe1581) |
| 182행 | truthy: session.lastReview ∧ truthy: session.pendingUndo && !data.appliedOps[session.pendingUndo.opId] ∧ truthy: !repository.getSnapshot().appliedOps[session.pendingUndo!.opId] && persist({ ...session, pendingUndo: undefined }) | setNotice('저장되지 않은 되돌리기를 취소했습니다.')<br>state-update |

## H-621a3f3696ae

**@onChange** · [src/ui/topic-recall.tsx:186](../../../src/ui/topic-recall.tsx#L186)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 186행 | 별도 조건식 없음 | changeRange(event.target.value, 'all')<br>call → [H-240b6a916be0](ui__topic-recall.md#h-240b6a916be0) |

## H-94ddfa703dc6

**@callback:subjects.map** · [src/ui/topic-recall.tsx:187](../../../src/ui/topic-recall.tsx#L187)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-14befd53f12e

**@callback:subjects.some** · [src/ui/topic-recall.tsx:188](../../../src/ui/topic-recall.tsx#L188)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e9230a1c2951

**@onChange** · [src/ui/topic-recall.tsx:190](../../../src/ui/topic-recall.tsx#L190)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 190행 | 별도 조건식 없음 | changeRange(session.subjectId, event.target.value)<br>call → [H-240b6a916be0](ui__topic-recall.md#h-240b6a916be0) |

## H-8b7b510a1b81

**@callback:units.map** · [src/ui/topic-recall.tsx:191](../../../src/ui/topic-recall.tsx#L191)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c5433498eeaa

**@callback:units.some** · [src/ui/topic-recall.tsx:192](../../../src/ui/topic-recall.tsx#L192)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a827a1d81a65

**@onChange** · [src/ui/topic-recall.tsx:195](../../../src/ui/topic-recall.tsx#L195)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 195행 | 별도 조건식 없음 | persist(nextSession({ ...session, deckId, currentId: null, seen: [], skipped: [] }))<br>call → [H-de2b0abe1581](ui__topic-recall.md#h-de2b0abe1581) |
| 195행 | 별도 조건식 없음 | nextSession({ ...session, deckId, currentId: null, seen: [], skipped: [] })<br>call → [H-72ece75840bf](ui__topic-recall.md#h-72ece75840bf) |
| 195행 | 별도 조건식 없음 | setRevealedId(null)<br>state-update |

## H-0f2de5101255

**@callback:subjects.find** · [src/ui/topic-recall.tsx:200](../../../src/ui/topic-recall.tsx#L200)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-942220f61690

**@callback:recallPath(data.nodes, ownerId!).slice(0, topic.topicId ? undefined : -1).map** · [src/ui/topic-recall.tsx:200](../../../src/ui/topic-recall.tsx#L200)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-19264473c57f

**@callback:session.seen.filter** · [src/ui/topic-recall.tsx:203](../../../src/ui/topic-recall.tsx#L203)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 203행 | truthy: topic | topics.some(row => row.id === id)<br>call<br>전달 콜백: H-b10e21b16341 |

## H-b10e21b16341

**@callback:topics.some** · [src/ui/topic-recall.tsx:203](../../../src/ui/topic-recall.tsx#L203)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-405ad91f3c89

**@callback:session.seen.filter** · [src/ui/topic-recall.tsx:203](../../../src/ui/topic-recall.tsx#L203)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 203행 | truthy: topic | topics.some(row => row.id === id)<br>call<br>전달 콜백: H-99531fc7edab |

## H-99531fc7edab

**@callback:topics.some** · [src/ui/topic-recall.tsx:203](../../../src/ui/topic-recall.tsx#L203)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-37c506a31275

**@onRecognizedText** · [src/ui/topic-recall.tsx:207](../../../src/ui/topic-recall.tsx#L207)

분기 조건과 가능한 갈림길:

- B-01864c95d139 · IfStatement · topic → truthy / falsy; 바깥 조건: truthy: topic (207행).
- B-836bbceb96d7 · ConditionalExpression · draft?.body ?? '' → truthy / falsy; 바깥 조건: truthy: topic ∧ truthy: topic (207행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 207행 | truthy: topic ∧ truthy: topic | persist({...session,drafts:{...session.drafts,[topic.id]:{...draft,memoId:answerId((draft?.body ?? '')+text,draft?.strokes ?? []),body:(draft?.body ?? '')+((draft?.body ?? '') ? '\n':'')+text,strokes:draft?.strokes ?? []}}})<br>call → [H-de2b0abe1581](ui__topic-recall.md#h-de2b0abe1581) |
| 207행 | truthy: topic ∧ truthy: topic | answerId((draft?.body ?? '')+text, draft?.strokes ?? [])<br>call → [H-2f18cbb5c607](ui__topic-recall.md#h-2f18cbb5c607) |

## H-3f7faa8677f4

**@onWorkspaceSaved** · [src/ui/topic-recall.tsx:207](../../../src/ui/topic-recall.tsx#L207)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 207행 | truthy: topic | onSaved(repository.getSnapshot())<br>call |
| 207행 | truthy: topic | repository.getSnapshot()<br>call |

## H-5682227cdb09

**@onCompositionStart** · [src/ui/topic-recall.tsx:211](../../../src/ui/topic-recall.tsx#L211)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 211행 | truthy: topic | setComposing(true)<br>state-update |

## H-611787755a11

**@onCompositionEnd** · [src/ui/topic-recall.tsx:211](../../../src/ui/topic-recall.tsx#L211)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 211행 | truthy: topic | setComposing(false)<br>state-update |

## H-5913e28b87fd

**@onChange** · [src/ui/topic-recall.tsx:212](../../../src/ui/topic-recall.tsx#L212)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 213행 | truthy: topic | answerId(event.target.value, draft?.strokes ?? [])<br>call → [H-2f18cbb5c607](ui__topic-recall.md#h-2f18cbb5c607) |
| 214행 | truthy: topic | setSession(next)<br>state-update |
| 214행 | truthy: topic | persist(next)<br>call → [H-de2b0abe1581](ui__topic-recall.md#h-de2b0abe1581) |
| 214행 | truthy: topic | setNotice('')<br>state-update |

## H-e4b0d9f16fe9

**@onClick** · [src/ui/topic-recall.tsx:218](../../../src/ui/topic-recall.tsx#L218)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 218행 | truthy: topic | advance(true)<br>call → [H-ecfe33cf11c6](ui__topic-recall.md#h-ecfe33cf11c6) |

## H-3b9ba5cd327e

**@onClick** · [src/ui/topic-recall.tsx:219](../../../src/ui/topic-recall.tsx#L219)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 219행 | truthy: topic | advance(false)<br>call → [H-ecfe33cf11c6](ui__topic-recall.md#h-ecfe33cf11c6) |

## H-800b6631be7c

**@onClick** · [src/ui/topic-recall.tsx:223](../../../src/ui/topic-recall.tsx#L223)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 223행 | truthy: topic ∧ truthy: scheduled ∧ truthy: revealedId !== topic.id | setRevealedId(topic.id)<br>state-update |

## H-26624c166f87

**@callback:RECALL_GRADES.map** · [src/ui/topic-recall.tsx:225](../../../src/ui/topic-recall.tsx#L225)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 226행 | truthy: topic ∧ truthy: scheduled ∧ falsy: revealedId !== topic.id ∧ truthy: preview | intervalLabel(preview[rating].card.due, now)<br>call |

## H-0a4ac819b257

**@onClick** · [src/ui/topic-recall.tsx:225](../../../src/ui/topic-recall.tsx#L225)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 225행 | truthy: topic ∧ truthy: scheduled ∧ falsy: revealedId !== topic.id | review(rating)<br>call → [H-97abdc3a5da3](ui__topic-recall.md#h-97abdc3a5da3) |

## H-a7bb1a9bb145

**@onClick** · [src/ui/topic-recall.tsx:230](../../../src/ui/topic-recall.tsx#L230)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 230행 | truthy: topic ∧ truthy: scheduled ∧ truthy: session.pendingReview | review(session.pendingReview!.rating)<br>call → [H-97abdc3a5da3](ui__topic-recall.md#h-97abdc3a5da3) |

## H-a9a9016c1cf1

**@onClick** · [src/ui/topic-recall.tsx:231](../../../src/ui/topic-recall.tsx#L231)

분기 조건과 가능한 갈림길:

- B-3079f3bee289 · IfStatement · !repository.getSnapshot().appliedOps[session.pendingReview!.opId] && persist({ ...session, pendingReview: undefined }) → truthy / falsy; 바깥 조건: truthy: topic ∧ truthy: scheduled ∧ truthy: session.pendingReview ∧ truthy: !data.appliedOps[session.pendingReview.opId] (231행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 231행 | truthy: topic ∧ truthy: scheduled ∧ truthy: session.pendingReview ∧ truthy: !data.appliedOps[session.pendingReview.opId] | repository.getSnapshot()<br>call |
| 231행 | truthy: topic ∧ truthy: scheduled ∧ truthy: session.pendingReview ∧ truthy: !data.appliedOps[session.pendingReview.opId] ∧ truthy: !repository.getSnapshot().appliedOps[session.pendingReview!.opId] | persist({ ...session, pendingReview: undefined })<br>call → [H-de2b0abe1581](ui__topic-recall.md#h-de2b0abe1581) |
| 231행 | truthy: topic ∧ truthy: scheduled ∧ truthy: session.pendingReview ∧ truthy: !data.appliedOps[session.pendingReview.opId] ∧ truthy: !repository.getSnapshot().appliedOps[session.pendingReview!.opId] && persist({ ...session, pendingReview: undefined }) | setRevealedId(null)<br>state-update |
| 231행 | truthy: topic ∧ truthy: scheduled ∧ truthy: session.pendingReview ∧ truthy: !data.appliedOps[session.pendingReview.opId] ∧ truthy: !repository.getSnapshot().appliedOps[session.pendingReview!.opId] && persist({ ...session, pendingReview: undefined }) | setNotice('저장되지 않은 평가를 취소했습니다. 설명 초안은 남아 있습니다.')<br>state-update |

## H-79e5eb891ab3

**@callback:occurrenceRows** · [src/ui/topic-recall.tsx:234](../../../src/ui/topic-recall.tsx#L234)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e5404ab6b4c5

**@callback:occurrenceRows(card.importSource.fields, field => field.name).map** · [src/ui/topic-recall.tsx:234](../../../src/ui/topic-recall.tsx#L234)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c61f9daea738

**@onCompositionStart** · [src/ui/topic-recall.tsx:237](../../../src/ui/topic-recall.tsx#L237)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 237행 | truthy: topic | setComposing(true)<br>state-update |

## H-b4f2f61c2d3b

**@onCompositionEnd** · [src/ui/topic-recall.tsx:237](../../../src/ui/topic-recall.tsx#L237)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 237행 | truthy: topic | setComposing(false)<br>state-update |

## H-29ca839ced24

**@onChange** · [src/ui/topic-recall.tsx:238](../../../src/ui/topic-recall.tsx#L238)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 238행 | truthy: topic ∧ nullish: old?.cardId ?? card?.id | crypto.randomUUID()<br>call |
| 238행 | truthy: topic | setSession(next)<br>state-update |
| 238행 | truthy: topic | persist(next)<br>call → [H-de2b0abe1581](ui__topic-recall.md#h-de2b0abe1581) |

## H-8e87bf4f626e

**@onChange** · [src/ui/topic-recall.tsx:241](../../../src/ui/topic-recall.tsx#L241)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 241행 | truthy: topic | setDueDate(e.target.value)<br>state-update |

## H-7764d600cb10

**@onClick** · [src/ui/topic-recall.tsx:246](../../../src/ui/topic-recall.tsx#L246)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 246행 | falsy: topic ∧ truthy: topics.length > 0 && scheduled | persist(nextSession({ ...session, currentId: null, seen: [], skipped: [] }))<br>call → [H-de2b0abe1581](ui__topic-recall.md#h-de2b0abe1581) |
| 246행 | falsy: topic ∧ truthy: topics.length > 0 && scheduled | nextSession({ ...session, currentId: null, seen: [], skipped: [] })<br>call → [H-72ece75840bf](ui__topic-recall.md#h-72ece75840bf) |

## H-bb3f6e94ecb2

**@onClick** · [src/ui/topic-recall.tsx:247](../../../src/ui/topic-recall.tsx#L247)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 247행 | truthy: error | persist(session)<br>call → [H-de2b0abe1581](ui__topic-recall.md#h-de2b0abe1581) |

## H-764f7f1a35f1

**@onClick** · [src/ui/topic-recall.tsx:247](../../../src/ui/topic-recall.tsx#L247)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 247행 | truthy: error ∧ truthy: topic && hasAnswer | advance(true, true)<br>call → [H-ecfe33cf11c6](ui__topic-recall.md#h-ecfe33cf11c6) |

