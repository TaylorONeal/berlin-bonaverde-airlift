# Handoff: Berlin Airlift store launch

Written Nov 12, 2026, so a fresh session can pick this up from this file alone.
Private details (account names, ids, console pages) are in private notes kept outside the repo. Ask the maintainer for them before any store or CI step.

## What this is

Berlin Airlift is a free, open-source app (Apache 2.0) for owners of the Bonaverde Berlin coffee machine. It writes and reads the NFC coffee cards the machine uses, so owners can keep brewing after the company closed. Expo / React Native for iOS and Android, package and bundle id `com.berlinairlift.app`. The app collects nothing and makes no network calls in store builds.

## Done

- App: Home, Write a card, What's on this card?, Help (names the card to buy: MIFARE Ultralight EV1), About, demo mode for dev and web only. Protocol in `app/src/protocol/`, checked against 66 known cards. `tsc` clean, jest passing.
- Docs: README for owners, STORY, FAQ, CARDS (buying guide), NFC-PROTOCOL, DESIGN-SYSTEM, UX-SPEC, PRIVACY ("collects nothing").
- Icon: coffee bean on a green parachute, dark glow. Source in `tools/app-icon/make_icons.py`.
- Store kit in `store/`: listing text for both stores, privacy answers, review notes, 8 screenshot frames per store plus a Play feature graphic (`tools/store-screenshots`). ASO notes in `docs/gtm/aso-2026-11-12.md`.
- CI: `codemagic.yaml` has `ios-release` (TestFlight) and `android-release` (Play internal track, draft). Both run on `v*` tags or a manual start, and neither submits for review.
- Apple: bundle id registered with NFC Tag Reading. App Store Connect record "Berlin Airlift for Bonaverde", version 1.0 in Prepare for Submission. Its id is set in `codemagic.yaml`.
- Google Play: app created. Store listing (text, icon, feature graphic, 8 screenshots) saved. App content all done: privacy policy, no ads, no sign-in, 18+, Data safety (no data), content rating (rated 3+), Advertising ID No, Government No, Financial and Health No, trader status set. Category Food & Drink. The dashboard setup checklist is complete.

## Open

1. **Play service account access (maintainer).** Give the existing Play publishing service account these app permissions for Berlin Airlift: Edit and delete draft apps, Release apps to testing tracks, Manage testing tracks and edit tester lists, Manage store presence. No production or financial permissions. An agent's attempt was blocked by a safety check, so a person has to tick these.
2. **Codemagic secret (maintainer).** In the Codemagic app for this repo, under Environment variables, add `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` (Secret, group `google_play`) holding that service account's JSON key. The group already exists and the value is empty.
3. **First Android build.** Run `android-release` once the two steps above are done. The maintainer must okay the cost first. Linux X2 costs $0.045 a minute (codemagic.io/pricing, Nov 12, 2026) and the build is capped at 45 minutes, so it costs about $1 and at most about $2. It uploads a draft release to the internal track.
4. **First iOS build.** Run `ios-release` (Mac mini M2, 60 minute cap, usually covered by the account's free macOS minutes). Okay the cost first. This also puts the new icon on App Store Connect.
5. **Real device test.** Write and read a blank MIFARE Ultralight EV1 card on a real phone and brew with it. The app can't yet tell a blank NTAG from a blank EV1, so a chip check via GET_VERSION waits until the bytes are confirmed on a device.
6. **Real screenshots and review video.** The current frames come from the web preview. Replace them with real device captures, and record an App Review video of a card write.
7. **Submit for review.** Play "Send for review" and App Store "Submit for Review" are the maintainer's own clicks, never an agent's.

## Decisions made

- Free forever, public, open source, Apache 2.0. No landing page for now.
- Expo / React Native, not separate Kotlin and Swift apps.
- No analytics SDK. Store-native stats only, because the app promises no tracking.
- Store copy is positive and owner-focused ("For Bonaverde Berlin owners", community-made). The crowdfunding cautionary tale and the thanks to coffee growers live in README and STORY, not in store copy.
- iOS name "Berlin Airlift for Bonaverde", subtitle "Coffee Card Writer & Reader". The brand stays out of the subtitle and keyword field. Bonaverde and Berlin trademarks belong to their owners, and both listings say so.
- Look: green kept from the original machine, curved woodgrain style of the original wood design, cargo plane and parachute airdrop.
- No "free" and no AI claims in store images. Listing assets are not labelled as AI-made.
- Android release reuses the publisher's existing upload key (`android_signing` in `codemagic.yaml`).
- Agent instructions in this repo stay agent-neutral. No private info in the repo.

## Next 3 steps

1. Confirm with the maintainer that Open items 1 and 2 are done (Play access ticked and saved, Codemagic secret added).
2. State the Android build cost, get a yes, start `android-release`, and watch it through. On failure, read the build log and fix only what blocks the build.
3. Check the internal-track draft in Play Console and tell the maintainer it's ready for Send for review. Then do the same for `ios-release` and App Store Connect.
