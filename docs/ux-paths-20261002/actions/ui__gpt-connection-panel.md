# src/ui/gpt-connection-panel.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-63d5621daea8

**충전 안내** · a · user-control

- 실제 소스: [src/ui/gpt-connection-panel.tsx:64](../../../src/ui/gpt-connection-panel.tsx#L64)
- 연결 표면: [R07](../paths/R07.md), [R11](../paths/R11.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U37](../paths/U37.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `https://help.openai.com/en/articles/8264644-setting-up-and-managing-prepaid-api-billing`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-8c167118cba2

**API 키 만들기** · a · user-control

- 실제 소스: [src/ui/gpt-connection-panel.tsx:66](../../../src/ui/gpt-connection-panel.tsx#L66)
- 연결 표면: [R07](../paths/R07.md), [R11](../paths/R11.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U37](../paths/U37.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `https://platform.openai.com/api-keys`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-86843109bafa

**API 결제·잔액 확인** · a · user-control

- 실제 소스: [src/ui/gpt-connection-panel.tsx:67](../../../src/ui/gpt-connection-panel.tsx#L67)
- 연결 표면: [R07](../paths/R07.md), [R11](../paths/R11.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U37](../paths/U37.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `https://platform.openai.com/settings/organization/billing/overview`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-154dbeab972a

**OpenAI 사용 한도 확인** · a · user-control

- 실제 소스: [src/ui/gpt-connection-panel.tsx:68](../../../src/ui/gpt-connection-panel.tsx#L68)
- 연결 표면: [R07](../paths/R07.md), [R11](../paths/R11.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U37](../paths/U37.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `https://platform.openai.com/settings/organization/limits`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-6913d3b69fe3

**billing?.configured ? 'API 키 교체 (선택)' : 'OpenAI API 키'** · Input · user-control

- 실제 소스: [src/ui/gpt-connection-panel.tsx:74](../../../src/ui/gpt-connection-panel.tsx#L74)
- 연결 표면: [R07](../paths/R07.md), [R11](../paths/R11.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U37](../paths/U37.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-20d687109dab](../handlers/ui__gpt-connection-panel.md#h-20d687109dab)

```tsx
e => setKey(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c7837c8b428d

**이 앱의 월 API 사용 상한** · Select · user-control

- 실제 소스: [src/ui/gpt-connection-panel.tsx:77](../../../src/ui/gpt-connection-panel.tsx#L77)
- 연결 표면: [R07](../paths/R07.md), [R11](../paths/R11.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U37](../paths/U37.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-00383acfa917](../handlers/ui__gpt-connection-panel.md#h-00383acfa917)

```tsx
e => setLimit(Number(e.target.value))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-b8acfe82ffa1

**별도 API 요금과 월 상한을 확인했습니다. 생성 버튼을 누를 때 선택한 자료를 OpenAI로 보냅니다.** · Checkbox · user-control

- 실제 소스: [src/ui/gpt-connection-panel.tsx:83](../../../src/ui/gpt-connection-panel.tsx#L83)
- 연결 표면: [R07](../paths/R07.md), [R11](../paths/R11.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U37](../paths/U37.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-d2348a9c49c3](../handlers/ui__gpt-connection-panel.md#h-d2348a9c49c3)

```tsx
e => setConfirmed(e.target.checked)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-75ef38a924ab

**API 설정 저장·사용 켜기** · Button · user-control

- 실제 소스: [src/ui/gpt-connection-panel.tsx:86](../../../src/ui/gpt-connection-panel.tsx#L86)
- 연결 표면: [R07](../paths/R07.md), [R11](../paths/R11.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U37](../paths/U37.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || !connection || !confirmed || (!billing?.configured && !key.trim())
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-2a3f8cd9221b](../handlers/ui__gpt-connection-panel.md#h-2a3f8cd9221b) → [save · H-be3bd7f64468](../handlers/ui__gpt-connection-panel.md#h-be3bd7f64468) → [message · H-ce5ce3061dbd](../handlers/ui__gpt-connection-panel.md#h-ce5ce3061dbd)

```tsx
() => void save('save')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-c258ea8ef4cf, B-76c18fed123a, B-e24e73c46e6c, B-9a820ff1ceaf, B-100e4683224b, B-c635230ff1d7, B-2c3a4eb62249

## X-720bee6654c8

**사용량 새로고침** · Button · user-control

- 실제 소스: [src/ui/gpt-connection-panel.tsx:87](../../../src/ui/gpt-connection-panel.tsx#L87)
- 연결 표면: [R07](../paths/R07.md), [R11](../paths/R11.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U37](../paths/U37.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: working || busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-b0965b8c89cf](../handlers/ui__gpt-connection-panel.md#h-b0965b8c89cf) → [message · H-ce5ce3061dbd](../handlers/ui__gpt-connection-panel.md#h-ce5ce3061dbd)

```tsx
async () => {
          setWorking(true); setError('');
          try { setConnection(await localAIStatus(owner)); setNotice('서버의 API 설정을 다시 확인했습니다.'); }
          catch (error) { setError(message(error)); } finally { setWorking(false); }
        }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-9386570e5bcf, B-2d562317a28a, B-2c3a4eb62249

## X-b73396b7ca09

**API 사용 멈추기** · Button · user-control

- 실제 소스: [src/ui/gpt-connection-panel.tsx:93](../../../src/ui/gpt-connection-panel.tsx#L93)
- 연결 표면: [R07](../paths/R07.md), [R11](../paths/R11.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U37](../paths/U37.md)
- 직접 표시 조건: truthy: billing?.configured
- 실행 차단 disabled: disabled || !billing.enabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-dbefb4321334](../handlers/ui__gpt-connection-panel.md#h-dbefb4321334) → [save · H-be3bd7f64468](../handlers/ui__gpt-connection-panel.md#h-be3bd7f64468) → [message · H-ce5ce3061dbd](../handlers/ui__gpt-connection-panel.md#h-ce5ce3061dbd)

```tsx
() => void save('pause')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-c258ea8ef4cf, B-76c18fed123a, B-e24e73c46e6c, B-9a820ff1ceaf, B-100e4683224b, B-c635230ff1d7, B-2c3a4eb62249

## X-68dfc9597a59

**API 키 삭제** · Button · user-control

- 실제 소스: [src/ui/gpt-connection-panel.tsx:94](../../../src/ui/gpt-connection-panel.tsx#L94)
- 연결 표면: [R07](../paths/R07.md), [R11](../paths/R11.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U37](../paths/U37.md)
- 직접 표시 조건: truthy: billing?.configured
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-62e0d9f61808](../handlers/ui__gpt-connection-panel.md#h-62e0d9f61808) → [save · H-be3bd7f64468](../handlers/ui__gpt-connection-panel.md#h-be3bd7f64468) → [message · H-ce5ce3061dbd](../handlers/ui__gpt-connection-panel.md#h-ce5ce3061dbd)

```tsx
() => void save('disconnect')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-c258ea8ef4cf, B-76c18fed123a, B-e24e73c46e6c, B-9a820ff1ceaf, B-100e4683224b, B-c635230ff1d7, B-2c3a4eb62249

