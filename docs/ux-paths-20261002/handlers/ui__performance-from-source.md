# src/ui/performance-from-source.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-1f88228943d8

**SourceInk** · [src/ui/performance-from-source.tsx:12](../../../src/ui/performance-from-source.tsx#L12)

분기 조건과 가능한 갈림길:

- B-4ed0e109dd7d · ConditionalExpression · strokes.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (12행).

반환/조기 중단: 12행 strokes.length ? <InkPreview strokes={strokes} label="원문 답안 필기" /> : null [별도 조건식 없음]

## H-1567eb6e8ee7

**PerformanceFromSource** · [src/ui/performance-from-source.tsx:15](../../../src/ui/performance-from-source.tsx#L15)

분기 조건과 가능한 갈림길:

- B-dad6d56b9ce8 · ConditionalExpression · source.performedAt → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: source && plan (53행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 16행 | 별도 조건식 없음 | useState(false)<br>call |
| 16행 | 별도 조건식 없음 | useState(null)<br>call |
| 17행 | 별도 조건식 없음 | useState(null)<br>call |
| 17행 | 별도 조건식 없음 | useState('')<br>call |
| 18행 | 별도 조건식 없음 | useState(emptyResponse)<br>call |
| 18행 | 별도 조건식 없음 | useState('')<br>call |
| 18행 | 별도 조건식 없음 | useState('')<br>call |
| 19행 | 별도 조건식 없음 | useRef(null)<br>call |
| 19행 | 별도 조건식 없음 | useState(false)<br>call |
| 56행 | truthy: open ∧ truthy: source && plan | plan.workspace.goals.filter(g => !g.ended && g.targetId === source.topicId).map(g => <option key={g.id} value={g.id}>{g.label}</option>)<br>call<br>전달 콜백: H-4fb78d5a85a9 |
| 56행 | truthy: open ∧ truthy: source && plan | plan.workspace.goals.filter(g => !g.ended && g.targetId === source.topicId)<br>call<br>전달 콜백: H-3b9d221e4bbc |
| 58행 | truthy: open ∧ truthy: source && plan | plan.workspace.goals.some(g => !g.ended && g.targetId === source.topicId)<br>call<br>전달 콜백: H-af86c1346762 |

반환/조기 중단: 44행 <render> [별도 조건식 없음]

## H-cd56136ce5de

**retain** · [src/ui/performance-from-source.tsx:20](../../../src/ui/performance-from-source.tsx#L20)

분기 조건과 가능한 갈림길:

- B-fc2ff452d33d · IfStatement · !draft.current || draftBlocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (20행).
- B-d4a9fb491a14 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (20행).
- B-ce4ff5a5a715 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (20행).
- B-4ecce4488418 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (20행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 20행 | 별도 조건식 없음 | writeSourceResultDraft(draft.current.key, {version:1,goalId:nextGoal,response:{...nextResponse,answer:''}}, draft.current.raw)<br>preservation-boundary |
| 20행 | exception: e | setError(e instanceof Error ? e.message : '현재 선택을 저장하지 못했습니다. 화면은 유지했습니다.')<br>state-update |

반환/조기 중단: 20행 <render> [truthy: !draft.current || draftBlocked]

## H-8f16e10621fc

**change** · [src/ui/performance-from-source.tsx:21](../../../src/ui/performance-from-source.tsx#L21)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 21행 | 별도 조건식 없음 | setResponse(next)<br>state-update |
| 21행 | 별도 조건식 없음 | retain(goalId, next)<br>call → [H-cd56136ce5de](ui__performance-from-source.md#h-cd56136ce5de) |

## H-3a9941bbb058

**choose** · [src/ui/performance-from-source.tsx:23](../../../src/ui/performance-from-source.tsx#L23)

분기 조건과 가능한 갈림길:

- B-20460223c3fb · ConditionalExpression · prior → truthy / falsy; 바깥 조건: 별도 조건식 없음 (26행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 24행 | 별도 조건식 없음 | setGoalId(value)<br>state-update |
| 26행 | truthy: prior | emptyResponse()<br>call |
| 26행 | falsy: prior | emptyResponse()<br>call |
| 27행 | 별도 조건식 없음 | setResponse(nextResponse)<br>state-update |
| 27행 | 별도 조건식 없음 | retain(value, nextResponse)<br>call → [H-cd56136ce5de](ui__performance-from-source.md#h-cd56136ce5de) |

## H-08ce4ff9a5b1

**begin** · [src/ui/performance-from-source.tsx:29](../../../src/ui/performance-from-source.tsx#L29)

분기 조건과 가능한 갈림길:

- B-05182d6cc747 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (30행).
- B-f2b0c3d7bbc4 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (36행).
- B-ad198c67d00a · IfStatement · saved.draft → truthy / falsy; 바깥 조건: 별도 조건식 없음 (36행).
- B-2cb6713d90ba · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (36행).
- B-f4e9f3fe4b31 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (36행).
- B-a4a37db9ea5c · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (37행).
- B-800e50cc19df · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (37행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 31행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |
| 31행 | 별도 조건식 없음 | performanceSource(current, kind, id, itemId)<br>call |
| 31행 | 별도 조건식 없음 | readLearningPlan(current)<br>call |
| 32행 | 별도 조건식 없음 | setDraftBlocked(false)<br>state-update |
| 32행 | 별도 조건식 없음 | setSource(nextSource)<br>state-update |
| 32행 | 별도 조건식 없음 | setPlan(nextPlan)<br>state-update |
| 32행 | 별도 조건식 없음 | choose(nextPlan.workspace.goals.find(g => !g.ended && g.targetId === nextSource.topicId)?.id ?? '', nextPlan, nextSource)<br>call → [H-3a9941bbb058](ui__performance-from-source.md#h-3a9941bbb058) |
| 32행 | 별도 조건식 없음 | nextPlan.workspace.goals.find(g => !g.ended && g.targetId === nextSource.topicId)<br>call<br>전달 콜백: H-f8de7095adcc |
| 33행 | 별도 조건식 없음 | setError('')<br>state-update |
| 33행 | 별도 조건식 없음 | setNotice('')<br>state-update |
| 33행 | 별도 조건식 없음 | setOpen(true)<br>state-update |
| 34행 | 별도 조건식 없음 | sourceResultDraftKey(current, nextSource)<br>preservation-boundary |
| 36행 | 별도 조건식 없음 | readSourceResultDraft(key)<br>preservation-boundary |
| 36행 | truthy: saved.draft | setGoalId(saved.draft.goalId)<br>state-update |
| 36행 | truthy: saved.draft | setResponse(saved.draft.response)<br>state-update |
| 36행 | exception: e | setDraftBlocked(true)<br>state-update |
| 36행 | exception: e | setError(e instanceof Error ? e.message : '초안을 읽지 못했습니다.')<br>state-update |
| 37행 | exception: e | setError(e instanceof Error ? e.message : '원문을 다시 확인해 주세요.')<br>state-update |

## H-f8de7095adcc

**@callback:nextPlan.workspace.goals.find** · [src/ui/performance-from-source.tsx:32](../../../src/ui/performance-from-source.tsx#L32)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7a9d19b12cb6

**save** · [src/ui/performance-from-source.tsx:39](../../../src/ui/performance-from-source.tsx#L39)

분기 조건과 가능한 갈림길:

- B-5486bfaaec40 · IfStatement · !source || !plan → truthy / falsy; 바깥 조건: 별도 조건식 없음 (40행).
- B-b85d5b27d49e · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (41행).
- B-22188d33c005 · IfStatement · draft.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (41행).
- B-c64a662c0bc5 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (42행).
- B-330c7c38548a · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (42행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 41행 | 별도 조건식 없음 | onSaved(saveSourcePerformance(repository,source,goalId,response,plan.raw))<br>call |
| 41행 | 별도 조건식 없음 | saveSourcePerformance(repository, source, goalId, response, plan.raw)<br>call |
| 41행 | truthy: draft.current | clearSourceResultDraft(draft.current.key, draft.current.raw)<br>preservation-boundary |
| 41행 | 별도 조건식 없음 | setOpen(false)<br>state-update |
| 41행 | 별도 조건식 없음 | setNotice('수행 결과를 남겼습니다. 다음 공부와 통계에 반영됩니다.')<br>state-update |
| 42행 | exception: e | setError(e instanceof Error ? e.message : '저장하지 못했습니다. 현재 선택은 유지했습니다.')<br>state-update |

반환/조기 중단: 40행 <render> [truthy: !source || !plan]

## H-a15df327262f

**@onClose** · [src/ui/performance-from-source.tsx:47](../../../src/ui/performance-from-source.tsx#L47)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 47행 | truthy: open | setOpen(false)<br>state-update |

## H-fc4ab0abeacd

**@onChange** · [src/ui/performance-from-source.tsx:55](../../../src/ui/performance-from-source.tsx#L55)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 55행 | truthy: open ∧ truthy: source && plan | choose(e.target.value)<br>call → [H-3a9941bbb058](ui__performance-from-source.md#h-3a9941bbb058) |

## H-3b9d221e4bbc

**@callback:plan.workspace.goals.filter** · [src/ui/performance-from-source.tsx:56](../../../src/ui/performance-from-source.tsx#L56)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4fb78d5a85a9

**@callback:plan.workspace.goals.filter(g => !g.ended && g.targetId === source.topicId).map** · [src/ui/performance-from-source.tsx:56](../../../src/ui/performance-from-source.tsx#L56)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-af86c1346762

**@callback:plan.workspace.goals.some** · [src/ui/performance-from-source.tsx:58](../../../src/ui/performance-from-source.tsx#L58)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1b514b8c56f5

**@onChange** · [src/ui/performance-from-source.tsx:59](../../../src/ui/performance-from-source.tsx#L59)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 59행 | truthy: open ∧ truthy: source && plan | change({...response,result:e.target.value as ResponseDraft['result']})<br>call → [H-8f16e10621fc](ui__performance-from-source.md#h-8f16e10621fc) |

## H-98ec2c597397

**@onChange** · [src/ui/performance-from-source.tsx:62](../../../src/ui/performance-from-source.tsx#L62)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 62행 | truthy: open ∧ truthy: source && plan | change({...response,assistance:e.target.value as ResponseDraft['assistance']})<br>call → [H-8f16e10621fc](ui__performance-from-source.md#h-8f16e10621fc) |

## H-532fefa53db9

**@onChange** · [src/ui/performance-from-source.tsx:63](../../../src/ui/performance-from-source.tsx#L63)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 63행 | truthy: open ∧ truthy: source && plan | change({...response,novelty:e.target.value as ResponseDraft['novelty']})<br>call → [H-8f16e10621fc](ui__performance-from-source.md#h-8f16e10621fc) |

## H-ca6e901b2365

**@onClick** · [src/ui/performance-from-source.tsx:65](../../../src/ui/performance-from-source.tsx#L65)

분기 조건과 가능한 갈림길:

- B-bdef1d8570a9 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: open ∧ truthy: source && plan ∧ truthy: draftBlocked (65행).
- B-a0e4dfb3284c · IfStatement · draft.current → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: source && plan ∧ truthy: draftBlocked (65행).
- B-d9ff51b2b36f · CatchClause · e → exception; 바깥 조건: truthy: open ∧ truthy: source && plan ∧ truthy: draftBlocked (65행).
- B-5e4888877b19 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: source && plan ∧ truthy: draftBlocked ∧ exception: e (65행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 65행 | truthy: open ∧ truthy: source && plan ∧ truthy: draftBlocked ∧ truthy: draft.current | archiveDamagedDraft(draft.current.key, "수행 결과 초안 원문")<br>preservation-boundary |
| 65행 | truthy: open ∧ truthy: source && plan ∧ truthy: draftBlocked ∧ truthy: draft.current | clearStoredDraft(draft.current.key)<br>preservation-boundary |
| 65행 | truthy: open ∧ truthy: source && plan ∧ truthy: draftBlocked | setDraftBlocked(false)<br>state-update |
| 65행 | truthy: open ∧ truthy: source && plan ∧ truthy: draftBlocked | setResponse(emptyResponse())<br>state-update |
| 65행 | truthy: open ∧ truthy: source && plan ∧ truthy: draftBlocked | emptyResponse()<br>call |
| 65행 | truthy: open ∧ truthy: source && plan ∧ truthy: draftBlocked | setError("")<br>state-update |
| 65행 | truthy: open ∧ truthy: source && plan ∧ truthy: draftBlocked ∧ exception: e | setError(e instanceof Error ? e.message : "원문을 보관하지 못했습니다.")<br>state-update |

