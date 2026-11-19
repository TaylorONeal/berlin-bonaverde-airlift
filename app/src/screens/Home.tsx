import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';
import { menuItem, merge } from '../protocol';
import { CARD_ERROR_TEXT, CardAdapter, CardError, readCard, writeCard } from '../nfc';
import { HistoryEntry, Prefs } from '../state/store';
import { Airdrop } from '../ui/Airdrop';
import { Grain } from '../ui/Grain';
import { HoldingPattern } from '../ui/HoldingPattern';
import { HoldButton } from '../ui/HoldButton';
import { PressScale } from '../ui/Pressable';
import { color, COMPACT_HEIGHT, MAX_SCALE, radius, shadow, space, touch, type } from '../ui/tokens';
import { summaryLine, summaryParts, templateFor } from './cardFor';
import { OWNER_BADGE, WHAT_IT_IS } from '../content/help';
import { CARD_ABOUT } from '../content/cards';
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
  const { width, height } = useWindowDimensions();
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' });
  const [sheet, setSheet] = useState<null | 'drink' | 'read' | 'more' | 'help'>(null);
  const [readState, setReadState] = useState<ReadState>({ kind: 'idle' });
  const [middleH, setMiddleH] = useState(0);
  const [doneTextH, setDoneTextH] = useState(0);
  const [overwrite, setOverwrite] = useState<null | { image: Uint8Array; title: string; itemId: string }>(null);
  const pulse = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;

  const { item, image } = templateFor(prefs);
  const line = summaryLine(prefs, item);
  const parts = summaryParts(prefs, item);
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

  // Short phones (iPhone SE, small Androids) get tighter spacing and smaller display
  // words, so nothing in the middle is cut off. Taller phones keep the full layout.
  const compact = height < COMPACT_HEIGHT;
  const pad = compact ? { top: space.s, bottom: space.l } : { top: space.l, bottom: space.xxl };
  const buttonLabel = busy ? 'Hold a blank card to your phone' : phase.kind === 'done' ? 'Write another' : phase.kind === 'error' ? 'Try again' : 'Write a card';
  // The plane gets whatever height is left after the words, measured, and steps aside on short screens.
  // While waiting, the holding-pattern animation takes what is left above its one line of words.
  const holdSize = Math.min(220, Math.max(0, middleH - pad.top - pad.bottom - 48));
  const planeH = doneTextH > 0 ? Math.min(200, Math.max(0, middleH - pad.top - pad.bottom - doneTextH - space.s)) : 0;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={[styles.shell, compact && styles.shellCompact]}>
        <Grain />
        <Text style={styles.brand} accessibilityRole="header" maxFontSizeMultiplier={MAX_SCALE.display}>Berlin Airlift</Text>
        <Text style={styles.subtitle} maxFontSizeMultiplier={MAX_SCALE.control}>Coffee Card Writer & Reader</Text>
        <View style={styles.owner}><Text style={styles.ownerText} maxFontSizeMultiplier={MAX_SCALE.control}>{OWNER_BADGE}</Text></View>
      </View>

      {/* The one real choice comes first: which card. Writing it is the big button below. */}
      <PressScale
        onPress={() => setSheet('drink')}
        disabled={busy}
        style={[styles.pick, compact && styles.pickCompact]}
        accessibilityRole="button"
        accessibilityLabel={`Your card: ${line}`}
        accessibilityHint="Choose a different card"
      >
        <View style={styles.pickText}>
          <Text style={styles.pickLabel} maxFontSizeMultiplier={MAX_SCALE.control}>Your card</Text>
          <Text style={[styles.pickTitle, compact && styles.pickTitleCompact]} numberOfLines={1} maxFontSizeMultiplier={MAX_SCALE.display}>{parts.title}</Text>
          <Text style={styles.pickDetail} numberOfLines={2} maxFontSizeMultiplier={MAX_SCALE.control}>{parts.detail}</Text>
        </View>
        <View style={styles.changePill}>
          <Text style={styles.change} maxFontSizeMultiplier={MAX_SCALE.control}>Change</Text>
        </View>
      </PressScale>
      {CARD_ABOUT[item.id] && (
        <Text style={[styles.about, compact && styles.aboutCompact]} maxFontSizeMultiplier={MAX_SCALE.body}>{CARD_ABOUT[item.id]}</Text>
      )}

      <View style={[styles.action, compact && styles.actionCompact]}>
        {overwrite ? (
          <HoldButton label="Hold to replace this card" onConfirm={() => make(overwrite.image, overwrite.title, overwrite.itemId, true)} />
        ) : needsHold && !busy ? (
          <HoldButton tone="verde" label="Hold to write a single-use card" onConfirm={() => make(image, item.title, item.id)} />
        ) : (
          <Animated.View style={{ transform: [{ scale }] }}>
            <PressScale
              onPress={() => (phase.kind === 'done' ? setPhase({ kind: 'idle' }) : make(image, item.title, item.id))}
              disabled={busy}
              style={[styles.primary, compact && styles.primaryCompact, busy && styles.primaryBusy]}
              accessibilityRole="button"
              accessibilityLabel={`${buttonLabel}. ${line}`}
            >
              <Text style={styles.primaryText} maxFontSizeMultiplier={MAX_SCALE.control}>{buttonLabel}</Text>
            </PressScale>
          </Animated.View>
        )}
      </View>

      <View style={styles.middle} onLayout={(e) => setMiddleH(e.nativeEvent.layout.height)}>
        {/* Scrolls only when very large text would not fit; otherwise it sits still at the bottom. */}
        <ScrollView
          contentContainerStyle={[styles.middleContent, { paddingTop: pad.top, paddingBottom: pad.bottom }]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {phase.kind === 'done' ? (
            <View style={styles.done}>
              {planeH >= 96 && <Airdrop width={width - space.l * 2} height={planeH} />}
              <View style={styles.done} onLayout={(e) => setDoneTextH(e.nativeEvent.layout.height)}>
                <Check />
                <Text style={styles.doneTitle} maxFontSizeMultiplier={MAX_SCALE.display}>{phase.title} card ready.</Text>
                <Text style={[type.secondary, { textAlign: 'center' }]} maxFontSizeMultiplier={MAX_SCALE.body}>Put it in your machine and press its button.</Text>
              </View>
            </View>
          ) : phase.kind === 'error' ? (
            <Animated.View style={[styles.msg, { transform: [{ translateX: shakeX }] }]}>
              <Text style={[type.body, { color: color.ember, textAlign: 'center' }]} maxFontSizeMultiplier={MAX_SCALE.body}>{CARD_ERROR_TEXT[phase.error.code]}</Text>
            </Animated.View>
          ) : (
            busy ? (
              <View style={[styles.msg, { gap: space.s }]}>
                {holdSize >= 130 && <HoldingPattern size={holdSize} />}
                <Text style={styles.holdTitle} maxFontSizeMultiplier={MAX_SCALE.display}>Hold it still.</Text>
              </View>
            ) : null
          )}
        </ScrollView>
      </View>

      <View style={[styles.bottom, compact && styles.bottomCompact, { paddingBottom: insets.bottom + (compact ? space.m : space.l) }]}>
        {phase.kind === 'idle' && (
          <View style={styles.intro}>
            <Text style={styles.introTitle} maxFontSizeMultiplier={MAX_SCALE.body}>Fresh coffee, airlifted.</Text>
            <Text style={styles.whatItIs} maxFontSizeMultiplier={MAX_SCALE.body}>{WHAT_IT_IS}</Text>
          </View>
        )}
        <View style={styles.quietRow}>
          <PressScale onPress={() => setSheet('read')} disabled={busy} style={styles.quiet} accessibilityRole="button">
            <Text style={styles.quietText} maxFontSizeMultiplier={MAX_SCALE.control}>What's on this card?</Text>
          </PressScale>
          <PressScale onPress={() => setSheet('help')} disabled={busy} style={styles.quiet} accessibilityRole="button" accessibilityLabel="Help">
            <Text style={styles.quietText} maxFontSizeMultiplier={MAX_SCALE.control}>Help</Text>
          </PressScale>
          <PressScale onPress={() => setSheet('more')} disabled={busy} style={styles.quiet} accessibilityRole="button" accessibilityLabel="More">
            <Text style={styles.quietText} maxFontSizeMultiplier={MAX_SCALE.control}>More</Text>
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
  shellCompact: { paddingVertical: space.m },
  brand: { ...type.title, fontSize: 28, lineHeight: 34, color: color.espresso },
  subtitle: { fontSize: 15, fontWeight: '700', color: color.walnut, marginTop: 2 },
  owner: { alignSelf: 'flex-start', marginTop: space.s, borderRadius: radius.pill, backgroundColor: color.espresso, paddingHorizontal: space.m, paddingVertical: 6 },
  ownerText: { fontSize: 14, fontWeight: '800', color: color.cream },
  middle: { flex: 1, overflow: 'hidden' },
  middleContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: space.l },
  msg: { alignItems: 'center', gap: space.m },
  holdTitle: { ...type.title, fontSize: 26, lineHeight: 32, textAlign: 'center' },
  intro: { alignItems: 'center', gap: 2, paddingHorizontal: space.m },
  introTitle: { fontSize: 13, lineHeight: 18, fontWeight: '700', fontStyle: 'italic', color: color.bark, textAlign: 'center' },
  whatItIs: { fontSize: 12, lineHeight: 17, fontStyle: 'italic', color: color.bark, textAlign: 'center', maxWidth: 320 },
  pick: { marginHorizontal: space.m, marginTop: space.m, borderRadius: radius.card, backgroundColor: color.paper, borderWidth: 2, borderColor: color.verde, flexDirection: 'row', alignItems: 'center', gap: space.s, paddingHorizontal: space.l, paddingVertical: space.m },
  pickCompact: { marginTop: space.s, paddingVertical: space.s },
  pickText: { flex: 1, flexShrink: 1 },
  pickLabel: { fontSize: 13, fontWeight: '800', color: color.verde, letterSpacing: 0.6, textTransform: 'uppercase' },
  pickTitle: { fontFamily: type.title.fontFamily, fontSize: 28, lineHeight: 34, color: color.espresso, marginTop: 2 },
  pickTitleCompact: { fontSize: 24, lineHeight: 28 },
  pickDetail: { fontSize: 15, lineHeight: 20, fontWeight: '600', color: color.bark, marginTop: 2 },
  about: { fontSize: 15, lineHeight: 21, color: color.espresso, marginHorizontal: space.m + space.l, marginTop: space.l },
  aboutCompact: { fontSize: 14, lineHeight: 19, marginTop: space.m },
  action: { paddingHorizontal: space.l, marginTop: space.l },
  actionCompact: { marginTop: space.m },
  changePill: { minHeight: 44, borderRadius: radius.pill, backgroundColor: color.verde, paddingHorizontal: space.m, justifyContent: 'center', flexShrink: 0 },
  done: { alignItems: 'center', gap: space.s },
  doneTitle: { ...type.title, fontSize: 28, lineHeight: 34, textAlign: 'center' },
  bottom: { paddingHorizontal: space.l, gap: space.m },
  bottomCompact: { gap: space.s },
  primary: { minHeight: touch.primary, borderRadius: radius.pill, backgroundColor: color.verde, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.l, paddingVertical: space.s, ...shadow },
  primaryCompact: { minHeight: 76 },
  primaryBusy: { backgroundColor: color.verdeDeep },
  primaryText: { color: color.white, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  change: { fontSize: 15, fontWeight: '800', color: color.white },
  quietRow: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', columnGap: space.s },
  quiet: { minHeight: 44, paddingHorizontal: space.s, justifyContent: 'center' },
  quietText: { fontSize: 15, fontWeight: '600', color: color.bark },
});
