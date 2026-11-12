import sys, asyncio, random, json
from playwright.async_api import async_playwright
S, F, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
C = S + '/cap/'
VERDE, DEEP, POP, CREAM, PAPER, OAK, WALNUT, ESP = '#17703D','#0F5A30','#7BE495','#F6EFE3','#EADFCB','#C99B66','#5B3A26','#2A1B12'

# one idea per frame: headline, screen, breakout crop (css px of the 393x852 capture), colours, stickers, covers
FRAMES = [
 dict(h=('Fresh coffee.','Airlifted.'), img='drop07', crop=(0,205,393,525), bg=VERDE, fg=CREAM, hi=POP, plane=True,
      stickers=[('Roast','-8',POP,ESP,(0.70,0.25)),('Grind','6',CREAM,ESP,(0.08,0.52)),('Brew','-4',OAK,ESP,(0.76,0.60))]),
 dict(h=('One tap.','One card.'), img='home', crop=(0,590,393,780), byf=0.44, bg=POP, fg=ESP, hi=VERDE,
      cover=(16,470,361,100,'Pick a drink. Tap. Done.'),
      stickers=[('Full Pot','7',VERDE,CREAM,(0.70,0.27)),('NFC','-10',ESP,POP,(0.07,0.55))]),
 dict(h=('Hold it.','Done.'), img='done', crop=(20,300,373,560), bg=ESP, fg=CREAM, hi=POP,
      stickers=[('Card ready','-7',POP,ESP,(0.66,0.26)),('Reusable','5',OAK,ESP,(0.06,0.58))]),
 dict(h=('Your beans.','Your roast.'), img='drink-medium', crop=(0,440,393,620), bg=OAK, fg=ESP, hi=CREAM,
      stickers=[('Light','8',CREAM,ESP,(0.72,0.26)),('Medium','-6',VERDE,CREAM,(0.05,0.50)),('Dark','5',ESP,CREAM,(0.78,0.62))]),
 dict(h=('Roast tonight.','Wake up brewed.'), img='drink-overnight', crop=(0,630,393,800), crop_img='drink-pause', bg=DEEP, fg=CREAM, hi=POP, night=True,
      stickers=[('Up to 24 h','-6',POP,ESP,(0.68,0.27))]),
 dict(h=('No account.','No tracking.'), img='more', crop=(0,380,393,625), crop_img='more-open', bg=CREAM, fg=ESP, hi=VERDE,
      stickers=[('No ads','-8',VERDE,CREAM,(0.70,0.26)),('On your phone','6',POP,ESP,(0.05,0.94))]),
 dict(h=('Made by owners.','Love the growers.'), img='more-about', crop=(0,620,393,760), bg=VERDE, fg=CREAM, hi=POP,
      stickers=[('Open source','7',POP,ESP,(0.66,0.27)),('Small co-ops','-6',OAK,ESP,(0.58,0.84))]),
 dict(h=('Check any card.','Copy the good ones.'), img='read', crop=(10,400,383,580), bg=POP, fg=ESP, hi=VERDE,
      stickers=[('Will it work?','-7',ESP,POP,(0.62,0.27))]),
]

def bean(x, y, s, r, c):
    return f'<svg class="bean" style="left:{x}px;top:{y}px;width:{s}px;height:{s*1.35}px;transform:rotate({r}deg)" viewBox="0 0 40 54"><ellipse cx="20" cy="27" rx="18" ry="25" fill="{c}"/><path d="M20 4 C 12 18, 28 34, 20 50" stroke="rgba(0,0,0,.28)" stroke-width="3" fill="none"/></svg>'

PLANE = f'''<svg viewBox="0 0 120 52"><path d="M8 24 C 8 16, 18 12, 34 12 L 92 12 C 104 12, 116 18, 116 26 C 116 32, 108 36, 96 36 L 26 36 C 14 36, 8 32, 8 24 Z" fill="{CREAM}"/><path d="M52 24 L 70 2 L 80 2 L 72 24 Z" fill="{OAK}"/><path d="M52 28 L 70 50 L 80 50 L 72 28 Z" fill="{WALNUT}"/><path d="M10 22 L 4 6 L 14 6 L 24 18 Z" fill="{OAK}"/><circle cx="98" cy="22" r="4" fill="{VERDE}"/><circle cx="86" cy="22" r="4" fill="{VERDE}"/></svg>'''
POUCH = f'''<svg viewBox="0 0 64 92"><path d="M4 28 C 4 10, 18 2, 32 2 C 46 2, 60 10, 60 28 C 54 24, 48 24, 43 28 C 38 24, 26 24, 21 28 C 16 24, 10 24, 4 28 Z" fill="{POP}"/><g stroke="{CREAM}" stroke-width="1.4"><path d="M5 28 L 22 58"/><path d="M59 28 L 42 58"/><path d="M32 28 L 32 58"/></g><path d="M18 58 L 46 58 L 50 88 C 50 90, 48 91, 46 91 L 18 91 C 16 91, 14 90, 14 88 Z" fill="{OAK}"/><rect x="22" y="66" width="20" height="12" rx="6" fill="{VERDE}"/><circle cx="28" cy="72" r="2" fill="{POP}"/><circle cx="36" cy="72" r="2" fill="{POP}"/></svg>'''

