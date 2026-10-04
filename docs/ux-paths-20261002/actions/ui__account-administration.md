# src/ui/account-administration.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-12975bc8647e

**가입 계정 관리** · Button · user-control

- 실제 소스: [src/ui/account-administration.tsx:32](../../../src/ui/account-administration.tsx#L32)
- 연결 표면: [R40](../paths/R40.md), [O08](../paths/O08.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U06](../paths/U06.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-954c05101e7e](../handlers/ui__account-administration.md#h-954c05101e7e)

```tsx
() => setOpen(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-f7759594b557

**가입 계정 관리** · Modal · component-callback-contract

- 실제 소스: [src/ui/account-administration.tsx:33](../../../src/ui/account-administration.tsx#L33)
- 연결 표면: [R40](../paths/R40.md), [O08](../paths/O08.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U06](../paths/U06.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-267205f39ffb](../handlers/ui__account-administration.md#h-267205f39ffb)

```tsx
() => { if (!busy) setOpen(false); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-2c9c8ab1d574

## X-794a7131c370

**목록 새로고침** · Button · user-control

- 실제 소스: [src/ui/account-administration.tsx:36](../../../src/ui/account-administration.tsx#L36)
- 연결 표면: [R40](../paths/R40.md), [O08](../paths/O08.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U06](../paths/U06.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-e7578843d3c5](../handlers/ui__account-administration.md#h-e7578843d3c5) → [load · H-58ec931ebd97](../handlers/ui__account-administration.md#h-58ec931ebd97) → [@callback:setAccounts · H-79b8558d8f42](../handlers/ui__account-administration.md#h-79b8558d8f42)

```tsx
() => { setDecision(null); void load(); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-73a21d37f74a, B-78dd47f4afde, B-61ce9f4f5327, B-2f5ae9bd440c, B-cd0ae06469cf

## X-f5e3a6bc3c43

**승인** · Button · user-control

- 실제 소스: [src/ui/account-administration.tsx:42](../../../src/ui/account-administration.tsx#L42)
- 연결 표면: [R40](../paths/R40.md), [O08](../paths/O08.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U06](../paths/U06.md)
- 직접 표시 조건: truthy: open ∧ truthy: !account.administrator ∧ truthy: account.status !== 'approved'
- 실행 차단 disabled: busy || !account.emailConfirmed
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 계정·권한 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-300d2e58bde3](../handlers/ui__account-administration.md#h-300d2e58bde3)

```tsx
() => setDecision({ account, status: 'approved' })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(accounts) · 39행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-9e7b5ff6219d

**거절** · Button · user-control

- 실제 소스: [src/ui/account-administration.tsx:43](../../../src/ui/account-administration.tsx#L43)
- 연결 표면: [R40](../paths/R40.md), [O08](../paths/O08.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U06](../paths/U06.md)
- 직접 표시 조건: truthy: open ∧ truthy: !account.administrator ∧ truthy: account.status === 'pending'
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-be628307b4ce](../handlers/ui__account-administration.md#h-be628307b4ce)

```tsx
() => setDecision({ account, status: 'rejected' })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(accounts) · 39행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-b46a31b12a00

**이용 중지** · Button · user-control

- 실제 소스: [src/ui/account-administration.tsx:44](../../../src/ui/account-administration.tsx#L44)
- 연결 표면: [R40](../paths/R40.md), [O08](../paths/O08.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U06](../paths/U06.md)
- 직접 표시 조건: truthy: open ∧ truthy: !account.administrator ∧ truthy: account.status === 'approved'
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-e58c4f5972bc](../handlers/ui__account-administration.md#h-e58c4f5972bc)

```tsx
() => setDecision({ account, status: 'suspended' })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(accounts) · 39행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-fce36f02845e

**승인 대기로 변경** · Button · user-control

- 실제 소스: [src/ui/account-administration.tsx:45](../../../src/ui/account-administration.tsx#L45)
- 연결 표면: [R40](../paths/R40.md), [O08](../paths/O08.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U06](../paths/U06.md)
- 직접 표시 조건: truthy: open ∧ truthy: !account.administrator ∧ truthy: ['rejected','suspended'].includes(account.status)
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 계정·권한 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-dda355ca9479](../handlers/ui__account-administration.md#h-dda355ca9479)

```tsx
() => setDecision({ account, status: 'pending' })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(accounts) · 39행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-93f58c26897f

**계정 더 보기** · Button · user-control

- 실제 소스: [src/ui/account-administration.tsx:49](../../../src/ui/account-administration.tsx#L49)
- 연결 표면: [R40](../paths/R40.md), [O08](../paths/O08.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U06](../paths/U06.md)
- 직접 표시 조건: truthy: open ∧ truthy: cursor
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-dc4ff294adda](../handlers/ui__account-administration.md#h-dc4ff294adda) → [load · H-58ec931ebd97](../handlers/ui__account-administration.md#h-58ec931ebd97) → [@callback:setAccounts · H-79b8558d8f42](../handlers/ui__account-administration.md#h-79b8558d8f42)

```tsx
() => { void load(true); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-73a21d37f74a, B-78dd47f4afde, B-61ce9f4f5327, B-2f5ae9bd440c, B-cd0ae06469cf

## X-b15ca6edc3d0

**변경 확인** · Button · user-control

- 실제 소스: [src/ui/account-administration.tsx:51](../../../src/ui/account-administration.tsx#L51)
- 연결 표면: [R40](../paths/R40.md), [O08](../paths/O08.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U06](../paths/U06.md)
- 직접 표시 조건: truthy: open ∧ truthy: decision
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-64884a835209](../handlers/ui__account-administration.md#h-64884a835209) → [save · H-ed069da26af0](../handlers/ui__account-administration.md#h-ed069da26af0)

```tsx
() => { void save(); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-ecb39911487b, B-fed26ed3df11, B-9a4dc017c154, B-7f0c7c8bc6ab

## X-f975008dcc69

**취소** · Button · user-control

- 실제 소스: [src/ui/account-administration.tsx:51](../../../src/ui/account-administration.tsx#L51)
- 연결 표면: [R40](../paths/R40.md), [O08](../paths/O08.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U06](../paths/U06.md)
- 직접 표시 조건: truthy: open ∧ truthy: decision
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-72107032878e](../handlers/ui__account-administration.md#h-72107032878e)

```tsx
() => setDecision(null)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

