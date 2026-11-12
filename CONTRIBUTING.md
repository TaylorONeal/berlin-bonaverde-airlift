# Contributing

Thanks for keeping a Berlin alive. Pull requests and issues are welcome.

## Ground rules

1. **The protocol is sacred.** Checksums, the tag merge and the profile bytes must match what the machine expects. Any change there needs a passing golden test against the published card dumps in `app/src/protocol/__tests__/` and a written proof in `docs/NFC-PROTOCOL.md`.
2. **Simple wins.** One screen and sheets. If a change adds a step to making a card, it needs a very good reason.
3. **No network, no accounts, no tracking, no ads.** The app works offline forever. That is the point.
4. **No secrets or personal card dumps in git.** `personal/` is ignored on purpose.
5. **No em dashes in user-facing copy.** House style.

## Working on it

```bash
cd app
npm install
npm test          # protocol golden tests, must pass
npx expo run:android   # or run:ios, needs a dev build (NFC does not work in Expo Go)
```

Real reads and writes need a physical phone with NFC and blank Mifare Ultralight EV1 cards. Demo mode covers everything else.

## Reporting a bad card

Open an issue with: phone model and OS version, which drink you made, what the machine did, and (if you can) the card's pages from the app's Card details view. Remove nothing; there is nothing personal in a card.

By contributing you agree your contribution is licensed under the Apache License 2.0.
