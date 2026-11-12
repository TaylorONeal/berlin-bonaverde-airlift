"""Store frames, round 2: one owner job per frame, each with its own layout.

python3 -I compose.py <work dir with cap/> <fraunces font dir> <out dir>

Frame 1 names the machine in full ("For Bonaverde Berlin owners") on a line under the
headline, never in the headline itself, so searchers know who it is for without a
third-party brand taking over the image.
"""
import sys, asyncio, random
from playwright.async_api import async_playwright

S, F, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
C = S + '/cap/'
VERDE, DEEP, POP, CREAM, PAPER, OAK, WALNUT, ESP, NIGHT, GREY = '#17703D', '#0F5A30', '#7BE495', '#F6EFE3', '#EADFCB', '#C99B66', '#5B3A26', '#2A1B12', '#0B2A1C', '#8C8A86'

# ---------- drawings (ours, never inside a screen) ----------

def machine(uid, steam=True, dull=False):
    """Curved woodgrain roast, grind and brew machine, drawn in the app's own style."""
    wood_a, wood_b = (OAK, WALNUT) if not dull else ('#A9A39C', '#77716B')
    bean_c = '#B7C98F' if not dull else '#B9B6B0'
    grain = ''.join(f'<path d="M{34+i*12} 340 C {20+i*12} 220, {60+i*10} 140, {40+i*14} 70" stroke="rgba(42,27,18,.16)" stroke-width="{2 + (i % 3)}" fill="none"/>' for i in range(12))
    st = ''
    if steam:
        st = ''.join(f'<path d="M{x} 250 C {x-10} 236, {x+10} 226, {x} 212 C {x-10} 200, {x+8} 192, {x} 180" stroke="{CREAM}" stroke-width="5" stroke-linecap="round" fill="none" opacity=".9"/>' for x in (88, 104, 120))
    beans = ''.join(f'<ellipse cx="{70+ (i*17) % 62}" cy="{60 + (i*7) % 22}" rx="5" ry="7" fill="{bean_c}" stroke="{WALNUT}" stroke-width="1.5" transform="rotate({(i*47)%180} {70+(i*17)%62} {60+(i*7)%22})"/>' for i in range(9))
    return f'''<svg viewBox="0 0 200 340" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="w{uid}" x1="0" x2="1"><stop offset="0" stop-color="{wood_a}"/><stop offset=".55" stop-color="{wood_a}"/><stop offset="1" stop-color="{wood_b}"/></linearGradient>
<clipPath id="c{uid}"><path d="M24 336 L24 120 C24 60, 176 60, 176 120 L176 336 Z"/></clipPath></defs>
<path d="M24 336 L24 120 C24 60, 176 60, 176 120 L176 336 Z" fill="url(#w{uid})"/>
<g clip-path="url(#c{uid})">{grain}</g>
<path d="M52 104 C52 30, 148 30, 148 104 Z" fill="rgba(246,239,227,.55)" stroke="{CREAM}" stroke-width="4"/>{beans}
<rect x="62" y="132" width="76" height="10" rx="5" fill="{ESP}" opacity=".7"/>
<circle cx="150" cy="168" r="11" fill="{VERDE if not dull else GREY}" stroke="{CREAM}" stroke-width="3"/>
<path d="M44 336 L44 232 C44 222, 52 214, 62 214 L138 214 C148 214, 156 222, 156 232 L156 336 Z" fill="{ESP}"/>
<path d="M74 326 L70 262 L130 262 L126 326 C126 330, 122 332, 118 332 L82 332 C78 332, 74 330, 74 326 Z" fill="rgba(246,239,227,.35)" stroke="{CREAM}" stroke-width="3"/>
{'' if dull else f'<path d="M73 290 L127 290 L126 326 C126 330 122 332 118 332 L82 332 C78 332 74 330 74 326 Z" fill="{WALNUT}"/>'}
{st}</svg>'''

