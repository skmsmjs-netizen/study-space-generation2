import {
  cpSync,
  constants,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

function manifest(directory, relative = '') {
  return readdirSync(path.join(directory, relative), { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const name = path.join(relative, entry.name);
      if (entry.isDirectory()) return manifest(directory, name);
      if (!entry.isFile()) throw Error(`검사용 빌드에 일반 파일이 아닌 항목이 있습니다: ${name}`);
      return [
        [
          name,
          createHash('sha256')
            .update(readFileSync(path.join(directory, name)))
            .digest('hex'),
        ],
      ];
    });
}

/** Freeze bytes, not a link to a dist directory another build can empty. */
export function createDeviceRun(source, parent) {
  if (!existsSync(path.join(source, 'index.html')))
    throw Error('완성된 앱 빌드가 없습니다. npm run build를 먼저 실행해 주세요.');
  const before = manifest(source);
  mkdirSync(parent, { recursive: true });
  const run = mkdtempSync(path.join(parent, 'run-'));
  const build = path.join(run, 'app');
  try {
    cpSync(source, build, { recursive: true, mode: constants.COPYFILE_FICLONE });
    const copied = manifest(build);
    if (JSON.stringify(before) !== JSON.stringify(copied))
      throw Error(
        `복사 중 빌드가 바뀌었습니다. 혼합된 결과로 검사하지 않습니다. 빌드가 끝난 뒤 다시 실행해 주세요. 확인 위치: ${run}`,
      );
    const files = new Set(copied.map(([name]) => name.split(path.sep).join('/')));
    const html = readFileSync(path.join(build, 'index.html'), 'utf8');
    for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
      const url = match[1].split(/[?#]/)[0];
      const asset = url.slice(url.indexOf('assets/'));
      if (url.includes('assets/') && !files.has(asset))
        throw Error(`앱 빌드 파일이 빠져 있습니다: ${asset}. npm run build 후 다시 실행해 주세요.`);
    }
    writeFileSync(
      path.join(run, 'build-manifest.json'),
      JSON.stringify({ source, files: copied }, null, 2),
    );
  } catch (error) {
    rmSync(build, { recursive: true, force: true });
    writeFileSync(path.join(run, 'failure.txt'), String(error));
    throw error;
  }
  return { run, build };
}
