/**
 * Tests for reminder cleanup during sign-out.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { reminderNotificationsService } from '@/services/reminder-notifications.service';
import { reminderPrefsService } from '@/services/reminder-prefs.service';
import { clearRemindersOnSignOut } from '@/services/reminder-session.service';

jest.mock('@/services/reminder-notifications.service', () => ({
  reminderNotificationsService: { cancelAll: jest.fn() },
}));
jest.mock('@/services/reminder-prefs.service', () => ({
  reminderPrefsService: { clear: jest.fn() },
}));

test('cancels scheduled notifications before removing local prefs', async () => {
  const steps: string[] = [];
  jest.mocked(reminderNotificationsService.cancelAll).mockImplementation(async () => {
    steps.push('cancel');
  });
  jest.mocked(reminderPrefsService.clear).mockImplementation(async () => {
    steps.push('clear');
  });

  await clearRemindersOnSignOut();

  expect(steps).toEqual(['cancel', 'clear']);
});
