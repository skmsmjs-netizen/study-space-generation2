import initSqlJs from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { readAnkiPackage } from './anki-package';
self.onmessage = async ({ data }: MessageEvent<ArrayBuffer>) => {
  try { const SQL = await initSqlJs({ locateFile: () => wasmUrl }); self.postMessage({ type: 'result', result: readAnkiPackage(new Uint8Array(data), SQL) }); }
  catch (e) { self.postMessage({ type: 'error', error: e instanceof Error ? e.message : 'Anki 파일을 읽지 못했습니다.' }); }
};
