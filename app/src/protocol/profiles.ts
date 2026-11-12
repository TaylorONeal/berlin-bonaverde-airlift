/**
 * The community card templates.
 *
 * Each template is the 34 payload bytes a Berlin card carries at offset 16.
 * These byte values were collected by the Bonaverde owner community and first
 * published in VerdeNFC (Apache 2.0, see /NOTICE). The checksums inside them
 * are placeholders: the app recomputes both for the real card on every write.
 *
 * Transcribed by script from an earlier Kotlin version, and checked against
 * real card dumps in __tests__ and tools/verify_checksums.py.
 */

export type Mode = 'roast-grind-brew' | 'roast' | 'grind' | 'grind-brew' | 'brew' | 'maintenance';

export interface Profile {
  key: string;
  /** Id in VerdeNFC's list, for traceability. */
  verdeId: number;
  name: string;
  mode: Mode;
  templateHex: string;
  note: string;
}

export const PROFILES: readonly Profile[] = [
  { key: 'tavares50', verdeId: 1, name: 'Tavares - Brazil', mode: 'roast-grind-brew', templateHex: 'AAA0504B05 AAAA414678 AAB4414B05 AAB4414B96 375A5A2D 23 01 1E 000601 891A 0000', note: '50g / 6dl' },
  { key: 'tavares80', verdeId: 2, name: 'Tavares - Brazil', mode: 'roast-grind-brew', templateHex: 'AAB84B4B00 AAB832465A AAB64B5A00 AAB6324664 3C465A2D 32 01 1E 000501 5DFD 0005', note: '80g / 9dl' },
  { key: 'flor55', verdeId: 3, name: 'Flor de Corazon - Mexico', mode: 'roast-grind-brew', templateHex: 'AAB4324B00 AAB4324650 AAAE325A00 AAAE32465A 3C465A2D 23 01 0F 000501 ED37 0003', note: '55g / 6dl' },
  { key: 'flor80', verdeId: 4, name: 'Flor de Corazon - Mexico', mode: 'roast-grind-brew', templateHex: 'AAB44B4B00 AAB4324655 AAB44B5A00 AAB432465F 3C465A2D 32 01 1E 000501 2C78 0001', note: '80g / 9dl' },
  { key: 'ocean84', verdeId: 5, name: 'Ocean College - Costa Rica', mode: 'roast-grind-brew', templateHex: 'AAB84B4B00 AAB832465A AAB64B5A00 AAB6324664 3C465A2D 32 01 1E 000501 F205 0005', note: '84g / 9dl' },
  { key: 'luis80', verdeId: 6, name: 'Luis Alberto - Nicaragua', mode: 'roast-grind-brew', templateHex: 'AAB84B4B00 AAB832465A AAB64B5A00 AAB6324664 3C465A2D 32 01 1E 000501 49C9 0005', note: '80g / 9dl' },
  { key: 'alfaro80', verdeId: 7, name: 'Alfaro Family - El Salvador', mode: 'roast-grind-brew', templateHex: 'AAB04B5A05 AAB0415078 AAB4415A05 AAB4415050 37465A50 32 01 1E 000601 3F40 0005', note: '80g / 9dl' },
  { key: 'surprise80', verdeId: 8, name: 'Surprise 1', mode: 'roast-grind-brew', templateHex: 'AAB84B4B00 AAB832465F AAB64B5A00 AAB632465A 3C465A2D 32 01 1E 000501 9D29 0005', note: '80g / 9dl' },
  { key: 'wallace50', verdeId: 9, name: 'Wallace Family - Colombia', mode: 'roast-grind-brew', templateHex: 'AAB0644B05 AAB0414678 AABA5F5A05 AABA41463C 376E5A2D 23 01 1E 000601 71AC 0000', note: '50g / 6dl' },
  { key: 'wallace80', verdeId: 10, name: 'Wallace Family - Colombia', mode: 'roast-grind-brew', templateHex: 'AAB64B4B00 AAB632464B AAB44B5A00 AAB4324664 3C465A2D 32 01 1E 000501 F066 0005', note: '80g / 9dl' },
  { key: 'wallace80alt', verdeId: 11, name: 'Wallace Family - Colombia (alt)', mode: 'roast-grind-brew', templateHex: 'AAB64C4B00 AAB638464E AAB64C5A00 AAB6334664 3C465A2D 32 01 1E 000501 B282 0005', note: '80g / 9dl' },
  { key: 'tavaresnight', verdeId: 12, name: 'Tavares Night (10h pause)', mode: 'roast-grind-brew', templateHex: 'AAB84B4B00 AAB832465A AAB64B5A00 AAB6324664 3C465A2D 32 01 2D 000501 CCFE 0258', note: 'Roast now, brew in 10h - 80g / 9dl' },
  { key: 'badge', verdeId: 13, name: 'Coffee Changer Badge', mode: 'roast-grind-brew', templateHex: 'AA96644B05 AA96413278 AAA25F5005 AAB6414696 376E5A2D 23 01 0F 000601 AB13 0000', note: 'The member badge card' },
  { key: 'uni-light', verdeId: 41, name: 'Universal - Light', mode: 'roast', templateHex: 'AAB94B3205 AAB94B325A AAB94B3205 AAB94B3232 3C463250 32 02 1E 000601 5D03 000A', note: '50g / 6dl' },
  { key: 'uni-medium', verdeId: 42, name: 'Universal - Medium', mode: 'roast', templateHex: 'AA645A3205 AA9632327D AAB4463C05 AAC0323C78 376E3C2D 23 02 0F 000601 F501 000A', note: '50g / 6dl' },
  { key: 'uni-dark', verdeId: 43, name: 'Universal - Dark', mode: 'roast', templateHex: 'AA645A3205 AA9632327D AAB4463C05 AAC0323C96 376E3C2D 23 02 0F 000601 8312 000A', note: '50g / 6dl' },
  { key: 'roast-alfaro', verdeId: 44, name: 'Alfaro Family', mode: 'roast', templateHex: 'AAAE4B5A05 AAAE415078 AAB4415A05 AAB4415050 37465A50 23 02 0F 000601 6113 0000', note: '80g / 9dl' },
  { key: 'uni-80', verdeId: 44, name: 'Universal', mode: 'roast', templateHex: 'AAB24B4B00 AAB2324678 AAB54B5A00 AAB5324655 3C465A2D 32 02 1E 000501 7903 0005', note: '80g / 1L' },
  { key: 'roast-postcard', verdeId: 45, name: 'Postcard', mode: 'roast', templateHex: 'AAA0644B05 AAA0414658 AAB25FF005 AAB241468C 376E5A2D 23 02 0F 000601 9D11 0001', note: '50g / 6dl' },
  { key: 'roast-wave', verdeId: 46, name: 'The Wave', mode: 'roast', templateHex: 'AAA0644B05 AAA0414655 AAB25F5005 AAB2414687 375A5A2D 23 02 0F 000601 740F 0001', note: '50g / 6dl' },
  { key: 'roast-flashpump', verdeId: 47, name: 'Flash Pump', mode: 'roast', templateHex: 'AAAA644B00 AAB8414664 AAB4414600 AAB4414655 3C463C50 3C 02 3C 000501 1E10 0007', note: '80g / 9dl' },
  { key: 'roast-ojo', verdeId: 48, name: 'Ojo de Aqua', mode: 'roast', templateHex: 'AAB44B4B05 AAB44B465F AAB24B4B05 AAB24B4687 373C4650 32 02 3C 000601 6A13 0007', note: '80g / 9dl' },
  { key: 'roast-monpaka', verdeId: 49, name: 'Monpaka', mode: 'roast', templateHex: 'AAAA644B00 AAB4414696 AAB2415A00 AAB041465F 3C5A5A2D 23 02 0F 000501 EB10 0000', note: '80g / 9dl' },
  { key: 'roast-flor', verdeId: 50, name: 'Flor de Corazon', mode: 'roast', templateHex: 'AA92644B05 AA92414678 AAAC5F5005 AAB23C4696 37465A2D 23 02 0F 000601 E401 0001', note: '80g / 9dl' },
  { key: 'roast-tavares', verdeId: 51, name: 'Ricardo Tavares', mode: 'roast', templateHex: 'AAA0644B05 AAA0414655 AAB25F5005 AAB2414687 37465A2D 23 03 0F 000601 1E12 0000', note: '80g / 9dl' },
  { key: 'gb-small', verdeId: 81, name: 'Grind & Brew', mode: 'grind-brew', templateHex: 'AAB44B4B00 AAB432464B AAAE4B5A00 AAAE32465A 3C6E5A14 14 05 2D 000501 4A01 0000', note: '20-50g' },
  { key: 'gb-80', verdeId: 82, name: 'Grind & Brew', mode: 'grind-brew', templateHex: 'AAB0644B05 AAB0414678 AABA5F5A05 AABA41463C 376E5A2D 23 05 1E 000601 AB08 0000', note: '80g' },
  { key: 'brew70', verdeId: 83, name: 'Brew only - 70C', mode: 'brew', templateHex: 'AAAA644B00 AAB8414664 AAB2415A00 AAB0414655 3C465A2D 23 06 0F 000501 A602 0000', note: '' },
  { key: 'brew90', verdeId: 84, name: 'Brew only - 90C', mode: 'brew', templateHex: 'AA41644B05 AA4B413278 AA565F5005 AA5D414696 37375A2D 23 06 0F 000601 2BF2 0000', note: '' },
  { key: 'grindonly', verdeId: 85, name: 'Grind only', mode: 'grind', templateHex: 'AAB24B4B00 AAB2324678 AAB54B5A00 AAB5324655 3C465A2D 32 04 1E 000501 1A02 0005', note: '' },
  { key: 'descale', verdeId: 97, name: 'Descale brewing system', mode: 'maintenance', templateHex: 'AAB44B4B05 AAB44B465F AAB24B5005 AAB24B4687 37465A2D 23 13 2D 000601 7F56 0007', note: 'Type 0x13' },
  { key: 'clean-grinder', verdeId: 98, name: 'Clean grinder', mode: 'maintenance', templateHex: 'AAB44B4B00 AAB432464E AAB44B5A99 AAB4324666 3C465A2D 32 12 1E 000501 8D5E 0005', note: 'With cleaning beans - Type 0x12' },
  { key: 'reset-filter', verdeId: 99, name: 'Reset air filter counter', mode: 'maintenance', templateHex: 'AA96644B05 AA96413278 AAAC5F5005 AAB6414696 376E5A2D 23 0F 0F 000601 8D7C 0000', note: 'Type 0x0F' },
];

export function profileByKey(key: string): Profile {
  const p = PROFILES.find((x) => x.key === key);
  if (!p) throw new Error(`No profile ${key}`);
  return p;
}
