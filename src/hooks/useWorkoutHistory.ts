/**
 * Paginated workout history and date filter.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useCallback, useEffect, useState } from 'react';
import { workoutSessionService } from '@/services/workout-session.service';
import type { WorkoutSession } from '@/types/training';

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
function validDate(value: string) {
  if (!datePattern.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

/**
 * Loads workout history with a validated date range and incremental pages.
 *
 * @returns The filter values, sessions, `isLoading`, display-ready `error` and actions.
 *
 * @example
 * ```tsx
 * const { sessions, isLoading, applyFilter, loadMore } = useWorkoutHistory();
 * ```
 */
export function useWorkoutHistory() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [range, setRange] = useState<{ from?: string; to?: string }>({});
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [page, setPage] = useState(-1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const load = useCallback(
    async (nextPage: number) => {
      setIsLoading(true);
      setError(undefined);
      try {
        const result = await workoutSessionService.listWorkoutSessions(
          nextPage,
          range.from,
          range.to,
        );
        setSessions(current =>
          nextPage === 0 ? result.content : [...current, ...result.content],
        );
        setPage(result.page);
        setTotalPages(result.totalPages);
      } catch {
        setError('No pudimos cargar tu historial. Inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    },
    [range],
  );
  useEffect(() => {
    load(0);
  }, [load]);
  const applyFilter = useCallback(() => {
    if (!from && !to) {
      setRange({});
      return true;
    }
    if (!validDate(from) || !validDate(to) || from > to) {
      setError(
        'Ingresa dos fechas válidas en formato yyyy-MM-dd. La fecha inicial debe ser anterior a la final.',
      );
      return false;
    }
    setRange({ from, to });
    return true;
  }, [from, to]);
  return {
    from,
    to,
    setFrom,
    setTo,
    sessions,
    isLoading,
    error,
    applyFilter,
    retry: () => load(0),
    loadMore: () => load(page + 1),
    hasMore: page + 1 < totalPages,
  };
}
