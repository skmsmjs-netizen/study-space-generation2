# src/ui/concept-interactives.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-96d9bd6062b3

**'message'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/concept-interactives.tsx:91](../../../src/ui/concept-interactives.tsx#L91)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**message** → [receive · H-1a8e31595239](../handlers/ui__concept-interactives.md#h-1a8e31595239) → [appearance · H-dba84ad42d6d](../handlers/ui__concept-interactives.md#h-dba84ad42d6d)

```tsx
receive
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-74709c382fe9, B-d1e0dd4cc7de, B-b704f71e5960, B-2f69aa96ddfb, B-4d20ccd88233, B-f082b6e1e241, B-ee2f48fb6e3c, B-9bc974ad33a4, B-8ae795aa4041, B-47f13498f9b7, B-6431a6b1dc93, B-2a93035c07fd, B-b3c928ce5cbb

## X-58138baa25b9

**'change'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/concept-interactives.tsx:99](../../../src/ui/concept-interactives.tsx#L99)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**change** → [appearance · H-dba84ad42d6d](../handlers/ui__concept-interactives.md#h-dba84ad42d6d)

```tsx
appearance
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-47f13498f9b7, B-6431a6b1dc93, B-2a93035c07fd, B-b3c928ce5cbb

## X-0710ac9571cf

**다시 열기** · Button · user-control

- 실제 소스: [src/ui/concept-interactives.tsx:112](../../../src/ui/concept-interactives.tsx#L112)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: truthy: error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-3306784e28eb](../handlers/ui__concept-interactives.md#h-3306784e28eb) → [@callback:setAttempt · H-78dde19e1ba5](../handlers/ui__concept-interactives.md#h-78dde19e1ba5)

```tsx
() => setAttempt((value) => value + 1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

