# src/ui/schedule-notifications.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-596b24aa1ec6

**'focus'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/schedule-notifications.tsx:9](../../../src/ui/schedule-notifications.tsx#L9)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**focus** → [tick · H-a186d3fa1755](../handlers/ui__schedule-notifications.md#h-a186d3fa1755)

```tsx
tick
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-1425bc233b26

**오늘 확인할 일정 · 알림 켜짐 설정** · summary · user-control

- 실제 소스: [src/ui/schedule-notifications.tsx:16](../../../src/ui/schedule-notifications.tsx#L16)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c1e1aa5abdb4

**이 기기 알림 끄기 일정 알림 켜기** · Button · user-control

- 실제 소스: [src/ui/schedule-notifications.tsx:16](../../../src/ui/schedule-notifications.tsx#L16)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled||busy||(!enabled&&(!supported||blocked))
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-b6a3de843655](../handlers/ui__schedule-notifications.md#h-b6a3de843655) → [toggle · H-4ef05d57bb9a](../handlers/ui__schedule-notifications.md#h-4ef05d57bb9a)

```tsx
()=>void toggle()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-bd9de8f68546, B-eabdd9c154b8, B-fd4a82fb2c9a, B-e3156d338d14, B-754304a994dd, B-06a8290e4c7f

