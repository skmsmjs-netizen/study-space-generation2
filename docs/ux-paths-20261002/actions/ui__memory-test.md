# src/ui/memory-test.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-719f522f8bdc

**암기시험** · section · event-surface

- 실제 소스: [src/ui/memory-test.tsx:239](../../../src/ui/memory-test.tsx#L239)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onCompositionStart** → [@onCompositionStart · H-51bf71f968e6](../handlers/ui__memory-test.md#h-51bf71f968e6)

```tsx
() => setComposing(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onCompositionEnd** → [@onCompositionEnd · H-7261d38c19f6](../handlers/ui__memory-test.md#h-7261d38c19f6)

```tsx
() => setComposing(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-846cdbe6e9a0

**초안 저장 다시 시도** · Button · user-control

- 실제 소스: [src/ui/memory-test.tsx:250](../../../src/ui/memory-test.tsx#L250)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: error ∧ truthy: !blocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-fb3929c1cd3f](../handlers/ui__memory-test.md#h-fb3929c1cd3f) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6)

```tsx
() => persist(current.current)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5, B-4c69e8135155

## X-cbee4c49cc8a

**현재 초안 파일로 보관** · Button · user-control

- 실제 소스: [src/ui/memory-test.tsx:252](../../../src/ui/memory-test.tsx#L252)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: error
- 실행 차단 disabled: drawing || composing
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [exportDraft · H-5b954048f8ac](../handlers/ui__memory-test.md#h-5b954048f8ac) → [@callback:setTimeout · H-4e06f440343a](../handlers/ui__memory-test.md#h-4e06f440343a)

```tsx
exportDraft
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-398fe65487bf

**원문 보관 후 새로 시작** · Button · user-control

- 실제 소스: [src/ui/memory-test.tsx:256](../../../src/ui/memory-test.tsx#L256)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: error ∧ truthy: blocked && boot.error && boot.key
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c1f9e7b636fa](../handlers/ui__memory-test.md#h-c1f9e7b636fa) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050)

```tsx
() => {
                  try {
                    archiveDamagedDraft(boot.key, '암기시험 초안 원문 보관');
                    clearStoredDraft(boot.key);
                    raw.current = null;
                    blockedRef.current = false;
                    setBlocked(false);
                    persist(freshMemoryDraft(initialTopicId));
                  } catch (e) {
                    setError(message(e));
                  }
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-b91dec45b5ca, B-25f634e72939, B-4c69e8135155, B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5

## X-44ab1a0c0fd1

**초안 보관본** · a · user-control

- 실제 소스: [src/ui/memory-test.tsx:273](../../../src/ui/memory-test.tsx#L273)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/draft-archives`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-8f5965f74bfc

**시험 과목** · Select · user-control

- 실제 소스: [src/ui/memory-test.tsx:290](../../../src/ui/memory-test.tsx#L290)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history
- 실행 차단 disabled: busy || Boolean(draft.editor)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-0c608b22b3a8](../handlers/ui__memory-test.md#h-0c608b22b3a8) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6)

```tsx
(e) => persist({ ...draft, subjectId: e.target.value, topicId: '' })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5, B-4c69e8135155

## X-bfcbf7c9ba55

**시험 주제** · Select · user-control

- 실제 소스: [src/ui/memory-test.tsx:303](../../../src/ui/memory-test.tsx#L303)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history
- 실행 차단 disabled: busy || Boolean(draft.editor)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-68abc539ed4f](../handlers/ui__memory-test.md#h-68abc539ed4f) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6)

```tsx
(e) => persist({ ...draft, topicId: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5, B-4c69e8135155

## X-ced66400aad7

**문항 수** · Select · user-control

- 실제 소스: [src/ui/memory-test.tsx:316](../../../src/ui/memory-test.tsx#L316)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-57b2bbe8380e](../handlers/ui__memory-test.md#h-57b2bbe8380e) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6)

```tsx
(e) => persist({ ...draft, count: Number(e.target.value) })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5, B-4c69e8135155

## X-2910ff0ffd4f

**쪽지시험 시작** · Button · user-control

- 실제 소스: [src/ui/memory-test.tsx:330](../../../src/ui/memory-test.tsx#L330)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history
- 실행 차단 disabled: busy || !cards.length || Boolean(draft.editor)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-5c36a630ec18](../handlers/ui__memory-test.md#h-5c36a630ec18) → [start · H-a53a10597b12](../handlers/ui__memory-test.md#h-a53a10597b12) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6) → [@callback:selected.map · H-a79a20d06958](../handlers/ui__memory-test.md#h-a79a20d06958) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050)

```tsx
() => start()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-4775ec69b0d1, B-93e1e05253b1, B-3cb7e8fb0298, B-e1f587061791, B-4c69e8135155, B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5

## X-7a1cd8e001ab

**암기 항목 등록** · Button · user-control

- 실제 소스: [src/ui/memory-test.tsx:337](../../../src/ui/memory-test.tsx#L337)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history
- 실행 차단 disabled: busy || !topics.length || Boolean(draft.editor)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-507f6039638d](../handlers/ui__memory-test.md#h-507f6039638d) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6)

```tsx
() =>
                persist({
                  ...draft,
                  editor: {
                    id: crypto.randomUUID(),
                    baseVersion: 0,
                    topicId: draft.topicId || topics[0]?.id || '',
                    question: '',
                    answer: '',
                    strokes: [],
                  },
                })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5, B-4c69e8135155

## X-05cd8be2fa2c

**자료에서 카드 가져오기** · a · user-control

- 실제 소스: [src/ui/memory-test.tsx:355](../../../src/ui/memory-test.tsx#L355)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/material-cards`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-bb06fabe25ac

**GPT 연결 닫기 GPT 연결** · Button · user-control

- 실제 소스: [src/ui/memory-test.tsx:357](../../../src/ui/memory-test.tsx#L357)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-2ce8ca611eb6](../handlers/ui__memory-test.md#h-2ce8ca611eb6)

```tsx
() => setConnectionOpen(!connectionOpen)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-39d8440118a1

**GPT로 암기항목 만들기** · Button · user-control

- 실제 소스: [src/ui/memory-test.tsx:365](../../../src/ui/memory-test.tsx#L365)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && !draft.generation
- 실행 차단 disabled: busy || !topics.length || !!draft.editor
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-a88d6a9a2d4f](../handlers/ui__memory-test.md#h-a88d6a9a2d4f) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050)

```tsx
() => {
                  try {
                    const input = topicMemoryInput(data, [draft.topicId || topics[0].id]);
                    persist({ ...current.current, generation: { input, result: null, items: [] } });
                  } catch (e) {
                    setError(message(e));
                  }
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8f47d4887e74, B-0ff653ea7403, B-4c69e8135155, B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5

## X-0a757ed32a1f

**TopicMemoryGenerator · 조작/부품 영역** · TopicMemoryGenerator · component-callback-contract

- 실제 소스: [src/ui/memory-test.tsx:390](../../../src/ui/memory-test.tsx#L390)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U28](../paths/U28.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && draft.generation && !draft.editor
- 실행 차단 disabled: drawing || blocked || !capability
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onConnection** → [@onConnection · H-4c937e91bc49](../handlers/ui__memory-test.md#h-4c937e91bc49)

```tsx
() => setConnectionOpen(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onSaved** → 네이티브/호출자 동작

```tsx
onSaved
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onBusy** → 네이티브/호출자 동작

```tsx
setGenerating
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onChange** → [@onChange · H-5b77cceef921](../handlers/ui__memory-test.md#h-5b77cceef921) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6)

```tsx
(generation) => persist({ ...current.current, generation })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5, B-4c69e8135155

**onArchive** → [@onArchive · H-e53654426a6a](../handlers/ui__memory-test.md#h-e53654426a6a) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6)

```tsx
() => {
                  try {
                    archiveDamagedDraft(boot.key, '주제 기반 GPT 생성 결과 원문');
                    return true;
                  } catch (e) {
                    setError(message(e));
                    return false;
                  }
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-bf517a82815a, B-4f40edfb891d, B-4c69e8135155

## X-d3ce2a15d006

**생성 초안 보관하고 닫기** · Button · user-control

- 실제 소스: [src/ui/memory-test.tsx:410](../../../src/ui/memory-test.tsx#L410)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history ∧ truthy: canUseOwnerAI(data) && draft.generation && !draft.editor
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-70063c872d3f](../handlers/ui__memory-test.md#h-70063c872d3f) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050)

```tsx
() => {
                  try {
                    archiveDamagedDraft(boot.key, '주제 기반 GPT 생성 초안 보관');
                    persist({ ...current.current, generation: null });
                  } catch (e) {
                    setError(message(e));
                  }
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-bbc10730126f, B-6c1f94fbe854, B-4c69e8135155, B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5

## X-031eb7f8e3c0

**항목을 연결할 주제** · Select · user-control

- 실제 소스: [src/ui/memory-test.tsx:429](../../../src/ui/memory-test.tsx#L429)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor
- 실행 차단 disabled: busy || draft.editor.baseVersion > 0
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-6c53587715d9](../handlers/ui__memory-test.md#h-6c53587715d9) → [patchEditor · H-53a42606f791](../handlers/ui__memory-test.md#h-53a42606f791) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6)

```tsx
(e) => patchEditor({ topicId: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ab77c934d3f9, B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5, B-4c69e8135155

## X-71fee54d61d7

**질문·개념** · Textarea · user-control

- 실제 소스: [src/ui/memory-test.tsx:444](../../../src/ui/memory-test.tsx#L444)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor
- 실행 차단 disabled: blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-1da798de62c7](../handlers/ui__memory-test.md#h-1da798de62c7) → [patchEditor · H-53a42606f791](../handlers/ui__memory-test.md#h-53a42606f791) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6)

```tsx
(e) => patchEditor({ question: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ab77c934d3f9, B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5, B-4c69e8135155

## X-1f0b7fe678db

**기준 답안·조건** · Textarea · user-control

- 실제 소스: [src/ui/memory-test.tsx:452](../../../src/ui/memory-test.tsx#L452)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor
- 실행 차단 disabled: blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-231bc5fd26cb](../handlers/ui__memory-test.md#h-231bc5fd26cb) → [patchEditor · H-53a42606f791](../handlers/ui__memory-test.md#h-53a42606f791) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6)

```tsx
(e) => patchEditor({ answer: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ab77c934d3f9, B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5, B-4c69e8135155

## X-bc09c4313b70

**기준 답안 스케치** · MemoInkPad · component-callback-contract

- 실제 소스: [src/ui/memory-test.tsx:469](../../../src/ui/memory-test.tsx#L469)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U29](../paths/U29.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor
- 실행 차단 disabled: blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRecognizedText** → [@onRecognizedText · H-f158794f40b1](../handlers/ui__memory-test.md#h-f158794f40b1) → [patchEditor · H-53a42606f791](../handlers/ui__memory-test.md#h-53a42606f791) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6)

```tsx
(text) =>
                  patchEditor({
                    answer: draft.editor!.answer + (draft.editor!.answer ? '\n' : '') + text,
                  })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-28994d866d16, B-ab77c934d3f9, B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5, B-4c69e8135155

**onWorkspaceSaved** → [@onWorkspaceSaved · H-42aa8e6b1472](../handlers/ui__memory-test.md#h-42aa8e6b1472)

```tsx
() => onSaved(repository.getSnapshot())
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onChange** → [@onChange · H-f1d1da602a0a](../handlers/ui__memory-test.md#h-f1d1da602a0a) → [patchEditor · H-53a42606f791](../handlers/ui__memory-test.md#h-53a42606f791) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6)

```tsx
(strokes) => patchEditor({ strokes })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ab77c934d3f9, B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5, B-4c69e8135155

**onDrawing** → 네이티브/호출자 동작

```tsx
setDrawing
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-0ddb8817da60

**항목 저장** · Button · user-control

- 실제 소스: [src/ui/memory-test.tsx:489](../../../src/ui/memory-test.tsx#L489)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor
- 실행 차단 disabled: busy || !capability
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [saveEditor · H-06ced3dcb1b1](../handlers/ui__memory-test.md#h-06ced3dcb1b1) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050)

```tsx
saveEditor
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-bc46cc8b28d1, B-d389c9848f67, B-4c96d062fd7b, B-31a468e36435, B-5db53b079b18, B-4c69e8135155, B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5

## X-2c3c021d5d3c

**편집 취소** · Button · user-control

- 실제 소스: [src/ui/memory-test.tsx:492](../../../src/ui/memory-test.tsx#L492)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 취소·닫기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c940276119e5](../handlers/ui__memory-test.md#h-c940276119e5) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050)

```tsx
() => {
                    try {
                      archiveDamagedDraft(boot.key, '암기 항목 편집 취소 전 원문');
                      persist({ ...draft, editor: null });
                    } catch (e) {
                      setError(message(e));
                    }
                  }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-3d60c506a14b, B-d35d85faa4a2, B-4c69e8135155, B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5

## X-f817fb08434f

**과목과 목차 입력** · a · user-control

- 실제 소스: [src/ui/memory-test.tsx:510](../../../src/ui/memory-test.tsx#L510)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history ∧ truthy: !topics.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/subjects`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-ca482b3a16d5

**항목 편집** · Button · user-control

- 실제 소스: [src/ui/memory-test.tsx:530](../../../src/ui/memory-test.tsx#L530)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history
- 실행 차단 disabled: busy || Boolean(draft.editor)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-302c8586b25e](../handlers/ui__memory-test.md#h-302c8586b25e) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6)

```tsx
() =>
                    persist({
                      ...draft,
                      editor: {
                        id: c.id,
                        baseVersion: c.version,
                        topicId: c.topicId,
                        question: c.question,
                        answer: c.answer,
                        strokes: structuredClone(c.strokes),
                        ...(c.topicGeneration
                          ? { topicGeneration: structuredClone(c.topicGeneration) }
                          : {}),
                        ...(c.materialSource
                          ? { materialSource: structuredClone(c.materialSource) }
                          : {}),
                      },
                    })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f837b7cad168, B-8bffa4dc5557, B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5, B-4c69e8135155

반복: map(cards) · 520행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-233dfc24cbe3

**보관한 암기 항목** · summary · user-control

- 실제 소스: [src/ui/memory-test.tsx:559](../../../src/ui/memory-test.tsx#L559)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history ∧ truthy: (data.memoryCards ?? []).some((c) => c.deletedAt)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-7426a9215d6a

**복원** · Button · user-control

- 실제 소스: [src/ui/memory-test.tsx:569](../../../src/ui/memory-test.tsx#L569)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history ∧ truthy: (data.memoryCards ?? []).some((c) => c.deletedAt)
- 실행 차단 disabled: busy || !capability
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d139a454f07f](../handlers/ui__memory-test.md#h-d139a454f07f) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6)

```tsx
() => {
                        try {
                          onSaved(
                            repository.execute({
                              type: 'restoreMemoryCard',
                              id: c.id,
                              expectedVersion: c.version,
                              userId: data.userId,
                              namespace: data.namespace,
                              opId: crypto.randomUUID(),
                              at: new Date().toISOString(),
                            }),
                          );
                        } catch (e) {
                          setError(message(e));
                        }
                      }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-34e58a94cca1, B-cd7511a1e239, B-4c69e8135155

반복: map((data.memoryCards ?? []) .filter( (c) => c.deletedAt && data.nodes.some((n) => n.id === c.topicId && subjectIds.includes(n.subjectId)), )) · 560행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-89b9bd4d50ae

**항목 보관** · summary · user-control

- 실제 소스: [src/ui/memory-test.tsx:597](../../../src/ui/memory-test.tsx#L597)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor && draft.editor.baseVersion > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-a3c69b925a42

**항목 보관** · Button · user-control

- 실제 소스: [src/ui/memory-test.tsx:599](../../../src/ui/memory-test.tsx#L599)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history ∧ truthy: draft.editor && draft.editor.baseVersion > 0
- 실행 차단 disabled: busy || !capability
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-915042b5cdf1](../handlers/ui__memory-test.md#h-915042b5cdf1) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050)

```tsx
() => {
                  try {
                    const editor = current.current.editor;
                    if (!editor || !persist(current.current)) return;
                    archiveDamagedDraft(boot.key, '암기 항목 보관 전 편집 초안');
                    onSaved(
                      repository.execute({
                        type: 'trashMemoryCard',
                        id: editor.id,
                        expectedVersion: editor.baseVersion,
                        userId: data.userId,
                        namespace: data.namespace,
                        opId: crypto.randomUUID(),
                        at: new Date().toISOString(),
                      }),
                    );
                    persist({ ...draft, editor: null });
                  } catch (e) {
                    setError(message(e));
                  }
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-da660f66e6f4, B-a86716d35d12, B-d49dddab5267, B-4c69e8135155, B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5

## X-557886e4082f

**지난 시험 {savedTests.length} 회** · summary · user-control

- 실제 소스: [src/ui/memory-test.tsx:629](../../../src/ui/memory-test.tsx#L629)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history ∧ truthy: !!savedTests.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-dcce99ac8749

**답안과 결과 보기** · Button · user-control

- 실제 소스: [src/ui/memory-test.tsx:636](../../../src/ui/memory-test.tsx#L636)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'library' && !history ∧ truthy: !!savedTests.length
- 실행 차단 disabled: busy || Boolean(draft.editor)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-02f604b3aaea](../handlers/ui__memory-test.md#h-02f604b3aaea)

```tsx
() => setHistory(t)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(savedTests) · 630행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-bbc0a8bba433

**내 답안** · Textarea · user-control

- 실제 소스: [src/ui/memory-test.tsx:652](../../../src/ui/memory-test.tsx#L652)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'testing' && question && attempt
- 실행 차단 disabled: blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-787807e9dd25](../handlers/ui__memory-test.md#h-787807e9dd25) → [patchQuestion · H-e44441b0f015](../handlers/ui__memory-test.md#h-e44441b0f015) → [@callback:now.attempt.questions.map · H-47a65ffbfda6](../handlers/ui__memory-test.md#h-47a65ffbfda6) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6)

```tsx
(e) => patchQuestion(attempt.index, { response: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-78f606495686, B-8281ac673232, B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5, B-4c69e8135155

## X-51f551fb7c8e

**내 답안 스케치** · MemoInkPad · component-callback-contract

- 실제 소스: [src/ui/memory-test.tsx:659](../../../src/ui/memory-test.tsx#L659)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U29](../paths/U29.md)
- 직접 표시 조건: truthy: draft.phase === 'testing' && question && attempt
- 실행 차단 disabled: blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRecognizedText** → [@onRecognizedText · H-c05cf8ef1a04](../handlers/ui__memory-test.md#h-c05cf8ef1a04) → [patchQuestion · H-e44441b0f015](../handlers/ui__memory-test.md#h-e44441b0f015) → [@callback:now.attempt.questions.map · H-47a65ffbfda6](../handlers/ui__memory-test.md#h-47a65ffbfda6) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6)

```tsx
(text) =>
              patchQuestion(attempt.index, {
                response: question.response + (question.response ? '\n' : '') + text,
              })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-87e553c65268, B-78f606495686, B-8281ac673232, B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5, B-4c69e8135155

**onWorkspaceSaved** → [@onWorkspaceSaved · H-09252e69e5ac](../handlers/ui__memory-test.md#h-09252e69e5ac)

```tsx
() => onSaved(repository.getSnapshot())
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onChange** → [@onChange · H-0acbbce3bfd7](../handlers/ui__memory-test.md#h-0acbbce3bfd7) → [patchQuestion · H-e44441b0f015](../handlers/ui__memory-test.md#h-e44441b0f015) → [@callback:now.attempt.questions.map · H-47a65ffbfda6](../handlers/ui__memory-test.md#h-47a65ffbfda6) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6)

```tsx
(responseStrokes) => {
              const active = current.current.attempt;
              if (active) patchQuestion(active.index, { responseStrokes });
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-426aa7b03260, B-78f606495686, B-8281ac673232, B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5, B-4c69e8135155

**onDrawing** → 네이티브/호출자 동작

```tsx
setDrawing
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-2feb85f8678d

**이전 문항** · Button · user-control

- 실제 소스: [src/ui/memory-test.tsx:682](../../../src/ui/memory-test.tsx#L682)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'testing' && question && attempt
- 실행 차단 disabled: busy || attempt.index === 0
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-27dc1eb128c6](../handlers/ui__memory-test.md#h-27dc1eb128c6) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6)

```tsx
() =>
                persist({ ...draft, attempt: { ...attempt, index: attempt.index - 1 } })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5, B-4c69e8135155

## X-da69259269ce

**다음 문항** · Button · user-control

- 실제 소스: [src/ui/memory-test.tsx:691](../../../src/ui/memory-test.tsx#L691)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'testing' && question && attempt ∧ truthy: attempt.index < attempt.questions.length - 1
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-3693189105e6](../handlers/ui__memory-test.md#h-3693189105e6) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6)

```tsx
() =>
                  persist({ ...draft, attempt: { ...attempt, index: attempt.index + 1 } })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5, B-4c69e8135155

## X-c07e7d8a105b

**시험 마치고 답안 비교** · Button · user-control

- 실제 소스: [src/ui/memory-test.tsx:701](../../../src/ui/memory-test.tsx#L701)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'testing' && question && attempt ∧ falsy: attempt.index < attempt.questions.length - 1
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-b75458ab1e16](../handlers/ui__memory-test.md#h-b75458ab1e16) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6)

```tsx
() =>
                  persist({
                    ...draft,
                    phase: 'review',
                    attempt: { ...attempt, endedAt: new Date().toISOString() },
                  })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5, B-4c69e8135155

## X-8fe3b23d4465

**답안 보관하고 그만두기** · Button · user-control

- 실제 소스: [src/ui/memory-test.tsx:715](../../../src/ui/memory-test.tsx#L715)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: draft.phase === 'testing' && question && attempt
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-dd4bc936f960](../handlers/ui__memory-test.md#h-dd4bc936f960) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6) → [library · H-d3d5ffffd808](../handlers/ui__memory-test.md#h-d3d5ffffd808) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050)

```tsx
() => {
                try {
                  if (!persist(current.current)) return;
                  archiveDamagedDraft(boot.key, '암기시험 중단 전 답안 원문');
                  library();
                } catch (e) {
                  setError(message(e));
                }
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-964d4759e075, B-30aa81f1070a, B-2004e714adb7, B-4c69e8135155, B-ed42d9cba0aa, B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5

## X-0e2c945e869d

**`${index + 1}번 비교 결과`** · Select · user-control

- 실제 소스: [src/ui/memory-test.tsx:768](../../../src/ui/memory-test.tsx#L768)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: review ∧ truthy: draft.phase === 'review' && !history
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-fc283b715afd](../handlers/ui__memory-test.md#h-fc283b715afd) → [patchQuestion · H-e44441b0f015](../handlers/ui__memory-test.md#h-e44441b0f015) → [@callback:now.attempt.questions.map · H-47a65ffbfda6](../handlers/ui__memory-test.md#h-47a65ffbfda6) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6)

```tsx
(e) =>
                      patchQuestion(index, { verdict: (e.target.value || null) as MemoryVerdict })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-78f606495686, B-8281ac673232, B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5, B-4c69e8135155

반복: map(review) · 742행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-a9853f20b78c

**PerformanceFromSource · 조작/부품 영역** · PerformanceFromSource · component-callback-contract

- 실제 소스: [src/ui/memory-test.tsx:795](../../../src/ui/memory-test.tsx#L795)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [O20](../paths/O20.md), [U20](../paths/U20.md)
- 직접 표시 조건: truthy: review ∧ truthy: history || draft.phase === 'saved'
- 실행 차단 disabled: 명시 없음
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

반복: map(review) · 742행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-30118e423ca2

**시험 결과 저장** · Button · user-control

- 실제 소스: [src/ui/memory-test.tsx:808](../../../src/ui/memory-test.tsx#L808)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: review ∧ truthy: draft.phase === 'review' && !history
- 실행 차단 disabled: busy || !capability
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [saveTest · H-bd7e1537f231](../handlers/ui__memory-test.md#h-bd7e1537f231) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050)

```tsx
saveTest
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-1b25a5a63f1a, B-c8f20c069210, B-a6133e244b86, B-dd32d8e901ba, B-4c69e8135155, B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5

## X-05f14d1f6f18

**암기 항목으로 돌아가기** · Button · user-control

- 실제 소스: [src/ui/memory-test.tsx:814](../../../src/ui/memory-test.tsx#L814)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: review ∧ truthy: draft.phase === 'saved' || history
- 실행 차단 disabled: busy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [library · H-d3d5ffffd808](../handlers/ui__memory-test.md#h-d3d5ffffd808) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6)

```tsx
library
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ed42d9cba0aa, B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5, B-4c69e8135155

## X-b7ae90adc4b2

**틀리거나 부분적으로 맞은 문항 다시 시험** · Button · user-control

- 실제 소스: [src/ui/memory-test.tsx:817](../../../src/ui/memory-test.tsx#L817)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md)
- 직접 표시 조건: truthy: review ∧ truthy: draft.phase === 'saved' || history
- 실행 차단 disabled: busy || !review.some((q) => q.verdict === 'wrong' || q.verdict === 'partial')
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-baff64097fe7](../handlers/ui__memory-test.md#h-baff64097fe7) → [@callback:review.filter · H-114313fbe559](../handlers/ui__memory-test.md#h-114313fbe559) → [start · H-a53a10597b12](../handlers/ui__memory-test.md#h-a53a10597b12) → [message · H-cd475d97cdd6](../handlers/ui__memory-test.md#h-cd475d97cdd6) → [@callback:selected.map · H-a79a20d06958](../handlers/ui__memory-test.md#h-a79a20d06958) → [persist · H-2c1ca092f050](../handlers/ui__memory-test.md#h-2c1ca092f050)

```tsx
() =>
                    start(review.filter((q) => q.verdict === 'wrong' || q.verdict === 'partial'))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-4775ec69b0d1, B-93e1e05253b1, B-3cb7e8fb0298, B-e1f587061791, B-4c69e8135155, B-e0add9b1a1c5, B-a4c6f07ad819, B-447994281217, B-cfc8047f9109, B-40239f3f33b5

