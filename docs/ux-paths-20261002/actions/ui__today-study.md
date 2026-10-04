# src/ui/today-study.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-68c6cb619b34

**예약된 복습 {choice.due.length} 개 열기** · a · user-control

- 실제 소스: [src/ui/today-study.tsx:9](../../../src/ui/today-study.tsx#L9)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U14](../paths/U14.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: !!choice.due.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/recall/scheduled`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-eae43391ee3b

**원하는 주제에서 공부하기** · a · user-control

- 실제 소스: [src/ui/today-study.tsx:9](../../../src/ui/today-study.tsx#L9)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U14](../paths/U14.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/subjects`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-d97e3afc155a

**기한이 있는 일정 {choice.schedules.length} 개** · summary · user-control

- 실제 소스: [src/ui/today-study.tsx:10](../../../src/ui/today-study.tsx#L10)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U14](../paths/U14.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: !!choice.schedules.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-85e2272b2bc1

**일정과 준비 상태 보기** · Button · user-control

- 실제 소스: [src/ui/today-study.tsx:10](../../../src/ui/today-study.tsx#L10)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U14](../paths/U14.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: !!choice.schedules.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-be1c79d80e2a](../handlers/ui__today-study.md#h-be1c79d80e2a)

```tsx
() => openLearningSchedules()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(choice.schedules.slice(0,3)) · 10행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

