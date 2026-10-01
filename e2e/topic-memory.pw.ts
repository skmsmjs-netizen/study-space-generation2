import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import { handleCommand, type CommandBackend } from '../src/server/command-handler';
import { packServerState, unpackServerState } from '../src/server/state-codec';
import { AI_OWNER_USER_ID } from '../src/domain/ai-access';
import { generateGPTTopicMemory, handleTopicMemoryAI } from '../src/server/gpt-topic-memory';
test('topic-only GPT draft edits survive reload, register once and reach PostgreSQL with frozen provenance', async ({
  page,
}, testInfo) => {
  const owner = AI_OWNER_USER_ID;
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
      { type: 'addSubject', id: 'subject', name: '회로이론', scope: { kind: 'independent' } },
      {
        type: 'addNode',
        id: 'topic',
        subjectId: 'subject',
        parentId: null,
        role: 'topic',
        name: '커패시터',
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
    let inferenceCalls = 0;
    await page.route('**/api/study-ai/status', async (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          configured: true,
          local: true,
          provider: 'chatgpt',
          model: 'isolated-model',
          models: [{ slug: 'isolated-model', displayName: '검증용 모델' }],
          session: { status: 'connected', sharing: true },
          connecting: false,
          connectionError: '',
          creditsConfirmed: true,
          transcription: false,
        }),
      }),
    );
    await page.route('**/api/study-ai/topic-memory', async (route) => {
      const req = route.request();
      const response = await handleTopicMemoryAI(
        new Request(req.url(), {
          method: req.method(),
          headers: req.headers(),
          body: req.postData(),
        }),
        {
          async authorize(request) {
            if (request.headers.get('authorization') !== `Bearer ${token}`)
              throw Error('missing session');
            return { userId: owner, namespace: 'personal' };
          },
          async reserve() {},
          async generate(input) {
            return generateGPTTopicMemory(input, {
              model: 'isolated-model',
              runtime: {
                async streamResponse() {
                  inferenceCalls++;
                  return {
                    text: JSON.stringify({
                      cards: [
                        {
                          topicId: 'topic',
                          question: '커패시터 임피던스는?',
                          answer: '  Z=1/(jωC)\n이상적 소자 조건  ',
                        },
                      ],
                    }),
                  };
                },
              },
            });
          },
        },
      );
      await route.fulfill({
        status: response.status,
        headers: Object.fromEntries(response.headers),
        body: await response.text(),
      });
    });
    await page.setViewportSize({ width: 390, height: 844 });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/#/memory-test');
    await page.getByRole('button', { name: 'GPT로 암기항목 만들기', exact: true }).click();
    await page.getByLabel('만들 암기항목 수', { exact: true }).selectOption('1');
    await page.getByLabel('출제 초점·난도 (선택)', { exact: true }).fill('공식의 적용 조건');
    await page.getByRole('button', { name: 'GPT 연결 확인', exact: true }).click();
    await expect(page.getByRole('region', { name: 'GPT 연결 설정' })).toContainText('ChatGPT 연결됨');
    await expect(page.getByLabel('GPT 모델', { exact: true })).toHaveValue('isolated-model');
    await page.getByRole('button', { name: 'GPT 연결 닫기', exact: true }).click();
    await expect(page.getByLabel('출제 초점·난도 (선택)', { exact: true })).toHaveValue('공식의 적용 조건');
    await page.getByRole('button', { name: '이 목차로 생성', exact: true }).click();
    await expect(page.getByLabel('1번 질문', { exact: true })).toHaveValue('커패시터 임피던스는?');
    await page.getByLabel('1번 기준 답안', { exact: true }).fill('  수정한 기준 답안\n소자 조건  ');
    await expect(
      page.getByRole('button', { name: '확인한 항목 등록', exact: true }),
    ).toBeDisabled();
    await page.getByLabel('1번 질문과 답안을 확인했어요', { exact: true }).check();
    await page.reload();
    await expect(page.getByLabel('1번 기준 답안', { exact: true })).toHaveValue(
      '  수정한 기준 답안\n소자 조건  ',
    );
    await page.getByRole('button', { name: '확인한 항목 등록', exact: true }).click();
    await expect
      .poll(async () => (await backend.read(owner, 'personal'))?.data.memoryCards?.length)
      .toBe(1);
    await page.getByRole('button', { name: '확인한 항목 등록', exact: true }).click();
    expect(inferenceCalls).toBe(1);
    const savedCard = (await backend.read(owner, 'personal'))!.data.memoryCards![0];
    expect(savedCard.topicGeneration!.input.subject.name).toBe('회로이론');
    expect(savedCard.topicGeneration!.originalAnswer).toBe('  Z=1/(jωC)\n이상적 소자 조건  ');
    const axe = await new AxeBuilder({ page })
      .include('.memory-tests')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(axe.violations).toEqual([]);
    expect(
      await page.locator('.memory-tests').evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true);
    await page.screenshot({
      path: `work/topic-memory-20261001/${testInfo.project.name}-generated.png`,
      fullPage: true,
    });
    await page.getByRole('button', { name: '쪽지시험 시작', exact: true }).click();
    await expect(page.getByText('수정한 기준 답안', { exact: true })).toHaveCount(0);
    await page.getByLabel('내 답안', { exact: true }).fill('  내 답안\n');
    await page.getByRole('button', { name: '시험 마치고 답안 비교', exact: true }).click();
    await page.getByLabel('1번 비교 결과', { exact: true }).selectOption('uncertain');
    await page.getByRole('button', { name: '시험 결과 저장', exact: true }).click();
    await expect
      .poll(async () => (await backend.read(owner, 'personal'))?.data.memoryTests?.length)
      .toBe(1);
    expect(errors).toEqual([]);
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
    await expect(page.getByRole('region', { name: '1번 내 답안', exact: true })).toContainText('내 답안');
    expect(
      (await backend.read(owner, 'personal'))!.data.memoryTests![0].questions[0].response,
    ).toBe('  내 답안\n');
    expect(statuses.every((status) => status === 200)).toBe(true);
  } finally {
    await page.close();
    await db.close();
  }
});
