import React, { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { color, radius, touch } from './tokens';

/** Hold for about a second to confirm. Used for care cards, single-use cards and overwrites. */
export function HoldButton({ label, onConfirm, tone = 'ember', holdMs = 1000 }: { label: string; onConfirm: () => void; tone?: 'ember' | 'verde'; holdMs?: number }) {
  const fill = useRef(new Animated.Value(0)).current;
  const [holding, setHolding] = useState(false);
  const bg = tone === 'ember' ? color.ember : color.verde;
  const start = () => {
    setHolding(true);
    Haptics.selectionAsync().catch(() => {});
    Animated.timing(fill, { toValue: 1, duration: holdMs, useNativeDriver: false }).start(({ finished }) => {
      if (finished) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        fill.setValue(0);
        setHolding(false);
        onConfirm();
      }
    });
  };
  const cancel = () => {
    setHolding(false);
    Animated.timing(fill, { toValue: 0, duration: 150, useNativeDriver: false }).start();
  };
  return (
    <Pressable onPressIn={start} onPressOut={cancel} accessibilityRole="button" accessibilityLabel={label} accessibilityHint="Press and hold to confirm">
      <View style={[styles.base, { borderColor: bg }]}>
        <Animated.View style={[styles.fill, { backgroundColor: bg, width: fill.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
        <Text style={[styles.label, { color: holding ? color.white : bg }]}>{holding ? 'Keep holding' : label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: touch.min + 8, borderRadius: radius.pill, borderWidth: 2, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0 },
  label: { fontSize: 17, fontWeight: '700' },
});
