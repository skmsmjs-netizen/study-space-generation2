import { test, expect } from '@playwright/test';
for (const route of ['/memory-test', '/canvas', '/graph']) {
 test(`native field paint probe ${route}`, async ({page}) => {
  await page.goto(`?space=demo#${route}`);
  await expect(page.locator('main h1').first()).toBeVisible();
  await expect(page.locator('main [data-ui-loading]')).toHaveCount(0,{timeout:30000});
  await page.addStyleTag({content:'html {font-size:200% !important;}'});
  await page.evaluate(()=>document.fonts.ready);
  const baseline=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth}));
  await page.addStyleTag({content:'select.ui-input {contain: inline-size layout paint;}'});
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  console.log(JSON.stringify({route,baseline,contained:await page.evaluate(()=>document.documentElement.scrollWidth)}));
 });
}
