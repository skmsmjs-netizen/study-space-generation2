# src/ui/index.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-5f174828a326

**classes** · [src/ui/index.tsx:8](../../../src/ui/index.tsx#L8)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 8행 | 별도 조건식 없음 | values.filter(Boolean).join(' ')<br>call |
| 8행 | 별도 조건식 없음 | values.filter(Boolean)<br>call |

## H-2be3d75d6b4a

**Button** · [src/ui/index.tsx:11](../../../src/ui/index.tsx#L11)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | 별도 조건식 없음 | classes('ui-button', `ui-button--${variant}`, className)<br>call → [H-5f174828a326](ui__index.md#h-5f174828a326) |

반환/조기 중단: 12행 <render> [별도 조건식 없음]

## H-81681fb5e341

**IconButton** · [src/ui/index.tsx:14](../../../src/ui/index.tsx#L14)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 15행 | 별도 조건식 없음 | classes('ui-icon-button', className)<br>call → [H-5f174828a326](ui__index.md#h-5f174828a326) |

반환/조기 중단: 15행 <render> [별도 조건식 없음]

## H-f7dd08661659

**Field** · [src/ui/index.tsx:19](../../../src/ui/index.tsx#L19)


반환/조기 중단: 20행 <render> [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-db985a53f322

**description** · [src/ui/index.tsx:22](../../../src/ui/index.tsx#L22)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 22행 | 별도 조건식 없음 | classes(given, hint && `${id}-hint`, error && `${id}-error`)<br>call → [H-5f174828a326](ui__index.md#h-5f174828a326) |

반환/조기 중단: 22행 classes(given, hint && `${id}-hint`, error && `${id}-error`) || undefined [별도 조건식 없음]

## H-1587998fd2f2

**Input** · [src/ui/index.tsx:24](../../../src/ui/index.tsx#L24)

분기 조건과 가능한 갈림길:

- B-b9f1424b2d55 · ConditionalExpression · error → truthy / falsy; 바깥 조건: 별도 조건식 없음 (26행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 25행 | 별도 조건식 없음 | useId()<br>call |
| 26행 | 별도 조건식 없음 | classes('ui-input', className)<br>call → [H-5f174828a326](ui__index.md#h-5f174828a326) |
| 26행 | 별도 조건식 없음 | description(id, hint, error, describedBy)<br>call → [H-db985a53f322](ui__index.md#h-db985a53f322) |

반환/조기 중단: 26행 <render> [별도 조건식 없음]

## H-b6809eb8d6e3

**Textarea** · [src/ui/index.tsx:28](../../../src/ui/index.tsx#L28)

분기 조건과 가능한 갈림길:

- B-de44e8f11906 · ConditionalExpression · error → truthy / falsy; 바깥 조건: 별도 조건식 없음 (30행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 29행 | 별도 조건식 없음 | useId()<br>call |
| 30행 | 별도 조건식 없음 | classes('ui-input', className)<br>call → [H-5f174828a326](ui__index.md#h-5f174828a326) |
| 30행 | 별도 조건식 없음 | description(id, hint, error, describedBy)<br>call → [H-db985a53f322](ui__index.md#h-db985a53f322) |

반환/조기 중단: 30행 <render> [별도 조건식 없음]

## H-3d1d4ff31add

**Select** · [src/ui/index.tsx:32](../../../src/ui/index.tsx#L32)

분기 조건과 가능한 갈림길:

- B-36c07c4b9da7 · ConditionalExpression · error → truthy / falsy; 바깥 조건: 별도 조건식 없음 (34행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 33행 | 별도 조건식 없음 | useId()<br>call |
| 34행 | 별도 조건식 없음 | classes('ui-input', className)<br>call → [H-5f174828a326](ui__index.md#h-5f174828a326) |
| 34행 | 별도 조건식 없음 | description(id, hint, error, describedBy)<br>call → [H-db985a53f322](ui__index.md#h-db985a53f322) |

반환/조기 중단: 34행 <render> [별도 조건식 없음]

## H-3d43155f6eff

**Checkbox** · [src/ui/index.tsx:37](../../../src/ui/index.tsx#L37)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 38행 | 별도 조건식 없음 | useRef(null)<br>call |
| 39행 | 별도 조건식 없음 | useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate; }, [indeterminate])<br>call<br>전달 콜백: H-e087c3dee111 |
| 40행 | 별도 조건식 없음 | classes('ui-choice', className)<br>call → [H-5f174828a326](ui__index.md#h-5f174828a326) |

반환/조기 중단: 40행 <render> [별도 조건식 없음]

## H-e087c3dee111

**@callback:useEffect** · [src/ui/index.tsx:39](../../../src/ui/index.tsx#L39)

분기 조건과 가능한 갈림길:

- B-784c89f0103a · IfStatement · ref.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (39행).

## H-d54d1f904682

**Radio** · [src/ui/index.tsx:42](../../../src/ui/index.tsx#L42)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 42행 | 별도 조건식 없음 | classes('ui-choice', className)<br>call → [H-5f174828a326](ui__index.md#h-5f174828a326) |

반환/조기 중단: 42행 <render> [별도 조건식 없음]

## H-b96ffe490973

**Tabs** · [src/ui/index.tsx:46](../../../src/ui/index.tsx#L46)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 47행 | 별도 조건식 없음 | useSelectionMotionId()<br>call → [H-814a440bc21b](ui__motion.md#h-814a440bc21b) |
| 48행 | 별도 조건식 없음 | useRef(new Map<string, HTMLButtonElement>())<br>call |
| 49행 | 별도 조건식 없음 | items.filter(item => !item.disabled)<br>call<br>전달 콜백: H-4d20ecee1cbc |
| 50행 | 별도 조건식 없음 | classes('ui-tabs', className)<br>call → [H-5f174828a326](ui__index.md#h-5f174828a326) |
| 50행 | 별도 조건식 없음 | items.map(item => <Button key={item.id} ref={node => { if (node) buttons.current.set(item.id, node); else buttons.current.delete(item.id); }} variant="quiet" role="tab" aria-selected={item.id === value} aria-controls={item.panelId} tabIndex={item.id === value \|\| !enabled.some(entry => entry.id === value) && enabled[0]?.id === item.id ? 0 : -1} disabled={item.disabled} onClick={() => onChange(item.id)} onKeyDown={event => { if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) \|\| !enabled.length) return; event.preventDefault(); const index = enabled.findIndex(entry => entry.id === item.id); const next = event.key === 'Home' ? enabled[0] : event.key === 'End' ? enabled[enabled.length - 1]  … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-c4224a9863aa |

반환/조기 중단: 50행 <render> [별도 조건식 없음]

## H-4d20ecee1cbc

**@callback:items.filter** · [src/ui/index.tsx:49](../../../src/ui/index.tsx#L49)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c4224a9863aa

**@callback:items.map** · [src/ui/index.tsx:50](../../../src/ui/index.tsx#L50)

분기 조건과 가능한 갈림길:

- B-e8b9c0b22dce · ConditionalExpression · item.id === value || !enabled.some(entry => entry.id === value) && enabled[0]?.id === item.id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (50행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 50행 | falsy: item.id === value | enabled.some(entry => entry.id === value)<br>call<br>전달 콜백: H-a98ae2c30506 |

## H-8954a5d6e362

**@ref** · [src/ui/index.tsx:50](../../../src/ui/index.tsx#L50)

분기 조건과 가능한 갈림길:

- B-e849a1a79b45 · IfStatement · node → truthy / falsy; 바깥 조건: 별도 조건식 없음 (50행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 50행 | truthy: node | buttons.current.set(item.id, node)<br>call |
| 50행 | falsy: node | buttons.current.delete(item.id)<br>mutation-request |

## H-a98ae2c30506

**@callback:enabled.some** · [src/ui/index.tsx:50](../../../src/ui/index.tsx#L50)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-36aec22da9ce

**@onClick** · [src/ui/index.tsx:50](../../../src/ui/index.tsx#L50)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 50행 | 별도 조건식 없음 | onChange(item.id)<br>call |

## H-b2efdbadce6a

**@onKeyDown** · [src/ui/index.tsx:50](../../../src/ui/index.tsx#L50)

분기 조건과 가능한 갈림길:

- B-6f0c3f810e04 · IfStatement · !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || !enabled.length → truthy / falsy; 바깥 조건: 별도 조건식 없음 (51행).
- B-11f217ba8c1f · ConditionalExpression · event.key === 'Home' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (54행).
- B-0789130f8b41 · ConditionalExpression · event.key === 'End' → truthy / falsy; 바깥 조건: falsy: event.key === 'Home' (54행).
- B-974a66b1b6de · ConditionalExpression · event.key === 'ArrowRight' → truthy / falsy; 바깥 조건: falsy: event.key === 'Home' ∧ falsy: event.key === 'End' (54행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 51행 | 별도 조건식 없음 | ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)<br>call |
| 52행 | 별도 조건식 없음 | event.preventDefault()<br>input-control |
| 53행 | 별도 조건식 없음 | enabled.findIndex(entry => entry.id === item.id)<br>call<br>전달 콜백: H-0cc25afa2e8a |
| 55행 | 별도 조건식 없음 | onChange(next.id)<br>call |
| 55행 | 별도 조건식 없음 | buttons.current.get(next.id)<br>call |

반환/조기 중단: 51행 <render> [truthy: !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || !enabled.length]

## H-0cc25afa2e8a

**@callback:enabled.findIndex** · [src/ui/index.tsx:53](../../../src/ui/index.tsx#L53)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3c58a54f3543

**SegmentedControl** · [src/ui/index.tsx:58](../../../src/ui/index.tsx#L58)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 60행 | 별도 조건식 없음 | classes('ui-segmented', className)<br>call → [H-5f174828a326](ui__index.md#h-5f174828a326) |
| 60행 | 별도 조건식 없음 | items.map(item => <Button key={item.id} variant="quiet" aria-pressed={item.id === value} disabled={item.disabled} onClick={() => onChange(item.id)}>{item.label}</Button>)<br>call<br>전달 콜백: H-1a753d1c66a8 |

반환/조기 중단: 60행 <render> [별도 조건식 없음]

## H-1a753d1c66a8

**@callback:items.map** · [src/ui/index.tsx:60](../../../src/ui/index.tsx#L60)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-140a5d82356d

**@onClick** · [src/ui/index.tsx:60](../../../src/ui/index.tsx#L60)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 60행 | 별도 조건식 없음 | onChange(item.id)<br>call |

## H-93a379fa7afb

**Card** · [src/ui/index.tsx:62](../../../src/ui/index.tsx#L62)

분기 조건과 가능한 갈림길:

- B-a0250c48ca7f · ConditionalExpression · props['aria-label'] || props['aria-labelledby'] → truthy / falsy; 바깥 조건: nullish: role (62행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 62행 | 별도 조건식 없음 | classes('ui-card', className)<br>call → [H-5f174828a326](ui__index.md#h-5f174828a326) |

반환/조기 중단: 62행 <render> [별도 조건식 없음]

## H-3ac3d80c9e55

**ListItem** · [src/ui/index.tsx:63](../../../src/ui/index.tsx#L63)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 63행 | 별도 조건식 없음 | classes('ui-list-item', className)<br>call → [H-5f174828a326](ui__index.md#h-5f174828a326) |

반환/조기 중단: 63행 <render> [별도 조건식 없음]

## H-4b86157f284b

**Modal** · [src/ui/index.tsx:67](../../../src/ui/index.tsx#L67)

분기 조건과 가능한 갈림길:

- B-3169a05461b2 · IfStatement · !open → truthy / falsy; 바깥 조건: 별도 조건식 없음 (145행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 68행 | 별도 조건식 없음 | useId()<br>call |
| 68행 | 별도 조건식 없음 | useRef(null)<br>call |
| 68행 | 별도 조건식 없음 | useRef(onClose)<br>call |
| 69행 | 별도 조건식 없음 | useRef(null)<br>call |
| 70행 | 별도 조건식 없음 | useRef(null)<br>call |
| 72행 | 별도 조건식 없음 | useEffect(() => { if (open) return; openingControl.current = null; const remember = (event: PointerEvent) => { const target = event.target instanceof Element ? event.target.closest(focusableSelector) : null; openingControl.current = target instanceof HTMLElement \|\| target instanceof SVGElement ? target : null; }; const clear = () => { openingControl.current = null; }; // Safari touch activation need not focus the button that opens a dialog. document.addEventListener('pointerdown', remember, true); document.addEventListener('pointercancel', clear, true); document.addEventListener('keydown', clear, true); return () => { document.removeEventListener('pointerdown', remember, true); document.removeEventLis … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-a08d78fda642 |
| 90행 | 별도 조건식 없음 | useEffect(() => { if (!open \|\| !dialog.current) return; const original = openingControl.current?.isConnected ? openingControl.current : document.activeElement instanceof HTMLElement \|\| document.activeElement instanceof SVGElement ? document.activeElement : null; openingControl.current = null; const overflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; const background = [...document.body.children].filter(el => el !== dialog.current?.parentElement); const previousInert = background.map(el => el.getAttribute('inert')); background.forEach(el => { el.setAttribute('inert', ''); }); const available = () => [...(dialog.current?.querySelectorAll<HTMLElement>('*') \|\| [])].filter(el  … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-310ceb825f1f |
| 148행 | 별도 조건식 없음 | createPortal(<div className="ui-overlay" onPointerDown={event => { backdropPress.current = event.target === event.currentTarget && event.button === 0 ? { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false } : null; }} onPointerMove={event => { const press = backdropPress.current; // Eight CSS pixels is a local tap tolerance, not a universal gesture standard. if (press && (event.target !== event.currentTarget \|\| Math.hypot(event.clientX - press.x, event.clientY - press.y) > 8)) press.moved = true; }} onPointerUp={event => { // Touch may implicitly capture the pointer; its event target can remain the // backdrop even after the finger has crossed into the dialog. const hit = document.elem … [전체 인수는 JSON·소스])<br>call |
| 168행 | 별도 조건식 없음 | classes('ui-modal', className)<br>call → [H-5f174828a326](ui__index.md#h-5f174828a326) |

반환/조기 중단: 145행 null [truthy: !open]; 148행 createPortal(<div className="ui-overlay" onPointerDown={event => { backdropPress.current = event.target === event.currentTarget && event.button === 0 ? { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false } : null; }} onPointerMove={event => { const press = backdropPress.current; // Eight CSS pixels is a local tap tolerance, not a universal gesture standard. if (press && (event.target !== event.currentTarget || Math.hypot(event.clientX - press.x, event.clientY - press.y) > 8)) press.moved = true; }} onPointerUp={event => { // Touch may implicitly capture the pointer; its event target can remain the // backdrop even after the finger has crossed into the dialog. const hit =  [별도 조건식 없음]

## H-a08d78fda642

**@callback:useEffect** · [src/ui/index.tsx:72](../../../src/ui/index.tsx#L72)

분기 조건과 가능한 갈림길:

- B-e68dd83ce3cf · IfStatement · open → truthy / falsy; 바깥 조건: 별도 조건식 없음 (73행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 81행 | 별도 조건식 없음 | document.addEventListener('pointerdown', remember, true)<br>call<br>전달 콜백: H-674075af4afb |
| 82행 | 별도 조건식 없음 | document.addEventListener('pointercancel', clear, true)<br>call<br>전달 콜백: H-a8a6b466460c |
| 83행 | 별도 조건식 없음 | document.addEventListener('keydown', clear, true)<br>call<br>전달 콜백: H-a8a6b466460c |

반환/조기 중단: 73행 <render> [truthy: open]; 84행 () => { document.removeEventListener('pointerdown', remember, true); document.removeEventListener('pointercancel', clear, true); document.removeEventListener('keydown', clear, true); } [별도 조건식 없음]

## H-674075af4afb

**remember** · [src/ui/index.tsx:75](../../../src/ui/index.tsx#L75)

분기 조건과 가능한 갈림길:

- B-d6884e3c8cfc · ConditionalExpression · event.target instanceof Element → truthy / falsy; 바깥 조건: 별도 조건식 없음 (76행).
- B-ca3db261fa76 · ConditionalExpression · target instanceof HTMLElement || target instanceof SVGElement → truthy / falsy; 바깥 조건: 별도 조건식 없음 (77행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 76행 | truthy: event.target instanceof Element | event.target.closest(focusableSelector)<br>call |

## H-a8a6b466460c

**clear** · [src/ui/index.tsx:79](../../../src/ui/index.tsx#L79)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-05b51ebcefcc

**@anonymous** · [src/ui/index.tsx:84](../../../src/ui/index.tsx#L84)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 85행 | 별도 조건식 없음 | document.removeEventListener('pointerdown', remember, true)<br>call<br>전달 콜백: H-674075af4afb |
| 86행 | 별도 조건식 없음 | document.removeEventListener('pointercancel', clear, true)<br>call<br>전달 콜백: H-a8a6b466460c |
| 87행 | 별도 조건식 없음 | document.removeEventListener('keydown', clear, true)<br>call<br>전달 콜백: H-a8a6b466460c |

## H-310ceb825f1f

**@callback:useEffect** · [src/ui/index.tsx:90](../../../src/ui/index.tsx#L90)

분기 조건과 가능한 갈림길:

- B-0f80f477d4c1 · IfStatement · !open || !dialog.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (91행).
- B-90b67fad4b70 · ConditionalExpression · openingControl.current?.isConnected → truthy / falsy; 바깥 조건: 별도 조건식 없음 (92행).
- B-895c3fcdeddc · ConditionalExpression · document.activeElement instanceof HTMLElement || document.activeElement instanceof SVGElement → truthy / falsy; 바깥 조건: falsy: openingControl.current?.isConnected (93행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 97행 | 별도 조건식 없음 | [...document.body.children].filter(el => el !== dialog.current?.parentElement)<br>call<br>전달 콜백: H-593abf2f3754 |
| 98행 | 별도 조건식 없음 | background.map(el => el.getAttribute('inert'))<br>call<br>전달 콜백: H-d79fb45f41d1 |
| 99행 | 별도 조건식 없음 | background.forEach(el => { el.setAttribute('inert', ''); })<br>call<br>전달 콜백: H-6f84ed954c21 |
| 109행 | 별도 조건식 없음 | (available()[0] \|\| dialog.current).focus({ preventScroll: true })<br>input-control |
| 109행 | 별도 조건식 없음 | available()<br>call → [H-ac0ed316d5ec](ui__index.md#h-ac0ed316d5ec) |
| 121행 | 별도 조건식 없음 | document.addEventListener('keydown', onKeyDown)<br>call<br>전달 콜백: H-f0aa49d1d479 |
| 122행 | 별도 조건식 없음 | document.addEventListener('focusin', onFocus)<br>call<br>전달 콜백: H-e745ed698aa8 |

반환/조기 중단: 91행 <render> [truthy: !open || !dialog.current]; 123행 () => { document.removeEventListener('keydown', onKeyDown); document.removeEventListener('focusin', onFocus); background.forEach((el, index) => { const before = previousInert[index]; if (before === null) el.removeAttribute('inert'); else el.setAttribute('inert', before); }); document.body.style.overflow = overflow; const usable = (element: HTMLElement | SVGElement | null) => { if (!element?.isConnected || element === document.body || element.closest('[hidden], [inert], [aria-hidden="true"]') || element.matches(':disabled')) return false; for (let parent: Element | null = element; parent; parent = parent.parentElement) { const style = getComputedStyle(parent); if (style.display === 'none' ||  [별도 조건식 없음]

## H-593abf2f3754

**@callback:[...document.body.children].filter** · [src/ui/index.tsx:97](../../../src/ui/index.tsx#L97)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d79fb45f41d1

**@callback:background.map** · [src/ui/index.tsx:98](../../../src/ui/index.tsx#L98)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 98행 | 별도 조건식 없음 | el.getAttribute('inert')<br>call |

## H-6f84ed954c21

**@callback:background.forEach** · [src/ui/index.tsx:99](../../../src/ui/index.tsx#L99)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 99행 | 별도 조건식 없음 | el.setAttribute('inert', '')<br>call |

## H-ac0ed316d5ec

**available** · [src/ui/index.tsx:100](../../../src/ui/index.tsx#L100)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 100행 | 별도 조건식 없음 | [...(dialog.current?.querySelectorAll<HTMLElement>('*') \|\| [])].filter(el => { if (!el.matches(focusableSelector) \|\| (el.tabIndex < 0 && !(el.matches('[contenteditable]:not([contenteditable="false"])') && !el.hasAttribute('tabindex'))) \|\| el.matches(':disabled') \|\| el.closest('[hidden], [inert], [aria-hidden="true"]')) return false; for (let ancestor: HTMLElement \| null = el; ancestor && ancestor !== dialog.current; ancestor = ancestor.parentElement) { const style = getComputedStyle(ancestor); if (style.display === 'none' \|\| style.visibility === 'hidden') return false; } return true; })<br>call<br>전달 콜백: H-36d33af00864 |

## H-36d33af00864

**@callback:[...(dialog.current?.querySelectorAll<HTMLElement>('*') || [])].filter** · [src/ui/index.tsx:100](../../../src/ui/index.tsx#L100)

분기 조건과 가능한 갈림길:

- B-384239c5a30f · IfStatement · !el.matches(focusableSelector) || (el.tabIndex < 0 && !(el.matches('[contenteditable]:not([contenteditable="false"])') && !el.hasAttribute('tabindex'))) || el.matches(':disabled') || el.closest('[hidden], [inert], [aria-hidden="true"]') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (101행).
- B-161d046e2493 · IfStatement · style.display === 'none' || style.visibility === 'hidden' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (104행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 101행 | 별도 조건식 없음 | el.matches(focusableSelector)<br>call |
| 101행 | falsy: !el.matches(focusableSelector) ∧ truthy: el.tabIndex < 0 | el.matches('[contenteditable]:not([contenteditable="false"])')<br>call |
| 101행 | falsy: !el.matches(focusableSelector) ∧ truthy: el.tabIndex < 0 ∧ truthy: el.matches('[contenteditable]:not([contenteditable="false"])') | el.hasAttribute('tabindex')<br>call |
| 101행 | falsy: !el.matches(focusableSelector) \|\| (el.tabIndex < 0 && !(el.matches('[contenteditable]:not([contenteditable="false"])') && !el.hasAttribute('tabindex'))) | el.matches(':disabled')<br>call |
| 101행 | falsy: !el.matches(focusableSelector) \|\| (el.tabIndex < 0 && !(el.matches('[contenteditable]:not([contenteditable="false"])') && !el.hasAttribute('tabindex'))) \|\| el.matches(':disabled') | el.closest('[hidden], [inert], [aria-hidden="true"]')<br>call |
| 103행 | 별도 조건식 없음 | getComputedStyle(ancestor)<br>call |

반환/조기 중단: 101행 false [truthy: !el.matches(focusableSelector) || (el.tabIndex < 0 && !(el.matches('[contenteditable]:not([contenteditable="false"])') && !el.hasAttribute('tabindex'))) || el.matches(':disabled') || el.closest('[hidden], [inert], [aria-hidden="true"]')]; 104행 false [truthy: style.display === 'none' || style.visibility === 'hidden']; 106행 true [별도 조건식 없음]

## H-e745ed698aa8

**onFocus** · [src/ui/index.tsx:110](../../../src/ui/index.tsx#L110)

분기 조건과 가능한 갈림길:

- B-2d896aba1044 · IfStatement · event.target instanceof Node && !dialog.current?.contains(event.target) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (111행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 111행 | truthy: event.target instanceof Node && !dialog.current?.contains(event.target) | available()<br>call → [H-ac0ed316d5ec](ui__index.md#h-ac0ed316d5ec) |

## H-f0aa49d1d479

**onKeyDown** · [src/ui/index.tsx:113](../../../src/ui/index.tsx#L113)

분기 조건과 가능한 갈림길:

- B-06bf10784dea · IfStatement · event.key === 'Escape' && !event.isComposing → truthy / falsy; 바깥 조건: 별도 조건식 없음 (114행).
- B-378f1d8d2c33 · IfStatement · event.key !== 'Tab' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (115행).
- B-2f10c797a924 · IfStatement · !first → truthy / falsy; 바깥 조건: 별도 조건식 없음 (117행).
- B-0013838b3090 · IfStatement · event.shiftKey && (document.activeElement === first || !dialog.current?.contains(document.activeElement)) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (118행).
- B-1857130bbaba · IfStatement · !event.shiftKey && (document.activeElement === last || !dialog.current?.contains(document.activeElement)) → truthy / falsy; 바깥 조건: falsy: event.shiftKey && (document.activeElement === first || !dialog.current?.contains(document.activeElement)) (119행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 114행 | truthy: event.key === 'Escape' && !event.isComposing | event.preventDefault()<br>input-control |
| 114행 | truthy: event.key === 'Escape' && !event.isComposing | event.stopPropagation()<br>input-control |
| 114행 | truthy: event.key === 'Escape' && !event.isComposing | close.current()<br>call |
| 116행 | 별도 조건식 없음 | available()<br>call → [H-ac0ed316d5ec](ui__index.md#h-ac0ed316d5ec) |
| 117행 | truthy: !first | event.preventDefault()<br>input-control |
| 118행 | truthy: event.shiftKey && (document.activeElement === first \|\| !dialog.current?.contains(document.activeElement)) | event.preventDefault()<br>input-control |
| 118행 | truthy: event.shiftKey && (document.activeElement === first \|\| !dialog.current?.contains(document.activeElement)) | last.focus()<br>input-control |
| 119행 | falsy: event.shiftKey && (document.activeElement === first \|\| !dialog.current?.contains(document.activeElement)) ∧ truthy: !event.shiftKey && (document.activeElement === last \|\| !dialog.current?.contains(document.activeElement)) | event.preventDefault()<br>input-control |
| 119행 | falsy: event.shiftKey && (document.activeElement === first \|\| !dialog.current?.contains(document.activeElement)) ∧ truthy: !event.shiftKey && (document.activeElement === last \|\| !dialog.current?.contains(document.activeElement)) | first.focus()<br>input-control |

반환/조기 중단: 115행 <render> [truthy: event.key !== 'Tab']; 117행 <render> [truthy: !first]

## H-179db834b970

**@anonymous** · [src/ui/index.tsx:123](../../../src/ui/index.tsx#L123)

분기 조건과 가능한 갈림길:

- B-a4beb8e40592 · IfStatement · usable(original) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (135행).
- B-af27626f444e · IfStatement · usable(heading) → truthy / falsy; 바깥 조건: falsy: usable(original) (138행).
- B-43c14a250682 · IfStatement · !heading!.hasAttribute('tabindex') → truthy / falsy; 바깥 조건: falsy: usable(original) ∧ truthy: usable(heading) (139행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 124행 | 별도 조건식 없음 | document.removeEventListener('keydown', onKeyDown)<br>call<br>전달 콜백: H-f0aa49d1d479 |
| 124행 | 별도 조건식 없음 | document.removeEventListener('focusin', onFocus)<br>call<br>전달 콜백: H-e745ed698aa8 |
| 125행 | 별도 조건식 없음 | background.forEach((el, index) => { const before = previousInert[index]; if (before === null) el.removeAttribute('inert'); else el.setAttribute('inert', before); })<br>call<br>전달 콜백: H-8315ef92743e |
| 135행 | 별도 조건식 없음 | usable(original)<br>call → [H-6602844086d2](ui__index.md#h-6602844086d2) |
| 135행 | truthy: usable(original) | original!.focus({ preventScroll: true })<br>input-control |
| 137행 | falsy: usable(original) | document.querySelector('main h1')<br>call |
| 138행 | falsy: usable(original) | usable(heading)<br>call → [H-6602844086d2](ui__index.md#h-6602844086d2) |
| 139행 | falsy: usable(original) ∧ truthy: usable(heading) | heading!.hasAttribute('tabindex')<br>call |
| 140행 | falsy: usable(original) ∧ truthy: usable(heading) | heading!.focus({ preventScroll: true })<br>input-control |

## H-8315ef92743e

**@callback:background.forEach** · [src/ui/index.tsx:125](../../../src/ui/index.tsx#L125)

분기 조건과 가능한 갈림길:

- B-6b884b1188d7 · IfStatement · before === null → truthy / falsy; 바깥 조건: 별도 조건식 없음 (125행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 125행 | truthy: before === null | el.removeAttribute('inert')<br>call |
| 125행 | falsy: before === null | el.setAttribute('inert', before)<br>call |

## H-6602844086d2

**usable** · [src/ui/index.tsx:127](../../../src/ui/index.tsx#L127)

분기 조건과 가능한 갈림길:

- B-b4b1f29b6683 · IfStatement · !element?.isConnected || element === document.body || element.closest('[hidden], [inert], [aria-hidden="true"]') || element.matches(':disabled') → truthy / falsy; 바깥 조건: 별도 조건식 없음 (128행).
- B-ecccc83f0f75 · IfStatement · style.display === 'none' || style.visibility === 'hidden' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (131행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 128행 | falsy: !element?.isConnected \|\| element === document.body | element.closest('[hidden], [inert], [aria-hidden="true"]')<br>call |
| 128행 | falsy: !element?.isConnected \|\| element === document.body \|\| element.closest('[hidden], [inert], [aria-hidden="true"]') | element.matches(':disabled')<br>call |
| 130행 | 별도 조건식 없음 | getComputedStyle(parent)<br>call |

반환/조기 중단: 128행 false [truthy: !element?.isConnected || element === document.body || element.closest('[hidden], [inert], [aria-hidden="true"]') || element.matches(':disabled')]; 131행 false [truthy: style.display === 'none' || style.visibility === 'hidden']; 133행 true [별도 조건식 없음]

## H-d2e650879e1c

**@onPointerDown** · [src/ui/index.tsx:149](../../../src/ui/index.tsx#L149)

분기 조건과 가능한 갈림길:

- B-37b24e313a92 · ConditionalExpression · event.target === event.currentTarget && event.button === 0 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (150행).

## H-05540ff665fb

**@onPointerMove** · [src/ui/index.tsx:153](../../../src/ui/index.tsx#L153)

분기 조건과 가능한 갈림길:

- B-5d1f169f7239 · IfStatement · press && (event.target !== event.currentTarget || Math.hypot(event.clientX - press.x, event.clientY - press.y) > 8) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (156행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 156행 | truthy: press ∧ falsy: event.target !== event.currentTarget | Math.hypot(event.clientX - press.x, event.clientY - press.y)<br>call |

## H-474548cc6ce7

**@onPointerUp** · [src/ui/index.tsx:158](../../../src/ui/index.tsx#L158)

분기 조건과 가능한 갈림길:

- B-f4a070d43f60 · IfStatement · event.target !== event.currentTarget || (hit && hit !== event.currentTarget) || event.pointerId !== backdropPress.current?.id → truthy / falsy; 바깥 조건: 별도 조건식 없음 (162행).

## H-664a3913dbfc

**@onPointerCancel** · [src/ui/index.tsx:164](../../../src/ui/index.tsx#L164)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7d9985b958f7

**@onClick** · [src/ui/index.tsx:165](../../../src/ui/index.tsx#L165)

분기 조건과 가능한 갈림길:

- B-774f28c712c4 · IfStatement · event.target === event.currentTarget && press && !press.moved → truthy / falsy; 바깥 조건: 별도 조건식 없음 (167행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 167행 | truthy: event.target === event.currentTarget && press && !press.moved | onClose()<br>call |

## H-30438efcb98a

**Sheet** · [src/ui/index.tsx:170](../../../src/ui/index.tsx#L170)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 170행 | 별도 조건식 없음 | classes('ui-sheet', props.className)<br>call → [H-5f174828a326](ui__index.md#h-5f174828a326) |

반환/조기 중단: 170행 <render> [별도 조건식 없음]

## H-4be557740333

**Toast** · [src/ui/index.tsx:171](../../../src/ui/index.tsx#L171)


반환/조기 중단: 172행 <render> [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-06d56061221b

**Breadcrumb** · [src/ui/index.tsx:175](../../../src/ui/index.tsx#L175)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 176행 | 별도 조건식 없음 | occurrenceRows(items, item => JSON.stringify([item.href, item.label])).map(({value: item, index, key}) => <li key={key}>{index === items.length - 1 ? <span aria-current="page">{item.label}</span> : item.href ? <a href={item.href} onClick={item.onClick}>{item.label}</a> : <button type="button" onClick={item.onClick}>{item.label}</button>}</li>)<br>call<br>전달 콜백: H-7d8f63d3f940 |
| 176행 | 별도 조건식 없음 | occurrenceRows(items, item => JSON.stringify([item.href, item.label]))<br>call<br>전달 콜백: H-98de303b2536 |

반환/조기 중단: 176행 <render> [별도 조건식 없음]

## H-98de303b2536

**@callback:occurrenceRows** · [src/ui/index.tsx:176](../../../src/ui/index.tsx#L176)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 176행 | 별도 조건식 없음 | JSON.stringify([item.href, item.label])<br>call |

## H-7d8f63d3f940

**@callback:occurrenceRows(items, item => JSON.stringify([item.href, item.label])).map** · [src/ui/index.tsx:176](../../../src/ui/index.tsx#L176)

분기 조건과 가능한 갈림길:

- B-fb66d5990f99 · ConditionalExpression · index === items.length - 1 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (176행).
- B-7ee5dfcefb88 · ConditionalExpression · item.href → truthy / falsy; 바깥 조건: falsy: index === items.length - 1 (176행).

## H-9487631edc82

**Search** · [src/ui/index.tsx:178](../../../src/ui/index.tsx#L178)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 179행 | 별도 조건식 없음 | useRef(false)<br>call |
| 179행 | 별도 조건식 없음 | useRef(undefined)<br>call |
| 180행 | 별도 조건식 없음 | useEffect(() => { if (!composing.current && typeof props.value === 'string') last.current = props.value; }, [props.value])<br>call<br>전달 콜백: H-8fa915ef6207 |

반환/조기 중단: 182행 <render> [별도 조건식 없음]

## H-8fa915ef6207

**@callback:useEffect** · [src/ui/index.tsx:180](../../../src/ui/index.tsx#L180)

분기 조건과 가능한 갈림길:

- B-2d620c996cac · IfStatement · !composing.current && typeof props.value === 'string' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (180행).

## H-178cc48d77da

**publish** · [src/ui/index.tsx:181](../../../src/ui/index.tsx#L181)

분기 조건과 가능한 갈림길:

- B-8a54e6b673e6 · IfStatement · last.current !== value → truthy / falsy; 바깥 조건: 별도 조건식 없음 (181행).

## H-0c259014a6f9

**@onChange** · [src/ui/index.tsx:182](../../../src/ui/index.tsx#L182)

분기 조건과 가능한 갈림길:

- B-29848753a3ec · IfStatement · !composing.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (182행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 182행 | truthy: !composing.current | publish(event.currentTarget.value)<br>call → [H-178cc48d77da](ui__index.md#h-178cc48d77da) |

## H-2b4ac858d0d9

**@onCompositionStart** · [src/ui/index.tsx:182](../../../src/ui/index.tsx#L182)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-716bf47b7c72

**@onCompositionEnd** · [src/ui/index.tsx:182](../../../src/ui/index.tsx#L182)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 182행 | 별도 조건식 없음 | publish(event.currentTarget.value)<br>call → [H-178cc48d77da](ui__index.md#h-178cc48d77da) |

## H-352a89afe014

**EmptyState** · [src/ui/index.tsx:184](../../../src/ui/index.tsx#L184)


반환/조기 중단: 185행 <render> [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-46cb52806480

**LoadingState** · [src/ui/index.tsx:187](../../../src/ui/index.tsx#L187)


반환/조기 중단: 187행 <render> [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d1925fd6b550

**ErrorState** · [src/ui/index.tsx:188](../../../src/ui/index.tsx#L188)


반환/조기 중단: 189행 <render> [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-dd54a5bc559d

**ScreenBoundary.getDerivedStateFromError** · [src/ui/index.tsx:195](../../../src/ui/index.tsx#L195)


반환/조기 중단: 195행 { failed: true } [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-d5292468b83a

**ScreenBoundary.render** · [src/ui/index.tsx:196](../../../src/ui/index.tsx#L196)

분기 조건과 가능한 갈림길:

- B-1e85c3c86913 · IfStatement · !this.state.failed → truthy / falsy; 바깥 조건: 별도 조건식 없음 (197행).

반환/조기 중단: 197행 this.props.children [truthy: !this.state.failed]; 198행 <render> [별도 조건식 없음]

## H-d9ccd8e38eae

**@anonymous** · [src/ui/index.tsx:201](../../../src/ui/index.tsx#L201)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 201행 | falsy: this.props.onRetry | window.location.reload()<br>call |

