# src/ui/trace-editor.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-1246fb7ca991

**ActivityEditor · 조작/부품 영역** · ActivityEditor · component-callback-contract

- 실제 소스: [src/ui/trace-editor.tsx:39](../../../src/ui/trace-editor.tsx#L39)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md), [U19](../paths/U19.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-4068d3d10f07](../handlers/ui__trace-editor.md#h-4068d3d10f07)

```tsx
patch => onChange({
          ...trace,
          [id]: { ...item, ...patch, ...(stored ? { definition: stored } : {}) },
        })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-c0b44732ef2f

## X-7e2599320722

**공부 방법과 체크 · 선택** · summary · user-control

- 실제 소스: [src/ui/trace-editor.tsx:50](../../../src/ui/trace-editor.tsx#L50)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md), [U19](../paths/U19.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-5e5c0c2c8832

**이전·개인 기준의 기록 · {historical.length} 개** · summary · user-control

- 실제 소스: [src/ui/trace-editor.tsx:61](../../../src/ui/trace-editor.tsx#L61)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md), [U19](../paths/U19.md)
- 직접 표시 조건: truthy: historical.length > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-23d7ecfbc613

**TRACE 공부 방법 안내** · summary · user-control

- 실제 소스: [src/ui/trace-editor.tsx:67](../../../src/ui/trace-editor.tsx#L67)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md), [U19](../paths/U19.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-436fe88a5237

**action ?? label** · Checkbox · user-control

- 실제 소스: [src/ui/trace-editor.tsx:95](../../../src/ui/trace-editor.tsx#L95)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md), [U19](../paths/U19.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: confirmed
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-65d0c4cec398](../handlers/ui__trace-editor.md#h-65d0c4cec398)

```tsx
event => onChange({ status: event.target.checked ? 'checked' : 'unchecked' })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-45d85fdf3c37

## X-60e595074410

**{`상태·메모·반복${item.note || item.repeats?.length ? ' · 입력 있음' : ' · 선택'}`}** · summary · user-control

- 실제 소스: [src/ui/trace-editor.tsx:100](../../../src/ui/trace-editor.tsx#L100)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md), [U19](../paths/U19.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-06baeff58d5a

**활동 상태** · Select · user-control

- 실제 소스: [src/ui/trace-editor.tsx:104](../../../src/ui/trace-editor.tsx#L104)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md), [U19](../paths/U19.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-ed2effb9d07e](../handlers/ui__trace-editor.md#h-ed2effb9d07e)

```tsx
event => onChange({ status: event.target.value as ActivityStatus })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-3dc922b0bedf

**활동 메모 · 선택** · Textarea · user-control

- 실제 소스: [src/ui/trace-editor.tsx:108](../../../src/ui/trace-editor.tsx#L108)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md), [U19](../paths/U19.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-d79261d12c07](../handlers/ui__trace-editor.md#h-d79261d12c07)

```tsx
event => onChange({ note: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-b386701a0b91

**횟수의 기억 정도** · Select · user-control

- 실제 소스: [src/ui/trace-editor.tsx:118](../../../src/ui/trace-editor.tsx#L118)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md), [U19](../paths/U19.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-572f4b089c95](../handlers/ui__trace-editor.md#h-572f4b089c95) → [changeRepeat · H-933164406cb5](../handlers/ui__trace-editor.md#h-933164406cb5) → [@callback:(item.repeats ?? []).map · H-6cc90cac00f1](../handlers/ui__trace-editor.md#h-6cc90cac00f1)

```tsx
event => {
                    const kind = event.target.value as Repeat['kind'];
                    changeRepeat(repeat.id, { kind, count: kind === 'unknown' ? null : repeat.count });
                  }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-8f1075d93406, B-9514878de50b

반복: map(item.repeats ?? []) · 112행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-a17789ec2b89

**반복 횟수** · Input · user-control

- 실제 소스: [src/ui/trace-editor.tsx:126](../../../src/ui/trace-editor.tsx#L126)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md), [U19](../paths/U19.md)
- 직접 표시 조건: truthy: repeat.kind !== 'unknown'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-9ae8b774b517](../handlers/ui__trace-editor.md#h-9ae8b774b517) → [changeRepeat · H-933164406cb5](../handlers/ui__trace-editor.md#h-933164406cb5) → [@callback:(item.repeats ?? []).map · H-6cc90cac00f1](../handlers/ui__trace-editor.md#h-6cc90cac00f1)

```tsx
event => changeRepeat(repeat.id, { count: event.target.value === '' ? null : Number(event.target.value) })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f46c21519f0c, B-9514878de50b

반복: map(item.repeats ?? []) · 112행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-08bd0036646f

**반복 메모 · 선택** · Textarea · user-control

- 실제 소스: [src/ui/trace-editor.tsx:129](../../../src/ui/trace-editor.tsx#L129)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md), [U19](../paths/U19.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-b4b7236a66d1](../handlers/ui__trace-editor.md#h-b4b7236a66d1) → [changeRepeat · H-933164406cb5](../handlers/ui__trace-editor.md#h-933164406cb5) → [@callback:(item.repeats ?? []).map · H-6cc90cac00f1](../handlers/ui__trace-editor.md#h-6cc90cac00f1)

```tsx
event => changeRepeat(repeat.id, { note: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-9514878de50b

반복: map(item.repeats ?? []) · 112행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-ceb317e20b52

**추가 반복 {index + 1} 삭제** · Button · user-control

- 실제 소스: [src/ui/trace-editor.tsx:131](../../../src/ui/trace-editor.tsx#L131)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md), [U19](../paths/U19.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-3dad3df6e5ec](../handlers/ui__trace-editor.md#h-3dad3df6e5ec) → [@callback:(item.repeats ?? []).filter · H-48989eb757f0](../handlers/ui__trace-editor.md#h-48989eb757f0) → [@callback:setRemoved · H-e6b0e94df2af](../handlers/ui__trace-editor.md#h-e6b0e94df2af)

```tsx
() => {
                    setRemoved(previous => [...previous, { repeat, index, nextId: item.repeats?.[index + 1]?.id }]);
                    onChange({ repeats: (item.repeats ?? []).filter(row => row.id !== repeat.id) });
                  }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(item.repeats ?? []) · 112행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-2912868de302

**한 번 더 함** · Button · user-control

- 실제 소스: [src/ui/trace-editor.tsx:139](../../../src/ui/trace-editor.tsx#L139)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md), [U19](../paths/U19.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-69fa3aa84eca](../handlers/ui__trace-editor.md#h-69fa3aa84eca)

```tsx
() => onChange({ repeats: [
            ...(item.repeats ?? []), { id: crypto.randomUUID(), kind: 'exact', count: 1 },
          ] })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-d9910d75a2e7

**반복 삭제 되돌리기** · Button · user-control

- 실제 소스: [src/ui/trace-editor.tsx:144](../../../src/ui/trace-editor.tsx#L144)
- 연결 표면: [R05](../paths/R05.md), [R21](../paths/R21.md), [U19](../paths/U19.md)
- 직접 표시 조건: truthy: removed.length > 0
- 실행 차단 disabled: (item.repeats ?? []).some(repeat => repeat.id === removed.at(-1)!.repeat.id)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-00fd9c4ed1f4](../handlers/ui__trace-editor.md#h-00fd9c4ed1f4) → [@callback:setRemoved · H-5a6d23191427](../handlers/ui__trace-editor.md#h-5a6d23191427) → [@callback:repeats.findIndex · H-e424d2054da5](../handlers/ui__trace-editor.md#h-e424d2054da5)

```tsx
() => {
              const last = removed.at(-1)!;
              const repeats = [...(item.repeats ?? [])];
              const nextIndex = repeats.findIndex(repeat => repeat.id === last.nextId);
              repeats.splice(nextIndex < 0 ? Math.min(last.index, repeats.length) : nextIndex, 0, last.repeat);
              onChange({ repeats });
              setRemoved(previous => previous.slice(0, -1));
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-c6065ee87119

