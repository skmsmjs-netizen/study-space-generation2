import { cp, readFile, writeFile, readdir } from 'node:fs/promises';
const source = new URL('../node_modules/fsrs-browser/', import.meta.url), target = new URL('../public/optimizer/vendor/', import.meta.url);
for (const name of ['fsrs_browser.js', 'fsrs_browser_bg.wasm', 'snippets']) await cp(new URL(name, source), new URL(name, target), { recursive: true });
// wasm-bindgen-rayon emits a directory import; static hosting requires the explicit module file.
for (const folder of await readdir(new URL('snippets/', target))) {
  const file = new URL(`snippets/${folder}/src/workerHelpers.js`, target);
  await writeFile(file, (await readFile(file, 'utf8')).replace("import('../../..')", "import('../../../fsrs_browser.js')"));
}
