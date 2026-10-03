/**
 * Overlay for correcting a recorded workout set.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Modal, Pressable, View } from 'react-native';
import { Button, Text } from '@/components/ui';
import type {
  RecordSetInput,
  WorkoutExercise,
  WorkoutSet,
} from '@/types/training';
import { formatTime } from '@/utils/dates';
import { SetEditor } from './SetEditor';

/** Props accepted by {@link CorrectionSheet}. */
export interface CorrectionSheetProps {
  /** Exercise whose recorded set is being corrected. */
  exercise: WorkoutExercise;
  /** Previously recorded set. */
  set: WorkoutSet;
  /** Whether the correction request is running. */
  saving: boolean;
  /** Saves the corrected values. */
  onSave: (input: RecordSetInput) => Promise<boolean>;
  /** Dismisses the overlay. */
  onCancel: () => void;
}

/** Shows the correction form above the workout as a bottom sheet. */
export function CorrectionSheet({
  exercise,
  set,
  saving,
  onSave,
  onCancel,
}: CorrectionSheetProps) {
  return (
    <Modal visible transparent animationType="slide" onRequestClose={onCancel}>
      <View className="flex-1 justify-end bg-surface-inverse/40">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancelar corrección"
          className="absolute inset-0"
          onPress={onCancel}
        />
        <View
          accessibilityViewIsModal
          className="gap-lg rounded-t-lg bg-surface-card px-xl pb-2xl pt-xl shadow-floating"
        >
          <View className="gap-xs">
            <Text
              variant="headline"
              accessibilityRole="header"
            >{`Corregir serie ${set.setNumber}`}</Text>
            <Text variant="body-m" tone="secondary">
              {`${exercise.exerciseName} · registrada hoy a las ${formatTime(
                new Date(set.recordedAt),
              )}`}
            </Text>
          </View>
          <SetEditor
            exercise={exercise}
            setNumber={set.setNumber}
            initialLoad={set.loadKg}
            initialReps={set.reps}
            saving={saving}
            onSave={onSave}
          />
          <Button
            label="Cancelar"
            variant="ghost"
            fullWidth
            onPress={onCancel}
          />
        </View>
      </View>
    </Modal>
  );
}
