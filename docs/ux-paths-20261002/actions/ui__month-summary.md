# src/ui/month-summary.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-d9fd7d4d9bcf

**월간 기록 보기** · a · user-control

- 실제 소스: [src/ui/month-summary.tsx:33](../../../src/ui/month-summary.tsx#L33)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [U36](../paths/U36.md), [A04](../paths/A04.md)
- 직접 표시 조건: truthy: compact
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/statistics`. 동적 ID는 현재 항목 값을 사용한다.

**onClick** → [@onClick · H-f00eedd8eb4f](../handlers/ui__month-summary.md#h-f00eedd8eb4f)

```tsx
() => { try { saveStatisticsMonth(data, month); } catch { /* Keep navigation usable. */ } }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-bf0c232e7acd, B-83dc43597706

## X-afb69049d2f3

**이전 달** · Button · user-control

- 실제 소스: [src/ui/month-summary.tsx:34](../../../src/ui/month-summary.tsx#L34)
- 연결 표면: [R02](../paths/R02.md), [O26](../paths/O26.md), [U36](../paths/U36.md), [A04](../paths/A04.md)
- 직접 표시 조건: truthy: !compact
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-757dc29d90f1](../handlers/ui__month-summary.md#h-757dc29d90f1) → [choose · H-a51640c45b0f](../handlers/ui__month-summary.md#h-a51640c45b0f)

```tsx
() => choose(shiftMonth(month, -1))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-558a7dcfca5c, B-cc63a27efe91

## X-02e18a3ca600

**요약할 월** · Input · user-control

- 실제 소스: [src/ui/month-summary.tsx:34](../../../src/ui/month-summary.tsx#L34)
- 연결 표면: [R02](../paths/R02.md), [O26](../paths/O26.md), [U36](../paths/U36.md), [A04](../paths/A04.md)
- 직접 표시 조건: truthy: !compact
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-7b61d4005466](../handlers/ui__month-summary.md#h-7b61d4005466) → [choose · H-a51640c45b0f](../handlers/ui__month-summary.md#h-a51640c45b0f)

```tsx
e => { if (e.target.value) choose(e.target.value); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6be75a9194e7, B-558a7dcfca5c, B-cc63a27efe91

## X-f7442da86637

**다음 달** · Button · user-control

- 실제 소스: [src/ui/month-summary.tsx:34](../../../src/ui/month-summary.tsx#L34)
- 연결 표면: [R02](../paths/R02.md), [O26](../paths/O26.md), [U36](../paths/U36.md), [A04](../paths/A04.md)
- 직접 표시 조건: truthy: !compact
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-7f534600e4e7](../handlers/ui__month-summary.md#h-7f534600e4e7) → [choose · H-a51640c45b0f](../handlers/ui__month-summary.md#h-a51640c45b0f)

```tsx
() => choose(shiftMonth(month, 1))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-558a7dcfca5c, B-cc63a27efe91

## X-62f8d73a9166

**이번 달** · Button · user-control

- 실제 소스: [src/ui/month-summary.tsx:34](../../../src/ui/month-summary.tsx#L34)
- 연결 표면: [R02](../paths/R02.md), [O26](../paths/O26.md), [U36](../paths/U36.md), [A04](../paths/A04.md)
- 직접 표시 조건: truthy: !compact
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d2ddab5570e1](../handlers/ui__month-summary.md#h-d2ddab5570e1) → [choose · H-a51640c45b0f](../handlers/ui__month-summary.md#h-a51640c45b0f)

```tsx
() => choose(currentMonth)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-558a7dcfca5c, B-cc63a27efe91

## X-23c61ba2e529

**`${month} ${shortLabels[m.id]} 원기록 보기`** · button · user-control

- 실제 소스: [src/ui/month-summary.tsx:39](../../../src/ui/month-summary.tsx#L39)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [U36](../paths/U36.md), [A04](../paths/A04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: Boolean(missing)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-7b60c57aa771](../handlers/ui__month-summary.md#h-7b60c57aa771) → [open · H-58da24c3ca84](../handlers/ui__month-summary.md#h-58da24c3ca84)

```tsx
() => open(m)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-3ef4d28b830a, B-a55670dacc19, B-484617f0a7ab

반복: map(metrics.filter(m => !compact || ['sessions', 'coverage'].includes(m.id))) · 36행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-0ff90926a30c

**StatisticsTrend · 조작/부품 영역** · StatisticsTrend · component-callback-contract

- 실제 소스: [src/ui/month-summary.tsx:41](../../../src/ui/month-summary.tsx#L41)
- 연결 표면: [R02](../paths/R02.md), [O26](../paths/O26.md), [U36](../paths/U36.md), [A04](../paths/A04.md)
- 직접 표시 조건: truthy: !compact && !missing
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `period.to`. 동적 ID는 현재 항목 값을 사용한다.

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(metrics.filter(m => !compact || ['sessions', 'coverage'].includes(m.id))) · 36행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

