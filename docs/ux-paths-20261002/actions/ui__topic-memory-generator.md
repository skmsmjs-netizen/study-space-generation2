# src/ui/topic-memory-generator.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-f0cb2c3ca66c

**GPT 출제 주제** · Select · user-control

- 실제 소스: [src/ui/topic-memory-generator.tsx:156](../../../src/ui/topic-memory-generator.tsx#L156)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U28](../paths/U28.md)
- 직접 표시 조건: truthy: !draft.result
- 실행 차단 disabled: disabled || pending
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-3195dd368446](../handlers/ui__topic-memory-generator.md#h-3195dd368446) → [updateScope · H-35e7e64a7027](../handlers/ui__topic-memory-generator.md#h-35e7e64a7027)

```tsx
(e) => {
              if (e.target.value) updateScope([e.target.value]);
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d0e7e9ff60ea, B-fcc4c5df4e4a, B-6a70d44b31c5, B-b1d9e0733ac6

## X-14d1bf5246e1

**여러 주제를 함께 출제** · summary · user-control

- 실제 소스: [src/ui/topic-memory-generator.tsx:176](../../../src/ui/topic-memory-generator.tsx#L176)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U28](../paths/U28.md)
- 직접 표시 조건: truthy: !draft.result
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-528ec401c2a3

**recallPath(data.nodes, t.id)
                      .map((n) => n.name)
                      .join(' › ')** · Checkbox · user-control

- 실제 소스: [src/ui/topic-memory-generator.tsx:182](../../../src/ui/topic-memory-generator.tsx#L182)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U28](../paths/U28.md)
- 직접 표시 조건: truthy: !draft.result
- 실행 차단 disabled: disabled ||
                      pending ||
                      (checked && input.topics.length === 1) ||
                      (!checked && input.topics.length >= 20)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-6c4ee900267f](../handlers/ui__topic-memory-generator.md#h-6c4ee900267f) → [@callback:input.topics.filter · H-e6f034d52373](../handlers/ui__topic-memory-generator.md#h-e6f034d52373) → [@callback:input.topics.filter((n) => n.id !== t.id).map · H-f3cdd585bc18](../handlers/ui__topic-memory-generator.md#h-f3cdd585bc18) → [@callback:input.topics.map · H-ecde0ba10b47](../handlers/ui__topic-memory-generator.md#h-ecde0ba10b47) → [updateScope · H-35e7e64a7027](../handlers/ui__topic-memory-generator.md#h-35e7e64a7027)

```tsx
(e) =>
                      updateScope(
                        e.target.checked
                          ? [...input.topics.map((n) => n.id), t.id]
                          : input.topics.filter((n) => n.id !== t.id).map((n) => n.id),
                      )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-4b2e479d2382, B-fcc4c5df4e4a, B-6a70d44b31c5, B-b1d9e0733ac6

반복: map(topics) · 179행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-1471ca0f44d7

**만들 암기항목 수** · Select · user-control

- 실제 소스: [src/ui/topic-memory-generator.tsx:206](../../../src/ui/topic-memory-generator.tsx#L206)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U28](../paths/U28.md)
- 직접 표시 조건: truthy: !draft.result
- 실행 차단 disabled: disabled || pending
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-3b5259483057](../handlers/ui__topic-memory-generator.md#h-3b5259483057) → [@callback:input.topics.map · H-06e0cc7a1284](../handlers/ui__topic-memory-generator.md#h-06e0cc7a1284) → [updateScope · H-35e7e64a7027](../handlers/ui__topic-memory-generator.md#h-35e7e64a7027)

```tsx
(e) =>
              updateScope(
                input.topics.map((t) => t.id),
                Number(e.target.value),
              )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-fcc4c5df4e4a, B-6a70d44b31c5, B-b1d9e0733ac6

## X-b80d128a0781

**출제 초점·난도 (선택)** · Textarea · user-control

- 실제 소스: [src/ui/topic-memory-generator.tsx:223](../../../src/ui/topic-memory-generator.tsx#L223)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U28](../paths/U28.md)
- 직접 표시 조건: truthy: !draft.result
- 실행 차단 disabled: disabled || pending
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-71ef66904bcf](../handlers/ui__topic-memory-generator.md#h-71ef66904bcf) → [@callback:input.topics.map · H-3c1f31a532b6](../handlers/ui__topic-memory-generator.md#h-3c1f31a532b6) → [updateScope · H-35e7e64a7027](../handlers/ui__topic-memory-generator.md#h-35e7e64a7027)

```tsx
(e) =>
              updateScope(
                input.topics.map((t) => t.id),
                input.count,
                e.target.value,
              )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-fcc4c5df4e4a, B-6a70d44b31c5, B-b1d9e0733ac6

## X-6f179735706c

**암기항목 만드는 중… 이 목차로 생성** · Button · user-control

- 실제 소스: [src/ui/topic-memory-generator.tsx:239](../../../src/ui/topic-memory-generator.tsx#L239)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U28](../paths/U28.md)
- 직접 표시 조건: truthy: !draft.result
- 실행 차단 disabled: disabled || composing || pending
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-63f9fd6b1e68](../handlers/ui__topic-memory-generator.md#h-63f9fd6b1e68) → [generate · H-40b836d6cf99](../handlers/ui__topic-memory-generator.md#h-40b836d6cf99) → [@callback:result.cards.map · H-d42859bbaa6c](../handlers/ui__topic-memory-generator.md#h-d42859bbaa6c) → [@callback:input.topics.map · H-7e217f548c50](../handlers/ui__topic-memory-generator.md#h-7e217f548c50)

```tsx
() => void generate()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-754f7e1abe3e, B-ddea1fc69ab8, B-6bd18bbf063b, B-a55eda89df99, B-895ca1ba71ce, B-05dae8c147d5, B-ae0471ae45c6, B-6c6bf68b5ff9, B-cc82b0111845

## X-14e0b4c37b6e

**GPT 연결 확인** · Button · user-control

- 실제 소스: [src/ui/topic-memory-generator.tsx:246](../../../src/ui/topic-memory-generator.tsx#L246)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U28](../paths/U28.md)
- 직접 표시 조건: truthy: !draft.result
- 실행 차단 disabled: pending
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → 네이티브/호출자 동작

```tsx
onConnection
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-46731781343e

**`${index + 1}번 항목 등록에 포함`** · Checkbox · user-control

- 실제 소스: [src/ui/topic-memory-generator.tsx:294](../../../src/ui/topic-memory-generator.tsx#L294)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U28](../paths/U28.md)
- 직접 표시 조건: truthy: result
- 실행 차단 disabled: disabled || !!saved
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-d9cbc8d04e2a](../handlers/ui__topic-memory-generator.md#h-d9cbc8d04e2a) → [patchItem · H-6d073b901211](../handlers/ui__topic-memory-generator.md#h-6d073b901211) → [@callback:draft.items.map · H-85c9fbf96666](../handlers/ui__topic-memory-generator.md#h-85c9fbf96666)

```tsx
(e) => patchItem(i.id, { included: e.target.checked })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e0309662171c

반복: map(draft.items) · 271행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-e942bebb4002

**`${index + 1}번 질문`** · Textarea · user-control

- 실제 소스: [src/ui/topic-memory-generator.tsx:300](../../../src/ui/topic-memory-generator.tsx#L300)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U28](../paths/U28.md)
- 직접 표시 조건: truthy: result
- 실행 차단 disabled: disabled || !!saved
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-ef8b67de2b02](../handlers/ui__topic-memory-generator.md#h-ef8b67de2b02) → [patchItem · H-6d073b901211](../handlers/ui__topic-memory-generator.md#h-6d073b901211) → [@callback:draft.items.map · H-85c9fbf96666](../handlers/ui__topic-memory-generator.md#h-85c9fbf96666)

```tsx
(e) => patchItem(i.id, { question: e.target.value, reviewed: false })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e0309662171c

반복: map(draft.items) · 271행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-95b16b07b977

**`${index + 1}번 기준 답안`** · Textarea · user-control

- 실제 소스: [src/ui/topic-memory-generator.tsx:308](../../../src/ui/topic-memory-generator.tsx#L308)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U28](../paths/U28.md)
- 직접 표시 조건: truthy: result
- 실행 차단 disabled: disabled || !!saved
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-9f8a81dfa405](../handlers/ui__topic-memory-generator.md#h-9f8a81dfa405) → [patchItem · H-6d073b901211](../handlers/ui__topic-memory-generator.md#h-6d073b901211) → [@callback:draft.items.map · H-85c9fbf96666](../handlers/ui__topic-memory-generator.md#h-85c9fbf96666)

```tsx
(e) => patchItem(i.id, { answer: e.target.value, reviewed: false })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e0309662171c

반복: map(draft.items) · 271행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-7f5e4689c92b

**`${index + 1}번 질문과 답안을 확인했어요`** · Checkbox · user-control

- 실제 소스: [src/ui/topic-memory-generator.tsx:326](../../../src/ui/topic-memory-generator.tsx#L326)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U28](../paths/U28.md)
- 직접 표시 조건: truthy: result
- 실행 차단 disabled: disabled || !!saved
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-10d75e1d6a2f](../handlers/ui__topic-memory-generator.md#h-10d75e1d6a2f) → [patchItem · H-6d073b901211](../handlers/ui__topic-memory-generator.md#h-6d073b901211) → [@callback:draft.items.map · H-85c9fbf96666](../handlers/ui__topic-memory-generator.md#h-85c9fbf96666)

```tsx
(e) => patchItem(i.id, { reviewed: e.target.checked })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e0309662171c

반복: map(draft.items) · 271행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-ad5bce70a332

**처음 생성한 질문·답안** · summary · user-control

- 실제 소스: [src/ui/topic-memory-generator.tsx:340](../../../src/ui/topic-memory-generator.tsx#L340)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U28](../paths/U28.md)
- 직접 표시 조건: truthy: result
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(draft.items) · 271행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-32e4554a88b0

**확인한 항목 등록** · Button · user-control

- 실제 소스: [src/ui/topic-memory-generator.tsx:348](../../../src/ui/topic-memory-generator.tsx#L348)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U28](../paths/U28.md)
- 직접 표시 조건: truthy: result
- 실행 차단 disabled: disabled ||
                composing ||
                !selected.length ||
                selected.some((i) => !i.reviewed || !i.question.trim() || !i.answer.trim())
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [register · H-cc8e25568364](../handlers/ui__topic-memory-generator.md#h-cc8e25568364)

```tsx
register
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-0364e66bfa34, B-c569a62f59b8, B-4c88f21ac282, B-72dd896c7468, B-78a7a570f8a9

## X-ba36bee08460

**이 결과 보관하고 새로 만들기** · Button · user-control

- 실제 소스: [src/ui/topic-memory-generator.tsx:360](../../../src/ui/topic-memory-generator.tsx#L360)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U28](../paths/U28.md)
- 직접 표시 조건: truthy: result
- 실행 차단 disabled: disabled || composing
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-97aef1fcc24b](../handlers/ui__topic-memory-generator.md#h-97aef1fcc24b)

```tsx
() => {
                if (onArchive()) onChange({ input, result: null, items: [] });
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-eb26428e5aaf

## X-a56c3e26024e

**연결 설정 열기** · Button · user-control

- 실제 소스: [src/ui/topic-memory-generator.tsx:375](../../../src/ui/topic-memory-generator.tsx#L375)
- 연결 표면: [R11](../paths/R11.md), [R27](../paths/R27.md), [R28](../paths/R28.md), [U28](../paths/U28.md)
- 직접 표시 조건: truthy: error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → 네이티브/호출자 동작

```tsx
onConnection
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

