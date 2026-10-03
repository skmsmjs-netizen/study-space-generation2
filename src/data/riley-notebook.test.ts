import { test, expect } from 'vitest';
import { keepRileySnapshot, rileySnapshot, isRileySnapshot } from './riley-notebook';
import type { StudyRepository } from './repository';
import type { Command, AppState } from '../domain/model';
const position = {
  values: { r: 0.55 },
  inputs: { r: '0.55-' },
  verifiedSource: { page: 971, zoom: 1.25, scroll: { x: 54, y: 120 } },
  pendingFields: ['r'],
  step: 2,
  planStep: 1,
  conditionCheck: '위반' as const,
  zoom: 1,
  note: ' 原文\r\n\u0000\ud800',
  noteHistory: [],
  viewport: { x: [0, 4] as [number, number], y: [0, 3] as [number, number] },
};
test('explicit observation snapshots use existing memo contract and preserve unfinished text without updating study records', () => {
  const commands: Command[] = [];
  const result = {} as AppState;
  const repo = {
    getSnapshot: () => result,
    execute: (c: Command) => {
      commands.push(c);
      return result;
    },
  } as StudyRepository;
  keepRileySnapshot(
    repo,
    { userId: 'a', namespace: 'test' },
    'riley-3e-section-4.2',
    position,
    'selected-subject',
  );
  keepRileySnapshot(
    repo,
    { userId: 'a', namespace: 'test' },
    'riley-3e-section-4.2',
    position,
    'selected-subject',
  );
  expect(commands.map((c) => c.type)).toEqual(['saveMemo', 'saveMemo']);
  expect((commands[0] as Extract<Command, { type: 'saveMemo' }>).id).not.toBe(
    (commands[1] as Extract<Command, { type: 'saveMemo' }>).id,
  );
  const c = commands[0] as Extract<Command, { type: 'saveMemo' }>;
  expect(c.ownerId).toBe('selected-subject');
  expect(c.expectedVersion).toBe(0);
  const v = rileySnapshot(c.body)!;
  expect(v.position).toEqual(position);
  expect(v.section).toBe('riley-3e-section-4.2');
});
test('edited unrelated text, different source and malformed state cannot be restored as a valid snapshot', () => {
  expect(isRileySnapshot('user free writing')).toBe(false);
  expect(rileySnapshot('user free writing')).toBe(null);
  expect(() =>
    rileySnapshot(
      '[ManSeekSong Riley observation v1]\n' +
        JSON.stringify({ source: 'wrong', section: 'riley-3e-section-4.2', position }),
    ),
  ).toThrow();
  expect(() => rileySnapshot('[ManSeekSong Riley observation v1]\ninvalid')).toThrow();
});
