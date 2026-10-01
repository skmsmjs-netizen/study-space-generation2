import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { APIBudgetSummary } from '../../src/ui/api-budget-summary';
import { Button } from '../../src/ui';
import '../../src/ui/study-materials.css';
const initial = { configured: true, enabled: true, limitMicro: 10_000_000, usedMicro: 2_000_000, pendingMicro: 1_000_000, month: '2026-10-01' };
function Fixture() {
  const [billing, setBilling] = useState(initial);
  return <main><h1>API 예산 표시 확인</h1><p>합성 금액 · 실제 계정이나 유료 API를 사용하지 않습니다.</p>
    <APIBudgetSummary billing={billing} />
    <div className="material-actions">
      <Button onClick={() => setBilling({ ...initial, usedMicro: 3_000_000, pendingMicro: 0 })}>예약 정산</Button>
      <Button onClick={() => setBilling({ ...initial, limitMicro: 1_000_000 })}>낮은 상한</Button>
      <Button onClick={() => setBilling({ ...initial, usedMicro: 0, pendingMicro: 0 })}>사용 전</Button>
    </div>
  </main>;
}
createRoot(document.getElementById('root')!).render(<Fixture />);
