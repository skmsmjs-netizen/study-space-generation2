import { expect, it, vi, beforeEach } from 'vitest';
import { render,screen,fireEvent,waitFor } from '@testing-library/react';
import { GPTConnectionPanel } from './gpt-connection-panel';
import { AI_OWNER_USER_ID } from '../domain/ai-access';
import { configureOpenAIAPI, localAIStatus } from '../data/study-ai';
vi.mock('../data/study-ai',()=>({configureOpenAIAPI:vi.fn(),localAIStatus:vi.fn()}));
const status={configured:false,local:false,provider:'openai-api' as const,model:'gpt-6-luna',models:[],session:{status:'disconnected',sharing:false},creditsConfirmed:false,transcription:false,connecting:false,connectionError:'',billing:{configured:false,enabled:false,limitMicro:10_000_000,usedMicro:0,pendingMicro:0,month:'2026-10-01'}};
beforeEach(()=>{vi.mocked(localAIStatus).mockReset().mockResolvedValue(status);vi.mocked(configureOpenAIAPI).mockReset().mockResolvedValue();localStorage.clear();});
it('has a cheap default, never saves on load, and sends a key only on explicit confirmed registration without local persistence',async()=>{
  render(<GPTConnectionPanel userId={AI_OWNER_USER_ID}/>);await screen.findByText(/API 키가 필요합니다/);
  expect(configureOpenAIAPI).not.toHaveBeenCalled();const input=screen.getByLabelText('OpenAI API 키');expect(input).toHaveAttribute('type','password');
  fireEvent.change(input,{target:{value:'sk-synthetic-key-do-not-use'}});
  const save=screen.getByRole('button',{name:'API 설정 저장·사용 켜기'});expect(save).toBeDisabled();
  fireEvent.click(screen.getByRole('checkbox'));fireEvent.click(save);
  await waitFor(()=>expect(configureOpenAIAPI).toHaveBeenCalledWith({userId:AI_OWNER_USER_ID,namespace:'personal'},{key:'sk-synthetic-key-do-not-use',limitMicro:10_000_000,enabled:true,confirmPaid:true,disconnect:false}));
  await waitFor(()=>expect(input).toHaveValue(''));expect(JSON.stringify(localStorage)).not.toContain('sk-synthetic');
});
it('preserves the saved cap and spending when pausing without replacing or requiring a key',async()=>{
  vi.mocked(localAIStatus).mockResolvedValue({...status,configured:true,billing:{...status.billing,configured:true,enabled:true,limitMicro:1_000_000,usedMicro:900_000}});
  render(<GPTConnectionPanel userId={AI_OWNER_USER_ID}/>);const pause=await screen.findByRole('button',{name:'API 사용 멈추기'});
  expect(screen.getByRole('combobox',{name:'이 앱의 월 API 사용 상한'})).toHaveValue('1000000');fireEvent.click(pause);
  await waitFor(()=>expect(configureOpenAIAPI).toHaveBeenCalledWith(expect.anything(),{limitMicro:1_000_000,enabled:false,confirmPaid:true,disconnect:false}));
});
it('hides key controls for other identities and clears input after a failed settings save',async()=>{
  const v=render(<GPTConnectionPanel userId="other"/>);expect(localAIStatus).not.toHaveBeenCalled();expect(screen.queryByLabelText('OpenAI API 키')).toBeNull();v.unmount();
  vi.mocked(configureOpenAIAPI).mockRejectedValueOnce(Error('합성 서버 실패'));render(<GPTConnectionPanel userId={AI_OWNER_USER_ID}/>);await screen.findByText(/API 키가 필요합니다/);
  const input=screen.getByLabelText('OpenAI API 키');fireEvent.change(input,{target:{value:'sk-synthetic-key-do-not-use'}});fireEvent.click(screen.getByRole('checkbox'));fireEvent.click(screen.getByRole('button',{name:'API 설정 저장·사용 켜기'}));
  await screen.findByText('합성 서버 실패');expect(input).toHaveValue('');
});

it('saves the amount displayed by a lower budget choice rather than the default monthly cap',async()=>{
  render(<GPTConnectionPanel userId={AI_OWNER_USER_ID}/>);await screen.findByText(/API 키가 필요합니다/);
  const select=screen.getByRole('combobox',{name:'이 앱의 월 API 사용 상한'});
  expect(select).toHaveValue('10000000');expect(screen.getByRole('option',{name:'US$10 (기본)'})).toHaveProperty('selected',true);
  fireEvent.change(select,{target:{value:'3000000'}});expect(screen.getByRole('option',{name:/^US\$3$/})).toHaveProperty('selected',true);
  fireEvent.change(screen.getByLabelText('OpenAI API 키'),{target:{value:'sk-synthetic-key-do-not-use'}});fireEvent.click(screen.getByRole('checkbox'));fireEvent.click(screen.getByRole('button',{name:'API 설정 저장·사용 켜기'}));
  await waitFor(()=>expect(configureOpenAIAPI).toHaveBeenCalledWith(expect.anything(),expect.objectContaining({limitMicro:3000000})));
});
