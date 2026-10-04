# src/ui/math-plot-camera.tsx — 조작별 UX 경로

같은 조작이 여러 경로·모달에서 재사용되면 여기서는 한 번 기록한다. 실제 표시 위치와 호출 조건은 각 표면 문서에서 연결한다. 기본 전이는 진입 조건 → 조작 가능 여부 → 이벤트 → 핸들러의 정상/조기 반환/예외/finally → 호출자 복귀이다. 입력 값·자료 개수·시점은 매개변수이며 무한 조합을 전부 시험했다는 뜻이 아니다.

## X-cfed0049d3d4

**pointFocus.active ? '근접 보기 전의 시야로 돌아갑니다' : '현재 점을 중심으로 확대하고 t의 움직임을 따라갑니다'** · Button · user-control

- 실제 소스: [src/ui/math-plot-camera.tsx:180](../../../src/ui/math-plot-camera.tsx#L180)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U31](../paths/U31.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: pointFocus
- 실행 차단 disabled: disabled || (!pointFocus.active && !pointFocus.available)
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → 네이티브/호출자 동작

```tsx
pointFocus.toggle
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: 없음

## X-a5e93912e8a9

**바라보는 방향** · Select · user-control

- 실제 소스: [src/ui/math-plot-camera.tsx:186](../../../src/ui/math-plot-camera.tsx#L186)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U31](../paths/U31.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 입력·선택 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onChange** → [@onChange · H-9885aecd8377](../handlers/ui__math-plot-camera.md#h-9885aecd8377) → [cameraFacing · H-e613a6bad059](../handlers/ui__math-plot-camera.md#h-e613a6bad059) → [cameraOffset · H-811d1e268acd](../handlers/ui__math-plot-camera.md#h-811d1e268acd) → [@callback:['x', 'y', 'z'].map · H-844147cb4f4c](../handlers/ui__math-plot-camera.md#h-844147cb4f4c)

```tsx
(e) => {
        const directions: Record<string, Vec3> = {
          oblique: [1, 1, 1], front: [0, -1, 0], side: [1, 0, 0], top: [0, 0, 1],
        };
        const direction = directions[e.target.value];
        if (direction) applyCamera(cameraFacing(readCamera(), direction));
      }
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-ff4c391aa1a6, B-efc3c8143342, B-687a141b050f

## X-118df21cbda4

**세 벡터 보기** · Button · user-control

- 실제 소스: [src/ui/math-plot-camera.tsx:199](../../../src/ui/math-plot-camera.tsx#L199)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U31](../paths/U31.md), [U32](../paths/U32.md)
- 직접 표시 조건: truthy: frame
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-6f2014a35f92](../handlers/ui__math-plot-camera.md#h-6f2014a35f92) → [cameraFacing · H-e613a6bad059](../handlers/ui__math-plot-camera.md#h-e613a6bad059) → [cameraOffset · H-811d1e268acd](../handlers/ui__math-plot-camera.md#h-811d1e268acd) → [@callback:['x', 'y', 'z'].map · H-844147cb4f4c](../handlers/ui__math-plot-camera.md#h-844147cb4f4c)

```tsx
() => applyCamera(cameraFacing(readCamera(), frame))
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-efc3c8143342, B-687a141b050f

## X-d505754aec9a

**왼쪽으로 회전** · Button · user-control

- 실제 소스: [src/ui/math-plot-camera.tsx:201](../../../src/ui/math-plot-camera.tsx#L201)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U31](../paths/U31.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-03c7565d8e3a](../handlers/ui__math-plot-camera.md#h-03c7565d8e3a) → [turn · H-7e70e2337905](../handlers/ui__math-plot-camera.md#h-7e70e2337905) → [cameraFacing · H-e613a6bad059](../handlers/ui__math-plot-camera.md#h-e613a6bad059) → [cameraOffset · H-811d1e268acd](../handlers/ui__math-plot-camera.md#h-811d1e268acd) → [@callback:['x', 'y', 'z'].map · H-844147cb4f4c](../handlers/ui__math-plot-camera.md#h-844147cb4f4c)

```tsx
() => turn(-15, 0)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-efc3c8143342, B-687a141b050f

## X-ddbaf826f22c

**오른쪽으로 회전** · Button · user-control

- 실제 소스: [src/ui/math-plot-camera.tsx:202](../../../src/ui/math-plot-camera.tsx#L202)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U31](../paths/U31.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-80a0c21b12cf](../handlers/ui__math-plot-camera.md#h-80a0c21b12cf) → [turn · H-7e70e2337905](../handlers/ui__math-plot-camera.md#h-7e70e2337905) → [cameraFacing · H-e613a6bad059](../handlers/ui__math-plot-camera.md#h-e613a6bad059) → [cameraOffset · H-811d1e268acd](../handlers/ui__math-plot-camera.md#h-811d1e268acd) → [@callback:['x', 'y', 'z'].map · H-844147cb4f4c](../handlers/ui__math-plot-camera.md#h-844147cb4f4c)

```tsx
() => turn(15, 0)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-efc3c8143342, B-687a141b050f

## X-cad2a179ffcf

**위쪽에서 보기** · Button · user-control

- 실제 소스: [src/ui/math-plot-camera.tsx:203](../../../src/ui/math-plot-camera.tsx#L203)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U31](../paths/U31.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-6f25ef5c1c8e](../handlers/ui__math-plot-camera.md#h-6f25ef5c1c8e) → [turn · H-7e70e2337905](../handlers/ui__math-plot-camera.md#h-7e70e2337905) → [cameraFacing · H-e613a6bad059](../handlers/ui__math-plot-camera.md#h-e613a6bad059) → [cameraOffset · H-811d1e268acd](../handlers/ui__math-plot-camera.md#h-811d1e268acd) → [@callback:['x', 'y', 'z'].map · H-844147cb4f4c](../handlers/ui__math-plot-camera.md#h-844147cb4f4c)

```tsx
() => turn(0, 15)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-efc3c8143342, B-687a141b050f

## X-5f9b381e69da

**아래쪽에서 보기** · Button · user-control

- 실제 소스: [src/ui/math-plot-camera.tsx:204](../../../src/ui/math-plot-camera.tsx#L204)
- 연결 표면: [R09](../paths/R09.md), [O14](../paths/O14.md), [U31](../paths/U31.md), [U32](../paths/U32.md)
- 직접 표시 조건: 별도 조건식 없음
- 실행 차단 disabled: disabled
- readOnly: 명시 없음; required: 명시 없음; form: 없음
- 소스 의미 후보: 화면 상태 동작 (이 분류는 안내용이며 원문 이벤트를 우선한다.)

**onClick** → [@onClick · H-53847ad2ff9e](../handlers/ui__math-plot-camera.md#h-53847ad2ff9e) → [turn · H-7e70e2337905](../handlers/ui__math-plot-camera.md#h-7e70e2337905) → [cameraFacing · H-e613a6bad059](../handlers/ui__math-plot-camera.md#h-e613a6bad059) → [cameraOffset · H-811d1e268acd](../handlers/ui__math-plot-camera.md#h-811d1e268acd) → [@callback:['x', 'y', 'z'].map · H-844147cb4f4c](../handlers/ui__math-plot-camera.md#h-844147cb4f4c)

```tsx
() => turn(0, -15)
```

- 정상 경계: 핸들러의 정상 반환·위임 결과; 성공 의미는 해당 저장/서버 계약에서 판정
- 예외 경계: 로컬 trace에서 catch 확인 안 됨; 호출자/공통 저장 계약 확인
- 마지막 처리: 명시된 finally 없음
- 분기 ID: B-efc3c8143342, B-687a141b050f

