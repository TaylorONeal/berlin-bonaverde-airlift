import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CardInfo, COMMAND_LABEL, pauseLabel } from '../protocol';
import { CARD_ERROR_TEXT, CardError } from '../nfc';
import { PressScale } from '../ui/Pressable';
import { Sheet } from '../ui/Sheet';
import { color, radius, space, touch, type } from '../ui/tokens';

export type ReadState =
  | { kind: 'idle' }
  | { kind: 'waiting' }
  | { kind: 'read'; image: Uint8Array; info: CardInfo }
  | { kind: 'error'; error: CardError };

export function ReadSheet({ visible, state, onRead, onCopy, onClose }: { visible: boolean; state: ReadState; onRead: () => void; onCopy: (image: Uint8Array) => void; onClose: () => void }) {
  const [details, setDetails] = useState(false);
  return (
    <Sheet visible={visible} title="What's on this card?" onClose={onClose}>
      {state.kind === 'read' ? (
        <View style={styles.card}>
          <Text style={type.title}>{state.info.blank ? 'Blank card' : COMMAND_LABEL[state.info.command]}</Text>
          <Text style={[type.body, { color: state.info.valid ? color.verde : color.ember }]}>
            {state.info.blank
              ? 'Empty and ready to write.'
              : state.info.valid
                ? `Your machine will take it. ${state.info.crc16 === 'multi-use' ? 'Reusable.' : 'Single use.'}`
                : "Your machine won't take this one."}
          </Text>
          {state.info.pauseMinutes > 0 && <Text style={type.secondary}>Brews {pauseLabel(state.info.pauseMinutes)} after roasting.</Text>}
          {state.info.valid && (
            <PressScale style={styles.primary} onPress={() => onCopy(state.image)} accessibilityRole="button">
              <Text style={styles.primaryText}>Copy it to a blank card</Text>
            </PressScale>
          )}
          <PressScale onPress={() => setDetails(!details)} style={styles.quiet} accessibilityRole="button" accessibilityState={{ expanded: details }}>
            <Text style={styles.quietText}>{details ? 'Hide card details' : 'Card details'}</Text>
          </PressScale>
          {details && (
            <View style={styles.details}>
              <Text style={styles.mono}>ID {state.info.uid}</Text>
              <Text style={styles.mono}>Type byte 0x{state.info.typeByte.toString(16).padStart(2, '0').toUpperCase()}</Text>
              <Text style={styles.mono}>CRC16 {state.info.crc16}</Text>
              <Text style={styles.mono}>CRC8 {state.info.crc8Valid ? 'ok' : 'bad'}</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={type.body}>
            {state.kind === 'waiting' ? 'Hold your card to the top of your phone.' : 'See what a card does, and copy it if you like it.'}
          </Text>
          {state.kind === 'error' && <Text style={[type.secondary, { color: color.ember }]}>{CARD_ERROR_TEXT[state.error.code]}</Text>}
        </View>
      )}
      <PressScale style={[styles.primary, state.kind === 'waiting' && { opacity: 0.6 }]} onPress={onRead} disabled={state.kind === 'waiting'} accessibilityRole="button">
        <Text style={styles.primaryText}>{state.kind === 'read' ? 'Check another card' : state.kind === 'waiting' ? 'Waiting for a card' : 'Check a card'}</Text>
      </PressScale>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: color.paper, borderRadius: radius.card, padding: space.l, gap: space.s, marginBottom: space.m },
  primary: { minHeight: touch.min + 8, borderRadius: radius.pill, backgroundColor: color.verde, alignItems: 'center', justifyContent: 'center', marginTop: space.s },
  primaryText: { color: color.white, fontSize: 17, fontWeight: '700' },
  quiet: { minHeight: 44, justifyContent: 'center' },
  quietText: { color: color.bark, fontSize: 15, fontWeight: '600' },
  details: { gap: 2 },
  mono: { fontFamily: 'Courier', fontSize: 13, color: color.bark },
});