def card(label=True, dull=False):
    coil = ''.join(f'<rect x="{(236 if label else 150)+i*8}" y="{(30 if label else 40)+i*8}" width="{(74 if label else 150)-i*16}" height="{(74 if label else 116)-i*16}" rx="12" fill="none" stroke="{OAK if not dull else GREY}" stroke-width="3"/>' for i in range(4))
    txt = (f'<text x="28" y="66" font-family="Inter" font-weight="800" font-size="22" fill="{VERDE}">THE ONE TO BUY</text>'
           f'<text x="28" y="118" font-family="F8" font-size="40" fill="{ESP}">MIFARE</text>'
           f'<text x="28" y="160" font-family="F8" font-size="30" fill="{ESP}">Ultralight EV1</text>'
           f'<text x="28" y="196" font-family="Inter" font-weight="700" font-size="18" fill="{WALNUT}">MF0UL11 · 13.56 MHz</text>') if label else ''
    chip = '' if label else f'<rect x="210" y="86" width="30" height="24" rx="4" fill="{VERDE if not dull else GREY}"/>'
    return f'''<svg viewBox="0 0 330 210" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="326" height="206" rx="22" fill="{CREAM if not dull else '#CFCBC4'}" stroke="{ESP}" stroke-width="4"/>{coil}{chip}{txt}</svg>'''

PLANE = f'''<svg viewBox="0 0 120 52"><path d="M8 24 C 8 16, 18 12, 34 12 L 92 12 C 104 12, 116 18, 116 26 C 116 32, 108 36, 96 36 L 26 36 C 14 36, 8 32, 8 24 Z" fill="{CREAM}"/><path d="M52 24 L 70 2 L 80 2 L 72 24 Z" fill="{OAK}"/><path d="M52 28 L 70 50 L 80 50 L 72 28 Z" fill="{WALNUT}"/><path d="M10 22 L 4 6 L 14 6 L 24 18 Z" fill="{OAK}"/><circle cx="98" cy="22" r="4" fill="{VERDE}"/><circle cx="86" cy="22" r="4" fill="{VERDE}"/></svg>'''
CHUTE = f'''<svg viewBox="0 0 64 70"><path d="M4 28 C 4 10, 18 2, 32 2 C 46 2, 60 10, 60 28 C 54 24, 48 24, 43 28 C 38 24, 26 24, 21 28 C 16 24, 10 24, 4 28 Z" fill="{POP}"/><g stroke="{CREAM}" stroke-width="1.4"><path d="M5 28 L 22 64"/><path d="M59 28 L 42 64"/><path d="M32 28 L 32 64"/></g></svg>'''
CHERRIES = ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}"/>' for x, y, r, c in [(60, 150, 22, '#B3261E'), (98, 140, 20, '#C9412F'), (80, 182, 21, '#8E1B16'), (196, 92, 18, '#B3261E'), (226, 70, 19, POP), (250, 96, 17, '#9BD77A')])
BRANCH = f'''<svg viewBox="0 0 300 220"><path d="M10 200 C 80 160, 160 140, 290 40" stroke="{WALNUT}" stroke-width="8" fill="none" stroke-linecap="round"/>
<path d="M150 130 C 170 190, 240 200, 270 170 C 240 140, 190 120, 150 130 Z" fill="{VERDE}"/><path d="M120 150 C 100 100, 40 70, 10 90 C 40 130, 80 155, 120 150 Z" fill="{DEEP}"/>{CHERRIES}</svg>'''

BOX = f'''<svg viewBox="0 0 260 220"><path d="M20 70 L130 100 L240 70 L240 190 L130 218 L20 190 Z" fill="#B98A57"/>
<path d="M130 100 L240 70 L240 190 L130 218 Z" fill="#A3774A"/><path d="M20 70 L130 100 L130 218 L20 190 Z" fill="#C99B66"/>
<path d="M20 70 L-4 34 L104 62 L130 100 Z" fill="#D9B485"/><path d="M240 70 L264 34 L156 62 L130 100 Z" fill="#B98A57"/>
<rect x="44" y="120" width="62" height="14" rx="3" fill="{CREAM}" opacity=".85" transform="rotate(14 75 127)"/></svg>'''

