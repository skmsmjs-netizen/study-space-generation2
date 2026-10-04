# src/ui/math-comparison.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-62f2e0f16a51

**현재 조건으로 A 다시 고정 현재 조건을 A로 고정** · Button · user-control

- 실제 소스: [src/ui/math-comparison.tsx:114](../../../src/ui/math-comparison.tsx#L114)
- 연결 표면: [R09](../paths/R09.md), [A10](../paths/A10.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: !result || blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [pin · H-c5be541451e2](../handlers/ui__math-comparison.md#h-c5be541451e2)

```tsx
pin
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-4e9c133b11cc, B-fb7f438f8a8f, B-ed7ef7465bc1

## X-61c75b7756a4

**비교 초기화 비교 종료** · Button · user-control

- 실제 소스: [src/ui/math-comparison.tsx:125](../../../src/ui/math-comparison.tsx#L125)
- 연결 표면: [R09](../paths/R09.md), [A10](../paths/A10.md)
- 직접 표시 조건: truthy: pinned || blocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [clear · H-653a87ade0f8](../handlers/ui__math-comparison.md#h-653a87ade0f8)

```tsx
clear
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ad5477452d92, B-2d2697f18923

## X-cf1b892bf368

**A와 B를 함께 볼 평면** · Select · user-control

- 실제 소스: [src/ui/math-comparison.tsx:155](../../../src/ui/math-comparison.tsx#L155)
- 연결 표면: [R09](../paths/R09.md), [A10](../paths/A10.md)
- 직접 표시 조건: truthy: pinned && a ∧ truthy: compatible && result ∧ truthy: scene.mode === 'curve'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-377dd62ca9f5](../handlers/ui__math-comparison.md#h-377dd62ca9f5)

```tsx
(event) => {
                      setProjection(event.target.value as ComparisonProjection);
                      setLockedBounds(null);
                      setZoom(1);
                    }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-d313c41c51d8

**비교 그래프 확대** · Button · user-control

- 실제 소스: [src/ui/math-comparison.tsx:169](../../../src/ui/math-comparison.tsx#L169)
- 연결 표면: [R09](../paths/R09.md), [A10](../paths/A10.md)
- 직접 표시 조건: truthy: pinned && a ∧ truthy: compatible && result
- 실행 차단 disabled: zoom >= 20
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c66bff7c157a](../handlers/ui__math-comparison.md#h-c66bff7c157a) → [@callback:setZoom · H-672753dcc196](../handlers/ui__math-comparison.md#h-672753dcc196)

```tsx
() => {
                    setLockedBounds(base);
                    setZoom((value) => Math.min(value * 1.5, 20));
                  }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-766d12838582

**비교 그래프 축소** · Button · user-control

- 실제 소스: [src/ui/math-comparison.tsx:180](../../../src/ui/math-comparison.tsx#L180)
- 연결 표면: [R09](../paths/R09.md), [A10](../paths/A10.md)
- 직접 표시 조건: truthy: pinned && a ∧ truthy: compatible && result
- 실행 차단 disabled: zoom <= 0.2
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-a8fb97859aad](../handlers/ui__math-comparison.md#h-a8fb97859aad) → [@callback:setZoom · H-dc1875222a86](../handlers/ui__math-comparison.md#h-dc1875222a86)

```tsx
() => {
                    setLockedBounds(base);
                    setZoom((value) => Math.max(value / 1.5, 0.2));
                  }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-d3c692a02ae3

**두 조건 전체 맞춤** · Button · user-control

- 실제 소스: [src/ui/math-comparison.tsx:191](../../../src/ui/math-comparison.tsx#L191)
- 연결 표면: [R09](../paths/R09.md), [A10](../paths/A10.md)
- 직접 표시 조건: truthy: pinned && a ∧ truthy: compatible && result
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-f44750ecd2a8](../handlers/ui__math-comparison.md#h-f44750ecd2a8)

```tsx
() => {
                    setLockedBounds(null);
                    setZoom(1);
                  }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-2e5e782b8df6

**비교 범위를 왼쪽으로 이동** · Button · user-control

- 실제 소스: [src/ui/math-comparison.tsx:200](../../../src/ui/math-comparison.tsx#L200)
- 연결 표면: [R09](../paths/R09.md), [A10](../paths/A10.md)
- 직접 표시 조건: truthy: pinned && a ∧ truthy: compatible && result
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-914c90f43acc](../handlers/ui__math-comparison.md#h-914c90f43acc)

```tsx
() => setLockedBounds({ ...base, x: base.x - bounds.span / 5 })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-d534a9588f98

**비교 범위를 오른쪽으로 이동** · Button · user-control

- 실제 소스: [src/ui/math-comparison.tsx:207](../../../src/ui/math-comparison.tsx#L207)
- 연결 표면: [R09](../paths/R09.md), [A10](../paths/A10.md)
- 직접 표시 조건: truthy: pinned && a ∧ truthy: compatible && result
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-46b5fa7942f1](../handlers/ui__math-comparison.md#h-46b5fa7942f1)

```tsx
() => setLockedBounds({ ...base, x: base.x + bounds.span / 5 })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-d8f6d46f8983

**비교 범위를 위로 이동** · Button · user-control

- 실제 소스: [src/ui/math-comparison.tsx:214](../../../src/ui/math-comparison.tsx#L214)
- 연결 표면: [R09](../paths/R09.md), [A10](../paths/A10.md)
- 직접 표시 조건: truthy: pinned && a ∧ truthy: compatible && result
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-9747d1a4aa89](../handlers/ui__math-comparison.md#h-9747d1a4aa89)

```tsx
() => setLockedBounds({ ...base, y: base.y + bounds.span / 5 })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-3b5a47467149

**비교 범위를 아래로 이동** · Button · user-control

- 실제 소스: [src/ui/math-comparison.tsx:221](../../../src/ui/math-comparison.tsx#L221)
- 연결 표면: [R09](../paths/R09.md), [A10](../paths/A10.md)
- 직접 표시 조건: truthy: pinned && a ∧ truthy: compatible && result
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-63ffed27c69e](../handlers/ui__math-comparison.md#h-63ffed27c69e)

```tsx
() => setLockedBounds({ ...base, y: base.y - bounds.span / 5 })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-43f7dac96f14

**비교 크기 되돌리기 비교 크게 보기** · Button · user-control

- 실제 소스: [src/ui/math-comparison.tsx:228](../../../src/ui/math-comparison.tsx#L228)
- 연결 표면: [R09](../paths/R09.md), [A10](../paths/A10.md)
- 직접 표시 조건: truthy: pinned && a ∧ truthy: compatible && result
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-0e0015013545](../handlers/ui__math-comparison.md#h-0e0015013545) → [@callback:setLarge · H-6aa9647c4b70](../handlers/ui__math-comparison.md#h-6aa9647c4b70)

```tsx
() => setLarge((value) => !value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

