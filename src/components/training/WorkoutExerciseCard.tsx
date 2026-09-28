import { Image, View } from 'react-native';
import { Badge, Card, Icon, SectionLabel, Text } from '@/components/ui';
import { exerciseImageSource, trainingUiFallbacks } from '@/config/training-ui';
import type { RecordSetInput, WorkoutExercise } from '@/types/training';
import { SetEditor } from './SetEditor';

interface WorkoutExerciseCardProps {
  exercise: WorkoutExercise;
  saving: boolean;
  readOnly?: boolean;
  isCurrent?: boolean;
  onRecordSet: (input: RecordSetInput) => Promise<boolean>;
}

export function WorkoutExerciseCard({
  exercise,
  saving,
  readOnly = false,
  isCurrent = false,
  onRecordSet,
}: WorkoutExerciseCardProps) {
  const nextSetNumber = Array.from(
    { length: exercise.targetSets },
    (_, index) => index + 1,
  ).find(setNumber =>
    exercise.sets.every(recordedSet => recordedSet.setNumber !== setNumber),
  );
  const isComplete = nextSetNumber === undefined;

  return (
    <Card className="gap-md p-xl">
      {isComplete ? (
        <SectionLabel label="Completado" icon="check_circle" />
      ) : isCurrent ? (
        <SectionLabel label="Ejercicio actual" />
      ) : null}
      <View className="flex-row items-start gap-md">
        <View className="min-w-0 flex-1 gap-sm">
          <Text variant="title">{exercise.exerciseName}</Text>
          <Text variant="body-m" tone="secondary">
            {exercise.description ?? trainingUiFallbacks.exercise.description}
          </Text>
        </View>
        <Image
          accessibilityLabel={`Ejercicio ${exercise.exerciseName}`}
          source={exerciseImageSource(exercise.imageUrl)}
          className="size-14 rounded-md bg-surface-container"
          resizeMode="cover"
        />
      </View>

      <View className="flex-row flex-wrap gap-sm">
        <Badge label={`${exercise.targetSets} series`} tone="primary" />
        <Badge label={`${exercise.targetReps} reps`} tone="neutral" />
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

      {exercise.sets.length > 0 && (
        <View className="gap-xs">
          {exercise.sets.map(set => (
            <View
              key={set.setNumber}
              className="h-12 flex-row items-center rounded-md bg-surface-container-low px-md"
            >
              <View className="size-7 items-center justify-center rounded-full bg-primary-container">
                <Text variant="label-m-bold" tone="primary">
                  {set.setNumber}
                </Text>
              </View>
              <Text variant="label-m-bold" className="ml-md">
                Serie {set.setNumber}
              </Text>
              <Text variant="body-m" tone="secondary" className="ml-sm flex-1">
                {set.loadKg} kg · {set.reps} reps
              </Text>
              <Icon name="check_circle" size={16} className="text-primary" />
              <Text variant="label-m-bold" tone="primary" className="ml-xs">
                Done
              </Text>
              <Icon
                name="edit"
                size={16}
                className="ml-md text-content-secondary"
              />
            </View>
          ))}
        </View>
      )}

      {isComplete ? null : readOnly ? (
        <Badge
          label={`${
            exercise.targetSets - exercise.sets.length
          } series no registradas`}
          tone="neutral"
          icon="remove_circle"
          className="self-stretch justify-center py-sm"
        />
      ) : (
        <SetEditor
          exercise={exercise}
          setNumber={nextSetNumber!}
          saving={saving}
          onSave={onRecordSet}
        />
      )}
    </Card>
  );
}
