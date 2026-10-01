import { useEffect, useMemo, useState } from 'react';
import { Button, Checkbox, ErrorState, Input, Select } from './index';
import { canUseOwnerAI } from '../domain/ai-access';
import type { Namespace } from '../domain/model';
import { configureOpenAIAPI, localAIStatus, type GPTConnectionStatus } from '../data/study-ai';
import './study-materials.css';
const message = (error: unknown) => error instanceof Error ? error.message : 'API 설정을 확인해 주세요.';
const dollars = (micro: number) => `US$${(micro / 1_000_000).toFixed(micro > 0 && micro < 100 ? 6 : 4)}`;
/** Keys live only in this input until submitted to the authenticated server vault. */
export function GPTConnectionPanel({ userId, namespace = 'personal', busy = false, purpose = 'materials' }: {
  userId: string; namespace?: Namespace; busy?: boolean; purpose?: 'materials' | 'memory';
}) {
  const owner = useMemo(() => ({ userId, namespace }), [userId, namespace]);
  const allowed = canUseOwnerAI(owner);
  const [connection, setConnection] = useState<GPTConnectionStatus | null>(null);
  const [working, setWorking] = useState(false);
  const [key, setKey] = useState('');
  const [limit, setLimit] = useState(10_000_000);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState(''), [notice, setNotice] = useState('');
  useEffect(() => {
    if (!allowed) return;
    const controller = new AbortController();
    void localAIStatus(owner, controller.signal).then(status => {
      if (!controller.signal.aborted) { setConnection(status); setLimit(status.billing?.limitMicro ?? 10_000_000); }
    }).catch(error => { if (!controller.signal.aborted) setError(message(error)); });
    return () => controller.abort();
  }, [owner, allowed]);
  if (!allowed) return null;
  const billing = connection?.billing;
  const disabled = working || busy || !connection;
  async function save(action: 'save' | 'pause' | 'disconnect') {
    setWorking(true); setError(''); setNotice('');
    try {
      await configureOpenAIAPI(owner, {
        ...(action === 'save' && key.trim() ? { key: key.trim() } : {}),
        limitMicro: action === 'save' ? limit : billing?.limitMicro ?? limit,
        enabled: action === 'save', confirmPaid: true, disconnect: action === 'disconnect',
      });
      setKey('');
      setNotice(action === 'disconnect' ? 'API 키를 서버에서 삭제했습니다. 학습 자료와 이번 달 사용 집계는 유지했습니다.'
        : action === 'pause' ? '새 API 생성을 멈췄습니다. 원본과 기존 결과는 보관했습니다.'
        : 'API 설정을 저장했습니다. 키의 호출 권한과 잔액은 실제 생성 요청에서 확인됩니다. 저장만으로 유료 호출하지 않았습니다.');
      setConnection(await localAIStatus(owner));
    } catch (error) { setError(message(error)); }
    finally { setKey(''); setWorking(false); }
  }
  return <section aria-label="GPT 연결 설정" aria-busy={working}>
    <div className="material-connection">
      <h2>GPT 연결</h2>
      <p>OpenAI API로 {purpose === 'memory' ? '암기항목을' : '요약·카드·퀴즈를'} 만듭니다. ChatGPT Plus 구독과 별도로 사용한 만큼 요금이 발생합니다.</p>
      <p>GPT-6 Luna · 기본 월 상한 US$10. 전사문 가져오기와 기기 OCR은 API 비용을 쓰지 않습니다.</p>
      <p>새 API 계정은 최소 US$5 선충전이 필요합니다. 매달 내는 구독료가 아니며 잔액은 1년 동안 사용합니다. 결제 화면에서 자동 충전은 꺼 주세요. <a href="https://help.openai.com/en/articles/8264644-setting-up-and-managing-prepaid-api-billing" target="_blank" rel="noreferrer">충전 안내</a></p>
      <div className="material-actions">
        <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer">API 키 만들기</a>
        <a href="https://platform.openai.com/settings/organization/billing/overview" target="_blank" rel="noreferrer">API 결제·잔액 확인</a>
        <a href="https://platform.openai.com/settings/organization/limits" target="_blank" rel="noreferrer">OpenAI 사용 한도 확인</a>
      </div>
      {billing && <p role="status">{billing.configured ? billing.enabled ? '키 등록됨 · 생성 사용 켜짐' : '키 등록됨 · 생성 사용 멈춤' : 'API 키가 필요합니다.'}<br />
        {billing.month.slice(0, 7)} 상한 {dollars(billing.limitMicro)} · 보수적으로 집계한 사용 {dollars(billing.usedMicro)}
        {billing.pendingMicro > 0 && <> · 사용량 미확인 예약 {dollars(billing.pendingMicro)}</>}
      </p>}
      <Input label={billing?.configured ? 'API 키 교체 (선택)' : 'OpenAI API 키'} type="password" value={key}
        autoComplete="off" autoCapitalize="none" spellCheck={false} disabled={disabled}
        onChange={e => setKey(e.target.value)} hint="키는 서버에 암호화하여 보관합니다. 기기의 학습 자료나 백업에는 넣지 않습니다." />
      <Select label="이 앱의 월 API 사용 상한" value={limit} disabled={disabled} onChange={e => setLimit(Number(e.target.value))}>
        {![1_000_000,2_000_000,3_000_000,6_000_000,10_000_000].includes(limit) && <option value={limit}>{dollars(limit)}</option>}
        <option value={1_000_000}>US$1</option><option value={2_000_000}>US$2</option>
        <option value={3_000_000}>US$3</option><option value={6_000_000}>US$6</option><option value={10_000_000}>US$10 (기본)</option>
      </Select>
      <p className="material-hint">호출 전 예상 최대 비용을 예약하고 상한을 넘는 요청은 보내지 않습니다. 집계는 실제 청구액보다 높을 수 있습니다. UTC 기준 매월 초기화하며 키 교체·다시 연결로 집계를 초기화하지 않습니다. 세금·환율 차이와 다른 앱의 API 사용은 이 상한에 포함되지 않습니다.</p>
      <Checkbox checked={confirmed} disabled={disabled} onChange={e => setConfirmed(e.target.checked)}
        label="별도 API 요금과 월 상한을 확인했습니다. 생성 버튼을 누를 때 선택한 자료를 OpenAI로 보냅니다." />
      <div className="material-actions">
        <Button variant="primary" disabled={disabled || !connection || !confirmed || (!billing?.configured && !key.trim())} onClick={() => void save('save')}>API 설정 저장·사용 켜기</Button>
        <Button disabled={working || busy} onClick={async () => {
          setWorking(true); setError('');
          try { setConnection(await localAIStatus(owner)); setNotice('서버의 API 설정을 다시 확인했습니다.'); }
          catch (error) { setError(message(error)); } finally { setWorking(false); }
        }}>사용량 새로고침</Button>
        {billing?.configured && <>
          <Button disabled={disabled || !billing.enabled} onClick={() => void save('pause')}>API 사용 멈추기</Button>
          <Button variant="quiet" disabled={disabled} onClick={() => void save('disconnect')}>API 키 삭제</Button>
        </>}
      </div>
      {notice && <p role="status">{notice}</p>}{error && <ErrorState message={error} />}
    </div>
  </section>;
}
