const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  // Add a script at the very beginning to catch any unhandled promise rejections or early errors
  await page.addInitScript(() => {
    window.addEventListener('unhandledrejection', event => {
      console.log(`[EARLY ERROR] Unhandled rejection: ${event.reason}`);
    });
    window.addEventListener('error', event => {
      console.log(`[EARLY ERROR] Window error: ${event.message}`);
    });
  });

  page.on('console', msg => console.log(`[LOG] ${msg.text()}`));
  page.on('pageerror', err => console.log(`[PAGE ERROR] ${err.message}`));
  
  await page.goto('https://zuodii.com');
  await page.waitForTimeout(5000); // wait longer
  
  const errText = await page.evaluate(() => {
    const errEl = document.getElementById('error-display');
    return errEl ? errEl.innerText : 'No error display element';
  });
  console.log("Error Display On Screen:", errText);

  await browser.close();
})();
