import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

/** Production uses only the reviewed distribution; the private source stays local. */
export function conceptReadingPackPlugin(): Plugin {
  const id = 'virtual:concept-reading-pack';
  const resolved = '\0' + id;
  const file = new URL('../src/data/concept-reading-pack.json', import.meta.url);
  const published = new URL('../src/data/concept-reading-pack.published.json', import.meta.url);
  return {
    name: 'local-concept-reading-pack',
    resolveId(source) { return source === id ? resolved : null; },
    load(source) {
      if (source !== resolved) return null;
      const selected = process.env.CI || process.env.PAGES_BASE || !existsSync(file)
        ? published : file;
      if (!existsSync(selected))
        return 'export default null;';
      this.addWatchFile(fileURLToPath(selected));
      const raw = readFileSync(selected, 'utf8');
      const pack = JSON.parse(raw);
      if (pack.format !== 'concept-reading-pack' || pack.version !== 1)
        throw Error('개념 전집 읽기 묶음의 형식을 확인해 주세요.');
      if (selected === published && pack.distribution !== 'published')
        throw Error('개념 전집의 검토된 배포 묶음을 확인해 주세요.');
      return 'export default ' + raw + ';';
    },
  };
}
