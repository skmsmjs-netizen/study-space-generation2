# src/ui/home-tools.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-b4bbff297e9a

**NowClock** · [src/ui/home-tools.tsx:13](../../../src/ui/home-tools.tsx#L13)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 14행 | 별도 조건식 없음 | useState(() => new Date())<br>call<br>전달 콜백: H-dbc3272f2b8f |
| 15행 | 별도 조건식 없음 | useEffect(() => { let timer: ReturnType<typeof setTimeout> \| undefined; const refresh = () => { if (timer !== undefined) clearTimeout(timer); timer = undefined; if (document.visibilityState === 'hidden') return; setNow(new Date()); timer = setTimeout(refresh, 60_000 - Date.now() % 60_000); }; refresh(); document.addEventListener('visibilitychange', refresh); window.addEventListener('focus', refresh); window.addEventListener('pageshow', refresh); return () => { if (timer !== undefined) clearTimeout(timer); document.removeEventListener('visibilitychange', refresh); window.removeEventListener('focus', refresh); window.removeEventListener('pageshow', refresh); }; }, [])<br>call<br>전달 콜백: H-a80484555bad |
| 36행 | 별도 조건식 없음 | dateFormat.format(now)<br>call |
| 37행 | 별도 조건식 없음 | now.toISOString()<br>call |
| 37행 | 별도 조건식 없음 | timeFormat.format(now)<br>call |

반환/조기 중단: 35행 <render> [별도 조건식 없음]

## H-dbc3272f2b8f

**@callback:useState** · [src/ui/home-tools.tsx:14](../../../src/ui/home-tools.tsx#L14)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a80484555bad

**@callback:useEffect** · [src/ui/home-tools.tsx:15](../../../src/ui/home-tools.tsx#L15)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 24행 | 별도 조건식 없음 | refresh()<br>call → [H-304647f5effc](ui__home-tools.md#h-304647f5effc) |
| 25행 | 별도 조건식 없음 | document.addEventListener('visibilitychange', refresh)<br>call<br>전달 콜백: H-304647f5effc |
| 26행 | 별도 조건식 없음 | window.addEventListener('focus', refresh)<br>call<br>전달 콜백: H-304647f5effc |
| 27행 | 별도 조건식 없음 | window.addEventListener('pageshow', refresh)<br>call<br>전달 콜백: H-304647f5effc |

반환/조기 중단: 28행 () => { if (timer !== undefined) clearTimeout(timer); document.removeEventListener('visibilitychange', refresh); window.removeEventListener('focus', refresh); window.removeEventListener('pageshow', refresh); } [별도 조건식 없음]

## H-304647f5effc

**refresh** · [src/ui/home-tools.tsx:17](../../../src/ui/home-tools.tsx#L17)

분기 조건과 가능한 갈림길:

- B-7ccf01ad125a · IfStatement · timer !== undefined → truthy / falsy; 바깥 조건: 별도 조건식 없음 (18행).
- B-9f76060646eb · IfStatement · document.visibilityState === 'hidden' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (20행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 18행 | truthy: timer !== undefined | clearTimeout(timer)<br>call |
| 21행 | 별도 조건식 없음 | setNow(new Date())<br>state-update |
| 22행 | 별도 조건식 없음 | setTimeout(refresh, 60_000 - Date.now() % 60_000)<br>state-update<br>전달 콜백: H-304647f5effc |
| 22행 | 별도 조건식 없음 | Date.now()<br>call |

반환/조기 중단: 20행 <render> [truthy: document.visibilityState === 'hidden']

## H-9ef82f741203

**HomeTools** · [src/ui/home-tools.tsx:41](../../../src/ui/home-tools.tsx#L41)


반환/조기 중단: 42행 <render> [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-22f1917bc744

**@onClick** · [src/ui/home-tools.tsx:48](../../../src/ui/home-tools.tsx#L48)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 48행 | 별도 조건식 없음 | onNavigate('/record')<br>call |

## H-9669aa3cd2cd

**@onClick** · [src/ui/home-tools.tsx:53](../../../src/ui/home-tools.tsx#L53)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 53행 | 별도 조건식 없음 | onNavigate('/free')<br>call |

## H-906cf1a34d96

**@onClick** · [src/ui/home-tools.tsx:58](../../../src/ui/home-tools.tsx#L58)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 58행 | 별도 조건식 없음 | onNavigate('/recall')<br>call |

