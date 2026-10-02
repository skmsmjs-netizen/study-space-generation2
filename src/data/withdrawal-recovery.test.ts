import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { accountAccessClient } from './account-access';
import { pendingWithdrawals, saveWithdrawalReceipt, forgetWithdrawalReceipt } from './withdrawal-recovery';

const owner='a0000000-0000-4000-8000-000000000001',other='a0000000-0000-4000-8000-000000000002';
const session=(id=owner)=>({data:{session:{access_token:'test-token',user:{id}}},error:null});
const fixture=()=>{const invoke=vi.fn(),getSession=vi.fn().mockResolvedValue(session());return{invoke,getSession,client:{auth:{getSession},functions:{invoke}} as unknown as SupabaseClient};};
beforeEach(()=>localStorage.clear());afterEach(()=>vi.unstubAllGlobals());
it('waits for all pending batches and retains the receipt until browser cleanup succeeds',async()=>{
  const f=fixture();let calls=0;
  f.invoke.mockImplementation(async(_name,options)=>({data:{withdrawn:++calls===3,requestId:options.body.requestId},error:null}));
  await accountAccessClient(f.client).withdraw!();expect(f.invoke).toHaveBeenCalledTimes(3);
  expect(pendingWithdrawals()).toHaveLength(1);
  expect(new Set(f.invoke.mock.calls.map(call=>call[1].body.requestId)).size).toBe(1);
  forgetWithdrawalReceipt(owner);expect(pendingWithdrawals()).toHaveLength(0);
});
it('resumes with the saved identity after reload rather than creating a new receipt',async()=>{
  const requestId='b0000000-0000-4000-8000-000000000001';saveWithdrawalReceipt({userId:owner,requestId});
  const f=fixture();f.invoke.mockResolvedValue({data:{withdrawn:true,requestId},error:null});
  await accountAccessClient(f.client).withdraw!();expect(f.invoke.mock.calls[0][1].body.requestId).toBe(requestId);
});
it('does not send irreversible requests when receipt storage fails',async()=>{
  const f=fixture();const blocked=vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw Error('quota');});
  await expect(accountAccessClient(f.client).withdraw!()).rejects.toThrow('quota');expect(f.invoke).not.toHaveBeenCalled();blocked.mockRestore();
});
it('recovers only a confirmed completed deletion after the final response is lost',async()=>{
  const f=fixture();f.invoke.mockRejectedValue(new TypeError('lost response'));
  const fetcher=vi.fn().mockResolvedValue(Response.json({withdrawn:true}));vi.stubGlobal('fetch',fetcher);
  await accountAccessClient(f.client).withdraw!();expect(pendingWithdrawals()).toHaveLength(1);
  expect(fetcher.mock.calls[0][1].headers).not.toHaveProperty('Authorization');
  fetcher.mockResolvedValue(Response.json({withdrawn:false}));
  await expect(accountAccessClient(f.client).withdraw!()).rejects.toThrow();expect(pendingWithdrawals()).toHaveLength(1);
});
it('pins every continuation to the initiating account when login changes between batches',async()=>{
  const f=fixture();let switched=false;
  f.getSession.mockImplementation(async()=>session(switched?other:owner));
  f.invoke.mockImplementation(async(_name,options)=>{queueMicrotask(()=>{switched=true;});return{data:{withdrawn:false,requestId:options.body.requestId},error:null};});
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue(Response.json({withdrawn:false})));
  await expect(accountAccessClient(f.client).withdraw!()).rejects.toMatchObject({code:'OWNERSHIP'});
  expect(f.invoke).toHaveBeenCalledTimes(1);expect(pendingWithdrawals()[0].userId).toBe(owner);
});
