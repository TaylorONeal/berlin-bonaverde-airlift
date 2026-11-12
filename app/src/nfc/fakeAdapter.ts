import { CardAdapter, CardError, CardErrorCode, CardSession } from './types';

/**
 * A pretend card for the demo and for tests. Behaves like a Mifare Ultralight
 * EV1: 20 pages, pages 0 to 3 are not writable.
 */
export class FakeCard {
  mem = new Uint8Array(80);
  constructor(uidHex = '04A1B2C3D4E5F60000000000FFFFFFFF') {
    for (let i = 0; i < 16; i++) this.mem[i] = parseInt(uidHex.substr(i * 2, 2), 16);
  }
}

export interface FakeOptions {
  card?: FakeCard;
  availability?: 'ready' | 'no-nfc' | 'nfc-off';
  /** Throw this error when the session opens. */
  failWith?: CardErrorCode;
  /** Silently corrupt this page on write, to test read-back. */
  corruptPage?: number;
  /** Delay per operation in ms, so the demo feels real. */
  delayMs?: number;
}

export function fakeAdapter(o: FakeOptions = {}): CardAdapter & { card: FakeCard } {
  const card = o.card ?? new FakeCard();
  const wait = () => new Promise((r) => setTimeout(r, o.delayMs ?? 0));
  const session: CardSession = {
    async read4(page) {
      await wait();
      const out: number[] = [];
      for (let i = 0; i < 16; i++) out.push(card.mem[(page * 4 + i) % 80]);
      return out;
    },
    async writePage(page, data) {
      await wait();
      if (page < 4 || page > 19) throw new CardError('wrong-card', `Page ${page} is locked`);
      const d = page === o.corruptPage ? data.map((b) => b ^ 0xff) : data;
      card.mem.set(d.slice(0, 4), page * 4);
    },
    async setMessage() {},
  };
  return {
    card,
    async availability() {
      return o.availability ?? 'ready';
    },
    async cancel() {},
    async withCard(_prompt, work) {
      if (o.failWith) throw new CardError(o.failWith);
      return work(session);
    },
  };
}
