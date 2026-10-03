/**
 * Progress dashboard helpers derived from workout session DTOs.
 *
 * @author Christian
 * @packageDocumentation
 */

import type {
  ProgressExerciseOption,
  ProgressWeeks,
  WorkoutSession,
  WorkoutStatus,
} from '@/types/training';

/** Formats a local `Date` as `yyyy-MM-dd`. */
export function toIsoDate(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
}

/**
 * Inclusive ISO date range for a progress window ending today.
 *
 * @param weeks - Window length in weeks.
 * @param today - Anchor date; defaults to the local calendar day.
 */
export function progressWindowRange(weeks: ProgressWeeks, today = new Date()) {
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const start = new Date(end);
  start.setDate(start.getDate() - weeks * 7);
  return { from: toIsoDate(start), to: toIsoDate(end) };
}

/**
 * Formats volume for dashboard stats (Spanish decimal comma, `k` above 999).
 *
 * @param kg - Total kilograms.
 */
export function formatVolumeKg(kg: number) {
  if (kg >= 1000) {
    const value = (kg / 1000).toLocaleString('es-PE', {
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
    });
    return `${value}k kg`;
  }
  return `${kg.toLocaleString('es-PE')} kg`;
}

/**
 * Minutes between the earliest recorded set and `finishedAt`, when both exist.
 *
 * @param session - Workout session DTO.
 * @returns Whole minutes, or `undefined` when duration cannot be derived.
 */
export function sessionDurationMinutes(session: WorkoutSession) {
  if (!session.finishedAt) {
    return undefined;
  }
  const starts = session.exercises.flatMap(exercise =>
    exercise.sets.map(set => Date.parse(set.recordedAt)),
  );
  if (starts.length === 0) {
    return undefined;
  }
  const start = Math.min(...starts);
  const end = Date.parse(session.finishedAt);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    return undefined;
  }
  return Math.max(1, Math.round((end - start) / 60_000));
}

/** Count of exercises that have at least one recorded set. */
export function recordedExerciseCount(session: WorkoutSession) {
  return session.exercises.filter(exercise => exercise.sets.length > 0).length;
}

/**
 * Aggregates session count, volume and adherence for a progress window.
 *
 * Adherence uses completed sessions over completed, partial and skipped ones.
 */
export function aggregateProgressStats(sessions: WorkoutSession[]) {
  const counted = sessions.filter(session => session.status !== 'PENDING');
  const completed = counted.filter(
    session => session.status === 'COMPLETED',
  ).length;
  const volumeKg = sessions.reduce(
    (sum, session) => sum + Number(session.totalVolumeKg || 0),
    0,
  );
  const adherencePercentage =
    counted.length === 0
      ? 0
      : Math.round((completed / counted.length) * 1000) / 10;
  return {
    sessionCount: sessions.length,
    volumeKg,
    completedCount: completed,
    scheduledCount: counted.length,
    adherencePercentage,
  };
}

/** Unique exercises that already have recorded sets, in first-seen order. */
export function exercisesWithRecords(
  sessions: WorkoutSession[],
): ProgressExerciseOption[] {
  const seen = new Map<string, string>();
  for (const session of sessions) {
    for (const exercise of session.exercises) {
      if (exercise.sets.length > 0 && !seen.has(exercise.exerciseId)) {
        seen.set(exercise.exerciseId, exercise.exerciseName);
      }
    }
  }
  return [...seen.entries()].map(([exerciseId, exerciseName]) => ({
    exerciseId,
    exerciseName,
  }));
}

/** Badge tone helpers for workout status labels. */
export function statusLabel(status: WorkoutStatus) {
  switch (status) {
    case 'COMPLETED':
      return 'Completada';
    case 'PARTIAL':
      return 'Parcial';
    case 'SKIPPED':
      return 'Omitida';
    default:
      return 'Pendiente';
  }
}
