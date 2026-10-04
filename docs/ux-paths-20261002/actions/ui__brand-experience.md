# src/ui/brand-experience.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-44d5dd76f754

**{!compact && <span>{BRAND.promise}</span>}** · a · user-control

- 실제 소스: [src/ui/brand-experience.tsx:37](../../../src/ui/brand-experience.tsx#L37)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O10](../paths/O10.md), [U09](../paths/U09.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-6703ed5c85d2

**EXPERIENCE_CHANGED** · addEventListener · imperative-listener

- 실제 소스: [src/ui/brand-experience.tsx:71](../../../src/ui/brand-experience.tsx#L71)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R36](../paths/R36.md), [R37](../paths/R37.md), [R38](../paths/R38.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O10](../paths/O10.md), [U09](../paths/U09.md), [U10](../paths/U10.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**dynamic-event** → [changed · H-993174bca82d](../handlers/ui__brand-experience.md#h-993174bca82d)

```tsx
changed
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-bf6afbf205bf

## X-0d21e2d15647

**'storage'** · addEventListener · imperative-listener

- 실제 소스: [src/ui/brand-experience.tsx:72](../../../src/ui/brand-experience.tsx#L72)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R36](../paths/R36.md), [R37](../paths/R37.md), [R38](../paths/R38.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O10](../paths/O10.md), [U09](../paths/U09.md), [U10](../paths/U10.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**storage** → [storage · H-43b187c2bdac](../handlers/ui__brand-experience.md#h-43b187c2bdac)

```tsx
storage
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-83d7a1a08974

## X-13b439d3333d

**다음 행동 열기** · Button · user-control

- 실제 소스: [src/ui/brand-experience.tsx:211](../../../src/ui/brand-experience.tsx#L211)
- 연결 표면: [R01](../paths/R01.md), [O10](../paths/O10.md), [U09](../paths/U09.md)
- 직접 표시 조건: truthy: route === '/' ∧ truthy: experience.state.next
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-b15273dca53b](../handlers/ui__brand-experience.md#h-b15273dca53b) → [resume · H-01e3e32dcce1](../handlers/ui__brand-experience.md#h-01e3e32dcce1)

```tsx
() => resume(nextLocation?.route ?? '/subjects')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-b204d21ef6d9, B-f519cfe47eff

## X-b471e6d0e7a0

**다음 행동 표시 해제** · Button · user-control

- 실제 소스: [src/ui/brand-experience.tsx:214](../../../src/ui/brand-experience.tsx#L214)
- 연결 표면: [R01](../paths/R01.md), [O10](../paths/O10.md), [U09](../paths/U09.md)
- 직접 표시 조건: truthy: route === '/' ∧ truthy: experience.state.next
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-2f7968e080df](../handlers/ui__brand-experience.md#h-2f7968e080df) → [@callback:experience.change · H-efd6549202f5](../handlers/ui__brand-experience.md#h-efd6549202f5)

```tsx
() => {
                    if (experience.change((s) => retainNextAction(s, null)))
                      setNotice('다음 행동 표시를 해제했습니다. 이전 글은 아래에 보관했습니다.');
                  }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-0b4ca83527bf

## X-4c6eead798ef

**이전에 남긴 다음 행동** · summary · user-control

- 실제 소스: [src/ui/brand-experience.tsx:228](../../../src/ui/brand-experience.tsx#L228)
- 연결 표면: [R01](../paths/R01.md), [O10](../paths/O10.md), [U09](../paths/U09.md)
- 직접 표시 조건: truthy: route === '/' ∧ truthy: Boolean(experience.state.nextHistory?.length)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-3a67a8576d63

**이 다음 행동 다시 표시** · Button · user-control

- 실제 소스: [src/ui/brand-experience.tsx:240](../../../src/ui/brand-experience.tsx#L240)
- 연결 표면: [R01](../paths/R01.md), [O10](../paths/O10.md), [U09](../paths/U09.md)
- 직접 표시 조건: truthy: route === '/' ∧ truthy: Boolean(experience.state.nextHistory?.length)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c981d815c385](../handlers/ui__brand-experience.md#h-c981d815c385) → [@callback:experience.change · H-c9b9475fa9c8](../handlers/ui__brand-experience.md#h-c9b9475fa9c8)

```tsx
() => {
                        if (
                          experience.change((state) =>
                            retainNextAction(state, {
                              location: previous.location,
                              body: previous.body,
                            }),
                          )
                        )
                          setNotice('이전 다음 행동을 다시 표시했습니다. 다른 원문도 보관합니다.');
                      }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-cff271b7a849

## X-296d6e9fd56c

**이전 다음 행동 더 보기** · Button · user-control

- 실제 소스: [src/ui/brand-experience.tsx:258](../../../src/ui/brand-experience.tsx#L258)
- 연결 표면: [R01](../paths/R01.md), [O10](../paths/O10.md), [U09](../paths/U09.md)
- 직접 표시 조건: truthy: route === '/' ∧ truthy: Boolean(experience.state.nextHistory?.length) ∧ truthy: (experience.state.nextHistory?.length ?? 0) > historyLimit
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ea75f23480b8](../handlers/ui__brand-experience.md#h-ea75f23480b8) → [@callback:setHistoryLimit · H-cf09aca6494a](../handlers/ui__brand-experience.md#h-cf09aca6494a)

```tsx
() => setHistoryLimit((n) => n + 20)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-d3abbda2887f

**이어가기** · Button · user-control

- 실제 소스: [src/ui/brand-experience.tsx:266](../../../src/ui/brand-experience.tsx#L266)
- 연결 표면: [R01](../paths/R01.md), [O10](../paths/O10.md), [U09](../paths/U09.md)
- 직접 표시 조건: truthy: route === '/' ∧ truthy: last
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c68eb44dbb15](../handlers/ui__brand-experience.md#h-c68eb44dbb15) → [resume · H-01e3e32dcce1](../handlers/ui__brand-experience.md#h-01e3e32dcce1)

```tsx
() => resume(last.route)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-b204d21ef6d9, B-f519cfe47eff

## X-e01fe501f30d

**자료 가져오기** · Button · user-control

- 실제 소스: [src/ui/brand-experience.tsx:271](../../../src/ui/brand-experience.tsx#L271)
- 연결 표면: [R01](../paths/R01.md), [O10](../paths/O10.md), [U09](../paths/U09.md)
- 직접 표시 조건: truthy: route === '/' ∧ truthy: !last
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d4eb90039bf6](../handlers/ui__brand-experience.md#h-d4eb90039bf6)

```tsx
() => navigate('/materials')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-34fbd01746de

**다음에 펼칠 곳 남기기** · Button · user-control

- 실제 소스: [src/ui/brand-experience.tsx:275](../../../src/ui/brand-experience.tsx#L275)
- 연결 표면: [R01](../paths/R01.md), [O10](../paths/O10.md), [U09](../paths/U09.md)
- 직접 표시 조건: truthy: route === '/'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ceea3757b38a](../handlers/ui__brand-experience.md#h-ceea3757b38a)

```tsx
() => {
                setNotice('');
                setOpen(true);
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-49d571e9f9e7

**(ErrorState · 동적/도형 조작)** · ErrorState · component-callback-contract

- 실제 소스: [src/ui/brand-experience.tsx:286](../../../src/ui/brand-experience.tsx#L286)
- 연결 표면: [R01](../paths/R01.md), [O10](../paths/O10.md), [U09](../paths/U09.md)
- 직접 표시 조건: truthy: route === '/' ∧ truthy: experience.error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRetry** → [@onRetry · H-b11c861472ad](../handlers/ui__brand-experience.md#h-b11c861472ad) → [@callback:experience.change · H-82b9deeab479](../handlers/ui__brand-experience.md#h-82b9deeab479)

```tsx
() => experience.change((s) => s)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-7c45148a5c8c

**ExperienceRecoveryControl · 조작/부품 영역** · ExperienceRecoveryControl · component-callback-contract

- 실제 소스: [src/ui/brand-experience.tsx:287](../../../src/ui/brand-experience.tsx#L287)
- 연결 표면: [R01](../paths/R01.md), [O10](../paths/O10.md), [O12](../paths/O12.md), [U09](../paths/U09.md), [U10](../paths/U10.md)
- 직접 표시 조건: truthy: route === '/' ∧ truthy: experience.error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRecovered** → 네이티브/호출자 동작

```tsx
experience.refresh
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-36288a3035a6

**다음에 펼칠 곳 남기기** · Button · user-control

- 실제 소스: [src/ui/brand-experience.tsx:295](../../../src/ui/brand-experience.tsx#L295)
- 연결 표면: [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O10](../paths/O10.md), [U09](../paths/U09.md)
- 직접 표시 조건: falsy: route === '/' ∧ truthy: resolveWorkLocation(data, route)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-0fc98577eeae](../handlers/ui__brand-experience.md#h-0fc98577eeae)

```tsx
() => {
                setNotice('');
                setOpen(true);
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-fc74e7395ef9

**다음에 펼칠 곳을 남겨둘까요?** · Modal · component-callback-contract

- 실제 소스: [src/ui/brand-experience.tsx:308](../../../src/ui/brand-experience.tsx#L308)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O10](../paths/O10.md), [U09](../paths/U09.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-cde8580f7f7a](../handlers/ui__brand-experience.md#h-cde8580f7f7a)

```tsx
() => setOpen(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-36afa0a2daaa

**다음에 할 일** · Textarea · user-control

- 실제 소스: [src/ui/brand-experience.tsx:316](../../../src/ui/brand-experience.tsx#L316)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O10](../paths/O10.md), [U09](../paths/U09.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: draft.blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-3ffa1591a574](../handlers/ui__brand-experience.md#h-3ffa1591a574)

```tsx
(e) => draft.input(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-a11a819331ea

**(ErrorState · 동적/도형 조작)** · ErrorState · component-callback-contract

- 실제 소스: [src/ui/brand-experience.tsx:323](../../../src/ui/brand-experience.tsx#L323)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O10](../paths/O10.md), [U09](../paths/U09.md)
- 직접 표시 조건: truthy: open ∧ truthy: draft.error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRetry** → 네이티브/호출자 동작

```tsx
draft.retry
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-3cd20c0f992b

**(ErrorState · 동적/도형 조작)** · ErrorState · component-callback-contract

- 실제 소스: [src/ui/brand-experience.tsx:325](../../../src/ui/brand-experience.tsx#L325)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O10](../paths/O10.md), [U09](../paths/U09.md)
- 직접 표시 조건: truthy: open ∧ truthy: experience.error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRetry** → 네이티브/호출자 동작

```tsx
experience.refresh
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-5d4ab584bc54

**다음 행동 남기기** · Button · user-control

- 실제 소스: [src/ui/brand-experience.tsx:329](../../../src/ui/brand-experience.tsx#L329)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O10](../paths/O10.md), [U09](../paths/U09.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: draft.blocked || !draft.text.trim()
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [saveNext · H-1d42b67292b6](../handlers/ui__brand-experience.md#h-1d42b67292b6) → [@callback:experience.change · H-f92edb35c8d8](../handlers/ui__brand-experience.md#h-f92edb35c8d8)

```tsx
saveNext
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ecf6cf992636, B-2ea5a9dcf93b, B-44c854400e4a, B-0ccd4bdf3efe, B-212038f207f2, B-8147d3c98b62

## X-a7c5b3f65431

**건너뛰기** · Button · user-control

- 실제 소스: [src/ui/brand-experience.tsx:336](../../../src/ui/brand-experience.tsx#L336)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O10](../paths/O10.md), [U09](../paths/U09.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-43463ac1bd8d](../handlers/ui__brand-experience.md#h-43463ac1bd8d)

```tsx
() => setOpen(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e42ddecb7240

**본문 읽기 폭** · Select · user-control

- 실제 소스: [src/ui/brand-experience.tsx:347](../../../src/ui/brand-experience.tsx#L347)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [U10](../paths/U10.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: readBlocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-15a3a8fb0712](../handlers/ui__brand-experience.md#h-15a3a8fb0712) → [@callback:change · H-6bad605e30f5](../handlers/ui__brand-experience.md#h-6bad605e30f5)

```tsx
(e) =>
          change((s) => ({ ...s, readingWidth: e.target.value === 'wide' ? 'wide' : 'normal' }))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-abeb4be7f0d9

## X-9e3c0a2aa9f8

**(ErrorState · 동적/도형 조작)** · ErrorState · component-callback-contract

- 실제 소스: [src/ui/brand-experience.tsx:359](../../../src/ui/brand-experience.tsx#L359)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [U10](../paths/U10.md)
- 직접 표시 조건: truthy: error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRetry** → 네이티브/호출자 동작

```tsx
refresh
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-fa4d4e8d96db

**ExperienceRecoveryControl · 조작/부품 영역** · ExperienceRecoveryControl · component-callback-contract

- 실제 소스: [src/ui/brand-experience.tsx:360](../../../src/ui/brand-experience.tsx#L360)
- 연결 표면: [R01](../paths/R01.md), [R04](../paths/R04.md), [R19](../paths/R19.md), [R20](../paths/R20.md), [R34](../paths/R34.md), [R39](../paths/R39.md), [R40](../paths/R40.md), [R41](../paths/R41.md), [O12](../paths/O12.md), [U10](../paths/U10.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRecovered** → 네이티브/호출자 동작

```tsx
refresh
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-86dd3f4f54f5

**이 주제에 남긴 생각 다시 보기** · summary · user-control

- 실제 소스: [src/ui/brand-experience.tsx:394](../../../src/ui/brand-experience.tsx#L394)
- 연결 표면: [R20](../paths/R20.md), [U39](../paths/U39.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-3bcdaa43599e

**이 주제의 원문·기록 열기** · a · user-control

- 실제 소스: [src/ui/brand-experience.tsx:399](../../../src/ui/brand-experience.tsx#L399)
- 연결 표면: [R20](../paths/R20.md), [U39](../paths/U39.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/node/${encodeURIComponent(nodeId)}``. 동적 ID는 현재 항목 값을 사용한다.

**onClick** → [@onClick · H-aa6ca7d43a7b](../handlers/ui__brand-experience.md#h-aa6ca7d43a7b) → [track · H-97e10fd99d40](../handlers/ui__brand-experience.md#h-97e10fd99d40) → [@callback:Array.from(
                document.querySelectorAll<HTMLElement>('[data-reading-anchor]'),
              ).find · H-f06068b4d518](../handlers/ui__brand-experience.md#h-f06068b4d518)

```tsx
(event) => {
              const anchor = Array.from(
                document.querySelectorAll<HTMLElement>('[data-reading-anchor]'),
              ).find((el) => el.dataset.readingAnchor === `record:${row.id}`);
              if (anchor) {
                event.preventDefault();
                anchor.scrollIntoView({ block: 'start', behavior: 'auto' });
              }
              track();
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f8c2fa487c95, B-c4559a2d3b85, B-c93c3194257d

반복: map(rows.slice(0, limit)) · 396행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-c92bda1f55dd

**메모 열기** · a · user-control

- 실제 소스: [src/ui/brand-experience.tsx:419](../../../src/ui/brand-experience.tsx#L419)
- 연결 표면: [R20](../paths/R20.md), [U39](../paths/U39.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/memos/${encodeURIComponent(row.id)}``. 동적 ID는 현재 항목 값을 사용한다.

**onClick** → [track · H-97e10fd99d40](../handlers/ui__brand-experience.md#h-97e10fd99d40)

```tsx
track
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-c4559a2d3b85, B-c93c3194257d

반복: map(notes.slice(0, limit)) · 416행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-9a1802c2e671

**이전 생각 더 보기** · Button · user-control

- 실제 소스: [src/ui/brand-experience.tsx:425](../../../src/ui/brand-experience.tsx#L425)
- 연결 표면: [R20](../paths/R20.md), [U39](../paths/U39.md)
- 직접 표시 조건: truthy: rows.length > limit || notes.length > limit
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-aa4c8386c5d8](../handlers/ui__brand-experience.md#h-aa4c8386c5d8) → [@callback:setLimit · H-b9410633dd8e](../handlers/ui__brand-experience.md#h-b9410633dd8e)

```tsx
() => setLimit((n) => n + 10)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-abfe97df73ab

**오늘 공부로 돌아가기** · a · user-control

- 실제 소스: [src/ui/brand-experience.tsx:570](../../../src/ui/brand-experience.tsx#L570)
- 연결 표면: [R38](../paths/R38.md), [R39](../paths/R39.md)
- 직접 표시 조건: truthy: page === '/about'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e29f2bb46329

**저장·복구 도움말** · a · user-control

- 실제 소스: [src/ui/brand-experience.tsx:578](../../../src/ui/brand-experience.tsx#L578)
- 연결 표면: [R38](../paths/R38.md), [R39](../paths/R39.md)
- 직접 표시 조건: truthy: page === '/about'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/help`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-2fd2bb412b9b

**현재 기록과 이력 내려받기** · Button · user-control

- 실제 소스: [src/ui/brand-experience.tsx:606](../../../src/ui/brand-experience.tsx#L606)
- 연결 표면: [R37](../paths/R37.md), [R39](../paths/R39.md)
- 직접 표시 조건: truthy: page === '/help'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [preserve · H-cccbb990eb19](../handlers/ui__brand-experience.md#h-cccbb990eb19)

```tsx
preserve
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-49d6cbb39e5b

**초안·첨부를 포함한 백업** · a · user-control

- 실제 소스: [src/ui/brand-experience.tsx:607](../../../src/ui/brand-experience.tsx#L607)
- 연결 표면: [R37](../paths/R37.md), [R39](../paths/R39.md)
- 직접 표시 조건: truthy: page === '/help'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/backup`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-449dfd9b6d5e

**초안 보관본 열기** · a · user-control

- 실제 소스: [src/ui/brand-experience.tsx:608](../../../src/ui/brand-experience.tsx#L608)
- 연결 표면: [R37](../paths/R37.md), [R39](../paths/R39.md)
- 직접 표시 조건: truthy: page === '/help'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/draft-archives`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-82e8798d6e59

**문제 메모** · Textarea · user-control

- 실제 소스: [src/ui/brand-experience.tsx:618](../../../src/ui/brand-experience.tsx#L618)
- 연결 표면: [R37](../paths/R37.md), [R39](../paths/R39.md)
- 직접 표시 조건: truthy: page === '/help'
- 실행 차단 disabled: supportDraft.blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-52385ecc42f3](../handlers/ui__brand-experience.md#h-52385ecc42f3)

```tsx
(e) => supportDraft.input(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-6fc61f8ceca3

**(ErrorState · 동적/도형 조작)** · ErrorState · component-callback-contract

- 실제 소스: [src/ui/brand-experience.tsx:626](../../../src/ui/brand-experience.tsx#L626)
- 연결 표면: [R37](../paths/R37.md), [R39](../paths/R39.md)
- 직접 표시 조건: truthy: page === '/help' ∧ truthy: supportDraft.error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRetry** → 네이티브/호출자 동작

```tsx
supportDraft.retry
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-bbb26f613088

**문제 메모 보관** · Button · user-control

- 실제 소스: [src/ui/brand-experience.tsx:629](../../../src/ui/brand-experience.tsx#L629)
- 연결 표면: [R37](../paths/R37.md), [R39](../paths/R39.md)
- 직접 표시 조건: truthy: page === '/help'
- 실행 차단 disabled: supportDraft.blocked || !supportDraft.text.trim()
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [saveRequest · H-222b7810bb1e](../handlers/ui__brand-experience.md#h-222b7810bb1e) → [@callback:experience.change · H-d12a88cce198](../handlers/ui__brand-experience.md#h-d12a88cce198) → [@callback:s.support.filter · H-5a08c64e404e](../handlers/ui__brand-experience.md#h-5a08c64e404e) → [@callback:s.support.find · H-5bc6b0f82a50](../handlers/ui__brand-experience.md#h-5bc6b0f82a50)

```tsx
saveRequest
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-51d8bf83868d, B-4c6efa873e1f, B-6ee469c1e57a

## X-34db8532c128

**메모 파일 내려받기** · Button · user-control

- 실제 소스: [src/ui/brand-experience.tsx:635](../../../src/ui/brand-experience.tsx#L635)
- 연결 표면: [R37](../paths/R37.md), [R39](../paths/R39.md)
- 직접 표시 조건: truthy: page === '/help'
- 실행 차단 disabled: !supportDraft.text.trim()
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-11271d1c0945](../handlers/ui__brand-experience.md#h-11271d1c0945)

```tsx
() =>
                  downloadText(
                    `manseeksong-inquiry-${supportId}.txt`,
                    `메모 식별 번호: ${supportId}\n상태: 이 기기에 작성 · 외부 전송 없음\n\n${supportDraft.text}`,
                  )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c4cf0d84a11d

**새 메모 작성** · Button · user-control

- 실제 소스: [src/ui/brand-experience.tsx:646](../../../src/ui/brand-experience.tsx#L646)
- 연결 표면: [R37](../paths/R37.md), [R39](../paths/R39.md)
- 직접 표시 조건: truthy: page === '/help'
- 실행 차단 disabled: supportDraft.blocked ||
                  Boolean(supportDraft.error) ||
                  !experience.state.support.some(
                    (r) => r.id === supportId && r.body === supportDraft.text,
                  )
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-74d5a6ad8ee8](../handlers/ui__brand-experience.md#h-74d5a6ad8ee8)

```tsx
() => {
                  setSupportId(crypto.randomUUID());
                  supportDraft.input('');
                  setNotice('이전 메모는 보관하고 새 메모를 엽니다.');
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c6446522fed0

**보관한 메모 찾기** · Textarea · user-control

- 실제 소스: [src/ui/brand-experience.tsx:668](../../../src/ui/brand-experience.tsx#L668)
- 연결 표면: [R37](../paths/R37.md), [R39](../paths/R39.md)
- 직접 표시 조건: truthy: page === '/help' ∧ truthy: experience.state.support.length > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-4f7debbaafe6](../handlers/ui__brand-experience.md#h-4f7debbaafe6)

```tsx
(e) => {
                  setQuery(e.target.value);
                  setLimit(40);
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-633ba1e0d674

**이 메모의 이전 글 {r.history?.length} 개** · summary · user-control

- 실제 소스: [src/ui/brand-experience.tsx:690](../../../src/ui/brand-experience.tsx#L690)
- 연결 표면: [R37](../paths/R37.md), [R39](../paths/R39.md)
- 직접 표시 조건: truthy: page === '/help' ∧ truthy: experience.state.support.length > 0 ∧ truthy: Boolean(r.history?.length)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(experience.state.support .filter((r) => !query || `${r.id} ${r.body}`.includes(query)) .slice() .reverse() .slice(0, limit)) · 676행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-af8fe20451fa

**이 메모 내려받기** · Button · user-control

- 실제 소스: [src/ui/brand-experience.tsx:701](../../../src/ui/brand-experience.tsx#L701)
- 연결 표면: [R37](../paths/R37.md), [R39](../paths/R39.md)
- 직접 표시 조건: truthy: page === '/help' ∧ truthy: experience.state.support.length > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-1de748ff46e1](../handlers/ui__brand-experience.md#h-1de748ff46e1)

```tsx
() =>
                        downloadText(
                          `manseeksong-inquiry-${r.id}.txt`,
                          `메모 식별 번호: ${r.id}\n상태: 이 기기에 보관 · 외부 전송 없음\n\n${r.body}`,
                        )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(experience.state.support .filter((r) => !query || `${r.id} ${r.body}`.includes(query)) .slice() .reverse() .slice(0, limit)) · 676행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-8093949acfee

**보관한 메모 더 보기** · Button · user-control

- 실제 소스: [src/ui/brand-experience.tsx:718](../../../src/ui/brand-experience.tsx#L718)
- 연결 표면: [R37](../paths/R37.md), [R39](../paths/R39.md)
- 직접 표시 조건: truthy: page === '/help' ∧ truthy: experience.state.support.length > 0 ∧ truthy: experience.state.support.filter((r) => !query || `${r.id} ${r.body}`.includes(query))
                .length > limit
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ec0d2f5752da](../handlers/ui__brand-experience.md#h-ec0d2f5752da) → [@callback:setLimit · H-c8ff96c85c0c](../handlers/ui__brand-experience.md#h-c8ff96c85c0c)

```tsx
() => setLimit((n) => n + 40)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-766814d0b8c7

**공유할 기록 찾기** · Textarea · user-control

- 실제 소스: [src/ui/brand-experience.tsx:736](../../../src/ui/brand-experience.tsx#L736)
- 연결 표면: [R36](../paths/R36.md), [R39](../paths/R39.md)
- 직접 표시 조건: truthy: page === '/my-progress'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-571de56c44d9](../handlers/ui__brand-experience.md#h-571de56c44d9)

```tsx
(e) => {
                setQuery(e.target.value);
                setLimit(40);
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-1afd26a1b508

**`${data.nodes.find((n) => n.id === r.targetId)?.name ?? '공부 기록'} · ${r.body.slice(0, 70)}`** · Checkbox · user-control

- 실제 소스: [src/ui/brand-experience.tsx:748](../../../src/ui/brand-experience.tsx#L748)
- 연결 표면: [R36](../paths/R36.md), [R39](../paths/R39.md)
- 직접 표시 조건: truthy: page === '/my-progress'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-2ba3814b7cae](../handlers/ui__brand-experience.md#h-2ba3814b7cae) → [@callback:setChosen · H-4bcd399a93d7](../handlers/ui__brand-experience.md#h-4bcd399a93d7) → [@callback:s.filter · H-9aae678e277c](../handlers/ui__brand-experience.md#h-9aae678e277c)

```tsx
(e) =>
                  setChosen((s) =>
                    e.target.checked ? [...s, r.id] : s.filter((id) => id !== r.id),
                  )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-340c22fb762d

반복: map(selectable.slice(0, limit)) · 747행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-2a5bfea2ccce

**기록 더 보기** · Button · user-control

- 실제 소스: [src/ui/brand-experience.tsx:760](../../../src/ui/brand-experience.tsx#L760)
- 연결 표면: [R36](../paths/R36.md), [R39](../paths/R39.md)
- 직접 표시 조건: truthy: page === '/my-progress' ∧ truthy: selectable.length > limit
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-e7faee3516f4](../handlers/ui__brand-experience.md#h-e7faee3516f4) → [@callback:setLimit · H-c48046109ed2](../handlers/ui__brand-experience.md#h-c48046109ed2)

```tsx
() => setLimit((n) => n + 40)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-becf556963d1

**선택한 기록의 이전 수정본도 포함** · Checkbox · user-control

- 실제 소스: [src/ui/brand-experience.tsx:762](../../../src/ui/brand-experience.tsx#L762)
- 연결 표면: [R36](../paths/R36.md), [R39](../paths/R39.md)
- 직접 표시 조건: truthy: page === '/my-progress'
- 실행 차단 disabled: !selected.length
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-cc889f93ab18](../handlers/ui__brand-experience.md#h-cc889f93ab18)

```tsx
(e) => setIncludeHistory(e.target.checked)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-abf658811b4c

**선택한 글만 내려받기** · Button · user-control

- 실제 소스: [src/ui/brand-experience.tsx:773](../../../src/ui/brand-experience.tsx#L773)
- 연결 표면: [R36](../paths/R36.md), [R39](../paths/R39.md)
- 직접 표시 조건: truthy: page === '/my-progress'
- 실행 차단 disabled: !selected.length
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-e368b8448636](../handlers/ui__brand-experience.md#h-e368b8448636)

```tsx
() => {
                downloadText('manseeksong-selected-thinking.txt', exportText);
                try {
                  trackExperience(data, 'share-download');
                } catch {
                  /* Optional count. */
                }
                setNotice(
                  '선택한 글의 파일 다운로드를 요청했습니다. 외부 공개나 게시를 하지 않았습니다.',
                );
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-704014dbef92, B-1dcd46da1f03

## X-814231077a8a

**이 기기에서 사용 흐름 관찰** · Checkbox · user-control

- 실제 소스: [src/ui/brand-experience.tsx:798](../../../src/ui/brand-experience.tsx#L798)
- 연결 표면: [R36](../paths/R36.md), [R39](../paths/R39.md)
- 직접 표시 조건: truthy: page === '/my-progress'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-8d8414308a27](../handlers/ui__brand-experience.md#h-8d8414308a27) → [@callback:experience.change · H-4da35dd78bd4](../handlers/ui__brand-experience.md#h-4da35dd78bd4)

```tsx
(e) =>
                experience.change((s) => ({
                  ...s,
                  measurement: {
                    ...s.measurement,
                    enabled: e.target.checked,
                    startedAt: e.target.checked
                      ? (s.measurement.startedAt ?? new Date().toISOString())
                      : s.measurement.startedAt,
                  },
                }))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-bd6d1580ed8a

## X-b6b3d520789d

**관찰 기록 내려받기** · Button · user-control

- 실제 소스: [src/ui/brand-experience.tsx:831](../../../src/ui/brand-experience.tsx#L831)
- 연결 표면: [R36](../paths/R36.md), [R39](../paths/R39.md)
- 직접 표시 조건: truthy: page === '/my-progress'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ac3e9687956f](../handlers/ui__brand-experience.md#h-ac3e9687956f)

```tsx
() =>
                  downloadText(
                    'manseeksong-use-observations.json',
                    JSON.stringify(experience.state.measurement, null, 2),
                    'application/json',
                  )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-efc3e2a4a0d7

**관찰 중단하고 기록 지우기** · Button · user-control

- 실제 소스: [src/ui/brand-experience.tsx:842](../../../src/ui/brand-experience.tsx#L842)
- 연결 표면: [R36](../paths/R36.md), [R39](../paths/R39.md)
- 직접 표시 조건: truthy: page === '/my-progress'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-401b6680f101](../handlers/ui__brand-experience.md#h-401b6680f101) → [@callback:experience.change · H-07134b5e1623](../handlers/ui__brand-experience.md#h-07134b5e1623)

```tsx
() =>
                  experience.change((s) => ({
                    ...s,
                    measurement: { enabled: false, startedAt: null, events: [] },
                  }))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-3655122e7b5b

**(ErrorState · 동적/도형 조작)** · ErrorState · component-callback-contract

- 실제 소스: [src/ui/brand-experience.tsx:857](../../../src/ui/brand-experience.tsx#L857)
- 연결 표면: [R36](../paths/R36.md), [R37](../paths/R37.md), [R38](../paths/R38.md), [R39](../paths/R39.md)
- 직접 표시 조건: truthy: experience.error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRetry** → 네이티브/호출자 동작

```tsx
experience.refresh
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e93fe880f688

**ExperienceRecoveryControl · 조작/부품 영역** · ExperienceRecoveryControl · component-callback-contract

- 실제 소스: [src/ui/brand-experience.tsx:858](../../../src/ui/brand-experience.tsx#L858)
- 연결 표면: [R36](../paths/R36.md), [R37](../paths/R37.md), [R38](../paths/R38.md), [R39](../paths/R39.md), [O12](../paths/O12.md), [U10](../paths/U10.md)
- 직접 표시 조건: truthy: experience.error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 오류·재시도 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onRecovered** → 네이티브/호출자 동작

```tsx
experience.refresh
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

