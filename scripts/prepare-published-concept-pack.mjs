/** User-authorized publication: derived reading content, never the private ledger. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const input = resolve(root, process.argv[2] || 'src/data/concept-reading-pack.json');
const output = resolve(root, 'src/data/concept-reading-pack.published.json');
const sha = value => createHash('sha256').update(value).digest('hex');
const sourceBytes = await readFile(input);
assert.equal(sha(sourceBytes), 'b02a7f2af316827a1e93e781f58bea7237320f9294dbae669e6db614078e625e', '검토된 전집 판본을 확인해 주세요.');
const original = JSON.parse(sourceBytes);
assert.equal(sha(original.catalog.raw), original.sourceSha256);
assert.equal(sha(JSON.stringify({ catalog: original.catalog, editions: original.editions })), original.payloadSha256);
const bundle = await build({absWorkingDir: root, stdin: {
  contents: "export {projectPublishedConceptSource} from './src/domain/concept-publication'; export {validateConceptCatalog,validateConceptEdition,conceptEditionId} from './src/domain/concept-production';",
  resolveDir: root, loader: 'ts',
}, bundle:true, platform:'node', format:'esm', write:false});
const api = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
const raw = api.projectPublishedConceptSource(original.catalog.raw);
const sourceSha256 = sha(raw);
const catalog = {id:`concept-catalog:${sourceSha256}`, raw, sha256:sourceSha256, filename:'개념 전집 · 배포용.json'};
api.validateConceptCatalog(catalog);
const editions = original.editions.map(reference => {
  api.validateConceptEdition(reference);
  const row = structuredClone(reference);
  row.catalogId = catalog.id;
  row.id = api.conceptEditionId(catalog.id, row.sourceId);
  row.jobId = null;
  row.promptVersion = 'concept-reading-published-v1';
  delete row.createdAt;
  delete row.updatedAt;
  delete row.deletedAt;
  if (row.screen.design) row.screen.design.sourceSha256 = sourceSha256;
  api.validateConceptEdition(row);
  return row;
});
assert.equal(editions.length,1168);
assert.equal(new Set(editions.map(row=>row.sourceId)).size,1168);
assert.equal(editions.reduce((count,row)=>count+row.screen.scenes.length,0),1851);
const payload = {catalog,editions};
const published = {format:'concept-reading-pack',version:1,distribution:'published',
  originalSourceSha256:original.sourceSha256,sourceSha256,
  canonicalSha256:original.canonicalSha256,payloadSha256:sha(JSON.stringify(payload)),...payload};
const bytes = JSON.stringify(published)+'\n';
assert(!/"(?:notePath|annotations|userId|namespace|appliedOps|revisions)"\s*:/.test(bytes));
assert(!/\/Users\/|file:\/\/|obsidian:\/\//.test(bytes));
for (let i=0;i<editions.length;i++) {
  const restored=structuredClone(editions[i]);
  restored.catalogId=original.editions[i].catalogId;
  restored.id=original.editions[i].id;
  if(restored.screen.design) restored.screen.design.sourceSha256=original.sourceSha256;
  const reference=structuredClone(original.editions[i]);
  for(const key of ['jobId','promptVersion','createdAt','updatedAt','deletedAt']) {
    delete reference[key]; delete restored[key];
  }
  assert.deepEqual(restored,reference,'설명/조건/근거/장면/판본을 바꾸지 않습니다.');
}
await writeFile(output,bytes);
assert.equal(await readFile(output,'utf8'),bytes);
const report={published:true,concepts:1168,scenes:1851,assetSha256:sha(bytes),bytes:Buffer.byteLength(bytes),
  originalSourceSha256:original.sourceSha256,distributionSourceSha256:sourceSha256,
  originalIdsPreserved:true,allEditionContentUnchanged:true,
  sourceFields:['id','name','def','ex','insight','type','cat'],
  excluded:['source provenance metadata','categories metadata','origin','tier','pool','hold','notePath','annotations','relations','userId','namespace','revisions','appliedOps','jobId values','createdAt','updatedAt','deletedAt','private promptVersion']};
await mkdir(resolve(root,'work/concept-pages-20261003'),{recursive:true});
await writeFile(resolve(root,'work/concept-pages-20261003/distribution-verification.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
