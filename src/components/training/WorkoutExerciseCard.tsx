/**
 * Presentational exercise card for the current workout.
 *
 * @author Melina
 * @packageDocumentation
 */

import { useState } from 'react';
import { View } from 'react-native';
import { SetSummaryTile } from '@/components/progress';
import { Card, Icon, IconButton, Text } from '@/components/ui';
import type { RecordSetInput, WorkoutExercise } from '@/types/training';
import { CorrectionSheet } from './CorrectionSheet';
import { SetEditor } from './SetEditor';

/** Props accepted by {@link WorkoutExerciseCard}. */
export interface WorkoutExerciseCardProps {
  /** Exercise from the workout resource. */
  exercise: WorkoutExercise;
  /** Rest seconds from the loaded active routine, when available. */
  restSeconds?: number;
  /** Whether this is the first exercise with pending sets. */
  current: boolean;
  /** Whether a request is in progress. */
  saving: boolean;
  /** Disables editing for finished sessions. */
  readOnly?: boolean;
  /** Records a missing set. */
  onRecordSet: (input: RecordSetInput) => Promise<boolean>;
  /** Corrects an existing set. */
  onCorrectSet: (input: RecordSetInput) => Promise<boolean>;
}

/** Shows completed, current and pending series in prescription order. */
export function WorkoutExerciseCard({
  exercise,
  restSeconds,
  current,
  saving,
  readOnly = false,
  onRecordSet,
  onCorrectSet,
}: WorkoutExerciseCardProps) {
  const [editing, setEditing] = useState<number>();
  const selectedSet = exercise.sets.find(set => set.setNumber === editing);
  const done = exercise.sets.length >= exercise.targetSets;
  const nextSetNumber = Array.from(
    { length: exercise.targetSets },
    (_, index) => index + 1,
  ).find(number => !exercise.sets.some(set => set.setNumber === number));
  const status = done
    ? 'Completado'
    : current
    ? 'Ejercicio actual'
    : 'Siguiente';
  const statusIcon = done
    ? 'check_circle'
    : current
    ? undefined
    : 'hourglass_empty';
  const meta = [
    ['repeat', `${exercise.targetSets} series`],
    ['sell', `${exercise.targetReps} reps`],
    ['open_in_full', `${exercise.targetLoadKg} kg`],
    ...(restSeconds === undefined
      ? []
      : [['timer', `${restSeconds} s descanso`]]),
  ];

  return (
    <Card className="gap-md">
      <View className="flex-row items-center gap-xs">
        {statusIcon && (
          <Icon name={statusIcon} size={16} className="text-primary" />
        )}
        <Text variant="label-m" tone="secondary">
          {status}
        </Text>
      </View>
      <Text variant="title">{exercise.exerciseName}</Text>
      <View className="flex-row flex-wrap gap-md">
        {meta.map(([icon, label]) => (
          <View key={icon} className="flex-row items-center gap-xs">
            <Icon name={icon} size={16} className="text-content-muted" />
            <Text variant="body-m" tone="secondary">
              {label}
            </Text>
          </View>
        ))}
      </View>
      {done ? (
        <View className="flex-row flex-wrap gap-sm">
          {exercise.sets.map(set => (
            <SetSummaryTile
              key={set.setNumber}
              setNumber={set.setNumber}
              loadKg={set.loadKg}
              reps={set.reps}
            />
          ))}
        </View>
      ) : (
        Array.from(
          { length: exercise.targetSets },
          (_, index) => index + 1,
        ).map(number => {
          const recorded = exercise.sets.find(set => set.setNumber === number);
          if (recorded) {
            return (
              <View
                key={number}
                className="flex-row items-center gap-sm rounded-md bg-surface-container-low p-md"
              >
                <Text variant="label-m-bold" className="w-6">
                  {number}
                </Text>
                <Text
                  variant="body-m"
                  className="flex-1"
                >{`${recorded.loadKg} kg × ${recorded.reps} reps`}</Text>
                <Icon name="check_circle" size={16} className="text-tertiary" />
                {!readOnly && (
                  <IconButton
                    icon="edit"
                    label={`Corregir serie ${number}`}
                    onPress={() => setEditing(number)}
                  />
                )}
              </View>
            );
          }
          if (current && !readOnly && number === nextSetNumber) {
            return (
              <SetEditor
                key={number}
                exercise={exercise}
                setNumber={number}
                saving={saving}
                onSave={onRecordSet}
              />
            );
          }
          return (
            <View
              key={number}
              className="flex-row items-center gap-sm rounded-md bg-surface-container-low p-md"
            >
              <Text variant="label-m-bold" className="w-6">
                {number}
              </Text>
              <Text variant="body-m" tone="secondary">
                {`Pendiente · ${exercise.targetLoadKg} kg × ${exercise.targetReps} reps`}
              </Text>
            </View>
          );
        })
      )}
      {selectedSet && !readOnly && (
        <CorrectionSheet
          key={selectedSet.setNumber}
          exercise={exercise}
          set={selectedSet}
          saving={saving}
          onSave={async input => {
            const saved = await onCorrectSet(input);
            if (saved) setEditing(undefined);
            return saved;
          }}
          onCancel={() => setEditing(undefined)}
        />
      )}
    </Card>
  );
}
