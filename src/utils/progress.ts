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
 * Formats kilograms with full grouped digits for progress and history cards.
 *
 * @param kg - Total kilograms.
 */
export function formatVolumeKg(kg: number) {
  return `${kg.toLocaleString('es-PE').replace(/,/g, ' ')} kg`;
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
    partialCount: counted.filter(session => session.status === 'PARTIAL')
      .length,
    skippedCount: counted.filter(session => session.status === 'SKIPPED')
      .length,
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

/** Formats the outcome badge using the recorded portion of a partial session. */
export function workoutStatusLabel(session: WorkoutSession) {
  if (session.status !== 'PARTIAL') return statusLabel(session.status);
  const target = session.exercises.reduce(
    (sum, exercise) => sum + exercise.targetSets,
    0,
  );
  const recorded = session.exercises.reduce(
    (sum, exercise) => sum + exercise.sets.length,
    0,
  );
  return target > 0
    ? `Parcial (${Math.round((recorded / target) * 100)} %)`
    : 'Parcial';
}
