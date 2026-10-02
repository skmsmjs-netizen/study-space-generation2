import { expect, test, type Page } from '@playwright/test';
import { decodeStoredText } from '../../src/data/storage-codec';

async function expectPlaceScene(page: Page, place: string) {
  const scenes = page.locator('[data-place-scene]');
  if (place === 'front') {
    await expect(scenes).toHaveCount(0);
    await expect(page.getByRole('region', { name: '공부 사이의 풍경' })).toBeVisible();
    return;
  }
  const content: Record<string, { label: string; links?: string[] }> = {
    left: { label: '자료 책장', links: ['과목', '강의 자료', '자료 카드', '개념 전집'] },
    right: { label: '탐구 작업대', links: ['코딩 연습', '수식 탐색'] },
    back: { label: '기록·계획 벽', links: ['통계', '일정·과제', 'Canvas', '그래프뷰', '칸반보드'] },
    ceiling: { label: '천장 조명' },
  };
  const { label, links } = content[place];
  await expect(scenes).toHaveCount(1);
  const scene = page.getByRole('region', { name: `${label} 풍경`, exact: true });
  await expect(scene).toHaveAttribute('data-place-scene', place);
  await expect(scene.locator('svg')).toBeVisible();
  await expect(scene.locator('svg')).toHaveAttribute('aria-hidden', 'true');
  const shortcuts = scene.getByRole('navigation', { name: `${label}에서 바로 열기` });
  if (links) await expect(shortcuts.getByRole('link')).toHaveText(links);
  else
    await expect(shortcuts.getByRole('link', { name: '찾기', exact: true })).toHaveAttribute(
      'href',
      '#/search',
    );
  await expect(page.getByRole('region', { name: '공부 사이의 풍경' })).toHaveCount(0);
}

