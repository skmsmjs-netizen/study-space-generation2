# src/ui/code-syntax-status.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-9d8bd41e51d5

**useCodeSyntax** · [src/ui/code-syntax-status.tsx:8](../../../src/ui/code-syntax-status.tsx#L8)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 9행 | 별도 조건식 없음 | useRef(null)<br>call |
| 10행 | 별도 조건식 없음 | useRef(0)<br>call |
| 11행 | 별도 조건식 없음 | useRef(false)<br>call |
| 12행 | 별도 조건식 없음 | useState(0)<br>call |
| 13행 | 별도 조건식 없음 | useState([])<br>call |
| 14행 | 별도 조건식 없음 | useState('empty')<br>call |
| 16행 | 별도 조건식 없음 | useEffect(() => { unavailable.current = false; try { worker.current = new SyntaxWorker(); } catch { unavailable.current = true; setStatus('unavailable'); return; } worker.current.onmessage = ( event: MessageEvent<{ id: number; diagnostics?: SyntaxDiagnostic[]; unavailable?: boolean; }>, ) => { if (event.data.id !== id.current) return; unavailable.current = Boolean(event.data.unavailable); setDiagnostics(event.data.diagnostics ?? []); setStatus(event.data.unavailable ? 'unavailable' : 'ready'); }; worker.current.onerror = () => { unavailable.current = true; setDiagnostics([]); setStatus('unavailable'); }; return () => { id.current++; worker.current?.terminate(); worker.current = null; }; }, [retry])<br>call<br>전달 콜백: H-d2e22ca985cf |
| 49행 | 별도 조건식 없음 | useEffect(() => { const request = ++id.current; setDiagnostics([]); setStatus(value.trim() ? (unavailable.current ? 'unavailable' : 'checking') : 'empty'); if (!value.trim() \|\| unavailable.current) return; const timer = setTimeout(() => { try { worker.current?.postMessage({ id: request, code: value, language }); } catch { unavailable.current = true; setStatus('unavailable'); } }, 350); return () => clearTimeout(timer); }, [value, language, retry])<br>call<br>전달 콜백: H-80b4ef93bf4c |

반환/조기 중단: 64행 { diagnostics, status, retry: () => setRetry((value) => value + 1) } [별도 조건식 없음]

## H-d2e22ca985cf

**@callback:useEffect** · [src/ui/code-syntax-status.tsx:16](../../../src/ui/code-syntax-status.tsx#L16)

분기 조건과 가능한 갈림길:

- B-006437334df0 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (18행).
- B-f6d1fd897d18 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (20행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 22행 | exception: exception | setStatus('unavailable')<br>state-update |

반환/조기 중단: 23행 <render> [exception: exception]; 42행 () => { id.current++; worker.current?.terminate(); worker.current = null; } [별도 조건식 없음]

## H-80b4ef93bf4c

**@callback:useEffect** · [src/ui/code-syntax-status.tsx:49](../../../src/ui/code-syntax-status.tsx#L49)

분기 조건과 가능한 갈림길:

- B-86c1941a8780 · ConditionalExpression · value.trim() → truthy / falsy; 바깥 조건: 별도 조건식 없음 (52행).
- B-47d7f4f479f1 · ConditionalExpression · unavailable.current → truthy / falsy; 바깥 조건: truthy: value.trim() (52행).
- B-8cc405808f3d · IfStatement · !value.trim() || unavailable.current → truthy / falsy; 바깥 조건: 별도 조건식 없음 (53행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 51행 | 별도 조건식 없음 | setDiagnostics([])<br>state-update |
| 52행 | 별도 조건식 없음 | setStatus(value.trim() ? (unavailable.current ? 'unavailable' : 'checking') : 'empty')<br>state-update |
| 52행 | 별도 조건식 없음 | value.trim()<br>call |
| 53행 | 별도 조건식 없음 | value.trim()<br>call |
| 54행 | 별도 조건식 없음 | setTimeout(() => { try { worker.current?.postMessage({ id: request, code: value, language }); } catch { unavailable.current = true; setStatus('unavailable'); } }, 350)<br>state-update<br>전달 콜백: H-5445ecc0a071 |

반환/조기 중단: 53행 <render> [truthy: !value.trim() || unavailable.current]; 62행 () => clearTimeout(timer) [별도 조건식 없음]

## H-5445ecc0a071

**@callback:setTimeout** · [src/ui/code-syntax-status.tsx:54](../../../src/ui/code-syntax-status.tsx#L54)

분기 조건과 가능한 갈림길:

- B-8b7053a40347 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (55행).
- B-5c7c19c92fbe · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (57행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 59행 | exception: exception | setStatus('unavailable')<br>state-update |

## H-ff4a5aaa3aa6

**CodeSyntaxStatus** · [src/ui/code-syntax-status.tsx:66](../../../src/ui/code-syntax-status.tsx#L66)

분기 조건과 가능한 갈림길:

- B-741e8b935ace · ConditionalExpression · status === 'checking' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (77행).
- B-8aa7857fe5a4 · ConditionalExpression · status === 'empty' → truthy / falsy; 바깥 조건: falsy: status === 'checking' (79행).
- B-063a9bbac381 · ConditionalExpression · status === 'unavailable' → truthy / falsy; 바깥 조건: falsy: status === 'checking' ∧ falsy: status === 'empty' (81행).
- B-be4ef07bdd7c · ConditionalExpression · diagnostics.length → truthy / falsy; 바깥 조건: falsy: status === 'checking' ∧ falsy: status === 'empty' ∧ falsy: status === 'unavailable' (83행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 97행 | truthy: diagnostics.length > 0 | occurrenceRows(diagnostics, issue => JSON.stringify(issue)).map(({value: issue, key}) => ( <li key={key}> <Button variant="quiet" onClick={() => goTo(issue)}> {issue.startLineNumber}행 {issue.startColumn}열: {issue.message} </Button> </li> ))<br>call<br>전달 콜백: H-4c3abcaadb8f |
| 97행 | truthy: diagnostics.length > 0 | occurrenceRows(diagnostics, issue => JSON.stringify(issue))<br>call<br>전달 콜백: H-4e269e661216 |

반환/조기 중단: 74행 <render> [별도 조건식 없음]

## H-4e269e661216

**@callback:occurrenceRows** · [src/ui/code-syntax-status.tsx:97](../../../src/ui/code-syntax-status.tsx#L97)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 97행 | truthy: diagnostics.length > 0 | JSON.stringify(issue)<br>call |

## H-4c3abcaadb8f

**@callback:occurrenceRows(diagnostics, issue => JSON.stringify(issue)).map** · [src/ui/code-syntax-status.tsx:97](../../../src/ui/code-syntax-status.tsx#L97)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-3b632d00ae7f

**@onClick** · [src/ui/code-syntax-status.tsx:99](../../../src/ui/code-syntax-status.tsx#L99)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 99행 | truthy: diagnostics.length > 0 | goTo(issue)<br>call |

