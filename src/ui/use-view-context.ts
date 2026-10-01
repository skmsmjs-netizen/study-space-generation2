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
  const [value, setValue] = useState(() => readViewContext(key, fallback, valid));
  const current = useRef(value);
  current.current = value;
  const change = useCallback(
    (update: SetStateAction<T>) => {
      const next =
        typeof update === 'function' ? (update as (previous: T) => T)(current.current) : update;
      current.current = next;
      writeViewContext(key, next);
      setValue(next);
    },
    [key],
  );
  return [value, change] as const;
}
