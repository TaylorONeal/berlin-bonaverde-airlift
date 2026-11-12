import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { fakeAdapter, FakeCard } from '../../nfc';
import { DEFAULT_PREFS } from '../../state/store';
import { Home } from '../Home';

jest.mock('expo-haptics', () => ({
  impactAsync: () => Promise.resolve(),
  notificationAsync: () => Promise.resolve(),
  selectionAsync: () => Promise.resolve(),
  ImpactFeedbackStyle: { Light: 'light' },
  NotificationFeedbackType: { Success: 'success', Error: 'error' },
}));

const metrics = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 47, left: 0, right: 0, bottom: 34 } };

async function setup(adapter = fakeAdapter()) {
  const addHistory = jest.fn();
  await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <Home adapter={adapter} demo={false} onDemo={() => {}} prefs={DEFAULT_PREFS} setPrefs={() => {}} history={[]} addHistory={addHistory} />
    </SafeAreaProvider>,
  );
  return { addHistory };
}

it('opens on one big button with the default already chosen', async () => {
  await setup();
  expect(await screen.findByText('Write a card')).toBeTruthy();
  expect(screen.getByText('Full Pot. Reusable.')).toBeTruthy();
});

it('makes a card in one tap and shows the success moment', async () => {
  const card = new FakeCard();
  const { addHistory } = await setup(fakeAdapter({ card }));
  await fireEvent.press(screen.getByText('Write a card'));
  expect(await screen.findByText('Full Pot card ready.')).toBeTruthy();
  expect(addHistory).toHaveBeenCalledTimes(1);
  expect(card.mem[41]).toBe(0x01);
});

it('explains a failed write in plain words', async () => {
  await setup(fakeAdapter({ corruptPage: 7 }));
  await fireEvent.press(screen.getByText('Write a card'));
  expect(await screen.findByText("The card didn't take it. Try again, or use another card.")).toBeTruthy();
  expect(screen.getByText('Try again')).toBeTruthy();
});

it('says who the app is for, what it is, and offers help', async () => {
  await setup();
  expect(screen.getByText('For Bonaverde Berlin owners')).toBeTruthy();
  expect(screen.getByText(/Already have a Bonaverde Berlin coffee machine/)).toBeTruthy();
  expect(screen.getByLabelText('Help')).toBeTruthy();
});
