/** Berlin Airlift design tokens. Warm curved wood, cream paper, one green. */
export const color = {
  cream: '#F6EFE3',
  paper: '#EADFCB',
  oak: '#C99B66',
  oakLight: '#D9B485',
  walnut: '#5B3A26',
  espresso: '#2A1B12',
  bark: '#6B5444',
  verde: '#17703D',
  verdeDeep: '#0F5A30',
  verdePop: '#7BE495',
  ember: '#A6402A',
  white: '#FFFFFF',
} as const;

export const radius = { sheet: 28, card: 28, chip: 20, pill: 999, min: 16 } as const;

export const space = { xs: 4, s: 8, m: 16, l: 24, xl: 32, xxl: 48 } as const;

export const font = {
  display: 'Fraunces_800ExtraBold',
  displaySoft: 'Fraunces_600SemiBold',
} as const;

export const type = {
  hero: { fontFamily: font.display, fontSize: 40, lineHeight: 44, color: color.espresso },
  title: { fontFamily: font.display, fontSize: 32, lineHeight: 36, color: color.espresso },
  sheetTitle: { fontFamily: font.displaySoft, fontSize: 26, lineHeight: 30, color: color.espresso },
  body: { fontSize: 17, lineHeight: 24, color: color.espresso },
  secondary: { fontSize: 15, lineHeight: 21, color: color.bark },
  caption: { fontSize: 13, lineHeight: 18, color: color.bark },
} as const;

export const touch = { min: 56, primary: 96 } as const;

export const shadow = {
  shadowColor: color.walnut,
  shadowOpacity: 0.18,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 8 },
  elevation: 6,
} as const;
