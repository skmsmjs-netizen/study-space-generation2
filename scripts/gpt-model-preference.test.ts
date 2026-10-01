// @vitest-environment node
import { expect, it } from 'vitest';
import { mkdtemp, readFile, writeFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readGPTModel, saveGPTModel } from './gpt-model-preference';
it('keeps model choices across reconnects and profiles and preserves an unreadable settings file', async () => {
  const path = await mkdtemp(join(tmpdir(), 'study-gpt-preference-test-'));
  try {
    await saveGPTModel('synthetic-one', 'model-one', path);
    await saveGPTModel('synthetic-two', 'model-two', path);
    expect(await readGPTModel('synthetic-one', path)).toBe('model-one');
    expect(await readGPTModel('synthetic-two', path)).toBe('model-two');
    const file = join(path, 'material-models.json');
    expect((await stat(file)).mode & 0o777).toBe(0o600);
    await writeFile(file, 'unreadable-original');
    await expect(saveGPTModel('synthetic-one', 'model-three', path)).rejects.toThrow();
    expect(await readFile(file, 'utf8')).toBe('unreadable-original');
  } finally {
    await rm(path, { recursive: true, force: true });
  }
});
