import { imageFromTemplate, MenuItem, menuItem, modeGrinds, profileFor, withGrindSeconds, withPauseMinutes } from '../protocol';
import { Prefs } from '../state/store';

/** The exact template image the home button will write, from the current picks. */
export function templateFor(prefs: Prefs): { item: MenuItem; image: Uint8Array } {
  const item = menuItem(prefs.itemId);
  let image = imageFromTemplate(profileFor(item).templateHex);
  if (item.mode === 'roast-grind-brew' && prefs.pauseMinutes != null) image = withPauseMinutes(image, prefs.pauseMinutes);
  if (modeGrinds(item.mode) && prefs.grindSeconds != null) image = withGrindSeconds(image, prefs.grindSeconds);
  return { item, image };
}

/** The line under the big button, e.g. "Full Pot. Reusable." */
export function summaryLine(prefs: Prefs, item: MenuItem): string {
  const parts = [item.title];
  if (item.mode === 'roast-grind-brew' && prefs.pauseMinutes) parts.push(`Brews ${pauseShort(prefs.pauseMinutes)} after roasting`);
  if (modeGrinds(item.mode) && prefs.grindSeconds != null && item.autoGrindSeconds !== prefs.grindSeconds) parts.push(`Grinds ${prefs.grindSeconds} s`);
  parts.push(prefs.multiUse ? 'Reusable' : 'Single use');
  return parts.join('. ') + '.';
}

function pauseShort(m: number) {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} h ${r} min` : `${h} h`;
}
