import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, radius, space, type } from './tokens';

export function Sheet({ visible, title, onClose, children }: { visible: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Close" />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + space.l }]}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={type.sheetTitle} accessibilityRole="header">{title}</Text>
          <Pressable onPress={onClose} hitSlop={16} accessibilityRole="button" accessibilityLabel="Done" style={styles.done}>
            <Text style={styles.doneText}>Done</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space.m },
  done: { minHeight: 44, justifyContent: 'center', paddingHorizontal: space.s },
  doneText: { color: color.verde, fontSize: 17, fontWeight: '700' },
});
