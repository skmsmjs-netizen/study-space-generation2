import { useState } from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RecallImport } from './recall-import';
import { DemoRepository } from '../data/demo-repository';
import { readRecall, writeRecall } from '../data/topic-recall';
import type { AnkiPreview } from '../data/anki-package';
let repo: DemoRepository, preview: AnkiPreview, failed = false;
class FakeWorker {
  onmessage?: (e: { data: object }) => void; onerror?: () => void; terminated = false;
  postMessage() { queueMicrotask(() => { if (!this.terminated) this.onmessage?.({ data: { type: 'result', result: preview } }); }); }
  terminate() { this.terminated = true; }
}
function Harness() {
  const [data, setData] = useState(repo.getSnapshot()), [session, setSession] = useState(() => readRecall(repo.getSnapshot()));
  return <RecallImport data={data} topics={data.nodes.filter(n => n.role === 'topic')} repository={Object.assign(repo, { flush: async () => { if (failed) throw Error('합성 저장 실패'); } })} session={session} persist={next => { writeRecall(data, next); setSession(next); return true; }} onSaved={setData} disabled={false} />;
}
beforeEach(() => {
  localStorage.clear(); repo = new DemoRepository(localStorage); failed = false; vi.stubGlobal('Worker', FakeWorker);
  preview = { total: 2, skipped: [], warnings: [], format: 'fixture', items: [0, 1].map(i => ({ id: '', topicId: '', front: `질문 ${i}`, reference: ` 답변 ${i}\n `, source: { key: `anki:guid${i}:0`, guid: `guid${i}`, ordinal: 0, deck: '원본 덱', noteType: 'Basic', tags: ' 원본 태그 ', fields: [{ name: 'Front', value: `질문 ${i}` }], questionTemplate: '{{Front}}', answerTemplate: '{{Back}}', originalFront: `질문 ${i}`, originalReference: ` 답변 ${i}\n ` } })) };
});
afterEach(() => vi.unstubAllGlobals());
async function selectFile() {
  const file = new File(['fixture'], 'synthetic.apkg'); Object.defineProperty(file, 'arrayBuffer', { value: async () => new ArrayBuffer(8) });
  fireEvent.change(screen.getByLabelText('Anki 파일 선택'), { target: { files: [file] } });
  await screen.findByText(/읽을 수 있는 카드 2개/);
}
it('preserves the exact failed batch across remount, retries idempotently, and imports the same source without duplicating', async () => {
  let view = render(<Harness />); fireEvent.click(screen.getByText('Anki 파일 가져오기')); await selectFile(); failed = true;
  fireEvent.click(screen.getByRole('button', { name: '확인한 카드 가져오기' })); await screen.findByRole('alert');
  const request = readRecall(repo.getSnapshot()).pendingImport!; expect(request.items).toHaveLength(2); expect(repo.getSnapshot().recallCards).toHaveLength(2);
  view.unmount(); failed = false; view = render(<Harness />); fireEvent.click(screen.getByText('Anki 파일 가져오기'));
  fireEvent.click(screen.getByRole('button', { name: '보존한 가져오기 다시 시도' }));
  await waitFor(() => expect(readRecall(repo.getSnapshot()).pendingImport).toBeUndefined()); expect(repo.getSnapshot().recallCards).toHaveLength(2);
  await waitFor(() => expect(screen.getByLabelText('Anki 파일 선택')).toBeEnabled());
  await selectFile(); fireEvent.click(screen.getByRole('button', { name: '확인한 카드 가져오기' }));
  await screen.findByText(/카드 2개를 처리했습니다/); expect(repo.getSnapshot().recallCards).toHaveLength(2); expect(repo.getSnapshot().recallCards![0].reference).toBe(' 답변 0\n ');
});
it('requires explicit acknowledgement of partial import and keeps the original preview untouched', async () => {
  preview.skipped = [{ key: 'unsupported', reason: '이미지 가리기' }]; preview.total = 3;
  render(<Harness />); fireEvent.click(screen.getByText('Anki 파일 가져오기')); await selectFile();
  expect(screen.getByRole('button', { name: '확인한 카드 가져오기' })).toBeDisabled();
  fireEvent.click(screen.getByRole('checkbox', { name: '표시된 제한을 확인했습니다. 읽을 수 있는 텍스트 카드만 가져옵니다' }));
  expect(screen.getByRole('button', { name: '확인한 카드 가져오기' })).toBeEnabled(); expect(preview.skipped).toHaveLength(1);
});
