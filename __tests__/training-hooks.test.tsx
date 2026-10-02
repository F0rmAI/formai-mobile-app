/**
 * Training and history hook behavior.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import ReactTestRenderer from 'react-test-renderer';
import { useTraining } from '@/hooks/useTraining';
import { useWorkoutHistory } from '@/hooks/useWorkoutHistory';
import { trainingService } from '@/services/training.service';
import type { ActiveRoutine, WorkoutSession } from '@/types/training';

jest.mock('@/services/training.service', () => ({
  trainingService: {
    getActiveRoutine: jest.fn(),
    getWorkoutSession: jest.fn(),
    recordSet: jest.fn(),
    correctSet: jest.fn(),
    finishSession: jest.fn(),
    listWorkoutSessions: jest.fn(),
  },
}));

const routine: ActiveRoutine = {
  routineId: 'r1',
  routineName: 'Fuerza',
  version: 1,
  startDate: '2026-10-01',
  trainingDays: ['MONDAY'],
  todaySessionOrder: 1,
  todayWorkoutSessionId: 's1',
  sessions: [],
};
const session: WorkoutSession = {
  id: 's1',
  scheduledFor: '2026-10-02',
  dayLabel: 'Día A',
  routineVersion: 1,
  status: 'PENDING',
  totalVolumeKg: 0,
  finishedAt: null,
  exercises: [
    {
      exerciseId: 'e1',
      exerciseName: 'Press',
      targetSets: 2,
      targetReps: 10,
      targetLoadKg: 20,
      sets: [],
    },
  ],
};
const input = { exerciseId: 'e1', setNumber: 1, loadKg: 20, reps: 10 };
const service = trainingService as jest.Mocked<typeof trainingService>;

let training!: ReturnType<typeof useTraining>;
let history!: ReturnType<typeof useWorkoutHistory>;
let renderer: ReactTestRenderer.ReactTestRenderer;
function TrainingHarness() {
  training = useTraining();
  return null;
}
function HistoryHarness() {
  history = useWorkoutHistory();
  return null;
}

beforeEach(() => {
  jest.clearAllMocks();
});
afterEach(async () => {
  if (renderer)
    await ReactTestRenderer.act(async () => {
      renderer.unmount();
    });
});

test('handles a rest day without requesting a workout session', async () => {
  service.getActiveRoutine.mockResolvedValue({
    ...routine,
    todaySessionOrder: null,
    todayWorkoutSessionId: null,
  });
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<TrainingHarness />);
  });
  expect(training.routine?.todayWorkoutSessionId).toBeNull();
  expect(training.session).toBeUndefined();
  expect(service.getWorkoutSession).not.toHaveBeenCalled();
});

test('handles a 404 routine result as no assigned routine', async () => {
  service.getActiveRoutine.mockResolvedValue(null);
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<TrainingHarness />);
  });
  expect(training.routine).toBeNull();
});

test('records and corrects sets, validates input, then finishes partial', async () => {
  service.getActiveRoutine.mockResolvedValue(routine);
  service.getWorkoutSession.mockResolvedValue(session);
  service.recordSet.mockResolvedValue({
    ...session,
    exercises: [
      {
        ...session.exercises[0],
        sets: [
          {
            setNumber: 1,
            loadKg: 20,
            reps: 10,
            recordedAt: '2026-10-02T10:00:00Z',
          },
        ],
      },
    ],
  });
  service.correctSet.mockResolvedValue({
    ...session,
    exercises: [
      {
        ...session.exercises[0],
        sets: [
          {
            setNumber: 1,
            loadKg: 22,
            reps: 9,
            recordedAt: '2026-10-02T10:01:00Z',
          },
        ],
      },
    ],
  });
  service.finishSession.mockResolvedValue({
    ...session,
    status: 'PARTIAL',
    finishedAt: '2026-10-02T10:10:00Z',
  });
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<TrainingHarness />);
  });
  await ReactTestRenderer.act(async () => {
    expect(await training.recordSet({ ...input, loadKg: -1 })).toBe(false);
  });
  expect(service.recordSet).not.toHaveBeenCalled();
  await ReactTestRenderer.act(async () => {
    await training.recordSet(input);
  });
  expect(training.summary?.completedSets).toBe(1);
  await ReactTestRenderer.act(async () => {
    await training.correctSet({ ...input, loadKg: 22, reps: 9 });
  });
  expect(service.correctSet).toHaveBeenCalledWith('s1', {
    ...input,
    loadKg: 22,
    reps: 9,
  });
  await ReactTestRenderer.act(async () => {
    await training.finishSession(true);
  });
  expect(service.finishSession).toHaveBeenCalledWith('s1', true);
  expect(training.session?.status).toBe('PARTIAL');
});

test('validates the date range and loads the next history page', async () => {
  service.listWorkoutSessions
    .mockResolvedValueOnce({
      content: [session],
      page: 0,
      size: 20,
      totalElements: 2,
      totalPages: 2,
    })
    .mockResolvedValueOnce({
      content: [{ ...session, id: 's2' }],
      page: 1,
      size: 20,
      totalElements: 2,
      totalPages: 2,
    })
    .mockResolvedValueOnce({
      content: [],
      page: 0,
      size: 20,
      totalElements: 0,
      totalPages: 0,
    });
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<HistoryHarness />);
  });
  expect(history.hasMore).toBe(true);
  await ReactTestRenderer.act(async () => {
    await history.loadMore();
  });
  expect(history.sessions.map(item => item.id)).toEqual(['s1', 's2']);
  await ReactTestRenderer.act(async () => {
    history.setFrom('2026-09-01');
    history.setTo('2026-09-30');
  });
  await ReactTestRenderer.act(async () => {
    expect(history.applyFilter()).toBe(true);
  });
  expect(service.listWorkoutSessions).toHaveBeenLastCalledWith(
    0,
    '2026-09-01',
    '2026-09-30',
  );
  await ReactTestRenderer.act(async () => {
    history.setTo('bad');
  });
  await ReactTestRenderer.act(async () => {
    expect(history.applyFilter()).toBe(false);
  });
});
