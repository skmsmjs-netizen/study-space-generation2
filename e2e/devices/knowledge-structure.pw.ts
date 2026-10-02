import { createHash } from 'node:crypto';
import { expect, test } from '@playwright/test';

test('paper body alignment also reaches a portal memo while preserving writing and reopening', async ({
  page,
}) => {
  const body = '  조건과 예외를 원문 그대로 기록합니다.\nKorean and English: 명시적인 줄바꿈도 보존합니다. < & >  ';
  await page.goto('?space=demo#/memos');
  await page.getByRole('button', { name: '메모 추가', exact: true }).click();
  await page.locator('.memo-details > summary').click();
  const input = page.getByLabel('짧은 글', { exact: true });
  await input.fill(body);
  await expect(input).toHaveCSS('font-weight', '700');
  await expect(input).toHaveCSS('font-size', '16px');
  await expect(input).toHaveCSS('transform', 'none');
  expect(await input.evaluate(el => getComputedStyle(el).fontFamily)).toContain('ManSeekSong Paper');
  expect(await page.evaluate(async () => (await document.fonts.load('700 16px "ManSeekSong Paper"', '한글 English')).length)).toBe(1);
  await input.press('Home');
  await input.press('End');
  expect(await input.evaluate(el => (el as HTMLTextAreaElement).selectionStart)).toBeGreaterThan(0);
  await expect(input).toHaveCSS('text-align', 'justify');
  await expect(input).toHaveCSS('text-align-last', 'start');
  await page.getByRole('button', { name: '지금 저장', exact: true }).click();
  await page.getByRole('button', { name: '닫기', exact: true }).last().click();
  await expect(page.locator('.memo-preview-text').first()).toHaveCSS('font-size', '14px');
  await page.reload();
  await page
    .locator('.memo-paper-preview')
    .filter({ hasText: '조건과 예외를 원문 그대로 기록합니다.' })
    .click();
  await expect(input).toHaveValue(body);
  await expect(input).toHaveCSS('text-align', 'justify');
  await page.addStyleTag({content: ':root { --font-reading: sans-serif; --paper-input-size: 20px; --paper-body-weight: 400; }'});
  await expect(input).toHaveCSS('font-family', 'sans-serif');
  await expect(input).toHaveCSS('font-size', '20px');
  await expect(input).toHaveCSS('font-weight', '400');
  await expect(input).toHaveValue(body);
});

const nodes = Array.from({ length: 20 }, (_, i) => ({
  id: `module-${i}`,
  label: `관찰 ${i + 1} · 같은 조건에서 $x$를 비교하는 지식 묶음`,
  detail: `조건과 예외 ${i + 1}. 내 설명 < & >\n${'긴 한국어 원문은 의미를 생략하거나 줄임표로 바꾸지 않고 그대로 읽습니다. '.repeat(i === 0 ? 10 : 2)}`,
}));
const scenes = [
  {
    id: 'compare',
    action: '대응 보기',
    title: '조건에 맞춰 비교하기',
    body: '같은 조건인지 확인하고 대응을 읽습니다.',
    caption: '',
    takeaway: '',
    visual: {
      kind: 'compare',
      label: '원문과 대응 구조',
      nodes: nodes.slice(0, 2),
      relations: [
        {
          from: nodes[0].id,
          to: nodes[1].id,
          label: '같은 조건일 때 대응한다 · 인과를 뜻하지 않는다',
        },
      ],
      highlighted: [nodes[0].id],
    },
  },
  {
    id: 'sequence',
    action: '작성 순서 보기',
    title: '전체 묶음의 순서',
    body: '작성된 순서를 따라 읽고 조건을 확인합니다.',
    caption: '',
    takeaway: '',
    visual: { kind: 'sequence', label: '작성된 관찰 순서', nodes, relations: [], highlighted: [] },
  },
];
const raw = JSON.stringify({
  items: [
    {
      id: 'knowledge-fixture',
      name: '합성 지식 구조',
      def: '격리된 원문 · 조건 · 예외',
      ex: '합성 예시',
      insight: '미확인',
      type: '기타',
      cat: 1,
    },
  ],
});
const sha256 = createHash('sha256').update(raw).digest('hex');
const catalogId = `concept-catalog:${sha256}`,
  jobId = 'concept-batch:knowledge-structure';
