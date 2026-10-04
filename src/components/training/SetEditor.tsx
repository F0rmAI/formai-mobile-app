/**
 * Editable set recording form.
 *
 * @author Melina
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Badge, Button, Icon, StepperField, Text } from '@/components/ui';
import type { RecordSetInput, WorkoutExercise } from '@/types/training';

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
        message: 'Ingresa las repeticiones realizadas con un número válido.',
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
    <View className="gap-md rounded-md bg-surface-container-low p-md">
      <View className="flex-row items-center justify-between">
        <Text variant="label-l">Serie {setNumber}</Text>
        {initialLoad === undefined && (
          <Badge label="En curso" tone="secondary" />
        )}
      </View>
      <View className="flex-row gap-md">
        <StepperField
          label="Carga"
          value={load}
          suffix="kg"
          step={0.5}
          hint={`${initialLoad === undefined ? 'Objetivo' : 'Antes'}: ${
            initialLoad ?? exercise.targetLoadKg
          } kg`}
          onChange={setLoad}
        />
        <StepperField
          label="Repeticiones"
          value={reps}
          suffix="reps"
          step={1}
          hint={`${initialReps === undefined ? 'Objetivo' : 'Antes'}: ${
            initialReps ?? exercise.targetReps
          } reps`}
          onChange={setReps}
        />
      </View>
      {validation && (
        <View className="flex-row items-center gap-xs">
          <Icon name="error" size={16} className="text-error" />
          <Text variant="body-m" tone="error" accessibilityRole="alert">
            {validation.message}
          </Text>
        </View>
      )}
      <Button
        label={
          initialLoad !== undefined
            ? 'Guardar corrección'
            : `Registrar serie ${setNumber}`
        }
        icon={initialLoad !== undefined ? 'save' : 'check'}
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
