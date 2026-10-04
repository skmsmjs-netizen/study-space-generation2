# src/ui/concept-interactives.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-3f26ae25a244

**ConceptInteractives** · [src/ui/concept-interactives.tsx:12](../../../src/ui/concept-interactives.tsx#L12)

분기 조건과 가능한 갈림길:

- B-3e3a53c89f46 · ConditionalExpression · error → truthy / falsy; 바깥 조건: 별도 조건식 없음 (109행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 13행 | 별도 조건식 없음 | useRef(null)<br>call |
| 14행 | 별도 조건식 없음 | useState(900)<br>call |
| 15행 | 별도 조건식 없음 | useState(false)<br>call |
| 16행 | 별도 조건식 없음 | useState('')<br>call |
| 17행 | 별도 조건식 없음 | useState(0)<br>call |
| 18행 | 별도 조건식 없음 | conceptInteractiveViewKey(data)<br>call |
| 20행 | 별도 조건식 없음 | useEffect(() => { setReady(false); setError(''); const timeout = setTimeout( () => setError('개념 탐구실 화면을 열지 못했습니다. 저장된 보기는 유지했습니다.'), 10_000, ); const appearance = () => { const computed = getComputedStyle(document.body), tokens: Record<string, string> = {}; // Forward only presentation properties. No records, credentials or account IDs enter the frame. for (const name of Array.from(computed)) if (name.startsWith('--')) tokens[name] = computed.getPropertyValue(name).trim(); // Reuse the surrounding workspace's generated observatory palette without // replacing mathematical colors or the user's global presentation tokens. const workspace = iframe.current?.closest('.math-explorer'); if (workspace) { cons … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-3c4ebecbba50 |

반환/조기 중단: 107행 <render> [별도 조건식 없음]

## H-3c4ebecbba50

**@callback:useEffect** · [src/ui/concept-interactives.tsx:20](../../../src/ui/concept-interactives.tsx#L20)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 21행 | 별도 조건식 없음 | setReady(false)<br>state-update |
| 22행 | 별도 조건식 없음 | setError('')<br>state-update |
| 23행 | 별도 조건식 없음 | setTimeout(() => setError('개념 탐구실 화면을 열지 못했습니다. 저장된 보기는 유지했습니다.'), 10_000)<br>state-update<br>전달 콜백: H-4026f689bb8f |
| 91행 | 별도 조건식 없음 | window.addEventListener('message', receive)<br>call<br>전달 콜백: H-1a8e31595239 |
| 93행 | 별도 조건식 없음 | observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style', 'class'], })<br>call |
| 97행 | 별도 조건식 없음 | observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] })<br>call |
| 98행 | 별도 조건식 없음 | matchMedia('(prefers-color-scheme: dark)')<br>call |
| 99행 | 별도 조건식 없음 | media.addEventListener('change', appearance)<br>call<br>전달 콜백: H-dba84ad42d6d |

반환/조기 중단: 100행 () => { clearTimeout(timeout); window.removeEventListener('message', receive); observer.disconnect(); media.removeEventListener('change', appearance); } [별도 조건식 없음]

## H-4026f689bb8f

**@callback:setTimeout** · [src/ui/concept-interactives.tsx:24](../../../src/ui/concept-interactives.tsx#L24)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 24행 | 별도 조건식 없음 | setError('개념 탐구실 화면을 열지 못했습니다. 저장된 보기는 유지했습니다.')<br>state-update |

## H-dba84ad42d6d

**appearance** · [src/ui/concept-interactives.tsx:27](../../../src/ui/concept-interactives.tsx#L27)

분기 조건과 가능한 갈림길:

- B-47f13498f9b7 · IfStatement · name.startsWith('--') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (32행).
- B-6431a6b1dc93 · IfStatement · workspace → truthy / falsy; 바깥 조건: 별도 조건식 없음 (36행).
- B-2a93035c07fd · IfStatement · name.startsWith('--math-observatory-') → truthy / falsy; 바깥 조건: truthy: workspace (39행).
- B-b3c928ce5cbb · ConditionalExpression · document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (43행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 28행 | 별도 조건식 없음 | getComputedStyle(document.body)<br>call |
| 31행 | 별도 조건식 없음 | Array.from(computed)<br>call |
| 32행 | 별도 조건식 없음 | name.startsWith('--')<br>call |
| 32행 | truthy: name.startsWith('--') | computed.getPropertyValue(name).trim()<br>call |
| 32행 | truthy: name.startsWith('--') | computed.getPropertyValue(name)<br>call |
| 37행 | truthy: workspace | getComputedStyle(workspace)<br>call |
| 38행 | truthy: workspace | Array.from(appearance)<br>call |
| 39행 | truthy: workspace | name.startsWith('--math-observatory-')<br>call |
| 40행 | truthy: workspace ∧ truthy: name.startsWith('--math-observatory-') | appearance.getPropertyValue(name).trim()<br>call |
| 40행 | truthy: workspace ∧ truthy: name.startsWith('--math-observatory-') | appearance.getPropertyValue(name)<br>call |
| 45행 | falsy: document.documentElement.dataset.theme === 'dark' ∧ truthy: !document.documentElement.dataset.theme | matchMedia('(prefers-color-scheme: dark)')<br>call |

## H-1a8e31595239

**receive** · [src/ui/concept-interactives.tsx:53](../../../src/ui/concept-interactives.tsx#L53)

분기 조건과 가능한 갈림길:

- B-74709c382fe9 · IfStatement · event.source !== iframe.current?.contentWindow || event.origin !== location.origin || event.data?.channel !== channel → truthy / falsy; 바깥 조건: 별도 조건식 없음 (54행).
- B-d1e0dd4cc7de · IfStatement · message.action === 'size' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (61행).
- B-b704f71e5960 · IfStatement · Number.isFinite(message.height) && message.height > 0 && message.height < 50_000 → truthy / falsy; 바깥 조건: truthy: message.action === 'size' (62행).
- B-2f69aa96ddfb · IfStatement · !['read', 'write'].includes(message.action) || !Number.isSafeInteger(message.id) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (66행).
- B-4d20ccd88233 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (71행).
- B-f082b6e1e241 · IfStatement · message.action === 'read' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (72행).
- B-ee2f48fb6e3c · CatchClause · error → exception; 바깥 조건: 별도 조건식 없음 (77행).
- B-9bc974ad33a4 · ConditionalExpression · error instanceof Error → truthy / falsy; 바깥 조건: exception: error (79행).
- B-8ae795aa4041 · IfStatement · message.action === 'read' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (84행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 62행 | truthy: message.action === 'size' | Number.isFinite(message.height)<br>call |
| 63행 | truthy: message.action === 'size' ∧ truthy: Number.isFinite(message.height) && message.height > 0 && message.height < 50_000 | setHeight(message.height)<br>state-update |
| 66행 | 별도 조건식 없음 | ['read', 'write'].includes(message.action)<br>call |
| 66행 | falsy: !['read', 'write'].includes(message.action) | Number.isSafeInteger(message.id)<br>call |
| 72행 | truthy: message.action === 'read' | readConceptInteractiveView(key)<br>call |
| 74행 | falsy: message.action === 'read' | writeConceptInteractiveView(key, message.value)<br>call |
| 85행 | truthy: message.action === 'read' | clearTimeout(timeout)<br>call |
| 86행 | truthy: message.action === 'read' | setError('')<br>state-update |
| 87행 | truthy: message.action === 'read' | setReady(true)<br>state-update |
| 88행 | truthy: message.action === 'read' | appearance()<br>call → [H-dba84ad42d6d](ui__concept-interactives.md#h-dba84ad42d6d) |

반환/조기 중단: 59행 <render> [truthy: event.source !== iframe.current?.contentWindow ||
        event.origin !== location.origin ||
        event.data?.channel !== channel]; 64행 <render> [truthy: message.action === 'size']; 66행 <render> [truthy: !['read', 'write'].includes(message.action) || !Number.isSafeInteger(message.id)]

## H-3306784e28eb

**@onClick** · [src/ui/concept-interactives.tsx:112](../../../src/ui/concept-interactives.tsx#L112)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 112행 | truthy: error | setAttempt((value) => value + 1)<br>state-update<br>전달 콜백: H-78dde19e1ba5 |

## H-78dde19e1ba5

**@callback:setAttempt** · [src/ui/concept-interactives.tsx:112](../../../src/ui/concept-interactives.tsx#L112)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

