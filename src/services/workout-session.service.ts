/**
 * Workout session resource for recording and reviewing training.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { apiClient } from './api-client';
import type {
  RecordSetInput,
  WorkoutPage,
  WorkoutSession,
} from '@/types/training';

/** Calls the workout session endpoints of the backend. */
export const workoutSessionService = {
  /**
   * Fetches one workout session.
   *
   * @param id - Backend identifier of the workout session.
   * @returns The session with exercises and recorded sets.
   * @throws {@link ApiError} when the session cannot be loaded.
   */
  getWorkoutSession: (id: string) =>
    apiClient.get<WorkoutSession>(`/workout-sessions/${id}`),
  /**
   * Lists a page of workout history.
   *
   * @param page - Zero-based page number.
   * @param from - Inclusive first calendar date, when filtering.
   * @param to - Inclusive last calendar date, when filtering.
   * @returns A page of sessions in backend order.
   * @throws {@link ApiError} when history cannot be loaded.
   */
  listWorkoutSessions: (page: number, from?: string, to?: string) => {
    const query = `page=${page}&size=20${
      from && to ? `&from=${from}&to=${to}` : ''
    }`;
    return apiClient.get<WorkoutPage>(`/workout-sessions?${query}`);
  },
  /**
   * Records a new set in a pending workout.
   *
   * @param id - Backend identifier of the workout session.
   * @param input - Exercise, set number, load and repetition count.
   * @returns The updated session.
   * @throws {@link ApiError} when the set cannot be recorded.
   */
  recordSet: (id: string, input: RecordSetInput) =>
    apiClient.post<WorkoutSession>(`/workout-sessions/${id}/sets`, input),
  /**
   * Corrects an already recorded set.
   *
   * @param id - Backend identifier of the workout session.
   * @param input - Exercise, set number and corrected measurements.
   * @returns The updated session.
   * @throws {@link ApiError} when correction is unavailable.
   */
  correctSet: (id: string, input: RecordSetInput) =>
    apiClient.post<WorkoutSession>(
      `/workout-sessions/${id}/corrections`,
      input,
    ),
  /**
   * Completes a workout session or confirms a partial result.
   *
   * @param id - Backend identifier of the workout session.
   * @param confirmPartial - Whether the client accepts missing prescribed sets.
   * @returns The completed or partial session.
   * @throws {@link ApiError} when completion is rejected.
   */
  finishSession: (id: string, confirmPartial: boolean) =>
    apiClient.post<WorkoutSession>(`/workout-sessions/${id}/completions`, {
      confirmPartial,
    }),
};
