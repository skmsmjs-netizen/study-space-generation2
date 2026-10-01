import { build } from 'esbuild';
await build({ entryPoints: ['supabase/functions/study-code-terminal/entry.ts'], outfile: 'supabase/functions/study-code-terminal/index.ts', bundle: true, format: 'esm', platform: 'neutral', target: 'es2022' });
await build({ entryPoints: ['supabase/functions/study-command/entry.ts'], outfile: 'supabase/functions/study-command/index.ts', bundle: true, format: 'esm', platform: 'neutral', mainFields: ['module','main'], target: 'es2022' });
await build({ entryPoints: ['supabase/functions/study-code-runner/entry.ts'], outfile: 'supabase/functions/study-code-runner/index.ts', bundle: true, format: 'esm', platform: 'neutral', mainFields: ['module','main'], target: 'es2022' });

await build({ entryPoints: ['supabase/functions/study-ai/entry.ts'], outfile: 'supabase/functions/study-ai/index.ts', bundle: true, format: 'esm', platform: 'neutral', mainFields: ['module','main'], target: 'es2022' });

await build({ entryPoints: ['supabase/functions/study-notifications/entry.ts'], outfile: 'supabase/functions/study-notifications/index.ts', bundle: true, format: 'esm', platform: 'neutral', mainFields: ['module','main'], target: 'es2022', external: ['npm:*'] });
