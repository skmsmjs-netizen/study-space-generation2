# src/ui/recall-optimization.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-8e93b1305d73

**RecallOptimization** · [src/ui/recall-optimization.tsx:9](../../../src/ui/recall-optimization.tsx#L9)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | 별도 조건식 없음 | useMemo(() => recallTraining({nodes: data.nodes, subjects: data.subjects, recallCards: data.recallCards}, deckId), [data.nodes, data.subjects, data.recallCards, deckId])<br>call<br>전달 콜백: H-f8ed7d005021 |
| 13행 | 별도 조건식 없음 | useState(false)<br>call |
| 13행 | 별도 조건식 없음 | useState(null)<br>call |
| 14행 | 별도 조건식 없음 | useState('')<br>call |
| 14행 | 별도 조건식 없음 | useState('')<br>call |
| 15행 | 별도 조건식 없음 | useRef(null)<br>call |
| 17행 | 별도 조건식 없음 | useEffect(() => () => { job.current?.channel.postMessage({ type: 'cancel' }); job.current?.channel.close(); clearTimeout(job.current?.timer); job.current = null; }, [])<br>call<br>전달 콜백: H-22d3ee948c0d |
| 53행 | 별도 조건식 없음 | recallOptions(data, deckId)<br>call |
| 57행 | truthy: current.optimizedAt | new Date(current.optimizedAt).toLocaleString('ko-KR')<br>call |

반환/조기 중단: 54행 <render> [별도 조건식 없음]

## H-f8ed7d005021

**@callback:useMemo** · [src/ui/recall-optimization.tsx:12](../../../src/ui/recall-optimization.tsx#L12)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | 별도 조건식 없음 | recallTraining({nodes: data.nodes, subjects: data.subjects, recallCards: data.recallCards}, deckId)<br>call |

## H-15b61ab4cb82

**stop** · [src/ui/recall-optimization.tsx:16](../../../src/ui/recall-optimization.tsx#L16)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 16행 | 별도 조건식 없음 | clearTimeout(job.current?.timer)<br>call |

## H-22d3ee948c0d

**@callback:useEffect** · [src/ui/recall-optimization.tsx:17](../../../src/ui/recall-optimization.tsx#L17)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-2a0219463790

**start** · [src/ui/recall-optimization.tsx:18](../../../src/ui/recall-optimization.tsx#L18)

분기 조건과 가능한 갈림길:

- B-5905ecdc7854 · IfStatement · disabled || running → truthy / falsy; 바깥 조건: 별도 조건식 없음 (19행).
- B-9d35f09b27b1 · IfStatement · !training.lengths.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (20행).
- B-84b9aa2c88e0 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (21행).
- B-dde73ba1c2ca · IfStatement · !popup → truthy / falsy; 바깥 조건: 별도 조건식 없음 (38행).
- B-16d6c13bf20a · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (39행).
- B-25ba00fa3826 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (39행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 20행 | truthy: !training.lengths.length | setNotice('날짜를 달리한 복습 이력이 아직 없습니다. 기본 설정으로 복습을 이어가면 최적화할 수 있습니다.')<br>state-update |
| 22행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 23행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |
| 23행 | 별도 조건식 없음 | recallTraining(snapshot, deckId)<br>call |
| 23행 | 별도 조건식 없음 | recallOptions(snapshot, deckId)<br>call |
| 24행 | 별도 조건식 없음 | recallPreference(snapshot, deckId)<br>call |
| 25행 | 별도 조건식 없음 | setResult(null)<br>state-update |
| 25행 | 별도 조건식 없음 | setError('')<br>state-update |
| 25행 | 별도 조건식 없음 | setNotice('')<br>state-update |
| 25행 | 별도 조건식 없음 | setRunning(true)<br>state-update |
| 35행 | 별도 조건식 없음 | setTimeout(() => { stop(); setRunning(false); setError('계산 창에서 응답이 없습니다. 기존 설정은 보존했습니다. 다시 시도해 주세요.'); }, 600000)<br>state-update<br>전달 콜백: H-ba35c51ad0e2 |
| 37행 | 별도 조건식 없음 | window.open(`${import.meta.env.BASE_URL}optimizer/index.html#${token}`, '_blank')<br>call |
| 38행 | truthy: !popup | stop()<br>call → [H-15b61ab4cb82](ui__recall-optimization.md#h-15b61ab4cb82) |
| 38행 | truthy: !popup | setRunning(false)<br>state-update |
| 38행 | truthy: !popup | setError('계산 창을 열지 못했습니다. 이 사이트의 팝업을 허용하고 다시 시도해 주세요.')<br>state-update |
| 39행 | exception: e | stop()<br>call → [H-15b61ab4cb82](ui__recall-optimization.md#h-15b61ab4cb82) |
| 39행 | exception: e | setRunning(false)<br>state-update |
| 39행 | exception: e | setError(e instanceof Error ? e.message : '계산을 시작하지 못했습니다.')<br>state-update |

반환/조기 중단: 19행 <render> [truthy: disabled || running]; 20행 <render> [truthy: !training.lengths.length]

## H-ba35c51ad0e2

**@callback:setTimeout** · [src/ui/recall-optimization.tsx:35](../../../src/ui/recall-optimization.tsx#L35)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 35행 | 별도 조건식 없음 | stop()<br>call → [H-15b61ab4cb82](ui__recall-optimization.md#h-15b61ab4cb82) |
| 35행 | 별도 조건식 없음 | setRunning(false)<br>state-update |
| 35행 | 별도 조건식 없음 | setError('계산 창에서 응답이 없습니다. 기존 설정은 보존했습니다. 다시 시도해 주세요.')<br>state-update |

## H-c416957e7895

**apply** · [src/ui/recall-optimization.tsx:41](../../../src/ui/recall-optimization.tsx#L41)

분기 조건과 가능한 갈림길:

- B-10e0c974190e · IfStatement · !result || disabled → truthy / falsy; 바깥 조건: 별도 조건식 없음 (42행).
- B-91a0e5235b66 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (43행).
- B-25a6ebf71576 · IfStatement · recallTraining(snapshot, deckId).fingerprint !== result.fingerprint || (preferences?.version ?? 0) !== result.baseVersion || options.relearningMinutes.length !== result.relearningSteps → truthy / falsy; 바깥 조건: 별도 조건식 없음 (45행).
- B-790edcb8f3d1 · ConditionalExpression · deckId → truthy / falsy; 바깥 조건: 별도 조건식 없음 (48행).
- B-b734d19cdca4 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (51행).
- B-69ada35bac08 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (51행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 44행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |
| 44행 | 별도 조건식 없음 | recallPreference(snapshot, deckId)<br>call |
| 44행 | 별도 조건식 없음 | recallOptions(snapshot, deckId)<br>call |
| 45행 | 별도 조건식 없음 | recallTraining(snapshot, deckId)<br>call |
| 46행 | truthy: recallTraining(snapshot, deckId).fingerprint !== result.fingerprint \|\| (preferences?.version ?? 0) !== result.baseVersion \|\| options.relearningMinutes.length !== result.relearningSteps | Error('계산 후 복습 이력이나 설정이 바뀌었습니다. 현재 이력으로 다시 계산해 주세요.')<br>call |
| 47행 | 별도 조건식 없음 | new Date().toISOString()<br>call |
| 48행 | 별도 조건식 없음 | repository.execute({ type: 'saveRecallPreferences', id: preferences?.id ?? preferenceId, expectedVersion: preferences?.version ?? 0, ...(deckId ? { deckName: preferences!.deckName } : {}), options: { ...options, parameters: result.parameters, optimizedAt: at, optimizedReviews: result.count }, opId: crypto.randomUUID(), at, userId: snapshot.userId, namespace: snapshot.namespace })<br>call |
| 49행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 50행 | 별도 조건식 없음 | onApplied(saved)<br>call |
| 50행 | 별도 조건식 없음 | setResult(null)<br>state-update |
| 50행 | 별도 조건식 없음 | setError('')<br>state-update |
| 50행 | 별도 조건식 없음 | setNotice('개인별 설정을 적용했습니다. 기존 카드의 날짜와 답변 메모는 보존했습니다.')<br>state-update |
| 51행 | exception: e | setError(e instanceof Error ? e.message : '계산 결과를 적용하지 못했습니다.')<br>state-update |

반환/조기 중단: 42행 <render> [truthy: !result || disabled]

throw: 46행 Error('계산 후 복습 이력이나 설정이 바뀌었습니다. 현재 이력으로 다시 계산해 주세요.')

## H-839da20ec2c3

**@onClick** · [src/ui/recall-optimization.tsx:59](../../../src/ui/recall-optimization.tsx#L59)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 59행 | truthy: running | stop()<br>call → [H-15b61ab4cb82](ui__recall-optimization.md#h-15b61ab4cb82) |
| 59행 | truthy: running | setRunning(false)<br>state-update |
| 59행 | truthy: running | setNotice('계산을 취소했습니다. 기존 설정은 보존했습니다.')<br>state-update |

