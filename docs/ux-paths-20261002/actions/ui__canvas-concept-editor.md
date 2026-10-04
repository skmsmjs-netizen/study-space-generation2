# src/ui/canvas-concept-editor.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-41a6b18af7b9

**memo ? '개념 카드 편집' : '개념 카드 추가'** · form · form

- 실제 소스: [src/ui/canvas-concept-editor.tsx:83](../../../src/ui/canvas-concept-editor.tsx#L83)
- 연결 표면: [R15](../paths/R15.md), [U34](../paths/U34.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: X-41a6b18af7b9
- 소스 의미 후보: 제출 · 초안·기기 상태 · 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onCompositionStart** → [@onCompositionStart · H-26e534286f76](../handlers/ui__canvas-concept-editor.md#h-26e534286f76)

```tsx
() => setComposing(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onCompositionEnd** → [@onCompositionEnd · H-6e70178eac2d](../handlers/ui__canvas-concept-editor.md#h-6e70178eac2d)

```tsx
() => setComposing(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onSubmit** → [@onSubmit · H-87b091160a01](../handlers/ui__canvas-concept-editor.md#h-87b091160a01) → [save · H-87420fdaa44d](../handlers/ui__canvas-concept-editor.md#h-87420fdaa44d) → [change · H-385834c95715](../handlers/ui__canvas-concept-editor.md#h-385834c95715)

```tsx
(event) => {
        event.preventDefault();
        save();
      }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-cd997d03de3c, B-f879a7b1156f, B-4595b5891e1d, B-7b10219ad60e, B-d292ee9c2d9b, B-db020f4bbad8, B-82bab6cbbf88, B-d42c121340f8

## X-74929bcf4701

**개념 이름** · Input · user-control

- 실제 소스: [src/ui/canvas-concept-editor.tsx:94](../../../src/ui/canvas-concept-editor.tsx#L94)
- 연결 표면: [R15](../paths/R15.md), [U34](../paths/U34.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: Boolean(boot.error)
- readOnly: 명시 없음; required: 명시 없음; form: X-41a6b18af7b9
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-1a5898f9f920](../handlers/ui__canvas-concept-editor.md#h-1a5898f9f920) → [change · H-385834c95715](../handlers/ui__canvas-concept-editor.md#h-385834c95715)

```tsx
(event) => change({ ...draft, name: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d292ee9c2d9b, B-db020f4bbad8, B-82bab6cbbf88, B-d42c121340f8

## X-1e4b391eb4cd

**설명 덧붙이기 · 선택** · summary · user-control

- 실제 소스: [src/ui/canvas-concept-editor.tsx:102](../../../src/ui/canvas-concept-editor.tsx#L102)
- 연결 표면: [R15](../paths/R15.md), [U34](../paths/U34.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: X-41a6b18af7b9
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 상위 form의 onSubmit에 연결

- 정상 경계: 상위 form의 onSubmit에 연결
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-ca211b4138a8

**개념 설명** · Textarea · user-control

- 실제 소스: [src/ui/canvas-concept-editor.tsx:103](../../../src/ui/canvas-concept-editor.tsx#L103)
- 연결 표면: [R15](../paths/R15.md), [U34](../paths/U34.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: Boolean(boot.error)
- readOnly: 명시 없음; required: 명시 없음; form: X-41a6b18af7b9
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-32db299c6c65](../handlers/ui__canvas-concept-editor.md#h-32db299c6c65) → [change · H-385834c95715](../handlers/ui__canvas-concept-editor.md#h-385834c95715)

```tsx
(event) => change({ ...draft, description: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d292ee9c2d9b, B-db020f4bbad8, B-82bab6cbbf88, B-d42c121340f8

## X-2e4bf50571a3

**원문 사본 보관** · Button · user-control

- 실제 소스: [src/ui/canvas-concept-editor.tsx:122](../../../src/ui/canvas-concept-editor.tsx#L122)
- 연결 표면: [R15](../paths/R15.md), [U34](../paths/U34.md)
- 직접 표시 조건: truthy: error ∧ truthy: boot.error && boot.key
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: X-41a6b18af7b9
- 소스 의미 후보: 복사·내보내기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c5f5f988f3af](../handlers/ui__canvas-concept-editor.md#h-c5f5f988f3af)

```tsx
() => {
                try {
                  preserveConceptDraft(boot.key);
                  setError('원문 사본을 보관했습니다. 초안 보관본에서 확인해 주세요.');
                } catch (e) {
                  setError(e instanceof Error ? e.message : '사본을 보관하지 못했습니다.');
                }
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-fbab400a4212, B-a6f04e14d5fd, B-f8c83e9f5c2a

## X-dab83706380a

**초안 보관본** · a · user-control

- 실제 소스: [src/ui/canvas-concept-editor.tsx:135](../../../src/ui/canvas-concept-editor.tsx#L135)
- 연결 표면: [R15](../paths/R15.md), [U34](../paths/U34.md)
- 직접 표시 조건: truthy: error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: X-41a6b18af7b9
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/draft-archives`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 상위 form의 onSubmit에 연결

- 정상 경계: 상위 form의 onSubmit에 연결
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-7ec929117080

**개념 저장 카드 추가** · Button · user-control

- 실제 소스: [src/ui/canvas-concept-editor.tsx:142](../../../src/ui/canvas-concept-editor.tsx#L142)
- 연결 표면: [R15](../paths/R15.md), [U34](../paths/U34.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: !ready || Boolean(boot.error) || composing || !draft.name.trim()
- readOnly: 명시 없음; required: 명시 없음; form: X-41a6b18af7b9
- 소스 의미 후보: 제출 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-form-submit** → 상위 form의 onSubmit에 연결

- 정상 경계: 상위 form의 onSubmit에 연결
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-dc4c1a489f09

**접기** · Button · user-control

- 실제 소스: [src/ui/canvas-concept-editor.tsx:149](../../../src/ui/canvas-concept-editor.tsx#L149)
- 연결 표면: [R15](../paths/R15.md), [U34](../paths/U34.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: X-41a6b18af7b9
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → 네이티브/호출자 동작

```tsx
onClose
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

