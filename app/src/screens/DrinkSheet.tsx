import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Slider from './Slider';
import { MENU, MODE_LABEL, Mode, MAX_TICK, minutesFromTick, pauseLabel, pauseMinutes, tickFromMinutes, imageFromTemplate, profileFor, menuItem } from '../protocol';
import { PressScale } from '../ui/Pressable';
import { Sheet } from '../ui/Sheet';
import { color, radius, space, touch, type } from '../ui/tokens';
import { Prefs } from '../state/store';

const GROUPS: Mode[] = ['roast-grind-brew', 'roast', 'grind-brew', 'grind', 'brew'];

export function DrinkSheet({ visible, prefs, onChange, onClose }: { visible: boolean; prefs: Prefs; onChange: (p: Partial<Prefs>) => void; onClose: () => void }) {
  const current = menuItem(prefs.itemId);
  const defaultPause = pauseMinutes(imageFromTemplate(profileFor(current).templateHex));
  const pause = prefs.pauseMinutes ?? defaultPause;
  return (
    <Sheet visible={visible} title="What are we making?" onClose={onClose}>
      {GROUPS.map((mode) => (
        <View key={mode} style={styles.group}>
          <Text style={styles.groupLabel}>{MODE_LABEL[mode]}</Text>
          <View style={styles.chips}>
            {MENU.filter((m) => m.mode === mode).map((m) => {
              const on = m.id === prefs.itemId;
              return (
                <PressScale
                  key={m.id}
                  onPress={() => onChange({ itemId: m.id, pauseMinutes: m.autoPauseMinutes ?? null })}
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
    </Sheet>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: space.l },
  groupLabel: { ...type.caption, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: space.s },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s },
  chip: { minHeight: touch.min + 8, minWidth: 140, paddingHorizontal: space.m, paddingVertical: space.s, borderRadius: radius.chip, backgroundColor: color.paper, justifyContent: 'center' },
  chipOn: { backgroundColor: color.verde },
  chipTitle: { fontSize: 17, fontWeight: '700', color: color.espresso },
  chipTitleOn: { color: color.white },
  chipDetail: { ...type.caption },
  chipDetailOn: { color: color.cream },
  pause: { backgroundColor: color.paper, borderRadius: radius.card, padding: space.m, gap: space.s },
  pauseRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pauseValue: { fontSize: 17, fontWeight: '700', color: color.verde },
});
