import { spawnSync } from 'node:child_process';
import { mkdirSync, statSync, renameSync, existsSync } from 'node:fs';
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
  'faster-whisper==1.2.1',
  'av==16.1.0',
  'youtube-transcript-api==1.2.4',
]);
mkdirSync(`${root}/.local/study-transcription-model`, { recursive: true });
const revision = '536b0662742c02347bc0e980a01041f333bce120';
for (const name of ['config.json', 'model.bin', 'tokenizer.json', 'vocabulary.txt']) {
  const target = `${root}/.local/study-transcription-model/${name}`;
  try {
    if (statSync(target).size > 0 && (name !== 'model.bin' || statSync(target).size === 483546902))
      continue;
  } catch {}
  run('curl', [
    '-fL',
    '--retry',
    '2',
    '--connect-timeout',
    '20',
    '--max-time',
    '600',
    `https://huggingface.co/Systran/faster-whisper-small/resolve/${revision}/${name}`,
    '-o',
    `${target}.part`,
  ]);
  if (name === 'model.bin' && statSync(`${target}.part`).size !== 483546902)
    throw Error('Incomplete model download was preserved for inspection.');
  renameSync(`${target}.part`, target);
}
console.log(
  'Local tools are installed. ChatGPT sign-in is performed explicitly in the app. No API key or paid provider is configured.',
);
