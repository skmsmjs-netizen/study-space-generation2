# src/ui/material-quiz.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-85d064e49766

**MaterialQuiz** · [src/ui/material-quiz.tsx:6](../../../src/ui/material-quiz.tsx#L6)

분기 조건과 가능한 갈림길:

- B-e5ff13bb1270 · ConditionalExpression · attempt → truthy / falsy; 바깥 조건: 별도 조건식 없음 (32행).
- B-7cba51399327 · ConditionalExpression · attempt → truthy / falsy; 바깥 조건: 별도 조건식 없음 (35행).
- B-2e3b163f0ad1 · ConditionalExpression · !attempt.submittedAt → truthy / falsy; 바깥 조건: truthy: attempt (124행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 25행 | 별도 조건식 없음 | attempts.filter((a) => a.resultId === resultId)<br>call<br>전달 콜백: H-2ad5a45eb606 |
| 26행 | 별도 조건식 없음 | useState(selectedId ?? previous.at(-1)?.id ?? '')<br>call |
| 26행 | nullish: selectedId | previous.at(-1)<br>call |
| 31행 | 별도 조건식 없음 | previous.find((a) => a.id === selected)<br>call<br>전달 콜백: H-c37233e99a99 |
| 31행 | nullish: previous.find((a) => a.id === selected) | previous.at(-1)<br>call |
| 33행 | truthy: attempt | attempt.questions.filter((q) => attempt.answers[q.id] !== undefined)<br>call<br>전달 콜백: H-92c4269458bc |
| 35행 | truthy: attempt | answered.filter((q) => attempt.answers[q.id] !== q.correctIndex)<br>call<br>전달 콜백: H-7272a08d8103 |
| 61행 | falsy: disabled \|\| attempts.length >= 100 | Boolean(attempt && !attempt.submittedAt)<br>call |
| 72행 | truthy: previous.length > 1 | previous.map((a, i) => ( <option key={a.id} value={a.id}> {i + 1}번째 · {a.submittedAt ? '답 확인함' : '응답 중'} </option> ))<br>call<br>전달 콜백: H-70fa9043c5e6 |
| 83행 | truthy: attempt | attempt.questions.map((q, i) => ( <article key={q.id} className="material-flashcard"> <h3> {i + 1}. <StudyResultText text={q.question} as="span" /> </h3> {attempt.helpedQuestionIds?.includes(q.id) && ( <p>이 시도에서 자료·보조 결과를 열었습니다. 독립 수행과 구별하여 보관합니다.</p> )} <fieldset className="material-fields" aria-label={`${i + 1}번 보기`} disabled={disabled \|\| Boolean(attempt.submittedAt)} > {occurrenceRows(q.options, value => value).map(({value: option, index: at, key}) => ( <Radio key={key} name={`${attempt.id}:${q.id}`} label={<StudyResultText text={option} as="span" />} checked={attempt.answers[q.id] === at} onChange={() => update({ answers: { ...attempt.answers, [q.id]: at } })} /> ))} </fieldset> {attempt.submittedAt && ( <div … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-513018ce369b |

반환/조기 중단: 57행 <render> [별도 조건식 없음]

## H-2ad5a45eb606

**@callback:attempts.filter** · [src/ui/material-quiz.tsx:25](../../../src/ui/material-quiz.tsx#L25)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-98e3e268b4d7

**select** · [src/ui/material-quiz.tsx:27](../../../src/ui/material-quiz.tsx#L27)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 28행 | 별도 조건식 없음 | setSelected(id)<br>state-update |

## H-c37233e99a99

**@callback:previous.find** · [src/ui/material-quiz.tsx:31](../../../src/ui/material-quiz.tsx#L31)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-92c4269458bc

**@callback:attempt.questions.filter** · [src/ui/material-quiz.tsx:33](../../../src/ui/material-quiz.tsx#L33)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7272a08d8103

**@callback:answered.filter** · [src/ui/material-quiz.tsx:35](../../../src/ui/material-quiz.tsx#L35)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-5a39e74a04eb

**start** · [src/ui/material-quiz.tsx:36](../../../src/ui/material-quiz.tsx#L36)

분기 조건과 가능한 갈림길:

- B-3f7716fc5b71 · IfStatement · open → truthy / falsy; 바깥 조건: 별도 조건식 없음 (38행).
- B-6ffe42ac1a67 · IfStatement · attempts.length >= 100 || !rows.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (42행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 37행 | 별도 조건식 없음 | previous.find((a) => !a.submittedAt)<br>call<br>전달 콜백: H-dc69f2f4d0d6 |
| 39행 | truthy: open | select(open.id)<br>call → [H-98e3e268b4d7](ui__material-quiz.md#h-98e3e268b4d7) |
| 44행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 46행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 47행 | 별도 조건식 없음 | structuredClone(rows)<br>call |
| 51행 | 별도 조건식 없음 | onChange([...attempts, next])<br>call |
| 52행 | 별도 조건식 없음 | select(next.id)<br>call → [H-98e3e268b4d7](ui__material-quiz.md#h-98e3e268b4d7) |

반환/조기 중단: 40행 <render> [truthy: open]; 42행 <render> [truthy: attempts.length >= 100 || !rows.length]

## H-dc69f2f4d0d6

**@callback:previous.find** · [src/ui/material-quiz.tsx:37](../../../src/ui/material-quiz.tsx#L37)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a84ecdd08371

**update** · [src/ui/material-quiz.tsx:54](../../../src/ui/material-quiz.tsx#L54)

분기 조건과 가능한 갈림길:

- B-34f974194924 · IfStatement · attempt → truthy / falsy; 바깥 조건: 별도 조건식 없음 (55행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 55행 | truthy: attempt | onChange(attempts.map((a) => (a.id === attempt.id ? { ...a, ...patch } : a)))<br>call |
| 55행 | truthy: attempt | attempts.map((a) => (a.id === attempt.id ? { ...a, ...patch } : a))<br>call<br>전달 콜백: H-a8f0b404b7b7 |

## H-a8f0b404b7b7

**@callback:attempts.map** · [src/ui/material-quiz.tsx:55](../../../src/ui/material-quiz.tsx#L55)

분기 조건과 가능한 갈림길:

- B-c5b4076b643d · ConditionalExpression · a.id === attempt.id → truthy / falsy; 바깥 조건: truthy: attempt (55행).

## H-fae6bab5f3f9

**@onClick** · [src/ui/material-quiz.tsx:62](../../../src/ui/material-quiz.tsx#L62)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 62행 | 별도 조건식 없음 | start()<br>call → [H-5a39e74a04eb](ui__material-quiz.md#h-5a39e74a04eb) |

## H-e1885dbb00a5

**@onChange** · [src/ui/material-quiz.tsx:70](../../../src/ui/material-quiz.tsx#L70)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 70행 | truthy: previous.length > 1 | select(e.target.value)<br>call → [H-98e3e268b4d7](ui__material-quiz.md#h-98e3e268b4d7) |

## H-70fa9043c5e6

**@callback:previous.map** · [src/ui/material-quiz.tsx:72](../../../src/ui/material-quiz.tsx#L72)

분기 조건과 가능한 갈림길:

- B-9cc0a2bde7d0 · ConditionalExpression · a.submittedAt → truthy / falsy; 바깥 조건: truthy: previous.length > 1 (74행).

## H-513018ce369b

**@callback:attempt.questions.map** · [src/ui/material-quiz.tsx:83](../../../src/ui/material-quiz.tsx#L83)

분기 조건과 가능한 갈림길:

- B-60272f28e56a · ConditionalExpression · attempt.answers[q.id] === undefined → truthy / falsy; 바깥 조건: truthy: attempt ∧ truthy: attempt.submittedAt (109행).
- B-545d3b6854d8 · ConditionalExpression · attempt.answers[q.id] === q.correctIndex → truthy / falsy; 바깥 조건: truthy: attempt ∧ truthy: attempt.submittedAt ∧ falsy: attempt.answers[q.id] === undefined (111행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 94행 | truthy: attempt ∧ interactive-when-falsy: disabled \|\| Boolean(attempt.submittedAt) ∧ falsy: disabled | Boolean(attempt.submittedAt)<br>call |
| 96행 | truthy: attempt ∧ interactive-when-falsy: disabled \|\| Boolean(attempt.submittedAt) | occurrenceRows(q.options, value => value).map(({value: option, index: at, key}) => ( <Radio key={key} name={`${attempt.id}:${q.id}`} label={<StudyResultText text={option} as="span" />} checked={attempt.answers[q.id] === at} onChange={() => update({ answers: { ...attempt.answers, [q.id]: at } })} /> ))<br>call<br>전달 콜백: H-bbbc62a7cdc1 |
| 96행 | truthy: attempt ∧ interactive-when-falsy: disabled \|\| Boolean(attempt.submittedAt) | occurrenceRows(q.options, value => value)<br>call<br>전달 콜백: H-cefe6ffbf2ea |
| 119행 | truthy: attempt ∧ truthy: attempt.submittedAt | evidence(q.sourceIds)<br>call |

## H-cefe6ffbf2ea

**@callback:occurrenceRows** · [src/ui/material-quiz.tsx:96](../../../src/ui/material-quiz.tsx#L96)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-bbbc62a7cdc1

**@callback:occurrenceRows(q.options, value => value).map** · [src/ui/material-quiz.tsx:96](../../../src/ui/material-quiz.tsx#L96)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-098f3ca080e1

**@onChange** · [src/ui/material-quiz.tsx:102](../../../src/ui/material-quiz.tsx#L102)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 102행 | truthy: attempt ∧ interactive-when-falsy: disabled \|\| Boolean(attempt.submittedAt) | update({ answers: { ...attempt.answers, [q.id]: at } })<br>call → [H-a84ecdd08371](ui__material-quiz.md#h-a84ecdd08371) |

## H-d4382c77ab3c

**@onClick** · [src/ui/material-quiz.tsx:128](../../../src/ui/material-quiz.tsx#L128)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 128행 | truthy: attempt ∧ truthy: !attempt.submittedAt | update({ submittedAt: new Date().toISOString() })<br>call → [H-a84ecdd08371](ui__material-quiz.md#h-a84ecdd08371) |
| 128행 | truthy: attempt ∧ truthy: !attempt.submittedAt | new Date().toISOString()<br>call |

## H-a24cd10e4d24

**@onClick** · [src/ui/material-quiz.tsx:144](../../../src/ui/material-quiz.tsx#L144)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 145행 | truthy: attempt ∧ falsy: !attempt.submittedAt | attempt.questions.filter((q) => attempt.answers[q.id] === undefined \|\| attempt.answers[q.id] !== q.correctIndex)<br>call<br>전달 콜백: H-42ef05b3f462 |
| 150행 | truthy: attempt ∧ falsy: !attempt.submittedAt | start(retry)<br>call → [H-5a39e74a04eb](ui__material-quiz.md#h-5a39e74a04eb) |

## H-42ef05b3f462

**@callback:attempt.questions.filter** · [src/ui/material-quiz.tsx:146](../../../src/ui/material-quiz.tsx#L146)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

