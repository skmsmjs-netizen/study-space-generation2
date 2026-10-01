// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { generateGPTMaterial } from './gpt-material';
import { handleStudyAI } from './study-ai';
import { AI_OWNER_USER_ID } from '../domain/ai-access';
const segment = { id: 'doc:page:0', label: '합성.pdf · 3쪽', text: '저항이 일정한 경우 V=IR이다.', start: null, end: null };
const q = { question: '어떤 조건인가?', options: ['저항이 일정함', '아무 조건 없음'], correctIndex: 0, explanation: '자료에 저항이 일정한 경우라고 제시했다.', sourceIds: [segment.id] };
it('carries actual document segments and dialogue data through grounded quiz, map and tutor generation, rejecting invented grounding', async () => {
  const runtime = { streamResponse: vi.fn(async () => ({ text: JSON.stringify({ summary: [], cards: [], quiz: [q] }) })) };
  const input = { text: '', audio: null, audioName: '', cardCount: 1, sourceSegments: [segment], request: { task: 'quiz' as const } };
  const result = await generateGPTMaterial(input, { runtime, model: 'synthetic' }); expect(result.quiz?.[0].correctIndex).toBe(0); expect(result.segments[0].label).toBe(segment.label);
  runtime.streamResponse.mockResolvedValue({ text: JSON.stringify({ summary: [], cards: [], map: { nodes: [{ id: 'n', label: '저항', sourceIds: [segment.id] }], edges: [] } }) });
  expect((await generateGPTMaterial({ ...input, request: { task: 'mindmap' } }, { runtime, model: 'synthetic' })).map?.nodes).toHaveLength(1);
  runtime.streamResponse.mockResolvedValue({ text: JSON.stringify({ summary: [{ text: '같은 조건을 가정합니다.', sourceIds: [segment.id] }], cards: [] }) });
  await generateGPTMaterial({ ...input, request: { task: 'tutor', focus: '왜 일정해야 하나?', history: [{ question: '앞 질문', answer: '이전 답' }] } }, { runtime, model: 'synthetic' });
  expect(JSON.parse((runtime.streamResponse.mock.calls.at(-1) as unknown as [{ input: string }])[0].input).history[0].question).toBe('앞 질문');
  runtime.streamResponse.mockResolvedValue({ text: JSON.stringify({ summary: [], cards: [], quiz: [{ ...q, sourceIds: ['invented'] }] }) });
  await expect(generateGPTMaterial(input, { runtime, model: 'synthetic' })).rejects.toThrow();
});
it('validates selected source size before reserving or calling a model and allows document-only multipart input', async () => {
  const form = new FormData(); form.set('userId', AI_OWNER_USER_ID); form.set('namespace', 'personal'); form.set('textJSON', '""'); form.set('segmentsJSON', JSON.stringify([segment])); form.set('cardCount', '1');
  const backend = { authorize: async () => ({ userId: AI_OWNER_USER_ID, namespace: 'personal' }), reserve: vi.fn(async () => {}), generate: vi.fn(async () => ({ id: 'r', at: new Date().toISOString(), model: 'test', segments: [segment], summary: [], cards: [] })) };
  const request = () => new Request('http://test/api', { method: 'POST', body: form });
  expect((await handleStudyAI(request(), backend)).status).toBe(200);
  backend.reserve.mockClear(); backend.generate.mockClear(); form.set('segmentsJSON', JSON.stringify([{ ...segment, text: 'x'.repeat(150001) }]));
  expect((await handleStudyAI(request(), backend)).status).toBe(400); expect(backend.reserve).not.toHaveBeenCalled(); expect(backend.generate).not.toHaveBeenCalled();
});
it('rejects a tutor answer citing only the question and bounds extra inputs before reserving a request', async()=>{
 const runtime={streamResponse:vi.fn(async()=>({text:JSON.stringify({summary:[{text:'질문을 근거로 한 답',sourceIds:['request-focus']}],cards:[]})}))};
 await expect(generateGPTMaterial({text:'',audio:null,audioName:'',cardCount:1,sourceSegments:[segment],request:{task:'tutor',focus:'왜?'}},{runtime,model:'synthetic'})).rejects.toThrow('원문 근거');
 const form=new FormData();form.set('userId',AI_OWNER_USER_ID);form.set('namespace','personal');form.set('textJSON',JSON.stringify('x'.repeat(149990)));form.set('cardCount','1');form.set('requestJSON',JSON.stringify({task:'tutor',focus:'y'.repeat(30)}));
 const backend={authorize:async()=>({userId:AI_OWNER_USER_ID,namespace:'personal'}),reserve:vi.fn(async()=>{}),generate:vi.fn()};
 expect((await handleStudyAI(new Request('http://test/api',{method:'POST',body:form}),backend)).status).toBe(400);expect(backend.reserve).not.toHaveBeenCalled();expect(backend.generate).not.toHaveBeenCalled();
});
