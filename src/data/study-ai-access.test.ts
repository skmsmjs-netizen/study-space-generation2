import { afterEach, expect, it, vi } from 'vitest';
import { generateStudyMaterial, connectLocalAI, localAIStatus } from './study-ai';
import { AI_OWNER_USER_ID } from '../domain/ai-access';
afterEach(() => vi.unstubAllGlobals());
it('rejects unauthorized identities before fetching credentials, audio or sending input', async () => {
  const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
  for (const owner of [{userId:'approved-other-admin',namespace:'personal' as const},{userId:AI_OWNER_USER_ID,namespace:'demo' as const}]) {
    await expect(localAIStatus(owner)).rejects.toMatchObject({code:'AI_OWNER_REQUIRED'});
    await expect(connectLocalAI(owner)).rejects.toMatchObject({code:'AI_OWNER_REQUIRED'});
    await expect(generateStudyMaterial(owner,{title:'자료',subjectId:'s',topicId:null,sourceText:'개인 원문',audio:null,results:[]},5)).rejects.toMatchObject({code:'AI_OWNER_REQUIRED'});
  }
  expect(fetch).not.toHaveBeenCalled();
});
