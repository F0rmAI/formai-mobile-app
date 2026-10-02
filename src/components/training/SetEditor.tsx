/**
 * Editable set recording form.
 *
 * @author Melina
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Badge, Button, Text } from '@/components/ui';
import type { RecordSetInput, WorkoutExercise } from '@/types/training';
import { StepperField } from './StepperField';

/** Props accepted by the set editor. */
interface SetEditorProps {
  /** Exercise whose set is being edited. */
  exercise: WorkoutExercise;
  /** One-based number of the set. */
  setNumber: number;
  /** Disables submission while the request is in progress. */
  saving: boolean;
  /** Previously recorded load in kilograms. */
  initialLoad?: number;
  /** Previously recorded repetition count. */
  initialReps?: number;
  /** Saves the entered values and reports whether the request succeeded. */
  onSave: (input: RecordSetInput) => Promise<boolean>;
}

/** Edits a prescribed or recorded set with numeric validation. */
export function SetEditor({
  exercise,
  setNumber,
  saving,
  initialLoad,
  initialReps,
  onSave,
}: SetEditorProps) {
  const [load, setLoad] = useState(
    String(initialLoad ?? exercise.targetLoadKg),
  );
  const [reps, setReps] = useState(String(initialReps ?? exercise.targetReps));
  const [validation, setValidation] = useState<{
    field: 'load' | 'reps';
    message: string;
  }>();

  useEffect(() => {
    setLoad(String(initialLoad ?? exercise.targetLoadKg));
    setReps(String(initialReps ?? exercise.targetReps));
    setValidation(undefined);
  }, [
    exercise.exerciseId,
    exercise.targetLoadKg,
    exercise.targetReps,
    initialLoad,
    initialReps,
    setNumber,
  ]);

  const save = async () => {
    const parsedLoad = Number(load.replace(',', '.'));
    const parsedReps = Number(reps.replace(',', '.'));
    if (!load.trim() || !Number.isFinite(parsedLoad) || parsedLoad < 0) {
      setValidation({ field: 'load', message: 'Ingresa un peso válido.' });
      return;
    }
    if (!Number.isInteger(parsedReps) || parsedReps <= 0) {
      setValidation({
        field: 'reps',
        message: 'Ingresa repeticiones válidas.',
      });
      return;
    }
    setValidation(undefined);
    await onSave({
      exerciseId: exercise.exerciseId,
      setNumber,
      loadKg: parsedLoad,
      reps: parsedReps,
    });
  };

  return (
    <View className="gap-md rounded-md bg-surface-container-low p-3">
      <View className="flex-row items-center justify-between">
        <Text variant="label-l">Serie {setNumber}</Text>
        <Badge
          label={initialLoad !== undefined ? 'Corrigiendo' : 'En curso'}
          tone="secondary"
        />
      </View>
      <View className="flex-row gap-md">
        <StepperField
          label="Peso"
          value={load}
          suffix="kg"
          step={0.5}
          onChange={setLoad}
          error={validation?.field === 'load' ? validation.message : undefined}
        />
        <StepperField
          label="Repeticiones"
          value={reps}
          suffix="reps"
          step={1}
          onChange={setReps}
          error={validation?.field === 'reps' ? validation.message : undefined}
        />
      </View>
      <Button
        label={
          initialLoad !== undefined ? 'Guardar corrección' : 'Registrar serie'
        }
        icon="check"
        size="md"
        variant="accent"
        fullWidth
        loading={saving}
        onPress={() => {
          save();
        }}
      />
    </View>
  );
}
