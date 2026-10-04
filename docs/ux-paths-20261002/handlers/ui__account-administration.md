# src/ui/account-administration.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-599324cd3c6e

**AccountAdministration** · [src/ui/account-administration.tsx:6](../../../src/ui/account-administration.tsx#L6)

분기 조건과 가능한 갈림길:

- B-a847e580b25e · ConditionalExpression · total===null → truthy / falsy; 바깥 조건: truthy: open (35행).
- B-6d0a2b2f394c · ConditionalExpression · decision.account.displayName → truthy / falsy; 바깥 조건: truthy: open ∧ truthy: decision (50행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 7행 | 별도 조건식 없음 | useState(false)<br>call |
| 8행 | 별도 조건식 없음 | useState([])<br>call |
| 8행 | 별도 조건식 없음 | useState(null)<br>call |
| 9행 | 별도 조건식 없음 | useState(null)<br>call |
| 10행 | 별도 조건식 없음 | useState(false)<br>call |
| 10행 | 별도 조건식 없음 | useState('')<br>call |
| 10행 | 별도 조건식 없음 | useState('')<br>call |
| 11행 | 별도 조건식 없음 | useState(null)<br>call |
| 18행 | 별도 조건식 없음 | useEffectEvent(() => load())<br>call<br>전달 콜백: H-f6eecf52f19b |
| 20행 | 별도 조건식 없음 | useEffect(() => { if (open) { setDecision(null); setNotice(''); void loadOnOpen(); } }, [open, api])<br>call<br>전달 콜백: H-93f455afe46d |
| 39행 | truthy: open | accounts.map(account => <li key={account.userId}> <strong>{account.displayName \|\| '이름 미등록'}</strong><p>{account.email}</p><p>{account.administrator ? '관리자' : labels[account.status]} · {account.emailConfirmed ? '이메일 확인됨' : '이메일 확인 대기'} · 가입일 {new Date(account.createdAt).toLocaleDateString('ko-KR')}</p> {!account.administrator && <div className="actions"> {account.status !== 'approved' && <Button disabled={busy \|\| !account.emailConfirmed} onClick={() => setDecision({ account, status: 'approved' })}>승인</Button>} {account.status === 'pending' && <Button disabled={busy} onClick={() => setDecision({ account, status: 'rejected' })}>거절</Button>} {account.status === 'approved' && <Button disabled={busy} onClick={ … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-d077cefa2569 |

반환/조기 중단: 32행 <render> [별도 조건식 없음]

## H-58ec931ebd97

**load** · [src/ui/account-administration.tsx:12](../../../src/ui/account-administration.tsx#L12) · async

분기 조건과 가능한 갈림길:

- B-73a21d37f74a · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (14행).
- B-78dd47f4afde · ConditionalExpression · more → truthy / falsy; 바깥 조건: 별도 조건식 없음 (14행).
- B-61ce9f4f5327 · CatchClause · error → exception; 바깥 조건: 별도 조건식 없음 (15행).
- B-2f5ae9bd440c · ConditionalExpression · error instanceof Error → truthy / falsy; 바깥 조건: exception: error (15행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 13행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 13행 | 별도 조건식 없음 | setError('')<br>state-update |
| 14행 | 별도 조건식 없음 | api.list(more ? cursor : null)<br>call |
| 14행 | 별도 조건식 없음 | setAccounts(previous => more ? [...previous, ...page.accounts] : page.accounts)<br>state-update<br>전달 콜백: H-79b8558d8f42 |
| 14행 | 별도 조건식 없음 | setCursor(page.nextCursor)<br>state-update |
| 14행 | 별도 조건식 없음 | setTotal(page.totalCount??null)<br>state-update |
| 15행 | exception: error | setError(error instanceof Error ? error.message : '계정 목록을 불러오지 못했습니다.')<br>state-update |
| 16행 | always-after-try: try 완료 또는 예외 이후 | setBusy(false)<br>state-update |

## H-79b8558d8f42

**@callback:setAccounts** · [src/ui/account-administration.tsx:14](../../../src/ui/account-administration.tsx#L14)

분기 조건과 가능한 갈림길:

- B-cd0ae06469cf · ConditionalExpression · more → truthy / falsy; 바깥 조건: 별도 조건식 없음 (14행).

## H-f6eecf52f19b

**@callback:useEffectEvent** · [src/ui/account-administration.tsx:18](../../../src/ui/account-administration.tsx#L18)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 18행 | 별도 조건식 없음 | load()<br>call → [H-58ec931ebd97](ui__account-administration.md#h-58ec931ebd97) |

## H-93f455afe46d

**@callback:useEffect** · [src/ui/account-administration.tsx:20](../../../src/ui/account-administration.tsx#L20)

분기 조건과 가능한 갈림길:

- B-206bbc0e9bb1 · IfStatement · open → truthy / falsy; 바깥 조건: 별도 조건식 없음 (20행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 20행 | truthy: open | setDecision(null)<br>state-update |
| 20행 | truthy: open | setNotice('')<br>state-update |
| 20행 | truthy: open | loadOnOpen()<br>call |

## H-ed069da26af0

**save** · [src/ui/account-administration.tsx:21](../../../src/ui/account-administration.tsx#L21) · async

분기 조건과 가능한 갈림길:

- B-ecb39911487b · IfStatement · !decision || busy → truthy / falsy; 바깥 조건: 별도 조건식 없음 (22행).
- B-fed26ed3df11 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (24행).
- B-9a4dc017c154 · CatchClause · error → exception; 바깥 조건: 별도 조건식 없음 (29행).
- B-7f0c7c8bc6ab · ConditionalExpression · error instanceof Error → truthy / falsy; 바깥 조건: exception: error (29행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 23행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 23행 | 별도 조건식 없음 | setError('')<br>state-update |
| 23행 | 별도 조건식 없음 | setNotice('')<br>state-update |
| 25행 | 별도 조건식 없음 | api.set(decision.account.userId, decision.status, decision.account.version)<br>call |
| 26행 | 별도 조건식 없음 | setNotice(`${decision.account.email} 계정을 ${labels[decision.status]} 상태로 변경했습니다.`)<br>state-update |
| 27행 | 별도 조건식 없음 | setDecision(null)<br>state-update |
| 28행 | 별도 조건식 없음 | api.list()<br>call |
| 28행 | 별도 조건식 없음 | setAccounts(page.accounts)<br>state-update |
| 28행 | 별도 조건식 없음 | setCursor(page.nextCursor)<br>state-update |
| 28행 | 별도 조건식 없음 | setTotal(page.totalCount??null)<br>state-update |
| 29행 | exception: error | setError(error instanceof Error ? error.message : '계정 상태를 변경하지 못했습니다.')<br>state-update |
| 30행 | always-after-try: try 완료 또는 예외 이후 | setBusy(false)<br>state-update |

반환/조기 중단: 22행 <render> [truthy: !decision || busy]

## H-954c05101e7e

**@onClick** · [src/ui/account-administration.tsx:32](../../../src/ui/account-administration.tsx#L32)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 32행 | 별도 조건식 없음 | setOpen(true)<br>state-update |

## H-267205f39ffb

**@onClose** · [src/ui/account-administration.tsx:33](../../../src/ui/account-administration.tsx#L33)

분기 조건과 가능한 갈림길:

- B-2c9c8ab1d574 · IfStatement · !busy → truthy / falsy; 바깥 조건: truthy: open (33행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 33행 | truthy: open ∧ truthy: !busy | setOpen(false)<br>state-update |

## H-e7578843d3c5

**@onClick** · [src/ui/account-administration.tsx:36](../../../src/ui/account-administration.tsx#L36)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 36행 | truthy: open | setDecision(null)<br>state-update |
| 36행 | truthy: open | load()<br>call → [H-58ec931ebd97](ui__account-administration.md#h-58ec931ebd97) |

## H-d077cefa2569

**@callback:accounts.map** · [src/ui/account-administration.tsx:39](../../../src/ui/account-administration.tsx#L39)

분기 조건과 가능한 갈림길:

- B-58281ca33009 · ConditionalExpression · account.administrator → truthy / falsy; 바깥 조건: truthy: open (40행).
- B-c45fa7991693 · ConditionalExpression · account.emailConfirmed → truthy / falsy; 바깥 조건: truthy: open (40행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 40행 | truthy: open | new Date(account.createdAt).toLocaleDateString('ko-KR')<br>call |
| 45행 | truthy: open ∧ truthy: !account.administrator | ['rejected','suspended'].includes(account.status)<br>call |

## H-300d2e58bde3

**@onClick** · [src/ui/account-administration.tsx:42](../../../src/ui/account-administration.tsx#L42)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 42행 | truthy: open ∧ truthy: !account.administrator ∧ truthy: account.status !== 'approved' | setDecision({ account, status: 'approved' })<br>state-update |

## H-be628307b4ce

**@onClick** · [src/ui/account-administration.tsx:43](../../../src/ui/account-administration.tsx#L43)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 43행 | truthy: open ∧ truthy: !account.administrator ∧ truthy: account.status === 'pending' | setDecision({ account, status: 'rejected' })<br>state-update |

## H-e58c4f5972bc

**@onClick** · [src/ui/account-administration.tsx:44](../../../src/ui/account-administration.tsx#L44)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 44행 | truthy: open ∧ truthy: !account.administrator ∧ truthy: account.status === 'approved' | setDecision({ account, status: 'suspended' })<br>state-update |

## H-dda355ca9479

**@onClick** · [src/ui/account-administration.tsx:45](../../../src/ui/account-administration.tsx#L45)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 45행 | truthy: open ∧ truthy: !account.administrator ∧ truthy: ['rejected','suspended'].includes(account.status) | setDecision({ account, status: 'pending' })<br>state-update |

## H-dc4ff294adda

**@onClick** · [src/ui/account-administration.tsx:49](../../../src/ui/account-administration.tsx#L49)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 49행 | truthy: open ∧ truthy: cursor | load(true)<br>call → [H-58ec931ebd97](ui__account-administration.md#h-58ec931ebd97) |

## H-64884a835209

**@onClick** · [src/ui/account-administration.tsx:51](../../../src/ui/account-administration.tsx#L51)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 51행 | truthy: open ∧ truthy: decision | save()<br>call → [H-ed069da26af0](ui__account-administration.md#h-ed069da26af0) |

## H-72107032878e

**@onClick** · [src/ui/account-administration.tsx:51](../../../src/ui/account-administration.tsx#L51)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 51행 | truthy: open ∧ truthy: decision | setDecision(null)<br>state-update |

