import { expect, it } from 'vitest';
import {
  DEFAULT_SCENE,
  buildScene,
  cross,
  expression,
  frame,
  norm,
  readScene,
  sceneBody,
  isMathScene,
} from './math-explorer';
it('matches the analytic helix frame and curvature at t=0', () => {
  const result = buildScene({ ...DEFAULT_SCENE, position: 0 });
  expect(result.point).toEqual([2, 0, 0]);
  expect(result.vectors?.T?.[0]).toBeCloseTo(0);
  expect(result.vectors?.T?.[1]).toBeCloseTo(2 / Math.sqrt(4.25));
  result.vectors!.N!.forEach((v, i) => {
    expect(v).toBeCloseTo([-1, 0, 0][i]);
  });
  expect(result.vectors?.B?.[1]).toBeCloseTo(-0.5 / Math.sqrt(4.25));
  expect(result.vectors?.curvature).toBeCloseTo(2 / 4.25);
  expect(norm(result.vectors!.B!)).toBeCloseTo(1);
  expect(cross(result.vectors!.T!, result.vectors!.N!)).toEqual(result.vectors!.B);
});
it('updates the selected point and retains zero-curvature and zero-speed boundaries', () => {
  expect(buildScene({ ...DEFAULT_SCENE, position: 0, a: 4 }).point).toEqual([4, 0, 0]);
  const straight = buildScene({ ...DEFAULT_SCENE, expressions: ['t', '0', '0'] });
  expect(straight.vectors?.T).toEqual([1, 0, 0]);
  expect(straight.vectors?.N).toBeUndefined();
  expect(straight.vectors?.reason).toContain('곡률이 0');
  expect(
    buildScene({ ...DEFAULT_SCENE, expressions: ['t^2', 't^3', '0'], position: 0 }).frameError,
  ).toContain('속도가 0');
  expect(frame([0, 0, 0], [1, 0, 0]).reason).toContain('속도가 0');
});
it('leaves undefined points and derivatives unknown, rather than drawing invented vectors', () => {
  const result = buildScene({
    ...DEFAULT_SCENE,
    mode: 'function',
    expressions: ['1/x', '0', '0'],
    min: '-1',
    max: '1',
    position: 0.5,
  });
  expect(result.point).toBeNull();
  expect(result.missing).toBeGreaterThan(0);
  expect(
    buildScene({
      ...DEFAULT_SCENE,
      mode: 'function',
      expressions: ['1/(x-0.003)', '0', '0'],
      min: '-1',
      max: '1',
    }).breakBefore.some(Boolean),
  ).toBe(true);
  expect(
    buildScene({ ...DEFAULT_SCENE, expressions: ['sqrt(t)', 't', '0'], position: 0 }).frameError,
  ).toContain('미분값');
  expect(buildScene({ ...DEFAULT_SCENE, expressions: ['t', 'abs(t)', '0'] }).frameError).toContain(
    'abs',
  );
});
it('blocks assignments, arbitrary functions, property access, unknown variables and invalid ranges', () => {
  for (const source of [
    'a=9',
    'import("a")',
    'evaluate("a")',
    '[1,2]',
    'x.foo',
    'x!',
    'unknown(x)',
  ])
    expect(() => expression(source, 'x')).toThrow();
  expect(() => expression('t', 'x')).toThrow('변수는 x');
  expect(() => buildScene({ ...DEFAULT_SCENE, min: '1', max: '0' })).toThrow();
  expect(() => buildScene({ ...DEFAULT_SCENE, min: 'a' })).toThrow();
});
it('roundtrips source, free writing and slider state without interpreting embedded fences', () => {
  const scene = {
    ...DEFAULT_SCENE,
    title: '  한글\n원문  ',
    notes: '\r\n```study-math-v1\n{}\n```\n고립\ud800\0',
    position: 0.312,
  };
  expect(readScene(sceneBody(scene))).toEqual(scene);
  expect(readScene('ordinary memo')).toBeNull();
});
it('restores saved Plotly focus alongside native XML and rejects damaged view metadata', () => {
  const scene = {
    ...DEFAULT_SCENE,
    geogebra: { sourceKey: 'native-view', xml: '<geogebra>preserved</geogebra>' },
    view: {
      camera: { eye: { x: 0.3, y: -0.2, z: 0.4 } },
      pointFocus: { returnCamera: { eye: { x: 2, y: -1, z: 1 } } },
    },
  };
  expect(readScene(sceneBody(scene))).toEqual(scene);
  for (const view of [null, [], { pointFocus: {} }, { camera: { eye: { x: 1, y: 2 } } }])
    expect(isMathScene({ ...scene, view })).toBe(false);
  expect(isMathScene(DEFAULT_SCENE)).toBe(true);
});
