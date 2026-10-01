import { expect, it } from 'vitest';
import { geoExpression, geoSourceKey, geoNumber } from './math-geogebra';
import { DEFAULT_SCENE, readScene, sceneBody } from './math-explorer';
it('preserves natural logarithms, base order, constants and local curve parameters', () => {
  expect(geoExpression('log(t)', 't')).toBe('ln(u)');
  expect(geoExpression('log(t, 2)', 't')).toBe('log(2,u)');
  expect(geoExpression('e*cos(t)', 't')).toBe('(exp(1)*cos(u))');
  expect(geoExpression('a*cos(t)', 't')).toBe('(a*cos(u))');
  expect(geoNumber(1e-16)).toBe('(1*10^(-16))');
  expect(geoExpression('1e-16*t', 't')).toBe('((1*10^(-16))*u)');
  expect(() => geoExpression('a=9', 't')).toThrow();
});
it('reads previous saved scenes and retains renderer and exact native view state', () => {
  expect(readScene(sceneBody(DEFAULT_SCENE))).toEqual(DEFAULT_SCENE);
  const scene = {
    ...DEFAULT_SCENE,
    renderer: 'geogebra' as const,
    geogebra: { sourceKey: geoSourceKey(DEFAULT_SCENE), xml: '<geogebra>\n  view\n</geogebra>' },
  };
  expect(readScene(sceneBody(scene))).toEqual(scene);
  expect(geoSourceKey({ ...scene, a: 4, position: 0.8 })).toBe(geoSourceKey(scene));
  expect(geoSourceKey({ ...scene, expressions: ['t', 't', '0'] })).not.toBe(geoSourceKey(scene));
});
