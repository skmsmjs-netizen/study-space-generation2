# src/ui/integral-reasoning.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-dc3e84462315

**살펴볼 급수** · Select · user-control

- 실제 소스: [src/ui/integral-reasoning.tsx:65](../../../src/ui/integral-reasoning.tsx#L65)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-542f6608dd1f](../handlers/ui__integral-reasoning.md#h-542f6608dd1f)

```tsx
(e) => onChange({ ...view, example: e.target.value as SeriesExampleId })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-f0923fbe6ffa

**핵심만 보기** · Checkbox · user-control

- 실제 소스: [src/ui/integral-reasoning.tsx:99](../../../src/ui/integral-reasoning.tsx#L99)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-3cc1cc34a92a](../handlers/ui__integral-reasoning.md#h-3cc1cc34a92a) → [update · H-ee981a8ef21d](../handlers/ui__integral-reasoning.md#h-ee981a8ef21d)

```tsx
(e) => update({ brief: e.target.checked })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-15828dfe79f6

**{i + 1} {step.title} {step.english} 앞 조건 확인 {step.state === 'stop' ? '갈림길' : step.state === 'unknown' ? '확인 필요' : active ? '살펴보는 중' : '보기'}** · button · user-control

- 실제 소스: [src/ui/integral-reasoning.tsx:112](../../../src/ui/integral-reasoning.tsx#L112)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: !available
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-45f7f9111906](../handlers/ui__integral-reasoning.md#h-45f7f9111906) → [choose · H-40d08f79249e](../handlers/ui__integral-reasoning.md#h-40d08f79249e) → [update · H-ee981a8ef21d](../handlers/ui__integral-reasoning.md#h-ee981a8ef21d)

```tsx
() => choose(step.id)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f2d56ab3cc46

반복: map(steps) · 106행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-d05430dd43b1

**판정법 후보 비교** · Select · user-control

- 실제 소스: [src/ui/integral-reasoning.tsx:169](../../../src/ui/integral-reasoning.tsx#L169)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: truthy: active ∧ truthy: step.id === 'method'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-7c665b45ec75](../handlers/ui__integral-reasoning.md#h-7c665b45ec75) → [update · H-ee981a8ef21d](../handlers/ui__integral-reasoning.md#h-ee981a8ef21d)

```tsx
(e) =>
                        update({
                          method: e.target.value as ReasoningMethod,
                          absolute: false,
                          tail: false,
                          badExtension: false,
                          pending: null,
                        })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(steps) · 106행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-1cb2b3213366

**절댓값 급수로 확인** · Button · user-control

- 실제 소스: [src/ui/integral-reasoning.tsx:204](../../../src/ui/integral-reasoning.tsx#L204)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: truthy: active ∧ truthy: step.id === 'positive' &&
                    view.example === 'alternating' &&
                    !reading.absolute
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-bfef8799c1e3](../handlers/ui__integral-reasoning.md#h-bfef8799c1e3) → [update · H-ee981a8ef21d](../handlers/ui__integral-reasoning.md#h-ee981a8ef21d)

```tsx
() =>
                            update({ absolute: true, pending: null, step: 'function' })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(steps) · 106행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-2bb2db6ce41a

**교대급수판정법 비교** · Button · user-control

- 실제 소스: [src/ui/integral-reasoning.tsx:211](../../../src/ui/integral-reasoning.tsx#L211)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: truthy: active ∧ truthy: step.id === 'positive' &&
                    view.example === 'alternating' &&
                    !reading.absolute
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-268d35e51088](../handlers/ui__integral-reasoning.md#h-268d35e51088) → [update · H-ee981a8ef21d](../handlers/ui__integral-reasoning.md#h-ee981a8ef21d)

```tsx
() =>
                            update({ method: 'alternating', pending: null, step: 'method' })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(steps) · 106행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-896048ba1f46

**세 번째 항부터 다시 확인** · Button · user-control

- 실제 소스: [src/ui/integral-reasoning.tsx:221](../../../src/ui/integral-reasoning.tsx#L221)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: truthy: active ∧ truthy: step.id === 'decreasing' && view.example === 'eventual' && !reading.tail
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-800570ddadd7](../handlers/ui__integral-reasoning.md#h-800570ddadd7) → [update · H-ee981a8ef21d](../handlers/ui__integral-reasoning.md#h-ee981a8ef21d)

```tsx
() => update({ tail: true, pending: null, step: 'function' })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(steps) · 106행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-568fc1cf6a82

**적분판정법 후보로 돌아가기** · Button · user-control

- 실제 소스: [src/ui/integral-reasoning.tsx:226](../../../src/ui/integral-reasoning.tsx#L226)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: truthy: active ∧ truthy: step.id === 'method' && reading.method !== 'integral'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-206e17dca5ec](../handlers/ui__integral-reasoning.md#h-206e17dca5ec) → [update · H-ee981a8ef21d](../handlers/ui__integral-reasoning.md#h-ee981a8ef21d)

```tsx
() => update({ method: 'integral', pending: null })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(steps) · 106행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-3b4bf8bc65e0

**원래 연속함수로 돌아가기 정수 사이가 다른 함수를 비교** · Button · user-control

- 실제 소스: [src/ui/integral-reasoning.tsx:232](../../../src/ui/integral-reasoning.tsx#L232)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: truthy: active ∧ truthy: step.id === 'function' &&
                    (view.example !== 'alternating' || reading.absolute)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-4986f6a0854f](../handlers/ui__integral-reasoning.md#h-4986f6a0854f) → [update · H-ee981a8ef21d](../handlers/ui__integral-reasoning.md#h-ee981a8ef21d)

```tsx
() =>
                          update({ badExtension: !reading.badExtension, pending: null })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(steps) · 106행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-572a6a10f509

**원래 연속함수로 다시 확인** · Button · user-control

- 실제 소스: [src/ui/integral-reasoning.tsx:244](../../../src/ui/integral-reasoning.tsx#L244)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: truthy: active ∧ truthy: step.id === 'continuous' && reading.badExtension
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-286e792e9abf](../handlers/ui__integral-reasoning.md#h-286e792e9abf) → [update · H-ee981a8ef21d](../handlers/ui__integral-reasoning.md#h-ee981a8ef21d)

```tsx
() =>
                        update({ badExtension: false, pending: null, step: 'function' })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(steps) · 106행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-e790e6f79f7d

**항이 0으로 가는 예제와 비교** · Button · user-control

- 실제 소스: [src/ui/integral-reasoning.tsx:253](../../../src/ui/integral-reasoning.tsx#L253)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: truthy: active ∧ truthy: step.id === 'term' && view.example === 'nonzero'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-481fb1b6fc80](../handlers/ui__integral-reasoning.md#h-481fb1b6fc80)

```tsx
() => onChange({ ...view, example: 'log-square' })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(steps) · 106행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-6aefa06e3df0

**근거를 확인하고 이어 보기** · Button · user-control

- 실제 소스: [src/ui/integral-reasoning.tsx:260](../../../src/ui/integral-reasoning.tsx#L260)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: truthy: active ∧ truthy: ['positive', 'continuous', 'decreasing'].includes(step.id) &&
                    step.state !== 'stop' ∧ truthy: reading.pending === step.id
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-5cc3a0556100](../handlers/ui__integral-reasoning.md#h-5cc3a0556100) → [update · H-ee981a8ef21d](../handlers/ui__integral-reasoning.md#h-ee981a8ef21d)

```tsx
() => update({ pending: null })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(steps) · 106행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-d77efc7e0a10

**이 조건을 아직 확인하지 못했다면?** · Button · user-control

- 실제 소스: [src/ui/integral-reasoning.tsx:264](../../../src/ui/integral-reasoning.tsx#L264)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: truthy: active ∧ truthy: ['positive', 'continuous', 'decreasing'].includes(step.id) &&
                    step.state !== 'stop' ∧ falsy: reading.pending === step.id
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-fb1fe665c099](../handlers/ui__integral-reasoning.md#h-fb1fe665c099) → [update · H-ee981a8ef21d](../handlers/ui__integral-reasoning.md#h-ee981a8ef21d)

```tsx
() => update({ pending: step.id })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(steps) · 106행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-8d5d134dbf0c

**AreaComparison · 조작/부품 영역** · AreaComparison · component-callback-contract

- 실제 소스: [src/ui/integral-reasoning.tsx:269](../../../src/ui/integral-reasoning.tsx#L269)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: truthy: active ∧ truthy: step.id === 'integral'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onCount** → [@onCount · H-23e8a6133098](../handlers/ui__integral-reasoning.md#h-23e8a6133098) → [update · H-ee981a8ef21d](../handlers/ui__integral-reasoning.md#h-ee981a8ef21d)

```tsx
(areaCount) => update({ areaCount })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(steps) · 106행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-a057794228b2

**이전 질문** · Button · user-control

- 실제 소스: [src/ui/integral-reasoning.tsx:278](../../../src/ui/integral-reasoning.tsx#L278)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: truthy: active ∧ truthy: index > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-a1062bb00590](../handlers/ui__integral-reasoning.md#h-a1062bb00590) → [choose · H-40d08f79249e](../handlers/ui__integral-reasoning.md#h-40d08f79249e) → [update · H-ee981a8ef21d](../handlers/ui__integral-reasoning.md#h-ee981a8ef21d)

```tsx
() => choose(STEP_IDS[index - 1])
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f2d56ab3cc46

반복: map(steps) · 106행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-e15a2411a750

**다음 질문** · Button · user-control

- 실제 소스: [src/ui/integral-reasoning.tsx:284](../../../src/ui/integral-reasoning.tsx#L284)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: truthy: active ∧ truthy: index < steps.length - 1 &&
                      canReachStep(view.example, reading, STEP_IDS[index + 1])
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [advance · H-42d1761f4f46](../handlers/ui__integral-reasoning.md#h-42d1761f4f46) → [@callback:requestAnimationFrame · H-f25f089b339f](../handlers/ui__integral-reasoning.md#h-f25f089b339f) → [update · H-ee981a8ef21d](../handlers/ui__integral-reasoning.md#h-ee981a8ef21d)

```tsx
advance
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-cfa1ab732c32

반복: map(steps) · 106행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-88602620a974

**처음 질문으로 돌아가기** · Button · user-control

- 실제 소스: [src/ui/integral-reasoning.tsx:289](../../../src/ui/integral-reasoning.tsx#L289)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: truthy: active ∧ truthy: step.id === 'conclusion'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-0fce42924417](../handlers/ui__integral-reasoning.md#h-0fce42924417) → [update · H-ee981a8ef21d](../handlers/ui__integral-reasoning.md#h-ee981a8ef21d)

```tsx
() => update({ step: 'goal' })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(steps) · 106행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-9f2b852d8b86

**원래 급수의 조건으로 돌아가기** · Button · user-control

- 실제 소스: [src/ui/integral-reasoning.tsx:302](../../../src/ui/integral-reasoning.tsx#L302)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: truthy: reading.absolute || reading.tail || reading.badExtension
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-91e4d0a2825f](../handlers/ui__integral-reasoning.md#h-91e4d0a2825f) → [update · H-ee981a8ef21d](../handlers/ui__integral-reasoning.md#h-ee981a8ef21d)

```tsx
() =>
              update({
                absolute: false,
                tail: false,
                badExtension: false,
                pending: null,
                method: 'integral',
                step: 'function',
              })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e0bb9c9a9ca0

**정리의 원문과 적용 범위** · summary · user-control

- 실제 소스: [src/ui/integral-reasoning.tsx:319](../../../src/ui/integral-reasoning.tsx#L319)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-4aecd8977541

**OpenStax · 발산판정법과 적분판정법** · a · user-control

- 실제 소스: [src/ui/integral-reasoning.tsx:326](../../../src/ui/integral-reasoning.tsx#L326)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `https://openstax.org/books/calculus-volume-2/pages/5-3-the-divergence-and-integral-tests`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-910164b301ce

**OpenStax · 판정법을 선택하는 전략** · a · user-control

- 실제 소스: [src/ui/integral-reasoning.tsx:333](../../../src/ui/integral-reasoning.tsx#L333)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `https://openstax.org/books/calculus-volume-2/pages/5-6-ratio-and-root-tests`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-b47ce8ed4687

**비교 구간의 끝** · input · user-control

- 실제 소스: [src/ui/integral-reasoning.tsx:401](../../../src/ui/integral-reasoning.tsx#L401)
- 연결 표면: [R09](../paths/R09.md), [U33](../paths/U33.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-87c39fbd654c](../handlers/ui__integral-reasoning.md#h-87c39fbd654c)

```tsx
(e) => onCount(Number(e.target.value))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

