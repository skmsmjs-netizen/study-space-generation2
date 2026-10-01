/** Shared controls for the two renderers; zoom never changes mathematical inputs. */
export type MathZoomRef = { current: ((factor: number) => void) | null };
