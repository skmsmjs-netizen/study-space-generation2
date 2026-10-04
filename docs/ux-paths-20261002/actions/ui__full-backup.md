# src/ui/full-backup.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-b81a61fac957

**'beforeunload'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/full-backup.tsx:42](../../../src/ui/full-backup.tsx#L42)
- 연결 표면: [R33](../paths/R33.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**beforeunload** → [prevent · H-01708d1eeaf4](../handlers/ui__full-backup.md#h-01708d1eeaf4)

```tsx
prevent
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-cdefeb8d051e

**전체 백업 내려받기** · Button · user-control

- 실제 소스: [src/ui/full-backup.tsx:70](../../../src/ui/full-backup.tsx#L70)
- 연결 표면: [R33](../paths/R33.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: busy || restored
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d52444715284](../handlers/ui__full-backup.md#h-d52444715284) → [backup · H-f05eb78d7965](../handlers/ui__full-backup.md#h-f05eb78d7965) → [errorText · H-715f0d33795a](../handlers/ui__full-backup.md#h-715f0d33795a) → [download · H-1a13821307fd](../handlers/ui__full-backup.md#h-1a13821307fd) → [requestDownload · H-b0e346d450b1](../handlers/ui__full-backup.md#h-b0e346d450b1)

```tsx
() => { void backup(); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-3ba3748071ea, B-67f4de5b7ced, B-10c75b835366, B-96423dcc4ed6, B-8b82b726a2ce, B-80b87f5a22a9

## X-87cd8b2d7ef9

**전체 백업 파일** · Input · user-control

- 실제 소스: [src/ui/full-backup.tsx:73](../../../src/ui/full-backup.tsx#L73)
- 연결 표면: [R33](../paths/R33.md)
- 직접 표시 조건: truthy: !restored
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-559c9d1433c4](../handlers/ui__full-backup.md#h-559c9d1433c4) → [review · H-c512e359c39f](../handlers/ui__full-backup.md#h-c512e359c39f) → [errorText · H-715f0d33795a](../handlers/ui__full-backup.md#h-715f0d33795a)

```tsx
event => { const file = event.target.files?.[0]; if (file) void review(file); event.target.value = ''; }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-c5170500f22e, B-4b33c9a11551, B-9ca966703404, B-5462919f259b, B-10c75b835366

## X-72d3ca53328e

**현재 이 기기 자료를 보관한 뒤 백업 내용으로 복원합니다** · Checkbox · user-control

- 실제 소스: [src/ui/full-backup.tsx:76](../../../src/ui/full-backup.tsx#L76)
- 연결 표면: [R33](../paths/R33.md)
- 직접 표시 조건: truthy: !restored ∧ truthy: checked
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-643c2fbc9974](../handlers/ui__full-backup.md#h-643c2fbc9974)

```tsx
event => setConfirmed(event.target.checked)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c1933a737963

**이 기기에 복원** · Button · user-control

- 실제 소스: [src/ui/full-backup.tsx:77](../../../src/ui/full-backup.tsx#L77)
- 연결 표면: [R33](../paths/R33.md)
- 직접 표시 조건: truthy: !restored ∧ truthy: checked
- 실행 차단 disabled: busy || !confirmed
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-a2966ca182be](../handlers/ui__full-backup.md#h-a2966ca182be) → [restore · H-5b6a02deb878](../handlers/ui__full-backup.md#h-5b6a02deb878) → [errorText · H-715f0d33795a](../handlers/ui__full-backup.md#h-715f0d33795a) → [@callback:navigator.locks.request · H-a8a4ba088dcc](../handlers/ui__full-backup.md#h-a8a4ba088dcc)

```tsx
() => { void restore(); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-778bd5f09338, B-c089e6e4f9f7, B-72337f795fb6, B-638eed2819d9, B-10c75b835366

## X-308a0ee94c04

**취소** · Button · user-control

- 실제 소스: [src/ui/full-backup.tsx:77](../../../src/ui/full-backup.tsx#L77)
- 연결 표면: [R33](../paths/R33.md)
- 직접 표시 조건: truthy: !restored ∧ truthy: checked
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-cd5daeb0ed91](../handlers/ui__full-backup.md#h-cd5daeb0ed91)

```tsx
() => { setChecked(null); setConfirmed(false); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-cec7e1f4b919

**백업 파일 다시 저장** · a · user-control

- 실제 소스: [src/ui/full-backup.tsx:84](../../../src/ui/full-backup.tsx#L84)
- 연결 표면: [R33](../paths/R33.md)
- 직접 표시 조건: truthy: prepared?.ownerKey === ownerKey && !busy && !restored
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `prepared.url`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-697e90f1afd4

**다시 열어 복원하기** · Button · user-control

- 실제 소스: [src/ui/full-backup.tsx:88](../../../src/ui/full-backup.tsx#L88)
- 연결 표면: [R33](../paths/R33.md)
- 직접 표시 조건: truthy: restored
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-fe0f9f692e74](../handlers/ui__full-backup.md#h-fe0f9f692e74)

```tsx
() => location.reload()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-92569cc55653

**{new Date(row.createdAt).toLocaleString('ko-KR')} 보관본 내려받기** · Button · user-control

- 실제 소스: [src/ui/full-backup.tsx:89](../../../src/ui/full-backup.tsx#L89)
- 연결 표면: [R33](../paths/R33.md)
- 직접 표시 조건: truthy: prior.length > 0
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 · 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-2a6b199c885f](../handlers/ui__full-backup.md#h-2a6b199c885f) → [download · H-1a13821307fd](../handlers/ui__full-backup.md#h-1a13821307fd) → [requestDownload · H-b0e346d450b1](../handlers/ui__full-backup.md#h-b0e346d450b1)

```tsx
() => download(row.file, `study-before-restore-${row.id}.zip`)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-96423dcc4ed6, B-8b82b726a2ce, B-80b87f5a22a9

반복: map(prior) · 89행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-e3178979c303

**백업 복원·복구를 마치지 못했습니다** · ErrorState · component-callback-contract

- 실제 소스: [src/ui/full-backup.tsx:101](../../../src/ui/full-backup.tsx#L101)
- 연결 표면: [U08](../paths/U08.md)
- 직접 표시 조건: truthy: error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRetry** → [@onRetry · H-d665a5197623](../handlers/ui__full-backup.md#h-d665a5197623)

```tsx
() => location.reload()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-557b0bc67fdc

**복원 요청 취소하고 기존 공간 열기** · Button · user-control

- 실제 소스: [src/ui/full-backup.tsx:101](../../../src/ui/full-backup.tsx#L101)
- 연결 표면: [U08](../paths/U08.md)
- 직접 표시 조건: truthy: error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 · 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c7831a235455](../handlers/ui__full-backup.md#h-c7831a235455) → [@callback:cancelPlannedBackup().then · H-f18122a38ea3](../handlers/ui__full-backup.md#h-f18122a38ea3)

```tsx
() => { void cancelPlannedBackup().then(() => location.reload()); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

