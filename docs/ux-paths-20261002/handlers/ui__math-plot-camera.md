# src/ui/math-plot-camera.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-1b3a7af48194

**defaultMathCamera** · [src/ui/math-plot-camera.tsx:8](../../../src/ui/math-plot-camera.tsx#L8)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-811d1e268acd

**cameraOffset** · [src/ui/math-plot-camera.tsx:13](../../../src/ui/math-plot-camera.tsx#L13)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 14행 | 별도 조건식 없음 | ['x', 'y', 'z'].map((axis) => { const key = axis as 'x' \| 'y' \| 'z'; return (camera.eye?.[key] ?? 1.25) - (camera.center?.[key] ?? 0); })<br>call<br>전달 콜백: H-844147cb4f4c |

반환/조기 중단: 14행 ['x', 'y', 'z'].map((axis) => { const key = axis as 'x' | 'y' | 'z'; return (camera.eye?.[key] ?? 1.25) - (camera.center?.[key] ?? 0); }) as Vec3 [별도 조건식 없음]

## H-844147cb4f4c

**@callback:['x', 'y', 'z'].map** · [src/ui/math-plot-camera.tsx:14](../../../src/ui/math-plot-camera.tsx#L14)


반환/조기 중단: 16행 (camera.eye?.[key] ?? 1.25) - (camera.center?.[key] ?? 0) [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3f0634eff8a6

**cameraScale** · [src/ui/math-plot-camera.tsx:20](../../../src/ui/math-plot-camera.tsx#L20)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 21행 | 별도 조건식 없음 | Math.hypot(...cameraOffset(defaultMathCamera()))<br>call |
| 21행 | 별도 조건식 없음 | cameraOffset(defaultMathCamera())<br>call → [H-811d1e268acd](ui__math-plot-camera.md#h-811d1e268acd) |
| 21행 | 별도 조건식 없음 | defaultMathCamera()<br>call → [H-1b3a7af48194](ui__math-plot-camera.md#h-1b3a7af48194) |
| 22행 | 별도 조건식 없음 | Math.max(0.08, Math.min(80, Math.hypot(...cameraOffset(camera))))<br>call |
| 22행 | 별도 조건식 없음 | Math.min(80, Math.hypot(...cameraOffset(camera)))<br>call |
| 22행 | 별도 조건식 없음 | Math.hypot(...cameraOffset(camera))<br>call |
| 22행 | 별도 조건식 없음 | cameraOffset(camera)<br>call → [H-811d1e268acd](ui__math-plot-camera.md#h-811d1e268acd) |

반환/조기 중단: 22행 baseline / Math.max(0.08, Math.min(80, Math.hypot(...cameraOffset(camera)))) [별도 조건식 없음]

## H-c6458d928995

**renderMathCamera** · [src/ui/math-plot-camera.tsx:25](../../../src/ui/math-plot-camera.tsx#L25)

분기 조건과 가능한 갈림길:

- B-c29de710999b · IfStatement · !Number.isFinite(length) || length < 1e-12 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (33행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 31행 | 별도 조건식 없음 | cameraOffset(view)<br>call → [H-811d1e268acd](ui__math-plot-camera.md#h-811d1e268acd) |
| 32행 | 별도 조건식 없음 | Math.hypot(...offset)<br>call |
| 33행 | 별도 조건식 없음 | Number.isFinite(length)<br>call |
| 34행 | truthy: !Number.isFinite(length) \|\| length < 1e-12 | cameraOffset(defaultMathCamera())<br>call → [H-811d1e268acd](ui__math-plot-camera.md#h-811d1e268acd) |
| 34행 | truthy: !Number.isFinite(length) \|\| length < 1e-12 | defaultMathCamera()<br>call → [H-1b3a7af48194](ui__math-plot-camera.md#h-1b3a7af48194) |
| 35행 | truthy: !Number.isFinite(length) \|\| length < 1e-12 | Math.hypot(...offset)<br>call |

반환/조기 중단: 38행 { ...view, center, eye: { x: center.x + offset[0] * ratio, y: center.y + offset[1] * ratio, z: center.z + offset[2] * ratio, }, projection: { type: 'orthographic' }, } [별도 조건식 없음]

## H-f31d101b18e6

**recoverMathCamera** · [src/ui/math-plot-camera.tsx:51](../../../src/ui/math-plot-camera.tsx#L51)

분기 조건과 가능한 갈림길:

- B-052bba19a0fd · IfStatement · !Number.isFinite(length) || length < 1e-12 || !Number.isFinite(previousDistance) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (63행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 52행 | 별도 조건식 없음 | renderMathCamera(previousView)<br>call → [H-c6458d928995](ui__math-plot-camera.md#h-c6458d928995) |
| 60행 | 별도 조건식 없음 | cameraOffset(next)<br>call → [H-811d1e268acd](ui__math-plot-camera.md#h-811d1e268acd) |
| 61행 | 별도 조건식 없음 | Math.hypot(...offset)<br>call |
| 62행 | 별도 조건식 없음 | Math.hypot(...cameraOffset(previousView))<br>call |
| 62행 | 별도 조건식 없음 | cameraOffset(previousView)<br>call → [H-811d1e268acd](ui__math-plot-camera.md#h-811d1e268acd) |
| 63행 | 별도 조건식 없음 | Number.isFinite(length)<br>call |
| 63행 | falsy: !Number.isFinite(length) \|\| length < 1e-12 | Number.isFinite(previousDistance)<br>call |

반환/조기 중단: 64행 previousView [truthy: !Number.isFinite(length) || length < 1e-12 || !Number.isFinite(previousDistance)]; 66행 { ...next, eye: { x: (next.center.x ?? 0) + offset[0] * ratio, y: (next.center.y ?? 0) + offset[1] * ratio, z: (next.center.z ?? 0) + offset[2] * ratio, }, projection: { type: 'orthographic' }, } [별도 조건식 없음]

## H-e613a6bad059

**cameraFacing** · [src/ui/math-plot-camera.tsx:76](../../../src/ui/math-plot-camera.tsx#L76)

분기 조건과 가능한 갈림길:

- B-efc3c8143342 · IfStatement · !unit || !Number.isFinite(unit) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (78행).
- B-687a141b050f · ConditionalExpression · Math.abs(direction[2] / unit) > 0.99 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (89행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 77행 | 별도 조건식 없음 | Math.hypot(...direction)<br>call |
| 78행 | falsy: !unit | Number.isFinite(unit)<br>call |
| 79행 | 별도 조건식 없음 | Math.max(0.08, Math.hypot(...cameraOffset(camera)))<br>call |
| 79행 | 별도 조건식 없음 | Math.hypot(...cameraOffset(camera))<br>call |
| 79행 | 별도 조건식 없음 | cameraOffset(camera)<br>call → [H-811d1e268acd](ui__math-plot-camera.md#h-811d1e268acd) |
| 89행 | 별도 조건식 없음 | Math.abs(direction[2] / unit)<br>call |

반환/조기 중단: 78행 camera [truthy: !unit || !Number.isFinite(unit)]; 81행 { ...camera, eye: { x: (center.x ?? 0) + direction[0] * distance / unit, y: (center.y ?? 0) + direction[1] * distance / unit, z: (center.z ?? 0) + direction[2] * distance / unit, }, // Looking straight down needs an up vector perpendicular to the sightline. up: Math.abs(direction[2] / unit) > 0.99 ? { x: 0, y: 1, z: 0 } : { x: 0, y: 0, z: 1 }, } [별도 조건식 없음]

## H-73ca7c21e32e

**focusPointCamera** · [src/ui/math-plot-camera.tsx:118](../../../src/ui/math-plot-camera.tsx#L118)

분기 조건과 가능한 갈림길:

- B-207baf5caf68 · IfStatement · !Number.isFinite(metric.unit) || metric.unit <= 0 || !point.every(Number.isFinite) || !metric.center.every(Number.isFinite) || (distance !== undefined && !Number.isFinite(distance)) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (124행).
- B-357076b8e678 · IfStatement · !offset.every(Number.isFinite) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (133행).
- B-af9be0b1d7d9 · IfStatement · distance !== undefined → truthy / falsy; 바깥 조건: 별도 조건식 없음 (134행).
- B-279194b2c343 · IfStatement · length < 1e-12 → truthy / falsy; 바깥 조건: truthy: distance !== undefined (138행).
- B-f7f4f9d35ce9 · ConditionalExpression · distance === undefined → truthy / falsy; 바깥 조건: 별도 조건식 없음 (145행).
- B-3e0c89815a80 · IfStatement · !center.every(Number.isFinite) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (149행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 125행 | 별도 조건식 없음 | Number.isFinite(metric.unit)<br>call |
| 126행 | falsy: !Number.isFinite(metric.unit) \|\| metric.unit <= 0 | point.every(Number.isFinite)<br>call |
| 126행 | falsy: !Number.isFinite(metric.unit) \|\| metric.unit <= 0 \|\|<br>    !point.every(Number.isFinite) | metric.center.every(Number.isFinite)<br>call |
| 127행 | falsy: !Number.isFinite(metric.unit) \|\| metric.unit <= 0 \|\|<br>    !point.every(Number.isFinite) \|\| !metric.center.every(Number.isFinite) ∧ truthy: distance !== undefined | Number.isFinite(distance)<br>call |
| 132행 | 별도 조건식 없음 | cameraOffset(camera)<br>call → [H-811d1e268acd](ui__math-plot-camera.md#h-811d1e268acd) |
| 133행 | 별도 조건식 없음 | offset.every(Number.isFinite)<br>call |
| 135행 | truthy: distance !== undefined | Math.hypot(...offset)<br>call |
| 139행 | truthy: distance !== undefined ∧ truthy: length < 1e-12 | cameraOffset(defaultMathCamera())<br>call → [H-811d1e268acd](ui__math-plot-camera.md#h-811d1e268acd) |
| 139행 | truthy: distance !== undefined ∧ truthy: length < 1e-12 | defaultMathCamera()<br>call → [H-1b3a7af48194](ui__math-plot-camera.md#h-1b3a7af48194) |
| 140행 | truthy: distance !== undefined ∧ truthy: length < 1e-12 | Math.hypot(...offset)<br>call |
| 142행 | truthy: distance !== undefined | Math.max(0.08, Math.min(80, distance))<br>call |
| 142행 | truthy: distance !== undefined | Math.min(80, distance)<br>call |
| 143행 | truthy: distance !== undefined | offset.map((value) => value * ratio)<br>call<br>전달 콜백: H-a9a555c3275d |
| 146행 | truthy: distance === undefined | cameraScale(camera)<br>call → [H-3f0634eff8a6](ui__math-plot-camera.md#h-3f0634eff8a6) |
| 147행 | falsy: distance === undefined | Math.hypot(...cameraOffset(defaultMathCamera()))<br>call |
| 147행 | falsy: distance === undefined | cameraOffset(defaultMathCamera())<br>call → [H-811d1e268acd](ui__math-plot-camera.md#h-811d1e268acd) |
| 147행 | falsy: distance === undefined | defaultMathCamera()<br>call → [H-1b3a7af48194](ui__math-plot-camera.md#h-1b3a7af48194) |
| 147행 | falsy: distance === undefined | Math.max(0.08, Math.min(80, distance))<br>call |
| 147행 | falsy: distance === undefined | Math.min(80, distance)<br>call |
| 148행 | 별도 조건식 없음 | point.map((value, index) => (value - metric.center[index]) / metric.unit * viewScale)<br>call<br>전달 콜백: H-55e76dfe1e8a |
| 149행 | 별도 조건식 없음 | center.every(Number.isFinite)<br>call |

반환/조기 중단: 128행 camera [truthy: !Number.isFinite(metric.unit) || metric.unit <= 0 ||
    !point.every(Number.isFinite) || !metric.center.every(Number.isFinite) ||
    (distance !== undefined && !Number.isFinite(distance))]; 133행 camera [truthy: !offset.every(Number.isFinite)]; 149행 camera [truthy: !center.every(Number.isFinite)]; 150행 { ...camera, center: { x: center[0], y: center[1], z: center[2] }, eye: { x: center[0] + offset[0], y: center[1] + offset[1], z: center[2] + offset[2] }, } [별도 조건식 없음]

## H-a9a555c3275d

**@callback:offset.map** · [src/ui/math-plot-camera.tsx:143](../../../src/ui/math-plot-camera.tsx#L143)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-55e76dfe1e8a

**@callback:point.map** · [src/ui/math-plot-camera.tsx:148](../../../src/ui/math-plot-camera.tsx#L148)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-09eee2b402e2

**MathCameraControls** · [src/ui/math-plot-camera.tsx:158](../../../src/ui/math-plot-camera.tsx#L158)

분기 조건과 가능한 갈림길:

- B-bd3a8cbd89e6 · ConditionalExpression · T && N && B → truthy / falsy; 바깥 조건: 별도 조건식 없음 (174행).
- B-a644a990d0c8 · IfStatement · frame && frame[2] < 0 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (177행).
- B-5f53006a2c1e · ConditionalExpression · pointFocus.active → truthy / falsy; 바깥 조건: truthy: pointFocus (183행).
- B-93226144f2d8 · ConditionalExpression · pointFocus.active → truthy / falsy; 바깥 조건: truthy: pointFocus (185행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 174행 | truthy: T && N && B | T.map((v, i) => v + N[i] + B[i])<br>call<br>전달 콜백: H-5d5e4b871221 |
| 177행 | truthy: frame && frame[2] < 0 | frame.forEach((v, i) => { frame[i] = -v; })<br>call<br>전달 콜백: H-aed5a00ee615 |

반환/조기 중단: 178행 <render> [별도 조건식 없음]

## H-7e70e2337905

**turn** · [src/ui/math-plot-camera.tsx:165](../../../src/ui/math-plot-camera.tsx#L165)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 166행 | 별도 조건식 없음 | readCamera()<br>call |
| 166행 | 별도 조건식 없음 | cameraOffset(current)<br>call → [H-811d1e268acd](ui__math-plot-camera.md#h-811d1e268acd) |
| 167행 | 별도 조건식 없음 | Math.atan2(offset[1], offset[0])<br>call |
| 168행 | 별도 조건식 없음 | Math.max(-85, Math.min(85, Math.atan2(offset[2], Math.hypot(offset[0], offset[1])) * 180 / Math.PI + elevation, ))<br>call |
| 168행 | 별도 조건식 없음 | Math.min(85, Math.atan2(offset[2], Math.hypot(offset[0], offset[1])) * 180 / Math.PI + elevation)<br>call |
| 169행 | 별도 조건식 없음 | Math.atan2(offset[2], Math.hypot(offset[0], offset[1]))<br>call |
| 169행 | 별도 조건식 없음 | Math.hypot(offset[0], offset[1])<br>call |
| 171행 | 별도 조건식 없음 | applyCamera(cameraFacing(current, [Math.cos(phi) * Math.cos(theta), Math.cos(phi) * Math.sin(theta), Math.sin(phi)]))<br>call |
| 171행 | 별도 조건식 없음 | cameraFacing(current, [Math.cos(phi) * Math.cos(theta), Math.cos(phi) * Math.sin(theta), Math.sin(phi)])<br>call → [H-e613a6bad059](ui__math-plot-camera.md#h-e613a6bad059) |
| 171행 | 별도 조건식 없음 | Math.cos(phi)<br>call |
| 171행 | 별도 조건식 없음 | Math.cos(theta)<br>call |
| 171행 | 별도 조건식 없음 | Math.cos(phi)<br>call |
| 171행 | 별도 조건식 없음 | Math.sin(theta)<br>call |
| 171행 | 별도 조건식 없음 | Math.sin(phi)<br>call |

## H-5d5e4b871221

**@callback:T.map** · [src/ui/math-plot-camera.tsx:174](../../../src/ui/math-plot-camera.tsx#L174)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-aed5a00ee615

**@callback:frame.forEach** · [src/ui/math-plot-camera.tsx:177](../../../src/ui/math-plot-camera.tsx#L177)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-9885aecd8377

**@onChange** · [src/ui/math-plot-camera.tsx:186](../../../src/ui/math-plot-camera.tsx#L186)

분기 조건과 가능한 갈림길:

- B-ff4c391aa1a6 · IfStatement · direction → truthy / falsy; 바깥 조건: 별도 조건식 없음 (191행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 191행 | truthy: direction | applyCamera(cameraFacing(readCamera(), direction))<br>call |
| 191행 | truthy: direction | cameraFacing(readCamera(), direction)<br>call → [H-e613a6bad059](ui__math-plot-camera.md#h-e613a6bad059) |
| 191행 | truthy: direction | readCamera()<br>call |

## H-6f2014a35f92

**@onClick** · [src/ui/math-plot-camera.tsx:199](../../../src/ui/math-plot-camera.tsx#L199)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 199행 | truthy: frame | applyCamera(cameraFacing(readCamera(), frame))<br>call |
| 199행 | truthy: frame | cameraFacing(readCamera(), frame)<br>call → [H-e613a6bad059](ui__math-plot-camera.md#h-e613a6bad059) |
| 199행 | truthy: frame | readCamera()<br>call |

## H-03c7565d8e3a

**@onClick** · [src/ui/math-plot-camera.tsx:201](../../../src/ui/math-plot-camera.tsx#L201)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 201행 | 별도 조건식 없음 | turn(-15, 0)<br>call → [H-7e70e2337905](ui__math-plot-camera.md#h-7e70e2337905) |

## H-80a0c21b12cf

**@onClick** · [src/ui/math-plot-camera.tsx:202](../../../src/ui/math-plot-camera.tsx#L202)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 202행 | 별도 조건식 없음 | turn(15, 0)<br>call → [H-7e70e2337905](ui__math-plot-camera.md#h-7e70e2337905) |

## H-6f25ef5c1c8e

**@onClick** · [src/ui/math-plot-camera.tsx:203](../../../src/ui/math-plot-camera.tsx#L203)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 203행 | 별도 조건식 없음 | turn(0, 15)<br>call → [H-7e70e2337905](ui__math-plot-camera.md#h-7e70e2337905) |

## H-53847ad2ff9e

**@onClick** · [src/ui/math-plot-camera.tsx:204](../../../src/ui/math-plot-camera.tsx#L204)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 204행 | 별도 조건식 없음 | turn(0, -15)<br>call → [H-7e70e2337905](ui__math-plot-camera.md#h-7e70e2337905) |

