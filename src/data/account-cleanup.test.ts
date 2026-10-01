import {expect,it} from 'vitest';
import {IDBFactory} from 'fake-indexeddb';
import {clearWithdrawnAccount} from './account-cleanup';
it('deletes only the withdrawn owner including legacy draft keys and IndexedDB recovery copies',async()=>{
  localStorage.clear();const id='owner',foreign='other',factory=new IDBFactory();
  const db=await new Promise<IDBDatabase>((resolve,reject)=>{const r=factory.open('study-space-personal-journals',1);r.onupgradeneeded=()=>{r.result.createObjectStore('journals');r.result.createObjectStore('recovery');};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
  await new Promise<void>((resolve,reject)=>{const t=db.transaction(['journals','recovery'],'readwrite');for(const who of [id,foreign]){const key=`study-space:personal:${who}:online:v1`;t.objectStore('journals').put('원문',key);t.objectStore('recovery').put({key,raw:'복구 원문'},who);}t.oncomplete=()=>resolve();t.onabort=()=>reject(t.error);});
  for(const key of ['study-space:personal:owner:online:v1','study-space:personal:owner:draft:a','study-space:personal:draft:quick-memo:owner:a','study-space:personal:draft:topic-recall:owner','study-space:personal:other:draft:a','study-space:demo:draft:a'])localStorage.setItem(key,'보존할 글');
  await clearWithdrawnAccount(id,localStorage,factory);expect(localStorage.length).toBe(2);expect(localStorage.getItem('study-space:personal:other:draft:a')).toBe('보존할 글');expect(localStorage.getItem('study-space:demo:draft:a')).toBe('보존할 글');
  const t=db.transaction(['journals','recovery'],'readonly');const rows=await Promise.all(['journals','recovery'].map(name=>new Promise<any[]>(resolve=>{const r=t.objectStore(name).getAll();r.onsuccess=()=>resolve(r.result);})));expect(rows[0]).toEqual(['원문']);expect(rows[1][0].key).toBe('study-space:personal:other:online:v1');db.close();
});
