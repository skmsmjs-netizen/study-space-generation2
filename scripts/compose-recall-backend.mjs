import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { transform } from 'esbuild';
// Preserve already-deployed parallel features while replacing the recall domain only.
const [baselinePath, candidatePath, outputPath] = process.argv.slice(2);
if (!outputPath) throw Error('Usage: node scripts/compose-recall-backend.mjs baseline candidate output');
const baseline = await readFile(baselinePath, 'utf8'), candidate = await readFile(candidatePath, 'utf8');
const range = (text, start, end) => {
  const a = text.indexOf(start), b = text.indexOf(end, a + start.length);
  if (a < 0 || b < 0 || text.indexOf(start, a + start.length) >= 0) throw Error(`Ambiguous source anchor: ${start}`);
  return text.slice(a, b);
};
let result = baseline;
const protectedBlocks = [];
const replace = (start, end, replacement) => {
  const original = range(result, start, end);
  protectedBlocks.push({ start, end, original, replacement });
  result = result.replace(original, replacement);
};
const cloze = range(candidate, '// src/domain/recall-cloze.ts\n', '// node_modules/ts-fsrs/');
if (baseline.includes('// src/domain/recall-cloze.ts')) throw Error('Baseline already includes cloze: obtain a new canonical build instead.');
replace('// src/domain/recall-scheduler.ts\n', '\n// src/domain/', cloze + range(candidate, '// src/domain/recall-scheduler.ts\n', '\n// src/domain/'));
replace('  if ((state.recallPreferences ?? []).filter', '  for (const row of state.memos ?? [])', range(candidate, '  if ((state.recallPreferences ?? []).filter', '  for (const row of state.memos ?? [])'));
const canonicalName = /function (canonical\d*)\(value\)/.exec(range(baseline, '// src/domain/commands.ts\n', '// src/server/state-codec.ts\n'))?.[1];
if (!canonicalName) throw Error('Canonical command function not found');
replace('    case "saveRecallPreferences": {', '    case "saveCodeExample": {', range(candidate, '    case "saveRecallPreferences": {', '    case "saveCodeExample": {').replace(/\bcanonical\(/g, `${canonicalName}(`));
const capabilities = /var supportedCommands = (\[[^\n]+\]);/.exec(result);
if (!capabilities) throw Error('Capabilities not found');
const previous = JSON.parse(capabilities[1]);
const next = [...new Set([...previous, 'saveRecallCloze', 'setRecallCardStatus', 'importRecallCards'])];
const capabilityChange = `var supportedCommands = ${JSON.stringify(next)};`;
result = result.replace(capabilities[0], capabilityChange);
// Reversing our exact replacements must reproduce every byte of the live baseline.
let restored = result.replace(capabilityChange, capabilities[0]);
for (const block of [...protectedBlocks].reverse()) restored = restored.replace(block.replacement, block.original);
if (restored !== baseline) throw Error('Non-recall deployed source changed');
await transform(result, { loader: 'ts', format: 'esm', target: 'es2022' });
await writeFile(outputPath, result);
const hash = text => createHash('sha256').update(text).digest('hex');
await writeFile(`${outputPath}.preservation.json`, JSON.stringify({ baselineSHA256: hash(baseline), outputSHA256: hash(result), existingCommands: previous, addedCommands: next.filter(c => !previous.includes(c)), nonRecallBytesPreserved: true, blocks: protectedBlocks.map(({ start, end }) => ({ start, end })) }, null, 2));
console.log(`Preserved ${previous.length} commands; added ${next.length - previous.length}; ${hash(result)}`);
