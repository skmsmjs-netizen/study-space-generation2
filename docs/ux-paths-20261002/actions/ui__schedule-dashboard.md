# src/ui/schedule-dashboard.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-c5b199756075

**'focus'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/schedule-dashboard.tsx:13](../../../src/ui/schedule-dashboard.tsx#L13)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**focus** → [tick · H-d7f27c6460a0](../handlers/ui__schedule-dashboard.md#h-d7f27c6460a0)

```tsx
tick
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-3cc16f8cbe60

**'visibilitychange'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/schedule-dashboard.tsx:13](../../../src/ui/schedule-dashboard.tsx#L13)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**visibilitychange** → [tick · H-d7f27c6460a0](../handlers/ui__schedule-dashboard.md#h-d7f27c6460a0)

```tsx
tick
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-fccebad511b8

**과제 추가** · Button · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:23](../../../src/ui/schedule-dashboard.tsx#L23)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d7a0b3659ef1](../handlers/ui__schedule-dashboard.md#h-d7a0b3659ef1)

```tsx
()=>create('assignment')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-23abe0100a2e

**온라인 강의 추가** · Button · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:23](../../../src/ui/schedule-dashboard.tsx#L23)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-59ac481dc5a1](../handlers/ui__schedule-dashboard.md#h-59ac481dc5a1)

```tsx
()=>create('lecture')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-4eb64a2fab40

**주차별 강의 추가** · Button · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:23](../../../src/ui/schedule-dashboard.tsx#L23)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-5faedc65ea6c](../handlers/ui__schedule-dashboard.md#h-5faedc65ea6c)

```tsx
()=>create('class')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-74f7f35d6fa8

**시험·과제·강의 일정 추가** · Button · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:23](../../../src/ui/schedule-dashboard.tsx#L23)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-a281fbef0748](../handlers/ui__schedule-dashboard.md#h-a281fbef0748)

```tsx
()=>create()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-10e879b333a5

**과목 공지 확인 기록** · summary · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:24](../../../src/ui/schedule-dashboard.tsx#L24)
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

## X-9b6d87ea9d81

**공지 확인한 과목** · Select · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:24](../../../src/ui/schedule-dashboard.tsx#L24)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-8134e2bf2d39](../handlers/ui__schedule-dashboard.md#h-8134e2bf2d39)

```tsx
e=>setCheckSubject(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c2ddede42993

**공지 확인했어요** · Button · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:24](../../../src/ui/schedule-dashboard.tsx#L24)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: !checkSubject||disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-47e3a5c72bfe](../handlers/ui__schedule-dashboard.md#h-47e3a5c72bfe)

```tsx
()=>{if(checkSubject)onCheck(checkSubject);}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-251ae55b56c3

## X-9fe33a1cb097

**일정 찾기** · Input · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:26](../../../src/ui/schedule-dashboard.tsx#L26)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-71f48910d3ac](../handlers/ui__schedule-dashboard.md#h-71f48910d3ac) → [patchView · H-30ea0027cd6f](../handlers/ui__schedule-dashboard.md#h-30ea0027cd6f)

```tsx
e=>patchView({query:e.target.value})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-b4564350df37, B-484294823193

## X-88c7dfbe5905

**일정 종류 보기** · Select · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:26](../../../src/ui/schedule-dashboard.tsx#L26)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-bec98a91684e](../handlers/ui__schedule-dashboard.md#h-bec98a91684e) → [patchView · H-30ea0027cd6f](../handlers/ui__schedule-dashboard.md#h-30ea0027cd6f)

```tsx
e=>patchView({kind:e.target.value})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-b4564350df37, B-484294823193

## X-0622467be4c7

**일정 보관 상태** · Select · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:26](../../../src/ui/schedule-dashboard.tsx#L26)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-91998b0159fd](../handlers/ui__schedule-dashboard.md#h-91998b0159fd) → [patchView · H-30ea0027cd6f](../handlers/ui__schedule-dashboard.md#h-30ea0027cd6f)

```tsx
e=>patchView({status:e.target.value as ScheduleView['status']})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-b4564350df37, B-484294823193

## X-af868af7c60d

**목록** · Button · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:27](../../../src/ui/schedule-dashboard.tsx#L27)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-fd2306df8d8d](../handlers/ui__schedule-dashboard.md#h-fd2306df8d8d) → [patchView · H-30ea0027cd6f](../handlers/ui__schedule-dashboard.md#h-30ea0027cd6f)

```tsx
()=>patchView({view:'list'})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-b4564350df37, B-484294823193

## X-fcb15d74f523

**달력** · Button · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:27](../../../src/ui/schedule-dashboard.tsx#L27)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-a1a04fe9270b](../handlers/ui__schedule-dashboard.md#h-a1a04fe9270b) → [patchView · H-30ea0027cd6f](../handlers/ui__schedule-dashboard.md#h-30ea0027cd6f)

```tsx
()=>patchView({view:'calendar'})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-b4564350df37, B-484294823193

## X-d530c0b804b3

**캘린더 파일 저장** · Button · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:27](../../../src/ui/schedule-dashboard.tsx#L27)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-7dc902df634e](../handlers/ui__schedule-dashboard.md#h-7dc902df634e)

```tsx
()=>{downloadCalendar(calendarFile(schedules,now,`${data.namespace}-${data.userId}`));setNotice('현재 일정을 캘린더 파일로 저장했습니다. 파일을 추가한 캘린더에서 알림 설정을 확인해 주세요. 일정이 바뀌면 다시 내보내야 합니다.');}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-d3a925109ff6

**이전 달** · Button · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:28](../../../src/ui/schedule-dashboard.tsx#L28)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: view.view==='calendar'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-39b77d70210e](../handlers/ui__schedule-dashboard.md#h-39b77d70210e) → [monthChange · H-0b08f5b8d23d](../handlers/ui__schedule-dashboard.md#h-0b08f5b8d23d) → [patchView · H-30ea0027cd6f](../handlers/ui__schedule-dashboard.md#h-30ea0027cd6f)

```tsx
()=>monthChange(-1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-b4564350df37, B-484294823193

## X-201cf3d7b75e

**달력 월** · Input · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:28](../../../src/ui/schedule-dashboard.tsx#L28)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: view.view==='calendar'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onInput** → [@onInput · H-9f5fbaf79fe1](../handlers/ui__schedule-dashboard.md#h-9f5fbaf79fe1) → [patchView · H-30ea0027cd6f](../handlers/ui__schedule-dashboard.md#h-30ea0027cd6f)

```tsx
e=>{if(e.currentTarget.value)patchView({month:e.currentTarget.value});}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-51b84089f134, B-b4564350df37, B-484294823193

**onChange** → [@onChange · H-8b0eb0b899ff](../handlers/ui__schedule-dashboard.md#h-8b0eb0b899ff) → [patchView · H-30ea0027cd6f](../handlers/ui__schedule-dashboard.md#h-30ea0027cd6f)

```tsx
e=>{if(e.target.value)patchView({month:e.target.value});}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-4f2af25084e2, B-b4564350df37, B-484294823193

## X-431c90ec44a1

**다음 달** · Button · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:28](../../../src/ui/schedule-dashboard.tsx#L28)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: view.view==='calendar'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-0b7756d35484](../handlers/ui__schedule-dashboard.md#h-0b7756d35484) → [monthChange · H-0b08f5b8d23d](../handlers/ui__schedule-dashboard.md#h-0b08f5b8d23d) → [patchView · H-30ea0027cd6f](../handlers/ui__schedule-dashboard.md#h-30ea0027cd6f)

```tsx
()=>monthChange(1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-b4564350df37, B-484294823193

## X-2ec152800059

**이번 달** · Button · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:28](../../../src/ui/schedule-dashboard.tsx#L28)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: view.view==='calendar'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-2c925fd4e12e](../handlers/ui__schedule-dashboard.md#h-2c925fd4e12e) → [patchView · H-30ea0027cd6f](../handlers/ui__schedule-dashboard.md#h-30ea0027cd6f)

```tsx
()=>patchView({month:today.slice(0,7)})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-b4564350df37, B-484294823193

## X-968e02148773

**`${day} · 일정 ${rows.length}개`** · button · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:30](../../../src/ui/schedule-dashboard.tsx#L30)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: view.view==='calendar'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-b491878467a7](../handlers/ui__schedule-dashboard.md#h-b491878467a7)

```tsx
()=>{setSelected(selected===day?'':day);setLimit(20);}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ed399684b7ab

반복: map(monthDays(view.month)) · 30행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-414defdc693d

**모든 날짜 보기** · Button · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:31](../../../src/ui/schedule-dashboard.tsx#L31)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: view.view==='calendar' ∧ truthy: selected
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-2712dfe1c022](../handlers/ui__schedule-dashboard.md#h-2712dfe1c022)

```tsx
()=>setSelected('')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-b3c041d04e93

**공지·강의 열기** · a · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:41](../../../src/ui/schedule-dashboard.tsx#L41)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: s.sourceUrl
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `s.sourceUrl`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(shown.slice(0,limit)) · 35행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-87338ba73943

**`${s.name}${s.week?` · ${s.week}주차`:''} · ${workLabels[step]}`** · Select · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:42](../../../src/ui/schedule-dashboard.tsx#L42)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: !s.deletedAt
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-0dd09d29497b](../handlers/ui__schedule-dashboard.md#h-0dd09d29497b)

```tsx
e=>update(s,{states:{...s.states,[step]:e.target.value as 'unknown'|'done'|'not-done'}},`${workLabels[step]} 상태 수정`)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(scheduleWorkSteps(s)) · 42행; map(shown.slice(0,limit)) · 35행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-34d9958f1e3e

**일정 복원** · Button · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:45](../../../src/ui/schedule-dashboard.tsx#L45)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: s.deletedAt
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-5e9a84262339](../handlers/ui__schedule-dashboard.md#h-5e9a84262339)

```tsx
()=>update(s,{deletedAt:null},'휴지통에서 복원')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(shown.slice(0,limit)) · 35행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-dff74d066c0d

**일정 수정** · Button · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:45](../../../src/ui/schedule-dashboard.tsx#L45)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: falsy: s.deletedAt
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-1589876c3e90](../handlers/ui__schedule-dashboard.md#h-1589876c3e90)

```tsx
()=>edit(s)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(shown.slice(0,limit)) · 35행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-bd5fcaa24774

**일정 보관 일정 다시 열기** · Button · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:45](../../../src/ui/schedule-dashboard.tsx#L45)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: falsy: s.deletedAt
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-be0d223e6bf7](../handlers/ui__schedule-dashboard.md#h-be0d223e6bf7)

```tsx
()=>update(s,{status:s.status==='active'?'ended':'active'},'보관 상태 수정')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6b9bb2cd8c10

반복: map(shown.slice(0,limit)) · 35행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-fc708c092d4b

**휴지통으로 이동** · Button · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:45](../../../src/ui/schedule-dashboard.tsx#L45)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: falsy: s.deletedAt
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-10123636c844](../handlers/ui__schedule-dashboard.md#h-10123636c844)

```tsx
()=>update(s,{deletedAt:now},'휴지통으로 이동')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(shown.slice(0,limit)) · 35행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-8fc52a95ac0f

**마지막 변경 되돌리기** · Button · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:45](../../../src/ui/schedule-dashboard.tsx#L45)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: !!s.history?.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c96595bace35](../handlers/ui__schedule-dashboard.md#h-c96595bace35)

```tsx
()=>restore(s,s.history!.length-1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(shown.slice(0,limit)) · 35행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-2bdba46de516

**변경 이력 {s.history.length} 개** · summary · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:46](../../../src/ui/schedule-dashboard.tsx#L46)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: !!s.history?.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(shown.slice(0,limit)) · 35행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-eac1d44a6dcf

**이전 원문·상태 보기** · summary · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:46](../../../src/ui/schedule-dashboard.tsx#L46)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: !!s.history?.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(occurrenceRows(s.history.slice().reverse(), h => JSON.stringify(h))) · 46행; map(shown.slice(0,limit)) · 35행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-f0cb44cb0e7a

**이 기록으로 되돌리기** · Button · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:46](../../../src/ui/schedule-dashboard.tsx#L46)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: !!s.history?.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-e46421c4d6be](../handlers/ui__schedule-dashboard.md#h-e46421c4d6be)

```tsx
()=>restore(s,s.history!.length-1-i)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(occurrenceRows(s.history.slice().reverse(), h => JSON.stringify(h))) · 46행; map(shown.slice(0,limit)) · 35행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-c5cfb670c63a

**일정 더 보기 · 남은 {shown.length-limit} 개** · Button · user-control

- 실제 소스: [src/ui/schedule-dashboard.tsx:48](../../../src/ui/schedule-dashboard.tsx#L48)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: shown.length>limit
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-dee475a253c9](../handlers/ui__schedule-dashboard.md#h-dee475a253c9) → [@callback:setLimit · H-2d9219ab86d4](../handlers/ui__schedule-dashboard.md#h-2d9219ab86d4)

```tsx
()=>setLimit(v=>v+20)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

