/**
 * Progress aggregation and formatting helpers.
 *
 * @author Christian
 * @packageDocumentation
 */

import type { WorkoutSession } from '@/types/training';
import {
  aggregateProgressStats,
  exercisesWithRecords,
  formatVolumeKg,
  progressWindowRange,
} from '@/utils/progress';
import { formatDateRangeChip } from '@/utils/dates';

const base: WorkoutSession = {
  id: 's1',
  scheduledFor: '2026-10-02',
  dayLabel: 'Día A',
  routineVersion: 1,
  status: 'COMPLETED',
  totalVolumeKg: 200,
  finishedAt: '2026-10-02T18:47:00Z',
  exercises: [
    {
      exerciseId: 'e1',
      exerciseName: 'Press',
      targetSets: 2,
      targetReps: 10,
      targetLoadKg: 20,
      sets: [
        {
          setNumber: 1,
          loadKg: 20,
          reps: 10,
          recordedAt: '2026-10-02T18:00:00Z',
        },
      ],
    },
  ],
};

test('formats volume with full grouped kilograms', () => {
  expect(formatVolumeKg(200)).toBe('200 kg');
  expect(formatVolumeKg(28400)).toBe('28 400 kg');
});

test('aggregates adherence from completed, partial and skipped sessions', () => {
  const stats = aggregateProgressStats([
    { ...base, id: '1', status: 'COMPLETED', totalVolumeKg: 100 },
    { ...base, id: '2', status: 'PARTIAL', totalVolumeKg: 50 },
    { ...base, id: '3', status: 'SKIPPED', totalVolumeKg: 0 },
    { ...base, id: '4', status: 'PENDING', totalVolumeKg: 0 },
  ]);
  expect(stats.sessionCount).toBe(4);
  expect(stats.volumeKg).toBe(150);
  expect(stats.completedCount).toBe(1);
  expect(stats.scheduledCount).toBe(3);
  expect(stats.adherencePercentage).toBeCloseTo(33.3, 1);
});

test('lists unique exercises that already have recorded sets', () => {
  const options = exercisesWithRecords([
    base,
    {
      ...base,
      id: 's2',
      exercises: [
        {
          exerciseId: 'e2',
          exerciseName: 'Remo',
          targetSets: 3,
          targetReps: 10,
          targetLoadKg: 30,
          sets: [],
        },
        {
          exerciseId: 'e1',
          exerciseName: 'Press',
          targetSets: 2,
          targetReps: 10,
          targetLoadKg: 20,
          sets: [
            {
              setNumber: 1,
              loadKg: 22,
              reps: 8,
              recordedAt: '2026-10-03T18:00:00Z',
            },
          ],
        },
      ],
    },
  ]);
  expect(options).toEqual([{ exerciseId: 'e1', exerciseName: 'Press' }]);
});

test('builds an inclusive progress window ending today', () => {
  const range = progressWindowRange(4, new Date(2026, 9, 3));
  expect(range.to).toBe('2026-10-03');
  expect(range.from).toBe('2026-09-05');
});

test('formats history filter chips in Spanish', () => {
  expect(formatDateRangeChip('2026-09-01', '2026-09-13')).toBe(
    '1 – 13 sep 2026',
  );
});
