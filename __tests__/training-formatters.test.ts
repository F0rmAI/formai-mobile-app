/**
 * Tests for calendar dates shown in training screens.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import {
  formatRoutineStartDate,
  formatTrainingDate,
} from '@/utils/training-formatters';

test('formats a workout date without shifting the calendar day', () => {
  expect(formatTrainingDate('2026-10-02')).toBe('viernes, 2 de octubre');
});

test('includes the year for a routine start date', () => {
  expect(formatRoutineStartDate('2026-10-02')).toBe('2 de octubre de 2026');
});
