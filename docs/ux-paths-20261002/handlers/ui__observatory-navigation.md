# src/ui/observatory-navigation.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-3299b2110bb1

**readJourney** · [src/ui/observatory-navigation.tsx:18](../../../src/ui/observatory-navigation.tsx#L18)

분기 조건과 가능한 갈림길:

- B-6ba4592d0823 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (19행).
- B-fddf18987b82 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (21행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 20행 | 별도 조건식 없음 | restoreJourney(JSON.parse(sessionStorage.getItem(key) \|\| 'null'), route, place)<br>call |
| 20행 | 별도 조건식 없음 | JSON.parse(sessionStorage.getItem(key) \|\| 'null')<br>call |
| 20행 | 별도 조건식 없음 | sessionStorage.getItem(key)<br>preservation-boundary |
| 22행 | exception: exception | restoreJourney(null, route, place)<br>call |

반환/조기 중단: 20행 restoreJourney(JSON.parse(sessionStorage.getItem(key) || 'null'), route, place) [별도 조건식 없음]; 22행 restoreJourney(null, route, place) [exception: exception]

## H-2779eeb2ca9b

**useObservatoryJourney** · [src/ui/observatory-navigation.tsx:27](../../../src/ui/observatory-navigation.tsx#L27)

분기 조건과 가능한 갈림길:

- B-2cf2b587a7e2 · IfStatement · stored.key !== key → truthy / falsy; 바깥 조건: 별도 조건식 없음 (32행).
- B-bd33a31eb6be · IfStatement · journey.current.route !== route → truthy / falsy; 바깥 조건: falsy: stored.key !== key (33행).
- B-091dfe666f63 · IfStatement · stored.key !== key || journey !== stored.journey → truthy / falsy; 바깥 조건: 별도 조건식 없음 (34행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 28행 | 별도 조건식 없음 | storagePrefix(data)<br>call |
| 29행 | 별도 조건식 없음 | routePlace(route, data.nodes.find((node) => route === `/node/${node.id}`)?.role)<br>call |
| 29행 | 별도 조건식 없음 | data.nodes.find((node) => route === `/node/${node.id}`)<br>call<br>전달 콜백: H-ca68c10588ba |
| 30행 | 별도 조건식 없음 | useState(() => ({ key, journey: readJourney(key, route, place) }))<br>call<br>전달 콜백: H-6cedb3e20b2a |
| 32행 | truthy: stored.key !== key | readJourney(key, route, place)<br>call → [H-3299b2110bb1](ui__observatory-navigation.md#h-3299b2110bb1) |
| 33행 | falsy: stored.key !== key ∧ truthy: journey.current.route !== route | visitPlace(journey, route, place)<br>call |
| 34행 | truthy: stored.key !== key \|\| journey !== stored.journey | setStored({ key, journey })<br>state-update |
| 35행 | 별도 조건식 없음 | useEffect(() => { try { sessionStorage.setItem(key, JSON.stringify(journey)); } catch { /* Navigation stays usable; no original text is stored here. */ } }, [key, journey])<br>call<br>전달 콜백: H-dfda2de3790e |
| 42행 | 별도 조건식 없음 | [...journey.trail]<br>    .reverse()<br>    .find((entry) => !['/materials/new', '/free/new'].includes(entry.route) && routeAvailable(data, entry.route))<br>call<br>전달 콜백: H-2e380d83c1d2 |
| 42행 | 별도 조건식 없음 | [...journey.trail]<br>    .reverse()<br>call |
| 51행 | 별도 조건식 없음 | studySourceVisit(data, journey)<br>call → [H-c3a921eeb615](ui__observatory-navigation.md#h-c3a921eeb615) |

반환/조기 중단: 48행 { journey, caller, studySource: studySourceVisit(data, journey), global: place === 'global', } [별도 조건식 없음]

## H-ca68c10588ba

**@callback:data.nodes.find** · [src/ui/observatory-navigation.tsx:29](../../../src/ui/observatory-navigation.tsx#L29)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6cedb3e20b2a

**@callback:useState** · [src/ui/observatory-navigation.tsx:30](../../../src/ui/observatory-navigation.tsx#L30)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 30행 | 별도 조건식 없음 | readJourney(key, route, place)<br>call → [H-3299b2110bb1](ui__observatory-navigation.md#h-3299b2110bb1) |

## H-dfda2de3790e

**@callback:useEffect** · [src/ui/observatory-navigation.tsx:35](../../../src/ui/observatory-navigation.tsx#L35)

분기 조건과 가능한 갈림길:

- B-886531bedeca · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (36행).
- B-67f4ce496f1f · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (38행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 37행 | 별도 조건식 없음 | sessionStorage.setItem(key, JSON.stringify(journey))<br>preservation-boundary |
| 37행 | 별도 조건식 없음 | JSON.stringify(journey)<br>call |

## H-2e380d83c1d2

**@callback:[...journey.trail]
    .reverse()
    .find** · [src/ui/observatory-navigation.tsx:45](../../../src/ui/observatory-navigation.tsx#L45)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 46행 | 별도 조건식 없음 | ['/materials/new', '/free/new'].includes(entry.route)<br>call |
| 46행 | truthy: !['/materials/new', '/free/new'].includes(entry.route) | routeAvailable(data, entry.route)<br>call → [H-34a83c7406c7](ui__observatory-navigation.md#h-34a83c7406c7) |

## H-c3a921eeb615

**studySourceVisit** · [src/ui/observatory-navigation.tsx:57](../../../src/ui/observatory-navigation.tsx#L57)

분기 조건과 가능한 갈림길:

- B-5c388f1993ae · IfStatement · data.studyMaterials?.some( (item) => !item.deletedAt && visit.route === `/materials/${item.id}`, ) || data.nodes.some( (item) => !item.deletedAt && item.role === 'topic' && visit.route === `/node/${item.id}`, ) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (59행).
- B-d63f27466485 · IfStatement · !/^\/(math|code|record)(\/|$)/.test(visit.route) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (68행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 58행 | 별도 조건식 없음 | [...journey.trail].reverse()<br>call |
| 63행 | falsy: data.studyMaterials?.some(<br>        (item) => !item.deletedAt && visit.route === `/materials/${item.id}`,<br>      ) | data.nodes.some((item) => !item.deletedAt && item.role === 'topic' && visit.route === `/node/${item.id}`)<br>call<br>전달 콜백: H-67ee47d95a3b |
| 68행 | 별도 조건식 없음 | /^\/(math\|code\|record)(\/\|$)/.test(visit.route)<br>call |

반환/조기 중단: 67행 visit [truthy: data.studyMaterials?.some(
        (item) => !item.deletedAt && visit.route === `/materials/${item.id}`,
      ) ||
      data.nodes.some(
        (item) => !item.deletedAt && item.role === 'topic' && visit.route === `/node/${item.id}`,
      )]; 68행 undefined [truthy: !/^\/(math|code|record)(\/|$)/.test(visit.route)]; 70행 undefined [별도 조건식 없음]

## H-67ee47d95a3b

**@callback:data.nodes.some** · [src/ui/observatory-navigation.tsx:64](../../../src/ui/observatory-navigation.tsx#L64)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-34a83c7406c7

**routeAvailable** · [src/ui/observatory-navigation.tsx:73](../../../src/ui/observatory-navigation.tsx#L73)

분기 조건과 가능한 갈림길:

- B-3730aa1c8659 · IfStatement · route.startsWith('/subject/') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (76행).
- B-c8cefdc845c5 · IfStatement · route.startsWith('/node/') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (77행).
- B-b2999d9ee885 · IfStatement · route.startsWith('/materials/') && !['/materials/new', '/materials/trash'].includes(route) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (78행).
- B-b5a47ba383d6 · IfStatement · route.startsWith('/memos/') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (80행).
- B-f74027193a03 · IfStatement · route.startsWith('/code/') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (81행).
- B-4082b0b6f564 · IfStatement · route.startsWith('/free/') && route !== '/free/new' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (82행).
- B-8f1759bc2443 · IfStatement · route.startsWith('/record/') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (84행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 76행 | 별도 조건식 없음 | route.startsWith('/subject/')<br>call |
| 76행 | truthy: route.startsWith('/subject/') | activeId(data.subjects, '/subject')<br>call → [H-54b31aa8f55e](ui__observatory-navigation.md#h-54b31aa8f55e) |
| 77행 | 별도 조건식 없음 | route.startsWith('/node/')<br>call |
| 77행 | truthy: route.startsWith('/node/') | activeId(data.nodes, '/node')<br>call → [H-54b31aa8f55e](ui__observatory-navigation.md#h-54b31aa8f55e) |
| 78행 | 별도 조건식 없음 | route.startsWith('/materials/')<br>call |
| 78행 | truthy: route.startsWith('/materials/') | ['/materials/new', '/materials/trash'].includes(route)<br>call |
| 79행 | truthy: route.startsWith('/materials/') && !['/materials/new', '/materials/trash'].includes(route) | activeId(data.studyMaterials ?? [], '/materials')<br>call → [H-54b31aa8f55e](ui__observatory-navigation.md#h-54b31aa8f55e) |
| 80행 | 별도 조건식 없음 | route.startsWith('/memos/')<br>call |
| 80행 | truthy: route.startsWith('/memos/') | activeId(data.memos ?? [], '/memos')<br>call → [H-54b31aa8f55e](ui__observatory-navigation.md#h-54b31aa8f55e) |
| 81행 | 별도 조건식 없음 | route.startsWith('/code/')<br>call |
| 81행 | truthy: route.startsWith('/code/') | activeId(data.codeExamples ?? [], '/code')<br>call → [H-54b31aa8f55e](ui__observatory-navigation.md#h-54b31aa8f55e) |
| 82행 | 별도 조건식 없음 | route.startsWith('/free/')<br>call |
| 83행 | truthy: route.startsWith('/free/') && route !== '/free/new' | activeId(data.narratives, '/free')<br>call → [H-54b31aa8f55e](ui__observatory-navigation.md#h-54b31aa8f55e) |
| 84행 | 별도 조건식 없음 | route.startsWith('/record/')<br>call |
| 84행 | truthy: route.startsWith('/record/') | activeId([...data.subjects, ...data.nodes], '/record')<br>call → [H-54b31aa8f55e](ui__observatory-navigation.md#h-54b31aa8f55e) |
| 86행 | 별도 조건식 없음 | OBSERVATORY_MENU.some((item) => route === item.href)<br>call<br>전달 콜백: H-aef7db6ab149 |
| 87행 | falsy: OBSERVATORY_MENU.some((item) => route === item.href) | [<br>      '/free',<br>      '/free/new',<br>      '/materials/new',<br>      '/materials/trash',<br>      '/recall/scheduled',<br>      '/my-progress',<br>      '/backup',<br>      '/trash',<br>      '/draft-archives',<br>      '/about',<br>      '/help',<br>      '/subscription',<br>      '/account',<br>    ].includes(route)<br>preservation-boundary |
| 102행 | falsy: OBSERVATORY_MENU.some((item) => route === item.href) \|\|<br>    [<br>      '/free',<br>      '/free/new',<br>      '/materials/new',<br>      '/materials/trash',<br>      '/recall/scheduled',<br>      '/my-progress',<br>      '/backup',<br>      '/trash',<br>      '/draft-archives',<br>      '/about',<br>      '/help',<br>      '/subscription',<br>      '/account',<br>    ].includes(route) | route.startsWith('/practice/')<br>call |
| 103행 | falsy: OBSERVATORY_MENU.some((item) => route === item.href) \|\|<br>    [<br>      '/free',<br>      '/free/new',<br>      '/materials/new',<br>      '/materials/trash',<br>      '/recall/scheduled',<br>      '/my-progress',<br>      '/backup',<br>      '/trash',<br>      '/draft-archives',<br>      '/about',<br>      '/help',<br>      '/subscription',<br>      '/account',<br>    ].includes(route) \|\|<br>    route.startsWith('/practice/') | route.startsWith('/memory-test/')<br>call |

반환/조기 중단: 76행 activeId(data.subjects, '/subject') [truthy: route.startsWith('/subject/')]; 77행 activeId(data.nodes, '/node') [truthy: route.startsWith('/node/')]; 79행 activeId(data.studyMaterials ?? [], '/materials') [truthy: route.startsWith('/materials/') && !['/materials/new', '/materials/trash'].includes(route)]; 80행 activeId(data.memos ?? [], '/memos') [truthy: route.startsWith('/memos/')]; 81행 activeId(data.codeExamples ?? [], '/code') [truthy: route.startsWith('/code/')]; 83행 activeId(data.narratives, '/free') [truthy: route.startsWith('/free/') && route !== '/free/new']; 84행 activeId([...data.subjects, ...data.nodes], '/record') [truthy: route.startsWith('/record/')]; 85행 OBSERVATORY_MENU.some((item) => route === item.href) || [ '/free', '/free/new', '/materials/new', '/materials/trash', '/recall/scheduled', '/my-progress', '/backup', '/trash', '/draft-archives', '/about', '/help', '/subscription', '/account', ].includes(route) || route.startsWith('/practice/') || route.startsWith('/memory-test/') [별도 조건식 없음]

## H-54b31aa8f55e

**activeId** · [src/ui/observatory-navigation.tsx:74](../../../src/ui/observatory-navigation.tsx#L74)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 75행 | 별도 조건식 없음 | items.some((item) => !item.deletedAt && route === `${prefix}/${item.id}`)<br>call<br>전달 콜백: H-a19bb6200dcf |

## H-a19bb6200dcf

**@callback:items.some** · [src/ui/observatory-navigation.tsx:75](../../../src/ui/observatory-navigation.tsx#L75)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-aef7db6ab149

**@callback:OBSERVATORY_MENU.some** · [src/ui/observatory-navigation.tsx:86](../../../src/ui/observatory-navigation.tsx#L86)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-b95917fcb671

**observatoryRouteTitle** · [src/ui/observatory-navigation.tsx:107](../../../src/ui/observatory-navigation.tsx#L107)

분기 조건과 가능한 갈림길:

- B-e3b12b7d8a51 · ConditionalExpression · route.startsWith('/subject/') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (108행).
- B-fea69f03c7fc · ConditionalExpression · route.startsWith('/node/') → truthy / falsy; 바깥 조건: falsy: route.startsWith('/subject/') (110행).
- B-80ae561e555d · ConditionalExpression · route.startsWith('/materials/') → truthy / falsy; 바깥 조건: falsy: route.startsWith('/subject/') ∧ falsy: route.startsWith('/node/') (112행).
- B-d85b41055874 · IfStatement · named → truthy / falsy; 바깥 조건: 별도 조건식 없음 (115행).
- B-96caeb27d676 · IfStatement · route.startsWith('/free') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (116행).
- B-b41d9af71833 · IfStatement · route === '/my-progress' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (117행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 108행 | 별도 조건식 없음 | route.startsWith('/subject/')<br>call |
| 109행 | truthy: route.startsWith('/subject/') | data.subjects.find((item) => route === `/subject/${item.id}`)<br>call<br>전달 콜백: H-31fc4976ce09 |
| 110행 | falsy: route.startsWith('/subject/') | route.startsWith('/node/')<br>call |
| 111행 | falsy: route.startsWith('/subject/') ∧ truthy: route.startsWith('/node/') | data.nodes.find((item) => route === `/node/${item.id}`)<br>call<br>전달 콜백: H-0f7da2d9792e |
| 112행 | falsy: route.startsWith('/subject/') ∧ falsy: route.startsWith('/node/') | route.startsWith('/materials/')<br>call |
| 116행 | 별도 조건식 없음 | route.startsWith('/free')<br>call |
| 128행 | nullish: utilities[route] | OBSERVATORY_MENU.find((item) => route === item.href \|\| (item.href !== '/' && route.startsWith(`${item.href}/`)))<br>call<br>전달 콜백: H-a4f56c794c65 |

반환/조기 중단: 115행 named [truthy: named]; 116행 '자유 기록' [truthy: route.startsWith('/free')]; 117행 '내 생각 다시 보기' [truthy: route === '/my-progress']; 126행 utilities[route] ?? OBSERVATORY_MENU.find( (item) => route === item.href || (item.href !== '/' && route.startsWith(`${item.href}/`)), )?.text ?? '이전 화면' [별도 조건식 없음]

## H-31fc4976ce09

**@callback:data.subjects.find** · [src/ui/observatory-navigation.tsx:109](../../../src/ui/observatory-navigation.tsx#L109)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-0f7da2d9792e

**@callback:data.nodes.find** · [src/ui/observatory-navigation.tsx:111](../../../src/ui/observatory-navigation.tsx#L111)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a4f56c794c65

**@callback:OBSERVATORY_MENU.find** · [src/ui/observatory-navigation.tsx:129](../../../src/ui/observatory-navigation.tsx#L129)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 129행 | nullish: utilities[route] ∧ falsy: route === item.href ∧ truthy: item.href !== '/' | route.startsWith(`${item.href}/`)<br>call |

## H-3825c02da5ff

**ObservatoryNavigation** · [src/ui/observatory-navigation.tsx:135](../../../src/ui/observatory-navigation.tsx#L135)

분기 조건과 가능한 갈림길:

- B-66fc10d1a9cc · ConditionalExpression · place.id === 'left' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (151행).
- B-2984cec690c5 · ConditionalExpression · place.id === 'right' → truthy / falsy; 바깥 조건: falsy: place.id === 'left' (151행).
- B-607c3bc1a869 · ConditionalExpression · global → truthy / falsy; 바깥 조건: 별도 조건식 없음 (178행).
- B-10d13fd1be3f · ConditionalExpression · motionEnabled && moved → truthy / falsy; 바깥 조건: 별도 조건식 없음 (190행).
- B-db281362c977 · ConditionalExpression · place.id === 'back' → truthy / falsy; 바깥 조건: truthy: motionEnabled && moved (190행).
- B-a5f6d4830aff · ConditionalExpression · motionEnabled → truthy / falsy; 바깥 조건: 별도 조건식 없음 (193행).
- B-a61af7a0aebf · ConditionalExpression · global → truthy / falsy; 바깥 조건: 별도 조건식 없음 (195행).
- B-da4f5ca9972f · ConditionalExpression · global → truthy / falsy; 바깥 조건: 별도 조건식 없음 (231행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 147행 | 별도 조건식 없음 | OBSERVATORY_PLACES.find((item) => item.id === journey.current.place)<br>call<br>전달 콜백: H-406655331184 |
| 148행 | 별도 조건식 없음 | useMotionEnabled()<br>call → [H-f857690626c5](ui__motion.md#h-f857690626c5) |
| 149행 | 별도 조건식 없음 | journey.trail.at(-1)<br>call |
| 152행 | 별도 조건식 없음 | [...journey.trail]<br>    .reverse()<br>    .find((entry) => routeAvailable(data, entry.route) && routePlace( entry.route, data.nodes.find((node) => entry.route === `/node/${node.id}`)?.role, ) !== 'global')<br>call<br>전달 콜백: H-aa2a5da67cd4 |
| 152행 | 별도 조건식 없음 | [...journey.trail]<br>    .reverse()<br>call |
| 165행 | 별도 조건식 없음 | OBSERVATORY_PLACES.map((item) => ( <a key={item.id} href={`#${item.href}`} aria-current={!global && place.id === item.id ? 'location' : undefined} data-navigation-focus={`observatory-place:${item.id}`} > <span className="observatory-place-direction">{item.direction}</span>{' '} <span>{item.label}</span> </a> ))<br>call<br>전달 콜백: H-3aa106c93331 |
| 198행 | 별도 조건식 없음 | observatoryRouteTitle(data, route)<br>call → [H-b95917fcb671](ui__observatory-navigation.md#h-b95917fcb671) |
| 204행 | truthy: !global | OBSERVATORY_MENU.filter((item) => item.place === place.id).map((item) => ( <a href={`#${item.href}`} key={item.href} aria-current={item.href === route ? 'page' : undefined} > {item.text} </a> ))<br>call<br>전달 콜백: H-6b8568b7965a |
| 204행 | truthy: !global | OBSERVATORY_MENU.filter((item) => item.place === place.id)<br>call<br>전달 콜백: H-bb0da878786e |
| 222행 | truthy: global | encodeURI(returnPlace?.route ?? place.href)<br>call |
| 230행 | 별도 조건식 없음 | storagePrefix(data)<br>call |
| 233행 | 별도 조건식 없음 | storagePrefix(data)<br>call |
| 233행 | 별도 조건식 없음 | encodeURIComponent(data.userId)<br>call |

반환/조기 중단: 162행 <render> [별도 조건식 없음]

## H-406655331184

**@callback:OBSERVATORY_PLACES.find** · [src/ui/observatory-navigation.tsx:147](../../../src/ui/observatory-navigation.tsx#L147)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-aa2a5da67cd4

**@callback:[...journey.trail]
    .reverse()
    .find** · [src/ui/observatory-navigation.tsx:155](../../../src/ui/observatory-navigation.tsx#L155)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 156행 | 별도 조건식 없음 | routeAvailable(data, entry.route)<br>call → [H-34a83c7406c7](ui__observatory-navigation.md#h-34a83c7406c7) |
| 157행 | truthy: routeAvailable(data, entry.route) | routePlace(entry.route, data.nodes.find((node) => entry.route === `/node/${node.id}`)?.role)<br>call |
| 159행 | truthy: routeAvailable(data, entry.route) | data.nodes.find((node) => entry.route === `/node/${node.id}`)<br>call<br>전달 콜백: H-6788517e3460 |

## H-6788517e3460

**@callback:data.nodes.find** · [src/ui/observatory-navigation.tsx:159](../../../src/ui/observatory-navigation.tsx#L159)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3aa106c93331

**@callback:OBSERVATORY_PLACES.map** · [src/ui/observatory-navigation.tsx:165](../../../src/ui/observatory-navigation.tsx#L165)

분기 조건과 가능한 갈림길:

- B-d020610491d6 · ConditionalExpression · !global && place.id === item.id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (169행).

## H-bb0da878786e

**@callback:OBSERVATORY_MENU.filter** · [src/ui/observatory-navigation.tsx:204](../../../src/ui/observatory-navigation.tsx#L204)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6b8568b7965a

**@callback:OBSERVATORY_MENU.filter((item) => item.place === place.id).map** · [src/ui/observatory-navigation.tsx:204](../../../src/ui/observatory-navigation.tsx#L204)

분기 조건과 가능한 갈림길:

- B-7ac12a034f0d · ConditionalExpression · item.href === route → truthy / falsy; 바깥 조건: truthy: !global (208행).

## H-3018c916e114

**ObservatoryTaskReturn** · [src/ui/observatory-navigation.tsx:239](../../../src/ui/observatory-navigation.tsx#L239)

분기 조건과 가능한 갈림길:

- B-e9b211284493 · ConditionalExpression · studySource && /^\/(math|code|record)(\/|$)/.test(route) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (251행).
- B-02700ee57514 · IfStatement · !caller && !source → truthy / falsy; 바깥 조건: 별도 조건식 없음 (260행).
- B-131630ed1590 · ConditionalExpression · targetId → truthy / falsy; 바깥 조건: truthy: source ∧ truthy: !route.startsWith('/record') (273행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 251행 | truthy: studySource | /^\/(math\|code\|record)(\/\|$)/.test(route)<br>call |
| 255행 | 별도 조건식 없음 | data.nodes.find((item) => !item.deletedAt && item.role === 'topic' && sourceRoute === `/node/${item.id}`)<br>call<br>전달 콜백: H-87f89f979997 |
| 259행 | 별도 조건식 없음 | Boolean(material \|\| topic)<br>call |
| 264행 | truthy: caller | encodeURI(caller.route)<br>call |
| 265행 | truthy: caller | observatoryRouteTitle(data, caller.route)<br>call → [H-b95917fcb671](ui__observatory-navigation.md#h-b95917fcb671) |
| 271행 | truthy: source | route.startsWith('/code')<br>call |
| 272행 | truthy: source | route.startsWith('/record')<br>call |
| 273행 | truthy: source ∧ truthy: !route.startsWith('/record') ∧ truthy: targetId | encodeURIComponent(targetId)<br>call |

반환/조기 중단: 260행 null [truthy: !caller && !source]; 261행 <render> [별도 조건식 없음]

## H-87f89f979997

**@callback:data.nodes.find** · [src/ui/observatory-navigation.tsx:256](../../../src/ui/observatory-navigation.tsx#L256)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-0985fc875894

**returnFromObservatory** · [src/ui/observatory-navigation.tsx:284](../../../src/ui/observatory-navigation.tsx#L284)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 285행 | 별도 조건식 없음 | navigate(caller?.route ?? fallback)<br>navigation |

