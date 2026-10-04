/**
 * Tests for Spanish date and time formatting.
 *
 * @author Carlos
 * @packageDocumentation
 */

import {
  formatLongDate,
  formatTime,
  formatWorkoutHistoryDate,
  parseFilterDate,
} from '@/utils/dates';

test('formats long dates in Spanish', () => {
  expect(formatLongDate(new Date(2026, 8, 17))).toBe('Jueves 17 de septiembre');
  expect(formatLongDate(new Date(2027, 0, 3))).toBe('Domingo 3 de enero');
});

test('parses valid filter dates and rejects impossible calendar days', () => {
  expect(parseFilterDate('13/09/2026')).toBe('2026-09-13');
  expect(parseFilterDate('2026-09-13')).toBe('2026-09-13');
  expect(parseFilterDate('31/02/2026')).toBeUndefined();
});

test('formats times in 24-hour form', () => {
  expect(formatTime(new Date(2026, 8, 17, 7, 5))).toBe('07:05');
  expect(formatTime(new Date(2026, 8, 17, 18, 30))).toBe('18:30');
});

test('formats workout calendar dates in both Spanish history styles', () => {
  expect(formatWorkoutHistoryDate('2026-10-02', 'list')).toBe('Viernes 2 oct');
  expect(formatWorkoutHistoryDate('2026-10-02', 'detail')).toBe(
    'Viernes 2 de octubre de 2026',
  );
  expect(formatWorkoutHistoryDate('2027-01-03', 'list')).toBe('Domingo 3 ene');
});
