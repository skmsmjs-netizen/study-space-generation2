# src/ui/performance-evidence.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-d9761020f950

**답안 원문** · summary · user-control

- 실제 소스: [src/ui/performance-evidence.tsx:7](../../../src/ui/performance-evidence.tsx#L7)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U20](../paths/U20.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: e.answer
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-1bd0fc079d7d

**원문 답안 열기** · a · user-control

- 실제 소스: [src/ui/performance-evidence.tsx:7](../../../src/ui/performance-evidence.tsx#L7)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U20](../paths/U20.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: e.source
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `e.source.kind === 'exam-memo' ? `#/memos/${encodeURIComponent(e.source.id)}` : `#/memory-test/result/${encodeURIComponent(e.source.id)}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-b7300c46aaaa

**details · 조작/부품 영역** · details · event-surface

- 실제 소스: [src/ui/performance-evidence.tsx:12](../../../src/ui/performance-evidence.tsx#L12)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U20](../paths/U20.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onToggle** → [@onToggle · H-ad7665046bcf](../handlers/ui__performance-evidence.md#h-ad7665046bcf)

```tsx
e=>setOpened(e.currentTarget.open)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-84ff9aa7025c

**근거 보기** · summary · user-control

- 실제 소스: [src/ui/performance-evidence.tsx:12](../../../src/ui/performance-evidence.tsx#L12)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U20](../paths/U20.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-39ce6939e392

**이전 판정 보기** · Button · user-control

- 실제 소스: [src/ui/performance-evidence.tsx:12](../../../src/ui/performance-evidence.tsx#L12)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U20](../paths/U20.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: opened ∧ truthy: events.some(old=>old.id===e.id && old.revision<e.revision)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-5a02b0685867](../handlers/ui__performance-evidence.md#h-5a02b0685867)

```tsx
()=>setHistory(history===e.id?null:e.id)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f755d470ed90

반복: map(current.slice(0,count)) · 12행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-91880f576565

**이전 결과 더 보기** · Button · user-control

- 실제 소스: [src/ui/performance-evidence.tsx:12](../../../src/ui/performance-evidence.tsx#L12)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [U20](../paths/U20.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: opened ∧ truthy: current.length>count
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-a96fa469e924](../handlers/ui__performance-evidence.md#h-a96fa469e924)

```tsx
()=>setCount(count+20)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

