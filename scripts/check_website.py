import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        console_logs = []
        page.on("console", lambda msg: console_logs.append(f"{msg.type}: {msg.text}"))
        
        errors = []
        page.on("pageerror", lambda err: errors.append(err))
        
        network_logs = []
        page.on("request", lambda request: network_logs.append(f"{request.method} {request.url}"))
        page.on("response", lambda response: network_logs.append(f"{response.status} {response.url}"))

        try:
            print("Navigating to https://zuodii.com ...")
            await page.goto("https://zuodii.com", timeout=30000, wait_until="networkidle")
            
            # Wait a bit for JS to execute
            await asyncio.sleep(2)
            
            content = await page.content()
            title = await page.title()
            
            print(f"Title: {title}")
            print(f"Page size: {len(content)} bytes")
            
            print("\n--- Console Logs ---")
            for log in console_logs:
                print(log)
                
            print("\n--- Page Errors ---")
            for err in errors:
                print(err)
                
            print("\n--- Network Logs ---")
            for log in network_logs:
                print(log)
                
        except Exception as e:
            print(f"Error: {e}")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
