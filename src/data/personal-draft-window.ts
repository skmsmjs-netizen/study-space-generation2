// Runtime identity only: persisted text stays in each owner's existing namespace.
const windows = new Map<string, string>();
export function registerPersonalDraftWindow(userId: string, windowId: string) {
  windows.set(userId, windowId);
  return () => { if (windows.get(userId) === windowId) windows.delete(userId); };
}
export function personalDraftWindow(key: string): string | undefined {
  for (const [userId, windowId] of windows) {
    const owner = encodeURIComponent(userId);
    if (key.startsWith(`study-space:personal:${owner}:`) ||
      key.startsWith(`study-space:personal:draft:quick-memo:${owner}:`) ||
      key === `study-space:personal:draft:topic-recall:${owner}`) return windowId;
  }
  return undefined;
}
