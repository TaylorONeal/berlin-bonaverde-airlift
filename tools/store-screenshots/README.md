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

Rules the frames follow: real app screens only, nothing drawn inside a screen except covers that hide a third-party brand name, no price words, no brand names or logos, no em dashes, one idea per frame.
