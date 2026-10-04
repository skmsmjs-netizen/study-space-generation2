# src/ui/code-practice.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-b9d2ce140437

**readableCodeOutput** · [src/ui/code-practice.tsx:56](../../../src/ui/code-practice.tsx#L56)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 57행 | 별도 조건식 없음 | text<br>    .replace(<br>      // biome-ignore lint/suspicious/noControlCharactersInRegex: ANSI protocol escape bytes are decoded only for display; stored terminal output is unchanged.<br>      /\x1b\][^\x07]*(?:\x07\|\x1b\\)/g, '')<br>    .replace(<br>      // biome-ignore lint/suspicious/noControlCharactersInRegex: ANSI protocol escape bytes are decoded only for display; stored terminal output is unchanged.<br>      /\x1b\[[0-?]*[ -/]*[@-~]/g, '')<br>    .replace(/\x1b[=><@-_]/g, '')<br>call |
| 57행 | 별도 조건식 없음 | text<br>    .replace(<br>      // biome-ignore lint/suspicious/noControlCharactersInRegex: ANSI protocol escape bytes are decoded only for display; stored terminal output is unchanged.<br>      /\x1b\][^\x07]*(?:\x07\|\x1b\\)/g, '')<br>    .replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, '')<br>call |
| 57행 | 별도 조건식 없음 | text<br>    .replace(/\x1b\][^\x07]*(?:\x07\|\x1b\\)/g, '')<br>call |

## H-708b49420657

**context** · [src/ui/code-practice.tsx:67](../../../src/ui/code-practice.tsx#L67)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 68행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 69행 | 별도 조건식 없음 | new Date().toISOString()<br>call |

## H-8dae215a929b

**errorMessage** · [src/ui/code-practice.tsx:73](../../../src/ui/code-practice.tsx#L73)

분기 조건과 가능한 갈림길:

- B-50a4e4ddc089 · ConditionalExpression · error instanceof Error → truthy / falsy; 바깥 조건: 별도 조건식 없음 (74행).

## H-0935c8baf1c2

**canSave** · [src/ui/code-practice.tsx:75](../../../src/ui/code-practice.tsx#L75)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-10ac7bf322d3

**CodePractice** · [src/ui/code-practice.tsx:78](../../../src/ui/code-practice.tsx#L78)

분기 조건과 가능한 갈림길:

- B-4b60d69ee4f7 · ConditionalExpression · trash → truthy / falsy; 바깥 조건: 별도 조건식 없음 (81행).
- B-c4e7f75f757a · ConditionalExpression · trash → truthy / falsy; 바깥 조건: 별도 조건식 없음 (82행).
- B-0122b4e6a46b · ConditionalExpression · trash → truthy / falsy; 바깥 조건: 별도 조건식 없음 (133행).
- B-b77d2168d36b · ConditionalExpression · trash → truthy / falsy; 바깥 조건: 별도 조건식 없음 (136행).
- B-237b02065cd8 · ConditionalExpression · selected && !trash → truthy / falsy; 바깥 조건: 별도 조건식 없음 (149행).
- B-f7e18c738cfc · ConditionalExpression · trash → truthy / falsy; 바깥 조건: falsy: selected && !trash ∧ truthy: !examples.length (186행).
- B-762213a82a33 · ConditionalExpression · trash → truthy / falsy; 바깥 조건: falsy: selected && !trash ∧ truthy: !examples.length (188행).
- B-fe3e05212750 · ConditionalExpression · query || languageFilter !== 'all' → truthy / falsy; 바깥 조건: falsy: selected && !trash ∧ truthy: examples.length > 0 (221행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 80행 | 별도 조건식 없음 | useState('')<br>call |
| 81행 | 별도 조건식 없음 | useViewContext(data, `code:${trash ? 'trash' : 'active'}:query`, '', isViewText)<br>call |
| 82행 | 별도 조건식 없음 | useViewContext(data, `code:${trash ? 'trash' : 'active'}:language`, 'all', (value): value is string => typeof value === 'string' && (value === 'all' \|\| Object.hasOwn(CODE_LANGUAGES, value)))<br>call<br>전달 콜백: H-2dfba8be79fc |
| 83행 | 별도 조건식 없음 | (data.codeExamples ?? [])<br>    .filter((row) => Boolean(row.deletedAt) === trash)<br>    .slice()<br>    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))<br>mutation-request<br>전달 콜백: H-32e092a2c961 |
| 83행 | 별도 조건식 없음 | (data.codeExamples ?? [])<br>    .filter((row) => Boolean(row.deletedAt) === trash)<br>    .slice()<br>mutation-request |
| 83행 | 별도 조건식 없음 | (data.codeExamples ?? [])<br>    .filter((row) => Boolean(row.deletedAt) === trash)<br>call<br>전달 콜백: H-cdd0cafab08d |
| 87행 | 별도 조건식 없음 | examples.find((row) => row.id === exampleId)<br>call<br>전달 콜백: H-a012efc0da98 |
| 88행 | 별도 조건식 없음 | examples.filter((row) => (languageFilter === 'all' \|\| row.language === languageFilter) && `${row.title}\n${row.notes}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()))<br>call<br>전달 콜백: H-9bb8c1f424f3 |
| 144행 | truthy: !trash | canSave(repository, data)<br>call → [H-0935c8baf1c2](ui__code-practice.md#h-0935c8baf1c2) |
| 212행 | falsy: selected && !trash ∧ truthy: examples.length > 0 | Object.entries(CODE_LANGUAGES).map(([id, name]) => ( <option key={id} value={id}> {name} </option> ))<br>call<br>전달 콜백: H-7c7d3ecf1ecf |
| 212행 | falsy: selected && !trash ∧ truthy: examples.length > 0 | Object.entries(CODE_LANGUAGES)<br>call |
| 229행 | falsy: selected && !trash | visibleExamples.map((row) => ( <li key={row.id}> <div> <a href={`#/code/${encodeURIComponent(row.id)}`}> {row.title \|\| '제목 없는 예제'} </a> <span className="muted">{CODE_LANGUAGES[row.language]}</span> </div> {row.notes && <p className="code-note-preview">{row.notes}</p>} {trash && ( <Button onClick={() => commit({ type: 'restoreCodeExample', id: row.id, expectedVersion: row.version, }) } > 예제 복원 </Button> )} </li> ))<br>call<br>전달 콜백: H-8fceb30c9c4b |

반환/조기 중단: 128행 <render> [별도 조건식 없음]

## H-301565868a19

**openExample** · [src/ui/code-practice.tsx:79](../../../src/ui/code-practice.tsx#L79)

분기 조건과 가능한 갈림길:

- B-faf7c3ac8eb0 · ConditionalExpression · onOpenExample → truthy / falsy; 바깥 조건: 별도 조건식 없음 (79행).
- B-d8fbd4be5a00 · ConditionalExpression · id → truthy / falsy; 바깥 조건: falsy: onOpenExample (79행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 79행 | truthy: onOpenExample | onOpenExample(id)<br>call |
| 79행 | falsy: onOpenExample | navigate(id ? `/code/${id}` : '/code')<br>navigation |

## H-2dfba8be79fc

**@callback:useViewContext** · [src/ui/code-practice.tsx:82](../../../src/ui/code-practice.tsx#L82)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 82행 | truthy: typeof value === 'string' ∧ falsy: value === 'all' | Object.hasOwn(CODE_LANGUAGES, value)<br>call |

## H-cdd0cafab08d

**@callback:(data.codeExamples ?? [])
    .filter** · [src/ui/code-practice.tsx:84](../../../src/ui/code-practice.tsx#L84)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 84행 | 별도 조건식 없음 | Boolean(row.deletedAt)<br>call |

## H-32e092a2c961

**@callback:(data.codeExamples ?? [])
    .filter((row) => Boolean(row.deletedAt) === trash)
    .slice()
    .sort** · [src/ui/code-practice.tsx:86](../../../src/ui/code-practice.tsx#L86)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 86행 | 별도 조건식 없음 | b.updatedAt.localeCompare(a.updatedAt)<br>call |

## H-a012efc0da98

**@callback:examples.find** · [src/ui/code-practice.tsx:87](../../../src/ui/code-practice.tsx#L87)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-9bb8c1f424f3

**@callback:examples.filter** · [src/ui/code-practice.tsx:89](../../../src/ui/code-practice.tsx#L89)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 91행 | truthy: languageFilter === 'all' \|\| row.language === languageFilter | `${row.title}\n${row.notes}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())<br>call |
| 91행 | truthy: languageFilter === 'all' \|\| row.language === languageFilter | `${row.title}\n${row.notes}`.toLocaleLowerCase()<br>call |
| 91행 | truthy: languageFilter === 'all' \|\| row.language === languageFilter | query.toLocaleLowerCase()<br>call |

## H-0b893d5e5764

**commit** · [src/ui/code-practice.tsx:93](../../../src/ui/code-practice.tsx#L93)

분기 조건과 가능한 갈림길:

- B-f76a5f50923c · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (102행).
- B-bd928cfd0d3d · IfStatement · !canSave(repository, data) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (103행).
- B-bdd859badf50 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (111행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 103행 | 별도 조건식 없음 | canSave(repository, data)<br>call → [H-0935c8baf1c2](ui__code-practice.md#h-0935c8baf1c2) |
| 104행 | truthy: !canSave(repository, data) | Error('코드 예제를 저장할 수 없습니다. 입력한 내용은 유지했습니다. 다시 접속한 뒤 저장해 주세요.')<br>call |
| 107행 | 별도 조건식 없음 | repository.execute({ ...action, ...context(data) })<br>call |
| 107행 | 별도 조건식 없음 | context(data)<br>call → [H-708b49420657](ui__code-practice.md#h-708b49420657) |
| 108행 | 별도 조건식 없음 | onSaved(next)<br>call |
| 109행 | 별도 조건식 없음 | setError('')<br>state-update |
| 112행 | exception: e | setError(errorMessage(e))<br>state-update |
| 112행 | exception: e | errorMessage(e)<br>call → [H-8dae215a929b](ui__code-practice.md#h-8dae215a929b) |

반환/조기 중단: 110행 next [별도 조건식 없음]; 113행 null [exception: e]

throw: 104행 Error( '코드 예제를 저장할 수 없습니다. 입력한 내용은 유지했습니다. 다시 접속한 뒤 저장해 주세요.', )

## H-452185069b84

**add** · [src/ui/code-practice.tsx:116](../../../src/ui/code-practice.tsx#L116)

분기 조건과 가능한 갈림길:

- B-37e03f75034e · IfStatement · commit({ type: 'saveCodeExample', id, expectedVersion: 0, content: { title: '', language: 'c', code: '', stdin: '', notes: '' }, }) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (118행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 117행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 119행 | 별도 조건식 없음 | commit({ type: 'saveCodeExample', id, expectedVersion: 0, content: { title: '', language: 'c', code: '', stdin: '', notes: '' }, })<br>mutation-request → [H-0b893d5e5764](ui__code-practice.md#h-0b893d5e5764) |
| 126행 | truthy: commit({<br>        type: 'saveCodeExample',<br>        id,<br>        expectedVersion: 0,<br>        content: { title: '', language: 'c', code: '', stdin: '', notes: '' },<br>      }) | openExample(id)<br>call → [H-301565868a19](ui__code-practice.md#h-301565868a19) |

## H-c2bb7468a781

**@onClickCapture** · [src/ui/code-practice.tsx:129](../../../src/ui/code-practice.tsx#L129)

분기 조건과 가능한 갈림길:

- B-78cee2706416 · IfStatement · !onOpenExample || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey → truthy / falsy; 바깥 조건: 별도 조건식 없음 (130행).
- B-7fea75c8e25c · ConditionalExpression · event.target instanceof Element → truthy / falsy; 바깥 조건: 별도 조건식 없음 (131행).
- B-fff3998c3f54 · IfStatement · href === '#/code' || href?.startsWith('#/code/') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (132행).
- B-522422710dd0 · ConditionalExpression · href === '#/code' → truthy / falsy; 바깥 조건: truthy: href === '#/code' || href?.startsWith('#/code/') (132행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 131행 | truthy: event.target instanceof Element | event.target.closest('a')<br>call |
| 132행 | truthy: href === '#/code' \|\| href?.startsWith('#/code/') | event.preventDefault()<br>input-control |
| 132행 | truthy: href === '#/code' \|\| href?.startsWith('#/code/') | openExample(href === '#/code' ? undefined : decodeURIComponent(href.slice('#/code/'.length)))<br>call → [H-301565868a19](ui__code-practice.md#h-301565868a19) |
| 132행 | truthy: href === '#/code' \|\| href?.startsWith('#/code/') ∧ falsy: href === '#/code' | decodeURIComponent(href.slice('#/code/'.length))<br>call |
| 132행 | truthy: href === '#/code' \|\| href?.startsWith('#/code/') ∧ falsy: href === '#/code' | href.slice('#/code/'.length)<br>call |

반환/조기 중단: 130행 <render> [truthy: !onOpenExample || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey]

## H-c3a04329a73f

**@onTrash** · [src/ui/code-practice.tsx:166](../../../src/ui/code-practice.tsx#L166)

분기 조건과 가능한 갈림길:

- B-401856963f12 · IfStatement · row && commit({ type: 'trashCodeExample', id: row.id, expectedVersion: row.version, }) → truthy / falsy; 바깥 조건: truthy: selected && !trash (170행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 167행 | truthy: selected && !trash | repository<br>                .getSnapshot()<br>call |
| 172행 | truthy: selected && !trash ∧ truthy: row | commit({ type: 'trashCodeExample', id: row.id, expectedVersion: row.version, })<br>mutation-request → [H-0b893d5e5764](ui__code-practice.md#h-0b893d5e5764) |
| 178행 | truthy: selected && !trash ∧ truthy: row &&<br>                commit({<br>                  type: 'trashCodeExample',<br>                  id: row.id,<br>                  expectedVersion: row.version,<br>                }) | openExample(undefined)<br>call → [H-301565868a19](ui__code-practice.md#h-301565868a19) |

## H-abc9bbd5262b

**@onChange** · [src/ui/code-practice.tsx:204](../../../src/ui/code-practice.tsx#L204)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 204행 | falsy: selected && !trash ∧ truthy: examples.length > 0 | setQuery(event.target.value)<br>state-update |

## H-b57e16b24710

**@onChange** · [src/ui/code-practice.tsx:209](../../../src/ui/code-practice.tsx#L209)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 209행 | falsy: selected && !trash ∧ truthy: examples.length > 0 | setLanguageFilter(event.target.value)<br>state-update |

## H-7c7d3ecf1ecf

**@callback:Object.entries(CODE_LANGUAGES).map** · [src/ui/code-practice.tsx:212](../../../src/ui/code-practice.tsx#L212)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-0e986568987d

**@onClick** · [src/ui/code-practice.tsx:224](../../../src/ui/code-practice.tsx#L224)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 224행 | falsy: selected && !trash ∧ truthy: examples.length > 0 ∧ truthy: visibleExamples.length === 0 | setQuery('')<br>state-update |
| 224행 | falsy: selected && !trash ∧ truthy: examples.length > 0 ∧ truthy: visibleExamples.length === 0 | setLanguageFilter('all')<br>state-update |

## H-8fceb30c9c4b

**@callback:visibleExamples.map** · [src/ui/code-practice.tsx:229](../../../src/ui/code-practice.tsx#L229)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 232행 | falsy: selected && !trash | encodeURIComponent(row.id)<br>call |

## H-92b0b3dafd4e

**@onClick** · [src/ui/code-practice.tsx:240](../../../src/ui/code-practice.tsx#L240)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 241행 | falsy: selected && !trash ∧ truthy: trash | commit({ type: 'restoreCodeExample', id: row.id, expectedVersion: row.version, })<br>mutation-request → [H-0b893d5e5764](ui__code-practice.md#h-0b893d5e5764) |

## H-e838a4a46ed6

**CodeExampleEditor** · [src/ui/code-practice.tsx:260](../../../src/ui/code-practice.tsx#L260)

분기 조건과 가능한 갈림길:

- B-6c82fe63a76f · ConditionalExpression · sameCodeContent(initial.content, example) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (308행).
- B-411e35a7eab3 · ConditionalExpression · terminalAvailable → truthy / falsy; 바깥 조건: nullish: content.inputMode (319행).
- B-c952ca561bc6 · ConditionalExpression · interactive → truthy / falsy; 바깥 조건: 별도 조건식 없음 (620행).
- B-d0484de4fc98 · ConditionalExpression · interactive → truthy / falsy; 바깥 조건: 별도 조건식 없음 (654행).
- B-1c813768701d · ConditionalExpression · phase === 'loading' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (673행).
- B-66682e2b1888 · ConditionalExpression · phase === 'running' → truthy / falsy; 바깥 조건: falsy: phase === 'loading' (673행).
- B-706add9d14e4 · ConditionalExpression · !interactive && repository.getCodeRunner?.() && ['c', 'cpp', 'csharp'].includes(content.language) → truthy / falsy; 바깥 조건: truthy: phase !== 'idle' (677행).
- B-1ccbe5574928 · ConditionalExpression · phase === 'loading' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (685행).
- B-24ebbf55d7b3 · ConditionalExpression · ['c', 'cpp', 'csharp'].includes(content.language) → truthy / falsy; 바깥 조건: truthy: phase === 'loading' (686행).
- B-81e90dff773a · ConditionalExpression · phase === 'running' → truthy / falsy; 바깥 조건: falsy: phase === 'loading' (689행).
- B-926f55dda67b · ConditionalExpression · interactive → truthy / falsy; 바깥 조건: falsy: phase === 'loading' ∧ truthy: phase === 'running' (690행).
- B-da46fb6b9d52 · ConditionalExpression · lastRun → truthy / falsy; 바깥 조건: falsy: phase === 'loading' ∧ falsy: phase === 'running' (693행).
- B-b0a37e9f089d · ConditionalExpression · lastRun → truthy / falsy; 바깥 조건: 별도 조건식 없음 (803행).
- B-3d2815f529b7 · ConditionalExpression · lastRun.outcome === 'success' → truthy / falsy; 바깥 조건: truthy: lastRun ∧ falsy: readableCodeOutput(lastRun.output) (805행).
- B-05bcc76a68ef · ConditionalExpression · isBlocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (857행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 277행 | 별도 조건식 없음 | codeDraftKey(data, example.id)<br>preservation-boundary |
| 278행 | 별도 조건식 없음 | useState(() => { try { const draft = readCodeDraft(key, example.id); const conflict = draft && draft.baseVersion !== example.version && !sameCodeContent(draft.content, example) ? draft : null; return { content: codeContent(conflict ? example : (draft?.content ?? example)), conflict, error: '', blocked: Boolean(conflict), }; } catch (e) { return { content: codeContent(example), conflict: null as CodeExampleDraft \| null, error: errorMessage(e), blocked: true, }; } })<br>call<br>전달 콜백: H-815296d65386 |
| 300행 | 별도 조건식 없음 | useState(initial.content)<br>call |
| 301행 | 별도 조건식 없음 | useRef(content)<br>call |
| 302행 | 별도 조건식 없음 | useRef(codeContent(example))<br>call |
| 302행 | 별도 조건식 없음 | codeContent(example)<br>call |
| 303행 | 별도 조건식 없음 | useRef(example.version)<br>call |
| 304행 | 별도 조건식 없음 | useRef(initial.blocked)<br>call |
| 305행 | 별도 조건식 없음 | useState(initial.blocked)<br>call |
| 306행 | 별도 조건식 없음 | useState(initial.error)<br>call |
| 307행 | 별도 조건식 없음 | useState(sameCodeContent(initial.content, example) ? '이 기기에 저장됨' : '초안에서 이어 쓰는 중')<br>call |
| 308행 | 별도 조건식 없음 | sameCodeContent(initial.content, example)<br>call |
| 310행 | 별도 조건식 없음 | useState(initial.conflict)<br>call |
| 311행 | 별도 조건식 없음 | useState('idle')<br>call |
| 312행 | 별도 조건식 없음 | useState('')<br>call |
| 313행 | 별도 조건식 없음 | useRef(false)<br>call |
| 314행 | 별도 조건식 없음 | useRef(null)<br>call |
| 315행 | 별도 조건식 없음 | useRef(null)<br>call |
| 316행 | 별도 조건식 없음 | useRef('')<br>call |
| 317행 | 별도 조건식 없음 | canUseCodeTerminal(content.language)<br>call |
| 321행 | 별도 조건식 없음 | useState(false)<br>call |
| 322행 | 별도 조건식 없음 | useRef(null)<br>call |
| 323행 | 별도 조건식 없음 | useRef(null)<br>call |
| 324행 | 별도 조건식 없음 | useRef(true)<br>call |
| 325행 | 별도 조건식 없음 | useRef(null)<br>call |
| 326행 | 별도 조건식 없음 | useRef(onSaved)<br>call |
| 410행 | 별도 조건식 없음 | useRef(flush)<br>call<br>전달 콜백: H-162b9348acb5 |
| 412행 | 별도 조건식 없음 | useEffect(() => { alive.current = true; const save = () => { if (terminalExecution.current) { current.current = { ...current.current, lastRun: terminalExecution.current.snapshot(), }; run.current?.cancel(); } return flushRef.current(); }; const unload = (event: BeforeUnloadEvent) => { if (!save() && !sameCodeContent(current.current, saved.current)) { event.preventDefault(); event.returnValue = ''; } }; window.addEventListener('pagehide', save); window.addEventListener('beforeunload', unload); if (!sameCodeContent(current.current, saved.current) && !blocked.current) timer.current = setTimeout(save, 800); return () => { alive.current = false; run.current?.cancel(); save(); window.removeEventListener('pa … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-895840259461 |
| 442행 | 별도 조건식 없음 | useEffect(() => { if (!active) run.current?.cancel(); }, [active])<br>call<br>전달 콜백: H-698cf7f7fad3 |
| 443행 | 별도 조건식 없음 | useEffectEvent(() => saveDraft())<br>call<br>전달 콜백: H-c4b97dcd167d |
| 444행 | 별도 조건식 없음 | useEffect(() => { if (phase === 'idle' \|\| !interactive) return; // Keep an exact intermediate draft for crashes; do not claim it completed. const interval = setInterval(() => saveRunningDraft(), 1000); return () => clearInterval(interval); }, [phase, interactive])<br>call<br>전달 콜백: H-70c8f4b1e377 |
| 450행 | 별도 조건식 없음 | useEffect(() => { if (example.version === version.current) return; if (!sameCodeContent(current.current, saved.current)) { const local = { id: example.id, baseVersion: version.current, content: current.current, }; retainCodeDraft(key, local); try { writeCodeDraft(key, local); } catch { /* The exact draft is retained in memory for export. */ } blocked.current = true; setBlocked(true); setConflict(local); setError( '다른 곳에서 예제가 바뀌었습니다. 작성 중인 초안과 저장된 예제를 모두 보존했습니다.', ); } version.current = example.version; saved.current = codeContent(example); current.current = codeContent(example); setContent(current.current); }, [example, key])<br>call<br>전달 콜백: H-5fac82dc5439 |
| 589행 | 별도 조건식 없음 | Object.entries(CODE_LANGUAGES).map(([id, name]) => ( <option key={id} value={id}> {name} </option> ))<br>call<br>전달 콜백: H-47f449b955ed |
| 589행 | 별도 조건식 없음 | Object.entries(CODE_LANGUAGES)<br>call |
| 600행 | falsy: isBlocked | Boolean(content.code.trim())<br>call |
| 600행 | falsy: isBlocked | content.code.trim()<br>call |
| 661행 | truthy: inputRequested | content.stdin.trim()<br>call |
| 679행 | truthy: phase !== 'idle' ∧ truthy: !interactive &&<br>            repository.getCodeRunner?.() | ['c', 'cpp', 'csharp'].includes(content.language)<br>call |
| 686행 | truthy: phase === 'loading' | ['c', 'cpp', 'csharp'].includes(content.language)<br>call |
| 777행 | truthy: !interactive &&<br>        repository.getCodeRunner?.() | ['c', 'cpp', 'csharp'].includes(content.language)<br>call |
| 794행 | truthy: lastRun?.mode === 'terminal' && lastRun.stdin | lastRun.stdin.replace(/\r\n?/g, '\n').replace(/\u0003/g, '〔중지〕').replace(/\u0004/g, '〔입력 끝〕')<br>call |
| 794행 | truthy: lastRun?.mode === 'terminal' && lastRun.stdin | lastRun.stdin.replace(/\r\n?/g, '\n').replace(/\u0003/g, '〔중지〕')<br>call |
| 794행 | truthy: lastRun?.mode === 'terminal' && lastRun.stdin | lastRun.stdin.replace(/\r\n?/g, '\n')<br>call |
| 797행 | truthy: lastRun | currentCodeRun(content)<br>call |
| 804행 | truthy: lastRun | readableCodeOutput(lastRun.output)<br>call → [H-b9d2ce140437](ui__code-practice.md#h-b9d2ce140437) |
| 815행 | truthy: lastRun?.mode !== 'terminal' &&<br>          lastRun?.outcome === 'success' | requestsCodeInput(lastRun.code, lastRun.language)<br>call |
| 835행 | truthy: conflict | JSON.stringify(conflict.content, null, 2)<br>call |

반환/조기 중단: 566행 <render> [별도 조건식 없음]

## H-815296d65386

**@callback:useState** · [src/ui/code-practice.tsx:278](../../../src/ui/code-practice.tsx#L278)

분기 조건과 가능한 갈림길:

- B-b0378e36adf2 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (279행).
- B-eeb1288504f2 · ConditionalExpression · draft && draft.baseVersion !== example.version && !sameCodeContent(draft.content, example) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (282행).
- B-e5d38eddad91 · ConditionalExpression · conflict → truthy / falsy; 바깥 조건: 별도 조건식 없음 (286행).
- B-7beb7e5122c4 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (291행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 280행 | 별도 조건식 없음 | readCodeDraft(key, example.id)<br>preservation-boundary |
| 282행 | truthy: draft && draft.baseVersion !== example.version | sameCodeContent(draft.content, example)<br>call |
| 286행 | 별도 조건식 없음 | codeContent(conflict ? example : (draft?.content ?? example))<br>call |
| 289행 | 별도 조건식 없음 | Boolean(conflict)<br>call |
| 293행 | exception: e | codeContent(example)<br>call |
| 295행 | exception: e | errorMessage(e)<br>call → [H-8dae215a929b](ui__code-practice.md#h-8dae215a929b) |

반환/조기 중단: 285행 { content: codeContent(conflict ? example : (draft?.content ?? example)), conflict, error: '', blocked: Boolean(conflict), } [별도 조건식 없음]; 292행 { content: codeContent(example), conflict: null as CodeExampleDraft | null, error: errorMessage(e), blocked: true, } [exception: e]

## H-69f3037b2556

**draft** · [src/ui/code-practice.tsx:328](../../../src/ui/code-practice.tsx#L328)

분기 조건과 가능한 갈림길:

- B-5a3a63002ea7 · ConditionalExpression · terminalExecution.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (331행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 332행 | truthy: terminalExecution.current | terminalExecution.current.snapshot()<br>call |

## H-a697efae3645

**saveDraft** · [src/ui/code-practice.tsx:335](../../../src/ui/code-practice.tsx#L335)

분기 조건과 가능한 갈림길:

- B-fed1ece731c4 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (336행).
- B-0fc391f3c2cf · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (339행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 337행 | 별도 조건식 없음 | writeCodeDraft(key, draft())<br>preservation-boundary |
| 337행 | 별도 조건식 없음 | draft()<br>preservation-boundary → [H-69f3037b2556](ui__code-practice.md#h-69f3037b2556) |
| 340행 | exception: exception | setError('초안을 저장하지 못했습니다. 입력은 현재 창에 있습니다. 파일로 보관하거나 저장을 다시 시도해 주세요.')<br>state-update |

반환/조기 중단: 338행 true [별도 조건식 없음]; 343행 false [exception: exception]

## H-162b9348acb5

**flush** · [src/ui/code-practice.tsx:346](../../../src/ui/code-practice.tsx#L346)

분기 조건과 가능한 갈림길:

- B-5efb5119ae4c · IfStatement · timer.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (347행).
- B-5c16aa7af95c · IfStatement · blocked.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (349행).
- B-031e14478050 · IfStatement · sameCodeContent(current.current, saved.current) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (350행).
- B-c9bf4da5ad07 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (352행).
- B-a9ad325c1f85 · IfStatement · !canSave(repository, data) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (353행).
- B-487b59f4cef8 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (368행).
- B-d3426f0623a3 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (370행).
- B-d1ae9bdc7097 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (374행).
- B-49fb4041f080 · ConditionalExpression · draftHasUnstoredText(key) → truthy / falsy; 바깥 조건: exception: e (377행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 347행 | truthy: timer.current | clearTimeout(timer.current)<br>call |
| 350행 | 별도 조건식 없음 | sameCodeContent(current.current, saved.current)<br>call |
| 351행 | 별도 조건식 없음 | saveDraft()<br>preservation-boundary → [H-a697efae3645](ui__code-practice.md#h-a697efae3645) |
| 353행 | 별도 조건식 없음 | canSave(repository, data)<br>call → [H-0935c8baf1c2](ui__code-practice.md#h-0935c8baf1c2) |
| 354행 | truthy: !canSave(repository, data) | Error('개인 공간의 코드 저장 연결이 필요합니다. 초안은 이 기기에 보관했습니다.')<br>call |
| 355행 | 별도 조건식 없음 | repository.execute({ type: 'saveCodeExample', id: example.id, expectedVersion: version.current, content: current.current, ...context(data), })<br>call |
| 360행 | 별도 조건식 없음 | context(data)<br>call → [H-708b49420657](ui__code-practice.md#h-708b49420657) |
| 362행 | 별도 조건식 없음 | next.codeExamples!.find((item) => item.id === example.id)<br>call<br>전달 콜백: H-923134a1064b |
| 363행 | 별도 조건식 없음 | codeContent(row)<br>call |
| 365행 | 별도 조건식 없음 | callback.current(next)<br>call |
| 366행 | 별도 조건식 없음 | setStatus('이 기기에 저장됨')<br>state-update |
| 367행 | 별도 조건식 없음 | setError('')<br>state-update |
| 369행 | 별도 조건식 없음 | clearCodeDraft(key)<br>preservation-boundary |
| 371행 | exception: exception | setError('예제는 저장했습니다. 초안 정리가 남아 있습니다.')<br>state-update |
| 375행 | exception: e | setStatus('저장 다시 필요')<br>state-update |
| 376행 | exception: e | setError(`${errorMessage(e)} ${draftHasUnstoredText(key) ? '최신 입력은 현재 창에만 있습니다.' : '초안은 이 기기에 보관했습니다.'}`)<br>state-update |
| 377행 | exception: e | errorMessage(e)<br>call → [H-8dae215a929b](ui__code-practice.md#h-8dae215a929b) |
| 377행 | exception: e | draftHasUnstoredText(key)<br>preservation-boundary |

반환/조기 중단: 349행 false [truthy: blocked.current]; 350행 true [truthy: sameCodeContent(current.current, saved.current)]; 373행 true [별도 조건식 없음]; 379행 false [exception: e]

throw: 354행 Error('개인 공간의 코드 저장 연결이 필요합니다. 초안은 이 기기에 보관했습니다.')

## H-923134a1064b

**@callback:next.codeExamples!.find** · [src/ui/code-practice.tsx:362](../../../src/ui/code-practice.tsx#L362)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-02a26358bfb6

**update** · [src/ui/code-practice.tsx:382](../../../src/ui/code-practice.tsx#L382)

분기 조건과 가능한 갈림길:

- B-e4e5a3288377 · IfStatement · timer.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (388행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 384행 | 별도 조건식 없음 | setContent(next)<br>state-update |
| 385행 | 별도 조건식 없음 | setStatus('저장 중…')<br>state-update |
| 386행 | 별도 조건식 없음 | retainCodeDraft(key, draft())<br>preservation-boundary |
| 386행 | 별도 조건식 없음 | draft()<br>preservation-boundary → [H-69f3037b2556](ui__code-practice.md#h-69f3037b2556) |
| 387행 | 별도 조건식 없음 | saveDraft()<br>preservation-boundary → [H-a697efae3645](ui__code-practice.md#h-a697efae3645) |
| 388행 | truthy: timer.current | clearTimeout(timer.current)<br>call |
| 389행 | 별도 조건식 없음 | setTimeout(flush, 800)<br>state-update<br>전달 콜백: H-162b9348acb5 |

## H-972d8bf95a59

**saveNow** · [src/ui/code-practice.tsx:391](../../../src/ui/code-practice.tsx#L391) · async

분기 조건과 가능한 갈림길:

- B-31358b6f2f1a · IfStatement · !flush() || !repository.flush → truthy / falsy; 바깥 조건: 별도 조건식 없음 (393행).
- B-f07246ee05b7 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (395행).
- B-e72c3ece5bcd · IfStatement · !alive.current || current.current !== savingContent → truthy / falsy; 바깥 조건: 별도 조건식 없음 (397행).
- B-2c0725688eb7 · IfStatement · status && status.phase !== 'saved' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (399행).
- B-87de47988774 · CatchClause · error → exception; 바깥 조건: 별도 조건식 없음 (402행).
- B-533bcb659c76 · IfStatement · !alive.current || current.current !== savingContent → truthy / falsy; 바깥 조건: exception: error (403행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 393행 | 별도 조건식 없음 | flush()<br>call → [H-162b9348acb5](ui__code-practice.md#h-162b9348acb5) |
| 394행 | 별도 조건식 없음 | setStatus('서버에 저장 중…')<br>state-update |
| 396행 | 별도 조건식 없음 | repository.flush()<br>mutation-request |
| 399행 | truthy: status && status.phase !== 'saved' | Error(status.message)<br>call |
| 400행 | 별도 조건식 없음 | setStatus('서버에 저장됨')<br>state-update |
| 401행 | 별도 조건식 없음 | setError('')<br>state-update |
| 404행 | exception: error | setStatus('이 기기에 보관 · 서버 저장 다시 필요')<br>state-update |
| 405행 | exception: error | setError(`${errorMessage(error)} 입력은 이 기기에 보관했습니다. 지금 저장을 눌러 다시 시도해 주세요.`)<br>state-update |
| 406행 | exception: error | errorMessage(error)<br>call → [H-8dae215a929b](ui__code-practice.md#h-8dae215a929b) |

반환/조기 중단: 393행 <render> [truthy: !flush() || !repository.flush]; 397행 <render> [truthy: !alive.current || current.current !== savingContent]; 403행 <render> [exception: error ∧ truthy: !alive.current || current.current !== savingContent]

throw: 399행 Error(status.message)

## H-895840259461

**@callback:useEffect** · [src/ui/code-practice.tsx:412](../../../src/ui/code-practice.tsx#L412)

분기 조건과 가능한 갈림길:

- B-20628427c5fa · IfStatement · !sameCodeContent(current.current, saved.current) && !blocked.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (432행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 430행 | 별도 조건식 없음 | window.addEventListener('pagehide', save)<br>call<br>전달 콜백: H-20faecd725ac |
| 431행 | 별도 조건식 없음 | window.addEventListener('beforeunload', unload)<br>call<br>전달 콜백: H-053ed50af4d0 |
| 432행 | 별도 조건식 없음 | sameCodeContent(current.current, saved.current)<br>call |
| 433행 | truthy: !sameCodeContent(current.current, saved.current) && !blocked.current | setTimeout(save, 800)<br>state-update<br>전달 콜백: H-20faecd725ac |

반환/조기 중단: 434행 () => { alive.current = false; run.current?.cancel(); save(); window.removeEventListener('pagehide', save); window.removeEventListener('beforeunload', unload); } [별도 조건식 없음]

## H-20faecd725ac

**save** · [src/ui/code-practice.tsx:414](../../../src/ui/code-practice.tsx#L414)

분기 조건과 가능한 갈림길:

- B-9652dd33ae74 · IfStatement · terminalExecution.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (415행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 418행 | truthy: terminalExecution.current | terminalExecution.current.snapshot()<br>call |
| 422행 | 별도 조건식 없음 | flushRef.current()<br>call |

반환/조기 중단: 422행 flushRef.current() [별도 조건식 없음]

## H-053ed50af4d0

**unload** · [src/ui/code-practice.tsx:424](../../../src/ui/code-practice.tsx#L424)

분기 조건과 가능한 갈림길:

- B-376f028674d9 · IfStatement · !save() && !sameCodeContent(current.current, saved.current) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (425행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 425행 | 별도 조건식 없음 | save()<br>call → [H-20faecd725ac](ui__code-practice.md#h-20faecd725ac) |
| 425행 | truthy: !save() | sameCodeContent(current.current, saved.current)<br>call |
| 426행 | truthy: !save() && !sameCodeContent(current.current, saved.current) | event.preventDefault()<br>input-control |

## H-698cf7f7fad3

**@callback:useEffect** · [src/ui/code-practice.tsx:442](../../../src/ui/code-practice.tsx#L442)

분기 조건과 가능한 갈림길:

- B-e40620d628ca · IfStatement · !active → truthy / falsy; 바깥 조건: 별도 조건식 없음 (442행).

## H-c4b97dcd167d

**@callback:useEffectEvent** · [src/ui/code-practice.tsx:443](../../../src/ui/code-practice.tsx#L443)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 443행 | 별도 조건식 없음 | saveDraft()<br>preservation-boundary → [H-a697efae3645](ui__code-practice.md#h-a697efae3645) |

## H-70c8f4b1e377

**@callback:useEffect** · [src/ui/code-practice.tsx:444](../../../src/ui/code-practice.tsx#L444)

분기 조건과 가능한 갈림길:

- B-7f50902c33e4 · IfStatement · phase === 'idle' || !interactive → truthy / falsy; 바깥 조건: 별도 조건식 없음 (445행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 447행 | 별도 조건식 없음 | setInterval(() => saveRunningDraft(), 1000)<br>state-update<br>전달 콜백: H-e49aa3c80a74 |

반환/조기 중단: 445행 <render> [truthy: phase === 'idle' || !interactive]; 448행 () => clearInterval(interval) [별도 조건식 없음]

## H-e49aa3c80a74

**@callback:setInterval** · [src/ui/code-practice.tsx:447](../../../src/ui/code-practice.tsx#L447)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 447행 | 별도 조건식 없음 | saveRunningDraft()<br>preservation-boundary |

## H-5fac82dc5439

**@callback:useEffect** · [src/ui/code-practice.tsx:450](../../../src/ui/code-practice.tsx#L450)

분기 조건과 가능한 갈림길:

- B-8a04e9b7bae6 · IfStatement · example.version === version.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (451행).
- B-bf67557a8bb4 · IfStatement · !sameCodeContent(current.current, saved.current) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (452행).
- B-95e994a253e5 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: !sameCodeContent(current.current, saved.current) (459행).
- B-9819621eebb1 · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: !sameCodeContent(current.current, saved.current) (461행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 452행 | 별도 조건식 없음 | sameCodeContent(current.current, saved.current)<br>call |
| 458행 | truthy: !sameCodeContent(current.current, saved.current) | retainCodeDraft(key, local)<br>preservation-boundary |
| 460행 | truthy: !sameCodeContent(current.current, saved.current) | writeCodeDraft(key, local)<br>preservation-boundary |
| 465행 | truthy: !sameCodeContent(current.current, saved.current) | setBlocked(true)<br>state-update |
| 466행 | truthy: !sameCodeContent(current.current, saved.current) | setConflict(local)<br>state-update |
| 467행 | truthy: !sameCodeContent(current.current, saved.current) | setError('다른 곳에서 예제가 바뀌었습니다. 작성 중인 초안과 저장된 예제를 모두 보존했습니다.')<br>state-update |
| 472행 | 별도 조건식 없음 | codeContent(example)<br>call |
| 473행 | 별도 조건식 없음 | codeContent(example)<br>call |
| 474행 | 별도 조건식 없음 | setContent(current.current)<br>state-update |

반환/조기 중단: 451행 <render> [truthy: example.version === version.current]

## H-3672b0666f90

**start** · [src/ui/code-practice.tsx:476](../../../src/ui/code-practice.tsx#L476)

분기 조건과 가능한 갈림길:

- B-c13812b5ac57 · IfStatement · run.current || blocked.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (477행).
- B-8c6e343148c6 · IfStatement · !interactive && !allowEmptyInput && !current.current.stdin.trim() && requestsCodeInput(current.current.code, current.current.language) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (478행).
- B-f8521d4165f7 · IfStatement · interactive → truthy / falsy; 바깥 조건: 별도 조건식 없음 (495행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 481행 | truthy: !interactive &&<br>      !allowEmptyInput | current.current.stdin.trim()<br>call |
| 482행 | truthy: !interactive &&<br>      !allowEmptyInput &&<br>      !current.current.stdin.trim() | requestsCodeInput(current.current.code, current.current.language)<br>call |
| 484행 | truthy: !interactive &&<br>      !allowEmptyInput &&<br>      !current.current.stdin.trim() &&<br>      requestsCodeInput(current.current.code, current.current.language) | setInputRequested(true)<br>state-update |
| 488행 | 별도 조건식 없음 | setInputRequested(false)<br>state-update |
| 496행 | truthy: interactive | setTerminalInput('')<br>state-update |
| 499행 | truthy: interactive | executeCodeTerminal(source, (text) => { if (terminalHandle.current) terminalHandle.current.write(text); else pendingTerminalOutput.current += text; }, setPhase)<br>call<br>전달 콜백: H-1174834cdfe6 |
| 508행 | falsy: interactive | executeCode(source, setPhase, repository.getCodeRunner?.())<br>call |
| 510행 | 별도 조건식 없음 | execution.result.then((result) => { run.current = null; terminalExecution.current = null; if (!alive.current) return; setPhase('idle'); update({ ...current.current, lastRun: result }); flushRef.current(); })<br>call<br>전달 콜백: H-0427f12e21b5 |

반환/조기 중단: 477행 <render> [truthy: run.current || blocked.current]; 486행 <render> [truthy: !interactive &&
      !allowEmptyInput &&
      !current.current.stdin.trim() &&
      requestsCodeInput(current.current.code, current.current.language)]

## H-1174834cdfe6

**@callback:executeCodeTerminal** · [src/ui/code-practice.tsx:501](../../../src/ui/code-practice.tsx#L501)

분기 조건과 가능한 갈림길:

- B-02c1004d8f6f · IfStatement · terminalHandle.current → truthy / falsy; 바깥 조건: truthy: interactive (502행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 502행 | truthy: interactive ∧ truthy: terminalHandle.current | terminalHandle.current.write(text)<br>call |

## H-0427f12e21b5

**@callback:execution.result.then** · [src/ui/code-practice.tsx:510](../../../src/ui/code-practice.tsx#L510)

분기 조건과 가능한 갈림길:

- B-58f7f95c4908 · IfStatement · !alive.current → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: execution.result (513행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 514행 | fulfilled-or-explicit-rejection-handler: execution.result | setPhase('idle')<br>state-update |
| 515행 | fulfilled-or-explicit-rejection-handler: execution.result | update({ ...current.current, lastRun: result })<br>call → [H-02a26358bfb6](ui__code-practice.md#h-02a26358bfb6) |
| 516행 | fulfilled-or-explicit-rejection-handler: execution.result | flushRef.current()<br>call |

반환/조기 중단: 513행 <render> [fulfilled-or-explicit-rejection-handler: execution.result ∧ truthy: !alive.current]

## H-f2755b852bc1

**copy** · [src/ui/code-practice.tsx:519](../../../src/ui/code-practice.tsx#L519)

분기 조건과 가능한 갈림길:

- B-c256b75cdb1c · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (520행).
- B-619fc5063edd · ConditionalExpression · source.title → truthy / falsy; 바깥 조건: 별도 조건식 없음 (528행).
- B-0303a2ab8744 · IfStatement · conflict → truthy / falsy; 바깥 조건: 별도 조건식 없음 (533행).
- B-6a8d905c1c65 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (538행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 521행 | 별도 조건식 없음 | crypto.randomUUID()<br>call |
| 522행 | 별도 조건식 없음 | repository.execute({ type: 'saveCodeExample', id, expectedVersion: 0, content: { ...source, title: source.title ? `${source.title} · 사본` : '예제 사본', }, ...context(data), })<br>call |
| 530행 | 별도 조건식 없음 | context(data)<br>call → [H-708b49420657](ui__code-practice.md#h-708b49420657) |
| 532행 | 별도 조건식 없음 | callback.current(next)<br>call |
| 534행 | truthy: conflict | archiveDamagedDraft(key, '코드 예제 충돌 초안을 별도 예제로 보관')<br>preservation-boundary |
| 535행 | truthy: conflict | clearCodeDraft(key)<br>preservation-boundary |
| 537행 | 별도 조건식 없음 | onCopied(id)<br>call |
| 539행 | exception: e | setError(errorMessage(e))<br>state-update |
| 539행 | exception: e | errorMessage(e)<br>call → [H-8dae215a929b](ui__code-practice.md#h-8dae215a929b) |

## H-1cf5b4ae45b9

**exportFile** · [src/ui/code-practice.tsx:542](../../../src/ui/code-practice.tsx#L542)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 543행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |
| 544행 | 별도 조건식 없음 | JSON.stringify({ format: 'study-space-code-example', version: 1, example: snapshot.codeExamples?.find((row) => row.id === example.id), draft: draft(), conflict, revisions: snapshot.revisions.filter( (row) => row.collection === 'codeExamples' && row.entityId === example.id, ), }, null, 2)<br>call |
| 549행 | 별도 조건식 없음 | draft()<br>preservation-boundary → [H-69f3037b2556](ui__code-practice.md#h-69f3037b2556) |
| 551행 | 별도 조건식 없음 | snapshot.revisions.filter((row) => row.collection === 'codeExamples' && row.entityId === example.id)<br>call<br>전달 콜백: H-1362326f0d6f |
| 558행 | 별도 조건식 없음 | URL.createObjectURL(new Blob([raw], { type: 'application/json;charset=utf-8' }))<br>call |
| 559행 | 별도 조건식 없음 | document.createElement('a')<br>call |
| 562행 | 별도 조건식 없음 | link.click()<br>call |
| 563행 | 별도 조건식 없음 | setTimeout(() => URL.revokeObjectURL(url), 60_000)<br>state-update<br>전달 콜백: H-a628cde0a085 |

## H-1362326f0d6f

**@callback:snapshot.revisions.filter** · [src/ui/code-practice.tsx:552](../../../src/ui/code-practice.tsx#L552)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a628cde0a085

**@callback:setTimeout** · [src/ui/code-practice.tsx:563](../../../src/ui/code-practice.tsx#L563)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 563행 | 별도 조건식 없음 | URL.revokeObjectURL(url)<br>call |

## H-4344f0224d33

**@onChange** · [src/ui/code-practice.tsx:575](../../../src/ui/code-practice.tsx#L575)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 575행 | 별도 조건식 없음 | update({ ...current.current, title: event.target.value })<br>call → [H-02a26358bfb6](ui__code-practice.md#h-02a26358bfb6) |

## H-14e99799cff4

**@onChange** · [src/ui/code-practice.tsx:582](../../../src/ui/code-practice.tsx#L582)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 583행 | 별도 조건식 없음 | update({ ...current.current, language: event.target.value as CodeLanguage, })<br>call → [H-02a26358bfb6](ui__code-practice.md#h-02a26358bfb6) |

## H-47f449b955ed

**@callback:Object.entries(CODE_LANGUAGES).map** · [src/ui/code-practice.tsx:589](../../../src/ui/code-practice.tsx#L589)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-172439e91c0d

**@onClick** · [src/ui/code-practice.tsx:601](../../../src/ui/code-practice.tsx#L601)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 602행 | 별도 조건식 없음 | update({ ...current.current, code: CODE_STARTERS[content.language], })<br>call → [H-02a26358bfb6](ui__code-practice.md#h-02a26358bfb6) |

## H-64409d55789a

**@onChange** · [src/ui/code-practice.tsx:615](../../../src/ui/code-practice.tsx#L615)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 615행 | 별도 조건식 없음 | update({ ...current.current, code })<br>call → [H-02a26358bfb6](ui__code-practice.md#h-02a26358bfb6) |

## H-0166eea20dfa

**@onRun** · [src/ui/code-practice.tsx:616](../../../src/ui/code-practice.tsx#L616)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 616행 | 별도 조건식 없음 | start()<br>call → [H-3672b0666f90](ui__code-practice.md#h-3672b0666f90) |

## H-ab469d37ab65

**@onChange** · [src/ui/code-practice.tsx:622](../../../src/ui/code-practice.tsx#L622)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 623행 | 별도 조건식 없음 | update({ ...current.current, inputMode: event.target.value as 'batch' \| 'terminal', })<br>call → [H-02a26358bfb6](ui__code-practice.md#h-02a26358bfb6) |

## H-c11493ef577d

**@onChange** · [src/ui/code-practice.tsx:658](../../../src/ui/code-practice.tsx#L658)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 658행 | 별도 조건식 없음 | update({ ...current.current, stdin: event.target.value })<br>call → [H-02a26358bfb6](ui__code-practice.md#h-02a26358bfb6) |

## H-484e40343760

**@onClick** · [src/ui/code-practice.tsx:667](../../../src/ui/code-practice.tsx#L667)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 667행 | truthy: inputRequested && !content.stdin.trim() | start(true)<br>call → [H-3672b0666f90](ui__code-practice.md#h-3672b0666f90) |

## H-619fd49d9cc8

**@onClick** · [src/ui/code-practice.tsx:672](../../../src/ui/code-practice.tsx#L672)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 672행 | 별도 조건식 없음 | start()<br>call → [H-3672b0666f90](ui__code-practice.md#h-3672b0666f90) |

## H-4108c73ffc7b

**@onClick** · [src/ui/code-practice.tsx:676](../../../src/ui/code-practice.tsx#L676)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e2a200c7e1c1

**@onClick** · [src/ui/code-practice.tsx:708](../../../src/ui/code-practice.tsx#L708)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f43d4c1f41b9

**@onCompositionStart** · [src/ui/code-practice.tsx:738](../../../src/ui/code-practice.tsx#L738)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-fad90393948c

**@onCompositionEnd** · [src/ui/code-practice.tsx:741](../../../src/ui/code-practice.tsx#L741)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b3f6fb39a5f4

**@onChange** · [src/ui/code-practice.tsx:744](../../../src/ui/code-practice.tsx#L744)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 744행 | truthy: interactive | setTerminalInput(event.target.value)<br>state-update |

## H-0f09622c4e0a

**@onKeyDown** · [src/ui/code-practice.tsx:745](../../../src/ui/code-practice.tsx#L745)

분기 조건과 가능한 갈림길:

- B-1ba9e8a778e4 · IfStatement · event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing || composingInput.current || event.keyCode === 229 → truthy / falsy; 바깥 조건: truthy: interactive (746행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 754행 | truthy: interactive | event.preventDefault()<br>input-control |
| 756행 | truthy: interactive | terminalInput.replace(/\r\n?/g, '\n').replaceAll('\n', '\r')<br>call |
| 756행 | truthy: interactive | terminalInput.replace(/\r\n?/g, '\n')<br>call |
| 758행 | truthy: interactive | setTerminalInput('')<br>state-update |

반환/조기 중단: 753행 <render> [truthy: interactive ∧ truthy: event.key !== 'Enter' ||
                  event.shiftKey ||
                  event.nativeEvent.isComposing ||
                  composingInput.current ||
                  event.keyCode === 229]

## H-e01ccb707452

**@onClick** · [src/ui/code-practice.tsx:763](../../../src/ui/code-practice.tsx#L763)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 765행 | truthy: interactive | terminalInput.replace(/\r\n?/g, '\n').replaceAll('\n', '\r')<br>call |
| 765행 | truthy: interactive | terminalInput.replace(/\r\n?/g, '\n')<br>call |
| 767행 | truthy: interactive | setTerminalInput('')<br>state-update |

## H-355407168e62

**@onChange** · [src/ui/code-practice.tsx:828](../../../src/ui/code-practice.tsx#L828)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 828행 | 별도 조건식 없음 | update({ ...current.current, notes: event.target.value })<br>call → [H-02a26358bfb6](ui__code-practice.md#h-02a26358bfb6) |

## H-c868215e2ff7

**@onClick** · [src/ui/code-practice.tsx:836](../../../src/ui/code-practice.tsx#L836)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 836행 | truthy: conflict | copy(conflict.content)<br>call → [H-f2755b852bc1](ui__code-practice.md#h-f2755b852bc1) |

## H-f9933f62bf43

**@onClick** · [src/ui/code-practice.tsx:841](../../../src/ui/code-practice.tsx#L841)

분기 조건과 가능한 갈림길:

- B-905d8bdcbb75 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: isBlocked && !conflict (842행).
- B-29366d444ff2 · CatchClause · e → exception; 바깥 조건: truthy: isBlocked && !conflict (848행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 843행 | truthy: isBlocked && !conflict | archiveDamagedDraft(key, '코드 예제 초안 읽기 실패')<br>preservation-boundary |
| 844행 | truthy: isBlocked && !conflict | clearCodeDraft(key)<br>preservation-boundary |
| 846행 | truthy: isBlocked && !conflict | setBlocked(false)<br>state-update |
| 847행 | truthy: isBlocked && !conflict | setError('초안 원문을 보관했습니다. 저장된 예제를 편집할 수 있습니다.')<br>state-update |
| 849행 | truthy: isBlocked && !conflict ∧ exception: e | setError(errorMessage(e))<br>state-update |
| 849행 | truthy: isBlocked && !conflict ∧ exception: e | errorMessage(e)<br>call → [H-8dae215a929b](ui__code-practice.md#h-8dae215a929b) |

## H-44d80a7afb24

**@onClick** · [src/ui/code-practice.tsx:863](../../../src/ui/code-practice.tsx#L863)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 864행 | 별도 조건식 없음 | saveNow()<br>call → [H-972d8bf95a59](ui__code-practice.md#h-972d8bf95a59) |

## H-599ec65d8ebb

**@onClick** · [src/ui/code-practice.tsx:870](../../../src/ui/code-practice.tsx#L870)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 870행 | 별도 조건식 없음 | copy()<br>call → [H-f2755b852bc1](ui__code-practice.md#h-f2755b852bc1) |

## H-33002a25c0b2

**@onClick** · [src/ui/code-practice.tsx:876](../../../src/ui/code-practice.tsx#L876)

분기 조건과 가능한 갈림길:

- B-119488883656 · IfStatement · flush() → truthy / falsy; 바깥 조건: 별도 조건식 없음 (877행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 877행 | 별도 조건식 없음 | flush()<br>call → [H-162b9348acb5](ui__code-practice.md#h-162b9348acb5) |
| 877행 | truthy: flush() | onTrash()<br>call |

