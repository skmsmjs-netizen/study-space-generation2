# src/ui/recall-import.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-b85490e81698

**RecallImport** · [src/ui/recall-import.tsx:10](../../../src/ui/recall-import.tsx#L10)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 11행 | 별도 조건식 없음 | useState(null)<br>call |
| 11행 | 별도 조건식 없음 | useState('')<br>call |
| 11행 | 별도 조건식 없음 | useState(false)<br>call |
| 11행 | 별도 조건식 없음 | useState(false)<br>call |
| 12행 | 별도 조건식 없음 | useState('')<br>call |
| 12행 | 별도 조건식 없음 | useState('')<br>call |
| 12행 | 별도 조건식 없음 | useState(false)<br>call |
| 13행 | 별도 조건식 없음 | useRef(null)<br>call |
| 13행 | 별도 조건식 없음 | useRef(false)<br>call |
| 13행 | 별도 조건식 없음 | useRef(session)<br>call |
| 15행 | 별도 조건식 없음 | useEffect(() => () => { worker.current?.terminate(); stopped.current = true; }, [])<br>call<br>전달 콜백: H-c8acf9b42f71 |
| 70행 | 별도 조건식 없음 | (data.recallCards ?? []).filter(card => card.importSource).map(card => card.importSource!.key)<br>call<br>전달 콜백: H-531f12256933 |
| 70행 | 별도 조건식 없음 | (data.recallCards ?? []).filter(card => card.importSource)<br>call<br>전달 콜백: H-3d78b33c9181 |
| 76행 | 별도 조건식 없음 | topics.map(topic => <option key={topic.id} value={topic.id}>{data.subjects.find(subject => subject.id === topic.subjectId)?.name} / {topic.name}</option>)<br>call<br>전달 콜백: H-81d095a0e851 |
| 78행 | truthy: !target.keepDecks | recallDecks(data).map(deck => <option key={deck.id} value={deck.id}>{deck.deckName}</option>)<br>call<br>전달 콜백: H-ccacc55c6051 |
| 78행 | truthy: !target.keepDecks | recallDecks(data)<br>call |
| 82행 | truthy: preview | preview.items.slice(0, 10).map(item => <article key={item.source.key}><p>{item.source.deck} · {item.front}</p><details><summary>답변 확인</summary><p>{item.reference}</p></details></article>)<br>call<br>전달 콜백: H-8bba01e24f83 |
| 82행 | truthy: preview | preview.items.slice(0, 10)<br>call |
| 83행 | truthy: preview ∧ truthy: !!preview.skipped.length | occurrenceRows(preview.skipped.slice(0, 50), item => JSON.stringify(item)).map(({value: item, key}) => <p key={key}>{item.key} · {item.reason}</p>)<br>call<br>전달 콜백: H-165d2509d2a3 |
| 83행 | truthy: preview ∧ truthy: !!preview.skipped.length | occurrenceRows(preview.skipped.slice(0, 50), item => JSON.stringify(item))<br>call<br>전달 콜백: H-ceed1dce1e3a |
| 83행 | truthy: preview ∧ truthy: !!preview.skipped.length | preview.skipped.slice(0, 50)<br>call |
| 84행 | truthy: preview | preview.warnings.map(warning => <p key={warning} role="status">{warning}</p>)<br>call<br>전달 콜백: H-e5b790f30109 |

반환/조기 중단: 72행 <render> [별도 조건식 없음]

## H-c8acf9b42f71

**@callback:useEffect** · [src/ui/recall-import.tsx:15](../../../src/ui/recall-import.tsx#L15)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-772b293b249a

**change** · [src/ui/recall-import.tsx:17](../../../src/ui/recall-import.tsx#L17)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 17행 | 별도 조건식 없음 | persist({ ...session, importTarget: { ...target, ...patch } })<br>call |

## H-0222e141dd5a

**read** · [src/ui/recall-import.tsx:18](../../../src/ui/recall-import.tsx#L18) · async

분기 조건과 가능한 갈림길:

- B-d7f6159f88b9 · IfStatement · !file || disabled || busy → truthy / falsy; 바깥 조건: 별도 조건식 없음 (19행).
- B-5279d67c871e · IfStatement · !/\.apkg$/i.test(file.name) || file.size > FILE_LIMIT → truthy / falsy; 바깥 조건: 별도 조건식 없음 (21행).
- B-da6c05027502 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (29행).
- B-ef0464ffe300 · IfStatement · worker.current === job → truthy / falsy; 바깥 조건: 별도 조건식 없음 (29행).
- B-522a24bd1519 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (30행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 20행 | 별도 조건식 없음 | setError('')<br>state-update |
| 20행 | 별도 조건식 없음 | setNotice('')<br>state-update |
| 20행 | 별도 조건식 없음 | setPreview(null)<br>state-update |
| 20행 | 별도 조건식 없음 | setAcknowledged(false)<br>state-update |
| 20행 | 별도 조건식 없음 | setName(file.name)<br>state-update |
| 21행 | 별도 조건식 없음 | /\.apkg$/i.test(file.name)<br>call |
| 21행 | truthy: !/\.apkg$/i.test(file.name) \|\| file.size > FILE_LIMIT | setError('128MB 이하의 .apkg 파일을 선택해 주세요. 큰 덱은 Anki에서 나누거나 미디어 없이 내보낼 수 있습니다.')<br>state-update |
| 22행 | 별도 조건식 없음 | setReading(true)<br>state-update |
| 29행 | 별도 조건식 없음 | file.arrayBuffer()<br>call |
| 29행 | truthy: worker.current === job | job.postMessage(bytes, [bytes])<br>call |
| 30행 | exception: exception | job.terminate()<br>call |
| 30행 | exception: exception | setReading(false)<br>state-update |
| 30행 | exception: exception | setError('파일을 읽지 못했습니다. 원본 파일은 그대로입니다.')<br>state-update |

반환/조기 중단: 19행 <render> [truthy: !file || disabled || busy]; 21행 <render> [truthy: !/\.apkg$/i.test(file.name) || file.size > FILE_LIMIT]

## H-0bae3989c822

**execute** · [src/ui/recall-import.tsx:32](../../../src/ui/recall-import.tsx#L32) · async

분기 조건과 가능한 갈림길:

- B-f969b051944b · IfStatement · !persist({ ...latest.current, pendingImport: command }) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (33행).
- B-3e7171f32be5 · IfStatement · status && status.phase !== 'saved' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (38행).
- B-00aaa66428af · IfStatement · !persist({ ...latest.current, pendingImport: undefined }) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (39행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 33행 | 별도 조건식 없음 | persist({ ...latest.current, pendingImport: command })<br>call |
| 33행 | truthy: !persist({ ...latest.current, pendingImport: command }) | Error('가져오기 요청을 보존하지 못했습니다. 공간을 확보한 뒤 다시 시도해 주세요.')<br>call |
| 35행 | 별도 조건식 없음 | repository.execute(command)<br>call |
| 35행 | 별도 조건식 없음 | onSaved(saved)<br>call |
| 38행 | truthy: status && status.phase !== 'saved' | Error(status.message \|\| '서버에 아직 저장하지 못했습니다. 요청과 원문은 보존했습니다.')<br>call |
| 39행 | 별도 조건식 없음 | persist({ ...latest.current, pendingImport: undefined })<br>call |
| 39행 | truthy: !persist({ ...latest.current, pendingImport: undefined }) | Error('카드는 저장했으나 확인 초안을 정리하지 못했습니다. 다시 시도해도 중복 생성하지 않습니다.')<br>call |

throw: 33행 Error('가져오기 요청을 보존하지 못했습니다. 공간을 확보한 뒤 다시 시도해 주세요.'); 38행 Error(status.message || '서버에 아직 저장하지 못했습니다. 요청과 원문은 보존했습니다.'); 39행 Error('카드는 저장했으나 확인 초안을 정리하지 못했습니다. 다시 시도해도 중복 생성하지 않습니다.')

## H-e156ef05b829

**start** · [src/ui/recall-import.tsx:44](../../../src/ui/recall-import.tsx#L44) · async

분기 조건과 가능한 갈림길:

- B-47cf075e18ae · IfStatement · disabled || busy || !preview?.items.length || !target.topicId → truthy / falsy; 바깥 조건: 별도 조건식 없음 (45행).
- B-ae3b4b71be51 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (47행).
- B-cf6012340ed1 · IfStatement · target.keepDecks → truthy / falsy; 바깥 조건: 별도 조건식 없음 (50행).
- B-d4c4968ef7d4 · IfStatement · existing → truthy / falsy; 바깥 조건: truthy: target.keepDecks (52행).
- B-33f620617fa5 · IfStatement · stopped.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (58행).
- B-7fe187973acb · ConditionalExpression · target.keepDecks → truthy / falsy; 바깥 조건: 별도 조건식 없음 (59행).
- B-30f9b1b2551f · ConditionalExpression · target.deckId === 'default' → truthy / falsy; 바깥 조건: falsy: target.keepDecks (59행).
- B-1b53ab93cf6e · IfStatement · batch.length && (batch.length >= 100 || size + length > 500000) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (61행).
- B-f396085bc473 · IfStatement · stopped.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (62행).
- B-1f92e915505b · ConditionalExpression · stopped.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (66행).
- B-540daad65e31 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (67행).
- B-dfd5742fb2e7 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (67행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 46행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 46행 | 별도 조건식 없음 | setError('')<br>state-update |
| 46행 | 별도 조건식 없음 | setNotice('가져올 카드를 저장하고 있습니다.')<br>state-update |
| 49행 | 별도 조건식 없음 | preview.items.map(item => item.source.deck)<br>call<br>전달 콜백: H-3dc5ae21da28 |
| 51행 | truthy: target.keepDecks | repository.getSnapshot()<br>call |
| 51행 | truthy: target.keepDecks | recallDecks(snapshot).find(deck => deck.deckName === deckName)<br>call<br>전달 콜백: H-f06fcc27f9b5 |
| 51행 | truthy: target.keepDecks | recallDecks(snapshot)<br>call |
| 52행 | truthy: target.keepDecks ∧ truthy: existing | deckIds.set(deckName, existing.id)<br>call |
| 53행 | truthy: target.keepDecks ∧ falsy: existing | crypto.randomUUID()<br>call |
| 53행 | truthy: target.keepDecks ∧ falsy: existing | repository.execute({ ...context(), type: 'saveRecallPreferences', id, expectedVersion: 0, deckName, options: recallOptions(snapshot) })<br>call |
| 53행 | truthy: target.keepDecks ∧ falsy: existing | context()<br>call → [H-fe20d435c58f](ui__recall-import.md#h-fe20d435c58f) |
| 53행 | truthy: target.keepDecks ∧ falsy: existing | recallOptions(snapshot)<br>call |
| 53행 | truthy: target.keepDecks ∧ falsy: existing | onSaved(saved)<br>call |
| 53행 | truthy: target.keepDecks ∧ falsy: existing | deckIds.set(deckName, id)<br>call |
| 59행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 59행 | truthy: target.keepDecks | deckIds.get(source.source.deck)<br>call |
| 60행 | 별도 조건식 없음 | JSON.stringify(item)<br>call |
| 61행 | truthy: batch.length && (batch.length >= 100 \|\| size + length > 500000) | commit()<br>mutation-request → [H-95eaf0cf988c](ui__recall-import.md#h-95eaf0cf988c) |
| 63행 | 별도 조건식 없음 | batch.push(item)<br>call |
| 65행 | 별도 조건식 없음 | commit()<br>mutation-request → [H-95eaf0cf988c](ui__recall-import.md#h-95eaf0cf988c) |
| 66행 | 별도 조건식 없음 | setNotice(stopped.current ? `가져오기를 중단했습니다. 처리한 ${handled}개는 남아 있습니다. 같은 파일을 다시 선택하면 이어서 가져올 수 있습니다.` : `카드 ${handled}개를 처리했습니다. 새 카드를 추가하고 이미 가져온 카드는 선택한 기준대로 유지했습니다. ${preview.skipped.length}개는 지원 범위 밖이어서 가져오지 않았습니다.`)<br>state-update |
| 67행 | exception: e | setError(e instanceof Error ? e.message : '카드를 저장하지 못했습니다. 같은 파일을 다시 선택해 이어갈 수 있습니다.')<br>state-update |
| 68행 | always-after-try: try 완료 또는 예외 이후 | setBusy(false)<br>state-update |

반환/조기 중단: 45행 <render> [truthy: disabled || busy || !preview?.items.length || !target.topicId]

## H-fe20d435c58f

**context** · [src/ui/recall-import.tsx:48](../../../src/ui/recall-import.tsx#L48)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 48행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |
| 48행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 48행 | 별도 조건식 없음 | new Date().toISOString()<br>call |

반환/조기 중단: 48행 { userId: snapshot.userId, namespace: snapshot.namespace, opId: crypto.randomUUID(), at: new Date().toISOString() } [별도 조건식 없음]

## H-3dc5ae21da28

**@callback:preview.items.map** · [src/ui/recall-import.tsx:49](../../../src/ui/recall-import.tsx#L49)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f06fcc27f9b5

**@callback:recallDecks(snapshot).find** · [src/ui/recall-import.tsx:51](../../../src/ui/recall-import.tsx#L51)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-95eaf0cf988c

**commit** · [src/ui/recall-import.tsx:56](../../../src/ui/recall-import.tsx#L56) · async

분기 조건과 가능한 갈림길:

- B-2b23694547c7 · IfStatement · !batch.length || stopped.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (56행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 56행 | 별도 조건식 없음 | execute({ ...context(), type: 'importRecallCards', updateUnedited: target.updateUnedited, items: batch })<br>call → [H-0bae3989c822](ui__recall-import.md#h-0bae3989c822) |
| 56행 | 별도 조건식 없음 | context()<br>call → [H-fe20d435c58f](ui__recall-import.md#h-fe20d435c58f) |
| 56행 | 별도 조건식 없음 | setNotice(`카드 ${handled} / ${preview.items.length}개를 처리했습니다. 기존 답변과 복습 이력은 유지합니다.`)<br>state-update |

반환/조기 중단: 56행 <render> [truthy: !batch.length || stopped.current]

## H-3d78b33c9181

**@callback:(data.recallCards ?? []).filter** · [src/ui/recall-import.tsx:70](../../../src/ui/recall-import.tsx#L70)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-531f12256933

**@callback:(data.recallCards ?? []).filter(card => card.importSource).map** · [src/ui/recall-import.tsx:70](../../../src/ui/recall-import.tsx#L70)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-04716a4652cf

**@onChange** · [src/ui/recall-import.tsx:74](../../../src/ui/recall-import.tsx#L74)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 74행 | 별도 조건식 없음 | read(e.target.files?.[0])<br>call → [H-0222e141dd5a](ui__recall-import.md#h-0222e141dd5a) |

## H-6aabe82fea5e

**@onClick** · [src/ui/recall-import.tsx:75](../../../src/ui/recall-import.tsx#L75)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 75행 | truthy: reading | setReading(false)<br>state-update |
| 75행 | truthy: reading | setNotice('파일 읽기를 취소했습니다.')<br>state-update |

## H-9e94bdb522a8

**@onChange** · [src/ui/recall-import.tsx:76](../../../src/ui/recall-import.tsx#L76)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 76행 | 별도 조건식 없음 | change({ topicId: e.target.value })<br>call → [H-772b293b249a](ui__recall-import.md#h-772b293b249a) |

## H-81d095a0e851

**@callback:topics.map** · [src/ui/recall-import.tsx:76](../../../src/ui/recall-import.tsx#L76)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 76행 | 별도 조건식 없음 | data.subjects.find(subject => subject.id === topic.subjectId)<br>call<br>전달 콜백: H-6aa37696e6b7 |

## H-6aa37696e6b7

**@callback:data.subjects.find** · [src/ui/recall-import.tsx:76](../../../src/ui/recall-import.tsx#L76)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a0425567095c

**@onChange** · [src/ui/recall-import.tsx:77](../../../src/ui/recall-import.tsx#L77)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 77행 | 별도 조건식 없음 | change({ keepDecks: e.target.checked })<br>call → [H-772b293b249a](ui__recall-import.md#h-772b293b249a) |

## H-96acf10b5bdc

**@onChange** · [src/ui/recall-import.tsx:78](../../../src/ui/recall-import.tsx#L78)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 78행 | truthy: !target.keepDecks | change({ deckId: e.target.value })<br>call → [H-772b293b249a](ui__recall-import.md#h-772b293b249a) |

## H-ccacc55c6051

**@callback:recallDecks(data).map** · [src/ui/recall-import.tsx:78](../../../src/ui/recall-import.tsx#L78)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b3efdcc96b11

**@onChange** · [src/ui/recall-import.tsx:79](../../../src/ui/recall-import.tsx#L79)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 79행 | 별도 조건식 없음 | change({ updateUnedited: e.target.checked })<br>call → [H-772b293b249a](ui__recall-import.md#h-772b293b249a) |

## H-8bba01e24f83

**@callback:preview.items.slice(0, 10).map** · [src/ui/recall-import.tsx:82](../../../src/ui/recall-import.tsx#L82)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ceed1dce1e3a

**@callback:occurrenceRows** · [src/ui/recall-import.tsx:83](../../../src/ui/recall-import.tsx#L83)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 83행 | truthy: preview ∧ truthy: !!preview.skipped.length | JSON.stringify(item)<br>call |

## H-165d2509d2a3

**@callback:occurrenceRows(preview.skipped.slice(0, 50), item => JSON.stringify(item)).map** · [src/ui/recall-import.tsx:83](../../../src/ui/recall-import.tsx#L83)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e5b790f30109

**@callback:preview.warnings.map** · [src/ui/recall-import.tsx:84](../../../src/ui/recall-import.tsx#L84)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-86be2b5c1780

**@onChange** · [src/ui/recall-import.tsx:85](../../../src/ui/recall-import.tsx#L85)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 85행 | truthy: preview ∧ truthy: !!preview.skipped.length \|\| !!preview.warnings.length | setAcknowledged(e.target.checked)<br>state-update |

## H-f006cf323fa6

**@onClick** · [src/ui/recall-import.tsx:86](../../../src/ui/recall-import.tsx#L86)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 86행 | truthy: preview | start()<br>call → [H-e156ef05b829](ui__recall-import.md#h-e156ef05b829) |

## H-12379092de0b

**@onClick** · [src/ui/recall-import.tsx:86](../../../src/ui/recall-import.tsx#L86)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1be1cf93650c

**@onClick** · [src/ui/recall-import.tsx:87](../../../src/ui/recall-import.tsx#L87) · async

분기 조건과 가능한 갈림길:

- B-f2f5e9ac14b7 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: truthy: session.pendingImport (87행).
- B-7b218263812a · CatchClause · e → exception; 바깥 조건: truthy: session.pendingImport (87행).
- B-faed12308de1 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: truthy: session.pendingImport ∧ exception: e (87행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 87행 | truthy: session.pendingImport | setBusy(true)<br>state-update |
| 87행 | truthy: session.pendingImport | execute(session.pendingImport!)<br>call → [H-0bae3989c822](ui__recall-import.md#h-0bae3989c822) |
| 87행 | truthy: session.pendingImport | setError('')<br>state-update |
| 87행 | truthy: session.pendingImport | setNotice('보존한 요청을 처리했습니다. 같은 파일을 다시 선택해 나머지를 이어갈 수 있습니다.')<br>state-update |
| 87행 | truthy: session.pendingImport ∧ exception: e | setError(e instanceof Error ? e.message : '요청을 저장하지 못했습니다.')<br>state-update |
| 87행 | truthy: session.pendingImport ∧ always-after-try: try 완료 또는 예외 이후 | setBusy(false)<br>state-update |

