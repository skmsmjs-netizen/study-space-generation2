import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
 webServer:{command:'node prepare-site.mjs && python3 -m http.server 5289 --bind 127.0.0.1 --directory site',url:'http://127.0.0.1:5289/color-check.html',reuseExistingServer:!process.env.CI},
 testDir:'.',testMatch:'colors.pw.mjs',workers:2,timeout:90000,retries:0,
 outputDir:'./artifacts/traces',reporter:[['list'],['json',{outputFile:'./artifacts/results.json'}]],
 use:{baseURL:'http://127.0.0.1:5289',locale:'ko-KR',timezoneId:'Asia/Seoul',colorScheme:'light',trace:'retain-on-failure',screenshot:'only-on-failure'},
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
