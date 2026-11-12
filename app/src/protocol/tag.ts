import { crc16MultiUse, crc16SingleUse, crc16Variant, crc8ForTag, Crc16Variant } from './checksums';

/**
 * A Berlin card image: 80 bytes, 20 pages of 4 bytes, on a Mifare Ultralight EV1.
 *
 *  - bytes 0-15   pages 0-3: UID, lock bytes, OTP. Always the destination card's own.
 *  - bytes 16-49  the drink payload from a profile template.
 *  - byte  41     command: 1 roast-grind-brew, 2 roast, 4 grind, 5 grind and brew,
 *                 6 brew, 0x0F filter reset, 0x11 request filter, 0x12 clean grinder,
 *                 0x13 descale.
 *  - bytes 46-47  CRC16, little-endian.
 *  - bytes 48-49  pause after roasting in minutes, big-endian.
 *  - byte  60     CRC8.
 *  - bytes 64-79  pages 16-19: card configuration. Never written.
 *
 * Full map with sources: docs/NFC-PROTOCOL.md.
 */
export const TAG_SIZE = 80;
export const PAYLOAD_START = 16;
/** We only ever write pages 4 to 15. */
export const FIRST_WRITE_PAGE = 4;
export const LAST_WRITE_PAGE = 15;

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/[^0-9a-fA-F]/g, '');
  if (clean.length % 2 !== 0) throw new Error('Odd number of hex digits');
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.substr(i * 2, 2), 16);
  return out;
}

export function toHex(bytes: ArrayLike<number>): string {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += (bytes[i] & 0xff).toString(16).padStart(2, '0').toUpperCase();
  return s;
}

/** A profile template (34 payload bytes) placed at offset 16 of an empty 80-byte image. */
export function imageFromTemplate(templateHex: string): Uint8Array {
  const mem = new Uint8Array(TAG_SIZE);
  const payload = hexToBytes(templateHex);
  mem.set(payload.subarray(0, TAG_SIZE - PAYLOAD_START), PAYLOAD_START);
  return mem;
}

/**
 * Build the image to write: the destination card's identity pages, the template's
 * payload, then both checksums recomputed for that exact card.
 */
export function merge(template: Uint8Array, destination: Uint8Array, multiUse: boolean): Uint8Array {
  const out = new Uint8Array(TAG_SIZE);
  out.set(template.subarray(0, TAG_SIZE));
  out.set(destination.subarray(0, 16), 0);
  const c16 = multiUse ? crc16MultiUse(out) : crc16SingleUse(out);
  out[46] = c16 & 0xff;
  out[47] = (c16 >> 8) & 0xff;
  out[60] = crc8ForTag(out);
  return out;
}

export function pauseMinutes(mem: Uint8Array): number {
  return mem.length > 49 ? mem[48] * 256 + mem[49] : 0;
}

export function withPauseMinutes(mem: Uint8Array, minutes: number): Uint8Array {
  const m = Math.max(0, Math.min(0xffff, Math.round(minutes)));
  const out = new Uint8Array(mem);
  out[48] = (m >> 8) & 0xff;
  out[49] = m & 0xff;
  return out;
}

/** Pages 4..15 of an image, as the 12 four-byte chunks we write. */
export function writePages(mem: Uint8Array): { page: number; data: number[] }[] {
  const pages: { page: number; data: number[] }[] = [];
  for (let p = FIRST_WRITE_PAGE; p <= LAST_WRITE_PAGE; p++) {
    pages.push({ page: p, data: Array.from(mem.subarray(p * 4, p * 4 + 4)) });
  }
  return pages;
}

/** True when bytes 16..63 (pages 4..15) of two images are identical. */
export function samePayload(a: Uint8Array, b: Uint8Array): boolean {
  for (let i = FIRST_WRITE_PAGE * 4; i < (LAST_WRITE_PAGE + 1) * 4; i++) if (a[i] !== b[i]) return false;
  return true;
}

