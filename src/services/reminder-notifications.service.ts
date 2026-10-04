/**
 * Local workout reminder scheduling via Notifee (not HTTP).
 *
 * @author Christian
 * @packageDocumentation
 */

import type { ReminderPrefs, ReminderPreviewContent } from '@/types/reminders';
import type { ActiveRoutine, TrainingDay, WorkoutStatus } from '@/types/training';
import {
  buildReminderCopy,
  resolveRoutineDayForDate,
  upcomingTrainingDates,
} from '@/utils/reminders';

const CHANNEL_ID = 'workout_reminders';
const ID_PREFIX = 'formai-reminder-';

type NotifeeModule = typeof import('@notifee/react-native');

let cachedNotifee: NotifeeModule | null | undefined;

/**
 * Lazily loads Notifee. Returns `null` when the native binary was not rebuilt
 * with the package (common until `npm run android` succeeds after install).
 */
function getNotifee(): NotifeeModule | null {
  if (cachedNotifee !== undefined) {
    return cachedNotifee;
  }
  try {
    // Require at call time so Profile can mount without a linked native module.
    const mod = require('@notifee/react-native') as NotifeeModule;
    // Touching default triggers native lookup; catch "native module not found".
    if (!mod?.default) {
      cachedNotifee = null;
      return null;
    }
    cachedNotifee = mod;
    return mod;
  } catch {
    cachedNotifee = null;
    return null;
  }
}

async function ensureChannel(mod: NotifeeModule) {
  const { default: notifee, AndroidImportance } = mod;
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Recordatorios de sesión',
    importance: AndroidImportance.HIGH,
  });
}

/**
 * Options used when syncing the local notification schedule.
 */
export interface SyncReminderScheduleInput {
  /** Local prefs. */
  prefs: ReminderPrefs;
  /** Active routine, when assigned. */
  routine: ActiveRoutine | null | undefined;
  /** Today's session status, when known. */
  todayStatus?: WorkoutStatus;
}

/** Schedules and cancels on-device workout reminders. */
export const reminderNotificationsService = {
  /**
   * Whether the Notifee native module is linked in this binary.
   *
   * @returns `true` when local notifications can run.
   */
  isAvailable(): boolean {
    return getNotifee() != null;
  },

  /**
   * Requests notification permission.
   *
   * @returns `true` when notifications may be shown.
   */
  async requestPermission(): Promise<boolean> {
    const mod = getNotifee();
    if (!mod) {
      return false;
    }
    try {
      const { default: notifee, AuthorizationStatus } = mod;
      const settings = await notifee.requestPermission();
      return (
        settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
        settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
      );
    } catch {
      cachedNotifee = null;
      return false;
    }
  },

  /**
   * Cancels every FormAI reminder notification.
   */
  async cancelAll(): Promise<void> {
    const mod = getNotifee();
    if (!mod) {
      return;
    }
    try {
      const { default: notifee } = mod;
      const ids = await notifee.getTriggerNotificationIds();
      await Promise.all(
        ids
          .filter((id) => id.startsWith(ID_PREFIX))
          .map((id) => notifee.cancelNotification(id)),
      );
    } catch {
      cachedNotifee = null;
    }
  },

  /**
   * Displays an immediate sample notification for device QA.
   *
   * @param content - Title and body to show.
   */
  async displaySample(content: ReminderPreviewContent): Promise<void> {
    const mod = getNotifee();
    if (!mod) {
      return;
    }
    const { default: notifee } = mod;
    await ensureChannel(mod);
    await notifee.displayNotification({
      title: content.title,
      body: content.body,
      android: {
        channelId: CHANNEL_ID,
        pressAction: { id: 'default' },
      },
    });
  },

  /**
   * Rebuilds the local schedule from prefs and the active routine.
   *
   * @param input - Prefs, routine and today's status.
   */
  async syncSchedule(input: SyncReminderScheduleInput): Promise<void> {
    const mod = getNotifee();
    if (!mod) {
      return;
    }

    await this.cancelAll();
    const { prefs, routine, todayStatus } = input;
    if (!prefs.enabled || !routine || routine.trainingDays.length === 0) {
      return;
    }

    const { default: notifee, AlarmType, TriggerType } = mod;
    await ensureChannel(mod);
    const now = new Date();
    const dates = upcomingTrainingDates(
      routine.trainingDays as TrainingDay[],
      now,
      14,
    );

    for (const date of dates) {
      const isToday =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();
      if (isToday && todayStatus === 'COMPLETED') {
        continue;
      }

      const fireAt = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        prefs.hour,
        prefs.minute,
        0,
        0,
      );
      if (fireAt.getTime() <= now.getTime()) {
        continue;
      }

      const day = resolveRoutineDayForDate(
        routine.sessions,
        routine.trainingDays,
        date,
        routine.todaySessionOrder,
        now,
      );
      const copy = buildReminderCopy(day);
      const id = `${ID_PREFIX}${fireAt.toISOString()}`;

      await notifee.createTriggerNotification(
        {
          id,
          title: copy.title,
          body: copy.body,
          android: {
            channelId: CHANNEL_ID,
            pressAction: { id: 'default' },
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: fireAt.getTime(),
          alarmManager: {
            type: AlarmType.SET_EXACT_AND_ALLOW_WHILE_IDLE,
          },
        },
      );
    }
  },
};
