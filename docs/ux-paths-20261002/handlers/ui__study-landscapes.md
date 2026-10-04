# src/ui/study-landscapes.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-3de7338a1857

**defaults** · [src/ui/study-landscapes.tsx:24](../../../src/ui/study-landscapes.tsx#L24)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 28행 | 별도 조건식 없음 | scenes.map((scene) => scene.id)<br>call<br>전달 콜백: H-6a3d1611fda7 |

## H-6a3d1611fda7

**@callback:scenes.map** · [src/ui/study-landscapes.tsx:28](../../../src/ui/study-landscapes.tsx#L28)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-00f93d329e08

**readPreferences** · [src/ui/study-landscapes.tsx:30](../../../src/ui/study-landscapes.tsx#L30)

분기 조건과 가능한 갈림길:

- B-2374de0902c8 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (31행).
- B-992bf44ae25d · IfStatement · !raw → truthy / falsy; 바깥 조건: 별도 조건식 없음 (33행).
- B-4db80421113e · IfStatement · !saved || typeof saved !== 'object' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (35행).
- B-6275bc20b72e · IfStatement · value.version !== 1 || typeof value.paused !== 'boolean' || !Array.isArray(value.visible) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (37행).
- B-d37b1db861bd · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (46행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 32행 | 별도 조건식 없음 | localStorage.getItem(key)<br>preservation-boundary |
| 33행 | truthy: !raw | defaults()<br>call → [H-3de7338a1857](ui__study-landscapes.md#h-3de7338a1857) |
| 34행 | 별도 조건식 없음 | JSON.parse(raw)<br>call |
| 35행 | truthy: !saved \|\| typeof saved !== 'object' | defaults()<br>call → [H-3de7338a1857](ui__study-landscapes.md#h-3de7338a1857) |
| 37행 | falsy: value.version !== 1 \|\| typeof value.paused !== 'boolean' | Array.isArray(value.visible)<br>call |
| 38행 | truthy: value.version !== 1 \|\| typeof value.paused !== 'boolean' \|\| !Array.isArray(value.visible) | defaults()<br>call → [H-3de7338a1857](ui__study-landscapes.md#h-3de7338a1857) |
| 44행 | 별도 조건식 없음 | scenes.map((scene) => scene.id).filter((id) => visible.includes(id))<br>call<br>전달 콜백: H-b956a83eb812 |
| 44행 | 별도 조건식 없음 | scenes.map((scene) => scene.id)<br>call<br>전달 콜백: H-2a526e1e42ad |
| 47행 | exception: exception | defaults()<br>call → [H-3de7338a1857](ui__study-landscapes.md#h-3de7338a1857) |

반환/조기 중단: 33행 defaults() [truthy: !raw]; 35행 defaults() [truthy: !saved || typeof saved !== 'object']; 38행 defaults() [truthy: value.version !== 1 || typeof value.paused !== 'boolean' || !Array.isArray(value.visible)]; 40행 { version: 1, paused: value.paused, world: 'observatory', visible: scenes.map((scene) => scene.id).filter((id) => visible.includes(id)), } [별도 조건식 없음]; 47행 defaults() [exception: exception]

## H-2a526e1e42ad

**@callback:scenes.map** · [src/ui/study-landscapes.tsx:44](../../../src/ui/study-landscapes.tsx#L44)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b956a83eb812

**@callback:scenes.map((scene) => scene.id).filter** · [src/ui/study-landscapes.tsx:44](../../../src/ui/study-landscapes.tsx#L44)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 44행 | 별도 조건식 없음 | visible.includes(id)<br>call |

## H-081406a2d7f6

**StudyLandscapes** · [src/ui/study-landscapes.tsx:51](../../../src/ui/study-landscapes.tsx#L51)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 66행 | 별도 조건식 없음 | storagePrefix(data)<br>call |
| 66행 | 별도 조건식 없음 | encodeURIComponent(data.userId)<br>call |

반환/조기 중단: 68행 <render> [별도 조건식 없음]

## H-75b30f90f0ff

**Landscapes** · [src/ui/study-landscapes.tsx:81](../../../src/ui/study-landscapes.tsx#L81)

분기 조건과 가능한 갈림길:

- B-4ceb60b04b05 · ConditionalExpression · motion → truthy / falsy; 바깥 조건: 별도 조건식 없음 (206행).
- B-4e7fc6501617 · ConditionalExpression · !motionEnabled → truthy / falsy; 바깥 조건: 별도 조건식 없음 (222행).
- B-099b7b4efcde · ConditionalExpression · preferences.paused → truthy / falsy; 바깥 조건: falsy: !motionEnabled (222행).
- B-c2906672a9c8 · ConditionalExpression · preferences.paused → truthy / falsy; 바깥 조건: 별도 조건식 없음 (228행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 98행 | 별도 조건식 없음 | useState(() => readPreferences(preferenceKey))<br>call<br>전달 콜백: H-1795ab65e88d |
| 99행 | 별도 조건식 없음 | useState(false)<br>call |
| 100행 | 별도 조건식 없음 | useRef(null)<br>call |
| 101행 | 별도 조건식 없음 | useState(true)<br>call |
| 102행 | 별도 조건식 없음 | useMotionEnabled()<br>call → [H-f857690626c5](ui__motion.md#h-f857690626c5) |
| 103행 | 별도 조건식 없음 | useState(() => Date.now())<br>call<br>전달 콜백: H-7b673c09da26 |
| 105행 | 별도 조건식 없음 | useMemo(() => observatorySkyAt(instant), [instant])<br>call<br>전달 콜백: H-348e075869d8 |
| 106행 | nullish: referenceDay | studyInputDay(instant)<br>call |
| 107행 | 별도 조건식 없음 | useId()<br>call |
| 109행 | 별도 조건식 없음 | useMemo(() => buildStudyLandscape( { records: data.records, subjects: data.subjects, sessions: data.sessions, userId: data.userId, namespace: data.namespace, }, scope === undefined ? undefined : scope.split('\u0000').filter(Boolean), day, ), [data.records, data.subjects, data.sessions, data.userId, data.namespace, scope, day])<br>call<br>전달 콜백: H-1f5bc002d14d |
| 124행 | 별도 조건식 없음 | useMemo(() => buildObservatoryEvents( landscape, instant, `${data.namespace}:${data.userId}`, referenceEvent, referenceVariant, ), [landscape, instant, data.namespace, data.userId, referenceEvent, referenceVariant])<br>call<br>전달 콜백: H-7a8146334ea7 |
| 135행 | 별도 조건식 없음 | useEffect(() => { if (referenceTime !== undefined) return; let timer: ReturnType<typeof setTimeout>; const update = () => { clearTimeout(timer); if (document.visibilityState === 'hidden') return; const now = Date.now(); setClock(now); timer = setTimeout(update, 60000 - (now % 60000)); }; update(); document.addEventListener('visibilitychange', update); window.addEventListener('pageshow', update); return () => { clearTimeout(timer); document.removeEventListener('visibilitychange', update); window.removeEventListener('pageshow', update); }; }, [referenceTime])<br>call<br>전달 콜백: H-5a04f2fe176c |
| 154행 | 별도 조건식 없음 | useEffect(() => { const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver((entries) => setOnScreen(entries[0]?.isIntersecting ?? false)); if (root.current) observer?.observe(root.current); return () => observer?.disconnect(); }, [])<br>call<br>전달 콜백: H-f51483b92af5 |
| 162행 | 별도 조건식 없음 | useEffect(() => { const update = (event: StorageEvent) => { if (event.storageArea === localStorage && event.key === preferenceKey) setPreferences(readPreferences(preferenceKey)); }; window.addEventListener('storage', update); return () => window.removeEventListener('storage', update); }, [preferenceKey])<br>call<br>전달 콜백: H-4f1794b1cd90 |
| 182행 | 별도 조건식 없음 | useRef(null)<br>call |
| 183행 | 별도 조건식 없음 | useRef(response)<br>call |
| 184행 | 별도 조건식 없음 | preferences.visible.join(',')<br>call |
| 185행 | 별도 조건식 없음 | useEffect(() => { latestResponse.current = response; pointer.current?.updateResponse(response); }, [response])<br>call<br>전달 콜백: H-1ee85c53318d |
| 189행 | 별도 조건식 없음 | useEffect(() => { const element = root.current; if (!element) return; if (!motion \|\| !visibleScenes) return; const controller = connectObservatoryPointer(element, latestResponse.current); pointer.current = controller; return () => { controller(); pointer.current = null; }; }, [motion, visibleScenes])<br>call<br>전달 콜백: H-b7845e294a9d |
| 211행 | 별도 조건식 없음 | events.map((event) => event.spec.id).join(',')<br>call |
| 211행 | 별도 조건식 없음 | events.map((event) => event.spec.id)<br>call<br>전달 콜백: H-4a9e387b68a0 |
| 212행 | 별도 조건식 없음 | observatoryPresentation(landscape, response, sky)<br>call |
| 247행 | 별도 조건식 없음 | scenes.map((scene, index) => ( <Checkbox key={scene.id} label={['별빛', '혜성', '궤도'][index]} checked={preferences.visible.includes(scene.id)} onChange={(event) => change({ ...preferences, visible: event.target.checked ? [...preferences.visible, scene.id] : preferences.visible.filter((id) => id !== scene.id), }) } /> ))<br>call<br>전달 콜백: H-b474625a31d0 |

반환/조기 중단: 201행 <render> [별도 조건식 없음]

## H-1795ab65e88d

**@callback:useState** · [src/ui/study-landscapes.tsx:98](../../../src/ui/study-landscapes.tsx#L98)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 98행 | 별도 조건식 없음 | readPreferences(preferenceKey)<br>call → [H-00f93d329e08](ui__study-landscapes.md#h-00f93d329e08) |

## H-7b673c09da26

**@callback:useState** · [src/ui/study-landscapes.tsx:103](../../../src/ui/study-landscapes.tsx#L103)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 103행 | 별도 조건식 없음 | Date.now()<br>call |

## H-348e075869d8

**@callback:useMemo** · [src/ui/study-landscapes.tsx:105](../../../src/ui/study-landscapes.tsx#L105)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 105행 | 별도 조건식 없음 | observatorySkyAt(instant)<br>call |

## H-1f5bc002d14d

**@callback:useMemo** · [src/ui/study-landscapes.tsx:110](../../../src/ui/study-landscapes.tsx#L110)

분기 조건과 가능한 갈림길:

- B-eb302e1ff76c · ConditionalExpression · scope === undefined → truthy / falsy; 바깥 조건: 별도 조건식 없음 (119행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 111행 | 별도 조건식 없음 | buildStudyLandscape({ records: data.records, subjects: data.subjects, sessions: data.sessions, userId: data.userId, namespace: data.namespace, }, scope === undefined ? undefined : scope.split('\u0000').filter(Boolean), day)<br>call |
| 119행 | falsy: scope === undefined | scope.split('\u0000').filter(Boolean)<br>call |
| 119행 | falsy: scope === undefined | scope.split('\u0000')<br>call |

## H-7a8146334ea7

**@callback:useMemo** · [src/ui/study-landscapes.tsx:125](../../../src/ui/study-landscapes.tsx#L125)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 126행 | 별도 조건식 없음 | buildObservatoryEvents(landscape, instant, `${data.namespace}:${data.userId}`, referenceEvent, referenceVariant)<br>call |

## H-5a04f2fe176c

**@callback:useEffect** · [src/ui/study-landscapes.tsx:135](../../../src/ui/study-landscapes.tsx#L135)

분기 조건과 가능한 갈림길:

- B-fcf6a2cfe903 · IfStatement · referenceTime !== undefined → truthy / falsy; 바깥 조건: 별도 조건식 없음 (136행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 145행 | 별도 조건식 없음 | update()<br>call → [H-59701a0f1c5d](ui__study-landscapes.md#h-59701a0f1c5d) |
| 146행 | 별도 조건식 없음 | document.addEventListener('visibilitychange', update)<br>call<br>전달 콜백: H-59701a0f1c5d |
| 147행 | 별도 조건식 없음 | window.addEventListener('pageshow', update)<br>call<br>전달 콜백: H-59701a0f1c5d |

반환/조기 중단: 136행 <render> [truthy: referenceTime !== undefined]; 148행 () => { clearTimeout(timer); document.removeEventListener('visibilitychange', update); window.removeEventListener('pageshow', update); } [별도 조건식 없음]

## H-59701a0f1c5d

**update** · [src/ui/study-landscapes.tsx:138](../../../src/ui/study-landscapes.tsx#L138)

분기 조건과 가능한 갈림길:

- B-c6e9b8292826 · IfStatement · document.visibilityState === 'hidden' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (140행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 139행 | 별도 조건식 없음 | clearTimeout(timer)<br>call |
| 141행 | 별도 조건식 없음 | Date.now()<br>call |
| 142행 | 별도 조건식 없음 | setClock(now)<br>state-update |
| 143행 | 별도 조건식 없음 | setTimeout(update, 60000 - (now % 60000))<br>state-update<br>전달 콜백: H-59701a0f1c5d |

반환/조기 중단: 140행 <render> [truthy: document.visibilityState === 'hidden']

## H-f51483b92af5

**@callback:useEffect** · [src/ui/study-landscapes.tsx:154](../../../src/ui/study-landscapes.tsx#L154)

분기 조건과 가능한 갈림길:

- B-24970ae4a425 · ConditionalExpression · typeof IntersectionObserver === 'undefined' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (156행).
- B-30bb83028b14 · IfStatement · root.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (159행).

반환/조기 중단: 160행 () => observer?.disconnect() [별도 조건식 없음]

## H-4f1794b1cd90

**@callback:useEffect** · [src/ui/study-landscapes.tsx:162](../../../src/ui/study-landscapes.tsx#L162)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 167행 | 별도 조건식 없음 | window.addEventListener('storage', update)<br>call<br>전달 콜백: H-4028674be55b |

반환/조기 중단: 168행 () => window.removeEventListener('storage', update) [별도 조건식 없음]

## H-4028674be55b

**update** · [src/ui/study-landscapes.tsx:163](../../../src/ui/study-landscapes.tsx#L163)

분기 조건과 가능한 갈림길:

- B-ca6241006f5f · IfStatement · event.storageArea === localStorage && event.key === preferenceKey → truthy / falsy; 바깥 조건: 별도 조건식 없음 (164행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 165행 | truthy: event.storageArea === localStorage && event.key === preferenceKey | setPreferences(readPreferences(preferenceKey))<br>state-update |
| 165행 | truthy: event.storageArea === localStorage && event.key === preferenceKey | readPreferences(preferenceKey)<br>call → [H-00f93d329e08](ui__study-landscapes.md#h-00f93d329e08) |

## H-e471c1feacf7

**change** · [src/ui/study-landscapes.tsx:170](../../../src/ui/study-landscapes.tsx#L170)

분기 조건과 가능한 갈림길:

- B-77ab2fb35609 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (172행).
- B-7b6787179a6c · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (175행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 171행 | 별도 조건식 없음 | setPreferences(next)<br>state-update |
| 173행 | 별도 조건식 없음 | localStorage.setItem(preferenceKey, JSON.stringify(next))<br>preservation-boundary |
| 173행 | 별도 조건식 없음 | JSON.stringify(next)<br>call |
| 174행 | 별도 조건식 없음 | setStorageError(false)<br>state-update |
| 176행 | exception: exception | setStorageError(true)<br>state-update |

## H-1ee85c53318d

**@callback:useEffect** · [src/ui/study-landscapes.tsx:185](../../../src/ui/study-landscapes.tsx#L185)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b7845e294a9d

**@callback:useEffect** · [src/ui/study-landscapes.tsx:189](../../../src/ui/study-landscapes.tsx#L189)

분기 조건과 가능한 갈림길:

- B-9ac3c361600d · IfStatement · !element → truthy / falsy; 바깥 조건: 별도 조건식 없음 (191행).
- B-84e2c4a90f7b · IfStatement · !motion || !visibleScenes → truthy / falsy; 바깥 조건: 별도 조건식 없음 (192행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 193행 | 별도 조건식 없음 | connectObservatoryPointer(element, latestResponse.current)<br>call |

반환/조기 중단: 191행 <render> [truthy: !element]; 192행 <render> [truthy: !motion || !visibleScenes]; 195행 () => { controller(); pointer.current = null; } [별도 조건식 없음]

## H-4a9e387b68a0

**@callback:events.map** · [src/ui/study-landscapes.tsx:211](../../../src/ui/study-landscapes.tsx#L211)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-fb44afd40b1e

**@onClick** · [src/ui/study-landscapes.tsx:225](../../../src/ui/study-landscapes.tsx#L225)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 225행 | 별도 조건식 없음 | change({ ...preferences, paused: !preferences.paused })<br>call → [H-e471c1feacf7](ui__study-landscapes.md#h-e471c1feacf7) |

## H-b474625a31d0

**@callback:scenes.map** · [src/ui/study-landscapes.tsx:247](../../../src/ui/study-landscapes.tsx#L247)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 251행 | 별도 조건식 없음 | preferences.visible.includes(scene.id)<br>call |

## H-290dd0f39ba5

**@onChange** · [src/ui/study-landscapes.tsx:252](../../../src/ui/study-landscapes.tsx#L252)

분기 조건과 가능한 갈림길:

- B-ee3acef40bef · ConditionalExpression · event.target.checked → truthy / falsy; 바깥 조건: 별도 조건식 없음 (255행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 253행 | 별도 조건식 없음 | change({ ...preferences, visible: event.target.checked ? [...preferences.visible, scene.id] : preferences.visible.filter((id) => id !== scene.id), })<br>call → [H-e471c1feacf7](ui__study-landscapes.md#h-e471c1feacf7) |
| 257행 | falsy: event.target.checked | preferences.visible.filter((id) => id !== scene.id)<br>call<br>전달 콜백: H-8229113a7dd6 |

## H-8229113a7dd6

**@callback:preferences.visible.filter** · [src/ui/study-landscapes.tsx:257](../../../src/ui/study-landscapes.tsx#L257)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-31b9e7a3214f

**@onClick** · [src/ui/study-landscapes.tsx:262](../../../src/ui/study-landscapes.tsx#L262)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 262행 | 별도 조건식 없음 | change(defaults())<br>call → [H-e471c1feacf7](ui__study-landscapes.md#h-e471c1feacf7) |
| 262행 | 별도 조건식 없음 | defaults()<br>call → [H-3de7338a1857](ui__study-landscapes.md#h-3de7338a1857) |

## H-a21a4a149216

**@onClick** · [src/ui/study-landscapes.tsx:272](../../../src/ui/study-landscapes.tsx#L272)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 272행 | truthy: storageError | change(preferences)<br>call → [H-e471c1feacf7](ui__study-landscapes.md#h-e471c1feacf7) |

