# Handoff: Berlin Airlift store launch

Written Nov 12, 2026 and updated Nov 18, 2026, so a fresh session can pick this up from this file alone.
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

## Status on Nov 18, 2026

- Google Play: version 1.0.0 is published to production in all countries (first public build, version code 2). An update with the layout fixes (version code 4) was sent for review on Nov 18. Managed publishing is on, so an approved update waits for the maintainer's publish.
- Play publishing access and the Codemagic `google_play` secret are in place. `android-release` has run several times and uploads to the internal track.
- Internal testing is active with one tester list. The store build installs from Play and opens on a real Android phone; all sheets open and close.
- App Store: version 1.0 is still in Prepare for Submission.

## Open

1. **Real device card test.** Write and read a blank MIFARE Ultralight EV1 card on a real phone with a store build, and brew with it. This has not been done yet. The app can't yet tell a blank NTAG from a blank EV1, so a chip check via GET_VERSION waits until the bytes are confirmed on a device.
2. **Real screenshots and review video.** The store frames still come from the web preview. Replace them with real device captures (the write, done and read frames need a real card), and record an App Review video of a card write.
3. **iOS release.** Run `ios-release` (okay the cost first), then prepare the App Store version. "Submit for Review" is the maintainer's own click.
4. **Portrait feature flag.** Play warns that the app requires `android.hardware.screen.portrait`. Mark it optional in the Android manifest so more devices can install.
5. **First-user friction hunt.** Not run yet for this app.
6. **Move the iOS build to Xcode 27 before April 2027.** App Store Connect accepted build 1 with warning ITMS-90725: it was built with the iOS 26.5 SDK, and from April 2027 uploads must use the iOS 27 SDK (Xcode 27 or later). The pin is `environment.xcode` in `codemagic.yaml`. Do this after 1.0 is through App Review, and check first that the Expo version builds on Xcode 27.

## Lessons

- An `android-release` upload through the Play API also sends any changes waiting in Publishing overview for review. Check that nothing is pending there before starting a build, or expect them to be submitted.
- A blank release-notes placeholder is fine for internal testing, but production needs real notes per language.

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

1. With a blank MIFARE Ultralight EV1 card and an Android phone on the internal track, write and read a card, capture the eight store screens, and record the write for App Review.
2. Rebuild the store frames from those captures (`tools/store-screenshots`) and replace the Play and App Store screenshots.
3. Publish the approved Android update, then take iOS through `ios-release` to a ready-to-submit version.
