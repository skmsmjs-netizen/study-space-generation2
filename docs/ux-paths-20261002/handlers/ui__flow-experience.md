# src/ui/flow-experience.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-e5c9f4b796e1

**flowEdgeType** · [src/ui/flow-experience.tsx:32](../../../src/ui/flow-experience.tsx#L32)

분기 조건과 가능한 갈림길:

- B-45ce916fc19e · ConditionalExpression · style === 'bezier' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (32행).

## H-6adfbd0fd9c5

**FlowExperience** · [src/ui/flow-experience.tsx:34](../../../src/ui/flow-experience.tsx#L34)

분기 조건과 가능한 갈림길:

- B-1aa2219830c9 · ConditionalExpression · value.background === 'dots' → truthy / falsy; 바깥 조건: truthy: value.background !== 'none' (72행).
- B-9c95dafdc5e2 · ConditionalExpression · value.background === 'lines' → truthy / falsy; 바깥 조건: truthy: value.background !== 'none' ∧ falsy: value.background === 'dots' (74행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 51행 | 별도 조건식 없음 | useState(false)<br>call |
| 52행 | 별도 조건식 없음 | useState(null)<br>call |
| 53행 | 별도 조건식 없음 | useReactFlow()<br>call |
| 54행 | 별도 조건식 없음 | useViewport()<br>call |
| 83행 | 별도 조건식 없음 | Math.round(zoom * 100)<br>call |
| 92행 | truthy: open ∧ nullish: zoomDraft | Math.round(zoom * 100)<br>call |
| 106행 | truthy: open ∧ falsy: zoomDraft === null \|\|<br>                !zoomDraft | Number.isFinite(Number(zoomDraft))<br>call |
| 106행 | truthy: open ∧ falsy: zoomDraft === null \|\|<br>                !zoomDraft | Number(zoomDraft)<br>call |
| 107행 | truthy: open ∧ falsy: zoomDraft === null \|\|<br>                !zoomDraft \|\|<br>                !Number.isFinite(Number(zoomDraft)) | Number(zoomDraft)<br>call |

반환/조기 중단: 64행 <render> [별도 조건식 없음]

## H-8b68b4acf07d

**applyZoom** · [src/ui/flow-experience.tsx:56](../../../src/ui/flow-experience.tsx#L56)

분기 조건과 가능한 갈림길:

- B-d75c38ebb3b4 · IfStatement · zoomDraft !== null && Number.isFinite(next) && next > 0 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (58행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 57행 | 별도 조건식 없음 | Number(zoomDraft)<br>call |
| 58행 | truthy: zoomDraft !== null | Number.isFinite(next)<br>call |
| 59행 | truthy: zoomDraft !== null && Number.isFinite(next) && next > 0 | flow.zoomTo(Math.max(minZoom, Math.min(maxZoom, next / 100))).then(onViewportCommit)<br>call |
| 59행 | truthy: zoomDraft !== null && Number.isFinite(next) && next > 0 | flow.zoomTo(Math.max(minZoom, Math.min(maxZoom, next / 100)))<br>call |
| 59행 | truthy: zoomDraft !== null && Number.isFinite(next) && next > 0 | Math.max(minZoom, Math.min(maxZoom, next / 100))<br>call |
| 59행 | truthy: zoomDraft !== null && Number.isFinite(next) && next > 0 | Math.min(maxZoom, next / 100)<br>call |
| 60행 | truthy: zoomDraft !== null && Number.isFinite(next) && next > 0 | setZoomDraft(null)<br>state-update |

## H-850f34567670

**@onClick** · [src/ui/flow-experience.tsx:82](../../../src/ui/flow-experience.tsx#L82)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 82행 | 별도 조건식 없음 | setOpen(!open)<br>state-update |

## H-9f5da529609c

**@onChange** · [src/ui/flow-experience.tsx:93](../../../src/ui/flow-experience.tsx#L93)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 93행 | truthy: open | setZoomDraft(event.target.value)<br>state-update |

## H-f02df9afad43

**@onKeyDown** · [src/ui/flow-experience.tsx:94](../../../src/ui/flow-experience.tsx#L94)

분기 조건과 가능한 갈림길:

- B-84747a4d3778 · IfStatement · event.key === 'Enter' → truthy / falsy; 바깥 조건: truthy: open (95행).
- B-ec794d88e693 · IfStatement · event.key === 'Escape' → truthy / falsy; 바깥 조건: truthy: open (99행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 96행 | truthy: open ∧ truthy: event.key === 'Enter' | event.preventDefault()<br>input-control |
| 97행 | truthy: open ∧ truthy: event.key === 'Enter' | applyZoom()<br>call → [H-8b68b4acf07d](ui__flow-experience.md#h-8b68b4acf07d) |
| 99행 | truthy: open ∧ truthy: event.key === 'Escape' | setZoomDraft(null)<br>state-update |

## H-d041ce05213d

**@onChange** · [src/ui/flow-experience.tsx:116](../../../src/ui/flow-experience.tsx#L116)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 117행 | truthy: open | store({ ...value, minimap: event.target.value as typeof value.minimap })<br>call |

## H-c38b46d27a51

**@onChange** · [src/ui/flow-experience.tsx:127](../../../src/ui/flow-experience.tsx#L127)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 128행 | truthy: open | store({ ...value, mode: event.target.value as typeof value.mode })<br>call |

## H-de179db587d2

**@onChange** · [src/ui/flow-experience.tsx:137](../../../src/ui/flow-experience.tsx#L137)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 138행 | truthy: open | store({ ...value, background: event.target.value as typeof value.background })<br>call |

## H-5b0c21a0c567

**@onChange** · [src/ui/flow-experience.tsx:149](../../../src/ui/flow-experience.tsx#L149)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 150행 | truthy: open | store({ ...value, edgeStyle: event.target.value as typeof value.edgeStyle })<br>call |

## H-58aa3b25c80c

**@onChange** · [src/ui/flow-experience.tsx:161](../../../src/ui/flow-experience.tsx#L161)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 161행 | truthy: open | store({ ...value, snap: event.target.checked })<br>call |

## H-d413e8469269

**@onClick** · [src/ui/flow-experience.tsx:165](../../../src/ui/flow-experience.tsx#L165)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 166행 | truthy: open | flow<br>                  .fitView({<br>                    nodes: selectedIds.map((id) => ({ id })),<br>                    padding: 0.3,<br>                    maxZoom: 1.2,<br>                  })<br>                  .then(onViewportCommit)<br>call |
| 166행 | truthy: open | flow<br>                  .fitView({ nodes: selectedIds.map((id) => ({ id })), padding: 0.3, maxZoom: 1.2, })<br>call |
| 168행 | truthy: open | selectedIds.map((id) => ({ id }))<br>call<br>전달 콜백: H-7c49aa4a5646 |

## H-7c49aa4a5646

**@callback:selectedIds.map** · [src/ui/flow-experience.tsx:168](../../../src/ui/flow-experience.tsx#L168)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

