/**
 * Active routine resource for the signed-in client.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { ApiError, apiClient } from './api-client';
import type { ActiveRoutine } from '@/types/training';

/** Calls the active routine endpoint of the backend. */
export const activeRoutineService = {
  /**
   * Fetches the client's active routine.
   *
   * @returns The active routine, or `null` when none is assigned.
   * @throws {@link ApiError} for failures other than an unassigned routine.
   */
  async getActiveRoutine(): Promise<ActiveRoutine | null> {
    try {
      return await apiClient.get<ActiveRoutine>('/active-routines/me');
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },
};
