import { readFileSync } from 'node:fs';

const source = readFileSync('src/App.tsx', 'utf8');
const start = source.indexOf('const navItems =');
export const primaryRoutes = [
  ...source.slice(start, source.indexOf('];', start)).matchAll(/href:\s*["']([^"']+)["']/g),
].map((match) => match[1]);

export const screenRoutes = [
  ...new Set([
    ...primaryRoutes,
    '/draft-archives',
    '/trash',
    '/free',
    '/about',
    '/help',
    '/my-progress',
    '/subscription',
    '/backup',
    '/recall/scheduled',
    '/subject/demo-subject-math',
    '/node/demo-topic-function',
    '/record/demo-topic-function',
  ]),
];
