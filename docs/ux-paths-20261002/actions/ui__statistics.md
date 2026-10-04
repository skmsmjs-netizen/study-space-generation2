# src/ui/statistics.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-055f31b75e2b

**통계와 그래프 보기** · a · user-control

- 실제 소스: [src/ui/statistics.tsx:277](../../../src/ui/statistics.tsx#L277)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: truthy: compact
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/statistics`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-234e6e6cb1af

**`${b.lo}${b.lo === b.hi ? '' : `부터 ${b.hi}`} ${b.current.lower}${metric.unit} · 근거 보기`** · g · event-surface

- 실제 소스: [src/ui/statistics.tsx:319](../../../src/ui/statistics.tsx#L319)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-8e6d64131f42](../handlers/ui__statistics.md#h-8e6d64131f42) → [openEvidence · H-9ddddb5d61ac](../handlers/ui__statistics.md#h-9ddddb5d61ac) → [@callback:items.map · H-00622cb5b754](../handlers/ui__statistics.md#h-00622cb5b754)

```tsx
() => openEvidence(`${b.lo}–${b.hi}`, b.current.evidence)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6555de8f87ec

**onKeyDown** → [@onKeyDown · H-5b7432b67bf6](../handlers/ui__statistics.md#h-5b7432b67bf6) → [openEvidence · H-9ddddb5d61ac](../handlers/ui__statistics.md#h-9ddddb5d61ac) → [@callback:items.map · H-00622cb5b754](../handlers/ui__statistics.md#h-00622cb5b754)

```tsx
(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openEvidence(`${b.lo}–${b.hi}`, b.current.evidence);
                  }
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-a461a5b47e4d, B-6555de8f87ec

반복: map(bins) · 314행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-51c40a15e172

**함께 선택할 시작일** · Input · user-control

- 실제 소스: [src/ui/statistics.tsx:397](../../../src/ui/statistics.tsx#L397)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-b14e4105412a](../handlers/ui__statistics.md#h-b14e4105412a)

```tsx
(e) => setSelectionFrom(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e2cda63f172b

**함께 선택할 종료일** · Input · user-control

- 실제 소스: [src/ui/statistics.tsx:403](../../../src/ui/statistics.tsx#L403)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-fde2c446c3b7](../handlers/ui__statistics.md#h-fde2c446c3b7)

```tsx
(e) => setSelectionTo(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-20388db20171

**함께 선택할 과목** · Select · user-control

- 실제 소스: [src/ui/statistics.tsx:409](../../../src/ui/statistics.tsx#L409)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-7193529b4650](../handlers/ui__statistics.md#h-7193529b4650)

```tsx
(e) => setSelectionSubject(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-1ee75ae6eb50

**날짜를 함께 선택** · Button · user-control

- 실제 소스: [src/ui/statistics.tsx:425](../../../src/ui/statistics.tsx#L425)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: !validPeriod(selectionFrom, selectionTo)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-0d67438474ae](../handlers/ui__statistics.md#h-0d67438474ae)

```tsx
() =>
              setSharedSelection({
                owner: selectionOwner,
                label: `${selectionFrom}–${selectionTo} · 정확한 날짜${selectionSubject ? ' · 선택한 과목' : ''}`,
                period: { from: selectionFrom, to: selectionTo },
                subjectId: selectionSubject || undefined,
              })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8b1d10912d94

## X-51b96ea1ef82

**과목을 함께 선택** · Button · user-control

- 실제 소스: [src/ui/statistics.tsx:438](../../../src/ui/statistics.tsx#L438)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: !selectionSubject
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ced497f1f321](../handlers/ui__statistics.md#h-ced497f1f321) → [@callback:data.subjects.find · H-6a85b7c20cb3](../handlers/ui__statistics.md#h-6a85b7c20cb3)

```tsx
() =>
              setSharedSelection({
                owner: selectionOwner,
                label: data.subjects.find((s) => s.id === selectionSubject)?.name || '선택한 과목',
                subjectId: selectionSubject,
              })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-65fd8de8d8c0

**공유 선택 해제** · Button · user-control

- 실제 소스: [src/ui/statistics.tsx:450](../../../src/ui/statistics.tsx#L450)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: !sharedMatch
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-20e3fbbdbe1f](../handlers/ui__statistics.md#h-20e3fbbdbe1f)

```tsx
() => setSharedSelection(null)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-ab9585073e79

**선택한 원기록 보기** · Button · user-control

- 실제 소스: [src/ui/statistics.tsx:460](../../../src/ui/statistics.tsx#L460)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: truthy: sharedMatch
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-fbc8d17cd956](../handlers/ui__statistics.md#h-fbc8d17cd956) → [@callback:metrics.flatMap · H-939bea6645bb](../handlers/ui__statistics.md#h-939bea6645bb) → [openEvidence · H-9ddddb5d61ac](../handlers/ui__statistics.md#h-9ddddb5d61ac) → [@callback:items.map · H-00622cb5b754](../handlers/ui__statistics.md#h-00622cb5b754)

```tsx
() =>
              openEvidence(
                '함께 선택한 원기록',
                metrics.flatMap((m) => statisticBounds(m, from, to).evidence.filter(sharedMatch)),
                '',
              )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6555de8f87ec

## X-a43945058a54

**여러 그래프 한눈에 보기** · Checkbox · user-control

- 실제 소스: [src/ui/statistics.tsx:479](../../../src/ui/statistics.tsx#L479)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-9b2cb1830ecf](../handlers/ui__statistics.md#h-9b2cb1830ecf)

```tsx
(e) => {
            viewTouched.current = true;
            setOverview(e.target.checked);
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c75f12968419

**StatisticsGallery · 조작/부품 영역** · StatisticsGallery · component-callback-contract

- 실제 소스: [src/ui/statistics.tsx:490](../../../src/ui/statistics.tsx#L490)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [U36](../paths/U36.md), [A04](../paths/A04.md)
- 직접 표시 조건: truthy: overview && valid
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChoose** → [chooseChart · H-5a9d5d421253](../handlers/ui__statistics.md#h-5a9d5d421253) → [@callback:chartFamilies.find · H-12cb72d209b0](../handlers/ui__statistics.md#h-12cb72d209b0)

```tsx
chooseChart
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onSelect** → [@onSelect · H-f2d29549316b](../handlers/ui__statistics.md#h-f2d29549316b) → [selectEvidence · H-39599473704c](../handlers/ui__statistics.md#h-39599473704c)

```tsx
(row) => selectEvidence(row.label, row.items)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onOpen** → [@onOpen · H-01ef254dc1d2](../handlers/ui__statistics.md#h-01ef254dc1d2) → [openEvidence · H-9ddddb5d61ac](../handlers/ui__statistics.md#h-9ddddb5d61ac) → [@callback:items.map · H-00622cb5b754](../handlers/ui__statistics.md#h-00622cb5b754)

```tsx
(row) => openEvidence(row.label, row.items, row.unit ?? metric.unit)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6555de8f87ec

## X-17861c649809

**그래프로 볼 통계** · Select · user-control

- 실제 소스: [src/ui/statistics.tsx:510](../../../src/ui/statistics.tsx#L510)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: falsy: !valid
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-5681c683f314](../handlers/ui__statistics.md#h-5681c683f314)

```tsx
(e) => {
                  viewTouched.current = true;
                  setMetric(e.target.value as MetricId);
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-ede9034c578a

**보고 싶은 것** · Select · user-control

- 실제 소스: [src/ui/statistics.tsx:532](../../../src/ui/statistics.tsx#L532)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: falsy: !valid
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-306142e949b5](../handlers/ui__statistics.md#h-306142e949b5) → [chooseFamily · H-9029f5f500f3](../handlers/ui__statistics.md#h-9029f5f500f3) → [@callback:chartFamilies.find · H-6116904bb575](../handlers/ui__statistics.md#h-6116904bb575)

```tsx
(e) => chooseFamily(e.target.value as ChartFamily)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-c12b6c9012bd, B-d725728f714b, B-e11d5209fbb1

## X-10218612c8bb

**그래프 종류** · Select · user-control

- 실제 소스: [src/ui/statistics.tsx:543](../../../src/ui/statistics.tsx#L543)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: falsy: !valid
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-841fa5781f2c](../handlers/ui__statistics.md#h-841fa5781f2c)

```tsx
(e) => {
                  viewTouched.current = true;
                  setKind(e.target.value as ChartKind);
                  setView('graph');
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-5291dbc1dd7c

**함께 볼 지표** · Select · user-control

- 실제 소스: [src/ui/statistics.tsx:561](../../../src/ui/statistics.tsx#L561)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: falsy: !valid ∧ truthy: family === 'relationship' && kind !== 'heatmap'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-c2011633ad55](../handlers/ui__statistics.md#h-c2011633ad55)

```tsx
(e) => {
                    viewTouched.current = true;
                    setSecondMetric(e.target.value as MetricId);
                  }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-830093d7352c

**StatisticsPlot · 조작/부품 영역** · StatisticsPlot · component-callback-contract

- 실제 소스: [src/ui/statistics.tsx:592](../../../src/ui/statistics.tsx#L592)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [U36](../paths/U36.md), [A04](../paths/A04.md)
- 직접 표시 조건: falsy: !valid ∧ falsy: readError && ['attempts', 'successes', 'corrections'].includes(metricId) ∧ truthy: view !== 'list' ∧ falsy: view === 'depth' || kind === 'column'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onOpen** → [@onOpen · H-50c834538ed6](../handlers/ui__statistics.md#h-50c834538ed6) → [openEvidence · H-9ddddb5d61ac](../handlers/ui__statistics.md#h-9ddddb5d61ac) → [@callback:items.map · H-00622cb5b754](../handlers/ui__statistics.md#h-00622cb5b754)

```tsx
(row) => openEvidence(row.label, row.items, row.unit ?? metric.unit)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6555de8f87ec

## X-b6056a8160a0

**ChartValues · 조작/부품 영역** · ChartValues · component-callback-contract

- 실제 소스: [src/ui/statistics.tsx:602](../../../src/ui/statistics.tsx#L602)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: falsy: !valid ∧ falsy: readError && ['attempts', 'successes', 'corrections'].includes(metricId) ∧ falsy: view !== 'list'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSelect** → [@onSelect · H-38ea07730273](../handlers/ui__statistics.md#h-38ea07730273) → [selectEvidence · H-39599473704c](../handlers/ui__statistics.md#h-39599473704c)

```tsx
(row) => selectEvidence(row.label, row.items)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onOpen** → [@onOpen · H-0d62619a5cd4](../handlers/ui__statistics.md#h-0d62619a5cd4) → [openEvidence · H-9ddddb5d61ac](../handlers/ui__statistics.md#h-9ddddb5d61ac) → [@callback:items.map · H-00622cb5b754](../handlers/ui__statistics.md#h-00622cb5b754)

```tsx
(row) => openEvidence(row.label, row.items, row.unit ?? metric.unit)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6555de8f87ec

## X-307b5187a12e

**ChartValues · 조작/부품 영역** · ChartValues · component-callback-contract

- 실제 소스: [src/ui/statistics.tsx:613](../../../src/ui/statistics.tsx#L613)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: falsy: !valid ∧ truthy: view !== 'list' && view !== 'depth' && kind !== 'column'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSelect** → [@onSelect · H-761c32448e04](../handlers/ui__statistics.md#h-761c32448e04) → [selectEvidence · H-39599473704c](../handlers/ui__statistics.md#h-39599473704c)

```tsx
(row) => selectEvidence(row.label, row.items)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onOpen** → [@onOpen · H-aba33c97d7a1](../handlers/ui__statistics.md#h-aba33c97d7a1) → [openEvidence · H-9ddddb5d61ac](../handlers/ui__statistics.md#h-9ddddb5d61ac) → [@callback:items.map · H-00622cb5b754](../handlers/ui__statistics.md#h-00622cb5b754)

```tsx
(row) => openEvidence(row.label, row.items, row.unit ?? metric.unit)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6555de8f87ec

## X-8c894f10df5e

**(SegmentedControl · 동적/도형 조작)** · SegmentedControl · user-control

- 실제 소스: [src/ui/statistics.tsx:630](../../../src/ui/statistics.tsx#L630)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: falsy: !valid
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → 네이티브/호출자 동작

```tsx
setView
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-3f54870bf456

**그래프 확대 원래 크기** · Button · user-control

- 실제 소스: [src/ui/statistics.tsx:639](../../../src/ui/statistics.tsx#L639)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: falsy: !valid
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-f5b17a5fe3ad](../handlers/ui__statistics.md#h-f5b17a5fe3ad) → [@callback:setZoom · H-98dc23729af3](../handlers/ui__statistics.md#h-98dc23729af3)

```tsx
() => setZoom((z) => (z === 1 ? 2 : 1))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-74cab1d53b26

## X-5fae700a5d77

**전체 근거 보기** · Button · user-control

- 실제 소스: [src/ui/statistics.tsx:642](../../../src/ui/statistics.tsx#L642)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: falsy: !valid
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-82647ffae6c0](../handlers/ui__statistics.md#h-82647ffae6c0) → [openEvidence · H-9ddddb5d61ac](../handlers/ui__statistics.md#h-9ddddb5d61ac) → [@callback:items.map · H-00622cb5b754](../handlers/ui__statistics.md#h-00622cb5b754)

```tsx
() =>
                  openEvidence(
                    `${from}–${to} · 전체 근거`,
                    statisticBounds(metric, from, to).evidence,
                  )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6555de8f87ec

## X-a564e91c2e0d

**재생 멈추기 시간순 재생** · Button · user-control

- 실제 소스: [src/ui/statistics.tsx:655](../../../src/ui/statistics.tsx#L655)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: falsy: !valid
- 실행 차단 disabled: reduceMotion || !bins.length
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-3e840b9cc8eb](../handlers/ui__statistics.md#h-3e840b9cc8eb) → [chooseFamily · H-9029f5f500f3](../handlers/ui__statistics.md#h-9029f5f500f3) → [@callback:chartFamilies.find · H-6116904bb575](../handlers/ui__statistics.md#h-6116904bb575)

```tsx
() => {
                  if (playing) setPlaying(false);
                  else {
                    if (family !== 'trend') chooseFamily('trend');
                    if (view === 'list') setView('graph');
                    setCursor(-1);
                    setPlaying(true);
                  }
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-1fdfa75e14c1, B-bc0a066bcba8, B-04a0136ccaa8, B-c12b6c9012bd, B-d725728f714b, B-e11d5209fbb1

## X-96faf500edff

**다음 구간** · Button · user-control

- 실제 소스: [src/ui/statistics.tsx:669](../../../src/ui/statistics.tsx#L669)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: falsy: !valid
- 실행 차단 disabled: !bins.length
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-6060d1773872](../handlers/ui__statistics.md#h-6060d1773872) → [@callback:setCursor · H-74439a89687b](../handlers/ui__statistics.md#h-74439a89687b) → [chooseFamily · H-9029f5f500f3](../handlers/ui__statistics.md#h-9029f5f500f3) → [@callback:chartFamilies.find · H-6116904bb575](../handlers/ui__statistics.md#h-6116904bb575)

```tsx
() => {
                  setPlaying(false);
                  if (family !== 'trend') chooseFamily('trend');
                  if (view === 'list') setView('graph');
                  setCursor((i) => Math.min(bins.length - 1, (i ?? -1) + 1));
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-329b43a310dd, B-e6c1a46d49a5, B-c12b6c9012bd, B-d725728f714b, B-e11d5209fbb1

## X-a28b5b094def

**전체 구간** · Button · user-control

- 실제 소스: [src/ui/statistics.tsx:681](../../../src/ui/statistics.tsx#L681)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: falsy: !valid
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-a7cbbe2e9a10](../handlers/ui__statistics.md#h-a7cbbe2e9a10)

```tsx
() => {
                  setPlaying(false);
                  setCursor(null);
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-53c4c7cb6c77

**계산 기준과 미확정 기록** · summary · user-control

- 실제 소스: [src/ui/statistics.tsx:709](../../../src/ui/statistics.tsx#L709)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: falsy: !valid
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-2d6c48374467

**{m.label} 확인 불가 {format(b.lower, b.upper)} {` / ${m.denominator}`} {m.unit} {` · 날짜 미정 ${b.undated}건 별도`} {compare && <small>이전 기간 {format(prev.lower, prev.upper)}</small>}** · button · user-control

- 실제 소스: [src/ui/statistics.tsx:733](../../../src/ui/statistics.tsx#L733)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: falsy: !valid
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c5f24229ed73](../handlers/ui__statistics.md#h-c5f24229ed73)

```tsx
() => {
                    viewTouched.current = true;
                    setMetric(m.id);
                  }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(metrics) · 727행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-cd24db943510

**통계 시작일** · Input · user-control

- 실제 소스: [src/ui/statistics.tsx:760](../../../src/ui/statistics.tsx#L760)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-e17baf909402](../handlers/ui__statistics.md#h-e17baf909402)

```tsx
(e) => setFrom(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-a157be035cdf

**통계 종료일** · Input · user-control

- 실제 소스: [src/ui/statistics.tsx:766](../../../src/ui/statistics.tsx#L766)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-8bbcaf313479](../handlers/ui__statistics.md#h-8bbcaf313479)

```tsx
(e) => setTo(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-563c5cf7d88d

**통계 과목** · Select · user-control

- 실제 소스: [src/ui/statistics.tsx:767](../../../src/ui/statistics.tsx#L767)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-f8327d4f032c](../handlers/ui__statistics.md#h-f8327d4f032c)

```tsx
(e) => {
            setSubject(e.target.value);
            setNode('');
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-0c02953de5e5

**통계 단원·주제** · Select · user-control

- 실제 소스: [src/ui/statistics.tsx:784](../../../src/ui/statistics.tsx#L784)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-5195ed880e4f](../handlers/ui__statistics.md#h-5195ed880e4f)

```tsx
(e) => setNode(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-7666585b0cf2

**최근 {n} 일** · Button · user-control

- 실제 소스: [src/ui/statistics.tsx:802](../../../src/ui/statistics.tsx#L802)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-611d7f47e516](../handlers/ui__statistics.md#h-611d7f47e516)

```tsx
() => {
              setFrom(shiftDay(today, 1 - n));
              setTo(today);
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map([7, 14, 30]) · 801행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-158fc6614a53

**같은 길이의 이전 기간과 비교** · Checkbox · user-control

- 실제 소스: [src/ui/statistics.tsx:813](../../../src/ui/statistics.tsx#L813)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-ad87e5999381](../handlers/ui__statistics.md#h-ad87e5999381)

```tsx
(e) => setCompare(e.target.checked)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-0dec5b969116

**MonthSummary · 조작/부품 영역** · MonthSummary · component-callback-contract

- 실제 소스: [src/ui/statistics.tsx:819](../../../src/ui/statistics.tsx#L819)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [U36](../paths/U36.md), [A04](../paths/A04.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onOpen** → [@onOpen · H-bb0c921df2a6](../handlers/ui__statistics.md#h-bb0c921df2a6) → [openEvidence · H-9ddddb5d61ac](../handlers/ui__statistics.md#h-9ddddb5d61ac) → [@callback:items.map · H-00622cb5b754](../handlers/ui__statistics.md#h-00622cb5b754)

```tsx
(month, id, items, unit) => {
          const period = calendarMonth(month);
          setFrom(period.from);
          setTo(period.to);
          setMetric(id);
          openEvidence(`${month} · 월간 원기록`, items, unit);
        }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6555de8f87ec

## X-574fdc34a942

**통계의 원기록** · Modal · component-callback-contract

- 실제 소스: [src/ui/statistics.tsx:834](../../../src/ui/statistics.tsx#L834)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: truthy: Boolean(selection)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-f43075e6ff92](../handlers/ui__statistics.md#h-f43075e6ff92)

```tsx
() => {
          setFrozen(null);
          setSelected(null);
        }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-f5faef7caefe

**이 원기록들을 함께 선택** · Button · user-control

- 실제 소스: [src/ui/statistics.tsx:845](../../../src/ui/statistics.tsx#L845)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: truthy: Boolean(selection) ∧ truthy: selection
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-4086a0512d01](../handlers/ui__statistics.md#h-4086a0512d01) → [selectEvidence · H-39599473704c](../handlers/ui__statistics.md#h-39599473704c)

```tsx
() => selectEvidence(selection.label, selection.items)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-6f9627663ffa

**고정 풀기 이 근거 고정하기** · Button · user-control

- 실제 소스: [src/ui/statistics.tsx:851](../../../src/ui/statistics.tsx#L851)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: truthy: Boolean(selection) ∧ truthy: selection
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-995de8304692](../handlers/ui__statistics.md#h-995de8304692)

```tsx
() =>
                setFrozen(
                  frozen
                    ? null
                    : structuredClone({ ...selection, source: data, events: workspace.events }),
                )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7013053525fd

## X-5bf3a0fba102

**이 원기록 함께 선택** · Button · user-control

- 실제 소스: [src/ui/statistics.tsx:876](../../../src/ui/statistics.tsx#L876)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-5fbd83595538](../handlers/ui__statistics.md#h-5fbd83595538) → [selectEvidence · H-39599473704c](../handlers/ui__statistics.md#h-39599473704c)

```tsx
() => selectEvidence(i.label, [i])
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(selection.items) · 871행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-191a25d63587

**주제에서 원기록 열기** · a · user-control

- 실제 소스: [src/ui/statistics.tsx:900](../../../src/ui/statistics.tsx#L900)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length ∧ truthy: r
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/node/${encodeURIComponent(r.targetId)}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(i.recordIds) · 894행; map(selection.items) · 871행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-b5e9bdc16755

**다음 공부에서 결과 열기** · a · user-control

- 실제 소스: [src/ui/statistics.tsx:923](../../../src/ui/statistics.tsx#L923)
- 연결 표면: [R01](../paths/R01.md), [R02](../paths/R02.md), [O26](../paths/O26.md), [A04](../paths/A04.md)
- 직접 표시 조건: truthy: Boolean(selection) ∧ truthy: selection ∧ truthy: selection.items.length ∧ truthy: e
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(i.eventIds) · 907행; map(selection.items) · 871행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

