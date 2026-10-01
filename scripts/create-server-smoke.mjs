import { build } from 'esbuild';
import { writeFile } from 'node:fs/promises';
const compiled = await build({ stdin: { contents: "export {applyCommand} from './src/domain/commands'; export {emptyState} from './src/domain/model';", resolveDir: process.cwd(), loader: 'ts' }, bundle: true, format: 'esm', platform: 'node', write: false });
const { applyCommand, emptyState } = await import('data:text/javascript;base64,' + Buffer.from(compiled.outputFiles[0].text).toString('base64'));
const user = '60000000-0000-4000-8000-000000000001';
const command = { type: 'addSubject', id: 'backend-smoke-subject', name: '서버 검증용 가상 과목', scope: {kind:'independent'}, userId: user, namespace:'test', opId:'backend-smoke-one', at:'2026-09-30T01:00:00.000Z' };
const state = applyCommand(emptyState(user,'test'), command);
const sqlString = value => "'" + value.replaceAll("'", "''") + "'";
const argumentsSql = `'${user}', 'test', 0, '${command.opId}', ${sqlString(state.appliedOps[command.opId])}, ${sqlString(JSON.stringify(state))}::jsonb`;
const sql = `-- Synthetic identities and rows exist only inside this rolled-back transaction.
BEGIN;
INSERT INTO auth.users(id,raw_user_meta_data) VALUES('${user}','{"display_name":"서버 시험 계정"}'::jsonb);
SET LOCAL ROLE service_role;
SELECT public.study_commit(${argumentsSql});
SELECT public.study_commit(${argumentsSql});
DO $$ BEGIN
  IF (SELECT sequence FROM public.study_workspaces WHERE user_id='${user}' AND namespace='test') <> 1 THEN RAISE EXCEPTION 'duplicate applied'; END IF;
  IF (SELECT count(*) FROM public.study_operations WHERE user_id='${user}') <> 1 THEN RAISE EXCEPTION 'receipt duplicated'; END IF;
  BEGIN
    PERFORM public.study_commit('${user}','test',0,'backend-smoke-two','new payload',${sqlString(JSON.stringify({...state, appliedOps:{...state.appliedOps,'backend-smoke-two':'new payload'}}))}::jsonb);
    RAISE EXCEPTION 'stale write accepted';
  EXCEPTION WHEN OTHERS THEN IF SQLERRM NOT LIKE '%VERSION_CONFLICT%' THEN RAISE; END IF; END;
END $$;
RESET ROLE;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','${user}',true);
DO $$ BEGIN
  IF (SELECT count(*) FROM public.study_workspaces WHERE user_id='${user}') <> 1 THEN RAISE EXCEPTION 'owner read failed'; END IF;
  BEGIN
    UPDATE public.study_workspaces SET sequence=99 WHERE user_id='${user}';
    RAISE EXCEPTION 'direct write accepted';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  BEGIN
    PERFORM public.study_commit(${argumentsSql});
    RAISE EXCEPTION 'browser raw RPC accepted';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
SELECT set_config('request.jwt.claim.sub','60000000-0000-4000-8000-000000000002',true);
DO $$ BEGIN
  IF (SELECT count(*) FROM public.study_workspaces WHERE user_id='${user}') <> 0 THEN RAISE EXCEPTION 'foreign owner exposed'; END IF;
END $$;
RESET ROLE;
ROLLBACK;
SELECT 'live_rollback_check_passed' AS result;
`;
await writeFile('supabase/tests/online-storage.sql',sql);
