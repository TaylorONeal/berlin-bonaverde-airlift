"""App icon set: a coffee card floating down on a green parachute, on Berlin Airlift green.

python3 -I tools/app-icon/make_icons.py <chromium path> <app assets dir>
Writes icon.png (1024, opaque), android-icon-foreground/background/monochrome, splash-icon, favicon.
"""
import sys, asyncio, os, tempfile
from playwright.async_api import async_playwright

CHROME, OUT = sys.argv[1], sys.argv[2]
VERDE, POP, CREAM, OAK, ESP = '#17703D', '#7BE495', '#F6EFE3', '#C99B66', '#2A1B12'

def art(mono=False):
    canopy = '#FFFFFF' if mono else POP
    card_f = '#FFFFFF' if mono else CREAM
    line = '#FFFFFF' if mono else CREAM
    inner = '' if mono else (
        ''.join(f'<rect x="{612+i*14}" y="{560+i*14}" width="{150-i*28}" height="{150-i*28}" rx="18" fill="none" stroke="{OAK}" stroke-width="8"/>' for i in range(3))
        + f'<rect x="660" y="611" width="54" height="44" rx="8" fill="{VERDE}"/>')
    stroke = '' if mono else f' stroke="{ESP}" stroke-width="14"'
    return (f'<path d="M232 380 C 232 214, 368 140, 512 140 C 656 140, 792 214, 792 380 C 738 344, 682 344, 632 380 C 584 344, 440 344, 392 380 C 342 344, 286 344, 232 380 Z" fill="{canopy}"/>'
            f'<g stroke="{line}" stroke-width="12" stroke-linecap="round"><path d="M240 384 L 330 560"/><path d="M784 384 L 700 548"/><path d="M512 380 L 512 520"/></g>'
            f'<g transform="rotate(-8 512 660)"><rect x="262" y="520" width="520" height="300" rx="44" fill="{card_f}"{stroke}/>{inner}</g>')

def svg(size, bg=None, scale=1.0, mono=False):
    k = scale
    off = 512 * (1 - k)
    bgr = f'<rect width="1024" height="1024" fill="{bg}"/>' if bg else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 1024 1024">{bgr}'
            f'<g transform="translate({off} {off}) scale({k})"><g transform="translate(0 30)">{art(mono)}</g></g></svg>')

async def main():
    jobs = [
        ('icon.png', 1024, svg(1024, VERDE, 0.92), False),
        ('android-icon-foreground.png', 512, svg(512, None, 0.62), True),
        ('android-icon-background.png', 512, f'<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="{VERDE}"/></svg>', False),
        ('android-icon-monochrome.png', 432, svg(432, None, 0.62, True), True),
        ('splash-icon.png', 1024, svg(1024, None, 0.80), True),
        ('favicon.png', 48, svg(48, VERDE, 0.96), False),
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
