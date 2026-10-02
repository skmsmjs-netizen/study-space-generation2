import { describe, expect, it, vi } from 'vitest';
import type { Vec3 } from '../domain/math-explorer';
import {
  cameraFacing,
  cameraOffset,
  cameraScale,
  defaultMathCamera,
  focusPointCamera,
  renderMathCamera,
  recoverMathCamera,
  zoomCamera,
  type MathCamera,
} from './math-plot-camera';

// The camera helpers are pure; loading the unrelated controls is unnecessary.
vi.mock('./index', () => ({ Button: () => null, Select: () => null }));

const metric = { center: [10, -4, 6] as Vec3, unit: 2 };
const camera: MathCamera = {
  eye: { x: 4, y: 5, z: 6 },
  center: { x: 1, y: 1, z: 6 },
  up: { x: 0, y: 0, z: 1 },
  projection: { type: 'orthographic' },
};
const expectVector = (actual: Vec3, expected: Vec3) => {
  actual.forEach((value, index) => {
    expect(value).toBeCloseTo(expected[index], 12);
  });
};

describe('focusPointCamera', () => {
  it('centers a world point in the fixed scene metric, retaining direction, zoom, and camera options', () => {
    const before = structuredClone(camera);
    const focused = focusPointCamera(camera, [14, 2, 8], metric);
    const scale = cameraScale(camera);
    expect(focused.center).toEqual({ x: 2 * scale, y: 3 * scale, z: scale });
    expect(focused.eye).toEqual({ x: 2 * scale + 3, y: 3 * scale + 4, z: scale });
    expectVector(cameraOffset(focused), cameraOffset(camera));
    expect(focused.up).toEqual(camera.up);
    expect(focused.projection).toEqual(camera.projection);
    expect(camera).toEqual(before);
    expect(metric).toEqual({ center: [10, -4, 6], unit: 2 });
  });

  it('moves repeatedly with the selected point without accumulated zoom or rotation drift', () => {
    const first = focusPointCamera(camera, [14, 2, 8], metric, 0.5);
    let followed = first;
    for (let step = 0; step < 200; step++)
      followed = focusPointCamera(followed, [14 + step / 10, 2, 8 + Math.sin(step)], metric);
    expectVector(cameraOffset(followed), [0.3, 0.4, 0]);
    expect((followed.center?.x ?? 0) / cameraScale(followed)).toBeCloseTo((14 + 19.9 - 10) / 2, 10);
    expect(Math.hypot(...cameraOffset(followed))).toBeCloseTo(0.5, 12);
  });

  it.each([
    [0, 0.08],
    [-4, 0.08],
    [0.5, 0.5],
    [120, 80],
  ])(
    'clamps requested distance %s to %s and retains the viewing direction',
    (requested, expected) => {
      const focused = focusPointCamera(camera, [14, 2, 8], metric, requested);
      const offset = cameraOffset(focused);
      expect(Math.hypot(...offset)).toBeCloseTo(expected, 12);
      expectVector(offset.map((value) => value / expected) as Vec3, [0.6, 0.8, 0]);
    },
  );

  it('uses a valid oblique direction when an explicit focus distance starts from a coincident eye and center', () => {
    const focused = focusPointCamera({ eye: { x: 0, y: 0, z: 0 } }, [10, -4, 6], metric, 1);
    const offset = cameraOffset(focused);
    expect(Math.hypot(...offset)).toBeCloseTo(1, 12);
    expectVector(offset, [1 / Math.sqrt(3), 1 / Math.sqrt(3), 1 / Math.sqrt(3)]);
  });

  it('leaves the camera intact when point or metric cannot be represented', () => {
    expect(focusPointCamera(camera, [NaN, 2, 8], metric)).toBe(camera);
    expect(focusPointCamera(camera, [14, 2, 8], { ...metric, unit: 0 })).toBe(camera);
    expect(focusPointCamera(camera, [14, 2, 8], { ...metric, center: [Infinity, 0, 0] })).toBe(
      camera,
    );
    expect(focusPointCamera(camera, [14, 2, 8], metric, NaN)).toBe(camera);
  });
});

