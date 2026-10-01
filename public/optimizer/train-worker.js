import init, { Fsrs, initThreadPool } from './vendor/fsrs_browser.js';
self.onmessage = async ({ data }) => {
  let fsrs;
  try {
    await init({ module_or_path: new URL('./vendor/fsrs_browser_bg.wasm', import.meta.url) });
    await initThreadPool(2);
    fsrs = new Fsrs();
    const parameters = Array.from(fsrs.computeParameters(new Uint32Array(data.ratings), new Uint32Array(data.deltaTs), new Uint32Array(data.lengths), null, true, null, data.relearningSteps));
    self.postMessage({ type: 'result', parameters });
  } catch (e) { self.postMessage({ type: 'error', error: `계산하지 못했습니다. 기존 설정은 보존했습니다. ${e instanceof Error ? e.message : String(e)}` }); }
  finally { fsrs?.free(); }
};
