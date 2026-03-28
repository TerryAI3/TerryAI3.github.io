const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('requestfailed', request => {
    console.log(`[REQUEST FAILED] ${request.url()}: ${request.failure().errorText}`);
  });
  page.on('response', response => {
    if (!response.ok()) {
      console.log(`[HTTP ERROR] ${response.status()} ${response.url()}`);
    }
  });

  await page.goto('https://zuodii.com');
  await page.waitForTimeout(3000);
  
  await browser.close();
})();
