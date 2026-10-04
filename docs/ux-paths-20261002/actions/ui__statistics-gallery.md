# src/ui/statistics-gallery.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-1adb43f9336b

**details · 조작/부품 영역** · details · event-surface

- 실제 소스: [src/ui/statistics-gallery.tsx:33](../../../src/ui/statistics-gallery.tsx#L33)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [U36](../paths/U36.md), [A04](../paths/A04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onToggle** → [@onToggle · H-1748d166fb13](../handlers/ui__statistics-gallery.md#h-1748d166fb13)

```tsx
(event) => setOpened(event.currentTarget.open)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-abd262d4f20f

**그래프의 값과 원기록 · {figure.rows.length} 개** · summary · user-control

- 실제 소스: [src/ui/statistics-gallery.tsx:38](../../../src/ui/statistics-gallery.tsx#L38)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [U36](../paths/U36.md), [A04](../paths/A04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-dab557d1c66c

**기록 보기** · Button · user-control

- 실제 소스: [src/ui/statistics-gallery.tsx:67](../../../src/ui/statistics-gallery.tsx#L67)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [U36](../paths/U36.md), [A04](../paths/A04.md)
- 직접 표시 조건: truthy: opened || expanded
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-39978de30b4c](../handlers/ui__statistics-gallery.md#h-39978de30b4c)

```tsx
() => onOpen(row)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(figure.rows.slice(0, all ? undefined : 20)) · 52행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-07acc6787af7

**함께 선택** · Button · user-control

- 실제 소스: [src/ui/statistics-gallery.tsx:71](../../../src/ui/statistics-gallery.tsx#L71)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [U36](../paths/U36.md), [A04](../paths/A04.md)
- 직접 표시 조건: truthy: opened || expanded ∧ truthy: onSelect
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-06f353d6a79c](../handlers/ui__statistics-gallery.md#h-06f353d6a79c)

```tsx
() => onSelect(row)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(figure.rows.slice(0, all ? undefined : 20)) · 52행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-7588bf88306a

**앞 20개만 보기 {`${figure.rows.length}개 값 모두 보기`}** · Button · user-control

- 실제 소스: [src/ui/statistics-gallery.tsx:87](../../../src/ui/statistics-gallery.tsx#L87)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [U36](../paths/U36.md), [A04](../paths/A04.md)
- 직접 표시 조건: truthy: (opened || expanded) && figure.rows.length > 20
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-198d38fb8611](../handlers/ui__statistics-gallery.md#h-198d38fb8611) → [@callback:setAll · H-bce4424318db](../handlers/ui__statistics-gallery.md#h-bce4424318db)

```tsx
() => setAll((value) => !value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-9399b4c64aac

**StatisticsPlot · 조작/부품 영역** · StatisticsPlot · component-callback-contract

- 실제 소스: [src/ui/statistics-gallery.tsx:170](../../../src/ui/statistics-gallery.tsx#L170)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [U36](../paths/U36.md), [A04](../paths/A04.md)
- 직접 표시 조건: truthy: context.metrics.length && context.data
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onOpen** → 네이티브/호출자 동작

```tsx
onOpen
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(overview) · 157행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-234893530268

**이 그래프 자세히 보기** · Button · user-control

- 실제 소스: [src/ui/statistics-gallery.tsx:177](../../../src/ui/statistics-gallery.tsx#L177)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [U36](../paths/U36.md), [A04](../paths/A04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-0e1d7cfdcaef](../handlers/ui__statistics-gallery.md#h-0e1d7cfdcaef)

```tsx
() => onChoose(item.kind, item.metric)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(overview) · 157행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-5b78bbb3d1e7

**ChartValues · 조작/부품 영역** · ChartValues · component-callback-contract

- 실제 소스: [src/ui/statistics-gallery.tsx:193](../../../src/ui/statistics-gallery.tsx#L193)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [U36](../paths/U36.md), [A04](../paths/A04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onOpen** → 네이티브/호출자 동작

```tsx
onOpen
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onSelect** → 네이티브/호출자 동작

```tsx
onSelect
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(overview) · 157행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

