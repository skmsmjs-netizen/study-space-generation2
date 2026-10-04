# src/ui/home-tools.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-6e74645e18e1

**'visibilitychange'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/home-tools.tsx:25](../../../src/ui/home-tools.tsx#L25)
- 연결 표면: [R01](../paths/R01.md), [U13](../paths/U13.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**visibilitychange** → [refresh · H-304647f5effc](../handlers/ui__home-tools.md#h-304647f5effc)

```tsx
refresh
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7ccf01ad125a, B-9f76060646eb

## X-b6e0277f67aa

**'focus'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/home-tools.tsx:26](../../../src/ui/home-tools.tsx#L26)
- 연결 표면: [R01](../paths/R01.md), [U13](../paths/U13.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**focus** → [refresh · H-304647f5effc](../handlers/ui__home-tools.md#h-304647f5effc)

```tsx
refresh
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7ccf01ad125a, B-9f76060646eb

## X-9702fa282ab8

**'pageshow'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/home-tools.tsx:27](../../../src/ui/home-tools.tsx#L27)
- 연결 표면: [R01](../paths/R01.md), [U13](../paths/U13.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**pageshow** → [refresh · H-304647f5effc](../handlers/ui__home-tools.md#h-304647f5effc)

```tsx
refresh
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7ccf01ad125a, B-9f76060646eb

## X-14ae76d9d486

**공부 기록하기** · Button · user-control

- 실제 소스: [src/ui/home-tools.tsx:48](../../../src/ui/home-tools.tsx#L48)
- 연결 표면: [R01](../paths/R01.md), [U13](../paths/U13.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-22f1917bc744](../handlers/ui__home-tools.md#h-22f1917bc744)

```tsx
() => onNavigate('/record')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-06abfd0bce3d

**자유롭게 쓰기** · Button · user-control

- 실제 소스: [src/ui/home-tools.tsx:53](../../../src/ui/home-tools.tsx#L53)
- 연결 표면: [R01](../paths/R01.md), [U13](../paths/U13.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-9669aa3cd2cd](../handlers/ui__home-tools.md#h-9669aa3cd2cd)

```tsx
() => onNavigate('/free')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-69901fbf9162

**주제 카드로 설명하기** · Button · user-control

- 실제 소스: [src/ui/home-tools.tsx:58](../../../src/ui/home-tools.tsx#L58)
- 연결 표면: [R01](../paths/R01.md), [U13](../paths/U13.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-906cf1a34d96](../handlers/ui__home-tools.md#h-906cf1a34d96)

```tsx
() => onNavigate('/recall')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

