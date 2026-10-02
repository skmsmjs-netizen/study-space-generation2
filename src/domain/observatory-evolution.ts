import type { StudyRecord } from './model';
import { studyInputDay } from './daily-study-dynamics';

export const OBSERVATORY_STAGES = 12;
export interface ObservatoryEvolution {
  inputCount: number;
  position: number;
  stage: number;
  blend: number;
  stars: number;
  constellations: number;
  orbits: number;
  halo: number;
  dust: number;
  nebula: number;
  galaxy: number;
  aurora: number;
  meteorShower: number;
  colorBloom: number;
  lightRibbons: number;
  supernova: number;
  satellite: number;
  planet: number;
  eclipse: number;
  crown: number;
}
const ease = (value: number) => {
  const x = Math.max(0, Math.min(1, value));
  return x * x * (3 - 2 * x);
};
/** Cosmetic development, not a learning score. Doubling intervals leave room for continued use. */
export function observatoryEvolution(inputCount: number): ObservatoryEvolution {
  if (!Number.isSafeInteger(inputCount) || inputCount < 0)
    throw new RangeError('Invalid observed inputs');
  const position = Math.min(OBSERVATORY_STAGES - 1, Math.log2(1 + inputCount));
  const stage = Math.floor(position);
  return {
    inputCount,
    position,
    stage,
    blend: position - stage,
    stars: Math.round(16 + 18 * position),
    constellations: ease(position - 1),
    orbits: Math.min(6, Math.max(0, Math.floor(position - 1))),
    halo: ease(position - 3),
    dust: ease(position - 4),
    nebula: ease(position - 5),
    galaxy: ease(position - 6),
    aurora: ease(position - 8),
    meteorShower: ease(position - 9),
    colorBloom: ease(position / 7),
    lightRibbons: ease(position - 6),
    supernova: ease(position - 9),
    satellite: ease(position - 2),
    planet: ease(position - 4),
    eclipse: ease(position - 7),
    crown: ease(position - 10),
  };
}
/** Caller has already selected current active owner/scope versions. Input-time evidence only. */
export function buildObservatoryEvolution(
  records: readonly StudyRecord[],
  referenceDay: number,
): ObservatoryEvolution {
  if (!Number.isInteger(referenceDay)) throw new RangeError('Invalid input calendar');
  const inputs = new Set<string>();
  for (const row of records) {
    const day = studyInputDay(row.createdAt);
    if (day === null || day > referenceDay) continue;
    inputs.add(JSON.stringify([row.sessionId, row.subjectId, row.targetId]));
  }
  return observatoryEvolution(inputs.size);
}
