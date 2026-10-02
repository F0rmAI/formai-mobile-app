/**
 * @format
 */

import { formatLongDate, formatTime } from '@/utils/dates';

test('formatea la fecha larga en español', () => {
  expect(formatLongDate(new Date(2026, 8, 17))).toBe('Jueves 17 de septiembre');
  expect(formatLongDate(new Date(2027, 0, 3))).toBe('Domingo 3 de enero');
});

test('formatea la hora en 24 horas', () => {
  expect(formatTime(new Date(2026, 8, 17, 7, 5))).toBe('07:05');
  expect(formatTime(new Date(2026, 8, 17, 18, 30))).toBe('18:30');
});
