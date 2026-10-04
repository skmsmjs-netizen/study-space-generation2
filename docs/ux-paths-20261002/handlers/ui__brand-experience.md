# src/ui/brand-experience.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-4da2aeaae2c9

**errorText** · [src/ui/brand-experience.tsx:29](../../../src/ui/brand-experience.tsx#L29)

분기 조건과 가능한 갈림길:

- B-d9db32644e44 · ConditionalExpression · e instanceof DOMException && e.name === 'QuotaExceededError' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (30행).
- B-3d9ffaea427a · ConditionalExpression · e instanceof Error → truthy / falsy; 바깥 조건: falsy: e instanceof DOMException && e.name === 'QuotaExceededError' (32행).

## H-79ae95073a56

**BrandIdentity** · [src/ui/brand-experience.tsx:35](../../../src/ui/brand-experience.tsx#L35)

분기 조건과 가능한 갈림길:

- B-71307edb77cd · ConditionalExpression · compact → truthy / falsy; 바깥 조건: 별도 조건식 없음 (37행).

반환/조기 중단: 36행 <render> [별도 조건식 없음]

## H-1bd5ad56fe0b

**useExperience** · [src/ui/brand-experience.tsx:43](../../../src/ui/brand-experience.tsx#L43)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 44행 | 별도 조건식 없음 | experienceKey(data)<br>call |
| 45행 | 별도 조건식 없음 | experienceReadingWidthKey(data)<br>call |
| 46행 | 별도 조건식 없음 | useState(emptyExperience)<br>call |
| 47행 | 별도 조건식 없음 | useState('')<br>call |
| 48행 | 별도 조건식 없음 | useState(false)<br>call |
| 49행 | 별도 조건식 없음 | useCallback(() => { try { setState(readExperience(data)); setReadBlocked(false); setError( experienceUnstored(data) ? '이 기기에 저장하지 못한 내용이 있습니다. 화면의 입력은 유지했습니다. 저장을 다시 시도해 주세요.' : '', ); } catch (e) { setReadBlocked(true); setError(errorText(e)); } }, [data])<br>call<br>전달 콜백: H-3403f1ce5763 |
| 63행 | 별도 조건식 없음 | useEffect(() => { refresh(); const changed = (e: Event) => { if (!(e instanceof CustomEvent) \|\| e.detail === key) refresh(); }; const storage = (e: StorageEvent) => { if (e.key === key \|\| e.key === widthKey) refresh(); }; window.addEventListener(EXPERIENCE_CHANGED, changed); window.addEventListener('storage', storage); return () => { window.removeEventListener(EXPERIENCE_CHANGED, changed); window.removeEventListener('storage', storage); }; }, [key, widthKey, refresh])<br>call<br>전달 콜백: H-daf2cc18802f |

반환/조기 중단: 89행 { state, error, readBlocked, change, refresh } [별도 조건식 없음]

## H-3403f1ce5763

**@callback:useCallback** · [src/ui/brand-experience.tsx:49](../../../src/ui/brand-experience.tsx#L49)

분기 조건과 가능한 갈림길:

- B-066adb076e32 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (50행).
- B-1375ab1b6f10 · ConditionalExpression · experienceUnstored(data) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (54행).
- B-43f133892fd8 · CatchClause · e → exception; 바깥 조건: 별도 조건식 없음 (58행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 51행 | 별도 조건식 없음 | setState(readExperience(data))<br>state-update |
| 51행 | 별도 조건식 없음 | readExperience(data)<br>call |
| 52행 | 별도 조건식 없음 | setReadBlocked(false)<br>state-update |
| 53행 | 별도 조건식 없음 | setError(experienceUnstored(data) ? '이 기기에 저장하지 못한 내용이 있습니다. 화면의 입력은 유지했습니다. 저장을 다시 시도해 주세요.' : '')<br>state-update |
| 54행 | 별도 조건식 없음 | experienceUnstored(data)<br>call |
| 59행 | exception: e | setReadBlocked(true)<br>state-update |
| 60행 | exception: e | setError(errorText(e))<br>state-update |
| 60행 | exception: e | errorText(e)<br>call → [H-4da2aeaae2c9](ui__brand-experience.md#h-4da2aeaae2c9) |

## H-daf2cc18802f

**@callback:useEffect** · [src/ui/brand-experience.tsx:63](../../../src/ui/brand-experience.tsx#L63)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 64행 | 별도 조건식 없음 | refresh()<br>call |
| 71행 | 별도 조건식 없음 | window.addEventListener(EXPERIENCE_CHANGED, changed)<br>call<br>전달 콜백: H-993174bca82d |
| 72행 | 별도 조건식 없음 | window.addEventListener('storage', storage)<br>call<br>전달 콜백: H-43b187c2bdac |

반환/조기 중단: 73행 () => { window.removeEventListener(EXPERIENCE_CHANGED, changed); window.removeEventListener('storage', storage); } [별도 조건식 없음]

## H-993174bca82d

**changed** · [src/ui/brand-experience.tsx:65](../../../src/ui/brand-experience.tsx#L65)

분기 조건과 가능한 갈림길:

- B-bf6afbf205bf · IfStatement · !(e instanceof CustomEvent) || e.detail === key → truthy / falsy; 바깥 조건: 별도 조건식 없음 (66행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 66행 | truthy: !(e instanceof CustomEvent) \|\| e.detail === key | refresh()<br>call |

## H-43b187c2bdac

**storage** · [src/ui/brand-experience.tsx:68](../../../src/ui/brand-experience.tsx#L68)

분기 조건과 가능한 갈림길:

- B-83d7a1a08974 · IfStatement · e.key === key || e.key === widthKey → truthy / falsy; 바깥 조건: 별도 조건식 없음 (69행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 69행 | truthy: e.key === key \|\| e.key === widthKey | refresh()<br>call |

## H-a10a8d180105

**useLocalText** · [src/ui/brand-experience.tsx:93](../../../src/ui/brand-experience.tsx#L93)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 111행 | 별도 조건식 없음 | useState(read)<br>call<br>전달 콜백: H-0adb1004a357 |
| 112행 | 별도 조건식 없음 | useState(initial.text)<br>call |
| 113행 | 별도 조건식 없음 | useState(initial.error)<br>call |
| 114행 | 별도 조건식 없음 | useState(initial.blocked)<br>call |

반환/조기 중단: 140행 { text, input, error, blocked, retry, clear } [별도 조건식 없음]

## H-0adb1004a357

**read** · [src/ui/brand-experience.tsx:94](../../../src/ui/brand-experience.tsx#L94)

분기 조건과 가능한 갈림길:

- B-e8b911d7ba34 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (95행).
- B-65a6698a8c6f · ConditionalExpression · draftHasUnstoredText(key) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (98행).
- B-02abfaa94ee5 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (103행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 97행 | 별도 조건식 없음 | readRescuedDraft(key)<br>preservation-boundary |
| 97행 | nullish: readRescuedDraft(key) | localStorage.getItem(key)<br>preservation-boundary |
| 98행 | 별도 조건식 없음 | draftHasUnstoredText(key)<br>preservation-boundary |

반환/조기 중단: 96행 { text: readRescuedDraft(key) ?? localStorage.getItem(key) ?? '', error: draftHasUnstoredText(key) ? '이 기기에 저장하지 못한 글입니다. 현재 창의 입력은 유지했습니다. 다시 저장해 주세요.' : '', blocked: false, } [별도 조건식 없음]; 104행 { text: '', error: '보관한 글을 읽지 못했습니다. 원문을 덮어쓰지 않았습니다. 다시 읽어 주세요.', blocked: true, } [exception: exception]

## H-9d98cbff1e7b

**BrandContinuity** · [src/ui/brand-experience.tsx:143](../../../src/ui/brand-experience.tsx#L143)

분기 조건과 가능한 갈림길:

- B-13f4be90babc · ConditionalExpression · route === '/' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (194행).
- B-136fd7e6cc76 · ConditionalExpression · last → truthy / falsy; 바깥 조건: truthy: route === '/' (200행).
- B-411c905543d0 · ConditionalExpression · last → truthy / falsy; 바깥 조건: truthy: route === '/' (201행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 144행 | 별도 조건식 없음 | useExperience(data)<br>call → [H-1bd5ad56fe0b](ui__brand-experience.md#h-1bd5ad56fe0b) |
| 145행 | 별도 조건식 없음 | useEffect(() => { const location = resolveWorkLocation(data, route); if (!location) return; try { updateExperience(data, (state) => state.last?.route === location.route && state.last.label === location.label ? state : { ...state, last: location }, ); } catch { /* The home/recovery surface shows the retained error; navigation remains usable. */ } }, [route, data])<br>call<br>전달 콜백: H-b4d6c4fc53f2 |
| 158행 | 별도 조건식 없음 | useState(10)<br>call |
| 159행 | 별도 조건식 없음 | useState(false)<br>call |
| 160행 | 별도 조건식 없음 | useState('')<br>call |
| 161행 | 별도 조건식 없음 | useLocalText(`${experienceKey(data)}:next-draft`)<br>call → [H-a10a8d180105](ui__brand-experience.md#h-a10a8d180105) |
| 161행 | 별도 조건식 없음 | experienceKey(data)<br>call |
| 163행 | truthy: experience.state.next | resolveWorkLocation(data, experience.state.next.location.route)<br>call |
| 164행 | truthy: experience.state.last | resolveWorkLocation(data, experience.state.last.route)<br>call |
| 226행 | truthy: route === '/' | Boolean(experience.state.nextHistory?.length)<br>call |
| 293행 | falsy: route === '/' | resolveWorkLocation(data, route)<br>call |
| 331행 | truthy: open ∧ falsy: draft.blocked | draft.text.trim()<br>preservation-boundary |

반환/조기 중단: 192행 <render> [별도 조건식 없음]

## H-b4d6c4fc53f2

**@callback:useEffect** · [src/ui/brand-experience.tsx:145](../../../src/ui/brand-experience.tsx#L145)

분기 조건과 가능한 갈림길:

- B-44ec7d59c2dc · IfStatement · !location → truthy / falsy; 바깥 조건: 별도 조건식 없음 (147행).
- B-9517337354c4 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (148행).
- B-fcbc3e82c37f · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (154행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 146행 | 별도 조건식 없음 | resolveWorkLocation(data, route)<br>call |
| 149행 | 별도 조건식 없음 | updateExperience(data, (state) => state.last?.route === location.route && state.last.label === location.label ? state : { ...state, last: location })<br>call<br>전달 콜백: H-a04453a1ae6d |

반환/조기 중단: 147행 <render> [truthy: !location]

## H-a04453a1ae6d

**@callback:updateExperience** · [src/ui/brand-experience.tsx:149](../../../src/ui/brand-experience.tsx#L149)

분기 조건과 가능한 갈림길:

- B-61a459079391 · ConditionalExpression · state.last?.route === location.route && state.last.label === location.label → truthy / falsy; 바깥 조건: 별도 조건식 없음 (150행).

## H-01e3e32dcce1

**resume** · [src/ui/brand-experience.tsx:165](../../../src/ui/brand-experience.tsx#L165)

분기 조건과 가능한 갈림길:

- B-b204d21ef6d9 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (166행).
- B-f519cfe47eff · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (168행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 167행 | 별도 조건식 없음 | trackExperience(data, 'resume')<br>call |
| 171행 | 별도 조건식 없음 | navigate(path)<br>navigation |

## H-1d42b67292b6

**saveNext** · [src/ui/brand-experience.tsx:173](../../../src/ui/brand-experience.tsx#L173)

분기 조건과 가능한 갈림길:

- B-ecf6cf992636 · IfStatement · draft.blocked || !draft.text.trim() → truthy / falsy; 바깥 조건: 별도 조건식 없음 (176행).
- B-2ea5a9dcf93b · IfStatement · !experience.change((state) => retainNextAction(state, { location, body: draft.text })) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (177행).
- B-44c854400e4a · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (180행).
- B-0ccd4bdf3efe · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (182행).
- B-212038f207f2 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (185행).
- B-8147d3c98b62 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (187행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 174행 | 별도 조건식 없음 | resolveWorkLocation(data, route)<br>call |
| 176행 | falsy: draft.blocked | draft.text.trim()<br>preservation-boundary |
| 177행 | 별도 조건식 없음 | experience.change((state) => retainNextAction(state, { location, body: draft.text }))<br>call<br>전달 콜백: H-f92edb35c8d8 |
| 179행 | 별도 조건식 없음 | setNotice('다음에 할 일로 남겨두었습니다. 이 기기에 보관합니다.')<br>state-update |
| 181행 | 별도 조건식 없음 | draft.clear()<br>preservation-boundary |
| 183행 | exception: exception | setNotice('다음에 할 일은 보관했습니다. 입력 초안 정리는 다시 시도해 주세요.')<br>state-update |
| 186행 | 별도 조건식 없음 | trackExperience(data, 'next-step')<br>call |
| 190행 | 별도 조건식 없음 | setOpen(false)<br>state-update |

반환/조기 중단: 176행 <render> [truthy: draft.blocked || !draft.text.trim()]; 178행 <render> [truthy: !experience.change((state) => retainNextAction(state, { location, body: draft.text }))]

## H-f92edb35c8d8

**@callback:experience.change** · [src/ui/brand-experience.tsx:177](../../../src/ui/brand-experience.tsx#L177)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 177행 | 별도 조건식 없음 | retainNextAction(state, { location, body: draft.text })<br>call |

## H-b15273dca53b

**@onClick** · [src/ui/brand-experience.tsx:211](../../../src/ui/brand-experience.tsx#L211)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 211행 | truthy: route === '/' ∧ truthy: experience.state.next | resume(nextLocation?.route ?? '/subjects')<br>call → [H-01e3e32dcce1](ui__brand-experience.md#h-01e3e32dcce1) |

## H-2f7968e080df

**@onClick** · [src/ui/brand-experience.tsx:216](../../../src/ui/brand-experience.tsx#L216)

분기 조건과 가능한 갈림길:

- B-0b4ca83527bf · IfStatement · experience.change((s) => retainNextAction(s, null)) → truthy / falsy; 바깥 조건: truthy: route === '/' ∧ truthy: experience.state.next (217행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 217행 | truthy: route === '/' ∧ truthy: experience.state.next | experience.change((s) => retainNextAction(s, null))<br>call<br>전달 콜백: H-efd6549202f5 |
| 218행 | truthy: route === '/' ∧ truthy: experience.state.next ∧ truthy: experience.change((s) => retainNextAction(s, null)) | setNotice('다음 행동 표시를 해제했습니다. 이전 글은 아래에 보관했습니다.')<br>state-update |

## H-efd6549202f5

**@callback:experience.change** · [src/ui/brand-experience.tsx:217](../../../src/ui/brand-experience.tsx#L217)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 217행 | truthy: route === '/' ∧ truthy: experience.state.next | retainNextAction(s, null)<br>call |

## H-c981d815c385

**@onClick** · [src/ui/brand-experience.tsx:241](../../../src/ui/brand-experience.tsx#L241)

분기 조건과 가능한 갈림길:

- B-cff271b7a849 · IfStatement · experience.change((state) => retainNextAction(state, { location: previous.location, body: previous.body, }), ) → truthy / falsy; 바깥 조건: truthy: route === '/' ∧ truthy: Boolean(experience.state.nextHistory?.length) (242행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 243행 | truthy: route === '/' ∧ truthy: Boolean(experience.state.nextHistory?.length) | experience.change((state) => retainNextAction(state, { location: previous.location, body: previous.body, }))<br>call<br>전달 콜백: H-c9b9475fa9c8 |
| 250행 | truthy: route === '/' ∧ truthy: Boolean(experience.state.nextHistory?.length) ∧ truthy: experience.change((state) =><br>                            retainNextAction(state, {<br>                              location: previous.location,<br>                              body: previous.body,<br>                            }),<br>                          ) | setNotice('이전 다음 행동을 다시 표시했습니다. 다른 원문도 보관합니다.')<br>state-update |

## H-c9b9475fa9c8

**@callback:experience.change** · [src/ui/brand-experience.tsx:243](../../../src/ui/brand-experience.tsx#L243)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 244행 | truthy: route === '/' ∧ truthy: Boolean(experience.state.nextHistory?.length) | retainNextAction(state, { location: previous.location, body: previous.body, })<br>call |

## H-ea75f23480b8

**@onClick** · [src/ui/brand-experience.tsx:258](../../../src/ui/brand-experience.tsx#L258)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 258행 | truthy: route === '/' ∧ truthy: Boolean(experience.state.nextHistory?.length) ∧ truthy: (experience.state.nextHistory?.length ?? 0) > historyLimit | setHistoryLimit((n) => n + 20)<br>state-update<br>전달 콜백: H-cf09aca6494a |

## H-cf09aca6494a

**@callback:setHistoryLimit** · [src/ui/brand-experience.tsx:258](../../../src/ui/brand-experience.tsx#L258)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c68eb44dbb15

**@onClick** · [src/ui/brand-experience.tsx:266](../../../src/ui/brand-experience.tsx#L266)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 266행 | truthy: route === '/' ∧ truthy: last | resume(last.route)<br>call → [H-01e3e32dcce1](ui__brand-experience.md#h-01e3e32dcce1) |

## H-d4eb90039bf6

**@onClick** · [src/ui/brand-experience.tsx:271](../../../src/ui/brand-experience.tsx#L271)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 271행 | truthy: route === '/' ∧ truthy: !last | navigate('/materials')<br>navigation |

## H-ceea3757b38a

**@onClick** · [src/ui/brand-experience.tsx:276](../../../src/ui/brand-experience.tsx#L276)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 277행 | truthy: route === '/' | setNotice('')<br>state-update |
| 278행 | truthy: route === '/' | setOpen(true)<br>state-update |

## H-b11c861472ad

**@onRetry** · [src/ui/brand-experience.tsx:286](../../../src/ui/brand-experience.tsx#L286)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 286행 | truthy: route === '/' ∧ truthy: experience.error | experience.change((s) => s)<br>call<br>전달 콜백: H-82b9deeab479 |

## H-82b9deeab479

**@callback:experience.change** · [src/ui/brand-experience.tsx:286](../../../src/ui/brand-experience.tsx#L286)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-0fc98577eeae

**@onClick** · [src/ui/brand-experience.tsx:297](../../../src/ui/brand-experience.tsx#L297)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 298행 | falsy: route === '/' ∧ truthy: resolveWorkLocation(data, route) | setNotice('')<br>state-update |
| 299행 | falsy: route === '/' ∧ truthy: resolveWorkLocation(data, route) | setOpen(true)<br>state-update |

## H-cde8580f7f7a

**@onClose** · [src/ui/brand-experience.tsx:308](../../../src/ui/brand-experience.tsx#L308)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 308행 | truthy: open | setOpen(false)<br>state-update |

## H-3ffa1591a574

**@onChange** · [src/ui/brand-experience.tsx:321](../../../src/ui/brand-experience.tsx#L321)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 321행 | truthy: open | draft.input(e.target.value)<br>preservation-boundary |

## H-43463ac1bd8d

**@onClick** · [src/ui/brand-experience.tsx:336](../../../src/ui/brand-experience.tsx#L336)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 336행 | truthy: open | setOpen(false)<br>state-update |

## H-2a2a4ec7c4d5

**ExperienceSettings** · [src/ui/brand-experience.tsx:343](../../../src/ui/brand-experience.tsx#L343)

분기 조건과 가능한 갈림길:

- B-d354ed0f4eb2 · ConditionalExpression · readBlocked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (350행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 344행 | 별도 조건식 없음 | useExperience(data)<br>call → [H-1bd5ad56fe0b](ui__brand-experience.md#h-1bd5ad56fe0b) |

반환/조기 중단: 345행 <render> [별도 조건식 없음]

## H-15a3a8fb0712

**@onChange** · [src/ui/brand-experience.tsx:351](../../../src/ui/brand-experience.tsx#L351)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 352행 | 별도 조건식 없음 | change((s) => ({ ...s, readingWidth: e.target.value === 'wide' ? 'wide' : 'normal' }))<br>call<br>전달 콜백: H-6bad605e30f5 |

## H-6bad605e30f5

**@callback:change** · [src/ui/brand-experience.tsx:352](../../../src/ui/brand-experience.tsx#L352)

분기 조건과 가능한 갈림길:

- B-abeb4be7f0d9 · ConditionalExpression · e.target.value === 'wide' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (352행).

## H-08f0f3f611a8

**RelatedThinking** · [src/ui/brand-experience.tsx:365](../../../src/ui/brand-experience.tsx#L365)

분기 조건과 가능한 갈림길:

- B-34b26af263bd · IfStatement · !rows.length && !notes.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (384행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 366행 | 별도 조건식 없음 | data.records<br>    .filter(<br>      (r) =><br>        !r.deletedAt &&<br>        r.userId === data.userId &&<br>        r.namespace === data.namespace &&<br>        r.targetId === nodeId &&<br>        r.body.trim(),<br>    )<br>    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))<br>mutation-request<br>전달 콜백: H-6ce042950de6 |
| 366행 | 별도 조건식 없음 | data.records<br>    .filter((r) => !r.deletedAt && r.userId === data.userId && r.namespace === data.namespace && r.targetId === nodeId && r.body.trim())<br>call<br>전달 콜백: H-456b149ca47b |
| 376행 | 별도 조건식 없음 | (data.memos ?? []).filter((m) => !m.deletedAt && m.userId === data.userId && m.namespace === data.namespace && m.ownerId === nodeId)<br>call<br>전달 콜백: H-0f26c9b54a50 |
| 383행 | 별도 조건식 없음 | useState(5)<br>call |
| 396행 | 별도 조건식 없음 | rows.slice(0, limit).map((row) => ( <article key={row.id}> <p className="prose">{row.body}</p> <a href={`#/node/${encodeURIComponent(nodeId)}`} onClick={(event) => { const anchor = Array.from( document.querySelectorAll<HTMLElement>('[data-reading-anchor]'), ).find((el) => el.dataset.readingAnchor === `record:${row.id}`); if (anchor) { event.preventDefault(); anchor.scrollIntoView({ block: 'start', behavior: 'auto' }); } track(); }} > 이 주제의 원문·기록 열기 </a> </article> ))<br>call<br>전달 콜백: H-da4b75b19248 |
| 396행 | 별도 조건식 없음 | rows.slice(0, limit)<br>call |
| 416행 | 별도 조건식 없음 | notes.slice(0, limit).map((row) => ( <article key={row.id}> <p className="prose">{row.body}</p> <a href={`#/memos/${encodeURIComponent(row.id)}`} onClick={track}> 메모 열기 </a> </article> ))<br>call<br>전달 콜백: H-12669a4b6563 |
| 416행 | 별도 조건식 없음 | notes.slice(0, limit)<br>call |

반환/조기 중단: 384행 null [truthy: !rows.length && !notes.length]; 392행 <render> [별도 조건식 없음]

## H-456b149ca47b

**@callback:data.records
    .filter** · [src/ui/brand-experience.tsx:368](../../../src/ui/brand-experience.tsx#L368)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 373행 | truthy: !r.deletedAt &&<br>        r.userId === data.userId &&<br>        r.namespace === data.namespace &&<br>        r.targetId === nodeId | r.body.trim()<br>call |

## H-6ce042950de6

**@callback:data.records
    .filter(
      (r) =>
        !r.deletedAt &&
        r.userId === data.userId &&
        r.namespace === data.namespace &&
        r.targetId === nodeId &&
        r.body.trim(),
    )
    .sort** · [src/ui/brand-experience.tsx:375](../../../src/ui/brand-experience.tsx#L375)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 375행 | 별도 조건식 없음 | b.updatedAt.localeCompare(a.updatedAt)<br>call |

## H-0f26c9b54a50

**notes** · [src/ui/brand-experience.tsx:377](../../../src/ui/brand-experience.tsx#L377)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-97e10fd99d40

**track** · [src/ui/brand-experience.tsx:385](../../../src/ui/brand-experience.tsx#L385)

분기 조건과 가능한 갈림길:

- B-c4559a2d3b85 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (386행).
- B-c93c3194257d · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (388행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 387행 | 별도 조건식 없음 | trackExperience(data, 'reuse')<br>call |

## H-da4b75b19248

**@callback:rows.slice(0, limit).map** · [src/ui/brand-experience.tsx:396](../../../src/ui/brand-experience.tsx#L396)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 400행 | 별도 조건식 없음 | encodeURIComponent(nodeId)<br>call |

## H-aa6ca7d43a7b

**@onClick** · [src/ui/brand-experience.tsx:401](../../../src/ui/brand-experience.tsx#L401)

분기 조건과 가능한 갈림길:

- B-f8c2fa487c95 · IfStatement · anchor → truthy / falsy; 바깥 조건: 별도 조건식 없음 (405행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 402행 | 별도 조건식 없음 | Array.from(<br>                document.querySelectorAll<HTMLElement>('[data-reading-anchor]'),<br>              ).find((el) => el.dataset.readingAnchor === `record:${row.id}`)<br>call<br>전달 콜백: H-f06068b4d518 |
| 402행 | 별도 조건식 없음 | Array.from(document.querySelectorAll<HTMLElement>('[data-reading-anchor]'))<br>call |
| 403행 | 별도 조건식 없음 | document.querySelectorAll('[data-reading-anchor]')<br>call |
| 406행 | truthy: anchor | event.preventDefault()<br>input-control |
| 407행 | truthy: anchor | anchor.scrollIntoView({ block: 'start', behavior: 'auto' })<br>call |
| 409행 | 별도 조건식 없음 | track()<br>call → [H-97e10fd99d40](ui__brand-experience.md#h-97e10fd99d40) |

## H-f06068b4d518

**@callback:Array.from(
                document.querySelectorAll<HTMLElement>('[data-reading-anchor]'),
              ).find** · [src/ui/brand-experience.tsx:404](../../../src/ui/brand-experience.tsx#L404)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-12669a4b6563

**@callback:notes.slice(0, limit).map** · [src/ui/brand-experience.tsx:416](../../../src/ui/brand-experience.tsx#L416)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 419행 | 별도 조건식 없음 | encodeURIComponent(row.id)<br>call |

## H-aa4c8386c5d8

**@onClick** · [src/ui/brand-experience.tsx:425](../../../src/ui/brand-experience.tsx#L425)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 425행 | truthy: rows.length > limit \|\| notes.length > limit | setLimit((n) => n + 10)<br>state-update<br>전달 콜백: H-b9410633dd8e |

## H-b9410633dd8e

**@callback:setLimit** · [src/ui/brand-experience.tsx:425](../../../src/ui/brand-experience.tsx#L425)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-4f8689c14ffb

**ownRecord** · [src/ui/brand-experience.tsx:431](../../../src/ui/brand-experience.tsx#L431)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-30995638a225

**BrandService** · [src/ui/brand-experience.tsx:433](../../../src/ui/brand-experience.tsx#L433)

분기 조건과 가능한 갈림길:

- B-d1cf8dd82b46 · ConditionalExpression · includeHistory → truthy / falsy; 바깥 조건: 별도 조건식 없음 (482행).
- B-1e97ed455a9b · ConditionalExpression · share → truthy / falsy; 바깥 조건: 별도 조건식 없음 (521행).
- B-dcbc0d9bf3e7 · ConditionalExpression · experience.state.measurement.startedAt → truthy / falsy; 바깥 조건: truthy: page === '/my-progress' (816행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 442행 | 별도 조건식 없음 | useExperience(data)<br>call → [H-1bd5ad56fe0b](ui__brand-experience.md#h-1bd5ad56fe0b) |
| 443행 | 별도 조건식 없음 | useState('')<br>call |
| 444행 | 별도 조건식 없음 | useState(40)<br>call |
| 445행 | 별도 조건식 없음 | useViewContext(data, `brand-query:${page}`, '', isViewText)<br>call |
| 446행 | 별도 조건식 없음 | useViewContext(data, 'brand-share-selection', [], (value): value is string[] => Array.isArray(value) && value.every((id) => typeof id === 'string'))<br>call<br>전달 콜백: H-ed83696806d8 |
| 453행 | 별도 조건식 없음 | useViewContext(data, 'brand-share-history', false, (value): value is boolean => typeof value === 'boolean')<br>call<br>전달 콜백: H-9f9539308d45 |
| 459행 | 별도 조건식 없음 | useLocalText(`${experienceKey(data)}:support-draft`)<br>call → [H-a10a8d180105](ui__brand-experience.md#h-a10a8d180105) |
| 459행 | 별도 조건식 없음 | experienceKey(data)<br>call |
| 460행 | 별도 조건식 없음 | useState(() => { try { return ( readExperience(data) .support.slice() .reverse() .find((r) => r.body === supportDraft.text)?.id ?? crypto.randomUUID() ); } catch { return crypto.randomUUID(); } })<br>call<br>전달 콜백: H-bea7ae603a19 |
| 472행 | 별도 조건식 없음 | data.records<br>    .filter((r) => ownRecord(data, r) && r.body.trim())<br>    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))<br>call<br>전달 콜백: H-781fe4e8a349 |
| 472행 | 별도 조건식 없음 | data.records<br>    .filter((r) => ownRecord(data, r) && r.body.trim())<br>call<br>전달 콜백: H-54db9fc651cc |
| 475행 | 별도 조건식 없음 | records.filter((r) => !query \|\| `${r.body} ${data.nodes.find((n) => n.id === r.targetId)?.name ?? ''}`.includes(query))<br>call<br>전달 콜백: H-4d340855a950 |
| 480행 | 별도 조건식 없음 | records.filter((r) => chosen.includes(r.id))<br>call<br>전달 콜백: H-47987a9be3fc |
| 481행 | 별도 조건식 없음 | selected.map((r) => r.id)<br>call<br>전달 콜백: H-cee0cce64e32 |
| 485행 | truthy: includeHistory | data.revisions<br>          .filter(<br>            (v) =><br>              v.collection === 'records' &&<br>              selectedIds.has(v.entityId) &&<br>              v.userId === data.userId &&<br>              v.namespace === data.namespace,<br>          )<br>          .flatMap((v) => [v.before, v.after])<br>          .filter((v): v is StudyRecord => Boolean( v && 'sessionId' in v && selectedIds.has(v.id) && v.userId === data.userId && v.namespace === data.namespace, ))<br>call<br>전달 콜백: H-13a24b5fc8ef |
| 485행 | truthy: includeHistory | data.revisions<br>          .filter(<br>            (v) =><br>              v.collection === 'records' &&<br>              selectedIds.has(v.entityId) &&<br>              v.userId === data.userId &&<br>              v.namespace === data.namespace,<br>          )<br>          .flatMap((v) => [v.before, v.after])<br>call<br>전달 콜백: H-2f6a12724566 |
| 485행 | truthy: includeHistory | data.revisions<br>          .filter((v) => v.collection === 'records' && selectedIds.has(v.entityId) && v.userId === data.userId && v.namespace === data.namespace)<br>call<br>전달 콜백: H-b70ceb3f56cb |
| 505행 | 별도 조건식 없음 | [<br>    ...new Map(versions.map((r) => [`${r.id}:${r.version}`, r])).values(),<br>  ].sort((a, b) => a.createdAt.localeCompare(b.createdAt) \|\| a.version - b.version)<br>call<br>전달 콜백: H-ca92182516df |
| 506행 | 별도 조건식 없음 | new Map(versions.map((r) => [`${r.id}:${r.version}`, r])).values()<br>call |
| 506행 | 별도 조건식 없음 | versions.map((r) => [`${r.id}:${r.version}`, r])<br>call<br>전달 콜백: H-c897649f7c38 |
| 508행 | 별도 조건식 없음 | uniqueVersions<br>    .map((r) => {<br>      const title =<br>        data.nodes.find((n) => n.id === r.targetId && !n.deletedAt)?.name ?? '공부 기록';<br>      const date =<br>        r.dateEvidence.kind === 'exact'<br>          ? r.dateEvidence.date<br>          : r.dateEvidence.kind === 'range'<br>            ? `${r.dateEvidence.from} ~ ${r.dateEvidence.to}`<br>            : '미확인';<br>      return `${title}\n공부한 날짜: ${date}\n기록 ID: ${r.id} · 버전 ${r.version}\n\n${r.body}`;<br>    })<br>    .join('\n\n────────\n\n')<br>mutation-request |
| 508행 | 별도 조건식 없음 | uniqueVersions<br>    .map((r) => { const title = data.nodes.find((n) => n.id === r.targetId && !n.deletedAt)?.name ?? '공부 기록'; const date = r.dateEvidence.kind === 'exact' ? r.dateEvidence.date : r.dateEvidence.kind === 'range' ? `${r.dateEvidence.from} ~ ${r.dateEvidence.to}` : '미확인'; return `${title}\n공부한 날짜: ${date}\n기록 ID: ${r.id} · 버전 ${r.version}\n\n${r.body}`; })<br>call<br>전달 콜백: H-13d435da6f3e |
| 630행 | truthy: page === '/help' ∧ falsy: supportDraft.blocked | supportDraft.text.trim()<br>preservation-boundary |
| 636행 | truthy: page === '/help' | supportDraft.text.trim()<br>preservation-boundary |
| 650행 | truthy: page === '/help' ∧ falsy: supportDraft.blocked | Boolean(supportDraft.error)<br>call |
| 651행 | truthy: page === '/help' ∧ falsy: supportDraft.blocked \|\|<br>                  Boolean(supportDraft.error) | experience.state.support.some((r) => r.id === supportId && r.body === supportDraft.text)<br>call<br>전달 콜백: H-b0d0a6faa1b7 |
| 676행 | truthy: page === '/help' ∧ truthy: experience.state.support.length > 0 | experience.state.support<br>                .filter((r) => !query \|\| `${r.id} ${r.body}`.includes(query))<br>                .slice()<br>                .reverse()<br>                .slice(0, limit)<br>                .map((r) => ( <Card key={r.id}> <h3>이 기기에 보관한 메모</h3> <p className="muted"> 식별 번호 {r.id} · {new Date(r.updatedAt).toLocaleString('ko-KR')} </p> <pre>{r.body}</pre> {Boolean(r.history?.length) && ( <details> <summary>이 메모의 이전 글 {r.history?.length}개</summary> {r.history?.map((version) => ( <div key={version.id ?? `${version.updatedAt}:${version.body}`}> <p className="muted"> {new Date(version.updatedAt).toLocaleString('ko-KR')} </p> <pre>{version.body}</pre> </div> ))} </details> )} <Button onClick={() => downloadText( `manseeksong-inquiry-${r.id}.txt`, `메모 식별 번호: ${r.id}\n상태: 이 기기에 보관 · 외부 전송 없음\n\n${r.body}`, ) } > 이 메모 내려받기 </Button> </Card> ))<br>call<br>전달 콜백: H-a7f5d1ad3887 |
| 676행 | truthy: page === '/help' ∧ truthy: experience.state.support.length > 0 | experience.state.support<br>                .filter((r) => !query \|\| `${r.id} ${r.body}`.includes(query))<br>                .slice()<br>                .reverse()<br>                .slice(0, limit)<br>call |
| 676행 | truthy: page === '/help' ∧ truthy: experience.state.support.length > 0 | experience.state.support<br>                .filter((r) => !query \|\| `${r.id} ${r.body}`.includes(query))<br>                .slice()<br>                .reverse()<br>call |
| 676행 | truthy: page === '/help' ∧ truthy: experience.state.support.length > 0 | experience.state.support<br>                .filter((r) => !query \|\| `${r.id} ${r.body}`.includes(query))<br>                .slice()<br>call |
| 676행 | truthy: page === '/help' ∧ truthy: experience.state.support.length > 0 | experience.state.support<br>                .filter((r) => !query \|\| `${r.id} ${r.body}`.includes(query))<br>call<br>전달 콜백: H-1af430a7f203 |
| 713행 | truthy: page === '/help' ∧ truthy: experience.state.support.length > 0 | experience.state.support.some((r) => !query \|\| `${r.id} ${r.body}`.includes(query))<br>call<br>전달 콜백: H-026790b628b4 |
| 716행 | truthy: page === '/help' ∧ truthy: experience.state.support.length > 0 | experience.state.support.filter((r) => !query \|\| `${r.id} ${r.body}`.includes(query))<br>call<br>전달 콜백: H-33016dcf190c |
| 747행 | truthy: page === '/my-progress' | selectable.slice(0, limit).map((r) => ( <Checkbox key={r.id} label={`${data.nodes.find((n) => n.id === r.targetId)?.name ?? '공부 기록'} · ${r.body.slice(0, 70)}`} checked={chosen.includes(r.id)} onChange={(e) => setChosen((s) => e.target.checked ? [...s, r.id] : s.filter((id) => id !== r.id), ) } /> ))<br>call<br>전달 콜백: H-7773d8d9140b |
| 747행 | truthy: page === '/my-progress' | selectable.slice(0, limit)<br>call |
| 817행 | truthy: page === '/my-progress' ∧ truthy: experience.state.measurement.startedAt | new Date(experience.state.measurement.startedAt).toLocaleDateString('ko-KR')<br>call |
| 820행 | truthy: page === '/my-progress' | (['resume', 'reuse', 'next-step', 'share-download'] as const).map((action, i) => ( <p key={action}> {['이어가기', '이전 생각 열기', '다음 행동 남기기', '선택한 글 내보내기'][i]}:{' '} {experience.state.measurement.events.filter((e) => e.action === action).length}회 </p> ))<br>call<br>전달 콜백: H-4c43e5223886 |

반환/조기 중단: 558행 <render> [별도 조건식 없음]

## H-ed83696806d8

**@callback:useViewContext** · [src/ui/brand-experience.tsx:450](../../../src/ui/brand-experience.tsx#L450)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 451행 | 별도 조건식 없음 | Array.isArray(value)<br>call |
| 451행 | truthy: Array.isArray(value) | value.every((id) => typeof id === 'string')<br>call<br>전달 콜백: H-bd5c2add4341 |

## H-bd5c2add4341

**@callback:value.every** · [src/ui/brand-experience.tsx:451](../../../src/ui/brand-experience.tsx#L451)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-9f9539308d45

**@callback:useViewContext** · [src/ui/brand-experience.tsx:457](../../../src/ui/brand-experience.tsx#L457)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-bea7ae603a19

**@callback:useState** · [src/ui/brand-experience.tsx:460](../../../src/ui/brand-experience.tsx#L460)

분기 조건과 가능한 갈림길:

- B-f072343fb985 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (461행).
- B-0c31f5b66b0f · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (468행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 463행 | 별도 조건식 없음 | readExperience(data)<br>          .support.slice()<br>          .reverse()<br>          .find((r) => r.body === supportDraft.text)<br>call<br>전달 콜백: H-1e0b4aad2059 |
| 463행 | 별도 조건식 없음 | readExperience(data)<br>          .support.slice()<br>          .reverse()<br>call |
| 463행 | 별도 조건식 없음 | readExperience(data)<br>          .support.slice()<br>call |
| 463행 | 별도 조건식 없음 | readExperience(data)<br>call |
| 466행 | nullish: readExperience(data)<br>          .support.slice()<br>          .reverse()<br>          .find((r) => r.body === supportDraft.text)?.id | crypto.randomUUID()<br>call |
| 469행 | exception: exception | crypto.randomUUID()<br>call |

반환/조기 중단: 462행 readExperience(data) .support.slice() .reverse() .find((r) => r.body === supportDraft.text)?.id ?? crypto.randomUUID() [별도 조건식 없음]; 469행 crypto.randomUUID() [exception: exception]

## H-1e0b4aad2059

**@callback:readExperience(data)
          .support.slice()
          .reverse()
          .find** · [src/ui/brand-experience.tsx:466](../../../src/ui/brand-experience.tsx#L466)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-54db9fc651cc

**@callback:data.records
    .filter** · [src/ui/brand-experience.tsx:473](../../../src/ui/brand-experience.tsx#L473)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 473행 | 별도 조건식 없음 | ownRecord(data, r)<br>call → [H-4f8689c14ffb](ui__brand-experience.md#h-4f8689c14ffb) |
| 473행 | truthy: ownRecord(data, r) | r.body.trim()<br>call |

## H-781fe4e8a349

**@callback:data.records
    .filter((r) => ownRecord(data, r) && r.body.trim())
    .sort** · [src/ui/brand-experience.tsx:474](../../../src/ui/brand-experience.tsx#L474)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 474행 | 별도 조건식 없음 | a.createdAt.localeCompare(b.createdAt)<br>call |

## H-4d340855a950

**@callback:records.filter** · [src/ui/brand-experience.tsx:476](../../../src/ui/brand-experience.tsx#L476)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 478행 | falsy: !query | `${r.body} ${data.nodes.find((n) => n.id === r.targetId)?.name ?? ''}`.includes(query)<br>call |
| 478행 | falsy: !query | data.nodes.find((n) => n.id === r.targetId)<br>call<br>전달 콜백: H-71c15eb32c85 |

## H-71c15eb32c85

**@callback:data.nodes.find** · [src/ui/brand-experience.tsx:478](../../../src/ui/brand-experience.tsx#L478)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-47987a9be3fc

**@callback:records.filter** · [src/ui/brand-experience.tsx:480](../../../src/ui/brand-experience.tsx#L480)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 480행 | 별도 조건식 없음 | chosen.includes(r.id)<br>call |

## H-cee0cce64e32

**@callback:selected.map** · [src/ui/brand-experience.tsx:481](../../../src/ui/brand-experience.tsx#L481)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b70ceb3f56cb

**@callback:data.revisions
          .filter** · [src/ui/brand-experience.tsx:487](../../../src/ui/brand-experience.tsx#L487)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 489행 | truthy: includeHistory ∧ truthy: v.collection === 'records' | selectedIds.has(v.entityId)<br>call |

## H-2f6a12724566

**@callback:data.revisions
          .filter(
            (v) =>
              v.collection === 'records' &&
              selectedIds.has(v.entityId) &&
              v.userId === data.userId &&
              v.namespace === data.namespace,
          )
          .flatMap** · [src/ui/brand-experience.tsx:493](../../../src/ui/brand-experience.tsx#L493)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-13a24b5fc8ef

**@callback:data.revisions
          .filter(
            (v) =>
              v.collection === 'records' &&
              selectedIds.has(v.entityId) &&
              v.userId === data.userId &&
              v.namespace === data.namespace,
          )
          .flatMap((v) => [v.before, v.after])
          .filter** · [src/ui/brand-experience.tsx:494](../../../src/ui/brand-experience.tsx#L494)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 495행 | truthy: includeHistory | Boolean(v && 'sessionId' in v && selectedIds.has(v.id) && v.userId === data.userId && v.namespace === data.namespace)<br>call |
| 498행 | truthy: includeHistory ∧ truthy: v &&<br>              'sessionId' in v | selectedIds.has(v.id)<br>call |

## H-c897649f7c38

**@callback:versions.map** · [src/ui/brand-experience.tsx:506](../../../src/ui/brand-experience.tsx#L506)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ca92182516df

**@callback:[
    ...new Map(versions.map((r) => [`${r.id}:${r.version}`, r])).values(),
  ].sort** · [src/ui/brand-experience.tsx:507](../../../src/ui/brand-experience.tsx#L507)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 507행 | 별도 조건식 없음 | a.createdAt.localeCompare(b.createdAt)<br>call |

## H-13d435da6f3e

**@callback:uniqueVersions
    .map** · [src/ui/brand-experience.tsx:509](../../../src/ui/brand-experience.tsx#L509)

분기 조건과 가능한 갈림길:

- B-1c5c6aea0d1f · ConditionalExpression · r.dateEvidence.kind === 'exact' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (513행).
- B-3e4616f48b04 · ConditionalExpression · r.dateEvidence.kind === 'range' → truthy / falsy; 바깥 조건: falsy: r.dateEvidence.kind === 'exact' (515행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 511행 | 별도 조건식 없음 | data.nodes.find((n) => n.id === r.targetId && !n.deletedAt)<br>call<br>전달 콜백: H-029907f277ae |

반환/조기 중단: 518행 `${title}\n공부한 날짜: ${date}\n기록 ID: ${r.id} · 버전 ${r.version}\n\n${r.body}` [별도 조건식 없음]

## H-029907f277ae

**@callback:data.nodes.find** · [src/ui/brand-experience.tsx:511](../../../src/ui/brand-experience.tsx#L511)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-cccbb990eb19

**preserve** · [src/ui/brand-experience.tsx:524](../../../src/ui/brand-experience.tsx#L524)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 525행 | 별도 조건식 없음 | downloadText('manseeksong-preserved-records.json', JSON.stringify({ data: repository.getSnapshot(), experience: experience.state }, null, 2), 'application/json')<br>call |
| 527행 | 별도 조건식 없음 | JSON.stringify({ data: repository.getSnapshot(), experience: experience.state }, null, 2)<br>call |
| 527행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |

## H-222b7810bb1e

**saveRequest** · [src/ui/brand-experience.tsx:530](../../../src/ui/brand-experience.tsx#L530)

분기 조건과 가능한 갈림길:

- B-51d8bf83868d · IfStatement · supportDraft.blocked || !supportDraft.text.trim() → truthy / falsy; 바깥 조건: 별도 조건식 없음 (531행).
- B-4c6efa873e1f · IfStatement · experience.change((s) => { const prior = s.support.find((r) => r.id === supportId); const history = prior && prior.body !== supportDraft.text ? [ ...(prior.history ?? []), { id: crypto.randomUUID(), body: prior.body, updatedAt: prior.updatedAt }, ] : (prior?.history ?? []); return { ...s, support: [ ...s.support.filter((r) => r.id !== supportId), { id: supportId, body: supportDraft.text, updatedAt: new Date().toISOString(), history, }, ], }; }) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (532행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 531행 | falsy: supportDraft.blocked | supportDraft.text.trim()<br>preservation-boundary |
| 533행 | 별도 조건식 없음 | experience.change((s) => { const prior = s.support.find((r) => r.id === supportId); const history = prior && prior.body !== supportDraft.text ? [ ...(prior.history ?? []), { id: crypto.randomUUID(), body: prior.body, updatedAt: prior.updatedAt }, ] : (prior?.history ?? []); return { ...s, support: [ ...s.support.filter((r) => r.id !== supportId), { id: supportId, body: supportDraft.text, updatedAt: new Date().toISOString(), history, }, ], }; })<br>call<br>전달 콜백: H-d12a88cce198 |
| 556행 | truthy: experience.change((s) => {<br>        const prior = s.support.find((r) => r.id === supportId);<br>        const history =<br>          prior && prior.body !== supportDraft.text<br>            ? [<br>                ...(prior.history ?? []),<br>                { id: crypto.randomUUID(), body: prior.body, updatedAt: prior.updatedAt },<br>              ]<br>            : (prior?.history ?? []);<br>        return {<br>          ...s,<br>          support: [<br>            ...s.support.filter((r) => r.id !== supportId),<br>            {<br>              id: supportId,<br>              body: supportDraft.text,<br>              updatedAt: new Date().toISOString(),<br>              history,<br>            },<br>          ],<br>        };<br>      }) | setNotice('문제 메모를 이 기기에 보관했습니다. 외부 접수나 전송은 하지 않았습니다.')<br>state-update |

반환/조기 중단: 531행 <render> [truthy: supportDraft.blocked || !supportDraft.text.trim()]

## H-d12a88cce198

**@callback:experience.change** · [src/ui/brand-experience.tsx:533](../../../src/ui/brand-experience.tsx#L533)

분기 조건과 가능한 갈림길:

- B-6ee469c1e57a · ConditionalExpression · prior && prior.body !== supportDraft.text → truthy / falsy; 바깥 조건: 별도 조건식 없음 (536행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 534행 | 별도 조건식 없음 | s.support.find((r) => r.id === supportId)<br>call<br>전달 콜백: H-5bc6b0f82a50 |
| 539행 | truthy: prior && prior.body !== supportDraft.text | crypto.randomUUID()<br>call |
| 545행 | 별도 조건식 없음 | s.support.filter((r) => r.id !== supportId)<br>call<br>전달 콜백: H-5a08c64e404e |
| 549행 | 별도 조건식 없음 | new Date().toISOString()<br>call |

반환/조기 중단: 542행 { ...s, support: [ ...s.support.filter((r) => r.id !== supportId), { id: supportId, body: supportDraft.text, updatedAt: new Date().toISOString(), history, }, ], } [별도 조건식 없음]

## H-5bc6b0f82a50

**@callback:s.support.find** · [src/ui/brand-experience.tsx:534](../../../src/ui/brand-experience.tsx#L534)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-5a08c64e404e

**@callback:s.support.filter** · [src/ui/brand-experience.tsx:545](../../../src/ui/brand-experience.tsx#L545)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-52385ecc42f3

**@onChange** · [src/ui/brand-experience.tsx:623](../../../src/ui/brand-experience.tsx#L623)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 623행 | truthy: page === '/help' | supportDraft.input(e.target.value)<br>preservation-boundary |

## H-11271d1c0945

**@onClick** · [src/ui/brand-experience.tsx:637](../../../src/ui/brand-experience.tsx#L637)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 638행 | truthy: page === '/help' | downloadText(`manseeksong-inquiry-${supportId}.txt`, `메모 식별 번호: ${supportId}\n상태: 이 기기에 작성 · 외부 전송 없음\n\n${supportDraft.text}`)<br>call |

## H-b0d0a6faa1b7

**@callback:experience.state.support.some** · [src/ui/brand-experience.tsx:652](../../../src/ui/brand-experience.tsx#L652)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-74d5a6ad8ee8

**@onClick** · [src/ui/brand-experience.tsx:655](../../../src/ui/brand-experience.tsx#L655)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 656행 | truthy: page === '/help' | setSupportId(crypto.randomUUID())<br>state-update |
| 656행 | truthy: page === '/help' | crypto.randomUUID()<br>call |
| 657행 | truthy: page === '/help' | supportDraft.input('')<br>preservation-boundary |
| 658행 | truthy: page === '/help' | setNotice('이전 메모는 보관하고 새 메모를 엽니다.')<br>state-update |

## H-4f7debbaafe6

**@onChange** · [src/ui/brand-experience.tsx:671](../../../src/ui/brand-experience.tsx#L671)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 672행 | truthy: page === '/help' ∧ truthy: experience.state.support.length > 0 | setQuery(e.target.value)<br>state-update |
| 673행 | truthy: page === '/help' ∧ truthy: experience.state.support.length > 0 | setLimit(40)<br>state-update |

## H-1af430a7f203

**@callback:experience.state.support
                .filter** · [src/ui/brand-experience.tsx:677](../../../src/ui/brand-experience.tsx#L677)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 677행 | truthy: page === '/help' ∧ truthy: experience.state.support.length > 0 ∧ falsy: !query | `${r.id} ${r.body}`.includes(query)<br>call |

## H-a7f5d1ad3887

**@callback:experience.state.support
                .filter((r) => !query || `${r.id} ${r.body}`.includes(query))
                .slice()
                .reverse()
                .slice(0, limit)
                .map** · [src/ui/brand-experience.tsx:681](../../../src/ui/brand-experience.tsx#L681)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 685행 | truthy: page === '/help' ∧ truthy: experience.state.support.length > 0 | new Date(r.updatedAt).toLocaleString('ko-KR')<br>call |
| 688행 | truthy: page === '/help' ∧ truthy: experience.state.support.length > 0 | Boolean(r.history?.length)<br>call |

## H-1de748ff46e1

**@onClick** · [src/ui/brand-experience.tsx:702](../../../src/ui/brand-experience.tsx#L702)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 703행 | truthy: page === '/help' ∧ truthy: experience.state.support.length > 0 | downloadText(`manseeksong-inquiry-${r.id}.txt`, `메모 식별 번호: ${r.id}\n상태: 이 기기에 보관 · 외부 전송 없음\n\n${r.body}`)<br>call |

## H-026790b628b4

**@callback:experience.state.support.some** · [src/ui/brand-experience.tsx:714](../../../src/ui/brand-experience.tsx#L714)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 714행 | truthy: page === '/help' ∧ truthy: experience.state.support.length > 0 ∧ falsy: !query | `${r.id} ${r.body}`.includes(query)<br>call |

## H-33016dcf190c

**@callback:experience.state.support.filter** · [src/ui/brand-experience.tsx:716](../../../src/ui/brand-experience.tsx#L716)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 716행 | truthy: page === '/help' ∧ truthy: experience.state.support.length > 0 ∧ falsy: !query | `${r.id} ${r.body}`.includes(query)<br>call |

## H-ec0d2f5752da

**@onClick** · [src/ui/brand-experience.tsx:718](../../../src/ui/brand-experience.tsx#L718)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 718행 | truthy: page === '/help' ∧ truthy: experience.state.support.length > 0 ∧ truthy: experience.state.support.filter((r) => !query \|\| `${r.id} ${r.body}`.includes(query))<br>                .length > limit | setLimit((n) => n + 40)<br>state-update<br>전달 콜백: H-c8ff96c85c0c |

## H-c8ff96c85c0c

**@callback:setLimit** · [src/ui/brand-experience.tsx:718](../../../src/ui/brand-experience.tsx#L718)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-571de56c44d9

**@onChange** · [src/ui/brand-experience.tsx:739](../../../src/ui/brand-experience.tsx#L739)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 740행 | truthy: page === '/my-progress' | setQuery(e.target.value)<br>state-update |
| 741행 | truthy: page === '/my-progress' | setLimit(40)<br>state-update |

## H-7773d8d9140b

**@callback:selectable.slice(0, limit).map** · [src/ui/brand-experience.tsx:747](../../../src/ui/brand-experience.tsx#L747)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 750행 | truthy: page === '/my-progress' | data.nodes.find((n) => n.id === r.targetId)<br>call<br>전달 콜백: H-7631836e6311 |
| 750행 | truthy: page === '/my-progress' | r.body.slice(0, 70)<br>call |
| 751행 | truthy: page === '/my-progress' | chosen.includes(r.id)<br>call |

## H-7631836e6311

**@callback:data.nodes.find** · [src/ui/brand-experience.tsx:750](../../../src/ui/brand-experience.tsx#L750)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-2ba3814b7cae

**@onChange** · [src/ui/brand-experience.tsx:752](../../../src/ui/brand-experience.tsx#L752)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 753행 | truthy: page === '/my-progress' | setChosen((s) => e.target.checked ? [...s, r.id] : s.filter((id) => id !== r.id))<br>state-update<br>전달 콜백: H-4bcd399a93d7 |

## H-4bcd399a93d7

**@callback:setChosen** · [src/ui/brand-experience.tsx:753](../../../src/ui/brand-experience.tsx#L753)

분기 조건과 가능한 갈림길:

- B-340c22fb762d · ConditionalExpression · e.target.checked → truthy / falsy; 바깥 조건: truthy: page === '/my-progress' (754행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 754행 | truthy: page === '/my-progress' ∧ falsy: e.target.checked | s.filter((id) => id !== r.id)<br>call<br>전달 콜백: H-9aae678e277c |

## H-9aae678e277c

**@callback:s.filter** · [src/ui/brand-experience.tsx:754](../../../src/ui/brand-experience.tsx#L754)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e7faee3516f4

**@onClick** · [src/ui/brand-experience.tsx:760](../../../src/ui/brand-experience.tsx#L760)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 760행 | truthy: page === '/my-progress' ∧ truthy: selectable.length > limit | setLimit((n) => n + 40)<br>state-update<br>전달 콜백: H-c48046109ed2 |

## H-c48046109ed2

**@callback:setLimit** · [src/ui/brand-experience.tsx:760](../../../src/ui/brand-experience.tsx#L760)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-cc889f93ab18

**@onChange** · [src/ui/brand-experience.tsx:766](../../../src/ui/brand-experience.tsx#L766)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 766행 | truthy: page === '/my-progress' | setIncludeHistory(e.target.checked)<br>state-update |

## H-e368b8448636

**@onClick** · [src/ui/brand-experience.tsx:775](../../../src/ui/brand-experience.tsx#L775)

분기 조건과 가능한 갈림길:

- B-704014dbef92 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: page === '/my-progress' (777행).
- B-1dcd46da1f03 · CatchClause · 구조 분기 → exception; 바깥 조건: truthy: page === '/my-progress' (779행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 776행 | truthy: page === '/my-progress' | downloadText('manseeksong-selected-thinking.txt', exportText)<br>call |
| 778행 | truthy: page === '/my-progress' | trackExperience(data, 'share-download')<br>call |
| 782행 | truthy: page === '/my-progress' | setNotice('선택한 글의 파일 다운로드를 요청했습니다. 외부 공개나 게시를 하지 않았습니다.')<br>state-update |

## H-8d8414308a27

**@onChange** · [src/ui/brand-experience.tsx:801](../../../src/ui/brand-experience.tsx#L801)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 802행 | truthy: page === '/my-progress' | experience.change((s) => ({ ...s, measurement: { ...s.measurement, enabled: e.target.checked, startedAt: e.target.checked ? (s.measurement.startedAt ?? new Date().toISOString()) : s.measurement.startedAt, }, }))<br>call<br>전달 콜백: H-4da35dd78bd4 |

## H-4da35dd78bd4

**@callback:experience.change** · [src/ui/brand-experience.tsx:802](../../../src/ui/brand-experience.tsx#L802)

분기 조건과 가능한 갈림길:

- B-bd6d1580ed8a · ConditionalExpression · e.target.checked → truthy / falsy; 바깥 조건: truthy: page === '/my-progress' (807행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 808행 | truthy: page === '/my-progress' ∧ truthy: e.target.checked ∧ nullish: s.measurement.startedAt | new Date().toISOString()<br>call |

## H-4c43e5223886

**@callback:(['resume', 'reuse', 'next-step', 'share-download'] as const).map** · [src/ui/brand-experience.tsx:820](../../../src/ui/brand-experience.tsx#L820)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 823행 | truthy: page === '/my-progress' | experience.state.measurement.events.filter((e) => e.action === action)<br>call<br>전달 콜백: H-66e59203cd48 |

## H-66e59203cd48

**@callback:experience.state.measurement.events.filter** · [src/ui/brand-experience.tsx:823](../../../src/ui/brand-experience.tsx#L823)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ac3e9687956f

**@onClick** · [src/ui/brand-experience.tsx:832](../../../src/ui/brand-experience.tsx#L832)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 833행 | truthy: page === '/my-progress' | downloadText('manseeksong-use-observations.json', JSON.stringify(experience.state.measurement, null, 2), 'application/json')<br>call |
| 835행 | truthy: page === '/my-progress' | JSON.stringify(experience.state.measurement, null, 2)<br>call |

## H-401b6680f101

**@onClick** · [src/ui/brand-experience.tsx:843](../../../src/ui/brand-experience.tsx#L843)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 844행 | truthy: page === '/my-progress' | experience.change((s) => ({ ...s, measurement: { enabled: false, startedAt: null, events: [] }, }))<br>call<br>전달 콜백: H-07134b5e1623 |

## H-07134b5e1623

**@callback:experience.change** · [src/ui/brand-experience.tsx:844](../../../src/ui/brand-experience.tsx#L844)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

