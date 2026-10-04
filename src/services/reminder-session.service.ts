/**
 * Sign-out cleanup for on-device reminders (not HTTP).
 *
 * @author Christian
 * @packageDocumentation
 */

import { reminderNotificationsService } from '@/services/reminder-notifications.service';
import { reminderPrefsService } from '@/services/reminder-prefs.service';

/** Cancels scheduled reminders and clears local prefs. */
export async function clearRemindersOnSignOut() {
  await reminderNotificationsService.cancelAll();
  await reminderPrefsService.clear();
}