export type Command =
  | 'roast-grind-brew'
  | 'roast'
  | 'roast-grind-brew-delayed'
  | 'grind'
  | 'grind-brew'
  | 'brew'
  | 'reset-filter'
  | 'request-filter'
  | 'clean-grinder'
  | 'descale'
  | 'unknown';

export function commandOf(type: number): Command {
  switch (type) {
    case 1: return 'roast-grind-brew';
    case 2: return 'roast';
    case 3: return 'roast-grind-brew-delayed';
    case 4: return 'grind';
    case 5: return 'grind-brew';
    case 6: return 'brew';
    case 0x0f: return 'reset-filter';
    case 0x11: return 'request-filter';
    case 0x12: return 'clean-grinder';
    case 0x13: return 'descale';
    default: return 'unknown';
  }
}

export const COMMAND_LABEL: Record<Command, string> = {
  'roast-grind-brew': 'Roast, grind and brew',
  roast: 'Roast only',
  'roast-grind-brew-delayed': 'Roast, grind and brew (delayed)',
  grind: 'Grind only',
  'grind-brew': 'Grind and brew',
  brew: 'Brew only',
  'reset-filter': 'Reset the air filter count',
  'request-filter': 'Ask for a new filter',
  'clean-grinder': 'Clean the grinder',
  descale: 'Descale',
  unknown: 'Unknown card',
};

export interface CardInfo {
  uid: string;
  command: Command;
  typeByte: number;
  crc16: Crc16Variant;
  crc8Valid: boolean;
  pauseMinutes: number;
  /** Both checksums good: the machine will accept it. */
  valid: boolean;
  /** Pages 4-15 are all zero: a blank card. */
  blank: boolean;
}

export function describe(mem: Uint8Array): CardInfo {
  const typeByte = mem[41];
  const command = commandOf(typeByte);
  const c16 = crc16Variant(mem);
  const crc8Valid = mem[60] === crc8ForTag(mem);
  let blank = true;
  for (let i = 16; i < 64; i++) if (mem[i] !== 0) { blank = false; break; }
  return {
    uid: toHex(mem.subarray(0, 9)),
    command,
    typeByte,
    crc16: c16,
    crc8Valid,
    pauseMinutes: command === 'roast-grind-brew' || command === 'roast-grind-brew-delayed' ? pauseMinutes(mem) : 0,
    valid: !blank && c16 !== 'no-match' && crc8Valid,
    blank,
  };
}

/** One 4-byte page per line, hex. The format VerdeNFC and Mifare++ Ultra use. */
export function imageToDumpText(mem: Uint8Array): string {
  const lines: string[] = [];
  for (let p = 0; p < 20; p++) lines.push(toHex(mem.subarray(p * 4, p * 4 + 4)));
  return lines.join('\n') + '\n';
}

/** Reads plain dumps (one page per line) and annotated hackaverde dumps ("[ AA:BB:CC:DD ] Addr. 04 : DATA"). */
export function imageFromDumpText(text: string): Uint8Array {
  const mem = new Uint8Array(TAG_SIZE);
  let index = 0;
  for (const raw of text.split(/\r?\n/)) {
    const annotated = raw.match(/\[\s*([0-9A-Fa-f:\s]+)\]\s*Addr\.\s*([0-9A-Fa-f]+)/);
    if (annotated) {
      const addr = parseInt(annotated[2], 16);
      const bytes = hexToBytes(annotated[1]);
      if (addr * 4 + 4 <= TAG_SIZE) mem.set(bytes.subarray(0, 4), addr * 4);
      index = Math.max(index, addr * 4 + 4);
      continue;
    }
    const clean = raw.trim().replace(/[^0-9a-fA-F]/g, '');
    if (clean.length < 8 || index >= TAG_SIZE) continue;
    mem.set(hexToBytes(clean.slice(0, 8)), index);
    index += 4;
  }
  return mem;
}
