/**
 * Active routine loader for routine and profile screens.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useEffect, useState } from 'react';
import { activeRoutineService } from '@/services/active-routine.service';
import type { ActiveRoutine } from '@/types/training';

/**
 * Loads the current routine without requesting today's workout.
 *
 * @param errorMessage - Screen-specific message shown when loading fails.
 * @returns The `routine`, `isLoading`, display-ready `error` and `retry` action.
 *
 * @example
 * ```tsx
 * const { routine, isLoading, error, retry } = useActiveRoutine();
 * ```
 */
export function useActiveRoutine(errorMessage = 'No pudimos cargar tu rutina') {
  const [routine, setRoutine] = useState<ActiveRoutine | null>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const retry = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      setRoutine(await activeRoutineService.getActiveRoutine());
    } catch {
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [errorMessage]);
  useEffect(() => {
    retry();
  }, [retry]);
  return { routine, isLoading, error, retry };
}
