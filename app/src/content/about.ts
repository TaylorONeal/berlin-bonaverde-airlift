/**
 * About copy shown in More. The README "Why it exists" and "Credits" sections and
 * docs/CREDITS.md say the same thing in longer form, so change them together.
 */

export const REPO_URL = 'https://github.com/TaylorONeal/berlin-bonaverde-airlift';

export const STORY: readonly string[] = [
  'The Berlin roasts green coffee minutes before it brews it. That is about as fresh as coffee gets.',
  'We love the growers behind those beans, especially the small co-ops in places like Guatemala who do the hardest part of the work.',
  'The company that made the cards closed in 2019. Owners worked out how the cards work and shared it with each other. Berlin Airlift puts all of that into one button, so every Berlin can keep brewing.',
];

export const THANKS: readonly { who: string; what: string }[] = [
  { who: 'VerdeNFC by Bernd Trappe', what: 'The card math and the drink recipes this app writes. Apache 2.0.' },
  { who: 'hackaverde by PostalBlab and friends', what: 'How the card is laid out, and the real cards we test against.' },
  { who: 'Craig Whyte, Michael Grundler and the owner groups', what: 'The know-how that made all of this possible.' },
  { who: 'raspiverde by Marcus Wolschon', what: 'Taking the Berlin even further with a Raspberry Pi.' },
  { who: 'Bonaverde', what: 'For building a machine good enough that all of us bothered.' },
];

export const OPEN_SOURCE =
  'Free forever and open source under the Apache 2.0 license. Anyone can read the code, report a problem or help out.';

export const TRADEMARK_NOTICE =
  'Berlin Airlift is an independent community project. It is not made, endorsed or supported by Bonaverde or by the owners of the Bonaverde and Berlin trademarks. Bonaverde and Berlin are trademarks of their respective owners and are named here only to say which machine the app works with.';