def bean(x, y, s, r, c):
    return f'<svg class="bean" style="left:{x}px;top:{y}px;width:{s}px;height:{s*1.35}px;transform:rotate({r}deg)" viewBox="0 0 40 54"><ellipse cx="20" cy="27" rx="18" ry="25" fill="{c}"/><path d="M20 4 C 12 18, 28 34, 20 50" stroke="rgba(0,0,0,.28)" stroke-width="3" fill="none"/></svg>'

# ---------- building blocks ----------

def phone(img, x, y, w, rot=0, shadow=True, frame=ESP):
    h = w * 852 / 393
    sh = f'box-shadow:0 {w*0.06}px {w*0.16}px rgba(0,0,0,.4);' if shadow else ''
    return (f'<div class="abs" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;transform:rotate({rot}deg);border-radius:{w*0.13}px;background:{frame};padding:{w*0.03}px;box-sizing:content-box;{sh}">'
            f'<div style="width:{w}px;height:{h}px;border-radius:{w*0.11}px;overflow:hidden;background:url(file://{C}{img}.png) top left/100% 100%"></div></div>')

def breakout(img, crop, x, y, w, rot=0, border=CREAM, radius=40):
    cx0, cy0, cx1, cy1 = crop
    k = w / (cx1 - cx0)
    h = (cy1 - cy0) * k
    return (f'<div class="abs" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;border-radius:{radius}px;overflow:hidden;transform:rotate({rot}deg);z-index:4;'
            f'box-shadow:0 30px 70px rgba(0,0,0,.35);border:{max(6, w*0.012)}px solid {border};'
            f'background:url(file://{C}{img}.png) {-cx0*k}px {-cy0*k}px/{393*k}px {852*k}px no-repeat"></div>')

def head(lines, x, y, size, fg, hi, width=None, align='left'):
    l1, l2 = lines
    w = f'width:{width}px;' if width else ''
    return f'<div class="hl abs" style="left:{x}px;top:{y}px;{w}font-size:{size}px;color:{fg};text-align:{align}">{l1}<span style="color:{hi}">{l2}</span></div>'

def sticker(t, x, y, size, bg, fg, rot):
    return f'<div class="st abs" style="left:{x}px;top:{y}px;font-size:{size}px;background:{bg};color:{fg};transform:rotate({rot}deg);padding:{size*0.32}px {size*0.62}px">{t}</div>'

def svgbox(svg, x, y, w, rot=0, extra=''):
    return f'<div class="abs svg" style="left:{x}px;top:{y}px;width:{w}px;transform:rotate({rot}deg);{extra}">{svg}</div>'

def fit(lines, base, W, k=1.62):
    """Headline size that keeps the longest line on one line."""
    longest = max(len(t) for t in lines)
    return min(base, W * k / longest)

def wrap(W, H, bg, body):
    return f'''<!doctype html><meta charset="utf-8"><style>
@font-face {{ font-family: F8; src: url(file://{F}/800ExtraBold/Fraunces_800ExtraBold.ttf); }}
html,body {{ margin:0; width:{W}px; height:{H}px; overflow:hidden; background:{bg}; position:relative; }}
.abs {{ position:absolute; }} .svg svg {{ width:100%; height:auto; display:block; }}
.hl {{ font-family:F8; line-height:1.0; letter-spacing:-0.02em; z-index:5; }} .hl span {{ display:block; }}
.st {{ border-radius:999px; font-family:Inter; font-weight:800; white-space:nowrap; z-index:6; box-shadow:0 10px 26px rgba(0,0,0,.22); }}
.body {{ font-family:Inter; font-weight:700; z-index:5; }}
.bean {{ position:absolute; }}
</style>{body}'''

def beans(rnd, W, H, n, cols, y0=0.0, y1=1.0, u=1.0):
    return ''.join(bean(rnd.uniform(-30, W - 30), rnd.uniform(H*y0, H*y1), rnd.uniform(38, 84) * u, rnd.uniform(0, 360), cols[rnd.randrange(len(cols))]) for _ in range(n))

