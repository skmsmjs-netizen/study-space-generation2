import { cp, mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import lockfile from 'proper-lockfile';

export async function prepareRecallOptimizer(
  source = new URL('../node_modules/fsrs-browser/', import.meta.url),
  target = new URL('../public/optimizer/vendor/', import.meta.url),
) {
  await mkdir(target, { recursive: true });
  // Build and dev can prepare the same vendor files in separate processes.
  const release = await lockfile.lock(fileURLToPath(target), {
    realpath: false,
    stale: 30000,
    update: 10000,
    retries: { retries: 20, minTimeout: 50, maxTimeout: 1000 },
  });
  try {
    for (const name of ['fsrs_browser.js', 'fsrs_browser_bg.wasm', 'snippets']) {
      await cp(new URL(name, source), new URL(name, target), { recursive: true });
    }
    // wasm-bindgen-rayon emits a directory import; static hosting needs a module file.
    for (const folder of await readdir(new URL('snippets/', target))) {
      const file = new URL(`snippets/${folder}/src/workerHelpers.js`, target);
      await writeFile(file, (await readFile(file, 'utf8')).replace("import('../../..')", "import('../../../fsrs_browser.js')"));
    }
  } finally {
    await release();
  }
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  await prepareRecallOptimizer();
}
