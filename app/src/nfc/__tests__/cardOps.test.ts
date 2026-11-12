import { crc16Variant, imageFromTemplate, PROFILES } from '../../protocol';
import { CardError, fakeAdapter, FakeCard, readCard, writeCard } from '..';

const template = imageFromTemplate(PROFILES.find((p) => p.key === 'tavares80')!.templateHex);

it('writes a valid card and keeps its identity', async () => {
  const card = new FakeCard();
  const uid = Array.from(card.mem.subarray(0, 16));
  const res = await writeCard(fakeAdapter({ card }), template, { multiUse: true });
  expect(Array.from(card.mem.subarray(0, 16))).toEqual(uid);
  expect(res.info.valid).toBe(true);
  expect(res.info.command).toBe('roast-grind-brew');
  expect(crc16Variant(card.mem)).toBe('multi-use');
});

it('never touches pages 16 to 19', async () => {
  const card = new FakeCard();
  card.mem.fill(0x5a, 64);
  await writeCard(fakeAdapter({ card }), template, { multiUse: true });
  expect(Array.from(card.mem.subarray(64))).toEqual(new Array(16).fill(0x5a));
});

it('catches a bad write on read-back', async () => {
  await expect(writeCard(fakeAdapter({ corruptPage: 9 }), template, { multiUse: true })).rejects.toMatchObject({ code: 'verify-failed' });
});

it('passes session errors through', async () => {
  await expect(writeCard(fakeAdapter({ failWith: 'cancelled' }), template, { multiUse: true })).rejects.toBeInstanceOf(CardError);
});

it('reads back what it wrote', async () => {
  const adapter = fakeAdapter();
  await writeCard(adapter, template, { multiUse: false });
  const { info } = await readCard(adapter);
  expect(info.crc16).toBe('single-use');
  expect(info.valid).toBe(true);
});

it('a blank card reads as blank', async () => {
  const { info } = await readCard(fakeAdapter());
  expect(info.blank).toBe(true);
  expect(info.valid).toBe(false);
});

it('asks before replacing a card that already works', async () => {
  const adapter = fakeAdapter();
  await writeCard(adapter, template, { multiUse: true });
  await expect(writeCard(adapter, template, { multiUse: true })).rejects.toMatchObject({ code: 'not-blank' });
  await expect(writeCard(adapter, template, { multiUse: true, allowOverwrite: true })).resolves.toBeTruthy();
});