# ---------- the eight jobs ----------

def f1_owner(W, H):
    """Job: 'I own this machine, will this keep it going?' Airdrop onto the machine."""
    u, tall = W / 1320, H / W > 2
    rnd = random.Random(1)
    l1, l2 = ('Own a Berlin', 'coffee machine?')
    lines = (f'{l1}<br>{l2}', 'Keep it brewing.')
    hs = fit((l1, l2, 'Keep it brewing.'), 175 * u, W)
    mw = W * (0.62 if tall else 0.44)
    my = H - mw * 340 / 200 + mw * 0.02
    pw = W * (0.44 if tall else 0.30)
    top = max(H * 0.05 + hs * 3.2, my - W * 0.40)
    body = beans(rnd, W, H, 10, [DEEP, POP, OAK], 0.25, 0.95, u)
    body += head(lines, W*0.06, H*0.05, hs, CREAM, POP, W*0.92)
    body += f'<div class="abs" style="left:{W*0.08}px;top:{top + W*0.06}px;width:{W*0.50}px;height:{6*u}px;border-radius:99px;background:repeating-linear-gradient(90deg,{CREAM} 0 {30*u}px,transparent {30*u}px {54*u}px);opacity:.7"></div>'
    body += svgbox(PLANE, W*0.60, top, W*0.30, -6)
    body += svgbox(CHUTE, W*0.56, top + W*0.13, W*0.12)
    body += svgbox(card(False), W*0.565, top + W*0.24, W*0.10, 8)
    body += svgbox(machine('m1'), W*0.42, my, mw)
    body += phone('home', W*0.06, my + mw*0.12, pw, -6)
    body += f'<div class="body abs" style="left:{W*0.06}px;top:{H*0.05 + hs*3.18}px;font-size:{64*u}px;color:{CREAM}">For <b style="color:{POP}">Bonaverde Berlin</b> owners</div>'
    return wrap(W, H, VERDE, body)

def f2_again(W, H):
    """Job: 'my cards ran out and the company is gone'. Before and after split."""
    u, tall = W / 1320, H / W > 2
    mid = H * 0.48
    mw = W * (0.34 if tall else 0.24)
    hs = fit(('Out of cards?', 'Brewing again.'), 165 * u, W)
    body = f'<div class="abs" style="left:0;top:0;width:{W}px;height:{mid}px;background:#3A3936"></div>'
    body += f'<div class="abs" style="left:-5%;top:{mid - 8*u}px;width:110%;height:{18*u}px;background:{CREAM};transform:rotate(-3deg);z-index:3"></div>'
    body += f'<div class="hl abs" style="left:{W*0.06}px;top:{H*0.045}px;font-size:{hs}px;color:#D9D6D0">Out of cards?</div>'
    body += svgbox(machine('d', steam=False, dull=True), W*0.58, mid - mw*340/200 - H*0.01, mw)
    cy = H*0.045 + hs*1.5
    body += svgbox(card(False, dull=True), W*0.08, cy, W*0.34, -12, 'opacity:.85')
    body += sticker('Last card used up', W*0.06, cy + W*0.28, 50*u, '#D9D6D0', '#3A3936', -3)
    body += f'<div class="hl abs" style="left:{W*0.06}px;top:{H - H*0.045 - hs}px;font-size:{hs}px;color:{POP}">Brewing again.</div>'
    pw = W * (0.36 if tall else 0.25)
    body += phone('done', W*0.54, mid + H*0.05, pw, 6)
    body += svgbox(machine('a'), W*0.08, mid + H*0.07, mw * 1.15)
    body += sticker('New card, fresh pot', W*0.06, mid + H*0.025, 50*u, POP, ESP, 3)
    return wrap(W, H, VERDE, body)