test('four places and the ceiling keep direct routes, browser back and the actual caller', async ({
  page,
}) => {
  await page.goto('?space=demo#/subjects');
  const shell = page.locator('.app-shell');
  const places = page.getByRole('navigation', { name: '천문대 자리', exact: true });
  await expect(shell).toHaveAttribute('data-observatory-place', 'left');
  await expect(page.getByRole('link', { name: /돌아가기 ·/ })).toHaveCount(0);
  await expectPlaceScene(page, 'left');
  const shelfTools = page.getByRole('navigation', { name: '자료 책장에서 바로 열기', exact: true });
  await shelfTools.getByRole('link', { name: '강의 자료', exact: true }).click();
  await expect(page).toHaveURL(/#\/materials$/);
  await expect(shell).toHaveAttribute('data-observatory-place', 'left');
  await expectPlaceScene(page, 'left');
  await shelfTools.getByRole('link', { name: '과목', exact: true }).click();
  await expect(page).toHaveURL(/#\/subjects$/);
  for (const [label, place, path] of [
    ['뒤쪽 기록·계획 벽', 'back', '/statistics'],
    ['오른쪽 탐구 작업대', 'right', '/math'],
    ['정면 공부 책상', 'front', '/'],
    ['왼쪽 자료 책장', 'left', '/subjects'],
  ]) {
    await places.getByRole('link', { name: label, exact: true }).click();
    await expect(shell).toHaveAttribute('data-observatory-place', place);
    await expect.poll(() => new URL(page.url()).hash).toBe(`#${path}`);
    await expectPlaceScene(page, place);
  }
  await page.goBack();
  await expect(shell).toHaveAttribute('data-observatory-place', 'front');
  await places.getByRole('link', { name: '뒤쪽 기록·계획 벽', exact: true }).click();
  await page.getByRole('link', { name: '어디서나 찾기', exact: true }).click();
  await expect(shell).toHaveAttribute('data-observatory-place', 'back');
  await expectPlaceScene(page, 'ceiling');
  await expect(places.locator('[aria-current="location"]')).toHaveText('위쪽 천장 조명');
  await page.getByRole('searchbox', { name: '과목·목차·기록 검색', exact: true }).fill('함수');
  await page.reload();
  await expect(shell).toHaveAttribute('data-observatory-place', 'back');
  await expectPlaceScene(page, 'ceiling');
  await expect(
    page.getByRole('searchbox', { name: '과목·목차·기록 검색', exact: true }),
  ).toHaveValue('함수');
  await expect(page.getByRole('link', { name: '돌아가기 · 통계', exact: true })).toHaveAttribute(
    'href',
    '#/statistics',
  );
  await page.getByRole('link', { name: '원래 자리로', exact: true }).click();
  await expect(page).toHaveURL(/#\/statistics$/);
  await expectPlaceScene(page, 'back');
  await page.getByRole('link', { name: '기록', exact: true }).first().click();
  await page.getByRole('checkbox', { name: '함수는 어떤 관계일까?', exact: true }).check();
  await page
    .getByRole('textbox', { name: '메모', exact: true })
    .fill('통계에서 시작한 합성 공부 기록');
  await page.getByRole('button', { name: '1개 주제 기록 저장', exact: true }).click();
  await expect(page).toHaveURL(/#\/statistics$/);
  await expectPlaceScene(page, 'back');
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
});

test('room scenery visibility survives reload and place changes without altering study data or reduced motion', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('?space=demo#/subjects');
  const scene = page.locator('[data-place-scene]');
  const places = page.getByRole('navigation', { name: '천문대 자리', exact: true });
  await expectPlaceScene(page, 'left');
  const original = await page.evaluate(() => localStorage.getItem('study-space:demo:v1'));
  expect(original).not.toBeNull();
  await scene.getByRole('button', { name: '풍경 접기', exact: true }).click();
  await expect(scene.getByRole('button', { name: '풍경 펼치기', exact: true })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  await expect(scene.locator('svg')).toBeHidden();
  await page.reload();
  await expect(scene).toHaveAttribute('data-place-scene', 'left');
  await expect(scene.getByRole('button', { name: '풍경 펼치기', exact: true })).toBeVisible();
  await expect(scene.locator('svg')).toBeHidden();
  await places.getByRole('link', { name: '오른쪽 탐구 작업대', exact: true }).click();
  await expect(scene).toHaveAttribute('data-place-scene', 'right');
  await expect(scene.locator('svg')).toBeHidden();
  await scene.getByRole('button', { name: '풍경 펼치기', exact: true }).click();
  await expectPlaceScene(page, 'right');
  await places.getByRole('link', { name: '뒤쪽 기록·계획 벽', exact: true }).click();
  await expectPlaceScene(page, 'back');
  const frame = scene.locator('svg').locator('..');
  await expect(frame).toHaveCSS('transform', 'none');
  await expect(frame).toHaveCSS('opacity', '1');
  expect(
    await scene.evaluate(
      (node) =>
        node
          .getAnimations({ subtree: true })
          .filter((animation) => animation.playState === 'running').length,
    ),
  ).toBe(0);
  await page.reload();
  await expectPlaceScene(page, 'back');
  await expect(scene.getByRole('button', { name: '풍경 접기', exact: true })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(original);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
  await page.screenshot({ path: info.outputPath('observatory-wall-reduced-motion.png') });
});

test('a selected source keeps its exact content through a desk note, tool, record and caller return', async ({
  page,
}, info) => {
  const original = `  출처와 예외를 그대로 보존\n${'읽던 한국어 자료. '.repeat(40)}\n끝 공백  `;
  const memo = '  원자료 곁의 메모\n아직 불확실한 조건  ';
  const record = '  실제 시도만 기록\n완료와 숙달은 미확인  ';
  await page.goto('?space=demo#/materials');
  await page.getByRole('button', { name: '자료 추가', exact: true }).click();
  await page.getByRole('textbox', { name: '자료 제목', exact: true }).fill('공간 연결 검증 자료');
  await page.getByRole('textbox', { name: '강의 내용·필기', exact: true }).fill(original);
  await page.getByRole('button', { name: '자료 저장', exact: true }).click();
  await expect(page).toHaveURL(/#\/materials\/(?!new)[^/]+$/);
  const sourceURL = page.url();
  await page.getByRole('link', { name: '자료 목록', exact: true }).click();
  await page.getByRole('textbox', { name: '강의 자료 찾기', exact: true }).fill('공간 연결');
  await page.getByRole('link', { name: '공간 연결 검증 자료', exact: true }).click();
  await expect(page.locator('.app-shell')).toHaveAttribute('data-observatory-place', 'front');
  await page.getByRole('button', { name: '곁 도구 펼치기', exact: true }).click();
  await page.getByLabel('작업면 표시', { exact: true }).selectOption('tool');
  const notes = page.locator('.study-workspace-tools');
  const addMemo = notes.getByRole('button', { name: '메모 추가', exact: true });
  await addMemo.click();
  const modal = page.getByRole('dialog');
  await modal.getByText('글·연결·입력 설정', { exact: true }).click();
  await modal.getByRole('textbox', { name: '짧은 글', exact: true }).fill(memo);
  await modal.getByRole('button', { name: '닫기', exact: true }).click();
  await expect(modal).toHaveCount(0);
  await expect(addMemo).toBeFocused();
  await page.getByLabel('작업면 표시', { exact: true }).selectOption('source');
  await expect(page).toHaveURL(sourceURL);
  await expect(page.getByRole('textbox', { name: '강의 내용·필기', exact: true })).toHaveValue(
    original,
  );
  await page.getByRole('link', { name: '수식 도구 펼치기', exact: true }).click();
  await expect(page.locator('.app-shell')).toHaveAttribute('data-observatory-place', 'right');
  await expect(
    page.getByRole('link', { name: '돌아가기 · 공간 연결 검증 자료', exact: true }),
  ).toBeVisible();
  await page.getByRole('link', { name: '이어서 기록하기', exact: true }).click();
  await page.getByRole('checkbox', { name: '함수는 어떤 관계일까?', exact: true }).check();
  await page.getByRole('textbox', { name: '메모', exact: true }).fill(record);
  await page.getByRole('button', { name: '1개 주제 기록 저장', exact: true }).click();
  await expect(page).toHaveURL(sourceURL);
  await expect(page.getByRole('textbox', { name: '강의 내용·필기', exact: true })).toHaveValue(
    original,
  );
  await page.reload();
  await page.getByRole('link', { name: '돌아가기 · 강의 자료', exact: true }).click();
  await expect(page.getByRole('textbox', { name: '강의 자료 찾기', exact: true })).toHaveValue(
    '공간 연결',
  );
  const stored = await page.evaluate(() => localStorage.getItem('study-space:demo:v1'));
  if (stored === null) throw new Error('The saved source, note and record are missing.');
  const saved = JSON.parse(decodeStoredText(stored)).data;
  expect(saved.studyMaterials).toHaveLength(1);
  expect(saved.studyMaterials[0].sourceText).toBe(original);
  expect(saved.memos).toHaveLength(1);
  expect(saved.memos[0].body).toBe(memo);
  expect(saved.records).toHaveLength(1);
  expect(saved.records[0].body).toBe(record);
  await page.getByRole('link', { name: '어디서나 찾기', exact: true }).click();
  await page
    .getByRole('searchbox', { name: '과목·목차·기록 검색', exact: true })
    .fill('원자료 곁의 메모');
  await page.locator(`a[href="#/memos/${saved.memos[0].id}"]`).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: '닫기', exact: true }).click();
  await expect(page).toHaveURL(/#\/search$/);
  await expect(
    page.getByRole('searchbox', { name: '과목·목차·기록 검색', exact: true }),
  ).toHaveValue('원자료 곁의 메모');
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
  await page.screenshot({ path: info.outputPath('observatory-source-return.png'), fullPage: true });
});
