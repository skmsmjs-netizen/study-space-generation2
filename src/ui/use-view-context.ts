import { useCallback, useRef, useState, type SetStateAction } from 'react';
import type { AppState } from '../domain/model';
import { readViewContext, viewContextKey, writeViewContext } from '../data/view-context';

export const isViewText = (value: unknown): value is string => typeof value === 'string';
export const isViewPage = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
export function useViewContext<T>(
  data: Pick<AppState, 'namespace' | 'userId'>,
  name: string,
  fallback: T,
  valid: (value: unknown) => value is T,
) {
  const key = viewContextKey(data, name);
  const [stored, setStored] = useState(() => ({
    key,
    value: readViewContext(key, fallback, valid),
  }));
  const value = stored.key === key ? stored.value : readViewContext(key, fallback, valid);
  // Active/trash or owner changes can reuse this component. Adjust before
  // committing its children so the previous list's hints never become this list's.
  if (stored.key !== key) setStored({ key, value });
  const current = useRef(value);
  current.current = value;
  const change = useCallback(
    (update: SetStateAction<T>) => {
      const next =
        typeof update === 'function' ? (update as (previous: T) => T)(current.current) : update;
      current.current = next;
      writeViewContext(key, next);
      setStored({ key, value: next });
    },
    [key],
  );
  return [value, change] as const;
}