def f3_tap(W, H):
    """Job: 'make my usual pot without thinking'. Straight phone, giant button."""
    u, tall = W / 1320, H / W > 2
    hs = fit(('Your usual pot.', 'One tap.'), 175 * u, W)
    pw = W * (0.62 if tall else 0.44)
    px = (W - pw) / 2 - pw * 0.03
    py = H * 0.05 + hs * 2.3
    body = f'<div class="abs" style="left:{-W*0.3}px;top:{H*0.55}px;width:{W*1.6}px;height:{W*1.6}px;border-radius:50%;background:{VERDE};opacity:.18"></div>'
    body += head(('Your usual pot.', 'One tap.'), 0, H*0.05, hs, ESP, VERDE, W, 'center')
    body += phone('home', px, py, pw, 0)
    k = pw / 393
    bx, by = W*0.04, py + 560*k
    body += breakout('home', (12, 588, 381, 760), bx, by, W*0.92, -3, CREAM, 60*u)
    for i, r in enumerate((80, 140, 200)):
        body += f'<div class="abs" style="z-index:6;left:{W*0.62 - r*u}px;top:{by + 150*u - r*u}px;width:{2*r*u}px;height:{2*r*u}px;border-radius:50%;border:{8*u}px solid {ESP};opacity:{0.55 - i*0.15}"></div>'
    body += sticker('Full Pot', W*0.68, py - 30*u, 56*u, ESP, POP, 6)
    return wrap(W, H, POP, body)

def f4_card(W, H):
    """Job: 'where do I get cards now?' Buy one online, program it, it's ready."""
    u, tall = W / 1320, H / W > 2
    lines = ('Buy a card online.', 'Program it. Brew.')
    hs = fit(lines, 150 * u, W)
    body = f'<div class="abs" style="left:{W*0.35}px;top:{H*0.30}px;width:{W*1.1}px;height:{W*1.1}px;border-radius:50%;background:{POP};opacity:.35"></div>'
    body += head(lines, W*0.06, H*0.05, hs, ESP, VERDE, W*0.92)
    top = H*0.05 + hs*2.6
    bw = W * (0.46 if tall else 0.30)
    body += svgbox(BOX, W*0.05, top + H*0.02, bw, -4)
    for k in range(3):
        body += svgbox(card(False), W*0.10 + k*bw*0.16, top - bw*0.02 + k*bw*0.03, bw*0.46, -20 + k*12, 'z-index:2')
    body += sticker('Ships blank', W*0.06, top + bw*0.90, 48*u, OAK, ESP, -4)
    cw = W * (0.70 if tall else 0.50)
    cy = top + bw * (1.55 if tall else 1.05)
    cx = W*0.06
    ch = cw * 210 / 330
    rot = -7
    body += svgbox(card(False), cx, cy, cw, rot, 'filter:drop-shadow(0 30px 40px rgba(0,0,0,.28));z-index:3')
    pw = W * (0.52 if tall else 0.31)
    px, py = (W*0.56, cy - W*0.50) if tall else (W*0.54, cy - H*0.10)
    body += phone('drink', px, py, pw, 9)
    # tap rings centred on the card's chip (225, 98 in the card's 330 x 210 box), after the card's rotation
    import math
    dx, dy = (225/330 - 0.5) * cw, (98/210 - 0.5) * ch
    a = math.radians(rot)
    tx = cx + cw/2 + dx*math.cos(a) - dy*math.sin(a)
    ty = cy + ch/2 + dx*math.sin(a) + dy*math.cos(a)
    for k, r in enumerate((60, 110, 160)):
        body += f'<div class="abs" style="z-index:6;left:{tx - r*u}px;top:{ty - r*u}px;width:{2*r*u}px;height:{2*r*u}px;border-radius:50%;border:{8*u}px solid {VERDE};opacity:{0.7 - k*0.2}"></div>'
    if tall:
        body += beans(random.Random(4), W, H, 7, [VERDE, OAK, DEEP], 0.84, 0.97, u)
    body += sticker('✓ Ready to use', cx + cw*0.02, cy + ch + (H*0.05 if tall else H*0.03), 70*u, VERDE, CREAM, -3)
    return wrap(W, H, CREAM, body)

