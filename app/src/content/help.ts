/**
 * Help copy shown in the app. The README and docs/CARDS.md say the same thing
 * in longer form, so change them together.
 * Card facts: NXP MF0ULX1 data sheet (Rev. 3.3) and NXP MIFARE Ultralight EV1 fact sheet.
 * Machine facts (lights, amounts, descaling, filter): the Berlin manual, Rev. 1 and Rev. 2,
 * and owner tips, both from the community site bonaverde-berlin.org. Written in our own words.
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
    q: 'What do the lights on my Berlin mean?',
    a: [
      'White: ready. It pulses white once it has cooled down.',
      'Green: the card was read, or your coffee is done.',
      'Yellow: the air filter is due. See the air filter answer below.',
      'Blue with one beep: add water, then press the round button. If the tank still has water, it is time to descale.',
      'Red with one beep: the roasting chamber, air filter or filter drawer is not seated, or the card was refused. Check all three, wait for white, then scan again.',
      'Red with two beeps, staying red: a fault inside the machine. The Repair link in More has videos and photos.',
      'Every light red right after you plug it in: it is still cooling down. Wait for pulsing white.',
    ],
  },
  {
    q: 'How much coffee and water?',
    a: [
      '50 g of green beans for 600 ml. 80 g for 900 ml. 90 g for 1 litre, with the Big Pot card.',
      'Want it stronger? Use less water. Lighter? Use a bit more.',
      'If beans are left on the grinder when it stops, pick a longer grind time when you choose your drink: 45 s for 50 g, 60 s for 70 g, 75 s for 90 g.',
      'The grinder dial sits behind the water tank. Setting 2 is a good place to start.',
    ],
  },
  {
    q: 'When do I change the air filter?',
    a: [
      'About every 30 roasts. The yellow light tells you. Empty the chaff from the filter box at the same time.',
      'Bonaverde filters are gone. Owners use a JUWEL bioCarb XL activated carbon sponge from an aquarium shop, cut in half. It fits the filter box.',
      'Then write a Reset Air Filter card in More and scan it. Resetting alone does not clean anything, so change the filter first.',
    ],
  },
  {
    q: 'How do I descale?',
    a: [
      'The manual\'s way: run two brew-only rounds with no coffee in the machine.',
      '1. Fill the tank and add 50 ml of white vinegar or descaler. Scan a Rinse card from More.',
      '2. Empty and rinse the tank, fill it with plain water, and scan the Rinse card again.',
      'Repeat if the blue light keeps coming back. The Descale card in More is there too.',
    ],
  },
  {
    q: 'Can I reuse old Bonaverde cards?',
    a: [
      'Unused ones, yes. The labels from unopened green bean pouches can be written over with this app.',
      'Cards that were already used may be locked. If writing fails, use a new blank card.',
    ],
  },
  {
    q: 'Is my data private?',
    a: ['Yes. No account, no ads, no tracking. Everything stays on your phone.'],
  },
];
