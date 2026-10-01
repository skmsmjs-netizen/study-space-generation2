/** Delete only the explicitly withdrawn owner's copies on this browser. */
export async function clearWithdrawnAccount(userId: string, storage: Storage = localStorage, factory: IDBFactory | undefined = globalThis.indexedDB) {
  const owner = encodeURIComponent(userId);
  const prefixes = [`study-space:personal:${owner}:`, `study-space:test:${owner}:`];
  const exact = [`study-space:personal:draft:topic-recall:${owner}`, `study-space:test:draft:topic-recall:${owner}`];
  const owns = (key: string) => prefixes.some(prefix => key.startsWith(prefix)) || exact.includes(key) || ['personal','test'].some(space => key.startsWith(`study-space:${space}:draft:quick-memo:${owner}:`));
  const keys = Array.from({length:storage.length}, (_,index) => storage.key(index)).filter((key):key is string=>key!==null && owns(key));
  if (factory) {
    const db = await new Promise<IDBDatabase>((resolve,reject) => {
      const request = factory.open('study-space-personal-journals',1);
      request.onupgradeneeded=()=>{request.result.createObjectStore('journals');request.result.createObjectStore('recovery');};
      request.onsuccess=()=>resolve(request.result); request.onerror=()=>reject(request.error);
      request.onblocked=()=>reject(Error('다른 창을 닫고 이 기기의 자료 정리를 다시 시도해 주세요.'));
    });
    try {
      await new Promise<void>((resolve,reject)=>{
        const names=['journals','recovery'].filter(name=>db.objectStoreNames.contains(name));
        if (!names.length) {resolve();return;}
        const transaction=db.transaction(names,'readwrite');
        for (const name of names) {
          const request=transaction.objectStore(name).openCursor();
          request.onsuccess=()=>{const cursor=request.result;if(!cursor)return;const key=name==='recovery'?cursor.value?.key:cursor.key;if(typeof key==='string'&&owns(key))cursor.delete();cursor.continue();};
        }
        transaction.oncomplete=()=>resolve();transaction.onabort=()=>reject(transaction.error??Error('기기의 보관 자료를 정리하지 못했습니다.'));
      });
    } finally {db.close();}
  }
  for(const key of keys) storage.removeItem(key);
}
