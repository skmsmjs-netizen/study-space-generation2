import { beforeEach, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import { AI_OWNER_USER_ID } from '../domain/ai-access';
import { TRANSCRIPTION_VERSION } from '../domain/browser-transcription';
import { emptyState } from '../domain/model';
import { applyCommand } from '../domain/commands';
import type { StudyRepository } from '../data/repository';
import { keepAudio, readAudio, readMaterialDraft, writeMaterialDraft, writeTranscriptionCheckpoint } from '../data/material-files';
import { StudyMaterials } from './study-materials';

vi.mock('./gpt-connection-panel', () => ({ GPTConnectionPanel: () => null }));
vi.mock('./material-sources', () => ({ MaterialSources: () => null }));
vi.mock('./material-transcription', () => ({
  MaterialTranscription: ({ onAppend }: { onAppend: (text: string, remove: boolean) => Promise<void> }) =>
    <button onClick={() => void onAppend('확인한 전사문 · 조건과 예외', true)}>합성 전사 확인</button>,
}));
beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('indexedDB', new IDBFactory());
  vi.stubGlobal('IDBKeyRange', IDBKeyRange);
  const BaseURL = URL;
  vi.stubGlobal('URL', class extends BaseURL {
    static createObjectURL() { return 'blob:synthetic'; }
    static revokeObjectURL() {}
  });
  Element.prototype.scrollIntoView = vi.fn();
});
it('keeps raw audio on failed server save, recovers the cleanup intent, then removes only audio after acknowledgement without duplicating text or revisions', async () => {
  let state = applyCommand(emptyState(AI_OWNER_USER_ID, 'personal'), {
    type: 'addSubject', id: 'synthetic-subject', name: '합성 과목', scope: { kind: 'independent' },
    userId: AI_OWNER_USER_ID, namespace: 'personal', opId: 'subject', at: '2026-10-01T00:00:00Z',
  });
  let fail = true;
  const repository: StudyRepository = {
    getSnapshot: () => state,
    execute: command => state = applyCommand(state, command),
    getCapabilities: () => ['saveStudyMaterial'],
    flush: async () => { if (fail) throw Error('합성 서버 저장 실패'); },
    getStatus: () => ({ phase: fail ? 'pending' : 'saved', pending: fail ? 1 : 0, message: '' }),
  };
  const audio = await keepAudio(state, new File(['synthetic audio'], '합성.wav', { type: 'audio/wav' }));
  await writeTranscriptionCheckpoint(state, { version: TRANSCRIPTION_VERSION, audioHash: audio.sha256,
    duration: 30, nextWindow: 1, complete: true, segments: [{ start: 0, end: 30, text: '기계 전사문' }], editedText: '확인한 전사문 · 조건과 예외' });
  await writeMaterialDraft(state, 'new', { materialId: 'synthetic-material', baseVersion: 0,
    updatedAt: '2026-10-01T00:00:00Z', content: { title: '합성 전사 정리', subjectId: 'synthetic-subject', topicId: null, sourceText: '기존 원문\n예외 보존', audio, results: [] } });
  let view = render(<StudyMaterials data={state} repository={repository} onSaved={() => undefined} materialId="new" />);
  await screen.findByDisplayValue('합성 전사 정리');
  fireEvent.click(screen.getByRole('button', { name: '합성 전사 확인' }));
  await waitFor(async () => expect((await readMaterialDraft(state, 'new'))?.audioCleanup?.audio.sha256).toBe(audio.sha256));
  expect(await readAudio(state, audio)).not.toBeNull();
  fireEvent.click(screen.getByRole('button', { name: '자료 저장' }));
  await screen.findByText('합성 서버 저장 실패');
  expect(await readAudio(state, audio)).not.toBeNull();
  expect((await readMaterialDraft(state, 'new'))?.audioCleanup).toBeDefined();
  view.unmount();
  view = render(<StudyMaterials data={state} repository={repository} onSaved={() => undefined} materialId="new" />);
  await screen.findByDisplayValue('합성 전사 정리');
  fail = false;
  fireEvent.click(screen.getByRole('button', { name: '자료 저장' }));
  await screen.findByText('전사문을 저장하고 이 앱의 녹음 파일을 정리했습니다.');
  expect(await readAudio(state, audio)).toBeNull();
  expect(await readMaterialDraft(state, 'new')).toBeUndefined();
  expect(state.studyMaterials).toHaveLength(1);
  expect(state.studyMaterials![0].version).toBe(1);
  expect(state.studyMaterials![0].audio).toBeNull();
  expect(state.studyMaterials![0].sourceText).toBe('기존 원문\n예외 보존\n\n확인한 전사문 · 조건과 예외');
  view.unmount();
});
