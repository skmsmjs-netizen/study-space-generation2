import { documentSegments, selectedMaterialDocuments } from '../../src/domain/material-source';
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
export async function configureOpenAIAPI() {
  throw Error('이 검증 화면에서는 실제 API 키를 등록하거나 유료 설정을 바꾸지 않습니다.');
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
    {
      text: content.sourceText,
      audio: null,
      audioName: '',
      cardCount,
      request,
      sourceSegments: documentSegments(content.documents),
    },
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
              summary: ['questions', 'quiz'].includes(request.task)
                ? []
                : [
                    {
                      text: '합성 수식 보완: \\(V=IR\\). 기호와 저항의 성립 조건을 확인한다.',
                      sourceIds,
                    },
                  ],
              ...(['quiz', 'study-pack'].includes(request.task)
                ? {
                    quiz: [
                      {
                        question: '합성 퀴즈 질문',
                        options: ['합성 첫 보기', '합성 둘째 보기'],
                        correctIndex: 0,
                        explanation: '제출 뒤에만 표시할 합성 해설',
                        sourceIds,
                      },
                    ],
                  }
                : {}),
              ...(request.task === 'study-pack'
                ? {
                    map: {
                      nodes: [
                        { id: 'n1', label: '전압', sourceIds },
                        { id: 'n2', label: '전류', sourceIds },
                      ],
                      edges: [
                        {
                          id: 'e1',
                          from: 'n1',
                          to: 'n2',
                          label: '저항이 일정할 때 비례',
                          sourceIds,
                        },
                      ],
                    },
                  }
                : {}),
              cards: ['questions', 'study-pack'].includes(request.task)
                ? [
                    { question: '합성 첫 질문', answer: '합성 첫 숨긴 답', sourceIds },
                    { question: '합성 둘째 질문', answer: '합성 둘째 숨긴 답', sourceIds },
                  ]
                : [],
            }),
          };
        },
      },
    },
  );
  return {
    ...result,
    source: {
      text: content.sourceText,
      audio: null,
      documents: selectedMaterialDocuments(content.documents ?? []),
    },
  };
}
