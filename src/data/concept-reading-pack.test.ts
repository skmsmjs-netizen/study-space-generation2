import { expect, test } from 'vitest';
import { loadConceptReadingPack } from './concept-reading-pack';

test('the published distribution retains every reviewed scene without private source metadata', async () => {
  const pack = await loadConceptReadingPack();
  // Development may deliberately use a private local asset; Pages/CI uses distribution.
  if (pack?.distribution !== 'published') {
    expect(Boolean(process.env.CI || process.env.PAGES_BASE)).toBe(false);
    return;
  }
  expect(pack.editions).toHaveLength(1168);
  expect(pack.editions.reduce((count, row) => count + row.screen!.scenes.length, 0)).toBe(1851);
  const originals = JSON.parse(pack.catalog.raw).items;
  expect(originals.map((row: {id:string}) => row.id)).toEqual(pack.editions.map(row => row.sourceId));
  for (const row of originals)
    expect(Object.keys(row).sort()).toEqual(['cat', 'def', 'ex', 'id', 'insight', 'name', 'type']);
  for (const row of pack.editions) {
    expect(row.jobId).toBeNull();
    expect(row).not.toHaveProperty('createdAt');
    expect(row).not.toHaveProperty('updatedAt');
    expect(row.screen!.design!.sourceSha256).toBe(pack.sourceSha256);
  }
  expect(JSON.stringify(pack)).not.toMatch(/"(?:notePath|annotations|userId|namespace|appliedOps|revisions)"\s*:/);
  expect(JSON.stringify(pack)).not.toMatch(/\/Users\/|file:\/\/|obsidian:\/\//);
});
