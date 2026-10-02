/**
 * Training API resources.
 *
 * @author Melina
 * @packageDocumentation
 */

import { ApiError, apiClient } from './api-client';
import type {
  ActiveRoutine,
  RecordSetInput,
  WorkoutPage,
  WorkoutSession,
} from '@/types/training';

/** Calls the active routine and workout session resources. */
export const trainingService = {
  /** Returns null when no routine is assigned. */
  async getActiveRoutine(): Promise<ActiveRoutine | null> {
    try {
      return await apiClient.get<ActiveRoutine>('/v1/active-routines/me');
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },
  /** Loads one workout session. */
  getWorkoutSession: (id: string) =>
    apiClient.get<WorkoutSession>(`/v1/workout-sessions/${id}`),
  /** Lists workout history. */
  listWorkoutSessions: (page: number, from?: string, to?: string) => {
    const query = `page=${page}&size=20${
      from && to ? `&from=${from}&to=${to}` : ''
    }`;
    return apiClient.get<WorkoutPage>(`/v1/workout-sessions?${query}`);
  },
  /** Records a new set. */
  recordSet: (id: string, input: RecordSetInput) =>
    apiClient.post<WorkoutSession>(`/v1/workout-sessions/${id}/sets`, input),
  /** Replaces an already recorded set. */
  correctSet: (id: string, input: RecordSetInput) =>
    apiClient.post<WorkoutSession>(
      `/v1/workout-sessions/${id}/corrections`,
      input,
    ),
  /** Finishes a session. */
  finishSession: (id: string, confirmPartial: boolean) =>
    apiClient.post<WorkoutSession>(`/v1/workout-sessions/${id}/completions`, {
      confirmPartial,
    }),
};
