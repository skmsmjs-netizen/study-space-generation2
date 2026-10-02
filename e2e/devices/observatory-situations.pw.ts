import { expect, test, type Locator } from '@playwright/test';

const demoKey = 'study-space:demo:v1';

async function eventResponse(event: Locator) {
  return event.evaluate((element) => ({
    population: Number(element.getAttribute('data-event-population')),
    amplitude: Number((element as SVGElement).style.getPropertyValue('--obs-event-amplitude')),
    duration: parseFloat((element as SVGElement).style.getPropertyValue('--obs-event-duration')),
  }));
}

test('a new automatic situation responds to saved study without rerolling and survives pause and reload', async ({
  page,
}, info) => {
  // Fixed cosmetic schedule in an isolated synthetic account; no reference-event override.
  await page.clock.install({ time: new Date('2026-10-01T23:15:00Z') });
  await page.goto('?space=demo#/');
  const cover = page.getByRole('region', { name: '공부 사이의 풍경' });
  const event = cover.locator('[data-observatory-event]');
  await expect(cover).toHaveAttribute('data-time-phase', 'morning');
  await expect(event).toHaveCount(1);
  await expect(event).toHaveAttribute('data-event-variant', /^[1-6]$/);
  const selection = await event.getAttribute('data-observatory-event');
  const base = await event.getAttribute('data-event-base');
  if (!selection || !base) throw Error('Automatic situation identity missing');
  expect(selection).toMatch(new RegExp(`^${base}--[1-6]$`));
  const before = await eventResponse(event);

  await page.goto('?space=demo#/record');
  await page.getByRole('checkbox', { name: '함수는 어떤 관계일까?', exact: true }).check();
  await page.getByRole('button', { name: '1개 주제 기록 저장', exact: true }).click();
  await expect(page.getByRole('heading', { name: '최근 남긴 기록', exact: true })).toBeVisible();
  await page.goto('?space=demo#/');
  await expect(cover).toHaveAttribute('data-evolution-stage', '1');
  await expect(event).toHaveAttribute('data-observatory-event', selection);
  const after = await eventResponse(event);
  expect(after.population).toBeGreaterThan(before.population);
  expect(after.amplitude).toBeGreaterThan(before.amplitude);
  expect(after.duration).toBeLessThan(before.duration);
  // A fractional next particle demonstrates that response does not wait for integer counts.
  expect(after.population % 1).toBeGreaterThan(0);
  const fractionalParticle = event.locator(
    `[data-event-instance="${Math.floor(after.population)}"]`,
  );
  const opacity = Number(await fractionalParticle.getAttribute('opacity'));
  expect(opacity).toBeGreaterThan(0);
  expect(opacity).toBeLessThan(1);

  const saved = await page.evaluate((key) => localStorage.getItem(key), demoKey);
  await cover.getByRole('button', { name: '풍경 멈추기', exact: true }).click();
  await page.reload();
  await expect(cover).toHaveAttribute('data-motion', 'paused');
  await expect(event).toHaveAttribute('data-observatory-event', selection);
  expect(await eventResponse(event)).toEqual(after);
  expect(await page.evaluate((key) => localStorage.getItem(key), demoKey)).toBe(saved);
  const motions = await event.locator('*').evaluateAll((elements) =>
    elements
      .map((element) => getComputedStyle(element))
      .filter((style) => style.animationName !== 'none')
      .map((style) => style.animationPlayState),
  );
  expect(motions.length).toBeGreaterThan(0);
  expect(motions.every((state) => state === 'paused')).toBe(true);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
  await page.screenshot({ path: info.outputPath('automatic-variation-study-response.png') });
});

test('situation and time crossfades stay bounded and deterministic while pause and reduced motion are honored', async ({
  page,
}) => {
  // At 19:59 KST, two sunset situations and the incoming night situation overlap.
  await page.clock.install({ time: new Date('2026-10-02T10:59:00Z') });
  await page.goto('?space=demo#/');
  const cover = page.getByRole('region', { name: '공부 사이의 풍경' });
  const events = cover.locator('[data-observatory-event]');
  await expect(cover).toHaveAttribute('data-time-phase', 'sunset');
  await expect(events).toHaveCount(3);
  const identifiers = await events.evaluateAll((elements) =>
    elements.map((element) => element.getAttribute('data-observatory-event')),
  );
  expect(new Set(identifiers).size).toBe(3);
  const weight = await events.evaluateAll((elements) =>
    elements.reduce((sum, element) => sum + Number(element.getAttribute('opacity')), 0),
  );
  expect(weight).toBeCloseTo(1, 8);
  const original = await page.evaluate((key) => localStorage.getItem(key), demoKey);
  const stage = await cover.getAttribute('data-evolution-stage');
  if (stage === null) throw Error('Study stage missing');
  await cover.getByRole('button', { name: '풍경 멈추기', exact: true }).click();
  await page.reload();
  await expect(cover).toHaveAttribute('data-motion', 'paused');
  expect(
    await events.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute('data-observatory-event')),
    ),
  ).toEqual(identifiers);

  await page.clock.setSystemTime(new Date('2026-10-02T11:01:00Z'));
  await page.clock.fastForward(60000);
  await expect(cover).toHaveAttribute('data-time-phase', 'night');
  await expect(events).toHaveCount(2);
  await page.clock.setSystemTime(new Date('2026-10-02T11:21:00Z'));
  await page.clock.fastForward(60000);
  await expect(events).toHaveCount(1);
  await expect(cover).toHaveAttribute('data-evolution-stage', stage);
  await expect(cover).toHaveAttribute('data-motion', 'paused');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const animatedCount = await events
    .locator('*')
    .evaluateAll(
      (elements) =>
        elements.filter((element) => getComputedStyle(element).animationName !== 'none').length,
    );
  expect(animatedCount).toBe(0);
  expect(await page.evaluate((key) => localStorage.getItem(key), demoKey)).toBe(original);
});
