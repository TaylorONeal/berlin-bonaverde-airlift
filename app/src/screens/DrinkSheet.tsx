import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Slider from './Slider';
import { GRIND_CHOICES, MENU, MODE_LABEL, MenuItem, MAX_TICK, SPECIAL_LABEL, grindSeconds, minutesFromTick, modeGrinds, pauseLabel, pauseMinutes, tickFromMinutes, imageFromTemplate, profileFor, menuItem } from '../protocol';
import { PressScale } from '../ui/Pressable';
import { Sheet } from '../ui/Sheet';
import { color, radius, space, touch, type } from '../ui/tokens';
import { Prefs } from '../state/store';

const GROUPS: { key: string; label: string; items: MenuItem[] }[] = [
  { key: 'roast-grind-brew', label: MODE_LABEL['roast-grind-brew'], items: MENU.filter((m) => m.mode === 'roast-grind-brew') },
  { key: 'roast', label: MODE_LABEL.roast, items: MENU.filter((m) => m.mode === 'roast' && !m.special) },
  { key: 'special', label: SPECIAL_LABEL, items: MENU.filter((m) => m.special) },
  { key: 'grind-brew', label: MODE_LABEL['grind-brew'], items: MENU.filter((m) => m.mode === 'grind-brew') },
  { key: 'grind', label: MODE_LABEL.grind, items: MENU.filter((m) => m.mode === 'grind') },
  { key: 'brew', label: MODE_LABEL.brew, items: MENU.filter((m) => m.mode === 'brew') },
];

export function DrinkSheet({ visible, prefs, onChange, onClose }: { visible: boolean; prefs: Prefs; onChange: (p: Partial<Prefs>) => void; onClose: () => void }) {
  const current = menuItem(prefs.itemId);
  const template = imageFromTemplate(profileFor(current).templateHex);
  const defaultPause = pauseMinutes(template);
  const pause = prefs.pauseMinutes ?? defaultPause;
  const grind = prefs.grindSeconds ?? grindSeconds(template);
  return (
    <Sheet visible={visible} title="What are we making?" onClose={onClose}>
      {GROUPS.map((g) => (
        <View key={g.key} style={styles.group}>
          <Text style={styles.groupLabel}>{g.label}</Text>
          {g.key === 'special' && <Text style={[type.caption, { marginBottom: space.s }]}>Named roasts from the owner community. Green beans in, roasted beans out.</Text>}
          <View style={styles.chips}>
            {g.items.map((m) => {
              const on = m.id === prefs.itemId;
              return (
                <PressScale
                  key={m.id}
                  onPress={() => onChange({ itemId: m.id, pauseMinutes: m.autoPauseMinutes ?? null, grindSeconds: m.autoGrindSeconds ?? null })}
                  style={[styles.chip, on && styles.chipOn]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={`${m.title}, ${m.detail}`}
                >
                  <Text style={[styles.chipTitle, on && styles.chipTitleOn]}>{m.title}</Text>
                  <Text style={[styles.chipDetail, on && styles.chipDetailOn]}>{m.detail}</Text>
                </PressScale>
              );
            })}
          </View>
        </View>
      ))}
      {current.mode === 'roast-grind-brew' && (
        <View style={styles.pause}>
          <View style={styles.pauseRow}>
            <Text style={styles.groupLabel}>Brew after roasting</Text>
            <Text style={styles.pauseValue}>{pauseLabel(pause)}</Text>
          </View>
          <Slider
            value={tickFromMinutes(pause)}
            max={MAX_TICK}
            onChange={(tick) => onChange({ pauseMinutes: minutesFromTick(tick) })}
            accessibilityLabel="Brew after roasting"
            accessibilityValueText={pauseLabel(pause)}
          />
          <Text style={type.caption}>Roast now and wake up to fresh coffee. Up to 24 hours.</Text>
        </View>
      )}
      {modeGrinds(current.mode) && (
        <View style={[styles.pause, { marginTop: space.m }]}>
          <Text style={styles.groupLabel}>Grind time</Text>
          <View style={styles.chips} accessibilityRole="radiogroup">
            {GRIND_CHOICES.map((s) => {
              const on = s === grind;
              return (
                <PressScale
                  key={s}
                  onPress={() => onChange({ grindSeconds: s })}
                  style={[styles.grindChip, on && styles.chipOn]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={`Grind ${s} seconds`}
                >
                  <Text style={[styles.chipTitle, on && styles.chipTitleOn]}>{s} s</Text>
                </PressScale>
              );
            })}
          </View>
          <Text style={type.caption}>About 45 s for 50 g of beans, 60 s for 70 g, 75 s for 90 g. Too short leaves beans in the grinder.</Text>
        </View>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: space.l },
  groupLabel: { ...type.caption, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: space.s },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s },
  chip: { minHeight: touch.min + 8, flexGrow: 1, flexBasis: '45%', paddingHorizontal: space.m, paddingVertical: space.s, borderRadius: radius.chip, backgroundColor: color.paper, justifyContent: 'center' },
  chipOn: { backgroundColor: color.verde },
  chipTitle: { fontSize: 17, fontWeight: '700', color: color.espresso },
  chipTitleOn: { color: color.white },
  chipDetail: { ...type.caption },
  chipDetailOn: { color: color.cream },
  grindChip: { minHeight: touch.min, flexGrow: 1, flexBasis: '28%', paddingHorizontal: space.m, borderRadius: radius.chip, backgroundColor: color.cream, alignItems: 'center', justifyContent: 'center' },
  pause: { backgroundColor: color.paper, borderRadius: radius.card, padding: space.m, gap: space.s },
  pauseRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space.s, flexWrap: 'wrap' },
  pauseValue: { fontSize: 17, fontWeight: '700', color: color.verde },
});
