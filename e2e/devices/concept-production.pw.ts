import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { test, expect } from '@playwright/test';
function syntheticWork() {
  const screens = JSON.parse(readFileSync('e2e/fixtures/concept-screens.json', 'utf8'));
  const originals = Array.from({ length: 1168 }, (_, i) => ({
    id: screens[i]?.id ?? `fixture-${i}`,
    name: screens[i]?.name ?? `합성 개념 ${i}`,
    def: '격리된 합성 원문 · 조건',
    ex: '합성 예시',
    insight: '미확인',
    type: '기타',
    cat: 1,
    annotations: ['원문 보존 확인'],
  }));
  const raw = JSON.stringify({ items: originals }),
    sha256 = createHash('sha256').update(raw).digest('hex'),
    catalogId = `concept-catalog:${sha256}`;
  const batches = Array.from({ length: Math.ceil(originals.length / 30) }, (_, i) => {
    const ids = originals.slice(i * 30, i * 30 + 30).map((item) => item.id);
    return {
      id: `concept-batch:fixture-${i}`,
      content: {
        catalogId,
        sourceIds: ids,
        baseVersions: Object.fromEntries(ids.map((id) => [id, 0])),
        status: 'open',
      },
    };
  });
  const result = {
    format: 'concept-results-v1',
    jobId: batches[0].id,
    sourceSha256: sha256,
    items: screens.map((screen: any) => ({
      sourceId: screen.id,
      expectedVersion: 0,
      content: {
        catalogId,
        sourceId: screen.id,
        displayType: screen.type,
        secondaryTypes: [],
        reason: screen.reason,
        screen: {
          type: screen.type,
          title: screen.title,
          intro: screen.intro,
          mode: screen.mode,
          navigation: screen.navigation,
          scenes: screen.scenes,
        },
        evidence: [],
        checks: {
          classification: false,
          meaning: false,
          conditions: false,
          example: false,
          wording: false,
          screen: false,
        },
        status: 'draft',
        issue: '',
        promptVersion: 'concept-editor-20261001-v1',
        jobId: batches[0].id,
      },
    })),
  };
  return JSON.stringify({
    format: 'concept-work-v1',
    original: { raw, sha256, filename: '합성 개념 원문.json' },
    batches,
    results: [result],
  });
}
const work = process.env.CONCEPT_WORK_FILE
  ? readFileSync(process.env.CONCEPT_WORK_FILE, 'utf8')
  : syntheticWork();
