# src/ui/context-menu.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-b82cde03a201

**ContextMenu** · [src/ui/context-menu.tsx:9](../../../src/ui/context-menu.tsx#L9)

분기 조건과 가능한 갈림길:

- B-b3639d786331 · ConditionalExpression · open → truthy / falsy; 바깥 조건: 별도 조건식 없음 (51행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 10행 | 별도 조건식 없음 | useState(false)<br>call |
| 11행 | 별도 조건식 없음 | useId()<br>call |
| 12행 | 별도 조건식 없음 | useRef(null)<br>call |
| 12행 | 별도 조건식 없음 | useRef(null)<br>call |
| 13행 | 별도 조건식 없음 | useRef('first')<br>call |
| 14행 | 별도 조건식 없음 | useCallback((restore = true) => { setOpen(false); if (restore && trigger.current?.isConnected) trigger.current.focus({ preventScroll: true }); }, [])<br>call<br>전달 콜백: H-eae8181d8674 |
| 18행 | 별도 조건식 없음 | useCallback(() => [...(menu.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') \|\| [])], [])<br>call<br>전달 콜백: H-ef8a95ab61b5 |
| 20행 | 별도 조건식 없음 | useLayoutEffect(() => { if (!open \|\| !menu.current \|\| !trigger.current) return; const position = () => { if (!menu.current \|\| !trigger.current) return; const anchor = trigger.current.getBoundingClientRect(), panel = menu.current.getBoundingClientRect(); const margin = 8, width = window.innerWidth, height = window.innerHeight; menu.current.style.left = `${Math.max(margin, Math.min(anchor.right - panel.width, width - panel.width - margin))}px`; const below = anchor.bottom + margin; menu.current.style.top = `${Math.max(margin, Math.min(below + panel.height <= height - margin ? below : anchor.top - panel.height - margin, height - panel.height - margin))}px`; }; position(); const buttons = enabled(); (initialFoc … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-c7612d52e943 |
| 39행 | 별도 조건식 없음 | useEffect(() => { if (!open) return; const outside = (target: EventTarget \| null) => target instanceof Node && !menu.current?.contains(target) && !trigger.current?.contains(target); const pointer = (event: PointerEvent) => { if (outside(event.target)) close(); }; const focus = (event: FocusEvent) => { if (outside(event.target)) close(false); }; document.addEventListener('pointerdown', pointer); document.addEventListener('focusin', focus); return () => { document.removeEventListener('pointerdown', pointer); document.removeEventListener('focusin', focus); }; }, [open, close])<br>call<br>전달 콜백: H-820da1c7b79a |
| 57행 | truthy: open | createPortal(<div id={id} ref={menu} role="menu" aria-label={`${targetLabel}: ${label}`} tabIndex={-1} className="ui-context-menu" onKeyDown={event => { if (event.nativeEvent.isComposing) return; if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return; } if (event.key === 'Tab') { close(); return; } if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return; event.preventDefault(); const buttons = enabled(); if (!buttons.length) return; const current = buttons.indexOf(document.activeElement as HTMLButtonElement); const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (event.key === 'ArrowDown' ? 1 : -1) + buttons. … [전체 인수는 JSON·소스])<br>call |
| 71행 | truthy: open | items.map(item => <button key={item.id} type="button" role="menuitem" tabIndex={-1} disabled={item.disabled} className={`ui-context-menu-item${item.danger ? ' ui-context-menu-item--danger' : ''}`} onClick={() => { close(); item.onSelect(); }}>{item.label}</button>)<br>call<br>전달 콜백: H-4b19833e76db |

반환/조기 중단: 49행 <render> [별도 조건식 없음]

## H-eae8181d8674

**@callback:useCallback** · [src/ui/context-menu.tsx:14](../../../src/ui/context-menu.tsx#L14)

분기 조건과 가능한 갈림길:

- B-74ef926b05fa · IfStatement · restore && trigger.current?.isConnected → truthy / falsy; 바깥 조건: 별도 조건식 없음 (16행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 15행 | 별도 조건식 없음 | setOpen(false)<br>state-update |
| 16행 | truthy: restore && trigger.current?.isConnected | trigger.current.focus({ preventScroll: true })<br>input-control |

## H-ef8a95ab61b5

**@callback:useCallback** · [src/ui/context-menu.tsx:18](../../../src/ui/context-menu.tsx#L18)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c7612d52e943

**@callback:useLayoutEffect** · [src/ui/context-menu.tsx:20](../../../src/ui/context-menu.tsx#L20)

분기 조건과 가능한 갈림길:

- B-4ea95246d0c9 · IfStatement · !open || !menu.current || !trigger.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (21행).
- B-e8b06bf1b600 · ConditionalExpression · initialFocus.current === 'last' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (32행).
- B-03fd88ba3720 · IfStatement · !buttons.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (33행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 30행 | 별도 조건식 없음 | position()<br>call → [H-40bf339e44cf](ui__context-menu.md#h-40bf339e44cf) |
| 31행 | 별도 조건식 없음 | enabled()<br>call |
| 32행 | truthy: initialFocus.current === 'last' | buttons.at(-1)<br>call |
| 33행 | truthy: !buttons.length | menu.current.focus({ preventScroll: true })<br>input-control |
| 34행 | 별도 조건식 없음 | window.addEventListener('resize', position)<br>call<br>전달 콜백: H-40bf339e44cf |
| 35행 | 별도 조건식 없음 | window.addEventListener('scroll', position, true)<br>call<br>전달 콜백: H-40bf339e44cf |

반환/조기 중단: 21행 <render> [truthy: !open || !menu.current || !trigger.current]; 36행 () => { window.removeEventListener('resize', position); window.removeEventListener('scroll', position, true); } [별도 조건식 없음]

## H-40bf339e44cf

**position** · [src/ui/context-menu.tsx:22](../../../src/ui/context-menu.tsx#L22)

분기 조건과 가능한 갈림길:

- B-e377f47c52db · IfStatement · !menu.current || !trigger.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (23행).
- B-d03bb56b3bf5 · ConditionalExpression · below + panel.height <= height - margin → truthy / falsy; 바깥 조건: 별도 조건식 없음 (28행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 24행 | 별도 조건식 없음 | trigger.current.getBoundingClientRect()<br>call |
| 24행 | 별도 조건식 없음 | menu.current.getBoundingClientRect()<br>call |
| 26행 | 별도 조건식 없음 | Math.max(margin, Math.min(anchor.right - panel.width, width - panel.width - margin))<br>call |
| 26행 | 별도 조건식 없음 | Math.min(anchor.right - panel.width, width - panel.width - margin)<br>call |
| 28행 | 별도 조건식 없음 | Math.max(margin, Math.min(below + panel.height <= height - margin ? below : anchor.top - panel.height - margin, height - panel.height - margin))<br>call |
| 28행 | 별도 조건식 없음 | Math.min(below + panel.height <= height - margin ? below : anchor.top - panel.height - margin, height - panel.height - margin)<br>call |

반환/조기 중단: 23행 <render> [truthy: !menu.current || !trigger.current]

## H-820da1c7b79a

**@callback:useEffect** · [src/ui/context-menu.tsx:39](../../../src/ui/context-menu.tsx#L39)

분기 조건과 가능한 갈림길:

- B-e774092094c6 · IfStatement · !open → truthy / falsy; 바깥 조건: 별도 조건식 없음 (40행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 44행 | 별도 조건식 없음 | document.addEventListener('pointerdown', pointer)<br>call<br>전달 콜백: H-ddb8923c420a |
| 45행 | 별도 조건식 없음 | document.addEventListener('focusin', focus)<br>call<br>전달 콜백: H-84d8efb1ebda |

반환/조기 중단: 40행 <render> [truthy: !open]; 46행 () => { document.removeEventListener('pointerdown', pointer); document.removeEventListener('focusin', focus); } [별도 조건식 없음]

## H-ddb8492cf8da

**outside** · [src/ui/context-menu.tsx:41](../../../src/ui/context-menu.tsx#L41)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-ddb8923c420a

**pointer** · [src/ui/context-menu.tsx:42](../../../src/ui/context-menu.tsx#L42)

분기 조건과 가능한 갈림길:

- B-dd87da9301eb · IfStatement · outside(event.target) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (42행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 42행 | 별도 조건식 없음 | outside(event.target)<br>call → [H-ddb8492cf8da](ui__context-menu.md#h-ddb8492cf8da) |
| 42행 | truthy: outside(event.target) | close()<br>call |

## H-84d8efb1ebda

**focus** · [src/ui/context-menu.tsx:43](../../../src/ui/context-menu.tsx#L43)

분기 조건과 가능한 갈림길:

- B-03a96b128ba2 · IfStatement · outside(event.target) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (43행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 43행 | 별도 조건식 없음 | outside(event.target)<br>call → [H-ddb8492cf8da](ui__context-menu.md#h-ddb8492cf8da) |
| 43행 | truthy: outside(event.target) | close(false)<br>call |

## H-3dca434ca575

**@onClick** · [src/ui/context-menu.tsx:52](../../../src/ui/context-menu.tsx#L52)

분기 조건과 가능한 갈림길:

- B-ed37b446760c · IfStatement · open → truthy / falsy; 바깥 조건: 별도 조건식 없음 (52행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 52행 | truthy: open | close()<br>call |
| 52행 | falsy: open | setOpen(true)<br>state-update |

## H-3d5ca00679e3

**@onKeyDown** · [src/ui/context-menu.tsx:53](../../../src/ui/context-menu.tsx#L53)

분기 조건과 가능한 갈림길:

- B-8391ccfeecff · IfStatement · event.nativeEvent.isComposing || !['ArrowDown', 'ArrowUp'].includes(event.key) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (54행).
- B-ed83e1f17534 · ConditionalExpression · event.key === 'ArrowUp' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (55행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 54행 | falsy: event.nativeEvent.isComposing | ['ArrowDown', 'ArrowUp'].includes(event.key)<br>call |
| 55행 | 별도 조건식 없음 | event.preventDefault()<br>input-control |
| 55행 | 별도 조건식 없음 | setOpen(true)<br>state-update |

반환/조기 중단: 54행 <render> [truthy: event.nativeEvent.isComposing || !['ArrowDown', 'ArrowUp'].includes(event.key)]

## H-030b1a299016

**@onKeyDown** · [src/ui/context-menu.tsx:58](../../../src/ui/context-menu.tsx#L58)

분기 조건과 가능한 갈림길:

- B-4defa7c6def2 · IfStatement · event.nativeEvent.isComposing → truthy / falsy; 바깥 조건: truthy: open (59행).
- B-eeafea77bb33 · IfStatement · event.key === 'Escape' → truthy / falsy; 바깥 조건: truthy: open (60행).
- B-11cc6d743b3a · IfStatement · event.key === 'Tab' → truthy / falsy; 바깥 조건: truthy: open (61행).
- B-9e3eb937943d · IfStatement · !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) → truthy / falsy; 바깥 조건: truthy: open (62행).
- B-ea70ea767b84 · IfStatement · !buttons.length → truthy / falsy; 바깥 조건: truthy: open (65행).
- B-2e44a4519730 · ConditionalExpression · event.key === 'Home' → truthy / falsy; 바깥 조건: truthy: open (67행).
- B-79a391a1548b · ConditionalExpression · event.key === 'End' → truthy / falsy; 바깥 조건: truthy: open ∧ falsy: event.key === 'Home' (67행).
- B-ce7a55fd84fb · ConditionalExpression · event.key === 'ArrowDown' → truthy / falsy; 바깥 조건: truthy: open ∧ falsy: event.key === 'Home' ∧ falsy: event.key === 'End' (67행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 60행 | truthy: open ∧ truthy: event.key === 'Escape' | event.preventDefault()<br>input-control |
| 60행 | truthy: open ∧ truthy: event.key === 'Escape' | event.stopPropagation()<br>input-control |
| 60행 | truthy: open ∧ truthy: event.key === 'Escape' | close()<br>call |
| 61행 | truthy: open ∧ truthy: event.key === 'Tab' | close()<br>call |
| 62행 | truthy: open | ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)<br>call |
| 63행 | truthy: open | event.preventDefault()<br>input-control |
| 64행 | truthy: open | enabled()<br>call |
| 66행 | truthy: open | buttons.indexOf(document.activeElement as HTMLButtonElement)<br>call |
| 68행 | truthy: open | buttons[next].focus()<br>input-control |

반환/조기 중단: 59행 <render> [truthy: open ∧ truthy: event.nativeEvent.isComposing]; 60행 <render> [truthy: open ∧ truthy: event.key === 'Escape']; 61행 <render> [truthy: open ∧ truthy: event.key === 'Tab']; 62행 <render> [truthy: open ∧ truthy: !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)]; 65행 <render> [truthy: open ∧ truthy: !buttons.length]

## H-4b19833e76db

**@callback:items.map** · [src/ui/context-menu.tsx:71](../../../src/ui/context-menu.tsx#L71)

분기 조건과 가능한 갈림길:

- B-9c50627a50a1 · ConditionalExpression · item.danger → truthy / falsy; 바깥 조건: truthy: open (72행).

## H-ff114bd3be2e

**@onClick** · [src/ui/context-menu.tsx:73](../../../src/ui/context-menu.tsx#L73)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 73행 | truthy: open | close()<br>call |
| 73행 | truthy: open | item.onSelect()<br>call |

