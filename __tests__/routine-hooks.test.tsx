/**
 * Tests for useActiveRoutine and useWorkoutSession request states.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import ReactTestRenderer from 'react-test-renderer';
import { useActiveRoutine } from '@/hooks/useActiveRoutine';
import { useWorkoutSession } from '@/hooks/useWorkoutSession';
import { activeRoutineService } from '@/services/active-routine.service';
import { workoutSessionService } from '@/services/workout-session.service';
import type { ActiveRoutine, WorkoutSession } from '@/types/training';

jest.mock('@/services/active-routine.service', () => ({
  activeRoutineService: { getActiveRoutine: jest.fn() },
}));
jest.mock('@/services/workout-session.service', () => ({
  workoutSessionService: {
    getWorkoutSession: jest.fn(),
  },
}));

const service = {
  ...activeRoutineService,
  ...workoutSessionService,
} as jest.Mocked<typeof activeRoutineService & typeof workoutSessionService>;
const routine: ActiveRoutine = {
  routineId: 'r1',
  routineName: 'Fuerza',
  version: 1,
  startDate: '2026-10-01',
  trainingDays: ['MONDAY'],
  todaySessionOrder: null,
  todayWorkoutSessionId: null,
  sessions: [],
};
const session: WorkoutSession = {
  id: 's1',
  scheduledFor: '2026-10-02',
  dayLabel: 'Día A',
  routineVersion: 1,
  status: 'COMPLETED',
  totalVolumeKg: 20,
  finishedAt: '2026-10-02T10:00:00Z',
  exercises: [],
};

let active!: ReturnType<typeof useActiveRoutine>;
let workout!: ReturnType<typeof useWorkoutSession>;
let renderer: ReactTestRenderer.ReactTestRenderer;

function ActiveHarness() {
  active = useActiveRoutine();
  return null;
}

function SessionHarness() {
  workout = useWorkoutSession('s1');
  return null;
}

afterEach(async () => {
  if (renderer) {
    await ReactTestRenderer.act(async () => renderer.unmount());
  }
  jest.clearAllMocks();
});

test('loads the current routine and clears its isLoading state', async () => {
  service.getActiveRoutine.mockResolvedValue(routine);
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<ActiveHarness />);
  });
  expect(active.routine).toEqual(routine);
  expect(active.isLoading).toBe(false);
  expect(active.error).toBeUndefined();
});

test('retries a failed routine request', async () => {
  service.getActiveRoutine.mockRejectedValueOnce(new Error('offline'));
  service.getActiveRoutine.mockResolvedValueOnce(routine);
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<ActiveHarness />);
  });
  expect(active.error).toBe('No pudimos cargar tu rutina');
  await ReactTestRenderer.act(async () => active.retry());
  expect(active.routine).toEqual(routine);
  expect(active.error).toBeUndefined();
});

test('refreshes the routine subtitle without blanking the assigned routine', async () => {
  service.getActiveRoutine.mockResolvedValueOnce(routine);
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<ActiveHarness />);
  });
  let resolveRoutine!: (value: ActiveRoutine | null) => void;
  service.getActiveRoutine.mockReturnValueOnce(
    new Promise(resolve => {
      resolveRoutine = resolve;
    }),
  );
  ReactTestRenderer.act(() => {
    active.refresh();
  });
  expect(active.refreshing).toBe(true);
  expect(active.isLoading).toBe(false);
  expect(active.routine?.routineName).toBe('Fuerza');
  await ReactTestRenderer.act(async () => {
    resolveRoutine({ ...routine, routineName: 'Hipertrofia' });
  });
  expect(active.routine?.routineName).toBe('Hipertrofia');
  expect(active.refreshing).toBe(false);
});

test('loads the requested workout session', async () => {
  service.getWorkoutSession.mockResolvedValue(session);
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<SessionHarness />);
  });
  expect(service.getWorkoutSession).toHaveBeenCalledWith('s1');
  expect(workout.session).toEqual(session);
  expect(workout.isLoading).toBe(false);
});

test('exposes a safe error for a failed session request', async () => {
  service.getWorkoutSession.mockRejectedValue(new Error('backend detail'));
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<SessionHarness />);
  });
  expect(workout.error).toBe('No pudimos cargar la sesión');
  expect(workout.session).toBeUndefined();
});
