import sys, asyncio
from playwright.async_api import async_playwright
S=sys.argv[1]; C=S+'/cap/'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/tmp/chromium', args=['--no-sandbox','--single-process','--no-zygote','--disable-gpu'])
        ctx = await b.new_context(viewport={'width':393,'height':852}, device_scale_factor=3)
        pg = await ctx.new_page()
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file://'+S+'/preview/index.html'); await pg.wait_for_timeout(1500)
        await pg.screenshot(path=C+'home.png')
        await pg.get_by_text('Write a card', exact=True).first.click()
        for i in range(14):
            await pg.wait_for_timeout(120)
            await pg.screenshot(path=C+f'drop{i:02d}.png')
        await pg.wait_for_timeout(1500)
        await pg.screenshot(path=C+'done.png')
        # read the card just written
        await pg.get_by_text("What's on this card?", exact=True).first.click(); await pg.wait_for_timeout(700)
        await pg.get_by_text('Check a card', exact=True).first.click(); await pg.wait_for_timeout(1800)
        await pg.screenshot(path=C+'read.png')
        await pg.get_by_text('Done', exact=True).first.click(); await pg.wait_for_timeout(700)
        # drink sheet
        await pg.get_by_text('Change', exact=True).first.click(); await pg.wait_for_timeout(800)
        await pg.screenshot(path=C+'drink.png')
        for label, name in [('Medium Roast','drink-medium'),('Overnight','drink-overnight')]:
            el = pg.get_by_text(label, exact=True).first
            await el.scroll_into_view_if_needed(); await el.click(); await pg.wait_for_timeout(600)
            await pg.screenshot(path=C+name+'.png')
        await pg.get_by_text('Done', exact=True).first.click(); await pg.wait_for_timeout(700)
        await pg.get_by_text('More', exact=True).first.click(); await pg.wait_for_timeout(800)
        await pg.screenshot(path=C+'more.png')
        for anchor, name in [('Made by owners, for owners','more-about'),('Thank you','more-thanks'),('See the code on GitHub','more-open')]:
            await pg.get_by_text(anchor, exact=True).first.scroll_into_view_if_needed(); await pg.wait_for_timeout(500)
            await pg.screenshot(path=C+name+'.png')
        await pg.get_by_text('Done', exact=True).first.click(); await pg.wait_for_timeout(700)
        await pg.get_by_text('Help', exact=True).first.click(); await pg.wait_for_timeout(800)
        await pg.screenshot(path=C+'help.png')
        print('errors', errs)
        await b.close()
asyncio.run(main())
