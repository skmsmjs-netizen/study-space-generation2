# src/ui/touch-source-editor.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-c228d117a95a

**syntaxLanguage** · [src/ui/touch-source-editor.tsx:25](../../../src/ui/touch-source-editor.tsx#L25)

분기 조건과 가능한 갈림길:

- B-9daf8868f198 · ConditionalExpression · language === 'c' || language === 'cpp' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (26행).
- B-48f13ae1f0f0 · ConditionalExpression · language === 'csharp' → truthy / falsy; 바깥 조건: falsy: language === 'c' || language === 'cpp' (29행).
- B-f5ff93fff40a · ConditionalExpression · language === 'python' → truthy / falsy; 바깥 조건: falsy: language === 'c' || language === 'cpp' ∧ falsy: language === 'csharp' (29행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 27행 | truthy: language === 'c' \|\| language === 'cpp' | cpp()<br>call |
| 28행 | falsy: language === 'c' \|\| language === 'cpp' | StreamLanguage.define(language === 'csharp' ? csharp : language === 'python' ? python : javascript)<br>call |

## H-184ec50b59ea

**mainTemplate** · [src/ui/touch-source-editor.tsx:31](../../../src/ui/touch-source-editor.tsx#L31)

분기 조건과 가능한 갈림길:

- B-92983ed43c80 · ConditionalExpression · language === 'csharp' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (32행).
- B-b7c8bd808ecd · ConditionalExpression · /\bclass\s/.test(code) → truthy / falsy; 바깥 조건: truthy: language === 'csharp' (33행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 33행 | truthy: language === 'csharp' | /\bclass\s/.test(code)<br>call |

## H-44d0af4155cf

**TouchSourceEditor** · [src/ui/touch-source-editor.tsx:38](../../../src/ui/touch-source-editor.tsx#L38)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 45행 | 별도 조건식 없음 | useRef(null)<br>call |
| 46행 | 별도 조건식 없음 | useRef(null)<br>call |
| 47행 | 별도 조건식 없음 | useRef({ onChange, onRun, language })<br>call |
| 49행 | 별도 조건식 없음 | useState(false)<br>call |
| 50행 | 별도 조건식 없음 | useState(() => ({ language: new Compartment(), readonly: new Compartment(), tab: new Compartment(), }))<br>call<br>전달 콜백: H-157101636bb0 |
| 55행 | 별도 조건식 없음 | useCodeSyntax(value, language)<br>call → [H-9d8bd41e51d5](ui__code-syntax-status.md#h-9d8bd41e51d5) |
| 56행 | 별도 조건식 없음 | useRef({value, language, readOnly, compartments})<br>call |
| 57행 | 별도 조건식 없음 | useEffect(() => { const editor = new EditorView({ parent: host.current!, state: EditorState.create({ doc: initial.current.value, extensions: [ basicSetup, initial.current.compartments.language.of(syntaxLanguage(initial.current.language)), initial.current.compartments.readonly.of([ EditorState.readOnly.of(initial.current.readOnly), EditorView.editable.of(!initial.current.readOnly), ]), initial.current.compartments.tab.of(keymap.of([indentWithTab])), indentUnit.of(' '), EditorState.tabSize.of(4), Prec.highest( keymap.of([ { key: 'Mod-Enter', run: () => { callbacks.current.onRun(); return true; }, }, ]), ), autocompletion({ override: [ (context) => { if (!['c', 'cpp', 'csharp'].includes(callbacks.current … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-1061dd0a96e2 |
| 143행 | 별도 조건식 없음 | useEffect(() => { view.current?.dispatch({ effects: compartments.language.reconfigure(syntaxLanguage(language)), }); }, [language, compartments])<br>call<br>전달 콜백: H-dd5e0839b459 |
| 148행 | 별도 조건식 없음 | useEffect(() => { view.current?.dispatch({ effects: compartments.readonly.reconfigure([ EditorState.readOnly.of(readOnly), EditorView.editable.of(!readOnly), ]), }); }, [readOnly, compartments])<br>call<br>전달 콜백: H-57454355e1f3 |
| 156행 | 별도 조건식 없음 | useEffect(() => { view.current?.dispatch({ effects: compartments.tab.reconfigure(keymap.of(tabMovesFocus ? [] : [indentWithTab])), }); }, [tabMovesFocus, compartments])<br>call<br>전달 콜백: H-a56d5c6313c9 |
| 161행 | 별도 조건식 없음 | useEffect(() => { const editor = view.current; if (editor && editor.state.doc.toString() !== value) editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: value }, }); }, [value])<br>call<br>전달 콜백: H-ee48d8602bb8 |
| 168행 | 별도 조건식 없음 | useEffect(() => { const editor = view.current; if (!editor) return; const doc = editor.state.doc; const offset = (line: number, column: number) => { const row = doc.line(Math.max(1, Math.min(doc.lines, line))); return Math.min(row.to, row.from + Math.max(0, column - 1)); }; editor.dispatch( setDiagnostics( editor.state, syntax.diagnostics.map((issue) => ({ from: offset(issue.startLineNumber, issue.startColumn), to: offset(issue.endLineNumber, issue.endColumn), severity: 'error', message: issue.message, })), ), ); }, [syntax.diagnostics])<br>call<br>전달 콜백: H-e70e767f0985 |
| 236행 | falsy: readOnly | ['c', 'cpp', 'csharp'].includes(language)<br>call |

반환/조기 중단: 206행 <render> [별도 조건식 없음]

## H-157101636bb0

**@callback:useState** · [src/ui/touch-source-editor.tsx:50](../../../src/ui/touch-source-editor.tsx#L50)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1061dd0a96e2

**@callback:useEffect** · [src/ui/touch-source-editor.tsx:57](../../../src/ui/touch-source-editor.tsx#L57)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 60행 | 별도 조건식 없음 | EditorState.create({ doc: initial.current.value, extensions: [ basicSetup, initial.current.compartments.language.of(syntaxLanguage(initial.current.language)), initial.current.compartments.readonly.of([ EditorState.readOnly.of(initial.current.readOnly), EditorView.editable.of(!initial.current.readOnly), ]), initial.current.compartments.tab.of(keymap.of([indentWithTab])), indentUnit.of(' '), EditorState.tabSize.of(4), Prec.highest( keymap.of([ { key: 'Mod-Enter', run: () => { callbacks.current.onRun(); return true; }, }, ]), ), autocompletion({ override: [ (context) => { if (!['c', 'cpp', 'csharp'].includes(callbacks.current.language)) return null; const word = context.matchBefore(/\w*/); if (!word \|\| (!context. … [전체 인수는 JSON·소스])<br>call |
| 64행 | 별도 조건식 없음 | initial.current.compartments.language.of(syntaxLanguage(initial.current.language))<br>call |
| 64행 | 별도 조건식 없음 | syntaxLanguage(initial.current.language)<br>call → [H-c228d117a95a](ui__touch-source-editor.md#h-c228d117a95a) |
| 65행 | 별도 조건식 없음 | initial.current.compartments.readonly.of([ EditorState.readOnly.of(initial.current.readOnly), EditorView.editable.of(!initial.current.readOnly), ])<br>call |
| 66행 | 별도 조건식 없음 | EditorState.readOnly.of(initial.current.readOnly)<br>call |
| 67행 | 별도 조건식 없음 | EditorView.editable.of(!initial.current.readOnly)<br>call |
| 69행 | 별도 조건식 없음 | initial.current.compartments.tab.of(keymap.of([indentWithTab]))<br>call |
| 69행 | 별도 조건식 없음 | keymap.of([indentWithTab])<br>call |
| 70행 | 별도 조건식 없음 | indentUnit.of(' ')<br>call |
| 71행 | 별도 조건식 없음 | EditorState.tabSize.of(4)<br>call |
| 72행 | 별도 조건식 없음 | Prec.highest(keymap.of([ { key: 'Mod-Enter', run: () => { callbacks.current.onRun(); return true; }, }, ]))<br>call |
| 73행 | 별도 조건식 없음 | keymap.of([ { key: 'Mod-Enter', run: () => { callbacks.current.onRun(); return true; }, }, ])<br>call |
| 83행 | 별도 조건식 없음 | autocompletion({ override: [ (context) => { if (!['c', 'cpp', 'csharp'].includes(callbacks.current.language)) return null; const word = context.matchBefore(/\w*/); if (!word \|\| (!context.explicit && word.from === word.to)) return null; return { from: word.from, options: [ snippetCompletion( mainTemplate(callbacks.current.language, context.state.doc.toString()), { label: 'main', type: 'function', detail: '시작 함수' }, ), ], }; }, ], })<br>call |
| 101행 | 별도 조건식 없음 | EditorView.contentAttributes.of({ 'aria-label': '소스 코드', 'aria-multiline': 'true', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false', })<br>call |
| 108행 | 별도 조건식 없음 | EditorView.updateListener.of((update) => { if (update.docChanged) callbacks.current.onChange(update.state.doc.toString()); })<br>call<br>전달 콜백: H-6effadd8abbf |
| 111행 | 별도 조건식 없음 | EditorView.theme({ '&': { height: '100%', color: 'var(--color-text)', backgroundColor: 'var(--color-surface)', }, '.cm-scroller': { overflow: 'auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--input-font-size)', }, '.cm-gutters': { backgroundColor: 'var(--color-surface-inset)', color: 'var(--color-muted)', borderColor: 'var(--color-border)', }, '.cm-content': { padding: 'var(--space-3) 0' }, '.cm-tooltip': { backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)', }, })<br>call |

반환/조기 중단: 138행 () => { view.current = null; editor.destroy(); } [별도 조건식 없음]

## H-6effadd8abbf

**@callback:EditorView.updateListener.of** · [src/ui/touch-source-editor.tsx:108](../../../src/ui/touch-source-editor.tsx#L108)

분기 조건과 가능한 갈림길:

- B-4d6c83cd6e6d · IfStatement · update.docChanged → truthy / falsy; 바깥 조건: 별도 조건식 없음 (109행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 109행 | truthy: update.docChanged | callbacks.current.onChange(update.state.doc.toString())<br>call |
| 109행 | truthy: update.docChanged | update.state.doc.toString()<br>call |

## H-dd5e0839b459

**@callback:useEffect** · [src/ui/touch-source-editor.tsx:143](../../../src/ui/touch-source-editor.tsx#L143)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 145행 | 별도 조건식 없음 | compartments.language.reconfigure(syntaxLanguage(language))<br>call |
| 145행 | 별도 조건식 없음 | syntaxLanguage(language)<br>call → [H-c228d117a95a](ui__touch-source-editor.md#h-c228d117a95a) |

## H-57454355e1f3

**@callback:useEffect** · [src/ui/touch-source-editor.tsx:148](../../../src/ui/touch-source-editor.tsx#L148)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 150행 | 별도 조건식 없음 | compartments.readonly.reconfigure([ EditorState.readOnly.of(readOnly), EditorView.editable.of(!readOnly), ])<br>call |
| 151행 | 별도 조건식 없음 | EditorState.readOnly.of(readOnly)<br>call |
| 152행 | 별도 조건식 없음 | EditorView.editable.of(!readOnly)<br>call |

## H-a56d5c6313c9

**@callback:useEffect** · [src/ui/touch-source-editor.tsx:156](../../../src/ui/touch-source-editor.tsx#L156)

분기 조건과 가능한 갈림길:

- B-907ca0e44ce5 · ConditionalExpression · tabMovesFocus → truthy / falsy; 바깥 조건: 별도 조건식 없음 (158행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 158행 | 별도 조건식 없음 | compartments.tab.reconfigure(keymap.of(tabMovesFocus ? [] : [indentWithTab]))<br>call |
| 158행 | 별도 조건식 없음 | keymap.of(tabMovesFocus ? [] : [indentWithTab])<br>call |

## H-ee48d8602bb8

**@callback:useEffect** · [src/ui/touch-source-editor.tsx:161](../../../src/ui/touch-source-editor.tsx#L161)

분기 조건과 가능한 갈림길:

- B-27772537daf2 · IfStatement · editor && editor.state.doc.toString() !== value → truthy / falsy; 바깥 조건: 별도 조건식 없음 (163행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 163행 | truthy: editor | editor.state.doc.toString()<br>call |
| 164행 | truthy: editor && editor.state.doc.toString() !== value | editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: value }, })<br>call |

## H-e70e767f0985

**@callback:useEffect** · [src/ui/touch-source-editor.tsx:168](../../../src/ui/touch-source-editor.tsx#L168)

분기 조건과 가능한 갈림길:

- B-c147694f1477 · IfStatement · !editor → truthy / falsy; 바깥 조건: 별도 조건식 없음 (170행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 176행 | 별도 조건식 없음 | editor.dispatch(setDiagnostics( editor.state, syntax.diagnostics.map((issue) => ({ from: offset(issue.startLineNumber, issue.startColumn), to: offset(issue.endLineNumber, issue.endColumn), severity: 'error', message: issue.message, })), ))<br>call |
| 177행 | 별도 조건식 없음 | setDiagnostics(editor.state, syntax.diagnostics.map((issue) => ({ from: offset(issue.startLineNumber, issue.startColumn), to: offset(issue.endLineNumber, issue.endColumn), severity: 'error', message: issue.message, })))<br>state-update |
| 179행 | 별도 조건식 없음 | syntax.diagnostics.map((issue) => ({ from: offset(issue.startLineNumber, issue.startColumn), to: offset(issue.endLineNumber, issue.endColumn), severity: 'error', message: issue.message, }))<br>call<br>전달 콜백: H-f06af0b11673 |

반환/조기 중단: 170행 <render> [truthy: !editor]

## H-9a0cddd64674

**offset** · [src/ui/touch-source-editor.tsx:172](../../../src/ui/touch-source-editor.tsx#L172)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 173행 | 별도 조건식 없음 | doc.line(Math.max(1, Math.min(doc.lines, line)))<br>call |
| 173행 | 별도 조건식 없음 | Math.max(1, Math.min(doc.lines, line))<br>call |
| 173행 | 별도 조건식 없음 | Math.min(doc.lines, line)<br>call |
| 174행 | 별도 조건식 없음 | Math.min(row.to, row.from + Math.max(0, column - 1))<br>call |
| 174행 | 별도 조건식 없음 | Math.max(0, column - 1)<br>call |

반환/조기 중단: 174행 Math.min(row.to, row.from + Math.max(0, column - 1)) [별도 조건식 없음]

## H-f06af0b11673

**@callback:syntax.diagnostics.map** · [src/ui/touch-source-editor.tsx:179](../../../src/ui/touch-source-editor.tsx#L179)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 180행 | 별도 조건식 없음 | offset(issue.startLineNumber, issue.startColumn)<br>call → [H-9a0cddd64674](ui__touch-source-editor.md#h-9a0cddd64674) |
| 181행 | 별도 조건식 없음 | offset(issue.endLineNumber, issue.endColumn)<br>call → [H-9a0cddd64674](ui__touch-source-editor.md#h-9a0cddd64674) |

## H-2cc5e4facfc0

**command** · [src/ui/touch-source-editor.tsx:188](../../../src/ui/touch-source-editor.tsx#L188)

분기 조건과 가능한 갈림길:

- B-073d7c7fa982 · IfStatement · view.current && !readOnly → truthy / falsy; 바깥 조건: 별도 조건식 없음 (189행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 190행 | truthy: view.current && !readOnly | action(view.current)<br>call |
| 191행 | truthy: view.current && !readOnly | view.current.focus()<br>input-control |

## H-6af757bab85a

**insertMain** · [src/ui/touch-source-editor.tsx:194](../../../src/ui/touch-source-editor.tsx#L194)

분기 조건과 가능한 갈림길:

- B-0b22822de2f5 · IfStatement · !editor || readOnly → truthy / falsy; 바깥 조건: 별도 조건식 없음 (196행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 198행 | 별도 조건식 없음 | snippet(mainTemplate(language, editor.state.doc.toString()))(editor, null, selection.from, selection.to)<br>call |
| 198행 | 별도 조건식 없음 | snippet(mainTemplate(language, editor.state.doc.toString()))<br>call |
| 198행 | 별도 조건식 없음 | mainTemplate(language, editor.state.doc.toString())<br>call → [H-184ec50b59ea](ui__touch-source-editor.md#h-184ec50b59ea) |
| 198행 | 별도 조건식 없음 | editor.state.doc.toString()<br>call |
| 204행 | 별도 조건식 없음 | editor.focus()<br>input-control |

반환/조기 중단: 196행 <render> [truthy: !editor || readOnly]

## H-9da4d2ea1b69

**@onMouseDown** · [src/ui/touch-source-editor.tsx:213](../../../src/ui/touch-source-editor.tsx#L213)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 213행 | 별도 조건식 없음 | event.preventDefault()<br>input-control |

## H-3b95d0fb9d10

**@onClick** · [src/ui/touch-source-editor.tsx:214](../../../src/ui/touch-source-editor.tsx#L214)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 214행 | 별도 조건식 없음 | command(indentMore)<br>call → [H-2cc5e4facfc0](ui__touch-source-editor.md#h-2cc5e4facfc0) |

## H-605a92b8a58e

**@onMouseDown** · [src/ui/touch-source-editor.tsx:221](../../../src/ui/touch-source-editor.tsx#L221)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 221행 | 별도 조건식 없음 | event.preventDefault()<br>input-control |

## H-749db0c9e933

**@onClick** · [src/ui/touch-source-editor.tsx:222](../../../src/ui/touch-source-editor.tsx#L222)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 222행 | 별도 조건식 없음 | command(indentLess)<br>call → [H-2cc5e4facfc0](ui__touch-source-editor.md#h-2cc5e4facfc0) |

## H-7f62fa1f5b21

**@onMouseDown** · [src/ui/touch-source-editor.tsx:229](../../../src/ui/touch-source-editor.tsx#L229)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 229행 | 별도 조건식 없음 | event.preventDefault()<br>input-control |

## H-8bb1dcc4b45a

**@onClick** · [src/ui/touch-source-editor.tsx:230](../../../src/ui/touch-source-editor.tsx#L230)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 230행 | 별도 조건식 없음 | command(toggleComment)<br>call → [H-2cc5e4facfc0](ui__touch-source-editor.md#h-2cc5e4facfc0) |

## H-64c42f6a85d1

**@onMouseDown** · [src/ui/touch-source-editor.tsx:237](../../../src/ui/touch-source-editor.tsx#L237)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 237행 | 별도 조건식 없음 | event.preventDefault()<br>input-control |

## H-aa89edf2ba3e

**@onMouseDown** · [src/ui/touch-source-editor.tsx:245](../../../src/ui/touch-source-editor.tsx#L245)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 245행 | 별도 조건식 없음 | event.preventDefault()<br>input-control |

## H-b38f31817f09

**@onClick** · [src/ui/touch-source-editor.tsx:246](../../../src/ui/touch-source-editor.tsx#L246)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 246행 | 별도 조건식 없음 | command(undo)<br>call → [H-2cc5e4facfc0](ui__touch-source-editor.md#h-2cc5e4facfc0) |

## H-295e907885ad

**@onMouseDown** · [src/ui/touch-source-editor.tsx:253](../../../src/ui/touch-source-editor.tsx#L253)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 253행 | 별도 조건식 없음 | event.preventDefault()<br>input-control |

## H-86cda52e1824

**@onClick** · [src/ui/touch-source-editor.tsx:254](../../../src/ui/touch-source-editor.tsx#L254)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 254행 | 별도 조건식 없음 | command(redo)<br>call → [H-2cc5e4facfc0](ui__touch-source-editor.md#h-2cc5e4facfc0) |

## H-6e4b060d1125

**@onChange** · [src/ui/touch-source-editor.tsx:261](../../../src/ui/touch-source-editor.tsx#L261)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 261행 | 별도 조건식 없음 | setTabMovesFocus(event.target.checked)<br>state-update |

