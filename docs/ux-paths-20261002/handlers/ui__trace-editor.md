# src/ui/trace-editor.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-06aab3283868

**TraceEditor** · [src/ui/trace-editor.tsx:26](../../../src/ui/trace-editor.tsx#L26)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 26행 | 별도 조건식 없음 | defaultCriteriaItems()<br>call |
| 32행 | 별도 조건식 없음 | definitions.filter(item => item.mode !== 'excluded')<br>call<br>전달 콜백: H-3a1bcb2b3d95 |
| 33행 | 별도 조건식 없음 | available.map(item => item.id)<br>call<br>전달 콜백: H-22d6594481d0 |
| 34행 | 별도 조건식 없음 | Object.entries(trace).filter(([id]) => !currentIds.has(id))<br>call<br>전달 콜백: H-026b11fdfc29 |
| 34행 | 별도 조건식 없음 | Object.entries(trace)<br>call |
| 52행 | 별도 조건식 없음 | Object.entries(TRACE_GROUP_LABELS).map(([group, label]) => ( <fieldset key={group}> <legend>{label}</legend> {available.filter(item => item.group === group).map(item => editor(item.id, item, TRACE_ITEMS.find(original => original.id === item.id)?.question))} </fieldset> ))<br>call<br>전달 콜백: H-96a8dcfa9979 |
| 52행 | 별도 조건식 없음 | Object.entries(TRACE_GROUP_LABELS)<br>call |
| 63행 | truthy: historical.length > 0 | historical.map(([id, item]) => editor(id, item.definition))<br>call<br>전달 콜백: H-a9a5a9e43a02 |

반환/조기 중단: 48행 <render> [별도 조건식 없음]

## H-3a1bcb2b3d95

**@callback:definitions.filter** · [src/ui/trace-editor.tsx:32](../../../src/ui/trace-editor.tsx#L32)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-22d6594481d0

**@callback:available.map** · [src/ui/trace-editor.tsx:33](../../../src/ui/trace-editor.tsx#L33)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-026b11fdfc29

**@callback:Object.entries(trace).filter** · [src/ui/trace-editor.tsx:34](../../../src/ui/trace-editor.tsx#L34)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 34행 | 별도 조건식 없음 | currentIds.has(id)<br>call |

## H-15948f341507

**editor** · [src/ui/trace-editor.tsx:35](../../../src/ui/trace-editor.tsx#L35)

분기 조건과 가능한 갈림길:

- B-d8d871de9a00 · ConditionalExpression · contextKey → truthy / falsy; 바깥 조건: 별도 조건식 없음 (39행).
- B-0125fae0f585 · ConditionalExpression · item.definition && (item.definition.label !== definition?.label || item.definition.group !== definition?.group) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (41행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 40행 | 별도 조건식 없음 | currentIds.has(id)<br>call |

반환/조기 중단: 38행 <render> [별도 조건식 없음]

## H-4068d3d10f07

**@onChange** · [src/ui/trace-editor.tsx:42](../../../src/ui/trace-editor.tsx#L42)

분기 조건과 가능한 갈림길:

- B-c0b44732ef2f · ConditionalExpression · stored → truthy / falsy; 바깥 조건: 별도 조건식 없음 (44행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 42행 | 별도 조건식 없음 | onChange({ ...trace, [id]: { ...item, ...patch, ...(stored ? { definition: stored } : {}) }, })<br>call |

## H-96a8dcfa9979

**@callback:Object.entries(TRACE_GROUP_LABELS).map** · [src/ui/trace-editor.tsx:52](../../../src/ui/trace-editor.tsx#L52)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 55행 | 별도 조건식 없음 | available.filter(item => item.group === group).map(item => editor(item.id, item, TRACE_ITEMS.find(original => original.id === item.id)?.question))<br>call<br>전달 콜백: H-23359ee6bb4d |
| 55행 | 별도 조건식 없음 | available.filter(item => item.group === group)<br>call<br>전달 콜백: H-04ca6c228191 |

## H-04ca6c228191

**@callback:available.filter** · [src/ui/trace-editor.tsx:55](../../../src/ui/trace-editor.tsx#L55)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-23359ee6bb4d

**@callback:available.filter(item => item.group === group).map** · [src/ui/trace-editor.tsx:55](../../../src/ui/trace-editor.tsx#L55)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 55행 | 별도 조건식 없음 | editor(item.id, item, TRACE_ITEMS.find(original => original.id === item.id)?.question)<br>call → [H-15948f341507](ui__trace-editor.md#h-15948f341507) |
| 56행 | 별도 조건식 없음 | TRACE_ITEMS.find(original => original.id === item.id)<br>call<br>전달 콜백: H-8b56a38ca7a0 |

## H-8b56a38ca7a0

**@callback:TRACE_ITEMS.find** · [src/ui/trace-editor.tsx:56](../../../src/ui/trace-editor.tsx#L56)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a9a5a9e43a02

**@callback:historical.map** · [src/ui/trace-editor.tsx:63](../../../src/ui/trace-editor.tsx#L63)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 63행 | truthy: historical.length > 0 | editor(id, item.definition)<br>call → [H-15948f341507](ui__trace-editor.md#h-15948f341507) |

## H-7353be99913e

**ActivityEditor** · [src/ui/trace-editor.tsx:76](../../../src/ui/trace-editor.tsx#L76)

분기 조건과 가능한 갈림길:

- B-10aaf0d5f225 · ConditionalExpression · useAction && original && original.label === label && original.group === definition?.group → truthy / falsy; 바깥 조건: 별도 조건식 없음 (87행).
- B-83db0b792fbe · ConditionalExpression · item.note || item.repeats?.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (100행).
- B-dc3791f72448 · ConditionalExpression · contextKey → truthy / falsy; 바깥 조건: 별도 조건식 없음 (108행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 86행 | 별도 조건식 없음 | TRACE_ITEMS.find(row => row.id === id)<br>call<br>전달 콜백: H-596a6c623651 |
| 88행 | 별도 조건식 없음 | Boolean(item.examReview?.checked)<br>call |
| 89행 | 별도 조건식 없음 | useState([])<br>call |
| 106행 | 별도 조건식 없음 | Object.entries(statuses).map(([value, text]) => <option key={value} value={value} disabled={confirmed && value !== 'checked'}>{text}</option>)<br>call<br>전달 콜백: H-8bcca2586d07 |
| 106행 | 별도 조건식 없음 | Object.entries(statuses)<br>call |
| 112행 | 별도 조건식 없음 | (item.repeats ?? []).map((repeat, index) => { const invalid = repeat.kind !== 'unknown' && (!Number.isSafeInteger(repeat.count) \|\| Number(repeat.count) < 1); return ( <fieldset key={repeat.id}> <legend>추가 반복 {index + 1}</legend> <div className="field-stack"> <Select label="횟수의 기억 정도" value={repeat.kind} onChange={event => { const kind = event.target.value as Repeat['kind']; changeRepeat(repeat.id, { kind, count: kind === 'unknown' ? null : repeat.count }); }}> <option value="exact">정확한 횟수</option> <option value="minimum">최소 이만큼</option> <option value="unknown">횟수 모름</option> </Select> {repeat.kind !== 'unknown' && <Input label="반복 횟수" type="number" inputMode="numeric" min={1} step={1} value={repeat.count ?? ''} erro … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-c2280c2b46c7 |
| 144행 | truthy: removed.length > 0 | (item.repeats ?? []).some(repeat => repeat.id === removed.at(-1)!.repeat.id)<br>call<br>전달 콜백: H-d3943193d46f |

반환/조기 중단: 93행 <render> [별도 조건식 없음]

## H-596a6c623651

**@callback:TRACE_ITEMS.find** · [src/ui/trace-editor.tsx:86](../../../src/ui/trace-editor.tsx#L86)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-933164406cb5

**changeRepeat** · [src/ui/trace-editor.tsx:90](../../../src/ui/trace-editor.tsx#L90)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 90행 | 별도 조건식 없음 | onChange({ repeats: (item.repeats ?? []).map(repeat => repeat.id === id ? { ...repeat, ...patch } : repeat), })<br>call |
| 91행 | 별도 조건식 없음 | (item.repeats ?? []).map(repeat => repeat.id === id ? { ...repeat, ...patch } : repeat)<br>call<br>전달 콜백: H-6cc90cac00f1 |

## H-6cc90cac00f1

**@callback:(item.repeats ?? []).map** · [src/ui/trace-editor.tsx:91](../../../src/ui/trace-editor.tsx#L91)

분기 조건과 가능한 갈림길:

- B-9514878de50b · ConditionalExpression · repeat.id === id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (91행).

## H-65d0c4cec398

**@onChange** · [src/ui/trace-editor.tsx:96](../../../src/ui/trace-editor.tsx#L96)

분기 조건과 가능한 갈림길:

- B-45d85fdf3c37 · ConditionalExpression · event.target.checked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (96행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 96행 | 별도 조건식 없음 | onChange({ status: event.target.checked ? 'checked' : 'unchecked' })<br>call |

## H-ed2effb9d07e

**@onChange** · [src/ui/trace-editor.tsx:105](../../../src/ui/trace-editor.tsx#L105)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 105행 | 별도 조건식 없음 | onChange({ status: event.target.value as ActivityStatus })<br>call |

## H-8bcca2586d07

**@callback:Object.entries(statuses).map** · [src/ui/trace-editor.tsx:106](../../../src/ui/trace-editor.tsx#L106)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d79261d12c07

**@onChange** · [src/ui/trace-editor.tsx:110](../../../src/ui/trace-editor.tsx#L110)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 110행 | 별도 조건식 없음 | onChange({ note: event.target.value })<br>call |

## H-c2280c2b46c7

**@callback:(item.repeats ?? []).map** · [src/ui/trace-editor.tsx:112](../../../src/ui/trace-editor.tsx#L112)

분기 조건과 가능한 갈림길:

- B-e7f41f063f4c · ConditionalExpression · invalid → truthy / falsy; 바깥 조건: truthy: repeat.kind !== 'unknown' ∧ slot-active: error (127행).
- B-ad29a69da384 · ConditionalExpression · contextKey → truthy / falsy; 바깥 조건: 별도 조건식 없음 (129행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 113행 | truthy: repeat.kind !== 'unknown' | Number.isSafeInteger(repeat.count)<br>call |
| 113행 | truthy: repeat.kind !== 'unknown' ∧ falsy: !Number.isSafeInteger(repeat.count) | Number(repeat.count)<br>call |

반환/조기 중단: 114행 <render> [별도 조건식 없음]

## H-572f4b089c95

**@onChange** · [src/ui/trace-editor.tsx:118](../../../src/ui/trace-editor.tsx#L118)

분기 조건과 가능한 갈림길:

- B-8f1075d93406 · ConditionalExpression · kind === 'unknown' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (120행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 120행 | 별도 조건식 없음 | changeRepeat(repeat.id, { kind, count: kind === 'unknown' ? null : repeat.count })<br>call → [H-933164406cb5](ui__trace-editor.md#h-933164406cb5) |

## H-9ae8b774b517

**@onChange** · [src/ui/trace-editor.tsx:128](../../../src/ui/trace-editor.tsx#L128)

분기 조건과 가능한 갈림길:

- B-f46c21519f0c · ConditionalExpression · event.target.value === '' → truthy / falsy; 바깥 조건: truthy: repeat.kind !== 'unknown' (128행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 128행 | truthy: repeat.kind !== 'unknown' | changeRepeat(repeat.id, { count: event.target.value === '' ? null : Number(event.target.value) })<br>call → [H-933164406cb5](ui__trace-editor.md#h-933164406cb5) |
| 128행 | truthy: repeat.kind !== 'unknown' ∧ falsy: event.target.value === '' | Number(event.target.value)<br>call |

## H-b4b7236a66d1

**@onChange** · [src/ui/trace-editor.tsx:130](../../../src/ui/trace-editor.tsx#L130)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 130행 | 별도 조건식 없음 | changeRepeat(repeat.id, { note: event.target.value })<br>call → [H-933164406cb5](ui__trace-editor.md#h-933164406cb5) |

## H-3dad3df6e5ec

**@onClick** · [src/ui/trace-editor.tsx:131](../../../src/ui/trace-editor.tsx#L131)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 132행 | 별도 조건식 없음 | setRemoved(previous => [...previous, { repeat, index, nextId: item.repeats?.[index + 1]?.id }])<br>state-update<br>전달 콜백: H-e6b0e94df2af |
| 133행 | 별도 조건식 없음 | onChange({ repeats: (item.repeats ?? []).filter(row => row.id !== repeat.id) })<br>call |
| 133행 | 별도 조건식 없음 | (item.repeats ?? []).filter(row => row.id !== repeat.id)<br>call<br>전달 콜백: H-48989eb757f0 |

## H-e6b0e94df2af

**@callback:setRemoved** · [src/ui/trace-editor.tsx:132](../../../src/ui/trace-editor.tsx#L132)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-48989eb757f0

**@callback:(item.repeats ?? []).filter** · [src/ui/trace-editor.tsx:133](../../../src/ui/trace-editor.tsx#L133)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-69fa3aa84eca

**@onClick** · [src/ui/trace-editor.tsx:139](../../../src/ui/trace-editor.tsx#L139)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 139행 | 별도 조건식 없음 | onChange({ repeats: [ ...(item.repeats ?? []), { id: crypto.randomUUID(), kind: 'exact', count: 1 }, ] })<br>call |
| 140행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |

## H-d3943193d46f

**@callback:(item.repeats ?? []).some** · [src/ui/trace-editor.tsx:144](../../../src/ui/trace-editor.tsx#L144)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 144행 | truthy: removed.length > 0 | removed.at(-1)<br>call |

## H-00fd9c4ed1f4

**@onClick** · [src/ui/trace-editor.tsx:144](../../../src/ui/trace-editor.tsx#L144)

분기 조건과 가능한 갈림길:

- B-c6065ee87119 · ConditionalExpression · nextIndex < 0 → truthy / falsy; 바깥 조건: truthy: removed.length > 0 (148행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 145행 | truthy: removed.length > 0 | removed.at(-1)<br>call |
| 147행 | truthy: removed.length > 0 | repeats.findIndex(repeat => repeat.id === last.nextId)<br>call<br>전달 콜백: H-e424d2054da5 |
| 148행 | truthy: removed.length > 0 | repeats.splice(nextIndex < 0 ? Math.min(last.index, repeats.length) : nextIndex, 0, last.repeat)<br>call |
| 148행 | truthy: removed.length > 0 ∧ truthy: nextIndex < 0 | Math.min(last.index, repeats.length)<br>call |
| 149행 | truthy: removed.length > 0 | onChange({ repeats })<br>call |
| 150행 | truthy: removed.length > 0 | setRemoved(previous => previous.slice(0, -1))<br>state-update<br>전달 콜백: H-5a6d23191427 |

## H-e424d2054da5

**@callback:repeats.findIndex** · [src/ui/trace-editor.tsx:147](../../../src/ui/trace-editor.tsx#L147)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-5a6d23191427

**@callback:setRemoved** · [src/ui/trace-editor.tsx:150](../../../src/ui/trace-editor.tsx#L150)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 150행 | truthy: removed.length > 0 | previous.slice(0, -1)<br>call |

