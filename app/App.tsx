import React, { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Fraunces_600SemiBold } from '@expo-google-fonts/fraunces/600SemiBold';
import { Fraunces_800ExtraBold } from '@expo-google-fonts/fraunces/800ExtraBold';
import { CardAdapter, CardError, fakeAdapter } from './src/nfc';
import { DEMO_ALLOWED } from './src/config';
import { Home } from './src/screens/Home';
import { useHistory, usePrefs } from './src/state/store';

function realAdapter(): CardAdapter | null {
  if (Platform.OS === 'web') return null;
  try {
    // Loaded lazily so the web preview and tests never touch the native module.
    return require('./src/nfc/nfcManagerAdapter').nfcManagerAdapter as CardAdapter;
  } catch {
    return null;
  }
}

/** A phone with no reader at all, in a store build: every tap explains why. */
const noNfc: CardAdapter = {
  availability: async () => 'no-nfc',
  withCard: async () => {
    throw new CardError('no-nfc');
  },
  cancel: async () => {},
};

export default function App() {
  const [fontsLoaded] = useFonts({ Fraunces_600SemiBold, Fraunces_800ExtraBold });
  const [prefs, setPrefs] = usePrefs();
  const [history, addHistory] = useHistory();
  const real = useMemo(realAdapter, []);
  const demoCard = useMemo(() => fakeAdapter({ delayMs: 90 }), []);
  const [demo, setDemo] = useState(DEMO_ALLOWED && real == null);

  // No NFC on this phone: in builds that allow it, the demo turns on by itself.
  useEffect(() => {
    if (DEMO_ALLOWED) real?.availability().then((a) => a === 'no-nfc' && setDemo(true));
  }, [real]);

  const inDemo = DEMO_ALLOWED && (demo || !real);

  if (!fontsLoaded) return null;
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Home
        adapter={inDemo ? demoCard : real ?? noNfc}
        demo={inDemo}
        onDemo={(on) => setDemo(DEMO_ALLOWED && (on || !real))}
        prefs={prefs}
        setPrefs={setPrefs}
        history={history}
        addHistory={addHistory}
      />
    </SafeAreaProvider>
  );
}
