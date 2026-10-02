import { buildScene, isMathScene, type MathScene } from '../domain/math-explorer';

export const mathComparisonKey = (ownerDraftKey: string) => `${ownerDraftKey}:comparison:v1`;
/** Tab-only comparison state. Never writes the durable math draft or saved memos. */
export function readMathComparison(key: string): {
  scene: MathScene | null;
  blocked: boolean;
  error: string;
} {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return { scene: null, blocked: false, error: '' };
    const parsed: unknown = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !('version' in parsed) ||
      parsed.version !== 1 ||
      !('scene' in parsed) ||
      !isMathScene(parsed.scene)
    )
      throw Error('invalid');
    buildScene(parsed.scene);
    return { scene: parsed.scene, blocked: false, error: '' };
  } catch {
    return {
      scene: null,
      blocked: true,
      error:
        '이전 비교 조건을 읽지 못했습니다. 저장된 내용은 그대로 두었습니다. 비교 초기화 후 다시 고정할 수 있습니다.',
    };
  }
}
export function writeMathComparison(key: string, scene: MathScene) {
  if (!isMathScene(scene)) throw Error('비교 조건을 확인해 주세요.');
  if (readMathComparison(key).blocked) throw Error('읽지 못한 이전 비교 조건을 보존합니다.');
  sessionStorage.setItem(key, JSON.stringify({ version: 1, scene }));
}
export const clearMathComparison = (key: string) => sessionStorage.removeItem(key);
