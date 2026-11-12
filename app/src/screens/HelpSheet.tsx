import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CARD_TO_BUY, HELP } from '../content/help';
import { PressScale } from '../ui/Pressable';
import { Sheet } from '../ui/Sheet';
import { color, radius, space, type } from '../ui/tokens';
import { TRADEMARK_NOTICE } from '../content/about';

/** Plain answers, most-asked first. The card to buy is pinned at the top. */
export function HelpSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Sheet visible={visible} title="Help" onClose={onClose}>
      <View style={styles.buy}>
        <Text style={styles.buyLabel}>The card to buy</Text>
        <Text style={type.title}>{CARD_TO_BUY.name}</Text>
        <Text style={type.secondary}>Chip {CARD_TO_BUY.part}. 13.56 MHz. 48 bytes of memory.</Text>
        <Text style={[type.body, { marginTop: space.s }]}>Search for “{CARD_TO_BUY.search[0]}”.</Text>
      </View>

      {HELP.map((t, i) => {
        const isOpen = open === i;
        return (
          <View key={t.q} style={styles.item}>
            <PressScale
              onPress={() => setOpen(isOpen ? null : i)}
              style={styles.q}
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
            >
              <Text style={styles.qText}>{t.q}</Text>
              <Text style={styles.chev}>{isOpen ? '−' : '+'}</Text>
            </PressScale>
            {isOpen && (
              <View style={styles.a}>
                {t.a.map((line) => (
                  <Text key={line} style={type.body}>{line}</Text>
                ))}
              </View>
            )}
          </View>
        );
      })}

      <Text style={[type.secondary, { marginTop: space.l }]}>The story behind the app and the people we thank are in More, under About.</Text>
      <Text style={[type.caption, { marginTop: space.m }]}>{TRADEMARK_NOTICE}</Text>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  buy: { backgroundColor: color.paper, borderRadius: radius.card, padding: space.l, gap: space.xs, marginBottom: space.m, borderLeftWidth: 6, borderLeftColor: color.verde },
  buyLabel: { fontSize: 13, fontWeight: '700', color: color.verde, textTransform: 'uppercase', letterSpacing: 0.8 },
  item: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: color.oak },
  q: { minHeight: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.m },
  qText: { fontSize: 17, fontWeight: '700', color: color.espresso, flexShrink: 1 },
  chev: { fontSize: 22, fontWeight: '700', color: color.verde, width: 20, textAlign: 'center' },
  a: { gap: space.s, paddingBottom: space.m },
});
