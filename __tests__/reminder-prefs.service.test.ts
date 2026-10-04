/**
 * Tests for device-local reminder preferences.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { reminderPrefsService } from '@/services/reminder-prefs.service';
import { DEFAULT_REMINDER_PREFS } from '@/types/reminders';

const storage = jest.mocked(AsyncStorage);
const key = 'formai.reminderPrefs';

beforeEach(async () => {
  await storage.clear();
  jest.clearAllMocks();
});

test('returns defaults when prefs are missing or malformed', async () => {
  await expect(reminderPrefsService.load()).resolves.toEqual(
    DEFAULT_REMINDER_PREFS,
  );
  await storage.setItem(key, '{invalid');
  await expect(reminderPrefsService.load()).resolves.toEqual(
    DEFAULT_REMINDER_PREFS,
  );
});

test('normalizes saved values and clears them on sign-out', async () => {
  await reminderPrefsService.save({ enabled: true, hour: 19.9, minute: 61 });

  expect(await storage.getItem(key)).toBe(
    JSON.stringify({ enabled: true, hour: 19, minute: 0 }),
  );
  await expect(reminderPrefsService.load()).resolves.toEqual({
    enabled: true,
    hour: 19,
    minute: 0,
  });

  await reminderPrefsService.clear();
  await expect(reminderPrefsService.load()).resolves.toEqual(
    DEFAULT_REMINDER_PREFS,
  );
});

test('uses defaults when reading storage fails', async () => {
  storage.getItem.mockRejectedValueOnce(new Error('storage unavailable'));
  await expect(reminderPrefsService.load()).resolves.toEqual(
    DEFAULT_REMINDER_PREFS,
  );
});
