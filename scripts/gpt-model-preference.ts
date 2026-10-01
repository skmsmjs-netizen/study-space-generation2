import { readFile, mkdir, writeFile, rename, rm } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
const directory = join(homedir(), '.config', 'study-space-chatgpt');
const name = 'material-models.json';
async function read(directory: string): Promise<Record<string, string>> {
  try {
    const parsed = JSON.parse(await readFile(join(directory, name), 'utf8'));
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed) ||
      Object.entries(parsed).some(
        ([key, value]) =>
          !/^[a-zA-Z0-9-]{1,100}$/.test(key) || typeof value !== 'string' || value.length > 160,
      )
    )
      throw Error('Saved model preferences are invalid.');
    return parsed;
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return {};
    throw error;
  }
}
export async function readGPTModel(profile: string, path = directory) {
  return (await read(path))[profile];
}
export async function saveGPTModel(profile: string, model: string, path = directory) {
  if (!/^[a-zA-Z0-9-]{1,100}$/.test(profile) || !model || model.length > 160)
    throw Error('Invalid model preference');
  const previous = await read(path);
  await mkdir(path, { recursive: true, mode: 0o700 });
  const temporary = join(path, `${name}.${randomUUID()}.tmp`);
  try {
    await writeFile(temporary, JSON.stringify({ ...previous, [profile]: model }), {
      mode: 0o600,
      flag: 'wx',
    });
    await rename(temporary, join(path, name));
  } finally {
    await rm(temporary, { force: true });
  }
}
