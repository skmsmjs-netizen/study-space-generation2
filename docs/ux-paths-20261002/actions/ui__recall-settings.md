# src/ui/recall-settings.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-20de14dcdda5

**{`${recallPreference(data, deckId)?.deckName ?? '덱'} 복습 설정`} 복습 설정** · summary · user-control

- 실제 소스: [src/ui/recall-settings.tsx:33](../../../src/ui/recall-settings.tsx#L33)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U27](../paths/U27.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e6729263e240

**덱 이름** · Input · user-control

- 실제 소스: [src/ui/recall-settings.tsx:34](../../../src/ui/recall-settings.tsx#L34)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U27](../paths/U27.md)
- 직접 표시 조건: truthy: deckId
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-db7dc0186ada](../handlers/ui__recall-settings.md#h-db7dc0186ada) → [remember · H-70911937f2f8](../handlers/ui__recall-settings.md#h-70911937f2f8)

```tsx
e => { setName(e.target.value); remember({ name: e.target.value }); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-422d9cb82fa1

## X-14698320bda4

**하루 새 카드 수** · Input · user-control

- 실제 소스: [src/ui/recall-settings.tsx:36](../../../src/ui/recall-settings.tsx#L36)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U27](../paths/U27.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-93406f6bf85e](../handlers/ui__recall-settings.md#h-93406f6bf85e) → [remember · H-70911937f2f8](../handlers/ui__recall-settings.md#h-70911937f2f8)

```tsx
e => { const next = { ...options, newPerDay: Number(e.target.value) }; setOptions(next); remember({ options: next }); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-422d9cb82fa1

## X-3c0b1bcb2aa3

**목표 기억률 (%)** · Input · user-control

- 실제 소스: [src/ui/recall-settings.tsx:37](../../../src/ui/recall-settings.tsx#L37)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U27](../paths/U27.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-04cef9dbb493](../handlers/ui__recall-settings.md#h-04cef9dbb493) → [remember · H-70911937f2f8](../handlers/ui__recall-settings.md#h-70911937f2f8)

```tsx
e => { const next = { ...options, retention: Number(e.target.value) / 100 }; setOptions(next); remember({ options: next }); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-422d9cb82fa1

## X-a218b451d5de

**학습 단계 (분)** · Input · user-control

- 실제 소스: [src/ui/recall-settings.tsx:38](../../../src/ui/recall-settings.tsx#L38)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U27](../paths/U27.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-8f49e980b59c](../handlers/ui__recall-settings.md#h-8f49e980b59c) → [remember · H-70911937f2f8](../handlers/ui__recall-settings.md#h-70911937f2f8)

```tsx
e => { setLearning(e.target.value); remember({ learning: e.target.value }); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-422d9cb82fa1

## X-821f97a266af

**재학습 단계 (분)** · Input · user-control

- 실제 소스: [src/ui/recall-settings.tsx:39](../../../src/ui/recall-settings.tsx#L39)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U27](../paths/U27.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-27c029e51d66](../handlers/ui__recall-settings.md#h-27c029e51d66) → [remember · H-70911937f2f8](../handlers/ui__recall-settings.md#h-70911937f2f8)

```tsx
e => { setRelearning(e.target.value); remember({ relearning: e.target.value }); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-422d9cb82fa1

## X-3d8a97ddd33c

**최대 복습 간격 (일)** · Input · user-control

- 실제 소스: [src/ui/recall-settings.tsx:40](../../../src/ui/recall-settings.tsx#L40)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U27](../paths/U27.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-17f7a6a23e7f](../handlers/ui__recall-settings.md#h-17f7a6a23e7f) → [remember · H-70911937f2f8](../handlers/ui__recall-settings.md#h-70911937f2f8)

```tsx
e => { const next = { ...options, maximumDays: Number(e.target.value) }; setOptions(next); remember({ options: next }); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-422d9cb82fa1

## X-362fb12fbf31

**같은 문장의 다른 빈칸 카드는 다음 날에 보기** · Checkbox · user-control

- 실제 소스: [src/ui/recall-settings.tsx:42](../../../src/ui/recall-settings.tsx#L42)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U27](../paths/U27.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-ecd69238e54c](../handlers/ui__recall-settings.md#h-ecd69238e54c) → [remember · H-70911937f2f8](../handlers/ui__recall-settings.md#h-70911937f2f8)

```tsx
e => { const next = { ...options, burySiblings: e.target.checked }; setOptions(next); remember({ options: next }); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-422d9cb82fa1

## X-154999ce5c02

**복습 설정 저장** · Button · user-control

- 실제 소스: [src/ui/recall-settings.tsx:44](../../../src/ui/recall-settings.tsx#L44)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U27](../paths/U27.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [save · H-2369db483818](../handlers/ui__recall-settings.md#h-2369db483818) → [remember · H-70911937f2f8](../handlers/ui__recall-settings.md#h-70911937f2f8) → [@callback:saved.recallPreferences!.find · H-cd149a5fd9c4](../handlers/ui__recall-settings.md#h-cd149a5fd9c4) → [parse · H-aa0fdb72c015](../handlers/ui__recall-settings.md#h-aa0fdb72c015) → [@callback:text.split(',').map · H-0e390b28b48a](../handlers/ui__recall-settings.md#h-0e390b28b48a)

```tsx
save
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-19784e340543, B-8740e8033528, B-9ba695c2200e, B-79a31b15fa85, B-422d9cb82fa1, B-f07f0864a291, B-4f9086eacc04

## X-efdada08fd03

**RecallOptimization · 조작/부품 영역** · RecallOptimization · component-callback-contract

- 실제 소스: [src/ui/recall-settings.tsx:46](../../../src/ui/recall-settings.tsx#L46)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U27](../paths/U27.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || dirty
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onApplied** → [@onApplied · H-217985f50ac6](../handlers/ui__recall-settings.md#h-217985f50ac6) → [remember · H-70911937f2f8](../handlers/ui__recall-settings.md#h-70911937f2f8)

```tsx
saved => {
      const options = recallOptions(saved, deckId), version = recallPreference(saved, deckId)!.version; setOptions(options); setVersion(version); remember({ options, version }); onSaved(saved);
    }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-422d9cb82fa1

