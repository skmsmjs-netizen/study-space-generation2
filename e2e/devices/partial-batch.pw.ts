import { expect, test } from '@playwright/test';
import { AUTH_KEY } from '../../src/data/auth-session';
import { emptyState, type Command } from '../../src/domain/model';
import { applyCommand } from '../../src/domain/commands';
import { PUBLIC_SERVER_URL } from '../../src/data/public-server-config';

test('partial batch failure retries only missing receipts through the save dialog and survives reload', async ({ context,page },info)=>{
  const userId='70000000-0000-4000-8000-000000000010';
  let server={sequence:0,data:emptyState(userId,'personal')};
  let mode:'offline'|'prefix'|'online'='offline';
  const writes:string[][]=[];
  const token=`${Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url')}.${Buffer.from(JSON.stringify({sub:userId,exp:Math.floor(Date.now()/1000)+3600,role:'authenticated'})).toString('base64url')}.synthetic`;
  const commit=(commands:Command[])=>{for(const command of commands){const exists=Boolean(server.data.appliedOps[command.opId]);server={sequence:server.sequence+(exists?0:1),data:applyCommand(server.data,command)};}};
  await context.route(`${PUBLIC_SERVER_URL}/**`,async route=>{
    if(!route.request().url().includes('/functions/v1/study-command')){await route.fulfill({json:{id:userId,email:'batch-fixture@example.invalid'}});return;}
    const body=route.request().postDataJSON();
    if(body.action==='access'){await route.fulfill({json:{status:'approved',administrator:false,displayName:'격리 묶음 복구',version:1}});return;}
    if(body.action==='load'){await route.fulfill({json:{...server,syncCapabilities:{batchCommands:true,conditionalLoad:true}}});return;}
    const commands:Command[]=body.commands??[body.command];writes.push(commands.map(command=>command.opId));
    if(mode==='offline'){await route.fulfill({status:503,json:{code:'SERVER_ERROR',message:'시험 전송 차단'}});return;}
    if(body.baseSequence!==server.sequence){await route.fulfill({status:409,json:{code:'VERSION_CONFLICT',message:'시험 저장 순서 충돌'}});return;}
    if(mode==='prefix'){expect(commands.length).toBeGreaterThan(2);commit(commands.slice(0,2));mode='online';await route.fulfill({status:503,json:{code:'SERVER_ERROR',message:'시험 부분 저장 뒤 응답 중단'}});return;}
    commit(commands);await route.fulfill({json:{...server,syncCapabilities:{batchCommands:true,conditionalLoad:true}}});
  });
  await context.addInitScript(({key,token,userId})=>localStorage.setItem(key,JSON.stringify({access_token:token,refresh_token:'synthetic-refresh',token_type:'bearer',expires_in:3600,expires_at:Math.floor(Date.now()/1000)+3600,user:{id:userId,email:'batch-fixture@example.invalid',aud:'authenticated',role:'authenticated'}})),{key:AUTH_KEY,token,userId});
  await page.goto('?space=personal#/memos');
  const originals=['  첫 원문\n조건과 예외  ','  둘째 원문\n줄바꿈과 공백  ','  셋째 원문\n되돌아올 글  '];
  for(const body of originals){await page.getByRole('button',{name:'메모 추가',exact:true}).click();await page.getByText('글·연결·입력 설정',{exact:true}).click();await page.getByRole('textbox',{name:'짧은 글',exact:true}).fill(body);await page.getByRole('button',{name:'지금 저장',exact:true}).click();await page.getByRole('button',{name:'닫기',exact:true}).click();}
  expect(server.sequence).toBe(0);
  await page.getByRole('button',{name:/시험 전송 차단/}).click();
  mode='prefix';await page.getByRole('button',{name:'서버 저장 다시 시도',exact:true}).click();
  await expect(page.getByRole('alert')).toContainText('시험 부분 저장 뒤 응답 중단');
  expect(server.sequence).toBe(2);const firstReceipts=Object.keys(server.data.appliedOps);
  await page.getByRole('button',{name:'서버 저장 다시 시도',exact:true}).click();
  await expect(page.getByRole('dialog',{name:'내 기록의 저장 상태',exact:true})).toContainText('서버에 저장됨');
  expect(writes.at(-1)?.some(id=>firstReceipts.includes(id))).toBe(false);
  expect(server.data.memos?.map(row=>row.body)).toEqual(originals);
  expect(server.data.revisions).toHaveLength(Object.keys(server.data.appliedOps).length);
  await page.getByRole('button',{name:'내 기록의 저장 상태 닫기',exact:true}).click();
  const last=server.data.memos!.at(-1)!;await page.goto(`?space=personal#/memos/${last.id}`);await page.reload();
  await expect(page.getByRole('textbox',{name:'짧은 글',exact:true})).toHaveValue(originals[2]);
  expect(server.data.records).toEqual([]);
  await page.screenshot({path:info.outputPath('partial-batch-restored.png'),fullPage:true});
});
