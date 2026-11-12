# Store screenshot drafts

Renders the eight store frames and the Play feature graphic from the app's web build. These are drafts: once real-phone captures exist, swap them into `cap/` with the same file names and render again.

Needs Python Playwright and a Chromium binary at `/tmp/chromium` (any Chromium works; change `executable_path`).

```bash
W=/tmp/shots                                  # any work folder
cd app && npx expo export --platform web --output-dir $W/web && cd ..
mkdir -p $W/preview $W/cap
# build_preview.py inlines the bundle and fonts into $W/preview/index.html, using an
# existing index.html in that folder as the page shell (the demo artifact's shell).
python3 -I tools/store-screenshots/build_preview.py $W
python3 -I tools/store-screenshots/capture.py $W          # screens at 393x852 @3x
python3 -I tools/store-screenshots/capture_pause.py $W    # drink sheet scrolled to the pause
python3 -I tools/store-screenshots/compose.py $W app/node_modules/@expo-google-fonts/fraunces store/screenshots
```

Rules the frames follow:

- One owner job per frame, said as the owner would say it ("Out of cards?"), and the payoff as the second line ("Brewing again.").
- Every frame gets its own layout. If two frames would share a composition, change one. The headline position, the phone's angle and size, and the colour block all vary.
- At least one frame shows the before and after; at least one shows no phone at all.
- Frame 1 says who the app is for. This app only helps people who own the machine.
- Real app screens only, nothing drawn inside a screen. Drawings (machine, cards, plane) sit outside screens.
- No price words in headlines, no em dashes.
- Name a third-party brand only in a smaller line under a headline, never in the headline itself.
- Sell the payoff, not the instructions: detail like which card to buy belongs in the app's Help.
