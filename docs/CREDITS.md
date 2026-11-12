# Credits and sources

Berlin Airlift is a remix, and it says so loudly. Every load-bearing piece of knowledge in this repo came from someone else first. If this project helps you, go and star, thank, or cite them, in this order.

## The code and protocol this app is built on

### VerdeNFC, Bernd Trappe (btrappe)
- Repo: https://github.com/btrappe/VerdeNFC
- What we took from it (with gratitude, and by porting, not by pretending):
  - The complete set of 33 roast / grind / brew / maintenance profile templates (`app/src/protocol/profiles.ts` here is a transcription of the `RoastProfiles` list in its `MainTabViewModel.cs`).
  - The checksum algorithms (`app/src/protocol/checksums.ts` here is a line-faithful TypeScript port of its `VerdeNFC/VerdeNFC/Util/VerdeChecksums.cs`): CRC16 single-use, CRC16 multi-use, CRC8.
  - The write model: read the destination card's first 16 bytes, merge, recompute both checksums, write pages 4 to 15 of a Mifare Ultralight EV1.
  - The pause-after-roast stepping (1-minute steps to 2h, 5-minute to 6h, 15-minute to 24h) and its decoded tag interpretation.
- VerdeNFC's own README credits: "the dedicated Facebook group and especially Hackaverde, Craig Whyte and Michael Grundler who delivered important information without [which] this app wouldn't be possible."
- Licence: VerdeNFC is **Copyright 2020 Bernd Trappe, licensed under the Apache License, Version 2.0** (see its repo's LICENSE file). The ported portions of this project are used under those terms, are credited here and in the repo's `NOTICE` file, and keep his copyright. Thank you for licensing it openly, Bernd. It is a large part of why these machines are still making coffee. (Correction, 2026-10-22: an earlier version of this file wrongly said VerdeNFC's LICENSE file was empty. It is not; that was a read error on our side, fixed the same day.)

### hackaverde, PostalBlab and contributors
- Repo: https://github.com/PostalBlab/hackaverde
- What it gave the community: the NFC tag byte layout (`NFC/Layout.md`), firmware reverse-engineering notes, the machine's memory layout, and a library of real card dumps (`NFC/tags`): air filter, brew only, grind only, roast only, universal roasts and more.
- What we used it for here: independent verification. The checksums in this repo reproduce those dumps exactly (CRC8 on all tested dumps; single-use CRC16 on the air-filter card; multi-use CRC16 on the brew-only and grind-only cards). Run `tools/verify_checksums.py` to see it.
- Its README thanks Mario Keller (who sent a beta machine) and Marcus Wolschon (who sent several NFC tags). So do we.

### raspiverde, Marcus Wolschon
- Repo: https://github.com/MarcusWolschon/raspiverde
- "Hacking a (bankrupt) Bonaverde 'Berlin' roasting grinding and brewing coffee machine to be controlled by a Raspberry Pi." The deepest hardware route: if our card app is not enough machine for you, this is.

## Community knowledge

- **Reddit, r/NFC**: the thread that kicked off this build: https://www.reddit.com/r/NFC/s/iAQzYY1dJ9, and the wider r/NFC and coffee-community threads where owners traded scans, card sources and working settings after the shutdown.
- **Owners' shared profile spreadsheets and card files**, traded in the owner groups in the simple text-dump format this app also reads (the format VerdeNFC attributes to the Android app **Mifare++ Ultra**). This repo does not link to or copy from those shares.
- **The Facebook Bonaverde / Hackaverde owner groups**, where much of the original recovery work was coordinated, including the earliest "which blank cards actually work" knowledge (Mifare Ultralight EV1) that every later project relies on.
- **zreptil's gist** of Berlin card texts (AirfilterResetCard, RoastGrindBrewCard, BrewOnlyCard, GrindOnlyCard), another of the small, unglamorous uploads that kept these machines alive: https://gist.github.com/zreptil/336d97c7c07ded79eb526cd3d5891e10

## The original company and machine

- **Bonaverde Coffee AG**: inventor, crowdfunder and manufacturer of the Berlin (and the earlier Dalia concept). Original app: **myBonaverde** (`com.bonaverde`, last version 1.3.5, 12 June 2020), preserved on APKPure: https://apkpure.com/mybonaverde/com.bonaverde, a cloud remote for the machine ("roast, grind or brew according to coffee origin & variety"), useless today because the cloud and accounts it logged into are gone. That contrast is the whole reason this repo exists.
- Contemporary coverage used for the story in `docs/STORY.md`:
  - Trusted Reviews, *Bonaverde Berlin Review*: http://www.trustedreviews.com/reviews/bonaverde-berlin
  - The Spoon, Bonaverde Berlin coverage: https://thespoon.tech/tag/bonaverde-berlin/
  - Cerebral Overload, *Now Shipping: Bonaverde* (2017): https://cerebral-overload.com/2017/11/now-shipping-bonaverde-available-limited-run/
  - The Girl in the Cafe, *Bonaverde Berlin Home Green Bean Roaster*: https://www.thegirlinthecafe.co.uk/blog/bonaverde-berlin-home-green-bean-roaster
  - The Berlin user manual (mirrored): https://cdn3.guidespdf.com/view/1476/1476873-berlin.pdf

## This app

- Berlin Airlift (design, code, docs and this story) was built in 2026 by Taylor O'Neal, for a Berlin he owns and uses, and in the open for anyone else still keeping one alive.
- Original-code licence for this repo's new code: see the repo licence file. The ported protocol behaviour remains credited to its sources above, whatever licence text surrounds it.
