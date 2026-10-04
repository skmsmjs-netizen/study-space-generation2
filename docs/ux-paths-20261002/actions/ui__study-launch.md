# src/ui/study-launch.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-476794146296

**공부 시작 안내** · Button · user-control

- 실제 소스: [src/ui/study-launch.tsx:51](../../../src/ui/study-launch.tsx#L51)
- 연결 표면: [R01](../paths/R01.md), [R20](../paths/R20.md), [O29](../paths/O29.md), [U15](../paths/U15.md)
- 직접 표시 조건: truthy: selected
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-4bb31b38471e](../handlers/ui__study-launch.md#h-4bb31b38471e)

```tsx
() => {
      setGuideHint({ version: 1, userId: data.userId, namespace: data.namespace, nodeId: selected.node.id,
        subjectId: selected.subject.id, scope: { ...selected.subject.scope } });
      setOpen(true);
    }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-d9e97747869c

**(ErrorState · 동적/도형 조작)** · ErrorState · component-callback-contract

- 실제 소스: [src/ui/study-launch.tsx:56](../../../src/ui/study-launch.tsx#L56)
- 연결 표면: [R01](../paths/R01.md), [R20](../paths/R20.md), [O29](../paths/O29.md), [U15](../paths/U15.md)
- 직접 표시 조건: truthy: !open && error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRetry** → [retryRead · H-851488b4b3df](../handlers/ui__study-launch.md#h-851488b4b3df)

```tsx
retryRead
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-cc6dab6bf3d7, B-59a5fcf09ff2

## X-db72e27b4cd4

**다 하셨으면 기록하세요** · Button · user-control

- 실제 소스: [src/ui/study-launch.tsx:63](../../../src/ui/study-launch.tsx#L63)
- 연결 표면: [R01](../paths/R01.md), [R20](../paths/R20.md), [O29](../paths/O29.md), [U15](../paths/U15.md)
- 직접 표시 조건: truthy: displayedHint && hint ∧ truthy: returning
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-8ca323f91bfc](../handlers/ui__study-launch.md#h-8ca323f91bfc) → [record · H-7f5a5aec4375](../handlers/ui__study-launch.md#h-7f5a5aec4375)

```tsx
() => record(returning.node.id, hint)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-19c881ddf28f

## X-7ea3e6fbbbd4

**다른 내용 고르기** · Button · user-control

- 실제 소스: [src/ui/study-launch.tsx:63](../../../src/ui/study-launch.tsx#L63)
- 연결 표면: [R01](../paths/R01.md), [R20](../paths/R20.md), [O29](../paths/O29.md), [U15](../paths/U15.md)
- 직접 표시 조건: truthy: displayedHint && hint ∧ truthy: returning
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [choose · H-0ffc09a38f6b](../handlers/ui__study-launch.md#h-0ffc09a38f6b)

```tsx
choose
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-3b57eb3be320, B-a42795938e75

## X-616e702782ea

**다른 내용 고르기** · Button · user-control

- 실제 소스: [src/ui/study-launch.tsx:67](../../../src/ui/study-launch.tsx#L67)
- 연결 표면: [R01](../paths/R01.md), [R20](../paths/R20.md), [O29](../paths/O29.md), [U15](../paths/U15.md)
- 직접 표시 조건: truthy: displayedHint && hint ∧ falsy: returning
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [choose · H-0ffc09a38f6b](../handlers/ui__study-launch.md#h-0ffc09a38f6b)

```tsx
choose
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-3b57eb3be320, B-a42795938e75

## X-f6c77b3254e2

**이 주제부터 해볼까요?** · Modal · component-callback-contract

- 실제 소스: [src/ui/study-launch.tsx:70](../../../src/ui/study-launch.tsx#L70)
- 연결 표면: [R01](../paths/R01.md), [R20](../paths/R20.md), [O29](../paths/O29.md), [U15](../paths/U15.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-614907f21371](../handlers/ui__study-launch.md#h-614907f21371)

```tsx
() => setOpen(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-843ad1ab0fba

**(ErrorState · 동적/도형 조작)** · ErrorState · component-callback-contract

- 실제 소스: [src/ui/study-launch.tsx:76](../../../src/ui/study-launch.tsx#L76)
- 연결 표면: [R01](../paths/R01.md), [R20](../paths/R20.md), [O29](../paths/O29.md), [U15](../paths/U15.md)
- 직접 표시 조건: truthy: open ∧ truthy: guide ∧ truthy: error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRetry** → [retryRead · H-851488b4b3df](../handlers/ui__study-launch.md#h-851488b4b3df)

```tsx
retryRead
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-cc6dab6bf3d7, B-59a5fcf09ff2

## X-092b17cf3fa9

**공부 시작** · Button · user-control

- 실제 소스: [src/ui/study-launch.tsx:77](../../../src/ui/study-launch.tsx#L77)
- 연결 표면: [R01](../paths/R01.md), [R20](../paths/R20.md), [O29](../paths/O29.md), [U15](../paths/U15.md)
- 직접 표시 조건: truthy: open ∧ truthy: guide
- 실행 차단 disabled: readBlocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [start · H-5f119fd8103d](../handlers/ui__study-launch.md#h-5f119fd8103d)

```tsx
start
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-907efd978727, B-5434114e2d03, B-a552f8926223

## X-78b845b34d79

**이미 공부했어요 · 기록하기** · Button · user-control

- 실제 소스: [src/ui/study-launch.tsx:77](../../../src/ui/study-launch.tsx#L77)
- 연결 표면: [R01](../paths/R01.md), [R20](../paths/R20.md), [O29](../paths/O29.md), [U15](../paths/U15.md)
- 직접 표시 조건: truthy: open ∧ truthy: guide
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-27d3a43e0632](../handlers/ui__study-launch.md#h-27d3a43e0632) → [record · H-7f5a5aec4375](../handlers/ui__study-launch.md#h-7f5a5aec4375)

```tsx
() => record(guide.node.id, guideHint!)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-19c881ddf28f

