import { ApiError, apiClient } from './api-client';
import type {
  ActiveRoutine,
  RecordSetInput,
  TrainingService,
  WorkoutSession,
} from '@/types/training';

export const trainingApiService: TrainingService = {
  async getActiveRoutine() {
    try {
      return await apiClient.get<ActiveRoutine>('/v1/active-routines/me');
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null;
      }
      throw error;
    }
  },
  getWorkoutSession: sessionId =>
    apiClient.get<WorkoutSession>(`/v1/workout-sessions/${sessionId}`),
  recordSet: (sessionId: string, input: RecordSetInput) =>
    apiClient.post<WorkoutSession>(
      `/v1/workout-sessions/${sessionId}/sets`,
      input,
    ),
  finishSession: (sessionId: string, confirmPartial: boolean) =>
    apiClient.post<WorkoutSession>(
      `/v1/workout-sessions/${sessionId}/completions`,
      { confirmPartial },
    ),
};
