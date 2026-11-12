import React, { useRef, useState } from 'react';
import { LayoutChangeEvent, PanResponder, StyleSheet, View } from 'react-native';
import { color, touch } from '../ui/tokens';

/** A chunky slider with no extra dependency. Steps are whole ticks. */
export default function Slider({ value, max, onChange, accessibilityLabel, accessibilityValueText }: { value: number; max: number; onChange: (v: number) => void; accessibilityLabel: string; accessibilityValueText: string }) {
  const [w, setW] = useState(1);
  const wRef = useRef(1);
  const fromX = (x: number) => Math.max(0, Math.min(max, Math.round((x / wRef.current) * max)));
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => onChange(fromX(e.nativeEvent.locationX)),
      onPanResponderMove: (e) => onChange(fromX(e.nativeEvent.locationX)),
    }),
  ).current;
  const pct = value / max;
  return (
    <View
      style={styles.hit}
      onLayout={(e: LayoutChangeEvent) => {
        wRef.current = e.nativeEvent.layout.width;
        setW(e.nativeEvent.layout.width);
      }}
      {...pan.panHandlers}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ text: accessibilityValueText }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => onChange(Math.max(0, Math.min(max, value + (e.nativeEvent.actionName === 'increment' ? 10 : -10))))}
    >
      <View style={styles.track} pointerEvents="none">
        <View style={[styles.fill, { width: pct * w }]} />
      </View>
      <View style={[styles.knob, { left: pct * w - 16 }]} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  hit: { height: touch.min, justifyContent: 'center' },
  track: { height: 10, borderRadius: 5, backgroundColor: color.cream, overflow: 'hidden' },
  fill: { height: 10, backgroundColor: color.verde },
  knob: { position: 'absolute', width: 32, height: 32, borderRadius: 16, backgroundColor: color.verde, borderWidth: 4, borderColor: color.cream },
});
