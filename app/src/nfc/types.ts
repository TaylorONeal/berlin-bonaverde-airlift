/** One open connection to a card that is touching the phone. */
export interface CardSession {
  /** Reads 4 pages (16 bytes) starting at `page`. */
  read4(page: number): Promise<number[]>;
  /** Writes one 4-byte page. */
  writePage(page: number, data: number[]): Promise<void>;
  /** Shown on the iOS scan sheet while working. No-op on Android. */
  setMessage(text: string): Promise<void>;
}

export type CardErrorCode =
  | 'no-nfc'        // phone has no NFC
  | 'nfc-off'       // NFC is switched off (Android)
  | 'cancelled'     // person closed the scan sheet
  | 'card-moved'    // card left the phone mid-way
  | 'wrong-card'    // not a Mifare Ultralight card
  | 'verify-failed' // wrote, but read-back did not match
  | 'not-blank'     // card already holds a working drink; needs a hold to replace
  | 'unknown';

export class CardError extends Error {
  constructor(public code: CardErrorCode, message?: string) {
    super(message ?? code);
    this.name = 'CardError';
  }
}

export interface CardAdapter {
  /** 'ready', or why not. */
  availability(): Promise<'ready' | 'no-nfc' | 'nfc-off'>;
  /** Waits for a card, runs `work` with it, then closes the session. */
  withCard<T>(prompt: string, work: (s: CardSession) => Promise<T>): Promise<T>;
  /** Stops waiting for a card. */
  cancel(): Promise<void>;
}

/** Plain-language line for each error, used on screen. */
export const CARD_ERROR_TEXT: Record<CardErrorCode, string> = {
  'no-nfc': "This phone can't read cards. Berlin Airlift needs a phone with NFC.",
  'nfc-off': 'Turn on NFC in Settings, then try again.',
  cancelled: 'No problem. Tap again when your card is ready.',
  'card-moved': 'The card moved away. Hold it still and try again.',
  'wrong-card': "That card won't work. Use a blank MIFARE Ultralight EV1 card. See Help for which one to buy.",
  'verify-failed': "The card didn't take it. Try again, or use another card.",
  'not-blank': 'This card already has a drink on it. Hold the button to write over it.',
  unknown: 'Something went wrong. Try again.',
};
