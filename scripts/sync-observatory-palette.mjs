import { readFile, writeFile } from 'node:fs/promises';
import { format } from 'prettier';
const root = new URL('../', import.meta.url);
const palette = JSON.parse(await readFile(new URL('docs/observatory-palette.json', root), 'utf8'));
const primitives = JSON.parse(await readFile(new URL('docs/color-system.json', root), 'utf8'));
const rgb = new Map(
  primitives.primitives.map((c) => [
    c.cssVariable,
    [1, 3, 5].map((i) => parseInt(c.hex.slice(i, i + 2), 16)),
  ]),
);
const mix = (a, b, weight) => a.map((value, i) => Math.round(value * weight + b[i] * (1 - weight)));
const hex = (value) =>
  '#' +
  value
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
for (const color of palette.colors) {
  const refs = [...color.expression.matchAll(/var\(([-\w]+)\)/g)].map((m) => m[1]);
  const weight = Number(color.expression.match(/ (\d+)%/)?.[1] ?? 100) / 100;
  if (refs.length < 1 || refs.some((ref) => !rgb.has(ref)))
    throw new Error(`Unknown palette source: ${color.name}`);
  const value =
    refs.length === 1 ? rgb.get(refs[0]) : mix(rgb.get(refs[0]), rgb.get(refs[1]), weight);
  rgb.set(color.cssVariable, value);
  color.hex = hex(value);
}
await writeFile(
  new URL('docs/observatory-palette.json', root),
  await format(JSON.stringify(palette), { parser: 'json' }),
);
let css =
  '/* Generated from docs/observatory-palette.json by scripts/sync-observatory-palette.mjs. */\n.study-landscapes {\n';
for (const color of palette.colors) css += `  ${color.cssVariable}: ${color.expression};\n`;
for (const [role, name] of Object.entries(palette.roles))
  css += `  --obs-${role}: var(--observatory-${name});\n`;
css += '  --obs-accent: var(--obs-blue);\n  --obs-horizon: var(--observatory-night-800);\n}\n';
for (const { stage, accent, horizon } of palette.stages) {
  const value =
    horizon === 'final'
      ? 'color-mix(in srgb, var(--obs-coral) 45%, var(--obs-deep))'
      : `var(--observatory-${horizon})`;
  css += `.study-landscapes[data-evolution-stage='${stage - 1}'] {\n  --obs-accent: var(--obs-${accent});\n  --obs-horizon: ${value};\n}\n`;
}
await writeFile(
  new URL('src/ui/observatory-palette.css', root),
  await format(css, { parser: 'css' }),
);
// Swatch values are rounded sRGB equivalents, not replacements for the live primitive aliases.
const colors = Object.fromEntries(palette.colors.map((c) => [c.name, c.hex]));
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="1100" viewBox="0 0 1100 1100">',
  '<rect width="1100" height="1100" fill="#fafafa"/><g font-family="Arial, sans-serif">',
  '<text x="48" y="62" font-size="28" fill="#202020">Observatory · Vermilion Night</text>',
  '<text x="48" y="94" font-size="14" fill="#666">16 foundations → sky / lighting / starlight · from existing Figma primitives</text>',
];
palette.colors.forEach((color, index) => {
  const x = 48 + (index % 8) * 126,
    y = 128 + Math.floor(index / 8) * 155;
  svg.push(
    `<rect x="${x}" y="${y}" width="110" height="88" rx="6" fill="${color.hex}"/>`,
    `<text x="${x}" y="${y + 112}" font-size="13" fill="#333">${escape(color.name)}</text>`,
    `<text x="${x}" y="${y + 132}" font-size="12" fill="#666">${color.hex}</text>`,
  );
});
svg.push(
  '<text x="48" y="470" font-size="18" fill="#333">12 stage accents · same palette, changing light</text>',
);
palette.stages.forEach(({ stage, accent, horizon }) => {
  const x = 48 + (stage - 1) * 84;
  const color = colors[palette.roles[accent]];
  const night =
    horizon === 'final'
      ? hex(mix(rgb.get('--observatory-warm-500'), rgb.get('--observatory-night-950'), 0.45))
      : colors[horizon];
  svg.push(
    `<rect x="${x}" y="494" width="72" height="70" rx="4" fill="${night}"/>`,
    `<rect x="${x + 12}" y="534" width="48" height="8" fill="${color}"/>`,
    `<text x="${x}" y="586" font-size="13" fill="#666">${String(stage).padStart(2, '0')}</text>`,
  );
});
svg.push(
  '<text x="48" y="636" font-size="14" fill="#666">Lospec500: warm / cool balance · Apollo: shade ramps · SLYNYRD: hue shifting</text>',
  '<text x="48" y="662" font-size="13" fill="#666">Decoration only. Local board / CSS / JSON share the same source.</text>',
  '</g></svg>',
);
await writeFile(
  new URL('work/pixel-daily-20261001/color-cover/observatory-palette.svg', root),
  svg.join('\n'),
);
await writeFile(
  new URL('work/pixel-daily-20261001/color-cover/observatory-palette.gpl', root),
  'GIMP Palette\nName: Observatory Vermilion Night\nColumns: 8\n#\n' +
    palette.colors
      .map((c) => {
        const rgb = [1, 3, 5].map((i) => parseInt(c.hex.slice(i, i + 2), 16));
        return `${rgb.join(' ')} ${c.name}`;
      })
      .join('\n') +
    '\n',
);
console.log(
  `Observatory palette: ${palette.colors.length} foundations, ${palette.stages.length} stages`,
);
