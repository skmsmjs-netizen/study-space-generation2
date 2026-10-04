# src/ui/gpt-connection-panel.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-ce5ce3061dbd

**message** · [src/ui/gpt-connection-panel.tsx:8](../../../src/ui/gpt-connection-panel.tsx#L8)

분기 조건과 가능한 갈림길:

- B-2c3a4eb62249 · ConditionalExpression · error instanceof Error → truthy / falsy; 바깥 조건: 별도 조건식 없음 (8행).

## H-6abb9ad5511a

**GPTConnectionPanel** · [src/ui/gpt-connection-panel.tsx:10](../../../src/ui/gpt-connection-panel.tsx#L10)

분기 조건과 가능한 갈림길:

- B-22cf127537b6 · IfStatement · !allowed → truthy / falsy; 바깥 조건: 별도 조건식 없음 (40행).
- B-6e63eb1ab5ba · ConditionalExpression · purpose === 'memory' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (62행).
- B-ae15e061e1ac · ConditionalExpression · billing.configured → truthy / falsy; 바깥 조건: truthy: billing (70행).
- B-f9ba5614021c · ConditionalExpression · billing.enabled → truthy / falsy; 바깥 조건: truthy: billing ∧ truthy: billing.configured (70행).
- B-8a8fdd0dc22b · ConditionalExpression · billing?.configured → truthy / falsy; 바깥 조건: 별도 조건식 없음 (74행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 13행 | 별도 조건식 없음 | useMemo(() => ({ userId, namespace }), [userId, namespace])<br>call<br>전달 콜백: H-e60b130300be |
| 14행 | 별도 조건식 없음 | canUseOwnerAI(owner)<br>call |
| 15행 | 별도 조건식 없음 | useState(null)<br>call |
| 16행 | 별도 조건식 없음 | useState(false)<br>call |
| 17행 | 별도 조건식 없음 | useState('')<br>call |
| 18행 | 별도 조건식 없음 | useState(10_000_000)<br>call |
| 19행 | 별도 조건식 없음 | useState(false)<br>call |
| 20행 | 별도 조건식 없음 | useState('')<br>call |
| 20행 | 별도 조건식 없음 | useState('')<br>call |
| 21행 | 별도 조건식 없음 | useRef(busy)<br>call |
| 22행 | 별도 조건식 없음 | useEffect(() => { if (!allowed) return; const controller = new AbortController(); void localAIStatus(owner, controller.signal).then(status => { if (!controller.signal.aborted) { setConnection(status); setLimit(status.billing?.limitMicro ?? 10_000_000); } }).catch(error => { if (!controller.signal.aborted) setError(message(error)); }); return () => controller.abort(); }, [owner, allowed])<br>call<br>전달 콜백: H-9c46edd9a868 |
| 30행 | 별도 조건식 없음 | useEffect(() => { const finished = wasBusy.current && !busy; wasBusy.current = busy; if (!allowed \|\| !finished) return; const controller = new AbortController(); void localAIStatus(owner, controller.signal).then(status => { if (!controller.signal.aborted) { setConnection(status); setError(''); } }).catch(error => { if (!controller.signal.aborted) setError(message(error)); }); return () => controller.abort(); }, [owner, allowed, busy])<br>call<br>전달 콜백: H-b3360614d886 |
| 78행 | 별도 조건식 없음 | [1_000_000,2_000_000,3_000_000,6_000_000,10_000_000].includes(limit)<br>call |
| 78행 | truthy: ![1_000_000,2_000_000,3_000_000,6_000_000,10_000_000].includes(limit) | dollars(limit)<br>call → [H-ef7f6b33cbe6](ui__api-budget-summary.md#h-ef7f6b33cbe6) |
| 86행 | falsy: disabled \|\| !connection \|\| !confirmed ∧ truthy: !billing?.configured | key.trim()<br>call |

반환/조기 중단: 40행 null [truthy: !allowed]; 59행 <render> [별도 조건식 없음]

## H-e60b130300be

**@callback:useMemo** · [src/ui/gpt-connection-panel.tsx:13](../../../src/ui/gpt-connection-panel.tsx#L13)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-9c46edd9a868

**@callback:useEffect** · [src/ui/gpt-connection-panel.tsx:22](../../../src/ui/gpt-connection-panel.tsx#L22)

분기 조건과 가능한 갈림길:

- B-5728969a5eb2 · IfStatement · !allowed → truthy / falsy; 바깥 조건: 별도 조건식 없음 (23행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 25행 | 별도 조건식 없음 | localAIStatus(owner, controller.signal).then(status => {<br>      if (!controller.signal.aborted) { setConnection(status); setLimit(status.billing?.limitMicro ?? 10_000_000); }<br>    }).catch(error => { if (!controller.signal.aborted) setError(message(error)); })<br>call<br>전달 콜백: H-7dcb2eff969e |
| 25행 | 별도 조건식 없음 | localAIStatus(owner, controller.signal).then(status => { if (!controller.signal.aborted) { setConnection(status); setLimit(status.billing?.limitMicro ?? 10_000_000); } })<br>call<br>전달 콜백: H-d71dd458e070 |
| 25행 | 별도 조건식 없음 | localAIStatus(owner, controller.signal)<br>call |

반환/조기 중단: 23행 <render> [truthy: !allowed]; 28행 () => controller.abort() [별도 조건식 없음]

## H-d71dd458e070

**@callback:localAIStatus(owner, controller.signal).then** · [src/ui/gpt-connection-panel.tsx:25](../../../src/ui/gpt-connection-panel.tsx#L25)

분기 조건과 가능한 갈림길:

- B-f51957f49249 · IfStatement · !controller.signal.aborted → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: localAIStatus(owner, controller.signal) (26행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 26행 | fulfilled-or-explicit-rejection-handler: localAIStatus(owner, controller.signal) ∧ truthy: !controller.signal.aborted | setConnection(status)<br>state-update |
| 26행 | fulfilled-or-explicit-rejection-handler: localAIStatus(owner, controller.signal) ∧ truthy: !controller.signal.aborted | setLimit(status.billing?.limitMicro ?? 10_000_000)<br>state-update |

## H-7dcb2eff969e

**@callback:localAIStatus(owner, controller.signal).then(status => {
      if (!controller.signal.aborted) { setConnection(status); setLimit(status.billing?.limitMicro ?? 10_000_000); }
    }).catch** · [src/ui/gpt-connection-panel.tsx:27](../../../src/ui/gpt-connection-panel.tsx#L27)

분기 조건과 가능한 갈림길:

- B-b8d98c155940 · IfStatement · !controller.signal.aborted → truthy / falsy; 바깥 조건: rejected: localAIStatus(owner, controller.signal).then(status => {
      if (!controller.signal.aborted) { setConnection(status); setLimit(status.billing?.limitMicro ?? 10_000_000); }
    }) (27행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 27행 | rejected: localAIStatus(owner, controller.signal).then(status => {<br>      if (!controller.signal.aborted) { setConnection(status); setLimit(status.billing?.limitMicro ?? 10_000_000); }<br>    }) ∧ truthy: !controller.signal.aborted | setError(message(error))<br>state-update |
| 27행 | rejected: localAIStatus(owner, controller.signal).then(status => {<br>      if (!controller.signal.aborted) { setConnection(status); setLimit(status.billing?.limitMicro ?? 10_000_000); }<br>    }) ∧ truthy: !controller.signal.aborted | message(error)<br>call → [H-ce5ce3061dbd](ui__gpt-connection-panel.md#h-ce5ce3061dbd) |

## H-b3360614d886

**@callback:useEffect** · [src/ui/gpt-connection-panel.tsx:30](../../../src/ui/gpt-connection-panel.tsx#L30)

분기 조건과 가능한 갈림길:

- B-88586377df54 · IfStatement · !allowed || !finished → truthy / falsy; 바깥 조건: 별도 조건식 없음 (33행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 35행 | 별도 조건식 없음 | localAIStatus(owner, controller.signal).then(status => {<br>      if (!controller.signal.aborted) { setConnection(status); setError(''); }<br>    }).catch(error => { if (!controller.signal.aborted) setError(message(error)); })<br>call<br>전달 콜백: H-e93f36c42895 |
| 35행 | 별도 조건식 없음 | localAIStatus(owner, controller.signal).then(status => { if (!controller.signal.aborted) { setConnection(status); setError(''); } })<br>call<br>전달 콜백: H-5dcda7f5449d |
| 35행 | 별도 조건식 없음 | localAIStatus(owner, controller.signal)<br>call |

반환/조기 중단: 33행 <render> [truthy: !allowed || !finished]; 38행 () => controller.abort() [별도 조건식 없음]

## H-5dcda7f5449d

**@callback:localAIStatus(owner, controller.signal).then** · [src/ui/gpt-connection-panel.tsx:35](../../../src/ui/gpt-connection-panel.tsx#L35)

분기 조건과 가능한 갈림길:

- B-7083b178d477 · IfStatement · !controller.signal.aborted → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: localAIStatus(owner, controller.signal) (36행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 36행 | fulfilled-or-explicit-rejection-handler: localAIStatus(owner, controller.signal) ∧ truthy: !controller.signal.aborted | setConnection(status)<br>state-update |
| 36행 | fulfilled-or-explicit-rejection-handler: localAIStatus(owner, controller.signal) ∧ truthy: !controller.signal.aborted | setError('')<br>state-update |

## H-e93f36c42895

**@callback:localAIStatus(owner, controller.signal).then(status => {
      if (!controller.signal.aborted) { setConnection(status); setError(''); }
    }).catch** · [src/ui/gpt-connection-panel.tsx:37](../../../src/ui/gpt-connection-panel.tsx#L37)

분기 조건과 가능한 갈림길:

- B-88a29f8567c3 · IfStatement · !controller.signal.aborted → truthy / falsy; 바깥 조건: rejected: localAIStatus(owner, controller.signal).then(status => {
      if (!controller.signal.aborted) { setConnection(status); setError(''); }
    }) (37행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 37행 | rejected: localAIStatus(owner, controller.signal).then(status => {<br>      if (!controller.signal.aborted) { setConnection(status); setError(''); }<br>    }) ∧ truthy: !controller.signal.aborted | setError(message(error))<br>state-update |
| 37행 | rejected: localAIStatus(owner, controller.signal).then(status => {<br>      if (!controller.signal.aborted) { setConnection(status); setError(''); }<br>    }) ∧ truthy: !controller.signal.aborted | message(error)<br>call → [H-ce5ce3061dbd](ui__gpt-connection-panel.md#h-ce5ce3061dbd) |

## H-be3bd7f64468

**save** · [src/ui/gpt-connection-panel.tsx:43](../../../src/ui/gpt-connection-panel.tsx#L43) · async

분기 조건과 가능한 갈림길:

- B-c258ea8ef4cf · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (45행).
- B-76c18fed123a · ConditionalExpression · action === 'save' && key.trim() → truthy / falsy; 바깥 조건: 별도 조건식 없음 (47행).
- B-e24e73c46e6c · ConditionalExpression · action === 'save' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (48행).
- B-9a820ff1ceaf · ConditionalExpression · action === 'disconnect' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (52행).
- B-100e4683224b · ConditionalExpression · action === 'pause' → truthy / falsy; 바깥 조건: falsy: action === 'disconnect' (53행).
- B-c635230ff1d7 · CatchClause · error → exception; 바깥 조건: 별도 조건식 없음 (56행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 44행 | 별도 조건식 없음 | setWorking(true)<br>state-update |
| 44행 | 별도 조건식 없음 | setError('')<br>state-update |
| 44행 | 별도 조건식 없음 | setNotice('')<br>state-update |
| 46행 | 별도 조건식 없음 | configureOpenAIAPI(owner, { ...(action === 'save' && key.trim() ? { key: key.trim() } : {}), limitMicro: action === 'save' ? limit : billing?.limitMicro ?? limit, enabled: action === 'save', confirmPaid: true, disconnect: action === 'disconnect', })<br>call |
| 47행 | truthy: action === 'save' | key.trim()<br>call |
| 47행 | truthy: action === 'save' && key.trim() | key.trim()<br>call |
| 51행 | 별도 조건식 없음 | setKey('')<br>state-update |
| 52행 | 별도 조건식 없음 | setNotice(action === 'disconnect' ? 'API 키를 서버에서 삭제했습니다. 학습 자료와 이번 달 사용 집계는 유지했습니다.' : action === 'pause' ? '새 API 생성을 멈췄습니다. 원본과 기존 결과는 보관했습니다.' : 'API 설정을 저장했습니다. 키의 호출 권한과 잔액은 실제 생성 요청에서 확인됩니다. 저장만으로 유료 호출하지 않았습니다.')<br>state-update |
| 55행 | 별도 조건식 없음 | setConnection(await localAIStatus(owner))<br>state-update |
| 55행 | 별도 조건식 없음 | localAIStatus(owner)<br>call |
| 56행 | exception: error | setError(message(error))<br>state-update |
| 56행 | exception: error | message(error)<br>call → [H-ce5ce3061dbd](ui__gpt-connection-panel.md#h-ce5ce3061dbd) |
| 57행 | always-after-try: try 완료 또는 예외 이후 | setKey('')<br>state-update |
| 57행 | always-after-try: try 완료 또는 예외 이후 | setWorking(false)<br>state-update |

## H-20d687109dab

**@onChange** · [src/ui/gpt-connection-panel.tsx:76](../../../src/ui/gpt-connection-panel.tsx#L76)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 76행 | 별도 조건식 없음 | setKey(e.target.value)<br>state-update |

## H-00383acfa917

**@onChange** · [src/ui/gpt-connection-panel.tsx:77](../../../src/ui/gpt-connection-panel.tsx#L77)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 77행 | 별도 조건식 없음 | setLimit(Number(e.target.value))<br>state-update |
| 77행 | 별도 조건식 없음 | Number(e.target.value)<br>call |

## H-d2348a9c49c3

**@onChange** · [src/ui/gpt-connection-panel.tsx:83](../../../src/ui/gpt-connection-panel.tsx#L83)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 83행 | 별도 조건식 없음 | setConfirmed(e.target.checked)<br>state-update |

## H-2a3f8cd9221b

**@onClick** · [src/ui/gpt-connection-panel.tsx:86](../../../src/ui/gpt-connection-panel.tsx#L86)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 86행 | 별도 조건식 없음 | save('save')<br>call → [H-be3bd7f64468](ui__gpt-connection-panel.md#h-be3bd7f64468) |

## H-b0965b8c89cf

**@onClick** · [src/ui/gpt-connection-panel.tsx:87](../../../src/ui/gpt-connection-panel.tsx#L87) · async

분기 조건과 가능한 갈림길:

- B-9386570e5bcf · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (89행).
- B-2d562317a28a · CatchClause · error → exception; 바깥 조건: 별도 조건식 없음 (90행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 88행 | 별도 조건식 없음 | setWorking(true)<br>state-update |
| 88행 | 별도 조건식 없음 | setError('')<br>state-update |
| 89행 | 별도 조건식 없음 | setConnection(await localAIStatus(owner))<br>state-update |
| 89행 | 별도 조건식 없음 | localAIStatus(owner)<br>call |
| 89행 | 별도 조건식 없음 | setNotice('서버의 API 설정을 다시 확인했습니다.')<br>state-update |
| 90행 | exception: error | setError(message(error))<br>state-update |
| 90행 | exception: error | message(error)<br>call → [H-ce5ce3061dbd](ui__gpt-connection-panel.md#h-ce5ce3061dbd) |
| 90행 | always-after-try: try 완료 또는 예외 이후 | setWorking(false)<br>state-update |

## H-dbefb4321334

**@onClick** · [src/ui/gpt-connection-panel.tsx:93](../../../src/ui/gpt-connection-panel.tsx#L93)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 93행 | truthy: billing?.configured | save('pause')<br>call → [H-be3bd7f64468](ui__gpt-connection-panel.md#h-be3bd7f64468) |

## H-62e0d9f61808

**@onClick** · [src/ui/gpt-connection-panel.tsx:94](../../../src/ui/gpt-connection-panel.tsx#L94)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 94행 | truthy: billing?.configured | save('disconnect')<br>call → [H-be3bd7f64468](ui__gpt-connection-panel.md#h-be3bd7f64468) |

