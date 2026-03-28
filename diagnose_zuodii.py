import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        )
        page = await context.new_page()

        console_errors = []
        network_errors = []

        # Use request and response for specific tracking
        page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}"))
        page.on("pageerror", lambda err: console_errors.append(f"[pageerror] {err.message}"))
        page.on("response", lambda res: network_errors.append(f"HTTP {res.status}: {res.url}") if res.status >= 400 else None)
        page.on("requestfailed", lambda req: network_errors.append(f"FAILED: {req.url} ({req.failure if req.failure else 'No reason'})"))

        print(f"--- Launching https://zuodii.com ---")
        try:
            await page.goto("https://zuodii.com", wait_until="load", timeout=30000)
            # Wait longer for dynamic components
            await asyncio.sleep(8)
        except Exception as e:
            print(f"Exception: {e}")

        # Check raw HTML from server vs rendered
        raw_html = await page.content()
        body_html = await page.evaluate("() => document.body.innerHTML")
        
        print("\n--- Network Errors (4xx/5xx/Failures) ---")
        for err in network_errors:
            print(err)

        print("\n--- Console Logs ---")
        for log in console_errors:
            print(log)

        print("\n--- DOM Analysis ---")
        root_content = await page.evaluate("() => document.getElementById('root')?.innerHTML || 'ROOT NOT FOUND'")
        print(f"Root InnerHTML: {root_content}")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
