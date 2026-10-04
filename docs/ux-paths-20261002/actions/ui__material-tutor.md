# src/ui/material-tutor.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-4ae7a03e6c4c

**details · 조작/부품 영역** · details · event-surface

- 실제 소스: [src/ui/material-tutor.tsx:11](../../../src/ui/material-tutor.tsx#L11)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onToggle** → [@onToggle · H-ac44002c4651](../handlers/ui__material-tutor.md#h-ac44002c4651)

```tsx
event => { if (event.currentTarget.open) onHelp(); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-2488e637d3b9

## X-2c91102e1e02

**보관한 질문·답변 · {turns.length} 개** · summary · user-control

- 실제 소스: [src/ui/material-tutor.tsx:11](../../../src/ui/material-tutor.tsx#L11)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-5c80cf33e5a0

**{turn.segments.find(s => s.id === id)?.label ?? id} 원문** · Button · user-control

- 실제 소스: [src/ui/material-tutor.tsx:12](../../../src/ui/material-tutor.tsx#L12)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-90597c6e4835](../handlers/ui__material-tutor.md#h-90597c6e4835)

```tsx
() => onEvidence(turn.id, id)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(answer.sourceIds) · 12행; map(occurrenceRows(turn.summary, answer => JSON.stringify(answer))) · 12행; map(turns) · 12행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

