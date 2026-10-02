export interface TemplateView {
  camera?: {
    eye?: { x: number; y: number; z: number };
    center?: { x: number; y: number; z: number };
    up?: { x: number; y: number; z: number };
  };
  ranges?: { x: [number, number]; y: [number, number] };
  alternate?: boolean;
  pointFocus?: { returnCamera: NonNullable<TemplateView['camera']> };
}
function isTemplateCamera(camera: unknown): camera is NonNullable<TemplateView['camera']> {
  if (!camera || typeof camera !== 'object' || Array.isArray(camera)) return false;
  const value = camera as NonNullable<TemplateView['camera']>;
  return (['eye', 'center', 'up'] as const).every((key) => {
    const axis = value[key];
    return (
      axis === undefined ||
      (!!axis &&
        typeof axis === 'object' &&
        !Array.isArray(axis) &&
        (['x', 'y', 'z'] as const).every(
          (k) => typeof axis[k] === 'number' && Number.isFinite(axis[k]) && Math.abs(axis[k]) < 1e6,
        ))
    );
  });
}
export function isTemplateView(view: unknown): view is TemplateView {
  if (!view || typeof view !== 'object' || Array.isArray(view)) return false;
  const v = view as TemplateView;
  if (v.alternate !== undefined && typeof v.alternate !== 'boolean') return false;
  if (
    v.ranges &&
    !['x', 'y'].every((key) => {
      const range = v.ranges![key as 'x' | 'y'];
      return (
        Array.isArray(range) &&
        range.length === 2 &&
        range.every((n) => typeof n === 'number' && Number.isFinite(n) && Math.abs(n) < 1e9) &&
        range[1] - range[0] >= 1e-8
      );
    })
  )
    return false;
  if (v.camera !== undefined && !isTemplateCamera(v.camera)) return false;
  if (
    v.pointFocus !== undefined &&
    (!v.pointFocus ||
      typeof v.pointFocus !== 'object' ||
      Array.isArray(v.pointFocus) ||
      !isTemplateCamera(v.pointFocus.returnCamera))
  )
    return false;
  return true;
}
