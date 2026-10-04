# src/ui/schedule-notifications.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-38bd3ced8d38

**ScheduleNotifications** · [src/ui/schedule-notifications.tsx:7](../../../src/ui/schedule-notifications.tsx#L7)

분기 조건과 가능한 갈림길:

- B-df6684a2eb38 · ConditionalExpression · enabled → truthy / falsy; 바깥 조건: 별도 조건식 없음 (16행).
- B-a789ee6f04e6 · ConditionalExpression · enabled → truthy / falsy; 바깥 조건: 별도 조건식 없음 (16행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 8행 | 별도 조건식 없음 | useState(false)<br>call |
| 8행 | 별도 조건식 없음 | useState(false)<br>call |
| 8행 | 별도 조건식 없음 | useState('')<br>call |
| 8행 | 별도 조건식 없음 | useState(()=>new Date().toISOString())<br>call<br>전달 콜백: H-cd98837ea33e |
| 9행 | 별도 조건식 없음 | useEffect(()=>{const tick=()=>setNow(new Date().toISOString()),timer=window.setInterval(tick,60000);window.addEventListener('focus',tick);return()=>{clearInterval(timer);window.removeEventListener('focus',tick);};}, [])<br>call<br>전달 콜백: H-995fa13c4fce |
| 11행 | 별도 조건식 없음 | useEffect(()=>{let alive=true;if(port)void localPushSubscription().then(async subscription=>{if(subscription){const status=await port.status(subscription.endpoint);if(alive)setEnabled(status.enabled);}}).catch(()=>{if(alive)setMessage('기기의 알림 연결을 확인하지 못했습니다. 알림 켜기로 다시 확인해 주세요.');});return()=>{alive=false;};}, [port,data.userId])<br>call<br>전달 콜백: H-8c861b78f0ea |
| 15행 | 별도 조건식 없음 | scheduleDigest(schedules, now)<br>call |
| 16행 | 별도 조건식 없음 | digest.due.map(s=><li key={s.id}>{s.name} · {remainingTime(s,now)}</li>)<br>call<br>전달 콜백: H-5b3242214bdc |
| 16행 | 별도 조건식 없음 | digest.unknown.map(s=><li key={s.id}>{s.name} · 공지에서 기한 확인</li>)<br>call<br>전달 콜백: H-c32698725e04 |

반환/조기 중단: 16행 <render> [별도 조건식 없음]

## H-cd98837ea33e

**@callback:useState** · [src/ui/schedule-notifications.tsx:8](../../../src/ui/schedule-notifications.tsx#L8)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 8행 | 별도 조건식 없음 | new Date().toISOString()<br>call |

## H-995fa13c4fce

**@callback:useEffect** · [src/ui/schedule-notifications.tsx:9](../../../src/ui/schedule-notifications.tsx#L9)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 9행 | 별도 조건식 없음 | window.setInterval(tick, 60000)<br>call<br>전달 콜백: H-a186d3fa1755 |
| 9행 | 별도 조건식 없음 | window.addEventListener('focus', tick)<br>call<br>전달 콜백: H-a186d3fa1755 |

반환/조기 중단: 9행 ()=>{clearInterval(timer);window.removeEventListener('focus',tick);} [별도 조건식 없음]

## H-a186d3fa1755

**tick** · [src/ui/schedule-notifications.tsx:9](../../../src/ui/schedule-notifications.tsx#L9)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 9행 | 별도 조건식 없음 | setNow(new Date().toISOString())<br>state-update |
| 9행 | 별도 조건식 없음 | new Date().toISOString()<br>call |

## H-8c861b78f0ea

**@callback:useEffect** · [src/ui/schedule-notifications.tsx:11](../../../src/ui/schedule-notifications.tsx#L11)

분기 조건과 가능한 갈림길:

- B-9d1471015252 · IfStatement · port → truthy / falsy; 바깥 조건: 별도 조건식 없음 (11행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 11행 | truthy: port | localPushSubscription().then(async subscription=>{if(subscription){const status=await port.status(subscription.endpoint);if(alive)setEnabled(status.enabled);}}).catch(()=>{if(alive)setMessage('기기의 알림 연결을 확인하지 못했습니다. 알림 켜기로 다시 확인해 주세요.');})<br>call<br>전달 콜백: H-4bff1ad7817f |
| 11행 | truthy: port | localPushSubscription().then(async subscription=>{if(subscription){const status=await port.status(subscription.endpoint);if(alive)setEnabled(status.enabled);}})<br>call<br>전달 콜백: H-6d5c4feaae25 |
| 11행 | truthy: port | localPushSubscription()<br>call |

반환/조기 중단: 11행 ()=>{alive=false;} [별도 조건식 없음]

## H-6d5c4feaae25

**@callback:localPushSubscription().then** · [src/ui/schedule-notifications.tsx:11](../../../src/ui/schedule-notifications.tsx#L11) · async

분기 조건과 가능한 갈림길:

- B-5331188ad82b · IfStatement · subscription → truthy / falsy; 바깥 조건: truthy: port ∧ fulfilled-or-explicit-rejection-handler: localPushSubscription() (11행).
- B-51bf8a098b25 · IfStatement · alive → truthy / falsy; 바깥 조건: truthy: port ∧ fulfilled-or-explicit-rejection-handler: localPushSubscription() ∧ truthy: subscription (11행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 11행 | truthy: port ∧ fulfilled-or-explicit-rejection-handler: localPushSubscription() ∧ truthy: subscription | port.status(subscription.endpoint)<br>call |
| 11행 | truthy: port ∧ fulfilled-or-explicit-rejection-handler: localPushSubscription() ∧ truthy: subscription ∧ truthy: alive | setEnabled(status.enabled)<br>state-update |

## H-4bff1ad7817f

**@callback:localPushSubscription().then(async subscription=>{if(subscription){const status=await port.status(subscription.endpoint);if(alive)setEnabled(status.enabled);}}).catch** · [src/ui/schedule-notifications.tsx:11](../../../src/ui/schedule-notifications.tsx#L11)

분기 조건과 가능한 갈림길:

- B-b83678fe8663 · IfStatement · alive → truthy / falsy; 바깥 조건: truthy: port ∧ rejected: localPushSubscription().then(async subscription=>{if(subscription){const status=await port.status(subscription.endpoint);if(alive)setEnabled(status.enabled);}}) (11행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 11행 | truthy: port ∧ rejected: localPushSubscription().then(async subscription=>{if(subscription){const status=await port.status(subscription.endpoint);if(alive)setEnabled(status.enabled);}}) ∧ truthy: alive | setMessage('기기의 알림 연결을 확인하지 못했습니다. 알림 켜기로 다시 확인해 주세요.')<br>state-update |

## H-4ef05d57bb9a

**toggle** · [src/ui/schedule-notifications.tsx:12](../../../src/ui/schedule-notifications.tsx#L12) · async

분기 조건과 가능한 갈림길:

- B-bd9de8f68546 · IfStatement · !port → truthy / falsy; 바깥 조건: 별도 조건식 없음 (12행).
- B-eabdd9c154b8 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (12행).
- B-fd4a82fb2c9a · IfStatement · enabled → truthy / falsy; 바깥 조건: 별도 조건식 없음 (12행).
- B-e3156d338d14 · ConditionalExpression · result.serverCleanupFailed → truthy / falsy; 바깥 조건: truthy: enabled (12행).
- B-754304a994dd · CatchClause · error → exception; 바깥 조건: 별도 조건식 없음 (12행).
- B-06a8290e4c7f · ConditionalExpression · error instanceof Error → truthy / falsy; 바깥 조건: exception: error (12행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | truthy: !port | setMessage('내 공부 공간에 로그인한 뒤 알림을 켜 주세요.')<br>state-update |
| 12행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 12행 | truthy: enabled | disableSchedulePush(port)<br>call |
| 12행 | truthy: enabled | setEnabled(false)<br>state-update |
| 12행 | truthy: enabled | setMessage(result.serverCleanupFailed?'이 기기의 알림은 껐습니다. 서버 구독 정리는 연결 후 다시 확인해 주세요.':'이 기기의 일정 알림을 껐습니다.')<br>state-update |
| 12행 | falsy: enabled | enableSchedulePush(port)<br>call |
| 12행 | falsy: enabled | setEnabled(true)<br>state-update |
| 12행 | falsy: enabled | setMessage('이 기기에 매일 오전 9시, 일주일 안에 기한이 오는 일정을 한 알림으로 보냅니다.')<br>state-update |
| 12행 | exception: error | setMessage(error instanceof Error?error.message:'알림 연결을 확인하지 못했습니다. 다시 시도해 주세요.')<br>state-update |
| 12행 | always-after-try: try 완료 또는 예외 이후 | setBusy(false)<br>state-update |

반환/조기 중단: 12행 <render> [truthy: !port]

## H-5b3242214bdc

**@callback:digest.due.map** · [src/ui/schedule-notifications.tsx:16](../../../src/ui/schedule-notifications.tsx#L16)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 16행 | 별도 조건식 없음 | remainingTime(s, now)<br>call |

## H-c32698725e04

**@callback:digest.unknown.map** · [src/ui/schedule-notifications.tsx:16](../../../src/ui/schedule-notifications.tsx#L16)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b6a3de843655

**@onClick** · [src/ui/schedule-notifications.tsx:16](../../../src/ui/schedule-notifications.tsx#L16)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 16행 | 별도 조건식 없음 | toggle()<br>call → [H-4ef05d57bb9a](ui__schedule-notifications.md#h-4ef05d57bb9a) |

