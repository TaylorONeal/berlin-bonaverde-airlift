This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed, do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt: an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add, resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation

- One screen on purpose: `src/screens/Home.tsx`, with sheets (drinks, what's on this card, help, more) that slide over it. There is no router. Don't add one unless the app truly grows past one screen.

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`), no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand: configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Berlin Airlift specifics

- Card bytes live in `src/protocol/`. Never change the math without the golden tests in `src/protocol/__tests__/` and `python3 tools/verify_checksums.py` both passing.
- Write only pages 4 to 15. Always keep the destination card's bytes 0 to 15.
- NFC needs a dev build (`expo-dev-client`); it does not work in Expo Go.
- If `npx expo install` can't reach api.expo.dev (offline or sandboxed), pin versions from `node_modules/expo/bundledNativeModules.json` instead.
- Demo mode is for development, the web preview and review builds only. Store builds hide it (`src/config.ts`, `EXPO_PUBLIC_DEMO=1` to keep it).
- Help text lives in `src/content/help.ts`. The card-buying advice there must match `docs/CARDS.md` and the README.
- About text (story, thanks, open-source note, trademark notice) lives in `src/content/about.ts`. Keep it in step with the README "Why it exists" and "Credits" sections and `docs/CREDITS.md`.
- Copy rules: plain words a non-technical owner understands ("Write a card", not "program a tag"), no em dashes, never call the app AI-powered, keep the trademark notice.
