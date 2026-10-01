type Options = { signal: AbortSignal; progress: (message:string)=>void };
type OCRWorker = Awaited<ReturnType<typeof import('tesseract.js')['createWorker']>>;
export const ocrWorkers = new WeakMap<Options, Promise<OCRWorker>>();
export async function recognize(image: Blob | HTMLCanvasElement, options: Options): Promise<string> {
  options.signal.throwIfAborted();
  if (image instanceof Blob && typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(image);
    const pixels = bitmap.width * bitmap.height; bitmap.close();
    if (pixels > 20_000_000) throw Error('사진이 너무 큽니다. 2천만 화소 이내로 줄여 가져와 주세요. 원본은 보관했습니다.');
  }
  let flight = ocrWorkers.get(options);
  if (!flight) {
    flight = (async () => {
      const tesseract = await import('tesseract.js');
      const createWorker = tesseract.createWorker ?? tesseract.default.createWorker;
      const asset = new URL(`${import.meta.env.BASE_URL}material-ocr/`, window.location.origin).href;
      return createWorker('kor+eng', 1, { workerPath: `${asset}worker.min.js`, corePath: asset, langPath: asset, logger: (info: { status: string; progress: number }) => { if (!options.signal.aborted && info.status === 'recognizing text') options.progress(`사진의 글자를 읽고 있습니다 · ${Math.round(info.progress * 100)}%`); } });
    })();
    ocrWorkers.set(options, flight);
  }
  const active = flight;
  let timer: ReturnType<typeof setTimeout>;
  let stop!: () => void;
  const interrupted = new Promise<never>((_, reject) => {
    stop = () => { void active.then(w => w.terminate()).catch(() => undefined); reject(options.signal.reason ?? Error('사진 읽기를 중단했습니다.')); };
    options.signal.addEventListener('abort', stop, { once: true });
    timer = setTimeout(() => { void active.then(w => w.terminate()).catch(() => undefined); reject(Error('사진 읽기가 오래 걸립니다. 원본을 확인하고 다시 읽어 주세요.')); }, 120_000);
    if (options.signal.aborted) stop();
  });
  try { const result = await Promise.race([active.then(worker => worker.recognize(image)), interrupted]); options.signal.throwIfAborted(); return result.data.text; }
  finally { clearTimeout(timer!); options.signal.removeEventListener('abort', stop); }
}
/** Local OCR with a dedicated cancellable worker; recognized text is never applied automatically. */
export async function recognizeInkImage(image: HTMLCanvasElement, signal: AbortSignal, progress: (message:string)=>void): Promise<string> {
 const options: Options={signal,progress};
 try { return await recognize(image,options); }
 finally { const worker=ocrWorkers.get(options); ocrWorkers.delete(options); if(worker) await worker.then(w=>w.terminate()).catch(()=>undefined); }
}
