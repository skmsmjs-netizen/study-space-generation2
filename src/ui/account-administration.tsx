import { useEffect, useState } from 'react';
import { Button, LoadingState, Modal } from './index';
import type { AccountAccessClient } from '../data/account-access';
import type { AccessStatus, ManagedAccount } from '../server/account-access';
const labels: Record<AccessStatus, string> = { pending: '승인 대기', approved: '이용 허용', rejected: '가입 거절', suspended: '이용 중지' };
export function AccountAdministration({ api }: { api: AccountAccessClient }) {
  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState<ManagedAccount[]>([]), [cursor, setCursor] = useState<string | null>(null);
  const [total,setTotal]=useState<number | null>(null);
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState('');
  const [decision, setDecision] = useState<{ account: ManagedAccount; status: AccessStatus } | null>(null);
  async function load(more = false) {
    setBusy(true); setError('');
    try { const page = await api.list(more ? cursor : null); setAccounts(previous => more ? [...previous, ...page.accounts] : page.accounts); setCursor(page.nextCursor); setTotal(page.totalCount??null); }
    catch (error) { setError(error instanceof Error ? error.message : '계정 목록을 불러오지 못했습니다.'); }
    finally { setBusy(false); }
  }
  useEffect(() => { if (open) { setDecision(null); setNotice(''); void load(); } }, [open]);
  async function save() {
    if (!decision || busy) return;
    setBusy(true); setError(''); setNotice('');
    try {
      await api.set(decision.account.userId, decision.status, decision.account.version);
      setNotice(`${decision.account.email} 계정을 ${labels[decision.status]} 상태로 변경했습니다.`);
      setDecision(null);
      const page = await api.list(); setAccounts(page.accounts); setCursor(page.nextCursor); setTotal(page.totalCount??null);
    } catch (error) { setError(error instanceof Error ? error.message : '계정 상태를 변경하지 못했습니다.'); }
    finally { setBusy(false); }
  }
  return <><Button variant="quiet" onClick={() => setOpen(true)}>가입 계정 관리</Button>
    <Modal open={open} title="가입 계정 관리" onClose={() => { if (!busy) setOpen(false); }}>
      <p>이메일 확인을 마친 계정을 승인하면 개인 공부 공간을 사용할 수 있습니다. 이용 중지는 기존 기록을 삭제하지 않습니다.</p>
      <p>{total===null ? '등록 계정' : `등록 계정 ${total}명`} · 현재 목록 {accounts.length}명</p>
      <Button disabled={busy} onClick={() => { setDecision(null); void load(); }}>목록 새로고침</Button>
      {busy && <LoadingState message="계정 상태를 확인하고 있습니다…" />}
      {error && <p role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}
      <ul className="account-list">{accounts.map(account => <li key={account.userId}>
        <strong>{account.displayName || '이름 미등록'}</strong><p>{account.email}</p><p>{account.administrator ? '관리자' : labels[account.status]} · {account.emailConfirmed ? '이메일 확인됨' : '이메일 확인 대기'} · 가입일 {new Date(account.createdAt).toLocaleDateString('ko-KR')}</p>
        {!account.administrator && <div className="actions">
          {account.status !== 'approved' && <Button disabled={busy || !account.emailConfirmed} onClick={() => setDecision({ account, status: 'approved' })}>승인</Button>}
          {account.status === 'pending' && <Button disabled={busy} onClick={() => setDecision({ account, status: 'rejected' })}>거절</Button>}
          {account.status === 'approved' && <Button disabled={busy} onClick={() => setDecision({ account, status: 'suspended' })}>이용 중지</Button>}
          {['rejected','suspended'].includes(account.status) && <Button disabled={busy} onClick={() => setDecision({ account, status: 'pending' })}>승인 대기로 변경</Button>}
        </div>}
      </li>)}</ul>
      {!busy && !accounts.length && !error && <p>가입한 계정이 없습니다.</p>}
      {cursor && <Button disabled={busy} onClick={() => { void load(true); }}>계정 더 보기</Button>}
      {decision && <section className="account-decision" aria-label="계정 변경 확인"><p><strong>{decision.account.displayName ? `${decision.account.displayName} (${decision.account.email})` : decision.account.email}</strong> 계정을 <strong>{labels[decision.status]}</strong> 상태로 변경할까요?</p>
        <div className="actions"><Button variant="primary" disabled={busy} onClick={() => { void save(); }}>변경 확인</Button><Button disabled={busy} onClick={() => setDecision(null)}>취소</Button></div>
      </section>}
    </Modal></>;
}
