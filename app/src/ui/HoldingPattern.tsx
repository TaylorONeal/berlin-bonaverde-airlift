import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { color } from './tokens';

/** A small cargo plane seen from above, nose up, for the holding circle. */
function MiniPlane() {
  return (
    <Svg width={PLANE} height={PLANE} viewBox="0 0 34 34">
      <Path d="M2 17 L 14 11 L 20 11 L 32 17 L 32 21 L 20 18 L 14 18 L 2 21 Z" fill={color.oak} />
      <Path d="M10 30 L 14 26 L 20 26 L 24 30 L 24 32 L 10 32 Z" fill={color.oak} />
      <Path d="M17 1 C 19.5 1, 20.5 5, 20.5 9 L 20.5 25 C 20.5 28, 19 31, 17 33 C 15 31, 13.5 28, 13.5 25 L 13.5 9 C 13.5 5, 14.5 1, 17 1 Z" fill={color.walnut} />
      <Circle cx="17" cy="6" r="1.8" fill={color.verdePop} />
    </Svg>
  );
}

/** The blank card, chip up, the way it meets the top of the phone. */
function BlankCard({ size }: { size: number }) {
  const w = size;
  const h = size * 0.64;
  return (
    <Svg width={w} height={h} viewBox="0 0 100 64">
      <Rect x="2" y="2" width="96" height="60" rx="9" fill={color.oak} />
      <Rect x="2" y="2" width="96" height="60" rx="9" fill="none" stroke={color.walnut} strokeOpacity="0.35" strokeWidth="2" />
      <Rect x="12" y="14" width="22" height="17" rx="4" fill={color.verde} />
      <Path d="M62 22 C 66 26, 66 38, 62 42 M70 18 C 76 24, 76 40, 70 46 M78 14 C 86 22, 86 42, 78 50" stroke={color.cream} strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

const RINGS = 3;
const PLANE = 40;
const RING_MS = 1800;

/**
 * While the phone waits for a card: the card bobs toward the phone, signal rings
 * pulse out of it, and a little cargo plane flies a holding pattern around it.
 * Loops until unmounted. Under Reduce Motion it is a still.
 */
export function HoldingPattern({ size }: { size: number }) {
  const ring = useRef(new Animated.Value(0)).current;
  const orbit = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;
  const [still, setStill] = useState(false);

  useEffect(() => {
    let loops: Animated.CompositeAnimation[] = [];
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((reduce) => {
        if (cancelled) return;
        if (reduce) {
          setStill(true);
          return;
        }
        loops = [
          Animated.loop(Animated.timing(ring, { toValue: 1, duration: RING_MS, easing: Easing.linear, useNativeDriver: true })),
          Animated.loop(Animated.timing(orbit, { toValue: 1, duration: 3600, easing: Easing.linear, useNativeDriver: true })),
          Animated.loop(
            Animated.sequence([
              Animated.timing(bob, { toValue: 1, duration: 650, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
              Animated.timing(bob, { toValue: 0, duration: 650, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            ]),
          ),
        ];
        loops.forEach((l) => l.start());
      });
    return () => {
      cancelled = true;
      loops.forEach((l) => l.stop());
    };
  }, [ring, orbit, bob]);

  const cardW = size * 0.36;
  const ringBase = cardW * 1.05;
  const spin = orbit.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const lift = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -size * 0.04] });
  const tilt = bob.interpolate({ inputRange: [0, 1], outputRange: ['-4deg', '3deg'] });

  return (
    <View style={[styles.stage, { width: size, height: size }]} accessibilityLabel="Waiting for a card" accessible>
      {Array.from({ length: RINGS }, (_, i) => {
        // Each ring runs the same loop, offset by a third, so one leaves as the next arrives.
        const p = Animated.modulo(Animated.add(ring, i / RINGS), 1);
        const scale = p.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.9] });
        const opacity = still ? (i === 0 ? 0.6 : 0) : p.interpolate({ inputRange: [0, 0.12, 1], outputRange: [0, 0.9, 0] });
        return (
          <Animated.View
            key={i}
            pointerEvents="none"
            style={[
              styles.ring,
              { width: ringBase, height: ringBase, borderRadius: ringBase / 2, marginLeft: -ringBase / 2, marginTop: -ringBase / 2, opacity, transform: [{ scale: still ? 1.3 : scale }] },
            ]}
          />
        );
      })}

      <Animated.View style={[styles.center, { transform: [{ translateY: lift }, { rotate: tilt }] }]}>
        <BlankCard size={cardW} />
      </Animated.View>

      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { transform: [{ rotate: spin }] }]}>
        {/* The plane sits on the right of the circle, nose along the path. */}
        <View style={[styles.plane, { top: size / 2 - PLANE / 2, left: size - PLANE - 2 }]}>
          <MiniPlane />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { alignItems: 'center', justifyContent: 'center' },
  center: { position: 'absolute' },
  ring: { position: 'absolute', left: '50%', top: '50%', borderWidth: 3, borderColor: color.verde },
  plane: { position: 'absolute', transform: [{ rotate: '180deg' }] },
});
