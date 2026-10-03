/**
 * On-device workout reminder preferences.
 *
 * @author Christian
 * @packageDocumentation
 */

/** Local reminder settings persisted on the device. */
export interface ReminderPrefs {
  /** Whether session reminders are active. */
  enabled: boolean;
  /** Local hour of the reminder (0–23). */
  hour: number;
  /** Local minute of the reminder (0–59). */
  minute: number;
}

/** Default prefs: off, 7:00 local time. */
export const DEFAULT_REMINDER_PREFS: ReminderPrefs = {
  enabled: false,
  hour: 7,
  minute: 0,
};

/** Content shown in the in-app notification preview. */
export interface ReminderPreviewContent {
  /** Notification title line. */
  title: string;
  /** Notification body line. */
  body: string;
}
