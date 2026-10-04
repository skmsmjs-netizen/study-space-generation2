# src/ui/workspace-search.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-a7add5dcf7f1

**과목·목차·기록 검색** · Search · component-callback-contract

- 실제 소스: [src/ui/workspace-search.tsx:166](../../../src/ui/workspace-search.tsx#L166)
- 연결 표면: [R18](../paths/R18.md), [A03](../paths/A03.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-7e88b8f09f97](../handlers/ui__workspace-search.md#h-7e88b8f09f97)

```tsx
(event) => {
          inputMeasure.current = beginUiMeasure('input-paint');
          setInput(event.target.value);
        }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onQueryChange** → [change · H-d2330e3562e3](../handlers/ui__workspace-search.md#h-d2330e3562e3)

```tsx
change
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-43675dc1667c

**검색 자료 종류** · Select · user-control

- 실제 소스: [src/ui/workspace-search.tsx:181](../../../src/ui/workspace-search.tsx#L181)
- 연결 표면: [R18](../paths/R18.md), [A03](../paths/A03.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-b5f9cbd30b1e](../handlers/ui__workspace-search.md#h-b5f9cbd30b1e)

```tsx
(event) => {
            setKind(event.target.value);
            setLimit(40);
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-80a01cebeaab

**검색 순서** · Select · user-control

- 실제 소스: [src/ui/workspace-search.tsx:199](../../../src/ui/workspace-search.tsx#L199)
- 연결 표면: [R18](../paths/R18.md), [A03](../paths/A03.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-a323c97a2412](../handlers/ui__workspace-search.md#h-a323c97a2412)

```tsx
(event) => setOrder(event.target.value as SearchOrder)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-635ac9a5cbc9

**일정·코드 연결의 검색 정보를 읽지 못했습니다** · ErrorState · component-callback-contract

- 실제 소스: [src/ui/workspace-search.tsx:215](../../../src/ui/workspace-search.tsx#L215)
- 연결 표면: [R18](../paths/R18.md), [A03](../paths/A03.md)
- 직접 표시 조건: truthy: projection.error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRetry** → [@onRetry · H-89128268c604](../handlers/ui__workspace-search.md#h-89128268c604) → [@callback:setAttempt · H-5feec065160f](../handlers/ui__workspace-search.md#h-5feec065160f)

```tsx
() => setAttempt((value) => value + 1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-65a0f501177a

**검색 결과를 표시하지 못했습니다** · ErrorState · component-callback-contract

- 실제 소스: [src/ui/workspace-search.tsx:222](../../../src/ui/workspace-search.tsx#L222)
- 연결 표면: [R18](../paths/R18.md), [A03](../paths/A03.md)
- 직접 표시 조건: truthy: searchError
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRetry** → [@onRetry · H-3e57f3c439aa](../handlers/ui__workspace-search.md#h-3e57f3c439aa) → [@callback:setAttempt · H-0a3eb8dedb58](../handlers/ui__workspace-search.md#h-0a3eb8dedb58)

```tsx
() => setAttempt((value) => value + 1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-2937be3879f3

**검색어 지우기** · Button · user-control

- 실제 소스: [src/ui/workspace-search.tsx:229](../../../src/ui/workspace-search.tsx#L229)
- 연결 표면: [R18](../paths/R18.md), [A03](../paths/A03.md)
- 직접 표시 조건: truthy: query
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-dd5d2d526855](../handlers/ui__workspace-search.md#h-dd5d2d526855) → [change · H-d2330e3562e3](../handlers/ui__workspace-search.md#h-d2330e3562e3)

```tsx
() => change('')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-29cd3c711014

**{entry.title}** · a · user-control

- 실제 소스: [src/ui/workspace-search.tsx:240](../../../src/ui/workspace-search.tsx#L240)
- 연결 표면: [R18](../paths/R18.md), [A03](../paths/A03.md)
- 직접 표시 조건: truthy: query.trim()
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `entry.href`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(result.hits) · 238행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-5d8b1de63b37

**모든 종류에서 찾기** · Button · user-control

- 실제 소스: [src/ui/workspace-search.tsx:258](../../../src/ui/workspace-search.tsx#L258)
- 연결 표면: [R18](../paths/R18.md), [A03](../paths/A03.md)
- 직접 표시 조건: truthy: query.trim() ∧ truthy: !waiting && !searchError && !result.total ∧ truthy: kind !== 'all'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-3fb8c05be961](../handlers/ui__workspace-search.md#h-3fb8c05be961)

```tsx
() => setKind('all')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-90d157f43a82

**모든 공부에서 찾기** · Button · user-control

- 실제 소스: [src/ui/workspace-search.tsx:259](../../../src/ui/workspace-search.tsx#L259)
- 연결 표면: [R18](../paths/R18.md), [A03](../paths/A03.md)
- 직접 표시 조건: truthy: query.trim() ∧ truthy: !waiting && !searchError && !result.total ∧ truthy: !allScopes
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → 네이티브/호출자 동작

```tsx
onAllScopes
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-4ba37e7105cb

**검색 결과 더 보기** · Button · user-control

- 실제 소스: [src/ui/workspace-search.tsx:263](../../../src/ui/workspace-search.tsx#L263)
- 연결 표면: [R18](../paths/R18.md), [A03](../paths/A03.md)
- 직접 표시 조건: truthy: query.trim() ∧ truthy: result.total > Math.max(40, limit)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-e3706c7243fa](../handlers/ui__workspace-search.md#h-e3706c7243fa) → [@callback:setLimit · H-3dbacce4469c](../handlers/ui__workspace-search.md#h-3dbacce4469c)

```tsx
() => setLimit((value) => Math.max(40, value) + 40)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

