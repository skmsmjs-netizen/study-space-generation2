import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import valueParser from 'postcss-value-parser';

const tokenFile = 'src/ui/tokens.css';
const designName =
  /^--(?:color-|font-|type-|space-|radius-|shadow-|layout-|breakpoint-|border-|focus-|icon-|input-font-|control-)/;
const spacing =
  /^(?:(?:margin|padding|scroll-margin|scroll-padding)(?:-.+)?|gap|row-gap|column-gap)$/;
const typography = /^(?:font|font-size|font-weight|font-family|line-height|letter-spacing)$/;
const radius =
  /^(?:border-radius|border-(?:(?:top|bottom)-(?:left|right)|(?:start|end)-(?:start|end))-radius)$/;
const shadow = /^(?:box-shadow|text-shadow)$/;
const colorOnly =
  /^(?:color|fill|stroke|(?:border(?:-.+)?|outline|text-decoration|caret|accent|column-rule|stop|flood|lighting)-color)$/;
const colorFunction = /^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color|device-cmyk)$/i;
const keywords = new Set(
  'inherit initial unset revert revert-layer transparent currentcolor none auto normal bold bolder lighter inset solid dashed dotted double groove ridge outset hidden round space repeat no-repeat repeat-x repeat-y cover contain border-box padding-box content-box scroll fixed local collapse separate underline overline line-through wavy from-font in srgb srgb-linear display-p3 a98-rgb prophoto-rgb rec2020 xyz xyz-d50 xyz-d65 hsl hwb lab lch oklab oklch shorter longer increasing decreasing hue to top bottom left right center + - * /'.split(
    ' ',
  ),
);
const systemColors = new Set(
  'accentcolor accentcolortext activetext buttonborder buttonface buttontext canvas canvastext field fieldtext graytext highlight highlighttext linktext mark marktext selecteditem selecteditemtext visitedtext'.split(
    ' ',
  ),
);
const roleOf = (prop) =>
  spacing.test(prop)
    ? 'Spacing'
    : typography.test(prop)
      ? 'Typography'
      : radius.test(prop)
        ? 'Radius'
        : shadow.test(prop)
          ? 'Shadow'
          : null;
const isColored = (prop) =>
  colorOnly.test(prop) ||
  /^(?:background(?:-color|-image)?|border(?:-.+)?|outline|column-rule|text-decoration)$/.test(
    prop,
  );