const workData = JSON.parse(work);
const authored: any[] = [
  ...new Map<string, any>(
    workData.results
      .flatMap((result: any) => result.items)
      .filter((item: any) => item.content.screen)
      .map((item: any) => [item.sourceId, item] as const),
  ).values(),
];
test('1168 concepts import, review, stable reader and exact draft restoration', async ({
  page,
}, info) => {
  test.setTimeout(300000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('?space=demo#/concepts');
  await page.getByRole('button', { name: '설명 만들기', exact: true }).click();
  if (await page.getByRole('button', { name: '다른 원문 가져오기', exact: true }).isVisible())
    await page.getByRole('button', { name: '다른 원문 가져오기', exact: true }).click();
  await page.getByLabel('개념 원문 가져오기', { exact: true }).setInputFiles({
    name: '개념 제작.json',
    mimeType: 'application/json',
    buffer: Buffer.from(work),
  });
  await expect(
    page.getByText(`전체 1,168개 · 설명 ${authored.length}개 · 읽기용 0개 · 보류 0개`, {
      exact: true,
    }),
  ).toBeVisible({
    timeout: 90000,
  });
  for (const item of authored) {
    await page.getByLabel('개념 찾기', { exact: true }).fill(item.sourceId);
    await page.locator('.concept-list button').first().click();
    const reader = page.locator('.concept-reader');
    const original = JSON.parse(workData.original.raw).items.find(
      (source: { id: string }) => source.id === item.sourceId,
    );
    await expect(reader.locator('h2')).toHaveText(original.name);
    await expect(reader.locator('.concept-lead')).toHaveText(item.content.screen.title);
    const heights: number[] = [];
    const measure = async () => {
      heights.push((await reader.locator('.concept-stages').boundingBox())!.height);
      await expect(reader.locator('.concept-stage.is-current')).toHaveCount(1);
    };
    await measure();
    if (item.content.screen.navigation === 'static') {
      await expect(reader.locator('.concept-options, nav')).toHaveCount(0);
      await expect(reader.getByRole('button', { name: '처음부터 보기', exact: true })).toHaveCount(
        0,
      );
    }
    if (item.content.screen.navigation === 'choose') {
      for (const button of await reader.locator('.concept-options button').all()) {
        await button.click();
        await measure();
      }
    } else {
      for (let i = 1; i < item.content.screen.scenes.length; i++) {
        await reader.getByRole('button', { name: '다음', exact: true }).click();
        await measure();
      }
    }
    expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    await reader.screenshot({ path: info.outputPath(`${item.sourceId}-reader.png`) });
    await page.getByRole('button', { name: '목록으로 돌아가기', exact: true }).click();
  }
  await page.getByLabel('개념 찾기', { exact: true }).fill('기회비용');
  await page.getByRole('button', { name: /기회비용.*정의형/ }).click();
  await expect(page.locator('.concept-reader').getByRole('heading', { name: '기회비용', exact: true })).toBeVisible();
  const stage = page.locator('.concept-stages');
  const heights: number[] = [];
  for (const option of await page.locator('.concept-options button').all()) {
    await option.click();
    heights.push((await stage.boundingBox())!.height);
    await expect(page.locator('.concept-stage.is-current')).toHaveCount(1);
  }
  expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(1);
  const readerBeforeReload = await page.locator('.concept-stage.is-current h3').innerText();
  await page.reload();
  await expect(page.locator('.concept-stage.is-current h3')).toHaveText(readerBeforeReload);
  await page
    .locator('.concept-reader')
    .getByRole('button', { name: '처음부터 보기', exact: true })
    .click();
  await expect(page.locator('.concept-stage.is-current h3')).toHaveText(
    authored.find((item) => item.sourceId === '05-001').content.screen.scenes[0].title,
  );
  for (const checkbox of await page
    .locator('.concept-editor fieldset:not(.concept-content-role) input')
    .all())
    await checkbox.check();
  await page.getByRole('button', { name: '읽기용으로 등록', exact: true }).click();
  await expect(page.getByText('읽기용으로 등록했습니다.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '읽기', exact: true }).click();
  await expect(page.locator('.concept-reader')).toBeVisible();
  await expect(page.locator('.concept-editor')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('.concept-reader')).toBeVisible();
  await expect(page.getByText('원문·분류 근거·수정 이력', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: '설명 만들기', exact: true }).click();
  if (await page.getByRole('button', { name: '다른 원문 가져오기', exact: true }).isVisible())
    await page.getByRole('button', { name: '다른 원문 가져오기', exact: true }).click();
  const title = page.getByLabel('설명 제목', { exact: true });
  await title.fill('');
  await expect(title).toBeVisible();
  await expect(title).toHaveValue('');
  await title.fill('한글 설명 수정\n조건을 지키는 제목');
  const enteredTitle = await title.inputValue();
  await page.reload();
  await expect(title).toHaveValue(enteredTitle);
  expect(
    await page.locator('.concept-editor fieldset:not(.concept-content-role) input:checked').count(),
  ).toBe(0);
  await page.getByRole('button', { name: '설명 저장', exact: true }).click();
  await expect(page.getByText(/설명을 저장했습니다/)).toBeVisible();
  const firstCheck = page
    .locator('.concept-editor fieldset:not(.concept-content-role) input')
    .first();
  await firstCheck.check();
  await page.reload();
  await expect(firstCheck).toBeChecked();
  await page.getByRole('button', { name: '검토 내용 저장', exact: true }).click();
  await expect(page.getByText(/설명을 저장했습니다/)).toBeVisible();
  await page.reload();
  await expect(firstCheck).toBeChecked();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  await page.screenshot({ path: info.outputPath('concept-production.png'), fullPage: true });
  expect(errors).toEqual([]);
});

test('malformed concept data retains exact input without replacing saved content', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const template = JSON.parse(syntheticWork());
  const original = JSON.parse(template.original.raw).items[0];
  const raw = JSON.stringify({ items: [original] });
  const sha256 = createHash('sha256').update(raw).digest('hex');
  const catalogId = `concept-catalog:${sha256}`,
    jobId = 'concept-batch:editing-validation';
  const content = { ...template.results[0].items[0].content, catalogId, jobId };
  const file = {
    format: 'concept-work-v1',
    original: { raw, sha256, filename: '격리 원문.json' },
    batches: [
      {
        id: jobId,
        content: {
          catalogId,
          sourceIds: [original.id],
          baseVersions: { [original.id]: 0 },
          status: 'open',
        },
      },
    ],
    results: [
      {
        format: 'concept-results-v1',
        jobId,
        sourceSha256: sha256,
        items: [{ sourceId: original.id, expectedVersion: 0, content }],
      },
    ],
  };
  await page.goto('?space=demo#/concepts');
  await page.getByRole('button', { name: '설명 만들기', exact: true }).click();
  if (await page.getByRole('button', { name: '다른 원문 가져오기', exact: true }).isVisible())
    await page.getByRole('button', { name: '다른 원문 가져오기', exact: true }).click();
  await page.getByLabel('개념 원문 가져오기', { exact: true }).setInputFiles({
    name: '격리 제작.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(file)),
  });
  await expect(page.getByText(/전체 1개 · 설명 1개/)).toBeVisible();
  await page.locator('.concept-list button').first().click();
  const title = page.getByLabel('설명 제목', { exact: true });
  await title.fill('');
  await expect(title).toBeVisible();
  await title.fill(content.screen.title);
  await page.getByText('제작 데이터 직접 편집', { exact: true }).click();
  const bad = JSON.stringify(
    {
      ...content,
      screen: {
        ...content.screen,
        scenes: content.screen.scenes.map((scene: any, index: number) =>
          index === 0 ? { ...scene, math: { invalid: true } } : scene,
        ),
      },
    },
    null,
    2,
  );
  const input = page.getByLabel('설명 제작 데이터', { exact: true });
  await input.fill(bad);
  await expect(page.locator('.concept-reader')).toHaveCount(0);
  await page.reload();
  await expect(input).toHaveValue(bad);
  await page.getByRole('button', { name: '설명 저장', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText(/대상 원문과 설명 형식/);
  await expect(input).toHaveValue(bad);
  await input.fill(JSON.stringify(content, null, 2));
  await expect(title).toHaveValue(content.screen.title);
  expect(errors).toEqual([]);
});

test('changing an authored type keeps text and requires explicit role links', async ({ page }) => {
  const whole = JSON.parse(work);
  const chosen = authored.find((item) => item.sourceId === '05-001') ?? authored[0];
  const originalSource = JSON.parse(whole.original.raw).items.find(
    (item: any) => item.id === chosen.sourceId,
  );
  const raw = JSON.stringify({ items: [originalSource] });
  const sha256 = createHash('sha256').update(raw).digest('hex');
  const catalogId = `concept-catalog:${sha256}`,
    jobId = 'concept-batch:type-editing';
  const content = structuredClone(chosen.content);
  content.catalogId = catalogId;
  content.jobId = jobId;
  if (!content.screen.design) {
    const registry = JSON.parse(readFileSync('docs/concept-interaction-templates.json', 'utf8'));
    const template = registry.templates.find((item: any) => item.type === content.screen.type);
    content.screen.scenes.forEach((scene: any, index: number) => {
      scene.id = `${chosen.sourceId}:scene-${index + 1}`;
      scene.purpose = scene.title;
    });
    content.screen.design = {
      templateVersion: registry.version,
      templateId: template.id,
      sourceId: chosen.sourceId,
      sourceSha256: sha256,
      interaction:
        content.screen.navigation === 'steps'
          ? 'step'
          : content.screen.navigation === 'static'
            ? 'static'
            : 'select',
      question: '합성 편집 사례의 내용을 유지할 수 있나요?',
      selectionReason: '유형을 바꾸는 실제 편집 경로를 격리 자료에서 확인합니다.',
      roles: template.requiredSlots.map((key: string) => ({
        key,
        sceneIds: [content.screen.scenes[0].id],
      })),
    };
  }
  content.screen.design.sourceSha256 = sha256;
  const file = {
    format: 'concept-work-v1',
    original: { raw, sha256, filename: '유형 변경 확인.json' },
    batches: [
      {
        id: jobId,
        content: {
          catalogId,
          sourceIds: [chosen.sourceId],
          baseVersions: { [chosen.sourceId]: 0 },
          status: 'open',
        },
      },
    ],
    results: [
      {
        format: 'concept-results-v1',
        jobId,
        sourceSha256: sha256,
        items: [{ sourceId: chosen.sourceId, expectedVersion: 0, content }],
      },
    ],
  };
  await page.goto('?space=demo#/concepts');
  await page.getByRole('button', { name: '설명 만들기', exact: true }).click();
  if (await page.getByRole('button', { name: '다른 원문 가져오기', exact: true }).isVisible())
    await page.getByRole('button', { name: '다른 원문 가져오기', exact: true }).click();
  await page.getByLabel('개념 원문 가져오기', { exact: true }).setInputFiles({
    name: '유형.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(file)),
  });
  await expect(page.getByText(/전체 1개 · 설명 1개/)).toBeVisible();
  await page.locator('.concept-list button').first().click();
  await page.getByLabel('화면 유형', { exact: true }).selectOption('구별형');
  await expect(page.getByLabel('설명 제목', { exact: true })).toHaveValue(content.screen.title);
  await page.getByRole('button', { name: '설명 저장', exact: true }).click();
  await expect(
    page.getByText('유형 틀의 질문·내용 역할·장면 대응·적용 이유를 확인해 주세요.', {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByText('유형에 필요한 내용 연결', { exact: true }).click();
  for (const field of await page.locator('.concept-content-role').all())
    await field.locator('input').first().check();
  await page.getByRole('button', { name: '설명 저장', exact: true }).click();
  await expect(page.getByText(/설명을 저장했습니다/)).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('설명 제목', { exact: true })).toHaveValue(content.screen.title);
  await expect(page.getByLabel('화면 유형', { exact: true })).toHaveValue('구별형');
  await expect(
    page.locator('.concept-editor fieldset:not(.concept-content-role) input:checked'),
  ).toHaveCount(0);
});

test('versioned portable work resumes and repeats without duplicating history', async ({
  page,
}) => {
  const all = JSON.parse(work);
  const chosen = authored.find((item) => item.sourceId === '05-001') ?? authored[0];
  const original = JSON.parse(all.original.raw).items.find(
    (item: any) => item.id === chosen.sourceId,
  );
  const raw = JSON.stringify({ items: [original] });
  const sha256 = createHash('sha256').update(raw).digest('hex'),
    catalogId = `concept-catalog:${sha256}`;
  let results: any[] = all.results.flatMap((result: any) =>
    result.items
      .filter((item: any) => item.sourceId === chosen.sourceId)
      .map((item: any) => ({ ...result, items: [structuredClone(item)] })),
  );
  if (results.length === 1) {
    const next = structuredClone(results[0]);
    next.jobId = 'concept-batch:resumed-edit';
    next.items[0].expectedVersion = 1;
    next.items[0].content.jobId = next.jobId;
    next.items[0].content.screen.title += ' · 다음 설명';
    results.push(next);
  }
  for (const result of results) {
    result.sourceSha256 = sha256;
    for (const item of result.items) {
      item.content.catalogId = catalogId;
      if (item.content.screen?.design) item.content.screen.design.sourceSha256 = sha256;
    }
  }
  const batches = results.map((result) => ({
    id: result.jobId,
    content: {
      catalogId,
      sourceIds: [chosen.sourceId],
      baseVersions: { [chosen.sourceId]: result.items[0].expectedVersion },
      status: 'closed',
    },
  }));
  const whole = {
    format: 'concept-work-v1',
    original: { raw, sha256, filename: '이어 가져오기.json' },
    batches,
    results,
  };
  const upload = async (value: unknown) => {
    await page.getByLabel('개념 원문 가져오기', { exact: true }).setInputFiles({
      name: '이어 가져오기.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(value)),
    });
    await expect(page.getByText(/전체 1개 · 설명 1개/)).toBeVisible();
    await expect(page.getByLabel('개념 원문 가져오기', { exact: true })).toBeEnabled();
  };
  await page.goto('?space=demo#/concepts');
  await page.getByRole('button', { name: '설명 만들기', exact: true }).click();
  if (await page.getByRole('button', { name: '다른 원문 가져오기', exact: true }).isVisible())
    await page.getByRole('button', { name: '다른 원문 가져오기', exact: true }).click();
  await upload({ ...whole, results: results.slice(0, -1) });
  await upload(whole);
  await page.locator('.concept-list button').first().click();
  await expect(page.getByLabel('설명 제목', { exact: true })).toHaveValue(
    results.at(-1).items[0].content.screen.title,
  );
  const revisions = page.locator('.concept-editor > details').first().locator('ol > li');
  const before = await revisions.count();
  await upload(whole);
  await page.reload();
  await expect(page.getByLabel('설명 제목', { exact: true })).toHaveValue(
    results.at(-1).items[0].content.screen.title,
  );
  await expect(revisions).toHaveCount(before);
});
