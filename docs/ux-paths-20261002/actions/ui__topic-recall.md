# src/ui/topic-recall.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-bc0a1d1f98b1

**주제 카드 초안을 열지 못했습니다** · ErrorState · component-callback-contract

- 실제 소스: [src/ui/topic-recall.tsx:166](../../../src/ui/topic-recall.tsx#L166)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: truthy: loaded.error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRetry** → [@onRetry · H-cad9129a7224](../handlers/ui__topic-recall.md#h-cad9129a7224) → [@callback:setLoaded · H-c4152205ae95](../handlers/ui__topic-recall.md#h-c4152205ae95) → [message · H-e62855fe4c8d](../handlers/ui__topic-recall.md#h-e62855fe4c8d)

```tsx
() => {
    try { const recovered = readRecall(data); setSession(recovered); setLoaded({ session: recovered, error: '' }); }
    catch (error) { setLoaded(value => ({ ...value, error: message(error) })); }
  }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d2ac98ca6be5, B-43738c13fc32, B-4e8e43cfa0ac

## X-e8fcfbee65fa

**예약 복습** · Button · user-control

- 실제 소스: [src/ui/topic-recall.tsx:175](../../../src/ui/topic-recall.tsx#L175)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-94e57b87716e](../handlers/ui__topic-recall.md#h-94e57b87716e) → [nextSession · H-72ece75840bf](../handlers/ui__topic-recall.md#h-72ece75840bf) → [@callback:[...q.due, ...q.fresh].filter · H-47b73a724b7a](../handlers/ui__topic-recall.md#h-47b73a724b7a) → [persist · H-de2b0abe1581](../handlers/ui__topic-recall.md#h-de2b0abe1581) → [message · H-e62855fe4c8d](../handlers/ui__topic-recall.md#h-e62855fe4c8d)

```tsx
() => { persist(nextSession({ ...session, mode: 'scheduled', currentId: null, seen: [], skipped: [] })); setRevealedId(null); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-3f36141c6514, B-e8ac1d699489, B-b4e96ace8c33, B-917484423b6a, B-4e8e43cfa0ac

## X-3a0a1c4bb5ef

**무작위 연습** · Button · user-control

- 실제 소스: [src/ui/topic-recall.tsx:176](../../../src/ui/topic-recall.tsx#L176)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d28c3103be40](../handlers/ui__topic-recall.md#h-d28c3103be40) → [nextSession · H-72ece75840bf](../handlers/ui__topic-recall.md#h-72ece75840bf) → [@callback:[...q.due, ...q.fresh].filter · H-47b73a724b7a](../handlers/ui__topic-recall.md#h-47b73a724b7a) → [persist · H-de2b0abe1581](../handlers/ui__topic-recall.md#h-de2b0abe1581) → [message · H-e62855fe4c8d](../handlers/ui__topic-recall.md#h-e62855fe4c8d)

```tsx
() => { persist(nextSession({ ...session, mode: 'random', currentId: null, seen: [], skipped: [] })); setRevealedId(null); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-3f36141c6514, B-e8ac1d699489, B-b4e96ace8c33, B-917484423b6a, B-4e8e43cfa0ac

## X-1253952fae6c

**평가 되돌리기 다시 시도 마지막 평가 되돌리기** · Button · user-control

- 실제 소스: [src/ui/topic-recall.tsx:179](../../../src/ui/topic-recall.tsx#L179)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: truthy: session.lastReview
- 실행 차단 disabled: composing || drawing || !!session.pendingReview || !!repository.getCapabilities && !repository.getCapabilities().includes('undoRecallReview')
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [undoReview · H-33af89a5e040](../handlers/ui__topic-recall.md#h-33af89a5e040) → [message · H-e62855fe4c8d](../handlers/ui__topic-recall.md#h-e62855fe4c8d) → [persist · H-de2b0abe1581](../handlers/ui__topic-recall.md#h-de2b0abe1581) → [@callback:session.seen.filter · H-7ec6ddea7de1](../handlers/ui__topic-recall.md#h-7ec6ddea7de1)

```tsx
undoReview
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f5d48c3cad29, B-70436177a961, B-af56632e6f0e, B-57fced00fd62, B-182dd1773ad3, B-4cdec79a0520, B-4e8e43cfa0ac, B-b4e96ace8c33, B-917484423b6a

## X-77d39e02b61b

**되돌리기 취소** · Button · user-control

- 실제 소스: [src/ui/topic-recall.tsx:181](../../../src/ui/topic-recall.tsx#L181)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: truthy: session.lastReview ∧ truthy: session.pendingUndo && !data.appliedOps[session.pendingUndo.opId]
- 실행 차단 disabled: composing || drawing
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 · 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-9256ec50e5de](../handlers/ui__topic-recall.md#h-9256ec50e5de) → [persist · H-de2b0abe1581](../handlers/ui__topic-recall.md#h-de2b0abe1581) → [message · H-e62855fe4c8d](../handlers/ui__topic-recall.md#h-e62855fe4c8d)

```tsx
() => {
        if (!repository.getSnapshot().appliedOps[session.pendingUndo!.opId] && persist({ ...session, pendingUndo: undefined })) setNotice('저장되지 않은 되돌리기를 취소했습니다.');
      }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8cf0f8427d05, B-b4e96ace8c33, B-917484423b6a, B-4e8e43cfa0ac

## X-ec7ce7aebe09

**과목** · Select · user-control

- 실제 소스: [src/ui/topic-recall.tsx:186](../../../src/ui/topic-recall.tsx#L186)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-621a3f3696ae](../handlers/ui__topic-recall.md#h-621a3f3696ae) → [changeRange · H-240b6a916be0](../handlers/ui__topic-recall.md#h-240b6a916be0) → [nextSession · H-72ece75840bf](../handlers/ui__topic-recall.md#h-72ece75840bf) → [@callback:[...q.due, ...q.fresh].filter · H-47b73a724b7a](../handlers/ui__topic-recall.md#h-47b73a724b7a) → [persist · H-de2b0abe1581](../handlers/ui__topic-recall.md#h-de2b0abe1581) → [message · H-e62855fe4c8d](../handlers/ui__topic-recall.md#h-e62855fe4c8d)

```tsx
event => changeRange(event.target.value, 'all')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-9ce4e2b44212, B-432b61f8e8c1, B-3f36141c6514, B-e8ac1d699489, B-b4e96ace8c33, B-917484423b6a, B-4e8e43cfa0ac

## X-855714e861a6

**단원** · Select · user-control

- 실제 소스: [src/ui/topic-recall.tsx:190](../../../src/ui/topic-recall.tsx#L190)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-e9230a1c2951](../handlers/ui__topic-recall.md#h-e9230a1c2951) → [changeRange · H-240b6a916be0](../handlers/ui__topic-recall.md#h-240b6a916be0) → [nextSession · H-72ece75840bf](../handlers/ui__topic-recall.md#h-72ece75840bf) → [@callback:[...q.due, ...q.fresh].filter · H-47b73a724b7a](../handlers/ui__topic-recall.md#h-47b73a724b7a) → [persist · H-de2b0abe1581](../handlers/ui__topic-recall.md#h-de2b0abe1581) → [message · H-e62855fe4c8d](../handlers/ui__topic-recall.md#h-e62855fe4c8d)

```tsx
event => changeRange(session.subjectId, event.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-9ce4e2b44212, B-432b61f8e8c1, B-3f36141c6514, B-e8ac1d699489, B-b4e96ace8c33, B-917484423b6a, B-4e8e43cfa0ac

## X-c8e8b43c5e6a

**RecallDecks · 조작/부품 영역** · RecallDecks · component-callback-contract

- 실제 소스: [src/ui/topic-recall.tsx:195](../../../src/ui/topic-recall.tsx#L195)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: blocked || !schedulingReady
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

**onChange** → [@onChange · H-a827a1d81a65](../handlers/ui__topic-recall.md#h-a827a1d81a65) → [nextSession · H-72ece75840bf](../handlers/ui__topic-recall.md#h-72ece75840bf) → [@callback:[...q.due, ...q.fresh].filter · H-47b73a724b7a](../handlers/ui__topic-recall.md#h-47b73a724b7a) → [persist · H-de2b0abe1581](../handlers/ui__topic-recall.md#h-de2b0abe1581) → [message · H-e62855fe4c8d](../handlers/ui__topic-recall.md#h-e62855fe4c8d)

```tsx
deckId => { persist(nextSession({ ...session, deckId, currentId: null, seen: [], skipped: [] })); setRevealedId(null); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-3f36141c6514, B-e8ac1d699489, B-b4e96ace8c33, B-917484423b6a, B-4e8e43cfa0ac

## X-1f9c3895fcfd

**RecallImport · 조작/부품 영역** · RecallImport · component-callback-contract

- 실제 소스: [src/ui/topic-recall.tsx:196](../../../src/ui/topic-recall.tsx#L196)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: blocked || !!repository.getCapabilities && !repository.getCapabilities().includes('importRecallCards')
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

## X-a7040684465a

**RecallCardEditor · 조작/부품 영역** · RecallCardEditor · component-callback-contract

- 실제 소스: [src/ui/topic-recall.tsx:197](../../../src/ui/topic-recall.tsx#L197)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U26](../paths/U26.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: blocked || !!repository.getCapabilities && !repository.getCapabilities().includes('saveRecallCard')
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

## X-a9d69f8afab5

**MemoInkPad · 조작/부품 영역** · MemoInkPad · component-callback-contract

- 실제 소스: [src/ui/topic-recall.tsx:207](../../../src/ui/topic-recall.tsx#L207)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U29](../paths/U29.md)
- 직접 표시 조건: truthy: topic
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRecognizedText** → [@onRecognizedText · H-37c506a31275](../handlers/ui__topic-recall.md#h-37c506a31275) → [answerId · H-2f18cbb5c607](../handlers/ui__topic-recall.md#h-2f18cbb5c607) → [persist · H-de2b0abe1581](../handlers/ui__topic-recall.md#h-de2b0abe1581) → [message · H-e62855fe4c8d](../handlers/ui__topic-recall.md#h-e62855fe4c8d)

```tsx
text=>{if(topic) persist({...session,drafts:{...session.drafts,[topic.id]:{...draft,memoId:answerId((draft?.body ?? '')+text,draft?.strokes ?? []),body:(draft?.body ?? '')+((draft?.body ?? '') ? '\n':'')+text,strokes:draft?.strokes ?? []}}});}
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-01864c95d139, B-836bbceb96d7, B-8fa387e5ac7b, B-b4e96ace8c33, B-917484423b6a, B-4e8e43cfa0ac

**onWorkspaceSaved** → [@onWorkspaceSaved · H-3f7faa8677f4](../handlers/ui__topic-recall.md#h-3f7faa8677f4)

```tsx
() => onSaved(repository.getSnapshot())
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onChange** → [changeInk · H-9209e5a7c16b](../handlers/ui__topic-recall.md#h-9209e5a7c16b) → [persist · H-de2b0abe1581](../handlers/ui__topic-recall.md#h-de2b0abe1581) → [message · H-e62855fe4c8d](../handlers/ui__topic-recall.md#h-e62855fe4c8d) → [answerId · H-2f18cbb5c607](../handlers/ui__topic-recall.md#h-2f18cbb5c607)

```tsx
changeInk
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-408281988698, B-b4e96ace8c33, B-917484423b6a, B-4e8e43cfa0ac, B-8fa387e5ac7b

**onDrawing** → 네이티브/호출자 동작

```tsx
setDrawing
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-8f44ce37eb43

**글로 쓰기 {draft?.body && <span className="recall-draft-indicator">작성한 글 있음</span>}** · summary · user-control

- 실제 소스: [src/ui/topic-recall.tsx:209](../../../src/ui/topic-recall.tsx#L209)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: truthy: topic
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-f9944389ad97

**글** · Textarea · user-control

- 실제 소스: [src/ui/topic-recall.tsx:210](../../../src/ui/topic-recall.tsx#L210)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: truthy: topic
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onCompositionStart** → [@onCompositionStart · H-5682227cdb09](../handlers/ui__topic-recall.md#h-5682227cdb09)

```tsx
() => { composition.current = true; setComposing(true); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onCompositionEnd** → [@onCompositionEnd · H-611787755a11](../handlers/ui__topic-recall.md#h-611787755a11)

```tsx
() => { composition.current = false; setComposing(false); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onChange** → [@onChange · H-5913e28b87fd](../handlers/ui__topic-recall.md#h-5913e28b87fd) → [persist · H-de2b0abe1581](../handlers/ui__topic-recall.md#h-de2b0abe1581) → [message · H-e62855fe4c8d](../handlers/ui__topic-recall.md#h-e62855fe4c8d) → [answerId · H-2f18cbb5c607](../handlers/ui__topic-recall.md#h-2f18cbb5c607)

```tsx
event => {
            const next = { ...session, drafts: { ...session.drafts, [topic.id]: { ...draft, memoId: answerId(event.target.value, draft?.strokes ?? []), body: event.target.value } } };
            setSession(next); persist(next); setNotice('');
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-b4e96ace8c33, B-917484423b6a, B-4e8e43cfa0ac, B-8fa387e5ac7b

## X-7d42cab34407

**메모만 저장하고 다음 저장하고 다음** · Button · user-control

- 실제 소스: [src/ui/topic-recall.tsx:218](../../../src/ui/topic-recall.tsx#L218)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: truthy: topic
- 실행 차단 disabled: blocked || !hasAnswer
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-e4b0d9f16fe9](../handlers/ui__topic-recall.md#h-e4b0d9f16fe9) → [advance · H-ecfe33cf11c6](../handlers/ui__topic-recall.md#h-ecfe33cf11c6) → [message · H-e62855fe4c8d](../handlers/ui__topic-recall.md#h-e62855fe4c8d) → [nextSession · H-72ece75840bf](../handlers/ui__topic-recall.md#h-72ece75840bf) → [@callback:[...q.due, ...q.fresh].filter · H-47b73a724b7a](../handlers/ui__topic-recall.md#h-47b73a724b7a) → [persist · H-de2b0abe1581](../handlers/ui__topic-recall.md#h-de2b0abe1581)

```tsx
() => advance(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-a5e31430a2d8, B-83102deb6552, B-3b5a00c59412, B-31e0d7415aa2, B-3fec745c782a, B-d5e9ac5570d1, B-dc9574ef3506, B-acc99ff2e7ff, B-da93e9620def, B-ed384bf1685c, B-1fac9cffce15, B-5a6848400ab5, B-4e8e43cfa0ac, B-3f36141c6514, B-e8ac1d699489, B-b4e96ace8c33, B-917484423b6a

## X-259c69f1075f

**건너뛰기** · Button · user-control

- 실제 소스: [src/ui/topic-recall.tsx:219](../../../src/ui/topic-recall.tsx#L219)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: truthy: topic
- 실행 차단 disabled: blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-3b9ba5cd327e](../handlers/ui__topic-recall.md#h-3b9ba5cd327e) → [advance · H-ecfe33cf11c6](../handlers/ui__topic-recall.md#h-ecfe33cf11c6) → [message · H-e62855fe4c8d](../handlers/ui__topic-recall.md#h-e62855fe4c8d) → [nextSession · H-72ece75840bf](../handlers/ui__topic-recall.md#h-72ece75840bf) → [@callback:[...q.due, ...q.fresh].filter · H-47b73a724b7a](../handlers/ui__topic-recall.md#h-47b73a724b7a) → [persist · H-de2b0abe1581](../handlers/ui__topic-recall.md#h-de2b0abe1581)

```tsx
() => advance(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-a5e31430a2d8, B-83102deb6552, B-3b5a00c59412, B-31e0d7415aa2, B-3fec745c782a, B-d5e9ac5570d1, B-dc9574ef3506, B-acc99ff2e7ff, B-da93e9620def, B-ed384bf1685c, B-1fac9cffce15, B-5a6848400ab5, B-4e8e43cfa0ac, B-3f36141c6514, B-e8ac1d699489, B-b4e96ace8c33, B-917484423b6a

## X-544d85c0b0b1

**설명 확인하고 평가** · Button · user-control

- 실제 소스: [src/ui/topic-recall.tsx:223](../../../src/ui/topic-recall.tsx#L223)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: truthy: topic ∧ truthy: scheduled ∧ truthy: revealedId !== topic.id
- 실행 차단 disabled: blocked || !schedulingReady
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-800b6631be7c](../handlers/ui__topic-recall.md#h-800b6631be7c)

```tsx
() => setRevealedId(topic.id)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-3d5133042ef1

**{RECALL_LABELS[rating - 1]} {preview && intervalLabel(preview[rating].card.due, now)}** · Button · user-control

- 실제 소스: [src/ui/topic-recall.tsx:225](../../../src/ui/topic-recall.tsx#L225)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: truthy: topic ∧ truthy: scheduled ∧ falsy: revealedId !== topic.id
- 실행 차단 disabled: blocked || !schedulingReady
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-0a4ac819b257](../handlers/ui__topic-recall.md#h-0a4ac819b257) → [review · H-97abdc3a5da3](../handlers/ui__topic-recall.md#h-97abdc3a5da3) → [message · H-e62855fe4c8d](../handlers/ui__topic-recall.md#h-e62855fe4c8d) → [nextSession · H-72ece75840bf](../handlers/ui__topic-recall.md#h-72ece75840bf) → [@callback:[...q.due, ...q.fresh].filter · H-47b73a724b7a](../handlers/ui__topic-recall.md#h-47b73a724b7a) → [persist · H-de2b0abe1581](../handlers/ui__topic-recall.md#h-de2b0abe1581) → [@callback:saved.recallCards!.find · H-71142b21c5a3](../handlers/ui__topic-recall.md#h-71142b21c5a3)

```tsx
() => review(rating)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f1afeac2e7bb, B-8ae29770b415, B-0c9122c2aae0, B-9bfdf2c7ee77, B-1ea06d4faa28, B-a37930e7543b, B-4e8e43cfa0ac, B-3f36141c6514, B-e8ac1d699489, B-b4e96ace8c33, B-917484423b6a

반복: map(RECALL_GRADES) · 225행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-46e80610bb00

**자기 평가 저장 다시 시도** · Button · user-control

- 실제 소스: [src/ui/topic-recall.tsx:230](../../../src/ui/topic-recall.tsx#L230)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: truthy: topic ∧ truthy: scheduled ∧ truthy: session.pendingReview
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-a7bb1a9bb145](../handlers/ui__topic-recall.md#h-a7bb1a9bb145) → [review · H-97abdc3a5da3](../handlers/ui__topic-recall.md#h-97abdc3a5da3) → [message · H-e62855fe4c8d](../handlers/ui__topic-recall.md#h-e62855fe4c8d) → [nextSession · H-72ece75840bf](../handlers/ui__topic-recall.md#h-72ece75840bf) → [@callback:[...q.due, ...q.fresh].filter · H-47b73a724b7a](../handlers/ui__topic-recall.md#h-47b73a724b7a) → [persist · H-de2b0abe1581](../handlers/ui__topic-recall.md#h-de2b0abe1581) → [@callback:saved.recallCards!.find · H-71142b21c5a3](../handlers/ui__topic-recall.md#h-71142b21c5a3)

```tsx
() => review(session.pendingReview!.rating)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f1afeac2e7bb, B-8ae29770b415, B-0c9122c2aae0, B-9bfdf2c7ee77, B-1ea06d4faa28, B-a37930e7543b, B-4e8e43cfa0ac, B-3f36141c6514, B-e8ac1d699489, B-b4e96ace8c33, B-917484423b6a

## X-a799ec9dc603

**평가 취소하고 초안 유지** · Button · user-control

- 실제 소스: [src/ui/topic-recall.tsx:231](../../../src/ui/topic-recall.tsx#L231)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: truthy: topic ∧ truthy: scheduled ∧ truthy: session.pendingReview ∧ truthy: !data.appliedOps[session.pendingReview.opId]
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-a9a9016c1cf1](../handlers/ui__topic-recall.md#h-a9a9016c1cf1) → [persist · H-de2b0abe1581](../handlers/ui__topic-recall.md#h-de2b0abe1581) → [message · H-e62855fe4c8d](../handlers/ui__topic-recall.md#h-e62855fe4c8d)

```tsx
() => { if (!repository.getSnapshot().appliedOps[session.pendingReview!.opId] && persist({ ...session, pendingReview: undefined })) { setRevealedId(null); setNotice('저장되지 않은 평가를 취소했습니다. 설명 초안은 남아 있습니다.'); } }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-3079f3bee289, B-b4e96ace8c33, B-917484423b6a, B-4e8e43cfa0ac

## X-2d928f3074e0

**Anki 원본 필드** · summary · user-control

- 실제 소스: [src/ui/topic-recall.tsx:234](../../../src/ui/topic-recall.tsx#L234)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: truthy: topic ∧ truthy: card?.importSource
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-0e5f6e2353a3

**카드 내용·날짜** · summary · user-control

- 실제 소스: [src/ui/topic-recall.tsx:235](../../../src/ui/topic-recall.tsx#L235)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: truthy: topic
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e9c35879da17

**참고 설명 입력** · Textarea · user-control

- 실제 소스: [src/ui/topic-recall.tsx:236](../../../src/ui/topic-recall.tsx#L236)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: truthy: topic
- 실행 차단 disabled: drawing || !!session.pendingReview || !!session.pendingUndo || !schedulingReady
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onCompositionStart** → [@onCompositionStart · H-c61f9daea738](../handlers/ui__topic-recall.md#h-c61f9daea738)

```tsx
() => { composition.current = true; setComposing(true); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onCompositionEnd** → [@onCompositionEnd · H-b4f2f61c2d3b](../handlers/ui__topic-recall.md#h-b4f2f61c2d3b)

```tsx
() => { composition.current = false; setComposing(false); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onChange** → [@onChange · H-29ca839ced24](../handlers/ui__topic-recall.md#h-29ca839ced24) → [persist · H-de2b0abe1581](../handlers/ui__topic-recall.md#h-de2b0abe1581) → [message · H-e62855fe4c8d](../handlers/ui__topic-recall.md#h-e62855fe4c8d)

```tsx
e => { const old = session.references?.[topic.id]; const next = { ...session, references: { ...session.references, [topic.id]: { body: e.target.value, cardId: old?.cardId ?? card?.id ?? crypto.randomUUID(), expectedVersion: old?.expectedVersion ?? card?.version ?? 0 } } }; setSession(next); persist(next); }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-b4e96ace8c33, B-917484423b6a, B-4e8e43cfa0ac

## X-e4a765aa6406

**참고 설명 저장** · Button · user-control

- 실제 소스: [src/ui/topic-recall.tsx:239](../../../src/ui/topic-recall.tsx#L239)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: truthy: topic
- 실행 차단 disabled: blocked || !schedulingReady || !session.references?.[topic.id]
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [saveReference · H-5fc904a3f120](../handlers/ui__topic-recall.md#h-5fc904a3f120) → [message · H-e62855fe4c8d](../handlers/ui__topic-recall.md#h-e62855fe4c8d) → [persist · H-de2b0abe1581](../handlers/ui__topic-recall.md#h-de2b0abe1581)

```tsx
saveReference
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-a743253467af, B-1da2e303f78d, B-28eb03cece9e, B-e34aa855be15, B-4d1bc8e9f4e9, B-4e8e43cfa0ac, B-b4e96ace8c33, B-917484423b6a

## X-4ec0721bd74d

**다음 복습 날짜** · Input · user-control

- 실제 소스: [src/ui/topic-recall.tsx:241](../../../src/ui/topic-recall.tsx#L241)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: truthy: topic
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-8e87bf4f626e](../handlers/ui__topic-recall.md#h-8e87bf4f626e)

```tsx
e => setDueDate(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-47123f150352

**날짜 지정** · Button · user-control

- 실제 소스: [src/ui/topic-recall.tsx:241](../../../src/ui/topic-recall.tsx#L241)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: truthy: topic
- 실행 차단 disabled: blocked || !schedulingReady || !dueDate
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [setDue · H-68c9fea6a2dd](../handlers/ui__topic-recall.md#h-68c9fea6a2dd) → [message · H-e62855fe4c8d](../handlers/ui__topic-recall.md#h-e62855fe4c8d) → [nextSession · H-72ece75840bf](../handlers/ui__topic-recall.md#h-72ece75840bf) → [@callback:[...q.due, ...q.fresh].filter · H-47b73a724b7a](../handlers/ui__topic-recall.md#h-47b73a724b7a) → [persist · H-de2b0abe1581](../handlers/ui__topic-recall.md#h-de2b0abe1581)

```tsx
setDue
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-c0c3e01921dd, B-8e8a8ab5c4dd, B-799e7f228e10, B-1d5b7528b550, B-4e8e43cfa0ac, B-3f36141c6514, B-e8ac1d699489, B-b4e96ace8c33, B-917484423b6a

## X-59b44c7af00a

**답변 메모** · a · user-control

- 실제 소스: [src/ui/topic-recall.tsx:243](../../../src/ui/topic-recall.tsx#L243)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: truthy: topic ∧ truthy: !!card?.reviews.length ∧ truthy: row.memoId
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/memos/${row.memoId}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map([...card.reviews].reverse().slice(0, limit)) · 243행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-ac8e9d949bf1

**메모 열기 · {new Date(memo.createdAt).toLocaleString('ko-KR')}** · a · user-control

- 실제 소스: [src/ui/topic-recall.tsx:245](../../../src/ui/topic-recall.tsx#L245)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: truthy: topic ∧ truthy: prior.length > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/memos/${memo.id}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(prior.slice(0, limit)) · 245행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-9f007975b291

**과목 보기** · a · user-control

- 실제 소스: [src/ui/topic-recall.tsx:246](../../../src/ui/topic-recall.tsx#L246)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: falsy: topic
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/subjects`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-95221cbab919

**건너뛴 주제 다시 보기** · Button · user-control

- 실제 소스: [src/ui/topic-recall.tsx:246](../../../src/ui/topic-recall.tsx#L246)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: falsy: topic ∧ truthy: topics.length > 0 && scheduled
- 실행 차단 disabled: blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-7764d600cb10](../handlers/ui__topic-recall.md#h-7764d600cb10) → [nextSession · H-72ece75840bf](../handlers/ui__topic-recall.md#h-72ece75840bf) → [@callback:[...q.due, ...q.fresh].filter · H-47b73a724b7a](../handlers/ui__topic-recall.md#h-47b73a724b7a) → [persist · H-de2b0abe1581](../handlers/ui__topic-recall.md#h-de2b0abe1581) → [message · H-e62855fe4c8d](../handlers/ui__topic-recall.md#h-e62855fe4c8d)

```tsx
() => persist(nextSession({ ...session, currentId: null, seen: [], skipped: [] }))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-3f36141c6514, B-e8ac1d699489, B-b4e96ace8c33, B-917484423b6a, B-4e8e43cfa0ac

## X-6167c81471b9

**초안 저장 다시 시도** · Button · user-control

- 실제 소스: [src/ui/topic-recall.tsx:247](../../../src/ui/topic-recall.tsx#L247)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: truthy: error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-bb3f6e94ecb2](../handlers/ui__topic-recall.md#h-bb3f6e94ecb2) → [persist · H-de2b0abe1581](../handlers/ui__topic-recall.md#h-de2b0abe1581) → [message · H-e62855fe4c8d](../handlers/ui__topic-recall.md#h-e62855fe4c8d)

```tsx
() => persist(session)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-b4e96ace8c33, B-917484423b6a, B-4e8e43cfa0ac

## X-d39e393235d5

**별도 메모로 저장 후 다음** · Button · user-control

- 실제 소스: [src/ui/topic-recall.tsx:247](../../../src/ui/topic-recall.tsx#L247)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: truthy: error ∧ truthy: topic && hasAnswer
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-764f7f1a35f1](../handlers/ui__topic-recall.md#h-764f7f1a35f1) → [advance · H-ecfe33cf11c6](../handlers/ui__topic-recall.md#h-ecfe33cf11c6) → [message · H-e62855fe4c8d](../handlers/ui__topic-recall.md#h-e62855fe4c8d) → [nextSession · H-72ece75840bf](../handlers/ui__topic-recall.md#h-72ece75840bf) → [@callback:[...q.due, ...q.fresh].filter · H-47b73a724b7a](../handlers/ui__topic-recall.md#h-47b73a724b7a) → [persist · H-de2b0abe1581](../handlers/ui__topic-recall.md#h-de2b0abe1581)

```tsx
() => advance(true, true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-a5e31430a2d8, B-83102deb6552, B-3b5a00c59412, B-31e0d7415aa2, B-3fec745c782a, B-d5e9ac5570d1, B-dc9574ef3506, B-acc99ff2e7ff, B-da93e9620def, B-ed384bf1685c, B-1fac9cffce15, B-5a6848400ab5, B-4e8e43cfa0ac, B-3f36141c6514, B-e8ac1d699489, B-b4e96ace8c33, B-917484423b6a

## X-fc39adecb709

**RecallSettings · 조작/부품 영역** · RecallSettings · component-callback-contract

- 실제 소스: [src/ui/topic-recall.tsx:249](../../../src/ui/topic-recall.tsx#L249)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md), [U27](../paths/U27.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: blocked || !schedulingReady
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

## X-ac52d80243dd

**사용 안내** · summary · user-control

- 실제 소스: [src/ui/topic-recall.tsx:250](../../../src/ui/topic-recall.tsx#L250)
- 연결 표면: [R14](../paths/R14.md), [R29](../paths/R29.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

