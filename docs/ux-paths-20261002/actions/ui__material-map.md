# src/ui/material-map.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-11e1ede7986b

**ReactFlow · 조작/부품 영역** · ReactFlow · component-callback-contract

- 실제 소스: [src/ui/material-map.tsx:102](../../../src/ui/material-map.tsx#L102)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 저장·변경 요청 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onInit** → [@onInit · H-430b09b7d4e3](../handlers/ui__material-map.md#h-430b09b7d4e3)

```tsx
(instance) => {
            flow.current = instance;
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onNodeClick** → [@onNodeClick · H-8be6a9b91a15](../handlers/ui__material-map.md#h-8be6a9b91a15)

```tsx
(_, n) => setSelected(`node:${n.id}`)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onEdgeClick** → [@onEdgeClick · H-a2401fd3be9d](../handlers/ui__material-map.md#h-a2401fd3be9d)

```tsx
(_, e) => setSelected(`edge:${e.id}`)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onSelectionChange** → 네이티브/호출자 동작

```tsx
handleSelection
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onNodesChange** → [@onNodesChange · H-b0c14a71ace3](../handlers/ui__material-map.md#h-b0c14a71ace3) → [@callback:Object.entries(committed).some · H-a15108bedc84](../handlers/ui__material-map.md#h-a15108bedc84) → [@callback:setMeasurements · H-7267d92c1236](../handlers/ui__material-map.md#h-7267d92c1236) → [@callback:Object.entries(measured).some · H-d64dbecc870a](../handlers/ui__material-map.md#h-d64dbecc870a) → [@callback:setPositions · H-196c080cd91f](../handlers/ui__material-map.md#h-196c080cd91f) → [@callback:setSelectedIds · H-4586e3dee575](../handlers/ui__material-map.md#h-4586e3dee575) → [@callback:previous.filter · H-9ee72d85ee7e](../handlers/ui__material-map.md#h-9ee72d85ee7e)

```tsx
(changes) => {
            const moved: Record<string, { x: number; y: number }> = {};
            const committed: Record<string, { x: number; y: number }> = {};
            const measured: Record<string, { width: number; height: number }> = {};
            for (const c of changes)
              if (c.type === 'position' && c.position) {
                moved[c.id] = c.position;
                if (!c.dragging) committed[c.id] = c.position;
              } else if (c.type === 'dimensions' && c.dimensions) {
                measured[c.id] = c.dimensions;
              } else if (c.type === 'select')
                setSelectedIds((previous) =>
                  c.selected
                    ? [...new Set([...previous, c.id])]
                    : previous.filter((id) => id !== c.id),
                );
            if (Object.keys(moved).length) setPositions((p) => ({ ...p, ...moved }));
            if (Object.keys(measured).length)
              setMeasurements((previous) =>
                Object.entries(measured).some(
                  ([id, size]) =>
                    previous[id]?.width !== size.width || previous[id]?.height !== size.height,
                )
                  ? { ...previous, ...measured }
                  : previous,
              );
            if (
              !disabled &&
              Object.entries(committed).some(
                ([id, point]) => JSON.stringify(map.positions?.[id]) !== JSON.stringify(point),
              )
            )
              onChange({ ...map, positions: { ...map.positions, ...committed } });
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-3455ab4324b3, B-95fbc54a74a4, B-4e406b1254dd, B-2f77ce502690, B-a2f9fe7ebc59, B-d5e9a4166677, B-9d457c2a18bf, B-5908df4a6071, B-05b35be524fb

## X-cc790bcb10ef

**보기 도구 저장 다시 시도** · Button · user-control

- 실제 소스: [src/ui/material-map.tsx:171](../../../src/ui/material-map.tsx#L171)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md)
- 직접 표시 조건: truthy: tools.error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ad33d9362611](../handlers/ui__material-map.md#h-ad33d9362611)

```tsx
() => tools.store(tools.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-eda17f0907af

**보기 도구 초기화** · Button · user-control

- 실제 소스: [src/ui/material-map.tsx:172](../../../src/ui/material-map.tsx#L172)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md)
- 직접 표시 조건: truthy: tools.error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → 네이티브/호출자 동작

```tsx
tools.reset
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-8286a2421040

**개념·관계 선택** · Select · user-control

- 실제 소스: [src/ui/material-map.tsx:175](../../../src/ui/material-map.tsx#L175)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-46cd5580cc8f](../handlers/ui__material-map.md#h-46cd5580cc8f)

```tsx
(event) => {
          setSelected(event.target.value);
          const id = event.target.value.startsWith('node:') ? event.target.value.slice(5) : '';
          setSelectedIds(id ? [id] : []);
          if (id) void flow.current?.fitView({ nodes: [{ id }], padding: 0.3, maxZoom: 1.2 });
        }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-c514837c9dd6, B-d9d4590cfaba, B-66676c1b2979

## X-69985c0a815c

**연결을 따라 배치** · Button · user-control

- 실제 소스: [src/ui/material-map.tsx:198](../../../src/ui/material-map.tsx#L198)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || canvasBusy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-2acd9f609416](../handlers/ui__material-map.md#h-2acd9f609416) → [@callback:map.edges.map · H-59836443f548](../handlers/ui__material-map.md#h-59836443f548) → [@callback:measured.map · H-664e2d7210f9](../handlers/ui__material-map.md#h-664e2d7210f9)

```tsx
() => {
            const measured = flow.current?.getNodes() ?? visible;
            const arranged = layoutFlowBoxes(
              measured.map((node) => ({
                id: node.id,
                position: node.position,
                width: node.measured?.width ?? 240,
                height: node.measured?.height ?? 90,
              })),
              map.edges.map((edge) => ({ source: edge.from, target: edge.to })),
            );
            onChange({ ...map, positions: { ...map.positions, ...arranged } });
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-86f548a72718

**Canvas에 보관 중… 이 개념도를 Canvas에 추가** · Button · user-control

- 실제 소스: [src/ui/material-map.tsx:216](../../../src/ui/material-map.tsx#L216)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled || canvasBusy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d683eb934f35](../handlers/ui__material-map.md#h-d683eb934f35)

```tsx
async () => {
            setCanvasBusy(true);
            try {
              await onCanvas();
            } finally {
              setCanvasBusy(false);
            }
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: finally 분기 있음
- 분기 ID: B-86d321c18192

## X-3113d24a4ea7

**처음 개념도로 되돌리기** · Button · user-control

- 실제 소스: [src/ui/material-map.tsx:230](../../../src/ui/material-map.tsx#L230)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md)
- 직접 표시 조건: truthy: originalMap
- 실행 차단 disabled: disabled || canvasBusy
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복원·되돌리기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-1b68245a6c81](../handlers/ui__material-map.md#h-1b68245a6c81)

```tsx
() => onChange(structuredClone(originalMap))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-17ba0eb8de25

**개념 이름** · Input · user-control

- 실제 소스: [src/ui/material-map.tsx:240](../../../src/ui/material-map.tsx#L240)
- 연결 표면: [U24](../paths/U24.md)
- 직접 표시 조건: truthy: node
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-4974341fec7c](../handlers/ui__material-map.md#h-4974341fec7c) → [@callback:map.nodes.map · H-16fdc8491bf1](../handlers/ui__material-map.md#h-16fdc8491bf1)

```tsx
(e) =>
              onChange({
                ...map,
                nodes: map.nodes.map((n) =>
                  n.id === node.id ? { ...n, label: e.target.value } : n,
                ),
              })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-0096335ea979

## X-7eafad5a9872

**axis === 'x' ? '개념 가로 위치' : '개념 세로 위치'** · Input · user-control

- 실제 소스: [src/ui/material-map.tsx:256](../../../src/ui/material-map.tsx#L256)
- 연결 표면: [U24](../paths/U24.md)
- 직접 표시 조건: truthy: node
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-06339adb8103](../handlers/ui__material-map.md#h-06339adb8103) → [move · H-a003a0c00d89](../handlers/ui__material-map.md#h-a003a0c00d89) → [@callback:map.nodes.findIndex · H-8ef976d8fac3](../handlers/ui__material-map.md#h-8ef976d8fac3)

```tsx
(event) => move(node.id, axis, event.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-963dd6067fcc

반복: map(['x', 'y'] as const) · 255행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-fb195fa2b2f9

**관계 설명** · Input · user-control

- 실제 소스: [src/ui/material-map.tsx:278](../../../src/ui/material-map.tsx#L278)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md)
- 직접 표시 조건: truthy: edge
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-38444585c8b8](../handlers/ui__material-map.md#h-38444585c8b8) → [@callback:map.edges.map · H-2134b9f0d518](../handlers/ui__material-map.md#h-2134b9f0d518)

```tsx
(e) =>
              onChange({
                ...map,
                edges: map.edges.map((row) =>
                  row.id === edge.id ? { ...row, label: e.target.value } : row,
                ),
              })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-a3ad0f60fd7a

## X-6759bcb064ed

**개념과 관계를 글로 확인·수정** · summary · user-control

- 실제 소스: [src/ui/material-map.tsx:296](../../../src/ui/material-map.tsx#L296)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-14493e869646

**`개념 ${n.id}`** · Input · user-control

- 실제 소스: [src/ui/material-map.tsx:299](../../../src/ui/material-map.tsx#L299)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-92f261f124a9](../handlers/ui__material-map.md#h-92f261f124a9) → [@callback:map.nodes.map · H-c94d6bd20c3d](../handlers/ui__material-map.md#h-c94d6bd20c3d)

```tsx
(e) =>
                onChange({
                  ...map,
                  nodes: map.nodes.map((row) =>
                    row.id === n.id ? { ...row, label: e.target.value } : row,
                  ),
                })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-baab84e4f086

반복: map(map.nodes) · 297행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-f1beec64fc98

**`관계 ${e.id}`** · Input · user-control

- 실제 소스: [src/ui/material-map.tsx:322](../../../src/ui/material-map.tsx#L322)
- 연결 표면: [R07](../paths/R07.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-4e31b862262c](../handlers/ui__material-map.md#h-4e31b862262c) → [@callback:map.edges.map · H-5032f55823ca](../handlers/ui__material-map.md#h-5032f55823ca)

```tsx
(event) =>
                onChange({
                  ...map,
                  edges: map.edges.map((row) =>
                    row.id === e.id ? { ...row, label: event.target.value } : row,
                  ),
                })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-4bfcf356c928

반복: map(map.edges) · 316행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

