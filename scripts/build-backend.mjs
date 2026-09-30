import { build } from 'esbuild';
await build({ entryPoints: ['supabase/functions/study-command/entry.ts'], outfile: 'supabase/functions/study-command/index.ts', bundle: true, format: 'esm', platform: 'neutral', mainFields: ['module','main'], target: 'es2022' });
