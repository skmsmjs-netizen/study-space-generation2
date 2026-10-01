export const MATERIAL_DB = 'study-space-material-files';
export async function database(factory = globalThis.indexedDB) {
  if (!factory)
    throw Error(
      '이 브라우저에서 음성 파일을 보관할 수 없습니다. 파일을 기기에 따로 저장해 주세요.',
    );
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = factory.open(MATERIAL_DB, 1);
    request.onupgradeneeded = () => {
      for (const name of ['files', 'drafts', 'recordings']) request.result.createObjectStore(name);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(Error('자료를 보관할 저장 공간을 열지 못했습니다.'));
    request.onblocked = () => reject(Error('다른 창을 닫고 자료 보관을 다시 시도해 주세요.'));
  });
}
export async function access<T>(
  store: string,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
  factory?: IDBFactory,
): Promise<T> {
  const db = await database(factory);
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(store, mode),
        request = operation(tx.objectStore(store));
      let result: T;
      request.onsuccess = () => {
        result = request.result;
      };
      tx.oncomplete = () => resolve(result);
      tx.onabort = () =>
        reject(Error('자료를 기기에 보관하지 못했습니다. 저장 공간을 확인해 주세요.'));
      tx.onerror = () =>
        reject(Error('자료를 기기에 보관하지 못했습니다. 원본을 따로 저장해 주세요.'));
    });
  } finally {
    db.close();
  }
}
