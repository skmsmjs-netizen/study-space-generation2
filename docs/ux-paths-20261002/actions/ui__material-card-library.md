# src/ui/material-card-library.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-f2bbbbc2c7cf

**자료 카드 찾기** · Input · user-control

- 실제 소스: [src/ui/material-card-library.tsx:75](../../../src/ui/material-card-library.tsx#L75)
- 연결 표면: [R12](../paths/R12.md), [U25](../paths/U25.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-d4c3323a4c15](../handlers/ui__material-card-library.md#h-d4c3323a4c15)

```tsx
(e) => {
          setQuery(e.target.value);
          setPage(0);
        }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-212cccc41a50

**자료 카드 검색어 지우기** · Button · user-control

- 실제 소스: [src/ui/material-card-library.tsx:93](../../../src/ui/material-card-library.tsx#L93)
- 연결 표면: [R12](../paths/R12.md), [U25](../paths/U25.md)
- 직접 표시 조건: truthy: !filtered.length ∧ truthy: query
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-6d1396283c11](../handlers/ui__material-card-library.md#h-6d1396283c11)

```tsx
() => {
                setQuery('');
                setPage(0);
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-f807bdbee1a7

**강의 자료 열기** · a · user-control

- 실제 소스: [src/ui/material-card-library.tsx:102](../../../src/ui/material-card-library.tsx#L102)
- 연결 표면: [R12](../paths/R12.md), [U25](../paths/U25.md)
- 직접 표시 조건: truthy: !filtered.length ∧ truthy: !entries.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/materials`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-b19b8dc4bfb5

**(Button · 동적/도형 조작)** · Button · user-control

- 실제 소스: [src/ui/material-card-library.tsx:110](../../../src/ui/material-card-library.tsx#L110)
- 연결 표면: [R12](../paths/R12.md), [U25](../paths/U25.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-1d93f43346c2](../handlers/ui__material-card-library.md#h-1d93f43346c2)

```tsx
() => setOpened(opened === id ? null : id)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-70bcce3d0f45

반복: map(filtered.slice(current * 20, current * 20 + 20)) · 105행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-2ef5e4f8eb46

**원문 확인** · summary · user-control

- 실제 소스: [src/ui/material-card-library.tsx:121](../../../src/ui/material-card-library.tsx#L121)
- 연결 표면: [R12](../paths/R12.md), [U25](../paths/U25.md)
- 직접 표시 조건: truthy: opened === id
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(filtered.slice(current * 20, current * 20 + 20)) · 105행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-30da6626f53c

**UseMaterialCard · 조작/부품 영역** · UseMaterialCard · component-callback-contract

- 실제 소스: [src/ui/material-card-library.tsx:136](../../../src/ui/material-card-library.tsx#L136)
- 연결 표면: [R12](../paths/R12.md), [U25](../paths/U25.md)
- 직접 표시 조건: truthy: opened === id
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → 네이티브/호출자 동작

```tsx
onSaved
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(filtered.slice(current * 20, current * 20 + 20)) · 105행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-2c76fe10b57c

**이전 자료 카드** · Button · user-control

- 실제 소스: [src/ui/material-card-library.tsx:151](../../../src/ui/material-card-library.tsx#L151)
- 연결 표면: [R12](../paths/R12.md), [U25](../paths/U25.md)
- 직접 표시 조건: truthy: pages > 1
- 실행 차단 disabled: current === 0
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d8dbec72a362](../handlers/ui__material-card-library.md#h-d8dbec72a362)

```tsx
() => setPage(current - 1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-13d5b5224943

**다음 자료 카드** · Button · user-control

- 실제 소스: [src/ui/material-card-library.tsx:157](../../../src/ui/material-card-library.tsx#L157)
- 연결 표면: [R12](../paths/R12.md), [U25](../paths/U25.md)
- 직접 표시 조건: truthy: pages > 1
- 실행 차단 disabled: current === pages - 1
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-faf9d10ca2da](../handlers/ui__material-card-library.md#h-faf9d10ca2da)

```tsx
() => setPage(current + 1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-cf066e7a386a

**등록할 때 확인한 원자료** · summary · user-control

- 실제 소스: [src/ui/material-card-library.tsx:178](../../../src/ui/material-card-library.tsx#L178)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

