/**
 * Prescribed exercise card.
 *
 * @author Melina
 * @packageDocumentation
 */

import { View } from 'react-native';
import { Badge, Card, Text } from '@/components/ui';
import type { ExercisePrescription } from '@/types/training';

/** Shows the prescribed sets, repetitions, load and rest. */
export function RoutineExerciseCard({
  exercise,
}: {
  exercise: ExercisePrescription;
}) {
  return (
    <Card className="gap-md">
      <Text variant="title">{exercise.exerciseName}</Text>
      <View className="flex-row flex-wrap gap-sm">
        <Badge label={`${exercise.sets} series`} />
        <Badge label={`${exercise.reps} reps`} tone="neutral" />
        <Badge label={`${exercise.targetLoadKg} kg`} tone="neutral" />
        <Badge label={`${exercise.restSeconds} s de descanso`} tone="neutral" />
      </View>
    </Card>
  );
}
