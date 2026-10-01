// @vitest-environment node
import { beforeEach, expect, it, vi } from 'vitest';
import { materialCloudPath, MATERIAL_BUCKET, removeMaterialAudio } from './material-cloud';
const mock = vi.hoisted(() => ({ userId: 'owner', failed: false, from: vi.fn(), remove: vi.fn(), stop: vi.fn() }));
vi.mock('./supabase-client', () => ({
  readServerConfig: () => ({ url: 'https://synthetic.invalid', publishableKey: 'synthetic-public' }),
  createStudyClient: () => ({ auth: { getSession: async () => ({ data: { session: { user: { id: mock.userId } } } }), stopAutoRefresh: mock.stop }, storage: { from: mock.from } }),
}));
const owner = { userId: 'owner', namespace: 'personal' as const };
const file = { key: 'synthetic', sha256: 'a'.repeat(64), size: 3, name: '합성.wav', type: 'audio/wav', cloudPath: materialCloudPath(owner, 'audio', 'a'.repeat(64)) };
beforeEach(() => {
  mock.userId = 'owner'; mock.failed = false; mock.from.mockReset(); mock.remove.mockReset(); mock.stop.mockReset();
  mock.from.mockReturnValue({ remove: mock.remove });
  mock.remove.mockImplementation(async () => ({ error: mock.failed ? Error('synthetic failure') : null }));
});
it('does not access cloud storage for device-only audio', async () => {
  await removeMaterialAudio(owner, { ...file, cloudPath: undefined });
  expect(mock.from).not.toHaveBeenCalled();
});
it('rejects a foreign path before authentication or storage access', async () => {
  await expect(removeMaterialAudio(owner, { ...file, cloudPath: 'other/personal/audio/'+file.sha256 })).rejects.toThrow('다른 공간');
  expect(mock.from).not.toHaveBeenCalled();
});
it('rejects a different authenticated account before deletion', async () => {
  mock.userId = 'other';
  await expect(removeMaterialAudio(owner, file)).rejects.toThrow('로그인');
  expect(mock.from).not.toHaveBeenCalled();
  expect(mock.stop).toHaveBeenCalledTimes(1);
});
it('removes only the exact owner audio object and reports a retryable provider failure', async () => {
  mock.failed = true;
  await expect(removeMaterialAudio(owner, file)).rejects.toThrow('전사문은 저장');
  expect(mock.from).toHaveBeenCalledWith(MATERIAL_BUCKET);
  expect(mock.remove).toHaveBeenCalledWith([file.cloudPath]);
  mock.failed = false;
  await removeMaterialAudio(owner, file);
  expect(mock.remove).toHaveBeenCalledTimes(2);
  expect(mock.stop).toHaveBeenCalledTimes(2);
});
