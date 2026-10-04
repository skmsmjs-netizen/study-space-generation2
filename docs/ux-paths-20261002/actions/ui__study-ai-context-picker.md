# src/ui/study-ai-context-picker.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-daefbf4fcec8

**기존 기록 가져오기** · summary · user-control

- 실제 소스: [src/ui/study-ai-context-picker.tsx:70](../../../src/ui/study-ai-context-picker.tsx#L70)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U37](../paths/U37.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-9518854ef022

**가져올 기록 찾기** · Input · user-control

- 실제 소스: [src/ui/study-ai-context-picker.tsx:76](../../../src/ui/study-ai-context-picker.tsx#L76)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U37](../paths/U37.md)
- 직접 표시 조건: interactive-when-falsy: disabled || applying
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-1c32aadc55d6](../handlers/ui__study-ai-context-picker.md#h-1c32aadc55d6)

```tsx
(event) => {
            setQuery(event.target.value);
            setLimit(30);
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-efdcc6206097

**row.label** · Checkbox · user-control

- 실제 소스: [src/ui/study-ai-context-picker.tsx:89](../../../src/ui/study-ai-context-picker.tsx#L89)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U37](../paths/U37.md)
- 직접 표시 조건: interactive-when-falsy: disabled || applying
- 실행 차단 disabled: !active.includes(row.key) && active.length >= 20
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-315d33264111](../handlers/ui__study-ai-context-picker.md#h-315d33264111) → [@callback:active.filter · H-1ffc0de169b7](../handlers/ui__study-ai-context-picker.md#h-1ffc0de169b7)

```tsx
(event) =>
                  setSelected(
                    event.target.checked
                      ? [...active, row.key]
                      : active.filter((key) => key !== row.key),
                  )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-362c308b3362

반복: map(filtered.slice(0, limit)) · 87행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-4ade0c33f0ca

**다음 기록 더 보기** · Button · user-control

- 실제 소스: [src/ui/study-ai-context-picker.tsx:106](../../../src/ui/study-ai-context-picker.tsx#L106)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U37](../paths/U37.md)
- 직접 표시 조건: interactive-when-falsy: disabled || applying ∧ truthy: filtered.length > limit
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-04c29477894b](../handlers/ui__study-ai-context-picker.md#h-04c29477894b)

```tsx
() => setLimit(limit + 30)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-770a308902d7

**선택한 기록 가져오기** · Button · user-control

- 실제 소스: [src/ui/study-ai-context-picker.tsx:114](../../../src/ui/study-ai-context-picker.tsx#L114)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U37](../paths/U37.md)
- 직접 표시 조건: interactive-when-falsy: disabled || applying
- 실행 차단 disabled: !active.length
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d6f4dc5fda70](../handlers/ui__study-ai-context-picker.md#h-d6f4dc5fda70) → [apply · H-f14aa7f45460](../handlers/ui__study-ai-context-picker.md#h-f14aa7f45460)

```tsx
() => void apply()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-84dedf41eadb, B-18aac8cb32bb, B-8f7938e44a3f, B-7347a3d29986, B-0c2f20c223a7, B-53f6cd9bf6e2, B-d96a7149971f, B-bcb49555275b, B-24c62ce9f6ba

## X-d1d337416e4d

**선택 해제** · Button · user-control

- 실제 소스: [src/ui/study-ai-context-picker.tsx:117](../../../src/ui/study-ai-context-picker.tsx#L117)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U37](../paths/U37.md)
- 직접 표시 조건: interactive-when-falsy: disabled || applying
- 실행 차단 disabled: !active.length
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-aed84775166b](../handlers/ui__study-ai-context-picker.md#h-aed84775166b)

```tsx
() => setSelected([])
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e3add0850d23

**마지막 가져오기 되돌리기** · Button · user-control

- 실제 소스: [src/ui/study-ai-context-picker.tsx:121](../../../src/ui/study-ai-context-picker.tsx#L121)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U37](../paths/U37.md)
- 직접 표시 조건: interactive-when-falsy: disabled || applying ∧ truthy: undo
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-22be6a327cf0](../handlers/ui__study-ai-context-picker.md#h-22be6a327cf0) → [apply · H-f14aa7f45460](../handlers/ui__study-ai-context-picker.md#h-f14aa7f45460)

```tsx
() => void apply(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-84dedf41eadb, B-18aac8cb32bb, B-8f7938e44a3f, B-7347a3d29986, B-0c2f20c223a7, B-53f6cd9bf6e2, B-d96a7149971f, B-bcb49555275b, B-24c62ce9f6ba

## X-b0d245f1b2d0

**details · 조작/부품 영역** · details · event-surface

- 실제 소스: [src/ui/study-ai-context-picker.tsx:136](../../../src/ui/study-ai-context-picker.tsx#L136)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U37](../paths/U37.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onToggle** → [@onToggle · H-cfaff3e3163d](../handlers/ui__study-ai-context-picker.md#h-cfaff3e3163d)

```tsx
(event) => setOpen(event.currentTarget.open)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-29d6d181eb62

**가져올 원문 확인** · summary · user-control

- 실제 소스: [src/ui/study-ai-context-picker.tsx:137](../../../src/ui/study-ai-context-picker.tsx#L137)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U37](../paths/U37.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-2d0a2029e540

**원본 열기** · a · user-control

- 실제 소스: [src/ui/study-ai-context-picker.tsx:141](../../../src/ui/study-ai-context-picker.tsx#L141)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U37](../paths/U37.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `row.href`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

