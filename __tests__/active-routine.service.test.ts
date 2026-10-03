/**
 * Tests for the active routine resource contract.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { ApiError, apiClient } from '@/services/api-client';
import { activeRoutineService } from '@/services/active-routine.service';

jest.mock('@/services/api-client', () => {
  const actual = jest.requireActual('@/services/api-client');
  return { ...actual, apiClient: { get: jest.fn(), post: jest.fn() } };
});

const get = apiClient.get as jest.Mock;
const post = apiClient.post as jest.Mock;

beforeEach(() => {
  get.mockReset();
  post.mockReset();
});

test('returns null for an unassigned routine', async () => {
  get.mockRejectedValue(new ApiError(404, 'not found'));
  await expect(activeRoutineService.getActiveRoutine()).resolves.toBeNull();
  expect(get).toHaveBeenCalledWith('/active-routines/me');
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
  await expect(activeRoutineService.getActiveRoutine()).resolves.toEqual(
    routine,
  );
});
