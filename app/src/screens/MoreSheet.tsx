import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { MENU } from '../protocol';
import { HistoryEntry, Prefs } from '../state/store';
import { HoldButton } from '../ui/HoldButton';
import { Machine } from '../ui/Machine';
import { Sheet } from '../ui/Sheet';
import { DEMO_ALLOWED } from '../config';
import { color, radius, space, type } from '../ui/tokens';

export const TRADEMARK_NOTICE =
  'Berlin Airlift is an independent community project. It is not made, endorsed or supported by Bonaverde or by the owners of the Bonaverde and Berlin trademarks. Bonaverde and Berlin are trademarks of their respective owners and are named here only to say which machine the app works with.';

export function MoreSheet({ visible, prefs, history, demo, onChange, onCare, onDemo, onClose }: {
  visible: boolean;
  prefs: Prefs;
  history: HistoryEntry[];
  demo: boolean;
  onChange: (p: Partial<Prefs>) => void;
  onCare: (itemId: string) => void;
  onDemo: (on: boolean) => void;
  onClose: () => void;
}) {
  return (
    <Sheet visible={visible} title="More" onClose={onClose}>
      <Text style={styles.label}>Care cards</Text>
      <View style={styles.block}>
        {MENU.filter((m) => m.mode === 'maintenance').map((m) => (
          <View key={m.id} style={{ gap: 4 }}>
            <HoldButton label={`Hold to write a ${m.title} card`} onConfirm={() => onCare(m.id)} />
            <Text style={[type.caption, { textAlign: 'center' }]}>{m.detail}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.label}>Settings</Text>
      <View style={styles.block}>
        <Row label="Reusable cards" hint="Off makes single-use cards, like the originals." value={prefs.multiUse} onChange={(v) => onChange({ multiUse: v })} />
        <Row label="Haptics" value={prefs.haptics} onChange={(v) => onChange({ haptics: v })} />
        {DEMO_ALLOWED && <Row label="Demo mode" hint="Practice with a pretend card." value={demo} onChange={onDemo} />}
      </View>

      <Text style={styles.label}>Cards you made</Text>
      <View style={styles.block}>
        {history.length === 0 ? (
          <Text style={type.secondary}>Nothing yet. Your first card shows up here.</Text>
        ) : (
          history.slice(0, 10).map((h, i) => (
            <View key={i} style={styles.histRow}>
              <Text style={type.body}>{h.title}</Text>
              <Text style={type.caption}>{new Date(h.at).toLocaleDateString()}</Text>
            </View>
          ))
        )}
      </View>

      <Text style={styles.label}>About</Text>
      <View style={[styles.block, { alignItems: 'center' }]}>
        <Machine size={120} />
        <Text style={[type.body, { textAlign: 'center' }]}>
          Berlin Airlift is free, open source and made by owners, so every Berlin can keep roasting, grinding and brewing.
        </Text>
        <Text style={[type.secondary, { textAlign: 'center' }]}>No account, no ads, no tracking. Licensed under Apache 2.0.</Text>
        <Text style={[type.secondary, { textAlign: 'center' }]}>
          The card format comes from the community work of VerdeNFC by Bernd Trappe and the hackaverde project. Thank you.
        </Text>
        <Text style={[type.caption, { textAlign: 'center' }]}>{TRADEMARK_NOTICE}</Text>
      </View>
    </Sheet>
  );
}

function Row({ label, hint, value, onChange }: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={type.body}>{label}</Text>
        {hint && <Text style={type.caption}>{hint}</Text>}
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: color.verde, false: color.paper }} accessibilityLabel={label} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...type.caption, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: space.s, marginTop: space.s },
  block: { backgroundColor: color.paper, borderRadius: radius.card, padding: space.m, gap: space.m, marginBottom: space.m },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.m, minHeight: 56 },
  histRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
