/**
 * Workout session detail loader.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useEffect, useState } from 'react';
import { trainingService } from '@/services/training.service';
import type { WorkoutSession } from '@/types/training';

/** Loads a session by its backend identifier. */
export function useWorkoutSession(id: string) {
  const [session, setSession] = useState<WorkoutSession>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const retry = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setSession(await trainingService.getWorkoutSession(id));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    retry();
  }, [retry]);
  return { session, loading, error, retry };
}
