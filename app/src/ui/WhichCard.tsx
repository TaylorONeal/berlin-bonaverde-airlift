import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { CARD_TO_BUY } from '../content/help';
import { color, radius, space } from './tokens';

/** The card's antenna coil, drawn small on the right of the card. */
function Coil() {
  return (
    <Svg width={84} height={84} viewBox="0 0 84 84" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {[0, 1, 2, 3].map((i) => (
        <Rect key={i} x={4 + i * 9} y={4 + i * 9} width={76 - i * 18} height={76 - i * 18} rx={12} fill="none" stroke={color.oak} strokeWidth={3} />
      ))}
    </Svg>
  );
}

const ROWS: { ok: boolean; label: string }[] = [
  { ok: true, label: CARD_TO_BUY.name },
  { ok: false, label: 'NTAG cards' },
  { ok: false, label: 'MIFARE Classic' },
  { ok: false, label: 'A plain "NFC card"' },
];

/** The card to buy, drawn as a card, with a quick yes and no list under it. */
export function WhichCard() {
  return (
    <View style={styles.wrap}>
      <View style={styles.card} accessible accessibilityLabel={`The card to buy: ${CARD_TO_BUY.name}, chip ${CARD_TO_BUY.part}, 13.56 megahertz.`}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={styles.label}>The one to buy</Text>
          <Text style={styles.big}>MIFARE</Text>
          <Text style={styles.mid}>Ultralight EV1</Text>
          <Text style={styles.small}>{CARD_TO_BUY.part} · 13.56 MHz</Text>
        </View>
        <Coil />
      </View>
      <View style={styles.rows}>
        {ROWS.map((r) => (
          <View key={r.label} style={styles.row} accessible accessibilityLabel={`${r.ok ? 'Works' : 'Will not work'}: ${r.label}`}>
            <View style={[styles.mark, { backgroundColor: r.ok ? color.verde : color.ember }]}>
              <Text style={styles.markText}>{r.ok ? '✓' : '✕'}</Text>
            </View>
            <Text style={styles.rowText}>{r.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.m },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: space.m,
    backgroundColor: color.cream, borderRadius: radius.chip, borderWidth: 3, borderColor: color.espresso,
    padding: space.m, transform: [{ rotate: '-2deg' }],
  },
  label: { fontSize: 13, fontWeight: '800', color: color.verde, textTransform: 'uppercase', letterSpacing: 0.8 },
  big: { fontFamily: 'Fraunces_800ExtraBold', fontSize: 30, lineHeight: 32, color: color.espresso },
  mid: { fontFamily: 'Fraunces_800ExtraBold', fontSize: 22, lineHeight: 26, color: color.espresso },
  small: { fontSize: 13, fontWeight: '700', color: color.walnut },
  rows: { gap: space.s },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s },
  mark: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  markText: { color: color.cream, fontWeight: '800', fontSize: 15 },
  rowText: { fontSize: 16, fontWeight: '700', color: color.espresso, flexShrink: 1 },
});