def f5_night(W, H):
    """Job: 'coffee ready when I wake up'. Night top, sunrise bottom, on a diagonal."""
    u, tall = W / 1320, H / W > 2
    rnd = random.Random(5)
    hs = fit(('Roast tonight.', 'Wake up to coffee.'), 150 * u, W)
    body = f'<div class="abs" style="inset:0;background:linear-gradient(172deg,{NIGHT} 0 47%,{OAK} 47.2%,#F2C58A 82%,{CREAM} 100%)"></div>'
    body += ''.join(f'<div class="abs" style="left:{rnd.uniform(0,W)}px;top:{rnd.uniform(H*0.14,H*0.42)}px;width:{9*u}px;height:{9*u}px;border-radius:50%;background:{POP};opacity:.8"></div>' for _ in range(22))
    body += f'<div class="abs" style="left:{W*0.76}px;top:{H*0.15}px;width:{150*u}px;height:{150*u}px;border-radius:50%;box-shadow:inset {-40*u}px {-12*u}px 0 0 {CREAM}"></div>'
    body += f'<div class="hl abs" style="left:{W*0.06}px;top:{H*0.045}px;font-size:{hs}px;color:{CREAM}">Roast tonight.</div>'
    body += f'<div class="abs" style="left:{W*0.62}px;top:{H*0.70}px;width:{300*u}px;height:{300*u}px;border-radius:50%;background:#FFD27A;opacity:.85"></div>'
    body += f'<div class="hl abs" style="left:{W*0.06}px;top:{H - H*0.045 - hs}px;font-size:{hs}px;color:{ESP}">Wake up to coffee.</div>'
    pw = W * (0.48 if tall else 0.33)
    body += phone('drink-overnight', W*0.08, H*0.045 + hs*1.5, pw, -7)
    body += breakout('drink-pause', (16, 630, 377, 800), W*0.30, H*(0.56 if tall else 0.54), W*0.66, 4, CREAM, 40*u)
    body += sticker('Up to 24 h', W*0.66, H*0.38, 56*u, POP, ESP, -6)
    return wrap(W, H, NIGHT, body)

def f6_copy(W, H):
    """Job: 'I'm down to my last original card'. Read it, copy it."""
    u, tall = W / 1320, H / W > 2
    hs = fit(('Down to your last card?', 'Copy it.'), 160 * u, W)
    body = head(('Down to your last card?', 'Copy it.'), W*0.06, H*0.05, hs, CREAM, POP, W*0.92)
    cy = H*0.05 + hs*2.5
    cw = W * 0.28
    body += svgbox(card(False), W*0.03, cy + H*0.06, cw, -12)
    body += sticker('Your last one', W*0.03, cy, 46*u, OAK, ESP, -6)
    pw = W * (0.40 if tall else 0.28)
    px = W * 0.5 - pw / 2
    body += phone('read', px, cy, pw, 0)
    for i in range(3):
        body += svgbox(card(False), W*0.69 + i*14*u, cy + H*0.12 + i*26*u, cw, 10 - i*5)
    body += sticker('Fresh copies', W*0.62, cy + H*0.07, 46*u, POP, ESP, 5)
    arrow = lambda x, y, r: f'<div class="body abs" style="left:{x}px;top:{y}px;font-size:{120*u}px;color:{POP};transform:rotate({r}deg);z-index:7">→</div>'
    body += breakout('read', (14, 400, 379, 652), W*0.06, min(H*0.70, H*0.96 - 252*W*0.88/365), W*0.88, -2, POP, 40*u)
    return wrap(W, H, ESP, body)

