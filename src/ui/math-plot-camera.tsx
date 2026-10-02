import type { Camera } from 'plotly.js-dist-min';
import type { Vec3 } from '../domain/math-explorer';
import { Button, Select } from './index';

export type MathCamera = Partial<Camera> & {
  projection?: { type: 'orthographic' | 'perspective' };
};
export const defaultMathCamera = (): MathCamera => ({
  eye: { x: 1.25, y: 1.25, z: 1.25 },
  up: { x: 0, y: 0, z: 1 },
  projection: { type: 'orthographic' },
});
export function cameraOffset(camera: MathCamera): Vec3 {
  return ['x', 'y', 'z'].map((axis) => {
    const key = axis as 'x' | 'y' | 'z';
    return (camera.eye?.[key] ?? 1.25) - (camera.center?.[key] ?? 0);
  }) as Vec3;
}
/** Orthographic framing needs an explicit model scale; eye distance alone does not zoom. */
export function cameraScale(camera: MathCamera): number {
  const baseline = Math.hypot(...cameraOffset(defaultMathCamera()));
  return baseline / Math.max(0.08, Math.min(80, Math.hypot(...cameraOffset(camera))));
}
/** Keep the rendered eye halfway through Plotly's fixed orthographic depth range. */
export function renderMathCamera(view: MathCamera): MathCamera {
  const center = {
    x: view.center?.x ?? 0,
    y: view.center?.y ?? 0,
    z: view.center?.z ?? 0,
  };
  let offset = cameraOffset(view);
  let length = Math.hypot(...offset);
  if (!Number.isFinite(length) || length < 1e-12) {
    offset = cameraOffset(defaultMathCamera());
    length = Math.hypot(...offset);
  }
  const ratio = 500 / length;
  return {
    ...view,
    center,
    eye: {
      x: center.x + offset[0] * ratio,
      y: center.y + offset[1] * ratio,
      z: center.z + offset[2] * ratio,
    },
    projection: { type: 'orthographic' },
  };
}

/** Recover pan/rotation without allowing the render-only eye distance to change zoom. */
export function recoverMathCamera(rendered: MathCamera, previousView: MathCamera): MathCamera {
  const previousRendered = renderMathCamera(previousView);
  const next = {
    ...previousRendered,
    ...rendered,
    center: { ...previousRendered.center, ...rendered.center },
    eye: { ...previousRendered.eye, ...rendered.eye },
    up: { ...previousRendered.up, ...rendered.up },
  };
  const offset = cameraOffset(next);
  const length = Math.hypot(...offset);
  const previousDistance = Math.hypot(...cameraOffset(previousView));
  if (!Number.isFinite(length) || length < 1e-12 || !Number.isFinite(previousDistance))
    return previousView;
  const ratio = previousDistance / length;
  return {
    ...next,
    eye: {
      x: (next.center.x ?? 0) + offset[0] * ratio,
      y: (next.center.y ?? 0) + offset[1] * ratio,
      z: (next.center.z ?? 0) + offset[2] * ratio,
    },
    projection: { type: 'orthographic' },
  };
}
export function cameraFacing(camera: MathCamera, direction: Vec3): MathCamera {
  const unit = Math.hypot(...direction);
  if (!unit || !Number.isFinite(unit)) return camera;
  const distance = Math.max(0.08, Math.hypot(...cameraOffset(camera)));
  const center = camera.center ?? { x: 0, y: 0, z: 0 };
  return {
    ...camera,
    eye: {
      x: (center.x ?? 0) + direction[0] * distance / unit,
      y: (center.y ?? 0) + direction[1] * distance / unit,
      z: (center.z ?? 0) + direction[2] * distance / unit,
    },
    // Looking straight down needs an up vector perpendicular to the sightline.
    up: Math.abs(direction[2] / unit) > 0.99 ? { x: 0, y: 1, z: 0 } : { x: 0, y: 0, z: 1 },
  };
}
export function zoomCamera(camera: MathCamera, factor: number): MathCamera {
  if (!Number.isFinite(factor) || factor <= 0) return camera;
  let offset = cameraOffset(camera);
  let distance = Math.hypot(...offset);
  if (!Number.isFinite(distance)) return camera;
  const nextDistance = Math.max(0.08, Math.min(80, distance / factor));
  if (distance < 1e-12) {
    offset = cameraOffset(defaultMathCamera());
    distance = Math.hypot(...offset);
  }
  const ratio = nextDistance / distance;
  const nextScale = Math.hypot(...cameraOffset(defaultMathCamera())) / nextDistance;
  const centerRatio = nextScale / cameraScale(camera);
  const center = {
    x: (camera.center?.x ?? 0) * centerRatio,
    y: (camera.center?.y ?? 0) * centerRatio,
    z: (camera.center?.z ?? 0) * centerRatio,
  };
  return { ...camera, center, eye: {
    x: center.x + offset[0] * ratio,
    y: center.y + offset[1] * ratio,
    z: center.z + offset[2] * ratio,
  } };
}