const work = JSON.stringify({
  format: 'concept-work-v1',
  original: { raw, sha256, filename: '격리 지식 구조.json' },
  batches: [
    {
      id: jobId,
      content: {
        catalogId,
        sourceIds: ['knowledge-fixture'],
        baseVersions: { 'knowledge-fixture': 0 },
        status: 'open',
      },
    },
  ],
  results: [
    {
      format: 'concept-results-v1',
      jobId,
      sourceSha256: sha256,
      items: [
        {
          sourceId: 'knowledge-fixture',
          expectedVersion: 0,
          content: {
            catalogId,
            sourceId: 'knowledge-fixture',
            displayType: '구조형',
            secondaryTypes: [],
            reason: '합성 구조 검사',
            screen: {
              type: '구조형',
              title: '구조를 읽고 조건으로 돌아오기',
              intro: '관계와 실제 작성 순서를 구별합니다.',
              navigation: 'choose',
              mode: 'generic',
              scenes,
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
            jobId,
          },
        },
      ],
    },
  ],
});

test('closed modules and labelled relationships reflow, preserve full text, scene and presentation after reload', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('?space=demo#/concepts');
  await page.getByRole('button', { name: '설명 만들기', exact: true }).click();
  if (await page.getByRole('button', { name: '다른 원문 가져오기', exact: true }).isVisible())
    await page.getByRole('button', { name: '다른 원문 가져오기', exact: true }).click();
  await page.getByLabel('개념 원문 가져오기', { exact: true }).setInputFiles({
    name: '격리 지식 구조.json',
    mimeType: 'application/json',
    buffer: Buffer.from(work),
  });
  await expect(
    page.getByText('전체 1개 · 설명 1개 · 읽기용 0개 · 보류 0개', { exact: true }),
  ).toBeVisible();
  await page.locator('.concept-list button').first().click();
  const current = page.locator('.concept-stage.is-current');
  const figure = current.locator('.knowledge-structure');
  await expect(figure).toHaveAttribute('data-knowledge-presentation', 'diagram');
  await expect(figure.locator('.knowledge-module')).toHaveCount(2);
  expect(await figure.locator('dd').first().textContent()).toBe(nodes[0].detail);
  await expect(figure.locator('dd').first()).toHaveCSS('text-align', 'justify');
  await expect(figure.locator('dd').first()).toHaveCSS('text-align-last', 'start');
  // Alignment belongs to authored paragraphs; the wrapper also contains
  // technical and inline roles and deliberately retains interface defaults.
  await expect(current.locator('.concept-body > p').first()).toHaveCSS('text-align', 'justify');
  await expect(figure.getByRole('list', { name: '작성된 관계' })).toContainText(
    '인과를 뜻하지 않는다',
  );
  await expect(figure.locator('ol')).toHaveCount(0);
  await expect(figure.locator('.katex-error')).toHaveCount(0);
  await figure.screenshot({ path: info.outputPath('knowledge-compare.png') });
  await expect(figure.locator('.knowledge-module').first()).toHaveCSS(
    'border-top-left-radius',
    '0px',
  );
  await figure.getByRole('button', { name: '문장으로 읽기', exact: true }).click();
  await expect(figure).toHaveAttribute('data-knowledge-presentation', 'prose');
  await page.reload();
  await expect(figure).toHaveAttribute('data-knowledge-presentation', 'prose');
  expect(await figure.locator('dd').first().textContent()).toBe(nodes[0].detail);
  await page.getByRole('button', { name: '작성 순서 보기', exact: true }).click();
  await expect(figure).toHaveAttribute('data-knowledge-presentation', 'diagram');
  await expect(figure.locator('ol > li')).toHaveCount(20);
  expect(await figure.locator('ol > li').last().locator('dd').textContent()).toBe(nodes[19].detail);
  await expect(figure.getByRole('list', { name: '작성된 관계' })).toHaveCount(0);
  await page.reload();
  await expect(current.locator('h3')).toHaveText('전체 묶음의 순서');
  await expect(figure.locator('ol > li')).toHaveCount(20);
  await page.getByRole('button', { name: '대응 보기', exact: true }).click();
  await expect(figure).toHaveAttribute('data-knowledge-presentation', 'prose');
  await figure.getByRole('button', { name: '구조로 보기', exact: true }).click();
  await figure.screenshot({ path: info.outputPath('knowledge-final.png') });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
  const overflow = await figure
    .locator('.knowledge-module, .knowledge-endpoint, .knowledge-link')
    .evaluateAll((elements) =>
      elements
        .filter((element) => element.scrollWidth > element.clientWidth + 1)
        .map((element) => element.className),
    );
  expect(overflow).toEqual([]);
  expect(errors).toEqual([]);
});

test('Canvas explains relationship kinds and keeps saved line style, user widths and positions after reload', async ({
  page,
}, info) => {
  await page.goto('?space=demo#/canvas');
  const stage = page.locator('.canvas-stage');
  await expect(stage.locator('.react-flow__node').first()).toBeVisible();
  await page.locator('.study-canvas > .knowledge-legend > summary').click();
  await expect(page.locator('.study-canvas > .knowledge-legend')).toContainText('상하위 소속');
  await stage.getByRole('button', { name: /^Canvas 보기 도구/ }).click();
  await expect(stage.getByLabel('연결선 모양', { exact: true })).toHaveValue('step');
  await stage.getByLabel('연결선 모양', { exact: true }).selectOption('bezier');
  await stage.getByRole('button', { name: /^Canvas 보기 도구/ }).click();
  await page.getByLabel('조작할 카드', { exact: true }).selectOption('node:demo-topic-function');
  await page.getByLabel('선택한 카드 너비', { exact: true }).fill('420');
  const ledger = await page.evaluate(() => localStorage.getItem('study-space:demo:v1'));
  await page.reload();
  await stage.getByRole('button', { name: /^Canvas 보기 도구/ }).click();
  await expect(stage.getByLabel('연결선 모양', { exact: true })).toHaveValue('bezier');
  await page.getByLabel('조작할 카드', { exact: true }).selectOption('node:demo-topic-function');
  await expect(page.getByLabel('선택한 카드 너비', { exact: true })).toHaveValue('420');
  expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(ledger);
  await stage.getByRole('button', { name: /^Canvas 보기 도구/ }).click();
  await expect(stage.locator('.canvas-card').first()).toHaveCSS('border-top-left-radius', '0px');
  await stage.screenshot({ path: info.outputPath('knowledge-canvas.png') });
});
