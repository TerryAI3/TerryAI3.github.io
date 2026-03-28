const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  const urls = [];
  page.on('response', response => {
    if (!response.ok()) {
      urls.push(response.url());
      console.log(`[HTTP ERROR] ${response.status()} ${response.url()}`);
    }
  });

  await page.goto('https://zuodii.com');
  await page.waitForTimeout(3000);
  
  if (urls.length > 0) {
    console.log("Failed URLs:", urls);
  } else {
    console.log("No HTTP errors detected.");
    console.log("Checking for root content:", await page.evaluate(() => document.getElementById('root').innerHTML.substring(0, 100)));
  }

  await browser.close();
})();
