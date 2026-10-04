# src/ui/canvas-transfer.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-b8ca2091da08

**download** · [src/ui/canvas-transfer.tsx:8](../../../src/ui/canvas-transfer.tsx#L8)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 9행 | 별도 조건식 없음 | URL.createObjectURL(new Blob([content], { type }))<br>call |
| 10행 | 별도 조건식 없음 | document.createElement('a')<br>call |
| 13행 | 별도 조건식 없음 | link.click()<br>call |
| 14행 | 별도 조건식 없음 | setTimeout(() => URL.revokeObjectURL(url), 1000)<br>state-update<br>전달 콜백: H-f38b1d2c3921 |

## H-f38b1d2c3921

**@callback:setTimeout** · [src/ui/canvas-transfer.tsx:14](../../../src/ui/canvas-transfer.tsx#L14)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 14행 | 별도 조건식 없음 | URL.revokeObjectURL(url)<br>call |

## H-c41b239b46be

**CanvasTransfer** · [src/ui/canvas-transfer.tsx:16](../../../src/ui/canvas-transfer.tsx#L16)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 29행 | 별도 조건식 없음 | useState(null)<br>call |
| 30행 | 별도 조건식 없음 | useState('')<br>call |
| 31행 | 별도 조건식 없음 | useState(false)<br>call |
| 32행 | 별도 조건식 없음 | projectCanvas(data).links.filter((link) => link.id.startsWith('auto:'))<br>call<br>전달 콜백: H-5cdeda66b495 |
| 32행 | 별도 조건식 없음 | projectCanvas(data)<br>call |
| 84행 | truthy: candidate | Object.keys(candidate.positions)<br>call |

반환/조기 중단: 33행 <render> [별도 조건식 없음]

## H-5cdeda66b495

**@callback:projectCanvas(data).links.filter** · [src/ui/canvas-transfer.tsx:32](../../../src/ui/canvas-transfer.tsx#L32)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 32행 | 별도 조건식 없음 | link.id.startsWith('auto:')<br>call |

## H-58d5788da128

**@onClick** · [src/ui/canvas-transfer.tsx:41](../../../src/ui/canvas-transfer.tsx#L41)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 42행 | 별도 조건식 없음 | download(canvasLayoutFile(data, content), 'application/json', 'ManSeekSong-Canvas.json')<br>call → [H-b8ca2091da08](ui__canvas-transfer.md#h-b8ca2091da08) |
| 42행 | 별도 조건식 없음 | canvasLayoutFile(data, content)<br>call |

## H-ce6697a79747

**@onClick** · [src/ui/canvas-transfer.tsx:48](../../../src/ui/canvas-transfer.tsx#L48)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 49행 | 별도 조건식 없음 | download(canvasDiagramSvg(cards, { ...content, links: [...automaticLinks, ...content.links] }), 'image/svg+xml', 'ManSeekSong-Canvas.svg')<br>call → [H-b8ca2091da08](ui__canvas-transfer.md#h-b8ca2091da08) |
| 50행 | 별도 조건식 없음 | canvasDiagramSvg(cards, { ...content, links: [...automaticLinks, ...content.links] })<br>call |

## H-db3de410f385

**@onChange** · [src/ui/canvas-transfer.tsx:64](../../../src/ui/canvas-transfer.tsx#L64) · async

분기 조건과 가능한 갈림길:

- B-0baa3a4b0369 · IfStatement · !file → truthy / falsy; 바깥 조건: 별도 조건식 없음 (68행).
- B-b14be287015e · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (70행).
- B-c6e48a0ce11d · IfStatement · file.size > 2_000_000 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (71행).
- B-dc7a64cd6160 · CatchClause · failure → exception; 바깥 조건: 별도 조건식 없음 (73행).
- B-574ba98d7792 · ConditionalExpression · failure instanceof Error → truthy / falsy; 바깥 조건: exception: failure (74행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 66행 | 별도 조건식 없음 | setCandidate(null)<br>state-update |
| 67행 | 별도 조건식 없음 | setError('')<br>state-update |
| 69행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 71행 | truthy: file.size > 2_000_000 | Error('2MB 이내의 배치 파일을 선택해 주세요.')<br>call |
| 72행 | 별도 조건식 없음 | setCandidate(parseCanvasLayoutFile(await file.text(), data))<br>state-update |
| 72행 | 별도 조건식 없음 | parseCanvasLayoutFile(await file.text(), data)<br>call |
| 72행 | 별도 조건식 없음 | file.text()<br>call |
| 74행 | exception: failure | setError(failure instanceof Error ? failure.message : '배치 파일을 읽지 못했습니다.')<br>state-update |
| 76행 | always-after-try: try 완료 또는 예외 이후 | setBusy(false)<br>state-update |

반환/조기 중단: 68행 <render> [truthy: !file]

throw: 71행 Error('2MB 이내의 배치 파일을 선택해 주세요.')

## H-b47af4afefc2

**@onClick** · [src/ui/canvas-transfer.tsx:90](../../../src/ui/canvas-transfer.tsx#L90)

분기 조건과 가능한 갈림길:

- B-7773e2fc2786 · IfStatement · onImport(candidate) → truthy / falsy; 바깥 조건: truthy: candidate (91행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 91행 | truthy: candidate | onImport(candidate)<br>call |
| 92행 | truthy: candidate ∧ truthy: onImport(candidate) | setCandidate(null)<br>state-update |
| 93행 | truthy: candidate ∧ truthy: onImport(candidate) | setError('')<br>state-update |

## H-0b74e59ec62c

**@onClick** · [src/ui/canvas-transfer.tsx:99](../../../src/ui/canvas-transfer.tsx#L99)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 99행 | truthy: candidate | setCandidate(null)<br>state-update |

