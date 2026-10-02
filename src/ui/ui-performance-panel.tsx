import { useState, useSyncExternalStore } from 'react';
import {
  clearUiPerformance,
  readUiPerformance,
  subscribeUiPerformance,
  UI_MEASURE_PHASES,
} from '../data/ui-performance';
import {
  clearRequestPerformance,
  readRequestPerformance,
  type RequestSample,
} from '../data/request-performance';
import { Button } from './index';

const names = {
  'input-paint': '입력 → 표시 기회',
  'search-results': '검색 → 결과 표시',
  'history-render': '이력 펼치기 → 표시',
  'route-render': '화면 이동 → 표시',
};
const requestNames = {
  'sync-load': '서버 불러오기',
  'sync-execute': '서버 저장',
  'sync-batch': '서버 묶음 저장',
  'local-command': '기기 명령 처리',
  'local-journal': '기기 원장 저장',
};
function summarize(values: readonly { durationMs: number; success: boolean }[]) {
  const durations = values
    .filter((row) => row.success)
    .map((row) => row.durationMs)
    .sort((a, b) => a - b);
  const middle = Math.floor(durations.length / 2);
  const median =
    durations.length % 2 ? durations[middle] : (durations[middle - 1] + durations[middle]) / 2;
  return `${values.length}회 · 완료 ${durations.length}회 · 중앙 ${durations.length ? `${Math.round(median)}ms` : '측정 없음'} · 최대 ${durations.length ? `${Math.round(durations[durations.length - 1])}ms` : '측정 없음'}`;
}
export function UiPerformancePanel() {
  const samples = useSyncExternalStore(
    subscribeUiPerformance,
    readUiPerformance,
    readUiPerformance,
  );
  const [requests, setRequests] = useState<RequestSample[]>(readRequestPerformance);
  const [notice, setNotice] = useState('');
  const refresh = () => {
    setRequests(readRequestPerformance());
    setNotice('이 창의 최근 측정값을 불러왔습니다.');
  };
  const download = () => {
    let url = '';
    try {
      const body = {
        format: 'study-ui-performance-v1',
        scope: 'current-tab-session',
        ui: readUiPerformance(),
        requests: readRequestPerformance(),
      };
      url = URL.createObjectURL(
        new Blob([JSON.stringify(body, null, 2)], { type: 'application/json' }),
      );
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'study-ui-performance.json';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      const retained = url;
      setTimeout(() => URL.revokeObjectURL(retained), 1000);
      setNotice('측정값 파일을 내려받도록 요청했습니다.');
    } catch {
      if (url) URL.revokeObjectURL(url);
      setNotice('파일을 만들지 못했습니다. 측정값은 이 창에 남아 있습니다.');
    }
  };
  return (
    <section aria-label="이 창의 반응 속도">
      <h2>이 창의 반응 속도</h2>
      <p>
        최근 화면 측정과 저장 요청을 각각 120개까지 이 창에만 보관합니다. 글·계정·자료 이름·주소는
        담지 않으며 자동 전송하지 않습니다. 새로고침하면 비워집니다.
      </p>
      <p className="muted">
        앱 동작 사이의 시간입니다. 서버 저장 성공·실제 기기 전체의 속도나 표준 INP·LCP·CLS 측정과는
        구별합니다. 숨긴 창에서는 표시 측정이 늦어질 수 있습니다.
      </p>
      <dl>
        {UI_MEASURE_PHASES.map((phase) => (
          <div key={phase}>
            <dt>{names[phase]}</dt>
            <dd>{summarize(samples.filter((row) => row.phase === phase))}</dd>
          </div>
        ))}
      </dl>
      <details>
        <summary>저장·불러오기 요청 측정</summary>
        <dl>
          {Object.entries(requestNames).map(([phase, label]) => (
            <div key={phase}>
              <dt>{label}</dt>
              <dd>{summarize(requests.filter((row) => row.phase === phase))}</dd>
            </div>
          ))}
        </dl>
      </details>
      <div className="actions">
        <Button onClick={refresh}>측정값 새로고침</Button>
        <Button onClick={download}>측정값 JSON 내려받기</Button>
        <Button
          variant="quiet"
          onClick={() => {
            clearUiPerformance();
            clearRequestPerformance();
            setRequests([]);
            setNotice('측정값만 비웠습니다. 공부 기록은 유지됩니다.');
          }}
        >
          측정값 비우기
        </Button>
      </div>
      {notice && <p role="status">{notice}</p>}
    </section>
  );
}
