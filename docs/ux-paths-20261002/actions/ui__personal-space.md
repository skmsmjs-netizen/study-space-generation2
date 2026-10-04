# src/ui/personal-space.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-c5f4ab89ca60

**AccountSettings · 조작/부품 영역** · AccountSettings · component-callback-contract

- 실제 소스: [src/ui/personal-space.tsx:125](../../../src/ui/personal-space.tsx#L125)
- 연결 표면: [R40](../paths/R40.md), [O09](../paths/O09.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U05](../paths/U05.md)
- 직접 표시 조건: truthy: accessApi&&access
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 · 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
setAccess
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onWithdrawn** → [onWithdrawn · H-b9f424de5073](../handlers/ui__personal-space.md#h-b9f424de5073) → [cleanupWithdrawal · H-a89891b5f325](../handlers/ui__personal-space.md#h-a89891b5f325) → [@callback:navigator.locks.request · H-a67310cac763](../handlers/ui__personal-space.md#h-a67310cac763) → [@callback:navigator.locks.request · H-1a2c9267a897](../handlers/ui__personal-space.md#h-1a2c9267a897) → [@callback:writerTask.current.catch · H-7c8629dd7e01](../handlers/ui__personal-space.md#h-7c8629dd7e01)

```tsx
onWithdrawn
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e610c1939dd8, B-ef99a4c34339, B-783fc41db8ca, B-851ee2978893, B-26729fe7f416, B-7a9c4edac160, B-51fb5a86c405, B-d834a8b1ebda

**onDownload** → [downloadRecords · H-352a2d8b783c](../handlers/ui__personal-space.md#h-352a2d8b783c) → [@callback:setTimeout · H-d93343e6cfc9](../handlers/ui__personal-space.md#h-d93343e6cfc9) → [exportWindowRecords · H-c7ebfe02c2dc](../handlers/ui__personal-space.md#h-c7ebfe02c2dc)

```tsx
userId?downloadRecords:undefined
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7c23c2ce2e2d, B-9e5304470559, B-9bfe86ed860c, B-adae27c81ebf

## X-f8396afa4bcc

**이 기기의 자료 정리 다시 시도** · Button · user-control

- 실제 소스: [src/ui/personal-space.tsx:128](../../../src/ui/personal-space.tsx#L128)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U04](../paths/U04.md)
- 직접 표시 조건: truthy: withdrawn ∧ truthy: withdrawalNotice.includes('끝나지')
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 계정·권한 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-08c6ac62825e](../handlers/ui__personal-space.md#h-08c6ac62825e) → [cleanupWithdrawal · H-a89891b5f325](../handlers/ui__personal-space.md#h-a89891b5f325) → [@callback:navigator.locks.request · H-a67310cac763](../handlers/ui__personal-space.md#h-a67310cac763) → [@callback:navigator.locks.request · H-1a2c9267a897](../handlers/ui__personal-space.md#h-1a2c9267a897) → [@callback:writerTask.current.catch · H-7c8629dd7e01](../handlers/ui__personal-space.md#h-7c8629dd7e01)

```tsx
()=>{void cleanupWithdrawal(withdrawn);}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-851ee2978893, B-26729fe7f416, B-7a9c4edac160, B-51fb5a86c405, B-d834a8b1ebda

## X-09da112ad930

**로그인 화면으로 돌아가기** · Button · user-control

- 실제 소스: [src/ui/personal-space.tsx:128](../../../src/ui/personal-space.tsx#L128)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U04](../paths/U04.md)
- 직접 표시 조건: truthy: withdrawn
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 계정·권한 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-652e559b8d12](../handlers/ui__personal-space.md#h-652e559b8d12)

```tsx
()=>{setWithdrawn(null);setWithdrawalNotice('');}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-899409d22fca

**내 공부 공간에 연결하지 못했습니다** · ErrorState · component-callback-contract

- 실제 소스: [src/ui/personal-space.tsx:128](../../../src/ui/personal-space.tsx#L128)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U04](../paths/U04.md)
- 직접 표시 조건: falsy: withdrawn ∧ truthy: !configured
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRetry** → [@onRetry · H-2b0d92b45662](../handlers/ui__personal-space.md#h-2b0d92b45662)

```tsx
() => location.reload()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-52362084f081

**SignIn · 조작/부품 영역** · SignIn · component-callback-contract

- 실제 소스: [src/ui/personal-space.tsx:130](../../../src/ui/personal-space.tsx#L130)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U03](../paths/U03.md), [U04](../paths/U04.md)
- 직접 표시 조건: falsy: withdrawn ∧ falsy: !configured ∧ falsy: !authReady || opening ∧ truthy: !userId && client
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSignedIn** → 네이티브/호출자 동작

```tsx
setClient
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-d85e4ca966d2

**승인 상태 다시 확인** · Button · user-control

- 실제 소스: [src/ui/personal-space.tsx:131](../../../src/ui/personal-space.tsx#L131)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U04](../paths/U04.md)
- 직접 표시 조건: falsy: withdrawn ∧ falsy: !configured ∧ falsy: !authReady || opening ∧ falsy: !userId && client ∧ truthy: access && access.status !== 'approved'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 계정·권한 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-977bbebf598a](../handlers/ui__personal-space.md#h-977bbebf598a) → [@callback:setRetry · H-fda11ed1fb4e](../handlers/ui__personal-space.md#h-fda11ed1fb4e)

```tsx
() => setRetry(value => value + 1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-de32564c4854

**로그아웃** · Button · user-control

- 실제 소스: [src/ui/personal-space.tsx:131](../../../src/ui/personal-space.tsx#L131)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U04](../paths/U04.md)
- 직접 표시 조건: falsy: withdrawn ∧ falsy: !configured ∧ falsy: !authReady || opening ∧ falsy: !userId && client ∧ truthy: access && access.status !== 'approved'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 계정·권한 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-65ee6fcd8d02](../handlers/ui__personal-space.md#h-65ee6fcd8d02)

```tsx
() => { void client?.auth.signOut({ scope: 'local' }); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-ad724813f693

**내 공부 공간을 열지 못했습니다** · ErrorState · component-callback-contract

- 실제 소스: [src/ui/personal-space.tsx:132](../../../src/ui/personal-space.tsx#L132)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U04](../paths/U04.md)
- 직접 표시 조건: falsy: withdrawn ∧ falsy: !configured ∧ falsy: !authReady || opening ∧ falsy: !userId && client ∧ falsy: access && access.status !== 'approved'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRetry** → [@onRetry · H-e259df617f2f](../handlers/ui__personal-space.md#h-e259df617f2f) → [@callback:setRetry · H-9eb55a5a0e55](../handlers/ui__personal-space.md#h-9eb55a5a0e55)

```tsx
() => setRetry(value => value + 1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-8a4e35ef4039

**보관본 준비 중… 이 기기의 기록·보관본 내려받기** · Button · user-control

- 실제 소스: [src/ui/personal-space.tsx:132](../../../src/ui/personal-space.tsx#L132)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U04](../paths/U04.md)
- 직접 표시 조건: falsy: withdrawn ∧ falsy: !configured ∧ falsy: !authReady || opening ∧ falsy: !userId && client ∧ falsy: access && access.status !== 'approved'
- 실행 차단 disabled: downloading
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-86507935c1a9](../handlers/ui__personal-space.md#h-86507935c1a9) → [downloadOnError · H-6a6e1ab1865e](../handlers/ui__personal-space.md#h-6a6e1ab1865e) → [downloadRecords · H-352a2d8b783c](../handlers/ui__personal-space.md#h-352a2d8b783c) → [@callback:setTimeout · H-d93343e6cfc9](../handlers/ui__personal-space.md#h-d93343e6cfc9) → [exportWindowRecords · H-c7ebfe02c2dc](../handlers/ui__personal-space.md#h-c7ebfe02c2dc)

```tsx
() => { void downloadOnError(); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-d0c4a018a09c, B-b81ba9544aaf, B-506f9078d5f1, B-7c23c2ce2e2d, B-9e5304470559, B-9bfe86ed860c, B-adae27c81ebf

## X-ba0300bbddc7

**다시 로그인** · Button · user-control

- 실제 소스: [src/ui/personal-space.tsx:132](../../../src/ui/personal-space.tsx#L132)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U04](../paths/U04.md)
- 직접 표시 조건: falsy: withdrawn ∧ falsy: !configured ∧ falsy: !authReady || opening ∧ falsy: !userId && client ∧ falsy: access && access.status !== 'approved'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 계정·권한 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c72fdbea3ac1](../handlers/ui__personal-space.md#h-c72fdbea3ac1)

```tsx
() => { void client?.auth.signOut({ scope: 'local' }); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-2b97732b1a1e

**form · 제출 경로** · form · form

- 실제 소스: [src/ui/personal-space.tsx:157](../../../src/ui/personal-space.tsx#L157)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U03](../paths/U03.md), [U04](../paths/U04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: X-2b97732b1a1e
- 소스 의미 후보: 제출 · 계정·권한 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSubmit** → [@onSubmit · H-94c4404abeb7](../handlers/ui__personal-space.md#h-94c4404abeb7) → [submit · H-72d70cf9cad5](../handlers/ui__personal-space.md#h-72d70cf9cad5) → [errorText · H-1e95e5f672e5](../handlers/ui__personal-space.md#h-1e95e5f672e5)

```tsx
event => { event.preventDefault(); void submit(creating); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-c736871c6bee, B-d00d4b686d41, B-7b894e96c0a2, B-87864e7ae1e1, B-9d6cae08b4c7, B-84bdacc590c0, B-95c675faac76, B-3a32497654a9, B-68b465ea05c8, B-31dddda6ff64, B-e3663db43536, B-05884f470016, B-c140fd7370aa, B-39a72f9699f9

## X-59763bd48013

**이름** · Input · user-control

- 실제 소스: [src/ui/personal-space.tsx:159](../../../src/ui/personal-space.tsx#L159)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U03](../paths/U03.md), [U04](../paths/U04.md)
- 직접 표시 조건: truthy: creating
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: true; form: X-2b97732b1a1e
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-ff3bd8d8995b](../handlers/ui__personal-space.md#h-ff3bd8d8995b)

```tsx
event=>setName(event.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-9b13e521d594

**이메일** · Input · user-control

- 실제 소스: [src/ui/personal-space.tsx:160](../../../src/ui/personal-space.tsx#L160)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U03](../paths/U03.md), [U04](../paths/U04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: true; form: X-2b97732b1a1e
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-a070dbe73dad](../handlers/ui__personal-space.md#h-a070dbe73dad)

```tsx
event => setEmail(event.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-bfea97ba21a3

**creating ? "비밀번호 (6자 이상)" : "비밀번호"** · Input · user-control

- 실제 소스: [src/ui/personal-space.tsx:161](../../../src/ui/personal-space.tsx#L161)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U03](../paths/U03.md), [U04](../paths/U04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: true; form: X-2b97732b1a1e
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-8db6dc170ca8](../handlers/ui__personal-space.md#h-8db6dc170ca8)

```tsx
event => setPassword(event.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-218baba365b3

**로그인 상태 유지** · Checkbox · user-control

- 실제 소스: [src/ui/personal-space.tsx:162](../../../src/ui/personal-space.tsx#L162)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U03](../paths/U03.md), [U04](../paths/U04.md)
- 직접 표시 조건: truthy: !creating
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: X-2b97732b1a1e
- 소스 의미 후보: 입력·선택 · 계정·권한 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-836040483bbc](../handlers/ui__personal-space.md#h-836040483bbc)

```tsx
event => setRemember(event.target.checked)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-1793fab801bb

**연결 중… {creating ? '계정 만들기' : '로그인'}** · Button · user-control

- 실제 소스: [src/ui/personal-space.tsx:163](../../../src/ui/personal-space.tsx#L163)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U03](../paths/U03.md), [U04](../paths/U04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: X-2b97732b1a1e
- 소스 의미 후보: 제출 · 계정·권한 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-form-submit** → 상위 form의 onSubmit에 연결

- 정상 경계: 상위 form의 onSubmit에 연결
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-0b230dbb0554

**로그인으로 돌아가기 처음 사용하기** · Button · user-control

- 실제 소스: [src/ui/personal-space.tsx:163](../../../src/ui/personal-space.tsx#L163)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U03](../paths/U03.md), [U04](../paths/U04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: X-2b97732b1a1e
- 소스 의미 후보: 계정·권한 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-6117b07ed20e](../handlers/ui__personal-space.md#h-6117b07ed20e) → [@callback:setCreating · H-525cf6902fff](../handlers/ui__personal-space.md#h-525cf6902fff)

```tsx
() => { setCreating(value => !value); setError(''); setNotice(''); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-2245b8e01958

**{status.message} {` (${status.pending}건)`}** · Button · user-control

- 실제 소스: [src/ui/personal-space.tsx:188](../../../src/ui/personal-space.tsx#L188)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U07](../paths/U07.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-781fcb4676bb](../handlers/ui__personal-space.md#h-781fcb4676bb)

```tsx
() => setOpen(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-71980610e6fa

**내 기록의 저장 상태** · Modal · component-callback-contract

- 실제 소스: [src/ui/personal-space.tsx:189](../../../src/ui/personal-space.tsx#L189)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U07](../paths/U07.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-79bc56f50f2f](../handlers/ui__personal-space.md#h-79bc56f50f2f)

```tsx
() => setOpen(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-15b13477acde

**서버 저장 다시 시도** · Button · user-control

- 실제 소스: [src/ui/personal-space.tsx:192](../../../src/ui/personal-space.tsx#L192)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U07](../paths/U07.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-2df4f3414662](../handlers/ui__personal-space.md#h-2df4f3414662) → [@callback:repository.flush().catch · H-677da9a7c0f1](../handlers/ui__personal-space.md#h-677da9a7c0f1) → [errorText · H-1e95e5f672e5](../handlers/ui__personal-space.md#h-1e95e5f672e5)

```tsx
() => { void repository.flush().catch(error => setError(errorText(error))); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-7b3b97ea448a

**서버 기록 다시 불러오기** · Button · user-control

- 실제 소스: [src/ui/personal-space.tsx:192](../../../src/ui/personal-space.tsx#L192)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U07](../paths/U07.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-663d1b16308a](../handlers/ui__personal-space.md#h-663d1b16308a) → [@callback:repository.refresh().catch · H-e9b32dba0a96](../handlers/ui__personal-space.md#h-e9b32dba0a96) → [errorText · H-1e95e5f672e5](../handlers/ui__personal-space.md#h-1e95e5f672e5)

```tsx
() => { void repository.refresh().catch(error => setError(errorText(error))); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c707acb18b23

**이 기기의 기록·보관본 내려받기** · Button · user-control

- 실제 소스: [src/ui/personal-space.tsx:192](../../../src/ui/personal-space.tsx#L192)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U07](../paths/U07.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ad6149e1f439](../handlers/ui__personal-space.md#h-ad6149e1f439) → [download · H-6d166ad12f28](../handlers/ui__personal-space.md#h-6d166ad12f28) → [@callback:setTimeout · H-3074e643696a](../handlers/ui__personal-space.md#h-3074e643696a) → [exportWindowRecords · H-c7ebfe02c2dc](../handlers/ui__personal-space.md#h-c7ebfe02c2dc)

```tsx
() => { void download(); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-29a7f15fc521, B-40b4e10ce0eb, B-e902b9902e07, B-39c720d31eff

## X-538a997519b2

**이 기기에서 작성한 내용** · summary · user-control

- 실제 소스: [src/ui/personal-space.tsx:194](../../../src/ui/personal-space.tsx#L194)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U07](../paths/U07.md)
- 직접 표시 조건: truthy: open ∧ truthy: conflict
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c0cc043dc205

**서버의 기록·글·메모** · summary · user-control

- 실제 소스: [src/ui/personal-space.tsx:195](../../../src/ui/personal-space.tsx#L195)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U07](../paths/U07.md)
- 직접 표시 조건: truthy: open ∧ truthy: conflict
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e49cdd9c07a2

**이 기기의 글을 보관하고 서버 자료 열기** · Button · user-control

- 실제 소스: [src/ui/personal-space.tsx:196](../../../src/ui/personal-space.tsx#L196)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U07](../paths/U07.md)
- 직접 표시 조건: truthy: open ∧ truthy: conflict
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-16b2d532f39a](../handlers/ui__personal-space.md#h-16b2d532f39a) → [openServer · H-343dd4b46b03](../handlers/ui__personal-space.md#h-343dd4b46b03)

```tsx
() => { void openServer(); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-c1b299fa5545, B-0640fce69f86, B-94f8164e21ab, B-0e0617a27a11

## X-bd2313b477a6

**로그아웃** · Button · user-control

- 실제 소스: [src/ui/personal-space.tsx:199](../../../src/ui/personal-space.tsx#L199)
- 연결 표면: [R40](../paths/R40.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U07](../paths/U07.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 계정·권한 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ecb868a7de65](../handlers/ui__personal-space.md#h-ecb868a7de65) → [@callback:client.auth.signOut({ scope: 'local' }).then · H-e2c18c4a0810](../handlers/ui__personal-space.md#h-e2c18c4a0810)

```tsx
() => { void client.auth.signOut({ scope: 'local' }).then(({ error }) => { if (error) setError('로그아웃하지 못했습니다. 다시 시도해 주세요.'); }); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-13b553adef49

