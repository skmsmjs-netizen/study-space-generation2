import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import App from './App';
import { DEMO_KEY, DemoRepository } from './data/demo-repository';
vi.mock('./data/supabase-client', () => ({
  readServerConfig: () => ({url:'https://example.supabase.co',publishableKey:'sb_publishable_test'}),
  createStudyClient: () => ({auth:{
    onAuthStateChange: (callback: (event:string,session:null)=>void) => {callback('INITIAL_SESSION',null); return {data:{subscription:{unsubscribe(){}}}};},
    getUser: async () => ({data:{user:null},error:null}),
  }}), onlineTransport: vi.fn(),
}));
const nativeLocks=Object.getOwnPropertyDescriptor(navigator,'locks');
beforeEach(() => {localStorage.clear();sessionStorage.clear();history.replaceState(null,'','/#/');Object.defineProperty(navigator,'locks',{configurable:true,value:{request:async (_name:string,_options:unknown,callback:(lock:null)=>unknown)=>callback(null)}});});
afterEach(() => {cleanup();if(nativeLocks)Object.defineProperty(navigator,'locks',nativeLocks);else Reflect.deleteProperty(navigator,'locks');});
it('opens personal entry from a locked demo without changing its data or drafts', async()=>{
  new DemoRepository(localStorage);const raw=localStorage.getItem(DEMO_KEY);localStorage.setItem('study-space:demo:draft:multiple','preserved writing');
  render(<App/>);await screen.findByRole('heading',{name:'시연 자료를 열지 못했습니다'});
  fireEvent.click(screen.getByRole('button',{name:'내 공부 공간'}));await screen.findByRole('textbox',{name:'이메일'});
  expect(localStorage.getItem(DEMO_KEY)).toBe(raw);expect(localStorage.getItem('study-space:demo:draft:multiple')).toBe('preserved writing');
});
it('keeps a directly linked personal entry when remounted after route normalization',async()=>{
  history.replaceState(null,'','/#/account');const view=render(<App/>);await screen.findByRole('textbox',{name:'이메일'});view.unmount();
  render(<App/>);await screen.findByRole('textbox',{name:'이메일'});expect(location.hash).toBe('#/');
});
it('returns email confirmations to personal entry and allows returning to the demo',async()=>{
  history.replaceState(null,'','/?space=personal');render(<App/>);await screen.findByRole('textbox',{name:'이메일'});
  fireEvent.click(screen.getByRole('button',{name:'시연 공간으로 돌아가기'}));await screen.findByRole('heading',{name:'시연 자료를 열지 못했습니다'});expect(location.search).toBe('');
});
