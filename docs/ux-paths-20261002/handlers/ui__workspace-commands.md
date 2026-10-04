# src/ui/workspace-commands.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-67072e6b57ca

**WorkspaceCommands** · [src/ui/workspace-commands.tsx:11](../../../src/ui/workspace-commands.tsx#L11)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 12행 | 별도 조건식 없음 | useState(false)<br>call |
| 13행 | 별도 조건식 없음 | useState('')<br>call |
| 14행 | 별도 조건식 없음 | useRef(null)<br>call |
| 15행 | 별도 조건식 없음 | useRef(null)<br>call |
| 20행 | 별도 조건식 없음 | useEffect(() => { function shortcut(event: KeyboardEvent) { if ( event.isComposing \|\| event.keyCode === 229 \|\| event.defaultPrevented \|\| !(event.metaKey \|\| event.ctrlKey) \|\| !event.shiftKey \|\| event.key.toLowerCase() !== 'k' ) return; if ( event.target instanceof Element && event.target.closest( 'input, textarea, select, [contenteditable], .cm-editor, .monaco-editor, [role="dialog"]', ) ) return; event.preventDefault(); setQuery(''); setOpen(true); } document.addEventListener('keydown', shortcut); return () => document.removeEventListener('keydown', shortcut); }, [])<br>call<br>전달 콜백: H-095bcc6a77ff |
| 45행 | 별도 조건식 없음 | useEffect(() => { if (open) input.current?.focus(); }, [open])<br>call<br>전달 콜백: H-5c180e33632b |
| 48행 | 별도 조건식 없음 | query.trim().normalize('NFC').toLocaleLowerCase('ko-KR')<br>call |
| 48행 | 별도 조건식 없음 | query.trim().normalize('NFC')<br>call |
| 48행 | 별도 조건식 없음 | query.trim()<br>call |
| 49행 | 별도 조건식 없음 | commands.filter((command) => `${command.title} ${command.keywords ?? ''}` .normalize('NFC') .toLocaleLowerCase('ko-KR') .includes(term))<br>call<br>전달 콜백: H-64bcf196fa44 |
| 113행 | truthy: open | visible.map((command) => ( <li key={command.id}> <Button disabled={!!command.disabled} onClick={() => { setOpen(false); command.run(); }} > {command.title} </Button> {command.disabled && <p>{command.disabled}</p>} </li> ))<br>call<br>전달 콜백: H-1648a821a339 |

반환/조기 중단: 55행 <render> [별도 조건식 없음]

## H-e99234724acd

**show** · [src/ui/workspace-commands.tsx:16](../../../src/ui/workspace-commands.tsx#L16)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 17행 | 별도 조건식 없음 | setQuery('')<br>state-update |
| 18행 | 별도 조건식 없음 | setOpen(true)<br>state-update |

## H-095bcc6a77ff

**@callback:useEffect** · [src/ui/workspace-commands.tsx:20](../../../src/ui/workspace-commands.tsx#L20)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 42행 | 별도 조건식 없음 | document.addEventListener('keydown', shortcut)<br>call<br>전달 콜백: H-f56f414d26b1 |

반환/조기 중단: 43행 () => document.removeEventListener('keydown', shortcut) [별도 조건식 없음]

## H-f56f414d26b1

**shortcut** · [src/ui/workspace-commands.tsx:21](../../../src/ui/workspace-commands.tsx#L21)

분기 조건과 가능한 갈림길:

- B-967937652b96 · IfStatement · event.isComposing || event.keyCode === 229 || event.defaultPrevented || !(event.metaKey || event.ctrlKey) || !event.shiftKey || event.key.toLowerCase() !== 'k' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (22행).
- B-ce600bb67e46 · IfStatement · event.target instanceof Element && event.target.closest( 'input, textarea, select, [contenteditable], .cm-editor, .monaco-editor, [role="dialog"]', ) → truthy / falsy; 바깥 조건: 별도 조건식 없음 (31행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 28행 | falsy: event.isComposing \|\|<br>        event.keyCode === 229 \|\|<br>        event.defaultPrevented \|\|<br>        !(event.metaKey \|\| event.ctrlKey) \|\|<br>        !event.shiftKey | event.key.toLowerCase()<br>call |
| 33행 | truthy: event.target instanceof Element | event.target.closest('input, textarea, select, [contenteditable], .cm-editor, .monaco-editor, [role="dialog"]')<br>call |
| 38행 | 별도 조건식 없음 | event.preventDefault()<br>input-control |
| 39행 | 별도 조건식 없음 | setQuery('')<br>state-update |
| 40행 | 별도 조건식 없음 | setOpen(true)<br>state-update |

반환/조기 중단: 30행 <render> [truthy: event.isComposing ||
        event.keyCode === 229 ||
        event.defaultPrevented ||
        !(event.metaKey || event.ctrlKey) ||
        !event.shiftKey ||
        event.key.toLowerCase() !== 'k']; 37행 <render> [truthy: event.target instanceof Element &&
        event.target.closest(
          'input, textarea, select, [contenteditable], .cm-editor, .monaco-editor, [role="dialog"]',
        )]

## H-5c180e33632b

**@callback:useEffect** · [src/ui/workspace-commands.tsx:45](../../../src/ui/workspace-commands.tsx#L45)

분기 조건과 가능한 갈림길:

- B-4bc9da1b3bc8 · IfStatement · open → truthy / falsy; 바깥 조건: 별도 조건식 없음 (46행).

## H-64bcf196fa44

**@callback:commands.filter** · [src/ui/workspace-commands.tsx:49](../../../src/ui/workspace-commands.tsx#L49)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 50행 | 별도 조건식 없음 | `${command.title} ${command.keywords ?? ''}`<br>      .normalize('NFC')<br>      .toLocaleLowerCase('ko-KR')<br>      .includes(term)<br>call |
| 50행 | 별도 조건식 없음 | `${command.title} ${command.keywords ?? ''}`<br>      .normalize('NFC')<br>      .toLocaleLowerCase('ko-KR')<br>call |
| 50행 | 별도 조건식 없음 | `${command.title} ${command.keywords ?? ''}`<br>      .normalize('NFC')<br>call |

## H-79323df63585

**@onClose** · [src/ui/workspace-commands.tsx:60](../../../src/ui/workspace-commands.tsx#L60)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 60행 | truthy: open | setOpen(false)<br>state-update |

## H-33a1b2f662d5

**@onChange** · [src/ui/workspace-commands.tsx:66](../../../src/ui/workspace-commands.tsx#L66)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 66행 | truthy: open | setQuery(event.target.value)<br>state-update |

## H-c899aa467c4e

**@onKeyDown** · [src/ui/workspace-commands.tsx:67](../../../src/ui/workspace-commands.tsx#L67)

분기 조건과 가능한 갈림길:

- B-3450837ba3ad · IfStatement · event.nativeEvent.isComposing → truthy / falsy; 바깥 조건: truthy: open (68행).
- B-ac5bfeb5fc54 · IfStatement · event.key === 'ArrowDown' → truthy / falsy; 바깥 조건: truthy: open (69행).
- B-fab73c45a625 · IfStatement · event.key === 'Enter' && visible.length === 1 && !visible[0].disabled → truthy / falsy; 바깥 조건: truthy: open (73행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 70행 | truthy: open ∧ truthy: event.key === 'ArrowDown' | event.preventDefault()<br>input-control |
| 74행 | truthy: open ∧ truthy: event.key === 'Enter' && visible.length === 1 && !visible[0].disabled | event.preventDefault()<br>input-control |
| 75행 | truthy: open ∧ truthy: event.key === 'Enter' && visible.length === 1 && !visible[0].disabled | setOpen(false)<br>state-update |
| 76행 | truthy: open ∧ truthy: event.key === 'Enter' && visible.length === 1 && !visible[0].disabled | visible[0].run()<br>call |

반환/조기 중단: 68행 <render> [truthy: open ∧ truthy: event.nativeEvent.isComposing]

## H-25e64d14b9ca

**@onKeyDown** · [src/ui/workspace-commands.tsx:90](../../../src/ui/workspace-commands.tsx#L90)

분기 조건과 가능한 갈림길:

- B-7025464ccbd3 · IfStatement · !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) || event.nativeEvent.isComposing → truthy / falsy; 바깥 조건: truthy: open (91행).
- B-d4a8731827f9 · IfStatement · index < 0 || !buttons.length → truthy / falsy; 바깥 조건: truthy: open (101행).
- B-e94a01b6e448 · ConditionalExpression · event.key === 'Home' → truthy / falsy; 바깥 조건: truthy: open (104행).
- B-e219825e844f · ConditionalExpression · event.key === 'End' → truthy / falsy; 바깥 조건: truthy: open ∧ falsy: event.key === 'Home' (106행).
- B-c5714c470b6e · ConditionalExpression · event.key === 'ArrowDown' → truthy / falsy; 바깥 조건: truthy: open ∧ falsy: event.key === 'Home' ∧ falsy: event.key === 'End' (108행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 92행 | truthy: open | ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)<br>call |
| 100행 | truthy: open | buttons.indexOf(document.activeElement as HTMLButtonElement)<br>call |
| 102행 | truthy: open | event.preventDefault()<br>input-control |

반환/조기 중단: 95행 <render> [truthy: open ∧ truthy: !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) ||
              event.nativeEvent.isComposing]; 101행 <render> [truthy: open ∧ truthy: index < 0 || !buttons.length]

## H-1648a821a339

**@callback:visible.map** · [src/ui/workspace-commands.tsx:113](../../../src/ui/workspace-commands.tsx#L113)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-c786fc469337

**@onClick** · [src/ui/workspace-commands.tsx:117](../../../src/ui/workspace-commands.tsx#L117)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 118행 | truthy: open | setOpen(false)<br>state-update |
| 119행 | truthy: open | command.run()<br>call |

