import { devices } from '@playwright/test';

// Geometry from Apple specifications; WebKit profiles approximate touch browsers.
// Keep one definition for local verification and CI. Screen size is not available viewport size.
const phone = devices['iPhone 16 Pro'];
const landscape = devices['iPhone 16 Pro landscape'];
const tablet = devices['iPad Pro 11'];
export const deviceEnvironments = [
  {
    name: 'iPhone-17-Pro-portrait',
    use: {
      ...phone,
      screen: { width: 402, height: 874 },
      viewport: phone.viewport,
    },
  },
  {
    name: 'iPhone-17-Pro-landscape',
    use: {
      ...landscape,
      screen: { width: 874, height: 402 },
      viewport: landscape.viewport,
    },
  },
  {
    name: 'iPad-Pro-13-portrait',
    use: {
      ...tablet,
      screen: { width: 1032, height: 1376 },
      viewport: { width: 1032, height: 1376 },
    },
  },
  {
    name: 'iPad-Pro-13-landscape',
    use: {
      ...tablet,
      screen: { width: 1376, height: 1032 },
      viewport: { width: 1376, height: 1032 },
    },
  },
  {
    name: 'iPad-Pro-13-half-window',
    use: {
      ...tablet,
      screen: { width: 1032, height: 1376 },
      viewport: { width: 517, height: 1200 },
    },
  },
];
