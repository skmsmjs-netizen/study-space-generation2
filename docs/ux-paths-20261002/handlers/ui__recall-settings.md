# src/ui/recall-settings.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-6ca5caaf7b35

**RecallSettings** · [src/ui/recall-settings.tsx:9](../../../src/ui/recall-settings.tsx#L9)

분기 조건과 가능한 갈림길:

- B-674094081ec2 · ConditionalExpression · deckId → truthy / falsy; 바깥 조건: 별도 조건식 없음 (33행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 11행 | 별도 조건식 없음 | useState(() => restored?.options ?? recallOptions(data, deckId))<br>call<br>전달 콜백: H-3805d49c8231 |
| 12행 | 별도 조건식 없음 | useState(() => restored?.learning ?? options.learningMinutes.join(', '))<br>call<br>전달 콜백: H-9a92e016134f |
| 13행 | 별도 조건식 없음 | useState(() => restored?.relearning ?? options.relearningMinutes.join(', '))<br>call<br>전달 콜백: H-21a933642219 |
| 14행 | 별도 조건식 없음 | useState('')<br>call |
| 14행 | 별도 조건식 없음 | useState('')<br>call |
| 15행 | 별도 조건식 없음 | useState(() => recallPreference(data, deckId))<br>call<br>전달 콜백: H-22d30b005725 |
| 16행 | 별도 조건식 없음 | useState(() => restored?.id ?? base?.id ?? deckId ?? crypto.randomUUID())<br>call<br>전달 콜백: H-1f70aff3dc39 |
| 17행 | 별도 조건식 없음 | useState(restored?.version ?? base?.version ?? 0)<br>call |
| 18행 | 별도 조건식 없음 | useState(restored?.name ?? base?.deckName)<br>call |
| 32행 | 별도 조건식 없음 | recallPreference(data, deckId)<br>call |
| 32행 | falsy: name !== recallPreference(data, deckId)?.deckName | JSON.stringify(options)<br>call |
| 32행 | falsy: name !== recallPreference(data, deckId)?.deckName | JSON.stringify(recallOptions(data, deckId))<br>call |
| 32행 | falsy: name !== recallPreference(data, deckId)?.deckName | recallOptions(data, deckId)<br>call |
| 32행 | falsy: name !== recallPreference(data, deckId)?.deckName \|\| JSON.stringify(options) !== JSON.stringify(recallOptions(data, deckId)) | options.learningMinutes.join(', ')<br>call |
| 32행 | falsy: name !== recallPreference(data, deckId)?.deckName \|\| JSON.stringify(options) !== JSON.stringify(recallOptions(data, deckId)) \|\| learning !== options.learningMinutes.join(', ') | options.relearningMinutes.join(', ')<br>call |
| 33행 | truthy: deckId | recallPreference(data, deckId)<br>call |
| 37행 | 별도 조건식 없음 | Math.round(options.retention * 100)<br>call |

반환/조기 중단: 33행 <render> [별도 조건식 없음]

## H-3805d49c8231

**@callback:useState** · [src/ui/recall-settings.tsx:11](../../../src/ui/recall-settings.tsx#L11)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 11행 | nullish: restored?.options | recallOptions(data, deckId)<br>call |

## H-9a92e016134f

**@callback:useState** · [src/ui/recall-settings.tsx:12](../../../src/ui/recall-settings.tsx#L12)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | nullish: restored?.learning | options.learningMinutes.join(', ')<br>call |

## H-21a933642219

**@callback:useState** · [src/ui/recall-settings.tsx:13](../../../src/ui/recall-settings.tsx#L13)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 13행 | nullish: restored?.relearning | options.relearningMinutes.join(', ')<br>call |

## H-22d30b005725

**@callback:useState** · [src/ui/recall-settings.tsx:15](../../../src/ui/recall-settings.tsx#L15)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 15행 | 별도 조건식 없음 | recallPreference(data, deckId)<br>call |

## H-1f70aff3dc39

**@callback:useState** · [src/ui/recall-settings.tsx:16](../../../src/ui/recall-settings.tsx#L16)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 16행 | nullish: restored?.id ?? base?.id ?? deckId | crypto.randomUUID()<br>call |

## H-70911937f2f8

**remember** · [src/ui/recall-settings.tsx:19](../../../src/ui/recall-settings.tsx#L19)

분기 조건과 가능한 갈림길:

- B-422d9cb82fa1 · IfStatement · session && persist → truthy / falsy; 바깥 조건: 별도 조건식 없음 (20행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 20행 | truthy: session && persist | persist({ ...session, settingsDrafts: { ...session.settingsDrafts, [deckId ?? 'default']: { id, version, options, learning, relearning, name, ...patch } } })<br>call |

## H-2369db483818

**save** · [src/ui/recall-settings.tsx:22](../../../src/ui/recall-settings.tsx#L22)

분기 조건과 가능한 갈림길:

- B-19784e340543 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (23행).
- B-8740e8033528 · ConditionalExpression · deckId → truthy / falsy; 바깥 조건: 별도 조건식 없음 (27행).
- B-9ba695c2200e · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (30행).
- B-79a31b15fa85 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (30행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 25행 | 별도 조건식 없음 | parse(learning)<br>call → [H-aa0fdb72c015](ui__recall-settings.md#h-aa0fdb72c015) |
| 25행 | 별도 조건식 없음 | parse(relearning)<br>call → [H-aa0fdb72c015](ui__recall-settings.md#h-aa0fdb72c015) |
| 25행 | 별도 조건식 없음 | validateRecallOptions(next)<br>call |
| 26행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |
| 27행 | 별도 조건식 없음 | repository.execute({ type: 'saveRecallPreferences', id, expectedVersion: version, options: next, ...(deckId ? { deckName: name } : {}), opId: crypto.randomUUID(), at: new Date().toISOString(), userId: snapshot.userId, namespace: snapshot.namespace })<br>call |
| 28행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 28행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 29행 | 별도 조건식 없음 | saved.recallPreferences!.find(row => row.id === id)<br>call<br>전달 콜백: H-cd149a5fd9c4 |
| 29행 | 별도 조건식 없음 | setVersion(nextVersion)<br>state-update |
| 29행 | 별도 조건식 없음 | setOptions(next)<br>state-update |
| 29행 | 별도 조건식 없음 | next.learningMinutes.join(', ')<br>call |
| 29행 | 별도 조건식 없음 | next.relearningMinutes.join(', ')<br>call |
| 29행 | 별도 조건식 없음 | setLearning(normalizedLearning)<br>state-update |
| 29행 | 별도 조건식 없음 | setRelearning(normalizedRelearning)<br>state-update |
| 29행 | 별도 조건식 없음 | remember({ version: nextVersion, options: next, learning: normalizedLearning, relearning: normalizedRelearning })<br>call → [H-70911937f2f8](ui__recall-settings.md#h-70911937f2f8) |
| 29행 | 별도 조건식 없음 | onSaved(saved)<br>call |
| 29행 | 별도 조건식 없음 | setError('')<br>state-update |
| 29행 | 별도 조건식 없음 | setNotice('설정을 저장했습니다. 다음 자기 평가부터 적용됩니다.')<br>state-update |
| 30행 | exception: e | setError(e instanceof Error ? e.message : '설정을 저장하지 못했습니다.')<br>state-update |

## H-aa0fdb72c015

**parse** · [src/ui/recall-settings.tsx:24](../../../src/ui/recall-settings.tsx#L24)

분기 조건과 가능한 갈림길:

- B-f07f0864a291 · ConditionalExpression · !text.trim() → truthy / falsy; 바깥 조건: 별도 조건식 없음 (24행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 24행 | 별도 조건식 없음 | text.trim()<br>call |
| 24행 | falsy: !text.trim() | text.split(',').map(v => v.trim() === '' ? NaN : Number(v.trim()))<br>call<br>전달 콜백: H-0e390b28b48a |
| 24행 | falsy: !text.trim() | text.split(',')<br>call |

## H-0e390b28b48a

**@callback:text.split(',').map** · [src/ui/recall-settings.tsx:24](../../../src/ui/recall-settings.tsx#L24)

분기 조건과 가능한 갈림길:

- B-4f9086eacc04 · ConditionalExpression · v.trim() === '' → truthy / falsy; 바깥 조건: falsy: !text.trim() (24행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 24행 | falsy: !text.trim() | v.trim()<br>call |
| 24행 | falsy: !text.trim() ∧ falsy: v.trim() === '' | Number(v.trim())<br>call |
| 24행 | falsy: !text.trim() ∧ falsy: v.trim() === '' | v.trim()<br>call |

## H-cd149a5fd9c4

**@callback:saved.recallPreferences!.find** · [src/ui/recall-settings.tsx:29](../../../src/ui/recall-settings.tsx#L29)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-db7dc0186ada

**@onChange** · [src/ui/recall-settings.tsx:34](../../../src/ui/recall-settings.tsx#L34)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 34행 | truthy: deckId | setName(e.target.value)<br>state-update |
| 34행 | truthy: deckId | remember({ name: e.target.value })<br>call → [H-70911937f2f8](ui__recall-settings.md#h-70911937f2f8) |

## H-93406f6bf85e

**@onChange** · [src/ui/recall-settings.tsx:36](../../../src/ui/recall-settings.tsx#L36)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 36행 | 별도 조건식 없음 | Number(e.target.value)<br>call |
| 36행 | 별도 조건식 없음 | setOptions(next)<br>state-update |
| 36행 | 별도 조건식 없음 | remember({ options: next })<br>call → [H-70911937f2f8](ui__recall-settings.md#h-70911937f2f8) |

## H-04cef9dbb493

**@onChange** · [src/ui/recall-settings.tsx:37](../../../src/ui/recall-settings.tsx#L37)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 37행 | 별도 조건식 없음 | Number(e.target.value)<br>call |
| 37행 | 별도 조건식 없음 | setOptions(next)<br>state-update |
| 37행 | 별도 조건식 없음 | remember({ options: next })<br>call → [H-70911937f2f8](ui__recall-settings.md#h-70911937f2f8) |

## H-8f49e980b59c

**@onChange** · [src/ui/recall-settings.tsx:38](../../../src/ui/recall-settings.tsx#L38)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 38행 | 별도 조건식 없음 | setLearning(e.target.value)<br>state-update |
| 38행 | 별도 조건식 없음 | remember({ learning: e.target.value })<br>call → [H-70911937f2f8](ui__recall-settings.md#h-70911937f2f8) |

## H-27c029e51d66

**@onChange** · [src/ui/recall-settings.tsx:39](../../../src/ui/recall-settings.tsx#L39)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 39행 | 별도 조건식 없음 | setRelearning(e.target.value)<br>state-update |
| 39행 | 별도 조건식 없음 | remember({ relearning: e.target.value })<br>call → [H-70911937f2f8](ui__recall-settings.md#h-70911937f2f8) |

## H-17f7a6a23e7f

**@onChange** · [src/ui/recall-settings.tsx:40](../../../src/ui/recall-settings.tsx#L40)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 40행 | 별도 조건식 없음 | Number(e.target.value)<br>call |
| 40행 | 별도 조건식 없음 | setOptions(next)<br>state-update |
| 40행 | 별도 조건식 없음 | remember({ options: next })<br>call → [H-70911937f2f8](ui__recall-settings.md#h-70911937f2f8) |

## H-ecd69238e54c

**@onChange** · [src/ui/recall-settings.tsx:42](../../../src/ui/recall-settings.tsx#L42)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 42행 | 별도 조건식 없음 | setOptions(next)<br>state-update |
| 42행 | 별도 조건식 없음 | remember({ options: next })<br>call → [H-70911937f2f8](ui__recall-settings.md#h-70911937f2f8) |

## H-217985f50ac6

**@onApplied** · [src/ui/recall-settings.tsx:46](../../../src/ui/recall-settings.tsx#L46)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 47행 | 별도 조건식 없음 | recallOptions(saved, deckId)<br>call |
| 47행 | 별도 조건식 없음 | recallPreference(saved, deckId)<br>call |
| 47행 | 별도 조건식 없음 | setOptions(options)<br>state-update |
| 47행 | 별도 조건식 없음 | setVersion(version)<br>state-update |
| 47행 | 별도 조건식 없음 | remember({ options, version })<br>call → [H-70911937f2f8](ui__recall-settings.md#h-70911937f2f8) |
| 47행 | 별도 조건식 없음 | onSaved(saved)<br>call |

