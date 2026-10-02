/**
 * Active routine loader for routine and profile screens.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useEffect, useState } from 'react';
import { trainingService } from '@/services/training.service';
import type { ActiveRoutine } from '@/types/training';

/** Loads the current routine without requesting today's workout. */
export function useActiveRoutine() {
  const [routine, setRoutine] = useState<ActiveRoutine | null>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const retry = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setRoutine(await trainingService.getActiveRoutine());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    retry();
  }, [retry]);
  return { routine, loading, error, retry };
}
