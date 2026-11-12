import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

/**
 * A quiet bent-plywood grain drawn in code. Long soft curves, low contrast,
 * no repeat seams. Lay it over an oak or walnut surface.
 */
export function Grain({ tint = '#5B3A26', opacity = 0.08 }: { tint?: string; opacity?: number }) {
  const lines = Array.from({ length: 14 }, (_, i) => {
    const y = 8 + i * 22;
    const bend = (i % 3) * 6 + 10;
    return `M -20 ${y} C 80 ${y - bend}, 180 ${y + bend}, 280 ${y - bend / 2} S 420 ${y + bend}, 460 ${y}`;
  });
  return (
    <Svg style={StyleSheet.absoluteFill} viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice" pointerEvents="none">
      {lines.map((d, i) => (
        <Path key={i} d={d} stroke={tint} strokeOpacity={opacity * (i % 2 ? 1 : 0.6)} strokeWidth={i % 4 === 0 ? 3 : 1.4} fill="none" />
      ))}
    </Svg>
  );
}
