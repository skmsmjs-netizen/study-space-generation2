// Login persistence is separate from study records and drafts.
export const AUTH_KEY = 'study-space:auth:v1';
const TAB_MODE_KEY = 'study-space:auth:tab-mode:v1';
const TAB_ID_KEY = 'study-space:auth:tab-id:v1';

export function readLoginPersistence(storage?: Storage): boolean {
  try { return (storage ?? sessionStorage).getItem(TAB_MODE_KEY) !== 'temporary'; }
  catch { return true; }
}

export function saveLoginPersistence(remember: boolean, storage: Storage = sessionStorage) {
  if (remember) storage.removeItem(TAB_MODE_KEY);
  else storage.setItem(TAB_MODE_KEY, 'temporary');
}

export function loginStorageOptions(remember: boolean, givenStorage?: Storage) {
  if (remember) return { storageKey: AUTH_KEY };
  const storage = givenStorage ?? sessionStorage;
  let id = storage.getItem(TAB_ID_KEY);
  if (!id) { id = crypto.randomUUID(); storage.setItem(TAB_ID_KEY, id); }
  // A different channel prevents a temporary login from signing other tabs in.
  return { storageKey: `${AUTH_KEY}:tab:${id}`, storage };
}
