import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import App from './App';
import userEvent from '@testing-library/user-event';
const authCalls = vi.hoisted(() => ({signUp: vi.fn(async () => ({data:{session:null},error:null}))}));
import { DEMO_KEY, DemoRepository } from './data/demo-repository';
vi.mock('./data/supabase-client', () => ({
  readServerConfig: () => ({url:'https://example.supabase.co',publishableKey:'sb_publishable_test'}),
  createStudyClient: () => ({auth:{
    onAuthStateChange: (callback: (event:string,session:null)=>void) => {callback('INITIAL_SESSION',null); return {data:{subscription:{unsubscribe(){}}}};},
    getSession: async () => ({data:{session:null},error:null}), signUp: authCalls.signUp,
  }}), onlineTransport: vi.fn(),
}));
const nativeLocks=Object.getOwnPropertyDescriptor(navigator,'locks');
beforeEach(() => {vi.clearAllMocks();localStorage.clear();sessionStorage.clear();history.replaceState(null,'','/#/');Object.defineProperty(navigator,'locks',{configurable:true,value:{request:async (_name:string,_options:unknown,callback:(lock:null)=>unknown)=>callback(null)}});});
afterEach(() => {cleanup();if(nativeLocks)Object.defineProperty(navigator,'locks',nativeLocks);else Reflect.deleteProperty(navigator,'locks');});
it('opens personal entry from a locked demo without changing its data or drafts', async()=>{
  new DemoRepository(localStorage);const raw=localStorage.getItem(DEMO_KEY);localStorage.setItem('study-space:demo:draft:multiple','preserved writing');
  history.replaceState(null,'','/?space=demo');render(<App/>);await screen.findByRole('heading',{name:'예시 자료를 열지 못했습니다'});
  fireEvent.click(screen.getByRole('button',{name:'내 공부 공간'}));await screen.findByRole('textbox',{name:'이메일'});
  expect(localStorage.getItem(DEMO_KEY)).toBe(raw);expect(localStorage.getItem('study-space:demo:draft:multiple')).toBe('preserved writing');
});
it('keeps a directly linked personal entry when remounted after route normalization',async()=>{
  history.replaceState(null,'','/#/account');const view=render(<App/>);await screen.findByRole('textbox',{name:'이메일'});view.unmount();
  render(<App/>);await screen.findByRole('textbox',{name:'이메일'});expect(location.hash).toBe('#/');
});
it('returns email confirmations to personal entry without exposing an example-space switch',async()=>{
  history.replaceState(null,'','/?space=personal');render(<App/>);await screen.findByRole('textbox',{name:'이메일'});
  expect(screen.queryByRole('button',{name:'시연 공간으로 돌아가기'})).toBeNull();expect(localStorage.getItem(DEMO_KEY)).toBeNull();
});

it('opens signup before credentials are entered and preserves writing when switching modes',async()=>{
  history.replaceState(null,'','/#/account');render(<App/>);await screen.findByRole('textbox',{name:'이메일'});
  expect(screen.getByRole('button',{name:'처음 사용하기'})).toBeEnabled();
  fireEvent.change(screen.getByRole('textbox',{name:'이메일'}),{target:{value:'unfinished'}});
  fireEvent.change(screen.getByLabelText('비밀번호'),{target:{value:'12'}});
  await userEvent.click(screen.getByRole('button',{name:'처음 사용하기'}));
  expect(screen.getByRole('button',{name:'계정 만들기'})).toBeEnabled();expect(screen.getByRole('textbox',{name:'이메일'})).toHaveValue('unfinished');expect(screen.getByLabelText('비밀번호 (6자 이상)')).toHaveValue('12');expect(authCalls.signUp).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole('button',{name:'로그인으로 돌아가기'}));expect(screen.getByLabelText('비밀번호')).toHaveValue('12');
});
it('validates signup fields before invoking auth and explains the email confirmation',async()=>{
  history.replaceState(null,'','/#/account');render(<App/>);await screen.findByRole('textbox',{name:'이메일'});
  await userEvent.click(screen.getByRole('button',{name:'처음 사용하기'}));await userEvent.click(screen.getByRole('button',{name:'계정 만들기'}));expect(authCalls.signUp).not.toHaveBeenCalled();
  fireEvent.change(screen.getByRole('textbox',{name:'이메일'}),{target:{value:'invented@example.invalid'}});fireEvent.change(screen.getByLabelText('비밀번호 (6자 이상)'),{target:{value:'12'}});
  await userEvent.click(screen.getByRole('button',{name:'계정 만들기'}));expect(authCalls.signUp).not.toHaveBeenCalled();
  fireEvent.change(screen.getByLabelText('이름'),{target:{value:'시험 가입자'}});fireEvent.change(screen.getByLabelText('비밀번호 (6자 이상)'),{target:{value:'fake-test-password'}});
  await userEvent.click(screen.getByRole('button',{name:'계정 만들기'}));await screen.findByText('이메일로 받은 확인 링크를 연 뒤 로그인해 주세요.');expect(authCalls.signUp).toHaveBeenCalledTimes(1);expect(authCalls.signUp).toHaveBeenCalledWith(expect.objectContaining({options:expect.objectContaining({data:{display_name:'시험 가입자'}})}));
});

it('explains the live email delivery limit without reporting successful registration',async()=>{
  authCalls.signUp.mockResolvedValueOnce({data:{session:null},error:{code:'over_email_send_rate_limit'}} as never);
  history.replaceState(null,'','/#/account');render(<App/>);await screen.findByRole('textbox',{name:'이메일'});
  await userEvent.click(screen.getByRole('button',{name:'처음 사용하기'}));
  fireEvent.change(screen.getByLabelText('이름'),{target:{value:'시험 가입자'}});fireEvent.change(screen.getByLabelText('이메일'),{target:{value:'trial@example.invalid'}});fireEvent.change(screen.getByLabelText('비밀번호 (6자 이상)'),{target:{value:'trial-password'}});
  await userEvent.click(screen.getByRole('button',{name:'계정 만들기'}));await screen.findByText('가입 확인 메일의 발송 한도에 도달했습니다. 잠시 후 다시 시도해 주세요.');expect(screen.queryByText('이메일로 받은 확인 링크를 연 뒤 로그인해 주세요.')).toBeNull();
});

it.each([null, 'demo', 'personal'])('opens personal entry by default with previous preference %s and preserves existing records',async preference=>{
  new DemoRepository(localStorage);const raw=localStorage.getItem(DEMO_KEY);
  localStorage.setItem('study-space:demo:draft:multiple','  원문\n예외');
  if(preference)sessionStorage.setItem('study-space:active-space',preference);
  render(<App/>);await screen.findByRole('textbox',{name:'이메일'});
  expect(screen.queryByText(/시연|베타|데모|트라이얼|실험적/)).toBeNull();
  expect(localStorage.getItem(DEMO_KEY)).toBe(raw);
  expect(localStorage.getItem('study-space:demo:draft:multiple')).toBe('  원문\n예외');
});
it('does not initialize example records on a new visit or after remounting',async()=>{
  const view=render(<App/>);await screen.findByRole('textbox',{name:'이메일'});
  expect(localStorage.getItem(DEMO_KEY)).toBeNull();view.unmount();
  render(<App/>);await screen.findByRole('textbox',{name:'이메일'});
  expect(localStorage.getItem(DEMO_KEY)).toBeNull();
});
