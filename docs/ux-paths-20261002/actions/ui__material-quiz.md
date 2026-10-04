# src/ui/material-quiz.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-de7433c2e196

**새 퀴즈 시작** · Button · user-control

- 실제 소스: [src/ui/material-quiz.tsx:60](../../../src/ui/material-quiz.tsx#L60)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || attempts.length >= 100 || Boolean(attempt && !attempt.submittedAt)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-fae6bab5f3f9](../handlers/ui__material-quiz.md#h-fae6bab5f3f9) → [start · H-5a39e74a04eb](../handlers/ui__material-quiz.md#h-5a39e74a04eb) → [select · H-98e3e268b4d7](../handlers/ui__material-quiz.md#h-98e3e268b4d7) → [@callback:previous.find · H-dc69f2f4d0d6](../handlers/ui__material-quiz.md#h-dc69f2f4d0d6)

```tsx
() => start()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-3f7716fc5b71, B-6ffe42ac1a67

## X-a00f7c8fd52f

**퀴즈 시도** · Select · user-control

- 실제 소스: [src/ui/material-quiz.tsx:67](../../../src/ui/material-quiz.tsx#L67)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md)
- 직접 표시 조건: truthy: previous.length > 1
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-e1885dbb00a5](../handlers/ui__material-quiz.md#h-e1885dbb00a5) → [select · H-98e3e268b4d7](../handlers/ui__material-quiz.md#h-98e3e268b4d7)

```tsx
(e) => select(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-92ae9e941594

**<StudyResultText text={option} as="span" />** · Radio · user-control

- 실제 소스: [src/ui/material-quiz.tsx:97](../../../src/ui/material-quiz.tsx#L97)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md)
- 직접 표시 조건: truthy: attempt ∧ interactive-when-falsy: disabled || Boolean(attempt.submittedAt)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-098f3ca080e1](../handlers/ui__material-quiz.md#h-098f3ca080e1) → [update · H-a84ecdd08371](../handlers/ui__material-quiz.md#h-a84ecdd08371) → [@callback:attempts.map · H-a8f0b404b7b7](../handlers/ui__material-quiz.md#h-a8f0b404b7b7)

```tsx
() => update({ answers: { ...attempt.answers, [q.id]: at } })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-34f974194924, B-c5b4076b643d

반복: map(occurrenceRows(q.options, value => value)) · 96행; map(attempt.questions) · 83행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-74e8e2b02aa4

**답 제출 · 해설 확인** · Button · user-control

- 실제 소스: [src/ui/material-quiz.tsx:125](../../../src/ui/material-quiz.tsx#L125)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md)
- 직접 표시 조건: truthy: attempt ∧ truthy: !attempt.submittedAt
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d4382c77ab3c](../handlers/ui__material-quiz.md#h-d4382c77ab3c) → [update · H-a84ecdd08371](../handlers/ui__material-quiz.md#h-a84ecdd08371) → [@callback:attempts.map · H-a8f0b404b7b7](../handlers/ui__material-quiz.md#h-a8f0b404b7b7)

```tsx
() => update({ submittedAt: new Date().toISOString() })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-34f974194924, B-c5b4076b643d

## X-953b9b305174

**다른 답·미응답 문항 다시 풀기** · Button · user-control

- 실제 소스: [src/ui/material-quiz.tsx:138](../../../src/ui/material-quiz.tsx#L138)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md)
- 직접 표시 조건: truthy: attempt ∧ falsy: !attempt.submittedAt
- 실행 차단 disabled: disabled ||
                  attempts.length >= 100 ||
                  !(wrong.length || answered.length < attempt.questions.length)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-a24cd10e4d24](../handlers/ui__material-quiz.md#h-a24cd10e4d24) → [start · H-5a39e74a04eb](../handlers/ui__material-quiz.md#h-5a39e74a04eb) → [select · H-98e3e268b4d7](../handlers/ui__material-quiz.md#h-98e3e268b4d7) → [@callback:previous.find · H-dc69f2f4d0d6](../handlers/ui__material-quiz.md#h-dc69f2f4d0d6) → [@callback:attempt.questions.filter · H-42ef05b3f462](../handlers/ui__material-quiz.md#h-42ef05b3f462)

```tsx
() => {
                  const retry = attempt.questions.filter(
                    (q) =>
                      attempt.answers[q.id] === undefined ||
                      attempt.answers[q.id] !== q.correctIndex,
                  );
                  start(retry);
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-3f7716fc5b71, B-6ffe42ac1a67

