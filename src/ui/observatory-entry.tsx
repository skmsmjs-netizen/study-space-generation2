import { emptyState } from '../domain/model';
import { ObservatoryCover } from './observatory-cover';

// The public entrance has no study evidence or account data. Reuse the full
// original room renderer, with a separate optional scenery preference only.
const entrance = emptyState('entrance', 'personal');

export function ObservatoryEntry() {
  return <header className="observatory-entry-cover">
    <a className="entry-direct-link" href="#entry-main" onClick={event => {
      event.preventDefault();
      const main = document.getElementById('entry-main');
      main?.focus({ preventScroll: true });
      main?.scrollIntoView({ block: 'start' });
    }}>내 공부 공간으로 이동</a>
    <ObservatoryCover data={entrance} subjectIds={[]} place="front" route="/account" />
  </header>;
}
