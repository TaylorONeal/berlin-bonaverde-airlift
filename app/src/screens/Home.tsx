import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';
import { menuItem, merge } from '../protocol';
import { CARD_ERROR_TEXT, CardAdapter, CardError, readCard, writeCard } from '../nfc';
import { HistoryEntry, Prefs } from '../state/store';
import { Airdrop } from '../ui/Airdrop';
import { Grain } from '../ui/Grain';
import { HoldButton } from '../ui/HoldButton';
import { PressScale } from '../ui/Pressable';
import { color, radius, shadow, space, touch, type } from '../ui/tokens';
import { summaryLine, templateFor } from './cardFor';
import { WHAT_IT_IS } from '../content/help';
import { DrinkSheet } from './DrinkSheet';
import { HelpSheet } from './HelpSheet';
import { MoreSheet } from './MoreSheet';
import { ReadSheet, ReadState } from './ReadSheet';

type Phase =
  | { kind: 'idle' }
  | { kind: 'waiting' }
  | { kind: 'done'; title: string }
  | { kind: 'error'; error: CardError };

/** Android keeps the reader armed for 30 s. iOS uses its own sheet timeout. */
const ANDROID_TIMEOUT_MS = 30_000;

export function Home({ adapter, demo, onDemo, prefs, setPrefs, history, addHistory }: {
  adapter: CardAdapter;
  demo: boolean;
  onDemo: (on: boolean) => void;
  prefs: Prefs;
  setPrefs: (p: Partial<Prefs>) => void;
  history: HistoryEntry[];
  addHistory: (e: HistoryEntry) => void;
}) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' });
  const [sheet, setSheet] = useState<null | 'drink' | 'read' | 'more' | 'help'>(null);
  const [readState, setReadState] = useState<ReadState>({ kind: 'idle' });
  const [middleH, setMiddleH] = useState(0);
  const [overwrite, setOverwrite] = useState<null | { image: Uint8Array; title: string; itemId: string }>(null);
  const pulse = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;

  const { item, image } = templateFor(prefs);
  const line = summaryLine(prefs, item);
  const needsHold = !prefs.multiUse; // single-use cards get a real pause

  useEffect(() => {
    if (phase.kind !== 'waiting') {
      pulse.stopAnimation();
      pulse.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [phase.kind, pulse]);

  const buzz = useCallback(
    (kind: 'start' | 'ok' | 'err') => {
      if (!prefs.haptics) return;
      const h =
        kind === 'start'
          ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          : Haptics.notificationAsync(kind === 'ok' ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error);
      h.catch(() => {});
    },
    [prefs.haptics],
  );

  const doShake = () => {
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 80, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 110, useNativeDriver: true }),
    ]).start();
  };

  const make = useCallback(
    async (tpl: Uint8Array, title: string, itemId: string, allowOverwrite = false) => {
      setOverwrite(null);
      setPhase({ kind: 'waiting' });
      buzz('start');
      const timer = Platform.OS === 'android' && !demo ? setTimeout(() => adapter.cancel(), ANDROID_TIMEOUT_MS) : undefined;
      try {
        const res = await writeCard(adapter, tpl, { multiUse: prefs.multiUse, allowOverwrite: allowOverwrite || demo, prompt: 'Hold a blank card to the top of your phone' });
        buzz('ok');
        addHistory({ at: new Date().toISOString(), itemId, title, uid: res.info.uid });
        setPhase({ kind: 'done', title });
      } catch (e) {
        const error = e instanceof CardError ? e : new CardError('unknown');
        if (error.code === 'not-blank') setOverwrite({ image: tpl, title, itemId });
        if (error.code !== 'cancelled') {
          buzz('err');
          doShake();
        }
        setPhase(error.code === 'cancelled' ? { kind: 'idle' } : { kind: 'error', error });
      } finally {
        if (timer) clearTimeout(timer);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [adapter, demo, prefs.multiUse, buzz, addHistory],
  );

  const read = async () => {
    setReadState({ kind: 'waiting' });
    try {
      const { image: img, info } = await readCard(adapter);
      setReadState({ kind: 'read', image: img, info });
    } catch (e) {
      setReadState(e instanceof CardError && e.code === 'cancelled' ? { kind: 'idle' } : { kind: 'error', error: e instanceof CardError ? e : new CardError('unknown') });
    }
  };

  const busy = phase.kind === 'waiting';
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] });
  const shakeX = shake.interpolate({ inputRange: [-1, 1], outputRange: [-8, 8] });

  const buttonLabel = busy ? 'Hold a blank card to your phone' : phase.kind === 'done' ? 'Write another' : phase.kind === 'error' ? 'Try again' : 'Write a card';
  // The plane gets whatever height is left after the words, and steps aside on short screens.
  const planeH = Math.min(200, Math.max(0, middleH - DONE_TEXT_H));

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.shell}>
        <Grain />
        <View style={styles.topRow}>
          <View style={{ flexShrink: 1 }}>
            <Text style={styles.brand} accessibilityRole="header">Berlin Airlift</Text>
              </View>
        </View>
        <Text style={styles.subtitle}>Coffee Card Writer & Reader</Text>
      </View>

      <View style={styles.middle} onLayout={(e) => setMiddleH(e.nativeEvent.layout.height)}>
        {phase.kind === 'done' ? (
          <View style={styles.done}>
            {planeH >= 96 && <Airdrop width={width - space.l * 2} height={planeH} />}
            <Check />
            <Text style={styles.doneTitle}>{phase.title} card ready.</Text>
            <Text style={[type.secondary, { textAlign: 'center' }]}>Put it in your machine and press its button.</Text>
          </View>
        ) : phase.kind === 'error' ? (
          <Animated.View style={[styles.msg, { transform: [{ translateX: shakeX }] }]}>
            <Text style={[type.body, { color: color.ember, textAlign: 'center' }]}>{CARD_ERROR_TEXT[phase.error.code]}</Text>
          </Animated.View>
        ) : (
          <View style={styles.msg}>
            <Text style={[type.hero, { textAlign: 'center' }]}>{busy ? 'Hold it still.' : 'Fresh coffee,\nairlifted.'}</Text>
            {!busy && <Text style={styles.whatItIs}>{WHAT_IT_IS}</Text>}
          </View>
        )}
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + space.l }]}>
        {overwrite ? (
          <HoldButton label="Hold to replace this card" onConfirm={() => make(overwrite.image, overwrite.title, overwrite.itemId, true)} />
        ) : needsHold && !busy ? (
          <HoldButton tone="verde" label="Hold to write a single-use card" onConfirm={() => make(image, item.title, item.id)} />
        ) : (
          <Animated.View style={{ transform: [{ scale }] }}>
            <PressScale
              onPress={() => (phase.kind === 'done' ? setPhase({ kind: 'idle' }) : make(image, item.title, item.id))}
              disabled={busy}
              style={[styles.primary, busy && styles.primaryBusy]}
              accessibilityRole="button"
              accessibilityLabel={`${buttonLabel}. ${line}`}
            >
              <Text style={styles.primaryText}>{buttonLabel}</Text>
            </PressScale>
          </Animated.View>
        )}

        <PressScale onPress={() => setSheet('drink')} disabled={busy} style={styles.summary} accessibilityRole="button" accessibilityHint="Change the drink on the card">
          <Text style={styles.summaryText}>{line}</Text>
          <Text style={styles.change}>Change</Text>
        </PressScale>

        <View style={styles.quietRow}>
          <PressScale onPress={() => setSheet('read')} disabled={busy} style={styles.quiet} accessibilityRole="button">
            <Text style={styles.quietText}>What's on this card?</Text>
          </PressScale>
          <PressScale onPress={() => setSheet('help')} disabled={busy} style={styles.quiet} accessibilityRole="button" accessibilityLabel="Help">
            <Text style={styles.quietText}>Help</Text>
          </PressScale>
          <PressScale onPress={() => setSheet('more')} disabled={busy} style={styles.quiet} accessibilityRole="button" accessibilityLabel="More">
            <Text style={styles.quietText}>More</Text>
          </PressScale>
        </View>
      </View>

      <HelpSheet visible={sheet === 'help'} onClose={() => setSheet(null)} />
      <DrinkSheet visible={sheet === 'drink'} prefs={prefs} onChange={setPrefs} onClose={() => setSheet(null)} />
      <ReadSheet
        visible={sheet === 'read'}
        state={readState}
        onRead={read}
        onClose={() => setSheet(null)}
        onCopy={(img) => {
          setSheet(null);
          make(merge(img, img, true), 'Copied', 'copy');
        }}
      />
      <MoreSheet
        visible={sheet === 'more'}
        prefs={prefs}
        history={history}
        onChange={setPrefs}
        onHelp={() => setSheet('help')}
        onClose={() => setSheet(null)}
        onCare={(id) => {
          setSheet(null);
          const care = menuItem(id);
          make(templateFor({ ...prefs, itemId: id }).image, care.title, id, true);
        }}
      />
    </View>
  );
}

