import { build, transform } from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const before = await readFile('supabase/functions/study-command/production-base.js', 'utf8');
const digest = createHash('sha256').update(before).digest('hex');
if (digest !== '1773e73b9102264a3104137f8a6e46e21fa775c3ff4b516bd3e09dc95850d82f') throw Error('Production v34 changed; fetch and review the latest baseline before composing.');
const helper = await build({ stdin: { contents: `export * from './src/server/account-withdrawal'; export * from './src/server/withdrawal-status';`, resolveDir: process.cwd(), loader: 'ts' }, bundle: true, write: false, format: 'esm', platform: 'neutral', target: 'es2022', external: ['../domain/model'] });
let support = helper.outputFiles[0].text;
const domainImport = 'import { DomainError } from "../domain/model";';
if (support.split(domainImport).length !== 2) throw Error('Review helper dependencies.');
support = support.replace(domainImport, '').replace(/export \{([\s\S]*?)\};\s*$/, 'return {$1};');
let next = before;
function replace(old, value) {
  if (next.split(old).length !== 2) throw Error(`Expected one production patch target: ${old.slice(0,80)}`);
  next = next.replace(old, value);
}
replace('    if (collection === "studyBoards") next.studyBoards ??= [];', '    if (collection === "conceptCatalogs") next.conceptCatalogs ??= [];\n    if (collection === "conceptEditions") next.conceptEditions ??= [];\n    if (collection === "conceptBatches") next.conceptBatches ??= [];\n    if (collection === "studyBoards") next.studyBoards ??= [];');
replace('      await backend.withdrawAccount(userId);\n      return json({ withdrawn: true });', `      if (body.requestId !== undefined && !withdrawalSupport.validWithdrawalId(body.requestId)) throw new DomainError('INVALID_REQUEST', '탈퇴 확인 번호를 확인해 주세요.');
      const result = await backend.withdrawAccount(userId, body.requestId);
      if (result && !result.withdrawn && body.requestId === undefined) throw new DomainError('SERVER_ERROR', '첨부 파일을 정리하고 있습니다. 탈퇴 처리를 다시 시도해 주세요.');
      return json(result ?? { withdrawn: true }, result && !result.withdrawn ? 202 : 200);`);
replace('  async withdrawAccount(userId) {\n    await admin("rpc/study_withdraw_account", { method: "POST", body: JSON.stringify({ p_user: userId }) });\n  },', `  async withdrawAccount(userId, requestId = crypto.randomUUID()) {
    return withdrawalSupport.withdrawAccountFiles({
      begin: (id, receipt) => admin('rpc/study_begin_withdrawal', { method: 'POST', body: JSON.stringify({ p_user: id, p_request: receipt }) }),
      batch: id => admin('rpc/study_withdraw_storage_batch', { method: 'POST', body: JSON.stringify({ p_user: id }) }),
      finish: async id => { await admin('rpc/study_withdraw_account', { method: 'POST', body: JSON.stringify({ p_user: id }) }); },
      async remove(bucket, names) {
        const response = await fetch(\`\${url}/storage/v1/object/\${encodeURIComponent(bucket)}\`, {
          method: 'DELETE', headers: { apikey: service, Authorization: \`Bearer \${service}\`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ prefixes: names }), signal: AbortSignal.timeout(12000),
        });
        if (!response.ok) throw new DomainError('SERVER_ERROR', '첨부 파일 정리를 마치지 못했습니다. 계정과 이 기기의 기록은 아직 삭제하지 않았습니다. 탈퇴 처리를 다시 시도해 주세요.');
      },
    }, userId, requestId);
  },`);
replace('Deno.serve((request) => handleCommand(request, {', `const withdrawalSupport = (() => {\n${support}\n})();
Deno.serve((request) => new URL(request.url).pathname.endsWith('/withdrawal-status')
  ? withdrawalSupport.handleWithdrawalStatus(request, requestId => admin('rpc/study_withdrawal_status', { method: 'POST', body: JSON.stringify({ p_request: requestId }) }))
  : handleCommand(request, {`);
// Syntax validation does not rewrite the pinned domain/request/conditional-load code.
await transform(next, { loader: 'js', target: 'es2022' });
await writeFile('supabase/functions/study-command/index.ts', next);
await mkdir('work/final-integration', { recursive: true });
await writeFile('work/final-integration/production-composition.json', JSON.stringify({ baseVersion: 34, baseSha256: digest, candidateSha256: createHash('sha256').update(next).digest('hex'), preserved: ['domain except three collection initializers', 'conditional load', 'request body limits', 'command catalog', 'state codec', 'photo outline helpers'], changed: ['three initializers', 'withdrawal response', 'Storage-first withdrawal', 'random receipt completion route'] }, null, 2));
console.log('Production study-command composed from verified v34 with scoped patches.');
