import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import type { CredentialEncryption } from './vendor/siwc-local/types.ts';

const run = promisify(execFile);
export function keychainEncryption(): CredentialEncryption {
  let key: Buffer | undefined;
  async function getKey() {
    if (!key) {
      if (process.platform !== 'darwin') throw Error('이 연결은 Mac의 키체인을 사용합니다.');
      const helper = fileURLToPath(new URL('../.local/chatgpt-keychain', import.meta.url));
      const { stdout } = await run(helper, [], { timeout: 30_000, maxBuffer: 128 });
      key = Buffer.from(stdout.trim(), 'base64');
      if (key.length !== 32) throw Error('키체인의 보호된 연결을 확인하지 못했습니다.');
    }
    return key;
  }
  return {
    id: 'study-space-macos-keychain-aes256gcm-v1',
    async isAvailable() {
      try {
        await getKey();
        return true;
      } catch {
        return false;
      }
    },
    async encrypt(plaintext) {
      const iv = randomBytes(12),
        cipher = createCipheriv('aes-256-gcm', await getKey(), iv);
      return Buffer.concat([
        iv,
        cipher.update(plaintext, 'utf8'),
        cipher.final(),
        cipher.getAuthTag(),
      ]);
    },
    async decrypt(ciphertext) {
      const bytes = Buffer.from(ciphertext);
      const decipher = createDecipheriv('aes-256-gcm', await getKey(), bytes.subarray(0, 12));
      decipher.setAuthTag(bytes.subarray(-16));
      return Buffer.concat([decipher.update(bytes.subarray(12, -16)), decipher.final()]).toString(
        'utf8',
      );
    },
  };
}
