import { it, expect } from 'vitest';
import { physicsObservations, secondaryPhysics } from '../domain/physics-observations';
import { physicsAxisLabel } from './physics-axis-label';

it('전체 관찰과 두 번째 그래프 축은 TeX 명령이 아닌 단위·기호로 읽힌다', () => {
  for (const observation of physicsObservations.flatMap(o => [o, secondaryPhysics(o)].filter(Boolean))) {
    for (const axis of [observation!.x, observation!.y]) {
      const value = physicsAxisLabel(axis);
      expect(value).not.toBe('');
      expect(value).not.toMatch(/mathcal|mathrm|varphi|epsilon|prime|\\/);
    }
  }
});
it('기전력과 도플러 prime·각속도·서로 다른 지수와 벡터를 보존한다', () => {
  expect(physicsAxisLabel('\\mathcal E_2\\;(\\mathrm{V})')).toBe('ℰ<sub>2</sub> (V)');
  expect(physicsAxisLabel('f^{\\prime}\\;(\\mathrm{Hz})')).toBe('f<sup>′</sup> (Hz)');
  expect(physicsAxisLabel('\\Omega\\;(\\mathrm{rad/s})')).toBe('Ω (rad/s)');
  expect(physicsAxisLabel('\\vec A\\cdot\\vec B')).toContain('A⃗');
  expect(physicsAxisLabel('\\rho\\;(\\mathrm{kg/m^3})')).toBe('ρ (kg/m<sup>3</sup>)');
});
