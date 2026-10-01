import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Button, Card, Checkbox, ErrorState, Input, LoadingState, Modal } from './index';
import { createStudyClient, onlineTransport, readServerConfig, signInStudyClient } from '../data/supabase-client';
import { PersonalRepository, readCachedPersonalSnapshot } from '../data/personal-repository';
import { startPersonalSync } from '../data/personal-sync';
import type { SaveStatus } from '../data/repository';
import { accountAccessClient } from '../data/account-access';
import { accessMessages, type AccountAccess } from '../server/account-access';
import { AccountSettings } from './account-settings';
import { clearWithdrawnAccount } from '../data/account-cleanup';
import { validateAccountName } from '../server/account-access';
import { AccountAdministration } from './account-administration';
import './personal-space.css';
const errorText = (error: unknown) => error instanceof Error ? error.message : '개인 공간을 열지 못했습니다.';
export function PersonalSpace({ renderWorkspace }: { renderWorkspace: (repo: PersonalRepository, controls: ReactNode) => ReactNode }) {
  const [configured] = useState(readServerConfig);
  const [client, setClient] = useState(() => configured ? createStudyClient(configured) : null);
  const accessApi = useMemo(() => client ? accountAccessClient(client) : null, [client]);
  const [access, setAccess] = useState<AccountAccess | null>(null);
  const [userId, setUserId] = useState<string | null>(null), [authReady, setAuthReady] = useState(false);
  const [repo, setRepo] = useState<PersonalRepository | null>(null), [error, setError] = useState('');
  const [retry, setRetry] = useState(0), [opening, setOpening] = useState(false), [otherWriter, setOtherWriter] = useState(false);
  const [withdrawn, setWithdrawn] = useState<string | null>(null), [withdrawalNotice, setWithdrawalNotice] = useState('');
  const writerTask = useRef<Promise<void>>(Promise.resolve());
  useEffect(() => {
    if (!client) { setAuthReady(true); return; }
    let alive = true;
    let authVersion = 0;
    const { data } = client.auth.onAuthStateChange((_event, session) => { authVersion++; if (alive) { setUserId(session?.user.id ?? null); setAuthReady(true); } });
    const version = authVersion;
    // Restore the local session; the API still authenticates and authorizes every request.
    client.auth.getSession().then(({ data, error }) => { if (alive && version === authVersion) { if (error) setError('로그인 상태를 확인하지 못했습니다. 다시 로그인해 주세요.'); setUserId(data.session?.user.id ?? null); setAuthReady(true); } });
    return () => { alive = false; data.subscription.unsubscribe(); };
  }, [client]);
  useEffect(() => {
    setRepo(null); setAccess(null); setError(''); setOtherWriter(false);
    if (!client || !userId || withdrawn) { setOpening(false); return; }
    let disposed = false;
    let finish: () => void = () => {};
    const closed = new Promise<void>(resolve => { finish = resolve; });
    setOpening(true);
    if (!navigator.locks) { setError('동시 작성을 보호할 수 있는 최신 브라우저에서 열어 주세요.'); setOpening(false); return; }
    // Await our previous request's completion, which includes the browser releasing its lock.
    const previous = writerTask.current;
    const task = (async () => {
      await previous.catch(() => {});
      if (disposed) return;
      // An email confirmation can sign in the original hidden signup tab as well.
      // Do not let that unopened background space claim the writer before the visible tab.
      if (document.visibilityState === 'hidden') {
        let removeListener: () => void = () => {};
        const visible = new Promise<void>(resolve => {
          const changed = () => { if (document.visibilityState !== 'hidden') resolve(); };
          document.addEventListener('visibilitychange', changed);
          removeListener = () => document.removeEventListener('visibilitychange', changed);
          changed();
        });
        try { await Promise.race([visible, closed]); } finally { removeListener(); }
      }
      if (disposed) return;
      const permission = await accessApi!.read();
      if (disposed) return;
      setAccess(permission);
      if (permission.status !== 'approved') { setOpening(false); return; }
      await navigator.locks.request(`study-space:personal:${userId}:writer`, { ifAvailable: true }, async lock => {
        if (disposed) return;
        if (!lock) { setOtherWriter(true); setError('다른 창에서 내 공부 공간을 사용 중입니다. 그 창의 입력을 마친 뒤 다시 열어 주세요.'); setOpening(false); return; }
        let opened: PersonalRepository | undefined;
        try {
          const transport = onlineTransport(client);
          const cached = readCachedPersonalSnapshot(localStorage, userId);
          const server = cached ?? await Promise.race([transport.load(), closed.then(() => null)]);
          if (disposed || !server) return;
          if (server.data.userId !== userId || server.data.namespace !== 'personal') throw Error('로그인한 사용자의 자료가 아닙니다.');
          const repository = new PersonalRepository(localStorage, transport, server, Boolean(cached));
          opened = repository;
          setRepo(repository); setOpening(false); void repository.flush();
        } catch (error) {
          if (!disposed) { setError(errorText(error)); setOpening(false); }
          return; // An error screen is not a writer; release before retrying.
        }
        await closed;
        await opened?.close();
      });
    })();
    writerTask.current = task;
    void task.catch(error => { if (!disposed) { setError(errorText(error)); setOpening(false); } });
    return () => { disposed = true; finish(); };
  }, [client, accessApi, userId, retry, withdrawn]);
  useEffect(() => repo ? startPersonalSync(repo) : undefined, [repo]);
  async function cleanupWithdrawal(id: string) {
    await writerTask.current.catch(() => {});
    try {
      if (navigator.locks) await navigator.locks.request(`study-space:personal:${id}:writer`, {ifAvailable:true}, async lock=>{if(!lock)throw Error('다른 창에서 사용 중입니다.');await clearWithdrawnAccount(id);});
      else await clearWithdrawnAccount(id);
      setWithdrawalNotice('탈퇴했습니다. 계정과 서버 기록, 이 브라우저의 개인 자료를 삭제했습니다.'); }
    catch { setWithdrawalNotice('탈퇴했고 서버 기록은 삭제했습니다. 이 브라우저의 개인 자료 정리는 끝나지 않았습니다. 다른 학습앱 창을 닫은 뒤 다시 시도해 주세요.'); }
  }
  async function onWithdrawn() {
    if (!userId) return;
    const id=userId; setWithdrawn(id); setRepo(null); setUserId(null);
    try { await client?.auth.signOut({ scope:'local' }); } catch { /* Deleted identities cannot access the server. */ }
    await cleanupWithdrawal(id);
  }
  function downloadRecords() {
    if (!repo) return;
    const url=URL.createObjectURL(new Blob([repo.exportPreserved()],{type:'application/json'}));
    const anchor=document.createElement('a');anchor.href=url;anchor.download='study-preserved-records.json';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  const settings=accessApi&&access?<AccountSettings api={accessApi} access={access} onSaved={setAccess} onWithdrawn={onWithdrawn} onDownload={repo?downloadRecords:undefined}/>:null;
  if (repo && client) return renderWorkspace(repo, <><ServerStatus repository={repo} client={client} />{settings}{access?.administrator && accessApi && <AccountAdministration api={accessApi} />}</>);
  return <main className="boot personal-entry"><Card><h1>내 공부 공간</h1>
    {withdrawn ? <section><p role="status">{withdrawalNotice||'탈퇴했습니다. 이 브라우저의 개인 자료를 정리하고 있습니다…'}</p>{withdrawalNotice.includes('끝나지')&&<Button onClick={()=>{void cleanupWithdrawal(withdrawn);}}>이 기기의 자료 정리 다시 시도</Button>}<Button onClick={()=>{setWithdrawn(null);setWithdrawalNotice('');}}>로그인 화면으로 돌아가기</Button></section> : !configured ? <ErrorState title="내 공부 공간에 연결하지 못했습니다" message="연결을 확인한 뒤 다시 시도해 주세요. 이 기기에 보관된 기록은 그대로 남아 있습니다." onRetry={() => location.reload()} />
      : !authReady || opening ? <LoadingState message="내 기록을 불러오는 중…" />
      : !userId && client ? <SignIn client={client} onSignedIn={setClient} />
      : access && access.status !== 'approved' ? <section><h2>{access.status === 'pending' ? '가입 승인 대기' : access.status === 'rejected' ? '가입이 승인되지 않았습니다' : '이용이 중지되었습니다'}</h2><p>{accessMessages[access.status]}</p><div className="actions"><Button onClick={() => setRetry(value => value + 1)}>승인 상태 다시 확인</Button><Button onClick={() => { void client?.auth.signOut({ scope: 'local' }); }}>로그아웃</Button></div></section>
      : <><ErrorState title="내 공부 공간을 열지 못했습니다" message={error || '서버에 연결하지 못했습니다. 기록은 지우지 않았습니다.'} onRetry={() => setRetry(value => value + 1)} />{otherWriter ? <p>가입 확인 메일에서 새 탭이 열렸다면, 처음 가입한 학습앱 탭으로 돌아가 주세요.</p> : <Button onClick={() => { void client?.auth.signOut({ scope: 'local' }); }}>다시 로그인</Button>}</>}
    {userId && !withdrawn && settings}
    {error && !userId && <p role="alert">{error}</p>}
  </Card></main>;
}
function SignIn({ client, onSignedIn }: { client: SupabaseClient; onSignedIn: (client: SupabaseClient) => void }) {
  const [name, setName] = useState('');
  const [remember, setRemember] = useState(true);
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [creating, setCreating] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState('');
  async function submit(create = false) {
    if (busy) return;
    if (create && password.length < 6) { setError('비밀번호를 6자 이상 입력해 주세요.'); return; }
    setError('');
    if (create) { try { validateAccountName(name); } catch (error) {setError(errorText(error));return;} }
    setBusy(true); setNotice('');
    try {
      if (create) {
        const { data, error } = await client.auth.signUp({ email, password, options: { data: { display_name: validateAccountName(name) }, emailRedirectTo: `${location.origin}${import.meta.env.BASE_URL}?space=personal` } });
        if (error) throw error;
        if (!data.session) setNotice('이메일로 받은 확인 링크를 연 뒤 로그인해 주세요.');
      } else onSignedIn(await signInStudyClient(client, { email, password }, remember));
      setPassword('');
    } catch (error) { const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : null; const limited = create && code === 'over_email_send_rate_limit'; setError(code === 'AUTH_STORAGE' ? errorText(error) : limited ? '가입 확인 메일의 발송 한도에 도달했습니다. 잠시 후 다시 시도해 주세요.' : create ? '가입하지 못했습니다. 이메일·비밀번호를 확인하거나 잠시 후 다시 시도해 주세요.' : '로그인하지 못했습니다. 이메일·비밀번호와 연결 상태를 확인해 주세요.'); }
    finally { setBusy(false); }
  }
  return <form onSubmit={event => { event.preventDefault(); void submit(creating); }}><p>로그인하면 내 공부 기록을 저장하고 다른 기기에서도 이어갈 수 있습니다.</p>
    {creating && <><p>이메일과 6자 이상 비밀번호로 계정을 만듭니다. 가입 후 이메일로 받은 확인 링크를 열어 주세요.</p><p>이메일 확인 후 관리자 승인을 받아야 내 공부 공간을 사용할 수 있습니다.</p></>}
    {creating && <Input label="이름" autoComplete="name" required maxLength={80} value={name} onChange={event=>setName(event.target.value)} />}
    <Input label="이메일" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} />
    <Input label={creating ? "비밀번호 (6자 이상)" : "비밀번호"} type="password" autoComplete={creating ? "new-password" : "current-password"} required minLength={creating ? 6 : undefined} value={password} onChange={event => setPassword(event.target.value)} />
    {!creating && <div><Checkbox label="로그인 상태 유지" checked={remember} disabled={busy} aria-describedby="login-persistence-hint" onChange={event => setRemember(event.target.checked)} /><p id="login-persistence-hint" className="ui-hint">{remember ? '다음에 열 때 바로 내 공부 공간으로 들어갑니다. 공용 기기에서는 꺼 주세요.' : '이 탭에서만 로그인을 유지합니다. 사용을 마치면 로그아웃해 주세요.'}</p></div>}
    <div className="actions"><Button variant="primary" type="submit" disabled={busy}>{busy ? '연결 중…' : creating ? '계정 만들기' : '로그인'}</Button><Button type="button" disabled={busy} onClick={() => { setCreating(value => !value); setError(''); setNotice(''); }}>{creating ? '로그인으로 돌아가기' : '처음 사용하기'}</Button></div>
    {error && <p role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}
  </form>;
}
export function ServerStatus({ repository, client }: { repository: PersonalRepository; client: SupabaseClient }) {
  const [status, setStatus] = useState<SaveStatus>(repository.getStatus()), [open, setOpen] = useState(false), [error, setError] = useState('');
  useEffect(() => { setStatus(repository.getStatus()); return repository.subscribe(() => setStatus(repository.getStatus())); }, [repository]);
  const conflict = repository.getConflict();
  function download() { try { const blob = new Blob([repository.exportPreserved()], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'study-preserved-records.json'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); } catch { setError('보관본을 내려받지 못했습니다. 원문은 그대로 남아 있습니다. 다시 시도해 주세요.'); } }
  return <><Button variant="quiet" onClick={() => setOpen(true)}>{status.message}{status.pending ? ` (${status.pending}건)` : ''}</Button>
    <Modal open={open} title="내 기록의 저장 상태" onClose={() => setOpen(false)}><p role={status.phase === 'error' || status.phase === 'conflict' ? 'alert' : 'status'}>{status.message}</p>
      <p>기록·목차·서술·메모는 서버 저장과 연결됩니다. 다른 기기의 저장된 기록을 자동으로 확인하며, 화면으로 돌아오면 바로 확인합니다. 작성 중인 초안은 현재 기기에 보관됩니다.</p>
      <div className="actions"><Button onClick={() => { void repository.flush(); }}>서버 저장 다시 시도</Button><Button onClick={() => { void repository.refresh().catch(error => setError(errorText(error))); }}>서버 기록 다시 불러오기</Button><Button onClick={download}>이 기기의 기록·보관본 내려받기</Button></div>
      {conflict && <section><h2>두 자료를 확인해 주세요</h2><p>서버 저장 {conflict.server.sequence}회 · 이 기기의 미전송 변경 {conflict.pending.length}건</p>
        <details><summary>이 기기에서 작성한 내용</summary><pre>{JSON.stringify(conflict.pending, null, 2)}</pre></details>
        <details><summary>서버의 기록·글·메모</summary><pre>{JSON.stringify({ records: conflict.server.data.records, narratives: conflict.server.data.narratives, memos: conflict.server.data.memos }, null, 2)}</pre></details>
        <Button onClick={() => { try { repository.openServerWithArchive(); location.reload(); } catch (error) { setError(errorText(error)); } }}>이 기기의 글을 보관하고 서버 자료 열기</Button>
      </section>}
      {error && <p role="alert">{error}</p>}
      <div className="actions section-space"><Button onClick={() => { void client.auth.signOut({ scope: 'local' }).then(({ error }) => { if (error) setError('로그아웃하지 못했습니다. 다시 시도해 주세요.'); }); }}>로그아웃</Button></div>
    </Modal></>;
}
