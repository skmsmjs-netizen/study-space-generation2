# src/ui/flow-experience.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-e07c48c57cd8

**{name} 보기 도구 · {Math.round(zoom * 100)} %** · Button · user-control

- 실제 소스: [src/ui/flow-experience.tsx:82](../../../src/ui/flow-experience.tsx#L82)
- 연결 표면: [R07](../paths/R07.md), [R15](../paths/R15.md), [R16](../paths/R16.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md), [U35](../paths/U35.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-850f34567670](../handlers/ui__flow-experience.md#h-850f34567670)

```tsx
() => setOpen(!open)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-6c795d3e3017

**확대 비율 (%)** · Input · user-control

- 실제 소스: [src/ui/flow-experience.tsx:87](../../../src/ui/flow-experience.tsx#L87)
- 연결 표면: [R07](../paths/R07.md), [R15](../paths/R15.md), [R16](../paths/R16.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md), [U35](../paths/U35.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 · 키보드·한글 조합 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-9f5da529609c](../handlers/ui__flow-experience.md#h-9f5da529609c)

```tsx
(event) => setZoomDraft(event.target.value)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

**onKeyDown** → [@onKeyDown · H-f02df9afad43](../handlers/ui__flow-experience.md#h-f02df9afad43) → [applyZoom · H-8b68b4acf07d](../handlers/ui__flow-experience.md#h-8b68b4acf07d)

```tsx
(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  applyZoom();
                }
                if (event.key === 'Escape') setZoomDraft(null);
              }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-84747a4d3778, B-ec794d88e693, B-d75c38ebb3b4

## X-9ffc7b7dcb5f

**확대 비율 적용** · Button · user-control

- 실제 소스: [src/ui/flow-experience.tsx:102](../../../src/ui/flow-experience.tsx#L102)
- 연결 표면: [R07](../paths/R07.md), [R15](../paths/R15.md), [R16](../paths/R16.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md), [U35](../paths/U35.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: zoomDraft === null ||
                !zoomDraft ||
                !Number.isFinite(Number(zoomDraft)) ||
                Number(zoomDraft) <= 0
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [applyZoom · H-8b68b4acf07d](../handlers/ui__flow-experience.md#h-8b68b4acf07d)

```tsx
applyZoom
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-d75c38ebb3b4

## X-62f8317c8689

**전체 위치 지도** · Select · user-control

- 실제 소스: [src/ui/flow-experience.tsx:113](../../../src/ui/flow-experience.tsx#L113)
- 연결 표면: [R07](../paths/R07.md), [R15](../paths/R15.md), [R16](../paths/R16.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md), [U35](../paths/U35.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-d041ce05213d](../handlers/ui__flow-experience.md#h-d041ce05213d)

```tsx
(event) =>
                store({ ...value, minimap: event.target.value as typeof value.minimap })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-1ddd8ee290e3

**빈 공간 조작** · Select · user-control

- 실제 소스: [src/ui/flow-experience.tsx:124](../../../src/ui/flow-experience.tsx#L124)
- 연결 표면: [R07](../paths/R07.md), [R15](../paths/R15.md), [R16](../paths/R16.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md), [U35](../paths/U35.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-c38b46d27a51](../handlers/ui__flow-experience.md#h-c38b46d27a51)

```tsx
(event) =>
                store({ ...value, mode: event.target.value as typeof value.mode })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-ff8f2685bfbb

**배경 안내선** · Select · user-control

- 실제 소스: [src/ui/flow-experience.tsx:134](../../../src/ui/flow-experience.tsx#L134)
- 연결 표면: [R07](../paths/R07.md), [R15](../paths/R15.md), [R16](../paths/R16.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md), [U35](../paths/U35.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-de179db587d2](../handlers/ui__flow-experience.md#h-de179db587d2)

```tsx
(event) =>
                store({ ...value, background: event.target.value as typeof value.background })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-5ccc61ffb3fa

**연결선 모양** · Select · user-control

- 실제 소스: [src/ui/flow-experience.tsx:146](../../../src/ui/flow-experience.tsx#L146)
- 연결 표면: [R07](../paths/R07.md), [R15](../paths/R15.md), [R16](../paths/R16.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md), [U35](../paths/U35.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-5b0c21a0c567](../handlers/ui__flow-experience.md#h-5b0c21a0c567)

```tsx
(event) =>
                store({ ...value, edgeStyle: event.target.value as typeof value.edgeStyle })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-c908a8a56815

**격자에 맞춰 옮기기** · Checkbox · user-control

- 실제 소스: [src/ui/flow-experience.tsx:158](../../../src/ui/flow-experience.tsx#L158)
- 연결 표면: [R07](../paths/R07.md), [R15](../paths/R15.md), [R16](../paths/R16.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md), [U35](../paths/U35.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: 명시 없음
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-58aa3b25c80c](../handlers/ui__flow-experience.md#h-58aa3b25c80c)

```tsx
(event) => store({ ...value, snap: event.target.checked })
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-a4df313598df

**선택한 항목 보기** · Button · user-control

- 실제 소스: [src/ui/flow-experience.tsx:163](../../../src/ui/flow-experience.tsx#L163)
- 연결 표면: [R07](../paths/R07.md), [R15](../paths/R15.md), [R16](../paths/R16.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md), [U35](../paths/U35.md)
- 직접 표시 조건: truthy: open
- 실행 차단 disabled: !selectedIds.length
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-d413e8469269](../handlers/ui__flow-experience.md#h-d413e8469269) → [@callback:selectedIds.map · H-7c49aa4a5646](../handlers/ui__flow-experience.md#h-7c49aa4a5646)

```tsx
() =>
                void flow
                  .fitView({
                    nodes: selectedIds.map((id) => ({ id })),
                    padding: 0.3,
                    maxZoom: 1.2,
                  })
                  .then(onViewportCommit)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-3e2f2bf8bee6

**보기 도구 초기화** · Button · user-control

- 실제 소스: [src/ui/flow-experience.tsx:177](../../../src/ui/flow-experience.tsx#L177)
- 연결 표면: [R07](../paths/R07.md), [R15](../paths/R15.md), [R16](../paths/R16.md), [R23](../paths/R23.md), [R24](../paths/R24.md), [U24](../paths/U24.md), [U35](../paths/U35.md)
- 직접 표시 조건: truthy: open
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

