# src/ui/observatory-place-scene.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-7e91a4a97ed2

**readOpen** · [src/ui/observatory-place-scene.tsx:13](../../../src/ui/observatory-place-scene.tsx#L13)

분기 조건과 가능한 갈림길:

- B-4cd35b682f74 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (14행).
- B-78ed8b494707 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (16행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 15행 | 별도 조건식 없음 | localStorage.getItem(key)<br>preservation-boundary |

반환/조기 중단: 15행 localStorage.getItem(key) !== 'closed' [별도 조건식 없음]; 17행 true [exception: exception]

## H-ae9a2d490a2a

**ObservatoryPlaceScene** · [src/ui/observatory-place-scene.tsx:22](../../../src/ui/observatory-place-scene.tsx#L22)

분기 조건과 가능한 갈림길:

- B-f2bc10674b8c · IfStatement · place === 'front' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (39행).
- B-07a93660041d · ConditionalExpression · place === 'ceiling' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (41행).
- B-670b868e263a · ConditionalExpression · place === 'ceiling' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (45행).
- B-f56657e293e4 · ConditionalExpression · open → truthy / falsy; 바깥 조건: 별도 조건식 없음 (73행).
- B-699eca28955e · ConditionalExpression · turn → truthy / falsy; 바깥 조건: visible-when-falsy: !open (80행).
- B-80a3d2bf0571 · ConditionalExpression · place === 'left' → truthy / falsy; 바깥 조건: visible-when-falsy: !open ∧ truthy: turn (80행).
- B-46ce9f701762 · ConditionalExpression · place === 'right' → truthy / falsy; 바깥 조건: visible-when-falsy: !open ∧ truthy: turn ∧ falsy: place === 'left' (80행).
- B-c1b05d0101da · ConditionalExpression · enabled → truthy / falsy; 바깥 조건: visible-when-falsy: !open (83행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 31행 | 별도 조건식 없음 | useId()<br>call |
| 32행 | 별도 조건식 없음 | useState(() => readOpen(storageKey))<br>call<br>전달 콜백: H-0a20511661e3 |
| 33행 | 별도 조건식 없음 | useRef(place)<br>call |
| 34행 | 별도 조건식 없음 | useMotionEnabled()<br>call → [H-f857690626c5](ui__motion.md#h-f857690626c5) |
| 36행 | 별도 조건식 없음 | useEffect(() => { previous.current = place; }, [place])<br>call<br>전달 콜백: H-dda4788b67e5 |
| 43행 | falsy: place === 'ceiling' | OBSERVATORY_PLACES.find((item) => item.id === place)<br>call<br>전달 콜백: H-6a147031a76b |
| 51행 | falsy: place === 'ceiling' | OBSERVATORY_MENU.filter((item) => item.place === place)<br>call<br>전달 콜백: H-ac39b540c2e2 |
| 88행 | visible-when-falsy: !open | links.map((item) => ( <a key={item.href} href={`#${item.href}`} aria-current={route === item.href ? 'page' : undefined} data-navigation-focus={`observatory-scene:${item.href}`} > {item.text} </a> ))<br>call<br>전달 콜백: H-5637c9fe1d89 |

반환/조기 중단: 39행 null [truthy: place === 'front']; 52행 <render> [별도 조건식 없음]

## H-0a20511661e3

**@callback:useState** · [src/ui/observatory-place-scene.tsx:32](../../../src/ui/observatory-place-scene.tsx#L32)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 32행 | 별도 조건식 없음 | readOpen(storageKey)<br>call → [H-7e91a4a97ed2](ui__observatory-place-scene.md#h-7e91a4a97ed2) |

## H-dda4788b67e5

**@callback:useEffect** · [src/ui/observatory-place-scene.tsx:36](../../../src/ui/observatory-place-scene.tsx#L36)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6a147031a76b

**@callback:OBSERVATORY_PLACES.find** · [src/ui/observatory-place-scene.tsx:43](../../../src/ui/observatory-place-scene.tsx#L43)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ac39b540c2e2

**@callback:OBSERVATORY_MENU.filter** · [src/ui/observatory-place-scene.tsx:51](../../../src/ui/observatory-place-scene.tsx#L51)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-72c5ce58d7cb

**@onClick** · [src/ui/observatory-place-scene.tsx:64](../../../src/ui/observatory-place-scene.tsx#L64)

분기 조건과 가능한 갈림길:

- B-7ff527a7d630 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (66행).
- B-019edbba7537 · ConditionalExpression · open → truthy / falsy; 바깥 조건: 별도 조건식 없음 (67행).
- B-46786dbb3650 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (68행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 65행 | 별도 조건식 없음 | setOpen(!open)<br>state-update |
| 67행 | 별도 조건식 없음 | localStorage.setItem(storageKey, open ? 'closed' : 'open')<br>preservation-boundary |

## H-5637c9fe1d89

**@callback:links.map** · [src/ui/observatory-place-scene.tsx:88](../../../src/ui/observatory-place-scene.tsx#L88)

분기 조건과 가능한 갈림길:

- B-4e349d828ade · ConditionalExpression · route === item.href → truthy / falsy; 바깥 조건: visible-when-falsy: !open (92행).

