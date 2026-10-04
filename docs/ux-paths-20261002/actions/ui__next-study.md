# src/ui/next-study.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-8bd865e30b20

**'focus'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/next-study.tsx:35](../../../src/ui/next-study.tsx#L35)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**focus** → [refresh · H-d5993e744385](../handlers/ui__next-study.md#h-d5993e744385)

```tsx
refresh
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-be0c9a42713d

**'visibilitychange'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/next-study.tsx:35](../../../src/ui/next-study.tsx#L35)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**visibilitychange** → [refresh · H-d5993e744385](../handlers/ui__next-study.md#h-d5993e744385)

```tsx
refresh
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-3a00330b7765

**LearningScheduleEditor · 조작/부품 영역** · LearningScheduleEditor · component-callback-contract

- 실제 소스: [src/ui/next-study.tsx:121](../../../src/ui/next-study.tsx#L121)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: blocked || !serverReady
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-f15adc9c6173](../handlers/ui__next-study.md#h-f15adc9c6173) → [@callback:write · H-6407680551aa](../handlers/ui__next-study.md#h-6407680551aa) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
w=>write(()=>w)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

## X-78c47eda5618

**(ErrorState · 동적/도형 조작)** · ErrorState · component-callback-contract

- 실제 소스: [src/ui/next-study.tsx:122](../../../src/ui/next-study.tsx#L122)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: onlySchedules ∧ truthy: error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRetry** → [retry · H-ee91b7993f3d](../handlers/ui__next-study.md#h-ee91b7993f3d) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3)

```tsx
retry
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-2b2c62ce7b60, B-98059ed59bb2, B-32b095afbd61, B-a7dd8deff3fe, B-70512a88eb1a, B-b9f2a9ef9309, B-2a3d00809a1a, B-eae8f055e3a8, B-86cdb491eae4, B-c0066e1ceb80

## X-8c0facd1cf18

**이 기기에 남아 있는 이전 추천 기록** · summary · user-control

- 실제 소스: [src/ui/next-study.tsx:127](../../../src/ui/next-study.tsx#L127)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: legacyPersonal?.raw
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-ddb0afcea608

**이전 추천 내용을 개인 공간에 가져오기** · Button · user-control

- 실제 소스: [src/ui/next-study.tsx:127](../../../src/ui/next-study.tsx#L127)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: legacyPersonal?.raw
- 실행 차단 disabled: !serverReady
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [importLegacy · H-71f5c77200a7](../handlers/ui__next-study.md#h-71f5c77200a7)

```tsx
importLegacy
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-cf5df527279d, B-d8ba9fd479d8, B-a3bd52fa1c47, B-8d674dbd41e9

## X-6a498f780eeb

**확인할 내용 추가** · Button · user-control

- 실제 소스: [src/ui/next-study.tsx:128](../../../src/ui/next-study.tsx#L128)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: blocked || !serverReady
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-46e319b69504](../handlers/ui__next-study.md#h-46e319b69504)

```tsx
() => setPlanOpen(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-557d7e3cc7c3

**(ErrorState · 동적/도형 조작)** · ErrorState · component-callback-contract

- 실제 소스: [src/ui/next-study.tsx:132](../../../src/ui/next-study.tsx#L132)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: error || calculationError
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRetry** → [retry · H-ee91b7993f3d](../handlers/ui__next-study.md#h-ee91b7993f3d) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3)

```tsx
retry
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-2b2c62ce7b60, B-98059ed59bb2, B-32b095afbd61, B-a7dd8deff3fe, B-70512a88eb1a, B-b9f2a9ef9309, B-2a3d00809a1a, B-eae8f055e3a8, B-86cdb491eae4, B-c0066e1ceb80

## X-5f1a01a7c11a

**일정에서 확인하기** · Button · user-control

- 실제 소스: [src/ui/next-study.tsx:136](../../../src/ui/next-study.tsx#L136)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: !blocked && !calculationError ∧ truthy: !node ∧ truthy: schedule
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-34220cb42fd2](../handlers/ui__next-study.md#h-34220cb42fd2)

```tsx
() => openLearningSchedules()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(visible) · 134행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-d2b931548e8b

**확인한 결과 남기기** · Button · user-control

- 실제 소스: [src/ui/next-study.tsx:145](../../../src/ui/next-study.tsx#L145)
- 연결 표면: [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: !blocked && !calculationError ∧ truthy: node ∧ truthy: goal
- 실행 차단 disabled: !serverReady
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-30df838b67fc](../handlers/ui__next-study.md#h-30df838b67fc) → [beginResponse · H-4745b0e8d769](../handlers/ui__next-study.md#h-4745b0e8d769) → [@callback:write · H-7af57c3b9423](../handlers/ui__next-study.md#h-7af57c3b9423) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
() => beginResponse(id)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-eb2b56b11f9d, B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

반복: map(card.requirements) · 140행; map(visible) · 134행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-cffc90202195

**다시 정리했어요** · Button · user-control

- 실제 소스: [src/ui/next-study.tsx:145](../../../src/ui/next-study.tsx#L145)
- 연결 표면: [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: !blocked && !calculationError ∧ truthy: node ∧ truthy: goal ∧ truthy: state.status === 'error_open'
- 실행 차단 disabled: !serverReady
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ca568afa9ba8](../handlers/ui__next-study.md#h-ca568afa9ba8) → [correct · H-8cc1aaad906e](../handlers/ui__next-study.md#h-8cc1aaad906e) → [@callback:write · H-1da5789b455d](../handlers/ui__next-study.md#h-1da5789b455d) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
() => correct(goal)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-1ed256f99a68, B-5d6b4697a180, B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

반복: map(card.requirements) · 140행; map(visible) · 134행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-e13e701c74d6

**주제 열고 시작하기** · Button · user-control

- 실제 소스: [src/ui/next-study.tsx:149](../../../src/ui/next-study.tsx#L149)
- 연결 표면: [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: !blocked && !calculationError ∧ truthy: node
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ef3a00c1260e](../handlers/ui__next-study.md#h-ef3a00c1260e)

```tsx
() => navigate(`/node/${node.id}`)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(visible) · 134행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-013fa9cd9220

**하루 보류** · Button · user-control

- 실제 소스: [src/ui/next-study.tsx:149](../../../src/ui/next-study.tsx#L149)
- 연결 표면: [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: !blocked && !calculationError ∧ truthy: node
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-142a205d51fc](../handlers/ui__next-study.md#h-142a205d51fc) → [snooze · H-1c5186779f7f](../handlers/ui__next-study.md#h-1c5186779f7f) → [@callback:write · H-62ee5ee710b7](../handlers/ui__next-study.md#h-62ee5ee710b7) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
() => snooze(node.id)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

반복: map(visible) · 134행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-b4fa8e42c7d6

**주제 열고 시작하기** · Button · user-control

- 실제 소스: [src/ui/next-study.tsx:154](../../../src/ui/next-study.tsx#L154)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: !blocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-2f6e8b3406a4](../handlers/ui__next-study.md#h-2f6e8b3406a4)

```tsx
() => navigate(`/node/${node.id}`)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(fallback) · 152행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-001b791491dc

**하루 보류** · Button · user-control

- 실제 소스: [src/ui/next-study.tsx:154](../../../src/ui/next-study.tsx#L154)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: !blocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-fc0686d9c1cc](../handlers/ui__next-study.md#h-fc0686d9c1cc) → [snooze · H-1c5186779f7f](../handlers/ui__next-study.md#h-1c5186779f7f) → [@callback:write · H-62ee5ee710b7](../handlers/ui__next-study.md#h-62ee5ee710b7) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
() => snooze(node.id)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

반복: map(fallback) · 152행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-36c79eebe544

**다른 주제 직접 고르기** · Button · user-control

- 실제 소스: [src/ui/next-study.tsx:157](../../../src/ui/next-study.tsx#L157)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-4bb8242d7ce9](../handlers/ui__next-study.md#h-4bb8242d7ce9)

```tsx
() => navigate('/subjects')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-7be5fb8abddd

**학기 기간 설정** · Button · user-control

- 실제 소스: [src/ui/next-study.tsx:157](../../../src/ui/next-study.tsx#L157)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: blocked || !serverReady
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-5b1bf99daa9a](../handlers/ui__next-study.md#h-5b1bf99daa9a)

```tsx
() => setTermOpen(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c24c99494822

**보류한 내용 다시 보기** · Button · user-control

- 실제 소스: [src/ui/next-study.tsx:157](../../../src/ui/next-study.tsx#L157)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: Object.values(workspace.controls).some(c => c.snoozeUntil)
- 실행 차단 disabled: blocked || !serverReady
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-22ec11471d6a](../handlers/ui__next-study.md#h-22ec11471d6a) → [@callback:write · H-ffafe7dfa2d5](../handlers/ui__next-study.md#h-ffafe7dfa2d5) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
() => write(w => ({ ...w, controls: {} }))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

## X-6083530bff15

**확인한 내용과 지난 기한 보기** · summary · user-control

- 실제 소스: [src/ui/next-study.tsx:158](../../../src/ui/next-study.tsx#L158)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: goals.length > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-622380068329

**결과 추가** · Button · user-control

- 실제 소스: [src/ui/next-study.tsx:160](../../../src/ui/next-study.tsx#L160)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: goals.length > 0
- 실행 차단 disabled: blocked || !serverReady
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-f2375f469373](../handlers/ui__next-study.md#h-f2375f469373) → [beginResponse · H-4745b0e8d769](../handlers/ui__next-study.md#h-4745b0e8d769) → [@callback:write · H-7af57c3b9423](../handlers/ui__next-study.md#h-7af57c3b9423) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
() => beginResponse(goal.id)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-eb2b56b11f9d, B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

반복: map(goals) · 158행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-07ff9bb987bf

**다시 후보로 추천에서 빼기** · Button · user-control

- 실제 소스: [src/ui/next-study.tsx:160](../../../src/ui/next-study.tsx#L160)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: goals.length > 0
- 실행 차단 disabled: blocked || !serverReady
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-8f53ec64569b](../handlers/ui__next-study.md#h-8f53ec64569b) → [@callback:write · H-0d8b8103fc03](../handlers/ui__next-study.md#h-0d8b8103fc03) → [@callback:w.goals.map · H-fdfeeb4f0285](../handlers/ui__next-study.md#h-fdfeeb4f0285) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
() => write(w => ({ ...w, goals: w.goals.map(g => g.id === goal.id ? { ...g, ended: !g.ended } : g) }))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f7f67e93bed4, B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

반복: map(goals) · 158행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-c99ed30e61c0

**다음에 확인할 내용** · Modal · component-callback-contract

- 실제 소스: [src/ui/next-study.tsx:163](../../../src/ui/next-study.tsx#L163)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: planOpen
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-4a359b5cff0d](../handlers/ui__next-study.md#h-4a359b5cff0d)

```tsx
() => setPlanOpen(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-a8dff2764933

**확인할 주제** · Select · user-control

- 실제 소스: [src/ui/next-study.tsx:165](../../../src/ui/next-study.tsx#L165)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: planOpen
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-790460713e03](../handlers/ui__next-study.md#h-790460713e03) → [draftChange · H-7bf1421c1b4e](../handlers/ui__next-study.md#h-7bf1421c1b4e) → [@callback:write · H-056b891c97c3](../handlers/ui__next-study.md#h-056b891c97c3) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
e => draftChange({ targetId: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

## X-1c48e3454514

**자료 없이 확인할 내용** · Textarea · user-control

- 실제 소스: [src/ui/next-study.tsx:166](../../../src/ui/next-study.tsx#L166)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: planOpen
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-161dcaa5c8a5](../handlers/ui__next-study.md#h-161dcaa5c8a5) → [draftChange · H-7bf1421c1b4e](../handlers/ui__next-study.md#h-7bf1421c1b4e) → [@callback:write · H-056b891c97c3](../handlers/ui__next-study.md#h-056b891c97c3) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
e => draftChange({ label: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

## X-a3246072d59b

**확인할 문항** · Select · user-control

- 실제 소스: [src/ui/next-study.tsx:167](../../../src/ui/next-study.tsx#L167)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: planOpen
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-3fe27b18c101](../handlers/ui__next-study.md#h-3fe27b18c101) → [draftChange · H-7bf1421c1b4e](../handlers/ui__next-study.md#h-7bf1421c1b4e) → [@callback:write · H-056b891c97c3](../handlers/ui__next-study.md#h-056b891c97c3) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
e => draftChange({ novelty: e.target.value as 'same' | 'new' })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

## X-6ae4087f30b8

**지연 확인 간격 · 일 · 선택** · Input · user-control

- 실제 소스: [src/ui/next-study.tsx:168](../../../src/ui/next-study.tsx#L168)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: planOpen
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-97e94ed02fa0](../handlers/ui__next-study.md#h-97e94ed02fa0) → [draftChange · H-7bf1421c1b4e](../handlers/ui__next-study.md#h-7bf1421c1b4e) → [@callback:write · H-056b891c97c3](../handlers/ui__next-study.md#h-056b891c97c3) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
e=>draftChange({minDelayDays:e.target.value===''?undefined:Number(e.target.value)})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-9d0d18e08959, B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

## X-4dd541fc3440

**확인 기한 · 선택** · Input · user-control

- 실제 소스: [src/ui/next-study.tsx:169](../../../src/ui/next-study.tsx#L169)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: planOpen
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-596a48a92cf6](../handlers/ui__next-study.md#h-596a48a92cf6) → [draftChange · H-7bf1421c1b4e](../handlers/ui__next-study.md#h-7bf1421c1b4e) → [@callback:write · H-056b891c97c3](../handlers/ui__next-study.md#h-056b891c97c3) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
e => draftChange({ dueDate: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

## X-87ed443d659a

**확인할 내용 저장** · Button · user-control

- 실제 소스: [src/ui/next-study.tsx:170](../../../src/ui/next-study.tsx#L170)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: planOpen
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [addGoal · H-5b4eb5a3404b](../handlers/ui__next-study.md#h-5b4eb5a3404b) → [@callback:write · H-77e7355b49be](../handlers/ui__next-study.md#h-77e7355b49be) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9) → [@callback:nodes.some · H-7c42524e1c2b](../handlers/ui__next-study.md#h-7c42524e1c2b)

```tsx
addGoal
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-b41a6dd17a40, B-ffab297b5287, B-c7340b0b4fae, B-f21d602422eb, B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

## X-a687d4b89ee1

**학기 기간** · Modal · component-callback-contract

- 실제 소스: [src/ui/next-study.tsx:172](../../../src/ui/next-study.tsx#L172)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O17](../paths/O17.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: termOpen
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-4ef99756c902](../handlers/ui__next-study.md#h-4ef99756c902)

```tsx
() => setTermOpen(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e04016d8e57e

**기간을 남길 학기** · Select · user-control

- 실제 소스: [src/ui/next-study.tsx:174](../../../src/ui/next-study.tsx#L174)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O17](../paths/O17.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: termOpen
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-ec7a4d2674c7](../handlers/ui__next-study.md#h-ec7a4d2674c7) → [@callback:write · H-bf0e80bcd033](../handlers/ui__next-study.md#h-bf0e80bcd033) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
e => { const id = e.target.value, dates = workspace.terms?.[id] ?? { start: '', end: '' }; write(w => ({ ...w, termDraft: { semesterId: id, ...dates } }), true); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

## X-48cbbcc05e43

**학기 시작일 · 선택** · Input · user-control

- 실제 소스: [src/ui/next-study.tsx:175](../../../src/ui/next-study.tsx#L175)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O17](../paths/O17.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: termOpen
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onInput** → [@onInput · H-43b79eaae19f](../handlers/ui__next-study.md#h-43b79eaae19f) → [termChange · H-768bfdc4af86](../handlers/ui__next-study.md#h-768bfdc4af86) → [@callback:write · H-8a0b3c5bcbbe](../handlers/ui__next-study.md#h-8a0b3c5bcbbe) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
e => termChange('start', e.currentTarget.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-46923f1f129a, B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

**onChange** → [@onChange · H-8c26b3abcde6](../handlers/ui__next-study.md#h-8c26b3abcde6) → [termChange · H-768bfdc4af86](../handlers/ui__next-study.md#h-768bfdc4af86) → [@callback:write · H-8a0b3c5bcbbe](../handlers/ui__next-study.md#h-8a0b3c5bcbbe) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
e => termChange('start', e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-46923f1f129a, B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

## X-353bc36f6e5a

**학기 종료일 · 선택** · Input · user-control

- 실제 소스: [src/ui/next-study.tsx:176](../../../src/ui/next-study.tsx#L176)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O17](../paths/O17.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: termOpen
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onInput** → [@onInput · H-e3df35c15571](../handlers/ui__next-study.md#h-e3df35c15571) → [termChange · H-768bfdc4af86](../handlers/ui__next-study.md#h-768bfdc4af86) → [@callback:write · H-8a0b3c5bcbbe](../handlers/ui__next-study.md#h-8a0b3c5bcbbe) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
e => termChange('end', e.currentTarget.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-46923f1f129a, B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

**onChange** → [@onChange · H-c880d64ff336](../handlers/ui__next-study.md#h-c880d64ff336) → [termChange · H-768bfdc4af86](../handlers/ui__next-study.md#h-768bfdc4af86) → [@callback:write · H-8a0b3c5bcbbe](../handlers/ui__next-study.md#h-8a0b3c5bcbbe) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
e => termChange('end', e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-46923f1f129a, B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

## X-f399b0c744b1

**학기 기간 저장** · Button · user-control

- 실제 소스: [src/ui/next-study.tsx:177](../../../src/ui/next-study.tsx#L177)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O17](../paths/O17.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: termOpen
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [saveTerm · H-fb482c7fb1cd](../handlers/ui__next-study.md#h-fb482c7fb1cd) → [@callback:write · H-60a063b2c8fc](../handlers/ui__next-study.md#h-60a063b2c8fc) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9) → [@callback:semesters.some · H-a90f12fec930](../handlers/ui__next-study.md#h-a90f12fec930)

```tsx
saveTerm
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7f6280648e00, B-ed13b863a168, B-ab0d5a1290b2, B-6cb8851ec41d, B-512624b4d2dd, B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

## X-c77788551010

**지금 확인한 결과** · Modal · component-callback-contract

- 실제 소스: [src/ui/next-study.tsx:179](../../../src/ui/next-study.tsx#L179)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: Boolean(responseId)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-c964972a3f91](../handlers/ui__next-study.md#h-c964972a3f91)

```tsx
() => setResponseId(null)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-ea17a114d1a3

**확인 결과** · Select · user-control

- 실제 소스: [src/ui/next-study.tsx:181](../../../src/ui/next-study.tsx#L181)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: Boolean(responseId) ∧ truthy: response
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-80c8aa79165a](../handlers/ui__next-study.md#h-80c8aa79165a) → [responseChange · H-a274753209ca](../handlers/ui__next-study.md#h-a274753209ca) → [@callback:write · H-c83ad8015d99](../handlers/ui__next-study.md#h-c83ad8015d99) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
e => responseChange({ result: e.target.value as ResponseDraft['result'] })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-aafe931bed4b, B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

## X-5f3f939f08ef

**도움 사용** · Select · user-control

- 실제 소스: [src/ui/next-study.tsx:182](../../../src/ui/next-study.tsx#L182)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: Boolean(responseId) ∧ truthy: response
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-2f054e46b67e](../handlers/ui__next-study.md#h-2f054e46b67e) → [responseChange · H-a274753209ca](../handlers/ui__next-study.md#h-a274753209ca) → [@callback:write · H-c83ad8015d99](../handlers/ui__next-study.md#h-c83ad8015d99) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
e => responseChange({ assistance: e.target.value as ResponseDraft['assistance'] })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-aafe931bed4b, B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

## X-24b2f94a93e8

**실제로 확인한 문항** · Select · user-control

- 실제 소스: [src/ui/next-study.tsx:183](../../../src/ui/next-study.tsx#L183)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: Boolean(responseId) ∧ truthy: response
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-234aad09dfd5](../handlers/ui__next-study.md#h-234aad09dfd5) → [responseChange · H-a274753209ca](../handlers/ui__next-study.md#h-a274753209ca) → [@callback:write · H-c83ad8015d99](../handlers/ui__next-study.md#h-c83ad8015d99) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
e => responseChange({ novelty: e.target.value as ResponseDraft['novelty'] })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-aafe931bed4b, B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

## X-9581ef4eb724

**실제로 지난 간격 · 일 · 선택** · Input · user-control

- 실제 소스: [src/ui/next-study.tsx:184](../../../src/ui/next-study.tsx#L184)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: Boolean(responseId) ∧ truthy: response
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-73a7e41337af](../handlers/ui__next-study.md#h-73a7e41337af) → [responseChange · H-a274753209ca](../handlers/ui__next-study.md#h-a274753209ca) → [@callback:write · H-c83ad8015d99](../handlers/ui__next-study.md#h-c83ad8015d99) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
e=>responseChange({delayDays:e.target.value===''?undefined:Number(e.target.value),delayVerified:false})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-79f18a4ef03f, B-aafe931bed4b, B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

## X-fe0a001c64cc

**간격 확인** · Select · user-control

- 실제 소스: [src/ui/next-study.tsx:185](../../../src/ui/next-study.tsx#L185)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: Boolean(responseId) ∧ truthy: response
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-5e4a3715b3ef](../handlers/ui__next-study.md#h-5e4a3715b3ef) → [responseChange · H-a274753209ca](../handlers/ui__next-study.md#h-a274753209ca) → [@callback:write · H-c83ad8015d99](../handlers/ui__next-study.md#h-c83ad8015d99) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
e=>responseChange({delayVerified:e.target.value==='verified'})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-aafe931bed4b, B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

## X-42a9cc65a018

**남길 답변과 메모 · 선택** · Textarea · user-control

- 실제 소스: [src/ui/next-study.tsx:186](../../../src/ui/next-study.tsx#L186)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: Boolean(responseId) ∧ truthy: response
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-888de0a0c5ef](../handlers/ui__next-study.md#h-888de0a0c5ef) → [responseChange · H-a274753209ca](../handlers/ui__next-study.md#h-a274753209ca) → [@callback:write · H-c83ad8015d99](../handlers/ui__next-study.md#h-c83ad8015d99) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9)

```tsx
e => responseChange({ answer: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-aafe931bed4b, B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

## X-ec8da0c7df0c

**수행 결과 저장** · Button · user-control

- 실제 소스: [src/ui/next-study.tsx:187](../../../src/ui/next-study.tsx#L187)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: Boolean(responseId) ∧ truthy: response
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [saveResponse · H-accac0d16ec4](../handlers/ui__next-study.md#h-accac0d16ec4) → [@callback:write · H-697342bb1f7a](../handlers/ui__next-study.md#h-697342bb1f7a) → [write · H-5e12f7cadcf8](../handlers/ui__next-study.md#h-5e12f7cadcf8) → [save · H-b9fafe08a2d3](../handlers/ui__next-study.md#h-b9fafe08a2d3) → [@callback:data.records.map · H-710b264ee5c9](../handlers/ui__next-study.md#h-710b264ee5c9) → [@callback:w.goals.find · H-911cd54f8906](../handlers/ui__next-study.md#h-911cd54f8906)

```tsx
saveResponse
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-5f086409bcaa, B-53d361b2be09, B-e9200ecda621, B-992a9194d1ab, B-33a273c8d4d0, B-2a91779dc3a6, B-8b7e84bfa364, B-c1dee75c5896, B-dbbfef553a2f, B-3ed375c7e9ba, B-e0264727f5de, B-0635b2ec36f3, B-c0066e1ceb80

