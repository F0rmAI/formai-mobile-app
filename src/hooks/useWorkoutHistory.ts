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
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
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
  const [totalElements, setTotalElements] = useState(0);
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
        setTotalElements(result.totalElements);
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
      setSessions([]);
      return true;
    }
    if (!validDate(from) || !validDate(to) || from > to) {
      setError(
        'Ingresa dos fechas válidas en formato aaaa-mm-dd. La fecha inicial debe ser anterior a la final.',
      );
      return false;
    }
    setRange({ from, to });
    setSessions([]);
    return true;
  }, [from, to]);
  const clearFilter = useCallback(() => {
    setFrom('');
    setTo('');
    setSessions([]);
    setRange({});
  }, []);
  return {
    from,
    to,
    setFrom,
    setTo,
    /** Inclusive start date of the applied filter. */
    appliedFrom: range.from,
    /** Inclusive end date of the applied filter. */
    appliedTo: range.to,
    sessions,
    totalElements,
    isFiltered: Boolean(range.from && range.to),
    isLoading,
    error,
    applyFilter,
    clearFilter,
    retry: () => load(0),
    loadMore: () => load(page + 1),
    hasMore: page + 1 < totalPages,
  };
}
