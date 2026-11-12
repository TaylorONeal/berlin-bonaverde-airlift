"""App icon set: a coffee bean floating down on a green parachute, on a dark green glow.

Matches the house style of the maker's other apps: full-bleed dark background with a soft
coloured glow, one flat bold symbol, two or three accent colours, no text.

python3 -I tools/app-icon/make_icons.py <chromium path> <app assets dir>
Writes icon.png (1024, opaque), android-icon-foreground/background/monochrome, splash-icon,
favicon, and store-icon-512.png (move it to store/play-icon-512.png for the Google Play listing).
"""
import sys, asyncio, os, tempfile
from playwright.async_api import async_playwright

CHROME, OUT = sys.argv[1], sys.argv[2]
NIGHT, GLOW, POP, SHADE, CREAM, OAK, ESP = '#0A1F15', '#1C5A38', '#7BE495', '#5CC97A', '#F6EFE3', '#C99B66', '#2A1B12'
DOME = ('M232 430 C 232 250, 366 168, 512 168 C 658 168, 792 250, 792 430 '
        'C 746 398, 696 398, 652 430 C 606 398, 558 398, 512 430 C 466 398, 418 398, 372 430 '
        'C 328 398, 278 398, 232 430 Z')

def mark(mono=False):
    c = (lambda col: '#FFFFFF') if mono else (lambda col: col)
    gores = '' if mono else (
        f'<path d="M372 430 C 380 300, 440 196, 512 168 C 470 230, 452 330, 452 414 Z" fill="{SHADE}"/>'
        f'<path d="M652 430 C 644 300, 584 196, 512 168 C 554 230, 572 330, 572 414 Z" fill="{SHADE}"/>')
    crease = '' if mono else (
        f'<path d="M -6 -150 C 52 -80, -52 -10, 4 50 C 40 90, 10 130, -4 152" stroke="{ESP}" '
        f'stroke-width="22" fill="none" stroke-linecap="round"/>')
    return (f'<path d="{DOME}" fill="{c(POP)}"/>{gores}'
            f'<g stroke="{c(CREAM)}" stroke-width="12" stroke-linecap="round" fill="none">'
            f'<path d="M240 432 L 452 600"/><path d="M784 432 L 572 600"/><path d="M512 432 L 512 560"/></g>'
            f'<g transform="translate(512 724) rotate(-28) scale(0.92)">'
            f'<ellipse cx="0" cy="0" rx="118" ry="160" fill="{c(OAK)}"/>{crease}</g>')

BG = (f'<defs><radialGradient id="g" cx="50%" cy="34%" r="70%"><stop offset="0" stop-color="{GLOW}"/>'
      f'<stop offset=".75" stop-color="{NIGHT}"/></radialGradient></defs><rect width="1024" height="1024" fill="url(#g)"/>')

def svg(size, bg=True, k=0.95, mono=False):
    off = 512 * (1 - k)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 1024 1024">'
            f'{BG if bg else ""}<g transform="translate({off} {off - 6}) scale({k})">{mark(mono)}</g></svg>')

async def main():
    jobs = [
        ('icon.png', 1024, svg(1024), False),
        ('store-icon-512.png', 512, svg(512), False),
        ('android-icon-foreground.png', 512, svg(512, False, 0.68), True),
        ('android-icon-background.png', 512, f'<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 1024 1024">{BG}</svg>', False),
        ('android-icon-monochrome.png', 432, svg(432, False, 0.68, True), True),
        ('splash-icon.png', 1024, svg(1024, False, 0.80), True),
        ('favicon.png', 48, svg(48, True, 1.0), False),
    ]
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=['--no-sandbox', '--single-process', '--no-zygote', '--disable-gpu'])
        pg = await b.new_page()
        tmp = tempfile.mkdtemp()
        for name, size, s, transparent in jobs:
            await pg.set_viewport_size({'width': size, 'height': size})
            f = os.path.join(tmp, 'i.html')
            open(f, 'w').write(f'<html><body style="margin:0;background:transparent">{s}</body></html>')
            await pg.goto('file://' + f)
            await pg.screenshot(path=os.path.join(OUT, name), omit_background=transparent)
        await b.close()

asyncio.run(main())
