# Store screenshots: Berlin Airlift (draft, 2026-11-12)

House style: bold, loud, very green. `verde` field with `verdePop` stickers, falling green beans, cream two-line headlines in Fraunces ExtraBold, a tilted phone running off the frame, an enlarged breakout of the real screen, one wood element per frame. The cargo plane and parachute pouch are the recurring mascot.

Rules (from the store-screenshot-sets skill and Apple 2.3.7): real captures only, nothing drawn inside a screen; no price words such as "free"; no rankings; no em dashes; no Bonaverde name, logo or photo in images. The brand stays in the description, where the compatibility statement and notice sit.

## Frames

| # | Headline | Capture (demo mode, iPhone for App Store, Pixel for Play) |
|---|---|---|
| 1 | Fresh coffee. / Airlifted. | Home just after a card is made: plane mid-drop, pouch on its parachute |
| 2 | One tap. / One card. | Home at rest: Write a card, "Full Pot. Reusable." |
| 3 | Hold it. / Done. | Done state: check, "Full Pot card ready." |
| 4 | Your beans. / Your roast. | Drink sheet, Medium Roast picked |
| 5 | Roast tonight. / Wake up brewed. | Drink sheet, Overnight picked, pause showing 10 h |
| 6 | No account. / No tracking. | More sheet, About block |
| 7 | Open source. / Made by owners. | More sheet, credits to VerdeNFC and hackaverde |
| 8 | Keep your Berlin / brewing. | What's on this card? result: "Your machine will take it. Reusable." |

Frames 1 to 3 carry the listing, so the top terms ("coffee", "card", "roast") sit in their plain words. Frame 7 changed from the plan's "Free. Open source. Forever." because store images can't use price words.

## Sizes

| Asset | Size |
|---|---|
| iPhone 6.9 inch | 1320 x 2868 |
| Play phone | 1080 x 1920 |
| Play feature graphic | 1024 x 500 (frame 1 art, wide) |

## How to capture (needs a dev build on real phones)

1. Install the dev build, open More, switch on Demo mode, so no real card is needed and the "Demo" tag can be cropped.
2. Clean status bar (Pixel: `demo.sh on`; iPhone: 9:41, full battery).
3. Take the eight screens above. iPhone captures go only in App Store frames, Pixel captures only in Play frames.
4. Add `set_berlinairlift.py` next to `engine.py` in the store-sets working copy on the Mac and render. Check every frame at full size and in the 30 percent strip.

Blocked here: this cloud session has no phone, emulator or browser renderer, so the captures and renders wait for the device test (BA-4).
