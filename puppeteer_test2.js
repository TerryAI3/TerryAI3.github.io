const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  // Intercept and log all network requests to see what is 404ing
  page.on('response', response => {
    if (!response.ok()) {
      console.log(`[404] ${response.status()} ${response.url()}`);
    }
  });

  page.on('console', msg => console.log(`[LOG] ${msg.text()}`));
  page.on('pageerror', err => console.log(`[PAGE ERROR] ${err.message}`));
  
  await page.goto('https://zuodii.com', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  const errText = await page.evaluate(() => {
    const errEl = document.getElementById('error-display');
    return errEl ? errEl.innerText : 'No error display element';
  });
  console.log("Error Display On Screen:", errText);

  await browser.close();
})();
