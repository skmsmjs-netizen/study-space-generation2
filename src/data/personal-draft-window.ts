// Runtime identity only: persisted text stays in each owner's existing namespace.
const windows = new Map<string, string>();
export function registerPersonalDraftWindow(userId: string, windowId: string) {
  windows.set(userId, windowId);
  return () => {
    if (windows.get(userId) === windowId) windows.delete(userId);
  };
}
export function personalDraftWindow(key: string): string | undefined {
  for (const [userId, windowId] of windows) {
    const owner = encodeURIComponent(userId);
    // Device preferences are shared; unfinished text and continuity remain
    // isolated per window. Keep all prior window copies in their existing keys.
    const prefix = `study-space:personal:${owner}:`;
    if (key === `${prefix}experience:v1:reading-width:v1` || key === `${prefix}graph-view:v1`)
      return undefined;
    if (
      key.startsWith(`study-space:personal:${owner}:`) ||
      key.startsWith(`study-space:personal:draft:quick-memo:${owner}:`) ||
      key === `study-space:personal:draft:topic-recall:${owner}`
    )
      return windowId;
  }
  return undefined;
}
