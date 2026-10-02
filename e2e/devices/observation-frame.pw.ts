import { test, expect, type FrameLocator, type Page } from '@playwright/test';

const viewKey = 'study-space:demo:concept-interactives:view:v1';
const roles = ['question', 'visual', 'controls', 'readout', 'reasoning', 'reference'];

async function openObservation(page: Page) {
  await page.goto('?space=demo#/math');
  await page.getByLabel('탐색할 내용', { exact: true }).selectOption('concepts');
  const frame = page.frameLocator('iframe[title="개념 탐구실 인터랙티브"]');
  await ready(frame);
  return frame;
}

async function ready(frame: FrameLocator) {
  await expect(frame.locator('#plot')).toHaveAttribute('aria-busy', 'false', {
    timeout: 30_000,
  });
}

async function setNumber(frame: FrameLocator, label: string, value: string) {
  const input = frame.getByLabel(label, { exact: true });
  await input.fill(value);
  await input.press('Tab');
  await ready(frame);
}

async function readViews(page: Page) {
  return page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    if (raw === null) throw Error('관찰 보기 저장값이 없습니다.');
    return JSON.parse(raw);
  }, viewKey);
}

async function expectFrameLayout(frame: FrameLocator) {
  const domain = frame.locator('[data-observation-region="question"] #domain');
  await expect(domain).toBeVisible();
  await expect(domain).not.toBeEmpty();
  const layout = await frame.locator('body').evaluate((body) => {
    const regions = [...body.querySelectorAll<HTMLElement>('[data-observation-region]')];
    const boxes = Object.fromEntries(
      regions.map((element) => {
        const box = element.getBoundingClientRect();
        const region = element.dataset.observationRegion;
        if (!region) throw Error('관찰 영역의 역할이 없습니다.');
        return [
          region,
          { x: box.x, y: box.y, right: box.right, bottom: box.bottom, width: box.width },
        ];
      }),
    );
    const viewportNode = body.querySelector('.instrument-viewport');
    const toolbarNode = body.querySelector('.graph-toolbar');
    if (!viewportNode || !toolbarNode) throw Error('관찰 화면이나 그래프 조작을 찾지 못했습니다.');
    const viewport = viewportNode.getBoundingClientRect();
    const toolbar = toolbarNode.getBoundingClientRect();
    return {
      roles: regions.map((element) => element.dataset.observationRegion),
      boxes,
      stacked:
        matchMedia('(max-width: 52rem)').matches || body.classList.contains('graph-expanded'),
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      toolbarInViewport: toolbar.x >= viewport.x && toolbar.right <= viewport.right + 1,
    };
  });
  expect(layout.roles).toEqual(roles);
  const { question, visual, controls, readout, reasoning, reference } = layout.boxes;
  expect(question.bottom).toBeLessThanOrEqual(visual.y + 1);
  if (layout.stacked) {
    expect(visual.bottom).toBeLessThanOrEqual(controls.y + 1);
    expect(Math.abs(visual.x - controls.x)).toBeLessThan(1);
  } else {
    expect(visual.right).toBeLessThanOrEqual(controls.x + 1);
    expect(visual.width).toBeGreaterThan(controls.width);
    expect(Math.abs(visual.y - controls.y)).toBeLessThan(1);
  }
  expect(controls.bottom).toBeLessThanOrEqual(readout.y + 1);
  expect(Math.max(visual.bottom, readout.bottom)).toBeLessThanOrEqual(reasoning.y + 1);
  expect(Math.abs(reasoning.x - visual.x)).toBeLessThan(1);
  expect(reasoning.right).toBeGreaterThanOrEqual(Math.max(visual.right, readout.right) - 1);
  expect(reasoning.bottom).toBeLessThanOrEqual(reference.y + 1);
  expect(layout.overflow).toBe(false);
  expect(layout.toolbarInViewport).toBe(true);
}

test('the shared observation positions support approximation, space, condition and physical models', async ({
  page,
}, info) => {
  const frame = await openObservation(page);
  await expectFrameLayout(frame);
  await setNumber(frame, '근사 차수 N', '6');
  await expect(frame.locator('#result')).toContainText('오차 상계');
  await expectFrameLayout(frame);
  await page.screenshot({ path: info.outputPath('observation-taylor.png'), fullPage: true });

  await frame.getByLabel('살펴볼 개념', { exact: true }).selectOption('matrix');
  await setNumber(frame, '가로 방향 배율 a', '0');
  await expect(frame.locator('#result')).toContainText('차원 붕괴');
  await expect(frame.locator('#explanation')).toContainText('0이면');
  await expectFrameLayout(frame);

  await frame.getByLabel('살펴볼 개념', { exact: true }).selectOption('series');
  await setNumber(frame, '지수 p', '1');
  await frame.getByLabel('원래 급수의 부호', { exact: true }).selectOption('alternating');
  await ready(frame);
  await expect(frame.locator('#result')).toContainText('적용 불가는 발산의 결론이 아닙니다');
  await frame.getByRole('button', { name: '2. 양항급수인가?', exact: true }).click();
  await expect(frame.locator('#explanation')).toContainText('발산을 결론내릴 수는 없습니다');
  await expect(frame.getByRole('button', { name: '다음 단계', exact: true })).toBeDisabled();
  await expectFrameLayout(frame);

  await frame.getByLabel('살펴볼 개념', { exact: true }).selectOption('motion');
  await frame.getByLabel('살펴볼 물리량', { exact: true }).selectOption('velocity');
  await ready(frame);
  await expect(frame.locator('#physical-scene')).toBeVisible();
  await expect(frame.locator('#graph-x-label')).toContainText('시간');
  await expectFrameLayout(frame);

  await frame.getByLabel('살펴볼 개념', { exact: true }).selectOption('energy');
  await frame.getByLabel('비보존력의 일', { exact: true }).selectOption('unknown');
  await ready(frame);
  await expect(frame.locator('#result')).toContainText('결론은 보류합니다');
  await frame.getByRole('button', { name: '3. 비보존력이 일을 하는가?', exact: true }).click();
  await expect(frame.locator('#explanation')).toContainText('아직 확인하지 못했습니다');
  await expectFrameLayout(frame);
});

