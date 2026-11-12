import { Mode, PROFILES, Profile, profileByKey } from './profiles';

/**
 * What people actually pick. Each item points at one community template.
 * Copy here shows up in the app, so keep it short, plain and friendly.
 */
export interface MenuItem {
  id: string;
  mode: Mode;
  title: string;
  /** One short line under the title. */
  detail: string;
  profileKey: string;
  /** Picking this item also sets the pause after roasting. */
  autoPauseMinutes?: number;
}

export const MENU: readonly MenuItem[] = [
  // Green beans in, coffee out
  { id: 'rgb-full', mode: 'roast-grind-brew', title: 'Full Pot', detail: '80 g green beans, 900 ml', profileKey: 'tavares80' },
  { id: 'rgb-half', mode: 'roast-grind-brew', title: 'Half Pot', detail: '50 g green beans, 600 ml', profileKey: 'tavares50' },
  { id: 'rgb-overnight', mode: 'roast-grind-brew', title: 'Overnight', detail: 'Roast tonight, brew in 10 hours', profileKey: 'tavaresnight', autoPauseMinutes: 600 },
  // Roast only
  { id: 'roast-light', mode: 'roast', title: 'Light Roast', detail: '50 g, gentle', profileKey: 'uni-light' },
  { id: 'roast-medium', mode: 'roast', title: 'Medium Roast', detail: '50 g, the all-rounder', profileKey: 'uni-medium' },
  { id: 'roast-dark', mode: 'roast', title: 'Dark Roast', detail: '50 g, longest roast', profileKey: 'uni-dark' },
  { id: 'roast-batch', mode: 'roast', title: 'Big Batch', detail: '80 g, beans for the week', profileKey: 'uni-80' },
  // Already roasted beans
  { id: 'gb-full', mode: 'grind-brew', title: 'Full Pot', detail: 'Roasted beans, 80 g', profileKey: 'gb-80' },
  { id: 'gb-half', mode: 'grind-brew', title: 'Half Pot', detail: 'Roasted beans, 20 to 50 g', profileKey: 'gb-small' },
  { id: 'grind', mode: 'grind', title: 'Grind Only', detail: 'Whole beans to ground', profileKey: 'grindonly' },
  { id: 'brew-hot', mode: 'brew', title: 'Hot Brew', detail: 'Ground coffee, full heat', profileKey: 'brew90' },
  { id: 'brew-gentle', mode: 'brew', title: 'Gentle Brew', detail: 'Ground coffee, lower heat', profileKey: 'brew70' },
  // Care cards
  { id: 'care-descale', mode: 'maintenance', title: 'Descale', detail: 'Clears scale from the brewer', profileKey: 'descale' },
  { id: 'care-grinder', mode: 'maintenance', title: 'Clean Grinder', detail: 'Use with cleaning beans', profileKey: 'clean-grinder' },
  { id: 'care-filter', mode: 'maintenance', title: 'Reset Air Filter', detail: 'After you fit a new filter', profileKey: 'reset-filter' },
];

/** The one-tap default on the home screen. */
export const DEFAULT_ITEM_ID = 'rgb-full';

export const MODE_LABEL: Record<Mode, string> = {
  'roast-grind-brew': 'Roast, grind, brew',
  roast: 'Roast only',
  'grind-brew': 'Grind and brew',
  grind: 'Grind only',
  brew: 'Brew only',
  maintenance: 'Care',
};

export function menuItem(id: string): MenuItem {
  const m = MENU.find((x) => x.id === id);
  if (!m) throw new Error(`No menu item ${id}`);
  return m;
}

export function profileFor(item: MenuItem): Profile {
  return profileByKey(item.profileKey);
}

/** Original grower cards kept for people who want them, not shown by default. */
export const ARCHIVED_PROFILES: readonly Profile[] = PROFILES.filter(
  (p) => !MENU.some((m) => m.profileKey === p.key),
);
