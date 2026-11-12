import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HelpSheet } from '../HelpSheet';

const metrics = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 47, left: 0, right: 0, bottom: 34 } };

it('names the exact card to buy and the look-alikes to avoid', async () => {
  await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <HelpSheet visible onClose={() => {}} />
    </SafeAreaProvider>,
  );
  expect(screen.getByText('MIFARE Ultralight EV1')).toBeTruthy();
  expect(screen.getByText(/Chip MF0UL11/)).toBeTruthy();
  await fireEvent.press(screen.getByText('Which cards look right but are wrong?'));
  expect(screen.getByText(/NTAG213, NTAG215, NTAG216/)).toBeTruthy();
  expect(screen.getByText(/MIFARE Classic 1K/)).toBeTruthy();
});

it('More carries the story, the thanks, the code link and the trademark notice', async () => {
  const { MoreSheet } = require('../MoreSheet');
  const onHelp = jest.fn();
  await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <MoreSheet visible prefs={{ multiUse: true, haptics: true } as any} history={[]} onChange={() => {}} onCare={() => {}} onHelp={onHelp} onClose={() => {}} />
    </SafeAreaProvider>,
  );
  expect(screen.getByText(/small co-ops in places like Guatemala/)).toBeTruthy();
  expect(screen.getByText('VerdeNFC by Bernd Trappe')).toBeTruthy();
  expect(screen.getByText('See the code on GitHub')).toBeTruthy();
  expect(screen.getByText(/independent community project/)).toBeTruthy();
  await fireEvent.press(screen.getByText('Which card to buy, and how it works'));
  expect(onHelp).toHaveBeenCalled();
});
