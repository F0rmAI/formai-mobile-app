/**
 * Prescribed exercise card.
 *
 * @author Melina
 * @packageDocumentation
 */

import { View } from 'react-native';
import { Card, Icon, Text } from '@/components/ui';
import type { ExercisePrescription } from '@/types/training';

/** Props accepted by {@link RoutineExerciseCard}. */
interface RoutineExerciseCardProps {
  /** Exercise prescribed for a routine day. */
  exercise: ExercisePrescription;
  /** Dated outcome of the latest workout for this routine day. */
  lastResult?: string;
}

/** Shows the prescribed sets, repetitions, load and rest. */
export function RoutineExerciseCard({
  exercise,
  lastResult,
}: RoutineExerciseCardProps) {
  return (
    <Card className="gap-md">
      <Text variant="label-m" tone="secondary">
        {lastResult ?? 'Por realizar'}
      </Text>
      <Text variant="title">{exercise.exerciseName}</Text>
      <View className="flex-row flex-wrap gap-sm">
        {(
          [
            ['repeat', `${exercise.sets} series`],
            ['sell', `${exercise.reps} reps`],
            ['open_in_full', `${exercise.targetLoadKg} kg`],
            ['timer', `${exercise.restSeconds} s descanso`],
          ] as const
        ).map(([icon, label]) => (
          <View key={icon} className="flex-row items-center gap-xs">
            <Icon name={icon} size={16} className="text-content-muted" />
            <Text variant="body-m" tone="secondary">
              {label}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}
