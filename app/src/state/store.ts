import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_ITEM_ID } from '../protocol';

export interface Prefs {
  itemId: string;
  /** Pause after roast in minutes, roast-grind-brew only. null keeps the card's own default. */
  pauseMinutes: number | null;
  /** Reusable cards by default. Single-use is an option under More. */
  multiUse: boolean;
  haptics: boolean;
}

export interface HistoryEntry {
  at: string;
  itemId: string;
  title: string;
  uid: string;
}

const PREFS_KEY = 'berlin-airlift/prefs/v1';
const HISTORY_KEY = 'berlin-airlift/history/v1';
export const DEFAULT_PREFS: Prefs = { itemId: DEFAULT_ITEM_ID, pauseMinutes: null, multiUse: true, haptics: true };

export function usePrefs() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  useEffect(() => {
    AsyncStorage.getItem(PREFS_KEY)
      .then((raw) => raw && setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) }))
      .catch(() => {});
  }, []);
  const update = useCallback((patch: Partial<Prefs>) => {
    setPrefs((p) => {
      const next = { ...p, ...patch };
      AsyncStorage.setItem(PREFS_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);
  return [prefs, update] as const;
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  useEffect(() => {
    AsyncStorage.getItem(HISTORY_KEY)
      .then((raw) => raw && setHistory(JSON.parse(raw)))
      .catch(() => {});
  }, []);
  const add = useCallback((e: HistoryEntry) => {
    setHistory((h) => {
      const next = [e, ...h].slice(0, 30);
      AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);
  return [history, add] as const;
}
