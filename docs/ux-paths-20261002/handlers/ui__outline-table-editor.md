# src/ui/outline-table-editor.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-42da0112dcee

**topic** · [src/ui/outline-table-editor.tsx:18](../../../src/ui/outline-table-editor.tsx#L18)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 18행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |

## H-318465ac8646

**unit** · [src/ui/outline-table-editor.tsx:19](../../../src/ui/outline-table-editor.tsx#L19)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 19행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 19행 | 별도 조건식 없음 | topic()<br>call → [H-42da0112dcee](ui__outline-table-editor.md#h-42da0112dcee) |

## H-4cb0ef04f66a

**course** · [src/ui/outline-table-editor.tsx:20](../../../src/ui/outline-table-editor.tsx#L20)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 20행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 20행 | 별도 조건식 없음 | unit()<br>call → [H-318465ac8646](ui__outline-table-editor.md#h-318465ac8646) |

## H-5429a84bc93f

**blank** · [src/ui/outline-table-editor.tsx:21](../../../src/ui/outline-table-editor.tsx#L21)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 21행 | 별도 조건식 없음 | course()<br>call → [H-4cb0ef04f66a](ui__outline-table-editor.md#h-4cb0ef04f66a) |

## H-e85e747b9a35

**rowCount** · [src/ui/outline-table-editor.tsx:22](../../../src/ui/outline-table-editor.tsx#L22)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 22행 | 별도 조건식 없음 | draft.courses.reduce((count, row) => count + row.units.reduce((total, item) => total + 1 + item.topics.length, 0), 0)<br>preservation-boundary<br>전달 콜백: H-3d2b9c286986 |

## H-3d2b9c286986

**@callback:draft.courses.reduce** · [src/ui/outline-table-editor.tsx:22](../../../src/ui/outline-table-editor.tsx#L22)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 22행 | 별도 조건식 없음 | row.units.reduce((total, item) => total + 1 + item.topics.length, 0)<br>call<br>전달 콜백: H-24f3be9f268d |

## H-24f3be9f268d

**@callback:row.units.reduce** · [src/ui/outline-table-editor.tsx:22](../../../src/ui/outline-table-editor.tsx#L22)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-0e1ba5ddf017

**outlineTableDraftKey** · [src/ui/outline-table-editor.tsx:23](../../../src/ui/outline-table-editor.tsx#L23)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 23행 | 별도 조건식 없음 | encodeURIComponent(data.userId)<br>call |

## H-2b90061f85cd

**readDraft** · [src/ui/outline-table-editor.tsx:25](../../../src/ui/outline-table-editor.tsx#L25)

분기 조건과 가능한 갈림길:

- B-329fea12c45c · IfStatement · !raw → truthy / falsy; 바깥 조건: 별도 조건식 없음 (27행).
- B-1ce78a13328b · IfStatement · !value || value.version !== 1 || !Array.isArray(value.courses) || value.courses.length > 500 || !Array.isArray(value.undo) || value.undo.length > 20 || !value.scope || !['semester', 'independent', 'unassigned'].includes(value.scope.kind) || value.scope.kind === 'semester' && typeof value.scope.semesterId !== 'string' || !value.choices || typeof value.choices !== 'object' || Array.isArray(value.choices) || Object.values(value.choices).some(choice => typeof choice !== 'string') || value.previewToken !== undefined && typeof value.previewToken !== 'string' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (33행).
- B-7ce2427b6c38 · IfStatement · !Array.isArray(path) || path.length < 1 || path.length > 3 || path.some(name => typeof name !== 'string') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (40행).
- B-b5f6b3fa8fcd · IfStatement · rowCount(value) > 500 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (42행).
- B-cfc5055b4494 · IfStatement · new Set(keys).size !== keys.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (44행).
- B-7379fdd9eecb · IfStatement · !removal || !['course', 'unit', 'topic'].includes(removal.kind) || !Number.isInteger(removal.index) || removal.index < 0 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (46행).
- B-eca8ad87dbb3 · IfStatement · removal.kind !== 'course' && typeof removal.parentKey !== 'string' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (47행).
- B-2993558fddd0 · IfStatement · removal.kind === 'course' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (48행).
- B-96e570932f81 · IfStatement · removal.kind === 'unit' → truthy / falsy; 바깥 조건: falsy: removal.kind === 'course' (48행).
- B-cff566bd578b · IfStatement · value.pending && (value.pending.type !== 'createOutlineTable' || value.pending.userId !== data.userId || value.pending.namespace !== data.namespace || typeof value.pending.opId !== 'string' || typeof value.pending.at !== 'string' || typeof value.pending.expectedToken !== 'string' || JSON.stringify([value.pending.scope, value.pending.courses, value.pending.choices]) !== JSON.stringify([value.scope, value.courses, value.choices])) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (50행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 26행 | 별도 조건식 없음 | readRescuedDraft(key)<br>preservation-boundary |
| 26행 | nullish: readRescuedDraft(key) | localStorage.getItem(key)<br>preservation-boundary |
| 28행 | 별도 조건식 없음 | JSON.parse(raw)<br>call |
| 33행 | falsy: !value \|\| value.version !== 1 | Array.isArray(value.courses)<br>call |
| 33행 | falsy: !value \|\| value.version !== 1 \|\| !Array.isArray(value.courses) \|\| value.courses.length > 500 | Array.isArray(value.undo)<br>call |
| 34행 | falsy: !value \|\| value.version !== 1 \|\| !Array.isArray(value.courses) \|\| value.courses.length > 500 \|\| !Array.isArray(value.undo) \|\| value.undo.length > 20<br>    \|\| !value.scope | ['semester', 'independent', 'unassigned'].includes(value.scope.kind)<br>call |
| 35행 | falsy: !value \|\| value.version !== 1 \|\| !Array.isArray(value.courses) \|\| value.courses.length > 500 \|\| !Array.isArray(value.undo) \|\| value.undo.length > 20<br>    \|\| !value.scope \|\| !['semester', 'independent', 'unassigned'].includes(value.scope.kind) \|\| value.scope.kind === 'semester' && typeof value.scope.semesterId !== 'string'<br>    \|\| !value.choices \|\| typeof value.choices !== 'object' | Array.isArray(value.choices)<br>call |
| 35행 | falsy: !value \|\| value.version !== 1 \|\| !Array.isArray(value.courses) \|\| value.courses.length > 500 \|\| !Array.isArray(value.undo) \|\| value.undo.length > 20<br>    \|\| !value.scope \|\| !['semester', 'independent', 'unassigned'].includes(value.scope.kind) \|\| value.scope.kind === 'semester' && typeof value.scope.semesterId !== 'string'<br>    \|\| !value.choices \|\| typeof value.choices !== 'object' \|\| Array.isArray(value.choices) | Object.values(value.choices).some(choice => typeof choice !== 'string')<br>call<br>전달 콜백: H-6c0539b0d3cd |
| 35행 | falsy: !value \|\| value.version !== 1 \|\| !Array.isArray(value.courses) \|\| value.courses.length > 500 \|\| !Array.isArray(value.undo) \|\| value.undo.length > 20<br>    \|\| !value.scope \|\| !['semester', 'independent', 'unassigned'].includes(value.scope.kind) \|\| value.scope.kind === 'semester' && typeof value.scope.semesterId !== 'string'<br>    \|\| !value.choices \|\| typeof value.choices !== 'object' \|\| Array.isArray(value.choices) | Object.values(value.choices)<br>call |
| 36행 | truthy: !value \|\| value.version !== 1 \|\| !Array.isArray(value.courses) \|\| value.courses.length > 500 \|\| !Array.isArray(value.undo) \|\| value.undo.length > 20<br>    \|\| !value.scope \|\| !['semester', 'independent', 'unassigned'].includes(value.scope.kind) \|\| value.scope.kind === 'semester' && typeof value.scope.semesterId !== 'string'<br>    \|\| !value.choices \|\| typeof value.choices !== 'object' \|\| Array.isArray(value.choices) \|\| Object.values(value.choices).some(choice => typeof choice !== 'string')<br>    \|\| value.previewToken !== undefined && typeof value.previewToken !== 'string' | bad()<br>call → [H-7797e091d036](ui__outline-table-editor.md#h-7797e091d036) |
| 37행 | 별도 조건식 없음 | value.courses.forEach(checkCourse)<br>call<br>전달 콜백: H-cf6df1ba6540 |
| 38행 | 별도 조건식 없음 | Object.keys(value.choices)<br>call |
| 39행 | 별도 조건식 없음 | JSON.parse(pathKey)<br>call |
| 40행 | 별도 조건식 없음 | Array.isArray(path)<br>call |
| 40행 | falsy: !Array.isArray(path) \|\| path.length < 1 \|\| path.length > 3 | path.some(name => typeof name !== 'string')<br>call<br>전달 콜백: H-07c30ff03785 |
| 40행 | truthy: !Array.isArray(path) \|\| path.length < 1 \|\| path.length > 3 \|\| path.some(name => typeof name !== 'string') | bad()<br>call → [H-7797e091d036](ui__outline-table-editor.md#h-7797e091d036) |
| 42행 | 별도 조건식 없음 | rowCount(value)<br>call → [H-e85e747b9a35](ui__outline-table-editor.md#h-e85e747b9a35) |
| 42행 | truthy: rowCount(value) > 500 | bad()<br>call → [H-7797e091d036](ui__outline-table-editor.md#h-7797e091d036) |
| 43행 | 별도 조건식 없음 | value.courses.flatMap(c => [c.key, ...c.units.flatMap(u => [u.key, ...u.topics.map(t => t.key)])])<br>call<br>전달 콜백: H-dae5b46961f3 |
| 44행 | truthy: new Set(keys).size !== keys.length | bad()<br>call → [H-7797e091d036](ui__outline-table-editor.md#h-7797e091d036) |
| 46행 | falsy: !removal | ['course', 'unit', 'topic'].includes(removal.kind)<br>call |
| 46행 | falsy: !removal \|\| !['course', 'unit', 'topic'].includes(removal.kind) | Number.isInteger(removal.index)<br>call |
| 46행 | truthy: !removal \|\| !['course', 'unit', 'topic'].includes(removal.kind) \|\| !Number.isInteger(removal.index) \|\| removal.index < 0 | bad()<br>call → [H-7797e091d036](ui__outline-table-editor.md#h-7797e091d036) |
| 47행 | truthy: removal.kind !== 'course' && typeof removal.parentKey !== 'string' | bad()<br>call → [H-7797e091d036](ui__outline-table-editor.md#h-7797e091d036) |
| 48행 | truthy: removal.kind === 'course' | checkCourse(removal.value)<br>call → [H-cf6df1ba6540](ui__outline-table-editor.md#h-cf6df1ba6540) |
| 48행 | falsy: removal.kind === 'course' ∧ truthy: removal.kind === 'unit' | checkUnit(removal.value)<br>call → [H-0c4b9f0aafc6](ui__outline-table-editor.md#h-0c4b9f0aafc6) |
| 48행 | falsy: removal.kind === 'course' ∧ falsy: removal.kind === 'unit' | cell(removal.value)<br>call → [H-19a954d0c555](ui__outline-table-editor.md#h-19a954d0c555) |
| 52행 | truthy: value.pending ∧ falsy: value.pending.type !== 'createOutlineTable' \|\| value.pending.userId !== data.userId \|\| value.pending.namespace !== data.namespace<br>    \|\| typeof value.pending.opId !== 'string' \|\| typeof value.pending.at !== 'string' \|\| typeof value.pending.expectedToken !== 'string' | JSON.stringify([value.pending.scope, value.pending.courses, value.pending.choices])<br>call |
| 52행 | truthy: value.pending ∧ falsy: value.pending.type !== 'createOutlineTable' \|\| value.pending.userId !== data.userId \|\| value.pending.namespace !== data.namespace<br>    \|\| typeof value.pending.opId !== 'string' \|\| typeof value.pending.at !== 'string' \|\| typeof value.pending.expectedToken !== 'string' | JSON.stringify([value.scope, value.courses, value.choices])<br>call |
| 52행 | truthy: value.pending && (value.pending.type !== 'createOutlineTable' \|\| value.pending.userId !== data.userId \|\| value.pending.namespace !== data.namespace<br>    \|\| typeof value.pending.opId !== 'string' \|\| typeof value.pending.at !== 'string' \|\| typeof value.pending.expectedToken !== 'string'<br>    \|\| JSON.stringify([value.pending.scope, value.pending.courses, value.pending.choices]) !== JSON.stringify([value.scope, value.courses, value.choices])) | bad()<br>call → [H-7797e091d036](ui__outline-table-editor.md#h-7797e091d036) |

반환/조기 중단: 27행 null [truthy: !raw]; 53행 value [별도 조건식 없음]

## H-7797e091d036

**bad** · [src/ui/outline-table-editor.tsx:29](../../../src/ui/outline-table-editor.tsx#L29)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 29행 | 별도 조건식 없음 | Error('표 초안의 형식을 확인하지 못했습니다. 원문을 덮어쓰지 않았습니다.')<br>call |

throw: 29행 Error('표 초안의 형식을 확인하지 못했습니다. 원문을 덮어쓰지 않았습니다.')

## H-19a954d0c555

**cell** · [src/ui/outline-table-editor.tsx:30](../../../src/ui/outline-table-editor.tsx#L30)

분기 조건과 가능한 갈림길:

- B-cfac89773827 · IfStatement · !row || typeof row.key !== 'string' || !row.key || typeof row.name !== 'string' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (30행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 30행 | truthy: !row \|\| typeof row.key !== 'string' \|\| !row.key \|\| typeof row.name !== 'string' | bad()<br>call → [H-7797e091d036](ui__outline-table-editor.md#h-7797e091d036) |

## H-0c4b9f0aafc6

**checkUnit** · [src/ui/outline-table-editor.tsx:31](../../../src/ui/outline-table-editor.tsx#L31)

분기 조건과 가능한 갈림길:

- B-ae9422362f13 · IfStatement · !Array.isArray(row.topics) || row.topics.length > 500 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (31행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 31행 | 별도 조건식 없음 | cell(row)<br>call → [H-19a954d0c555](ui__outline-table-editor.md#h-19a954d0c555) |
| 31행 | 별도 조건식 없음 | Array.isArray(row.topics)<br>call |
| 31행 | truthy: !Array.isArray(row.topics) \|\| row.topics.length > 500 | bad()<br>call → [H-7797e091d036](ui__outline-table-editor.md#h-7797e091d036) |
| 31행 | 별도 조건식 없음 | row.topics.forEach(cell)<br>call<br>전달 콜백: H-19a954d0c555 |

## H-cf6df1ba6540

**checkCourse** · [src/ui/outline-table-editor.tsx:32](../../../src/ui/outline-table-editor.tsx#L32)

분기 조건과 가능한 갈림길:

- B-490f8881231b · IfStatement · !Array.isArray(row.units) || row.units.length > 500 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (32행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 32행 | 별도 조건식 없음 | cell(row)<br>call → [H-19a954d0c555](ui__outline-table-editor.md#h-19a954d0c555) |
| 32행 | 별도 조건식 없음 | Array.isArray(row.units)<br>call |
| 32행 | truthy: !Array.isArray(row.units) \|\| row.units.length > 500 | bad()<br>call → [H-7797e091d036](ui__outline-table-editor.md#h-7797e091d036) |
| 32행 | 별도 조건식 없음 | row.units.forEach(checkUnit)<br>call<br>전달 콜백: H-0c4b9f0aafc6 |

## H-6c0539b0d3cd

**@callback:Object.values(value.choices).some** · [src/ui/outline-table-editor.tsx:35](../../../src/ui/outline-table-editor.tsx#L35)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-07c30ff03785

**@callback:path.some** · [src/ui/outline-table-editor.tsx:40](../../../src/ui/outline-table-editor.tsx#L40)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-dae5b46961f3

**@callback:value.courses.flatMap** · [src/ui/outline-table-editor.tsx:43](../../../src/ui/outline-table-editor.tsx#L43)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 43행 | 별도 조건식 없음 | c.units.flatMap(u => [u.key, ...u.topics.map(t => t.key)])<br>call<br>전달 콜백: H-bb0c1de06fd6 |

## H-bb0c1de06fd6

**@callback:c.units.flatMap** · [src/ui/outline-table-editor.tsx:43](../../../src/ui/outline-table-editor.tsx#L43)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 43행 | 별도 조건식 없음 | u.topics.map(t => t.key)<br>call<br>전달 콜백: H-69393d55afe3 |

## H-69393d55afe3

**@callback:u.topics.map** · [src/ui/outline-table-editor.tsx:43](../../../src/ui/outline-table-editor.tsx#L43)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-965df44ec2cc

**OutlineTableEditor** · [src/ui/outline-table-editor.tsx:61](../../../src/ui/outline-table-editor.tsx#L61)


반환/조기 중단: 62행 <render> [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1173287022e6

**TableEditor** · [src/ui/outline-table-editor.tsx:64](../../../src/ui/outline-table-editor.tsx#L64)

분기 조건과 가능한 갈림길:

- B-3486c6d630c7 · ConditionalExpression · boot.error → truthy / falsy; 바깥 조건: 별도 조건식 없음 (68행).
- B-9f56ae0cfff2 · ConditionalExpression · draftHasUnstoredText(key) → truthy / falsy; 바깥 조건: falsy: boot.error (68행).
- B-d15d51806757 · IfStatement · draft → truthy / falsy; 바깥 조건: 별도 조건식 없음 (86행).
- B-c7febf4345df · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: draft (86행).
- B-6d7a5ab1cb8b · CatchClause · reason → exception; 바깥 조건: truthy: draft (86행).
- B-d7a5344c53e7 · ConditionalExpression · reason instanceof Error → truthy / falsy; 바깥 조건: truthy: draft ∧ exception: reason (86행).
- B-44a0bd857364 · ConditionalExpression · draft → truthy / falsy; 바깥 조건: 별도 조건식 없음 (146행).
- B-15f9587aa7d9 · ConditionalExpression · draft.scope.kind === 'semester' → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: draft && !blocked (154행).
- B-83e5794ff8bd · ConditionalExpression · alreadyApplied → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: draft && !blocked ∧ truthy: draft.pending (182행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 65행 | 별도 조건식 없음 | outlineTableDraftKey(data)<br>preservation-boundary → [H-0e1ba5ddf017](ui__outline-table-editor.md#h-0e1ba5ddf017) |
| 66행 | 별도 조건식 없음 | useState(() => { try { return { draft: readDraft(key, data), error: '' }; } catch { return { draft: null, error: '표 초안을 읽지 못했습니다.' }; } })<br>call<br>전달 콜백: H-6673ff117c2e |
| 67행 | 별도 조건식 없음 | useState(boot.draft)<br>call |
| 67행 | 별도 조건식 없음 | useState(false)<br>call |
| 67행 | 별도 조건식 없음 | useState(Boolean(boot.error))<br>call |
| 67행 | 별도 조건식 없음 | Boolean(boot.error)<br>call |
| 68행 | 별도 조건식 없음 | useState(boot.error ? '표 초안을 읽지 못했습니다. 원문을 덮어쓰지 않았습니다.' : draftHasUnstoredText(key) ? '초안 저장에 실패한 입력을 이 창에서 유지합니다. 창을 닫기 전에 저장을 다시 시도해 주세요.' : '')<br>call |
| 68행 | falsy: boot.error | draftHasUnstoredText(key)<br>preservation-boundary |
| 69행 | 별도 조건식 없음 | useState('')<br>call |
| 69행 | 별도 조건식 없음 | useState(null)<br>call |
| 70행 | 별도 조건식 없음 | useRef(new Map<string, HTMLInputElement>())<br>call |
| 70행 | 별도 조건식 없음 | useRef(null)<br>call |
| 70행 | 별도 조건식 없음 | useRef(false)<br>call |
| 71행 | 별도 조건식 없음 | useRef(null)<br>call |
| 72행 | 별도 조건식 없음 | useModalEditingContext(open, key, modalAnchor, fields)<br>call |
| 74행 | 별도 조건식 없음 | useLayoutEffect(() => { if (focusNext.current) { fields.current.get(focusNext.current)?.focus(); focusNext.current = null; } }, [draft])<br>call<br>전달 콜백: H-05691ffff66c |
| 86행 | truthy: draft | previewOutlineTable(data, draft)<br>call |
| 92행 | 별도 조건식 없음 | Boolean(draft?.pending && data.appliedOps[draft.pending.opId] === canonical(draft.pending))<br>call |
| 92행 | truthy: draft?.pending | canonical(draft.pending)<br>call → [H-ede251c81759](ui__outline-table-editor.md#h-ede251c81759) |
| 93행 | 별도 조건식 없음 | Boolean(draft?.previewToken && draft.previewToken !== outlineTableToken(data))<br>call |
| 93행 | truthy: draft?.previewToken | outlineTableToken(data)<br>call |
| 94행 | 별도 조건식 없음 | Boolean(draft?.pending)<br>call |
| 155행 | truthy: open ∧ truthy: draft && !blocked | data.semesters.filter(row => !row.deletedAt).map(row => <option key={row.id} value={row.id}>{row.name}</option>)<br>mutation-request<br>전달 콜백: H-790e91dcbb5a |
| 155행 | truthy: open ∧ truthy: draft && !blocked | data.semesters.filter(row => !row.deletedAt)<br>call<br>전달 콜백: H-ef86b5834b60 |
| 157행 | truthy: open ∧ truthy: draft && !blocked | draft.courses.map((c, ci) => <section className="ui-card field-stack" key={c.key}> {field(c, `${ci + 1}번째 과목명`, value => edit(next => { next.courses[ci].name = value; }))} <details className="outline-row-menu"><summary aria-label={`${ci + 1}번째 과목 메뉴`}>···</summary><Button variant="quiet" disabled={locked} aria-label={`${ci + 1}번째 과목 삭제`} onClick={() => remove({ kind: 'course', index: ci, value: c }, next => { next.courses.splice(ci, 1); })}>과목 삭제</Button></details> <table className="outline-input-table"><thead><tr><th scope="col">단원</th><th scope="col">주제</th></tr></thead> {c.units.map((u, ui) => <tbody key={u.key}>{[...u.topics, null].map((t, ti) => <tr key={t?.key ?? 'add'}> {ti === 0 && <td rowSpan={u.topi … [전체 인수는 JSON·소스])<br>preservation-boundary<br>전달 콜백: H-280fd0645c07 |
| 168행 | truthy: open ∧ truthy: draft && !blocked ∧ falsy: locked \|\| draft.courses.length >= 500 | rowCount(draft)<br>call → [H-e85e747b9a35](ui__outline-table-editor.md#h-e85e747b9a35) |
| 169행 | truthy: open ∧ truthy: draft && !blocked | rowCount(draft)<br>call → [H-e85e747b9a35](ui__outline-table-editor.md#h-e85e747b9a35) |
| 171행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: plan && plan.entries.length > 0 | plan.entries.filter(row => row.kind === 'subject' && row.status === 'new')<br>call<br>전달 콜백: H-e723f18c7fc1 |
| 171행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: plan && plan.entries.length > 0 | plan.entries.filter(row => row.kind !== 'subject' && row.status === 'new')<br>call<br>전달 콜백: H-cf33f355b3b3 |
| 172행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: plan && plan.entries.length > 0 | plan.entries.filter(row => row.candidates.length > 0).map(row => <Select key={row.key} label={`${row.path.join(' → ')} 처리`} disabled={locked} value={draft.choices[row.key] ?? ''} onChange={event => { const choices = { ...draft.choices, [row.key]: event.target.value }; for (const choiceKey of Object.keys(choices)) { const path = JSON.parse(choiceKey) as string[]; if (path.length > row.path.length && row.path.every((name, index) => path[index] === name)) delete choices[choiceKey]; } persist({ ...draft, choices, previewToken: undefined }); }}><option value="">기존 항목을 사용할지 고르세요</option><option value="new">같은 이름으로 새로 만들기</option>{row.candidates.map((candidate, index) => <option key={candidate.id} value={candidate.id}>기존 항목 사용 · {candidate.name}{row.candi … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-5e63bb45d0de |
| 172행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: plan && plan.entries.length > 0 | plan.entries.filter(row => row.candidates.length > 0)<br>call<br>전달 콜백: H-8de63c0375da |
| 177행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: plan && plan.entries.length > 0 | plan.entries.map(row => <li key={row.key}>{row.path.join(' → ')} · {row.status === 'new' ? '새로 생성' : row.status === 'reuse' ? '기존 항목 연결' : '선택 필요'}</li>)<br>call<br>전달 콜백: H-4613b248fc58 |

반환/조기 중단: 144행 <render> [별도 조건식 없음]

## H-6673ff117c2e

**@callback:useState** · [src/ui/outline-table-editor.tsx:66](../../../src/ui/outline-table-editor.tsx#L66)

분기 조건과 가능한 갈림길:

- B-74bad255c169 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (66행).
- B-a0236fa99132 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (66행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 66행 | 별도 조건식 없음 | readDraft(key, data)<br>preservation-boundary → [H-2b90061f85cd](ui__outline-table-editor.md#h-2b90061f85cd) |

반환/조기 중단: 66행 { draft: readDraft(key, data), error: '' } [별도 조건식 없음]; 66행 { draft: null, error: '표 초안을 읽지 못했습니다.' } [exception: exception]

## H-05691ffff66c

**@callback:useLayoutEffect** · [src/ui/outline-table-editor.tsx:74](../../../src/ui/outline-table-editor.tsx#L74)

분기 조건과 가능한 갈림길:

- B-fe9f85aff730 · IfStatement · focusNext.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (74행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 74행 | truthy: focusNext.current | fields.current.get(focusNext.current)<br>call |

## H-cd3843ec99a4

**persist** · [src/ui/outline-table-editor.tsx:75](../../../src/ui/outline-table-editor.tsx#L75)

분기 조건과 가능한 갈림길:

- B-99b08e8a2d2e · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (77행).
- B-867c33969566 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (78행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 76행 | 별도 조건식 없음 | setDraft(next)<br>state-update |
| 77행 | 별도 조건식 없음 | storeDraftSafely(key, JSON.stringify(next))<br>preservation-boundary |
| 77행 | 별도 조건식 없음 | JSON.stringify(next)<br>call |
| 77행 | 별도 조건식 없음 | setError('')<br>state-update |
| 78행 | exception: exception | setError('초안을 이 기기에 저장하지 못했습니다. 입력은 이 창에 남아 있습니다. 창을 닫기 전에 초안 저장을 다시 시도해 주세요.')<br>state-update |

반환/조기 중단: 77행 true [별도 조건식 없음]; 78행 false [exception: exception]

## H-2bd8ff60519f

**edit** · [src/ui/outline-table-editor.tsx:80](../../../src/ui/outline-table-editor.tsx#L80)

분기 조건과 가능한 갈림길:

- B-7f56e549c287 · IfStatement · !draft || draft.pending || blocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (81행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 82행 | 별도 조건식 없음 | structuredClone(draft)<br>call |
| 82행 | 별도 조건식 없음 | action(next)<br>call |
| 82행 | 별도 조건식 없음 | setMessage('')<br>state-update |
| 82행 | 별도 조건식 없음 | persist(next)<br>call → [H-cd3843ec99a4](ui__outline-table-editor.md#h-cd3843ec99a4) |

반환/조기 중단: 81행 <render> [truthy: !draft || draft.pending || blocked]

## H-e264cc9ff279

**launch** · [src/ui/outline-table-editor.tsx:84](../../../src/ui/outline-table-editor.tsx#L84)

분기 조건과 가능한 갈림길:

- B-032c9a4039fc · IfStatement · !draft && !blocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (84행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 84행 | truthy: !draft && !blocked | persist(blank(initialScope))<br>call → [H-cd3843ec99a4](ui__outline-table-editor.md#h-cd3843ec99a4) |
| 84행 | truthy: !draft && !blocked | blank(initialScope)<br>call → [H-5429a84bc93f](ui__outline-table-editor.md#h-5429a84bc93f) |
| 84행 | 별도 조건식 없음 | setOpen(true)<br>state-update |

## H-ede251c81759

**canonical** · [src/ui/outline-table-editor.tsx:87](../../../src/ui/outline-table-editor.tsx#L87)

분기 조건과 가능한 갈림길:

- B-2f2c74b62cff · IfStatement · Array.isArray(value) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (88행).
- B-821fc226b5f2 · IfStatement · value && typeof value === 'object' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (89행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 88행 | 별도 조건식 없음 | Array.isArray(value)<br>call |
| 88행 | truthy: Array.isArray(value) | value.map(canonical).join(',')<br>call |
| 88행 | truthy: Array.isArray(value) | value.map(canonical)<br>call<br>전달 콜백: H-ede251c81759 |
| 89행 | truthy: value && typeof value === 'object' | Object.entries(value).filter(([, entry]) => entry !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([name, entry]) => JSON.stringify(name) + ':' + canonical(entry)).join(',')<br>call |
| 89행 | truthy: value && typeof value === 'object' | Object.entries(value).filter(([, entry]) => entry !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([name, entry]) => JSON.stringify(name) + ':' + canonical(entry))<br>call<br>전달 콜백: H-e9bf6e403558 |
| 89행 | truthy: value && typeof value === 'object' | Object.entries(value).filter(([, entry]) => entry !== undefined).sort(([a], [b]) => a.localeCompare(b))<br>call<br>전달 콜백: H-fa2f9fb473ad |
| 89행 | truthy: value && typeof value === 'object' | Object.entries(value).filter(([, entry]) => entry !== undefined)<br>call<br>전달 콜백: H-b8f2b5d3c400 |
| 89행 | truthy: value && typeof value === 'object' | Object.entries(value)<br>call |
| 90행 | 별도 조건식 없음 | JSON.stringify(value)<br>call |

반환/조기 중단: 88행 '[' + value.map(canonical).join(',') + ']' [truthy: Array.isArray(value)]; 89행 '{' + Object.entries(value).filter(([, entry]) => entry !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([name, entry]) => JSON.stringify(name) + ':' + canonical(entry)).join(',') + '}' [truthy: value && typeof value === 'object']; 90행 JSON.stringify(value) [별도 조건식 없음]

## H-b8f2b5d3c400

**@callback:Object.entries(value).filter** · [src/ui/outline-table-editor.tsx:89](../../../src/ui/outline-table-editor.tsx#L89)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-fa2f9fb473ad

**@callback:Object.entries(value).filter(([, entry]) => entry !== undefined).sort** · [src/ui/outline-table-editor.tsx:89](../../../src/ui/outline-table-editor.tsx#L89)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 89행 | truthy: value && typeof value === 'object' | a.localeCompare(b)<br>call |

## H-e9bf6e403558

**@callback:Object.entries(value).filter(([, entry]) => entry !== undefined).sort(([a], [b]) => a.localeCompare(b)).map** · [src/ui/outline-table-editor.tsx:89](../../../src/ui/outline-table-editor.tsx#L89)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 89행 | truthy: value && typeof value === 'object' | JSON.stringify(name)<br>call |
| 89행 | truthy: value && typeof value === 'object' | canonical(entry)<br>call → [H-ede251c81759](ui__outline-table-editor.md#h-ede251c81759) |

## H-a56b69a5c265

**captureUndo** · [src/ui/outline-table-editor.tsx:95](../../../src/ui/outline-table-editor.tsx#L95)

분기 조건과 가능한 갈림길:

- B-549e6a38a888 · IfStatement · revision → truthy / falsy; 바깥 조건: 별도 조건식 없음 (97행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 96행 | 별도 조건식 없음 | result.revisions.find(row => row.operationId === opId)<br>call<br>전달 콜백: H-ddbefa729bc3 |
| 97행 | truthy: revision | setUndo({ revisionId: revision.id, expectedVersion: revision.after.version })<br>state-update |

## H-ddbefa729bc3

**@callback:result.revisions.find** · [src/ui/outline-table-editor.tsx:96](../../../src/ui/outline-table-editor.tsx#L96)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-949d369108f0

**finish** · [src/ui/outline-table-editor.tsx:99](../../../src/ui/outline-table-editor.tsx#L99)

분기 조건과 가능한 갈림길:

- B-b02672d8ab90 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (101행).
- B-116ae0bf22a9 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (102행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 100행 | 별도 조건식 없음 | captureUndo(result, opId)<br>call → [H-a56b69a5c265](ui__outline-table-editor.md#h-a56b69a5c265) |
| 100행 | 별도 조건식 없음 | setMessage('표의 항목을 생성했습니다. 과목 목록에서 확인할 수 있습니다.')<br>state-update |
| 101행 | 별도 조건식 없음 | clearStoredDraft(key)<br>preservation-boundary |
| 101행 | 별도 조건식 없음 | setDraft(null)<br>state-update |
| 101행 | 별도 조건식 없음 | setError('')<br>state-update |
| 101행 | 별도 조건식 없음 | setOpen(false)<br>state-update |
| 102행 | exception: exception | setError('항목은 생성했습니다. 이전 초안을 정리하지 못해 중복 생성을 막고 있습니다. 초안 정리를 다시 시도해 주세요.')<br>state-update |

## H-cc917cb619c0

**apply** · [src/ui/outline-table-editor.tsx:104](../../../src/ui/outline-table-editor.tsx#L104)

분기 조건과 가능한 갈림길:

- B-f8f48184947b · IfStatement · !draft || blocked || creating.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (105행).
- B-8bdd7f9c7a74 · IfStatement · alreadyApplied → truthy / falsy; 바깥 조건: 별도 조건식 없음 (106행).
- B-aca9bb82b019 · IfStatement · !draft.pending && (!plan?.ready || !plan.newCount || stale || !draft.previewToken) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (107행).
- B-b871350f013b · IfStatement · !persist({ ...draft, pending: command }) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (110행).
- B-44e888a5ee20 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (112행).
- B-b723f0288538 · IfStatement · result → truthy / falsy; 바깥 조건: 별도 조건식 없음 (114행).
- B-d69ac211cfcb · CatchClause · reason → exception; 바깥 조건: 별도 조건식 없음 (115행).
- B-6f49d64de568 · ConditionalExpression · reason instanceof Error → truthy / falsy; 바깥 조건: exception: reason (115행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 106행 | truthy: alreadyApplied | finish(data, draft.pending!.opId)<br>call → [H-949d369108f0](ui__outline-table-editor.md#h-949d369108f0) |
| 108행 | nullish: draft.pending | crypto.randomUUID()<br>call |
| 108행 | nullish: draft.pending | new Date().toISOString()<br>call |
| 108행 | nullish: draft.pending | Object.fromEntries(plan!.entries.filter(row => row.status === 'new').map(row => [row.key, crypto.randomUUID()]))<br>call |
| 108행 | nullish: draft.pending | plan!.entries.filter(row => row.status === 'new').map(row => [row.key, crypto.randomUUID()])<br>call<br>전달 콜백: H-be2b57d40918 |
| 108행 | nullish: draft.pending | plan!.entries.filter(row => row.status === 'new')<br>call<br>전달 콜백: H-d8af3b825166 |
| 110행 | 별도 조건식 없음 | persist({ ...draft, pending: command })<br>call → [H-cd3843ec99a4](ui__outline-table-editor.md#h-cd3843ec99a4) |
| 113행 | 별도 조건식 없음 | onApply(command)<br>call |
| 114행 | truthy: result | finish(result, command.opId)<br>call → [H-949d369108f0](ui__outline-table-editor.md#h-949d369108f0) |
| 114행 | falsy: result | setError('생성을 확인하지 못했습니다. 입력과 생성 요청을 보관했습니다. 저장을 다시 시도해 주세요.')<br>state-update |
| 115행 | exception: reason | setError(reason instanceof Error ? reason.message : '생성을 확인하지 못했습니다. 입력과 생성 요청을 보관했습니다.')<br>state-update |

반환/조기 중단: 105행 <render> [truthy: !draft || blocked || creating.current]; 106행 <render> [truthy: alreadyApplied]; 107행 <render> [truthy: !draft.pending && (!plan?.ready || !plan.newCount || stale || !draft.previewToken)]; 110행 <render> [truthy: !persist({ ...draft, pending: command })]

## H-d8af3b825166

**@callback:plan!.entries.filter** · [src/ui/outline-table-editor.tsx:108](../../../src/ui/outline-table-editor.tsx#L108)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-be2b57d40918

**@callback:plan!.entries.filter(row => row.status === 'new').map** · [src/ui/outline-table-editor.tsx:108](../../../src/ui/outline-table-editor.tsx#L108)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 108행 | nullish: draft.pending | crypto.randomUUID()<br>call |

## H-78b23b980429

**remove** · [src/ui/outline-table-editor.tsx:118](../../../src/ui/outline-table-editor.tsx#L118)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 118행 | 별도 조건식 없음 | edit(next => { action(next); next.undo = [...next.undo, removal].slice(-20); })<br>call → [H-2bd8ff60519f](ui__outline-table-editor.md#h-2bd8ff60519f)<br>전달 콜백: H-aa4d0853c266 |

## H-aa4d0853c266

**@callback:edit** · [src/ui/outline-table-editor.tsx:118](../../../src/ui/outline-table-editor.tsx#L118)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 118행 | 별도 조건식 없음 | action(next)<br>call |
| 118행 | 별도 조건식 없음 | [...next.undo, removal].slice(-20)<br>call |

## H-c3d6fc3f7e5d

**restore** · [src/ui/outline-table-editor.tsx:119](../../../src/ui/outline-table-editor.tsx#L119)

분기 조건과 가능한 갈림길:

- B-698324cbf1ff · IfStatement · !draft || locked || !draft.undo.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (120행).
- B-5fda73493a07 · IfStatement · item.kind === 'course' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (123행).
- B-79262dfbebc8 · IfStatement · item.kind === 'unit' → truthy / falsy; 바깥 조건: falsy: item.kind === 'course' (124행).
- B-7f18570a880b · IfStatement · !list || list.some(row => row.key === item.value.key) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (126행).
- B-721420413170 · IfStatement · rowCount(next) > 500 || next.courses.length > 500 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (128행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 121행 | 별도 조건식 없음 | structuredClone(draft)<br>call |
| 121행 | 별도 조건식 없음 | next.undo.at(-1)<br>call |
| 124행 | falsy: item.kind === 'course' ∧ truthy: item.kind === 'unit' | next.courses.find(c => c.key === item.parentKey)<br>call<br>전달 콜백: H-f4707ad8a51e |
| 125행 | falsy: item.kind === 'course' ∧ falsy: item.kind === 'unit' | next.courses.flatMap(c => c.units).find(u => u.key === item.parentKey)<br>call<br>전달 콜백: H-ace503503dd7 |
| 125행 | falsy: item.kind === 'course' ∧ falsy: item.kind === 'unit' | next.courses.flatMap(c => c.units)<br>call<br>전달 콜백: H-0193a3f7b2b7 |
| 126행 | falsy: !list | list.some(row => row.key === item.value.key)<br>call<br>전달 콜백: H-3c141bac3272 |
| 126행 | truthy: !list \|\| list.some(row => row.key === item.value.key) | setError('삭제한 입력의 상위 항목을 먼저 복원해 주세요. 다른 입력은 유지했습니다.')<br>state-update |
| 127행 | 별도 조건식 없음 | list.splice(Math.min(item.index, list.length), 0, item.value)<br>call |
| 127행 | 별도 조건식 없음 | Math.min(item.index, list.length)<br>call |
| 128행 | 별도 조건식 없음 | rowCount(next)<br>call → [H-e85e747b9a35](ui__outline-table-editor.md#h-e85e747b9a35) |
| 128행 | truthy: rowCount(next) > 500 \|\| next.courses.length > 500 | setError('복원하면 입력 한도를 넘습니다. 현재 입력을 보존했습니다.')<br>state-update |
| 129행 | 별도 조건식 없음 | next.undo.pop()<br>call |
| 129행 | 별도 조건식 없음 | persist(next)<br>call → [H-cd3843ec99a4](ui__outline-table-editor.md#h-cd3843ec99a4) |

반환/조기 중단: 120행 <render> [truthy: !draft || locked || !draft.undo.length]; 126행 <render> [truthy: !list || list.some(row => row.key === item.value.key)]; 128행 <render> [truthy: rowCount(next) > 500 || next.courses.length > 500]

## H-f4707ad8a51e

**@callback:next.courses.find** · [src/ui/outline-table-editor.tsx:124](../../../src/ui/outline-table-editor.tsx#L124)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-0193a3f7b2b7

**@callback:next.courses.flatMap** · [src/ui/outline-table-editor.tsx:125](../../../src/ui/outline-table-editor.tsx#L125)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ace503503dd7

**@callback:next.courses.flatMap(c => c.units).find** · [src/ui/outline-table-editor.tsx:125](../../../src/ui/outline-table-editor.tsx#L125)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3c141bac3272

**@callback:list.some** · [src/ui/outline-table-editor.tsx:126](../../../src/ui/outline-table-editor.tsx#L126)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a44209bafa7f

**addTopic** · [src/ui/outline-table-editor.tsx:131](../../../src/ui/outline-table-editor.tsx#L131)

분기 조건과 가능한 갈림길:

- B-4cf398a3c8b7 · IfStatement · !draft || rowCount(draft) >= 500 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (132행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 132행 | falsy: !draft | rowCount(draft)<br>call → [H-e85e747b9a35](ui__outline-table-editor.md#h-e85e747b9a35) |
| 133행 | 별도 조건식 없음 | topic()<br>call → [H-42da0112dcee](ui__outline-table-editor.md#h-42da0112dcee) |
| 134행 | 별도 조건식 없음 | edit(next => next.courses.find(c => c.key === courseKey)!.units.find(u => u.key === unitKey)!.topics.push(value))<br>call → [H-2bd8ff60519f](ui__outline-table-editor.md#h-2bd8ff60519f)<br>전달 콜백: H-141ad7edec2d |

반환/조기 중단: 132행 <render> [truthy: !draft || rowCount(draft) >= 500]

## H-141ad7edec2d

**@callback:edit** · [src/ui/outline-table-editor.tsx:134](../../../src/ui/outline-table-editor.tsx#L134)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 134행 | 별도 조건식 없음 | next.courses.find(c => c.key === courseKey)!.units.find(u => u.key === unitKey)!.topics.push(value)<br>call |
| 134행 | 별도 조건식 없음 | next.courses.find(c => c.key === courseKey)!.units.find(u => u.key === unitKey)<br>call<br>전달 콜백: H-cfc4290bea91 |
| 134행 | 별도 조건식 없음 | next.courses.find(c => c.key === courseKey)<br>call<br>전달 콜백: H-dd55cf8d381b |

## H-dd55cf8d381b

**@callback:next.courses.find** · [src/ui/outline-table-editor.tsx:134](../../../src/ui/outline-table-editor.tsx#L134)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-cfc4290bea91

**@callback:next.courses.find(c => c.key === courseKey)!.units.find** · [src/ui/outline-table-editor.tsx:134](../../../src/ui/outline-table-editor.tsx#L134)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a31511e9d9ac

**enter** · [src/ui/outline-table-editor.tsx:136](../../../src/ui/outline-table-editor.tsx#L136)

분기 조건과 가능한 갈림길:

- B-8a95f681ca91 · IfStatement · event.key !== 'Enter' || event.nativeEvent.isComposing || event.keyCode === 229 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (137행).
- B-de03455532e2 · IfStatement · lastTopic → truthy / falsy; 바깥 조건: 별도 조건식 없음 (139행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 138행 | 별도 조건식 없음 | event.preventDefault()<br>input-control |
| 139행 | truthy: lastTopic | addTopic(lastTopic.courseKey, lastTopic.unitKey)<br>call → [H-a44209bafa7f](ui__outline-table-editor.md#h-a44209bafa7f) |
| 141행 | 별도 조건식 없음 | fields.current.get(all[all.indexOf(rowKey) + 1])<br>call |
| 141행 | 별도 조건식 없음 | all.indexOf(rowKey)<br>call |

반환/조기 중단: 137행 <render> [truthy: event.key !== 'Enter' || event.nativeEvent.isComposing || event.keyCode === 229]; 139행 <render> [truthy: lastTopic]

## H-29f12295c0c7

**field** · [src/ui/outline-table-editor.tsx:143](../../../src/ui/outline-table-editor.tsx#L143)

분기 조건과 가능한 갈림길:

- B-da9b9c7d52e8 · ConditionalExpression · label.includes('주제') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (143행).
- B-e43578d14692 · ConditionalExpression · label.includes('단원') → truthy / falsy; 바깥 조건: falsy: label.includes('주제') (143행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 143행 | 별도 조건식 없음 | label.includes('주제')<br>call |
| 143행 | falsy: label.includes('주제') | label.includes('단원')<br>call |

## H-9aa3887fc406

**@onChange** · [src/ui/outline-table-editor.tsx:143](../../../src/ui/outline-table-editor.tsx#L143)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 143행 | 별도 조건식 없음 | onChange(event.target.value)<br>call |

## H-22c1a51e5bdd

**@onKeyDown** · [src/ui/outline-table-editor.tsx:143](../../../src/ui/outline-table-editor.tsx#L143)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 143행 | 별도 조건식 없음 | enter(event, row.key, lastTopic)<br>call → [H-a31511e9d9ac](ui__outline-table-editor.md#h-a31511e9d9ac) |

## H-f25e30ba6931

**@onClick** · [src/ui/outline-table-editor.tsx:147](../../../src/ui/outline-table-editor.tsx#L147)

분기 조건과 가능한 갈림길:

- B-4c85223e448f · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: undo && onUndo (147행).
- B-c233a87c1cdd · IfStatement · result → truthy / falsy; 바깥 조건: truthy: undo && onUndo (147행).
- B-9c0094cf0df6 · CatchClause · reason → exception; 바깥 조건: truthy: undo && onUndo (147행).
- B-1d2e5db287ff · ConditionalExpression · reason instanceof Error → truthy / falsy; 바깥 조건: truthy: undo && onUndo ∧ exception: reason (147행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 147행 | truthy: undo && onUndo | onUndo(undo.revisionId, undo.expectedVersion)<br>call |
| 147행 | truthy: undo && onUndo ∧ truthy: result | setUndo(null)<br>state-update |
| 147행 | truthy: undo && onUndo ∧ truthy: result | setMessage('표에서 생성한 항목을 되돌렸습니다.')<br>state-update |
| 147행 | truthy: undo && onUndo ∧ falsy: result | setError('그 뒤 연결되거나 수정한 내용이 있어 되돌리지 못했습니다. 현재 자료를 유지했습니다.')<br>state-update |
| 147행 | truthy: undo && onUndo ∧ exception: reason | setError(reason instanceof Error ? reason.message : '되돌리지 못했습니다. 현재 자료를 유지했습니다.')<br>state-update |

## H-9875b5d9d19a

**@onClose** · [src/ui/outline-table-editor.tsx:149](../../../src/ui/outline-table-editor.tsx#L149)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 149행 | truthy: open | setOpen(false)<br>state-update |

## H-522fd899ee11

**@onClick** · [src/ui/outline-table-editor.tsx:152](../../../src/ui/outline-table-editor.tsx#L152)

분기 조건과 가능한 갈림길:

- B-a6750e73eb4b · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: open ∧ truthy: blocked (152행).
- B-e344cd0b3166 · IfStatement · !restored → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: blocked (152행).
- B-5aee8ee1225d · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: open ∧ truthy: blocked (152행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 152행 | truthy: open ∧ truthy: blocked | readDraft(key, data)<br>preservation-boundary → [H-2b90061f85cd](ui__outline-table-editor.md#h-2b90061f85cd) |
| 152행 | truthy: open ∧ truthy: blocked | setBlocked(false)<br>state-update |
| 152행 | truthy: open ∧ truthy: blocked | setError('')<br>state-update |
| 152행 | truthy: open ∧ truthy: blocked | setDraft(restored)<br>state-update |
| 152행 | truthy: open ∧ truthy: blocked ∧ truthy: !restored | persist(blank(initialScope))<br>call → [H-cd3843ec99a4](ui__outline-table-editor.md#h-cd3843ec99a4) |
| 152행 | truthy: open ∧ truthy: blocked ∧ truthy: !restored | blank(initialScope)<br>call → [H-5429a84bc93f](ui__outline-table-editor.md#h-5429a84bc93f) |
| 152행 | truthy: open ∧ truthy: blocked ∧ exception: exception | setError('초안을 다시 읽지 못했습니다. 기존 원문을 유지했습니다.')<br>state-update |

## H-0e5110a0815d

**@onClick** · [src/ui/outline-table-editor.tsx:152](../../../src/ui/outline-table-editor.tsx#L152)

분기 조건과 가능한 갈림길:

- B-c17f18659df8 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: open ∧ truthy: blocked (152행).
- B-019813ebb849 · CatchClause · reason → exception; 바깥 조건: truthy: open ∧ truthy: blocked (152행).
- B-491852849c88 · ConditionalExpression · reason instanceof DraftArchiveError → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: blocked ∧ exception: reason (152행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 152행 | truthy: open ∧ truthy: blocked | archiveDamagedDraft(key)<br>preservation-boundary |
| 152행 | truthy: open ∧ truthy: blocked | setBlocked(false)<br>state-update |
| 152행 | truthy: open ∧ truthy: blocked | persist(blank(initialScope))<br>call → [H-cd3843ec99a4](ui__outline-table-editor.md#h-cd3843ec99a4) |
| 152행 | truthy: open ∧ truthy: blocked | blank(initialScope)<br>call → [H-5429a84bc93f](ui__outline-table-editor.md#h-5429a84bc93f) |
| 152행 | truthy: open ∧ truthy: blocked ∧ exception: reason | setError(reason instanceof DraftArchiveError ? reason.message : '원본 사본을 보관하지 못했습니다. 기존 원문을 유지했습니다.')<br>state-update |

## H-c3773006fb1c

**@onChange** · [src/ui/outline-table-editor.tsx:154](../../../src/ui/outline-table-editor.tsx#L154)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 154행 | truthy: open ∧ truthy: draft && !blocked | edit(next => { next.scope = ['independent', 'unassigned'].includes(event.target.value) ? { kind: event.target.value as 'independent' \| 'unassigned' } : { kind: 'semester', semesterId: event.target.value }; })<br>call → [H-2bd8ff60519f](ui__outline-table-editor.md#h-2bd8ff60519f)<br>전달 콜백: H-1d4c15a033f8 |

## H-1d4c15a033f8

**@callback:edit** · [src/ui/outline-table-editor.tsx:154](../../../src/ui/outline-table-editor.tsx#L154)

분기 조건과 가능한 갈림길:

- B-92dc06a683a9 · ConditionalExpression · ['independent', 'unassigned'].includes(event.target.value) → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: draft && !blocked (154행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 154행 | truthy: open ∧ truthy: draft && !blocked | ['independent', 'unassigned'].includes(event.target.value)<br>call |

## H-ef86b5834b60

**@callback:data.semesters.filter** · [src/ui/outline-table-editor.tsx:155](../../../src/ui/outline-table-editor.tsx#L155)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-790e91dcbb5a

**@callback:data.semesters.filter(row => !row.deletedAt).map** · [src/ui/outline-table-editor.tsx:155](../../../src/ui/outline-table-editor.tsx#L155)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-280fd0645c07

**@callback:draft.courses.map** · [src/ui/outline-table-editor.tsx:157](../../../src/ui/outline-table-editor.tsx#L157)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 158행 | truthy: open ∧ truthy: draft && !blocked | field(c, `${ci + 1}번째 과목명`, value => edit(next => { next.courses[ci].name = value; }))<br>call → [H-29f12295c0c7](ui__outline-table-editor.md#h-29f12295c0c7)<br>전달 콜백: H-6592cb6caa86 |
| 161행 | truthy: open ∧ truthy: draft && !blocked | c.units.map((u, ui) => <tbody key={u.key}>{[...u.topics, null].map((t, ti) => <tr key={t?.key ?? 'add'}> {ti === 0 && <td rowSpan={u.topics.length + 1}>{field(u, `${ci + 1}번째 과목 ${ui + 1}번째 단원`, value => edit(next => { next.courses[ci].units[ui].name = value; }))}<details className="outline-row-menu"><summary aria-label={`${ci + 1}번째 과목 ${ui + 1}번째 단원 메뉴`}>···</summary><Button variant="quiet" disabled={locked} aria-label={`${ci + 1}번째 과목 ${ui + 1}번째 단원 삭제`} onClick={() => remove({ kind: 'unit', parentKey: c.key, index: ui, value: u }, next => { next.courses[ci].units.splice(ui, 1); })}>단원 삭제</Button></details></td>} <td>{t ? <>{field(t, `${ci + 1}번째 과목 ${ui + 1}번째 단원 ${ti + 1}번째 주제`, value => edit(next  … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-91c61502c186 |
| 166행 | truthy: open ∧ truthy: draft && !blocked ∧ falsy: locked | rowCount(draft)<br>call → [H-e85e747b9a35](ui__outline-table-editor.md#h-e85e747b9a35) |

## H-6592cb6caa86

**@callback:field** · [src/ui/outline-table-editor.tsx:158](../../../src/ui/outline-table-editor.tsx#L158)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 158행 | truthy: open ∧ truthy: draft && !blocked | edit(next => { next.courses[ci].name = value; })<br>call → [H-2bd8ff60519f](ui__outline-table-editor.md#h-2bd8ff60519f)<br>전달 콜백: H-11c6b5b526f6 |

## H-11c6b5b526f6

**@callback:edit** · [src/ui/outline-table-editor.tsx:158](../../../src/ui/outline-table-editor.tsx#L158)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1bb15a9ba281

**@onClick** · [src/ui/outline-table-editor.tsx:159](../../../src/ui/outline-table-editor.tsx#L159)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 159행 | truthy: open ∧ truthy: draft && !blocked | remove({ kind: 'course', index: ci, value: c }, next => { next.courses.splice(ci, 1); })<br>call → [H-78b23b980429](ui__outline-table-editor.md#h-78b23b980429)<br>전달 콜백: H-ce6c9bf60bcf |

## H-ce6c9bf60bcf

**@callback:remove** · [src/ui/outline-table-editor.tsx:159](../../../src/ui/outline-table-editor.tsx#L159)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 159행 | truthy: open ∧ truthy: draft && !blocked | next.courses.splice(ci, 1)<br>call |

## H-91c61502c186

**@callback:c.units.map** · [src/ui/outline-table-editor.tsx:161](../../../src/ui/outline-table-editor.tsx#L161)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 161행 | truthy: open ∧ truthy: draft && !blocked | [...u.topics, null].map((t, ti) => <tr key={t?.key ?? 'add'}> {ti === 0 && <td rowSpan={u.topics.length + 1}>{field(u, `${ci + 1}번째 과목 ${ui + 1}번째 단원`, value => edit(next => { next.courses[ci].units[ui].name = value; }))}<details className="outline-row-menu"><summary aria-label={`${ci + 1}번째 과목 ${ui + 1}번째 단원 메뉴`}>···</summary><Button variant="quiet" disabled={locked} aria-label={`${ci + 1}번째 과목 ${ui + 1}번째 단원 삭제`} onClick={() => remove({ kind: 'unit', parentKey: c.key, index: ui, value: u }, next => { next.courses[ci].units.splice(ui, 1); })}>단원 삭제</Button></details></td>} <td>{t ? <>{field(t, `${ci + 1}번째 과목 ${ui + 1}번째 단원 ${ti + 1}번째 주제`, value => edit(next => { next.courses[ci].units[ui].topics[ti].name = value … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-92de0b6476cf |

## H-92de0b6476cf

**@callback:[...u.topics, null].map** · [src/ui/outline-table-editor.tsx:161](../../../src/ui/outline-table-editor.tsx#L161)

분기 조건과 가능한 갈림길:

- B-9ed4cae3f9a7 · ConditionalExpression · t → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: draft && !blocked (163행).
- B-a5436922c950 · ConditionalExpression · ti === u.topics.length - 1 → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: draft && !blocked ∧ truthy: t (163행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 162행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: ti === 0 | field(u, `${ci + 1}번째 과목 ${ui + 1}번째 단원`, value => edit(next => { next.courses[ci].units[ui].name = value; }))<br>call → [H-29f12295c0c7](ui__outline-table-editor.md#h-29f12295c0c7)<br>전달 콜백: H-0dc039755684 |
| 163행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: t | field(t, `${ci + 1}번째 과목 ${ui + 1}번째 단원 ${ti + 1}번째 주제`, value => edit(next => { next.courses[ci].units[ui].topics[ti].name = value; }), ti === u.topics.length - 1 ? { courseKey: c.key, unitKey: u.key } : undefined)<br>call → [H-29f12295c0c7](ui__outline-table-editor.md#h-29f12295c0c7)<br>전달 콜백: H-c3c603557f2c |
| 163행 | truthy: open ∧ truthy: draft && !blocked ∧ falsy: t ∧ falsy: locked | rowCount(draft)<br>call → [H-e85e747b9a35](ui__outline-table-editor.md#h-e85e747b9a35) |

## H-0dc039755684

**@callback:field** · [src/ui/outline-table-editor.tsx:162](../../../src/ui/outline-table-editor.tsx#L162)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 162행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: ti === 0 | edit(next => { next.courses[ci].units[ui].name = value; })<br>call → [H-2bd8ff60519f](ui__outline-table-editor.md#h-2bd8ff60519f)<br>전달 콜백: H-2aec10048bd0 |

## H-2aec10048bd0

**@callback:edit** · [src/ui/outline-table-editor.tsx:162](../../../src/ui/outline-table-editor.tsx#L162)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-8666e0c0656a

**@onClick** · [src/ui/outline-table-editor.tsx:162](../../../src/ui/outline-table-editor.tsx#L162)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 162행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: ti === 0 | remove({ kind: 'unit', parentKey: c.key, index: ui, value: u }, next => { next.courses[ci].units.splice(ui, 1); })<br>call → [H-78b23b980429](ui__outline-table-editor.md#h-78b23b980429)<br>전달 콜백: H-f6f241a1155c |

## H-f6f241a1155c

**@callback:remove** · [src/ui/outline-table-editor.tsx:162](../../../src/ui/outline-table-editor.tsx#L162)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 162행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: ti === 0 | next.courses[ci].units.splice(ui, 1)<br>call |

## H-c3c603557f2c

**@callback:field** · [src/ui/outline-table-editor.tsx:163](../../../src/ui/outline-table-editor.tsx#L163)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 163행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: t | edit(next => { next.courses[ci].units[ui].topics[ti].name = value; })<br>call → [H-2bd8ff60519f](ui__outline-table-editor.md#h-2bd8ff60519f)<br>전달 콜백: H-30a3e263775c |

## H-30a3e263775c

**@callback:edit** · [src/ui/outline-table-editor.tsx:163](../../../src/ui/outline-table-editor.tsx#L163)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-09b0a106e8e7

**@onClick** · [src/ui/outline-table-editor.tsx:163](../../../src/ui/outline-table-editor.tsx#L163)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 163행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: t | remove({ kind: 'topic', parentKey: u.key, index: ti, value: t }, next => { next.courses[ci].units[ui].topics.splice(ti, 1); })<br>call → [H-78b23b980429](ui__outline-table-editor.md#h-78b23b980429)<br>전달 콜백: H-879280714729 |

## H-879280714729

**@callback:remove** · [src/ui/outline-table-editor.tsx:163](../../../src/ui/outline-table-editor.tsx#L163)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 163행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: t | next.courses[ci].units[ui].topics.splice(ti, 1)<br>call |

## H-caac10004901

**@onClick** · [src/ui/outline-table-editor.tsx:163](../../../src/ui/outline-table-editor.tsx#L163)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 163행 | truthy: open ∧ truthy: draft && !blocked ∧ falsy: t | addTopic(c.key, u.key)<br>call → [H-a44209bafa7f](ui__outline-table-editor.md#h-a44209bafa7f) |

## H-a54123901b0a

**@onClick** · [src/ui/outline-table-editor.tsx:166](../../../src/ui/outline-table-editor.tsx#L166)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 166행 | truthy: open ∧ truthy: draft && !blocked | unit()<br>call → [H-318465ac8646](ui__outline-table-editor.md#h-318465ac8646) |
| 166행 | truthy: open ∧ truthy: draft && !blocked | edit(next => next.courses[ci].units.push(value))<br>call → [H-2bd8ff60519f](ui__outline-table-editor.md#h-2bd8ff60519f)<br>전달 콜백: H-d010e9f9a6f4 |

## H-d010e9f9a6f4

**@callback:edit** · [src/ui/outline-table-editor.tsx:166](../../../src/ui/outline-table-editor.tsx#L166)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 166행 | truthy: open ∧ truthy: draft && !blocked | next.courses[ci].units.push(value)<br>call |

## H-f444de32fc3e

**@onClick** · [src/ui/outline-table-editor.tsx:168](../../../src/ui/outline-table-editor.tsx#L168)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 168행 | truthy: open ∧ truthy: draft && !blocked | course()<br>call → [H-4cb0ef04f66a](ui__outline-table-editor.md#h-4cb0ef04f66a) |
| 168행 | truthy: open ∧ truthy: draft && !blocked | edit(next => next.courses.push(value))<br>call → [H-2bd8ff60519f](ui__outline-table-editor.md#h-2bd8ff60519f)<br>전달 콜백: H-733b7460bbe0 |

## H-733b7460bbe0

**@callback:edit** · [src/ui/outline-table-editor.tsx:168](../../../src/ui/outline-table-editor.tsx#L168)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 168행 | truthy: open ∧ truthy: draft && !blocked | next.courses.push(value)<br>call |

## H-e723f18c7fc1

**@callback:plan.entries.filter** · [src/ui/outline-table-editor.tsx:171](../../../src/ui/outline-table-editor.tsx#L171)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-cf33f355b3b3

**@callback:plan.entries.filter** · [src/ui/outline-table-editor.tsx:171](../../../src/ui/outline-table-editor.tsx#L171)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-8de63c0375da

**@callback:plan.entries.filter** · [src/ui/outline-table-editor.tsx:172](../../../src/ui/outline-table-editor.tsx#L172)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-5e63bb45d0de

**@callback:plan.entries.filter(row => row.candidates.length > 0).map** · [src/ui/outline-table-editor.tsx:172](../../../src/ui/outline-table-editor.tsx#L172)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 172행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: plan && plan.entries.length > 0 | row.path.join(' → ')<br>call |
| 176행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: plan && plan.entries.length > 0 | row.candidates.map((candidate, index) => <option key={candidate.id} value={candidate.id}>기존 항목 사용 · {candidate.name}{row.candidates.length > 1 ? ` · ${index + 1}번째(현재 목록 순서)` : ''}</option>)<br>call<br>전달 콜백: H-b84aa03b2080 |

## H-fd6a800af765

**@onChange** · [src/ui/outline-table-editor.tsx:172](../../../src/ui/outline-table-editor.tsx#L172)

분기 조건과 가능한 갈림길:

- B-1956fe14c86f · IfStatement · path.length > row.path.length && row.path.every((name, index) => path[index] === name) → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: draft && !blocked ∧ truthy: plan && plan.entries.length > 0 (174행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 174행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: plan && plan.entries.length > 0 | Object.keys(choices)<br>call |
| 174행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: plan && plan.entries.length > 0 | JSON.parse(choiceKey)<br>call |
| 174행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: plan && plan.entries.length > 0 ∧ truthy: path.length > row.path.length | row.path.every((name, index) => path[index] === name)<br>call<br>전달 콜백: H-485a2e301aa8 |
| 175행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: plan && plan.entries.length > 0 | persist({ ...draft, choices, previewToken: undefined })<br>call → [H-cd3843ec99a4](ui__outline-table-editor.md#h-cd3843ec99a4) |

## H-485a2e301aa8

**@callback:row.path.every** · [src/ui/outline-table-editor.tsx:174](../../../src/ui/outline-table-editor.tsx#L174)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b84aa03b2080

**@callback:row.candidates.map** · [src/ui/outline-table-editor.tsx:176](../../../src/ui/outline-table-editor.tsx#L176)

분기 조건과 가능한 갈림길:

- B-0c33d10afd8f · ConditionalExpression · row.candidates.length > 1 → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: draft && !blocked ∧ truthy: plan && plan.entries.length > 0 (176행).

## H-4613b248fc58

**@callback:plan.entries.map** · [src/ui/outline-table-editor.tsx:177](../../../src/ui/outline-table-editor.tsx#L177)

분기 조건과 가능한 갈림길:

- B-ab4f93399ea1 · ConditionalExpression · row.status === 'new' → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: draft && !blocked ∧ truthy: plan && plan.entries.length > 0 (177행).
- B-5659355d1ef6 · ConditionalExpression · row.status === 'reuse' → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: draft && !blocked ∧ truthy: plan && plan.entries.length > 0 ∧ falsy: row.status === 'new' (177행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 177행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: plan && plan.entries.length > 0 | row.path.join(' → ')<br>call |

## H-481c81b63d16

**@onClick** · [src/ui/outline-table-editor.tsx:179](../../../src/ui/outline-table-editor.tsx#L179)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 179행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: plan && plan.entries.length > 0 ∧ truthy: !draft.pending | persist({ ...draft, previewToken: outlineTableToken(data) })<br>call → [H-cd3843ec99a4](ui__outline-table-editor.md#h-cd3843ec99a4) |
| 179행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: plan && plan.entries.length > 0 ∧ truthy: !draft.pending | outlineTableToken(data)<br>call |

## H-dbe5755dea82

**@onClick** · [src/ui/outline-table-editor.tsx:183](../../../src/ui/outline-table-editor.tsx#L183)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 183행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: draft.pending && !alreadyApplied && stale | persist(next)<br>call → [H-cd3843ec99a4](ui__outline-table-editor.md#h-cd3843ec99a4) |

## H-c4156baf6082

**@onClick** · [src/ui/outline-table-editor.tsx:184](../../../src/ui/outline-table-editor.tsx#L184)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 184행 | truthy: open ∧ truthy: draft && !blocked ∧ truthy: error | persist(draft)<br>call → [H-cd3843ec99a4](ui__outline-table-editor.md#h-cd3843ec99a4) |

## H-4b5219cc2dc2

**@onClick** · [src/ui/outline-table-editor.tsx:186](../../../src/ui/outline-table-editor.tsx#L186)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 186행 | truthy: open | setOpen(false)<br>state-update |

