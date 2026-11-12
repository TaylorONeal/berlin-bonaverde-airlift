/**
 * The pause-after-roast slider: 1 minute steps up to 2 hours, 5 minute steps up
 * to 6 hours, 15 minute steps up to 24 hours. Same stepping VerdeNFC uses.
 */
export const MAX_TICK = 240;

export function minutesFromTick(tick: number): number {
  const t = Math.max(0, Math.min(MAX_TICK, Math.round(tick)));
  if (t < 120) return t;
  if (t < 168) return 120 + 5 * (t - 120);
  return 360 + 15 * (t - 168);
}

export function tickFromMinutes(minutes: number): number {
  const m = Math.max(0, minutes);
  if (m < 120) return Math.round(m);
  if (m < 360) return Math.floor((m - 120) / 5) + 120;
  return Math.min(MAX_TICK, Math.floor((m - 360) / 15) + 168);
}

export function pauseLabel(minutes: number): string {
  if (minutes <= 0) return 'Right away';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}
