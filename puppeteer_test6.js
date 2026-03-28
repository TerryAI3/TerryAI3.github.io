const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('request', request => {
    if (request.url().includes('vendor')) {
      console.log(`[REQUEST] ${request.url()}`);
    }
  });
  page.on('response', response => {
    if (response.url().includes('vendor')) {
      console.log(`[RESPONSE] ${response.url()}: ${response.status()}`);
    }
  });

  await page.goto('https://zuodii.com');
  await page.waitForTimeout(2000);
  await browser.close();
})();
