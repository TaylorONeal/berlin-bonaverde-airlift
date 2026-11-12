import React from 'react';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { color } from './tokens';

/** Our own drawing of a curved-wood roaster: a moulded plywood shell, a glass dome, a green button. */
export function Machine({ size = 160 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 1.1} viewBox="0 0 200 220" accessibilityLabel="A curved wooden coffee roaster">
      <Defs>
        <LinearGradient id="oak" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={color.oakLight} />
          <Stop offset="1" stopColor={color.oak} />
        </LinearGradient>
        <LinearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.85" />
          <Stop offset="1" stopColor={color.paper} stopOpacity="0.6" />
        </LinearGradient>
      </Defs>
      {/* the bent wood shell */}
      <Path d="M40 200 C 20 200, 14 180, 18 150 L 34 70 C 40 40, 60 26, 100 26 C 140 26, 160 40, 166 70 L 182 150 C 186 180, 180 200, 160 200 Z" fill="url(#oak)" />
      <Path d="M48 190 C 34 188, 32 172, 35 150 L 50 76 C 55 52, 72 42, 100 42" stroke={color.walnut} strokeOpacity="0.18" strokeWidth="3" fill="none" />
      <Path d="M60 186 C 50 182, 48 168, 51 150 L 64 84" stroke={color.walnut} strokeOpacity="0.12" strokeWidth="2" fill="none" />
      {/* glass roasting dome */}
      <Rect x="70" y="52" width="60" height="56" rx="28" fill="url(#glass)" stroke={color.walnut} strokeOpacity="0.25" />
      <Circle cx="88" cy="88" r="5" fill={color.verde} />
      <Circle cx="102" cy="94" r="5" fill={color.verde} />
      <Circle cx="114" cy="84" r="5" fill={color.verde} />
      {/* card slot and button */}
      <Rect x="76" y="128" width="48" height="8" rx="4" fill={color.walnut} fillOpacity="0.55" />
      <Circle cx="100" cy="160" r="12" fill={color.verde} />
      <Circle cx="100" cy="160" r="5" fill={color.verdePop} />
    </Svg>
  );
}
