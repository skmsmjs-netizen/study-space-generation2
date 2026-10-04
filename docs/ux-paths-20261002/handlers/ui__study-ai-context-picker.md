# src/ui/study-ai-context-picker.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-6268c232591d

**StudyAIContextPicker** · [src/ui/study-ai-context-picker.tsx:10](../../../src/ui/study-ai-context-picker.tsx#L10)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 23행 | 별도 조건식 없음 | useMemo(() => studyAIContextSources(data, subjectId), [data, subjectId])<br>call<br>전달 콜백: H-f72c1dbc6067 |
| 24행 | 별도 조건식 없음 | useState('')<br>call |
| 25행 | 별도 조건식 없음 | useState([])<br>call |
| 26행 | 별도 조건식 없음 | useState(30)<br>call |
| 27행 | 별도 조건식 없음 | useState('')<br>call |
| 28행 | 별도 조건식 없음 | useState('')<br>call |
| 29행 | 별도 조건식 없음 | useState(false)<br>call |
| 30행 | 별도 조건식 없음 | useState(null)<br>call |
| 31행 | 별도 조건식 없음 | useDeferredValue(query)<br>call |
| 32행 | 별도 조건식 없음 | useMemo(() => { const needle = deferredQuery.trim().toLocaleLowerCase(); return sources.filter( (row) => !needle \|\| `${row.label}\n${row.text}`.toLocaleLowerCase().includes(needle), ); }, [sources, deferredQuery])<br>call<br>전달 콜백: H-c17c6db80034 |
| 38행 | 별도 조건식 없음 | selected.filter((key) => sources.some((row) => row.key === key))<br>call<br>전달 콜백: H-b56936eb238e |
| 87행 | interactive-when-falsy: disabled \|\| applying | filtered.slice(0, limit).map((row) => ( <article key={row.key}> <Checkbox label={row.label} checked={active.includes(row.key)} disabled={!active.includes(row.key) && active.length >= 20} onChange={(event) => setSelected( event.target.checked ? [...active, row.key] : active.filter((key) => key !== row.key), ) } /> <ContextPreview row={row} /> </article> ))<br>call<br>전달 콜백: H-9853c6f9db35 |
| 87행 | interactive-when-falsy: disabled \|\| applying | filtered.slice(0, limit)<br>call |
| 111행 | interactive-when-falsy: disabled \|\| applying | Math.min(limit, filtered.length)<br>call |

반환/조기 중단: 68행 <render> [별도 조건식 없음]

## H-f72c1dbc6067

**@callback:useMemo** · [src/ui/study-ai-context-picker.tsx:23](../../../src/ui/study-ai-context-picker.tsx#L23)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 23행 | 별도 조건식 없음 | studyAIContextSources(data, subjectId)<br>call |

## H-c17c6db80034

**@callback:useMemo** · [src/ui/study-ai-context-picker.tsx:32](../../../src/ui/study-ai-context-picker.tsx#L32)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 33행 | 별도 조건식 없음 | deferredQuery.trim().toLocaleLowerCase()<br>call |
| 33행 | 별도 조건식 없음 | deferredQuery.trim()<br>call |
| 34행 | 별도 조건식 없음 | sources.filter((row) => !needle \|\| `${row.label}\n${row.text}`.toLocaleLowerCase().includes(needle))<br>call<br>전달 콜백: H-8d5c6bf74282 |

반환/조기 중단: 34행 sources.filter( (row) => !needle || `${row.label}\n${row.text}`.toLocaleLowerCase().includes(needle), ) [별도 조건식 없음]

## H-8d5c6bf74282

**@callback:sources.filter** · [src/ui/study-ai-context-picker.tsx:35](../../../src/ui/study-ai-context-picker.tsx#L35)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 35행 | falsy: !needle | `${row.label}\n${row.text}`.toLocaleLowerCase().includes(needle)<br>call |
| 35행 | falsy: !needle | `${row.label}\n${row.text}`.toLocaleLowerCase()<br>call |

## H-b56936eb238e

**@callback:selected.filter** · [src/ui/study-ai-context-picker.tsx:38](../../../src/ui/study-ai-context-picker.tsx#L38)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 38행 | 별도 조건식 없음 | sources.some((row) => row.key === key)<br>call<br>전달 콜백: H-3a0221f2a4f0 |

## H-3a0221f2a4f0

**@callback:sources.some** · [src/ui/study-ai-context-picker.tsx:38](../../../src/ui/study-ai-context-picker.tsx#L38)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f14aa7f45460

**apply** · [src/ui/study-ai-context-picker.tsx:39](../../../src/ui/study-ai-context-picker.tsx#L39) · async

분기 조건과 가능한 갈림길:

- B-84dedf41eadb · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (43행).
- B-18aac8cb32bb · IfStatement · restore && (!undo || text !== undo.after) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (44행).
- B-8f7938e44a3f · ConditionalExpression · restore → truthy / falsy; 바깥 조건: 별도 조건식 없음 (48행).
- B-7347a3d29986 · IfStatement · !restore → truthy / falsy; 바깥 조건: 별도 조건식 없음 (49행).
- B-0c2f20c223a7 · IfStatement · restore → truthy / falsy; 바깥 조건: 별도 조건식 없음 (51행).
- B-53f6cd9bf6e2 · IfStatement · !restore → truthy / falsy; 바깥 조건: 별도 조건식 없음 (52행).
- B-d96a7149971f · ConditionalExpression · restore → truthy / falsy; 바깥 조건: 별도 조건식 없음 (54행).
- B-bcb49555275b · CatchClause · cause → exception; 바깥 조건: 별도 조건식 없음 (58행).
- B-24c62ce9f6ba · ConditionalExpression · cause instanceof Error → truthy / falsy; 바깥 조건: exception: cause (60행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 40행 | 별도 조건식 없음 | setError('')<br>state-update |
| 41행 | 별도 조건식 없음 | setNotice('')<br>state-update |
| 42행 | 별도 조건식 없음 | setApplying(true)<br>state-update |
| 45행 | truthy: restore && (!undo \|\| text !== undo.after) | Error('가져온 뒤 필기를 수정했습니다. 현재 편집을 보존했으니 필기에서 필요한 부분만 수정해 주세요.')<br>call |
| 48행 | falsy: restore | appendStudyAIContext(text, sources, active)<br>call |
| 49행 | truthy: !restore | setUndo({ before: text, after: next })<br>state-update |
| 50행 | 별도 조건식 없음 | onApply(next)<br>call |
| 51행 | truthy: restore | setUndo(null)<br>state-update |
| 52행 | truthy: !restore | setSelected([])<br>state-update |
| 53행 | 별도 조건식 없음 | setNotice(restore ? '가져오기 전 필기로 돌아왔습니다.' : '선택한 기록을 필기에 추가했습니다. GPT 생성은 직접 시작해 주세요.')<br>state-update |
| 59행 | exception: cause | setError(cause instanceof Error ? cause.message : '기록을 가져오지 못했습니다. 기존 내용은 유지했습니다.')<br>state-update |
| 65행 | always-after-try: try 완료 또는 예외 이후 | setApplying(false)<br>state-update |

throw: 45행 Error( '가져온 뒤 필기를 수정했습니다. 현재 편집을 보존했으니 필기에서 필요한 부분만 수정해 주세요.', )

## H-1c32aadc55d6

**@onChange** · [src/ui/study-ai-context-picker.tsx:79](../../../src/ui/study-ai-context-picker.tsx#L79)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 80행 | interactive-when-falsy: disabled \|\| applying | setQuery(event.target.value)<br>state-update |
| 81행 | interactive-when-falsy: disabled \|\| applying | setLimit(30)<br>state-update |

## H-9853c6f9db35

**@callback:filtered.slice(0, limit).map** · [src/ui/study-ai-context-picker.tsx:87](../../../src/ui/study-ai-context-picker.tsx#L87)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 91행 | interactive-when-falsy: disabled \|\| applying | active.includes(row.key)<br>call |
| 92행 | interactive-when-falsy: disabled \|\| applying | active.includes(row.key)<br>call |

## H-315d33264111

**@onChange** · [src/ui/study-ai-context-picker.tsx:93](../../../src/ui/study-ai-context-picker.tsx#L93)

분기 조건과 가능한 갈림길:

- B-362c308b3362 · ConditionalExpression · event.target.checked → truthy / falsy; 바깥 조건: interactive-when-falsy: disabled || applying (95행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 94행 | interactive-when-falsy: disabled \|\| applying | setSelected(event.target.checked ? [...active, row.key] : active.filter((key) => key !== row.key))<br>state-update |
| 97행 | interactive-when-falsy: disabled \|\| applying ∧ falsy: event.target.checked | active.filter((key) => key !== row.key)<br>call<br>전달 콜백: H-1ffc0de169b7 |

## H-1ffc0de169b7

**@callback:active.filter** · [src/ui/study-ai-context-picker.tsx:97](../../../src/ui/study-ai-context-picker.tsx#L97)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-04c29477894b

**@onClick** · [src/ui/study-ai-context-picker.tsx:106](../../../src/ui/study-ai-context-picker.tsx#L106)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 106행 | interactive-when-falsy: disabled \|\| applying ∧ truthy: filtered.length > limit | setLimit(limit + 30)<br>state-update |

## H-d6f4dc5fda70

**@onClick** · [src/ui/study-ai-context-picker.tsx:114](../../../src/ui/study-ai-context-picker.tsx#L114)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 114행 | interactive-when-falsy: disabled \|\| applying | apply()<br>call → [H-f14aa7f45460](ui__study-ai-context-picker.md#h-f14aa7f45460) |

## H-aed84775166b

**@onClick** · [src/ui/study-ai-context-picker.tsx:117](../../../src/ui/study-ai-context-picker.tsx#L117)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 117행 | interactive-when-falsy: disabled \|\| applying | setSelected([])<br>state-update |

## H-22be6a327cf0

**@onClick** · [src/ui/study-ai-context-picker.tsx:121](../../../src/ui/study-ai-context-picker.tsx#L121)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 121행 | interactive-when-falsy: disabled \|\| applying ∧ truthy: undo | apply(true)<br>call → [H-f14aa7f45460](ui__study-ai-context-picker.md#h-f14aa7f45460) |

## H-70fb6f084bfb

**ContextPreview** · [src/ui/study-ai-context-picker.tsx:133](../../../src/ui/study-ai-context-picker.tsx#L133)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 134행 | 별도 조건식 없음 | useState(false)<br>call |

반환/조기 중단: 135행 <render> [별도 조건식 없음]

## H-cfaff3e3163d

**@onToggle** · [src/ui/study-ai-context-picker.tsx:136](../../../src/ui/study-ai-context-picker.tsx#L136)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 136행 | 별도 조건식 없음 | setOpen(event.currentTarget.open)<br>state-update |

