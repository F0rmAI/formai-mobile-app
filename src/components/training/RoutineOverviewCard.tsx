/**
 * Today's routine overview card.
 *
 * @author Melina
 * @packageDocumentation
 */

import { View } from 'react-native';
import { Button, Card, ProgressBar, SectionLabel, Text } from '@/components/ui';
import type { ActiveRoutine, WorkoutSession } from '@/types/training';

interface RoutineOverviewCardProps {
  /** Current routine assigned to the client. */
  routine: ActiveRoutine;
  /** Today's workout session. */
  session: WorkoutSession;
  /** Number of sets already recorded. */
  completedSets: number;
  /** Number of sets prescribed for the session. */
  targetSets: number;
  /** Opens the full routine. */
  onViewRoutine: () => void;
}

/**
 * Shows today's prescribed workout and reports requests to open the full routine.
 */
export function RoutineOverviewCard({
  routine,
  session,
  completedSets,
  targetSets,
  onViewRoutine,
}: RoutineOverviewCardProps) {
  const progress = targetSets === 0 ? 0 : (completedSets / targetSets) * 100;

  return (
    <Card className="gap-xl p-xl">
      <SectionLabel
        label="Sesión de hoy"
        tone="secondary"
        icon="fitness_center"
      />
      <View className="gap-xs">
        <Text variant="title-strong">{session.dayLabel}</Text>
        <Text variant="body-m" tone="secondary" numberOfLines={1}>
          {session.exercises.length} ejercicios · {targetSets} series · Rutina{' '}
          {routine.routineName}
        </Text>
      </View>
      <View className="gap-sm">
        <View className="flex-row justify-between">
          <Text variant="label-m" tone="secondary">
            Progreso de la sesión
          </Text>
          <Text variant="label-m-bold">
            {completedSets} de {targetSets} series
          </Text>
        </View>
        <ProgressBar value={progress} label="Progreso de la sesión" />
      </View>
      <Button
        testID="view-routine-button"
        label="Ver mi rutina"
        icon="event_note"
        variant="ghost"
        size="md"
        className="h-9"
        onPress={onViewRoutine}
      />
    </Card>
  );
}
