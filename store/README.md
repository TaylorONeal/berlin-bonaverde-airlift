# Store listing kit

Everything the App Store and Google Play ask for, in one place, ready to paste. The listing text lives in `apple/en-US/` and `google/en-US/`, one field per file (the layout fastlane uses). Search strategy and why the brand sits where it does: [docs/gtm/aso-2026-11-12.md](../docs/gtm/aso-2026-11-12.md).

## The app

| | App Store | Google Play |
|---|---|---|
| Name | Berlin Airlift for Bonaverde | Berlin Airlift: Coffee Cards |
| Bundle id / package | com.berlinairlift.app | com.berlinairlift.app |
| Version | 1.0.0 | 1.0.0 |
| Price | Free, no in-app purchases | Free, no in-app purchases, no ads |
| Category | Food & Drink (secondary: Utilities) | Food & Drink |
| Devices | iPhone only (no iPad) | Phones with NFC |
| Copyright | 2026 Berlin Airlift contributors | |
| Support URL | GitHub issues for this repo | same |
| Privacy URL | PRIVACY.md in this repo | same |

## Privacy answers

**App Store, App Privacy:** Data Not Collected. No tracking. The app has no account, no analytics SDK, no ads and makes no network requests.

**Google Play, Data safety:**
- Does your app collect or share any of the required user data types? **No.**
- Is all user data encrypted in transit? Not applicable (no data leaves the phone).
- Account deletion: not applicable (no accounts).
- Store builds have no INTERNET permission (`STORE_BUILD=1` in `codemagic.yaml`, see `app/app.config.js`). Check the built manifest before answering.

## Ratings and declarations

**App Store age rating:** answer None or No to every question. Result: 4+.

**Google Play content rating (IARC):** category Utility, Productivity, Communication or Other. No violence, sexual content, language, controlled substances, gambling, user interaction, sharing of location or personal info, or digital purchases. Expected: Everyone / PEGI 3.

**Google Play target audience:** 18 and over. Not designed for children.

**Google Play ads:** No ads.

**Export compliance (Apple):** uses no non-exempt encryption (`ITSAppUsesNonExemptEncryption` is false in app.json).

**Government, news, financial, health, VPN declarations:** none apply.

## Notes for App Review

> Berlin Airlift writes and reads the small NFC cards that the Bonaverde Berlin coffee machine needs before it will roast, grind and brew. The company that sold the cards closed in 2019, so owners write their own.
>
> Testing needs a blank MIFARE Ultralight EV1 card, which most reviewers will not have. The attached video shows the full flow on an iPhone: pick a drink, tap Write a card, hold a blank card to the phone, and check the card with "What's on this card?".
>
> Without a card you can still open every screen: the drink picker, Help (which card to buy), More (care cards, settings, About, credits). Tapping Write a card opens the system NFC sheet.
>
> The app is free and open source, has no account, no ads, no analytics and makes no network requests. "Bonaverde" appears only to say which machine the app works with; the listing and the app carry a notice that this is an independent community project.

The review video is still to record on a real iPhone with a real card (see the release checklist below).

## Screenshots

Drafts, rendered from the app's web preview: `store/screenshots/apple/` (1320 x 2868, iPhone 6.9 inch) and `store/screenshots/google/` (1080 x 1920), plus `store/screenshots/google/feature-graphic-1024x500.png` (1024 x 500). Swap the screen inside each frame for a real phone capture after the device test; the store-screenshot rules say App Store frames must hold iPhone captures.

## Release checklist

1. App Store Connect: register `com.berlinairlift.app` with the NFC Tag Reading capability, create the app record, put its Apple ID in `codemagic.yaml`.
2. Google Play: create the app under the organization developer account, set it free.
3. Codemagic: add this repo as an app, add the upload keystore (`berlin_airlift_upload`) and the Play service account (`google_play` group).
4. Tag `v1.0.0` and push. Codemagic builds both, sends iOS to TestFlight and Android to internal testing as a draft.
5. Install from TestFlight and from Play internal testing on real phones. Write a card with a blank EV1, brew with it, check it with "What's on this card?".
6. Capture real screenshots and the App Review video from that session.
7. Paste the listing, answer privacy and ratings from this file, attach the build.
8. Submit for review: a person presses that button, never CI.
