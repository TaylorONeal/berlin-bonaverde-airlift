import React, { useRef } from 'react';
import { Animated, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

/** Press scale to 0.97 and back in about 120 ms. */
export function PressScale({ style, children, ...rest }: PressableProps & { style?: StyleProp<ViewStyle>; children: React.ReactNode }) {
  const s = useRef(new Animated.Value(1)).current;
  const to = (v: number) => Animated.timing(s, { toValue: v, duration: 120, useNativeDriver: true }).start();
  return (
    <Pressable onPressIn={() => to(0.97)} onPressOut={() => to(1)} {...rest}>
      <Animated.View style={[style, { transform: [{ scale: s }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
