const { chromium } = require('playwright');
(async () => {
  try {
    const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    page.on('console', msg => console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));
    page.on('pageerror', err => console.log(`[BROWSER ERROR] ${err.name}: ${err.message}`));
    
    console.log("Navigating to https://zuodii.com...");
    await page.goto('https://zuodii.com', { waitUntil: 'networkidle', timeout: 20000 });
    
    console.log("Page loaded. Waiting a bit for React to render...");
    await page.waitForTimeout(3000);
    
    const content = await page.content();
    console.log(`HTML length: ${content.length}`);
    
    // Check if error display is showing anything
    const errText = await page.evaluate(() => {
      const errEl = document.getElementById('error-display');
      return errEl ? errEl.innerText : 'No error display element';
    });
    console.log("Error display text:", errText);
    
    // Check if root has content
    const rootHasContent = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root && root.innerHTML.length > 50;
    });
    console.log("React Root rendered:", rootHasContent);
    
    await browser.close();
  } catch (err) {
    console.error("Script failed:", err);
  }
})();
