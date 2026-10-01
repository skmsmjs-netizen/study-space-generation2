import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { decodeStoredText } from '../src/data/storage-codec';
import type { AppState } from '../src/domain/model';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { handleCommand, type CommandBackend } from '../src/server/command-handler';
import { packServerState, unpackServerState } from '../src/server/state-codec';
async function state(page: Page): Promise<AppState> {
  const stored = await page.evaluate(() => localStorage.getItem('study-space:demo:v1'));
  return JSON.parse(decodeStoredText(stored!)).data;
}
async function draw(page: Page, label: string) {
  const svg = page.getByRole('img', { name: label, exact: true });
  await svg.scrollIntoViewIfNeeded();
  const box = (await svg.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.15, box.y + box.height * 0.3);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.45, box.y + box.height * 0.5, { steps: 8 });
  await page.mouse.up();
  await expect(svg.locator('path')).toHaveCount(2);
}
async function register(page: Page, question: string, answer = '') {
  await page.getByRole('button', { name: '암기 항목 등록', exact: true }).click();
  await page.getByLabel('항목을 연결할 주제', { exact: true }).selectOption('demo-topic-function');
  await page.getByLabel('질문·개념', { exact: true }).fill(question);
  await page.getByLabel('기준 답안·조건', { exact: true }).fill(answer);
}
test('real pointer sketch, hidden answer, reload, comparison, durable result and retry', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/?space=demo#/memory-test');
  const original = await state(page);
  await register(page, '커패시터의 저장 에너지를 쓰시오.');
  await draw(page, '기준 답안 필기 영역');
  await page.reload();
  await expect(page.getByLabel('질문·개념')).toHaveValue('커패시터의 저장 에너지를 쓰시오.');
  await expect(page.getByRole('img', { name: '기준 답안 필기 영역' }).locator('path')).toHaveCount(
    2,
  );
  await page.getByRole('button', { name: '항목 저장', exact: true }).click();
  const card = (await state(page)).memoryCards![0];
  expect(card.strokes).toHaveLength(1);
  expect(card.answer).toBe('');
  await page.getByRole('button', { name: '쪽지시험 시작', exact: true }).click();
  await expect(page.getByRole('img', { name: '기준 답안 그림' })).toHaveCount(0);
  await page.getByLabel('내 답안', { exact: true }).fill('  조건과 단위를 남긴 내 답안\n');
  await draw(page, '내 답안 필기 영역');
  await page.reload();
  await expect(page.getByLabel('내 답안', { exact: true })).toHaveValue(
    '  조건과 단위를 남긴 내 답안\n',
  );
  await expect(page.getByRole('img', { name: '내 답안 필기 영역' }).locator('path')).toHaveCount(2);
  await page.getByRole('button', { name: '시험 마치고 답안 비교', exact: true }).click();
  await expect(page.getByRole('img', { name: '기준 답안 그림' })).toBeVisible();
  await page.getByLabel('1번 비교 결과', { exact: true }).selectOption('partial');
  const violations = await new AxeBuilder({ page })
    .include('.memory-tests')
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(violations.violations).toEqual([]);
  await page.screenshot({
    path: `work/memory-test-20261001/${testInfo.project.name}-comparison.png`,
    fullPage: true,
  });
  await page.getByRole('button', { name: '시험 결과 저장', exact: true }).click();
  await page.reload();
  const saved = await state(page);
  expect(saved.memoryTests).toHaveLength(1);
  expect(saved.memoryTests![0].questions[0]).toMatchObject({
    answer: '',
    strokes: card.strokes,
    response: '  조건과 단위를 남긴 내 답안\n',
    verdict: 'partial',
  });
  expect(saved.memoryTests![0].questions[0].responseStrokes).toHaveLength(1);
  expect(saved.records).toEqual(original.records);
  expect(saved.sessions).toEqual(original.sessions);
  await page
    .getByRole('button', { name: '틀리거나 부분적으로 맞은 문항 다시 시험', exact: true })
    .click();
  await expect(page.getByLabel('내 답안', { exact: true })).toHaveValue('');
  expect(errors).toEqual([]);
});
test('old criteria survive edits and blanks stay unassessed on a narrow screen', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/?space=demo#/memory-test');
  await register(
    page,
    '길게 적은 한국어 질문과 조건을 빠짐없이 보존하고 줄바꿈하는지 확인합니다.',
    '  출제 당시 답안\n조건',
  );
  await page.getByRole('button', { name: '항목 저장', exact: true }).click();
  await page.getByRole('button', { name: '쪽지시험 시작', exact: true }).click();
  await page.getByRole('button', { name: '시험 마치고 답안 비교', exact: true }).click();
  await expect(page.getByRole('option', { name: '틀림', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: '시험 결과 저장', exact: true }).click();
  await page.getByRole('button', { name: '암기 항목으로 돌아가기', exact: true }).click();
  await page.getByRole('button', { name: '항목 편집', exact: true }).click();
  await page.getByLabel('기준 답안·조건', { exact: true }).fill('바뀐 답안');
  await page.getByRole('button', { name: '항목 저장', exact: true }).click();
  await page.getByText('지난 시험 1회', { exact: true }).click();
  await page.getByRole('button', { name: '답안과 결과 보기', exact: true }).click();
  await expect(page.getByRole('region', { name: '1번 기준 답안', exact: true })).toContainText(
    '출제 당시 답안',
  );
  expect((await state(page)).memoryTests![0].questions[0].verdict).toBeNull();
  expect(
    await page.locator('.memory-tests').evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
});

test('personal UI sends real commands to an isolated PostgreSQL backend and reloads the server result', async ({
  page,
}) => {
  const owner = '10000000-0000-4000-8000-000000000009';
  const db = new PGlite();
  await db.exec(
    `create schema auth; create table auth.users(id uuid primary key); create role anon; create role authenticated; create role service_role bypassrls; create function auth.uid() returns uuid language sql as $$ select null::uuid $$; insert into auth.users values('${owner}');`,
  );
  await db.exec(await readFile('supabase/migrations/202609300001_study_storage.sql', 'utf8'));
  await db.exec(await readFile('supabase/migrations/20261001110001_memory_tests.sql', 'utf8'));
  const token = `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify({ sub: owner, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.isolated-test`;
  const backend: CommandBackend = {
    async authenticate(value) {
      return value === token ? owner : '';
    },
    async access() {
      return { status: 'approved', administrator: false, displayName: '격리 검증' };
    },
    async read(id, namespace) {
      const { rows } = await db.query<{ sequence: number; state: unknown }>(
        'select sequence,state from study_workspaces where user_id=$1 and namespace=$2',
        [id, namespace],
      );
      return rows[0]
        ? { sequence: Number(rows[0].sequence), data: unpackServerState(rows[0].state) }
        : null;
    },
    async commit(id, namespace, base, command, next) {
      const { rows } = await db.query<{ result: { sequence: number; data: unknown } }>(
        'select study_commit_internal($1,$2,$3,$4,$5,$6) result',
        [
          id,
          namespace,
          base,
          command.opId,
          next.appliedOps[command.opId],
          packServerState(next, command.opId),
        ],
      );
      return { sequence: rows[0].result.sequence, data: unpackServerState(rows[0].result.data) };
    },
  };
  try {
    const seeds = [
      { type: 'addSubject', id: 'subject', name: '격리 과목', scope: { kind: 'independent' } },
      {
        type: 'addNode',
        id: 'topic',
        subjectId: 'subject',
        parentId: null,
        role: 'topic',
        name: '격리 주제',
      },
    ];
    for (const [baseSequence, seed] of seeds.entries()) {
      const response = await handleCommand(
        new Request('http://isolated', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            action: 'execute',
            namespace: 'personal',
            baseSequence,
            command: {
              ...seed,
              userId: owner,
              namespace: 'personal',
              opId: `seed-${baseSequence}`,
              at: new Date().toISOString(),
            },
          }),
        }),
        backend,
      );
      expect(response.status).toBe(200);
    }
    const user = {
      id: owner,
      aud: 'authenticated',
      role: 'authenticated',
      email: 'memory-test@example.invalid',
      app_metadata: { provider: 'email', providers: ['email'] },
      user_metadata: {},
      created_at: new Date().toISOString(),
    };
    await page.addInitScript(
      ({ token, user }) => {
        if (!sessionStorage.getItem('memory-auth-seeded')) {
          localStorage.setItem(
            'study-space:auth:v1',
            JSON.stringify({
              access_token: token,
              refresh_token: 'isolated',
              token_type: 'bearer',
              expires_at: Math.floor(Date.now() / 1000) + 3600,
              expires_in: 3600,
              user,
            }),
          );
          sessionStorage.setItem('memory-auth-seeded', 'yes');
        }
      },
      { token, user },
    );
    const statuses: number[] = [];
    await page.route('https://*.supabase.co/**', async (route) => {
      const req = route.request();
      if (req.method() === 'OPTIONS') {
        await route.fulfill({
          status: 204,
          headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' },
        });
        return;
      }
      if (req.url().includes('/functions/v1/study-command')) {
        const response = await handleCommand(
          new Request(req.url(), {
            method: req.method(),
            headers: req.headers(),
            body: req.postData(),
          }),
          backend,
        );
        statuses.push(response.status);
        await route.fulfill({
          status: response.status,
          headers: Object.fromEntries(response.headers),
          body: await response.text(),
        });
      } else
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(user),
          headers: { 'Access-Control-Allow-Origin': '*' },
        });
    });
    await page.goto('/#/memory-test');
    await expect(page.getByRole('button', { name: '암기 항목 등록', exact: true })).toBeEnabled();
    await page.getByRole('button', { name: '암기 항목 등록', exact: true }).click();
    await page.getByLabel('질문·개념', { exact: true }).fill('온라인 원문 질문');
    await page.getByLabel('기준 답안·조건', { exact: true }).fill('  온라인 기준 답안\n');
    await draw(page, '기준 답안 필기 영역');
    await page.getByRole('button', { name: '항목 저장', exact: true }).click();
    await expect
      .poll(async () => (await backend.read(owner, 'personal'))?.data.memoryCards?.length)
      .toBe(1);
    await page.getByRole('button', { name: '쪽지시험 시작', exact: true }).click();
    await page.getByLabel('내 답안', { exact: true }).fill('  서버에 남길 내 답\n');
    await page.getByRole('button', { name: '시험 마치고 답안 비교', exact: true }).click();
    await page.getByLabel('1번 비교 결과', { exact: true }).selectOption('correct');
    await page.getByRole('button', { name: '시험 결과 저장', exact: true }).click();
    await expect
      .poll(async () => (await backend.read(owner, 'personal'))?.data.memoryTests?.length)
      .toBe(1);
    // Remove acknowledged client caches in this isolated profile to require a server read.
    await page.evaluate(async (owner) => {
      localStorage.removeItem(`study-space:personal:${owner}:online:v1`);
      await new Promise<void>((resolve, reject) => {
        const open = indexedDB.open('study-space-personal-journals');
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
          const db = open.result,
            tx = db.transaction('journals', 'readwrite');
          tx.objectStore('journals').delete(`study-space:personal:${owner}:online:v1`);
          tx.oncomplete = () => {
            db.close();
            resolve();
          };
          tx.onerror = () => reject(tx.error);
        };
      });
    }, owner);
    await page.reload();
    await expect(page.getByText('기준 답안', { exact: true })).toBeVisible();
    await expect(page.getByText('서버에 남길 내 답', { exact: true })).toBeVisible();
    expect(
      (await backend.read(owner, 'personal'))!.data.memoryTests![0].questions[0].response,
    ).toBe('  서버에 남길 내 답\n');
    expect(statuses.every((status) => status === 200)).toBe(true);
  } finally {
    await page.close();
    await db.close();
  }
});
