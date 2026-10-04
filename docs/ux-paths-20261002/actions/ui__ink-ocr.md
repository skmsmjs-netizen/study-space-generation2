# src/ui/ink-ocr.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-b1b76e8f4f1c

**필기를 글로 옮기기** · summary · user-control

- 실제 소스: [src/ui/ink-ocr.tsx:20](../../../src/ui/ink-ocr.tsx#L20)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-65eb6a6f6ec0

**이 쪽 글자 읽기** · Button · user-control

- 실제 소스: [src/ui/ink-ocr.tsx:21](../../../src/ui/ink-ocr.tsx#L21)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled||busy||!strokes.some(s=>strokePage(s)===page)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-5e164242e37f](../handlers/ui__ink-ocr.md#h-5e164242e37f) → [recognize · H-ef0b89fbf5d0](../handlers/ui__ink-ocr.md#h-ef0b89fbf5d0)

```tsx
()=>void recognize()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-4d52de6c6c74, B-0eff84181c51, B-144e55a6888d, B-6930277ece49, B-dbb73d20dae0, B-0f18a26b8714, B-60eb7edd8dc9, B-aeaa17591134

## X-ca0d099acfa1

**글자 읽기 중단** · Button · user-control

- 실제 소스: [src/ui/ink-ocr.tsx:22](../../../src/ui/ink-ocr.tsx#L22)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: truthy: busy
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-54e0915083fc](../handlers/ui__ink-ocr.md#h-54e0915083fc)

```tsx
()=>{operation.current?.abort();setBusy(false);setStatus('글자 읽기를 중단했습니다. 원본 필기는 그대로 있습니다.');}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-feb4726fa8db

**인식한 글 확인·수정** · Textarea · user-control

- 실제 소스: [src/ui/ink-ocr.tsx:24](../../../src/ui/ink-ocr.tsx#L24)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: truthy: candidate!==null
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-0e154ed47ae2](../handlers/ui__ink-ocr.md#h-0e154ed47ae2)

```tsx
e=>setCandidate(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c58ff03a0cd4

**확인한 글 넣기** · Button · user-control

- 실제 소스: [src/ui/ink-ocr.tsx:24](../../../src/ui/ink-ocr.tsx#L24)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: truthy: candidate!==null
- 실행 차단 disabled: disabled||busy||!candidate.trim()
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d94179562eef](../handlers/ui__ink-ocr.md#h-d94179562eef) → [dismiss · H-e8683280e674](../handlers/ui__ink-ocr.md#h-e8683280e674)

```tsx
()=>{onApply(candidate);dismiss();setStatus('확인한 글을 넣었습니다. 원본 필기는 유지했습니다.');}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-cda1f9881e8f, B-56cf484a30de, B-85073fa43f9d

## X-5e5de95f3da6

**인식 결과 닫기** · Button · user-control

- 실제 소스: [src/ui/ink-ocr.tsx:24](../../../src/ui/ink-ocr.tsx#L24)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: truthy: candidate!==null
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [dismiss · H-e8683280e674](../handlers/ui__ink-ocr.md#h-e8683280e674)

```tsx
dismiss
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-cda1f9881e8f, B-56cf484a30de, B-85073fa43f9d

