/**
 * Local workout reminder prefs and scheduling.
 *
 * @author Christian
 * @packageDocumentation
 */

import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useActiveRoutine } from '@/hooks/useActiveRoutine';
import { reminderNotificationsService } from '@/services/reminder-notifications.service';
import { reminderPrefsService } from '@/services/reminder-prefs.service';
import { workoutSessionService } from '@/services/workout-session.service';
import {
  DEFAULT_REMINDER_PREFS,
  type ReminderPrefs,
  type ReminderPreviewContent,
} from '@/types/reminders';
import type { WorkoutStatus } from '@/types/training';
import {
  buildReminderCopy,
  formatReminderSubtitle,
  formatReminderTimeLabel,
  reminderBadgeLabel,
  resolveRoutineDayForDate,
} from '@/utils/reminders';

/**
 * Loads reminder prefs, syncs local notifications and exposes Profile summary.
 *
 * Prefs are re-read whenever the hosting screen gains focus so Profile reflects
 * changes made on RemindersScreen.
 *
 * @returns Prefs, summary labels, preview content and mutation actions.
 *
 * @example
 * ```tsx
 * const { enabled, setEnabled, summarySubtitle } = useReminders();
 * ```
 */
export function useReminders() {
  const { routine } = useActiveRoutine();
  const [prefs, setPrefs] = useState<ReminderPrefs>({
    ...DEFAULT_REMINDER_PREFS,
  });
  const [todayStatus, setTodayStatus] = useState<WorkoutStatus>();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  const sync = useCallback(
    async (next: ReminderPrefs, status?: WorkoutStatus) => {
      await reminderNotificationsService.syncSchedule({
        prefs: next,
        routine,
        todayStatus: status ?? todayStatus,
      });
    },
    [routine, todayStatus],
  );

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const loaded = await reminderPrefsService.load();
        if (cancelled) {
          return;
        }
        setPrefs(loaded);
        setIsReady(true);
      })();
      return () => {
        cancelled = true;
      };
    }, []),
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!routine?.todayWorkoutSessionId) {
        setTodayStatus(undefined);
        return;
      }
      try {
        const session = await workoutSessionService.getWorkoutSession(
          routine.todayWorkoutSessionId,
        );
        if (!cancelled) {
          setTodayStatus(session.status);
        }
      } catch {
        if (!cancelled) {
          setTodayStatus(undefined);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [routine?.todayWorkoutSessionId]);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    sync(prefs).catch(() => undefined);
  }, [isReady, prefs, routine, todayStatus, sync]);

  const persist = useCallback(
    async (next: ReminderPrefs) => {
      setIsSaving(true);
      setError(undefined);
      try {
        await reminderPrefsService.save(next);
        setPrefs(next);
        await sync(next);
      } catch {
        setError('No pudimos guardar tus recordatorios. Inténtalo de nuevo.');
      } finally {
        setIsSaving(false);
      }
    },
    [sync],
  );

  const setEnabled = useCallback(
    async (enabled: boolean) => {
      setError(undefined);
      if (enabled) {
        if (!reminderNotificationsService.isAvailable()) {
          setError(
            'Las notificaciones locales no están disponibles en este build. Recompila la app nativa.',
          );
          return;
        }
        const allowed = await reminderNotificationsService.requestPermission();
        if (!allowed) {
          setError(
            'Necesitamos permiso de notificaciones para recordarte tus sesiones.',
          );
          return;
        }
      }
      await persist({ ...prefs, enabled });
    },
    [persist, prefs],
  );

  const setTime = useCallback(
    async (hour: number, minute: number) => {
      await persist({ ...prefs, hour, minute });
    },
    [persist, prefs],
  );

  const previewContent = useMemo<ReminderPreviewContent>(() => {
    const day = routine
      ? resolveRoutineDayForDate(
          routine.sessions,
          routine.trainingDays,
          new Date(),
          routine.todaySessionOrder,
        )
      : undefined;
    return buildReminderCopy(day ?? routine?.sessions[0]);
  }, [routine]);

  const summarySubtitle = useMemo(
    () => formatReminderSubtitle(prefs, routine?.trainingDays ?? []),
    [prefs, routine?.trainingDays],
  );

  return {
    prefs,
    enabled: prefs.enabled,
    hour: prefs.hour,
    minute: prefs.minute,
    timeLabel: formatReminderTimeLabel(prefs.hour, prefs.minute),
    summarySubtitle,
    summaryBadge: reminderBadgeLabel(prefs.enabled),
    previewContent,
    isReady,
    isSaving,
    error,
    setEnabled,
    setTime,
    clearError: () => setError(undefined),
  };
}