def page(fr, W, H, idx):
    u = W / 1320  # unit scale
    rnd = random.Random(idx * 7 + W)
    pw = W * (0.74 if H / W > 2 else 0.64)
    ph = pw * 852 / 393
    px = (W - pw) / 2 + W * 0.04
    py = H * (0.30 if H / W > 2 else 0.34)
    rot = -5 if idx % 2 == 0 else 5
    hs = 150 * u if H / W > 2 else 128 * u
    longest = max(len(t) for t in fr['h'])
    if longest > 14: hs = hs * 14 / longest
    beans = ''.join(bean(rnd.uniform(-20, W - 40), rnd.uniform(H*0.22, H*0.97), rnd.uniform(40, 90) * u, rnd.uniform(0, 360),
                         [DEEP, VERDE, POP, OAK][rnd.randrange(4)] if fr['bg'] != VERDE else [DEEP, POP, OAK][rnd.randrange(3)]) for _ in range(14))
    cx0, cy0, cx1, cy1 = fr['crop']
    cimg = fr.get('crop_img', fr['img'])
    bw = W * 0.86
    bscale = bw / (cx1 - cx0)
    bh = (cy1 - cy0) * bscale
    by = min(py + ph * fr.get('byf', 0.36), H - bh - H * 0.05)
    stickers = ''.join(
        f'<div class="st" style="left:{sx*W}px;top:{sy*H}px;transform:rotate({r}deg);background:{b};color:{c};font-size:{58*u}px;padding:{18*u}px {36*u}px">{t}</div>'
        for t, r, b, c, (sx, sy) in fr['stickers'])
    cover = ''
    if fr.get('cover'):
        x, y, w, h, t = fr['cover']
        k = pw / 393
        cover = f'<div class="cover" style="left:{x*k}px;top:{y*k}px;width:{w*k}px;height:{h*k}px;font-size:{22*k}px">{t}</div>'
    plane = ''
    if fr.get('plane'):
        plane = (f'<div class="plane" style="left:{W*0.50}px;top:{H*0.205}px;width:{300*u}px">{PLANE}</div>'
                 f'<div class="pouch" style="left:{W*0.30}px;top:{H*0.235}px;width:{150*u}px">{POUCH}</div>'
                 f'<div class="trail" style="left:{W*0.08}px;top:{H*0.228}px;width:{W*0.40}px;height:{6*u}px"></div>')
    night = ''
    if fr.get('night'):
        night = ''.join(f'<div class="star" style="left:{rnd.uniform(0,W)}px;top:{rnd.uniform(H*0.17,H*0.30)}px;width:{10*u}px;height:{10*u}px"></div>' for _ in range(16))
        night += f'<div class="moon" style="left:{W*0.74}px;top:{H*0.19}px;width:{150*u}px;height:{150*u}px;box-shadow:inset {-36*u}px {-10*u}px 0 0 {CREAM}"></div>'
    h1, h2 = fr['h']
    return f'''<!doctype html><meta charset="utf-8"><style>
@font-face {{ font-family: F8; src: url(file://{F}/800ExtraBold/Fraunces_800ExtraBold.ttf); }}
html,body {{ margin:0; width:{W}px; height:{H}px; overflow:hidden; background:{fr['bg']}; }}
.hl {{ position:absolute; z-index:5; left:{W*0.07}px; right:{W*0.05}px; top:{H*0.045}px; font-family:F8; font-size:{hs}px; line-height:1.0; color:{fr['fg']}; letter-spacing:-0.02em; }}
.hl span {{ color:{fr['hi']}; display:block; }}
.bean {{ position:absolute; }}
.phone {{ position:absolute; left:{px}px; top:{py}px; width:{pw}px; height:{ph}px; transform:rotate({rot}deg); border-radius:{pw*0.13}px; background:{ESP}; padding:{pw*0.03}px; box-sizing:content-box; box-shadow:0 {40*u}px {90*u}px rgba(0,0,0,.38); }}
.screen {{ position:relative; width:{pw}px; height:{ph}px; border-radius:{pw*0.11}px; overflow:hidden; background:url(file://{C}{fr['img']}.png) top left/100% 100%; }}
.cover {{ position:absolute; border-radius:999px; background:{VERDE}; color:{CREAM}; display:flex; align-items:center; justify-content:center; font-family:Inter; font-weight:800; transform:rotate(-2deg); }}
.brk {{ position:absolute; left:{(W-bw)/2}px; top:{by}px; width:{bw}px; height:{bh}px; border-radius:{44*u}px; overflow:hidden; transform:rotate({-rot*0.6}deg); box-shadow:0 {30*u}px {70*u}px rgba(0,0,0,.35); border:{10*u}px solid {CREAM};
  background:url(file://{C}{cimg}.png) {-cx0*bscale}px {-cy0*bscale}px/{393*bscale}px {852*bscale}px no-repeat; }}
.st {{ position:absolute; z-index:6; border-radius:999px; font-family:Inter; font-weight:800; white-space:nowrap; box-shadow:0 {12*u}px {30*u}px rgba(0,0,0,.25); }}
.plane,.pouch {{ position:absolute; }} .plane svg,.pouch svg {{ width:100%; height:auto; display:block; }}
.trail {{ position:absolute; border-radius:99px; background:repeating-linear-gradient(90deg,{CREAM} 0 {30*u}px,transparent {30*u}px {54*u}px); opacity:.7; }}
.star {{ position:absolute; border-radius:50%; background:{POP}; }}
.moon {{ position:absolute; border-radius:50%; }}
</style>
{night}{beans}
<div class="hl">{h1}<span>{h2}</span></div>
{plane}
<div class="phone"><div class="screen">{cover}</div></div>
<div class="brk"></div>
{stickers}'''

