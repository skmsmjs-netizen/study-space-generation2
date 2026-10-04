# src/ui/quick-memos.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-7619a0f3fb40

**모두 보기** · a · user-control

- 실제 소스: [src/ui/quick-memos.tsx:60](../../../src/ui/quick-memos.tsx#L60)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: truthy: !trash ∧ truthy: compact
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/memos`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-9b2bbbf7bc90

**메모 추가** · Button · user-control

- 실제 소스: [src/ui/quick-memos.tsx:60](../../../src/ui/quick-memos.tsx#L60)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: truthy: !trash
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [add · H-58febee445d4](../handlers/ui__quick-memos.md#h-58febee445d4) → [execute · H-97d3f08e611f](../handlers/ui__quick-memos.md#h-97d3f08e611f) → [errorMessage · H-3718c8c29801](../handlers/ui__quick-memos.md#h-3718c8c29801)

```tsx
add
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-dec359e52a2a, B-3383b5732acb, B-f9956fa2f9c8, B-a9d60e5c4c2f, B-720180e1531d

## X-cb4d469b3db3

**메모 복원** · Button · user-control

- 실제 소스: [src/ui/quick-memos.tsx:63](../../../src/ui/quick-memos.tsx#L63)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: truthy: undoTrash
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-6ff6a05af425](../handlers/ui__quick-memos.md#h-6ff6a05af425) → [restore · H-4547f677668b](../handlers/ui__quick-memos.md#h-4547f677668b) → [execute · H-97d3f08e611f](../handlers/ui__quick-memos.md#h-97d3f08e611f) → [errorMessage · H-3718c8c29801](../handlers/ui__quick-memos.md#h-3718c8c29801)

```tsx
() => restore(undoTrash)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-bc898e7b4a2e, B-3383b5732acb, B-f9956fa2f9c8, B-a9d60e5c4c2f, B-720180e1531d

## X-5cdbc37d3cc6

**메모 찾기** · Textarea · user-control

- 실제 소스: [src/ui/quick-memos.tsx:64](../../../src/ui/quick-memos.tsx#L64)
- 연결 표면: [R06](../paths/R06.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: truthy: !compact
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-0dbe7f37c62f](../handlers/ui__quick-memos.md#h-0dbe7f37c62f)

```tsx
event => { setQuery(event.target.value); setLimit(40); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-f044d911fe95

**`메모 ${index + 1} 열기${memo.body ? `: ${memo.body.slice(0, 35)}` : memo.strokes.length ? ': 스케치' : ': 빈 메모'}`** · button · user-control

- 실제 소스: [src/ui/quick-memos.tsx:66](../../../src/ui/quick-memos.tsx#L66)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: trash
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-2577e73af16c](../handlers/ui__quick-memos.md#h-2577e73af16c)

```tsx
event => { event.currentTarget.focus({ preventScroll: true }); setEditing(memo.id); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(compact ? filtered.slice(0, 3) : filtered.slice(0, Math.max(40, limit))) · 65행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-6fa06cf72218

**복원** · Button · user-control

- 실제 소스: [src/ui/quick-memos.tsx:71](../../../src/ui/quick-memos.tsx#L71)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: truthy: trash
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-650048fdd75d](../handlers/ui__quick-memos.md#h-650048fdd75d) → [restore · H-4547f677668b](../handlers/ui__quick-memos.md#h-4547f677668b) → [execute · H-97d3f08e611f](../handlers/ui__quick-memos.md#h-97d3f08e611f) → [errorMessage · H-3718c8c29801](../handlers/ui__quick-memos.md#h-3718c8c29801)

```tsx
() => restore(memo)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-bc898e7b4a2e, B-3383b5732acb, B-f9956fa2f9c8, B-a9d60e5c4c2f, B-720180e1531d

반복: map(compact ? filtered.slice(0, 3) : filtered.slice(0, Math.max(40, limit))) · 65행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-3f9edc12f90d

**`메모 ${index + 1} 메뉴`** · summary · user-control

- 실제 소스: [src/ui/quick-memos.tsx:71](../../../src/ui/quick-memos.tsx#L71)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: falsy: trash
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(compact ? filtered.slice(0, 3) : filtered.slice(0, Math.max(40, limit))) · 65행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-760fd4714baa

**`메모 ${index + 1} 휴지통으로 이동`** · Button · user-control

- 실제 소스: [src/ui/quick-memos.tsx:71](../../../src/ui/quick-memos.tsx#L71)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: falsy: trash
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-1a0e54409aa5](../handlers/ui__quick-memos.md#h-1a0e54409aa5)

```tsx
() => setTrashId(memo.id)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(compact ? filtered.slice(0, 3) : filtered.slice(0, Math.max(40, limit))) · 65행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-32b6f2161bec

**메모 더 보기** · Button · user-control

- 실제 소스: [src/ui/quick-memos.tsx:73](../../../src/ui/quick-memos.tsx#L73)
- 연결 표면: [R06](../paths/R06.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: truthy: !compact && filtered.length > Math.max(40, limit)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-50963753ae2c](../handlers/ui__quick-memos.md#h-50963753ae2c) → [@callback:setLimit · H-44dcd59c675c](../handlers/ui__quick-memos.md#h-44dcd59c675c)

```tsx
() => setLimit(value => Math.max(40, value) + 40)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-69f51a754784

**메모 검색어 지우기** · Button · user-control

- 실제 소스: [src/ui/quick-memos.tsx:74](../../../src/ui/quick-memos.tsx#L74)
- 연결 표면: [R06](../paths/R06.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: truthy: !compact && all.length > 0 && !filtered.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-b87194d78641](../handlers/ui__quick-memos.md#h-b87194d78641)

```tsx
() => {setQuery('');setLimit(40);}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-33feb169a271

**MemoEditor · 조작/부품 영역** · MemoEditor · component-callback-contract

- 실제 소스: [src/ui/quick-memos.tsx:76](../../../src/ui/quick-memos.tsx#L76)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: truthy: selected
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 취소·닫기 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
onSaved
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onClose** → [close · H-ef00d95c9060](../handlers/ui__quick-memos.md#h-ef00d95c9060)

```tsx
close
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-eba566314beb, B-e46463e545fc

**onCopy** → [@onCopy · H-d8aa37ce070c](../handlers/ui__quick-memos.md#h-d8aa37ce070c)

```tsx
id => setEditing(id)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-f566b5cd6db6

**메모 목록으로** · a · user-control

- 실제 소스: [src/ui/quick-memos.tsx:77](../../../src/ui/quick-memos.tsx#L77)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: truthy: memoId && !selected
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/memos`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-a06b5da60531

**메모를 휴지통으로 옮길까요?** · Modal · component-callback-contract

- 실제 소스: [src/ui/quick-memos.tsx:78](../../../src/ui/quick-memos.tsx#L78)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md)
- 직접 표시 조건: truthy: Boolean(trashId)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-cee228adb10c](../handlers/ui__quick-memos.md#h-cee228adb10c)

```tsx
() => setTrashId(null)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-ecc8e9c7b086

**휴지통으로 이동** · Button · user-control

- 실제 소스: [src/ui/quick-memos.tsx:78](../../../src/ui/quick-memos.tsx#L78)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md)
- 직접 표시 조건: truthy: Boolean(trashId)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-552f5eff7ec1](../handlers/ui__quick-memos.md#h-552f5eff7ec1) → [moveToTrash · H-a029e0893c94](../handlers/ui__quick-memos.md#h-a029e0893c94) → [execute · H-97d3f08e611f](../handlers/ui__quick-memos.md#h-97d3f08e611f) → [errorMessage · H-3718c8c29801](../handlers/ui__quick-memos.md#h-3718c8c29801) → [@callback:all.find · H-d68644f2bdd6](../handlers/ui__quick-memos.md#h-d68644f2bdd6)

```tsx
() => { const memo = all.find(row => row.id === trashId); if (memo) moveToTrash(memo); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-92cdcca6e420, B-acd4e98fbfb3, B-3383b5732acb, B-f9956fa2f9c8, B-a9d60e5c4c2f, B-720180e1531d

## X-e23960ca665b

**'beforeunload'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/quick-memos.tsx:147](../../../src/ui/quick-memos.tsx#L147)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**beforeunload** → [unload · H-be37b7950545](../handlers/ui__quick-memos.md#h-be37b7950545) → [save · H-4386cce48d58](../handlers/ui__quick-memos.md#h-4386cce48d58)

```tsx
unload
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-275aaf8286ec

## X-0d24d3cd8ac4

**'pagehide'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/quick-memos.tsx:147](../../../src/ui/quick-memos.tsx#L147)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**pagehide** → [save · H-4386cce48d58](../handlers/ui__quick-memos.md#h-4386cce48d58)

```tsx
save
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-a9ca74357cbb

**'visibilitychange'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/quick-memos.tsx:147](../../../src/ui/quick-memos.tsx#L147)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**visibilitychange** → [hidden · H-7754ad914a32](../handlers/ui__quick-memos.md#h-7754ad914a32) → [save · H-4386cce48d58](../handlers/ui__quick-memos.md#h-4386cce48d58)

```tsx
hidden
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-2da6ad8c3296

## X-1cca8abb9014

**필기할 PDF 파일** · input · user-control

- 실제 소스: [src/ui/quick-memos.tsx:205](../../../src/ui/quick-memos.tsx#L205)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: visible-when-falsy: true
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-bf6728f2577e](../handlers/ui__quick-memos.md#h-bf6728f2577e) → [attachPDF · H-e78c756d4ae2](../handlers/ui__quick-memos.md#h-e78c756d4ae2) → [errorMessage · H-3718c8c29801](../handlers/ui__quick-memos.md#h-3718c8c29801) → [finishPDFUpload · H-e010d3b973f2](../handlers/ui__quick-memos.md#h-e010d3b973f2) → [flush · H-a435ee3546d6](../handlers/ui__quick-memos.md#h-a435ee3546d6) → [@callback:next.memos!.find · H-f1b2dec302cd](../handlers/ui__quick-memos.md#h-f1b2dec302cd) → [persistDraft · H-63df12414426](../handlers/ui__quick-memos.md#h-63df12414426) → [update · H-c4d00807ccda](../handlers/ui__quick-memos.md#h-c4d00807ccda) → [finish · H-74f2c3de5827](../handlers/ui__quick-memos.md#h-74f2c3de5827)

```tsx
e=>{const file=e.target.files?.[0];e.target.value='';if(file)void attachPDF(file);}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-9522d506eddd, B-bf4e4984d728, B-1a56030b5969, B-0acde3947a9b, B-eae397018fac, B-ad05e594307f, B-9776e8e47a98, B-de0da6f75af2, B-9073291603ec, B-a9d60e5c4c2f, B-720180e1531d, B-e63283aa694a, B-6fa11e9288d3, B-4e9d9f767fca, B-030944f55ed5, B-2f12858534d4, B-26feedd8a0e9, B-6a1a8447de6d, B-3ece803860f5, B-437ea6625285, B-311e29a12c07, B-b6e9eb5361be, B-787e0923ba83, B-8ead7dd4eec8, B-a9146fe5d63f, B-d00873d43f83, B-313eddfd828e, B-65f4a0c43292, B-d806510e9e84

## X-ba0c818d4f0a

**PDF 위에 필기** · Button · user-control

- 실제 소스: [src/ui/quick-memos.tsx:206](../../../src/ui/quick-memos.tsx#L206)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: truthy: !content.document
- 실행 차단 disabled: isBlocked||pdfBusy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-3ad71cae7698](../handlers/ui__quick-memos.md#h-3ad71cae7698)

```tsx
()=>documentInput.current?.click()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-97faa91a379d

**주석 PDF로 보관** · Button · user-control

- 실제 소스: [src/ui/quick-memos.tsx:207](../../../src/ui/quick-memos.tsx#L207)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: isBlocked||pdfBusy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-a9ba60d7a0ed](../handlers/ui__quick-memos.md#h-a9ba60d7a0ed) → [downloadPDF · H-91e59e09d04c](../handlers/ui__quick-memos.md#h-91e59e09d04c) → [errorMessage · H-3718c8c29801](../handlers/ui__quick-memos.md#h-3718c8c29801) → [finish · H-74f2c3de5827](../handlers/ui__quick-memos.md#h-74f2c3de5827)

```tsx
()=>void downloadPDF()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-6ceb345a9144, B-613a3f85c982, B-7668339a6073, B-2951e8b4d1fb, B-37eb38703df5, B-a9d60e5c4c2f, B-720180e1531d

## X-3eb58156093f

**PDF 원본 다시 연결** · Button · user-control

- 실제 소스: [src/ui/quick-memos.tsx:208](../../../src/ui/quick-memos.tsx#L208)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: truthy: content.document
- 실행 차단 disabled: pdfBusy||isBlocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-6b7f0364d817](../handlers/ui__quick-memos.md#h-6b7f0364d817)

```tsx
()=>documentInput.current?.click()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-b2464705073b

**원본 PDF 보관** · Button · user-control

- 실제 소스: [src/ui/quick-memos.tsx:208](../../../src/ui/quick-memos.tsx#L208)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: truthy: content.document
- 실행 차단 disabled: pdfBusy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-e680b6071a44](../handlers/ui__quick-memos.md#h-e680b6071a44) → [downloadPDF · H-91e59e09d04c](../handlers/ui__quick-memos.md#h-91e59e09d04c) → [errorMessage · H-3718c8c29801](../handlers/ui__quick-memos.md#h-3718c8c29801) → [finish · H-74f2c3de5827](../handlers/ui__quick-memos.md#h-74f2c3de5827)

```tsx
()=>void downloadPDF(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-6ceb345a9144, B-613a3f85c982, B-7668339a6073, B-2951e8b4d1fb, B-37eb38703df5, B-a9d60e5c4c2f, B-720180e1531d

## X-f771e81f7da9

**PDF 서버 보관 다시 시도** · Button · user-control

- 실제 소스: [src/ui/quick-memos.tsx:209](../../../src/ui/quick-memos.tsx#L209)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: truthy: content.document ∧ truthy: data.namespace==='personal'&&!content.document.file.cloudPath
- 실행 차단 disabled: pdfBusy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-0bb8f6ee900e](../handlers/ui__quick-memos.md#h-0bb8f6ee900e) → [retryPDF · H-a0839772056b](../handlers/ui__quick-memos.md#h-a0839772056b) → [errorMessage · H-3718c8c29801](../handlers/ui__quick-memos.md#h-3718c8c29801) → [finishPDFUpload · H-e010d3b973f2](../handlers/ui__quick-memos.md#h-e010d3b973f2) → [flush · H-a435ee3546d6](../handlers/ui__quick-memos.md#h-a435ee3546d6) → [@callback:next.memos!.find · H-f1b2dec302cd](../handlers/ui__quick-memos.md#h-f1b2dec302cd) → [persistDraft · H-63df12414426](../handlers/ui__quick-memos.md#h-63df12414426) → [update · H-c4d00807ccda](../handlers/ui__quick-memos.md#h-c4d00807ccda)

```tsx
()=>void retryPDF()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-121079f0f61b, B-85b8dc81c64e, B-f097f87c8b74, B-af6cb73367aa, B-7d184eb3116f, B-45b44af8ecf5, B-a9d60e5c4c2f, B-720180e1531d, B-e63283aa694a, B-6fa11e9288d3, B-4e9d9f767fca, B-030944f55ed5, B-2f12858534d4, B-26feedd8a0e9, B-6a1a8447de6d, B-3ece803860f5, B-437ea6625285, B-311e29a12c07, B-b6e9eb5361be, B-787e0923ba83, B-8ead7dd4eec8, B-a9146fe5d63f, B-d00873d43f83, B-313eddfd828e, B-65f4a0c43292, B-d806510e9e84

## X-8c2268ed462d

**메모 필기** · MemoInkPad · component-callback-contract

- 실제 소스: [src/ui/quick-memos.tsx:212](../../../src/ui/quick-memos.tsx#L212)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: isBlocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onPageChange** → 네이티브/호출자 동작

```tsx
setPDFPage
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onRecognizedText** → [@onRecognizedText · H-cf8dbee84b6c](../handlers/ui__quick-memos.md#h-cf8dbee84b6c) → [update · H-c4d00807ccda](../handlers/ui__quick-memos.md#h-c4d00807ccda) → [flush · H-a435ee3546d6](../handlers/ui__quick-memos.md#h-a435ee3546d6) → [errorMessage · H-3718c8c29801](../handlers/ui__quick-memos.md#h-3718c8c29801) → [@callback:next.memos!.find · H-f1b2dec302cd](../handlers/ui__quick-memos.md#h-f1b2dec302cd) → [persistDraft · H-63df12414426](../handlers/ui__quick-memos.md#h-63df12414426)

```tsx
text=>update({...contentRef.current,body:contentRef.current.body+(contentRef.current.body ? '\n' : '')+text})
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-dc45e6b81f42, B-65f4a0c43292, B-d806510e9e84, B-4e9d9f767fca, B-030944f55ed5, B-2f12858534d4, B-26feedd8a0e9, B-6a1a8447de6d, B-3ece803860f5, B-437ea6625285, B-311e29a12c07, B-b6e9eb5361be, B-787e0923ba83, B-8ead7dd4eec8, B-a9d60e5c4c2f, B-720180e1531d, B-a9146fe5d63f, B-d00873d43f83, B-313eddfd828e

**onWorkspaceSaved** → [@onWorkspaceSaved · H-5b27ebe2b40f](../handlers/ui__quick-memos.md#h-5b27ebe2b40f)

```tsx
() => onSaved(repository.getSnapshot())
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onDrawing** → [@onDrawing · H-88ffcae59ed5](../handlers/ui__quick-memos.md#h-88ffcae59ed5)

```tsx
value => { drawing.current = value; }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onChange** → [@onChange · H-0ec9f8feb577](../handlers/ui__quick-memos.md#h-0ec9f8feb577) → [update · H-c4d00807ccda](../handlers/ui__quick-memos.md#h-c4d00807ccda) → [flush · H-a435ee3546d6](../handlers/ui__quick-memos.md#h-a435ee3546d6) → [errorMessage · H-3718c8c29801](../handlers/ui__quick-memos.md#h-3718c8c29801) → [@callback:next.memos!.find · H-f1b2dec302cd](../handlers/ui__quick-memos.md#h-f1b2dec302cd) → [persistDraft · H-63df12414426](../handlers/ui__quick-memos.md#h-63df12414426)

```tsx
strokes => update({ ...contentRef.current, strokes })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-65f4a0c43292, B-d806510e9e84, B-4e9d9f767fca, B-030944f55ed5, B-2f12858534d4, B-26feedd8a0e9, B-6a1a8447de6d, B-3ece803860f5, B-437ea6625285, B-311e29a12c07, B-b6e9eb5361be, B-787e0923ba83, B-8ead7dd4eec8, B-a9d60e5c4c2f, B-720180e1531d, B-a9146fe5d63f, B-d00873d43f83, B-313eddfd828e

## X-0d69fcdecb2a

**InkPDFBackground · 조작/부품 영역** · InkPDFBackground · component-callback-contract

- 실제 소스: [src/ui/quick-memos.tsx:213](../../../src/ui/quick-memos.tsx#L213)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md), [U29](../paths/U29.md)
- 직접 표시 조건: truthy: content.document
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onError** → 네이티브/호출자 동작

```tsx
setError
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-a43a0dff4970

**글·연결·입력 설정** · summary · user-control

- 실제 소스: [src/ui/quick-memos.tsx:216](../../../src/ui/quick-memos.tsx#L216)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-3bbc4824e6f1

**짧은 글** · Textarea · user-control

- 실제 소스: [src/ui/quick-memos.tsx:216](../../../src/ui/quick-memos.tsx#L216)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: isBlocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-5cbef6a29e38](../handlers/ui__quick-memos.md#h-5cbef6a29e38) → [update · H-c4d00807ccda](../handlers/ui__quick-memos.md#h-c4d00807ccda) → [flush · H-a435ee3546d6](../handlers/ui__quick-memos.md#h-a435ee3546d6) → [errorMessage · H-3718c8c29801](../handlers/ui__quick-memos.md#h-3718c8c29801) → [@callback:next.memos!.find · H-f1b2dec302cd](../handlers/ui__quick-memos.md#h-f1b2dec302cd) → [persistDraft · H-63df12414426](../handlers/ui__quick-memos.md#h-63df12414426)

```tsx
event => update({ ...contentRef.current, body: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-65f4a0c43292, B-d806510e9e84, B-4e9d9f767fca, B-030944f55ed5, B-2f12858534d4, B-26feedd8a0e9, B-6a1a8447de6d, B-3ece803860f5, B-437ea6625285, B-311e29a12c07, B-b6e9eb5361be, B-787e0923ba83, B-8ead7dd4eec8, B-a9d60e5c4c2f, B-720180e1531d, B-a9146fe5d63f, B-d00873d43f83, B-313eddfd828e

## X-8ad9a0933040

**연결할 곳** · Select · user-control

- 실제 소스: [src/ui/quick-memos.tsx:218](../../../src/ui/quick-memos.tsx#L218)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: isBlocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-8570d5ec4303](../handlers/ui__quick-memos.md#h-8570d5ec4303) → [update · H-c4d00807ccda](../handlers/ui__quick-memos.md#h-c4d00807ccda) → [flush · H-a435ee3546d6](../handlers/ui__quick-memos.md#h-a435ee3546d6) → [errorMessage · H-3718c8c29801](../handlers/ui__quick-memos.md#h-3718c8c29801) → [@callback:next.memos!.find · H-f1b2dec302cd](../handlers/ui__quick-memos.md#h-f1b2dec302cd) → [persistDraft · H-63df12414426](../handlers/ui__quick-memos.md#h-63df12414426)

```tsx
event => update({ ...contentRef.current, ownerId: event.target.value || null })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-65f4a0c43292, B-d806510e9e84, B-4e9d9f767fca, B-030944f55ed5, B-2f12858534d4, B-26feedd8a0e9, B-6a1a8447de6d, B-3ece803860f5, B-437ea6625285, B-311e29a12c07, B-b6e9eb5361be, B-787e0923ba83, B-8ead7dd4eec8, B-a9d60e5c4c2f, B-720180e1531d, B-a9146fe5d63f, B-d00873d43f83, B-313eddfd828e

## X-03965a91894a

**초안을 별도 메모로 보관** · Button · user-control

- 실제 소스: [src/ui/quick-memos.tsx:226](../../../src/ui/quick-memos.tsx#L226)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: truthy: initial.conflict
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [copyConflict · H-27f23e2813f8](../handlers/ui__quick-memos.md#h-27f23e2813f8) → [errorMessage · H-3718c8c29801](../handlers/ui__quick-memos.md#h-3718c8c29801)

```tsx
copyConflict
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d0fe298efd8b, B-f12fdd3c4911, B-5434ab50a07e, B-504dc1657146, B-a9d60e5c4c2f, B-720180e1531d

## X-db91267abb5b

**초안 원문 보관 후 편집** · Button · user-control

- 실제 소스: [src/ui/quick-memos.tsx:227](../../../src/ui/quick-memos.tsx#L227)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: truthy: isBlocked && !initial.conflict
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-88bed2e3ab88](../handlers/ui__quick-memos.md#h-88bed2e3ab88) → [errorMessage · H-3718c8c29801](../handlers/ui__quick-memos.md#h-3718c8c29801)

```tsx
() => {
      try { archiveDamagedDraft(key, '작은 메모 초안 읽기 실패'); clearStoredDraft(key); blocked.current = false; setBlocked(false); setError('읽을 수 없던 초안 원문을 보관했습니다. 저장된 메모를 이어 편집할 수 있습니다.'); }
      catch (e) { setError(errorMessage(e)); }
    }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7a2830283db3, B-c3e65153130d, B-a9d60e5c4c2f, B-720180e1531d

## X-71672fef9d10

**초안 보관본 확인** · a · user-control

- 실제 소스: [src/ui/quick-memos.tsx:232](../../../src/ui/quick-memos.tsx#L232)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: truthy: isBlocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/draft-archives`. 동적 ID는 현재 항목 값을 사용한다.

**onClick** → 네이티브/호출자 동작

```tsx
onClose
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-9af2aec649c6

**메모 파일로 보관** · Button · user-control

- 실제 소스: [src/ui/quick-memos.tsx:233](../../../src/ui/quick-memos.tsx#L233)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [exportMemo · H-5ca973ec3ecf](../handlers/ui__quick-memos.md#h-5ca973ec3ecf) → [@callback:setTimeout · H-8320c82a0264](../handlers/ui__quick-memos.md#h-8320c82a0264) → [@callback:repository.getSnapshot().revisions.filter · H-80a428c116ca](../handlers/ui__quick-memos.md#h-80a428c116ca) → [@callback:repository.getSnapshot().revisions.filter(row => row.collection === 'memos' && row.entityId === memo.id).map · H-456837bfc96e](../handlers/ui__quick-memos.md#h-456837bfc96e) → [@callback:repository.getSnapshot().revisions.filter · H-0e66d98479ca](../handlers/ui__quick-memos.md#h-0e66d98479ca) → [finish · H-74f2c3de5827](../handlers/ui__quick-memos.md#h-74f2c3de5827)

```tsx
exportMemo
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-80aa7ee0fe9b, B-12fdbb71798e, B-b4117f1900c1

## X-48ca9c56f8d3

**지금 저장** · Button · user-control

- 실제 소스: [src/ui/quick-memos.tsx:233](../../../src/ui/quick-memos.tsx#L233)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: truthy: !isBlocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [flush · H-a435ee3546d6](../handlers/ui__quick-memos.md#h-a435ee3546d6) → [errorMessage · H-3718c8c29801](../handlers/ui__quick-memos.md#h-3718c8c29801) → [@callback:next.memos!.find · H-f1b2dec302cd](../handlers/ui__quick-memos.md#h-f1b2dec302cd) → [persistDraft · H-63df12414426](../handlers/ui__quick-memos.md#h-63df12414426)

```tsx
flush
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-4e9d9f767fca, B-030944f55ed5, B-2f12858534d4, B-26feedd8a0e9, B-6a1a8447de6d, B-3ece803860f5, B-437ea6625285, B-311e29a12c07, B-b6e9eb5361be, B-787e0923ba83, B-8ead7dd4eec8, B-a9d60e5c4c2f, B-720180e1531d, B-a9146fe5d63f, B-d00873d43f83, B-313eddfd828e

## X-0b3ed411d15b

**닫기** · Button · user-control

- 실제 소스: [src/ui/quick-memos.tsx:233](../../../src/ui/quick-memos.tsx#L233)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R15](../paths/R15.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O23](../paths/O23.md), [O24](../paths/O24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [close · H-1e74ec4c8e19](../handlers/ui__quick-memos.md#h-1e74ec4c8e19) → [flush · H-a435ee3546d6](../handlers/ui__quick-memos.md#h-a435ee3546d6) → [errorMessage · H-3718c8c29801](../handlers/ui__quick-memos.md#h-3718c8c29801) → [@callback:next.memos!.find · H-f1b2dec302cd](../handlers/ui__quick-memos.md#h-f1b2dec302cd) → [persistDraft · H-63df12414426](../handlers/ui__quick-memos.md#h-63df12414426) → [finish · H-74f2c3de5827](../handlers/ui__quick-memos.md#h-74f2c3de5827)

```tsx
close
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-4430ed1f46c1, B-4e9d9f767fca, B-030944f55ed5, B-2f12858534d4, B-26feedd8a0e9, B-6a1a8447de6d, B-3ece803860f5, B-437ea6625285, B-311e29a12c07, B-b6e9eb5361be, B-787e0923ba83, B-8ead7dd4eec8, B-a9d60e5c4c2f, B-720180e1531d, B-a9146fe5d63f, B-d00873d43f83, B-313eddfd828e

## X-0cd14239edac

**작은 메모** · Modal · component-callback-contract

- 실제 소스: [src/ui/quick-memos.tsx:235](../../../src/ui/quick-memos.tsx#L235)
- 연결 표면: [R01](../paths/R01.md), [R06](../paths/R06.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R22](../paths/R22.md), [R34](../paths/R34.md), [O24](../paths/O24.md)
- 직접 표시 조건: falsy: embedded ∧ truthy: true
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 · 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [close · H-1e74ec4c8e19](../handlers/ui__quick-memos.md#h-1e74ec4c8e19) → [flush · H-a435ee3546d6](../handlers/ui__quick-memos.md#h-a435ee3546d6) → [errorMessage · H-3718c8c29801](../handlers/ui__quick-memos.md#h-3718c8c29801) → [@callback:next.memos!.find · H-f1b2dec302cd](../handlers/ui__quick-memos.md#h-f1b2dec302cd) → [persistDraft · H-63df12414426](../handlers/ui__quick-memos.md#h-63df12414426) → [finish · H-74f2c3de5827](../handlers/ui__quick-memos.md#h-74f2c3de5827)

```tsx
close
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-4430ed1f46c1, B-4e9d9f767fca, B-030944f55ed5, B-2f12858534d4, B-26feedd8a0e9, B-6a1a8447de6d, B-3ece803860f5, B-437ea6625285, B-311e29a12c07, B-b6e9eb5361be, B-787e0923ba83, B-8ead7dd4eec8, B-a9d60e5c4c2f, B-720180e1531d, B-a9146fe5d63f, B-d00873d43f83, B-313eddfd828e

