import { test, expect } from '@playwright/test';

test('long concept cards accumulate without losing text, overlap-free arrangement or reconnect state', async ({
  page,
}, info) => {
  test.setTimeout(150000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('?space=demo#/canvas');
  const stage = page.locator('.canvas-stage');
  await expect(stage.locator('.react-flow__node').first()).toBeVisible();
  const initial = await stage.locator('.react-flow__node').count();
  const title = '조건·예외와 아직 확인하지 못한 내용까지 유지하는 긴 개념 이름';
  const body =
    'V = IR. 온도와 저항이 일정하다는 조건을 확인한다.\n아직 직접 풀어 본 결과는 없다.  ';
  for (let index = 0; index < 25; index++) {
    await page.getByRole('button', { name: '개념 카드 추가', exact: true }).click();
    const form = page.getByRole('form', { name: '개념 카드 추가', exact: true });
    await form.getByLabel('개념 이름', { exact: true }).fill(`${index + 1}. ${title}`);
    await form.locator('summary').click();
    await form.getByLabel('개념 설명', { exact: true }).fill(body.repeat((index % 3) + 1));
    await form.getByRole('button', { name: '카드 추가', exact: true }).click();
    await expect(form).toHaveCount(0);
  }
  await expect(stage.locator('.react-flow__node')).toHaveCount(initial + 25);
  await page.getByRole('button', { name: '목차 배치', exact: true }).click();
  await stage.scrollIntoViewIfNeeded();
  await expect(stage.locator('.react-flow__minimap')).toBeVisible();
  // Check actual rendered boxes, including wrapped names and differently sized bodies.
  const overlaps = await stage.locator('.react-flow__node').evaluateAll((nodes) => {
    const boxes = nodes.map((node) => node.getBoundingClientRect());
    return boxes.flatMap((a, i) =>
      boxes
        .slice(i + 1)
        .filter(
          (b) =>
            Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 &&
            Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1,
        ),
    );
  });
  expect(overlaps).toHaveLength(0);
  await page.reload();
  await expect(stage.locator('.react-flow__node')).toHaveCount(initial + 25);
  const card = stage.getByRole('article', { name: `개념 카드 25. ${title}`, exact: true });
  await expect(card).toContainText(body.trim());
  await stage.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('react-flow-accumulation.png'), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  expect(errors).toEqual([]);
});

test('material map selection, layout, original evidence and settings survive save and reopen', async ({
  page,
}, info) => {
  test.skip(!process.env.STUDY_AI_FIXTURE_URL, '격리된 합성 자료 화면을 사용합니다.');
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const source = 'V=IR. 저항이 일정할 때만 비례한다.\n온도에 따라 저항이 달라질 수 있다.';
  await page.goto(`${process.env.STUDY_AI_FIXTURE_URL}#/materials/new`);
  await page.getByLabel('자료 제목', { exact: true }).fill('개념도 보존 확인');
  await page.getByLabel('강의 내용·필기', { exact: true }).fill(source);
  await page.getByRole('button', { name: '복습 자료 한 번에 만들기', exact: true }).click();
  await page.getByRole('button', { name: '개념도', exact: true }).click();
  const map = page.getByRole('region', { name: '자료 개념도', exact: true });
  const selected = map.getByLabel('개념·관계 선택', { exact: true });
  await selected.selectOption('node:n1');
  const name = '전압 · 저항과 온도가 일정하다는 조건을 확인하고 예외를 별도로 남긴다';
  await map.getByLabel('개념 이름', { exact: true }).fill(name);
  await selected.selectOption('');
  await selected.selectOption('edge:e1');
  await map.getByLabel('관계 설명', { exact: true }).fill('저항이 일정하다는 조건이 필요하다');
  await map.getByRole('button', { name: '연결을 따라 배치', exact: true }).click();
  await selected.selectOption('node:n1');
  await map.getByLabel('개념 가로 위치', { exact: true }).fill('321');
  await map.getByLabel('개념 세로 위치', { exact: true }).fill('-123');
  await map.getByRole('button', { name: /개념도 보기 도구/ }).click();
  await map.getByLabel('전체 위치 지도', { exact: true }).selectOption('show');
  await map.getByLabel('연결선 모양', { exact: true }).selectOption('bezier');
  await map.getByRole('button', { name: /개념도 보기 도구/ }).click();
  await page.getByRole('button', { name: '자료 저장', exact: true }).click();
  await expect(page.getByText('자료를 서버에 저장했습니다.', { exact: true })).toBeVisible();
  await page.waitForURL(/#\/materials\/(?!new$).+/, { waitUntil: 'load' });
  await page.reload();
  await page.getByRole('button', { name: '개념도', exact: true }).click();
  await selected.selectOption('node:n1');
  await expect(map.getByLabel('개념 이름', { exact: true })).toHaveValue(name);
  await expect(map.getByLabel('개념 가로 위치', { exact: true })).toHaveValue('321');
  await expect(map.getByLabel('개념 세로 위치', { exact: true })).toHaveValue('-123');
  await expect(map.locator('.react-flow__minimap')).toBeVisible();
  const sourceDetails = page.locator('details.material-source-region');
  if ((await sourceDetails.getAttribute('open')) === null)
    await sourceDetails.locator(':scope > summary').click();
  await expect(page.getByLabel('강의 내용·필기', { exact: true })).toHaveValue(source);
  await expect(page.getByLabel('합성 GPT 호출')).toHaveText('1');
  await map.getByRole('button', { name: '처음 개념도로 되돌리기', exact: true }).click();
  await expect(map.getByLabel('개념 이름', { exact: true })).toHaveValue('전압');
  await selected.selectOption('edge:e1');
  await expect(map.getByLabel('관계 설명', { exact: true })).toHaveValue('저항이 일정할 때 비례');
  await map.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath('react-flow-material-map.png'), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  expect(errors).toEqual([]);
});
