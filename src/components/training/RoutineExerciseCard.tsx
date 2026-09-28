import { Image, View } from 'react-native';
import { Badge, Card, SectionLabel, Text } from '@/components/ui';
import { exerciseImageSource, trainingUiFallbacks } from '@/config/training-ui';
import type { ExercisePrescription } from '@/types/training';

export function RoutineExerciseCard({
  exercise,
}: {
  exercise: ExercisePrescription;
}) {
  return (
    <Card className="gap-md p-xl">
      <View className="flex-row items-start gap-md">
        <View className="min-w-0 flex-1 gap-xs">
          <SectionLabel label="Por realizar" tone="neutral" />
          <Text variant="title">{exercise.exerciseName}</Text>
          <Text variant="body-m" tone="secondary" numberOfLines={1}>
            {exercise.description ?? trainingUiFallbacks.exercise.description}
          </Text>
        </View>
        <Image
          source={exerciseImageSource(exercise.imageUrl)}
          accessibilityLabel={`Ejercicio ${exercise.exerciseName}`}
          className="size-12 rounded-md bg-surface-container"
          resizeMode="cover"
        />
      </View>
      <View className="min-w-0 gap-sm">
        <View className="flex-row flex-wrap gap-sm">
          <Badge label={`${exercise.sets} series`} />
          <Badge label={`${exercise.reps} reps`} tone="neutral" />
          <Badge label={`${exercise.targetLoadKg} kg`} tone="neutral" />
          {exercise.restSeconds && (
            <View className="w-full">
              <Badge
                label={`${exercise.restSeconds} s descanso`}
                tone="neutral"
                icon="timer"
              />
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}
