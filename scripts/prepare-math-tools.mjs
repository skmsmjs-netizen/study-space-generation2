import './prepare-concept-interactives.mjs';
import './sync-math-observatory.mjs';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, writeFile, rm, access, readdir, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = new URL('../public/vendor/', import.meta.url);
const marker = new URL('GeoGebra/.study-version', root);
const version = '5.4.930.2';
const hash = '7e0b7b1dc51cebe1675de15fd296d8ebe7f49e407567656351af42e29f55c871';
try {
  if ((await readFile(marker, 'utf8')).trim() === `${version} ${hash}`) {
    await access(new URL('GeoGebra/deployggb.js', root));
    await access(new URL('GeoGebra/HTML5/5.0/web3d/web3d.nocache.js', root));
    // iCloud placeholders pass access(), but copying them can wait for hours.
    // Inspect file flags without reading their unavailable content on macOS.
    const cloudOnly = process.platform === 'darwin' &&
      /\bdataless\b/.test(execFileSync('/bin/ls', ['-lOR', fileURLToPath(new URL('GeoGebra/', root))], { encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 }));
    if (!cloudOnly && !process.argv.includes('--repair')) process.exit(0);
    console.log('GeoGebra: restore the pinned official bundle for local availability.');
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const response = await fetch(
  'https://download.geogebra.org/installers/5.4/geogebra-math-apps-bundle-5-4-930-2.zip',
  { signal: AbortSignal.timeout(60000) },
);
if (!response.ok) throw Error(`GeoGebra download failed: ${response.status}`);
const archive = Buffer.from(await response.arrayBuffer());
if (createHash('sha256').update(archive).digest('hex') !== hash)
  throw Error('GeoGebra archive checksum did not match. Existing files were preserved.');
const temporary = await mkdtemp(join(tmpdir(), 'study-geogebra-'));
try {
  const path = join(temporary, 'geogebra.zip');
  await writeFile(path, archive);
  await mkdir(root, { recursive: true });
  const extracted = join(temporary, 'extracted');
  execFileSync('unzip', ['-qo', path, '-d', extracted]);
  async function install(directory, destination) {
    await mkdir(destination, { recursive: true });
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (entry.isDirectory()) await install(join(directory, entry.name), join(destination, entry.name));
      else if (entry.isFile()) await rename(join(directory, entry.name), join(destination, entry.name));
      else throw Error('Unexpected entry in pinned GeoGebra archive.');
    }
  }
  // Atomic file replacement avoids hydrating/truncating a placeholder first.
  // Generated toolkit files only; authored math scenes and saved views stay put.
  await install(join(extracted, 'GeoGebra'), fileURLToPath(new URL('GeoGebra/', root)));
  await writeFile(marker, `${version} ${hash}\n`);
  console.log(`GeoGebra ${version}: local assets prepared.`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
