# src/ui/math-templates.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-505cd997c09e

**label** · Input · user-control

- 실제 소스: [src/ui/math-templates.tsx:63](../../../src/ui/math-templates.tsx#L63)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 저장·변경 요청 · 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-2948c270990f](../handlers/ui__math-templates.md#h-2948c270990f)

```tsx
(e) => {
        setText(e.target.value);
        setDirty(true);
        setError('');
      }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onBlur** → [commit · H-199c2e1ead20](../handlers/ui__math-templates.md#h-199c2e1ead20)

```tsx
commit
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-0a85fce8672a, B-269630e038d9, B-c491055f2fe4, B-139b3c506f72

**onKeyDown** → [@onKeyDown · H-a44d2d3cd2db](../handlers/ui__math-templates.md#h-a44d2d3cd2db) → [format · H-f433f0f72333](../handlers/ui__math-templates.md#h-f433f0f72333) → [commit · H-199c2e1ead20](../handlers/ui__math-templates.md#h-199c2e1ead20)

```tsx
(e) => {
        if (e.key === 'Enter') commit();
        if (e.key === 'Escape') {
          setText(format(value));
          setDirty(false);
          setError('');
        }
      }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-326f12f4a8fb, B-eca0be4de376, B-4cbb97c01de9, B-0a85fce8672a, B-269630e038d9, B-c491055f2fe4, B-139b3c506f72

## X-ffbdf15c1049

**CurvePlot · 조작/부품 영역** · CurvePlot · component-callback-contract

- 실제 소스: [src/ui/math-templates.tsx:314](../../../src/ui/math-templates.tsx#L314)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U31](../paths/U31.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: result &&
          item.kind !== 'formula' &&
          !(item.kind === 'data' && !item.dataset?.points.length) ∧ truthy: result.legacy
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onZoomReady** → 네이티브/호출자 동작

```tsx
setZoomReady
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onView** → [rememberView · H-61ba86c94860](../handlers/ui__math-templates.md#h-61ba86c94860) → [@callback:current.current.entries.map · H-3528e452f045](../handlers/ui__math-templates.md#h-3528e452f045) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38) → [@callback:current.current.entries.find · H-418630e03c85](../handlers/ui__math-templates.md#h-418630e03c85)

```tsx
rememberView
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-0283470388ba, B-d06013016207, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

## X-bd8bb0d502bc

**＋ 확대** · Button · user-control

- 실제 소스: [src/ui/math-templates.tsx:325](../../../src/ui/math-templates.tsx#L325)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: result &&
          item.kind !== 'formula' &&
          !(item.kind === 'data' && !item.dataset?.points.length) ∧ truthy: result.legacy
- 실행 차단 disabled: !zoomReady
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-56bd2ae0a865](../handlers/ui__math-templates.md#h-56bd2ae0a865)

```tsx
() => zoom.current?.(mathPlotZoomStep)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-1ce424e03410

**− 축소** · Button · user-control

- 실제 소스: [src/ui/math-templates.tsx:328](../../../src/ui/math-templates.tsx#L328)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: result &&
          item.kind !== 'formula' &&
          !(item.kind === 'data' && !item.dataset?.points.length) ∧ truthy: result.legacy
- 실행 차단 disabled: !zoomReady
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-6a54a1675b14](../handlers/ui__math-templates.md#h-6a54a1675b14)

```tsx
() => zoom.current?.(1 / mathPlotZoomStep)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-f56324beb849

**보기 초기화** · Button · user-control

- 실제 소스: [src/ui/math-templates.tsx:334](../../../src/ui/math-templates.tsx#L334)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: result &&
          item.kind !== 'formula' &&
          !(item.kind === 'data' && !item.dataset?.points.length) ∧ truthy: result.legacy
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-f67e8ac08bce](../handlers/ui__math-templates.md#h-f67e8ac08bce) → [@callback:setViewRevision · H-ce07e7434fe5](../handlers/ui__math-templates.md#h-ce07e7434fe5)

```tsx
() => setViewRevision((v) => v + 1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-2546004bd91a

**Plot · 조작/부품 영역** · Plot · component-callback-contract

- 실제 소스: [src/ui/math-templates.tsx:338](../../../src/ui/math-templates.tsx#L338)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U31](../paths/U31.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: result &&
          item.kind !== 'formula' &&
          !(item.kind === 'data' && !item.dataset?.points.length) ∧ falsy: result.legacy
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onView** → [rememberView · H-61ba86c94860](../handlers/ui__math-templates.md#h-61ba86c94860) → [@callback:current.current.entries.map · H-3528e452f045](../handlers/ui__math-templates.md#h-3528e452f045) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38) → [@callback:current.current.entries.find · H-418630e03c85](../handlers/ui__math-templates.md#h-418630e03c85)

```tsx
rememberView
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-0283470388ba, B-d06013016207, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

## X-0ff40cd12a3a

**곡면 보기 등고선 보기** · Button · user-control

- 실제 소스: [src/ui/math-templates.tsx:352](../../../src/ui/math-templates.tsx#L352)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: item.kind === 'surface'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-9512095c4ec8](../handlers/ui__math-templates.md#h-9512095c4ec8) → [change · H-46fb5e8c4f31](../handlers/ui__math-templates.md#h-46fb5e8c4f31) → [@callback:current.current.entries.map · H-9b221b5d48bb](../handlers/ui__math-templates.md#h-9b221b5d48bb) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38)

```tsx
() => {
              const next = !alternate;
              setAlternate(next);
              change({ ...item, view: { ...item.view, alternate: next } });
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-da7b5ecdf08f, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

## X-e835f7e32b8e

**`변수 ${p.symbol}`** · input · user-control

- 실제 소스: [src/ui/math-templates.tsx:401](../../../src/ui/math-templates.tsx#L401)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: item.expressions.some((source) => new RegExp(`\\b${p.symbol}\\b`).test(source))
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-f8fa9e53205b](../handlers/ui__math-templates.md#h-f8fa9e53205b) → [@callback:item.parameters.map · H-22f4d4703b02](../handlers/ui__math-templates.md#h-22f4d4703b02) → [change · H-46fb5e8c4f31](../handlers/ui__math-templates.md#h-46fb5e8c4f31) → [@callback:current.current.entries.map · H-9b221b5d48bb](../handlers/ui__math-templates.md#h-9b221b5d48bb) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38)

```tsx
(e) =>
                      change({
                        ...item,
                        parameters: item.parameters.map((q, j) =>
                          j === i ? { ...q, value: Number(e.target.value) } : q,
                        ),
                      })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-9de9ea691727, B-da7b5ecdf08f, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

반복: map(item.parameters) · 394행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-aa0add216725

**`${p.symbol} 값`** · NumberField · component-callback-contract

- 실제 소스: [src/ui/math-templates.tsx:418](../../../src/ui/math-templates.tsx#L418)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: item.expressions.some((source) => new RegExp(`\\b${p.symbol}\\b`).test(source))
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onCommit** → [@onCommit · H-fddfdf58384a](../handlers/ui__math-templates.md#h-fddfdf58384a) → [@callback:item.parameters.map · H-d292ad909233](../handlers/ui__math-templates.md#h-d292ad909233) → [change · H-46fb5e8c4f31](../handlers/ui__math-templates.md#h-46fb5e8c4f31) → [@callback:current.current.entries.map · H-9b221b5d48bb](../handlers/ui__math-templates.md#h-9b221b5d48bb) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38)

```tsx
(v) => {
                      if (v < p.min || v > p.max) {
                        setError(`${p.label}: ${p.min}부터 ${p.max} 사이로 입력해 주세요.`);
                        return;
                      }
                      change({
                        ...item,
                        parameters: item.parameters.map((q, j) =>
                          j === i ? { ...q, value: v } : q,
                        ),
                      });
                    }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-4d8722cbacf1, B-4cde858541c5, B-da7b5ecdf08f, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

반복: map(item.parameters) · 394행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-ed5cd50f310c

**`${axis} 위치`** · input · user-control

- 실제 소스: [src/ui/math-templates.tsx:443](../../../src/ui/math-templates.tsx#L443)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-83adc866bb08](../handlers/ui__math-templates.md#h-83adc866bb08) → [change · H-46fb5e8c4f31](../handlers/ui__math-templates.md#h-46fb5e8c4f31) → [@callback:current.current.entries.map · H-9b221b5d48bb](../handlers/ui__math-templates.md#h-9b221b5d48bb) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38)

```tsx
(e) =>
                  change({ ...item, cursor: { ...item.cursor, [axis]: Number(e.target.value) } })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-da7b5ecdf08f, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

반복: map(spec.axes) · 438행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-a0b9c066dad3

**`${axis} 위치 값`** · NumberField · component-callback-contract

- 실제 소스: [src/ui/math-templates.tsx:455](../../../src/ui/math-templates.tsx#L455)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onCommit** → [@onCommit · H-cb09892930ae](../handlers/ui__math-templates.md#h-cb09892930ae) → [change · H-46fb5e8c4f31](../handlers/ui__math-templates.md#h-46fb5e8c4f31) → [@callback:current.current.entries.map · H-9b221b5d48bb](../handlers/ui__math-templates.md#h-9b221b5d48bb) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38)

```tsx
(v) => {
                  const [lo, hi] = item.ranges[axis];
                  if (v < lo || v > hi || (axis === 'n' && !Number.isInteger(v))) {
                    setError('위치는 구간 안의 값으로 입력해 주세요.');
                    return;
                  }
                  change({ ...item, cursor: { ...item.cursor, [axis]: v } });
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-02e7c1b0518b, B-da7b5ecdf08f, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

반복: map(spec.axes) · 438행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-d6cf8cde1db2

**`${item.kind === 'ode' ? 'y' : ['x', 'y'][i]}(${format(item.ranges.t[0])}) 초기값`** · NumberField · component-callback-contract

- 실제 소스: [src/ui/math-templates.tsx:474](../../../src/ui/math-templates.tsx#L474)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: item.initial.length > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onCommit** → [@onCommit · H-16215b0b89f8](../handlers/ui__math-templates.md#h-16215b0b89f8) → [@callback:item.initial.map · H-4ef8da5c73b6](../handlers/ui__math-templates.md#h-4ef8da5c73b6) → [change · H-46fb5e8c4f31](../handlers/ui__math-templates.md#h-46fb5e8c4f31) → [@callback:current.current.entries.map · H-9b221b5d48bb](../handlers/ui__math-templates.md#h-9b221b5d48bb) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38)

```tsx
(value) =>
                  change({ ...item, initial: item.initial.map((n, j) => (i === j ? value : n)) })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-15a688ede720, B-da7b5ecdf08f, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

반복: map(item.initial) · 473행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-b40b31307451

**넣어 둔 내용** · Select · user-control

- 실제 소스: [src/ui/math-templates.tsx:492](../../../src/ui/math-templates.tsx#L492)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-4fb6b7e9209a](../handlers/ui__math-templates.md#h-4fb6b7e9209a) → [activate · H-b357db692ad4](../handlers/ui__math-templates.md#h-b357db692ad4) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38) → [@callback:setViewRevision · H-8d64c0b8ed69](../handlers/ui__math-templates.md#h-8d64c0b8ed69) → [@callback:current.current.entries.find · H-70f2d070c99d](../handlers/ui__math-templates.md#h-70f2d070c99d)

```tsx
(e) => activate(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

## X-849a76ec78ec

**새 내용 유형** · Select · user-control

- 실제 소스: [src/ui/math-templates.tsx:499](../../../src/ui/math-templates.tsx#L499)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-d08ea1cde9a0](../handlers/ui__math-templates.md#h-d08ea1cde9a0) → [add · H-aed521388cab](../handlers/ui__math-templates.md#h-aed521388cab) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38)

```tsx
(e) => add(e.target.value as TemplateKind)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-79cc9326613a, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

## X-282444cc8cd7

**내용 파일 가져오기** · Button · user-control

- 실제 소스: [src/ui/math-templates.tsx:511](../../../src/ui/math-templates.tsx#L511)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-e7bf708f59a4](../handlers/ui__math-templates.md#h-e7bf708f59a4)

```tsx
() => file.current?.click()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-ecc446802b02

**내용 형식 파일** · Button · user-control

- 실제 소스: [src/ui/math-templates.tsx:512](../../../src/ui/math-templates.tsx#L512)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-6a166f4d6d0a](../handlers/ui__math-templates.md#h-6a166f4d6d0a) → [download · H-304155101b93](../handlers/ui__math-templates.md#h-304155101b93) → [@callback:setTimeout · H-ff81474d162e](../handlers/ui__math-templates.md#h-ff81474d162e)

```tsx
() =>
            download(
              '수식·내용 작성 형식.json',
              JSON.stringify(TEMPLATE_KINDS.map(defaultTemplate), null, 2),
            )
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e51fa353a70c

**수식 내용 JSON 파일** · input · user-control

- 실제 소스: [src/ui/math-templates.tsx:522](../../../src/ui/math-templates.tsx#L522)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: visible-when-falsy: true
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-167c07c997dc](../handlers/ui__math-templates.md#h-167c07c997dc) → [accept · H-ea818ade0344](../handlers/ui__math-templates.md#h-ea818ade0344) → [@callback:entries.find · H-1ec634dd189c](../handlers/ui__math-templates.md#h-1ec634dd189c) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38) → [@callback:entries.find · H-1bb86e962b13](../handlers/ui__math-templates.md#h-1bb86e962b13)

```tsx
async (e) => {
            const input = e.currentTarget,
              f = input.files?.[0];
            if (!f) return;
            try {
              if (f.size > 2_000_000) throw Error('내용 파일은 2MB 이내로 나누어 주세요.');
              accept(importTemplates(await f.text()));
            } catch (error) {
              setError(error instanceof Error ? error.message : '내용을 가져오지 못했습니다.');
            } finally {
              input.value = '';
            }
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-bd7200554486, B-08e42968bcc9, B-776b64f0c464, B-ddf870c24c93, B-b1d175108103, B-c42d99de6ea0, B-f3304682b841, B-8b10e7794a0a, B-86fb51bd1361, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

## X-964096c45d89

**기존 초안 다시 읽기 초안 다시 보관** · Button · user-control

- 실제 소스: [src/ui/math-templates.tsx:547](../../../src/ui/math-templates.tsx#L547)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ce7f20822ec7](../handlers/ui__math-templates.md#h-ce7f20822ec7) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38)

```tsx
() => {
                if (blocked.current) {
                  try {
                    const restored = readTemplateWorkspace(key);
                    blocked.current = false;
                    update(restored);
                  } catch {
                    setError('기존 보관값을 아직 읽지 못했습니다. 파일로 보관해 주세요.');
                  }
                } else update(current.current);
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ed3d5a5de724, B-9e34a5bd606c, B-81cdff65a4a6, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

## X-80e051813e29

**현재 초안 파일로 보관** · Button · user-control

- 실제 소스: [src/ui/math-templates.tsx:562](../../../src/ui/math-templates.tsx#L562)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-42b676a8e84f](../handlers/ui__math-templates.md#h-42b676a8e84f) → [download · H-304155101b93](../handlers/ui__math-templates.md#h-304155101b93) → [@callback:setTimeout · H-ff81474d162e](../handlers/ui__math-templates.md#h-ff81474d162e)

```tsx
() =>
                download('수식·내용 초안.json', JSON.stringify(current.current, null, 2))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-896b9a2582a3

**전체 화면으로 살펴보기** · Button · user-control

- 실제 소스: [src/ui/math-templates.tsx:618](../../../src/ui/math-templates.tsx#L618)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: hasGraph
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-e855f561007e](../handlers/ui__math-templates.md#h-e855f561007e)

```tsx
() => setExpanded(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-086280ab511d

**`${item.title || spec.label} · 전체 화면`** · Modal · component-callback-contract

- 실제 소스: [src/ui/math-templates.tsx:620](../../../src/ui/math-templates.tsx#L620)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: expanded
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-d083a56c100e](../handlers/ui__math-templates.md#h-d083a56c100e)

```tsx
() => setExpanded(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-d613f20e4f0f

**전체 화면의 내용** · Select · user-control

- 실제 소스: [src/ui/math-templates.tsx:626](../../../src/ui/math-templates.tsx#L626)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: expanded
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-497f0c592c0b](../handlers/ui__math-templates.md#h-497f0c592c0b) → [activate · H-b357db692ad4](../handlers/ui__math-templates.md#h-b357db692ad4) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38) → [@callback:setViewRevision · H-8d64c0b8ed69](../handlers/ui__math-templates.md#h-8d64c0b8ed69) → [@callback:current.current.entries.find · H-70f2d070c99d](../handlers/ui__math-templates.md#h-70f2d070c99d)

```tsx
(e) => activate(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

## X-41f069fd9f03

**수식·구간·내용 편집** · summary · user-control

- 실제 소스: [src/ui/math-templates.tsx:640](../../../src/ui/math-templates.tsx#L640)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c31db219f1da

**ParameterEditor · 조작/부품 영역** · ParameterEditor · component-callback-contract

- 실제 소스: [src/ui/math-templates.tsx:641](../../../src/ui/math-templates.tsx#L641)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: spec.fields.length > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [change · H-46fb5e8c4f31](../handlers/ui__math-templates.md#h-46fb5e8c4f31) → [@callback:current.current.entries.map · H-9b221b5d48bb](../handlers/ui__math-templates.md#h-9b221b5d48bb) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38)

```tsx
change
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-da7b5ecdf08f, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

## X-3fece494bc3b

**내용 제목** · Input · user-control

- 실제 소스: [src/ui/math-templates.tsx:642](../../../src/ui/math-templates.tsx#L642)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-ed548d2ec937](../handlers/ui__math-templates.md#h-ed548d2ec937) → [change · H-46fb5e8c4f31](../handlers/ui__math-templates.md#h-46fb5e8c4f31) → [@callback:current.current.entries.map · H-9b221b5d48bb](../handlers/ui__math-templates.md#h-9b221b5d48bb) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38)

```tsx
(e) => change({ ...item, title: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-da7b5ecdf08f, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

## X-5bac5ba3b819

**과목 (선택)** · Input · user-control

- 실제 소스: [src/ui/math-templates.tsx:647](../../../src/ui/math-templates.tsx#L647)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-cdd8ac8966fe](../handlers/ui__math-templates.md#h-cdd8ac8966fe) → [change · H-46fb5e8c4f31](../handlers/ui__math-templates.md#h-46fb5e8c4f31) → [@callback:current.current.entries.map · H-9b221b5d48bb](../handlers/ui__math-templates.md#h-9b221b5d48bb) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38)

```tsx
(e) => change({ ...item, subject: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-da7b5ecdf08f, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

## X-bfb48ddef182

**살펴볼 질문 (선택)** · Textarea · user-control

- 실제 소스: [src/ui/math-templates.tsx:652](../../../src/ui/math-templates.tsx#L652)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-4c9195b7d936](../handlers/ui__math-templates.md#h-4c9195b7d936) → [change · H-46fb5e8c4f31](../handlers/ui__math-templates.md#h-46fb5e8c4f31) → [@callback:current.current.entries.map · H-9b221b5d48bb](../handlers/ui__math-templates.md#h-9b221b5d48bb) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38)

```tsx
(e) => change({ ...item, question: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-da7b5ecdf08f, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

## X-0310d2254436

**label** · Input · user-control

- 실제 소스: [src/ui/math-templates.tsx:658](../../../src/ui/math-templates.tsx#L658)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-f2f897be4647](../handlers/ui__math-templates.md#h-f2f897be4647) → [@callback:item.expressions.map · H-8e272662faff](../handlers/ui__math-templates.md#h-8e272662faff) → [change · H-46fb5e8c4f31](../handlers/ui__math-templates.md#h-46fb5e8c4f31) → [@callback:current.current.entries.map · H-9b221b5d48bb](../handlers/ui__math-templates.md#h-9b221b5d48bb) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38)

```tsx
(e) =>
                change({
                  ...item,
                  expressions: item.expressions.map((s, j) => (i === j ? e.target.value : s)),
                })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-00be1c94b98f, B-da7b5ecdf08f, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

반복: map(spec.fields) · 657행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-d6909a850aab

**`${axis} ${item.kind === 'function' || item.kind === 'curve' ? '슬라이더' : '구간'} ${index ? '끝' : '시작'}`** · NumberField · component-callback-contract

- 실제 소스: [src/ui/math-templates.tsx:674](../../../src/ui/math-templates.tsx#L674)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onCommit** → [@onCommit · H-ffe0c059f203](../handlers/ui__math-templates.md#h-ffe0c059f203) → [change · H-46fb5e8c4f31](../handlers/ui__math-templates.md#h-46fb5e8c4f31) → [@callback:current.current.entries.map · H-9b221b5d48bb](../handlers/ui__math-templates.md#h-9b221b5d48bb) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38)

```tsx
(value) => {
                    const range = [...item.ranges[axis]] as [number, number];
                    range[index] = value;
                    change({
                      ...item,
                      ranges: { ...item.ranges, [axis]: range },
                      cursor: {
                        ...item.cursor,
                        [axis]: Math.max(range[0], Math.min(range[1], item.cursor[axis])),
                      },
                    });
                  }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-da7b5ecdf08f, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

반복: map([0, 1]) · 673행; map(spec.axes) · 671행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-ff171093d810

**LaTeX 수식 (줄마다 하나)** · Textarea · user-control

- 실제 소스: [src/ui/math-templates.tsx:695](../../../src/ui/math-templates.tsx#L695)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: item.kind === 'formula'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-09398841e6bb](../handlers/ui__math-templates.md#h-09398841e6bb) → [change · H-46fb5e8c4f31](../handlers/ui__math-templates.md#h-46fb5e8c4f31) → [@callback:current.current.entries.map · H-9b221b5d48bb](../handlers/ui__math-templates.md#h-9b221b5d48bb) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38)

```tsx
(e) => change({ ...item, tex: e.target.value.split('\n').filter(Boolean) })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-da7b5ecdf08f, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

## X-0590c7b5ee17

**가로축 이름·단위** · Input · user-control

- 실제 소스: [src/ui/math-templates.tsx:705](../../../src/ui/math-templates.tsx#L705)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: item.kind === 'data'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-14cfeb293b37](../handlers/ui__math-templates.md#h-14cfeb293b37) → [change · H-46fb5e8c4f31](../handlers/ui__math-templates.md#h-46fb5e8c4f31) → [@callback:current.current.entries.map · H-9b221b5d48bb](../handlers/ui__math-templates.md#h-9b221b5d48bb) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38)

```tsx
(e) =>
                    change({ ...item, dataset: { ...item.dataset!, xLabel: e.target.value } })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-da7b5ecdf08f, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

## X-843e18848c04

**세로축 이름·단위** · Input · user-control

- 실제 소스: [src/ui/math-templates.tsx:712](../../../src/ui/math-templates.tsx#L712)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: item.kind === 'data'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-939b9f3d40a5](../handlers/ui__math-templates.md#h-939b9f3d40a5) → [change · H-46fb5e8c4f31](../handlers/ui__math-templates.md#h-46fb5e8c4f31) → [@callback:current.current.entries.map · H-9b221b5d48bb](../handlers/ui__math-templates.md#h-9b221b5d48bb) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38)

```tsx
(e) =>
                    change({ ...item, dataset: { ...item.dataset!, yLabel: e.target.value } })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-da7b5ecdf08f, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

## X-a2491b1a063f

**자료 표현** · Select · user-control

- 실제 소스: [src/ui/math-templates.tsx:719](../../../src/ui/math-templates.tsx#L719)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: item.kind === 'data'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-a54e8545e26f](../handlers/ui__math-templates.md#h-a54e8545e26f) → [change · H-46fb5e8c4f31](../handlers/ui__math-templates.md#h-46fb5e8c4f31) → [@callback:current.current.entries.map · H-9b221b5d48bb](../handlers/ui__math-templates.md#h-9b221b5d48bb) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38)

```tsx
(e) =>
                    change({
                      ...item,
                      dataset: {
                        ...item.dataset!,
                        style: e.target.value as 'line' | 'scatter' | 'bar',
                      },
                    })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-da7b5ecdf08f, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

## X-1d3e83a52769

**DataEditor · 조작/부품 영역** · DataEditor · component-callback-contract

- 실제 소스: [src/ui/math-templates.tsx:737](../../../src/ui/math-templates.tsx#L737)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: item.kind === 'data'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [change · H-46fb5e8c4f31](../handlers/ui__math-templates.md#h-46fb5e8c4f31) → [@callback:current.current.entries.map · H-9b221b5d48bb](../handlers/ui__math-templates.md#h-9b221b5d48bb) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38)

```tsx
change
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-da7b5ecdf08f, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

## X-c7692e7f3468

**{item.source.title}** · a · user-control

- 실제 소스: [src/ui/math-templates.tsx:756](../../../src/ui/math-templates.tsx#L756)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: item.source ∧ truthy: item.source.url
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `item.source.url`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-3c4c337bca37

**관찰·메모 (선택)** · Textarea · user-control

- 실제 소스: [src/ui/math-templates.tsx:766](../../../src/ui/math-templates.tsx#L766)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-a69acb9a7d4f](../handlers/ui__math-templates.md#h-a69acb9a7d4f) → [change · H-46fb5e8c4f31](../handlers/ui__math-templates.md#h-46fb5e8c4f31) → [@callback:current.current.entries.map · H-9b221b5d48bb](../handlers/ui__math-templates.md#h-9b221b5d48bb) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38)

```tsx
(e) => change({ ...item, notes: e.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-da7b5ecdf08f, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

## X-f6d71d82be73

**내용과 메모 저장** · Button · user-control

- 실제 소스: [src/ui/math-templates.tsx:773](../../../src/ui/math-templates.tsx#L773)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-85dd266ae615](../handlers/ui__math-templates.md#h-85dd266ae615) → [save · H-d2ac24e62a10](../handlers/ui__math-templates.md#h-d2ac24e62a10) → [@callback:current.current.entries.find · H-613fd319a60e](../handlers/ui__math-templates.md#h-613fd319a60e) → [@callback:current.current.entries.find · H-01ff3ab9c97e](../handlers/ui__math-templates.md#h-01ff3ab9c97e)

```tsx
() => void save()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: finally 분기 있음
- 분기 ID: B-c477f7d7aa86, B-aba3ac3f8223, B-bcadc444af94, B-741dd18b48b7, B-4e3ed63a4e33, B-f0e8fe3175cb, B-342dc337fcd9, B-1cebf90615e3

## X-1957beca19ec

**이 내용 파일로 보관** · Button · user-control

- 실제 소스: [src/ui/math-templates.tsx:776](../../../src/ui/math-templates.tsx#L776)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-5c7ab035ee78](../handlers/ui__math-templates.md#h-5c7ab035ee78) → [download · H-304155101b93](../handlers/ui__math-templates.md#h-304155101b93) → [@callback:setTimeout · H-ff81474d162e](../handlers/ui__math-templates.md#h-ff81474d162e)

```tsx
() =>
              download(`${item.title || '수식 내용'}.json`, JSON.stringify(item, null, 2))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-9898299ca0c6

**모든 내용 파일로 보관** · Button · user-control

- 실제 소스: [src/ui/math-templates.tsx:783](../../../src/ui/math-templates.tsx#L783)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-57542574590f](../handlers/ui__math-templates.md#h-57542574590f) → [download · H-304155101b93](../handlers/ui__math-templates.md#h-304155101b93) → [@callback:setTimeout · H-ff81474d162e](../handlers/ui__math-templates.md#h-ff81474d162e)

```tsx
() =>
              download('모든 수식·내용 초안.json', JSON.stringify(workspace.entries, null, 2))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-0051b85658e6

**{m.body.split('\n')[0] || '수식 내용'}** · Button · user-control

- 실제 소스: [src/ui/math-templates.tsx:799](../../../src/ui/math-templates.tsx#L799)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: saved.length > 0
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-8a383e8769a9](../handlers/ui__math-templates.md#h-8a383e8769a9) → [accept · H-ea818ade0344](../handlers/ui__math-templates.md#h-ea818ade0344) → [@callback:entries.find · H-1ec634dd189c](../handlers/ui__math-templates.md#h-1ec634dd189c) → [update · H-6a48258eca38](../handlers/ui__math-templates.md#h-6a48258eca38) → [@callback:entries.find · H-1bb86e962b13](../handlers/ui__math-templates.md#h-1bb86e962b13)

```tsx
() => {
                    const entry = readTemplate(m.body);
                    try {
                      if (entry) accept([entry]);
                      else setError('내용 형식을 읽지 못했습니다. 메모의 원문은 유지했습니다.');
                    } catch (error) {
                      setError(
                        error instanceof Error ? error.message : '내용을 다시 열지 못했습니다.',
                      );
                    }
                  }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-059af80b7774, B-f7b404240c74, B-46f018a2bf55, B-86cddc680fbf, B-c42d99de6ea0, B-f3304682b841, B-8b10e7794a0a, B-86fb51bd1361, B-d944911c1865, B-705a8c2e7d4b, B-7efe2a8f283d

반복: map(saved) · 797행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-2cfdba753780

**변수와 슬라이더 범위** · summary · user-control

- 실제 소스: [src/ui/math-templates.tsx:834](../../../src/ui/math-templates.tsx#L834)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e8f4befb4025

**`${p.label} 슬라이더 ${edge === 'min' ? '시작' : '끝'}`** · NumberField · component-callback-contract

- 실제 소스: [src/ui/math-templates.tsx:838](../../../src/ui/math-templates.tsx#L838)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onCommit** → [@onCommit · H-c1bcc4d436ab](../handlers/ui__math-templates.md#h-c1bcc4d436ab) → [@callback:item.parameters.map · H-cb357f240532](../handlers/ui__math-templates.md#h-cb357f240532)

```tsx
(value) => {
                const next = {
                  ...item,
                  parameters: item.parameters.map((q, j) =>
                    i === j ? { ...q, [edge]: value } : q,
                  ),
                };
                if (!isMathTemplate(next)) {
                  setError('시작은 끝보다 작고, 현재 값은 범위 안에 있어야 합니다.');
                  return;
                }
                setError('');
                onChange(next);
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-3bb844596565, B-2ef2aeeb5cc6

반복: map(['min', 'max'] as const) · 837행; map(item.parameters) · 835행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-9e44493b57f6

**추가할 변수 이름** · Input · user-control

- 실제 소스: [src/ui/math-templates.tsx:860](../../../src/ui/math-templates.tsx#L860)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-dea981819231](../handlers/ui__math-templates.md#h-dea981819231)

```tsx
(e) => setSymbol(e.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-5d3f62932eb1

**변수 추가** · Button · user-control

- 실제 소스: [src/ui/math-templates.tsx:866](../../../src/ui/math-templates.tsx#L866)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-5f07d2695f63](../handlers/ui__math-templates.md#h-5f07d2695f63)

```tsx
() => {
          const next = {
            ...item,
            parameters: [
              ...item.parameters,
              { symbol: symbol.trim(), label: symbol.trim(), min: -10, max: 10, value: 1 },
            ],
          };
          if (!isMathTemplate(next)) {
            setError(
              '계산 변수와 겹치지 않는 영문 변수 이름을 넣어 주세요. 변수는 12개 이내입니다.',
            );
            return;
          }
          setError('');
          setSymbol('');
          onChange(next);
        }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-af05877c3fa2

## X-0bb91dfe5b59

**제공한 값 (한 줄에 x, y)** · Textarea · user-control

- 실제 소스: [src/ui/math-templates.tsx:903](../../../src/ui/math-templates.tsx#L903)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-17232132d4d7](../handlers/ui__math-templates.md#h-17232132d4d7)

```tsx
(e) => {
          onChange({ ...item, datasetInput: e.target.value });
          setError('');
        }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e8be22ebb89a

**값을 그래프에 반영** · Button · user-control

- 실제 소스: [src/ui/math-templates.tsx:913](../../../src/ui/math-templates.tsx#L913)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c251073019ac](../handlers/ui__math-templates.md#h-c251073019ac) → [@callback:text
              .split('\n')
              .filter · H-5c586d369198](../handlers/ui__math-templates.md#h-5c586d369198) → [@callback:text
              .split('\n')
              .filter((s) => s.trim())
              .map · H-de065867791b](../handlers/ui__math-templates.md#h-de065867791b) → [@callback:v.some · H-852e62bef22d](../handlers/ui__math-templates.md#h-852e62bef22d) → [@callback:s.split(',').some · H-ae92bc125b10](../handlers/ui__math-templates.md#h-ae92bc125b10) → [@callback:s.split(',').map · H-68a8ebd32e92](../handlers/ui__math-templates.md#h-68a8ebd32e92)

```tsx
() => {
          try {
            const points = text
              .split('\n')
              .filter((s) => s.trim())
              .map((s) => {
                const v = s.split(',').map((s) => Number(s.trim()));
                if (
                  v.length !== 2 ||
                  s.split(',').some((s) => !s.trim()) ||
                  v.some((n) => !Number.isFinite(n) || Math.abs(n) > 1e6)
                )
                  throw Error('각 줄에 두 숫자를 쉼표로 구분해 주세요.');
                return v as [number, number];
              });
            if (points.length > 10000) throw Error('한 번에 10000값 이내로 넣어 주세요.');
            onChange({ ...item, dataset: { ...item.dataset!, points } });
            setError('');
          } catch (e) {
            setError(e instanceof Error ? e.message : '값을 확인해 주세요.');
          }
        }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-dc43a7d19aa2, B-64780cde161b, B-167da8a4a309, B-80a3a5dc9ca7, B-4b2f2cf7fcc2

