export function isStorageQuotaError(error: unknown) {
  return error !== null && typeof error === 'object' && 'name' in error && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED');
}
export function storageErrorText(error: unknown, fallback: string) {
  if (isStorageQuotaError(error)) return '이 기기의 저장 공간이 부족합니다. 입력한 글은 지우지 말고 다른 공부 창을 닫은 뒤 다시 저장해 주세요.';
  return error instanceof Error ? error.message : fallback;
}
