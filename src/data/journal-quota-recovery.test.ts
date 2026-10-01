// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { IDBFactory, IDBObjectStore } from 'fake-indexeddb';
import { IndexedPersonalJournal } from './indexed-personal-journal';
import { recoverPersonalJournalQuota, writeLoginStorage } from './journal-quota-recovery';
import { emptyState } from '../domain/model';
import { applyCommand } from '../domain/commands';
import { personalJournalKey } from './personal-repository';
import { claimPersonalWindow } from './personal-window';
const user = 'quota-owner';
function storage(): Storage {
 const data = new Map<string,string>();
 return {getItem:k=>data.get(k)??null,setItem:(k,v)=>{data.set(k,v);},removeItem:k=>{data.delete(k);},clear:()=>data.clear(),key:i=>[...data.keys()][i]??null,get length(){return data.size;}};
}
function envelope() {
 const data=emptyState(user,'personal');
 const pending=[{type:'saveMemo' as const,id:'m',body:'  原文\r\n한글\u0000\ud800  ',ownerId:null,strokes:[],expectedVersion:0,opId:'quota-op',at:'2026-10-01T01:00:00.000Z',userId:user,namespace:'personal' as const}];
 return JSON.stringify({format:1,base:{sequence:0,data},local:applyCommand(data,pending[0]),pending,archives:[]});
}
const root=personalJournalKey({userId:user,namespace:'personal'}), key=`${root}:window:one`;
it('relocates exact originals and outbox, frees space for login, and resumes the DB-only window after losing tab hints',async()=>{
 const local=storage(), session=storage(), factory=new IDBFactory(), raw=envelope();
 local.setItem(key,raw); local.setItem('unrelated','원문'); local.setItem(`${root}:draft:m`,'초안');
 const original=local.setItem;
 vi.spyOn(local,'setItem').mockImplementation((k,v)=>{if(local.getItem(key)!==null&&k.includes('auth'))throw new DOMException('full','QuotaExceededError');original(k,v);});
 vi.stubGlobal('indexedDB',factory);
 try {await writeLoginStorage(local,'study-space:auth:v1:check','1');} finally {vi.unstubAllGlobals();}
 expect(local.getItem(key)).toBeNull(); expect(local.getItem('unrelated')).toBe('원문');expect(local.getItem(`${root}:draft:m`)).toBe('초안');
 const journal=await IndexedPersonalJournal.open(local,key,factory);expect(journal.getItem(key)).toBe(raw);journal.close();
 const locks={request:async(_name:string,_options:unknown,cb:(lock:object)=>Promise<void>)=>cb({})} as unknown as LockManager;
 const window=await claimPersonalWindow(user,local,session,locks,factory);
 expect(window.key).toBe(key);expect(window.cached?.sequence).toBe(0);
 const restored=await IndexedPersonalJournal.open(local,window.key,factory);expect(restored.getItem(window.key)).toBe(raw);restored.close();await window.release();
});
it('retains every legacy original when DB migration aborts',async()=>{
 const local=storage(),factory=new IDBFactory(),raw=envelope();local.setItem(key,raw);
 const spy=vi.spyOn(IDBObjectStore.prototype,'put').mockImplementation(function(this:IDBObjectStore){this.transaction.abort();return {} as IDBRequest;});
 try {await expect(recoverPersonalJournalQuota(local,factory)).rejects.toThrow();expect(local.getItem(key)).toBe(raw);}finally{spy.mockRestore();}
});
it('keeps both different DB and local originals and never removes a legacy edit made while committing',async()=>{
 const local=storage(),factory=new IDBFactory(),raw=envelope();
 const first=await IndexedPersonalJournal.open(local,key,factory);first.setItem(key,'older exact original');await first.flush();first.close();local.setItem(key,raw);
 const originalPut=IDBObjectStore.prototype.put;let changed=false;
 const spy=vi.spyOn(IDBObjectStore.prototype,'put').mockImplementation(function(this:IDBObjectStore,...args){const request=originalPut.apply(this,args);if(this.name==='journals'&&!changed){changed=true;local.setItem(key,'newer concurrent original');}return request;});
 try {expect(await recoverPersonalJournalQuota(local,factory)).toBe(0);}finally{spy.mockRestore();}
 expect(local.getItem(key)).toBe('newer concurrent original');
 const next=await IndexedPersonalJournal.open(local,key,factory);expect(next.getRecoveryCopies()).toEqual([expect.objectContaining({raw:'older exact original'})]);next.close();
});
it('skips active writers, damaged or unknown journals, auth keys and drafts',async()=>{
 const local=storage(),factory=new IDBFactory();local.setItem(key,envelope());local.setItem(root,'damaged');local.setItem(`${root}:draft:m`,'草稿');local.setItem('study-space:auth:v1','token');
 const before=Array.from({length:local.length},(_,i)=>[local.key(i),local.getItem(local.key(i)!)]);
 const locks={request:async(_name:string,_options:unknown,cb:(lock:null)=>Promise<void>)=>cb(null)} as unknown as LockManager;
 expect(await recoverPersonalJournalQuota(local,factory,locks)).toBe(0);
 expect(Array.from({length:local.length},(_,i)=>[local.key(i),local.getItem(local.key(i)!)])).toEqual(before);
});

it('does not relocate a damaged concurrent edit that replaced the validated original while opening the DB',async()=>{
 const local=storage(),factory=new IDBFactory(),raw=envelope();local.setItem(key,raw);
 const originalGet=IDBObjectStore.prototype.get;let changed=false;
 const spy=vi.spyOn(IDBObjectStore.prototype,'get').mockImplementation(function(this:IDBObjectStore,...args){const request=originalGet.apply(this,args);if(this.name==='journals'&&!changed){changed=true;local.setItem(key,'damaged concurrent original');}return request;});
 try {expect(await recoverPersonalJournalQuota(local,factory)).toBe(0);}finally{spy.mockRestore();}
 expect(local.getItem(key)).toBe('damaged concurrent original');
});
