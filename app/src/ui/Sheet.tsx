import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, MAX_SCALE, radius, space, type } from './tokens';

/**
 * A bottom sheet. The title takes the free width and shrinks or wraps, so Done
 * never leaves the screen. Android draws edge to edge, so the sheet runs under
 * both system bars and pads itself by the safe-area insets, same as iOS.
 */
export function Sheet({ visible, title, onClose, children }: { visible: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Close" />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + space.m }]}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text
            style={[type.sheetTitle, styles.title]}
            accessibilityRole="header"
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
            maxFontSizeMultiplier={MAX_SCALE.display}
          >
            {title}
          </Text>
          <Pressable onPress={onClose} hitSlop={16} accessibilityRole="button" accessibilityLabel="Done" style={styles.done}>
            <Text style={styles.doneText} maxFontSizeMultiplier={MAX_SCALE.control}>Done</Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: space.l }} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: 'rgba(42,27,18,0.35)' },
  sheet: { backgroundColor: color.cream, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingHorizontal: space.l, maxHeight: '88%' },
  handle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: color.paper, marginTop: space.s, marginBottom: space.m },
  header: { flexDirection: 'row', alignItems: 'center', gap: space.s, marginBottom: space.m },
  title: { flex: 1 },
  done: { minHeight: 44, justifyContent: 'center', paddingHorizontal: space.s, flexShrink: 0 },
  doneText: { color: color.verde, fontSize: 17, fontWeight: '700' },
});
