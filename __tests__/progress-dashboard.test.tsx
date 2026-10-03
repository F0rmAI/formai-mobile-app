/**
 * Progress dashboard hook behavior.
 *
 * @author Christian
 * @packageDocumentation
 */

import ReactTestRenderer from 'react-test-renderer';
import { useProgressDashboard } from '@/hooks/useProgressDashboard';
import { progressChartService } from '@/services/progress-chart.service';
import { workoutSessionService } from '@/services/workout-session.service';
import type { WorkoutSession } from '@/types/training';

jest.mock('@/services/workout-session.service', () => ({
  workoutSessionService: { listWorkoutSessions: jest.fn() },
}));
jest.mock('@/services/progress-chart.service', () => ({
  progressChartService: { getMine: jest.fn() },
}));

const session: WorkoutSession = {
  id: 's1',
  scheduledFor: '2026-10-02',
  dayLabel: 'Día A',
  routineVersion: 1,
  status: 'COMPLETED',
  totalVolumeKg: 200,
  finishedAt: '2026-10-02T18:00:00Z',
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
          recordedAt: '2026-10-02T17:00:00Z',
        },
      ],
    },
  ],
};

const sessions = jest.mocked(workoutSessionService.listWorkoutSessions);
const charts = jest.mocked(progressChartService.getMine);

let dashboard!: ReturnType<typeof useProgressDashboard>;
let renderer: ReactTestRenderer.ReactTestRenderer;

function Harness() {
  dashboard = useProgressDashboard();
  return null;
}

beforeEach(() => {
  jest.clearAllMocks();
  sessions.mockResolvedValue({
    content: [session],
    page: 0,
    size: 20,
    totalElements: 1,
    totalPages: 1,
  });
  charts.mockResolvedValue({
    exerciseId: 'e1',
    weeks: 4,
    enoughData: false,
    points: [{ date: '2026-10-02', maxLoadKg: 20, volumeKg: 200 }],
  });
});

afterEach(async () => {
  if (renderer) {
    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
  }
});

test('loads period stats, exercise chips and flags insufficient chart data', async () => {
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<Harness />);
  });
  await ReactTestRenderer.act(async () => undefined);

  expect(dashboard.stats.sessionCount).toBe(1);
  expect(dashboard.stats.volumeKg).toBe(200);
  expect(dashboard.exercises).toEqual([
    { exerciseId: 'e1', exerciseName: 'Press' },
  ]);
  expect(dashboard.selectedExerciseId).toBe('e1');
  expect(charts).toHaveBeenCalledWith('e1', 4);
  expect(dashboard.chart?.enoughData).toBe(false);
});

test('reloads the chart when the period changes', async () => {
  charts.mockResolvedValue({
    exerciseId: 'e1',
    weeks: 8,
    enoughData: true,
    points: [
      { date: '2026-09-01', maxLoadKg: 18, volumeKg: 180 },
      { date: '2026-10-02', maxLoadKg: 20, volumeKg: 200 },
    ],
  });
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<Harness />);
  });
  await ReactTestRenderer.act(async () => undefined);
  await ReactTestRenderer.act(async () => {
    dashboard.setWeeks('8');
  });
  await ReactTestRenderer.act(async () => undefined);

  expect(sessions).toHaveBeenCalled();
  expect(charts).toHaveBeenCalledWith('e1', 8);
  expect(dashboard.weeks).toBe(8);
  expect(dashboard.chart?.enoughData).toBe(true);
});
