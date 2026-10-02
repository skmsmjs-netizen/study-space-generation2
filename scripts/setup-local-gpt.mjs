import { spawnSync } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit' });
  if (result.status !== 0)
    throw Error(`${command} did not complete. Existing files were preserved.`);
}
if (process.platform !== 'darwin')
  throw Error('The local ChatGPT credential connection requires macOS Keychain.');
mkdirSync(`${root}/.local`, { recursive: true });
run('swiftc', ['scripts/chatgpt-keychain.swift', '-o', '.local/chatgpt-keychain']);
if (!existsSync(`${root}/.local/study-transcription/bin/python`)) {
  const python = process.env.STUDY_TRANSCRIPTION_PYTHON || 'python3';
  run(python, [
    '-c',
    'import sys; assert sys.version_info >= (3, 10), "Python 3.10 or later is required"',
  ]);
  run(python, ['-m', 'venv', '.local/study-transcription']);
}
run('.local/study-transcription/bin/python', [
  '-m',
  'pip',
  'install',
  'youtube-transcript-api==1.2.4',
]);
console.log(
  'Local tools are installed. ChatGPT sign-in is performed explicitly in the app. No API key or paid provider is configured.',
);
