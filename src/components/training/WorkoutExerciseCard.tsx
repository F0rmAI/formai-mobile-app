/**
 * Editable workout exercise.
 *
 * @author Melina
 * @packageDocumentation
 */

import { useState } from 'react';
import { View } from 'react-native';
import { Badge, Button, Card, Text } from '@/components/ui';
import type { RecordSetInput, WorkoutExercise } from '@/types/training';
import { SetEditor } from './SetEditor';

interface WorkoutExerciseCardProps {
  /** Exercise from the workout resource. */ exercise: WorkoutExercise;
  /** Whether a request is in progress. */ saving: boolean;
  /** Disables editing for finished sessions. */ readOnly?: boolean;
  /** Records a missing set. */ onRecordSet: (
    input: RecordSetInput,
  ) => Promise<boolean>;
  /** Corrects an existing set. */ onCorrectSet: (
    input: RecordSetInput,
  ) => Promise<boolean>;
}

/** Shows recorded sets and offers recording or correction while pending. */
export function WorkoutExerciseCard({
  exercise,
  saving,
  readOnly = false,
  onRecordSet,
  onCorrectSet,
}: WorkoutExerciseCardProps) {
  const [editing, setEditing] = useState<number>();
  const nextSetNumber = Array.from(
    { length: exercise.targetSets },
    (_, index) => index + 1,
  ).find(number => !exercise.sets.some(set => set.setNumber === number));
  const selectedSet = exercise.sets.find(set => set.setNumber === editing);
  return (
    <Card className="gap-md">
      <Text variant="title">{exercise.exerciseName}</Text>
      <View className="flex-row flex-wrap gap-sm">
        <Badge label={`${exercise.targetSets} series`} />
        <Badge label={`${exercise.targetReps} reps`} tone="neutral" />
        <Badge label={`${exercise.targetLoadKg} kg`} tone="neutral" />
      </View>
      {exercise.sets.map(set => (
        <View
          key={set.setNumber}
          className="flex-row items-center justify-between gap-sm rounded-md bg-surface-container-low p-md"
        >
          <Text variant="body-m">
            Serie {set.setNumber}: {set.loadKg} kg · {set.reps} reps
          </Text>
          {!readOnly && (
            <Button
              label="Corregir"
              size="sm"
              variant="ghost"
              onPress={() => setEditing(set.setNumber)}
            />
          )}
        </View>
      ))}
      {selectedSet && !readOnly && (
        <SetEditor
          exercise={exercise}
          setNumber={selectedSet.setNumber}
          initialLoad={selectedSet.loadKg}
          initialReps={selectedSet.reps}
          saving={saving}
          onSave={async input => {
            const saved = await onCorrectSet(input);
            if (saved) setEditing(undefined);
            return saved;
          }}
        />
      )}
      {nextSetNumber !== undefined &&
        (readOnly ? (
          <Text variant="body-m" tone="secondary">
            {exercise.targetSets - exercise.sets.length} series sin registrar
          </Text>
        ) : (
          <SetEditor
            exercise={exercise}
            setNumber={nextSetNumber}
            saving={saving}
            onSave={onRecordSet}
          />
        ))}
    </Card>
  );
}
