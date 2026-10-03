import type { AppState } from '../domain/model';
import type { StudyRepository } from './repository';
import { emptyRileyView, validateRileyView, type RileyPosition } from './riley-observations';
const mark = '[ManSeekSong Riley observation v1]';
const sha = '6ea57e9b0829a6de8b0b93db66cb582cbdda8fc343c9f1d017326769b9e66897';
export function rileySnapshot(body: string) {
  if (!body.startsWith(mark + '\n')) return null;
  const raw = JSON.parse(body.slice(mark.length + 1)) as {
    source: string;
    section: string;
    position: RileyPosition;
  };
  if (raw.source !== sha || !/^riley-3e-section-\d+\.\d+$/.test(raw.section))
    throw Error('이 교재의 관찰 보관본이 아니다. 현재 입력은 유지한다.');
  validateRileyView({ ...emptyRileyView(), positions: { [raw.section]: raw.position } });
  return raw;
}
export function keepRileySnapshot(
  repo: StudyRepository,
  data: Pick<AppState, 'namespace' | 'userId'>,
  section: string,
  position: RileyPosition,
  ownerId: string | null,
) {
  const body = mark + '\n' + JSON.stringify({ source: sha, section, position }, null, 2);
  rileySnapshot(body);
  return repo.execute({
    type: 'saveMemo',
    id: 'riley-observation:' + crypto.randomUUID(),
    ownerId,
    body,
    strokes: [],
    expectedVersion: 0,
    opId: crypto.randomUUID(),
    at: new Date().toISOString(),
    userId: data.userId,
    namespace: data.namespace,
  });
}
export function isRileySnapshot(body: string) {
  return body.startsWith(mark + '\n');
}
