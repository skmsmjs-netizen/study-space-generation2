import { mkdir, copyFile, stat, readFile, writeFile, rename } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const directory = `${root}public/material-ocr`;
await mkdir(directory, { recursive: true });
await copyFile(`${root}node_modules/tesseract.js/dist/worker.min.js`, `${directory}/worker.min.js`);
for (const variant of ['lstm', 'simd-lstm', 'relaxedsimd-lstm']) {
  for (const suffix of ['wasm', 'wasm.js']) await copyFile(`${root}node_modules/tesseract.js-core/tesseract-core-${variant}.${suffix}`, `${directory}/tesseract-core-${variant}.${suffix}`);
}
const hashes = {};
const expected = {kor:'9d454186b4e2556854b625c43e44d93783a5be7ee89eb1dc6702dfbddced3f4f',eng:'ed350f3752f81ee8f38769edc14d92d997dababe23b565c59879372cc46a2468'};
for (const language of ['kor', 'eng']) {
  const target = `${directory}/${language}.traineddata.gz`;
  try { if ((await stat(target)).size > 100000) { const hash = createHash('sha256').update(await readFile(target)).digest('hex'); if (hash === expected[language]) { hashes[language] = hash; continue; } } } catch {}
  const response = await fetch(`https://tessdata.projectnaptha.com/4.0.0/${language}.traineddata.gz`, { signal: AbortSignal.timeout(60000) });
  if (!response.ok) throw Error(`Could not prepare ${language} OCR model. Existing files are preserved.`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length < 100000 || bytes.length > 20_000_000) throw Error('OCR model download is incomplete.');
  if (createHash('sha256').update(bytes).digest('hex') !== expected[language]) throw Error('OCR language model changed or downloaded incompletely. Existing models were preserved.');
  await writeFile(`${target}.part`, bytes); await rename(`${target}.part`, target);
  hashes[language] = createHash('sha256').update(bytes).digest('hex');
}
await writeFile(`${directory}/model-sha256.json`, JSON.stringify(hashes, null, 2));
console.log('Korean/English OCR tools are served by this app. Document contents are processed in the browser.');
