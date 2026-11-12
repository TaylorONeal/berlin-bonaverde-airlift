import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import { color } from './tokens';

function Plane() {
  return (
    <Svg width={120} height={52} viewBox="0 0 120 52">
      {/* a chunky cargo plane, nose right */}
      <Path d="M8 24 C 8 16, 18 12, 34 12 L 92 12 C 104 12, 116 18, 116 26 C 116 32, 108 36, 96 36 L 26 36 C 14 36, 8 32, 8 24 Z" fill={color.cream} />
      <Path d="M52 24 L 70 2 L 80 2 L 72 24 Z" fill={color.oak} />
      <Path d="M52 28 L 70 50 L 80 50 L 72 28 Z" fill={color.walnut} />
      <Path d="M10 22 L 4 6 L 14 6 L 24 18 Z" fill={color.oak} />
      <Circle cx="98" cy="22" r="4" fill={color.verde} />
      <Circle cx="86" cy="22" r="4" fill={color.verde} />
      <Rect x="30" y="31" width="22" height="4" rx="2" fill={color.walnut} fillOpacity="0.4" />
    </Svg>
  );
}

function Pouch() {
  return (
    <Svg width={64} height={92} viewBox="0 0 64 92">
      {/* parachute canopy */}
      <Path d="M4 28 C 4 10, 18 2, 32 2 C 46 2, 60 10, 60 28 C 54 24, 48 24, 43 28 C 38 24, 26 24, 21 28 C 16 24, 10 24, 4 28 Z" fill={color.verdePop} />
      <Path d="M21 28 C 22 18, 27 8, 32 2 M43 28 C 42 18, 37 8, 32 2" stroke={color.verde} strokeWidth="1.5" fill="none" />
      <G stroke={color.cream} strokeWidth="1.2">
        <Path d="M5 28 L 22 58" />
        <Path d="M59 28 L 42 58" />
        <Path d="M32 28 L 32 58" />
      </G>
      {/* the bean pouch */}
      <Path d="M18 58 L 46 58 L 50 88 C 50 90, 48 91, 46 91 L 18 91 C 16 91, 14 90, 14 88 Z" fill={color.oak} />
      <Rect x="22" y="66" width="20" height="12" rx="6" fill={color.verde} />
      <Circle cx="28" cy="72" r="2" fill={color.verdePop} />
      <Circle cx="36" cy="72" r="2" fill={color.verdePop} />
    </Svg>
  );
}

/**
 * The success moment: a cargo plane crosses and drops a pouch on a parachute.
 * About 1.2 s, plays once, tap to skip. Under Reduce Motion it is a still.
 */
export function Airdrop({ width, height = 200, onDone }: { width: number; height?: number; onDone?: () => void }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((reduce) => {
        if (cancelled) return;
        if (reduce) {
          t.setValue(1);
          onDone?.();
          return;
        }
        Animated.timing(t, { toValue: 1, duration: 1200, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(() => onDone?.());
      });
    return () => {
      cancelled = true;
    };
  }, [t, onDone]);

  const planeX = t.interpolate({ inputRange: [0, 1], outputRange: [-140, width + 20] });
  const dropAt = 0.3;
  const pouchY = t.interpolate({ inputRange: [0, dropAt, 1], outputRange: [0, 0, Math.max(0, height - 92 - 28)], extrapolate: 'clamp' });
  const pouchOpacity = t.interpolate({ inputRange: [0, dropAt - 0.01, dropAt], outputRange: [0, 0, 1], extrapolate: 'clamp' });
  const sway = t.interpolate({ inputRange: [dropAt, 0.55, 0.8, 1], outputRange: ['-8deg', '6deg', '-4deg', '0deg'], extrapolate: 'clamp' });

  return (
    <Pressable
      onPress={() => {
        t.stopAnimation();
        t.setValue(1);
        onDone?.();
      }}
      accessibilityLabel="A plane drops your coffee by parachute"
      style={[styles.stage, { width, height }]}
    >
      <Animated.View style={[styles.plane, { transform: [{ translateX: planeX }] }]}>
        <Plane />
      </Animated.View>
      <View style={[styles.pouchLane, { left: width / 2 - 32 }]}>
        <Animated.View style={{ opacity: pouchOpacity, transform: [{ translateY: pouchY }, { rotate: sway }] }}>
          <Pouch />
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stage: { overflow: 'hidden' },
  plane: { position: 'absolute', top: 6 },
  pouchLane: { position: 'absolute', top: 28 },
});
