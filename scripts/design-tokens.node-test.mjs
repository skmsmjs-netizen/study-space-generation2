import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { checkDesignTokens, readStyles } from './check-design-tokens.mjs';

const tokens = {
  file: 'src/ui/tokens.css',
  css: ':root { --color-text:#333; --color-surface:#fff; --space-2:8px; --radius-sm:4px; --font-reading:serif; --type-body-size:1rem; --border-width:1px; }',
};
const inspect = (css) => checkDesignTokens([tokens, { file: 'src/example.css', css }]);

for (const [name, declaration] of Object.entries({
  'hex color': 'color:#fe12ac',
  'named color': 'background:rebeccapurple',
  'color function': 'color:oklch(60% .1 240)',
  'gradient palette': 'background:linear-gradient(to right,var(--color-text),rgb(1 2 3))',
  'font shorthand': 'font:600 22px/1.5 Arial',
  'font family': 'font-family:"New Font"',
  'font weight': 'font-weight:650',
  'line height': 'line-height:1.7',
  spacing: 'gap:15px',
  'negative spacing': 'margin-inline-start:-.5rem',
  'calc literal': 'padding:calc(var(--space-2) + 3px)',
  'variable fallback': 'padding:var(--space-2,15px)',
  'nested fallback': 'gap:var(--space-2,var(--space-2,3rem))',
  'logical radius': 'border-start-end-radius:10px',
  'radius shorthand': 'border-radius:0 12px / 8px',
  shadow: 'box-shadow:0 3px 10px var(--color-text)',
  'unknown token': 'color:var(--color-typo)',
  'unknown token despite fallback': 'width:var(--layout-typo,40rem)',
})) {
  test(`rejects ${name}`, () =>
    assert.ok(inspect(`.x { ${declaration}; }`).errors.length, declaration));
}

test('follows local aliases without letting an arbitrary name conceal literals', () => {
  const result = inspect(
    '.x { --first:var(--second); --second:15px; gap:var(--first); --paint:red; color:var(--paint); }',
  );
  assert.ok(result.errors.some((error) => error.message.includes('--second')));
  assert.ok(result.errors.some((error) => error.message.includes('--paint')));
});
test('allows common tokens, zero, proportional and data geometry, safe areas and math multipliers', () => {
  assert.deepEqual(
    inspect(`
    /* A comment containing color:#abc and margin:13px is not a declaration. */
    .x { color:var(--color-text); background:transparent; padding:0 0px var(--space-2);
      margin:calc(var(--space-2) * -2) auto; gap:2%; width:calc(100% - 35px);
      height:390px; grid-template-columns:repeat(auto-fit,minmax(140px,1fr));
      left:calc(var(--outline-indent) * var(--space-2)); transform:translate(32px,15px);
      padding-bottom:calc(var(--space-2) + env(safe-area-inset-bottom,0px));
      border-radius:0 var(--radius-sm); font:inherit; line-height:normal;
      content:"red 15px"; background-image:url("data:image/svg+xml,<svg fill='#f00'/>"); }
    @media(max-width:600px) { .x { width:100%; } }
  `).errors,
    [],
  );
});
test('allows local role aliases, nested token fallbacks and color mixing', () => {
  assert.deepEqual(
    inspect(
      '.x { --paint:var(--color-text); --indent:var(--space-2); color:var(--paint); gap:var(--indent); background:linear-gradient(transparent 50%,color-mix(in srgb,var(--color-text) 24%,transparent)); padding:var(--space-2,var(--space-2)); }',
    ).errors,
    [],
  );
});
test('keeps forced-color system values restricted to the accessibility media query', () => {
  assert.deepEqual(
    inspect('@media (forced-colors: active) { .x { color:ButtonText; border-color:CanvasText; } }')
      .errors,
    [],
  );
  assert.ok(inspect('.x { color:ButtonText; }').errors.length);
});
test('a documented exception applies to just the next matching declaration', () => {
  const result = inspect(
    '.x { /* design-token-exception: padding -- external embedding requires fixed offsets */ padding:7px; margin:7px; }',
  );
  assert.equal(result.exceptions.length, 1);
  assert.equal(result.errors.length, 1);
  assert.ok(result.errors[0].message.includes('margin'));
});
test('an exception cannot hide a broken token reference', () => {
  assert.ok(
    inspect(
      '.x { /* design-token-exception: color -- embedding palette has fixed requirements */ color:var(--color-missing,#fff); }',
    ).errors.some((error) => error.message.includes('--color-missing')),
  );
});
test('requires a reason and matching property for a scoped exception', () => {
  assert.ok(inspect('.x { /* design-token-exception: padding */ padding:7px; }').errors.length);
  assert.ok(
    inspect(
      '.x { /* design-token-exception: margin -- external layout requirements */ padding:7px; }',
    ).errors.length,
  );
});
test('reports malformed CSS and requires the token source', () => {
  assert.ok(
    inspect('.x { color:var(--color-text);').errors.some((error) =>
      error.message.includes('CSS parse'),
    ),
  );
  assert.ok(
    checkDesignTokens([{ file: 'src/a.css', css: '.a { margin:0; }' }]).errors.some(
      (error) => error.file === tokens.file,
    ),
  );
});
test('scans nested source files and CLI fails on violations without mutating source', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'study-design-guard-'));
  try {
    mkdirSync(path.join(root, 'src/ui'), { recursive: true });
    writeFileSync(path.join(root, tokens.file), tokens.css);
    const file = path.join(root, 'src/ui/new.css');
    const bad = '.new { gap:15px; }';
    writeFileSync(file, bad);
    assert.equal(readStyles(root).length, 2);
    const script = fileURLToPath(new URL('./check-design-tokens.mjs', import.meta.url));
    const result = spawnSync(process.execPath, [script, '--root', root], { encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /src\/ui\/new\.css:1/);
    assert.equal(readFileSync(file, 'utf8'), bad);
    writeFileSync(file, '.new { gap:var(--space-2); }');
    assert.equal(spawnSync(process.execPath, [script, '--root', root]).status, 0);
    // readStyles and the CLI read only; the test fixture is always cleaned up.
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
