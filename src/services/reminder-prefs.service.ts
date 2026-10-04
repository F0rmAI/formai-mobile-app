/**
 * Device-local reminder preference storage (not HTTP).
 *
 * @author Christian
 * @packageDocumentation
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DEFAULT_REMINDER_PREFS,
  type ReminderPrefs,
} from '@/types/reminders';

const STORAGE_KEY = 'formai.reminderPrefs';

function normalizePrefs(value: unknown): ReminderPrefs {
  if (!value || typeof value !== 'object') {
    return { ...DEFAULT_REMINDER_PREFS };
  }
  const record = value as Partial<ReminderPrefs>;
  const hour =
    typeof record.hour === 'number' && record.hour >= 0 && record.hour <= 23
      ? Math.floor(record.hour)
      : DEFAULT_REMINDER_PREFS.hour;
  const minute =
    typeof record.minute === 'number' &&
    record.minute >= 0 &&
    record.minute <= 59
      ? Math.floor(record.minute)
      : DEFAULT_REMINDER_PREFS.minute;
  return {
    enabled: Boolean(record.enabled),
    hour,
    minute,
  };
}

/** Loads and saves reminder prefs on the device. */
export const reminderPrefsService = {
  /**
   * Reads prefs from AsyncStorage.
   *
   * @returns Normalized prefs (defaults when missing or invalid).
   */
  async load(): Promise<ReminderPrefs> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return { ...DEFAULT_REMINDER_PREFS };
      }
      return normalizePrefs(JSON.parse(raw) as unknown);
    } catch {
      return { ...DEFAULT_REMINDER_PREFS };
    }
  },

  /**
   * Persists prefs to AsyncStorage.
   *
   * @param prefs - Prefs to store.
   */
  async save(prefs: ReminderPrefs): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(normalizePrefs(prefs)));
  },

  /**
   * Clears stored prefs (used on sign-out).
   */
  async clear(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },
};
