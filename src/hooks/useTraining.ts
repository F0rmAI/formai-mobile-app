/**
 * useTraining module.
 *
 * @author Melina
 * @packageDocumentation
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiError } from '@/services/api-client';
import { trainingService } from '@/services/training.service';
import type {
  ActiveRoutine,
  RecordSetInput,
  TrainingSummary,
  WorkoutSession,
} from '@/types/training';

/** Maps backend failures to safe Spanish messages. */
function messageOf(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 422)
      return 'Revisa el peso y las repeticiones e inténtalo de nuevo.';
    if (error.status === 409)
      return 'La sesión ya terminó o esta acción no está disponible. Actualiza la pantalla.';
    if (error.status === 404)
      return 'No encontramos esta sesión. Actualiza la pantalla.';
  }
  return 'No pudimos completar la solicitud. Revisa tu conexión e inténtalo de nuevo.';
}

/** Loads today's routine and handles workout actions. */
export function useTraining() {
  const [routine, setRoutine] = useState<ActiveRoutine | null>();
  const [session, setSession] = useState<WorkoutSession>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  const load = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const activeRoutine = await trainingService.getActiveRoutine();
      setRoutine(activeRoutine);
      if (activeRoutine?.todayWorkoutSessionId) {
        setSession(
          await trainingService.getWorkoutSession(
            activeRoutine.todayWorkoutSessionId,
          ),
        );
      } else {
        setSession(undefined);
      }
    } catch (loadError) {
      setError(messageOf(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const recordSet = useCallback(
    async (input: RecordSetInput) => {
      if (!session) {
        return false;
      }
      if (
        !Number.isFinite(input.loadKg) ||
        input.loadKg < 0 ||
        !Number.isInteger(input.reps) ||
        input.reps < 1
      ) {
        setError('Ingresa un peso válido y al menos una repetición.');
        return false;
      }
      setSaving(true);
      setError(undefined);
      try {
        setSession(await trainingService.recordSet(session.id, input));
        return true;
      } catch (saveError) {
        setError(messageOf(saveError));
        return false;
      } finally {
        setSaving(false);
      }
    },
    [session],
  );

  const correctSet = useCallback(
    async (input: RecordSetInput) => {
      if (!session || session.status !== 'PENDING') return false;
      if (
        !Number.isFinite(input.loadKg) ||
        input.loadKg < 0 ||
        !Number.isInteger(input.reps) ||
        input.reps < 1
      ) {
        setError('Ingresa un peso válido y al menos una repetición.');
        return false;
      }
      setSaving(true);
      setError(undefined);
      try {
        setSession(await trainingService.correctSet(session.id, input));
        return true;
      } catch (saveError) {
        setError(messageOf(saveError));
        return false;
      } finally {
        setSaving(false);
      }
    },
    [session],
  );

  const finishSession = useCallback(
    async (confirmPartial: boolean) => {
      if (!session) {
        return undefined;
      }
      setSaving(true);
      setError(undefined);
      try {
        const completed = await trainingService.finishSession(
          session.id,
          confirmPartial,
        );
        setSession(completed);
        return completed;
      } catch (saveError) {
        setError(messageOf(saveError));
        return undefined;
      } finally {
        setSaving(false);
      }
    },
    [session],
  );

  const summary = useMemo<TrainingSummary | undefined>(() => {
    if (!session) {
      return undefined;
    }
    const completedSets = session.exercises.reduce(
      (total, exercise) => total + exercise.sets.length,
      0,
    );
    const targetSets = session.exercises.reduce(
      (total, exercise) => total + exercise.targetSets,
      0,
    );
    return {
      session,
      completedSets,
      targetSets,
      isPartial: completedSets < targetSets,
    };
  }, [session]);

  return {
    routine,
    session,
    summary,
    loading,
    saving,
    error,
    retry: load,
    recordSet,
    correctSet,
    finishSession,
  };
}
