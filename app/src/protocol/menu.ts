import { GrindSeconds } from './grind';
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
  /** Picking this item also sets the grind time. */
  autoGrindSeconds?: GrindSeconds;
  /** A named community roast, shown in its own Special roasts group. */
  special?: true;
}

export const MENU: readonly MenuItem[] = [
  // Green beans in, coffee out
  { id: 'rgb-full', mode: 'roast-grind-brew', title: 'Full Pot', detail: '80 g green beans, 900 ml', profileKey: 'tavares80' },
  { id: 'rgb-half', mode: 'roast-grind-brew', title: 'Half Pot', detail: '50 g green beans, 600 ml', profileKey: 'tavares50' },
  { id: 'rgb-big', mode: 'roast-grind-brew', title: 'Big Pot', detail: '90 g green beans, 1 L, grinds 75 s', profileKey: 'tavares80', autoGrindSeconds: 75 },
  { id: 'rgb-overnight', mode: 'roast-grind-brew', title: 'Overnight', detail: 'Roast tonight, brew in 10 hours', profileKey: 'tavaresnight', autoPauseMinutes: 600 },
  // Roast only
  { id: 'roast-light', mode: 'roast', title: 'Light Roast', detail: '50 g, gentle', profileKey: 'uni-light' },
  { id: 'roast-medium', mode: 'roast', title: 'Medium Roast', detail: '50 g, the all-rounder', profileKey: 'uni-medium' },
  { id: 'roast-dark', mode: 'roast', title: 'Dark Roast', detail: '50 g, longest roast', profileKey: 'uni-dark' },
  { id: 'roast-batch', mode: 'roast', title: 'Big Batch', detail: '80 g, beans for the week', profileKey: 'uni-80' },
  // Special roasts: the named community roast cards, between medium and dark
  { id: 'special-wave', mode: 'roast', title: 'The Wave', detail: '50 g, medium to dark', profileKey: 'roast-wave', special: true },
  { id: 'special-postcard', mode: 'roast', title: 'Postcard', detail: '50 g, medium to dark', profileKey: 'roast-postcard', special: true },
  { id: 'special-monpaka', mode: 'roast', title: 'Monpaka', detail: '80 g, medium to dark', profileKey: 'roast-monpaka', special: true },
  { id: 'special-flashpump', mode: 'roast', title: 'Flash Pump', detail: '80 g, long and dark', profileKey: 'roast-flashpump', special: true },
  { id: 'special-ojo', mode: 'roast', title: 'Ojo de Aqua', detail: '80 g, long and dark', profileKey: 'roast-ojo', special: true },
  // Already roasted beans
  { id: 'gb-full', mode: 'grind-brew', title: 'Full Pot', detail: 'Roasted beans, 80 g', profileKey: 'gb-80' },
  { id: 'gb-half', mode: 'grind-brew', title: 'Half Pot', detail: 'Roasted beans, 20 to 50 g', profileKey: 'gb-small' },
  { id: 'grind', mode: 'grind', title: 'Grind Only', detail: 'Whole beans to ground', profileKey: 'grindonly' },
  { id: 'brew-hot', mode: 'brew', title: 'Hot Brew', detail: 'Ground coffee, full heat', profileKey: 'brew90' },
  { id: 'brew-gentle', mode: 'brew', title: 'Gentle Brew', detail: 'Ground coffee, lower heat', profileKey: 'brew70' },
  // Care cards
  { id: 'care-descale', mode: 'maintenance', title: 'Descale', detail: 'Clears scale from the brewer', profileKey: 'descale' },
  { id: 'care-grinder', mode: 'maintenance', title: 'Clean Grinder', detail: 'Use with cleaning beans', profileKey: 'clean-grinder' },
  { id: 'care-rinse', mode: 'maintenance', title: 'Rinse', detail: 'Hot water through the brewer, no coffee', profileKey: 'brew90' },
  { id: 'care-filter', mode: 'maintenance', title: 'Reset Air Filter', detail: 'After you fit a new filter', profileKey: 'reset-filter' },
];

/** The one-tap default on the home screen. */
export const DEFAULT_ITEM_ID = 'rgb-full';

export const SPECIAL_LABEL = 'Special roasts';

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
