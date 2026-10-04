/**
 * Unit tests for reminder formatting and schedule helpers.
 *
 * @author Christian
 * @packageDocumentation
 */

import {
  buildReminderCopy,
  formatClockShort,
  formatReminderSubtitle,
  formatReminderTimeLabel,
  nextRoutineSessionDate,
  reminderBadgeLabel,
  resolveRoutineDayForDate,
  upcomingTrainingDates,
} from '@/utils/reminders';
import type { ReminderPrefs } from '@/types/reminders';
import type { ActiveRoutine, RoutineDay } from '@/types/training';

const enabled: ReminderPrefs = { enabled: true, hour: 7, minute: 0 };
const disabled: ReminderPrefs = { enabled: false, hour: 7, minute: 0 };

const dayA: RoutineDay = {
  order: 1,
  label: 'Día A · Tren superior',
  exercises: [
    {
      exerciseId: '1',
      exerciseName: 'Press',
      sets: 3,
      reps: 10,
      targetLoadKg: 40,
      restSeconds: 90,
    },
    {
      exerciseId: '2',
      exerciseName: 'Remo',
      sets: 3,
      reps: 10,
      targetLoadKg: 40,
      restSeconds: 90,
    },
    {
      exerciseId: '3',
      exerciseName: 'Militar',
      sets: 4,
      reps: 12,
      targetLoadKg: 20,
      restSeconds: 60,
    },
  ],
};

test('formats Spanish time labels', () => {
  expect(formatReminderTimeLabel(7, 0)).toBe('7:00 a. m.');
  expect(formatReminderTimeLabel(19, 5)).toBe('7:05 p. m.');
  expect(formatClockShort(7, 0)).toBe('7:00');
});

test('builds profile subtitle and badge', () => {
  expect(formatReminderSubtitle(disabled)).toBe('A las 7:00');
  expect(reminderBadgeLabel(false)).toBe('Desactivados');
  expect(formatReminderSubtitle(enabled)).toBe('A las 7:00');
  expect(reminderBadgeLabel(true)).toBe('Activados');
  expect(
    formatReminderSubtitle(enabled, ['MONDAY', 'WEDNESDAY', 'FRIDAY']),
  ).toBe('Lun, Mié, Vie a las 7:00');
});

test('lists upcoming training dates', () => {
  const monday = new Date(2026, 9, 5); // Monday
  const dates = upcomingTrainingDates(
    ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
    monday,
    7,
  );
  expect(dates.map(d => d.getDay())).toEqual([1, 3, 5]);
});

test('builds notification copy from a routine day', () => {
  expect(buildReminderCopy(dayA)).toEqual({
    title: 'Hoy toca Día A · Tren superior',
    body: '3 ejercicios · 10 series. ¡Tú puedes!',
  });
  expect(buildReminderCopy().title).toContain('entrenar');
});

test('resolves today session by order', () => {
  const today = new Date(2026, 9, 5);
  const resolved = resolveRoutineDayForDate(
    [dayA, { ...dayA, order: 2, label: 'Día B' }],
    ['MONDAY', 'WEDNESDAY'],
    today,
    1,
    today,
  );
  expect(resolved?.label).toBe('Día A · Tren superior');
});

test('derives the next routine day only when the weekly mapping is known', () => {
  const monday = new Date(2026, 9, 5);
  const routine: ActiveRoutine = {
    routineId: 'r1',
    routineName: 'Fuerza',
    version: 1,
    startDate: '2026-10-01',
    trainingDays: ['MONDAY', 'WEDNESDAY'],
    todaySessionOrder: 1,
    todayWorkoutSessionId: 's1',
    sessions: [dayA, { ...dayA, order: 2, label: 'Día B' }],
  };
  expect(nextRoutineSessionDate(routine, 2, monday)?.getDate()).toBe(7);
  expect(
    nextRoutineSessionDate({ ...routine, trainingDays: ['MONDAY'] }, 2, monday),
  ).toBeUndefined();
  expect(
    nextRoutineSessionDate(
      { ...routine, todaySessionOrder: null },
      1,
      monday,
    )?.getDate(),
  ).toBe(12);
});
