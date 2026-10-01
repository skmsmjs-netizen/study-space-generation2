/** View-only identities for read-only rows that have no persisted entity ID.
 * Duplicate originals remain separate; no IDs or source values are rewritten.
 */
export function occurrenceRows<T>(items: readonly T[], identity: (item: T) => string) {
  const counts = new Map<string, number>();
  return items.map((value, index) => {
    const token = identity(value);
    const occurrence = counts.get(token) ?? 0;
    counts.set(token, occurrence + 1);
    return { value, index, key: JSON.stringify([token, occurrence]) };
  });
}
