import { useEffect, useState, type ReactNode } from 'react';
import type { StudyRepository } from '../data/repository';
import { checkFullBackup, createFullBackup, priorRestoreBackups, recoverInterruptedBackup, stageFullBackup, cancelPlannedBackup, type CheckedBackup } from '../data/full-backup';
import { Button, Card, Checkbox, ErrorState, Input, LoadingState } from './index';

function download(file: Blob, name: string) {
  const url = URL.createObjectURL(file), anchor = document.createElement('a');
  anchor.href = url; anchor.download = name; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const errorText = (error: unknown) => error instanceof Error ? error.message : '자료를 보관하지 못했습니다. 원본은 유지했습니다. 다시 시도해 주세요.';
export function FullBackup({ repository }: { repository: StudyRepository }) {
  const owner = repository.getSnapshot();
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState('');
  const [checked, setChecked] = useState<CheckedBackup | null>(null), [confirmed, setConfirmed] = useState(false), [restored, setRestored] = useState(false);
  useEffect(() => {
    const areas = Array.from(document.querySelectorAll<HTMLElement>('.sidebar, .topbar, .bottom-nav'));
    for (const area of areas) area.inert = busy || restored;
    return () => { for (const area of areas) area.inert = false; };
  }, [busy, restored]);
  const [prior, setPrior] = useState<Awaited<ReturnType<typeof priorRestoreBackups>>>([]);
  useEffect(() => { void priorRestoreBackups(owner).then(setPrior).catch(error => setError(errorText(error))); }, [owner.namespace, owner.userId]);
  useEffect(() => {
    if (!busy && !restored) return;
    const prevent = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', prevent); return () => window.removeEventListener('beforeunload', prevent);
  }, [busy, restored]);
  async function backup() {
    setBusy(true); setError(''); setNotice('');
    let resume: (() => void) | undefined;
    try { resume = await repository.pauseForRestore?.(); const bytes = await createFullBackup(owner, undefined, repository.getBackupKey?.()); download(new Blob([bytes.slice().buffer], { type: 'application/zip' }), `study-backup-${new Date().toISOString().slice(0,10)}.zip`); setNotice('공부 기록·첨부·초안·기기 설정을 한 파일로 내려받았습니다.'); }
    catch (error) { setError(errorText(error)); } finally { resume?.(); setBusy(false); }
  }
  async function review(file: File) {
    setBusy(true); setError(''); setNotice(''); setChecked(null); setConfirmed(false);
    try { if (file.size > 512 * 1024 * 1024) throw Error('백업 파일은 512MB 이하로 골라 주세요.'); setChecked(await checkFullBackup(new Uint8Array(await file.arrayBuffer()), owner)); }
    catch (error) { setError(errorText(error)); } finally { setBusy(false); }
  }
  async function restore() {
    if (!checked || !confirmed) return;
    setBusy(true); setError('');
    let resume: (() => void) | undefined;
    try {
      resume = await repository.pauseForRestore?.();
      // The workspace already owns this account's writer lock; exclude other recovery gates too.
      if (!navigator.locks) throw Error('동시 복원을 보호할 수 없습니다. 최신 브라우저에서 열어 주세요.');
      await navigator.locks.request('study-space:backup-recovery', () => stageFullBackup(checked, owner));
      setRestored(true); setChecked(null);
      setNotice('백업을 확인했습니다. 다른 공부 창을 마친 뒤 아래 버튼으로 다시 열면, 현재 자료를 보관하고 복원합니다. 서버 자료는 변경하지 않습니다.');
    } catch (error) { resume?.(); setError(errorText(error)); } finally { setBusy(false); }
  }
  return <section className="full-backup" aria-label="백업·복원" aria-busy={busy}>
    <Card><h2>공부 자료 백업</h2><p>기록과 수정 이력, 배치, 첨부 원본, 녹음, 작성 중인 초안과 이 기기의 보기 설정을 함께 보관합니다. 로그인 정보는 포함하지 않습니다.</p>
      <Button onClick={() => { void backup(); }} disabled={busy || restored}>전체 백업 내려받기</Button>
    </Card>
    {!restored && <Card><h2>백업에서 복원</h2><p>현재 계정·공간의 백업만 복원합니다. 같은 항목은 백업 내용으로 복원하고, 현재 자료는 복원 전 사본에 남깁니다. 백업에 없는 기존 항목은 지우지 않습니다.</p>
      <Input label="전체 백업 파일" type="file" accept=".zip,application/zip" disabled={busy} onChange={event => { const file = event.target.files?.[0]; if (file) void review(file); event.target.value = ''; }} />
      {checked && <div><p>백업 시각: {new Date(checked.manifest.createdAt).toLocaleString('ko-KR')}</p><p>공부 기록 {checked.data.records.length}개 · 보관 항목 {checked.rows.length}개 · 첨부·녹음 조각 {checked.rows.filter(row => row.value instanceof Blob).length}개</p>
        <p>다른 창에서 작성한 초안은 보관하며 자동으로 입력창에 적용하지 않습니다. 개인 공간의 복원 내용이 서버와 다르면 양쪽 내용을 유지하고 선택을 기다립니다.</p>
        <Checkbox label="현재 이 기기 자료를 보관한 뒤 백업 내용으로 복원합니다" checked={confirmed} disabled={busy} onChange={event => setConfirmed(event.target.checked)} />
        <div className="actions"><Button disabled={busy || !confirmed} onClick={() => { void restore(); }}>이 기기에 복원</Button><Button disabled={busy} variant="quiet" onClick={() => { setChecked(null); setConfirmed(false); }}>취소</Button></div>
      </div>}
    </Card>}
    {busy && <LoadingState message="자료를 확인하고 보관하고 있습니다…" />}
    {error && <p role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}
    {restored && <Button onClick={() => location.reload()}>다시 열어 복원하기</Button>}
    {prior.length > 0 && <Card><h2>복원 전 보관본</h2><p>복원하기 전 이 기기에 있던 자료입니다. 필요할 때 내려받아 같은 복원 절차로 되돌릴 수 있습니다.</p>{prior.map(row => <p key={row.id}><Button disabled={busy} variant="quiet" onClick={() => download(row.file, `study-before-restore-${row.id}.zip`)}>{new Date(row.createdAt).toLocaleString('ko-KR')} 보관본 내려받기</Button></p>)}</Card>}
  </section>;
}
export function BackupRecoveryGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false), [error, setError] = useState('');
  useEffect(() => {
    let alive = true;
    async function recover() { if (typeof indexedDB === 'undefined') return; await recoverInterruptedBackup(); }
    const recovery = navigator.locks ? navigator.locks.request('study-space:backup-recovery', recover) : recover();
    void recovery.then(() => { if (alive) setReady(true); }).catch(error => { if (alive) setError(errorText(error)); });
    return () => { alive = false; };
  }, []);
  if (error) return <main className="boot"><ErrorState title="백업 복원·복구를 마치지 못했습니다" message={error} onRetry={() => location.reload()} /><Button onClick={() => { void cancelPlannedBackup().then(() => location.reload()); }}>복원 요청 취소하고 기존 공간 열기</Button></main>;
  return ready ? children : <main className="boot"><LoadingState message="보관 자료를 확인하고 있습니다…" /></main>;
}
