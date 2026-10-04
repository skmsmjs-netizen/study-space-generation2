# src/ui/personal-space.tsx — 실제 핸들러·조건 분기

정상·예외·finally 경로의 소스 표현을 기록한다. 함수 호출은 저장 성공이나 서버 권한 허용의 증거가 아니다. 콜백으로 전달된 함수는 호출될 수 있는 경계이며 호출 순서·성공을 임의 가정하지 않는다. 모든 호출 인수 원문은 source-actions.json에 있다.

## H-c7ebfe02c2dc

**exportWindowRecords** · [src/ui/personal-space.tsx:22](../../../src/ui/personal-space.tsx#L22) · async


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 23행 | 별도 조건식 없음 | JSON.stringify({ ...JSON.parse(repository.exportPreserved()), windowRecovery: await personalWindowCopies(repository.getSnapshot().userId, repository.key) }, null, 2)<br>call |
| 23행 | 별도 조건식 없음 | JSON.parse(repository.exportPreserved())<br>call |
| 23행 | 별도 조건식 없음 | repository.exportPreserved()<br>preservation-boundary |
| 24행 | 별도 조건식 없음 | personalWindowCopies(repository.getSnapshot().userId, repository.key)<br>call |
| 24행 | 별도 조건식 없음 | repository.getSnapshot()<br>call |

반환/조기 중단: 23행 JSON.stringify({ ...JSON.parse(repository.exportPreserved()), windowRecovery: await personalWindowCopies(repository.getSnapshot().userId, repository.key) }, null, 2) [별도 조건식 없음]

## H-1e95e5f672e5

**errorText** · [src/ui/personal-space.tsx:26](../../../src/ui/personal-space.tsx#L26)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 26행 | 별도 조건식 없음 | storageErrorText(error, '개인 공간을 열지 못했습니다.')<br>call |

## H-878598d81002

**PersonalSpace** · [src/ui/personal-space.tsx:27](../../../src/ui/personal-space.tsx#L27)

분기 조건과 가능한 갈림길:

- B-88c787fe3daf · ConditionalExpression · accessApi&&access → truthy / falsy; 바깥 조건: 별도 조건식 없음 (125행).
- B-66f55fd3127e · ConditionalExpression · userId → truthy / falsy; 바깥 조건: truthy: accessApi&&access (125행).
- B-16ab115fa7b1 · IfStatement · repo && client → truthy / falsy; 바깥 조건: 별도 조건식 없음 (126행).
- B-4318d37964b3 · ConditionalExpression · withdrawn → truthy / falsy; 바깥 조건: 별도 조건식 없음 (128행).
- B-828e0b8f2a0d · ConditionalExpression · !configured → truthy / falsy; 바깥 조건: falsy: withdrawn (128행).
- B-e0cd69fcdedd · ConditionalExpression · !authReady || opening → truthy / falsy; 바깥 조건: falsy: withdrawn ∧ falsy: !configured (129행).
- B-1b07bfa709bc · ConditionalExpression · !userId && client → truthy / falsy; 바깥 조건: falsy: withdrawn ∧ falsy: !configured ∧ falsy: !authReady || opening (130행).
- B-09003c8427c7 · ConditionalExpression · access && access.status !== 'approved' → truthy / falsy; 바깥 조건: falsy: withdrawn ∧ falsy: !configured ∧ falsy: !authReady || opening ∧ falsy: !userId && client (131행).
- B-ce5c771eca7b · ConditionalExpression · access.status === 'pending' → truthy / falsy; 바깥 조건: falsy: withdrawn ∧ falsy: !configured ∧ falsy: !authReady || opening ∧ falsy: !userId && client ∧ truthy: access && access.status !== 'approved' (131행).
- B-12bb90004354 · ConditionalExpression · access.status === 'rejected' → truthy / falsy; 바깥 조건: falsy: withdrawn ∧ falsy: !configured ∧ falsy: !authReady || opening ∧ falsy: !userId && client ∧ truthy: access && access.status !== 'approved' ∧ falsy: access.status === 'pending' (131행).
- B-db95051a747a · ConditionalExpression · downloading → truthy / falsy; 바깥 조건: falsy: withdrawn ∧ falsy: !configured ∧ falsy: !authReady || opening ∧ falsy: !userId && client ∧ falsy: access && access.status !== 'approved' (132행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 28행 | 별도 조건식 없음 | useState(readServerConfig)<br>call |
| 29행 | 별도 조건식 없음 | useState(() => configured ? createStudyClient(configured) : null)<br>call<br>전달 콜백: H-971ea38349f9 |
| 30행 | 별도 조건식 없음 | useMemo(() => client ? accountAccessClient(client) : null, [client])<br>call<br>전달 콜백: H-fbbcf991fd0d |
| 31행 | 별도 조건식 없음 | useState(null)<br>call |
| 32행 | 별도 조건식 없음 | useState(null)<br>call |
| 32행 | 별도 조건식 없음 | useState(false)<br>call |
| 33행 | 별도 조건식 없음 | useState('')<br>call |
| 34행 | 별도 조건식 없음 | useState(null)<br>call |
| 34행 | 별도 조건식 없음 | useState('')<br>call |
| 35행 | 별도 조건식 없음 | useState(0)<br>call |
| 35행 | 별도 조건식 없음 | useState(false)<br>call |
| 36행 | 별도 조건식 없음 | useState(null)<br>call |
| 36행 | 별도 조건식 없음 | useState('')<br>call |
| 37행 | 별도 조건식 없음 | useRef(Promise.resolve())<br>call |
| 37행 | 별도 조건식 없음 | Promise.resolve()<br>call |
| 38행 | 별도 조건식 없음 | useRef(userId)<br>call |
| 39행 | 별도 조건식 없음 | useState(false)<br>call |
| 40행 | 별도 조건식 없음 | useEffect(() => { if (!client) { setAuthReady(true); return; } let alive = true; let authVersion = 0; const { data } = client.auth.onAuthStateChange((_event, session) => { if(_event==='SIGNED_OUT')void stopLocalSchedulePush().catch(()=>{if(alive)setError('로그아웃했습니다. 기기의 알림 해제를 확인하지 못했으니 브라우저 알림 설정을 확인해 주세요.');}); authVersion++; if (alive) { if (session) setAuthError(''); setUserId(session?.user.id ?? null); setAuthReady(true); } }); const version = authVersion; // Restore the local session; the API still authenticates and authorizes every request. client.auth.getSession().then(({ data, error }) => { if (alive && version === authVersion) { if (error) setAuthError('로그인 상태를 확인하지 못했습니다. 다시 로그인해 주세요.'); set … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-4a8e3ff73866 |
| 53행 | 별도 조건식 없음 | useEffect(() => { setRepo(null); setAccess(null); setError(''); if (!client \|\| !accessApi \|\| !userId \|\| withdrawn) { setOpening(false); return; } let disposed = false; let finish: () => void = () => {}; const closed = new Promise<void>(resolve => { finish = resolve; }); setOpening(true); const previous = writerTask.current; const task = (async () => { await previous.catch(() => {}); if (disposed) return; const permission = await accessApi.read(); if (disposed) return; setAccess(permission); if (permission.status !== 'approved') { setOpening(false); return; } const windowJournal = await claimPersonalWindow(userId); let opened: PersonalRepository \| undefined; try { if (disposed) return; const transport  … [전체 인수는 JSON·소스])<br>call<br>전달 콜백: H-b2a4ca3e4555 |
| 88행 | 별도 조건식 없음 | useEffect(() => repo ? startPersonalSync(repo) : undefined, [repo])<br>call<br>전달 콜백: H-115ff3ce024c |
| 126행 | truthy: repo && client | renderWorkspace(repo, <><ServerStatus repository={repo} client={client} />{settings}{access?.administrator && accessApi && <AccountAdministration api={accessApi} />}</>)<br>call |
| 128행 | truthy: withdrawn | withdrawalNotice.includes('끝나지')<br>call |

반환/조기 중단: 126행 renderWorkspace(repo, <><ServerStatus repository={repo} client={client} />{settings}{access?.administrator && accessApi && <AccountAdministration api={accessApi} />}</>) [truthy: repo && client]; 127행 <render> [별도 조건식 없음]

## H-971ea38349f9

**@callback:useState** · [src/ui/personal-space.tsx:29](../../../src/ui/personal-space.tsx#L29)

분기 조건과 가능한 갈림길:

- B-ab61d7475017 · ConditionalExpression · configured → truthy / falsy; 바깥 조건: 별도 조건식 없음 (29행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 29행 | truthy: configured | createStudyClient(configured)<br>call |

## H-fbbcf991fd0d

**@callback:useMemo** · [src/ui/personal-space.tsx:30](../../../src/ui/personal-space.tsx#L30)

분기 조건과 가능한 갈림길:

- B-53422fff86c6 · ConditionalExpression · client → truthy / falsy; 바깥 조건: 별도 조건식 없음 (30행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 30행 | truthy: client | accountAccessClient(client)<br>call |

## H-4a8e3ff73866

**@callback:useEffect** · [src/ui/personal-space.tsx:40](../../../src/ui/personal-space.tsx#L40)

분기 조건과 가능한 갈림길:

- B-675709cd2c86 · IfStatement · !client → truthy / falsy; 바깥 조건: 별도 조건식 없음 (41행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 41행 | truthy: !client | setAuthReady(true)<br>state-update |
| 44행 | 별도 조건식 없음 | client.auth.onAuthStateChange((_event, session) => { if(_event==='SIGNED_OUT')void stopLocalSchedulePush().catch(()=>{if(alive)setError('로그아웃했습니다. 기기의 알림 해제를 확인하지 못했으니 브라우저 알림 설정을 확인해 주세요.');}); authVersion++; if (alive) { if (session) setAuthError(''); setUserId(session?.user.id ?? null); setAuthReady(true); } })<br>call<br>전달 콜백: H-fc78cc946803 |
| 47행 | 별도 조건식 없음 | client.auth.getSession().then(({ data, error }) => { if (alive && version === authVersion) { if (error) setAuthError('로그인 상태를 확인하지 못했습니다. 다시 로그인해 주세요.'); setUserId(data.session?.user.id ?? null); setAuthReady(true); } }).catch(error => { if (alive && version === authVersion) { setAuthError(errorText(error)); setUserId(null); setAuthReady(true); } })<br>call<br>전달 콜백: H-237fffd1f7ee |
| 47행 | 별도 조건식 없음 | client.auth.getSession().then(({ data, error }) => { if (alive && version === authVersion) { if (error) setAuthError('로그인 상태를 확인하지 못했습니다. 다시 로그인해 주세요.'); setUserId(data.session?.user.id ?? null); setAuthReady(true); } })<br>call<br>전달 콜백: H-754ed39b046b |
| 47행 | 별도 조건식 없음 | client.auth.getSession()<br>call |

반환/조기 중단: 41행 <render> [truthy: !client]; 50행 () => { alive = false; data.subscription.unsubscribe(); } [별도 조건식 없음]

## H-fc78cc946803

**@callback:client.auth.onAuthStateChange** · [src/ui/personal-space.tsx:44](../../../src/ui/personal-space.tsx#L44)

분기 조건과 가능한 갈림길:

- B-439c1375b349 · IfStatement · _event==='SIGNED_OUT' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (44행).
- B-82f83bf026c9 · IfStatement · alive → truthy / falsy; 바깥 조건: 별도 조건식 없음 (44행).
- B-108a416a90dd · IfStatement · session → truthy / falsy; 바깥 조건: truthy: alive (44행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 44행 | truthy: _event==='SIGNED_OUT' | stopLocalSchedulePush().catch(()=>{if(alive)setError('로그아웃했습니다. 기기의 알림 해제를 확인하지 못했으니 브라우저 알림 설정을 확인해 주세요.');})<br>call<br>전달 콜백: H-4c21bb09cae4 |
| 44행 | truthy: _event==='SIGNED_OUT' | stopLocalSchedulePush()<br>call |
| 44행 | truthy: alive ∧ truthy: session | setAuthError('')<br>state-update |
| 44행 | truthy: alive | setUserId(session?.user.id ?? null)<br>state-update |
| 44행 | truthy: alive | setAuthReady(true)<br>state-update |

## H-4c21bb09cae4

**@callback:stopLocalSchedulePush().catch** · [src/ui/personal-space.tsx:44](../../../src/ui/personal-space.tsx#L44)

분기 조건과 가능한 갈림길:

- B-412ff2b1f1f6 · IfStatement · alive → truthy / falsy; 바깥 조건: truthy: _event==='SIGNED_OUT' ∧ rejected: stopLocalSchedulePush() (44행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 44행 | truthy: _event==='SIGNED_OUT' ∧ rejected: stopLocalSchedulePush() ∧ truthy: alive | setError('로그아웃했습니다. 기기의 알림 해제를 확인하지 못했으니 브라우저 알림 설정을 확인해 주세요.')<br>state-update |

## H-754ed39b046b

**@callback:client.auth.getSession().then** · [src/ui/personal-space.tsx:47](../../../src/ui/personal-space.tsx#L47)

분기 조건과 가능한 갈림길:

- B-c55eb5e836ee · IfStatement · alive && version === authVersion → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: client.auth.getSession() (47행).
- B-1e67c88332b4 · IfStatement · error → truthy / falsy; 바깥 조건: fulfilled-or-explicit-rejection-handler: client.auth.getSession() ∧ truthy: alive && version === authVersion (47행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 47행 | fulfilled-or-explicit-rejection-handler: client.auth.getSession() ∧ truthy: alive && version === authVersion ∧ truthy: error | setAuthError('로그인 상태를 확인하지 못했습니다. 다시 로그인해 주세요.')<br>state-update |
| 47행 | fulfilled-or-explicit-rejection-handler: client.auth.getSession() ∧ truthy: alive && version === authVersion | setUserId(data.session?.user.id ?? null)<br>state-update |
| 47행 | fulfilled-or-explicit-rejection-handler: client.auth.getSession() ∧ truthy: alive && version === authVersion | setAuthReady(true)<br>state-update |

## H-237fffd1f7ee

**@callback:client.auth.getSession().then(({ data, error }) => { if (alive && version === authVersion) { if (error) setAuthError('로그인 상태를 확인하지 못했습니다. 다시 로그인해 주세요.'); setUserId(data.session?.user.id ?? null); setAuthReady(true); } }).catch** · [src/ui/personal-space.tsx:47](../../../src/ui/personal-space.tsx#L47)

분기 조건과 가능한 갈림길:

- B-c2fe5f85bc23 · IfStatement · alive && version === authVersion → truthy / falsy; 바깥 조건: rejected: client.auth.getSession().then(({ data, error }) => { if (alive && version === authVersion) { if (error) setAuthError('로그인 상태를 확인하지 못했습니다. 다시 로그인해 주세요.'); setUserId(data.session?.user.id ?? null); setAuthReady(true); } }) (48행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 48행 | rejected: client.auth.getSession().then(({ data, error }) => { if (alive && version === authVersion) { if (error) setAuthError('로그인 상태를 확인하지 못했습니다. 다시 로그인해 주세요.'); setUserId(data.session?.user.id ?? null); setAuthReady(true); } }) ∧ truthy: alive && version === authVersion | setAuthError(errorText(error))<br>state-update |
| 48행 | rejected: client.auth.getSession().then(({ data, error }) => { if (alive && version === authVersion) { if (error) setAuthError('로그인 상태를 확인하지 못했습니다. 다시 로그인해 주세요.'); setUserId(data.session?.user.id ?? null); setAuthReady(true); } }) ∧ truthy: alive && version === authVersion | errorText(error)<br>call → [H-1e95e5f672e5](ui__personal-space.md#h-1e95e5f672e5) |
| 48행 | rejected: client.auth.getSession().then(({ data, error }) => { if (alive && version === authVersion) { if (error) setAuthError('로그인 상태를 확인하지 못했습니다. 다시 로그인해 주세요.'); setUserId(data.session?.user.id ?? null); setAuthReady(true); } }) ∧ truthy: alive && version === authVersion | setUserId(null)<br>state-update |
| 48행 | rejected: client.auth.getSession().then(({ data, error }) => { if (alive && version === authVersion) { if (error) setAuthError('로그인 상태를 확인하지 못했습니다. 다시 로그인해 주세요.'); setUserId(data.session?.user.id ?? null); setAuthReady(true); } }) ∧ truthy: alive && version === authVersion | setAuthReady(true)<br>state-update |

## H-b2a4ca3e4555

**@callback:useEffect** · [src/ui/personal-space.tsx:53](../../../src/ui/personal-space.tsx#L53)

분기 조건과 가능한 갈림길:

- B-d534c60108c4 · IfStatement · !client || !accessApi || !userId || withdrawn → truthy / falsy; 바깥 조건: 별도 조건식 없음 (55행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 54행 | 별도 조건식 없음 | setRepo(null)<br>state-update |
| 54행 | 별도 조건식 없음 | setAccess(null)<br>state-update |
| 54행 | 별도 조건식 없음 | setError('')<br>state-update |
| 55행 | truthy: !client \|\| !accessApi \|\| !userId \|\| withdrawn | setOpening(false)<br>state-update |
| 59행 | 별도 조건식 없음 | setOpening(true)<br>state-update |
| 61행 | 별도 조건식 없음 | async () => {<br>      await previous.catch(() => {});<br>      if (disposed) return;<br>      const permission = await accessApi.read();<br>      if (disposed) return;<br>      setAccess(permission);<br>      if (permission.status !== 'approved') { setOpening(false); return; }<br>      const windowJournal = await claimPersonalWindow(userId);<br>      let opened: PersonalRepository \| undefined;<br>      try {<br>        if (disposed) return;<br>        const transport = onlineTransport(client);<br>        const server = windowJournal.cached ?? await Promise.race([transport.load(), closed.then(() => null)]);<br>        if (disposed \|\| !server) return;<br>        if (server.data.userId !== userId \|\| server.data.namespace !== 'personal') throw Error('로그인한 사용자의 자료가 아닙니다.');<br>        opened = await openPersonalRepository(localStorage, transport, server, undefined, Boolean(windowJournal.cached), windowJournal.key);<br>        if (disposed) return;<br>        setRepo(opened); setOpening(false); void opened.flush();<br>        await closed;<br>      } finally {<br>        try { await opened?.close(); } finally { await windowJournal.release(); }<br>      }<br>    }()<br>mutation-request → [H-b95fec16836e](ui__personal-space.md#h-b95fec16836e) |
| 85행 | 별도 조건식 없음 | task.catch(error => { if (!disposed) { setError(errorText(error)); setOpening(false); } })<br>call<br>전달 콜백: H-16adfc6e44c2 |

반환/조기 중단: 55행 <render> [truthy: !client || !accessApi || !userId || withdrawn]; 86행 () => { disposed = true; finish(); } [별도 조건식 없음]

## H-b95fec16836e

**@callback:async () => {
      await previous.catch(() => {});
      if (disposed) return;
      const permission = await accessApi.read();
      if (disposed) return;
      setAccess(permission);
      if (permission.status !== 'approved') { setOpening(false); return; }
      const windowJournal = await claimPersonalWindow(userId);
      let opened: PersonalRepository | undefined;
      try {
        if (disposed) return;
        const transport = onlineTransport(client);
        const server = windowJournal.cached ?? await Promise.race([transport.load(), closed.then(() => null)]);
        if (disposed || !server) return;
        if (server.data.userId !== userId || server.data.namespace !== 'personal') throw Error('로그인한 사용자의 자료가 아닙니다.');
        opened = await openPersonalRepository(localStorage, transport, server, undefined, Boolean(windowJournal.cached), windowJournal.key);
        if (disposed) return;
        setRepo(opened); setOpening(false); void opened.flush();
        await closed;
      } finally {
        try { await opened?.close(); } finally { await windowJournal.release(); }
      }
    }** · [src/ui/personal-space.tsx:61](../../../src/ui/personal-space.tsx#L61) · async

분기 조건과 가능한 갈림길:

- B-febf812c57b4 · IfStatement · disposed → truthy / falsy; 바깥 조건: 별도 조건식 없음 (63행).
- B-12ab7cda73f7 · IfStatement · disposed → truthy / falsy; 바깥 조건: 별도 조건식 없음 (65행).
- B-142864979272 · IfStatement · permission.status !== 'approved' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (67행).
- B-8e81c0155425 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (70행).
- B-e3bfe6171bbc · IfStatement · disposed → truthy / falsy; 바깥 조건: 별도 조건식 없음 (71행).
- B-33d6c30b9992 · IfStatement · disposed || !server → truthy / falsy; 바깥 조건: 별도 조건식 없음 (74행).
- B-bf8421b1f149 · IfStatement · server.data.userId !== userId || server.data.namespace !== 'personal' → truthy / falsy; 바깥 조건: 별도 조건식 없음 (75행).
- B-e99ce7fd4681 · IfStatement · disposed → truthy / falsy; 바깥 조건: 별도 조건식 없음 (77행).
- B-95481822cccb · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: always-after-try: try 완료 또는 예외 이후 (81행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 62행 | 별도 조건식 없음 | previous.catch(() => {})<br>call<br>전달 콜백: H-b2d484ea2e18 |
| 64행 | 별도 조건식 없음 | accessApi.read()<br>call |
| 66행 | 별도 조건식 없음 | setAccess(permission)<br>state-update |
| 67행 | truthy: permission.status !== 'approved' | setOpening(false)<br>state-update |
| 68행 | 별도 조건식 없음 | claimPersonalWindow(userId)<br>call |
| 72행 | 별도 조건식 없음 | onlineTransport(client)<br>call |
| 73행 | nullish: windowJournal.cached | Promise.race([transport.load(), closed.then(() => null)])<br>call |
| 73행 | nullish: windowJournal.cached | transport.load()<br>call |
| 73행 | nullish: windowJournal.cached | closed.then(() => null)<br>call<br>전달 콜백: H-93b610ad9dbc |
| 75행 | truthy: server.data.userId !== userId \|\| server.data.namespace !== 'personal' | Error('로그인한 사용자의 자료가 아닙니다.')<br>call |
| 76행 | 별도 조건식 없음 | openPersonalRepository(localStorage, transport, server, undefined, Boolean(windowJournal.cached), windowJournal.key)<br>call |
| 76행 | 별도 조건식 없음 | Boolean(windowJournal.cached)<br>call |
| 78행 | 별도 조건식 없음 | setRepo(opened)<br>state-update |
| 78행 | 별도 조건식 없음 | setOpening(false)<br>state-update |
| 78행 | 별도 조건식 없음 | opened.flush()<br>mutation-request |
| 81행 | always-after-try: try 완료 또는 예외 이후 ∧ always-after-try: try 완료 또는 예외 이후 | windowJournal.release()<br>call |

반환/조기 중단: 63행 <render> [truthy: disposed]; 65행 <render> [truthy: disposed]; 67행 <render> [truthy: permission.status !== 'approved']; 71행 <render> [truthy: disposed]; 74행 <render> [truthy: disposed || !server]; 77행 <render> [truthy: disposed]

throw: 75행 Error('로그인한 사용자의 자료가 아닙니다.')

## H-b2d484ea2e18

**@callback:previous.catch** · [src/ui/personal-space.tsx:62](../../../src/ui/personal-space.tsx#L62)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-93b610ad9dbc

**@callback:closed.then** · [src/ui/personal-space.tsx:73](../../../src/ui/personal-space.tsx#L73)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-16adfc6e44c2

**@callback:task.catch** · [src/ui/personal-space.tsx:85](../../../src/ui/personal-space.tsx#L85)

분기 조건과 가능한 갈림길:

- B-7ac5e6536c9b · IfStatement · !disposed → truthy / falsy; 바깥 조건: rejected: task (85행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 85행 | rejected: task ∧ truthy: !disposed | setError(errorText(error))<br>state-update |
| 85행 | rejected: task ∧ truthy: !disposed | errorText(error)<br>call → [H-1e95e5f672e5](ui__personal-space.md#h-1e95e5f672e5) |
| 85행 | rejected: task ∧ truthy: !disposed | setOpening(false)<br>state-update |

## H-115ff3ce024c

**@callback:useEffect** · [src/ui/personal-space.tsx:88](../../../src/ui/personal-space.tsx#L88)

분기 조건과 가능한 갈림길:

- B-ae01b203a194 · ConditionalExpression · repo → truthy / falsy; 바깥 조건: 별도 조건식 없음 (88행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 88행 | truthy: repo | startPersonalSync(repo)<br>call |

## H-a89891b5f325

**cleanupWithdrawal** · [src/ui/personal-space.tsx:89](../../../src/ui/personal-space.tsx#L89) · async

분기 조건과 가능한 갈림길:

- B-851ee2978893 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (91행).
- B-26729fe7f416 · IfStatement · navigator.locks → truthy / falsy; 바깥 조건: 별도 조건식 없음 (92행).
- B-7a9c4edac160 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (98행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 90행 | 별도 조건식 없음 | writerTask.current.catch(() => {})<br>call<br>전달 콜백: H-7c8629dd7e01 |
| 92행 | truthy: navigator.locks | navigator.locks.request(`study-space:personal:${id}:sessions`, {ifAvailable:true}, async sessionLock=>{ if(!sessionLock)throw Error('다른 창에서 사용 중입니다.'); await navigator.locks.request(`study-space:personal:${id}:writer`, {ifAvailable:true}, async lock=>{if(!lock)throw Error('다른 창에서 사용 중입니다.');await clearWithdrawnAccount(id);}); })<br>call<br>전달 콜백: H-a67310cac763 |
| 96행 | falsy: navigator.locks | clearWithdrawnAccount(id)<br>call |
| 97행 | 별도 조건식 없음 | setWithdrawalNotice('탈퇴했습니다. 계정과 서버 기록, 이 브라우저의 개인 자료를 삭제했습니다.')<br>state-update |
| 98행 | exception: exception | setWithdrawalNotice('탈퇴했고 서버 기록은 삭제했습니다. 이 브라우저의 개인 자료 정리는 끝나지 않았습니다. 다른 학습앱 창을 닫은 뒤 다시 시도해 주세요.')<br>state-update |

## H-7c8629dd7e01

**@callback:writerTask.current.catch** · [src/ui/personal-space.tsx:90](../../../src/ui/personal-space.tsx#L90)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-a67310cac763

**@callback:navigator.locks.request** · [src/ui/personal-space.tsx:92](../../../src/ui/personal-space.tsx#L92) · async

분기 조건과 가능한 갈림길:

- B-51fb5a86c405 · IfStatement · !sessionLock → truthy / falsy; 바깥 조건: truthy: navigator.locks (93행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 93행 | truthy: navigator.locks ∧ truthy: !sessionLock | Error('다른 창에서 사용 중입니다.')<br>call |
| 94행 | truthy: navigator.locks | navigator.locks.request(`study-space:personal:${id}:writer`, {ifAvailable:true}, async lock=>{if(!lock)throw Error('다른 창에서 사용 중입니다.');await clearWithdrawnAccount(id);})<br>call<br>전달 콜백: H-1a2c9267a897 |

throw: 93행 Error('다른 창에서 사용 중입니다.')

## H-1a2c9267a897

**@callback:navigator.locks.request** · [src/ui/personal-space.tsx:94](../../../src/ui/personal-space.tsx#L94) · async

분기 조건과 가능한 갈림길:

- B-d834a8b1ebda · IfStatement · !lock → truthy / falsy; 바깥 조건: truthy: navigator.locks (94행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 94행 | truthy: navigator.locks ∧ truthy: !lock | Error('다른 창에서 사용 중입니다.')<br>call |
| 94행 | truthy: navigator.locks | clearWithdrawnAccount(id)<br>call |

throw: 94행 Error('다른 창에서 사용 중입니다.')

## H-b9f424de5073

**onWithdrawn** · [src/ui/personal-space.tsx:100](../../../src/ui/personal-space.tsx#L100) · async

분기 조건과 가능한 갈림길:

- B-e610c1939dd8 · IfStatement · !userId → truthy / falsy; 바깥 조건: 별도 조건식 없음 (101행).
- B-ef99a4c34339 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: 별도 조건식 없음 (103행).
- B-783fc41db8ca · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (103행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 102행 | 별도 조건식 없음 | setWithdrawn(id)<br>state-update |
| 102행 | 별도 조건식 없음 | setRepo(null)<br>state-update |
| 102행 | 별도 조건식 없음 | setUserId(null)<br>state-update |
| 104행 | 별도 조건식 없음 | cleanupWithdrawal(id)<br>call → [H-a89891b5f325](ui__personal-space.md#h-a89891b5f325) |

반환/조기 중단: 101행 <render> [truthy: !userId]

## H-352a2d8b783c

**downloadRecords** · [src/ui/personal-space.tsx:106](../../../src/ui/personal-space.tsx#L106) · async

분기 조건과 가능한 갈림길:

- B-7c23c2ce2e2d · IfStatement · !owner → truthy / falsy; 바깥 조건: 별도 조건식 없음 (108행).
- B-9e5304470559 · IfStatement · repo && repo.getSnapshot().userId !== owner → truthy / falsy; 바깥 조건: 별도 조건식 없음 (109행).
- B-9bfe86ed860c · ConditionalExpression · repo → truthy / falsy; 바깥 조건: 별도 조건식 없음 (110행).
- B-adae27c81ebf · IfStatement · currentUser.current !== owner → truthy / falsy; 바깥 조건: 별도 조건식 없음 (114행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 109행 | truthy: repo | repo.getSnapshot()<br>call |
| 109행 | truthy: repo && repo.getSnapshot().userId !== owner | Error('로그인한 계정이 바뀌었습니다. 현재 계정에서 다시 내려받아 주세요.')<br>call |
| 110행 | truthy: repo | exportWindowRecords(repo)<br>call → [H-c7ebfe02c2dc](ui__personal-space.md#h-c7ebfe02c2dc) |
| 110행 | falsy: repo | JSON.stringify({ format: 'study-space-window-recovery', userId: owner, windowRecovery: await personalWindowCopies(owner, ''), }, null, 2)<br>call |
| 112행 | falsy: repo | personalWindowCopies(owner, '')<br>call |
| 114행 | truthy: currentUser.current !== owner | Error('로그인한 계정이 바뀌었습니다. 현재 계정에서 다시 내려받아 주세요.')<br>call |
| 115행 | 별도 조건식 없음 | URL.createObjectURL(new Blob([raw],{type:'application/json'}))<br>call |
| 116행 | 별도 조건식 없음 | document.createElement('a')<br>call |
| 116행 | 별도 조건식 없음 | anchor.click()<br>call |
| 116행 | 별도 조건식 없음 | setTimeout(()=>URL.revokeObjectURL(url), 1000)<br>state-update<br>전달 콜백: H-d93343e6cfc9 |

반환/조기 중단: 108행 <render> [truthy: !owner]

throw: 109행 Error('로그인한 계정이 바뀌었습니다. 현재 계정에서 다시 내려받아 주세요.'); 114행 Error('로그인한 계정이 바뀌었습니다. 현재 계정에서 다시 내려받아 주세요.')

## H-d93343e6cfc9

**@callback:setTimeout** · [src/ui/personal-space.tsx:116](../../../src/ui/personal-space.tsx#L116)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 116행 | 별도 조건식 없음 | URL.revokeObjectURL(url)<br>call |

## H-6a6e1ab1865e

**downloadOnError** · [src/ui/personal-space.tsx:118](../../../src/ui/personal-space.tsx#L118) · async

분기 조건과 가능한 갈림길:

- B-d0c4a018a09c · IfStatement · downloading → truthy / falsy; 바깥 조건: 별도 조건식 없음 (119행).
- B-b81ba9544aaf · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (121행).
- B-506f9078d5f1 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (122행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 120행 | 별도 조건식 없음 | setDownloading(true)<br>state-update |
| 121행 | 별도 조건식 없음 | downloadRecords()<br>call → [H-352a2d8b783c](ui__personal-space.md#h-352a2d8b783c) |
| 122행 | exception: exception | setError('보관본을 내려받지 못했습니다. 원문은 그대로 남아 있습니다. 다시 시도해 주세요.')<br>state-update |
| 123행 | always-after-try: try 완료 또는 예외 이후 | setDownloading(false)<br>state-update |

반환/조기 중단: 119행 <render> [truthy: downloading]

## H-08c6ac62825e

**@onClick** · [src/ui/personal-space.tsx:128](../../../src/ui/personal-space.tsx#L128)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 128행 | truthy: withdrawn ∧ truthy: withdrawalNotice.includes('끝나지') | cleanupWithdrawal(withdrawn)<br>call → [H-a89891b5f325](ui__personal-space.md#h-a89891b5f325) |

## H-652e559b8d12

**@onClick** · [src/ui/personal-space.tsx:128](../../../src/ui/personal-space.tsx#L128)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 128행 | truthy: withdrawn | setWithdrawn(null)<br>state-update |
| 128행 | truthy: withdrawn | setWithdrawalNotice('')<br>state-update |

## H-2b0d92b45662

**@onRetry** · [src/ui/personal-space.tsx:128](../../../src/ui/personal-space.tsx#L128)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 128행 | falsy: withdrawn ∧ truthy: !configured | location.reload()<br>call |

## H-977bbebf598a

**@onClick** · [src/ui/personal-space.tsx:131](../../../src/ui/personal-space.tsx#L131)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 131행 | falsy: withdrawn ∧ falsy: !configured ∧ falsy: !authReady \|\| opening ∧ falsy: !userId && client ∧ truthy: access && access.status !== 'approved' | setRetry(value => value + 1)<br>state-update<br>전달 콜백: H-fda11ed1fb4e |

## H-fda11ed1fb4e

**@callback:setRetry** · [src/ui/personal-space.tsx:131](../../../src/ui/personal-space.tsx#L131)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-65ee6fcd8d02

**@onClick** · [src/ui/personal-space.tsx:131](../../../src/ui/personal-space.tsx#L131)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e259df617f2f

**@onRetry** · [src/ui/personal-space.tsx:132](../../../src/ui/personal-space.tsx#L132)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 132행 | falsy: withdrawn ∧ falsy: !configured ∧ falsy: !authReady \|\| opening ∧ falsy: !userId && client ∧ falsy: access && access.status !== 'approved' | setRetry(value => value + 1)<br>state-update<br>전달 콜백: H-9eb55a5a0e55 |

## H-9eb55a5a0e55

**@callback:setRetry** · [src/ui/personal-space.tsx:132](../../../src/ui/personal-space.tsx#L132)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-86507935c1a9

**@onClick** · [src/ui/personal-space.tsx:132](../../../src/ui/personal-space.tsx#L132)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 132행 | falsy: withdrawn ∧ falsy: !configured ∧ falsy: !authReady \|\| opening ∧ falsy: !userId && client ∧ falsy: access && access.status !== 'approved' | downloadOnError()<br>call → [H-6a6e1ab1865e](ui__personal-space.md#h-6a6e1ab1865e) |

## H-c72fdbea3ac1

**@onClick** · [src/ui/personal-space.tsx:132](../../../src/ui/personal-space.tsx#L132)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-e98508cb24c2

**SignIn** · [src/ui/personal-space.tsx:137](../../../src/ui/personal-space.tsx#L137)

분기 조건과 가능한 갈림길:

- B-e3eda89d57cd · ConditionalExpression · creating → truthy / falsy; 바깥 조건: 별도 조건식 없음 (161행).
- B-9d0b6e758c26 · ConditionalExpression · creating → truthy / falsy; 바깥 조건: 별도 조건식 없음 (161행).
- B-79629ad5ad84 · ConditionalExpression · creating → truthy / falsy; 바깥 조건: 별도 조건식 없음 (161행).
- B-640d58b100e9 · ConditionalExpression · remember → truthy / falsy; 바깥 조건: truthy: !creating (162행).
- B-9d81444301e8 · ConditionalExpression · busy → truthy / falsy; 바깥 조건: 별도 조건식 없음 (163행).
- B-43e9bb3c614b · ConditionalExpression · creating → truthy / falsy; 바깥 조건: falsy: busy (163행).
- B-c8a86c957c9a · ConditionalExpression · creating → truthy / falsy; 바깥 조건: 별도 조건식 없음 (163행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 138행 | 별도 조건식 없음 | useState('')<br>call |
| 139행 | 별도 조건식 없음 | useState(true)<br>call |
| 140행 | 별도 조건식 없음 | useState('')<br>call |
| 140행 | 별도 조건식 없음 | useState('')<br>call |
| 140행 | 별도 조건식 없음 | useState(false)<br>call |
| 140행 | 별도 조건식 없음 | useState(false)<br>call |
| 140행 | 별도 조건식 없음 | useState('')<br>call |
| 140행 | 별도 조건식 없음 | useState('')<br>call |

반환/조기 중단: 157행 <render> [별도 조건식 없음]

## H-72d70cf9cad5

**submit** · [src/ui/personal-space.tsx:141](../../../src/ui/personal-space.tsx#L141) · async

분기 조건과 가능한 갈림길:

- B-c736871c6bee · IfStatement · busy → truthy / falsy; 바깥 조건: 별도 조건식 없음 (142행).
- B-d00d4b686d41 · IfStatement · create && password.length < 6 → truthy / falsy; 바깥 조건: 별도 조건식 없음 (143행).
- B-7b894e96c0a2 · IfStatement · create → truthy / falsy; 바깥 조건: 별도 조건식 없음 (145행).
- B-87864e7ae1e1 · TryStatement · 구조 분기 → normal / throw/catch; 바깥 조건: truthy: create (145행).
- B-9d6cae08b4c7 · CatchClause · error → exception; 바깥 조건: truthy: create (145행).
- B-84bdacc590c0 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (147행).
- B-95c675faac76 · IfStatement · create → truthy / falsy; 바깥 조건: 별도 조건식 없음 (148행).
- B-3a32497654a9 · IfStatement · error → truthy / falsy; 바깥 조건: truthy: create (150행).
- B-68b465ea05c8 · IfStatement · !data.session → truthy / falsy; 바깥 조건: truthy: create (151행).
- B-31dddda6ff64 · CatchClause · error → exception; 바깥 조건: 별도 조건식 없음 (154행).
- B-e3663db43536 · ConditionalExpression · typeof error === 'object' && error !== null && 'code' in error → truthy / falsy; 바깥 조건: exception: error (154행).
- B-05884f470016 · ConditionalExpression · code === 'AUTH_STORAGE' → truthy / falsy; 바깥 조건: exception: error (154행).
- B-c140fd7370aa · ConditionalExpression · limited → truthy / falsy; 바깥 조건: exception: error ∧ falsy: code === 'AUTH_STORAGE' (154행).
- B-39a72f9699f9 · ConditionalExpression · create → truthy / falsy; 바깥 조건: exception: error ∧ falsy: code === 'AUTH_STORAGE' ∧ falsy: limited (154행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 143행 | truthy: create && password.length < 6 | setError('비밀번호를 6자 이상 입력해 주세요.')<br>state-update |
| 144행 | 별도 조건식 없음 | setError('')<br>state-update |
| 145행 | truthy: create | validateAccountName(name)<br>call |
| 145행 | truthy: create ∧ exception: error | setError(errorText(error))<br>state-update |
| 145행 | truthy: create ∧ exception: error | errorText(error)<br>call → [H-1e95e5f672e5](ui__personal-space.md#h-1e95e5f672e5) |
| 146행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 146행 | 별도 조건식 없음 | setNotice('')<br>state-update |
| 149행 | truthy: create | client.auth.signUp({ email, password, options: { data: { display_name: validateAccountName(name) }, emailRedirectTo: `${location.origin}${import.meta.env.BASE_URL}?space=personal` } })<br>call |
| 149행 | truthy: create | validateAccountName(name)<br>call |
| 151행 | truthy: create ∧ truthy: !data.session | setNotice('이메일로 받은 확인 링크를 연 뒤 로그인해 주세요.')<br>state-update |
| 152행 | falsy: create | onSignedIn(await signInStudyClient(client, { email, password }, remember))<br>call |
| 152행 | falsy: create | signInStudyClient(client, { email, password }, remember)<br>call |
| 153행 | 별도 조건식 없음 | setPassword('')<br>state-update |
| 154행 | exception: error | setError(code === 'AUTH_STORAGE' ? errorText(error) : limited ? '가입 확인 메일의 발송 한도에 도달했습니다. 잠시 후 다시 시도해 주세요.' : create ? '가입하지 못했습니다. 이메일·비밀번호를 확인하거나 잠시 후 다시 시도해 주세요.' : '로그인하지 못했습니다. 이메일·비밀번호와 연결 상태를 확인해 주세요.')<br>state-update |
| 154행 | exception: error ∧ truthy: code === 'AUTH_STORAGE' | errorText(error)<br>call → [H-1e95e5f672e5](ui__personal-space.md#h-1e95e5f672e5) |
| 155행 | always-after-try: try 완료 또는 예외 이후 | setBusy(false)<br>state-update |

반환/조기 중단: 142행 <render> [truthy: busy]; 143행 <render> [truthy: create && password.length < 6]; 145행 <render> [truthy: create ∧ exception: error]

throw: 150행 error

## H-94c4404abeb7

**@onSubmit** · [src/ui/personal-space.tsx:157](../../../src/ui/personal-space.tsx#L157)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 157행 | 별도 조건식 없음 | event.preventDefault()<br>input-control |
| 157행 | 별도 조건식 없음 | submit(creating)<br>call → [H-72d70cf9cad5](ui__personal-space.md#h-72d70cf9cad5) |

## H-ff3bd8d8995b

**@onChange** · [src/ui/personal-space.tsx:159](../../../src/ui/personal-space.tsx#L159)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 159행 | truthy: creating | setName(event.target.value)<br>state-update |

## H-a070dbe73dad

**@onChange** · [src/ui/personal-space.tsx:160](../../../src/ui/personal-space.tsx#L160)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 160행 | 별도 조건식 없음 | setEmail(event.target.value)<br>state-update |

## H-8db6dc170ca8

**@onChange** · [src/ui/personal-space.tsx:161](../../../src/ui/personal-space.tsx#L161)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 161행 | 별도 조건식 없음 | setPassword(event.target.value)<br>state-update |

## H-836040483bbc

**@onChange** · [src/ui/personal-space.tsx:162](../../../src/ui/personal-space.tsx#L162)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 162행 | truthy: !creating | setRemember(event.target.checked)<br>state-update |

## H-6117b07ed20e

**@onClick** · [src/ui/personal-space.tsx:163](../../../src/ui/personal-space.tsx#L163)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 163행 | 별도 조건식 없음 | setCreating(value => !value)<br>state-update<br>전달 콜백: H-525cf6902fff |
| 163행 | 별도 조건식 없음 | setError('')<br>state-update |
| 163행 | 별도 조건식 없음 | setNotice('')<br>state-update |

## H-525cf6902fff

**@callback:setCreating** · [src/ui/personal-space.tsx:163](../../../src/ui/personal-space.tsx#L163)

직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-1b25535c204b

**ServerStatus** · [src/ui/personal-space.tsx:167](../../../src/ui/personal-space.tsx#L167)

분기 조건과 가능한 갈림길:

- B-2e203ab703b7 · ConditionalExpression · status.pending → truthy / falsy; 바깥 조건: 별도 조건식 없음 (188행).
- B-97aeeeabfbeb · ConditionalExpression · status.phase === 'error' || status.phase === 'conflict' → truthy / falsy; 바깥 조건: truthy: open (189행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 168행 | 별도 조건식 없음 | useState(repository.getStatus())<br>call |
| 168행 | 별도 조건식 없음 | repository.getStatus()<br>call |
| 168행 | 별도 조건식 없음 | useState(false)<br>call |
| 168행 | 별도 조건식 없음 | useState('')<br>call |
| 169행 | 별도 조건식 없음 | useEffect(() => { setStatus(repository.getStatus()); return repository.subscribe(() => setStatus(repository.getStatus())); }, [repository])<br>call<br>전달 콜백: H-4c5ad627a96c |
| 170행 | 별도 조건식 없음 | repository.getConflict()<br>call |
| 171행 | 별도 조건식 없음 | useRef(repository)<br>call |
| 172행 | 별도 조건식 없음 | useEffect(() => { activeRepository.current = repository; return () => { activeRepository.current = null; }; }, [repository])<br>call<br>전달 콜백: H-5e9f49f9efb5 |
| 173행 | 별도 조건식 없음 | useState(false)<br>call |
| 191행 | truthy: open | repository.hasIndexedJournal()<br>call |
| 194행 | truthy: open ∧ truthy: conflict | JSON.stringify(conflict.pending, null, 2)<br>call |
| 195행 | truthy: open ∧ truthy: conflict | JSON.stringify({ records: conflict.server.data.records, narratives: conflict.server.data.narratives, memos: conflict.server.data.memos }, null, 2)<br>call |

반환/조기 중단: 188행 <render> [별도 조건식 없음]

## H-4c5ad627a96c

**@callback:useEffect** · [src/ui/personal-space.tsx:169](../../../src/ui/personal-space.tsx#L169)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 169행 | 별도 조건식 없음 | setStatus(repository.getStatus())<br>state-update |
| 169행 | 별도 조건식 없음 | repository.getStatus()<br>call |
| 169행 | 별도 조건식 없음 | repository.subscribe(() => setStatus(repository.getStatus()))<br>call<br>전달 콜백: H-5a2bb0734bcb |

반환/조기 중단: 169행 repository.subscribe(() => setStatus(repository.getStatus())) [별도 조건식 없음]

## H-5a2bb0734bcb

**@callback:repository.subscribe** · [src/ui/personal-space.tsx:169](../../../src/ui/personal-space.tsx#L169)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 169행 | 별도 조건식 없음 | setStatus(repository.getStatus())<br>state-update |
| 169행 | 별도 조건식 없음 | repository.getStatus()<br>call |

## H-5e9f49f9efb5

**@callback:useEffect** · [src/ui/personal-space.tsx:172](../../../src/ui/personal-space.tsx#L172)


반환/조기 중단: 172행 () => { activeRepository.current = null; } [별도 조건식 없음]
직접 호출·분기 없음. 렌더/값 전달 경계는 실제 함수 본문에 따른다.

## H-6d166ad12f28

**download** · [src/ui/personal-space.tsx:174](../../../src/ui/personal-space.tsx#L174) · async

분기 조건과 가능한 갈림길:

- B-29a7f15fc521 · IfStatement · busy → truthy / falsy; 바깥 조건: 별도 조건식 없음 (175행).
- B-40b4e10ce0eb · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (177행).
- B-e902b9902e07 · IfStatement · activeRepository.current !== repository → truthy / falsy; 바깥 조건: 별도 조건식 없음 (177행).
- B-39c720d31eff · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (178행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 176행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 176행 | 별도 조건식 없음 | setError('')<br>state-update |
| 177행 | 별도 조건식 없음 | exportWindowRecords(repository)<br>call → [H-c7ebfe02c2dc](ui__personal-space.md#h-c7ebfe02c2dc) |
| 177행 | 별도 조건식 없음 | URL.createObjectURL(blob)<br>call |
| 177행 | 별도 조건식 없음 | document.createElement('a')<br>call |
| 177행 | 별도 조건식 없음 | anchor.click()<br>call |
| 177행 | 별도 조건식 없음 | setTimeout(() => URL.revokeObjectURL(url), 1000)<br>state-update<br>전달 콜백: H-3074e643696a |
| 178행 | exception: exception | setError('보관본을 내려받지 못했습니다. 원문은 그대로 남아 있습니다. 다시 시도해 주세요.')<br>state-update |
| 179행 | always-after-try: try 완료 또는 예외 이후 | setBusy(false)<br>state-update |

반환/조기 중단: 175행 <render> [truthy: busy]; 177행 <render> [truthy: activeRepository.current !== repository]

## H-3074e643696a

**@callback:setTimeout** · [src/ui/personal-space.tsx:177](../../../src/ui/personal-space.tsx#L177)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 177행 | 별도 조건식 없음 | URL.revokeObjectURL(url)<br>call |

## H-343dd4b46b03

**openServer** · [src/ui/personal-space.tsx:181](../../../src/ui/personal-space.tsx#L181) · async

분기 조건과 가능한 갈림길:

- B-c1b299fa5545 · IfStatement · busy → truthy / falsy; 바깥 조건: 별도 조건식 없음 (182행).
- B-0640fce69f86 · TryStatement · 구조 분기 → normal / throw/catch / finally; 바깥 조건: 별도 조건식 없음 (184행).
- B-94f8164e21ab · IfStatement · activeRepository.current === repository → truthy / falsy; 바깥 조건: 별도 조건식 없음 (184행).
- B-0e0617a27a11 · CatchClause · 구조 분기 → exception; 바깥 조건: 별도 조건식 없음 (185행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 183행 | 별도 조건식 없음 | setBusy(true)<br>state-update |
| 183행 | 별도 조건식 없음 | setError('')<br>state-update |
| 184행 | 별도 조건식 없음 | repository.openServerWithArchive()<br>preservation-boundary |
| 184행 | truthy: activeRepository.current === repository | location.reload()<br>call |
| 185행 | exception: exception | setError('보관을 마치지 못해 서버 자료로 전환하지 않았습니다. 이 기기의 글과 서버 자료는 그대로 유지했습니다. 다시 시도하거나 보관본을 내려받아 주세요.')<br>state-update |
| 186행 | always-after-try: try 완료 또는 예외 이후 | setBusy(false)<br>state-update |

반환/조기 중단: 182행 <render> [truthy: busy]

## H-781fcb4676bb

**@onClick** · [src/ui/personal-space.tsx:188](../../../src/ui/personal-space.tsx#L188)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 188행 | 별도 조건식 없음 | setOpen(true)<br>state-update |

## H-79bc56f50f2f

**@onClose** · [src/ui/personal-space.tsx:189](../../../src/ui/personal-space.tsx#L189)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 189행 | truthy: open | setOpen(false)<br>state-update |

## H-2df4f3414662

**@onClick** · [src/ui/personal-space.tsx:192](../../../src/ui/personal-space.tsx#L192)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 192행 | truthy: open | repository.flush().catch(error => setError(errorText(error)))<br>mutation-request<br>전달 콜백: H-677da9a7c0f1 |
| 192행 | truthy: open | repository.flush()<br>mutation-request |

## H-677da9a7c0f1

**@callback:repository.flush().catch** · [src/ui/personal-space.tsx:192](../../../src/ui/personal-space.tsx#L192)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 192행 | truthy: open ∧ rejected: repository.flush() | setError(errorText(error))<br>state-update |
| 192행 | truthy: open ∧ rejected: repository.flush() | errorText(error)<br>call → [H-1e95e5f672e5](ui__personal-space.md#h-1e95e5f672e5) |

## H-663d1b16308a

**@onClick** · [src/ui/personal-space.tsx:192](../../../src/ui/personal-space.tsx#L192)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 192행 | truthy: open | repository.refresh().catch(error => setError(errorText(error)))<br>call<br>전달 콜백: H-e9b32dba0a96 |
| 192행 | truthy: open | repository.refresh()<br>call |

## H-e9b32dba0a96

**@callback:repository.refresh().catch** · [src/ui/personal-space.tsx:192](../../../src/ui/personal-space.tsx#L192)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 192행 | truthy: open ∧ rejected: repository.refresh() | setError(errorText(error))<br>state-update |
| 192행 | truthy: open ∧ rejected: repository.refresh() | errorText(error)<br>call → [H-1e95e5f672e5](ui__personal-space.md#h-1e95e5f672e5) |

## H-ad6149e1f439

**@onClick** · [src/ui/personal-space.tsx:192](../../../src/ui/personal-space.tsx#L192)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 192행 | truthy: open | download()<br>call → [H-6d166ad12f28](ui__personal-space.md#h-6d166ad12f28) |

## H-16b2d532f39a

**@onClick** · [src/ui/personal-space.tsx:196](../../../src/ui/personal-space.tsx#L196)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 196행 | truthy: open ∧ truthy: conflict | openServer()<br>call → [H-343dd4b46b03](ui__personal-space.md#h-343dd4b46b03) |

## H-ecb868a7de65

**@onClick** · [src/ui/personal-space.tsx:199](../../../src/ui/personal-space.tsx#L199)


실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 199행 | truthy: open | client.auth.signOut({ scope: 'local' }).then(({ error }) => { if (error) setError('로그아웃하지 못했습니다. 다시 시도해 주세요.'); })<br>call<br>전달 콜백: H-e2c18c4a0810 |
| 199행 | truthy: open | client.auth.signOut({ scope: 'local' })<br>call |

## H-e2c18c4a0810

**@callback:client.auth.signOut({ scope: 'local' }).then** · [src/ui/personal-space.tsx:199](../../../src/ui/personal-space.tsx#L199)

분기 조건과 가능한 갈림길:

- B-13b553adef49 · IfStatement · error → truthy / falsy; 바깥 조건: truthy: open ∧ fulfilled-or-explicit-rejection-handler: client.auth.signOut({ scope: 'local' }) (199행).

실제 호출과 호출이 놓인 조건:

| 근거 | 조건 | 호출·의미 경계 |
| --- | --- | --- |
| 199행 | truthy: open ∧ fulfilled-or-explicit-rejection-handler: client.auth.signOut({ scope: 'local' }) ∧ truthy: error | setError('로그아웃하지 못했습니다. 다시 시도해 주세요.')<br>state-update |

