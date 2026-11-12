import { Platform } from 'react-native';

/**
 * A pretend card stands in for a real one in development, the web preview and
 * review builds (EXPO_PUBLIC_DEMO=1). It has no switch or label in the app:
 * the screens look exactly as they ship.
 */
export const DEMO_ALLOWED: boolean =
  (typeof __DEV__ !== 'undefined' && __DEV__) || Platform.OS === 'web' || process.env.EXPO_PUBLIC_DEMO === '1';
