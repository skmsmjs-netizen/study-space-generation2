import {beforeEach,expect,it} from 'vitest';
import {inkSync} from './ink-sync';
import {applyCommand} from '../domain/commands';
import type {AppState,Command} from '../domain/model';
const empty=():AppState=>({schemaVersion:1,userId:'owner',namespace:'test',semesters:[],subjects:[],nodes:[],sessions:[],records:[],narratives:[],revisions:[],appliedOps:{}});
const content={kind:'preferences' as const,value:{ink:'blue' as const,width:5,finger:false,pressure:true}};
beforeEach(()=>localStorage.clear());
it('restores settings in a fresh device through the canonical journal and rejects stale editors',()=>{
 let state=empty();const repository={getSnapshot:()=>state,execute:(command:Command)=>(state=applyCommand(state,command))};
 const first=inkSync(repository);expect(first.read('settings')).toBeNull();first.save('settings',content);
 const second=inkSync(repository);expect(second.read('settings')).toEqual(content);
 const unchanged=state;second.save('settings',content);expect(state).toBe(unchanged);
 first.save('settings',{...content,value:{...content.value,width:3}});
 expect(()=>second.save('settings',{...content,value:{...content.value,width:8}})).toThrow();
 expect(localStorage.getItem('settings:ink-sync-pending')).toBe('1');
 const reopened=inkSync(repository);expect(reopened.read('settings')).toBeNull();
 expect(()=>reopened.save('settings',content)).toThrow();
 expect(state.inkWorkspaces![0].content.value).toEqual({...content.value,width:3});
});
it('does not accept foreign owner commands or malformed histories',()=>{
 const base=empty();const cmd:Command={type:'saveInkWorkspace',id:'settings',key:'key',content,expectedVersion:0,userId:'foreign',namespace:'test',opId:'op',at:new Date().toISOString()};
 expect(()=>applyCommand(base,cmd)).toThrow();
 expect(()=>applyCommand(base,{...cmd,userId:'owner',content:{kind:'document',value:{page:0,pages:1,zoom:1,undo:[null as never],redo:[],fingerprint:'x'}}})).toThrow();
 expect(base.inkWorkspaces).toBeUndefined();
});