async def main():
    sizes = {'apple': (1320, 2868), 'google': (1080, 1920)}
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/tmp/chromium', args=['--no-sandbox','--single-process','--no-zygote','--disable-gpu','--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': 1320, 'height': 2868})
        for store, (W, H) in sizes.items():
            await pg.set_viewport_size({'width': W, 'height': H})
            for i, fr in enumerate(FRAMES):
                path = f'{S}/frame.html'
                open(path, 'w').write(page(fr, W, H, i))
                await pg.goto('file://' + path); await pg.wait_for_timeout(500)
                await pg.screenshot(path=f'{OUT}/{store}/{i+1:02d}-{W}x{H}.png')
        await pg.set_viewport_size({'width': 1024, 'height': 500})
        rnd = random.Random(3)
        beans = ''.join(bean(rnd.uniform(0, 1000), rnd.uniform(0, 480), rnd.uniform(26, 48), rnd.uniform(0, 360), [DEEP, POP, OAK][rnd.randrange(3)]) for _ in range(12))
        html = f'''<!doctype html><meta charset="utf-8"><style>
@font-face {{ font-family: F8; src: url(file://{F}/800ExtraBold/Fraunces_800ExtraBold.ttf); }}
html,body {{ margin:0; width:1024px; height:500px; overflow:hidden; background:{VERDE}; }}
.bean {{ position:absolute; }}
.hl {{ position:absolute; left:64px; top:118px; font-family:F8; font-size:98px; line-height:1.0; color:{CREAM}; letter-spacing:-0.02em; z-index:3 }}
.hl span {{ color:{POP}; display:block; }}
.sub {{ position:absolute; left:68px; top:338px; font-family:Inter; font-weight:800; font-size:30px; color:{CREAM}; background:{ESP}; border-radius:999px; padding:12px 26px; transform:rotate(-2deg); z-index:3 }}
.plane {{ position:absolute; left:640px; top:70px; width:300px; transform:rotate(-6deg) }} .pouch {{ position:absolute; left:760px; top:200px; width:150px }}
.plane svg,.pouch svg {{ width:100%; height:auto; display:block }}
.trail {{ position:absolute; left:520px; top:150px; width:120px; height:6px; border-radius:99px; background:repeating-linear-gradient(90deg,{CREAM} 0 30px,transparent 30px 54px); opacity:.7 }}
</style>{beans}<div class="hl">Fresh coffee.<span>Airlifted.</span></div><div class="sub">Coffee card writer and reader</div>
<div class="plane">{PLANE}</div><div class="pouch">{POUCH}</div>'''
        open(S + '/fg.html', 'w').write(html)
        await pg.goto('file://' + S + '/fg.html'); await pg.wait_for_timeout(500)
        await pg.screenshot(path=f'{OUT}/google/feature-graphic-1024x500.png')
        await b.close()
asyncio.run(main())
