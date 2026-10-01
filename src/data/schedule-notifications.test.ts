import {beforeEach,expect,it,vi} from 'vitest';
import {PersonalRepository} from './personal-repository';
import {applyCommand} from '../domain/commands';
import {emptyState} from '../domain/model';
const owner='10000000-0000-4000-8000-000000000001';
beforeEach(()=>localStorage.clear());
it('waits for pending schedule storage before subscribing and keeps one stable notification port',async()=>{
 const data=emptyState(owner,'personal'),base={sequence:0,data},subscribe=vi.fn();let release!:()=>void;const gate=new Promise<void>(resolve=>release=resolve);
 const repo=new PersonalRepository(localStorage,{load:async()=>base,execute:async command=>{await gate;return{sequence:1,data:applyCommand(data,command)};},scheduleNotifications:{config:async()=>({publicKey:'key'}),subscribe,unsubscribe:async()=>{},status:async()=>({enabled:false})}},base);
 repo.execute({type:'addSubject',id:'subject',name:'합성 과목',scope:{kind:'independent'},userId:owner,namespace:'personal',at:'2026-10-01T00:00:00Z',opId:'subject'});
 const port=repo.getScheduleNotifications()!;expect(port).toBe(repo.getScheduleNotifications());const pending=port.subscribe({endpoint:'synthetic'});expect(subscribe).not.toHaveBeenCalled();release();await pending;expect(subscribe).toHaveBeenCalledOnce();expect(repo.getStatus().phase).toBe('saved');
});
it('preserves a failed pending write and refuses to claim notification activation',async()=>{
 const data=emptyState(owner,'personal'),base={sequence:0,data},subscribe=vi.fn();
 const repo=new PersonalRepository(localStorage,{load:async()=>base,execute:async()=>{throw Error('offline');},scheduleNotifications:{config:async()=>({publicKey:'key'}),subscribe,unsubscribe:async()=>{},status:async()=>({enabled:false})}},base);
 repo.execute({type:'addSubject',id:'subject',name:'합성 과목',scope:{kind:'independent'},userId:owner,namespace:'personal',at:'2026-10-01T00:00:00Z',opId:'subject'});
 await expect(repo.getScheduleNotifications()!.subscribe({endpoint:'synthetic'})).rejects.toThrow('서버에 저장');expect(subscribe).not.toHaveBeenCalled();expect(repo.getSnapshot().subjects[0].name).toBe('합성 과목');expect(repo.getStatus().pending).toBe(1);
});
