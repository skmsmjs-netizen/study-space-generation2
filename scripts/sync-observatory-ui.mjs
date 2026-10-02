import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const source = 'docs/observatory-experience-baseline.json';
const baseline = JSON.parse(await readFile(new URL(source, root), 'utf8'));
export const materialRoles = [
  'canvas',
  'surface',
  'subtle',
  'text',
  'muted',
  'borderDecorative',
  'borderInteractive',
  'focus',
  'selected',
  'selectedText',
  'primary',
  'primaryHover',
  'primaryPressed',
  'onPrimary',
];
const kebab = (value) => value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
export const materialColor = (material, role) => {
  const value = baseline.materials?.[material]?.[role];
  if (typeof value !== 'string' || !/^#[\da-f]{6}$/i.test(value))
    throw new Error(`Invalid ${source}: materials.${material}.${role}`);
  return value.toLowerCase();
};
const declaration = (name, value, path) =>
  `  /* design-token-exception: ${name} -- Generated from ${source} ${path}. */\n  ${name}: ${value};`;
const length = (value, unit = 'px') => {
  if (!Number.isFinite(value) || value < 0) throw new Error(`Invalid length: ${value}`);
  return value ? `${value}${unit}` : '0';
};
const pixel = baseline.pixelTreatment;
const metrics = baseline.metrics;
const bodyAlignment = metrics.paper.bodyAlignment;
const bodyTypography = metrics.paper.bodyTypography;
if (
  !Number.isFinite(bodyTypography.weight) ||
  bodyTypography.weight < 1 ||
  bodyTypography.weight > 1000 ||
  !Number.isFinite(bodyTypography.lineHeight) ||
  bodyTypography.lineHeight < 1 ||
  !Number.isFinite(bodyTypography.compact.lineHeight) ||
  bodyTypography.compact.lineHeight < 1 ||
  !Number.isFinite(bodyTypography.letterSpacingEm) ||
  !Number.isFinite(bodyTypography.compact.letterSpacingEm)
)
  throw new Error(`Invalid ${source}: metrics.paper.bodyTypography`);
if (
  !['justify', 'start', 'end', 'center'].includes(bodyAlignment.textAlign) ||
  !['start', 'end', 'center', 'justify', 'auto'].includes(bodyAlignment.lastLine)
)
  throw new Error(`Invalid ${source}: metrics.paper.bodyAlignment`);
const shadow = (value, color = value.color) =>
  `${length(value.xPx ?? value.offsetXPx)} ${length(value.yPx ?? value.offsetYPx)} ${length(value.blurPx)} ${length(value.spreadPx)} ${color}`;
const entries = [
  ...[
    ['size', bodyTypography.sizeRem, 'sizeRem'],
    ['compact-size', bodyTypography.compact.sizeRem, 'compact.sizeRem'],
    ['preview-size', bodyTypography.previewSizeRem, 'previewSizeRem'],
    ['memo-size', bodyTypography.memoSizeRem, 'memoSizeRem'],
  ].map(([role, value, path]) => declaration(
    `--observatory-paper-${role === 'size' || role === 'compact-size' ? 'body-' : ''}${role}`,
    length(value, 'rem'),
    `metrics.paper.bodyTypography.${path}`,
  )),
  ...['interior', 'paper'].flatMap((material) =>
    materialRoles.map((role) =>
      declaration(
        `--observatory-${material}-${kebab(role)}`,
        materialColor(material, role),
        `materials.${material}.${role}`,
      ),
    ),
  ),
  ...Object.entries(pixel.componentRadiusPx).map(([role, value]) =>
    declaration(
      `--observatory-radius-${role}`,
      length(value),
      `pixelTreatment.componentRadiusPx.${role}`,
    ),
  ),
  ...['body', 'label', 'caption', 'heading', 'title'].flatMap((role) => [
    declaration(
      `--observatory-type-${role}-size`,
      length(metrics.type[role].rem, 'rem'),
      `metrics.type.${role}.rem`,
    ),
    declaration(
      `--observatory-type-${role}-line`,
      String(metrics.type[role].line),
      `metrics.type.${role}.line`,
    ),
    declaration(
      `--observatory-type-${role}-weight`,
      String(metrics.type[role].weight),
      `metrics.type.${role}.weight`,
    ),
  ]),
  declaration(
    '--observatory-type-title-compact-size',
    length(metrics.type.title.compactRem, 'rem'),
    'metrics.type.title.compactRem',
  ),
  declaration(
    '--observatory-input-min-size',
    length(metrics.type.input.minPx),
    'metrics.type.input.minPx',
  ),
  declaration(
    '--observatory-paper-padding',
    length(metrics.paper.paddingRem, 'rem'),
    'metrics.paper.paddingRem',
  ),
  declaration(
    '--observatory-body-text-align',
    bodyAlignment.textAlign,
    'metrics.paper.bodyAlignment.textAlign',
  ),
  declaration(
    '--observatory-body-last-line',
    bodyAlignment.lastLine,
    'metrics.paper.bodyAlignment.lastLine',
  ),
  declaration(
    '--observatory-paper-body-weight',
    bodyTypography.weight,
    'metrics.paper.bodyTypography.weight',
  ),
  declaration(
    '--observatory-paper-body-line',
    bodyTypography.lineHeight,
    'metrics.paper.bodyTypography.lineHeight',
  ),
  declaration(
    '--observatory-paper-body-tracking',
    `${bodyTypography.letterSpacingEm}em`,
    'metrics.paper.bodyTypography.letterSpacingEm',
  ),
  declaration(
    '--observatory-paper-body-compact-line',
    bodyTypography.compact.lineHeight,
    'metrics.paper.bodyTypography.compact.lineHeight',
  ),
  declaration(
    '--observatory-paper-body-compact-tracking',
    `${bodyTypography.compact.letterSpacingEm}em`,
    'metrics.paper.bodyTypography.compact.letterSpacingEm',
  ),
  declaration(
    '--observatory-body-justify',
    bodyAlignment.justification,
    'metrics.paper.bodyAlignment.justification',
  ),
  declaration(
    '--observatory-body-word-break',
    bodyAlignment.wordBreak,
    'metrics.paper.bodyAlignment.wordBreak',
  ),
  declaration(
    '--observatory-body-line-break',
    bodyAlignment.lineBreak,
    'metrics.paper.bodyAlignment.lineBreak',
  ),
  declaration(
    '--observatory-body-overflow-wrap',
    bodyAlignment.overflowWrap,
    'metrics.paper.bodyAlignment.overflowWrap',
  ),
  declaration(
    '--observatory-body-hyphens',
    bodyAlignment.hyphens,
    'metrics.paper.bodyAlignment.hyphens',
  ),
  declaration(
    '--observatory-paper-compact-padding',
    length(metrics.paper.compactPaddingRem, 'rem'),
    'metrics.paper.compactPaddingRem',
  ),
  declaration(
    '--observatory-paper-border',
    length(metrics.paper.borderPx),
    'metrics.paper.borderPx',
  ),
  declaration('--observatory-paper-shadow', shadow(metrics.paper.shadow), 'metrics.paper.shadow'),
  declaration(
    '--observatory-floating-shadow-light',
    shadow(pixel.floatingShadow, pixel.floatingShadow.lightColor),
    'pixelTreatment.floatingShadow',
  ),
  declaration(
    '--observatory-floating-shadow-dark',
    shadow(pixel.floatingShadow, pixel.floatingShadow.darkColor),
    'pixelTreatment.floatingShadow',
  ),
  declaration(
    '--observatory-pressed-y',
    length(pixel.pressedTranslationYPx),
    'pixelTreatment.pressedTranslationYPx',
  ),
  declaration(
    '--observatory-control-height',
    length(metrics.control.heightPx),
    'metrics.control.heightPx',
  ),
  declaration(
    '--observatory-icon-target',
    length(metrics.control.iconTargetMinPx),
    'metrics.control.iconTargetMinPx',
  ),
  declaration(
    '--observatory-focus-width',
    length(metrics.control.focusPx),
    'metrics.control.focusPx',
  ),
  declaration(
    '--observatory-focus-offset',
    length(metrics.control.focusOffsetPx),
    'metrics.control.focusOffsetPx',
  ),
  declaration(
    '--observatory-reading-width',
    length(metrics.layout.readingMaxRem, 'rem'),
    'metrics.layout.readingMaxRem',
  ),
  declaration(
    '--observatory-dialog-width',
    length(metrics.layout.dialogMaxRem, 'rem'),
    'metrics.layout.dialogMaxRem',
  ),
];
await writeFile(
  new URL('src/ui/observatory-ui-tokens.css', root),
  `/* Generated by scripts/sync-observatory-ui.mjs. Edit ${source}, not this file.
   Material/shape/size/type roles are generated. User font families, root zoom, meaning colors and data remain independent. */\n:root {\n${entries.join('\n')}\n}\n`,
);
console.log(
  `Observatory UI tokens: baseline ${baseline.version}, 2 materials, ${entries.length} roles`,
);
