/**
 * Training resource requests.
 *
 * @author Melina
 * @packageDocumentation
 */

import { ApiError, apiClient } from '@/services/api-client';
import { trainingService } from '@/services/training.service';

jest.mock('@/services/api-client', () => {
  const actual = jest.requireActual('@/services/api-client');
  return { ...actual, apiClient: { get: jest.fn(), post: jest.fn() } };
});

const get = apiClient.get as jest.Mock;
const post = apiClient.post as jest.Mock;
const input = { exerciseId: 'exercise-1', setNumber: 1, loadKg: 25, reps: 10 };

beforeEach(() => {
  get.mockReset();
  post.mockReset();
});

test('returns null for an unassigned routine', async () => {
  get.mockRejectedValue(new ApiError(404, 'not found'));
  await expect(trainingService.getActiveRoutine()).resolves.toBeNull();
  expect(get).toHaveBeenCalledWith('/v1/active-routines/me');
});

test('preserves a rest day with nullable today fields', async () => {
  const routine = {
    routineId: 'routine-1',
    routineName: 'Fuerza',
    trainingDays: ['MONDAY'],
    todaySessionOrder: null,
    todayWorkoutSessionId: null,
    sessions: [],
  };
  get.mockResolvedValue(routine);
  await expect(trainingService.getActiveRoutine()).resolves.toEqual(routine);
});

test('records, corrects and finishes a partial workout at dedicated endpoints', async () => {
  post.mockResolvedValue({ id: 'session-1', status: 'PARTIAL' });
  await trainingService.recordSet('session-1', input);
  await trainingService.correctSet('session-1', input);
  await trainingService.finishSession('session-1', true);
  expect(post.mock.calls).toEqual([
    ['/v1/workout-sessions/session-1/sets', input],
    ['/v1/workout-sessions/session-1/corrections', input],
    ['/v1/workout-sessions/session-1/completions', { confirmPartial: true }],
  ]);
});

test('requests paginated filtered workout history', async () => {
  get.mockResolvedValue({
    content: [],
    page: 1,
    size: 20,
    totalElements: 0,
    totalPages: 2,
  });
  await trainingService.listWorkoutSessions(1, '2026-09-01', '2026-09-30');
  expect(get).toHaveBeenCalledWith(
    '/v1/workout-sessions?page=1&size=20&from=2026-09-01&to=2026-09-30',
  );
});
