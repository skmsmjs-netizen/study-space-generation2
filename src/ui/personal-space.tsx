import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Button, Card, ErrorState, Input, LoadingState, Modal } from './index';
import { createStudyClient, onlineTransport, readServerConfig } from '../data/supabase-client';
import { PersonalRepository } from '../data/personal-repository';
import type { SaveStatus } from '../data/repository';
import './personal-space.css';
const errorText = (error: unknown) => error instanceof Error ? error.message : '개인 공간을 열지 못했습니다.';
export function PersonalSpace({ onDemo, renderWorkspace }: { onDemo: () => void; renderWorkspace: (repo: PersonalRepository, controls: ReactNode) => ReactNode }) {
  const [configured] = useState(readServerConfig);
  const client = useMemo(() => configured ? createStudyClient(configured) : null, [configured]);
  const [userId, setUserId] = useState<string | null>(null), [authReady, setAuthReady] = useState(false);
  const [repo, setRepo] = useState<PersonalRepository | null>(null), [error, setError] = useState('');
  const [retry, setRetry] = useState(0), [opening, setOpening] = useState(false);
  useEffect(() => {
    if (!client) { setAuthReady(true); return; }
    let alive = true;
    const { data } = client.auth.onAuthStateChange((_event, session) => { if (alive) { setUserId(session?.user.id ?? null); setAuthReady(true); } });
    client.auth.getUser().then(({ data, error }) => { if (alive) { if (error && error.name !== 'AuthSessionMissingError') setError('로그인 상태를 확인하지 못했습니다. 다시 로그인해 주세요.'); setUserId(data.user?.id ?? null); setAuthReady(true); } });
    return () => { alive = false; data.subscription.unsubscribe(); };
  }, [client]);
  useEffect(() => {
    setRepo(null); setError('');
    if (!client || !userId) { setOpening(false); return; }
    let disposed = false; let release: (() => void) | undefined;
    setOpening(true);
    if (!navigator.locks) { setError('동시 작성을 보호할 수 있는 최신 브라우저에서 열어 주세요.'); setOpening(false); return; }
    void navigator.locks.request(`study-space:personal:${userId}:writer`, { ifAvailable: true }, async lock => {
      if (disposed) return;
      if (!lock) { setError('다른 창에서 내 공부 공간을 사용 중입니다. 그 창의 입력을 마친 뒤 다시 열어 주세요.'); setOpening(false); return; }
      try {
        const transport = onlineTransport(client), server = await transport.load();
        if (disposed) return;
        if (server.data.userId !== userId || server.data.namespace !== 'personal') throw Error('로그인한 사용자의 자료가 아닙니다.');
        const repository = new PersonalRepository(localStorage, transport, server);
        setRepo(repository); setOpening(false); void repository.flush();
      } catch (error) { if (!disposed) { setError(errorText(error)); setOpening(false); } }
      if (!disposed) await new Promise<void>(resolve => { release = resolve; });
    }).catch(error => { if (!disposed) { setError(errorText(error)); setOpening(false); } });
    return () => { disposed = true; release?.(); };
  }, [client, userId, retry]);
  if (repo && client) return renderWorkspace(repo, <ServerStatus repository={repo} client={client} onDemo={onDemo} />);
  return <main className="boot personal-entry"><Card><h1>내 공부 공간</h1>
    {!configured ? <ErrorState title="서버 연결 설정이 필요합니다" message="시연 기록은 그대로 남아 있습니다. 서버 공개 설정을 적용한 뒤 개인 공간을 열 수 있습니다." />
      : !authReady || opening ? <LoadingState message="내 기록을 불러오는 중…" />
      : !userId && client ? <SignIn client={client} />
      : <><ErrorState title="내 공부 공간을 열지 못했습니다" message={error || '서버에 연결하지 못했습니다. 기록은 지우지 않았습니다.'} onRetry={() => setRetry(value => value + 1)} /><Button onClick={() => { void client?.auth.signOut({ scope: 'local' }); }}>다시 로그인</Button></>}
    {error && !userId && <p role="alert">{error}</p>}
    <Button variant="quiet" onClick={onDemo}>시연 공간으로 돌아가기</Button>
  </Card></main>;
}
function SignIn({ client }: { client: SupabaseClient }) {
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState('');
  async function submit(create = false) {
    if (busy) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const { data, error } = create ? await client.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}${import.meta.env.BASE_URL}?space=personal` } }) : await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setPassword('');
      if (create && !data.session) setNotice('이메일로 받은 확인 링크를 연 뒤 로그인해 주세요.');
    } catch { setError(create ? '가입하지 못했습니다. 이메일·비밀번호를 확인하거나 잠시 후 다시 시도해 주세요.' : '로그인하지 못했습니다. 이메일·비밀번호와 연결 상태를 확인해 주세요.'); }
    finally { setBusy(false); }
  }
  return <form onSubmit={event => { event.preventDefault(); void submit(); }}><p>로그인하면 이 공간의 기록을 서버에 저장합니다. 시연 기록은 자동으로 옮기지 않습니다.</p>
    <Input label="이메일" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} />
    <Input label="비밀번호" type="password" autoComplete="current-password" required minLength={6} value={password} onChange={event => setPassword(event.target.value)} />
    <div className="actions"><Button variant="primary" type="submit" disabled={busy}>{busy ? '연결 중…' : '로그인'}</Button><Button type="button" disabled={busy || !email || password.length < 6} onClick={() => { void submit(true); }}>처음 사용하기</Button></div>
    {error && <p role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}
  </form>;
}
export function ServerStatus({ repository, client, onDemo }: { repository: PersonalRepository; client: SupabaseClient; onDemo: () => void }) {
  const [status, setStatus] = useState<SaveStatus>(repository.getStatus()), [open, setOpen] = useState(false), [error, setError] = useState('');
  useEffect(() => { setStatus(repository.getStatus()); return repository.subscribe(() => setStatus(repository.getStatus())); }, [repository]);
  const conflict = repository.getConflict();
  function download() { try { const blob = new Blob([repository.exportPreserved()], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'study-preserved-records.json'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); } catch { setError('보관본을 내려받지 못했습니다. 원문은 그대로 남아 있습니다. 다시 시도해 주세요.'); } }
  return <><Button variant="quiet" onClick={() => setOpen(true)}>{status.message}{status.pending ? ` (${status.pending}건)` : ''}</Button>
    <Modal open={open} title="내 기록의 저장 상태" onClose={() => setOpen(false)}><p role={status.phase === 'error' || status.phase === 'conflict' ? 'alert' : 'status'}>{status.message}</p>
      <p>기록·목차·서술·메모는 서버 저장과 연결됩니다. 작성 중인 초안과 추천 설정은 현재 기기에 보관됩니다.</p>
      <div className="actions"><Button onClick={() => { void repository.flush(); }}>서버 저장 다시 시도</Button><Button onClick={() => { void repository.refresh().catch(error => setError(errorText(error))); }}>서버 기록 다시 불러오기</Button><Button onClick={download}>이 기기의 기록·보관본 내려받기</Button></div>
      {conflict && <section><h2>두 자료를 확인해 주세요</h2><p>서버 저장 {conflict.server.sequence}회 · 이 기기의 미전송 변경 {conflict.pending.length}건</p>
        <details><summary>이 기기에서 작성한 내용</summary><pre>{JSON.stringify(conflict.pending, null, 2)}</pre></details>
        <details><summary>서버의 기록·글·메모</summary><pre>{JSON.stringify({ records: conflict.server.data.records, narratives: conflict.server.data.narratives, memos: conflict.server.data.memos }, null, 2)}</pre></details>
        <Button onClick={() => { try { repository.openServerWithArchive(); location.reload(); } catch (error) { setError(errorText(error)); } }}>이 기기의 글을 보관하고 서버 자료 열기</Button>
      </section>}
      {error && <p role="alert">{error}</p>}
      <div className="actions section-space"><Button onClick={onDemo}>시연 공간 보기</Button><Button onClick={() => { void client.auth.signOut({ scope: 'local' }).then(({ error }) => { if (error) setError('로그아웃하지 못했습니다. 다시 시도해 주세요.'); }); }}>로그아웃</Button></div>
    </Modal></>;
}
