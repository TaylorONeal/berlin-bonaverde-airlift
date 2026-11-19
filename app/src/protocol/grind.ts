/**
 * Grind time, set by two bytes of the card.
 *
 *  - byte 39: the seconds shown by card apps (45, 60 or 75).
 *  - byte 40: what the Berlin actually runs: 0x23 = 45 s, 0x32 = 60 s, 0x40 = 75 s.
 *
 * Owners found these by testing real cards and published them on the community
 * site bonaverde-berlin.org (Roasting Profiles, "Modifying the Grinding Time").
 * Their rule of thumb: 50 g of beans 45 s, 70 g 60 s, 90 g 75 s.
 * Only the three tested values are offered. Anything else stays as the card has it.
 */
export type GrindSeconds = 45 | 60 | 75;

export const GRIND_CHOICES: readonly GrindSeconds[] = [45, 60, 75];

const MACHINE_BYTE: Record<GrindSeconds, number> = { 45: 0x23, 60: 0x32, 75: 0x40 };

export const GRIND_DISPLAY_BYTE = 39;
export const GRIND_MACHINE_BYTE = 40;

/** The grind time a card runs, or null when its byte 40 is not one of the tested values. */
export function grindSeconds(mem: Uint8Array): GrindSeconds | null {
  const b = mem[GRIND_MACHINE_BYTE];
  for (const s of GRIND_CHOICES) if (MACHINE_BYTE[s] === b) return s;
  return null;
}

export function withGrindSeconds(mem: Uint8Array, seconds: GrindSeconds): Uint8Array {
  const out = new Uint8Array(mem);
  out[GRIND_DISPLAY_BYTE] = seconds;
  out[GRIND_MACHINE_BYTE] = MACHINE_BYTE[seconds];
  return out;
}

/** Commands that grind, so a grind time means something. */
export function modeGrinds(mode: string): boolean {
  return mode === 'roast-grind-brew' || mode === 'grind' || mode === 'grind-brew';
}
