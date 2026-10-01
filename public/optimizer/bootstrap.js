const status = document.getElementById('status');
const token = location.hash.slice(1);
if (!/^[0-9a-f-]{36}$/.test(token)) throw Error('계산 창을 복습 설정에서 열어 주세요.');
const channel = new BroadcastChannel(`recall-optimizer:${token}`);
let worker, completed = false, isolating = false;
const cancel = () => { completed = true; worker?.terminate(); channel.postMessage({ type: 'cancelled' }); channel.close(); window.close(); };
document.getElementById('cancel').onclick = cancel;
window.addEventListener('pagehide', () => { if (!completed && !isolating) channel.postMessage({ type: 'cancelled' }); worker?.terminate(); channel.close(); });
channel.onmessage = async ({ data }) => {
  if (data.type === 'cancel') { cancel(); return; }
  if (data.type !== 'input' || worker) return;
  status.textContent = `날짜를 달리한 복습 ${data.payload.lengths.length}건으로 FSRS 설정을 계산합니다. 이 창을 닫으면 계산을 중단합니다.`;
  worker = new Worker('./train-worker.js', { type: 'module' });
  worker.onmessage = ({ data }) => {
    completed = true; channel.postMessage(data);
    status.textContent = data.type === 'result' ? '계산이 끝났습니다. 공부 화면의 복습 설정에서 결과를 적용해 주세요.' : data.error;
    document.getElementById('cancel').textContent = '닫기';
    document.getElementById('cancel').onclick = () => { channel.close(); worker.terminate(); window.close(); };
  };
  worker.onerror = () => { completed = true; status.textContent = '계산 중 오류가 발생했습니다. 기존 설정은 보존했습니다.'; channel.postMessage({ type: 'error', error: status.textContent }); };
  worker.postMessage(data.payload);
};
try {
  if (!crossOriginIsolated) {
    if (!('serviceWorker' in navigator) || sessionStorage.getItem('recall-isolation-retry') === token) throw Error('이 브라우저에서 계산 환경을 열지 못했습니다. 다른 최신 브라우저에서 다시 시도해 주세요.');
    sessionStorage.setItem('recall-isolation-retry', token);
    await navigator.serviceWorker.register('./isolation-worker.js', { scope: './' });
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
    isolating = true; location.reload();
  } else { sessionStorage.removeItem('recall-isolation-retry'); status.textContent = '계산 준비를 마쳤습니다. 공부 화면에서 보낸 이력으로 계산을 시작합니다.'; channel.postMessage({ type: 'ready' }); }
} catch (e) { completed = true; status.textContent = e.message; channel.postMessage({ type: 'error', error: e.message }); }
