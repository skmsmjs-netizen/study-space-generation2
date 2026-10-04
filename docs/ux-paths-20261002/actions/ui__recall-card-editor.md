# src/ui/recall-card-editor.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-b45a76c0b623

**질문 카드 만들기·수정** · summary · user-control

- 실제 소스: [src/ui/recall-card-editor.tsx:51](../../../src/ui/recall-card-editor.tsx#L51)
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

## X-0273b0079eb8

**카드 종류** · Select · user-control

- 실제 소스: [src/ui/recall-card-editor.tsx:53](../../../src/ui/recall-card-editor.tsx#L53)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || composition || !!draft?.expectedVersion || !!draft?.clozeCards?.some(c => c.expectedVersion > 0)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-f01ebd1f8a63](../handlers/ui__recall-card-editor.md#h-f01ebd1f8a63) → [change · H-ae6727aee914](../handlers/ui__recall-card-editor.md#h-ae6727aee914)

```tsx
e => change({ kind: e.target.value as 'basic' | 'cloze' })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-2124aa6dc720

## X-d35803755ba1

**카드의 공부 주제** · Select · user-control

- 실제 소스: [src/ui/recall-card-editor.tsx:56](../../../src/ui/recall-card-editor.tsx#L56)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || composition || !!draft?.expectedVersion || !!draft?.clozeCards?.some(c => c.expectedVersion > 0)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-41b275bb6bef](../handlers/ui__recall-card-editor.md#h-41b275bb6bef) → [change · H-ae6727aee914](../handlers/ui__recall-card-editor.md#h-ae6727aee914)

```tsx
e => change({ topicId: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-2124aa6dc720

## X-e1f319a5163a

**카드의 덱** · Select · user-control

- 실제 소스: [src/ui/recall-card-editor.tsx:61](../../../src/ui/recall-card-editor.tsx#L61)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || composition
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-65195878d10e](../handlers/ui__recall-card-editor.md#h-65195878d10e) → [change · H-ae6727aee914](../handlers/ui__recall-card-editor.md#h-ae6727aee914)

```tsx
e => change({ deckId: e.target.value === 'default' ? undefined : e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-2202df11889c, B-2124aa6dc720

## X-12668fd3a8a4

**draft?.kind === 'cloze' ? '빈칸 문장' : '질문 (앞면)'** · Textarea · user-control

- 실제 소스: [src/ui/recall-card-editor.tsx:64](../../../src/ui/recall-card-editor.tsx#L64)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-5d403a71e75f](../handlers/ui__recall-card-editor.md#h-5d403a71e75f) → [change · H-ae6727aee914](../handlers/ui__recall-card-editor.md#h-ae6727aee914)

```tsx
e => change({ front: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-2124aa6dc720

전달 props 경계: inputProps. 전달 내용은 호출 지점이 담당한다.

## X-f0b53191fd2d

**선택한 부분 빈칸으로** · Button · user-control

- 실제 소스: [src/ui/recall-card-editor.tsx:65](../../../src/ui/recall-card-editor.tsx#L65)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: truthy: draft?.kind === 'cloze'
- 실행 차단 disabled: disabled || composition
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-4584a8eaf011](../handlers/ui__recall-card-editor.md#h-4584a8eaf011) → [change · H-ae6727aee914](../handlers/ui__recall-card-editor.md#h-ae6727aee914)

```tsx
() => {
      const start = text.current?.selectionStart ?? 0, end = text.current?.selectionEnd ?? 0;
      if (start === end) { setError('문장에서 가릴 부분을 먼저 선택해 주세요.'); return; }
      const number = Math.max(0, ...numbers) + 1;
      change({ front: `${draft.front.slice(0, start)}{{c${number}::${draft.front.slice(start, end)}}}${draft.front.slice(end)}` }); text.current?.focus(); setError('');
    }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-87099aedbc2b, B-2124aa6dc720

## X-935412a9cfd6

**빈칸 카드 {numbers.length} 개 미리보기** · summary · user-control

- 실제 소스: [src/ui/recall-card-editor.tsx:71](../../../src/ui/recall-card-editor.tsx#L71)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: truthy: draft?.kind === 'cloze' ∧ truthy: numbers.length > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-4b64a427abec

**참고 답변 (뒷면)** · Textarea · user-control

- 실제 소스: [src/ui/recall-card-editor.tsx:73](../../../src/ui/recall-card-editor.tsx#L73)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-99ea7a879fd1](../handlers/ui__recall-card-editor.md#h-99ea7a879fd1) → [change · H-ae6727aee914](../handlers/ui__recall-card-editor.md#h-ae6727aee914)

```tsx
e => change({ reference: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-2124aa6dc720

전달 props 경계: inputProps. 전달 내용은 호출 지점이 담당한다.

## X-9c53d98ee1a6

**질문 수정 저장 질문 카드 등록** · Button · user-control

- 실제 소스: [src/ui/recall-card-editor.tsx:74](../../../src/ui/recall-card-editor.tsx#L74)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || composition || !draft?.front.trim() || !draft.topicId || !!parseError
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [save · H-2a67e79e5ce6](../handlers/ui__recall-card-editor.md#h-2a67e79e5ce6) → [@callback:cards.every · H-72af36c7f632](../handlers/ui__recall-card-editor.md#h-72af36c7f632) → [@callback:cards.some · H-b6eb3c96bbac](../handlers/ui__recall-card-editor.md#h-b6eb3c96bbac)

```tsx
save
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-883e4853af48, B-34c93f5d9d75, B-d843b23a2e61, B-a3f14e2b6ac7, B-6d65502a921d, B-8d877c3311ce, B-c3feb4a53030, B-6acd2ddbbf4b, B-ebd0d2399934, B-565851d5375a, B-07f528dbe548, B-9a6a3d273e40

## X-8a4d192628d7

**새 질문 작성** · Button · user-control

- 실제 소스: [src/ui/recall-card-editor.tsx:75](../../../src/ui/recall-card-editor.tsx#L75)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: truthy: draft
- 실행 차단 disabled: disabled || composition
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-976d330ceb64](../handlers/ui__recall-card-editor.md#h-976d330ceb64) → [change · H-ae6727aee914](../handlers/ui__recall-card-editor.md#h-ae6727aee914)

```tsx
() => change({ id: crypto.randomUUID(), front: '', reference: '', expectedVersion: undefined, clozeCards: undefined })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-2124aa6dc720

## X-3df329e7bb5d

**등록한 질문 {availableCards.length} 개** · summary · user-control

- 실제 소스: [src/ui/recall-card-editor.tsx:77](../../../src/ui/recall-card-editor.tsx#L77)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: truthy: !!availableCards.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-7584a800c0c3

**등록한 질문 찾기** · Input · user-control

- 실제 소스: [src/ui/recall-card-editor.tsx:77](../../../src/ui/recall-card-editor.tsx#L77)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: truthy: !!availableCards.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-b2a03a07d593](../handlers/ui__recall-card-editor.md#h-b2a03a07d593)

```tsx
e => { setSearch(e.target.value); setLimit(20); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-4d81e1298946

**질문 수정** · Button · user-control

- 실제 소스: [src/ui/recall-card-editor.tsx:79](../../../src/ui/recall-card-editor.tsx#L79)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: truthy: !!availableCards.length
- 실행 차단 disabled: disabled || composition
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-88e90bb94db0](../handlers/ui__recall-card-editor.md#h-88e90bb94db0) → [@callback:(data.recallCards ?? []).filter · H-e3d309a19e3a](../handlers/ui__recall-card-editor.md#h-e3d309a19e3a) → [@callback:(data.recallCards ?? []).filter(c => c.cloze?.noteId === card.cloze!.noteId).map · H-9b8c60e3a9f2](../handlers/ui__recall-card-editor.md#h-9b8c60e3a9f2)

```tsx
() => {
        persist({ ...session, registration: { id: card.cloze?.noteId ?? card.id, topicId: card.topicId, front: card.cloze?.source ?? card.front!, reference: card.reference, deckId: card.deckId, ...(card.cloze ? { kind: 'cloze', clozeCards: (data.recallCards ?? []).filter(c => c.cloze?.noteId === card.cloze!.noteId).map(c => ({ id: c.id, number: c.cloze!.number, expectedVersion: c.version })) } : { kind: 'basic', expectedVersion: card.version }) } }); setError(''); setNotice('원문을 편집란에 열었습니다. 저장 전까지 기존 카드와 이력은 유지됩니다.'); text.current?.focus();
      }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-44b3d961ea5d

반복: map(cards.slice(0, limit)) · 79행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-90215c1d590d

**카드 복원 카드 보관** · Button · user-control

- 실제 소스: [src/ui/recall-card-editor.tsx:81](../../../src/ui/recall-card-editor.tsx#L81)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: truthy: !!availableCards.length
- 실행 차단 disabled: disabled || composition
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-30f919a2f40c](../handlers/ui__recall-card-editor.md#h-30f919a2f40c) → [setStatus · H-ffce4080f5a5](../handlers/ui__recall-card-editor.md#h-ffce4080f5a5) → [@callback:snapshot.recallCards!.find · H-29bc96761a9a](../handlers/ui__recall-card-editor.md#h-29bc96761a9a)

```tsx
() => setStatus(card.id, !card.suspended)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-4f1cdb295fd4, B-ce9c0808ab86, B-c404d8cfb6e8

반복: map(cards.slice(0, limit)) · 79행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-6f21b9b3b4fe

**질문 더 보기** · Button · user-control

- 실제 소스: [src/ui/recall-card-editor.tsx:82](../../../src/ui/recall-card-editor.tsx#L82)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: truthy: !!availableCards.length ∧ truthy: cards.length > limit
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-3c6f1de48194](../handlers/ui__recall-card-editor.md#h-3c6f1de48194)

```tsx
() => setLimit(limit + 20)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

