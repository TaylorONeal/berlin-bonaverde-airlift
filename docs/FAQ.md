# FAQ: Berlin Airlift and the Bonaverde Berlin

For owners. Short answers first, detail where it matters. Protocol depth lives in `docs/NFC-PROTOCOL.md`; the story lives in `docs/STORY.md`.

## The basics

**What does this app do?**
It writes small NFC cards that tell a Bonaverde Berlin coffee machine what to do: roast, grind and brew a pot; roast only; grind; brew; and the maintenance jobs (air filter reset, grinder clean, descale). You pick from a plain menu (Full Pot, Medium Roast, Overnight), hold a blank card to your phone, then scan that card on the machine.

**Why does this exist?**
Bonaverde went insolvent and its cloud, shop and app died with it. The machine refuses to run without a valid NFC card, and the original cards were locked to coffees the company sold. Owners reverse-engineered the cards (see `docs/CREDITS.md`) so the machines could live. This app is a modern front-end for that community work.

**Do I need an account, internet, or a subscription?**
No. No account, no internet, no analytics, no ads. The app asks for exactly two permissions: NFC and Vibrate.

**Is this made by Bonaverde?**
No. Unofficial community software. Bonaverde Coffee AG made the machine and the original myBonaverde app; this project is not affiliated with them.

## Cards

**Which blank cards do I buy?**
Blank **MIFARE Ultralight EV1** cards, chip **MF0UL11** (48 bytes, 13.56 MHz). Search for `MIFARE Ultralight EV1 card`. Not NTAG213/215/216, not MIFARE Classic, not 125 kHz cards. The full guide, with the look-alikes to avoid: [CARDS.md](CARDS.md).

**Can I reuse a card?**
Yes, that is the default. The app writes the community **multi-use** checksums, so a card can be rewritten any time. Turn "Reusable" off only if you specifically want a one-shot card like the original pouches.

**Can I copy a card I already have?**
Yes. Tap **What's on this card?**, then **Copy it to a blank card**. The clone keeps the source card's instructions but takes the blank card's own identity, with fresh checksums computed for it (that is what makes clones work at all).

**What is the air filter card about?**
The Berlin counts filter uses and eventually demands attention. The original reset required an official tagged filter. This app's FILTER RESET card writes the same reset command (0x0F). Honest note: resetting the counter does not clean the filter. If the filter is spent, replace or clean it, then reset.

**The machine flashed a red light when I scanned.**
Per the Berlin manual: a single red flash usually means the scan was rejected (wrong tag family, bad checksums, or the card was moved). Wait for the white pulsing light, make sure the roasting chamber, air filter and filter drawer are seated, and scan again. If every light goes red when you plug in, the machine may just need to cool down after its last roast. If an app-written card keeps failing: read it back in this app (it should decode cleanly with valid CRC8), and if it still fails, try a fresh blank card.

## The menu (why don't I see "Tavares, Brazil"?)

**Where did the original coffee names go?**
Into the mapping, where they belong. Those pouches were sold by a marketplace that no longer exists, and the full-pot cards behind them were near-identical curves that mostly differed by batch size. The app orders in today's words: pot size, roast level, timing. Every menu item still shows its original card name once, small ("Original card: ..."), and `docs/MENU.md` maps all of them, including the archived ones.

**Which roast do I pick for beans I bought today?**
Full journey: Full Pot or Half Pot for almost everything. Roasting only: Light for delicate washed beans (Ethiopia, Kenya), Medium as the default, Dark for Brazil, Sumatra, decaf and milk drinks, Full Batch for a bigger medium batch.

**What is Overnight?**
It roasts when you write the evening card session, then the machine pauses (10 hours, set for you) before grinding and brewing. Roast tonight, coffee when you wake.

**Can I change the pause myself?**
Yes, the slider under the menu (full journey only). Steps get coarser the further out you go: minutes up to 2 hours, then 5-minute, then 15-minute steps, up to 24 hours. That stepping is inherited from VerdeNFC because the community found it matches how people actually use it.

## The app

**Which phones?**
A recent iPhone, or an Android phone with NFC (most from the last several years have it). One screen, no scrolling.

**Is there an iPhone version?**
Yes. The same app runs on iPhone and Android. It is not in the App Store or Google Play yet; it is being tested on real machines first.

**What does Demo mode do?**
It simulates card taps so you can learn or test the whole flow without cards or a machine. It is behind the gear in Config, clearly labelled, and it never writes a real card.

**Where is my data?**
History and config live only in the app's private storage on your phone. Nothing is uploaded anywhere; there is nowhere to upload to. Uninstalling deletes them.

**The app says a write "did not verify".**
After writing, the app reads the card back and compares it byte for byte; if that differs, it refuses to call it done (original cards had no such mercy). Use a fresh blank, hold it flat and still against the top-back of the phone, and try again.

## The machine and safety

**Which beans can I use?**
Any green coffee for the roast modes, roasted whole beans for Grind and Grind & Brew, ground coffee for Brew. About 50 g for a half pot (600 ml), about 80 g for a full pot (900 ml).

**Is home roasting safe to improvise with?**
Roasting is a heat process with smoke and chaff: follow the Berlin's manual, keep the air filter and chaff collector sane, ventilate, and do not leave a roast unattended because an app made it feel easy. Every profile in this app is a published community profile; the app invents no new heat curves.

**Where do I get the official manual?**
A mirrored copy of the Berlin manual is linked in `docs/CREDITS.md`.

## For the technical

**What exactly is on a card?**
An 80-byte image on a Mifare Ultralight EV1: identity pages (kept from the card itself), a 34-byte payload (roast records, command byte at offset 41, pause at 48 to 49), a CRC16 (single or multi-use variant) at 46 to 47 and a CRC8 at byte 60. Full map: `docs/NFC-PROTOCOL.md`. Verify our port yourself: `python3 tools/verify_checksums.py`.

**I found a bug / a card that decodes wrong.**
Preserve the card, note what the machine did, read the card in this app and in VerdeNFC, and compare pages 4 to 15. That comparison settles most arguments; the golden tests in `app/src/test` settle the rest.
