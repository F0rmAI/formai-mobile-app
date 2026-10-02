import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  RoutineOverviewCard,
  TrainingShell,
  WorkoutExerciseCard,
} from '@/components/training';
import { Button, Dialog, Text, Toast } from '@/components/ui';
import type {
  ActiveRoutine,
  RecordSetInput,
  TrainingSummary,
  WorkoutSession,
} from '@/types/training';
import { formatTrainingDate } from '@/utils/training-formatters';
import { trainingScreenStyles } from './styles';

interface TodayScreenProps {
  routine: ActiveRoutine;
  session: WorkoutSession;
  summary: TrainingSummary;
  saving: boolean;
  error?: string;
  onRecordSet: (input: RecordSetInput) => Promise<boolean>;
  onFinish: (confirmPartial: boolean) => Promise<boolean>;
  onViewRoutine: () => void;
  onShowSummary: () => void;
}

export function TodayScreen({
  routine,
  session,
  summary,
  saving,
  error,
  onRecordSet,
  onFinish,
  onViewRoutine,
  onShowSummary,
}: TodayScreenProps) {
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>();
  const isFinished = session.status === 'COMPLETED';
  const currentExerciseId = session.exercises.find(
    exercise => exercise.sets.length < exercise.targetSets,
  )?.exerciseId;
  const missingExerciseCount = session.exercises.filter(
    exercise => exercise.sets.length < exercise.targetSets,
  ).length;

  useEffect(() => {
    if (!successMessage) {
      return undefined;
    }
    const timeout = setTimeout(() => setSuccessMessage(undefined), 2500);
    return () => clearTimeout(timeout);
  }, [successMessage]);

  const recordSet = async (input: RecordSetInput) => {
    const saved = await onRecordSet(input);
    if (saved) {
      setSuccessMessage(`Serie ${input.setNumber} registrada correctamente.`);
    }
    return saved;
  };

  const finish = async (confirmPartial: boolean) => {
    const finished = await onFinish(confirmPartial);
    if (finished) {
      setShowFinishDialog(false);
      onShowSummary();
    }
  };

  const requestFinish = () => {
    if (isFinished) {
      onShowSummary();
      return;
    }
    if (summary.isPartial) {
      setShowFinishDialog(true);
    } else {
      finish(false);
    }
  };

  return (
    <TrainingShell subtitle="Entrenamiento de hoy" onTodayPress={() => {}}>
      <ScrollView
        testID="today-screen"
        className="flex-1"
        contentContainerStyle={trainingScreenStyles.scrollContent}
      >
        <View className="gap-lg py-lg">
          <View className="gap-xs">
            <Text variant="headline">Hola, Diego</Text>
            <Text variant="body-l" tone="secondary">
              {formatTrainingDate(session.scheduledFor)}
            </Text>
          </View>

          {error && <Toast message={error} tone="error" />}

          <RoutineOverviewCard
            routine={routine}
            session={session}
            completedSets={summary.completedSets}
            targetSets={summary.targetSets}
            onViewRoutine={onViewRoutine}
          />

          {session.exercises.map(exercise => (
            <WorkoutExerciseCard
              key={exercise.exerciseId}
              exercise={exercise}
              saving={saving}
              readOnly={isFinished}
              isCurrent={exercise.exerciseId === currentExerciseId}
              onRecordSet={recordSet}
            />
          ))}

          <Button
            testID="finish-session-button"
            label={isFinished ? 'Ver resumen' : 'Finalizar entrenamiento'}
            icon={isFinished ? 'insights' : 'flag'}
            variant={isFinished ? 'primary' : 'secondary'}
            fullWidth
            loading={saving}
            onPress={requestFinish}
          />
        </View>
      </ScrollView>

      {successMessage && (
        <View
          pointerEvents="none"
          className="absolute inset-x-xl bottom-xl z-10"
        >
          <Toast message={successMessage} tone="success" />
        </View>
      )}

      <Dialog
        open={showFinishDialog}
        title="¿Finalizar la sesión?"
        description={`Tienes ${
          summary.targetSets - summary.completedSets
        } series sin registrar en ${missingExerciseCount} ejercicios. La sesión se guardará como parcial.`}
        icon="flag"
        confirmLabel="Finalizar"
        cancelLabel="Seguir entrenando"
        confirmLoading={saving}
        onConfirm={() => {
          finish(true);
        }}
        onCancel={() => setShowFinishDialog(false)}
      />
    </TrainingShell>
  );
}
