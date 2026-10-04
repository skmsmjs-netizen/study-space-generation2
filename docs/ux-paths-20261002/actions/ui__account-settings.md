# src/ui/account-settings.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-8437aea65878

**내 계정** · Button · user-control

- 실제 소스: [src/ui/account-settings.tsx:22](../../../src/ui/account-settings.tsx#L22)
- 연결 표면: [R40](../paths/R40.md), [O09](../paths/O09.md), [O21](../paths/O21.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U05](../paths/U05.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-2e6f3545af9e](../handlers/ui__account-settings.md#h-2e6f3545af9e)

```tsx
()=>{setOpen(true);setError('');setNotice('');}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c68bade8504b

**내 계정** · Modal · component-callback-contract

- 실제 소스: [src/ui/account-settings.tsx:23](../../../src/ui/account-settings.tsx#L23)
- 연결 표면: [R40](../paths/R40.md), [O09](../paths/O09.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U05](../paths/U05.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-7ac38736a6cb](../handlers/ui__account-settings.md#h-7ac38736a6cb)

```tsx
()=>{if(!busy){setOpen(false);setDeleting(false);setConfirmation('');}}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-3720d55cd548

## X-b5b1ab5c6662

**form · 제출 경로** · form · form

- 실제 소스: [src/ui/account-settings.tsx:25](../../../src/ui/account-settings.tsx#L25)
- 연결 표면: [R40](../paths/R40.md), [O09](../paths/O09.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U05](../paths/U05.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: X-b5b1ab5c6662
- 소스 의미 후보: 제출 · 저장·변경 요청 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSubmit** → [@onSubmit · H-93f6d6c90533](../handlers/ui__account-settings.md#h-93f6d6c90533) → [saveName · H-ecc22e06213b](../handlers/ui__account-settings.md#h-ecc22e06213b)

```tsx
event=>{event.preventDefault();void saveName();}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-b3a3fa4302b1, B-9f528640adcd, B-2221b6031e6a, B-d1dcf93ee31b, B-9e395acf7016

## X-81b18f66d398

**이름** · Input · user-control

- 실제 소스: [src/ui/account-settings.tsx:25](../../../src/ui/account-settings.tsx#L25)
- 연결 표면: [R40](../paths/R40.md), [O09](../paths/O09.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U05](../paths/U05.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: true; form: X-b5b1ab5c6662
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-c049490111c5](../handlers/ui__account-settings.md#h-c049490111c5)

```tsx
event=>setName(event.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-5c99466da4a0

**이름 저장** · Button · user-control

- 실제 소스: [src/ui/account-settings.tsx:25](../../../src/ui/account-settings.tsx#L25)
- 연결 표면: [R40](../paths/R40.md), [O09](../paths/O09.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U05](../paths/U05.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: X-b5b1ab5c6662
- 소스 의미 후보: 제출 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-form-submit** → 상위 form의 onSubmit에 연결

- 정상 경계: 상위 form의 onSubmit에 연결
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-374b6460fd2d

**탈퇴 전 기록 내려받기** · Button · user-control

- 실제 소스: [src/ui/account-settings.tsx:29](../../../src/ui/account-settings.tsx#L29)
- 연결 표면: [R40](../paths/R40.md), [O09](../paths/O09.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U05](../paths/U05.md)
- 직접 표시 조건: truthy: open ∧ truthy: onDownload
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 · 계정·권한 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ee288e4058c0](../handlers/ui__account-settings.md#h-ee288e4058c0) → [download · H-06f9b3dfd913](../handlers/ui__account-settings.md#h-06f9b3dfd913)

```tsx
()=>{void download();}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-31a7a5f75d29, B-cb161b5ee8a0, B-92fcee58fde5

## X-c845941b33c6

**회원 탈퇴** · Button · user-control

- 실제 소스: [src/ui/account-settings.tsx:31](../../../src/ui/account-settings.tsx#L31)
- 연결 표면: [R40](../paths/R40.md), [O09](../paths/O09.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U05](../paths/U05.md)
- 직접 표시 조건: truthy: open ∧ truthy: !deleting
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 계정·권한 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-449b3dbb0c96](../handlers/ui__account-settings.md#h-449b3dbb0c96)

```tsx
()=>{setDeleting(true);setConfirmation('');setError('');}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e89f0e663450

**확인을 위해 ‘탈퇴’를 입력해 주세요** · Input · user-control

- 실제 소스: [src/ui/account-settings.tsx:32](../../../src/ui/account-settings.tsx#L32)
- 연결 표면: [R40](../paths/R40.md), [O09](../paths/O09.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U05](../paths/U05.md)
- 직접 표시 조건: truthy: open ∧ falsy: !deleting
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 계정·권한 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-7885696059ca](../handlers/ui__account-settings.md#h-7885696059ca)

```tsx
event=>setConfirmation(event.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-8062ccb81dde

**탈퇴 처리 중… 계정과 기록 삭제** · Button · user-control

- 실제 소스: [src/ui/account-settings.tsx:33](../../../src/ui/account-settings.tsx#L33)
- 연결 표면: [R40](../paths/R40.md), [O09](../paths/O09.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U05](../paths/U05.md)
- 직접 표시 조건: truthy: open ∧ falsy: !deleting
- 실행 차단 disabled: busy||confirmation!=='탈퇴'
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 · 계정·권한 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-6255993ed8c8](../handlers/ui__account-settings.md#h-6255993ed8c8) → [withdraw · H-d474141ed619](../handlers/ui__account-settings.md#h-d474141ed619)

```tsx
()=>{void withdraw();}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-6fa9a89fcb7e, B-4cc0a3930b1f, B-72ceea16cd4f, B-2d1e808c7507, B-0ed87702fae1

## X-8bb94d3ad814

**취소** · Button · user-control

- 실제 소스: [src/ui/account-settings.tsx:33](../../../src/ui/account-settings.tsx#L33)
- 연결 표면: [R40](../paths/R40.md), [O09](../paths/O09.md), [U02](../paths/U02.md), [U04](../paths/U04.md), [U05](../paths/U05.md)
- 직접 표시 조건: truthy: open ∧ falsy: !deleting
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-bd7ff41bb3ef](../handlers/ui__account-settings.md#h-bd7ff41bb3ef)

```tsx
()=>{setDeleting(false);setConfirmation('');}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