test('observation controls preserve the selected view and reasoning while resets stay scoped', async ({
  page,
}) => {
  const frame = await openObservation(page);
  await setNumber(frame, '근사 차수 N', '6');
  await setNumber(frame, '관찰 위치 x', '2.5');
  await frame.getByLabel('보기 방식', { exact: true }).selectOption('derive');
  await frame.getByRole('button', { name: '다음 단계', exact: true }).click();
  await frame.getByRole('button', { name: '그래프 확대', exact: true }).click();
  await expect
    .poll(async () => (await readViews(page)).views.taylor.plotRanges?.main.x[1])
    .toBeCloseTo(2.4, 7);
  const zoomed = (await readViews(page)).views.taylor.plotRanges.main;

  await setNumber(frame, '근사 차수 N', '7');
  await expect
    .poll(async () => (await readViews(page)).views.taylor.plotRanges.main)
    .toEqual(zoomed);
  await expect(frame.locator('#reading-position')).toHaveText('현재 2 / 4 단계');
  await expectFrameLayout(frame);
  await frame.getByRole('button', { name: '전체 보기', exact: true }).click();
  await expect
    .poll(async () => (await readViews(page)).views.taylor.plotRanges.main.x)
    .toEqual([-3, 3]);
  await expect(frame.getByLabel('근사 차수 N', { exact: true })).toHaveValue('7');
  await expect(frame.getByLabel('관찰 위치 x', { exact: true })).toHaveValue('2.5');
  await expect(frame.locator('#reading-position')).toHaveText('현재 2 / 4 단계');

  await frame.getByRole('button', { name: '크게 보기', exact: true }).click();
  await ready(frame);
  await expectFrameLayout(frame);
  await frame.locator('#graph-large').press('Escape');
  await expect(frame.locator('#graph-large')).toBeFocused();
  await expect(frame.locator('#graph-large')).toHaveAttribute('aria-expanded', 'false');
  await ready(frame);
  await frame.getByRole('button', { name: '그래프 확대', exact: true }).click();
  await expect
    .poll(async () => (await readViews(page)).views.taylor.plotRanges.main.x[1])
    .toBeCloseTo(2.4, 7);
  const savedTaylor = (await readViews(page)).views.taylor;

  await frame.getByLabel('살펴볼 개념', { exact: true }).selectOption('matrix');
  await setNumber(frame, '가로 방향 배율 a', '-1.5');
  await frame.getByLabel('보기 방식', { exact: true }).selectOption('derive');
  await frame.getByRole('button', { name: '다음 단계', exact: true }).click();
  await expect.poll(async () => (await readViews(page)).views.matrix.step).toBe(1);
  const savedMatrix = (await readViews(page)).views.matrix;
  await frame.getByLabel('살펴볼 개념', { exact: true }).selectOption('taylor');
  await expect.poll(async () => (await readViews(page)).views.taylor).toEqual(savedTaylor);
  await expect(frame.getByLabel('근사 차수 N', { exact: true })).toHaveValue('7');
  await expect(frame.locator('#reading-position')).toHaveText('현재 2 / 4 단계');
  await page.reload();
  await ready(frame);
  await expect(frame.getByLabel('근사 차수 N', { exact: true })).toHaveValue('7');
  await expect(frame.getByLabel('관찰 위치 x', { exact: true })).toHaveValue('2.5');
  await expect(frame.locator('#reading-position')).toHaveText('현재 2 / 4 단계');
  await expect.poll(async () => (await readViews(page)).views.taylor).toEqual(savedTaylor);
  await expectFrameLayout(frame);

  await frame.getByRole('button', { name: '이 개념 처음으로', exact: true }).click();
  await expect(frame.getByLabel('근사 차수 N', { exact: true })).toHaveValue('3');
  await expect.poll(async () => (await readViews(page)).views.matrix).toEqual(savedMatrix);
  await frame.getByLabel('살펴볼 개념', { exact: true }).selectOption('matrix');
  await expect(frame.getByLabel('가로 방향 배율 a', { exact: true })).toHaveValue('-1.5');
  await expect(frame.locator('#reading-position')).toHaveText('현재 2 / 4 단계');
});
