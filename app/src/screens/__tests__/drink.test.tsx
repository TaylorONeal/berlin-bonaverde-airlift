import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DEFAULT_PREFS } from '../../state/store';
import { DrinkSheet } from '../DrinkSheet';
import { summaryLine, summaryParts, templateFor } from '../cardFor';

const metrics = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 47, left: 0, right: 0, bottom: 34 } };

async function open(prefs = DEFAULT_PREFS) {
  const onChange = jest.fn();
  await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <DrinkSheet visible prefs={prefs} onChange={onChange} onClose={() => {}} />
    </SafeAreaProvider>,
  );
  return onChange;
}

it('shows the special roasts, The Wave first', async () => {
  const onChange = await open();
  expect(screen.getByText('Special roasts')).toBeTruthy();
  await fireEvent.press(screen.getByLabelText('The Wave, 50 g, medium to dark'));
  expect(onChange).toHaveBeenCalledWith({ itemId: 'special-wave', pauseMinutes: null, grindSeconds: null });
});

it('picking Big Pot sets a 75 second grind', async () => {
  const onChange = await open();
  await fireEvent.press(screen.getByLabelText('Big Pot, 90 g green beans, 1 L, grinds 75 s'));
  expect(onChange).toHaveBeenCalledWith({ itemId: 'rgb-big', pauseMinutes: null, grindSeconds: 75 });
});

it('offers a grind time for drinks that grind, showing the card default', async () => {
  const onChange = await open();
  expect(screen.getByText('Grind time')).toBeTruthy();
  expect(screen.getByLabelText('Grind 60 seconds').props.accessibilityState.selected).toBe(true);
  await fireEvent.press(screen.getByLabelText('Grind 75 seconds'));
  expect(onChange).toHaveBeenCalledWith({ grindSeconds: 75 });
});

it('hides the grind time for roast-only drinks', async () => {
  await open({ ...DEFAULT_PREFS, itemId: 'special-wave' });
  expect(screen.queryByText('Grind time')).toBeNull();
});

it('writes the chosen grind time into the card', () => {
  const big = templateFor({ ...DEFAULT_PREFS, itemId: 'rgb-big', grindSeconds: 75 });
  expect(big.image[40]).toBe(0x40);
  expect(summaryLine({ ...DEFAULT_PREFS, itemId: 'rgb-big', grindSeconds: 75 }, big.item)).toBe('Big Pot. Reusable.');
  const full = templateFor({ ...DEFAULT_PREFS, grindSeconds: 45 });
  expect(full.image[40]).toBe(0x23);
  expect(summaryLine({ ...DEFAULT_PREFS, grindSeconds: 45 }, full.item)).toBe('Full Pot. Grinds 45 s. Reusable.');
  const wave = templateFor({ ...DEFAULT_PREFS, itemId: 'special-wave', grindSeconds: 75 });
  expect(wave.image[40]).toBe(0x23); // roast only: left as the card has it
});

it('splits the summary into the drink name and its details for the home panel', () => {
  const full = templateFor({ ...DEFAULT_PREFS, grindSeconds: 45 });
  expect(summaryParts({ ...DEFAULT_PREFS, grindSeconds: 45 }, full.item)).toEqual({ title: 'Full Pot', detail: 'Grinds 45 s. Reusable.' });
});

it('describes every card on the menu in plain words', () => {
  const { MENU } = require('../../protocol');
  const { CARD_ABOUT } = require('../../content/cards');
  for (const m of MENU) expect(CARD_ABOUT[m.id]).toBeTruthy();
  expect(Object.keys(CARD_ABOUT).sort()).toEqual(MENU.map((m: { id: string }) => m.id).sort());
});
