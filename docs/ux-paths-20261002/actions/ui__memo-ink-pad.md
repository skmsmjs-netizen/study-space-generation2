# src/ui/memo-ink-pad.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-c4ab0929359b

**'beforeunload'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/memo-ink-pad.tsx:243](../../../src/ui/memo-ink-pad.tsx#L243)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**beforeunload** → [flush · H-4a06b744321b](../handlers/ui__memo-ink-pad.md#h-4a06b744321b)

```tsx
flush
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-6c81302281ee

**'pagehide'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/memo-ink-pad.tsx:244](../../../src/ui/memo-ink-pad.tsx#L244)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**pagehide** → [flush · H-4a06b744321b](../handlers/ui__memo-ink-pad.md#h-4a06b744321b)

```tsx
flush
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-d941ab3ffe7b

**'visibilitychange'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/memo-ink-pad.tsx:245](../../../src/ui/memo-ink-pad.tsx#L245)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**visibilitychange** → [hidden · H-12fc95b58402](../handlers/ui__memo-ink-pad.md#h-12fc95b58402) → [flush · H-4a06b744321b](../handlers/ui__memo-ink-pad.md#h-4a06b744321b)

```tsx
hidden
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-279cc14ce3d7

## X-63af1910af6f

**펜** · Button · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:454](../../../src/ui/memo-ink-pad.tsx#L454)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-99755ea7e4b4](../handlers/ui__memo-ink-pad.md#h-99755ea7e4b4)

```tsx
() => setTool('pen')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-d6c0680e2531

**지우개** · Button · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:457](../../../src/ui/memo-ink-pad.tsx#L457)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-245e192af854](../handlers/ui__memo-ink-pad.md#h-245e192af854)

```tsx
() => setTool('eraser')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-cae7e9b24ff9

**선택** · Button · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:464](../../../src/ui/memo-ink-pad.tsx#L464)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-6f59957fead8](../handlers/ui__memo-ink-pad.md#h-6f59957fead8)

```tsx
() => setTool('select')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-4ad2ba41448a

**그림 되돌리기** · Button · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:471](../../../src/ui/memo-ink-pad.tsx#L471)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: locked || !view.undo.length
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-edaa48d6cfed](../handlers/ui__memo-ink-pad.md#h-edaa48d6cfed) → [undo · H-73572dc6240c](../handlers/ui__memo-ink-pad.md#h-73572dc6240c) → [changeView · H-a43ba4a4e331](../handlers/ui__memo-ink-pad.md#h-a43ba4a4e331) → [schedule · H-3ff1236f0fd5](../handlers/ui__memo-ink-pad.md#h-3ff1236f0fd5) → [persist · H-bd3dda9a5f22](../handlers/ui__memo-ink-pad.md#h-bd3dda9a5f22) → [emit · H-0b45f24dd326](../handlers/ui__memo-ink-pad.md#h-0b45f24dd326)

```tsx
() => undo(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-662c55b52e35, B-63a2c250fa78, B-c8124e17802f, B-4296cbc66e2e, B-1ed3220939a6, B-b6caabf05a90, B-87c626a70008, B-acdba1bfc077, B-43145cc8cf16, B-90017f31da2b, B-c7f80ab7e6cb

## X-70ed15324492

**다시 그리기** · Button · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:478](../../../src/ui/memo-ink-pad.tsx#L478)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: locked || !view.redo.length
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-1970797f0951](../handlers/ui__memo-ink-pad.md#h-1970797f0951) → [undo · H-73572dc6240c](../handlers/ui__memo-ink-pad.md#h-73572dc6240c) → [changeView · H-a43ba4a4e331](../handlers/ui__memo-ink-pad.md#h-a43ba4a4e331) → [schedule · H-3ff1236f0fd5](../handlers/ui__memo-ink-pad.md#h-3ff1236f0fd5) → [persist · H-bd3dda9a5f22](../handlers/ui__memo-ink-pad.md#h-bd3dda9a5f22) → [emit · H-0b45f24dd326](../handlers/ui__memo-ink-pad.md#h-0b45f24dd326)

```tsx
() => undo(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-662c55b52e35, B-63a2c250fa78, B-c8124e17802f, B-4296cbc66e2e, B-1ed3220939a6, B-b6caabf05a90, B-87c626a70008, B-acdba1bfc077, B-43145cc8cf16, B-90017f31da2b, B-c7f80ab7e6cb

## X-7e2f38b75529

**선택 모양** · Select · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:488](../../../src/ui/memo-ink-pad.tsx#L488)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: truthy: tool === 'select'
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-981b37b616f1](../handlers/ui__memo-ink-pad.md#h-981b37b616f1)

```tsx
e=>setSelectionShape(e.target.value as 'box'|'lasso')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-35aaf9926b37

**펜 색** · Select · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:489](../../../src/ui/memo-ink-pad.tsx#L489)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-d9ef601218a4](../handlers/ui__memo-ink-pad.md#h-d9ef601218a4) → [preference · H-cf44b655248b](../handlers/ui__memo-ink-pad.md#h-cf44b655248b) → [schedule · H-3ff1236f0fd5](../handlers/ui__memo-ink-pad.md#h-3ff1236f0fd5) → [persist · H-bd3dda9a5f22](../handlers/ui__memo-ink-pad.md#h-bd3dda9a5f22)

```tsx
(e) => preference({ ink: e.target.value as MemoInk })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-4296cbc66e2e, B-1ed3220939a6, B-b6caabf05a90, B-87c626a70008, B-acdba1bfc077, B-43145cc8cf16, B-90017f31da2b, B-c7f80ab7e6cb

## X-a02014b71ba3

**펜 굵기** · Select · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:499](../../../src/ui/memo-ink-pad.tsx#L499)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-f9a298584987](../handlers/ui__memo-ink-pad.md#h-f9a298584987) → [preference · H-cf44b655248b](../handlers/ui__memo-ink-pad.md#h-cf44b655248b) → [schedule · H-3ff1236f0fd5](../handlers/ui__memo-ink-pad.md#h-3ff1236f0fd5) → [persist · H-bd3dda9a5f22](../handlers/ui__memo-ink-pad.md#h-bd3dda9a5f22)

```tsx
(e) => preference({ width: Number(e.target.value) })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-4296cbc66e2e, B-1ed3220939a6, B-b6caabf05a90, B-87c626a70008, B-acdba1bfc077, B-43145cc8cf16, B-90017f31da2b, B-c7f80ab7e6cb

## X-dbfae48e7bbc

**지우는 방식** · Select · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:512](../../../src/ui/memo-ink-pad.tsx#L512)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: truthy: tool === 'eraser'
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-f592b36b1d56](../handlers/ui__memo-ink-pad.md#h-f592b36b1d56)

```tsx
(e) => setWhole(e.target.value === 'whole')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-9d90178938f6

**이전 필기 쪽** · Button · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:524](../../../src/ui/memo-ink-pad.tsx#L524)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: locked || !view.page
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 저장·변경 요청 · 취소·닫기 · 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-3d5e8e0630ad](../handlers/ui__memo-ink-pad.md#h-3d5e8e0630ad) → [navigatePage · H-01e6416c78fc](../handlers/ui__memo-ink-pad.md#h-01e6416c78fc) → [changeView · H-a43ba4a4e331](../handlers/ui__memo-ink-pad.md#h-a43ba4a4e331) → [schedule · H-3ff1236f0fd5](../handlers/ui__memo-ink-pad.md#h-3ff1236f0fd5) → [persist · H-bd3dda9a5f22](../handlers/ui__memo-ink-pad.md#h-bd3dda9a5f22) → [finish · H-a05f029b5939](../handlers/ui__memo-ink-pad.md#h-a05f029b5939) → [markDrawing · H-2a100eba2a54](../handlers/ui__memo-ink-pad.md#h-2a100eba2a54) → [commit · H-fca8288b4d46](../handlers/ui__memo-ink-pad.md#h-fca8288b4d46) → [emit · H-0b45f24dd326](../handlers/ui__memo-ink-pad.md#h-0b45f24dd326)

```tsx
() => navigatePage(view.page - 1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-63ecc2e753c2, B-4296cbc66e2e, B-1ed3220939a6, B-b6caabf05a90, B-87c626a70008, B-acdba1bfc077, B-43145cc8cf16, B-90017f31da2b, B-c7f80ab7e6cb, B-c0e8e4a54e07, B-613d52b53bb2, B-9c19a669f03a, B-3b7c30167c2f, B-3b3578ff7563

## X-f1e55302627d

**필기 쪽** · Select · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:531](../../../src/ui/memo-ink-pad.tsx#L531)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 입력·선택 · 저장·변경 요청 · 취소·닫기 · 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-6f65e23f90eb](../handlers/ui__memo-ink-pad.md#h-6f65e23f90eb) → [navigatePage · H-01e6416c78fc](../handlers/ui__memo-ink-pad.md#h-01e6416c78fc) → [changeView · H-a43ba4a4e331](../handlers/ui__memo-ink-pad.md#h-a43ba4a4e331) → [schedule · H-3ff1236f0fd5](../handlers/ui__memo-ink-pad.md#h-3ff1236f0fd5) → [persist · H-bd3dda9a5f22](../handlers/ui__memo-ink-pad.md#h-bd3dda9a5f22) → [finish · H-a05f029b5939](../handlers/ui__memo-ink-pad.md#h-a05f029b5939) → [markDrawing · H-2a100eba2a54](../handlers/ui__memo-ink-pad.md#h-2a100eba2a54) → [commit · H-fca8288b4d46](../handlers/ui__memo-ink-pad.md#h-fca8288b4d46) → [emit · H-0b45f24dd326](../handlers/ui__memo-ink-pad.md#h-0b45f24dd326)

```tsx
(e) => navigatePage(Number(e.target.value))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-63ecc2e753c2, B-4296cbc66e2e, B-1ed3220939a6, B-b6caabf05a90, B-87c626a70008, B-acdba1bfc077, B-43145cc8cf16, B-90017f31da2b, B-c7f80ab7e6cb, B-c0e8e4a54e07, B-613d52b53bb2, B-9c19a669f03a, B-3b7c30167c2f, B-3b3578ff7563

## X-d3010ab29925

**다음 필기 쪽** · Button · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:554](../../../src/ui/memo-ink-pad.tsx#L554)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: locked || view.page + 1 >= pages
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 저장·변경 요청 · 취소·닫기 · 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d15b839c75e4](../handlers/ui__memo-ink-pad.md#h-d15b839c75e4) → [navigatePage · H-01e6416c78fc](../handlers/ui__memo-ink-pad.md#h-01e6416c78fc) → [changeView · H-a43ba4a4e331](../handlers/ui__memo-ink-pad.md#h-a43ba4a4e331) → [schedule · H-3ff1236f0fd5](../handlers/ui__memo-ink-pad.md#h-3ff1236f0fd5) → [persist · H-bd3dda9a5f22](../handlers/ui__memo-ink-pad.md#h-bd3dda9a5f22) → [finish · H-a05f029b5939](../handlers/ui__memo-ink-pad.md#h-a05f029b5939) → [markDrawing · H-2a100eba2a54](../handlers/ui__memo-ink-pad.md#h-2a100eba2a54) → [commit · H-fca8288b4d46](../handlers/ui__memo-ink-pad.md#h-fca8288b4d46) → [emit · H-0b45f24dd326](../handlers/ui__memo-ink-pad.md#h-0b45f24dd326)

```tsx
() => navigatePage(view.page + 1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-63ecc2e753c2, B-4296cbc66e2e, B-1ed3220939a6, B-b6caabf05a90, B-87c626a70008, B-acdba1bfc077, B-43145cc8cf16, B-90017f31da2b, B-c7f80ab7e6cb, B-c0e8e4a54e07, B-613d52b53bb2, B-9c19a669f03a, B-3b7c30167c2f, B-3b3578ff7563

## X-16b618fcb05d

**쪽 추가** · Button · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:561](../../../src/ui/memo-ink-pad.tsx#L561)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 저장·변경 요청 · 취소·닫기 · 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-8943b726bc4f](../handlers/ui__memo-ink-pad.md#h-8943b726bc4f) → [navigatePage · H-01e6416c78fc](../handlers/ui__memo-ink-pad.md#h-01e6416c78fc) → [changeView · H-a43ba4a4e331](../handlers/ui__memo-ink-pad.md#h-a43ba4a4e331) → [schedule · H-3ff1236f0fd5](../handlers/ui__memo-ink-pad.md#h-3ff1236f0fd5) → [persist · H-bd3dda9a5f22](../handlers/ui__memo-ink-pad.md#h-bd3dda9a5f22) → [finish · H-a05f029b5939](../handlers/ui__memo-ink-pad.md#h-a05f029b5939) → [markDrawing · H-2a100eba2a54](../handlers/ui__memo-ink-pad.md#h-2a100eba2a54) → [commit · H-fca8288b4d46](../handlers/ui__memo-ink-pad.md#h-fca8288b4d46) → [emit · H-0b45f24dd326](../handlers/ui__memo-ink-pad.md#h-0b45f24dd326)

```tsx
() => {
            changeView({ pages: pages + 1 });
            navigatePage(pages);
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-63ecc2e753c2, B-4296cbc66e2e, B-1ed3220939a6, B-b6caabf05a90, B-87c626a70008, B-acdba1bfc077, B-43145cc8cf16, B-90017f31da2b, B-c7f80ab7e6cb, B-c0e8e4a54e07, B-613d52b53bb2, B-9c19a669f03a, B-3b7c30167c2f, B-3b3578ff7563

## X-f0dcf45a916f

**종이 확대** · Button · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:570](../../../src/ui/memo-ink-pad.tsx#L570)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-e7842868ed13](../handlers/ui__memo-ink-pad.md#h-e7842868ed13) → [changeView · H-a43ba4a4e331](../handlers/ui__memo-ink-pad.md#h-a43ba4a4e331) → [schedule · H-3ff1236f0fd5](../handlers/ui__memo-ink-pad.md#h-3ff1236f0fd5) → [persist · H-bd3dda9a5f22](../handlers/ui__memo-ink-pad.md#h-bd3dda9a5f22)

```tsx
() => changeView({ zoom: view.zoom === 1 ? 1.5 : view.zoom === 1.5 ? 2 : 1 })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-b2866f382f03, B-a77b57e41167, B-4296cbc66e2e, B-1ed3220939a6, B-b6caabf05a90, B-87c626a70008, B-acdba1bfc077, B-43145cc8cf16, B-90017f31da2b, B-c7f80ab7e6cb

## X-b7ca79d1089f

**보기 초기화** · Button · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:577](../../../src/ui/memo-ink-pad.tsx#L577)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ed32602961dc](../handlers/ui__memo-ink-pad.md#h-ed32602961dc) → [changeView · H-a43ba4a4e331](../handlers/ui__memo-ink-pad.md#h-a43ba4a4e331) → [schedule · H-3ff1236f0fd5](../handlers/ui__memo-ink-pad.md#h-3ff1236f0fd5) → [persist · H-bd3dda9a5f22](../handlers/ui__memo-ink-pad.md#h-bd3dda9a5f22)

```tsx
() => {
            changeView({ zoom: 1 });
            if (viewport.current) {
              viewport.current.scrollLeft = 0;
              viewport.current.scrollTop = 0;
            }
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-dbf3b2392bed, B-4296cbc66e2e, B-1ed3220939a6, B-b6caabf05a90, B-87c626a70008, B-acdba1bfc077, B-43145cc8cf16, B-90017f31da2b, B-c7f80ab7e6cb

## X-0644866e3d52

**작게 보기 넓게 쓰기** · Button · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:589](../../../src/ui/memo-ink-pad.tsx#L589)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ac5de2cfb8f5](../handlers/ui__memo-ink-pad.md#h-ac5de2cfb8f5)

```tsx
() => setExpanded(!expanded)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-d00d9030c489

**drawingLabel** · svg · event-surface

- 실제 소스: [src/ui/memo-ink-pad.tsx:595](../../../src/ui/memo-ink-pad.tsx#L595)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 · 취소·닫기 · 복원·되돌리기 · 포인터·공간 조작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onPointerDown** → [begin · H-ac67665041f0](../handlers/ui__memo-ink-pad.md#h-ac67665041f0) → [@callback:strokes.filter · H-16974919b041](../handlers/ui__memo-ink-pad.md#h-16974919b041) → [@callback:eraseInk(strokes, p, (8 * MEMO_WIDTH) / bounds.width, page, true).map · H-7d27e497c6c5](../handlers/ui__memo-ink-pad.md#h-7d27e497c6c5) → [erase · H-da7e90d8d7b7](../handlers/ui__memo-ink-pad.md#h-da7e90d8d7b7) → [emit · H-0b45f24dd326](../handlers/ui__memo-ink-pad.md#h-0b45f24dd326) → [paint · H-e51e10de2d46](../handlers/ui__memo-ink-pad.md#h-e51e10de2d46) → [@callback:requestAnimationFrame · H-65a78f7df580](../handlers/ui__memo-ink-pad.md#h-65a78f7df580) → [@callback:points.map · H-f699ef431e57](../handlers/ui__memo-ink-pad.md#h-f699ef431e57) → [markDrawing · H-2a100eba2a54](../handlers/ui__memo-ink-pad.md#h-2a100eba2a54) → [@callback:strokes.filter · H-d64df28ce455](../handlers/ui__memo-ink-pad.md#h-d64df28ce455) → [point · H-e8a8a6da51db](../handlers/ui__memo-ink-pad.md#h-e8a8a6da51db)

```tsx
begin
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-645d94d01ce9, B-5b1d462fcea2, B-a8c916be223b, B-de28e44d4426, B-2557b779b6bf, B-fe2dedf2160e, B-742c7aa4f85e, B-d1f299aacd37, B-42967f21e371, B-0679d1b74b0b, B-adf587b43a24, B-f9e066ed8edd, B-e62525ff5873, B-976cf9b25bc3, B-302a917facad, B-9211ffef2eaf, B-6429d2102a12, B-4216460adaeb, B-5d916a8952d2

**onPointerMove** → [move · H-ac7774ece0ee](../handlers/ui__memo-ink-pad.md#h-ac7774ece0ee) → [paint · H-e51e10de2d46](../handlers/ui__memo-ink-pad.md#h-e51e10de2d46) → [@callback:requestAnimationFrame · H-65a78f7df580](../handlers/ui__memo-ink-pad.md#h-65a78f7df580) → [@callback:points.map · H-f699ef431e57](../handlers/ui__memo-ink-pad.md#h-f699ef431e57) → [@callback:events.map · H-9c229e3bd483](../handlers/ui__memo-ink-pad.md#h-9c229e3bd483) → [point · H-e8a8a6da51db](../handlers/ui__memo-ink-pad.md#h-e8a8a6da51db) → [emit · H-0b45f24dd326](../handlers/ui__memo-ink-pad.md#h-0b45f24dd326) → [erase · H-da7e90d8d7b7](../handlers/ui__memo-ink-pad.md#h-da7e90d8d7b7) → [@callback:events.map · H-d50d499b3812](../handlers/ui__memo-ink-pad.md#h-d50d499b3812) → [changeView · H-a43ba4a4e331](../handlers/ui__memo-ink-pad.md#h-a43ba4a4e331) → [schedule · H-3ff1236f0fd5](../handlers/ui__memo-ink-pad.md#h-3ff1236f0fd5) → [persist · H-bd3dda9a5f22](../handlers/ui__memo-ink-pad.md#h-bd3dda9a5f22)

```tsx
move
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-1b2f5e69fcaf, B-147ca0c2da06, B-2f086bdc1fb8, B-51cadfd07b1b, B-d340d38499a9, B-614844190f69, B-32d2b78d18d2, B-8a812314dff0, B-e6d3afa3bbed, B-8633a0c26c8b, B-bf146d336306, B-0c16fa04dcff, B-302a917facad, B-9211ffef2eaf, B-6429d2102a12, B-4216460adaeb, B-5d916a8952d2, B-976cf9b25bc3, B-4296cbc66e2e, B-1ed3220939a6, B-b6caabf05a90, B-87c626a70008, B-acdba1bfc077, B-43145cc8cf16, B-90017f31da2b, B-c7f80ab7e6cb

**onPointerUp** → [end · H-7b1fea3c4c45](../handlers/ui__memo-ink-pad.md#h-7b1fea3c4c45) → [finish · H-a05f029b5939](../handlers/ui__memo-ink-pad.md#h-a05f029b5939) → [schedule · H-3ff1236f0fd5](../handlers/ui__memo-ink-pad.md#h-3ff1236f0fd5) → [persist · H-bd3dda9a5f22](../handlers/ui__memo-ink-pad.md#h-bd3dda9a5f22) → [markDrawing · H-2a100eba2a54](../handlers/ui__memo-ink-pad.md#h-2a100eba2a54) → [commit · H-fca8288b4d46](../handlers/ui__memo-ink-pad.md#h-fca8288b4d46) → [changeView · H-a43ba4a4e331](../handlers/ui__memo-ink-pad.md#h-a43ba4a4e331) → [emit · H-0b45f24dd326](../handlers/ui__memo-ink-pad.md#h-0b45f24dd326)

```tsx
end
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7bf851229dd7, B-504ab8c7cebe, B-c0e8e4a54e07, B-613d52b53bb2, B-9c19a669f03a, B-3b7c30167c2f, B-4296cbc66e2e, B-1ed3220939a6, B-b6caabf05a90, B-87c626a70008, B-acdba1bfc077, B-43145cc8cf16, B-90017f31da2b, B-c7f80ab7e6cb, B-3b3578ff7563

**onPointerCancel** → [end · H-7b1fea3c4c45](../handlers/ui__memo-ink-pad.md#h-7b1fea3c4c45) → [finish · H-a05f029b5939](../handlers/ui__memo-ink-pad.md#h-a05f029b5939) → [schedule · H-3ff1236f0fd5](../handlers/ui__memo-ink-pad.md#h-3ff1236f0fd5) → [persist · H-bd3dda9a5f22](../handlers/ui__memo-ink-pad.md#h-bd3dda9a5f22) → [markDrawing · H-2a100eba2a54](../handlers/ui__memo-ink-pad.md#h-2a100eba2a54) → [commit · H-fca8288b4d46](../handlers/ui__memo-ink-pad.md#h-fca8288b4d46) → [changeView · H-a43ba4a4e331](../handlers/ui__memo-ink-pad.md#h-a43ba4a4e331) → [emit · H-0b45f24dd326](../handlers/ui__memo-ink-pad.md#h-0b45f24dd326)

```tsx
end
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7bf851229dd7, B-504ab8c7cebe, B-c0e8e4a54e07, B-613d52b53bb2, B-9c19a669f03a, B-3b7c30167c2f, B-4296cbc66e2e, B-1ed3220939a6, B-b6caabf05a90, B-87c626a70008, B-acdba1bfc077, B-43145cc8cf16, B-90017f31da2b, B-c7f80ab7e6cb, B-3b3578ff7563

**onLostPointerCapture** → [end · H-7b1fea3c4c45](../handlers/ui__memo-ink-pad.md#h-7b1fea3c4c45) → [finish · H-a05f029b5939](../handlers/ui__memo-ink-pad.md#h-a05f029b5939) → [schedule · H-3ff1236f0fd5](../handlers/ui__memo-ink-pad.md#h-3ff1236f0fd5) → [persist · H-bd3dda9a5f22](../handlers/ui__memo-ink-pad.md#h-bd3dda9a5f22) → [markDrawing · H-2a100eba2a54](../handlers/ui__memo-ink-pad.md#h-2a100eba2a54) → [commit · H-fca8288b4d46](../handlers/ui__memo-ink-pad.md#h-fca8288b4d46) → [changeView · H-a43ba4a4e331](../handlers/ui__memo-ink-pad.md#h-a43ba4a4e331) → [emit · H-0b45f24dd326](../handlers/ui__memo-ink-pad.md#h-0b45f24dd326)

```tsx
end
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7bf851229dd7, B-504ab8c7cebe, B-c0e8e4a54e07, B-613d52b53bb2, B-9c19a669f03a, B-3b7c30167c2f, B-4296cbc66e2e, B-1ed3220939a6, B-b6caabf05a90, B-87c626a70008, B-acdba1bfc077, B-43145cc8cf16, B-90017f31da2b, B-c7f80ab7e6cb, B-3b3578ff7563

## X-46d596ec1d5c

**이 쪽 모두 선택** · Button · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:636](../../../src/ui/memo-ink-pad.tsx#L636)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: truthy: tool === 'select'
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-5670132466bf](../handlers/ui__memo-ink-pad.md#h-5670132466bf) → [@callback:strokes.filter · H-3da86314a7c4](../handlers/ui__memo-ink-pad.md#h-3da86314a7c4) → [@callback:strokes.filter((s) => strokePage(s) === view.page).map · H-881bc3c161ce](../handlers/ui__memo-ink-pad.md#h-881bc3c161ce)

```tsx
() =>
                setSelection(strokes.filter((s) => strokePage(s) === view.page).map((s) => s.id))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-3b63514a7873

**선택 풀기** · Button · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:644](../../../src/ui/memo-ink-pad.tsx#L644)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: truthy: tool === 'select'
- 실행 차단 disabled: locked || !selection.length
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-21e6c30fdb04](../handlers/ui__memo-ink-pad.md#h-21e6c30fdb04)

```tsx
() => setSelection([])
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-aa012b15c69f

**{name}** · Button · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:653](../../../src/ui/memo-ink-pad.tsx#L653)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: truthy: tool === 'select'
- 실행 차단 disabled: locked || !selection.length
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 · 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-6f34c2113a5e](../handlers/ui__memo-ink-pad.md#h-6f34c2113a5e) → [editSelection · H-de4d612b895d](../handlers/ui__memo-ink-pad.md#h-de4d612b895d) → [commit · H-fca8288b4d46](../handlers/ui__memo-ink-pad.md#h-fca8288b4d46) → [changeView · H-a43ba4a4e331](../handlers/ui__memo-ink-pad.md#h-a43ba4a4e331) → [schedule · H-3ff1236f0fd5](../handlers/ui__memo-ink-pad.md#h-3ff1236f0fd5) → [persist · H-bd3dda9a5f22](../handlers/ui__memo-ink-pad.md#h-bd3dda9a5f22) → [emit · H-0b45f24dd326](../handlers/ui__memo-ink-pad.md#h-0b45f24dd326) → [@callback:copies.map · H-084dac0fe5b4](../handlers/ui__memo-ink-pad.md#h-084dac0fe5b4) → [@callback:copies.map · H-4b589c5274c2](../handlers/ui__memo-ink-pad.md#h-4b589c5274c2) → [@callback:before
        .filter · H-73077d7af116](../handlers/ui__memo-ink-pad.md#h-73077d7af116) → [@callback:before
        .filter((s) => ids.includes(s.id))
        .map · H-ddb03e3a4c8f](../handlers/ui__memo-ink-pad.md#h-ddb03e3a4c8f) → [@callback:s.points.map · H-07c16f61be78](../handlers/ui__memo-ink-pad.md#h-07c16f61be78) → [@callback:before.filter · H-6fd6ea29b10d](../handlers/ui__memo-ink-pad.md#h-6fd6ea29b10d)

```tsx
() => editSelection('transform', Number(dx), Number(dy))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-84bd3116c8ff, B-e043bab5825c, B-3b3578ff7563, B-4296cbc66e2e, B-1ed3220939a6, B-b6caabf05a90, B-87c626a70008, B-acdba1bfc077, B-43145cc8cf16, B-90017f31da2b, B-c7f80ab7e6cb

반복: map([ [-10, 0, '왼쪽'], [10, 0, '오른쪽'], [0, -10, '위로'], [0, 10, '아래로'], ]) · 647행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-76c187074407

**선택 줄이기** · Button · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:661](../../../src/ui/memo-ink-pad.tsx#L661)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: truthy: tool === 'select'
- 실행 차단 disabled: locked || !selection.length
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 · 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-a665eaae8fe8](../handlers/ui__memo-ink-pad.md#h-a665eaae8fe8) → [editSelection · H-de4d612b895d](../handlers/ui__memo-ink-pad.md#h-de4d612b895d) → [commit · H-fca8288b4d46](../handlers/ui__memo-ink-pad.md#h-fca8288b4d46) → [changeView · H-a43ba4a4e331](../handlers/ui__memo-ink-pad.md#h-a43ba4a4e331) → [schedule · H-3ff1236f0fd5](../handlers/ui__memo-ink-pad.md#h-3ff1236f0fd5) → [persist · H-bd3dda9a5f22](../handlers/ui__memo-ink-pad.md#h-bd3dda9a5f22) → [emit · H-0b45f24dd326](../handlers/ui__memo-ink-pad.md#h-0b45f24dd326) → [@callback:copies.map · H-084dac0fe5b4](../handlers/ui__memo-ink-pad.md#h-084dac0fe5b4) → [@callback:copies.map · H-4b589c5274c2](../handlers/ui__memo-ink-pad.md#h-4b589c5274c2) → [@callback:before
        .filter · H-73077d7af116](../handlers/ui__memo-ink-pad.md#h-73077d7af116) → [@callback:before
        .filter((s) => ids.includes(s.id))
        .map · H-ddb03e3a4c8f](../handlers/ui__memo-ink-pad.md#h-ddb03e3a4c8f) → [@callback:s.points.map · H-07c16f61be78](../handlers/ui__memo-ink-pad.md#h-07c16f61be78) → [@callback:before.filter · H-6fd6ea29b10d](../handlers/ui__memo-ink-pad.md#h-6fd6ea29b10d)

```tsx
() => editSelection('transform', 0, 0, 0.9)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-84bd3116c8ff, B-e043bab5825c, B-3b3578ff7563, B-4296cbc66e2e, B-1ed3220939a6, B-b6caabf05a90, B-87c626a70008, B-acdba1bfc077, B-43145cc8cf16, B-90017f31da2b, B-c7f80ab7e6cb

## X-22f550e122b6

**선택 늘리기** · Button · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:667](../../../src/ui/memo-ink-pad.tsx#L667)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: truthy: tool === 'select'
- 실행 차단 disabled: locked || !selection.length
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 · 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-577d53ffec5d](../handlers/ui__memo-ink-pad.md#h-577d53ffec5d) → [editSelection · H-de4d612b895d](../handlers/ui__memo-ink-pad.md#h-de4d612b895d) → [commit · H-fca8288b4d46](../handlers/ui__memo-ink-pad.md#h-fca8288b4d46) → [changeView · H-a43ba4a4e331](../handlers/ui__memo-ink-pad.md#h-a43ba4a4e331) → [schedule · H-3ff1236f0fd5](../handlers/ui__memo-ink-pad.md#h-3ff1236f0fd5) → [persist · H-bd3dda9a5f22](../handlers/ui__memo-ink-pad.md#h-bd3dda9a5f22) → [emit · H-0b45f24dd326](../handlers/ui__memo-ink-pad.md#h-0b45f24dd326) → [@callback:copies.map · H-084dac0fe5b4](../handlers/ui__memo-ink-pad.md#h-084dac0fe5b4) → [@callback:copies.map · H-4b589c5274c2](../handlers/ui__memo-ink-pad.md#h-4b589c5274c2) → [@callback:before
        .filter · H-73077d7af116](../handlers/ui__memo-ink-pad.md#h-73077d7af116) → [@callback:before
        .filter((s) => ids.includes(s.id))
        .map · H-ddb03e3a4c8f](../handlers/ui__memo-ink-pad.md#h-ddb03e3a4c8f) → [@callback:s.points.map · H-07c16f61be78](../handlers/ui__memo-ink-pad.md#h-07c16f61be78) → [@callback:before.filter · H-6fd6ea29b10d](../handlers/ui__memo-ink-pad.md#h-6fd6ea29b10d)

```tsx
() => editSelection('transform', 0, 0, 1.1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-84bd3116c8ff, B-e043bab5825c, B-3b3578ff7563, B-4296cbc66e2e, B-1ed3220939a6, B-b6caabf05a90, B-87c626a70008, B-acdba1bfc077, B-43145cc8cf16, B-90017f31da2b, B-c7f80ab7e6cb

## X-07a0071003e1

**선택 복사** · Button · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:673](../../../src/ui/memo-ink-pad.tsx#L673)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: truthy: tool === 'select'
- 실행 차단 disabled: locked || !selection.length
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 · 복원·되돌리기 · 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-5c4542080d54](../handlers/ui__memo-ink-pad.md#h-5c4542080d54) → [editSelection · H-de4d612b895d](../handlers/ui__memo-ink-pad.md#h-de4d612b895d) → [commit · H-fca8288b4d46](../handlers/ui__memo-ink-pad.md#h-fca8288b4d46) → [changeView · H-a43ba4a4e331](../handlers/ui__memo-ink-pad.md#h-a43ba4a4e331) → [schedule · H-3ff1236f0fd5](../handlers/ui__memo-ink-pad.md#h-3ff1236f0fd5) → [persist · H-bd3dda9a5f22](../handlers/ui__memo-ink-pad.md#h-bd3dda9a5f22) → [emit · H-0b45f24dd326](../handlers/ui__memo-ink-pad.md#h-0b45f24dd326) → [@callback:copies.map · H-084dac0fe5b4](../handlers/ui__memo-ink-pad.md#h-084dac0fe5b4) → [@callback:copies.map · H-4b589c5274c2](../handlers/ui__memo-ink-pad.md#h-4b589c5274c2) → [@callback:before
        .filter · H-73077d7af116](../handlers/ui__memo-ink-pad.md#h-73077d7af116) → [@callback:before
        .filter((s) => ids.includes(s.id))
        .map · H-ddb03e3a4c8f](../handlers/ui__memo-ink-pad.md#h-ddb03e3a4c8f) → [@callback:s.points.map · H-07c16f61be78](../handlers/ui__memo-ink-pad.md#h-07c16f61be78) → [@callback:before.filter · H-6fd6ea29b10d](../handlers/ui__memo-ink-pad.md#h-6fd6ea29b10d)

```tsx
() => editSelection('copy')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-84bd3116c8ff, B-e043bab5825c, B-3b3578ff7563, B-4296cbc66e2e, B-1ed3220939a6, B-b6caabf05a90, B-87c626a70008, B-acdba1bfc077, B-43145cc8cf16, B-90017f31da2b, B-c7f80ab7e6cb

## X-65213e3f103b

**선택 지우기** · Button · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:676](../../../src/ui/memo-ink-pad.tsx#L676)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: truthy: tool === 'select'
- 실행 차단 disabled: locked || !selection.length
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 · 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-6d04bd0e88bb](../handlers/ui__memo-ink-pad.md#h-6d04bd0e88bb) → [editSelection · H-de4d612b895d](../handlers/ui__memo-ink-pad.md#h-de4d612b895d) → [commit · H-fca8288b4d46](../handlers/ui__memo-ink-pad.md#h-fca8288b4d46) → [changeView · H-a43ba4a4e331](../handlers/ui__memo-ink-pad.md#h-a43ba4a4e331) → [schedule · H-3ff1236f0fd5](../handlers/ui__memo-ink-pad.md#h-3ff1236f0fd5) → [persist · H-bd3dda9a5f22](../handlers/ui__memo-ink-pad.md#h-bd3dda9a5f22) → [emit · H-0b45f24dd326](../handlers/ui__memo-ink-pad.md#h-0b45f24dd326) → [@callback:copies.map · H-084dac0fe5b4](../handlers/ui__memo-ink-pad.md#h-084dac0fe5b4) → [@callback:copies.map · H-4b589c5274c2](../handlers/ui__memo-ink-pad.md#h-4b589c5274c2) → [@callback:before
        .filter · H-73077d7af116](../handlers/ui__memo-ink-pad.md#h-73077d7af116) → [@callback:before
        .filter((s) => ids.includes(s.id))
        .map · H-ddb03e3a4c8f](../handlers/ui__memo-ink-pad.md#h-ddb03e3a4c8f) → [@callback:s.points.map · H-07c16f61be78](../handlers/ui__memo-ink-pad.md#h-07c16f61be78) → [@callback:before.filter · H-6fd6ea29b10d](../handlers/ui__memo-ink-pad.md#h-6fd6ea29b10d)

```tsx
() => editSelection('delete')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-84bd3116c8ff, B-e043bab5825c, B-3b3578ff7563, B-4296cbc66e2e, B-1ed3220939a6, B-b6caabf05a90, B-87c626a70008, B-acdba1bfc077, B-43145cc8cf16, B-90017f31da2b, B-c7f80ab7e6cb

## X-5415e3ee8eeb

**InkOCR · 조작/부품 영역** · InkOCR · component-callback-contract

- 실제 소스: [src/ui/memo-ink-pad.tsx:682](../../../src/ui/memo-ink-pad.tsx#L682)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: truthy: onRecognizedText
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onApply** → 네이티브/호출자 동작

```tsx
onRecognizedText
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e51ea746a333

**필기 설정** · summary · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:684](../../../src/ui/memo-ink-pad.tsx#L684)
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

## X-c1f41046b8d4

**손가락으로도 그리기** · Checkbox · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:685](../../../src/ui/memo-ink-pad.tsx#L685)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-f465be12d5be](../handlers/ui__memo-ink-pad.md#h-f465be12d5be) → [preference · H-cf44b655248b](../handlers/ui__memo-ink-pad.md#h-cf44b655248b) → [schedule · H-3ff1236f0fd5](../handlers/ui__memo-ink-pad.md#h-3ff1236f0fd5) → [persist · H-bd3dda9a5f22](../handlers/ui__memo-ink-pad.md#h-bd3dda9a5f22)

```tsx
(e) => preference({ finger: e.target.checked })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-4296cbc66e2e, B-1ed3220939a6, B-b6caabf05a90, B-87c626a70008, B-acdba1bfc077, B-43145cc8cf16, B-90017f31da2b, B-c7f80ab7e6cb

## X-ed4cf2a363aa

**필압에 따라 굵기 바꾸기** · Checkbox · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:691](../../../src/ui/memo-ink-pad.tsx#L691)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: locked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-42667532c101](../handlers/ui__memo-ink-pad.md#h-42667532c101) → [preference · H-cf44b655248b](../handlers/ui__memo-ink-pad.md#h-cf44b655248b) → [schedule · H-3ff1236f0fd5](../handlers/ui__memo-ink-pad.md#h-3ff1236f0fd5) → [persist · H-bd3dda9a5f22](../handlers/ui__memo-ink-pad.md#h-bd3dda9a5f22)

```tsx
(e) => preference({ pressure: e.target.checked })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-4296cbc66e2e, B-1ed3220939a6, B-b6caabf05a90, B-87c626a70008, B-acdba1bfc077, B-43145cc8cf16, B-90017f31da2b, B-c7f80ab7e6cb

## X-933af8933de6

**설정·이력 저장 다시 시도** · Button · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:704](../../../src/ui/memo-ink-pad.tsx#L704)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: truthy: error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-bef96e232911](../handlers/ui__memo-ink-pad.md#h-bef96e232911) → [persist · H-bd3dda9a5f22](../handlers/ui__memo-ink-pad.md#h-bd3dda9a5f22)

```tsx
() => {
              try {
                if (damaged.current) {
                  resetInkStorage(preferencesKey);
                  resetInkStorage(historyKey);
                  damaged.current = false;
                }
                persist();
              } catch {
                setError(
                  '필기 설정 사본을 보관하지 못했습니다. 원문은 유지했습니다. 다시 시도해 주세요.',
                );
              }
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-24817b675061, B-22bf810fbf1a, B-977e9078c238, B-1ed3220939a6, B-b6caabf05a90, B-87c626a70008, B-acdba1bfc077, B-43145cc8cf16, B-90017f31da2b, B-c7f80ab7e6cb

## X-08884a56f7f7

**현재 설정·이력으로 다시 저장** · Button · user-control

- 실제 소스: [src/ui/memo-ink-pad.tsx:722](../../../src/ui/memo-ink-pad.tsx#L722)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R11](../paths/R11.md), [R14](../paths/R14.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [R29](../paths/R29.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: truthy: error ∧ truthy: syncConflict
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d098e60ba427](../handlers/ui__memo-ink-pad.md#h-d098e60ba427) → [persist · H-bd3dda9a5f22](../handlers/ui__memo-ink-pad.md#h-bd3dda9a5f22)

```tsx
()=>{try{sync?.keepCurrentAfterReview(preferencesKey);sync?.keepCurrentAfterReview(historyKey);preferencesChanged.current=true;persist();}catch(e){setError(e instanceof Error?e.message:'다른 기기의 설정을 보관하지 못했습니다.');}}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-69305289ee2e, B-43a9dda4d78b, B-44dc061376e8, B-1ed3220939a6, B-b6caabf05a90, B-87c626a70008, B-acdba1bfc077, B-43145cc8cf16, B-90017f31da2b, B-c7f80ab7e6cb

