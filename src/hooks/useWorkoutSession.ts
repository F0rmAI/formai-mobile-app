/**
 * Workout session detail loader.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useEffect, useState } from 'react';
import { workoutSessionService } from '@/services/workout-session.service';
import type { WorkoutSession } from '@/types/training';

/**
 * Loads a workout session by its backend identifier.
 *
 * @param id - Identifier of the session to load.
 * @param errorMessage - Screen-specific message shown when loading fails.
 * @returns The `session`, `isLoading`, display-ready `error` and `retry` action.
 *
 * @example
 * ```tsx
 * const { session, isLoading, error, retry } = useWorkoutSession(sessionId);
 * ```
 */
export function useWorkoutSession(
  id: string,
  errorMessage = 'No pudimos cargar la sesión',
) {
  const [session, setSession] = useState<WorkoutSession>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const retry = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      setSession(await workoutSessionService.getWorkoutSession(id));
    } catch {
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [id, errorMessage]);
  useEffect(() => {
    retry();
  }, [retry]);
  return { session, isLoading, error, retry };
}
