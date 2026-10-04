# src/ui/monaco-source-editor.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-54acfa487d04

**languageId** · [src/ui/monaco-source-editor.tsx:24](../../../src/ui/monaco-source-editor.tsx#L24)

분기 조건과 가능한 갈림길:

- B-8badbe5683c1 · ConditionalExpression · language === 'c' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (24행).

## H-e97c9e8ed394

**MonacoSourceEditor** · [src/ui/monaco-source-editor.tsx:55](../../../src/ui/monaco-source-editor.tsx#L55)

분기 조건과 가능한 갈림길:

- B-cb1c4ee8f29f · ConditionalExpression · plainInput → truthy / falsy; 바깥 조건: 별도 조건식 없음 (233행).
- B-58930488718e · ConditionalExpression · plainInput → truthy / falsy; 바깥 조건: 별도 조건식 없음 (248행).
- B-9a504baa3098 · ConditionalExpression · syntax === 'checking' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (275행).
- B-a23ae61de7d9 · ConditionalExpression · syntax === 'empty' → truthy / falsy; 바깥 조건: falsy: syntax === 'checking' (277행).
- B-d390ac16335d · ConditionalExpression · syntax === 'unavailable' → truthy / falsy; 바깥 조건: falsy: syntax === 'checking' ∧ falsy: syntax === 'empty' (279행).
- B-82dda013dcae · ConditionalExpression · diagnostics.length → truthy / falsy; 바깥 조건: falsy: syntax === 'checking' ∧ falsy: syntax === 'empty' ∧ falsy: syntax === 'unavailable' (281행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 68행 | 별도 조건식 없음 | useRef(null)<br>call |
| 69행 | 별도 조건식 없음 | useRef(null)<br>call |
| 70행 | 별도 조건식 없음 | useRef({ onChange, onRun })<br>call |
| 74행 | 별도 조건식 없음 | useState(() => typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches)<br>call<br>전달 콜백: H-02b4ef90677a |
| 77행 | 별도 조건식 없음 | useRef(null)<br>call |
| 78행 | 별도 조건식 없음 | useState(false)<br>call |
| 79행 | 별도 조건식 없음 | useRef(null)<br>call |
| 80행 | 별도 조건식 없음 | useRef(0)<br>call |
| 81행 | 별도 조건식 없음 | useRef(false)<br>call |
| 82행 | 별도 조건식 없음 | useState('empty')<br>call |
| 83행 | 별도 조건식 없음 | useState([])<br>call |
| 84행 | 별도 조건식 없음 | useState(0)<br>call |
| 85행 | 별도 조건식 없음 | useRef({ value, language, readOnly })<br>call |
| 86행 | 별도 조건식 없음 | useEffect(() => { if (!host.current \|\| plainInput) return; const { value, language, readOnly } = initial.current; let instance: monaco.editor.IStandaloneCodeEditor; try { instance = monaco.editor.create(host.current, { value, language: languageId(language), ariaLabel: '소스 코드', automaticLayout: true, fontSize: 16, fontFamily: 'ui-monospace, SFMono-Regular, monospace', tabSize: 4, insertSpaces: true, autoIndent: 'full', autoClosingBrackets: 'always', autoClosingQuotes: 'always', autoSurround: 'languageDefined', bracketPairColorization: { enabled: true }, minimap: { enabled: false }, lineNumbers: 'on', scrollBeyondLastLine: false, wordWrap: 'off', readOnly, fixedOverflowWidgets: true, accessibilitySuppor … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-50b3e60d3909 |
| 157행 | 별도 조건식 없음 | useEffect(() => { const model = editor.current?.getModel(); if (model && model.getLanguageId() !== languageId(language)) monaco.editor.setModelLanguage(model, languageId(language)); }, [language])<br>call<br>전달 콜백: H-c3b23278bf3b |
| 162행 | 별도 조건식 없음 | useEffect(() => { editor.current?.updateOptions({ readOnly }); }, [readOnly])<br>call<br>전달 콜백: H-e5af31d1f694 |
| 165행 | 별도 조건식 없음 | useEffect(() => { const model = editor.current?.getModel(); if (model && editor.current && editor.current.getValue() !== value) editor.current.executeEdits('restore', [{ range: model.getFullModelRange(), text: value }]); }, [value])<br>call<br>전달 콜백: H-bf01affca6c3 |
| 171행 | 별도 조건식 없음 | useEffect(() => { checkUnavailable.current = false; let worker: Worker; try { worker = new SyntaxWorker(); } catch { checkUnavailable.current = true; setSyntax('unavailable'); return; } checker.current = worker; worker.onmessage = ( event: MessageEvent<{ id: number; diagnostics?: SyntaxDiagnostic[]; unavailable?: boolean }>, ) => { if (event.data.id !== checkId.current) return; const model = editor.current?.getModel(); const issues = event.data.diagnostics ?? []; checkUnavailable.current = Boolean(event.data.unavailable); setDiagnostics(issues); setSyntax(event.data.unavailable ? 'unavailable' : 'ready'); if (model) monaco.editor.setModelMarkers( model, 'study-syntax', issues.map((issue) => ({ ...issu … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-5da5f332982b |
| 212행 | 별도 조건식 없음 | useEffect(() => { const id = ++checkId.current; const model = editor.current?.getModel(); if (model) monaco.editor.setModelMarkers(model, 'study-syntax', []); setDiagnostics([]); setSyntax(value.trim() ? (checkUnavailable.current ? 'unavailable' : 'checking') : 'empty'); if (!value.trim() \|\| checkUnavailable.current) return; const timer = setTimeout(() => { try { checker.current?.postMessage({ id, code: value, language }); } catch { checkUnavailable.current = true; setSyntax('unavailable'); } }, 350); return () => clearTimeout(timer); }, [value, language, retry])<br>call<br>전달 콜백: H-0908af90a736 |
| 295행 | truthy: diagnostics.length > 0 | occurrenceRows(diagnostics, issue => JSON.stringify(issue)).map(({value: issue, key}) => ( <li key={key}> <Button variant="quiet" onClick={() => { if (plain.current) { const lines = value.split('\n'); const start = lines .slice(0, issue.startLineNumber - 1) .reduce((sum, line) => sum + line.length + 1, 0) + issue.startColumn - 1; plain.current.focus(); plain.current.setSelectionRange(start, start); } const instance = editor.current; instance?.setPosition({ lineNumber: issue.startLineNumber, column: issue.startColumn, }); instance?.revealLineInCenter(issue.startLineNumber); instance?.focus(); }} > {issue.startLineNumber}행 {issue.startColumn}열: {issue.message} </Button> </li> ))<br>call<br>전달 콜백: H-72f75a87f74a |
| 295행 | truthy: diagnostics.length > 0 | occurrenceRows(diagnostics, issue => JSON.stringify(issue))<br>call<br>전달 콜백: H-597448b3f579 |

반환/조기 중단: 229행 <render> [별도 조건식 없음]

## H-02b4ef90677a

**@callback:useState** · [src/ui/monaco-source-editor.tsx:75](../../../src/ui/monaco-source-editor.tsx#L75)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 75행 | truthy: typeof matchMedia === 'function' | matchMedia('(pointer: coarse)')<br>call |

## H-50b3e60d3909

**@callback:useEffect** · [src/ui/monaco-source-editor.tsx:86](../../../src/ui/monaco-source-editor.tsx#L86)

분기 조건과 가능한 갈림길:

- B-15ea6328ba67 · IfStatement · !host.current || plainInput → truthy / falsy; 바깥 조건: 별도 조건식 없음 (87행).
- B-16ded10395eb · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (90행).
- B-280dec8e5dda · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (117행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 91행 | 별도 조건식 없음 | monaco.editor.create(host.current, { value, language: languageId(language), ariaLabel: '소스 코드', automaticLayout: true, fontSize: 16, fontFamily: 'ui-monospace, SFMono-Regular, monospace', tabSize: 4, insertSpaces: true, autoIndent: 'full', autoClosingBrackets: 'always', autoClosingQuotes: 'always', autoSurround: 'languageDefined', bracketPairColorization: { enabled: true }, minimap: { enabled: false }, lineNumbers: 'on', scrollBeyondLastLine: false, wordWrap: 'off', readOnly, fixedOverflowWidgets: true, accessibilitySupport: 'on', editContext: false, quickSuggestions: true, snippetSuggestions: 'top', tabCompletion: 'on', })<br>call |
| 93행 | 별도 조건식 없음 | languageId(language)<br>call → [H-54acfa487d04](ui__monaco-source-editor.md#h-54acfa487d04) |
| 118행 | exception: exception | setPlainInput(true)<br>state-update |
| 122행 | 별도 조건식 없음 | instance.onDidChangeModelContent(() => callbacks.current.onChange(instance.getValue()))<br>call<br>전달 콜백: H-84f053fadc52 |
| 125행 | 별도 조건식 없음 | instance.addAction({ id: 'study-run-code', label: '코드 실행', keybindings: [monaco.KeyMod.CtrlCmd \| monaco.KeyCode.Enter], run: () => callbacks.current.onRun(), })<br>call |
| 138행 | 별도 조건식 없음 | applyTheme()<br>call → [H-559a9a38a009](ui__monaco-source-editor.md#h-559a9a38a009) |
| 140행 | 별도 조건식 없음 | observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'], })<br>call |
| 144행 | 별도 조건식 없음 | matchMedia('(prefers-color-scheme: dark)')<br>call |
| 145행 | 별도 조건식 없음 | media.addEventListener('change', applyTheme)<br>call<br>전달 콜백: H-559a9a38a009 |

반환/조기 중단: 87행 <render> [truthy: !host.current || plainInput]; 119행 <render> [exception: exception]; 146행 () => { change.dispose(); action.dispose(); observer.disconnect(); media.removeEventListener('change', applyTheme); instance.getModel()?.dispose(); instance.dispose(); editor.current = null; } [별도 조건식 없음]

## H-84f053fadc52

**@callback:instance.onDidChangeModelContent** · [src/ui/monaco-source-editor.tsx:122](../../../src/ui/monaco-source-editor.tsx#L122)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 123행 | 별도 조건식 없음 | callbacks.current.onChange(instance.getValue())<br>call |
| 123행 | 별도 조건식 없음 | instance.getValue()<br>call |

## H-bef2ce510c91

**run** · [src/ui/monaco-source-editor.tsx:129](../../../src/ui/monaco-source-editor.tsx#L129)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 129행 | 별도 조건식 없음 | callbacks.current.onRun()<br>call |

## H-559a9a38a009

**applyTheme** · [src/ui/monaco-source-editor.tsx:131](../../../src/ui/monaco-source-editor.tsx#L131)

분기 조건과 가능한 갈림길:

- B-dc630d6262d8 · ConditionalExpression · dark → truthy / falsy; 바깥 조건: 별도 조건식 없음 (136행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 135행 | falsy: document.documentElement.dataset.theme === 'dark' ∧ truthy: !document.documentElement.dataset.theme | matchMedia('(prefers-color-scheme: dark)')<br>call |
| 136행 | 별도 조건식 없음 | monaco.editor.setTheme(dark ? 'vs-dark' : 'vs')<br>call |

## H-c3b23278bf3b

**@callback:useEffect** · [src/ui/monaco-source-editor.tsx:157](../../../src/ui/monaco-source-editor.tsx#L157)

분기 조건과 가능한 갈림길:

- B-a00f92414633 · IfStatement · model && model.getLanguageId() !== languageId(language) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (159행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 159행 | truthy: model | model.getLanguageId()<br>call |
| 159행 | truthy: model | languageId(language)<br>call → [H-54acfa487d04](ui__monaco-source-editor.md#h-54acfa487d04) |
| 160행 | truthy: model && model.getLanguageId() !== languageId(language) | monaco.editor.setModelLanguage(model, languageId(language))<br>call |
| 160행 | truthy: model && model.getLanguageId() !== languageId(language) | languageId(language)<br>call → [H-54acfa487d04](ui__monaco-source-editor.md#h-54acfa487d04) |

## H-e5af31d1f694

**@callback:useEffect** · [src/ui/monaco-source-editor.tsx:162](../../../src/ui/monaco-source-editor.tsx#L162)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-bf01affca6c3

**@callback:useEffect** · [src/ui/monaco-source-editor.tsx:165](../../../src/ui/monaco-source-editor.tsx#L165)

분기 조건과 가능한 갈림길:

- B-88d8a4f06f65 · IfStatement · model && editor.current && editor.current.getValue() !== value → truthy / falsy; 바깥 조건: 별도 조건식 없음 (167행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 167행 | truthy: model && editor.current | editor.current.getValue()<br>call |
| 168행 | truthy: model && editor.current && editor.current.getValue() !== value | editor.current.executeEdits('restore', [{ range: model.getFullModelRange(), text: value }])<br>call |
| 168행 | truthy: model && editor.current && editor.current.getValue() !== value | model.getFullModelRange()<br>call |

## H-5da5f332982b

**@callback:useEffect** · [src/ui/monaco-source-editor.tsx:171](../../../src/ui/monaco-source-editor.tsx#L171)

분기 조건과 가능한 갈림길:

- B-7fe4581849c8 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (174행).
- B-917027cb2c46 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (176행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 178행 | exception: exception | setSyntax('unavailable')<br>state-update |

반환/조기 중단: 179행 <render> [exception: exception]; 206행 () => { checker.current = null; worker.terminate(); } [별도 조건식 없음]

## H-0908af90a736

**@callback:useEffect** · [src/ui/monaco-source-editor.tsx:212](../../../src/ui/monaco-source-editor.tsx#L212)

분기 조건과 가능한 갈림길:

- B-7a1a6323f11a · IfStatement · model → truthy / falsy; 바깥 조건: 별도 조건식 없음 (215행).
- B-fe9fb673f350 · ConditionalExpression · value.trim() → truthy / falsy; 바깥 조건: 별도 조건식 없음 (217행).
- B-c4d8bac05d37 · ConditionalExpression · checkUnavailable.current → truthy / falsy; 바깥 조건: truthy: value.trim() (217행).
- B-e4987003f148 · IfStatement · !value.trim() || checkUnavailable.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (218행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 215행 | truthy: model | monaco.editor.setModelMarkers(model, 'study-syntax', [])<br>call |
| 216행 | 별도 조건식 없음 | setDiagnostics([])<br>state-update |
| 217행 | 별도 조건식 없음 | setSyntax(value.trim() ? (checkUnavailable.current ? 'unavailable' : 'checking') : 'empty')<br>state-update |
| 217행 | 별도 조건식 없음 | value.trim()<br>call |
| 218행 | 별도 조건식 없음 | value.trim()<br>call |
| 219행 | 별도 조건식 없음 | setTimeout(() => { try { checker.current?.postMessage({ id, code: value, language }); } catch { checkUnavailable.current = true; setSyntax('unavailable'); } }, 350)<br>state-update<br>전달 콜백: H-db0773c01376 |

반환/조기 중단: 218행 <render> [truthy: !value.trim() || checkUnavailable.current]; 227행 () => clearTimeout(timer) [별도 조건식 없음]

## H-db0773c01376

**@callback:setTimeout** · [src/ui/monaco-source-editor.tsx:219](../../../src/ui/monaco-source-editor.tsx#L219)

분기 조건과 가능한 갈림길:

- B-e140642e3e2c · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (220행).
- B-b5966c51e8bd · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (222행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 224행 | exception: exception | setSyntax('unavailable')<br>state-update |

## H-e668ccf2bedb

**@onChange** · [src/ui/monaco-source-editor.tsx:241](../../../src/ui/monaco-source-editor.tsx#L241)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 242행 | truthy: !plainInput | setTabMovesFocus(event.target.checked)<br>state-update |

## H-5d467f898c82

**@onChange** · [src/ui/monaco-source-editor.tsx:258](../../../src/ui/monaco-source-editor.tsx#L258)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 258행 | truthy: plainInput | onChange(event.target.value)<br>call |

## H-a3d69d75aecd

**@onKeyDown** · [src/ui/monaco-source-editor.tsx:259](../../../src/ui/monaco-source-editor.tsx#L259)

분기 조건과 가능한 갈림길:

- B-af5b85dbcfe7 · IfStatement · (event.metaKey || event.ctrlKey) && event.key === 'Enter' && !event.nativeEvent.isComposing → truthy / falsy; 바깥 조건: truthy: plainInput (260행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 265행 | truthy: plainInput ∧ truthy: (event.metaKey \|\| event.ctrlKey) &&<br>              event.key === 'Enter' &&<br>              !event.nativeEvent.isComposing | event.preventDefault()<br>input-control |
| 266행 | truthy: plainInput ∧ truthy: (event.metaKey \|\| event.ctrlKey) &&<br>              event.key === 'Enter' &&<br>              !event.nativeEvent.isComposing | onRun()<br>call |

## H-a0ecf7e78c9d

**@onClick** · [src/ui/monaco-source-editor.tsx:286](../../../src/ui/monaco-source-editor.tsx#L286)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 286행 | truthy: syntax === 'unavailable' | setRetry((value) => value + 1)<br>state-update<br>전달 콜백: H-2eabc9fc57cf |

## H-2eabc9fc57cf

**@callback:setRetry** · [src/ui/monaco-source-editor.tsx:286](../../../src/ui/monaco-source-editor.tsx#L286)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-597448b3f579

**@callback:occurrenceRows** · [src/ui/monaco-source-editor.tsx:295](../../../src/ui/monaco-source-editor.tsx#L295)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 295행 | truthy: diagnostics.length > 0 | JSON.stringify(issue)<br>call |

## H-72f75a87f74a

**@callback:occurrenceRows(diagnostics, issue => JSON.stringify(issue)).map** · [src/ui/monaco-source-editor.tsx:295](../../../src/ui/monaco-source-editor.tsx#L295)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b4d8f932fa76

**@onClick** · [src/ui/monaco-source-editor.tsx:299](../../../src/ui/monaco-source-editor.tsx#L299)

분기 조건과 가능한 갈림길:

- B-ac795cfecac1 · IfStatement · plain.current → truthy / falsy; 바깥 조건: truthy: diagnostics.length > 0 (300행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 301행 | truthy: diagnostics.length > 0 ∧ truthy: plain.current | value.split('\n')<br>call |
| 303행 | truthy: diagnostics.length > 0 ∧ truthy: plain.current | lines<br>                          .slice(0, issue.startLineNumber - 1)<br>                          .reduce((sum, line) => sum + line.length + 1, 0)<br>call<br>전달 콜백: H-46e2e3f50b08 |
| 303행 | truthy: diagnostics.length > 0 ∧ truthy: plain.current | lines<br>                          .slice(0, issue.startLineNumber - 1)<br>call |
| 308행 | truthy: diagnostics.length > 0 ∧ truthy: plain.current | plain.current.focus()<br>input-control |
| 309행 | truthy: diagnostics.length > 0 ∧ truthy: plain.current | plain.current.setSelectionRange(start, start)<br>call |

## H-46e2e3f50b08

**@callback:lines
                          .slice(0, issue.startLineNumber - 1)
                          .reduce** · [src/ui/monaco-source-editor.tsx:305](../../../src/ui/monaco-source-editor.tsx#L305)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

