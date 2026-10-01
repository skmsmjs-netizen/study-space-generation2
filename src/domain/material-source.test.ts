import { expect, it } from 'vitest';
import { canonicalYouTubeURL, documentSegments, type MaterialDocument } from './material-source';
import { applyCommand } from './commands';
import { emptyState } from './model';
import { packServerState, unpackServerState } from '../server/state-codec';
const doc: MaterialDocument = { id: 'doc', name: '조건.pdf', kind: 'pdf', file: null, warnings: [], blocks: [{ id: 'page-2', label: '2쪽', text: '  조건\r\n\u0000\ud800 ', start: null, end: null, included: true }, { id: 'page-3', label: '3쪽', text: '보관만 하는 예외', start: null, end: null, included: false }] };
it('preserves complete originals, selected page grounding, edits, conversation and attempts through the real command and server codec', () => {
  const ctx = { userId: '20000000-0000-4000-8000-000000000001', namespace: 'test' as const, at: '2026-10-01T00:00:00Z' };
  let state = applyCommand(emptyState(ctx.userId, ctx.namespace), { ...ctx, type: 'addSubject', id: 's', name: '합성 과목', scope: { kind: 'independent' }, opId: 'subject' });
  state = applyCommand(state, { ...ctx, type: 'saveStudyMaterial', id: 'm', expectedVersion: 0, opId: 'save', content: { title: '합성 문서', subjectId: 's', topicId: null, sourceText: '', audio: null, documents: [doc], results: [], tutorDraft: '이 조건의 이유?', quizAttempts: [] } });
  const read = unpackServerState(packServerState(state, 'save'));
  expect(read.studyMaterials![0].documents).toEqual([doc]); expect(read.studyMaterials![0].tutorDraft).toBe('이 조건의 이유?');
  expect(documentSegments([doc])).toEqual([{ id: 'doc:page-2:0', label: '조건.pdf · 2쪽', text: doc.blocks[0].text, start: null, end: null }]);
  expect(read.records).toHaveLength(0);
});
it('accepts only canonical YouTube video URLs and rejects arbitrary requests, credentials, ports and playlist-only input', () => {
  expect(canonicalYouTubeURL('https://youtu.be/jNQXAC9IVRw?t=2')).toBe('https://www.youtube.com/watch?v=jNQXAC9IVRw');
  for (const url of ['http://127.0.0.1/video', 'https://youtube.com.evil.invalid/watch?v=jNQXAC9IVRw', 'https://u:p@youtube.com/watch?v=jNQXAC9IVRw', 'https://youtube.com:8443/watch?v=jNQXAC9IVRw', 'https://youtube.com/playlist?list=x']) expect(() => canonicalYouTubeURL(url)).toThrow();
});
it('rejects duplicate source ids and preserves excluded text without silently sending it', () => {
  const bad = structuredClone(doc); bad.blocks.push(bad.blocks[0]); expect(() => documentSegments([bad])).toThrow();
  expect(documentSegments([{ ...doc, blocks: doc.blocks.map(b => ({ ...b, included: false })) }])).toEqual([]);
});
it('snapshots only submitted excerpts and keeps excluded originals without inflating repeated conversation inputs', async () => {
 const {selectedMaterialDocuments,materialSourceIdentity}=await import('./material-source');
 const snapshot=selectedMaterialDocuments([doc]);expect(snapshot[0].blocks).toHaveLength(1);expect(doc.blocks).toHaveLength(2);
 expect(materialSourceIdentity({documents:[doc]})).toBe(materialSourceIdentity({documents:snapshot}));
 const changed=structuredClone(doc);changed.blocks[1].text='보관한 예외만 수정';expect(materialSourceIdentity({documents:[changed]})).toBe(materialSourceIdentity({documents:[doc]}));changed.blocks[0].text='선택 원문 수정';expect(materialSourceIdentity({documents:[changed]})).not.toBe(materialSourceIdentity({documents:[doc]}));
});
