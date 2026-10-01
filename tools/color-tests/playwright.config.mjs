import {defineConfig,devices} from '@playwright/test';
import {createServer} from 'node:net';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createDeviceRun} from '../../scripts/device-run.mjs';
// Serve fixed build bytes on an independent port, also for concurrent local runs.
if(!process.env.COLOR_TEST_SITE){
 const snapshot=createDeviceRun(fileURLToPath(new URL('../../dist/',import.meta.url)),fileURLToPath(new URL('../../work/color-environments/',import.meta.url)));
 process.env.COLOR_TEST_SITE=path.join(snapshot.run,'site');
 process.env.COLOR_TEST_APP=snapshot.build;
}
let port=process.env.COLOR_TEST_PORT;
if(!port){
 const reservation=createServer();
 await new Promise((resolve,reject)=>{reservation.once('error',reject);reservation.listen(0,'127.0.0.1',resolve);});
 port=String(reservation.address().port);
 await new Promise(resolve=>reservation.close(resolve));
 process.env.COLOR_TEST_PORT=port;
}
export default defineConfig({
 webServer:{command:'node prepare-site.mjs --serve',url:`http://127.0.0.1:${port}/color-check.html`,reuseExistingServer:false},
 testDir:'.',testMatch:'colors.pw.mjs',workers:2,timeout:90000,retries:0,
 outputDir:'./artifacts/traces',reporter:[['list'],['json',{outputFile:'./artifacts/results.json'}]],
 use:{baseURL:`http://127.0.0.1:${port}`,locale:'ko-KR',timezoneId:'Asia/Seoul',colorScheme:'light',trace:'retain-on-failure',screenshot:'only-on-failure'},
 projects:[
  {name:'chromium-desktop',use:{browserName:'chromium',viewport:{width:1280,height:800}}},
  {name:'firefox-desktop',use:{browserName:'firefox',viewport:{width:1280,height:800}}},
  {name:'webkit-desktop',use:{browserName:'webkit',viewport:{width:1280,height:800}}},
  {name:'webkit-phone-portrait',use:{...devices['iPhone 16 Pro'],viewport:{width:402,height:681},screen:{width:402,height:874}}},
  {name:'webkit-phone-landscape',use:{...devices['iPhone 16 Pro landscape'],viewport:{width:756,height:352},screen:{width:874,height:402}}},
  {name:'webkit-ipad-portrait',use:{...devices['iPad Pro 11'],viewport:{width:1032,height:1376},screen:{width:1032,height:1376}}},
  {name:'webkit-ipad-landscape',use:{...devices['iPad Pro 11'],viewport:{width:1376,height:1032},screen:{width:1376,height:1032}}},
  {name:'webkit-ipad-split',use:{...devices['iPad Pro 11'],viewport:{width:517,height:1200},screen:{width:1032,height:1376}}},
  {name:'chromium-reflow-320',use:{browserName:'chromium',viewport:{width:320,height:740},hasTouch:true}},
 ]
});
