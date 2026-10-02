import { useCallback, useEffect, useMemo, useState } from 'react';
import { trainingService } from '@/services/training.service';
import type {
  ActiveRoutine,
  RecordSetInput,
  TrainingSummary,
  WorkoutSession,
} from '@/types/training';

function messageOf(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Ocurrió un error inesperado. Inténtalo nuevamente.';
}

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
      if (activeRoutine) {
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
    finishSession,
  };
}
