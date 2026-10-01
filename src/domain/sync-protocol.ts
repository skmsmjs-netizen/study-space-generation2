/** Project limits, not platform limits. Preserve every operation and its order. */
export const MAX_SYNC_BATCH = 16;
export const MAX_SYNC_BATCH_CHARS = 2_000_000;
export interface SyncCapabilities {
  conditionalLoad?: true;
  batchCommands?: true;
}
