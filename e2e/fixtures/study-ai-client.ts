import type { AppState } from '../../src/domain/model';
import type { MaterialContent } from '../../src/domain/study-material';
import { generateGPTMaterial } from '../../src/server/gpt-material';
export const CHATGPT_USAGE_URL = '#synthetic-usage';
export async function localAIStatus() {
  return {
    configured: true,
    local: true,
    provider: 'chatgpt',
    model: 'synthetic-model',
    models: [{ slug: 'synthetic-model', displayName: '합성 검증 모델' }],
    session: { status: 'connected', sharing: true },
    creditsConfirmed: true,
    transcription: false,
    connecting: false,
    connectionError: '',
  };
}
export async function connectLocalAI() {
  throw Error('이 검증 화면은 실제 계정에 연결하지 않습니다.');
}
export async function updateGPTConnection() {
  return localAIStatus();
}
export async function fetchYouTubeSubtitles() {
  throw Error('이 검증 화면은 외부 자막을 받지 않습니다.');
}
export async function generateStudyMaterial(
  _owner: Pick<AppState, 'userId' | 'namespace'>,
  content: MaterialContent,
  cardCount: number,
  signal: AbortSignal,
) {
  const request = content.aiRequest ?? { task: 'summary' };
  const result = await generateGPTMaterial(
    { text: content.sourceText, audio: null, audioName: '', cardCount, request },
    {
      model: 'synthetic-model',
      signal,
      runtime: {
        async streamResponse(options) {
          const input = JSON.parse(options.input),
            sourceIds = [input.sourceSegments[0].id];
          localStorage.setItem(
            'synthetic-generation-calls',
            String(Number(localStorage.getItem('synthetic-generation-calls') ?? 0) + 1),
          );
          return {
            text: JSON.stringify({
              summary: request.task === 'questions' ? [] : [
                {
                  text: '합성 수식 보완: \\(V=IR\\). 기호와 저항의 성립 조건을 확인한다.',
                  sourceIds,
                },
              ],
              cards: request.task === 'questions' ? [{ question: '합성 첫 질문', answer: '합성 첫 숨긴 답', sourceIds }, { question: '합성 둘째 질문', answer: '합성 둘째 숨긴 답', sourceIds }] : [],
            }),
          };
        },
      },
    },
  );
  return { ...result, source: { text: content.sourceText, audio: content.audio } };
}
