# src/ui/learning-links.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-f5743146cf59

**암기 항목을 넣을 주제** · Select · user-control

- 실제 소스: [src/ui/learning-links.tsx:23](../../../src/ui/learning-links.tsx#L23)
- 연결 표면: [R07](../paths/R07.md), [R12](../paths/R12.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U25](../paths/U25.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-3e378504bf06](../handlers/ui__learning-links.md#h-3e378504bf06)

```tsx
e => {setTopicId(e.target.value);setNotice('');}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-b50626b9cd7f

**질문과 답을 원자료와 대조했어요** · Checkbox · user-control

- 실제 소스: [src/ui/learning-links.tsx:24](../../../src/ui/learning-links.tsx#L24)
- 연결 표면: [R07](../paths/R07.md), [R12](../paths/R12.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U25](../paths/U25.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-0c1b6239e405](../handlers/ui__learning-links.md#h-0c1b6239e405)

```tsx
e => setReviewed(e.target.checked)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-262ac1dd0218

**암기 항목으로 등록** · Button · user-control

- 실제 소스: [src/ui/learning-links.tsx:26](../../../src/ui/learning-links.tsx#L26)
- 연결 표면: [R07](../paths/R07.md), [R12](../paths/R12.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U25](../paths/U25.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: !material || unsaved || !reviewed || !topicId || !capable
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [register · H-b272868ae6b4](../handlers/ui__learning-links.md#h-b272868ae6b4)

```tsx
register
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e18984e4e900, B-ba9ec3023186, B-4785b865bf14, B-8fe550a130f5, B-a5238fc255fb, B-92bad5acdb6a

## X-aad9fe1828ad

**암기시험 열기** · a · user-control

- 실제 소스: [src/ui/learning-links.tsx:27](../../../src/ui/learning-links.tsx#L27)
- 연결 표면: [R07](../paths/R07.md), [R12](../paths/R12.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U25](../paths/U25.md)
- 직접 표시 조건: truthy: notice ∧ truthy: !notice.includes('휴지통')
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/memory-test/${encodeURIComponent(topicId)}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-1d08665ff284

**{topic.name}** · a · user-control

- 실제 소스: [src/ui/learning-links.tsx:37](../../../src/ui/learning-links.tsx#L37)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: truthy: topic
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/node/${encodeURIComponent(topic.id)}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-7d2516972131

**코드 예제의 주제** · Select · user-control

- 실제 소스: [src/ui/learning-links.tsx:38](../../../src/ui/learning-links.tsx#L38)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: truthy: editing
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-281f75b42b89](../handlers/ui__learning-links.md#h-281f75b42b89)

```tsx
e => setTopicId(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-7050adc5ec81

**주제 연결 저장** · Button · user-control

- 실제 소스: [src/ui/learning-links.tsx:38](../../../src/ui/learning-links.tsx#L38)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: truthy: editing
- 실행 차단 disabled: !capable
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [save · H-60a4c96f38b2](../handlers/ui__learning-links.md#h-60a4c96f38b2)

```tsx
save
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-613076520efd, B-a9aae7d8dad9, B-b39a0898ae95

## X-e3f4446c29ae

**취소** · Button · user-control

- 실제 소스: [src/ui/learning-links.tsx:38](../../../src/ui/learning-links.tsx#L38)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: truthy: editing
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-e9f1537edb9d](../handlers/ui__learning-links.md#h-e9f1537edb9d)

```tsx
() => setEditing(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-450754d253d2

**공부 주제 연결** · Button · user-control

- 실제 소스: [src/ui/learning-links.tsx:38](../../../src/ui/learning-links.tsx#L38)
- 연결 표면: [R08](../paths/R08.md), [R25](../paths/R25.md)
- 직접 표시 조건: falsy: editing
- 실행 차단 disabled: !capable
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [begin · H-779f436ac211](../handlers/ui__learning-links.md#h-779f436ac211)

```tsx
begin
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-48cbdc7f6306, B-e757e55f718f, B-45aa750a3d6d

## X-cdbce58044e6

**{e.title || '제목 없는 예제'}** · a · user-control

- 실제 소스: [src/ui/learning-links.tsx:45](../../../src/ui/learning-links.tsx#L45)
- 연결 표면: [R20](../paths/R20.md)
- 직접 표시 조건: truthy: !!examples.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/code/${encodeURIComponent(e.id)}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(examples) · 45행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