/** Check mark plus two lines of words under the plane, with room to breathe. */
const DONE_TEXT_H = 56 + 32 + 2 * 36 + 21 * 2 + space.s * 3;

function Check() {
  return (
    <Svg width={56} height={56} viewBox="0 0 72 72" accessibilityLabel="Done">
      <Path d="M36 4 C 54 4, 68 18, 68 36 C 68 54, 54 68, 36 68 C 18 68, 4 54, 4 36 C 4 18, 18 4, 36 4 Z" fill={color.verde} />
      <Path d="M22 37 L 32 47 L 51 26" stroke={color.white} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.cream },
  shell: { backgroundColor: color.oak, marginHorizontal: space.m, marginTop: space.s, borderRadius: radius.card, overflow: 'hidden', padding: space.l, ...shadow },
  topBtns: { flexDirection: 'row', gap: space.s },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space.s },
  brand: { ...type.title, fontSize: 28, lineHeight: 34, color: color.espresso },
  moreBtn: { minHeight: 44, minWidth: 56, paddingHorizontal: space.m, borderRadius: radius.pill, backgroundColor: 'rgba(246,239,227,0.7)', alignItems: 'center', justifyContent: 'center' },
  moreText: { fontSize: 15, fontWeight: '700', color: color.walnut },
  subtitle: { fontSize: 15, fontWeight: '700', color: color.walnut, marginTop: 2 },
  middle: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: space.l, paddingTop: space.l, paddingBottom: space.xxl, overflow: 'hidden' },
  msg: { alignItems: 'center', gap: space.m },
  whatItIs: { ...type.body, color: color.bark, textAlign: 'center', maxWidth: 340 },
  done: { alignItems: 'center', gap: space.s },
  doneTitle: { ...type.title, fontSize: 28, lineHeight: 34, textAlign: 'center' },
  bottom: { paddingHorizontal: space.l, gap: space.m },
  primary: { minHeight: touch.primary, borderRadius: radius.pill, backgroundColor: color.verde, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.l, ...shadow },
  primaryBusy: { backgroundColor: color.verdeDeep },
  primaryText: { color: color.white, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  summary: { minHeight: touch.min, borderRadius: radius.pill, backgroundColor: color.paper, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.l },
  summaryText: { fontSize: 17, fontWeight: '600', color: color.espresso, flexShrink: 1 },
  change: { fontSize: 15, fontWeight: '700', color: color.verde },
  quietRow: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: space.s },
  quiet: { minHeight: 44, paddingHorizontal: space.s, justifyContent: 'center' },
  quietText: { fontSize: 15, fontWeight: '600', color: color.bark },
});
