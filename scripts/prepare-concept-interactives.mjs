import { cp, mkdir, copyFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
const require = createRequire(import.meta.url);
const source = new URL('../src/interactive/math-physics/', import.meta.url);
const target = new URL('../public/tools/concept-interactives/', import.meta.url);
await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true, filter: (file) => !file.endsWith('.d.mts') });
// The app's canonical tokens supply the frame's initial appearance too.
await copyFile(new URL('../src/ui/tokens.css', import.meta.url), new URL('tokens.css', target));
await copyFile(new URL('../src/ui/observatory-ui-tokens.css', import.meta.url), new URL('observatory-ui-tokens.css', target));
await copyFile(new URL('../src/ui/paper-typeface.css', import.meta.url), new URL('paper-typeface.css', target));
await cp(new URL('../src/ui/fonts/paper/', import.meta.url), new URL('fonts/paper/', target), { recursive: true });
const vendor = new URL('vendor/', target);
await mkdir(vendor, { recursive: true });
await copyFile(require.resolve('plotly.js-dist-min'), new URL('plotly.min.js', vendor));
const katexRoot = dirname(require.resolve('katex/package.json'));
for (const name of ['katex.min.css', 'katex.min.js'])
  await copyFile(join(katexRoot, 'dist', name), new URL(name, vendor));
await cp(join(katexRoot, 'dist/fonts'), new URL('fonts/', vendor), { recursive: true });
await copyFile(join(katexRoot, 'LICENSE'), new URL('LICENSE-katex.txt', vendor));
await copyFile(
  join(dirname(require.resolve('plotly.js-dist-min/package.json')), 'LICENSE'),
  new URL('LICENSE-plotly.txt', vendor),
);
