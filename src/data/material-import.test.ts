import { expect, it } from 'vitest';
import { zipSync, strToU8 } from 'fflate';
import { parseSubtitles, readPresentation } from './material-import';
it('imports captions with their actual timestamps and never treats header or NOTE metadata as text', () => {
  const rows = parseSubtitles('WEBVTT\n\nNOTE metadata\nnot a cue\n\n00:00:01.250 --> 00:00:03.500 align:start\n조건 <b>A</b>\n예외 &amp; 이유\n\n00:00:04.000 --> 00:00:05.000\n다음 조건');
  expect(rows).toHaveLength(2); expect(rows[0]).toMatchObject({ start: 1.25, end: 3.5, text: '조건 A\n예외 & 이유' });
  expect(parseSubtitles('1\r\n00:00:00,100 --> 00:00:01,500\r\n원문')).toHaveLength(1);
  expect(() => parseSubtitles('자막이 아닌 파일')).toThrow();
});
it('uses presentation relationships rather than filename order, includes notes and renders XML text without HTML execution', () => {
  const xml = (text: string) => strToU8(text);
  const bytes = zipSync({
    'ppt/presentation.xml': xml('<p:presentation xmlns:p="p" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><p:sldIdLst><p:sldId r:id="second"/><p:sldId r:id="first"/></p:sldIdLst></p:presentation>'),
    'ppt/_rels/presentation.xml.rels': xml('<Relationships><Relationship Id="first" Target="slides/slide1.xml"/><Relationship Id="second" Target="slides/slide2.xml"/></Relationships>'),
    'ppt/slides/slide1.xml': xml('<a:p xmlns:a="a"><a:r><a:t>첫 파일</a:t></a:r></a:p>'),
    'ppt/slides/slide2.xml': xml('<a:p xmlns:a="a"><a:r><a:t>&lt;script&gt;원문&lt;/script&gt;</a:t></a:r></a:p>'),
    'ppt/slides/_rels/slide2.xml.rels': xml('<Relationships><Relationship Type="x/notesSlide" Target="../notesSlides/notesSlide2.xml"/></Relationships>'),
    'ppt/notesSlides/notesSlide2.xml': xml('<a:p xmlns:a="a"><a:r><a:t>조건과 메모</a:t></a:r></a:p>'),
  });
  const rows = readPresentation(bytes); expect(rows[0].text).toBe('<script>원문</script>\n\n발표자 메모\n조건과 메모'); expect(rows[1].text).toBe('첫 파일');
});
