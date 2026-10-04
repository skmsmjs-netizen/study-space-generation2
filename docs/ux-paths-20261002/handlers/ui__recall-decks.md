# src/ui/recall-decks.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-0f4983eb0568

**RecallDecks** · [src/ui/recall-decks.tsx:7](../../../src/ui/recall-decks.tsx#L7)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 8행 | 별도 조건식 없음 | useState('')<br>call |
| 9행 | 별도 조건식 없음 | recallDecks(data).map(deck => <option key={deck.id} value={deck.id}>{deck.deckName}</option>)<br>call<br>전달 콜백: H-c1d26addf2cd |
| 9행 | 별도 조건식 없음 | recallDecks(data)<br>call |

반환/조기 중단: 9행 <render> [별도 조건식 없음]

## H-63aaec4f05b4

**@onChange** · [src/ui/recall-decks.tsx:9](../../../src/ui/recall-decks.tsx#L9)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 9행 | 별도 조건식 없음 | onChange(e.target.value)<br>call |

## H-c1d26addf2cd

**@callback:recallDecks(data).map** · [src/ui/recall-decks.tsx:9](../../../src/ui/recall-decks.tsx#L9)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-2431cad302e0

**@onChange** · [src/ui/recall-decks.tsx:11](../../../src/ui/recall-decks.tsx#L11)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 11행 | 별도 조건식 없음 | persist({ ...session, deckCreation: { id: session.deckCreation?.id ?? crypto.randomUUID(), name: e.target.value } })<br>call |
| 11행 | nullish: session.deckCreation?.id | crypto.randomUUID()<br>call |

## H-d1c0ac28dca6

**@onClick** · [src/ui/recall-decks.tsx:12](../../../src/ui/recall-decks.tsx#L12)

분기 조건과 가능한 갈림길:

- B-864af49bae3f · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (12행).
- B-d13a7c38346c · ConditionalExpression · old?.deckName === draft.name → truthy / falsy; 바깥 조건: 별도 조건식 없음 (14행).
- B-c2810adf1617 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (16행).
- B-62a11ba0b2d4 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (16행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 13행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |
| 14행 | falsy: old?.deckName === draft.name | repository.execute({ type: 'saveRecallPreferences', id: draft.id, deckName: draft.name, options: recallOptions(snapshot), expectedVersion: old?.version ?? 0, opId: crypto.randomUUID(), at: new Date().toISOString(), userId: snapshot.userId, namespace: snapshot.namespace })<br>call |
| 14행 | falsy: old?.deckName === draft.name | recallOptions(snapshot)<br>call |
| 14행 | falsy: old?.deckName === draft.name | crypto.randomUUID()<br>call |
| 14행 | falsy: old?.deckName === draft.name | new Date().toISOString()<br>call |
| 15행 | 별도 조건식 없음 | onSaved(saved)<br>call |
| 15행 | 별도 조건식 없음 | persist({ ...session, deckCreation: undefined, deckId: draft.id, currentId: null, seen: [] })<br>call |
| 15행 | 별도 조건식 없음 | setError('')<br>state-update |
| 16행 | exception: e | setError(e instanceof Error ? e.message : '덱을 저장하지 못했습니다. 이름은 초안에 남아 있습니다.')<br>state-update |

