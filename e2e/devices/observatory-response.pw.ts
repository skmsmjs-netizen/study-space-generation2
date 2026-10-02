import { expect, test, type Locator } from '@playwright/test';
import { decodeStoredText } from '../../src/data/storage-codec';

const demoKey = 'study-space:demo:v1';
async function visibleResponse(cover: Locator) {
  return cover.evaluate((root) => {
    const sky = root.querySelector('[data-study-sky]');
    const station = root.querySelector('[data-study-station]');
    const stars = Array.from(root.querySelectorAll('[data-study-star]')).map((star) =>
      Number(star.getAttribute('opacity')),
    );
    return {
      inputCount: Number(sky?.getAttribute('data-input-count')),
      density: Number(station?.getAttribute('data-density')),
      activity: Number(station?.getAttribute('data-activity')),
      wash: Number(root.querySelector('[data-study-wash]')?.getAttribute('opacity')),
      lamps: Number(root.querySelector('[data-study-lamps]')?.getAttribute('opacity')),
      stars,
      starLight: stars.reduce((sum, opacity) => sum + opacity, 0),
    };
  });
}

test('the first two saved study inputs gently enrich the sky and station and survive reload without rewriting records', async ({
  page,
}, info) => {
  await page.clock.install({ time: new Date('2026-10-02T03:15:00Z') });
  await page.goto('?space=demo#/');
  const cover = page.getByRole('region', { name: '공부 사이의 풍경' });
  const sky = cover.locator('[data-study-sky]');
  await expect(sky).toHaveAttribute('data-input-count', '0');
  const empty = await visibleResponse(cover);
  expect(empty.starLight).toBe(0);
  expect(empty.wash).toBe(0);
  expect(empty.lamps).toBe(0);

  const bodies = [
    '  작은 공부 기록\n확인되지 않은 부분은 그대로.  ',
    '  두 번째 기록\n아직 모르는 것도 남긴다.  ',
  ];
  const topics = ['함수는 어떤 관계일까?', '그래프에서 변화 읽기'];
  let previous = empty;
  for (let index = 0; index < topics.length; index++) {
    await page.goto('?space=demo#/record');
    await page.getByRole('checkbox', { name: topics[index], exact: true }).check();
    await page.getByRole('textbox', { name: '메모', exact: true }).fill(bodies[index]);
    await page.getByRole('button', { name: '1개 주제 기록 저장', exact: true }).click();
    await expect(page.getByRole('heading', { name: '최근 남긴 기록', exact: true })).toBeVisible();
    await page.goto('?space=demo#/');
    await expect(sky).toHaveAttribute('data-input-count', String(index + 1));
    const next = await visibleResponse(cover);
    for (const key of ['starLight', 'wash', 'lamps', 'density', 'activity'] as const)
      expect(next[key]).toBeGreaterThan(previous[key]);
    expect(next.wash).toBeLessThan(0.05);
    expect(next.lamps).toBeLessThan(0.5);
    previous = next;
  }
  expect(previous.stars.some((opacity) => opacity > 0 && opacity < 1)).toBe(true);
  const bytes = await page.evaluate((key) => localStorage.getItem(key), demoKey);
  if (!bytes) throw new Error('Synthetic saved study data missing');
  const saved = JSON.parse(decodeStoredText(bytes)).data;
  expect(saved.records).toHaveLength(2);
  expect(saved.records.map((record: { body: string }) => record.body)).toEqual(bodies);
  expect(new Set(saved.records.map((record: { targetId: string }) => record.targetId)).size).toBe(
    2,
  );

  await cover.getByRole('button', { name: '풍경 멈추기', exact: true }).click();
  await page.reload();
  await expect(cover).toHaveAttribute('data-motion', 'paused');
  await expect(sky).toHaveAttribute('data-input-count', '2');
  expect(await visibleResponse(cover)).toEqual(previous);
  expect(await page.evaluate((key) => localStorage.getItem(key), demoKey)).toBe(bytes);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
  await cover.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('two-input-sky-and-station.png') });
});
