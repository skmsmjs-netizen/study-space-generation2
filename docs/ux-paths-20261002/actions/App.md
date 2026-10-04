# src/App.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-de8fb2d0cb3c

**내 공부 공간** · Button · user-control

- 실제 소스: [src/App.tsx:118](../../../src/App.tsx#L118)
- 연결 표면: [R40](../paths/R40.md)
- 직접 표시 조건: falsy: personal
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 저장·변경 요청 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-434f7c6225e3](../handlers/App.md#h-434f7c6225e3) → [choose · H-15a2797d15e4](../handlers/App.md#h-15a2797d15e4)

```tsx
() => choose(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-127dd12ef01f, B-d063294acb58, B-e4dc9661563a

## X-7a9e736204e8

**예시 자료를 열지 못했습니다** · ErrorState · component-callback-contract

- 실제 소스: [src/App.tsx:186](../../../src/App.tsx#L186)
- 연결 표면: [R40](../paths/R40.md)
- 직접 표시 조건: truthy: !boot.repo
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRetry** → [@onRetry · H-94fca0695a93](../handlers/App.md#h-94fca0695a93)

```tsx
() => location.reload()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-612b7cac662c

**초안 보관본 확인** · Button · user-control

- 실제 소스: [src/App.tsx:191](../../../src/App.tsx#L191)
- 연결 표면: [R40](../paths/R40.md)
- 직접 표시 조건: truthy: !boot.repo
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-5e1a27367490](../handlers/App.md#h-5e1a27367490) → [@callback:setShowBootArchives · H-685f6aa2ecc1](../handlers/App.md#h-685f6aa2ecc1)

```tsx
() => setShowBootArchives(value => !value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-7c169dea3ff5

**`${item.text} 열기`** · command object · command-definition

- 실제 소스: [src/App.tsx:536](../../../src/App.tsx#L536)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**run** → [run · H-01b03a4fe920](../handlers/App.md#h-01b03a4fe920)

```tsx
() => go(item.href)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(navItems) · 536행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-53646f6bd9fb

**'이 주제로 기록'** · command object · command-definition

- 실제 소스: [src/App.tsx:541](../../../src/App.tsx#L541)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**run** → [run · H-9ddb63d4e067](../handlers/App.md#h-9ddb63d4e067)

```tsx
() => go(`/record/${commandTopic}`)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-00743c5a97d2

**`${{ memo: '메모', math: '수식', code: '코딩 연습', record: '기록' }[tool]} 곁에 열기`** · command object · command-definition

- 실제 소스: [src/App.tsx:547](../../../src/App.tsx#L547)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**run** → [run · H-be2e44737518](../handlers/App.md#h-be2e44737518)

```tsx
() => studyWorkspace.openTool(tool)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(['memo', 'math', 'code', 'record'] as const) · 547행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-8e2fd0e00c78

**'이전 공부 화면으로 복귀'** · command object · command-definition

- 실제 소스: [src/App.tsx:553](../../../src/App.tsx#L553)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**run** → [run · H-5e129c16c4f2](../handlers/App.md#h-5e129c16c4f2)

```tsx
() => go(observatory.studySource?.route ?? observatory.caller?.route ?? '/')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-cc5b51f3dd2d

**보관함·화면 설정** · summary · user-control

- 실제 소스: [src/App.tsx:599](../../../src/App.tsx#L599)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-25e3d4976056

**MotionWidgets · 조작/부품 영역** · MotionWidgets · component-callback-contract

- 실제 소스: [src/App.tsx:600](../../../src/App.tsx#L600)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O15](../paths/O15.md), [U38](../paths/U38.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onReducedChange** → 네이티브/호출자 동작

```tsx
setReducedMotion
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-14aae4ac5471

**백업·복원** · a · user-control

- 실제 소스: [src/App.tsx:601](../../../src/App.tsx#L601)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/backup`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-75217959d884

**휴지통** · a · user-control

- 실제 소스: [src/App.tsx:602](../../../src/App.tsx#L602)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/trash`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-a0954f63e55f

**초안 보관본** · a · user-control

- 실제 소스: [src/App.tsx:603](../../../src/App.tsx#L603)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/draft-archives`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-5d40e1781f12

**내 생각 다시 보기** · a · user-control

- 실제 소스: [src/App.tsx:604](../../../src/App.tsx#L604)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/my-progress`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-00dcd984f850

**도움말** · a · user-control

- 실제 소스: [src/App.tsx:605](../../../src/App.tsx#L605)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/help`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-a8c5c249728d

**manseeksong 소개** · a · user-control

- 실제 소스: [src/App.tsx:606](../../../src/App.tsx#L606)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/about`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c982d4b22c11

**화면 밝기** · Select · user-control

- 실제 소스: [src/App.tsx:608](../../../src/App.tsx#L608)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-00b313ab8edf](../handlers/App.md#h-00b313ab8edf)

```tsx
(e) => setTheme(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c0e5e0bb5dbc

**공부 범위** · Select · user-control

- 실제 소스: [src/App.tsx:623](../../../src/App.tsx#L623)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-93c88eb777ae](../handlers/App.md#h-93c88eb777ae)

```tsx
(e) => {
              setScope(e.target.value);
              if (subject) go("/subjects");
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-13982e24741b

## X-9443d36db82a

**학기 추가** · Button · user-control

- 실제 소스: [src/App.tsx:640](../../../src/App.tsx#L640)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O01](../paths/O01.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-a836eb988662](../handlers/App.md#h-a836eb988662) → [openDialog · H-132c9e1c9845](../handlers/App.md#h-132c9e1c9845) → [@callback:saved.bulkNames.every · H-d972219d95a2](../handlers/App.md#h-d972219d95a2)

```tsx
() => openDialog("semester")
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8e33ade77ca8, B-aff4ad243989, B-0600ea5aee00, B-a65520908311, B-ad3b7aae054a, B-664c42c87373, B-2dfca89537f8, B-ef96bf5b2030, B-fae055acc419, B-f45b23d08d39, B-87d584fcbb47

## X-6924bfb9a15c

**더 보기** · summary · user-control

- 실제 소스: [src/App.tsx:644](../../../src/App.tsx#L644)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-5677736f9d79

**MotionWidgets · 조작/부품 영역** · MotionWidgets · component-callback-contract

- 실제 소스: [src/App.tsx:645](../../../src/App.tsx#L645)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O15](../paths/O15.md), [U38](../paths/U38.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onReducedChange** → 네이티브/호출자 동작

```tsx
setReducedMotion
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-b197b3e75244

**휴지통** · a · user-control

- 실제 소스: [src/App.tsx:646](../../../src/App.tsx#L646)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/trash`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e4e05a22b294

**초안 보관본** · a · user-control

- 실제 소스: [src/App.tsx:647](../../../src/App.tsx#L647)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/draft-archives`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-6548df27db20

**내 생각 다시 보기** · a · user-control

- 실제 소스: [src/App.tsx:648](../../../src/App.tsx#L648)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/my-progress`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-a52fc98dd122

**도움말** · a · user-control

- 실제 소스: [src/App.tsx:649](../../../src/App.tsx#L649)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/help`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e3e5a6286a31

**manseeksong 소개** · a · user-control

- 실제 소스: [src/App.tsx:650](../../../src/App.tsx#L650)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/about`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e5946e8ab23f

**화면 밝기** · Select · user-control

- 실제 소스: [src/App.tsx:652](../../../src/App.tsx#L652)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-c172811efe15](../handlers/App.md#h-c172811efe15)

```tsx
(e) => setTheme(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-48512ad4e818

**저장한 초안 정리 다시 시도** · Button · user-control

- 실제 소스: [src/App.tsx:693](../../../src/App.tsx#L693)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: truthy: cleanupKeys.length > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-8408ce21501c](../handlers/App.md#h-8408ce21501c) → [@callback:cleanupKeys.filter · H-7f20fbff8449](../handlers/App.md#h-7f20fbff8449)

```tsx
() => {
            const remaining = cleanupKeys.filter(key => {
              // A later edit replaces the empty committed marker; never clear that new input.
              if (readRescuedDraft(key) !== "") return false;
              try { clearStoredDraft(key); return false; } catch { return true; }
            });
            setCleanupKeys(remaining);
            if (!remaining.length) { setError(""); setNotice({ message: "저장된 내용은 유지하고 이전 초안만 정리했습니다." }); }
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-fc16a6c0ab3c, B-13e956b3315f, B-3c3ca8beae5a, B-a257436d4bdf

## X-393bd048ef22

**되돌리기** · Button · user-control

- 실제 소스: [src/App.tsx:706](../../../src/App.tsx#L706)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: truthy: notice && (!notice.undo || recordRoute) ∧ truthy: notice.undo
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-0a52d7bf47ce](../handlers/App.md#h-0a52d7bf47ce)

```tsx
() => {
                    const undo = notice.undo;
                    setNotice(null);
                    undo?.();
                  }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-48f487bb20ff

**알림 닫기** · Button · user-control

- 실제 소스: [src/App.tsx:716](../../../src/App.tsx#L716)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: truthy: notice && (!notice.undo || recordRoute)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c822ee80ecbc](../handlers/App.md#h-c822ee80ecbc)

```tsx
() => setNotice(null)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-9b362a193ef3

**목차 추가** · Button · user-control

- 실제 소스: [src/App.tsx:737](../../../src/App.tsx#L737)
- 연결 표면: [R19](../paths/R19.md), [R20](../paths/R20.md), [O03](../paths/O03.md)
- 직접 표시 조건: truthy: subject && !node
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-b88de54647ca](../handlers/App.md#h-b88de54647ca) → [openDialog · H-132c9e1c9845](../handlers/App.md#h-132c9e1c9845) → [@callback:saved.bulkNames.every · H-d972219d95a2](../handlers/App.md#h-d972219d95a2)

```tsx
() => openDialog("node")
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8e33ade77ca8, B-aff4ad243989, B-0600ea5aee00, B-a65520908311, B-ad3b7aae054a, B-664c42c87373, B-2dfca89537f8, B-ef96bf5b2030, B-fae055acc419, B-f45b23d08d39, B-87d584fcbb47

## X-a77d7450cf5d

**여러 항목 추가** · Button · user-control

- 실제 소스: [src/App.tsx:737](../../../src/App.tsx#L737)
- 연결 표면: [R19](../paths/R19.md), [R20](../paths/R20.md), [O04](../paths/O04.md)
- 직접 표시 조건: truthy: subject && !node
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c2c4f11731a8](../handlers/App.md#h-c2c4f11731a8) → [openDialog · H-132c9e1c9845](../handlers/App.md#h-132c9e1c9845) → [@callback:saved.bulkNames.every · H-d972219d95a2](../handlers/App.md#h-d972219d95a2)

```tsx
() => openDialog("bulk")
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8e33ade77ca8, B-aff4ad243989, B-0600ea5aee00, B-a65520908311, B-ad3b7aae054a, B-664c42c87373, B-2dfca89537f8, B-ef96bf5b2030, B-fae055acc419, B-f45b23d08d39, B-87d584fcbb47

## X-3ba160196bd4

**SubjectWeeks · 조작/부품 영역** · SubjectWeeks · component-callback-contract

- 실제 소스: [src/App.tsx:737](../../../src/App.tsx#L737)
- 연결 표면: [R19](../paths/R19.md), [R20](../paths/R20.md), [O25](../paths/O25.md), [U18](../paths/U18.md)
- 직접 표시 조건: truthy: subject && !node
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
setData
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e244659abb9a

**HomeTools · 조작/부품 영역** · HomeTools · component-callback-contract

- 실제 소스: [src/App.tsx:740](../../../src/App.tsx#L740)
- 연결 표면: [R01](../paths/R01.md), [U13](../paths/U13.md)
- 직접 표시 조건: truthy: route === "/"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onNavigate** → 네이티브/호출자 동작

```tsx
go
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c9e396eeb2bc

**NextStudy · 조작/부품 영역** · NextStudy · component-callback-contract

- 실제 소스: [src/App.tsx:744](../../../src/App.tsx#L744)
- 연결 표면: [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: route === "/schedules"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
setData
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-9ea5bf9d28c6

**{nodes.find(node => node.id === record.targetId)?.name ?? subjects.find(subject => subject.id === record.targetId)?.name ?? '보관된 공부 주제'}** · a · user-control

- 실제 소스: [src/App.tsx:751](../../../src/App.tsx#L751)
- 연결 표면: [R01](../paths/R01.md)
- 직접 표시 조건: truthy: route === "/" ∧ truthy: records.some(record => shownSubjects.some(subject => subject.id === record.subjectId))
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/node/${encodeURIComponent(record.targetId)}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(records.filter(record => shownSubjects.some(subject => subject.id === record.subjectId)).slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3)) · 750행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-ccf4edbf2d79

**기록 열기** · a · user-control

- 실제 소스: [src/App.tsx:754](../../../src/App.tsx#L754)
- 연결 표면: [R01](../paths/R01.md)
- 직접 표시 조건: truthy: route === "/" ∧ truthy: records.some(record => shownSubjects.some(subject => subject.id === record.subjectId))
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/node/${encodeURIComponent(record.targetId)}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(records.filter(record => shownSubjects.some(subject => subject.id === record.subjectId)).slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3)) · 750행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-43d5f1711bf6

**이 주제에 새 기록** · a · user-control

- 실제 소스: [src/App.tsx:754](../../../src/App.tsx#L754)
- 연결 표면: [R01](../paths/R01.md)
- 직접 표시 조건: truthy: route === "/" ∧ truthy: records.some(record => shownSubjects.some(subject => subject.id === record.subjectId))
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/record/${encodeURIComponent(record.targetId)}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(records.filter(record => shownSubjects.some(subject => subject.id === record.subjectId)).slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3)) · 750행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-b80ae34e541d

**QuickMemos · 조작/부품 영역** · QuickMemos · component-callback-contract

- 실제 소스: [src/App.tsx:757](../../../src/App.tsx#L757)
- 연결 표면: [R01](../paths/R01.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: truthy: route === "/"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
setData
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c147ebac35fb

**NextStudy · 조작/부품 영역** · NextStudy · component-callback-contract

- 실제 소스: [src/App.tsx:760](../../../src/App.tsx#L760)
- 연결 표면: [R01](../paths/R01.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: route === "/"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
setData
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-3cac36bae522

**전체 범위** · a · user-control

- 실제 소스: [src/App.tsx:769](../../../src/App.tsx#L769)
- 연결 표면: [R01](../paths/R01.md)
- 직접 표시 조건: truthy: route === "/"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/subjects`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-5b8a27457204

**{t.name}** · a · user-control

- 실제 소스: [src/App.tsx:781](../../../src/App.tsx#L781)
- 연결 표면: [R01](../paths/R01.md)
- 직접 표시 조건: truthy: route === "/"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/node/${t.id}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(recentTopics.length ? recentTopics : topics.slice(0, 3)) · 772행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-5b73e040f02c

**`${t.name} 최근 남긴 글 보기`** · a · user-control

- 실제 소스: [src/App.tsx:785](../../../src/App.tsx#L785)
- 연결 표면: [R01](../paths/R01.md)
- 직접 표시 조건: truthy: route === "/" ∧ truthy: latestWrittenRecords.has(t.id)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/node/${encodeURIComponent(t.id)}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(recentTopics.length ? recentTopics : topics.slice(0, 3)) · 772행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-8e66c082baed

**새 기록 공부함** · Button · user-control

- 실제 소스: [src/App.tsx:791](../../../src/App.tsx#L791)
- 연결 표면: [R01](../paths/R01.md)
- 직접 표시 조건: truthy: route === "/"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 저장·변경 요청 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-9502c3d3ee65](../handlers/App.md#h-9502c3d3ee65) → [quickRecord · H-d0729251aab3](../handlers/App.md#h-d0729251aab3) → [@callback:[...next.revisions]
      .reverse()
      .find · H-c91fa4e2a222](../handlers/App.md#h-c91fa4e2a222) → [uid · H-d0766b91b8fb](../handlers/App.md#h-d0766b91b8fb) → [commit · H-f91d9cc5d28f](../handlers/App.md#h-f91d9cc5d28f) → [message · H-511c1a5c281e](../handlers/App.md#h-511c1a5c281e)

```tsx
() =>
                            quickGuard.current.has(t.id)
                              ? go(`/record/${t.id}`)
                              : quickRecord(t)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-c6240d089e8e, B-e4c70c2a6408, B-208c7b13e055, B-3fe8d5ec3afe, B-508219baa456, B-b1228091664d, B-359d0701efa2, B-1a05d4bd7957, B-c66d1d869492, B-14d40aaaf457

반복: map(recentTopics.length ? recentTopics : topics.slice(0, 3)) · 772행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-aae9d26f34b9

**과목 추가** · Button · user-control

- 실제 소스: [src/App.tsx:851](../../../src/App.tsx#L851)
- 연결 표면: [R04](../paths/R04.md), [O02](../paths/O02.md)
- 직접 표시 조건: truthy: route === "/subjects"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-91a4fbc233f8](../handlers/App.md#h-91a4fbc233f8) → [openDialog · H-132c9e1c9845](../handlers/App.md#h-132c9e1c9845) → [@callback:saved.bulkNames.every · H-d972219d95a2](../handlers/App.md#h-d972219d95a2)

```tsx
() => openDialog("subject")
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8e33ade77ca8, B-aff4ad243989, B-0600ea5aee00, B-a65520908311, B-ad3b7aae054a, B-664c42c87373, B-2dfca89537f8, B-ef96bf5b2030, B-fae055acc419, B-f45b23d08d39, B-87d584fcbb47

## X-c151cb01785a

**OutlineTableEditor · 조작/부품 영역** · OutlineTableEditor · component-callback-contract

- 실제 소스: [src/App.tsx:854](../../../src/App.tsx#L854)
- 연결 표면: [R04](../paths/R04.md), [O19](../paths/O19.md), [U17](../paths/U17.md)
- 직접 표시 조건: truthy: route === "/subjects"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 · 복원·되돌리기 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
setData
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onApply** → [@onApply · H-2316e82bff82](../handlers/App.md#h-2316e82bff82) → [commit · H-f91d9cc5d28f](../handlers/App.md#h-f91d9cc5d28f) → [message · H-511c1a5c281e](../handlers/App.md#h-511c1a5c281e) → [uid · H-d0766b91b8fb](../handlers/App.md#h-d0766b91b8fb)

```tsx
command => {
                    const result = commit(command, undefined, { opId: command.opId, at: command.at });
                    const revision = result?.revisions.filter(item => item.operationId === command.opId).at(-1);
                    if (result) setNotice({ message: "표의 과목과 목차를 저장했습니다.", undo: revision ? () => { commit({ type: "undoRevision", revisionId: revision.id, expectedVersion: revision.after.version }, "표에서 생성한 항목을 되돌렸습니다."); } : undefined });
                    return result;
                  }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-bf03d507d52b, B-20ea33d3d076, B-508219baa456, B-b1228091664d, B-359d0701efa2, B-1a05d4bd7957, B-c66d1d869492, B-14d40aaaf457

**onUndo** → [@onUndo · H-46c4c6b46b53](../handlers/App.md#h-46c4c6b46b53) → [commit · H-f91d9cc5d28f](../handlers/App.md#h-f91d9cc5d28f) → [message · H-511c1a5c281e](../handlers/App.md#h-511c1a5c281e) → [uid · H-d0766b91b8fb](../handlers/App.md#h-d0766b91b8fb)

```tsx
(revisionId, expectedVersion) => commit({ type: "undoRevision", revisionId, expectedVersion }, "표에서 생성한 항목을 되돌렸습니다.")
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-508219baa456, B-b1228091664d, B-359d0701efa2, B-1a05d4bd7957, B-c66d1d869492, B-14d40aaaf457

## X-041d1f90070f

**{s.name}** · a · user-control

- 실제 소스: [src/App.tsx:880](../../../src/App.tsx#L880)
- 연결 표면: [R04](../paths/R04.md)
- 직접 표시 조건: truthy: route === "/subjects"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/subject/${s.id}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(shownSubjects) · 866행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-8ae72e4d1a75

**Canvas에서 함께 보기 ↗** · a · user-control

- 실제 소스: [src/App.tsx:912](../../../src/App.tsx#L912)
- 연결 표면: [R19](../paths/R19.md), [R20](../paths/R20.md)
- 직접 표시 조건: truthy: subject && !node
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/canvas`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-7a5a7a31e23f

**QuickMemos · 조작/부품 영역** · QuickMemos · component-callback-contract

- 실제 소스: [src/App.tsx:920](../../../src/App.tsx#L920)
- 연결 표면: [R19](../paths/R19.md), [R20](../paths/R20.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: truthy: subject && !node
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
setData
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-3dc78b94136c

**공부 기록하기** · Button · user-control

- 실제 소스: [src/App.tsx:928](../../../src/App.tsx#L928)
- 연결 표면: [R20](../paths/R20.md)
- 직접 표시 조건: truthy: node
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-785ff4f68a6b](../handlers/App.md#h-785ff4f68a6b)

```tsx
() => go(`/record/${node.id}`)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-58a43a448445

**"하위 항목 추가"** · command object · command-definition

- 실제 소스: [src/App.tsx:935](../../../src/App.tsx#L935)
- 연결 표면: [R20](../paths/R20.md), [O03](../paths/O03.md)
- 직접 표시 조건: truthy: node
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSelect** → [onSelect · H-e661483506e7](../handlers/App.md#h-e661483506e7) → [openDialog · H-132c9e1c9845](../handlers/App.md#h-132c9e1c9845) → [@callback:saved.bulkNames.every · H-d972219d95a2](../handlers/App.md#h-d972219d95a2)

```tsx
()=>openDialog("node")
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8e33ade77ca8, B-aff4ad243989, B-0600ea5aee00, B-a65520908311, B-ad3b7aae054a, B-664c42c87373, B-2dfca89537f8, B-ef96bf5b2030, B-fae055acc419, B-f45b23d08d39, B-87d584fcbb47

## X-af1db8625485

**"여러 하위 항목 추가"** · command object · command-definition

- 실제 소스: [src/App.tsx:936](../../../src/App.tsx#L936)
- 연결 표면: [R20](../paths/R20.md), [O04](../paths/O04.md)
- 직접 표시 조건: truthy: node
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSelect** → [onSelect · H-267a2e90a58a](../handlers/App.md#h-267a2e90a58a) → [openDialog · H-132c9e1c9845](../handlers/App.md#h-132c9e1c9845) → [@callback:saved.bulkNames.every · H-d972219d95a2](../handlers/App.md#h-d972219d95a2)

```tsx
()=>openDialog("bulk")
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8e33ade77ca8, B-aff4ad243989, B-0600ea5aee00, B-a65520908311, B-ad3b7aae054a, B-664c42c87373, B-2dfca89537f8, B-ef96bf5b2030, B-fae055acc419, B-f45b23d08d39, B-87d584fcbb47

## X-f757d2ce1031

**"이름 수정"** · command object · command-definition

- 실제 소스: [src/App.tsx:937](../../../src/App.tsx#L937)
- 연결 표면: [R20](../paths/R20.md), [O06](../paths/O06.md)
- 직접 표시 조건: truthy: node
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSelect** → [onSelect · H-3a3290942bcd](../handlers/App.md#h-3a3290942bcd) → [openDialog · H-132c9e1c9845](../handlers/App.md#h-132c9e1c9845) → [@callback:saved.bulkNames.every · H-d972219d95a2](../handlers/App.md#h-d972219d95a2)

```tsx
()=>openDialog("rename")
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8e33ade77ca8, B-aff4ad243989, B-0600ea5aee00, B-a65520908311, B-ad3b7aae054a, B-664c42c87373, B-2dfca89537f8, B-ef96bf5b2030, B-fae055acc419, B-f45b23d08d39, B-87d584fcbb47

## X-5f2f3f67b020

**"위치 옮기기"** · command object · command-definition

- 실제 소스: [src/App.tsx:938](../../../src/App.tsx#L938)
- 연결 표면: [R20](../paths/R20.md), [O07](../paths/O07.md)
- 직접 표시 조건: truthy: node
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSelect** → [onSelect · H-cfde7341970e](../handlers/App.md#h-cfde7341970e) → [openDialog · H-132c9e1c9845](../handlers/App.md#h-132c9e1c9845) → [@callback:saved.bulkNames.every · H-d972219d95a2](../handlers/App.md#h-d972219d95a2)

```tsx
()=>openDialog("move")
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8e33ade77ca8, B-aff4ad243989, B-0600ea5aee00, B-a65520908311, B-ad3b7aae054a, B-664c42c87373, B-2dfca89537f8, B-ef96bf5b2030, B-fae055acc419, B-f45b23d08d39, B-87d584fcbb47

## X-29e60edacb68

**"휴지통으로 이동"** · command object · command-definition

- 실제 소스: [src/App.tsx:939](../../../src/App.tsx#L939)
- 연결 표면: [R20](../paths/R20.md), [O05](../paths/O05.md)
- 직접 표시 조건: truthy: node
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSelect** → [onSelect · H-ff9d3ee85f2c](../handlers/App.md#h-ff9d3ee85f2c) → [openDialog · H-132c9e1c9845](../handlers/App.md#h-132c9e1c9845) → [@callback:saved.bulkNames.every · H-d972219d95a2](../handlers/App.md#h-d972219d95a2)

```tsx
()=>openDialog("trash")
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8e33ade77ca8, B-aff4ad243989, B-0600ea5aee00, B-a65520908311, B-ad3b7aae054a, B-664c42c87373, B-2dfca89537f8, B-ef96bf5b2030, B-fae055acc419, B-f45b23d08d39, B-87d584fcbb47

## X-e213439b0350

**암기시험 만들기** · Button · user-control

- 실제 소스: [src/App.tsx:944](../../../src/App.tsx#L944)
- 연결 표면: [R20](../paths/R20.md)
- 직접 표시 조건: truthy: node ∧ truthy: node.role === 'topic'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-9749951ded58](../handlers/App.md#h-9749951ded58)

```tsx
() => go(`/memory-test/${encodeURIComponent(node.id)}`)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c5b7de39cd70

**시험처럼 풀어 보기** · Button · user-control

- 실제 소스: [src/App.tsx:945](../../../src/App.tsx#L945)
- 연결 표면: [R20](../paths/R20.md)
- 직접 표시 조건: truthy: node ∧ truthy: node.role === 'topic'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-f01cf76b1970](../handlers/App.md#h-f01cf76b1970)

```tsx
() => go(`/practice/${encodeURIComponent(node.id)}`)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-78a35420cdb4

**순서 위로** · Button · user-control

- 실제 소스: [src/App.tsx:946](../../../src/App.tsx#L946)
- 연결 표면: [R20](../paths/R20.md)
- 직접 표시 조건: truthy: node
- 실행 차단 disabled: siblingIndex <= 0
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-5395926aa1ca](../handlers/App.md#h-5395926aa1ca) → [reorderNode · H-69f3f5e70db3](../handlers/App.md#h-69f3f5e70db3) → [@callback:siblings.map · H-16f08bd0c815](../handlers/App.md#h-16f08bd0c815) → [commit · H-f91d9cc5d28f](../handlers/App.md#h-f91d9cc5d28f) → [message · H-511c1a5c281e](../handlers/App.md#h-511c1a5c281e) → [uid · H-d0766b91b8fb](../handlers/App.md#h-d0766b91b8fb) → [@callback:siblings.findIndex · H-8033fcf9efcd](../handlers/App.md#h-8033fcf9efcd) → [@callback:nodes.filter · H-0aea25bd534f](../handlers/App.md#h-0aea25bd534f) → [@callback:nodes.filter(item => item.subjectId === subject.id && item.parentId === node.parentId).sort · H-9a2b215de1aa](../handlers/App.md#h-9a2b215de1aa)

```tsx
() => reorderNode(-1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-a3aac773edf2, B-f950a719c699, B-35d9ec4dde02, B-508219baa456, B-b1228091664d, B-359d0701efa2, B-1a05d4bd7957, B-c66d1d869492, B-14d40aaaf457

## X-e6c94f7d8876

**순서 아래로** · Button · user-control

- 실제 소스: [src/App.tsx:947](../../../src/App.tsx#L947)
- 연결 표면: [R20](../paths/R20.md)
- 직접 표시 조건: truthy: node
- 실행 차단 disabled: siblingIndex < 0 || siblingIndex >= siblings.length - 1
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-558dbeda6db1](../handlers/App.md#h-558dbeda6db1) → [reorderNode · H-69f3f5e70db3](../handlers/App.md#h-69f3f5e70db3) → [@callback:siblings.map · H-16f08bd0c815](../handlers/App.md#h-16f08bd0c815) → [commit · H-f91d9cc5d28f](../handlers/App.md#h-f91d9cc5d28f) → [message · H-511c1a5c281e](../handlers/App.md#h-511c1a5c281e) → [uid · H-d0766b91b8fb](../handlers/App.md#h-d0766b91b8fb) → [@callback:siblings.findIndex · H-8033fcf9efcd](../handlers/App.md#h-8033fcf9efcd) → [@callback:nodes.filter · H-0aea25bd534f](../handlers/App.md#h-0aea25bd534f) → [@callback:nodes.filter(item => item.subjectId === subject.id && item.parentId === node.parentId).sort · H-9a2b215de1aa](../handlers/App.md#h-9a2b215de1aa)

```tsx
() => reorderNode(1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-a3aac773edf2, B-f950a719c699, B-35d9ec4dde02, B-508219baa456, B-b1228091664d, B-359d0701efa2, B-1a05d4bd7957, B-c66d1d869492, B-14d40aaaf457

## X-27a03d344320

**CriteriaEditor · 조작/부품 영역** · CriteriaEditor · component-callback-contract

- 실제 소스: [src/App.tsx:950](../../../src/App.tsx#L950)
- 연결 표면: [R20](../paths/R20.md), [O11](../paths/O11.md), [U19](../paths/U19.md)
- 직접 표시 조건: truthy: node
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 · 복원·되돌리기 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onApply** → [@onApply · H-8eb9e976c3db](../handlers/App.md#h-8eb9e976c3db) → [commit · H-f91d9cc5d28f](../handlers/App.md#h-f91d9cc5d28f) → [message · H-511c1a5c281e](../handlers/App.md#h-511c1a5c281e) → [uid · H-d0766b91b8fb](../handlers/App.md#h-d0766b91b8fb)

```tsx
change => {
                  const result = commit({type: "adjustCriteria", ...change});
                  const revision = result?.revisions.find(item => item.collection === "criteria" && item.entityId === change.id);
                  if (revision) setNotice({ message: "공부 기준을 조정했습니다.", undo: () => { commit({type: "undoRevision", revisionId: revision.id, expectedVersion: revision.after.version}, "기준 변경을 되돌렸습니다."); } });
                  return result;
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-148a57adac2c, B-508219baa456, B-b1228091664d, B-359d0701efa2, B-1a05d4bd7957, B-c66d1d869492, B-14d40aaaf457

**onUndo** → [@onUndo · H-75b6780054ac](../handlers/App.md#h-75b6780054ac) → [commit · H-f91d9cc5d28f](../handlers/App.md#h-f91d9cc5d28f) → [message · H-511c1a5c281e](../handlers/App.md#h-511c1a5c281e) → [uid · H-d0766b91b8fb](../handlers/App.md#h-d0766b91b8fb)

```tsx
(revisionId, expectedVersion) => {
                  const result = commit({type: "undoRevision", revisionId, expectedVersion});
                  if (result) setNotice({ message: "기준 변경을 되돌렸습니다." });
                  return result;
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-4d4e24993286, B-508219baa456, B-b1228091664d, B-359d0701efa2, B-1a05d4bd7957, B-c66d1d869492, B-14d40aaaf457

## X-5324368cd5e6

**QuickMemos · 조작/부품 영역** · QuickMemos · component-callback-contract

- 실제 소스: [src/App.tsx:971](../../../src/App.tsx#L971)
- 연결 표면: [R20](../paths/R20.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: truthy: node
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
setData
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-f8198923939b

**RecordForm · 조작/부품 영역** · RecordForm · component-callback-contract

- 실제 소스: [src/App.tsx:1009](../../../src/App.tsx#L1009)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md)
- 직접 표시 조건: truthy: recordRoute
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → [@onSaved · H-34f648975b99](../handlers/App.md#h-34f648975b99) → [@callback:setCleanupKeys · H-72811ba40961](../handlers/App.md#h-72811ba40961)

```tsx
(warning, cleanupKey) => {
                if (cleanupKey) { setCleanupKeys(keys => [...new Set([...keys, cleanupKey])]); setError(warning || "초안 정리를 다시 시도해 주세요."); }
                setNotice({ message: warning || "공부 기록을 저장했습니다." });
                go(observatory.studySource?.route ?? observatory.caller?.route ?? "/");
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-666d0dbae3d5

## X-4d14d69ca405

**FreeNotes · 조작/부품 영역** · FreeNotes · component-callback-contract

- 실제 소스: [src/App.tsx:1022](../../../src/App.tsx#L1022)
- 연결 표면: [R30](../paths/R30.md), [R31](../paths/R31.md), [R32](../paths/R32.md)
- 직접 표시 조건: truthy: freeRoute
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onCleanupFailure** → [@onCleanupFailure · H-074f9aeef79f](../handlers/App.md#h-074f9aeef79f) → [@callback:setCleanupKeys · H-33b6c69f867b](../handlers/App.md#h-33b6c69f867b)

```tsx
key => {
            setCleanupKeys(keys => [...new Set([...keys, key])]);
            setError("자유 기록은 저장했습니다. 이전 초안 정리가 남았습니다. 창을 닫기 전에 다시 시도해 주세요.");
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-68ed7d0aa883

**ConceptLibrary · 조작/부품 영역** · ConceptLibrary · component-callback-contract

- 실제 소스: [src/App.tsx:1026](../../../src/App.tsx#L1026)
- 연결 표면: [R13](../paths/R13.md)
- 직접 표시 조건: truthy: route === "/concepts"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
setData
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-961f26ee18b7

**StudyBoard · 조작/부품 영역** · StudyBoard · component-callback-contract

- 실제 소스: [src/App.tsx:1028](../../../src/App.tsx#L1028)
- 연결 표면: [R17](../paths/R17.md), [O27](../paths/O27.md), [O28](../paths/O28.md)
- 직접 표시 조건: truthy: route === "/board"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
setData
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-caee55c438b5

**StudyCanvas · 조작/부품 영역** · StudyCanvas · component-callback-contract

- 실제 소스: [src/App.tsx:1029](../../../src/App.tsx#L1029)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: route === "/canvas"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
setData
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-737eedfa17e7

**narrative ? '메모' : '새 메모'** · NarrativeEditor · component-callback-contract

- 실제 소스: [src/App.tsx:1031](../../../src/App.tsx#L1031)
- 연결 표면: [U41](../paths/U41.md)
- 직접 표시 조건: truthy: route === "/canvas"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → [@onSaved · H-65920b0d1ae4](../handlers/App.md#h-65920b0d1ae4)

```tsx
(_id, cleanupKey) => { if (!cleanupKey) finishEditing(); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e0560b0fe371

## X-4555640b6184

**TopicRecall · 조작/부품 영역** · TopicRecall · component-callback-contract

- 실제 소스: [src/App.tsx:1033](../../../src/App.tsx#L1033)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: truthy: route === "/recall" || route === "/recall/scheduled"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
setData
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-6d80516c1d1c

**QuickMemos · 조작/부품 영역** · QuickMemos · component-callback-contract

- 실제 소스: [src/App.tsx:1034](../../../src/App.tsx#L1034)
- 연결 표면: [R06](../paths/R06.md), [R22](../paths/R22.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: truthy: memoRoute
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onCloseDetail** → [@onCloseDetail · H-4af84e67372d](../handlers/App.md#h-4af84e67372d) → [returnFromObservatory · H-0985fc875894](../handlers/ui__observatory-navigation.md#h-0985fc875894)

```tsx
() => returnFromObservatory(observatory.caller, "/memos")
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onSaved** → 네이티브/호출자 동작

```tsx
setData
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-cda538bd3940

**StudyMaterials · 조작/부품 영역** · StudyMaterials · component-callback-contract

- 실제 소스: [src/App.tsx:1042](../../../src/App.tsx#L1042)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md)
- 직접 표시 조건: truthy: materialRoute
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
setData
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-9bd1220f5110

**QuickMemos · 조작/부품 영역** · QuickMemos · component-callback-contract

- 실제 소스: [src/App.tsx:1059](../../../src/App.tsx#L1059)
- 연결 표면: [O23](../paths/O23.md), [O24](../paths/O24.md), [A01](../paths/A01.md)
- 직접 표시 조건: truthy: materialRoute ∧ slot-active: renderTool ∧ truthy: tool === 'memo'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
setData
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c626b7ed1121

**MathExplorer · 조작/부품 영역** · MathExplorer · component-callback-contract

- 실제 소스: [src/App.tsx:1067](../../../src/App.tsx#L1067)
- 연결 표면: [A01](../paths/A01.md)
- 직접 표시 조건: truthy: materialRoute ∧ slot-active: renderTool ∧ falsy: tool === 'memo' ∧ truthy: tool === 'math'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
setData
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-f47701c03a8d

**CodePractice · 조작/부품 영역** · CodePractice · component-callback-contract

- 실제 소스: [src/App.tsx:1069](../../../src/App.tsx#L1069)
- 연결 표면: [A01](../paths/A01.md)
- 직접 표시 조건: truthy: materialRoute ∧ slot-active: renderTool ∧ falsy: tool === 'memo' ∧ falsy: tool === 'math' ∧ truthy: tool === 'code'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
setData
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onOpenExample** → [@onOpenExample · H-d3c77fe8f7f2](../handlers/App.md#h-d3c77fe8f7f2)

```tsx
id => studyWorkspace.setLayout({ ...studyWorkspace.layout, codeExampleId: id })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-f868d97fd3c3

**RecordForm · 조작/부품 영역** · RecordForm · component-callback-contract

- 실제 소스: [src/App.tsx:1071](../../../src/App.tsx#L1071)
- 연결 표면: [A01](../paths/A01.md)
- 직접 표시 조건: truthy: materialRoute ∧ slot-active: renderTool ∧ falsy: tool === 'memo' ∧ falsy: tool === 'math' ∧ falsy: tool === 'code'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → [@onSaved · H-d7e1ee7ea845](../handlers/App.md#h-d7e1ee7ea845) → [@callback:setCleanupKeys · H-00716cbd6b76](../handlers/App.md#h-00716cbd6b76)

```tsx
(warning, cleanupKey) => {
                          if (cleanupKey)
                            setCleanupKeys((previous) =>
                              previous.includes(cleanupKey) ? previous : [...previous, cleanupKey],
                            );
                          setNotice({ message: warning || '공부 기록을 저장했습니다.' });
                        }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6c7e6e6b9881, B-320dd182ed4a

## X-8c85399c2257

**MathExplorer · 조작/부품 영역** · MathExplorer · component-callback-contract

- 실제 소스: [src/App.tsx:1089](../../../src/App.tsx#L1089)
- 연결 표면: [R09](../paths/R09.md)
- 직접 표시 조건: truthy: route === "/math"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
setData
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-debf14416567

**CodePractice · 조작/부품 영역** · CodePractice · component-callback-contract

- 실제 소스: [src/App.tsx:1090](../../../src/App.tsx#L1090)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: truthy: codeRoute
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
setData
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-ce0adab1cc12

**MaterialCardLibrary · 조작/부품 영역** · MaterialCardLibrary · component-callback-contract

- 실제 소스: [src/App.tsx:1091](../../../src/App.tsx#L1091)
- 연결 표면: [R12](../paths/R12.md), [U25](../paths/U25.md)
- 직접 표시 조건: truthy: route === "/material-cards"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
setData
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-2dbe55cb5fed

**MemoryTests · 조작/부품 영역** · MemoryTests · component-callback-contract

- 실제 소스: [src/App.tsx:1092](../../../src/App.tsx#L1092)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: memoryTestRoute
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
setData
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-67a7f63d8e5b

**ExamPractice · 조작/부품 영역** · ExamPractice · component-callback-contract

- 실제 소스: [src/App.tsx:1093](../../../src/App.tsx#L1093)
- 연결 표면: [R10](../paths/R10.md), [R26](../paths/R26.md)
- 직접 표시 조건: truthy: practiceRoute
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
setData
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-0a93db1ef4c9

**WorkspaceSearch · 조작/부품 영역** · WorkspaceSearch · component-callback-contract

- 실제 소스: [src/App.tsx:1094](../../../src/App.tsx#L1094)
- 연결 표면: [R18](../paths/R18.md), [A03](../paths/A03.md)
- 직접 표시 조건: truthy: route === "/search"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onQueryChange** → 네이티브/호출자 동작

```tsx
setQuery
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onAllScopes** → [@onAllScopes · H-8b5622e71f01](../handlers/App.md#h-8b5622e71f01)

```tsx
() => setScope("all")
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-89b6a11d1f0d

**복원** · Button · user-control

- 실제 소스: [src/App.tsx:1114](../../../src/App.tsx#L1114)
- 연결 표면: [R34](../paths/R34.md)
- 직접 표시 조건: truthy: route === "/trash"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 · 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-b85441c81e82](../handlers/App.md#h-b85441c81e82) → [commit · H-f91d9cc5d28f](../handlers/App.md#h-f91d9cc5d28f) → [message · H-511c1a5c281e](../handlers/App.md#h-511c1a5c281e) → [uid · H-d0766b91b8fb](../handlers/App.md#h-d0766b91b8fb)

```tsx
() =>
                        commit(
                          {
                            type: "restoreNode",
                            id: n.id,
                            expectedVersion: n.version,
                          },
                          "목차를 복원했습니다.",
                        )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-508219baa456, B-b1228091664d, B-359d0701efa2, B-1a05d4bd7957, B-c66d1d869492, B-14d40aaaf457

반복: map(data.nodes .filter( (n) => n.deletedAt && !data.nodes.find((parent) => parent.id === n.parentId) ?.deletedAt, )) · 1104행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-265d6d3a65d8

**QuickMemos · 조작/부품 영역** · QuickMemos · component-callback-contract

- 실제 소스: [src/App.tsx:1133](../../../src/App.tsx#L1133)
- 연결 표면: [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: truthy: route === "/trash"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
setData
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-013bd4425da9

**CodePractice · 조작/부품 영역** · CodePractice · component-callback-contract

- 실제 소스: [src/App.tsx:1134](../../../src/App.tsx#L1134)
- 연결 표면: [R34](../paths/R34.md)
- 직접 표시 조건: truthy: route === "/trash"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
setData
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-80644a00a3b7

**과목으로 돌아가기** · Button · user-control

- 실제 소스: [src/App.tsx:1149](../../../src/App.tsx#L1149)
- 연결 표면: [R19](../paths/R19.md), [R20](../paths/R20.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: truthy: !["/", "/subjects", "/concepts", "/search", "/trash", "/free", "/draft-archives", "/material-cards", "/recall", "/recall/scheduled", "/canvas", "/graph", "/board", "/statistics", "/math", "/backup", "/about", "/help", "/my-progress", "/subscription"].includes(route) &&
            !recordRoute &&
            !memoRoute &&
            !materialRoute &&
            !codeRoute &&
            !practiceRoute &&
            !memoryTestRoute &&
            route !== "/schedules" &&
            !freeRoute &&
            !subject
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-fe1b7409097c](../handlers/App.md#h-fe1b7409097c)

```tsx
() => go("/subjects")
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-934b578e0236

**dialog === "semester"
            ? "학기 추가"
            : dialog === "subject"
              ? "과목 추가"
              : dialog === "move"
                ? "목차 위치 옮기기"
              : dialog === "rename"
                ? "이름 수정"
                : dialog === "trash"
                  ? "휴지통으로 옮길까요?"
                  : "목차 추가"** · Modal · component-callback-contract

- 실제 소스: [src/App.tsx:1159](../../../src/App.tsx#L1159)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O01](../paths/O01.md), [O02](../paths/O02.md), [O03](../paths/O03.md), [O04](../paths/O04.md), [O05](../paths/O05.md), [O06](../paths/O06.md), [O07](../paths/O07.md)
- 직접 표시 조건: truthy: Boolean(dialog)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-0238be348c55](../handlers/App.md#h-0238be348c55)

```tsx
() => setDialog(null)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-89ddfc1a7c9e

**(ErrorState · 동적/도형 조작)** · ErrorState · component-callback-contract

- 실제 소스: [src/App.tsx:1176](../../../src/App.tsx#L1176)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O01](../paths/O01.md), [O02](../paths/O02.md), [O03](../paths/O03.md), [O04](../paths/O04.md), [O05](../paths/O05.md), [O06](../paths/O06.md), [O07](../paths/O07.md)
- 직접 표시 조건: truthy: Boolean(dialog) ∧ truthy: modalError
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRetry** → [recoverModal · H-99a50fd3a414](../handlers/App.md#h-99a50fd3a414) → [modalValue · H-ea7bb835afd0](../handlers/App.md#h-ea7bb835afd0)

```tsx
recoverModal
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-bd941dcc6924, B-c1a795191e6e, B-0e6c73b8500f, B-e5a061372749

## X-f7f733fe3a2f

**원본 사본 보관 후 입력 이어가기** · Button · user-control

- 실제 소스: [src/App.tsx:1177](../../../src/App.tsx#L1177)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O01](../paths/O01.md), [O02](../paths/O02.md), [O03](../paths/O03.md), [O04](../paths/O04.md), [O05](../paths/O05.md), [O06](../paths/O06.md), [O07](../paths/O07.md)
- 직접 표시 조건: truthy: Boolean(dialog) ∧ truthy: modalBlocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 복사·내보내기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [recoverModal · H-99a50fd3a414](../handlers/App.md#h-99a50fd3a414) → [modalValue · H-ea7bb835afd0](../handlers/App.md#h-ea7bb835afd0)

```tsx
recoverModal
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-bd941dcc6924, B-c1a795191e6e, B-0e6c73b8500f, B-e5a061372749

## X-65540e95fad4

**옮길 상위 항목** · Select · user-control

- 실제 소스: [src/App.tsx:1181](../../../src/App.tsx#L1181)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O07](../paths/O07.md)
- 직접 표시 조건: truthy: Boolean(dialog) ∧ truthy: dialog === "move" && node
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-1558c67bd2bf](../handlers/App.md#h-1558c67bd2bf) → [persistModal · H-870edca10b40](../handlers/App.md#h-870edca10b40) → [modalValue · H-ea7bb835afd0](../handlers/App.md#h-ea7bb835afd0)

```tsx
e => { setMoveParent(e.target.value); persistModal({ moveParent: e.target.value }); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-261c3521a30c, B-97dc9acf7c9a, B-0fdedf06e5ed

## X-d12fcc4b8c73

**이 위치로 옮기기** · Button · user-control

- 실제 소스: [src/App.tsx:1185](../../../src/App.tsx#L1185)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O07](../paths/O07.md)
- 직접 표시 조건: truthy: Boolean(dialog) ∧ truthy: dialog === "move" && node
- 실행 차단 disabled: modalBlocked || moveParent === (node.parentId || "")
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [moveNode · H-411a9bc242d6](../handlers/App.md#h-411a9bc242d6) → [finishModal · H-efd410044e08](../handlers/App.md#h-efd410044e08) → [@callback:setCleanupKeys · H-b5f958728b5b](../handlers/App.md#h-b5f958728b5b) → [@callback:next.revisions.slice().reverse().find · H-bdfcbc24d5c3](../handlers/App.md#h-bdfcbc24d5c3) → [commit · H-f91d9cc5d28f](../handlers/App.md#h-f91d9cc5d28f) → [message · H-511c1a5c281e](../handlers/App.md#h-511c1a5c281e) → [uid · H-d0766b91b8fb](../handlers/App.md#h-d0766b91b8fb)

```tsx
moveNode
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ab86cce0d9fc, B-a2b40629beee, B-9f8ddaf8637a, B-63a0214a9fc6, B-8b68e893ca23, B-508219baa456, B-b1228091664d, B-359d0701efa2, B-1a05d4bd7957, B-c66d1d869492, B-14d40aaaf457

## X-9436269c1ff0

**목차를 휴지통으로 이동** · Button · user-control

- 실제 소스: [src/App.tsx:1194](../../../src/App.tsx#L1194)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O05](../paths/O05.md)
- 직접 표시 조건: truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ truthy: dialog === "trash" && node
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 저장·변경 요청 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [deleteNode · H-dc2d69957ec8](../handlers/App.md#h-dc2d69957ec8) → [@callback:next.nodes.find · H-82b1e909ad31](../handlers/App.md#h-82b1e909ad31) → [commit · H-f91d9cc5d28f](../handlers/App.md#h-f91d9cc5d28f) → [message · H-511c1a5c281e](../handlers/App.md#h-511c1a5c281e) → [uid · H-d0766b91b8fb](../handlers/App.md#h-d0766b91b8fb)

```tsx
deleteNode
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f3be5b4510b5, B-b3670bdf0c2b, B-508219baa456, B-b1228091664d, B-359d0701efa2, B-1a05d4bd7957, B-c66d1d869492, B-14d40aaaf457

## X-6019bddb3000

**form · 제출 경로** · form · form

- 실제 소스: [src/App.tsx:1199](../../../src/App.tsx#L1199)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O01](../paths/O01.md), [O02](../paths/O02.md), [O03](../paths/O03.md), [O04](../paths/O04.md), [O05](../paths/O05.md), [O06](../paths/O06.md), [O07](../paths/O07.md)
- 직접 표시 조건: truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: X-6019bddb3000
- 소스 의미 후보: 이동 · 제출 · 저장·변경 요청 · 초안·기기 상태 · 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onKeyDown** → [@onKeyDown · H-4fb892861f8c](../handlers/App.md#h-4fb892861f8c)

```tsx
event => {
              if (event.key === "Enter" && (event.nativeEvent.isComposing || event.keyCode === 229)) event.preventDefault();
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-af88f2e0500c

**onSubmit** → [@onSubmit · H-651c9d73cb23](../handlers/App.md#h-651c9d73cb23) → [addItem · H-a447162cf962](../handlers/App.md#h-a447162cf962) → [finishModal · H-efd410044e08](../handlers/App.md#h-efd410044e08) → [@callback:setCleanupKeys · H-b5f958728b5b](../handlers/App.md#h-b5f958728b5b) → [commit · H-f91d9cc5d28f](../handlers/App.md#h-f91d9cc5d28f) → [message · H-511c1a5c281e](../handlers/App.md#h-511c1a5c281e) → [uid · H-d0766b91b8fb](../handlers/App.md#h-d0766b91b8fb) → [@callback:bulkEntries.map · H-d56cf50e8689](../handlers/App.md#h-d56cf50e8689)

```tsx
(e) => {
              e.preventDefault();
              addItem();
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-269de8ee232f, B-aeb0dca2be64, B-640b5d57485c, B-c0b813652ac8, B-2a9cfd6fe65a, B-32460584cfb3, B-99002e80f8e8, B-455ab71934fe, B-a441e6648839, B-2c495bc9321e, B-d80785a49c8a, B-79f1950adb89, B-4d9d2e9525bd, B-807752e2a174, B-03c59b18cf53, B-91b0ee077c43, B-63a0214a9fc6, B-8b68e893ca23, B-508219baa456, B-b1228091664d, B-359d0701efa2, B-1a05d4bd7957, B-c66d1d869492, B-14d40aaaf457

## X-2e4eabb2d31b

**`항목 ${index + 1} 이름`** · Input · user-control

- 실제 소스: [src/App.tsx:1212](../../../src/App.tsx#L1212)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O04](../paths/O04.md)
- 직접 표시 조건: truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: X-6019bddb3000
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 · 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onKeyDown** → [@onKeyDown · H-2ffd0ecd09c4](../handlers/App.md#h-2ffd0ecd09c4) → [@callback:requestAnimationFrame · H-aa6069a85087](../handlers/App.md#h-aa6069a85087) → [@callback:document.querySelectorAll<HTMLInputElement>('[data-editing-context]').forEach · H-2b31824d485b](../handlers/App.md#h-2b31824d485b) → [persistModal · H-870edca10b40](../handlers/App.md#h-870edca10b40) → [modalValue · H-ea7bb835afd0](../handlers/App.md#h-ea7bb835afd0)

```tsx
event => {
                    if (event.key !== "Enter" || event.nativeEvent.isComposing || event.keyCode === 229) return;
                    event.preventDefault();
                    if (index === bulkNames.length - 1 && bulkNames.length < 500) {
                      const next = [...bulkNames, ""]; setBulkNames(next); setBulkPreview(false); persistModal({ bulkNames: next });
                    }
                    requestAnimationFrame(() => document.querySelectorAll<HTMLInputElement>('[data-editing-context]').forEach(input => {
                      if (input.dataset.editingContext === `${modalKey}:row:${index + 1}`) input.focus();
                    }));
                  }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-59b77ba9992e, B-fe857efee999, B-d091c3adcefe, B-261c3521a30c, B-97dc9acf7c9a, B-0fdedf06e5ed

**onChange** → [@onChange · H-a04ab42e0e68](../handlers/App.md#h-a04ab42e0e68) → [persistModal · H-870edca10b40](../handlers/App.md#h-870edca10b40) → [modalValue · H-ea7bb835afd0](../handlers/App.md#h-ea7bb835afd0) → [@callback:bulkNames.map · H-11eb39a38f79](../handlers/App.md#h-11eb39a38f79)

```tsx
event => {
                    const next = bulkNames.map((name, row) => row === index ? event.target.value : name);
                    setBulkNames(next); setBulkPreview(false); persistModal({ bulkNames: next });
                  }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-261c3521a30c, B-97dc9acf7c9a, B-0fdedf06e5ed, B-eda3dfd11fde

반복: map(bulkNames) · 1212행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-92f2f1a3ee93

**입력 행 추가** · Button · user-control

- 실제 소스: [src/App.tsx:1227](../../../src/App.tsx#L1227)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O04](../paths/O04.md)
- 직접 표시 조건: truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk"
- 실행 차단 disabled: bulkNames.length >= 500
- readOnly: 명시 없음; required: 명시 없음; form: X-6019bddb3000
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-5c25cda61b72](../handlers/App.md#h-5c25cda61b72) → [persistModal · H-870edca10b40](../handlers/App.md#h-870edca10b40) → [modalValue · H-ea7bb835afd0](../handlers/App.md#h-ea7bb835afd0)

```tsx
() => { const next = [...bulkNames, ""]; setBulkNames(next); setBulkPreview(false); persistModal({ bulkNames: next }); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-261c3521a30c, B-97dc9acf7c9a, B-0fdedf06e5ed

## X-f23c0faa4a1a

**이름** · Input · user-control

- 실제 소스: [src/App.tsx:1228](../../../src/App.tsx#L1228)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O01](../paths/O01.md), [O02](../paths/O02.md), [O03](../paths/O03.md), [O05](../paths/O05.md), [O06](../paths/O06.md), [O07](../paths/O07.md)
- 직접 표시 조건: truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ falsy: dialog === "bulk"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: true; form: X-6019bddb3000
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-751900e010a8](../handlers/App.md#h-751900e010a8) → [persistModal · H-870edca10b40](../handlers/App.md#h-870edca10b40) → [modalValue · H-ea7bb835afd0](../handlers/App.md#h-ea7bb835afd0)

```tsx
(e) => { setName(e.target.value); persistModal({ name: e.target.value }); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-261c3521a30c, B-97dc9acf7c9a, B-0fdedf06e5ed

## X-cf2dcaad39aa

**항목 종류** · Select · user-control

- 실제 소스: [src/App.tsx:1236](../../../src/App.tsx#L1236)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O03](../paths/O03.md), [O04](../paths/O04.md)
- 직접 표시 조건: truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "node" || dialog === "bulk"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: X-6019bddb3000
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-4b22624fa9ce](../handlers/App.md#h-4b22624fa9ce) → [persistModal · H-870edca10b40](../handlers/App.md#h-870edca10b40) → [modalValue · H-ea7bb835afd0](../handlers/App.md#h-ea7bb835afd0)

```tsx
(e) => {
                    setRole(e.target.value as OutlineNode["role"]); setBulkPreview(false); persistModal({ role: e.target.value });
                  }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-261c3521a30c, B-97dc9acf7c9a, B-0fdedf06e5ed

## X-4d6f1c609cbc

**추가할 항목 미리보기** · Button · user-control

- 실제 소스: [src/App.tsx:1255](../../../src/App.tsx#L1255)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O04](../paths/O04.md)
- 직접 표시 조건: truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk"
- 실행 차단 disabled: !bulkNames.some(value => value.trim())
- readOnly: 명시 없음; required: 명시 없음; form: X-6019bddb3000
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-9b9110600d43](../handlers/App.md#h-9b9110600d43)

```tsx
() => { if (subject) setOutlineToken(outlineRevisionToken(data, subject.id, node?.id || null)); setBulkPreview(true); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-fa4de2b50f8c

## X-794212d2e298

**같은 이름의 기존 항목 처리** · Select · user-control

- 실제 소스: [src/App.tsx:1259](../../../src/App.tsx#L1259)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O04](../paths/O04.md)
- 직접 표시 조건: truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node ∧ truthy: dialog === "bulk" ∧ truthy: bulkPreview ∧ truthy: bulkExisting.length > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: X-6019bddb3000
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-c7bd1cc6a939](../handlers/App.md#h-c7bd1cc6a939)

```tsx
event => setDuplicateChoice(event.target.value as typeof duplicateChoice)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-ad5c4be2bbfa

**이름 저장 추가하기** · Button · user-control

- 실제 소스: [src/App.tsx:1267](../../../src/App.tsx#L1267)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O01](../paths/O01.md), [O02](../paths/O02.md), [O03](../paths/O03.md), [O04](../paths/O04.md), [O05](../paths/O05.md), [O06](../paths/O06.md), [O07](../paths/O07.md)
- 직접 표시 조건: truthy: Boolean(dialog) ∧ falsy: dialog === "move" && node ∧ falsy: dialog === "trash" && node
- 실행 차단 disabled: modalBlocked || (dialog === "bulk" && (!bulkPreview || !previewOutlineEntries(bulkNames).entries.length || previewOutlineEntries(bulkNames).issues.length > 0 || (bulkExisting.length > 0 && !duplicateChoice)))
- readOnly: 명시 없음; required: 명시 없음; form: X-6019bddb3000
- 소스 의미 후보: 제출 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-form-submit** → 상위 form의 onSubmit에 연결

- 정상 경계: 상위 form의 onSubmit에 연결
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-1a90363b1d64

**Toast · 조작/부품 영역** · Toast · component-callback-contract

- 실제 소스: [src/App.tsx:1276](../../../src/App.tsx#L1276)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md)
- 직접 표시 조건: truthy: notice?.undo && !recordRoute
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onUndo** → 네이티브/호출자 동작

```tsx
notice.undo
              ? () => {
                  const undo = notice.undo;
                  setNotice(null);
                  undo?.();
                }
              : undefined
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onClose** → [@onClose · H-98e1466090ed](../handlers/App.md#h-98e1466090ed)

```tsx
() => setNotice(null)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-0e6654996ed7

**details · 조작/부품 영역** · details · event-surface

- 실제 소스: [src/App.tsx:1479](../../../src/App.tsx#L1479)
- 연결 표면: [R19](../paths/R19.md), [R20](../paths/R20.md), [R30](../paths/R30.md), [R31](../paths/R31.md), [R32](../paths/R32.md), [U41](../paths/U41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onToggle** → [@onToggle · H-8bb0f97a3c44](../handlers/App.md#h-8bb0f97a3c44)

```tsx
(event) => {
      const open = event.currentTarget.open;
      setExpanded(open);
      try { sessionStorage.setItem(disclosureKey, open ? "open" : "closed"); }
      catch { /* Keep the current interaction usable if view-hint storage is denied. */ }
    }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-2aa9afa01dcc, B-33b6712b24df, B-ab50745377ba

## X-6f84add2c441

**{label} · 작성한 내용 있음 · 선택** · summary · user-control

- 실제 소스: [src/App.tsx:1485](../../../src/App.tsx#L1485)
- 연결 표면: [R19](../paths/R19.md), [R20](../paths/R20.md), [R30](../paths/R30.md), [R31](../paths/R31.md), [R32](../paths/R32.md), [U41](../paths/U41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-924938e7ad38

**label** · Textarea · user-control

- 실제 소스: [src/App.tsx:1490](../../../src/App.tsx#L1490)
- 연결 표면: [R19](../paths/R19.md), [R20](../paths/R20.md), [R30](../paths/R30.md), [R31](../paths/R31.md), [R32](../paths/R32.md), [U41](../paths/U41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: saving; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-b8eb18005c2a](../handlers/App.md#h-b8eb18005c2a)

```tsx
(e) => {
            draft.change(e.target.value);
            setSaved(false);
            setSaveError('');
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-6df13d2bb084

**저장된 자유 기록 열기** · a · user-control

- 실제 소스: [src/App.tsx:1512](../../../src/App.tsx#L1512)
- 연결 표면: [R19](../paths/R19.md), [R20](../paths/R20.md), [R30](../paths/R30.md), [R31](../paths/R31.md), [R32](../paths/R32.md), [U41](../paths/U41.md)
- 직접 표시 조건: truthy: alreadyCreated && alreadyCreated.body !== draft.body && draft.expected.current !== alreadyCreated.version
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/free/${stableId}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-eab2f2d0ba24

**원본 사본 보관 후 입력 이어가기 {draft.cleanupPending ? "저장한 초안 정리 다시 시도" : "초안 다시 보관"}** · Button · user-control

- 실제 소스: [src/App.tsx:1514](../../../src/App.tsx#L1514)
- 연결 표면: [R19](../paths/R19.md), [R20](../paths/R20.md), [R30](../paths/R30.md), [R31](../paths/R31.md), [R32](../paths/R32.md), [U41](../paths/U41.md)
- 직접 표시 조건: truthy: draft.error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → 네이티브/호출자 동작

```tsx
draft.retry
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-fef0bfd823f8

**저장 중… {saveError ? '저장 다시 시도' : '내용 저장'}** · Button · user-control

- 실제 소스: [src/App.tsx:1515](../../../src/App.tsx#L1515)
- 연결 표면: [R19](../paths/R19.md), [R20](../paths/R20.md), [R30](../paths/R30.md), [R31](../paths/R31.md), [R32](../paths/R32.md), [U41](../paths/U41.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: draft.blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c41938c93af9](../handlers/App.md#h-c41938c93af9) → [save · H-46e5b3688da2](../handlers/App.md#h-46e5b3688da2) → [message · H-511c1a5c281e](../handlers/App.md#h-511c1a5c281e) → [@callback:result.narratives.find · H-74385c4eb58a](../handlers/App.md#h-74385c4eb58a) → [@callback:result.narratives.find · H-1ed36b892a35](../handlers/App.md#h-1ed36b892a35)

```tsx
() => { void save(); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-351d8744e24c, B-158be0cfd0ac, B-8cf1e5c93201, B-866eda565e69, B-e61171b05098, B-d6441e85ba69, B-c739b40d455d, B-f37d35a7c170, B-bd5ed6626941, B-dc1924f446a9, B-aeff5d52a320, B-ff2ab6e31b5d, B-600236728c4b, B-d537fbbc3fd2, B-03f4e8e44df8, B-2c2889339d1b, B-2b689e6e13a3, B-28539efc1dd1, B-c66d1d869492, B-14d40aaaf457

## X-7cf10d558f1c

**새 자유 기록** · Button · user-control

- 실제 소스: [src/App.tsx:1540](../../../src/App.tsx#L1540)
- 연결 표면: [R30](../paths/R30.md), [R31](../paths/R31.md), [R32](../paths/R32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-0d7038513299](../handlers/App.md#h-0d7038513299)

```tsx
() => go("/free/new")
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-5777e55890ac

**자유 기록 목록** · a · user-control

- 실제 소스: [src/App.tsx:1541](../../../src/App.tsx#L1541)
- 연결 표면: [R31](../paths/R31.md), [R32](../paths/R32.md)
- 직접 표시 조건: truthy: route !== "/free"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/free`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-2100e916d7e3

**자유 기록** · NarrativeEditor · component-callback-contract

- 실제 소스: [src/App.tsx:1545](../../../src/App.tsx#L1545)
- 연결 표면: [R30](../paths/R30.md), [R31](../paths/R31.md), [R32](../paths/R32.md), [U41](../paths/U41.md)
- 직접 표시 조건: falsy: route !== "/free" && id !== legacy.id && !creating && !selected
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
creating ? (savedId, cleanupKey) => { if (cleanupKey) onCleanupFailure(cleanupKey); go(`/free/${savedId}`); } : undefined
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-039fe1436045

**{note.body.trim().split("\n")[0].slice(0, 80) || "내용 없이 남긴 자유 기록"}** · a · user-control

- 실제 소스: [src/App.tsx:1553](../../../src/App.tsx#L1553)
- 연결 표면: [R30](../paths/R30.md), [R31](../paths/R31.md), [R32](../paths/R32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/free/${note.id}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(notes.slice().reverse()) · 1552행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-79c7086ba9c2

**주제 찾기** · Search · component-callback-contract

- 실제 소스: [src/App.tsx:1667](../../../src/App.tsx#L1667)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onQueryChange** → 네이티브/호출자 동작

```tsx
setFilter
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-1ae47599814a

**node.name** · Checkbox · user-control

- 실제 소스: [src/App.tsx:1674](../../../src/App.tsx#L1674)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-c86618d01c4a](../handlers/App.md#h-c86618d01c4a) → [select · H-cec0d74e93a8](../handlers/App.md#h-cec0d74e93a8) → [@callback:form.selectedIds.filter · H-58bac01c2a09](../handlers/App.md#h-58bac01c2a09) → [change · H-d01824652e3f](../handlers/App.md#h-d01824652e3f)

```tsx
event => select(node.id, event.target.checked)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-0dee9573d055, B-0591e4cff2df, B-7c172d8c7cf3, B-b1c0a542e2e4, B-44bca45494ae

반복: map(matching.filter(node => node.parentId === parentId)) · 1674행; map(groups) · 1672행; map(pickerSubjects) · 1668행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-eb7561773b66

**선택한 주제 모두 공부함** · Button · user-control

- 실제 소스: [src/App.tsx:1686](../../../src/App.tsx#L1686)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md)
- 직접 표시 조건: truthy: form.selectedIds.length > 1
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-f609a6b175b0](../handlers/App.md#h-f609a6b175b0) → [@callback:form.selectedIds.map · H-87159e8356f7](../handlers/App.md#h-87159e8356f7) → [change · H-d01824652e3f](../handlers/App.md#h-d01824652e3f)

```tsx
() =>
              change({
                ...form,
                done: {
                  ...form.done,
                  ...Object.fromEntries(
                    form.selectedIds.map((id) => [id, true]),
                  ),
                },
              })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7c172d8c7cf3, B-b1c0a542e2e4, B-44bca45494ae

## X-bb04c8d4584b

**공부함** · Checkbox · user-control

- 실제 소스: [src/App.tsx:1707](../../../src/App.tsx#L1707)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-517269f03f01](../handlers/App.md#h-517269f03f01) → [change · H-d01824652e3f](../handlers/App.md#h-d01824652e3f)

```tsx
(e) =>
                change({
                  ...form,
                  done: { ...form.done, [id]: e.target.checked },
                })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7c172d8c7cf3, B-b1c0a542e2e4, B-44bca45494ae

반복: map(form.selectedIds) · 1702행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-8ad45031773e

**메모** · Textarea · user-control

- 실제 소스: [src/App.tsx:1718](../../../src/App.tsx#L1718)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-a2838de4371b](../handlers/App.md#h-a2838de4371b) → [change · H-d01824652e3f](../handlers/App.md#h-d01824652e3f)

```tsx
(e) =>
                change({
                  ...form,
                  bodies: { ...form.bodies, [id]: e.target.value },
                })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7c172d8c7cf3, B-b1c0a542e2e4, B-44bca45494ae

반복: map(form.selectedIds) · 1702행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-db522a65387b

**TraceEditor · 조작/부품 영역** · TraceEditor · component-callback-contract

- 실제 소스: [src/App.tsx:1731](../../../src/App.tsx#L1731)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md), [U19](../paths/U19.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-8d27074f6b21](../handlers/App.md#h-8d27074f6b21) → [change · H-d01824652e3f](../handlers/App.md#h-d01824652e3f)

```tsx
(trace) =>
                change({ ...form, trace: { ...form.trace, [id]: trace } })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7c172d8c7cf3, B-b1c0a542e2e4, B-44bca45494ae

반복: map(form.selectedIds) · 1702행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-d9bcc9697569

**공부한 때 · {form.dateEvidence.date} {form.dateEvidence.kind === "range" ? "기간" : "정확히 모름"}** · summary · user-control

- 실제 소스: [src/App.tsx:1748](../../../src/App.tsx#L1748)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-478ddcf0ad59

**날짜 정밀도** · Select · user-control

- 실제 소스: [src/App.tsx:1756](../../../src/App.tsx#L1756)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-c7e304988962](../handlers/App.md#h-c7e304988962) → [change · H-d01824652e3f](../handlers/App.md#h-d01824652e3f)

```tsx
(e) =>
              change({
                ...form,
                dateEvidence:
                  e.target.value === "unknown"
                    ? { kind: "unknown" }
                    : e.target.value === "range"
                      ? { kind: "range", from: localDay(), to: localDay() }
                      : { kind: "exact", date: localDay() },
              })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-bc124e8cbfb6, B-78cde8f544e5, B-7c172d8c7cf3, B-b1c0a542e2e4, B-44bca45494ae

## X-7c84af7977ec

**공부한 날짜** · Input · user-control

- 실제 소스: [src/App.tsx:1776](../../../src/App.tsx#L1776)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md)
- 직접 표시 조건: truthy: form.dateEvidence.kind === "exact"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-7b19b53f329e](../handlers/App.md#h-7b19b53f329e) → [change · H-d01824652e3f](../handlers/App.md#h-d01824652e3f)

```tsx
(e) =>
                change({
                  ...form,
                  dateEvidence: { kind: "exact", date: e.target.value },
                })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7c172d8c7cf3, B-b1c0a542e2e4, B-44bca45494ae

## X-92ebe95cf3b3

**기간 시작** · Input · user-control

- 실제 소스: [src/App.tsx:1790](../../../src/App.tsx#L1790)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md)
- 직접 표시 조건: truthy: form.dateEvidence.kind === "range"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-452e03b1773c](../handlers/App.md#h-452e03b1773c) → [change · H-d01824652e3f](../handlers/App.md#h-d01824652e3f)

```tsx
(e) => {
                  if (form.dateEvidence.kind === "range")
                    change({
                      ...form,
                      dateEvidence: {
                        ...form.dateEvidence,
                        from: e.target.value,
                      },
                    });
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-bd19da9db016, B-7c172d8c7cf3, B-b1c0a542e2e4, B-44bca45494ae

## X-2c7b7e08a373

**기간 끝** · Input · user-control

- 실제 소스: [src/App.tsx:1805](../../../src/App.tsx#L1805)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md)
- 직접 표시 조건: truthy: form.dateEvidence.kind === "range"
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-d8f2f362057e](../handlers/App.md#h-d8f2f362057e) → [change · H-d01824652e3f](../handlers/App.md#h-d01824652e3f)

```tsx
(e) => {
                  if (form.dateEvidence.kind === "range")
                    change({
                      ...form,
                      dateEvidence: {
                        ...form.dateEvidence,
                        to: e.target.value,
                      },
                    });
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-9ef8e1d02ebc, B-7c172d8c7cf3, B-b1c0a542e2e4, B-44bca45494ae

## X-63ecf3622bb1

**원본 사본 보관 후 입력 이어가기 초안 다시 보관** · Button · user-control

- 실제 소스: [src/App.tsx:1823](../../../src/App.tsx#L1823)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md)
- 직접 표시 조건: truthy: draftError
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-56a0046fd907](../handlers/App.md#h-56a0046fd907)

```tsx
() => {
          const storageKey = `${storagePrefix(data)}:draft:${key}`;
          try {
            if (draftBlocked) archiveDamagedDraft(storageKey);
            validateFormDraft(currentForm.current, key);
            storeDraftSafely(storageKey, JSON.stringify(currentForm.current));
            setDraftBlocked(false); setDraftError("");
          } catch (reason) { setDraftError(reason instanceof DraftArchiveError ? reason.message : "초안을 보관하지 못했습니다. 원본과 현재 창의 입력은 유지했습니다. 저장 공간을 확인한 뒤 다시 시도해 주세요."); }
        }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-19d84d4baf41, B-d7581844fbce, B-f5eaef2c0444, B-298e2fa8a174

## X-96d02066570d

**{`${form.selectedIds.length}개 주제 기록 저장`} 주제를 선택해 주세요** · Button · user-control

- 실제 소스: [src/App.tsx:1838](../../../src/App.tsx#L1838)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: !form.selectedIds.length || draftBlocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [submit · H-1d308e7a8e15](../handlers/App.md#h-1d308e7a8e15) → [@callback:form.selectedIds.map · H-c7d9f4d68c52](../handlers/App.md#h-c7d9f4d68c52)

```tsx
submit
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-b350516f8b85, B-7fe5be2490df, B-b853edb739d1, B-a155b694c903, B-e2bc1b15c6f8

## X-4d694fb41cc5

**기록 수정** · Textarea · user-control

- 실제 소스: [src/App.tsx:1890](../../../src/App.tsx#L1890)
- 연결 표면: [R20](../paths/R20.md)
- 직접 표시 조건: truthy: editing
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-7ed5223e3eb1](../handlers/App.md#h-7ed5223e3eb1)

```tsx
(e) => body.change(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-706718edb9df

**수정 저장** · Button · user-control

- 실제 소스: [src/App.tsx:1896](../../../src/App.tsx#L1896)
- 연결 표면: [R20](../paths/R20.md)
- 직접 표시 조건: truthy: editing
- 실행 차단 disabled: body.blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-f87321b226fc](../handlers/App.md#h-f87321b226fc) → [@callback:result.records.find · H-7cdbc6f36f6f](../handlers/App.md#h-7cdbc6f36f6f)

```tsx
() => {
              const result = commit(
                {
                  type: "updateRecord",
                  id: record.id,
                  expectedVersion: body.expected.current,
                  patch: { body: body.body },
                },
                "기록을 수정했습니다.",
              );
              if (result) {
                const updated = result.records.find((r) => r.id === record.id)!;
                body.clear(updated.version);
                answer.expected.current = updated.version;
                setEditing(false);
              }
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-a5fa5e763428

## X-8171e3135e67

**초안 두고 닫기** · Button · user-control

- 실제 소스: [src/App.tsx:1918](../../../src/App.tsx#L1918)
- 연결 표면: [R20](../paths/R20.md)
- 직접 표시 조건: truthy: editing
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-7c8a77d4ee88](../handlers/App.md#h-7c8a77d4ee88)

```tsx
() => setEditing(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-601cf10a2f17

**기록 수정** · Button · user-control

- 실제 소스: [src/App.tsx:1927](../../../src/App.tsx#L1927)
- 연결 표면: [R20](../paths/R20.md)
- 직접 표시 조건: falsy: editing
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-a5497a4f93fe](../handlers/App.md#h-a5497a4f93fe)

```tsx
() => setEditing(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-facd8b8e6237

**원본 사본 보관 후 입력 이어가기 {body.cleanupPending ? "저장한 초안 정리 다시 시도" : "초안 다시 보관"}** · Button · user-control

- 실제 소스: [src/App.tsx:1932](../../../src/App.tsx#L1932)
- 연결 표면: [R20](../paths/R20.md)
- 직접 표시 조건: truthy: body.error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → 네이티브/호출자 동작

```tsx
body.retry
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-6a53d673268d

**남긴 체크와 시험 전 서술 점검** · summary · user-control

- 실제 소스: [src/App.tsx:1934](../../../src/App.tsx#L1934)
- 연결 표면: [R20](../paths/R20.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-9a9e03149a60

**{item.definition?.label || TRACE_ITEMS.find(value => value.id === id)?.label || `이전 항목 (${id})`} · {{checked:"체크함",unchecked:"미체크",na:"해당 없음",deferred:"보류"}[item.status]}** · summary · user-control

- 실제 소스: [src/App.tsx:1944](../../../src/App.tsx#L1944)
- 연결 표면: [R20](../paths/R20.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(Object.entries(record.trace)) · 1943행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-e42492ffd0b4

**시험 전, 자신의 문장으로 설명하기** · Textarea · user-control

- 실제 소스: [src/App.tsx:1952](../../../src/App.tsx#L1952)
- 연결 표면: [R20](../paths/R20.md)
- 직접 표시 조건: truthy: allowNewWrittenReview || record.trace.Cself1 || answer.body
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-151ea4f84621](../handlers/App.md#h-151ea4f84621)

```tsx
(e) => answer.change(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-0b4c21c8fa9a

**서술 저장** · Button · user-control

- 실제 소스: [src/App.tsx:1958](../../../src/App.tsx#L1958)
- 연결 표면: [R20](../paths/R20.md)
- 직접 표시 조건: truthy: allowNewWrittenReview || record.trace.Cself1 || answer.body
- 실행 차단 disabled: answer.blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ae6eaa1496f4](../handlers/App.md#h-ae6eaa1496f4) → [@callback:result.records.find · H-b74a71535b28](../handlers/App.md#h-b74a71535b28)

```tsx
() => {
            const result = commit(
              {
                type: "editWrittenReview",
                recordId: record.id,
                expectedVersion: answer.expected.current,
                answer: answer.body,
              },
              "서술을 저장했습니다. 점검 체크는 다시 열었습니다.",
            );
            if (result) {
              const updated = result.records.find((r) => r.id === record.id)!;
              answer.clear(updated.version);
              body.expected.current = updated.version;
            }
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-b243a4b8929d

## X-3bc53b2226bc

**서술을 남기고 점검함** · Checkbox · user-control

- 실제 소스: [src/App.tsx:1979](../../../src/App.tsx#L1979)
- 연결 표면: [R20](../paths/R20.md)
- 직접 표시 조건: truthy: allowNewWrittenReview || record.trace.Cself1 || answer.body
- 실행 차단 disabled: !review?.answer.trim() || answer.body !== review.answer
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 저장·변경 요청 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-e918979e3570](../handlers/App.md#h-e918979e3570) → [@callback:result.records.find · H-0ad4ed888dcd](../handlers/App.md#h-0ad4ed888dcd)

```tsx
() => {
            const result = commit(
              {
                type: review?.checked
                  ? "unconfirmWrittenReview"
                  : "confirmWrittenReview",
                recordId: record.id,
                expectedVersion: record.version,
              },
              review?.checked
                ? "점검만 해제했습니다. 서술은 남아 있습니다."
                : "서술 점검을 기록했습니다.",
            );
            if (result) {
              const updated = result.records.find((r) => r.id === record.id)!;
              body.expected.current = updated.version;
              answer.expected.current = updated.version;
            }
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-53a3d631a1ac, B-e6b0d8f848ba, B-f6d199da7ecd

## X-9470ff34f8f6

**원본 사본 보관 후 입력 이어가기 {answer.cleanupPending ? "저장한 초안 정리 다시 시도" : "초안 다시 보관"}** · Button · user-control

- 실제 소스: [src/App.tsx:2003](../../../src/App.tsx#L2003)
- 연결 표면: [R20](../paths/R20.md)
- 직접 표시 조건: truthy: allowNewWrittenReview || record.trace.Cself1 || answer.body ∧ truthy: answer.error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → 네이티브/호출자 동작

```tsx
answer.retry
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

