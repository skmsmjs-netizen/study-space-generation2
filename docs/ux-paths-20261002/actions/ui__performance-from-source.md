# src/ui/performance-from-source.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-76263eeed64a

**이 답안으로 수행 결과 남기기** · Button · user-control

- 실제 소스: [src/ui/performance-from-source.tsx:45](../../../src/ui/performance-from-source.tsx#L45)
- 연결 표면: [R10](../paths/R10.md), [R11](../paths/R11.md), [R26](../paths/R26.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [O20](../paths/O20.md), [U20](../paths/U20.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: !capable
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [begin · H-08ce4ff9a5b1](../handlers/ui__performance-from-source.md#h-08ce4ff9a5b1) → [@callback:nextPlan.workspace.goals.find · H-f8de7095adcc](../handlers/ui__performance-from-source.md#h-f8de7095adcc) → [choose · H-3a9941bbb058](../handlers/ui__performance-from-source.md#h-3a9941bbb058) → [retain · H-cd56136ce5de](../handlers/ui__performance-from-source.md#h-cd56136ce5de)

```tsx
begin
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-05182d6cc747, B-f2b0c3d7bbc4, B-ad198c67d00a, B-2cb6713d90ba, B-f4e9f3fe4b31, B-a4a37db9ea5c, B-800e50cc19df, B-20460223c3fb, B-fc2ff452d33d, B-d4a9fb491a14, B-ce4ff5a5a715, B-4ecce4488418

## X-d9394bf5eb50

**답안에서 수행 결과 남기기** · Modal · component-callback-contract

- 실제 소스: [src/ui/performance-from-source.tsx:47](../../../src/ui/performance-from-source.tsx#L47)
- 연결 표면: [R10](../paths/R10.md), [R11](../paths/R11.md), [R26](../paths/R26.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [O20](../paths/O20.md), [U20](../paths/U20.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-a15df327262f](../handlers/ui__performance-from-source.md#h-a15df327262f)

```tsx
() => setOpen(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-5da00d980cf3

**연결할 원문 답안 보기** · summary · user-control

- 실제 소스: [src/ui/performance-from-source.tsx:50](../../../src/ui/performance-from-source.tsx#L50)
- 연결 표면: [R10](../paths/R10.md), [R11](../paths/R11.md), [R26](../paths/R26.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [O20](../paths/O20.md), [U20](../paths/U20.md)
- 직접 표시 조건: truthy: open ∧ truthy: source && plan
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-3928a2f6b71d

**확인할 내용** · Select · user-control

- 실제 소스: [src/ui/performance-from-source.tsx:55](../../../src/ui/performance-from-source.tsx#L55)
- 연결 표면: [R10](../paths/R10.md), [R11](../paths/R11.md), [R26](../paths/R26.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [O20](../paths/O20.md), [U20](../paths/U20.md)
- 직접 표시 조건: truthy: open ∧ truthy: source && plan
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-fc4ab0abeacd](../handlers/ui__performance-from-source.md#h-fc4ab0abeacd) → [choose · H-3a9941bbb058](../handlers/ui__performance-from-source.md#h-3a9941bbb058) → [retain · H-cd56136ce5de](../handlers/ui__performance-from-source.md#h-cd56136ce5de)

```tsx
e => choose(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-20460223c3fb, B-fc2ff452d33d, B-d4a9fb491a14, B-ce4ff5a5a715, B-4ecce4488418

## X-83d86aaf1232

**홈으로 가기** · a · user-control

- 실제 소스: [src/ui/performance-from-source.tsx:58](../../../src/ui/performance-from-source.tsx#L58)
- 연결 표면: [R10](../paths/R10.md), [R11](../paths/R11.md), [R26](../paths/R26.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [O20](../paths/O20.md), [U20](../paths/U20.md)
- 직접 표시 조건: truthy: open ∧ truthy: source && plan ∧ truthy: !plan.workspace.goals.some(g => !g.ended && g.targetId === source.topicId)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-188b5a03e978

**수행 결과** · Select · user-control

- 실제 소스: [src/ui/performance-from-source.tsx:59](../../../src/ui/performance-from-source.tsx#L59)
- 연결 표면: [R10](../paths/R10.md), [R11](../paths/R11.md), [R26](../paths/R26.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [O20](../paths/O20.md), [U20](../paths/U20.md)
- 직접 표시 조건: truthy: open ∧ truthy: source && plan
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-1b514b8c56f5](../handlers/ui__performance-from-source.md#h-1b514b8c56f5) → [change · H-8f16e10621fc](../handlers/ui__performance-from-source.md#h-8f16e10621fc) → [retain · H-cd56136ce5de](../handlers/ui__performance-from-source.md#h-cd56136ce5de)

```tsx
e => change({...response,result:e.target.value as ResponseDraft['result']})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-fc2ff452d33d, B-d4a9fb491a14, B-ce4ff5a5a715, B-4ecce4488418

## X-693162d20f9e

**도움 여부** · Select · user-control

- 실제 소스: [src/ui/performance-from-source.tsx:62](../../../src/ui/performance-from-source.tsx#L62)
- 연결 표면: [R10](../paths/R10.md), [R11](../paths/R11.md), [R26](../paths/R26.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [O20](../paths/O20.md), [U20](../paths/U20.md)
- 직접 표시 조건: truthy: open ∧ truthy: source && plan
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-98ec2c597397](../handlers/ui__performance-from-source.md#h-98ec2c597397) → [change · H-8f16e10621fc](../handlers/ui__performance-from-source.md#h-8f16e10621fc) → [retain · H-cd56136ce5de](../handlers/ui__performance-from-source.md#h-cd56136ce5de)

```tsx
e => change({...response,assistance:e.target.value as ResponseDraft['assistance']})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-fc2ff452d33d, B-d4a9fb491a14, B-ce4ff5a5a715, B-4ecce4488418

## X-b6709aa311c4

**문항의 새로움** · Select · user-control

- 실제 소스: [src/ui/performance-from-source.tsx:63](../../../src/ui/performance-from-source.tsx#L63)
- 연결 표면: [R10](../paths/R10.md), [R11](../paths/R11.md), [R26](../paths/R26.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [O20](../paths/O20.md), [U20](../paths/U20.md)
- 직접 표시 조건: truthy: open ∧ truthy: source && plan
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-532fefa53db9](../handlers/ui__performance-from-source.md#h-532fefa53db9) → [change · H-8f16e10621fc](../handlers/ui__performance-from-source.md#h-8f16e10621fc) → [retain · H-cd56136ce5de](../handlers/ui__performance-from-source.md#h-cd56136ce5de)

```tsx
e => change({...response,novelty:e.target.value as ResponseDraft['novelty']})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-fc2ff452d33d, B-d4a9fb491a14, B-ce4ff5a5a715, B-4ecce4488418

## X-8672190a4f39

**초안 원문을 보관하고 다시 선택** · Button · user-control

- 실제 소스: [src/ui/performance-from-source.tsx:65](../../../src/ui/performance-from-source.tsx#L65)
- 연결 표면: [R10](../paths/R10.md), [R11](../paths/R11.md), [R26](../paths/R26.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [O20](../paths/O20.md), [U20](../paths/U20.md)
- 직접 표시 조건: truthy: open ∧ truthy: source && plan ∧ truthy: draftBlocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ca6e901b2365](../handlers/ui__performance-from-source.md#h-ca6e901b2365)

```tsx
() => {try{if(draft.current){archiveDamagedDraft(draft.current.key, "수행 결과 초안 원문");clearStoredDraft(draft.current.key);draft.current.raw=null;}setDraftBlocked(false);setResponse(emptyResponse());setError("");}catch(e){setError(e instanceof Error ? e.message : "원문을 보관하지 못했습니다.");}}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-bdef1d8570a9, B-a0e4dfb3284c, B-d9ff51b2b36f, B-5e4888877b19

## X-d22cd746850e

**결과 남기기** · Button · user-control

- 실제 소스: [src/ui/performance-from-source.tsx:65](../../../src/ui/performance-from-source.tsx#L65)
- 연결 표면: [R10](../paths/R10.md), [R11](../paths/R11.md), [R26](../paths/R26.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [O20](../paths/O20.md), [U20](../paths/U20.md)
- 직접 표시 조건: truthy: open ∧ truthy: source && plan
- 실행 차단 disabled: !goalId || !capable || draftBlocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [save · H-7a9d19b12cb6](../handlers/ui__performance-from-source.md#h-7a9d19b12cb6)

```tsx
save
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-5486bfaaec40, B-b85d5b27d49e, B-22188d33c005, B-c64a662c0bc5, B-330c7c38548a

