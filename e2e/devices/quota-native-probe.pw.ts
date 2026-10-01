import { test, expect } from '@playwright/test';
for (const route of ['/memory-test', '/canvas', '/graph']) {
 test(`native field paint probe ${route}`, async ({page}) => {
  await page.goto(`?space=demo#${route}`);
  await expect(page.locator('main h1').first()).toBeVisible();
  await expect(page.locator('main [data-ui-loading]')).toHaveCount(0,{timeout:30000});
  await page.addStyleTag({content:'html {font-size:200% !important;}'});
  await page.evaluate(()=>document.fonts.ready);
  const baseline=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth}));
  const select=page.locator('main select.ui-input').first();
  await select.focus();
  await expect(select).toBeFocused();
  expect(await select.evaluate(el=>parseFloat(getComputedStyle(el.parentElement!).outlineWidth))).toBeGreaterThan(0);
  const choice=await select.locator('option').nth(1).getAttribute('value');
  if(choice!==null) { await select.selectOption(choice); await expect(select).toHaveValue(choice); }
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  console.log(JSON.stringify({route,baseline,contained:await page.evaluate(()=>document.documentElement.scrollWidth)}));
 });
}