describe('orthographic camera zoom', () => {
  it('uses the default view as scale one and scales inversely with eye distance', () => {
    const original = defaultMathCamera();
    const zoomed = zoomCamera(original, 4);
    expect(cameraScale(original)).toBe(1);
    expect(cameraScale(zoomed)).toBeCloseTo(4, 12);
    expect(zoomed.center).toEqual({ x: 0, y: 0, z: 0 });
    expect(cameraScale(cameraFacing(zoomed, [0, 0, 1]))).toBeCloseTo(4, 12);
  });

  it('keeps the same world point centered across zoom and subsequent point following', () => {
    const focused = focusPointCamera(camera, [14, 2, 8], metric, 0.5);
    const zoomed = zoomCamera(focused, 2);
    expect(Math.hypot(...cameraOffset(zoomed))).toBeCloseTo(0.25, 12);
    expect(cameraScale(zoomed) / cameraScale(focused)).toBeCloseTo(2, 12);
    for (const axis of ['x', 'y', 'z'] as const)
      expect((zoomed.center?.[axis] ?? 0) / cameraScale(zoomed)).toBeCloseTo(
        (focused.center?.[axis] ?? 0) / cameraScale(focused),
        12,
      );
    const recentered = focusPointCamera(zoomed, [14, 2, 8], metric);
    expectVector(cameraOffset(recentered), cameraOffset(zoomed));
    for (const axis of ['x', 'y', 'z'] as const)
      expect(recentered.center?.[axis]).toBeCloseTo(zoomed.center?.[axis] ?? 0, 12);
  });

  it('retains its world center at zoom limits and rejects invalid factors', () => {
    const focused = focusPointCamera(camera, [14, 2, 8], metric, 0.5);
    for (const [factor, distance] of [
      [1e9, 0.08],
      [1e-9, 80],
    ]) {
      const zoomed = zoomCamera(focused, factor);
      expect(Math.hypot(...cameraOffset(zoomed))).toBeCloseTo(distance, 11);
      expect((zoomed.center?.x ?? 0) / cameraScale(zoomed)).toBeCloseTo(2, 11);
    }
    expect(zoomCamera(focused, 0)).toBe(focused);
    expect(zoomCamera(focused, NaN)).toBe(focused);
  });
});

describe('render camera depth adapter', () => {
  it.each([0.08, 0.5, 80])(
    'keeps render depth at 500 while round-tripping zoom distance %s',
    (distance) => {
      const view = focusPointCamera(camera, [14, 2, 8], metric, distance);
      const before = structuredClone(view);
      const rendered = renderMathCamera(view);
      expect(Math.hypot(...cameraOffset(rendered))).toBeCloseTo(500, 10);
      expect(rendered.center).toEqual(view.center);
      expect(rendered.projection).toEqual({ type: 'orthographic' });
      const recovered = recoverMathCamera(rendered, view);
      expectVector(cameraOffset(recovered), cameraOffset(view));
      expect(recovered.center).toEqual(view.center);
      expect(recovered.up).toEqual(view.up);
      expect(cameraScale(recovered)).toBeCloseTo(cameraScale(view), 10);
      expect(view).toEqual(before);
    },
  );

  it('retains rendered pan, rotation, and up direction while restoring virtual zoom', () => {
    const view = focusPointCamera(camera, [14, 2, 8], metric, 0.5);
    const rendered: MathCamera = {
      center: { x: 4, y: -3, z: 2 },
      eye: { x: 4, y: 497, z: 2 },
      up: { x: 0, y: 0, z: -1 },
    };
    const recovered = recoverMathCamera(rendered, view);
    expect(recovered.center).toEqual(rendered.center);
    expect(recovered.up).toEqual(rendered.up);
    expectVector(cameraOffset(recovered), [0, 0.5, 0]);
    expect(recovered.projection).toEqual({ type: 'orthographic' });
    expect(Math.hypot(...cameraOffset(renderMathCamera(recovered)))).toBeCloseTo(500, 10);
  });

  it('accepts partial rendered events and rejects a degenerate rendered sightline', () => {
    const view = focusPointCamera(camera, [14, 2, 8], metric, 0.5);
    const partial = recoverMathCamera({ up: { x: 0, y: 0, z: -1 } }, view);
    expectVector(cameraOffset(partial), cameraOffset(view));
    expect(partial.center).toEqual(view.center);
    expect(partial.up).toEqual({ x: 0, y: 0, z: -1 });
    expect(
      recoverMathCamera({ center: { x: 0, y: 0, z: 0 }, eye: { x: 0, y: 0, z: 0 } }, view),
    ).toBe(view);
  });
});
