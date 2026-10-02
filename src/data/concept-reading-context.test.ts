// @vitest-environment node
import { expect, it } from 'vitest';
import {
  readConceptPosition,
  saveConceptPosition,
  conceptReadingKey,
} from './concept-reading-context';
import type { ConceptScreen } from '../domain/concept-production';
const screen: ConceptScreen = {
  type: '정의형',
  title: '읽기',
  intro: '',
  mode: 'plain',
  navigation: 'choose',
  scenes: ['first', 'second'].map((id) => ({
    id,
    action: id,
    title: id,
    body: '설명',
    caption: '',
    takeaway: '',
  })),
};
it('restores by stable scene ID after reordering, and corruption stays separate from source', () => {
  let raw: string | null = null;
  const storage = {
    getItem: () => raw,
    setItem: (_key: string, value: string) => {
      raw = value;
    },
  };
  saveConceptPosition('key', screen, 1, storage);
  expect(readConceptPosition('key', screen, storage)).toBe(1);
  expect(
    readConceptPosition('key', { ...screen, scenes: [...screen.scenes].reverse() }, storage),
  ).toBe(0);
  raw = '{invalid';
  expect(readConceptPosition('key', screen, storage)).toBe(0);
  raw = JSON.stringify({ sceneId: 'removed' });
  expect(readConceptPosition('key', screen, storage)).toBe(0);
});
it('does not store another user or concept under the same reading key', () => {
  expect(conceptReadingKey({ userId: 'a', namespace: 'test' }, 'cat:one')).not.toBe(
    conceptReadingKey({ userId: 'b', namespace: 'test' }, 'cat:one'),
  );
  expect(conceptReadingKey({ userId: 'a', namespace: 'test' }, 'cat:one')).not.toBe(
    conceptReadingKey({ userId: 'a', namespace: 'test' }, 'cat:two'),
  );
});
