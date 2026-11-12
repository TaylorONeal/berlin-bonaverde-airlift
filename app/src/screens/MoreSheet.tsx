import React from 'react';
import { Linking, StyleSheet, Switch, Text, View } from 'react-native';
import { OPEN_SOURCE, REPO_URL, STORY, THANKS, TRADEMARK_NOTICE } from '../content/about';
import { MENU } from '../protocol';
import { HistoryEntry, Prefs } from '../state/store';
import { HoldButton } from '../ui/HoldButton';
import { Machine } from '../ui/Machine';
import { PressScale } from '../ui/Pressable';
import { Sheet } from '../ui/Sheet';
import { color, radius, space, type } from '../ui/tokens';

export { TRADEMARK_NOTICE };

export function MoreSheet({ visible, prefs, history, onChange, onCare, onHelp, onClose }: {
  visible: boolean;
  prefs: Prefs;
  history: HistoryEntry[];
  onChange: (p: Partial<Prefs>) => void;
  onCare: (itemId: string) => void;
  onHelp: () => void;
  onClose: () => void;
}) {
  return (
    <Sheet visible={visible} title="More" onClose={onClose}>
      <Text style={styles.label}>Care cards</Text>
      <View style={styles.block}>
        <Text style={type.secondary}>Hold a button until it fills to write that card.</Text>
        {MENU.filter((m) => m.mode === 'maintenance').map((m) => (
          <View key={m.id} style={{ gap: 4 }}>
            <HoldButton label={`${m.title} card`} onConfirm={() => onCare(m.id)} />
            <Text style={[type.caption, { textAlign: 'center' }]}>{m.detail}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.label}>Settings</Text>
      <View style={styles.block}>
        <Row label="Reusable cards" hint="Off makes single-use cards, like the originals." value={prefs.multiUse} onChange={(v) => onChange({ multiUse: v })} />
        <Row label="Haptics" value={prefs.haptics} onChange={(v) => onChange({ haptics: v })} />
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

      <Text style={styles.label}>Help</Text>
      <View style={styles.block}>
        <LinkRow label="Which card to buy, and how it works" onPress={onHelp} />
      </View>

      <Text style={styles.label}>About</Text>
      <View style={[styles.block, { alignItems: 'center' }]}>
        <Machine size={120} />
        <Text style={[type.title, { textAlign: 'center', fontSize: 26, lineHeight: 30 }]}>Made by owners, for owners</Text>
        {STORY.map((p) => (
          <Text key={p} style={[type.body, { alignSelf: 'stretch' }]}>{p}</Text>
        ))}
      </View>

      <Text style={styles.label}>Thank you</Text>
      <View style={styles.block}>
        {THANKS.map((t) => (
          <View key={t.who} style={{ gap: 2 }}>
            <Text style={[type.body, { fontWeight: '700' }]}>{t.who}</Text>
            <Text style={type.secondary}>{t.what}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.label}>Open source</Text>
      <View style={styles.block}>
        <Text style={type.body}>{OPEN_SOURCE}</Text>
        <Text style={type.secondary}>No account, no ads, no tracking. Everything stays on your phone.</Text>
        <LinkRow label="See the code on GitHub" onPress={() => Linking.openURL(REPO_URL)} />
      </View>

      <Text style={[type.caption, { marginTop: space.s, marginBottom: space.l }]}>{TRADEMARK_NOTICE}</Text>
    </Sheet>
  );
}

function LinkRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <PressScale onPress={onPress} style={styles.link} accessibilityRole="button">
      <Text style={styles.linkText}>{label}</Text>
      <Text style={styles.linkArrow}>›</Text>
    </PressScale>
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
  link: { minHeight: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.m },
  linkText: { fontSize: 17, fontWeight: '700', color: color.verde, flexShrink: 1 },
  linkArrow: { fontSize: 26, fontWeight: '700', color: color.verde },
  histRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
