/**
 * Progress tab dashboard: period stats, exercise chips and charts.
 *
 * @author Christian
 * @packageDocumentation
 */

import { useCallback, useEffect, useState } from 'react';
import { progressChartService } from '@/services/progress-chart.service';
import { workoutSessionService } from '@/services/workout-session.service';
import type {
  ProgressChart,
  ProgressExerciseOption,
  ProgressWeeks,
  WorkoutSession,
} from '@/types/training';
import {
  aggregateProgressStats,
  exercisesWithRecords,
  progressWindowRange,
  toIsoDate,
} from '@/utils/progress';

const WEEK_OPTIONS: { label: string; value: `${ProgressWeeks}` }[] = [
  { label: '4 semanas', value: '4' },
  { label: '8 semanas', value: '8' },
  { label: '12 semanas', value: '12' },
];

/** Loads every page of workout history for a date range. */
async function loadAllSessions(from: string, to: string) {
  const first = await workoutSessionService.listWorkoutSessions(0, from, to);
  const sessions = [...first.content];
  for (let page = 1; page < first.totalPages; page += 1) {
    const next = await workoutSessionService.listWorkoutSessions(
      page,
      from,
      to,
    );
    sessions.push(...next.content);
  }
  return sessions;
}

/**
 * Owns the progress dashboard period, derived stats and exercise chart.
 *
 * @returns Weeks control, stats, exercise chips, chart state and reload action.
 *
 * @example
 * ```tsx
 * const dashboard = useProgressDashboard();
 * ```
 */
export function useProgressDashboard() {
  const [weeks, setWeeks] = useState<ProgressWeeks>(4);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [exercises, setExercises] = useState<ProgressExerciseOption[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>();
  const [chart, setChart] = useState<ProgressChart>();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [error, setError] = useState<string>();

  const loadSessions = useCallback(async (nextWeeks: ProgressWeeks) => {
    setIsLoading(true);
    setError(undefined);
    try {
      const { from, to } = progressWindowRange(nextWeeks);
      const loaded = await loadAllSessions(from, to);
      const options = exercisesWithRecords(loaded);
      setSessions(loaded);
      setExercises(options);
      setSelectedExerciseId(current => {
        if (current && options.some(option => option.exerciseId === current)) {
          return current;
        }
        return options[0]?.exerciseId;
      });
    } catch {
      setSessions([]);
      setExercises([]);
      setSelectedExerciseId(undefined);
      setChart(undefined);
      setError('No pudimos cargar tu progreso. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions(weeks);
  }, [weeks, loadSessions]);

  const refresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    setError(undefined);
    try {
      const { from, to } = progressWindowRange(weeks);
      const loaded = await loadAllSessions(from, to);
      const options = exercisesWithRecords(loaded);
      const nextExerciseId =
        selectedExerciseId &&
        options.some(option => option.exerciseId === selectedExerciseId)
          ? selectedExerciseId
          : options[0]?.exerciseId;
      setSessions(loaded);
      setExercises(options);
      setSelectedExerciseId(nextExerciseId);
      if (!nextExerciseId) {
        setChart(undefined);
      } else if (nextExerciseId === selectedExerciseId) {
        try {
          setChart(await progressChartService.getMine(nextExerciseId, weeks));
        } catch {
          setError('No pudimos cargar la evolución del ejercicio.');
        }
      }
    } catch {
      setError('No pudimos cargar tu progreso. Inténtalo de nuevo.');
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, selectedExerciseId, weeks]);

  useEffect(() => {
    if (!selectedExerciseId) {
      setChart(undefined);
      return;
    }
    let active = true;
    setIsChartLoading(true);
    setChart(undefined);
    progressChartService
      .getMine(selectedExerciseId, weeks)
      .then(result => {
        if (active) {
          setChart(result);
        }
      })
      .catch(() => {
        if (active) {
          setChart(undefined);
          setError('No pudimos cargar la evolución del ejercicio.');
        }
      })
      .finally(() => {
        if (active) {
          setIsChartLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [selectedExerciseId, weeks]);

  const stats = aggregateProgressStats(sessions);
  const selectedExercise = exercises.find(
    exercise => exercise.exerciseId === selectedExerciseId,
  );
  const recordedLoads = sessions.flatMap(item =>
    item.exercises
      .filter(exercise => exercise.exerciseId === selectedExerciseId)
      .flatMap(exercise => exercise.sets.map(set => Number(set.loadKg))),
  );
  const maxLoadKg = chart?.points.length
    ? Math.max(...chart.points.map(point => Number(point.maxLoadKg)))
    : recordedLoads.length
    ? Math.max(...recordedLoads)
    : undefined;
  const maxLoadDeltaKg =
    chart && chart.points.length >= 2
      ? Number(chart.points[chart.points.length - 1].maxLoadKg) -
        Number(chart.points[0].maxLoadKg)
      : undefined;
  const today = new Date();
  const weekdayOffset = (today.getDay() + 6) % 7;
  const weeklyStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - weekdayOffset,
  );
  const previousStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - weekdayOffset - 7,
  );
  const thisWeek = sessions.filter(
    item => item.scheduledFor >= toIsoDate(weeklyStart),
  );
  const previousWeek = sessions.filter(
    item =>
      item.scheduledFor >= toIsoDate(previousStart) &&
      item.scheduledFor < toIsoDate(weeklyStart),
  );
  const weeklyVolumeKg = thisWeek.reduce(
    (sum, item) => sum + Number(item.totalVolumeKg || 0),
    0,
  );
  const previousVolumeKg = previousWeek.reduce(
    (sum, item) => sum + Number(item.totalVolumeKg || 0),
    0,
  );
  const weeklyVolumeDeltaPercent =
    previousVolumeKg > 0
      ? Math.round(
          ((weeklyVolumeKg - previousVolumeKg) / previousVolumeKg) * 100,
        )
      : undefined;

  const setWeeksFromSegment = useCallback((value: `${ProgressWeeks}`) => {
    setWeeks(Number(value) as ProgressWeeks);
  }, []);

  return {
    weeks,
    weekOptions: WEEK_OPTIONS,
    weeksValue: String(weeks) as `${ProgressWeeks}`,
    setWeeks: setWeeksFromSegment,
    sessions,
    previewSessions: sessions.slice(0, 4),
    exercises,
    selectedExerciseId,
    selectedExercise,
    selectExercise: setSelectedExerciseId,
    chart,
    stats,
    maxLoadKg,
    maxLoadDeltaKg,
    weeklyVolumeKg,
    weeklyVolumeDeltaPercent,
    isLoading,
    refreshing,
    isChartLoading,
    error,
    retry: () => loadSessions(weeks),
    refresh,
  };
}
