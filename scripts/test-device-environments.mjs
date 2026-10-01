import { spawn } from 'node:child_process';
import { rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createServer } from 'node:net';
import path from 'node:path';
import { createDeviceRun } from './device-run.mjs';

const root = process.cwd();
const { run, build } = createDeviceRun(
  path.resolve(process.env.DEVICE_BUILD_DIR || 'dist'),
  path.join(root, 'work/device-runs'),
);
console.log(`기기 검사 빌드와 결과: ${run}`);
const require = createRequire(import.meta.url);
const cli = path.join(path.dirname(require.resolve('@playwright/test/package.json')), 'cli.js');
// Reserve both ephemeral ports together, so concurrent checks select different servers.
const reservations = [];
async function freePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  reservations.push(server);
  return String(server.address().port);
}
const port = process.env.DEVICE_PORT || (await freePort());
const fixturePort = process.env.DEVICE_FIXTURE_PORT || (await freePort());
await Promise.all(reservations.map((server) => new Promise((resolve) => server.close(resolve))));
const child = spawn(
  process.execPath,
  [cli, 'test', '--config', 'playwright.devices.config.ts', ...process.argv.slice(2)],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      DEVICE_PORT: port,
      DEVICE_FIXTURE_PORT: fixturePort,
      DEVICE_RUN_DIR: run,
      DEVICE_BUILD_DIR: build,
    },
  },
);
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.once('error', (error) => {
  console.error(error);
  process.exitCode = 1;
});
child.once('exit', (code, signal) => {
  // Reports and the manifest remain; repeated checks do not accumulate large vendor copies.
  rmSync(build, { recursive: true, force: true });
  rmSync(path.join(run, 'fixture'), { recursive: true, force: true });
  process.exitCode = code ?? (signal === 'SIGINT' ? 130 : 1);
  console.log(`기기 검사 결과: ${run}`);
});
