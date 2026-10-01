import { unzipSync, strFromU8 } from 'fflate';
import { canonicalYouTubeURL, MAX_DOCUMENT_TEXT, type DocumentBlock, type MaterialDocument } from '../domain/material-source';
import { keepDocumentFile } from './material-files';
import type { AppState } from '../domain/model';

type Options = { signal: AbortSignal; progress: (message: string) => void; firstPage?: number; lastPage?: number; ocr?: boolean };
const block = (id: string, label: string, text: string, start: number | null = null, end: number | null = null): DocumentBlock => ({ id, label, text, start, end, included: true });
export function parseSubtitles(raw: string): DocumentBlock[] {
  const time = (value: string) => value.replace(',', '.').split(':').reduce((n, part) => n * 60 + Number(part), 0);
  const blocks: DocumentBlock[] = [];
  for (const cue of raw.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').split(/\n\s*\n/)) {
    const lines = cue.split('\n'), index = lines.findIndex(line => /\d{1,2}:\d{2}.*-->/.test(line));
    if (index < 0) continue;
    const match = lines[index].match(/([\d:.,]+)\s*-->\s*([\d:.,]+)/);
    if (!match) continue;
    const start = time(match[1]), end = time(match[2]);
    const text = lines.slice(index + 1).join('\n').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    if (Number.isFinite(start) && Number.isFinite(end) && end >= start && text.trim()) blocks.push(block(`cue-${blocks.length + 1}`, `${Math.floor(start / 60)}:${String(Math.floor(start % 60)).padStart(2, '0')} 자막`, text, start, end));
  }
  if (!blocks.length) throw Error('자막의 시간 구간을 읽지 못했습니다. SRT·VTT 원본을 확인해 주세요.');
  return blocks;
}
export function readPresentation(bytes: Uint8Array): DocumentBlock[] {
  let expanded = 0;
  const files = unzipSync(bytes, { filter: file => {
    expanded += file.originalSize;
    if (expanded > 100 * 1024 * 1024 || file.originalSize > 50 * 1024 * 1024) throw Error('압축을 푼 자료가 너무 큽니다. 자료를 나누어 주세요.');
    return /^ppt\/(slides\/slide\d+\.xml|notesSlides\/notesSlide\d+\.xml|slides\/_rels\/slide\d+\.xml\.rels|presentation\.xml|_rels\/presentation\.xml\.rels)$/.test(file.name);
  } });
  const xml = (path: string) => {
    if (!files[path]) return null;
    const raw = strFromU8(files[path]);
    if (/<!DOCTYPE|<!ENTITY/.test(raw)) throw Error('이 문서의 XML 형식은 읽을 수 없습니다.');
    const doc = new DOMParser().parseFromString(raw, 'application/xml');
    if (doc.getElementsByTagName('parsererror').length) throw Error('슬라이드의 원문을 읽지 못했습니다.');
    return doc;
  };
  const rel = xml('ppt/_rels/presentation.xml.rels'), presentation = xml('ppt/presentation.xml');
  if (!rel || !presentation) throw Error('PPTX의 슬라이드 목록을 읽지 못했습니다.');
  const targets = new Map(Array.from(rel.getElementsByTagName('Relationship')).map(e => [e.getAttribute('Id'), e.getAttribute('Target')]));
  const ids = Array.from(presentation.getElementsByTagNameNS('*', 'sldId'));
  const paragraphs = (doc: Document | null) => doc ? Array.from(doc.getElementsByTagNameNS('*', 'p')).map(p => Array.from(p.getElementsByTagNameNS('*', 't')).map(t => t.textContent ?? '').join('')).join('\n') : '';
  return ids.map((el, index) => {
    const target = targets.get(el.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id'));
    const path = target?.startsWith('/ppt/') ? target.slice(1) : `ppt/${target}`;
    if (!/^ppt\/slides\/slide\d+\.xml$/.test(path)) throw Error('슬라이드의 위치를 확인하지 못했습니다.');
    const slide = xml(path); if (!slide) throw Error('슬라이드 원문이 빠져 있습니다.');
    const slideRels = xml(path.replace('slides/', 'slides/_rels/') + '.rels');
    const noteTarget = Array.from(slideRels?.getElementsByTagName('Relationship') ?? []).find(r => r.getAttribute('Type')?.endsWith('/notesSlide'))?.getAttribute('Target');
    const notePath = noteTarget?.match(/^\.\.\/notesSlides\/(notesSlide\d+\.xml)$/)?.[1];
    const notes = notePath ? paragraphs(xml(`ppt/notesSlides/${notePath}`)) : '';
    return block(`slide-${index + 1}`, `${index + 1}번째 슬라이드`, paragraphs(slide) + (notes.trim() ? `\n\n발표자 메모\n${notes}` : ''));
  });
}
import {recognize,ocrWorkers} from './local-ocr';
export async function importMaterialFile(owner: Pick<AppState, 'userId' | 'namespace'>, file: File, options: Options): Promise<MaterialDocument> {
  options.signal.throwIfAborted();
  const reference = await keepDocumentFile(owner, file);
  options.progress('원본을 이 기기에 보관했습니다. 내용을 읽고 있습니다.');
  try {
  const extension = file.name.toLowerCase().split('.').pop();
  const result: MaterialDocument = { id: crypto.randomUUID(), name: file.name, kind: 'text', file: reference, blocks: [], warnings: [] };
  if (extension === 'pdf') {
    result.kind = 'pdf';
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href;
    const loading = pdfjs.getDocument({ data: await file.arrayBuffer() });
    const abort = () => { void loading.destroy(); };
    options.signal.addEventListener('abort', abort, { once: true });
    try {
      const pdf = await loading.promise;
      const first = options.firstPage ?? 1, last = Math.min(options.lastPage ?? pdf.numPages, pdf.numPages);
      if (first < 1 || first > last || last - first >= 500) throw Error('PDF는 한 번에 500쪽 이내로 읽습니다. 가져올 쪽 범위를 정해 주세요.');
      if (first !== 1 || last !== pdf.numPages) result.warnings.push(`전체 ${pdf.numPages}쪽 중 ${first}–${last}쪽을 가져왔습니다. 나머지 쪽은 원본 파일에 보관되어 있습니다.`);
      for (let pageNumber = first; pageNumber <= last; pageNumber++) {
        options.signal.throwIfAborted(); options.progress(`PDF ${pageNumber}/${last}쪽을 읽고 있습니다.`);
        const page = await pdf.getPage(pageNumber), content = await page.getTextContent();
        let text = content.items.map(item => 'str' in item ? item.str + (item.hasEOL ? '\n' : ' ') : '').join('');
        if (!text.trim() && options.ocr !== false) {
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas'); canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
          if (canvas.width * canvas.height > 20_000_000) throw Error('PDF 이미지가 너무 큽니다. 작은 크기의 PDF로 가져와 주세요.');
          await page.render({ canvas, viewport }).promise;
          text = await recognize(canvas, options); canvas.width = canvas.height = 0;
        }
        if (!text.trim()) result.warnings.push(`${pageNumber}쪽에서 글자를 읽지 못했습니다. 원본을 확인해 주세요.`);
        result.blocks.push(block(`page-${pageNumber}`, `${pageNumber}쪽`, text)); page.cleanup();
        if (result.blocks.reduce((n, b) => n + b.text.length, 0) > MAX_DOCUMENT_TEXT) throw Error('원문이 100만 자를 넘습니다. PDF 쪽 범위를 나누어 가져와 주세요.');
      }
      result.warnings.push('표·다단 배치·수식·그림은 원본 PDF와 대조해 주세요.');
    } finally { options.signal.removeEventListener('abort', abort); await loading.destroy(); }
  } else if (extension === 'docx') {
    result.kind = 'docx';
    const mammoth = await import('mammoth');
    const extractRawText = mammoth.extractRawText ?? mammoth.default.extractRawText;
    const bytes = await file.arrayBuffer();
    let expanded = 0;
    unzipSync(new Uint8Array(bytes), { filter: entry => { expanded += entry.originalSize; if (expanded > 100 * 1024 * 1024 || entry.originalSize > 50 * 1024 * 1024) throw Error('압축을 푼 Word 문서가 너무 큽니다. 본문을 나누어 주세요.'); return false; } });
    const extracted = await extractRawText({ arrayBuffer: bytes });
    result.blocks = (extracted.value.match(/[\s\S]{1,8000}/g) ?? []).map((text, index) => block(`part-${index + 1}`, `${index + 1}번째 본문 구간`, text));
    result.warnings = ['서식·그림·수식은 원본 Word 문서와 대조해 주세요.', ...extracted.messages.slice(0, 20).map(m => m.message.slice(0, 1000))];
  } else if (extension === 'pptx') {
    result.kind = 'pptx'; result.blocks = readPresentation(new Uint8Array(await file.arrayBuffer()));
    result.warnings = ['글자와 발표자 메모를 가져왔습니다. 도형·그림·수식·표 배치는 원본 슬라이드와 대조해 주세요.'];
  } else if (['png', 'jpg', 'jpeg', 'webp', 'bmp'].includes(extension ?? '')) {
    result.kind = 'image'; result.blocks = [block('photo', '사진에서 읽은 글자', await recognize(file, options))];
    result.warnings = ['손글씨·수식·작은 글자는 잘못 읽을 수 있습니다. 원본 사진을 보고 수정해 주세요.'];
  } else if (['srt', 'vtt'].includes(extension ?? '')) {
    result.kind = 'subtitle'; result.blocks = parseSubtitles(await file.text());
  } else if (['txt', 'md', 'csv'].includes(extension ?? '')) {
    result.blocks = ((await file.text()).match(/[\s\S]{1,8000}/g) ?? []).map((text, index) => block(`part-${index + 1}`, `${index + 1}번째 원문 구간`, text));
  } else throw Error('PDF·DOCX·PPTX·사진·TXT·MD·SRT·VTT 파일을 골라 주세요. 이전 DOC·PPT 형식은 DOCX·PPTX 또는 PDF로 저장해 가져올 수 있습니다. 원본 파일은 이 기기에 보관했습니다.');
  // Preserve complete text while keeping an unusually dense page editable.
  result.blocks = result.blocks.flatMap(b => b.text.length <= 100000 ? [b] : (b.text.match(/[\s\S]{1,8000}/g) ?? []).map((text, i) => ({ ...b, id: `${b.id}-part-${i + 1}`, label: `${b.label} · ${i + 1}번째 구간`, text })));
  options.signal.throwIfAborted();
  if (!result.blocks.some(b => b.text.trim())) throw Error('읽어 낸 글자가 없습니다. 원본 파일은 보관했습니다. 다른 파일이나 원문을 넣어 주세요.');
  if (result.blocks.length > 6000 || result.blocks.reduce((n, b) => n + b.text.length, 0) > MAX_DOCUMENT_TEXT) throw Error('가져올 자료의 범위를 나누어 주세요. 원본은 보관했습니다.');
  return result;
  } finally {
    const worker = ocrWorkers.get(options); ocrWorkers.delete(options);
    if (worker) void worker.then(w => w.terminate()).catch(() => undefined);
  }
}
export { canonicalYouTubeURL };

