/**
 * Pure helpers for workout reminder prefs and copy.
 *
 * @author Christian
 * @packageDocumentation
 */

import type { ReminderPrefs, ReminderPreviewContent } from '@/types/reminders';
import type { ActiveRoutine, RoutineDay, TrainingDay } from '@/types/training';

/** Maps backend training days to `Date#getDay()` values. */
const TRAINING_DAY_TO_JS: Record<TrainingDay, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

const SHORT_WEEKDAYS: Record<TrainingDay, string> = {
  MONDAY: 'Lun',
  TUESDAY: 'Mar',
  WEDNESDAY: 'Mié',
  THURSDAY: 'Jue',
  FRIDAY: 'Vie',
  SATURDAY: 'Sáb',
  SUNDAY: 'Dom',
};

const TRAINING_DAY_ORDER: TrainingDay[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

/**
 * Formats a local clock time for Spanish UI (`7:00 a. m.`).
 *
 * @param hour - Hour in 24h form.
 * @param minute - Minute.
 * @returns Localized time label.
 */
export function formatReminderTimeLabel(hour: number, minute: number): string {
  const period = hour < 12 ? 'a. m.' : 'p. m.';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const pad = String(minute).padStart(2, '0');
  return `${hour12}:${pad} ${period}`;
}

/**
 * Builds the Profile row subtitle for reminder prefs.
 *
 * @param prefs - Current local prefs.
 * @param trainingDays - Days from the active routine.
 * @returns Subtitle copy for the list row.
 */
export function formatReminderSubtitle(
  prefs: ReminderPrefs,
  trainingDays: TrainingDay[] = [],
): string {
  const time = formatClockShort(prefs.hour, prefs.minute);
  if (trainingDays.length === 0) {
    return `A las ${time}`;
  }
  if (trainingDays.length === 7) {
    return `Todos los días a las ${time}`;
  }
  const ordered = TRAINING_DAY_ORDER.filter(day => trainingDays.includes(day));
  const days = ordered.map(day => SHORT_WEEKDAYS[day]).join(', ');
  return `${days} a las ${time}`;
}

/**
 * Short 24h-style clock for list subtitles (`7:00`).
 *
 * @param hour - Hour in 24h form.
 * @param minute - Minute.
 * @returns `H:mm` without period.
 */
export function formatClockShort(hour: number, minute: number): string {
  return `${hour}:${String(minute).padStart(2, '0')}`;
}

/**
 * Profile badge label when reminders are on.
 *
 * @param enabled - Whether reminders are enabled.
 * @returns Badge text or `undefined` when off.
 */
export function reminderBadgeLabel(enabled: boolean): string {
  return enabled ? 'Activados' : 'Desactivados';
}

/**
 * Converts a training day to the JS weekday index.
 *
 * @param day - Backend training day.
 * @returns `Date#getDay()` value.
 */
export function trainingDayToJsWeekday(day: TrainingDay): number {
  return TRAINING_DAY_TO_JS[day];
}

/**
 * Lists upcoming local dates (inclusive of today) that match training days.
 *
 * @param trainingDays - Weekly schedule.
 * @param from - Anchor date (local calendar).
 * @param dayCount - How many calendar days ahead to scan (including `from`).
 * @returns Local midnight dates that should receive a reminder.
 */
export function upcomingTrainingDates(
  trainingDays: TrainingDay[],
  from: Date,
  dayCount = 14,
): Date[] {
  if (trainingDays.length === 0) {
    return [];
  }
  const allowed = new Set(trainingDays.map(trainingDayToJsWeekday));
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const dates: Date[] = [];
  for (let offset = 0; offset < dayCount; offset += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + offset);
    if (allowed.has(date.getDay())) {
      dates.push(date);
    }
  }
  return dates;
}

/**
 * Builds notification title/body for a routine day.
 *
 * @param day - Routine day, when known.
 * @returns Preview / notification copy.
 */
export function buildReminderCopy(day?: RoutineDay): ReminderPreviewContent {
  if (!day) {
    return {
      title: 'Hoy toca entrenar',
      body: 'Tienes una sesión pendiente. ¡Tú puedes!',
    };
  }
  const exerciseCount = day.exercises.length;
  const setCount = day.exercises.reduce(
    (sum, exercise) => sum + exercise.sets,
    0,
  );
  return {
    title: `Hoy toca ${day.label}`,
    body: `${exerciseCount} ejercicios · ${setCount} series. ¡Tú puedes!`,
  };
}

/**
 * Resolves which routine day applies on a calendar date using session order rotation.
 * Uses `todaySessionOrder` when the date is today; otherwise maps by index in the week cycle.
 *
 * @param sessions - Ordered routine sessions.
 * @param trainingDays - Weekly training days.
 * @param date - Target local date.
 * @param todaySessionOrder - Today's session order from the API, when available.
 * @param today - Local "today" for comparison.
 * @returns Matching routine day or `undefined`.
 */
export function resolveRoutineDayForDate(
  sessions: RoutineDay[],
  trainingDays: TrainingDay[],
  date: Date,
  todaySessionOrder: number | null | undefined,
  today: Date = new Date(),
): RoutineDay | undefined {
  if (sessions.length === 0 || trainingDays.length === 0) {
    return undefined;
  }
  const sameDay =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
  if (sameDay && todaySessionOrder != null) {
    return sessions.find(session => session.order === todaySessionOrder);
  }
  const orderedDays = TRAINING_DAY_ORDER.filter(day =>
    trainingDays.includes(day),
  );
  const jsDay = date.getDay();
  const trainingDay = (Object.keys(TRAINING_DAY_TO_JS) as TrainingDay[]).find(
    key => TRAINING_DAY_TO_JS[key] === jsDay,
  );
  if (!trainingDay || !orderedDays.includes(trainingDay)) {
    return undefined;
  }
  const index = orderedDays.indexOf(trainingDay);
  return sessions[index % sessions.length];
}

/** Finds the next scheduled date for a routine session when day mapping is unambiguous. */
export function nextRoutineSessionDate(
  routine: ActiveRoutine,
  order: number,
  today: Date = new Date(),
): Date | undefined {
  if (routine.sessions.length !== routine.trainingDays.length) return undefined;
  const inferredToday = resolveRoutineDayForDate(
    routine.sessions,
    routine.trainingDays,
    today,
    null,
    today,
  );
  const dayMappingChanged =
    routine.todaySessionOrder !== null &&
    inferredToday !== undefined &&
    inferredToday.order !== routine.todaySessionOrder;
  for (let offset = 0; offset <= 7; offset += 1) {
    if (offset > 0 && dayMappingChanged) return undefined;
    if (offset === 0 && routine.todaySessionOrder === null) continue;
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + offset,
    );
    if (
      resolveRoutineDayForDate(
        routine.sessions,
        routine.trainingDays,
        date,
        routine.todaySessionOrder,
        today,
      )?.order === order
    ) {
      return date;
    }
  }
  return undefined;
}
