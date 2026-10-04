# src/ui/week-overview.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-182c0efb80d8

**일정 확인 · {s.name}** · Button · user-control

- 실제 소스: [src/ui/week-overview.tsx:18](../../../src/ui/week-overview.tsx#L18)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U14](../paths/U14.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-89fdbc148eae](../handlers/ui__week-overview.md#h-89fdbc148eae)

```tsx
() => openLearningSchedules(s.id)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(rows) · 15행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-7e1198d73014

**전체 일정 보기** · a · user-control

- 실제 소스: [src/ui/week-overview.tsx:23](../../../src/ui/week-overview.tsx#L23)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U14](../paths/U14.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/schedules`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-56ca4a83206f

**홈 일정 찾기** · Input · user-control

- 실제 소스: [src/ui/week-overview.tsx:25](../../../src/ui/week-overview.tsx#L25)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U14](../paths/U14.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: scoped.length > 6
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-ee62c41eb3bf](../handlers/ui__week-overview.md#h-ee62c41eb3bf)

```tsx
e => { setSearch(e.target.value); setExpanded(false); setOverdueLimit(6); setUnknownLimit(6); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-01781709db7e

**접기 {`이번 주 일정 ${upcoming.length - 6}개 더 보기`}** · Button · user-control

- 실제 소스: [src/ui/week-overview.tsx:28](../../../src/ui/week-overview.tsx#L28)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U14](../paths/U14.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: upcoming.length > 6
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-56bf0d7b8ae6](../handlers/ui__week-overview.md#h-56bf0d7b8ae6) → [@callback:setExpanded · H-53830ce5e9af](../handlers/ui__week-overview.md#h-53830ce5e9af)

```tsx
() => setExpanded(v => !v)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-8dfbc18c686e

**기한이 지난 일정 {week.overdue.length} 개** · summary · user-control

- 실제 소스: [src/ui/week-overview.tsx:29](../../../src/ui/week-overview.tsx#L29)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U14](../paths/U14.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-9169f8d6701f

**기한 지난 일정 더 보기** · Button · user-control

- 실제 소스: [src/ui/week-overview.tsx:29](../../../src/ui/week-overview.tsx#L29)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U14](../paths/U14.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: overdue.length > overdueLimit
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-bb94db255321](../handlers/ui__week-overview.md#h-bb94db255321) → [@callback:setOverdueLimit · H-bac22352cc2f](../handlers/ui__week-overview.md#h-bac22352cc2f)

```tsx
() => setOverdueLimit(n => n + 20)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-50f8fc42061a

**날짜 미정 일정 {week.unknown.length} 개** · summary · user-control

- 실제 소스: [src/ui/week-overview.tsx:30](../../../src/ui/week-overview.tsx#L30)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U14](../paths/U14.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-64e7a700f9f2

**날짜 미정 일정 더 보기** · Button · user-control

- 실제 소스: [src/ui/week-overview.tsx:30](../../../src/ui/week-overview.tsx#L30)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U14](../paths/U14.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: unknown.length > unknownLimit
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-4da3cdf02caa](../handlers/ui__week-overview.md#h-4da3cdf02caa) → [@callback:setUnknownLimit · H-ef57bd1a60e3](../handlers/ui__week-overview.md#h-ef57bd1a60e3)

```tsx
() => setUnknownLimit(n => n + 20)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

