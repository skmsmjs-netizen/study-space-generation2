# src/ui/memo-ink-pad.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-39275ecb3bf1

**MemoInkPad** · [src/ui/memo-ink-pad.tsx:53](../../../src/ui/memo-ink-pad.tsx#L53)

분기 조건과 가능한 갈림길:

- B-560bcd736fa6 · ConditionalExpression · documentKey → truthy / falsy; 바깥 조건: 별도 조건식 없음 (82행).
- B-8f9589a01134 · IfStatement · controller → truthy / falsy; 바깥 조건: 별도 조건식 없음 (234행).
- B-d7d68531e44f · ConditionalExpression · expanded → truthy / falsy; 바깥 조건: 별도 조건식 없음 (450행).
- B-6ddac06f01b6 · ConditionalExpression · whole → truthy / falsy; 바깥 조건: truthy: tool === 'eraser' (514행).
- B-76934ac3dfed · ConditionalExpression · expanded → truthy / falsy; 바깥 조건: 별도 조건식 없음 (590행).
- B-1a51d7d0333f · ConditionalExpression · prefs.pressure → truthy / falsy; 바깥 조건: 별도 조건식 없음 (612행).
- B-2898f5a8434a · ConditionalExpression · prefs.pressure → truthy / falsy; 바깥 조건: 별도 조건식 없음 (613행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 83행 | 별도 조건식 없음 | useState(() => repository ? inkSync(repository, onWorkspaceSaved) : null)<br>call<br>전달 콜백: H-0488ae93f7bd |
| 84행 | 별도 조건식 없음 | useState(() => { const errors: string[] = []; let prefs = { ...defaultInkPreferences }, view = defaultInkWorkspace(strokes); try { const remote = sync?.read(preferencesKey); if (remote?.kind === 'preferences') { prefs = remote.value; writeInkPreferences(preferencesKey,prefs); } else prefs = readInkPreferences(preferencesKey); } catch (e) { errors.push(e instanceof Error ? e.message : '필기 설정을 읽지 못했습니다.'); } try { const remote = sync?.read(historyKey); if (remote?.kind === 'document') writeInkWorkspace(historyKey,remote.value); view = readInkWorkspace(historyKey, strokes); } catch (e) { errors.push(e instanceof Error ? e.message : '필기 이력을 읽지 못했습니다.'); } view.pages = Math.max(view.pages, inkPageCount(st … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-3e0b89d426f4 |
| 105행 | 별도 조건식 없음 | useState(initial.prefs)<br>call |
| 106행 | 별도 조건식 없음 | useState(initial.view)<br>call |
| 107행 | 별도 조건식 없음 | useState('pen')<br>call |
| 108행 | 별도 조건식 없음 | useState(false)<br>call |
| 109행 | 별도 조건식 없음 | useState(false)<br>call |
| 110행 | 별도 조건식 없음 | useState([])<br>call |
| 111행 | 별도 조건식 없음 | useState(null)<br>call |
| 112행 | 별도 조건식 없음 | useState(false)<br>call |
| 113행 | 별도 조건식 없음 | useState('box')<br>call |
| 114행 | 별도 조건식 없음 | useRef(null)<br>call |
| 115행 | 별도 조건식 없음 | useState(initial.error)<br>call |
| 116행 | 별도 조건식 없음 | useState(false)<br>call |
| 117행 | 별도 조건식 없음 | useRef(Boolean(initial.error))<br>call |
| 117행 | 별도 조건식 없음 | Boolean(initial.error)<br>call |
| 118행 | 별도 조건식 없음 | useRef(false)<br>call |
| 119행 | 별도 조건식 없음 | useRef(null)<br>call |
| 120행 | 별도 조건식 없음 | useRef(null)<br>call |
| 121행 | 별도 조건식 없음 | useRef(null)<br>call |
| 122행 | 별도 조건식 없음 | useRef(null)<br>call |
| 123행 | 별도 조건식 없음 | useRef(null)<br>call |
| 124행 | 별도 조건식 없음 | useRef(null)<br>call |
| 125행 | 별도 조건식 없음 | useRef(new Map<number, { x: number; y: number }>())<br>call |
| 126행 | 별도 조건식 없음 | useRef(null)<br>call |
| 127행 | 별도 조건식 없음 | useRef({ strokes, onChange, onDrawing, prefs, view, tool, whole, selection, disabled, })<br>call |
| 178행 | 별도 조건식 없음 | useEffect(() => { onPageChange?.(view.page); }, [view.page, onPageChange])<br>call<br>전달 콜백: H-fcb57c53dcd8 |
| 232행 | 별도 조건식 없음 | useRef({ finish, persist })<br>call |
| 235행 | 별도 조건식 없음 | useEffect(() => { const flush = () => { operations.current.finish(); operations.current.persist(); }; const hidden = () => { if (document.visibilityState === 'hidden') flush(); }; window.addEventListener('beforeunload', flush); window.addEventListener('pagehide', flush); document.addEventListener('visibilitychange', hidden); return () => { window.removeEventListener('beforeunload', flush); window.removeEventListener('pagehide', flush); document.removeEventListener('visibilitychange', hidden); flush(); if (raf.current !== null) cancelAnimationFrame(raf.current); }; }, [])<br>call<br>전달 콜백: H-f07503787a4e |
| 431행 | 별도 조건식 없음 | Math.max(view.pages, inkPageCount(strokes), minimumPages)<br>call |
| 431행 | 별도 조건식 없음 | inkPageCount(strokes)<br>call |
| 432행 | 별도 조건식 없음 | inkBounds(strokes.filter((s) => selection.includes(s.id) && strokePage(s) === view.page))<br>call |
| 433행 | 별도 조건식 없음 | strokes.filter((s) => selection.includes(s.id) && strokePage(s) === view.page)<br>call<br>전달 콜백: H-b0ae12a18ea8 |
| 444행 | 별도 조건식 없음 | useEffectEvent(() => { if (minimumPages > current.current.view.pages) changeView({pages:minimumPages}); })<br>call<br>전달 콜백: H-d410c2d479eb |
| 446행 | 별도 조건식 없음 | useEffect(() => { expandForDocument(); }, [minimumPages])<br>call<br>전달 콜백: H-3bf762c006f5 |
| 505행 | 별도 조건식 없음 | [2, 3, 5, 8].map((width, i) => ( <option key={width} value={width}> {['가는 선', '보통', '굵은 선', '아주 굵은 선'][i]} </option> ))<br>call<br>전달 콜백: H-ed26b03f8ff0 |
| 537행 | 별도 조건식 없음 | [<br>            ...new Set([<br>              0,<br>              view.page,<br>              Math.max(0, view.page - 1),<br>              Math.min(pages - 1, view.page + 1),<br>              pages - 1,<br>              ...strokes.map(strokePage),<br>            ]),<br>          ]<br>            .sort((a, b) => a - b)<br>            .map((page) => ( <option key={`page-${page}`} value={page}> {page + 1} / {pages}쪽 </option> ))<br>call<br>전달 콜백: H-26c0b97e92e8 |
| 537행 | 별도 조건식 없음 | [<br>            ...new Set([<br>              0,<br>              view.page,<br>              Math.max(0, view.page - 1),<br>              Math.min(pages - 1, view.page + 1),<br>              pages - 1,<br>              ...strokes.map(strokePage),<br>            ]),<br>          ]<br>            .sort((a, b) => a - b)<br>call<br>전달 콜백: H-940dbae795bc |
| 541행 | 별도 조건식 없음 | Math.max(0, view.page - 1)<br>call |
| 542행 | 별도 조건식 없음 | Math.min(pages - 1, view.page + 1)<br>call |
| 544행 | 별도 조건식 없음 | strokes.map(strokePage)<br>call |
| 575행 | 별도 조건식 없음 | Math.round(view.zoom * 100)<br>call |
| 623행 | truthy: rectangle | Math.max(1, rectangle.width)<br>call |
| 624행 | truthy: rectangle | Math.max(1, rectangle.height)<br>call |
| 647행 | truthy: tool === 'select' | [<br>              [-10, 0, '왼쪽'],<br>              [10, 0, '오른쪽'],<br>              [0, -10, '위로'],<br>              [0, 10, '아래로'],<br>            ].map(([dx, dy, name]) => ( <Button key={String(name)} disabled={locked \|\| !selection.length} onClick={() => editSelection('transform', Number(dx), Number(dy))} > {name} </Button> ))<br>call<br>전달 콜백: H-42ae73a84b74 |

반환/조기 중단: 449행 <render> [별도 조건식 없음]

## H-0488ae93f7bd

**@callback:useState** · [src/ui/memo-ink-pad.tsx:83](../../../src/ui/memo-ink-pad.tsx#L83)

분기 조건과 가능한 갈림길:

- B-ad8f2e5f1a3a · ConditionalExpression · repository → truthy / falsy; 바깥 조건: 별도 조건식 없음 (83행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 83행 | truthy: repository | inkSync(repository, onWorkspaceSaved)<br>call |

## H-3e0b89d426f4

**@callback:useState** · [src/ui/memo-ink-pad.tsx:84](../../../src/ui/memo-ink-pad.tsx#L84)

분기 조건과 가능한 갈림길:

- B-98e20f1a8bbb · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (88행).
- B-39b8ed8b8f93 · IfStatement · remote?.kind === 'preferences' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (90행).
- B-080630807c11 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (92행).
- B-0633759861c5 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (93행).
- B-368516afffe3 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (95행).
- B-508b842bd78c · IfStatement · remote?.kind === 'document' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (97행).
- B-185ef44e11f6 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (99행).
- B-336c0402b202 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (100행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 87행 | 별도 조건식 없음 | defaultInkWorkspace(strokes)<br>call |
| 90행 | truthy: remote?.kind === 'preferences' | writeInkPreferences(preferencesKey, prefs)<br>call |
| 91행 | falsy: remote?.kind === 'preferences' | readInkPreferences(preferencesKey)<br>call |
| 93행 | exception: e | errors.push(e instanceof Error ? e.message : '필기 설정을 읽지 못했습니다.')<br>call |
| 97행 | truthy: remote?.kind === 'document' | writeInkWorkspace(historyKey, remote.value)<br>call |
| 98행 | 별도 조건식 없음 | readInkWorkspace(historyKey, strokes)<br>call |
| 100행 | exception: e | errors.push(e instanceof Error ? e.message : '필기 이력을 읽지 못했습니다.')<br>call |
| 102행 | 별도 조건식 없음 | Math.max(view.pages, inkPageCount(strokes), minimumPages)<br>call |
| 102행 | 별도 조건식 없음 | inkPageCount(strokes)<br>call |
| 103행 | 별도 조건식 없음 | errors.join(' ')<br>call |

반환/조기 중단: 103행 { prefs, view, error: errors.join(' ') } [별도 조건식 없음]

## H-bd3dda9a5f22

**persist** · [src/ui/memo-ink-pad.tsx:150](../../../src/ui/memo-ink-pad.tsx#L150)

분기 조건과 가능한 갈림길:

- B-1ed3220939a6 · IfStatement · timer.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (151행).
- B-b6caabf05a90 · IfStatement · damaged.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (153행).
- B-87c626a70008 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (154행).
- B-acdba1bfc077 · IfStatement · preferencesChanged.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (156행).
- B-43145cc8cf16 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (167행).
- B-90017f31da2b · IfStatement · e && typeof e==='object' && 'code' in e && e.code==='VERSION_CONFLICT' → truthy / falsy; 바깥 조건: exception: e (168행).
- B-c7f80ab7e6cb · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: exception: e (170행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 151행 | truthy: timer.current | clearTimeout(timer.current)<br>call |
| 157행 | truthy: preferencesChanged.current | writeInkPreferences(preferencesKey, current.current.prefs)<br>call |
| 161행 | 별도 조건식 없음 | writeInkWorkspace(historyKey, { ...current.current.view, fingerprint: inkFingerprint(current.current.strokes), })<br>call |
| 163행 | 별도 조건식 없음 | inkFingerprint(current.current.strokes)<br>call |
| 165행 | 별도 조건식 없음 | inkFingerprint(current.current.strokes)<br>call |
| 166행 | 별도 조건식 없음 | setError('')<br>state-update |
| 166행 | 별도 조건식 없음 | setSyncConflict(false)<br>state-update |
| 168행 | exception: e ∧ truthy: e && typeof e==='object' && 'code' in e && e.code==='VERSION_CONFLICT' | setSyncConflict(true)<br>state-update |
| 169행 | exception: e | setError(e instanceof Error ? '필기 설정과 되돌리기 이력: ' + e.message + ' 작성 내용과 이력은 이 기기에 유지했습니다. 저장을 다시 시도해 주세요.' : '필기 설정과 되돌리기 이력을 저장하지 못했습니다. 작성 내용은 유지했습니다.')<br>state-update |

반환/조기 중단: 153행 <render> [truthy: damaged.current]

## H-3ff1236f0fd5

**schedule** · [src/ui/memo-ink-pad.tsx:174](../../../src/ui/memo-ink-pad.tsx#L174)

분기 조건과 가능한 갈림길:

- B-4296cbc66e2e · IfStatement · timer.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (175행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 175행 | truthy: timer.current | clearTimeout(timer.current)<br>call |
| 176행 | 별도 조건식 없음 | setTimeout(persist, 180)<br>state-update<br>전달 콜백: H-bd3dda9a5f22 |

## H-fcb57c53dcd8

**@callback:useEffect** · [src/ui/memo-ink-pad.tsx:178](../../../src/ui/memo-ink-pad.tsx#L178)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a43ba4a4e331

**changeView** · [src/ui/memo-ink-pad.tsx:179](../../../src/ui/memo-ink-pad.tsx#L179)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 181행 | 별도 조건식 없음 | Math.max(next.pages, minimumPages, inkPageCount(current.current.strokes), next.page + 1)<br>call |
| 181행 | 별도 조건식 없음 | inkPageCount(current.current.strokes)<br>call |
| 183행 | 별도 조건식 없음 | setView(next)<br>state-update |
| 184행 | 별도 조건식 없음 | schedule()<br>call → [H-3ff1236f0fd5](ui__memo-ink-pad.md#h-3ff1236f0fd5) |

## H-cf44b655248b

**preference** · [src/ui/memo-ink-pad.tsx:186](../../../src/ui/memo-ink-pad.tsx#L186)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 190행 | 별도 조건식 없음 | setPrefs(next)<br>state-update |
| 191행 | 별도 조건식 없음 | schedule()<br>call → [H-3ff1236f0fd5](ui__memo-ink-pad.md#h-3ff1236f0fd5) |

## H-0b45f24dd326

**emit** · [src/ui/memo-ink-pad.tsx:193](../../../src/ui/memo-ink-pad.tsx#L193)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 195행 | 별도 조건식 없음 | current.current.onChange(next)<br>call |

## H-fca8288b4d46

**commit** · [src/ui/memo-ink-pad.tsx:197](../../../src/ui/memo-ink-pad.tsx#L197)

분기 조건과 가능한 갈림길:

- B-3b3578ff7563 · IfStatement · !change → truthy / falsy; 바깥 조건: 별도 조건식 없음 (199행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 198행 | 별도 조건식 없음 | inkChange(before, after)<br>call |
| 201행 | 별도 조건식 없음 | changeView({ undo: [...current.current.view.undo, change].slice(-50), redo: [] })<br>call → [H-a43ba4a4e331](ui__memo-ink-pad.md#h-a43ba4a4e331) |
| 201행 | 별도 조건식 없음 | [...current.current.view.undo, change].slice(-50)<br>call |

반환/조기 중단: 199행 <render> [truthy: !change]

## H-e51e10de2d46

**paint** · [src/ui/memo-ink-pad.tsx:203](../../../src/ui/memo-ink-pad.tsx#L203)

분기 조건과 가능한 갈림길:

- B-302a917facad · IfStatement · raf.current !== null → truthy / falsy; 바깥 조건: 별도 조건식 없음 (204행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 205행 | 별도 조건식 없음 | requestAnimationFrame(() => { raf.current = null; const stroke = active.current?.stroke; if (stroke) live.current?.setAttribute('d', inkShape(stroke)); const points = active.current?.lasso; if (points) lassoPath.current?.setAttribute('d', points.map((p,i)=>`${i ? 'L' : 'M'}${p.x},${p.y}`).join('') + 'Z'); })<br>call<br>전달 콜백: H-65a78f7df580 |

반환/조기 중단: 204행 <render> [truthy: raf.current !== null]

## H-65a78f7df580

**@callback:requestAnimationFrame** · [src/ui/memo-ink-pad.tsx:205](../../../src/ui/memo-ink-pad.tsx#L205)

분기 조건과 가능한 갈림길:

- B-9211ffef2eaf · IfStatement · stroke → truthy / falsy; 바깥 조건: 별도 조건식 없음 (208행).
- B-6429d2102a12 · IfStatement · points → truthy / falsy; 바깥 조건: 별도 조건식 없음 (210행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 208행 | truthy: stroke | inkShape(stroke)<br>call |
| 210행 | truthy: points | points.map((p,i)=>`${i ? 'L' : 'M'}${p.x},${p.y}`).join('')<br>call |
| 210행 | truthy: points | points.map((p,i)=>`${i ? 'L' : 'M'}${p.x},${p.y}`)<br>call<br>전달 콜백: H-f699ef431e57 |

## H-f699ef431e57

**@callback:points.map** · [src/ui/memo-ink-pad.tsx:210](../../../src/ui/memo-ink-pad.tsx#L210)

분기 조건과 가능한 갈림길:

- B-4216460adaeb · ConditionalExpression · i → truthy / falsy; 바깥 조건: truthy: points (210행).

## H-2a100eba2a54

**markDrawing** · [src/ui/memo-ink-pad.tsx:213](../../../src/ui/memo-ink-pad.tsx#L213)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 214행 | 별도 조건식 없음 | setDrawing(value)<br>state-update |
| 215행 | 별도 조건식 없음 | current.current.onDrawing(value)<br>call |

## H-a05f029b5939

**finish** · [src/ui/memo-ink-pad.tsx:217](../../../src/ui/memo-ink-pad.tsx#L217)

분기 조건과 가능한 갈림길:

- B-c0e8e4a54e07 · IfStatement · !gesture → truthy / falsy; 바깥 조건: 별도 조건식 없음 (219행).
- B-613d52b53bb2 · IfStatement · gesture.lasso && gesture.lasso.length >= 3 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (221행).
- B-9c19a669f03a · IfStatement · raf.current !== null → truthy / falsy; 바깥 조건: 별도 조건식 없음 (222행).
- B-3b7c30167c2f · IfStatement · gesture.stroke → truthy / falsy; 바깥 조건: 별도 조건식 없음 (224행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 221행 | truthy: gesture.lasso && gesture.lasso.length >= 3 | setSelection(selectInkLasso(current.current.strokes, gesture.lasso, gesture.page))<br>state-update |
| 221행 | truthy: gesture.lasso && gesture.lasso.length >= 3 | selectInkLasso(current.current.strokes, gesture.lasso, gesture.page)<br>call |
| 222행 | truthy: raf.current !== null | cancelAnimationFrame(raf.current)<br>call |
| 224행 | truthy: gesture.stroke | emit([...current.current.strokes, gesture.stroke])<br>call → [H-0b45f24dd326](ui__memo-ink-pad.md#h-0b45f24dd326) |
| 225행 | 별도 조건식 없음 | commit(gesture.before, current.current.strokes)<br>mutation-request → [H-fca8288b4d46](ui__memo-ink-pad.md#h-fca8288b4d46) |
| 228행 | 별도 조건식 없음 | setBox(null)<br>state-update |
| 229행 | 별도 조건식 없음 | markDrawing(false)<br>call → [H-2a100eba2a54](ui__memo-ink-pad.md#h-2a100eba2a54) |
| 230행 | 별도 조건식 없음 | schedule()<br>call → [H-3ff1236f0fd5](ui__memo-ink-pad.md#h-3ff1236f0fd5) |

반환/조기 중단: 219행 <render> [truthy: !gesture]

## H-f07503787a4e

**@callback:useEffect** · [src/ui/memo-ink-pad.tsx:235](../../../src/ui/memo-ink-pad.tsx#L235)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 243행 | 별도 조건식 없음 | window.addEventListener('beforeunload', flush)<br>call<br>전달 콜백: H-4a06b744321b |
| 244행 | 별도 조건식 없음 | window.addEventListener('pagehide', flush)<br>call<br>전달 콜백: H-4a06b744321b |
| 245행 | 별도 조건식 없음 | document.addEventListener('visibilitychange', hidden)<br>call<br>전달 콜백: H-12fc95b58402 |

반환/조기 중단: 246행 () => { window.removeEventListener('beforeunload', flush); window.removeEventListener('pagehide', flush); document.removeEventListener('visibilitychange', hidden); flush(); if (raf.current !== null) cancelAnimationFrame(raf.current); } [별도 조건식 없음]

## H-4a06b744321b

**flush** · [src/ui/memo-ink-pad.tsx:236](../../../src/ui/memo-ink-pad.tsx#L236)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 237행 | 별도 조건식 없음 | operations.current.finish()<br>call |
| 238행 | 별도 조건식 없음 | operations.current.persist()<br>call |

## H-12fc95b58402

**hidden** · [src/ui/memo-ink-pad.tsx:240](../../../src/ui/memo-ink-pad.tsx#L240)

분기 조건과 가능한 갈림길:

- B-279cc14ce3d7 · IfStatement · document.visibilityState === 'hidden' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (241행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 241행 | truthy: document.visibilityState === 'hidden' | flush()<br>call → [H-4a06b744321b](ui__memo-ink-pad.md#h-4a06b744321b) |

## H-e8a8a6da51db

**point** · [src/ui/memo-ink-pad.tsx:254](../../../src/ui/memo-ink-pad.tsx#L254)

분기 조건과 가능한 갈림길:

- B-5d916a8952d2 · ConditionalExpression · Number.isFinite(event.pressure) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (266행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 258행 | 별도 조건식 없음 | Math.max(0, Math.min(MEMO_WIDTH, ((event.clientX - bounds.left) / bounds.width) * MEMO_WIDTH))<br>call |
| 260행 | 별도 조건식 없음 | Math.min(MEMO_WIDTH, ((event.clientX - bounds.left) / bounds.width) * MEMO_WIDTH)<br>call |
| 262행 | 별도 조건식 없음 | Math.max(0, Math.min(MEMO_HEIGHT, ((event.clientY - bounds.top) / bounds.height) * MEMO_HEIGHT))<br>call |
| 264행 | 별도 조건식 없음 | Math.min(MEMO_HEIGHT, ((event.clientY - bounds.top) / bounds.height) * MEMO_HEIGHT)<br>call |
| 266행 | 별도 조건식 없음 | Math.max(0, Math.min(1, Number.isFinite(event.pressure) ? event.pressure : 0.5))<br>call |
| 266행 | 별도 조건식 없음 | Math.min(1, Number.isFinite(event.pressure) ? event.pressure : 0.5)<br>call |
| 266행 | 별도 조건식 없음 | Number.isFinite(event.pressure)<br>call |

## H-da7e90d8d7b7

**erase** · [src/ui/memo-ink-pad.tsx:268](../../../src/ui/memo-ink-pad.tsx#L268)

분기 조건과 가능한 갈림길:

- B-976cf9b25bc3 · IfStatement · next !== current.current.strokes → truthy / falsy; 바깥 조건: 별도 조건식 없음 (276행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 269행 | 별도 조건식 없음 | eraseInk(current.current.strokes, p, (14 * MEMO_WIDTH) / bounds.width, page, current.current.whole)<br>call |
| 276행 | truthy: next !== current.current.strokes | emit(next)<br>call → [H-0b45f24dd326](ui__memo-ink-pad.md#h-0b45f24dd326) |

## H-ac67665041f0

**begin** · [src/ui/memo-ink-pad.tsx:278](../../../src/ui/memo-ink-pad.tsx#L278)

분기 조건과 가능한 갈림길:

- B-645d94d01ce9 · IfStatement · disabled || event.button !== 0 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (279행).
- B-5b1d462fcea2 · IfStatement · event.pointerType === 'touch' && !prefs.finger → truthy / falsy; 바깥 조건: 별도 조건식 없음 (280행).
- B-a8c916be223b · IfStatement · active.current → truthy / falsy; 바깥 조건: truthy: event.pointerType === 'touch' && !prefs.finger (281행).
- B-de28e44d4426 · IfStatement · touch.current.size === 2 → truthy / falsy; 바깥 조건: truthy: event.pointerType === 'touch' && !prefs.finger (285행).
- B-2557b779b6bf · IfStatement · active.current || touch.current.size → truthy / falsy; 바깥 조건: 별도 조건식 없음 (294행).
- B-fe2dedf2160e · IfStatement · tool === 'pen' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (317행).
- B-742c7aa4f85e · ConditionalExpression · page → truthy / falsy; 바깥 조건: truthy: tool === 'pen' (323행).
- B-d1f299aacd37 · ConditionalExpression · prefs.pressure → truthy / falsy; 바깥 조건: truthy: tool === 'pen' (324행).
- B-42967f21e371 · IfStatement · tool === 'eraser' → truthy / falsy; 바깥 조건: falsy: tool === 'pen' (328행).
- B-0679d1b74b0b · IfStatement · !active.current.moving → truthy / falsy; 바깥 조건: falsy: tool === 'pen' ∧ falsy: tool === 'eraser' (331행).
- B-adf587b43a24 · IfStatement · selectionShape === 'lasso' → truthy / falsy; 바깥 조건: falsy: tool === 'pen' ∧ falsy: tool === 'eraser' ∧ truthy: !active.current.moving (332행).
- B-f9e066ed8edd · ConditionalExpression · hit → truthy / falsy; 바깥 조건: falsy: tool === 'pen' ∧ falsy: tool === 'eraser' ∧ truthy: !active.current.moving (338행).
- B-e62525ff5873 · IfStatement · selectionShape === 'box' → truthy / falsy; 바깥 조건: falsy: tool === 'pen' ∧ falsy: tool === 'eraser' ∧ truthy: !active.current.moving (339행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 282행 | truthy: event.pointerType === 'touch' && !prefs.finger | event.preventDefault()<br>input-control |
| 283행 | truthy: event.pointerType === 'touch' && !prefs.finger | event.currentTarget.setPointerCapture(event.pointerId)<br>call |
| 284행 | truthy: event.pointerType === 'touch' && !prefs.finger | touch.current.set(event.pointerId, { x: event.clientX, y: event.clientY })<br>call |
| 286행 | truthy: event.pointerType === 'touch' && !prefs.finger ∧ truthy: touch.current.size === 2 | touch.current.values()<br>call |
| 288행 | truthy: event.pointerType === 'touch' && !prefs.finger ∧ truthy: touch.current.size === 2 | Math.hypot(a.x - b.x, a.y - b.y)<br>call |
| 295행 | 별도 조건식 없음 | event.preventDefault()<br>input-control |
| 296행 | 별도 조건식 없음 | event.currentTarget.setPointerCapture(event.pointerId)<br>call |
| 297행 | 별도 조건식 없음 | event.currentTarget.getBoundingClientRect()<br>call |
| 298행 | 별도 조건식 없음 | point(event.nativeEvent, bounds)<br>call → [H-e8a8a6da51db](ui__memo-ink-pad.md#h-e8a8a6da51db) |
| 300행 | 별도 조건식 없음 | inkBounds(strokes.filter((s) => selection.includes(s.id)))<br>call |
| 300행 | 별도 조건식 없음 | strokes.filter((s) => selection.includes(s.id))<br>call<br>전달 콜백: H-d64df28ce455 |
| 316행 | 별도 조건식 없음 | markDrawing(true)<br>call → [H-2a100eba2a54](ui__memo-ink-pad.md#h-2a100eba2a54) |
| 319행 | truthy: tool === 'pen' | crypto.randomUUID()<br>call |
| 326행 | truthy: tool === 'pen' | setSelection([])<br>state-update |
| 327행 | truthy: tool === 'pen' | paint()<br>call → [H-e51e10de2d46](ui__memo-ink-pad.md#h-e51e10de2d46) |
| 329행 | falsy: tool === 'pen' ∧ truthy: tool === 'eraser' | setSelection([])<br>state-update |
| 330행 | falsy: tool === 'pen' ∧ truthy: tool === 'eraser' | erase(p, bounds, page)<br>call → [H-da7e90d8d7b7](ui__memo-ink-pad.md#h-da7e90d8d7b7) |
| 335행 | falsy: tool === 'pen' ∧ falsy: tool === 'eraser' ∧ truthy: !active.current.moving | eraseInk(strokes, p, (8 * MEMO_WIDTH) / bounds.width, page, true).map((s) => s.id)<br>call<br>전달 콜백: H-7d27e497c6c5 |
| 335행 | falsy: tool === 'pen' ∧ falsy: tool === 'eraser' ∧ truthy: !active.current.moving | eraseInk(strokes, p, (8 * MEMO_WIDTH) / bounds.width, page, true)<br>call |
| 337행 | falsy: tool === 'pen' ∧ falsy: tool === 'eraser' ∧ truthy: !active.current.moving | strokes.filter((s) => strokePage(s) === page && !remaining.has(s.id)).at(-1)<br>call |
| 337행 | falsy: tool === 'pen' ∧ falsy: tool === 'eraser' ∧ truthy: !active.current.moving | strokes.filter((s) => strokePage(s) === page && !remaining.has(s.id))<br>call<br>전달 콜백: H-16974919b041 |
| 338행 | falsy: tool === 'pen' ∧ falsy: tool === 'eraser' ∧ truthy: !active.current.moving | setSelection(hit ? [hit.id] : [])<br>state-update |
| 339행 | falsy: tool === 'pen' ∧ falsy: tool === 'eraser' ∧ truthy: !active.current.moving ∧ truthy: selectionShape === 'box' | setBox({ x: p.x, y: p.y, width: 0, height: 0 })<br>state-update |

반환/조기 중단: 279행 <render> [truthy: disabled || event.button !== 0]; 281행 <render> [truthy: event.pointerType === 'touch' && !prefs.finger ∧ truthy: active.current]; 292행 <render> [truthy: event.pointerType === 'touch' && !prefs.finger]; 294행 <render> [truthy: active.current || touch.current.size]

## H-d64df28ce455

**@callback:strokes.filter** · [src/ui/memo-ink-pad.tsx:300](../../../src/ui/memo-ink-pad.tsx#L300)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 300행 | 별도 조건식 없음 | selection.includes(s.id)<br>call |

## H-7d27e497c6c5

**@callback:eraseInk(strokes, p, (8 * MEMO_WIDTH) / bounds.width, page, true).map** · [src/ui/memo-ink-pad.tsx:335](../../../src/ui/memo-ink-pad.tsx#L335)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-16974919b041

**@callback:strokes.filter** · [src/ui/memo-ink-pad.tsx:337](../../../src/ui/memo-ink-pad.tsx#L337)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 337행 | falsy: tool === 'pen' ∧ falsy: tool === 'eraser' ∧ truthy: !active.current.moving | strokePage(s)<br>call |
| 337행 | falsy: tool === 'pen' ∧ falsy: tool === 'eraser' ∧ truthy: !active.current.moving ∧ truthy: strokePage(s) === page | remaining.has(s.id)<br>call |

## H-ac7774ece0ee

**move** · [src/ui/memo-ink-pad.tsx:342](../../../src/ui/memo-ink-pad.tsx#L342)

분기 조건과 가능한 갈림길:

- B-1b2f5e69fcaf · IfStatement · old → truthy / falsy; 바깥 조건: 별도 조건식 없음 (344행).
- B-147ca0c2da06 · IfStatement · touch.current.size === 2 && pinch.current → truthy / falsy; 바깥 조건: truthy: old (347행).
- B-2f086bdc1fb8 · ConditionalExpression · target < 1.25 → truthy / falsy; 바깥 조건: truthy: old ∧ truthy: touch.current.size === 2 && pinch.current (351행).
- B-51cadfd07b1b · ConditionalExpression · target < 1.75 → truthy / falsy; 바깥 조건: truthy: old ∧ truthy: touch.current.size === 2 && pinch.current ∧ falsy: target < 1.25 (351행).
- B-d340d38499a9 · IfStatement · zoom !== current.current.view.zoom → truthy / falsy; 바깥 조건: truthy: old ∧ truthy: touch.current.size === 2 && pinch.current (352행).
- B-614844190f69 · IfStatement · viewport.current → truthy / falsy; 바깥 조건: truthy: old ∧ falsy: touch.current.size === 2 && pinch.current (353행).
- B-32d2b78d18d2 · IfStatement · gesture?.pointerId !== event.pointerId → truthy / falsy; 바깥 조건: 별도 조건식 없음 (360행).
- B-8a812314dff0 · ConditionalExpression · samples.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (363행).
- B-e6d3afa3bbed · IfStatement · gesture.stroke → truthy / falsy; 바깥 조건: 별도 조건식 없음 (364행).
- B-8633a0c26c8b · IfStatement · gesture.tool === 'eraser' → truthy / falsy; 바깥 조건: falsy: gesture.stroke (367행).
- B-bf146d336306 · IfStatement · gesture.moving → truthy / falsy; 바깥 조건: falsy: gesture.stroke ∧ falsy: gesture.tool === 'eraser' (372행).
- B-0c16fa04dcff · IfStatement · gesture.lasso → truthy / falsy; 바깥 조건: falsy: gesture.stroke ∧ falsy: gesture.tool === 'eraser' ∧ falsy: gesture.moving (376행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 343행 | 별도 조건식 없음 | touch.current.get(event.pointerId)<br>call |
| 345행 | truthy: old | event.preventDefault()<br>input-control |
| 346행 | truthy: old | touch.current.set(event.pointerId, { x: event.clientX, y: event.clientY })<br>call |
| 348행 | truthy: old ∧ truthy: touch.current.size === 2 && pinch.current | touch.current.values()<br>call |
| 349행 | truthy: old ∧ truthy: touch.current.size === 2 && pinch.current | Math.hypot(a.x - b.x, a.y - b.y)<br>call |
| 350행 | truthy: old ∧ truthy: touch.current.size === 2 && pinch.current | Math.max(1, Math.min(2, pinch.current.zoom * ratio))<br>call |
| 350행 | truthy: old ∧ truthy: touch.current.size === 2 && pinch.current | Math.min(2, pinch.current.zoom * ratio)<br>call |
| 352행 | truthy: old ∧ truthy: touch.current.size === 2 && pinch.current ∧ truthy: zoom !== current.current.view.zoom | changeView({ zoom })<br>call → [H-a43ba4a4e331](ui__memo-ink-pad.md#h-a43ba4a4e331) |
| 361행 | 별도 조건식 없음 | event.preventDefault()<br>input-control |
| 365행 | truthy: gesture.stroke | gesture.stroke.points.push(...events.map((e) => point(e, gesture.bounds)))<br>call |
| 365행 | truthy: gesture.stroke | events.map((e) => point(e, gesture.bounds))<br>call<br>전달 콜백: H-d50d499b3812 |
| 366행 | truthy: gesture.stroke | paint()<br>call → [H-e51e10de2d46](ui__memo-ink-pad.md#h-e51e10de2d46) |
| 369행 | falsy: gesture.stroke ∧ truthy: gesture.tool === 'eraser' | erase(point(sample, gesture.bounds), gesture.bounds, gesture.page)<br>call → [H-da7e90d8d7b7](ui__memo-ink-pad.md#h-da7e90d8d7b7) |
| 369행 | falsy: gesture.stroke ∧ truthy: gesture.tool === 'eraser' | point(sample, gesture.bounds)<br>call → [H-e8a8a6da51db](ui__memo-ink-pad.md#h-e8a8a6da51db) |
| 371행 | falsy: gesture.stroke ∧ falsy: gesture.tool === 'eraser' | point(event.nativeEvent, gesture.bounds)<br>call → [H-e8a8a6da51db](ui__memo-ink-pad.md#h-e8a8a6da51db) |
| 373행 | falsy: gesture.stroke ∧ falsy: gesture.tool === 'eraser' ∧ truthy: gesture.moving | emit(transformInk(gesture.before, gesture.ids, p.x - gesture.start.x, p.y - gesture.start.y))<br>call → [H-0b45f24dd326](ui__memo-ink-pad.md#h-0b45f24dd326) |
| 374행 | falsy: gesture.stroke ∧ falsy: gesture.tool === 'eraser' ∧ truthy: gesture.moving | transformInk(gesture.before, gesture.ids, p.x - gesture.start.x, p.y - gesture.start.y)<br>call |
| 377행 | falsy: gesture.stroke ∧ falsy: gesture.tool === 'eraser' ∧ falsy: gesture.moving ∧ truthy: gesture.lasso | gesture.lasso.push(...events.map(e=>point(e,gesture.bounds)))<br>call |
| 377행 | falsy: gesture.stroke ∧ falsy: gesture.tool === 'eraser' ∧ falsy: gesture.moving ∧ truthy: gesture.lasso | events.map(e=>point(e,gesture.bounds))<br>call<br>전달 콜백: H-9c229e3bd483 |
| 378행 | falsy: gesture.stroke ∧ falsy: gesture.tool === 'eraser' ∧ falsy: gesture.moving ∧ truthy: gesture.lasso | paint()<br>call → [H-e51e10de2d46](ui__memo-ink-pad.md#h-e51e10de2d46) |
| 381행 | falsy: gesture.stroke ∧ falsy: gesture.tool === 'eraser' ∧ falsy: gesture.moving ∧ falsy: gesture.lasso | Math.min(p.x, gesture.start.x)<br>call |
| 382행 | falsy: gesture.stroke ∧ falsy: gesture.tool === 'eraser' ∧ falsy: gesture.moving ∧ falsy: gesture.lasso | Math.min(p.y, gesture.start.y)<br>call |
| 383행 | falsy: gesture.stroke ∧ falsy: gesture.tool === 'eraser' ∧ falsy: gesture.moving ∧ falsy: gesture.lasso | Math.abs(p.x - gesture.start.x)<br>call |
| 384행 | falsy: gesture.stroke ∧ falsy: gesture.tool === 'eraser' ∧ falsy: gesture.moving ∧ falsy: gesture.lasso | Math.abs(p.y - gesture.start.y)<br>call |
| 386행 | falsy: gesture.stroke ∧ falsy: gesture.tool === 'eraser' ∧ falsy: gesture.moving ∧ falsy: gesture.lasso | setBox(rect)<br>state-update |
| 387행 | falsy: gesture.stroke ∧ falsy: gesture.tool === 'eraser' ∧ falsy: gesture.moving ∧ falsy: gesture.lasso | setSelection(selectInk(current.current.strokes, rect, gesture.page))<br>state-update |
| 387행 | falsy: gesture.stroke ∧ falsy: gesture.tool === 'eraser' ∧ falsy: gesture.moving ∧ falsy: gesture.lasso | selectInk(current.current.strokes, rect, gesture.page)<br>call |

반환/조기 중단: 357행 <render> [truthy: old]; 360행 <render> [truthy: gesture?.pointerId !== event.pointerId]

## H-d50d499b3812

**@callback:events.map** · [src/ui/memo-ink-pad.tsx:365](../../../src/ui/memo-ink-pad.tsx#L365)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 365행 | truthy: gesture.stroke | point(e, gesture.bounds)<br>call → [H-e8a8a6da51db](ui__memo-ink-pad.md#h-e8a8a6da51db) |

## H-9c229e3bd483

**@callback:events.map** · [src/ui/memo-ink-pad.tsx:377](../../../src/ui/memo-ink-pad.tsx#L377)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 377행 | falsy: gesture.stroke ∧ falsy: gesture.tool === 'eraser' ∧ falsy: gesture.moving ∧ truthy: gesture.lasso | point(e, gesture.bounds)<br>call → [H-e8a8a6da51db](ui__memo-ink-pad.md#h-e8a8a6da51db) |

## H-7b1fea3c4c45

**end** · [src/ui/memo-ink-pad.tsx:391](../../../src/ui/memo-ink-pad.tsx#L391)

분기 조건과 가능한 갈림길:

- B-7bf851229dd7 · IfStatement · active.current?.pointerId === event.pointerId → truthy / falsy; 바깥 조건: 별도 조건식 없음 (392행).
- B-504ab8c7cebe · IfStatement · touch.current.size < 2 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (394행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 392행 | truthy: active.current?.pointerId === event.pointerId | finish()<br>call → [H-a05f029b5939](ui__memo-ink-pad.md#h-a05f029b5939) |
| 393행 | 별도 조건식 없음 | touch.current.delete(event.pointerId)<br>mutation-request |

## H-73572dc6240c

**undo** · [src/ui/memo-ink-pad.tsx:396](../../../src/ui/memo-ink-pad.tsx#L396)

분기 조건과 가능한 갈림길:

- B-662c55b52e35 · ConditionalExpression · reverse → truthy / falsy; 바깥 조건: 별도 조건식 없음 (397행).
- B-63a2c250fa78 · IfStatement · !change → truthy / falsy; 바깥 조건: 별도 조건식 없음 (399행).
- B-c8124e17802f · ConditionalExpression · reverse → truthy / falsy; 바깥 조건: 별도 조건식 없음 (403행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 398행 | 별도 조건식 없음 | stack.at(-1)<br>call |
| 400행 | 별도 조건식 없음 | emit(applyInkChange(current.current.strokes, change, reverse))<br>call → [H-0b45f24dd326](ui__memo-ink-pad.md#h-0b45f24dd326) |
| 400행 | 별도 조건식 없음 | applyInkChange(current.current.strokes, change, reverse)<br>call |
| 401행 | 별도 조건식 없음 | setSelection([])<br>state-update |
| 402행 | 별도 조건식 없음 | changeView(reverse ? { undo: stack.slice(0, -1), redo: [...current.current.view.redo, change] } : { redo: stack.slice(0, -1), undo: [...current.current.view.undo, change] })<br>call → [H-a43ba4a4e331](ui__memo-ink-pad.md#h-a43ba4a4e331) |
| 404행 | truthy: reverse | stack.slice(0, -1)<br>call |
| 405행 | falsy: reverse | stack.slice(0, -1)<br>call |

반환/조기 중단: 399행 <render> [truthy: !change]

## H-de4d612b895d

**editSelection** · [src/ui/memo-ink-pad.tsx:408](../../../src/ui/memo-ink-pad.tsx#L408)

분기 조건과 가능한 갈림길:

- B-84bd3116c8ff · IfStatement · action === 'delete' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (412행).
- B-e043bab5825c · IfStatement · action === 'copy' → truthy / falsy; 바깥 조건: falsy: action === 'delete' (415행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 413행 | truthy: action === 'delete' | before.filter((s) => !ids.includes(s.id))<br>call<br>전달 콜백: H-6fd6ea29b10d |
| 414행 | truthy: action === 'delete' | setSelection([])<br>state-update |
| 416행 | falsy: action === 'delete' ∧ truthy: action === 'copy' | before<br>        .filter((s) => ids.includes(s.id))<br>        .map((s) => ({ ...s, id: crypto.randomUUID(), points: s.points.map((p) => ({ ...p })) }))<br>call<br>전달 콜백: H-ddb03e3a4c8f |
| 416행 | falsy: action === 'delete' ∧ truthy: action === 'copy' | before<br>        .filter((s) => ids.includes(s.id))<br>call<br>전달 콜백: H-73077d7af116 |
| 420행 | falsy: action === 'delete' ∧ truthy: action === 'copy' | transformInk(after, copies.map((s) => s.id), 12, 12)<br>call |
| 422행 | falsy: action === 'delete' ∧ truthy: action === 'copy' | copies.map((s) => s.id)<br>call<br>전달 콜백: H-4b589c5274c2 |
| 426행 | falsy: action === 'delete' ∧ truthy: action === 'copy' | setSelection(copies.map((s) => s.id))<br>state-update |
| 426행 | falsy: action === 'delete' ∧ truthy: action === 'copy' | copies.map((s) => s.id)<br>call<br>전달 콜백: H-084dac0fe5b4 |
| 427행 | falsy: action === 'delete' ∧ falsy: action === 'copy' | transformInk(before, ids, dx, dy, scale)<br>call |
| 428행 | 별도 조건식 없음 | emit(after)<br>call → [H-0b45f24dd326](ui__memo-ink-pad.md#h-0b45f24dd326) |
| 429행 | 별도 조건식 없음 | commit(before, after)<br>mutation-request → [H-fca8288b4d46](ui__memo-ink-pad.md#h-fca8288b4d46) |

## H-6fd6ea29b10d

**@callback:before.filter** · [src/ui/memo-ink-pad.tsx:413](../../../src/ui/memo-ink-pad.tsx#L413)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 413행 | truthy: action === 'delete' | ids.includes(s.id)<br>call |

## H-73077d7af116

**@callback:before
        .filter** · [src/ui/memo-ink-pad.tsx:417](../../../src/ui/memo-ink-pad.tsx#L417)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 417행 | falsy: action === 'delete' ∧ truthy: action === 'copy' | ids.includes(s.id)<br>call |

## H-ddb03e3a4c8f

**@callback:before
        .filter((s) => ids.includes(s.id))
        .map** · [src/ui/memo-ink-pad.tsx:418](../../../src/ui/memo-ink-pad.tsx#L418)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 418행 | falsy: action === 'delete' ∧ truthy: action === 'copy' | crypto.randomUUID()<br>call |
| 418행 | falsy: action === 'delete' ∧ truthy: action === 'copy' | s.points.map((p) => ({ ...p }))<br>call<br>전달 콜백: H-07c16f61be78 |

## H-07c16f61be78

**@callback:s.points.map** · [src/ui/memo-ink-pad.tsx:418](../../../src/ui/memo-ink-pad.tsx#L418)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4b589c5274c2

**@callback:copies.map** · [src/ui/memo-ink-pad.tsx:422](../../../src/ui/memo-ink-pad.tsx#L422)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-084dac0fe5b4

**@callback:copies.map** · [src/ui/memo-ink-pad.tsx:426](../../../src/ui/memo-ink-pad.tsx#L426)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b0ae12a18ea8

**@callback:strokes.filter** · [src/ui/memo-ink-pad.tsx:433](../../../src/ui/memo-ink-pad.tsx#L433)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 433행 | 별도 조건식 없음 | selection.includes(s.id)<br>call |
| 433행 | truthy: selection.includes(s.id) | strokePage(s)<br>call |

## H-01e6416c78fc

**navigatePage** · [src/ui/memo-ink-pad.tsx:435](../../../src/ui/memo-ink-pad.tsx#L435)

분기 조건과 가능한 갈림길:

- B-63ecc2e753c2 · IfStatement · viewport.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (439행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 436행 | 별도 조건식 없음 | finish()<br>call → [H-a05f029b5939](ui__memo-ink-pad.md#h-a05f029b5939) |
| 437행 | 별도 조건식 없음 | setSelection([])<br>state-update |
| 438행 | 별도 조건식 없음 | changeView({ page })<br>call → [H-a43ba4a4e331](ui__memo-ink-pad.md#h-a43ba4a4e331) |

## H-d410c2d479eb

**@callback:useEffectEvent** · [src/ui/memo-ink-pad.tsx:444](../../../src/ui/memo-ink-pad.tsx#L444)

분기 조건과 가능한 갈림길:

- B-503c14a004b8 · IfStatement · minimumPages > current.current.view.pages → truthy / falsy; 바깥 조건: 별도 조건식 없음 (444행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 444행 | truthy: minimumPages > current.current.view.pages | changeView({pages:minimumPages})<br>call → [H-a43ba4a4e331](ui__memo-ink-pad.md#h-a43ba4a4e331) |

## H-3bf762c006f5

**@callback:useEffect** · [src/ui/memo-ink-pad.tsx:446](../../../src/ui/memo-ink-pad.tsx#L446)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 446행 | 별도 조건식 없음 | expandForDocument()<br>call |

## H-99755ea7e4b4

**@onClick** · [src/ui/memo-ink-pad.tsx:454](../../../src/ui/memo-ink-pad.tsx#L454)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 454행 | 별도 조건식 없음 | setTool('pen')<br>state-update |

## H-245e192af854

**@onClick** · [src/ui/memo-ink-pad.tsx:460](../../../src/ui/memo-ink-pad.tsx#L460)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 460행 | 별도 조건식 없음 | setTool('eraser')<br>state-update |

## H-6f59957fead8

**@onClick** · [src/ui/memo-ink-pad.tsx:467](../../../src/ui/memo-ink-pad.tsx#L467)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 467행 | 별도 조건식 없음 | setTool('select')<br>state-update |

## H-edaa48d6cfed

**@onClick** · [src/ui/memo-ink-pad.tsx:474](../../../src/ui/memo-ink-pad.tsx#L474)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 474행 | 별도 조건식 없음 | undo(true)<br>call → [H-73572dc6240c](ui__memo-ink-pad.md#h-73572dc6240c) |

## H-1970797f0951

**@onClick** · [src/ui/memo-ink-pad.tsx:481](../../../src/ui/memo-ink-pad.tsx#L481)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 481행 | 별도 조건식 없음 | undo(false)<br>call → [H-73572dc6240c](ui__memo-ink-pad.md#h-73572dc6240c) |

## H-981b37b616f1

**@onChange** · [src/ui/memo-ink-pad.tsx:488](../../../src/ui/memo-ink-pad.tsx#L488)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 488행 | truthy: tool === 'select' | setSelectionShape(e.target.value as 'box'\|'lasso')<br>state-update |

## H-d9ef601218a4

**@onChange** · [src/ui/memo-ink-pad.tsx:493](../../../src/ui/memo-ink-pad.tsx#L493)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 493행 | 별도 조건식 없음 | preference({ ink: e.target.value as MemoInk })<br>call → [H-cf44b655248b](ui__memo-ink-pad.md#h-cf44b655248b) |

## H-f9a298584987

**@onChange** · [src/ui/memo-ink-pad.tsx:503](../../../src/ui/memo-ink-pad.tsx#L503)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 503행 | 별도 조건식 없음 | preference({ width: Number(e.target.value) })<br>call → [H-cf44b655248b](ui__memo-ink-pad.md#h-cf44b655248b) |
| 503행 | 별도 조건식 없음 | Number(e.target.value)<br>call |

## H-ed26b03f8ff0

**@callback:[2, 3, 5, 8].map** · [src/ui/memo-ink-pad.tsx:505](../../../src/ui/memo-ink-pad.tsx#L505)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-f592b36b1d56

**@onChange** · [src/ui/memo-ink-pad.tsx:516](../../../src/ui/memo-ink-pad.tsx#L516)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 516행 | truthy: tool === 'eraser' | setWhole(e.target.value === 'whole')<br>state-update |

## H-3d5e8e0630ad

**@onClick** · [src/ui/memo-ink-pad.tsx:527](../../../src/ui/memo-ink-pad.tsx#L527)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 527행 | 별도 조건식 없음 | navigatePage(view.page - 1)<br>navigation → [H-01e6416c78fc](ui__memo-ink-pad.md#h-01e6416c78fc) |

## H-6f65e23f90eb

**@onChange** · [src/ui/memo-ink-pad.tsx:535](../../../src/ui/memo-ink-pad.tsx#L535)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 535행 | 별도 조건식 없음 | navigatePage(Number(e.target.value))<br>navigation → [H-01e6416c78fc](ui__memo-ink-pad.md#h-01e6416c78fc) |
| 535행 | 별도 조건식 없음 | Number(e.target.value)<br>call |

## H-940dbae795bc

**@callback:[
            ...new Set([
              0,
              view.page,
              Math.max(0, view.page - 1),
              Math.min(pages - 1, view.page + 1),
              pages - 1,
              ...strokes.map(strokePage),
            ]),
          ]
            .sort** · [src/ui/memo-ink-pad.tsx:547](../../../src/ui/memo-ink-pad.tsx#L547)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-26c0b97e92e8

**@callback:[
            ...new Set([
              0,
              view.page,
              Math.max(0, view.page - 1),
              Math.min(pages - 1, view.page + 1),
              pages - 1,
              ...strokes.map(strokePage),
            ]),
          ]
            .sort((a, b) => a - b)
            .map** · [src/ui/memo-ink-pad.tsx:548](../../../src/ui/memo-ink-pad.tsx#L548)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d15b839c75e4

**@onClick** · [src/ui/memo-ink-pad.tsx:557](../../../src/ui/memo-ink-pad.tsx#L557)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 557행 | 별도 조건식 없음 | navigatePage(view.page + 1)<br>navigation → [H-01e6416c78fc](ui__memo-ink-pad.md#h-01e6416c78fc) |

## H-8943b726bc4f

**@onClick** · [src/ui/memo-ink-pad.tsx:563](../../../src/ui/memo-ink-pad.tsx#L563)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 564행 | 별도 조건식 없음 | changeView({ pages: pages + 1 })<br>call → [H-a43ba4a4e331](ui__memo-ink-pad.md#h-a43ba4a4e331) |
| 565행 | 별도 조건식 없음 | navigatePage(pages)<br>navigation → [H-01e6416c78fc](ui__memo-ink-pad.md#h-01e6416c78fc) |

## H-e7842868ed13

**@onClick** · [src/ui/memo-ink-pad.tsx:573](../../../src/ui/memo-ink-pad.tsx#L573)

분기 조건과 가능한 갈림길:

- B-b2866f382f03 · ConditionalExpression · view.zoom === 1 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (573행).
- B-a77b57e41167 · ConditionalExpression · view.zoom === 1.5 → truthy / falsy; 바깥 조건: falsy: view.zoom === 1 (573행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 573행 | 별도 조건식 없음 | changeView({ zoom: view.zoom === 1 ? 1.5 : view.zoom === 1.5 ? 2 : 1 })<br>call → [H-a43ba4a4e331](ui__memo-ink-pad.md#h-a43ba4a4e331) |

## H-ed32602961dc

**@onClick** · [src/ui/memo-ink-pad.tsx:579](../../../src/ui/memo-ink-pad.tsx#L579)

분기 조건과 가능한 갈림길:

- B-dbf3b2392bed · IfStatement · viewport.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (581행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 580행 | 별도 조건식 없음 | changeView({ zoom: 1 })<br>call → [H-a43ba4a4e331](ui__memo-ink-pad.md#h-a43ba4a4e331) |

## H-ac5de2cfb8f5

**@onClick** · [src/ui/memo-ink-pad.tsx:589](../../../src/ui/memo-ink-pad.tsx#L589)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 589행 | 별도 조건식 없음 | setExpanded(!expanded)<br>state-update |

## H-5670132466bf

**@onClick** · [src/ui/memo-ink-pad.tsx:638](../../../src/ui/memo-ink-pad.tsx#L638)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 639행 | truthy: tool === 'select' | setSelection(strokes.filter((s) => strokePage(s) === view.page).map((s) => s.id))<br>state-update |
| 639행 | truthy: tool === 'select' | strokes.filter((s) => strokePage(s) === view.page).map((s) => s.id)<br>call<br>전달 콜백: H-881bc3c161ce |
| 639행 | truthy: tool === 'select' | strokes.filter((s) => strokePage(s) === view.page)<br>call<br>전달 콜백: H-3da86314a7c4 |

## H-3da86314a7c4

**@callback:strokes.filter** · [src/ui/memo-ink-pad.tsx:639](../../../src/ui/memo-ink-pad.tsx#L639)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 639행 | truthy: tool === 'select' | strokePage(s)<br>call |

## H-881bc3c161ce

**@callback:strokes.filter((s) => strokePage(s) === view.page).map** · [src/ui/memo-ink-pad.tsx:639](../../../src/ui/memo-ink-pad.tsx#L639)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-21e6c30fdb04

**@onClick** · [src/ui/memo-ink-pad.tsx:644](../../../src/ui/memo-ink-pad.tsx#L644)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 644행 | truthy: tool === 'select' | setSelection([])<br>state-update |

## H-42ae73a84b74

**@callback:[
              [-10, 0, '왼쪽'],
              [10, 0, '오른쪽'],
              [0, -10, '위로'],
              [0, 10, '아래로'],
            ].map** · [src/ui/memo-ink-pad.tsx:652](../../../src/ui/memo-ink-pad.tsx#L652)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 654행 | truthy: tool === 'select' | String(name)<br>call |

## H-6f34c2113a5e

**@onClick** · [src/ui/memo-ink-pad.tsx:656](../../../src/ui/memo-ink-pad.tsx#L656)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 656행 | truthy: tool === 'select' | editSelection('transform', Number(dx), Number(dy))<br>call → [H-de4d612b895d](ui__memo-ink-pad.md#h-de4d612b895d) |
| 656행 | truthy: tool === 'select' | Number(dx)<br>call |
| 656행 | truthy: tool === 'select' | Number(dy)<br>call |

## H-a665eaae8fe8

**@onClick** · [src/ui/memo-ink-pad.tsx:663](../../../src/ui/memo-ink-pad.tsx#L663)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 663행 | truthy: tool === 'select' | editSelection('transform', 0, 0, 0.9)<br>call → [H-de4d612b895d](ui__memo-ink-pad.md#h-de4d612b895d) |

## H-577d53ffec5d

**@onClick** · [src/ui/memo-ink-pad.tsx:669](../../../src/ui/memo-ink-pad.tsx#L669)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 669행 | truthy: tool === 'select' | editSelection('transform', 0, 0, 1.1)<br>call → [H-de4d612b895d](ui__memo-ink-pad.md#h-de4d612b895d) |

## H-5c4542080d54

**@onClick** · [src/ui/memo-ink-pad.tsx:673](../../../src/ui/memo-ink-pad.tsx#L673)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 673행 | truthy: tool === 'select' | editSelection('copy')<br>call → [H-de4d612b895d](ui__memo-ink-pad.md#h-de4d612b895d) |

## H-6d04bd0e88bb

**@onClick** · [src/ui/memo-ink-pad.tsx:676](../../../src/ui/memo-ink-pad.tsx#L676)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 676행 | truthy: tool === 'select' | editSelection('delete')<br>call → [H-de4d612b895d](ui__memo-ink-pad.md#h-de4d612b895d) |

## H-f465be12d5be

**@onChange** · [src/ui/memo-ink-pad.tsx:689](../../../src/ui/memo-ink-pad.tsx#L689)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 689행 | 별도 조건식 없음 | preference({ finger: e.target.checked })<br>call → [H-cf44b655248b](ui__memo-ink-pad.md#h-cf44b655248b) |

## H-42667532c101

**@onChange** · [src/ui/memo-ink-pad.tsx:695](../../../src/ui/memo-ink-pad.tsx#L695)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 695행 | 별도 조건식 없음 | preference({ pressure: e.target.checked })<br>call → [H-cf44b655248b](ui__memo-ink-pad.md#h-cf44b655248b) |

## H-bef96e232911

**@onClick** · [src/ui/memo-ink-pad.tsx:705](../../../src/ui/memo-ink-pad.tsx#L705)

분기 조건과 가능한 갈림길:

- B-24817b675061 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: error (706행).
- B-22bf810fbf1a · IfStatement · damaged.current → truthy / falsy; 바깥 조건: truthy: error (707행).
- B-977e9078c238 · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: error (713행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 708행 | truthy: error ∧ truthy: damaged.current | resetInkStorage(preferencesKey)<br>call |
| 709행 | truthy: error ∧ truthy: damaged.current | resetInkStorage(historyKey)<br>call |
| 712행 | truthy: error | persist()<br>call → [H-bd3dda9a5f22](ui__memo-ink-pad.md#h-bd3dda9a5f22) |
| 714행 | truthy: error ∧ exception: exception | setError('필기 설정 사본을 보관하지 못했습니다. 원문은 유지했습니다. 다시 시도해 주세요.')<br>state-update |

## H-d098e60ba427

**@onClick** · [src/ui/memo-ink-pad.tsx:722](../../../src/ui/memo-ink-pad.tsx#L722)

분기 조건과 가능한 갈림길:

- B-69305289ee2e · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: error ∧ truthy: syncConflict (722행).
- B-43a9dda4d78b · CatchClause · e → exception; 바깥 조건: truthy: error ∧ truthy: syncConflict (722행).
- B-44dc061376e8 · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: truthy: error ∧ truthy: syncConflict ∧ exception: e (722행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 722행 | truthy: error ∧ truthy: syncConflict | persist()<br>call → [H-bd3dda9a5f22](ui__memo-ink-pad.md#h-bd3dda9a5f22) |
| 722행 | truthy: error ∧ truthy: syncConflict ∧ exception: e | setError(e instanceof Error?e.message:'다른 기기의 설정을 보관하지 못했습니다.')<br>state-update |

