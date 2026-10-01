// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { PersonalRepository, readCachedPersonalSnapshot, type OnlineTransport } from './personal-repository';
import { applyCommand } from '../domain/commands';
import { emptyState, type Command } from '../domain/model';
const id='10000000-0000-4000-8000-000000000001';
const op=(name: string) => ({type:'addSubject', id:name, name:'  원문\r\n'+name, scope:{kind:'independent'}, opId:name, userId:id, namespace:'personal', at:'2026-10-01T01:00:00Z'} as Command);
function storage() { const rows=new Map<string,string>(); return {getItem:(k:string)=>rows.get(k)??null,setItem:vi.fn((k:string,v:string)=>{rows.set(k,v)})}; }
function fixture() { let server={sequence:0,data:emptyState(id,'personal')}; const transport:OnlineTransport={load:vi.fn(async()=>server),execute:vi.fn(async(command,seq)=>{expect(seq).toBe(server.sequence);server={sequence:seq+1,data:applyCommand(server.data,command)};return server})}; return {transport,get:()=>server}; }
function deferred<T>() { let resolve!:(value:T)=>void; const promise=new Promise<T>(done=>{resolve=done});return {promise,resolve}; }
it('shows cached originals before the server responds and never calls them server-saved', async()=>{
 const store=storage(),f=fixture(),seed=new PersonalRepository(store,f.transport,f.get());seed.execute(op('cached'));await seed.flush();
 const wait=deferred<ReturnType<typeof f.get>>();f.transport.load=vi.fn(()=>wait.promise);
 const cached=readCachedPersonalSnapshot(store,id)!; const repo=new PersonalRepository(store,f.transport,cached,true);const flight=repo.flush();
 expect(repo.getSnapshot().subjects[0].name).toBe('원문\r\ncached');expect(repo.getStatus().phase).toBe('checking');
 wait.resolve(f.get());await flight;expect(repo.getStatus().phase).toBe('saved');
});
it('does not overwrite an edit made during a delayed refresh, and coalesces reads',async()=>{
 const store=storage(),f=fixture(),repo=new PersonalRepository(store,f.transport,f.get());const wait=deferred<ReturnType<typeof f.get>>();f.transport.load=vi.fn(()=>wait.promise);
 const refresh=repo.refresh();await Promise.resolve();repo.execute(op('typed-during-load'));const second=repo.refresh();expect(second).toBe(refresh);
 wait.resolve(f.get());await refresh;expect(repo.getSnapshot().subjects[0].name).toBe('원문\r\ntyped-during-load');expect(f.get().sequence).toBe(1);expect(f.transport.load).toHaveBeenCalledTimes(1);
});
it('preserves both originals when another device changed while a local edit was made',async()=>{
 const store=storage(),f=fixture(),repo=new PersonalRepository(store,f.transport,f.get());const wait=deferred<ReturnType<typeof f.get>>();f.transport.load=vi.fn(()=>wait.promise);
 const refresh=repo.refresh();await Promise.resolve();repo.execute(op('local'));await f.transport.execute(op('remote'),0);wait.resolve(f.get());await refresh;
 expect(repo.getStatus().phase).toBe('conflict');expect(repo.getSnapshot().subjects[0].id).toBe('local');expect(repo.getConflict()?.server.data.subjects[0].id).toBe('remote');expect(repo.exportPreserved()).toContain('local');
});
it('keeps unchanged snapshots stable without rewriting storage or notifying listeners',async()=>{
 const store=storage(),f=fixture(),repo=new PersonalRepository(store,f.transport,f.get()),snapshot=repo.getSnapshot(),listener=vi.fn();repo.subscribe(listener);store.setItem.mockClear();
 await repo.refresh();await repo.refresh();expect(repo.getSnapshot()).toBe(snapshot);expect(store.setItem).not.toHaveBeenCalled();expect(listener).not.toHaveBeenCalled();
});
it('publishes successive remote changes even when the status text stays the same',async()=>{
 const f=fixture(),repo=new PersonalRepository(storage(),f.transport,f.get()),listener=vi.fn();repo.subscribe(listener);
 await f.transport.execute(op('remote-one'),0);await repo.refresh();await f.transport.execute(op('remote-two'),1);await repo.refresh();expect(listener).toHaveBeenCalledTimes(2);expect(repo.getSnapshot().subjects).toHaveLength(2);
});
it('rejects damaged or cross-owner caches without overwriting the original',()=>{
 const store=storage(),key=`study-space:personal:${id}:online:v1`;store.setItem(key,'broken original');expect(()=>readCachedPersonalSnapshot(store,id)).toThrow();expect(store.getItem(key)).toBe('broken original');
 store.setItem(key,JSON.stringify({format:1,base:{sequence:0,data:emptyState('other','personal')},pending:[],archives:[]}));expect(()=>readCachedPersonalSnapshot(store,id)).toThrow();
});
it('retains a failed startup cache and its pending edits until connectivity returns',async()=>{
 const store=storage(),f=fixture(),seed=new PersonalRepository(store,{...f.transport,execute:async()=>{throw Error('offline')}},f.get());seed.execute(op('offline-original'));await seed.flush();
 const transport={...f.transport,load:vi.fn<OnlineTransport['load']>(async()=>{throw Error('offline')})},repo=new PersonalRepository(store,transport,readCachedPersonalSnapshot(store,id)!,true);await repo.flush();expect(repo.getStatus().phase).toBe('error');expect(repo.getStatus().pending).toBe(1);
 transport.load.mockImplementation(f.transport.load);await repo.refresh();expect(f.get().data.subjects[0].name).toBe('원문\r\noffline-original');expect(repo.getStatus().pending).toBe(0);
});
