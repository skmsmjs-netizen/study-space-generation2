# src/ui/canvas-concept-editor.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-ed15fa508e9a

**CanvasConceptEditor** · [src/ui/canvas-concept-editor.tsx:17](../../../src/ui/canvas-concept-editor.tsx#L17)

분기 조건과 가능한 갈림길:

- B-211ed1a370be · ConditionalExpression · memo → truthy / falsy; 바깥 조건: 별도 조건식 없음 (85행).
- B-5ee6136d267f · ConditionalExpression · subjectName → truthy / falsy; 바깥 조건: truthy: !memo (113행).
- B-df8605ae6bc5 · ConditionalExpression · memo → truthy / falsy; 바깥 조건: 별도 조건식 없음 (147행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 32행 | 별도 조건식 없음 | useState(() => { let key = ''; try { key = conceptDraftKey(data, memo?.id); return { key, ...readConceptDraft(key), error: '' }; } catch (e) { return { key, raw: null, draft: null, error: e instanceof Error ? e.message : '초안을 읽지 못했습니다.', }; } })<br>call<br>전달 콜백: H-0ee7f2660173 |
| 46행 | 별도 조건식 없음 | useState(() => boot.draft ?? (memo ? editConceptDraft(memo) : newConceptDraft(ownerId)))<br>call<br>전달 콜백: H-310bc4b3fb46 |
| 49행 | 별도 조건식 없음 | useRef(boot.raw)<br>call |
| 50행 | 별도 조건식 없음 | useState(boot.error)<br>call |
| 51행 | 별도 조건식 없음 | useState(false)<br>call |
| 55행 | falsy: data.namespace === 'demo' \|\|<br>    !repository.getCapabilities | repository.getCapabilities().includes('saveMemo')<br>call |
| 55행 | falsy: data.namespace === 'demo' \|\|<br>    !repository.getCapabilities | repository.getCapabilities()<br>call |
| 56행 | 별도 조건식 없음 | data.subjects.find((s) => s.id === draft.ownerId)<br>call<br>전달 콜백: H-cda30cd0e5f3 |
| 97행 | 별도 조건식 없음 | Boolean(boot.error)<br>call |
| 101행 | 별도 조건식 없음 | Boolean(draft.description)<br>call |
| 107행 | 별도 조건식 없음 | Boolean(boot.error)<br>call |
| 145행 | falsy: !ready | Boolean(boot.error)<br>call |
| 145행 | falsy: !ready \|\| Boolean(boot.error) \|\| composing | draft.name.trim()<br>preservation-boundary |

반환/조기 중단: 82행 <render> [별도 조건식 없음]

## H-0ee7f2660173

**@callback:useState** · [src/ui/canvas-concept-editor.tsx:32](../../../src/ui/canvas-concept-editor.tsx#L32)

분기 조건과 가능한 갈림길:

- B-0adb7f5a84fd · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (34행).
- B-4798483cc970 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (37행).
- B-00abbfb73652 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (42행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 35행 | 별도 조건식 없음 | conceptDraftKey(data, memo?.id)<br>preservation-boundary |
| 36행 | 별도 조건식 없음 | readConceptDraft(key)<br>preservation-boundary |

반환/조기 중단: 36행 { key, ...readConceptDraft(key), error: '' } [별도 조건식 없음]; 38행 { key, raw: null, draft: null, error: e instanceof Error ? e.message : '초안을 읽지 못했습니다.', } [exception: e]

## H-310bc4b3fb46

**@callback:useState** · [src/ui/canvas-concept-editor.tsx:47](../../../src/ui/canvas-concept-editor.tsx#L47)

분기 조건과 가능한 갈림길:

- B-49fef7fe983e · ConditionalExpression · memo → truthy / falsy; 바깥 조건: nullish: boot.draft (47행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 47행 | nullish: boot.draft ∧ truthy: memo | editConceptDraft(memo)<br>preservation-boundary |
| 47행 | nullish: boot.draft ∧ falsy: memo | newConceptDraft(ownerId)<br>preservation-boundary |

## H-cda30cd0e5f3

**@callback:data.subjects.find** · [src/ui/canvas-concept-editor.tsx:56](../../../src/ui/canvas-concept-editor.tsx#L56)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-385834c95715

**change** · [src/ui/canvas-concept-editor.tsx:57](../../../src/ui/canvas-concept-editor.tsx#L57)

분기 조건과 가능한 갈림길:

- B-d292ee9c2d9b · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (59행).
- B-db020f4bbad8 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (63행).
- B-82bab6cbbf88 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (64행).
- B-d42c121340f8 · IfStatement · !message.includes('다른 곳') → truthy / falsy; 바깥 조건: exception: e (65행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 58행 | 별도 조건식 없음 | setDraft(next)<br>state-update |
| 60행 | 별도 조건식 없음 | writeConceptDraft(boot.key, next, raw.current)<br>preservation-boundary |
| 61행 | 별도 조건식 없음 | setError('')<br>state-update |
| 65행 | exception: e | message.includes('다른 곳')<br>call |
| 65행 | exception: e ∧ truthy: !message.includes('다른 곳') | JSON.stringify(next)<br>call |
| 66행 | exception: e | setError(message)<br>state-update |

반환/조기 중단: 62행 true [별도 조건식 없음]; 67행 false [exception: e]

## H-87420fdaa44d

**save** · [src/ui/canvas-concept-editor.tsx:70](../../../src/ui/canvas-concept-editor.tsx#L70)

분기 조건과 가능한 갈림길:

- B-cd997d03de3c · IfStatement · composing || boot.error || !ready || !change(draft) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (71행).
- B-f879a7b1156f · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (72행).
- B-4595b5891e1d · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (78행).
- B-7b10219ad60e · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (79행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 71행 | falsy: composing \|\| boot.error \|\| !ready | change(draft)<br>call → [H-385834c95715](ui__canvas-concept-editor.md#h-385834c95715) |
| 73행 | 별도 조건식 없음 | saveConceptMemo(repository, draft)<br>call |
| 75행 | 별도 조건식 없음 | clearConceptDraft(boot.key, raw.current)<br>preservation-boundary |
| 77행 | 별도 조건식 없음 | onSaved(result, draft.id)<br>call |
| 79행 | exception: e | setError(e instanceof Error ? e.message : '저장하지 못했습니다. 입력은 유지했습니다.')<br>state-update |

반환/조기 중단: 71행 <render> [truthy: composing || boot.error || !ready || !change(draft)]

## H-26e534286f76

**@onCompositionStart** · [src/ui/canvas-concept-editor.tsx:86](../../../src/ui/canvas-concept-editor.tsx#L86)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 86행 | 별도 조건식 없음 | setComposing(true)<br>state-update |

## H-6e70178eac2d

**@onCompositionEnd** · [src/ui/canvas-concept-editor.tsx:87](../../../src/ui/canvas-concept-editor.tsx#L87)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 87행 | 별도 조건식 없음 | setComposing(false)<br>state-update |

## H-87b091160a01

**@onSubmit** · [src/ui/canvas-concept-editor.tsx:88](../../../src/ui/canvas-concept-editor.tsx#L88)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 89행 | 별도 조건식 없음 | event.preventDefault()<br>input-control |
| 90행 | 별도 조건식 없음 | save()<br>call → [H-87420fdaa44d](ui__canvas-concept-editor.md#h-87420fdaa44d) |

## H-1a5898f9f920

**@onChange** · [src/ui/canvas-concept-editor.tsx:99](../../../src/ui/canvas-concept-editor.tsx#L99)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 99행 | 별도 조건식 없음 | change({ ...draft, name: event.target.value })<br>call → [H-385834c95715](ui__canvas-concept-editor.md#h-385834c95715) |

## H-32db299c6c65

**@onChange** · [src/ui/canvas-concept-editor.tsx:108](../../../src/ui/canvas-concept-editor.tsx#L108)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 108행 | 별도 조건식 없음 | change({ ...draft, description: event.target.value })<br>call → [H-385834c95715](ui__canvas-concept-editor.md#h-385834c95715) |

## H-c5f5f988f3af

**@onClick** · [src/ui/canvas-concept-editor.tsx:123](../../../src/ui/canvas-concept-editor.tsx#L123)

분기 조건과 가능한 갈림길:

- B-fbab400a4212 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: error ∧ truthy: boot.error && boot.key (124행).
- B-a6f04e14d5fd · CatchClause · e → exception; 바깥 조건: truthy: error ∧ truthy: boot.error && boot.key (127행).
- B-f8c83e9f5c2a · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: truthy: error ∧ truthy: boot.error && boot.key ∧ exception: e (128행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 125행 | truthy: error ∧ truthy: boot.error && boot.key | preserveConceptDraft(boot.key)<br>preservation-boundary |
| 126행 | truthy: error ∧ truthy: boot.error && boot.key | setError('원문 사본을 보관했습니다. 초안 보관본에서 확인해 주세요.')<br>state-update |
| 128행 | truthy: error ∧ truthy: boot.error && boot.key ∧ exception: e | setError(e instanceof Error ? e.message : '사본을 보관하지 못했습니다.')<br>state-update |

