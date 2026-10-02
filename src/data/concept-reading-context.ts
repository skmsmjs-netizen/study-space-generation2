import type { AppState } from '../domain/model';
import type { ConceptScreen } from '../domain/concept-production';
import { storagePrefix } from './repository';
export function conceptReadingKey(data: Pick<AppState, 'namespace' | 'userId'>, sourceKey: string) {
  return `${storagePrefix(data)}:concept-reading:${sourceKey}:v1`;
}
export function conceptSceneKey(screen: ConceptScreen, index: number) {
  return screen.scenes[index]?.id ?? screen.scenes[index]?.action ?? '';
}
/** Device reading preferences, separate from learning records, server state and source. */
export function readConceptPosition(
  key: string,
  screen: ConceptScreen,
  storage: Pick<Storage, 'getItem'> = localStorage,
) {
  try {
    const value: unknown = JSON.parse(storage.getItem(key) ?? 'null');
    if (
      !value ||
      typeof value !== 'object' ||
      !('sceneId' in value) ||
      typeof value.sceneId !== 'string'
    )
      return 0;
    const index = screen.scenes.findIndex((_, i) => conceptSceneKey(screen, i) === value.sceneId);
    return index < 0 ? 0 : index;
  } catch {
    return 0;
  }
}
export function saveConceptPosition(
  key: string,
  screen: ConceptScreen,
  index: number,
  storage: Pick<Storage, 'setItem'> = localStorage,
) {
  storage.setItem(key, JSON.stringify({ version: 1, sceneId: conceptSceneKey(screen, index) }));
}
