import { beforeEach, expect, it, vi } from 'vitest';
import {
  newLinearReading,
  newLinearWorkspace,
  readLinearWorkspace,
  writeLinearWorkspace,
  isLinearWorkspace,
  linearViewKey,
} from './linear-algebra-view';
import { clearRescuedDraft } from './draft-safety';
const key = 'study-space:demo:linear-algebra:view:test';
beforeEach(() => {
  localStorage.clear();
  clearRescuedDraft(key);
  vi.restoreAllMocks();
});
it('미확정 입력·정확값·메모·단계·시야를 재접속에서 복원한다', () => {
  const r = newLinearReading();
  r.inputs.t = '1/';
  r.auxiliary='1 0\n0 1\n---\n4\n3';
  r.auxiliaryDraft='보존할 미확정 기저·벡터';
  r.mode='schur';
  r.params.t = 1 / 3;
  r.matrixDraft = '잘못된 행렬';
  r.memo = '긴 한글 기록과 조건 '.repeat(200);
  r.step = 3;
  r.views = { continuous: { ranges: { x: [0, 10], y: [-4, 4] } } };
  r.view = { ranges: { x: [-2, 2], y: [-3, 3] } };
  const w = { ...newLinearWorkspace(), returnToReader: true, readings: { '0:D': r } };
  writeLinearWorkspace(key, w);
  expect(readLinearWorkspace(key)).toEqual(w);
});
it('손상된 기존 원문을 덮지 않고 새 초안을 유지한다', () => {
  localStorage.setItem(key, 'damaged-original');
  const next = newLinearWorkspace();
  expect(() => readLinearWorkspace(key)).toThrow();
  expect(() => writeLinearWorkspace(key, next)).toThrow();
  expect(localStorage.getItem(key)).toBe('damaged-original');
  expect(readLinearWorkspace(key)).toEqual(next);
});
it('저장 공간 실패 후 경로 복귀와 재시도로 같은 입력을 회복한다', () => {
  const next = newLinearWorkspace();
  next.query = '현재 입력';
  const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('Quota exceeded', 'QuotaExceededError');
  });
  expect(() => writeLinearWorkspace(key, next)).toThrow();
  expect(readLinearWorkspace(key)).toEqual(next);
  spy.mockRestore();
  writeLinearWorkspace(key, next);
  clearRescuedDraft(key);
  expect(readLinearWorkspace(key)).toEqual(next);
});
it('소유자 경로를 분리하고 허위 중첩 상태를 거부한다', () => {
  expect(linearViewKey({ namespace: 'personal', userId: 'a' })).not.toBe(
    linearViewKey({ namespace: 'personal', userId: 'b' }),
  );
  const w = newLinearWorkspace();
  w.readings.x = { ...newLinearReading(), params: [] as unknown as Record<string, number> };
  expect(isLinearWorkspace(w)).toBe(false);
});

it('이전 관찰과 확장 관찰은 같은 ID에서 독립적으로 보존하고 손상된 변형을 거부한다',()=>{
 const previous=newLinearReading();delete previous.modelVersion;previous.inputs.t='1/';previous.memo='원래 메모';
 const current=newLinearReading();current.memo='확장 메모';current.auxiliaryDraft='미확정 보조 입력';
 const w={...newLinearWorkspace(),selected:'0:T',readings:{'0:T':previous},variants:{'0:T':current},modelChoices:{'0:T':'current' as const}};
 writeLinearWorkspace(key,w);expect(readLinearWorkspace(key)).toEqual(w);
 expect(isLinearWorkspace({...w,variants:{'0:T':{...current,modelVersion:3}}})).toBe(false);
 expect(isLinearWorkspace({...w,modelChoices:{'0:T':'unknown'}})).toBe(false);
});
