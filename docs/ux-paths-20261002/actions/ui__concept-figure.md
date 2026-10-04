# src/ui/concept-figure.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-a1c1f0ac7acb

**도해 크게 보기** · Button · user-control

- 실제 소스: [src/ui/concept-figure.tsx:138](../../../src/ui/concept-figure.tsx#L138)
- 연결 표면: [R13](../paths/R13.md), [U33](../paths/U33.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-ac53d292207d](../handlers/ui__concept-figure.md#h-ac53d292207d)

```tsx
() => setOpen(true)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c4b2199e598c

**figure.label** · Modal · component-callback-contract

- 실제 소스: [src/ui/concept-figure.tsx:141](../../../src/ui/concept-figure.tsx#L141)
- 연결 표면: [R13](../paths/R13.md), [U33](../paths/U33.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClose** → [@onClose · H-a147f49ad3db](../handlers/ui__concept-figure.md#h-a147f49ad3db)

```tsx
() => setOpen(false)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-5544b3daa159

**기본 글자 크기로 보기** · Button · user-control

- 실제 소스: [src/ui/concept-figure.tsx:148](../../../src/ui/concept-figure.tsx#L148)
- 연결 표면: [R13](../paths/R13.md), [U33](../paths/U33.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-c6edb892703e](../handlers/ui__concept-figure.md#h-c6edb892703e)

```tsx
() => void flow.current?.zoomTo(1)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-a23259c8e67c

**확대한 도해 · 방향키로 이동** · div · event-surface

- 실제 소스: [src/ui/concept-figure.tsx:153](../../../src/ui/concept-figure.tsx#L153)
- 연결 표면: [R13](../paths/R13.md), [U33](../paths/U33.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onKeyDown** → [@onKeyDown · H-7b0b02d72fca](../handlers/ui__concept-figure.md#h-7b0b02d72fca)

```tsx
(event) => {
            if (event.target !== event.currentTarget || !flow.current) return;
            const offsets: Record<string, [number, number]> = {
              ArrowLeft: [40, 0],
              ArrowRight: [-40, 0],
              ArrowUp: [0, 40],
              ArrowDown: [0, -40],
            };
            const offset = offsets[event.key];
            if (!offset) return;
            event.preventDefault();
            const current = flow.current.getViewport();
            void flow.current.setViewport({
              ...current,
              x: current.x + offset[0],
              y: current.y + offset[1],
            });
          }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d778056e3bbb, B-e0e2eebcd719

## X-3dc189174c2f

**ReactFlow · 조작/부품 영역** · ReactFlow · component-callback-contract

- 실제 소스: [src/ui/concept-figure.tsx:177](../../../src/ui/concept-figure.tsx#L177)
- 연결 표면: [R13](../paths/R13.md), [U33](../paths/U33.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 부품 콜백 계약 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onInit** → [@onInit · H-4b98b7d98c2d](../handlers/ui__concept-figure.md#h-4b98b7d98c2d)

```tsx
(instance) => {
              flow.current = instance;
            }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onMoveEnd** → [@onMoveEnd · H-c6fdf287aa61](../handlers/ui__concept-figure.md#h-c6fdf287aa61)

```tsx
(_, next) => setViewport(next)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-6b520ff71b5c

**도해 설명과 표시값** · summary · user-control

- 실제 소스: [src/ui/concept-figure.tsx:207](../../../src/ui/concept-figure.tsx#L207)
- 연결 표면: [R13](../paths/R13.md), [U33](../paths/U33.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 선언적 조작·네이티브 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**native-or-delegated-control** → 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별

- 정상 경계: 명시 핸들러 없음; 네이티브/부모 전달/외부 엔진 동작은 아래 속성으로 식별
- 예외 경계: 이벤트 자체가 명시되지 않은 네이티브/선언적 조작
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

