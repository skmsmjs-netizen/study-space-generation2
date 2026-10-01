import type { GPTConnectionStatus } from '../data/study-ai';
import './api-budget-summary.css';

export const apiDollars = (micro: number) => micro > 0 && micro < 100_000
  ? 'US$0.1 미만' : `US$${(micro / 1_000_000).toFixed(1)}`;

/** The saved app budget is separate from the provider's prepaid balance. */
export function APIBudgetSummary({ billing }: { billing: NonNullable<GPTConnectionStatus['billing']> }) {
  const committed = billing.usedMicro + billing.pendingMicro;
  const remaining = Math.max(0, billing.limitMicro - committed);
  const usedShare = Math.min(100, billing.usedMicro / billing.limitMicro * 100);
  const pendingShare = Math.min(100 - usedShare, billing.pendingMicro / billing.limitMicro * 100);
  const remainingPercent = remaining / billing.limitMicro * 100;
  const percentage = remainingPercent > 0 && remainingPercent < 0.1 ? '0.1% 미만' : `${(Math.floor(remainingPercent * 10) / 10).toFixed(1)}%`;
  const rows = [
    { label: '집계된 사용액', value: billing.usedMicro, kind: 'used' },
    { label: '사용량 미확인 예약', value: billing.pendingMicro, kind: 'pending' },
    { label: '남은 월 예산', value: remaining, kind: 'remaining' },
  ];
  return <section className="api-budget" aria-label="이 앱의 월 API 예산">
    <div className="api-budget-heading"><h3>이번 달 API 예산</h3><p>{billing.month.slice(0, 7)} · UTC 기준 · 저장된 월 상한 {apiDollars(billing.limitMicro)}</p></div>
    <div className="api-budget-content">
      <div className="api-budget-ring" role="img" aria-label={`남은 월 예산 ${apiDollars(remaining)}, 상한의 ${percentage}. 집계된 사용액 ${apiDollars(billing.usedMicro)}, 사용량 미확인 예약 ${apiDollars(billing.pendingMicro)}.`}>
        <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
          <circle className="api-budget-remaining" cx="60" cy="60" r="50" />
          {usedShare > 0 && <circle className="api-budget-used" cx="60" cy="60" r="50" pathLength="100" strokeDasharray={`${usedShare} ${100 - usedShare}`} transform="rotate(-90 60 60)" />}
          {pendingShare > 0 && <circle className="api-budget-pending" cx="60" cy="60" r="50" pathLength="100" strokeDasharray={`${pendingShare} ${100 - pendingShare}`} strokeDashoffset={-usedShare} transform="rotate(-90 60 60)" />}
        </svg>
        <div className="api-budget-center" aria-hidden="true"><strong>{percentage}</strong><span>남음</span></div>
      </div>
      <dl className="api-budget-values">{rows.map(row => <div key={row.kind}><dt><span className={`api-budget-swatch api-budget-${row.kind}`} aria-hidden="true" />{row.label}</dt><dd>{apiDollars(row.value)}</dd></div>)}</dl>
    </div>
    {committed >= billing.limitMicro && <p role="status">{committed > billing.limitMicro ? `저장된 상한보다 ${apiDollars(committed - billing.limitMicro)} 많습니다.` : '이번 달 예산을 모두 사용하거나 예약했습니다.'} 새 생성은 남은 예산 안에서만 요청할 수 있습니다.</p>}
    <p className="material-hint">미확인 예약을 빼고 남은 금액입니다. 집계는 실제 청구액보다 높을 수 있으며, OpenAI에 충전한 잔액은 결제·잔액 확인에서 볼 수 있습니다.</p>
  </section>;
}
