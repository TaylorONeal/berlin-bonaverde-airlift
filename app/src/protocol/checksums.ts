/**
 * Checksums for Bonaverde Berlin NFC cards.
 *
 * The algorithms are the ones the machine checks, first published in
 * VerdeNFC by Bernd Trappe (Apache 2.0, see /NOTICE). This file is our own
 * TypeScript, but the math must stay byte-exact: the Berlin rejects a card
 * if either checksum is off by one bit. Golden tests in __tests__/ prove it
 * against real card dumps published by the hackaverde project.
 */

const SINGLE_LOOKUP = [
  0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x10, 0x12, 0x13, 0x16, 0x17,
  0x19, 0x1b, 0x1c, 0x1f, 0x20, 0x22, 0x25, 0x27, 0x28, 0x29, 0x2a, 0x2d,
] as const;

const MULTI_LOOKUP = [
  0x00, 0x02, 0x03, 0x04, 0x06, 0x10, 0x11, 0x12, 0x14, 0x17, 0x18, 0x19,
  0x1b, 0x1e, 0x1f, 0x20, 0x21, 0x23, 0x24, 0x26, 0x28, 0x2a, 0x2b, 0x2c, 0x2d,
] as const;

export type Crc16Variant = 'single-use' | 'multi-use' | 'no-match';

/** CRC16 for a one-shot card (like the original pouches). Stored little-endian at bytes 46-47. */
export function crc16SingleUse(mem: Uint8Array): number {
  let sum = (mem[1] * mem[2] * 5) & 0xffff;
  for (let i = 2; i < SINGLE_LOOKUP.length; i++) sum ^= mem[SINGLE_LOOKUP[i]];
  return (sum ^ 0xa1) & 0xffff;
}

/** CRC16 for a reusable card. Stored little-endian at bytes 46-47. */
export function crc16MultiUse(mem: Uint8Array): number {
  let sum = (mem[0] * mem[2] * 5) & 0xffff;
  for (let i = 2; i < MULTI_LOOKUP.length; i++) sum ^= mem[MULTI_LOOKUP[i]];
  return (sum ^ 0xd2) & 0xffff;
}

/** Which CRC16 variant validates this card image, if any. */
export function crc16Variant(mem: Uint8Array): Crc16Variant {
  if (mem.length < 48) return 'no-match';
  const stored = mem[46] | (mem[47] << 8);
  if (stored === crc16SingleUse(mem)) return 'single-use';
  if (stored === crc16MultiUse(mem)) return 'multi-use';
  return 'no-match';
}

const CRC8_TABLE: number[] = (() => {
  const table: number[] = [];
  for (let i = 0; i < 256; i++) {
    let t = i;
    for (let j = 0; j < 8; j++) t = t & 0x80 ? (t << 1) ^ 0x07 : t << 1;
    table.push(t & 0xff);
  }
  return table;
})();

export function crc8(bytes: ArrayLike<number>): number {
  let crc = 0;
  for (let i = 0; i < bytes.length; i++) crc = CRC8_TABLE[crc ^ (bytes[i] & 0xff)];
  return crc & 0xff;
}

/** CRC8 covers bytes 0-11 and 16-59 (the OTP page, bytes 12-15, is skipped). Stored at byte 60. */
export function crc8ForTag(mem: Uint8Array): number {
  const covered = new Uint8Array(56);
  covered.set(mem.subarray(0, 12), 0);
  covered.set(mem.subarray(16, 60), 12);
  return crc8(covered);
}
