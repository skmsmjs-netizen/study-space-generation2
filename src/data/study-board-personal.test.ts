// @vitest-environment node
import { expect, it } from 'vitest';
import { PersonalRepository, type OnlineTransport } from './personal-repository';
import { applyCommand } from '../domain/commands';
import { emptyState, type Command } from '../domain/model';
import { freshBoard } from '../domain/study-board';
it('recovers the exact board operation after a lost server receipt and reopening', async () => {
  const user = '10000000-0000-4000-8000-000000000001';
  let server = { sequence: 0, data: emptyState(user, 'personal'), supportedCommands: ['saveStudyBoard'] };
  const values = new Map<string, string>();
  const storage = { getItem: (k: string) => values.get(k) ?? null, setItem: (k: string, v: string) => { values.set(k, v); } };
  let lost = true;
  const transport: OnlineTransport = { load: async () => server, execute: async (command) => {
    const next = applyCommand(server.data, command);
    if (next !== server.data) server = { ...server, sequence: server.sequence + 1, data: next };
    if (lost) throw Error('lost receipt');
    return server;
  } };
  const command: Command = { type: 'saveStudyBoard', id: 'board:main', expectedVersion: 0, userId: user, namespace: 'personal', opId: 'board-exact-op', at: '2026-10-01T03:00:00.000Z', content: { ...freshBoard(), cards: [{ id: 'original-card', columnId: 'to-do', title: '조건', body: '  原文\r\n예외\u0000\ud800  ', topicId: null, archived: false }] } };
  const first = new PersonalRepository(storage, transport, server);
  first.execute(command); await first.flush();
  expect(first.getStatus().phase).toBe('error');
  expect(first.getStatus().pending).toBe(1);
  lost = false;
  const reopened = new PersonalRepository(storage, transport, { sequence: 0, data: emptyState(user, 'personal'), supportedCommands: ['saveStudyBoard'] });
  await reopened.flush();
  expect(reopened.getStatus().phase).toBe('saved');
  expect(server.sequence).toBe(1);
  expect(server.data.revisions).toHaveLength(1);
  expect(server.data.studyBoards?.[0].cards).toEqual(command.content.cards);
  expect(server.data.records).toEqual([]);
});
