// Decode returned component ledgers without changing any evidence file.
// Usage: node decode-component-ids.cjs INPUT.json [OUTPUT.json]
// Without OUTPUT, prints decoded JSON to stdout. Never auto-writes evidence.
const fs = require('fs');
const lz = require('lz-string');
function decodeNodeIds(value) {
  if (Array.isArray(value)) return value;
  if (!value || value.encoding !== 'figma-id-ranges-v1') return value;
  const ids = [];
  for (const [prefix, runs] of value.groups) {
    for (const run of runs) {
      if (Array.isArray(run)) {
        if (!Number.isSafeInteger(run[0]) || !Number.isSafeInteger(run[1]) || run[1] < run[0]) throw new Error('Invalid ID range');
        for (let number = run[0]; number <= run[1]; number++) ids.push(prefix + number);
      } else ids.push(prefix + run);
    }
  }
  ids.push(...value.literal);
  if (ids.length !== value.count || new Set(ids).size !== value.count) throw new Error('Node ID count mismatch');
  return ids;
}
function decodePayload(value) {
  const data = value?.encoding === 'lz-string-base64-json'
    ? JSON.parse(lz.decompressFromBase64(value.data)) : value;
  for (const key of ['createdNodeIds', 'mutatedNodeIds', 'observedNodeIds']) {
    if (data[key]) data[key] = decodeNodeIds(data[key]);
  }
  return data;
}
module.exports = { decodeNodeIds, decodePayload };
if (require.main === module) {
  const [, , input, output] = process.argv;
  if (!input) throw new Error('Input file required');
  const result = JSON.stringify(decodePayload(JSON.parse(fs.readFileSync(input, 'utf8'))), null, 2) + '\n';
  if (output) fs.writeFileSync(output, result); else process.stdout.write(result);
}
