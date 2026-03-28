const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  // Set user agent to Android WeChat
  await page.setExtraHTTPHeaders({'Accept-Language': 'zh-CN,zh;q=0.9'});
  await page.setViewportSize({ width: 375, height: 812 });
  
  page.on('console', msg => console.log(`[LOG] ${msg.text()}`));
  page.on('pageerror', err => console.log(`[PAGE ERROR] ${err.message}`));
  
  await page.goto('https://zuodii.com');
  await page.waitForTimeout(3000);
  
  const rootHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML || "");
  console.log("Root HTML length:", rootHtml.length);
  
  const displayStyle = await page.evaluate(() => document.getElementById('loading-overlay')?.style.display);
  console.log("Loading Overlay Display:", displayStyle);
  
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();
