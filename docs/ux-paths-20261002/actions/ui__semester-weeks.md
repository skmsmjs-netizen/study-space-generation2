# src/ui/semester-weeks.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-4abc593265d5

**SemesterWeeksEditor · 조작/부품 영역** · SemesterWeeksEditor · component-callback-contract

- 실제 소스: [src/ui/semester-weeks.tsx:14](../../../src/ui/semester-weeks.tsx#L14)
- 연결 표면: [R19](../paths/R19.md), [R20](../paths/R20.md), [O25](../paths/O25.md), [U18](../paths/U18.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: data.namespace !== 'demo' && !repository.getCapabilities?.().includes('saveLearningPlan')
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-de240f601613](../handlers/ui__semester-weeks.md#h-de240f601613)

```tsx
next => { validateRecommendations(next, data); onSaved(saveLearningPlan(repository, { ...next, revision: next.revision + 1 }, raw)); return true; }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-b1e256c56fca

**주차 한 번에 만들기** · Button · user-control

- 실제 소스: [src/ui/semester-weeks.tsx:70](../../../src/ui/semester-weeks.tsx#L70)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [O13](../paths/O13.md), [O16](../paths/O16.md), [O17](../paths/O17.md), [O18](../paths/O18.md), [O25](../paths/O25.md), [U18](../paths/U18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || !subjects.length
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ab92d40fbd63](../handlers/ui__semester-weeks.md#h-ab92d40fbd63)

```tsx
() => setOpen(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-dbdd6b6f20e6

**강의 주차 만들기** · Modal · component-callback-contract

- 실제 소스: [src/ui/semester-weeks.tsx:71](../../../src/ui/semester-weeks.tsx#L71)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [O25](../paths/O25.md), [U18](../paths/U18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-b6fcbbf0f55b](../handlers/ui__semester-weeks.md#h-b6fcbbf0f55b)

```tsx
() => setOpen(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c6ac92aa0738

**초안 다시 읽기** · Button · user-control

- 실제 소스: [src/ui/semester-weeks.tsx:74](../../../src/ui/semester-weeks.tsx#L74)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [O25](../paths/O25.md), [U18](../paths/U18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: open ∧ truthy: blocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-6e04cfd2dc9b](../handlers/ui__semester-weeks.md#h-6e04cfd2dc9b) → [initial · H-366c78c54153](../handlers/ui__semester-weeks.md#h-366c78c54153) → [@callback:subjects.find · H-c4bd0a72e902](../handlers/ui__semester-weeks.md#h-c4bd0a72e902)

```tsx
() => { try { const saved = readWeeksDraft(data, scope); raw.current = saved.raw; current.current = saved.draft ?? initial(); setDraft(current.current); setBlocked(false); setError(''); } catch (e) { setError((e as Error).message); } }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7275f0fc5113, B-675f51a5db4b, B-e49d0159cfae

## X-7a8683a33e95

**주차를 만들 과목** · Select · user-control

- 실제 소스: [src/ui/semester-weeks.tsx:75](../../../src/ui/semester-weeks.tsx#L75)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [O25](../paths/O25.md), [U18](../paths/U18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: open ∧ falsy: blocked ∧ truthy: !fixedSubjectId
- 실행 차단 disabled: Boolean(draft.rows.length)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-f6922af7f2a8](../handlers/ui__semester-weeks.md#h-f6922af7f2a8) → [@callback:subjects.find · H-b6d31fcdbbc6](../handlers/ui__semester-weeks.md#h-b6d31fcdbbc6) → [patch · H-f9e7f672b103](../handlers/ui__semester-weeks.md#h-f9e7f672b103)

```tsx
e => patch({ subjectId: e.target.value, name: subjects.find(s => s.id === e.target.value)?.name ?? '', batch: null })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-875e777bd93c, B-962a2d077563

## X-8a13dcf79414

**첫 강의 날짜** · Input · user-control

- 실제 소스: [src/ui/semester-weeks.tsx:77](../../../src/ui/semester-weeks.tsx#L77)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [O25](../paths/O25.md), [U18](../paths/U18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: open ∧ falsy: blocked
- 실행 차단 disabled: Boolean(draft.rows.length)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-68fa40f5deef](../handlers/ui__semester-weeks.md#h-68fa40f5deef) → [patch · H-f9e7f672b103](../handlers/ui__semester-weeks.md#h-f9e7f672b103)

```tsx
e => patch({ start: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-875e777bd93c, B-962a2d077563

## X-c7a12f5d047a

**마지막 주차 기준일** · Input · user-control

- 실제 소스: [src/ui/semester-weeks.tsx:78](../../../src/ui/semester-weeks.tsx#L78)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [O25](../paths/O25.md), [U18](../paths/U18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: open ∧ falsy: blocked
- 실행 차단 disabled: Boolean(draft.rows.length)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-12db0512e002](../handlers/ui__semester-weeks.md#h-12db0512e002) → [patch · H-f9e7f672b103](../handlers/ui__semester-weeks.md#h-f9e7f672b103)

```tsx
e => patch({ end: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-875e777bd93c, B-962a2d077563

## X-e0edaec6675d

**시작 주차** · Input · user-control

- 실제 소스: [src/ui/semester-weeks.tsx:79](../../../src/ui/semester-weeks.tsx#L79)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [O25](../paths/O25.md), [U18](../paths/U18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: open ∧ falsy: blocked
- 실행 차단 disabled: Boolean(draft.rows.length)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-0c70d4ea8725](../handlers/ui__semester-weeks.md#h-0c70d4ea8725) → [patch · H-f9e7f672b103](../handlers/ui__semester-weeks.md#h-f9e7f672b103)

```tsx
e => patch({ firstWeek: Number(e.target.value) })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-875e777bd93c, B-962a2d077563

## X-7bec25bb2945

**주차 이름의 앞부분** · Input · user-control

- 실제 소스: [src/ui/semester-weeks.tsx:81](../../../src/ui/semester-weeks.tsx#L81)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [O25](../paths/O25.md), [U18](../paths/U18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: open ∧ falsy: blocked
- 실행 차단 disabled: Boolean(draft.rows.length)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-4b17252ea8b7](../handlers/ui__semester-weeks.md#h-4b17252ea8b7) → [patch · H-f9e7f672b103](../handlers/ui__semester-weeks.md#h-f9e7f672b103)

```tsx
e => patch({ name: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-875e777bd93c, B-962a2d077563

## X-01934f87f1f7

**주차 미리보기** · Button · user-control

- 실제 소스: [src/ui/semester-weeks.tsx:82](../../../src/ui/semester-weeks.tsx#L82)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [O25](../paths/O25.md), [U18](../paths/U18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: open ∧ falsy: blocked
- 실행 차단 disabled: Boolean(draft.rows.length)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [generate · H-4d9b3c1091af](../handlers/ui__semester-weeks.md#h-4d9b3c1091af) → [patch · H-f9e7f672b103](../handlers/ui__semester-weeks.md#h-f9e7f672b103)

```tsx
generate
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-4a4c8bc233a2, B-004c9cd2a48f, B-85bf68aeb818, B-875e777bd93c, B-962a2d077563

## X-09b799623617

**미리보기 초기화** · Button · user-control

- 실제 소스: [src/ui/semester-weeks.tsx:82](../../../src/ui/semester-weeks.tsx#L82)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [O25](../paths/O25.md), [U18](../paths/U18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: open ∧ falsy: blocked ∧ truthy: Boolean(draft.rows.length)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-bf5a7104d036](../handlers/ui__semester-weeks.md#h-bf5a7104d036) → [patch · H-f9e7f672b103](../handlers/ui__semester-weeks.md#h-f9e7f672b103)

```tsx
() => { patch({ rows: [], generatedStart: '' }); setNotice('미리보기만 비웠습니다. 저장된 주차와 되돌리기 정보는 유지했습니다.'); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-875e777bd93c, B-962a2d077563

## X-52cce4f76e10

**{row.week} 주차 · {row.opensDate} · 제외 {duplicate ? ` · ${duplicate.deletedAt ? '휴지통에 보관됨' : '이미 등록됨'}` : ''}** · summary · user-control

- 실제 소스: [src/ui/semester-weeks.tsx:87](../../../src/ui/semester-weeks.tsx#L87)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [O25](../paths/O25.md), [U18](../paths/U18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: open ∧ falsy: blocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(draft.rows) · 84행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-057c4f3555e8

**`${row.week}주차 휴강·제외`** · Checkbox · user-control

- 실제 소스: [src/ui/semester-weeks.tsx:88](../../../src/ui/semester-weeks.tsx#L88)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [O25](../paths/O25.md), [U18](../paths/U18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: open ∧ falsy: blocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-77911c3649ae](../handlers/ui__semester-weeks.md#h-77911c3649ae) → [edit · H-0dc12553cc01](../handlers/ui__semester-weeks.md#h-0dc12553cc01) → [@callback:current.current.rows.map · H-3571fba613a9](../handlers/ui__semester-weeks.md#h-3571fba613a9) → [patch · H-f9e7f672b103](../handlers/ui__semester-weeks.md#h-f9e7f672b103)

```tsx
e => edit({ excluded: e.target.checked })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-5204e6c10f51, B-875e777bd93c, B-962a2d077563

반복: map(draft.rows) · 84행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-9af76b940dbf

**`${row.week}주차 이름`** · Input · user-control

- 실제 소스: [src/ui/semester-weeks.tsx:89](../../../src/ui/semester-weeks.tsx#L89)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [O25](../paths/O25.md), [U18](../paths/U18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: open ∧ falsy: blocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-80f83f99a2e0](../handlers/ui__semester-weeks.md#h-80f83f99a2e0) → [edit · H-0dc12553cc01](../handlers/ui__semester-weeks.md#h-0dc12553cc01) → [@callback:current.current.rows.map · H-3571fba613a9](../handlers/ui__semester-weeks.md#h-3571fba613a9) → [patch · H-f9e7f672b103](../handlers/ui__semester-weeks.md#h-f9e7f672b103)

```tsx
e => edit({ name: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-5204e6c10f51, B-875e777bd93c, B-962a2d077563

반복: map(draft.rows) · 84행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-f38321c20309

**`${row.week}주차 강의 날짜`** · Input · user-control

- 실제 소스: [src/ui/semester-weeks.tsx:90](../../../src/ui/semester-weeks.tsx#L90)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [O25](../paths/O25.md), [U18](../paths/U18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: open ∧ falsy: blocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-e27609a6be62](../handlers/ui__semester-weeks.md#h-e27609a6be62) → [edit · H-0dc12553cc01](../handlers/ui__semester-weeks.md#h-0dc12553cc01) → [@callback:current.current.rows.map · H-3571fba613a9](../handlers/ui__semester-weeks.md#h-3571fba613a9) → [patch · H-f9e7f672b103](../handlers/ui__semester-weeks.md#h-f9e7f672b103)

```tsx
e => edit({ opensDate: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-5204e6c10f51, B-875e777bd93c, B-962a2d077563

반복: map(draft.rows) · 84행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-83078d96c019

**`${row.week}주차 출석 기한 · 선택`** · Input · user-control

- 실제 소스: [src/ui/semester-weeks.tsx:91](../../../src/ui/semester-weeks.tsx#L91)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [O25](../paths/O25.md), [U18](../paths/U18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: open ∧ falsy: blocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-f4cc52325ecb](../handlers/ui__semester-weeks.md#h-f4cc52325ecb) → [edit · H-0dc12553cc01](../handlers/ui__semester-weeks.md#h-0dc12553cc01) → [@callback:current.current.rows.map · H-3571fba613a9](../handlers/ui__semester-weeks.md#h-3571fba613a9) → [patch · H-f9e7f672b103](../handlers/ui__semester-weeks.md#h-f9e7f672b103)

```tsx
e => edit({ dueDate: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-5204e6c10f51, B-875e777bd93c, B-962a2d077563

반복: map(draft.rows) · 84행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-a1bde553a6f8

**`${row.week}주차 메모 · 선택`** · Textarea · user-control

- 실제 소스: [src/ui/semester-weeks.tsx:92](../../../src/ui/semester-weeks.tsx#L92)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [O25](../paths/O25.md), [U18](../paths/U18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: open ∧ falsy: blocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-1163938a59a9](../handlers/ui__semester-weeks.md#h-1163938a59a9) → [edit · H-0dc12553cc01](../handlers/ui__semester-weeks.md#h-0dc12553cc01) → [@callback:current.current.rows.map · H-3571fba613a9](../handlers/ui__semester-weeks.md#h-3571fba613a9) → [patch · H-f9e7f672b103](../handlers/ui__semester-weeks.md#h-f9e7f672b103)

```tsx
e => edit({ note: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-5204e6c10f51, B-875e777bd93c, B-962a2d077563

반복: map(draft.rows) · 84행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-117c12f9c58d

**{count} 개 주차 등록** · Button · user-control

- 실제 소스: [src/ui/semester-weeks.tsx:96](../../../src/ui/semester-weeks.tsx#L96)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [O25](../paths/O25.md), [U18](../paths/U18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: open ∧ falsy: blocked ∧ truthy: Boolean(draft.rows.length)
- 실행 차단 disabled: disabled || !count
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [save · H-10adf2af67b5](../handlers/ui__semester-weeks.md#h-10adf2af67b5) → [patch · H-f9e7f672b103](../handlers/ui__semester-weeks.md#h-f9e7f672b103) → [@callback:createSemesterWeeks · H-6a94e1536824](../handlers/ui__semester-weeks.md#h-6a94e1536824) → [@callback:subjects.some · H-e3f9908e894d](../handlers/ui__semester-weeks.md#h-e3f9908e894d)

```tsx
save
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7a67bbe779c1, B-fd903839d311, B-7829a3b8b936, B-1c563a68b7ec, B-d54df2a5d158, B-875e777bd93c, B-962a2d077563

## X-409737ef3b7b

**되돌린 주차 복원 이번 주차 생성 되돌리기** · Button · user-control

- 실제 소스: [src/ui/semester-weeks.tsx:97](../../../src/ui/semester-weeks.tsx#L97)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [O25](../paths/O25.md), [U18](../paths/U18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: open ∧ falsy: blocked ∧ truthy: draft.batch
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [reverse · H-98a8087492de](../handlers/ui__semester-weeks.md#h-98a8087492de) → [patch · H-f9e7f672b103](../handlers/ui__semester-weeks.md#h-f9e7f672b103)

```tsx
reverse
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-85da66bb5560, B-afe1b18d177a, B-cbbe5856fed2, B-749983c994d4, B-34d23c29a9bf, B-79b6e6c0719f, B-76744e0e3928, B-875e777bd93c, B-962a2d077563

## X-871f89e1a1ab

**닫고 초안 보관** · Button · user-control

- 실제 소스: [src/ui/semester-weeks.tsx:100](../../../src/ui/semester-weeks.tsx#L100)
- 연결 표면: [R01](../paths/R01.md), [R03](../paths/R03.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [O25](../paths/O25.md), [U18](../paths/U18.md), [U21](../paths/U21.md), [U22](../paths/U22.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d399dae3bb3e](../handlers/ui__semester-weeks.md#h-d399dae3bb3e)

```tsx
() => setOpen(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