// This is a narrow declaration guard, not a CSS validator or a component/state audit.
export function checkDesignTokens(files) {
  const errors = [],
    exceptions = [],
    roots = new Map(),
    defined = new Set();
  const fail = (file, node, message) =>
    errors.push({ file, line: node?.source?.start?.line ?? 1, message });
  for (const { file, css } of files) {
    try {
      const root = postcss.parse(css, { from: file });
      roots.set(file, root);
      root.walkDecls((decl) => {
        if (decl.prop.startsWith('--')) defined.add(decl.prop);
      });
    } catch (error) {
      fail(file, null, `CSS parse: ${error.reason ?? error.message}`);
    }
  }
  if (!roots.has(tokenFile))
    errors.push({ file: tokenFile, line: 1, message: '공통 토큰 파일이 필요합니다.' });
  // Local aliases inherit the role of their consumers, so --my-gap: 15px is not a loophole.
  const roles = new Map();
  let changed = true;
  while (changed) {
    changed = false;
    for (const root of roots.values())
      root.walkDecls((decl) => {
        const prop = decl.prop.toLowerCase();
        const inherited = new Set(roles.get(decl.prop) ?? []);
        const role = roleOf(prop);
        if (role) inherited.add(role);
        if (isColored(prop)) inherited.add('Color');
        if (!inherited.size) return;
        valueParser(decl.value).walk((node) => {
          if (node.type !== 'function' || node.value.toLowerCase() !== 'var') return;
          const name = node.nodes.find((n) => n.type === 'word')?.value;
          if (!name?.startsWith('--')) return;
          const set = roles.get(name) ?? new Set();
          for (const item of inherited)
            if (!set.has(item)) {
              set.add(item);
              changed = true;
            }
          roles.set(name, set);
        });
      });
  }
  for (const [file, root] of roots) {
    root.walkDecls((decl) => {
      const prop = decl.prop.toLowerCase();
      const aliasRoles = roles.get(decl.prop) ?? new Set();
      const category =
        roleOf(prop) ??
        ['Typography', 'Spacing', 'Radius', 'Shadow'].find((role) => aliasRoles.has(role));
      const custom = prop.startsWith('--');
      const colored = isColored(prop) || aliasRoles.has('Color');
      const previous = decl.prev();
      const waiver =
        previous?.type === 'comment' && /^design-token-exception:/.test(previous.text.trim());
      const match =
        waiver && previous.text.trim().match(/^design-token-exception:\s*([\w-]+)\s+--\s+(.+)$/);
      const waived = match && match[1] === prop && match[2].trim().length >= 4;
      if (waiver && !waived)
        fail(file, previous, '예외는 바로 다음 속성과 구체적인 이유를 지정해야 합니다.');
      const violations = new Set();
      let forcedColors = false;
      for (let parent = decl.parent; parent; parent = parent.parent) {
        if (
          parent.type === 'atrule' &&
          parent.name === 'media' &&
          /\(forced-colors:\s*active\)/.test(parent.params)
        )
          forcedColors = true;
      }
      const inspect = (nodes, inMath = false) => {
        for (const node of nodes) {
          if (node.unclosed) fail(file, decl, '값의 괄호 또는 문자열이 닫히지 않았습니다.');
          if (node.type === 'function') {
            const fn = node.value.toLowerCase();
            if (fn === 'url' || fn === 'env') continue; // URLs and safe-area inputs are not palette/spacing literals.
            if (fn === 'var') {
              const name = node.nodes.find((n) => n.type === 'word')?.value;
              if (!name?.startsWith('--'))
                fail(file, decl, 'var()의 변수 이름이 올바르지 않습니다.');
              else if (designName.test(name) && !defined.has(name))
                fail(file, decl, `정의되지 않은 디자인 토큰: ${name}`);
              const comma = node.nodes.findIndex((n) => n.type === 'div' && n.value === ',');
              if (comma >= 0) inspect(node.nodes.slice(comma + 1), inMath); // A valid name must not conceal a raw fallback.
              continue;
            }
            if (colorFunction.test(fn))
              violations.add(`Color: ${fn}() 대신 역할 토큰을 사용하세요.`);
            inspect(node.nodes, inMath || /^(?:calc|min|max|clamp)$/.test(fn));
          } else if (node.type === 'string' && category === 'Typography') {
            violations.add('Typography: 글꼴 이름 대신 공통 글꼴 토큰을 사용하세요.');
          } else if (node.type === 'word') {
            const word = node.value.toLowerCase();
            if (/^#[\da-f]{3,8}$/i.test(word))
              violations.add('Color: 직접 색상 대신 역할 토큰을 사용하세요.');
            const unit = valueParser.unit(word);
            if (unit && Number.isFinite(Number(unit.number))) {
              if (
                category &&
                Number(unit.number) !== 0 &&
                (unit.unit || (!inMath && ['Typography', 'Shadow'].includes(category)))
              ) {
                // Percentage spacing is proportional layout, not an absolute spacing scale.
                if (!(category === 'Spacing' && unit.unit === '%'))
                  violations.add(`${category}: 직접 값 ${node.value} 대신 공통 토큰을 사용하세요.`);
              }
            } else if (
              (colored ||
                category === 'Shadow' ||
                (/(?:color|background|fill|stroke)/.test(prop) && custom)) &&
              !keywords.has(word)
            ) {
              if (!(forcedColors && systemColors.has(word)))
                violations.add(`Color: 직접 값 ${node.value} 대신 역할 토큰을 사용하세요.`);
            } else if (category === 'Typography' && !keywords.has(word)) {
              violations.add(`Typography: 직접 값 ${node.value} 대신 공통 토큰을 사용하세요.`);
            }
          }
        }
      };
      inspect(valueParser(decl.value).nodes);
      if (file === tokenFile) return; // Definitions may own literal values; their references are still checked.
      if (waived && violations.size)
        exceptions.push({ file, line: decl.source.start.line, property: prop, reason: match[2] });
      else for (const message of violations) fail(file, decl, `${prop}: ${message}`);
    });
  }
  return { errors, exceptions, fileCount: roots.size };
}

export function readStyles(root) {
  const walk = (directory) =>
    fs
      .readdirSync(directory, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name))
      .flatMap((entry) => {
        const target = path.join(directory, entry.name);
        return entry.isDirectory()
          ? walk(target)
          : entry.isFile() && entry.name.endsWith('.css')
            ? [
                {
                  file: path.relative(root, target).split(path.sep).join('/'),
                  css: fs.readFileSync(target, 'utf8'),
                },
              ]
            : [];
      });
  return walk(path.join(root, 'src'));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (
    process.argv.length > 2 &&
    (process.argv[2] !== '--root' || !process.argv[3] || process.argv.length !== 4)
  ) {
    console.error('Usage: node scripts/check-design-tokens.mjs [--root project-directory]');
    process.exitCode = 1;
  } else {
    const root =
      process.argv[2] === '--root'
        ? path.resolve(process.argv[3])
        : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
    const result = checkDesignTokens(readStyles(root));
    for (const error of result.errors)
      console.error(`${error.file}:${error.line} ${error.message}`);
    console.log(
      `Design tokens: ${result.fileCount} CSS files, ${result.errors.length} errors, ${result.exceptions.length} scoped exceptions`,
    );
    process.exitCode = result.errors.length ? 1 : 0;
  }
}
