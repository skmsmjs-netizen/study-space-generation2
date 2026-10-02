import { unzipSync } from 'fflate';
import { Decompress } from 'fzstd';
import { Parser } from 'htmlparser2';
import Mustache from 'mustache';
import { Reader } from 'protobufjs/minimal';
import type { Database, SqlJsStatic, SqlValue } from 'sql.js';
import type { RecallImportItem } from '../domain/model';
import { clozeNumbers, renderCloze } from '../domain/recall-cloze';

export const ANKI_FILE_LIMIT = 128 * 1024 * 1024;
const DB_LIMIT = 32 * 1024 * 1024, CARD_LIMIT = 20000;
export type AnkiPreview = { items: RecallImportItem[]; total: number; skipped: { key: string; reason: string }[]; warnings: string[]; format: string };
/** Parse HTML as data only: never mount a foreign template or run its scripts. */
export function ankiText(html: string) {
  let output = '', hidden = 0;
  const parser = new Parser({
    onopentag(name, attrs) {
      if (['script', 'style', 'iframe', 'object'].includes(name)) hidden++;
      if (!hidden && ['br', 'hr'].includes(name)) output += '\n';
      if (!hidden && ['img', 'audio', 'video'].includes(name)) output += `[자료: ${attrs.alt || attrs.src || name}]`;
    },
    ontext(text) { if (!hidden) output += text; },
    onclosetag(name) { if (['script', 'style', 'iframe', 'object'].includes(name)) hidden = Math.max(0, hidden - 1); if (!hidden && ['div', 'p', 'li', 'tr'].includes(name)) output += '\n'; },
  }, { decodeEntities: true });
  parser.write(html); parser.end();
  return output.replace(/\[sound:([^\]]+)\]/g, '[음성: $1]');
}
function protobufFields(bytes: Uint8Array) {
  const reader = Reader.create(bytes), values = new Map<number, string | number>();
  while (reader.pos < reader.len) { const tag = reader.uint32(), wire = tag & 7, field = tag >>> 3;
    if (wire === 0) values.set(field, reader.uint32()); else if (wire === 2) values.set(field, reader.string()); else reader.skipType(wire);
  }
  return values;
}
type Model = { name: string; type: number; flds: { name: string; ord: number }[]; tmpls: { ord: number; qfmt: string; afmt: string }[] };
function rows(db: Database, sql: string) {
  const statement = db.prepare(sql), result: Record<string, SqlValue>[] = [];
  try { while (statement.step()) { result.push(statement.getAsObject()); if (result.length > CARD_LIMIT) throw Error('카드가 20,000개를 넘습니다. Anki에서 덱을 나누어 내보낸 뒤 가져와 주세요.'); } }
  finally { statement.free(); }
  return result;
}
function models(db: Database, modern: boolean): Map<string, Model> {
  if (!modern) return new Map(Object.entries(JSON.parse(String(rows(db, 'SELECT models FROM col')[0].models))));
  const result = new Map<string, Model>();
  for (const row of rows(db, 'SELECT CAST(id AS TEXT) AS id, name, config FROM notetypes')) result.set(String(row.id), { name: String(row.name), type: Number(protobufFields(row.config as Uint8Array).get(1) ?? 0), flds: [], tmpls: [] });
  for (const row of rows(db, 'SELECT CAST(ntid AS TEXT) AS ntid, ord, name FROM fields ORDER BY ntid, ord')) result.get(String(row.ntid))?.flds.push({ name: String(row.name), ord: Number(row.ord) });
  for (const row of rows(db, 'SELECT CAST(ntid AS TEXT) AS ntid, ord, config FROM templates ORDER BY ntid, ord')) { const config = protobufFields(row.config as Uint8Array); result.get(String(row.ntid))?.tmpls.push({ ord: Number(row.ord), qfmt: String(config.get(1) ?? ''), afmt: String(config.get(2) ?? '') }); }
  return result;
}
function render(template: string, fields: { name: string; value: string }[], deck: string, model: Model, ordinal: number, answer: boolean, frontSide = '') {
  if (template.length > 100000) throw Error('카드 서식이 너무 깁니다.');
  const view: Record<string, unknown> = Object.create(null);
  for (const field of fields) view[field.name] = field.value;
  Object.assign(view, { FrontSide: frontSide, Deck: deck, Subdeck: deck.split('::').at(-1), Type: model.name, Tags: '', Card: String(ordinal + 1) });
  const filtered = template.replace(/\{\{(text|type|cloze|hint):([^{}]+)\}\}/g, (_, filter: string, name: string) => {
    const field = fields.find(f => f.name === name);
    if (!field) throw Error(`서식의 ${name} 필드를 찾지 못했습니다.`);
    const key = `filtered_${Object.keys(view).length}`;
    view[key] = filter === 'cloze' ? renderCloze(field.value, ordinal + 1, answer) : filter === 'text' ? ankiText(field.value) : filter === 'hint' && !answer ? `[${name}]` : field.value;
    return `{{${key}}}`;
  });
  if (/\{\{[^{}]*:[^{}]*\}\}/.test(filtered)) throw Error('이 카드가 사용하는 Anki 필터는 아직 지원하지 않습니다.');
  const tokens = Mustache.parse(filtered);
  const inspect = (list: ReturnType<typeof Mustache.parse>, depth = 0) => {
    if (depth > 8) throw Error('겹친 카드 조건이 너무 많습니다.');
    for (const token of list) { if (['name', '&', '#', '^'].includes(token[0]) && !Object.hasOwn(view, token[1])) throw Error(`서식의 ${token[1]} 필드를 찾지 못했습니다.`); if (token[0] === '>') throw Error('외부 서식을 사용하는 카드는 지원하지 않습니다.'); if (Array.isArray(token[4])) inspect(token[4], depth + 1); }
  };
  inspect(tokens);
  return Mustache.render(filtered, view, undefined, { escape: value => String(value) });
}
/** Bound every Zstandard frame before the decoder allocates its history window. */
function assertZstdLimit(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let pos = 0;
  while (pos < bytes.length) {
    if (pos + 5 > bytes.length || view.getUint32(pos, true) !== 0xfd2fb528) throw Error('Zstandard 카드 데이터를 읽지 못했습니다.');
    pos += 4; const descriptor = bytes[pos++], single = !!(descriptor & 32), flag = descriptor >>> 6;
    if (descriptor & 8) throw Error('지원하지 않는 Zstandard 버전입니다.');
    if (!single) { const window = bytes[pos++], base = 2 ** (10 + (window >>> 3)); if (base + base / 8 * (window & 7) > DB_LIMIT) throw Error('압축 자료의 메모리 요구가 읽기 한도를 넘습니다.'); }
    const dictionarySize = [0, 1, 2, 4][descriptor & 3]; pos += dictionarySize;
    const sizeBytes = flag ? 2 ** flag : single ? 1 : 0;
    let size = 0; for (let i = 0; i < sizeBytes; i++) { if (pos >= bytes.length) throw Error('압축 자료의 헤더가 끊겼습니다.'); size += bytes[pos++] * 2 ** (i * 8); }
    if (sizeBytes === 2) size += 256;
    if (size > DB_LIMIT) throw Error('압축을 푼 카드 데이터가 32MB를 넘습니다.');
    let last = false;
    while (!last) { if (pos + 3 > bytes.length) throw Error('압축 자료가 끊겼습니다.'); const header = bytes[pos] | bytes[pos + 1] << 8 | bytes[pos + 2] << 16; pos += 3; last = !!(header & 1); const type = header >>> 1 & 3; if (type === 3) throw Error('지원하지 않는 압축 블록입니다.'); pos += type === 1 ? 1 : header >>> 3; }
    if (descriptor & 4) pos += 4;
    if (pos > bytes.length) throw Error('압축 자료가 끊겼습니다.');
  }
}
export function readAnkiPackage(bytes: Uint8Array, SQL: SqlJsStatic): AnkiPreview {
  if (bytes.length > ANKI_FILE_LIMIT) throw Error('파일이 128MB를 넘습니다. Anki에서 덱을 나누거나 미디어를 제외해 내보내 주세요.');
  let extracted = 0;
  const files = unzipSync(bytes, { filter: file => {
    if (!['collection.anki2', 'collection.anki21', 'collection.anki21b', 'meta'].includes(file.name)) return false;
    extracted += file.originalSize;
    if (file.originalSize > DB_LIMIT || extracted > DB_LIMIT * 2) throw Error('압축을 푼 카드 자료가 읽기 한도를 넘습니다. 덱을 나누어 내보내 주세요.');
    return true;
  } });
  const filename = ['collection.anki21b', 'collection.anki21', 'collection.anki2'].find(name => files[name]);
  if (!filename) throw Error('Anki 카드 데이터가 없습니다. .apkg 덱 파일을 선택해 주세요.');
  if (files.meta && ![1, 2, 3].includes(Number(protobufFields(files.meta).get(1)))) throw Error('지원하지 않는 Anki 패키지 버전입니다. 호환 형식으로 내보내 주세요.');
  let database = files[filename];
  if (filename === 'collection.anki21b') {
    assertZstdLimit(database);
    const chunks: Uint8Array[] = []; let total = 0;
    const decoder = new Decompress(chunk => { total += chunk.length; if (total > DB_LIMIT) throw Error('카드 데이터가 32MB를 넘습니다. 덱을 나누어 주세요.'); chunks.push(chunk); });
    for (let start = 0; start < database.length; start += 65536) decoder.push(database.subarray(start, start + 65536), start + 65536 >= database.length);
    database = new Uint8Array(total); let offset = 0; for (const chunk of chunks) { database.set(chunk, offset); offset += chunk.length; }
  }
  if (new TextDecoder().decode(database.subarray(0, 16)) !== 'SQLite format 3\0') throw Error('Anki 카드 데이터 형식을 읽지 못했습니다. 원본 파일은 변경하지 않았습니다.');
  const db = new SQL.Database(database);
  try {
    db.run('PRAGMA query_only=ON; PRAGMA trusted_schema=OFF;');
    const version = Number(rows(db, 'SELECT ver FROM col')[0]?.ver);
    if (version !== 11 && version !== 18) throw Error(`Anki 데이터 버전 ${version}은 아직 지원하지 않습니다. Anki에서 호환 형식으로 다시 내보내 주세요.`);
    const modelMap = models(db, version === 18);
    // biome-ignore lint/suspicious/noControlCharactersInRegex: Anki uses byte 0x1f as a documented deck-name separator; preserve the importer's exact delimiter.
    const deckMap = version === 18 ? new Map(rows(db, 'SELECT CAST(id AS TEXT) AS id, name FROM decks').map(row => [String(row.id), String(row.name).replace(/\x1f/g, '::')])) : new Map(Object.entries(JSON.parse(String(rows(db, 'SELECT decks FROM col')[0].decks))).map(([id, row]) => [id, String((row as { name: string }).name)]));
    const notes = new Map(rows(db, 'SELECT CAST(id AS TEXT) AS id, guid, CAST(mid AS TEXT) AS mid, tags, flds FROM notes').map(row => [String(row.id), row]));
    const cards = rows(db, 'SELECT CAST(nid AS TEXT) AS nid, CAST(did AS TEXT) AS did, CAST(odid AS TEXT) AS odid, ord FROM cards ORDER BY id');
    const result: AnkiPreview = { items: [], total: cards.length, skipped: [], warnings: [], format: filename };
    const sourceKeys = new Set<string>();
    for (const card of cards) {
      const note = notes.get(String(card.nid)), model = note && modelMap.get(String(note.mid)), ordinal = Number(card.ord), guid = String(note?.guid ?? '');
      const key = `anki:${guid}:${ordinal}`;
      try {
        if (!note || !model || !guid || !Number.isSafeInteger(ordinal) || ordinal < 0 || ordinal > 998) throw Error('카드와 원본 노트의 연결을 확인하지 못했습니다.');
        if (sourceKeys.has(key)) throw Error('같은 원본 카드가 파일 안에 중복되어 있습니다.');
        sourceKeys.add(key);
        const values = String(note.flds).split('\x1f'), fields = model.flds.map((field, i) => ({ name: field.name, value: values[field.ord ?? i] ?? '' }));
        if (values.length !== fields.length) throw Error('원본 필드 수와 카드 서식이 다릅니다.');
        const template = model.tmpls.find(t => t.ord === (model.type === 1 ? 0 : ordinal));
        if (!template) throw Error('카드 서식이 없습니다.');
        const deck = deckMap.get(String(card.odid !== 0 && card.odid !== '0' ? card.odid : card.did)) ?? '가져온 덱';
        const q = render(template.qfmt, fields, deck, model, ordinal, false), a = render(template.afmt, fields, deck, model, ordinal, true, q);
        const front = ankiText(q), reference = ankiText(a);
        if (!front.trim() || /^\[자료:[^\]]+\]\s*$/.test(front) || /\{\{[^}]*\}\}/.test(front)) throw Error('텍스트로 표시할 질문이 없습니다. 이미지 가리기나 별도 서식이 필요할 수 있습니다.');
        let cloze: RecallImportItem['cloze'];
        if (model.type === 1) {
          const fieldName = template.qfmt.match(/\{\{cloze:([^{}]+)\}\}/)?.[1], raw = fields.find(field => field.name === fieldName)?.value;
          if (!raw) throw Error('빈칸 원문을 찾지 못했습니다.');
          const source = ankiText(raw);
          if (!clozeNumbers(source).includes(ordinal + 1)) throw Error('이 카드의 빈칸 번호가 원문에 없습니다.');
          cloze = { noteId: `anki-note:${guid}`, source, number: ordinal + 1 };
        }
        const source = { key, guid, ordinal, deck, noteType: model.name, tags: String(note.tags), fields, questionTemplate: template.qfmt, answerTemplate: template.afmt, originalFront: front, originalReference: reference, ...(cloze ? { originalCloze: cloze.source } : {}) };
        if (front.length > 100000 || reference.length > 100000 || JSON.stringify(source).length > 300000) throw Error('카드 원문이 한 장의 저장 한도를 넘습니다.');
        if (/\[자료:|\[음성:/.test(front + reference)) result.warnings.push('그림·음성은 파일명으로 표시합니다. 미디어 파일은 가져오지 않습니다.');
        if (/<script\b|<iframe\b/i.test(template.qfmt + template.afmt)) result.warnings.push('동작 코드와 외부 화면은 실행하지 않고 텍스트만 가져옵니다.');
        result.items.push({ id: '', topicId: '', front, reference, source, ...(cloze ? { cloze } : {}) });
      } catch (e) { result.skipped.push({ key, reason: e instanceof Error ? e.message : '카드를 읽지 못했습니다.' }); }
    }
    result.warnings = [...new Set(result.warnings)];
    return result;
  } finally { db.close(); }
}
