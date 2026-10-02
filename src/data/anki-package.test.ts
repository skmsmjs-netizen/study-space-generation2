// @vitest-environment node
import { beforeAll, it, expect } from 'vitest';
import initSqlJs, { type SqlJsStatic } from 'sql.js';
import { zipSync, strToU8 } from 'fflate';
import { Writer } from 'protobufjs/minimal';
import { zstdCompressSync } from 'node:zlib';
import { readAnkiPackage, ankiText } from './anki-package';
import { applyCommand } from '../domain/commands';
import { emptyState, type Command } from '../domain/model';
let SQL: SqlJsStatic;
beforeAll(async () => { SQL = await initSqlJs(); });
function ankiFixture(SQL: SqlJsStatic, modern = false, count = 2) {
  const db = new SQL.Database();
  db.run('CREATE TABLE col(ver INTEGER, models TEXT, decks TEXT); CREATE TABLE notes(id INTEGER, guid TEXT, mid INTEGER, tags TEXT, flds TEXT); CREATE TABLE cards(id INTEGER, nid INTEGER, did INTEGER, odid INTEGER, ord INTEGER);');
  const basic = { name: 'Basic', type: 0, flds: [{ name: 'Front', ord: 0 }, { name: 'Back', ord: 1 }], tmpls: [{ ord: 0, qfmt: '{{Front}}', afmt: '{{FrontSide}}<hr>{{Back}}' }, { ord: 1, qfmt: '{{Back}}', afmt: '{{Front}}' }] };
  const cloze = { name: 'Cloze', type: 1, flds: [{ name: 'Text', ord: 0 }, { name: 'Extra', ord: 1 }], tmpls: [{ ord: 0, qfmt: '{{cloze:Text}}', afmt: '{{cloze:Text}}<br>{{Extra}}' }] };
  db.run('INSERT INTO col VALUES(?, ?, ?)', [modern ? 18 : 11, JSON.stringify({ '1': basic, '2': cloze }), JSON.stringify({ '10': { name: '과학::지구' } })]);
  if (modern) {
    db.run('CREATE TABLE notetypes(id INTEGER, name TEXT, config BLOB); CREATE TABLE fields(ntid INTEGER, ord INTEGER, name TEXT); CREATE TABLE templates(ntid INTEGER, ord INTEGER, config BLOB); CREATE TABLE decks(id INTEGER, name TEXT);');
    db.run('INSERT INTO decks VALUES(10, ?)', ['과학\x1f지구']);
    for (const [id, model] of [[1, basic], [2, cloze]] as const) {
      db.run('INSERT INTO notetypes VALUES(?, ?, ?)', [id, model.name, Writer.create().uint32(8).uint32(model.type).finish()]);
      for (const field of model.flds) db.run('INSERT INTO fields VALUES(?, ?, ?)', [id, field.ord, field.name]);
      for (const template of model.tmpls) db.run('INSERT INTO templates VALUES(?, ?, ?)', [id, template.ord, Writer.create().uint32(10).string(template.qfmt).uint32(18).string(template.afmt).finish()]);
    }
  }
  for (let i = 1; i <= count; i++) {
    db.run('INSERT INTO notes VALUES(?, ?, ?, ?, ?)', [i, `guid-${i}`, i === 2 ? 2 : 1, ' 원본태그 ', i === 2 ? '{{c1::지구::행성}}는 {{c2::태양}} 주위를 돈다.\x1f 추가 설명 ' : ` 질문 ${i}<br>\n\x1f 답변 ${i} &amp; 조건 <script>danger()</script>`]);
    db.run('INSERT INTO cards VALUES(?, ?, 10, 0, 0)', [i * 2, i]);
    if (i === 2) db.run('INSERT INTO cards VALUES(?, ?, 10, 0, 1)', [i * 2 + 1, i]);
  }
  const bytes = db.export(); db.close();
  return zipSync(modern ? { 'collection.anki21b': new Uint8Array(zstdCompressSync(bytes)), meta: new Uint8Array([8, 3]), 'collection.anki2': strToU8('compatibility placeholder') } : { 'collection.anki2': bytes, media: strToU8('{}') });
}
it.each([false, true])('reads actual SQLite and ZIP representations (modern=%s), preserving raw fields and sibling identity', modern => {
  const result = readAnkiPackage(ankiFixture(SQL, modern), SQL);
  expect(result.skipped).toHaveLength(0); expect(result.items).toHaveLength(3);
  expect(result.items[0].front).toBe(' 질문 1\n\n');
  expect(result.items[0].reference).toContain('답변 1 & 조건'); expect(result.items[0].reference).not.toContain('danger()');
  expect(result.items[0].source.fields[1].value).toContain('<script>danger()</script>');
  expect(result.items[1].front).toBe('[행성]는 태양 주위를 돈다.'); expect(result.items[2].front).toBe('지구는 […] 주위를 돈다.');
  expect(result.items[1].source.deck).toBe('과학::지구');
});
it('imports twice, updates only untouched text, and preserves edits, answers, identities and intervals', () => {
  const parsed = readAnkiPackage(ankiFixture(SQL), SQL);
  const command = (patch: object) => ({ opId: crypto.randomUUID(), at: '2026-10-01T03:00:00Z', userId: 'owner', namespace: 'test', ...patch }) as Command;
  let data = applyCommand(emptyState('owner', 'test'), command({ type: 'addSubject', id: 's', name: 's', scope: { kind: 'independent' } }));
  data = applyCommand(data, command({ type: 'addNode', id: 't', subjectId: 's', parentId: null, role: 'topic', name: 't' }));
  const items = parsed.items.map((item, i) => ({ ...item, id: `card${i}`, topicId: 't' }));
  data = applyCommand(data, command({ type: 'importRecallCards', items, updateUnedited: false }));
  data = applyCommand(data, command({ type: 'reviewRecallCard', id: 'card0', topicId: 't', expectedVersion: 1, rating: 4, memo: { id: 'memo', body: ' 실제 답 원문\n ', strokes: [] } }));
  const memory = data.recallCards![0].memory;
  data = applyCommand(data, command({ type: 'importRecallCards', items: items.map(item => ({ ...item, id: crypto.randomUUID() })), updateUnedited: true }));
  expect(data.recallCards).toHaveLength(3); expect(data.recallCards![0].memory).toEqual(memory);
  data = applyCommand(data, command({ type: 'saveRecallCard', id: 'card0', topicId: 't', front: '내가 고친 질문', reference: '내 설명', expectedVersion: 2 }));
  const updated = items.map(item => ({ ...item, front: `${item.front} 갱신`, source: { ...item.source, originalFront: `${item.front} 갱신` } }));
  data = applyCommand(data, command({ type: 'importRecallCards', items: updated, updateUnedited: true }));
  expect(data.recallCards![0]).toMatchObject({ front: '내가 고친 질문', memory }); expect(data.memos![0].body).toBe(' 실제 답 원문\n ');
  expect(data.recallCards![1].front).toContain('갱신');
});
it('reads accumulated 1000-note decks without losing cards or raw note fields', () => {
  const result = readAnkiPackage(ankiFixture(SQL, true, 1000), SQL);
  expect(result.items).toHaveLength(1001); expect(result.skipped).toHaveLength(0); expect(result.items.at(-1)?.source.guid).toBe('guid-1000');
});
it('refuses broken packages and never executes foreign HTML', () => {
  expect(() => readAnkiPackage(strToU8('broken'), SQL)).toThrow();
  expect(ankiText('<p> 앞 &lt;x&gt; </p><iframe>hidden</iframe><script>bad()</script> 뒤')).toBe(' 앞 <x> \n 뒤');
});
it('rejects a Zstandard frame requiring an oversized history allocation before decoding', () => {
  const hugeWindow = new Uint8Array([0x28, 0xb5, 0x2f, 0xfd, 0, 255, 1, 0, 0]);
  const file = zipSync({ 'collection.anki21b': hugeWindow, meta: new Uint8Array([8, 3]) });
  expect(() => readAnkiPackage(file, SQL)).toThrow(/메모리/);
});
