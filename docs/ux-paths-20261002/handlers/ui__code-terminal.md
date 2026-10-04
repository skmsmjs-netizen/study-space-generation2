# src/ui/code-terminal.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-b7f0febe1950

**CodeTerminal** · [src/ui/code-terminal.tsx:13](../../../src/ui/code-terminal.tsx#L13)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 24행 | 별도 조건식 없음 | useRef(null)<br>call |
| 25행 | 별도 조건식 없음 | useRef(null)<br>call |
| 26행 | 별도 조건식 없음 | useEffect(() => { const term = new Terminal({ cursorBlink: true, screenReaderMode: true, fontSize: 14, fontFamily: 'Menlo, Consolas, monospace', scrollback: 1000, disableStdin: true, theme: { background: '#1e1e1e', foreground: '#d4d4d4', cursor: '#d4d4d4', }, }); const fit = new FitAddon(); term.loadAddon(fit); term.open(host.current!); terminal.current = term; host.current!.querySelector('textarea')?.setAttribute('aria-label', '실행 중 입력하는 터미널'); // Programs cannot read clipboard or trigger links through terminal escape sequences. const clipboard = term.parser.registerOscHandler(52, () => true); const input = term.onData((text) => execution.current?.write(text)); const resized = term.onResize(({ cols,  … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-42b9a332fd7b |
| 73행 | 별도 조건식 없음 | useEffect(() => { if (!terminal.current) return; terminal.current.options.disableStdin = !running; if (running) { execution.current?.resize(terminal.current.cols, terminal.current.rows); if (!prefersTouchCodeEditor()) terminal.current.focus(); } }, [running, execution])<br>call<br>전달 콜백: H-7ca11d6814ed |

반환/조기 중단: 81행 <render> [별도 조건식 없음]

## H-42b9a332fd7b

**@callback:useEffect** · [src/ui/code-terminal.tsx:26](../../../src/ui/code-terminal.tsx#L26)

분기 조건과 가능한 갈림길:

- B-a83ec8808dcc · IfStatement · pendingOutput.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (58행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 41행 | 별도 조건식 없음 | term.loadAddon(fit)<br>call |
| 42행 | 별도 조건식 없음 | term.open(host.current!)<br>call |
| 44행 | 별도 조건식 없음 | host.current!.querySelector('textarea')<br>call |
| 46행 | 별도 조건식 없음 | term.parser.registerOscHandler(52, () => true)<br>call<br>전달 콜백: H-948e9e6f9567 |
| 47행 | 별도 조건식 없음 | term.onData((text) => execution.current?.write(text))<br>call<br>전달 콜백: H-37c7c2b0512c |
| 48행 | 별도 조건식 없음 | term.onResize(({ cols, rows }) => execution.current?.resize(cols, rows))<br>call<br>전달 콜백: H-1a9ab4d6445c |
| 52행 | 별도 조건식 없음 | observer.observe(host.current!)<br>call |
| 59행 | truthy: pendingOutput.current | term.write(pendingOutput.current)<br>call |
| 62행 | 별도 조건식 없음 | fit.fit()<br>call |

반환/조기 중단: 63행 () => { handle.current = null; terminal.current = null; observer.disconnect(); input.dispose(); resized.dispose(); clipboard.dispose(); term.dispose(); } [별도 조건식 없음]

## H-948e9e6f9567

**@callback:term.parser.registerOscHandler** · [src/ui/code-terminal.tsx:46](../../../src/ui/code-terminal.tsx#L46)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-37c7c2b0512c

**@callback:term.onData** · [src/ui/code-terminal.tsx:47](../../../src/ui/code-terminal.tsx#L47)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1a9ab4d6445c

**@callback:term.onResize** · [src/ui/code-terminal.tsx:48](../../../src/ui/code-terminal.tsx#L48)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-7ca11d6814ed

**@callback:useEffect** · [src/ui/code-terminal.tsx:73](../../../src/ui/code-terminal.tsx#L73)

분기 조건과 가능한 갈림길:

- B-22a99632e8fd · IfStatement · !terminal.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (74행).
- B-a808afd3e73e · IfStatement · running → truthy / falsy; 바깥 조건: 별도 조건식 없음 (76행).
- B-9f42c087d982 · IfStatement · !prefersTouchCodeEditor() → truthy / falsy; 바깥 조건: truthy: running (78행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 78행 | truthy: running | prefersTouchCodeEditor()<br>call → [H-e9b6027fc27b](ui__source-editor.md#h-e9b6027fc27b) |
| 78행 | truthy: running ∧ truthy: !prefersTouchCodeEditor() | terminal.current.focus()<br>input-control |

반환/조기 중단: 74행 <render> [truthy: !terminal.current]

