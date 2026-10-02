export type GraphRanges = { x: [number, number]; y: [number, number] };
export function gestureRanges(
  base: GraphRanges,
  factor: number,
  start: { x: number; y: number },
  current?: { x: number; y: number },
  minimum?: number,
): GraphRanges | null;
