import { Platform } from 'react-native';

/**
 * Demo mode (a pretend card) exists for development, the web preview and
 * review builds. Store builds leave it out: set EXPO_PUBLIC_DEMO=1 to keep it.
 */
export const DEMO_ALLOWED: boolean =
  (typeof __DEV__ !== 'undefined' && __DEV__) || Platform.OS === 'web' || process.env.EXPO_PUBLIC_DEMO === '1';