def f7_growers(W, H):
    """Feeling: love for the coffee and the people who grow it. Woodgrain, type first."""
    u, tall = W / 1320, H / W > 2
    hs = fit(('Roasted fresh.', 'Grown with care.'), 150 * u, W * 0.88)
    wood = (f'background:repeating-radial-gradient(ellipse at 20% 130%, {OAK} 0 {26*u}px, #B9894F {26*u}px {32*u}px, {OAK} {32*u}px {58*u}px)')
    body = f'<div class="abs" style="inset:0;{wood}"></div>'
    body += f'<div class="abs" style="left:{W*0.05}px;top:{H*0.035}px;width:{W*0.90}px;height:{H*0.93}px;border-radius:{80*u}px;background:{CREAM}"></div>'
    body += head(('Roasted fresh.', 'Grown with care.'), W*0.11, H*0.08, hs, ESP, VERDE, W*0.8)
    body += svgbox(BRANCH, W*0.12, H*0.08 + hs*2.3, W*0.76)
    fs = 80 * u if tall else 50 * u
    body += (f'<div class="hl abs" style="left:{W*0.11}px;top:{H*0.08 + hs*2.3 + W*(0.66 if tall else 0.6)}px;width:{W*0.76}px;font-size:{fs}px;line-height:1.2;color:{WALNUT}">'
             f'We love the growers, especially the small co-ops in places like Guatemala who do the hardest part.</div>')
    body += sticker('Made by owners, for owners', W*0.11, H*0.86, 50*u, VERDE, CREAM, -3)
    return wrap(W, H, OAK, body)

def f8_privacy(W, H):
    """Feeling: no catch. A stacked manifesto with the phone peeking in."""
    u, tall = W / 1320, H / W > 2
    lines = [('No account.', ESP), ('No ads.', ESP), ('No tracking.', ESP), ('Just coffee.', VERDE)]
    fs = fit(('No tracking.',), 190 * u, W, 1.5)
    body = ''
    for i, (t, c) in enumerate(lines):
        body += f'<div class="hl abs" style="left:{W*0.06}px;top:{H*0.045 + i*fs*1.04}px;font-size:{fs}px;color:{c}">{t}</div>'
    pw = W * (0.56 if tall else 0.40)
    py = H*0.045 + fs*4.3
    body += phone('more-open', W*0.42, py, pw, 8)
    body += sticker('Open source', W*0.05, py + H*0.08, 58*u, ESP, POP, -6)
    body += sticker('Stays on your phone', W*0.05, py + H*0.16, 50*u, VERDE, CREAM, 3)
    return wrap(W, H, PAPER, body)

FRAMES = [f1_owner, f2_again, f3_tap, f4_card, f5_night, f6_copy, f7_growers, f8_privacy]

def feature(W=1024, H=500):
    body = f'<div class="hl abs" style="left:56px;top:110px;font-size:80px;color:{CREAM}">Own a Berlin?<span style="color:{POP}">Keep it brewing.</span></div>'
    body += f'<div class="body abs" style="left:60px;top:290px;font-size:30px;color:{CREAM}">For <b style="color:{POP}">Bonaverde Berlin</b> owners</div>'
    body += sticker('Coffee card writer and reader', 60, 350, 28, ESP, CREAM, -2)
    body += svgbox(PLANE, 640, 30, 200, -6) + svgbox(CHUTE, 640, 100, 64) + svgbox(card(False), 642, 160, 56, 8)
    body += svgbox(machine('fg'), 800, 150, 190)
    return wrap(W, H, VERDE, body)

async def main():
    sizes = {'apple': (1320, 2868), 'google': (1080, 1920)}
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/tmp/chromium', args=['--no-sandbox', '--single-process', '--no-zygote', '--disable-gpu', '--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': 1320, 'height': 2868})
        async def shot(html, path):
            open(S + '/frame.html', 'w').write(html)
            await pg.goto('file://' + S + '/frame.html'); await pg.wait_for_timeout(400)
            await pg.screenshot(path=path)
        for store, (W, H) in sizes.items():
            await pg.set_viewport_size({'width': W, 'height': H})
            for i, fn in enumerate(FRAMES):
                await shot(fn(W, H), f'{OUT}/{store}/{i+1:02d}-{W}x{H}.png')
        await pg.set_viewport_size({'width': 1024, 'height': 500})
        await shot(feature(), f'{OUT}/google/feature-graphic-1024x500.png')
        await b.close()

asyncio.run(main())
