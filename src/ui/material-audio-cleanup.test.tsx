import { beforeEach, expect, it, vi } from 'vitest';
import { configure, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IDBFactory, IDBKeyRange } from 'fake-indexeddb';
import { AI_OWNER_USER_ID } from '../domain/ai-access';
import { TRANSCRIPTION_VERSION } from '../domain/browser-transcription';
import { emptyState } from '../domain/model';
import { applyCommand } from '../domain/commands';
import type { StudyRepository } from '../data/repository';
import { keepAudio, keepRecordingChunk, readAudio, readMaterialDraft, writeMaterialDraft, writeTranscriptionCheckpoint } from '../data/material-files';
import { StudyMaterials } from './study-materials';
import { access } from '../data/material-file-db';
configure({ asyncUtilTimeout: 15_000 });

vi.mock('./gpt-connection-panel', () => ({ GPTConnectionPanel: () => null }));
vi.mock('./material-sources', () => ({ MaterialSources: () => null }));
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
it('preserves legacy audio and transcript despite an old cleanup intent through failed save and reopening', async () => {
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
  await keepRecordingChunk(state, 'old-interrupted', 0, new Blob(['old chunk'], { type: 'audio/webm' }));
  const originalChunks = await access('recordings', 'readonly', store => store.getAll());
  const originalFiles = await access('files', 'readonly', store => store.getAll());
  expect(originalChunks).toHaveLength(1);
  expect(originalFiles).toHaveLength(1);
  await writeTranscriptionCheckpoint(state, { version: TRANSCRIPTION_VERSION, audioHash: audio.sha256,
    duration: 30, nextWindow: 1, complete: true, segments: [{ start: 0, end: 30, text: '기계 전사문' }], editedText: '확인한 전사문 · 조건과 예외' });
  await writeMaterialDraft(state, 'new', { materialId: 'synthetic-material', baseVersion: 0,
    recordingId: 'old-interrupted', audioCleanup: { audio, text: '기존 원문', recordingId: undefined }, updatedAt: '2026-10-01T00:00:00Z', content: { title: '합성 전사 정리', subjectId: 'synthetic-subject', topicId: null, sourceText: '기존 원문\n예외 보존', audio, results: [] } });
  let view = render(<StudyMaterials data={state} repository={repository} onSaved={() => undefined} materialId="new" />);
  await screen.findByDisplayValue('합성 전사 정리');
  expect(screen.queryByRole('button', { name: '녹음 시작' })).not.toBeInTheDocument();
  expect(await readAudio(state, audio)).not.toBeNull();
  await waitFor(() => expect(screen.getByRole('button', { name: '자료 저장' })).toBeEnabled());
  fireEvent.click(screen.getByRole('button', { name: '자료 저장' }));
  await screen.findByText('합성 서버 저장 실패');
  expect(await readAudio(state, audio)).not.toBeNull();
  expect((await readMaterialDraft(state, 'new'))?.audioCleanup).toBeDefined();
  expect((await readMaterialDraft(state, 'new'))?.audioCleanup?.audio.sha256).toBe(audio.sha256);
  view.unmount();
  view = render(<StudyMaterials data={state} repository={repository} onSaved={() => undefined} materialId="new" />);
  await screen.findByDisplayValue('합성 전사 정리');
  fail = false;
  await waitFor(() => expect(screen.getByRole('button', { name: '자료 저장' })).toBeEnabled());
  fireEvent.click(screen.getByRole('button', { name: '자료 저장' }));
  await screen.findByText('자료를 서버에 저장했습니다.');
  expect(await readAudio(state, audio)).not.toBeNull();
  expect(await readMaterialDraft(state, 'new')).toBeUndefined();
  expect((await readMaterialDraft(state, 'synthetic-material'))?.recordingId).toBe('old-interrupted');
  expect(await access('recordings', 'readonly', store => store.getAll())).toEqual(originalChunks);
  expect(await access('files', 'readonly', store => store.getAll())).toEqual(originalFiles);
  expect(state.studyMaterials).toHaveLength(1);
  expect(state.studyMaterials![0].version).toBe(1);
  expect(state.studyMaterials![0].audio).toEqual(audio);
  expect(state.studyMaterials![0].sourceText).toBe('기존 원문\n예외 보존');
  view.unmount();
});

it('recovers legacy cleanup drafts and preserves their original audio after failed save, reload and acknowledged retry without duplicating text or revisions', async () => {
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
    updatedAt: '2026-10-01T00:00:00Z', audioCleanup: { audio, text: '확인한 전사문 · 조건과 예외' }, content: { title: '합성 전사 정리', subjectId: 'synthetic-subject', topicId: null, sourceText: '기존 원문\n예외 보존\n\n확인한 전사문 · 조건과 예외', audio: null, results: [] } });
  let view = render(<StudyMaterials data={state} repository={repository} onSaved={() => undefined} materialId="new" />);
  await screen.findByDisplayValue('합성 전사 정리');
  expect(await screen.findByRole('link', { name: '원본 음성 내려받기' })).toBeVisible();
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
  await screen.findByText('자료를 서버에 저장했습니다.');
  expect(await readAudio(state, audio)).not.toBeNull();
  expect(await readMaterialDraft(state, 'new')).toBeUndefined();
  expect(state.studyMaterials).toHaveLength(1);
  expect(state.studyMaterials![0].version).toBe(1);
  expect(state.studyMaterials![0].audio?.sha256).toBe(audio.sha256);
  expect(state.studyMaterials![0].sourceText).toBe('기존 원문\n예외 보존\n\n확인한 전사문 · 조건과 예외');
  view.unmount();
});
