/**
 * Tests for the workout session resource contract.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { apiClient } from '@/services/api-client';
import { workoutSessionService } from '@/services/workout-session.service';

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

const input = { exerciseId: 'exercise-1', setNumber: 1, loadKg: 25, reps: 10 };

test('records, corrects and finishes a partial workout at dedicated endpoints', async () => {
  post.mockResolvedValue({ id: 'session-1', status: 'PARTIAL' });
  await workoutSessionService.recordSet('session-1', input);
  await workoutSessionService.correctSet('session-1', input);
  await workoutSessionService.finishSession('session-1', true);
  expect(post.mock.calls).toEqual([
    ['/workout-sessions/session-1/sets', input],
    ['/workout-sessions/session-1/corrections', input],
    ['/workout-sessions/session-1/completions', { confirmPartial: true }],
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
  await workoutSessionService.listWorkoutSessions(
    1,
    '2026-09-01',
    '2026-09-30',
  );
  expect(get).toHaveBeenCalledWith(
    '/workout-sessions?page=1&size=20&from=2026-09-01&to=2026-09-30',
  );
});
