import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import postcss from 'postcss';
import './sync-math-observatory.mjs';

const root = new URL('../', import.meta.url);
const baseline = JSON.parse(
  await readFile(new URL('docs/observatory-experience-baseline.json', root), 'utf8'),
);
const mathCSS = postcss.parse(
  await readFile(new URL('src/ui/math-observatory-tokens.css', root), 'utf8'),
);
const commonCSS = postcss.parse(
  await readFile(new URL('src/ui/observatory-ui-tokens.css', root), 'utf8'),
);
const luminance = (color) =>
  color
    .slice(1)
    .match(/../g)
    .map((channel) => parseInt(channel, 16) / 255)
    .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4))
    .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
const contrast = (left, right) => {
  const [high, low] = [luminance(left), luminance(right)].sort((a, b) => b - a);
  return (high + 0.05) / (low + 0.05);
};

for (const [name, material] of Object.entries(baseline.materials)) {
  test(`${name}: text, selection, actions and focus remain legible on their actual material`, () => {
    for (const background of ['canvas', 'surface', 'subtle', 'selected']) {
      for (const foreground of ['text', 'muted', 'primary'])
        assert.ok(
          contrast(material[foreground], material[background]) >= 4.5,
          `${name}.${foreground} on ${background}`,
        );
      for (const boundary of ['borderInteractive', 'focus'])
        assert.ok(
          contrast(material[boundary], material[background]) >= 3,
          `${name}.${boundary} on ${background}`,
        );
    }
    for (const state of ['primary', 'primaryHover', 'primaryPressed'])
      assert.ok(
        contrast(material.onPrimary, material[state]) >= 4.5,
        `${name}.onPrimary on ${state}`,
      );
  });
}

test('common and embedded/fullscreen math consumers use materials, not compatibility colors', () => {
  const declarations = new Map();
  commonCSS.walkDecls((decl) => declarations.set(decl.prop, decl.value));
  for (const [material, roles] of Object.entries(baseline.materials))
    for (const [role, value] of Object.entries(roles)) {
      const kebab = role.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      assert.equal(declarations.get(`--observatory-${material}-${kebab}`), value.toLowerCase());
    }
  for (const [role, value] of Object.entries(baseline.pixelTreatment.componentRadiusPx))
    assert.equal(declarations.get(`--observatory-radius-${role}`), value ? `${value}px` : '0');
  assert.equal(
    declarations.get('--observatory-control-height'),
    `${baseline.metrics.control.heightPx}px`,
  );
  const surfaceRules = [];
  mathCSS.walkRules((rule) => {
    const surface = rule.nodes.find(
      (node) => node.type === 'decl' && node.prop === '--math-observatory-surface',
    );
    if (surface) surfaceRules.push(surface.value);
  });
  assert.deepEqual(
    surfaceRules,
    [
      baseline.materials.paper.surface,
      baseline.materials.interior.surface,
      baseline.materials.interior.surface,
    ].map((color) => color.toLowerCase()),
  );
  assert.ok(!mathCSS.toString().includes('workSurfaceColors'));
});

test('type roles consume baseline sizes and alignment while preserving personal font roles and root scaling', async () => {
  const declarations = new Map();
  commonCSS.walkDecls((decl) => declarations.set(decl.prop, decl.value));
  assert.equal(
    declarations.get('--observatory-body-text-align'),
    baseline.metrics.paper.bodyAlignment.textAlign,
  );
  assert.equal(
    declarations.get('--observatory-body-last-line'),
    baseline.metrics.paper.bodyAlignment.lastLine,
  );
  for (const role of ['body', 'label', 'caption', 'heading', 'title']) {
    assert.equal(
      declarations.get(`--observatory-type-${role}-size`),
      `${baseline.metrics.type[role].rem}rem`,
    );
    assert.equal(
      declarations.get(`--observatory-type-${role}-line`),
      String(baseline.metrics.type[role].line),
    );
    assert.equal(
      declarations.get(`--observatory-type-${role}-weight`),
      String(baseline.metrics.type[role].weight),
    );
  }
  assert.equal(
    declarations.get('--observatory-type-title-compact-size'),
    `${baseline.metrics.type.title.compactRem}rem`,
  );
  const workspace = postcss.parse(
    await readFile(new URL('src/ui/observatory-workspace.css', root), 'utf8'),
  );
  const mappings = new Map();
  workspace.walkDecls((decl) => {
    if (decl.parent.selector?.startsWith(':is(')) mappings.set(decl.prop, decl.value);
    if (decl.prop === 'font-family')
      assert.match(
        decl.value,
        /^var\(--font-(?:interface|reading|mono)\)$/,
        '서체 역할은 기존 개인 설정을 소비하며 서체 이름을 강제하지 않는다.',
      );
    assert.ok(!['--font-interface', '--font-reading', '--font-mono'].includes(decl.prop));
    if (decl.prop === 'font-size') assert.ok(decl.parent.selector !== ':root');
  });
  assert.equal(mappings.get('--type-display-size'), 'var(--observatory-type-title-size)');
  assert.equal(
    mappings.get('--type-display-compact-size'),
    'var(--observatory-type-title-compact-size)',
  );
  assert.equal(
    mappings.get('--input-font-size'),
    'max(var(--observatory-input-min-size), var(--type-body-size))',
  );
});
