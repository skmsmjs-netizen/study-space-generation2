# src/ui/recall-optimization.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-7d8fa7c896f7

**복습 이력으로 최적화** · Button · user-control

- 실제 소스: [src/ui/recall-optimization.tsx:58](../../../src/ui/recall-optimization.tsx#L58)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U27](../paths/U27.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || running
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [start · H-2a0219463790](../handlers/ui__recall-optimization.md#h-2a0219463790) → [stop · H-15b61ab4cb82](../handlers/ui__recall-optimization.md#h-15b61ab4cb82) → [@callback:setTimeout · H-ba35c51ad0e2](../handlers/ui__recall-optimization.md#h-ba35c51ad0e2)

```tsx
start
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-5905ecdc7854, B-9d35f09b27b1, B-84b9aa2c88e0, B-dde73ba1c2ca, B-16d6c13bf20a, B-25ba00fa3826

## X-6bdaa2b239c4

**최적화 계산 취소** · Button · user-control

- 실제 소스: [src/ui/recall-optimization.tsx:59](../../../src/ui/recall-optimization.tsx#L59)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U27](../paths/U27.md)
- 직접 표시 조건: truthy: running
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-839da20ec2c3](../handlers/ui__recall-optimization.md#h-839da20ec2c3) → [stop · H-15b61ab4cb82](../handlers/ui__recall-optimization.md#h-15b61ab4cb82)

```tsx
() => { stop(); setRunning(false); setNotice('계산을 취소했습니다. 기존 설정은 보존했습니다.'); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-bcc1ab05b202

**최적화 결과 적용** · Button · user-control

- 실제 소스: [src/ui/recall-optimization.tsx:60](../../../src/ui/recall-optimization.tsx#L60)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U27](../paths/U27.md)
- 직접 표시 조건: truthy: result
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [apply · H-c416957e7895](../handlers/ui__recall-optimization.md#h-c416957e7895)

```tsx
apply
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-10e0c974190e, B-91a0e5235b66, B-25a6ebf71576, B-790edcb8f3d1, B-b734d19cdca4, B-69ada35bac08

## X-67b8c0057eee

**공식 FSRS 계산기** · a · user-control

- 실제 소스: [src/ui/recall-optimization.tsx:63](../../../src/ui/recall-optimization.tsx#L63)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U27](../paths/U27.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `https://github.com/open-spaced-repetition/fsrs-browser`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

