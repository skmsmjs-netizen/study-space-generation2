import { env, pipeline, type AutomaticSpeechRecognitionPipeline } from '@huggingface/transformers';
import { TRANSCRIPTION_MODEL, TRANSCRIPTION_REVISION } from '../domain/browser-transcription';

env.allowLocalModels = false;
const wasm = env.backends.onnx.wasm;
if (!wasm) throw Error('WASM inference is unavailable');
wasm.numThreads = 1;
wasm.proxy = false;
let transcriber: Promise<AutomaticSpeechRecognitionPipeline> | undefined;
self.onmessage = async (event: MessageEvent<{ samples: Float32Array }>) => {
  try {
    transcriber ??= pipeline('automatic-speech-recognition', TRANSCRIPTION_MODEL, {
      revision: TRANSCRIPTION_REVISION,
      device: 'wasm',
      dtype: 'q8',
      progress_callback: () => self.postMessage({ type: 'loading' }),
    });
    const output = await (
      await transcriber
    )(event.data.samples, { language: 'korean', task: 'transcribe' });
    const row = Array.isArray(output) ? output[0] : output;
    self.postMessage({ type: 'result', text: row.text });
  } catch {
    // Never return source audio, credentials or internal exception details.
    self.postMessage({
      type: 'error',
      message:
        '이 기기에서 받아쓰기를 마치지 못했습니다. 보관한 구간과 원본은 유지했습니다. 파일을 나누거나 다시 이어 처리해 주세요.',
    });
  }
};
