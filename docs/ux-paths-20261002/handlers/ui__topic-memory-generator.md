# src/ui/topic-memory-generator.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-11f9c1a98444

**TopicMemoryGenerator** · [src/ui/topic-memory-generator.tsx:12](../../../src/ui/topic-memory-generator.tsx#L12)

분기 조건과 가능한 갈림길:

- B-6358abb5b26a · ConditionalExpression · input.topics.length === 1 → truthy / falsy; 바깥 조건: truthy: !draft.result (158행).
- B-c7565b5e6fa9 · ConditionalExpression · pending → truthy / falsy; 바깥 조건: truthy: !draft.result (244행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 35행 | 별도 조건식 없음 | useState(false)<br>call |
| 36행 | 별도 조건식 없음 | useState('')<br>call |
| 37행 | 별도 조건식 없음 | useState('')<br>call |
| 38행 | 별도 조건식 없음 | useRef(false)<br>call |
| 39행 | 별도 조건식 없음 | useRef(true)<br>call |
| 40행 | 별도 조건식 없음 | useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, [])<br>call<br>전달 콜백: H-a3a761e6cd6a |
| 48행 | 별도 조건식 없음 | data.nodes.filter((n) => n.role === 'topic' && n.subjectId === input.subject.id && !n.deletedAt && recallPath(data.nodes, n.id).every((p) => !p.deletedAt))<br>call<br>전달 콜백: H-9f2e9a3204e3 |
| 118행 | 별도 조건식 없음 | draft.items.filter((i) => i.included)<br>preservation-boundary<br>전달 콜백: H-f9d938fd19df |
| 167행 | truthy: !draft.result | topics.map((t) => ( <option key={t.id} value={t.id}> {recallPath(data.nodes, t.id) .map((n) => n.name) .join(' › ')} </option> ))<br>call<br>전달 콜백: H-865f11d563a1 |
| 179행 | truthy: !draft.result | topics.map((t) => { const checked = input.topics.some((n) => n.id === t.id); return ( <Checkbox key={t.id} label={recallPath(data.nodes, t.id) .map((n) => n.name) .join(' › ')} checked={checked} disabled={ disabled \|\| pending \|\| (checked && input.topics.length === 1) \|\| (!checked && input.topics.length >= 20) } onChange={(e) => updateScope( e.target.checked ? [...input.topics.map((n) => n.id), t.id] : input.topics.filter((n) => n.id !== t.id).map((n) => n.id), ) } /> ); })<br>call<br>전달 콜백: H-bf4a0fc51821 |
| 217행 | truthy: !draft.result | [1, 3, 5, 10, 20, 30].map((n) => ( <option key={n} value={n}> {n}개 </option> ))<br>call<br>전달 콜백: H-b09f63dd826c |
| 256행 | truthy: result | input.topics.map((t) => t.path.map((n) => n.name).join(' › ')).join(', ')<br>call |
| 256행 | truthy: result | input.topics.map((t) => t.path.map((n) => n.name).join(' › '))<br>call<br>전달 콜백: H-3a0d57c8d5ba |
| 263행 | truthy: result ∧ truthy: result.diagnostics | occurrenceRows(result.diagnostics, diagnostic => JSON.stringify(diagnostic)).map(({value: d, key}) => ( <article key={key}> <p role="status">{d.message}</p> {d.questions?.map((q) => ( <p key={q}>{q}</p> ))} </article> ))<br>call<br>전달 콜백: H-fd10e044fa3f |
| 263행 | truthy: result ∧ truthy: result.diagnostics | occurrenceRows(result.diagnostics, diagnostic => JSON.stringify(diagnostic))<br>call<br>전달 콜백: H-8a6c1df82c65 |
| 271행 | truthy: result | draft.items.map((i, index) => { const original = result.cards.find((c) => c.id === i.id); if (!original) return ( <p role="alert" key={i.id}> 처음 생성한 항목을 찾지 못했습니다. 초안은 유지했습니다. </p> ); const id = `topic-gpt:${encodeURIComponent(result.id)}:${encodeURIComponent(i.id)}`; const saved = data.memoryCards?.find( (c) => c.id === id \|\| (c.topicId === original.topicId && c.question.trim() === i.question.trim() && c.answer.trim() === i.answer.trim() && !c.strokes.length), ); return ( <article key={i.id} className="memory-review"> <h3> {index + 1}번 ·{' '} {input.topics.find((t) => t.id === original.topicId)?.path.at(-1)?.name} </h3> <Checkbox label={`${index + 1}번 항목 등록에 포함`} checked={i.included} disabled={disabled \|\| ! … [전체 인수는 JSON·소스])<br>preservation-boundary<br>전달 콜백: H-a85430417f4a |
| 354행 | truthy: result ∧ falsy: disabled \|\|<br>                composing \|\|<br>                !selected.length | selected.some((i) => !i.reviewed \|\| !i.question.trim() \|\| !i.answer.trim())<br>call<br>전달 콜백: H-b782dd5bc639 |

반환/조기 중단: 138행 <render> [별도 조건식 없음]

## H-a3a761e6cd6a

**@callback:useEffect** · [src/ui/topic-memory-generator.tsx:40](../../../src/ui/topic-memory-generator.tsx#L40)


반환/조기 중단: 42행 () => { mounted.current = false; } [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-9f2e9a3204e3

**@callback:data.nodes.filter** · [src/ui/topic-memory-generator.tsx:49](../../../src/ui/topic-memory-generator.tsx#L49)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 53행 | truthy: n.role === 'topic' &&<br>      n.subjectId === input.subject.id &&<br>      !n.deletedAt | recallPath(data.nodes, n.id).every((p) => !p.deletedAt)<br>call<br>전달 콜백: H-54f7ee12d80a |
| 53행 | truthy: n.role === 'topic' &&<br>      n.subjectId === input.subject.id &&<br>      !n.deletedAt | recallPath(data.nodes, n.id)<br>call |

## H-54f7ee12d80a

**@callback:recallPath(data.nodes, n.id).every** · [src/ui/topic-memory-generator.tsx:53](../../../src/ui/topic-memory-generator.tsx#L53)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-35e7e64a7027

**updateScope** · [src/ui/topic-memory-generator.tsx:55](../../../src/ui/topic-memory-generator.tsx#L55)

분기 조건과 가능한 갈림길:

- B-fcc4c5df4e4a · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (56행).
- B-6a70d44b31c5 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (59행).
- B-b1d9e0733ac6 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (60행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 57행 | 별도 조건식 없음 | onChange({ input: topicMemoryInput(data, ids, count, guidance), result: null, items: [] })<br>call |
| 57행 | 별도 조건식 없음 | topicMemoryInput(data, ids, count, guidance)<br>call |
| 58행 | 별도 조건식 없음 | setError('')<br>state-update |
| 60행 | exception: e | setError(e instanceof Error ? e.message : '출제 범위를 확인해 주세요.')<br>state-update |

## H-40b836d6cf99

**generate** · [src/ui/topic-memory-generator.tsx:63](../../../src/ui/topic-memory-generator.tsx#L63) · async

분기 조건과 가능한 갈림길:

- B-754f7e1abe3e · IfStatement · disabled || composing || flight.current || draft.result → truthy / falsy; 바깥 조건: 별도 조건식 없음 (64행).
- B-ddea1fc69ab8 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (65행).
- B-6bd18bbf063b · IfStatement · !onChange(fresh) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (77행).
- B-a55eda89df99 · IfStatement · mounted.current && stored → truthy / falsy; 바깥 조건: 별도 조건식 없음 (95행).
- B-895ca1ba71ce · ConditionalExpression · result.cards.length → truthy / falsy; 바깥 조건: truthy: mounted.current && stored (97행).
- B-05dae8c147d5 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (101행).
- B-ae0471ae45c6 · IfStatement · mounted.current → truthy / falsy; 바깥 조건: exception: e (102행).
- B-6c6bf68b5ff9 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e ∧ truthy: mounted.current (104행).
- B-cc82b0111845 · IfStatement · mounted.current → truthy / falsy; 바깥 조건: always-after-try: try 완료 또는 예외 이후 (108행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 68행 | 별도 조건식 없음 | topicMemoryInput(data, input.topics.map((t) => t.id), input.count, input.guidance)<br>call |
| 70행 | 별도 조건식 없음 | input.topics.map((t) => t.id)<br>call<br>전달 콜백: H-7e217f548c50 |
| 77행 | 별도 조건식 없음 | onChange(fresh)<br>call |
| 79행 | 별도 조건식 없음 | setPending(true)<br>state-update |
| 80행 | 별도 조건식 없음 | onBusy(true)<br>call |
| 81행 | 별도 조건식 없음 | setError('')<br>state-update |
| 82행 | 별도 조건식 없음 | setNotice('')<br>state-update |
| 83행 | 별도 조건식 없음 | generateTopicMemory(data, fresh.input)<br>call |
| 84행 | 별도 조건식 없음 | onChange({ input: result.input, result, items: result.cards.map((c) => ({ id: c.id, question: c.question, answer: c.answer, included: true, reviewed: false, })), })<br>call |
| 87행 | 별도 조건식 없음 | result.cards.map((c) => ({ id: c.id, question: c.question, answer: c.answer, included: true, reviewed: false, }))<br>call<br>전달 콜백: H-d42859bbaa6c |
| 96행 | truthy: mounted.current && stored | setNotice(result.cards.length ? '질문과 기준 답안을 만들었습니다. 확인한 항목을 등록해 주세요.' : '등록할 문항을 만들지 않았습니다. 아래 안내를 확인해 주세요.')<br>state-update |
| 103행 | exception: e ∧ truthy: mounted.current | setError(e instanceof Error ? e.message : '생성을 마치지 못했습니다. 기존 초안은 유지했습니다.')<br>state-update |
| 109행 | always-after-try: try 완료 또는 예외 이후 ∧ truthy: mounted.current | setPending(false)<br>state-update |
| 110행 | always-after-try: try 완료 또는 예외 이후 ∧ truthy: mounted.current | onBusy(false)<br>call |

반환/조기 중단: 64행 <render> [truthy: disabled || composing || flight.current || draft.result]; 77행 <render> [truthy: !onChange(fresh)]

## H-7e217f548c50

**@callback:input.topics.map** · [src/ui/topic-memory-generator.tsx:70](../../../src/ui/topic-memory-generator.tsx#L70)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d42859bbaa6c

**@callback:result.cards.map** · [src/ui/topic-memory-generator.tsx:87](../../../src/ui/topic-memory-generator.tsx#L87)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6d073b901211

**patchItem** · [src/ui/topic-memory-generator.tsx:114](../../../src/ui/topic-memory-generator.tsx#L114)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 115행 | 별도 조건식 없음 | onChange({ ...draft, items: draft.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) })<br>call |
| 115행 | 별도 조건식 없음 | draft.items.map((i) => (i.id === id ? { ...i, ...patch } : i))<br>preservation-boundary<br>전달 콜백: H-85c9fbf96666 |
| 116행 | 별도 조건식 없음 | setNotice('')<br>state-update |

## H-85c9fbf96666

**@callback:draft.items.map** · [src/ui/topic-memory-generator.tsx:115](../../../src/ui/topic-memory-generator.tsx#L115)

분기 조건과 가능한 갈림길:

- B-e0309662171c · ConditionalExpression · i.id === id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (115행).

## H-f9d938fd19df

**@callback:draft.items.filter** · [src/ui/topic-memory-generator.tsx:118](../../../src/ui/topic-memory-generator.tsx#L118)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-cc8e25568364

**register** · [src/ui/topic-memory-generator.tsx:119](../../../src/ui/topic-memory-generator.tsx#L119)

분기 조건과 가능한 갈림길:

- B-0364e66bfa34 · IfStatement · disabled || composing || pending → truthy / falsy; 바깥 조건: 별도 조건식 없음 (120행).
- B-c569a62f59b8 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (122행).
- B-4c88f21ac282 · IfStatement · !next.deleted → truthy / falsy; 바깥 조건: 별도 조건식 없음 (126행).
- B-72dd896c7468 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (132행).
- B-78a7a570f8a9 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (134행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 124행 | 별도 조건식 없음 | registerTopicMemory(repository, draft, item.id)<br>call |
| 125행 | 별도 조건식 없음 | onSaved(next.data)<br>call |
| 128행 | 별도 조건식 없음 | setNotice(`${registered}개 항목이 암기시험에 등록되어 있습니다. 이미 등록한 항목은 수정하거나 중복 추가하지 않았습니다.`)<br>state-update |
| 131행 | 별도 조건식 없음 | setError('')<br>state-update |
| 133행 | exception: e | setError(`${e instanceof Error ? e.message : '등록하지 못했습니다.'} 생성 결과는 유지했습니다. 저장만 다시 시도할 수 있습니다.`)<br>state-update |

반환/조기 중단: 120행 <render> [truthy: disabled || composing || pending]

## H-3195dd368446

**@onChange** · [src/ui/topic-memory-generator.tsx:160](../../../src/ui/topic-memory-generator.tsx#L160)

분기 조건과 가능한 갈림길:

- B-d0e7e9ff60ea · IfStatement · e.target.value → truthy / falsy; 바깥 조건: truthy: !draft.result (161행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 161행 | truthy: !draft.result ∧ truthy: e.target.value | updateScope([e.target.value])<br>call → [H-35e7e64a7027](ui__topic-memory-generator.md#h-35e7e64a7027) |

## H-865f11d563a1

**@callback:topics.map** · [src/ui/topic-memory-generator.tsx:167](../../../src/ui/topic-memory-generator.tsx#L167)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 169행 | truthy: !draft.result | recallPath(data.nodes, t.id)<br>                  .map((n) => n.name)<br>                  .join(' › ')<br>call |
| 169행 | truthy: !draft.result | recallPath(data.nodes, t.id)<br>                  .map((n) => n.name)<br>call<br>전달 콜백: H-6bfdb6334a29 |
| 169행 | truthy: !draft.result | recallPath(data.nodes, t.id)<br>call |

## H-6bfdb6334a29

**@callback:recallPath(data.nodes, t.id)
                  .map** · [src/ui/topic-memory-generator.tsx:170](../../../src/ui/topic-memory-generator.tsx#L170)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-bf4a0fc51821

**@callback:topics.map** · [src/ui/topic-memory-generator.tsx:179](../../../src/ui/topic-memory-generator.tsx#L179)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 180행 | truthy: !draft.result | input.topics.some((n) => n.id === t.id)<br>call<br>전달 콜백: H-ffcfd6da3dfc |
| 184행 | truthy: !draft.result | recallPath(data.nodes, t.id)<br>                      .map((n) => n.name)<br>                      .join(' › ')<br>call |
| 184행 | truthy: !draft.result | recallPath(data.nodes, t.id)<br>                      .map((n) => n.name)<br>call<br>전달 콜백: H-f4dc2e8ea985 |
| 184행 | truthy: !draft.result | recallPath(data.nodes, t.id)<br>call |

반환/조기 중단: 181행 <render> [truthy: !draft.result]

## H-ffcfd6da3dfc

**@callback:input.topics.some** · [src/ui/topic-memory-generator.tsx:180](../../../src/ui/topic-memory-generator.tsx#L180)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f4dc2e8ea985

**@callback:recallPath(data.nodes, t.id)
                      .map** · [src/ui/topic-memory-generator.tsx:185](../../../src/ui/topic-memory-generator.tsx#L185)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6c4ee900267f

**@onChange** · [src/ui/topic-memory-generator.tsx:194](../../../src/ui/topic-memory-generator.tsx#L194)

분기 조건과 가능한 갈림길:

- B-4b2e479d2382 · ConditionalExpression · e.target.checked → truthy / falsy; 바깥 조건: truthy: !draft.result (196행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 195행 | truthy: !draft.result | updateScope(e.target.checked ? [...input.topics.map((n) => n.id), t.id] : input.topics.filter((n) => n.id !== t.id).map((n) => n.id))<br>call → [H-35e7e64a7027](ui__topic-memory-generator.md#h-35e7e64a7027) |
| 197행 | truthy: !draft.result ∧ truthy: e.target.checked | input.topics.map((n) => n.id)<br>call<br>전달 콜백: H-ecde0ba10b47 |
| 198행 | truthy: !draft.result ∧ falsy: e.target.checked | input.topics.filter((n) => n.id !== t.id).map((n) => n.id)<br>call<br>전달 콜백: H-f3cdd585bc18 |
| 198행 | truthy: !draft.result ∧ falsy: e.target.checked | input.topics.filter((n) => n.id !== t.id)<br>call<br>전달 콜백: H-e6f034d52373 |

## H-ecde0ba10b47

**@callback:input.topics.map** · [src/ui/topic-memory-generator.tsx:197](../../../src/ui/topic-memory-generator.tsx#L197)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e6f034d52373

**@callback:input.topics.filter** · [src/ui/topic-memory-generator.tsx:198](../../../src/ui/topic-memory-generator.tsx#L198)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f3cdd585bc18

**@callback:input.topics.filter((n) => n.id !== t.id).map** · [src/ui/topic-memory-generator.tsx:198](../../../src/ui/topic-memory-generator.tsx#L198)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3b5259483057

**@onChange** · [src/ui/topic-memory-generator.tsx:210](../../../src/ui/topic-memory-generator.tsx#L210)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 211행 | truthy: !draft.result | updateScope(input.topics.map((t) => t.id), Number(e.target.value))<br>call → [H-35e7e64a7027](ui__topic-memory-generator.md#h-35e7e64a7027) |
| 212행 | truthy: !draft.result | input.topics.map((t) => t.id)<br>call<br>전달 콜백: H-06e0cc7a1284 |
| 213행 | truthy: !draft.result | Number(e.target.value)<br>call |

## H-06e0cc7a1284

**@callback:input.topics.map** · [src/ui/topic-memory-generator.tsx:212](../../../src/ui/topic-memory-generator.tsx#L212)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b09f63dd826c

**@callback:[1, 3, 5, 10, 20, 30].map** · [src/ui/topic-memory-generator.tsx:217](../../../src/ui/topic-memory-generator.tsx#L217)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-71ef66904bcf

**@onChange** · [src/ui/topic-memory-generator.tsx:230](../../../src/ui/topic-memory-generator.tsx#L230)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 231행 | truthy: !draft.result | updateScope(input.topics.map((t) => t.id), input.count, e.target.value)<br>call → [H-35e7e64a7027](ui__topic-memory-generator.md#h-35e7e64a7027) |
| 232행 | truthy: !draft.result | input.topics.map((t) => t.id)<br>call<br>전달 콜백: H-3c1f31a532b6 |

## H-3c1f31a532b6

**@callback:input.topics.map** · [src/ui/topic-memory-generator.tsx:232](../../../src/ui/topic-memory-generator.tsx#L232)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-63f9fd6b1e68

**@onClick** · [src/ui/topic-memory-generator.tsx:242](../../../src/ui/topic-memory-generator.tsx#L242)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 242행 | truthy: !draft.result | generate()<br>call → [H-40b836d6cf99](ui__topic-memory-generator.md#h-40b836d6cf99) |

## H-3a0d57c8d5ba

**@callback:input.topics.map** · [src/ui/topic-memory-generator.tsx:256](../../../src/ui/topic-memory-generator.tsx#L256)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 256행 | truthy: result | t.path.map((n) => n.name).join(' › ')<br>call |
| 256행 | truthy: result | t.path.map((n) => n.name)<br>call<br>전달 콜백: H-6f379debb088 |

## H-6f379debb088

**@callback:t.path.map** · [src/ui/topic-memory-generator.tsx:256](../../../src/ui/topic-memory-generator.tsx#L256)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-8a6c1df82c65

**@callback:occurrenceRows** · [src/ui/topic-memory-generator.tsx:263](../../../src/ui/topic-memory-generator.tsx#L263)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 263행 | truthy: result ∧ truthy: result.diagnostics | JSON.stringify(diagnostic)<br>call |

## H-fd10e044fa3f

**@callback:occurrenceRows(result.diagnostics, diagnostic => JSON.stringify(diagnostic)).map** · [src/ui/topic-memory-generator.tsx:263](../../../src/ui/topic-memory-generator.tsx#L263)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a85430417f4a

**@callback:draft.items.map** · [src/ui/topic-memory-generator.tsx:271](../../../src/ui/topic-memory-generator.tsx#L271)

분기 조건과 가능한 갈림길:

- B-589735f3503b · IfStatement · !original → truthy / falsy; 바깥 조건: truthy: result (273행).
- B-e68ce77844ec · ConditionalExpression · saved.deletedAt → truthy / falsy; 바깥 조건: truthy: result ∧ truthy: saved (334행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 272행 | truthy: result | result.cards.find((c) => c.id === i.id)<br>call<br>전달 콜백: H-9c2e4db77765 |
| 279행 | truthy: result | encodeURIComponent(result.id)<br>call |
| 279행 | truthy: result | encodeURIComponent(i.id)<br>call |
| 292행 | truthy: result | input.topics.find((t) => t.id === original.topicId)<br>call<br>전달 콜백: H-3ed358003d04 |

반환/조기 중단: 274행 <render> [truthy: result ∧ truthy: !original]; 288행 <render> [truthy: result]

## H-9c2e4db77765

**@callback:result.cards.find** · [src/ui/topic-memory-generator.tsx:272](../../../src/ui/topic-memory-generator.tsx#L272)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3ed358003d04

**@callback:input.topics.find** · [src/ui/topic-memory-generator.tsx:292](../../../src/ui/topic-memory-generator.tsx#L292)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d9cbc8d04e2a

**@onChange** · [src/ui/topic-memory-generator.tsx:298](../../../src/ui/topic-memory-generator.tsx#L298)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 298행 | truthy: result | patchItem(i.id, { included: e.target.checked })<br>call → [H-6d073b901211](ui__topic-memory-generator.md#h-6d073b901211) |

## H-ef8b67de2b02

**@onChange** · [src/ui/topic-memory-generator.tsx:306](../../../src/ui/topic-memory-generator.tsx#L306)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 306행 | truthy: result | patchItem(i.id, { question: e.target.value, reviewed: false })<br>call → [H-6d073b901211](ui__topic-memory-generator.md#h-6d073b901211) |

## H-9f8a81dfa405

**@onChange** · [src/ui/topic-memory-generator.tsx:314](../../../src/ui/topic-memory-generator.tsx#L314)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 314행 | truthy: result | patchItem(i.id, { answer: e.target.value, reviewed: false })<br>call → [H-6d073b901211](ui__topic-memory-generator.md#h-6d073b901211) |

## H-10d75e1d6a2f

**@onChange** · [src/ui/topic-memory-generator.tsx:330](../../../src/ui/topic-memory-generator.tsx#L330)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 330행 | truthy: result | patchItem(i.id, { reviewed: e.target.checked })<br>call → [H-6d073b901211](ui__topic-memory-generator.md#h-6d073b901211) |

## H-b782dd5bc639

**@callback:selected.some** · [src/ui/topic-memory-generator.tsx:354](../../../src/ui/topic-memory-generator.tsx#L354)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 354행 | truthy: result ∧ falsy: disabled \|\|<br>                composing \|\|<br>                !selected.length ∧ falsy: !i.reviewed | i.question.trim()<br>call |
| 354행 | truthy: result ∧ falsy: disabled \|\|<br>                composing \|\|<br>                !selected.length ∧ falsy: !i.reviewed \|\| !i.question.trim() | i.answer.trim()<br>call |

## H-97aef1fcc24b

**@onClick** · [src/ui/topic-memory-generator.tsx:362](../../../src/ui/topic-memory-generator.tsx#L362)

분기 조건과 가능한 갈림길:

- B-eb26428e5aaf · IfStatement · onArchive() → truthy / falsy; 바깥 조건: truthy: result (363행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 363행 | truthy: result | onArchive()<br>preservation-boundary |
| 363행 | truthy: result ∧ truthy: onArchive() | onChange({ input, result: null, items: [] })<br>call |

