# UX spec

The standard: one obvious action, zero onboarding, first card in under 10 seconds. If a new owner has to read anything before making a card, it's a bug.

## The flow

| Moment | Screen | Copy |
|---|---|---|
| Open | Wood header, hero line, one giant green button, the summary line under it | "Fresh coffee, airlifted." / **Write a card** / "Full Pot. Reusable." |
| Tap | Button deepens and pulses. iPhone shows the system NFC sheet with the same words | **Hold a blank card to your phone** / "Hold it still." |
| Card touches | Read the card, merge the template onto its identity pages, write pages 4 to 15, read back, compare | iPhone sheet: "Writing...", "Checking...", "Card ready" |
| Done | Plane drops a pouch, green check | "Full Pot card ready." / "Put it in your machine and press its button." / **Write another** |
| Error | One shake, plain words, button becomes **Try again** | See errors below |

Three touches from a cold start to a verified card: open, tap, hold.

## Everything else, one gesture away

| Need | Where |
|---|---|
| Another drink, roast level, pause after roast | Tap the summary line: drink sheet. The last pick is remembered |
| What's on this card?, copy it | "What's on this card?" under the button |
| Care cards (descale, clean grinder, reset filter) | More, hold to confirm |
| Single-use cards, haptics, demo mode | More, switches |
| Cards you made, About, credits, trademark notice | More |
| Demo | "No card handy? Try a demo". Turns on by itself without NFC |

## Safety rules (unchanged, and mandatory)

- The button and the line under it say exactly what will be written. The tap is the confirmation.
- Success never shows without a read-back and a byte compare of pages 4 to 15.
- Pages 0 to 3 (the card's identity) and 16 to 19 (its configuration) are never written.
- A real pause (hold to confirm) for care cards, single-use cards, and replacing a card that already works.
- The pick survives an error. Retry is one tap.
- Android stops listening after 30 s. iPhone uses the system sheet's timeout.

## Errors

| Code | Copy |
|---|---|
| `no-nfc` | This phone can't read cards. Berlin Airlift needs a phone with NFC. |
| `nfc-off` | Turn on NFC in Settings, then try again. |
| `cancelled` | (no message, back to idle) |
| `card-moved` | The card moved away. Hold it still and try again. |
| `wrong-card` | That card won't work. Use a Mifare Ultralight EV1 card. |
| `verify-failed` | The card didn't take it. Try again, or use another card. |
| `not-blank` | This card already has a drink on it. Hold the button to replace it. |
| `unknown` | Something went wrong. Try again. |

Copy lives in `app/src/nfc/types.ts` and the screens. Rules: short, plain, friendly, no em dashes, no "AI".
