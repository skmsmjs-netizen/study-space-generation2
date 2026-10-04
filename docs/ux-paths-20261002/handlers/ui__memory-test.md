# src/ui/memory-test.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-cd475d97cdd6

**message** · [src/ui/memory-test.tsx:35](../../../src/ui/memory-test.tsx#L35)

분기 조건과 가능한 갈림길:

- B-4c69e8135155 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: 별도 조건식 없음 (36행).

## H-51d98e02134f

**Ink** · [src/ui/memory-test.tsx:44](../../../src/ui/memory-test.tsx#L44)

분기 조건과 가능한 갈림길:

- B-bbe153373a1a · ConditionalExpression · strokes.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (45행).

반환/조기 중단: 45행 strokes.length ? <InkPreview strokes={strokes} label={label} /> : null [별도 조건식 없음]

## H-14928c44739d

**Summary** · [src/ui/memory-test.tsx:47](../../../src/ui/memory-test.tsx#L47)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 48행 | 별도 조건식 없음 | memorySummary(questions)<br>call |
| 53행 | 별도 조건식 없음 | [<br>          ['맞음', s.correct],<br>          ['부분적으로 맞음', s.partial],<br>          ['틀림', s.wrong],<br>          ['판단 보류', s.uncertain],<br>          ['미판정', s.unassessed],<br>        ].map(([label, count]) => ( <div key={label}> <dt>{label}</dt> <dd>{count}</dd> </div> ))<br>call<br>전달 콜백: H-e5eae7375747 |

반환/조기 중단: 49행 <render> [별도 조건식 없음]

## H-e5eae7375747

**@callback:[
          ['맞음', s.correct],
          ['부분적으로 맞음', s.partial],
          ['틀림', s.wrong],
          ['판단 보류', s.uncertain],
          ['미판정', s.unassessed],
        ].map** · [src/ui/memory-test.tsx:59](../../../src/ui/memory-test.tsx#L59)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b21ce07a7b6d

**MemoryTests** · [src/ui/memory-test.tsx:69](../../../src/ui/memory-test.tsx#L69)

분기 조건과 가능한 갈림길:

- B-bdfa77a54d42 · ConditionalExpression · draft.phase === 'review' || draft.phase === 'saved' → truthy / falsy; 바깥 조건: nullish: history?.questions (237행).
- B-58ccf74580a9 · ConditionalExpression · connectionOpen → truthy / falsy; 바깥 조건: truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) (358행).
- B-f8a3606c81aa · ConditionalExpression · attempt.index < attempt.questions.length - 1 → truthy / falsy; 바깥 조건: truthy: draft.phase === 'testing' && question && attempt (690행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 84행 | 별도 조건식 없음 | useState(() => { let key = ''; try { key = memoryDraftKey(data); return { key, ...readMemoryDraft(key), error: '' }; } catch (e) { return { key, raw: null, draft: null, error: message(e) }; } })<br>call<br>전달 콜백: H-1226d335e320 |
| 93행 | 별도 조건식 없음 | useState(boot.draft ?? freshMemoryDraft(initialTopicId))<br>call |
| 93행 | nullish: boot.draft | freshMemoryDraft(initialTopicId)<br>preservation-boundary |
| 94행 | 별도 조건식 없음 | useRef(draft)<br>call |
| 95행 | 별도 조건식 없음 | useRef(boot.raw)<br>call |
| 96행 | 별도 조건식 없음 | useRef(Boolean(boot.error))<br>call |
| 96행 | 별도 조건식 없음 | Boolean(boot.error)<br>call |
| 97행 | 별도 조건식 없음 | useState(Boolean(boot.error))<br>call |
| 97행 | 별도 조건식 없음 | Boolean(boot.error)<br>call |
| 98행 | 별도 조건식 없음 | useState(boot.error)<br>call |
| 99행 | 별도 조건식 없음 | useState('')<br>call |
| 100행 | 별도 조건식 없음 | useState(false)<br>call |
| 101행 | 별도 조건식 없음 | useState(false)<br>call |
| 102행 | 별도 조건식 없음 | useState(false)<br>call |
| 103행 | 별도 조건식 없음 | useState(false)<br>call |
| 104행 | 별도 조건식 없음 | useState(() => data.memoryTests?.find((t) => t.id === resultId && !t.deletedAt) ?? null)<br>call<br>전달 콜백: H-60c51f4f5280 |
| 107행 | 별도 조건식 없음 | useRef(null)<br>call |
| 108행 | 별도 조건식 없음 | data.subjects.filter((s) => subjectIds.includes(s.id) && !s.deletedAt)<br>call<br>전달 콜백: H-4af6af967e88 |
| 109행 | 별도 조건식 없음 | data.nodes.filter((n) => n.role === 'topic' && !n.deletedAt && subjects.some((s) => s.id === n.subjectId) && (!draft.subjectId \|\| draft.subjectId === n.subjectId))<br>call<br>전달 콜백: H-538c28f9c8a7 |
| 116행 | 별도 조건식 없음 | memoryCardsInScope(data, subjectIds, draft.subjectId, draft.topicId)<br>call |
| 119행 | falsy: !repository.getCapabilities | ['saveMemoryCard', 'saveMemoryTest'].every((type) => repository.getCapabilities?.().includes(type))<br>call<br>전달 콜백: H-6b1e13d0c6a8 |
| 144행 | 별도 조건식 없음 | useEffect(() => { heading.current?.focus({ preventScroll: true }); }, [draft.phase, draft.attempt?.index])<br>call<br>전달 콜백: H-f17d058af93f |
| 217행 | 별도 조건식 없음 | (data.memoryTests ?? [])<br>    .filter(<br>      (t) =><br>        !t.deletedAt &&<br>        t.questions.some((q) =><br>          data.nodes.some((n) => n.id === q.topicId && subjectIds.includes(n.subjectId)),<br>        ),<br>    )<br>    .slice()<br>    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))<br>mutation-request<br>전달 콜백: H-23b4f015d6f1 |
| 217행 | 별도 조건식 없음 | (data.memoryTests ?? [])<br>    .filter(<br>      (t) =><br>        !t.deletedAt &&<br>        t.questions.some((q) =><br>          data.nodes.some((n) => n.id === q.topicId && subjectIds.includes(n.subjectId)),<br>        ),<br>    )<br>    .slice()<br>mutation-request |
| 217행 | 별도 조건식 없음 | (data.memoryTests ?? [])<br>    .filter((t) => !t.deletedAt && t.questions.some((q) => data.nodes.some((n) => n.id === q.topicId && subjectIds.includes(n.subjectId)), ))<br>call<br>전달 콜백: H-3279896c649e |
| 293행 | truthy: draft.phase === 'library' && !history ∧ falsy: busy | Boolean(draft.editor)<br>call |
| 297행 | truthy: draft.phase === 'library' && !history | subjects.map((s) => ( <option key={s.id} value={s.id}> {s.name} </option> ))<br>call<br>전달 콜백: H-1904b1bbc81a |
| 306행 | truthy: draft.phase === 'library' && !history ∧ falsy: busy | Boolean(draft.editor)<br>call |
| 310행 | truthy: draft.phase === 'library' && !history | topics.map((t) => ( <option key={t.id} value={t.id}> {t.name} </option> ))<br>call<br>전달 콜백: H-117f37866f1d |
| 322행 | truthy: draft.phase === 'library' && !history | [1, 3, 5, 10, 20, 50].map((n) => ( <option key={n} value={n}> {n}개 </option> ))<br>call<br>전달 콜백: H-11b8df269a9e |
| 332행 | truthy: draft.phase === 'library' && !history ∧ falsy: busy \|\| !cards.length | Boolean(draft.editor)<br>call |
| 338행 | truthy: draft.phase === 'library' && !history ∧ falsy: busy \|\| !topics.length | Boolean(draft.editor)<br>call |
| 356행 | truthy: draft.phase === 'library' && !history | canUseOwnerAI(data)<br>call |
| 362행 | truthy: draft.phase === 'library' && !history | Math.min(cards.length, draft.count)<br>call |
| 364행 | truthy: draft.phase === 'library' && !history | canUseOwnerAI(data)<br>call |
| 380행 | truthy: draft.phase === 'library' && !history | canUseOwnerAI(data)<br>call |
| 388행 | truthy: draft.phase === 'library' && !history | canUseOwnerAI(data)<br>call |
| 435행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor | topics.map((t) => ( <option key={t.id} value={t.id}> {t.name} </option> ))<br>call<br>전달 콜백: H-57b076480d52 |
| 440행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor | topics.some((t) => t.id === draft.editor?.topicId)<br>call<br>전달 콜백: H-9715685c9618 |
| 478행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor | storagePrefix(data)<br>call |
| 479행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor | storagePrefix(data)<br>call |
| 520행 | truthy: draft.phase === 'library' && !history | cards.map((c) => ( <article key={c.id}> <div> <strong> <StudyResultText text={c.question} as="span" /> </strong> <MemoryCardOrigin data={data} card={c} /> <p className="muted">{data.nodes.find((n) => n.id === c.topicId)?.name}</p> {c.topicGeneration && <p className="muted">주제 기반 생성 · 답안 확인 후 등록</p>} </div> <Button disabled={busy \|\| Boolean(draft.editor)} onClick={() => persist({ ...draft, editor: { id: c.id, baseVersion: c.version, topicId: c.topicId, question: c.question, answer: c.answer, strokes: structuredClone(c.strokes), ...(c.topicGeneration ? { topicGeneration: structuredClone(c.topicGeneration) } : {}), ...(c.materialSource ? { materialSource: structuredClone(c.materialSource) } : {}), }, })  … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-28a66408d38f |
| 557행 | truthy: draft.phase === 'library' && !history | (data.memoryCards ?? []).some((c) => c.deletedAt)<br>call<br>전달 콜백: H-04b5f9e6b3d1 |
| 560행 | truthy: draft.phase === 'library' && !history ∧ truthy: (data.memoryCards ?? []).some((c) => c.deletedAt) | (data.memoryCards ?? [])<br>                .filter(<br>                  (c) =><br>                    c.deletedAt &&<br>                    data.nodes.some((n) => n.id === c.topicId && subjectIds.includes(n.subjectId)),<br>                )<br>                .map((c) => ( <article key={c.id}> <StudyResultText text={c.question} /> <Button disabled={busy \|\| !capability} onClick={() => { try { onSaved( repository.execute({ type: 'restoreMemoryCard', id: c.id, expectedVersion: c.version, userId: data.userId, namespace: data.namespace, opId: crypto.randomUUID(), at: new Date().toISOString(), }), ); } catch (e) { setError(message(e)); } }} > 복원 </Button> </article> ))<br>mutation-request<br>전달 콜백: H-183fd9952e71 |
| 560행 | truthy: draft.phase === 'library' && !history ∧ truthy: (data.memoryCards ?? []).some((c) => c.deletedAt) | (data.memoryCards ?? [])<br>                .filter((c) => c.deletedAt && data.nodes.some((n) => n.id === c.topicId && subjectIds.includes(n.subjectId)))<br>call<br>전달 콜백: H-c885008c1df4 |
| 630행 | truthy: draft.phase === 'library' && !history ∧ truthy: !!savedTests.length | savedTests.map((t) => ( <article key={t.id}> <p> {new Date(t.startedAt).toLocaleString('ko-KR')} · {t.questions.length}문항 </p> <Summary questions={t.questions} /> <Button disabled={busy \|\| Boolean(draft.editor)} onClick={() => setHistory(t)}> 답안과 결과 보기 </Button> </article> ))<br>call<br>전달 콜백: H-993bc802715b |
| 668행 | truthy: draft.phase === 'testing' && question && attempt | storagePrefix(data)<br>call |
| 669행 | truthy: draft.phase === 'testing' && question && attempt | storagePrefix(data)<br>call |
| 742행 | truthy: review | review.map((q, index) => ( <article className="memory-review memory-review-result" key={q.cardId}> <header className="memory-review-heading"> <span className="memory-question-number">문항 {index + 1}</span> <h3> <StudyResultText text={q.question} as="span" /> </h3> <p className="muted">{q.topicName}</p> </header> <div className="memory-comparison"> <section aria-label={`${index + 1}번 내 답안`}> <strong>내 답안</strong> <StudyResultText text={q.response \|\| (!q.responseStrokes.length ? '답하지 않음' : '')} /> <Ink strokes={q.responseStrokes} label="내 답안 그림" /> </section> <section aria-label={`${index + 1}번 기준 답안`}> <strong>기준 답안</strong> <StudyResultText text={q.answer} /> <p className="memory-answer-caption">출제 당시의  … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-1b1bcfd463a1 |
| 819행 | truthy: review ∧ truthy: draft.phase === 'saved' \|\| history ∧ falsy: busy | review.some((q) => q.verdict === 'wrong' \|\| q.verdict === 'partial')<br>call<br>전달 콜백: H-2c1aa7cec243 |

반환/조기 중단: 238행 <render> [별도 조건식 없음]

## H-1226d335e320

**@callback:useState** · [src/ui/memory-test.tsx:84](../../../src/ui/memory-test.tsx#L84)

분기 조건과 가능한 갈림길:

- B-6027b8b7b564 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (86행).
- B-f1d996c8f5a5 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (89행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 87행 | 별도 조건식 없음 | memoryDraftKey(data)<br>preservation-boundary |
| 88행 | 별도 조건식 없음 | readMemoryDraft(key)<br>preservation-boundary |
| 90행 | exception: e | message(e)<br>call → [H-cd475d97cdd6](ui__memory-test.md#h-cd475d97cdd6) |

반환/조기 중단: 88행 { key, ...readMemoryDraft(key), error: '' } [별도 조건식 없음]; 90행 { key, raw: null, draft: null, error: message(e) } [exception: e]

## H-60c51f4f5280

**@callback:useState** · [src/ui/memory-test.tsx:105](../../../src/ui/memory-test.tsx#L105)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4af6af967e88

**@callback:data.subjects.filter** · [src/ui/memory-test.tsx:108](../../../src/ui/memory-test.tsx#L108)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 108행 | 별도 조건식 없음 | subjectIds.includes(s.id)<br>call |

## H-538c28f9c8a7

**@callback:data.nodes.filter** · [src/ui/memory-test.tsx:110](../../../src/ui/memory-test.tsx#L110)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 113행 | truthy: n.role === 'topic' &&<br>      !n.deletedAt | subjects.some((s) => s.id === n.subjectId)<br>call<br>전달 콜백: H-cf8781b67808 |

## H-cf8781b67808

**@callback:subjects.some** · [src/ui/memory-test.tsx:113](../../../src/ui/memory-test.tsx#L113)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6b1e13d0c6a8

**@callback:['saveMemoryCard', 'saveMemoryTest'].every** · [src/ui/memory-test.tsx:119](../../../src/ui/memory-test.tsx#L119)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-2c1ca092f050

**persist** · [src/ui/memory-test.tsx:123](../../../src/ui/memory-test.tsx#L123)

분기 조건과 가능한 갈림길:

- B-e0add9b1a1c5 · IfStatement · blockedRef.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (124행).
- B-a4c6f07ad819 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (128행).
- B-447994281217 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (132행).
- B-cfc8047f9109 · IfStatement · message(e).includes('다른 창') → truthy / falsy; 바깥 조건: exception: e (133행).
- B-40239f3f33b5 · ConditionalExpression · draftHasUnstoredText(boot.key) → truthy / falsy; 바깥 조건: exception: e (138행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 126행 | 별도 조건식 없음 | setDraft(next)<br>state-update |
| 127행 | 별도 조건식 없음 | setNotice('')<br>state-update |
| 129행 | 별도 조건식 없음 | writeMemoryDraft(boot.key, next, raw.current)<br>preservation-boundary |
| 130행 | 별도 조건식 없음 | setError('')<br>state-update |
| 133행 | exception: e | message(e).includes('다른 창')<br>call |
| 133행 | exception: e | message(e)<br>call → [H-cd475d97cdd6](ui__memory-test.md#h-cd475d97cdd6) |
| 135행 | exception: e ∧ truthy: message(e).includes('다른 창') | setBlocked(true)<br>state-update |
| 136행 | exception: e ∧ falsy: message(e).includes('다른 창') | JSON.stringify(next)<br>call |
| 137행 | exception: e | setError(`${message(e)}${draftHasUnstoredText(boot.key) ? ' 최신 입력은 현재 창에 유지했습니다. 저장을 다시 시도하거나 파일로 보관해 주세요.' : ''}`)<br>state-update |
| 138행 | exception: e | message(e)<br>call → [H-cd475d97cdd6](ui__memory-test.md#h-cd475d97cdd6) |
| 138행 | exception: e | draftHasUnstoredText(boot.key)<br>preservation-boundary |

반환/조기 중단: 124행 false [truthy: blockedRef.current]; 131행 true [별도 조건식 없음]; 140행 false [exception: e]

## H-f17d058af93f

**@callback:useEffect** · [src/ui/memory-test.tsx:144](../../../src/ui/memory-test.tsx#L144)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-06ced3dcb1b1

**saveEditor** · [src/ui/memory-test.tsx:147](../../../src/ui/memory-test.tsx#L147)

분기 조건과 가능한 갈림길:

- B-bc46cc8b28d1 · IfStatement · busy || !current.current.editor → truthy / falsy; 바깥 조건: 별도 조건식 없음 (148행).
- B-d389c9848f67 · IfStatement · !persist(current.current) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (149행).
- B-4c96d062fd7b · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (150행).
- B-31a468e36435 · IfStatement · persist({ ...current.current, editor: null }) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (153행).
- B-5db53b079b18 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (155행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 149행 | 별도 조건식 없음 | persist(current.current)<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |
| 151행 | 별도 조건식 없음 | saveMemoryEditor(repository, current.current.editor)<br>call |
| 152행 | 별도 조건식 없음 | onSaved(next)<br>call |
| 153행 | 별도 조건식 없음 | persist({ ...current.current, editor: null })<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |
| 154행 | truthy: persist({ ...current.current, editor: null }) | setNotice('암기 항목을 이 기기에 저장했습니다.')<br>state-update |
| 156행 | exception: e | setError(message(e))<br>state-update |
| 156행 | exception: e | message(e)<br>call → [H-cd475d97cdd6](ui__memory-test.md#h-cd475d97cdd6) |

반환/조기 중단: 148행 <render> [truthy: busy || !current.current.editor]; 149행 <render> [truthy: !persist(current.current)]

## H-53a42606f791

**patchEditor** · [src/ui/memory-test.tsx:159](../../../src/ui/memory-test.tsx#L159)

분기 조건과 가능한 갈림길:

- B-ab77c934d3f9 · IfStatement · now.editor → truthy / falsy; 바깥 조건: 별도 조건식 없음 (161행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 161행 | truthy: now.editor | persist({ ...now, editor: { ...now.editor, ...patch } })<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |

## H-e44441b0f015

**patchQuestion** · [src/ui/memory-test.tsx:163](../../../src/ui/memory-test.tsx#L163)

분기 조건과 가능한 갈림길:

- B-78f606495686 · IfStatement · !now.attempt → truthy / falsy; 바깥 조건: 별도 조건식 없음 (165행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 166행 | 별도 조건식 없음 | persist({ ...now, attempt: { ...now.attempt, questions: now.attempt.questions.map((q, i) => (i === index ? { ...q, ...patch } : q)), }, })<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |
| 170행 | 별도 조건식 없음 | now.attempt.questions.map((q, i) => (i === index ? { ...q, ...patch } : q))<br>call<br>전달 콜백: H-47a65ffbfda6 |

반환/조기 중단: 165행 <render> [truthy: !now.attempt]

## H-47a65ffbfda6

**@callback:now.attempt.questions.map** · [src/ui/memory-test.tsx:170](../../../src/ui/memory-test.tsx#L170)

분기 조건과 가능한 갈림길:

- B-8281ac673232 · ConditionalExpression · i === index → truthy / falsy; 바깥 조건: 별도 조건식 없음 (170행).

## H-a53a10597b12

**start** · [src/ui/memory-test.tsx:174](../../../src/ui/memory-test.tsx#L174)

분기 조건과 가능한 갈림길:

- B-4775ec69b0d1 · IfStatement · busy || draft.editor → truthy / falsy; 바깥 조건: 별도 조건식 없음 (175행).
- B-93e1e05253b1 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (176행).
- B-3cb7e8fb0298 · IfStatement · !selected.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (178행).
- B-e1f587061791 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (193행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 177행 | nullish: questions | memoryQuestions(data, cards, draft.count)<br>call |
| 179행 | 별도 조건식 없음 | setHistory(null)<br>state-update |
| 180행 | 별도 조건식 없음 | persist({ ...current.current, phase: 'testing', attempt: { id: crypto.randomUUID(), startedAt: new Date().toISOString(), endedAt: null, questions: structuredClone( selected.map((q) => ({ ...q, response: '', responseStrokes: [], verdict: null })), ), index: 0, }, })<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |
| 184행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 185행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 187행 | 별도 조건식 없음 | structuredClone(selected.map((q) => ({ ...q, response: '', responseStrokes: [], verdict: null })))<br>call |
| 188행 | 별도 조건식 없음 | selected.map((q) => ({ ...q, response: '', responseStrokes: [], verdict: null }))<br>call<br>전달 콜백: H-a79a20d06958 |
| 194행 | exception: e | setError(message(e))<br>state-update |
| 194행 | exception: e | message(e)<br>call → [H-cd475d97cdd6](ui__memory-test.md#h-cd475d97cdd6) |

반환/조기 중단: 175행 <render> [truthy: busy || draft.editor]; 178행 <render> [truthy: !selected.length]

## H-a79a20d06958

**@callback:selected.map** · [src/ui/memory-test.tsx:188](../../../src/ui/memory-test.tsx#L188)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-bd7e1537f231

**saveTest** · [src/ui/memory-test.tsx:197](../../../src/ui/memory-test.tsx#L197)

분기 조건과 가능한 갈림길:

- B-1b25a5a63f1a · IfStatement · busy || !current.current.attempt || !persist(current.current) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (198행).
- B-c8f20c069210 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (199행).
- B-a6133e244b86 · IfStatement · persist({ ...current.current, phase: 'saved' }) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (201행).
- B-dd32d8e901ba · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (203행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 198행 | falsy: busy \|\| !current.current.attempt | persist(current.current)<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |
| 200행 | 별도 조건식 없음 | onSaved(saveMemoryAttempt(repository, current.current.attempt))<br>call |
| 200행 | 별도 조건식 없음 | saveMemoryAttempt(repository, current.current.attempt)<br>call |
| 201행 | 별도 조건식 없음 | persist({ ...current.current, phase: 'saved' })<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |
| 202행 | truthy: persist({ ...current.current, phase: 'saved' }) | setNotice('시험 결과를 이 기기에 저장했습니다.')<br>state-update |
| 204행 | exception: e | setError(message(e))<br>state-update |
| 204행 | exception: e | message(e)<br>call → [H-cd475d97cdd6](ui__memory-test.md#h-cd475d97cdd6) |

반환/조기 중단: 198행 <render> [truthy: busy || !current.current.attempt || !persist(current.current)]

## H-5b954048f8ac

**exportDraft** · [src/ui/memory-test.tsx:207](../../../src/ui/memory-test.tsx#L207)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 208행 | 별도 조건식 없음 | URL.createObjectURL(new Blob([JSON.stringify(current.current, null, 2)], { type: 'application/json' }))<br>call |
| 209행 | 별도 조건식 없음 | JSON.stringify(current.current, null, 2)<br>call |
| 211행 | 별도 조건식 없음 | document.createElement('a')<br>call |
| 214행 | 별도 조건식 없음 | a.click()<br>call |
| 215행 | 별도 조건식 없음 | setTimeout(() => URL.revokeObjectURL(url), 1000)<br>state-update<br>전달 콜백: H-4e06f440343a |

## H-4e06f440343a

**@callback:setTimeout** · [src/ui/memory-test.tsx:215](../../../src/ui/memory-test.tsx#L215)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 215행 | 별도 조건식 없음 | URL.revokeObjectURL(url)<br>call |

## H-3279896c649e

**@callback:(data.memoryTests ?? [])
    .filter** · [src/ui/memory-test.tsx:219](../../../src/ui/memory-test.tsx#L219)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 221행 | truthy: !t.deletedAt | t.questions.some((q) => data.nodes.some((n) => n.id === q.topicId && subjectIds.includes(n.subjectId)))<br>call<br>전달 콜백: H-fb175f6ccfb9 |

## H-fb175f6ccfb9

**@callback:t.questions.some** · [src/ui/memory-test.tsx:221](../../../src/ui/memory-test.tsx#L221)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 222행 | truthy: !t.deletedAt | data.nodes.some((n) => n.id === q.topicId && subjectIds.includes(n.subjectId))<br>call<br>전달 콜백: H-f5e2b4c71f8c |

## H-f5e2b4c71f8c

**@callback:data.nodes.some** · [src/ui/memory-test.tsx:222](../../../src/ui/memory-test.tsx#L222)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 222행 | truthy: !t.deletedAt ∧ truthy: n.id === q.topicId | subjectIds.includes(n.subjectId)<br>call |

## H-23b4f015d6f1

**savedTests** · [src/ui/memory-test.tsx:226](../../../src/ui/memory-test.tsx#L226)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 226행 | 별도 조건식 없음 | b.startedAt.localeCompare(a.startedAt)<br>call |

## H-d3d5ffffd808

**library** · [src/ui/memory-test.tsx:229](../../../src/ui/memory-test.tsx#L229)

분기 조건과 가능한 갈림길:

- B-ed42d9cba0aa · IfStatement · !busy → truthy / falsy; 바깥 조건: 별도 조건식 없음 (230행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 231행 | truthy: !busy | setHistory(null)<br>state-update |
| 232행 | truthy: !busy | persist({ ...current.current, phase: 'library', attempt: null })<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |

## H-51bf71f968e6

**@onCompositionStart** · [src/ui/memory-test.tsx:242](../../../src/ui/memory-test.tsx#L242)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 242행 | 별도 조건식 없음 | setComposing(true)<br>state-update |

## H-7261d38c19f6

**@onCompositionEnd** · [src/ui/memory-test.tsx:243](../../../src/ui/memory-test.tsx#L243)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 243행 | 별도 조건식 없음 | setComposing(false)<br>state-update |

## H-fb3929c1cd3f

**@onClick** · [src/ui/memory-test.tsx:250](../../../src/ui/memory-test.tsx#L250)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 250행 | truthy: error ∧ truthy: !blocked | persist(current.current)<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |

## H-c1f9e7b636fa

**@onClick** · [src/ui/memory-test.tsx:257](../../../src/ui/memory-test.tsx#L257)

분기 조건과 가능한 갈림길:

- B-b91dec45b5ca · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: error ∧ truthy: blocked && boot.error && boot.key (258행).
- B-25f634e72939 · CatchClause · e → exception; 바깥 조건: truthy: error ∧ truthy: blocked && boot.error && boot.key (265행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 259행 | truthy: error ∧ truthy: blocked && boot.error && boot.key | archiveDamagedDraft(boot.key, '암기시험 초안 원문 보관')<br>preservation-boundary |
| 260행 | truthy: error ∧ truthy: blocked && boot.error && boot.key | clearStoredDraft(boot.key)<br>preservation-boundary |
| 263행 | truthy: error ∧ truthy: blocked && boot.error && boot.key | setBlocked(false)<br>state-update |
| 264행 | truthy: error ∧ truthy: blocked && boot.error && boot.key | persist(freshMemoryDraft(initialTopicId))<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |
| 264행 | truthy: error ∧ truthy: blocked && boot.error && boot.key | freshMemoryDraft(initialTopicId)<br>preservation-boundary |
| 266행 | truthy: error ∧ truthy: blocked && boot.error && boot.key ∧ exception: e | setError(message(e))<br>state-update |
| 266행 | truthy: error ∧ truthy: blocked && boot.error && boot.key ∧ exception: e | message(e)<br>call → [H-cd475d97cdd6](ui__memory-test.md#h-cd475d97cdd6) |

## H-0c608b22b3a8

**@onChange** · [src/ui/memory-test.tsx:294](../../../src/ui/memory-test.tsx#L294)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 294행 | truthy: draft.phase === 'library' && !history | persist({ ...draft, subjectId: e.target.value, topicId: '' })<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |

## H-1904b1bbc81a

**@callback:subjects.map** · [src/ui/memory-test.tsx:297](../../../src/ui/memory-test.tsx#L297)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-68abc539ed4f

**@onChange** · [src/ui/memory-test.tsx:307](../../../src/ui/memory-test.tsx#L307)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 307행 | truthy: draft.phase === 'library' && !history | persist({ ...draft, topicId: e.target.value })<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |

## H-117f37866f1d

**@callback:topics.map** · [src/ui/memory-test.tsx:310](../../../src/ui/memory-test.tsx#L310)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-57b2bbe8380e

**@onChange** · [src/ui/memory-test.tsx:320](../../../src/ui/memory-test.tsx#L320)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 320행 | truthy: draft.phase === 'library' && !history | persist({ ...draft, count: Number(e.target.value) })<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |
| 320행 | truthy: draft.phase === 'library' && !history | Number(e.target.value)<br>call |

## H-11b8df269a9e

**@callback:[1, 3, 5, 10, 20, 50].map** · [src/ui/memory-test.tsx:322](../../../src/ui/memory-test.tsx#L322)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-5c36a630ec18

**@onClick** · [src/ui/memory-test.tsx:333](../../../src/ui/memory-test.tsx#L333)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 333행 | truthy: draft.phase === 'library' && !history | start()<br>call → [H-a53a10597b12](ui__memory-test.md#h-a53a10597b12) |

## H-507f6039638d

**@onClick** · [src/ui/memory-test.tsx:339](../../../src/ui/memory-test.tsx#L339)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 340행 | truthy: draft.phase === 'library' && !history | persist({ ...draft, editor: { id: crypto.randomUUID(), baseVersion: 0, topicId: draft.topicId \|\| topics[0]?.id \|\| '', question: '', answer: '', strokes: [], }, })<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |
| 343행 | truthy: draft.phase === 'library' && !history | crypto.randomUUID()<br>call |

## H-2ce8ca611eb6

**@onClick** · [src/ui/memory-test.tsx:357](../../../src/ui/memory-test.tsx#L357)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 357행 | truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) | setConnectionOpen(!connectionOpen)<br>state-update |

## H-a88d6a9a2d4f

**@onClick** · [src/ui/memory-test.tsx:367](../../../src/ui/memory-test.tsx#L367)

분기 조건과 가능한 갈림길:

- B-8f47d4887e74 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && !draft.generation (368행).
- B-0ff653ea7403 · CatchClause · e → exception; 바깥 조건: truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && !draft.generation (371행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 369행 | truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && !draft.generation | topicMemoryInput(data, [draft.topicId \|\| topics[0].id])<br>call |
| 370행 | truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && !draft.generation | persist({ ...current.current, generation: { input, result: null, items: [] } })<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |
| 372행 | truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && !draft.generation ∧ exception: e | setError(message(e))<br>state-update |
| 372행 | truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && !draft.generation ∧ exception: e | message(e)<br>call → [H-cd475d97cdd6](ui__memory-test.md#h-cd475d97cdd6) |

## H-4c937e91bc49

**@onConnection** · [src/ui/memory-test.tsx:394](../../../src/ui/memory-test.tsx#L394)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 394행 | truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && draft.generation && !draft.editor | setConnectionOpen(true)<br>state-update |

## H-5b77cceef921

**@onChange** · [src/ui/memory-test.tsx:399](../../../src/ui/memory-test.tsx#L399)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 399행 | truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && draft.generation && !draft.editor | persist({ ...current.current, generation })<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |

## H-e53654426a6a

**@onArchive** · [src/ui/memory-test.tsx:400](../../../src/ui/memory-test.tsx#L400)

분기 조건과 가능한 갈림길:

- B-bf517a82815a · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && draft.generation && !draft.editor (401행).
- B-4f40edfb891d · CatchClause · e → exception; 바깥 조건: truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && draft.generation && !draft.editor (404행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 402행 | truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && draft.generation && !draft.editor | archiveDamagedDraft(boot.key, '주제 기반 GPT 생성 결과 원문')<br>preservation-boundary |
| 405행 | truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && draft.generation && !draft.editor ∧ exception: e | setError(message(e))<br>state-update |
| 405행 | truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && draft.generation && !draft.editor ∧ exception: e | message(e)<br>call → [H-cd475d97cdd6](ui__memory-test.md#h-cd475d97cdd6) |

반환/조기 중단: 403행 true [truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && draft.generation && !draft.editor]; 406행 false [truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && draft.generation && !draft.editor ∧ exception: e]

## H-70063c872d3f

**@onClick** · [src/ui/memory-test.tsx:413](../../../src/ui/memory-test.tsx#L413)

분기 조건과 가능한 갈림길:

- B-bbc10730126f · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && draft.generation && !draft.editor (414행).
- B-6c1f94fbe854 · CatchClause · e → exception; 바깥 조건: truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && draft.generation && !draft.editor (417행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 415행 | truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && draft.generation && !draft.editor | archiveDamagedDraft(boot.key, '주제 기반 GPT 생성 초안 보관')<br>preservation-boundary |
| 416행 | truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && draft.generation && !draft.editor | persist({ ...current.current, generation: null })<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |
| 418행 | truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && draft.generation && !draft.editor ∧ exception: e | setError(message(e))<br>state-update |
| 418행 | truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && draft.generation && !draft.editor ∧ exception: e | message(e)<br>call → [H-cd475d97cdd6](ui__memory-test.md#h-cd475d97cdd6) |

## H-6c53587715d9

**@onChange** · [src/ui/memory-test.tsx:433](../../../src/ui/memory-test.tsx#L433)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 433행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor | patchEditor({ topicId: e.target.value })<br>call → [H-53a42606f791](ui__memory-test.md#h-53a42606f791) |

## H-57b076480d52

**@callback:topics.map** · [src/ui/memory-test.tsx:435](../../../src/ui/memory-test.tsx#L435)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-9715685c9618

**@callback:topics.some** · [src/ui/memory-test.tsx:440](../../../src/ui/memory-test.tsx#L440)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1da798de62c7

**@onChange** · [src/ui/memory-test.tsx:449](../../../src/ui/memory-test.tsx#L449)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 449행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor | patchEditor({ question: e.target.value })<br>call → [H-53a42606f791](ui__memory-test.md#h-53a42606f791) |

## H-231bc5fd26cb

**@onChange** · [src/ui/memory-test.tsx:457](../../../src/ui/memory-test.tsx#L457)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 457행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor | patchEditor({ answer: e.target.value })<br>call → [H-53a42606f791](ui__memory-test.md#h-53a42606f791) |

## H-f158794f40b1

**@onRecognizedText** · [src/ui/memory-test.tsx:470](../../../src/ui/memory-test.tsx#L470)

분기 조건과 가능한 갈림길:

- B-28994d866d16 · ConditionalExpression · draft.editor!.answer → truthy / falsy; 바깥 조건: truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor (472행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 471행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor | patchEditor({ answer: draft.editor!.answer + (draft.editor!.answer ? '\n' : '') + text, })<br>call → [H-53a42606f791](ui__memory-test.md#h-53a42606f791) |

## H-42aa8e6b1472

**@onWorkspaceSaved** · [src/ui/memory-test.tsx:476](../../../src/ui/memory-test.tsx#L476)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 476행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor | onSaved(repository.getSnapshot())<br>call |
| 476행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor | repository.getSnapshot()<br>call |

## H-f1d1da602a0a

**@onChange** · [src/ui/memory-test.tsx:484](../../../src/ui/memory-test.tsx#L484)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 484행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor | patchEditor({ strokes })<br>call → [H-53a42606f791](ui__memory-test.md#h-53a42606f791) |

## H-c940276119e5

**@onClick** · [src/ui/memory-test.tsx:494](../../../src/ui/memory-test.tsx#L494)

분기 조건과 가능한 갈림길:

- B-3d60c506a14b · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor (495행).
- B-d35d85faa4a2 · CatchClause · e → exception; 바깥 조건: truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor (498행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 496행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor | archiveDamagedDraft(boot.key, '암기 항목 편집 취소 전 원문')<br>preservation-boundary |
| 497행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor | persist({ ...draft, editor: null })<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |
| 499행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor ∧ exception: e | setError(message(e))<br>state-update |
| 499행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor ∧ exception: e | message(e)<br>call → [H-cd475d97cdd6](ui__memory-test.md#h-cd475d97cdd6) |

## H-28a66408d38f

**@callback:cards.map** · [src/ui/memory-test.tsx:520](../../../src/ui/memory-test.tsx#L520)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 527행 | truthy: draft.phase === 'library' && !history | data.nodes.find((n) => n.id === c.topicId)<br>call<br>전달 콜백: H-ae9c1374308d |
| 531행 | truthy: draft.phase === 'library' && !history ∧ falsy: busy | Boolean(draft.editor)<br>call |

## H-ae9c1374308d

**@callback:data.nodes.find** · [src/ui/memory-test.tsx:527](../../../src/ui/memory-test.tsx#L527)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-302c8586b25e

**@onClick** · [src/ui/memory-test.tsx:532](../../../src/ui/memory-test.tsx#L532)

분기 조건과 가능한 갈림길:

- B-f837b7cad168 · ConditionalExpression · c.topicGeneration → truthy / falsy; 바깥 조건: truthy: draft.phase === 'library' && !history (542행).
- B-8bffa4dc5557 · ConditionalExpression · c.materialSource → truthy / falsy; 바깥 조건: truthy: draft.phase === 'library' && !history (545행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 533행 | truthy: draft.phase === 'library' && !history | persist({ ...draft, editor: { id: c.id, baseVersion: c.version, topicId: c.topicId, question: c.question, answer: c.answer, strokes: structuredClone(c.strokes), ...(c.topicGeneration ? { topicGeneration: structuredClone(c.topicGeneration) } : {}), ...(c.materialSource ? { materialSource: structuredClone(c.materialSource) } : {}), }, })<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |
| 541행 | truthy: draft.phase === 'library' && !history | structuredClone(c.strokes)<br>call |
| 543행 | truthy: draft.phase === 'library' && !history ∧ truthy: c.topicGeneration | structuredClone(c.topicGeneration)<br>call |
| 546행 | truthy: draft.phase === 'library' && !history ∧ truthy: c.materialSource | structuredClone(c.materialSource)<br>call |

## H-04b5f9e6b3d1

**@callback:(data.memoryCards ?? []).some** · [src/ui/memory-test.tsx:557](../../../src/ui/memory-test.tsx#L557)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c885008c1df4

**@callback:(data.memoryCards ?? [])
                .filter** · [src/ui/memory-test.tsx:562](../../../src/ui/memory-test.tsx#L562)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 564행 | truthy: draft.phase === 'library' && !history ∧ truthy: (data.memoryCards ?? []).some((c) => c.deletedAt) ∧ truthy: c.deletedAt | data.nodes.some((n) => n.id === c.topicId && subjectIds.includes(n.subjectId))<br>call<br>전달 콜백: H-4b4737451fbe |

## H-4b4737451fbe

**@callback:data.nodes.some** · [src/ui/memory-test.tsx:564](../../../src/ui/memory-test.tsx#L564)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 564행 | truthy: draft.phase === 'library' && !history ∧ truthy: (data.memoryCards ?? []).some((c) => c.deletedAt) ∧ truthy: c.deletedAt ∧ truthy: n.id === c.topicId | subjectIds.includes(n.subjectId)<br>call |

## H-183fd9952e71

**@callback:(data.memoryCards ?? [])
                .filter(
                  (c) =>
                    c.deletedAt &&
                    data.nodes.some((n) => n.id === c.topicId && subjectIds.includes(n.subjectId)),
                )
                .map** · [src/ui/memory-test.tsx:566](../../../src/ui/memory-test.tsx#L566)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d139a454f07f

**@onClick** · [src/ui/memory-test.tsx:571](../../../src/ui/memory-test.tsx#L571)

분기 조건과 가능한 갈림길:

- B-34e58a94cca1 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: draft.phase === 'library' && !history ∧ truthy: (data.memoryCards ?? []).some((c) => c.deletedAt) (572행).
- B-cd7511a1e239 · CatchClause · e → exception; 바깥 조건: truthy: draft.phase === 'library' && !history ∧ truthy: (data.memoryCards ?? []).some((c) => c.deletedAt) (584행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 573행 | truthy: draft.phase === 'library' && !history ∧ truthy: (data.memoryCards ?? []).some((c) => c.deletedAt) | onSaved(repository.execute({ type: 'restoreMemoryCard', id: c.id, expectedVersion: c.version, userId: data.userId, namespace: data.namespace, opId: crypto.randomUUID(), at: new Date().toISOString(), }))<br>call |
| 574행 | truthy: draft.phase === 'library' && !history ∧ truthy: (data.memoryCards ?? []).some((c) => c.deletedAt) | repository.execute({ type: 'restoreMemoryCard', id: c.id, expectedVersion: c.version, userId: data.userId, namespace: data.namespace, opId: crypto.randomUUID(), at: new Date().toISOString(), })<br>call |
| 580행 | truthy: draft.phase === 'library' && !history ∧ truthy: (data.memoryCards ?? []).some((c) => c.deletedAt) | crypto.randomUUID()<br>call |
| 581행 | truthy: draft.phase === 'library' && !history ∧ truthy: (data.memoryCards ?? []).some((c) => c.deletedAt) | new Date().toISOString()<br>call |
| 585행 | truthy: draft.phase === 'library' && !history ∧ truthy: (data.memoryCards ?? []).some((c) => c.deletedAt) ∧ exception: e | setError(message(e))<br>state-update |
| 585행 | truthy: draft.phase === 'library' && !history ∧ truthy: (data.memoryCards ?? []).some((c) => c.deletedAt) ∧ exception: e | message(e)<br>call → [H-cd475d97cdd6](ui__memory-test.md#h-cd475d97cdd6) |

## H-915042b5cdf1

**@onClick** · [src/ui/memory-test.tsx:601](../../../src/ui/memory-test.tsx#L601)

분기 조건과 가능한 갈림길:

- B-da660f66e6f4 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor && draft.editor.baseVersion > 0 (602행).
- B-a86716d35d12 · IfStatement · !editor || !persist(current.current) → truthy / falsy; 바깥 조건: truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor && draft.editor.baseVersion > 0 (604행).
- B-d49dddab5267 · CatchClause · e → exception; 바깥 조건: truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor && draft.editor.baseVersion > 0 (618행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 604행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor && draft.editor.baseVersion > 0 ∧ falsy: !editor | persist(current.current)<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |
| 605행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor && draft.editor.baseVersion > 0 | archiveDamagedDraft(boot.key, '암기 항목 보관 전 편집 초안')<br>preservation-boundary |
| 606행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor && draft.editor.baseVersion > 0 | onSaved(repository.execute({ type: 'trashMemoryCard', id: editor.id, expectedVersion: editor.baseVersion, userId: data.userId, namespace: data.namespace, opId: crypto.randomUUID(), at: new Date().toISOString(), }))<br>call |
| 607행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor && draft.editor.baseVersion > 0 | repository.execute({ type: 'trashMemoryCard', id: editor.id, expectedVersion: editor.baseVersion, userId: data.userId, namespace: data.namespace, opId: crypto.randomUUID(), at: new Date().toISOString(), })<br>call |
| 613행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor && draft.editor.baseVersion > 0 | crypto.randomUUID()<br>call |
| 614행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor && draft.editor.baseVersion > 0 | new Date().toISOString()<br>call |
| 617행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor && draft.editor.baseVersion > 0 | persist({ ...draft, editor: null })<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |
| 619행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor && draft.editor.baseVersion > 0 ∧ exception: e | setError(message(e))<br>state-update |
| 619행 | truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor && draft.editor.baseVersion > 0 ∧ exception: e | message(e)<br>call → [H-cd475d97cdd6](ui__memory-test.md#h-cd475d97cdd6) |

반환/조기 중단: 604행 <render> [truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor && draft.editor.baseVersion > 0 ∧ truthy: !editor || !persist(current.current)]

## H-993bc802715b

**@callback:savedTests.map** · [src/ui/memory-test.tsx:630](../../../src/ui/memory-test.tsx#L630)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 633행 | truthy: draft.phase === 'library' && !history ∧ truthy: !!savedTests.length | new Date(t.startedAt).toLocaleString('ko-KR')<br>call |
| 636행 | truthy: draft.phase === 'library' && !history ∧ truthy: !!savedTests.length ∧ falsy: busy | Boolean(draft.editor)<br>call |

## H-02f604b3aaea

**@onClick** · [src/ui/memory-test.tsx:636](../../../src/ui/memory-test.tsx#L636)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 636행 | truthy: draft.phase === 'library' && !history ∧ truthy: !!savedTests.length | setHistory(t)<br>state-update |

## H-787807e9dd25

**@onChange** · [src/ui/memory-test.tsx:656](../../../src/ui/memory-test.tsx#L656)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 656행 | truthy: draft.phase === 'testing' && question && attempt | patchQuestion(attempt.index, { response: e.target.value })<br>call → [H-e44441b0f015](ui__memory-test.md#h-e44441b0f015) |

## H-c05cf8ef1a04

**@onRecognizedText** · [src/ui/memory-test.tsx:660](../../../src/ui/memory-test.tsx#L660)

분기 조건과 가능한 갈림길:

- B-87e553c65268 · ConditionalExpression · question.response → truthy / falsy; 바깥 조건: truthy: draft.phase === 'testing' && question && attempt (662행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 661행 | truthy: draft.phase === 'testing' && question && attempt | patchQuestion(attempt.index, { response: question.response + (question.response ? '\n' : '') + text, })<br>call → [H-e44441b0f015](ui__memory-test.md#h-e44441b0f015) |

## H-09252e69e5ac

**@onWorkspaceSaved** · [src/ui/memory-test.tsx:666](../../../src/ui/memory-test.tsx#L666)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 666행 | truthy: draft.phase === 'testing' && question && attempt | onSaved(repository.getSnapshot())<br>call |
| 666행 | truthy: draft.phase === 'testing' && question && attempt | repository.getSnapshot()<br>call |

## H-0acbbce3bfd7

**@onChange** · [src/ui/memory-test.tsx:674](../../../src/ui/memory-test.tsx#L674)

분기 조건과 가능한 갈림길:

- B-426aa7b03260 · IfStatement · active → truthy / falsy; 바깥 조건: truthy: draft.phase === 'testing' && question && attempt (676행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 676행 | truthy: draft.phase === 'testing' && question && attempt ∧ truthy: active | patchQuestion(active.index, { responseStrokes })<br>call → [H-e44441b0f015](ui__memory-test.md#h-e44441b0f015) |

## H-27dc1eb128c6

**@onClick** · [src/ui/memory-test.tsx:684](../../../src/ui/memory-test.tsx#L684)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 685행 | truthy: draft.phase === 'testing' && question && attempt | persist({ ...draft, attempt: { ...attempt, index: attempt.index - 1 } })<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |

## H-3693189105e6

**@onClick** · [src/ui/memory-test.tsx:694](../../../src/ui/memory-test.tsx#L694)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 695행 | truthy: draft.phase === 'testing' && question && attempt ∧ truthy: attempt.index < attempt.questions.length - 1 | persist({ ...draft, attempt: { ...attempt, index: attempt.index + 1 } })<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |

## H-b75458ab1e16

**@onClick** · [src/ui/memory-test.tsx:704](../../../src/ui/memory-test.tsx#L704)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 705행 | truthy: draft.phase === 'testing' && question && attempt ∧ falsy: attempt.index < attempt.questions.length - 1 | persist({ ...draft, phase: 'review', attempt: { ...attempt, endedAt: new Date().toISOString() }, })<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |
| 708행 | truthy: draft.phase === 'testing' && question && attempt ∧ falsy: attempt.index < attempt.questions.length - 1 | new Date().toISOString()<br>call |

## H-dd4bc936f960

**@onClick** · [src/ui/memory-test.tsx:718](../../../src/ui/memory-test.tsx#L718)

분기 조건과 가능한 갈림길:

- B-964d4759e075 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: draft.phase === 'testing' && question && attempt (719행).
- B-30aa81f1070a · IfStatement · !persist(current.current) → truthy / falsy; 바깥 조건: truthy: draft.phase === 'testing' && question && attempt (720행).
- B-2004e714adb7 · CatchClause · e → exception; 바깥 조건: truthy: draft.phase === 'testing' && question && attempt (723행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 720행 | truthy: draft.phase === 'testing' && question && attempt | persist(current.current)<br>call → [H-2c1ca092f050](ui__memory-test.md#h-2c1ca092f050) |
| 721행 | truthy: draft.phase === 'testing' && question && attempt | archiveDamagedDraft(boot.key, '암기시험 중단 전 답안 원문')<br>preservation-boundary |
| 722행 | truthy: draft.phase === 'testing' && question && attempt | library()<br>call → [H-d3d5ffffd808](ui__memory-test.md#h-d3d5ffffd808) |
| 724행 | truthy: draft.phase === 'testing' && question && attempt ∧ exception: e | setError(message(e))<br>state-update |
| 724행 | truthy: draft.phase === 'testing' && question && attempt ∧ exception: e | message(e)<br>call → [H-cd475d97cdd6](ui__memory-test.md#h-cd475d97cdd6) |

반환/조기 중단: 720행 <render> [truthy: draft.phase === 'testing' && question && attempt ∧ truthy: !persist(current.current)]

## H-1b1bcfd463a1

**@callback:review.map** · [src/ui/memory-test.tsx:742](../../../src/ui/memory-test.tsx#L742)

분기 조건과 가능한 갈림길:

- B-ecebda4000bd · ConditionalExpression · !q.responseStrokes.length → truthy / falsy; 바깥 조건: truthy: review ∧ falsy: q.response (755행).
- B-2dd389e3d43a · ConditionalExpression · draft.phase === 'review' && !history → truthy / falsy; 바깥 조건: truthy: review (767행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 776행 | truthy: review ∧ truthy: draft.phase === 'review' && !history | verdicts.map((v) => ( <option key={v.label} value={v.value ?? ''} disabled={ ['correct', 'partial', 'wrong'].includes(v.value ?? '') && !q.response.trim() && !q.responseStrokes.length } > {v.label} </option> ))<br>call<br>전달 콜백: H-aa6dbed89615 |
| 791행 | truthy: review ∧ falsy: draft.phase === 'review' && !history | verdicts.find((v) => v.value === q.verdict)<br>call<br>전달 콜백: H-8051ef131063 |

## H-fc283b715afd

**@onChange** · [src/ui/memory-test.tsx:772](../../../src/ui/memory-test.tsx#L772)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 773행 | truthy: review ∧ truthy: draft.phase === 'review' && !history | patchQuestion(index, { verdict: (e.target.value \|\| null) as MemoryVerdict })<br>call → [H-e44441b0f015](ui__memory-test.md#h-e44441b0f015) |

## H-aa6dbed89615

**@callback:verdicts.map** · [src/ui/memory-test.tsx:776](../../../src/ui/memory-test.tsx#L776)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 781행 | truthy: review ∧ truthy: draft.phase === 'review' && !history | ['correct', 'partial', 'wrong'].includes(v.value ?? '')<br>call |
| 782행 | truthy: review ∧ truthy: draft.phase === 'review' && !history ∧ truthy: ['correct', 'partial', 'wrong'].includes(v.value ?? '') | q.response.trim()<br>call |

## H-8051ef131063

**@callback:verdicts.find** · [src/ui/memory-test.tsx:791](../../../src/ui/memory-test.tsx#L791)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-2c1aa7cec243

**@callback:review.some** · [src/ui/memory-test.tsx:819](../../../src/ui/memory-test.tsx#L819)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-baff64097fe7

**@onClick** · [src/ui/memory-test.tsx:821](../../../src/ui/memory-test.tsx#L821)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 822행 | truthy: review ∧ truthy: draft.phase === 'saved' \|\| history | start(review.filter((q) => q.verdict === 'wrong' \|\| q.verdict === 'partial'))<br>call → [H-a53a10597b12](ui__memory-test.md#h-a53a10597b12) |
| 822행 | truthy: review ∧ truthy: draft.phase === 'saved' \|\| history | review.filter((q) => q.verdict === 'wrong' \|\| q.verdict === 'partial')<br>call<br>전달 콜백: H-114313fbe559 |

## H-114313fbe559

**@callback:review.filter** · [src/ui/memory-test.tsx:822](../../../src/ui/memory-test.tsx#L822)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

