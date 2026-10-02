import type { CSSProperties } from 'react';
import type { ObservatorySky } from '../domain/observatory-time';
import { observatoryTimePalette } from './observatory-time-palette';
import type { StudyLandscape } from '../domain/study-landscape';

/** Shared by the real cover and the read-only stage gallery. */
export function observatoryPresentation(
  landscape: StudyLandscape,
  response = 0.25 + 0.5 * landscape.dynamics.recent[0] + 0.25 * landscape.evolution.colorBloom,
  sky?: ObservatorySky,
): CSSProperties {
  return {
    ...(sky ? observatoryTimePalette(sky) : {}),
    '--pixel-wind-period': `${20 - 12 * landscape.dynamics.recent[1]}s`,
    '--pixel-wave-period': `${7 - 4 * landscape.dynamics.recent[0]}s`,
    '--pixel-wave-travel': `${4 + Math.round(12 * Math.abs(landscape.dynamics.change[0]))}px`,
    '--pixel-boat-bob': `${1 + Math.round(5 * Math.abs(landscape.dynamics.change[0]))}px`,
    '--pixel-walk-period': `${32 - 16 * landscape.dynamics.recent[2]}s`,
    '--pixel-step-period': `${0.9 - 0.4 * landscape.dynamics.recent[2]}s`,
    '--pixel-sway-period': `${5 - 2 * landscape.dynamics.recent[1]}s`,
    '--pixel-orbit-tilt': `${Math.round(-10 + 20 * landscape.dynamics.background[2])}deg`,
    '--pixel-color-bloom': `${100 * landscape.evolution.colorBloom}%`,
    '--pixel-stage-period': `${42 - landscape.evolution.position * 2}s`,
    '--pixel-response': response,
  } as CSSProperties;
}