/** Recenter a world point without rotating the view or changing its zoom by default. */
export function focusPointCamera(
  camera: MathCamera,
  point: Vec3,
  metric: { center: Vec3; unit: number },
  distance?: number,
): MathCamera {
  if (
    !Number.isFinite(metric.unit) || metric.unit <= 0 ||
    !point.every(Number.isFinite) || !metric.center.every(Number.isFinite) ||
    (distance !== undefined && !Number.isFinite(distance))
  ) return camera;
  // gl-plot3d maps a world coordinate to aspect * (p - rangeCenter) / rangeSpan.
  // The unbounded scene sets aspect = rangeSpan / metric.unit * cameraScale.
  // Apply that same scale to the focused point, independently of the clipping cube.
  let offset = cameraOffset(camera);
  if (!offset.every(Number.isFinite)) return camera;
  if (distance !== undefined) {
    let length = Math.hypot(...offset);
    // A coincident eye/center has no direction. An explicit focus distance uses
    // the standard oblique direction so that the resulting view stays valid.
    if (length < 1e-12) {
      offset = cameraOffset(defaultMathCamera());
      length = Math.hypot(...offset);
    }
    const ratio = Math.max(0.08, Math.min(80, distance)) / length;
    offset = offset.map((value) => value * ratio) as Vec3;
  }
  const viewScale = distance === undefined
    ? cameraScale(camera)
    : Math.hypot(...cameraOffset(defaultMathCamera())) / Math.max(0.08, Math.min(80, distance));
  const center = point.map((value, index) => (value - metric.center[index]) / metric.unit * viewScale) as Vec3;
  if (!center.every(Number.isFinite)) return camera;
  return {
    ...camera,
    center: { x: center[0], y: center[1], z: center[2] },
    eye: { x: center[0] + offset[0], y: center[1] + offset[1], z: center[2] + offset[2] },
  };
}

/** Explicit actions preserve zoom/center; slider updates never choose a new view. */
export function MathCameraControls({ readCamera, applyCamera, disabled, vectors, pointFocus }: {
  readCamera: () => MathCamera;
  applyCamera: (camera: MathCamera) => void;
  disabled: boolean;
  vectors?: { T?: Vec3; N?: Vec3; B?: Vec3 };
  pointFocus?: { active: boolean; available: boolean; toggle: () => void };
}) {
  const turn = (yaw: number, elevation: number) => {
    const current = readCamera(), offset = cameraOffset(current);
    const theta = Math.atan2(offset[1], offset[0]) + yaw * Math.PI / 180;
    const phi = Math.max(-85, Math.min(85,
      Math.atan2(offset[2], Math.hypot(offset[0], offset[1])) * 180 / Math.PI + elevation,
    )) * Math.PI / 180;
    applyCamera(cameraFacing(current, [Math.cos(phi) * Math.cos(theta), Math.cos(phi) * Math.sin(theta), Math.sin(phi)]));
  };
  const { T, N, B } = vectors ?? {};
  const frame = T && N && B ? T.map((v, i) => v + N[i] + B[i]) as Vec3 : undefined;
  // An orthonormal TNB frame viewed along T+N+B projects to three equal,
  // separated rays. Use the opposite direction if needed to stay above z=0.
  if (frame && frame[2] < 0) frame.forEach((v, i) => { frame[i] = -v; });
  return (
    <fieldset className="math-camera-controls" aria-label="3차원 시점">
      {pointFocus && <Button
        disabled={disabled || (!pointFocus.active && !pointFocus.available)}
        aria-pressed={pointFocus.active}
        title={pointFocus.active ? '근접 보기 전의 시야로 돌아갑니다' : '현재 점을 중심으로 확대하고 t의 움직임을 따라갑니다'}
        onClick={pointFocus.toggle}
      >{pointFocus.active ? '이전 시야로' : '점 가까이 보기'}</Button>}
      <Select label="바라보는 방향" value="" disabled={disabled} onChange={(e) => {
        const directions: Record<string, Vec3> = {
          oblique: [1, 1, 1], front: [0, -1, 0], side: [1, 0, 0], top: [0, 0, 1],
        };
        const direction = directions[e.target.value];
        if (direction) applyCamera(cameraFacing(readCamera(), direction));
      }}>
        <option value="">시점 선택</option>
        <option value="oblique">위쪽 사선</option>
        <option value="front">정면 · xz 평면</option>
        <option value="side">측면 · yz 평면</option>
        <option value="top">위에서 · xy 평면</option>
      </Select>
      {frame && <Button disabled={disabled} onClick={() => applyCamera(cameraFacing(readCamera(), frame))}>세 벡터 보기</Button>}
      <fieldset className="math-camera-turns" aria-label="15도씩 회전">
        <Button disabled={disabled} aria-label="왼쪽으로 회전" title="왼쪽으로 15° 회전" onClick={() => turn(-15, 0)}>←</Button>
        <Button disabled={disabled} aria-label="오른쪽으로 회전" title="오른쪽으로 15° 회전" onClick={() => turn(15, 0)}>→</Button>
        <Button disabled={disabled} aria-label="위쪽에서 보기" title="시점 높이기 15°" onClick={() => turn(0, 15)}>↑</Button>
        <Button disabled={disabled} aria-label="아래쪽에서 보기" title="시점 낮추기 15°" onClick={() => turn(0, -15)}>↓</Button>
      </fieldset>
    </fieldset>
  );
}
