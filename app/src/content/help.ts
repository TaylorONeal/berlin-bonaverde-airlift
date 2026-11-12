/**
 * Help copy shown in the app. The README and docs/CARDS.md say the same thing
 * in longer form, so change them together.
 * Card facts: NXP MF0ULX1 data sheet (Rev. 3.3) and NXP MIFARE Ultralight EV1 fact sheet.
 */

/** Shown first on Home so nobody installs this without the machine. */
export const OWNER_BADGE = 'For Bonaverde Berlin owners';

export const WHAT_IT_IS =
  'Already have a Bonaverde Berlin coffee machine? Write the cards it needs to roast, grind and brew. Made by owners, for owners.';

export interface HelpTopic {
  q: string;
  a: string[];
}

export const CARD_TO_BUY = {
  name: 'MIFARE Ultralight EV1',
  part: 'MF0UL11',
  search: ['MIFARE Ultralight EV1 card', 'Ultralight EV1 NFC card 13.56MHz', 'MF0UL11'],
  checks: [
    'The listing names the chip as MIFARE Ultralight EV1 (made by NXP).',
    'It says 13.56 MHz.',
    'Memory is 48 bytes, or 80 bytes total. That is the MF0UL11.',
  ],
  avoid: [
    { name: 'NTAG213, NTAG215, NTAG216', why: 'The most common "NFC card" or sticker. A different chip. Not proven on the Berlin.' },
    { name: 'MIFARE Classic 1K, "S50", "Fudan F08"', why: 'The most common "13.56 MHz RFID card". A different family. Will not work.' },
    { name: '125 kHz cards: EM4100, TK4100, T5577, "proximity"', why: 'Old-style RFID. Phones cannot read them at all.' },
    { name: 'Ultralight C, Ultralight AES, Ultralight Nano', why: 'Same family name, different chips.' },
    { name: 'Ultralight EV1 with 128 bytes (MF0UL21)', why: 'The bigger EV1. Its settings sit in a different place. Untested.' },
  ],
} as const;

export const HELP: readonly HelpTopic[] = [
  {
    q: 'What is this?',
    a: [
      'The Bonaverde Berlin roasts green coffee, grinds it and brews it. It only starts when you put a small card in it. The card tells it what to do.',
      'The company that sold the cards is gone. Berlin Airlift writes new ones with your phone, so your machine keeps working.',
    ],
  },
  {
    q: 'How does it work?',
    a: [
      '1. Pick a drink, like Full Pot.',
      '2. Tap Write a card and hold a blank card to the top of your phone.',
      '3. Put the card in your Berlin and press its button.',
    ],
  },
  {
    q: 'Which card do I buy?',
    a: [
      `Buy blank ${CARD_TO_BUY.name} cards or stickers. The exact chip is the NXP ${CARD_TO_BUY.part}.`,
      `Search for: ${CARD_TO_BUY.search.map((s) => `"${s}"`).join(', ')}.`,
      'Before you buy, check that the listing names the chip as MIFARE Ultralight EV1, says 13.56 MHz, and says 48 bytes of memory (80 bytes total).',
      'A listing that only says "NFC card" or "RFID card" is usually the wrong chip.',
    ],
  },
  {
    q: 'Which cards look right but are wrong?',
    a: CARD_TO_BUY.avoid.map((x) => `${x.name}: ${x.why}`),
  },
  {
    q: 'Reusable or single use?',
    a: [
      'Reusable cards work every time, so one card can be your daily Full Pot. This is on by default.',
      'Single-use cards work once, like the original cards did. Change it in More.',
    ],
  },
  {
    q: 'The card did not work',
    a: [
      'Hold the card flat on the top back of your phone (iPhone) or the middle of the back (most Android phones) and keep it still until the phone buzzes.',
      'If it still fails, try a new blank card. Some cards get locked and can never be written again.',
      'Use What\'s on this card? to check a card that already has a drink on it. It tells you if your machine will take it.',
    ],
  },
  {
    q: 'Is my data private?',
    a: ['Yes. No account, no ads, no tracking. Everything stays on your phone.'],
  },
];
