import sys, asyncio
from playwright.async_api import async_playwright
S=sys.argv[1]; C=S+'/cap/'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/tmp/chromium', args=['--no-sandbox','--single-process','--no-zygote','--disable-gpu'])
        ctx = await b.new_context(viewport={'width':393,'height':852}, device_scale_factor=3)
        pg = await ctx.new_page()
        await pg.goto('file://'+S+'/preview/index.html'); await pg.wait_for_timeout(1500)
        await pg.get_by_text('Change', exact=True).first.click(); await pg.wait_for_timeout(800)
        await pg.get_by_text('Overnight', exact=True).first.click(); await pg.wait_for_timeout(600)
        el = pg.get_by_text('Brew after roasting', exact=True).first
        await el.scroll_into_view_if_needed(); await pg.wait_for_timeout(600)
        await pg.screenshot(path=C+'drink-pause.png')
        bb = await pg.get_by_text('Roast now and wake up to fresh coffee. Up to 24 hours.').first.bounding_box()
        bl = await el.bounding_box()
        print('pause box', bl, bb)
        await b.close()
asyncio.run(main())
