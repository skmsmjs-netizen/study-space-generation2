import { createReadStream } from 'node:fs';
import { access, mkdir, stat } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const book =
  '/Users/manseeksong/Library/Mobile Documents/com~apple~CloudDocs/Downloads/Mathematical Methods for Physics and Engineering.pdf';
const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cache = path.join(app, 'work/riley-observations-20261003/source-pages');
const pending = new Map();
// Read-only, loopback development source adapter. No PDF copying to public assets,
// upload, server save, user record mutation, or production storage claim.
export function rileySourcePlugin() {
  return {
    name: 'riley-local-source',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost');
        if (!url.pathname.startsWith('/__riley_source/')) return next();
        if (!['GET','HEAD'].includes(req.method ?? 'GET')) { res.writeHead(405).end(); return; }
        if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress ?? '')) {
          res.writeHead(403).end('Local source only');
          return;
        }
        res.setHeader('Cache-Control', 'private, no-store');
        try {
          await access(book);
          if (url.pathname === '/__riley_source/document.pdf') {
            res.setHeader('Content-Type','application/pdf');
            if (req.method === 'HEAD') { res.end(); return; }
            const stream=createReadStream(book);
            stream.on('error',()=>res.destroy());
            stream.pipe(res); return;
          }
          if (url.pathname === '/__riley_source/status') {
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({ available: true, pages: 1363, storage: 'read-only-local-file' }),
            );
            return;
          }
          const match = /^\/__riley_source\/page\/(\d+)$/.exec(url.pathname);
          if (!match || Number(match[1]) < 1 || Number(match[1]) > 1363) {
            res.writeHead(404).end('Unknown source page');
            return;
          }
          const page = Number(match[1]);
          // Invalidate a rendered page when the original changes.
          const source = await stat(book);
          const name = `${page}-${source.size}-${Math.trunc(source.mtimeMs)}`;
          const prefix = path.join(cache, name);
          const png = `${prefix}.png`;
          if (!pending.has(name)) {
            pending.set(
              name,
              (async () => {
                await mkdir(cache, { recursive: true });
                try {
                  await access(png);
                } catch {
                  await run(
                    process.env.PDFTOPPM_BIN || 'pdftoppm',
                    [
                      '-f',
                      String(page),
                      '-l',
                      String(page),
                      '-scale-to',
                      '2200',
                      '-png',
                      '-singlefile',
                      book,
                      prefix,
                    ],
                    { timeout: 30000, maxBuffer: 1024 * 1024 },
                  );
                }
              })().finally(() => pending.delete(name)),
            );
          }
          await pending.get(name);
          res.setHeader('Content-Type', 'image/png');
          const stream = createReadStream(png);
          stream.on('error', () => {
            if (!res.headersSent) res.writeHead(500);
            res.end();
          });
          stream.pipe(res);
        } catch {
          res.setHeader('Content-Type', 'application/json');
          res
            .writeHead(503)
            .end(
              JSON.stringify({
                available: false,
                reason: '원본 PDF 또는 로컬 렌더 도구에 접근하지 못했습니다.',
              }),
            );
        }
      });
    },
  };
}
