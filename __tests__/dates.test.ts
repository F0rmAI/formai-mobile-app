/**
 * Tests for Spanish date and time formatting.
 *
 * @author Carlos
 * @packageDocumentation
 */

import { formatLongDate, formatTime } from '@/utils/dates';

test('formats long dates in Spanish', () => {
  expect(formatLongDate(new Date(2026, 8, 17))).toBe('Jueves 17 de septiembre');
  expect(formatLongDate(new Date(2027, 0, 3))).toBe('Domingo 3 de enero');
});

test('formats times in 24-hour form', () => {
  expect(formatTime(new Date(2026, 8, 17, 7, 5))).toBe('07:05');
  expect(formatTime(new Date(2026, 8, 17, 18, 30))).toBe('18:30');
});
