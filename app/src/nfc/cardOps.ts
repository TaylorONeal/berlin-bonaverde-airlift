import { describe as describeCard, CardInfo, merge, samePayload, TAG_SIZE, writePages } from '../protocol';
import { CardAdapter, CardError, CardSession } from './types';

async function readImage(s: CardSession): Promise<Uint8Array> {
  const mem = new Uint8Array(TAG_SIZE);
  for (let page = 0; page < 20; page += 4) {
    const chunk = await s.read4(page);
    if (!chunk || chunk.length < 16) throw new CardError('wrong-card', 'Short read');
    mem.set(chunk.slice(0, 16), page * 4);
  }
  return mem;
}

export interface WriteResult {
  written: Uint8Array;
  info: CardInfo;
}

/**
 * Make a card: read the blank, merge the template onto its identity pages,
 * write pages 4 to 15, read it back and compare byte for byte.
 */
export async function writeCard(
  adapter: CardAdapter,
  template: Uint8Array,
  opts: { multiUse: boolean; prompt?: string; allowOverwrite?: boolean },
): Promise<WriteResult> {
  return adapter.withCard(opts.prompt ?? 'Hold a blank card to the top of your phone', async (s) => {
    const before = await readImage(s);
    if (!opts.allowOverwrite && describeCard(before).valid) throw new CardError('not-blank');
    const image = merge(template, before, opts.multiUse);
    await s.setMessage('Writing...');
    for (const { page, data } of writePages(image)) await s.writePage(page, data);
    await s.setMessage('Checking...');
    const after = await readImage(s);
    if (!samePayload(image, after)) throw new CardError('verify-failed');
    await s.setMessage('Card ready');
    return { written: after, info: describeCard(after) };
  });
}

export async function readCard(adapter: CardAdapter, prompt = 'Hold your card to the top of your phone') {
  return adapter.withCard(prompt, async (s) => {
    const image = await readImage(s);
    return { image, info: describeCard(image) };
  });
}
