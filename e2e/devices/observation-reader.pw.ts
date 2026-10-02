import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { expect, test, type Locator } from '@playwright/test';
import type { ConceptScreen } from '../../src/domain/concept-production';

type FixtureScreen = ConceptScreen & { id: string; name: string; reason: string };
const representatives = ['09-020', '05-097', '01-063'];
const sourceScreens = JSON.parse(
  readFileSync('e2e/fixtures/concept-screens.json', 'utf8'),
) as FixtureScreen[];
const registry = JSON.parse(readFileSync('docs/concept-interaction-templates.json', 'utf8')) as {
  version: string;
  templates: { id: string; type: string; requiredSlots: string[] }[];
};
const questions: Record<string, string> = {
  '09-020': '여러 방어층의 약점은 어떻게 연결되나요?',
  '05-097': '출력이 다시 입력으로 돌아오면 무엇이 달라지나요?',
  // A question already present in the title is rendered only once.
  '01-063': '반대로 가정하면, 어디에서 모순이 생길까요?',
};
const sources = representatives.map((id) => {
  const source = sourceScreens.find((screen) => screen.id === id);
  if (!source) throw new Error(`Missing observation fixture: ${id}`);
  return source;
});
const raw = JSON.stringify({
  items: sources.map((screen) => ({
    id: screen.id,
    name: screen.name,
    def: '격리 관찰 검사의 합성 원문 · 실제 공부 기록이 아닙니다.',
    ex: '합성 예시',
    insight: '미확인',
    type: '기타',
    cat: 1,
    annotations: ['원문과 검토 상태 보존 확인'],
  })),
});
const sha256 = createHash('sha256').update(raw).digest('hex');
const catalogId = `concept-catalog:${sha256}`;
const jobId = 'concept-batch:observation-reader';
const screens = sources.map((source): FixtureScreen => {
  const template = registry.templates.find((entry) => entry.type === source.type);
  if (!template) throw new Error(`Missing concept template: ${source.type}`);
  const scenes = source.scenes.map((scene, index) => ({
    ...scene,
    id: `${source.id}:observation-${index + 1}`,
    purpose: scene.title,
    body:
      index === 1
        ? `${scene.body}\n\n${Array.from(
            { length: 16 },
            (_, paragraph) =>
              `긴 설명 보존 확인 ${paragraph + 1}. 이 문단은 좁은 화면에서도 설명을 자르지 않고 관찰과 조작으로 돌아갈 수 있는지 확인하는 합성 문장입니다.`,
          ).join('\n\n')}`
        : scene.body,
  }));
  return {
    ...source,
    scenes,
    design: {
      templateVersion: registry.version,
      templateId: template.id,
      sourceId: source.id,
      sourceSha256: sha256,
      interaction: source.navigation === 'choose' ? 'select' : 'step',
      question: questions[source.id],
      selectionReason: source.reason,
      roles: template.requiredSlots.map((key) => ({ key, sceneIds: scenes.map((s) => s.id) })),
    },
  };
});
const work = JSON.stringify({
  format: 'concept-work-v1',
  original: { raw, sha256, filename: '격리 관찰 대표 원문.json' },
  batches: [
    {
      id: jobId,
      content: {
        catalogId,
        sourceIds: representatives,
        baseVersions: Object.fromEntries(representatives.map((id) => [id, 0])),
        status: 'open',
      },
    },
  ],
  results: [
    {
      format: 'concept-results-v1',
      jobId,
      sourceSha256: sha256,
      items: screens.map((screen) => ({
        sourceId: screen.id,
        expectedVersion: 0,
        content: {
          catalogId,
          sourceId: screen.id,
          displayType: screen.type,
          secondaryTypes: [],
          reason: screen.reason,
          screen,
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
      })),
    },
  ],
});

async function expectRenderedConceptText(locator: Locator, source: string) {
  await expect(locator).toHaveAttribute('data-concept-text', source);
  await expect(locator).toBeVisible();
  await expect(locator.locator('.katex-error')).toHaveCount(0);
  // Read the displayed KaTeX branch, not its parallel MathML/TeX accessibility source.
  for (const token of await locator.locator('.concept-math-token').all()) {
    await expect(token.locator('.katex-html')).toBeVisible();
  }
  await expect
    .poll(() =>
      locator.evaluate((element) => {
        const visibleCopy = element.cloneNode(true) as HTMLElement;
        visibleCopy
          .querySelectorAll('.katex-mathml, annotation, annotation-xml')
          .forEach((node) => {
            node.remove();
          });
        visibleCopy.querySelectorAll('p, li, dd, dt').forEach(node => node.append(' '));
        return (visibleCopy.textContent ?? '')
          .replace(/\u200b/g, '')
          .replace(/\s+/g, ' ')
          .trim();
      }),
    )
    .toBe(
      source
        .replace(/\u200b/g, '')
        .replace(/\s+/g, ' ')
        .trim(),
    );
}

test('structure, process and proof keep observation controls, long text and reading state', async ({
  page,
}, info) => {
  test.setTimeout(150000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('?space=demo#/concepts');
  await page.getByRole('button', { name: '설명 만들기', exact: true }).click();
  await page.getByLabel('개념 원문 가져오기', { exact: true }).setInputFiles({
    name: '격리 관찰 대표.json',
    mimeType: 'application/json',
    buffer: Buffer.from(work),
  });
  await expect(
    page.getByText('전체 3개 · 설명 3개 · 읽기용 0개 · 보류 0개', { exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel('개념 원문 가져오기', { exact: true })).toBeEnabled();
  const ledger = await page.evaluate(() => localStorage.getItem('study-space:demo:v1'));
  expect(ledger).not.toBeNull();

  for (const screen of screens) {
    await page.getByLabel('개념 찾기', { exact: true }).fill(screen.id);
    await page.locator('.concept-list button').first().click();
    const reader = page.locator('.concept-reader');
    const controls = reader.locator('.concept-observation-controls');
    const current = reader.locator('.concept-stage.is-current');
    await expect(reader.locator('[data-observation-region="question"]')).toHaveText(
      questions[screen.id],
    );
    await expect(reader.getByText(questions[screen.id], { exact: true })).toHaveCount(1);
    await expect(controls).toHaveAttribute('data-observation-region', 'controls');
    const heights: number[] = [];
    const controlPositions: number[] = [];
    for (let index = 0; index < screen.scenes.length; index++) {
      const scene = screen.scenes[index];
      if (screen.navigation === 'choose') {
        await controls
          .getByRole('button', { name: screen.scenes[index].action, exact: true })
          .click();
      } else if (index > 0) {
        await controls.getByRole('button', { name: '다음', exact: true }).click();
      }
      await expect(current).toHaveCount(1);
      await expect(current.locator('h3')).toHaveText(screen.scenes[index].title);
      await expect(current.locator('[data-observation-region="visual"]')).toBeVisible();
      await expectRenderedConceptText(
        current.locator('[data-observation-region="reasoning"] .concept-body'),
        scene.body,
      );
      if (scene.math) {
        await expectRenderedConceptText(
          current.locator('[data-observation-region="readout"] .concept-math'),
          scene.math,
        );
      }
      const positions = await reader.evaluate((element) => {
        const controlElement = element.querySelector('.concept-observation-controls');
        const stagesElement = element.querySelector('.concept-stages');
        if (!controlElement || !stagesElement) throw new Error('Missing observation regions');
        const control = controlElement.getBoundingClientRect();
        const stages = stagesElement.getBoundingClientRect();
        return {
          controlY: control.top + scrollY,
          controlsEnd: control.bottom,
          stagesStart: stages.top,
          height: stages.height,
        };
      });
      expect(positions.controlsEnd).toBeLessThanOrEqual(positions.stagesStart);
      heights.push(positions.height);
      controlPositions.push(positions.controlY);
      if (index === 1) {
        await reader.getByRole('button', { name: '현재 관찰로 이동', exact: true }).click();
        await expect(current.locator('h3')).toBeFocused();
        await expect(controls).toBeInViewport();
      }
    }
    expect(Math.max(...heights) - Math.min(...heights)).toBeLessThan(1);
    expect(Math.max(...controlPositions) - Math.min(...controlPositions)).toBeLessThan(1);
    const lastScene = screen.scenes.at(-1);
    if (!lastScene) throw new Error(`Missing concept scenes: ${screen.id}`);
    await page.getByRole('button', { name: '목록으로 돌아가기', exact: true }).click();
    await page.locator('.concept-list button').first().click();
    await expect(current.locator('h3')).toHaveText(lastScene.title);
    await page.reload();
    await expect(current.locator('h3')).toHaveText(lastScene.title);
    await expect(reader.locator('[data-observation-region="question"]')).toHaveText(
      questions[screen.id],
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
    await reader.getByRole('button', { name: '현재 관찰로 이동', exact: true }).click();
    await page.screenshot({ path: info.outputPath(`${screen.id}-observation.png`) });
    await reader.getByRole('button', { name: '처음부터 보기', exact: true }).click();
    await expect(current.locator('h3')).toHaveText(screen.scenes[0].title);
    await page.getByRole('button', { name: '목록으로 돌아가기', exact: true }).click();
  }
  expect(await page.evaluate(() => localStorage.getItem('study-space:demo:v1'))).toBe(ledger);
  expect(errors).toEqual([]);
});
