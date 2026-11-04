import { chromium } from 'playwright';

const baseUrl = process.env.WEB_URL ?? 'http://127.0.0.1:5180';
const outDir = process.env.OUT_DIR ?? 'docs/releases/screenshots';

const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL ?? 'chromium' });

async function capture(prefix, width, height, scale) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: scale,
    isMobile: true,
    hasTouch: true,
  });
  page.setDefaultTimeout(30000);

  await page.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('a[href="/atlas/zheng-he"]');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outDir}/${prefix}-01-home.jpg`, type: 'jpeg', quality: 85 });

  await page.goto(`${baseUrl}/atlas/zheng-he?t=1433-07-22`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('button.atlas-marker');
  await page.waitForTimeout(3500);
  await page.screenshot({ path: `${outDir}/${prefix}-02-atlas.jpg`, type: 'jpeg', quality: 85 });

  await page.goto(`${baseUrl}/atlas/zheng-he?t=1414-05-01&event=hormuz-1414-05`, {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForSelector('aside[aria-label="事件详情"]');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${outDir}/${prefix}-03-detail.jpg`, type: 'jpeg', quality: 85 });

  await page.goto(`${baseUrl}/search`, { waitUntil: 'domcontentloaded' });
  await page.locator('input[aria-label="搜索事件"]').waitFor();
  await page.waitForTimeout(800);
  await page.locator('input[aria-label="搜索事件"]').fill('满剌加');
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${outDir}/${prefix}-04-search.jpg`, type: 'jpeg', quality: 85 });

  await page.close();
}

await capture('ios', 430, 932, 3);
await capture('android', 360, 640, 3);
await browser.close();

console.log(`store screenshots written to ${outDir}`);
