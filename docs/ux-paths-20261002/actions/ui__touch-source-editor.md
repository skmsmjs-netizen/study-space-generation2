# src/ui/touch-source-editor.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-f829a3d7f7b1

**들여쓰기** · Button · user-control

- 실제 소스: [src/ui/touch-source-editor.tsx:210](../../../src/ui/touch-source-editor.tsx#L210)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md), [U30](../paths/U30.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: readOnly
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 포인터·공간 조작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onMouseDown** → [@onMouseDown · H-9da4d2ea1b69](../handlers/ui__touch-source-editor.md#h-9da4d2ea1b69)

```tsx
(event) => event.preventDefault()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onClick** → [@onClick · H-3b95d0fb9d10](../handlers/ui__touch-source-editor.md#h-3b95d0fb9d10) → [command · H-2cc5e4facfc0](../handlers/ui__touch-source-editor.md#h-2cc5e4facfc0)

```tsx
() => command(indentMore)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-073d7c7fa982

## X-62c50720304b

**내어쓰기** · Button · user-control

- 실제 소스: [src/ui/touch-source-editor.tsx:218](../../../src/ui/touch-source-editor.tsx#L218)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md), [U30](../paths/U30.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: readOnly
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 포인터·공간 조작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onMouseDown** → [@onMouseDown · H-605a92b8a58e](../handlers/ui__touch-source-editor.md#h-605a92b8a58e)

```tsx
(event) => event.preventDefault()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onClick** → [@onClick · H-749db0c9e933](../handlers/ui__touch-source-editor.md#h-749db0c9e933) → [command · H-2cc5e4facfc0](../handlers/ui__touch-source-editor.md#h-2cc5e4facfc0)

```tsx
() => command(indentLess)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-073d7c7fa982

## X-8566299ae0ab

**주석** · Button · user-control

- 실제 소스: [src/ui/touch-source-editor.tsx:226](../../../src/ui/touch-source-editor.tsx#L226)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md), [U30](../paths/U30.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: readOnly
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 포인터·공간 조작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onMouseDown** → [@onMouseDown · H-7f62fa1f5b21](../handlers/ui__touch-source-editor.md#h-7f62fa1f5b21)

```tsx
(event) => event.preventDefault()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onClick** → [@onClick · H-8bb1dcc4b45a](../handlers/ui__touch-source-editor.md#h-8bb1dcc4b45a) → [command · H-2cc5e4facfc0](../handlers/ui__touch-source-editor.md#h-2cc5e4facfc0)

```tsx
() => command(toggleComment)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-073d7c7fa982

## X-684e28a73995

**main 함수** · Button · user-control

- 실제 소스: [src/ui/touch-source-editor.tsx:234](../../../src/ui/touch-source-editor.tsx#L234)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md), [U30](../paths/U30.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: readOnly || !['c', 'cpp', 'csharp'].includes(language)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 포인터·공간 조작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onMouseDown** → [@onMouseDown · H-64c42f6a85d1](../handlers/ui__touch-source-editor.md#h-64c42f6a85d1)

```tsx
(event) => event.preventDefault()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onClick** → [insertMain · H-6af757bab85a](../handlers/ui__touch-source-editor.md#h-6af757bab85a) → [mainTemplate · H-184ec50b59ea](../handlers/ui__touch-source-editor.md#h-184ec50b59ea)

```tsx
insertMain
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-0b22822de2f5, B-92983ed43c80, B-b7c8bd808ecd

## X-6419e7940483

**되돌리기** · Button · user-control

- 실제 소스: [src/ui/touch-source-editor.tsx:242](../../../src/ui/touch-source-editor.tsx#L242)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md), [U30](../paths/U30.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: readOnly
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 · 포인터·공간 조작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onMouseDown** → [@onMouseDown · H-aa89edf2ba3e](../handlers/ui__touch-source-editor.md#h-aa89edf2ba3e)

```tsx
(event) => event.preventDefault()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onClick** → [@onClick · H-b38f31817f09](../handlers/ui__touch-source-editor.md#h-b38f31817f09) → [command · H-2cc5e4facfc0](../handlers/ui__touch-source-editor.md#h-2cc5e4facfc0)

```tsx
() => command(undo)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-073d7c7fa982

## X-183f25cc39d3

**다시 적용** · Button · user-control

- 실제 소스: [src/ui/touch-source-editor.tsx:250](../../../src/ui/touch-source-editor.tsx#L250)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md), [U30](../paths/U30.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: readOnly
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 포인터·공간 조작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onMouseDown** → [@onMouseDown · H-295e907885ad](../handlers/ui__touch-source-editor.md#h-295e907885ad)

```tsx
(event) => event.preventDefault()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onClick** → [@onClick · H-86cda52e1824](../handlers/ui__touch-source-editor.md#h-86cda52e1824) → [command · H-2cc5e4facfc0](../handlers/ui__touch-source-editor.md#h-2cc5e4facfc0)

```tsx
() => command(redo)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-073d7c7fa982

## X-413fed8e5164

**Tab으로 편집기 나가기** · Checkbox · user-control

- 실제 소스: [src/ui/touch-source-editor.tsx:258](../../../src/ui/touch-source-editor.tsx#L258)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md), [U30](../paths/U30.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-6e4b060d1125](../handlers/ui__touch-source-editor.md#h-6e4b060d1125)

```tsx
(event) => setTabMovesFocus(event.target.checked)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

