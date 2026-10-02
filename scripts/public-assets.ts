import { constants, existsSync } from 'node:fs';
import { cp } from 'node:fs/promises';
import path from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';

/** Independent copy-on-write files on supporting filesystems; normal copy elsewhere. */
export function publicAssetsPlugin(): Plugin {
  let config: ResolvedConfig;
  return {
    name: 'study-public-assets',
    apply: 'build',
    configResolved(resolved) { config = resolved; },
    async writeBundle(options, bundle) {
      const source = config.publicDir;
      if (!source || !existsSync(source)) return;
      // Unlike Vite's early copy, this runs after emitted assets. Reject any
      // collision so a public file cannot overwrite the compiled application.
      for (const name of Object.keys(bundle)) {
        if (existsSync(path.join(source, name)))
          throw Error(`공개 도구 파일과 앱 빌드 파일의 경로가 겹칩니다: ${name}`);
      }
      const destination = options.dir || path.resolve(config.root, config.build.outDir);
      await cp(source, destination, { recursive: true, mode: constants.COPYFILE_FICLONE });
    },
  };
}
