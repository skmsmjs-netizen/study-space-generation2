# src/ui/study-canvas.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-bb11d52c6e34

**선택한 카드 편집** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:94](../../../src/ui/study-canvas.tsx#L94)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → 네이티브/호출자 동작

```tsx
data.open
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-ea3e9b0510fc

**NodeResizeControl · 조작/부품 영역** · NodeResizeControl · component-callback-contract

- 실제 소스: [src/ui/study-canvas.tsx:98](../../../src/ui/study-canvas.tsx#L98)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: selected && data.resize && !data.editor
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onResizeEnd** → [@onResizeEnd · H-22f7a2d17197](../handlers/ui__study-canvas.md#h-22f7a2d17197)

```tsx
(_, params) => data.resize?.(params.width)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-755b5bb2278a

**`${card.name} 내용`** · section · event-surface

- 실제 소스: [src/ui/study-canvas.tsx:115](../../../src/ui/study-canvas.tsx#L115)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onKeyDown** → [@onKeyDown · H-3dc3367283b1](../handlers/ui__study-canvas.md#h-3dc3367283b1)

```tsx
(event) => {
          // WebKit does not reliably scroll focused regions inside transformed graph nodes.
          // Keep editor and selection shortcuts local; move only this region with plain keys.
          if (
            event.target !== event.currentTarget ||
            event.nativeEvent.isComposing ||
            event.ctrlKey ||
            event.metaKey ||
            event.altKey
          )
            return;
          if (
            ![
              'ArrowDown',
              'ArrowUp',
              'ArrowLeft',
              'ArrowRight',
              'PageDown',
              'PageUp',
              'Home',
              'End',
              ' ',
            ].includes(event.key)
          )
            return;
          event.stopPropagation();
          if (event.shiftKey && event.key !== ' ') return;
          event.preventDefault();
          const element = event.currentTarget;
          const line = parseFloat(getComputedStyle(element).lineHeight) || 24;
          const page = Math.max(line, element.clientHeight - line);
          if (event.key === 'ArrowDown') element.scrollTop += line;
          else if (event.key === 'ArrowUp') element.scrollTop -= line;
          else if (event.key === 'ArrowLeft') element.scrollLeft -= line;
          else if (event.key === 'ArrowRight') element.scrollLeft += line;
          else if (event.key === 'Home') element.scrollTop = 0;
          else if (event.key === 'End') element.scrollTop = element.scrollHeight;
          else element.scrollTop += event.key === 'PageUp' || event.shiftKey ? -page : page;
        }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-30af549b8d96, B-aa5e73b28544, B-b853e55e521d, B-a84e8b095f27, B-cfa32a5911ea, B-4bafadd46d78, B-12f6d78f2b3c, B-a5f122b6c5f3, B-ed2f73712599, B-7ef6d879227e

## X-01194abd112f

**카드 안에서 편집 메모 쓰기** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:182](../../../src/ui/study-canvas.tsx#L182)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: nullish: data.editor ∧ interactive-when-falsy: zoom < 0.55
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → 네이티브/호출자 동작

```tsx
data.open
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-ecac50147048

**열기 ↗** · a · user-control

- 실제 소스: [src/ui/study-canvas.tsx:188](../../../src/ui/study-canvas.tsx#L188)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: nullish: data.editor ∧ interactive-when-falsy: zoom < 0.55 ∧ truthy: card.kind !== 'memo' && card.kind !== 'narrative' && card.kind !== 'concept'
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/${card.kind === 'subject' ? 'subject' : 'node'}/${encodeURIComponent(card.entityId)}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-4c0485928bce

**CanvasConceptEditor · 조작/부품 영역** · CanvasConceptEditor · component-callback-contract

- 실제 소스: [src/ui/study-canvas.tsx:397](../../../src/ui/study-canvas.tsx#L397)
- 연결 표면: [R15](../paths/R15.md), [U34](../paths/U34.md)
- 직접 표시 조건: truthy: editorId === card.id ∧ truthy: card.kind === 'concept' && memo
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → [@onSaved · H-4e86d9fab939](../handlers/ui__study-canvas.md#h-4e86d9fab939)

```tsx
(next) => {
                  onSaved(next);
                  setEditorId(null);
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onClose** → [@onClose · H-ed6064871920](../handlers/ui__study-canvas.md#h-ed6064871920)

```tsx
() => setEditorId(null)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(projection.cards) · 383행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-bc81119f6d7c

**MemoEditor · 조작/부품 영역** · MemoEditor · component-callback-contract

- 실제 소스: [src/ui/study-canvas.tsx:409](../../../src/ui/study-canvas.tsx#L409)
- 연결 표면: [R15](../paths/R15.md), [O24](../paths/O24.md)
- 직접 표시 조건: truthy: editorId === card.id ∧ falsy: card.kind === 'concept' && memo ∧ truthy: memo
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

**onClose** → [@onClose · H-96765be0cbb6](../handlers/ui__study-canvas.md#h-96765be0cbb6)

```tsx
() => setEditorId(null)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onCopy** → [@onCopy · H-60f86b2a8746](../handlers/ui__study-canvas.md#h-60f86b2a8746)

```tsx
(id) => setEditorId(`memo:${id}`)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(projection.cards) · 383행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-5d402b34c21c

**편집 접기** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:431](../../../src/ui/study-canvas.tsx#L431)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: editorId === card.id ∧ falsy: card.kind === 'concept' && memo ∧ falsy: memo
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-f275da53c7b1](../handlers/ui__study-canvas.md#h-f275da53c7b1)

```tsx
() => setEditorId(null)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(projection.cards) · 383행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-6b194a3952db

**목차와 설명 Canvas** · section · event-surface

- 실제 소스: [src/ui/study-canvas.tsx:637](../../../src/ui/study-canvas.tsx#L637)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 취소·닫기 · 초안·기기 상태 · 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onKeyDown** → [keyboardHistory · H-e5a85a026c6c](../handlers/ui__study-canvas.md#h-e5a85a026c6c) → [travel · H-a66e12daace0](../handlers/ui__study-canvas.md#h-a66e12daace0) → [save · H-1cc2cec97a79](../handlers/ui__study-canvas.md#h-1cc2cec97a79) → [@callback:refreshHistory · H-3424ef7b6bbc](../handlers/ui__study-canvas.md#h-3424ef7b6bbc) → [@callback:projection.cards.map · H-0a85e0e695ba](../handlers/ui__study-canvas.md#h-0a85e0e695ba) → [@callback:projection.cards.map · H-3898fcbb77d3](../handlers/ui__study-canvas.md#h-3898fcbb77d3)

```tsx
keyboardHistory
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-45897d55fc43, B-a83dc2645e55, B-1d1524b66a09, B-5737c50a6362, B-7b5018f65cd2, B-a73a9b6c97bc, B-e04b0962134e, B-a58690185c87, B-474399cc9c95, B-502abc942794, B-73c94eb18a80, B-7c60d5419496

## X-4f4c507432d3

**Canvas 과목** · Select · user-control

- 실제 소스: [src/ui/study-canvas.tsx:639](../../../src/ui/study-canvas.tsx#L639)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-6acb114b6bb3](../handlers/ui__study-canvas.md#h-6acb114b6bb3)

```tsx
(event) => {
            setCourse(event.target.value);
            setEditorId(null);
            setSelectedId(null);
            setSelectedIds([]);
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-a2960a22dd34

**전체 보기** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:656](../../../src/ui/study-canvas.tsx#L656)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-69e425ffe37d](../handlers/ui__study-canvas.md#h-69e425ffe37d)

```tsx
() =>
            flow.current?.fitView({ padding: 0.16, minZoom: 0.25, maxZoom: 1 }).then(saveViewport)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-b5b1415b2e63

**개념 카드 추가** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:663](../../../src/ui/study-canvas.tsx#L663)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: boot.blocked ||
            (data.namespace !== 'demo' && !repository.getCapabilities?.().includes('saveMemo'))
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d93af69394c1](../handlers/ui__study-canvas.md#h-d93af69394c1)

```tsx
() => setConceptOpen(!conceptOpen)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-df1d0f327004

**개념 연결** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:673](../../../src/ui/study-canvas.tsx#L673)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: !serverReady || boot.blocked || projection.cards.length < 2
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-00d2ecc75360](../handlers/ui__study-canvas.md#h-00d2ecc75360) → [changeConnection · H-28b706518b72](../handlers/ui__study-canvas.md#h-28b706518b72)

```tsx
() => {
            setConnectionOpen(!connectionOpen);
            if (!connection.source && selectedId)
              changeConnection({ ...connection, source: selectedId });
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-46f826d556f5, B-d9e117d16dbd, B-1fef8b35bb60, B-abeb532490a3, B-9ad1461ea2c0

## X-a4aade0002d4

**목차 배치** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:684](../../../src/ui/study-canvas.tsx#L684)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: !serverReady || boot.blocked || Boolean(editorId)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-cf34d8cb22c0](../handlers/ui__study-canvas.md#h-cf34d8cb22c0) → [arrange · H-ed39344efaa7](../handlers/ui__study-canvas.md#h-ed39344efaa7) → [save · H-1cc2cec97a79](../handlers/ui__study-canvas.md#h-1cc2cec97a79) → [@callback:refreshHistory · H-3424ef7b6bbc](../handlers/ui__study-canvas.md#h-3424ef7b6bbc) → [@callback:projection.cards.map · H-0a85e0e695ba](../handlers/ui__study-canvas.md#h-0a85e0e695ba) → [@callback:projection.cards.map · H-3898fcbb77d3](../handlers/ui__study-canvas.md#h-3898fcbb77d3) → [@callback:nodes
      .filter · H-c677ffa14189](../handlers/ui__study-canvas.md#h-c677ffa14189) → [@callback:nodes
      .filter((node) => !axis || selectedIds.includes(node.id))
      .map · H-7c6b7e7f71e9](../handlers/ui__study-canvas.md#h-7c6b7e7f71e9)

```tsx
() => arrange()
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-04b92ab79376, B-7b5018f65cd2, B-a73a9b6c97bc, B-e04b0962134e, B-a58690185c87, B-474399cc9c95, B-502abc942794, B-73c94eb18a80, B-7c60d5419496

## X-6729bbc0dfa8

**배치 되돌리기** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:690](../../../src/ui/study-canvas.tsx#L690)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: !serverReady || boot.blocked || !history.current.canUndo
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 복원·되돌리기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-105cee026690](../handlers/ui__study-canvas.md#h-105cee026690) → [travel · H-a66e12daace0](../handlers/ui__study-canvas.md#h-a66e12daace0) → [save · H-1cc2cec97a79](../handlers/ui__study-canvas.md#h-1cc2cec97a79) → [@callback:refreshHistory · H-3424ef7b6bbc](../handlers/ui__study-canvas.md#h-3424ef7b6bbc) → [@callback:projection.cards.map · H-0a85e0e695ba](../handlers/ui__study-canvas.md#h-0a85e0e695ba) → [@callback:projection.cards.map · H-3898fcbb77d3](../handlers/ui__study-canvas.md#h-3898fcbb77d3)

```tsx
() => travel('undo')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-5737c50a6362, B-7b5018f65cd2, B-a73a9b6c97bc, B-e04b0962134e, B-a58690185c87, B-474399cc9c95, B-502abc942794, B-73c94eb18a80, B-7c60d5419496

## X-71bc6ba37cc1

**배치 다시 실행** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:696](../../../src/ui/study-canvas.tsx#L696)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: !serverReady || boot.blocked || !history.current.canRedo
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-2cf3fd2739e5](../handlers/ui__study-canvas.md#h-2cf3fd2739e5) → [travel · H-a66e12daace0](../handlers/ui__study-canvas.md#h-a66e12daace0) → [save · H-1cc2cec97a79](../handlers/ui__study-canvas.md#h-1cc2cec97a79) → [@callback:refreshHistory · H-3424ef7b6bbc](../handlers/ui__study-canvas.md#h-3424ef7b6bbc) → [@callback:projection.cards.map · H-0a85e0e695ba](../handlers/ui__study-canvas.md#h-0a85e0e695ba) → [@callback:projection.cards.map · H-3898fcbb77d3](../handlers/ui__study-canvas.md#h-3898fcbb77d3)

```tsx
() => travel('redo')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-5737c50a6362, B-7b5018f65cd2, B-a73a9b6c97bc, B-e04b0962134e, B-a58690185c87, B-474399cc9c95, B-502abc942794, B-73c94eb18a80, B-7c60d5419496

## X-d5de020e9679

**배치 내보내기·가져오기** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:702](../../../src/ui/study-canvas.tsx#L702)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-76b79a63b34b](../handlers/ui__study-canvas.md#h-76b79a63b34b)

```tsx
() => setTransferOpen(!transferOpen)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-91bc517ce000

**주제 카드로 설명하기 ↗** · a · user-control

- 실제 소스: [src/ui/study-canvas.tsx:705](../../../src/ui/study-canvas.tsx#L705)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/recall`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-523ddbb15539

**보기 도구 저장 다시 시도** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:710](../../../src/ui/study-canvas.tsx#L710)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: tools.error
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d4b5dd4bd2b4](../handlers/ui__study-canvas.md#h-d4b5dd4bd2b4)

```tsx
() => tools.store(tools.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-e70d3a2012a5

**보기 도구 초기화** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:711](../../../src/ui/study-canvas.tsx#L711)
- 연결 표면: [R15](../paths/R15.md)
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

## X-9e3b6fab9df0

**CanvasTransfer · 조작/부품 영역** · CanvasTransfer · component-callback-contract

- 실제 소스: [src/ui/study-canvas.tsx:715](../../../src/ui/study-canvas.tsx#L715)
- 연결 표면: [R15](../paths/R15.md), [U34](../paths/U34.md)
- 직접 표시 조건: truthy: transferOpen
- 실행 차단 disabled: !serverReady || boot.blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onImport** → [@onImport · H-770fa0a68a0f](../handlers/ui__study-canvas.md#h-770fa0a68a0f) → [save · H-1cc2cec97a79](../handlers/ui__study-canvas.md#h-1cc2cec97a79) → [@callback:refreshHistory · H-3424ef7b6bbc](../handlers/ui__study-canvas.md#h-3424ef7b6bbc) → [@callback:projection.cards.map · H-0a85e0e695ba](../handlers/ui__study-canvas.md#h-0a85e0e695ba) → [@callback:projection.cards.map · H-3898fcbb77d3](../handlers/ui__study-canvas.md#h-3898fcbb77d3)

```tsx
(next) => {
            if (!save(next)) return false;
            if (next.viewport) void flow.current?.setViewport(next.viewport);
            return true;
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-0abcc75e675d, B-3e6f37808dd3, B-7b5018f65cd2, B-a73a9b6c97bc, B-e04b0962134e, B-a58690185c87, B-474399cc9c95, B-502abc942794, B-73c94eb18a80, B-7c60d5419496

## X-ba01709d1915

**저장 다시 시도** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:741](../../../src/ui/study-canvas.tsx#L741)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: error ∧ truthy: !boot.blocked
- 실행 차단 disabled: !serverReady
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-150adf459e19](../handlers/ui__study-canvas.md#h-150adf459e19) → [save · H-1cc2cec97a79](../handlers/ui__study-canvas.md#h-1cc2cec97a79) → [@callback:refreshHistory · H-3424ef7b6bbc](../handlers/ui__study-canvas.md#h-3424ef7b6bbc) → [@callback:projection.cards.map · H-0a85e0e695ba](../handlers/ui__study-canvas.md#h-0a85e0e695ba) → [@callback:projection.cards.map · H-3898fcbb77d3](../handlers/ui__study-canvas.md#h-3898fcbb77d3)

```tsx
() => save(current.current)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7b5018f65cd2, B-a73a9b6c97bc, B-e04b0962134e, B-a58690185c87, B-474399cc9c95, B-502abc942794, B-73c94eb18a80, B-7c60d5419496

## X-bed120fd07ba

**초안 사본 보관** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:745](../../../src/ui/study-canvas.tsx#L745)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: error ∧ falsy: !boot.blocked
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 복사·내보내기 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-e37550eb0596](../handlers/ui__study-canvas.md#h-e37550eb0596)

```tsx
() => {
                try {
                  preserveCanvasDraft(data);
                  setError(
                    '초안 원문 사본을 보관했습니다. 초안 보관본에서 확인할 수 있습니다. 저장된 배치는 유지했습니다.',
                  );
                } catch (e) {
                  setError(e instanceof Error ? e.message : '초안 사본을 보관하지 못했습니다.');
                }
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6bdfe9217674, B-32b79dfc9541, B-7dbf5c98830e

## X-4f99a2818219

**초안 보관본** · a · user-control

- 실제 소스: [src/ui/study-canvas.tsx:760](../../../src/ui/study-canvas.tsx#L760)
- 연결 표면: [R15](../paths/R15.md)
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

## X-092bce6a5707

**CanvasConceptEditor · 조작/부품 영역** · CanvasConceptEditor · component-callback-contract

- 실제 소스: [src/ui/study-canvas.tsx:764](../../../src/ui/study-canvas.tsx#L764)
- 연결 표면: [R15](../paths/R15.md), [U34](../paths/U34.md)
- 직접 표시 조건: truthy: conceptOpen
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onSaved** → [@onSaved · H-feae725ed86a](../handlers/ui__study-canvas.md#h-feae725ed86a)

```tsx
(next, memoId) => {
            onSaved(next);
            setConceptOpen(false);
            setSelectedId(`memo:${memoId}`);
            setFocusConcept(`memo:${memoId}`);
            const owner = next.memos?.find((memo) => memo.id === memoId)?.ownerId;
            if (course !== 'all' && owner !== course) setCourse('all');
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-b3bcab6b62d2

**onClose** → [@onClose · H-db205a9eae26](../handlers/ui__study-canvas.md#h-db205a9eae26)

```tsx
() => setConceptOpen(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-292336308fab

**form · 제출 경로** · form · form

- 실제 소스: [src/ui/study-canvas.tsx:780](../../../src/ui/study-canvas.tsx#L780)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: connectionOpen
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: X-292336308fab
- 소스 의미 후보: 이동 · 제출 · 초안·기기 상태 · 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onCompositionStart** → [@onCompositionStart · H-921a29a9c45c](../handlers/ui__study-canvas.md#h-921a29a9c45c)

```tsx
() => setComposing(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onCompositionEnd** → [@onCompositionEnd · H-a54b4e922094](../handlers/ui__study-canvas.md#h-a54b4e922094)

```tsx
() => setComposing(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onSubmit** → [@onSubmit · H-40db00ec979c](../handlers/ui__study-canvas.md#h-40db00ec979c) → [addConnection · H-b7b7f2b98fc7](../handlers/ui__study-canvas.md#h-b7b7f2b98fc7) → [save · H-1cc2cec97a79](../handlers/ui__study-canvas.md#h-1cc2cec97a79) → [@callback:refreshHistory · H-3424ef7b6bbc](../handlers/ui__study-canvas.md#h-3424ef7b6bbc) → [@callback:projection.cards.map · H-0a85e0e695ba](../handlers/ui__study-canvas.md#h-0a85e0e695ba) → [@callback:projection.cards.map · H-3898fcbb77d3](../handlers/ui__study-canvas.md#h-3898fcbb77d3) → [@callback:current.current.links.find · H-1deafacd185c](../handlers/ui__study-canvas.md#h-1deafacd185c) → [validConnection · H-0e5fa6d384b0](../handlers/ui__study-canvas.md#h-0e5fa6d384b0)

```tsx
(event) => {
            event.preventDefault();
            addConnection();
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ae3d5de1971a, B-9debf96f155c, B-6b0f281758af, B-557477156993, B-3803d38b7b3e, B-a0fdc14ec137, B-7b5018f65cd2, B-a73a9b6c97bc, B-e04b0962134e, B-a58690185c87, B-474399cc9c95, B-502abc942794, B-73c94eb18a80, B-7c60d5419496

## X-10590cbb4379

**시작 개념** · Select · user-control

- 실제 소스: [src/ui/study-canvas.tsx:791](../../../src/ui/study-canvas.tsx#L791)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: connectionOpen
- 실행 차단 disabled: Boolean(connectionBoot.error)
- readOnly: 명시 없음; required: 명시 없음; form: X-292336308fab
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-588ea8c4ec00](../handlers/ui__study-canvas.md#h-588ea8c4ec00) → [changeConnection · H-28b706518b72](../handlers/ui__study-canvas.md#h-28b706518b72)

```tsx
(event) => changeConnection({ ...connection, source: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d9e117d16dbd, B-1fef8b35bb60, B-abeb532490a3, B-9ad1461ea2c0

## X-8dbf61cc0c4a

**이어지는 개념** · Select · user-control

- 실제 소스: [src/ui/study-canvas.tsx:804](../../../src/ui/study-canvas.tsx#L804)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: connectionOpen
- 실행 차단 disabled: Boolean(connectionBoot.error)
- readOnly: 명시 없음; required: 명시 없음; form: X-292336308fab
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-19faa37af3d6](../handlers/ui__study-canvas.md#h-19faa37af3d6) → [changeConnection · H-28b706518b72](../handlers/ui__study-canvas.md#h-28b706518b72)

```tsx
(event) => changeConnection({ ...connection, target: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d9e117d16dbd, B-1fef8b35bb60, B-abeb532490a3, B-9ad1461ea2c0

## X-ecf3f05a5105

**관계 설명** · Input · user-control

- 실제 소스: [src/ui/study-canvas.tsx:819](../../../src/ui/study-canvas.tsx#L819)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: connectionOpen
- 실행 차단 disabled: Boolean(connectionBoot.error)
- readOnly: 명시 없음; required: 명시 없음; form: X-292336308fab
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-015728ff3626](../handlers/ui__study-canvas.md#h-015728ff3626) → [changeConnection · H-28b706518b72](../handlers/ui__study-canvas.md#h-28b706518b72)

```tsx
(event) => changeConnection({ ...connection, label: event.target.value })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d9e117d16dbd, B-1fef8b35bb60, B-abeb532490a3, B-9ad1461ea2c0

## X-7903f1f2bab7

**연결하기** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:843](../../../src/ui/study-canvas.tsx#L843)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: connectionOpen
- 실행 차단 disabled: !serverReady ||
                boot.blocked ||
                Boolean(connectionBoot.error) ||
                composing ||
                !connection.label.trim() ||
                !connection.source ||
                !connection.target ||
                !validConnection(connection.source, connection.target)
- readOnly: 명시 없음; required: 명시 없음; form: X-292336308fab
- 소스 의미 후보: 제출 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-form-submit** → 상위 form의 onSubmit에 연결

- 정상 경계: 상위 form의 onSubmit에 연결
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-b753a2f1951f

**접기** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:859](../../../src/ui/study-canvas.tsx#L859)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: connectionOpen
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: X-292336308fab
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-1bb46ba0e302](../handlers/ui__study-canvas.md#h-1bb46ba0e302)

```tsx
() => setConnectionOpen(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-df6d4f34828e

**form · 제출 경로** · form · form

- 실제 소스: [src/ui/study-canvas.tsx:864](../../../src/ui/study-canvas.tsx#L864)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: custom
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: X-df6d4f34828e
- 소스 의미 후보: 이동 · 제출 · 초안·기기 상태 · 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onCompositionStart** → [@onCompositionStart · H-71766f0a4dbe](../handlers/ui__study-canvas.md#h-71766f0a4dbe)

```tsx
() => setComposing(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onCompositionEnd** → [@onCompositionEnd · H-89b3568d42c9](../handlers/ui__study-canvas.md#h-89b3568d42c9)

```tsx
() => setComposing(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onSubmit** → [@onSubmit · H-33e7585025b9](../handlers/ui__study-canvas.md#h-33e7585025b9) → [save · H-1cc2cec97a79](../handlers/ui__study-canvas.md#h-1cc2cec97a79) → [@callback:refreshHistory · H-3424ef7b6bbc](../handlers/ui__study-canvas.md#h-3424ef7b6bbc) → [@callback:projection.cards.map · H-0a85e0e695ba](../handlers/ui__study-canvas.md#h-0a85e0e695ba) → [@callback:projection.cards.map · H-3898fcbb77d3](../handlers/ui__study-canvas.md#h-3898fcbb77d3)

```tsx
(event) => {
            event.preventDefault();
            if (!composing) save(current.current);
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-9be9d72ec17b, B-7b5018f65cd2, B-a73a9b6c97bc, B-e04b0962134e, B-a58690185c87, B-474399cc9c95, B-502abc942794, B-73c94eb18a80, B-7c60d5419496

## X-457589969aa1

**end === 'source' ? '연결 시작 카드 변경' : '연결 도착 카드 변경'** · Select · user-control

- 실제 소스: [src/ui/study-canvas.tsx:877](../../../src/ui/study-canvas.tsx#L877)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: custom
- 실행 차단 disabled: !serverReady || boot.blocked
- readOnly: 명시 없음; required: 명시 없음; form: X-df6d4f34828e
- 소스 의미 후보: 이동 · 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-5534457de7f8](../handlers/ui__study-canvas.md#h-5534457de7f8) → [@callback:current.current.links.map · H-8d4e8d34edcb](../handlers/ui__study-canvas.md#h-8d4e8d34edcb) → [save · H-1cc2cec97a79](../handlers/ui__study-canvas.md#h-1cc2cec97a79) → [@callback:refreshHistory · H-3424ef7b6bbc](../handlers/ui__study-canvas.md#h-3424ef7b6bbc) → [@callback:projection.cards.map · H-0a85e0e695ba](../handlers/ui__study-canvas.md#h-0a85e0e695ba) → [@callback:projection.cards.map · H-3898fcbb77d3](../handlers/ui__study-canvas.md#h-3898fcbb77d3) → [validConnection · H-0e5fa6d384b0](../handlers/ui__study-canvas.md#h-0e5fa6d384b0)

```tsx
(event) => {
                const next = { ...custom, [end]: event.target.value };
                if (validConnection(next.source, next.target, custom.id))
                  save({
                    ...current.current,
                    links: current.current.links.map((link) =>
                      link.id === custom.id ? next : link,
                    ),
                  });
                else
                  setError(
                    '같은 카드 또는 이미 연결한 방향으로 바꿀 수 없습니다. 기존 연결은 유지했습니다.',
                  );
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-bb558f94e2cd, B-a9e49784e3f0, B-7b5018f65cd2, B-a73a9b6c97bc, B-e04b0962134e, B-a58690185c87, B-474399cc9c95, B-502abc942794, B-73c94eb18a80, B-7c60d5419496

반복: map(['source', 'target'] as const) · 876행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-c08fef604258

**연결선의 관계 설명** · Input · user-control

- 실제 소스: [src/ui/study-canvas.tsx:904](../../../src/ui/study-canvas.tsx#L904)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: custom
- 실행 차단 disabled: !serverReady || boot.blocked
- readOnly: 명시 없음; required: 명시 없음; form: X-df6d4f34828e
- 소스 의미 후보: 입력·선택 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-d8f59cdcd661](../handlers/ui__study-canvas.md#h-d8f59cdcd661) → [changeLabel · H-63c0aed2acc3](../handlers/ui__study-canvas.md#h-63c0aed2acc3) → [@callback:current.current.links.map · H-7b5150a2c530](../handlers/ui__study-canvas.md#h-7b5150a2c530)

```tsx
(event) => changeLabel(event.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-6ff5fc22e624, B-8fdf2f133e90, B-0a81b9e32487, B-8eececd462e0, B-b1c11ee91b79

## X-5079c999719f

**관계 설명 저장** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:911](../../../src/ui/study-canvas.tsx#L911)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: custom
- 실행 차단 disabled: !serverReady || boot.blocked || composing
- readOnly: 명시 없음; required: 명시 없음; form: X-df6d4f34828e
- 소스 의미 후보: 제출 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-form-submit** → 상위 form의 onSubmit에 연결

- 정상 경계: 상위 form의 onSubmit에 연결
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-6fb16d43b905

**이 연결 지우기** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:914](../../../src/ui/study-canvas.tsx#L914)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: custom
- 실행 차단 disabled: !serverReady || boot.blocked
- readOnly: 명시 없음; required: 명시 없음; form: X-df6d4f34828e
- 소스 의미 후보: 이동 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-475d80948b42](../handlers/ui__study-canvas.md#h-475d80948b42) → [@callback:current.current.links.filter · H-001e587e0fbe](../handlers/ui__study-canvas.md#h-001e587e0fbe) → [save · H-1cc2cec97a79](../handlers/ui__study-canvas.md#h-1cc2cec97a79) → [@callback:refreshHistory · H-3424ef7b6bbc](../handlers/ui__study-canvas.md#h-3424ef7b6bbc) → [@callback:projection.cards.map · H-0a85e0e695ba](../handlers/ui__study-canvas.md#h-0a85e0e695ba) → [@callback:projection.cards.map · H-3898fcbb77d3](../handlers/ui__study-canvas.md#h-3898fcbb77d3)

```tsx
() => {
              if (
                save({
                  ...current.current,
                  links: current.current.links.filter((link) => link.id !== custom.id),
                })
              )
                setSelectedEdge(null);
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f9b47d75c6fa, B-7b5018f65cd2, B-a73a9b6c97bc, B-e04b0962134e, B-a58690185c87, B-474399cc9c95, B-502abc942794, B-73c94eb18a80, B-7c60d5419496

## X-3026139c16ac

**접기** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:929](../../../src/ui/study-canvas.tsx#L929)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: custom
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: X-df6d4f34828e
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-46620541b898](../handlers/ui__study-canvas.md#h-46620541b898)

```tsx
() => setSelectedEdge(null)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-95effa424d91

**과목과 목차 입력** · a · user-control

- 실제 소스: [src/ui/study-canvas.tsx:939](../../../src/ui/study-canvas.tsx#L939)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: !projection.cards.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: `#/subjects`. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-b2690ec42976

**ReactFlow · 조작/부품 영역** · ReactFlow · component-callback-contract

- 실제 소스: [src/ui/study-canvas.tsx:943](../../../src/ui/study-canvas.tsx#L943)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: falsy: !projection.cards.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onInit** → [@onInit · H-1453fd28d8c4](../handlers/ui__study-canvas.md#h-1453fd28d8c4)

```tsx
(instance) => {
              flow.current = instance;
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onNodesChange** → [@onNodesChange · H-2abf79ee3682](../handlers/ui__study-canvas.md#h-2abf79ee3682) → [save · H-1cc2cec97a79](../handlers/ui__study-canvas.md#h-1cc2cec97a79) → [@callback:refreshHistory · H-3424ef7b6bbc](../handlers/ui__study-canvas.md#h-3424ef7b6bbc) → [@callback:projection.cards.map · H-0a85e0e695ba](../handlers/ui__study-canvas.md#h-0a85e0e695ba) → [@callback:projection.cards.map · H-3898fcbb77d3](../handlers/ui__study-canvas.md#h-3898fcbb77d3) → [@callback:changes.filter · H-1a29ea5faaa1](../handlers/ui__study-canvas.md#h-1a29ea5faaa1) → [@callback:setNodes · H-dd0b6f3ec600](../handlers/ui__study-canvas.md#h-dd0b6f3ec600)

```tsx
(changes) => {
              setNodes((previous) => applyNodeChanges(changes, previous));
              const moved = changes.filter(
                (change) => change.type === 'position' && change.position && !change.dragging,
              );
              if (moved.length) {
                const positions = { ...current.current.positions };
                let changed = false;
                for (const change of moved)
                  if (
                    change.type === 'position' &&
                    change.position &&
                    JSON.stringify(positions[change.id]) !== JSON.stringify(change.position)
                  ) {
                    positions[change.id] = change.position;
                    changed = true;
                  }
                if (changed) save({ ...current.current, positions });
              }
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-e83078d3fad3, B-9a624c09481b, B-af3d7a83c5af, B-7b5018f65cd2, B-a73a9b6c97bc, B-e04b0962134e, B-a58690185c87, B-474399cc9c95, B-502abc942794, B-73c94eb18a80, B-7c60d5419496

**onNodeClick** → [@onNodeClick · H-7523d03163f5](../handlers/ui__study-canvas.md#h-7523d03163f5)

```tsx
(_, card) => {
              setSelectedId(card.id);
              setSelectedEdge(null);
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onNodeContextMenu** → [@onNodeContextMenu · H-d399ee2c37a4](../handlers/ui__study-canvas.md#h-d399ee2c37a4)

```tsx
(event, card) => {
              event.preventDefault();
              setSelectedId(card.id);
              setSelectedIds([card.id]);
              setSelectedEdge(null);
            }
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

**onEdgeClick** → [@onEdgeClick · H-7850ec7d6c62](../handlers/ui__study-canvas.md#h-7850ec7d6c62)

```tsx
(_, edge) => {
              setSelectedEdge(edge.id);
              setSelectedId(null);
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onMoveEnd** → [@onMoveEnd · H-80ebf6e11e2e](../handlers/ui__study-canvas.md#h-80ebf6e11e2e) → [save · H-1cc2cec97a79](../handlers/ui__study-canvas.md#h-1cc2cec97a79) → [@callback:refreshHistory · H-3424ef7b6bbc](../handlers/ui__study-canvas.md#h-3424ef7b6bbc) → [@callback:projection.cards.map · H-0a85e0e695ba](../handlers/ui__study-canvas.md#h-0a85e0e695ba) → [@callback:projection.cards.map · H-3898fcbb77d3](../handlers/ui__study-canvas.md#h-3898fcbb77d3)

```tsx
(event, viewport) => {
              if (event && JSON.stringify(viewport) !== JSON.stringify(current.current.viewport))
                save({ ...current.current, viewport });
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f5e31d0c9bba, B-7b5018f65cd2, B-a73a9b6c97bc, B-e04b0962134e, B-a58690185c87, B-474399cc9c95, B-502abc942794, B-73c94eb18a80, B-7c60d5419496

**onConnect** → [@onConnect · H-b22d0d38811b](../handlers/ui__study-canvas.md#h-b22d0d38811b) → [changeConnection · H-28b706518b72](../handlers/ui__study-canvas.md#h-28b706518b72) → [validConnection · H-0e5fa6d384b0](../handlers/ui__study-canvas.md#h-0e5fa6d384b0)

```tsx
(next) => {
              if (validConnection(next.source, next.target)) {
                changeConnection({ ...connection, source: next.source, target: next.target });
                setConnectionOpen(true);
              }
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-7d605896071d, B-d9e117d16dbd, B-1fef8b35bb60, B-abeb532490a3, B-9ad1461ea2c0

**onReconnect** → [@onReconnect · H-82350241f2d0](../handlers/ui__study-canvas.md#h-82350241f2d0) → [@callback:current.current.links.map · H-30401c63e9c4](../handlers/ui__study-canvas.md#h-30401c63e9c4) → [save · H-1cc2cec97a79](../handlers/ui__study-canvas.md#h-1cc2cec97a79) → [@callback:refreshHistory · H-3424ef7b6bbc](../handlers/ui__study-canvas.md#h-3424ef7b6bbc) → [@callback:projection.cards.map · H-0a85e0e695ba](../handlers/ui__study-canvas.md#h-0a85e0e695ba) → [@callback:projection.cards.map · H-3898fcbb77d3](../handlers/ui__study-canvas.md#h-3898fcbb77d3) → [validConnection · H-0e5fa6d384b0](../handlers/ui__study-canvas.md#h-0e5fa6d384b0)

```tsx
(edge, next) => {
              if (
                !edge.id.startsWith('auto:') &&
                validConnection(next.source, next.target, edge.id)
              )
                save({
                  ...current.current,
                  links: current.current.links.map((link) =>
                    link.id === edge.id
                      ? { ...link, source: next.source, target: next.target }
                      : link,
                  ),
                });
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-0ffd10d77591, B-022f43a373f6, B-7b5018f65cd2, B-a73a9b6c97bc, B-e04b0962134e, B-a58690185c87, B-474399cc9c95, B-502abc942794, B-73c94eb18a80, B-7c60d5419496

## X-c64de0bdde8b

**FlowExperience · 조작/부품 영역** · FlowExperience · component-callback-contract

- 실제 소스: [src/ui/study-canvas.tsx:1033](../../../src/ui/study-canvas.tsx#L1033)
- 연결 표면: [R15](../paths/R15.md), [U35](../paths/U35.md)
- 직접 표시 조건: falsy: !projection.cards.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onViewportCommit** → [saveViewport · H-d8fb181daafb](../handlers/ui__study-canvas.md#h-d8fb181daafb) → [save · H-1cc2cec97a79](../handlers/ui__study-canvas.md#h-1cc2cec97a79) → [@callback:refreshHistory · H-3424ef7b6bbc](../handlers/ui__study-canvas.md#h-3424ef7b6bbc) → [@callback:projection.cards.map · H-0a85e0e695ba](../handlers/ui__study-canvas.md#h-0a85e0e695ba) → [@callback:projection.cards.map · H-3898fcbb77d3](../handlers/ui__study-canvas.md#h-3898fcbb77d3)

```tsx
saveViewport
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-0ebe01d1210e, B-7b5018f65cd2, B-a73a9b6c97bc, B-e04b0962134e, B-a58690185c87, B-474399cc9c95, B-502abc942794, B-73c94eb18a80, B-7c60d5419496

## X-42472b6afa61

**Canvas 보기 조절** · FlowControls · component-callback-contract

- 실제 소스: [src/ui/study-canvas.tsx:1040](../../../src/ui/study-canvas.tsx#L1040)
- 연결 표면: [R15](../paths/R15.md), [U35](../paths/U35.md)
- 직접 표시 조건: falsy: !projection.cards.length
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 초안·기기 상태 · 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onZoomIn** → [saveControlViewport · H-e8639a33dbd8](../handlers/ui__study-canvas.md#h-e8639a33dbd8) → [saveViewport · H-d8fb181daafb](../handlers/ui__study-canvas.md#h-d8fb181daafb) → [save · H-1cc2cec97a79](../handlers/ui__study-canvas.md#h-1cc2cec97a79) → [@callback:refreshHistory · H-3424ef7b6bbc](../handlers/ui__study-canvas.md#h-3424ef7b6bbc) → [@callback:projection.cards.map · H-0a85e0e695ba](../handlers/ui__study-canvas.md#h-0a85e0e695ba) → [@callback:projection.cards.map · H-3898fcbb77d3](../handlers/ui__study-canvas.md#h-3898fcbb77d3)

```tsx
saveControlViewport
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-0ebe01d1210e, B-7b5018f65cd2, B-a73a9b6c97bc, B-e04b0962134e, B-a58690185c87, B-474399cc9c95, B-502abc942794, B-73c94eb18a80, B-7c60d5419496

**onZoomOut** → [saveControlViewport · H-e8639a33dbd8](../handlers/ui__study-canvas.md#h-e8639a33dbd8) → [saveViewport · H-d8fb181daafb](../handlers/ui__study-canvas.md#h-d8fb181daafb) → [save · H-1cc2cec97a79](../handlers/ui__study-canvas.md#h-1cc2cec97a79) → [@callback:refreshHistory · H-3424ef7b6bbc](../handlers/ui__study-canvas.md#h-3424ef7b6bbc) → [@callback:projection.cards.map · H-0a85e0e695ba](../handlers/ui__study-canvas.md#h-0a85e0e695ba) → [@callback:projection.cards.map · H-3898fcbb77d3](../handlers/ui__study-canvas.md#h-3898fcbb77d3)

```tsx
saveControlViewport
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-0ebe01d1210e, B-7b5018f65cd2, B-a73a9b6c97bc, B-e04b0962134e, B-a58690185c87, B-474399cc9c95, B-502abc942794, B-73c94eb18a80, B-7c60d5419496

**onFitView** → [saveControlViewport · H-e8639a33dbd8](../handlers/ui__study-canvas.md#h-e8639a33dbd8) → [saveViewport · H-d8fb181daafb](../handlers/ui__study-canvas.md#h-d8fb181daafb) → [save · H-1cc2cec97a79](../handlers/ui__study-canvas.md#h-1cc2cec97a79) → [@callback:refreshHistory · H-3424ef7b6bbc](../handlers/ui__study-canvas.md#h-3424ef7b6bbc) → [@callback:projection.cards.map · H-0a85e0e695ba](../handlers/ui__study-canvas.md#h-0a85e0e695ba) → [@callback:projection.cards.map · H-3898fcbb77d3](../handlers/ui__study-canvas.md#h-3898fcbb77d3)

```tsx
saveControlViewport
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-0ebe01d1210e, B-7b5018f65cd2, B-a73a9b6c97bc, B-e04b0962134e, B-a58690185c87, B-474399cc9c95, B-502abc942794, B-73c94eb18a80, B-7c60d5419496

## X-630c781bcde3

**조작할 카드** · Select · user-control

- 실제 소스: [src/ui/study-canvas.tsx:1052](../../../src/ui/study-canvas.tsx#L1052)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-ee6d8147ad2f](../handlers/ui__study-canvas.md#h-ee6d8147ad2f) → [selectCards · H-55d01c70eb1b](../handlers/ui__study-canvas.md#h-55d01c70eb1b) → [@callback:setNodes · H-ad6d35cbbddf](../handlers/ui__study-canvas.md#h-ad6d35cbbddf) → [@callback:previous.map · H-47d588837a6d](../handlers/ui__study-canvas.md#h-47d588837a6d)

```tsx
(event) => {
            selectCards(event.target.value ? [event.target.value] : []);
            setSelectedEdge(null);
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d0c0aab09b72, B-f1a6d4711df2

## X-7fdfee6fbb30

**모든 카드 선택** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:1067](../../../src/ui/study-canvas.tsx#L1067)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-fd9b30aac92a](../handlers/ui__study-canvas.md#h-fd9b30aac92a) → [@callback:projection.cards.map · H-66da27672545](../handlers/ui__study-canvas.md#h-66da27672545) → [selectCards · H-55d01c70eb1b](../handlers/ui__study-canvas.md#h-55d01c70eb1b) → [@callback:setNodes · H-ad6d35cbbddf](../handlers/ui__study-canvas.md#h-ad6d35cbbddf) → [@callback:previous.map · H-47d588837a6d](../handlers/ui__study-canvas.md#h-47d588837a6d)

```tsx
() => {
            selectCards(projection.cards.map((card) => card.id));
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f1a6d4711df2

## X-efccfba0f695

**선택 해제** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:1074](../../../src/ui/study-canvas.tsx#L1074)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: !selectedIds.length && !selectedId
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-4da0e6de9848](../handlers/ui__study-canvas.md#h-4da0e6de9848) → [selectCards · H-55d01c70eb1b](../handlers/ui__study-canvas.md#h-55d01c70eb1b) → [@callback:setNodes · H-ad6d35cbbddf](../handlers/ui__study-canvas.md#h-ad6d35cbbddf) → [@callback:previous.map · H-47d588837a6d](../handlers/ui__study-canvas.md#h-47d588837a6d)

```tsx
() => {
            selectCards([]);
            setSelectedEdge(null);
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f1a6d4711df2

## X-83a37406a8bf

**왼쪽 맞춤** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:1086](../../../src/ui/study-canvas.tsx#L1086)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: selectedIds.length > 1
- 실행 차단 disabled: !serverReady || boot.blocked || Boolean(editorId)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-31cfd783dd47](../handlers/ui__study-canvas.md#h-31cfd783dd47) → [arrange · H-ed39344efaa7](../handlers/ui__study-canvas.md#h-ed39344efaa7) → [save · H-1cc2cec97a79](../handlers/ui__study-canvas.md#h-1cc2cec97a79) → [@callback:refreshHistory · H-3424ef7b6bbc](../handlers/ui__study-canvas.md#h-3424ef7b6bbc) → [@callback:projection.cards.map · H-0a85e0e695ba](../handlers/ui__study-canvas.md#h-0a85e0e695ba) → [@callback:projection.cards.map · H-3898fcbb77d3](../handlers/ui__study-canvas.md#h-3898fcbb77d3) → [@callback:nodes
      .filter · H-c677ffa14189](../handlers/ui__study-canvas.md#h-c677ffa14189) → [@callback:nodes
      .filter((node) => !axis || selectedIds.includes(node.id))
      .map · H-7c6b7e7f71e9](../handlers/ui__study-canvas.md#h-7c6b7e7f71e9)

```tsx
() => arrange('x')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-04b92ab79376, B-7b5018f65cd2, B-a73a9b6c97bc, B-e04b0962134e, B-a58690185c87, B-474399cc9c95, B-502abc942794, B-73c94eb18a80, B-7c60d5419496

## X-5d79e853ef95

**위쪽 맞춤** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:1092](../../../src/ui/study-canvas.tsx#L1092)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: selectedIds.length > 1
- 실행 차단 disabled: !serverReady || boot.blocked || Boolean(editorId)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-f3b54a8e57f8](../handlers/ui__study-canvas.md#h-f3b54a8e57f8) → [arrange · H-ed39344efaa7](../handlers/ui__study-canvas.md#h-ed39344efaa7) → [save · H-1cc2cec97a79](../handlers/ui__study-canvas.md#h-1cc2cec97a79) → [@callback:refreshHistory · H-3424ef7b6bbc](../handlers/ui__study-canvas.md#h-3424ef7b6bbc) → [@callback:projection.cards.map · H-0a85e0e695ba](../handlers/ui__study-canvas.md#h-0a85e0e695ba) → [@callback:projection.cards.map · H-3898fcbb77d3](../handlers/ui__study-canvas.md#h-3898fcbb77d3) → [@callback:nodes
      .filter · H-c677ffa14189](../handlers/ui__study-canvas.md#h-c677ffa14189) → [@callback:nodes
      .filter((node) => !axis || selectedIds.includes(node.id))
      .map · H-7c6b7e7f71e9](../handlers/ui__study-canvas.md#h-7c6b7e7f71e9)

```tsx
() => arrange('y')
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-04b92ab79376, B-7b5018f65cd2, B-a73a9b6c97bc, B-e04b0962134e, B-a58690185c87, B-474399cc9c95, B-502abc942794, B-73c94eb18a80, B-7c60d5419496

## X-061afc1b7744

**선택한 카드 너비** · Input · user-control

- 실제 소스: [src/ui/study-canvas.tsx:1102](../../../src/ui/study-canvas.tsx#L1102)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: selectedCard
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-59c3703794af](../handlers/ui__study-canvas.md#h-59c3703794af)

```tsx
(event) => {
                const width = Number(event.target.value);
                if (Number.isFinite(width) && width >= 240 && width <= 1000)
                  tools.store({
                    ...tools.value,
                    nodeWidths: { ...tools.value.nodeWidths, [selectedCard.id]: width },
                  });
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-aad3675aaa5e

## X-d4c6aac25ad6

**선택한 카드 편집** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:1117](../../../src/ui/study-canvas.tsx#L1117)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: selectedCard
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-59aedee87cf0](../handlers/ui__study-canvas.md#h-59aedee87cf0)

```tsx
() => {
                setEditorId(selectedCard.id);
                setFocusConcept(selectedCard.id);
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c363f59f38be

**선택한 카드 열기 ↗** · a · user-control

- 실제 소스: [src/ui/study-canvas.tsx:1126](../../../src/ui/study-canvas.tsx#L1126)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: selectedCard ∧ truthy: !['memo', 'narrative', 'concept'].includes(selectedCard.kind)
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

링크 목적지: ``#/${selectedCard.kind === 'subject' ? 'subject' : 'node'}/${encodeURIComponent(selectedCard.entityId)}``. 동적 ID는 현재 항목 값을 사용한다.

**link-activate** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-8207832a3e92

**`카드 ${name} 이동`** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:1138](../../../src/ui/study-canvas.tsx#L1138)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: selectedCard
- 실행 차단 disabled: !serverReady || boot.blocked
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 이동 · 초안·기기 상태 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-43be7bbea13d](../handlers/ui__study-canvas.md#h-43be7bbea13d) → [move · H-d5e374a87195](../handlers/ui__study-canvas.md#h-d5e374a87195) → [save · H-1cc2cec97a79](../handlers/ui__study-canvas.md#h-1cc2cec97a79) → [@callback:refreshHistory · H-3424ef7b6bbc](../handlers/ui__study-canvas.md#h-3424ef7b6bbc) → [@callback:projection.cards.map · H-0a85e0e695ba](../handlers/ui__study-canvas.md#h-0a85e0e695ba) → [@callback:projection.cards.map · H-3898fcbb77d3](../handlers/ui__study-canvas.md#h-3898fcbb77d3) → [@callback:projection.cards.find · H-8ce5ec6653e4](../handlers/ui__study-canvas.md#h-8ce5ec6653e4)

```tsx
() => move(Number(x), Number(y))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 명시 catch 또는 Promise.catch 분기 있음
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-f0d50d6a0563, B-7b5018f65cd2, B-a73a9b6c97bc, B-e04b0962134e, B-a58690185c87, B-474399cc9c95, B-502abc942794, B-73c94eb18a80, B-7c60d5419496

반복: map([ ['←', -40, 0, '왼쪽으로'], ['↑', 0, -40, '위로'], ['↓', 0, 40, '아래로'], ['→', 40, 0, '오른쪽으로'], ]) · 1132행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-2512b2d49bfc

**내 개념 카드 {projection.cards.filter((card) => card.kind === 'concept').length} 개** · summary · user-control

- 실제 소스: [src/ui/study-canvas.tsx:1152](../../../src/ui/study-canvas.tsx#L1152)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: projection.cards.some((card) => card.kind === 'concept')
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-1af7eb0cb825

**`개념 카드 편집: ${card.name}`** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:1158](../../../src/ui/study-canvas.tsx#L1158)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: projection.cards.some((card) => card.kind === 'concept')
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-2fb43e861530](../handlers/ui__study-canvas.md#h-2fb43e861530)

```tsx
() => {
                  setSelectedId(card.id);
                  setEditorId(card.id);
                  setSelectedEdge(null);
                  setFocusConcept(card.id);
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(projection.cards .filter((card) => card.kind === 'concept')) · 1155행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-6bc8d427cd5b

**내가 연결한 개념** · summary · user-control

- 실제 소스: [src/ui/study-canvas.tsx:1176](../../../src/ui/study-canvas.tsx#L1176)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: projection.links.some((link) => !link.id.startsWith('auto:'))
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-7297f7a7260c

**`관계 수정: ${cardName(link.source)} → ${link.label} → ${cardName(link.target)}`** · Button · user-control

- 실제 소스: [src/ui/study-canvas.tsx:1180](../../../src/ui/study-canvas.tsx#L1180)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: truthy: projection.links.some((link) => !link.id.startsWith('auto:'))
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-1a29b06d0982](../handlers/ui__study-canvas.md#h-1a29b06d0982)

```tsx
() => {
                  setSelectedEdge(link.id);
                  setSelectedId(null);
                }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

반복: map(projection.links .filter((link) => !link.id.startsWith('auto:'))) · 1177행. 같은 항목의 stable ID·실제 배열 순서를 유지하는 경로로 읽는다.

## X-052ede666e91

**Canvas 사용 안내** · summary · user-control

- 실제 소스: [src/ui/study-canvas.tsx:1195](../../../src/ui/study-canvas.tsx#L1195)
- 연결 표면: [R15](../paths/R15.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

