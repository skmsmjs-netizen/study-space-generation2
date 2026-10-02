import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const contract = JSON.parse(await readFile(new URL('docs/layout-standard-contract.json', root), 'utf8'));
const registered = new Set(contract.registeredEntries.filter(x => x.primaryScreenCandidate).map(x => x.id));
const allPatterns = new Set(contract.registeredEntries.map(x => x.id));
const entities = {};
for (const entity of contract.entityLayouts) {
  if (entities[entity.entityId]) throw new Error(`Duplicate layout: ${entity.entityId}`);
  if (!allPatterns.has(entity.primaryPattern) || (entity.scope === 'screen' && !registered.has(entity.primaryPattern))) throw new Error(`Unregistered layout: ${entity.entityId}`);
  entities[entity.entityId] = {
    profile: entity.profileId,
    primary: entity.primaryPattern,
    narrow: entity.narrowPattern,
    wrapper: entity.wrapperPattern,
  };
}
// Ship the executable selection only, not the research/source/verification corpus.
await writeFile(new URL('src/ui/observatory-layouts.json', root), JSON.stringify({ version: contract.version, entities }, null, 2) + '\n');
console.log(`OS layout selections: ${Object.keys(entities).length}`);
