# src/ui/recall-import.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-ef121699fea1

**Anki 파일 가져오기** · summary · user-control

- 실제 소스: [src/ui/recall-import.tsx:72](../../../src/ui/recall-import.tsx#L72)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-92ae8b928c76

**Anki 파일 선택** · Input · user-control

- 실제 소스: [src/ui/recall-import.tsx:74](../../../src/ui/recall-import.tsx#L74)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || busy || !!session.pendingImport
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-04716a4652cf](../handlers/ui__recall-import.md#h-04716a4652cf) → [read · H-0222e141dd5a](../handlers/ui__recall-import.md#h-0222e141dd5a)

```tsx
e => { void read(e.target.files?.[0]); e.target.value = ''; }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d7f6159f88b9, B-5279d67c871e, B-da6c05027502, B-ef0464ffe300, B-522a24bd1519

## X-0be81307c92d

**파일 읽기 취소** · Button · user-control

- 실제 소스: [src/ui/recall-import.tsx:75](../../../src/ui/recall-import.tsx#L75)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: truthy: reading
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-6aabe82fea5e](../handlers/ui__recall-import.md#h-6aabe82fea5e)

```tsx
() => { worker.current?.terminate(); worker.current = null; setReading(false); setNotice('파일 읽기를 취소했습니다.'); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-9fb7600775a6

**가져올 카드의 공부 주제** · Select · user-control

- 실제 소스: [src/ui/recall-import.tsx:76](../../../src/ui/recall-import.tsx#L76)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-9e94bdb522a8](../handlers/ui__recall-import.md#h-9e94bdb522a8) → [change · H-772b293b249a](../handlers/ui__recall-import.md#h-772b293b249a)

```tsx
e => change({ topicId: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c8a9fe7c44e5

**Anki의 덱 이름별로 나누어 가져오기** · Checkbox · user-control

- 실제 소스: [src/ui/recall-import.tsx:77](../../../src/ui/recall-import.tsx#L77)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-a0425567095c](../handlers/ui__recall-import.md#h-a0425567095c) → [change · H-772b293b249a](../handlers/ui__recall-import.md#h-772b293b249a)

```tsx
e => change({ keepDecks: e.target.checked })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-1403122d3370

**가져올 덱** · Select · user-control

- 실제 소스: [src/ui/recall-import.tsx:78](../../../src/ui/recall-import.tsx#L78)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: truthy: !target.keepDecks
- 실행 차단 disabled: disabled || busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-96acf10b5bdc](../handlers/ui__recall-import.md#h-96acf10b5bdc) → [change · H-772b293b249a](../handlers/ui__recall-import.md#h-772b293b249a)

```tsx
e => change({ deckId: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-a71c97fd73c5

**이전에 가져온 뒤 직접 수정하지 않은 카드만 새 원문으로 갱신** · Checkbox · user-control

- 실제 소스: [src/ui/recall-import.tsx:79](../../../src/ui/recall-import.tsx#L79)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-b3efdcc96b11](../handlers/ui__recall-import.md#h-b3efdcc96b11) → [change · H-772b293b249a](../handlers/ui__recall-import.md#h-772b293b249a)

```tsx
e => change({ updateUnedited: e.target.checked })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-301e4b5baee5

**가져오기 전 카드 확인** · summary · user-control

- 실제 소스: [src/ui/recall-import.tsx:82](../../../src/ui/recall-import.tsx#L82)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: truthy: preview
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-2adda5977c24

**답변 확인** · summary · user-control

- 실제 소스: [src/ui/recall-import.tsx:82](../../../src/ui/recall-import.tsx#L82)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: truthy: preview
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(preview.items.slice(0, 10)) · 82행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-c3c0940fc090

**가져올 수 없는 카드 확인** · summary · user-control

- 실제 소스: [src/ui/recall-import.tsx:83](../../../src/ui/recall-import.tsx#L83)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: truthy: preview ∧ truthy: !!preview.skipped.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-fe810a6b2b9c

**표시된 제한을 확인했습니다. 읽을 수 있는 텍스트 카드만 가져옵니다** · Checkbox · user-control

- 실제 소스: [src/ui/recall-import.tsx:85](../../../src/ui/recall-import.tsx#L85)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: truthy: preview ∧ truthy: !!preview.skipped.length || !!preview.warnings.length
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-86be2b5c1780](../handlers/ui__recall-import.md#h-86be2b5c1780)

```tsx
e => setAcknowledged(e.target.checked)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-4b9eb8634abc

**확인한 카드 가져오기** · Button · user-control

- 실제 소스: [src/ui/recall-import.tsx:86](../../../src/ui/recall-import.tsx#L86)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: truthy: preview
- 실행 차단 disabled: disabled || busy || !!session.pendingImport || !preview.items.length || !target.topicId || (!!preview.skipped.length || !!preview.warnings.length) && !acknowledged
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-f006cf323fa6](../handlers/ui__recall-import.md#h-f006cf323fa6) → [start · H-e156ef05b829](../handlers/ui__recall-import.md#h-e156ef05b829) → [commit · H-95eaf0cf988c](../handlers/ui__recall-import.md#h-95eaf0cf988c) → [context · H-fe20d435c58f](../handlers/ui__recall-import.md#h-fe20d435c58f) → [execute · H-0bae3989c822](../handlers/ui__recall-import.md#h-0bae3989c822) → [@callback:recallDecks(snapshot).find · H-f06fcc27f9b5](../handlers/ui__recall-import.md#h-f06fcc27f9b5) → [@callback:preview.items.map · H-3dc5ae21da28](../handlers/ui__recall-import.md#h-3dc5ae21da28)

```tsx
() => { void start(); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-47cf075e18ae, B-ae3b4b71be51, B-cf6012340ed1, B-d4c4968ef7d4, B-33f620617fa5, B-7fe187973acb, B-30f9b1b2551f, B-1b53ab93cf6e, B-f396085bc473, B-1f92e915505b, B-540daad65e31, B-dfd5742fb2e7, B-2b23694547c7, B-f969b051944b, B-3e7171f32be5, B-00aaa66428af

## X-ae5497adb344

**가져오기 중단** · Button · user-control

- 실제 소스: [src/ui/recall-import.tsx:86](../../../src/ui/recall-import.tsx#L86)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: truthy: preview ∧ truthy: busy
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-12379092de0b](../handlers/ui__recall-import.md#h-12379092de0b)

```tsx
() => { stopped.current = true; }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-bf62bc704814

**보존한 가져오기 다시 시도** · Button · user-control

- 실제 소스: [src/ui/recall-import.tsx:87](../../../src/ui/recall-import.tsx#L87)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: truthy: session.pendingImport
- 실행 차단 disabled: disabled || busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-1be1cf93650c](../handlers/ui__recall-import.md#h-1be1cf93650c) → [execute · H-0bae3989c822](../handlers/ui__recall-import.md#h-0bae3989c822)

```tsx
async () => { setBusy(true); try { await execute(session.pendingImport!); setError(''); setNotice('보존한 요청을 처리했습니다. 같은 파일을 다시 선택해 나머지를 이어갈 수 있습니다.'); } catch (e) { setError(e instanceof Error ? e.message : '요청을 저장하지 못했습니다.'); } finally { setBusy(false); } }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-f2f5e9ac14b7, B-7b218263812a, B-faed12308de1, B-f969b051944b, B-3e7171f32be5, B-00aaa66428af

