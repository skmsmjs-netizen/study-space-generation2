import { cp, mkdir, readFile, writeFile, chmod, access } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { firefox } from '@playwright/test';

/** macOS 27 protects Firefox's shared app-data directory, even with -profile.
 * Keep the bundled browser and the user's Firefox untouched; clone the bundle
 * and give the automation app a distinct app-data identity (Playwright #42768).
 */
export async function prepareFirefox() {
  if (process.platform !== 'darwin') return undefined;
  const version = execFileSync('sw_vers', ['-productVersion'], { encoding: 'utf8' }).trim();
  if (Number(version.split('.')[0]) < 27) return undefined;
  const executable = firefox.executablePath();
  const app = dirname(dirname(dirname(executable)));
  const cache = resolve('work/browser-runtime', `isolated-${executable.split('/').find(part => /^firefox-\d+$/.test(part))}`);
  const copy = join(cache, 'Nightly.app');
  const launcher = join(cache, 'firefox');
  try { await access(join(cache, 'ready')); return launcher; } catch { /* Prepare once per browser revision. */ }
  await mkdir(cache, { recursive: true });
  await cp(app, copy, { recursive: true });
  const resources = join(copy, 'Contents/Resources');
  const ini = (await readFile(join(resources, 'application.ini'), 'utf8'))
    .replace(/^Vendor=Mozilla$/m, 'Vendor=ManSeekSongQuality')
    .replace(/^Name=Firefox$/m, 'Name=PlaywrightFirefox');
  const appIni = join(resources, 'browser/application.ini');
  await writeFile(appIni, ini);
  const quote = value => `'${value.replaceAll("'", "'\\''")}'`;
  await writeFile(launcher, `#!/bin/sh\nexec ${quote(join(copy, 'Contents/MacOS/firefox'))} -app ${quote(appIni)} "$@"\n`);
  await chmod(launcher, 0o755);
  await writeFile(join(cache, 'ready'), `${version}\n${executable}\n`);
  return launcher;
}
