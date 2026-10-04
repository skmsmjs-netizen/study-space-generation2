import { createReadStream, existsSync } from 'node:fs';
import type { Plugin } from 'vite';
/** Source bytes are read only on loopback and are excluded from every production build. */
export function vectorSourcePlugin(): Plugin {
  const file =
    '/Users/manseeksong/Library/Mobile Documents/com~apple~CloudDocs/산출물/vector calculus.pdf';
  return {
    name: 'local-vector-source',
    configureServer(server) {
      server.middlewares.use('/__vector/source.pdf', (req, res) => {
        if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress ?? '')) {
          res.statusCode = 403;
          res.end();
          return;
        }
        if (!['GET', 'HEAD'].includes(req.method ?? '')) {
          res.statusCode = 405;
          res.end();
          return;
        }
        if (!existsSync(file)) {
          res.statusCode = 404;
          res.end('Local source unavailable');
          return;
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Cache-Control', 'no-store');
        if (req.method === 'HEAD') {
          res.end();
          return;
        }
        const stream = createReadStream(file);
        stream.on('error', () => {
          if (!res.headersSent) res.statusCode = 500;
          res.end();
        });
        res.on('close', () => stream.destroy());
        stream.pipe(res);
      });
    },
  };
}
