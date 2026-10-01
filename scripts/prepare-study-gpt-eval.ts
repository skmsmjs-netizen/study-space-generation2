import { readFile, writeFile } from 'node:fs/promises';
import { generateGPTMaterial } from '../src/server/gpt-material.ts';
import { generateGPTTopicMemory } from '../src/server/gpt-topic-memory.ts';
import { STUDY_GPT_PROMPT_VERSION } from '../src/server/study-gpt-prompt.ts';

/** Prepares exact application requests offline; never imports credentials or a provider. */
const args = process.argv.slice(2);
const output = args[args.indexOf('--out') + 1];
if (!args.includes('--out') || !output || output.startsWith('--'))
  throw Error('출력 경로를 --out으로 지정해 주세요. 실제 GPT는 호출하지 않습니다.');
const casesFile = args.includes('--cases')
  ? args[args.indexOf('--cases') + 1]
  : 'docs/study-gpt-eval-cases.json';
const cases = JSON.parse(await readFile(casesFile, 'utf8'));
const requests: unknown[] = [];
for (const row of cases) {
  const runtime = {
    async streamResponse(request: { input: string; instructions: string }) {
      requests.push({
        caseId: row.id,
        promptVersion: STUDY_GPT_PROMPT_VERSION,
        request,
        manualChecks: row.manualChecks,
        providerExecution: 'not-run',
        semanticVerdict: 'unassessed',
      });
      if (row.kind === 'topic')
        return {
          text: JSON.stringify({
            cards: [
              { topicId: row.input.topics[0].id, question: '합성 질문', answer: '합성 기준' },
            ],
          }),
        };
      const input = JSON.parse(request.input);
      const sourceIds = [input.sourceSegments[0].id];
      const task = row.input.request?.task;
      return {
        text: JSON.stringify({
          summary:
            task === 'quiz'
              ? []
              : [
                  {
                    text: '오프라인 준비용 합성 결과; 실제 모델 평가 아님',
                    sourceIds: [input.sourceSegments[0].id],
                  },
                ],
          cards: [],
          ...(task === 'quiz'
            ? {
                quiz: [
                  {
                    question: '합성 질문',
                    options: ['첫 보기', '다른 보기'],
                    correctIndex: 0,
                    explanation: '합성 기준',
                    sourceIds,
                  },
                ],
              }
            : {}),
          ...(task === 'mindmap'
            ? { map: { nodes: [{ id: 'n1', label: '합성 개념', sourceIds }], edges: [] } }
            : {}),
        }),
      };
    },
  };
  if (row.kind === 'topic')
    await generateGPTTopicMemory(row.input, { runtime, model: 'unselected-real-model' });
  else await generateGPTMaterial(row.input, { runtime, model: 'unselected-real-model' });
}
await writeFile(output, requests.map((row) => JSON.stringify(row)).join('\n') + '\n', {
  flag: 'wx',
});
process.stdout.write(
  `${requests.length}개 앱 요청을 오프라인 준비했습니다. 실제 모델 실행·내용 평가는 미실행입니다.\n`,
);
