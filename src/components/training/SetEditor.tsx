import { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { Badge, Button, IconButton, Text } from '@/components/ui';
import type { RecordSetInput, WorkoutExercise } from '@/types/training';
import { cn } from '@/utils/cn';

interface StepperFieldProps {
  label: string;
  value: string;
  suffix: string;
  step: number;
  error?: string;
  onChange: (value: string) => void;
}

function StepperField({
  label,
  value,
  suffix,
  step,
  error,
  onChange,
}: StepperFieldProps) {
  const changeBy = (delta: number) => {
    const numericValue = Number(value.replace(',', '.')) || 0;
    onChange(String(Math.max(0, Math.round((numericValue + delta) * 10) / 10)));
  };

  return (
    <View
      className={cn(
        'min-w-0 flex-1 gap-sm rounded-md bg-surface-card px-md py-xl',
        error && 'border border-error',
      )}
    >
      <Text variant="overline" tone="secondary" className="text-center">
        {label}
      </Text>
      <View className="flex-row items-center gap-xs">
        <IconButton
          icon="remove"
          label={`Disminuir ${label.toLowerCase()}`}
          onPress={() => changeBy(-step)}
        />
        <View className="min-w-0 flex-1 flex-row items-baseline justify-center gap-2xs">
          <TextInput
            accessibilityLabel={label}
            keyboardType="decimal-pad"
            value={value}
            maxLength={5}
            onChangeText={onChange}
            selectTextOnFocus
            className="w-10 p-0 text-right font-sans-extrabold text-headline text-content-primary"
          />
          <Text variant="caption" tone="secondary" numberOfLines={1}>
            {suffix}
          </Text>
        </View>
        <IconButton
          icon="add"
          label={`Aumentar ${label.toLowerCase()}`}
          onPress={() => changeBy(step)}
        />
      </View>
      {error && (
        <Text variant="caption" tone="error" accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  );
}

interface SetEditorProps {
  exercise: WorkoutExercise;
  setNumber: number;
  saving: boolean;
  onSave: (input: RecordSetInput) => Promise<boolean>;
}

export function SetEditor({
  exercise,
  setNumber,
  saving,
  onSave,
}: SetEditorProps) {
  const [load, setLoad] = useState(String(exercise.targetLoadKg));
  const [reps, setReps] = useState(String(exercise.targetReps));
  const [validation, setValidation] = useState<{
    field: 'load' | 'reps';
    message: string;
  }>();

  useEffect(() => {
    setLoad(String(exercise.targetLoadKg));
    setReps(String(exercise.targetReps));
    setValidation(undefined);
  }, [
    exercise.exerciseId,
    exercise.targetLoadKg,
    exercise.targetReps,
    setNumber,
  ]);

  const save = async () => {
    const parsedLoad = Number(load.replace(',', '.'));
    const parsedReps = Number(reps.replace(',', '.'));
    if (!Number.isFinite(parsedLoad) || parsedLoad < 0) {
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
        <Badge label="En curso" tone="secondary" />
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
        label="Registrar serie"
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
