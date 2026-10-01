/**
 * @format
 */

import { formatLongDate } from '@/utils/dates';

test('formatea la fecha larga en español', () => {
  expect(formatLongDate(new Date(2026, 8, 17))).toBe('Jueves 17 de septiembre');
  expect(formatLongDate(new Date(2027, 0, 3))).toBe('Domingo 3 de enero');
});
